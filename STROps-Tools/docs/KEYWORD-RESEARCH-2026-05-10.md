# strops.tools — Keyword Research

**Date:** 2026-05-10
**Author:** Claude (Opus 4.7)
**Scope:** Source-grounded keyword opportunity map for strops.tools (operations-cluster sister site to strhost.tools).
**SERP data:** Pulled live via WebSearch on 2026-05-10. Volume bands reasoned from SERP saturation, ad density, autocomplete depth, and PMS-vendor bid patterns — not keyword-tool exports.

---

## 1. Executive summary

**Top 3 opportunities (highest bang-for-buck per workday invested):**

1. **`cost to replace [item] in airbnb`** programmatic cluster — 51 pages already live at `/replace/<item>/`, schema-loaded (HowTo + FAQPage). SERP is AirCover-claim threads on the Airbnb community forum and thin RentalRecon listicles. Real intent, real money. Affiliate-monetizable per item (Amazon, Wayfair, Tuft & Needle). **P0.**
2. **`airbnb maintenance schedule`** + 30 child task pages — competitors (Hometime, Hospitable, Breezeway, Minut) all pitch software in the body. A free generator + per-task cadence pages with no signup wall is a defensible long-tail moat. **P0.**
3. **`airbnb smart lock code generator`** + rolling-vs-static narrative — Airbnb's own integration only supports Schlage/August/Yale and codes are non-customizable. Hosts on RemoteLock, Igloohome, or any keypad-only setup have no native generator. Low volume, very high intent, very low competition. **P1.**

**Biggest risks:**

- The 51-page `/replace/` cluster has the same thin-content failure mode strhost.tools' 46 boilerplate state pages have — only 5 of 51 items have narrative MDX in `src/content/replacement/`. The other 46 will render generic boilerplate.
- The 30-page `/maintenance/` cluster has the same problem — only 5 of 30 tasks have MDX (`dryer-vent-clean`, `gutter-clean`, `hvac-filter-change`, `mattress-flip`, `smoke-detector-test`).
- Affiliate keywords (Hospitable, Hostfully, Breezeway) have strong commercial intent but the SERP is owned by review aggregators (Capterra, HotelTechReport). Breaking in requires original price/feature data, not a generic listicle.

**Recommended first move:** Write 25 short narrative MDX files (200–400 words each) for the unfilled `/replace/` items + 25 for `/maintenance/` tasks. ~50 files of low-effort copy unlocks the entire programmatic surface and resolves the thin-content risk at the same time.

---

## 2. Keyword universe

24 keywords across 4 intent classes. Bang-for-buck = (intent quality x monetization fit) / KD, scored 1–10 (10 = best). Tier P0 = ship now, P1 = next sprint, P2 = strategic.

