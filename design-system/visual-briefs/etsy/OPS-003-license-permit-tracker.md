# Etsy 5-Photo Brief — License/Permit/STR-Reg Tracker

**SKU:** OPS-003  **Listing:** copy/etsy-listings/OPS-003-license-permit-tracker.md  **Status:** Production-ready (fact-check on Nashville/Austin fines pending per listing)

**Output specs:** 2000 × 2000 PNG, sRGB, <5MB, file naming `OPS-003-photo-<n>.png`. Etsy max square per `brand/canva-specs.md` Asset 3.

**Brand reference:** brand/canva-specs.md §"Asset 3 — Thumbnail Master" — Harbor Navy `#12304E`, Muted Gold `#C9A24B`, Parchment `#F6EFE2`, Clay Rose `#B5725E`, Graphite `#2B2B2B`, Parchment Alt `#EFE5D0`. Cormorant Garamond / Inter / JetBrains Mono. All four brand signatures (italic "The", gold terminal period, 48px gold rule, tracked uppercase mono) appear at least once across the 5-photo set per `brand-decisions.md` §5.4.

---

## Photo 1 — Cover (search-result hook)

**Composition:** Three-band master layout. The visual is consequence-first — a giant Clay Rose fine figure (`$750 + 30 days`) anchors the parchment band, with a MacBook mockup of the Renewal Calendar tab below as the receipt. This photo leads with stakes per listing §pre-publish directive.
**Background:** Parchment `#F6EFE2` mid-band; Harbor Navy `#12304E` top strip y:0–200; Muted Gold `#C9A24B` trust strip y:1760–2000.
**Foreground / hero element:** Centered upper hero: eyebrow `COST OF ONE MISSED NASHVILLE RENEWAL` JetBrains Mono 14pt navy tracked 0.22em y:580. Below it the giant figure `$750` Cormorant 500 Medium 200pt Clay Rose `#B5725E` y:620–860. Below the figure: `+ 30-day operating suspension` Cormorant 400 Italic 36pt navy y:880. 48px gold rule y:960. Below that, MacBook mockup 1000×750px centered x:500–1500, y:1000–1750, screen showing Renewal Calendar tab — top row EXPIRED in Clay Rose text (`-7 days · Nashville STR permit`), then RENEW NOW band in Clay Rose tint (`12 days · Austin · $2,000 fine if missed`), then UPCOMING in Muted Gold tint.
**Headline overlay (centered y:240):** `An Alarm Clock for the Renewals You'd Otherwise Forget.` · Cormorant Garamond 500 Medium, 50pt, Harbor Navy `#12304E`, letter-spacing -0.01em. Terminal period in Muted Gold `#C9A24B`. 48px × 1px gold rule centered y:380.
**Sub-overlay (y:420):** `Multi-city · Auto-countdown · CPA-grade.` · Inter 400 Regular, 24pt, Graphite `#2B2B2B`.
**Brand strip (y:1760–2000):** Muted Gold band, full width, `Instant Download · 14-Day Refund · Lifetime Updates` Inter 600 Semibold 22pt Harbor Navy, centered y:1862, tracking 0.02em. Wordmark "The STR Ledger." in Zone 1 (Cormorant 38pt parchment art, gold period) x:60 y:60, plus `thestrledger.com` mono 14pt parchment tracked 0.15em x:1940 y:82.
**SKU watermark:** `OPS-003 · v1.0` JetBrains Mono 11pt Muted Gold tracked 0.20em, x:1940 y:140.
**Reference asset paths:** `brand/assets/logo-horizontal-reverse.png`; MacBook mockup via Vista Create `minimal laptop mockup`; Renewal Calendar tab from `templates/_masters/OPS-003-license-permit-tracker.xlsx` (build pending — placeholder rendered tab acceptable until master ships).
**One-line designer note:** Clay Rose at this size violates the 3% rule unless tightly controlled — keep the `$750` numeral and nothing else in Clay Rose, with all surrounding chrome in navy/parchment. The fine figure is the entire emotional payload of this cover. Verify Nashville $750 + 30-day figures per listing fact-check directive before render.

## Photo 2 — Workbook screenshot (Renewal Calendar)

