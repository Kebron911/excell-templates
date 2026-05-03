# Brief — REV-003 Competitor Rate Tracker

**SKU:** REV-003
**Catalog #:** 48 (master spec §3.2 E)
**Mode:** Operational (matrix log)
**Tier:** T2
**Fork from:** `build_pl_single_property.py` (matrix pattern)
**Filenames:** `REV-003-competitor-rate-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Manual weekly rate-snapshot tool. The host picks 6-10 comp properties on Airbnb/VRBO, snapshots their nightly rate for the next 4 weekends each week, and tracks how the comp set is moving. Surfaces "I'm priced 18% below comp set average" or "comps just raised for July 4 weekend — should I?" — giving Sarah the gut-check she'd otherwise pay PriceLabs $20/mo for.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPI cards (my avg rate, comp set avg, my position) + → New Snapshot |
| 2 | Comp Set | Roster of tracked comps (capacity 10) |
| 3 | Weekly Snapshots | Matrix: weeks down, comps across, rates as cells |
| 4 | Position Trend | My rate vs comp avg over time, line chart |
| 5 | Settings | My property selector, snapshot frequency |

## Comp Set columns
A Comp # | B Listing name (anonymized OK) | C Platform (Airbnb / VRBO) | D Listing URL | E BR/BA | F Sleeps | G Distance from me (mi) | H Note (e.g., "newer hot tub", "lake view") | I Active in tracker? (Y/N)

10 row capacity.

## Weekly Snapshots
Matrix:
- Rows = ISO weeks (52 in a year)
- Cols (left): Week | Date span | My rate | Comp1 | Comp2 ... Comp10 | Comp avg (formula `=AVERAGE(...)`) | My position % (formula `=My/Comp avg - 1`)
- One row per week — host pastes/types competitor rates each Monday

## Position Trend
Line chart "My rate vs comp avg" across weeks. KPI: trailing-4-weeks position %.

## Sample data (DEMO)
- 6 comps tracked (Smokies Ridge area)
- 12 weeks of snapshots Q1 2026
- My avg position: 8% below comp avg (gold-flag — opportunity to lift)

## Settings
- B5 Property
- B7 Active tax year
- B9 Snapshot day (Mon/Tue/...)

## Anti-patterns
No automated scraping (against ToS). The product is a *manual snapshot* tool with brand-grade UI — not a competitor to PriceLabs.
