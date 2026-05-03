# Brief — MKT-002 Review Response Tracker + Template Library

**SKU:** MKT-002
**Catalog #:** 54 (master spec §3.2 F)
**Mode:** Operational (register + library)
**Tier:** T1
**Fork from:** `build_1099_nec_tracker.py` (register pattern)
**Filenames:** `MKT-002-review-response-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Logs every guest review (rating, content, sentiment), tracks whether the host responded, captures lessons-learned, and provides 8 copy-paste reply templates organized by review tone. Cuts review-response time from 15 min to 3 min and prevents the "I forgot to reply to that 3-star" failure mode that hurts ranking.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (avg rating YTD, review count, response rate %) + → New Review |
| 2 | Reviews Log | Every review captured (capacity 300) |
| 3 | Reply Templates | 8 reply templates by review type |
| 4 | Lessons Learned | Themes that emerge — issues to fix on the property |
| 5 | Settings | Property list, channel list, active year |

## Reviews Log columns
A Date received | B Property (dropdown) | C Channel (Airbnb / VRBO / Booking / Direct) | D Guest first name | E Booking ID | F Stars (1-5) | G Public review text | H Private feedback (if any) | I Sentiment (dropdown: Glowing / Positive / Mixed / Critical / Hostile) | J Response sent? (Y/N) | K Response date | L Days to respond (formula) | M Tags (e.g., "cleaning", "wifi", "noise", "comms") | N Notes

Conditional formatting:
- F column color-coded: 5★ green, 4★ parchment, 3★ gold, 1-2★ red
- J column: red if N AND >7 days since received

## Reply Templates (8)
1. 5★ glowing — gracious + invite-back
2. 5★ generic positive — gracious + specific detail callback
3. 4★ mixed positive — appreciate + soft acknowledgment
4. 3★ mixed — acknowledge + improvement note + invite back
5. 2★ negative-justified — acknowledge + corrective action + apology
6. 2★ negative-unjustified — calm correction + facts + minimal defense
7. 1★ hostile/false — measured factual correction (no apology)
8. Late-checkout / damage-claim guest review (delicate)

Each template: title • when to use • subject line (if email) • body (~6-12 wrapped lines, parchment fill) • [BRACKET] placeholders.

## Lessons Learned tab
Auto-aggregated from Reviews Log Tags column:
- Top 5 tags by frequency
- Tag × avg star rating (which themes drag the score?)
- Action items (manual input rows where host writes "fix wifi router" / "replace shower mat")

## Sample data (DEMO)
- 28 reviews Q1 2026 across 3 properties, avg 4.7
- 1 critical (3★ wifi complaint), 1 hostile (1★ false mold claim)
- Response rate 89%
- Top tags: cleaning (12 mentions, 4.9 avg), wifi (5, 4.2 avg ← problem), comms (8, 4.8)

## Settings
- B5 Active year
- B7-B16 Property list
- B18-B25 Channel list
- B27-B36 Tag suggestions (used as dropdown source)
