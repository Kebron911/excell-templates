# GST-001 Welcome Book v2.1 — Hybrid Excel + HTML Renderer (Design)

**Status:** Draft v1 — awaiting user review
**Date:** 2026-04-24
**Author:** Daniel Harrison (via brainstorming skill)
**Parent specs:**
- [2026-04-23-welcome-book-v2-tool-redesign.md](./2026-04-23-welcome-book-v2-tool-redesign.md) — v2 wizard redesign (shipped, commit 1783398)
- [2026-04-22-str-tax-platform-design.md](./2026-04-22-str-tax-platform-design.md) — master strategy
**Brand lock:** [brand/brand-decisions.md](../../../brand/brand-decisions.md)
**Supersedes for GST-001:**
- §5 Review & Print tab — the 3-page live preview rendered inside Excel is retired
- §7.4 Cross-sheet formulas for live preview — retired; the preview moves to HTML
**Keeps from v2:** tab sequence (Start · 8 inputs · Launch · Bonus · × Host Notes), card-grouped inputs, pseudo-buttons, freeze panes, Host Notes quarantine, DEMO + BLANK bundle structure

---

## 0. Executive summary

Ship v2.1 as a **hybrid pipeline**: the buyer fills the xlsx as they do today, then drags the file onto a single `welcome-book-renderer.html` that ships in the Etsy zip. The HTML reads the xlsx client-side (SheetJS), applies a chosen theme and palette, renders a 3-page magazine-quality welcome book in the browser, and prints to PDF via `Ctrl+P`.

**Why this pivots the v2 design:**

1. Excel's print rendering cannot deliver the look shipped v2 promised. The v2 sample output reads as "designed spreadsheet," not a magazine-grade guest book.
2. The v2 cross-sheet preview formulas on Review & Print reference cells that don't exist in the input tabs — a latent bug that only Local Guide escaped because of its flat table layout. v2.1 replaces the whole preview layer rather than patching it.
3. Customization (logos, themes, palettes) is structurally impossible inside Excel but trivial in HTML/CSS.

**Three things land in v2.1:**

- **Excel bug fix (Option B):** reflow all 8 input tabs so inputs land at `B5:Bn` sequentially, unblocking the Start-tab progress dashboard and any future in-Excel references.
- **Launch tab:** Review & Print tab is renamed **Launch**; the 3-page preview is removed; a single big pseudo-button opens `./welcome-book-renderer.html` in the buyer's browser.
- **HTML renderer:** single-file app bundled in the zip. 3 themes × 4 palettes × optional logo = 12 branded variants, all produced at Ctrl+P.

**Positioning:** v2 sold "a spreadsheet that prints to PDF." v2.1 sells "a spreadsheet that renders a branded guest book." Same inputs, same delivery format (zip download, offline use), dramatically higher perceived value.

**Scope for this design:** GST-001 v2.1 only. The renderer pattern is designed to generalize to OPS-001 / TAX-001 / TAX-002 / TAX-003 as a follow-up lane.

---

## 1. Architecture: the hybrid pipeline

```
┌─────────────────┐      ┌──────────────────────────────┐      ┌─────────┐
│ xlsx (filled)   │  →   │ welcome-book-renderer.html   │  →   │ PDF     │
│                 │      │                              │      │         │
│ buyer fills     │      │ opened in buyer's browser:   │      │ Ctrl+P  │
│ 80 inputs       │      │ 1. drops the xlsx onto it    │      │ Save as │
│ across 8 tabs   │      │ 2. picks theme + palette     │      │ PDF     │
│                 │      │ 3. optionally drops logo     │      │         │
│ Excel stays the │      │ 4. sees live 3-page preview  │      │         │
│ data source of  │      │ 5. prints                    │      │         │
│ truth           │      │                              │      │         │
└─────────────────┘      └──────────────────────────────┘      └─────────┘
```

**Data flow:** entirely client-side. The xlsx never leaves the buyer's machine. SheetJS (xlsx.full.min.js, ~600KB minified) parses the file in-browser; the renderer reads known cell addresses (per §5 data contract) and writes them into the theme's HTML template.

**State persistence:** theme/palette/logo choices persist in `localStorage` keyed by a stable property-ID (the value at `Property!B5`). Next time the buyer drops the same xlsx, their customizations return. Clearing browser data resets — acceptable.

