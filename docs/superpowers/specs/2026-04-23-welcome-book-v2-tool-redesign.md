# GST-001 Welcome Book v2 — Tool Redesign (Design)

**Status:** Draft v1 — awaiting user review
**Date:** 2026-04-23
**Author:** Daniel Harrison (via brainstorming skill)
**Parent specs:**
- [2026-04-22-first-5-etsy-products-design.md](./2026-04-22-first-5-etsy-products-design.md) — original product plan for all 5 SKUs
- [2026-04-22-str-tax-platform-design.md](./2026-04-22-str-tax-platform-design.md) — master strategy
**Supersedes for GST-001:** the v1 build in `templates/_build/build_welcome_book.py` — v2 rebuild keeps the SKU, price ($17), listing, and delivery artifacts; replaces the Excel structure.

---

## 0. Executive summary

Rebuild GST-001 Welcome Book from "a spreadsheet with 9 tabs of label/input pairs" into a **tool-feeling wizard**: Cover tab hero, 8 guided input sections with card-grouped inputs, a Review & Print output tab with live-preview + pseudo-button PDF export, and a quarantined Host Notes tab. Stays `.xlsx` (no macros). Ships as a 2-file bundle: filled demo + blank starter.

**Positioning change:** from "template you fill in" to "tool that walks you through building your guest welcome book in 15 minutes, then generates a 3-page branded PDF in one Ctrl+P."

**Design decisions locked (M3 + S2):**
- **M3 — no macros.** Pseudo-button UX via merged-cells + HYPERLINK() formulas. Full compatibility: Excel 2016+, Excel 365, Google Sheets.
- **S2 — wizard structure.** Cover tab + 8 guided input tabs + Review & Print output tab + quarantined Host Notes tab.

**In scope for v2:** GST-001 only. Pattern is template-producible for OPS-001/TAX-001/TAX-002/TAX-003 as a follow-up.

---

## 1. Why the v1 fails as a "tool"

The v1 build script (`build_welcome_book.py` at main commit `7ee6eb9`) renders every tab the same way:

```
Row 1-3: brand header
Row 5:   Label (col A)  |  Input (col B, yellow fill)
Row 6:   Label (col A)  |  Input (col B, yellow fill)
...
```

This is a **data-entry form**. The grid is visible. The label/input pairs look like QuickBooks or a tax form. There's no hierarchy, no journey, no output preview. Buyer sees 9 tabs × 8-15 rows of flat inputs, feels friction, closes the file. v1 would get 3-star reviews complaining "looks like a spreadsheet, I could have made this myself in 15 minutes."

v2's thesis: **same inputs, different presentation = perceived value 3-5x.**

---

## 2. Wizard shape

### 2.1 — Tab sequence

| # | Tab | Color | Purpose |
|---|---|---|---|
| 0 | **Start** | Harbor Navy `#12304E` | Branded hero + 3-card "what you'll build" + Get Started pseudo-button + progress dashboard + per-section resume list |
| 1 | Property | Parchment `#F6EFE2` | Property + host identity inputs |
| 2 | Arrival | Parchment | Address, entry, parking, first-5-minutes |
| 3 | WiFi + Tech | Parchment | Network, streaming, smart devices |
| 4 | House Rules | Parchment | Quiet hours, pets, smoking, custom rules |
| 5 | Local Guide | Parchment | 20 local business slots (category-prefilled) |
| 6 | Trash + Maintenance | Parchment | Pickup day, bin location, utilities |
| 7 | Departure | Parchment | Checkout time, checklist |
| 8 | Emergency | Parchment | 911 block + hospital/vet/utilities |
| 9 | **Review & Print** | Muted Gold `#C9A24B` | Readiness dashboard + pseudo-button + 3-page live preview |
| 10 | **Bonus: Listing Copy** | Muted Gold soft `#E2C884` | Pre-written Airbnb listing blocks (unlocked reward tab) |
| 11 | **× Host Notes** | Clay Rose `#B5725E` | Private host-only, quarantined with red warning |

Excel defaults to opening the leftmost tab — buyer's first impression is the Start hero, not a grid.

