# Brief — OPS-006 Maintenance Log + Vendor CRM

**SKU:** OPS-006
**Catalog #:** 37 (master spec §3.2 C)
**Mode:** Operational (flat log + register)
**Tier:** T2
**Fork from:** `build_mileage_log.py` for log; `build_1099_nec_tracker.py` for vendor register
**Filenames:** `OPS-006-maintenance-log-vendor-crm-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Single source of truth for repairs, maintenance work, and recurring services across the portfolio. Combines a chronological work-order log with a vendor CRM (preferred plumber, HVAC tech, handyman) so the next emergency call is one tab away.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (open tickets, $ YTD, overdue items) + → New Work Order |
| 2 | Work Orders | Chronological log of every repair/maintenance event (capacity 300) |
| 3 | Vendors | Preferred-vendor CRM (capacity 50) — plumber, HVAC, handyman, electrician, etc. |
| 4 | Recurring Services | HVAC tune-ups, gutter cleans, pest control — schedule + last-completed |
| 5 | Annual Cost Report | Per-property + per-category $ breakdown for tax prep |
| 6 | Settings | Property list, category list, status list, active tax year |

## Work Orders columns
A Date opened | B Property (dropdown) | C Category (dropdown: Plumbing / HVAC / Electrical / Appliance / Cosmetic / Pest / Landscape / Other) | D Issue summary | E Vendor (dropdown from Vendors tab) | F Date completed | G Days open (formula `=IF(F<>"",F-A,TODAY()-A)`) | H $ Cost | I Receipt? (✓/✗) | J Status (dropdown: Open / Scheduled / Done / Deferred) | K Capex or Repair? (dropdown) | L Notes

Conditional formatting: row red where Status=Open AND Days open > 14.

## Vendors columns
A Vendor name | B Trade (dropdown) | C Phone | D Email | E License # | F Insurance verified? (✓/✗) | G Hourly rate | H Service area (cities) | I Last used | J Total spent YTD (`=SUMIFS('Work Orders'!H:H, 'Work Orders'!E:E, A6, 'Work Orders'!A:A, ">="&DATE(Settings!$B$5,1,1))`) | K Rating 1-5 | L Notes

## Recurring Services
6 rows pre-populated (HVAC spring tune-up, HVAC fall tune-up, Gutter clean, Pest spray Q1/Q2/Q3/Q4, Septic pump 3yr, Dryer vent clean). Columns: Service | Property | Frequency | Last done | Next due (formula) | Vendor | Status.

## Annual Cost Report
- Total $ YTD (filtered by `Settings!$B$5`)
- Per-property breakdown (SUMIFS)
- Per-category breakdown (SUMIFS)
- Capex vs Repair split
- Prints clean to one page (CPA-ready)

## Sample data (DEMO)
- 25 work orders Jan-Mar 2026 across 3 properties
- 8 vendors (plumber, HVAC, handyman, electrician, cleaner, pest, landscaper, locksmith)
- Recurring: HVAC due in 14 days, pest due in 6 days (highlighted)

## Settings
- B5 Active tax year
- B7-B16 Property list
- B18-B25 Status list
- B27-B36 Category list