**Composition:** Full-bleed parchment with the Renewal Calendar tab cropped tight. Three banded sections clearly visible: EXPIRED above the line, RENEW NOW (under 30 days), UPCOMING (30–90 days). The eye should walk the urgency band top-to-bottom.
**Background:** Parchment `#F6EFE2`. 1px Parchment Alt `#EFE5D0` hairline border around the screenshot.
**Foreground / hero element:** Calendar tab rendering 1700×1200px centered x:150–1850, y:520–1720. Three horizontal bands: EXPIRED band y:520–740 with Clay Rose `#B5725E` 4px left bar and Clay Rose-tinted rows (12% opacity); rows show `Nashville STR permit · -7 days · OPERATING WHILE EXPIRED` JetBrains Mono 18pt Clay Rose. RENEW NOW band y:740–1140 with Muted Gold left bar but Clay Rose row tint (still under 30); rows `Austin business license · 12 days`, `Asheville sales tax registration · 23 days`. UPCOMING band y:1140–1720 with Muted Gold left bar and Muted Gold tint (12% opacity); rows `Joshua Tree STR permit · 47 days`, `Phoenix lodging tax · 68 days`. Column headers Inter 500 14pt navy: `PROPERTY · PERMIT TYPE · DAYS-TO-RENEWAL · COST · STATUS`.
**Headline overlay (top, y:240):** `Three Bands. Every Renewal. Every City.` · Cormorant Garamond 500 Medium, 52pt, Harbor Navy. Gold terminal period. 48px gold rule y:350.
**Sub-overlay (y:390):** `Conditional formatting does the worrying for you.` · Inter 400 Italic, 22pt, Graphite.
**Brand strip:** Identical Zone 1 and Zone 6 to Photo 1.
**SKU watermark:** Identical placement.
**Reference asset paths:** `templates/_masters/OPS-003-license-permit-tracker.xlsx` Renewal Calendar tab.
**One-line designer note:** Clay Rose tints sit at 12% opacity max — solid Clay Rose blocks would break §4.2. The OPERATING WHILE EXPIRED chip is the only text-only Clay Rose moment on this surface and it must read at thumb size.

## Photo 3 — What's inside (6-tab strip + Permit Discovery callout)

**Composition:** Six tab cards on parchment, with a Clay Rose-bordered callout featuring the top-15-city Permit Discovery reference — the "I'd buy this just for the city list" differentiator. Tabs y:520–1500; callout y:1530–1700.
**Background:** Parchment `#F6EFE2`; alt rows Parchment Alt for tabs 2/4/6.
**Foreground / hero element:** Six tab cards (1700×140px each, 16px gutters) — eyebrows `01 · START`, `02 · PERMITS REGISTER`, `03 · RENEWAL CALENDAR`, `04 · PERMIT DISCOVERY`, `05 · FILING LOG`, `06 · SETTINGS` JetBrains Mono 13pt Muted Gold tracked 0.22em. Each title Cormorant 500 26pt navy + 36px gold rule + Inter 14pt graphite description (e.g., `200-row capacity · 25 properties × 8 permit types`). Sidebar callout (1700×170px) with 1.5px Clay Rose border, eyebrow `PERMIT DISCOVERY · TOP 15 STR CITIES` mono 13pt Clay Rose tracked 0.22em, body Inter 500 16pt graphite (2 lines): `Nashville · Gatlinburg · Austin · Asheville · Phoenix · Orlando · Joshua Tree · Hilton Head · Myrtle Beach · San Diego · Denver · Savannah · Outer Banks · Miami · New Orleans · Big Bear. Typical permit stack, fees, renewal cadence, "as of" stamps.`
**Headline overlay (y:240):** `Six Tabs. Top 15 Cities. Zero Missed Renewals.` · Cormorant Garamond 500 Medium, 48pt, Harbor Navy. Gold period. 48px gold rule y:360.
**Sub-overlay (y:400):** `What you get inside the workbook.` · Inter 400 Regular, 22pt, Graphite.
**Brand strip:** Identical.
**SKU watermark:** Identical.
**Reference asset paths:** Tab structure from listing §"WHAT'S INCLUDED."
**One-line designer note:** The 16-city list inside the callout body must be copy-pasted exactly per listing — these are the search keywords doing double duty as differentiator copy. Do not abbreviate.

## Photo 4 — Math / result moment (the math of the miss)

