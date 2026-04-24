# Brief — TAX-002 Single-Property P&L Tracker

**SKU:** TAX-002
**Category:** Financial / Accounting (master spec §3.2 A #2)
**Tier:** T2 (Etsy Lite $27 / Gumroad Full $47)
**Wave:** 2
**Campaign tagline:** Close your year before April does.

## Target persona

**Primary:** Semi-Pro Sarah (3-10 properties) — this single-property version is her entry point; she buys 2-3 before upgrading to the Multi-Property Master on own-site.
**Secondary:** Side-Hustle Sam (1-2 listings) — his only P&L need, sufficient for tax prep.

## The one specific pain

"My CPA gave me back my Schedule E draft and said 'your categories don't map — I had to rebuild it.' I need a P&L that comes out of the box with IRS Schedule E categories so my CPA literally copies my numbers into boxes 5-19 without re-categorizing."

## What this template does

Single-property profit + loss tracker structured around **IRS Schedule E line items** (lines 3-26):
- Revenue: rents received + cleaning fees collected from guests
- Expenses pre-mapped to Schedule E boxes: Advertising (6), Auto/travel (7), Cleaning + maintenance (8), Commissions (9), Insurance (10), Legal + professional (11), Management fees (12), Mortgage interest (13), Other interest (14), Repairs (15), Supplies (16), Taxes (17), Utilities (18), Wages (19), Other — Platform fees (19), Other — Misc (19), Depreciation (20) — placeholder, full depreciation tracker is Phase 2+
- Monthly breakdown + YTD per category
- Schedule E Summary tab — ready-to-print CPA handoff

## Lite vs Full

**Lite (Etsy $27):** single property, no depreciation detail (placeholder line), no multi-LLC, no multi-property consolidation. Covers ~80% of single-property Sarah needs.

**Full (Gumroad $47):** identical feature set for MVP; same build, different filename + price. The true Phase 2+ multi-property Full (with depreciation by asset, LLC consolidation, budget vs actual, break-even calc) is out of scope for this launch.

Welcome-tab upgrade-banner messaging differs slightly: Lite banner is more aggressive ("Upgrade to Multi-Property Master at thestrledger.com/portfolio-master — $97"); Full banner points only to Portfolio Bundle.

## Sheets / Tabs (7)

| # | Tab | Role |
|---|---|---|
| 1 | Welcome | Cover + Schedule E mapping note + how-to |
| 2 | Property Info | Address, purchase, loan |
| 3 | Revenue Log | One row per booking |
| 4 | Expense Log | One row per expense (Schedule E-mapped category) |
| 5 | Monthly P&L | Auto: month × category matrix |
| 6 | Schedule E Summary | YTD totals mapped to Schedule E line numbers |
| 7 | Settings | Tax year + category dropdown source |

## Inputs

**Property Info (rows 5-16):** property name, address, city/state/zip, property type, purchase date, purchase price, closing costs, loan amount, interest rate, loan term, business start date, days rented YTD.

**Revenue Log (rows 6-1005):** Date, Guest/Source, Booking Channel (dropdown: Airbnb/VRBO/Booking.com/Direct/Other), Gross, Platform Fee, Cleaning Fee Collected, Net (formula `=D-E`), Notes.

**Expense Log (rows 6-2005):** Date, Vendor, Category (dropdown — ONLY the 17 Schedule E categories), Amount, Payment Method, Receipt? (Yes/No), Notes.

## Outputs

**Monthly P&L (7 rows revenue + header, 17 rows expenses, total + net):**
- Row 7 (Revenue): monthly SUMIFS over Revenue Log col D (Gross) + col F (Cleaning Fees), per month range
- Rows 10-26 (one per expense category): SUMIFS over Expense Log col D filtered by Category col C AND date range
- Row 28 (TOTAL EXPENSES): sum of category rows
- Row 30 (NET INCOME): Revenue row - Total Expenses row
- Conditional formatting on net row: green positive / red negative

**Schedule E Summary:**
- Line 3 (Rents received): `='Monthly P&L'!N7` (col N = YTD column)
- Line 4 (Royalties): hardcoded 0
- Lines 6-20 (expense categories): `='Monthly P&L'!N<corresponding row>`
- Line 26a (Total expenses): `=SUM(B12:B28)`
- Line 26 (Income or loss): `=B8+B9-B<tot>`
- Print area set for 1-page letter portrait

## External data references

- IRS Schedule E 2026 Part I structure (line numbers 3-26)
- IRS Publication 527 (Residential Rental Property) — cited on Welcome tab

## Business logic

- Expense category dropdown MUST map exactly to Schedule E boxes so CPA can copy-paste without re-categorizing.
- Revenue log captures BOTH gross (what guest paid) AND net (after platform fee) — IRS cares about gross (Line 3).
- Platform fees are an expense (Line 19 Other), NOT netted from revenue.
- Cleaning fees collected from guest = revenue line 3; cleaning cost paid to cleaner = expense line 8.
- Capacity: 1000 revenue rows, 2000 expense rows.
- Property Info is single-property (MVP); multi-property Full is Phase 2+.

## QA sample data

Single property "Smokies Ridge Cabin", Jan-Mar 2026:
- 10 bookings totaling ~$20,500 gross revenue + $2,100 cleaning fees collected
- $1,680 platform fees (Airbnb 10%, VRBO ~8%)
- $3,600 to cleaner (8 turnovers × $450)
- $420 supplies (3 receipts)
- $1,200 mortgage interest (3 × $400)
- $350 utilities (3 months varied)
- $800 repairs (1 emergency)

Expected Schedule E Summary:
- Line 3 (Rents + cleaning collected): ~$22,600
- Line 8 (Cleaning): $3,600
- Line 13 (Mortgage int): $1,200
- Line 15 (Repairs): $800
- Line 16 (Supplies): $420
- Line 18 (Utilities): $350
- Line 19 (Other — Platform fees): ~$1,680
- Line 26a (Total expenses): ~$8,050
- Net income: ~$14,500

## Upgrade CTA

Prominent Welcome tab upgrade banner: "Need multi-property + depreciation + LLC consolidation? Get the Portfolio P&L Master at thestrledger.com/portfolio-master — $97, or included in the Portfolio Bundle ($397)."

## Out-of-scope

- Multi-property consolidation (Phase 2+ Full)
- Depreciation by asset (Phase 2+)
- Multi-LLC
- Budget vs actual
- Break-even occupancy calculator (separate SKU)
