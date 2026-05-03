# Brief — LGL-004 Insurance Claim Log

**SKU:** LGL-004
**Catalog #:** 60 (master spec §3.2 G)
**Mode:** Operational (register)
**Tier:** T1
**Fork from:** `build_damage_claim_aircover.py` (claim register pattern — but for general insurance, not platform AirCover)
**Filenames:** `LGL-004-insurance-claim-log-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Tracks insurance claims filed against the host's underlying STR insurance policy (separate from Airbnb AirCover, which is OPS-002). Major events: storm damage, fire, theft, plumbing failure, liability claim. Records claim lifecycle from FNOL through settlement, recovery $ vs deductible, and lessons-learned.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (open claims, $ at risk, total recovery YTD) + → New Claim |
| 2 | Claims Log | Master register (capacity 50 — most hosts file <5 lifetime) |
| 3 | Active Claim Detail | Per-claim worksheet — incident, damages, evidence, comm log |
| 4 | Annual Summary | Recovery rate, claim frequency, premium-vs-recovery ratio |
| 5 | Settings | Property list, carrier list, claim-status list |

## Claims Log columns
A Claim # | B Date of loss | C Property (dropdown) | D Carrier (dropdown) | E Policy # | F Type (dropdown: Wind/Storm / Fire / Water / Theft / Liability / Vandalism / Other) | G Loss description | H $ Estimated damages | I Deductible | J $ Submitted | K $ Recovered | L Net to host (formula `=K-I`) | M Date filed | N Date closed | O Days to close (formula) | P Status (dropdown) | Q Notes

## Active Claim Detail (single-claim form)
~50-row form with sections:
- §1 Loss details (date/time, narrative, severity)
- §2 Damage inventory (10-row table)
- §3 Evidence checklist (10 items: photos before/after, police report #, contractor estimates, receipts, weather report, etc.)
- §4 Communications log (10 rows — adjuster calls, emails, voicemails)
- §5 Timeline milestones (FNOL → adjuster site visit → estimate → ACV check → repairs → final settlement → close)
- §6 Outcome + lessons learned

## Annual Summary
- Recovery rate: SUM(K)/SUM(J)
- Avg days to close
- Total premium paid YTD vs total recovered (insurance ROI)
- Claims by category breakdown
- Claims by property breakdown

## Sample data (DEMO)
- 3 claims across 2 properties: 2 wind/storm 2024-2025, 1 water 2026 (in progress)
- Recovery rate 78%, avg 47 days to close
- Active claim detail pre-filled for Q1 2026 water-line incident

## Settings
- B5 Active year
- B7-B16 Property list
- B18-B27 Carrier list
- B29-B38 Status list (FNOL / Adjuster assigned / Estimate received / Approved / Settled / Denied / Closed)
