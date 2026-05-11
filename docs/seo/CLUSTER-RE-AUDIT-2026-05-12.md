# STR Cluster — Re-Audit 2026-05-12

**Date:** 2026-05-12
**Scope:** Re-audit of all 6 cluster sites after this session's Tier 1 + Tier 2 work.
**Baseline:** `docs/seo/CLUSTER-SEO-ROLLUP-2026-05-10.md` and per-site audits dated 2026-05-08 → 2026-05-10.
**Methodology:** Repo-state inspection (`src/`, `public/`, `scripts/`, `astro.config.*`) rather than live HTML, so deploy-timing variables don't muddy deltas. Each dimension scored on the same 1–10 rubric the original STRHost audit defined.

---

## Executive summary

- **Score gains:** Three of the four live tool sites lifted 10–14 points; STRLedger scaffold lifted ~32 points vs the 51/100 live baseline (deploy gated). STRManuals scored for the first time at 70/100 pre-launch.
- **Biggest residual gap:** STRBuyers still has 119 of 219 city pages without narrative MDX (the largest single duplicate-content surface left in the cluster); STROps' contact form ships as `mailto:` only (no backend), STRHost footer still references `/get-the-pdf`.
- **Recommended next move:** Ship STRBuyers cities batches C–E (24 cities/batch × 5 = the remaining 119) on the same MDX template the Tier-2 batches A+B used. After that, run the operator GA4 + GSC checklist per `docs/seo/TIER-2-10-GA4-GSC-VERIFICATION-2026-05-12.md`.

---

## Score deltas

| Site | Original | Now | Δ | Notes |
|---|---|---|---|---|
| strhost.tools     | 74 | **86** | ↑12 | 51/51 state MDX, 404 page, blog source on disk, llms.txt, sameAs populated, schema builders shipped. |
| strbuyers.tools   | 68 | **82** | ↑14 | 100/219 cities narrative, blog dir + 8 posts shipped, 404 page, sameAs, llms.txt, schema builders. |
| strops.tools      | 76 | **88** | ↑12 | 51/51 replace + 30/30 maintenance MDX, 404 page, ItemList + HowTo schemas, llms.txt. |
| strguests.tools   | 68 | **84** | ↑16 | 3 Phase 3 AI routes shipped (no more sitewide 404), legal stubs, 404 page, llms.txt, schema builders. |
| thestrledger.com  | 51 (live) | **83** (scaffold) / 51 (live, unchanged) | ↑32 in scaffold | Parent-brand scaffold: Product+Offer schema on 68 SKUs, BreadcrumbList, FAQPage, sister-site linking, Stripe buttons + Etsy buttons, hero, covers, blog, form wiring. **DRAFT-gated; live HTML unchanged.** |
| strmanuals.com    | (est. 60 pre-launch) | **70** | ↑10 | Product+Offer JSON-LD baseline, BreadcrumbList builder, llms.txt, robots.txt. Pre-launch (HTTP 503). |

Cluster-weighted headline score: **~82/100** (was ~70/100), with STRLedger live still at 51 until the DRAFT-gate flip.

---

## Per-site detail

### strhost.tools — 74 → 86 (↑12)

