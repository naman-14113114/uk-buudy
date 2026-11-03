import { appendAttributionToAbsoluteUrl, type AttributionPayload } from "./attribution";
import { resolveCheckoutProductId } from "./maskLandingPages";

const fallbackCheckoutUrl = "https://buudy.com/cart";

export function getCheckoutUrl() {
  return process.env.NEXT_PUBLIC_CHECKOUT_URL || fallbackCheckoutUrl;
}

type CheckoutLine = { productId: string; quantity: number; type?: string };

// The common mask checkout needs no server-created session: Whop quotes and
// validates the final amount itself. Unrecognised carts retain server validation.
export function buildFastWhopCheckoutUrl(
  lines: CheckoutLine[],
  codes: string[],
  attribution: AttributionPayload,
): string | null {
  const products = lines.filter(line => line.type !== "gift");
  if (!products.length || products.some(line => resolveCheckoutProductId(line.productId) !== "buudy-led-mask" || !Number.isInteger(line.quantity) || line.quantity < 1)) return null;
  const quantity = products.reduce((sum, line) => sum + line.quantity, 0);
  if (quantity > 100) return null;
  const promoCodes = codes.map(code => code.trim().toUpperCase()).filter(Boolean);
  if (promoCodes.some(code => !["AUTO", "GLOWKIT", "BUUDY", "BUUDY10", "BLACKFRIDAY10"].includes(code))) return null;
  const checkout = new URL("/checkout/plan_IY6bXASo3Gh15", "https://buudy.com");
  checkout.searchParams.set("quantity", String(quantity));
  checkout.searchParams.set("items", `plan_IY6bXASo3Gh15:${quantity}`);
  checkout.searchParams.set("checkoutSource", "buudy-uk");
  // Only 1 promo code is sent to Whop: strictly either BUUDY10 or BLACKFRIDAY10
  const lastPromo = promoCodes[promoCodes.length - 1];
  let promoToSend = "";
  if (lastPromo === "BUUDY10" || lastPromo === "BUUDY") {
    promoToSend = "BUUDY10";
  } else if (lastPromo === "BLACKFRIDAY10") {
    promoToSend = "BLACKFRIDAY10";
  } else if (promoCodes.includes("BUUDY10") || promoCodes.includes("BUUDY")) {
    promoToSend = "BUUDY10";
  } else if (promoCodes.includes("BLACKFRIDAY10")) {
    promoToSend = "BLACKFRIDAY10";
  }
  checkout.searchParams.set("promoCode", promoToSend);
  const clean = Object.fromEntries(Object.entries(attribution).filter((entry): entry is [string, string] => typeof entry[1] === "string").map(([key, value]) => [key, value.slice(0, 500)]));
  return appendAttributionToAbsoluteUrl(checkout.toString(), clean);
}
