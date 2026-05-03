# Product-Page Hero Brief — Multi-Property Master P&L

**SKU:** TAX-011  **Product page:** copy/product-pages/TAX-011-multi-property-master-pl.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `TAX-011-hero.png` + `TAX-011-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; the five property columns and "Schedule E" header band must remain visible.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Composition rationale:** This hero leans into the "tax season ends on time" feel — landscape printed page mockup of the Schedule E Multi tab, presented as if it just came off the printer onto a parchment desk.
**Background:** Parchment `#F6EFE2` full bleed, faint grain. The printed sheet floats with a 24px soft drop (10% opacity).
**Hero element:** Single 11×8.5" letter-size print mockup, LANDSCAPE, ~2° clockwise off-axis, showing the Schedule E Multi tab consolidated print.
- **Visible printed-sheet content:** Schedule E Multi print — top: Harbor Navy header band reading `SCHEDULE E · MULTI-PROPERTY · TAX YEAR 2026` (parchment text, JetBrains Mono 13pt tracked 0.22em). Below: 5-column table, one column per property: `LAKEHOUSE A · CREEK CABIN · PINE LOFT · RIDGE HOUSE · GLAMP SITE`. Rows visible (8): `Gross rents`, `Royalties`, `Advertising`, `Cleaning/Maint.`, `Insurance`, `Mgmt fees`, `Mortgage int.`, `Net income`. All figures JetBrains Mono 11pt graphite, banded with Parchment Alt. Bottom row: `Net income` row tinted Muted Gold at 18% with figures in mono Bold navy. Right-most column: `TOTAL` separated by a 1px gold vertical rule, with the consolidated Net at the bottom in Cormorant 500 Medium 24pt Harbor Navy. Footer line, italic 11pt graphite: `Generated 14 Mar 2026 · 1 of 1 · ready to attach.`
- **Sheet position:** centered horizontally, sheet centered at x: 800; sheet 1080×640px (landscape proportional 1.294:1), y: 130–770.
**Layered elements:**
- Pull-quote top-left, x: 80 y: 130 — see Copy.
- 48px × 1px Muted Gold rule under pull-quote at y: 200.
- Sub-line under rule at y: 240 — see Copy.
**Lighting:** soft top-left, even, 24px soft drop at 10% on the print sheet.
**Color blocking:** Parchment `#F6EFE2` ground (~50%); print-sheet warm-white `#FBF7EF` (~36%); Harbor Navy `#12304E` for header band + headline (~7%); Muted Gold `#C9A24B` for net-income tint + rule + vertical rule (~4%); Graphite `#2B2B2B` body (~3%).

## Copy overlays (if any)

**Pull-quote (top-left):** `Tax season ends on time.` · Cormorant Garamond 500 Medium, 30pt, Harbor Navy, gold terminal period. x: 80, y: 130.
**Sub-line (under rule):** `Five workbooks. Two LLCs. One Schedule E.` · Cormorant Garamond 400 Italic, 18pt, Graphite. x: 80, y: 240.

(Page H1 "Five workbooks. Two LLCs. One tax season that ends on time." is rendered separately. Do NOT duplicate — note the hero sub-line uses different phrasing on purpose.)

## Brand strip / SKU watermark

- Bottom-right (canvas, NOT sheet): `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850.
- Top-right (canvas, NOT sheet): `TAX-011 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- Print mockup: flat letter-size landscape paper mockup (no curl).
- Workbook screenshot: `templates/_masters/TAX-011-multi-property-master-pl-DEMO.xlsx → Schedule E Multi tab → print preview landscape at 100% zoom → screenshot the PDF render`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg`.

## Designer note

The make-or-break: the five property columns must all be visible at 800×450 mobile crop — if they sub-pixel, drop to 4 columns + TOTAL (5 columns total visible) rather than letting any column become illegible. The gold-tinted Net income row IS the moment — it's where "the CPA does not need to rebuild" pays off visually. NO STR Ledger marks on the printed sheet itself; chrome only.
