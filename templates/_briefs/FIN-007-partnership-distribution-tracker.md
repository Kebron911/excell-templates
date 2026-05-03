# Brief — FIN-007 Partnership Distribution Tracker

**SKU:** FIN-007
**Catalog #:** 20 (master spec §3.2 A)
**Mode:** Operational (register)
**Tier:** T3
**Fork from:** `build_1099_nec_tracker.py` (register pattern) + `build_pl_single_property.py` (matrix sub-pattern)
**Filenames:** `FIN-007-partnership-distribution-tracker-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For STR partnerships (LLC taxed as partnership, not single-member). Tracks: capital contributions, profit/loss allocation by ownership %, distributions paid, ending capital account per partner. Outputs the per-partner figures needed for K-1 prep. The workbook a managing-partner Sarah hands the tax preparer in February.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (total distributions YTD, partners count, capital balance per partner) + → Add Distribution |
| 2 | Partners | Partner roster (capacity 8) — name, ownership %, beginning capital, current capital |
| 3 | Capital Contributions | Log of contributions (capacity 100) |
| 4 | Distributions | Log of distributions paid (capacity 200) |
| 5 | P&L Allocation | Annual P&L allocated by ownership % |
| 6 | Settings | Active tax year, profit/loss allocation method, partnership name |

## Partners columns
A Partner # | B Partner name | C Tax ID last4 | D Ownership % | E Beginning capital (Jan 1) | F Contributions YTD (formula `=SUMIFS(...)`) | G Profit allocated YTD (formula) | H Distributions YTD (formula) | I Ending capital (formula `=E+F+G-H`) | J Notes

% must sum to 100 — checksum cell with red flag if not.

## Capital Contributions log
A Date | B Partner (dropdown) | C Amount | D Type (Cash / Property contribution / Services) | E Notes.

## Distributions log
A Date | B Partner (dropdown) | C Amount | D Type (Cash / Property / In-kind / Tax distribution / Liquidating) | E Source entity (if multi-LLC) | F Notes.

## P&L Allocation tab
- Annual partnership net income (input or linked cell)
- Per-partner allocation: ownership % × net income
- Special allocations row (e.g., guaranteed payments) — input
- Final allocated income per partner

## K-1 Prep summary (rows in Settings or own section)
For each partner:
- Beginning capital
- Contributions
- Profit allocated
- Distributions
- Ending capital
These 5 numbers go directly to K-1 Item L.

## Sample data (DEMO)
2-partner LLC: Daniel 60% / Partner 40%. Beginning capital $80K / $40K. 2026 net income $36K → $21.6K / $14.4K allocated. Distributions $18K / $12K paid. Ending capital $83.6K / $42.4K.

## Settings
- B5 Active tax year
- B7 Partnership name
- B9 EIN
- B11 Allocation method (Pro-rata by ownership / Special allocation per agreement)
- B13 Partner count