| # | Keyword | Intent | Vol | KD | Top 3 SERPs | Monetization fit | B/B | Tier |
|---|---|---|---|---|---|---|---|---|
| 1 | airbnb turnover scheduler | tool | low | low | turno.com, nowistay.com, leadduo.io | PMS affiliate (Turno, Hospitable) | 8 | P0 |
| 2 | airbnb cleaner sms template | template | low | low-mid | hosttools.com, txtsquad.com, nowistay.com | Email magnet (Cleaner SOP) | 7 | P0 |
| 3 | airbnb smart lock code generator | tool | low | low | airbnb.com/help, august.com, yalehome.com | Lock affiliate (August, Schlage, RemoteLock) | 9 | P0 |
| 4 | airbnb linen par calculator | tool | low | low | innstyle.com, arkwrighthome.com, hospecobrands.com | Linen affiliate (Arkwright, Standard Textile) | 8 | P0 |
| 5 | how many sheets per bed airbnb | informational | mid | mid | innstyle.com, sunshinelinenservices.com, manhattanmaids.com | Email magnet (Supply Par) | 7 | P0 |
| 6 | airbnb supply restock calculator | tool | low | low | strspecialist.com, awning.com, igms.com | Email magnet + Amazon affiliate | 7 | P0 |
| 7 | airbnb consumables cost per booking | informational | low-mid | low | airhostsforum.com, gosummer.com | Email magnet | 6 | P1 |
| 8 | cost to replace mattress in airbnb | commercial | mid | low-mid | airbnb community, rentalrecon.com, magichelpers.com | Mattress affiliate + AirCover content | 9 | P0 |
| 9 | cost to replace tv in airbnb | commercial | low | low | (no dedicated SERP — generic TV cost pages) | Amazon affiliate (TVs) | 8 | P0 |
| 10 | cost to replace sofa in airbnb | commercial | low | low | (no dedicated SERP) | Wayfair / Article affiliate | 8 | P0 |
| 11 | cost to repaint airbnb | commercial | low | mid | brushandrollpainting.com, sandiegopainting | Lead-gen (painter directories) | 5 | P1 |
| 12 | airbnb damage claim cost | informational | mid | mid | airbnb help, rentalrecon.com, airbnbhell.com | Email magnet (Damage Cost Lookup tool) | 7 | P0 |
| 13 | airbnb maintenance schedule | tool/info | mid | mid | hometime.io, minut.com, breezeway.io, openairhomes.com | Email magnet + maint software affiliate | 9 | P0 |
| 14 | airbnb maintenance checklist | informational | mid-high | high | breezeway.io, minut.com, hospitable.com, oxmaint.com | Email magnet | 6 | P1 |
| 15 | how often change hvac filter airbnb | informational | low-mid | low | thethriftyapartment.com, goldnest.co, airfiltersdelivered.com | Amazon affiliate (filter subs) | 8 | P0 |
| 16 | airbnb smoke detector test frequency | informational | low | low | (no dedicated SERP) | Amazon affiliate (alarms) | 7 | P0 |
| 17 | airbnb gutter cleaning frequency | informational | low | low | (generic home maint SERPs) | Lead-gen (gutter pros) | 5 | P1 |
| 18 | airbnb dryer vent cleaning | informational | low | low | (generic) | Lead-gen + Amazon (vent kits) | 6 | P1 |
| 19 | airbnb cleaning fee calculator | tool | high | high | strhost.tools (sister), turno.com, lodgify.com | (covered by sister — no overlap) | 3 | P2 |
| 20 | airbnb back to back turnover | informational | mid | mid | uplisting.io, micasacleaning, breezeway.io | Email magnet (Cleaner SOP) | 6 | P1 |
| 21 | turno vs hospitable | commercial | mid | mid-high | capterra, hoteltechreport, breezeway.io | Affiliate (Hospitable, Turno) | 7 | P1 |
| 22 | breezeway alternatives | commercial | mid | mid | operto.com, suiteop.com | Affiliate (Operto, Hostfully) | 6 | P1 |
| 23 | hospitable vs hostfully | commercial | mid | mid-high | hospitable.com, hostfully.com, capterra | Affiliate (both) | 6 | P1 |
| 24 | best smart lock for airbnb | commercial | mid-high | high | yalehome.com, august.com, airbnb.com/help | Lock affiliate (high payout) | 7 | P1 |

---

## 3. Competition deep-dive — primary keywords

### `airbnb turnover scheduler` (Tool 1)

| Rank | Domain | Type | Gap we exploit |
|---|---|---|---|
| 1 | turno.com | SaaS marketplace homepage | Sells $8/property/month. Not a free tool. |
| 2 | nowistay.com | Vendor blog (PMS) | Pushes Hostaway/Guesty. No free utility. |
| 3 | leadduo.io | Cleaning-business marketing | Targets cleaners, not hosts. Off-intent. |

**Gap:** No SERP result is a paste-bookings, see-conflicts, free, no-signup tool. Our `/turnover-scheduler/` is exactly that.

### `airbnb smart lock code generator` (Tool 3)

| Rank | Domain | Type | Gap |
|---|---|---|---|
| 1 | airbnb.com/help/article/3481 | Airbnb help docs | Only Schlage/August/Yale; codes non-customizable. |
| 2 | august.com/pages/airbnb | Vendor product page | Sells locks, no generator. |
| 3 | shopyalehome.com/pages/airbnb | Vendor product page | Same. |

**Gap:** Hosts on RemoteLock, Igloohome, or keypad-only setups have no native generator. Our deterministic HMAC-SHA-256 generator (`/smart-lock-codes/`) is the only free utility on the SERP.

### `cost to replace mattress in airbnb` (Cluster, primary item kw)

| Rank | Domain | Type | Gap |
|---|---|---|---|
| 1 | community.withairbnb.com (multiple threads) | UGC forum | Anecdotal, no structured cost ranges or lifespan calc. |
| 2 | rentalrecon.com/host-protection/airbnb-mattress-damage | Affiliate review site | Talks AirCover, not cost. |
| 3 | themagichelpers.com/when-to-replace-airbnb-mattress | Property mgmt blog | Lifespan only, no cost ranges. |