### 2.2 — Journey model

1. Open file → land on Start tab (branded hero visible before anything else)
2. Read cover: hero band, 3-card "what you'll build", navy Get Started button
3. Click Get Started → hyperlink navigates to Property!A5 (first input cell)
4. Fill cards on each section; use ← BACK / NEXT → pseudo-buttons at top and bottom of each tab
5. Hit Review & Print tab (tab 9) — see readiness dashboard + 3-page live preview that pulls from all 8 input tabs
6. Hit Ctrl+P → choose "Save as PDF" → 3-page branded PDF on desktop
7. (Optional) Right-click Host Notes tab → Hide before saving/sharing

---

## 3. Cover tab ("Start")

Canvas: 8.5"×11" portrait, cols `A:L = 8 units each`.

### 3.1 — Zone layout

```
ZONE 1 — HERO BAND (rows 1-8, navy fill)
  Row 2: "The STR Ledger" (Cormorant/Georgia 14pt parchment left)
  Row 4: "Welcome Book" (Georgia 36pt bold parchment)
  Row 5: "Welcome books that earn 5-stars." (Georgia italic 14pt gold)
  Row 7: "GST-001 · v2.0" (Consolas 9pt gold tracked)

ZONE 2 — WHAT YOU'LL BUILD (rows 10-20, parchment)
  Row 11: "What you'll build in the next 15 minutes" (Georgia 16pt bold navy)
  Rows 13-18: 3-card grid:
    📖 PRINT · Spiral-bound binder for the counter
    📱 QR CODE · Scan to view on guest's phone
    ✉ EMAIL PDF · Send ahead of arrival

ZONE 3 — QUICKSTART CARD (rows 22-28, parchment-alt EFE5D0)
  Row 23: "Quick Start (5 min)" (Georgia 14pt bold)
  Rows 24-26: 5-field list — property name, wifi, trash day, checkout, hospital
  Row 27: [→ START 5-MIN QUICKSTART] (navy pseudo-button, hyperlinks to Property!B5)

ZONE 4 — FULL GET STARTED (rows 30-33)
  Full-width merged block (A-L, 4 rows, navy fill, gold 2px border):
    "GET STARTED — FILL YOUR PROPERTY INFO  →"
  Hyperlinks to Property!A5

ZONE 5 — PROGRESS DASHBOARD (rows 35-46)
  Row 36: "Progress:" + live completion % formula
  Rows 38-45: 8-row section status list
    "① Property Info     ✅ Done         →"
    "② Arrival           ⏳ 3 of 7       →"
    "③ WiFi + Tech       ⏳ Empty        →"
    ...
  Each row has a "→" HYPERLINK-formula cell to that section's A5

ZONE 6 — FOOTER (rows 48-52, parchment)
  Row 49: gold thin-rule divider
  Row 50: "Questions? hello@thestrledger.com" (Inter 10pt muted)
  Row 51: "Free updates forever. v2.0 · Released 2026-05"
```

### 3.2 — Progress formulas

Per brand_config helper; lives on a hidden Settings tab or inline on Start:

```
Overall completion cell:
=SUM(COUNTA(Property.INPUTS), COUNTA(Arrival.INPUTS),
     COUNTA(WiFi.INPUTS), COUNTA(Rules.INPUTS),
     COUNTA(Local.INPUTS), COUNTA(Trash.INPUTS),
     COUNTA(Departure.INPUTS), COUNTA(Emergency.INPUTS))
  / 80
```

Per-section status line (example for Property, 8-field section):

```
=IF(COUNTA('Property'!B5:B12)=8, "✅ Done",
  IF(COUNTA('Property'!B5:B12)=0, "⏳ Empty",
    "⏳ " & COUNTA('Property'!B5:B12) & " of 8"))
```

Per-section "→" hyperlink (E4-simple variant — always-to-A5):

```
=HYPERLINK("#'Property'!A5", "→")
```

---

## 4. Input tab template (all 8)

Single template applied to each of tabs 1-8. Only content inside Zone 3 (input cards) varies per section.

### 4.1 — Zone layout

