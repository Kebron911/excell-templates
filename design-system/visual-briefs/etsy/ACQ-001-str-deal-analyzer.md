# Etsy 5-Photo Brief — STR Deal Analyzer (Lite)

**SKU:** ACQ-001  **Listing:** copy/etsy-listings/ACQ-001-str-deal-analyzer.md  **Status:** Production-ready

**Output specs:** 2000 × 2000 PNG, sRGB, <5MB, file naming `ACQ-001-photo-<n>.png`. Etsy max square per `brand/canva-specs.md` Asset 3.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E`, Muted Gold `#C9A24B`, Parchment `#F6EFE2`, Clay Rose `#B5725E`, Graphite `#2B2B2B`, Parchment Alt `#EFE5D0`. Cormorant Garamond (display) / Inter (UI) / JetBrains Mono (data labels). All four brand signatures (italic "The", gold terminal period, 48px gold rule, tracked uppercase mono) appear at least once across the 5-photo set per `brand-decisions.md` §5.4.

---

## Photo 1 — Cover (search-result hook)

**Composition:** Three-band vertical layout — Zone 1 navy top strip (y: 0–200) with logo + domain, Zone 2 parchment headline band (y: 200–540), Zone 3 hero mockup band (y: 540–1760, parchment), Zone 6 muted-gold trust strip (y: 1760–2000). MacBook mockup centered, screen showing the Start tab with the gold "DEAL" verdict and stabilized cash flow $18,400 readout dominant.
**Background:** Parchment `#F6EFE2` for the hero mid-band; Harbor Navy `#12304E` top strip; Muted Gold `#C9A24B` bottom strip. No textures.
**Foreground / hero element:** MacBook (open, neutral angle, white bezel) sized 1200×900px, anchored at x:400–1600, y:580–1480. Screen content is a faithful Start-tab render: gold "DEAL" pill (320×80px) + Y1 / Stabilized cash-flow row reading `$11,200 · $18,400` in JetBrains Mono 24pt navy.
**Headline overlay (centered y: 240):** `Yes-or-No on a Property in 10 Minutes.` · Cormorant Garamond 500 Medium, 64pt, Harbor Navy `#12304E`, letter-spacing -0.01em. Terminal period in Muted Gold `#C9A24B`. 48px × 1px gold rule centered at y: 350.
**Sub-overlay (y: 380):** `Cash-on-cash · DSCR · Cap rate · Verdict.` · Inter 400 Regular, 26pt, Graphite `#2B2B2B`.
**Brand strip (y: 1760–2000):** Muted Gold band, full width, with `Instant Download · 14-Day Refund · Lifetime Updates` in Inter 600 Semibold, 22pt, Harbor Navy, centered y:1862, letter-spacing 0.02em. Wordmark "The STR Ledger." in Zone 1 top strip (Cormorant 38pt, parchment art, gold period), x:60 y:60, plus `thestrledger.com` mono label right-aligned x:1940 y:82, parchment, JetBrains Mono 14pt, tracking 0.15em.
**SKU watermark:** `ACQ-001 · v1.0` JetBrains Mono 11pt, Muted Gold, tracking 0.20em, top-right of Zone 1 strip at x:1940 y:140 (under the domain label).
**Reference asset paths:** `brand/assets/logo-horizontal-reverse.png` (or fallback wordmark per canva-specs §Asset 3 Element 1.1); MacBook mockup via Vista Create `minimal laptop mockup`; Start tab screenshot from `templates/_lite/ACQ-001-str-deal-analyzer-lite.xlsx` (build pending — placeholder rendered tab acceptable until master ships).
**One-line designer note:** The "DEAL" pill must read at 240×240 thumb size — if it shrinks below 12px-equivalent on the laptop screen, scale the pill larger and crop the rest of the workbook chrome away. Verdict is the visual hero, not the laptop.

## Photo 2 — Workbook screenshot (Verdict tab)

