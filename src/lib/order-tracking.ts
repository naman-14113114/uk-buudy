// Server-side order tracking service for Buudy UK.
// Integrates XPage order records with CJ and HyperSKU carrier checkpoints.
import { getCache } from "@vercel/functions";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";

export type TrackingStage = "ORDER_PLACED" | "PROCESSING" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED";

export type TimelineEvent = {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  stage: TrackingStage;
};

export type TrackingItem = {
  title: string;
  quantity: number;
  variant?: string;
  image?: string;
};

export type TrackingData = {
  found: boolean;
  orderRef: string;
  trackingNumber: string;
  carrierName: string;
  carrierTrackingUrl?: string;
  recipientName?: string;
  destination: string;
  status: "Processing" | "In Transit" | "Out for Delivery" | "Delivered" | "Tracking unavailable";
  statusCode: TrackingStage | "UNAVAILABLE";
  progressPercentage: number;
  activeStepIndex: number; // Processing, In Transit, Out for Delivery, Delivered
  orderDate: string;
  estimatedDelivery: string;
  items: TrackingItem[];
  timeline: TimelineEvent[];
  checkedAt: string;
  statusMessage: string;
};

type CJTrackEvent = {
  eventTime: string;
  activity: string;
  location: string;
  eventTimestamp: number | null;
};

type CJTrackingRecord = {
  trackingNumber?: string;
  trackingStatus?: string;
  trackingTo?: string;
  routes?: { acceptAddress?: string; acceptTime: string; remark: string }[];
  lastMileCarrier?: string;
  logisticsName?: string;
  deliveryDay?: number;
  shipCountryCode?: string;
  destCountryCode?: string;
  cjTrackNumber?: string;
  customerOrderId?: string;
  trackNumber?: string;
  lastTrackNumber?: string;
  shopName?: string;
  userOrderNum?: string; // e.g. "a2b770e7-c07c-4665-bbd2-f1ec88e15376:f1e01ab9-1eae-48cb-af0a-5197f91f2bcc"
  statusDescription?: string;
  status?: number;
  providerEnName?: string | null;
  trackEvent?: CJTrackEvent[];
};

type HyperSKUTrackEvent = {
  eventTime: string;
  eventThing: string;
  eventDetail?: string | null;
  place?: string | null;
};

type HyperSKURecord = {
  finalNo?: string;
  status?: number; // 1: Delivered, 2: In Transit, 3: Pick Up, 4: Undelivered, 5: Expired, 6: Returned, 0: Not Find, -5: Does not exist, -2: Alert
  deliveredDay?: string;
  flow_0?: HyperSKUTrackEvent[]; // Origin & international transit flow
  flow_1?: HyperSKUTrackEvent[]; // Destination & last-mile courier flow (e.g. Royal Mail, Yodel)
  express_company_info?: { website?: string; name?: string; enName?: string; contact?: string };
  express_company_info_to?: { website?: string; name?: string; enName?: string; contact?: string };
  lasttime?: string;
  createTime?: string;
};

export type CachedOrder = {
  id: string;
  ref: string;
  customerFirstName: string;
  customerLastName: string;
  customerCity: string;
  customerCountry: string;
  createdAt: number;
  trackingNumber: string | null;
  shippingCarrier?: string | null;
  backend?: "hypersku" | "cj";
  items: TrackingItem[];
  additionalTracking?: string[];
};

const BUUDY_HOSTING_ID = process.env.XPAGE_BUUDY_HOSTING_ID || "a2b770e7-c07c-4665-bbd2-f1ec88e15376";

let activeXPageToken = process.env.XPAGE_USER_TOKEN || "";

