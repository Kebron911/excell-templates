# Bonus B5 — The Notion & Airtable Course Mirrors

**Format:** 2 importable templates + setup videos + this design spec
**Course module:** Cross-cutting (alternative to Excel for the entire system)
**Use case:** Hosts who don't live in Excel can run the same logic on Notion or Airtable

> **The seven-minute tax tab is logic, not Excel.**
>
> Some hosts run their lives in Notion. Some run their portfolios in Airtable. The course's logic — capture, categorize, reconcile, roll up — is portable. These mirrors port it.

---

## Why two mirrors (and not three)

Excel is the primary surface — it's what the workbooks are built in, what most CPAs accept, and what the receipt-OCR workflow appends to.

Two mirrors cover the rest of the audience:

- **Notion** for hosts who run their personal/business operations in Notion and want their tax bookkeeping to live alongside everything else.
- **Airtable** for hosts who think in databases — multi-property, multi-platform, relational — and want the leverage of formulas, automations, and views.

Google Sheets is a near-equivalent of Excel; the Excel workbooks open in Sheets with minor compatibility notes. We don't ship a separate Sheets mirror because the Excel files cover that surface.

---

## Mirror principles

Both mirrors hold to the same rules:

1. **Same logic, different UI.** The Schedule E lines, the BAR test treatment, the §274(d) substantiation — identical to the Excel spine. A row in any of the three should produce the same Schedule E result.
2. **Same naming.** "Cleaning fee paid to cleaner" is the same string in all three.
3. **Same Categorization Rule Library.** The 60-rule starter library (Bonus — `categorization-rule-library.md`) ports across all surfaces.
4. **Same export format.** Each mirror exports a CSV that the Excel TAX-004 spine can ingest. So a host can run Notion or Airtable for capture and hand the CPA the Excel handoff.
5. **No feature creep.** Mirrors aim for parity, not "what's possible in Notion." Adding fancy Notion-only features that don't map back to Excel breaks the parity contract.

---

## Mirror 1 — Notion

### Why Notion

Notion's strengths for this use case:

- Pages-within-pages structure mirrors the workbook's tab-within-workbook model
- Databases are relational enough to handle multi-property roll-ups
- Receipt embedding (image upload + page) matches the §274(d) workflow
- Hosts who already run their Notion as a personal OS will fold this in cleanly

Notion's weaknesses:

- Formula language is limited compared to Excel — some calculations punt to manual entry
- No native CSV import for transaction data — workaround: paste-as-table or use a CSV-to-Notion service
- Mobile experience is good for receipt capture, weaker for review work
- Sharing with a CPA is awkward — the CPA either gets a Notion guest seat (unfamiliar) or the host exports

The mirror is built to maximize strengths and minimize weaknesses.

### Notion structure

```
🏠 The 47-Deduction Operator — Tax Year {{YEAR}}
   ├── 📋 Index page
   │      Quick links to every section + headline numbers
   ├── 🏘️ Properties (database)
   │      Cabin A, Cabin B, Cabin C — each row is a property
   ├── 💵 Transactions (database)
   │      One row per transaction, linked to property
   ├── 🚗 Mileage Log (database)
   │      One row per trip, linked to property
   ├── 📁 Receipts (database)
   │      One row per receipt, linked to transaction
   ├── 👷 Contractors (database)
   │      One row per contractor, linked to W-9, 1099-NEC
   ├── 🏛️ Depreciation (database)
   │      One row per asset, with MACRS class + placed-in-service date
   ├── 📊 Quarterly Roll-up (page with embedded views)
   │      Q1 / Q2 / Q3 / Q4 — auto-rolled from Transactions
   ├── 📋 Schedule E Roll-up (page)
   │      Lines 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
   │      Each line is a calculated total from Transactions
   ├── 🏠 Augusta §280A(g) (page)
   │      Personal-use calendar + board-minute pages + FMV worksheet
   ├── 🛡️ Audit Dossier (page)
   │      Folder-style nested structure mirroring the dossier template
   └── 🤝 CPA Handoff (page)
          12-section structure mirroring the handoff template
```

*(The icons are illustrative — Notion shows them as visual anchors; the brand voice does not include emoji elsewhere.)*

