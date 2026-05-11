# thestrledger.com — Keyword Research

**Date:** 2026-05-10
**Author:** Claude (Opus 4.7)
**Brand:** The STR Ledger (parent of the STR cluster — strhost.tools, strguests.tools, strops.tools, strbuyers.tools, strmanuals.com)
**Site model:** Astro hybrid on Hostinger; LiteSpeed; Stripe (one-time, lifetime updates); InfluencerSoft via n8n.
**Catalog audited:** 65 SKUs in `copy/product-pages/` and `templates/`; 12 SKUs currently linked from the live site (TAX-001, TAX-002, TAX-003, TAX-004, GST-001, GST-002, OPS-001, OPS-002, FIN-001, FIN-003, ACQ-001, LGL-001).
**Companion audit:** `SEO-AUDIT-thestrledger-2026-05-10.md` (51/100; technical plumbing is the bottleneck, not copy).
**Prior research extended (not duplicated):** `copy/etsy-listings/seo-research.md` (Etsy-only, per-SKU; this doc handles Google + cross-channel + parent-brand).

---

## 1. Executive summary

thestrledger.com is the **only revenue surface in the STR cluster** — the four sister sites are free-tool hubs. That makes Google commercial-intent traffic the single most valuable channel to win. The brand has three stacked advantages no competitor in this niche has consolidated:

1. **A 12-SKU paid catalog** of business-grade Excel workbooks at a single, defensible price point ($17–$47 per SKU per the catalog, bundles up to 42% off).
2. **A four-magnet lead-capture surface** (`/free/47-deductions`, `/free/welcome-book`, `/free/etsy-buyer`, `/free/entity-flowchart`) whose long-tail informational queries can be ranked.
3. **An owned five-site hub** that, if cross-linked properly, gives the parent brand a topical-authority graph that Etsy, BNB Duck, and Lodgify cannot replicate.

**Top 3 opportunities (12-month, in order):**

1. **Lead-magnet long-tail dominance.** "47 airbnb deductions" / "airbnb tax deductions list" / "airbnb tax write off list" are LOW-KD informational queries with strong commercial bridge into TAX-001 / TAX-002. Today `/free/47-deductions` is the single best-positioned URL on the site; with proper schema, Org sameAs, and 5–8 supporting blog posts, it can own the head terms inside 2 quarters.
2. **Etsy-Google duality on the bestseller SKUs.** TAX-001 (Mileage Log), GST-001 (Welcome Book), and ACQ-001 (Deal Analyzer) all map to Etsy SERPs **and** Google SERPs with substantially different intent profiles. The Etsy listing wins on review velocity; the Google product page should win on authority + schema + bundle upsell. Two front doors.
3. **Programmatic 50-state expansion of the 47-deductions guide.** The 47 federal deductions are constant; state add-ons (TX has no income tax, NY has the city add-on, CA has FTB nuances) give 50 unique landings off one master template. Sister site `strhost.tools` already does the same play with lodging-tax pages — the parent brand can mirror this for the *deductions* angle.

**Biggest risks:**

- **Etsy demotes "templated copy" listings.** The 13-tag formula in `etsy-research.md` is necessary but not sufficient; CTR + CVR thresholds (CTR <1% Day 30, CVR <2% Day 30) trigger demotion before Google ever sees the brand. Watch the dashboards weekly.
- **Schema-less product pages cap CTR.** Without `Product` + `offers` JSON-LD the brand cannot show price + availability + (eventually) star ratings in SERPs. Competitors (Templacity, Lodgify) do.
- **Brand-name collision.** "STR ledger" / "the str ledger" return zero Etsy or Google results today (per WebSearch 2026-05-10). Good — there's no competitor squatting. Bad — there's no demand. Brand search has to be *built*, which means relying on Pinterest + Etsy + email for the first 12 months and accepting that branded SERP volume will be ~0 until ~Q3.

**Recommended first move (this week):**

Ship `Organization` + `Product`/`offers` + `BreadcrumbList` JSON-LD across the 12 live product pages, plus `/robots.txt` and `/sitemap.xml`. This is the single highest-leverage change available. Without it, every keyword opportunity below is leaving 30–60% of its CTR potential on the table.

---

## 2. Brand-keyword universe

Brand search today is essentially zero — the brand is too new, and "STR ledger" is a defensible, unclaimed phrase (no competing trademark surfaced; no Etsy shop competition; no domain squatter). This is a **build-it** play, not a defend-it play.

