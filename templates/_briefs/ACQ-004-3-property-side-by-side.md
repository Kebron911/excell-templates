# Brief — ACQ-004 3-Property Side-by-Side Comparison

**SKU:** ACQ-004
**Catalog #:** 22 (master spec §3.2 B)
**Mode:** Operational (calculator)
**Tier:** T2
**Fork from:** `build_str_deal_analyzer.py` (extends single-property analyzer to triple)
**Filenames:** `ACQ-004-3-property-side-by-side-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Triples the STR Deal Analyzer (ACQ-001) into 3 columns side-by-side so the host can compare 3 acquisition candidates head-to-head. Surfaces: which has highest projected NOI, which has highest cash-on-cash, which has fastest break-even, and a "winner per metric" highlight strip.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Hero + 3-card "Property A / B / C" preview + → Compare |
| 2 | Inputs | All 3 properties' inputs side-by-side (purchase price, rehab, projected revenue, expenses) |
| 3 | Underwriting | Computed metrics per property: NOI, cap rate, CoC, DSCR, break-even occupancy |
| 4 | Comparison Matrix | Highlight-the-winner per row (16 metrics) |
| 5 | Decision Notes | Free-form notes per property + final recommendation |

## Inputs tab
3 columns (Property A / B / C). ~25 rows of inputs each:
- Address, beds/baths/sleeps
- Purchase price, down payment %, loan terms, rehab budget, furniture budget
- Projected occupancy, ADR, gross revenue
- Operating expenses (insurance, taxes, utilities, mgmt, cleaning, supplies)
- Annual debt service

## Underwriting tab
Per property, computed metrics:
- Total cash invested (down + rehab + furniture + reserves)
- Projected NOI
- Cap rate
- Cash-on-cash return
- DSCR
- Break-even occupancy %
- IRR (5-year hold projection)
- Cash flow Year 1

## Comparison Matrix
3-column comparison of every metric. Per row, highlight the winning column with gold-soft fill. Bottom: count of "wins per property" → automatic recommendation if one property wins ≥10/16 metrics.

## Sample data (DEMO)
Property A: Smokies Ridge cabin, $485K, projected $96K revenue, NOI $42K, CoC 14%
Property B: Lakehouse, $625K, projected $112K revenue, NOI $48K, CoC 11%
Property C: Creek Side, $360K, projected $72K revenue, NOI $34K, CoC 16%

A wins on most metrics; recommendation: Property A.

## Settings
- B5 Property names (3)
- B7 Active analysis date
- B9 Hold period for IRR (default 5 yrs)
