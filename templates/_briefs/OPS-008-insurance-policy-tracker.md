# Brief — OPS-008 Insurance Policy Tracker

**SKU:** OPS-008
**Catalog #:** 40 (master spec §3.2 C — insurance policy expiration alerts)
**Mode:** Operational (register)
**Tier:** T1
**Fork from:** `build_license_permit_tracker.py` (expiration register pattern)
**Filenames:** `OPS-008-insurance-policy-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Single register of every insurance policy touching the STR portfolio — STR-specific dwelling insurance, umbrella liability, vehicle, business equipment, AirCover backup. Surfaces expiring policies in the next 60 days, premium totals, claim history, and "uninsured exposure" gaps.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (active policies, $ premium YTD, expiring in 60d) + → Add Policy |
| 2 | Policies | Master register (capacity 30 policies) |
| 3 | Coverage Map | Per-property "what's covered" matrix — gaps highlighted |
| 4 | Premium Forecast | 24-month forecast based on renewal dates |
| 5 | Settings | Property list, policy type list, carrier list, active year |

## Policies columns
A Policy # | B Carrier (dropdown) | C Type (dropdown: STR Dwelling / Umbrella Liability / Auto / Equipment / Cyber / Other) | D Property (dropdown — or "Portfolio-wide") | E Coverage limit | F Deductible | G Annual premium | H Effective date | I Expiration date | J Days to expiration (formula `=I-TODAY()`) | K Status (formula `=IF(J<0,"Expired",IF(J<60,"Renew soon","Active"))` ) | L Agent name | M Agent phone | N Notes

Conditional formatting J column: red <30 days, gold 30-60 days, parchment >60.

## Coverage Map tab
12-column matrix:
- Rows = properties (10 capacity)
- Cols = coverage types (Dwelling, Liability, Loss of rents, Auto, Cyber, AirCover backup)
- Cell value = limit $ if covered, "❌ GAP" if not (lookup against Policies)
- Bottom row: total exposure

## Premium Forecast tab
24-month horizontal: cols = months, rows = each policy. Cell = premium if renewal hits in that month, blank otherwise. Total row at bottom for cash-flow planning.

## Sample data (DEMO)
- 6 policies across 3 properties: STR dwelling x3, umbrella liability x1 portfolio, auto x1, equipment x1
- 1 expiring in 22 days (red flag)
- Coverage Map shows 1 gap (Property 3 missing cyber)

## Settings
- B5 Active year
- B7-B16 Property list
- B18-B27 Policy types
- B29-B38 Carriers
- B40 Renewal alert window (default 60 days)
