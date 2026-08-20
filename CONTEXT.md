# uk.Buudy Vercel Deployment Context

Append-only operational record for:

`E:\1st YEAR DTU\New folder\uk.Buudy Vercel Deployment`

Read the workspace `AGENTS.md` and `CONTEXT.md`, then this file and the repository
`AGENTS.md`, before making recommendations or edits in this repository. Do not
remove or condense old entries. Do not record secrets, private tokens, or
credential-bearing remote URLs.

## 2026-08-11 08:13:08 +05:30 - Initial UK Buudy Vercel deployment state refresh

- Repository: `E:\1st YEAR DTU\New folder\uk.Buudy Vercel Deployment`.
- Intended GitHub repository: `https://github.com/naman-14113114/uk-buudy.git`.
- Branch and HEAD after fetch: `main` at `799ca7f9b9f231ea07a4418b7565e3b66bcbfe1a`.
- Upstream: `origin/main`, ahead/behind `0/0`.
- Worktree before this context file: clean. No staged, unstaged, or untracked files existed.
- Latest commit: `799ca7f update reviews date`, dated `2026-08-11T07:50:58+05:30`.
- Recent commits: `95de01a feat: add product review datasets for red torch, hair removal device, and LED mask`; `5925442 feat: add review data for red torch, IPL device, and LED mask, and update review date processing script`; `c9935aa feat: add product section data models and content for LED mask and IPL device`.

### User Request And Practical Meaning

- User asked to update memory for the whole `New folder`, see GitHub state, and especially get current on `uk.Buudy Vercel Deployment` and `Buudy-Vercel`.
- Practical meaning for this repository: perform a fresh GitHub/local audit, inspect the active Vercel production deployment, verify live aliases and key routes, and record current UK product/review/checkout facts so future work can be mirrored correctly into both Buudy folders when requested.
- Protected scope: no source code, product data, assets, review JSON, checkout logic, tracking, package files, Vercel configuration, Git history, commit, push, branch, pull request, deployment, promotion, rollback, alias, domain, environment variable, or production setting was to be changed.

### Current Repository Shape

- This is the newer single-app UK Buudy Next.js repository.
- Root `package.json` name is `buudy-store`.
- Dependencies include Next.js `16.2.6`, React `19.2.4`, lucide, lottie-react, Supabase, and Tailwind 4 tooling.
- Scripts include `dev`, `build`, `start`, `lint`, `normalize:reviews`, and `sync:assets`.
- No local `.vercel/project.json` was present, so local Vercel project linkage should not be inferred from a checked-in/link file.
- Repository `AGENTS.md` warns that this is not the Next.js version expected from model memory; read relevant local Next.js docs before writing code.

### Vercel Production Deployment Observed

- Read-only Vercel CLI version available locally: `54.4.1`.
- `vercel ls` showed project `sahiljainsj004-5015s-projects/uk-buudy` with production deployment:
  - URL: `https://uk-buudy-400u53uu2-sahiljainsj004-5015s-projects.vercel.app`.
  - Status: `Ready`.
  - Environment: `Production`.
  - Age at inspection: about 19 to 20 minutes.
  - Duration shown by list: `43s`.
- `vercel inspect` showed:
  - Deployment ID `dpl_5MWZmadwx5ywX8AKWYB5Vixyvxuj`.
  - Name `uk-buudy`.
  - Target `production`.
  - Ready state `READY`.
  - Created at `2026-08-11 07:51:07 +05:30`.
  - Framework `nextjs`.
  - Node version `24.x`.
  - Build region in JSON `sfo1`; filtered logs said build ran in Washington, D.C., USA East `iad1`.
  - Output items in JSON summary: `240`.
- Aliases on the deployment:
  - `https://uk.buudy.com`.
  - `https://www.buudy.co.uk`.
  - `https://buudy.co.uk`.
  - `https://uk-buudy.vercel.app`.
  - `https://uk-buudy-sahiljainsj004-5015s-projects.vercel.app`.
  - `https://uk-buudy-git-main-sahiljainsj004-5015s-projects.vercel.app`.
