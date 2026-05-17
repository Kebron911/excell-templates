# STR Chart of Accounts Starter — Lead Magnet (Blog 07 tie-in)

**SKU code:** `LM-007`
**Format:** Excel workbook (2 tabs: COA + Mapping reference) + PDF print companion (1 page)
**Funnel role:** Mini-magnet for blog post #7 (`str-bookkeeping`). Email-gated at `/free/chart-of-accounts`. Tag at capture: `lead-magnet:chart-of-accounts`.
**Build tool:** Excel + Vista Create
**Save locations:**
- `templates/_delivery/_shared/str-chart-of-accounts-starter.xlsx`
- `templates/_delivery/_shared/str-chart-of-accounts-starter.pdf`
**Companion product:** Tax Season Bundle (BUNDLE-01 First-Year Host) or Chart of Accounts full (TAX-007)

---

## Why this magnet exists

Most hosts open QuickBooks Online (or Wave) and use the generic "rental real estate" chart of accounts — which is built for long-term landlords, not STR operators. The result: lodging tax, OTA fees, cleaning passthrough, and welcome gifts all dumped into "miscellaneous." Tax filing becomes guesswork.

A purpose-built STR chart of accounts maps every dollar to a specific Schedule E line, so at year end the CPA pulls one report and the entire Schedule E auto-populates. Hosts save 6–10 hours of categorization work and avoid the misallocation that triggers audits.

---

## Excel structure

### Tab 1 — STR Chart of Accounts (the starter COA, ready to import)

QBO-importable CSV-shape columns:

| Account # | Account Name | Account Type | Account Sub-Type | Schedule E Line | Notes |
|-----------|--------------|--------------|------------------|-----------------|-------|
| 1000 | Operating Cash | Bank | Checking | n/a | Main STR operating account |
| 1010 | Reserve Cash | Bank | Savings | n/a | 6-mo opex reserve |
| 1100 | Stripe Clearing | Bank | Other Current Asset | n/a | Sweeps to 1000 |
| 1200 | Airbnb Receivables | Other Current Asset | A/R | n/a | Tracks platform payouts in-flight |
| 1500 | Property — Land | Fixed Asset | Land | n/a | Non-depreciable |
| 1510 | Property — Building | Fixed Asset | Building | n/a | 27.5-yr depreciable basis |
| 1520 | Property — Furniture | Fixed Asset | Furniture | n/a | 7-yr MACRS |
| 1530 | Property — Appliances | Fixed Asset | Appliances | n/a | 5-yr MACRS |
| 1540 | Property — Land Improvements | Fixed Asset | Land Improvements | n/a | 15-yr MACRS |
| 1600 | Accumulated Depreciation | Fixed Asset | Accum Depreciation | Line 18 | Annual depreciation runs here |
| 2000 | Accounts Payable | Current Liability | A/P | n/a | |
| 2100 | Lodging Tax Collected | Current Liability | Sales Tax | n/a | **Liability — not revenue** |
| 2200 | Cleaning Fee Collected | Current Liability | Other | n/a | Passthrough to cleaner |
| 2500 | Mortgage Payable | Long-term Liability | Loan | n/a | Principal balance |
| 3000 | Owner Equity | Equity | Equity | n/a | |
| 3100 | Owner Draws | Equity | Equity | n/a | |
| 4000 | Rental Revenue — Airbnb | Income | Service | Line 3 | Gross before platform fee |
| 4010 | Rental Revenue — VRBO | Income | Service | Line 3 | Gross |
| 4020 | Rental Revenue — Direct | Income | Service | Line 3 | Off-platform direct bookings |
| 4100 | Cleaning Fee Income | Income | Service | Line 3 | Equal to 2200 expense — should net to $0 |
| 4200 | Damage Fee Income | Income | Service | Line 3 | Forfeited security deposits |
| 5000 | Advertising — Listing Services | Expense | Operating | Line 5 | OTA listing upgrades |
| 5010 | Advertising — Photography | Expense | Operating | Line 5 | Professional photos |
| 5020 | Advertising — Direct Booking SEO | Expense | Operating | Line 5 | Domain, hosting, SEO tools |
| 5100 | Auto — Mileage | Expense | Operating | Line 6 | Use Mileage Log TAX-001 |
| 5110 | Auto — Tolls/Parking | Expense | Operating | Line 6 | |
| 5200 | Cleaning — Cleaner Fees | Expense | Operating | Line 7 | Equal to 2200 passthrough |
| 5210 | Cleaning — Laundry Service | Expense | Operating | Line 7 | |
| 5220 | Cleaning — Restock & Consumables | Expense | Operating | Line 15 | Soap, coffee, TP |
| 5300 | Co-Host / Property Mgmt Fees | Expense | Operating | Line 8 | |
| 5400 | Platform Service Fees (Airbnb host fee) | Expense | Operating | Line 11 | Airbnb 3% host fee |
| 5410 | Stripe / Direct-Booking Fees | Expense | Operating | Line 11 | Payment processor cut |
| 5500 | Insurance — Property | Expense | Operating | Line 9 | STR-specific (Proper, Obie) |
| 5510 | Insurance — Umbrella | Expense | Operating | Line 9 | |
| 5600 | Legal & Professional — CPA | Expense | Operating | Line 10 | |
| 5610 | Legal & Professional — Permits | Expense | Operating | Line 10 | |
| 5620 | Legal & Professional — Registered Agent | Expense | Operating | Line 10 | |
| 5700 | Mortgage Interest | Expense | Operating | Line 12 | NOT principal |
| 5800 | Property Tax | Expense | Operating | Line 16 | |
| 5810 | Lodging Tax Remitted | Expense | Operating | Line 16 | Pulled from 2100 |
| 5900 | Repairs & Maintenance — Repairs | Expense | Operating | Line 14 | Restore to prior condition |
| 5910 | Repairs & Maintenance — Lawn/Snow | Expense | Operating | Line 14 | |
| 5920 | Repairs & Maintenance — Pest Control | Expense | Operating | Line 14 | |
| 6000 | Supplies — Consumables | Expense | Operating | Line 15 | <$200, used within year |
| 6010 | Supplies — Welcome Gifts | Expense | Operating | Line 15 | Wine, snacks for guests |
| 6020 | Supplies — Small Furnishings | Expense | Operating | Line 15 | <$200 single-item |
| 6100 | Utilities — Electric | Expense | Operating | Line 17 | |
| 6110 | Utilities — Gas | Expense | Operating | Line 17 | |
| 6120 | Utilities — Water/Sewer | Expense | Operating | Line 17 | |
| 6130 | Utilities — Trash | Expense | Operating | Line 17 | |
| 6140 | Utilities — Internet/Cable/Streaming | Expense | Operating | Line 17 | |
| 6150 | Utilities — Security/Monitoring | Expense | Operating | Line 17 | Ring, smart locks subscription |
| 6200 | Software — PMS (Hospitable, etc) | Expense | Operating | Line 19a | |
| 6210 | Software — Pricing (PriceLabs, etc) | Expense | Operating | Line 19a | |
| 6220 | Software — Smart Lock | Expense | Operating | Line 19a | |
| 6230 | Software — Bookkeeping | Expense | Operating | Line 19a | QBO, Wave, etc |
| 6300 | Bank & Merchant Fees | Expense | Operating | Line 19a | |
| 7000 | Depreciation Expense | Expense | Depreciation | Line 18 | Annual entry |
| 7100 | Interest — Other (HELOC) | Expense | Operating | Line 13 | If used for STR improvements |
| 9999 | Owner Personal Use Reimbursement | Expense | Operating | n/a | Counter-account if personal-use days |

