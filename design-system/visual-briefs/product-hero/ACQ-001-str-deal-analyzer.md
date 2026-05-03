# Product-Page Hero Brief — STR Deal Analyzer

**SKU:** ACQ-001  **Product page:** copy/product-pages/ACQ-001-str-deal-analyzer.md  **Status:** Production-ready

**Output specs:** 1600 × 900 PNG, < 500KB compressed, sRGB. Naming: `ACQ-001-hero.png` + `ACQ-001-hero@2x.png` (3200×1800).
**Mobile crop test:** must read at 800 × 450; anchor MacBook + verdict pill in top 2/3 (y: 0–600).

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono.

---

## Composition

**Background:** Parchment `#F6EFE2` full bleed with subtle paper-grain texture (5% noise overlay max). Chosen because the page H1 carries the navy weight already — hero needs to feel calm, editorial, like opening a clean ledger.
**Hero element:** MacBook mockup, ~5° clockwise off-axis (right side slightly forward), screen showing the Verdict tab.
- **Visible workbook content:** Verdict tab — gold "✅ DEAL" pill (Muted Gold fill, parchment text, Cormorant 500 36pt) at top of screen, six metric rows beneath in JetBrains Mono 22pt navy: `Cash-on-Cash 10.0%`, `DSCR 1.41`, `Cap Rate 6.8%`, `IRR 14.2%`, `Break-even Occ 41%`, `Stabilized Net $18,400`. Below the rows, a 3-column stress-test mini-grid (`Base · Down-10% · Stress`) with Parchment Alt banding and one red cell visible in the Stress column.
- **MacBook position:** centered horizontally, screen centered at x: 800; vertical anchor 38% from top (y: 130–680, mockup ~1080×550px). Lid open ~110°.
**Layered elements:**
- Pull-quote, top-left, x: 80 y: 110 — see Copy overlays.
- Thin 48px × 1px Muted Gold rule under the pull-quote at y: 200.
- Faint Parchment Alt `#EFE5D0` rectangle behind the MacBook (1240×620px, x: 180 y: 110, 4px corner radius) to lift the laptop off the parchment without breaking the calm.
**Lighting:** soft, top-left, even — laptop screen self-lit at 100%, no harsh bezel reflections, no cast shadow beyond a 12px soft drop at 8% opacity.
**Color blocking:** Parchment `#F6EFE2` ground (~78%); Harbor Navy `#12304E` for headline + workbook header rows visible on screen (~12%); Muted Gold `#C9A24B` for the DEAL pill, terminal period, gold rule (~6%); Graphite `#2B2B2B` for body type (~3%); one Parchment Alt block (~1%).

## Copy overlays (if any)

**Pull-quote (top-left):** `Stress-tested before you sign.` · Cormorant Garamond 500 Medium, 32pt, Harbor Navy `#12304E`, terminal period in Muted Gold. Position x: 80, y: 110.
**Number callout (bottom-left, below MacBook):** `✅ DEAL · Stabilized $18,400` · JetBrains Mono Bold, 18pt, Harbor Navy, tracking 0.18em. Position x: 80, y: 760.

(Page H1 "Yes-or-no on a property in 10 minutes." is rendered separately by the page — do NOT duplicate.)

## Brand strip / SKU watermark

- Bottom-right: small Ledger wordmark `The STR Ledger.` Cormorant 18pt, Harbor Navy, gold terminal period, 24px right padding, y: 850. Opacity 100%.
- Top-right: `ACQ-001 · v1.0` JetBrains Mono 11pt, Muted Gold `#C9A24B`, tracking 0.20em, x: 1500 y: 40.

## Reference asset paths

- MacBook mockup: Vista Create `minimal laptop mockup` (white bezel) per `brand/canva-specs.md` §Asset 3 mockup guidance.
- Workbook screenshot: `templates/_masters/ACQ-001-str-deal-analyzer-DEMO.xlsx → Verdict tab → screenshot at 1600×1000, zoom 110%, hide Excel ribbon, gridlines off outside data range`.
- Logo asset: `brand/assets/wordmark-on-parchment.svg` (or fallback Cormorant text wordmark).

## Designer note

The "✅ DEAL" pill is the make-or-break element — it must be Muted Gold `#C9A24B`, never bright yellow, and the checkmark must be the same gold (not green). If the pill shrinks below 14px-equivalent at 800×450 mobile crop, scale the pill up at the cost of cropping the lower stress-test grid — verdict legibility beats data density.
