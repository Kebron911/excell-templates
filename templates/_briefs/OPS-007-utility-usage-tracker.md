# Brief — OPS-007 Utility Usage + Trend Tracker

**SKU:** OPS-007
**Catalog #:** 38 (master spec §3.2 C)
**Mode:** Operational (matrix)
**Tier:** T1
**Fork from:** `build_pl_single_property.py` (12-column matrix pattern)
**Filenames:** `OPS-007-utility-usage-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Tracks monthly utility bills (electric, gas, water, internet, trash, propane) per property in a 12-column matrix. Surfaces $/night, YoY trend, and "anomaly" flags when a month's bill jumps >25% vs prior year — catches leaks, unmonitored loads, and pricing changes.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPI cards (avg $/mo, YTD $, anomaly count) + → Log Bill button |
| 2 | Bills Log | Flat log of every utility bill — Date, Property, Service, $, Usage, Notes |
| 3 | Property Matrix | Per-property pivot: 12 months × 6 services, $ and usage |
| 4 | Trend & Anomalies | Year-over-year % change, anomaly flags |
| 5 | Settings | Property list, service list, active tax year |

## Bills Log columns
A Bill date | B Property (dropdown) | C Service (dropdown: Electric / Gas / Water / Internet / Trash / Propane / Other) | D Period start | E Period end | F $ Amount | G Usage (kWh / therms / gal / GB / etc.) | H Usage units | I $/unit (formula `=F/G`) | J Notes

Capacity: 500 rows.

## Property Matrix tab
For each property (3 sections by default):
- Header band with property name
- 12 columns Jan-Dec, 6 rows (one per service), data via SUMIFS
- Total row + average row
- Mini bar chart "$ by month" for that property

## Trend & Anomalies tab
- Per-property YoY $ comparison (current year via Settings!$B$5 vs prior year)
- Anomaly flag column: `=IF(ABS(current/prior-1)>0.25, "⚠ "&ROUND((current/prior-1)*100,0)&"%", "")`
- Sorted by largest anomaly

## Sample data (DEMO)
3 properties, 6 services, full 2025 + Jan-Mar 2026 = ~84 bills. One anomaly seeded (Property 2 March 2026 water bill 2x prior year — fake leak).

## Settings
- B5 Active tax year
- B7-B16 Property list
- B18-B25 Service list
