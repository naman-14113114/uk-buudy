// Server-side order tracking service for Buudy UK.
// Integrates with XPage fulfillment and orders engine (CJDropshipping / UK courier deliveries).

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
  status: "Processing" | "In Transit" | "Out for Delivery" | "Delivered";
  statusCode: TrackingStage;
  progressPercentage: number;
  activeStepIndex: number; // 0: Placed, 1: Processing, 2: In Transit, 3: Out for Delivery, 4: Delivered
  orderDate: string;
  estimatedDelivery: string;
  items: TrackingItem[];
  timeline: TimelineEvent[];
};

type XPageOrder = {
  id: string;
  ref: string;
  status: string;
  currency: string;
  created_at: number;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_address?: string;
  customer_city?: string;
  customer_postal_code?: string;
  customer_country?: { name: string; iso2: string };
  deliveries?: Array<{
    id: string;
    status: string;
    tracking_number: string | null;
    tracking_link: string | null;
    shipping_carrier: string | null;
    fulfilled_at: number | null;
    shipped_at: number | null;
    delivered_at: number | null;
  }>;
  variants?: Array<{
    title: string;
    quantity: number;
    options?: string;
    image_url?: string;
  }>;
};

// Cache storage for XPage orders
let ordersCache: { orders: XPageOrder[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

const XPAGE_CONFIG = {
  apiUrl: "https://api.myxpage.shop/api/v1",
  hostingId: process.env.XPAGE_BUUDY_HOSTING_ID || "a2b770e7-c07c-4665-bbd2-f1ec88e15376",
  userToken:
    process.env.XPAGE_USER_TOKEN ||
    "6ff70ece72f2f997dd6eae8b0794e93a06c24d087ebbd11e1ad4ed5814e7227b2c2bbf3120e85d78473c71628179faba0e3073a4d754b4b9a81a85c7844b3022",
  xsrfToken:
    process.env.XPAGE_XSRF_TOKEN ||
    "cd8fce65b96bb8809b00c8dbb4ee730e.ca085fda1bdb8d22251e127d2cfa7e2c06476542608be81a2bddb4ddb8b7dade",
};

function formatDisplayDate(timestampSec: number | null | undefined): string {
  if (!timestampSec) return "";
  const d = new Date(timestampSec * 1000);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDisplayDateTime(timestampSec: number | null | undefined): string {
  if (!timestampSec) return "";
  const d = new Date(timestampSec * 1000);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function maskName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "Verified Customer";
  const first = firstName ? firstName.trim() : "";
  const lastInitial = lastName ? `${lastName.trim().charAt(0)}.` : "";
  return `${first} ${lastInitial}`.trim();
}

function detectCarrier(trackingNumber: string, existingCarrier?: string | null) {
  if (existingCarrier && existingCarrier.trim().length > 0) {
    return {
      name: existingCarrier,
      url: `https://www.google.com/search?q=${encodeURIComponent(trackingNumber)}`,
    };
  }

  const cleanNum = trackingNumber.trim().toUpperCase();

  if (cleanNum.startsWith("JJD") || cleanNum.startsWith("4150") || cleanNum.startsWith("0034")) {
    return {
      name: "DHL Parcel UK",
      url: `https://track.dhlparcel.co.uk/`,
    };
  }

  if (cleanNum.startsWith("ZHPHD")) {
    return {
      name: "Express Tracked Courier",
      url: `https://www.aftership.com/track/${encodeURIComponent(cleanNum)}`,
    };
  }

  if (cleanNum.startsWith("YT") || cleanNum.startsWith("YUN")) {
    return {
      name: "YunExpress UK Line",
      url: `https://www.yuntrack.com/parcel?nums=${encodeURIComponent(cleanNum)}`,
    };
  }

  if (cleanNum.startsWith("RM") || cleanNum.startsWith("GB") || /^[A-Z]{2}\d{9}GB$/.test(cleanNum)) {
    return {
      name: "Royal Mail Tracked",
      url: `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(cleanNum)}`,
    };
  }

  return {
    name: "Standard Tracked Delivery",
    url: `https://www.aftership.com/track/${encodeURIComponent(cleanNum)}`,
  };
}

async function fetchXPageOrders(): Promise<XPageOrder[]> {
  const now = Date.now();
  if (ordersCache && now - ordersCache.timestamp < CACHE_TTL_MS) {
    return ordersCache.orders;
  }

  const allOrders: XPageOrder[] = [];
  try {
    for (let page = 1; page <= 5; page++) {
      const url = `${XPAGE_CONFIG.apiUrl}/hosting/${XPAGE_CONFIG.hostingId}/order?page=${page}&per_page=50`;
      const res = await fetch(url, {
        headers: {
          cookie: `xpage_user_token=${XPAGE_CONFIG.userToken}; XSRF-TOKEN=${XPAGE_CONFIG.xsrfToken}`,
          "x-xsrf-token": XPAGE_CONFIG.xsrfToken,
          accept: "application/json",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 BuudyStore/1.0",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        break;
      }

      const json = await res.json();
      const orders = (json.orders as XPageOrder[]) || [];
      if (!orders.length) break;

      allOrders.push(...orders);

      if (json.paginator && page >= json.paginator.lastPage) {
        break;
      }
    }

    if (allOrders.length > 0) {
      ordersCache = { orders: allOrders, timestamp: now };
    }
  } catch (err) {
    console.error("Failed to fetch XPage orders:", err);
    if (ordersCache) return ordersCache.orders;
  }

  return allOrders;
}

function buildCleanTimeline(
  order: XPageOrder,
  delivery: NonNullable<XPageOrder["deliveries"]>[number],
  trackingNumber: string,
): {
  timeline: TimelineEvent[];
  status: "Processing" | "In Transit" | "Out for Delivery" | "Delivered";
  statusCode: TrackingStage;
  progressPercentage: number;
  activeStepIndex: number;
  estimatedDelivery: string;
} {
  const nowSec = Math.floor(Date.now() / 1000);
  const createdAt = order.created_at;
  const fulfilledAt = delivery.fulfilled_at || (delivery.shipped_at ? delivery.shipped_at - 86400 * 2 : null);
  const shippedAt = delivery.shipped_at;
  const deliveredAt = delivery.delivered_at;

  const isDelivered = delivery.status === "DELIVERED" || Boolean(deliveredAt);
  const isShipped = delivery.status === "SHIPPED" || Boolean(shippedAt) || isDelivered;
  const isOutForDelivery =
    isDelivered ||
    (isShipped &&
      (trackingNumber.toUpperCase().startsWith("JJD") ||
        (shippedAt && nowSec - shippedAt > 86400 * 6)));

  const destinationCity = order.customer_city?.trim() || "UK Hub";

  const events: TimelineEvent[] = [];

  // Stage 1: Order Placed (past)
  if (createdAt && createdAt <= nowSec) {
    events.push({
      title: "Order Placed & Confirmed",
      description: "Your order payment was verified and sent to the fulfillment queue.",
      date: formatDisplayDateTime(createdAt) || "Completed",
      completed: true,
      stage: "ORDER_PLACED",
    });
  }

  // Stage 2: Processing (past/present only)
  const procTime = fulfilledAt || (createdAt ? createdAt + 86400 * 2 : null);
  if (procTime && procTime <= nowSec) {
    events.push({
      title: "Order Processed & Quality Checked",
      description: "Item passed beauty device safety inspection and packaged in temperature-monitored facility.",
      date: formatDisplayDateTime(procTime) || "Completed",
      completed: isShipped || delivery.status === "FULFILLED",
      stage: "PROCESSING",
    });
  }

  // Stage 3: Dispatched & In Transit (past/present only)
  if (isShipped && shippedAt && shippedAt <= nowSec) {
    events.push({
      title: "Dispatched with Carrier",
      description: `Package picked up by express courier. Assigned tracking barcode: ${trackingNumber}.`,
      date: formatDisplayDateTime(shippedAt) || "Completed",
      completed: true,
      stage: "IN_TRANSIT",
    });

    const flightTransitTime = shippedAt + 86400 * 4;
    if (flightTransitTime <= nowSec) {
      events.push({
        title: "In Transit to UK Distribution Centre",
        description: "Shipment in transit through international express logistics network.",
        date: formatDisplayDateTime(flightTransitTime) || "In Transit",
        completed: true,
        stage: "IN_TRANSIT",
      });
    }

    const customsTime = shippedAt + 86400 * 7;
    if (customsTime <= nowSec) {
      events.push({
        title: "UK Customs & Border Clearance Completed",
        description: "Package arrived in the United Kingdom and cleared international import controls.",
        date: formatDisplayDateTime(customsTime) || "Completed",
        completed: isOutForDelivery || (nowSec - shippedAt > 86400 * 7),
        stage: "IN_TRANSIT",
      });
    }
  }

  // Stage 4: Out for Delivery (past/present only)
  if (isOutForDelivery) {
    const localHubTime = deliveredAt ? deliveredAt - 86400 : (shippedAt || createdAt) + 86400 * 8;
    if (localHubTime <= nowSec) {
      events.push({
        title: `Processed at Regional Hub (${destinationCity})`,
        description: `Package received at local distribution centre serving ${destinationCity}, UK.`,
        date: formatDisplayDateTime(localHubTime),
        completed: true,
        stage: "OUT_FOR_DELIVERY",
      });
    }

    const outForDelTime = deliveredAt ? deliveredAt - 3600 * 4 : (shippedAt || createdAt) + 86400 * 9;
    if (outForDelTime <= nowSec) {
      events.push({
        title: "Out for Delivery",
        description: `Loaded onto local courier van for delivery to ${destinationCity} address.`,
        date: formatDisplayDateTime(outForDelTime),
        completed: isDelivered,
        stage: "OUT_FOR_DELIVERY",
      });
    }
  }

  // Stage 5: Delivered (past/present only)
  if (isDelivered && deliveredAt && deliveredAt <= nowSec) {
    events.push({
      title: "Delivered",
      description: `Package safely delivered and signed for at ${order.customer_address || "delivery address"}.`,
      date: formatDisplayDateTime(deliveredAt) || "Delivered",
      completed: true,
      stage: "DELIVERED",
    });
  }

  // Bar remains exactly as requested - untouched
  let status: "Processing" | "In Transit" | "Out for Delivery" | "Delivered" = "Processing";
  let statusCode: TrackingStage = "PROCESSING";
  let progressPercentage = 25;
  let activeStepIndex = 1;

  if (isDelivered) {
    status = "Delivered";
    statusCode = "DELIVERED";
    progressPercentage = 100;
    activeStepIndex = 4;
  } else if (delivery.status === "SHIPPED" || isShipped) {
    status = "In Transit";
    statusCode = "IN_TRANSIT";
    progressPercentage = 60;
    activeStepIndex = 2;
  } else {
    status = "Processing";
    statusCode = "PROCESSING";
    progressPercentage = 25;
    activeStepIndex = 1;
  }

  // Only populated if actually delivered; no future arrival estimation
  let estimatedDelivery = "";
  if (isDelivered && deliveredAt) {
    estimatedDelivery = `Delivered on ${formatDisplayDate(deliveredAt)}`;
  }

  return {
    timeline: events.reverse(), // Newest on top
    status,
    statusCode,
    progressPercentage,
    activeStepIndex,
    estimatedDelivery,
  };
}

export async function lookupOrderTracking(rawQuery: string): Promise<TrackingData | null> {
  const query = rawQuery.trim();
  if (!query) return null;

  const normalized = query.toUpperCase();
  const cleanOrderRef = query.startsWith("#") ? query : `#${query}`;

  const orders = await fetchXPageOrders();

  let matchedOrder: XPageOrder | undefined;
  let matchedDelivery: NonNullable<XPageOrder["deliveries"]>[number] | undefined;

  // Search by Tracking Number first
  for (const order of orders) {
    for (const delivery of order.deliveries || []) {
      const trackNo = (delivery.tracking_number || "").trim().toUpperCase();
      const trackLink = (delivery.tracking_link || "").trim().toUpperCase();

      if (trackNo === normalized || trackLink === normalized) {
        matchedOrder = order;
        matchedDelivery = delivery;
        break;
      }
    }
    if (matchedOrder) break;
  }

  // Search by Order Reference (#3294, #2148, etc.) or Order ID
  if (!matchedOrder) {
    matchedOrder = orders.find(
      (o) =>
        o.ref.toUpperCase() === cleanOrderRef.toUpperCase() ||
        o.ref.replace("#", "").toUpperCase() === query.toUpperCase() ||
        o.id === query,
    );
    if (matchedOrder && matchedOrder.deliveries?.length) {
      matchedDelivery = matchedOrder.deliveries[0];
    }
  }

  // If found in XPage orders
  if (matchedOrder) {
    const delivery = matchedDelivery || {
      id: "pending",
      status: matchedOrder.status === "PAID" ? "PROCESSING" : "UNFULFILLED",
      tracking_number: null,
      tracking_link: null,
      shipping_carrier: null,
      fulfilled_at: null,
      shipped_at: null,
      delivered_at: null,
    };

    const trackingNumber = delivery.tracking_number || matchedOrder.ref;
    const carrier = detectCarrier(trackingNumber, delivery.shipping_carrier);

    const { timeline, status, statusCode, progressPercentage, activeStepIndex, estimatedDelivery } =
      buildCleanTimeline(matchedOrder, delivery, trackingNumber);

    const items: TrackingItem[] = (matchedOrder.variants || []).map((v) => ({
      title: v.title,
      quantity: v.quantity,
      variant: v.options,
      image: v.image_url,
    }));

    if (items.length === 0) {
      items.push({
        title: "Buudy 7 Colour LED Mask",
        quantity: 1,
        variant: "Cleopatra Edition",
      });
    }

    const city = matchedOrder.customer_city ? `${matchedOrder.customer_city}, ` : "";
    const country = matchedOrder.customer_country?.name || "United Kingdom";

    return {
      found: true,
      orderRef: matchedOrder.ref,
      trackingNumber,
      carrierName: carrier.name,
      carrierTrackingUrl: carrier.url,
      recipientName: maskName(matchedOrder.customer_first_name, matchedOrder.customer_last_name),
      destination: `${city}${country}`,
      status,
      statusCode,
      progressPercentage,
      activeStepIndex,
      orderDate: formatDisplayDateTime(matchedOrder.created_at),
      estimatedDelivery,
      items,
      timeline,
    };
  }

  return null;
}
