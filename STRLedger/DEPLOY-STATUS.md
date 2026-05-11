# STRLedger — Deploy Status

**Status:** DRAFT — DO NOT DEPLOY OVER LIVE SITE
**Last updated:** 2026-05-12

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

## Catalog parity

The live site shows **12 workbook SKUs**. This scaffold has **12 seeded** — full parity.

| SKU | Title | Price | Wave | Live? | Scaffold? |
|---|---|---|---|---|---|
| TAX-001 | The Mileage Log | $17 | Wave 1 | yes | **yes** |
| GST-001 | The Welcome Book | $17 | Wave 1 | yes | **yes** |
| OPS-001 | The Turnover Checklist | $12 | Wave 1 | yes | **yes** |
| TAX-002 | The P&L Tracker | $27 | Wave 2 | yes | **yes** |
| TAX-003 | The 1099-NEC Tracker | $17 | Wave 2 | yes | **yes** |
| TAX-004 | The Schedule E Workbook | $47 | featured | yes | **yes** |
| GST-002 | The House Rules Builder | $17 | — | yes | **yes** |
| OPS-002 | The Damage Claim Log | $17 | — | yes | **yes** |
| FIN-001 | The RevPAR Dashboard | $27 | — | yes | **yes** |
| FIN-003 | The Cash-Flow Forecaster | $47 | — | yes | **yes** |
| ACQ-001 | The Deal Analyzer | $27 | — | yes | **yes** |
| LGL-001 | The Renewal Calendar | $17 | — | yes | **yes** |

Slug-as-SKU pattern (e.g. `slug: "GST-001"`) emits routes that match live
(`/products/GST-001/`). Body copy was written against the live product
pages, not invented.

**What product MDX still lacks vs. live:**

- `etsyUrl` — live site has a "Buy on Etsy" button on every card; scaffold's
  `BuyButton` is internal-only. Add `etsyUrl?: string` to the schema and
  surface a second button.
- `cover` image — `image: z.string().optional()` in the schema; covers are
  not yet sourced. Live uses `/covers/TAX-001.svg`-style paths.
- `aggregateRating` — once review data exists, lift it from Etsy + Stripe
  reviews. Currently omitted (correctly — fake ratings invite a Google
  manual action).

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

1. ~~Fill the catalog gap~~ — **DONE** (commit `a8f7657`, 12/12 SKUs).
2. ~~Add `etsyUrl` to schema~~ — **DONE** (etsyUrl field added with
   shop-root default; surfaced as "Buy on Etsy" buttons on every
   product detail page, the /products/ catalog index, and each
   homepage product card).
3. ~~Match the live homepage~~ — **DONE** (Hero copy mirrors live's
   "Run your rentals before they run you" with the same italic "you"
   styling; featured-product hero block surfaces TAX-004 with
   "See inside" + "Buy on Etsy" CTAs; 12-card catalog grid matches
   live's "12 workbooks. Zero subscriptions" section).
4. ~~Decide blog strategy~~ — **DONE** (`blog.thestrledger.com` Ghost
   subdomain is canonical; `/blog/` landing on the main site now links
   readers to Ghost prominently and only optionally surfaces any
   on-site MDX as "Also on this site").
5. ~~Wire `/free/47-deductions` form~~ — **DONE** (form posts to the
   webhook at `PUBLIC_N8N_MAGNET_URL`; falls back to a `mailto:` with
   a friendly subject when the env var is unset, with a visible note
   to the operator that the env var needs to be set in production).
6. ~~Source cover images~~ — **DONE** (12 placeholder SVGs at
   `/public/covers/<SKU>.svg`, category-coloured, brand-typed; product
   MDX `image` field now points at the cover so Product JSON-LD
   emits it).
7. **Soft-launch on preview URL** + smoke test (e.g.,
   `preview.thestrledger.com`).
8. **Flip DNS** once smoke passes AND DEPLOY-STATUS marker flips to
   READY.

All 6 content/code parity gaps closed in commits this session. What
remains is operational: provisioning, secrets, soft-launch, smoke.

Anything that touches Hostinger DNS or replaces deployed files is
out of scope for this repo until step 8 — leave the live site alone.

---

## Deploy pipeline (built, gated)

The scaffold has a deploy pipeline wired but **gated on this very file**.
The gate refuses to ship as long as the "DRAFT — DO NOT DEPLOY OVER
LIVE SITE" marker appears at the top of this document.

### Manual / local deploy

`STRLedger/scripts/deploy.ps1` — mirrors `STRBuyers-Tools/scripts/deploy.ps1`
(SFTP via OpenSSH + WinSCP fallback, atomic backup-by-rename, idempotent
hash check, 755/644 permission fix, post-deploy smoke).

Behavior:
- `pnpm deploy` — DRAFT check blocks; explains how to unlock.
- `pnpm deploy:verify` — runs the smoke test against the live site
  without uploading anything. Always safe.
- `pnpm deploy -- -ConfirmReplaceLive` — explicit bypass once you've
  closed parity gaps and intend to replace the live site.

Requires `C:\Users\Kebron\Desktop\Claude OS\.secrets\hostinger.env` to
contain:
```
STRLEDGER_SSH_HOST=...
STRLEDGER_SSH_USER=...
STRLEDGER_SSH_PORT=...
STRLEDGER_SSH_KEY_PATH=C:\Users\Kebron\.ssh\hostinger_ed25519
STRLEDGER_DOC_ROOT=/home/.../domains/thestrledger.com/public_html
```

### CI deploy

`.github/workflows/deploy-strledger.yml` runs on every push to `main`
that touches `STRLedger/**`. Behavior matches the local script:

- Build + typecheck + test + verify always run (catches regressions).
- Deploy step is gated on `DEPLOY-STATUS.md` not containing the DRAFT
  marker.
- Bypass: set repo secret `STRLEDGER_DEPLOY_CONFIRM=1` (one-time ack).

Required repo secrets when ready to ship:
- `STR_SSH_KEY` — shared cluster SSH private key
- `STRLEDGER_SSH_HOST` — Hostinger IP
- `STRLEDGER_SSH_USER` — `u470667024`
- `STRLEDGER_DOC_ROOT` — `/home/u470667024/domains/thestrledger.com/public_html`
- `STRLEDGER_GA4_ID` — production GA4 measurement ID
- `STRLEDGER_DEPLOY_CONFIRM` — set to `1` only when DRAFT marker is
  removed AND parity gaps are closed.

### Unlocking the gate (the runbook)

1. Close the catalog/parity gaps listed in this file (steps 2–6 above).
2. Edit this file: change the top line from
   `**Status:** DRAFT — DO NOT DEPLOY OVER LIVE SITE`
   to
   `**Status:** READY — feature parity verified <YYYY-MM-DD>`.
3. Commit and push.
4. For CI: set repo secret `STRLEDGER_DEPLOY_CONFIRM=1`.
5. Soft-launch to a preview subdomain first (e.g.,
   `preview.thestrledger.com`) and run smoke against it.
6. Once smoke passes on preview, flip DNS or update the production
   doc-root variable to thestrledger.com's docroot.

Until step 2 is done, both the local script and CI will refuse to
upload. That's the entire point of this file.
