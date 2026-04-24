# Brief — TAX-003 1099-NEC Contractor Tracker

**SKU:** TAX-003
**Category:** Financial / Accounting (master spec §3.2 A #12)
**Tier:** T1
**Etsy price:** $17
**Own-site price:** $17 (same)
**Wave:** 2
**Campaign tagline:** Close your year before April does.

## Target persona

Semi-Pro Sarah (3-10 properties) paying cleaners, handymen, landscapers, photographers — anyone she pays $600+/year must get a 1099-NEC by Jan 31.

## The one specific pain

"I pay my cleaner ~$400 per turnover × 60 turnovers = $24K/year. She's getting a 1099. But I also pay a handyman $80 here, $300 there, and a photographer $500 once. Who crossed the $600 threshold? I have no idea. My CPA asked for my 1099 list last January and I spent 3 days piecing it together from Venmo."

## What this template does

Contractor payment tracker that:
1. Logs every payment to every contractor across the year
2. Auto-flags contractors who crossed the $600 IRS threshold
3. Compiles W-9 contact info per contractor
4. Generates year-end 1099 prep summary (ready for CPA / QuickBooks / Track1099)
5. Handles multiple payment methods (Venmo, Zelle, Check, Cash, ACH, Credit Card)

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 1 | Welcome | Cover + 1099-NEC rules + how-to |
| 2 | Contractors | W-9 info per contractor (50-capacity) |
| 3 | Payment Log | One row per payment (2000-capacity) |
| 4 | 1099 Prep Dashboard | Auto-rolling YTD totals + threshold flag + summary |
| 5 | Settings | Editable threshold + tax year + penalty reference |

## Inputs (Contractors tab)

Rows 6-55 (50-capacity): Name | Business Name | EIN/SSN | Address | City | State | Zip | Email | Phone | Services | W-9 on File? (Yes/No dropdown) | W-9 Received Date

## Inputs (Payment Log)

Rows 6-2005: Date | Contractor (dropdown from Contractors) | Amount | Payment Method (dropdown: Venmo/Zelle/Check/Cash/ACH/Credit Card/Other) | Property | Description | Notes

## Outputs (1099 Prep Dashboard)

- Col A: contractor name (pulled from Contractors tab via reference)
- Col B: YTD paid = `=IF(A<i>="","", SUMIFS('Payment Log'!$C:$C, 'Payment Log'!$B:$B, A<i>))`
- Col C: 1099 Required? = `=IF(A<i>="","",IF(B<i>>=Settings!$B$5,"YES","no"))`
- Col D: W-9 on File? = `=IF(A<i>="","",IFERROR(VLOOKUP(A<i>, Contractors!$A$6:$L$55, 11, FALSE), "?"))`
- Col E: Status = `=IF(A<i>="","",IF(C<i>="YES", IF(D<i>="Yes","✓ Ready","⚠ Need W-9"), "n/a"))`
- Summary rows (row 60+): contractors requiring 1099, ready count, need-W-9 count, total $ volume

## External data references

- 2026 IRS threshold: **$600/year** for 1099-NEC. Editable cell on Settings B5.
- IRS Pub 1220 penalty schedule (reference table on Settings rows 9-14).

## Business logic

- Threshold cell editable (IRS may adjust).
- Conditional formatting: YES in red, "no" in gray, ✓ Ready in green, ⚠ Need W-9 in yellow.
- VLOOKUP uses exact match (false) on name — must match Contractors col A exactly for W-9 status to pull.

## QA sample data

5 contractors, ~40 payments across 2026:
- Sarah Smokies Clean — 24 × $400 turnovers = $9,600 (YES, W-9 on file)
- Bob Handyman — 5 × ~$200 = $1,000 (YES, W-9 on file)
- Lens Photography — 1 × $500 (no — below threshold, no W-9)
- Joe Landscape — 10 × $80 = $800 (YES, need W-9)
- Quick Plumbing — 2 × $300 = $600 (YES — right at threshold, need W-9)

Expected dashboard: 4 contractors flagged YES; 2 ✓ Ready; 2 ⚠ Need W-9; total $ volume $12,000.

## Upgrade CTA

Welcome row 18: "Upgrade to the Tax Season Bundle at thestrledger.com/tax-bundle — 1099-NEC tracker + mileage log + Schedule E prep + home office deduction, $147."

## Out-of-scope

- Filing the actual 1099-NEC forms (template produces the prep summary; user files via QuickBooks, Track1099, or CPA)
- W-9 form template (user downloads blank W-9 from IRS.gov)
- State-level 1099 rules (federal only for MVP)
