# Product-Page Hero Brief — Owner Reporting Dashboard

**SKU:** PAM-001  **Product page:** copy/product-pages/PAM-001-owner-reporting-dashboard.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `PAM-001-hero.png` + `PAM-001-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; the printed Owner Statement must read as a polished print artifact even at thumb size.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Composition rationale:** This is the only SKU in the suite that uses a printed-page mockup instead of a MacBook (per page hero direction: "Full-bleed Owner Statement print preview"). The white-label angle requires NO STR Ledger marks on the printed sheet itself — only on the canvas chrome.
**Background:** Parchment `#F6EFE2` full bleed, faint grain. The printed sheet floats on parchment with a 24px soft drop shadow (10% opacity).
**Hero element:** Single 8.5×11" letter-size print mockup, portrait, tilted ~3° counter-clockwise, screen-printed with the Owner Statement.
- **Visible printed-sheet content:** Owner Statement print — top: a generic property-management logo placeholder (gray neutral mark, 80×80px, top-left of sheet) + the line `Prepared for: Catherine M. · 1206 Lakeview Cabin` (Cormorant 400 Italic 14pt graphite). Below: section header `Q1 2026 OWNER STATEMENT` JetBrains Mono 13pt navy tracked 0.22em. Body: a 6-row revenue/expense ledger (Inter 500 11pt navy labels, JetBrains Mono 11pt graphite figures) banded with Parchment Alt — `Gross revenue $24,820`, `Cleaning fees ($3,180)`, `Platform commission ($3,723)`, `Maintenance ($612)`, `Mgmt fee 20% ($3,461)`, `Net to owner $13,844`. Bottom of sheet: a single-line gold terminal — `Distribution: $13,844` Cormorant 500 Medium 28pt Muted Gold, gold rule beneath, italic 12pt graphite signature line `Statement generated DD MMM YYYY · 1 of 1.`
- **Sheet position:** centered horizontally, sheet centered at x: 800; sheet 580×750px (proportional to letter-size at 1:1.294), y: 80–830. Print sheet white = parchment-warm `#FBF7EF` (NOT pure white — too cold).
**Layered elements:**
- Pull-quote top-left, x: 80 y: 130, behind/beside the sheet — see Copy.
- 48px × 1px Muted Gold rule under pull-quote at y: 200.
- Sub-line under rule at y: 240 — see Copy.
**Lighting:** soft top-left, even, 24px soft drop at 10% on the print sheet.
**Color blocking:** Parchment `#F6EFE2` ground (~58%); print-sheet warm-white `#FBF7EF` (~28%); Harbor Navy `#12304E` for headline, sheet headers (~7%); Muted Gold `#C9A24B` for the Distribution figure + gold rule (~4%); Graphite `#2B2B2B` body (~3%).

## Copy overlays (if any)

**Pull-quote (top-left):** `One page. Forwarded to the CPA.` · Cormorant Garamond 500 Medium, 30pt, Harbor Navy, gold terminal period. x: 80, y: 130.
**Sub-line (under rule):** `White-label · printable · six owners in thirty minutes.` · Inter 400 Italic, 16pt, Graphite. x: 80, y: 240, max-width 600px.

(Page H1 "Owner statements your owners forward to their CPAs." is rendered separately. Do NOT duplicate.)

## Brand strip / SKU watermark

- Bottom-right (on the parchment canvas, NOT on the printed sheet): `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850.
- Top-right (canvas, NOT sheet): `PAM-001 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- Print mockup: a flat letter-size paper mockup (no curl, no stack) — render at 580×750px.
- Workbook screenshot: `templates/_masters/PAM-001-owner-reporting-dashboard-DEMO.xlsx → Owner Statement tab → print preview at 100% zoom → screenshot the PDF render`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg` (canvas chrome only — the printed sheet uses a generic placeholder mark).

## Designer note

The make-or-break: ZERO STR Ledger marks on the printed sheet itself. The placeholder logo on the sheet must read as "your brand goes here" — gray, neutral, slightly off-square. The faint annotation `Prepared for: Catherine M.` reinforces the white-label angle. The sheet's Distribution figure in Muted Gold is the only gold the printed page carries — and it must read at thumb size.