**Composition:** Full-bleed parchment with a single screenshot dominant — the Verdict tab — framed at 1700×1200px centered (x:150–1850, y:520–1720). Headline above, sub below, brand strip bottom.
**Background:** Parchment `#F6EFE2`. 8px Parchment Alt `#EFE5D0` 1px hairline border around the screenshot.
**Foreground / hero element:** Verdict tab rendering showing six metric rows (Cash-on-Cash 10.0%, DSCR 1.41, Cap Rate 6.8%, IRR 14.2%, Break-even Occ 41%, Stabilized Net $18,400) with the gold ✅ DEAL band beneath. Numbers in JetBrains Mono 28pt navy; row labels Inter 500 14pt graphite; banded with Parchment Alt alt rows.
**Headline overlay (top, y: 240):** `The Math Your CPA Won't Argue With.` · Cormorant Garamond 500 Medium, 56pt, Harbor Navy. Gold terminal period. 48px gold rule at y: 350.
**Sub-overlay (y: 390):** `Cited benchmarks. Not vibes.` · Inter 400 Italic, 22pt, Graphite.
**Brand strip:** Same gold trust strip as Photo 1. Wordmark + domain top strip identical.
**SKU watermark:** Identical placement to Photo 1.
**Reference asset paths:** `templates/_lite/ACQ-001-str-deal-analyzer-lite.xlsx` Verdict tab; brand wordmark same as Photo 1.
**One-line designer note:** Do NOT recolor the screenshot — the workbook itself is on-brand (Harbor Navy header rows, Parchment alt banding, Muted Gold verdict). Crop tightly; no Excel ribbon, no gridlines outside the data range.

## Photo 3 — What's inside (6-tab strip)

**Composition:** Six-tab vertical stack centered on parchment. Each tab is a 1700×180px card with eyebrow mono label, Cormorant title, one-line description, hairline parchment-deep border. Tabs stacked y:520–1620 with 24px gutters.
**Background:** Parchment `#F6EFE2`; alt-row tint Parchment Alt `#EFE5D0` for tabs 2/4/6.
**Foreground / hero element:** Six tab cards. Mono eyebrows: `01 · START`, `02 · PROPERTY`, `03 · MARKET`, `04 · COSTS`, `05 · FINANCE`, `06 · VERDICT` — JetBrains Mono 14pt, Muted Gold, tracking 0.22em. Each title (Cormorant 500, 28pt, Harbor Navy) followed by a 36px gold rule and Inter 14pt graphite description (e.g., `Verdict band · Y1 + stabilized cash flow side-by-side`).
**Headline overlay (top, y: 240):** `Six tabs. Twenty-five inputs. One verdict.` · Cormorant Garamond 500 Medium, 52pt, Harbor Navy. Gold terminal period. 48px gold rule at y: 350.
**Sub-overlay (y: 390):** `What you get inside the workbook.` · Inter 400 Regular, 22pt, Graphite.
**Brand strip:** Identical Zone 1 and Zone 6 to Photo 1.
**SKU watermark:** Identical placement.
**Reference asset paths:** Tab structure derived from listing description "WHAT'S INCLUDED (LITE)" section.
**One-line designer note:** Do NOT use icons inside the tab cards. The brand carries this surface with type alone (`design-system/README.md` Iconography rule). Rule lengths must all match (36px), no exceptions.

## Photo 4 — Math / result moment

**Composition:** Big-number panel. Gatlinburg cabin sample input row at top (mono), giant gold result number center, three supporting metrics below in a tracked mono row.
**Background:** Parchment `#F6EFE2` full bleed; centered Harbor Navy block (1400×900px, x:300, y:540) for contrast.
**Foreground / hero element:** Inside navy block — eyebrow `SAMPLE PROPERTY · GATLINBURG TN` JetBrains Mono 14pt parchment tracking 0.22em (y: 600). Below it, sample row `3BR · $485K · ADR $285 · Stabilized 68%` Inter 400 18pt parchment, y: 640. Then the giant number: `10.0%` Cormorant Garamond 500 Medium, 240pt, Muted Gold `#C9A24B`, centered y: 760–1080 (period replaced by terminal `%` sized 180pt). Below: `Stabilized Cash-on-Cash` Cormorant 400 Italic, 32pt, parchment, y: 1140. 48px gold rule y: 1220. Bottom row inside navy block: `DSCR 1.41 · IRR 14.2% · ✅ DEAL` JetBrains Mono 22pt, Muted Gold, tracking 0.20em, y: 1280.
**Headline overlay (above navy block, y: 320):** `One Property. One Verdict.` · Cormorant Garamond 500 Medium, 56pt, Harbor Navy. Gold period. 48px gold rule at y: 420.
**Sub-overlay (y: 460):** `The math, in ten minutes.` · Inter 400 Italic, 22pt, Graphite.
**Brand strip:** Gold trust strip (same copy as Photo 1) plus wordmark/domain top strip — identical.
**SKU watermark:** Identical placement.
**Reference asset paths:** Sample data per listing §"Why this pays for itself."
**One-line designer note:** The 10.0% must be the absolute biggest type element on this set — bigger than any headline. If the cap-height of the "10" is less than 240px tall in the final, scale up before shipping.