**Composition:** Big-number panel. The hero is `$6,150` — total exposure on one missed Nashville renewal. The number sits in the Clay Rose for the visceral hit, with the breakdown in mono below.
**Background:** Parchment `#F6EFE2` full bleed; centered Harbor Navy block 1400×900px (x:300, y:540).
**Foreground / hero element:** Inside navy block — eyebrow `ONE MISSED NASHVILLE RENEWAL · 60% OCC · $300 ADR` JetBrains Mono 14pt parchment tracked 0.22em y:600. Sample row: `STR permit · expired 7 days · operating-while-expired flag` Inter 400 18pt parchment y:640. Giant figure `$6,150` Cormorant 500 Medium 240pt Clay Rose `#B5725E`, centered y:760–1080. Below: `Total exposure on one date` Cormorant 400 Italic 32pt parchment y:1140. 48px gold rule y:1220. Bottom breakdown row: `$750 fine · $5,400 lost revenue (30-day suspension) · workbook $47` JetBrains Mono 20pt Muted Gold tracked 0.20em y:1280.
**Headline overlay (above navy block, y:320):** `What One Missed Date Costs.` · Cormorant Garamond 500 Medium, 56pt, Harbor Navy. Gold period. 48px gold rule y:420.
**Sub-overlay (y:460):** `Fine plus 30 days of zero revenue.` · Inter 400 Italic, 22pt, Graphite.
**Brand strip:** Identical.
**SKU watermark:** Identical.
**Reference asset paths:** Sample math per listing §"Why this pays for itself on one renewal."
**One-line designer note:** The `$6,150` in Clay Rose is the only Clay Rose on this entire surface — the navy block and the gold rule absorb everything else. If the figure does not punch at thumb size against the navy block, do NOT switch to gold (that's the wrong emotion); brighten the navy fill 4–6%.

## Photo 5 — Brand strip / About

**Composition:** Editorial about-card identical to ACQ-001/002 Photo 5 layout — navy band top, parchment band main, gold trust strip bottom.
**Background:** Top band Harbor Navy `#12304E` y:0–500; main Parchment `#F6EFE2` y:500–1760; Muted Gold trust strip y:1760–2000.
**Foreground / hero element:** Navy band — filled monogram 220×220px x:80 y:140, plus stacked wordmark `The / STR Ledger.` (Cormorant 400 italic 28pt + Cormorant 500 80pt, parchment, gold terminal period) at x:360 y:120, 48px gold rule under wordmark y:280, Inter 400 italic 22pt parchment tagline `Editorial-finance workbooks for Airbnb hosts.` x:360 y:320. Parchment band — left col (x:120 y:600): eyebrow `WHY THIS WORKBOOK` mono 13pt gold tracked 0.22em; Cormorant 500 56pt navy headline `The brain cannot hold 40 renewal dates. The spreadsheet can.` (gold period); 48px gold rule; Inter 400 18pt graphite ~3-line para: `Six tabs. 200-row register. Top-15-city reference. Days-to-renewal countdown that paints itself red so you see the problem before the city does. Operator-grade — no Etsy Lite, because a stripped permit tracker is dangerous.` Right col (x:1180 y:620): single Clay Rose 60×3px rule, then trust list rows Inter 500 16pt navy — `Instant download (.xlsx + 3 PDFs)`, `14-day refund`, `Lifetime updates`, `Excel 2016+, 365, Google Sheets`.
**Headline overlay:** Embedded above.
**Sub-overlay:** Embedded above.
**Brand strip:** Identical Muted Gold trust strip.
**SKU watermark:** Identical.
**Reference asset paths:** `design-system/assets/monogram-filled.svg`, `design-system/assets/wordmark-on-navy.svg`.
**One-line designer note:** Single 60×3px Clay Rose accent only. The stakes-first voice already lives in Photos 1 and 4 — Photo 5 should feel like the calm professional hand on the shoulder.

---

## Cross-photo rules
- Brand-strip wordmark color, position, size: identical across all 5.
- SKU watermark: `OPS-003 · v1.0`, JetBrains Mono 11pt Muted Gold, x:1940 y:140, tracking 0.20em — identical.
- Palette: only the 6 brand hexes above. Clay Rose appears more here than other SKUs because the product IS about consequence — but always as text, accent, or 12%-opacity tint. Never as a solid block.
- Typography: only Cormorant Garamond / Inter / JetBrains Mono.
- Photo 1 must read at 240×240px Etsy thumbnail — verify the `$750` reads in Clay Rose against parchment before finalizing.
- Fact-check Nashville $750 + 30-day suspension and Austin $2,000 figures per listing §pre-publish directive before any render leaves the build.
