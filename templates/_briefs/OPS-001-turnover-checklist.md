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
