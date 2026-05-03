# Product-Page Hero Brief — Rental Arbitrage Analyzer

**SKU:** ACQ-003  **Product page:** copy/product-pages/ACQ-003-rental-arbitrage-analyzer.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `ACQ-003-hero.png` + `ACQ-003-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; anchor verdict pill + Y1/stabilized/stress numbers in top 2/3.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Composition rationale:** Split panel — Harbor Navy left third (legal/serious tone matching the "for operators, not gurus" voice + the legal-review note on the page), Parchment right two-thirds with the MacBook. The split signals seriousness without yelling.
**Background:** Left third (x: 0–520) Harbor Navy `#12304E`; right two-thirds (x: 520–1600) Parchment `#F6EFE2`. Hard vertical split (no gradient).
**Hero element:** MacBook mockup, ~3° clockwise off-axis, screen showing Start tab.
- **Visible workbook content:** Start tab — Harbor Navy header band reading `RENTAL ARBITRAGE · MASTER LEASE`; gold "✅ DEAL" pill (Muted Gold fill, parchment text, Cormorant 500 30pt); three-row mono readout: `Y1 Cash Flow · $340`, `Stabilized · $1,420`, `Stress (worst) · -$80` (the negative cell tinted faint Clay Rose `#B5725E` at 12% to flag the stress fail). Below, a one-line note `MTR Fallback: $980/mo · breaks even`.
- **MacBook position:** centered in the parchment area, screen centered at x: 1060; vertical anchor 38% from top (y: 130–680, mockup ~960×540px). Lid open ~108°.
**Layered elements:**
- Pull-quote in the navy panel (left), x: 60 y: 280, parchment text — see Copy.
- 48px × 1px Muted Gold rule in navy panel at y: 380.
- Eyebrow at top of navy panel: `MASTER LEASE · OPERATOR-GRADE` JetBrains Mono 11pt, Muted Gold, tracking 0.22em, x: 60 y: 200.
**Lighting:** soft top-right (light from the parchment side spilling onto the laptop), 12px soft drop at 8%.
**Color blocking:** Harbor Navy `#12304E` left panel (~25%); Parchment `#F6EFE2` right panel (~63%); Muted Gold `#C9A24B` for verdict pill, gold rule, eyebrow (~6%); Graphite `#2B2B2B` workbook body (~4%); Clay Rose `#B5725E` only as a 12% tint on the stress-fail cell (~2% — under the 3% rule).

## Copy overlays (if any)

**Pull-quote (navy panel, left):** `Through Year 2.` · Cormorant Garamond 500 Medium, 36pt, Parchment `#F6EFE2`, gold terminal period. Position x: 60, y: 290.
**Sub-line beneath rule:** `Stress the rent escalator. Model the MTR fallback.` · Inter 400 Italic, 16pt, Parchment Alt `#EFE5D0`, x: 60, y: 410.

(Page H1 "Will the arbitrage numbers actually work — through Year 2?" is rendered separately. Do NOT duplicate.)

## Brand strip / SKU watermark

- Bottom-right (parchment side): `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850.
- Top-right (parchment side): `ACQ-003 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- MacBook mockup: Vista Create `minimal laptop mockup` (white bezel).
- Workbook screenshot: `templates/_masters/ACQ-003-rental-arbitrage-analyzer-DEMO.xlsx → Start tab → screenshot at 1600×1000, zoom 110%, ribbon hidden`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg`.

## Designer note

The Clay Rose stress-fail cell is the differentiator vs. ACQ-001 — DO NOT replace it with the standard parchment-alt banding. That single tinted cell is the visual proof that this workbook tells you when the deal fails. Keep the rose tint at 10–15% — any hotter and it signals "alarm" instead of "operator caution."
