# Brief — OPS-005 Supply Inventory + Par-Level Restock Calculator

**SKU:** OPS-005
**Catalog #:** 35 (master spec §3.2 C)
**Mode:** Operational (register)
**Tier:** T2
**Fork from:** `build_1099_nec_tracker.py` (register pattern with thresholds)
**Filenames:** `OPS-005-supply-inventory-par-level-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Tracks consumables (linens, toiletries, cleaning supplies, paper goods) per property with a *par level* (minimum on-hand) and a current count, then flags everything below par on a single restock list. Eliminates the "ran out of TP between guests" failure mode.

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Welcome + "Items below par: N" alert + → Restock List button |
| 2 | Inventory | Master register: SKU, item name, property, par, on-hand, vendor, unit cost, reorder qty |
| 3 | Restock List | Filtered view (formula-driven) — items where on-hand < par, sorted by shortfall |
| 4 | Vendor Quick Order | Pre-built shopping lists per vendor (Costco / Amazon / Sam's Club / local) |
| 5 | Settings | Property list, vendor list, category list |

## Inventory columns
A SKU | B Item | C Category (dropdown: Linens / Bath / Kitchen / Cleaning / Paper / Decor / Other) | D Property (dropdown) | E Par level | F On-hand | G Shortfall (formula `=MAX(0,E-F)`) | H Vendor (dropdown) | I Unit cost | J Reorder qty | K $ to restock (formula `=G*I`) | L Last restocked | M Notes

Capacity: 200 rows.

## Restock List tab
- Top of tab: "Items below par: N" big number (`=COUNTIF('Inventory'!G6:G205,">0")`)
- "$ to restock total" (`=SUM('Inventory'!K6:K205)`)
- Filtered table via INDEX/SMALL pattern showing only rows where Shortfall > 0, sorted descending
- Conditional formatting: red row fill where Shortfall ≥ par (zero on hand)

## Vendor Quick Order tab
4 sections, one per vendor (Costco/Amazon/Sam's/Local). Each lists items where Vendor matches and Shortfall > 0, formatted as a copy-paste shopping list.

## Sample data (DEMO)
3 properties, 35 items inventoried, 8 below par. Realistic STR consumables (queen sheet sets, Dawn dish soap 3-pack, TP 24-pack, bath towels, K-cups).

## Settings
- B5 Active year (informational)
- B7-B16 Property list (10)
- B18-B27 Vendor list (10)