| Keyword | Intent | Volume band | KD band | Priority |
|---|---|---|---|---|
| the str ledger | Brand-navigational | 0 → 50/mo (build) | LOW | P0 — own the brand SERP page-1 immediately |
| str ledger | Brand-navigational | 0 → 100/mo (build) | LOW | P0 |
| str ledger excel | Brand-product | 0 → 30/mo | LOW | P1 |
| str ledger workbook | Brand-product | 0 → 20/mo | LOW | P1 |
| str ledger spreadsheet | Brand-product | 0 → 20/mo | LOW | P1 |
| thestrledger.com | Direct-nav | 0 → 50/mo (build) | LOW | P0 |
| str ledger reviews | Trust query | 0 → 20/mo (q3+) | LOW | P2 — needs review surface first |
| str ledger vs lodgify | Comparison | 0 → 10/mo (q3+) | LOW | P2 — write a comparison page once positioning is sharp |

**Branded SERP audit (2026-05-10, WebSearch):** `"the str ledger"` returns no thestrledger.com results in the first page; surface is dominated by unrelated "ledger" queries (artwork, antique books). This is a **knowledge-panel-empty** state. Required to fix:

- Ship `Organization` JSON-LD with `name: "The STR Ledger"`, `url`, `logo`, `sameAs[]` populated with Etsy shop URL + any social profiles (P0).
- Get the brand into the Knowledge Graph via consistent NAP-equivalent surfaces: same logo, same description, same tagline on Etsy About + LinkedIn company page + Pinterest profile + (eventually) Crunchbase.
- File for the **knowledge-panel claim** at `g.co/kgs` once the panel auto-generates (typically 60–120 days after Org schema + sameAs propagation).

---

## 3. Product-keyword universe

The 12 currently live SKUs, mapped to commercial-intent Google queries. Volume bands: LOW = <100/mo US, MED = 100–1,000, HIGH = 1,000+. KD bands: LOW = <30, MED = 30–50, HIGH = 50+. Bang-for-buck (BFB) is purchase-intent volume × inverse-difficulty × catalog-fit. Tier: P0 = ship landing now; P1 = ship within sprint; P2 = backlog.

### 3.1 TAX-001 — STR Mileage Log (`/products/TAX-001`)

| Keyword | Intent | Vol | KD | Top 3 Google SERPs (2026-05-10) | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb mileage log | Commercial | MED | LOW-MED | Etsy market, BNB Duck, Templacity | 10/10 | 9 | **P0** |
| airbnb mileage tracker | Commercial | MED | MED | Etsy listings, Lodgify blog, Stessa | 10/10 | 8 | **P0** |
| str mileage log spreadsheet | Commercial | LOW | LOW | (open SERP — own this) | 10/10 | 9 | **P0** |
| irs mileage log template | Commercial-info | HIGH | HIGH | IRS.gov, Hurdlr, MileIQ | 7/10 | 5 | P1 |
| schedule e mileage deduction | Informational | MED | MED | Investopedia, IRS, BiggerPockets | 8/10 | 6 | **P0** (blog) |
| rental property mileage log | Commercial | MED | MED | Etsy, Stessa, Hurdlr | 9/10 | 7 | P1 |
| airbnb host mileage rate 2026 | Informational | LOW | LOW | IRS.gov, generic blogs | 9/10 | 8 | **P0** (blog) |
| vrbo mileage tracker excel | Commercial | LOW | LOW | Etsy thin coverage | 10/10 | 9 | **P0** |

### 3.2 TAX-002 — Schedule E Workbook

| Keyword | Intent | Vol | KD | Top 3 Google SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb schedule e template | Commercial | MED | MED | TimeSavingTemplates, Etsy, Stessa | 10/10 | 8 | **P0** |
| schedule e excel template | Commercial | MED | HIGH | Vertex42, Etsy, REtipster | 8/10 | 6 | P1 |
| airbnb schedule c vs schedule e | Informational | MED | MED | Stessa, Bench, BiggerPockets | 9/10 | 7 | **P0** (blog) |
| short term rental tax filing template | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |
| str tax workbook excel | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |

### 3.3 TAX-003 / TAX-004 (1099-NEC tracker, related tax)

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb 1099 tracker | Commercial | LOW-MED | LOW | Etsy thin | 10/10 | 8 | **P0** |
| str 1099-nec template | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |
| airbnb cleaner 1099 spreadsheet | Commercial | LOW | LOW | (open) | 10/10 | 8 | **P0** |
| airbnb tax deductions list | Informational | HIGH | MED | Stessa, Lodgify, Hospitable | 10/10 | 9 | **P0** (bridges to /free/47-deductions) |

