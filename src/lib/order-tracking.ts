// Server-side order tracking service for Buudy UK.
// Integrates dynamically with XPage order records and live CJ Logistics / AfterShip carrier network.

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

type CJTrackEvent = {
  eventTime: string;
  activity: string;
  location: string;
  eventTimestamp: number | null;
};

type CJTrackingRecord = {
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
  express_company_info?: { website?: string; name?: string; contact?: string };
  express_company_info_to?: { website?: string; name?: string; contact?: string };
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
  customTimeline?: TimelineEvent[];
  additionalTracking?: string[];
};

const BUUDY_HOSTING_ID = process.env.XPAGE_BUUDY_HOSTING_ID || "a2b770e7-c07c-4665-bbd2-f1ec88e15376";

let activeXPageToken =
  process.env.XPAGE_USER_TOKEN ||
  "807a858a7cd4ac72ba0e6b323f26cbb39e595179b319ba3a31bbcc70d4409bf0d7e208fe3d9c9a837e009740d4cc19eb1eb3769e52fbf8a48a24cb3095fc47a3";

// -----------------------------------------------------------------------------
// IN-MEMORY ORDERS MAP (Stores Buudy orders for fast lookup & dynamic expansion)
// -----------------------------------------------------------------------------
const ordersMap = new Map<string, CachedOrder>();

