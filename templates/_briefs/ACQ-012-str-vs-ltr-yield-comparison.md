# Brief — ACQ-012 STR vs LTR Yield Comparison

**SKU:** ACQ-012
**Catalog #:** 32 (master spec §3.2 B)
**Mode:** Operational (calculator)
**Tier:** T2
**Fork from:** `build_str_deal_analyzer.py` (calc pattern) + `build_break_even_occupancy.py`
**Filenames:** `ACQ-012-str-vs-ltr-yield-comparison-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For a single property, compares running it as a short-term rental (Airbnb model) vs long-term rental (12-month lease). Computes all-in yield each way. STR has higher revenue but higher costs (cleaning, supplies, mgmt, vacancy, regulation risk). LTR has lower revenue but lower costs and less time. The workbook a host runs when their city threatens an STR ban.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (STR NOI, LTR NOI, $ Δ, time investment Δ) + → Compare |
| 2 | Inputs | Property cost basis, financing, side-by-side STR + LTR revenue/expense assumptions |
| 3 | Side-by-Side | Computed: NOI, CoC, cap rate, hours/week, regulatory risk score |
| 4 | Decision Notes | Free-form with prompts (regulation risk, life stage, time available) |
| 5 | Settings | Property name, active year |

## Inputs tab — STR column
- Projected occupancy %
- Projected ADR
- Annual gross revenue (formula)
- Cleaning cost / turnover × turnovers/year
- Supplies / consumables annual
- Software (PMS, dynamic pricing) annual
- Channel/PM fee % (Airbnb 3% or PM 20%)
- Insurance (STR-specific premium)
- Utilities annual (host pays)
- Maintenance reserve %
- Host hours/week (unpaid labor)

## Inputs tab — LTR column
- Monthly rent ($)
- Annual gross revenue (formula `=monthly * 12`)
- Vacancy % (typical 5%)
- Property mgmt fee % (typical 8% if managed)
- Insurance (LTR premium — usually lower)
- Maintenance reserve %
- Tenant turnover cost (annualized)
- Host hours/week (much lower)

## Side-by-Side
3 cols: STR | LTR | Difference. Rows:
- Annual gross revenue
- Operating expenses (each line)
- NOI
- Debt service (same)
- Cash flow
- CoC (cash flow / cash invested)
- Cap rate (NOI / property value)
- Hours/week
- $/hour (cash flow / annual hours) — surfaces "you're working for $14/hr on STR"
- Regulatory risk score (1-10 input)
- 5-year cumulative cash flow

Highlight winner per row.

## Sample data (DEMO)
Smokies Ridge cabin, $485K, $96K/yr STR vs $2,800/mo LTR ($33.6K/yr).
- STR: NOI $42K, CoC 14%, 8 hrs/wk
- LTR: NOI $22K, CoC 6%, 0.5 hrs/wk
- $ effective per hour STR: $50/hr, LTR: $462/hr (counterintuitive insight)
- Regulatory risk STR 7/10, LTR 1/10

## Settings
- B5 Property name
- B7 Active year
- B9 Property value (drives cap rate)
