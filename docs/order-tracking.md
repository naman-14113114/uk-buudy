# Order tracking

Tracking is served by `/api/order-tracking` and shown at `/order-tracking`,
`/pages/order-tracking`, and `/track`. The page uses four stages: Processing, In Transit, Out for Delivery, and Delivered.
The result starts with the tracking-number metadata row below the status header.
There is no one-minute refresh or checked-time/provider-status paragraph. While
visible, the page checks quietly every five minutes and updates its result only
when shipment content changes. A background request never activates the search
spinner or clears an existing verified result. These are conditional UI updates,
not provider webhooks; new scans still depend on the carrier publishing them.

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
- Temporary provider failures and empty/older responses retain the last verified
  carrier scans. Vercel Runtime Cache stores carrier snapshots (no XPage customer
  metadata) for up to 30 days, with a five-minute fresh window. The cache is
  regional and may be evicted; it is not a permanent shipment database. Local
  development uses a bounded in-memory cache. A cold lookup with no verified
  evidence uses a concise retry message, never a "Tracking unavailable" shipment
  stage or an invented Processing/In Transit status. Order age never creates
  scans, products, locations, or a delivery status.
- HyperSKU gets two attempts with an 18-second timeout instead of a single
  eight-second attempt. CJ requests are spaced at least 1.1 seconds apart per
  runtime and retry HTTP 429/server failures. Concurrent requests for the same
  provider/barcode share a request. CJ access tokens are also cached server-side
  until shortly before expiry, keyed by a hash of the API key, to reduce repeated
  authentication from serverless instances. A 50-second lookup deadline bounds retries
  within the API route's 60-second runtime. Known HyperSKU references skip CJ;
  CJ barcode hints query CJ first, then HyperSKU if CJ has no record. No global
  cross-instance QPS lock is claimed.
- XPage metadata is refreshed and matched exactly. The historical alias table
  retains only order IDs/references and fulfillment barcodes missing from XPage;
  it supplies no customer data, dates, products, or tracking milestones.
- CJ's official response can resolve an original CJ barcode to its last-mile
  barcode. Read `routes[].remark` / `acceptTime` / `acceptAddress`, preserving the
  queried barcode and using the returned last-mile barcode for the carrier link.
  Empty ZHPHD results also query CJ's official `getOrderTrackHistory` endpoint,
  following a uniquely matched replacement barcode when one is supplied.
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

## 6 November 2026 correction verification

All three supplied HyperSKU numbers (`QP272594984GB`, `QP272594967GB`,
`QP272594975GB`) returned eight actual scans and **In Transit** during local
verification. `JJD0002234587495434` returned **Delivered** with 13 scans.
`ZHPHD261028484220ML` resolved to `JJD0002234587511537` and returned **In Transit**
with seven scans. These values are observations, never hardcoded runtime results.

CJ's official tracking API, replacement lookup, and its browser tracker all
returned no tracking record for `ZHPHD261009289883ML`. Its actual current barcode
was corrected by the owner to `ZHPHD261026925943ML` as the verification example.
That corrected example returned nine scans and **In Transit**, most recently
"Received by local delivery company". The old and corrected numbers belong to
different existing references; no cross-order alias was created.

The published baseline's eight-second HyperSKU failure was reproduced remotely;
the revised requests and cache must also be checked after the owner's manual
Vercel deployment. The connected Vercel account lacked this project's team
access, so production logs and regional cache behavior were not inspected.

Implementation references: [CJ logistics API](https://developers.cjdropshipping.com/en/api/api2/api/logistic.html)
and [Vercel Runtime Cache](https://vercel.com/docs/caching/runtime-cache).