## Photo 5 — Brand strip / About

**Composition:** Editorial about-card. Top quarter Harbor Navy with monogram + wordmark, lower three-quarters parchment with positioning copy, trust badges, and a single Clay Rose accent line. Asymmetric — left-weighted text, right column reserved for icon-free trust list.
**Background:** Top band Harbor Navy `#12304E` (y: 0–500); main Parchment `#F6EFE2` (y: 500–1760); Muted Gold trust strip y:1760–2000.
**Foreground / hero element:** Navy band — circle monogram (filled navy with parchment "S" + gold "L", 220×220px) at x: 80 y: 140, plus stacked wordmark `The / STR Ledger.` (Cormorant 400 italic 28pt + Cormorant 500 80pt, parchment, gold terminal period) at x: 360 y:120. 48px gold rule under the wordmark (x: 360, y: 280). Below in Inter 400 Italic 22pt parchment: `Editorial-finance workbooks for Airbnb hosts.` x: 360 y: 320. Parchment band — left column (x: 120, y: 600): eyebrow `WHY THIS WORKBOOK` JetBrains Mono 13pt Muted Gold tracking 0.22em, then a 56pt Cormorant 500 navy headline `Built for hosts who treat the portfolio like a real business.` (gold period), 48px gold rule, then 18pt Inter 400 graphite paragraph (~3 lines): `Twenty-five inputs. One verdict. Cited benchmarks. The same workbook serious operators run before they sign — now in Lite form for $27.` Right column (x: 1180, y: 620): single-color trust list (no icons), each row Inter 500 16pt navy: `Instant download (.xlsx + PDFs)`, `14-day refund · no questions`, `Lifetime updates · email delivery`, `Excel 2016+, 365, Google Sheets`. One Clay Rose `#B5725E` accent rule (60×3px) above the right column, x:1180 y:600.
**Headline overlay:** Embedded above (no separate overlay).
**Sub-overlay:** Embedded above.
**Brand strip:** Same Muted Gold trust strip y:1760–2000 as the rest of the set, copy identical.
**SKU watermark:** Identical placement.
**Reference asset paths:** `design-system/assets/monogram-filled.svg`, `design-system/assets/wordmark-on-navy.svg`.
**One-line designer note:** This is the only photo where Clay Rose appears — keep it to a single 60×3px rule, never as a fill. Clay Rose dominating breaks `brand-decisions.md` §4.2 ratio (3% max).

---

## Cross-photo rules
- Brand-strip wordmark color, position, size: identical across all 5 (Cormorant 38pt, Parchment art, Muted Gold terminal period, x:60 y:60 in Zone 1).
- SKU watermark: `ACQ-001 · v1.0`, JetBrains Mono 11pt, Muted Gold, x:1940 y:140, tracking 0.20em — identical across all 5.
- Color palette: only Harbor Navy `#12304E`, Parchment `#F6EFE2`, Parchment Alt `#EFE5D0`, Muted Gold `#C9A24B`, Clay Rose `#B5725E` (Photo 5 only), Graphite `#2B2B2B`. No auxiliaries, no gradients.
- Typography: only Cormorant Garamond, Inter, JetBrains Mono. No fourth font, ever.
- Photo 1 must read at 240×240px Etsy thumbnail size — verify the gold "DEAL" pill is identifiable and the headline reads the word "Yes-or-No" before finalizing.