### Properties database — schema

```
| Property name (title)        | Cabin A
| Address                      | 123 Pine Lake Rd, Asheville NC
| Acquisition date             | 2024-08-14
| Acquisition basis            | $640,000
| Land allocation              | $160,000
| Depreciable basis            | $480,000
| Average rental period (YTD)  | 4.2 days  (formula or manual)
| Filing classification         | Schedule E
| STR loophole eligible        | Yes
| Cost-seg study performed     | Yes (link to file)
| Insurance carrier            | Proper Insurance
| Mortgage servicer            | [name]
```

### Transactions database — schema

```
| Date (date)                  | 2026-04-28
| Property (relation)          | → Cabin A
| Vendor (text)                | Home Depot
| Description (text)           | Replacement dishwasher
| Subtotal (number)            | 1,056.65
| Tax (number)                 | 83.53
| Total (number, formula)      | 1,140.18
| Schedule E line (select)     | 14 — Repairs
| Category (select)            | Repair — appliance
| Confidence (select)          | High / Medium / Low
| Receipt (relation)           | → 2026-04-28-home-depot.jpg
| BAR-test note (relation)     | → BAR notes for items >$1,000
| Status (select)              | Captured / Reviewed / Final
| Source (select)              | OCR / Manual / Bank import
```

### Mileage log database — schema

```
| Date (date)                  | 2026-04-28
| Property (relation)          | → Cabin A
| Purpose (text)               | Cleaner orientation visit
| Start odometer (number)      | 142,840
| End odometer (number)        | 142,952
| Miles (formula)              | 112
| IRS standard rate (number)   | 0.655 (course-shipped, January-updated)
| Deduction (formula)          | $73.36
| Logged within 7 days (formula)| ✓ / ✗ — flags reconstructions
```

### Schedule E Roll-up page

A linked database view showing transactions grouped by Schedule E line, with a row total at the bottom of each group. Notion does this natively with the *Group by* feature plus a *Sum* aggregation.

Sample view:

```
LINE 3 — Rents received
  → 47 transactions, total $94,200.00
LINE 7 — Cleaning and maintenance
  → 22 transactions, total $11,400.00
LINE 14 — Repairs
  → 17 transactions, total $8,432.00
LINE 17 — Utilities
  → 36 transactions, total $6,240.00
[etc.]

SCHEDULE E NET                           $XX,XXX.XX
```

The roll-up is the equivalent of TAX-004's spine in Excel.

### Quarterly view

Filter the same Transactions database by date range:

```
Q1 (Jan 1 – Mar 31)  — group by Property — sum by Schedule E line
Q2 (Apr 1 – Jun 30)  — same
Q3 (Jul 1 – Sep 30)  — same
Q4 (Oct 1 – Dec 31)  — same
```

This is the equivalent of the seven-minute tax tab's quarterly roll-up.

### Notion limitations & workarounds

| Limitation | Workaround |
|---|---|
| No native CSV import for transactions | Paste-as-table from CSV; or use n8n receipt-OCR workflow with Notion API destination |
| Limited formulas (no array, no lookup-with-conditions) | Use rollups with aggregation; manual entry for edge cases |
| Receipt photo storage costs (Notion file uploads count against plan limits) | Store receipts in Google Drive / Dropbox; embed link in Notion row |
| Sharing with CPA | Export to CSV → import to Excel TAX-004 → share Excel |
| Mobile receipt capture | Use Notion mobile app; or use Receipt-OCR n8n workflow → Notion API |

### Notion mirror shipment

```
/07-mirrors/notion/
   notion-template.zip           ← exported Notion workspace, ready to duplicate
   import-instructions.pdf       ← 2-page: how to duplicate to your workspace
   schema-reference.pdf          ← every database, every field, every formula
   csv-import-recipe.pdf         ← paste-as-table workflow for transactions
   notion-to-excel-export.pdf    ← how to round-trip back to Excel for CPA handoff
   setup-video.mp4               ← 12-min walkthrough
```

The Notion template ships as a public template URL for one-click duplication into the host's workspace.

---

## Mirror 2 — Airtable

### Why Airtable