// Legacy fulfillment aliases only: XPage does not expose these older shipment
// numbers. Never use historical customer details, dates, products or milestones.
// Every lookup refreshes order metadata and queries live carrier information.
type ShipmentReference = { id: string; ref: string; trackingNumber: string; backend?: "hypersku" | "cj"; additionalTracking?: string[] };
const LEGACY_SHIPMENT_REFERENCES: ShipmentReference[] = [
  {
    "id": "a3179b57-a68e-47ab-82cd-d1a46cf932bd",
    "ref": "#2560",
    "trackingNumber": "QP272594975GB",
    "backend": "hypersku"
  },
  {
    "id": "a3177e7c-bdba-4792-a7da-fc6249a797f1",
    "ref": "#2559",
    "trackingNumber": "QP272594984GB",
    "backend": "hypersku"
  },
  {
    "id": "a3172e7b-7d83-4a6e-8b5e-58ce95d62404",
    "ref": "#2557",
    "trackingNumber": "QP272594967GB",
    "backend": "hypersku"
  },
  {
    "id": "a3151b5a-4fb7-4e77-8950-40df1412584d",
    "ref": "#2552",
    "trackingNumber": "ZHPHD261027933790ML"
  },
  {
    "id": "a3114a09-a195-4ecf-bcf3-90af426fa03f",
    "ref": "#2547",
    "trackingNumber": "ZHPHD261026925943ML"
  },
  {
    "id": "a3100d5e-8e7a-41d7-a213-2ba70af50f95",
    "ref": "#2541",
    "trackingNumber": "ZHPHD261025429457ML"
  },
  {
    "id": "a30ecd4d-ee84-407d-b5cc-545441f1fce3",
    "ref": "#2538",
    "trackingNumber": "ZHPHD261024120642ML",
    "additionalTracking": [
      "JJD0002234587495447"
    ]
  },
  {
    "id": "a30d5a5a-554c-4708-ac8f-28355370d28b",
    "ref": "#2536",
    "trackingNumber": "ZHPHD261024737846ML"
  },
  {
    "id": "a30ca9ea-f70a-436c-a58b-910af4d249bd",
    "ref": "#2533",
    "trackingNumber": "QP118176663GB"
  },
  {
    "id": "a30aa6d7-1044-47a7-b05b-263d2e398bc9",
    "ref": "#2532",
    "trackingNumber": "ZHPHD261022960967ML"
  },
  {
    "id": "a2efacf2-ca6f-4433-8c85-f1ae782d7006",
    "ref": "#2458",
    "trackingNumber": "ZHPHD261009289883ML"
  },
  {
    "id": "a2efa948-2f65-468b-b7c7-4b81bbe7a650",
    "ref": "#2457",
    "trackingNumber": "ZHPHD261009456442ML"
  },
  {
    "id": "a2eb419a-c0c2-452d-bee8-9379d1f7c917",
    "ref": "#2452",
    "trackingNumber": "ZHPHD261007656662ML"
  },
  {
    "id": "a2e6bbfc-861e-45b0-ad11-c16aedb95209",
    "ref": "#2440",
    "trackingNumber": "ZHPHD261004881402ML"
  },
  {
    "id": "a2e260d0-c390-4538-860c-04e58690a783",
    "ref": "#2397",
    "trackingNumber": "ZHPHD261005471952ML"
  },
  {
    "id": "a2dfbac3-d4ac-4ba5-a970-70fdc03a7cdf",
    "ref": "#2363",
    "trackingNumber": "ZHPHD261005745484ML"
  },
  {
    "id": "a2d8cc79-a8d5-4108-bc38-3231313d4f3f",
    "ref": "#2309",
    "trackingNumber": "JJD0002234587412692"
  },
  {
    "id": "a2d75673-b2d6-46e8-8026-2b7b39cb4b8c",
    "ref": "#2304",
    "trackingNumber": "JJD0002234587412691"
  },
  {
    "id": "a2d25679-e680-45af-bbee-dbc306170a1a",
    "ref": "#2266",
    "trackingNumber": "JJD0002234587407213"
  },
  {
    "id": "a2ca1b6f-2c5e-444f-9ebc-195f7f84c29e",
    "ref": "#2213",
    "trackingNumber": "JJD0002234587400459"
  },
  {
    "id": "a2c84aa3-2fd8-46a8-9a01-fd5a67df7627",
    "ref": "#2193",
    "trackingNumber": "JJD0002234587400128"
  },
  {
    "id": "a2c6495f-dc00-4ca0-bbcd-4a0d3ebd401c",
    "ref": "#2153",
    "trackingNumber": "JJD0002234587400454"
  },
  {
    "id": "a2c645b4-85c5-4471-a880-71940f5b21f1",
    "ref": "#2148",
    "trackingNumber": "JJD0002234587400456"
  },
  {
    "id": "a2c4b1cb-374b-4ae3-8290-294d8481c2f9",
    "ref": "#2107",
    "trackingNumber": "JJD0002234587387104"
  }
];

type XPageDelivery = { tracking_number?: string; shipping_carrier?: string };
type XPageOrder = {
  id: string; ref: string; created_at: number;
  customer_first_name?: string; customer_last_name?: string; customer_city?: string;
  customer_country?: { name?: string }; deliveries?: XPageDelivery[];
  variants?: { title: string; quantity: number; options?: string; image_url?: string }[];
};
type XPageResponse = { orders?: XPageOrder[]; paginator?: { lastPage?: number } };
let xpageLogin: Promise<boolean> | null = null;

async function refreshXPageToken(): Promise<boolean> {
  if (!process.env.XPAGE_EMAIL || !process.env.XPAGE_PASSWORD) return false;
  if (!xpageLogin) xpageLogin = (async () => {
    const json = await fetchTrackingJson("https://api.myxpage.shop/api/v1/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: process.env.XPAGE_EMAIL, password: process.env.XPAGE_PASSWORD }),
    });
    if (typeof json.token !== "string" || !json.token) return false;
    activeXPageToken = json.token;
    return true;
  })().catch(() => false).finally(() => { xpageLogin = null; });
  return xpageLogin;
}

async function readXPagePage(page: number, search?: string, retry = true): Promise<XPageResponse> {
  const params = new URLSearchParams({ page: String(page), per_page: "50" });
  if (search) params.set("search", search);
  const response = await fetch(
    `https://api.myxpage.shop/api/v1/hosting/${BUUDY_HOSTING_ID}/order?${params}`, {
      headers: { cookie: `xpage_user_token=${activeXPageToken}`, accept: "application/json" },
      cache: "no-store", signal: AbortSignal.timeout(8000),
    });
  if ((response.status === 401 || response.status === 404) && retry && await refreshXPageToken()) {
    return readXPagePage(page, search, false);
  }
  if (!response.ok) throw new TrackingUnavailableError();
  const json: XPageResponse = await response.json();
  if (!Array.isArray(json.orders)) throw new TrackingUnavailableError();
  return json;
}

