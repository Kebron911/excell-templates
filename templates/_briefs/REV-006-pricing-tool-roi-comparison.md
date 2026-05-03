# Brief — REV-006 PriceLabs / Wheelhouse / Beyond ROI Comparison

**SKU:** REV-006
**Catalog #:** 52 (master spec §3.2 E)
**Mode:** Operational (calculator + log)
**Tier:** T2
**Fork from:** `build_break_even_occupancy.py` (single-page calc)
**Filenames:** `REV-006-pricing-tool-roi-comparison-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
A/B test framework for paid pricing tools. The host runs PriceLabs (or Wheelhouse, or Beyond) for 60 days, then runs without it (or vice versa), and the workbook computes whether the tool earned its monthly fee. Decision support: "should I keep paying $20/mo per listing?"

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPI hero "ROI of paid pricing: +$X / month" + → Run Test |
| 2 | A/B Test Setup | Tool name, monthly fee, test period dates, baseline period dates |
| 3 | Daily Performance | 60-day grid for baseline period + 60-day grid for test period (date, rate, booked Y/N, ADR) |
| 4 | ROI Verdict | Side-by-side: ADR / RevPAR / occupancy / gross / net (after fee) — recommendation |
| 5 | Settings | Property, active year |

## A/B Test Setup
- B5 Tool tested (dropdown: PriceLabs / Wheelhouse / Beyond / AirDNA Smart Rates / Other)
- B7 Monthly fee
- B9 Per-listing fee (some tools charge per listing, some flat)
- B11 Baseline start date | B12 Baseline end date
- B14 Test start date | B15 Test end date
- B17 Reservation lead time avg (informational — explains why the test needs ≥60 days)

## Daily Performance
Two 60-row grids side-by-side (or stacked):
**Baseline (no tool):** Date | Set rate | Booked Y/N | ADR | Notes
**Test (tool active):** Date | Set rate | Booked Y/N | ADR | Notes
Row 62: totals (occupancy %, ADR, RevPAR)

## ROI Verdict tab
Computed metrics:
- Baseline ADR / RevPAR / occupancy / gross / cleaning costs / NET
- Test ADR / RevPAR / occupancy / gross / cleaning costs / tool fees / NET
- Lift $ = test NET - baseline NET
- Lift % = lift / baseline NET
- Verdict cell: `=IF(Lift>0, "✅ Tool earned its fee — keep", "🛑 Tool didn't pay for itself — drop")`

## Sample data (DEMO)
Smokies Ridge cabin, 60-day test of PriceLabs Aug-Oct 2025 ($20/mo single listing).
- Baseline: 71% occ, $192 ADR, NET $4,230/mo
- Test: 76% occ, $208 ADR, NET $4,810/mo (after $20 fee)
- Verdict: ✅ +$580/mo, keep

## Settings
- B5 Property
- B7 Active tax year
