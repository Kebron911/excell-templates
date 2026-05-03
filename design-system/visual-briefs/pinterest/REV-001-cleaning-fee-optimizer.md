# Pinterest 4-Pin Visual Brief — Cleaning Fee Optimizer

**SKU:** REV-001  **Pin set:** copy/pinterest/REV-001-cleaning-fee-optimizer-pins.md  **Status:** Production-ready

**Output specs:** 1000 × 1500 PNG, sRGB, <10MB. File naming: `REV-001-pin-<n>-<variant>.png`.

**A/B test (per brand-decisions.md §6.4 through 2026-06-23):**
- Variant A = control: warning/solution voice. Names the failure first ("the cleaning fee that costs you…"), parchment background, navy display, no Clay Rose.
- Variant B = challenger: outcome-first/calm-authority voice. Same parchment + navy palette, but one accent surface uses Clay Rose `#B5725E` for warmth (pin 4 ratio bar; pin 2 mono accent dot).

**Brand reference:**
- Palette: Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`
- Type: Cormorant Garamond (display) / Inter (body) / JetBrains Mono (data + SKU)
- Brand signatures (≥1× across the 4 pins, all four present at least once across the set per `brand-decisions.md` §5.4): italic "The" before "STR Ledger", Muted Gold terminal period, 48px gold rule under headline, JetBrains Mono tracked uppercase eyebrow / SKU corner label
- Per `brand/canva-specs.md` Pinterest spec — 1000×1500, ≥60pt headline, wordmark bottom-center ≥120px wide, mono URL above wordmark
- No emoji per `brand-decisions.md` §6.2

---

## Pin 1 — The Cleaning Fee That Costs You $3,840/yr (Quote-card · Variant A)

**Linked URL:** thestrledger.com/products/cleaning-fee-optimizer
**Pin description (Pinterest caption):** Airbnb's algorithm penalizes listings when the cleaning fee climbs above 30% of a 3-night total. Most hosts find out by watching their search visibility quietly slide. This workbook runs the math on three fee strategies — Full Fee, Partial Bundle, Fully Bundled — and tells you which one nets the most on your actual ADR and length of stay. Sample property in the demo: +$3,840/year by bundling. #airbnb #shorttermrental #strpricing #vrbo #airbnbhost

**Composition (top/middle/bottom thirds):**
- Top (0–500): Parchment `#F6EFE2`. Eyebrow `REV·001 — CLEANING FEE OPTIMIZER` JetBrains Mono 14pt Muted Gold tracking 0.22em, centered y:120. 48px × 1px gold rule centered y:170. Sub-eyebrow `THE QUIET PENALTY` Inter 500 16pt Graphite tracking 0.18em, centered y:210.
- Middle (500–1000): Hero quote stack. Headline `"The cleaning fee that costs you $3,840 a year."` Cormorant Garamond 500 Medium, 76pt, Harbor Navy `#12304E`, letter-spacing -0.01em, centered, line-broken at "/yr" → display reads `"The cleaning fee / that costs you / $3,840/yr."` (3 lines, leading 84pt, baseline of last line at y:880). Gold terminal period `.` at end. The dollar number `$3,840` rendered inline in same Cormorant 76pt but with the digits set in JetBrains Mono Bold 64pt Muted Gold so the number visually dominates the line at thumb size.
- Bottom (1000–1500): 48px × 1px gold rule centered y:1040. Supporting line `Bundle the fee. Recover the rank.` Inter 400 Italic 22pt Graphite, centered y:1090. Wordmark `The STR Ledger.` Cormorant 400 italic 22pt + Cormorant 500 38pt Harbor Navy with Muted Gold terminal period, centered y:1340 (wordmark width ≥160px). Mono URL `thestrledger.com` JetBrains Mono 14pt Graphite tracking 0.22em, centered y:1290 (above wordmark).

