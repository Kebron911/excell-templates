# How to Use Your Minimum-Night-Stay Optimizer

## What this workbook does

Compares 2-night vs 3-night vs 7-night minimum-night-stay (MNS) policies for the same property. Computes: avg nightly rate at each MNS, expected occupancy, gross revenue, turnover labor cost, and NET revenue. Most hosts assume "1-night MNS = max revenue" — the workbook surfaces the truth that turnover cost often makes 3-night MNS net better.

## First-time setup (10 min)

1. Open tab **Property Inputs** — base ADR, current MNS, current occupancy, cleaning cost per turn (pull from OPS-004 if you have it).
2. Tab **Demand Pattern** — your market's typical booking length distribution (default: 30% 2-night, 40% 3-4-night, 20% 5-7-night, 10% 8+-night).

## Reading the outputs

- **Three-Way Comparison tab:** 2-night MNS vs 3-night MNS vs 7-night MNS, side-by-side
  - Avg rate per MNS (longer MNS often nets higher per-night)
  - Expected occupancy per MNS (shorter MNS books more nights, but...)
  - Turnover cost per night (more turnovers = more cleaning $)
  - **NET revenue per night** — the metric that matters
- **Recommendation cell:** which MNS optimizes net revenue for THIS property in THIS market

## Common pattern

For most STRs:
- **2-night MNS** wins on gross revenue but has highest turnover cost
- **3-night MNS** wins on net revenue (sweet spot — most cleaning-cost recovery without losing too many bookings)
- **7-night MNS** wins for properties in week-long-stay markets (mountain cabins, beach towns) where the demand pattern naturally clusters at 5-7 nights

The workbook tells you which applies to your specific property.

## Seasonal MNS

You can run different MNS per season. Common pattern:
- Off-peak (low demand): drop to 2-night to capture more nights
- Peak (high demand): raise to 3-7 night to maximize per-stay revenue

The workbook's Seasonal tab lets you compare net revenue under a single-MNS-all-year vs a seasonal-MNS strategy.

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Pair with:** REV-001 Cleaning Fee Optimizer (related — turnover cost feeds into both decisions), REV-002 Dynamic Pricing Calculator (set rates after MNS is locked), OPS-004 Cleaning Cost per Turnover (the turnover cost source).
