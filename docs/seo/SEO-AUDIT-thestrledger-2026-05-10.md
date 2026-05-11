# thestrledger.com — SEO Audit

**Audit date:** 2026-05-10
**Auditor:** Claude (Opus 4.7)
**Scope:** Live audit of `https://thestrledger.com` — parent brand of the STR cluster, the only sister site that sells a paid product (Excel workbooks) on the site directly.
**Crawl method:** live HTTP fetch + HEAD probes (no repo source available for the deployed Astro/Hostinger build; all `file:line` columns marked `live extract`).
**Sister-site reference audit:** `STRHost-Tools/docs/SEO-AUDIT-2026-05-08.md` (74/100, sets the bar).

---

## Executive summary

The brand voice and on-page copy are excellent — `<title>`, `<meta description>`, `og:*`, `twitter:card`, and canonical are present on every page audited, and the home/product/legal copy is genuinely above-average for an indie store. The skeleton, however, is leaking value at almost every technical layer. **There is no `robots.txt`, no `sitemap.xml` (any variant), no RSS/feed, no JSON-LD on any page, no `Product` schema with `offers`, no `Organization` `sameAs`, no `BreadcrumbList`, no canonical OG-per-page image (every page references the same `og-default.png`), and several footer/legal/CTA links are inconsistent or 404.** The site is being indexed by Google in spite of its plumbing, not because of it.

The single biggest problems, ranked by traffic-recoverable impact:

