# Brief — REV-004 Minimum-Night-Stay Optimizer

**SKU:** REV-004
**Catalog #:** 49 (master spec §3.2 E)
**Mode:** Operational (calculator)
**Tier:** T2
**Fork from:** `build_break_even_occupancy.py` (single-page calc) + `build_cleaning_fee_optimizer.py`
**Filenames:** `REV-004-min-night-stay-optimizer-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Compares 2-night vs 3-night vs 7-night minimum-night-stay (MNS) policies for the same property. Computes: avg nightly rate at each MNS, expected occupancy, gross revenue, turnover labor cost, NET revenue. Most hosts assume "1-night = max revenue" — this surfaces the truth that turnover cost often makes 3-night MNS net better.

## Tabs (4)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Hero + the question this answers + → Run Comparison |
| 2 | Inputs | Base rate, occupancy by MNS scenario, cleaning cost, supply restock per turnover, host hours per turnover |
| 3 | Comparison | 5 scenarios side-by-side (1, 2, 3, 5, 7-night MNS) — gross, costs, NET, NET/night |
| 4 | Settings | Property selector, active year |

## Inputs
- Base nightly rate (input)
- Cleaning cost per turnover (input)
- Supply restock $ per turnover (input)
- Host hours per turnover (input — unpaid labor for self-managers)
- Host hourly opportunity cost (input)
- Per scenario (5 rows: 1n, 2n, 3n, 5n, 7n MNS): expected occupancy %, expected ADR (rate may rise w/ longer MNS for length-of-stay-discount-free bookings)

## Comparison tab
5 columns, one per MNS scenario:
- Avg nights per booking (= MNS for simplicity, or override)
- Bookings/year (= 365 × occupancy / avg nights)
- Turnovers/year
- Gross revenue (= bookings × avg nights × ADR)
- Cleaning cost total (= turnovers × cleaning cost)
- Supply restock cost (= turnovers × supply $)
- Host labor cost (= turnovers × hours × hourly)
- NET revenue (gross - all costs)
- NET per night (= NET / occupied nights)

Highlight winning column with gold-soft fill (formula-driven). One bar chart "NET revenue by MNS".

## Sample data (DEMO)
Smokies Ridge: $185 base, $90 cleaning, $25 supply, 1.5 host hours @ $40/hr.
- 1n: 78% occ, $185 ADR, NET $35,200
- 2n: 76% occ, $185 ADR, NET $42,180
- 3n: 70% occ, $192 ADR, NET $44,910 ← winner
- 5n: 58% occ, $200 ADR, NET $39,400
- 7n: 45% occ, $210 ADR, NET $33,100

## Settings
- B5 Property
- B7 Active year