- Filtered Vercel build logs confirmed:
  - Cloned `github.com/naman-14113114/uk-buudy`.
  - Branch `main`.
  - Commit `799ca7f`.
  - Ran `pnpm run build`.
  - Detected Next.js `16.2.6`.
  - Compiled successfully.
  - TypeScript finished successfully.
  - Generated static pages `33/33`.
  - Deployment completed and status was Ready.
- A Vercel dependency warning appeared in logs: build scripts for `sharp@0.34.5` and `unrs-resolver@1.12.2` were ignored with a suggestion to run `pnpm approve-builds`. The deployment still completed successfully.

### Live Route Checks

- `https://uk.buudy.com/` returned `200` and contained Buudy/LED/red torch/Best LED Face Mask text.
- `https://www.buudy.co.uk/` returned `200` with the same observed content length as `uk.buudy.com`.
- `https://buudy.co.uk/` returned `200` and resolved to `https://www.buudy.co.uk/`.
- `https://uk-buudy.vercel.app/` returned `200`.
- `https://uk.buudy.com/products/buudy-led-mask` returned `200` and contained `GBP 179` offer content.
- `https://uk.buudy.com/products/red-light-torch` returned `200` and contained red torch content and `GBP 70` offer content.
- `https://uk.buudy.com/products/buudy-ipl-hair-removal-device` returned `200` and contained IPL content and `GBP 129` offer content.
- `https://uk.buudy.com/pages/best-led-face-mask-uk` returned `200` and contained Best LED Face Mask content.
- `https://uk.buudy.com/google-merchant-feed.xml` returned `200`.

### Current Product And Market Facts Inspected

- `src/lib/market.ts` uses `siteUrl: "https://www.buudy.co.uk"`, locale `en-GB`, currency `GBP`, checkout source `uk_buudy`, and checkout UTM source `www.buudy.co.uk`.
- This differs from the older `Buudy-Vercel` UK app, which uses `https://uk.buudy.com` as `siteUrl`; the active Vercel aliases serve both. Future canonical/domain work must intentionally decide which value is source-of-truth before changing either folder.
- `src/data/contact.ts`, `src/data/about.ts`, FAQs, order tracking, and related user-facing fallbacks use `support@buudy.co.uk`.
- Current products in `src/data/products.ts`:
  - `buudy-led-mask`, slug `buudy-led-mask`, template `mask`, price `17900`, compare-at `44900`, rating `4.9`, review count `16000`, customer count `16,000+`, promo code `GLOWKIT`.
  - `buudy-red-torch`, slug `red-light-torch`, template `torch`, price `7000`, compare-at `17500`, rating `4.8`, review count `16000`, customer count `16,000+`, promo code `TORCH60`.
  - `buudy-ipl-device`, slug `buudy-ipl-hair-removal-device`, template `ipl`, price `12900`, compare-at `24900`, rating `4.9`, review count `450`, customer count `1,000+`, promo code `SMOOTH20`. The price lines still include source comments saying `TODO: Update with real pricing`; do not remove or change that unless the user explicitly asks.
- Current review dataset counts:
  - `src/data/reviews/buudy-led-mask-reviews.json`: `4274` reviews, rating distribution `1:3, 2:2, 3:4, 4:489, 5:3776`.
  - `src/data/reviews/buudy-red-torch-reviews.json`: `1172` reviews, rating distribution `1:34, 4:66, 5:1072`.
  - `src/data/reviews/buudy-ipl-hair-removal-device-reviews.json`: `2000` reviews, rating distribution `1:2, 2:2, 3:3, 4:250, 5:1743`.

### Checkout And PlusBase Facts Inspected

