# Brief — SPC-002 Corporate Housing / Travel-Nurse (Furnished Finder) Tracker

**SKU:** SPC-002
**Catalog #:** 72 (master spec §3.2 J)
**Mode:** Operational (register + matrix)
**Tier:** T2
**Fork from:** `build_pl_single_property.py` (matrix) + `build_1099_nec_tracker.py` (tenant register)
**Filenames:** `SPC-002-corporate-housing-travel-nurse-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For mid-term rental hosts (30-day+ stays) on Furnished Finder, Blueground, AnyPlace, or directly with corporate clients / travel nurses. Different model than nightly STR: monthly rent, longer stays, no daily turnover, recovery deposits, utility reimbursement options. Tracks: tenant pipeline, contract terms, monthly recurring revenue, occupancy gap days.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (active tenants, MRR, occupancy %, gap days, top channel) + → Tenants |
| 2 | Tenants | CRM register (capacity 100) — past, current, future tenants |
| 3 | Lease Calendar | Visual timeline showing tenant overlap, gaps, future bookings |
| 4 | Monthly Revenue | 12-col MRR matrix per property, including utility reimbursement |
| 5 | Pipeline | Inquiry-to-signed conversion funnel |
| 6 | Settings | Property list, channel list, lease type list, active year |

## Tenants columns
A Tenant ID | B Tenant name | C Email | D Phone | E Employer / agency | F Profession (dropdown: Travel nurse / Corporate exec / Locum doctor / Insurance adjuster / Construction / Film crew / Other) | G Property assigned | H Channel acquired (Furnished Finder / Blueground / Direct / Referral / Other) | I Lease start | J Lease end | K Monthly rent | L Security deposit | M Utility incl in rent? (Y/N) | N Status (Lead / Application / Approved / Active / Move-out / Past) | O Notes

## Lease Calendar tab
Gantt-style 12-month grid:
- Rows = properties
- Cols = months (Jan-Dec)
- Cells = tenant name during lease period (color-coded by status)
- Gap days highlighted red between leases

## Monthly Revenue
12-col matrix:
- Per property × month: rent collected, utility reimbursement, late fees, deposits applied
- Property total
- Portfolio total
- Bar chart "MRR by month"

## Pipeline tab
Funnel:
- Inquiries received (count)
- Applications submitted (count)
- Applications approved (count)
- Leases signed (count)
- Conversion rate %s between stages

Per-channel breakdown (which channel converts best?).

## Sample data (DEMO)
2 properties on Furnished Finder + 1 corporate-direct:
- 8 tenants Jan-Mar 2026 (4 active, 2 past, 2 future-signed)
- MRR $9,400 portfolio
- 18 gap days YTD across portfolio
- Furnished Finder: 60% of bookings, 35% inquiry-to-lease conversion
- Travel nurse contracts dominant (5 of 8 tenants)

## Settings
- B5 Active year
- B7-B16 Property list
- B18-B25 Channel list
- B27-B34 Lease type list (3-mo / 6-mo / month-to-month / corporate negotiated / etc.)
