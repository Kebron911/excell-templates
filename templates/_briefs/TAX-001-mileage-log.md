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