Airtable's strengths for this use case:

- True relational database — properties, transactions, contractors, receipts naturally link
- Powerful formulas, lookups, rollups, automations
- Multiple views per table (kanban, calendar, gallery, grid) — useful for receipt review
- Native CSV import; native API
- Receipt-OCR n8n workflow targets Airtable directly (already specced)
- Better mobile capture than Notion
- Easier to share with CPA (Airtable has a CSV export and a "shared view" feature)

Airtable's weaknesses:

- Free tier limits (1,200 records/base, 2GB attachments) — most STR hosts fit comfortably; large portfolios may need a paid plan
- Less narrative — fewer pages, more grid views; some hosts find it cold
- Learning curve for hosts new to relational thinking

### Airtable structure — base design

One Airtable base, multiple tables. Tables relate via linked-record fields.

```
BASE: thestrledger-{{HOST}}-{{YEAR}}

TABLE: Properties
TABLE: Transactions
TABLE: Mileage_Log
TABLE: Receipts
TABLE: Contractors
TABLE: Depreciation_Assets
TABLE: Schedule_E_Lines    (computed; one row per Schedule E line, totals roll up here)
TABLE: Augusta_Days
TABLE: Augusta_Board_Minutes
TABLE: Audit_Dossier_Items
TABLE: CPA_Handoff_Items
TABLE: Categorization_Rules    (the 60-rule starter library)
```

### Properties table

```
Field                       | Type             | Notes
────────────────────────────|──────────────────|────────────────────────────
Property Name               | Single line text | Primary
Address                     | Long text        |
Acquisition Date            | Date             |
Acquisition Basis           | Currency         |
Land Allocation             | Currency         |
Depreciable Basis           | Formula          | = Acq Basis - Land
Avg Rental Period (YTD)     | Number           | Auto-computed (rollup of bookings)
Filing Classification       | Single select    | Schedule E / Schedule C
STR Loophole Eligible       | Checkbox         |
Cost-Seg Study              | Attachment       |
Linked Transactions         | Linked record    | → Transactions
Linked Mileage              | Linked record    | → Mileage_Log
```

### Transactions table

```
Field                       | Type             | Notes
────────────────────────────|──────────────────|────────────────────────────
Date                        | Date             | Primary
Property                    | Linked record    | → Properties
Vendor                      | Single line text |
Description                 | Long text        |
Subtotal                    | Currency         |
Tax                         | Currency         |
Total                       | Formula          | = Subtotal + Tax
Schedule E Line             | Linked record    | → Schedule_E_Lines
Category                    | Single select    | Repairs, Cleaning, Utilities, ...
Confidence                  | Single select    | High / Medium / Low
Receipt                     | Linked record    | → Receipts
BAR-Test Note               | Long text        | Required for Repairs >$1,000
Status                      | Single select    | Captured / Reviewed / Final
Source                      | Single select    | OCR / Manual / Bank import
```

### Schedule_E_Lines table (the roll-up)

One row per Schedule E line. Rollup formulas pull totals from the Transactions table:

```
Field                       | Type             | Notes
────────────────────────────|──────────────────|────────────────────────────
Line #                      | Number           | Primary (3, 5, 6, 7, ...)
Line Label                  | Single line text | "Rents received", etc.
Linked Transactions         | Linked record    | → Transactions
Total                       | Rollup           | SUM(Linked Transactions.Total)
Count                       | Rollup           | COUNT(Linked Transactions)
Status                      | Single select    | OK / Needs Review / Flag
```

### Views (per table — examples)

**Transactions table:**

- **Capture** view (default): grid, sorted by Date desc, filter `Status = Captured`. Where new entries land.
- **Review queue** view: filter `Status = Captured AND Confidence != High`. The 14% that need attention.
- **Quarterly** views (4): Q1 / Q2 / Q3 / Q4. Filter by date range. Group by Schedule E Line.
- **By property** views: Cabin A / Cabin B / Cabin C. Filter by Property.
- **BAR-test review**: filter `Schedule E Line = 14 (Repairs) AND Total >= 1000 AND BAR-Test Note = empty`. The flagged items requiring decision.

**Receipts table:**

