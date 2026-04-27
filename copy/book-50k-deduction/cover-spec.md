# Cover Build Spec — *The $50,000 Deduction*

**Imprint:** The STR Ledger · Tax Series · Vol. 01
**Trim:** 5×8" paperback, ~160 pages · Kindle 1.6:1
**Pricing:** $2.99 Kindle / $9.99 paperback (tripwire)
**Build target:** Vista Create (300 DPI, CMYK preview)
**Brand source of truth:** `brand/brand-decisions.md` v1.1 (Locked)

The cover must read as a $24.99 editorial-finance hardback sold at $9.99 — masthead, gravitas, calm authority. Parchment ground, Harbor Navy hero band, gold accents, Clay Rose used once. Color ratio holds: ~55% Parchment / 30% Harbor Navy / 8% Graphite / 4% Muted Gold / 3% Clay Rose.

---

## 1. Front cover — paperback (5×8")

**Canvas:** 1500 × 2400 px @ 300 DPI. Bleed 0.125" already inside trim margins (live area inset 75 px from every edge). Working units below in pixels from top-left.

### 1.1 Region map

| Band | Y-range (px) | Fill | Purpose |
|---|---|---|---|
| **A — Top mono label** | 90–150 | Parchment | Series mono label |
| **B — Hero block (Harbor Navy)** | 200–1450 | Harbor Navy `#12304E` | Title hero, full-bleed sides |
| **C — Gold rule** | 1500 | Muted Gold `#C9A24B`, 1.5 px × 280 px, centered | Title/subtitle separator |
| **D — Subtitle band** | 1560–1820 | Parchment | Subtitle, calm |
| **E — Byline** | 1920–2050 | Parchment | Author/imprint line |
| **F — Bottom rule + foot label** | 2240–2310 | Parchment | Series mono label, ISBN absent on front |

The hero block (B) is a full-width Harbor Navy rectangle that bleeds left/right edges and stops short of the parchment subtitle band — this gives the cover a masthead-on-paper feel rather than a flat color block.

### 1.2 Title typesetting — "$50,000 Deduction."

The "$50,000" is the visual hero. Recommended treatment (Variant A — see §5):

- **Line 1 — "The"**
  Cormorant Garamond Italic 400, 56 pt, tracking 0.
  Color: Parchment `#F6EFE2` at 80% opacity.
  Position: centered, baseline at y = 360.
- **Line 2 — "$50,000"**
  Cormorant Garamond Medium 500, **216 pt**, tracking -0.02em.
  Color: Parchment `#F6EFE2`.
  The leading **"$" glyph** is set in Muted Gold `#C9A24B` at the same point size — treat it as an accent mark, not a price tag. This amplifies the dollar figure and gives the hero its signature without resorting to neon or ornament.
  Position: centered, baseline at y = 900. Optical kern the "$" tighter to "5" by -40/1000 em.
- **Line 3 — "Deduction."**
  Cormorant Garamond Medium 500, 124 pt, tracking -0.015em.
  Color: Parchment `#F6EFE2`.
  **Terminal period in Muted Gold** `#C9A24B` — same point size, no spacing change. This is the brand signature; it must read clearly even at thumbnail.
  Position: centered, baseline at y = 1260.

**Line-break logic.** If "$50,000" exceeds 92% of canvas width at 216 pt, drop to 200 pt before breaking the line. Never break the dollar figure across two lines. Never hyphenate "Deduction."

### 1.3 Gold rule (C)

- 1.5 px stroke, Muted Gold `#C9A24B`
- Width: 280 px
- Centered horizontally; y = 1500
- Sits between the navy hero block and the parchment subtitle band — half on navy, half on parchment? No — place fully on parchment, 50 px below where the navy block ends. Cleaner.

### 1.4 Subtitle — "47 Write-Offs Every STR Host Should Be Claiming"

- Cormorant Garamond Regular 400 Italic, 38 pt, tracking 0
- Color: Graphite `#2B2B2B`
- Color of the numeral **"47"**: Muted Gold `#C9A24B` (so the two numbers on the cover — $50,000 and 47 — both read at thumbnail and rhyme visually)
- Centered, max width 1100 px, single line preferred. If wrap is forced, break after "Write-Offs" — never after "Every".
- Baseline at y = 1620; if two lines, leading 46 pt and second baseline at y = 1666.

### 1.5 Byline (E)

**Faceless variant (default):**
- Line 1: "from" — Cormorant Italic 400, 22 pt, Graphite at 70%, baseline y = 1960
- Line 2: "The STR Ledger." — Cormorant Medium 500, 42 pt, Graphite `#2B2B2B`. Terminal period in Muted Gold `#C9A24B`. Letter-spacing -0.01em. Baseline y = 2020.
- Centered.

