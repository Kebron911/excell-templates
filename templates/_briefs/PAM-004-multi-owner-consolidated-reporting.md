# Brief — PAM-004 Multi-Owner Consolidated Reporting

**SKU:** PAM-004
**Catalog #:** 64 (master spec §3.2 H)
**Mode:** Operational (consolidator + dashboard)
**Tier:** T4
**Fork from:** `build_owner_reporting_dashboard.py` (PAM-001 — already built, this extends to multi-owner)
**Filenames:** `PAM-004-multi-owner-consolidated-reporting-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For Pro Pam managing multiple property owners across multiple properties. Aggregates per-owner reporting (which is PAM-001's job) up one level: Pam's total managed revenue, total commission earned, time allocated per owner, profitability per owner relationship. Tells Pam which owner relationships are worth keeping vs firing.

## Tabs (7)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Pam-level KPIs (managed properties, total commission YTD, top owner, lowest-NPS owner) + → Owners |
| 2 | Owners | Per-owner CRM (capacity 15) |
| 3 | Per-Owner Dashboard | Per-owner revenue, commission, properties, time allocated |
| 4 | Pam P&L | Pam's business P&L: commission revenue - Pam's expenses (software, insurance, contractors) |
| 5 | Time Allocation | Pam's hours logged per owner / property (capacity 1000 entries) |
| 6 | Owner Profitability | Per-owner profitability ranking — commission ÷ hours = $/hr per owner |
| 7 | Settings | Active year, owner list, property list |

## Owners columns
A Owner ID | B Owner name | C Email | D Phone | E Properties managed (count, formula) | F Agreement start | G Agreement type | H Commission % avg | I Total commission YTD (SUMIFS from PAM-003 bookings or input) | J NPS score 1-10 | K Status (Active / Churning / Onboarding / Sunset) | L Notes

## Per-Owner Dashboard
Owner-level summary (one section per owner):
- Properties under management
- YTD revenue (gross)
- YTD commission (Pam's)
- YTD hours allocated
- Effective hourly rate (commission / hours)
- Trend chart (12-month commission line)

## Pam P&L
12-col matrix with Pam's business income/expenses:
**Income:** Commission revenue (per owner sum) | Bonus / one-off income
**Expenses:** Software (PMS, accounting, comms) | Insurance | Contractor payments (cleaners not pass-through) | Marketing | Office | Mileage | Meals | Other
**NOI:** formula

## Time Allocation log
Append-only log of hours Pam works per owner/property:
A Date | B Owner (dropdown) | C Property | D Activity (Listing mgmt / Guest comms / Vendor coord / Reporting / Maintenance / Other) | E Hours | F Notes

300+ row capacity.

## Owner Profitability
Per-owner ranking:
- Owner | Commission YTD | Hours YTD | $/hr | Rank
Sorted descending. Highlight bottom-3 in red (consider firing).

## Sample data (DEMO)
Pam manages 4 owners, 12 properties total:
- Owner A: 5 properties, $32K commission YTD, 180 hrs → $178/hr ✅
- Owner B: 3 properties, $18K commission, 120 hrs → $150/hr
- Owner C: 2 properties, $11K commission, 95 hrs → $116/hr
- Owner D: 2 properties, $4.5K commission, 80 hrs → $56/hr 🔴 (consider firing)
Pam's NOI YTD: $48K on $65.5K commission revenue (74% margin).

## Settings
- B5 Active year
- B7-B21 Owner list
- B23-B37 Property list