- **Recent** view: gallery, sorted by Upload Date desc.
- **Missing-link** view: filter `Linked Transaction = empty`. Receipts uploaded but not yet matched.

### Airtable automations to ship

The mirror ships with three default automations:

1. **Receipt-to-Transaction matching** — when a receipt is uploaded and the OCR extracts vendor + total, run the rule library; if a single-match transaction exists for that property within ±48 hours, link them automatically.
2. **W-9 reminder** — when a contractor's YTD total crosses $400, send the host a Telegram/email reminder to confirm a W-9 is on file before crossing $600.
3. **Personal-use threshold alert** — when a property's personal-use day count is within 2 of the §280A(d)(2) threshold, send an alert.

Automations are optional; the mirror works without them, but they remove the most common dropped-ball patterns.

### Airtable mirror shipment

```
/07-mirrors/airtable/
   airtable-base-template.json   ← importable base schema
   import-instructions.pdf       ← 2-page: how to import to your workspace
   schema-reference.pdf          ← every table, every field, every formula
   automations-setup.pdf         ← optional automations + n8n integration
   airtable-to-excel-export.pdf  ← CPA-handoff round-trip
   setup-video.mp4               ← 14-min walkthrough
```

The Airtable base ships as a downloadable JSON that the host imports via the Airtable workspace settings.

---

## Choosing between Excel, Notion, and Airtable

Each surface has a personality. The mirror choice is a personality match.

| Surface | Best for | Worst for |
|---|---|---|
| **Excel** | Hosts comfortable with Excel; mid-portfolio (1–5 properties); CPAs prefer Excel handoffs | Hosts who don't live in Excel and resist learning |
| **Notion** | Hosts whose personal/business OS is Notion; small-to-mid portfolio; values narrative + database hybrid | Hosts who need heavy formulas or want max-leverage automation |
| **Airtable** | Hosts who think relationally; multi-property; want automations; happy with grid views | Hosts who want narrative pages or who already pay for too many SaaS tools |

The course's setup video tells students to pick one based on their natural surface. Switching mid-year is allowed but requires a clean cutover (export to Excel CSV → import to new surface → verify roll-ups match before cutover).

---

## Round-trip to Excel for CPA handoff

Regardless of which mirror the host runs day-to-day, the CPA handoff (Module 6) ships in Excel. Both mirrors export to a CSV format that imports directly into TAX-002 / TAX-004:

```
Notion → Export database as CSV → Open in Excel → paste into TAX-002 import tab
Airtable → Download view as CSV → Open in Excel → paste into TAX-002 import tab
```

The CSV column order matches TAX-002's expected import format. No re-mapping required.

---

## Maintenance & updates

| Update event | Notion | Airtable | Excel |
|---|---|---|---|
| Annual rate refresh (mileage, per-diem) | Manual edit to 1 page | Edit 1 record in Categorization_Rules | Edit 1 cell |
| New rule added to Categorization Rule Library | Add row to rule database | Add record to Categorization_Rules table | Add row to Rules tab |
| New property added | Duplicate property page; add row to database | Add record to Properties; relink | Duplicate property tab |
| Year rollover (start of new tax year) | Duplicate workspace; archive old | Duplicate base; archive old | New workbook from template |

The course ships an annual rollover guide each January for all three surfaces.

---

## What the mirrors are not

- Not feature-complete with every Excel formula
- Not a replacement for the Excel spine when the CPA expects Excel
- Not a free pass to skip the Excel handoff (the CPA's needs override the host's preference)
- Not a place to add features beyond the parity contract — proposed mirror-only features are reviewed before adoption

---

## Course shipment summary

```
/07-mirrors/
   notion/
       (per Notion shipment list above)
   airtable/
       (per Airtable shipment list above)
   choosing-your-surface.pdf       ← decision guide
   parity-test.pdf                 ← how to verify your mirror produces the same results
   round-trip-cpa-handoff.pdf       ← export → Excel → CPA workflow
```

---

*Last reviewed: 2026-04-28. Notion and Airtable evolve their feature sets; mirrors will be re-tested annually for parity. If a third-party feature change breaks parity (formula deprecation, API change), the mirror is patched within 30 days.*