// Initial setup: Pre-seed Map with active Buudy store orders
const INITIAL_BUUDY_ORDERS: Array<{
  id: string;
  ref: string;
  first: string;
  last: string;
  city: string;
  country: string;
  createdAt: number;
  tracking: string | null;
  carrier?: string | null;
  backend?: "hypersku" | "cj";
  items?: TrackingItem[];
  customTimeline?: TimelineEvent[];
  additionalTracking?: string[];
}> = [
  {
    id: "a323bb89-82bc-400d-859f-55d8df748b60",
    ref: "#2570",
    first: "Verified",
    last: "Mayoro",
    city: "Horley",
    country: "United Kingdom",
    createdAt: 1793738655,
    tracking: null,
  },
  {
    id: "a3179b57-a68e-47ab-82cd-d1a46cf932bd",
    ref: "#2560",
    first: "Frances",
    last: "Carroll",
    city: "Dundee",
    country: "United Kingdom",
    createdAt: 1793217857,
    tracking: "QP272594975GB",
    carrier: "Royal Mail Tracked",
    backend: "hypersku",
  },
  {
    id: "a3177e7c-bdba-4792-a7da-fc6249a797f1",
    ref: "#2559",
    first: "Frances",
    last: "Carroll",
    city: "Dundee",
    country: "United Kingdom",
    createdAt: 1793213016,
    tracking: "QP272594984GB",
    carrier: "Royal Mail Tracked",
    backend: "hypersku",
  },
  {
    id: "a3172e7b-7d83-4a6e-8b5e-58ce95d62404",
    ref: "#2557",
    first: "Dickie",
    last: "Copner",
    city: "Cannock",
    country: "United Kingdom",
    createdAt: 1793199594,
    tracking: "QP272594967GB",
    carrier: "Royal Mail Tracked",
    backend: "hypersku",
  },
  {
    id: "a3151b5a-4fb7-4e77-8950-40df1412584d",
    ref: "#2552",
    first: "Beverley",
    last: "Godding",
    city: "Tenby",
    country: "United Kingdom",
    createdAt: 1793110485,
    tracking: "ZHPHD261027933790ML",
  },
  {
    id: "a314e19e-f578-4a52-8af4-f474c88706e1",
    ref: "#2551",
    first: "Verified",
    last: "Gencarlo",
    city: "Columbiana",
    country: "United States",
    createdAt: 1793100799,
    tracking: null,
  },
  {
    id: "a314df25-a172-49e3-bb05-36789a7d4e55",
    ref: "#2550",
    first: "Verified",
    last: "Gencarlo",
    city: "Testaccio",
    country: "Italy",
    createdAt: 1793100384,
    tracking: null,
  },
  {
    id: "a3114a09-a195-4ecf-bcf3-90af426fa03f",
    ref: "#2547",
    first: "Katrina",
    last: "Farquharson",
    city: "Scottish Borders",
    country: "United Kingdom",
    createdAt: 1792946519,
    tracking: "ZHPHD261026925943ML",
  },
  {
    id: "a3114109-40ce-4906-b8cd-eff85424618a",
    ref: "#2546",
    first: "Katrina",
    last: "Farquharson",
    city: "Scottish Borders",
    country: "United Kingdom",
    createdAt: 1792945008,
    tracking: null,
  },
  {
    id: "a3100d5e-8e7a-41d7-a213-2ba70af50f95",
    ref: "#2541",
    first: "Conny",
    last: "Doros",
    city: "St Albans",
    country: "United Kingdom",
    createdAt: 1792893391,
    tracking: "ZHPHD261025429457ML",
  },
  {
    id: "a30ecd4d-ee84-407d-b5cc-545441f1fce3",
    ref: "#2538",
    first: "Jean",
    last: "George",
    city: "Durham",
    country: "United Kingdom",
    createdAt: 1792839693,
    tracking: "ZHPHD261024120642ML",
    carrier: "Yodel UK",
    additionalTracking: ["JJD0002234587495447"],
    items: [
      {
        title: "Buudy LED Mask + Premium Travel Box",
        quantity: 1,
        variant: "Cleopatra Edition",
        image: "/images/products/buudy-led-mask/01-buudy-led-mask-front.webp",
      },
      {
        title: "Buudy LED Torch",
        quantity: 1,
        variant: "BUUDY TORCH BUNDLE",
        image: "/images/products/buudy-red-torch/01-buudy-red-light-therapy-torch-main.webp",
      },
      {
        title: "Skincare E-Book",
        quantity: 1,
        variant: "Digital Guide",
        image: "/images/products/skincare-ebook/skincare-ebook.png",
      },
    ],
    customTimeline: [
      {
        title: "Your parcel has arrived at your delivery depot STOCKTON ON TEES SERVICE CENTRE",
        description: "Your parcel has arrived at your local delivery depot (Stockton-on-Tees Service Centre) serving Durham. Handed over for final delivery dispatch via Yodel UK (Last Mile Tracking: JJD0002234587495447).",
        date: "05 Nov 2026, 02:05",
        completed: true,
        stage: "OUT_FOR_DELIVERY",
      },
      {
        title: "Your parcel is at our national hub HATFIELD TERMINAL",
        description: "Your parcel has been processed through the national sorting terminal at Hatfield.",
        date: "04 Nov 2026, 13:38",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Arrived at UK Destination Airport",
        description: "Flight landed in the United Kingdom. Package received at airport cargo depot and cleared customs border controls.",
        date: "02 Nov 2026, 08:44",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "In Transit via International Air Cargo",
        description: "Air freight flight departed international logistics hub bound for the United Kingdom.",
        date: "31 Oct 2026, 17:54",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Export Customs & Security Clearance Completed",
        description: "Package completed international export inspection and airport security clearance.",
        date: "26 Oct 2026, 11:20",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Dispatched with Carrier",
        description: "Package picked up by express courier. Assigned tracking barcode: ZHPHD261024120642ML (Yodel barcode: JJD0002234587495447).",
        date: "25 Oct 2026, 15:00",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Order Placed & Confirmed",
        description: "Your order payment was verified and sent to fulfillment queue.",
        date: "24 Oct 2026, 14:41",
        completed: true,
        stage: "ORDER_PLACED",
      },
    ],
  },
  {
    id: "a30d5a5a-554c-4708-ac8f-28355370d28b",
    ref: "#2536",
    first: "Paula",
    last: "Davey",
    city: "London",
    country: "United Kingdom",
    createdAt: 1792777457,
    tracking: "ZHPHD261024737846ML",
  },
  {
    id: "a30d0126-475a-43df-93bd-07f767e05af2",
    ref: "#2534",
    first: "Jean",
    last: "George",
    city: "Durham",
    country: "United Kingdom",
    createdAt: 1792762491,
    tracking: null,
  },
  {
    id: "a30ca9ea-f70a-436c-a58b-910af4d249bd",
    ref: "#2533",
    first: "Wendy",
    last: "Smith",
    city: "Sidbury",
    country: "United Kingdom",
    createdAt: 1792764000,
    tracking: "QP118176663GB",
    carrier: "Royal Mail Tracked",
    items: [
      {
        title: "Buudy LED Mask",
        quantity: 1,
        variant: "Cleopatra Edition",
        image: "/images/products/buudy-led-mask/01-buudy-led-mask-front.webp",
      },
      {
        title: "Buudy LED Torch",
        quantity: 1,
        variant: "BUUDY TORCH BUNDLE",
        image: "/images/products/buudy-red-torch/01-buudy-red-light-therapy-torch-main.webp",
      },
      {
        title: "Skincare E-Book",
        quantity: 1,
        variant: "Digital Guide",
        image: "/images/products/skincare-ebook/skincare-ebook.png",
      },
    ],
    customTimeline: [
      {
        title: "Shipment Received in Depot, Princess Royal Parcel Hub",
        description: "Package received and scanned at Royal Mail Princess Royal Parcel Hub distribution depot. Handed over for regional dispatch.",
        date: "01 Nov 2026, 18:37",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Arrived at UK Destination Airport",
        description: "Flight landed in the United Kingdom. Package received at airport cargo depot and cleared customs border controls.",
        date: "30 Oct 2026, 14:15",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "In Transit via International Air Cargo",
        description: "Air freight flight departed international logistics hub bound for the United Kingdom.",
        date: "28 Oct 2026, 09:30",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Export Customs & Security Clearance Completed",
        description: "Package completed international export inspection and airport security clearance.",
        date: "26 Oct 2026, 11:20",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Dispatched with Carrier",
        description: "Package picked up by express courier. Assigned tracking barcode: QP118176663GB.",
        date: "25 Oct 2026, 15:00",
        completed: true,
        stage: "IN_TRANSIT",
      },
      {
        title: "Order Placed & Confirmed",
        description: "Your order payment was verified and sent to fulfillment queue.",
        date: "23 Oct 2026, 15:00",
        completed: true,
        stage: "ORDER_PLACED",
      },
    ],
  },
  {
    id: "a30aa6d7-1044-47a7-b05b-263d2e398bc9",
    ref: "#2532",
    first: "Tony",
    last: "Whitfield",
    city: "Consett",
    country: "United Kingdom",
    createdAt: 1792661441,
    tracking: "ZHPHD261022960967ML",
  },
  {
    id: "a2efacf2-ca6f-4433-8c85-f1ae782d7006",
    ref: "#2458",
    first: "Krisella",
    last: "Lyons",
    city: "Sandbach",
    country: "United Kingdom",
    createdAt: 1791502824,
    tracking: "ZHPHD261009289883ML",
  },
  {
    id: "a2efa948-2f65-468b-b7c7-4b81bbe7a650",
    ref: "#2457",
    first: "Krisella",
    last: "Lyons",
    city: "Sandbach",
    country: "United Kingdom",
    createdAt: 1791502209,
    tracking: "ZHPHD261009456442ML",
  },
  {
    id: "a2eb419a-c0c2-452d-bee8-9379d1f7c917",
    ref: "#2452",
    first: "Jayne",
    last: "Mannion",
    city: "Edinburgh",
    country: "United Kingdom",
    createdAt: 1791313016,
    tracking: "ZHPHD261007656662ML",
  },
  {
    id: "a2eb40f3-1063-4147-b5d3-6cd1767a0dc6",
    ref: "#2451",
    first: "Jayne",
    last: "Mannion",
    city: "Edinburgh",
    country: "United Kingdom",
    createdAt: 1791312906,
    tracking: null,
  },
  {
    id: "a2e75c84-d950-4bb4-9ed8-c59ffa2cb743",
    ref: "#2441",
    first: "Sheree",
    last: "Baxter",
    city: "Edderton, Highland",
    country: "United Kingdom",
    createdAt: 1791145733,
    tracking: null,
  },
  {
    id: "a2e6bbfc-861e-45b0-ad11-c16aedb95209",
    ref: "#2440",
    first: "Daniel",
    last: "Mcdaid",
    city: "Cleethorpes",
    country: "United Kingdom",
    createdAt: 1791118800,
    tracking: "ZHPHD261004881402ML",
  },
  {
    id: "a2e285e2-4bc1-4f7c-aea3-582965edeca7",
    ref: "#2400",
    first: "Lucy",
    last: "Green",
    city: "Knaphill",
    country: "United Kingdom",
    createdAt: 1790937925,
    tracking: null,
  },
  {
    id: "a2e260d0-c390-4538-860c-04e58690a783",
    ref: "#2397",
    first: "Julia",
    last: "Gaskell",
    city: "Spaxton, Bridgwater",
    country: "United Kingdom",
    createdAt: 1790931706,
    tracking: "ZHPHD261005471952ML",
  },
  {
    id: "a2e11f24-bfb9-4738-ba57-447e6106d8e5",
    ref: "#2387",
    first: "Sharon",
    last: "Waters",
    city: "Horsham",
    country: "United Kingdom",
    createdAt: 1790877738,
    tracking: null,
  },
  {
    id: "a2dfd1d0-4759-46dd-92ce-9639ef615e1a",
    ref: "#2374",
    first: "Sahil",
    last: "Ji",
    city: "New York",
    country: "United Kingdom",
    createdAt: 1790821814,
    tracking: null,
  },
  {
    id: "a2dfcf1f-4dc5-4549-8969-565ae1de5874",
    ref: "#2373",
    first: "Customer",
    last: "Smith",
    city: "London",
    country: "United Kingdom",
    createdAt: 1790821363,
    tracking: null,
  },
  {
    id: "a2dfcc7f-720e-43b8-b2b1-e63980a7c171",
    ref: "#2371",
    first: "Customer",
    last: "Smith",
    city: "UK Ellesmere Port",
    country: "United Kingdom",
    createdAt: 1790820923,
    tracking: null,
  },
  {
    id: "a2dfca7c-1900-4506-abab-184c6b0d03fd",
    ref: "#2370",
    first: "Karen",
    last: "Smith",
    city: "Ellesmere Port",
    country: "United Kingdom",
    createdAt: 1790820585,
    tracking: null,
  },
  {
    id: "a2dfbac3-d4ac-4ba5-a970-70fdc03a7cdf",
    ref: "#2363",
    first: "John",
    last: "Brobbey",
    city: "Slough",
    country: "United Kingdom",
    createdAt: 1790817948,
    tracking: "ZHPHD261005745484ML",
  },
  {
    id: "a2de238b-47d7-4db3-bbef-8b19267048e9",
    ref: "#2351",
    first: "Dolly",
    last: "Flores",
    city: "London",
    country: "United Kingdom",
    createdAt: 1790749627,
    tracking: null,
  },
  {
    id: "a2d8cc79-a8d5-4108-bc38-3231313d4f3f",
    ref: "#2309",
    first: "Louise",
    last: "Florence",
    city: "Gosport, Hampshire",
    country: "United Kingdom",
    createdAt: 1790520271,
    tracking: "JJD0002234587412692",
  },
  {
    id: "a2d75673-b2d6-46e8-8026-2b7b39cb4b8c",
    ref: "#2304",
    first: "Julie",
    last: "Cameron",
    city: "Ascot, Berkshire",
    country: "United Kingdom",
    createdAt: 1790457520,
    tracking: "JJD0002234587412691",
  },
  {
    id: "a2d676ea-3388-4b23-8c76-bf6be39d371f",
    ref: "#2295",
    first: "Customer",
    last: "Usagai",
    city: "Aberdeen",
    country: "United Kingdom",
    createdAt: 1790420017,
    tracking: null,
  },
  {
    id: "a2d67367-2cb8-488e-a544-42910f679a03",
    ref: "#2293",
    first: "Anna",
    last: "Winczura",
    city: "Aberdeen",
    country: "United Kingdom",
    createdAt: 1790419428,
    tracking: null,
  },
  {
    id: "a2d2521d-7895-4e3b-9fa3-5f14fd910f8b",
    ref: "#2260",
    first: "Katie",
    last: "Hardy",
    city: "Shipmeadow",
    country: "United Kingdom",
    createdAt: 1790242044,
    tracking: null,
  },
  {
    id: "a2d25679-e680-45af-bbee-dbc306170a1a",
    ref: "#2266",
    first: "Katie",
    last: "Hardy",
    city: "Shipmeadow",
    country: "United Kingdom",
    createdAt: 1790242776,
    tracking: "JJD0002234587407213",
  },
  {
    id: "a2cd5ae8-ecf9-426a-87a8-47cddc821c8d",
    ref: "#2223",
    first: "Karen",
    last: "Smith",
    city: "Ellesmere Port",
    country: "United Kingdom",
    createdAt: 1790028772,
    tracking: null,
  },
  {
    id: "a2cca0f0-6c24-472b-9c8f-385026c7fdee",
    ref: "#2220",
    first: "Karen",
    last: "Smith",
    city: "Ellesmere Port",
    country: "United Kingdom",
    createdAt: 1789997571,
    tracking: null,
  },
  {
    id: "a2ca1b6f-2c5e-444f-9ebc-195f7f84c29e",
    ref: "#2213",
    first: "Marie",
    last: "Laskowksi",
    city: "Huddersfield",
    country: "United Kingdom",
    createdAt: 1789889273,
    tracking: "JJD0002234587400459",
  },
  {
    id: "a2c84aa3-2fd8-46a8-9a01-fd5a67df7627",
    ref: "#2193",
    first: "Marie",
    last: "Hockey",
    city: "Minster",
    country: "United Kingdom",
    createdAt: 1789811293,
    tracking: "JJD0002234587400128",
  },
  {
    id: "a2c64af9-e9fd-4270-8481-d3048316be59",
    ref: "#2154",
    first: "Katy",
    last: "Wells",
    city: "Leicester",
    country: "United Kingdom",
    createdAt: 1789725451,
    tracking: null,
  },
  {
    id: "a2c6495f-dc00-4ca0-bbcd-4a0d3ebd401c",
    ref: "#2153",
    first: "Brandon",
    last: "Haigh",
    city: "Erdington, Birmingham",
    country: "United Kingdom",
    createdAt: 1789725182,
    tracking: "JJD0002234587400454",
  },
  {
    id: "a2c645b4-85c5-4471-a880-71940f5b21f1",
    ref: "#2148",
    first: "Pauline",
    last: "Mitchell",
    city: "Glasgow",
    country: "United Kingdom",
    createdAt: 1789724566,
    tracking: "JJD0002234587400456",
  },
  {
    id: "a2c5454a-e674-4f1b-83a3-2adf4e0891af",
    ref: "#2124",
    first: "Pauline",
    last: "Mitchell",
    city: "Glasgow",
    country: "United Kingdom",
    createdAt: 1789681547,
    tracking: null,
  },
  {
    id: "a2c4b1cb-374b-4ae3-8290-294d8481c2f9",
    ref: "#2107",
    first: "Chloe",
    last: "Lofas",
    city: "Manchester",
    country: "United Kingdom",
    createdAt: 1789656801,
    tracking: "JJD0002234587387104",
  },
  {
    id: "a2bbabf8-70e3-4518-8d3f-85f024f051c2",
    ref: "#2000",
    first: "Sahil",
    last: "Ji",
    city: "Delhi",
    country: "United Kingdom",
    createdAt: 1789269277,
    tracking: null,
  },
];

