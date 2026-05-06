# How to Use Your Pricing Tool ROI Comparison

## What this workbook does

A/B test framework for paid pricing tools. Run PriceLabs (or Wheelhouse, or Beyond) for 60 days, then run without it (or vice versa), and the workbook computes whether the tool earned its monthly fee. Decision support: "should I keep paying $20/mo per listing?"

## First-time setup (10 min)

1. **Property Roster** — properties to A/B test.
2. **Tool Settings** — which tool, monthly fee per listing, integration date.
3. **Test Plan** — duration (60 days each side typical), seasons aligned (don't test peak vs off-peak).

## Running the test

**Period 1 — tool ACTIVE** (60 days)
1. Tool is set up + active per its docs.
2. Log per-week metrics: ADR, occupancy, RevPAR per property.
3. Log notable interventions (manual rate overrides, base-rate changes).

**Period 2 — tool INACTIVE** (60 days, ideally same season prior or next year)
1. Disable tool. Use baseline pricing strategy (REV-002 + REV-003 manual).
2. Log same metrics.

**Reading the output**
1. Open the **A/B Comparison tab**:
   - Period 1 vs Period 2 ADR / Occupancy / RevPAR
   - Net revenue delta
   - Subtract tool fees ($20/mo × 2 months × N listings)
   - Statistical confidence flag (small sample size warning)
2. Read the verdict: "tool earned $X above its fee" OR "tool cost more than it earned"

## Why most pricing-tool ROI claims are misleading

Pricing tools cite "average customer saw revenue lift of 15-30%." That's marketing math. Your specific market, your specific property, your specific baseline — may not see that lift. The only way to know is to A/B test.

## When the tool wins

- High-volatility markets (NYC, LA, beach towns with weather demand)
- Multi-property portfolios where manual pricing isn't tractable
- Markets with frequent large events the tool catches you'd miss

## When the tool loses

- Stable seasonal markets (mountain cabins with predictable peak/off-peak)
- ≤2 properties (manual pricing via REV-002 + REV-003 wins)
- Markets where you're already disciplined about REV-003 weekly comp tracking

## Important — sample-size caveats

A 60-day test on a single property has noisy data. The workbook flags low-confidence results. For a definitive answer, run multiple properties or run year-on-year comparisons (same season this year vs last year).

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Pair with:** REV-002 Dynamic Pricing Calculator (the manual alternative), REV-003 Competitor Rate Tracker (manual comp tracking), FIN-001 RevPAR Dashboard (validates which period had higher RevPAR).
