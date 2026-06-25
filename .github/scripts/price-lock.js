const path = require("path");

const storeUrl = "https://buudy.onshopbase.com";
const apiKey = "c35179509dca16265e5115771cf29982";
const password = "765e5d46582881f4bee786ba44ce77577f21aae46751cbba0351f92f1b3d25b1";

if (!apiKey || !password) {
  console.error("Missing SHOPBASE_API_KEY or SHOPBASE_PASSWORD environment variables.");
  process.exit(1);
}

const PRODUCTS = [
  {
    name: "Buudy LED Mask (UK)",
    variantId: "1000020450989467",
    productUrl: "https://buudy.com/products/led-face-mask?variant=1000020450989467",
    targetPriceGbp: 179,
    targetCompareAtGbp: 449,
    fallbackRate: 0.78093
  },
  {
    name: "Buudy Red Torch",
    variantId: "1000020384558655",
    productUrl: "https://buudy.com/products/buudy-red-torch?variant=1000020384558655",
    targetPriceGbp: 70,
    targetCompareAtGbp: 175,
    fallbackRate: 0.78093,
    floorPriceUsd: true
  },
  {
    name: "Buudy Red Torch (Light Therapy)",
    variantId: "1000020018633106",
    productUrl: "https://buudy.com/products/light-therapy-torch?variant=1000020018633106",
    targetPriceGbp: 70,
    targetCompareAtGbp: 175,
    fallbackRate: 0.78093,
    floorPriceUsd: true,
    optional: true
  },
  {
    name: "Buudy Led Face Wand",
    variantId: "1000020291098406",
    productUrl: "https://buudy.com/products/buudy-led-face-wand?variant=1000020291098406",
    targetPriceGbp: 149,
    targetCompareAtGbp: 299,
    fallbackRate: 0.78093,
    optional: true
  },
  {
    name: "Buudy IPL Hair Removal Device",
    variantId: "1000020460632985",
    productUrl: "https://buudy.com/products/buudy-ipl-device?variant=1000020460632985",
    targetPriceGbp: 129,
    targetCompareAtGbp: 249,
    fallbackRate: 0.78093
  }
];

function authHeader() {
  return `Basic ${Buffer.from(`${apiKey}:${password}`).toString("base64")}`;
}

const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cookie': 'currency=GBP;'
};

async function requestJson(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const finalHeaders = { ...COMMON_HEADERS, ...(options.headers || {}) };
      const response = await fetch(url, { ...options, headers: finalHeaders, signal: controller.signal });
      const text = await response.text();
      if (!response.ok) throw new Error(`${response.status}: ${text.slice(0, 300)}`);
      return JSON.parse(text);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function requestText(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, { headers: COMMON_HEADERS, signal: controller.signal });
      const text = await response.text();
      if (!response.ok) throw new Error(`${response.status}: ${text.slice(0, 300)}`);
      return text;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    } finally {
      clearTimeout(timeout);
    }
  }
}

function parseStorefront(html, variant = {}) {
  const priceMatch = html.match(/price-span mb-0">[^0-9]*([0-9]+(?:\.[0-9]{2})?)\s*GBP/i);
  const compareMatch = html.match(/price-original break-words is-uppercase mb-0">[^0-9]*([0-9]+(?:\.[0-9]{2})?)\s*GBP/i);
  const gbpRateMatch = html.match(/"country_code":"GB"[^}]*"code":"GBP"[^}]*"rate":([0-9]+(?:\.[0-9]+)?),"is_rate_auto":true/i);
  const anyRateMatch = html.match(/"rate":([0-9]+(?:\.[0-9]+)?),"is_rate_auto":true/i);
  
  const rate = gbpRateMatch ? Number(gbpRateMatch[1]) : anyRateMatch ? Number(anyRateMatch[1]) : null;

  return {
    rate,
    priceGbp: priceMatch ? Number(priceMatch[1]) : rate && variant.price ? Number((Number(variant.price) * rate).toFixed(2)) : null,
    compareAtGbp: compareMatch ? Number(compareMatch[1]) : rate && variant.compare_at_price ? Number((Number(variant.compare_at_price) * rate).toFixed(2)) : null
  };
}

