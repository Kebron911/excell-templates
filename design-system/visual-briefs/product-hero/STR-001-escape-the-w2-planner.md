# Product-Page Hero Brief — Escape the W2 Planner

**SKU:** STR-001  **Product page:** copy/product-pages/STR-001-escape-the-w2-planner.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `STR-001-hero.png` + `STR-001-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; both quit dates and the spread italic must remain visible.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Composition rationale:** Calmer than the suite default. More parchment, less navy, no Clay Rose. The brief says "calm authority, no hype" — the hero should feel like sitting down at a kitchen table, not pitching a deal.
**Background:** Parchment `#F6EFE2` full bleed, faint grain. Slightly more breathing room above and below the laptop than other heroes (140px top, 220px bottom).
**Hero element:** MacBook mockup, head-on neutral angle, screen showing Quit Date Calculator tab (Start tab variant).
- **Visible workbook content:** Quit Date Calculator tab — slim Harbor Navy header band reading `QUIT DATE CALCULATOR · OPTIMISTIC + CONSERVATIVE`. Below the band, two date readouts stacked (NOT side-by-side — stacked reads calmer):
  - Line 1: eyebrow `OPTIMISTIC` JetBrains Mono 11pt Muted Gold tracked 0.22em; below it `November 14, 2030` Cormorant 500 Medium 32pt Muted Gold `#C9A24B`.
  - 24px Muted Gold rule, centered, between the two.
  - Line 2: eyebrow `CONSERVATIVE` JetBrains Mono 11pt Harbor Navy tracked 0.22em; below it `April 22, 2032` Cormorant 500 Medium 28pt Harbor Navy.
  - Spread line beneath both: `1 year, 8 months.` Cormorant 400 Italic 18pt Graphite, centered.
- Below the date block, a 4-cell critical-numbers strip (Inter 500 12pt navy labels, mono 14pt graphite figures): `Bills $4,200/mo · Healthcare bridge $980/mo · Net per door $740 · Doors needed 9`.
- **MacBook position:** centered horizontally, screen centered at x: 800; vertical anchor 42% from top (y: 160–680, mockup ~1080×520px). Lid open ~108°. Slightly smaller than other heroes — calmer presence.
**Layered elements:**
- Pull-quote top-left, x: 80 y: 140 — see Copy.
- 48px × 1px Muted Gold rule under pull-quote at y: 210.
- Sub-line under rule at y: 250 — see Copy.
**Lighting:** soft top-left, even, 12px soft drop at 6% (lighter than other heroes).
**Color blocking:** Parchment `#F6EFE2` ground (~84% — heaviest parchment surface in the suite); Harbor Navy `#12304E` for headline + conservative date + header band (~9%); Muted Gold `#C9A24B` for optimistic date + rule + eyebrow (~5%); Graphite `#2B2B2B` body (~2%). NO Clay Rose anywhere.

## Copy overlays (if any)

**Pull-quote (top-left):** `When can you actually quit?` · Cormorant Garamond 500 Medium, 30pt, Harbor Navy, gold terminal period (the period replaces the question mark in the H1 — but the page renders the H1 with a "?", so the hero pull-quote is a slight rephrase: keep the period for visual calm).

Actually use: `The honest spread.` · Cormorant Garamond 500 Medium, 30pt, Harbor Navy, gold terminal period. x: 80, y: 140. (This avoids duplicating page H1 entirely.)

**Sub-line (under rule):** `Optimistic. Conservative. The conversation you've been avoiding.` · Cormorant Garamond 400 Italic, 16pt, Graphite. x: 80, y: 250, max-width 580px.

(Page H1 "When can you actually quit?" is rendered separately. Do NOT duplicate.)

## Brand strip / SKU watermark

- Bottom-right: `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850.
- Top-right: `STR-001 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- MacBook mockup: Vista Create `minimal laptop mockup` (white bezel).
- Workbook screenshot: `templates/_masters/STR-001-escape-the-w2-planner-DEMO.xlsx → Quit Date Calculator (or Start) tab → screenshot at 1600×1000, zoom 110%, ribbon hidden`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg`.

## Designer note

This is the calmest hero in the suite — no Clay Rose, more parchment, smaller laptop, lighter shadow. The two dates carry the visual weight; gold for OPTIMISTIC, navy for CONSERVATIVE — that color asymmetry IS the spread. Do not center the dates in matching colors "for balance" — the asymmetric color is the brand's "honest spread" voice. The italic spread line is editorial, not data — keep it Cormorant Italic.
