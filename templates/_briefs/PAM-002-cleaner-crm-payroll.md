# Brief — PAM-002 Cleaner CRM + Payroll

**SKU:** PAM-002
**Catalog #:** 61 (master spec §3.2 H)
**Mode:** Operational (register + log)
**Tier:** T3
**Fork from:** `build_1099_nec_tracker.py` (register pattern) + `build_mileage_log.py` (log pattern)
**Filenames:** `PAM-002-cleaner-crm-payroll-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For Pro Pam (managing 10+ properties with a cleaning team). Combines: cleaner CRM (contact info, performance, certifications), turnover assignment log, payroll calculator (hourly + per-turnover + bonus), and 1099-NEC year-end summary auto-feeding TAX-003.

## Tabs (7)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (active cleaners, turnovers/wk, $ paid YTD, top performer) + → Cleaners |
| 2 | Cleaners | CRM register (capacity 30) |
| 3 | Turnover Assignment | Per-turnover log with cleaner / property / date / payment (capacity 600) |
| 4 | Payroll Run | Bi-weekly or monthly payroll calc per cleaner |
| 5 | Performance | Per-cleaner avg rating, turnover speed, complaints |
| 6 | 1099-NEC Year-End | Year-end totals per cleaner with > $600 flag |
| 7 | Settings | Property list, payment cadence, 1099 threshold ($600), active year |

## Cleaners columns
A Cleaner ID | B Name | C Phone | D Email | E Address (mailing) | F EIN/SSN last4 | G W-9 received? (✓/✗) | H Pay rate type (dropdown: Hourly / Per-turnover / Hybrid) | I Hourly rate | J Per-turnover flat | K Service area (cities, free text) | L Certifications (insurance, bonded, COVID protocols, etc.) | M Active? (Y/N) | N Avg rating | O Notes

## Turnover Assignment log
A Date | B Property | C Cleaner (dropdown from Cleaners) | D Hours worked | E Per-turnover flat $ | F Bonus $ (if applicable) | G Total payment (formula `=D*hourly + E + F`, looks up hourly from Cleaners) | H Status (Scheduled / In progress / Done / Inspected) | I Inspection rating 1-5 | J Notes

## Payroll Run tab
- Period start / end (input)
- For each cleaner: turnovers in period, total hours, hourly $, per-turnover $, bonuses, gross pay
- Totals row
- Print-ready ($ to write checks or ACH)

## Performance tab
Per cleaner:
- Total turnovers YTD
- Avg inspection rating (formula `=AVERAGEIFS(...)`)
- Avg hours per turnover
- Complaints count (manual log of issues)
- Performance flag (Top performer / Standard / Needs review)

## 1099-NEC Year-End
Per cleaner row:
- Total paid YTD (formula SUMIFS)
- 1099 required? (formula `=IF(total>=600, "✓ Required", "Below threshold")`)
- W-9 on file? (lookup from Cleaners)
- Mailing address ready? (formula)

Drops directly into TAX-003 1099-NEC tracker.

## Sample data (DEMO)
6 cleaners on staff, 3 properties, 240 turnovers Jan-Mar 2026, 4 cleaners > $600 threshold, top performer 4.9 avg rating across 65 turnovers.

## Settings
- B5 Active tax year
- B7-B16 Property list
- B18 Payment cadence (Weekly / Bi-weekly / Monthly)
- B20 1099 threshold (default 600)
