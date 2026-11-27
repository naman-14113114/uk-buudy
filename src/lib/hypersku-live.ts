import type { TrackingData, TrackingStage, TimelineEvent } from "./order-tracking";

interface HyperSkuGoodsItem {
  productId?: number | string | null;
  sku?: string | null;
  productName?: string | null;
  goodsNum?: number | null;
}

interface HyperSkuLogisticsItem {
  trackingNumber?: string | null;
  initialTrackingNumber?: string | null;
  expressDelivery?: string | null;
  status?: number | null;
  updateTime?: string | null;
}

interface HyperSkuOrderAddress {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  thirdCustomerEmail?: string | null;
  postCode?: string | null;
  zipCode?: string | null;
  address?: string | null;
  addressContinued?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  thirdRegionName?: string | null;
  province?: string | null;
  secondRegionName?: string | null;
  country?: string | null;
  countryName?: string | null;
}

interface HyperSkuOrderRow {
  id?: string | number | null;
  orderSn?: string | null;
  thirdName?: string | null;
  status?: number | null;
  statusStr?: string | null;
  crtTime?: string | null;
  edtTime?: string | null;
  goodsList?: HyperSkuGoodsItem[] | null;
  logisticsList?: HyperSkuLogisticsItem[] | null;
  ordersAddress?: HyperSkuOrderAddress | null;
}

interface TrackFlowPoint {
  event?: string | null;
  eventThing?: string | null;
  place?: string | null;
  eventTime?: string | null;
}

interface TrackAllEntry {
  status?: number | string | null;
  flow_0?: TrackFlowPoint[] | null;
  flow_1?: TrackFlowPoint[] | null;
}

interface ParsedScanEvent {
  title: string;
  description: string;
  location?: string;
  date: string;
  timestamp: number;
  stage: TrackingStage;
}

const ORDERS_CACHE_TTL_MS = 60_000;
const TOKEN_CACHE_TTL_MS = 20 * 60_000;
const AUTH_COOLDOWN_MS = 180_000;
const MIROOOO_PRODUCT_ID = "709534";

let cachedToken: { token: string; expiresAt: number } | null = null;
let failedTokenUntil = 0;
let cachedOrders: { rows: HyperSkuOrderRow[]; expiresAt: number } | null = null;
let inFlightOrdersFetch: Promise<HyperSkuOrderRow[] | null> | null = null;

function cleanEnvSecret(value: string | undefined): string {
  return String(value || "")
    .replace(/[\r\n]/g, "")
    .trim();
}

