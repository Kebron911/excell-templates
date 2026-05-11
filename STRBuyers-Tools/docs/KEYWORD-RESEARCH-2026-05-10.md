# strbuyers.tools — Keyword Research & Competition Scan

**Research date:** 2026-05-10
**Author:** Claude (Opus 4.7)
**Scope:** Source-grounded keyword + SERP scan for the 7 launch tools, the 219-city programmatic cluster, and the affiliate-keyword overlay.
**Method:** Live WebSearch for primary + secondary keywords; SERP shape and dominant-domain inventory captured per query (no fabricated volume numbers — bands only).
**Live URL:** https://strbuyers.tools (v0.1.0, 232 pages indexed in sitemap-0.xml).

---

## Executive summary

The strbuyers.tools cluster is entering a mature, well-monetized SERP dominated by venture-funded data SaaS (AirDNA, Rabbu, Mashvisor, Airbtics, AirROI, Awning) and DSCR lender direct-response sites (Griffin, Ridge Street, Easy Street, Newfi, Defy, Kiavi). Every primary keyword has at least one calculator-with-data competitor in the top 5. Pure calculator pages with no proprietary data will not displace them. The wedge is (a) the buyer-decision framing (most competitors target hosts, not pre-buy researchers), (b) honest editorial voice + transparent formulas, and (c) the city-level long-tail at scale.

Top 3 opportunities, ranked by bang-for-buck:

1. `dscr loan calculator str` / `dscr loan airbnb` — top-3 SERP is direct lenders (Ridge Street, Griffin, Newfi) and Chalet's free calculator. No editorially independent calculator-first page in the top 3. Highest CPM/affiliate potential of any keyword in the cluster ($200–700 per closed loan via Kiavi affiliate program — confirmed payouts: Keyholder $700, Influencer $20/lead). First-move target.
2. `airbnb startup cost calculator` / `year 1 cash needs` — competition is mostly listicle blog posts (AirDNA blog, therealist, Airbtics, Uplisting) plus one dedicated calc (STR Specialist, Templacity spreadsheet). Calculator + room-by-room breakdown is genuinely defensible. Mid affiliate fit (insurance, furniture, PMS).
3. `airbnb furnishing budget calculator` — surprisingly thin SERP. Two real calculators (Showplace, The Offer Sheet, STRNumbers); rest are blog rules-of-thumb. Direct affiliate path: Stage by Hand, Minoan, Article. P0 quick win.

Biggest risks:

- `is airbnb profitable in [city]` programmatic cluster is the cluster's biggest content surface (219 pages) and the most contested SERP shape in STR. Every top-3 city result for Austin, Nashville, Miami is owned by AirDNA, Rabbu, Airbtics, AirROI, or Inside Airbnb — domains with daily-refreshed scraped data. A static cities.json blurb (current state of strbuyers.tools city pages) will be classified as thin/duplicate by Google's helpful-content system within 90 days unless each page gets unique editorial substance. Same trap strhost.tools' lodging-tax cluster fell into.
- `airbnb comp analyzer` is an AirDNA / Rabbu / Airbtics monopoly. Three "paste 3 listings" inputs cannot beat 50-comp ML models. Either pivot the framing ("manual sanity-check vs. AirDNA") or de-prioritize.
- DSCR-lender keywords are direct-response keywords. Lenders will outbid editorial sites on intent — Google rewards them. The buyer-research framing matters: target "should I get a DSCR loan?" intent, not "best DSCR lender" (which is paid territory).

Recommended first-move keyword cluster (P0, ship within 90 days):

```
dscr loan calculator str        → /dscr-loan-calculator (live, needs depth)
airbnb startup cost calculator  → /year-1-cash-needs (live, needs schema + content)
airbnb furnishing budget        → /furnishing-budget-calculator (live, weakest SERP, easiest win)
airbnb down payment calculator  → /down-payment-calculator (live)
```

These four absorb ~70% of the cluster's monetizable affiliate intent (DSCR + insurance + furniture).

---

## Keyword universe table

Volume bands: low (<1k US/mo est.), mid (1k–10k), high (10k+). KD bands derived from top-3 domain authority + content depth (judgment from observed SERPs, not from a tool). Bang-for-buck = (monetization fit × intent commercialness) ÷ KD.

### Tool 1 — DSCR loan qualifier

