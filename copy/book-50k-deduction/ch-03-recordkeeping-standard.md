# Chapter 3 — The Recordkeeping Standard

*What survives an audit.*

---

Vanessa got the letter on a Tuesday in February. **Form 4564 — Information Document Request.** The opening salvo of an IRS examination of her 2023 Schedule E for the cabin she rents on a lake outside Knoxville. The agent wanted to see receipts, mileage logs, contractor agreements, payment records, utility bills, the bank statements for the rental account, and the depreciation schedule for the property. They gave her thirty days.

Vanessa had spent maybe ninety minutes a week, every week, putting documents into a workbook. Not because she was paranoid. Because she had read this chapter.

The audit closed in seventeen days. The auditor's only adjustment was a $43 reclassification of a Home Depot purchase from "Repairs" to "Supplies." Net change to her tax liability: nine dollars.

This chapter is not a deduction chapter. It is the chapter that decides whether every other chapter in this book lands at full strength or gets clawed back.

---

## What the IRS actually requires

Three rules govern recordkeeping for tax-deductible expenses.

**§6001 — the general rule.** Every taxpayer must keep "permanent books of account or records" sufficient to establish the items shown on the return. The regulation under §1.6001-1 elaborates: records must be "permanent" (not erasable), kept "as long as the contents thereof may become material," and "available for inspection" on request. The standard is unspecific by design — the IRS does not prescribe a format. Spreadsheets count. Receipts in a shoebox count. A QuickBooks export counts. What matters is sufficiency, not aesthetics.

**§274(d) — strict substantiation.** For four specific categories — travel away from home, meals, vehicle expenses, and "listed property" (which after TCJA is substantially limited to passenger autos and certain entertainment property; computers and peripheral equipment were removed from §280F listed-property treatment for property placed in service after 12/31/2017) — §274(d) requires substantiation that establishes:

- Amount of the expense
- Time and date of the expense
- Place of the expense
- Business purpose of the expense
- Business relationship of any persons involved (for meals and entertainment)

These five items must be documented contemporaneously. **The Cohan rule does not apply to §274(d) categories.** No estimate, however reasonable, will rescue a missing mileage log or an undocumented business meal. The deduction is disallowed.

**The Cohan rule.** *Cohan v. Commissioner*, 39 F.2d 540 (2d Cir. 1930), allows courts to approximate deductions when records are imperfect *and* the §274(d) strict-substantiation rules don't apply. The famous fact pattern was George M. Cohan — the songwriter — claiming travel and entertainment deductions he couldn't fully substantiate. The Second Circuit allowed reasonable estimates rather than disallow everything. The case still stands, but it has been narrowed almost to vanishing for STR-relevant categories.

**Do not rely on Cohan.** Cohan is the IRS losing on appeal — it is not a substantiation strategy. The strategy is contemporaneous documentation that makes Cohan irrelevant.

---

## The contemporaneous principle

The word that does the most work in §6001 enforcement is *contemporaneous.*

Logs created at the time of the activity are credible. Logs reconstructed from credit card statements three years later are weakly credible. Logs reconstructed in the week before an audit are not credible at all. The IRS has tools to detect reconstruction — handwriting consistency, file-creation metadata, calendar cross-checks against weather and reservation data, and inconsistencies between the log and contemporaneous supporting records.

This is not paranoia. It is examination practice.

The cost of contemporaneous logging is low. A mileage entry takes thirty seconds. A receipt photograph takes ten. A line in the workbook for a contractor payment takes one. The host who logs as they go spends maybe ninety minutes a week, like Vanessa, and walks into any audit with a complete file.

The host who reconstructs from statements at year-end spends fifteen to thirty hours in March and ends up with a partial file that contains gaps the auditor will find. The math is not close.

---

## What survives an audit — the seven-document rule

When an IRS examiner opens an STR audit, they ask, in roughly this order, for seven categories of documentation. A host who has all seven will pass cleanly. A host missing two of them will see disallowances on those categories.