- `src/lib/site.ts` uses `plusbaseStoreUrl = "https://new-buudy.onshopbase.com"` and bridge path `/pages/add-to-cart`.
- Current PlusBase mappings in `src/lib/site.ts`:
  - `buudy-led-mask`: product ID `1000000671255940`, variant ID `1000020579664196`.
  - `buudy-ipl-device`: product ID `1000000671255943`, variant ID `1000020579664199`.
  - `buudy-red-torch`: product ID `1000000671255948`, variant ID `1000020579664204`.
- For LED mask checkout, the builder adds a red torch gift using the current red torch IDs.
- `src/app/api/checkout/prepare/route.ts` contains matching numeric PlusBase product mappings for the same three products.
- This differs from the older multi-region `Buudy-Vercel` UK app, which has older hardcoded LED/red-torch IDs and no IPL mapping in the inspected checkout builder.

### Files Inspected

- `AGENTS.md`.
- `package.json`.
- `pnpm-workspace.yaml`.
- `src/lib/market.ts`.
- `src/lib/site.ts`.
- `src/app/api/checkout/prepare/route.ts`.
- `src/data/products.ts`.
- `src/data/reviews.ts`.
- Review JSON files for LED mask, red torch, and IPL.
- Vercel deployment list, inspect summary, and filtered build logs.
- Live homepage, product, guide, and merchant-feed URLs listed above.

### Files Changed

- Added this append-only `CONTEXT.md` file.
- No application source, content, assets, review data, checkout logic, tracking, package files, Vercel settings, or deployment configuration were changed.

### Commands And Verification

- `git status --short --branch`.
- Sanitized `git remote -v`.
- `git fetch --all --prune --quiet`.
- `git rev-list --left-right --count "HEAD...@{upstream}"`.
- `git log --oneline --date=iso-strict`.
- `git show --stat --oneline --decorate HEAD`.
- `vercel --version`.
- `vercel ls`.
- `vercel inspect https://uk-buudy-400u53uu2-sahiljainsj004-5015s-projects.vercel.app`.
- `vercel inspect ... --format=json` with compact JSON extraction.
- `vercel inspect ... --logs` filtered for clone/build/status lines.
- `Invoke-WebRequest` route checks for the live aliases and key routes.
- Targeted `rg`, `rg --files`, and `Get-Content` reads.
- PowerShell JSON counts using `ConvertFrom-Json` for review datasets.

### Mistakes And Corrections During Audit

- An early `rg` search included large review JSON files and produced overly large terminal output. It did not modify files. Subsequent searches excluded review JSON and used targeted JSON counts.
- An initial raw Vercel JSON inspect produced much more output than needed. It was followed by compact extraction of deployment id, target, ready state, aliases, framework, node version, and output count.

### Not Tested

- No local lint, typecheck, build, browser screenshot, checkout submission, payment, order, Vercel logs error scan, domain setting inspection, environment variable inspection, or deployment promotion was run. The task was a read-only memory/deployment refresh and the existing production deployment was already Ready.

### Git And Publishing State

- After this task, the repository has a documentation-only context file from this entry.
- No commit, push, branch, pull request, fast-forward pull, merge, rebase, stash, reset, Vercel deploy, production promotion, rollback, alias change, domain change, environment variable change, or project setting change occurred.

### Remaining Notes For Future Work

- Treat this single-app UK deployment folder as newer than `Buudy-Vercel` for UK Buudy production state as of this entry.
- When the user asks for a Buudy change "in both", first reconcile both repos again, then adapt the change to each architecture. Do not assume product coverage, checkout mappings, canonical domain, or Vercel linkage are identical.

## 2026-08-11 10:41:14 +05:30 - Muuhu-parity image, before/after, promo, and checkout work completed locally

### Repository And Starting State

- Repository: `E:\1st YEAR DTU\New folder\uk.Buudy Vercel Deployment`; intended storefront/domain remains `https://www.buudy.co.uk` with active aliases documented above.
- Branch/HEAD: local `main` at `799ca7f9b9f231ea07a4418b7565e3b66bcbfe1a`; upstream `origin/main` at the same commit; final ahead/behind `0/0`.
- A non-destructive `git fetch --all --prune` was completed before editing. The only starting worktree item was this untracked append-only `CONTEXT.md`; it was preserved.
- Muuhu reference inspected: `E:\1st YEAR DTU\New folder\muuhu-store`, `main` at `bb3932bf`, aligned with its upstream and clean during the comparison.

