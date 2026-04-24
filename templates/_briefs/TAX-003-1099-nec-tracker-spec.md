# Sheet Spec — TAX-003 1099-NEC Contractor Tracker

## Workbook-level
- Filename: `TAX-003-1099-nec-tracker.xlsx`
- Tab colors: Welcome + Contractors + Payment Log + Settings = `COLOR_SECONDARY` (Clay Rose); 1099 Prep Dashboard = `COLOR_ACCENT` (Muted Gold — dashboard emphasis)
- Default font: Calibri 11pt body; Georgia for tab titles

## Sheet 1 — Welcome
`apply_brand_header(ws, "1099-NEC Contractor Tracker", "Close your year before April does.")`. Col A width 95. Freeze A5.

- Row 5: "The 1099-NEC Rule (IRS 2026)" — Georgia 14pt bold primary
- Row 6: "Anyone you pay $600 or more in a calendar year for business services requires a 1099-NEC issued by January 31 of the following year. Penalties for missed forms: $60-$660 per form (IRS Pub 1220). This tool tracks every payment and flags who crosses the threshold." (wrap)
- Row 8: "How to use" header
- Rows 9-14:
  - "1. Tab 2 (Contractors): add every contractor you pay — name, tax ID, address, W-9 status."
  - "2. Tab 3 (Payment Log): log every payment as it happens (date, contractor, amount, method)."
  - "3. Tab 4 (1099 Prep Dashboard): watch who crosses $600 in real time."
  - "4. Monthly: scan Dashboard for anyone marked YES without a W-9 → request W-9 immediately."
  - "5. December: ensure every YES contractor has a W-9 on file before year-end."
  - "6. January: file 1099-NECs (via QuickBooks, Track1099, or CPA) using Dashboard data."
- Row 18: `add_upgrade_banner(ws, 18)`

## Sheet 2 — Contractors
Freeze A6. Col widths A=24 B=24 C=16 D=32 E=16 F=6 G=10 H=28 I=16 J=28 K=8 L=14.

Row 5 `header_row_style` headers: Name | Business Name | EIN/SSN | Address | City | State | Zip | Email | Phone | Services | W-9 on File? | W-9 Date

Rows 6-10: 5 sample contractors (inputs):
- ("Sarah Smokies Clean", "Smokies Clean LLC", "XX-XXXXXXX", "147 Pine St", "Gatlinburg", "TN", "37738", "sarah@smokiesclean.com", "(865) 555-0145", "Cleaning services", "Yes", "2025-12-15")
- ("Bob Handyman", "Bob's Ridge Repair", "XX-XXXXXXX", "20 Ridge Rd", "Sevierville", "TN", "37862", "bob@ridgerepair.com", "(865) 555-0198", "General handyman + repairs", "Yes", "2025-11-20")
- ("Lens Photography", "Lens Co", "—", "1 Market St", "Knoxville", "TN", "37902", "hello@lensco.com", "(865) 555-0211", "Listing photography", "No", "")
- ("Joe Landscape", "Joe's Lawn Care", "XX-XXXXXXX", "55 Oak Ln", "Pigeon Forge", "TN", "37863", "joe@joeslawn.com", "(865) 555-0155", "Lawn + landscape", "No", "")
- ("Quick Plumbing", "Quick Plumbing LLC", "XX-XXXXXXX", "88 Water Way", "Sevierville", "TN", "37862", "info@quickplumbing.com", "(865) 555-0166", "Emergency plumbing", "No", "")

Rows 11-55: blank capacity (input style, no values).

Dropdown col K6:K55: `"Yes,No"`
Col L date format `yyyy-mm-dd`.

## Sheet 3 — Payment Log
Freeze A6. Col widths A=12 B=26 C=12 D=16 E=20 F=32 G=28.

Row 5 styled headers: Date | Contractor | Amount | Payment Method | Property | Description | Notes

Capacity rows 6-2005.

Populate samples — 40 rows = 24 Sarah turnovers + 5 Bob + 1 Lens + 10 Joe + 2 Quick Plumbing. Generate Sarah's 24 turnovers with dates across 12 months (2 per month Jan-Dec), $400 each, Venmo, Smokies Ridge property, description "Turnover".