**Gap:** Nobody on SERP gives a clean "$400–$1500, 8-year lifespan, prorate by age" answer with calc. Our `/replace/queen-mattress/` already does.

### `airbnb maintenance schedule` (Tool 7)

| Rank | Domain | Type | Gap |
|---|---|---|---|
| 1 | hometime.io | Property mgmt vendor blog | Free PDF behind email. Beatable on tool quality. |
| 2 | minut.com | Noise-monitor vendor blog | Pitches Minut hardware. |
| 3 | breezeway.io | Ops software vendor | Pitches Breezeway. |

**Gap:** Every result is a vendor blog. None is a calendar generator with .ics export. Our tool is.

### `airbnb linen par calculator` (Tool 4)

| Rank | Domain | Type | Gap |
|---|---|---|---|
| 1 | innstyle.com | Laundry vendor blog | Sells linen service. |
| 2 | arkwrighthome.com | Hospitality linen vendor | Has a calculator — gated, hospitality-scale. |
| 3 | hospecobrands.com | Hospitality supply | Same. |

**Gap:** STR-scale par calculator (1–6 bed properties, not 200-room hotels). No competitor sized for an indie host.

---

## 4. Programmatic angles

Two clusters worth scoring separately. Both use the same `getStaticPaths` + JSON-data pattern strhost.tools used for `/lodging-tax/[state]`.

### Cluster A — `/replace/[item]/` (51 items live)

| Aspect | Assessment |
|---|---|
| Live coverage | 51 items in `src/data/items.json`. Sitemap confirms 52 URLs incl. index. |
| Narrative coverage | 5 of 51 have MDX in `src/content/replacement/` (queen-mattress, sheets-queen-set, smart-lock, sofa-3-seat, tv-55-inch). 46 are boilerplate. |
| SERP shape | Mostly absent — Google has no canonical "cost to replace X in airbnb" answer for ~80% of items. Long-tail wide open. |
| Thin-content risk | **HIGH** if all 46 unfilled pages render identical "Cost: $X-$Y. Lifespan: Yy. Replacement steps." with no narrative. Same failure mode as strhost.tools' 46 lodging-tax boilerplate pages. |
| Monetization | Amazon + Wayfair affiliate per item is natural. Each page = 1 affiliate widget. |
| Schema | HowTo + FAQPage already emitted (`src/pages/replace/[item].astro:55`). Good. |
| Action | Write 200–400-word narrative MDX for top 25 items by guest-damage frequency: queen/king mattress, sheet/towel sets, 50/55/65" TVs, sofas, dishwasher, washer, dryer, microwave, coffee maker, blender, kitchen knives, smart lock, vinyl plank flooring, area rug, blackout curtains, headboard. |

### Cluster B — `/maintenance/[task]/` (30 tasks live)

| Aspect | Assessment |
|---|---|
| Live coverage | 30 tasks. Sitemap shows 31 URLs (index + 30). |
| Narrative coverage | 5 of 30 have MDX. 25 boilerplate. |
| SERP shape | "How often to [task] in airbnb" is a near-greenfield query class. HVAC filter has weak competition; smoke detector, gutter, dryer vent wide open. |
| Thin-content risk | **HIGH** — same as above. |
| Monetization | Amazon affiliate per task (filter subscriptions, smoke alarms, gutter tools). Lower-CPM than `/replace/` but recurring. |
| Schema | HowTo + FAQPage already emitted (`src/pages/maintenance/[task].astro:59`). Good. |
| Action | Write narrative MDX for top 25 unfilled tasks. Match keyword to H1 ("How often to test smoke detectors in an Airbnb"). |

**Combined programmatic action:** ~50 short narrative MDX files = full programmatic surface activated. ~1 full day of writing, or 4 hours with a tight LLM prompt + edit pass.

---

## 5. Affiliate / SaaS-adjacent keywords

Separate scoring table because intent and SERP shape differ (commercial review queries dominated by Capterra and vendor blogs).

