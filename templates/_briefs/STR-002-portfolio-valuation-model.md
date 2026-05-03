# Brief — STR-002 Portfolio Valuation Model

**SKU:** STR-002
**Catalog #:** 67 (master spec §3.2 I)
**Mode:** Operational (calculator + dashboard)
**Tier:** T3
**Fork from:** `build_str_deal_analyzer.py` (NOI/cap pattern) + `build_owner_reporting_dashboard.py`
**Filenames:** `STR-002-portfolio-valuation-model-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Computes the current market value of the host's STR portfolio using 3 methods: cap rate × NOI, comparable-sales (per BR/BA), and gross rent multiplier. Surfaces total equity, debt-to-value ratio, and "what would a buyer pay" estimate. The workbook a host runs annually OR before a refi/sale conversation.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Headline: Portfolio market value: $X | Equity: $Y | LTV: Z% | + → Per Property |
| 2 | Per Property | Per-property valuation via 3 methods (capacity 10) |
| 3 | Cap Rate Reference | Current market cap rates by region (input table) |
| 4 | Equity Summary | Per-property and portfolio equity (value - loan balance) |
| 5 | Settings | Property list, valuation date, market cap rate assumptions |

## Per-Property tab columns
A Property | B NOI YTD (input — host pulls from P&L) | C Cap rate (lookup from reference table) | D Method 1: Cap × NOI value (formula `=B/C`) | E Comparable $/BR/BA (input) | F Beds | G Baths | H Method 2: Comp value (formula `=E*F` adjusted) | I Annual gross rent | J GRM (input) | K Method 3: GRM × rent (formula `=I*J`) | L Average value (formula AVG of D, H, K) | M Current loan balance | N Equity (formula `=L-M`) | O LTV % (formula `=M/L`)

## Cap Rate Reference tab
Editable table of typical STR cap rates by market:
- Mountain resort STR: 6-8%
- Beach STR: 7-9%
- Urban STR: 8-10%
- Rural / cabin: 8-12%
Rows can be customized per host's actual market.

## Equity Summary
Roll-up:
- Total portfolio market value (sum of column L)
- Total loan balances (sum of column M)
- Total equity (formula)
- Portfolio LTV (formula)
- Per-property pie chart (equity by property)

## Sample data (DEMO)
3 properties:
- Smokies Ridge: NOI $42K / 7.5% cap = $560K / comp $590K / GRM-method $580K → avg $577K, loan $364K, equity $213K
- Lakehouse: $48K NOI / 7.0% / etc → avg $720K, loan $469K, equity $251K
- Creek Side: $34K / 8.0% / etc → avg $440K, loan $270K, equity $170K
Portfolio: $1.74M value, $1.10M debt, $634K equity, LTV 63%.

## Settings
- B5 Active year (valuation date)
- B7-B16 Property list
- B18-B23 Cap rate by market type (editable lookup)
