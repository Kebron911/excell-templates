# Brief — ACQ-011 1031 Exchange Tracker (STR → STR)

**SKU:** ACQ-011
**Catalog #:** 30 (master spec §3.2 B)
**Mode:** Operational (timeline + register)
**Tier:** T3
**Fork from:** `build_quarterly_estimated_tax.py` (deadline-driven pattern) + `build_str_deal_analyzer.py`
**Filenames:** `ACQ-011-1031-exchange-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Tracks a §1031 like-kind exchange from sale of relinquished STR through identification of replacement, closing, and basis-carryover. Surfaces the two hard deadlines (45-day ID + 180-day closing) with countdowns, validates identification rules (3-property / 200% / 95% rules), and computes deferred gain. Disclaimers pushed strong — this is record-keeping support, not legal advice.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Hero + 45-day + 180-day countdown banners + → Timeline |
| 2 | Relinquished Property | Sale details, basis, recapture, realized gain |
| 3 | Identification | Up to 3 candidate replacement properties (or 200% / 95% rule paths) |
| 4 | Replacement + Closing | Closing details for selected replacement + deferred gain calc |
| 5 | Carryover Basis | New property tax basis with carryover from relinquished |
| 6 | Settings | Active year, QI (qualified intermediary) info, CPA contact |

## Relinquished Property tab
- Property name + address
- Sale date
- Sale price
- Selling expenses
- Net sale proceeds
- Original cost basis
- Accumulated depreciation
- Adjusted basis (formula)
- Realized gain (formula)
- Depreciation recapture portion (formula)
- Capital gain portion (formula)
- 45-day ID deadline (formula `=Sale date + 45`)
- 180-day closing deadline (formula `=Sale date + 180`)
- Days remaining: ID deadline (formula)
- Days remaining: closing deadline (formula)

Conditional formatting on countdowns: red <7 days, gold 7-21, parchment >21.

## Identification tab
3-property identification rule (most common):
- Up to 3 properties identified by Day 45, regardless of value
- Property A / B / C: address, asking price, status (Identified / Under contract / Closed / Backup)

OR 200% rule:
- Any number of properties, total fair market value ≤ 200% of relinquished sale price
- Aggregate FMV cell + 200% cap cell + flag if exceeded

OR 95% rule:
- Any number identified, must close on ≥95% of total identified value
- Aggregate identified value + 95% threshold + closed-value tracker

User picks the rule via dropdown; the workbook validates compliance per rule.

## Replacement + Closing
- Selected replacement property
- Purchase price
- Closing date
- Boot received (cash, debt relief)
- Tax due on boot (recapture first, capital gain second)
- Deferred gain
- Recognized gain (= boot received)

## Carryover Basis
- Relinquished adjusted basis: $X
- + Boot paid (additional cash) - Boot received
- = Carryover basis
- + Closing costs added to basis
- = New property's basis for depreciation
- New property holding period starts (with carryover holding period from relinquished)

## Sample data (DEMO)
Sale of Lakehouse $625K (basis $310K after $80K accumulated depreciation) → identifies Smokies Ridge cabin $485K + Creek Side $360K + Ridge Top $545K (3-property rule). Closes on Smokies Ridge + Creek Side, total $845K — exceeds $625K so all gain deferred + $220K boot paid. Carryover basis on new properties.

## Settings
- B5 Active year
- B7 Qualified Intermediary name + contact (REQUIRED — exchange void without QI)
- B9 CPA contact
- B11 Sale date (drives all countdowns)
- Strong disclaimer banner: "1031 rules are strict and unforgiving. This is recordkeeping support — your QI and CPA execute the exchange."