function registerOrderInMap(record: CachedOrder) {
  ordersMap.set(record.id.toLowerCase(), record);
  ordersMap.set(record.ref.toLowerCase(), record);
  ordersMap.set(record.ref.replace("#", "").toLowerCase(), record);
  if (record.trackingNumber) {
    ordersMap.set(record.trackingNumber.toLowerCase(), record);
  }
  if (record.additionalTracking && Array.isArray(record.additionalTracking)) {
    for (const alt of record.additionalTracking) {
      if (alt) ordersMap.set(alt.toLowerCase(), record);
    }
  }
}

// Populate initial Map
for (const ord of INITIAL_BUUDY_ORDERS) {
  registerOrderInMap({
    id: ord.id,
    ref: ord.ref,
    customerFirstName: ord.first,
    customerLastName: ord.last,
    customerCity: ord.city,
    customerCountry: ord.country,
    createdAt: ord.createdAt,
    trackingNumber: ord.tracking,
    shippingCarrier: ord.carrier || null,
    backend: ord.backend,
    customTimeline: ord.customTimeline,
    additionalTracking: ord.additionalTracking,
    items: ord.items || [
      {
        title: "Buudy 7 Colour LED Mask",
        quantity: 1,
        variant: "Cleopatra Edition",
        image: "/images/products/buudy-led-mask/01-buudy-led-mask-front.webp",
      },
      {
        title: "Free Buudy Red Light Torch",
        quantity: 1,
        variant: "Targeted Therapy Gift (£70 Value)",
        image: "/images/products/buudy-red-torch/01-buudy-red-light-therapy-torch-main.webp",
      },
    ],
  });
}

// -----------------------------------------------------------------------------
// XPAGE RE-AUTHENTICATION & DYNAMIC FETCH ENGINE
// -----------------------------------------------------------------------------
async function refreshXPageToken(): Promise<string | null> {
  const email = process.env.XPAGE_EMAIL || "sahiljainsj009@gmail.com";
  const password = process.env.XPAGE_PASSWORD || "Springroll@90";

  try {
    const res = await fetch("https://api.myxpage.shop/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json.token) {
        activeXPageToken = json.token;
        return activeXPageToken;
      }
    }
  } catch (err) {
    console.error("XPage auto-login error:", err);
  }

  return null;
}

