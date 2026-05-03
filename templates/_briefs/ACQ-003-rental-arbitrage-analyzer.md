# Brief — ACQ-003 Rental Arbitrage Analyzer

**SKU:** ACQ-003
**Category:** Specialty / Sub-niches (master spec §3.2 J #70) — also serves Acquisition pipeline
**Tier:** T2
**Etsy price:** N/A (specialty audience — own-site only)
**Own-site price:** $47
**Wave:** 3 (build order #10 of the next 12)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Aspiring arbitrage operator (sub-niche of Side-Hustle Sam) — younger demographic, has been guru-burned, wants hard math.
**Secondary:** Existing Sam considering arbitrage as Property #2 alongside owned property.
**Tertiary:** Pro Pam offering arbitrage as a service to landlords ("master-lease" model).

## The one specific pain

"I want to rent a unit and Airbnb it. Will the numbers actually work after rent + setup + utilities + insurance? Every guru on YouTube says 'rental arbitrage is the no-money-down path' and the comments are full of people who lost their setup money."

## What this template does

An arbitrage-specific deal analyzer that:
1. Takes the lease terms (rent, deposit, term, restrictions, renewal escalator) as primary inputs — NOT a purchase
2. Reuses #31 Cost-to-Launch's furnishing structure for setup costs
3. Stress-tests against the **biggest arbitrage killer: landlord rent hikes at renewal**
4. Provides **MTR (mid-term-rental) fallback math** — if STR fails, can corporate housing / travel-nurse rents cover the rent? Differentiator that adds legitimacy.
5. Outputs a **Landlord Pitch Page** (1-page proposal printout) — converts the analyzer into an acquisition tool

## Sheets / Tabs (8)

| # | Tab | Role |
|---|---|---|
| 1 | Start | Verdict at-a-glance + stress test summary |
| 2 | Lease Terms | Rent, deposit, term, restrictions, escalator |
| 3 | Setup Costs | Smaller-scale fork of #31's furnishing list |
| 4 | Revenue Projection | ADR / Occ / Cleaning / LOS |
| 5 | Operating Math | Monthly cash flow with rent + utilities + supplies + platform fees |
| 6 | Stress Test | Rent escalator scenarios + occupancy stress |
| 7 | MTR Fallback | If STR fails, can mid-term-rental cover rent? |
| 8 | Landlord Pitch Page | 1-page proposal to landlord (printable) |

## Inputs

**Lease Terms:**
Property address, Unit type, Beds/Baths, Sqft, Monthly rent ($), Security deposit ($), Lease term (months), Lease start date, Sublet allowed? (Yes/No/Conditional), STR-zone allowed? (Yes/No/Unsure), Insurance addendum required? (Yes/No), Pet allowed? (Yes/No), Renewal rent escalator % (default 5%), Early-termination clause (free text), Landlord name + contact.

**Setup Costs (smaller fork of ACQ-002):**
~80 line items (vs. 120 for owned property — no major appliances if landlord-provided), low/mid/high columns. Cleaning supplies, kitchen, bedding, decor, tech, security.

**Revenue Projection:**
ADR (paste from AirDNA), stabilized occupancy %, Y1 occupancy % (default 60% of stabilized — arbitrage Y1 is harder than owned), avg LOS, cleaning fee charged, platform commission %, market seasonality factor.

**Operating Math (monthly):**
Rent (from Lease Terms), utilities $, internet $, software/PMS $, cleaning paid per turnover × turnover count, supplies per turnover, marketing $, insurance $, other $.

## Outputs

**Operating Math:**
- Monthly gross revenue (ADR × occ-nights + cleaning fees collected)
- Monthly net revenue (after platform commission)
- Monthly operating costs (rent + everything above)
- Monthly cash flow = net revenue - operating costs
- Annual cash flow

**Stress Test:**
3 scenarios:
- Base (Y1 inputs)
- Stabilized + 5% rent escalator (Year 2)
- Stress: stabilized + 7% escalator + occupancy stress -10pp + supplies +15%

Each shows: monthly cash flow, annual cash flow, verdict ✅/⚠/❌.

**MTR Fallback:**
- MTR rent benchmark (manual paste from Furnished Finder — typical $2,500-$4,200/mo for 30-day stays)
- Monthly cash flow if MTR-only (with adjusted occupancy 90% on signed contracts, lower utilities, no cleaning fees, no platform fees)
- Verdict: "MTR covers rent? ✅" or "MTR shortfall: $X/mo ⚠"

**Verdict (Start tab):**
- Y1 cash flow + Stabilized cash flow side-by-side
- Stress test verdict (worst-case survives or fails)
- MTR fallback indicator
- Headline: "✅ DEAL — $1,400/mo cash flow Y1 · stress survives · MTR covers rent" or "❌ PASS — negative cash flow at Year 2 escalator."

**Landlord Pitch Page (the differentiator):**
1-page printable proposal:
- Header: "Master-Lease Proposal" (NOT "rental arbitrage" — landlord-friendly framing)
- Tenant info: name + business + LLC
- Property info
- Proposed terms (rent, term, deposit, who-pays-what)
- "Why this works for you" section: guaranteed rent, no tenant turnover, professional management, premium maintenance
- Tenant insurance + indemnification clause
- Reference contacts (other landlords, prior arbitrage history)
- Signature line

Print area portrait letter, white-label-friendly (operator's logo placeholder, NOT STR Ledger marks).

## External data references

- AirDNA (manual paste for ADR + occupancy)
- Furnished Finder (manual paste for MTR benchmarks)
- Lease/landlord-tenant law NOT covered — disclaimer: "Consult an attorney before signing master-lease agreements."

## Business logic

- **Lease restrictions are the deal-killers.** If sublet not allowed → workbook flips Verdict to "❌ PASS — illegal under current lease" before any math runs.
- **Renewal-rent escalator is the #1 stress dimension.** Most arbitrage units fail at Year 2 renewal when landlord raises rent 7-10%. Stress test bakes this in as a default.
- **MTR fallback is the credibility move.** Differentiates from cheap arbitrage templates. Real arbitrage operators have a Plan B; gurus don't.
- Landlord pitch page is printable + white-label friendly. Strip our brand from this tab; user adds their own.
- Platform commission applied to rent + cleaning collected (full Airbnb cut).
- No "no-money-down" framing — that's guru language and §6 voice rules forbid it.

## QA sample data

2BR apartment, urban market:
- Rent $2,400/mo, deposit $4,800, 12-mo lease, sublet allowed w/ written approval (got it), STR zone allowed
- Setup costs mid: ~$14,800
- ADR $185, stabilized occ 70%, Y1 occ 42%, LOS 2.8
- Utilities $220/mo, internet $80/mo, software $40/mo, cleaning paid $135/turnover

Y1 monthly cash flow: ~$340 (thin — first year)
Stabilized monthly: ~$1,420
Stress (Y2 + 5% escalator + occupancy stress): ~$540/mo cash flow ✅
Stress (worst case +7% escalator + -10pp occ + +15% supplies): -$80/mo ⚠

MTR fallback: market MTR $3,400/mo for unit; minus utilities + insurance + minor cleaning = ~$2,940 net. Covers rent ($2,400) + ~$540 cushion. ✅

Verdict: "✅ DEAL — Y1 thin but stabilizes; MTR covers rent; stress at extreme renewal is marginal."

Landlord pitch page populated for the example.

## Upgrade CTA

Start tab: "Want to underwrite owned properties too? Get the STR Deal Analyzer (ACQ-001) at thestrledger.com — $47."

## Out-of-scope

- Lease/landlord-tenant legal advice
- Multi-unit arbitrage portfolios (run per-unit)
- Co-living / room-by-room arbitrage variants
- International (US lease assumptions only)
- Negotiation tactics with landlords (out of scope, content territory)

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `ACQ-003-rental-arbitrage-analyzer-DEMO.xlsx` + `-BLANK.xlsx`
- Mode: Wizard
- Tab colors: Start = `COLOR_PRIMARY`; Lease/Setup/Revenue/Operating = `COLOR_SECONDARY`; Stress/MTR Fallback = `COLOR_ACCENT`; Landlord Pitch = `COLOR_PARCHMENT_ALT` (white-label)
- SKU tag "ACQ-003 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Rental Arbitrage Analyzer", "Will the numbers actually work — through Year 2?")`.

Verdict block rows 8-18 with stress test and MTR fallback indicators.

### Sheet 2 — Lease Terms
Wizard flattened layout. Lease-restriction red flags at top. Sublet=No or STR-zone=No flips Verdict to ❌ PASS via formula.

### Sheet 6 — Stress Test
Tab color `COLOR_ACCENT`. 3-column scenario compare with conditional formatting per cash flow cell.

### Sheet 7 — MTR Fallback
Tab color `COLOR_ACCENT`. MTR benchmarks (paste from Furnished Finder). Monthly cash flow if MTR-only. Verdict: covers rent? Y/N.

### Sheet 8 — Landlord Pitch Page
Tab color `COLOR_PARCHMENT_ALT`. **No STR Ledger branding.** Print area A1:G50 portrait letter. Logo placeholder for operator's brand. Signature lines.
