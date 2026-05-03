# Brief — LGL-002 Transient Occupancy Tax (TOT) Filing Calendar

**SKU:** LGL-002
**Catalog #:** 58 (master spec §3.2 G)
**Mode:** Operational (matrix)
**Tier:** T2
**Fork from:** `build_quarterly_estimated_tax.py` (deadline-driven calc pattern) + `build_pl_single_property.py` (12-mo matrix)
**Filenames:** `LGL-002-tot-filing-calendar-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Aggregates monthly STR revenue per property/jurisdiction, computes TOT due (occupancy/lodging tax), and flags filing deadlines. Many jurisdictions: monthly filing on rolling deadlines; missing one = penalty + listing risk. Acknowledges that Airbnb collects-and-remits in many jurisdictions but NOT all — surfaces the "remitted by platform vs you" split.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (TOT YTD, next deadline, $ owed currently) + → Filing List |
| 2 | Revenue Matrix | 12-month per-property gross revenue input |
| 3 | TOT Calculator | Per-jurisdiction tax rate × revenue, platform-remitted split, $ host owes |
| 4 | Filing List | Upcoming filings sorted by deadline |
| 5 | Settings | Jurisdiction list with rates, filing frequency, due-day, platform remit flag |

## Revenue Matrix
Per property, 12-month grid: gross rent + cleaning fees per month. Customer enters values manually OR pastes from PMS export.

## TOT Calculator
Per property × month:
- Taxable revenue (formula `=GrossRent + CleaningFee` — varies by jurisdiction; settings flag toggles)
- TOT rate (lookup against Settings jurisdiction)
- Platform-remitted flag (per jurisdiction in Settings) — if Y, host owes $0 (Airbnb files), if N, host owes
- $ Host owes (formula)

## Filing List
Rolling 12-month forward view. Per property/jurisdiction:
- Period (month or quarter)
- Filing due date
- $ owed
- Status (dropdown: Pending / Filed / Paid)
- Confirmation #

Sorted ascending by due date. Conditional formatting: red <7 days, gold 7-30, parchment >30.

## Sample data (DEMO)
- 3 properties: 2 in Sevier County TN (Airbnb remits), 1 in Asheville NC (host self-files)
- Revenue Q1 2026 = $42K portfolio
- Asheville TOT 6%, monthly filing due 20th of following month
- $ Host owes Q1 total = $1,260 (Asheville only)

## Settings
- B5 Active tax year
- B7-B16 Property list
- B18-B27 Jurisdiction list (col B name | C TOT rate | D filing frequency | E due day | F platform-remitted Y/N | G filing URL)

## Critical accuracy notes
TOT rules vary wildly by city/county. The calculator is a working tool, not legal advice — Settings tab includes a callout: "Confirm rate + filing rules with your jurisdiction. Updated periodically; verify before filing."