(Founder variant — see §7.)

### 1.6 Bottom mono label (F)

- 1 px × 220 px Muted Gold rule, centered, y = 2240
- 24 px below the rule:
  `THE STR LEDGER · TAX SERIES · VOL. 01`
  JetBrains Mono 500, 18 pt, UPPERCASE, tracking 0.20em
  Color: Muted Gold `#C9A24B`
  Centered, baseline y = 2295

---

## 2. Spine

**Width math.** 160 pp × 0.002252" (KDP white paper) = **0.3603"**. Round to **0.36"**.
**Canvas:** 0.36" × 8" → **108 × 2400 px** at 300 DPI. Add 0.125" bleed top + bottom (37 px each) when assembling the full wrap; the 108 px stays as final spine width.

**Fill:** Harbor Navy `#12304E` full-bleed.

**Layout (top → bottom, type rotated 90° clockwise so it reads top-to-bottom on a shelf):**

| Element | Position from top (px) | Treatment |
|---|---|---|
| Head — wordmark monogram | 130 | "STR Ledger." set horizontally before rotation, Cormorant Medium 500, 28 pt, Parchment with Muted Gold terminal period. Center-aligned in spine width. After rotation reads top-down. |
| Title block | 600–1900 | "The $50,000 Deduction." set as one rotated line, Cormorant Medium 500, 38 pt, tracking -0.01em. Parchment, with Muted Gold "$" and Muted Gold terminal period. |
| Foot — byline | 2150 | "THE STR LEDGER" — JetBrains Mono 500, 12 pt, UPPERCASE, 0.22em tracking, Muted Gold. Center-aligned. |

Spine art has no rules or ornament. Type only.

---

## 3. Back cover (paperback, 1500 × 2400 px)

### 3.1 Region map

| Band | Y-range (px) | Fill |
|---|---|---|
| **Top wordmark band** | 0–220 | Harbor Navy |
| **Blurb body** | 320–1700 | Parchment |
| **Bio block** | 1780–2010 | Parchment |
| **Barcode + ISBN** | 2050–2310 | Parchment |

### 3.2 Top band

- Harbor Navy fill, full-bleed.
- Wordmark, top-right, 80 px from right edge:
  "The" — Cormorant Italic 400, 28 pt, Parchment 80% (line 1)
  "STR Ledger." — Cormorant Medium 500, 64 pt, Parchment with Muted Gold terminal period (line 2)
- Top-left, baseline aligned with "STR Ledger.":
  `TAX SERIES · VOL. 01` — JetBrains Mono 500, 16 pt, UPPERCASE, 0.20em tracking, Muted Gold.

### 3.3 Back-cover blurb (the actual copy)

Set in Cormorant Regular 400, 20 pt, leading 30 pt, Graphite `#2B2B2B`, max width 1180 px, left-aligned, top of text block at y = 360. Drop-cap "Y" in Cormorant Medium 500, 60 pt, Muted Gold, 2-line drop.

> **You ran a real business last year.** Cleaners, mileage to the property, a phone bill that's 60% guest-comms, the mattress you replaced after a bad turnover. Then your CPA filed a Schedule E that left $8,427 sitting on the table — because the worksheet they handed you didn't ask the right questions.
>
> This is the worksheet. Forty-seven deductions every short-term rental host should be claiming, organized the way the IRS actually reads them. Per-diem rules. Mileage at 70¢. Section 179 on the furniture you bought in November. The home-office allocation most hosts get wrong by half.
>
> Run your portfolio before April runs you.

(Word count: 119. Tighten to 95 in final by trimming the second paragraph if needed — keep "$8,427", "70¢", "Section 179", and the closing line intact.)

### 3.4 Bio block (faceless variant)

- Y = 1780, Parchment
- 1 px Muted Gold rule, 200 px, left-aligned at x = 160
- 30 px below rule:
  "**The STR Ledger** publishes operating books, tax workbooks, and field guides for short-term rental hosts running real portfolios. Editorial finance for the property side of the business."
  Cormorant Regular 400, 18 pt, leading 26 pt, Graphite. Max width 880 px, left-aligned at x = 160.

### 3.5 Barcode + ISBN

- Barcode placeholder rectangle: 450 × 150 px (1.5" × 0.5") at bottom-right, x = 990, y = 2120. White fill with Graphite border 1 px. KDP injects the EAN-13 at upload.
- ISBN mono label, 24 px above barcode top:
  `ISBN 978-X-XXXXXX-XX-X` — JetBrains Mono 500, 14 pt, UPPERCASE, 0.20em tracking, Graphite.
- Bottom-left corner mirror: imprint mono label at x = 160, y = 2240:
  `THESTRLEDGER.COM` — JetBrains Mono 500, 14 pt, 0.20em, Muted Gold.