```
ZONE 1 — STEP HEADER BAND (rows 1-5, navy fill)
  Row 2: [← BACK] (cols A-C) | SECTION 2 OF 8 (cols D-I mono tracked) | [NEXT →] (cols J-L gold)
  Row 4: Section title — "Arrival & Check-in" (Georgia 28pt bold parchment)
  Row 5: Section subtitle (Georgia italic 12pt muted gold)

ZONE 2 — INSTRUCTION STRIP (row 7, parchment)
  Full-width merged, "Fill the highlighted fields below. The 'Review & Print'
  tab (last) shows what your guest will see." (Inter 10pt italic graphite)

ZONE 3 — INPUT CARDS (rows 9+, parchment bg)
  2-4 cards per section. Each card:
    - Header strip (1 row, gold-soft fill #E2C884): "ENTRY & PARKING" (Consolas 10pt tracked)
    - Body rows: narrow label col (A-C merged, 24u) + wide input col (D-L merged, 72u)
    - 1 row spacer between cards
  Thin 1px gold border all 4 sides of each card.

ZONE 4 — SECTION FOOTER (last 3 rows)
  Thin gold-rule divider row
  [← Back: Property Info]  (A-F)  |  [Next: WiFi & Tech →]  (G-L)
```

### 4.2 — Card content per section

**Section 1 — Property** (8 inputs)
- Card 1 "IDENTITY": Property name, Host first name
- Card 2 "GUEST DETAILS": Host phone, Check-in date, Check-out date
- Card 3 "SETUP" (static content): "First time? Go to Start → Quick Start for the 5-minute path."

**Section 2 — Arrival** (7 inputs + 4 static bullets)
- Card 1 "ENTRY & PARKING": Full address, Entry method (dropdown), Door code, Parking instructions
- Card 2 "ROUTE & TIMING": Best route, Arrival window, If-early option
- Card 3 "FIRST 5 MINUTES" (static): thermostat / wifi / fridge / text-host bullets

**Section 3 — WiFi + Tech** (8 inputs)
- Card 1 "NETWORK": WiFi name, WiFi password (13pt bold), Backup network
- Card 2 "ENTERTAINMENT": TV streaming + logins, How to adjust TV volume
- Card 3 "SMART DEVICES": Smart lock code, Thermostat notes, Who to call if WiFi fails

**Section 4 — House Rules** (7 inputs, 4 dropdowns)
- Card 1 "THE BASICS": Quiet hours, Max guests
- Card 2 "POLICIES": Smoking (dropdown), Pets (dropdown), Events (dropdown), Shoes (dropdown)
- Card 3 "CUSTOM RULES": Multi-line text (10-row wrap)

**Section 5 — Local Guide** (20 category rows × 4 input cols = 80 fields)
- Card 1 "COFFEE & FOOD": Coffee×2, Restaurant×3, Grocery×2, Takeout×2
- Card 2 "ESSENTIALS": Pharmacy, Gas station, Hospital, Coffee alt
- Card 3 "ENTERTAINMENT": Outdoor×2, Kid-friendly×2, Date night, Bar, Emergency non-911
- Each row: Name | Distance | Phone | Why we love it
- Category col A pre-filled. Other columns blank/sample.
- Tab is 2-page-print (landscape for this tab only).

**Section 6 — Trash + Maintenance** (7 inputs)
- Card 1 "PICKUP & BINS": Trash day (dropdown), Bin location, Recycling accepted, Sorting rules
- Card 2 "OPERATIONAL": HVAC range, Power outage instructions, Where to put bins on pickup morning

**Section 7 — Departure** (6 inputs + formula)
- Card 1 "WHEN": Checkout time, Checkout day (formula pulling from Property check-out date)
- Card 2 "CHECKLIST": Linens, Dishwasher, Trash, Thermostat, Lock, Key return — mixed input + static
- Card 3 "CUSTOM": Multi-line custom checkout tasks

