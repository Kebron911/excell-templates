# Brief — ACQ-007 Furniture / Setup Budget Calculator

**SKU:** ACQ-007
**Catalog #:** 25 (master spec §3.2 B)
**Mode:** Operational (register)
**Tier:** T2
**Fork from:** `build_cost_to_launch.py` (line-item pattern, simpler than rehab)
**Filenames:** `ACQ-007-furniture-setup-budget-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Pre-furnishing budget for a new STR. Walks the host through every room, lists every essential item (with cost benchmarks), and tracks actual vs estimated. Has a 7-year-MACRS-class flag per item — feeds into TAX-013 depreciation. Includes a "first-month operating reserve" line so the host doesn't accidentally spend furniture money on month-1 cleaning.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (budget, spent, room completion %, $ to first stay) + → Room Detail |
| 2 | Room Detail | Per-room item register (capacity 200 items) |
| 3 | Per-Room Roll-up | Per-room totals + completion % |
| 4 | Operating Reserve | Setup-phase operating cost forecast (insurance, utilities, taxes, software for 60 days pre-launch) |
| 5 | Settings | Property name, room list, MACRS class options |

## Room Detail columns
A Item # | B Room (dropdown: Living / Kitchen / Master BR / BR2 / BR3 / Master Bath / Bath2 / Patio/Outdoor / Laundry / Decor / Tech) | C Item | D Description / brand | E Estimated cost | F Actual cost | G Vendor / source | H Status (dropdown: Researching / Ordered / In transit / Installed) | I MACRS class (dropdown: 5-yr / 7-yr / Decor — expense) | J Notes

Capacity: 200 rows.

## Per-Room Roll-up
Each room: total estimate, total actual, item count, completion % (count of Installed / total). Bar chart "$ by room".

## Operating Reserve tab
60-day setup-phase costs (mortgage, insurance, utilities, software subscriptions, marketing prep). 8-row checklist with $ inputs. Total = "$ to first stay" reserve.

## Sample data (DEMO)
Smokies Ridge 4BR cabin furnishing budget:
- 95 line items across 11 rooms
- Total budget $32K, actual $34.5K (+8%)
- Living + Master + Tech = 60% of spend
- Operating reserve: $5,800 (60 days mortgage + insurance + utilities)
- Total $ to first stay: $40.3K

## Settings
- B5 Property name
- B7 Setup start date
- B9 First-stay target date
- B11 Operating reserve days (default 60)