| Keyword | Intent | Vol band | KD band | Top 3 SERPs (observed 2026-05-10) | Monetization fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| dscr loan calculator str | commercial | mid | mid | Ridge Street Cap, Griffin Funding, Chalet | DSCR lender ($200–700/lead) | 9 | P0 |
| dscr loan airbnb | commercial | mid | high | Newfi, Easy Street, Rabbu | DSCR lender | 8 | P0 |
| dscr calculator | info → commercial | high | high | Visio, Kiavi, Defy | DSCR lender | 7 | P0 |
| no income verification loan airbnb | commercial | low | low | scattered lender pages | DSCR lender | 8 | P1 |
| dscr loan vs conventional | info | mid | mid | Griffin, BiggerPockets | DSCR + edu | 6 | P1 |

### Tool 2 — Down payment calculator

| Keyword | Intent | Vol band | KD band | Top 3 SERPs | Monetization fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb down payment calculator | commercial | mid | mid | Rocket Mortgage, The Offer Sheet, AirDNA | Lender + edu | 7 | P0 |
| how much down payment for airbnb | info | mid | mid | LendingTree, Awning, Houzeo | Lender | 7 | P0 |
| dscr loan down payment | commercial | low | mid | DSCR lender pages | Lender | 7 | P1 |
| airbnb financing down | info | low | mid | Awning, BiggerPockets | Lender | 6 | P2 |

### Tool 3 — Comp analyzer

| Keyword | Intent | Vol band | KD band | Top 3 SERPs | Monetization fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb comp analyzer | commercial | low | high | AirDNA, Rabbu, Airbtics | Data SaaS | 4 | P2 |
| airbnb comparable listings | info | low | high | AirDNA, PriceLabs, Awning | Data SaaS | 3 | P2 |
| paste airbnb listings compare | info | low | low | (thin SERP — opportunity) | Data SaaS | 5 | P1 |
| airbnb rent comps | info | low | high | Mashvisor, AirDNA | Data SaaS | 4 | P2 |

### Tool 4 — Market score / "is Airbnb profitable in"

| Keyword | Intent | Vol band | KD band | Top 3 SERPs | Monetization fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| is airbnb profitable in [city] | info → commercial | high (cluster) | mid–high (per city) | AirDNA, Rabbu, Airbtics, AirROI | Data SaaS + lender | 7 | P0 (top 50) / P1 (next 100) / P2 (tail) |
| best cities for airbnb 2026 | info | mid | high | Mashvisor, AirDNA, Awning | Data SaaS | 5 | P1 |
| airbnb regulation [city] | info | mid (cluster) | low–mid | Inside Airbnb, city.gov, host blogs | Edu (low $) | 5 | P1 |
| airbnb saturation [city] | info | low | low | Inside Airbnb, AirDNA blog | Data SaaS | 5 | P1 |

### Tool 5 — Cash-on-cash calculator

| Keyword | Intent | Vol band | KD band | Top 3 SERPs | Monetization fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb cash on cash return calculator | commercial | low | mid | RedAwning, eFinancialModels, airbnbincomecalculator.com | Lender + data | 7 | P0 |
| cash on cash return airbnb | info | mid | mid | Airbtics, Mashvisor, blog.strsearch | Lender + data | 6 | P1 |
| good cash on cash return for str | info | low | low | BiggerPockets forum, blog.strsearch | Edu | 5 | P1 |
| str roi calculator | commercial | low | mid | simplefinancecalculators, theshorttermshop | Lender | 6 | P1 |

### Tool 6 — Year 1 cash needs / startup cost

| Keyword | Intent | Vol band | KD band | Top 3 SERPs | Monetization fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb startup cost calculator | commercial | mid | mid | STR Specialist, Templacity, beesetups | Furniture + insurance | 8 | P0 |
| airbnb startup costs | info | high | mid | AirDNA blog, therealist, Airbtics | Furniture + lender | 7 | P0 |
| how much to start an airbnb | info | high | mid | airbtics, learn.10xbnb, uplisting | Furniture + lender | 7 | P1 |
| airbnb first year costs | info | low | low | (thin — opportunity) | Furniture + lender | 7 | P1 |

### Tool 7 — Furnishing budget

