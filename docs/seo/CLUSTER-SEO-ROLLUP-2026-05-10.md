# STR Cluster — Cross-Site SEO Rollup

**Date:** 2026-05-10
**Scope:** All 6 cluster sites — strhost.tools, strguests.tools, strops.tools, strbuyers.tools, strmanuals.com, thestrledger.com.
**Source docs:** the 9 per-site keyword + audit docs written this session, plus `STRHost-Tools/docs/SEO-AUDIT-2026-05-08.md` (the original reference style).

---

## Executive summary

Across the cluster, three patterns dominate:

1. **The chrome inherited from strhost.tools is the cluster's biggest SEO liability.** Five separate audits independently flagged the same defects: missing 404 page, broken footer links to `/privacy`/`/terms`/lead-magnet typos, eager `client:load` hydration, trailing-slash inconsistency between sitemap and canonical, empty `Organization.sameAs[]`, no `BreadcrumbList`/`HowTo`/`ItemList` builders. Fix once in shared chrome — propagate to four sites in a single PR.
2. **Programmatic page corpora are launching with thin content across all four built tool sites.** strhost (46/51 lodging-tax pages), strbuyers (~200/219 city pages), strops (71/81 replace+maintenance pages), strguests (26 template pages). Same pattern, same risk: every cluster site is one HCU update away from losing the bulk of its programmatic surface.
3. **The hub-and-spoke cross-link advantage is dormant.** thestrledger.com (the parent brand) currently links to **none** of its five sister sites. No competitor (Lodgify, Stessa, Hospitable, Templacity) operates a 6-site brand cluster — yet the cluster surrenders that signal by not wiring it up.

**Cluster-wide headline score (weighted by built-out-ness):** ~70/100.

---

## Site-level summary

| Site | Status | Audit score | Biggest single P0 finding |
|---|---|---|---|
| strhost.tools | Live, 7 calc + 51 state pages | 74/100 (2026-05-08) | Blog + feed missing from sitemap; 6 posts invisible to Google |
| strguests.tools | Live, 4 PDF gens + 26 templates | (see audit) | 7 sitewide footer links 404 — 3 unbuilt AI routes + 4 legal/lead-magnet stubs |
| strops.tools | Live, 7 tools + 81 programmatic | 76/100 | `/contact` form has no action URL (submissions vanish); no `/404.astro` |
| strbuyers.tools | Live, 7 calc + 219 city pages | 68/100 | Sitemap declares 9 `/blog/*` URLs that 404; `src/pages/blog/` does not exist |
| strmanuals.com | **HTTP 503 / pre-launch** | n/a | No `Product`+`Offer` JSON-LD anywhere — non-negotiable for paid PDFs; 200 missing programmatic LGL-01 city pages |
| thestrledger.com | Live, parent brand | 51/100 | Zero JSON-LD, no robots.txt, no sitemap.xml, no Product schema — voice 9/10, technical SEO 2/10 |

---

## Cross-site bang-for-buck — top 10 moves ranked by ROI

### Tier 1 — Ship this week (≤1 day each)

| # | Move | Site(s) | Why bang-for-buck |
|---|---|---|---|
| 1 | **Wire shared chrome fix:** new `404.astro`, fix footer link integrity, switch `client:load` → `client:visible` on all calculator/list islands | strhost, strguests, strops, strbuyers | 4 sites × 4 chrome bugs each = 16 P0/P1 fixes in one PR. Fix once, propagate. |
| 2 | **Wire bidirectional sister-site links into thestrledger.com** | thestrledger | Hub-and-spoke entity signal that no competitor can replicate. Zero current implementation; 6-site brand cluster goes from invisible to obvious. |
| 3 | **Add JSON-LD baseline to thestrledger.com** — Organization, Product+Offer per workbook, BreadcrumbList, FAQPage on tax/regulation pages | thestrledger | Score lift from 51 → ~70 in a single sprint. Parent brand currently emits zero structured data. |
| 4 | **Decide trailing-slash convention cluster-wide and align canonical + sitemap** | all 4 tool sites | Removes a cluster-wide duplicate-content signal. Mechanical edit in `seo.ts` once, copy to siblings. |
| 5 | **Populate `Organization.sameAs[]` on all sites** with the other 5 cluster URLs | all 5 (live) | Entity-graph reinforcement for free. AI-search citation booster (sister-site sameAs strengthens brand entity for ChatGPT/Perplexity). |

