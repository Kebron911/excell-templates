# Sheet Spec — TAX-002 Single-Property P&L (Lite + Full share 7-tab structure at MVP)

## Workbook-level
- Filenames:
  - Lite (Etsy): `TAX-002-pl-single-property-lite.xlsx` → `templates/_lite/`
  - Full (Gumroad): `TAX-002-pl-single-property.xlsx` → `templates/_masters/`
- Build script generates BOTH. Only difference is Welcome tab title + upgrade-banner emphasis.
- Tab colors: Welcome/Property Info/Revenue Log/Expense Log/Settings = `COLOR_SECONDARY` (Clay Rose); Monthly P&L + Schedule E Summary = `COLOR_ACCENT` (Muted Gold — dashboard emphasis)
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
  17. "Depreciation (Line 20) — see note"

## Sheet 1 — Welcome

`apply_brand_header(ws, "Single-Property P&L Tracker" + is_lite_suffix, "Close your year before April does.")`. Col A width 95. Freeze A5.

- Row 5: "How this maps to IRS Schedule E" (Georgia 14pt bold primary)
- Row 6: paragraph (wrap): "Expense categories on the Expense Log match Schedule E Part I line numbers (5-20). The Schedule E Summary tab rolls up YTD totals ready for your CPA to copy into the form. Reference: IRS Publication 527 (Residential Rental Property)."
- Row 9: "How to use" header
- Rows 10-15: 6 numbered steps
- Row 18: italic muted note: "Note: Schedule E Line 20 (Depreciation) — type your YTD depreciation number directly on the Schedule E Summary tab. This Lite version doesn't include a depreciation calculator; for 5/7/15/27.5/39-yr depreciation by asset, see the Portfolio Bundle."
- Row 20: upgrade banner — Lite version emphasizes "Multi-Property P&L Master ($97)"; Full emphasizes "Portfolio Bundle ($397)". Use COLOR_ACCENT fill, 50-height row. Write both variants in code using `is_lite` flag.

## Sheet 2 — Property Info

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

## Sheet 3 — Revenue Log

Col widths 12/28/14/12/12/14/12/28. Freeze A6.
Row 5 styled headers: Date | Guest / Source | Channel | Gross | Platform Fee | Cleaning Collected | Net | Notes

For every row 6-1005:
- Col G (Net) formula: `=D<i>-E<i>` currency format
- Col A date format: `yyyy-mm-dd`
- Col D, E, F, G currency `"$"#,##0.00`

Pre-fill rows 6-15 with 10 sample bookings (SAMPLE_REVENUE constant in build — 10 rows over Jan-Mar, mix of Airbnb/VRBO/Direct totaling ~$20,500 gross).

Dropdown C6:C1005: `"Airbnb,VRBO,Booking.com,Direct,Other"`.

## Sheet 4 — Expense Log

Col widths 12/24/38/12/16/10/28. Freeze A6.
Row 5 styled headers: Date | Vendor | Category (Schedule E line) | Amount | Payment Method | Receipt? | Notes

Capacity rows 6-2005.
Pre-fill rows 6-28 with ~23 sample expenses (SAMPLE_EXPENSES constant — 8 cleaner, 3 supplies, 3 mortgage int, 1 utilities internet, 2 utilities elec, 1 repair, 5 platform fees).

Dropdowns:
- C6:C2005 = `=Settings!$A$15:$A$31` (17 expense categories stored on Settings rows 15-31)
- E6:E2005 = `"Venmo,Zelle,Check,Cash,ACH,Credit Card,Auto-deduct,Other"`
- F6:F2005 = `"Yes,No"`

Col A date `yyyy-mm-dd`; Col D currency `"$"#,##0.00`.

## Sheet 5 — Monthly P&L

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

## Sheet 6 — Schedule E Summary

Tab color `COLOR_ACCENT`. Col widths A=50, B=16. Print area A1:B<net_row+2>, portrait letter.

- Row 5: A="Tax Year:" (bold) | B=`=YEAR(TODAY())`
- Row 6: A="Property:" (bold) | B=`='Property Info'!B5`
- Row 8: A="Line 3 — Rents received" (bold) | B=`='Monthly P&L'!N7` currency
- Row 9: A="Line 4 — Royalties" | B=0 currency
- Row 11: "EXPENSES (Schedule E Part I)" (bold primary)
- For idx, cat in enumerate(EXPENSE_CATEGORIES, start=12):
  - Col A: cat (full category string including "(Line X)")
  - Col B: `='Monthly P&L'!N<monthly_row>` where monthly_row = `10 + (idx - 12)`
  - Format currency
- Row tot_row (= 12 + 17 + 1 = 30): A="Line 26a — Total expenses" (bold error) | B=`=SUM(B12:B28)` currency bold error
- Row net_row (tot_row+2 = 32): A="Line 26 — Income or (loss)" (Georgia 14pt bold primary) | B=`=B8+B9-B<tot_row>` currency Georgia 14pt bold primary

## Sheet 7 — Settings

Col A width 38.
- Row 5: "Tax year:" (bold right-aligned)
- Row 6: `=YEAR(TODAY())` (formula style)
- Row 8: "Reference: IRS Publication 527 — Residential Rental Property" (italic muted)
- Row 10: "Expense category list (source for Expense Log dropdown):" (bold primary)
- Rows 15-31 col A: the 17 EXPENSE_CATEGORIES strings (source for C-column dropdown on Expense Log)