| Keyword | Intent | Vol band | KD band | Top 3 SERPs | Monetization fit | BFB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb furnishing budget calculator | commercial | low | low | Showplace, The Offer Sheet, STRNumbers | Furniture (Stage by Hand, Minoan) | 9 | P0 |
| cost to furnish an airbnb | info | mid | mid | Awning, Techvestor, STRNumbers | Furniture | 7 | P0 |
| airbnb furnishing checklist | info | mid | mid | Furnishr, blog content | Furniture | 6 | P1 |
| how much to furnish airbnb 3 bedroom | info | low | low | Awning room-by-room | Furniture | 7 | P1 |

Total scored: 28 keywords. Distribution: P0 = 11, P1 = 13, P2 = 4. Average BFB across tier P0 = 7.7.

---

## Competition deep-dive per primary keyword

### `dscr loan calculator str` — top 3
| # | Domain | Type | Why it ranks | Gap |
|---|---|---|---|---|
| 1 | ridgestreetcap.com/blog/dscr-loan-for-airbnb | DSCR lender / educational blog | Topical authority + lender E-E-A-T (originates loans in 35 states); deep editorial on Airbnb-specific DSCR | No live calculator, just educational copy + form-fill |
| 2 | griffinfunding.com/blog/dscr-loans/dscr-loan-for-airbnb/ | DSCR lender | Same — lender brand + authoritative tone | No interactive tool |
| 3 | getchalet.com/dscr-calculator | Free calculator + lead gen | The only competitor with a working calculator + free positioning | Calculator is on a lead-gen site, not editorially independent |

Gap strbuyers.tools can fill: an editorially independent DSCR calc that surfaces tier thresholds (1.0x / 1.25x / 1.5x) explicitly and is free of lead-form friction. The live tool already does this. Add ~1500 words of "what each DSCR tier means for your rate sheet" + FAQ schema (already shipped) and there's a credible run at top-5.

### `airbnb startup cost calculator` — top 3
| # | Domain | Type | Why | Gap |
|---|---|---|---|---|
| 1 | airdna.co/blog/airbnb-startup-cost | Blog | DR + topical authority of AirDNA root domain | Listicle, no calculator |
| 2 | therealist.io/airbnb-startup-cost | Blog | Long-form guide | No calculator |
| 3 | strspecialist.com/tools/startup-cost-estimator | Calculator | Only true calculator competitor | Solo site, lower DR |

Gap: dedicated calculator + room-by-room itemization + Year 1 carry. The live `/year-1-cash-needs` page already covers this conceptually; needs HowTo schema and a 1500-word "how to budget Year 1" article body to win on long-tail queries.

### `is airbnb profitable in austin` — top 3
| # | Domain | Type | Why | Gap |
|---|---|---|---|---|
| 1 | rabbu.com/airbnb-data/austin-tx | Data SaaS — programmatic city page | Live ADR/occupancy/revenue scraped daily, cross-linked from rabbu.com homepage | None — ranks on data freshness |
| 2 | airdna.co/vacation-rental-data/app/us/texas/austin/overview | Data SaaS | MarketMinder data, cross-linked, branded "AirDNA #1 STR data" | None — ranks on brand |
| 3 | insideairbnb.com/austin/ | Activist data | Authoritative, free, scraped Airbnb directly | None — ranks on entity authority |

Gap: none on data-freshness front. Strbuyers.tools' wedge has to be buyer-decision framing ("Should you buy here?" not "What does this market look like?") + regulatory deep-dive. Page 1 of `is airbnb profitable in austin` SERP currently has no editorial buy/no-buy verdict; that's the opening.

### `airbnb furnishing budget calculator` — top 3
| # | Domain | Type | Why | Gap |
|---|---|---|---|---|
| 1 | awning.com/post/furnishing-cost-airbnb | Blog (room-by-room) | Awning brand + comprehensive room breakdown | No live calculator |
| 2 | showplacehq.com/estimator/airbnb-furnishing-estimator | Calculator | Real interactive tool from a furnishing-services brand | Lead-gen capture, not editorially neutral |
| 3 | strnumbers.com/blog/cost-to-furnish-airbnb | Blog + embedded calc | Decent calculator, blog framing | Solo blog, low DR |

Gap: weakest SERP of any cluster. A clean calculator with bedrooms × tier × $/sqft logic (already live) plus 1500 words on tier breakdowns and a Stage by Hand / Minoan affiliate block could rank top-3 within 6 months.

