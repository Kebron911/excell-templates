# Brief — FIN-003 12-Month Rolling Cash Flow Forecaster

**SKU:** FIN-003
**Catalog #:** 14 (master spec §3.2 A)
**Mode:** Operational (matrix forecast)
**Tier:** T3
**Fork from:** `build_pl_single_property.py` (12-col matrix) + `build_revpar_dashboard.py` (forecast pattern)
**Filenames:** `FIN-003-12-month-cash-flow-forecaster-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
12-month forward-looking cash flow forecast across the portfolio. Combines: confirmed bookings (revenue), seasonal projection (revenue), recurring expense schedule (mortgage, insurance, utilities, etc.), one-off planned expenses (renovations), and tax payments (quarterly estimates). Surfaces *months with negative cash flow* before they happen — solves the "ran out of operating cash in February" failure mode.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (avg monthly cash flow, lowest month $, runway months, days-cash-on-hand) + → Forecast |
| 2 | Bookings + Revenue | 12-month matrix: confirmed + projected revenue per property |
| 3 | Recurring Expenses | 12-month matrix: mortgage, insurance, utilities, software, etc. |
| 4 | One-Off Expenses | List of planned 1-time expenses (renovations, new appliances, lawyer fees) by month |
| 5 | Cash Flow Forecast | Combined 12-month forecast: revenue - expenses = net per month + cumulative |
| 6 | Settings | Property list, recurring expense list, starting cash balance, active year |

## Bookings + Revenue
Per property (3 capacity in DEMO):
- Confirmed bookings $ per month (input — host pulls from PMS)
- Projected occupancy % per month (input — uses prior-year actuals as default)
- Projected ADR per month (input)
- Projected revenue per month (formula `=Occ * ADR * 30 days`)
- Total per-property monthly revenue

## Recurring Expenses
Per category × 12 months. ~15 categories: mortgage, property tax, insurance, HOA, internet, electric, gas, water, trash, software, cleaning, supplies, professional fees, marketing, misc. Customer enters monthly recurring amount; can override per month if non-uniform.

## One-Off Expenses
Flat log: Date | Property | Category | Amount | Notes. Posted into the Cash Flow Forecast for that month.

## Cash Flow Forecast (the main output)
12-row × 5-col table:
- Month
- Revenue (sum of property revenue rows)
- Recurring expenses (sum)
- One-off expenses (sum)
- NET monthly (formula)
- Cumulative cash (running total starting from Settings cash balance)

Conditional formatting:
- Cumulative cash row red where < 0
- NET monthly row red where < 0
Chart: combined column (revenue + expense) with line overlay (cumulative cash).

## Sample data (DEMO)
3 properties, $48K starting cash, monthly recurring $11K, summer revenue $24K/mo, winter $9K/mo, Q1 estimated tax $4.5K, October HVAC replacement planned $7.5K. Forecast shows Feb negative ($-2.1K NET) — surfaced as red flag.

## Settings
- B5 Active year
- B7 Starting cash balance (Jan 1)
- B9-B18 Property list
- B20-B34 Recurring expense category list