### 3.4 GST-001 — Welcome Book

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb welcome book template | Commercial | HIGH | HIGH | Etsy market (saturated), Probits, Touch Stay | 9/10 | 6 | P1 |
| airbnb welcome book canva | Commercial | MED | HIGH | Etsy bestsellers (Canva-format dominant) | 5/10 | 3 | P2 (we ship Excel/Sheets, not Canva) |
| airbnb house manual template | Commercial | MED | MED | Etsy, Lodgify, Hostfully | 9/10 | 7 | **P0** |
| vrbo welcome book template | Commercial | MED | MED | Etsy, Hospitable | 9/10 | 7 | **P0** |
| airbnb guest guidebook editable | Commercial | MED | HIGH | Etsy Canva-dominant | 6/10 | 4 | P2 |
| str welcome book excel | Commercial | LOW | LOW | (open — own the spreadsheet angle) | 10/10 | 9 | **P0** |

> **Positioning note:** Etsy welcome-book SERPs are dominated by Canva templates. The STR Ledger's welcome book is a **structured spreadsheet/printable** — different format, different buyer. Don't fight the Canva sellers; lean into "spreadsheet-first" copy and target operators with multi-property portfolios who want a single source of truth, not a pretty PDF per unit.

### 3.5 GST-002 — House Rules Builder

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb house rules template | Commercial | MED | MED | Etsy, Hospitable, AvalaraMyLodgeTax | 9/10 | 7 | **P0** |
| short term rental house rules | Informational-commercial | MED | MED | Hostfully, BiggerPockets, Lodgify | 9/10 | 7 | **P0** |
| airbnb rules pdf editable | Commercial | LOW | LOW | Etsy thin | 9/10 | 8 | **P0** |
| str rental agreement template | Commercial | MED | HIGH | LegalZoom, Rocket Lawyer, Etsy | 6/10 | 4 | P2 (different product class) |

### 3.6 OPS-001 — Turnover Checklist

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb turnover checklist | Commercial | MED-HIGH | MED | Etsy, TurnoverBnB, iGMS blog | 10/10 | 8 | **P0** |
| airbnb cleaning checklist printable | Commercial | HIGH | HIGH | Etsy market saturated | 7/10 | 5 | P1 |
| str cleaning checklist excel | Commercial | LOW | LOW | (open — own) | 10/10 | 9 | **P0** |
| vrbo turnover checklist | Commercial | MED | MED | Etsy, Hospitable | 10/10 | 8 | **P0** |
| airbnb cleaner sop template | Commercial | LOW | LOW | (open) | 9/10 | 8 | **P0** |

### 3.7 OPS-002 — Damage Claim / Aircover Log

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb damage claim template | Commercial-info | MED | MED | Airbnb help, Igms, Hospitable | 9/10 | 7 | **P0** |
| aircover claim spreadsheet | Commercial | LOW | LOW | (open — own this) | 10/10 | 9 | **P0** |
| airbnb damage log template | Commercial | LOW | LOW | Etsy thin | 10/10 | 9 | **P0** |
| how to file aircover claim | Informational | MED | MED | Airbnb, host blogs | 8/10 | 6 | **P0** (blog → product) |

