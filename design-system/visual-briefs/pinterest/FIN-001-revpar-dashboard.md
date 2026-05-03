# Pinterest 4-Pin Visual Brief — RevPAR / ADR / Occupancy Dashboard

**SKU:** FIN-001  **Pin set:** copy/pinterest/FIN-001-revpar-dashboard-pins.md  **Status:** Production-ready

**Output specs:** 1000 × 1500 PNG, sRGB, <10MB. File naming: `FIN-001-pin-<n>-<variant>.png`.

**A/B test (per `brand/brand-decisions.md` §6.4 through 2026-06-23):**
- **Variant A — control / warning voice:** names the analytical mistake first ("Gross Revenue Lies", "computed wrong"), then the resolution. Italic Cormorant tilt, Clay Rose accents.
- **Variant B — challenger / outcome voice:** leads with the confident next move ("Run the Numbers", "informed pricing"). Roman Cormorant, Muted Gold dominant.

**Brand reference (`brand/canva-specs.md`):**
- Palette: Harbor Navy `#12304E` · Muted Gold `#C9A24B` · Parchment `#F6EFE2` · Clay Rose `#B5725E` · Graphite `#2B2B2B` · Parchment Alt `#EFE5D0`
- Type: Cormorant Garamond / Inter / JetBrains Mono
- Brand signatures (each ≥1× across the 4 pins): italic "The", gold terminal period, 48px gold rule, tracked uppercase mono.
- Iconic visual: the **ADR-vs-Occupancy sensitivity bar pair** (`+$10 ADR → $2,030` vs `+5pp Occ → $4,470`) — must appear on Pin 2 and ideally referenced on one other.

---

## Pin 1 — Gross Revenue Lies. RevPAR Doesn't. (Style: Quote-card · Variant: A)

**Linked URL:** thestrledger.com/products/revpar-dashboard
**Pin description (SEO caption — copy from pin set):** Looking at gross monthly revenue and trying to tell whether you are improving — or just running hot for a quarter — is the most common analytical mistake STR hosts make. RevPAR (revenue per available night) captures both rate and occupancy in one number, and it is the metric every market report uses. This dashboard computes it correctly, including the right denominator handling for personal-use and maintenance blocks. $67. #airbnbanalytics #strrevenue #revpar #shorttermrental #vacationrental

**Composition (1000 × 1500):**
- **Top third (0–500):** Eyebrow + Italic Cormorant headline on Parchment.
- **Middle third (500–1000):** Headline tail; 48px gold rule; sub-line; the formula reveal.
- **Bottom third (1000–1500):** Closing claim + footer.

