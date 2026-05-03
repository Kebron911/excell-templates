# Brief — STR-003 Refi-or-Sell Decision Matrix

**SKU:** STR-003
**Catalog #:** 68 (master spec §3.2 I)
**Mode:** Operational (calculator)
**Tier:** T3
**Fork from:** `build_str_deal_analyzer.py` (calc pattern) + STR-002 valuation linkage
**Filenames:** `STR-003-refi-or-sell-decision-matrix-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For a single property, compares 3 paths: (1) Hold + cash-out refi, (2) Sell outright, (3) Sell + 1031 exchange into a larger asset. Computes 5-year wealth outcome under each path. Surfaces tax consequences (depreciation recapture, capital gain), transaction costs, cash freed up, and ongoing operations. The workbook for the inevitable "should we sell Lakehouse?" conversation.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | 3-card scoreboard: Hold+Refi $X / Sell $Y / 1031 $Z | + → Property Inputs |
| 2 | Property Inputs | Current property details: value, loan, NOI, basis, holding period, future projections |
| 3 | Path 1: Hold + Refi | Cash-out refi, cash flow impact, 5-yr cumulative wealth |
| 4 | Path 2: Sell | Sale proceeds after costs/taxes, reinvestment assumption, 5-yr wealth |
| 5 | Path 3: Sell + 1031 | Defer gain into bigger asset, 5-yr operations + final exit |
| 6 | Settings | Property name, hold period, growth assumptions, tax rate |

## Property Inputs
- Property name + address
- Current market value (input or link from STR-002)
- Current loan balance
- Current monthly P&I
- Annual NOI
- Original cost basis
- Years held
- Accumulated depreciation
- Adjusted basis (formula)
- Realized gain if sold today (formula)
- Depreciation recapture portion (formula × 25%)
- Capital gain portion (× LTCG rate)

## Path 1: Hold + Refi
- New loan: 75% LTV × current value
- Cash out (formula `=new loan - current loan - refi closing costs`)
- New monthly P&I (at current refi rate)
- Cash flow change (NOI - new debt service)
- 5-year cumulative cash flow + value appreciation
- Final equity at year 5 (value × growth - new loan amortized balance)
- Total wealth at year 5: cash out + cumulative cash flow + final equity

## Path 2: Sell
- Gross sale price (from inputs)
- Selling costs (6% commission + 1.5% closing)
- Mortgage payoff
- Tax on recapture + gain
- Net cash freed
- Reinvest at assumption rate (input — e.g., 6% in S&P, or 8% in another deal)
- 5-year future value of cash
- Total wealth at year 5: future value of reinvested cash

## Path 3: Sell + 1031
- Sale, costs, payoff (same as Path 2)
- Replacement property purchased same value or larger (assumes match for full deferral)
- Carryover basis
- Year 1-5 NOI on replacement (input — typically larger asset = larger NOI)
- 5-year cumulative cash flow + appreciation
- Eventual sale at year 5 OR continued hold
- Total wealth at year 5: replacement equity + cumulative cash flow

## Decision Cards
3-card grid with each path's year-5 total wealth. Highest highlighted gold-soft. Caveat row underneath: "These are scenario projections; actual outcome depends on market timing, tenant/guest reality, financing availability."

## Sample data (DEMO)
Lakehouse: $720K value, $469K loan, $48K NOI, $310K basis, $130K accumulated depreciation.
- Path 1 Hold+Refi: cash out $63K, new payment +$340/mo, 5yr wealth $284K
- Path 2 Sell: $214K cash freed, reinvest at 7%, 5yr $300K
- Path 3 Sell + 1031 into $1.1M lakefront asset: 5yr wealth $358K (winner) ← gold highlight

## Settings
- B5 Property name
- B7 Hold period (default 5 yrs)
- B9 Property value growth assumption (default 3%/yr)
- B11 Reinvestment rate for Path 2 (default 7%)
- B13 Refi rate (current, default 7.25%)
- B15 LTCG rate (typically 15-20%)
- B17 Recapture rate (25%)