### 3.8 FIN-001 — RevPAR Dashboard

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb revpar calculator | Commercial | LOW-MED | LOW | strhost.tools (own sister site!), AirDNA | 10/10 | 9 | **P1** (don't cannibalize the free sister-site calc; sell the dashboard upgrade) |
| str revpar excel template | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |
| airbnb kpi dashboard | Commercial | LOW-MED | MED | Etsy, Templacity, AirDNA | 9/10 | 7 | **P0** |
| short term rental dashboard excel | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |

> **Cannibalization risk:** strhost.tools/revpar-calculator is a free calculator. FIN-001 is a paid annual dashboard. The two products serve different jobs (single-calc vs longitudinal). Position them explicitly: free calc for one-shot answers, paid dashboard for tracking over time. Cross-link both ways.

### 3.9 FIN-003 — 12-Month Cash Flow Forecaster

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb cash flow spreadsheet | Commercial | MED | MED | Etsy, Stessa, BiggerPockets | 10/10 | 8 | **P0** |
| str cash flow forecast excel | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |
| short term rental pro forma template | Commercial | MED | MED | AdventuresinCRE, Etsy, BiggerPockets | 9/10 | 7 | **P0** |
| airbnb monthly profit loss template | Commercial | MED | MED | Etsy, Lodgify, BNB Duck | 9/10 | 7 | **P0** |

### 3.10 ACQ-001 — STR Deal Analyzer

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| str deal analyzer | Commercial | MED | LOW-MED | Chalet (free), Etsy, AdventuresinCRE | 10/10 | 8 | **P0** |
| airbnb deal analyzer spreadsheet | Commercial | MED | MED | Chalet, Rabbu, BiggerPockets, Etsy | 10/10 | 7 | **P0** |
| str underwriting spreadsheet | Commercial | LOW-MED | MED | Chalet, BiggerPockets, AIRDNA | 9/10 | 7 | **P0** |
| airbnb roi calculator excel | Commercial | MED | MED | Chalet, Rabbu, Etsy | 9/10 | 7 | **P0** |
| str cap rate template | Commercial | LOW | LOW | (open) | 9/10 | 8 | **P0** |

### 3.11 LGL-001 — STR License Renewal Calendar

| Keyword | Intent | Vol | KD | Top 3 SERPs | Fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| str license tracker spreadsheet | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |
| airbnb permit renewal calendar | Commercial | LOW | LOW | (open) | 10/10 | 9 | **P0** |
| short term rental compliance tracker | Commercial | LOW-MED | MED | Granicus, Avalara, Host Compliance | 8/10 | 6 | P1 |

### 3.12 Rolled-up product P0 list (ship landing copy + schema in next sprint)

`/products/TAX-001`, `/products/TAX-002`, `/products/TAX-003`, `/products/GST-001`, `/products/GST-002`, `/products/OPS-001`, `/products/OPS-002`, `/products/FIN-001`, `/products/FIN-003`, `/products/ACQ-001`, `/products/LGL-001` — all 11 of the 12 currently linked.

(`/products/TAX-004` should be confirmed live + audited next pass; not rendered in extracted product nav.)

---

## 4. Lead-magnet keywords

The four `/free/<slug>` URLs are the brand's top-of-funnel. The 47-deductions guide is the strongest of the four; it should be treated as a content asset on par with a pillar blog post.

| Keyword | Intent | Vol | KD | Top 3 SERPs | Maps to | Tier |
|---|---|---|---|---|---|---|
| airbnb tax deductions list | Informational | HIGH | MED | Stessa, Lodgify, Hospitable | /free/47-deductions → TAX-001 + TAX-002 | **P0** |
| airbnb tax write off list | Informational | MED-HIGH | MED | Stessa, Lodgify, Bench | /free/47-deductions | **P0** |
| 47 airbnb deductions | Informational | LOW (own this exact phrase) | LOW | (open) | /free/47-deductions | **P0** |
| short term rental write offs | Informational | MED | MED | Stessa, Bench, BiggerPockets | /free/47-deductions | **P0** |
| airbnb tax deductions 2026 | Informational | MED | MED | Lodgify, Bench, Hospitable | /free/47-deductions | **P0** |
| str host tax deductions | Informational | LOW-MED | LOW | (open) | /free/47-deductions | **P0** |
| airbnb welcome book free template | Commercial-info | MED | HIGH | Etsy, Touch Stay, Probits | /free/welcome-book → GST-001 | **P0** |
| airbnb llc vs sole proprietor | Informational | MED | MED | NerdWallet, Stessa, BiggerPockets | /free/entity-flowchart | **P0** |
| str entity structure decision | Informational | LOW | LOW | (open) | /free/entity-flowchart | **P0** |
| airbnb sole proprietor tax | Informational | MED | MED | Stessa, Bench, IRS | /free/entity-flowchart | **P0** |
| etsy buyer guide airbnb | Cross-channel | LOW | LOW | (open) | /free/etsy-buyer | P1 |

> **Action**: rewrite `/free/47-deductions` meta description from 238 chars → 150 chars; add `Article` + `HowTo` JSON-LD; add 5 internal links to TAX-001/TAX-002/GST-001/OPS-001 + the (to-be-built) blog posts in §5. **Add a `/free` hub page** so the four landings are clustered, not orphaned (per audit P1).

---

## 5. Editorial / blog keywords

Top-of-funnel informational targeting. Each post should bridge to one or more workbook SKUs via in-content + sidebar CTAs. The blog currently lives at `blog.thestrledger.com` (Ghost subdomain, per PROGRESS.md) — see audit P1 finding to consolidate under `/blog` for topical authority. This list assumes the consolidation happens; if not, replace `/blog/` with the subdomain in internal links.

| Post slug | Target keyword(s) | Vol | KD | Bridges to | Priority |
|---|---|---|---|---|---|
| airbnb-1099-vs-schedule-c | airbnb 1099 vs schedule c, airbnb schedule c vs e | MED | MED | TAX-001, TAX-002, /free/entity-flowchart | **P0** |
| airbnb-depreciation-cost-segregation | airbnb cost segregation, str depreciation rules | MED | MED-HIGH | TAX-002 | **P0** |
| airbnb-mileage-rate-2026 | irs mileage rate 2026 airbnb, airbnb host mileage deduction | MED | MED | TAX-001 | **P0** |
| airbnb-quarterly-estimated-taxes | airbnb estimated taxes, str quarterly tax payments | MED | MED | TAX-002, TAX-003 | **P0** |
| airbnb-llc-vs-sole-proprietor | airbnb llc vs sole proprietor (extends /free/entity-flowchart) | MED | MED | /free/entity-flowchart, TAX-002 | **P0** |
| str-deal-underwriting-checklist | str underwriting checklist, airbnb deal analyzer questions | LOW-MED | LOW-MED | ACQ-001 | **P0** |
| airbnb-vs-vrbo-fee-comparison | airbnb vs vrbo fees, vrbo host fees breakdown | MED | MED | strhost.tools/airbnb-fee-calculator (cross-link) + FIN-001 | **P0** |
| airbnb-aircover-claim-walkthrough | how to file aircover claim, airbnb damage claim guide | MED | MED | OPS-002 | **P0** |
| airbnb-cleaner-1099-rules | airbnb cleaner 1099, do i need to 1099 my airbnb cleaner | LOW-MED | LOW | TAX-003 | **P0** |
| str-pro-forma-walkthrough | str pro forma, airbnb 5 year pro forma template | LOW-MED | MED | ACQ-008, FIN-003 | P1 |
| airbnb-bookkeeping-for-cpas | airbnb bookkeeping for tax pros, what your cpa wants | LOW | LOW | TAX-001, TAX-002 | P1 |
| airbnb-occupancy-tax-by-state | lodging tax by state airbnb, occupancy tax airbnb 50 states | MED-HIGH | MED | strhost.tools/lodging-tax (cross-link to free calc) | **P0** |

> **Cadence**: 1 post/week for 12 weeks would land all P0 + half the P1s by end of Q3. This matches the existing `copy/_atomization` weekly content engine.

---

## 6. Etsy parallel-channel keyword strategy

**Etsy SEO ≠ Google SEO.** Three differences worth calling out:

| Factor | Etsy | Google |
|---|---|---|
| Primary signals | Title-front-load, 13 tags, conversion velocity, recency | Title, content depth, schema, backlinks, E-E-A-T |
| URL structure | Auto-generated, not editable | Editable, canonical-controlled |
| Re-rank cadence | Every renewal (4 months ideal) | Continuous |
| Buyer intent baseline | Higher (browse-to-buy ratio better) | Lower (research-heavy) |
| Review surface | First-class ranking factor | Indirect (via aggregate rating in Product schema) |
| Competition shape | Per-listing, micro-niche | Per-domain, macro-cluster |
| Seller leverage | Photos + tags + price | Content + authority + linking |

This means the brand should run **two SKU positioning strategies in parallel** — Etsy listings front-load the noun phrase (`Airbnb Mileage Log Spreadsheet | IRS Compliant ...`) while Google product pages can lead with the headline H1 (`The deduction your CPA wishes you'd tracked.`) and put the noun phrase in H2.

### 6.1 Per-SKU Etsy SERP audit (2026-05-10)

| SKU | Etsy primary tag | Top 3 Etsy competitors observed | Gap |
|---|---|---|---|
| TAX-001 Mileage Log | "airbnb mileage log" | Generic mileage-log printables, IRS-mileage-log digital downloads, broad "tax tracker" Excel sheets | **STR-specific framing**. Most competitors are generic mileage logs adapted for "any business." Lean into "Schedule E export" + "Airbnb-specific" hard. |
| GST-001 Welcome Book | "airbnb welcome book template" | Probits (bestseller), Canva-dominant designs, multi-format bundles (PDF + InDesign + Word) | **Format**. Etsy's welcome-book buyer expects Canva. Spreadsheet/Excel framing is differentiated but smaller pool. Test whether to ship a Canva companion. |
| OPS-001 Turnover Checklist | "airbnb turnover checklist" | Printable PDF lists, generic cleaning checklists, "Airbnb host bundle" multi-template packs | **SOP depth + cleaner-payable rate column**. Competitors ship a list; we ship a workflow. |
| ACQ-001 STR Deal Analyzer | "str deal analyzer" / "airbnb roi calculator" | Solo seller "STR Deal Analyzer" Etsy listing, smarthelping arbitrage model, generic real-estate ROI sheets | **Bundles + free-tool funnel**. Position the deal analyzer as the entry-point to the FIN-* and ACQ-* stacks; one-time price beats arbitrage-model SaaS subs. |
| FIN-003 Cash Flow Forecaster | "airbnb cash flow spreadsheet" | TimeSavingTemplates, Etsy "Airbnb income & expense", Lodgify-adjacent templates | **12-month forecast** + **monthly P&L roll-up**. Most listings are one-tab expense trackers; we ship a model. |

### 6.2 Etsy keyword extension list (beyond `copy/etsy-listings/seo-research.md`)

The existing seo-research.md covers TAX-001 in depth. Extending coverage for the other current-live SKUs:

**GST-001 (Welcome Book) — 13 tag candidates:**
1. airbnb welcome book
2. vrbo welcome book
3. str welcome guide
4. airbnb host template
5. vacation rental guide
6. airbnb house manual
7. welcome book excel
8. str host bundle
9. rental property guide
10. guest welcome book
11. airbnb printable
12. vacation rental template
13. short term rental guide

**OPS-001 (Turnover Checklist) — 13 tag candidates:**
1. airbnb turnover checklist
2. airbnb cleaning checklist
3. str cleaning sop
4. vrbo cleaning list
5. cleaner checklist printable
6. airbnb host template
7. cleaning sop template
8. vacation rental cleaning
9. turnover spreadsheet
10. airbnb operations
11. cleaner payroll template
12. str cleaning workflow
13. airbnb checklist excel

**ACQ-001 (STR Deal Analyzer) — 13 tag candidates:**
1. str deal analyzer
2. airbnb deal analyzer
3. airbnb roi calculator
4. str underwriting
5. vacation rental analyzer
6. real estate analyzer
7. cap rate calculator
8. airbnb investment
9. short term rental
10. property analysis
11. str spreadsheet
12. airbnb arbitrage
13. real estate template

> **Renewal cadence policy** (per existing seo-research.md): every 4 months. Hold to it. Etsy treats renewal as a recency signal.

---

## 7. Hub-and-spoke linking strategy

The brand owns five free-tool sister sites. Each is a topical-authority asset. The parent thestrledger.com today links to **none** of them. This is the single largest off-page opportunity available, and it's free.

### 7.1 Site → topic alignment

| Site | Primary topic | Best link target on thestrledger | Anchor text recommendation |
|---|---|---|---|
| strhost.tools | Calculators (RevPAR, fees, lodging tax) | FIN-001 (RevPAR Dashboard), FIN-003 (Cash Flow), ACQ-001 (Deal Analyzer) | "Free RevPAR calculator at STR Host Tools" / "Airbnb fee calculator" |
| strops.tools | Operations (replacement-cost lookup, maintenance schedules, damage cost) | OPS-001 (Turnover), OPS-002 (Damage / Aircover) | "Free damage cost lookup at STR Ops" / "Replacement cost index" |
| strguests.tools | Guest-side tools (refund estimator, etc.) | GST-001 (Welcome Book), GST-002 (House Rules) | "Guest tools at STR Guests" |
| strbuyers.tools | Acquisition (deal analysis lite, market research) | ACQ-001 (Deal Analyzer), all ACQ-* | "Free deal-analysis tools at STR Buyers" |
| strmanuals.com | Manuals / how-to PDFs | All product pages (cross-sell) | "Hands-on manuals at STR Manuals" |

### 7.2 Placement recommendations

- **Footer block on every page of thestrledger.com**: "Free tools from The STR Ledger" with all five sister sites + one-line description each. Use descriptive anchor text, not naked URLs. This is the single most important placement.
- **Sister-site footers**: each free site already has a footer. Add a "Buy the workbooks" CTA pointing to thestrledger.com with anchor text "Business-grade Excel workbooks for hosts" → thestrledger.com.
- **In-content contextual links**: at minimum 1 contextual link per relevant blog post pointing to the relevant sister tool (e.g., a post about Airbnb fees should link to strhost.tools/airbnb-fee-calculator with anchor "free Airbnb fee calculator"). And the sister-tool page should have a contextual paid-upgrade CTA back to the parent.
- **`Organization` schema `sameAs[]`** on all five sister sites + thestrledger.com should list every other domain in the cluster + Etsy shop. This consolidates entity authority.
- **Reciprocal internal-link audit cadence**: monthly. Each new sister-site page should add one inbound link from thestrledger.com somewhere in the nav/footer/blog.

### 7.3 Anti-patterns to avoid

- **No hidden link blocks.** Five domains all linking to each other from sitewide footers is fine if the footer is editorial (descriptions, not just URLs). It's spam-flag territory if it's a list of 20 anchor-stuffed exact-match keywords.
- **Don't 301 sister-site URLs to thestrledger.com.** Each free site has independent topical authority. Consolidating them dilutes both surfaces.
- **Don't rel=nofollow the cross-links.** These are owned, editorial, intentional. Let them pass authority.
- **Don't write the same paragraph on multiple sites.** Cross-link is fine; cross-content is duplicate.

---

## 8. Competition deep-dive

Competitive landscape sourced from WebSearch 2026-05-10 across the heaviest commercial queries.

### 8.1 Top-3 ranking domains for the heaviest commercial queries

**Cluster: "airbnb expense / bookkeeping spreadsheet" (HIGH volume)**

| Rank | Domain | Strengths | Weaknesses | How to beat |
|---|---|---|---|---|
| 1 | lodgify.com | Editorial brand, lots of inbound links, free template + paid SaaS upsell, deep blog | Template is a giveaway not a product; not Excel-native; brand is software-first | Sell the workbook as a **finished product**, not a giveaway; lifetime updates beats their evergreen freemium |
| 2 | stessa.com | SaaS brand, free template + paid platform, REI brand recognition, strong content engine | Template is bait for the SaaS; long-term rental focused | Lean STR-only positioning; "Schedule E export" framing |
| 3 | shoeboxed.com | Receipt-scanning brand, "4 free templates" listicle ranks well, broad audience | Template list is roundup not a product; no Excel depth | Compete by being the *deepest* single workbook, not a shallow comparison |

**Cluster: "str deal analyzer / airbnb underwriting" (MED volume)**

| Rank | Domain | Strengths | Weaknesses | How to beat |
|---|---|---|---|---|
| 1 | getchalet.com (Chalet) | Free underwriting tool, REI-investor brand, strong CTA funnel | The free tool is the lead-magnet for a brokerage; not a portfolio dashboard | Position ACQ-001 as the **portfolio operator's** tool: Chalet for one-shot, ours for ongoing |
| 2 | rabbu.com | Calculator + market data, brand authority in STR analytics | Data-product first, not template; no editable Excel | Editable Excel beats opaque calculator for hosts who want to model their own assumptions |
| 3 | biggerpockets.com (forum threads) | Massive REI brand authority, forum SEO crushes long-tail | Forum threads are unstructured; spreadsheets in forums die in attachments | Land a sponsored or organic post *on* BiggerPockets pointing to ACQ-001 |

**Cluster: "airbnb welcome book" (HIGH volume but Etsy-dominant)**

| Rank | Domain | Strengths | Weaknesses | How to beat |
|---|---|---|---|---|
| 1 | etsy.com (multiple sellers, Probits a top seller) | Marketplace authority, review surface | Format-locked to Canva; per-listing competition | Win on Google, not Etsy, with the spreadsheet-format welcome book + bundle pricing |
| 2 | hospitable.com | SaaS brand, content-marketing engine | Welcome-book article is content-marketing for the SaaS, not a product | Compete on the spreadsheet differentiation — different product class |
| 3 | touchstay.com | Digital welcome-book SaaS | Subscription pricing | Lifetime-update one-time price wins on TCO |

**Cluster: "airbnb tax deductions" (HIGH volume, informational)**

| Rank | Domain | Strengths | Weaknesses | How to beat |
|---|---|---|---|---|
| 1 | stessa.com / hospitable.com / lodgify.com | All SaaS brands with strong content, deductions listicles rank | Generic, not host-segmented (long-term-rental bias for Stessa) | Win with the **47-deductions guide** + the **state-scoped programmatic series** (§9) |
| 2 | bench.co | Bookkeeping SaaS, finance brand authority | Generic content, not Airbnb-deep | Out-deepen them on STR-specific edge cases (cleaning fee deductibility, mileage from a primary residence vs second home, etc.) |
| 3 | irs.gov / nerdwallet.com | Authoritative source/personal-finance brand | Authoritative, not actionable for hosts | Out-actionable them with the workbook bridge |

### 8.2 What competitors are NOT doing (gaps to exploit)

- **No competitor in the "Airbnb spreadsheet" space ships per-page `Product` schema with `offers`.** SERPs for "airbnb mileage log spreadsheet" do not show price-rich snippets today. First mover wins.
- **No competitor has a 5-site free-tool cluster.** Templacity, Lodgify, Stessa each have one site. The hub-and-spoke advantage is real if executed.
- **No competitor segments by host operator type (Sarah-the-Semi-Pro vs Investor-Mode).** The product-page H1 voice is more differentiated than anything in the SERP.
- **No competitor cross-links Etsy + own-site as a single brand.** Etsy listings don't link back to a brand site (Etsy ToS-discouraged, but the buyer-PDF companion **does** carry a brand URL — which the brand already does via the A13 PDF).

---

## 9. Prioritized action list

### P0 (this sprint)
1. Ship `Organization` + `Product`/`offers` + `BreadcrumbList` JSON-LD across all 12 product pages + `/about` + `/free/47-deductions`. **Single highest-leverage SEO change available.**
2. Ship `/robots.txt` + `/sitemap.xml` (per audit P0).
3. Add the "Free tools from The STR Ledger" footer block linking all five sister sites with descriptive anchors (this section, §7.2).
4. Rewrite `/free/47-deductions` meta description to ≤160 chars. Add 5 internal links to TAX-001/TAX-002/GST-001/OPS-001 + the to-be-built blog.
5. Build `/free` hub index page (clusters the four lead magnets; emit `ItemList`).
6. Fix the home H1 markup defect (per audit P1).
7. Ship the 5 P0 blog posts in §5 (1 per week → 5 weeks). Bridge each to its target SKU.
8. Audit and extract metadata from the remaining 11 product pages + 3 free-guide landings (cycle 2 of this audit).

### P1 (next 30–60 days)
9. Reverse-proxy `blog.thestrledger.com` under `thestrledger.com/blog` for topical-authority consolidation. Or, if blocked, link the subdomain from the main-site `<head>` via `<link rel="alternate">` and from header/footer.
10. Build the 50-state programmatic deductions series (`/free/airbnb-tax-deductions-<state>`). One `/state` template, 50 unique state-add-ons + state-tax differences. Mirror the strhost.tools lodging-tax pattern, but for *deductions*.
11. Extend the Etsy 13-tag list to all 12 currently-live SKUs (existing seo-research.md only covers TAX-001 in depth).
12. `FAQPage` JSON-LD on each product page (3–5 Qs each).
13. Per-page OG images for the 12 products + 4 free guides.

### P2 (next 60–120 days)
14. Apply for the Knowledge Panel claim once `Organization` schema + sameAs propagation has had ~60 days.
15. Build the comparison content (`str ledger vs lodgify`, `str ledger vs stessa`) once the brand has enough reviews to warrant it.
16. Etsy-review syndication into `Product` `Review[]` + `aggregateRating` (manual transcription, do not fabricate).
17. Backlink campaign: 5 BiggerPockets forum posts/year referencing the deal analyzer + 5 Reddit r/AirBnB substantive comments per quarter referencing the workbook (organic, value-led).

---

## 10. Cadence / next checkpoints

| Checkpoint | When | What to verify |
|---|---|---|
| Schema rollout audit | 30 days post-launch | Run Rich Results Test on all 12 product pages; confirm `Product` + `offers` + `BreadcrumbList` valid; submit URLs in Search Console. |
| Sitemap submission | 7 days post-launch | Submit `/sitemap.xml` in GSC. Verify all 21 URLs indexed within 30 days. |
| Lead-magnet conversion check | 60 days | `/free/47-deductions` form-fill rate baseline + bridge-to-purchase rate from email sequence. |
| Etsy-vs-Google sales split | 90 days | Confirm both channels feed the same SKUs; identify which SKUs over/underperform per channel; rebalance. |
| Brand-search lift | 120 days | Track impressions for "the str ledger" / "str ledger" in GSC. Goal: ≥50/mo by end of Q3. |
| Knowledge Panel | 120–180 days | Check `g.co/kgs` for an auto-generated panel; claim it. |
| Programmatic deductions series | 180 days | Ship 50 state pages; track aggregate impressions; identify the 5 highest-traffic states for deeper buildout. |
| Full audit re-run | 180 days | Re-run `SEO-AUDIT-thestrledger-2026-05-10.md` with a 2026-11 dated successor. Goal: 80+/100. |

---

*End of keyword research.*
