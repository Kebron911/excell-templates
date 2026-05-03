# Pinterest — FIN-001 RevPAR / ADR / Occupancy Dashboard (4 pins)

**Design spec:**
- Dimensions: 1000 × 1500 (Pinterest standard vertical)
- File format: PNG, <10MB
- Title font: Cormorant Garamond Medium 500, ≥60pt, tracking -0.01em
- Body / supporting line: Inter 400, 24-32pt
- Brand colors: Parchment `#F6EFE2` background default; Harbor Navy `#12304E` display type; Muted Gold `#C9A24B` for period-mark and 48px gold rule; Clay Rose `#B5725E` accents only
- Wordmark in lower-right corner at ~140px wide; URL set in JetBrains Mono uppercase, 12pt, tracked 0.20em
- Italic "The" before "STR Ledger" wordmark; gold period after every display headline; gold rule under the headline

**Style variants legend:**
- **Tip-list** — bulleted promise + headline
- **Quote-card** — bold claim + subtle supporting line
- **Infographic** — visual breakdown (sensitivity grid, KPI table)
- **Before/after** — split visual with overlay

**A/B brand split (active per brand-decisions §6.4 through 2026-06-23):**
- **Variant A (control — §6.1 warning/solution voice):** names the failure or risk first, then the resolution
- **Variant B (challenger — upbeat outcome voice):** leads with the clean outcome or confident next step
- 2 pins each, alternating

---

| # | Pin title (on image) | Style | Variant | URL | Board | Pin description (SEO caption) |
|---|---|---|---|---|---|---|
| 1 | Gross Revenue Lies. RevPAR Doesn't. | Quote-card | A (control) | `thestrledger.com/products/revpar-dashboard` | STR Tax Tips | Looking at gross monthly revenue and trying to tell whether you are improving — or just running hot for a quarter — is the most common analytical mistake STR hosts make. RevPAR (revenue per available night) captures both rate and occupancy in one number, and it is the metric every market report uses. This dashboard computes it correctly, including the right denominator handling for personal-use and maintenance blocks. $67. #airbnbanalytics #strrevenue #revpar #shorttermrental #vacationrental |
| 2 | Push ADR or Push Occupancy? Run the Numbers. | Infographic | B (challenger) | `thestrledger.com/products/revpar-dashboard` | Short-Term Rental Business | At a $200 ADR / 65% Occupancy property, lifting ADR $10 yields about $2,030/year. Raising Occupancy 5 percentage points yields about $4,470/year. That ratio — Occupancy moves more revenue than ADR at most price points — is the single most useful piece of pricing information for STR hosts. Sensitivity simulator built in. RevPAR / ADR / Occupancy dashboard, $67. #strpricing #airbnbpricing #revpar #adr #vacationrental |
| 3 | Your Friend's $187 RevPAR Was a Brag. Here's How to Compute Yours. | Tip-list | A (control) | `thestrledger.com/products/revpar-dashboard` | STR Tax Tips | The three KPIs the STR industry actually uses are RevPAR, ADR, and Occupancy. Most templates compute Occupancy wrong — they either ignore blocked nights (overstates your number) or count blocks as available (understates). The right method, used by PriceLabs and AirDNA, excludes blocks from the denominator. This dashboard does it correctly. Plus YoY comparison and AirDNA comp benchmark. $67. #strtemplate #airbnbkpi #revpar #vacationrentalbusiness #shorttermrentalanalytics |
| 4 | One Pricing Decision. 30-100x the Cost of the Workbook. | Before/after | B (challenger) | `thestrledger.com/products/revpar-dashboard` | STR Templates & Tools | The KPI dashboard that turns gut pricing into informed pricing. Sensitivity simulator runs a 3×2 scenario grid (ADR +$0/+$5/+$10 × Occ +0/+5pp) per property and tells you the annual revenue impact of each move. AirDNA comp benchmark line shows where you sit vs market — typically a 5-15% gap for hosts who have not optimized. $67 dashboard, returning 30-100x in the first pricing decision it informs. #airbnbpricing #strrevenue #revparoptimization #vacationrentalbusiness |

---

## Production notes

- Pin 1 (Quote-card, A): Two-line Cormorant headline 72pt, gold rule between, period in gold. Tiny "RevPAR = Gross ÷ (Total Nights − Blocked)" formula in JetBrains Mono 18pt below the rule. Background full Parchment.
- Pin 2 (Infographic, B): Top third = Cormorant 60pt headline. Middle = simple bar chart, two bars labeled "+ $10 ADR → $2,030" and "+5pp Occ → $4,470" with the longer bar in Muted Gold. Bottom = "Sensitivity simulator included" mono tracked uppercase.
- Pin 3 (Tip-list, A): Three-bullet list (RevPAR / ADR / Occupancy) with a one-line definition for each in italic muted Cormorant. Cormorant 60pt headline at top.
- Pin 4 (Before/after, B): Vertical split. Top half = chaotic gut-feel pricing scribble on Parchment-alt with Clay Rose tint. Bottom half = clean Sensitivity Simulator screenshot on Parchment with one cell highlighted in Muted Gold. Headline overlays the seam in Cormorant 60pt.

All four pins must include: italic "The" before "STR Ledger" in wordmark; gold period after the display headline; 48px gold rule under headline; URL in JetBrains Mono lower-right.
