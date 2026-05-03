# Brief — ACQ-010 Seller-Finance Offer Calculator

**SKU:** ACQ-010
**Catalog #:** 28 (master spec §3.2 B)
**Mode:** Operational (calculator)
**Tier:** T2
**Fork from:** `build_str_deal_analyzer.py` (calc pattern)
**Filenames:** `ACQ-010-seller-finance-offer-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Models seller-finance acquisition terms. Computes monthly payment, total cost over loan life, cash flow vs conventional, and a side-by-side "your offer vs conventional 25%-down" comparison. Generates a draft term sheet for the seller. Solves "what does this seller-finance deal *really* cost me vs going to a bank?"

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (monthly P&I, total cost, vs-conventional savings, CoC) + → Term Inputs |
| 2 | Term Inputs | Purchase price, down %, seller note rate, term, balloon, prepayment penalty |
| 3 | Side-by-Side | Seller finance vs conventional 25%-down DSCR loan |
| 4 | Term Sheet | Print-ready draft term sheet (formula-driven copy) |
| 5 | Settings | Property name, conventional rate assumption |

## Term Inputs
- Purchase price
- Seller-finance down %
- Seller note rate %
- Term (years to amortize)
- Balloon (years to balloon if any — e.g., 30-yr amortization w/ 5-yr balloon)
- Interest-only period (if any, in months)
- Prepayment penalty terms
- Seller carry-back amount (formula `=price * (1 - down%)`)
- Closing costs reduction expected (seller-finance often has lower/no lender fees)

## Side-by-Side tab
2-col comparison:
**Seller Finance:**
- Down payment $
- Closing costs $
- Total cash in
- Monthly P&I
- Annual debt service
- Total interest over loan life
- Balloon payoff at year N
- Effective cost (PV at conventional rate — surfaces if seller terms are above market)

**Conventional 25%-down DSCR:**
- Down payment 25%
- Closing costs ~3%
- Conventional rate from settings
- Monthly P&I
- Annual debt service

Comparison: $ cash savings, $ monthly cash flow lift (lower payment), break-even point.

## Term Sheet tab
Print-ready 1-page draft (formula-concatenated copy):
- Buyer / seller / property address
- Purchase price
- Earnest money
- Down payment
- Seller note: amount, rate, term, amortization, balloon
- Prepayment terms
- Closing date
- Standard contingencies callout
- Signature block

## Sample data (DEMO)
Smokies Ridge cabin, $485K seller-finance offer:
- 10% down ($48.5K) vs conventional 25% ($121.3K) — saves $72.8K cash
- Seller rate 6.5% (below market 7.25%)
- 30-yr amortization, 7-yr balloon
- Monthly P&I $2,754 vs conventional $2,485 (slightly higher because lower down)
- BUT 50% less cash in deal → CoC 14.2% vs 8.6%

## Settings
- B5 Property name
- B7 Conventional rate (current market, default 7.25%)
- B9 Conventional term (default 30 yrs)
