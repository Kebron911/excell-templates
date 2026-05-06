# Brief — TAX-002 Single-Property P&L Tracker

**SKU:** TAX-002
**Category:** Financial / Accounting (master spec §3.2 A #2)
**Tier:** T2 ($27 Etsy / $47 Gumroad — same workbook, two storefronts)
**Wave:** 2
**Campaign tagline:** Close your year before April does.

> **2026-05-03 — Brief revision.** Original brief framed this SKU as "Lite vs Full." That framing is dropped. Why: at MVP both files are identical, and "Lite" on a tax product implies missing pieces — high refund risk. This product is now a single, complete **Single-Property P&L Tracker** with a built-in straight-line depreciation calculator. Upgrade ladder is **scope expansion** (add properties, add LLC consolidation), not "complete the missing parts." Detail in §"Single-property scope" below.

## Target persona

**Primary:** Semi-Pro Sarah (3-10 properties) — this single-property version is her entry point; she buys 2-3 before upgrading to the Multi-Property Master on own-site.
**Secondary:** Side-Hustle Sam (1-2 listings) — his only P&L need, sufficient for tax prep.

## The one specific pain

"My CPA gave me back my Schedule E draft and said 'your categories don't map — I had to rebuild it.' I need a P&L that comes out of the box with IRS Schedule E categories so my CPA literally copies my numbers into boxes 5-19 without re-categorizing."

## What this template does

Single-property profit + loss tracker structured around **IRS Schedule E line items** (lines 3-26):
- Revenue: rents received + cleaning fees collected from guests
- Expenses pre-mapped to Schedule E boxes: Advertising (6), Auto/travel (7), Cleaning + maintenance (8), Commissions (9), Insurance (10), Legal + professional (11), Management fees (12), Mortgage interest (13), Other interest (14), Repairs (15), Supplies (16), Taxes (17), Utilities (18), Wages (19), Other — Platform fees (19), Other — Misc (19)
- **Straight-line depreciation calculator** (27.5-year residential rental) with mid-month convention — auto-fills Schedule E Line 20
- Monthly breakdown + YTD per category
- Schedule E Summary tab — ready-to-print CPA handoff

## Single-property scope

This SKU is a **complete single-property tax tool**. It is *not* a "Lite" version of anything — it is the right product for the millions of hosts who own one rental.

**What's included (everything a single-property host needs to file Schedule E):**
- All 17 Schedule E expense categories with dropdown-enforced category integrity
- Straight-line depreciation on the building (27.5-year residential rental) with mid-month convention for first-year proration
- Monthly P&L matrix + YTD
- Schedule E Summary tab with line numbers, ready to hand to CPA
- Print area set 1-page letter portrait

**What requires the Portfolio Master ($97 own-site, Phase 2+):**
- Multi-property consolidation across LLCs / entities
- Asset-by-asset depreciation (furniture 5-yr, appliances 5-yr, improvements 15-yr) with bonus-depreciation flags
- Cost-segregation worksheet
- Budget vs actual variance analysis
- Break-even occupancy calculator (also available standalone — FIN-002)

**Etsy ($27) and Gumroad ($47) ship the identical workbook** at MVP. The price delta reflects storefront economics (Etsy's discoverability + lower-AOV audience vs Gumroad's direct-to-list higher willingness-to-pay), not feature difference. Both files include the same upgrade banner pointing at the Portfolio Master.

## Sheets / Tabs (8)

| # | Tab | Role |
|---|---|---|
| 1 | Welcome | Cover + Schedule E mapping note + how-to |
| 2 | Property Info | Address, purchase, loan |
| 3 | Revenue Log | One row per booking |
| 4 | Expense Log | One row per expense (Schedule E-mapped category) |
| 5 | Monthly P&L | Auto: month × category matrix |
| 6 | Depreciation | Straight-line 27.5-yr building depreciation; auto-fills Sched E Line 20 |
| 7 | Schedule E Summary | YTD totals mapped to Schedule E line numbers |
| 8 | Settings | Tax year + category dropdown source |

## Inputs

**Property Info (rows 5-16):** property name, address, city/state/zip, property type, purchase date, purchase price, closing costs, loan amount, interest rate, loan term, business start date, days rented YTD.

**Revenue Log (rows 6-1005):** Date, Guest/Source, Booking Channel (dropdown: Airbnb/VRBO/Booking.com/Direct/Other), Gross, Platform Fee, Cleaning Fee Collected, Net (formula `=D-E`), Notes.

**Expense Log (rows 6-2005):** Date, Vendor, Category (dropdown — ONLY the 17 Schedule E categories), Amount, Payment Method, Receipt? (Yes/No), Notes.

## Outputs

**Monthly P&L (7 rows revenue + header, 17 rows expenses, total + net):**
- Row 7 (Revenue): monthly SUMIFS over Revenue Log col D (Gross) + col F (Cleaning Fees), per month range
- Rows 10-26 (one per expense category): SUMIFS over Expense Log col D filtered by Category col C AND date range
- Row 28 (TOTAL EXPENSES): sum of category rows
- Row 30 (NET INCOME): Revenue row - Total Expenses row
- Conditional formatting on net row: green positive / red negative

**Schedule E Summary:**
- Line 3 (Rents received): `='Monthly P&L'!N7` (col N = YTD column)
- Line 4 (Royalties): hardcoded 0
- Lines 6-20 (expense categories): `='Monthly P&L'!N<corresponding row>`
- Line 26a (Total expenses): `=SUM(B12:B28)`
- Line 26 (Income or loss): `=B8+B9-B<tot>`
- Print area set for 1-page letter portrait

## External data references

- IRS Schedule E 2026 Part I structure (line numbers 3-26)
- IRS Publication 527 (Residential Rental Property) — cited on Welcome tab

## Business logic

- Expense category dropdown MUST map exactly to Schedule E boxes so CPA can copy-paste without re-categorizing.
- Revenue log captures BOTH gross (what guest paid) AND net (after platform fee) — IRS cares about gross (Line 3).
- Platform fees are an expense (Line 19 Other), NOT netted from revenue.
- Cleaning fees collected from guest = revenue line 3; cleaning cost paid to cleaner = expense line 8.
- Capacity: 1000 revenue rows, 2000 expense rows.
- Property Info is single-property (MVP); multi-property Full is Phase 2+.

## QA sample data

Single property "Smokies Ridge Cabin", Jan-Mar 2026:
- 10 bookings totaling ~$20,500 gross revenue + $2,100 cleaning fees collected
- $1,680 platform fees (Airbnb 10%, VRBO ~8%)
- $3,600 to cleaner (8 turnovers × $450)
- $420 supplies (3 receipts)
- $1,200 mortgage interest (3 × $400)
- $350 utilities (3 months varied)
- $800 repairs (1 emergency)

Expected Schedule E Summary:
- Line 3 (Rents + cleaning collected): ~$22,600
- Line 8 (Cleaning): $3,600
- Line 13 (Mortgage int): $1,200
- Line 15 (Repairs): $800
- Line 16 (Supplies): $420
- Line 18 (Utilities): $350
- Line 19 (Other — Platform fees): ~$1,680
- Line 26a (Total expenses): ~$8,050
- Net income: ~$14,500

## Upgrade CTA

Prominent Welcome tab upgrade banner: "Multi-property? Add LLC consolidation, asset-by-asset depreciation, and bonus-depreciation tools — Portfolio P&L Master at thestrledger.com/portfolio-master ($97), or save with the Portfolio Bundle ($397)."

## Out-of-scope (handled by Portfolio Master)

- Multi-property consolidation across LLCs / entities
- Asset-by-asset depreciation (furniture 5-yr, appliances 5-yr, improvements 15-yr) with bonus-depreciation flags
- Cost-segregation worksheet
- Budget vs actual variance analysis
- Break-even occupancy calculator (separate SKU — FIN-002)

---

## Implementation spec (single canonical workbook)

### Workbook-level
- Filenames (one canonical file, served by both storefronts):
  - DEMO: `templates/_masters/TAX-002-pl-single-property-DEMO.xlsx`
  - BLANK: `templates/_masters/TAX-002-pl-single-property-BLANK.xlsx`
- Build script generates DEMO + BLANK. No separate Lite file. Etsy and Gumroad serve the same BLANK file at different price points.
- Tab colors: Welcome/Property Info/Revenue Log/Expense Log/Settings = `COLOR_SECONDARY` (Clay Rose); Monthly P&L + Depreciation + Schedule E Summary = `COLOR_ACCENT` (Muted Gold — dashboard emphasis)
- Default font: Calibri 11pt / Georgia tab titles
- 17 expense categories (the Schedule E dropdown source):
  1. "Advertising (Line 6)"
  2. "Auto/travel (Line 7)"
  3. "Cleaning + maintenance (Line 8)"
  4. "Commissions (Line 9)"
  5. "Insurance (Line 10)"
  6. "Legal + professional (Line 11)"
  7. "Management fees (Line 12)"
  8. "Mortgage interest (Line 13)"
  9. "Other interest (Line 14)"
  10. "Repairs (Line 15)"
  11. "Supplies (Line 16)"
  12. "Taxes (Line 17)"
  13. "Utilities (Line 18)"
  14. "Wages (Line 19)"
  15. "Other — Platform fees (Line 19)"
  16. "Other — Misc (Line 19)"
  17. "Depreciation (Line 20) — auto from Depreciation tab"

### Sheet 1 — Welcome

`apply_brand_header(ws, "Single-Property P&L Tracker", "Close your year before April does.")`. Col A width 95. Freeze A5.

- Row 5: "How this maps to IRS Schedule E" (Georgia 14pt bold primary)
- Row 6: paragraph (wrap): "Expense categories on the Expense Log match Schedule E Part I line numbers (5-20). The Schedule E Summary tab rolls up YTD totals ready for your CPA to copy into the form. Reference: IRS Publication 527 (Residential Rental Property)."
- Row 9: "How to use" header
- Rows 10-15: 6 numbered steps
- Row 18: italic muted note: "Schedule E Line 20 (Depreciation) is auto-calculated on the Depreciation tab — straight-line on the building, 27.5-year residential rental, mid-month convention. For asset-by-asset depreciation (furniture, appliances, improvements) see the Portfolio Master."
- Row 20: upgrade banner: "Multi-property? Add LLC consolidation, asset-by-asset depreciation, and bonus-depreciation tools — Portfolio P&L Master at thestrledger.com/portfolio-master ($97), or save with the Portfolio Bundle ($397)." Use COLOR_ACCENT fill, 50-height row.

### Sheet 2 — Property Info

Col widths A=28, B=40. Tab color `COLOR_SECONDARY`.

Rows 5-16 (label col A bold right-aligned, value col B input style):
| Row | Label | Sample value | Format |
|---|---|---|---|
| 5 | Property name: | Smokies Ridge Cabin | |
| 6 | Street address: | 123 Mountain Lane | |
| 7 | City / State / Zip: | Gatlinburg, TN 37738 | |
| 8 | Property type: | Cabin | |
| 9 | Purchase date: | 2023-08-15 | yyyy-mm-dd |
| 10 | Purchase price ($): | 420000 | "$"#,##0 |
| 11 | Closing costs ($): | 8500 | "$"#,##0 |
| 12 | Loan amount ($): | 336000 | "$"#,##0 |
| 13 | Interest rate (%): | 0.0675 | 0.000% |
| 14 | Loan term (years): | 30 | |
| 15 | Business start date: | 2023-10-01 | yyyy-mm-dd |
| 16 | Days rented YTD 2026: | 72 | |

### Sheet 3 — Revenue Log

Col widths 12/28/14/12/12/14/12/28. Freeze A6.
Row 5 styled headers: Date | Guest / Source | Channel | Gross | Platform Fee | Cleaning Collected | Net | Notes

For every row 6-1005:
- Col G (Net) formula: `=D<i>-E<i>` currency format
- Col A date format: `yyyy-mm-dd`
- Col D, E, F, G currency `"$"#,##0.00`

Pre-fill rows 6-15 with 10 sample bookings (SAMPLE_REVENUE constant in build — 10 rows over Jan-Mar, mix of Airbnb/VRBO/Direct totaling ~$20,500 gross).

Dropdown C6:C1005: `"Airbnb,VRBO,Booking.com,Direct,Other"`.

### Sheet 4 — Expense Log

Col widths 12/24/38/12/16/10/28. Freeze A6.
Row 5 styled headers: Date | Vendor | Category (Schedule E line) | Amount | Payment Method | Receipt? | Notes

Capacity rows 6-2005.
Pre-fill rows 6-28 with ~23 sample expenses (SAMPLE_EXPENSES constant — 8 cleaner, 3 supplies, 3 mortgage int, 1 utilities internet, 2 utilities elec, 1 repair, 5 platform fees).

Dropdowns:
- C6:C2005 = `=Settings!$A$15:$A$31` (17 expense categories stored on Settings rows 15-31)
- E6:E2005 = `"Venmo,Zelle,Check,Cash,ACH,Credit Card,Auto-deduct,Other"`
- F6:F2005 = `"Yes,No"`

Col A date `yyyy-mm-dd`; Col D currency `"$"#,##0.00`.

### Sheet 5 — Monthly P&L

Tab color `COLOR_ACCENT`. Freeze B6. Col widths A=38, B-M=10, N=12.

Row 5 styled headers: Category | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec | YTD

Row 7: "Rents + cleaning fees collected" (bold primary). For each month col m (2-13) formula:
```
=SUMIFS('Revenue Log'!$D:$D, 'Revenue Log'!$A:$A, ">="&DATE(YEAR(TODAY()),<m>,1), 'Revenue Log'!$A:$A, "<"&DATE(YEAR(TODAY()),<m+1>,1)) + SUMIFS('Revenue Log'!$F:$F, 'Revenue Log'!$A:$A, ">="&DATE(YEAR(TODAY()),<m>,1), 'Revenue Log'!$A:$A, "<"&DATE(YEAR(TODAY()),<m+1>,1))
```
Col N (YTD): `=SUM(B7:M7)`. Format: `"$"#,##0`.

Row 9: "EXPENSES" (Georgia 12pt bold primary).
Rows 10-26 (one per category, 17 categories):
- Col A: category name (from EXPENSE_CATEGORIES)
- Cols B-M: `=SUMIFS('Expense Log'!$D:$D, 'Expense Log'!$A:$A, ">="&DATE(YEAR(TODAY()),<m>,1), 'Expense Log'!$A:$A, "<"&DATE(YEAR(TODAY()),<m+1>,1), 'Expense Log'!$C:$C, A<row>)` format `"$"#,##0`
- Col N: `=SUM(B<row>:M<row>)` format `"$"#,##0`

Row 28 (last_exp_row+2): "TOTAL EXPENSES" (bold error color). Cols B-N: `=SUM(B10:B26)` etc. All cells bold.

Row 30 (tot_row+2): "NET INCOME (LOSS)" (bold primary, size larger). Cols B-N: `=B7-B28` (revenue minus total expenses). Bold.

Conditional formatting on net row B30:N30:
- Positive (>0): green fill `C7EFCF`
- Negative (<0): red fill `FFCCCC`

### Sheet 6 — Depreciation

Tab color `COLOR_ACCENT`. Col widths A=42, B=18. Freeze A5.

**Scope (stated on the tab):** Straight-line depreciation on the rental building over 27.5 years (residential rental real property) using the mid-month convention. This is the depreciation almost every single-property host needs. For asset-by-asset depreciation (furniture 5-yr, appliances 5-yr, improvements 15-yr) with bonus depreciation, see Portfolio Master.

**Layout:**

- Row 5: header "Straight-Line Depreciation Calculator (27.5-Year Residential Rental)" — Georgia 14pt bold primary
- Row 6: italic muted note: "Building only. For asset-by-asset (5/7/15-yr) depreciation see thestrledger.com/portfolio-master."

**Inputs (rows 9–17):**

| Row | Label (col A, bold right) | Value (col B) | Format |
|---|---|---|---|
| 9 | Purchase price ($): | `='Property Info'!B10` | "$"#,##0 |
| 10 | Closing costs (capitalizable, $): | `='Property Info'!B11` | "$"#,##0 |
| 11 | **Total cost basis ($):** | `=B9+B10` | "$"#,##0 bold |
| 12 | Land value (estimate, $): | sample `75000` (~18% of purchase price) | "$"#,##0 input style |
| 13 | **Depreciable basis ($):** | `=B11-B12` | "$"#,##0 bold |
| 14 | In-service date: | `='Property Info'!B15` | yyyy-mm-dd |
| 15 | Tax year: | `=YEAR(TODAY())` | 0 |
| 16 | Prior-year accumulated depreciation ($): | input — `0` for first year, otherwise pull from prior return | "$"#,##0 input style |

**Outputs (rows 19–26):**

| Row | Label | Formula | Format |
|---|---|---|---|
| 19 | Annual full-year depreciation: | `=B13/27.5` | "$"#,##0.00 |
| 20 | Year of in-service date: | `=YEAR(B14)` | 0 |
| 21 | Months in service this tax year: | `=IF(B15=B20, 12.5-MONTH(B14), IF(B15>B20, 12, 0))` | 0.0 |
| 22 | First-year mid-month proration factor: | `=IF(B15=B20, B21/12, IF(B15>B20, 1, 0))` | 0.000 |
| 23 | **Current-year depreciation ($):** | `=B19*B22` | "$"#,##0.00 bold accent |
| 24 | Years already depreciated (info): | `=MAX(0, B15-B20-1)` | 0 |
| 25 | Implied prior accumulated (if you didn't override row 16): | `=IF(B15>B20, B19*B24+B19*((12.5-MONTH(B14))/12), 0)` | "$"#,##0.00 muted |
| 26 | **Accumulated depreciation through current year ($):** | `=B16+B23` | "$"#,##0.00 bold |

Row 23 is the value that flows to Schedule E Line 20.

**Validation guards (row 28+, italic muted):**
- "If purchase price (B9) is blank, enter it on the Property Info tab — it auto-pulls."
- "Land value (B12) is your estimate of the *land-only* portion of purchase price. The IRS does not let you depreciate land. A common starting point is 15–20% of total purchase, but check your county tax assessor's land/improvement split for accuracy."
- "If this is not the first year you've owned the property, enter the prior accumulated depreciation in row 16 from your last Schedule E. Otherwise the calculator's 'Implied prior' (row 25) gives you a quick estimate."

**Print area:** A1:B30, portrait letter — supports CPA hand-off as a depreciation worksheet.

---

### Sheet 7 — Schedule E Summary

Tab color `COLOR_ACCENT`. Col widths A=50, B=16. Print area A1:B<net_row+2>, portrait letter.

- Row 5: A="Tax Year:" (bold) | B=`=YEAR(TODAY())`
- Row 6: A="Property:" (bold) | B=`='Property Info'!B5`
- Row 8: A="Line 3 — Rents received" (bold) | B=`='Monthly P&L'!N7` currency
- Row 9: A="Line 4 — Royalties" | B=0 currency
- Row 11: "EXPENSES (Schedule E Part I)" (bold primary)
- For idx, cat in enumerate(EXPENSE_CATEGORIES, start=12):
  - Col A: cat (full category string including "(Line X)")
  - Col B:
    - For category 17 ("Depreciation (Line 20) — auto from Depreciation tab"): `=Depreciation!B23` (current-year depreciation flows in here)
    - For all other categories: `='Monthly P&L'!N<monthly_row>` where monthly_row = `10 + (idx - 12)`
  - Format currency
- Row tot_row (= 12 + 17 + 1 = 30): A="Line 26a — Total expenses" (bold error) | B=`=SUM(B12:B28)` currency bold error
- Row net_row (tot_row+2 = 32): A="Line 26 — Income or (loss)" (Georgia 14pt bold primary) | B=`=B8+B9-B<tot_row>` currency Georgia 14pt bold primary

### Sheet 8 — Settings

Col A width 38.
- Row 5: "Tax year:" (bold right-aligned)
- Row 6: `=YEAR(TODAY())` (formula style)
- Row 8: "Reference: IRS Publication 527 — Residential Rental Property" (italic muted)
- Row 10: "Expense category list (source for Expense Log dropdown):" (bold primary)
- Rows 15-31 col A: the 17 EXPENSE_CATEGORIES strings (source for C-column dropdown on Expense Log)
