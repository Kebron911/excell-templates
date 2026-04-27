# Brief — TAX-007 Per-Diem Meal Deduction Tracker

**SKU:** TAX-007
**Category:** Financial / Accounting (master spec §3.2 A #10)
**Tier:** T1
**Etsy price:** $17
**Wave:** 2 (Tax Season Bundle)
**Mode:** Operational (flat log + summary)
**Campaign tagline:** Track meals deductibly. Don't lose another receipt.

## Target persona

**Primary:** Semi-Pro Sarah — drives between 3-10 STRs, takes meals on the road during inspections / supply runs / cleaner meetings. Sometimes treats a contractor or co-host to lunch.
**Secondary:** Pro Pam — entertains owners and prospects.

## The one specific pain

"I know I can deduct 50% of business meals but I have no clue what counts and I lose half the receipts. Some years I just skip it. I'm leaving $400-1200 on the table."

## What this template does

IRS Pub 463-compliant meal deduction tracker — captures the 5 elements of a deductible meal (date, amount, business purpose, attendees, location), routes between **standard meal allowance (per-diem)** and **actual cost** methods, and applies the correct deduction percentage:
- **50%** — standard business meals (IRC §274(n))
- **100%** — meals provided to employees, meals at company picnics, meals deducted as compensation
- **0%** — entertainment costs (post-2017 TCJA)
- **80%** — DOT hours-of-service workers (rare for STR)

Two methods supported:
1. **Actual cost method** — track every meal, itemize at year-end
2. **Per-diem (M&IE) method** — standard daily rate by city, no receipts under $75 (per IRS regs)

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 0 | Start | Operational hero + activity cards + primary CTA |
| 1 | Meals Log | One row per meal — date, amount, attendees, purpose, % |
| 2 | Per-Diem Log | Daily standard allowance (M&IE rate × travel days × locality) |
| 3 | Monthly Summary | Per-month totals + deduction-percentage breakdown |
| 4 | Settings | Active tax year · per-diem rates by city · classification |

## Inputs (Meals Log tab)

Date, Property/Trip, Location (city, ST), Restaurant, Attendees, Business purpose, Amount $, Tip $, Receipt kept (Y/N), Method (Actual / Per-diem), Deductible % (50/80/100/0).

## Inputs (Per-Diem Log tab)

Date, Travel destination (city), # full days away from tax home, # partial days, M&IE rate, Computed daily $.

## Outputs

- YTD deductible meal $ (Actual)
- YTD deductible meal $ (Per-diem)
- Total deduction = sum of both methods (no double-counting — flag if same date appears in both)
- Per-month chart (column) — meal $ by month
- Donut chart — deduction by purpose (Property inspection / Cleaner / Contractor / CPA / etc.)
- Audit-defense fields per row: receipt kept, attendees, business purpose

## External tax references

- **IRC §274(n)** — 50% meal limitation
- **IRC §274(k)** — meal deduction substantiation
- **Pub 463** — Travel, Gift, and Car Expenses
- **Pub 1542** — Per Diem Rates (superseded by GSA per-diem schedule)
- **GSA per-diem rates** — gsa.gov/travel/plan-book/per-diem-rates

## Business logic

- Two methods cannot apply to the same trip-day (validation flag).
- Travel must be **away from tax home overnight** OR more than 12 hours to qualify.
- "Meals with employees while traveling" = 50%, NOT 100%.
- TCJA (2018+): entertainment is NOT deductible. Meals AT entertainment events are deductible IF separately stated on the receipt.
- Per-diem M&IE rates: $80 for high-cost areas, $59 for low-cost (2026 GSA defaults — editable in Settings).
- All YTD aggregations driven by `Settings!$B$5` (active tax year).

## QA sample data

20 meals over Jan-Mar 2026 — mix of Actual and Per-diem, mix of 50% and 100% (ex: pizza for cleaning crew = 100% as employee meal). Expected YTD ~$680 deductible.

## Out-of-scope

- Entertainment (golf, concerts, etc. — these are 0% post-TCJA, flagged at input)
- Lavish-and-extravagant test (subjective — handled at audit, not in workbook)
- International per-diem (US travel only)

## Upgrade CTA

Tax Season Bundle ($147).