export function isExplicitUkDeliveryText(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (
    /\b(undelivered|not delivered|not yet delivered|unsuccessful|failed|attempted|attempt|unable|pending|scheduled|expected|estimated|tomorrow|soon|will be|to be|out for delivery|returned|return to sender|ready for delivery)\b/.test(
      t
    )
  ) {
    return false;
  }
  if (
    /\b(delivered|handed|passed)\b.*\b(carrier|courier|partner|company|sender|depot|hub|facility|warehouse|airport|airline|sorting|distribution|delivery office|delivery unit|post office|service centre|service center|service point|collection point|pickup point|pick up point|parcelshop|locker|agent)\b/.test(
      t
    )
  ) {
    return false;
  }
  return (
    /^(?:delivered|delivery completed|delivery successful|safe ?place delivered|secure delivery(?:\b|\s*\()|left in (?:a )?safe ?place)\b/.test(
      t
    ) ||
    /\b(?:successfully delivered|safe ?place delivered|secure delivery\b|(?:item|package|parcel|shipment)(?: has been| was| is)? delivered|signed for by|delivered to (?:the )?(?:recipient|customer|addressee|neighbour|neighbor|safe ?place|front door|back door|porch|letterbox|mailbox|reception|shed|garage|outbuilding))\b/.test(
      t
    )
  );
}

export function sanitizePublicTrackingText(input: string): string {
  let out = String(input || "").trim();
  if (!out) return "";

  out = out
    .replace(/\bclearence\b/gi, "Clearance")
    .replace(/\barrived at (?:the )?origin international airport\b/gi, "Arrived at international dispatch airport")
    .replace(/\bdeparted from (?:the )?origin international airport\b/gi, "Departed international dispatch airport")
    .replace(/\bin transit to destination country\b/gi, "In international transit to UK")
    .replace(/\bcustoms cleared(?:\s+in)?\s+origin country\b/gi, "Export clearance completed")
    .replace(/\borigin country\b/gi, "International Dispatch Hub")
    .replace(/\b(mainland china|people'?s republic of china|china|shenzhen|dongguan|guangzhou|shanghai|yiwu|hangzhou|hong kong|p\.r\.c\.|prc)\b/gi, "International Dispatch Hub")
    .replace(/\b(?:yun\s*express|yunexpress|hypersku)\b/gi, "International Tracked Carrier")
    .replace(/(?:,\s*|\s+-\s+|\s+at\s+|\s+in\s+|\s+)\b(?:cn|hk)\b(?=\s|$|,|\.)/gi, "")
    .replace(/\(\s*(?:cn|hk|china|prc)\s*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/^[,\-\s]+|[,\-\s]+$/g, "")
    .trim();

  if (/^(?:cn|hk|international dispatch hub)$/i.test(out)) {
    return "International Dispatch Hub";
  }
  return out;
}

function sanitizePlace(place?: string | null): string {
  const raw = sanitizePublicTrackingText(String(place || ""));
  if (!raw) return "";
  if (/^(?:gb|uk|united kingdom)$/i.test(raw)) return "United Kingdom";
  return raw.replace(/,\s*GB$/i, ", UK");
}

function normalizeEmail(value?: string | null): string {
  return String(value || "").trim().toLowerCase();
}

function normalizePostcode(value?: string | null): string {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function normalizeName(value?: string | null): string {
  return String(value || "").replace(/[^a-z0-9\s]/gi, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function stripPaymentSuffix(thirdName?: string | null): string {
  return String(thirdName || "").trim().replace(/-\d+$/, "");
}

function parseDateSafe(raw?: string | null): Date | null {
  const text = String(raw || "").trim();
  if (!text) return null;
  const isoLike = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)
    ? text.replace(" ", "T") + "Z"
    : text;
  const ms = Date.parse(isoLike);
  if (!Number.isFinite(ms)) return null;
  return new Date(ms);
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateShort(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const mon = MONTHS_SHORT[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${mon} ${year}`;
}

function formatDateRange(start: Date, end: Date): string {
  const sDay = String(start.getUTCDate()).padStart(2, "0");
  const eDay = String(end.getUTCDate()).padStart(2, "0");
  const sMon = MONTHS_SHORT[start.getUTCMonth()];
  const eMon = MONTHS_SHORT[end.getUTCMonth()];
  const eYear = end.getUTCFullYear();
  if (sMon === eMon && start.getUTCFullYear() === eYear) {
    return `${sDay}–${eDay} ${eMon} ${eYear}`;
  }
  return `${sDay} ${sMon} – ${eDay} ${eMon} ${eYear}`;
}

export function computeDynamicEstimatedDelivery(crtTime?: string | null, isDelivered = false, deliveredDateRaw?: string | null): string {
  const orderDate = parseDateSafe(crtTime);
  const deliveredDate = parseDateSafe(deliveredDateRaw);
  return computeEstimatedDelivery(orderDate, deliveredDate, isDelivered);
}

function computeEstimatedDelivery(orderDate: Date | null, deliveredDate: Date | null, isDelivered: boolean): string {
  if (isDelivered) {
    return deliveredDate ? formatDateShort(deliveredDate) : formatDateShort(new Date());
  }
  const now = new Date();
  const base = orderDate || now;
  const estStart = new Date(base.getTime() + 6 * 86_400_000);
  const estEnd = new Date(base.getTime() + 10 * 86_400_000);

  if (estEnd.getTime() >= Date.now() - 12 * 3600_000) {
    return formatDateRange(estStart, estEnd);
  }
  const rollingStart = new Date(now.getTime() + 2 * 86_400_000);
  const rollingEnd = new Date(now.getTime() + 5 * 86_400_000);
  return formatDateRange(rollingStart, rollingEnd);
}

async function getHyperSkuToken(forceRefresh = false): Promise<string | null> {
  const directApiKey = cleanEnvSecret(process.env.HYPERSKU_API_KEY).replace(/^Bearer\s+/i, "").trim();
  if (directApiKey) return directApiKey;

  const username = cleanEnvSecret(process.env.HYPERSKU_USERNAME);
  const password = cleanEnvSecret(process.env.HYPERSKU_PASSWORD);
  if (!username || !password) return null;

  if (!forceRefresh && cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }
  if (Date.now() < failedTokenUntil) {
    return null;
  }

  try {
    const res = await fetch("https://app.hypersku.com/api/auth/jwt/token/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      failedTokenUntil = Date.now() + AUTH_COOLDOWN_MS;
      return null;
    }
    const json = (await res.json()) as { data?: { token?: string } };
    const rawToken = String(json?.data?.token || "").replace(/^Bearer\s+/i, "").trim();
    if (!rawToken) {
      failedTokenUntil = Date.now() + AUTH_COOLDOWN_MS;
      return null;
    }

    cachedToken = { token: rawToken, expiresAt: Date.now() + TOKEN_CACHE_TTL_MS };
    return rawToken;
  } catch {
    failedTokenUntil = Date.now() + AUTH_COOLDOWN_MS;
    return null;
  }
}

function isActiveBuudyHyperSkuOrder(row: HyperSkuOrderRow): boolean {
  if (Number(row.status) === 6) return false;
  if (/trading\s*closed/i.test(String(row.statusStr || ""))) return false;

  const goods = row.goodsList || [];
  const isMiroooo = goods.some(
    (g) =>
      String(g.productId || "") === MIROOOO_PRODUCT_ID ||
      String(g.sku || "").startsWith(MIROOOO_PRODUCT_ID) ||
      /miroooo/i.test(String(g.productName || ""))
  );
  if (isMiroooo) return false;

  return true;
}

async function fetchAllActiveBuudyOrders(): Promise<HyperSkuOrderRow[] | null> {
  if (cachedOrders && Date.now() < cachedOrders.expiresAt) {
    return cachedOrders.rows;
  }
  if (inFlightOrdersFetch) {
    return inFlightOrdersFetch;
  }

  inFlightOrdersFetch = (async () => {
    try {
      let token = await getHyperSkuToken(false);
      if (!token) return null;

      const fetchPages = async (authToken: string): Promise<{ ok: boolean; rows: HyperSkuOrderRow[] }> => {
        const collected: HyperSkuOrderRow[] = [];
        for (let page = 1; page <= 20; page++) {
          const res = await fetch(`https://app.hypersku.com/api/customer/orders/query/list/page?t=${Date.now()}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
              token: authToken,
            },
            body: JSON.stringify({ page, limit: 100, storeId: 0, searchType: 2 }),
            cache: "no-store",
            signal: AbortSignal.timeout(9000),
          });
          if (!res.ok) return { ok: false, rows: [] };
          const json = (await res.json()) as {
            status?: number;
            data?: { total?: number; rows?: HyperSkuOrderRow[] };
          };
          if (json?.status === 40101 || !json?.data || !Array.isArray(json.data.rows)) {
            return { ok: false, rows: [] };
          }
          collected.push(...json.data.rows);
          const total = Number(json.data.total || 0);
          if (collected.length >= total || json.data.rows.length === 0) break;
        }
        return { ok: true, rows: collected };
      };

      let result = await fetchPages(token);
      if (!result.ok) {
        token = await getHyperSkuToken(true);
        if (!token) return null;
        result = await fetchPages(token);
      }
      if (!result.ok) return null;

      const active = result.rows
        .filter(isActiveBuudyHyperSkuOrder)
        .sort((a, b) => {
          const tb = parseDateSafe(b.crtTime)?.getTime() || 0;
          const ta = parseDateSafe(a.crtTime)?.getTime() || 0;
          return tb - ta;
        });

      cachedOrders = { rows: active, expiresAt: Date.now() + ORDERS_CACHE_TTL_MS };
      return active;
    } catch {
      return null;
    } finally {
      inFlightOrdersFetch = null;
    }
  })();

  return inFlightOrdersFetch;
}

