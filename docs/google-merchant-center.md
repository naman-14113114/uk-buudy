# Google Merchant Center: Buudy UK

## Product data source

Use a scheduled file fetch from:

```text
https://www.buudy.co.uk/google-merchant-feed.xml
```

Configure it in Merchant Center as an English, United Kingdom product source. Fetch daily after the storefront deployment window. The endpoint is regenerated from the store's canonical product data and revalidated hourly.

The source contains two stable product IDs:

| ID | Product | Price source | Campaign label |
| --- | --- | --- | --- |
| `buudy-led-face-mask-uk` | Buudy 7 Colour LED Face Mask | `buudyMask.priceCents` | `hero-product` |
| `buudy-red-light-torch-uk` | Buudy Handheld Red Light Therapy Torch | `buudyRedTorch.priceCents` | `accessory` |

Do not change these IDs or submit the same products through another primary source. If either product receives a verified GTIN or manufacturer-assigned MPN, replace `identifier_exists=no` with that verified identifier in `src/lib/googleMerchant.ts`.

## Merchant Center configuration

1. Verify and claim `www.buudy.co.uk`.
2. Enable Free listings under Marketing methods.
3. Add a UK shipping service: free shipping, 1-3 business-day handling and 3-10 business-day transit. Keep this account-level setting rather than duplicating it per item in the feed.
4. Keep the public product price, availability and currency exactly aligned with the feed. The feed intentionally uses the current purchasable GBP price, not a permanent compare-at price or an unsupported sale claim.
5. Configure a separate Merchant Promotion for the mask gift offer. Do not create a GBP 0 Red Torch product to represent the gift.

## Approval blockers to resolve before scale

Google requires customers to buy directly from the claimed store without being redirected to a different website. The UK store currently sends checkout to `buudy.com` because PlusBase processes payment there. Map a PlusBase checkout custom domain such as `checkout.buudy.co.uk` before treating this source as Shopping-ready; keep all checkout and payment steps HTTPS on the Buudy UK domain family.

The current public return policy describes a 7-business-day issue window while product markup has advertised a 90-day return policy. The feed therefore makes no return-window claim and the structured data does not publish one. Align the customer-visible guarantee and return policy before submitting a return-policy setting in Merchant Center.

## Shopping and search strategy

Shopping campaigns do not let advertisers target one exact search keyword. Product titles, detailed descriptions, product type, category, images, price, landing-page relevance and auction signals determine matching. This feed is deliberately optimized for direct product searches such as `LED face mask`, `7 colour LED mask`, `near-infrared face mask` and `red light therapy torch` without misleading keyword stuffing.

Keep `best led face mask` in a separate Search campaign pointed at the comparison/editorial page, where the query intent is genuinely comparative. Use the feed's custom label 0 to separate the mask from the torch in Shopping reporting and budgets. Start with the mask only if the torch is mainly a gift; add the torch after its standalone checkout flow and policy review are confirmed.
