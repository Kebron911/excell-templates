# STRLedger — Deploy Status

**Status:** DRAFT — DO NOT DEPLOY OVER LIVE SITE
**Last updated:** 2026-05-11

---

## Critical safety constraint

`thestrledger.com` is **live and serving customers** from a separate Hostinger
deploy that this repo does not currently own. This scaffold is a placeholder
for owning the source — it is NOT feature-complete and will break the live
site if deployed as-is.

**Before any deploy** that points DNS at this build:

1. Verify the live homepage hero, sections, and product cards are matched.
2. Verify all 12 live product SKUs (see §"Catalog gap" below) are represented
   with correct price, copy, image, and `/products/{SKU}/` route.
3. Verify the `/free/47-deductions` lead-magnet flow (form action, email
   provider webhook, double opt-in) is wired to the same provider as live.
4. Verify the `/blog/*` content is migrated (or temporarily empty + a
   redirect to `blog.thestrledger.com` if Ghost-hosted).
5. Verify Etsy "Buy now" links still resolve.
6. Soft-launch on a preview URL first (e.g., `preview.thestrledger.com`)
   and run a manual smoke test before flipping DNS.

The pnpm-workspace puts `STRLedger` first to signal it as parent; this is
purely organizational and does NOT trigger deploy.

---

## Catalog gap

The live site shows **12 workbook SKUs**. This scaffold has **2** seeded.

| SKU | Title | Price | Wave | Live? | Scaffold? |
|---|---|---|---|---|---|
| TAX-001 | The Mileage Log | $17 | Wave 1 | yes | **yes** |
| GST-001 | The Welcome Book | $17 | Wave 1 | yes | missing |
| OPS-001 | The Turnover Checklist | $12 | Wave 1 | yes | missing |
| TAX-002 | The P&L Tracker | $27 | Wave 2 | yes | missing |
| TAX-003 | The 1099-NEC Tracker | $17 | Wave 2 | yes | missing |
| TAX-004 | The Schedule E Workbook | $47 | featured | yes | missing |
| GST-002 | The House Rules Builder | $17 | — | yes | missing |
| OPS-002 | The Damage Claim Log | $17 | — | yes | missing |
| FIN-001 | The RevPAR Dashboard | $27 | — | yes | missing |
| FIN-003 | The Cash-Flow Forecaster | $47 | — | yes | missing |
| ACQ-001 | The Deal Analyzer | $27 | — | yes | **yes** |
| (1 more) | (truncated in fetch) | — | — | yes | missing |

Each missing SKU needs an MDX file under `src/content/products/{SKU}.mdx`
matching the schema in `src/content.config.ts`. The two seeded SKUs
(TAX-001 + ACQ-001) follow the right slug-as-SKU pattern and serve as
templates.

---

## Other gaps before feature parity

- **Homepage:** scaffold homepage uses ClusterFunnelBlock + product cards
  generated from `getCollection('products')`. Live homepage has a curated
  hero section featuring TAX-004 ("The 2026 Schedule E"), a "Wave 1" cluster
  callout, and Etsy-direct buy buttons per card. Adapt index.astro to match.
- **Etsy direct-buy buttons:** every product card on live has a "Buy now"
  link to `https://www.etsy.com/shop/TheSTRLedger`. Scaffold has "See inside →"
  internal links only. Add an `etsyUrl` field to the product schema +
  surface the button on the card and detail page.
- **`/free/47-deductions`:** scaffold has the page but no form-handler
  wiring. Live integrates with the Influencersoft + n8n stack
  (see `infrastructure/`).
- **Blog:** scaffold has Astro-content `/blog`. Live blog appears to be at
  `blog.thestrledger.com` (Ghost, per `README.md`). Decide:
  - Migrate Ghost posts into Astro MDX (more SEO control, more migration
    work), OR
  - Keep Ghost subdomain and link to it from the scaffold (less migration,
    less control). README implies the latter.
- **Tracking:** scaffold emits a `PUBLIC_GA4_ID` env-var hook in Layout.astro
  (mirroring sister-site pattern). Confirm GA4 + GSC verification land at
  the parent property before flipping DNS.

---

## What IS ready in this scaffold (don't lose this when filling the gap)

- Layout + Header + Footer + Wordmark + ClusterFunnelBlock + JsonLd chrome.
- `src/lib/seo.ts` with `buildOrganization`, `buildWebSite`,
  `buildProduct`, `buildFAQPage`, `buildBreadcrumb`, `buildItemList`,
  `buildArticle`, `canonical` (always trailing slash).
- `Organization.sameAs[]` populated with all 5 sister-site URLs
  (**Move 2** from `docs/seo/CLUSTER-SEO-ROLLUP-2026-05-10.md`).
- Product + Offer + Brand + BreadcrumbList + FAQPage JSON-LD on
  product detail pages (**Move 3**).
- `astro check`: 0 errors.
- `astro build`: clean. Sitemap + robots.txt emitted.

---

## Suggested next-step order

1. **Fill the catalog gap.** Add the 10 missing product MDX files using
   the live site as the source of truth for title, price, description,
   and inside-the-workbook bullets. The two seeded SKUs (TAX-001, ACQ-001)
   serve as templates.
2. **Add `etsyUrl` to schema** and surface "Buy now" buttons.
3. **Match the live homepage** hero + section structure.
4. **Decide blog strategy** (Ghost vs. migrate).
5. **Wire `/free/47-deductions`** form to Influencersoft via n8n.
6. **Soft-launch on preview URL** + smoke test.
7. **Flip DNS** once smoke passes.

Anything that touches Hostinger DNS or replaces deployed files is
out of scope for this repo until step 7 — leave the live site alone.
