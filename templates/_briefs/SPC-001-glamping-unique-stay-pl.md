# Brief — SPC-001 Glamping / Unique-Stay P&L

**SKU:** SPC-001
**Catalog #:** 71 (master spec §3.2 J)
**Mode:** Operational (matrix + extras)
**Tier:** T3
**Fork from:** `build_pl_single_property.py` (12-month matrix) — but adapt to glamping operating model
**Filenames:** `SPC-001-glamping-unique-stay-pl-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
P&L tailored to glamping / unique-stay operators (yurts, tiny homes, A-frames, treehouses, cave stays, domes, vintage trailers). Differs from a standard cabin P&L: heavy seasonality, propane/generator costs, port-a-potty / off-grid utilities, more frequent linen replacement, weather-related cancellations, propane-tank tracking, alternative-revenue lines (firewood sales, on-site experiences).

## Tabs (7)
| # | Tab | Role |
|---|---|---|
| 1 | Start | KPIs (revenue YTD, season-peak / shoulder split, occupancy, alt-revenue %) + → P&L |
| 2 | Income | 12-month rev matrix: nightly rate × occupancy + alt-revenue lines |
| 3 | Expenses | 12-month expense matrix: glamping-specific categories |
| 4 | Seasonality Dashboard | Per-season breakdown (Peak / Shoulder / Off) |
| 5 | Off-Grid Utilities | Propane refill log, generator hours, water-haul log |
| 6 | Alt Revenue | Firewood, on-site experiences (yoga, stargazing, photography), gear rentals |
| 7 | Settings | Property name, season definitions, units of measure |

## Income tab
12-col matrix:
- Nightly rate × nights occupied = lodging revenue
- Cleaning fee revenue
- Pet fee revenue
- Alt-revenue lines:
  - Firewood sales (per bundle × bundles sold)
  - Gear rentals (kayak / fire pit / e-bike)
  - On-site experiences (guided / hosted)
  - Photo-shoot fees (private property fees)
- Total revenue per month

## Expenses tab
12-col matrix with glamping-specific categories:
- Propane (refills + tank rental)
- Generator fuel + maintenance
- Water (delivery if off-grid, well pump electrical)
- Septic / port-a-potty pumping
- Linens (replaced more frequently — outdoor wear)
- Weather damage repairs (high seasonality)
- Pest control (heavier in unique-stay environments)
- Composting / waste management
- Decor refresh (Insta-driven inventory turnover)
- Listing photo refresh (3x/yr typical for glamping)
- Insurance (specialty glamping policy)
- Standard categories (taxes, internet, marketing, etc.)

## Seasonality Dashboard
3 columns (Peak / Shoulder / Off-Season):
- Months in season
- Avg occupancy %
- Avg ADR
- Revenue total
- Expenses total
- NOI

Shows that glamping often loses money Off-Season (acceptable) but makes 70% of annual NOI in Peak.

## Off-Grid Utilities
**Propane log** (50-row register): Date | Property | Refill amount (gal) | Cost | Vendor | Tank % full at refill
**Generator log** (50 rows): Date | Hours run | Fuel added | Service notes
**Water-haul log** (if applicable): Date | Gal delivered | Cost | Vendor

## Alt Revenue tab
Per alt-revenue line, monthly tracking. Bar chart "Alt revenue mix".

## Sample data (DEMO)
Smokies Yurt (yurt + dome combo on 10 acres):
- Peak (May-Oct): 78% occ, $245 ADR, $76K revenue
- Shoulder (Mar-Apr, Nov): 45% occ, $185 ADR, $11K revenue
- Off (Dec-Feb): 18% occ, $145 ADR, $3.4K revenue
- Annual revenue $94K (lodging $87K + alt $7K — firewood $2K, kayak rental $3K, photo shoots $2K)
- Annual expenses $52K including $4.8K propane, $1.2K generator, $3.6K linens
- NOI $42K

## Settings
- B5 Property name
- B7 Active year
- B9-B11 Season cutoff dates (Peak start | Shoulder start | Off start)
- B13 Off-grid? Y/N (toggles utilities tab visibility/relevance)
