# GST-001 Welcome Book v2.2 — Safety & Disclosures Tab (Design)

**Status:** Draft v1 — awaiting user review
**Date:** 2026-04-25
**Author:** Daniel Harrison (via NotebookLM gap analysis on `Short-Term Rental Finances & Requirements (Airbnb/Vrbo)` corpus)
**Parent specs:**
- [2026-04-24-welcome-book-v2.1-hybrid-renderer.md](./2026-04-24-welcome-book-v2.1-hybrid-renderer.md) — v2.1 renderer (shipped, merge commit `a78238c`)
**Brand lock:** [brand/brand-decisions.md](../../../brand/brand-decisions.md)
**Keeps from v2.1:** every tab, every renderer feature, every theme. v2.2 is purely additive.

---

## 0. Executive summary

A NotebookLM scan of the STR finance/regulation corpus surfaced four welcome-book items the v2.1 tool has no home for:

1. **Recording-device disclosure** (cameras, doorbell cams, noise monitors). **Required** by Airbnb's Host Standards. Omitting the field is a policy and liability gap.
2. **Fire safety locations** — extinguisher, smoke alarm, CO alarm placement.
3. **Evacuation routes** — two-ways-out posting, fire escape map.
4. **Hazard callouts** — trip/fall, low ceiling, child-proofing.

A fifth gap — **backup host contact** for when the primary host is unreachable — surfaced from the same audit and pairs naturally with the safety theme.

v2.2 adds a single new tab, **`Safety & Disclosures`**, with five inputs (B8-B13). The renderer reads them and emits a "Safety & House Disclosures" block on page 3 alongside Emergency in all three themes. No other tab changes. No renderer architecture changes.

**Why a separate tab, not free-form text in `House Rules!B14`:**
- Disclosure language needs to be findable by guests (search engines, listing scrapers, regulators). Structured fields beat opaque prose.
- Airbnb's recording-device disclosure rule is a *policy compliance* item, not a *house rule* item.
- The safety items are a coherent unit; bundling them keeps the renderer's safety block tight.
- Buyers can leave fields blank — empty fields suppress their renderer rows (per the v2.1 empty-state convention), so a host with no cameras and no specialized hazards still gets a clean output.

**Positioning:** v2.1 sold "a branded guest book that prints to PDF." v2.2 sells the same with **"meets Airbnb's recording-device disclosure rule out of the box."** That phrase belongs in the next Etsy bullet.

**Scope for this design:** GST-001 v2.2 only. ~2-3 hours implementation.

---

## 1. What v2.2 changes

### 1.1 — New Excel tab: `Safety & Disclosures`

