# Buudy Storefront

Scalable Next.js ecommerce storefront for Buudy, with a real homepage at `/`,
the LED Mask page at `/products/buudy-led-mask`, and the Red Torch page at
`/products/red-light-torch`.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- `next/font` and `next/image`
- Local product assets for key SEO/LCP images
- Client components only for cart, gallery, FAQ, video, selector, and sticky CTA interactions

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build Checks

```bash
npm run lint
npm run build
```

## Product Data

Most product and commerce content is data-driven:

- `src/data/home.ts` for homepage section content
- `src/data/products.ts` for product pricing, gifts, specs, gallery, and badges
- `src/data/productSections.ts` for reusable product section content
- `src/data/navigation.ts` and `src/data/footer.ts` for shared layout data

Adding another product should usually mean adding a product record and section
data, then allowing `src/app/products/[slug]/page.tsx` to render it.

## Cart And Checkout

The cart is handled in `src/components/cart/CartProvider.tsx` and persisted in
the browser. It supports multiple product lines, product-specific gifts, editable
quantities, gift messaging, promo summaries, and checkout recording.

LED Mask checkout uses XPageDrop. `/api/checkout/prepare` reads the published
mask offer server-side, creates a fresh unpaid bundle checkout, and returns the
hosted checkout URL directly. Shoppers do not visit the `mask.buudy.com` landing
page. The verified XPage checkout path is presented on the customer-facing
`https://mask.buudy.com` domain, not the XPage platform hostname. No payment is
collected locally and clicking checkout is not a paid sale.
The cart remains available when a shopper returns or checkout preparation fails.

- Each mask receives one real BUUDY torch, discounted 100% by XPage.
- BUUDY10 selects the separate 5.59%-off option in the same XPage bundle. It is
  recorded as a bundle discount, **not a native coupon redemption**. The original
  BUUDY10 coupon definition is unchanged. Updating/disabling that coupon alone
  does not update this bundle option: manage the bundle option too.
- The Buudy storefront keeps its catalog price at exactly GBP 179 and does not
  replace it with XPage's converted price. XPage confirms the final checkout
  amount, shipping and payment currency while its own price correction is pending.
- The adapter discovers fresh condition/gift IDs on each request (XPage changes
  those IDs on save), checks the approved variants and discount amounts, and
  fails closed if the offer changes. No admin credentials or shared CSRF/session
  cookies are stored. Checkout POSTs are not automatically retried.
- Non-mask carts retain their existing PlusBase flow. Mixed mask/non-mask carts
  are rejected with a clear message instead of dropping products or splitting
  a payment silently. Quantities must be whole numbers from 1 to 100.
- Existing storefront analytics remain unchanged. Attribution is passed in the
  checkout URL and XPage custom fields. **The existing PlusBase paid-order webhook
  does not report XPage purchases**; XPage paid-order attribution/reporting needs
  its own verified integration. Never fire purchase events on checkout creation.

Checkout adapter regression tests (Node 22):

```bash
node --experimental-strip-types --test scripts/test-xpage-checkout.mjs
```

## Accounts, Orders, And Admin

Customer accounts, profiles, order history, and the admin dashboard use Supabase
Auth and Postgres. Apply the migration in `supabase/migrations/` and set these
environment variables locally and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=sahiljainsj004@gmail.com,support@buudy.co.uk
```

Protected customer routes are `/my-profile`, `/order-history`, and
`/account-settings`. Admin routes are protected by `ADMIN_EMAILS` and start at
`/admin`. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code.

## Contact Form

The contact page lives at `/pages/contact-us` and posts to
Web3Forms directly from the browser, which is required for the free Web3Forms
plan. Create a Web3Forms access key for the email inbox, then add it locally and
in Vercel:

```bash
WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

The browser loads that key at runtime through `src/app/api/contact/config/route.ts`,
so the same deployment works on `buudy-zeta.vercel.app`, `uk.buudy.com`, or a
future domain without changing code. The submitted payload also records the
actual `window.location.href` as `source_url`.

`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is still supported as an optional build-time
shortcut, but `WEB3FORMS_ACCESS_KEY` is preferred on Vercel. The legacy
`src/app/api/contact/route.ts` remains as a graceful fallback for validation,
but Web3Forms free accounts reject server-side proxy submissions.

## Assets

Key product images are stored in:

```txt
public/images/products/buudy-led-mask/
public/images/products/buudy-red-torch/
public/images/home/
```

To re-sync the local product images from the known source URLs:

```bash
npm run sync:assets
```

Heavy review videos stay remote and lazy-loaded to keep the initial product page fast.

## Vercel Deployment

Create a new Vercel project from this folder. The default framework detection should
select Next.js automatically.

Recommended production settings:

- Build command: `npm run build`
- Install command: `npm install`
- Output directory: leave empty for Next.js
- Environment variable: `WEB3FORMS_ACCESS_KEY` for the contact form
- Supabase env variables listed above for accounts, orders, checkout recording,
  and admin dashboard

## Microsoft Shopping purchase tracking

Microsoft Shopping purchases are reported server-side as soon as PlusBase marks
an order as `authorized` or `paid`. The storefront preserves `msclkid` as a
PlusBase line-item property, the order webhooks send the `purchase` event
immediately, and a daily reconciliation job recovers any missed webhook
deliveries using the same stable event ID for deduplication. The later `paid`
update therefore cannot count the same PlusBase order twice.

Set these server-only variables in the Vercel project that serves
`www.buudy.co.uk`:

```bash
SHOPBASE_WEBHOOK_SECRET=
CRON_SECRET=
```

The Shopping UET tag ID and its CAPI token are fixed inside the server-only
Microsoft Ads integration for this account.

Register `orders/create`, `orders/updated`, and `orders/paid` ShopBase webhooks
at the same endpoint:

```txt
https://www.buudy.co.uk/api/webhooks/shopbase/orders-paid
```

The pre-existing browser UET tag remains unchanged and is intentionally separate
from this server-side Shopping purchase integration.
