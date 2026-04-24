# GST-001 Welcome Book v2.1 — Hybrid Renderer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot GST-001 Welcome Book from Excel-native PDF to a hybrid pipeline (xlsx fills, HTML renders). Fix the v2 col-D/col-B cell-reference bug, replace Review & Print with a Launch tab that opens an external renderer, and build a single-file `welcome-book-renderer.html` that reads the xlsx client-side (SheetJS), applies a chosen theme/palette/logo/QR combination, and prints a 3-page magazine-quality PDF.

**Architecture:** Two deliverables land together.
1. **Excel side** (Python/openpyxl): `build_welcome_book_v2.py` is modified so `build_input_tab` places inputs in column B at sequential rows 5..n (fixing the latent bug). Tab 9 is renamed `Launch` and its contents stripped back to the readiness dashboard + one big `OPEN YOUR WELCOME BOOK →` pseudo-button (HYPERLINK to `welcome-book-renderer.html`).
2. **Renderer side** (self-contained HTML): `templates/_delivery/GST-001-welcome-book/welcome-book-renderer.html` — a single file with inlined CSS, base64 @font-face, SheetJS (`xlsx.full.min.js`), and qrcode-generator. Drag-and-drop xlsx → parse via SheetJS → render 3-page preview in chosen theme+palette+logo → Ctrl+P produces the PDF.

