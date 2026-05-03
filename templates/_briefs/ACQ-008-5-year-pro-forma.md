# Brief — ACQ-008 5-Year Pro-Forma Builder

**SKU:** ACQ-008
**Catalog #:** 26 (master spec §3.2 B)
**Mode:** Operational (matrix forecast)
**Tier:** T3
**Fork from:** `build_str_deal_analyzer.py` (Year-1 underwriting) + `build_pl_single_property.py` (matrix)
**Filenames:** `ACQ-008-5-year-pro-forma-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
5-year property-level pro-forma with rev growth, expense inflation, debt amortization, depreciation, and cumulative cash flow. Outputs IRR, equity multiple, and exit value at year 5 across 3 scenarios (conservative / base / aggressive). The workbook a serious operator runs before writing an offer.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (Year-5 NOI, IRR, equity multiple) + → Inputs |
| 2 | Inputs | Purchase, financing, Year-1 revenue/expenses, growth assumptions |
| 3 | 5-Year Pro-Forma | 5-col matrix: revenue, expenses, NOI, debt service, cash flow, depreciation, taxable income |
| 4 | Scenarios | 3 columns (Conservative / Base / Aggressive) with full 5-yr summaries |
| 5 | Exit Analysis | Year-5 sale: cap rate exit, equity recovery, total return, IRR |
| 6 | Settings | Property name, hold period, discount rate, active year |

## Inputs tab
- Purchase price, down %, loan terms (rate, term)
- Closing costs, rehab budget, furniture budget
- Year-1 gross revenue, Year-1 operating expenses (line items)
- Annual revenue growth % (input — typical 3-5%)
- Annual expense inflation % (input — typical 3%)
- Vacancy/credit loss assumption %
- Capital reserve % of revenue
- Exit cap rate (input — typically same as entry or +50bps)
- Exit selling cost % (default 6%)

## 5-Year Pro-Forma tab
Years 1-5 columns. Rows:
- Gross potential revenue (grows by growth %)
- Vacancy/credit loss
- Effective gross income
- Operating expenses (each line × inflation)
- NOI
- Debt service (constant per amortization)
- Capital reserves
- Cash flow before tax
- Depreciation (27.5-yr SL — pulls from cost basis × 0.0364)
- Taxable income
- After-tax cash flow (assume blended tax rate input)
- Cumulative cash flow

## Scenarios tab
3-col side-by-side with adjusted revenue growth (1%/3%/5%), expense inflation, occupancy. Year-1 through Year-5 summary + Exit metrics.

## Exit Analysis
Year-5 NOI ÷ Exit cap = sale price.
Less selling costs.
Less remaining loan balance.
= Net sale proceeds.
+ Cumulative cash flow Years 1-5
= Total cash returned.
÷ Total cash invested = Equity multiple.
IRR formula across years 0-5 cash flows.

## Sample data (DEMO)
$485K purchase, 25% down, 30yr 7.25%, $96K Year-1 revenue, $54K expenses, 4% rev growth, 3% expense inflation, 7.5% exit cap.
- Year-5 NOI $52K
- Exit sale price $693K
- Equity multiple 1.94x
- IRR 17.2%

## Settings
- B5 Active year
- B7 Property name
- B9 Hold period (default 5 yrs)
- B11 Discount rate for NPV (default 10%)
- B13 Blended tax rate (default 28%)
