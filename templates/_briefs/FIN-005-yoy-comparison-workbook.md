# Brief — FIN-005 Year-Over-Year Comparison Workbook

**SKU:** FIN-005
**Catalog #:** 18 (master spec §3.2 A)
**Mode:** Operational (matrix comparison)
**Tier:** T2
**Fork from:** `build_pl_single_property.py` (12-col matrix doubled to 24-col current vs prior)
**Filenames:** `FIN-005-yoy-comparison-workbook-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Side-by-side prior-year vs current-year P&L per property. Surfaces: revenue change %, expense category drift, occupancy trend, top-3 movers (favorable + unfavorable). The workbook the host opens at year-end to answer "did 2026 actually go better than 2025, or did it just feel that way?"

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (revenue YoY %, NOI YoY %, top mover, top problem) + → Per Property |
| 2 | Per Property | Per-property prior + current 12-col matrices, deltas |
| 3 | Portfolio Roll-up | All-property totals, prior + current, charts |
| 4 | Top Movers | Top-3 favorable + top-3 unfavorable categories |
| 5 | Settings | Property list, current year, prior year |

## Per Property tab (3 properties as separate sections, or selectable)
For each property:
- Header band with property name
- 4 stacked tables: Revenue (prior 12 cols / current 12 cols), Expenses (prior / current)
- Total rows + delta column ($ + %)

Column structure:
A Category | B Jan PY | C Feb PY | ... M Dec PY | N Total PY | O Jan CY | ... Z Total CY | AA $ Δ | AB % Δ

## Portfolio Roll-up
- Total revenue PY vs CY (one number each, big)
- Total expenses PY vs CY
- NOI PY vs CY
- Per-property contribution chart (stacked bar PY vs CY)
- Per-month line chart (CY vs PY)

## Top Movers
Top-3 favorable expense decreases (or revenue increases): formula sorts deltas, picks top 3.
Top-3 unfavorable: same, descending.
Per row: Category / Property / PY / CY / $ Δ / % Δ / Sentiment marker.

## Sample data (DEMO)
- 3 properties, 2025 vs 2026 (Jan-Mar partial CY)
- Portfolio revenue 2025 $282K, 2026 projected $298K (+5.7%)
- Top favorable: insurance -$1,800 (refinanced policy)
- Top unfavorable: HVAC repair +$3,200 (Lakehouse compressor failure)

## Settings
- B5 Current year
- B7 Prior year
- B9-B18 Property list
