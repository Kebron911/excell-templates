# Brief — OPS-002 Damage Claim + AirCover Log

**SKU:** OPS-002
**Category:** Operations / Daily Management (master spec §3.2 C #36)
**Tier:** T2
**Etsy price:** N/A — Etsy Lite skipped (a stripped claim packet is worse than no template)
**Own-site price:** $37
**Wave:** 3 (build order #1 of the next 12)
**Campaign tagline:** Turnover chaos has a spreadsheet.

## Target persona

**Primary:** Side-Hustle Sam (1-2 listings) — has had ≥1 damage claim and felt the AirCover deadline panic.
**Secondary:** Semi-Pro Sarah (3-10 listings) — multiple claims/year, needs portfolio-wide tracking and a recovery rate she can actually quote.
**Tertiary:** Pro Pam — files claims on owners' behalf; needs an evidence trail she can hand the owner without embarrassment.

## The one specific pain

"Guest broke my coffee table at 11pm Saturday. By Tuesday I had receipts in three places, photos on my phone, and screenshots from the host app — and AirCover paid 30% because my submission was a mess and I missed the 14-day window on the second batch of receipts."

## What this template does

A claim-management workspace that:
1. Tracks every damage incident from discovery to resolution with a **deadline countdown** keyed to checkout date.
2. Forces evidence completeness BEFORE submission (photos, receipts, guest comms in writing, police report if applicable).
3. Provides 5 copy-paste message scripts for the most-common claim moments.
4. References AirCover policy + VRBO + Booking.com equivalents with an "as of <date>" stamp (claim policies rot).
5. Aggregates annual recovery rate so Sarah knows what % she's actually collecting — the number she'll re-evaluate her claim process against.

## Sheets / Tabs (7)

| # | Tab | Role |
|---|---|---|
| 1 | Start | Cover + open-claim count + deadline-warning banner |
| 2 | Claims Register | Master log — all claims, status, $ claimed vs $ recovered |
| 3 | Claim Packet | Per-claim worksheet — incident, damage list, evidence checklist, comm log, timeline, outcome |
| 4 | Coverage Reference | AirCover + VRBO + Booking.com policy snapshots (as-of stamped) |
| 5 | Message Scripts | 5 copy-paste scripts for the claim flow |
| 6 | Annual Damage P&L | Year totals — claimed vs recovered, recovery rate %, top loss categories |
| 7 | Settings | Property list + claim-status dropdown + filing-window default |

## Inputs

**Claims Register (capacity 200 rows):**
Date discovered, Property (dropdown), Guest name, Booking ID, Channel (Airbnb/VRBO/Booking.com/Direct), Checkout date, Damage description, Category (dropdown: Furniture / Appliance / Decor / Linen / Structural / Other), $ Claimed, $ Recovered, Status (dropdown: Discovered / Evidence gathering / Submitted / Disputed / Paid / Closed unpaid / Other), Notes.

**Claim Packet (single-claim worksheet, ~30 fields, 6 sections):**
- §1 Incident: discovery date/time, severity 1-5, category, narrative
- §2 Damage list: 10-row table (item / replacement cost / receipt? / photo?)
- §3 Evidence checklist: 12 items — before photo, after photo, receipt(s), written guest message, second witness, police report #, dated communication, date-stamped photos, etc.
- §4 Communications log: 8-row table (date / channel / direction / summary)
- §5 Timeline: discovery → guest contact → platform escalation → submission → platform response → resolution
- §6 Outcome: $ requested, $ received, denial reason, lessons-learned

## Outputs

**Claims Register:**
- Days-to-deadline (col K): `=IF(AND(F<row><>"", J<row><>"Paid", J<row><>"Closed unpaid"), Settings!$B$25 - (TODAY() - F<row>), "")` — Settings!B25 default 14 (Airbnb's standard window from checkout)
- Recovery rate per claim (col L): `=IF(I<row>>0, J<row>/I<row>, "")` formatted %
- Conditional formatting K6:K205: red <3 days, gold-soft 3-7, parchment >7

**Claim Packet:**
- Evidence completeness score: `=COUNTIF(<checklist 12-item range>, "✓") / 12` formatted %
- Submit-ready gate: `=IF(<score>>=0.75, "✅ Submit-ready", "⚠ Gather more evidence")`

**Annual Damage P&L:**
- Total claimed YTD, total recovered YTD, recovery rate %, claim count, avg claim
- Top-3 loss categories via SUMIFS by category column
- Per-property loss/recovery breakdown

**Start tab:**
- Open claim count: `=COUNTIFS('Claims Register'!J:J, "<>Paid", 'Claims Register'!J:J, "<>Closed unpaid", 'Claims Register'!A:A, "<>")`
- $ at risk: SUMIFS of $ Claimed where Status not in (Paid / Closed unpaid)
- Deadline-watch list: claims with Days-to-deadline ≤ 7, sorted ascending (INDEX/SMALL pattern across Register)

## External data references

- **Airbnb AirCover for Hosts** — current policy (14-day filing window from checkout is standard; exceptions exist)
- **VRBO Property Damage Protection** — equivalent
- **Booking.com Partner Liability Insurance** — equivalent

Each platform reference includes: covered, not covered, filing window, evidence required, dispute escalation. "Claim policies change — verify at <platform help URL> before relying on this reference. As of: <date>."

## Business logic

- **Deadline countdown is the headline feature.** Every open claim's days-to-deadline appears on the Start tab in priority order.
- Evidence completeness score gates submit-ready status — discourages rushed submissions.
- 5 message scripts: (1) first contact, propose direct resolution; (2) formal claim opening; (3) evidence-request response; (4) dispute/denial response; (5) post-resolution review management.
- Capacity: 200 claims register, single Claim Packet worksheet (host re-uses for next claim — most hosts file <10/year, copying packet results into Register on close).
- No cross-tab "live link" between Register and Packet — avoids brittle multi-row references.

## QA sample data

3 sample claims, Jan-Mar 2026:
- Jan 15 — Smokies Ridge Cabin — coffee table ($340 claimed, $340 recovered, paid in 9 days)
- Feb 22 — Creek Side — bedside lamp + linen stain ($180 claimed, $90 recovered, partial)
- Mar 8 — Lakehouse A — TV cracked, "Disputed", $720 claimed, open

Expected Annual Damage P&L: $1,240 claimed / $430 recovered / 35% recovery / 3 claims / $413 avg.

Claim Packet pre-populated for Jan 15 (all 6 sections, evidence score 92%, ✅ submit-ready).

## Upgrade CTA

Start tab row 18: "Need full operations coverage? Add the Operator Bundle at thestrledger.com/operator — turnover checklist + maintenance log + supply inventory + damage claims + insurance tracker, $197."

## Out-of-scope

- Live integration with Airbnb/VRBO claim portals (none exist; manual)
- Insurance policy management (separate SKU #40)
- Photo storage (workbook tracks whether photo exists, not the photo itself)
- Legal advice on disputes

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `OPS-002-damage-claim-aircover-log-DEMO.xlsx` + `-BLANK.xlsx`
- Mode: Operational
- Tab colors: Start/Settings = `COLOR_PRIMARY`; Claims Register/Claim Packet = `COLOR_SECONDARY`; Coverage Reference/Message Scripts = `COLOR_PARCHMENT_ALT`; Annual Damage P&L = `COLOR_ACCENT`
- Default font: Calibri 11pt body / Georgia bold titles. SKU tag "OPS-002 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Damage Claim + AirCover Log", "When a guest breaks something, this is the calm move.")`.

Rows 8-14: at-a-glance summary
- Row 8: "OPEN CLAIMS" Georgia 14pt bold primary; Row 9: count formula 28pt
- Row 11: "$ AT RISK"; Row 12: SUM formula 28pt
- Row 14: "⚠ DEADLINE WATCH" — top-5 claims by smallest days-to-deadline (INDEX/SMALL)

Row 16 pseudo-button row: → Claims Register · → New Claim Packet · → Coverage Reference · → Annual P&L

Footer: gold rule + hello@thestrledger.com + version.

### Sheet 2 — Claims Register
Col widths: A=12, B=22, C=22, D=14, E=12, F=12, G=42, H=14, I=12, J=12, K=18, L=10, M=10, N=30. Row 5 navy header band. Freeze A6. Capacity rows 6-205.

Dropdowns: Channel col E (`"Airbnb,VRBO,Booking.com,Direct,Other"`); Category col H (Settings list); Status col K (Settings list).

Conditional formatting on Days-to-deadline (col L). DEMO pre-fills rows 6-8 with QA sample.

### Sheet 3 — Claim Packet
Form-style layout, single packet view (not multi-row). Approx row map:
- Rows 1-5: brand header band + BACK / → Register pseudo-buttons
- Rows 7-15: §1 Incident
- Rows 17-30: §2 Damage list (header row 18, data 19-28, total row 30)
- Rows 32-46: §3 Evidence checklist (12 rows w/ ✓ checkboxes col B, completeness score row 46)
- Rows 48-58: §4 Communications log (header row 49, data 50-57)
- Rows 60-67: §5 Timeline (6 milestone date rows)
- Rows 69-76: §6 Outcome
- Row 78: Submit-ready gate formula in display band
- Row 80: footer

Print area A1:L80, portrait letter, scaled-to-fit-width. DEMO populates with Jan-15 coffee-table claim.

### Sheet 4 — Coverage Reference
Three sections, one per platform. Each:
- Platform banner (navy fill, Cormorant/Georgia 14pt)
- "What's covered" — 8-12 bullet rows
- "What's NOT covered" — 5-8 bullet rows
- Filing window cell
- Evidence required cell
- Dispute escalation cell
- "As of <date>" stamp + verify-at-URL footer

Static text only, parchment-tinted backgrounds, no input cells.

### Sheet 5 — Message Scripts
5 scripts, ~12 rows each, ~60-row total. Per script:
- Title (Georgia 12pt bold primary)
- "When to send" italic
- Suggested subject line
- Script body (8-15 wrapped lines, parchment fill)
- "[BRACKET] placeholders" callout listing fields the host customizes

### Sheet 6 — Annual Damage P&L
Tab color `COLOR_ACCENT`. Layout:
- Row 5: "Year:" / Row 6: editable year (`=YEAR(TODAY())` default)
- Row 8: "TOTALS" Georgia 14pt bold
- Rows 9-13: $ claimed / $ recovered / recovery rate / claim count / avg claim — SUMIFS filtering Register by year
- Row 15: "TOP LOSS CATEGORIES"; Rows 16-18: top-3 categories
- Row 20: "BY PROPERTY"; Rows 21-30: per-property breakdown (10-row capacity)

Print area A1:C30, portrait letter — CPA/insurance handoff.

### Sheet 7 — Settings
Editable: property list (rows 5-15), claim-status list (rows 17-23), category list (rows 25-32), filing-window default (cell B34, default 14), reference as-of stamp (cell B36).