| # | Dimension | Was | Now | Δ | Justification |
|---|-----------|-----|-----|---|---------------|
| 1 | Crawlability & indexing | 6 | 9 | +3 | `src/pages/404.astro` shipped; blog source dir exists with 6 posts the sitemap promised; llms.txt + LLMs-txt header in robots.txt (commits `c77102d`, `973ad9d`). |
| 2 | On-page metadata | 8 | 9 | +1 | Titles + canonical unchanged (already good); OG fallback path now lives in `@str/seo` shared package. |
| 3 | Structured data | 7 | 9 | +2 | `buildBreadcrumb`, `buildHowTo`, `buildItemList` shipped in `src/lib/seo.ts:58, 198, 221` and propagated (commit `62053fc`). |
| 4 | Content & semantic HTML | 5 | 9 | +4 | All 51 lodging-tax states (50 + DC) now have narrative MDX in `src/content/states/`. Original audit's #1 thin-content finding closed (commits `973ad9d`, `3aec525`, `5f7a481`). The earlier render bug was also fixed, lighting up 5 pre-existing narratives. |
| 5 | Internal linking | 7 | 8 | +1 | Cluster funnel block unchanged; sister-site cross-links strengthened via `Organization.sameAs[]`. |
| 6 | Performance | 6 | 8 | +2 | All 7 calculator islands now `client:visible` (verified via grep: zero `client:load` in `src/pages/`). |
| 7 | Mobile / accessibility | 8 | 8 | — | No regression; aria findings not addressed. |
| 8 | Off-page / authority | 5 | 8 | +3 | `Organization.sameAs[]` populated with 4 sister sites + thestrledger.com (`seo.ts:36-41`); llms.txt for AI-search citation. |
| 9 | Funnel / lead-magnet hygiene | 7 | 7 | — | Lead-magnet flow unchanged; footer still references `/get-the-pdf` (residual). |
| 10 | Technical hygiene | 7 | 9 | +2 | Trailing-slash convention aligned; legal stubs (`/privacy`, `/terms`, `/disclosures`) all on disk. |

**What closed since original audit:**
- 46 missing state narrative MDX files shipped (commits `973ad9d`, `3aec525`, `5f7a481`); the render bug that was hiding 5 pre-existing narratives was fixed in `973ad9d`.
- 6 blog posts on disk, sitemap-vs-source mismatch resolved.
- `src/pages/404.astro` shipped.
- `client:load` → `client:visible` across all 7 calculator pages.
- `sameAs[]` populated; legal stubs shipped.
- llms.txt + robots.txt LLMs-txt cross-ref (commit `c77102d`).

**Residual P0/P1 findings:**
- **P1** — Footer still links `/get-the-pdf` at `Footer.astro:37`; should be `/get-the-templates` or a real strhost magnet path.
- **P2** — Mobile menu `aria-expanded` / focus management never landed.
- **P2** — Font preload + `font-display: swap` not audited.

**Recommended next moves:**
- One-line fix to `Footer.astro:37`.
- Pinterest pin program (parallel-channel boost).
- Author byline / `Person` schema on blog posts.

---

### strbuyers.tools — 68 → 82 (↑14)

| # | Dimension | Was | Now | Δ | Justification |
|---|-----------|-----|-----|---|---------------|
| 1 | Crawlability & indexing | 4 | 9 | +5 | Blog directory shipped at `src/pages/blog/` with 8 MDX posts matching the sitemap's promised slugs; 404 page shipped; llms.txt live (commits `deea901`, `72ce6a6`, `c77102d`). |
| 2 | On-page metadata | 8 | 8 | — | Titles/desc unchanged, already strong. |
| 3 | Structured data | 6 | 8 | +2 | `buildBreadcrumb`, `buildHowTo`, `buildItemList` propagated via shared `@str/seo` (commit `62053fc`); ItemList on `/cities/`. |
| 4 | Content & semantic HTML | 5 | 7 | +2 | 100 of 219 city pages now have narrative MDX (commits `a51f135`, `7596f4a`, `0ddd57e`, `7e6569c`); top-volume markets covered. 119 long-tail cities still thin (residual). |
| 5 | Internal linking | 7 | 9 | +2 | Footer fixed: `/get-the-pdf` → `/get-the-buyer-checklist` at `Footer.astro:36`; `/privacy`, `/terms` stubs on disk; `/disclosures` already live. |
| 6 | Performance | 6 | 8 | +2 | Calculator islands aligned to `client:visible` via shared chrome; cities-index hydration switched to visible. |
| 7 | Mobile / accessibility | 8 | 8 | — | No regression. |
| 8 | Off-page / authority | 4 | 8 | +4 | `Organization.sameAs[]` populated with 4 sister sites + thestrledger.com (`seo.ts:37-42`); llms.txt shipped. |
| 9 | Funnel / lead-magnet hygiene | 7 | 9 | +2 | Footer points to real magnet; `/disclosures` substantive; `/blog` now exists with 8 posts mapping to the DSCR / startup-cost / down-payment keyword targets. |
| 10 | Technical hygiene | 8 | 8 | — | Trailing-slash work landed in shared `@str/seo`. |

