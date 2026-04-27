# Brief — TAX-004 Schedule E Tax-Prep Workbook

**SKU:** TAX-004
**Category:** Financial / Accounting (master spec §3.2 A #3)
**Tier:** T3
**Etsy price:** $47 (Lite) — own-site $97 (Full)
**Wave:** 2 (Tax Season Bundle anchor)
**Mode:** Wizard (DEMO + BLANK)
**Campaign tagline:** Hand your CPA a finished Schedule E.

## Target persona

**Primary:** Semi-Pro Sarah — 3-10 STRs, treats rentals as a real business, files Schedule E. Wants a clean year-end hand-off so her CPA bills 2 hours, not 12.
**Secondary:** Pro Pam (mid-tier funnel) — runs portfolio with co-host; needs property-by-property income and expense breakdown.

## The one specific pain

"My CPA spent 9 hours sorting my STR receipts last April. She charges $300/hr. I paid $2,700 because I shipped her a shoebox. If I'd handed her a finished Schedule E, she'd have signed off in 90 minutes."

## What this template does

Captures the inputs IRS Schedule E (Form 1040) needs for residential rental real estate — line by line, per property, up to 3 properties (Lite) — and outputs a print-ready Schedule E mapping the customer (or their CPA) can transcribe directly to the form. Anchored on the Schedule E vs Schedule C decision (substantial-services trigger) and the passive-activity loss rules (IRC §469).

This is the **passive STR** workbook. Hosts who provide substantial services (concierge, daily cleaning during stays, meals) need TAX-010 Schedule C — flagged with a Settings dropdown that warns when Schedule C may apply.

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 0 | Start | Wizard hero + 3-card "what you'll build" + Quick Start + Get Started + progress |
| 1 | Property Info | Per-property identity (3 properties × 8 fields) |
| 2 | Income | Per-property rents received + refundable deposit reminder |
| 3 | Expenses | 14 Schedule E expense lines × 3 properties |
| 4 | Depreciation | Per-property basis, date placed in service, useful life, MACRS straight-line |
| 5 | Loss Limitations | Material participation Q&A + STR loophole eligibility |
| 6 | Schedule E Map | Auto-built Schedule E Part I — Lines 1-26 mirror the IRS form |
| 7 | Launch | Readiness dashboard + Print Schedule E button |

## Inputs (per property, Lite supports 3)

**Property Info (8 fields):** address, type (1=single-family, 2=multi-family, 3=vacation/STR, 4=commercial, 5=land, 7=self-rental, 8=other), fair-rental days, personal-use days, % ownership, date placed in service, EIN (if any), QJV election.

**Income (3 fields/prop):** rents received, royalties, refundable deposits (callout: NOT income).

**Expenses (14 lines/prop, Schedule E Part I):** Advertising · Auto and travel · Cleaning and maintenance · Commissions · Insurance · Legal/professional fees · Management fees · Mortgage interest paid to banks · Other interest · Repairs · Supplies · Taxes · Utilities · Other.

**Depreciation (5 fields/prop):** depreciable basis, date placed in service, recovery period (27.5-yr residential / 39-yr non-residential), placed-in-service convention, accumulated prior depreciation.

**Loss Limitations (4 fields):** active participation? ($25K offset eligibility), material participation? (STR loophole), AGI for $25K phase-out, prior-year suspended losses.

## Outputs

- **Schedule E Map tab** — 26 rows mirroring IRS Schedule E Part I, with formulas pulling income + expenses + depreciation per property. Customer prints this tab and hands it to the CPA.
- **Per-property Net Income/Loss** = rents − total expenses − depreciation
- **Total ordinary income/loss** before passive loss limits (Line 26)
- **Schedule C trigger warning** if substantial-services dropdown = "Yes" on Settings
- **Loss limitation guidance** — IF Active Participation + AGI < $100K → "$25K offset available" / IF Material Participation + STR rules → "STR loophole; full loss"

## External tax references

- **IRS Form Schedule E (2025 instructions)** — line numbers & structure source of truth
- **IRC §469** — passive activity loss rules
- **IRC §162** — ordinary and necessary business expenses
- **Pub 527** — Residential Rental Property
- **Pub 925** — Passive Activity & At-Risk Rules

## Business logic

- 3-property capacity in Lite (Schedule E Part I supports 3 properties per page; multi-page hosts go to TAX-004-Full / Portfolio).
- Refundable deposits are NOT income (until forfeited) — call this out on Income tab.
- "Type" field uses the IRS code list (1-8) — dropdown.
- Personal-use days > 14 OR > 10% of rental days triggers vacation-home rules (callout, not enforced).
- Material participation Q (500-hour test, 100-hour + most-active, etc.) drives the STR-loophole flag.
- Depreciation: 27.5-yr residential straight-line is the default; build outputs the annual figure but the workbook does NOT recalculate Form 4562 (that's TAX-009 + TAX-006 territory).
- All formulas reference Settings!$B$5 = Active tax year (no YEAR(TODAY) per the str-tax-context guidance).

## QA sample data (DEMO variant)

Three properties — "Smokies Ridge" (cabin, $48K rents), "Creek Side" (cabin, $36K rents), "Lakehouse A" (single-family, $52K rents) — full year 2026, realistic expense load. Net income/loss should land within ±$500 of: Smokies +$8.2K, Creek +$4.1K, Lakehouse −$1.8K (Lakehouse shows mild loss to demonstrate loss-limitation flow).

## Out-of-scope

- Schedule C (active STR with substantial services) — separate SKU TAX-010
- Form 4562 depreciation calc — TAX-009 + TAX-006
- Multi-entity / LLC consolidation — Portfolio P&L (FIN-001)
- 4+ properties — Portfolio Bundle Full version
- Tax preparation itself (this is data hand-off, not tax software)

## Upgrade CTA

Welcome tab + Launch tab: "Upgrade to the Tax Season Bundle ($147) at thestrledger.com/tax-bundle — Schedule E + Schedule C + Mileage + 1099 + Home Office + Section 179 + Quarterly Estimateds + Per-Diem."
