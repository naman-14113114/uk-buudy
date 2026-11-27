import { NextResponse, type NextRequest } from "next/server";
import {
  getSpacemailCredentials,
  sendSpacemailLifecycleEmail,
  verifyBearerToken,
  type LifecycleEmailInput,
  type LifecycleMilestone,
} from "@/lib/spacemail-lifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const VALID_MILESTONES = new Set<LifecycleMilestone>([
  "confirmed",
  "dispatched",
  "out_for_delivery",
  "delivered",
  "delayed_checkin",
]);

function isAuthorized(request: NextRequest): boolean {
  return verifyBearerToken(request.headers.get("authorization"), [
    process.env.WHOP_LIFECYCLE_WEBHOOK_SECRET,
    process.env.LIFECYCLE_EMAIL_SECRET,
  ]);
}

export async function GET() {
  const hasSecret = Boolean(
    (process.env.WHOP_LIFECYCLE_WEBHOOK_SECRET || "").trim() ||
      (process.env.LIFECYCLE_EMAIL_SECRET || "").trim(),
  );
  return NextResponse.json({
    service: "Buudy Spacemail Order Lifecycle",
    configured: Boolean(getSpacemailCredentials() && hasSecret),
  });
}

export async function POST(request: NextRequest) {
  const hasSecret = Boolean(
    (process.env.WHOP_LIFECYCLE_WEBHOOK_SECRET || "").trim() ||
      (process.env.LIFECYCLE_EMAIL_SECRET || "").trim(),
  );
  if (!hasSecret || !getSpacemailCredentials()) {
    return NextResponse.json(
      {
        ok: false,
        fallbackSuggested: true,
        error: "Lifecycle email service or Spacemail credentials not configured",
      },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid body");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const milestone =
    typeof body.milestone === "string"
      ? (body.milestone.trim() as LifecycleMilestone)
      : null;

  if (!orderId || !email || !milestone || !VALID_MILESTONES.has(milestone)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing or invalid orderId, milestone, or email",
      },
      { status: 400 },
    );
  }

  const input: LifecycleEmailInput = {
    orderId,
    milestone,
    email,
    customerName:
      typeof body.customerName === "string" ? body.customerName : null,
    orderDate: typeof body.orderDate === "string" ? body.orderDate : null,
    paidTotalDisplay:
      typeof body.paidTotalDisplay === "string" ? body.paidTotalDisplay : null,
    shippingAddressLines: Array.isArray(body.shippingAddressLines)
      ? body.shippingAddressLines.filter(
          (v): v is string => typeof v === "string" && v.trim().length > 0,
        )
      : undefined,
    items: Array.isArray(body.items)
      ? body.items
          .filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"))
          .map((x) => ({
            name:
              typeof x.name === "string" && x.name.trim()
                ? x.name.trim()
                : "Buudy LED Mask Bundle",
            quantity: Number(x.quantity) > 0 ? Number(x.quantity) : 1,
          }))
      : undefined,
    trackingNumber:
      typeof body.trackingNumber === "string" ? body.trackingNumber : null,
    carrier: typeof body.carrier === "string" ? body.carrier : null,
    latestCheckpoint:
      typeof body.latestCheckpoint === "string" ? body.latestCheckpoint : null,
    destination: typeof body.destination === "string" ? body.destination : null,
    estimatedDelivery:
      typeof body.estimatedDelivery === "string" ? body.estimatedDelivery : null,
    dryRun: Boolean(body.dryRun),
    forceResend: Boolean(body.forceResend),
  };

  try {
    const result = await sendSpacemailLifecycleEmail(input);
    const status = result.ok
      ? 200
      : result.rateLimited
        ? 429
        : 502;
    return NextResponse.json(result, {
      status,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        fallbackSuggested: true,
        error: err instanceof Error ? err.message : "Failed to send email",
      },
      { status: 500 },
    );
  }
}