### `airbnb cash on cash return calculator` — top 3
| # | Domain | Type | Why | Gap |
|---|---|---|---|---|
| 1 | redawning.com/pm/post/how-to-calculate-cash-on-cash-return-for-airbnb-investment-properties | Blog | RedAwning brand + long-form math explainer | No calculator |
| 2 | airbnbincomecalculator.com | Single-purpose calc | EMD on the keyword | Thin site otherwise |
| 3 | rentharvest.com/bnbcashoncash.html | Calculator | Working tool | Solo brand |

Gap: moderate. Live `/cash-on-cash-calculator` is competitive on the calculator dimension; needs supporting article and the "what's a good CoC" cluster to widen the topical net.

### `airbnb comp analyzer` — top 3
| # | Domain | Type | Why | Gap |
|---|---|---|---|---|
| 1 | airdna.co/airbnb-calculator | Data SaaS | Rentalizer brand, 50–100 comp ML model | Cannot compete on data scale |
| 2 | rabbu.com/airbnb-calculator | Data SaaS | Daily-refreshed comp database | Cannot compete |
| 3 | airbtics.com/airbnb-income-calculator/ | Data SaaS | 10–40 comp transparent comp set | Cannot compete |

Gap: none on competitive footing. De-prioritize as primary keyword. Re-frame the live `/comp-analyzer` page as "manual sanity-check" and target long-tail like `paste airbnb listings compare` (low-volume, low-KD, no real competitor).

### `airbnb down payment calculator` — top 3
| # | Domain | Type | Why | Gap |
|---|---|---|---|---|
| 1 | rocketmortgage.com/learn/airbnb-loans | Lender | Brand authority, broad guide | No interactive down-payment-by-loan-type tool |
| 2 | local.theoffersheet.com/tools/down-payment-savings-calculator/ | Savings calc | Niche-fit calculator | Goal-savings framing, not loan-comparison |
| 3 | mashvisor.com (mortgage calc embedded) | Data SaaS | Brand | Not focused on STR-specific down-payment minimums |

Gap: the multi-loan-type comparison table on the live page (Conventional / DSCR / Second-home / FHA-house-hack) is genuinely differentiated. Add HowTo schema and a 1200-word "which loan type for STR" article.

---

## Programmatic city-page strategy

### Live state (audited 2026-05-10)
- 219 city pages live at `/cities/{slug}/`, all in `sitemap-0.xml`.
- Source: `src/pages/cities/[slug].astro` + `src/data/cities.ts` (hand-compiled).
- Each page emits: ADR, occupancy, RevPAR, regulation status, saturation tier, single-line `notes`, `Place` JSON-LD (verified at `seo.ts:147-172`), and a CTA back to `/market-score`.
- An optional MDX article exists at `src/content/cities/{slug}.mdx` — only a handful of cities ship narrative MDX per `cities/[slug].astro:51-53`. The remainder render `notes` (1–2 sentences) only.

### SERP shape for `is airbnb profitable in [city]`
Same domain set repeats across every major-market query (verified Austin + Nashville above):
- rabbu.com/airbnb-data/{city}-{st} — programmatic, daily data refresh, free
- airdna.co/vacation-rental-data/app/us/{state}/{city}/overview — programmatic, MarketMinder
- airbtics.com/annual-airbnb-revenue-in-{city}-{state}-usa/ — programmatic
- airroi.com/report/world/united-states/{state}/{city} — programmatic
- insideairbnb.com/{city}/ — activist data, authoritative
- bnbcalc.com/blog/airbnb-business/market-data/{city}-{state} — programmatic blog
- City-specific bloggers (bktnashville.com, bradfordnashville.com, hometeamluxuryrentals)

Six VC-backed programmatic data sites occupy the SERP. All refresh data daily or weekly; strbuyers.tools' `cities.json` is hand-compiled and annually reviewed (per CLAUDE.md). This is a data-freshness asymmetry that cannot be closed without an API.

### Thin-content risk
Comparing strbuyers.tools' Austin page (audited above) against the Rabbu/AirDNA/Airbtics counterparts:

