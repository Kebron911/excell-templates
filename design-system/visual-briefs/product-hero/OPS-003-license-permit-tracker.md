# Product-Page Hero Brief — License/Permit/STR-Reg Tracker

**SKU:** OPS-003  **Product page:** copy/product-pages/OPS-003-license-permit-tracker.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `OPS-003-hero.png` + `OPS-003-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; the EXPIRED row (Clay Rose) and the 22-day GOLD row must both remain visible.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Background:** Parchment `#F6EFE2` full bleed, faint grain. Chosen for the "open it once a quarter" calm tone — this is a checklist hero, not an alarm hero.
**Hero element:** MacBook mockup, ~5° clockwise off-axis, screen showing Renewal Calendar tab.
- **Visible workbook content:** Renewal Calendar tab — Harbor Navy header band reading `RENEWAL CALENDAR · MULTI-CITY`; columns `Property · City · Permit Type · Status · Days to renew`. Row 1 tinted Clay Rose `#B5725E` at 22% — `Creek Side STR · Nashville · STR Permit · EXPIRED · -3 days` (mono 14pt navy, "EXPIRED" in mono bold red-leaning). Row 2 tinted Muted Gold at 18% — `Lakehouse A · Gatlinburg · Business License · DUE · 22 days`. Row 3 Parchment Alt — `Pine Loft · Asheville · STR Permit · OK · 87 days`. Row 4 Parchment Alt — `Ridge House · Austin · Tax Cert · OK · 134 days`. Bottom of screen: faint top-15-city reference strip in JetBrains Mono 11pt, tracked 0.20em, parchment-tinted.
- **MacBook position:** centered horizontally, screen centered at x: 800; vertical anchor 38% from top (y: 130–680, mockup ~1140×550px). Lid open ~110°.
**Layered elements:**
- Pull-quote top-left, x: 80 y: 130 — see Copy.
- 48px × 1px Muted Gold rule under pull-quote at y: 200.
- Sub-line under rule at y: 240 — see Copy.
**Lighting:** soft top-left, even, 12px soft drop at 8%.
**Color blocking:** Parchment `#F6EFE2` ground (~73%); Harbor Navy `#12304E` header band + headline (~11%); Muted Gold `#C9A24B` for rule + gold-soft row (~7%); Clay Rose `#B5725E` 22% tint on EXPIRED row (~4%); Graphite `#2B2B2B` body (~5%).

## Copy overlays (if any)

**Pull-quote (top-left):** `Open it once a quarter.` · Cormorant Garamond 500 Medium, 32pt, Harbor Navy, gold terminal period. x: 80, y: 130.
**Sub-line (under rule):** `Days-to-renewal countdown · expired-while-operating banner.` · Inter 400 Italic, 16pt, Graphite. x: 80, y: 240, max-width 600px.

(Page H1 "A $750 fine waiting for the renewal you forgot." is rendered separately. Do NOT duplicate.)

## Brand strip / SKU watermark

- Bottom-right: `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850.
- Top-right: `OPS-003 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- MacBook mockup: Vista Create `minimal laptop mockup` (white bezel).
- Workbook screenshot: `templates/_masters/OPS-003-license-permit-tracker-DEMO.xlsx → Renewal Calendar tab → screenshot at 1600×1000, zoom 110%, ribbon hidden`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg`.

## Designer note

The EXPIRED row is the make-or-break — at 800×450 mobile crop, the word "EXPIRED" must be readable. Use Clay Rose tint, NOT a saturated red — brand rule (no auxiliary alarm colors). The "-3 days" in JetBrains Mono Bold reinforces "you are operating illegally right now" without screaming. DO NOT include actual fine figures in the screenshot — those are pending fact-check on the page.