### 3.6 Inside back-cover insert (printed on page 159 of the interior PDF — not on the cover wrap)

Separate 5×8" artboard. Parchment ground, Harbor Navy 60-px band at top.

- Headline (top, on Harbor Navy band):
  "The 47-Deduction Audit Checklist — Book Reader Edition"
  Cormorant Medium 500, 32 pt, Parchment with Muted Gold terminal period.
- Centered QR code, 1100 × 1100 px, Harbor Navy modules on Parchment ground, with the "S L" monogram (Muted Gold) embedded center per QR error-correction tolerance.
- URL below QR, centered: `THESTRLEDGER.COM/47-BOOK` — JetBrains Mono 500, 22 pt, 0.20em, Harbor Navy.
- Explainer (30 words), centered, Cormorant Regular 400 Italic, 20 pt, Graphite, max width 900 px:
  "We built a printable companion checklist that maps each of the 47 deductions to the line on Schedule E it belongs on. Free to readers. Bring it to your CPA."

---

## 4. Kindle eBook cover (1600 × 2560 px, 1.6:1)

Same hierarchy as paperback front cover, reflowed for the taller aspect.

| Element | Y (px) | Type spec |
|---|---|---|
| Top mono label `THE STR LEDGER · TAX SERIES · VOL. 01` | 110 | JetBrains Mono 500, 20 pt, 0.20em, Muted Gold |
| Hero block (Harbor Navy) | 220–1560 | Full-width fill |
| "The" | 410 baseline | Cormorant Italic 400, 64 pt, Parchment 80% |
| "$50,000" | 980 baseline | Cormorant Medium 500, **240 pt**, Parchment with Muted Gold "$" |
| "Deduction." | 1370 baseline | Cormorant Medium 500, 138 pt, Parchment with Muted Gold terminal period |
| Gold rule | 1620 | 1.5 px × 320 px, centered, Muted Gold |
| Subtitle | 1740 baseline | Cormorant Italic 400, 42 pt, Graphite, "47" in Muted Gold |
| Byline "from / The STR Ledger." | 2080 / 2150 | Cormorant Italic 22 pt / Cormorant Medium 500, 46 pt |
| Foot rule + label | 2390 / 2450 | Muted Gold 1 px × 240 px, then JetBrains Mono 500, 20 pt, 0.20em, Muted Gold |

**Thumbnail readability constraint.** At 200 px wide (Amazon search-result thumbnail), the cover is scaled to ~12.5%. The "$50,000" at 240 pt scales to ~30 px tall — legible. "Deduction." at 138 pt scales to ~17 px — legible. The subtitle scales to ~5 px — illegible by design; that's what the search-result text below the thumbnail is for. **Minimum legible point size at thumbnail: anything under 100 pt becomes decorative, not informational. Do not put information you need read at thumbnail below 100 pt.**

No spine, no back cover. Front-only.

---

## 5. Title-treatment alternates — recommendation: **Variant A**

### Variant A — Vertical hierarchy (RECOMMENDED)

```
            The
        $50,000
      Deduction.
   ─────────────
   47 Write-Offs Every STR Host
        Should Be Claiming
            from
        The STR Ledger.
```

**Trade-off:** Strongest at thumbnail. "$50,000" and "Deduction." both pop at 200 px wide. The dollar figure is unmistakable in a category grid. Slightly less editorial-masthead than C, but the masthead read comes back via the mono labels, gold rule, and parchment ground.

### Variant B — Single-line masthead

```
   The $50,000 Deduction.
   ─────────────
   47 Write-Offs Every STR Host
        Should Be Claiming
```

**Trade-off:** Most masthead-like, calmest. Dies at thumbnail — the title compresses to ~12 pt and "$50,000" stops being the hero. Works on a hardcover physical shelf, not on Amazon search.

### Variant C — Stacked with rule between

```
        $50,000
   ─────────────
      Deduction.
```

**Trade-off:** Most editorial. Looks like a Penguin Modern Classics cover. The gold rule between the two lines does heavy lifting. Loses the "The" italic signature unless added above, which crowds the composition. Strong shelf presence, weaker thumbnail than A.

**Use Variant A.** The book is sold as a $9.99 tripwire on Amazon — thumbnail performance compounds across every impression. Reserve Variant C for a future hardback or limited-run print.

---

## 6. Vista Create asset checklist

Build each as a separate artboard in the same Vista Create project so the brand kit (colors, fonts) stays bound.