**Offline:** the HTML file has no network dependencies. Inlined CSS, inlined SheetJS, inlined any stock SVG icons, inlined Google Fonts via `@font-face` with base64-encoded woff2 for Cormorant Garamond + Inter + JetBrains Mono (display/body/mono per brand lock §5). Target file size: <1MB.

---

## 2. What v2.1 changes on the Excel side

### 2.1 — Bug fix (Option B): reflow inputs to column B

**Problem (from v2 v1 build):** `build_input_tab` places inputs at columns `D-L` merged, starting at row 10 (after a card header on row 9). But every cross-sheet formula on Start (progress dashboard, lines 510-518) and v2 Review & Print (preview formulas, lines 1211-1304) references column B, rows 5-12. Result: all non-Local-Guide data returns `(not set)` even in the filled DEMO file.

**Fix:** refactor `build_input_tab` so inputs land at `B5, B6, B7, ..., Bn` sequentially — matching the references. Card headers become wide labels above each group; label columns shrink to A only; input merges from B-L. Row numbers become stable and predictable per tab:

| Tab | Input cells | Count |
|---|---|---|
| Property | `B5:B12` | 8 |
| Arrival | `B5:B11` | 7 |
| WiFi + Tech | `B5:B12` | 8 |
| House Rules | `B5:B11` | 7 |
| Local Guide | `B10:E29` (table; unchanged from v2) | 80 |
| Trash | `B5:B11` | 7 |
| Departure | `B5:B10` | 6 |
| Emergency | `B5:B13` | 9 |

The card-grouped visual stays. Card headers remain a row-spanning band above each input group; only the input cells shift to col B so formulas match.

**Collateral:** Start-tab progress formulas (build_welcome_book_v2.py lines 510-560) already assume col B with these ranges — they start working once the underlying cells actually contain data.

### 2.2 — Launch tab (replaces Review & Print)

Renamed: `Review & Print` → `Launch`. Tab color stays Muted Gold `#C9A24B`.

**Kept from v2 Review & Print:**
- Header band (rows 1-6)
- Readiness dashboard (rows 8-14): 3 cards — Completion · Red Flags · Status. All formulas unchanged; they now actually work because of §2.1.

**Removed:**
- 3-page live preview (rows 24-80). The preview moves to HTML.
- All cross-sheet preview formulas (`=CONCATENATE("Welcome to ", Property!B5)`, `=IF(source="","(not set)",source)`, etc.).
- Print area `A24:L80` is removed; new print area is `A1:L22` (just the dashboard, if a buyer insists on printing Excel).

**Added:**
- **Rows 16-21:** a single full-width pseudo-button:
  > **`OPEN YOUR WELCOME BOOK →`**
  > *Opens in your browser. Pick a theme, drag this file in, print a 3-page PDF.*

  Implementation: merged A16:L21 with navy fill, 3px gold border, Cormorant 18pt bold parchment. `=HYPERLINK("welcome-book-renderer.html","OPEN YOUR WELCOME BOOK →")`. The relative path (no `./` prefix, more reliable across Excel versions on Windows/macOS) works because the xlsx and the html live in the same folder after the buyer extracts the zip. Requires the xlsx to have been saved at least once; the how-to PDF calls this out.

- **Row 22:** fine-print: *"The renderer reads this file directly — just drag it onto the page after it opens."*

### 2.3 — Other tabs

- **Start tab:** unchanged except progress formulas now work.
- **Input tabs (Property through Emergency):** reflow per §2.1; card headers and all copy preserved; back/next buttons unchanged.
- **Bonus: Listing Copy:** unchanged.
- **× Host Notes:** unchanged.

---

## 3. HTML renderer — file structure

### 3.1 — Single file: `welcome-book-renderer.html`

One self-contained file. No external fetches at runtime. Ships in the Etsy zip alongside the xlsx files.

```
<!DOCTYPE html>
<html>
<head>
  <style>/* ~20KB: reset, brand tokens, theme × palette × print CSS */</style>
  <style>/* base64-encoded @font-face: Cormorant, Inter, JetBrains Mono */</style>
</head>
<body>
  <div id="app"></div>
  <script>/* ~600KB: SheetJS xlsx.full.min.js inlined */</script>
  <script>/* ~30KB: renderer app — parse, theme, preview, print */</script>
</body>
</html>
```

Target total: **under 1MB**. Tolerance: up to 1.5MB if fonts push it; Etsy zip limit is generous.

### 3.2 — Landing state (no file dropped yet)