**Headline:** `"The cleaning fee that costs you $3,840/yr."` · Cormorant Garamond 500, 76pt, Harbor Navy `#12304E`, centered, 3-line stack y:680–880
**Subhead:** `Bundle the fee. Recover the rank.` · Inter 400 Italic, 22pt, Graphite `#2B2B2B`, centered y:1090
**Number/data callout:** `$3,840` · JetBrains Mono Bold, 64pt, Muted Gold `#C9A24B`, inline within line 3 of headline
**Brand mark:** Wordmark centered x:500 y:1340; mono URL centered y:1290; SKU watermark `REV-001 · v1.0` JetBrains Mono 11pt Muted Gold tracking 0.20em, top-right x:940 y:60
**Shape elements:** Two 48px × 1px gold rules `#C9A24B` (y:170, y:1040). No fills, no boxes — quote-card breathes on parchment.
**Reference assets:** `brand/assets/wordmark-on-parchment.svg`; SKU-derived figure from `templates/_masters/REV-001-cleaning-fee-optimizer.xlsx` Strategies tab (Bundled annual delta cell). No screenshot here — quote-card is type-only.
**Designer note:** The `$3,840` is the make-or-break thumbnail signal. At 240×240 thumb, the dollar number must still be the loudest element — bigger optical weight than the word "cleaning". If Cormorant 76pt makes the number recede, scale the JetBrains Mono digit pair to 72pt and tighten kerning.

## Pin 2 — Bundle, Partial, or Pass-Through? Run the Math (Tip-list · Variant B)

**Linked URL:** thestrledger.com/products/cleaning-fee-optimizer
**Pin description:** Three cleaning-fee strategies, side-by-side, with the annual dollar delta and the Airbnb search-rank impact for each. Inputs: cleaning cost, current fee, ADR, length of stay, monthly bookings. Outputs: one recommendation, one number, one printable action plan. Built for hosts who want the actual math — not another "cleaning fee best practice" listicle. #airbnbpricing #strrevenue #airbnbtips