Inserted between **Departure** and **Emergency** (so the Start dashboard's section list reads safety→emergency in the natural reading order). Tab numbers shift: Emergency moves from ⑧ to ⑨; Launch/Bonus/Host Notes stay at the right end.

**v2.2 tab order:**

```
Start · Property · Arrival · WiFi+Tech · House Rules · Local Guide · Trash · Departure · Safety & Disclosures · Emergency · Launch · Bonus · × Host Notes
```

The new tab follows v2.1's input-tab template exactly (column-B input flow, section_header_band rows 1-5, instruction strip row 6, section banner row 7, inputs B8 onward). No new building blocks needed in `brand_config.py`.

### 1.2 — Renderer changes

`renderer.js`:
- Add `"Safety & Disclosures": ["B8","B9","B10","B11","B12","B13"]` to `DATA_CONTRACT`.
- Add a `renderSafetyBlock(data, root)` helper invoked from each theme's render function on page 3, immediately above the `.emergency` block.
- Empty fields suppress their bullet (matches the v2.1 empty-state convention via `orDash` — but for safety, render the row only if the value is non-empty rather than showing `—`).

`themes/{magazine,editorial,hotel}.css`:
- Each theme adds a `.safety-block` rule consistent with its existing visual language. Magazine uses a card; Editorial a typographic section; Hotel a centered ornamental section. ~10-15 lines of CSS per theme.

`Start` tab readiness dashboard (built in `build_welcome_book_v2.py`):
- Section list grows from 8 to 9 (add row for "⑨ Safety & Disclosures, B8:B13").
- COUNTA range for the new tab: `'Safety & Disclosures'!B8:B13`. Total fields: 6.
- Required-field check (red flags): add `'Safety & Disclosures'!B8` (recording devices). The other 4 stay optional.

`copy/etsy-listings/GST-001-welcome-book.md`:
- Add one bullet: "Built-in recording-device disclosure — meets Airbnb's Host Standards out of the box, no separate paperwork."
- Optional second bullet: "Fire safety + evacuation guidance section, because the welcome book is the last thing guests read before something goes wrong."

`GST-001-howto.md`:
- Step 1 list grows to mention the Safety & Disclosures tab.

### 1.3 — Build pipeline

A `build_safety_disclosures_tab(wb, variant)` function in `build_welcome_book_v2.py`, called from the master `build_workbook` orchestration. Pattern: copy `build_house_rules_tab` (closest analog — flat input list, no formulas).

DEMO sample data lives in `SAMPLE["Safety & Disclosures"]`. Suggested values:

```python
SAMPLE["Safety & Disclosures"] = {
    "recording_devices": (
        "Doorbell camera at front entry (records 30s clips on motion). "
        "Driveway floodlight cam covers the gravel lot. "
        "No cameras inside the cabin."
    ),
    "alarm_locations": (
        "Smoke alarms in each bedroom + the upstairs hallway. "
        "Combo smoke/CO alarm in the living room."
    ),
    "extinguisher_location": (
        "Kitchen — under the sink. ABC-class, 2.5lb."
    ),
    "evacuation_notes": (
        "Two ways out of every bedroom: the door and the window. "
        "Front door is the primary route; back porch slider is secondary. "
        "Meet at the gravel turnaround at the end of the driveway."
    ),
    "hazards": (
        "Loft stairs are steep — keep small kids off without a parent. "
        "Wood-burning stove is OFF for guest stays; do not use. "
        "Hot tub: 104°F max, no diving, kids must be supervised."
    ),
    "backup_contact": (
        "Co-host: Sam Patel · 555-555-0144"
    ),
}
```

BLANK gets empty strings.

---

## 2. Data contract

### 2.1 — Cell map

| Cell | Field | Required? | Notes |
|---|---|---|---|
| `B8`  | `recording_devices`     | **Yes** | Airbnb policy compliance. Empty value flags red on Start dashboard. |
| `B9`  | `alarm_locations`       | No (recommended) | Smoke + CO. Multiline OK. |
| `B10` | `extinguisher_location` | No (recommended) | Single short line is fine. |
| `B11` | `evacuation_notes`      | No (recommended) | Two-ways-out + meeting point. |
| `B12` | `hazards`               | No (recommended) | Trip/fall, low ceiling, amenity safety, child-proofing. |
| `B13` | `backup_contact`        | No | Co-host name + phone. Renders next to primary host phone. |

### 2.2 — Renderer access pattern

```javascript
const S = data["Safety & Disclosures"] || {};
// then S.B8, S.B9, ...
```

(matches the v2.1 convention for `data.Property`, `data.Arrival`, etc.)

---

## 3. Tab layout (Excel side)

Mirrors `House Rules` exactly — 6 input rows, label in column A, value merged across B-L, no formulas.

```
Row 1-5  : section_header_band ("⑨ SAFETY & DISCLOSURES")
Row 6    : instruction strip ("Disclose required items, then fill what applies.")
Row 7    : section banner ("Disclosure first, then safety locations.")
Row 8    : Recording devices              | (input — REQUIRED)
Row 9    : Smoke + CO alarm locations     | (input)
Row 10   : Fire extinguisher location     | (input)
Row 11   : Evacuation route notes         | (input)
Row 12   : Known hazards                  | (input)
Row 13   : Backup host contact            | (input)
Row 14-15: footer (← BACK / NEXT → buttons, matching v2.1 sibling tabs)
```

`B8` gets the same red-flag conditional formatting v2.1 applies to required fields (`Property!B8`, `WiFi+Tech!B8`, `Trash!B8`, etc. — see v2.1 spec §7.3).

`A8` label uses a slightly different visual treatment to draw attention to the disclosure: bold + the brand's "required" red dot prefix that v2.1 already uses elsewhere.

---

## 4. Renderer integration

### 4.1 — Where it lands

Page 3 of every theme. Order on page 3 becomes:

1. Trash & Maintenance (existing)
2. Checkout (existing)
3. **Safety & House Disclosures** (NEW)
4. Emergency (existing)

Rationale: safety reads naturally as the bridge between "what you do during the stay" (Trash, Checkout) and "what you do in an emergency" (Emergency).

### 4.2 — Block structure

Common HTML emitted by `renderSafetyBlock(data, root)`, regardless of theme:

```html
<div class="safety-block">
  <h3 class="section">Safety & House Disclosures</h3>
  <dl class="facts">
    <!-- Each row only renders if the corresponding cell is non-empty -->
    <dt>Recording devices on the property:</dt><dd>{S.B8}</dd>
    <dt>Smoke + CO alarms:</dt><dd>{S.B9}</dd>
    <dt>Fire extinguisher:</dt><dd>{S.B10}</dd>
    <dt>If you need to evacuate:</dt><dd>{S.B11}</dd>
    <dt>Things to know:</dt><dd>{S.B12}</dd>
    <dt>Backup host contact:</dt><dd>{S.B13}</dd>
  </dl>
</div>
```

If **all six** values are empty (rare — at minimum B8 is required and most hosts will fill alarms), suppress the block entirely (no empty heading).

### 4.3 — Per-theme styling notes

- **Magazine:** wrap in `.card` with a tinted background; the recording-devices row gets the `var(--accent)` underline treatment used for emphasis fields. Include an inline icon (eye/camera) before the recording-devices `dt` for visual scanability.
- **Editorial:** plain `dl.facts` styling matches the rest of the page; add a 1px rule above the block for separation. No icons (Editorial is typography-only by spec).
- **Hotel:** centered `.subhead` band reading "DISCLOSURES" above the `h3.section`, matching the Hotel theme's existing band convention.

### 4.4 — Print fidelity

The block adds ~1.5–2 inches of vertical space on page 3. The v2.1 print CSS (`@page Letter portrait, 0.5in margins`) already sized page 3 for the Trash + Checkout + Emergency triad with margin to spare. With the Safety block added, page 3 may overflow into a 4th page in pathological cases (very long hazard text, very long evacuation notes).

**Mitigation strategy** (in priority order):
1. The renderer truncates fields longer than a configurable max (e.g., 240 chars per field) with a "…see posted notice" suffix.
2. The Hotel theme's centered, ornamental block has the most vertical waste — tightening its `.subhead` margin recovers ~6mm.
3. If overflow still occurs, the print CSS gets a `.safety-block { page-break-inside: avoid }` rule, accepting that some hosts will see Safety push to page 4. A 4-page welcome book is still acceptable.

The implementation plan must include a print QA matrix entry: "Page count with maximum-length safety field values."

---

## 5. Acceptance criteria

The v2.2 build is "done" when:

1. **Build:** `python build_welcome_book_v2.py` produces DEMO + BLANK xlsx with 9 input tabs (was 8). DEMO has SAMPLE values for all 6 Safety fields. BLANK leaves them empty.
2. **Excel readiness:** Start dashboard's section list shows 9 rows, including "⑨ Safety & Disclosures · 0/6" (BLANK) or "⑨ Safety & Disclosures · 6/6 · READY" (DEMO).
3. **Excel red flags:** dropping the recording-devices field on a filled BLANK leaves Launch tab in a non-READY state with "Recording devices not disclosed" in the Red Flags card.
4. **Renderer parses:** dropping DEMO onto `welcome-book-renderer.html` shows the Safety & House Disclosures block on page 3 of all three themes.
5. **Empty-state:** dropping BLANK shows the Safety block heading suppressed entirely (no orphan heading).
6. **Partial-state:** dropping a hand-edited file with only B8 filled (recording devices only) renders only that one row under the Safety heading.
7. **Print:** `Ctrl+P` produces a 3-page (or 4-page in overflow case) PDF. Safety block visually integrated, not floating awkwardly.
8. **Bundle:** `build-renderer.py` rebuilds `welcome-book-renderer.html` byte-identically when re-run (reproducibility maintained).
9. **Etsy copy:** new disclosure-compliance bullet present.
10. **How-to:** Step 1 list mentions Safety & Disclosures tab.

---

## 6. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Recording-devices wording doesn't satisfy a regulator's reading of Airbnb policy | low | high | Tab description copy reviews with a quick legal pass; field placeholder text mirrors Airbnb's own example phrasing. |
| Page 3 overflows to page 4 | medium | low | Per §4.4 — truncation + page-break-inside fallback. |
| Tab insertion breaks v2.1 user's existing files | n/a | n/a | v2.1 buyers haven't shipped yet. v2.2 supersedes v2.1 cleanly before listing. |
| Buyers think the new tab is mandatory and feel forced | low | low | Only B8 is required. Tab description explicitly says "fill what applies — empty rows are skipped in the printed book." |
| The five non-required fields sit blank in 80% of buyers, making the tab feel like vapor | medium | low | Acceptable — even the recording-devices disclosure alone justifies the tab. The other fields are insurance for hosts who do have hot tubs / detached rentals / etc. |

---

## 7. Out of scope

- **A separate "Disclosures" PDF.** The disclosure lives in the welcome book, not in a standalone document. (Could revisit in v2.3 if a buyer specifically asks.)
- **Multi-language disclosures.** v2.x is English-only.
- **Per-region disclosure templates** (CA / NY / EU / UK have distinct rules). Out of scope; the field accepts free text and the placeholder copy aims at the Airbnb policy baseline.
- **Photo support inside the Safety block.** No image input slots — fire-escape diagrams stay in posted notices on the wall, not in the rendered PDF. Could revisit if buyers ask.
- **Auto-generated evacuation map from a floor plan.** Out of scope. Free-text-only.
- **Insurance-rider integration.** STR insurance forms are a separate product (TAX-008 candidate).

---

## 8. Plan handoff notes

When you're ready to implement, hand the next session:

> Resume Welcome Book v2.2 — write a plan from `docs/superpowers/specs/2026-04-25-welcome-book-v2.2-safety-disclosures.md` using `superpowers:writing-plans`. Then execute via Subagent-Driven Development (lighter touch — skip code-quality review for mechanical tasks). Branch from `main` at `a78238c`.

Estimated scope: 5–7 implementation tasks.

1. Add `build_safety_disclosures_tab` and wire into orchestration.
2. Update `Start` readiness dashboard ranges.
3. Update `Launch` red-flag check for the required field.
4. Add `renderSafetyBlock` + per-theme CSS.
5. Add demo sample data + regenerate `demo-data.json`.
6. Update Etsy copy + how-to.
7. Rebuild single-file renderer + sample PDF + dogfood pass.

---

**End of design.**