| Keyword | Vol | KD | Vendor target | Payout band | B/B | Tier | Notes |
|---|---|---|---|---|---|---|---|
| turno vs hospitable | mid | mid-high | Hospitable, Turno | $30–80/sub | 7 | P1 | Capterra owns rank 1. Beat with side-by-side feature matrix + screenshots. |
| breezeway alternatives | mid | mid | Operto, Hostfully | $50–150/sub | 6 | P1 | Operto.com already ranks. Need original cost data. |
| hospitable vs hostfully | mid | mid-high | Both | $30–100/sub | 6 | P1 | Brand-on-brand SERPs are noisy. |
| best smart lock for airbnb | mid-high | high | August, Schlage, Yale, RemoteLock | $5–25/sale | 7 | P1 | Vendor pages own SERP. Differentiate with "which works WITHOUT Airbnb integration". |
| best noise monitor airbnb | mid | mid | Minut, NoiseAware | $25–80/sale | 7 | P1 | Vendor blogs dominate; vacuum for indie comparison. |
| turnoverbnb alternatives | mid | mid | Operto, Hostfully | $50/sub | 6 | P2 | Aging keyword (Turno rebranded). Decline expected. |
| hostfully review | mid | mid | Hostfully | $80–150/sub | 6 | P2 | Brand SERP — Hostfully owns. |
| properly app review | low-mid | low-mid | Properly (Vrbo) | unclear | 4 | P2 | Properly quiet post-Vrbo acquisition. Skip. |
| best linen for airbnb | mid | mid | Arkwright, Standard Textile | $5–20/sale | 6 | P2 | Low-margin affiliate. Skip until inventory pages exist. |
| airbnb welcome book template | high | high | n/a (strguests sister) | n/a | n/a | n/a | Belongs to strguests.tools. Do not duplicate. |

**Recommended affiliate sequencing:**

1. Land *tool* SERPs first (P0 in §2). Repeat-use tools build email list and brand association.
2. Once the list is 1k+, write comparison posts (turno vs hospitable, breezeway alternatives). They need traffic to convert and traffic comes from §2 wins.
3. `best smart lock` is the highest-payout commercial keyword and a natural follow-on from `/smart-lock-codes/`. Wire an `AffiliateCard` to the tool's footer first; write the post once the tool ranks.

---

## 6. Prioritized action list

### P0 — ship this week

1. **Write 25 narrative MDX for `/replace/[item]/`** (top damage-frequency items). Eliminates the 46-page thin-content risk; activates the entire `cost to replace X in airbnb` SERP surface.
2. **Write 25 narrative MDX for `/maintenance/[task]/`** (top maintenance frequency). Same pattern.
3. **Wire affiliate cards** to the 7 tool pages — `affiliates.json` exists; cards already render on `turnover-scheduler.astro:48`. Audit the other 6 to confirm vendor matches (smart-lock-codes -> August/Schlage; restock-calculator -> Amazon Subscribe & Save; damage-cost-lookup -> AirCover docs link only, no affiliate).
4. **Add `BreadcrumbList` JSON-LD** to `/replace/[item]/`, `/maintenance/[task]/`, `/replace/`, `/maintenance/` index pages. The `breadcrumbJsonLd` helper already exists at `src/lib/seo.ts:96` — just emit it.

### P1 — next sprint

5. **Write `turno vs hospitable` comparison post** as the first SaaS-affiliate piece. Pair with `/cleaner-dispatch/`. Original price/feature matrix; no fluff.
6. **Write `best smart lock for airbnb (without using the airbnb integration)`** post. Pair with `/smart-lock-codes/`. Niche-down the SERP — Airbnb integration only supports 3 brands; cover the rest.
7. **Long-form content for primary tool pages.** `/restock-calculator/` and `/maintenance-schedule/` are short on body copy; expand each to 600+ words for topical authority.

### P2 — strategic / next quarter

8. **Programmatic city pages** — "Airbnb cleaner cost in [city]" using BLS occupational wage data + city-level cleaner-rate forum scrapes. ~50 city pages. Mirror strbuyers.tools' city-data programmatic angle.
9. **YouTube short** for each of the 7 tools. Operations content performs on YT; videos can rank in tool SERPs.
10. **Hostfully + Hospitable affiliate posts** once programs are signed.

---

## 7. Cadence / next checkpoints

| Checkpoint | Date | What to verify |
|---|---|---|
| Programmatic narrative MDX written | 2026-05-17 | 25 replace + 25 maintenance MDX in `src/content/`. Sitemap unchanged. |
| GSC index coverage | 2026-06-10 | All 104 sitemap URLs indexed; no soft-404s on programmatic pages. |
| First top-10 ranking | 2026-07-01 | Track `airbnb smart lock code generator`, `airbnb turnover scheduler`, `cost to replace mattress airbnb`. |
| Second keyword audit | 2026-08-10 | Re-pull SERPs for all P0 keywords; expand or contract based on actual ranking data. |
| Affiliate revenue review | 2026-09-10 | First commission cycle complete. Decide whether to push deeper into PMS-comparison content. |

---

*End of keyword research.*
