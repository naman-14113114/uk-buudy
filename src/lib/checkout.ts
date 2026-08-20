const fallbackCheckoutUrl = "https://new-buudy.onshopbase.com/cart";

export function getCheckoutUrl() {
  return process.env.NEXT_PUBLIC_CHECKOUT_URL || fallbackCheckoutUrl;
}
