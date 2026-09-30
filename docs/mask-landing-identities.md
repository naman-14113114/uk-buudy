# Mask landing identities

The following IDs distinguish acquisition pages internally. They do not identify
different physical mask models. Product copy, images, price, SKU, structured data
and the Google Merchant feed retain their existing catalog identity.

| Landing path | Internal landing ID | Checkout product |
| --- | --- | --- |
| `/products/best-led-face-mask` | `buudy-mask-lp-best-face-uk` | `buudy-led-mask` |
| `/products/best-led-mask-in-uk` | `buudy-mask-lp-best-mask-uk` | `buudy-led-mask` |
| `/products/buudy-led-face-mask` | `buudy-mask-lp-buudy-face` | `buudy-led-mask` |
| `/products/buudy-7-colour-led-mask` | `buudy-mask-lp-7-colour` | `buudy-led-mask` |

Each page response exposes `X-Buudy-Landing-Id` and
`X-Buudy-Checkout-Product`. `/api/checkout/prepare` accepts either an internal
landing ID or its page slug as a cart line's `productId` and resolves it to the
same mask before checkout validation. The existing storefront cart continues to
send `buudy-led-mask`. No additional client tracking or interface is introduced.

Quantities, gifts, promotions, mixed-cart validation and the existing hosted
checkout adapter remain in effect. Manufacturer identifiers are not fabricated,
and these IDs are not exported as additional Merchant Center products.

Run the regression checks with Node 22:

```powershell
node --experimental-strip-types --test scripts/test-mask-landing-pages.mjs scripts/test-xpage-checkout.mjs
```
