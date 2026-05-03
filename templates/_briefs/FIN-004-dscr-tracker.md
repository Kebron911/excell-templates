# Brief — FIN-004 DSCR Tracker (Debt Service Coverage Ratio)

**SKU:** FIN-004
**Catalog #:** 15 (master spec §3.2 A)
**Mode:** Operational (calculator + register)
**Tier:** T2
**Fork from:** `build_break_even_occupancy.py` (single-page calc) + `build_revpar_dashboard.py`
**Filenames:** `FIN-004-dscr-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Computes DSCR (Net Operating Income ÷ Annual Debt Service) per property and portfolio-wide. Critical for portfolio hosts pursuing DSCR loans (no W-2 needed if DSCR ≥ 1.20). Surfaces: which properties qualify for refinance, which need rate-shopping, which are at-risk if occupancy drops 10%.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (portfolio DSCR, # properties ≥1.20, weakest property) + → Update Inputs |
| 2 | Per-Property | Per-property NOI, debt service, DSCR (capacity 10) |
| 3 | Stress Test | What-if: -10% / -20% / -30% revenue, recompute DSCR |
| 4 | Refi Eligibility | Properties qualifying for DSCR loan refinance per common LTV/DSCR thresholds |
| 5 | Settings | Property list, DSCR thresholds (1.20 typical), active year |

## Per-Property table
Cols (10 properties as rows):
A Property | B Annual gross revenue | C Operating expenses (no mortgage) | D NOI (formula `=B-C`) | E Mortgage P&I monthly | F Annual debt service (formula `=E*12`) | G Other annual debt (HELOC, etc.) | H Total debt service (formula `=F+G`) | I DSCR (formula `=D/H`) | J Status (formula `=IF(I>=1.20,"✅ Qualifies",IF(I>=1.0,"⚠ Marginal","🔴 Negative"))`)

Bottom row: portfolio totals + portfolio DSCR.

Conditional formatting on I: green ≥1.20, gold 1.0-1.19, red <1.0.

## Stress Test tab
Same per-property layout but revenue scaled down:
- Scenario 1: -10% revenue
- Scenario 2: -20% revenue
- Scenario 3: -30% revenue (recession-like)
Each scenario shows revised DSCR and which properties drop below 1.0.

## Refi Eligibility
Per property:
- Current DSCR
- Estimated property value (input)
- Current loan balance (input)
- Implied LTV
- Lender DSCR-loan eligibility flag (formula: needs DSCR ≥ 1.20 AND LTV ≤ 75%)

## Sample data (DEMO)
3 properties: Smokies Ridge DSCR 1.42 (qualifies), Lakehouse 1.18 (marginal), Creek Side 0.94 (negative — at risk). Portfolio DSCR 1.21.

Stress test shows Lakehouse drops to 0.94 at -10%, Creek Side to 0.76. Smokies still qualifies even at -20%.

## Settings
- B5 Active year
- B7 DSCR threshold for "qualifies" (default 1.20)
- B9 DSCR threshold for "negative" (default 1.0)
- B11-B20 Property list
