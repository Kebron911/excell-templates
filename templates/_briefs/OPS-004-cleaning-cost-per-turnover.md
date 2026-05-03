# Brief — OPS-004 Cleaning Cost per Turnover Tracker

**SKU:** OPS-004
**Catalog #:** 34 (master spec §3.2 C)
**Mode:** Operational (flat log)
**Tier:** T1
**Fork from:** `build_mileage_log.py` (flat log + monthly rollup pattern)
**Filenames:** `OPS-004-cleaning-cost-per-turnover-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Logs every turnover cleaning event with cost, hours, cleaner, and per-property/per-month rollups. Surfaces *true cost per turnover* and *$ per night* so hosts can price the cleaning fee correctly (feeds REV-001 cleaning-fee optimizer).

## Tabs (4)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Welcome + KPIs (avg $/turnover, total YTD, last entry date) + → Add Entry button |
| 2 | Log | Append-as-you-go cleaning event log (capacity 300 rows) |
| 3 | Summary | Per-property + per-month rollup, one bar chart "$ by month" |
| 4 | Settings | Property list, cleaner roster, default rate, active tax year |

## Log columns (row 5 = header, rows 6-305 data)
A Date | B Property (dropdown) | C Cleaner (dropdown) | D Booking ID | E Hours | F Hourly rate | G Flat fee | H Supplies $ | I Total $ (formula `=E*F+G+H`) | J Nights of stay just ended | K Cost per night (formula `=I/J`) | L Notes

## Settings
- B5 Active tax year (default 2026)
- B7 Default hourly rate
- B9-B18 Property list (10)
- B20-B29 Cleaner roster (10)
- Year-end archive table B40:F50 (Year | Turnovers | Total $ | Avg $/turn | Avg $/night)

## Summary tab
- KPI cards: Total turnovers YTD, Total spent YTD, Avg $/turnover, Avg $/night, Most expensive month
- Per-property table (SUMIFS by property)
- Per-month table (12 rows, SUMIFS by month using `Settings!$B$5` for active year)
- BarChart "$ by month" (operational chart pattern)

## Sample data (DEMO)
20 turnover events across 3 properties Jan-Mar 2026, mix of hourly+flat, avg $87/turnover.

## Anti-patterns to avoid
- No `YEAR(TODAY())` — use Settings active-tax-year cell (per str-tax-context.md)
- Dates as real Python `date` objects, not strings
