# Brief — ACQ-006 Rehab Budget + ROI Projection

**SKU:** ACQ-006
**Catalog #:** 24 (master spec §3.2 B)
**Mode:** Operational (register + calculator)
**Tier:** T2
**Fork from:** `build_cost_to_launch.py` (line-item budget pattern) + `build_str_deal_analyzer.py` (ROI calc)
**Filenames:** `ACQ-006-rehab-budget-roi-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Detailed rehab budget for a property pre-launch with embedded ROI projection. Per line item: estimate, actual, variance, contractor, payment status. Computes total rehab spend, contingency burn, and "$ of rehab → $ of revenue lift" ROI estimate.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (budget, spent, % over/under, ROI estimate) + → Budget Detail |
| 2 | Budget Detail | Line-item register (capacity 100) — category, description, estimate, actual, contractor, status |
| 3 | Cost Allocation | Per-category roll-up + capex vs repair classification |
| 4 | ROI Projection | Pre-rehab vs post-rehab projected revenue, payback period |
| 5 | Settings | Property name, active rehab dates, contingency % |

## Budget Detail columns
A Line # | B Category (dropdown: Demolition / Plumbing / Electrical / HVAC / Drywall / Flooring / Cabinets / Countertops / Appliances / Painting / Fixtures / Furniture / Decor / Outdoor / Permits / Misc) | C Description | D Estimate | E Actual | F Variance (formula `=E-D`) | G Variance % (formula) | H Contractor | I Payment status (dropdown: Estimate only / Deposit paid / In progress / Complete / Paid in full) | J Capex or Repair? (dropdown — drives tax treatment) | K Notes

Conditional formatting: Variance % column red >+15%, gold +5-15%, parchment ≤+5%.

## Cost Allocation
- Per-category SUMIFS table: estimate vs actual vs variance
- Capex vs Repair split (this matters for depreciation; see TAX-013)
- Pie chart "Spend by category"

## ROI Projection
Pre-rehab projected nightly rate (input)
Post-rehab projected nightly rate (input)
Occupancy lift estimate (% — input)
Year-1 revenue lift (formula `=(post-pre) * 365 * occ-lift`)
Total rehab spend
Payback period months (formula)
5-year cumulative ROI

## Sample data (DEMO)
Smokies Ridge cabin, full kitchen + 2 bath rehab, 25 line items, $48K budget, $51K actual (+6.3%). Pre-rehab rate $145, post-rehab $185. Year-1 lift $14.6K. Payback 42 months. 5-yr ROI 152%.

## Settings
- B5 Property name
- B7 Rehab start date
- B9 Rehab end date (target)
- B11 Contingency % (default 15%)