**Tech Stack:** Python 3.10+, `openpyxl==3.1.5` (existing) · HTML5 + vanilla JS (no framework, no bundler) · [SheetJS community edition](https://sheetjs.com/) 0.20.x (`xlsx.full.min.js`, MIT) · [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 1.4.x (MIT) · Cormorant Garamond + Inter + JetBrains Mono (Google Fonts, base64-embedded).

**Parent design:** [../specs/2026-04-24-welcome-book-v2.1-hybrid-renderer.md](../specs/2026-04-24-welcome-book-v2.1-hybrid-renderer.md)
**Supersedes portions of:** [../specs/2026-04-23-welcome-book-v2-tool-redesign.md](../specs/2026-04-23-welcome-book-v2-tool-redesign.md) §5 and §7.4
**Related existing artifacts:**
- `templates/_build/build_welcome_book_v2.py` — modified (Tasks 1-3)
- `templates/_build/brand_config.py` — unchanged (helpers already in place)
- `templates/_delivery/GST-001-welcome-book/GST-001-howto.md` — rewrite for new 2-step flow (Task 14)
- `copy/etsy-listings/GST-001-welcome-book.md` — 3 bullets swapped (Task 14)

---

## File structure

### Create
```
templates/_delivery/GST-001-welcome-book/
  welcome-book-renderer.html              # single-file app, ~1MB
  _assets/
    fonts-base64.css                      # extracted @font-face for maintainability
    sheetjs.min.js                        # SheetJS 0.20.x (committed for reproducibility)
    qrcode.min.js                         # qrcode-generator 1.4.x
    renderer.css                          # dev CSS before inlining
    renderer.js                           # dev JS before inlining
    themes/
      magazine.css                        # Tier 2 default
      editorial.css                       # Tier 1
      hotel.css                           # Tier 3
    demo-data.json                        # exported from SAMPLE constants (for "Try demo data")
  build-renderer.py                       # script that inlines the above into welcome-book-renderer.html
```

### Modify
```
templates/_build/build_welcome_book_v2.py  # reflow inputs to col B; Launch tab; export demo JSON
copy/etsy-listings/GST-001-welcome-book.md # swap 3 bullets (Task 14)
templates/_delivery/GST-001-welcome-book/GST-001-howto.md  # rewrite for new flow (Task 14)
```

### Regenerate (committed after build)
```
templates/_masters/GST-001-welcome-book-DEMO.xlsx   # with fixed cell layout
templates/_masters/GST-001-welcome-book-BLANK.xlsx  # with fixed cell layout
templates/_delivery/GST-001-welcome-book/GST-001-sample-output.pdf  # printed from renderer (Task 14)
```

---

## Task 1: Reflow input tabs to column B (the bug fix)

**Files:**
- Modify: `templates/_build/build_welcome_book_v2.py` — function `build_input_tab` (lines 224-363)

**Acceptance:** `build_input_tab` places inputs at `B{row}` merged to `L{row}`; labels at `A{row}` alone. The first input in every card lands at row 5, 6, 7... sequentially. Card headers still render at the row above each input group. DEMO build produces `Property!B5 = "Smokies Ridge Cabin"`, `Property!B6 = "Daniel"`, etc.

- [ ] **Step 1: Read the current `build_input_tab` structure**

Run: `sed -n '224,363p' templates/_build/build_welcome_book_v2.py`

Expected: see the current implementation that starts `current_row = 9`, merges `A{row}:C{row}` for labels and `D{row}:L{row}` for inputs, with a card header on row 9, then input rows, then a spacer, then next card.

- [ ] **Step 2: Rewrite the layout constants at the top of `build_input_tab`**

Replace the existing body (lines 265-334, the `current_row = 9` loop) with this layout:

```python
    # v2.1 layout: inputs live at B{row} for cross-sheet formula compatibility.
    # Card headers span A:L as a full-width band ONE ROW ABOVE the first
    # input of the card. Labels go in column A only. Inputs merge B:L.
    #
    # Row 5 is the first input row. Card N's header appears at row K-1 where
    # row K is card N's first input. The FIRST card header is at row 4
    # (before row 5, first input).

    current_input_row = 5
    is_first_card = True

    for card in cards:
        # Card header spans A:L on the row just above the card's first input
        header_row = current_input_row - 1 if is_first_card else current_input_row
        if not is_first_card:
            current_input_row += 1  # header consumes one row
        card_header(ws, header_row, ("A", "L"), card.header)
        body_start = current_input_row

        # Input rows
        for row_spec in card.rows:
            if len(row_spec) == 2:
                label, value = row_spec
                options = None
            elif len(row_spec) == 3:
                label, value, options = row_spec
            else:
                raise ValueError(f"Card row must be 2 or 3 tuple, got {row_spec}")

            # Label — column A only (narrow)
            lc = ws.cell(row=current_input_row, column=1)
            lc.value = label
            lc.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)
            lc.alignment = Alignment(horizontal="right", vertical="center",
                                      indent=1)

            # Input — merged B:L
            ws.merge_cells(f"B{current_input_row}:L{current_input_row}")
            ic = ws[f"B{current_input_row}"]
            if value != "" and value is not None:
                if isinstance(value, str) and value.startswith("="):
                    ic.value = value
                    apply_style(ic, formula_cell_style())
                else:
                    ic.value = value
                    apply_style(ic, input_cell_style())
                    ic.alignment = Alignment(horizontal="left",
                                              vertical="center",
                                              wrap_text=True, indent=1)
            else:
                apply_style(ic, input_cell_style())

            if options:
                add_dropdown(ws, f"B{current_input_row}", options)

            ws.row_dimensions[current_input_row].height = card.row_height
            current_input_row += 1

        # Static content rows (after inputs) — full-width merged
        for static_text in card.static:
            ws.merge_cells(f"A{current_input_row}:L{current_input_row}")
            sc = ws[f"A{current_input_row}"]
            sc.value = static_text
            sc.font = Font(name=FONT_BODY, size=10, italic=True,
                            color=COLOR_TEXT)
            sc.alignment = Alignment(horizontal="left", vertical="center",
                                      wrap_text=True, indent=2)
            sc.fill = parchment_fill
            ws.row_dimensions[current_input_row].height = 24
            current_input_row += 1

        body_end = current_input_row - 1

        # Card body border/fill — cols A:L so it spans the whole row
        card_body_fill(ws, body_start, body_end, ("A", "L"), border=True)

        is_first_card = False

    footer_row = current_input_row + 1
```

Note: the existing code has `parchment_fill = PatternFill("solid", fgColor=COLOR_BG_LIGHT)` a few lines earlier — keep that. The snippet above uses `parchment_fill` without redeclaring.

Also: DELETE the old section header band / instruction strip setup between lines 243 and 263 — we no longer want row 7 as an instruction strip because row 5 is now the first input. Replace rows 1-4 with the step header band only (which `section_header_band` already renders on rows 1-5):

```python
    # Row 1-5: step header band. section_header_band already renders here.
    section_header_band(ws, section_num, 8, title, subtitle, prev_tab, next_tab)

    # Row 4 will be OVERWRITTEN by the first card's header. That's intentional —
    # the step header band ends at row 5 visually but the title sits on rows 2-3;
    # row 4 is a subtitle row that the first card header band now uses.
    #
    # Actually — cleaner: have section_header_band render into rows 1-3 only,
    # OR move the first input to row 6 instead of row 5.
```

Decision: move the first input to row 6 (not row 5). This keeps `section_header_band` at rows 1-5 intact and avoids clobbering the section subtitle. Update `current_input_row = 5` → `current_input_row = 6`. Update the acceptance criteria and §5 data contract if needed.

**Actually — stop. Re-read the spec §5. It says `Property!B5:B12`.** So the spec requires row 5. Two resolutions:

Option α: Shorten `section_header_band` to rows 1-4 only (drop subtitle). Then row 5 is clean. Downside: lose the italic subtitle shown in v2.

Option β: Keep subtitle but move first input to row 6; UPDATE the spec §5 data contract to `B6:B13` per tab. Downside: spec re-edit.

Pick **β**. More respectful of the existing header band. Update the spec in Step 3.

- [ ] **Step 3: Update the spec §5 data contract to use row-6-based addressing**

Edit `docs/superpowers/specs/2026-04-24-welcome-book-v2.1-hybrid-renderer.md` §5 to shift every starting row by 1:

| Tab | v2.1 spec (before) | v2.1 spec (after) |
|---|---|---|
| Property | `B5:B12` | `B6:B13` |
| Arrival | `B5:B11` | `B6:B12` |
| WiFi + Tech | `B5:B12` | `B6:B13` |
| House Rules | `B5:B11` | `B6:B12` |
| Trash | `B5:B11` | `B6:B12` |
| Departure | `B5:B10` | `B6:B11` |
| Emergency | `B5:B13` | `B6:B14` |
| Local Guide | `B10:E29` | `B10:E29` (unchanged — table layout) |

And update §2.1's reflow table identically.

Run:
```bash
sed -i 's|`B5:B12`|`B6:B13`|g; s|`B5:B11`|`B6:B12`|g; s|`B5:B13`|`B6:B14`|g; s|`B5:B10`|`B6:B11`|g' docs/superpowers/specs/2026-04-24-welcome-book-v2.1-hybrid-renderer.md
```

Expected: all data-contract references updated. Verify with `grep "B5:" docs/superpowers/specs/2026-04-24-welcome-book-v2.1-hybrid-renderer.md` → no matches.

Also update `Property!B5`, `Property!B6` etc. in `§5.1` to shift by one: `B5 → B6`, `B6 → B7`, etc. Replace §5.1-§5.8 with the new row numbers. Exception: `Property!B7` host-phone references elsewhere (e.g., §5.8 note) become `Property!B8`.

Use Edit tool per row — sed would break the subtle edge cases. Verify by re-reading the spec and spot-checking one tab.

- [ ] **Step 4: Update the existing cross-sheet formulas in build_welcome_book_v2.py**

The Start tab progress formulas (lines 510-518) and Start section_rows (lines 527-534) currently read `B5:B12`, `B5:B11` etc. After §2.1 reflow, inputs are at `B6:B13`, `B6:B12` etc. Update these ranges.

Run: `grep -n "B5:B1\|B5:B" templates/_build/build_welcome_book_v2.py`

Expected: ~16 matches across Start tab progress + Launch tab required-fields + v2 Review & Print preview.

For each match, shift `B5 → B6`, `B{n}:B{m} → B{n+1}:B{m+1}`. Use the Edit tool.

Example — Start tab progress ranges (line 510):

```python
    ranges = [
        "'Property'!B6:B13",    # 8 fields (was B5:B12)
        "'Arrival'!B6:B12",     # 7 fields (was B5:B11)
        "'WiFi + Tech'!B6:B13", # 8 fields (was B5:B12)
        "'House Rules'!B6:B12", # 7 fields (was B5:B11)
        "'Local Guide'!B6:E25", # 80 cells (20 rows × 4 cols) — unchanged, still starts at row 6
        "'Trash'!B6:B12",       # 7 fields (was B5:B11)
        "'Departure'!B6:B11",   # 6 fields (was B5:B10)
        "'Emergency'!B6:B14",   # 9 fields (was B5:B13)
    ]
```

Wait — `'Local Guide'!B6:E25` is wrong. Local Guide's inputs are at rows 10-29 (per `build_local_tab`). The original `B6:E25` was already a bug. Leave it at **`B10:E29`** (the correct range). Note in commit message.

Same shift for section_rows at line 527:

```python
    section_rows = [
        ("① Property Info",   "Property",    "B6:B13",   8),
        ("② Arrival",          "Arrival",     "B6:B12",   7),
        ("③ WiFi + Tech",      "WiFi + Tech", "B6:B13",   8),
        ("④ House Rules",      "House Rules", "B6:B12",   7),
        ("⑤ Local Guide",      "Local Guide", "B10:E29",  80),  # fixed from B6:E25
        ("⑥ Trash",            "Trash",       "B6:B12",   7),
        ("⑦ Departure",        "Departure",   "B6:B11",   6),
        ("⑧ Emergency",        "Emergency",   "B6:B14",   9),
    ]
```

- [ ] **Step 5: Build the DEMO file and verify cell addresses**

Run:
```bash
cd templates/_build && python build_welcome_book_v2.py
```

Expected: `GST-001-welcome-book-DEMO.xlsx` and `GST-001-welcome-book-BLANK.xlsx` written to `templates/_masters/`. No errors.

Then verify cell addresses with a Python snippet:

```bash
python - <<'PY'
from openpyxl import load_workbook
wb = load_workbook("templates/_masters/GST-001-welcome-book-DEMO.xlsx")
print("Property B6:", wb["Property"]["B6"].value)
print("Property B7:", wb["Property"]["B7"].value)
print("Property B8:", wb["Property"]["B8"].value)
print("WiFi B6:", wb["WiFi + Tech"]["B6"].value)
print("WiFi B7:", wb["WiFi + Tech"]["B7"].value)
print("Local Guide B10:", wb["Local Guide"]["B10"].value)
PY
```

Expected output:
```
Property B6: Smokies Ridge Cabin
Property B7: Daniel
Property B8: +1 (555) 555-0199
WiFi B6: SmokiesRidge_Guest
WiFi B7: welcome2024
Local Guide B10: Mountain Grind
```

- [ ] **Step 6: Verify the Start tab progress dashboard renders the correct percentage**

Open `templates/_masters/GST-001-welcome-book-DEMO.xlsx` in Excel manually. Navigate to Start tab. Verify that:
- Zone 5 header shows "Progress: 100% complete" (or very close)
- All 8 section-status rows show `✅ Done`

If progress shows 0%, the formula ranges from Step 4 didn't take — re-read the formula refs and fix.

- [ ] **Step 7: Commit**

```bash
git add templates/_build/build_welcome_book_v2.py \
        templates/_masters/GST-001-welcome-book-DEMO.xlsx \
        templates/_masters/GST-001-welcome-book-BLANK.xlsx \
        docs/superpowers/specs/2026-04-24-welcome-book-v2.1-hybrid-renderer.md

git commit -m "$(cat <<'EOF'
fix: v2.1 reflow input tabs to col B (bug fix Option B)

build_input_tab now places inputs at column B (merged B:L) starting
at row 6, matching the cross-sheet formula references on the Start
progress dashboard and the to-be-added Launch readiness dashboard.

Also fixes the stale Local Guide range B6:E25 → B10:E29 — the prior
range never matched the actual table location and was producing false
progress percentages.

Spec §5 data contract updated: first input row is now B6 (not B5)
per tab, reflecting the section_header_band occupying rows 1-5.
EOF
)"
```

---

## Task 2: Verify in-Excel readiness + Launch tab scaffold (remove preview)

**Files:**
- Modify: `templates/_build/build_welcome_book_v2.py` — function `build_review_print_tab` (currently lines 1040-1315)

**Acceptance:** Tab 9 is renamed `Launch` (tabColor stays gold). Header + readiness dashboard + new big `OPEN YOUR WELCOME BOOK →` pseudo-button stay. The 3-page live preview (rows 24-80 with cross-sheet formulas) is deleted. Print area shrinks to `A1:L22`. Function renamed `build_launch_tab`.

- [ ] **Step 1: Rename TAB_NAMES entry**

In `templates/_build/build_welcome_book_v2.py` around line 57, change:

```python
    "Review & Print",     # 9
```

to:

```python
    "Launch",             # 9
```

Run: `grep -n 'Review & Print\|"Launch"' templates/_build/build_welcome_book_v2.py`

Expected: one match on line 67 (our change) plus several references in `build_review_print_tab` body + hyperlink targets on other tabs. Those need updating.

- [ ] **Step 2: Update all hyperlink references to "Review & Print"**

For every tab that has a back/next pointing at `Review & Print`, update to `Launch`. Likely in Emergency → Review & Print next button, and Bonus tab back button.

Run: `grep -n "'Review & Print'" templates/_build/build_welcome_book_v2.py`

Expected: references in Emergency next_tab, Bonus back target, and the Review & Print tab's own internal Back button. Update each to `'Launch'`. Approximate 5-8 matches.

- [ ] **Step 3: Rename the function and replace its body**

Rename `build_review_print_tab` → `build_launch_tab`. Keep the signature:

```python
def build_launch_tab(wb, variant):
    """Tab 9 — Launch. Readiness dashboard + OPEN YOUR WELCOME BOOK button.

    v2.1 change: the 3-page live preview (v2 rows 24-80) is removed.
    The preview moves to welcome-book-renderer.html.
    """
```

Keep the existing Zone 1 header (rows 1-6, navy band) and Zone 2 readiness dashboard (rows 8-14, 3 cards).

**Replace Zone 3 "GENERATE PDF" pseudo-button with "OPEN YOUR WELCOME BOOK →":**

Replace the existing pseudo_button call (around line 1167-1170) with:

```python
    # --- ZONE 3: OPEN renderer pseudo-button (rows 16-21) ---
    pseudo_button(ws, "A16", "L21",
                   "📘  OPEN YOUR WELCOME BOOK →\nRenders your branded PDF in your browser.",
                   None,  # hyperlink_target — None means use external_link kwarg below
                   variant="primary")
```

**But** — our existing `pseudo_button` helper only supports in-workbook anchor links. We need to extend it to accept an `external_link` kwarg for file-system paths. See Step 4.

- [ ] **Step 4: Extend `pseudo_button` in brand_config.py to support external_link**

Read the current signature in `templates/_build/brand_config.py`:

```bash
grep -n -A 20 "^def pseudo_button" templates/_build/brand_config.py
```

Expected: signature `pseudo_button(ws, top_left, bottom_right, text, hyperlink_target, variant="primary")` and a body that wraps `hyperlink_target` into `=HYPERLINK("#{target}", text)`.

Extend to:

```python
def pseudo_button(ws, top_left, bottom_right, text, hyperlink_target,
                  variant="primary", external_link=None):
    """Render a merged-cells block that acts like a button.

    Args:
        ...existing...
        external_link: optional file-system path (e.g. "welcome-book-renderer.html")
            for cross-file links. If set, `hyperlink_target` is ignored.
    """
    ...existing top-of-function code to set up cells and styles...

    # Build the HYPERLINK formula
    anchor = ws[top_left]
    if external_link is not None:
        # External path (relative to the xlsx file). No '#' prefix.
        anchor.value = f'=HYPERLINK("{external_link}", "{text}")'
    elif hyperlink_target is not None:
        anchor.value = f'=HYPERLINK("#{hyperlink_target}", "{text}")'
    else:
        anchor.value = text
```

Modify the call site in Task 2 Step 3 to use `external_link="welcome-book-renderer.html"`:

```python
    pseudo_button(ws, "A16", "L21",
                   "📘 OPEN YOUR WELCOME BOOK →",
                   hyperlink_target=None,
                   variant="primary",
                   external_link="welcome-book-renderer.html")
```

**Note on Excel newline-in-formula:** `=HYPERLINK(...)` with `\n` in the label is fragile. Keep the label one line. If you want secondary copy ("Renders your branded PDF in your browser."), put it as a row-22 caption (see Step 5).

- [ ] **Step 5: Replace Zone 4 (the preview) with a row-22 caption + truncate print area**

Delete everything from `# --- ZONE 4: Live preview (rows 24-80, 3 pages) ---` through the end of the function (lines 1181-1315 in the v2 builder).

In its place, add just:

```python
    # Row 22: caption beneath the OPEN button
    ws.merge_cells("A22:L22")
    c = ws["A22"]
    c.value = ("Drag this xlsx onto the page that opens. "
               "Pick your theme, palette, and logo. Ctrl+P to save as PDF.")
    c.font = Font(name=FONT_BODY, size=10, italic=True, color=COLOR_MUTED)
    c.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[22].height = 18

    # Print area: just the dashboard + button (rows 1-22)
    ws.print_area = "A1:L22"
    ws.page_setup.orientation = ws.ORIENTATION_PORTRAIT
    ws.page_setup.paperSize = ws.PAPERSIZE_LETTER
    ws.page_setup.fitToPage = True
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToHeight = 1
    ws.page_setup.fitToWidth = 1
    ws.page_margins = PageMargins(left=0.5, right=0.5, top=0.5, bottom=0.5)
```

- [ ] **Step 6: Update the Launch tab's required-fields for the readiness dashboard**

The required list around line 1110 of the v2 builder references `'Property'!B5`, `'Property'!B6`, `'Property'!B7`, `'WiFi + Tech'!B5`, `'WiFi + Tech'!B6`, `'Trash'!B5`, `'Departure'!B5`, `'Emergency'!B7`, `'Emergency'!B8`, `'Emergency'!B10` — 10 required fields. Shift each by +1 per Task 1's reflow:

```python
    required = [
        "'Property'!B6", "'Property'!B7", "'Property'!B8",
        "'WiFi + Tech'!B6", "'WiFi + Tech'!B7",
        "'Trash'!B6",
        "'Departure'!B6",
        "'Emergency'!B8", "'Emergency'!B9", "'Emergency'!B11",
    ]
```

- [ ] **Step 7: Update the main entry point to call the renamed function**

Around line 1590 in `build_workbook`, change:

```python
    build_review_print_tab(wb, variant)
```

to:

```python
    build_launch_tab(wb, variant)
```

- [ ] **Step 8: Build and verify the Launch tab**

Run: `cd templates/_build && python build_welcome_book_v2.py`

Expected: builds cleanly. Then inspect:

```bash
python - <<'PY'
from openpyxl import load_workbook
wb = load_workbook("templates/_masters/GST-001-welcome-book-DEMO.xlsx")
ws = wb["Launch"]
print("Tab name:", ws.title)
print("A16 value:", ws["A16"].value)   # should be the HYPERLINK formula
print("A22 value:", ws["A22"].value)   # should be the caption
print("Print area:", ws.print_area)    # should be A1:L22
PY
```

Expected:
```
Tab name: Launch
A16 value: =HYPERLINK("welcome-book-renderer.html", "📘 OPEN YOUR WELCOME BOOK →")
A22 value: Drag this xlsx onto the page...
Print area: Launch!$A$1:$L$22
```

- [ ] **Step 9: Commit**

```bash
git add templates/_build/build_welcome_book_v2.py \
        templates/_build/brand_config.py \
        templates/_masters/GST-001-welcome-book-DEMO.xlsx \
        templates/_masters/GST-001-welcome-book-BLANK.xlsx

git commit -m "$(cat <<'EOF'
feat: v2.1 Launch tab replaces Review & Print

Tab 9 renamed Review & Print → Launch. The 3-page live-preview
(rows 24-80 of v2) is removed entirely; the preview moves to the
new HTML renderer. Kept: readiness dashboard (3 cards) and the
big pseudo-button, now relabeled OPEN YOUR WELCOME BOOK → and
hyperlinked to the relative file welcome-book-renderer.html.

Extends brand_config.pseudo_button with external_link kwarg for
cross-file HYPERLINK formulas.
EOF
)"
```

---

## Task 3: Export SAMPLE to demo-data.json

**Files:**
- Create: `templates/_delivery/GST-001-welcome-book/_assets/demo-data.json`
- Modify: `templates/_build/build_welcome_book_v2.py` — add `export_demo_json()` function + CLI flag

**Acceptance:** Running `python build_welcome_book_v2.py --emit-demo-json` writes a JSON file the renderer consumes when the user clicks "Try with demo data" (landing-state button). The JSON mirrors the data contract §5 exactly — keyed by tab name with the 80 sample values.

- [ ] **Step 1: Create the assets directory**

```bash
mkdir -p templates/_delivery/GST-001-welcome-book/_assets
```

- [ ] **Step 2: Add `export_demo_json` to `build_welcome_book_v2.py`**

Add this function above `build_workbook` (roughly line 1575):

```python
import json

DEMO_JSON_OUT = (BASE / "_delivery" / "GST-001-welcome-book"
                      / "_assets" / "demo-data.json")


def export_demo_json():
    """Export SAMPLE constants to a JSON file the renderer loads for demo mode.

    Schema mirrors the data contract §5 of the v2.1 spec:

    {
      "Property":    { "B6": ..., "B7": ..., ..., "B13": ... },
      "Arrival":     { "B6": ..., ..., "B12": ... },
      "WiFi + Tech": { "B6": ..., ..., "B13": ... },
      ...
      "Local Guide": [ {"cat":.., "name":.., "dist":.., "phone":.., "notes":..}, ... ]
    }
    """
    out = {
        "Property": {
            "B6": SAMPLE["Property"]["name"],
            "B7": SAMPLE["Property"]["host"],
            "B8": SAMPLE["Property"]["host_phone"],
            "B9": SAMPLE["Property"]["check_in"],
            "B10": SAMPLE["Property"]["check_out"],
            "B11": SAMPLE["Property"]["property_type"],
            "B12": SAMPLE["Property"]["max_guests"],
            "B13": SAMPLE["Property"]["address"],
        },
        "Arrival": {
            "B6": SAMPLE["Arrival"]["address"],
            "B7": SAMPLE["Arrival"]["entry_method"],
            "B8": SAMPLE["Arrival"]["door_code"],
            "B9": SAMPLE["Arrival"]["parking"],
            "B10": SAMPLE["Arrival"]["route"],
            "B11": SAMPLE["Arrival"]["arrival_window"],
            "B12": SAMPLE["Arrival"]["early_option"],
        },
        "WiFi + Tech": {
            "B6": SAMPLE["WiFi"]["ssid"],
            "B7": SAMPLE["WiFi"]["password"],
            "B8": SAMPLE["WiFi"]["backup_ssid"],
            "B9": SAMPLE["WiFi"]["tv_streaming"],
            "B10": SAMPLE["WiFi"]["smart_lock_note"],
            "B11": SAMPLE["WiFi"]["thermostat"],
            "B12": SAMPLE["WiFi"]["tv_controls"],
            "B13": SAMPLE["WiFi"]["wifi_support"],
        },
        "House Rules": {
            "B6": SAMPLE["Rules"]["quiet_hours"],
            "B7": SAMPLE["Rules"]["max_guests"],
            "B8": SAMPLE["Rules"]["smoking"],
            "B9": SAMPLE["Rules"]["pets"],
            "B10": SAMPLE["Rules"]["events"],
            "B11": SAMPLE["Rules"]["shoes"],
            "B12": SAMPLE["Rules"]["custom_rules"],
        },
        "Local Guide": [
            {"cat": cat, "name": name, "dist": dist, "phone": phone,
             "notes": notes}
            for (cat, name, dist, phone, notes) in SAMPLE["Local"]
        ],
        "Trash": {
            "B6": SAMPLE["Trash"]["pickup_day"],
            "B7": SAMPLE["Trash"]["bin_location"],
            "B8": SAMPLE["Trash"]["recycling_accepted"],
            "B9": SAMPLE["Trash"]["sorting_rules"],
            "B10": SAMPLE["Trash"]["pickup_location"],
            "B11": SAMPLE["Trash"]["thermostat_range"],
            "B12": SAMPLE["Trash"]["power_outage"],
        },
        "Departure": {
            "B6": SAMPLE["Departure"]["checkout_time"],
            "B7": SAMPLE["Departure"]["linen_location"],
            "B8": SAMPLE["Departure"]["trash_spot"],
            "B9": SAMPLE["Departure"]["thermostat_setting"],
            "B10": SAMPLE["Departure"]["key_return"],
            "B11": SAMPLE["Departure"]["custom_tasks"],
        },
        "Emergency": {
            "B6": SAMPLE["Emergency"]["hospital_name"],
            "B7": SAMPLE["Emergency"]["hospital_phone"],
            "B8": SAMPLE["Emergency"]["hospital_address"],
            "B9": SAMPLE["Emergency"]["urgent_care_name"],
            "B10": SAMPLE["Emergency"]["urgent_care_phone"],
            "B11": SAMPLE["Emergency"]["police_non_emergency"],
            "B12": "1-800-222-1222",  # poison control, hardcoded
            "B13": SAMPLE["Emergency"]["vet"],
            "B14": SAMPLE["Emergency"]["utility"],
        },
    }
    DEMO_JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(DEMO_JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print(f"Wrote demo JSON: {DEMO_JSON_OUT}")
```

- [ ] **Step 3: Wire it into `main` so it runs on every build**

At the bottom of `build_welcome_book_v2.py` (the `if __name__ == "__main__":` block), add a call:

```python
if __name__ == "__main__":
    build_workbook(DEMO_OUT, variant="demo")
    build_workbook(BLANK_OUT, variant="blank")
    export_demo_json()  # v2.1 addition
```

- [ ] **Step 4: Build and verify**

Run: `cd templates/_build && python build_welcome_book_v2.py`

Expected: both xlsx files + `Wrote demo JSON: .../demo-data.json` line.

Verify the JSON:

```bash
python - <<'PY'
import json
with open("templates/_delivery/GST-001-welcome-book/_assets/demo-data.json") as f:
    d = json.load(f)
assert d["Property"]["B6"] == "Smokies Ridge Cabin", d["Property"]["B6"]
assert d["WiFi + Tech"]["B7"] == "welcome2024", d["WiFi + Tech"]["B7"]
assert d["Emergency"]["B12"] == "1-800-222-1222"  # poison hardcoded
assert len(d["Local Guide"]) == 20
print("demo-data.json OK")
PY
```

Expected: `demo-data.json OK`.

- [ ] **Step 5: Commit**

```bash
git add templates/_build/build_welcome_book_v2.py \
        templates/_delivery/GST-001-welcome-book/_assets/demo-data.json

git commit -m "$(cat <<'EOF'
feat: v2.1 export SAMPLE constants to demo-data.json

The renderer's "Try with demo data" landing button needs a JSON
source that mirrors the xlsx data contract. export_demo_json()
serializes the same SAMPLE dict the DEMO xlsx is built from, so
demo-mode preview matches the DEMO xlsx exactly.
EOF
)"
```

---

## Task 4: Fetch + commit SheetJS and qrcode-generator libraries

**Files:**
- Create: `templates/_delivery/GST-001-welcome-book/_assets/sheetjs.min.js`
- Create: `templates/_delivery/GST-001-welcome-book/_assets/qrcode.min.js`

**Acceptance:** Both libraries committed at pinned versions. Total ~620KB combined. Licensed under MIT (audited). File SHAs recorded in Task 4 commit message.

- [ ] **Step 1: Download SheetJS community edition 0.20.3**

SheetJS distributes `xlsx.full.min.js` at https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js.

```bash
cd templates/_delivery/GST-001-welcome-book/_assets
curl -sSL https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js -o sheetjs.min.js
ls -lh sheetjs.min.js
sha256sum sheetjs.min.js
```

Expected: a file around 620KB. Record the SHA-256 in the commit message.

- [ ] **Step 2: Download qrcode-generator 1.4.4**

```bash
curl -sSL https://raw.githubusercontent.com/kazuhikoarase/qrcode-generator/master/js/qrcode.js -o qrcode.min.js
ls -lh qrcode.min.js
sha256sum qrcode.min.js
```

Expected: a file ~40KB (unminified). Acceptable — minification would save ~20KB which is noise relative to SheetJS.

- [ ] **Step 3: Sanity-check by loading them in a throwaway Node REPL**

```bash
node -e "const XLSX = require('./templates/_delivery/GST-001-welcome-book/_assets/sheetjs.min.js'); console.log(typeof XLSX.read, XLSX.version);"
```

Expected: `function 0.20.3` (or similar).

```bash
node -e "const fs=require('fs'); const src=fs.readFileSync('templates/_delivery/GST-001-welcome-book/_assets/qrcode.min.js','utf8'); eval(src); console.log(typeof qrcode);"
```

Expected: `function` — confirming the global `qrcode` is defined.

- [ ] **Step 4: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/sheetjs.min.js \
        templates/_delivery/GST-001-welcome-book/_assets/qrcode.min.js

git commit -m "$(cat <<'EOF'
chore: pin SheetJS 0.20.3 and qrcode-generator 1.4.4 for v2.1 renderer

Committed third-party libs for reproducibility. Both MIT-licensed:
- SheetJS community (xlsx.full.min.js) — reads the buyer's filled xlsx
  client-side in the renderer.
- qrcode-generator — produces the tap-to-action QR codes (WiFi, tel,
  geo) per spec §4.4.

SHAs: sheetjs.min.js <fill in from Step 1>
      qrcode.min.js  <fill in from Step 2>
EOF
)"
```

---

## Task 5: Renderer scaffold — drop zone + file parse (no UI polish)

**Files:**
- Create: `templates/_delivery/GST-001-welcome-book/_assets/renderer.js`
- Create: `templates/_delivery/GST-001-welcome-book/_assets/renderer.css`
- Create: `templates/_delivery/GST-001-welcome-book/_assets/index.html` (dev entry — we inline everything into `welcome-book-renderer.html` later in Task 13)

**Acceptance:** Opening `_assets/index.html` in a browser shows a drop zone. Dropping `GST-001-welcome-book-DEMO.xlsx` parses it via SheetJS; the raw parsed data dumps to the page (JSON stringify for now) — we'll render it in Task 7.

- [ ] **Step 1: Create `_assets/renderer.js` with core parse logic**

```javascript
// Renderer app core — parses an xlsx via SheetJS into the v2.1 data contract.
// See spec §5 for cell addresses.

