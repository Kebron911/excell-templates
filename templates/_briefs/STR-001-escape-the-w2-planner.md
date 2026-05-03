# Brief — STR-001 "Escape the W2" Planner

**SKU:** STR-001
**Category:** Strategic / Exit Planning (master spec §3.2 I #69)
**Tier:** T2
**Etsy price:** $27 (Lite — current state + target state, no acquisition schedule or healthcare bridge)
**Own-site price:** $47 (Full — full 7-tab build with date calculator)
**Wave:** 3 (build order #12 of the next 12 — emotional capstone)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Side-Hustle Sam — has 1-2 properties + a W2, asking "when can I quit?"
**Secondary:** Semi-Pro Sarah's husband — analytical, wants the spreadsheet that confirms or kills the dream.
**Tertiary:** Newbie Nina pre-purchase — uses to validate that the path is realistic before buying.

## The one specific pain

"I have 2 STRs and a W2 paying $145K. My partner asks every 6 months 'so when CAN you quit?' and I don't know. I have no idea if I'm 1 year away or 5. I just keep buying properties and hoping."

## What this template does

A career-transition planning workbook that:
1. Captures **current state** (W2 income + STR portfolio + expenses + runway)
2. Defines **target state** (replacement income + buffer + properties needed)
3. Builds a realistic **acquisition schedule** (year-by-year property adds with cash deployment)
4. Includes a **risk plan** with the items everyone forgets — healthcare bridge cost (COBRA → ACA), insurance gap, partner buy-in
5. Provides an **Optimistic vs Conservative toggle** — the spread becomes the actual conversation tool with a partner
6. Returns **THE quit date** as the headline output: "Based on your inputs, you can quit on November 14, 2028."

## Lite vs Full

**Lite (Etsy $27):** Tabs 1-3 (Start + Current + Target State). Calculates years-to-quit but no detailed acquisition schedule, healthcare bridge, or partner risk-share section.

**Full (Own-site $47):** All 7 tabs.

## Sheets / Tabs (Full = 7)

| # | Tab | Role | Lite |
|---|---|---|---|
| 1 | Start | THE quit date — large readout + spread (Optimistic to Conservative) | ✓ |
| 2 | Current State | W2 income + STR portfolio + expenses + runway | ✓ |
| 3 | Target State | Replacement income + buffer + properties needed | ✓ |
| 4 | Acquisition Schedule | Year-by-year property adds + cash deployment | ✗ Full only |
| 5 | Risk Plan | Healthcare bridge + insurance + partner buy-in | ✗ Full only |
| 6 | Quit Date Calculator | Toggle Optimistic / Conservative + assumptions | ✓ (simplified) |
| 7 | Conversation Doc (printable) | 1-page summary for the spousal/partner conversation | ✗ Full only |

## Inputs

**Current State:**
- W2 gross income $/yr
- W2 net income (after tax/401k/benefits) $/yr
- Current STR portfolio: # properties, total annual gross, total annual net (Schedule E line 26 number)
- Total annual household expenses
- Current liquid runway $ (cash, after closing costs on existing properties)
- Partner W2 income $/yr (if applicable)
- Annual benefits value W2 provides (employer 401k match $, health insurance $/yr, life insurance, other)

**Target State:**
- Target replacement income $/yr (default current W2 net + benefits cost)
- Buffer multiple (default 1.5× — to handle bad year)
- Target liquid reserve $ at quit (default 6 months expenses)
- Target # rental properties (or auto-calc from per-property net)
- Target stabilized net per property $/yr (default current portfolio's avg per-property net)

**Acquisition Schedule (Full):**
For each year (years 1-7 capacity):
- Properties added that year
- Cash deployed per property (downpmt + closing + rehab + furnish + reserve from ACQ-002 logic)
- Y1 net per added property (depressed, ~65% of stabilized)
- Stabilized year (typically Y2)
- Available cash (rolling: prior year cash + savings rate - properties acquired)

**Risk Plan (Full):**
- Healthcare current employer cost $/yr
- Healthcare COBRA cost $/yr (typical 102% of full premium; auto-pop default $14,400/yr family of 4)
- Healthcare ACA cost $/yr (typical $9,600-$14,400/yr post-subsidies depending on income)
- Healthcare bridge years (COBRA = 18 months, then ACA)
- Disability insurance lost (if employer-paid)
- Life insurance lost (if employer-paid)
- Partner risk-share: % of expenses partner can cover during transition
- Partner buy-in: 1-5 (1=skeptical, 5=enthusiastic) — drives Conservative scenario heavily

**Quit Date Calculator (Full):**
- Optimistic vs Conservative toggle
- Assumption set per scenario: Y1 occ % / stabilized occ % / acquisition pace / appreciation %

## Outputs

**Start tab — THE answer:**
- "OPTIMISTIC quit date: <month, day, year>" Georgia 28pt bold gold
- "CONSERVATIVE quit date: <month, day, year>" Georgia 24pt bold dark
- The spread between them is the conversation: "<X> years between best and worst case"
- Below: 4 critical numbers — Properties needed, Cash needed at quit, Healthcare bridge cost, Y1-after-quit projected net
- Below: a calm narrative paragraph (programmatically generated based on inputs) — "You're <X> properties + $<Y> away. Two paths get you there: <a> and <b>. The biggest swing factor is <healthcare/acquisition pace/partner support>. Re-run when you close on a property."

**Current State summary:** YTD STR net + W2 net + total household income + savings rate %.

**Target State summary:** Target income + buffer requirement + properties needed at current per-property economics.

**Acquisition Schedule:**
- 7-year table: Year | Props added | Cash deployed | Y1 net added | Stabilized net total | Cumulative net | Reaches target? Y/N
- Conditional formatting: gold-soft fill on row where Cumulative net ≥ target

**Risk Plan:**
- Healthcare bridge total cost = COBRA period × COBRA cost + ACA period × ACA cost (until property income covers it)
- Insurance gap calculation
- Partner risk-share applied to expense base in Conservative scenario

**Conversation Doc (printable, 1-page):**
The single sheet to print and put on the kitchen table:
- Quit date: optimistic + conservative
- The 4 critical numbers
- The 3 biggest swing factors
- Action plan: next 3 properties + when to acquire
- Risk acknowledgments + partner sign-off line

## External data references

- IRS Schedule E (rental income definitions)
- COBRA cost typical (102% of premium, 18-month max — DOL reference)
- ACA marketplace cost ranges (HealthCare.gov / Kaiser Family Foundation typical numbers, cited)
- Disability insurance / life insurance benchmarks (industry data)

## Business logic

- **Voice discipline.** §6.1 voice rules forbid "unlock financial freedom," "escape the 9-to-5," or hype. Calm authority is the differentiator. The product is *more* shareable when it sounds like a CFO than a guru.
- **Optimistic vs Conservative is the marketing-couple-conversation tool.** The number itself isn't the answer; the spread is.
- **Healthcare bridge** is the W2-quit blocker no one talks about. COBRA → ACA timeline + cost is a non-negotiable inclusion.
- **Partner buy-in** is the gating factor most spreadsheets ignore. Sliding scale 1-5 affects the Conservative scenario heavily.
- **No "no money down" magic.** Acquisition schedule shows real cash deployment based on user's savings rate.
- Capacity: 1 household per workbook.
- Conservative scenario: lower stabilized occ, slower acquisition pace, lower appreciation, stricter buffer multiple.
- Optimistic scenario: current portfolio's actual numbers extrapolated cleanly.

## QA sample data

Side-Hustle Sam scenario:
- W2 gross $145K, net $98K, benefits value $18K
- Partner W2 net $72K
- Current portfolio: 2 properties, $58K gross, $19K net YTD (Y1 + Y2 mix)
- Annual household expenses: $96K
- Current liquid: $48K
- Target replacement income: $98K + $14K healthcare bridge = $112K/yr
- Target buffer: 1.5× = $168K stabilized portfolio net needed
- Avg stabilized net per property (from Sam's #1 property in Y3): $14K
- Target props needed: 12

Optimistic scenario (3 props/yr, current per-property economics): quit date 2030-08-15
Conservative scenario (1.5 props/yr, -10% stabilized net, COBRA 18mo): quit date 2032-04-22
Spread: 1 year, 8 months
Healthcare bridge cost: ~$28,800 (18mo COBRA × $14,400 + 6mo ACA × $9,600)
Y1-after-quit projected net (Year 1 conservative): $78K — short of target, so partner W2 covers gap until Y2.

## Upgrade CTA

Start tab (Lite): "Want healthcare bridge math + partner risk-share + printable conversation doc? Upgrade to Full at thestrledger.com/escape-w2 — $47."

Start tab (Full): "Need to underwrite the next acquisitions? Get the STR Deal Analyzer (ACQ-001) at thestrledger.com — $47."

## Out-of-scope

- Tax planning around W2 transition (separate territory; flag for CPA)
- 401k rollover decisions
- Spouse already at home / single-income households (Conservative-only path supports this but not deeply modeled)
- International (US healthcare assumptions only)
- Specific property recommendations or markets

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `STR-001-escape-the-w2-planner-DEMO.xlsx` + `-BLANK.xlsx` (Full); `STR-001-escape-the-w2-planner-lite.xlsx` (Lite)
- Mode: Wizard
- Tab colors: Start = `COLOR_PRIMARY`; Current State/Target State/Acquisition Schedule = `COLOR_SECONDARY`; Risk Plan/Quit Date Calculator = `COLOR_ACCENT`; Conversation Doc = `COLOR_PARCHMENT_ALT`
- Single build script with `is_lite` flag emits both.
- SKU tag "STR-001 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Escape the W2 Planner", "When the math says you can.")`.

THE answer block rows 8-22:
- Row 8: "OPTIMISTIC QUIT DATE" Georgia 14pt
- Row 9: <date> Georgia 28pt bold gold
- Row 11: "CONSERVATIVE QUIT DATE" Georgia 14pt
- Row 12: <date> Georgia 24pt bold dark navy
- Row 14: "Spread: <X years, Y months>" italic muted
- Rows 16-22: 4 critical-numbers block + narrative paragraph

NOTE: voice discipline applies — the narrative paragraph is calm, specific, no hype. §6.1 rules.

### Sheet 6 — Quit Date Calculator
Tab color `COLOR_ACCENT`. Toggle Optimistic / Conservative (cell B5 data validation). Assumption table per scenario rows 8-25.

Date calculation: `=DATE(start_year + years_to_target, MOD(years_to_target * 12, 12) + 1, 15)` — 15th of the month for cleaner display. Years-to-target derived from acquisition schedule + savings rate + portfolio compounding.

### Sheet 7 — Conversation Doc (Full only)
Tab color `COLOR_PARCHMENT_ALT`. Print area portrait letter A1:E45.

Layout:
- Header: "Our Path Off W2 — <date>"
- Quit dates (optimistic + conservative)
- 4 critical numbers
- 3 biggest swing factors (formula-derived)
- Action plan rows
- Risk acknowledgments
- Partner sign-off lines (2)

Calm voice throughout. No emojis. No hype.
