# Brief — LGL-003 Guest Screening Log + Ban List

**SKU:** LGL-003
**Catalog #:** 59 (master spec §3.2 G)
**Mode:** Operational (register)
**Tier:** T1
**Fork from:** `build_1099_nec_tracker.py` (register pattern with flags)
**Filenames:** `LGL-003-guest-screening-log-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Per-booking screening checklist + portfolio-wide ban list. Records what the host verified before accepting a booking (verified ID, profile age, prior reviews, screening service used) and aggregates "do not host" list across properties — so a problem guest banned at property A can't book property B.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (bookings screened YTD, banned guests, "🚫 declined" count) + → New Screening |
| 2 | Screening Log | Per-booking screening record (capacity 300) |
| 3 | Ban List | Guests permanently blocked across portfolio (capacity 50) |
| 4 | Decline Scripts | 4 copy-paste scripts for declining a booking professionally |
| 5 | Settings | Property list, screening service options, decline reason list |

## Screening Log columns
A Booking date | B Guest name | C Property (dropdown) | D Booking platform (Airbnb / VRBO / Booking / Direct) | E Profile age (months) | F Verified ID? (✓/✗) | G Prior reviews count | H Avg prior rating | I Trip purpose stated | J Local? (within 30mi of property — risk flag) | K Screening service used (dropdown: SuperHog / Autohost / TurnoverBnB / Manual / None) | L Decision (Approved / Declined / Pending) | M Notes

Conditional formatting:
- Row tinted gold if J=Yes (local guest)
- Row tinted red if profile age <2 months AND no prior reviews
- Decision col color: green Approved, red Declined

## Ban List columns
A Guest name | B Profile platform link | C Reason banned | D Banned date | E Banned by host | F Property where incident occurred | G Severity (1-5) | H Evidence kept? (✓/✗) | I Notes

Privacy callout on tab: "Maintain this list for your portfolio only. Sharing externally raises legal/defamation risk — consult counsel."

## Decline Scripts (4)
1. Local guest decline (politeness + house rule reference)
2. Insufficient profile decline (verification request → re-screen)
3. Suspicious-pattern decline (no reason given, redirect to platform)
4. Repeat-offender / banned guest decline (no reason given)

## Sample data (DEMO)
- 25 screenings Jan-Mar 2026, 22 approved + 3 declined
- 2 guests on ban list (party-thrower, smoker who hid it)
- 1 declined "local guest"
- Confidence: realistic distribution

## Settings
- B5-B14 Property list
- B16-B25 Screening services list
- B27-B36 Decline reasons list