Other samples:
- Bob × 5: (2026-01-15, 280, Zelle, Smokies Ridge, "Kitchen faucet repair"), (02-22, 150, Venmo, Creek Side, "Door lock replacement"), (04-10, 220, Check, Lakehouse A, "Deck board replacement"), (05-28, 180, Venmo, Smokies Ridge, "Water heater fitting"), (07-14, 170, Venmo, Creek Side, "Misc fixes")
- Lens × 1: (2026-03-10, 500, ACH, Lakehouse A, "Listing photos", "One-time project")
- Joe × 10: weekly lawn $80 Zelle Smokies Ridge spread over 10 dates Apr-Sep
- Quick Plumbing × 2: (2026-06-12, 300, Check, Creek Side, "Emergency leak"), (2026-09-05, 300, Check, Lakehouse A, "Water heater call")

Dropdowns:
- B6:B2005: `=Contractors!$A$6:$A$55`
- D6:D2005: `"Venmo,Zelle,Check,Cash,ACH,Credit Card,Other"`

Col A date format `yyyy-mm-dd`; Col C currency `"$"#,##0.00`.

## Sheet 4 — 1099 Prep Dashboard
Tab color `COLOR_ACCENT`. Freeze A6. Col widths A=28 B=16 C=18 D=16 E=18.

Row 5 styled headers: Contractor | YTD Paid | 1099 Required? | W-9 on File? | Status

Rows 6-55 formulas (50 rows, matching Contractors capacity):
- Col A: `=IF(Contractors!A<i>="","", Contractors!A<i>)`
- Col B: `=IF(A<i>="","", SUMIFS('Payment Log'!$C:$C, 'Payment Log'!$B:$B, A<i>))` — currency format
- Col C: `=IF(A<i>="","",IF(B<i>>=Settings!$B$5,"YES","no"))`
- Col D: `=IF(A<i>="","",IFERROR(VLOOKUP(A<i>, Contractors!$A$6:$L$55, 11, FALSE), "?"))`
- Col E: `=IF(A<i>="","",IF(C<i>="YES", IF(D<i>="Yes","✓ Ready","⚠ Need W-9"), "n/a"))`

Conditional formatting:
- C6:C55 FormulaRule `C6="YES"` → red `FFCCCC` + bold
- C6:C55 FormulaRule `C6="no"` → light gray `EDEDED`
- E6:E55 FormulaRule `E6="✓ Ready"` → green `C7EFCF`
- E6:E55 FormulaRule `E6="⚠ Need W-9"` → yellow `FFF3BF`

Row 60: "Summary" — Georgia 14pt bold primary

Rows 61-64:
- Row 61: A="Contractors requiring 1099:" (bold) | B=`=COUNTIF(C6:C55,"YES")` format "0"
- Row 62: A="Of those, ready (W-9 on file):" (bold) | B=`=COUNTIF(E6:E55,"✓ Ready")` format "0"
- Row 63: A="Of those, need W-9:" (bold) | B=`=COUNTIF(E6:E55,"⚠ Need W-9")` format "0"
- Row 64: A="Total 1099-NEC $ volume:" (bold) | B=`=SUMIFS(B6:B55, C6:C55, "YES")` currency

Summary values on B61-B64 styled bold + primary color.

## Sheet 5 — Settings
Col widths A=36 B=14.

- Row 5: A="IRS 1099-NEC threshold ($):" (bold) | B5 = 600 (input style, format `"$"#,##0`)
- Row 7: A="Tax year:" (bold) | B7 = `=YEAR(TODAY())` (formula style)
- Row 9: "IRS 1099 penalty schedule (reference):" (bold)
- Rows 10-13 (col A | col B):
  - "Filed ≤30 days late:" | "$60 per form"
  - "Filed 31 days–Aug 1:" | "$130 per form"
  - "Filed after Aug 1:" | "$330 per form"
  - "Intentional disregard:" | "$660 per form"