function getRowTracking(row: HyperSkuOrderRow): {
  trackingNumber: string;
  initialTracking: string;
  carrier: string;
  logisticsStatus: number;
} {
  const list = row.logisticsList || [];
  const chosen =
    list.find((l) => String(l.trackingNumber || "").trim()) ||
    list.find((l) => String(l.initialTrackingNumber || "").trim()) ||
    list[0];

  const trackingNumber = String(chosen?.trackingNumber || "").trim();
  const initialTracking = String(chosen?.initialTrackingNumber || "").trim();
  const rawCarrier = String(chosen?.expressDelivery || "").trim();
  const logisticsStatus = Number(chosen?.status || 0);

  let carrier = "UK Tracked Delivery";
  if (/^H\d{2}[A-Z0-9]+$/i.test(trackingNumber) || /evri|hermes/i.test(rawCarrier)) {
    carrier = "Evri";
  } else if (/^[A-Z]{2}\d{9}GB$/i.test(trackingNumber) || /royal\s*mail/i.test(rawCarrier)) {
    carrier = "Royal Mail Tracked 48";
  } else if (/dpd/i.test(rawCarrier)) {
    carrier = "DPD UK";
  } else if (/yodel/i.test(rawCarrier)) {
    carrier = "Yodel";
  } else if (/^YT\d+/i.test(trackingNumber)) {
    carrier = "UK Tracked Express";
  } else if (rawCarrier && !/yun\s*express|hypersku|china|cn/i.test(rawCarrier)) {
    carrier = sanitizePublicTrackingText(rawCarrier) || "UK Tracked Delivery";
  }

  return { trackingNumber, initialTracking, carrier, logisticsStatus };
}

