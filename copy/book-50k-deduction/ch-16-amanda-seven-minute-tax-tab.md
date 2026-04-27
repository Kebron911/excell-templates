# Chapter 16 — Amanda's Seven-Minute Tax Tab

*The system, end-to-end.*

---

Amanda at her kitchen table, on the last Saturday of every quarter. Coffee. The shoebox. The Excel workbook on the laptop. Three Manila folders, each color-coded with a different sticky note: Cabin A is blue, Cabin B is yellow, Cabin C is green.

Twenty-one minutes later — seven per property — every transaction from the prior three months is categorized, every cleaner payment is on the right tab, every mile she drove is logged, and every receipt is photographed into the workbook. The Schedule E roll-up at the bottom of the file shows her each cabin's quarter-to-date net income, year-to-date cumulative, and projected annual.

She closes the laptop. The next quarter starts Monday. The shoebox is empty.

This is what the rest of the book has been building toward. Every chapter has contributed a discipline, a regulation, or a worksheet that lives somewhere in Amanda's twenty-one-minute Saturday. This chapter walks through the system end-to-end and shows what each prior chapter contributed to the workflow.

---

## The shoebox — the source of truth

Amanda's recordkeeping is not elegant. It is reliable, which matters more.

Three physical Manila folders sit on a shelf next to her front door. Each folder is labeled with the cabin name and a colored sticky note. Every receipt that comes home with her — a Home Depot run for a replacement lamp, a Costco trip for paper towels, a gas-station receipt from a property visit — gets a corner-flag in the matching color before it goes into the folder. Receipts she pays for digitally (Amazon orders, Stripe contractor payments) get an emailed PDF that she forwards to a folder in her email inbox.

By the end of a quarter the three folders contain somewhere between forty and a hundred and twenty paper receipts plus a smaller pile of digital ones. None of it is sorted internally. The order is whatever order they came home in.

This is the recordkeeping pact from **Chapter 3.** Contemporaneous capture. Sufficient, not elegant.

The shoebox isn't a workbook. It's the *input* to the workbook. Without it, the seven-minute tab takes seven hours.

---

## The quarterly cadence

Amanda runs the system on the last Saturday of every quarter — March 31, June 30, September 30, December 31 (or the closest weekend). The frequency matters: contemporaneous capture stays manageable in 90-day blocks; it becomes archaeology in 365-day blocks.

Quarterly is the discipline. Annual is the failure mode.

This is the §6001 contemporaneous principle from Chapter 3, applied to the host's own bookkeeping cadence rather than to individual transactions. The IRS doesn't require quarterly bookkeeping. The auditors prefer it. Hosts who survive audits cleanly almost universally run quarterly.

---

## What happens in the seven minutes

The workbook for a single property is open. Amanda takes the property's color-flagged receipts from the folder and works through the following sequence:

### Step 1 — Bank and card import (45 seconds)

Amanda has dedicated a credit card to each cabin. She downloads the quarter's CSV export from each card's online portal. The workbook has a paste-target tab; the CSV pastes in, columns auto-align, and the workbook applies its category rules to assign each transaction to a Schedule E line.

This is **Chapter 4** — the recurring ten — operationalized. Cleaning, utilities, supplies, lawn, pest, pool, security: all rule-matched against vendor names. About 85% of transactions auto-categorize without intervention.

### Step 2 — Manual categorization of the remaining 15% (1 minute 30 seconds)

The workbook flags transactions it couldn't classify. Amanda reads each one, picks a category from a drop-down, and moves on. Most are small and obvious — a Lowes purchase that's "Repairs" or a one-off contractor payment that's "Cleaning and maintenance."

The §263(a) BAR test from **Chapter 5** sits in the back of her mind for any line over $1,000: is it a repair (current expense) or an improvement (capitalize)? The workbook asks the question for any flagged item over the de-minimis threshold. Amanda answers. The workbook routes the line to either the current-year expense tab or the depreciation schedule.