**Total accounts:** 60. Importable as CSV into QBO via Settings → Chart of Accounts → Import.

### Tab 2 — Schedule E Mapping Reference

Auto-aggregates Tab 1 by Schedule E line, so user sees:
- "Line 5 Advertising: $X (from accounts 5000, 5010, 5020)"
- "Line 7 Cleaning: $X (from 5200, 5210)"
- etc.

At year end → run this report → that's their Schedule E.

---

## PDF Print Companion (1 page)

### Header
**The 7 most-misused account categories in STR bookkeeping** · *The STR Ledger*

### Body — top 7 mistakes (1-page summary)

1. **Lodging tax → Revenue (instead of Liability).** Hosts treat the 10% lodging tax collected from guests as revenue, then deduct it. It's actually a passthrough liability owed to the state. Use Account 2100, not 4000.

2. **Cleaning fee → Net (instead of Gross+Expense).** Charge guest $80 cleaning, pay cleaner $80, net = $0 to you. Many hosts only book the $80 expense and miss the $80 income. IRS expects both lines.

3. **Airbnb fees → Misclassified.** Airbnb's 3% host service fee = Schedule E Line 11 (Management). Most hosts book it to Line 5 (Advertising). Different line = different audit profile.

4. **Mortgage payment → Lumped together.** Mortgage payment has 4 components: interest (Line 12), principal (not deductible), tax escrow (Line 16), insurance escrow (Line 9). Must split.

5. **Repairs vs Capital Improvement.** Painting the deck = repair. Building a new deck = capital improvement (15-yr depreciation). Most hosts expense both. Audit risk if wrong.

6. **Welcome gifts → Meals.** Hosts often code wine and snacks as "Meals" (50% deductible). For STR they're "Supplies" (100% deductible) because the guest consumes them, not you.

7. **Personal-use days not tracked.** If you spend 14+ nights at the STR yourself, you must pro-rate every shared expense. Most hosts don't track this and silently fail vacation-home tests.

### CTA block
**Get the full STR Chart of Accounts + Mapping Reference for FREE →** thestrledger.com/chart-of-accounts

**Want it bundled with mileage log, schedule E workbook, and 1099 tracker? → First-Year Host Bundle, $47**

### Footer
*General educational information. Confirm chart of accounts with your CPA before importing. © 2026 The STR Ledger*

---

## Build checklist

- [ ] Excel: Tab 1 is QBO-importable shape (5-column CSV equivalent)
- [ ] Excel: Tab 2 SUMIF auto-aggregates Tab 1 by Schedule E line
- [ ] Excel: Account # column locked (data validation enforces format ####)
- [ ] PDF: 7-mistakes list formatted as numbered scrolling list, plenty of whitespace
- [ ] QR on PDF → `thestrledger.com/chart-of-accounts`
- [ ] Provide bonus: QBO-import-ready `.csv` export as a third file in the email gate

## Mini-magnet → product conversion target

- Opt-in CVR target: 22%+
- Upsell CTR to BUNDLE-01 in nurture sequence: 7%+
- Send timing: best in late January and late July (quarterly tax windows)
