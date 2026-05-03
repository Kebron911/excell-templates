# Brief — FIN-002 Break-even Occupancy Calculator

**SKU:** FIN-002
**Category:** Financial / Accounting (master spec §3.2 A #16)
**Tier:** T1
**Etsy price:** $17
**Own-site price:** $17 (volume tripwire — same price both surfaces)
**Wave:** 3 (build order #2 of the next 12)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Side-Hustle Sam (1-2 listings) — wants the single-number answer to "how empty can this place get before I'm losing money?"
**Secondary:** Semi-Pro Sarah (3-10 listings) — re-runs across each property when costs change (insurance bump, mortgage refi, cleaner rate hike).
**Tertiary:** Newbie Nina — runs this against the underwriting estimate from #21 Deal Analyzer to sanity-check.

## The one specific pain

"Insurance went up $1,400 this year and the cleaner just bumped to $185 a turnover. I have no idea what occupancy I now need to hit to break even, and I won't know until December when the books close."

## What this template does

A focused, single-property calculator that returns one number — the break-even occupancy % — and shows the math + a sensitivity table around it. Ships in 1 day; the workhorse of the suite. Becomes the formula foundation that #50 Cleaning Fee Optimizer reuses.

## Sheets / Tabs (3)

| # | Tab | Role |
|---|---|---|
| 1 | Start | The answer lives here — break-even %, current %, margin gauge |
| 2 | Calculator | One-page input panel (revenue assumptions + cost lines) |
| 3 | Sensitivity | Occ 30/40/50/60/70/80% × ADR -10/0/+10 grid |

## Inputs (Calculator tab)

Revenue side (rows 8-14):
- Property name (free text)
- Avg nightly rate (ADR) ($)
- Cleaning fee charged to guest ($)
- Avg length of stay (nights)
- Available nights/year (default 365 minus blocked)
- Blocked nights (personal use + maintenance + owner stays)
- Platform commission % (default 15%)

Cost side (rows 18-36):
- Mortgage interest ($/mo) — annualized in formula
- Property tax ($/yr)
- Insurance ($/yr)
- HOA / utilities / internet ($/mo each)
- Management fee % (if applicable)
- Cleaning cost paid (per turnover, $)
- Supplies (per turnover, $) — toiletries, linens replacement
- Maintenance reserve ($/yr — default 5% of revenue)
- Marketing/photos ($/yr)
- Software/PMS ($/mo)
- Other ($/yr free-text label + amount)

## Outputs

**Calculator tab (rows 40-50):**
- Total fixed costs/yr (mortgage int + tax + insurance + HOA + insurance + marketing + software + other)
- Variable costs/turnover (cleaning paid + supplies + maintenance reserve allocation)
- Variable costs/night (variable per turnover ÷ avg LOS + per-night utilities allocation)
- Net revenue/night (ADR × (1 - platform commission) + cleaning fee charged ÷ LOS - cleaning cost paid ÷ LOS)
- Contribution margin/night = Net revenue/night - variable costs/night
- **Break-even nights/year = Total fixed costs ÷ contribution margin/night**
- **Break-even occupancy % = Break-even nights ÷ Available nights**

**Start tab headline (rows 8-14):**
- Property name (pulled from Calculator!B8)
- "Break-even occupancy: XX%" Georgia 28pt bold gold
- "Equivalent: NN booked nights/year (≈ NN/month)"
- "Current occupancy (manual entry): YY%" — input cell
- Margin: gauge that says "✅ Margin = Y-X pp" (green) or "⚠ Below break-even" (red)
- Footnote: "This calculation covers operating costs + mortgage *interest*. It does NOT cover principal paydown or owner labor. True break-even for cash flow is higher."

**Sensitivity tab:**
- 6×3 grid: rows = occupancy 30/40/50/60/70/80%; cols = ADR -10% / current / +10%
- Each cell: annual net cash flow at that scenario, conditional formatting (red <0, parchment 0-5K, gold-soft >5K)

## External data references

None. Pure user-input calculator.

## Business logic

- **Two-tab discipline.** Resist bloat. Sensitivity is a single grid, not a workbook.
- "Pull from your TAX-002 P&L" callout box on Calculator tab telling customer which cells in their P&L feed which inputs here. Do NOT live-link — file paths break.
- Footnote about what break-even DOES and does NOT cover (principal, owner time) — this is the integrity differentiator vs. every other break-even template.
- Available nights default 365 minus blocked; user can override to 350 to account for typical maintenance window.
- Platform commission is a % not a flat — applies to revenue side, not cost side, since Airbnb's cut is netted from payout.

## QA sample data

Smokies Ridge Cabin:
- ADR $245, cleaning fee charged $150, avg LOS 3.2 nights, available 350 nights, blocked 15, platform 15%
- Mortgage interest $400/mo, tax $4,800/yr, insurance $2,400/yr, HOA $0, utilities $180/mo, internet $80/mo, management 0%, cleaning paid $150/turnover, supplies $25/turnover, maintenance reserve 5%, marketing $600/yr, software $40/mo, other $0

Expected outputs:
- Total fixed costs: ~$13,860
- Contribution margin/night: ~$165
- Break-even nights: ~84/year
- Break-even occupancy: ~24% — but this is mortgage-interest-only; with full debt service ~38%
- Sensitivity grid populated showing $-19K loss at 30% occ × ADR -10%, +$24K profit at 70% × ADR +10%

## Upgrade CTA

Start tab row 22: "Want the full P&L picture? Get the Single-Property P&L Tracker (TAX-002) at thestrledger.com — Schedule E-ready, $47."

## Out-of-scope

- Multi-property break-even (use the multi-property master P&L instead)
- Mortgage principal paydown / amortization
- Tax-adjusted break-even
- Currency support beyond USD

---

## Implementation spec (v2.2)

### Workbook-level
- Filename: `FIN-002-break-even-occupancy.xlsx` (single file — no DEMO/BLANK split; sample fills are the demo, "Reset" instructions on Start tab)
- Mode: Wizard (one-shot per property)
- Tab colors: Start = `COLOR_PRIMARY`; Calculator = `COLOR_SECONDARY`; Sensitivity = `COLOR_ACCENT`
- SKU tag "FIN-002 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Break-even Occupancy", "How empty can it get before you're losing money?")`.

Rows 8-14: headline answer block (centered)
- Row 8: property name pulled from Calculator!B8 (Georgia 16pt italic gold)
- Row 10: "Break-even occupancy" label / Row 11: large % readout 28pt bold gold
- Row 12: "= NN booked nights/year (≈ NN/month)" italic muted
- Row 14: "Your current occupancy:" label + input cell B14
- Row 15: Margin gauge — formula returns ✅ or ⚠ string with color via conditional formatting

Row 17: footnote (italic muted, wrap, parchment fill): "This break-even covers operating costs + mortgage interest. It does NOT cover principal paydown or owner labor. True cash break-even is higher."

Row 19 pseudo-button row: → Calculator · → Sensitivity Table

Row 22: upgrade banner (parchment-alt fill).

Footer.

### Sheet 2 — Calculator
Col widths: A=42 (label), B=18 (value), C=42 (note). Freeze A8.
Row 5 navy band: "Calculator" / "All inputs on one page."

Section bands:
- Row 7: REVENUE ASSUMPTIONS (gold-soft band)
- Rows 8-14: 7 input rows
- Row 16: ANNUAL FIXED COSTS (gold-soft band)
- Rows 17-26: 10 cost lines
- Row 28: PER-TURNOVER VARIABLE COSTS (gold-soft band)
- Rows 29-32: 4 variable lines
- Row 34: PER-MONTH RECURRING (gold-soft band)
- Rows 35-37: 3 recurring lines
- Row 39: OUTPUTS (navy band)
- Rows 40-50: 11 calculated rows ending in break-even % at row 50 (large bold gold)

"Pull from your TAX-002 P&L" callout on the right side col C, rows 16-26 (instructions referencing specific Schedule E line numbers).

Currency format `"$"#,##0.00` on $ cells. Percent format on commission/margin cells.

### Sheet 3 — Sensitivity
Col widths: A=14, B-D=16. Freeze A6.

Row 5: "Annual cash flow at scenario" (Georgia 14pt bold)
Row 6: header — "" | "ADR -10%" | "Current ADR" | "ADR +10%"
Rows 7-12: 6 occupancy rows (30%, 40%, 50%, 60%, 70%, 80%) each with 3 calculated cells

Each cell formula: `=(Calculator!$B$10 * (1 + adr_delta)) * Calculator!$B$13 * occ_pct - Calculator!$B$50_fixed_costs - variable_terms`. Properly use named ranges or cell references; format `"$"#,##0`.

Conditional formatting: red <0, parchment 0-5000, gold-soft >5000. Bold border around the "current ADR × current occ" cell.

Row 14: italic note "Bold cell = your current scenario. Numbers below the bold cell mean current operations are losing money — even though break-even occupancy says you're OK, ADR or cost shifts can flip the answer."