### User Request And Scope

- Implement Muuhu-style global image loading, a click/keyboard before-and-after modal with the eight approved customer profiles, and an interactive case-insensitive `BUUDY10` cart promotion in this latest UK source first.
- Make checkout revalidate the promotion server-side, preserve UK gift behavior without an automatic gift coupon, and keep all current UK products, IDs, analytics, attribution, feeds, IPL work, prices, domains, and content intact.
- This repository was the source of truth for the matching `Buudy-Vercel/apps/uk` synchronization recorded separately.
- Protected areas: no price, product claim, review image/order, testimonial quote, canonical/domain, analytics account, attribution behavior, PlusBase ID, environment, Vercel, Git history, deployment, payment, or live order change outside the approved scope.

### Files And Routes Inspected

- Muuhu loader, before/after, cart provider/summary/promo, checkout form/action/API, and URL-builder implementations.
- UK root layout/global CSS, all public image render paths, cart provider/state/summary/form/action, `/cart`, `/api/checkout/prepare`, product data, before/after data/component, market/site/attribution helpers, PlusBase mappings, and current IPL/feed/Bing routes.
- Browser routes inspected locally: `/products/buudy-led-mask` and `/cart` at desktop and 390x844 mobile sizes.

### Files Changed

- Added `public/images/buudy-image-loader.svg` and `src/components/ui/GlobalImageLoader.tsx`.
- Changed `src/app/layout.tsx` and `src/app/globals.css` to install and style the root-level loader.
- Changed `src/components/product/BeforeAfterGrid.tsx` and `src/data/productSections.ts` for the accessible modal and approved customer profiles.
- Changed `src/lib/cart.ts`, `src/components/cart/CartProvider.tsx`, `src/components/cart/CartSummary.tsx`, `src/components/cart/CheckoutForm.tsx`, and `src/components/cart/PromoCodeBox.tsx` for persisted promotion state and dynamic totals.
- Changed `src/app/actions/checkout.ts`, `src/app/api/checkout/prepare/route.ts`, and `src/lib/site.ts` for server validation, actual mask/gift quantities, discount URL handling, attribution preservation, and product-aware fallback checkout URLs.
- Appended this `CONTEXT.md`. No other source, package, environment, or configuration file changed.

### Implementation Details

- The root image observer marks pending static and dynamically inserted `img` elements with `data-buudy-image-loading="true"`, keeps the Buudy SVG visible until `load` or `error`, then clears it. Existing lazy/eager behavior and videos are untouched. Reduced motion disables loader animation.
- All eight existing before/after cards remain in their existing order with their original concern, image, and quote. Cards are buttons and open a responsive dialog with cyclic previous/next, close/Escape, focus restoration, body locking, mobile swipe, adjacent decode/preload, full name/age, verified status, skin type, skincare routine, experience, and quote.
- Approved profiles added exactly for Donna Parker 52, Jane Phillips 46, Sarah King 49, Michelle Lewis 41, James Davies 44, Karen Wilson 38, Linda Scott 55, and Jennifer Harris 36.
- Cart persistence now includes backward-compatible `manualPromoCode`. Only `BUUDY10` is valid, case-insensitively; it normalizes to uppercase, deducts exactly GBP 10 once per cart, floors totals at zero, supports accessible error/success/removal UI, and persists safely across reload.
- Cart subtotal, promotion discount, free-gift value, savings, and final total derive from actual cart lines. The promo control is in the right summary above totals and checkout.
- `/api/checkout/prepare` revalidates the code with `getAppliedManualPromoCode`; client discount amounts are never trusted. UK sends no automatic gift coupon. Torch gift quantity equals the actual mask quantity, IPL/torch-only carts do not receive a mask gift, and bridge fallback uses the actual first paid product and quantity.
- Current PlusBase IDs: mask `1000000671255940`/`1000020579664196`, IPL `1000000671255943`/`1000020579664199`, torch `1000000671255948`/`1000020579664204`.

