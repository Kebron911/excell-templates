# Brief — FIN-001 RevPAR / ADR / Occupancy Dashboard

**SKU:** FIN-001
**Category:** Financial / Accounting (master spec §3.2 A #17)
**Tier:** T3
**Etsy price:** N/A (premium dashboard — own-site only)
**Own-site price:** $67
**Wave:** 3 (build order #7 of the next 12)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Side-Hustle Sam scaling — wants to know if he's actually winning per available night, not just on gross revenue.
**Secondary:** Semi-Pro Sarah — runs across portfolio to identify her best-performing property and spot momentum shifts.
**Tertiary:** Newbie Nina — uses RevPAR as a benchmark to set realistic Y2 expectations.

## The one specific pain

"My friend with 3 cabins keeps quoting his RevPAR at $187. I just nod. I look at gross revenue but I don't know if I'm winning per night or just charging more. And how do I know if I'm improving versus just having a hot quarter?"

## What this template does

A KPI dashboard that:
1. Computes RevPAR / ADR / Occupancy correctly (handling personal-use, maintenance, and owner-block nights)
2. Shows **YoY comparison** — the metric Sarah cares most about (am I improving?)
3. Includes inline **glossary cards** so the jargon teaches as it measures
4. Provides a **sensitivity simulator** ("if I lifted ADR $10 OR raised occ 5pp, what's the revenue impact?") — converts dashboard to decision tool
5. Surfaces a **comp benchmark** field — paste your market's AirDNA RevPAR for context

## Sheets / Tabs (7)

| # | Tab | Role |
|---|---|---|
| 1 | Start | Headline KPIs + YoY deltas + comp benchmark |
| 2 | Property Setup | Per-property: rooms × available nights × blocked-night classifier |
| 3 | Booking Log | One row per booking (TAX-002 column shape — copy-paste compatible) |
| 4 | Daily Calendar | Auto-pivot — booked/blocked status per day per property |
| 5 | KPI Dashboard | Monthly RevPAR/ADR/Occ + YoY + per-property breakdown |
| 6 | Sensitivity Simulator | "What if I lifted ADR $10 / raised Occ 5pp?" |
| 7 | Settings | Properties / blocked-night categories / comp ADR / prior-year reference |

## Inputs

**Property Setup (capacity 20 properties):**
Property name, Rooms (default 1), Total nights/year baseline (default 365), Blocked categories enabled (Personal use / Maintenance / Owner stay / Pre-booking gap / Other).

**Booking Log (capacity 5000 rows, TAX-002 shape):**
Date in, Date out, Property, Guest, Channel, Gross, Platform fee, Cleaning fee collected, LOS auto-calc, Notes.

**Blocked-Night Log (separate small table, capacity 500 rows):**
Date from, Date to, Property, Block reason (Personal / Maintenance / Owner stay / Pre-booking gap / Other), Notes.

**Comp Benchmark (Settings):**
Per-property: paste market RevPAR / ADR / Occupancy from AirDNA (manual, "as of YYYY-MM-DD" stamp).

**Prior-Year Reference (Settings):**
Per-property × per-month: prior year's RevPAR / ADR / Occ. Manually entered from prior year's archive (or this workbook re-run).

## Outputs

**Daily Calendar (auto-pivot):**
- Rows = days of the year (Jan 1 to Dec 31)
- Cols = one per property
- Each cell: lookup formula returning "B" (booked, from Booking Log) / "X" (blocked, from Blocked-Night Log) / "" (available)
- Conditional formatting: parchment available, gold-soft booked, navy-tint blocked

**KPI Dashboard:**
For each property × month:
- ADR = SUM(gross) / SUM(booked nights)
- Occupancy = booked nights / (total nights - blocked nights). NOTE the denominator excludes blocked nights — host's choice; correct method.
- RevPAR = SUM(gross) / (total nights - blocked nights). Mathematically equals ADR × Occ.
- YoY delta vs Settings prior-year reference

Layout: 12 months × 3 metrics (ADR/Occ/RevPAR) per property. Plus a portfolio-level rollup at top.

**Start tab at-a-glance:**
- Portfolio RevPAR YTD (large gold)
- YoY delta (+/- $/percent — colored)
- Best property by RevPAR / Worst property by RevPAR
- Comp benchmark: "Your YTD RevPAR $187 vs market $204 ⚠" — gold caution if below market, gold-soft check if above
- Inline glossary cards (parchment-tinted, italic muted): "RevPAR = revenue ÷ available nights. Tells you if rate AND occupancy are working — not just one."

**Sensitivity Simulator:**
Per-property scenario:
- Inputs: ADR delta $, Occ delta pp
- Outputs: scenario revenue, vs current revenue, $ impact, % impact
- 6-row scenario table: ADR +$0/+$5/+$10 × Occ +0/+5pp grid (3×2 = 6 scenarios)

## External data references

- AirDNA — paste comp values manually
- Industry-standard RevPAR/ADR/Occ definitions (cited on glossary cards from STR/Hotel definitions)
- AvailabilityIndex / occupancy denominator convention (excludes blocked nights — same as PriceLabs/AirDNA)

## Business logic

- **Blocked-night classification** is the integrity differentiator. Most templates either ignore blocks (overstate occupancy in your favor — useless) or count blocks as "available" (understate occupancy — depressing). Correct method: blocks excluded from denominator.
- YoY = current period / prior-year reference - 1. Manual prior-year entry avoids multi-year capacity bloat.
- Portfolio rollup = SUM(gross) / SUM(available nights across properties). Not an average of property RevPARs (would mislead on portfolio scale).
- Capacity: 20 properties, 5000 booking rows, 500 blocked-night rows. Above this, daily calendar performance degrades.
- Comp benchmark is OPTIONAL — if user doesn't paste AirDNA, the comparison row hides.

## QA sample data

3 properties: Smokies Ridge Cabin, Creek Side, Lakehouse A. Q1 2026 (Jan-Mar).
- Smokies Ridge: ADR $245, Occ 68%, RevPAR $167. YoY +$22 RevPAR.
- Creek Side: ADR $185, Occ 72%, RevPAR $133. YoY -$8 RevPAR.
- Lakehouse A: ADR $325, Occ 58%, RevPAR $189. YoY +$45 RevPAR.

Portfolio Q1 RevPAR: $162. Comp benchmark (AirDNA market): $178. Verdict: 9% below market.

Sensitivity sim on Smokies Ridge: lift ADR $10 → +$2,030/yr; lift Occ 5pp → +$4,470/yr. (Occ moves more revenue.)

## Upgrade CTA

Start tab: "Want pricing optimization too? Get the Pricing Bundle at thestrledger.com/pricing — dynamic pricing calculator + minimum-stay optimizer + cleaning fee optimizer + competitor tracker, $97."

## Out-of-scope

- Live AirDNA / PriceLabs API integration
- Multi-year tracking in one workbook (use prior-year reference table)
- Forecasting / demand modeling (separate SKU)
- Pace pickup analytics (out of scope)
- Hotel-style RevPAR Index vs market (RGI requires comp set definitions outside MVP)

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `FIN-001-revpar-dashboard-DEMO.xlsx` + `-BLANK.xlsx`
- Mode: Operational
- Tab colors: Start/Settings = `COLOR_PRIMARY`; Property Setup/Booking Log/Blocked-Night Log = `COLOR_SECONDARY`; Daily Calendar/KPI Dashboard/Sensitivity Simulator = `COLOR_ACCENT`
- SKU tag "FIN-001 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "RevPAR Dashboard", "Are you actually winning per available night?")`.

Headline block:
- Row 8: "PORTFOLIO YTD REVPAR" Georgia 14pt; Row 9: $XXX 28pt bold gold
- Row 11: YoY delta string with arrow
- Row 13: Comp benchmark line (conditional render only if Settings filled)
- Row 15: Best/Worst property side-by-side

Inline glossary cards rows 17-22 (parchment-tinted, italic): RevPAR / ADR / Occupancy / Blocked nights — what each means.

### Sheet 4 — Daily Calendar
Header row 5 navy band. Col A = date (Jan 1 to Dec 31, 365 rows). Cols B onwards = up to 20 properties. Each cell formula returns "B"/"X"/"" via INDEX/MATCH or COUNTIFS against Booking Log + Blocked-Night Log.

Conditional formatting: parchment / gold-soft / navy-tint.

Freeze A6 + B5 (top-left corner stays for scrolling).

### Sheet 5 — KPI Dashboard
Tab color `COLOR_ACCENT`. Layout:
- Top: portfolio rollup (4 rows: ADR/Occ/RevPAR/Gross + 4 cols Jan/Feb/Mar/.../Dec/YTD/YoY)
- Below: per-property blocks, one per property, 4 rows × 14 cols each
- Total: ~84 rows for full 20-property workbook

### Sheet 6 — Sensitivity Simulator
Per-property simulator with input cells (ADR delta, Occ delta) and 3×2 scenario grid below. Conditional formatting: green cells where impact > 5% revenue.