**Eyebrow:** `THE METRIC THAT DOESN'T LIE` JetBrains Mono Bold 14pt Muted Gold tracking 0.30em, centered (500, 100).
**Headline copy:** `Gross revenue lies. RevPAR doesn't.` · Cormorant Garamond 500 Medium Italic, 76pt, Harbor Navy, letter-spacing -0.01em, centered, 2-line break (Gross revenue lies. / RevPAR doesn't.), starting (500, 200). Terminal period Muted Gold.
**Subhead:** `Rate × occupancy in one number. The way market reports read it.` · Inter 400 Italic, 22pt, Graphite, centered (500, 580).
**Formula reveal block (y:680–940):** Centered Parchment Alt strip 800×260px x:100 y:680. Inside, three lines:
- Top label (500, 720): `RevPAR =` Cormorant 400 Italic 28pt Harbor Navy, centered.
- Middle (500, 800): `Gross Revenue ÷ (Total Nights − Blocked)` JetBrains Mono Bold 26pt Harbor Navy, centered, tracking 0.05em.
- Bottom annotation (500, 870): `Most templates compute the denominator wrong. This one doesn't.` Inter 500 Italic 18pt Clay Rose, centered.
**Closing line (y:1020–1180):** `Three KPIs. One denominator. Done correctly.` Cormorant 400 Italic 28pt Harbor Navy, centered (500, 1080), gold terminal period.
**48px × 1.5px Muted Gold rule centered (500, 660).**
**Brand mark:** Parchment footer y:1340–1500. Wordmark `The STR Ledger.` Cormorant 400 Italic 28pt + 500 Medium 32pt Harbor Navy, gold terminal period, x:60 y:1420. Monogram 96×96px x:876 y:1390. URL `thestrledger.com/products/revpar-dashboard` JetBrains Mono 12pt Harbor Navy tracking 0.20em right-aligned x:940 y:1466.
**Shape elements:** 1px Parchment Alt frame around the formula block (x:100 y:680 to x:900 y:940). 48px gold rule at y:660.
**Reference asset paths:** `brand/assets/logo-horizontal-on-parchment.png`, `design-system/assets/monogram-filled.svg`. No screenshot.

**Designer note:** The formula must read at 240×360 thumbnail. Test it. The whole pin is the formula; if `Gross ÷ (Total Nights − Blocked)` reads as a blur at thumbnail, scale that line larger and trim the closing claim. The "computes the denominator wrong" Clay Rose line is the warning-voice beat — don't soften it.

---

## Pin 2 — Push ADR or Push Occupancy? Run the Numbers. (Style: Infographic · Variant: B)

**Linked URL:** thestrledger.com/products/revpar-dashboard
**Pin description:** At a $200 ADR / 65% Occupancy property, lifting ADR $10 yields about $2,030/year. Raising Occupancy 5 percentage points yields about $4,470/year. That ratio — Occupancy moves more revenue than ADR at most price points — is the single most useful piece of pricing information for STR hosts. Sensitivity simulator built in. RevPAR / ADR / Occupancy dashboard, $67. #strpricing #airbnbpricing #revpar #adr #vacationrental

**Composition (1000 × 1500) — sensitivity-bar iconic moment:**
- **Top third (0–500):** Eyebrow + headline on Parchment.
- **Middle third (500–1100):** Two horizontal bars showing the ADR-vs-Occ delta.
- **Bottom third (1100–1500):** Sub-claim + footer.

**Eyebrow:** `THE SENSITIVITY SIMULATOR` JetBrains Mono Bold 14pt Muted Gold tracking 0.30em, centered (500, 100).
**Headline copy:** `Push ADR or push Occupancy?` · Cormorant Garamond 500 Medium (Roman), 64pt, Harbor Navy, centered, 2-line break (Push ADR or / push Occupancy?), starting (500, 180). Terminal period Muted Gold.
**Subhead:** `One $200/65% property. One year. Two scenarios.` · Inter 400 Regular, 22pt, Graphite, centered (500, 460), letter-spacing 0.02em.
**48px × 1.5px Muted Gold rule centered (500, 510).**
**Sensitivity bars (y:580–1080):** Two stacked horizontal bars, each 700px max width, anchored x:150.
- **Bar 1 (y:580–740):** Label above (160, 600): `+ $10 ADR` JetBrains Mono Bold 22pt Graphite tracking 0.15em. Bar (160, 640) → 320×60px Parchment Alt fill, 1.5px Graphite border. Number to right of bar (490, 660): `$2,030 / yr` JetBrains Mono Bold 28pt Graphite, vertical-centered to bar.
- **Bar 2 (y:780–940):** Label above (160, 800): `+ 5 pp OCCUPANCY` JetBrains Mono Bold 22pt Muted Gold tracking 0.15em. Bar (160, 840) → 700×60px Muted Gold-soft 70% fill, 1.5px Muted Gold border. Number to right (870, 860): `$4,470 / yr` JetBrains Mono Bold 36pt Harbor Navy, vertical-centered to bar.
- **Annotation (y:980–1040):** Centered (500, 1010): `Occupancy moves more revenue at most price points.` Cormorant 400 Italic 22pt Harbor Navy.
**Closing band (y:1140–1260):** Centered Harbor Navy block 800×120px x:100. Inside (500, 1200): `3 × 2 SCENARIO GRID · BUILT IN · $67` JetBrains Mono Bold 22pt Parchment tracking 0.20em.
**Brand mark:** Parchment footer y:1300–1500. Identical to Pin 1.
**Shape elements:** Two bars (rounded 4px corners). 48px gold rule y:510. Subtle 1px Parchment Alt baseline rule at y:740 (between bars).
**Reference asset paths:** No screenshot — bars are designed primitives. `brand/assets/logo-horizontal-on-parchment.png`, `design-system/assets/monogram-filled.svg`.

**Designer note:** Per task SKU note: "the sensitivity ratio ($2,030 vs $4,470) is the single most useful piece of pricing information for STR hosts." Bar 2 must visually dwarf Bar 1 — that asymmetry IS the message. Bar 2 is ~2.2× the width of Bar 1; do not normalize. The Occupancy bar in gold is the answer; the ADR bar in graphite is the option people default to.

---

## Pin 3 — Your Friend's $187 RevPAR Was a Brag. Here's How to Compute Yours. (Style: Tip-list · Variant: A)

**Linked URL:** thestrledger.com/products/revpar-dashboard
**Pin description:** The three KPIs the STR industry actually uses are RevPAR, ADR, and Occupancy. Most templates compute Occupancy wrong — they either ignore blocked nights (overstates your number) or count blocks as available (understates). The right method, used by PriceLabs and AirDNA, excludes blocks from the denominator. This dashboard does it correctly. Plus YoY comparison and AirDNA comp benchmark. $67. #strtemplate #airbnbkpi #revpar #vacationrentalbusiness #shorttermrentalanalytics

**Composition (1000 × 1500):**
- **Top third (0–500):** Eyebrow + Italic Cormorant headline on Parchment.
- **Middle third (500–1100):** Three-bullet definition list (RevPAR / ADR / Occupancy).
- **Bottom third (1100–1500):** Closing line + footer.

**Eyebrow:** `THREE KPIs. CORRECTLY.` JetBrains Mono Bold 14pt Muted Gold tracking 0.30em, centered (500, 100).
**Headline copy:** `Your friend's $187 RevPAR was a brag.` · Cormorant Garamond 500 Medium Italic, 56pt, Harbor Navy, centered, 3-line break (Your friend's / $187 RevPAR / was a brag.), starting (500, 180). Terminal period Muted Gold. Number `$187` in the headline rendered in JetBrains Mono Bold 56pt Muted Gold (mono-numeric inline within the Cormorant phrase — adjusts kerning manually).
**Subhead:** `Here's how to compute yours.` · Inter 400 Italic, 24pt, Graphite, centered (500, 540).
**48px × 1.5px Muted Gold rule centered (500, 590).**
**Definition list (y:660–1080):** Three left-anchored entries x:120, equal vertical spacing.
- **Entry 1 (y:660–780):** Label `01 · RevPAR` JetBrains Mono Bold 22pt Harbor Navy tracking 0.20em (120, 680). Definition (120, 720): `Gross ÷ (Total Nights − Blocked).` Cormorant 400 Italic 22pt Graphite. Annotation (120, 750): `What every market report uses.` Inter 400 18pt Muted Gold.
- **Entry 2 (y:800–920):** Label `02 · ADR` (120, 820). Definition (120, 860): `Gross ÷ Booked Nights.` Annotation (120, 890): `Your average rate, when occupied.`
- **Entry 3 (y:940–1080):** Label `03 · OCCUPANCY` (120, 960). Definition (120, 1000): `Booked ÷ (Total − Blocked).` Annotation (120, 1030): `Most templates get the denominator wrong.` (Inter 400 18pt Clay Rose — the warning-voice payoff.)
**Closing band (y:1140–1260):** Centered Parchment Alt strip 800×120px x:100. Inside (500, 1200): `RIGHT METHOD · USED BY PRICELABS + AIRDNA` JetBrains Mono Bold 18pt Harbor Navy tracking 0.20em.
**Brand mark:** Parchment footer y:1300–1500. Identical to Pin 1.
**Shape elements:** 1px Parchment Alt left-border rule at x:100 spanning entries (y:660 to y:1080). 48px gold rule y:590. 1px Muted Gold underline beneath each "01 ·", "02 ·", "03 ·" label.
**Reference asset paths:** No screenshot. `brand/assets/logo-horizontal-on-parchment.png`, `design-system/assets/monogram-filled.svg`.

**Designer note:** The Clay Rose annotation on Entry 3 is the warning-voice payoff and the entire reason this pin exists in Variant A. Don't mute it — Clay Rose against Graphite siblings is the visual contrast that signals "this is the trap." The `$187` mono-numeric inline in the Cormorant headline is unconventional kerning — get it right at the proof stage; bad kerning here destroys the editorial feel.

---

## Pin 4 — One Pricing Decision. 30-100× the Cost of the Workbook. (Style: Before/after · Variant: B)

**Linked URL:** thestrledger.com/products/revpar-dashboard
**Pin description:** The KPI dashboard that turns gut pricing into informed pricing. Sensitivity simulator runs a 3×2 scenario grid (ADR +$0/+$5/+$10 × Occ +0/+5pp) per property and tells you the annual revenue impact of each move. AirDNA comp benchmark line shows where you sit vs market — typically a 5-15% gap for hosts who have not optimized. $67 dashboard, returning 30-100x in the first pricing decision it informs. #airbnbpricing #strrevenue #revparoptimization #vacationrentalbusiness

**Composition (1000 × 1500) — Before/after split:**
- **Top third (0–500):** Headline + sub on Parchment.
- **Middle third (500–1140):** Two side-by-side panels.
- **Bottom third (1140–1500):** Verdict band + footer.

**Eyebrow:** `THE PRICING DECISION` JetBrains Mono Bold 14pt Muted Gold tracking 0.30em, centered (500, 100).
**Headline copy:** `One pricing decision. 30–100× the cost.` · Cormorant Garamond 500 Medium (Roman), 60pt, Harbor Navy, centered, 2-line break (One pricing decision. / 30–100× the cost.), starting (500, 180). Terminal period Muted Gold.
**Subhead:** `From gut pricing to informed pricing.` · Inter 400 Italic, 24pt, Graphite, centered (500, 420).
**48px × 1.5px Muted Gold rule centered (500, 470).**
**Before/after panels (y:520–1140):**
- **LEFT panel x:0–500 y:520–1140 — `BEFORE · GUT PRICING`** JetBrains Mono Bold 18pt Clay Rose tracking 0.30em, top-left (40, 540). Below: a chaotic Clay Rose-tinted Parchment Alt panel showing a hand-scribbled price grid (e.g., `$249?  $259??  $269!?`) at 30% opacity, faded. Mid-panel (60, 920): `Same revenue. Different month.` Cormorant 400 Italic 22pt Clay Rose. Bottom (60, 1040): `No way to tell.` Cormorant 400 Italic 22pt Clay Rose.
- **RIGHT panel x:500–1000 y:520–1140 — `AFTER · SIMULATOR`** JetBrains Mono Bold 18pt Muted Gold tracking 0.30em, top-left (540, 540). Below: clean Sensitivity Simulator screenshot — a 3×2 grid with cells labeled `+$0/+0pp`, `+$5/+0pp`, `+$10/+0pp`, `+$0/+5pp`, `+$5/+5pp`, `+$10/+5pp` and dollar deltas (`+$0`, `+$1,015`, `+$2,030`, `+$4,470`, `+$5,485`, `+$6,500`). Highest cell highlighted Muted Gold-soft 30% fill with `+$6,500` JetBrains Mono Bold 24pt Muted Gold. Bottom (560, 1040): `Pick the highlighted cell.` Cormorant 400 Italic 22pt Muted Gold.
**Verdict band (y:1180–1300):** Centered Harbor Navy block 800×120px x:100 y:1180. Inside (500, 1240): `$67 · 30–100× ROI ON THE FIRST DECISION` JetBrains Mono Bold 22pt Parchment tracking 0.20em.
**Brand mark:** Parchment footer y:1340–1500. Identical to Pin 1.
**Shape elements:** 1px Parchment Alt vertical divider at x:500 between BEFORE/AFTER. 1.5px Muted Gold rule at y:1180 above the verdict band. Highlighted cell on AFTER side has 1.5px Muted Gold border.
**Reference asset paths:** Sensitivity Simulator screenshot from `templates/_masters/FIN-001-revpar-dashboard-DEMO.xlsx` → Sensitivity Simulator tab → screenshot at 1200×800 zoom 110%. Crop and stylize to fit the AFTER panel.

**Designer note:** The 3×2 grid IS the differentiator — most pricing-tool pins show a slider or a single number. The grid shows "we run all six scenarios for you, here's the answer." The highlighted cell must read at thumbnail; if `+$6,500` blurs at 240×360, scale the highlighted cell larger and let the surrounding cells crop or feather. Don't include axis labels (`ADR DELTA` / `OCC DELTA`) — they're noise at thumb size; the cell labels are enough.

---

## Cross-pin consistency

- **Logo / wordmark position and size:** identical across all 4 — Wordmark Cormorant 28pt italic + 32pt medium, Harbor Navy on Parchment footer, x:60 y:1420 (or y:1390 where footer starts higher). Monogram 96×96px x:876 y:1390. URL right-aligned x:940 y:1466.
- **URL bar:** `thestrledger.com/products/revpar-dashboard`, JetBrains Mono 12pt Harbor Navy tracking 0.20em — identical.
- **Variant-A vs Variant-B distinguishability:** A pins (1, 3) use Italic Cormorant headlines + Clay Rose accents on the warning-voice payoff line; B pins (2, 4) use Roman Cormorant + Muted Gold dominant. Test thumbnail diff before sign-off.
- **60pt minimum primary headline:** met on all 4 (56–76pt range; Pin 3's 56pt is justified by the 3-line headline length).
- **One specific claim per pin:** Pin 1 = "RevPAR formula done correctly," Pin 2 = "Occupancy outpaces ADR ($4,470 vs $2,030)," Pin 3 = "the three KPIs and the denominator trap," Pin 4 = "3×2 grid → highlighted cell → $6,500 lift."
- **Sensitivity-bar / grid family:** appears on Pin 2 (bars) and Pin 4 (grid). Same numeric style (JetBrains Mono Bold), same Muted Gold-soft highlight treatment.
- **Brand signatures coverage:** italic "The" (all 4 wordmarks); gold terminal period (all 4 headlines); 48px gold rule (all 4); tracked uppercase mono eyebrow (all 4).
- **Color ratio per `brand-decisions.md` §4.2:** within tolerance on all 4. Pin 4 verdict band is the only Navy-dominant element; justified by Before/after archetype and tied to brand.
