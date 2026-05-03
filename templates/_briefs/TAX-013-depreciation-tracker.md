# Brief — TAX-013 Depreciation Tracker (5/7/15/27.5/39-year MACRS)

**SKU:** TAX-013
**Catalog #:** 6 (master spec §3.2 A)
**Mode:** Operational (register)
**Tier:** T3
**Fork from:** `build_section_179_planner.py` (asset register pattern) + `build_cost_segregation_diy.py` (depreciation math)
**Filenames:** `TAX-013-depreciation-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Master register of every depreciable asset across the portfolio, with MACRS class assignment, year-by-year depreciation schedule (Year 1 → Year N), and current-year depreciation expense ready to drop into Schedule C/E. Connects to TAX-009 (Section 179) and TAX-010 (cost-seg) — this is the year-over-year ledger.

**See str-tax-context.md** — listed property (vehicles) requires Form 4562 Part V; 50% qualified-business-use test.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (assets tracked, current-year depreciation $, accumulated depreciation, Year-N drop-offs) + → Add Asset |
| 2 | Asset Register | Master register (capacity 100 assets) |
| 3 | Schedule by Year | 27-year matrix: assets down, years across, depreciation $ per cell |
| 4 | Current Year Summary | One row per asset, current-year deduction, Schedule C/E line mapping |
| 5 | Form 4562 Worksheet | Part I (Section 179) + Part II (special depreciation) + Part III (MACRS) + Part V (listed property) |
| 6 | Settings | Property list, MACRS class table, conventions (HY / MQ), active tax year |

## Asset Register columns
A Asset name | B Property (dropdown) | C Date placed in service | D Cost basis | E MACRS class (dropdown: 5 / 7 / 15 / 27.5 / 39 / Land — non-depreciable) | F Convention (HY / MQ) | G Method (200% DB / 150% DB / SL) | H Section 179 taken? ($) | I Bonus depreciation? ($) | J Adjusted basis (formula `=D-H-I`) | K Recovery period (auto from class) | L Salvage value (typically 0) | M Disposition date (blank if active) | N Notes

## Schedule by Year matrix
Cols: Year 1 | Year 2 | ... | Year 27. Rows: each asset. Cell value: depreciation $ in that year per asset's method. Bottom row: total depreciation per year.

Math:
- 5/7/15-yr: 200% DB w/ HY convention switching to SL → use IRS percentage tables (build hardcoded reference table in Settings)
- 27.5-yr (residential rental): SL with MM convention
- 39-yr (commercial / nonresidential): SL with MM convention

## Current Year Summary
One row per asset:
A Asset | B Class | C Date placed in service | D Original basis | E Adjusted basis | F Current-year depreciation (lookup against year matrix using Settings active year) | G Accumulated depreciation through prior year | H Schedule C/E line mapping

Total row at bottom: total current-year depreciation = number to drop on Schedule C line 13 (or Schedule E line 18).

## Form 4562 Worksheet
Layout matches the IRS form sections. For listed property (vehicles), pulls from TAX-001 Mileage Log if available, otherwise manual entry of business-use %.

## Sample data (DEMO)
- 8 assets: 3 properties (27.5-yr buildings — basis $250K each), 1 furniture set (7-yr — $18K), 2 appliances (5-yr — $4K), 1 vehicle (5-yr — $42K, 78% business use), 1 land improvement (15-yr — $12K driveway)
- Schedule by Year shows full 27-year tail
- Current year (year 3 for buildings): $27,272 depreciation portfolio-wide

## Settings
- B5 Active tax year
- B7-B16 Property list
- B18-B30 MACRS class table (class | recovery period | method | convention | percentages by year)
