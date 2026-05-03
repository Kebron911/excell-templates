# Brief — REV-002 Dynamic Pricing Calculator (Season / Day / Event)

**SKU:** REV-002
**Catalog #:** 47 (master spec §3.2 E)
**Mode:** Operational (matrix)
**Tier:** T2
**Fork from:** `build_cleaning_fee_optimizer.py` (rate-engine pattern)
**Filenames:** `REV-002-dynamic-pricing-calculator-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Computes a *suggested nightly rate* per night of a 365-day calendar based on: base rate, season multiplier (4 seasons), day-of-week multiplier, and event lift (concerts/holidays/playoffs). Lets the operator generate a pricing CSV they can paste into Airbnb / VRBO custom-pricing or use as a sanity check against a paid tool (PriceLabs/Wheelhouse).

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (avg rate, peak rate, low rate, RevPAR projection) + → Calendar |
| 2 | Inputs | Base rate, season definitions, DOW multipliers, event multipliers |
| 3 | 365-Day Calendar | One row per night, computed rate |
| 4 | Monthly Summary | Per-month avg + occupancy projection + revenue projection |
| 5 | Settings | Property selector, year, season cutoff dates |

## Inputs tab
- Base rate (input cell — e.g., $185)
- Season multipliers (4 rows): Winter | Shoulder Spring | Peak Summer | Shoulder Fall — each w/ start month/day, end month/day, multiplier (0.7 / 1.0 / 1.4 / 1.0)
- Day-of-week multipliers (7 rows): Mon-Thu typically 1.0, Fri 1.15, Sat 1.20, Sun 1.0
- Event lifts (12 rows capacity): Date | Event name | Multiplier | Notes (e.g., July 4 = 1.5x, Labor Day weekend = 1.4x, local concert = 1.6x)

## 365-Day Calendar
A Date | B Day-of-week | C Season (lookup) | D Season mult | E DOW mult | F Event mult (lookup) | G Suggested rate (`=Base*D*E*F`) | H Override (input) | I Final rate (`=IF(H<>"",H,G)`)

Conditional formatting: green > base * 1.3, gold base ± 30%, red < base * 0.85.

## Monthly Summary
12 rows, cols: Avg rate | Min rate | Max rate | Assumed occupancy % (input) | Projected revenue. BarChart "Avg rate by month" (right of table).

## Sample data (DEMO)
Smokies Ridge Cabin: base $185, 4 seasons, peak summer mult 1.45, 8 events seeded (4th of July, Labor Day, Christmas week, Thanksgiving, Smoky Mtn Marathon, Octoberfest, Valentines, Spring Break). Avg rate $231, peak $389.

## Settings
- B5 Property
- B7 Active year (default 2026 — auto-fills calendar)
- B9-B12 Season name list