### Step 3 — Receipt photography for §274(d) categories (1 minute 30 seconds)

For the property's §274(d) items — meals on overnight trips, lodging during a multi-day repair visit — Amanda photographs the corresponding receipts and drops them into the workbook's evidence-folder reference column. The photo lives in a cloud folder; the workbook stores the link.

This is **Chapter 9** in operational form. Strict substantiation under §274(d): amount, date, place, business purpose. The workbook captures all four; the photo backs up the receipt.

### Step 4 — Mileage log review (45 seconds)

Amanda's mileage log is in a separate workbook tab that she's been updating in real time across the quarter — date, purpose, start odometer, end odometer, miles for each trip. At quarter-end she scans the log for completeness, multiplies total business miles by the IRS standard rate for the year, and the workbook applies the result to the Schedule E vehicle-expense line.

**Chapter 9** again, captured contemporaneously in real time rather than reconstructed at quarter-end.

### Step 5 — Cleaning-fee reconciliation (30 seconds)

Amanda pulls the quarter's Airbnb host statement (downloaded from Airbnb's transaction history). The statement breaks out gross bookings, host service fees, and cleaning fees collected from guests. The workbook compares those totals against bank deposits and the cleaner-payment line items.

The gross-vs-net reconciliation from **Chapter 10**: gross income on Schedule E line 3, platform fees on line 19, cleaner payments on line 7. Net effect zero on margin; clean line items for the IRS computer-match.

### Step 6 — Contractor 1099 tracking (30 seconds)

The workbook has a contractor tab with one row per active contractor. Amanda checks the year-to-date total paid to each contractor; if any single contractor has crossed $600 for the year, the workbook flags them for the January 1099-NEC filing.

The W-9 file for that contractor — already collected at first payment per **Chapter 11** — is attached to the row. When January comes, the workbook generates a 1099-NEC packet from the row data automatically.

### Step 7 — Depreciation schedule pass-through (30 seconds)

The depreciation tab — built once at acquisition with the assessor's land/improvement ratio (**Chapter 6**), the cost-seg allocation (**Chapter 7**), and any §179/§168(k) elections (**Chapter 8**) — runs automatically every quarter. Amanda doesn't touch it unless a new asset was placed in service that quarter (in which case she adds a row).

Quarterly depreciation accrues on the schedule without intervention. Year-end depreciation is the line at the bottom of the schedule. No quarterly action required for ongoing assets.

### Step 8 — The Schedule E roll-up (30 seconds)

The workbook's final tab is the **Schedule E line-by-line roll-up.** Every transaction Amanda categorized in steps 1–7 maps to a specific Schedule E line. The roll-up shows the quarter's totals next to the year-to-date totals next to the projected annual.

Amanda glances at the projected annual. If anything looks off — a category running far above last year, an unexpected loss, a depreciation number that doesn't match her expectation — she investigates now while the data is fresh, not in March when memory has faded.

Seven minutes per property. Twenty-one minutes for three. Done by lunch.

---

## The annual close — twelve minutes more

The fourth quarter's Saturday session is a few minutes longer than the others because of the annual close items:

- **Home office allocation** (Chapter 12) — square-footage method or simplified method, applied once for the year against the property's allocable share of home expenses
- **Insurance and entity costs** (Chapter 13) — annual premiums, registered agent fees, annual report filings, all captured as discrete annual entries
- **Augusta Rule documentation** (Chapter 15) — if Amanda used the rule that year, the year's rental agreement, comparable-rate analysis, and business-purpose memo are filed in the workbook's evidence column
- **§179 and §168(k) election language** (Chapter 8) — the formal elections to be attached to the return

These are five-to-twelve-minute additions to the December 31 session. Total annual time investment for one property: roughly twelve quarterly sessions × seven minutes + twelve minutes annual close = **about 96 minutes per year per property.** For Amanda's three cabins: **288 minutes annually** — under five hours of bookkeeping for a year of clean Schedule E ready for the CPA.

