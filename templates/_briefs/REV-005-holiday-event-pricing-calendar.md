# Brief — REV-005 Holiday + Event Pricing Calendar

**SKU:** REV-005
**Catalog #:** 51 (master spec §3.2 E)
**Mode:** Operational (calendar)
**Tier:** T1
**Fork from:** `build_license_permit_tracker.py` (date-driven register) + REV-002 calendar pattern
**Filenames:** `REV-005-holiday-event-pricing-calendar-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Pre-built calendar of high-rate dates: federal holidays, school breaks (regional), local events the host adds (concerts, marathons, festivals, college games). Per-event lift % for nightly rate, applied to a base. Surfaces the next 12 events sorted by date so the host can verify rates are bumped before peak.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (events in next 30/60/90 days, projected lift $) + → Calendar |
| 2 | Events | Master register of high-demand events (capacity 100) |
| 3 | Year-View Calendar | 12-month grid, events stamped on dates |
| 4 | Upcoming List | Next 30 events sorted by date, with rate-lift recommendations |
| 5 | Settings | Property base rate, region (drives default holidays), active year |

## Events columns
A Date | B End date (for multi-day events) | C Event name | D Type (dropdown: Federal Holiday / School Break / Sporting / Concert / Festival / Convention / Other) | E Region | F Demand lift % (0-100) | G Suggested nightly rate (formula `=Base * (1 + F/100)`) | H Min-night-stay change (Y/N) | I Notes / source URL

## Year-View Calendar
12-month grid. Cells highlighted gold-soft if event falls on that date. Hover-equivalent: bottom legend lists each highlighted date and event name.

## Upcoming List
30 rows of next events from TODAY()+0:
- Date | Days away | Event | Lift % | Suggested rate | Status (dropdown: Rate updated? Y/N) | Notes

Conditional formatting: red rows where days away ≤ 14 AND status = N (urgent — set rates now).

## Sample data (DEMO)
Pre-populated 2026 events: 12 federal holidays (Jan 1, MLK, Presidents, Memorial, July 4, Labor, Columbus, Veterans, Thanksgiving, Christmas, NYE, Easter), 4 school breaks, 6 region-specific (Smokies area: Rod Run Apr/Sep, Dollywood opening, Smoky Mountain Marathon, Christmas in the Smokies). Base rate $185, peak lift 80% (NYE, Labor Day weekend).

## Settings
- B5 Active year
- B7 Property base rate
- B9 Region (dropdown: Northeast / Southeast / Midwest / Southwest / West Coast / Mountain — drives default school break dates)