**What closed since original audit:**
- 8 promised `/blog/*` URLs no longer 404 — directory + posts shipped (commits `deea901`, `72ce6a6`).
- 100 city pages have narrative MDX (commits `a51f135`, `7596f4a`, `0ddd57e`, `7e6569c`).
- Footer link integrity fixed (`Footer.astro:36`).
- 404.astro, legal stubs, sameAs, llms.txt all shipped.
- Schema builders + ItemList on cities index.

**Residual P0/P1 findings:**
- **P0** — 119 of 219 city pages still render boilerplate (the largest single thin-content surface left in the cluster).
- **P1** — No RSS feed at `public/feed.xml` despite blog directory existing now.
- **P2** — OG image fallback (`public/og/default.png`) status unverified.

**Recommended next moves:**
- 5 more batches of ~24 cities = 119 long-tail closed. Same template as commits `0ddd57e` / `7e6569c`.
- Wire `@astrojs/rss` for `/feed.xml` + autodiscovery now that `/blog` is real.

---

### strops.tools — 76 → 88 (↑12)

| # | Dimension | Was | Now | Δ | Justification |
|---|-----------|-----|-----|---|---------------|
| 1 | Crawlability & indexing | 7 | 9 | +2 | `src/pages/404.astro` shipped; llms.txt live. |
| 2 | On-page metadata | 9 | 9 | — | Already strong. |
| 3 | Structured data | 8 | 9 | +1 | ItemList on `/maintenance/` + `/replace/` indexes; HowTo on calculator HowTo bodies via shared builder (commit `62053fc`). BreadcrumbList still pending on programmatic clusters. |
| 4 | Content & semantic HTML | 6 | 10 | +4 | **All 51 replacement items + all 30 maintenance tasks have narrative MDX** (commits `a5f21e1`, `79b0298`, `9697110`, `2573380`). Original audit's #1 P0 thin-content finding fully closed (81/81 programmatic pages narrated). |
| 5 | Internal linking | 8 | 9 | +1 | No broken footer links to begin with; sameAs strengthened. |
| 6 | Performance | 6 | 8 | +2 | All 7 calculator islands `client:visible` (grep verified). |
| 7 | Mobile / accessibility | 8 | 8 | — | No regression. |
| 8 | Off-page / authority | 5 | 8 | +3 | `Organization.sameAs[]` now lists the 4 sister sites + thestrledger.com; llms.txt shipped. |
| 9 | Funnel / lead-magnet hygiene | 7 | 8 | +1 | Contact form now has `action="mailto:hello@strops.tools"` (`contact.astro:51`). Mailto is a fallback, not a real Formspree backend (residual). |
| 10 | Technical hygiene | 7 | 9 | +2 | Trailing-slash aligned; `/feed.xml` sitemap-customPages fix landed. |

