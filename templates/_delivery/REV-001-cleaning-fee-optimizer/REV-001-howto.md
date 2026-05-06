# How to Use Your Cleaning Fee Optimizer

## What this workbook does

Compares three cleaning-fee strategies side-by-side:

1. **Charge separately** — list the cleaning fee as a line item ($85, $120, etc.)
2. **Bundle into nightly rate** — fold the cleaning cost into the per-night price, advertise "no cleaning fee"
3. **Hybrid** — partial fee + partial bundle, a balance

For each strategy, it computes booking conversion (lower with high cleaning fees), search-rank impact, average daily revenue, and annualized $ delta. Output: a recommendation specific to your average length of stay and market.

This is the most-debated line item on Airbnb. The answer depends on your average LOS — short stays favor bundling, long stays favor separate. The workbook does the math.

## First-time setup (5 min)

1. Open tab **Inputs** — your cleaning cost per turn, current cleaning fee charged to guests, current ADR, your average length of stay (LOS).
2. The workbook auto-computes the three scenarios.

## Reading the outputs

- **Strategy A (Separate):** highest dollar transparency, lowest booking conversion. Best for properties where most stays are 5+ nights.
- **Strategy B (Bundled):** highest booking conversion, lower per-booking revenue. Best for properties where most stays are 2-3 nights.
- **Strategy C (Hybrid):** balanced. Cleaner economics for properties with mixed LOS distribution.
- **Recommendation cell:** which strategy nets the highest annualized revenue at YOUR LOS distribution.

## The math behind it

A $120 cleaning fee on a 2-night stay adds 60% to the total guest price. On a 7-night stay, it adds 17%. Airbnb's search ranking factors total guest price; high cleaning fees tank ranking on short-stay properties specifically.

The optimizer's recommendation accounts for this: if your average LOS is <3 nights, bundling typically wins by $1,500-$4,500/year per property. If your average LOS is >5 nights, separate fees typically win by $800-$2,000/year because the per-stay cleaning cost is amortized across more nights.

## When to re-run

- After any pricing change (PriceLabs adjustment, base-rate move)
- When your LOS distribution shifts (e.g., new min-stay rule)
- Quarterly, even if nothing changed — Airbnb's search algorithm shifts, and the optimal strategy can drift

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Upgrade path:** The Full version on thestrledger.com adds LOS sensitivity analysis (short/mid/long-stay cohorts) and Airbnb search-rank impact estimation. The Revenue Bundle pairs it with the Dynamic Pricing Calculator (REV-002) and Min-Night Stay Optimizer (REV-004).