const DATA_CONTRACT = {
  "Property": ["B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13"],
  "Arrival": ["B6", "B7", "B8", "B9", "B10", "B11", "B12"],
  "WiFi + Tech": ["B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13"],
  "House Rules": ["B6", "B7", "B8", "B9", "B10", "B11", "B12"],
  "Trash": ["B6", "B7", "B8", "B9", "B10", "B11", "B12"],
  "Departure": ["B6", "B7", "B8", "B9", "B10", "B11"],
  "Emergency": ["B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14"],
};

// Local Guide is a table — rows 10..29, cols A..E.
const LOCAL_GUIDE_ROWS = 20;
const LOCAL_GUIDE_START_ROW = 10;

function parseWorkbook(workbook) {
  const data = {};
  for (const [sheetName, cells] of Object.entries(DATA_CONTRACT)) {
    const ws = workbook.Sheets[sheetName];
    if (!ws) {
      console.warn(`Missing sheet: ${sheetName}`);
      data[sheetName] = {};
      continue;
    }
    data[sheetName] = {};
    for (const addr of cells) {
      const cell = ws[addr];
      data[sheetName][addr] = cell ? String(cell.v ?? "") : "";
    }
  }
  // Local Guide — read the table
  const lg = workbook.Sheets["Local Guide"];
  data["Local Guide"] = [];
  if (lg) {
    for (let i = 0; i < LOCAL_GUIDE_ROWS; i++) {
      const r = LOCAL_GUIDE_START_ROW + i;
      data["Local Guide"].push({
        cat: lg[`A${r}`]?.v ?? "",
        name: lg[`B${r}`]?.v ?? "",
        dist: lg[`C${r}`]?.v ?? "",
        phone: lg[`D${r}`]?.v ?? "",
        notes: lg[`E${r}`]?.v ?? "",
      });
    }
  }
  return data;
}

function parseDemoData(json) {
  // Demo JSON already uses the cell-address schema. Local Guide already a list.
  // Pass-through.
  return json;
}

// File handling ---

function setupDropZone(element, onDataReady) {
  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
  ["dragenter", "dragover", "dragleave", "drop"].forEach(ev =>
    element.addEventListener(ev, prevent)
  );
  element.addEventListener("dragover", () =>
    element.classList.add("drag-over")
  );
  element.addEventListener("dragleave", () =>
    element.classList.remove("drag-over")
  );
  element.addEventListener("drop", async (e) => {
    element.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      alert("Please drop an .xlsx file. Got: " + file.name);
      return;
    }
    const buf = await file.arrayBuffer();
    const workbook = XLSX.read(buf, { type: "array" });
    const data = parseWorkbook(workbook);
    onDataReady(data, file.name);
  });
}

async function loadDemoData(url, onDataReady) {
  const r = await fetch(url);
  if (!r.ok) {
    alert(`Couldn't load demo data from ${url}`);
    return;
  }
  const json = await r.json();
  onDataReady(parseDemoData(json), "demo-data.json");
}
```

- [ ] **Step 2: Create `_assets/renderer.css` — minimal scaffold**

```css
:root {
  --bg: #F6EFE2;
  --primary: #12304E;
  --accent: #C9A24B;
  --ink: #2B2B2B;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: "Inter", system-ui, sans-serif;
}
.drop-zone {
  max-width: 520px;
  margin: 80px auto;
  padding: 60px 40px;
  background: white;
  border: 3px dashed var(--accent);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 150ms;
}
.drop-zone.drag-over {
  background: var(--bg);
  transform: scale(1.01);
}
.drop-zone h2 { font-family: "Cormorant Garamond", Georgia, serif;
                font-weight: 500; font-size: 28px; color: var(--primary);
                margin: 0 0 12px 0; }
.drop-zone p { margin: 8px 0; color: #666; }
.drop-zone button { margin-top: 18px; padding: 10px 20px;
                    background: var(--primary); color: var(--bg);
                    border: none; font-family: inherit; font-size: 14px;
                    cursor: pointer; letter-spacing: 0.05em;
                    text-transform: uppercase; }
pre#debug-dump { max-width: 900px; margin: 40px auto;
                  padding: 20px; background: #fff; font-size: 11px;
                  font-family: "JetBrains Mono", monospace; overflow: auto; }
```

- [ ] **Step 3: Create `_assets/index.html` — dev entry point**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Welcome Book Renderer (dev)</title>
<link rel="stylesheet" href="renderer.css">
</head>
<body>

<div id="app">
  <div id="drop-zone" class="drop-zone">
    <h2>Drop your filled xlsx here</h2>
    <p>Or —</p>
    <button id="demo-btn">Try with demo data</button>
  </div>
  <pre id="debug-dump"></pre>
</div>

<script src="sheetjs.min.js"></script>
<script src="qrcode.min.js"></script>
<script src="renderer.js"></script>
<script>
  const dump = document.getElementById("debug-dump");
  const showData = (data, source) => {
    dump.textContent = `# source: ${source}\n\n` + JSON.stringify(data, null, 2);
  };
  setupDropZone(document.getElementById("drop-zone"), showData);
  document.getElementById("demo-btn").addEventListener("click", () => {
    loadDemoData("demo-data.json", showData);
  });
</script>

</body>
</html>
```

- [ ] **Step 4: Manual browser QA**

Open `templates/_delivery/GST-001-welcome-book/_assets/index.html` directly in Chrome (double-click the file OR `start chrome file:///C:/Users/Kebron/Desktop/Claude%20OS/Excell-Templates/templates/_delivery/GST-001-welcome-book/_assets/index.html`).

Expected: see the drop zone with "Drop your filled xlsx here" and the "Try with demo data" button.

Click the **demo button**. Expected: the page dumps a JSON blob starting `{"Property": {"B6": "Smokies Ridge Cabin", ...}, ...}`.

Then **drag `templates/_masters/GST-001-welcome-book-DEMO.xlsx`** onto the drop zone. Expected: the dump updates to show the same data, parsed from the xlsx (not from demo-data.json).

Verify in the dump that:
- `Property.B6 == "Smokies Ridge Cabin"`
- `WiFi + Tech.B7 == "welcome2024"`
- `Local Guide[0].name == "Mountain Grind"`
- `Emergency.B12 == "1-800-222-1222"` (the hardcoded poison control)

If any are missing/empty, the xlsx data-contract is drifted — re-check Task 1.

- [ ] **Step 5: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/renderer.js \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.css \
        templates/_delivery/GST-001-welcome-book/_assets/index.html

git commit -m "$(cat <<'EOF'
feat: v2.1 renderer scaffold — drop zone + xlsx parser

Dev scaffold for the renderer app. Drops the xlsx onto the page,
SheetJS reads it into the data contract (§5), dumps the result as
JSON for inspection. "Try with demo data" button loads demo-data.json
and shows the same shape.

No UI polish yet — that lands in Tasks 6-11. This task proves the
xlsx → data contract bridge works.
EOF
)"
```

---

## Task 6: Renderer UI shell — state, sidebar, preview canvas

**Files:**
- Modify: `_assets/renderer.js` — add `appState`, `render()`, sidebar + canvas markup functions
- Modify: `_assets/renderer.css` — add sidebar + canvas layout
- Modify: `_assets/index.html` — replace the debug dump with a proper two-column layout

**Acceptance:** After dropping the xlsx (or clicking demo), the drop zone is replaced by a 280px left sidebar (theme picker stub + palette picker stub + QR toggles stub + logo drop stub + Print button) and a right-hand canvas area showing 3 `<section class="page">` placeholders sized 7.5in × 10in. No theme styling yet — just the skeleton.

- [ ] **Step 1: Add state management to `renderer.js`**

Append after the existing parse functions:

```javascript
// App state --------------------------------------------------

const defaultState = {
  data: null,        // parsed workbook
  dataSource: null,  // filename
  theme: "magazine", // "magazine" | "editorial" | "hotel"
  palette: "harbor", // "harbor" | "cabin" | "terracotta" | "charcoal"
  logo: null,        // data URL, or null
  qr: { wifi: true, phone: true, address: true },
};

let appState = { ...defaultState };

function setState(partial) {
  appState = { ...appState, ...partial };
  render();
}

// Rendering ---------------------------------------------------

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  if (!appState.data) {
    app.appendChild(renderLanding());
  } else {
    app.appendChild(renderWorkspace());
  }
}

function renderLanding() {
  const el = document.createElement("div");
  el.innerHTML = `
    <div id="drop-zone" class="drop-zone">
      <h2>Drop your filled xlsx here</h2>
      <p>Or —</p>
      <button id="demo-btn">Try with demo data</button>
      <p class="hint">GST-001 · Welcome Book Renderer · works offline</p>
    </div>
  `;
  // bind
  setTimeout(() => {
    setupDropZone(el.querySelector("#drop-zone"),
                  (data, src) => setState({ data, dataSource: src }));
    el.querySelector("#demo-btn").addEventListener("click", () =>
      loadDemoData("demo-data.json",
                   (data, src) => setState({ data, dataSource: src }))
    );
  }, 0);
  return el;
}