function matchOrderRow(rows: HyperSkuOrderRow[], rawQuery: string): HyperSkuOrderRow | null {
  const trimmed = rawQuery.trim();
  const lower = trimmed.toLowerCase();
  const upper = trimmed.toUpperCase();
  if (!trimmed || lower === "undefined" || lower === "null") return null;

  const cleanPaymentQuery = stripPaymentSuffix(trimmed).toLowerCase();
  const normPostcodeQuery = normalizePostcode(trimmed);
  const normNameQuery = normalizeName(trimmed);

  // 1. Exact payment ID (with or without -1/-2 suffix) or HyperSKU order ID / orderSn
  for (const r of rows) {
    const thirdRaw = String(r.thirdName || "").trim();
    const thirdLower = thirdRaw.toLowerCase();
    const thirdBase = stripPaymentSuffix(thirdRaw).toLowerCase();
    const idStr = String(r.id || "").trim().toLowerCase();
    const snStr = String(r.orderSn || "").trim().toLowerCase();

    if (
      (thirdLower && thirdLower !== "undefined" && (thirdLower === lower || thirdBase === cleanPaymentQuery)) ||
      (idStr && idStr === lower) ||
      (snStr && snStr === lower)
    ) {
      return r;
    }
  }

  // 2. Exact tracking number or initial tracking number
  for (const r of rows) {
    for (const l of r.logisticsList || []) {
      const tn = String(l.trackingNumber || "").trim().toUpperCase();
      const itn = String(l.initialTrackingNumber || "").trim().toUpperCase();
      if ((tn && tn === upper) || (itn && itn === upper)) {
        return r;
      }
    }
  }

  // 3. Exact email match (rows already sorted newest-first)
  if (trimmed.includes("@")) {
    for (const r of rows) {
      const em = normalizeEmail(r.ordersAddress?.thirdCustomerEmail || r.ordersAddress?.email);
      if (em && em === lower) {
        return r;
      }
    }
  }

  // 4. Normalized UK/International postcode match (min 5 alnum chars)
  if (normPostcodeQuery.length >= 5 && normPostcodeQuery.length <= 10) {
    for (const r of rows) {
      const pc = normalizePostcode(r.ordersAddress?.zipCode || r.ordersAddress?.postCode);
      if (pc && pc === normPostcodeQuery) {
        return r;
      }
    }
  }

  // 5. Full name match (min 5 chars, must match full name)
  if (normNameQuery.length >= 5) {
    for (const r of rows) {
      const addr = r.ordersAddress;
      const full1 = normalizeName(`${addr?.firstName || ""} ${addr?.lastName || ""}`);
      const full2 = normalizeName(addr?.name);
      if ((full1 && full1 === normNameQuery) || (full2 && full2 === normNameQuery)) {
        return r;
      }
    }
  }

  return null;
}

