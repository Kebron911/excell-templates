# Brief — ACQ-005 AirDNA Data Integrator

**SKU:** ACQ-005
**Catalog #:** 23 (master spec §3.2 B)
**Mode:** Operational (importer + calculator)
**Tier:** T3
**Fork from:** `build_str_deal_analyzer.py` (calculator pattern with paste-import)
**Filenames:** `ACQ-005-airdna-data-integrator-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Workbook designed to ingest AirDNA Rentalizer / Market Score CSV exports (or manual paste). Translates AirDNA's projected revenue / occupancy / ADR / RevPAR into the host's underwriting model with adjustments for the host's specific property quality (above/below market). Solves "AirDNA says $87K — but how does that translate to MY actual deal?"

## Tabs (5)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Hero + step-by-step "paste data here" instructions |
| 2 | AirDNA Paste | 50-row paste landing zone for AirDNA Rentalizer output |
| 3 | Quality Adjuster | Property-specific multipliers (above/below market on each dimension) |
| 4 | Adjusted Underwriting | AirDNA × adjusters → projected revenue / NOI / CoC / DSCR |
| 5 | Settings | Active year, source data date stamp |

## AirDNA Paste tab
Paste-friendly layout — exact column names matching AirDNA's CSV export:
- Annual revenue, monthly revenue (12 cols), occupancy %, ADR, RevPAR, market score, comparables count, etc.
- Two sections: Annual summary + Monthly breakdown
- Date-stamped: "Source data as of: [input cell]"

## Quality Adjuster tab
Multiplier inputs (default 1.00):
- Listing photos quality: 0.85-1.20 (worse than market to better)
- Amenities (hot tub, pool, view): 0.90-1.30
- Decor / staging: 0.85-1.15
- Reviews target (10+ at 4.8★ or starting from 0): 0.70-1.00
- Pricing strategy (auto-discount or premium): 0.95-1.10
- Total quality multiplier (formula `=PRODUCT(...)`)

Each row has a justification note column.

## Adjusted Underwriting
- AirDNA-projected revenue × quality multiplier = Adjusted revenue
- 12-month adjusted projection
- Adjusted occupancy / ADR / RevPAR
- Drop into a mini-underwriting box: NOI, cap rate, CoC (uses operating expense + debt service inputs from a small box)

## Sample data (DEMO)
Smokies Ridge area, AirDNA suggested $84K annual / 68% occ / $338 ADR.
Adjusters: photos 1.10 (paid pro shoot), amenities 1.15 (hot tub + view), reviews 0.85 (starting from 0), product 1.00.
Total mult 1.075. Adjusted revenue $90.3K.

## Settings
- B5 Active year
- B7 Source data date
- B9 AirDNA market name (free text)
- B11 Conservative-mode multiplier (additional 0.85-1.00 sensitivity, default 0.90)

## Anti-patterns
- No automated AirDNA scraping (against ToS — paid product, manual export only)
- No multi-property comparison here (use ACQ-004 for that, paste in adjusted figures)