---

## What this system replaces

Compare against the alternative most STR hosts run, which is some version of:

- A single shared "STR" credit card spanning multiple properties
- QuickBooks Online auto-categorizing Airbnb deposits as "Consulting Revenue"
- Receipts piled in a junk drawer
- A March bookkeeping marathon every year of 16–40 hours
- A CPA bill of $800–$2,000 to "clean up the books before filing"
- Missed deductions that nobody catches because nobody's looking at the data closely enough to notice

Amanda's system replaces every step:

- **Per-property cards** make categorization unambiguous
- **The workbook auto-categorizes** Airbnb deposits to the right Schedule E line
- **The shoebox plus quarterly cadence** captures receipts contemporaneously
- **The 96-minutes-per-year-per-property** total beats the March marathon by an order of magnitude
- **The CPA receives a clean file**, doesn't bill cleanup hours, and uses their time on tax-strategy questions instead
- **The deductions are visible** in the quarterly review, not forgotten until April

This is the system the rest of the book has been pointing at. Every chapter contributed a discipline. The chapters lived in front of you as forty-seven separate items because that's how the deduction list works. The system that runs them as one workflow is the workbook.

---

## What the workbook is, and what it isn't

The workbook — the Schedule E Tax Prep Workbook (TAX-004), or its smaller-property companion the Single-Property P&L (TAX-002) — is a structured Excel file. It is not magic. It is a set of:

- Pre-built tabs for income, each Schedule E line item, depreciation, contractors, mileage, home office
- Category rules that auto-classify common transaction descriptions
- Drop-downs that limit input options to valid Schedule E categories
- Formulas that roll quarterly data to year-to-date and to a Schedule E summary
- Evidence-link columns that point to receipt photos in a cloud folder
- Year-end utilities that generate 1099-NEC packets, depreciation schedules, and a CPA handoff file

Most of the workbook is data entry. The value is the structure — categories that match the IRS forms, reminders that surface §274(d) substantiation requirements, automatic flagging of items over capitalization thresholds, and the tab-organization that mirrors the seven-document rule from Chapter 3.

The workbook is not a substitute for understanding the regulations. It is the operational layer that makes applying the regulations routine.

---

## The quiet outcome

Amanda's CPA spends the annual filing meeting on **strategy** — should she Augusta-Rule the primary residence this year? Is the cabin in Pigeon Forge a candidate for cost segregation now that it's seasoning past year three? Should she consider a separate LLC for the new property she's eyeing?

The CPA does not spend the meeting reconstructing what happened during the year, because the year is already reconstructed. The CPA does not bill cleanup hours, because there's nothing to clean up. The CPA's deliverable for Amanda is increasingly *forward-looking*: planning, not reconciliation.

That shift — from cleanup-CPA to strategy-CPA — is the highest-ROI outcome of the system in this chapter. The CPA's time is expensive. Spending that time on strategy instead of bookkeeping is worth multiples of the deductions in any single chapter of this book.

This is what the next chapter — the CPA handoff — is built around.

---

> ### *Capture this in the Tax Season Bundle.*
>
> The Tax Season Bundle ($147) is the complete kit for the system in this chapter — the Schedule E Tax Prep Workbook (TAX-004), the Single-Property P&L (TAX-002), the Mileage Log (TAX-001), the 1099-NEC Tracker (TAX-003), the Per-Diem Tracker (TAX-007), the Quarterly Estimated Tax Workbook (TAX-005), the Home Office Allocator (TAX-006), the Cost Segregation DIY Workbook (TAX-010), and the Year-Over-Year Comparison Workbook. Amanda's twenty-one-minute Saturday is what these workbooks were built to make routine.
>
> `thestrledger.com/cap/16`

---

*This chapter is general guidance, not tax advice. Specific bookkeeping practices and substantiation requirements vary with the host's filing form, jurisdiction, and current Treasury regulations. Confirm your specific workflow with a qualified tax professional.*