### Tier 2 — Ship this month (≥1 day each)

| # | Move | Site(s) | Why bang-for-buck |
|---|---|---|---|
| 6 | **Add `buildBreadcrumb`, `buildHowTo`, `buildItemList` to shared `seo.ts`** and wire across 4 tool sites | all 4 tool sites | Schema lift on 100s of programmatic pages. Same code in 4 places. |
| 7 | **Tier-1 narrative MDX for top 50 programmatic pages per site** (lodging-tax states / cities / replace items / templates) | all 4 tool sites | Defends against the next HCU. Without this, the programmatic surface is at structural risk. ~200 short MDX files total. |
| 8 | **Build the missing blog directories** the sitemaps already promise (strhost 6 posts, strbuyers 8 posts, strguests templates index, strops nothing) | strhost, strbuyers, strguests | Closes the sitemap-vs-source gap that crawlers will downrank for. Slugs already match keyword targets. |
| 9 | **Pre-launch SEO scaffolding for strmanuals.com** — Product+Offer schema, programmatic city pages for LGL-01, free-magnet landing | strmanuals | Avoid shipping the same defects again — set the precedent in the cluster's only paid-PDF site. |
| 10 | **GSC + GA4 cross-domain verification audit** — confirm `PUBLIC_GA4_ID` and GSC verification on all 5 live sites | all 5 (live) | Pre-requisite for measuring everything else. Cheap to verify, expensive to discover it's missing 3 months in. |

---

## Top cross-site keyword opportunities (highest BFB across cluster)

Synthesized from per-site KEYWORD-RESEARCH docs. "Volume / KD / monetization" use the bands defined in each per-site doc.

### A. Underserved high-intent SERPs (low KD, mid-high volume, direct affiliate path)

| Keyword cluster | Target site | Why it ranks "biggest bang" |
|---|---|---|
| `airbnb furnishing budget calculator` | strbuyers | Only top-3 SERP in the whole cluster without a venture-funded data SaaS competitor. Direct Stage by Hand / Minoan affiliate path. |
| `cost to replace [item] in airbnb` (51 items) | strops | Programmatic surface live but only 5 of 51 pages have narrative MDX. Near-zero competition, high commercial intent. |
| `airbnb cohost split calculator` | strhost | Almost zero competition (per existing strhost CLAUDE.md). Connects to Profitability calc → workbook upsell. |
| `dscr loan calculator str` | strbuyers | Highest-CPM finance keyword in the cluster. $200–500/lead DSCR-lender affiliate revenue. Calc page exists; needs the missing `/blog/dscr-loan-vs-conventional-for-airbnb` post. |
| `airbnb welcome book template` | strguests | Lowest-competition keyword cluster of any STR site (per strguests CLAUDE positioning). Pinterest parallel-channel boost stacks on top. |

### B. Branded SERP opportunity (untapped)

| Keyword | Target site | Move |
|---|---|---|
| `the str ledger` | thestrledger | No knowledge panel, no Wikipedia, no brand-entity reinforcement. Add Organization JSON-LD with full `sameAs[]` covering all 5 sister sites + GBP if applicable + Crunchbase / LinkedIn company pages. |
| `str ledger workbook` / `str ledger excel` | thestrledger | Branded product searches almost certainly happening (Etsy traffic) but capturing zero on Google because no Product schema, no /products/[slug] page structure with ItemList. |

### C. Programmatic at scale (defendable but only if Tier 1 narrative is funded)

| Cluster | Target site | Recommended scope | Risk if unfunded |
|---|---|---|---|
| `airbnb lodging tax [state]` (50) | strhost | Tier 50 → all 50 states get narrative MDX before crawl | HCU loss of 46/51 pages |
| `is airbnb profitable in [city]` (200+) | strbuyers | Tier 50 narrative + 100 short unique blocks + noindex 69 thinnest | HCU loss of ~200 of 219 |
| `cost to replace [item] in airbnb` (51) | strops | Tier 51 → all 51 items get narrative MDX | HCU loss of 46/51 pages |
| `airbnb [scenario] message template` (26) | strguests | Tier 26 → 200-word MDX per scenario before deep crawl | HCU loss of all 26 |
| `str regulation [city]` (200+) | strmanuals (LGL-01) | Build before launch — currently absent | LGL-01 ranks for ~5 keywords instead of 200+ |