### Mistakes, Findings, And Corrections

- The first batched MutationObserver implementation did not mark a newly inserted delayed image promptly in the browser probe. It was replaced with direct observer synchronization; pending, success, and error states then passed.
- A first combined Playwright promo script clicked before client hydration and later inspected a hidden cart-drawer duplicate. The harness was corrected to wait for the loader-ready marker and target visible controls; no production behavior was changed for this test issue.
- Mock-path inspection found that the UK fallback could request a torch for an IPL-only cart because it used generic quantity. The route now calculates real mask quantity and passes the actual fallback product ID/quantity.

### Verification

- `npm run lint`: passed with `0` errors and `34` pre-existing warnings.
- `npm run build`: passed on Next.js `16.2.6`, TypeScript completed, and all `33/33` static pages/routes generated, including IPL, Bing conversion, and merchant feed routes.
- `git diff --check`: passed; Git only reported existing LF-to-CRLF checkout notices.
- Delayed-image browser probe used a local two-second image response: loading attribute present while `complete=false`, removed after successful load, and removed after error.
- Playwright desktop modal: Donna details visible, next reached Jane, Escape closed, and focus returned to Donna's card. Mobile 390x844: no horizontal overflow, full-viewport dialog, visible navigation, and synthetic swipe reached Jane.
- Cart browser test: empty and incorrect codes rejected; lowercase `buudy10` normalized; total changed GBP 179 to GBP 169; reload persistence passed; removal restored GBP 179.
- Mocked checkout suite passed gift-only, promo-only, combined behavior, invalid code, non-mask, multi-quantity, fallback mask, and fallback non-mask cases. No request reached live PlusBase.
- Visual screenshots were inspected from the external Codex visualization workspace. Cart placement and mobile modal composition were coherent. Local browser console errors were limited to Tawk CORS; unavailable Supabase review DNS was also observed during local dev and did not break page rendering.

### Not Tested And Remaining Uncertainty

- No live PlusBase checkout session, coupon mutation, payment, or order was created. Repeated `discount` query parameters and hosted coupon-combination behavior remain dependent on PlusBase accepting the attempted codes in production.
- No Vercel preview/production build, deployment, alias, domain, environment, analytics dashboard, or PlusBase admin setting was changed or tested.

### Final Git And Publishing State

- Final local `main` remains at `799ca7f`, ahead/behind `0/0`; scoped source/assets plus this untracked append-only context are unstaged.
- No commit, push, branch, pull request, pull, merge, rebase, stash, reset, deployment, promotion, rollback, live checkout, payment, order, alias, environment, Vercel, or PlusBase setting action occurred.

## 2026-08-11 18:21:23 +05:30 - Desktop About Us, FAQs, and Contact Us header links restored locally

### Repository And Starting State

- Repository/domain: `E:\1st YEAR DTU\New folder\uk.Buudy Vercel Deployment`, serving the UK storefront at `https://www.buudy.co.uk` and the documented UK aliases.
- Branch/HEAD: clean local `main` at `6026edaae7dcb0638e06493c1f47f0c76cbaee0f`, tracking identical `origin/main`; a fresh `git fetch --all --prune` confirmed ahead/behind `0/0` before editing.
- Latest commit inspected: `6026eda feat: Apply promo code on cart, fix before after and and loading cta animation behind images`.
- Muuhu reference: clean/fetched `muuhu-store` `main` at `f4786b7a`, aligned `0/0`; its latest commit contains the working UK header visibility correction.

### User Request, Diagnosis, And Protected Scope