function usdForGbp(gbp, rate, floor = false) {
  if (!rate) throw new Error("Could not detect GBP conversion rate.");
  const rawCents = (gbp / rate) * 100;
  const cents = floor ? Math.floor(rawCents) : Math.round(rawCents);
  return Number((cents / 100).toFixed(2));
}

async function getVariant(variantId) {
  const data = await requestJson(`${storeUrl}/admin/variants/${variantId}.json`, {
    headers: { Authorization: authHeader(), Accept: "application/json" }
  });
  return data.variant;
}

async function updateVariant(variantId, payload) {
  const data = await requestJson(`${storeUrl}/admin/variants/${variantId}.json`, {
    method: "PUT",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ variant: { id: Number(variantId), ...payload } })
  });
  return data.variant;
}

async function storefront(product, variant) {
  const sep = product.productUrl.includes("?") ? "&" : "?";
  const html = await requestText(`${product.productUrl}${sep}currency=GBP&price_check=${Date.now()}`);
  return parseStorefront(html, variant);
}

function fallbackStorefront(product, variant, error = null) {
  if (!product.fallbackRate) {
    if (error) throw error;
    throw new Error(`Could not detect GBP conversion rate for ${product.name}.`);
  }

  return {
    rate: product.fallbackRate,
    priceGbp: variant?.price ? Number((Number(variant.price) * product.fallbackRate).toFixed(2)) : null,
    compareAtGbp: variant?.compare_at_price
      ? Number((Number(variant.compare_at_price) * product.fallbackRate).toFixed(2))
      : null,
    fallback: true
  };
}

async function safeStorefront(product, variant) {
  try {
    const parsed = await storefront(product, variant);
    if (parsed.rate) return parsed;
    return fallbackStorefront(product, variant);
  } catch (error) {
    return fallbackStorefront(product, variant, error);
  }
}

async function fixProduct(product) {
  console.log(`Fixing ${product.name}...`);
  const beforeVariant = await getVariant(product.variantId);
  console.log(`- Got variant ${product.variantId}`);
  const beforeStore = await safeStorefront(product, beforeVariant);
  console.log(`- Got storefront, rate: ${beforeStore.rate}`);
  const rate = beforeStore.rate;
  const targetUsd = {
    price: usdForGbp(product.targetPriceGbp, rate, product.floorPriceUsd),
    compare_at_price: usdForGbp(product.targetCompareAtGbp, rate)
  };

  const finalVariant = await updateVariant(product.variantId, targetUsd);
  console.log(`- Updated variant to USD price: ${targetUsd.price}`);
  await new Promise(resolve => setTimeout(resolve, 5000));
  const finalStore = await safeStorefront(product, finalVariant);
  console.log(`- Verified storefront, new GBP price: ${finalStore.priceGbp}`);

  return {
    name: product.name,
    target: {
      priceGbp: product.targetPriceGbp,
      compareAtGbp: product.targetCompareAtGbp
    },
    before: {
      usdPrice: beforeVariant.price,
      usdCompareAt: beforeVariant.compare_at_price,
      displayedPriceGbp: beforeStore.priceGbp,
      displayedCompareAtGbp: beforeStore.compareAtGbp,
      rate
    },
    updated: {
      usdPrice: finalVariant.price,
      usdCompareAt: finalVariant.compare_at_price,
      displayedPriceGbp: finalStore.priceGbp,
      displayedCompareAtGbp: finalStore.compareAtGbp,
      rate: finalStore.rate
    }
  };
}

async function main() {
  const results = [];
  for (const product of PRODUCTS) {
    try {
      results.push(await fixProduct(product));
    } catch (error) {
      const message = error.message || String(error);
      if (product.optional && /No variant found|Not Found|404/i.test(message)) {
        results.push({
          name: product.name,
          variantId: product.variantId,
          skipped: true,
          reason: message
        });
        continue;
      }
      throw error;
    }
  }
  console.log(JSON.stringify({ runAt: new Date().toISOString(), results }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