```
┌─────────────────────────────────────────────────┐
│  THE STR LEDGER · WELCOME BOOK RENDERER         │
├─────────────────────────────────────────────────┤
│                                                 │
│    ┌───────────────────────────────────────┐   │
│    │                                       │   │
│    │      📂  Drop your xlsx here          │   │
│    │                                       │   │
│    │  — or —                               │   │
│    │                                       │   │
│    │  [ Try with demo data ]               │   │
│    │                                       │   │
│    └───────────────────────────────────────┘   │
│                                                 │
│    GST-001 · v2.1 · works offline              │
└─────────────────────────────────────────────────┘
```

Dropping a file or clicking the demo button advances to the Preview state.

### 3.3 — Preview state (file dropped)

Two-column layout:

- **Left sidebar (280px):** customization panel — theme picker (3 tier thumbnails), palette picker (4 colored swatches), logo drop-zone, property-name confirmation, print button.
- **Right canvas (rest):** the 3-page PDF preview at 1:1 scale, scrollable. Live-updates as the buyer changes customizations.

Print media query hides the sidebar entirely; only the right canvas pages print.

---

## 4. HTML renderer — themes and palettes

### 4.1 — Three themes (layout/typography variants)

Each theme defines layout, type scale, dividers, imagery treatment. Themes are orthogonal to palettes.

| Theme | Vibe | Notes |
|---|---|---|
| **Magazine** *(default)* | Navy hero band + info cards + pull quote + gold rule dividers | Editorial feel; mock page 1 from brainstorm |
| **Editorial** | Typography-only; thin gold rules; no hero band | Most conservative; prints anywhere cleanly |
| **Hotel** | Full-bleed hero + engraved small caps + ornamental flourishes + serif-only body | Most opinionated; foil-stamp/concierge feel |

Theme picker in sidebar: three 88×110 thumbnails showing a miniature of each theme's page 1.

### 4.2 — Four palettes (color variants)

Palettes swap a 4-token set on top of any theme. CSS custom properties:

```
--primary    (hero band + headings)
--accent     (gold / rules / callouts)
--bg         (page paper)
--ink        (body text)
```

| Palette | `--primary` | `--accent` | `--bg` | `--ink` |
|---|---|---|---|---|
| **Harbor** *(default, STR Ledger brand)* | `#12304E` | `#C9A24B` | `#F6EFE2` | `#2B2B2B` |
| **Cabin Green** | `#2D5A3D` | `#C17B4A` | `#F3EDDE` | `#2B2B2B` |
| **Terracotta Sunset** | `#7A3B2E` | `#D9A04A` | `#F6EFE2` | `#2B2B2B` |
| **Modern Charcoal** | `#2A2A2A` | `#8BA98E` | `#F4F0EB` | `#2B2B2B` |

Palette picker: 4 colored dots in sidebar. Clicking swaps all tokens. Contrast ratios audited per palette; all body text stays AAA-compliant on `--bg`.

### 4.3 — Logo slot

Sidebar drop-zone for PNG/SVG. Sits in the top-left of every page's hero/header. Max height 60px printed; auto-width. Removable via an × button. Without a logo, the header shows a text-only property-name lockup.

**SVG allowlist:** parse and sanitize uploaded SVG — strip `<script>`, event handlers, external references. Done client-side.

---

## 5. Data contract (xlsx → renderer)

The renderer reads these cells. Addresses stable per §2.1.

### 5.1 — Property
| Field | Cell |
|---|---|
| Property name | `Property!B5` |
| Host first name | `Property!B6` |
| Host phone | `Property!B7` |
| Check-in date | `Property!B8` |
| Check-out date | `Property!B9` |
| Property type | `Property!B10` |
| Max guests | `Property!B11` |
| Address | `Property!B12` |

### 5.2 — Arrival
| Field | Cell |
|---|---|
| Full address | `Arrival!B5` |
| Entry method | `Arrival!B6` |
| Door code | `Arrival!B7` |
| Parking | `Arrival!B8` |
| Route | `Arrival!B9` |
| Arrival window | `Arrival!B10` |
| If-early option | `Arrival!B11` |

### 5.3 — WiFi + Tech
| Field | Cell |
|---|---|
| SSID | `'WiFi + Tech'!B5` |
| Password | `'WiFi + Tech'!B6` |
| Backup SSID | `'WiFi + Tech'!B7` |
| TV streaming | `'WiFi + Tech'!B8` |
| Smart-lock note | `'WiFi + Tech'!B9` |
| Thermostat | `'WiFi + Tech'!B10` |
| TV controls | `'WiFi + Tech'!B11` |
| WiFi support | `'WiFi + Tech'!B12` |