1. **The closing statement** for the property, with land and improvement basis broken out. (Establishes basis for depreciation — Ch 6.)
2. **The depreciation schedule**, with placed-in-service date, basis allocation across asset classes, and prior-year depreciation taken. (Establishes the year's depreciation deduction — Ch 6/7/8.)
3. **A reservation log** showing dates, guest names, nightly rate, total revenue per booking, and cleaning fees. (Establishes income and the average-period-of-customer-use calculation — Ch 1.)
4. **An expense ledger** showing every line on Schedule E with supporting transactions, organized by category. (Establishes deductions broadly.)
5. **Receipts for individual expenses over $75**, plus all expenses in §274(d) categories regardless of amount. (Established by §1.274-5(c)(2)(iii).)
6. **A mileage log** for any vehicle deduction taken, with date, purpose, start and end odometer, and miles per trip. (Required by §274(d) — Ch 9.)
7. **Contractor and 1099 records** for any payments to non-employees: W-9s collected, 1099-NECs issued, and the payment trail. (Required by §6041 — Ch 11.)

Vanessa had all seven. The audit closed in seventeen days.

Hosts missing #5 (receipts) frequently lose 10–25% of itemized deductions in the affected category — the auditor disallows what can't be substantiated, plus interest, plus a possible penalty.

Hosts missing #6 (mileage log) lose the entire vehicle deduction. §274(d) is unforgiving.

Hosts missing #7 (1099 records) face a separate problem: the IRS may assert §3406 backup withholding liability against the host for the unreported contractor payments, plus penalties under §6722 for failure to file 1099-NEC. This can cost more than the underlying deduction.

---

## Digital vs. paper

The IRS accepts digital records under Rev. Proc. 97-22, provided the digital system:

- Captures the records accurately
- Preserves the records' integrity (no unauthorized alteration)
- Allows full retrieval for inspection
- Includes adequate documentation of the system itself

In practice this means: a workbook with embedded receipt photos, a folder of PDF statements, and a backup copy. That's the standard. You do not need a SOC-2-certified retention platform. You need files you can find and that you can prove haven't been altered.

Three practical guardrails:

1. **Photograph receipts within forty-eight hours** of the transaction. Cell-phone photos with EXIF metadata establish contemporaneous capture.
2. **Back up the workbook monthly** to a second location — cloud, external drive, or both. A workbook that gets corrupted in March without a backup is, for audit purposes, a workbook that didn't exist.
3. **Keep the originals for §274(d) categories.** Mileage logs in particular benefit from a paper or app-based log with timestamps that cannot be plausibly reconstructed.

---

## Retention timelines

The IRS statute of limitations for routine assessment is **three years** from the original due date of the return. Most audits open within this window.

Three exceptions extend the window:

- **§6501(e) — substantial omission.** If a return omits more than 25% of gross income, the statute extends to **six years**.
- **§6501(c)(1) — fraud or no return filed.** No statute of limitations.
- **Depreciation records.** Even after the assessment statute closes, depreciation schedules must be retained for the life of the asset plus three years after disposition. A 27.5-year residential rental's depreciation records must therefore be retained for **at least 30.5 years.**

The practical retention rule: **keep everything for seven years**, and keep depreciation, basis, and improvement records for the life of the property plus seven. Storage is cheap. Reconstructing a 2014 closing statement in 2032 is not.

---

## The audit-survival workbook

The Schedule E Workbook the rest of this book points to — and that Vanessa used — is structured around the seven-document rule. Each tab corresponds to one of the seven categories. The reservation log feeds the income tab. The expense ledger feeds the Schedule E line items. The mileage log feeds the vehicle tab and applies the §274(d) strict-substantiation rules. The depreciation schedule populates from the asset basis allocation.

The workbook is not magic. It is a single file that, when filled out as you go for ninety minutes a week, produces seven complete documents the IRS asks for in the order they ask for them. Vanessa's audit closed in seventeen days because her file was already organized in the auditor's preferred order.

This is what most hosts mean when they say their CPA "thanked them" for the workbook. The CPA isn't thanking them for the deductions. The CPA is thanking them for the file.

---

## The recordkeeping pact

If the rest of this book teaches you what to claim, this chapter teaches you what to keep.

The pact has three parts:

1. **Log it as you go.** Every expense, every trip, every contractor payment, captured within the week. Not the month. Not the quarter. Not March of next year.
2. **Keep the supporting documents.** Receipts over $75 mandatory; under $75 strongly recommended. All §274(d) categories regardless of amount.
3. **Back it up.** One workbook, one cloud copy, one local copy. Monthly cadence. The day the workbook is corrupted is not the day to discover you have no backup.

If any of those three feels onerous, you are running a portfolio without books. Fix that before you keep reading. The deductions in the rest of this book recover real money for hosts who can document them. The hosts who can't, can't.

---

> ### *Capture this in the Schedule E Workbook.*
>
> The Schedule E Tax Prep Workbook (TAX-004) is built around the seven-document rule in this chapter. Each tab corresponds to one of the seven categories an IRS examiner asks for. Use it weekly, in ninety-minute sessions, and the audit you may never face is already organized.
>
> `thestrledger.com/cap/03`

---

*This chapter is general information, not tax advice. Recordkeeping requirements vary by jurisdiction, by tax-year specific rules, and by the nature of the activity. Run your specific recordkeeping setup past a qualified tax professional before relying on it for filing.*