**Composition (top/middle/bottom thirds):**
- Top (0–500): Parchment background. Eyebrow `THREE STRATEGIES · ONE WINNER` JetBrains Mono 14pt Muted Gold tracking 0.22em centered y:140. Headline `Bundle, Partial, or Pass-Through?` Cormorant Garamond 500, 64pt, Harbor Navy, centered, 2-line wrap (`Bundle, Partial, / or Pass-Through?`) y:240–410. Gold terminal `?` rendered Muted Gold. 48px gold rule centered y:450.
- Middle (500–1000): Three numbered tip rows, left-aligned x:120, vertical rhythm 150px between row tops y:560 / y:710 / y:860. Each row: number `01` / `02` / `03` JetBrains Mono Bold 36pt Muted Gold (x:120). Row title in Cormorant 500 32pt Harbor Navy (x:200): `Full Fee` · `Partial Bundle` · `Fully Bundled.`. Below each title (y +44px) the annual delta line in JetBrains Mono 18pt Graphite tracking 0.10em, e.g. `+$0 / yr · 30%+ ratio · search penalty`, `+$2,140 / yr · 18% ratio · mild`, `+$3,840 / yr · 0% ratio · no penalty`. Row 3 number `03` rendered in Clay Rose `#B5725E` (Variant B's single warmth accent — single use, ≤3% surface).
- Bottom (1000–1500): 48px gold rule centered y:1080. Subhead `Run it on your ADR. Pick the winner.` Inter 400 Italic 22pt Graphite centered y:1130. Wordmark + mono URL identical to Pin 1.

**Headline:** `Bundle, Partial, or Pass-Through?` · Cormorant Garamond 500, 64pt, Harbor Navy, centered y:240–410
**Subhead:** `Run it on your ADR. Pick the winner.` · Inter 400 Italic, 22pt, Graphite, centered y:1130
**Number/data callout:** Three deltas in JetBrains Mono 18pt Graphite (`+$0`, `+$2,140`, `+$3,840`); row numerals JetBrains Mono Bold 36pt Muted Gold (rows 1–2) and Clay Rose `#B5725E` (row 3 only)
**Brand mark:** Same as Pin 1 — wordmark centered y:1340, mono URL y:1290, SKU watermark top-right
**Shape elements:** 48px × 1px gold rules at y:450 and y:1080. Optional: 1px Parchment Alt `#EFE5D0` hairline divider between rows at y:683, y:833 (very subtle, alt-row anchor)
**Reference assets:** Strategy figures from `templates/_masters/REV-001-cleaning-fee-optimizer.xlsx` Strategies tab.
**Designer note:** The `+$3,840` row is the answer the workbook gives — it must read first when the eye lands. Set its row title `Fully Bundled.` slightly heavier (Cormorant 600) than the other two row titles; do not enlarge font size. Visual weight by weight, not by scale.

## Pin 3 — Before: Pricing Notes. After: +$3,840 a Year. (Before-after · Variant A)

**Linked URL:** thestrledger.com/products/cleaning-fee-optimizer
**Pin description:** Before: a Notes app full of "what should the fee be" scribbles and a search rank that keeps drifting. After: one workbook, three strategies compared, a recommendation in writing, and a 60-day review note so you'll know if it worked. Bundling fully into the rate lifted the demo property by $3,840 a year. Excel + Google Sheets. #airbnbtemplate #strpricing #vacationrental

**Composition (top/middle/bottom thirds):**
- Top (0–500): Parchment. Eyebrow `BEFORE / AFTER` JetBrains Mono 14pt Muted Gold tracking 0.30em centered y:140. Headline `Before: pricing notes. / After: +$3,840 a year.` Cormorant 500 60pt Harbor Navy, 2-line, centered y:230–390. Gold terminal period. 48px gold rule centered y:430.
- Middle (500–1000): Vertical split panel — left half (x:0–500, y:540–1000) Parchment Alt `#EFE5D0` band labeled `BEFORE` (mono eyebrow 13pt Graphite tracked 0.22em, top y:560 centered x:250); content: a hand-drawn-feel mock of three crossed-out lines (rendered as Inter 400 Italic 18pt Graphite with a 1px Graphite strikethrough): `~$95 fee?`, `match comp set?`, `lower to $75??`, x:60 y:640/700/760. Bottom of left panel: a tiny stylised dropping bar chart 200×60px showing search-rank decline (3 navy bars descending) anchored x:80 y:880, label `Search rank ↓` Inter 400 14pt Graphite y:960. Right half (x:500–1000, y:540–1000) Harbor Navy `#12304E` block labeled `AFTER` (mono eyebrow 13pt Muted Gold tracked 0.22em centered x:750 y:560); centered giant number `+$3,840` Cormorant 500 88pt Muted Gold y:680, with `/yr` Inter 400 22pt parchment subscripted to baseline at y:740. 48px gold rule centered x:750 y:800. Below: `One recommendation. / In writing.` Cormorant 400 Italic 22pt Parchment centered y:850.
- Bottom (1000–1500): Parchment. Caption `Same property. Same cleaner. Different math.` Inter 400 Italic 22pt Graphite centered y:1090. Wordmark + URL identical to Pin 1.

**Headline:** `Before: pricing notes. After: +$3,840 a year.` · Cormorant 500, 60pt, Harbor Navy, 2-line centered y:230–390
**Subhead:** `Same property. Same cleaner. Different math.` · Inter 400 Italic, 22pt, Graphite, centered y:1090
**Number/data callout:** `+$3,840` Cormorant 500, 88pt, Muted Gold `#C9A24B`, centered in navy AFTER block at y:680
**Brand mark:** Same — wordmark centered y:1340, URL y:1290, SKU watermark top-right `REV-001 · v1.0`
**Shape elements:** Vertical split at x:500 y:540–1000 (1px Graphite hairline divider). Parchment Alt left block (`#EFE5D0`), Harbor Navy right block (`#12304E`). Two gold 48px rules (y:430, AFTER block y:800).
**Reference assets:** None (illustrative). Number sourced from `templates/_masters/REV-001-cleaning-fee-optimizer.xlsx` demo.
**Designer note:** The strikethrough text on the BEFORE side must read messily — don't auto-align. Slight rotation (-1° to +1°) on each line sells the "Notes app" feel. The AFTER block stays rigorously centered. The contrast in tidiness IS the message.

## Pin 4 — Cleaning Fee Ratio: 0% / 15% / 30% — Where Are You? (Infographic · Variant B)

**Linked URL:** thestrledger.com/products/cleaning-fee-optimizer
**Pin description:** Your cleaning fee divided by a 3-night total is the ratio Airbnb uses as a soft ranking signal. Under 15% reads "no penalty." Over 30% reads "penalty, ~10-15% visibility loss estimated." This workbook shows you exactly where your listing sits — and what the bundled-rate alternative would do to that ratio and your annual revenue. Run it once. Re-run when the cleaner's rate changes. #airbnbalgorithm #shorttermrental #strpricing

**Composition (top/middle/bottom thirds):**
- Top (0–500): Parchment. Eyebrow `THE RATIO AIRBNB QUIETLY WATCHES` JetBrains Mono 14pt Muted Gold tracked 0.22em centered y:140. Headline `Where does your / cleaning fee land?` Cormorant 500 64pt Harbor Navy 2-line centered y:240–400. Gold terminal `?`. 48px gold rule centered y:440.
- Middle (500–1000): Horizontal three-band ratio bar, full width x:80–920, y:620–740 (band height 120px). Band 1 (x:80–360, Harbor Navy `#12304E`): label `0–15%` JetBrains Mono Bold 32pt Parchment centered, sub-label `NO PENALTY` JetBrains Mono 14pt Muted Gold tracked 0.22em y:710 centered. Band 2 (x:360–640, Muted Gold `#C9A24B`): `15–30%` Mono Bold 32pt Harbor Navy centered, sub-label `MILD` 14pt Harbor Navy. Band 3 (x:640–920, Clay Rose `#B5725E` — Variant B's single warmth accent surface): `30%+` Mono Bold 32pt Parchment, sub-label `PENALTY · ~10–15% VISIBILITY` Mono 14pt Parchment tracked 0.22em. A single navy down-arrow tick (`▼` Inter 600 28pt Harbor Navy) sits above the bar at x:760 y:580 with mono mini-label `MOST HOSTS` 12pt Graphite tracked 0.22em y:550 — the editorial point: most hosts sit in the penalty zone.
- Bottom (1000–1500): Below ratio bar, supporting line `Cleaning fee ÷ 3-night total = your ratio.` Inter 400 Italic 22pt Graphite centered y:830. 48px gold rule centered y:880. Sub-supporting `Recompute when the cleaner's rate changes.` Inter 400 16pt Graphite centered y:920. Wordmark + mono URL identical to Pin 1, y:1340 / y:1290.

**Headline:** `Where does your cleaning fee land?` · Cormorant 500, 64pt, Harbor Navy, 2-line centered y:240–400
**Subhead:** `Cleaning fee ÷ 3-night total = your ratio.` · Inter 400 Italic, 22pt, Graphite, centered y:830
**Number/data callout:** Band labels `0–15%`, `15–30%`, `30%+` JetBrains Mono Bold, 32pt, hex per band as above
**Brand mark:** Same — wordmark y:1340, URL y:1290, SKU watermark `REV-001 · v1.0` top-right
**Shape elements:** Three solid bands x:80–360 / 360–640 / 640–920 at y:620–740 in Harbor Navy / Muted Gold / Clay Rose. 1px Parchment vertical dividers at x:360, x:640. The "▼ MOST HOSTS" tick at x:760 y:580 is the only typographic ornament. Two gold rules y:440, y:880.
**Reference assets:** Ratio thresholds from `templates/_masters/REV-001-cleaning-fee-optimizer.xlsx` Strategies tab. Penalty band copy from listing/description text.
**Designer note:** Clay Rose appears here as the penalty-band fill — this is the only pin in the set where it occupies a full surface. Total Clay Rose surface across the 4-pin set must stay ≤3% per `brand-decisions.md` §4.2 — keep band 3 at ~280×120 = 33,600 px² out of 1,500,000 px² total = 2.2%, within budget. Do not extend Clay Rose into the supporting lines.

---

## Cross-pin consistency

- **Wordmark:** Cormorant 400 italic 22pt + Cormorant 500 38pt, Harbor Navy with Muted Gold terminal period, centered x:500 y:1340 on every pin. Width ≥160px.
- **Mono URL:** `thestrledger.com` JetBrains Mono 14pt Graphite tracked 0.22em, centered x:500 y:1290 on every pin (above wordmark per pin-set spec).
- **SKU watermark:** `REV-001 · v1.0` JetBrains Mono 11pt Muted Gold tracked 0.20em, top-right x:940 y:60 — identical on all 4.
- **Eyebrow:** All eyebrows JetBrains Mono 14pt Muted Gold tracked 0.22em, baseline y:140 (give or take 20px). Always uppercase.
- **Gold rule:** Always 48px × 1px Muted Gold `#C9A24B`. At least one per pin under headline.
- **Palette discipline:** Only the 6 brand hexes. Clay Rose appears on Pin 2 (single numeral) and Pin 4 (single band only). Never Clay Rose as headline color. Never gradients.
- **Type discipline:** Only Cormorant Garamond / Inter / JetBrains Mono. No fourth font.
- **Brand-signature audit:** Italic "The" (all 4 pins, in wordmark) ✓ · Gold terminal period (all 4 pins) ✓ · 48px gold rule (all 4 pins) ✓ · Tracked uppercase mono (all 4 pins, eyebrow + SKU + URL) ✓ — full compliance with §5.4.
- **Thumbnail check:** At 200×300 thumb, every pin must read its dollar number or ratio number first. Pin 1 = `$3,840`. Pin 2 = `+$3,840`. Pin 3 = `+$3,840`. Pin 4 = `30%+`. Numbers are the visual hero on every pin in the set.
- **Voice consistency:** Variants A (pins 1, 3) name the failure first. Variants B (pins 2, 4) lead clean. Do not soften A. Do not warn in B.
