# How to Use Your AirDNA Data Integrator

## What this workbook does

Translates AirDNA Rentalizer / Market Score CSV exports into your underwriting math. AirDNA gives you market-level revenue / occupancy / ADR / RevPAR projections; this workbook adjusts them for your specific property's quality (above/below market) and feeds the result into your underwriting model.

Solves the question every host hits when they run a comp report: "AirDNA says $87K — but how does that translate to MY actual deal?"

## First-time setup (10 min)

1. Open tab **AirDNA Paste** — paste your AirDNA Rentalizer CSV export, OR enter the projected RevPAR / ADR / Occupancy manually.
2. Tab **Property Quality Adjustment** — answer 8 questions about your property's quality vs. market average (renovated? hot tub? unique view? superhost-likely?). Adjustment factor auto-computes.
3. Tab **Comp Sanity Check** — paste 5 comparable listings with their nightly rates. The workbook flags if AirDNA's projection is suspiciously high vs. the comp set.

## Reading the outputs

- **Adjusted Revenue Forecast:** AirDNA's projection × your property-quality factor.
- **Underwriting Pass-Through:** the adjusted revenue gets formatted to drop directly into ACQ-001 STR Deal Analyzer's revenue tab.
- **Reconciliation Log:** every assumption you changed from AirDNA's defaults, dated and reasoned. Useful when revisiting in 6 months.

## When AirDNA is wrong

AirDNA's projection is a market-level estimate; your specific property can deviate ±30%. The workbook's quality factor handles up to ±15%. If the comp sanity check shows you should be ±20-30% off, override the adjusted revenue manually and document why on the Reconciliation Log.

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Pair with:** ACQ-001 STR Deal Analyzer (the underwriting workbook this feeds), ACQ-004 3-Property Side-by-Side (when comparing multiple AirDNA-ranked properties).