| # | Asset | Canvas (px) | Notes |
|---|---|---|---|
| 1 | Front cover — paperback | 1500 × 2400 | §1, Variant A typesetting |
| 2 | Spine | 108 × 2400 | §2, 0.36" width based on 160 pp |
| 3 | Back cover — paperback | 1500 × 2400 | §3.1–3.5 |
| 4 | **Full wrap (KDP upload)** | **3216 × 2474** | 1500 + 108 + 1500 = 3108 px live + 0.125" (38 px) wrap bleed each side ≈ 3184 px; KDP template will give exact spec. Top + bottom bleed adds ~74 px. Use KDP cover calculator output as authoritative; this row is the working estimate. |
| 5 | Kindle eBook | 1600 × 2560 | §4, no spine/back |
| 6 | Inside back-cover insert (printed interior page 159) | 1500 × 2400 | §3.6, ships in interior PDF, not cover wrap |
| 7 | Amazon A+ header banner (variant) | 970 × 600 | Harbor Navy band, "$50,000 Deduction" hero left, mono series label right |
| 8 | Pinterest pin (variant) | 1000 × 1500 | Parchment bg, navy display "47 deductions every STR host should be claiming.", book-cover thumbnail bottom-right, `thestrledger.com/47-book` mono label foot |

**Brand kit binding (set once, applies to all 8):**
- Colors: Harbor Navy `#12304E`, Parchment `#F6EFE2`, Muted Gold `#C9A24B`, Clay Rose `#B5725E`, Graphite `#2B2B2B`
- Fonts: Cormorant Garamond (400, 400 Italic, 500, 500 Italic), Inter (400/500/600), JetBrains Mono (400/500)
- Logo assets imported from `brand/assets/` per `brand-decisions.md` §3.4

---

## 7. Founder-arm variant deltas — byline = "Daniel Harrison"

When the cover ships under the founder arm rather than the faceless masthead, only these elements change. Everything else (title, subtitle, hero block, gold rule, mono labels) stays.

### 7.1 Front cover byline

Replace §1.5 with:
- Line 1: "by" — Cormorant Italic 400, 22 pt, Graphite 70%, baseline y = 1960
- Line 2: "Daniel Harrison" — Cormorant Medium 500, 42 pt, Graphite, tracking -0.01em, baseline y = 2020
- Foot label adds ` · WITH THE STR LEDGER` — `THE STR LEDGER · TAX SERIES · VOL. 01 · D. HARRISON` if it fits at 18 pt; otherwise drop the foot label and rely on the back-cover imprint.

### 7.2 Back-cover author photo

Add a circular author-photo frame to the bio block:
- 320 × 320 px circle, Harbor Navy 1.5 px outline (no fill ring beyond the photo)
- Position: bottom-left, x = 160, y = 1780
- Photo treatment: warm duotone — Harbor Navy shadows, Parchment highlights — to keep the image inside the palette. No full-color headshots.

### 7.3 Two-line founder bio (30 words)

Set right of the photo, x = 540, y = 1810, Cormorant Regular 400, 18 pt, leading 26 pt, Graphite, max width 800 px:

> "Daniel Harrison runs a small STR portfolio in the Midwest. After a 2023 audit recovered $8,427 he'd missed across two returns, he started writing the books his CPA wished he'd had."

(Word count: 30. References the audit story from Email 4 of the existing nurture sequence.)

### 7.4 Trust signals (founder arm only)

Add a single-line credit row at y = 2010, below the bio, Inter 500, 13 pt, UPPERCASE, 0.20em, Graphite:
`HOST · 6 PROPERTIES · WRITES AT THESTRLEDGER.COM`

No "as seen in" logos. No certifications the brand doesn't actually hold. The audit dollar figure plus the property count is the proof; resist the urge to add more.

### 7.5 Spine + Kindle

- Spine foot label changes from `THE STR LEDGER` to `D. HARRISON`. Head wordmark stays.
- Kindle byline reflows the same as §7.1.

---

## 8. Pre-flight checklist

Before exporting the wrap to KDP:

- [ ] All type converted to outlines (Vista Create export setting)
- [ ] CMYK color profile applied; verify Harbor Navy doesn't shift muddy — if it does, allow a +5% Cyan correction at print
- [ ] Bleed extends 0.125" past trim on all outer edges of the wrap
- [ ] Spine width matches KDP cover calculator output for final page count (recalc if interior creeps past 160 pp)
- [ ] No live type within 0.25" of trim or spine fold
- [ ] Barcode area clear of art (1.5" × 0.5", bottom-right back cover, 0.25" inside trim)
- [ ] "$" on front cover renders Muted Gold, not Parchment — verify after CMYK conversion
- [ ] Terminal periods on "Deduction." (front), "STR Ledger." (back top band, byline) all render Muted Gold
- [ ] Kindle file exported as standalone JPEG, sRGB, ≤50 MB

**End of spec.**
