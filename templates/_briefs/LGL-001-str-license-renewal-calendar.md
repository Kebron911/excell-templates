# Brief — LGL-001 STR License Renewal Calendar

**SKU:** LGL-001
**Catalog #:** 57 (master spec §3.2 G)
**Mode:** Operational (register)
**Tier:** T1
**Fork from:** `build_license_permit_tracker.py` (expiration register pattern)
**Filenames:** `LGL-001-str-license-renewal-calendar-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Tracks every STR license, business license, sales tax permit, fire/safety inspection, and lottery-renewal date per property — with countdown to next deadline. Aimed at single/multi-jurisdiction hosts who can't afford to lose their listing because a permit lapsed.

## Tabs (4)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (active licenses, expiring 30/60/90d, fees YTD) + → Add License |
| 2 | Licenses | Master register (capacity 50 licenses across portfolio) |
| 3 | 12-Month Calendar | Forward-looking calendar of upcoming renewal events |
| 4 | Settings | Property list, jurisdiction list, license type list |

## Licenses columns
A License # | B Property (dropdown) | C Jurisdiction (City/County/State, dropdown) | D Type (dropdown: STR Permit / Business License / Sales Tax / Fire Inspection / Lottery / Health / Other) | E Issued date | F Expires date | G Days to expiration (`=F-TODAY()`) | H Status (`=IF(G<0,"⚠ Expired",IF(G<30,"🔴 Critical",IF(G<90,"🟡 Soon","✅ Active")))`) | I Renewal fee | J Process URL | K Renewal lead-time days | L Notes

Conditional formatting on G: red <30, gold 30-90, parchment >90.

## 12-Month Calendar tab
Rolling 12-month grid. Cols = months from current month forward. Rows = each license. Cell shows fee amount on the renewal month. Bottom row: total fees per month.

## Sample data (DEMO)
- 12 licenses across 3 properties in 2 jurisdictions (Sevierville TN + Gatlinburg TN)
- 1 expired (red), 2 critical, 3 soon
- Annual fees ~$680 portfolio-wide

## Settings
- B5-B14 Property list
- B16-B25 Jurisdictions
- B27-B36 License types
- B38 Renewal alert window (default 90 days)