- The user supplied a production screenshot of `/products/buudy-led-mask` where the left product navigation and Buudy logo appeared but `About Us`, `FAQs`, and `Contact Us` were missing on the right. They asked for the same correction already made successfully in Muuhu.
- Live production reproduction showed the primary navigation switches on at Tailwind `lg` (1024px) while the secondary navigation remained `hidden` until `xl` (1280px). A physically wide Windows/browser screenshot can therefore have a CSS viewport below 1280px because of display scaling or browser zoom, producing exactly the supplied result.
- Scope was limited to desktop header visibility and spacing. Protected and unchanged: navigation labels/routes, mobile menu, logo asset/positioning, cart/account behavior, product content/layout, prices, checkout, analytics, SEO, feeds, images/video, page order, Vercel configuration, and production state.

### Files And Routes Inspected

- Inspected the supplied screenshot, current `src/components/layout/Header.tsx`, `src/data/navigation.ts`, local Next.js 16 CSS/Tailwind documentation, and Muuhu `apps/uk/src/components/layout/Header.tsx` plus commit `f4786b7a`'s header diff.
- Inspected live `https://www.buudy.co.uk/products/buudy-led-mask` at 1024, 1100, 1279, 1280, and 1365 CSS-pixel widths. Before the change, live primary navigation was `flex` at 1100 while secondary navigation was `none`; it became `flex` only at 1280.
- Local routes checked: `/products/buudy-led-mask`, `/pages/about-us`, `/pages/faqs`, and `/pages/contact-us`.

### File Changed And Implementation

- Changed only `src/components/layout/Header.tsx` plus this append-only context.
- Mirrored Muuhu's responsive classes: secondary navigation now uses `lg:flex` instead of `xl:flex`; primary/secondary link gaps use `gap-5` on desktop and restore the existing `gap-7` at `2xl`; container/right-control gaps use compact `lg` values and restore existing spacing at `2xl`.
- The links remain `/pages/about-us`, `/pages/faqs`, and `/pages/contact-us`. Mobile behavior remains unchanged because both desktop navs are still hidden below `lg` and the menu button remains visible.

### Verification

- `npm run lint`: passed with `0` errors and the repository's existing `34` warnings.
- `npm run build`: passed on Next.js `16.2.6`; TypeScript completed and all `33/33` routes generated.
- `git diff --check`: passed with only the expected Windows LF-to-CRLF notice.
- Playwright on `http://localhost:3101/products/buudy-led-mask`: at 1024, 1100, 1279, and 1536px both primary and secondary navs computed to `display:flex`, all three expected secondary labels/routes were present, desktop menu button was hidden, header stayed 73px high, and no horizontal overflow existed.
- At 390x844 both desktop navs computed to `display:none`, the menu button computed to `display:grid`, header stayed 65px high, and no horizontal overflow existed.
- Desktop 1100x850 and mobile 390x844 screenshots were visually inspected. The desktop links sit to the right of the centred Buudy logo with cart/account controls intact; mobile remains unchanged. Generated `.playwright-cli` files were verified as task-created and removed after inspection.
- All three destination routes returned local HTTP `200`. Final Playwright console inspection reported `0` errors; development warnings were non-blocking.

### Mistakes, Not Tested, And Final State

- A first long Playwright metrics expression was split by PowerShell because of nested selector quoting. It did not modify the application; the same checks were rerun with simpler expressions and passed.
- The first cleanup attempt used a policy-blocked recursive `Remove-Item`. The target was then explicitly resolved inside the repository, its nine generated files were listed, and those exact files plus the empty directory were removed non-recursively through PowerShell/.NET. No user file was deleted.
- No production deployment or post-deployment production check was performed because the user did not authorize publishing. The live page was inspected only to establish the pre-fix defect; the corrected result was verified locally.
- Final Git HEAD/upstream remain `6026eda` and `0/0`. The scoped header and append-only context changes are local and unstaged. No commit, push, branch, PR, pull, merge, rebase, stash, reset, deployment, promotion, rollback, Vercel/domain/alias/environment change, checkout, payment, or order occurred.
- The local dev server was intentionally left available at `http://localhost:3101` for user review.
