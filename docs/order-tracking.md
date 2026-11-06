# Order tracking

Tracking is served by `/api/order-tracking` and shown at `/order-tracking`,
`/pages/order-tracking`, and `/track`. The page refreshes the active query every
minute while visible, and when the customer returns to the tab. Each request
fetches current provider data with caching disabled; new scans still depend on
the carrier publishing them.

## Server configuration

Before releasing this repair, configure these server-only environment variables
in the **uk-buudy** Vercel project that serves **www.buudy.co.uk**:

| Variable | Purpose |
| --- | --- |
| `CJ_API_KEY` | CJ API key for the official logistics tracking endpoint |
| `XPAGE_EMAIL` | Existing XPage account used for order metadata |
| `XPAGE_PASSWORD` | Existing XPage password, used to refresh expired sessions |
| `XPAGE_BUUDY_HOSTING_ID` | Buudy hosting ID; existing default is retained |
| `XPAGE_USER_TOKEN` | Optional initial session; refreshed with the account credentials |

The required secret values are in the ignored local `.env.local` for verification.
Add them to Vercel's Production environment before pushing/deploying the repair;
also configure Preview if testing a preview deployment. Store secrets without a
`NEXT_PUBLIC_` prefix. Never commit or upload `.env.local` into Git.

CJ key **Buudy Vercel Tracking** was created with owner approval on 6 November
2026. HyperSKU's public tracking endpoint does not require an API key. This
change does not update Whop, checkout, products, or other storefront routes.

## Accuracy rules

- Status is derived from the newest valid carrier checkpoint. Depot arrivals,
  customs clearance, and handoff to a local courier remain **In Transit**.
- **Out for Delivery** requires explicit delivery-driver/vehicle wording.
- **Delivered** requires a final delivery checkpoint or, when no scan history
  exists, an explicit provider delivery summary. Intermediate handoffs and failed
  or scheduled delivery wording do not qualify.
- Provider outages produce an unavailable state. Order age never creates scans,
  products, locations, or a delivery status.
- XPage metadata is refreshed and matched exactly. The historical alias table
  retains only order IDs/references and fulfillment barcodes missing from XPage;
  it supplies no customer data, dates, products, or tracking milestones.
- CJ's official response can resolve an original CJ barcode to its last-mile
  barcode. Read `routes[].remark` / `acceptTime` / `acceptAddress`, preserving the
  queried barcode and using the returned last-mile barcode for the carrier link.
- HyperSKU references remain hidden and the existing origin-location presentation
  preference is preserved. Classification happens before display sanitization.
- Carrier timestamps without a timezone are displayed as supplied, not relabelled
  as UK time. A timezone uncertainty of up to 14 hours is allowed when validating
  those wall-clock timestamps; explicitly zoned future timestamps are rejected.

## Verification

```powershell
node --experimental-strip-types --test scripts/test-order-tracking.mjs
npx.cmd eslint src/lib/order-tracking.ts src/app/api/order-tracking/route.ts src/components/order-tracking/OrderTrackingPage.tsx scripts/test-order-tracking.mjs
npm.cmd run build
npm.cmd run start -- --port 3140
```

Open `/order-tracking?tracking=ZHPHD261026925943ML` and
`/order-tracking?tracking=QP272594975GB`. On 6 November 2026 the official CJ data
reported **Arrived Courier Facility / Received by local delivery company**, and
HyperSKU reported an international flight departure. Both correctly mapped to
**In Transit**. These observations are verification examples, never runtime
overrides. Confirm current scans again after manual deployment.