async function fetchFromXPageLive(query: string, orderId?: string): Promise<CachedOrder | null> {
  const searchTerms = [query];
  if (orderId && !searchTerms.includes(orderId)) {
    searchTerms.unshift(orderId);
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    for (const term of searchTerms) {
      try {
        const url = `https://api.myxpage.shop/api/v1/hosting/${BUUDY_HOSTING_ID}/order?search=${encodeURIComponent(term)}&page=1&per_page=10`;
        const res = await fetch(url, {
          headers: {
            cookie: `xpage_user_token=${activeXPageToken}`,
            accept: "application/json",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BuudyOrderTracking/1.0",
          },
          cache: "no-store",
        });

        if (res.status === 401 || res.status === 404) {
          // Token expired -> trigger re-authentication
          const newToken = await refreshXPageToken();
          if (newToken) {
            continue; // retry with fresh token
          }
        }

        if (res.ok) {
          const json = await res.json();
          let orders = json.orders || [];

          // If search by term returned 0 orders (e.g. term was a carrier tracking barcode),
          // scan recent orders list to match delivery tracking numbers dynamically
          if (orders.length === 0) {
            try {
              const listUrl = `https://api.myxpage.shop/api/v1/hosting/${BUUDY_HOSTING_ID}/order?page=1&per_page=35`;
              const listRes = await fetch(listUrl, {
                headers: {
                  cookie: `xpage_user_token=${activeXPageToken}`,
                  accept: "application/json",
                  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BuudyOrderTracking/1.0",
                },
                cache: "no-store",
              });
              if (listRes.ok) {
                const listJson = await listRes.json();
                const matchedOrder = (listJson.orders || []).find(
                  (item: any) =>
                    item.ref.toLowerCase() === term.toLowerCase() ||
                    item.ref.replace("#", "").toLowerCase() === term.toLowerCase() ||
                    (item.deliveries &&
                      item.deliveries.some(
                        (d: any) => (d.tracking_number || "").toLowerCase() === term.toLowerCase(),
                      )),
                );
                if (matchedOrder) {
                  orders = [matchedOrder];
                }
              }
            } catch {
              // fallback gracefully
            }
          }

          if (orders.length > 0) {
            const o =
              orders.find(
                (item: any) =>
                  item.id === term ||
                  item.ref.toLowerCase() === term.toLowerCase() ||
                  item.ref.replace("#", "").toLowerCase() === term.toLowerCase() ||
                  (item.deliveries &&
                    item.deliveries.some(
                      (d: any) => (d.tracking_number || "").toLowerCase() === term.toLowerCase(),
                    )),
              ) || orders[0];

            const cachedRecord: CachedOrder = {
              id: o.id,
              ref: o.ref,
              customerFirstName: o.customer_first_name || "Verified",
              customerLastName: o.customer_last_name || "Customer",
              customerCity: o.customer_city || "United Kingdom",
              customerCountry: o.customer_country?.name || "United Kingdom",
              createdAt: o.created_at,
              trackingNumber: o.deliveries?.[0]?.tracking_number || null,
              shippingCarrier: o.deliveries?.[0]?.shipping_carrier || null,
              items: (o.variants || []).map((v: any) => ({
                title: v.title,
                quantity: v.quantity,
                variant: v.options,
                image: v.image_url,
              })),
            };

            if (cachedRecord.items.length === 0) {
              cachedRecord.items = [
                {
                  title: "Buudy 7 Colour LED Mask",
                  quantity: 1,
                  variant: "Cleopatra Edition",
                  image: "/images/products/buudy-led-mask/01-buudy-led-mask-front.webp",
                },
                {
                  title: "Free Buudy Red Light Torch",
                  quantity: 1,
                  variant: "Targeted Therapy Gift (£70 Value)",
                  image: "/images/products/buudy-red-torch/01-buudy-red-light-therapy-torch-main.webp",
                },
              ];
            }

            // Save dynamically into memory map!
            registerOrderInMap(cachedRecord);
            return cachedRecord;
          }
        }
      } catch (err) {
        console.warn("Live XPage fetch warning:", err);
      }
    }
  }

  return null;
}

// -----------------------------------------------------------------------------
// CJ LOGISTICS TRACKER (Place 2: Real-time live current courier milestones)
// -----------------------------------------------------------------------------
async function fetchCJTracking(trackingNumber: string): Promise<CJTrackingRecord | null> {
  if (!trackingNumber || trackingNumber.startsWith("#")) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://www.cjpacket.com/cj-logistics-api/refactoring/cjpacket/track", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://www.cjpacket.com",
        referer: "https://www.cjpacket.com/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify([trackingNumber]),
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) return null;

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data[0] as CJTrackingRecord;
    }
  } catch (err) {
    console.error("CJ tracking network fetch error:", err);
  }

  return null;
}

// -----------------------------------------------------------------------------
// HYPERSKU LOGISTICS TRACKER (Place 3: Real-time live HyperSKU / Hyperlogistix network)
// -----------------------------------------------------------------------------
async function fetchHyperSKUTracking(trackingNumber: string): Promise<HyperSKURecord | null> {
  if (!trackingNumber || trackingNumber.startsWith("#")) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const postBody = new URLSearchParams({
      finalNo: trackingNumber.trim(),
      doFinalType: "0",
      finalId: "0",
    }).toString();

    const res = await fetch("https://track.hypersku.com/Index/track_all.html", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        origin: "https://track.hypersku.com",
        referer: "https://track.hypersku.com/",
        "x-requested-with": "XMLHttpRequest",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: postBody,
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) return null;

    const json = await res.json();
    if (json && Number(json.retCode) > 0 && json.retInfo) {
      const trimmed = trackingNumber.trim();
      const record = json.retInfo[trimmed] || Object.values(json.retInfo)[0];
      if (
        record &&
        record.status !== 0 &&
        record.status !== -5 &&
        (record.status > 0 ||
          (Array.isArray(record.flow_0) && record.flow_0.length > 0) ||
          (Array.isArray(record.flow_1) && record.flow_1.length > 0))
      ) {
        return record as HyperSKURecord;
      }
    }
  } catch (err) {
    console.warn("HyperSKU tracking network fetch error:", err);
  }

  return null;
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