function matchesOrder(order: XPageOrder, terms: string[]) {
  const identities = [order.id, order.ref, order.ref?.replace(/^#/, ""),
    ...(order.deliveries || []).map(d => d.tracking_number)].filter(Boolean).map(v => v!.toLowerCase());
  return terms.some(term => identities.includes(term.toLowerCase().replace(/^#/, "")) || identities.includes(term.toLowerCase()));
}

async function fetchFromXPageLive(query: string, orderId?: string): Promise<{ order: CachedOrder | null; available: boolean }> {
  try {
    const terms = [query, ...(orderId ? [orderId] : [])];
    const search = await readXPagePage(1, query.replace(/^#/, ""));
    let order = search.orders!.find(o => matchesOrder(o, terms));
    if (!order) {
      // The API's search does not index fulfillment barcodes, and per_page can
      // be capped by the provider. Follow its paginator instead of assuming 50.
      const first = await readXPagePage(1);
      order = first.orders!.find(o => matchesOrder(o, terms));
      if (!order) {
        const lastPage = Math.min(Number(first.paginator?.lastPage) || 1, 5);
        const pages = await Promise.all(Array.from({ length: lastPage - 1 }, (_, i) => readXPagePage(i + 2)));
        order = pages.flatMap(page => page.orders || []).find(o => matchesOrder(o, terms));
      }
    }
    if (!order) return { order: null, available: true };
    const delivery = order.deliveries?.find(d => d.tracking_number?.toLowerCase() === query.toLowerCase()) || order.deliveries?.find(d => d.tracking_number);
    return { available: true, order: {
      id: order.id, ref: order.ref, createdAt: order.created_at,
      customerFirstName: order.customer_first_name || "", customerLastName: order.customer_last_name || "",
      customerCity: order.customer_city || "", customerCountry: order.customer_country?.name || "",
      trackingNumber: delivery?.tracking_number || null, shippingCarrier: delivery?.shipping_carrier,
      items: (order.variants || []).map(v => ({ title: v.title, quantity: v.quantity, variant: v.options, image: v.image_url })),
    } };
  } catch { return { order: null, available: false }; }
}

// -----------------------------------------------------------------------------
// CJ LOGISTICS TRACKER (Place 2: Real-time live current courier milestones)
// -----------------------------------------------------------------------------
export class TrackingUnavailableError extends Error {
  constructor() { super("Live carrier tracking is temporarily unavailable. Please try again shortly."); }
}

let cjToken: { value: string; expires: number } | null = null;
let cjTokenRequest: Promise<string> | null = null;

let nextCJRequestAt = 0;
const lookupDeadline = new AsyncLocalStorage<number>();
async function fetchTrackingJson(url: string, options: RequestInit = {}, timeout = 8000, attempts = 1) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (url.includes("developers.cjdropshipping.com")) {
      // CJ applies an account-wide QPS limit. Reserve start times synchronously
      // so simultaneous lookups in this runtime do not burst requests.
      const start = Math.max(Date.now(), nextCJRequestAt);
      if (start >= (lookupDeadline.getStore() || Infinity)) throw new TrackingUnavailableError();
      nextCJRequestAt = start + 1100;
      if (start > Date.now()) await new Promise(resolve => setTimeout(resolve, start - Date.now()));
    }
    try {
      const remaining = Math.min(timeout, (lookupDeadline.getStore() || Infinity) - Date.now());
      if (remaining <= 0) throw new TrackingUnavailableError();
      const response = await fetch(url, { ...options, cache: "no-store", signal: AbortSignal.timeout(remaining) });
      if (response.ok) return await response.json();
      if (response.status !== 429 && response.status < 500) throw new TrackingUnavailableError();
      if (attempt + 1 < attempts) {
        const delay = Math.min(3000, Math.max(1100, Number(response.headers.get("retry-after")) * 1000 || 1100));
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      if (error instanceof TrackingUnavailableError || attempt + 1 === attempts) throw new TrackingUnavailableError();
    }
  }
  throw new TrackingUnavailableError();
}

type CarrierSnapshot = { record: CJTrackingRecord | HyperSKURecord; checkedAt: number };
const carrierSnapshots = new Map<string, CarrierSnapshot>();
const carrierRequests = new Map<string, Promise<CJTrackingRecord | HyperSKURecord | null>>();
const SNAPSHOT_TTL = 30 * 24 * 60 * 60;
const CHECK_INTERVAL = 5 * 60 * 1000;

async function verifiedCarrier<T extends CJTrackingRecord | HyperSKURecord>(provider: "cj" | "hypersku", number: string, fetcher: () => Promise<T | null>): Promise<T | null> {
  const key = `buudy-tracking-v2:${provider}:${number.toUpperCase()}`;
  const pending = carrierRequests.get(key);
  if (pending) return pending as Promise<T | null>;
  const request = (async () => {
    let previous = carrierSnapshots.get(key);
    if (process.env.VERCEL) {
      try {
        const shared = await getCache().get(key) as CarrierSnapshot | undefined;
        if (shared && (!previous || shared.checkedAt > previous.checkedAt)) previous = shared;
      } catch { /* Cache availability must never block a carrier lookup. */ }
    }
    if (previous && Date.now() - previous.checkedAt > SNAPSHOT_TTL * 1000) previous = undefined;
    if (previous && Date.now() - previous.checkedAt < CHECK_INTERVAL) return previous.record as T;
    try {
      const record = await fetcher();
      const events = buildCarrierEvents(provider === "cj" ? record as CJTrackingRecord : null, provider === "hypersku" ? record as HyperSKURecord : null);
      if (events.length) {
        const oldEvents = previous ? buildCarrierEvents(provider === "cj" ? previous.record as CJTrackingRecord : null, provider === "hypersku" ? previous.record as HyperSKURecord : null) : [];
        // A truncated/lagging provider response must not erase newer verified scans.
        const snapshot = { record: oldEvents[0]?.timestamp > events[0].timestamp ? previous!.record : record!, checkedAt: Date.now() };
        carrierSnapshots.set(key, snapshot);
        if (carrierSnapshots.size > 1000) carrierSnapshots.delete(carrierSnapshots.keys().next().value!);
        if (process.env.VERCEL) {
          try { await getCache().set(key, snapshot, { ttl: SNAPSHOT_TTL }); } catch { /* Keep the local copy. */ }
        }
        return snapshot.record as T;
      }
      return previous ? previous.record as T : record;
    } catch (error) {
      if (previous) return previous.record as T;
      throw error;
    }
  })().finally(() => { carrierRequests.delete(key); });
  carrierRequests.set(key, request);
  return request;
}

async function getCJToken(): Promise<string> {
  if (process.env.CJ_ACCESS_TOKEN) return process.env.CJ_ACCESS_TOKEN;
  if (cjToken && cjToken.expires > Date.now() + 60000) return cjToken.value;
  if (!cjTokenRequest) {
    cjTokenRequest = (async () => {
      // Serverless instances share the token to avoid repeated authentication
      // calls against CJ's stricter token-generation quota. Never expose it.
      const tokenKey = `buudy-cj-auth-v1:${createHash("sha256").update(process.env.CJ_API_KEY || "").digest("hex")}`;
      if (process.env.VERCEL) {
        try {
          const shared = await getCache().get(tokenKey) as typeof cjToken;
          if (shared?.value && shared.expires > Date.now() + 60000) {
            cjToken = shared; return shared.value;
          }
        } catch { /* Authentication remains available without the cache. */ }
      }
      const json = await fetchTrackingJson("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
      });
      if (!json.result || !json.data?.accessToken) throw new TrackingUnavailableError();
      const expires = Date.parse(json.data.accessTokenExpiryDate);
      cjToken = { value: json.data.accessToken, expires: Number.isFinite(expires) ? expires : Date.now() + 3600000 };
      if (process.env.VERCEL) {
        try { await getCache().set(tokenKey, cjToken, { ttl: Math.max(1, Math.floor((cjToken.expires - Date.now() - 60000) / 1000)) }); }
        catch { /* The current instance can still use its token. */ }
      }
      return cjToken.value;
    })().finally(() => { cjTokenRequest = null; });
  }
  return cjTokenRequest;
}

async function fetchCJTracking(trackingNumber: string, resolveReplacement = true): Promise<CJTrackingRecord | null> {
  if (!isTrackingBarcode(trackingNumber)) return null;
  const number = trackingNumber.trim().toUpperCase();
  if (process.env.CJ_API_KEY || process.env.CJ_ACCESS_TOKEN) {
    const token = await getCJToken();
    const json = await fetchTrackingJson(
      "https://developers.cjdropshipping.com/api2.0/v1/logistic/trackInfo?trackNumber=" + encodeURIComponent(number),
      { headers: { "CJ-Access-Token": token } }, 8000, 2,
    );
    if (!json.result || !Array.isArray(json.data)) throw new TrackingUnavailableError();
    const records: CJTrackingRecord[] = json.data;
    const matched = records.find(record =>
      [record.trackingNumber, record.lastTrackNumber].some(value => value?.toUpperCase() === number));
    // The official endpoint resolves ONE queried barcode to its last-mile
    // number (e.g. ZHPHD... -> Royal Mail ...GB). Its single resolved record
    // is valid; never choose an arbitrary record from a multi-record response.
    const record = matched || (records.length === 1 && records[0].trackingNumber ? records[0] : null);
    if (!record) {
      if (resolveReplacement && /^ZHPHD/i.test(number)) {
        const history = await fetchTrackingJson("https://developers.cjdropshipping.com/api2.0/v1/logistic/getOrderTrackHistory", {
          method: "POST", headers: { "Content-Type": "application/json", "CJ-Access-Token": token },
          body: JSON.stringify({ trackNumbers: [number] }),
        }, 8000, 2);
        if (!history.result || !Array.isArray(history.data)) throw new TrackingUnavailableError();
        const replacements = history.data.filter((item: { trackNumber?: string; currentTrackNumber?: string }) => item.trackNumber?.toUpperCase() === number && item.currentTrackNumber);
        if (replacements.length === 1 && replacements[0].currentTrackNumber.toUpperCase() !== number) {
          return fetchCJTracking(replacements[0].currentTrackNumber, false);
        }
      }
      return null;
    }
    return { ...record, destCountryCode: record.trackingTo, trackEvent: record.routes?.map(route => ({
      eventTime: route.acceptTime, activity: route.remark, location: route.acceptAddress || "", eventTimestamp: null,
    })) || record.trackEvent };
  }
  // Public tracker remains a fallback. Challenges/timeouts are failures, never scans.
  const json = await fetchTrackingJson("https://www.cjpacket.com/cj-logistics-api/refactoring/cjpacket/track", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify([number]),
  });
  if (!json.success || !Array.isArray(json.data)) throw new TrackingUnavailableError();
  return json.data.find((record: CJTrackingRecord) =>
    [record.cjTrackNumber, record.trackNumber, record.lastTrackNumber, record.trackingNumber]
      .some(value => value?.toUpperCase() === number)) || null;
}

async function fetchHyperSKUTracking(trackingNumber: string): Promise<HyperSKURecord | null> {
  if (!isTrackingBarcode(trackingNumber)) return null;
  const number = trackingNumber.trim().toUpperCase();
  const json = await fetchTrackingJson("https://track.hypersku.com/Index/track_all.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" },
    body: new URLSearchParams({ finalNo: number, doFinalType: "0", finalId: "0" }).toString(),
  }, 18000, 2);
  if (String(json.retCode) !== "100" || !json.retInfo) throw new TrackingUnavailableError();
  const key = Object.keys(json.retInfo).find(key => key.toUpperCase() === number);
  const record: HyperSKURecord | undefined = key ? json.retInfo[key] : undefined;
  if (!record || (record.finalNo && record.finalNo.toUpperCase() !== number)) return null;
  if (record.flow_0?.length || record.flow_1?.length || Number(record.status) > 0) return record;
  return null;
}

function isTrackingBarcode(value: string): boolean {
  return /^(?=.*\d)[a-z0-9-]{8,45}$/i.test(value.trim()) &&
    !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value.trim());
}