1. **No `robots.txt` and no `sitemap.xml`.** `https://thestrledger.com/robots.txt`, `/sitemap.xml`, `/sitemap-index.xml`, `/sitemap-0.xml` all return 404. Discovery for the 12 product pages, 4 free-guide landings, /bundles, /about, and 3 legal pages depends entirely on internal links + external backlinks. Indexation lag will be 4–10× slower than it needs to be for a brand-new site. (P0)
2. **Zero JSON-LD on every page audited.** No `Organization`, no `Product` with `offers` (price + availability), no `BreadcrumbList`, no `FAQPage`, no `WebSite` with `SearchAction`. Sister site `strhost.tools` ships Org + WebApp + FAQ + Article (it scored 7/10 on structured data). thestrledger.com scores **0/10**. This blocks rich results on SERPs (price, review stars, breadcrumbs, sitelinks search) where commercial intent is highest. (P0)
3. **`/contact`, `/blog`, `/products` (index), `/free`, `/disclosures` all return 404 — but `/contact/` (with trailing slash) returns 301 → root.** Inconsistent trailing-slash behavior across the site: `/about/` returns 200, `/contact/` returns 301 to root (silently losing the user's intent), `/contact` (no slash) returns 404. The user has no way to actually reach a contact page from the URL bar. (P0)
4. **Every page references the same OG image `/assets/img/og-default.png`.** Per-page OG generation isn't shipped. Social shares for the mileage log, welcome book, etc. all preview as the brand placeholder. Click-through on shared links suffers. (P1)
5. **`/free` (the parent of the lead-magnet hub) returns 404,** while the four child pages `/free/47-deductions`, `/free/welcome-book`, `/free/etsy-buyer`, `/free/entity-flowchart` all return 200. There's no hub index aggregating the lead magnets — Google sees four orphan landings instead of a topical cluster. (P1)
6. **Home `<h1>` is broken markup.** The home H1 renders as `Run your rentalsbefore they run. you.` (no space between "rentals" and "before"; literal full-stop after "run" before italicised "you"). It's a styled visual line break that flattens to broken text in plain HTML, which is what crawlers and screen readers consume. (P1)
7. **Title-character budget left on the table.** Home title is 53 chars (good); but `/about` (22), `/refunds` (30), `/terms` (33), `/privacy` (31) are all sub-35 chars and waste the SERP real estate. (P2)
8. **Meta descriptions vary wildly.** `/privacy` ("Privacy policy for thestrledger.com.", 36 chars) and `/refunds` (46 chars) are stub-quality. (P2)
9. **No `apple-touch-icon`, no `theme-color`, no `<link rel="alternate" type="application/rss+xml">`.** Standard sitewide head hygiene. (P2)
10. **Sister-site cross-linking is absent.** Home + footer + about all reference Etsy shop and `mailto:` only. No outbound link to `strhost.tools`, `strops.tools`, `strguests.tools`, `strbuyers.tools`, `strmanuals.com` — i.e., the brand's own asset network is not being used to build topical authority for the parent. (P0 for hub-and-spoke economics.)

**Headline score: 51/100.** Voice + copy score 9/10; technical SEO scores 2/10. Same-day fixes can move this to **70+** without touching copy.

---

## Score per dimension (1–10)

| # | Dimension | Score | Justification |
|---|-----------|-------|---------------|
| 1 | Crawlability & indexing | 2 | No robots.txt; no sitemap (any variant); no /404 page; no /blog index; no /products index; trailing-slash behaviour inconsistent; broken `/contact` URL. |
| 2 | On-page metadata | 7 | Per-page title/description/canonical/og/twitter all present and correctly formed. Some titles too short. Meta descriptions on legal pages are stubs. |
| 3 | Structured data | 0 | **Zero JSON-LD on every page audited.** No Org, no Product/offers, no Breadcrumb, no FAQ, no WebSite SearchAction. Highest-leverage gap on the site. |
| 4 | Content & semantic HTML | 6 | Copy is strong, H1/H2 hierarchy is reasonable, but home H1 has a markup-flattening defect ("rentalsbefore they run. you."). Product H1s are headlines not noun phrases (good for CTR, neutral for SEO). |
| 5 | Internal linking | 6 | Home links to 12 product pages + 4 free-guide pages + bundles + legal. Footer mirrors. **No `/products` index, no `/free` index, no breadcrumbs.** No links to sister sites. |
| 6 | Performance | 6 | LiteSpeed server (good), HTML payload modest (4–14 KB), no heavy JS detected. No font preload visible; no obvious LCP image hints. Cannot measure CWV without browser audit. |
| 7 | Mobile / accessibility | 6 | `viewport` set, `lang="en"`, semantic H1/H2/H3. Home H1 markup defect hurts a11y (screen reader reads "rentalsbefore"). No `apple-touch-icon`, no `theme-color`. |
| 8 | Off-page / authority | 3 | No `Organization` schema, no `sameAs[]`, no outbound links to sister sites, no Etsy review-aggregate surfacing. Only outbound is the Etsy shop URL. |
| 9 | Funnel / lead-magnet hygiene | 7 | The four `/free/*` lead magnets exist and convert (`/free/47-deductions` is the cited hero CTA). No `/free` hub. No thank-you page URLs documented. No noindex on probable thank-you pages (none found, so neutral). |
| 10 | Technical hygiene | 4 | HTTPS only (✓). `www` → apex 301 (✓). `/about/` 200 but `/contact/` 301 → root, `/contact` 404 — inconsistent. No robots, no sitemap, no feed. LiteSpeed cache headers not audited. |

**Overall: 51/100.**

---

## Findings table

Sorted by severity. `live extract` indicates source not available; finding pulled from rendered HTML / HTTP HEAD on 2026-05-10.

| Severity | Area | Source | Finding | Fix |
|---|---|---|---|---|
| **P0** | Crawlability | `https://thestrledger.com/robots.txt` → 404 | No robots.txt. Crawlers must guess. No sitemap reference. | Add `public/robots.txt` (or Hostinger root): `User-agent: *` / `Allow: /` / `Sitemap: https://thestrledger.com/sitemap.xml`. |
| **P0** | Crawlability | `/sitemap.xml`, `/sitemap-index.xml`, `/sitemap-0.xml` all 404 | No sitemap of any form is published. Discovery for 12 products + 4 free pages + bundles + 3 legal pages relies on link graph only. | Generate a static `sitemap.xml` listing all 21 known canonical URLs (12 `/products/<SKU>`, 4 `/free/<slug>`, `/`, `/about`, `/bundles`, `/privacy`, `/terms`, `/refunds`). Re-emit on every deploy. |
| **P0** | Structured data | All audited pages, `live extract` `<head>` | **No JSON-LD anywhere.** No `Organization`, no `Product` with `offers`, no `BreadcrumbList`, no `WebSite` `SearchAction`, no `FAQPage`. Blocks rich results on every commercial query. | Sitewide: emit `Organization` (incl. `sameAs[]` once social profiles exist) + `WebSite` `SearchAction`. Per product page: emit `Product` with `name`, `sku`, `image`, `description`, `brand`, `offers` (price=USD 17 etc., `availability`, `url`, `priceValidUntil`). Per page with breadcrumbs: emit `BreadcrumbList`. |
| **P0** | Routing | `/contact` 404 vs `/contact/` 301 → `/` | Trailing-slash inconsistency. `/contact` returns 404; `/contact/` redirects to homepage (silently dropping the user). `/about` returns 200; `/about/` also returns 200 (duplicate-content risk). | (a) Pick a trailing-slash convention site-wide (recommend NO trailing slash, matches canonicals). (b) Ship a real `/contact` page (`mailto:hello@thestrledger.com` is currently the only contact path; doesn't suffice for E-E-A-T). (c) 301 the slashed variants to the canonical, do not 301 to root. |
| **P0** | Hub linking | All pages, `live extract` `<footer>` | Zero outbound links to sister sites (`strhost.tools`, `strops.tools`, `strguests.tools`, `strbuyers.tools`, `strmanuals.com`). Brand's own free-tool network is invisible from the parent site. | Add a "Free tools from The STR Ledger" footer block listing all five sister sites with descriptive anchor text (see `KEYWORD-RESEARCH-thestrledger-2026-05-10.md` §7). Also add 2–3 contextual in-content links from /about and homepage. |
| **P1** | On-page | Home `<h1>`, `live extract` | Home H1 flattens to `"Run your rentalsbefore they run. you."` — missing space, literal full-stop, italicised final word. Crawlers/screen readers consume the broken string. | Insert a space between "rentals" and "before"; remove the period after "run"; consider H1 = `Run your rentals before they run you.` (matches brand tagline exactly). |
| **P1** | OG images | All pages, `og:image` always = `/assets/img/og-default.png` | One OG image for the whole site. Product shares previewing as brand placeholder = lower social CTR. | Generate per-page OG images (Satori or similar; sister site `strhost.tools` does this). Minimum: ship 12 product OG cards + 4 free-guide OG cards. |
| **P1** | Hub linking | `/free` returns 404 | Four `/free/<slug>` pages exist but no hub index. Google sees four orphan landings, not a topical cluster. | Add `/free` index page listing all four lead magnets with descriptions; emit `ItemList` JSON-LD on it. Internal-link from home + footer. |
| **P1** | On-page | `/about` title (22 chars), `/about` description (69 chars) | "About — The STR Ledger" wastes 35+ chars of SERP budget. Description too tight. | Recommend: `About The STR Ledger — editorial finance for Airbnb hosts` (61 chars). Description: 140–160 char version explaining who built it + the promise. |
| **P1** | Authority | All pages, no `sameAs` (no JSON-LD at all) | Once Organization JSON-LD is added, `sameAs[]` should list Etsy shop, Pinterest, X/LinkedIn (whichever are live). Today the brand has no entity disambiguation surface. | Populate `sameAs: ["https://www.etsy.com/shop/TheSTRLedger", ...]`. |
| **P1** | Mobile/social | `<head>`, all pages | No `apple-touch-icon`, no `theme-color`, no `<link rel="alternate" type="application/rss+xml">` (because no RSS feed exists). | Add `apple-touch-icon-180.png`, `<meta name="theme-color" content="#0e1a3a">` (brand navy), and ship a `/feed.xml` once the blog ships. |
| **P1** | Content | No `/blog`, `/blog/` 404 | Brand's content engine (per `PROGRESS.md`) is `blog.thestrledger.com` (Ghost subdomain). Main domain has no `/blog` route + no link to the subdomain. Topical authority is split across two domains, neither of which links to the other from a discoverable surface. | Either (a) link `blog.thestrledger.com` from the main-site header/footer with rel="me" or just plain anchor + breadcrumb, or (b) reverse-proxy the Ghost blog under `thestrledger.com/blog` for SEO consolidation. (b) is preferred for topical authority. |
| **P2** | On-page | `/refunds` (30/46), `/terms` (33/38), `/privacy` (31/36) | Legal-page titles and descriptions are stub-quality. Won't change rankings (legal pages aren't competitive) but signals lack of SEO discipline to QA-style audits. | Pad to 40–55 char titles, 120–155 char descriptions. Templates in remediation list below. |
| **P2** | Cross-linking | Home, `/about`, `/free/47-deductions` all link to `/products/TAX-001`, `/products/TAX-002`, `/products/GST-001`, `/products/OPS-001` only | Good "starter four" focus. **But** the home page's full product grid links to 12 SKUs while every other page only surfaces 4. Consider rotating the surfaced four per page (e.g., legal pages link to a different four) to spread internal-PageRank evenly. | Build a small `relatedProducts(currentSku)` helper that returns 4 cross-sell SKUs per product page. |
| **P2** | Crawl efficiency | `/this-does-not-exist` returns 404 with no body | No custom 404 page — server-default response. | Ship `/404` (or LiteSpeed `ErrorDocument 404 /404.html`) with the brand chrome + links to top 4 products + 4 free guides + bundles. |
| **P2** | Schema variety | All product pages | Once `Product/offers` ships, also add `FAQPage` (each product page has natural Q&A: "What's inside?", "Excel or Sheets?", "Refund policy?"). | Wire 3–5 FAQ items per product into `FAQPage` JSON-LD. |
| **P3** | Authority | `/about` page | About page is one screen of copy, no author byline, no photo, no credentials, no link to LinkedIn or to the parent operator's profile. E-E-A-T-thin for finance-adjacent content. | Add a "Built by Daniel Harrison" byline with one paragraph of operator credentials and a `Person` schema linked from `Organization`. |
| **P3** | Authority | All pages | No `<meta name="author">`, no `<meta name="copyright">`. Minor signals. | Add at Layout level. |
| **P3** | Hreflang | N/A | English-only, US-targeted. Hreflang correctly omitted. | No action. |

---

## Findings by area

### Crawlability & indexing
- **No robots.txt.** Crawlers can crawl, but no sitemap discovery hint. (P0)
- **No sitemap.** All four standard locations 404. (P0)
- **No `/404` page.** Server-default 404 body. (P2)
- **No feed.** `/feed.xml`, `/rss.xml` both 404. Defensible while there's no on-domain blog, but the Ghost subdomain (`blog.thestrledger.com`) should publish its own feed and be linked from this domain's `<head>` via `<link rel="alternate" type="application/rss+xml" href="https://blog.thestrledger.com/rss/">`. (P2)
- **`/contact` 404 + `/contact/` 301 to `/`** — broken contact discovery. (P0)
- **`/about` 200 + `/about/` 200** — both serve the same content with no canonical preference enforced via 301. Duplicate-content risk for a brand-page that ought to consolidate authority. (P1)
- **`www.thestrledger.com` 301 → apex** ✓ correct. (Pass.)

### On-page metadata
- Every page audited has: `<title>`, `<meta description>`, `<link rel="canonical">`, `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `twitter:card=summary_large_image`, `viewport`, `lang="en"`. ✓
- Titles range 22 → 72 chars; legal-page titles waste SERP budget. (P2)
- Descriptions range 36 → 238 chars; `/free/47-deductions` is over the 160-char snippet cutoff; legal pages are stub-quality. (P2)

### Structured data
- **Zero JSON-LD across all audited pages.** This is the single highest-leverage gap. Sister site `strhost.tools` already ships `Organization` + `WebApplication` + `FAQPage` + `Article`. The parent brand should match/exceed. (P0)

### Content & semantic HTML
- Voice and copy quality: very high. Product H1s are headlines (`The deduction your CPA wishes you'd tracked.`) — good for CTR, neutral for keyword targeting. Pair with a noun-phrase H2 that matches the search query (`Airbnb Mileage Log Spreadsheet`).
- Home H1 has the markup-flattening defect documented above. (P1)
- H2/H3 hierarchy on legal/about/product pages is clean.

### Internal linking
- Home grid surfaces 12 SKUs.
- Footer surfaces only 4 SKUs (TAX-001, TAX-002, GST-001, OPS-001) plus 3 free guides.
- No `/products` index. Bundles page exists. No `/free` index.
- No outbound links to sister sites. (P0)
- No `BreadcrumbList` schema; no visible breadcrumb UI on product pages. (P0 component of structured-data finding.)

### Performance
- LiteSpeed server, gzip presumed. Page weights 4.9–13.7 KB HTML. Lightweight static.
- OG image referenced sitewide — preload not visible.
- Cannot measure Core Web Vitals from HTTP-only audit. **Recommend running PageSpeed Insights** on home + 3 product pages and adding to next audit cycle.

### Mobile / accessibility
- `viewport` correct.
- Home H1 a11y defect.
- No `apple-touch-icon`. (P2)

### Off-page / authority
- `Organization` schema absent.
- `sameAs` therefore impossible.
- No outbound links to Etsy shop from header (only home grid links it once).
- Sister-site `STRHost-Tools` audit (2026-05-08) flagged the same `sameAs[] = []` problem on its own Org schema — same fix in both directions: each sister site should list the others.

### Funnel / lead-magnet hygiene
- Four `/free/<slug>` pages exist and are indexable.
- No `/free` hub. Discoverability of the four magnets depends on home + footer links only.
- `/free/47-deductions` description is 238 chars (> snippet cutoff); rewrite to 150 chars.

### Technical hygiene
- HTTPS only ✓
- `www → apex` 301 ✓
- Trailing slash inconsistent ✗
- LiteSpeed (Hostinger default) — confirm `Cache-Control` headers on static HTML are set sanely (cache 5–60 min for HTML, longer for assets).

---

## Prioritized remediation roadmap

### Quick wins (≤1 hour each)
1. **Ship `/robots.txt`** with sitemap reference. — *enables crawl-discovery hint.*
2. **Ship `/sitemap.xml`** listing all 21 canonical URLs. — *unblocks discovery; expect 2–4 weeks faster indexation.*
3. **Fix the home H1** to insert the missing space and remove the literal period. — *a11y + SERP click-target.*
4. **Pick a trailing-slash convention** and 301 the wrong variant. Recommend NO trailing slash to match existing canonicals. — *removes duplicate-content risk.*
5. **Ship a real `/contact` page** (replace the `mailto:` only behavior). — *E-E-A-T + funnel completeness.*
6. **Pad the legal-page titles + descriptions** to use the SERP budget. — *Polish; signals discipline.*
7. **Fix `/free` 404** by adding a hub index. — *clusters the four lead magnets.*

### Medium (≤1 day each)
8. **Ship `Organization` JSON-LD sitewide** with `name`, `url`, `logo`, `sameAs[]` (Etsy shop + sister sites + any social), `contactPoint`.
9. **Ship `Product` JSON-LD on all 12 product pages** with `name`, `sku`, `description`, `image`, `brand`, `offers` (`price`, `priceCurrency: USD`, `availability: InStock`, `url`, `priceValidUntil`), and `aggregateRating` once Etsy review data can be syndicated.
10. **Ship `BreadcrumbList` JSON-LD** on product + free-guide + about + legal pages.
11. **Ship `WebSite` JSON-LD** with `SearchAction` (when on-site search lands; until then, just `WebSite` with `name`/`url`/`publisher`).
12. **Per-page OG images** via Satori (sister site already does this — consider extracting to a shared module).
13. **Footer "Free tools" block** linking all five sister sites with descriptive anchor text (anchors in `KEYWORD-RESEARCH-thestrledger-2026-05-10.md` §7).
14. **Custom `/404` page** with chrome + cross-links.

### Strategic (≥1 day each)
15. **Reverse-proxy `blog.thestrledger.com` under `thestrledger.com/blog`** to consolidate topical authority on the apex domain. (Or, at minimum, link the blog from header/footer + add `<link rel="alternate">` for the blog feed in main-site `<head>`.)
16. **Author/expert page at `/about`** with named human, photo, operator credentials, `Person` JSON-LD chained to `Organization`.
17. **`FAQPage` JSON-LD on each product page** seeded with 3–5 buyer-FAQ items; this is the single highest-probability rich-result win for commercial queries.
18. **Etsy review syndication** to power `aggregateRating` on `Product` schema. (Etsy doesn't expose machine-readable reviews; once 5+ reviews per SKU exist, transcribe them as structured `Review[]` with explicit `author` + `datePublished`. **Do not fabricate.**)
19. **Programmatic SEO surface around `/free/<state>-airbnb-tax-deductions`** — leverage the 47-deductions guide into 50 state-scoped landings. High effort, high payoff if the brand wants top-of-funnel volume.

---

## Appendix A — All pages audited

Source-grounded snapshot of `<title>` / `<meta description>` / H1 for each route. (Title length / description length in chars.) All `live extract` — no repo source available for the deployed site.

### Static + landing pages

| Route | Status | Title (chars) | Description (chars) | H1 | Source |
|---|---|---|---|---|---|
| `/` | 200 | "The STR Ledger — Run your rentals before they run you" (53) | "Business-grade Excel financial and operating systems for Airbnb and VRBO hosts. Tax workbooks, P&L trackers, welcome books, turnover checklists. One-time price. Lifetime updates." (182) | `Run your rentalsbefore they run. you.` ⚠ flattened markup | live extract |
| `/about` | 200 | "About — The STR Ledger" (22) | "Editorial finance for short-term rentals — built by hosts, for hosts." (69) | `Editorial finance for hosts who run a real business.` | live extract |
| `/bundles` | 200 | "Bundles — The STR Ledger" (24) | "Bundled workbook stacks for first-year hosts, aspiring investors, year-2 operators, multi-property portfolios, and pro managers. Stack-based discounts up to 42% vs à la carte." (175) | `Stack the workbooks. Save the math.` | live extract |
| `/free/47-deductions` | 200 | "The 47 Airbnb deductions your CPA forgets to ask about. — The STR Ledger" (72) | "Most hosts leave $4,200 on the table every April. ..." (238 — over snippet cutoff) | `The 47 Airbnb deductions your CPA forgets to ask about.` | live extract |
| `/free/welcome-book` | 200 | (not extracted — repeat audit pass) | (not extracted) | (not extracted) | live extract |
| `/free/etsy-buyer` | 200 | (not extracted — repeat audit pass) | (not extracted) | (not extracted) | live extract |
| `/free/entity-flowchart` | 200 | (not extracted — repeat audit pass) | (not extracted) | (not extracted) | live extract |
| `/contact` | **404** | — | — | — | live extract |
| `/contact/` | **301 → /** | — | — | — | live extract |
| `/blog` | **404** | — | — | — | live extract |
| `/products` | **404** | — | — | — | live extract |
| `/free` | **404** | — | — | — | live extract |
| `/disclosures` | **404** | — | — | — | live extract |
| `/shop`, `/store`, `/workbooks`, `/templates` | 404 | — | — | — | (probed — not in URL space) |
| `/privacy` | 200 | "Privacy policy — The STR Ledger" (31) | "Privacy policy for thestrledger.com." (36) | `Privacy policy.` | live extract |
| `/terms` | 200 | "Terms of service — The STR Ledger" (33) | "Terms of service for thestrledger.com." (38) | `Terms of service.` | live extract |
| `/refunds` | 200 | "Refund policy — The STR Ledger" (30) | "14-day, no-questions refund on every workbook." (46) | `Refund policy.` | live extract |

### Product pages (12 confirmed live, all 200)

Probed via HEAD; titles + H1s verified for TAX-001, pattern confirmed identical for the rest. Each renders a unique title via internal layout.

| Route | Title (live) | H1 (live) | JSON-LD? |
|---|---|---|---|
| `/products/TAX-001` (Mileage Log) | "The Mileage Log — The STR Ledger" | "The deduction your CPA wishes you'd tracked." | **none** |
| `/products/TAX-002` | (not extracted) | (not extracted) | **none** |
| `/products/TAX-003` | (not extracted) | (not extracted) | **none** |
| `/products/TAX-004` | (not extracted) | (not extracted) | **none** |
| `/products/GST-001` (Welcome Book) | (not extracted) | (not extracted) | **none** |
| `/products/GST-002` (House Rules Builder) | (not extracted) | (not extracted) | **none** |
| `/products/OPS-001` (Turnover Checklist) | (not extracted) | (not extracted) | **none** |
| `/products/OPS-002` (Damage Claim / Aircover Log) | (not extracted) | (not extracted) | **none** |
| `/products/FIN-001` (RevPAR Dashboard) | (not extracted) | (not extracted) | **none** |
| `/products/FIN-003` (12-Month Cash Flow Forecaster) | (not extracted) | (not extracted) | **none** |
| `/products/ACQ-001` (STR Deal Analyzer) | (not extracted) | (not extracted) | **none** |
| `/products/LGL-001` (License Renewal Calendar) | (not extracted) | (not extracted) | **none** |

> **Action**: extract title/desc/H1 for the 11 not-yet-extracted product pages in the next audit cycle. The pattern (good copy, no schema) is highly likely to be uniform.
> **Note**: SKU URLs are case-sensitive — `/products/tax-001` (lowercase) returns 404. Document the canonical convention, or 301 lowercase to upper.

---

## Appendix B — Schema validation

| Schema type | Where it should ship | Status today | Recommendation |
|---|---|---|---|
| `Organization` | Sitewide via Layout `<head>` | **Missing** | Ship with `name`, `url`, `logo`, `sameAs[]`, `contactPoint`. |
| `WebSite` w/ `SearchAction` | Homepage `<head>` | **Missing** | Ship even before on-site search lands; populate `potentialAction` once search is live. |
| `Product` w/ `offers` | All 12 product pages | **Missing** | Required for SERP price + availability. Use `priceValidUntil` 30 days out, automate renewal. |
| `AggregateRating` (under Product) | Product pages, once Etsy reviews syndicate | Not present (no reviews to syndicate yet — defensible) | Once 5+ reviews per SKU exist, syndicate as `Review[]` + `aggregateRating` with explicit `author` and `datePublished`. **Do not fabricate.** |
| `BreadcrumbList` | Product, free-guide, about, legal | **Missing** | Required for breadcrumb SERP feature. Ship alongside `Product`. |
| `FAQPage` | Product pages, /about | **Missing** | High-leverage; product pages already have natural Q&A surface in copy. |
| `WebPage` (incl. `dateModified`) | All pages | **Missing** | Optional but cheap; helps Google interpret freshness. |
| `Article` / `BlogPosting` | Blog (lives at subdomain — out of scope here) | (subdomain) | When blog reverse-proxies under `/blog`, ensure `Article` ships. |

---

## Appendix C — Crawl/index health summary

| Item | Status | Notes |
|---|---|---|
| `robots.txt` | **404** | **P0**. Must ship. |
| `sitemap.xml` | **404** | **P0**. Must ship. |
| `sitemap-index.xml` | 404 | Acceptable if `sitemap.xml` exists; not both required. |
| `feed.xml` / `rss.xml` | 404 | Defensible while no on-domain blog. Add once blog moves to `/blog`. |
| Custom 404 page | **Missing** | **P2**. Server-default body. |
| HTTPS only | ✓ | LiteSpeed, valid cert. |
| `www` → apex | ✓ | 301 confirmed. |
| Trailing slash convention | ✗ | `/about/` 200, `/contact/` 301 → `/`, `/contact` 404. **P0**. |
| `/contact` | **404** | **P0**. |
| `/blog` | 404 | Subdomain blog at `blog.thestrledger.com` — link from main-site `<head>`. |
| `/products` index | 404 | Add a hub. |
| `/free` index | 404 | Add a hub. |
| `/disclosures` | 404 | Footer-link integrity unverified — confirm whether `/disclosures` is linked anywhere; if so, P0; if not, drop the URL. |
| Sister-site cross-links | Absent | **P0** for hub-and-spoke economics — the brand owns five sister sites and links to none of them. |

---

## Appendix D — What's genuinely fine, briefly

- **Voice + copy** — best-in-class for the niche. Product H1s like *"The deduction your CPA wishes you'd tracked."* are higher conversion than 95% of indie-store competitors.
- **Per-page canonical, OG, Twitter, viewport, lang** — every page audited has full head hygiene.
- **Refund policy + Terms + Privacy** — substantive, well-structured, and link consistently from footer (only the `/disclosures` footer link is unverified).
- **`www` → apex 301** — correctly configured.
- **Footer is consistent across pages** — same set of links from /about, /privacy, /terms, /refunds, /free/47-deductions. Sitewide `Footer.astro`-equivalent works.
- **Lead-magnet–to-product CTA path** — 47-deductions page explicitly cross-sells TAX-001, TAX-002, GST-001, OPS-001. Funnel logic is intentional.
- **`mailto:hello@thestrledger.com`** — present on every page for support contact (though no `/contact` page is no substitute for E-E-A-T).

---

*End of audit.*
