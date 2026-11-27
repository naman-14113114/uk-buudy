import { NextResponse, type NextRequest } from "next/server";
import {
  lookupOrderTracking,
  VERIFIED_BUUDY_ORDERS,
  type TrackingData,
} from "@/lib/order-tracking";
import {
  EXCLUDED_ORDER_IDS,
  fetchSentBuudyEvents,
  getSpacemailCredentials,
  sendSpacemailLifecycleEmail,
  verifyBearerToken,
  type LifecycleMilestone,
} from "@/lib/spacemail-lifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface CandidateOrder {
  orderId: string;
  email: string;
  customerName: string;
  paidAtMs: number;
  orderDate: string;
  destination: string;
}

const DELIVERED_SYNC_FLOOR_MS = Date.parse("2026-11-26T00:00:00Z");

async function fetchOpenOrdersFromBuudyCom(
  secret: string,
): Promise<CandidateOrder[]> {
  if (!secret) return [];
  try {
    const res = await fetch("https://buudy.com/api/lifecycle/open-orders", {
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      orders?: Array<{
        id?: string;
        email?: string;
        customerName?: string;
        paidAt?: string;
        destination?: string;
      }>;
    };
    const out: CandidateOrder[] = [];
    for (const row of data.orders || []) {
      const orderId = String(row.id || "").trim();
      const email = String(row.email || "").trim().toLowerCase();
      const paidAtMs = row.paidAt ? Date.parse(row.paidAt) : 0;
      if (!orderId || !email || EXCLUDED_ORDER_IDS.has(orderId)) continue;
      out.push({
        orderId,
        email,
        customerName: String(row.customerName || "").trim(),
        paidAtMs: Number.isFinite(paidAtMs) ? paidAtMs : 0,
        orderDate: row.paidAt ? row.paidAt.slice(0, 10) : "",
        destination: String(row.destination || "United Kingdom").trim(),
      });
    }
    return out;
  } catch {
    return [];
  }
}

function fallbackVerifiedCandidates(): CandidateOrder[] {
  const cutoffMs = Date.parse("2026-11-18T00:00:00Z");
  const seen = new Set<string>();
  const out: CandidateOrder[] = [];
  for (const row of VERIFIED_BUUDY_ORDERS) {
    const orderId = (row.paymentId || row.orderId || "").trim();
    const email = String(row.email || "").trim().toLowerCase();
    if (!orderId || !email || seen.has(orderId) || EXCLUDED_ORDER_IDS.has(orderId)) {
      continue;
    }
    const ms = Date.parse(row.crtTime.replace(" ", "T") + "Z");
    if (!Number.isFinite(ms) || ms < cutoffMs) continue;
    seen.add(orderId);
    out.push({
      orderId,
      email,
      customerName: row.name,
      paidAtMs: ms,
      orderDate: row.crtTime.slice(0, 10),
      destination: [row.city, row.postcode].filter(Boolean).join(", ") || "United Kingdom",
    });
  }
  return out;
}

function parseTrackingEventMs(rawDate: string | undefined): number {
  if (!rawDate) return 0;
  const isoMatch = rawDate.match(/\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?/);
  if (isoMatch) {
    const parsed = Date.parse(isoMatch[0].replace(" ", "T") + (isoMatch[0].length > 10 ? "Z" : "T12:00:00Z"));
    if (Number.isFinite(parsed)) return parsed;
  }
  const parsed = Date.parse(rawDate);
  return Number.isFinite(parsed) ? parsed : 0;
}

function determineMilestone(
  order: CandidateOrder,
  tracking: TrackingData | null,
  sentEvents: Set<string>,
  nowMs: number,
): LifecycleMilestone | null {
  if (!tracking || !tracking.found) return null;
  const latest = tracking.timeline[0];

  if (tracking.statusCode === "DELIVERED") {
    if (sentEvents.has(`${order.orderId}:delivered`)) return null;
    const deliveredMs = Math.max(
      parseTrackingEventMs(latest?.date),
      parseTrackingEventMs(tracking.estimatedDelivery),
    );
    // Only send automated Delivered notices for recent Nov 26+ deliveries to avoid retroactive spam
    if (deliveredMs > 0 && deliveredMs < DELIVERED_SYNC_FLOOR_MS) {
      return null;
    }
    if (deliveredMs === 0 && order.paidAtMs < Date.parse("2026-11-21T00:00:00Z")) {
      return null;
    }
    return "delivered";
  }

  if (tracking.statusCode === "OUT_FOR_DELIVERY") {
    if (sentEvents.has(`${order.orderId}:out_for_delivery`)) return null;
    return "out_for_delivery";
  }

  const realBarcode =
    tracking.trackingNumber &&
    !/pending|assigned at packaging/i.test(tracking.trackingNumber);
  const hasRealCarrierScan = tracking.timeline.some(
    (ev) =>
      ev.stage === "IN_TRANSIT" &&
      !/shipment information received|information received|label created|electronic information|order confirmed|optical calibration/i.test(
        ev.title,
      ),
  );

  if (
    tracking.statusCode === "IN_TRANSIT" &&
    realBarcode &&
    hasRealCarrierScan
  ) {
    if (sentEvents.has(`${order.orderId}:dispatched`)) return null;
    const alreadyCaughtUp = Array.from(sentEvents).some(
      (k) =>
        k === `${order.orderId}:catchup_uk_depot` ||
        k === `${order.orderId}:catchup_intl_transit`,
    );
    if (alreadyCaughtUp) return null;
    return "dispatched";
  }

  if (tracking.statusCode === "PROCESSING" && order.paidAtMs > 0) {
    const ageHours = (nowMs - order.paidAtMs) / 3_600_000;
    if (ageHours >= 72) {
      const hasAnyProgressNotice =
        sentEvents.has(`${order.orderId}:delayed_checkin`) ||
        sentEvents.has(`${order.orderId}:dispatched`) ||
        sentEvents.has(`${order.orderId}:delivered`) ||
        Array.from(sentEvents).some((k) => k.startsWith(`${order.orderId}:catchup_`));
      if (!hasAnyProgressNotice) return "delayed_checkin";
    }
  }

  return null;
}

async function handleCron(request: NextRequest) {
  if (
    !verifyBearerToken(request.headers.get("authorization"), [
      process.env.CRON_SECRET,
      process.env.WHOP_LIFECYCLE_WEBHOOK_SECRET,
      process.env.LIFECYCLE_EMAIL_SECRET,
    ])
  ) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!getSpacemailCredentials()) {
    return NextResponse.json(
      { ok: false, error: "Spacemail credentials not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get("dryRun") === "1";
  const rawLimit = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(18, Math.floor(rawLimit)))
    : 10;

  const lifecycleSecret =
    (process.env.WHOP_LIFECYCLE_WEBHOOK_SECRET || "").trim() ||
    (process.env.LIFECYCLE_EMAIL_SECRET || "").trim();

  const remoteCandidates = await fetchOpenOrdersFromBuudyCom(lifecycleSecret);
  const localCandidates = fallbackVerifiedCandidates();
  const mergedMap = new Map<string, CandidateOrder>();
  for (const row of localCandidates) mergedMap.set(row.orderId, row);
  for (const row of remoteCandidates) mergedMap.set(row.orderId, row);

  const candidates = Array.from(mergedMap.values()).sort(
    (a, b) => b.paidAtMs - a.paidAtMs,
  );

  let sentEvents = new Set<string>();
  try {
    sentEvents = await fetchSentBuudyEvents();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: `Unable to read IMAP Sent dedup log: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 502 },
    );
  }

  // Fast pre-filter before any network tracking call:
  // 1) Skip orders that already received a :delivered notification
  // 2) Skip already-delivered verified ledger orders from before Nov 25
  // 3) Cap window to last 30 days & at most 60 recent active orders so cron always completes < 15s
  const verifiedStatusById = new Map<string, { status: number; statusStr: string; crtTime: string; hasTracking: boolean }>();
  for (const v of VERIFIED_BUUDY_ORDERS) {
    const vid = (v.paymentId || v.orderId || "").trim();
    if (!vid) continue;
    verifiedStatusById.set(vid, {
      status: v.status,
      statusStr: v.statusStr,
      crtTime: v.crtTime,
      hasTracking: Boolean(v.trackingNumber),
    });
  }

  const nowMs = Date.now();
  const maxAgeMs = 30 * 86_400_000;
  const evalList = candidates
    .filter((order) => {
      if (sentEvents.has(`${order.orderId}:delivered`)) return false;
      if (order.paidAtMs > 0 && nowMs - order.paidAtMs > maxAgeMs) return false;
      const v = verifiedStatusById.get(order.orderId);
      if (v && /delivered/i.test(v.statusStr) && v.crtTime < "2026-11-24") {
        return false;
      }
      return true;
    })
    .slice(0, 60);

  const queued: Array<{
    order: CandidateOrder;
    milestone: LifecycleMilestone;
    tracking: TrackingData;
  }> = [];

  const deadlineMs = nowMs + 35_000;
  const concurrency = 10;
  for (let i = 0; i < evalList.length; i += concurrency) {
    if (Date.now() > deadlineMs) break;
    const slice = evalList.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      slice.map(async (order) => {
        const knownVerified = verifiedStatusById.has(order.orderId);
        const tracking = await lookupOrderTracking(order.orderId, {
          skipRelay: knownVerified,
        });
        const milestone = determineMilestone(order, tracking, sentEvents, nowMs);
        return { order, tracking, milestone };
      }),
    );
    for (const item of settled) {
      if (
        item.status === "fulfilled" &&
        item.value.tracking &&
        item.value.milestone
      ) {
        queued.push({
          order: item.value.order,
          milestone: item.value.milestone,
          tracking: item.value.tracking,
        });
      }
    }
  }

  const results = [];
  let sentCount = 0;
  let rateLimited = false;

  for (const item of queued.slice(0, limit)) {
    const latest = item.tracking.timeline[0];
    const res = await sendSpacemailLifecycleEmail(
      {
        orderId: item.order.orderId,
        milestone: item.milestone,
        email: item.order.email,
        customerName: item.order.customerName,
        orderDate: item.order.orderDate,
        trackingNumber: item.tracking.trackingNumber,
        carrier: item.tracking.carrierName,
        latestCheckpoint: latest
          ? `${latest.title}${latest.date ? ` (${latest.date})` : ""}`
          : item.tracking.statusMessage,
        destination: item.tracking.destination || item.order.destination,
        estimatedDelivery: item.tracking.estimatedDelivery,
        dryRun,
      },
      sentEvents,
    );
    results.push({
      orderId: res.orderId,
      milestone: res.milestone,
      email: res.email,
      sent: res.sent,
      alreadySent: res.alreadySent,
      skippedReason: res.skippedReason,
      rateLimited: res.rateLimited,
      error: res.error,
    });
    if (res.sent) sentCount++;
    if (res.rateLimited) {
      rateLimited = true;
      break;
    }
  }

  return NextResponse.json({
    ok: !rateLimited,
    dryRun,
    sourceCounts: {
      remoteWhopOrders: remoteCandidates.length,
      fallbackVerifiedOrders: localCandidates.length,
      evaluatedOrders: evalList.length,
    },
    alreadySentEventsIndexed: sentEvents.size,
    dueCount: queued.length,
    processedCount: results.length,
    sentCount,
    rateLimited,
    results,
  });
}

export async function GET(request: NextRequest) {
  return handleCron(request);
}

export async function POST(request: NextRequest) {
  return handleCron(request);
}