// -----------------------------------------------------------------------------
// DATA SANITIZATION (Prevents customer data leakage in public responses)
// -----------------------------------------------------------------------------
function maskName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "Verified Customer";
  const first = firstName ? firstName.trim() : "";
  const lastInitial = lastName ? `${lastName.trim().charAt(0)}.` : "";
  return `${first} ${lastInitial}`.trim();
}

function formatCJEventDate(eventTime: string): string {
  try {
    const parts = eventTime.trim().split(" ");
    if (parts.length === 2) {
      const [year, month, day] = parts[0].split("-").map(Number);
      const [hour, min] = parts[1].split(":").map(Number);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedDay = String(day).padStart(2, "0");
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMin = String(min).padStart(2, "0");
      const monthName = months[month - 1] || "Oct";
      return `${formattedDay} ${monthName} ${year}, ${formattedHour}:${formattedMin}`;
    }
  } catch {
    // fallback
  }
  return eventTime;
}

// Formats order date strictly in UK timezone (Europe/London), date only, without time
function formatUKOrderDate(timestampInSeconds?: number | null, fallbackDateStr?: string): string {
  if (timestampInSeconds) {
    try {
      const d = new Date(timestampInSeconds * 1000);
      return d
        .toLocaleDateString("en-GB", {
          timeZone: "Europe/London",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace("Sept", "Sep");
    } catch {
      // fallback
    }
  }

  if (fallbackDateStr) {
    return fallbackDateStr.split(",")[0].trim();
  }

  return "Not available";
}

// Helper to sanitize geographical origin places (strips "Origin Country", "China", "CN", etc.)
function cleanPlace(place?: string | null): string {
  if (!place) return "";
  const p = place.trim();
  if (
    /origin(?:\s+country)?/i.test(p) ||
    /\b(?:china|cn|prc|hong kong|hk)\b/i.test(p) ||
    /unknown/i.test(p)
  ) {
    return "";
  }
  return p;
}

// -----------------------------------------------------------------------------
// TEXT SANITIZATION (Removes origin country codes like CN/China for customer privacy)
// -----------------------------------------------------------------------------
export function sanitizeTrackingText(text: string): string {
  if (!text) return "";
  let cleaned = text;

  // 0. Remove parenthesized or bracketed Origin Country / Origin references (e.g. " - (Origin Country)", "(Origin Country)")
  cleaned = cleaned.replace(/\s*[-–—]?\s*\(\s*(?:origin\s*country|origin)\s*\)/gi, "");
  cleaned = cleaned.replace(/\s*[-–—]?\s*\[\s*(?:origin\s*country|origin)\s*\]/gi, "");
  cleaned = cleaned.replace(/\s*[-–—]?\s*\borigin\s+country\b/gi, "");
  cleaned = cleaned.replace(/\bthe country of origin\b/gi, "international facility");
  cleaned = cleaned.replace(/\bcountry of origin\b/gi, "international facility");
  cleaned = cleaned.replace(/\borigin international airport\b/gi, "international departure airport");
  cleaned = cleaned.replace(/\borigin facility\b/gi, "logistics processing hub");
  cleaned = cleaned.replace(/\boriginal facility\b/gi, "logistics processing hub");
  cleaned = cleaned.replace(/\boriginal airport\b/gi, "international departure airport");

  // 1. Remove parenthesized or bracketed CN / China / PRC / HK references
  cleaned = cleaned.replace(/\s*\(\s*(?:CN|China|PRC|HK|Hong Kong)\s*\)/gi, "");
  cleaned = cleaned.replace(/\s*\[\s*(?:CN|China|PRC|HK|Hong Kong)\s*\]/gi, "");

  // 2. Remove common Chinese logistics cities / hubs parenthesized or bracketed
  cleaned = cleaned.replace(
    /\s*\(\s*(?:Shenzhen|Guangzhou|Yiwu|Hangzhou|Shanghai|Beijing|Dongguan|Foshan|Ningbo|Zhejiang|Guangdong)\s*\)/gi,
    "",
  );
  cleaned = cleaned.replace(
    /\s*\[\s*(?:Shenzhen|Guangzhou|Yiwu|Hangzhou|Shanghai|Beijing|Dongguan|Foshan|Ningbo|Zhejiang|Guangdong)\s*\]/gi,
    "",
  );

  // 3. Remove trailing/leading or hyphenated ', CN', ' - CN', '/ CN', ' CN,'
  cleaned = cleaned.replace(/\s*[,/-]\s*(?:CN|China|PRC)\b/gi, "");
  cleaned = cleaned.replace(/\b(?:CN|China|PRC)\s*[,/-]\s*/gi, "");

  // 4. Clean phrases like 'hub CN', 'facility CN', etc.
  cleaned = cleaned.replace(/\b(?:hub|facility|center|terminal|depot|airport)\s+CN\b/gi, (m) =>
    m.replace(/\s+CN\b/i, ""),
  );

  // 5. Replace Chinese cities with 'International'
  cleaned = cleaned.replace(
    /\b(?:Shenzhen|Guangzhou|Yiwu|Hangzhou|Shanghai|Beijing|Dongguan|Foshan|Ningbo|Zhejiang|Guangdong)\b/gi,
    "International",
  );

  // 6. Replace phrases with China/PRC
  cleaned = cleaned.replace(/\b(?:in|from|to|at)\s+China\b/gi, "at international facility");
  cleaned = cleaned.replace(/\bChina\b/gi, "International Hub");
  cleaned = cleaned.replace(/\bChinese\b/gi, "International");

  // 7. Clean standalone CN (isolated uppercase word)
  cleaned = cleaned.replace(/(?<=\s|^|\b)CN(?=\s|$|\b|[.,;:!?])/g, "");

  // 8. Clean up extra punctuation/spacing
  cleaned = cleaned.replace(/\(\s*\)/g, "");
  cleaned = cleaned.replace(/\[\s*\]/g, "");
  cleaned = cleaned.replace(/\s{2,}/g, " ");
  cleaned = cleaned.replace(/\s+([.,;:!?])/g, "$1");
  cleaned = cleaned.replace(/,\s*,/g, ",");

  return cleaned.trim();
}

// Classify the carrier's original wording BEFORE applying display sanitization.
// A hub/depot arrival, customs scan or handoff is not a delivery-van scan.
export function isExplicitCustomerDelivery(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (/\b(undelivered|not delivered|not yet delivered|unsuccessful|failed|attempted|attempt|unable|pending|scheduled|expected|estimated|tomorrow|soon|will be|to be|out for delivery|returned|return to sender)\b/.test(t)) return false;
  if (/\b(delivered|handed|passed)\b.*\b(carrier|courier|partner|company|sender|depot|hub|facility|warehouse|airport|airline|sorting|distribution|delivery office|delivery unit|post office|service centre|service center|service point|collection point|pickup point|pick up point|parcelshop|locker|agent)\b/.test(t)) return false;
  return /^(?:delivered|delivery completed|delivery successful)\b/.test(t) ||
    /\b(?:successfully delivered|(?:item|package|parcel|shipment)(?: has been| was| is)? delivered|signed for by|delivered to (?:the )?(?:recipient|customer|addressee|neighbour|neighbor|safe place|front door|porch|letterbox|mailbox|reception))\b/.test(t);
}

export function classifyTrackingEvent(text: string): TrackingStage {
  const t = text.trim().toLowerCase();
  if (isExplicitCustomerDelivery(t)) return "DELIVERED";
  const pendingOrFailed = /\b(pending|not|not yet|failed|unsuccessful|attempt|attempted|unable|scheduled|expected|estimated|tomorrow|will be|awaiting|returned|return to sender|cancelled)\b/.test(t);
  if (!pendingOrFailed && /\b(out for delivery|on (?:the )?vehicle for delivery|with (?:your |the )?(?:delivery )?driver|with one of our drivers for delivery|with (?:the )?courier for delivery|loaded onto (?:the |a )?(?:courier |delivery )?van)\b/.test(t)) return "OUT_FOR_DELIVERY";
  if (/\b(label (?:created|generated)|(?:shipment |electronic |shipping )?information received|pre[ -]?advice|awaiting (?:your |the )?(?:item|parcel|shipment)|expecting (?:your |the )?(?:item|parcel)|ready for outbound|packed|packaged|warehouse is processing)\b/.test(t)) return "PROCESSING";
  return "IN_TRANSIT";
}

type CarrierEvent = TimelineEvent & { timestamp: number; destinationLeg: boolean };

// Bare timestamps are carrier wall-clock times, not server-local or UK times.
// Keep them as supplied; explicit offsets/epoch timestamps are used when present.
export function parseCarrierTimestamp(value: string): number | null {
  const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/i);
  if (!m) return null;
  const [, year, month, day, hour, minute, second = "0"] = m;
  const timestamp = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
  const d = new Date(timestamp);
  if (d.getUTCFullYear() !== +year || d.getUTCMonth() !== +month - 1 || d.getUTCDate() !== +day || +hour > 23 || +minute > 59 || +second > 59) return null;
  const result = m[8] ? Date.parse(value.replace(" ", "T")) : timestamp;
  return Number.isFinite(result) ? result : null;
}

export function buildCarrierEvents(cj: CJTrackingRecord | null, hyper: HyperSKURecord | null, now = Date.now()): CarrierEvent[] {
  const events: CarrierEvent[] = [];
  const add = (text: string, time: string, place: string | null | undefined, destinationLeg: boolean, epoch?: number | null) => {
    if (!text?.trim() || !time) return;
    const timestamp = epoch && Number.isFinite(epoch) ? (epoch < 1e12 ? epoch * 1000 : epoch) : parseCarrierTimestamp(time);
    const explicitZone = Boolean(epoch) || /(?:Z|[+-]\d{2}:?\d{2})$/i.test(time);
    // Unknown local zones can be up to UTC+14. Never let the host timezone
    // reorder scans; unambiguously future or malformed scans cannot set status.
    if (timestamp === null || !Number.isFinite(timestamp) || timestamp > now + (explicitZone ? 0 : 14 * 3600000)) return;
    const title = sanitizeTrackingText(text.trim());
    events.push({ title, description: cleanPlace(place) ? sanitizeTrackingText(cleanPlace(place)) : "Carrier checkpoint", date: formatCJEventDate(time), completed: true,
      stage: classifyTrackingEvent(text), timestamp, destinationLeg });
  };
  if (cj?.trackEvent?.length) {
    for (const e of cj.trackEvent) add(e.activity, e.eventTime, e.location, false, e.eventTimestamp);
  }
  if (hyper) {
    for (const e of hyper.flow_0 || []) add([e.eventThing, e.eventDetail].filter(Boolean).join(" — "), e.eventTime, e.place, false);
    for (const e of hyper.flow_1 || []) add([e.eventThing, e.eventDetail].filter(Boolean).join(" — "), e.eventTime, e.place, true);
  }
  const seen = new Set<string>();
  return events.sort((a, b) => b.timestamp - a.timestamp || Number(b.destinationLeg) - Number(a.destinationLeg)).filter(e => {
    const key = `${e.timestamp}:${e.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

function summarizeStage(stage: TrackingStage | "UNAVAILABLE") {
  const statuses = {
    ORDER_PLACED: { status: "Processing", progressPercentage: 10, activeStepIndex: 0 },
    PROCESSING: { status: "Processing", progressPercentage: 25, activeStepIndex: 0 },
    IN_TRANSIT: { status: "In Transit", progressPercentage: 50, activeStepIndex: 1 },
    OUT_FOR_DELIVERY: { status: "Out for Delivery", progressPercentage: 75, activeStepIndex: 2 },
    DELIVERED: { status: "Delivered", progressPercentage: 100, activeStepIndex: 3 },
    UNAVAILABLE: { status: "Tracking unavailable", progressPercentage: 0, activeStepIndex: -1 },
  } as const;
  return { ...statuses[stage], statusCode: stage };
}

// No elapsed-time, seed-timeline, or generic-product fallback is permitted here.
export async function lookupOrderTracking(rawQuery: string): Promise<TrackingData | null> {
  return lookupDeadline.run(Date.now() + 50000, () => lookupTracking(rawQuery));
}

async function lookupTracking(rawQuery: string): Promise<TrackingData | null> {
  const query = rawQuery.trim();
  if (!query || query.length > 100) return null;
  const key = query.toLowerCase();
  const historical = LEGACY_SHIPMENT_REFERENCES.find(ref =>
    [ref.id, ref.ref, ref.ref.replace(/^#/, ""), ref.trackingNumber, ...(ref.additionalTracking || [])]
      .some(value => value.toLowerCase() === key));
  const metadata = await fetchFromXPageLive(query, historical?.id);
  const liveOrder = metadata.order;
  const order = liveOrder ? { ...liveOrder, backend: historical?.backend } : null;
  const barcode = isTrackingBarcode(query) ? query.toUpperCase() : order?.trackingNumber || historical?.trackingNumber || "";
  let failed = false;
  let cj: CJTrackingRecord | null = null;
  let hyper: HyperSKURecord | null = null;
  const load = async (number: string) => {
    const preferHyper = historical?.backend === "hypersku";
    const preferCJ = historical?.backend === "cj" || (!preferHyper && /^(ZHPHD|JJD)/i.test(number));
    const results = await Promise.allSettled([
      preferHyper ? Promise.resolve(null) : verifiedCarrier("cj", number, () => fetchCJTracking(number)),
      preferCJ ? Promise.resolve(null) : verifiedCarrier("hypersku", number, () => fetchHyperSKUTracking(number)),
    ]);
    failed ||= results.some(r => r.status === "rejected");
    const result = {
      cj: results[0].status === "fulfilled" ? results[0].value : null,
      hyper: results[1].status === "fulfilled" ? results[1].value : null,
    };
    // Carrier prefixes are routing hints, not proof of the fulfillment supplier.
    if (preferCJ && !result.cj) {
      try { result.hyper = await verifiedCarrier("hypersku", number, () => fetchHyperSKUTracking(number)); }
      catch { failed = true; }
    }
    return result;
  };
  if (barcode) ({ cj, hyper } = await load(barcode));
  // CJ can expose the actual last-mile barcode even when its public tracker is
  // unavailable. Query that barcode dynamically; never hardcode a parcel result.
  const lastMile = cj?.lastTrackNumber || cj?.trackNumber;
  if (!cj?.trackEvent?.length && !hyper?.flow_0?.length && !hyper?.flow_1?.length && lastMile && lastMile.toUpperCase() !== barcode.toUpperCase()) {
    const alternate = await load(lastMile);
    if (alternate.cj?.trackEvent?.length) cj = { ...cj, trackEvent: alternate.cj.trackEvent };
    if (alternate.hyper) hyper = alternate.hyper;
  }
  if (!cj && !hyper && historical?.additionalTracking) {
    for (const number of historical.additionalTracking.slice(0, 2)) {
      const alternate = await load(number);
      if (alternate.cj || alternate.hyper) { cj = alternate.cj; hyper = alternate.hyper; break; }
    }
  }
  if (cj?.userOrderNum && !cj.userOrderNum.startsWith(BUUDY_HOSTING_ID + ":") && !order) return null;
  if (!order && !cj && !hyper) {
    if (failed || !metadata.available) throw new TrackingUnavailableError();
    return null;
  }
  const events = buildCarrierEvents(cj, hyper);
  // Use the newest valid carrier checkpoint, not the highest stage ever seen.
  const latest = events.at(0);
  let stage: TrackingStage | "UNAVAILABLE" = latest?.stage || "UNAVAILABLE";
  const summary = cj?.trackingStatus || cj?.statusDescription || "";
  const hasRawScans = Boolean(cj?.trackEvent?.length || hyper?.flow_0?.length || hyper?.flow_1?.length);
  if (!latest && !hasRawScans && /delivered|delivery|transit|en route|shipped|courier|facility|pickup|pick up|label|processing/i.test(summary)) stage = classifyTrackingEvent(summary);
  if (!latest && !hasRawScans && stage === "UNAVAILABLE" && hyper) {
    // Only documented statuses; 'Pick Up' means awaiting collection, not van dispatch.
    if (Number(hyper.status) === 1) stage = "DELIVERED";
    else if ([2, 3, 4, 5, 6, -2].includes(Number(hyper.status))) stage = "IN_TRANSIT";
  }
  // An order with no fulfillment barcode is still processing, but has no invented scans.
  if (!barcode && liveOrder) stage = "PROCESSING";
  // A provider failure is not a parcel stage. The client keeps a previously
  // verified result; a first lookup without evidence uses the normal retry UI.
  if (stage === "UNAVAILABLE") throw new TrackingUnavailableError();
  const rawCarrier = cj?.lastMileCarrier || cj?.providerEnName || hyper?.express_company_info_to?.enName || hyper?.express_company_info_to?.name || order?.shippingCarrier || hyper?.express_company_info?.enName || hyper?.express_company_info?.name || "";
  const carrierNumber = lastMile || hyper?.finalNo || barcode;
  const royalMail = /royal\s*mail/i.test(rawCarrier) || /^[A-Z]{2}\d{9}GB$/i.test(carrierNumber);
  const carrierName = royalMail ? "Royal Mail" : rawCarrier || "Carrier";
  const carrierTrackingUrl = royalMail
    ? `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(carrierNumber)}`
    : /^ZHPHD/i.test(barcode) ? `https://www.cjpacket.com/?trackingNumber=${encodeURIComponent(barcode)}`
    : `https://track.hypersku.com/?nums=${encodeURIComponent(barcode)}`;
  const destination = (order ? Array.from(new Set([order.customerCity, order.customerCountry].filter(Boolean))).join(", ") : cj?.destCountryCode) || "Not available";
  const isHyperOrder = historical?.backend === "hypersku" || (!cj && Boolean(hyper)) || /^QP\d+GB$/i.test(barcode);
  const statusMessage = !barcode ? "Your order is recorded. Carrier tracking has not been assigned yet."
    : "Latest information reported by the carrier. New scans appear after the carrier publishes them.";
  return {
    found: true, orderRef: isHyperOrder ? "" : order?.ref || "", trackingNumber: barcode || "Not yet assigned",
    carrierName, carrierTrackingUrl: barcode ? carrierTrackingUrl : undefined,
    recipientName: order ? maskName(order.customerFirstName, order.customerLastName) : undefined,
    destination, ...summarizeStage(stage), orderDate: formatUKOrderDate(order?.createdAt),
    estimatedDelivery: stage === "DELIVERED" && latest?.stage === "DELIVERED" ? latest.date : "",
    items: order?.items || [], timeline: events.map(e => ({ title: e.title, description: e.description, date: e.date, stage: e.stage, completed: e.completed })),
    checkedAt: new Date().toISOString(), statusMessage,
  };
}
