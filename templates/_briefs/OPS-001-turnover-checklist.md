# Brief — OPS-001 Cleaner Turnover Checklist + Scorecard

**SKU:** OPS-001
**Category:** Operations / Daily Management (master spec §3.2 C #33)
**Tier:** T1
**Etsy price:** $12 (lowest-price tripwire in the launch set)
**Own-site price:** $17
**Wave:** 1
**Campaign tagline:** Turnover chaos has a spreadsheet.

## Target persona

**Primary:** Semi-Pro Sarah (3–10 properties) — hires cleaners, wants consistency.
**Secondary:** Side-Hustle Sam (1–2 listings) — DIY cleaner, wants repeatable process.
**Tertiary:** Pro Pam (co-host / PM) — has ≥3 cleaners on roster, needs scoring.

## The one specific pain

"My cleaner keeps forgetting things. Last week guest arrived to find coffee pods empty. Week before: bathroom shelf had hair. I can't be there for every turnover — I need a checklist they sign AND a way to score them across turnovers so I know who my best cleaner is."

## What this template does

A two-part tool:
1. **Turnover Checklist (per-turnover, printable)** — a 1-page checklist cleaner fills in at each turnover. 40 items across 8 zones (bedroom, bathroom, kitchen, living, outdoor, supplies, safety, final walkthrough). Cleaner initials each, signs + dates.
2. **Cleaner Scorecard (host-facing, aggregates turnovers)** — as host enters turnover data (date, property, cleaner, score out of 40, issues noted), a dashboard rolls up: turnovers per cleaner, avg score, issue rate, ranking.

## Sheets / Tabs

| # | Tab | Role | Who uses |
|---|---|---|---|
| 1 | "Welcome" | Cover + how-to | Host |
| 2 | "Printable Checklist" | 1-page, print this for every turnover | Cleaner |
| 3 | "Turnover Log" | One row per turnover — host enters after turnover | Host |
| 4 | "Scorecard Dashboard" | Auto-rolling metrics | Host |
| 5 | "Cleaner Roster" | List of cleaners + contact | Host |
| 6 | "Supplies Par Levels" | Bonus: per-property supply stock targets | Host |

## Inputs (Turnover Log)

- Turnover date
- Property (dropdown referencing property list on Scorecard or typed)
- Cleaner name (dropdown from Cleaner Roster tab)
- Items checked (out of 40) — number 0-40
- Issues noted (free text)
- Guest complaint? (Yes/No dropdown)
- Time spent (minutes, optional)

## Outputs (Scorecard Dashboard — all formulas)

- Total turnovers per cleaner: `=COUNTIF('Turnover Log'!C:C, A5)`
- Average score per cleaner: `=IFERROR(AVERAGEIF('Turnover Log'!C:C, A5, 'Turnover Log'!D:D), 0)`
- Issue rate per cleaner: `=IFERROR(COUNTIFS('Turnover Log'!C:C, A5, 'Turnover Log'!F:F, "Yes") / COUNTIF('Turnover Log'!C:C, A5), 0)` formatted as %
- Avg score colored: green ≥37, yellow 33-36.99, red 0.01-32.99 (conditional formatting)
- Ranking: `=IF(B5>0, RANK.EQ(C5, $C$6:$C$15, 0), "")` — highest score = rank 1

## External data references

None.

## Business logic

- Printable Checklist must fit on 1 page letter-portrait.
- 40 items split as: 6 bedroom, 7 bathroom, 8 kitchen, 5 living, 4 outdoor, 4 supplies, 3 safety, 3 final walk.
- Items phrased as concrete actions: "Dust all horizontal surfaces (nightstands, dresser, headboard)" not "Dust bedroom".
- Checklist includes cleaner signature + date line at bottom.
- Scorecard handles at least 500 turnovers without formula breakage — use full-column references in SUMIFS/COUNTIFS.

## QA sample data

Populate Turnover Log with 15 rows across 3 cleaners ("Sarah — Smokies Clean", "Miguel — Ridge Housekeeping", "Jamie — Solo") over 6 properties, varied scores 30-40.

Expected Scorecard outputs (approx, formula-dependent):
- Sarah: 5 turnovers, avg ~38.4, issue rate 0%, rank 1
- Miguel: 6 turnovers, avg ~36.7, issue rate ~17%, rank 2
- Jamie: 4 turnovers, avg ~32.5, issue rate 50%, rank 3

## Upgrade CTA

On Welcome tab row 18: upgrade banner reading "Upgrade to the Operator Bundle at thestrledger.com/bundle — cleaner checklist + supply tracker + maintenance log + damage claim log, $97 instead of $180."

## Out-of-scope

- Photo uploads (Excel doesn't do this well)
- Cleaner payroll (separate T3 product, category H)
- Automated cleaner notifications (requires SMS automation — Phase 2+)
- Per-item deduction scoring (keep it simple: item checked or not)

---

## Implementation spec

### Workbook-level

- Filename: `OPS-001-turnover-checklist.xlsx`
- Tab colors: `COLOR_PRIMARY` (Harbor Navy) for Printable Checklist (cleaner-facing); `COLOR_SECONDARY` (Clay Rose) for all host-facing tabs (1, 3-6); Scorecard Dashboard uses `COLOR_ACCENT` (Muted Gold) for emphasis
- Default font: Calibri 11pt body; Georgia for tab titles
- Workbook protection: NONE

### Sheet 1 — "Welcome"

Brand header via `apply_brand_header(ws, "Cleaner Turnover Checklist + Scorecard", "Turnover chaos has a spreadsheet.")`.
Freeze: A5. Col width A=85.

| Row | Content |
|---|---|
| 5 | "How this works" — Georgia 14pt bold, primary color |
| 6 | "1. Print tab 2 (Printable Checklist) — one per turnover. Give to cleaner." |
| 7 | "2. Cleaner checks off each item, signs, dates, returns to you." |
| 8 | "3. After turnover, open tab 3 (Turnover Log). Add a row: date, property, cleaner, items checked, notes." |
| 9 | "4. Open tab 4 (Scorecard Dashboard). See who your best cleaner is at a glance." |
| 10 | "5. Tab 5 (Cleaner Roster): list all your cleaners. Dropdown on Turnover Log pulls from here." |
| 11 | "6. Tab 6 (Supplies Par Levels): optional — per-property stock targets." |
| 13 | "Before first use" — Georgia 14pt bold, primary |
| 14 | "• Go to tab 5, replace the 3 sample cleaners with your real ones." |
| 15 | "• Go to tab 4, replace sample property names (rows 18-23) with yours." |
| 16 | "• Print tab 2 for your next turnover." |
| 18 | Upgrade banner via `add_upgrade_banner(ws, 18)` |

### Sheet 2 — "Printable Checklist"

Tab color: `COLOR_PRIMARY`. Single-page letter-portrait.

Row 1-3: brand header ("Turnover Checklist" / "Print one per turnover").
Row 4: "Property:" | input | "Date:" | input — property + date on same row, inputs yellow-tinted.

Row 6 onwards: 8 zone sections. Each zone:
- Header row: zone name (e.g., "BEDROOM (6)") in Georgia 12pt bold primary, merged A:D
- Each item row: col A "☐" (size 14 checkbox), col B item text (size 10 wrap), col C initials blank (thin bottom border), col D empty buffer

8 zones with items:

**BEDROOM (6)** — Dust all horizontal surfaces (nightstands, dresser, headboard) / Strip and replace bed linens (crisp hospital corners) / Fresh pillowcases both sides / Vacuum under bed / Empty wastebasket / Check under bed for guest items

**BATHROOM (7)** — Scrub toilet inside + outside base / Clean mirror streak-free / Wipe sink + faucet / Scrub shower/tub including drain / Replace towels (bath, hand, face) / Restock toilet paper (min 2 rolls) / Empty wastebasket

**KITCHEN (8)** — Wipe all counters / Clean stovetop (all burners + under) / Wipe inside microwave / Run dishwasher if items inside / Wipe fridge exterior + handles / Check fridge interior for guest leftovers (discard) / Empty trash + replace liner / Restock coffee + filters (check par level)

**LIVING (5)** — Vacuum/sweep floors / Dust TV + surfaces / Fluff + realign pillows + throws / Wipe remote controls / Reset all furniture to original position

**OUTDOOR (4)** — Sweep porch/deck / Wipe outdoor furniture if present / Check hot tub cover seated + clean / Empty outdoor trash

**SUPPLIES (4)** — Coffee pods ≥ 10 / Paper towels ≥ 2 rolls / TP ≥ 2 per bathroom / Dish soap + dishwasher pods topped up

**SAFETY (3)** — All smoke detectors blinking green / All doors + windows locked / Keyless entry code reset (if applicable)

**FINAL WALK (3)** — Photograph each room (send to host via text) / Turn thermostat to host-preferred setting / Lock up + leave

Spacer row (blank) between zones.

After last zone (~row 55): signature block —
- "Cleaner name:" + input line (bottom border)
- "Date:" + input line
- blank row
- "Signature:" + input line merged B:D (bottom border)
- "Time on site (min):" + input line

Col widths: A=3 (checkbox), B=60 (item), C=10 (initials), D=15 (buffer).
Print area: A1:D<last_row>. Orientation: portrait. Letter paper. Fit to 1 page width and 1 page height.

### Sheet 3 — "Turnover Log"

Tab color: `COLOR_SECONDARY` (Clay Rose). Host-facing.

Brand header: "Turnover Log" / "One row per turnover".
Freeze: A6.

Row 5 styled headers (`header_row_style`): Date | Property | Cleaner | Items Checked (0-40) | Notes/Issues | Guest Complaint? | Minutes on Site

Col widths: A=12, B=22, C=22, D=18, E=40, F=16, G=12.

Data validation:
- Col B (Property): list formula `=Scorecard Dashboard!$A$18:$A$27`
- Col C (Cleaner): list formula `=Cleaner Roster!$A$6:$A$25`
- Col F (Guest Complaint): list `"Yes,No"`

Capacity rows 6-506 (500 turnovers).

Sample rows 6-20 (15 rows) — mix across 3 cleaners, 6 properties, varied scores:

| # | Date | Property | Cleaner | Items | Notes | Complaint | Min |
|---|---|---|---|---|---|---|---|
| 6 | 2026-03-14 | Smokies Ridge | Sarah — Smokies Clean | 40 | Perfect turnover | No | 95 |
| 7 | 2026-03-16 | Creek Side | Miguel — Ridge Housekeeping | 36 | Missed: smoke detectors check | No | 110 |
| 8 | 2026-03-18 | Lakehouse A | Sarah — Smokies Clean | 39 | Minor: 1 pillowcase off-center | No | 90 |
| 9 | 2026-03-20 | Smokies Ridge | Jamie — Solo | 32 | TP not restocked; shower drain clogged | Yes | 75 |
| 10 | 2026-03-21 | Lakehouse B | Miguel — Ridge Housekeeping | 38 | All good | No | 105 |
| 11 | 2026-03-23 | Smokies Ridge | Sarah — Smokies Clean | 38 | Missed outdoor trash | No | 92 |
| 12 | 2026-03-25 | Creek Side | Jamie — Solo | 30 | Coffee pods empty; mirror streaked | Yes | 65 |
| 13 | 2026-03-26 | Mountain View | Miguel — Ridge Housekeeping | 37 | (blank) | No | 100 |
| 14 | 2026-03-28 | Lakehouse A | Sarah — Smokies Clean | 40 | (blank) | No | 88 |
| 15 | 2026-03-29 | Downtown Loft | Miguel — Ridge Housekeeping | 35 | Dishwasher not run | No | 85 |
| 16 | 2026-03-30 | Smokies Ridge | Sarah — Smokies Clean | 37 | Late start — guest arrived early | No | 70 |
| 17 | 2026-04-01 | Lakehouse B | Jamie — Solo | 34 | Fridge not checked | No | 72 |
| 18 | 2026-04-03 | Mountain View | Miguel — Ridge Housekeeping | 36 | (blank) | No | 95 |
| 19 | 2026-04-05 | Creek Side | Jamie — Solo | 34 | Minor: thermostat not reset | No | 68 |
| 20 | 2026-04-07 | Lakehouse A | Miguel — Ridge Housekeeping | 38 | (blank) | No | 100 |

### Sheet 4 — "Scorecard Dashboard"

Tab color: `COLOR_ACCENT` (Muted Gold).

Brand header: "Cleaner Scorecard Dashboard" / "Rolling metrics per cleaner".
Freeze: A6.

Row 5 styled headers: Cleaner | Turnovers | Avg Score | Issue Rate | Rank

Rows 6-15 (10-cleaner capacity) — for each row `i`:
- Col A: cleaner name (typed)
- Col B: `=IF(A<i>="","",COUNTIF('Turnover Log'!C:C, A<i>))`
- Col C: `=IF(A<i>="","",IFERROR(AVERAGEIF('Turnover Log'!C:C, A<i>, 'Turnover Log'!D:D), 0))` format `0.0`
- Col D: `=IF(A<i>="","",IFERROR(COUNTIFS('Turnover Log'!C:C, A<i>, 'Turnover Log'!F:F, "Yes") / COUNTIF('Turnover Log'!C:C, A<i>), 0))` format `0%`
- Col E: `=IF(OR(A<i>="",B<i>=0),"",RANK.EQ(C<i>, $C$6:$C$15, 0))`

Pre-populate rows 6-8 with QA sample cleaner names: Sarah, Miguel, Jamie (full names as in roster).

Conditional formatting on C6:C15:
- ≥37: green fill `C7EFCF`
- 33-36.99: yellow fill `FFF3BF`
- 0.01-32.99: red fill `FFCCCC`

Row 17: "Properties (source for Turnover Log dropdown):" — Georgia 12pt bold primary.

Rows 18-27 (10-property capacity) col A: typed property list. Pre-populate 6 properties: "Smokies Ridge", "Creek Side", "Lakehouse A", "Lakehouse B", "Mountain View", "Downtown Loft".

### Sheet 5 — "Cleaner Roster"

Tab color: `COLOR_SECONDARY`.
Brand header: "Cleaner Roster" / "Your team, in one place".
Freeze: A6.

Row 5 headers: Name | Phone | Email | Pay Rate | Start Date | Notes
Col widths: A=28, B=18, C=28, D=12, E=14, F=40.

Rows 6-25 (20-cleaner capacity). Sample rows 6-8:
- ("Sarah — Smokies Clean", "(865) 555-0145", "sarah@smokiesclean.com", 45, "2025-06-01", "Flat rate per turnover; reliable")
- ("Miguel — Ridge Housekeeping", "(865) 555-0177", "miguel@ridgehk.com", 40, "2025-08-15", "Team of 2; can handle back-to-back")
- ("Jamie — Solo", "(865) 555-0192", "jamie.cleans@gmail.com", 35, "2026-01-10", "New — still ramping")

Col D (Pay Rate): currency format `"$"#,##0`.
Col E (Start Date): `yyyy-mm-dd`.

### Sheet 6 — "Supplies Par Levels"

Tab color: `COLOR_SECONDARY`.
Brand header: "Supplies Par Levels by Property" / "Bonus: per-property stock targets".
Freeze: B6.

Row 5 headers: Property | Coffee pods | Paper towels | TP rolls | Dish pods | Laundry pods | Shampoo | Body wash | Trash bags | Snacks

Col widths: A=20, B-J=12.

Rows 6-15 (10-property capacity). Sample rows 6-8:
- ("Smokies Ridge", 12, 4, 8, 30, 12, 3, 3, 20, 0)
- ("Creek Side", 10, 3, 6, 20, 10, 2, 2, 15, 0)
- ("Lakehouse A", 15, 4, 10, 30, 15, 4, 4, 25, 6)
