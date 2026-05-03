# Product-Page Hero Brief — RevPAR / ADR / Occupancy Dashboard

**SKU:** FIN-001  **Product page:** copy/product-pages/FIN-001-revpar-dashboard.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `FIN-001-hero.png` + `FIN-001-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; the giant RevPAR number is the first thing the eye lands on — anchor it in top half (y: 0–450).

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Background:** Parchment `#F6EFE2` full bleed, faint paper-grain. Chosen because the dashboard's iconic move is the editorial-magazine giant RevPAR number — parchment lets it breathe.
**Hero element:** MacBook mockup, head-on neutral angle, screen showing the Start tab (KPI overview).
- **Visible workbook content:** Start tab — eyebrow `PORTFOLIO · YTD REVPAR` JetBrains Mono 12pt navy tracked 0.22em centered above the giant number; the giant readout `$184` Cormorant 500 Medium 96pt Harbor Navy with gold terminal period (rendered as a gold dot under the dollar sign baseline); 36px Muted Gold rule beneath; below the rule a four-cell mini KPI strip `ADR $268 · OCC 69% · YoY +12% · COMP +8%` JetBrains Mono 16pt navy, banded with Parchment Alt. Bottom of screen: faint sparkline showing 12-month RevPAR trend in Muted Gold.
- **MacBook position:** centered horizontally, screen centered at x: 800; vertical anchor 40% from top (y: 130–700, mockup ~1140×570px). Lid open ~110°.
**Layered elements:**
- Pull-quote top-left, x: 80 y: 130 — see Copy.
- 48px × 1px Muted Gold rule under the pull-quote at y: 200.
- Inline glossary card bottom-left, x: 80 y: 760 — see Copy.
**Lighting:** soft top-left, even, 12px soft drop at 8%.
**Color blocking:** Parchment `#F6EFE2` ground (~76%); Harbor Navy `#12304E` for the giant `$184`, headline + workbook headers (~14%); Muted Gold `#C9A24B` for terminal period, sparkline, gold rule, eyebrow (~7%); Graphite `#2B2B2B` body (~3%).

## Copy overlays (if any)

**Pull-quote (top-left):** `Per available night.` · Cormorant Garamond 500 Medium, 32pt, Harbor Navy, gold terminal period. x: 80, y: 130.
**Glossary card (bottom-left):** `RevPAR — revenue per available night, regardless of occupancy.` · Cormorant Garamond 400 Italic, 16pt, Graphite `#2B2B2B`. x: 80, y: 760, max-width 520px.

(Page H1 "Are you winning per available night — or just charging more?" is rendered separately. Do NOT duplicate.)

## Brand strip / SKU watermark

- Bottom-right: `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850.
- Top-right: `FIN-001 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- MacBook mockup: Vista Create `minimal laptop mockup` (white bezel).
- Workbook screenshot: `templates/_masters/FIN-001-revpar-dashboard-DEMO.xlsx → Start tab → screenshot at 1600×1000, zoom 110%, ribbon hidden`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg`.

## Designer note

The `$184` is the visual hero — it must be bigger than the page H1 reads on screen. If at 800×450 mobile crop the dollar number reads less than 40px tall, the hero has failed. The italic glossary card is the editorial signature ("inline glossary cards in italic muted Cormorant" — page hero direction); keep it Cormorant 400 Italic, never Inter.
