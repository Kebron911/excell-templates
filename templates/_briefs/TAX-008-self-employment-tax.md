# Brief — TAX-008 Self-Employment Tax Calculator

**SKU:** TAX-008
**Category:** Financial / Accounting (master spec §3.2 A #5)
**Tier:** T2
**Etsy price:** $27
**Wave:** 2 (Tax Season Bundle)
**Mode:** Wizard (DEMO + BLANK)
**Campaign tagline:** Compute your SE tax. Pay less by knowing the rules.

## Target persona

**Primary:** Schedule C-filing STR host (substantial-services hosts) — owes 15.3% SE tax that doesn't exist on Schedule E. Wants the full picture before quarterly estimateds.
**Secondary:** Mixed filer (one Schedule E + one Schedule C side gig).

## The one specific pain

"I switched to Schedule C this year because I'm providing concierge services and my CPA said I'd owe SE tax. I have no idea what that means in dollars. Last year my CPA mentioned $4,500 — but I want to model it before I sign returns."

## What this template does

Walks through the IRS Schedule SE flow: net SE income → 92.35% × → 15.3% (12.4% Social Security up to wage base + 2.9% Medicare unlimited + 0.9% Additional Medicare over threshold) → half-SE-tax adjustment to AGI.

Includes:
- **Wage base** check (2026 = $176,100) — Social Security stops above this
- **Multi-source SE income** — combines Schedule C + Schedule F + partnership K-1
- **Spouse-also-SE** scenario — each spouse computes separately, no combination
- **W-2 offset** — if customer has W-2 wages, those count toward the wage base

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 0 | Start | Wizard hero + 3-card + Quick Start + Get Started + progress |
| 1 | Net SE Income | Schedule C / F / partnership K-1 inputs |
| 2 | Wage Base & W-2 | W-2 wages this year (yours + spouse), wage-base check |
| 3 | SE Tax Calc | 92.35% × 15.3% computation step-by-step |
| 4 | Adjustments | Half-SE-tax, Additional Medicare ($200K/$250K thresholds) |
| 5 | Schedule SE Map | Auto Schedule SE Part I + Part II mirror |
| 6 | Launch | Total SE tax + adjustment summary + print packet |
| 7 | Settings | Active tax year · brackets · wage-base reference |

## Inputs

**Net SE Income (3 fields):** Schedule C net profit, Schedule F net (farm), Partnership SE income (Box 14A on K-1).

**Wage Base & W-2 (2 fields):** Your W-2 wages + tips, Spouse W-2 wages (if both have SE income).

**SE Tax Calc:** all computed (no inputs).

**Adjustments (1 field):** Filing status (drives Additional Medicare $200K single / $250K MFJ threshold).

## Outputs

- Net earnings from SE (NESE) = SE income × 92.35%
- Social Security portion = MIN(NESE, wage_base − W-2 wages) × 12.4%
- Medicare portion = NESE × 2.9%
- **Additional Medicare** (0.9%) on portion above $200K single / $250K MFJ
- Total SE tax (Sched 2 Line 4)
- Half-SE-tax adjustment (Sched 1 Line 15) — deductible above the line
- Schedule SE Part I + Part II mirror — print-ready

## External tax references

- **IRS Schedule SE (2025 instructions)**
- **IRC §1401** — SE tax rates
- **IRC §1402** — Net earnings from SE
- **IRC §3121(a)(1)** — wage base ($176,100 for 2026)
- **IRC §1401(b)(2)** — Additional Medicare tax (0.9%)

## Business logic

- Net SE income < $400 → no SE tax (de minimis exception).
- Wage base for 2026 = $176,100 (editable on Settings, updated annually).
- SS portion calc: MIN(NESE, $176,100 − W-2 wages) × 12.4%. If W-2 already exceeds wage base, NO SS portion (still owe Medicare).
- Medicare portion: NESE × 2.9%, no cap.
- Additional Medicare 0.9%: applies to (NESE + W-2 wages) above the threshold ($200K single / $250K MFJ).
- Half SE tax adjustment: SE tax × 50%, deductible on Form 1040 Schedule 1 Line 15 (reduces AGI).

## QA sample data (DEMO)

Sarah's Sched C: $43,000 net profit. No spouse W-2 SE. Her own W-2: $0. Filing MFJ. Expected:
- NESE = $39,706
- SS: $39,706 × 12.4% = $4,924
- Medicare: $39,706 × 2.9% = $1,151
- Total SE tax = $6,075
- Half-deductible adjustment = $3,037

## Out-of-scope

- Optional methods (farm or non-farm) — rare for STR
- Foreign-earned-income exclusion intersection
- Religious-employment exemption
- Statutory employee complexity

## Upgrade CTA

Tax Season Bundle ($147).
