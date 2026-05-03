# Brief — TAX-011 Multi-Property Master P&L

**SKU:** TAX-011
**Category:** Financial / Accounting (master spec §3.2 A #1)
**Tier:** T3
**Etsy price:** N/A (premium — own-site only)
**Own-site price:** $97 (or included in Portfolio Bundle $397)
**Wave:** 3 (build order #4 of the next 12)
**Campaign tagline:** Close your year before April does.

## Target persona

**Primary:** Semi-Pro Sarah (3-10 properties) — the hero. Direct upsell from already-shipped TAX-002.
**Secondary:** Pro Pam (10-50) — uses subset for owners she manages with mixed entity structures.
**Tertiary:** Side-Hustle Sam (acquired property #2) — graduates from TAX-002 single-property to this.

## The one specific pain

"I have 5 TAX-002 workbooks for my 5 properties. At year-end I'm copy-pasting totals into a 'consolidated' tab manually, and my CPA still rebuilt the LLC rollups because three properties are in one LLC and two are in another. That's 4 hours of work I shouldn't be doing."

## What this template does

A multi-property P&L that:
1. Replaces N copies of TAX-002 with one workbook serving all properties via a Property dropdown
2. Rolls up by **Entity/LLC** (Sarah's hidden #1 pain after taxes)
3. Allocates **shared expenses** (umbrella insurance, accountant fees) across selected properties via a single-line entry
4. Outputs a multi-column Schedule E (one column per property) ready for CPA copy-paste
5. Shows YoY deltas — Sarah cares about momentum, not just absolute numbers

## Sheets / Tabs (9)

| # | Tab | Role |
|---|---|---|
| 1 | Start | Portfolio at-a-glance (YTD net, best/worst performer) |
| 2 | Properties Register | One row per property — name, address, LLC/entity, ownership %, service date |
| 3 | Revenue Log | Single log, all properties (Property dropdown col) |
| 4 | Expense Log | Single log, all properties (Property dropdown + shared/allocated flag) |
| 5 | Per-Property P&L | Auto — rows = Schedule E categories; cols = properties + total |
| 6 | Consolidated P&L | YTD totals, all properties combined, monthly breakdown |
| 7 | Entity Rollup | Group by LLC — one column per entity |
| 8 | Schedule E Multi | One column per property, Schedule E line numbers in rows |
| 9 | Settings | Property list source / Entity list / Category list / Tax year |

## Inputs

**Properties Register (rows 6-25, capacity 20 properties):**
Property name, Street address, City/State/Zip, Property type, Entity/LLC name (dropdown from Settings), Ownership % (default 100), Acquisition date, Business start date, Days rented YTD, Active? (Yes/No).

**Revenue Log (rows 6-3005, capacity 3000 rows across portfolio):**
Date, Property (dropdown from Properties Register), Guest/Source, Channel (Airbnb/VRBO/Booking.com/Direct/Other), Gross, Platform fee, Cleaning fee collected, Net (formula), Notes.

**Expense Log (rows 6-5005, capacity 5000 rows):**
Date, Vendor, Property (dropdown — OR "ALLOCATED" for shared expenses), Shared? (Yes/No), Allocation properties (free-text comma-separated property names if Shared=Yes), Category (Schedule E dropdown), Amount, Payment method, Receipt? (Yes/No), Notes.

For shared expenses: workbook splits the amount equally across listed properties at calculation time (Per-Property P&L formulas).

## Outputs

**Per-Property P&L (Sheet 5):**
- Cols: A = category | B onwards = one column per property | last col = portfolio total
- Rows: Schedule E categories (17 expense + revenue + total + net), same shape as TAX-002
- Each cell: SUMIFS over Expense Log filtered by property + category + tax year, plus allocated portion of shared expenses
- Allocated portion formula: `=SUMPRODUCT((Shared col = "Yes") * (Category col = <cat>) * (ISNUMBER(SEARCH(<this property>, Allocation col))) * (Amount col / count_of_properties_in_allocation))`

**Consolidated P&L (Sheet 6):**
Same shape as TAX-002 Monthly P&L (12 months × 17 categories + revenue/total/net) but summing across all properties.

**Entity Rollup (Sheet 7):**
- Cols: A = category | B onwards = one column per entity
- Each entity column = SUM of properties matching that entity (lookup via Properties Register)
- Bottom rows: distributable income per LLC member (Ownership % × NOI)

**Schedule E Multi (Sheet 8):**
- Rows = Schedule E line numbers (3, 4, 5-20, 26a, 26)
- Cols = one per property
- Each cell pulls from Per-Property P&L
- Print area covers all properties + total col, landscape for portfolios up to 8 properties (split to second tab beyond that)

**Start tab at-a-glance (rows 8-22):**
- "Portfolio YTD net": large gold Georgia 28pt
- "Properties active: N"
- "Best performer: <name> ($X net)"
- "Worst performer: <name> ($X net)"
- "Total revenue YTD: $X" / "Total expenses YTD: $X"
- YoY delta (vs same period last year): "+12% revenue ↑ / -3% expenses ↓"
- "Top 3 expense categories" table

## YoY logic

User enters "Last year YTD" reference numbers manually on Settings tab (rows 30-50, one per property × per category). YoY delta = (this year - last year) / last year. Don't try to multi-year track in one workbook (creates capacity bloat); user re-runs annually using prior year's archive.

## External data references

- IRS Schedule E Part I structure (line numbers 3-26)
- IRS Publication 527 (Residential Rental Property)
- IRS rules on shared-expense allocation (defensible methodology — equal split for portfolio-wide policies, sqft-prorated for shared structure not implemented in v1)

## Business logic

- **Single source of truth.** All revenue + expense entries are in two logs, one row each. Per-property and consolidated views are formula-derived.
- **Shared expenses** flagged via Shared? = Yes; Allocation column lists which properties; equal split by default. Footnote on Settings: "For sqft-prorated allocation, calculate manually and enter as separate per-property rows."
- **Entity column on Properties Register** is the LLC rollup key. Sarah's CPA will use this without re-categorizing.
- **Capacity:** 20 properties, 3000 revenue rows, 5000 expense rows. Above this, performance degrades (SUMIFS array load); recommend portfolio split.
- **Tax year filter:** Settings cell holds the tax year. All P&L formulas filter by tax year — so the same workbook serves multiple years if user resets archive into a new file.

## QA sample data

5 properties: Smokies Ridge Cabin (LLC-A), Creek Side (LLC-A), Lakehouse A (LLC-A), Mountain Loft (LLC-B), Forest Cabin (LLC-B). Tax year 2026 Q1.

Combined ~$92,000 revenue, ~$33,500 expenses, ~$58,500 net.
Best performer: Lakehouse A ($16K net). Worst: Forest Cabin (-$1.2K, just acquired Feb).
Entity rollup: LLC-A net ~$48K; LLC-B net ~$10.5K.
Shared expenses: 1 umbrella insurance policy ($2,400) split across 5 properties; 1 accountant invoice ($1,800) split across 5.

## Upgrade CTA

Start tab: "Want depreciation per asset (Form 4562 ready) + cost segregation? Get the Portfolio Bundle at thestrledger.com/portfolio-bundle — $397 (saves $293 vs individual)."

## Out-of-scope

- Depreciation by asset (TAX-006/TAX-010 territory)
- Cost segregation
- Per-property P&L drill-down to transaction list (use Filter on the Logs)
- Multi-year history in one workbook
- International rental properties (US Schedule E only)

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `TAX-011-multi-property-master-pl-DEMO.xlsx` + `-BLANK.xlsx`
- Mode: Operational
- Tab colors: Start/Settings = `COLOR_PRIMARY`; Properties Register/Revenue Log/Expense Log = `COLOR_SECONDARY`; Per-Property P&L/Consolidated P&L/Entity Rollup/Schedule E Multi = `COLOR_ACCENT`
- SKU tag "TAX-011 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Multi-Property Master P&L", "One workbook for the whole portfolio. CPA-ready.")`.

Portfolio summary block rows 8-22 (formulas pulling from Consolidated P&L + Properties Register).

Pseudo-button row 24: → Properties · → Revenue · → Expenses · → Per-Property · → Consolidated · → Entity · → Schedule E.

### Sheet 2 — Properties Register
Col widths: A=22, B=30, C=20, D=14, E=20, F=8, G=12, H=12, I=10, J=8. Row 5 header band. Capacity rows 6-25.

### Sheet 3 — Revenue Log
Col widths: 12, 24, 22, 12, 12, 12, 14, 12, 30. Row 5 header. Freeze A6. Capacity 3000 rows.
Property dropdown col B = `=OFFSET(Properties Register!$A$6, 0, 0, COUNTA(Properties Register!$A$6:$A$25), 1)` (dynamic).

### Sheet 4 — Expense Log
Cols: Date | Vendor | Property | Shared? | Allocation | Category | Amount | Pmt method | Receipt? | Notes. Capacity 5000 rows. Property dropdown allows "ALLOCATED" sentinel.

### Sheet 5 — Per-Property P&L
Tab color `COLOR_ACCENT`. Col A = category, cols B-U = up to 20 properties + col V = portfolio total. SUMIFS formulas for each cell. Bottom rows: TOTAL EXPENSES, NET INCOME with conditional formatting.

### Sheet 6 — Consolidated P&L
Same shape as TAX-002 Monthly P&L Sheet 5 but summing across all properties.

### Sheet 7 — Entity Rollup
Col A = category, cols B-F = up to 5 entities + col G = total. Lookup by Properties Register entity column.

### Sheet 8 — Schedule E Multi
Rows = Schedule E line numbers (line 3 / 4 / 5-20 / 26a / 26). Cols = up to 8 properties + total. Print area landscape letter, scaled-to-fit.

### Sheet 9 — Settings
Editable: tax year (B5), entity list (rows 8-15), property list source (lookups Properties Register), 17 expense categories (rows 20-36), prior-year YTD reference numbers (rows 40-100, one per property × category).
