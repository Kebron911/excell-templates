# Brief — MKT-003 Referral Source + Repeat Guest CRM

**SKU:** MKT-003
**Catalog #:** 55 (master spec §3.2 F)
**Mode:** Operational (register)
**Tier:** T2
**Fork from:** `build_1099_nec_tracker.py` (register/CRM pattern)
**Filenames:** `MKT-003-referral-source-repeat-guest-crm-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Tracks where each guest came from (Airbnb / VRBO / direct / repeat / referral) and identifies *repeat-stay* and *referral-friendly* guests. Attaches them to a lightweight CRM so the host can run a year-end "thanks + come back" outreach to the top-15 highest-LTV guests — pushing direct bookings and channel-fee elimination.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (total guests, repeat %, direct-book %, top LTV) + → New Guest |
| 2 | Guest CRM | Master register (capacity 500) |
| 3 | Repeat & Referral | Filtered view of repeat guests + referral-source stats |
| 4 | Outreach Templates | 4 copy-paste outreach scripts |
| 5 | Settings | Property list, channel list, referral-source list, active year |

## Guest CRM columns
A First booking date | B Guest first name | C Guest last name | D Email (optional) | E Phone (optional) | F Property first stayed at | G Channel of first booking (dropdown: Airbnb / VRBO / Booking / Direct / Referral) | H Referrer (link to another guest if Channel=Referral) | I # Stays (manual count or formula) | J Total nights | K Total $ paid | L Avg rating given | M Last stay date | N Repeat? (formula `=IF(I>1,"✓ Repeat","")`) | O Notes / preferences

## Repeat & Referral tab
- KPI row: Total guests | Repeat guests | Repeat % | Direct-book % | Avg LTV
- Top-15 by Total $ paid (sorted desc, formula INDEX/SMALL)
- Channel mix donut chart
- Referral graph: who referred whom (rows of "Guest A → Guest B")

## Outreach Templates (4)
1. "Thanks for staying" first follow-up (post-checkout day 2-3)
2. Year-end "we miss you" campaign for repeat-eligible guests
3. Direct-book invitation (after their second Airbnb stay — invite to book direct next time, with $50 off)
4. Referral request (after a 5★ review)

## Sample data (DEMO)
- 35 guests over 2 years across 3 properties
- 7 repeat guests (20% repeat rate)
- 2 referral chains (one 3-deep)
- Top LTV $4,820 over 4 stays
- Channel mix: 64% Airbnb, 18% direct, 12% VRBO, 6% referral

## Settings
- B5 Active year
- B7-B16 Property list
- B18-B22 Channel list
- B24-B33 Referral-source list (e.g., specific past guests, social media, blog)