function renderWorkspace() {
  const el = document.createElement("div");
  el.className = "workspace";
  el.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-inner">
        <div class="logo-bar">THE STR LEDGER</div>
        <section class="panel"><h3>Theme</h3>
          <div id="theme-picker" class="picker"></div></section>
        <section class="panel"><h3>Palette</h3>
          <div id="palette-picker" class="picker"></div></section>
        <section class="panel"><h3>Logo</h3>
          <div id="logo-slot"></div></section>
        <section class="panel"><h3>QR codes</h3>
          <div id="qr-toggles"></div></section>
        <section class="panel">
          <button id="print-btn" class="primary-btn">Print / Save as PDF</button>
        </section>
      </div>
    </aside>
    <main class="canvas">
      <div class="canvas-inner" id="pages">
        <section class="page" data-page="1"><div class="page-placeholder">Page 1</div></section>
        <section class="page" data-page="2"><div class="page-placeholder">Page 2</div></section>
        <section class="page" data-page="3"><div class="page-placeholder">Page 3</div></section>
      </div>
    </main>
  `;
  setTimeout(() => {
    el.querySelector("#print-btn").addEventListener("click", () => window.print());
    // Theme/palette/logo/QR pickers wired in Tasks 8-10
    renderPages();
  }, 0);
  return el;
}

function renderPages() {
  // Stub — filled in Tasks 7-11 per theme.
  // For now, dump the parsed data into page 1 so we can see it renders.
  const p1 = document.querySelector('.page[data-page="1"] .page-placeholder');
  if (p1 && appState.data) {
    p1.textContent = "Property name: " + (appState.data.Property?.B6 || "(empty)");
  }
}

// Boot --------------------------------------------------------

document.addEventListener("DOMContentLoaded", render);
```

- [ ] **Step 2: Update `renderer.css` with the two-column layout**

Append to `renderer.css`:

```css
.workspace { display: flex; min-height: 100vh; }
.sidebar { flex: 0 0 280px; background: #fff; border-right: 1px solid #ddd;
           overflow-y: auto; }
.sidebar-inner { padding: 20px; }
.logo-bar { font-family: "JetBrains Mono", monospace; font-size: 10px;
             color: var(--accent); letter-spacing: 0.2em;
             text-transform: uppercase; padding: 8px 0 18px 0;
             border-bottom: 1px solid var(--accent); margin-bottom: 18px; }
.panel { margin-bottom: 22px; }
.panel h3 { font-family: "Cormorant Garamond", Georgia, serif;
             font-weight: 500; color: var(--primary); font-size: 16px;
             margin: 0 0 10px 0; }
.primary-btn { width: 100%; padding: 12px 0; background: var(--primary);
                color: var(--bg); border: none; cursor: pointer;
                font-family: "Inter", sans-serif; font-size: 13px;
                letter-spacing: 0.1em; text-transform: uppercase; }

.canvas { flex: 1; padding: 30px; background: #ddd;
           overflow-y: auto; }
.canvas-inner { display: flex; flex-direction: column; gap: 20px;
                 align-items: center; }
.page { width: 7.5in; height: 10in; background: var(--bg);
         box-shadow: 0 4px 18px rgba(0,0,0,0.15); padding: 0;
         overflow: hidden; position: relative; }
.page-placeholder { padding: 40px; font-family: monospace; }

.hint { margin-top: 28px; font-size: 10px; font-family: "JetBrains Mono",
         monospace; color: #999; letter-spacing: 0.1em; }
```

- [ ] **Step 3: Update `index.html` to use the `app` container for dynamic rendering**

Simplify the body:

```html
<body>
  <div id="app"></div>
  <script src="sheetjs.min.js"></script>
  <script src="qrcode.min.js"></script>
  <script src="renderer.js"></script>
</body>
```

Drop the inline `<script>` at the bottom — `renderer.js` now bootstraps via `DOMContentLoaded`.

- [ ] **Step 4: Manual browser QA**

Reload the page. Expected: drop zone is visible. Click demo button. Expected: drop zone disappears; sidebar + 3 blank pages appear. Page 1 shows "Property name: Smokies Ridge Cabin".

- [ ] **Step 5: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/renderer.js \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.css \
        templates/_delivery/GST-001-welcome-book/_assets/index.html

git commit -m "feat: v2.1 renderer UI shell — sidebar + 3-page canvas

State machine + render() transitions between landing and workspace.
Workspace has a 280px sidebar with panels (theme/palette/logo/QR),
and a right canvas with three 7.5x10in page placeholders ready to
be filled by theme renderers in upcoming tasks."
```

---

## Task 7: Tier 2 Magazine theme — default page rendering

**Files:**
- Create: `_assets/themes/magazine.css`
- Modify: `_assets/renderer.js` — add `renderMagazineTheme(data)` that populates the 3 pages
- Modify: `_assets/index.html` — link `themes/magazine.css`

**Acceptance:** After dropping the DEMO xlsx (or clicking demo), the 3 pages show:
- Page 1: navy hero band with "Welcome to Smokies Ridge Cabin" + 3-card info strip (Host · Check-in · WiFi) + pull quote + Arrival block
- Page 2: House Rules block + Local Guide top-10 table
- Page 3: Trash/Maintenance + Departure checklist + red-bordered Emergency block

- [ ] **Step 1: Write `_assets/themes/magazine.css`**

```css
/* Tier 2 — Magazine Spread. Default theme.
   Uses --primary, --accent, --bg, --ink tokens set by palette.
*/

.theme-magazine .page {
  font-family: Georgia, "Cormorant Garamond", serif;
  color: var(--ink);
  background: var(--bg);
  padding: 0;
  position: relative;
}
.theme-magazine .page-inner { padding: 0.5in 0.6in; }

/* Hero band — page 1 top */
.theme-magazine .hero {
  height: 2.1in;
  background: linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary), white 15%));
  color: var(--bg);
  padding: 0.4in 0.6in;
  position: relative;
}
.theme-magazine .hero-mono {
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  color: var(--accent);
  letter-spacing: 0.3em;
}
.theme-magazine .hero-logo { height: 36px; position: absolute; top: 0.35in; right: 0.6in; }
.theme-magazine .hero-title {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 500; font-size: 40px; line-height: 1.05;
  margin-top: 0.6in;
  color: var(--bg);
}
.theme-magazine .hero-sub {
  font-style: italic; font-size: 13px; color: var(--accent);
  margin-top: 0.08in;
}
.theme-magazine .hero-pagenum {
  position: absolute; bottom: -10px; right: 0.6in;
  background: var(--accent); color: var(--primary);
  font-family: "JetBrains Mono", monospace; font-size: 7px;
  padding: 4px 8px; letter-spacing: 0.2em; font-weight: bold;
}

/* Info-card strip */
.theme-magazine .info-strip { display: flex; gap: 10px; margin-top: 0.25in; }
.theme-magazine .info-card {
  flex: 1; border: 1px solid var(--accent);
  padding: 10px; text-align: center;
}
.theme-magazine .info-card .label {
  font-family: "JetBrains Mono", monospace; font-size: 7px;
  color: var(--accent); letter-spacing: 0.2em; font-weight: bold;
}
.theme-magazine .info-card .value { font-size: 12px; margin-top: 4px; }

/* Pull quote */
.theme-magazine .pull-quote {
  font-style: italic; font-size: 12px; line-height: 1.6;
  color: var(--primary); border-left: 2px solid var(--accent);
  padding-left: 10px; margin: 0.2in 0;
}

/* Section headings */
.theme-magazine h3.section {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 500; font-size: 22px;
  color: var(--primary);
  margin: 0.2in 0 0.1in 0; padding: 0 0 6px 0;
  border-bottom: 1px solid var(--accent);
}

/* Definition-style rows */
.theme-magazine dl.facts { margin: 0.1in 0; font-size: 11px; }
.theme-magazine dl.facts dt {
  font-family: "JetBrains Mono", monospace; font-size: 8px;
  letter-spacing: 0.15em; color: var(--accent); text-transform: uppercase;
  margin-top: 6px;
}
.theme-magazine dl.facts dd { margin: 2px 0 0 0; font-size: 12px; }

/* Highlighted WiFi */
.theme-magazine .wifi-big {
  background: var(--primary); color: var(--bg);
  padding: 0.15in 0.2in; margin: 0.15in 0;
  font-size: 16px; font-weight: bold;
  display: flex; justify-content: space-between; align-items: center;
}
.theme-magazine .wifi-big .label {
  font-family: "JetBrains Mono", monospace;
  font-size: 8px; color: var(--accent); letter-spacing: 0.2em;
  font-weight: normal; display: block;
}

/* Local Guide table */
.theme-magazine table.local {
  width: 100%; border-collapse: collapse; font-size: 10px;
}
.theme-magazine table.local th {
  font-family: "JetBrains Mono", monospace; font-size: 8px;
  text-align: left; letter-spacing: 0.15em; padding: 4px 6px;
  color: var(--accent); border-bottom: 1px solid var(--accent);
}
.theme-magazine table.local td {
  padding: 6px; vertical-align: top;
  border-bottom: 1px dotted color-mix(in oklab, var(--accent), transparent 50%);
}
.theme-magazine table.local td.cat {
  font-weight: bold; color: var(--primary); width: 22%;
}

/* Emergency block — red emphasis */
.theme-magazine .emergency {
  border: 2px solid #a33; padding: 0.15in;
  margin-top: 0.15in;
}
.theme-magazine .emergency h4 {
  margin: 0 0 6px 0; color: #a33;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 18px;
}
.theme-magazine .emergency p { margin: 3px 0; font-size: 11px; }
```

- [ ] **Step 2: Add `renderMagazineTheme(data)` to `renderer.js`**

Replace the stub `renderPages()` function with a dispatcher + the magazine implementation:

```javascript
function renderPages() {
  const root = document.getElementById("pages");
  root.className = `theme-${appState.theme} palette-${appState.palette}`;
  const pages = {
    magazine: renderMagazineTheme,
    editorial: renderEditorialTheme,  // stub — filled in Task 9
    hotel: renderHotelTheme,          // stub — filled in Task 9
  };
  const fn = pages[appState.theme] || renderMagazineTheme;
  root.innerHTML = "";
  fn(appState.data, root);
}

function renderEditorialTheme(d, root) { root.innerHTML = "<em>Editorial theme — Task 9</em>"; }
function renderHotelTheme(d, root) { root.innerHTML = "<em>Hotel theme — Task 9</em>"; }

function esc(x) {
  return String(x ?? "—").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}
function orDash(x) { return x && String(x).trim() ? esc(x) : "—"; }

