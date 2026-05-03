# Product-Page Hero Brief — Listing SEO Audit

**SKU:** MKT-001  **Product page:** copy/product-pages/MKT-001-listing-seo-audit.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `MKT-001-hero.png` + `MKT-001-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; the `67/100` score and at least three colored audit rows must remain visible.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Background:** Parchment `#F6EFE2` full bleed, faint grain. Chosen so the audit's red/gold/parchment conditional formatting reads cleanly against a neutral ground.
**Hero element:** MacBook mockup, ~5° clockwise off-axis, screen showing the Audit Score tab.
- **Visible workbook content:** Audit Score tab — top header band (Harbor Navy fill, parchment text) reading `LISTING SEO AUDIT · 40 CRITERIA`; right-aligned in the band, the score readout `67/100` Cormorant 500 Medium 38pt Muted Gold. Below the band, a 9-row sample of audit criteria with same-row fix columns: 3 rows tinted Clay Rose `#B5725E` at 18% (RED — fail), 3 rows tinted Muted Gold at 18% (GOLD — partial), 3 rows tinted Parchment Alt (PASS). Each row: criterion name (Inter 500 13pt navy, left col) + status pill (mono 11pt) + same-row fix copy (Inter 400 12pt graphite). Visible criteria: `Title length`, `Photo order`, `Amenity count`, `Response time`, `Cancellation policy`.
- **MacBook position:** right-anchored, screen centered at x: 1020; vertical anchor 38% from top (y: 130–680, mockup ~1080×550px). Lid open ~108°.
**Layered elements:**
- Pull-quote top-left, x: 80 y: 130 — see Copy.
- 48px × 1px Muted Gold rule under pull-quote at y: 200.
- Italic muted callout under the rule at y: 240 — see Copy.
**Lighting:** soft top-left, even, 12px soft drop at 8%.
**Color blocking:** Parchment `#F6EFE2` ground (~70%); Harbor Navy `#12304E` headers + headline (~12%); Muted Gold `#C9A24B` for score, rule, gold-tint rows (~9%); Clay Rose `#B5725E` only as 18% row tint on 3 rows (~5% — flags the "fix the right things" pain); Graphite `#2B2B2B` body (~4%).

## Copy overlays (if any)

**Pull-quote (top-left):** `Score the listing.` · Cormorant Garamond 500 Medium, 32pt, Harbor Navy, gold terminal period. x: 80, y: 130.
**Italic callout (under rule):** `Real listings score 60–75%.` · Cormorant Garamond 400 Italic, 18pt, Graphite `#2B2B2B`. x: 80, y: 240.

(Page H1 "Score your Airbnb listing. Fix the right things." is rendered separately. Do NOT duplicate.)

## Brand strip / SKU watermark

- Bottom-right: `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850.
- Top-right: `MKT-001 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- MacBook mockup: Vista Create `minimal laptop mockup` (white bezel).
- Workbook screenshot: `templates/_masters/MKT-001-listing-seo-audit-DEMO.xlsx → Audit Score tab → screenshot at 1600×1000, zoom 110%, ribbon hidden`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg`.

## Designer note

The Clay Rose row tints push to 18% — at 3% per brand rule we'd lose the "FAIL" semantic. This is one of the documented exceptions where Clay Rose carries audit semantics (per the audit workbook's design pattern); keep total Clay Rose surface ≤ 6% of the canvas. The `67/100` score must read at 800×450 — if it sub-pixels, scale the Audit Score header band, not the score number.
