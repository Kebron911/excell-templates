# Vista Create Design Specs — The STR Ledger
**Version:** 1.0 — 2026-04-22
**Status:** Authoritative. All palette values sourced from `brand/brand-decisions.md` (locked v1).
**Note on filename:** This file is named `canva-specs.md` for consistency with plan references. All instructions inside reference **Vista Create** (https://create.vista.com/).

---

## Palette Quick-Reference

| Token | Hex | Role |
|---|---|---|
| Harbor Navy | `#12304E` | Primary — hero backgrounds, top/bottom strips, primary type on parchment |
| Parchment | `#F6EFE2` | Paper — main area backgrounds, body copy backgrounds |
| Muted Gold | `#C9A24B` | Accent — period-mark, rules, highlighted labels, badge fills |
| Clay Rose | `#B5725E` | Warmth — secondary accent, sparingly on highlight elements |
| Graphite | `#2B2B2B` | Ink — body copy on parchment, secondary text |
| Parchment Alt | `#EFE5D0` | Alternate row tint — subtle card backgrounds |
| Navy Tint | `#2A4867` | Hover-state navy — secondary navy element fill |

---

## Typography Quick-Reference

| Role | Typeface | Weight |
|---|---|---|
| Display / Logo | Cormorant Garamond | 400 Italic (for "The"), 500 Medium (for "STR Ledger") |
| Body / UI | Inter | 400 Regular, 500 Medium, 600 Semibold |
| Mono / Labels / URLs | JetBrains Mono | 400 Regular, 500 Medium |

> **Vista Create font note:** Search "Cormorant Garamond" in Vista Create's font picker — it appears under Google Fonts. Inter and JetBrains Mono are also available. If JetBrains Mono is absent, substitute Courier Prime (also available in Vista Create).

---

## Build Order

Execute in this sequence — each asset depends on the ones before it:

1. **Brand Kit** (one-time setup, not an asset) — configure first so fonts and colors are available in every design
2. **Logo — Square variant** (1000×1000) — foundational; other assets reference it
3. **Logo — Horizontal variant** (2000×500) — derived from square logo
4. **Thumbnail Master** (2000×2000) — most critical; all 25 per-product thumbnails clone this template
5. **Etsy Shop Banner** (1600×213) — references logo wordmark
6. **Etsy Shop Icon** (500×500) — references monogram
7. **Excel Cover Page** (1000×400) — references wordmark

---

## Asset 0: Vista Create Brand Kit Setup

Set up the Brand Kit once before building any asset. In Vista Create: **Brand Kit → Create New Kit → Name: "The STR Ledger"**

### Colors to add (7 entries)

| Name in Kit | Hex |
|---|---|
| Harbor Navy | `#12304E` |
| Parchment | `#F6EFE2` |
| Muted Gold | `#C9A24B` |
| Clay Rose | `#B5725E` |
| Graphite | `#2B2B2B` |
| Parchment Alt | `#EFE5D0` |
| Navy Tint | `#2A4867` |

### Fonts to add (3 families)

1. Cormorant Garamond (400 Italic + 500 Medium)
2. Inter (400 Regular + 500 Medium + 600 Semibold)
3. JetBrains Mono (400 Regular) — or Courier Prime if unavailable

### Logo upload (after logos are built)

Upload to Brand Kit → Logos:
- `brand/assets/logo-square-navy-bg.png`
- `brand/assets/logo-horizontal-parchment-bg.png`
- `brand/assets/logo-horizontal-transparent.png`
- `brand/assets/logo-horizontal-reverse.png`

---

## Asset 1: Logo — Square Variant

### Canvas

| Property | Value |
|---|---|
| Dimensions | 1000 × 1000 px |
| Aspect ratio | 1:1 |
| DPI | 96 (screen); export at 300 DPI for print |

### Background

Full canvas: Harbor Navy `#12304E`

### Layout Zones

```
┌──────────────────────────────────────────┐  y: 0
│                                          │
│              TOP PADDING                 │  h: 200px
│                                          │
├──────────────────────────────────────────┤  y: 200
│                                          │
│            WORDMARK ZONE                 │  h: 500px  (y: 200–700)
│                                          │
├──────────────────────────────────────────┤  y: 700
│          GOLD RULE + TAGLINE             │  h: 120px  (y: 700–820)
├──────────────────────────────────────────┤  y: 820
│              BOTTOM PADDING              │  h: 180px
└──────────────────────────────────────────┘  y: 1000
```

### Elements (by zone)

**WORDMARK ZONE (horizontally centered at x: 500)**

Element 1 — "The" text
- Font: Cormorant Garamond, 400 Italic
- Size: 42pt
- Color: Parchment `#F6EFE2`
- Position: centered horizontally; top of wordmark zone (y: ~220)
- Letter-spacing: 0

Element 2 — "STR Ledger" text
- Font: Cormorant Garamond, 500 Medium
- Size: 120pt
- Color: Parchment `#F6EFE2`
- Position: centered horizontally; below "The" (y: ~280)
- Letter-spacing: -0.01em (tighten in Vista Create character spacing)

Element 3 — Terminal period "."
- Same line as "STR Ledger", immediately after the final "r"
- Color: Muted Gold `#C9A24B`
- Font: Cormorant Garamond, 500 Medium, 120pt (same baseline as Element 2)
- Tip: type "STR Ledger" + "." as two separate text boxes so the period can be colored independently
- Terminal period positioned immediately after the 'r' baseline, 2–3px gap from 'r'. Period font size equals 'Ledger' cap-height (120pt in logo square). Color `#C9A24B` (Muted Gold).

**GOLD RULE + TAGLINE ZONE (y: 700–820)**

Element 4 — Horizontal rule
- Shape: Rectangle
- Size: 400px wide × 1px tall
- Color: Muted Gold `#C9A24B`
- Position: centered horizontally at y: 718

Element 5 — Tagline text
- Copy: `Run your rentals before they run you.`
- Font: Inter, 400 Regular
- Size: 14pt
- Color: Muted Gold `#C9A24B`
- Position: centered horizontally at y: ~730
- Letter-spacing: 0.05em (slight open tracking for authority)

### Exports

| File | Format | Notes |
|---|---|---|
| `logo-square-navy-bg.png` | PNG | 1000×1000, navy background |
| `logo-square-transparent.png` | PNG | 1000×1000, transparent bg (remove navy fill before export) |
| `logo-square-navy-bg.svg` | SVG | Vector; Vista Create → Download → SVG (paid plan required) |

---

## Asset 2: Logo — Horizontal Variant

### Canvas

| Property | Value |
|---|---|
| Dimensions | 2000 × 500 px |
| Aspect ratio | 4:1 |
| DPI | 96 screen / 300 print |

### Background

Full canvas: Parchment `#F6EFE2` (primary horizontal variant)
Second variant: Harbor Navy `#12304E` (reverse)

### Layout Zones

```
┌────────────────────────────────────────────────────────────────────────┐  y: 0
│  LEFT PAD │      WORDMARK ZONE      │  RULE  │    TAGLINE ZONE  │ PAD │
│  80px     │  w: ~900px, x: 80–980  │  40px  │  w: ~900px       │ 80px│
│           │  h: 500px (full height) │        │  h: 500px        │     │
└────────────────────────────────────────────────────────────────────────┘  y: 500
```

### Elements

**WORDMARK ZONE (x: 80, vertically centered at y: 250)**

Element 1 — "The" text
- Font: Cormorant Garamond, 400 Italic
- Size: 24pt
- Color: Harbor Navy `#12304E` (on parchment bg) / Parchment `#F6EFE2` (on navy bg)
- Position: x: 80, y: 175–200 (top of text box), cap-height baseline at y: 195

Element 2 — "STR Ledger" text
- Font: Cormorant Garamond, 500 Medium
- Size: 80pt
- Color: Harbor Navy `#12304E` (parchment bg) / Parchment `#F6EFE2` (navy bg)
- Position: x: 80, y: 200 (top of text box), cap-height baseline at y: 280
- Letter-spacing: -0.01em

Element 3 — Terminal period "."
- Color: Muted Gold `#C9A24B` (both bg variants)
- Font: Cormorant Garamond, 500 Medium, 80pt (same as Element 2)
- Separate text box; align baseline to Element 2's cap-height baseline (y: 280), 3px gap after the 'r' in 'Ledger'

**VERTICAL GOLD RULE (x: ~1020, centered vertically)**

Element 4 — Vertical rule
- Shape: Rectangle
- Size: 1px wide × 260px tall
- Color: Muted Gold `#C9A24B`
- Position: x: 1020, y: 120 (vertically centered in canvas)

**TAGLINE ZONE (x: 1060, vertically centered at y: 250)**

Element 5 — Tagline text
- Copy: `Run your rentals`
- Font: Inter, 400 Regular
- Size: 18pt
- Color: Harbor Navy `#12304E` (parchment bg) / Parchment `#F6EFE2` (navy bg)
- Position: x: 1060, y: ~195
- Letter-spacing: 0

Element 6 — Tagline second line
- Copy: `before they run you.`
- Font: Inter, 400 Regular
- Size: 18pt
- Color: same as Element 5
- Position: x: 1060, y: ~228

Element 7 — Domain label
- Copy: `THESTRLEDGER.COM`
- Font: JetBrains Mono (or Courier Prime), 400 Regular
- Size: 10pt
- Color: Muted Gold `#C9A24B`
- Position: x: 1060, y: ~300
- Letter-spacing: 0.20em (wide tracking — mono label style)

### Exports (4 files)

| File | Format | Background |
|---|---|---|
| `logo-horizontal-parchment-bg.png` | PNG | Parchment `#F6EFE2` |
| `logo-horizontal-navy-bg.png` | PNG | Harbor Navy `#12304E` |
| `logo-horizontal-transparent.png` | PNG | Transparent (remove bg fill) |
| `logo-horizontal-reverse.png` | PNG | Transparent, white art (swap all navy/parchment text to white) |
| `logo-horizontal-parchment-bg.svg` | SVG | Parchment bg |
| `logo-horizontal-transparent.svg` | SVG | Transparent |

---

## Asset 3: Thumbnail Master (2000×2000 Template)

> **CRITICAL:** This is the template all 25 per-product thumbnails clone. Do NOT produce finished product images here — build the structural shell only. Each of the 5 products will have 5 images derived by duplicating this template in Vista Create and swapping the content in Zones 3–6.

### Canvas

| Property | Value |
|---|---|
| Dimensions | 2000 × 2000 px |
| Aspect ratio | 1:1 |
| DPI | 72 (Etsy optimized) |

### Zone Map (with pixel coordinates)

```
┌──────────────────────────────────────────┐  y: 0
│  ZONE 1: TOP STRIP                       │  y: 0–200    (h: 200px)
├──────────────────────────────────────────┤  y: 200
│                                          │
│                                          │  y: 200–340  (h: 140px — HEADLINE ZONE)
│  ZONE 2: HEADLINE ZONE                   │
│                                          │
├──────────────────────────────────────────┤  y: 340
│                                          │
│                                          │
│  ZONE 3: MOCKUP SLOT                     │  y: 340–1540 (h: 1200px — centered: 400–1600)
│  (1200×900 mockup element, centered)     │
│                                          │
│                                          │
├──────────────────────────────────────────┤  y: 1540
│  ZONE 4: SUB-HEADLINE ZONE               │  y: 1540–1640 (h: 100px)
├──────────────────────────────────────────┤  y: 1640
│  ZONE 5: FORMAT BADGE ZONE               │  y: 1640–1760 (h: 120px)
├──────────────────────────────────────────┤  y: 1760
│  ZONE 6: BOTTOM STRIP (CTA)              │  y: 1760–2000 (h: 240px)
└──────────────────────────────────────────┘  y: 2000
```

---

### ZONE 1: Top Strip (y: 0–200, h: 200px)

**Background:** Harbor Navy `#12304E`, full width 2000px

**Element 1.1 — Logo wordmark (left)**
- Source: use logo-horizontal-transparent.png from Brand Kit (reverse/white version)
- Width: 320px (maintain aspect ratio ~4:1, height auto ~80px)
- Position: x: 60, y: centered in strip (~60px from vertical center = y: 60)
- Alternative if logo not yet built: place "The STR Ledger." text manually:
  - "The" — Cormorant Garamond, 400 Italic, 14pt, Parchment `#F6EFE2`
  - "STR Ledger" — Cormorant Garamond, 500 Medium, 38pt, Parchment `#F6EFE2`
  - "." — same, Muted Gold `#C9A24B`

**Element 1.2 — Domain label (right)**
- Copy: `thestrledger.com`
- Font: JetBrains Mono (or Courier Prime), 400 Regular
- Size: 14pt
- Color: Parchment `#F6EFE2`
- Letter-spacing: 0.15em
- Position: right-aligned, x: 1940 (right-align anchor), y: centered in strip (~82px)

---

### ZONE 2: Headline Zone (y: 200–340, h: 140px)

**Background:** Parchment `#F6EFE2`, full width 2000px

**Element 2.1 — Product category label**
- Copy: `[CATEGORY LABEL]` — e.g., `TAX & ACCOUNTING` (SWAP PER PRODUCT)
- Font: JetBrains Mono, 400 Regular — or Inter, 500 Medium if Mono unavailable
- Size: 12pt
- Color: Muted Gold `#C9A24B`
- Letter-spacing: 0.22em
- Position: centered horizontally, y: 215 (top of zone)

**Element 2.2 — Product headline**
- Copy: `[PRODUCT HEADLINE]` — e.g., `Short-Term Rental Tax Tracker` (SWAP PER PRODUCT)
- Font: Cormorant Garamond, 500 Medium
- Size: 52pt
- Color: Harbor Navy `#12304E`
- Letter-spacing: -0.01em
- Position: centered horizontally, y: 240
- Max width: 1800px (allow text to wrap to 2 lines; keep bottom edge above y: 340)

---

### ZONE 3: Mockup Slot (y: 340–1540, h: 1200px)

**Background:** Parchment `#F6EFE2`, full width 2000px

**Element 3.1 — Mockup placeholder**
- **Preferred:** Vista Create → Elements → search `minimal laptop mockup` — pick the first result tagged 'clean white device' (no distractions, neutral angle, solid white bezel).
- **Alternative:** `iPad landscape mockup` with the same tag — use only if the laptop mockup's aspect ratio conflicts with the 1200×900 slot.
- Export the chosen mockup as a saved template in your Vista Create project so per-product thumbnails can reuse the exact same mockup.
- Size: 1200px wide × 900px tall
- Position: horizontally centered at x: 400 (left edge) to x: 1600 (right edge); vertically centered at y: 490 (top) to y: 1390 (bottom)
- Do NOT apply filters — keep mockup clean and neutral
- Layer order: above background, below any overlay text

**Element 3.2 — Subtle gold accent rule (optional)**
- Shape: Rectangle
- Size: 60px wide × 3px tall
- Color: Muted Gold `#C9A24B`
- Position: centered horizontally, y: 345 (sits at top of Zone 3, separating from headline)

---

### ZONE 4: Sub-Headline Zone (y: 1540–1640, h: 100px)

**Background:** Parchment `#F6EFE2`, full width 2000px

**Element 4.1 — Sub-headline / product descriptor**
- Copy: `[SUB-HEADLINE]` — e.g., `Formula-tight. Schedule E-ready. Built for 3–10 properties.` (SWAP PER PRODUCT)
- Font: Inter, 400 Regular
- Size: 22pt
- Color: Graphite `#2B2B2B`
- Position: centered horizontally, vertically centered in zone (~y: 1580)
- Max width: 1700px

---

### ZONE 5: Format Badge Zone (y: 1640–1760, h: 120px)

**Background:** Parchment `#F6EFE2`, full width 2000px

**Element 5.1 — Format badge pill**
- Shape: Rounded rectangle (pill), corner radius: 40px
- Size: 280px wide × 56px tall
- Fill: Muted Gold `#C9A24B`
- Position: centered horizontally, y: 1660

**Element 5.1a — Badge label text**
- Copy: `EXCEL + GOOGLE SHEETS` (or `EXCEL TEMPLATE` — SWAP PER PRODUCT)
- Font: Inter, 600 Semibold
- Size: 13pt
- Color: Harbor Navy `#12304E`
- Letter-spacing: 0.08em
- Position: centered inside pill

**Per-product swap rule:** if the product's format label exceeds the 280×56px pill, reduce font to 12pt or abbreviate (e.g., 'EXCEL TEMPLATE' → 'EXCEL'). Test label length before cloning master to per-product thumbs. Do not exceed 300×60px — breaks visual rhythm.

**Element 5.2 — Second badge (optional, for multi-format products)**
- Shape: Rounded rectangle pill, corner radius: 40px
- Size: 180px wide × 56px tall
- Fill: none (outline only)
- Border: 1.5px solid, Muted Gold `#C9A24B`
- Position: 20px right of Element 5.1
- Label text: `INSTANT DOWNLOAD`, Inter 600 Semibold, 11pt, Muted Gold `#C9A24B`

---

### ZONE 6: Bottom Strip / CTA (y: 1760–2000, h: 240px)

**Background:** Muted Gold `#C9A24B`, full width 2000px

**Element 6.1 — Trust line text**
- Copy: `Instant Download · 14-Day Refund · Lifetime Updates`
- Font: Inter, 600 Semibold
- Size: 22pt
- Color: Harbor Navy `#12304E`
- Letter-spacing: 0.02em
- Position: centered horizontally and vertically in strip (y: ~1862)

**Element 6.2 — Separator dots (·)**
- These are typographic · (middle dot, U+00B7) within the same text string as Element 6.1
- No separate element needed — type the full string with · between phrases

---

### Thumbnail Master: Vista Create Save Instructions

1. Build all 6 zones as described above with placeholder text in Zones 2, 3, 4, 5
2. **Name the design:** `[THUMB MASTER] STR Ledger Thumbnail Template v1`
3. In Vista Create: File → Save. Do NOT download yet.
4. To create per-product thumbnails: open master → File → Make a copy → rename `[THUMB 1.1] Product Name — Image 1` etc.
5. In each copy: swap Zone 2 headline, Zone 3 mockup, Zone 4 sub-headline, Zone 5 badge text only. Zones 1 and 6 never change.

### Thumbnail Master Export (structural preview only)

| File | Format |
|---|---|
| `thumbnail-master-preview.png` | PNG 2000×2000 — export one reference preview |

---

## Asset 4: Etsy Shop Banner

### Canvas

| Property | Value |
|---|---|
| Dimensions | 1600 × 213 px |
| Aspect ratio | ~7.5:1 |
| DPI | 72 |

### Background

Full canvas: Harbor Navy `#12304E`

### Layout Zones

```
┌──────────────────────────────────────────────────────────────┐  y: 0
│ LEFT PAD │    WORDMARK ZONE      │ RULE │   TAGLINE ZONE     │  y: 0–213
│  64px    │  w: ~540px, x: 64    │ 40px │  x: ~680, w: ~820  │
│          │  vertically centered │      │  vertically centered│
└──────────────────────────────────────────────────────────────┘  y: 213
```

### Elements

**WORDMARK ZONE (x: 64, vertically centered at y: 107)**

Element 1 — "The" text
- Font: Cormorant Garamond, 400 Italic
- Size: 16pt
- Color: Parchment `#F6EFE2`
- Position: x: 64, y: 62, width: 120px (prevents Element 2 wrap)
- Baseline of Element 1 at y: 82

Element 2 — "STR Ledger" text
- Font: Cormorant Garamond, 500 Medium
- Size: 52pt
- Color: Parchment `#F6EFE2`
- Position: x: 64, y: 72, max-width: 540px. Scale font size down if text wraps — target 42pt, accept 36pt min.
- Letter-spacing: -0.01em
- Baseline of Element 2 at y: 130 (48px line-gap from Element 1 baseline at y: 82)

Element 3 — Terminal period "."
- Color: Muted Gold `#C9A24B`
- Same font/size as Element 2

Element 4 — Horizontal gold rule (below wordmark)
- Size: 320px wide × 1px tall
- Color: Muted Gold `#C9A24B`
- Position: x: 64, y: ~152

Element 5 — Domain label
- Copy: `THESTRLEDGER.COM`
- Font: JetBrains Mono, 400 Regular (or Courier Prime)
- Size: 9pt
- Color: Muted Gold `#C9A24B`
- Letter-spacing: 0.20em
- Position: x: 64, y: ~164

**VERTICAL GOLD RULE (x: ~630, centered vertically)**

Element 6 — Vertical rule
- Shape: Rectangle
- Size: 1px wide × 130px tall
- Color: Muted Gold `#C9A24B`
- Position: x: 630, y: 42

**TAGLINE ZONE (x: 660, vertically centered at y: 107)**

Element 7 — Tagline
- Copy: `Run your rentals before they run you.`
- Font: Cormorant Garamond, 400 Italic
- Size: 28pt
- Color: Parchment `#F6EFE2`
- Position: x: 660, y: ~72
- Max width: 820px

Element 8 — Sub-tagline
- Copy: `Spreadsheet templates for serious STR hosts.`
- Font: Inter, 400 Regular
- Size: 12pt
- Color: Muted Gold `#C9A24B`
- Position: x: 660, y: ~148
- Letter-spacing: 0.03em

### Export

| File | Format |
|---|---|
| `etsy-banner.png` | PNG 1600×213 |

---

## Asset 5: Etsy Shop Icon

### Canvas

| Property | Value |
|---|---|
| Dimensions | 500 × 500 px |
| Aspect ratio | 1:1 |
| DPI | 72 |

### Background

Transparent (icon uses circle as its own background)

### Layout Zones

```
┌─────────────────────────┐  y: 0
│      PADDING 40px       │
│  ┌───────────────────┐  │  y: 40
│  │                   │  │
│  │   CIRCLE ZONE     │  │  diameter: 420px, centered x: 40, y: 40
│  │    (420×420)      │  │
│  │                   │  │
│  └───────────────────┘  │  y: 460
│      PADDING 40px       │
└─────────────────────────┘  y: 500
```

### Elements

**CIRCLE (centered at 250, 250)**

Element 1 — Circle background
- Shape: Circle (Ellipse, hold shift to constrain)
- Size: 420px × 420px
- Fill: Harbor Navy `#12304E`
- No border/stroke
- Position: centered at x: 250, y: 250 (i.e., x-offset: 40, y-offset: 40)

**MONOGRAM (centered inside circle)**

Element 2 — "S" letter
- Font: Cormorant Garamond, 500 Medium
- Size: 120pt
- Color: Parchment `#F6EFE2`
- Position: x: 180 (top-left), vertically centered at ~y: 145

Element 3 — "L" letter
- Font: Cormorant Garamond, 500 Medium
- Size: 120pt
- Color: Muted Gold `#C9A24B`
- Position: x: 260 (top-left), same baseline as "S"
- Note: "S" and "L" are two separate text boxes so they can be colored independently. S and L overlap approximately 5px at baseline — visually stacked but readable. If they touch or over-overlap after font rendering, nudge L to x: 265.

Element 4 — Thin gold ring (optional but recommended)
- Shape: Circle (outline only)
- Size: 420px × 420px (same as Element 1)
- Fill: none
- Border: 2px, Muted Gold `#C9A24B`
- Position: exactly overlapping Element 1

### Export

| File | Format |
|---|---|
| `etsy-icon.png` | PNG 500×500 (transparent background outside circle) |

---

## Asset 6: Excel Cover Page

> This image is embedded at the top of each Excel file using openpyxl `add_image`. It spans approximately columns A–O and rows 1–16.

### Canvas

| Property | Value |
|---|---|
| Dimensions | 1000 × 400 px |
| Aspect ratio | 5:2 |
| DPI | 150 (higher DPI = crisper in Excel — use 150 not 72) |

### Background

Full canvas: divided into two horizontal bands

**Band A (top band):** Harbor Navy `#12304E`, h: 200px, full width 1000px
**Band B (bottom band):** Parchment `#F6EFE2`, h: 200px, full width 1000px

### Layout Zones

```
┌────────────────────────────────────────────────────────┐  y: 0
│ BAND A — NAVY (h: 200px)                               │
│  LEFT: Wordmark (x: 40, centered vertically in band)   │
│  RIGHT: SKU/version label (x: 960 right-align, y: ~40) │
├────────────────────────────────────────────────────────┤  y: 200
│ BAND B — PARCHMENT (h: 200px)                          │
│  LEFT: Product name + descriptor (x: 40, y: ~220)      │
│  RIGHT: Domain (x: 960, right-align, y: ~340)          │
└────────────────────────────────────────────────────────┘  y: 400
```

### Elements

**BAND A — NAVY (y: 0–200)**

Element 1 — "The" text (wordmark line 1)
- Font: Cormorant Garamond, 400 Italic
- Size: 14pt
- Color: Parchment `#F6EFE2`
- Position: x: 40, y: ~68

Element 2 — "STR Ledger" text (wordmark line 2)
- Font: Cormorant Garamond, 500 Medium
- Size: 42pt
- Color: Parchment `#F6EFE2`
- Position: x: 40, y: ~82
- Letter-spacing: -0.01em

Element 3 — Terminal period "."
- Color: Muted Gold `#C9A24B`
- Font: Cormorant Garamond, 500 Medium, 42pt
- Separate text box; align baseline with Element 2

Element 4 — Horizontal gold rule
- Size: 260px wide × 1px tall
- Color: Muted Gold `#C9A24B`
- Position: x: 40, y: 160

Element 5 — SKU / template code label (top right)
- Copy: `[SKU-CODE]` — e.g., `STR-TAX-001` (SWAP PER PRODUCT)
- Font: JetBrains Mono, 400 Regular (or Courier Prime)
- Size: 10pt
- Color: Muted Gold `#C9A24B`
- Letter-spacing: 0.20em
- Position: right-aligned to x: 960, y: 36

Element 6 — Version label
- Copy: `v1.0`
- Font: JetBrains Mono, 400 Regular
- Size: 9pt
- Color: Parchment `#F6EFE2` at 70% opacity (use alpha in Vista Create)
- Position: right-aligned to x: 960, y: 54

**BAND B — PARCHMENT (y: 200–400)**

Element 7 — Product name
- Copy: `[PRODUCT NAME]` — e.g., `Short-Term Rental Tax Tracker` (SWAP PER PRODUCT)
- Font: Cormorant Garamond, 500 Medium
- Size: 28pt
- Color: Harbor Navy `#12304E`
- Position: x: 40, y: 220
- Max width: 700px

Element 8 — Product descriptor
- Copy: `[DESCRIPTOR LINE]` — e.g., `Formula-tight · Schedule E-ready · Built for 3–10 properties` (SWAP)
- Font: Inter, 400 Regular
- Size: 11pt
- Color: Graphite `#2B2B2B`
- Position: x: 40, y: 314
- Letter-spacing: 0.02em

Element 9 — Separator gold rule (between Band A and Band B)
- Size: 1000px wide × 3px tall
- Color: Muted Gold `#C9A24B`
- Position: y: 198 (sits on the seam between bands)

Element 10 — Domain label (bottom right)
- Copy: `THESTRLEDGER.COM`
- Font: JetBrains Mono, 400 Regular (or Courier Prime)
- Size: 9pt
- Color: Muted Gold `#C9A24B`
- Letter-spacing: 0.20em
- Position: right-aligned to x: 960, y: 360

### Export

| File | Format | Notes |
|---|---|---|
| `excel-cover.png` | PNG 1000×400 | Export at 150 DPI if Vista Create supports it; otherwise 96 DPI acceptable |

---

## Elements Library Hints (Vista Create Search Terms)

These searches in **Vista Create → Elements** find usable assets:

| What you need | Search term | Notes |
|---|---|---|
| Laptop with spreadsheet on screen | `laptop spreadsheet mockup` | Filter: "Graphics" or "Mockups" |
| iPad landscape with screen content | `iPad landscape mockup` or `tablet flatlay` | Prefer clean white device |
| MacBook open with document | `MacBook mockup spreadsheet` | Good for product thumbnail Zone 3 |
| Decorative thin line / rule | `thin horizontal line` | Or draw manually with Rectangle tool |
| Circle / monogram frame | `circle badge frame` | For shop icon variation |
| Minimal spreadsheet graphic | `spreadsheet icon minimal` | For abstract product thumbnails |
| QR code placeholder | `QR code` | Only if needed for future social assets |

---

## Daniel's Build Checklist

- [ ] Brand kit "The STR Ledger" created in Vista Create with all 7 colors, 3 fonts
- [ ] Logo square (1000×1000) built and exported as PNG (navy bg + transparent) and SVG
- [ ] Logo horizontal (2000×500) built and exported as PNG (4 variants) and SVG (2 variants)
- [ ] Thumbnail master (2000×2000) built with all 6 zones, saved in Vista Create as template, preview PNG exported
- [ ] Etsy banner (1600×213) built and exported as PNG
- [ ] Etsy shop icon (500×500) built and exported as PNG
- [ ] Excel cover page (1000×400) built and exported as PNG
- [ ] All exported files placed in `brand/assets/` (create folder if it doesn't exist)
- [ ] Vista Create design URLs captured in `brand/canva-links.md`
- [ ] All per-product thumbnails (25 total) created by duplicating thumbnail master in Vista Create

---

*End of Vista Create spec. Refer to `brand/brand-decisions.md` for all palette and typography decisions. If any value here conflicts with brand-decisions.md, brand-decisions.md takes precedence.*