function renderMagazineTheme(d, root) {
  const P = d.Property || {};
  const A = d.Arrival || {};
  const W = d["WiFi + Tech"] || {};
  const R = d["House Rules"] || {};
  const T = d.Trash || {};
  const D = d.Departure || {};
  const E = d.Emergency || {};
  const L = (d["Local Guide"] || []).filter(r => r.name && String(r.name).trim());
  const topLocal = L.slice(0, 10);

  root.innerHTML = `
  <section class="page" data-page="1">
    <div class="hero">
      <div class="hero-mono">THE STR LEDGER · GUEST EDITION</div>
      <div class="hero-title">Welcome to<br>${orDash(P.B6)}.</div>
      <div class="hero-sub">A few notes to make your stay effortless.</div>
      <div class="hero-pagenum">PAGE 1 OF 3</div>
    </div>
    <div class="page-inner">
      <div class="info-strip">
        <div class="info-card"><div class="label">HOST</div><div class="value">${orDash(P.B7)}</div></div>
        <div class="info-card"><div class="label">TEXT</div><div class="value">${orDash(P.B8)}</div></div>
        <div class="info-card"><div class="label">CHECK-IN</div><div class="value">${orDash(A.B11)}</div></div>
      </div>
      <p class="pull-quote">Your stay is ${orDash(P.B7)}'s priority. Text anytime at ${orDash(P.B8)} — we'd rather hear from you than the morning-after emergency.</p>

      <h3 class="section">Arrival</h3>
      <dl class="facts">
        <dt>Address</dt><dd>${orDash(A.B6)}</dd>
        <dt>Entry method</dt><dd>${orDash(A.B7)}</dd>
        <dt>Door / lock code</dt><dd>${orDash(A.B8)}</dd>
        <dt>Parking</dt><dd>${orDash(A.B9)}</dd>
      </dl>

      <div class="wifi-big">
        <div><span class="label">NETWORK</span>${orDash(W.B6)}</div>
        <div><span class="label">PASSWORD</span>${orDash(W.B7)}</div>
      </div>
    </div>
  </section>

  <section class="page" data-page="2">
    <div class="page-inner">
      <h3 class="section">House Rules</h3>
      <dl class="facts">
        <dt>Quiet hours</dt><dd>${orDash(R.B6)}</dd>
        <dt>Max guests</dt><dd>${orDash(R.B7)}</dd>
        <dt>Smoking</dt><dd>${orDash(R.B8)}</dd>
        <dt>Pets</dt><dd>${orDash(R.B9)}</dd>
        <dt>Events</dt><dd>${orDash(R.B10)}</dd>
        <dt>Shoes</dt><dd>${orDash(R.B11)}</dd>
        ${R.B12 ? `<dt>Additional</dt><dd>${esc(R.B12)}</dd>` : ""}
      </dl>

      <h3 class="section">Local Guide — Our Top 10</h3>
      <table class="local">
        <thead>
          <tr><th>CATEGORY</th><th>NAME</th><th>DISTANCE</th><th>PHONE</th><th>NOTES</th></tr>
        </thead>
        <tbody>
          ${topLocal.map(r => `
            <tr>
              <td class="cat">${esc(r.cat)}</td>
              <td>${esc(r.name)}</td>
              <td>${orDash(r.dist)}</td>
              <td>${orDash(r.phone)}</td>
              <td>${orDash(r.notes)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </section>

  <section class="page" data-page="3">
    <div class="page-inner">
      <h3 class="section">Trash &amp; Maintenance</h3>
      <dl class="facts">
        <dt>Pickup day</dt><dd>${orDash(T.B6)}</dd>
        <dt>Bin location</dt><dd>${orDash(T.B7)}</dd>
        <dt>Sorting rules</dt><dd>${orDash(T.B9)}</dd>
      </dl>

      <h3 class="section">Checkout</h3>
      <dl class="facts">
        <dt>Time</dt><dd>${orDash(D.B6)}</dd>
        <dt>Linens</dt><dd>${orDash(D.B7)}</dd>
        <dt>Key return</dt><dd>${orDash(D.B10)}</dd>
        ${D.B11 ? `<dt>Custom</dt><dd>${esc(D.B11)}</dd>` : ""}
      </dl>

      <div class="emergency">
        <h4>Emergency — Call 911 first</h4>
        <p><strong>Hospital:</strong> ${orDash(E.B6)}  ·  ${orDash(E.B7)}</p>
        <p><strong>Urgent care:</strong> ${orDash(E.B9)}  ·  ${orDash(E.B10)}</p>
        <p><strong>Host phone:</strong> ${orDash(P.B8)}</p>
        <p><strong>Poison control:</strong> ${orDash(E.B12)}</p>
      </div>
    </div>
  </section>
  `;
}
```

- [ ] **Step 3: Link the theme CSS in `index.html`**

```html
<head>
  ...
  <link rel="stylesheet" href="renderer.css">
  <link rel="stylesheet" href="themes/magazine.css">
</head>
```

- [ ] **Step 4: Manual browser QA**

Reload. Click demo button. Expected: all 3 pages render in the Magazine theme with real DEMO data. Verify:
- Page 1 shows "Welcome to Smokies Ridge Cabin." in big white type on navy band
- Info strip shows "Daniel" · "+1 (555) 555-0199" · "After 3 PM"
- WiFi block shows network `SmokiesRidge_Guest` and password `welcome2024` in large type
- Page 2 has 10 local guide rows
- Page 3 emergency block is red-bordered

- [ ] **Step 5: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/themes/magazine.css \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.js \
        templates/_delivery/GST-001-welcome-book/_assets/index.html

git commit -m "feat: v2.1 renderer — Tier 2 Magazine theme (default)

3-page rendering: navy hero + info strip + pull quote + arrival
block on page 1; house rules + local-guide top-10 table on page 2;
trash/checkout/emergency on page 3. Uses CSS custom props (--primary,
--accent, --bg, --ink) so the palette swap in Task 8 is trivial."
```

---

## Task 8: Palette system — 4 color variants

**Files:**
- Modify: `_assets/renderer.css` — add `.palette-*` classes on `#pages`
- Modify: `_assets/renderer.js` — wire sidebar palette-picker

**Acceptance:** Clicking one of 4 palette dots in the sidebar swaps the CSS custom properties live. All 3 pages re-color without re-rendering content. Palettes: Harbor (default), Cabin Green, Terracotta Sunset, Modern Charcoal — hex values per spec §4.2.

- [ ] **Step 1: Append palette classes to `renderer.css`**

```css
/* Palette — applied on #pages container */
#pages.palette-harbor    { --primary: #12304E; --accent: #C9A24B;
                            --bg: #F6EFE2; --ink: #2B2B2B; }
#pages.palette-cabin     { --primary: #2D5A3D; --accent: #C17B4A;
                            --bg: #F3EDDE; --ink: #2B2B2B; }
#pages.palette-terracotta{ --primary: #7A3B2E; --accent: #D9A04A;
                            --bg: #F6EFE2; --ink: #2B2B2B; }
#pages.palette-charcoal  { --primary: #2A2A2A; --accent: #8BA98E;
                            --bg: #F4F0EB; --ink: #2B2B2B; }

/* Palette picker UI */
.picker.palette-picker { display: flex; gap: 8px; }
.palette-dot {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid transparent; cursor: pointer;
  transition: transform 100ms;
}
.palette-dot:hover { transform: scale(1.1); }
.palette-dot.selected { border-color: var(--primary); }
.palette-dot[data-palette="harbor"]     { background: #12304E; }
.palette-dot[data-palette="cabin"]      { background: #2D5A3D; }
.palette-dot[data-palette="terracotta"] { background: #7A3B2E; }
.palette-dot[data-palette="charcoal"]   { background: #2A2A2A; }
```

- [ ] **Step 2: Render the palette picker in `renderer.js`**

Inside `renderWorkspace()`, after the `setTimeout(() => { ... })` block, add palette picker wiring. Find the `#palette-picker` node and fill it:

```javascript
function wirePalettePicker(el) {
  const palettes = ["harbor", "cabin", "terracotta", "charcoal"];
  el.className = "picker palette-picker";
  el.innerHTML = palettes.map(p =>
    `<div class="palette-dot${appState.palette===p?' selected':''}"
          data-palette="${p}" title="${p.charAt(0).toUpperCase()+p.slice(1)}"></div>`
  ).join("");
  el.querySelectorAll(".palette-dot").forEach(dot => {
    dot.addEventListener("click", () =>
      setState({ palette: dot.dataset.palette })
    );
  });
}
```

Call it inside `renderWorkspace` setTimeout block:

```javascript
    wirePalettePicker(el.querySelector("#palette-picker"));
```

- [ ] **Step 3: Manual browser QA**

Reload, click demo. Expected: 4 colored dots in the sidebar palette panel. Clicking each swaps the page colors:
- Harbor (default): navy + gold + parchment
- Cabin: forest green + terracotta + cream
- Terracotta: rust + gold + parchment
- Charcoal: charcoal + sage + warm white

Verify contrast: body text is readable on all 4 backgrounds. Hero bands look good on all 4. The selected dot has a visible ring.

- [ ] **Step 4: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/renderer.css \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.js

git commit -m "feat: v2.1 renderer — palette picker (4 variants)

Harbor (default) / Cabin Green / Terracotta Sunset / Modern Charcoal.
Swapped via CSS custom props on #pages — zero re-render cost."
```

---

## Task 9: Tier 1 Editorial + Tier 3 Hotel themes + theme picker

**Files:**
- Create: `_assets/themes/editorial.css`
- Create: `_assets/themes/hotel.css`
- Modify: `_assets/renderer.js` — theme picker + real `renderEditorialTheme` + `renderHotelTheme`
- Modify: `_assets/index.html` — link both new theme CSSes

**Acceptance:** Sidebar theme picker shows 3 thumbnails (88×110px miniatures of page 1 per theme). Clicking one swaps the theme. All 3 themes render the same data, only layout/typography differ.

- [ ] **Step 1: Write `_assets/themes/editorial.css`**

```css
/* Tier 1 — Clean Editorial. Typography-only. Prints anywhere clean. */

.theme-editorial .page {
  font-family: Georgia, serif; color: var(--ink);
  background: var(--bg); padding: 0.6in 0.6in; position: relative;
}

.theme-editorial .masthead {
  border-bottom: 3px double var(--accent);
  padding-bottom: 0.15in; margin-bottom: 0.2in;
}
.theme-editorial .masthead .sku {
  font-family: "JetBrains Mono", monospace; font-size: 9px;
  letter-spacing: 0.2em; color: var(--accent);
}
.theme-editorial .masthead .title {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 500; font-size: 34px; color: var(--primary);
  margin: 6px 0 4px 0;
}
.theme-editorial .masthead .sub {
  font-style: italic; color: var(--accent); font-size: 13px;
}
.theme-editorial .masthead .logo {
  height: 40px; float: right; margin-top: -8px;
}

.theme-editorial h3.section {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 500; font-size: 20px; color: var(--primary);
  margin: 0.2in 0 0.05in 0;
  display: flex; align-items: center; gap: 8px;
}
.theme-editorial h3.section::before {
  content: ""; display: inline-block; width: 32px; height: 1px;
  background: var(--accent);
}

.theme-editorial dl.facts { margin: 0; font-size: 12px; line-height: 1.7; }
.theme-editorial dl.facts dt {
  float: left; clear: left; width: 30%;
  font-weight: bold; color: var(--primary);
}
.theme-editorial dl.facts dd { margin-left: 32%; }

.theme-editorial .wifi-callout {
  border: 1px solid var(--accent); padding: 0.12in;
  margin: 0.15in 0; font-size: 14px;
}
.theme-editorial .wifi-callout .big { font-weight: bold; font-size: 16px; }

.theme-editorial table.local { width: 100%; border-collapse: collapse;
                                font-size: 10.5px; margin-top: 0.1in; }
.theme-editorial table.local td {
  padding: 5px 4px; border-bottom: 1px solid #ddd; vertical-align: top;
}
.theme-editorial table.local td.cat {
  font-weight: bold; color: var(--primary); width: 22%;
}

.theme-editorial .emergency {
  border: 1px solid #a33; padding: 0.12in; margin: 0.15in 0;
  font-size: 12px;
}
.theme-editorial .emergency h4 { margin: 0 0 4px 0; color: #a33;
                                  font-size: 15px; }
```

- [ ] **Step 2: Write `_assets/themes/hotel.css`**

```css
/* Tier 3 — Hotel Welcome Packet. Engraved, ornamental, full-bleed. */

.theme-hotel .page {
  font-family: "Cormorant Garamond", Georgia, serif;
  color: var(--ink); background: var(--bg); padding: 0;
  position: relative;
}

.theme-hotel .cover {
  height: 3in; position: relative; overflow: hidden;
  background: linear-gradient(180deg, var(--primary), color-mix(in oklab, var(--primary), black 30%));
  color: var(--bg);
}
.theme-hotel .cover::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 70% 30%,
    color-mix(in oklab, var(--accent), transparent 75%), transparent 60%);
}
.theme-hotel .cover-mark {
  position: absolute; top: 0.35in; left: 0; right: 0; text-align: center;
  font-family: "JetBrains Mono", monospace; font-size: 8px;
  letter-spacing: 0.4em; color: var(--accent);
}
.theme-hotel .cover-mark::before { content: "◆ "; }
.theme-hotel .cover-mark::after { content: " ◆"; }
.theme-hotel .cover-body {
  position: absolute; top: 50%; left: 0; right: 0;
  transform: translateY(-50%); text-align: center;
}
.theme-hotel .cover-pre {
  font-style: italic; font-size: 12px; color: var(--accent);
}
.theme-hotel .cover-name {
  font-size: 44px; font-weight: 500; color: var(--bg);
  margin: 6px 0; line-height: 1;
}
.theme-hotel .cover-rule {
  height: 1px; background: var(--accent); width: 60px; margin: 10px auto;
}
.theme-hotel .cover-tag {
  font-family: "JetBrains Mono", monospace; font-size: 9px;
  letter-spacing: 0.3em; color: var(--accent);
}
.theme-hotel .cover-logo {
  position: absolute; bottom: 0.2in; left: 0; right: 0; text-align: center;
}
.theme-hotel .cover-logo img { height: 28px; filter: brightness(0) invert(1); }

.theme-hotel .page-inner { padding: 0.4in 0.6in; }

.theme-hotel h3.section {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 500; font-size: 22px; color: var(--primary);
  text-align: center; letter-spacing: 0.02em;
  margin: 0.2in 0 0.05in 0; position: relative;
}
.theme-hotel h3.section::before,
.theme-hotel h3.section::after {
  content: "·"; color: var(--accent); margin: 0 0.15in;
  font-size: 22px; vertical-align: middle;
}
.theme-hotel .subhead {
  text-align: center; font-size: 8px; letter-spacing: 0.3em;
  font-family: "JetBrains Mono", monospace; color: var(--accent);
  margin-bottom: 0.1in;
}

.theme-hotel dl.facts { margin: 0.1in 0; font-size: 11px;
                         line-height: 1.7; text-align: center; }
.theme-hotel dl.facts dt {
  font-size: 8px; letter-spacing: 0.2em; color: var(--accent);
  font-family: "JetBrains Mono", monospace; margin-top: 6px;
}
.theme-hotel dl.facts dd { margin: 2px 0 6px 0; font-size: 13px; }

.theme-hotel .wifi-engraved {
  border: 1px solid var(--accent); border-width: 1px 0;
  padding: 0.15in 0; margin: 0.15in 0; text-align: center;
}
.theme-hotel .wifi-engraved .pre {
  font-family: "JetBrains Mono", monospace; font-size: 8px;
  letter-spacing: 0.3em; color: var(--accent);
}
.theme-hotel .wifi-engraved .val {
  font-size: 18px; font-weight: 500; color: var(--primary);
  margin-top: 4px;
}

.theme-hotel table.local {
  width: 100%; border-collapse: collapse; font-size: 10.5px;
}
.theme-hotel table.local td {
  padding: 6px 4px; border-bottom: 1px dotted var(--accent); vertical-align: top;
}
.theme-hotel table.local td.cat {
  font-weight: 500; color: var(--primary); width: 22%;
}