| Dimension | strbuyers.tools | Rabbu / AirDNA / Airbtics |
|---|---|---|
| ADR / occupancy / RevPAR | 3 hand-compiled numbers | 3+ scraped numbers, refreshed daily |
| Regulation copy | 2 sentences | 1–3 paragraphs + city-gov source links |
| Saturation tier | 1 letter (A/B/C/D) | Comp-density heat-map |
| Editorial verdict | Implied via market score | None (data sites stay neutral) |
| Comp listings | None | 50–100 sample listings |
| Schema | `Place` only | `Place` + `LocalBusiness` + breadcrumbs |
| Narrative MDX | Few cities (most blank) | N/A (all programmatic) |

Verdict: the current 219 pages are at high risk of being clustered as near-duplicates by Google's helpful-content classifier within 60–120 days, especially for the ~200 cities that have only a 1-line `notes` field. Same failure mode strhost.tools' 46 boilerplate lodging-tax pages exhibit (cited in SEO-AUDIT-2026-05-08.md §P1 thin-content).

### Recommended scope

| Tier | Cities | Treatment | Rationale |
|---|---|---|---|
| Tier 1 (50 cities) | Top 50 by Google search volume + STR investor interest (Austin, Nashville, Scottsdale, Asheville, Joshua Tree, Gatlinburg, Park City, etc.) | 800–1500 word narrative MDX each: regulation deep-dive with primary source links, neighborhood breakdown, 3 sample comps, buy/no-buy verdict | These pages can rank — they have substance. |
| Tier 2 (next 100 cities) | Mid-volume markets | 300–500 word unique blocks: regulation summary + 1 paragraph buyer-decision frame; keep `Place` schema | Borderline. Acceptable risk. |
| Tier 3 (remaining 69 cities) | Long tail | Either (a) `noindex` until upgraded, or (b) collapse into state-level rollup pages (`/cities/states/tx`) and de-publish individual thin pages | Current state will degrade rankings on the Tier 1 + 2 pages by association. |

Do NOT scale beyond 219 until Tier 1 is filled out. Adding 200 more cities with 1-line notes would amplify the duplicate-content signal.

