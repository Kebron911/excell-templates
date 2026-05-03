# Brief — PAM-001 Owner Reporting Dashboard

**SKU:** PAM-001
**Category:** Team / Co-hosting / Scaling (master spec §3.2 H #62)
**Tier:** T3
**Etsy price:** N/A (premium — own-site only)
**Own-site price:** $197 (or included in Pro Manager Bundle $797)
**Wave:** 3 (build order #5 of the next 12)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Pro Pam (10-50 managed properties, co-host / property manager) — the hero of the Pro Manager Bundle.
**Secondary:** Semi-Pro Sarah running a small managed-portfolio side hustle for friends/family with mixed ownership.
**Tertiary:** Real estate agent who manages 2-3 STRs for past clients.

## The one specific pain

"I manage 8 properties for 6 different owners and at month-end I'm in Excel for 4 hours making custom owner statements. They all want different things — one wants gross, one wants net after my fee, one wants the maintenance breakdown line-by-line. And every time my cleaner gets paid for a turnover, I have to remember which owner owes me the reimbursement."

## What this template does

A property-management workspace that:
1. Maps properties to owners (1:1 or many:1 — owner can have multiple properties)
2. Calculates Pam's management fee per property (% / flat / hybrid / performance bonus)
3. Generates a **white-label printable owner statement** — 1 page per owner per month, no STR Ledger marks
4. Tracks **withholdings** (repairs/refunds Pam paid on owner's behalf, deducted from owner's distribution)
5. Manages **balance forward** (last month's unpaid balance carries to this month — owner statements link in time)
6. Prepares **year-end 1099-MISC** worksheets for owners receiving >$600 in distributions

## Sheets / Tabs (9)

| # | Tab | Role |
|---|---|---|
| 1 | Start | Pam's at-a-glance — open statements, distributions due, alerts |
| 2 | Owners Register | One row per owner — name, address, tax ID for 1099, payment method |
| 3 | Property→Owner Map | Properties × owner (with effective dates if ownership changes) |
| 4 | Booking Log | All bookings, all properties (TAX-002 column shape) |
| 5 | Expense Log | All expenses, all properties + flag for "Pam-paid, reimburse from owner" |
| 6 | Mgmt Fee Calculator | Per-property fee structure (%, flat, hybrid, performance bonus) |
| 7 | Owner Statement | White-label printable, 1 page per owner per month |
| 8 | Year-End 1099 Worksheet | Annual owner distributions ≥ $600 |
| 9 | Settings | Property list / Owner list / Fee structures / Tax year |

## Inputs

**Owners Register:**
Owner name, Mailing address, Tax ID (SSN/EIN), 1099 required? (Yes/No), Email, Phone, Preferred payment (ACH/Check/Wire/Stripe), Bank info (encrypted/free-text — disclaimer "store sensitive info elsewhere"), Statement preferences (Detail level: Summary / Standard / Itemized).

**Property→Owner Map:**
Property name, Owner name (dropdown), Effective from date, Effective to date (blank if current), Ownership %.

**Mgmt Fee Calculator (per property):**
Property name, Fee model (dropdown: Flat / Percentage of revenue / Percentage of net / Hybrid base + perf bonus / Other), Base amount, Performance threshold (occupancy % above which bonus triggers), Performance bonus %, Notes.

**Booking Log:** Date, Property, Guest, Channel, Gross, Platform fee, Cleaning collected, Net, Notes (TAX-002 shape so Pam can paste from existing files).

**Expense Log:** Date, Vendor, Property, Category, Amount, Payment method, Pam-paid? (Yes/No — if Yes, Pam fronts the cost and recovers from owner via withholding), Withholding-month (the month Pam will deduct this from owner distribution), Receipt?, Notes.

## Outputs

**Mgmt Fee Calculator:**
- Per-property monthly fee = formula varies by fee model
- Flat: `=base`
- % revenue: `=base% * monthly_revenue`
- % net: `=base% * (monthly_revenue - monthly_expenses)`
- Hybrid: `=base + IF(occupancy >= threshold, perf_bonus_% * monthly_revenue, 0)`

**Owner Statement (the marquee deliverable):**
Single tab, owner+month input cells at top. All other rows pull via formulas filtered by owner + month.

Layout (1-page printable):
- Header band: [LOGO PLACEHOLDER — Pam's logo, NOT STR Ledger] + Pam's company name + "Owner Statement" title
- Statement period: <month, year>
- Owner: <name + address>
- Section 1 — Properties this month: list of properties, occupied nights, gross revenue
- Section 2 — Income: gross revenue + cleaning fees + other
- Section 3 — Expenses: Pam-paid items (with vendor + date detail), itemized
- Section 4 — Management fee: per-property breakdown + total
- Section 5 — Withholdings: Pam-paid expenses being recovered this month
- Section 6 — Balance forward: prior month's ending balance (if any)
- Section 7 — Distribution: gross - fee - withholdings + balance forward = $ to owner
- Footer: "Questions? <Pam's email>" and a generic "Generated <date>" stamp

**Year-End 1099 Worksheet:**
- Cols: Owner | Annual distributions | 1099 required? | Tax ID
- Footnote: "1099-MISC required if distributions to a non-corporate owner exceed $600 (IRS rule). Consult your CPA."

**Start tab (Pam's view):**
- Open statements this month: count of owners not yet sent
- Total $ distributable this month
- Alerts: owners with negative balance (withholdings exceed distribution), owners with 12+ month inactivity, missing tax IDs for 1099-required owners

## External data references

- IRS 1099-MISC threshold: $600/year for non-corporate payees
- Standard property-management fee benchmarks (15-25% of revenue typical) — referenced on Settings tab as guidance, NOT enforced

## Business logic

- **White-label is non-negotiable.** Owner Statement tab has NO STR Ledger marks anywhere. Logo placeholder cell sized for Pam's image insert. Footer says "Generated <date>" not "Generated by STR Ledger."
- Balance-forward logic: Owner Statement reads prior month's ending balance from a hidden "Statement History" sheet (rows = owner × month, cols = ending balance). Customer manually copies each month's distribution to that history sheet to enable next month's pull. Auto-update considered for v2.
- Withholdings only fire when Expense Log Pam-paid? = Yes AND Withholding-month matches statement period.
- Hybrid fee model is the most-used in PM industry — flat base + bonus when occupancy clears 65%.
- Capacity: 50 properties, 30 owners, 5000 booking rows, 8000 expense rows.
- Settings tab preferences switch the Owner Statement detail level (Summary/Standard/Itemized) — Summary skips Section 3 expense itemization.

## QA sample data

8 properties × 6 owners (one owner has 3 properties), tax year 2026, statement period: Mar 2026.
- Combined gross revenue Mar: ~$58,000
- Pam's fee structures: 3 properties at 20%, 3 at 15%, 2 at hybrid ($800 + 5% bonus over 65% occ)
- Pam-paid withholdings: $1,240 across 5 properties (HVAC repair, replacement linens, plumbing call)
- 1 owner had a $340 negative balance forward from Feb (storm damage repair)

Sample Owner Statement for Owner #1 (3 properties, hybrid fee structure): gross $24,800 → fees $4,940 → withholdings $620 → distribution $19,240.

## Upgrade CTA

Start tab: "Manage cleaners + commissions + multi-owner reporting in one bundle? Get the Pro Manager Bundle at thestrledger.com/pro-manager — $797 (saves $1,000+ vs individual SKUs)."

## Out-of-scope

- Direct payment integration (Stripe/Plaid) — Pam exports statements and pays manually
- Cleaner CRM (separate SKU #61 — bundled in Pro Manager)
- Commission/split for sub-co-hosts (separate SKU #63)
- Multi-currency (USD only)
- E-signature on owner agreements (out of scope)

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `PAM-001-owner-reporting-dashboard-DEMO.xlsx` + `-BLANK.xlsx`
- Mode: Operational
- Tab colors: Start/Settings = `COLOR_PRIMARY`; Owners Register/Property-Owner Map/Booking Log/Expense Log/Mgmt Fee Calc = `COLOR_SECONDARY`; Owner Statement = `COLOR_PARCHMENT_ALT` (white-label); Year-End 1099 = `COLOR_ACCENT`
- SKU tag "PAM-001 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Owner Reporting Dashboard", "Statements your owners forward to their CPAs.")`.

Pam's at-a-glance block rows 8-22:
- Open statements count, total $ distributable, alert list, top earners.

### Sheet 7 — Owner Statement (THE marquee tab)
**No STR Ledger branding anywhere.**

Top of tab:
- Row 1: empty (intentional whitespace)
- Row 2: [LOGO PLACEHOLDER — Pam inserts her logo] merged A2:C5, row height 60, light gray dashed border
- Row 2 col E onward: Pam's company name (input cell, Cormorant 18pt)
- Row 6: "OWNER STATEMENT" Cormorant 24pt bold dark
- Row 7: gold thin rule
- Row 9: "Period:" + month selector (data validation `=Settings!$B$60:$B$71` for 12 months) + " " + year selector
- Row 10: "Owner:" + owner selector (data validation = Owners Register name col)
- Row 12: owner mailing address (formula pull from Owners Register)

Statement body rows 14-50 — sections 1 through 7 from Outputs above. All values formulas filtered by owner + period. Conditional rendering (e.g., Section 5 hides if no withholdings — empty rows).

Row 52: "Distribution: $XX,XXX" Cormorant 24pt bold gold
Row 54: "Questions? <Pam's email pulled from Settings>"
Row 55: italic muted "Generated <today's date>"

Print area A1:H55, portrait letter. NO STR Ledger marks. NO footer email.

### Sheet 6 — Mgmt Fee Calculator
Per-property fee setup table. Cols: Property | Fee model | Base | Threshold | Bonus | Notes. Capacity 50 rows.

### Sheet 8 — Year-End 1099 Worksheet
Print area sized for tax-prep handoff. Annual distributions per owner via SUMIFS.

### Sheet 9 — Settings
Tax year, owner list source, property list source, fee model dropdown source, statement detail-level preference, Pam's company info (name, email, address, logo placeholder size hints).