async function queryTrackAll(trackingNumber: string): Promise<TrackAllEntry | null> {
  if (!trackingNumber) return null;
  try {
    const body = new URLSearchParams({ finalNo: trackingNumber, doFinalType: "0", finalId: "0" });
    const res = await fetch("https://track.hypersku.com/Index/track_all.html", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: body.toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { retCode?: string; retInfo?: Record<string, TrackAllEntry> };
    if (json?.retCode !== "100" || !json?.retInfo) return null;
    const firstKey = Object.keys(json.retInfo)[0];
    return firstKey ? json.retInfo[firstKey] : null;
  } catch {
    return null;
  }
}

function classifyScanStage(title: string): TrackingStage {
  if (isExplicitUkDeliveryText(title)) return "DELIVERED";
  if (
    (/\b(out for delivery|with delivery courier|arriving today|due for delivery today)\b/i.test(title) ||
      /^eta of delivery\b/i.test(title)) &&
    !/\bwill be out for delivery\b/i.test(title)
  ) {
    return "OUT_FOR_DELIVERY";
  }
  if (/\b(order confirmed|preparing|shipment information received|label created|awaiting pickup)\b/i.test(title)) {
    return "PROCESSING";
  }
  return "IN_TRANSIT";
}

function parseCarrierScans(entry: TrackAllEntry | null): ParsedScanEvent[] {
  if (!entry) return [];
  const rawPoints: TrackFlowPoint[] = [
    ...(Array.isArray(entry.flow_0) ? entry.flow_0 : []),
    ...(Array.isArray(entry.flow_1) ? entry.flow_1 : []),
  ];

  const seen = new Set<string>();
  const events: ParsedScanEvent[] = [];

  for (const pt of rawPoints) {
    const rawEvent = String(pt.event || pt.eventThing || "").trim();
    if (!rawEvent) continue;
    const title = sanitizePublicTrackingText(rawEvent);
    if (!title) continue;

    const location = sanitizePlace(pt.place);
    const dt = parseDateSafe(pt.eventTime);
    const timestamp = dt ? dt.getTime() : 0;
    const dateLabel = dt ? formatDateShort(dt) + " " + String(pt.eventTime || "").slice(11, 16) : String(pt.eventTime || "").trim();

    const dedupKey = `${dateLabel}|${title.toLowerCase()}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    events.push({
      title,
      description: location ? `${title} — ${location}` : title,
      location: location || undefined,
      date: dateLabel || "Recent Update",
      timestamp,
      stage: classifyScanStage(title),
    });
  }

  events.sort((a, b) => a.timestamp - b.timestamp);
  return events;
}

function mapGoodsToItems(goods?: HyperSkuGoodsItem[] | null): TrackingData["items"] {
  if (!goods || goods.length === 0) {
    return [
      {
        title: "Buudy 7-Colour LED Face & Neck Mask",
        variant: "7-Colour LED + 830nm Near-Infrared",
        quantity: 1,
      },
    ];
  }

  const items: TrackingData["items"] = [];
  for (const g of goods) {
    const pid = String(g.productId || "");
    const sku = String(g.sku || "");
    const rawName = String(g.productName || "");
    const quantity = Math.max(1, Number(g.goodsNum || 1));

    if (pid === "707401" || pid === "300707401700019" || /707401|led.*mask|cleopatra/i.test(sku + " " + rawName)) {
      items.push({
        title: "Buudy 7-Colour LED Face & Neck Mask",
        variant: "7-Colour LED + 830nm Near-Infrared",
        quantity,
      });
    } else if (pid === "707557" || pid === "600707557500022" || /707557|torch|red\s*light/i.test(sku + " " + rawName)) {
      items.push({
        title: "Complimentary Buudy Mini Red Light Torch",
        variant: "Complimentary Gift Included",
        quantity,
      });
    } else {
      const safeTitle = sanitizePublicTrackingText(rawName) || "Buudy Skincare Order Item";
      items.push({ title: safeTitle, quantity });
    }
  }

  return items;
}

export async function relayViaBuudyCom(rawQuery: string): Promise<TrackingData | null> {
  try {
    const res = await fetch("https://buudy.com/api/order-tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-buudy-relay": "1",
      },
      body: JSON.stringify({ query: rawQuery }),
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      status?: string;
      data?: {
        found?: boolean;
        orderRef?: string;
        trackingNumber?: string;
        carrierName?: string;
        destination?: string;
        orderDate?: string;
        estimatedDelivery?: string;
        status?: string;
        statusCode?: string;
        progressPercentage?: number;
        activeStepIndex?: number;
        items?: Array<{ title?: string; variant?: string; quantity?: number }>;
        timeline?: Array<{ title?: string; date?: string; description?: string; location?: string; completed?: boolean; stage?: string }>;
      };
    };
    const d = json?.data;
    if (json?.status !== "found" || !d || !d.found) return null;

    const validStatuses: Record<string, TrackingData["status"]> = {
      Delivered: "Delivered",
      "Out for Delivery": "Out for Delivery",
      "In Transit": "In Transit",
      Processing: "Processing",
    };
    const status: TrackingData["status"] = validStatuses[String(d.status || "")] || "In Transit";
    const validCodes: Record<string, TrackingStage> = {
      DELIVERED: "DELIVERED",
      OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
      IN_TRANSIT: "IN_TRANSIT",
      PROCESSING: "PROCESSING",
      ORDER_PLACED: "ORDER_PLACED",
    };
    const statusCode: TrackingStage = validCodes[String(d.statusCode || "")] || "IN_TRANSIT";

    const timeline: TimelineEvent[] = (d.timeline || []).map((ev) => {
      const title = sanitizePublicTrackingText(String(ev.title || "")) || "Shipment Update";
      const location = ev.location ? sanitizePlace(ev.location) : undefined;
      const desc = sanitizePublicTrackingText(String(ev.description || title));
      return {
        title,
        date: String(ev.date || d.orderDate || "Recent Update"),
        description: desc || title,
        location: location || undefined,
        completed: ev.completed !== false,
        stage: validCodes[String(ev.stage || "")] || classifyScanStage(title),
      };
    });

    const items: TrackingData["items"] = (d.items || []).map((it) => ({
      title: sanitizePublicTrackingText(String(it.title || "")) || "Buudy Skincare Order Item",
      variant: it.variant ? sanitizePublicTrackingText(String(it.variant)) : undefined,
      quantity: Math.max(1, Number(it.quantity || 1)),
    }));

    return {
      found: true,
      orderRef: String(d.orderRef || rawQuery),
      trackingNumber: String(d.trackingNumber || "Pending Carrier Label"),
      carrierName: sanitizePublicTrackingText(String(d.carrierName || "")) || "UK Tracked Delivery",
      destination: sanitizePlace(d.destination) || "United Kingdom",
      orderDate: String(d.orderDate || "Recent Order"),
      estimatedDelivery: String(d.estimatedDelivery || computeDynamicEstimatedDelivery(null, statusCode === "DELIVERED")),
      status,
      statusCode,
      progressPercentage: Number(d.progressPercentage || (statusCode === "DELIVERED" ? 100 : 50)),
      activeStepIndex: Number(d.activeStepIndex ?? (statusCode === "DELIVERED" ? 3 : 1)),
      statusMessage: timeline[0]?.description || "Your order tracking is up to date.",
      checkedAt: new Date().toISOString(),
      items,
      timeline,
    };
  } catch {
    return null;
  }
}

export async function resolveLiveHyperSkuTracking(
  rawQuery: string,
  options?: { skipRelay?: boolean }
): Promise<TrackingData | null> {
  const rows = await fetchAllActiveBuudyOrders();
  if (!rows) {
    return options?.skipRelay ? null : relayViaBuudyCom(rawQuery);
  }
  if (rows.length === 0) return null;

  const matched = matchOrderRow(rows, rawQuery);
  if (!matched) return null;

  const { trackingNumber, initialTracking, carrier, logisticsStatus } = getRowTracking(matched);
  const orderDateObj = parseDateSafe(matched.crtTime);
  const orderDate = orderDateObj ? formatDateShort(orderDateObj) : "Recent Order";

  const addr = matched.ordersAddress;
  const cityOrProvince = sanitizePlace(addr?.thirdRegionName || addr?.city || addr?.secondRegionName || addr?.province || "");
  const postcode = String(addr?.zipCode || addr?.postCode || "").trim().toUpperCase();
  const countryRaw = String(addr?.countryName || addr?.country || "United Kingdom").trim();
  const country = countryRaw === "GB" || countryRaw === "UK" ? "United Kingdom" : sanitizePlace(countryRaw) || "United Kingdom";
  const destinationParts = [cityOrProvince, postcode, country].filter(Boolean);
  const destination = destinationParts.join(", ") || "United Kingdom";

  const rawPaymentRef = String(matched.thirdName || "").trim();
  const orderRef =
    rawPaymentRef && rawPaymentRef.toLowerCase() !== "undefined"
      ? stripPaymentSuffix(rawPaymentRef)
      : String(matched.id || matched.orderSn || "");

  // Query live carrier scans
  let trackEntry = trackingNumber ? await queryTrackAll(trackingNumber) : null;
  let scans = parseCarrierScans(trackEntry);
  if (scans.length === 0 && initialTracking && initialTracking !== trackingNumber) {
    const fallbackEntry = await queryTrackAll(initialTracking);
    const fallbackScans = parseCarrierScans(fallbackEntry);
    if (fallbackScans.length > 0) {
      trackEntry = fallbackEntry;
      scans = fallbackScans;
    }
  }

  const latestScan = scans.length > 0 ? scans[scans.length - 1] : null;
  const deliveredScan = [...scans].reverse().find((s) => isExplicitUkDeliveryText(s.title)) || null;

  const hasExplicitFailureOrReturn = latestScan
    ? /\b(failed|unsuccessful|unable to deliver|returned|return to sender|exception|undelivered)\b/i.test(latestScan.title)
    : false;
  const hyperReportsDelivered = String(trackEntry?.status ?? "") === "1" && scans.length > 0 && !hasExplicitFailureOrReturn;
  const logisticsDelivered = logisticsStatus === 3 && (scans.length === 0 || (!hasExplicitFailureOrReturn && Boolean(deliveredScan || Number(matched.status) === 5)));

  const isDelivered = Boolean(deliveredScan) || hyperReportsDelivered || logisticsDelivered;

  const isOutForDelivery =
    !isDelivered &&
    Boolean(
      latestScan &&
        (/\b(out for delivery|with delivery courier|arriving today|due for delivery today)\b/i.test(latestScan.title) ||
          /^eta of delivery\b/i.test(latestScan.title)) &&
        !/\bwill be out for delivery\b/i.test(latestScan.title)
    );

  let status: TrackingData["status"] = "Processing";
  let statusCode: TrackingStage = "PROCESSING";
  let progressPercentage = 30;
  let activeStepIndex = 0;
  let statusMessage = "Your order is confirmed and being prepared for dispatch.";

  const hasCarrierTracking = Boolean(trackingNumber || initialTracking);

  if (isDelivered) {
    status = "Delivered";
    statusCode = "DELIVERED";
    progressPercentage = 100;
    activeStepIndex = 3;
    const deliveredLoc = deliveredScan?.location ? ` (${deliveredScan.location})` : "";
    statusMessage = deliveredScan
      ? `${deliveredScan.title}${deliveredLoc} on ${deliveredScan.date}.`
      : "Your parcel has been delivered.";
  } else if (isOutForDelivery && latestScan) {
    status = "Out for Delivery";
    statusCode = "OUT_FOR_DELIVERY";
    progressPercentage = 88;
    activeStepIndex = 2;
    statusMessage = latestScan.description;
  } else if (hasCarrierTracking) {
    status = "In Transit";
    statusCode = "IN_TRANSIT";
    activeStepIndex = 1;
    if (latestScan) {
      const tLower = latestScan.title.toLowerCase();
      if (/delivered|hub|depot|sorting|mc|delivery office|courier|arrived in destination|customs/.test(tLower)) {
        progressPercentage = 72;
      } else if (/flight|departed|transit|airport/.test(tLower)) {
        progressPercentage = 62;
      } else {
        progressPercentage = 48;
      }
      statusMessage = latestScan.description;
    } else {
      progressPercentage = 45;
      statusMessage = `Tracking number assigned with ${carrier}. First carrier scan updates shortly.`;
    }
  } else if (Number(matched.status) === 3) {
    status = "Processing";
    statusCode = "PROCESSING";
    progressPercentage = 40;
    activeStepIndex = 0;
    statusMessage = "Packed and awaiting courier collection.";
  }

  const deliveredDateObj =
    deliveredScan && deliveredScan.timestamp > 0
      ? new Date(deliveredScan.timestamp)
      : isDelivered
        ? parseDateSafe(matched.edtTime) || parseDateSafe(matched.logisticsList?.[0]?.updateTime) || orderDateObj
        : null;

  const estimatedDelivery = computeEstimatedDelivery(orderDateObj, deliveredDateObj, isDelivered);

  // Build newest-first timeline with guaranteed order-confirmed anchor
  const baseEvent: TimelineEvent = {
    title: "Order Confirmed & Preparing Dispatch",
    date: orderDate,
    description: "Your Buudy order has been verified and queued for UK tracked fulfillment.",
    completed: true,
    stage: "ORDER_PLACED",
  };

  const scanEventsDesc: TimelineEvent[] = [...scans].reverse().map((s) => ({
    title: s.title,
    date: s.date,
    description: s.description,
    location: s.location,
    completed: true,
    stage: s.stage,
  }));

  const timeline: TimelineEvent[] =
    scanEventsDesc.length > 0
      ? [...scanEventsDesc, baseEvent]
      : hasCarrierTracking
        ? [
            {
              title: "Dispatch Label Created",
              date: orderDate,
              description: `Courier tracking assigned (${carrier}). Awaiting initial hub scan.`,
              completed: true,
              stage: "PROCESSING",
            },
            baseEvent,
          ]
        : [baseEvent];

  const trackingDisplay = trackingNumber || initialTracking || "Pending Carrier Label";

  return {
    found: true,
    orderRef,
    trackingNumber: trackingDisplay,
    carrierName: carrier,
    destination,
    orderDate,
    estimatedDelivery,
    status,
    statusCode,
    progressPercentage,
    activeStepIndex,
    statusMessage,
    checkedAt: new Date().toISOString(),
    items: mapGoodsToItems(matched.goodsList),
    timeline,
  };
}