### 5.4 — House Rules
| Field | Cell |
|---|---|
| Quiet hours | `'House Rules'!B5` |
| Max guests | `'House Rules'!B6` |
| Smoking | `'House Rules'!B7` |
| Pets | `'House Rules'!B8` |
| Events | `'House Rules'!B9` |
| Shoes | `'House Rules'!B10` |
| Custom rules | `'House Rules'!B11` |

### 5.5 — Local Guide (table; unchanged from v2)

Rows `10..29`, columns `A..E`:
- `A` — Category (pre-filled, hardcoded)
- `B` — Name
- `C` — Distance
- `D` — Phone
- `E` — Why we love it

Renderer shows top 10 non-empty rows on page 2.

### 5.6 — Trash
Cells `Trash!B5:B11` — 7 inputs (pickup_day, bin_location, recycling_accepted, sorting_rules, pickup_location, thermostat_range, power_outage).

### 5.7 — Departure
Cells `Departure!B5:B10` — 6 inputs (checkout_time, linen_location, trash_spot, thermostat_setting, key_return, custom_tasks).

### 5.8 — Emergency
User inputs: `Emergency!B5:B13` — 9 inputs (hospital_name, hospital_phone, hospital_address, urgent_care_name, urgent_care_phone, police_non_emergency, vet, utility, additional notes). Plus: poison control is hardcoded in Excel (always `1-800-222-1222`); host phone is shown by referencing `Property!B7` directly at render time (no separate Emergency cell).

### 5.9 — Missing / empty handling

Any cell that parses to empty string or `undefined` renders as a dash (`—`) in the output, not `(not set)`. Missing required fields (property name, host phone, WiFi) trigger a small yellow banner at the top of the preview: *"Fill these on the Launch tab before printing."*

---

## 6. Print fidelity

### 6.1 — `@page` and CSS page rules

```css
@page { size: Letter portrait; margin: 0.5in; }
@media print {
  #sidebar, .drop-zone, .banner { display: none; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
}
```

Each of the 3 pages is a `<section class="page">` sized to 7.5in × 10in (letter minus margins). Pages are rigid — any content overflow is caught at render time by a guard that warns the buyer: *"Your Local Guide has more than 10 entries — printing will trim to the first 10. Edit to prioritize."*

### 6.2 — Fonts

Cormorant Garamond (display), Inter (body), JetBrains Mono (labels/mono). Embedded as base64-woff2 `@font-face` — renders identically on Mac/Windows/Linux. No system-font fallback needed for print fidelity.

### 6.3 — Tested browsers

MVP: Chrome 120+, Safari 17+, Edge. Firefox as a soft target (should work; if `@page` quirks appear, document as known limitation). No IE/legacy support.

---

## 7. Bundle changes

Etsy zip contents:

```
GST-001-welcome-book.zip
├── GST-001-welcome-book-DEMO.xlsx       (unchanged structure; §2.1 bug fix applied)
├── GST-001-welcome-book-BLANK.xlsx      (unchanged structure; §2.1 bug fix applied)
├── welcome-book-renderer.html           ← NEW
├── GST-001-sample-output.pdf            (regenerated from the renderer, not Excel)
└── GST-001-how-to.pdf                   (updated for the new 2-step flow)
```

The how-to PDF needs a 1-page rewrite: (1) fill the xlsx, (2) open `welcome-book-renderer.html`, drop the xlsx, pick theme/palette/logo, (3) Ctrl+P. Screenshots.

Etsy listing copy needs a one-paragraph update: swap the "3-page live preview built into Excel" bullet for "magazine-grade branded PDF rendered in your browser — 3 themes, 4 palettes, logo upload."

---

## 8. Reusability for other 4 SKUs (future)

The renderer is designed as a small framework:

- **`renderer-core.js`** (~10KB): SheetJS wrapper, state management, print helpers, theme/palette swap
- **`theme-*.js` + `theme-*.css`** per theme
- **`schema-GST-001.js`**: defines the data contract from §5 plus per-page layout instructions

To add OPS-001 Turnover Checklist as a themed renderer: copy `welcome-book-renderer.html` → `turnover-checklist-renderer.html`, swap in `schema-OPS-001.js`. Theme files unchanged. Est. per-SKU cost after framework lands: ~3-4 hrs each.

