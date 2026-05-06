# How to Use Your Refi-or-Sell Decision Matrix

## What this workbook does

For a single property, compares 3 paths: (1) Hold + cash-out refi, (2) Sell outright, (3) Sell + 1031 exchange into a larger asset. Computes 5-year wealth outcome under each path. Surfaces tax consequences (depreciation recapture, capital gain), transaction costs, cash freed up, and ongoing operations.

The workbook for the inevitable "should we sell Lakehouse?" conversation.

## First-time setup (20 min)

1. Open tab **Property Snapshot** — current value (pull from STR-002 Portfolio Valuation), current debt balance, basis, accumulated depreciation (pull from TAX-013), in-service date, current NOI.
2. Tab **Hold + Refi Inputs** — projected refi rate, term, LTV (typical 70-75% for DSCR refi), expected cash-out, future revenue growth.
3. Tab **Sell Outright Inputs** — selling costs (6% commission + closing typical), capital gains rate (federal + state), depreciation recapture rate (25% federal).
4. Tab **1031 Inputs** — replacement property target (price, projected NOI, financing), plus your assumption on whether you'll find one within 45 days.

## Reading the outputs

The **5-Year Wealth Comparison** tab shows three columns:

| Path | Year-0 Cash | Year-5 Cumulative Cash Flow | Year-5 Equity | Total Wealth |
|---|---|---|---|---|
| Hold + Refi | refi cash-out | 5 years of cash flow | growing equity | total |
| Sell | net sale proceeds (after tax) | invested elsewhere — assumption needed | n/a | total |
| Sell + 1031 | 0 (deferred) | 5 years of cash flow on bigger asset | bigger asset's equity | total |

Plus path-specific outputs:
- **Hold + Refi:** post-refi DSCR, cash recycled for next acquisition
- **Sell:** taxable gain (cap gain + depreciation recapture), net proceeds after tax
- **1031:** taxes deferred, larger-asset cash flow improvement, basis carryover

## Tax math the workbook handles

- **Cap gain:** sale price − basis − selling costs = gain (long-term capital gains rate)
- **Depreciation recapture:** accumulated depreciation × 25% federal (the "unrecaptured §1250 gain")
- **State taxes:** state-specific cap gain rates
- **Net sale proceeds:** sale price − selling costs − cap gain tax − depreciation recapture tax − loan payoff
- **1031 deferral:** all of the above deferred, but basis carries over (you'll pay the tax later when you eventually sell without 1031)

## When each path wins

- **Hold + Refi wins when:** property is appreciating + cash-flowing + you can deploy cash-out into a new acquisition
- **Sell wins when:** the property has plateaued, the market is peak, you're exiting STR investing entirely, OR you have a higher-return use for the cash
- **1031 wins when:** you're scaling up, the market still has runway, and you want to avoid the tax bill while compounding into a larger asset

## When to run

- Annually as part of portfolio review (alongside STR-002)
- Whenever a serious offer comes in
- Before any major life event (retirement, kid's college, divorce — these often force a "do we sell?" conversation)

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Pair with:** STR-002 Portfolio Valuation (current value source), ACQ-011 1031 Exchange Tracker (executes the 1031 path), TAX-013 Depreciation Tracker (basis + accumulated depreciation source), FIN-004 DSCR Tracker (validates refi eligibility on the Hold + Refi path).