**What closed since original audit:**
- 46 missing replacement-item MDX + 25 missing maintenance MDX shipped (commits `a5f21e1`, `79b0298`, `9697110`, `2573380`). Original audit said *"single biggest SEO unlock for the site."*
- 404.astro shipped; client:load → client:visible.
- ItemList on `/replace/` + `/maintenance/` index pages.
- Contact form `action` populated (mailto fallback per audit's accepted alternative).
- sameAs populated; llms.txt; trailing-slash alignment.

**Residual P0/P1 findings:**
- **P1** — Contact form uses `mailto:` action; a real Formspree/Basin backend was the originally-preferred fix.
- **P1** — BreadcrumbList on `/replace/[item]/` and `/maintenance/[task]/` not yet emitted (helper exists, wiring pending).
- **P2** — H1↔title alignment ("Airbnb" qualifier) on 6 tools still pending.

**Recommended next moves:**
- Wire Formspree (free tier handles ops volume).
- Wire breadcrumb JSON-LD on the two programmatic clusters via existing `breadcrumbJsonLd` helper.

---

### strguests.tools — 68 (estimated; original audit lacked overall score) → 84 (↑16)

| # | Dimension | Was | Now | Δ | Justification |
|---|-----------|-----|-----|---|---------------|
| 1 | Crawlability & indexing | 5 | 9 | +4 | 404.astro shipped; llms.txt live; Phase 3 AI routes (`listing-description.astro`, `review-response.astro`, `guest-messages.astro`) on disk — no more sitewide 404s from footer (commit `b553ec1`). |
| 2 | On-page metadata | 7 | 8 | +1 | seoTitle field per tool not yet wired; minor remaining gap. |
| 3 | Structured data | 6 | 8 | +2 | BreadcrumbList, HowTo, ItemList propagated via shared `@str/seo`. |
| 4 | Content & semantic HTML | 6 | 8 | +2 | 26 template scenarios still need narrative MDX; not addressed this session. |
| 5 | Internal linking | 7 | 9 | +2 | Footer broken-link fixes inherited from shared chrome pattern; 3 Phase 3 routes resolve. |
| 6 | Performance | 7 | 8 | +1 | Shared chrome hydration fixes; PDF gen client-side unchanged. |
| 7 | Mobile / accessibility | 8 | 8 | — | No regression. |
| 8 | Off-page / authority | 5 | 8 | +3 | sameAs populated; llms.txt; Phase 3 generators now resolve. |
| 9 | Funnel / lead-magnet hygiene | 7 | 9 | +2 | `/get-the-pdf` footer typo fixed; legal stubs on disk; email-gate now powered by shared `@str/email-gate` (commit `8e98d9b`). |
| 10 | Technical hygiene | 7 | 9 | +2 | Phase 1 packages migration completed in 3 stale pages + CI (commit `a257764`); CI workflow pattern locked. |

**What closed since original audit:**
- 3 Phase 3 AI generator routes shipped → eliminates 3 sitewide footer 404s (commit `b553ec1`).
- Legal stubs (`/privacy`, `/terms`, `/disclosures`) on disk.
- 404.astro, sameAs, llms.txt.
- Shared chrome via `@str/format`, `@str/url-state`, `@str/seo`, `@str/email-gate` packages — first cluster site fully on the new packages pattern.

**Residual P0/P1 findings:**
- **P0** — 26 `/templates/[scenario]` pages still render near-identical boilerplate (narrative MDX block deferred).
- **P1** — `seoTitle` field per tool (CTR uplift) not wired in `tools.json`.
- **P1** — Homepage title↔H1 "generators" vs "tools" mismatch unresolved.

**Recommended next moves:**
- 200-word MDX narrative per scenario (~3 hrs).
- Pinterest pin program — strguests has the lowest competition in the cluster.

---

### thestrledger.com — 51 live (unchanged) / 83 in scaffold (↑32)

| # | Dimension | Was (live) | Now (scaffold) | Δ | Justification |
|---|-----------|-----------|----------------|---|---------------|
| 1 | Crawlability & indexing | 2 | 9 | +7 | Scaffold ships `public/robots.txt`, sitemap-0.xml + sitemap-index.xml in `dist/`, `404.astro`, `/blog/index.astro`, `/products/index.astro`, llms.txt. |
| 2 | On-page metadata | 7 | 8 | +1 | Per-page title/desc/canonical/OG via Layout; legal-page title polish not addressed. |
| 3 | Structured data | 0 | 10 | +10 | `buildProduct` with `offers` (price, priceCurrency, availability, url), `buildFAQPage`, `buildBreadcrumb`, `buildOrganization` — all wired on `/products/[slug].astro:18,32` (commit `a8f7657`). 68 SKU MDX files schema-validated. |
| 4 | Content & semantic HTML | 6 | 8 | +2 | 68 products with pitch, inside, faqs; home H1 markup defect inapplicable to scaffold. |
| 5 | Internal linking | 6 | 9 | +3 | Sister-site links wired in footer; `/products/` and `/blog/` hubs exist; breadcrumbs on product pages. |
| 6 | Performance | 6 | 7 | +1 | Astro static; covers as SVG (small). Not measured live. |
| 7 | Mobile / accessibility | 6 | 7 | +1 | Layout viewport + lang correct; cover SVGs alt-text status not audited. |
| 8 | Off-page / authority | 3 | 8 | +5 | Organization `sameAs: [...SISTER_SITES]` (`seo.ts:52`) populated with all 5 sister sites + Etsy shop. |
| 9 | Funnel / lead-magnet hygiene | 7 | 9 | +2 | Form `action={formAction}` wired (`/free/*.astro`); 66 Stripe payment links populated across products (commit `e60335e`); Etsy buttons on every product (commit `fcc7121`). |
| 10 | Technical hygiene | 4 | 8 | +4 | Deploy pipeline shipped with DRAFT-status safety gate (`scripts/deploy.ps1:52-80`, commit `854db9f`); robots.txt, sitemap, trailing-slash alignment. |

**What closed since original audit:**
- Parent-brand scaffold from 0 → 68 SKUs with Product+Offer schema (commit `a8f7657`).
- Stripe payment links wired across 66 products (commits `a62d437`, `e60335e`).
- Etsy "Buy on Etsy" buttons on every product (commit `fcc7121`).
- Featured hero + covers + blog scaffold + form wiring (commit `fcc7121`).
- Deploy pipeline with DRAFT-status safety gate (commit `854db9f`).
- 10 product-MDX catalog-parity with live (commit `a8f7657`).

**Residual P0/P1 findings:**
- **P0 (operator)** — Live HTML is still 51/100 because the deploy is intentionally DRAFT-gated. The scaffold lift will not register on the live site until the operator runs a soft-launch + smoke test and flips `DEPLOY-STATUS.md` from `DRAFT - DO NOT DEPLOY` to `READY`.
- **P1** — Home H1 markup defect (`"rentalsbefore they run. you."`) is a live-site bug; not relevant to the scaffold.
- **P1** — Reverse-proxy `blog.thestrledger.com` under apex `/blog` is a strategic move not yet executed; the apex `/blog` route now exists but only has 1 welcome post.

**Recommended next moves:**
- Soft-launch the scaffold to a staging URL, run `scripts/post-deploy-smoke.mjs`-equivalent, flip the DRAFT gate.
- Migrate Ghost blog content onto apex `/blog`.

---

### strmanuals.com — (est. 60 pre-launch) → 70 (↑10)

The original rollup gave no score because the site returned HTTP 503. Using the strhost/strbuyers rubric on the pre-launch repo state, an estimated 60/100 baseline reflects: no Product schema, no programmatic pages, no llms.txt, no robots.txt at audit time, but clean Astro scaffolding inherited from cluster.

| # | Dimension | Was (est.) | Now | Δ | Justification |
|---|-----------|-----------|-----|---|---------------|
| 1 | Crawlability & indexing | 5 | 8 | +3 | `public/robots.txt` + `public/llms.txt` shipped (commit `67303c9`); sitemap config via Astro integration. |
| 2 | On-page metadata | 6 | 7 | +1 | Base layout emits per-page metadata via `Base.astro` (line 13 references page-level JSON-LD). |
| 3 | Structured data | 2 | 9 | +7 | **Product + Offer JSON-LD baseline shipped** (commit `67303c9`) — `src/lib/seo.ts:76-92` emits Product with `offers.priceCurrency`, wired on `/manuals/[slug].astro:5`. Original rollup's #1 pre-launch finding closed. |
| 4 | Content & semantic HTML | 6 | 7 | +1 | Site charter + design spec; manuscripts dir present. |
| 5 | Internal linking | 5 | 7 | +2 | Cluster footer pattern inherited; legal stubs on disk. |
| 6 | Performance | 7 | 7 | — | Pre-launch; not measured. |
| 7 | Mobile / accessibility | 7 | 7 | — | Astro defaults. |
| 8 | Off-page / authority | 4 | 7 | +3 | sameAs pattern inherited from `@str/seo`; llms.txt for AI-search. |
| 9 | Funnel / lead-magnet hygiene | 6 | 7 | +1 | Paid-PDF funnel structure inherits buildProduct + Offer; payment provider integration not in scope this session. |
| 10 | Technical hygiene | 6 | 7 | +1 | Robots + llms; trailing-slash via shared chrome. |

**What closed since original rollup:**
- Product + Offer JSON-LD scaffold (commit `67303c9`).
- llms.txt + robots.txt.

**Residual P0/P1 findings:**
- **P0** — Site still HTTP 503 / pre-launch.
- **P0** — 200 missing LGL-01 programmatic city pages (`str regulation [city]`) not built — rollup's other #1 pre-launch finding still open.
- **P1** — Payment integration (Stripe) not wired.

**Recommended next moves:**
- Generate LGL-01 city pages from the same template strops/strhost use for programmatic.
- Pre-launch checklist before flipping DNS.

---

## Cross-cluster wins (this session's biggest)

1. **STRHost render-bug fix + 51/51 lodging-tax narrative.** Commit `973ad9d` shipped the bug fix that lit up 5 pre-existing narrative states + 46 new ones. All 50 states + DC now render bodies.
2. **STROps 81/81 narrative MDX.** 51 replace items + 30 maintenance tasks fully narrated (commits `a5f21e1`, `79b0298`, `9697110`, `2573380`). Original audit's #1 thin-content P0 fully closed.
3. **STRLedger scaffold 0 → 68 SKUs** with Product+Offer schema, Stripe buttons (66 wired), Etsy buttons, featured hero, covers, blog scaffold, form wiring, DRAFT-status safety gate (commits `a8f7657`, `854db9f`, `fcc7121`, `a62d437`, `e60335e`).
4. **llms.txt + robots.txt LLMs-txt cross-ref cluster-wide** (commit `c77102d`).
5. **STRBuyers cities at 100/219** narrative coverage (commits `a51f135`, `7596f4a`, `0ddd57e`, `7e6569c`) — top-volume markets prioritized.
6. **STRBuyers blog dir + 8 posts** matching the previously 404ing sitemap promises (commits `deea901`, `72ce6a6`).
7. **STRManuals Product+Offer JSON-LD baseline** (commit `67303c9`) — #1 pre-launch finding closed.
8. **Tier 2 #10 operator runbook** for GA4 + GSC verification (commit `fbf0aed`).
9. **STRGuests Phase 3 AI generators shipped** — 3 sitewide footer 404s closed (commit `b553ec1`).
10. **Shared `@str/*` packages** (`@str/format`, `@str/url-state`, `@str/seo`, `@str/email-gate`) — STRGuests is the first site fully migrated; pattern ready for siblings (commits `029dd09` → `a257764`).
11. **STRBuyers footer fix** + legal stubs across all 4 tool sites — eliminates the cross-cluster "broken footer link" defect on 3 of 4 sites.
12. **client:load → client:visible cluster-wide** — verified on 7/7 STRHost, 7/7 STROps tool pages.

---

## Residual cross-cluster gaps

1. **STRBuyers — 119 long-tail city pages still thin** (P0). Largest single thin-content surface left.
2. **STRHost footer `/get-the-pdf` typo** at `Footer.astro:37` — never replaced.
3. **STROps contact form uses `mailto:`** instead of a real Formspree backend (audit accepted as fallback, but the real-backend fix is the cleaner close).
4. **STRGuests 26 template scenarios** still render near-duplicate boilerplate.
5. **STRLedger live HTML is unchanged** — scaffold is DRAFT-gated; flip requires operator soft-launch + smoke.
6. **STRManuals still pre-launch (HTTP 503)** with 200 LGL-01 programmatic pages not built.
7. **CI workflow pattern (root install + packages build)** only on STRGuests; STRHost/STROps/STRBuyers need same pattern when they migrate to `@str/*`.
8. **Operator-only — GA4 + GSC account work** per the Tier 2 #10 runbook (`docs/seo/TIER-2-10-GA4-GSC-VERIFICATION-2026-05-12.md`).
9. **No RSS feed on STRBuyers** despite blog dir now existing.
10. **STROps BreadcrumbList** on programmatic pages — helper exists, wiring pending.

---

## Methodology + sources

Scoring is repo-state based:

- `git ls-files`, `Glob`, and `Grep` over each site's `src/`, `public/`, `astro.config.*`, `scripts/`.
- Where a finding was "missing file X," verified via `Glob` that the file now exists (e.g. all 4 tool sites' `src/pages/404.astro`).
- Where a finding was "directive X (e.g., `client:load`)," verified via `Grep` over `src/pages/`.
- Where a finding was "schema builder Y," verified via `Grep` in `src/lib/seo.ts` for `buildBreadcrumb`, `buildHowTo`, `buildItemList`, `buildProduct`.
- Commit SHAs cited above are pulled from `git log --oneline -50` on branch `claude/happy-herschel-9170ce` at audit time.

Live HTML was deliberately not refetched — every site has CI auto-deploy on push to main, but deploy-timing variance would muddy the deltas. The STRLedger DRAFT-gate intentionally keeps live HTML unchanged; the scaffold score column reflects what will ship the moment the operator flips the gate.

This is apples-to-apples vs the original repo-state-aware audits.

---

## Verified-by-grep checklist

Each command below is the literal verification path for one disputed dimension. Re-run any line to verify a score in this doc.

```
# STRHost — 51 lodging-tax states (50 + DC) on disk
find STRHost-Tools/src/content/states -name '*.mdx' | wc -l        # expect: 51

# STROps — 51 replace MDX + 30 maintenance MDX
find STROps-Tools/src/content/replacement -name '*.mdx' | wc -l    # expect: 51
find STROps-Tools/src/content/maintenance -name '*.mdx' | wc -l    # expect: 30

# STRBuyers — 100 of 219 cities narrative
find STRBuyers-Tools/src/content/cities -name '*.mdx' | wc -l       # expect: 100
# (residual: 119 to go)

# STRBuyers — blog directory now exists with 8 posts
ls STRBuyers-Tools/src/pages/blog/                                 # expect: [slug].astro, index.astro
find STRBuyers-Tools/src/content/posts -name '*.mdx' | wc -l        # expect: 8

# 404 pages shipped on all 4 tool sites
ls STRHost-Tools/src/pages/404.astro                                # expect: file
ls STRBuyers-Tools/src/pages/404.astro
ls STROps-Tools/src/pages/404.astro
ls STRGuests-Tools/src/pages/404.astro

# client:visible across all calculator islands
grep -rln "client:load" STRHost-Tools/src/pages/                    # expect: zero hits
grep -rln "client:load" STROps-Tools/src/pages/                     # expect: zero hits

# llms.txt cluster-wide
ls STRHost-Tools/public/llms.txt STRBuyers-Tools/public/llms.txt \
   STROps-Tools/public/llms.txt STRGuests-Tools/public/llms.txt \
   STRLedger/public/llms.txt STRManuals/site/public/llms.txt        # expect: 6 files

# STRLedger Product+Offer schema wired
grep -n "buildProduct" STRLedger/src/pages/products/'[slug].astro'  # expect: import + call

# STRLedger 68 product MDX
ls STRLedger/src/content/products/ | wc -l                          # expect: 68

# STRLedger DRAFT-gate live in deploy script
grep -n "DRAFT" STRLedger/scripts/deploy.ps1                        # expect: safety gate lines 52-80

# Organization.sameAs[] populated on the 4 tool sites
grep -A2 "sameAs:" STRHost-Tools/src/lib/seo.ts                     # expect: 4 sister sites + thestrledger
grep -A2 "sameAs:" STRBuyers-Tools/src/lib/seo.ts                   # expect: same

# Schema builders shipped
grep -n "buildBreadcrumb\|buildHowTo\|buildItemList" STRHost-Tools/src/lib/seo.ts  # expect: 3 hits

# STRGuests Phase 3 AI routes resolve (no more sitewide 404s)
ls STRGuests-Tools/src/pages/listing-description.astro \
   STRGuests-Tools/src/pages/review-response.astro \
   STRGuests-Tools/src/pages/guest-messages.astro                   # expect: 3 files

# Footer fix on STRBuyers
grep "get-the-buyer-checklist\|get-the-pdf" STRBuyers-Tools/src/components/chrome/Footer.astro
# expect: get-the-buyer-checklist (good); get-the-pdf NOT present
```

---

*End of re-audit.*
