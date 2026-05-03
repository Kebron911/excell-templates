# Brief — REV-001 Cleaning Fee Optimizer

**SKU:** REV-001
**Category:** Pricing / Revenue Management (master spec §3.2 E #50)
**Tier:** T2
**Etsy price:** $27 (Lite — single-LOS scenario, no Airbnb-search-impact estimate)
**Own-site price:** $37 (Full — LOS sensitivity + search-rank estimate)
**Wave:** 3 (build order #8 of the next 12)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Side-Hustle Sam — has heard "cleaning fees hurt your search rank" and wants the math.
**Secondary:** Semi-Pro Sarah — runs across portfolio; the answer differs by property LOS profile.
**Tertiary:** Newbie Nina launching — sets her cleaning-fee strategy from day one. *(TikTok-virality candidate — "I changed my cleaning fee and made $3,840 more.")*

## The one specific pain

"Airbnb says high cleaning fees lower my ranking. But I pay my cleaner $185 and Airbnb takes a fee on the cleaning collected too. Should I roll some into the nightly rate? My nightly rate already feels high."

## What this template does

A pricing-decision workspace that:
1. Compares 3 cleaning-fee strategies side-by-side (Full fee charged / Partial bundle 50% / Fully bundled into rate)
2. Reuses **FIN-002 break-even formulas** for the per-night profit math
3. Adds **LOS sensitivity** — answer flips by short vs long stays
4. Includes **Airbnb search-rank impact estimate** (real, documented in Airbnb's published ranking factors — cleaning-fee-to-nightly ratio above 30% triggers a search penalty)
5. Outputs a single recommendation: "Bundle X% of cleaning into nightly rate → +$Y/year, +Z% search visibility est."

## Lite vs Full

**Lite (Etsy $27):** Inputs + 3-strategy compare + recommendation. Single avg-LOS only. No search-rank estimate. ~70% of value.

**Full (Own-site $37):** Adds LOS sensitivity (1-2 / 3-4 / 5+ night cohorts) + Airbnb search-rank impact estimate.

## Sheets / Tabs (5)

| # | Tab | Role |
|---|---|---|
| 1 | Start | Recommendation headline + math summary |
| 2 | Inputs | Cleaning cost, current fee, current rate, LOS, monthly bookings |
| 3 | Strategy Compare | 3 strategies side-by-side ($/booking, annual revenue, search impact) |
| 4 | LOS Sensitivity | Same compare across 1-2 / 3-4 / 5+ night cohorts (Full only) |
| 5 | Recommendation | 1-page action plan + rationale |

## Inputs (Inputs tab)

- Property name (free text)
- Cleaning cost paid to cleaner (per turnover, $)
- Current cleaning fee charged to guest (per turnover, $)
- Current nightly rate (ADR, $)
- Avg length of stay (nights)
- Monthly bookings (avg)
- Platform commission % (default 15%)
- LOS distribution (Full only): % bookings at 1-2 nights / 3-4 nights / 5+ nights (must sum to 100%)

## Outputs

**Strategy Compare (Inputs feed all 3 strategies):**
| Metric | Strat A: Full Fee | Strat B: Partial 50% | Strat C: Bundled |
|---|---|---|---|
| Cleaning fee charged | = current fee | = current fee × 0.5 | = $0 |
| New nightly rate | = current ADR | = current ADR + (current fee × 0.5 / avg LOS) | = current ADR + (current fee / avg LOS) |
| Net per booking after platform | formula | formula | formula |
| Annual net (× monthly bookings × 12) | formula | formula | formula |
| Δ vs current strategy | $0 | $X | $Y |
| Search-rank impact (Full only) | "Penalty" if cleaning/nightly ratio >30% | "Mild penalty" 15-30% | "No penalty" <15% |
| Guest-perception note | "Sticker shock at checkout" | "Balanced" | "Higher per-night feels expensive" |

**Search-rank impact estimate:**
Airbnb's documented ranking factor: cleaning-fee-to-3-night-total ratio. Heuristic:
- Ratio < 15% = "No penalty"
- Ratio 15-30% = "Mild penalty (~5-8% visibility loss est.)"
- Ratio > 30% = "Penalty (~10-15% visibility loss est.)"

Footnote: "Airbnb's algorithm is opaque and changes. Estimates are based on host-community testing and Airbnb's published ranking factors as of <date>. Treat as directional, not exact."

**LOS Sensitivity (Full only):**
Same 3-strategy compare repeated 3× for short (1-2 night) / mid (3-4 night) / long (5+ night) bookings. Annual revenue weighted by user's LOS distribution input. Reveals: short stays heavily favor bundling, long stays don't.

**Start tab headline:**
- "Recommended: <strategy name> → +$<X>/year, +<Y>% search visibility est."
- Math summary (Cleaning paid / Cleaning charged today / Implied per-night cleaning subsidy)
- Bold caveat: "Re-run when cleaner rate or ADR changes."

**Recommendation tab:**
1-page action plan:
- The recommended strategy in plain English
- New cleaning fee + new nightly rate
- Expected annual revenue lift
- Implementation note: "Update pricing in your PMS / direct on Airbnb"
- Risks: "Booking pace may shift; re-evaluate after 60 days."

## External data references

- Airbnb's published ranking factors (cleaning-fee-to-stay-cost ratio is documented as a soft signal)
- AirDNA + host community studies on cleaning-fee impact on conversion (cited)

## Business logic

- **Lead with the verdict.** Start tab opens with "+$3,840/year" — math is below.
- Reuses FIN-002 break-even formula structure for net-per-night math (cross-SKU consistency for paste compatibility).
- LOS is the swing variable. 1-night stays: bundling wins big (cleaning fee distributed across few nights = sticker shock). 7-night stays: bundling barely matters.
- Platform commission applied to TOTAL revenue (rate × nights + cleaning) — Airbnb takes a cut of the cleaning fee too.
- Search-rank impact estimate is heuristic, NOT a guarantee. Footer disclaimer required.
- No live cross-SKU links — just paste-compatible column shapes.

## QA sample data

Sample property:
- Cleaning cost paid: $185
- Current cleaning fee: $185 (full pass-through)
- Current ADR: $245
- Avg LOS: 3.2 nights
- Monthly bookings: 8
- Platform: 15%

Strategy A (current Full Fee): cleaning ratio = $185 / ($245×3 + $185) = 20% — "Mild penalty"
Strategy B (Partial 50%): cleaning fee $92.50, ADR adjusted to $274 (+$29 = $92.50/3.2). Ratio drops to ~10%. Annual lift ~$1,920.
Strategy C (Fully Bundled): cleaning $0, ADR $303 (+$58). Ratio = 0%, "No penalty." Annual lift ~$3,840.

Recommendation: Strategy C — bundle fully, +$3,840/yr, +12% est. visibility.

LOS Sensitivity (Full):
- 1-2 night cohort: bundling lifts +$5,200/yr
- 3-4 night cohort: bundling lifts +$3,840/yr
- 5+ night cohort: bundling lifts +$1,100/yr

Weighted by user's LOS distribution (40% / 45% / 15%): blended +$3,920/yr.

## Upgrade CTA

Start tab (Lite): "Want LOS sensitivity + search-rank estimate? Upgrade to Full at thestrledger.com/cleaning-optimizer-full — $37."

Start tab (Full): "Optimizing pricing across the portfolio? Get the Pricing Bundle at thestrledger.com/pricing — $97."

## Out-of-scope

- Dynamic pricing integration (PriceLabs/Wheelhouse — separate SKU #52)
- Multi-property optimization (run per-property)
- VRBO / Booking.com search-rank impact (only Airbnb's algorithm is documented enough)
- Currency support beyond USD

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `REV-001-cleaning-fee-optimizer-DEMO.xlsx` + `-BLANK.xlsx` (Full); `REV-001-cleaning-fee-optimizer-lite.xlsx` (Lite)
- Mode: Wizard
- Tab colors: Start = `COLOR_PRIMARY`; Inputs = `COLOR_SECONDARY`; Strategy Compare/LOS Sensitivity = `COLOR_ACCENT`; Recommendation = `COLOR_PARCHMENT_ALT`
- Single build script with `is_lite` flag emits both.
- SKU tag "REV-001 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Cleaning Fee Optimizer", "The fee strategy that nets you the most.")`.

Headline block rows 8-14:
- Row 8: "RECOMMENDED" Georgia 14pt
- Row 9: strategy name string 28pt bold gold (formula-driven)
- Row 11: "+$XX,XXX/year" 24pt bold
- Row 12: "+XX% search visibility est." italic gold (Full only)
- Row 14: math summary 3-line (cleaning paid / cleaning charged / implied subsidy)

### Sheet 2 — Inputs
Single-page input panel. Section bands:
- Row 7: PROPERTY SCENARIO (gold-soft)
- Rows 8-13: 6 input cells
- Row 15: LOS DISTRIBUTION (Full only)
- Rows 16-18: 3 input cells (must sum to 100%, validation)

### Sheet 3 — Strategy Compare
Tab color `COLOR_ACCENT`. 3-column comparison table.
- Col A: metric label (10 rows)
- Cols B, C, D: Strat A / B / C
- Conditional formatting on annual net row: gold-soft cell with highest value
- Row 18: search-rank impact string per col (Full only) with red/gold/green text color
- Row 20: guest-perception note italic muted

### Sheet 4 — LOS Sensitivity (Full only)
Tab color `COLOR_ACCENT`. 3 stacked compare tables (one per LOS cohort) + a weighted-blended recommendation summary at top.

### Sheet 5 — Recommendation
Tab color `COLOR_PARCHMENT_ALT`. 1-page printable action plan. Print area portrait letter.
