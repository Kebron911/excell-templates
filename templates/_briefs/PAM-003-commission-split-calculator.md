# Brief — PAM-003 Commission / Split Calculator for Co-Hosts

**SKU:** PAM-003
**Catalog #:** 63 (master spec §3.2 H)
**Mode:** Operational (calculator + log)
**Tier:** T3
**Fork from:** `build_owner_reporting_dashboard.py` (split-payment pattern) + `build_1099_nec_tracker.py`
**Filenames:** `PAM-003-commission-split-calculator-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For co-host arrangements: Sarah/Pam manages someone else's STR for a 15-25% revenue share OR a flat fee per booking OR a hybrid. This workbook computes per-month commission owed, tracks payments to the property owner (or to the co-host depending on direction), and produces 1099-NEC-ready year-end totals.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (commission YTD, properties managed, owners paid, top earner) + → Bookings |
| 2 | Co-Host Agreements | Per-property split arrangement details (capacity 15) |
| 3 | Bookings Log | Per-booking revenue, fees, NET, split calc (capacity 500) |
| 4 | Monthly Statements | Per-property monthly statement with split breakdown — owner-ready printout |
| 5 | Year-End Summary | Per-property total revenue, total expenses, total commission, net to owner |
| 6 | Settings | Property list, owner list, active year |

## Co-Host Agreements columns
A Property | B Owner name | C Owner email | D Agreement type (dropdown: % of NET / % of GROSS / Flat per booking / Hybrid) | E Co-host % | F Flat per booking $ | G Co-host pays cleaner? (Y/N — affects who deducts cleaning) | H Co-host pays platform fees? (Y/N) | I Reimbursable expense items (free text list) | J Agreement effective date | K Notes

## Bookings Log columns
A Booking date | B Property (dropdown) | C Guest | D Booking ID | E Channel | F Gross revenue | G Cleaning fee | H Platform service fee | I Other deductions | J NET to property | K Co-host % (lookup from Agreements) | L Co-host commission $ (formula) | M Owner share $ (formula `=J-L`) | N Payment status (Pending / Paid / Disputed) | O Notes

Conditional formatting: row highlighted if Payment status = Pending after 30+ days.

## Monthly Statements
Per property × month, formatted as a print-ready statement:
- Header: property, month, owner contact
- Bookings list (date, guest, gross, deductions, NET)
- Commission calc detail
- Total to owner / total to co-host
- Payment instructions

Print area set; designed to be emailed/PDF'd to owner monthly.

## Year-End Summary
Per property:
- Total bookings
- Total gross revenue
- Total deductions (cleaning, fees, expenses)
- Total NET
- Total commission paid to co-host
- Net to owner
- 1099-NEC required? (if commission paid to co-host > $600)

## Sample data (DEMO)
Pam manages 4 properties for 2 owners:
- Smokies Ridge (20% of NET): 32 bookings YTD, $48K gross, commission $7.6K
- Lakehouse (15% of NET, owner pays cleaner): 28 bookings, $52K gross, commission $6.2K
- Creek Side (flat $75/booking): 24 bookings, $1,800 commission
- Ridge Top (hybrid: $50 + 8% NET): 22 bookings, $4.3K commission
Total commission YTD: $19.9K across both owners.

## Settings
- B5 Active tax year
- B7-B16 Property list
- B18-B27 Owner list
- B29 1099 threshold (default 600)