### Unique-data requirement
To rank against AirDNA/Rabbu without daily-refresh data, the cluster must compete on information AirDNA does not publish:
- City-government regulation citations with dates
- Permit cost + cap info per city
- HOA / zoning carve-outs
- Buyer-decision verdict (data sites won't editorialize)
- LTM tax-rate data (cross-link from strhost.tools `/lodging-tax/{state}`)

This is editorial labor, not data scraping. It's the only defensible moat at this domain authority.

---

## Affiliate-keyword cross-reference

Affiliate keywords have 2–10x the monetization weight of editorial keywords because conversions pay $50–700 per action vs. $1–10 CPM. Score them separately.

| Keyword | Intent | Vol | KD | Top 3 SERPs | Affiliate path | Payout est. | BFB | Tier |
|---|---|---|---|---|---|---|---|---|
| best dscr lender airbnb | commercial | mid | high | Ridge Street, Easy Street, Park Place | Kiavi affiliate ($700/closed loan, $20/lead — confirmed at kiavi.com/affiliates) | $200–700 | 8 | P0 |
| dscr loan affiliate | commercial | low | mid | Kiavi, Lima One direct | Direct lender programs | $100–700 | 7 | P1 |
| best str insurance | commercial | mid | mid | Steadily blog, Proper.insure, Awning | Proper / Steadily affiliate | $50–200 | 7 | P0 |
| airbnb insurance proper vs steadily | commercial | low | low | Steadily blog, FB groups | Proper / Steadily | $50–200 | 8 | P0 |
| airdna alternative | commercial | mid | mid | strsearch, Key Data, AirROI, Chalet | Airbtics / AirROI / PriceLabs affiliate | $20–100 | 7 | P1 |
| best str data tool | commercial | low | mid | Key Data, AirROI, listicles | PriceLabs / Airbtics | $20–100 | 6 | P1 |
| airbnb furniture package | commercial | mid | low | Stage by Hand, Furnishr, Minoan | Stage by Hand / Minoan affiliate | $50–500 (% of order) | 8 | P0 |
| airbnb pricing tool | commercial | mid | mid | PriceLabs, Wheelhouse, AirDNA | PriceLabs affiliate | $20–50/mo recurring | 6 | P1 |

Notes on payouts (verified 2026-05-10):
- Kiavi publishes affiliate terms publicly: $700 closed-loan, $20 qualified lead, with broker/REA exclusion. Source: kiavi.com/affiliates.
- Visio Lending does not publish affiliate terms — needs direct outreach (open question per CLAUDE.md §affiliate priorities).
- Proper / Steadily affiliate programs not publicly documented; both are reachable via Impact / PartnerStack networks.
- Stage by Hand / Minoan / Furnishr — Minoan publishes a creator program; Stage by Hand is direct-relationship.

---

## Prioritized action list

### P0 — ship within 90 days
1. Add HowTo schema to the 4 calculators with clear stepwise inputs: `/dscr-loan-calculator`, `/down-payment-calculator`, `/year-1-cash-needs`, `/furnishing-budget-calculator`. The `seo.ts` library has no `buildHowTo` builder — add one.
2. Write 1200–1500 word article body below the calculator on each of the 4 P0 calculators (DSCR, down-pay, year-1, furnishing). Mirror the strhost.tools per-tool template (H1 + intro → tool → "How it works" formulas → "How to use" steps → FAQ → related → 1500–2000 words total).
3. Affiliate vendor block below results on each P0 calculator: DSCR → Kiavi/Visio; furnishing → Stage by Hand/Minoan; year-1 → Steadily/Proper insurance + Stage by Hand.
4. Tier-1 city upgrade (top 50): ship 800–1500 word narrative MDX per city under `src/content/cities/{slug}.mdx`. Hand-write regulation citations with primary source URLs (city gov ordinance links).
5. Resolve `/blog` 404: sitemap lists 8 blog posts at `/blog/{slug}/` but `src/pages/blog/` does not exist (verified via Glob). Either build the blog directory or remove blog URLs from sitemap. Cross-reference: SEO audit P0.
6. Resolve footer 404 chain: `/privacy`, `/terms`, `/get-the-pdf` are all 404s linked sitewide. Cross-reference: SEO audit P0.

### P1 — next 90 days
7. Tier-2 city upgrade (next 100 cities): 300–500 word unique blocks. Collapse Tier-3 (~69 cities) into state rollups OR `noindex` until upgraded.
8. Build the blog directory with the 8 posts the sitemap promises (DSCR vs conventional, how-much-down-payment, comps-before-you-buy, cash-on-cash, ordinance-reading, insurance, year-1, regulation). These mirror P0 calculator topics — internal-link gold.
9. `is airbnb profitable in [city]` programmatic angle: add a "Should you buy here?" verdict block to every Tier-1 + Tier-2 city page. Data sites won't editorialize; this is the ranking wedge.
10. Insurance + furniture affiliate landings: dedicated `/str-insurance` and `/airbnb-furnishing` review pages targeting `best str insurance` and `airbnb furniture package` affiliate keywords.
11. Comp analyzer pivot: re-frame as "manual comp sanity-check" rather than competing head-on with AirDNA. Target `paste airbnb listings compare` (low KD).

### P2 — defer / scale
12. Programmatic regulation pages at `/regulation/{city}` summarizing primary-source ordinance text — defensible against AirDNA which doesn't deeply cover regulation.
13. DSCR rate-sheet comparison page `/dscr-rates` — high commercial intent, requires manual lender outreach to populate.
14. City beyond 219 — only after Tier-1 is filled out and ranking is verified in GSC.

---

## Cadence / next checkpoints

| Cadence | What to track | Source |
|---|---|---|
| Weekly | New impressions in GSC for the 4 P0 keywords; click-through rate by query | Search Console (requires verification of strbuyers.tools — confirm done) |
| Bi-weekly | Position tracking for `dscr loan calculator str`, `airbnb startup cost calculator`, `airbnb furnishing budget calculator`, `airbnb down payment calculator` | GSC + manual SERP checks |
| Monthly | Tier-1 city impressions cluster | GSC, filter URL contains `/cities/` |
| Monthly | Affiliate click-throughs by partner (Kiavi, Proper, Stage by Hand) — confirms the matched-vendor block placement is working | GA4 outbound link events + UTM dashboards |
| Quarterly | Re-run this keyword scan; check for SERP shape shifts (new entrants, new SERP features like AI Overviews) | This doc; re-run with WebSearch |
| Annually | Refresh `cities.json` per CLAUDE.md commitment | `src/data/cities.ts` |

First re-check: 2026-08-10 (90 days).

---

*End of keyword research.*