---

## Cross-site repeating defects (fix once, propagate)

These showed up independently in 3+ site audits. They live in shared chrome. Fix at the source (likely strhost.tools chrome inheritance) and PR across the four tool sites.

1. **Missing `404.astro`** — strhost, strguests, strops, strbuyers
2. **Broken footer links to `/privacy`, `/terms`, `/disclosures`, lead-magnet typos** — strhost, strguests, strops, strbuyers
3. **`client:load` on calculator islands** — strhost, strguests, strops, strbuyers
4. **Trailing-slash mismatch** between sitemap and canonical — strhost, strops, strbuyers
5. **Empty `Organization.sameAs[]`** — all 5 live sites
6. **No `buildBreadcrumb` / `buildHowTo` / `buildItemList`** in `seo.ts` — all 4 tool sites
7. **OG image fallback gap** (Satori failure ships a broken image URL) — strhost, strbuyers, others likely
8. **Sitemap declares URLs that don't exist** — strhost (blog), strbuyers (blog), strguests (Phase 3 AI routes)

---

## Cluster monetization map (where the money actually compounds)

```
strbuyers.tools  ───►  DSCR + STR insurance + AirDNA-class affiliates ($200–500/lead)
                       │
strhost.tools    ───►  Workbook upsell to thestrledger.com + ad revenue
                       │
strops.tools     ───►  Email-list capture → cluster-wide nurture
                       │
strguests.tools  ───►  Touch Stay + Hostfully + Canva + printing affiliates +
                       Pinterest funnel
                       │
strmanuals.com   ───►  Direct $19–$39 PDF sales + bundle ($99)
                       │
thestrledger.com ───►  ALL pieces flow back here for workbook purchase + email
                       capture; this is the cluster's commercial center
```

**Strategic tension:** thestrledger.com is the commercial center but currently has the *worst* SEO foundation (51/100) and zero JSON-LD. Every other site sends signal upstream that the parent brand can't capture. **Fix this first.**

---

## Recommended next-90-day cadence

### Week 1
- **Day 1–2:** Fix shared chrome defects across the 4 tool sites (Tier 1 #1, #4, #5).
- **Day 3:** Wire bidirectional sister-site links into thestrledger.com (Tier 1 #2).
- **Day 4–5:** Add baseline JSON-LD to thestrledger.com (Tier 1 #3).

### Weeks 2–4
- Add the 3 missing schema builders to `seo.ts` and propagate (Tier 2 #6).
- Build the missing blog directories on strhost + strbuyers (Tier 2 #8). Slugs already match keyword targets per per-site keyword docs.
- Verify GA4 + GSC on all 5 live sites (Tier 2 #10).

### Weeks 5–12
- Tier-1 narrative MDX for top 50 programmatic pages on each tool site (Tier 2 #7). Hire writer or dictate via outline.
- Pre-launch strmanuals.com with the cluster's lessons baked in (Tier 2 #9).
- Begin GSC weekly review per site — track CTR, impressions, indexed-vs-submitted ratios.

### 90-day checkpoint
- Re-audit each site against this rollup. Expected score lifts:
  - strhost: 74 → 85
  - strguests: (current) → 82
  - strops: 76 → 86
  - strbuyers: 68 → 84
  - thestrledger: 51 → 78
  - strmanuals: pre-launch → live with 75+ baseline

---

## Doc map

Per-site source docs feeding this rollup:

- `STRHost-Tools/docs/SEO-AUDIT-2026-05-08.md` (reference style)
- `STRGuests-Tools/docs/KEYWORD-RESEARCH-2026-05-10.md`
- `STRGuests-Tools/docs/SEO-AUDIT-2026-05-10.md`
- `STROps-Tools/docs/KEYWORD-RESEARCH-2026-05-10.md`
- `STROps-Tools/docs/SEO-AUDIT-2026-05-10.md`
- `STRBuyers-Tools/docs/KEYWORD-RESEARCH-2026-05-10.md`
- `STRBuyers-Tools/docs/SEO-AUDIT-2026-05-10.md`
- `STRManuals/docs/KEYWORD-RESEARCH-2026-05-10.md` (pre-launch; no audit)
- `docs/seo/KEYWORD-RESEARCH-thestrledger-2026-05-10.md`
- `docs/seo/SEO-AUDIT-thestrledger-2026-05-10.md`

---

*End of cluster rollup.*