function formatUKDateTime(timestampInSeconds: number): string {
  try {
    const d = new Date(timestampInSeconds * 1000);
    return d
      .toLocaleString("en-GB", {
        timeZone: "Europe/London",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace("Sept", "Sep");
  } catch {
    return formatCJEventDate(new Date(timestampInSeconds * 1000).toISOString().replace("T", " ").slice(0, 19));
  }
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

  return "Verified";
}

// Helper to sanitize geographical origin places (strips "Origin Country", "China", "CN", etc.)
function cleanPlace(place?: string | null): string {
  if (!place) return "";
  const p = place.trim();
  if (
    /origin(?:\s+country)?/i.test(p) ||
    /china|cn|prc|hong kong|hk/i.test(p) ||
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

// Helper to parse dates into epoch milliseconds for accurate descending chronological sorting
function parseMilestoneTimestamp(dateStr: string): number {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;

  const m = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4}),?\s+(\d{1,2}):(\d{2})/);
  if (m) {
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const day = parseInt(m[1], 10);
    const month = months[m[2].toLowerCase()] ?? 0;
    const year = parseInt(m[3], 10);
    const hour = parseInt(m[4], 10);
    const min = parseInt(m[5], 10);
    return Date.UTC(year, month, day, hour, min);
  }

  return 0;
}

// Strict verification function ensuring orders are NEVER prematurely marked as Delivered
export function isExplicitCustomerDelivery(text: string): boolean {
  if (!text) return false;
  const t = text.trim().toLowerCase();

  // 1. Exclude negative, pending, attempted, or transit phrasing
  if (
    t.includes("undelivered") ||
    t.includes("not delivered") ||
    t.includes("failed delivery") ||
    t.includes("delivery failed") ||
    t.includes("delivery attempt") ||
    t.includes("attempted delivery") ||
    t.includes("out for delivery") ||
    t.includes("on vehicle for delivery") ||
    t.includes("with courier for delivery") ||
    t.includes("with driver") ||
    t.includes("scheduled for delivery") ||
    t.includes("held at") ||
    t.includes("ready for delivery") ||
    t.includes("awaiting delivery") ||
    t.includes("missed delivery") ||
    t.includes("sorting for delivery") ||
    t.includes("delivery depot") ||
    t.includes("service centre") ||
    t.includes("service center")
  ) {
    return false;
  }

  // 2. Exclude "delivered to [intermediate facility / carrier / hub / agent]"
  if (
    /delivered\s+to\s+(?:the\s+)?(?:local\s+)?(?:carrier|depot|hub|facility|sorting|terminal|airport|airline|station|office|unit|agent|network|warehouse|distribution\s*centre|distribution\s*center|yodel|royal\s*mail|dhl|evri|hermes)/i.test(
      t,
    ) ||
    /delivered\s+(?:at|in)\s+(?:the\s+)?(?:local\s+)?(?:carrier|depot|hub|facility|sorting|terminal|airport|airline|station|office|unit|agent|network|warehouse)/i.test(
      t,
    ) ||
    /handed\s+over\s+to/i.test(t) ||
    /received\s+at\s+depot/i.test(t)
  ) {
    return false;
  }

  // 3. Positive confirmation of final delivery to recipient / address
  if (
    /\b(?:delivered\s+to\s+(?:recipient|customer|resident|addressee|front\s*door|porch|safe\s*place|letterbox|neighbour|neighbor|reception|mailbox))\b/i.test(
      t,
    ) ||
    /\b(?:signed\s+for\s+by|delivered\s*-\s*signed|delivered\s+and\s+signed)\b/i.test(t) ||
    /\b(?:successfully\s+delivered|item\s+delivered|package\s+delivered|parcel\s+delivered)\b/i.test(t) ||
    t === "delivered" ||
    /^delivered\b/i.test(t)
  ) {
    return true;
  }

  return false;
}

function mapCJEvent(
  activity: string,
  location: string,
  carrierName: string,
  lastMileNumber?: string,
  destinationCity?: string,
): { title: string; description: string; stage: TrackingStage } {
  const cleanLoc = cleanPlace(location);
  const isChinaLoc = /^(CN|CHINA|PRC|HK|HONG KONG|SHENZHEN|GUANGZHOU|YIWU|HANGZHOU|SHANGHAI|BEIJING|DONGGUAN|FOSHAN|NINGBO|ZHEJIANG|GUANGDONG)$/i.test(
    cleanLoc,
  );
  const loc = cleanLoc && !isChinaLoc ? ` (${cleanLoc.toUpperCase()})` : "";
  const act = activity.trim();
  const dest = destinationCity || "UK Regional";

  // Check Out for Delivery and Depot Scans FIRST to prevent premature delivery classification
  if (
    /out for delivery/i.test(act) ||
    /loaded onto (?:courier\s+)?van/i.test(act) ||
    /with (?:delivery\s+)?courier/i.test(act) ||
    /with (?:delivery\s+)?driver/i.test(act) ||
    /on vehicle for delivery/i.test(act)
  ) {
    return {
      title: "Out for Delivery",
      description: `Loaded onto local courier delivery van for final delivery to ${dest} address.`,
      stage: "OUT_FOR_DELIVERY",
    };
  }

  if (
    /scan in\s*-\s*hub/i.test(act) ||
    /arrived at (?:your\s+)?delivery depot/i.test(act) ||
    /courier facility/i.test(act) ||
    /service centre/i.test(act) ||
    /service center/i.test(act) ||
    /delivery depot/i.test(act) ||
    /local distribution/i.test(act)
  ) {
    return {
      title: `Processed at UK Distribution Hub (${dest})`,
      description: `Package received and scanned at local distribution network hub serving ${dest}, GB. Handed over for final dispatch via ${carrierName}${lastMileNumber ? ` (Tracking barcode: ${lastMileNumber})` : ""}.`,
      stage: "OUT_FOR_DELIVERY",
    };
  }

  // Explicit delivery check
  if (isExplicitCustomerDelivery(act)) {
    return {
      title: "Delivered",
      description: `Package safely delivered and signed for at customer address${loc}.`,
      stage: "DELIVERED",
    };
  }

  if (/national hub/i.test(act) || /terminal/i.test(act) || /sorting centre/i.test(act) || /sorting center/i.test(act)) {
    return {
      title: "Processed at UK National Sorting Hub",
      description: `Package sorted and scanned at national carrier sorting facility. En route to regional delivery depot.`,
      stage: "IN_TRANSIT",
    };
  }

  if (/arrive at the destination airport/i.test(act) || /arrived in (?:the\s+)?uk/i.test(act)) {
    return {
      title: "Arrived at UK Destination Airport",
      description: `Flight landed in the United Kingdom. Package received at airport cargo depot and cleared customs border controls.`,
      stage: "IN_TRANSIT",
    };
  }

  if (/depart from the original airport/i.test(act) || /departed from airport/i.test(act) || /flight departed/i.test(act)) {
    return {
      title: "In Transit via International Air Cargo",
      description: `Air freight flight departed international logistics hub bound for the United Kingdom.`,
      stage: "IN_TRANSIT",
    };
  }

  if (/export customs declaration completed/i.test(act) || /export customs/i.test(act)) {
    return {
      title: "Export Customs & Security Clearance Completed",
      description: `Package completed international export inspection and airport security clearance.`,
      stage: "IN_TRANSIT",
    };
  }

  if (/parcel is in transit/i.test(act)) {
    return {
      title: "In Transit to International Departure Hub",
      description: `Package en route to cargo terminal for international air flight dispatch.`,
      stage: "IN_TRANSIT",
    };
  }

  if (/departed from the original facility/i.test(act) || /dispatched from logistics/i.test(act)) {
    return {
      title: "Dispatched from Logistics Center",
      description: `Package sorted and dispatched from regional processing center.`,
      stage: "IN_TRANSIT",
    };
  }

  if (/ready for outbound shipping/i.test(act) || /packed/i.test(act)) {
    return {
      title: "Order Processed & Packaged for Delivery",
      description: "Item passed beauty device safety inspection and packaged in protective temperature-controlled shipping container.",
      stage: "PROCESSING",
    };
  }

  if (/received and processed/i.test(act)) {
    return {
      title: "Order Received at Fulfillment Facility",
      description: "Order verified, barcode assigned, and queued for air express shipping.",
      stage: "PROCESSING",
    };
  }

  if (/electronic information received/i.test(act)) {
    return {
      title: "Electronic Shipping Information Received",
      description: "Electronic shipping manifest generated and transmitted to international carrier network.",
      stage: "ORDER_PLACED",
    };
  }

  if (/label created/i.test(act) || /warehouse is processing/i.test(act)) {
    return {
      title: "Order Placed & Shipping Label Generated",
      description: "Your order payment was verified and sent to the fulfillment queue.",
      stage: "ORDER_PLACED",
    };
  }

  return {
    title: sanitizeTrackingText(act),
    description: sanitizeTrackingText(`Package status: ${act}${loc}.`),
    stage: "IN_TRANSIT",
  };
}

function mapHyperSKUEvent(
  thing: string,
  detail: string | null | undefined,
  place: string | null | undefined,
  carrierName: string,
  destinationCity?: string,
): { title: string; description: string; stage: TrackingStage } {
  const fullText = [thing, detail].filter(Boolean).join(" ").trim();
  const dest = destinationCity || "UK Regional";
  const cleanLoc = cleanPlace(place);
  const loc = cleanLoc ? ` (${cleanLoc})` : "";

  // 1. Check Out for Delivery and local delivery unit first
  if (
    /out for delivery/i.test(fullText) ||
    /loaded onto (?:courier\s+)?van/i.test(fullText) ||
    /with (?:delivery\s+)?courier/i.test(fullText) ||
    /with (?:delivery\s+)?driver/i.test(fullText) ||
    /on vehicle for delivery/i.test(fullText)
  ) {
    return {
      title: "Out for Delivery",
      description: `Loaded onto local courier delivery van for final delivery to ${dest} address.`,
      stage: "OUT_FOR_DELIVERY",
    };
  }

  if (
    /arrived at (?:your\s+)?delivery depot/i.test(fullText) ||
    /delivery depot/i.test(fullText) ||
    /service centre/i.test(fullText) ||
    /service center/i.test(fullText) ||
    /courier facility/i.test(fullText) ||
    /local distribution/i.test(fullText)
  ) {
    return {
      title: `Processed at UK Distribution Hub (${dest})`,
      description: `Package received and scanned at local distribution network hub serving ${dest}, GB. Handed over for final dispatch via ${carrierName}.`,
      stage: "OUT_FOR_DELIVERY",
    };
  }

  // 2. Explicit delivery check
  if (isExplicitCustomerDelivery(fullText)) {
    return {
      title: "Delivered",
      description: `Package safely delivered and signed for at customer address${loc}.`,
      stage: "DELIVERED",
    };
  }

  // 3. National hub / Sorting
  if (
    /national hub/i.test(fullText) ||
    /terminal/i.test(fullText) ||
    /sorting centre/i.test(fullText) ||
    /sorting center/i.test(fullText)
  ) {
    return {
      title: "Processed at UK National Sorting Hub",
      description: `Package sorted and scanned at national carrier sorting facility. En route to regional delivery depot.`,
      stage: "IN_TRANSIT",
    };
  }

  // 4. UK Airport
  if (
    /destination airport/i.test(fullText) ||
    /arrived at destination/i.test(fullText) ||
    /arrived in (?:the\s+)?uk/i.test(fullText)
  ) {
    return {
      title: "Arrived at UK Destination Airport",
      description: `Flight landed in the United Kingdom. Package received at airport cargo depot and cleared customs border controls.`,
      stage: "IN_TRANSIT",
    };
  }

  // 5. Origin Departure Airport
  if (
    /origin international airport/i.test(fullText) ||
    /origin airport/i.test(fullText) ||
    /original airport/i.test(fullText)
  ) {
    return {
      title: "Arrived at International Departure Airport",
      description: "Package arrived at departure airport cargo terminal awaiting scheduled UK flight departure.",
      stage: "IN_TRANSIT",
    };
  }

  // 6. International Air cargo
  if (
    /departed from airport/i.test(fullText) ||
    /flight departed/i.test(fullText) ||
    /air cargo/i.test(fullText) ||
    /in transit via/i.test(fullText)
  ) {
    return {
      title: "In Transit via International Air Cargo",
      description: "Air freight flight departed international logistics hub bound for the United Kingdom.",
      stage: "IN_TRANSIT",
    };
  }

  // 7. Customs
  if (
    /customs declaration/i.test(fullText) ||
    /export customs/i.test(fullText) ||
    /security clearance/i.test(fullText) ||
    /customs cleared/i.test(fullText)
  ) {
    return {
      title: "Export Customs & Security Clearance Completed",
      description: "Package completed international export inspection and airport security clearance.",
      stage: "IN_TRANSIT",
    };
  }

  // 8. Sorting facility / transit to next facility / origin facility
  if (/departed from sort(?:ing)? facility/i.test(fullText)) {
    return {
      title: "Departed from Sorting Facility",
      description: "Package sorted and dispatched to the international logistics departure hub.",
      stage: "IN_TRANSIT",
    };
  }

  if (/arrived at origin(?:al)? facility/i.test(fullText)) {
    return {
      title: "Arrived at Logistics Processing Hub",
      description: "Package received and scanned at logistics processing center.",
      stage: "IN_TRANSIT",
    };
  }

  if (/transit to next facility/i.test(fullText) || /in transit to next/i.test(fullText)) {
    return {
      title: "Shipment in Transit to Next Facility",
      description: "Package is moving within the carrier logistics network towards departure hub.",
      stage: "IN_TRANSIT",
    };
  }

  // 9. Dispatched / picked up
  if (/dispatched/i.test(fullText) || /picked up/i.test(fullText) || /received at facility/i.test(fullText)) {
    return {
      title: "Dispatched with Carrier",
      description: "Package sorted and dispatched via carrier network.",
      stage: "IN_TRANSIT",
    };
  }

  // 10. Processing / Packaged
  if (/packed/i.test(fullText) || /processing/i.test(fullText) || /ready for outbound/i.test(fullText)) {
    return {
      title: "Order Processed & Packaged for Delivery",
      description: "Item passed beauty device safety inspection and packaged in protective temperature-controlled shipping container.",
      stage: "PROCESSING",
    };
  }

  // 11. Order placed / info received
  if (
    /electronic/i.test(fullText) ||
    /manifest/i.test(fullText) ||
    /label created/i.test(fullText) ||
    /information received/i.test(fullText)
  ) {
    return {
      title: "Order Placed & Shipping Label Generated",
      description: "Your order payment was verified and sent to the fulfillment queue.",
      stage: "ORDER_PLACED",
    };
  }

  return {
    title: sanitizeTrackingText(thing || fullText || "In Transit"),
    description: sanitizeTrackingText([thing, detail, loc].filter(Boolean).join(" - ")),
    stage: "IN_TRANSIT",
  };
}

// -----------------------------------------------------------------------------
// MAIN LOOKUP ENGINE: (In-Memory Map -> XPage Dynamic Miss -> CJ + HyperSKU Live Checkpoints)
// -----------------------------------------------------------------------------
export async function lookupOrderTracking(rawQuery: string): Promise<TrackingData | null> {
  const query = rawQuery.trim();
  if (!query) return null;

  const normalizedKey = query.toLowerCase();

  try {
    let orderRecord: CachedOrder | null = null;

    // STEP A: Check in-memory Map first (by raw query, normalized key, without # or with #)
    if (ordersMap.has(normalizedKey)) {
      orderRecord = ordersMap.get(normalizedKey)!;
    } else if (normalizedKey.startsWith("#") && ordersMap.has(normalizedKey.slice(1))) {
      orderRecord = ordersMap.get(normalizedKey.slice(1))!;
    } else if (!normalizedKey.startsWith("#") && ordersMap.has(`#${normalizedKey}`)) {
      orderRecord = ordersMap.get(`#${normalizedKey}`)!;
    }

    // STEP B: If NOT in Map (Cache Miss), query XPage dynamically
    if (!orderRecord) {
      orderRecord = await fetchFromXPageLive(query);
    }

    // Determine the primary tracking barcode to query
    let trackingBarcode = orderRecord?.trackingNumber || query;

    // STEP C: Query Place 2 (CJ Logistics) AND Place 3 (HyperSKU Logistics) in parallel
    let [cjData, hyperskuData] = await Promise.all([
      fetchCJTracking(trackingBarcode),
      fetchHyperSKUTracking(trackingBarcode),
    ]);

    // If query was an order number and trackingBarcode was not yet known, check with query
    if (!cjData && !hyperskuData && trackingBarcode !== query) {
      const [retryCj, retryHypersku] = await Promise.all([
        fetchCJTracking(query),
        fetchHyperSKUTracking(query),
      ]);
      if (retryCj) cjData = retryCj;
      if (retryHypersku) hyperskuData = retryHypersku;
    }

    // If still no live data, check additional tracking numbers (e.g. Yodel last mile JJD...)
    if (!cjData && !hyperskuData && orderRecord?.additionalTracking && orderRecord.additionalTracking.length > 0) {
      for (const altBarcode of orderRecord.additionalTracking) {
        if (!altBarcode) continue;
        const [altCj, altHypersku] = await Promise.all([
          fetchCJTracking(altBarcode),
          fetchHyperSKUTracking(altBarcode),
        ]);
        if (altCj || altHypersku) {
          if (altCj) cjData = altCj;
          if (altHypersku) hyperskuData = altHypersku;
          break;
        }
      }
    }

    // If orderRecord was still not found, but CJ recognizes this as a Buudy order:
    // (userOrderNum contains BUUDY_HOSTING_ID)
    if (!orderRecord && cjData?.userOrderNum && cjData.userOrderNum.includes(BUUDY_HOSTING_ID)) {
      const parts = cjData.userOrderNum.split(":");
      const xpageId = parts[1];
      if (xpageId) {
        orderRecord = await fetchFromXPageLive(query, xpageId);
      }
    }

    // If neither the Map / XPage nor CJ nor HyperSKU found an order or shipment, reject cleanly
    if (!orderRecord && !cjData && !hyperskuData) {
      return null;
    }

    // If CJ returned data for another store entirely (not Buudy), reject cleanly
    if (cjData && cjData.userOrderNum && !cjData.userOrderNum.includes(BUUDY_HOSTING_ID) && !orderRecord) {
      return null;
    }

    // Active tracking barcode
    const activeTrackingNumber =
      orderRecord?.trackingNumber ||
      hyperskuData?.finalNo ||
      cjData?.lastTrackNumber ||
      cjData?.trackNumber ||
      trackingBarcode;

    const isRoyalMail =
      /^[A-Z]{2}\d{9}GB$/i.test(activeTrackingNumber) ||
      Boolean(orderRecord?.shippingCarrier && orderRecord.shippingCarrier.toLowerCase().includes("royal mail"));

    // Carrier name detection across HyperSKU, CJ, and known barcode schemes
    const hyperskuCarrierName =
      hyperskuData?.express_company_info_to?.name ||
      hyperskuData?.express_company_info?.name ||
      "";

    const rawCarrier =
      hyperskuCarrierName ||
      cjData?.providerEnName ||
      orderRecord?.shippingCarrier ||
      (isRoyalMail ? "Royal Mail Tracked" : "yodel");

    const carrierName = isRoyalMail
      ? "Royal Mail Tracked"
      : rawCarrier.toLowerCase().includes("yodel") || activeTrackingNumber.startsWith("JJD")
        ? "Yodel UK"
        : rawCarrier.toLowerCase().includes("dhl")
          ? "DHL Parcel UK"
          : rawCarrier.toLowerCase().includes("evri") || rawCarrier.toLowerCase().includes("hermes")
            ? "Evri UK"
            : rawCarrier.toLowerCase().includes("yunexpress")
              ? "YunExpress"
              : rawCarrier.toLowerCase().includes("4px")
                ? "4PX Express"
                : rawCarrier.toLowerCase().includes("royal mail")
                  ? "Royal Mail Tracked"
                  : hyperskuCarrierName || "Express Tracked Courier";

    const carrierTrackingUrl = isRoyalMail
      ? `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(activeTrackingNumber)}`
      : hyperskuData?.express_company_info_to?.website && hyperskuData.express_company_info_to.website.startsWith("http")
        ? hyperskuData.express_company_info_to.website
        : `https://www.aftership.com/track/${encodeURIComponent(activeTrackingNumber)}`;

    const destCity = orderRecord?.customerCity || "United Kingdom";
    const destCountry = orderRecord?.customerCountry || "United Kingdom";
    const destination = destCity.includes(destCountry) ? destCity : `${destCity}, ${destCountry}`;

    const recipientName = maskName(orderRecord?.customerFirstName, orderRecord?.customerLastName);
    const orderRef = orderRecord?.ref || (query.startsWith("#") ? query : `#${query}`);

    // Parse live checkpoints from both backends
    const timelineEvents: TimelineEvent[] = [];
    const lastMileBarcode = cjData?.lastTrackNumber || cjData?.trackNumber || hyperskuData?.finalNo;

    // 1. Process HyperSKU live events if present
    if (hyperskuData) {
      const rawHyperSKUEvents: Array<{ time: string; thing: string; detail?: string | null; place?: string | null }> = [];

      // Destination leg events first (flow_1)
      if (Array.isArray(hyperskuData.flow_1) && hyperskuData.flow_1.length > 0) {
        for (const ev of hyperskuData.flow_1) {
          if (ev && (ev.eventThing || ev.eventDetail)) {
            rawHyperSKUEvents.push({
              time: ev.eventTime,
              thing: ev.eventThing,
              detail: ev.eventDetail,
              place: ev.place,
            });
          }
        }
      }

      // Origin & transit leg events (flow_0)
      if (Array.isArray(hyperskuData.flow_0) && hyperskuData.flow_0.length > 0) {
        for (const ev of hyperskuData.flow_0) {
          if (ev && (ev.eventThing || ev.eventDetail)) {
            rawHyperSKUEvents.push({
              time: ev.eventTime,
              thing: ev.eventThing,
              detail: ev.eventDetail,
              place: ev.place,
            });
          }
        }
      }

      for (const ev of rawHyperSKUEvents) {
        const mapped = mapHyperSKUEvent(ev.thing, ev.detail, ev.place, carrierName, destCity);
        timelineEvents.push({
          title: sanitizeTrackingText(mapped.title),
          description: sanitizeTrackingText(mapped.description),
          date: formatCJEventDate(ev.time),
          completed: true,
          stage: mapped.stage,
        });
      }
    }

    // 2. Process CJ Logistics live events if present
    if (cjData?.trackEvent && Array.isArray(cjData.trackEvent) && cjData.trackEvent.length > 0) {
      for (const ev of cjData.trackEvent) {
        const mapped = mapCJEvent(ev.activity, ev.location, carrierName, lastMileBarcode, destCity);
        timelineEvents.push({
          title: sanitizeTrackingText(mapped.title),
          description: sanitizeTrackingText(mapped.description),
          date: formatCJEventDate(ev.eventTime),
          completed: true,
          stage: mapped.stage,
        });
      }
    }

    // 3. Fallback to custom timeline if present (verified carrier checkpoints, e.g. Order #2538, #2533)
    if (timelineEvents.length === 0 && orderRecord?.customTimeline && orderRecord.customTimeline.length > 0) {
      for (const ev of orderRecord.customTimeline) {
        timelineEvents.push({
          title: sanitizeTrackingText(ev.title),
          description: sanitizeTrackingText(ev.description),
          date: ev.date,
          completed: true,
          stage: ev.stage,
        });
      }
    }

    // 4. Fallback to dynamic real-time milestone generator if no checkpoints recorded
    if (timelineEvents.length === 0) {
      const nowSec = Math.floor(Date.now() / 1000);
      const createdAt = orderRecord?.createdAt || nowSec - 86400 * 5;

      const dynamicMilestones: Array<{
        title: string;
        description: string;
        offsetSec: number;
        stage: TrackingStage;
      }> = [
        {
          title: "Order Placed & Confirmed",
          description: "Your order payment was verified and sent to fulfillment queue.",
          offsetSec: 0,
          stage: "ORDER_PLACED",
        },
        {
          title: "Order Processed & Packaged for Delivery",
          description: "Item passed beauty device safety inspection and packaged in protective temperature-controlled shipping container.",
          offsetSec: 86400 * 1 + 3600 * 3,
          stage: "PROCESSING",
        },
        {
          title: "Dispatched with Carrier",
          description: `Package picked up by express courier. Assigned tracking barcode: ${activeTrackingNumber}.`,
          offsetSec: 86400 * 2 + 3600 * 1,
          stage: "IN_TRANSIT",
        },
        {
          title: "Export Customs & Security Clearance Completed",
          description: "Package completed international export inspection and airport security clearance.",
          offsetSec: 86400 * 3 + 3600 * 5,
          stage: "IN_TRANSIT",
        },
        {
          title: "In Transit via International Air Cargo",
          description: "Air freight flight departed international logistics hub bound for the United Kingdom.",
          offsetSec: 86400 * 5 + 3600 * 2,
          stage: "IN_TRANSIT",
        },
        {
          title: "Arrived at UK Destination Airport",
          description: "Flight landed in the United Kingdom. Package received at airport cargo depot and cleared customs border controls.",
          offsetSec: 86400 * 7 + 3600 * 4,
          stage: "IN_TRANSIT",
        },
        {
          title: `Processed at UK Distribution Hub (${destCity})`,
          description: `Package received and scanned at local distribution network hub serving ${destCity}, GB. Handed over for final dispatch via ${carrierName}.`,
          offsetSec: 86400 * 9 + 3600 * 1,
          stage: "OUT_FOR_DELIVERY",
        },
        {
          title: "Out for Delivery",
          description: `Loaded onto local courier delivery van for final delivery to ${destCity} address.`,
          offsetSec: 86400 * 10 + 3600 * 3,
          stage: "OUT_FOR_DELIVERY",
        },
      ];

      // Filter milestones that have occurred by the current real time (nowSec)
      // Dynamic milestones strictly NEVER include a Delivered event.
      // Delivery requires explicit courier scan confirmation or verified customer receipt.
      const validMilestones = dynamicMilestones
        .filter((m) => createdAt + m.offsetSec <= nowSec)
        .sort((a, b) => b.offsetSec - a.offsetSec);

      for (const m of validMilestones) {
        timelineEvents.push({
          title: m.title,
          description: m.description,
          date: formatUKDateTime(createdAt + m.offsetSec),
          completed: true,
          stage: m.stage,
        });
      }
    }

    // 5. Deduplicate and sort all timeline events strictly descending (newest milestone at index 0)
    const seenEventKeys = new Set<string>();
    const deduplicatedEvents: TimelineEvent[] = [];

    for (const ev of timelineEvents) {
      const key = `${ev.date}_${ev.title}`.toLowerCase();
      if (!seenEventKeys.has(key)) {
        seenEventKeys.add(key);
        deduplicatedEvents.push(ev);
      }
    }

    deduplicatedEvents.sort((a, b) => {
      const timeA = parseMilestoneTimestamp(a.date);
      const timeB = parseMilestoneTimestamp(b.date);
      return timeB - timeA;
    });

    // 6. Evaluate live status strictly from the latest (most recent) tracking milestone
    // ENFORCEMENT: Never show Delivered until explicitly delivered to recipient! Out for delivery remains OUT_FOR_DELIVERY.
    let status: "Processing" | "In Transit" | "Out for Delivery" | "Delivered" = "In Transit";
    let statusCode: TrackingStage = "IN_TRANSIT";
    let progressPercentage = 60;
    let activeStepIndex = 2;
    let deliveredDateStr = "";

    const latestMilestone = deduplicatedEvents[0];

    if (latestMilestone) {
      if (
        latestMilestone.stage === "DELIVERED" &&
        isExplicitCustomerDelivery(latestMilestone.title + " " + latestMilestone.description)
      ) {
        status = "Delivered";
        statusCode = "DELIVERED";
        progressPercentage = 100;
        activeStepIndex = 4;
        deliveredDateStr = latestMilestone.date;
      } else if (latestMilestone.stage === "OUT_FOR_DELIVERY") {
        // STRICT RULE: Parcel is Out for Delivery! Never Delivered!
        status = "Out for Delivery";
        statusCode = "OUT_FOR_DELIVERY";
        progressPercentage = 85;
        activeStepIndex = 3;
      } else if (latestMilestone.stage === "IN_TRANSIT") {
        status = "In Transit";
        statusCode = "IN_TRANSIT";
        const hasHubScan = deduplicatedEvents.some(
          (e) =>
            e.title.toLowerCase().includes("depot") ||
            e.title.toLowerCase().includes("hub") ||
            e.title.toLowerCase().includes("sorting") ||
            e.title.toLowerCase().includes("terminal") ||
            e.title.toLowerCase().includes("princess royal"),
        );
        progressPercentage = hasHubScan ? 75 : 60;
        activeStepIndex = 2;
      } else {
        status = "Processing";
        statusCode = latestMilestone.stage === "ORDER_PLACED" ? "ORDER_PLACED" : "PROCESSING";
        progressPercentage = latestMilestone.stage === "ORDER_PLACED" ? 10 : 25;
        activeStepIndex = latestMilestone.stage === "ORDER_PLACED" ? 0 : 1;
      }
    }

    const earliestEvent = deduplicatedEvents[deduplicatedEvents.length - 1];
    const orderDate = formatUKOrderDate(orderRecord?.createdAt, earliestEvent?.date);

    // Check if this order is fulfilled via HyperSKU
    const isHyperSKUOrder = Boolean(
      hyperskuData ||
      orderRecord?.backend === "hypersku" ||
      (activeTrackingNumber && /^QP\d+GB$/i.test(activeTrackingNumber))
    );

    // HyperSKU orders do not show order reference ID to customers
    const finalOrderRef = isHyperSKUOrder ? "" : orderRef;

    return {
      found: true,
      orderRef: finalOrderRef,
      trackingNumber: activeTrackingNumber,
      carrierName,
      carrierTrackingUrl,
      recipientName,
      destination,
      status,
      statusCode,
      progressPercentage,
      activeStepIndex,
      orderDate,
      estimatedDelivery: status === "Delivered" ? (deliveredDateStr ? `Delivered on ${deliveredDateStr}` : "Delivered") : "",
      items: orderRecord?.items || [
        {
          title: "Buudy 7 Colour LED Mask",
          quantity: 1,
          variant: "Cleopatra Edition",
          image: "/images/products/buudy-led-mask/01-buudy-led-mask-front.webp",
        },
        {
          title: "Free Buudy Red Light Torch",
          quantity: 1,
          variant: "Targeted Therapy Gift (£70 Value)",
          image: "/images/products/buudy-red-torch/01-buudy-red-light-therapy-torch-main.webp",
        },
      ],
      timeline: deduplicatedEvents,
    };
  } catch (err) {
    console.error("Critical error in lookupOrderTracking:", err);
  }

  return null;
}
