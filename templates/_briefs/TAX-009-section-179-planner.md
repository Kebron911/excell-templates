# Brief — TAX-009 Section 179 Planner

**SKU:** TAX-009
**Category:** Financial / Accounting (master spec §3.2 A #8)
**Tier:** T2
**Etsy price:** $27
**Wave:** 2 (Tax Season Bundle)
**Mode:** Wizard (DEMO + BLANK)
**Campaign tagline:** Front-load this year's depreciation. Legally.

## Target persona

**Primary:** Schedule C-filing STR host (active business) — bought new appliances, furniture, vehicle ≥6,000 lb GVWR, computers, security systems. Wants to deduct it this year, not over 5/7 years.
**Secondary:** Schedule E filer with active participation — eligible for §179 on rental property assets up to a limit; wants the math.

## The one specific pain

"I bought a $4,800 hot tub for the new STR and a $1,200 outdoor sofa set. My CPA mentioned 'Section 179' but said 'we'll see at tax time.' I want to know NOW if I can write the whole $6K off this year — and what cap might bite me."

## What this template does

Walks through eligibility for **Section 179 expensing** (IRC §179), checks the income limitation (deduction can't exceed business income), models the **bonus depreciation** alternative (40% in 2026, phasing down to 0% in 2027), and outputs:
- Per-asset election: §179 / Bonus / MACRS regular
- Total §179 elected this year
- Total bonus depreciation this year
- Carryover §179 (income-limited)
- Form 4562 Part I + Part II mirror (print-ready)

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 0 | Start | Wizard hero + 3-card + Quick Start + Get Started + progress |
| 1 | Eligibility | Active trade/business test, listed-property 50% test, Sched C/E classification |
| 2 | Asset List | Up to 15 assets — description, cost, date placed in service, % business use |
| 3 | Election Per Asset | Toggle §179 / Bonus / MACRS for each asset |
| 4 | Income Limitation | Business income input, §179 cap test, carryover calc |
| 5 | Form 4562 Map | Auto-built Form 4562 Part I (§179) + Part II (Bonus) mirror |
| 6 | Launch | Total deduction summary + print packet |
| 7 | Settings | Active tax year · §179 cap · phase-out threshold · bonus % |

## Inputs

**Eligibility (3 fields):** Active business? (Y/N), Schedule classification (E/C), Listed property usage > 50%? (drives if §179 allowed for vehicles).

**Asset List (per asset, up to 15):** Description, MACRS class (5/7/15/27.5/39 yr), Cost, Date placed in service, % business use, Vehicle? (Y/N — adds caps).

**Election Per Asset (1 field per asset):** Method = §179 / Bonus / MACRS.

**Income Limitation (1 field):** Net business income before §179.

## Outputs

- Per-asset deduction this year (§179 / Bonus / MACRS-Y1)
- Total §179 elected vs §179 cap ($1,250,000 for 2026)
- Phase-out check (cap reduces $-for-$ if total purchases > $3,130,000)
- Income limitation: §179 ≤ business income (excess carries forward)
- Total bonus depreciation (40% × asset cost × biz % for 2026 placed-in-service)
- Form 4562 Part I (§179) + Part II (Bonus) mirror — print
- Schedule routing — Schedule C Line 13 (Form 4562 to Schedule C) or Schedule E Line 18

## External tax references

- **IRC §179** — election to expense
- **IRC §168(k)** — bonus depreciation (40% in 2026, 20% in 2027, 0% in 2028)
- **Form 4562** — Depreciation and Amortization
- **Pub 946** — How to Depreciate Property
- **Rev. Proc. 2025-20** — 2026 §179 cap = $1,250,000 (illustrative; update annually)

## Business logic

- §179 cap (2026): $1,250,000.
- §179 phase-out threshold (2026): $3,130,000 — every $1 of purchases over this reduces cap $1.
- Income limitation: §179 deduction ≤ aggregate net business income from all trades. Excess carries forward indefinitely.
- Bonus depreciation 2026: 40%. Applies to qualified property (new + used, recovery period ≤ 20 years). Phases down to 20% in 2027, 0% in 2028.
- Listed property (vehicles, computers historically): §179 allowed only if business use > 50%. If business use ≤ 50%, no §179 allowed and only straight-line MACRS.
- Vehicle §179 cap: $20,400 for SUV/truck > 6,000 lb GVWR but ≤ 14,000 lb (2026 illustrative).
- Mileage Log assets are not depreciated here — that's the Mileage Log's domain (Standard Mileage Rate).
- Schedule E filers: §179 historically NOT allowed for residential rental real estate, BUT IS allowed for personal-property assets *used in* an active rental business (appliances, furniture, etc.). Non-real-estate test.

## QA sample data (DEMO)

5 assets:
1. Hot tub (10-yr personal property, 100% business): $4,800, placed 2026-04-15
2. Outdoor sofa set (5-yr): $1,200, placed 2026-05-02
3. Smart TV + stand (5-yr): $980, placed 2026-03-20
4. Industrial vacuum (7-yr): $620, placed 2026-02-10
5. Pickup truck > 6,000 lb (5-yr, 80% business): $48,000, placed 2026-01-15 — vehicle cap applies

Net biz income: $43K. Expected total §179: ≤ $43K (income limited). Total cost = $55,600. Truck §179 cap = $20,400 → biz portion = $20,400 × 80% = $16,320.

## Out-of-scope

- §168(k) elections nuances (MQ, HY conventions)
- Qualified Improvement Property (QIP) — separate scope
- Cost-segregation studies — separate (T3) SKU
- Heavy-vehicle bonus depreciation interactions (very specific)

## Upgrade CTA

Tax Season Bundle ($147).