**Section 8 — Emergency** (9 inputs, 1 hardcoded, 1 formula)
- Card 1 "911 BANNER": Giant red header "IN AN EMERGENCY — CALL 911"
- Card 2 "HOSPITAL": Nearest hospital name, phone, address
- Card 3 "URGENT CARE & POLICE": Urgent care name + phone, Non-emergency police
- Card 4 "OTHER": Poison control (hardcoded 1-800-222-1222), 24-hr vet, Utility outage, Host phone (formula from Property!B7)

---

## 5. Review & Print tab (tab 9)

The payoff tab. Gold tabColor. Print area A24:L80 (3 pages).

### 5.1 — Zone layout

```
ZONE 1 — REVIEW HEADER (rows 1-6, navy)
  Row 2: [← BACK: Emergency] | REVIEW & PRINT (gold tracked)
  Row 4: "Your welcome book is ready" (Georgia 32pt bold parchment)
  Row 5: "Preview below. Hit Print when happy." (Georgia italic 12pt gold)

ZONE 2 — READINESS DASHBOARD (rows 8-14, parchment)
  3-card row:
  ┌────────────┐ ┌────────────┐ ┌────────────┐
  │ COMPLETION │ │ RED FLAGS  │ │ STATUS     │
  │ =XX%       │ │ =N fields  │ │ READY/     │
  │ N/80       │ │ empty      │ │ MINOR/     │
  │ filled     │ │ required   │ │ NEEDS WORK │
  └────────────┘ └────────────┘ └────────────┘
  Values are formulas. Conditional format on the STATUS card:
    0 red flags → green "READY"
    1-2 red flags → yellow "MINOR"
    3+ red flags → red "NEEDS WORK"

ZONE 3 — GENERATE PDF PSEUDO-BUTTON (rows 16-21)
  Full-width merged (A-L, 6 rows tall, ~180px):
  Navy fill, 3px gold border, drop-shadow via offset gray cells.
  Centered:
    "📄  GENERATE YOUR PDF"
    "Press Ctrl+P → choose 'Save as PDF'"
  (Georgia 18pt bold parchment)
  Row 22: fine print — "Print area pre-set. Host Notes tab excluded."

ZONE 4 — LIVE PREVIEW (rows 24-80, 3 pages)
  Every cell = cross-sheet formula pulling from input tabs.

  PAGE 1 (rows 24-45): hero + property + arrival + WiFi
    Hero band (rows 24-25): "Welcome to {=Property!B5}"
    Property info block (27-32): identity fields via formulas
    Arrival block (34-40): address, entry, parking, first-5-minutes
    WiFi block (42-45): network + password IN BIG 18pt BOLD (legible across room)

  PAGE 2 (rows 47-65): rules + local guide
    Rules section (48-54): 7 rules in a clean table
    Local guide table (56-65): top 10 recommendations (filtered from 20)

  PAGE 3 (rows 67-80): trash + departure + emergency
    Trash/maintenance (68-72)
    Departure checklist (74-77)
    Emergency contacts (79-80) — red-bordered 911 block

  Page breaks at row 46 and row 66.
  Empty fields render "(not set)" via =IF(source="","(not set)",source).
```

### 5.2 — Saleability superpower

This tab is the Etsy listing's **Thumbnail 1**. Screenshot the 3-page preview, show it as "what you'll end up with" — the #1 conversion lever for a welcome-book Etsy buyer. Cross-referenced with thumbnail specs in `templates/_delivery/GST-001-welcome-book/thumbnails.md`.

---

## 6. Host Notes quarantine (tab 10)

Tab named `× Host Notes`. Tab color Clay Rose `#B5725E`.

- Row 1-5: red warning block, full-width merged
  - Row 1: "⚠ PRIVATE — HIDE BEFORE SHARING" (Georgia 22pt bold error red, red-tint fill `#FFE8E8`)
  - Row 3: "Right-click this tab → 'Hide' before saving as PDF or sharing the workbook."
- Row 7+: input cards for cleaner contacts, handyman, plumber, vendors, safe codes, private notes
- Print area deliberately `A1:A1` — if printed accidentally, produces a near-empty page, not private data leak
- Also included in Review & Print preview: a note at the very bottom "Host Notes tab automatically excluded from print. Hide it if you're sharing the raw workbook."

---

## 7. No-macro mechanism details