Scope discipline: v2.1 ships GST-001 only. The core/framework shape is chosen with reuse in mind, but no second SKU is built in this project.

---

## 9. Acceptance criteria

- [ ] `templates/_build/build_welcome_book_v2.py` updated: input tabs reflow to col B per §2.1; Launch tab replaces Review & Print per §2.2
- [ ] `templates/_masters/GST-001-welcome-book-DEMO.xlsx` rebuilt with fix: Start-tab progress dashboard shows 100% when fully filled; Launch tab readiness dashboard shows 0 red flags / READY
- [ ] `templates/_masters/GST-001-welcome-book-BLANK.xlsx` rebuilt: progress 0%, Launch readiness shows 10 red flags / NEEDS WORK
- [ ] `templates/_delivery/GST-001-welcome-book/welcome-book-renderer.html` exists, single-file, <1.5MB, opens offline in Chrome/Safari/Edge
- [ ] Dropping `GST-001-welcome-book-DEMO.xlsx` onto the renderer shows a filled 3-page preview with Tier 2 Magazine theme + Harbor palette
- [ ] Theme picker cycles Magazine → Editorial → Hotel; preview updates live
- [ ] Palette picker cycles Harbor → Cabin → Terracotta → Charcoal; preview updates live
- [ ] Logo drop-zone accepts PNG + SVG; uploaded logo appears in page header; × removes it; SVG sanitizer strips scripts/event handlers
- [ ] Ctrl+P produces a 3-page letter-portrait PDF with sidebar/UI hidden, fonts embedded, images preserved
- [ ] `Excel Launch tab → Open Your Welcome Book` button opens `welcome-book-renderer.html` in the default browser (tested on Windows + macOS with the zip extracted)
- [ ] `GST-001-sample-output.pdf` regenerated from the renderer (Tier 2 + Harbor + no logo)
- [ ] `GST-001-how-to.pdf` updated with the new 2-step flow + screenshots
- [ ] `copy/etsy-listings/GST-001-welcome-book.md` copy updated for v2.1

---

## 10. Out of scope (for v2.1)

- Cover photo upload or preset picker — phase 2
- Custom accent color picker — cut (preset palettes cover 90% of cases)
- Hosted version at `thestrledger.com/welcome-book` — add later if lead-magnet value is wanted
- Themed renderers for OPS-001 / TAX-001 / TAX-002 / TAX-003 — separate project once v2.1 proves the pattern
- Internationalization / non-letter paper sizes — not needed for US Etsy market

---

## 11. Risks

| Risk | Probability | Mitigation |
|---|---|---|
| SheetJS parsing fails on some xlsx variants (e.g., Google-Sheets-exported xlsx) | Low-Medium | Test against xlsx exported from Excel 2016, Excel 365, and Google Sheets during QA |
| Print CSS `@page` produces off-by-one pixels across browsers, splitting a page | Medium | Use `page-break-after: always`; leave ~0.25in safety margin on content blocks; QA in all three browsers |
| Cormorant Garamond base64-embedded font pushes file over 1.5MB | Medium | If so, ship Cormorant subset (Latin-Basic only) — drops ~40% |
| Excel's `HYPERLINK("./welcome-book-renderer.html")` doesn't resolve if the buyer moves the xlsx out of the extracted folder | Medium | how-to PDF explicitly says "keep these files together"; link failure is visible and recoverable (they can open the HTML directly) |
| Buyer uploads a 5MB logo PNG that bloats print output | Low | Downscale in-renderer to max 400px wide before embedding |
| SVG logo contains `<script>` or tracking pixel | Low-Medium | Strict sanitizer: strip script, on-*, href starting with javascript:, external image refs |
| Printed output differs meaningfully between Chrome and Safari | Medium | Adopt a small set of safe primitives (no subgrid, no @container, no scroll-driven animations); test matrix in acceptance criteria |

---

## 12. Open items (for implementation plan, not this design)

- Exact copy for the "fill these required fields" banner
- Logo drop-zone visual treatment (dashed border vs pill)
- Demo-data source: use the same SAMPLE constants currently in build_welcome_book_v2.py, exported to a small JSON that the renderer imports
- Default print margins per palette (Cabin Green's darker primary may benefit from slightly larger top margin) — tune during QA
- Whether the Launch tab keeps the readiness dashboard formulas as-is or re-points to the new cell addresses (it will — §2.1 preserves the ranges the existing formulas already expect)

---

**End of design. Awaiting user review before invoking writing-plans skill.**
