# Brief — OPS-003 License/Permit/STR-Reg Tracker

**SKU:** OPS-003
**Category:** Operations / Daily Management (master spec §3.2 C #41)
**Tier:** T2
**Etsy price:** N/A — Etsy Lite skipped (a stripped permit tracker is dangerous; expired permits = fines)
**Own-site price:** $47
**Wave:** 3 (build order #6 of the next 12)
**Campaign tagline:** Turnover chaos has a spreadsheet.

## Target persona

**Primary:** Semi-Pro Sarah (3-10 properties, multi-jurisdiction) — has properties in 2-5 cities and constantly forgets renewals.
**Secondary:** Side-Hustle Sam (one or two properties in one city) — uses to nail down what permits he actually needs.
**Tertiary:** Pro Pam — tracks permits across owner portfolio.

## The one specific pain

"Nashville changed STR rules in March. Austin's renewing in 60 days. I have permits in 4 cities — and I forgot to renew Knox County last year. $750 fine + 30-day suspension. I need an alarm clock, not a tracker."

## What this template does

A permit-tracking workspace that:
1. Lists every permit/license/registration per property × per requirement type
2. **Auto-calculates days-to-renewal** with red/gold/parchment urgency banding
3. Provides a **Permit Discovery page** for top 15 STR cities — shows the typical permit stack so Sarah knows what to expect when adding a new market
4. Logs filing history (date filed, $ paid, certificate received, file location)
5. Maintains an **expired-but-operating red banner** on Start tab — the legal liability flagger

## Sheets / Tabs (6)

| # | Tab | Role |
|---|---|---|
| 1 | Start | Cover + active alarms (red <30 / gold 30-90) + expired banner |
| 2 | Permits Register | Rows = property × permit type (STR permit, business license, sales tax, lodging tax, fire inspection, life safety, other) |
| 3 | Renewal Calendar | Sorted view of all permits by days-to-renewal, color-coded |
| 4 | Permit Discovery | Top 15 STR cities — typical permit stack snapshots |
| 5 | Filing Log | History — every renewal/filing with date, $, certificate, file path |
| 6 | Settings | Property list / Permit type list / "As of" reference dates |

## Top 15 STR cities (Permit Discovery v1)

Nashville TN, Gatlinburg/Pigeon Forge TN, Austin TX, Asheville NC, Phoenix/Scottsdale AZ, Orlando/Kissimmee FL, Joshua Tree CA, Hilton Head SC, Myrtle Beach SC, San Diego CA, Denver/Breckenridge CO, Savannah GA, Outer Banks NC, Miami FL, New Orleans LA, Big Bear/Lake Arrowhead CA. (15 cities; double-listed cities count as one entry.)

Each entry includes: typical permit stack (STR permit, business license, sales tax license, lodging tax registration, fire/safety inspection cadence), typical fees range, renewal cadence, "as of YYYY-MM-DD" stamp, link to city STR resource page, and a "verify locally — rules change" footer.

A "request your city" callout on Permit Discovery → form/email collects requests for v2 expansion.

## Inputs

**Permits Register (capacity 200 rows = 25 properties × 8 permit types):**
Property (dropdown), Permit type (dropdown: STR permit / Business license / Sales tax license / Lodging tax registration / Fire inspection / Life safety / Building permit / Other), Jurisdiction (city/county/state), Permit number, Issue date, Renewal date, Renewal cadence (Annual/Biennial/Triennial/One-time), $ Renewal cost, Status (Active/Pending/Expired/Renewed/N/A), File location/path, Notes.

**Filing Log (capacity 500 rows):**
Date filed, Property, Permit type, Action (Initial filing / Renewal / Amendment / Cancellation), $ Paid, Confirmation #, Certificate received? (Yes/No), Certificate file path, Notes.

## Outputs

**Permits Register:**
- Days-to-renewal (col): `=IF(F<row><>"", F<row> - TODAY(), "")` (F = renewal date)
- Status auto-update: if Days-to-renewal < 0 AND Status ≠ "Renewed" → flip to "EXPIRED" (formula-driven flag in adjacent column)
- Conditional formatting on Days-to-renewal: red <0 (EXPIRED), red 0-29, gold 30-89, parchment 90+

**Renewal Calendar:**
- Sorted ascending by Days-to-renewal
- Three sections: ⚠ EXPIRED (above the line), 🔴 RENEW NOW (<30 days), 🟡 UPCOMING (30-90 days). Permits >90 days collapse into a count footer.

**Start tab at-a-glance:**
- "ALL CLEAR ✅" if no permits in red zones
- Otherwise: red banner — "⚠ N PERMITS NEED ACTION" + bulleted list of top 5 by urgency
- "Operating-while-expired" red box if any property has any permit with Status = EXPIRED
- Filing $ paid YTD (sum from Filing Log)

## External data references

- Top 15 STR cities — manually curated from each city's STR ordinance / business licensing page. Each entry stamped "As of YYYY-MM-DD."
- General reference: AHLA + Granicus host-compliance reporting (for rough city benchmarks; not embedded — referenced)
- Disclaimer footer on every reference tab: "City STR rules change frequently. Verify with the issuing jurisdiction before relying on this snapshot."

## Business logic

- **The alarm clock is the product.** Days-to-renewal countdown + red/gold banding is the entire UX. Sarah opens this once a quarter; it tells her what to do today.
- **Expired-but-operating banner** on Start is the legal-liability flagger. Don't let a host pretend an expired permit is fine.
- **Permit Discovery curated, not exhaustive.** Top 15 cities cover ~80% of Sarah's portfolio. v2 expansion driven by "request your city" form responses.
- Capacity: 25 properties × 8 permit types = 200 rows. Above this, performance degrades.
- No "auto-renewal" — every renewal is manual, but the tracker tells you when.
- Permit Discovery is reference-only — does NOT auto-populate Permits Register (manual copy + customize).

## QA sample data

5 properties × 4 cities, tax year 2026:
- Smokies Ridge Cabin (Gatlinburg TN): STR permit (renews 2026-09-15, $385), business license (renews 2026-12-31, $50), TN sales tax (annual no-fee, 2027-01-01), Sevier County lodging tax (annual no-fee, 2027-04-15) — 4 permits, all active
- Creek Side (Nashville TN): STR permit Type 2 (EXPIRED 2026-04-30 — RED FLAG), business license, lodging tax — 3 permits, 1 expired
- Lakehouse A (Asheville NC): STR registration, business license, sales tax — 3 permits, 1 renews in 22 days (RED), 2 active
- Mountain Loft (Joshua Tree CA): STR permit, TOT registration, business license — 3 permits, all active, 1 renews in 60 days (GOLD)
- Forest Cabin (Big Bear CA): STR permit, county business license — 2 permits, all active

Expected Start tab: ⚠ 3 PERMITS NEED ACTION — Creek Side STR permit EXPIRED, Lakehouse A STR registration in 22d, Mountain Loft STR permit in 60d. YTD filing $ = $620.

## Upgrade CTA

Start tab: "Need full operations coverage? Add the Operator Bundle at thestrledger.com/operator — turnover + maintenance + supply + damage claims + insurance + permits, $197."

## Out-of-scope

- Live-data feeds from city portals (none exist in stable form; rules change too fast)
- Permit application form auto-fill
- Tax filing (separate SKUs TAX-002 / TAX-005)
- International (US only — every state's STR rules differ; international would require separate SKUs)
- Legal/regulatory advisory

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `OPS-003-license-permit-tracker-DEMO.xlsx` + `-BLANK.xlsx`
- Mode: Operational
- Tab colors: Start/Settings = `COLOR_PRIMARY`; Permits Register/Filing Log = `COLOR_SECONDARY`; Renewal Calendar = `COLOR_ACCENT`; Permit Discovery = `COLOR_PARCHMENT_ALT`
- SKU tag "OPS-003 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "License/Permit/STR-Reg Tracker", "An alarm clock for the renewals you'd otherwise forget.")`.

Status block rows 8-22: clear/warning conditional rendering, top-5 urgency list.

### Sheet 2 — Permits Register
Col widths: A=22, B=22, C=18, D=14, E=12, F=12, G=12, H=10, I=14, J=20, K=30. Capacity 200 rows. Conditional formatting on Days-to-renewal column.

### Sheet 3 — Renewal Calendar
Sorted view (formula-driven via SORT or manual refresh — small table size makes manual feasible). Three banded sections: EXPIRED / <30d / 30-90d.

### Sheet 4 — Permit Discovery
15 city sections, each ~10-15 rows. Format per section:
- City banner (navy, Cormorant 14pt)
- "Typical permit stack" 4-6 rows
- "Typical fees" range
- "Renewal cadence"
- "As of YYYY-MM-DD" + city resource URL
- Verify-locally disclaimer

End of tab: "Don't see your city? Request it at thestrledger.com/permit-request" + email capture instruction.

### Sheet 5 — Filing Log
Cols: Date | Property | Permit type | Action | $ Paid | Confirmation # | Certificate? | File path | Notes. Capacity 500 rows.

### Sheet 6 — Settings
Property list (rows 5-25), permit type list (rows 27-36), as-of stamp for Permit Discovery (cell B40).
