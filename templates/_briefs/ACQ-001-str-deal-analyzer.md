# Brief — ACQ-001 STR Deal Analyzer

**SKU:** ACQ-001
**Category:** Acquisition / Underwriting (master spec §3.2 B #21)
**Tier:** T2
**Etsy price:** $27 (Lite — no stress test, single-scenario only)
**Own-site price:** $47 (Full — stress test + Y1-vs-stabilized toggle + CPA/partner summary)
**Wave:** 3 (build order #3 of the next 12)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Side-Hustle Sam scaling to property #2-3 — needs a 10-minute yes/no without firing up AirDNA.
**Secondary:** Semi-Pro Sarah evaluating acquisitions — runs this 5-10× across listings before pulling the trigger.
**Tertiary:** Newbie Nina — uses to validate her first deal alongside #31 Cost-to-Launch.

## The one specific pain

"I'm looking at three Zillow listings tonight. I need a yes/no on each in 10 minutes. AirDNA wants $40/property, BiggerPockets calculator is built for LTR, and the BPCalc spreadsheets I downloaded last year are now broken from a column rename."

## What this template does

A single-property underwriting workbook that:
1. Takes 25 inputs across 4 categories (property, market, costs, finance) and returns a yes/no verdict
2. Stress-tests against a downside scenario (ADR -10%, occupancy to 55%, expenses +20%) — addresses the AirDNA-optimism trap
3. Toggles between Y1 (depressed first-year occupancy) and stabilized year math
4. Outputs a 1-page CPA/partner summary suitable for emailing to a spouse or accountant

## Lite vs Full

**Lite (Etsy $27):** Property + Market + Costs + Finance + Verdict. Single-scenario, no stress test, no Y1-vs-stabilized toggle, no printable summary tab. Covers ~70% of the use case for $27.

**Full (Own-site $47):** Adds Stress Test tab + Y1/Stabilized toggle on Verdict + CPA/Partner Summary printable tab. Welcome-tab upgrade banner messaging differs.

## Sheets / Tabs (Full = 7)

| # | Tab | Role | Lite |
|---|---|---|---|
| 1 | Start | Cover + verdict at-a-glance | ✓ |
| 2 | Property | Address, beds/baths, type, sqft, year built | ✓ |
| 3 | Market | ADR (paste from AirDNA + override), occupancy, comp ADR | ✓ |
| 4 | Costs | Operating costs (uses FIN-002 cost structure) | ✓ |
| 5 | Finance | Down pmt, loan terms, closing, rehab | ✓ |
| 6 | Verdict | Y1 vs Stabilized toggle, headline output, stress test | ✓ (Lite: single scenario only) |
| 7 | CPA/Partner Summary | 1-page printable | ✗ Full only |

## Inputs

**Property:** address, city/state/zip, type (dropdown: Single-family / Cabin / Condo / Multi-unit / Glamping / Other), beds, baths, sqft, year built, lot type (urban / suburban / rural), key amenities (hot tub / pool / view — checkboxes for ADR adjustment).

**Market:** ADR base (manual or paste), comp ADR (3 nearby comps' avg, manual), stabilized occupancy %, Y1 occupancy % (default 65% of stabilized), avg LOS, peak/off-peak split %, seasonality factor (default 1.0).

**Costs:** mortgage interest (calculated from finance section), property tax, insurance, HOA, utilities total/mo, internet/mo, software/mo, cleaning per turnover, supplies per turnover, management fee %, marketing/yr, maintenance reserve % of revenue (default 5%), capex reserve % of revenue (default 3%), platform commission % (default 15%), other.

**Finance:** purchase price, down pmt %, loan amount (auto), interest rate, term (years), closing costs $, rehab budget $, furnishing budget $.

## Outputs

**Verdict tab — the headline block:**
- Year-1 cash flow / Stabilized cash flow (toggle B5)
- Cash-on-cash return % (NOI / total cash invested)
- Cap rate %
- DSCR (NOI / annual debt service)
- IRR over 5 years (assuming 3% appreciation)
- Verdict string:
  - ✅ DEAL — if stabilized cash-on-cash > 8% AND DSCR > 1.25
  - ⚠ MARGINAL — if stabilized cash-on-cash 4-8% OR DSCR 1.05-1.25
  - ❌ PASS — if stabilized cash-on-cash < 4% OR DSCR < 1.05

**Stress Test (Full only):**
3 scenarios side-by-side: Base / Down-10% (ADR -10%) / Stress (occ to 55% AND ADR -10% AND expenses +20%). Each shows: NOI, cash flow, DSCR, cash-on-cash. Verdict re-evaluated in stress column with red/yellow/green.

**Start tab at-a-glance:**
- Property name + address (pulled)
- Verdict (large gold/red/green)
- Y1 cash flow / Stabilized cash flow side-by-side
- Stress-test verdict (Full): "✅ Survives stress" / "⚠ Marginal under stress" / "❌ Fails under stress"

**CPA/Partner Summary (Full only):**
- 1-page printable, portrait letter
- Property + key terms
- 5-year pro-forma table (revenue / expenses / NOI / debt service / cash flow / cumulative)
- Verdict + stress test result
- Notes section for buyer's underwriting commentary

## External data references

- AirDNA (manual paste — workbook does not query)
- IRS Schedule E categories on costs (consistent with TAX-002)
- Reference: BiggerPockets STR cash-on-cash benchmark (>8% strong, 4-8% marginal, <4% weak — cited on Verdict tab)

## Business logic

- **Stress test is the differentiator.** Most deal analyzers shipping on Etsy use AirDNA's median ADR/occ as inputs and call the deal "good." Real STR underwriters stress to AirDNA's 25th percentile or worse. We bake that in.
- Y1 vs Stabilized toggle prevents the most common buyer mistake: assuming Y1 occupancy = stabilized occupancy. Default Y1 = 65% of stabilized (BiggerPockets community consensus, cited).
- Cash-on-cash = (Y1 NOI - debt service) / total cash invested (down + closing + rehab + furnishing + Y1 reserve).
- DSCR = NOI / annual debt service (interest + principal). Use loan amortization formula.
- IRR assumes 3% appreciation, 6% sell costs, 5-year hold. Editable assumption cells on Verdict tab.
- Capacity: single property per workbook (this is wizard mode). Multi-property comparison is separate SKU #22.
- Platform commission 15% default — adjustable for direct bookings.

## QA sample data

3-bed cabin in Gatlinburg:
- $485K purchase, 25% down ($121,250), 30-yr at 7.0%, $9K closing, $35K rehab, $25K furnishing
- ADR $285 (paste), comp avg $268, stabilized occ 68%, Y1 occ 44%, LOS 3.4
- Costs: $5,800 tax, $3,400 insurance, $0 HOA, $200 util, $80 internet, $40 PMS, $185/turnover cleaning, $35/turnover supplies, 0% mgmt, $1,200 marketing, 5% maint, 3% capex, 15% platform

Expected outputs:
- Y1 cash flow: ~$3,200
- Stabilized cash flow: ~$18,400
- Stabilized cash-on-cash: ~10.0%
- DSCR: ~1.41
- Verdict: ✅ DEAL
- Stress test: Down-10% → still positive ($9.8K cash flow, ✅); Full stress → -$3.4K, ⚠ Fails

## Upgrade CTA

Start tab (Lite version): "Need stress testing + Y1/stabilized toggle + CPA-ready summary? Upgrade to Full at thestrledger.com/deal-analyzer-full — $47."

Start tab (Full version): "Underwriting multiple properties? Get the 3-Property Side-by-Side at thestrledger.com — $67, or grab the Acquisition Bundle for $147."

## Out-of-scope

- Live AirDNA API integration (manual paste only)
- Multi-property side-by-side (separate SKU #22)
- Refi-or-sell exit analysis (separate SKU #68)
- Mid-term-rental fallback (covered in #70 Arbitrage)
- Tax depreciation modeling (TAX-006 / TAX-010 territory)

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `ACQ-001-str-deal-analyzer-DEMO.xlsx` + `-BLANK.xlsx` (Full); `ACQ-001-str-deal-analyzer-lite.xlsx` (Lite)
- Mode: Wizard (one fill per property under consideration)
- Tab colors: Start = `COLOR_PRIMARY`; Property/Market/Costs/Finance = `COLOR_SECONDARY`; Verdict = `COLOR_ACCENT`; CPA Summary = `COLOR_PARCHMENT_ALT`
- Single build script with `is_lite` and `variant` flags emits all 3 files.

### Sheet 1 — Start
`apply_brand_header(ws, "STR Deal Analyzer", "Yes-or-no on a property in 10 minutes.")`. SKU tag "ACQ-001 · v1.0".

Verdict block rows 8-16:
- Row 8: property name + address (italic gold pulled from Property tab)
- Row 10: "VERDICT" Georgia 14pt bold; Row 11: ✅/⚠/❌ + verdict string 36pt bold gold
- Row 13: Y1 / Stabilized side-by-side cash flow (2 cells, 18pt bold)
- Row 15 (Full): "STRESS TEST: <pass/marginal/fail>" 14pt bold

Pseudo-button row 18: → Property · → Market · → Costs · → Finance · → Verdict · → CPA Summary (Full)

Row 21: upgrade banner.

### Sheet 2 — Property
Wizard-style flattened layout per Welcome Book v2.1 pattern. Section banner "PROPERTY". Inputs rows 8-22.

### Sheet 3 — Market
Section banner "MARKET ASSUMPTIONS". Rows 8-18 inputs. Row 20: "Paste from AirDNA" callout box w/ instructions.

### Sheet 4 — Costs
Section banner "OPERATING COSTS". Rows 8-30 inputs. Cost structure mirrors FIN-002 + TAX-002 column shape so customer can paste between SKUs.

### Sheet 5 — Finance
Section banner "FINANCING". Rows 8-18 inputs. Row 20: amortization-derived monthly + annual debt service (formula display).

### Sheet 6 — Verdict
Tab color `COLOR_ACCENT`. Layout:
- Row 5: Y1 / Stabilized toggle (data validation list `"Year 1,Stabilized"` cell B5; downstream formulas pivot off this)
- Row 7: KEY METRICS Georgia 14pt
- Rows 8-13: cash flow / cash-on-cash / cap rate / DSCR / 5-yr IRR / break-even occ — formulas
- Row 15: VERDICT block (large gold, conditional fill)
- Row 17 (Full only): STRESS TEST band
- Rows 18-22: 4-col table (metric / Base / Down-10% / Full Stress) with conditional formatting per cell

### Sheet 7 — CPA/Partner Summary (Full only)
Tab color `COLOR_PARCHMENT_ALT`. Print area A1:E40, portrait letter.
Sections: header (property + analysis date), key terms table, 5-year pro-forma (revenue / expenses / NOI / debt service / cash flow / cumulative cash), verdict, notes box. Single signature line at bottom.