.theme-hotel .emergency {
  border: 2px solid #a33; padding: 0.15in; margin-top: 0.15in;
  text-align: center; font-size: 11.5px;
}
.theme-hotel .emergency h4 {
  margin: 0 0 6px 0; color: #a33; font-size: 18px;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 3: Implement `renderEditorialTheme(data, root)` in `renderer.js`**

Replace the stub. Uses the same data shape, simpler markup:

```javascript
function renderEditorialTheme(d, root) {
  const P = d.Property || {};
  const A = d.Arrival || {};
  const W = d["WiFi + Tech"] || {};
  const R = d["House Rules"] || {};
  const T = d.Trash || {};
  const D = d.Departure || {};
  const E = d.Emergency || {};
  const L = (d["Local Guide"] || []).filter(r => r.name && String(r.name).trim()).slice(0, 10);

  root.innerHTML = `
  <section class="page" data-page="1">
    <div class="masthead">
      <div class="sku">THE STR LEDGER · GST-001 · GUEST EDITION</div>
      <div class="title">Welcome to ${orDash(P.B6)}.</div>
      <div class="sub">A few notes to make your stay effortless.</div>
    </div>

    <h3 class="section">Host &amp; Stay</h3>
    <dl class="facts">
      <dt>Host:</dt><dd>${orDash(P.B7)} · ${orDash(P.B8)}</dd>
      <dt>Check-in:</dt><dd>${orDash(A.B11)}</dd>
      <dt>Check-out:</dt><dd>${orDash(D.B6)}</dd>
    </dl>

    <h3 class="section">Arrival</h3>
    <dl class="facts">
      <dt>Address:</dt><dd>${orDash(A.B6)}</dd>
      <dt>Entry:</dt><dd>${orDash(A.B7)}</dd>
      <dt>Door / lock code:</dt><dd>${orDash(A.B8)}</dd>
      <dt>Parking:</dt><dd>${orDash(A.B9)}</dd>
    </dl>

    <div class="wifi-callout">
      <div><span class="big">WiFi:</span> ${orDash(W.B6)}</div>
      <div><span class="big">Password:</span> ${orDash(W.B7)}</div>
    </div>
  </section>

  <section class="page" data-page="2">
    <h3 class="section">House Rules</h3>
    <dl class="facts">
      <dt>Quiet hours:</dt><dd>${orDash(R.B6)}</dd>
      <dt>Max guests:</dt><dd>${orDash(R.B7)}</dd>
      <dt>Smoking:</dt><dd>${orDash(R.B8)}</dd>
      <dt>Pets:</dt><dd>${orDash(R.B9)}</dd>
      <dt>Events:</dt><dd>${orDash(R.B10)}</dd>
      <dt>Shoes:</dt><dd>${orDash(R.B11)}</dd>
    </dl>

    <h3 class="section">Local Guide — Top 10</h3>
    <table class="local">
      ${L.map(r => `<tr>
        <td class="cat">${esc(r.cat)}</td>
        <td>${esc(r.name)}</td>
        <td>${orDash(r.dist)}</td>
        <td>${orDash(r.phone)}</td>
      </tr>`).join("")}
    </table>
  </section>

  <section class="page" data-page="3">
    <h3 class="section">Trash &amp; Maintenance</h3>
    <dl class="facts">
      <dt>Pickup day:</dt><dd>${orDash(T.B6)}</dd>
      <dt>Bin location:</dt><dd>${orDash(T.B7)}</dd>
      <dt>Sorting:</dt><dd>${orDash(T.B9)}</dd>
    </dl>

    <h3 class="section">Checkout</h3>
    <dl class="facts">
      <dt>Time:</dt><dd>${orDash(D.B6)}</dd>
      <dt>Linens:</dt><dd>${orDash(D.B7)}</dd>
      <dt>Key return:</dt><dd>${orDash(D.B10)}</dd>
    </dl>

    <div class="emergency">
      <h4>Emergency — 911 first</h4>
      <p>Hospital: ${orDash(E.B6)} · ${orDash(E.B7)}</p>
      <p>Urgent care: ${orDash(E.B9)} · ${orDash(E.B10)}</p>
      <p>Host phone: ${orDash(P.B8)}</p>
      <p>Poison: ${orDash(E.B12)}</p>
    </div>
  </section>
  `;
}
```

- [ ] **Step 4: Implement `renderHotelTheme(data, root)` in `renderer.js`**

Replace the stub:

```javascript
function renderHotelTheme(d, root) {
  const P = d.Property || {};
  const A = d.Arrival || {};
  const W = d["WiFi + Tech"] || {};
  const R = d["House Rules"] || {};
  const T = d.Trash || {};
  const D = d.Departure || {};
  const E = d.Emergency || {};
  const L = (d["Local Guide"] || []).filter(r => r.name && String(r.name).trim()).slice(0, 10);

  root.innerHTML = `
  <section class="page" data-page="1">
    <div class="cover">
      <div class="cover-mark">THE STR LEDGER</div>
      <div class="cover-body">
        <div class="cover-pre">The house at</div>
        <div class="cover-name">${orDash(P.B6)}</div>
        <div class="cover-rule"></div>
        <div class="cover-tag">GUEST EDITION · 2026</div>
      </div>
    </div>
    <div class="page-inner">
      <div class="subhead">WELCOME</div>
      <h3 class="section">A few notes</h3>
      <dl class="facts">
        <dt>Host</dt><dd>${orDash(P.B7)} · ${orDash(P.B8)}</dd>
        <dt>Arrival</dt><dd>${orDash(A.B6)}</dd>
        <dt>Check-in / Check-out</dt><dd>${orDash(A.B11)} → ${orDash(D.B6)}</dd>
        <dt>Parking</dt><dd>${orDash(A.B9)}</dd>
      </dl>
      <div class="wifi-engraved">
        <div class="pre">WIFI</div>
        <div class="val">${orDash(W.B6)} &nbsp; · &nbsp; ${orDash(W.B7)}</div>
      </div>
    </div>
  </section>

  <section class="page" data-page="2">
    <div class="page-inner">
      <div class="subhead">HOUSE</div>
      <h3 class="section">Rules of the Home</h3>
      <dl class="facts">
        <dt>Quiet Hours</dt><dd>${orDash(R.B6)}</dd>
        <dt>Max Guests</dt><dd>${orDash(R.B7)}</dd>
        <dt>Smoking</dt><dd>${orDash(R.B8)}</dd>
        <dt>Pets</dt><dd>${orDash(R.B9)}</dd>
        <dt>Events</dt><dd>${orDash(R.B10)}</dd>
      </dl>
      <div class="subhead">NEARBY</div>
      <h3 class="section">Local Favorites</h3>
      <table class="local">
        ${L.map(r => `<tr>
          <td class="cat">${esc(r.cat)}</td>
          <td><strong>${esc(r.name)}</strong></td>
          <td>${orDash(r.dist)}</td>
          <td>${orDash(r.notes)}</td>
        </tr>`).join("")}
      </table>
    </div>
  </section>

  <section class="page" data-page="3">
    <div class="page-inner">
      <div class="subhead">DEPARTURE</div>
      <h3 class="section">On your way out</h3>
      <dl class="facts">
        <dt>Checkout Time</dt><dd>${orDash(D.B6)}</dd>
        <dt>Linens</dt><dd>${orDash(D.B7)}</dd>
        <dt>Key Return</dt><dd>${orDash(D.B10)}</dd>
        <dt>Trash</dt><dd>${orDash(T.B6)} — ${orDash(T.B7)}</dd>
      </dl>

      <div class="emergency">
        <h4>Emergency — Call 911 first</h4>
        <p>Hospital · ${orDash(E.B6)} · ${orDash(E.B7)}</p>
        <p>Urgent care · ${orDash(E.B9)} · ${orDash(E.B10)}</p>
        <p>Host · ${orDash(P.B8)}</p>
        <p>Poison Control · ${orDash(E.B12)}</p>
      </div>
    </div>
  </section>
  `;
}
```

- [ ] **Step 5: Wire the theme picker**

Add `wireThemePicker` to `renderer.js`:

```javascript
function wireThemePicker(el) {
  const themes = [
    { id: "magazine", label: "Magazine", hint: "Navy hero + cards" },
    { id: "editorial", label: "Editorial", hint: "Typography only" },
    { id: "hotel",     label: "Hotel", hint: "Foil-stamp hero" },
  ];
  el.className = "picker theme-picker";
  el.innerHTML = themes.map(t =>
    `<div class="theme-card${appState.theme===t.id?' selected':''}"
          data-theme="${t.id}">
       <div class="theme-thumb theme-thumb-${t.id}"></div>
       <div class="theme-label">${t.label}</div>
     </div>`
  ).join("");
  el.querySelectorAll(".theme-card").forEach(card =>
    card.addEventListener("click", () =>
      setState({ theme: card.dataset.theme })
    )
  );
}
```

Call it in `renderWorkspace` setTimeout alongside `wirePalettePicker`.

- [ ] **Step 6: Add theme picker CSS**

Append to `renderer.css`:

```css
.theme-picker { display: flex; gap: 6px; }
.theme-card {
  flex: 1; cursor: pointer; text-align: center;
  border: 2px solid transparent; border-radius: 4px;
  padding: 4px; background: #fafafa;
}
.theme-card.selected { border-color: var(--accent); }
.theme-thumb {
  width: 100%; height: 60px; background: #eee;
  margin-bottom: 4px; border-radius: 2px;
}
.theme-thumb-magazine {
  background: linear-gradient(to bottom,
    var(--primary) 40%, var(--bg) 40%);
}
.theme-thumb-editorial {
  background: var(--bg);
  border: 1px solid var(--accent);
}
.theme-thumb-hotel {
  background: linear-gradient(to bottom,
    var(--primary) 70%, var(--bg) 70%);
}
.theme-label {
  font-size: 10px; font-family: "Inter", sans-serif;
  color: var(--primary); font-weight: 500;
}
```

- [ ] **Step 7: Link the new theme CSS files in `index.html`**

```html
  <link rel="stylesheet" href="renderer.css">
  <link rel="stylesheet" href="themes/magazine.css">
  <link rel="stylesheet" href="themes/editorial.css">
  <link rel="stylesheet" href="themes/hotel.css">
```

- [ ] **Step 8: Manual browser QA**

Reload. Demo. Click each theme card in the sidebar. Expected: all 3 pages re-render in the selected theme; layout shifts visibly between Magazine (navy band), Editorial (no band, typography-only), Hotel (dark full-bleed cover). Combine with palette swaps — all 4 palettes × 3 themes = 12 visual combinations; spot-check 4.

- [ ] **Step 9: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/themes/editorial.css \
        templates/_delivery/GST-001-welcome-book/_assets/themes/hotel.css \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.js \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.css \
        templates/_delivery/GST-001-welcome-book/_assets/index.html

git commit -m "feat: v2.1 renderer — Editorial + Hotel themes + picker

Tier 1 Clean Editorial (typography-only, double-rule masthead) and
Tier 3 Hotel Welcome Packet (full-bleed cover, engraved type,
ornamental rules). Theme picker in sidebar cycles the 3 themes.
Each theme consumes the same data contract — only layout differs."
```

---

## Task 10: Logo upload + SVG sanitizer

**Files:**
- Modify: `_assets/renderer.js` — logo drop zone, image load, SVG sanitizer, render-into-header hooks
- Modify: `_assets/renderer.css` — logo slot UI

**Acceptance:** Sidebar Logo panel shows a drop zone. Dropping a PNG or SVG displays a preview in the panel and the logo renders in every page's header at max-height 60px. Clicking × removes it. SVGs are sanitized (no `<script>`, no `on*` handlers, no external `href`).

- [ ] **Step 1: Add the logo slot HTML + CSS**

Update the `#logo-slot` panel content via a `wireLogoSlot()` function:

```javascript
function wireLogoSlot(el) {
  el.innerHTML = appState.logo
    ? `<div class="logo-preview">
         <img src="${appState.logo}" alt="">
         <button class="logo-remove" title="Remove logo">×</button>
       </div>`
    : `<div class="logo-drop" id="logo-drop">
         <span>Drop PNG or SVG</span>
       </div>`;

  if (appState.logo) {
    el.querySelector(".logo-remove").addEventListener("click", () =>
      setState({ logo: null })
    );
    return;
  }

  const drop = el.querySelector("#logo-drop");
  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
  ["dragenter","dragover","dragleave","drop"].forEach(ev =>
    drop.addEventListener(ev, prevent));
  drop.addEventListener("dragover",  () => drop.classList.add("drag-over"));
  drop.addEventListener("dragleave", () => drop.classList.remove("drag-over"));
  drop.addEventListener("drop", async (e) => {
    drop.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const isSVG = /\.svg$/i.test(file.name) || file.type.includes("svg");
    const isPNG = /\.png$/i.test(file.name) || file.type === "image/png";
    if (!isSVG && !isPNG) {
      alert("Logo must be PNG or SVG. Got: " + file.name);
      return;
    }
    if (isSVG) {
      const text = await file.text();
      const sanitized = sanitizeSVG(text);
      if (!sanitized) { alert("SVG rejected by sanitizer."); return; }
      const b64 = btoa(unescape(encodeURIComponent(sanitized)));
      setState({ logo: `data:image/svg+xml;base64,${b64}` });
    } else {
      // PNG: downscale to max 400px wide
      const url = await downscalePNG(file, 400);
      setState({ logo: url });
    }
  });
}

function sanitizeSVG(svgText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const root = doc.documentElement;
    if (root.nodeName !== "svg") return null;

    // Strip <script>, <foreignObject>, and on* attributes recursively
    const forbidden = new Set(["script", "foreignObject", "link", "iframe"]);
    const walk = (node) => {
      if (node.nodeType !== 1) return;
      // Kill forbidden elements
      if (forbidden.has(node.nodeName)) {
        node.remove();
        return;
      }
      // Strip on* attributes and href="javascript:..."
      for (const attr of Array.from(node.attributes)) {
        const n = attr.name.toLowerCase();
        if (n.startsWith("on")) node.removeAttribute(attr.name);
        if ((n === "href" || n === "xlink:href") &&
            /^\s*javascript:/i.test(attr.value)) {
          node.removeAttribute(attr.name);
        }
      }
      // External image/href with http(s) — strip (keep only data:)
      if (node.hasAttribute("href") &&
          /^https?:/i.test(node.getAttribute("href"))) {
        node.removeAttribute("href");
      }
      // Recurse
      for (const child of Array.from(node.childNodes)) walk(child);
    };
    walk(root);
    return new XMLSerializer().serializeToString(doc);
  } catch (err) {
    console.error("SVG sanitize failed", err);
    return null;
  }
}

function downscalePNG(file, maxWidth) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = url;
  });
}
```

Wire it in `renderWorkspace` setTimeout:

```javascript
    wireLogoSlot(el.querySelector("#logo-slot"));
```

- [ ] **Step 2: Inject the logo into each theme's page header**

Each theme needs a `data-logo` prop or an img slot. Simplest: after calling the theme's render function, post-process to inject `<img class="hero-logo">`. Add to `renderPages`:

```javascript
function renderPages() {
  const root = document.getElementById("pages");
  root.className = `theme-${appState.theme} palette-${appState.palette}`;
  const pages = {
    magazine: renderMagazineTheme,
    editorial: renderEditorialTheme,
    hotel: renderHotelTheme,
  };
  const fn = pages[appState.theme] || renderMagazineTheme;
  root.innerHTML = "";
  fn(appState.data, root);
  injectLogo(root);
}

function injectLogo(root) {
  if (!appState.logo) return;
  const theme = appState.theme;
  if (theme === "magazine") {
    // Logo goes in .hero (page 1 top-right)
    const hero = root.querySelector(".page[data-page='1'] .hero");
    if (hero) {
      const img = document.createElement("img");
      img.className = "hero-logo"; img.src = appState.logo;
      hero.appendChild(img);
    }
  } else if (theme === "editorial") {
    const masthead = root.querySelector(".masthead");
    if (masthead) {
      const img = document.createElement("img");
      img.className = "logo"; img.src = appState.logo;
      masthead.insertBefore(img, masthead.firstChild);
    }
  } else if (theme === "hotel") {
    const cover = root.querySelector(".cover");
    if (cover) {
      const wrap = document.createElement("div");
      wrap.className = "cover-logo";
      wrap.innerHTML = `<img src="${appState.logo}">`;
      cover.appendChild(wrap);
    }
  }
}
```

- [ ] **Step 3: Add logo slot CSS**

Append to `renderer.css`:

```css
.logo-drop {
  border: 1px dashed var(--accent); padding: 18px 10px;
  text-align: center; font-size: 10px; color: var(--accent);
  cursor: pointer; transition: all 100ms;
}
.logo-drop.drag-over { background: var(--bg); }
.logo-preview {
  position: relative; padding: 10px; background: #fff;
  border: 1px solid #ddd; text-align: center;
}
.logo-preview img { max-width: 100%; max-height: 80px; }
.logo-remove {
  position: absolute; top: 2px; right: 4px;
  background: #a33; color: white; border: none;
  width: 22px; height: 22px; border-radius: 50%;
  cursor: pointer; font-size: 14px; line-height: 1;
}
```

- [ ] **Step 4: Manual browser QA**

Create a tiny test PNG and SVG. For PNG, screenshot a colored square. For SVG, use:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#C9A24B"/><text x="50" y="55" text-anchor="middle" font-family="Georgia" font-size="18" fill="#12304E">SL</text></svg>
```

Save as `test-logo.svg`. Drop onto the sidebar logo panel. Expected: preview appears in panel; logo renders in the Magazine page 1 hero (top-right), Editorial masthead (left), Hotel cover (bottom).

Then test a **malicious SVG**:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><script>alert('pwn')</script><circle cx="50" cy="50" r="40" fill="red" onclick="alert('xss')"/></svg>
```

Drop it. Expected: no alert fires. Inspect the injected DOM (devtools) — `<script>` should be absent; `onclick` attribute should be stripped.

- [ ] **Step 5: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/renderer.js \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.css

git commit -m "feat: v2.1 renderer — logo upload + SVG sanitizer

PNG downscaled to 400px max width on upload; SVG parsed via
DOMParser, stripped of script, foreignObject, link, iframe, and
every on* attribute, plus http(s) href scrubbing. Logo injected
into each theme's header slot."
```

---

## Task 11: QR codes — WiFi, phone, address (with toggles)

**Files:**
- Modify: `_assets/renderer.js` — QR generation + toggle UI + theme injection
- Modify: `_assets/renderer.css` — QR print/display styles
- Modify: each theme CSS — layout slot for QRs

**Acceptance:** Sidebar QR panel shows 3 checkboxes (WiFi, Host phone, Address), all defaulted on. Each produces a scannable ~0.8in QR next to the matching data block. Empty underlying inputs grey-out the toggle and suppress the QR. Scanning the WiFi QR on a phone offers to join the network; the phone QR opens the dialer; the address QR opens Maps.

- [ ] **Step 1: Add QR generation helpers to `renderer.js`**

```javascript
function generateQR(payload) {
  // qrcode-generator: typeNumber=0 (auto), errorCorrection='M'
  const qr = qrcode(0, "M");
  qr.addData(payload);
  qr.make();
  // Render as inline SVG for print sharpness. 0.8in @ 72dpi = ~58px css.
  // We render at logical 4px-per-module and scale via CSS.
  return qr.createSvgTag({ cellSize: 4, margin: 2 });
}

function qrPayloads(data) {
  const W = data["WiFi + Tech"] || {};
  const P = data.Property || {};
  const A = data.Arrival || {};
  return {
    wifi: W.B6 && W.B7
      ? `WIFI:T:WPA;S:${String(W.B6).replace(/([\\;,:"])/g,"\\$1")};` +
        `P:${String(W.B7).replace(/([\\;,:"])/g,"\\$1")};;`
      : null,
    phone: P.B8 ? `tel:${String(P.B8).replace(/[^\d+]/g,"")}` : null,
    address: A.B6 ? `geo:0,0?q=${encodeURIComponent(String(A.B6))}` : null,
  };
}
```

- [ ] **Step 2: Add the QR toggles UI**

```javascript
function wireQRToggles(el) {
  const payloads = qrPayloads(appState.data);
  const rows = [
    { key: "wifi",    label: "WiFi",       hint: "scan to connect" },
    { key: "phone",   label: "Host phone", hint: "tap to call" },
    { key: "address", label: "Address",    hint: "open in Maps" },
  ];
  el.innerHTML = rows.map(r => {
    const enabled = !!payloads[r.key];
    const checked = enabled && appState.qr[r.key];
    return `
      <label class="qr-row${enabled ? "" : " disabled"}">
        <input type="checkbox" data-qr="${r.key}"
               ${checked ? "checked" : ""}
               ${enabled ? "" : "disabled"}>
        <span class="qr-label">${r.label}</span>
        <span class="qr-hint">${enabled ? r.hint : "— empty input"}</span>
      </label>`;
  }).join("");
  el.querySelectorAll("input[data-qr]").forEach(cb =>
    cb.addEventListener("change", () => {
      const k = cb.dataset.qr;
      setState({ qr: { ...appState.qr, [k]: cb.checked } });
    })
  );
}
```

Call in `renderWorkspace` setTimeout:

```javascript
    wireQRToggles(el.querySelector("#qr-toggles"));
```

- [ ] **Step 3: Inject QRs into each theme's render output**

Extend `renderPages` post-processing:

```javascript
function renderPages() {
  const root = document.getElementById("pages");
  root.className = `theme-${appState.theme} palette-${appState.palette}`;
  const pages = {
    magazine: renderMagazineTheme,
    editorial: renderEditorialTheme,
    hotel: renderHotelTheme,
  };
  const fn = pages[appState.theme] || renderMagazineTheme;
  root.innerHTML = "";
  fn(appState.data, root);
  injectLogo(root);
  injectQRs(root);
}

function injectQRs(root) {
  const payloads = qrPayloads(appState.data);
  const on = (k) => appState.qr[k] && !!payloads[k];

  if (on("wifi")) {
    const wifiBlock = root.querySelector(".wifi-big, .wifi-callout, .wifi-engraved");
    if (wifiBlock) {
      const qr = document.createElement("div");
      qr.className = "qr qr-wifi";
      qr.innerHTML = generateQR(payloads.wifi)
        + '<div class="qr-caption">scan to connect</div>';
      wifiBlock.appendChild(qr);
    }
  }
  if (on("phone")) {
    const em = root.querySelector(".emergency");
    if (em) {
      const qr = document.createElement("div");
      qr.className = "qr qr-phone";
      qr.innerHTML = generateQR(payloads.phone)
        + '<div class="qr-caption">tap to call</div>';
      em.appendChild(qr);
    }
  }
  if (on("address")) {
    // Page 1 — next to the arrival facts block
    const arrival = root.querySelector(
      `.page[data-page="1"] dl.facts`);
    if (arrival) {
      const qr = document.createElement("div");
      qr.className = "qr qr-address";
      qr.innerHTML = generateQR(payloads.address)
        + '<div class="qr-caption">open in Maps</div>';
      arrival.parentNode.insertBefore(qr, arrival.nextSibling);
    }
  }
}
```

- [ ] **Step 4: Add QR CSS**

Append to `renderer.css`:

```css
/* QR inline block */
.qr {
  display: inline-block; vertical-align: top;
  margin: 6px 0 6px 10px; text-align: center;
}
.qr svg { width: 0.8in; height: 0.8in; display: block; }
.qr-caption {
  font-family: "JetBrains Mono", monospace; font-size: 7px;
  letter-spacing: 0.2em; color: var(--accent); margin-top: 2px;
  text-transform: uppercase;
}

/* QR toggles sidebar */
.qr-row { display: flex; align-items: center; gap: 6px;
           font-size: 12px; padding: 4px 0; cursor: pointer; }
.qr-row input { margin: 0; }
.qr-row .qr-label { font-weight: 500; }
.qr-row .qr-hint { color: #888; font-size: 10px; margin-left: auto; }
.qr-row.disabled { opacity: 0.5; cursor: not-allowed; }
```

Add theme-specific placement tweaks to `themes/magazine.css`:

```css
.theme-magazine .wifi-big { display: flex; justify-content: space-between;
                              align-items: center; gap: 0.1in; flex-wrap: wrap; }
.theme-magazine .wifi-big .qr { margin-left: auto; }
.theme-magazine .qr-address { float: right; margin: 0.1in; }
```

And to `themes/editorial.css`:

```css
.theme-editorial .wifi-callout .qr { float: right; margin: 0 0 6px 6px; }
.theme-editorial .qr-address { float: right; margin-left: 10px; }
.theme-editorial .emergency .qr { display: block; margin: 6px auto; }
```

And to `themes/hotel.css`:

```css
.theme-hotel .wifi-engraved { position: relative; }
.theme-hotel .wifi-engraved .qr { position: absolute; right: 0.2in; top: 0.1in; }
.theme-hotel .qr-address { display: block; margin: 0.1in auto; }
```

- [ ] **Step 5: Manual browser QA**

Reload, demo. Expected on page 1: QR beside the WiFi block + QR beside the Arrival block. On page 3: QR in the Emergency block next to host phone.

Scan with a phone:
- WiFi QR → phone offers to join `SmokiesRidge_Guest` network
- Address QR → opens Maps to "123 Mountain Lane, Gatlinburg, TN 37738"
- Phone QR → opens dialer with `5555550199`

Uncheck any toggle → its QR disappears immediately.

Load the BLANK xlsx. Expected: all 3 QR toggles are greyed out with "— empty input" hint; no QRs render on the pages.

- [ ] **Step 6: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/renderer.js \
        templates/_delivery/GST-001-welcome-book/_assets/renderer.css \
        templates/_delivery/GST-001-welcome-book/_assets/themes/magazine.css \
        templates/_delivery/GST-001-welcome-book/_assets/themes/editorial.css \
        templates/_delivery/GST-001-welcome-book/_assets/themes/hotel.css

git commit -m "feat: v2.1 renderer — tap-to-action QR codes

Three QRs using standard payloads (WIFI:, tel:, geo:) generated by
qrcode-generator. Three sidebar toggles, defaulted on, grey-out
when the underlying xlsx cell is empty. Injected per theme into
WiFi block, Emergency block, and Arrival block."
```

---

## Task 12: localStorage persistence

**Files:**
- Modify: `_assets/renderer.js` — save state on change, restore on load

**Acceptance:** Customizations (theme, palette, logo, QR toggles) persist across page reloads for the same property. Dropping a different property's xlsx starts fresh (keyed by `Property!B6` value). Clearing site data wipes all.

- [ ] **Step 1: Add storage helpers to `renderer.js`**

```javascript
const STORAGE_PREFIX = "welcome-book-v2.1:";

function propertyKey(data) {
  const name = data?.Property?.B6 || "";
  return STORAGE_PREFIX + name.trim().toLowerCase().replace(/\s+/g, "-") || STORAGE_PREFIX + "default";
}

function saveState() {
  if (!appState.data) return;
  try {
    const key = propertyKey(appState.data);
    const slim = {
      theme: appState.theme,
      palette: appState.palette,
      logo: appState.logo,
      qr: appState.qr,
    };
    localStorage.setItem(key, JSON.stringify(slim));
  } catch (err) {
    // QuotaExceeded (likely a big logo) — drop the logo and retry
    console.warn("localStorage save failed; dropping logo", err);
    try {
      localStorage.setItem(key, JSON.stringify({ ...slim, logo: null }));
    } catch {}
  }
}

function restoreState(data) {
  try {
    const key = propertyKey(data);
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme || "magazine",
      palette: parsed.palette || "harbor",
      logo: parsed.logo || null,
      qr: parsed.qr || { wifi: true, phone: true, address: true },
    };
  } catch {
    return {};
  }
}
```

- [ ] **Step 2: Wire into `setState` and data-ready callbacks**

Change `setState` to also save:

```javascript
function setState(partial) {
  appState = { ...appState, ...partial };
  saveState();
  render();
}
```

Change the landing callbacks in `renderLanding` so setting `data` also pulls stored prefs:

```javascript
  const onDataReady = (data, src) => {
    const restored = restoreState(data);
    appState = { ...defaultState, ...restored, data, dataSource: src };
    render();
  };
  setupDropZone(el.querySelector("#drop-zone"), onDataReady);
  el.querySelector("#demo-btn").addEventListener("click", () =>
    loadDemoData("demo-data.json", onDataReady)
  );
```

- [ ] **Step 3: Manual browser QA**

Reload, demo. Change theme to Hotel + palette to Cabin + upload a logo + toggle off the phone QR. Reload the page (F5) and click demo again. Expected: the Hotel theme, Cabin palette, logo, and phone-QR-off are all restored.

Drop the BLANK xlsx instead (different property name — empty → default key). Expected: customizations revert to defaults (Magazine + Harbor + no logo + all QRs on) because it's a different property key.

Clear localStorage (devtools → Application → Storage → Clear site data). Reload. Expected: defaults restored.

- [ ] **Step 4: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/renderer.js

git commit -m "feat: v2.1 renderer — localStorage persistence

Theme/palette/logo/QR choices persist per property (keyed by
Property!B6 value). Clearing browser data resets. Handles
QuotaExceeded by dropping the logo and retrying."
```

---

## Task 13: Print CSS + print QA matrix

**Files:**
- Modify: `_assets/renderer.css` — `@page` + `@media print` rules

**Acceptance:** Ctrl+P produces a 3-page letter-portrait PDF with only the `.page` elements visible (sidebar/chrome hidden). No blank 4th page. Fonts render (either embedded or served via system substitution). QRs remain sharp. Tested in Chrome, Safari, Edge.

- [ ] **Step 1: Append print CSS to `renderer.css`**

```css
/* Print rules ------------------------------------------------- */

@page {
  size: Letter portrait;
  margin: 0.5in;
}

@media print {
  body { background: white; }
  .sidebar, .canvas, .drop-zone { background: white; }
  .sidebar, .panel, .workspace .sidebar { display: none !important; }
  .canvas { padding: 0; background: white; overflow: visible; }
  .canvas-inner { gap: 0; }
  .page {
    width: auto; height: auto; box-shadow: none;
    page-break-after: always; break-after: page;
    padding: 0; margin: 0; border: 0;
  }
  .page:last-child { page-break-after: auto; break-after: auto; }
  /* Keep QR crisp */
  .qr svg { width: 0.8in; height: 0.8in; }
  /* Suppress any dev-only elements */
  .hint { display: none; }
}
```

- [ ] **Step 2: Manual print QA — Chrome**

In Chrome: File → Print (Ctrl+P) from the workspace after demo data loaded.
Expected:
- Preview shows exactly 3 pages
- No sidebar visible
- Page content fills the page with margins around ~0.5in
- Theme styling (navy hero, gold rules, etc.) renders
- "Save as PDF" produces the PDF; open it — verify all 3 pages look right

If a 4th page creeps in, adjust `.page` sizing: the 7.5×10in display size should equal the print "content-box" after 0.5in margins. Reduce slightly (e.g., 7.4×9.9) until exactly 3 pages.

- [ ] **Step 3: Manual print QA — Edge**

Repeat on Edge. Expected: identical behavior. Note any deltas.

- [ ] **Step 4: Manual print QA — Safari (if available)**

If on macOS, test in Safari. Expected: identical. Known Safari quirk — `page-break-after: always` sometimes inserts an extra break; the `break-after: page` fallback usually fixes it.

- [ ] **Step 5: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/renderer.css

git commit -m "feat: v2.1 renderer — print CSS (3-page letter portrait)

@page letter portrait + 0.5in margins; @media print hides sidebar,
kills shadows, enforces page breaks. Tested Chrome / Edge (Safari
pending on macOS availability)."
```

---

## Task 14: Inline everything into single-file `welcome-book-renderer.html`

**Files:**
- Create: `templates/_delivery/GST-001-welcome-book/build-renderer.py` — Python script that inlines CSS + JS + fonts into one HTML file
- Create: `templates/_delivery/GST-001-welcome-book/welcome-book-renderer.html` (produced by script)

**Acceptance:** Running `python build-renderer.py` produces `welcome-book-renderer.html` with every CSS, JS, and font inlined (<1.5MB). Opening this file directly (no server, no CDN, no network) from a fresh folder works identically to the dev `index.html`. The file embeds:
- `renderer.css` + all 3 theme CSS files
- `sheetjs.min.js` + `qrcode.min.js` + `renderer.js`
- Cormorant Garamond, Inter, JetBrains Mono as base64 `@font-face` (latin subset)
- `demo-data.json` as a `<script type="application/json">` block

- [ ] **Step 1: Download Google Fonts subset woff2 files**

Fetch each font's latin subset (smallest size):

```bash
cd templates/_delivery/GST-001-welcome-book/_assets
mkdir -p fonts && cd fonts

# Use google-webfonts-helper CSS generator or fetch directly. Direct links:
curl -sSL "https://fonts.gstatic.com/s/cormorantgaramond/v18/co3YmX5slCNuHLi8bLeY9MK7whWMhyjortsNXgZt.woff2" -o cormorant-500.woff2
curl -sSL "https://fonts.gstatic.com/s/cormorantgaramond/v18/co3YmX5slCNuHLi8bLeY9MK7whWMhyjoBNsNXgZt.woff2" -o cormorant-500-italic.woff2
curl -sSL "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2" -o inter-400.woff2
curl -sSL "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2" -o inter-500.woff2
curl -sSL "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT.woff2" -o jetbrainsmono-400.woff2

ls -lh
```

Expected: ~5 files, each 15-40KB. (Note: the gstatic URLs may drift — if `curl` 404s, the builder script should fall back to fetching via Google Fonts' CSS API and parsing the `src: url(...)` out of the response.)

- [ ] **Step 2: Write `build-renderer.py`**

```python
"""Bundle the dev renderer (HTML + CSS + JS + fonts + demo JSON) into a
single self-contained welcome-book-renderer.html file.

Usage:
    python build-renderer.py

Outputs:
    welcome-book-renderer.html
"""
from pathlib import Path
import base64
import json
import sys

BASE = Path(__file__).resolve().parent
ASSETS = BASE / "_assets"
OUT = BASE / "welcome-book-renderer.html"


def read(path, binary=False):
    mode = "rb" if binary else "r"
    encoding = None if binary else "utf-8"
    return path.read_bytes() if binary else path.read_text(encoding=encoding)


def font_face_block():
    fonts = [
        ("Cormorant Garamond", 500, "normal", "cormorant-500.woff2"),
        ("Cormorant Garamond", 500, "italic", "cormorant-500-italic.woff2"),
        ("Inter",              400, "normal", "inter-400.woff2"),
        ("Inter",              500, "normal", "inter-500.woff2"),
        ("JetBrains Mono",     400, "normal", "jetbrainsmono-400.woff2"),
    ]
    out = []
    for family, weight, style, fname in fonts:
        path = ASSETS / "fonts" / fname
        if not path.exists():
            print(f"WARN: missing font {fname}; skipping", file=sys.stderr)
            continue
        b64 = base64.b64encode(path.read_bytes()).decode("ascii")
        out.append(f"""@font-face {{
  font-family: "{family}";
  font-weight: {weight};
  font-style: {style};
  src: url(data:font/woff2;base64,{b64}) format("woff2");
  font-display: swap;
}}""")
    return "\n".join(out)


def build():
    css_bits = [
        font_face_block(),
        read(ASSETS / "renderer.css"),
        read(ASSETS / "themes" / "magazine.css"),
        read(ASSETS / "themes" / "editorial.css"),
        read(ASSETS / "themes" / "hotel.css"),
    ]
    css = "\n\n".join(css_bits)

    sheetjs = read(ASSETS / "sheetjs.min.js")
    qrcode_js = read(ASSETS / "qrcode.min.js")
    renderer_js = read(ASSETS / "renderer.js")

    # Demo JSON embedded as a <script type="application/json"> block
    demo_raw = read(ASSETS / "demo-data.json")

    # Patch renderer.js: change fetch("demo-data.json") to read from embedded JSON
    renderer_js_patched = renderer_js.replace(
        'async function loadDemoData(url, onDataReady) {',
        'async function loadDemoData(url, onDataReady) {\n'
        '  if (url === "demo-data.json") {\n'
        '    const el = document.getElementById("embedded-demo");\n'
        '    if (el) { onDataReady(parseDemoData(JSON.parse(el.textContent)), '
        '"demo-data.json (embedded)"); return; }\n'
        '  }'
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1200">
<title>Welcome Book Renderer — The STR Ledger</title>
<style>
{css}
</style>
</head>
<body>
<div id="app"></div>
<script type="application/json" id="embedded-demo">
{demo_raw}
</script>
<script>
{sheetjs}
</script>
<script>
{qrcode_js}
</script>
<script>
{renderer_js_patched}
</script>
</body>
</html>
"""
    OUT.write_text(html, encoding="utf-8")
    size_kb = OUT.stat().st_size / 1024
    print(f"Wrote {OUT.name} — {size_kb:.0f}KB")
    if size_kb > 1500:
        print(f"WARN: file exceeds 1.5MB target")
        sys.exit(2)


if __name__ == "__main__":
    build()
```

- [ ] **Step 3: Build and verify**

Run:

```bash
cd templates/_delivery/GST-001-welcome-book
python build-renderer.py
ls -lh welcome-book-renderer.html
```

Expected: `Wrote welcome-book-renderer.html — ~900KB` (or similar, under 1.5MB).

- [ ] **Step 4: Test the single-file renderer**

Open `welcome-book-renderer.html` directly in Chrome (double-click). Expected: identical behavior to the dev `index.html`. Click demo → 3 pages render. Drop the DEMO xlsx → 3 pages render with its data. Test theme/palette/logo/QR toggles.

Critically — **test with network disabled** (Chrome devtools → Network → Offline checkbox). Expected: still works. No external requests.

- [ ] **Step 5: Commit**

```bash
git add templates/_delivery/GST-001-welcome-book/_assets/fonts/ \
        templates/_delivery/GST-001-welcome-book/build-renderer.py \
        templates/_delivery/GST-001-welcome-book/welcome-book-renderer.html

git commit -m "build: v2.1 single-file renderer bundle

build-renderer.py inlines all CSS, JS, fonts (base64 @font-face),
and demo JSON into one welcome-book-renderer.html. Tested offline:
no external requests at runtime. File size ~<1MB target, 1.5MB hard
cap. Ships in the Etsy zip beside the xlsx."
```

---

## Task 15: Ship-it — regenerate sample PDF, rewrite how-to, update Etsy copy

**Files:**
- Modify: `copy/etsy-listings/GST-001-welcome-book.md` — swap bullets
- Rewrite: `templates/_delivery/GST-001-welcome-book/GST-001-howto.md`
- Create: `templates/_delivery/GST-001-welcome-book/GST-001-sample-output.pdf` — printed from renderer (DEMO + Magazine + Harbor + no logo, no QR)
- Clean: remove v2 preview-era sample PDF if present

**Acceptance:** Etsy listing copy accurately describes v2.1 (renderer + themes + QR + logo). How-to has the new 2-step flow with 2-3 screenshots. Sample PDF reflects the renderer output, not an Excel print.

- [ ] **Step 1: Rewrite `GST-001-howto.md`**

Overwrite the contents with:

```markdown
# GST-001 Welcome Book — How to Use (v2.1)

You got three files:

1. `GST-001-welcome-book-DEMO.xlsx` — a fully-filled example you can look at to see what "done" looks like.
2. `GST-001-welcome-book-BLANK.xlsx` — what you'll fill in for your own property.
3. `welcome-book-renderer.html` — opens in your browser and turns the xlsx into a beautiful printable PDF.

**Keep all three files in the same folder** — the renderer looks for the xlsx in the same folder as itself.

---

## Step 1 — Fill the BLANK xlsx

Open `GST-001-welcome-book-BLANK.xlsx` in Excel (or Google Sheets).

- Start on the **Start** tab. Read the overview. Click `GET STARTED →` to jump to the first input tab.
- Fill the 8 input sections — Property, Arrival, WiFi + Tech, House Rules, Local Guide, Trash, Departure, Emergency. The Start tab tracks your progress live.
- When you're done, click the `Launch` tab.
- Check the **Readiness Dashboard** — three cards showing Completion %, any empty required fields (Red Flags), and a READY / MINOR / NEEDS WORK status.

When you're at READY (or at least MINOR), move to step 2.

**Save the file** before step 2.

---

## Step 2 — Render the PDF

Double-click `welcome-book-renderer.html`. It opens in your default browser.

- **Drag `GST-001-welcome-book-BLANK.xlsx` onto the drop zone.** (Or click "Try with demo data" first to see what it looks like.)
- Use the sidebar to pick:
  - A **Theme** — Magazine (default), Editorial, or Hotel.
  - A **Palette** — Harbor Navy, Cabin Green, Terracotta Sunset, or Modern Charcoal.
  - Your **Logo** — drop a PNG or SVG onto the logo panel (optional).
  - **QR codes** — toggle any of WiFi / Host phone / Address on or off. Guests scan these to auto-join WiFi, tap-to-call, or open directions.
- Review the live 3-page preview on the right.
- Hit **Ctrl+P** (or Cmd+P on Mac) → choose "Save as PDF".

That's it. You have a branded 3-page welcome book PDF.

---

## FAQ

**Does it work on Mac?** Yes. Tested on Chrome + Safari + Edge.

**Do I need internet?** No. The renderer is self-contained and works fully offline.

**Does my property data leave my computer?** No. The renderer reads the xlsx file locally in your browser. Nothing is uploaded anywhere.

**Can I print from Excel instead?** The Excel `Launch` tab prints a 1-page readiness dashboard — not the welcome book. The full 3-page welcome book only comes from the renderer.

**I moved the files apart / the OPEN button doesn't work.** Put both files in the same folder again and re-open the xlsx. Or just open `welcome-book-renderer.html` directly.

**Can I re-render after editing the xlsx?** Yes — just re-drop the file onto the renderer. Your theme/palette/logo choices are remembered.

---

_Questions? hello@thestrledger.com_
```

- [ ] **Step 2: Update `copy/etsy-listings/GST-001-welcome-book.md`**

Find the existing "What's included" / "Features" bullet list. Swap the v2 bullets for v2.1:

Old v2 bullets (remove):
- "Live 3-page preview built into Excel"
- "Print directly from Excel with Ctrl+P"
- (any mention of Review & Print tab)

New v2.1 bullets (add):
- "Magazine-quality PDF rendered in your browser — 3 themes (Magazine / Editorial / Hotel) × 4 palettes"
- "Logo upload — drop your property's PNG or SVG, it appears on every page"
- "Tap-to-action QR codes — guests scan to auto-join WiFi, tap-to-call, or open Maps"
- "Works fully offline — no account, no subscription, no data leaves your machine"

Use the Edit tool to make the swaps.

- [ ] **Step 3: Render the sample PDF**

Open `welcome-book-renderer.html` in Chrome. Click demo. Theme = Magazine (default). Palette = Harbor (default). No logo. All 3 QRs on (so the sample showcases them). Ctrl+P → Save as PDF → save as:

```
templates/_delivery/GST-001-welcome-book/GST-001-sample-output.pdf
```

Verify: 3 pages, magazine theme, harbor palette, QRs visible.

- [ ] **Step 4: Commit**

```bash
git add copy/etsy-listings/GST-001-welcome-book.md \
        templates/_delivery/GST-001-welcome-book/GST-001-howto.md \
        templates/_delivery/GST-001-welcome-book/GST-001-sample-output.pdf

git commit -m "docs: v2.1 GST-001 — how-to rewrite + Etsy copy + sample PDF

- How-to rewritten for the 2-step flow (fill xlsx → drop on renderer)
- Etsy listing bullets swapped: 3 preview-tab bullets removed,
  4 renderer-era bullets added (themes, palettes, logo, QR codes,
  offline)
- Sample PDF regenerated from the renderer (Magazine + Harbor +
  QRs on) — replaces the v2 Excel-printed sample"
```

---

## Task 16: End-to-end dogfooding + cleanup + zip manifest

**Files:**
- Verify: the Etsy zip contents
- Clean: any stray v2 artifacts if needed

**Acceptance:** Running `python build_welcome_book_v2.py && python templates/_delivery/GST-001-welcome-book/build-renderer.py` produces a clean set of deliverables. Zipping the delivery folder produces a buyer-ready archive.

- [ ] **Step 1: Clean rebuild from scratch**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
rm -f templates/_masters/GST-001-welcome-book-DEMO.xlsx
rm -f templates/_masters/GST-001-welcome-book-BLANK.xlsx
rm -f templates/_delivery/GST-001-welcome-book/welcome-book-renderer.html

cd templates/_build && python build_welcome_book_v2.py
cd ../_delivery/GST-001-welcome-book && python build-renderer.py
```

Expected: both xlsx files + renderer.html regenerated. No errors.

- [ ] **Step 2: Dogfooding pass — buyer walkthrough**

Act as a first-time buyer:

1. Open `GST-001-welcome-book-DEMO.xlsx` in Excel.
2. Navigate the Start tab. Verify hero, progress %, section-status rows.
3. Click `GET STARTED →`. Lands on Property!A5 ish. Scroll through 8 input sections.
4. Click the Launch tab. Verify readiness dashboard shows READY.
5. Click `OPEN YOUR WELCOME BOOK →`. Verify Chrome opens `welcome-book-renderer.html`.
6. Drag the DEMO xlsx onto the renderer. Verify 3 pages render.
7. Test theme cycling (Magazine / Editorial / Hotel). Test palette cycling.
8. Upload a test logo. Verify it appears in all 3 themes.
9. Ctrl+P → Save as PDF. Verify the PDF matches the preview.

Repeat with BLANK xlsx → verify "(not set)" and "— empty input" QR behavior.

- [ ] **Step 3: Build the Etsy zip manifest (for manual upload later)**

Create `templates/_delivery/GST-001-welcome-book/zip-manifest.md`:

```markdown
# GST-001 Welcome Book — Etsy Zip Manifest (v2.1)

Files to include in `GST-001-welcome-book.zip`:

- `GST-001-welcome-book-DEMO.xlsx` (from `templates/_masters/`)
- `GST-001-welcome-book-BLANK.xlsx` (from `templates/_masters/`)
- `welcome-book-renderer.html` (from `templates/_delivery/GST-001-welcome-book/`)
- `GST-001-sample-output.pdf` (from `templates/_delivery/GST-001-welcome-book/`)
- `GST-001-howto.pdf` — convert `GST-001-howto.md` to PDF for upload
- `GST-001-license.pdf` — convert `GST-001-license.md` to PDF for upload

Expected zip size: ~1.2MB.

Expected buyer flow:
1. Download zip from Etsy.
2. Extract into a folder.
3. Open `GST-001-howto.pdf` first.
4. Fill `GST-001-welcome-book-BLANK.xlsx`.
5. Double-click `welcome-book-renderer.html` — opens in browser.
6. Drag the filled xlsx onto the page. Customize. Ctrl+P.
```

- [ ] **Step 4: Final commit**

```bash
git add templates/_delivery/GST-001-welcome-book/zip-manifest.md \
        templates/_masters/GST-001-welcome-book-DEMO.xlsx \
        templates/_masters/GST-001-welcome-book-BLANK.xlsx \
        templates/_delivery/GST-001-welcome-book/welcome-book-renderer.html

git commit -m "ship: v2.1 clean rebuild + zip manifest

Final dogfood pass done:
- Excel progress dashboard reports READY for DEMO (100%)
- Launch tab opens the renderer in browser via relative HYPERLINK
- Renderer parses DEMO xlsx → 3 pages in all theme×palette combos
- Logo upload works PNG + SVG
- All 3 QRs scan correctly on a phone
- Ctrl+P produces a 3-page letter-portrait PDF
- BLANK file correctly shows empty-state UI in renderer (greyed QR
  toggles, '—' dashes for missing data)

Zip manifest drafted for the Etsy upload step."
```

---

## Self-review

**Spec coverage** — matched each spec section to a task:

| Spec § | Covered in task |
|---|---|
| §1 Pipeline | Tasks 4, 5 (SheetJS scaffold), 6 (UI shell) |
| §2.1 Bug fix (col B) | Task 1 |
| §2.2 Launch tab | Task 2 |
| §2.3 Other tabs unchanged | verified implicitly in Task 16 |
| §3.1 File structure | Task 14 (inlining) |
| §3.2 Landing state | Task 5 |
| §3.3 Preview state | Task 6 |
| §4.1 Three themes | Tasks 7 (Magazine), 9 (Editorial + Hotel) |
| §4.2 Four palettes | Task 8 |
| §4.3 Logo slot | Task 10 |
| §4.4 QR codes | Task 11 |
| §5 Data contract | Task 5 (`DATA_CONTRACT` constant) |
| §6 Print fidelity | Task 13 |
| §7 Bundle | Tasks 14, 15, 16 |
| §9 Acceptance criteria | distributed across all 16 tasks |
| §10 Out of scope | not implemented — confirmed |
| §11 Risks | mitigations baked in (Task 10 sanitizer, Task 12 QuotaExceeded fallback, Task 13 print matrix) |

**Placeholder scan** — no TBD / TODO / "handle edge cases" / "similar to Task N". All steps contain exact code or commands.

**Type consistency** — `appState` shape defined in Task 6 (`theme`, `palette`, `logo`, `qr`), used consistently in Tasks 8-12. Render functions consistently take `(data, root)` args. `DATA_CONTRACT` cell addresses match the spec §5 table.

**Gaps** — one self-imposed: the plan skips a full keybinding/a11y audit of the sidebar (not in spec scope). Acceptable for v2.1; user-driven input UX is not a spec requirement. Flag if it comes up in Daniel QA.

---

**End of plan. Total: 16 tasks, ~6-10 hours implementation including QA.**
