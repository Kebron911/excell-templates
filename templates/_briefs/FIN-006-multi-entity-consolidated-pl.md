# Brief — FIN-006 Multi-Entity (LLC-per-Property) Consolidated P&L

**SKU:** FIN-006
**Catalog #:** 19 (master spec §3.2 A)
**Mode:** Operational (consolidator)
**Tier:** T3
**Fork from:** `build_multi_property_master_pl.py` (TAX-011 — already built; this is its multi-entity sibling)
**Filenames:** `FIN-006-multi-entity-consolidated-pl-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
For Sarah/Pam-tier hosts who hold each property in its own LLC. Aggregates per-LLC income statements into a holding-company-level consolidated P&L. Resolves the "I have 5 LLCs and 5 separate P&Ls — what's my actual portfolio income?" problem. Differs from TAX-011 (multi-property single-entity) by adding entity-level allocation, intercompany eliminations, and member-distribution tracking.

## Tabs (8)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (total entities, consolidated revenue, consolidated NOI, distribution YTD) + → Per Entity |
| 2 | Entity Setup | List of LLCs (capacity 10): EIN, member %, property assigned, registered agent |
| 3 | Per-Entity P&L | One section per entity: 12-col P&L with income, expenses, NOI |
| 4 | Intercompany | Eliminations register (capacity 30): management-fee transfers, shared-service allocations |
| 5 | Consolidated P&L | Roll-up: sum of entity P&Ls minus intercompany eliminations |
| 6 | Member Distributions | Per-member distributions tracked across entities |
| 7 | K-1 Worksheet | Per-member K-1 figures: ordinary income, distributions, capital |
| 8 | Settings | Active tax year, member list, entity list |

## Entity Setup columns
A Entity name | B EIN | C State of formation | D Property assigned | E Registered agent | F Tax classification (LLC-disregarded / LLC-partnership / LLC-S-corp / Other) | G Members (link to Settings list) | H Notes

## Per-Entity P&L
Same 12-col matrix as TAX-002, repeated per entity (3 entities default in DEMO). Each entity has its own:
- Revenue lines
- Expense lines
- NOI
- Per-member allocation %

## Intercompany Eliminations
Common cases:
- Management entity charges per-property entities a management fee → eliminated at consolidation
- Holding entity pays insurance for all → allocated to per-property entities → eliminated
- Inter-LLC loans → not P&L-impacting but tracked

Columns: Date | From entity | To entity | Description | Amount | Type (Management fee / Allocation / Loan / Other) | Eliminated at consolidation? (Y default).

## Consolidated P&L
- Sum of entity P&Ls (pre-elimination)
- Subtract intercompany eliminations
- Net consolidated revenue / expenses / NOI

Print-ready (CPA hand-off).

## Member Distributions
12-col matrix: rows = members, cols = months, cells = distribution $.

## K-1 Worksheet
Per-member K-1 prep figures pulled from Per-Entity P&L × member %. Caveat banner: "K-1 prep is the CPA's job — these are working figures for hand-off."

## Sample data (DEMO)
3 LLCs: Smokies Ridge LLC (Daniel 100%), Lakehouse LLC (Daniel 60% / Partner 40%), Creek Side LLC (Daniel 100%). Holding mgmt entity charges $200/mo/property. Consolidated 2026 NOI $84K.

## Settings
- B5 Active tax year
- B7-B16 Entity list
- B18-B27 Member list (name | EIN/SSN last4 | role)
