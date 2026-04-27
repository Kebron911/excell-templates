# Brief — TAX-001 STR Mileage Log

**SKU:** TAX-001
**Category:** Financial / Accounting (master spec §3.2 A #9)
**Tier:** T1
**Etsy price:** $17
**Own-site price:** $17 (same)
**Wave:** 1
**Campaign tagline:** Close your year before April does.

## Target persona

**Primary:** Semi-Pro Sarah — drives between 3-10 properties, misses mileage deductions worth $2-8K/year.
**Secondary:** Side-Hustle Sam — one STR, W2 day job; still drives for supplies and turnovers.

## The one specific pain

"My CPA asked for my mileage log at tax time and I had nothing. I know I drove to the Airbnb 40 times last year plus Home Depot runs plus the airport for guest pickups. I just didn't write it down. I'm probably leaving $3,000 on the table."

## What this template does

IRS-compliant mileage log with auto-calculation at the current IRS standard mileage rate (2026: $0.70/mi, editable cell for future years). Tracks per IRS Publication 463: date, destination, business purpose, miles.

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 1 | Welcome | Cover + IRS compliance note + how-to |
| 2 | Mileage Log | The log — one row per trip |
| 3 | Monthly Summary | Auto: miles + $ deduction per month |
| 4 | YTD Dashboard | Totals, breakdown by purpose |
| 5 | Settings | Editable IRS rate + dropdowns source |

## Inputs (Mileage Log tab)

Date, Property (dropdown), Destination (free text), Business purpose (dropdown: Property inspection / Turnover / Supplies run / Guest transport / Repairs / Meeting cleaner / Other), Start odometer OR Stated miles, End odometer, Notes.

## Outputs

- Calculated Miles (col H): `=IF(AND(E6<>"",F6<>""), F6-E6, IF(G6<>"", G6, 0))`
- $ Deduction (col I): `=H6 * Settings!$B$5`
- ✔ IRS compliance (col K): `=IF(AND(A6<>"",C6<>"",D6<>"",H6>0), "✓", "⚠ missing")`
- Monthly Summary: SUMIFS by month range
- YTD: sum of Monthly row 6-17
- Miles by Purpose: SUMIFS by purpose category

## External data references

- IRS standard mileage rate 2026: **$0.70/mi** (business). Editable on Settings B5.
- Historical rates in Settings rows 8-10 for reference: 2023 $0.655, 2024 $0.67, 2025 $0.70.
- Reference: IRS Publication 463.

## Business logic

- Support BOTH odometer method (start + end) AND stated-miles method (typed). Formula auto-detects.
- Compliance check column flags rows missing required fields (red fill) or complete (green).
- 2000-row capacity.
- Settings tab holds editable rate + property list + purpose list (source for Mileage Log dropdowns).

## QA sample data

20 rows over Jan-Mar 2026, 3 properties (Smokies Ridge, Creek Side, Lakehouse A), mix of purposes.
Expected YTD at Mar 31: ~380 miles, ~$266 deduction.

## Upgrade CTA

On Welcome tab row 19: "Upgrade to the Tax Season Bundle at thestrledger.com/tax-bundle — mileage log + home office deduction + 1099-NEC tracker + Schedule E prep workbook, $147."

## Out-of-scope

- GPS auto-tracking (use MileIQ / Everlance; we're the backup + CPA-ready system)
- Multi-driver support
- Medical/charitable mileage (business only)
- Non-US tax (US Schedule C/E only)

---

## Implementation spec

### Workbook-level
- Filename: `TAX-001-mileage-log.xlsx`
- All tabs tab-color `COLOR_SECONDARY` (Clay Rose — tax/financial)
- Default font: Calibri 11pt body; Georgia for tab titles
- Workbook protection: NONE
- IRS_RATE_2026 = 0.70 (hardcoded in build script as constant)

### Sheet 1 — Welcome

`apply_brand_header(ws, "STR Mileage Log", "Close your year before April does.")`. Freeze A5. Col A = 95.

| Row | Content |
|---|---|
| 5 | "What this covers (IRS Publication 463 compliance)" — Georgia 14pt bold primary |
| 6 | "The IRS requires 4 things on every business-mileage entry: date, destination, business purpose, and miles driven. This log captures all 4 plus odometer readings, property allocation, and calculated $ deduction at the current rate." (wrap) |
| 8 | "How to use" header (Georgia 14pt bold primary) |
| 9 | "1. Open tab 2 (Mileage Log). Fill one row per trip." |
| 10 | "2. Use EITHER odometer columns (E + F auto-calc) OR typed Miles column (G). Formula uses odometer if both are filled." |
| 11 | "3. Choose Property + Business Purpose from dropdowns." |
| 12 | "4. Column K ('✔ IRS') flags incomplete rows — red means audit-risk." |
| 13 | "5. Switch to tab 3 (Monthly Summary) for month-by-month totals." |
| 14 | "6. Switch to tab 4 (YTD Dashboard) for totals + breakdown by purpose." |
| 15 | "7. At tax time: File → Print → select tabs 3 + 4. That's your CPA handoff." |
| 17 | "⚠ IRS rate updates January 1 each year. Current (2026): $0.70/mi. Update cell B5 on the Settings tab each January. Check irs.gov Publication 463." — italic, COLOR_ERROR |
| 19 | `add_upgrade_banner(ws, 19)` |

### Sheet 2 — Mileage Log

`apply_brand_header(ws, "Mileage Log", "One row per trip — odometer or typed miles")`. Freeze A6.

Row 5 `header_row_style` headers: Date | Property | Destination | Business Purpose | Start Odo | End Odo | Miles (typed alt) | Calculated Miles | $ Deduction | Notes | ✔ IRS

Col widths: A=12 B=20 C=28 D=22 E=10 F=10 G=10 H=10 I=12 J=30 K=14.

Capacity rows 6-2005 (2000). Pre-fill rows 6-25 with 20 sample trips.

For every row 6-2005:
- Col H: `=IF(AND(E<i><>"",F<i><>""), F<i>-E<i>, IF(G<i><>"", G<i>, 0))` — format "0"
- Col I: `=H<i>*Settings!$B$5` — format `"$"#,##0.00`
- Col K: `=IF(AND(A<i><>"",C<i><>"",D<i><>"",H<i>>0),"✓","⚠ missing")`

Dropdowns:
- B6:B2005: `=Settings!$E$11:$E$30`
- D6:D2005: `=Settings!$G$11:$G$30`

Conditional formatting K6:K2005:
- "⚠ missing" → red fill `FFCCCC`
- "✓" → green fill `C7EFCF`

Input cells (A-G, J) on sample rows: apply `input_cell_style()`. Formula cells (H, I, K) on sample rows: apply `formula_cell_style()`.

Sample rows 6-25 — 20 trips spread over Jan-Mar 2026:

| # | Date | Property | Destination | Purpose | StartOdo | EndOdo | Typed | Notes |
|---|---|---|---|---|---|---|---|---|
| 6 | 2026-01-05 | Smokies Ridge | Home Depot run | Supplies run | 45120 | 45144 | | Hot tub chemicals |
| 7 | 2026-01-08 | Smokies Ridge | Property inspection visit | Property inspection | 45150 | 45195 | | Quarterly inspection |
| 8 | 2026-01-15 | Creek Side | Knoxville airport guest pickup | Guest transport | 45200 | 45292 | | Airbnb Plus comped ride |
| 9 | 2026-01-20 | Smokies Ridge | Meet new cleaner onsite | Meeting cleaner | 45300 | 45345 | | Onboard Jamie |
| 10 | 2026-02-02 | Creek Side | Turnover walkthrough | Turnover | 45400 | 45490 | | |
| 11 | 2026-02-07 | Lakehouse A | Supplies + inspection | Supplies run | 45500 | 45565 | | |
| 12 | 2026-02-10 | Smokies Ridge | Burst pipe emergency | Repairs | 45600 | 45648 | | Plumber met me |
| 13 | 2026-02-14 | Creek Side | Hot tub service | Repairs | 45700 | 45790 | | |
| 14 | 2026-02-18 | Lakehouse A | Quarterly inspection | Property inspection | 45800 | 45867 | | |
| 15 | 2026-02-22 | Smokies Ridge | Guest pickup airport | Guest transport | 45900 | 45992 | | |
| 16 | 2026-02-28 | Creek Side | Cleaner check-in | Meeting cleaner | 46050 | 46095 | | |
| 17 | 2026-03-05 | Lakehouse A | Lowe's run | Supplies run | 46150 | 46178 | | Bought new kettle |
| 18 | 2026-03-10 | Smokies Ridge | Turnover issue callback | Turnover | 46200 | 46245 | | Guest complaint follow-up |
| 19 | 2026-03-14 | Creek Side | Handyman meeting | Repairs | 46300 | 46349 | | |
| 20 | 2026-03-18 | Smokies Ridge | Property inspection visit | Property inspection | 46400 | 46445 | | |
| 21 | 2026-03-22 | Lakehouse A | Guest transport — late flight | Guest transport | 46500 | 46587 | | |
| 22 | 2026-03-25 | Creek Side | Supplies — Costco | Supplies run | 46650 | 46695 | | |
| 23 | 2026-03-28 | Smokies Ridge | Turnover final check | Turnover | 46800 | 46843 | | |
| 24 | 2026-03-30 | Lakehouse A | Supplies — Target | Supplies run | 46900 | 46928 | | |
| 25 | 2026-03-31 | Smokies Ridge | Month-end inspection | Property inspection | 46950 | 46995 | | |

### Sheet 3 — Monthly Summary

Brand header ("Monthly Summary" / "Auto-calculated from the Mileage Log"). Freeze A6. Col widths 14/14/16/14.

Row 5 styled headers: Month | Miles | $ Deduction | Trip Count.

Rows 6-17 (one per month Jan-Dec):
- Col A: month label (e.g., `"Jan"`, `"Feb"`, ... hardcoded labels)
- Col B: `=SUMIFS('Mileage Log'!$H:$H, 'Mileage Log'!$A:$A, ">="&DATE(YEAR(TODAY()),<m>,1), 'Mileage Log'!$A:$A, "<"&DATE(YEAR(TODAY()),<m+1>,1))` where `<m>` is the month number 1-12
- Col C: `=B<i>*Settings!$B$5` — currency
- Col D: `=COUNTIFS('Mileage Log'!$A:$A, ">="&DATE(YEAR(TODAY()),<m>,1), 'Mileage Log'!$A:$A, "<"&DATE(YEAR(TODAY()),<m+1>,1))`

Row 19 YTD totals: Col A = "YTD Total", Col B = `=SUM(B6:B17)`, Col C = `=SUM(C6:C17)`, Col D = `=SUM(D6:D17)`. Bold, tinted gold fill `FFE9B0`.

### Sheet 4 — YTD Dashboard

Brand header ("YTD Dashboard" / "Totals + breakdown by purpose"). Col widths 32/18/14.

Row 5: "YTD Total Miles:" bold, value `='Monthly Summary'!B19` format "0"
Row 6: "YTD Total Deduction ($):" bold, value `='Monthly Summary'!C19` currency
Row 7: "YTD Trips:" bold, value `='Monthly Summary'!D19`

Row 9: "Miles by Business Purpose" (Georgia 13pt bold primary)
Row 10: headers "Purpose" | "Miles" | "$" (bold)
Rows 11-17: 7 purposes from PURPOSES list. For each row:
- Col A: purpose name
- Col B: `=SUMIFS('Mileage Log'!$H:$H, 'Mileage Log'!$D:$D, A<i>)` format "0"
- Col C: `=B<i>*Settings!$B$5` currency

### Sheet 5 — Settings

Brand header ("Settings" / "IRS rate + dropdowns sources"). Col widths 28/14/6/18/22/6/26.

Row 5: "IRS Rate (per mile, business):" (bold) | B5 = 0.70 (input, format `"$"0.000`)

Row 7: "Historical rates for reference:" (italic)
Row 8: "2023:" | 0.655 format `"$"0.000`
Row 9: "2024:" | 0.67 format `"$"0.000`
Row 10: "2025:" | 0.70 format `"$"0.000`

Row 10 col E: "Property list" (bold)
Rows 11-13 col E: "Smokies Ridge", "Creek Side", "Lakehouse A" (input style)

Row 10 col G: "Purpose list" (bold)
Rows 11-17 col G: "Property inspection", "Turnover", "Supplies run", "Guest transport", "Repairs", "Meeting cleaner", "Other" (input style)
