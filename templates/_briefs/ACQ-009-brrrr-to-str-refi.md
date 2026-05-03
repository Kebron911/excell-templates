# Brief — ACQ-009 BRRRR-to-STR Refi Math

**SKU:** ACQ-009
**Catalog #:** 27 (master spec §3.2 B)
**Mode:** Operational (calculator)
**Tier:** T3
**Fork from:** `build_str_deal_analyzer.py` (calc pattern) + `build_break_even_occupancy.py`
**Filenames:** `ACQ-009-brrrr-to-str-refi-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Models the BRRRR (Buy, Rehab, Rent, Refinance, Repeat) strategy specifically for STR. Computes ARV (after-repair value), refinance cash-out at 70-75% LTV, cash-left-in (or returned), DSCR after refi, and whether the deal repeats Sarah's capital. Solves "did this BRRRR actually return all my cash?"

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (cash invested, cash returned, % capital returned, post-refi DSCR) + → Inputs |
| 2 | Acquisition + Rehab | Buy price, closing costs, rehab budget, holding costs, total cash in |
| 3 | ARV + Refi | ARV estimate (3 comp methods), max LTV, refi loan amount, cash returned |
| 4 | Post-Refi Operating | Year-1 STR revenue, expenses, NEW debt service, cash flow, DSCR |
| 5 | Settings | Property name, target LTV, refi rate assumption |

## Acquisition + Rehab columns
- Purchase price
- Closing costs (typically 2-3% of price)
- Hard money / acquisition loan (if applicable)
- Down payment + closing in cash
- Rehab budget
- Furniture budget (often deferred to post-refi)
- Holding costs (insurance, utilities, taxes, interest during rehab — months × monthly cost)
- Total cash in (formula)

## ARV + Refi
- ARV estimate via 3 methods: comp sales, cap rate × Year-1 NOI, $/sq ft × sq ft. Display all 3 with average.
- Selected ARV (host picks)
- Target LTV (default 75% — DSCR loan typical)
- Max refi loan amount (formula `=ARV * LTV`)
- Less: original loan payoff (if HML used)
- = Cash out at refi
- Refi closing costs (~3%)
- Net cash returned after refi (formula)
- Cash left in deal (formula `=cash in - cash returned`)
- % capital returned (formula `=cash returned / cash in`)

## Post-Refi Operating
- Year-1 STR projected revenue
- Operating expenses
- NOI
- New mortgage P&I (at refi rate × refi amount)
- Cash flow (NOI - debt service)
- DSCR (NOI / debt service) — must hit ≥1.20 for DSCR loan
- Cash-on-cash return on cash-left-in

## Sample data (DEMO)
Smokies Ridge BRRRR:
- Purchase $385K (distressed)
- Rehab $52K + furniture $28K
- Holding costs $8K (4 months)
- Total cash in $112K (after HML payoff)
- ARV $585K
- Refi 75% LTV = $438.75K
- Cash returned $96K
- Cash left in $16K (86% returned)
- Post-refi DSCR 1.31 ✅
- CoC return on $16K: 38%

## Settings
- B5 Property name
- B7 Target LTV (default 75%)
- B9 Refi rate assumption (current: 7.25%)
- B11 Refi term (default 30 yrs)