All wizard-feel mechanisms are native `.xlsx`:

### 7.1 — Navigation: `HYPERLINK()` formula
`=HYPERLINK("#'Arrival'!A5", "NEXT →")` — navigates + cursors at A5. Works in Excel 2016+, Excel 365, Google Sheets.

### 7.2 — Pseudo-button: merged cells + thick border + hyperlink
No shapes/images needed. Buyer clicks the merged block, hyperlink fires. Styled to look button-shaped via 3px border, navy fill, gold accent, Georgia bold text. Cursor auto-changes to hand pointer on hover (Excel built-in).

### 7.3 — Progress: `COUNTA()` + `IF()`
Live-updating on cell edit (Excel's default recalc). No macros needed.

### 7.4 — Cross-sheet formulas for live preview
Standard `=Property!B5` references. Excel auto-resolves on open and recalc.

### 7.5 — Print area + orientation pre-set
`ws.print_area = "A24:L80"`, `ws.page_setup.orientation = "portrait"`, `ws.page_setup.paperSize = ws.PAPERSIZE_LETTER`, `ws.page_setup.fitToPage = True`. Done once at build time in Python.

---

## 8. Shipped as a 2-file bundle (F1)

One Etsy download zips two identical-structure files:

| File | Inputs state | Use |
|---|---|---|
| `GST-001-welcome-book-DEMO.xlsx` | All 80 inputs filled with "Smokies Ridge Cabin" sample data | Buyer opens to see what a finished welcome book looks like |
| `GST-001-welcome-book-BLANK.xlsx` | All 80 inputs cleared | Buyer uses this for their actual property |

Implementation: Python `build_workbook(out_path, variant)` where `variant in ("demo", "blank")`. Demo fills sample constants; blank passes empty strings. Same code path.

Also bundled: `GST-001-sample-output.pdf` — the 3-page PDF produced by printing the DEMO's Review & Print tab. Shipped as a preview so buyers know exactly what they're getting before opening Excel.

---

## 9. Saleability features (Tier 1, shipping with v2)

Recap of Section F Tier 1 from brainstorm:

- **F1** — DEMO + BLANK 2-file bundle + shipped sample PDF (§8)
- **F2** — Live-preview Review & Print tab as the hero shot for Thumbnail 1 (§5.2)
- **F3** — Quickstart card on Cover tab with 5-min path (§3.1 Zone 3)
- **F4** — Bonus: pre-written Airbnb listing copy on a `9. Bonus: Listing Copy` tab
- **F7** — Version + "Free updates forever" footer on Cover tab (§3.1 Zone 6)

Tier 2 (F5 QR inline, F6 stats, F7 expanded) deferred to v2.1 iteration post-launch.
Tier 3 (video walkthrough, edition splits, annual refresh) deferred to Lane B/C.

### 9.1 — Bonus tab content

Tab 10 (between Review & Print and × Host Notes): `Bonus: Listing Copy` (gold-soft accent tab color). 200 words of pre-written content buyers paste into their Airbnb listing:

- Pre-written "House Rules" block (6 lines, Sarah-tier voice)
- Pre-written "Check-in instructions" block (short, warm, specific)
- Pre-written "Before you leave" reminder (4 bullets)

Static content. No formulas. Buyer copy-pastes as-is.

---

## 10. What stays the same (scope discipline)

- **SKU, price, category:** GST-001, $17 Etsy / $17 own-site, Guest Experience
- **Etsy listing copy:** `copy/etsy-listings/GST-001-welcome-book.md` — title, tags, description still valid (may add one bullet about "two files — demo + blank" and "live 3-page preview built into the file")
- **Brief + spec:** `templates/_briefs/GST-001-welcome-book.md` + `-spec.md` remain the source of truth for inputs/outputs; v2 design supersedes only the **rendering** not the content
- **How-to PDF + license PDF:** existing copy in `templates/_delivery/GST-001-welcome-book/` still valid; how-to may need a 2-line update to mention Start tab + Review & Print tab

---

## 11. Acceptance criteria

- [ ] `templates/_masters/GST-001-welcome-book-DEMO.xlsx` exists with 12 tabs in correct order + all sample data
- [ ] `templates/_masters/GST-001-welcome-book-BLANK.xlsx` exists with 12 tabs + all inputs cleared
- [ ] Start tab shows hero band + 3-card grid + Quick Start card + Get Started button + live progress dashboard
- [ ] Each input tab shows card-grouped inputs with step header band (Back/Next buttons) at top AND bottom
- [ ] Review & Print tab shows readiness dashboard + pseudo-button + 3-page live preview
- [ ] Host Notes tab has red quarantine header + Print area `A1:A1`
- [ ] Bonus: Listing Copy tab exists with pre-written Airbnb blocks
- [ ] All hyperlinks work (clicking Next on Property navigates to Arrival; clicking → on Start Zone 5 navigates to correct tab)
- [ ] Progress formula on Start updates live as inputs fill
- [ ] Live preview on Review & Print pulls correctly from all 8 input tabs via cross-sheet formulas
- [ ] Both xlsx files open in Excel 2016+, Excel 365, and Google Sheets without warnings
- [ ] Print area on Review & Print produces 3-page letter-portrait PDF on Ctrl+P → Save as PDF
- [ ] `templates/_delivery/GST-001-welcome-book/GST-001-sample-output.pdf` exists (printed from DEMO's Review & Print)
- [ ] Python build time: Daniel hands-on ~30 min (review + QA); Claude authoring ~3-5 hrs

---

## 12. Reusability for other 4 SKUs

This wizard pattern (Cover + guided inputs + Review/output + quarantine) is template-producible:

- **OPS-001 Turnover Checklist** — Cover = "Run better turnovers", Review & Print = printable 40-item checklist + scorecard dashboard, Host-only = cleaner pay rates
- **TAX-001 Mileage Log** — Cover = "IRS-ready mileage", Review & Print = CPA handoff (Monthly Summary + YTD Dashboard), no quarantine (all host-facing)
- **TAX-003 1099-NEC** — Cover = "Never miss a 1099", Review & Print = Year-end prep summary, Host-only = penalty schedule reference
- **TAX-002 P&L** — Cover = "Schedule E ready", Review & Print = Schedule E Summary (already exists), no quarantine

Estimated per-SKU re-rendering cost after GST-001 pattern lands: ~1-2 hrs each because the card layout + navigation + progress patterns are reusable through shared build helpers.

**Scope for this design:** GST-001 v2 only. Pattern re-application to other 4 is a separate v2.1 project.

---

## 13. Open items (for implementation plan, not this design)

- Exact red-flags definition on Review & Print (which 8–10 fields are "required" for the STATUS card? — draft during implementation)
- Bonus: Listing Copy tab — exact 200 words of pre-written content (draft during implementation)
- Decision: use workbook-level `defined_names` for named ranges; no Settings tab for v2

(Section 5 Local Guide card grouping is locked at §4.2: 3 cards — "COFFEE & FOOD" / "ESSENTIALS" / "ENTERTAINMENT".)

---

## 14. Risks

| Risk | Probability | Mitigation |
|---|---|---|
| HYPERLINK() + MATCH()+ISBLANK() array formula incompatible with Excel 2019 | Low | Use E4-simple (static hyperlinks to A5) — already the chosen path |
| Merged-cell pseudo-buttons break on Google Sheets re-import | Medium | Test import during QA; Google Sheets does preserve merged cells + hyperlinks; visual differs but function preserved |
| Live preview formulas produce "(not set)" pollution on print when buyer hasn't filled a field | Medium | Wrap every cross-sheet formula in `IF(source="","",source)` so blanks collapse to empty cells, not "(not set)" |
| "3 pages" is the wrong print count — some rentals need 2, some need 4+ | Low | Page breaks are at fixed row positions; if content overflows, Excel adds page 4 automatically. Acceptable. |
| Branded navy + gold card borders render weirdly in Google Sheets | Low-Med | Borders survive; tab colors survive; fill colors survive. Fonts may fall back to Arial if Cormorant/Georgia unavailable — acceptable. |

---

**End of design. Awaiting user review before invoking writing-plans skill.**
