# Tax-Professional Review — *The $50,000 Deduction*

**Reviewer:** Acting tax-pro pass, cross-referenced against the *Short-Term Rental Finances & Requirements (Airbnb/Vrbo)* NotebookLM source set.
**Date:** 2026-04-26
**Scope:** All 17 chapters (front-matter, Ch 1–17, back-matter not reviewed here).
**Purpose:** Surface factual errors, regulatory misstatements, dollar/percentage mistakes, and internal inconsistencies that a CPA or EA would flag before signing off on accuracy.

> **Severity key**
> - **CRITICAL** — wrong on the law; could cause a reader to file an incorrect return or lose a deduction on examination.
> - **HIGH** — outdated number, stale threshold, or imprecise regulatory wording that a careful reader will catch and that an examiner will pick at.
> - **MEDIUM** — internally inconsistent, oversimplified, or incomplete; not wrong, but not safe.
> - **LOW** — copy-edit / citation hygiene.

---

## CRITICAL findings

### C1. Ch 12 — Home office for Schedule E filers is NOT a slam-dunk

**Location:** [ch-12-home-office.md](ch-12-home-office.md), framework section + Maya example.

The chapter treats §280A(c)(1) as universally available to STR hosts and walks Maya through a regular-method calculation without first establishing the **trade-or-business** gate.

§280A(c)(1) requires the area to be used "in connection with the taxpayer's **trade or business**." A pure §212 production-of-income activity (which is what a passive Schedule E rental generally is) does **not** clear this gate. Per the IRS guidance the notebook surfaces:

> "Generally, short-term rental hosts who file Schedule E cannot claim a home office deduction under Section 280A(c)(1)... The space must be used for your 'trade or business'... The IRS typically classifies standard rental activities reported on Schedule E as 'production of income' (passive or investment) rather than a 'trade or business' under Section 162."

Maya manages "three properties from her dining room table" — the chapter never establishes whether her activity rises to a §162 trade or business or stays in §212 territory. If she's filing Schedule E **passive**, her home office deduction is at significant risk on examination.

**Fix:** Add a gating paragraph before the worked example:
- Schedule C: home office available.
- Schedule E **non-passive** (Ch 1 Outcome B) with material participation: defensible.
- Schedule E **passive**: deduction generally not available; cite §280A(c)(1)'s "trade or business" language and the §212 vs. §162 distinction.

Without this gate, the chapter ships hosts toward a deduction that auditors are aggressive about disallowing — exactly the kind of mistake the book warns against in other chapters.

---

### C2. Ch 7 — Amanda's §481(a) catch-up math doesn't reconcile

**Location:** [ch-07-cost-segregation.md](ch-07-cost-segregation.md), opening anecdote vs. worked example.

Two numbers in the chapter cannot both be true:

1. **Opening:** Amanda's §481(a) adjustment "put **$8,427** of previously-undepreciated value on her current-year return" — for one cabin, four years past placed-in-service.

2. **Worked example:** Same cabin. Year-1 deduction with cost-seg = ~$68,491 vs. without = ~$7,955. **Year-1 differential = ~$60,536** at 100% bonus.

If Amanda missed cost seg for four years and is filing Form 3115 in year five, the §481(a) catch-up should be roughly:

| Year | Without cost seg | With cost seg | Differential |
|---|---|---|---|
| 1 | $7,955 | $68,491 | +$60,536 |
| 2 | $9,094 | $6,821 | −$2,273 |
| 3 | $9,094 | $6,821 | −$2,273 |
| 4 | $9,094 | $6,821 | −$2,273 |
| **Cumulative §481(a)** | | | **≈ $53,717** |

$53,717 is the order of magnitude; **$8,427 is roughly the tax savings at a 24% marginal rate on ~$35K of catch-up** — but the chapter explicitly labels it "previously-undepreciated value," which is the deduction itself, not the tax saved.

**Fix:** Either rewrite the opening to say "**~$53,000** of previously-undepreciated value, which at her marginal rate cut her current-year tax by **~$8,427**," or revise the worked example to match an $8,427 catch-up scenario (e.g., a much smaller cabin, a much later year, or a non-100%-bonus year). The current pairing fails arithmetic on first inspection by anyone who reads both halves of the chapter.

---

### C3. Ch 1 — Material participation test wording is regulation-imprecise in three places

**Location:** [ch-01-schedule-e-or-c.md](ch-01-schedule-e-or-c.md), §1.469-5T(a) seven tests.

Three tests are restated in a way that mis-states the regulatory threshold by one hour or one degree:

| Test | Book says | Reg. §1.469-5T(a) actually says |
|---|---|---|
| **#1 — 500-hour** | "500 **or more** hours" | "**More than 500** hours" (501+) |
| **#3 — 100-hour vs. anyone** | "**At least** 100 hours AND **more than** any other single individual" | "**More than 100** hours AND **not less than** any other individual" (equal-counts-qualifies) |
| **#7 — Facts & circumstances** | "**At least** 100 hours" | "**More than 100** hours" (>100) |

These look like nits but they're exactly the kind of misstatement that hands an examiner an easy disallowance. If a reader logs 500 hours flat and relies on the book's "or more" framing, they fail Test 1. If a reader logs 100 hours exactly under Test 3 and matches a cleaner who logged 100 hours, they fail (book) but pass (reg.) — the book is *more* restrictive than the law in two places and *less* restrictive in one.

**Fix:** Change "or more"/"at least" to "more than" everywhere, and change Test 3's "more than any other" to "not less than any other."

---

### C4. Ch 4 & Ch 11 — $600 1099-NEC threshold is stale for a book launching into the 2026 tax year

**Location:** [ch-04-operating-expenses.md](ch-04-operating-expenses.md) §#4 cleaning; [ch-11-professional-services-and-1099s.md](ch-11-professional-services-and-1099s.md) throughout.

The book uses the **$600** §6041 threshold throughout. For payments made after **December 31, 2025**, the §6041(a) threshold rises to **$2,000** (with future inflation adjustment). The book is being prepared for sale during the 2026 tax season and will be read by hosts filing the 2026 calendar-year payments.

**Fix:** Every reference to "$600" needs a parenthetical "($2,000 for payments made after December 31, 2025)." This is a 2024 law change (originating in §6041(a)(1) as amended) and is the single most consequential 1099 update in the book's lifecycle.

---

## HIGH-severity findings

### H1. Ch 8 — §179 dollar limits are 2023/2024 only; doesn't reflect the 2025+ jump

**Location:** [ch-08-section-179-and-bonus-depreciation.md](ch-08-section-179-and-bonus-depreciation.md), "§179 dollar limits" subsection.

Book: "$1,160,000 in 2023, $1,220,000 in 2024."

The 2025 §179 cap is **$2,500,000** (with phase-out at **$4,000,000**) under the One Big Beautiful Bill Act (P.L. 119-21). 2026 is **$2,560,000** with phase-out at $4,090,000.

**Fix:** Update the dollar table to include 2025 and 2026, and note the OBBBA-driven step change. The book's reassurance that "the cap is well above any realistic single-year STR commissioning budget" still holds — *more* so, in fact — but the specific numbers are out of date.

---

### H2. Ch 8 — Bonus depreciation post-OBBBA wording is too vague

**Location:** [ch-08-section-179-and-bonus-depreciation.md](ch-08-section-179-and-bonus-depreciation.md), "The rate has moved" subsection.

Book: "Restored to 100% by subsequent legislation for property placed in service after a specified date."

The "specified date" is **January 19, 2025** — property *acquired* after this date and placed in service from that point forward gets 100%. Property acquired *before* 1/20/2025 but placed in service in 2025 is still under the prior phase-down (40% in 2025).

**Fix:** Name the date and the acquisition-vs-placed-in-service nuance. The vague phrasing forces every reader to do their own legal research, which the chapter elsewhere argues against.

The full historical schedule (per source set):

| Placed in service | Rate |
|---|---|
| 2017 (post-9/27) – 2022 | 100% |
| 2023 | 80% |
| 2024 | 60% |
| 2025 (acquired before 1/20/2025) | 40% |
| 2025 (acquired after 1/19/2025) – 2026+ | 100% (permanent) |

---

### H3. Ch 11 & Ch 4 — §6722 penalty amounts are out of date

**Location:** [ch-11-professional-services-and-1099s.md](ch-11-professional-services-and-1099s.md) "penalties" subsection; [ch-04-operating-expenses.md](ch-04-operating-expenses.md) "1099 trigger" sidebar.

Book: "$50–$310 range per form... intentional disregard penalties starting around $630."
Book Ch 4: "up to $310 per missed 1099."

Current statutory tiers for 2024 returns (filed in 2025):

| Late by | Penalty per return |
|---|---|
| ≤ 30 days | $60 |
| 31 days – August 1 | $130 |
| > August 1 or not filed | $330 |
| Intentional disregard | $660 (no annual cap) |

For 2025 returns the top tier is $340 / intentional $680.

**Fix:** Replace static dollar figures with the current tier table or with "indexed annually — the 2024 figures are $60 / $130 / $330, and intentional-disregard exceeds $660 with no cap." Keep the calibration in the body language ("$2,500–$5,000 range" for four missed 1099s × two years) but ground it in current tiers.

---

### H4. Ch 6 — Henry's missed-depreciation total is ~$500 light

**Location:** [ch-06-building-depreciation.md](ch-06-building-depreciation.md), opening anecdote.

Book: "Henry's missed depreciation across 2022 and 2023 was approximately **$15,800**."

Math from the chapter's own example ($250,100 basis, March 2022 placed-in-service):
- 2022 (mid-month March, 79.17%): $9,094.55 × 0.7917 = **$7,201**
- 2023 (full year): **$9,095**
- Total: **$16,296**

The stated $15,800 is light by ~$500. Either the basis or the placed-in-service month implied by the rest of the chapter doesn't match the figure. Easy to fix; readers who reach for a calculator will notice.

---

### H5. Ch 1 — SE tax description in the framework section is misleading

**Location:** [ch-01-schedule-e-or-c.md](ch-01-schedule-e-or-c.md), Megan's anecdote and §1402 paragraph.

Book (anecdote): "15.3% on the first portion of net earnings, plus another **2.9% above the Social Security wage base**."

This phrasing implies an **additional 2.9% stacks on top** of 15.3% above the wage base. The actual structure is:

- Below SS wage base: **15.3%** total (12.4% Social Security + 2.9% Medicare)
- Above SS wage base: **2.9%** total (Social Security ceiling reached; only Medicare continues)
- Above $200K (single) / $250K (MFJ): **+0.9%** Additional Medicare Tax (so 3.8% on the marginal Medicare portion)

The book later restates this correctly in the §1402 paragraph ("15.3% on net earnings up to the Social Security wage base, 2.9% above it, plus an additional 0.9% Medicare surtax"), but the anecdote version implies wrong arithmetic on Megan's $120K. The Megan number ($50K over three years) happens to come out roughly right because all of $120K is below the wage base in 2020–2022 — but the framing teaches the wrong rule.

**Fix:** Rewrite the anecdote-paragraph SE-tax line to match the §1402 paragraph's correct structure.

---

### H6. Ch 9 — Standard mileage rate citation §1.274-5(j) is approximate

**Location:** [ch-09-mileage-per-diem-lodging.md](ch-09-mileage-per-diem-lodging.md), Ch 2 cross-reference and Ch 9 §274(d) framing.

Book cites "§1.274-5(j)" as the source of the standard mileage rate. The mileage rate itself is published annually by Rev. Proc. (2024-08 for the 2024 rate of 67¢; 2024-79 / equivalent for 2025 at 70¢). Treas. Reg. §1.274-5 covers substantiation generally; the optional mileage method's authority is in §1.274(d) substantiation regs combined with the annual Rev. Proc.

The 2024 (67¢) and 2025 (70¢) rates in the chapter are correct. For a book launching toward 2026 returns, also note **2026: 72.5¢/mile**.

**Fix:** Either cite the current Rev. Proc. for the rate or attribute it generically to "the IRS standard mileage rate published annually." Add the 2026 rate.

---

## MEDIUM-severity findings

### M1. Ch 11 — The "PM files the 1099" rule is more nuanced than stated

**Location:** [ch-11-professional-services-and-1099s.md](ch-11-professional-services-and-1099s.md), pass-through-payment subsection.

Book: "If the PM is paying contractors on your behalf, the PM is the one who files the 1099 to those contractors (since the PM is the direct payer). You don't need to also file 1099s for those pass-through contractors."

This is approximately correct under Treas. Reg. §1.6041-1(e), where the **person who has management or oversight of payment** is the obligor. But the rule is fact-driven:

- PM operating a **trust account**, with **discretion** over which contractors are hired and paid → PM is the §6041 obligor. Book's framing holds.
- PM acting as **bare agent** following the owner's instructions, with the owner's funds clearly identified → owner may still be the obligor; some practitioners require the PM to issue *and* the owner to issue.

For belt-and-suspenders compliance, many real-estate-focused CPAs counsel owners to keep the PM's annual 1099 filing confirmation in their files (book mentions this) **and** to consider issuing 1099s themselves on cleaner pass-throughs over the threshold if the PM-as-agent question is unclear.

**Fix:** Hedge the absolute language. Suggest: "If the PM is paying contractors on your behalf with discretion and from PM-controlled trust funds, the PM is generally the §6041 obligor and you do not also file. Confirm in writing with your PM each year that they handled the filings."

---

### M2. Ch 5 — Small-taxpayer safe harbor is missing the gross-receipts eligibility test

**Location:** [ch-05-repairs-vs-improvements.md](ch-05-repairs-vs-improvements.md), Safe Harbor #3.

Book gives the building-basis test ("$1 million or less") and the dollar/percent caps ("$10,000 or 2%"). Missing: the **§1.263(a)-3(h) eligibility requires the taxpayer be a "qualifying small taxpayer,"** which means **average annual gross receipts ≤ $10 million** for the prior three tax years.

For an STR host this is essentially never binding (you'd need many millions of revenue), but the book elsewhere is meticulous about citing every gating element of every safe harbor. Omission here is inconsistent.

**Fix:** Add a one-line eligibility footnote: "The host also must qualify as a small taxpayer under §1.263(a)-3(h)(4) — average annual gross receipts ≤ $10M over the three preceding years. For solo and small portfolio hosts, this test is automatic."

---

### M3. Ch 6 — Path A (amend) vs. Path B (Form 3115) for missed depreciation is over-confident

**Location:** [ch-06-building-depreciation.md](ch-06-building-depreciation.md), "Henry's path forward."

Book: "Path A — Amend the prior return. If only one year was missed and the statute of limitations is open... an amended return on Form 1040-X can be filed claiming the missed depreciation for that single year."

Per Rev. Proc. 2015-13 (and successors) and Treas. Reg. §1.446-1(e)(2)(ii)(d)(2)(i), depreciation method changes (including catch-up of impermissible methods) are accounting-method changes generally requiring Form 3115. **Single-year errors** can sometimes be corrected by amended return because they're treated as "mathematical or posting errors" rather than a method, but the line is fact-specific:

- If you took depreciation but used the wrong method/life: method change, Form 3115 required even for one year.
- If you simply didn't enter the asset on the schedule (a "math error"): amended return acceptable.

Henry's situation (preparer left depreciation off entirely) is closer to the latter, so the Path A advice survives — but the chapter's framing ("only one year" → amend) is too clean. Many CPAs file Form 3115 even for single-year errors to avoid the "is this a method change or a math error?" argument.

**Fix:** Soften Path A: "Single-year omissions are sometimes correctable by amended return when the issue is a math/posting error rather than an accounting-method choice. When in doubt, Form 3115 is the safer route — it works for both."

---

### M4. Ch 5 — Marcus deck partial-asset-disposition math uses straight-line on a 150%-DB asset

**Location:** [ch-05-repairs-vs-improvements.md](ch-05-repairs-vs-improvements.md), "partial asset disposition."

Book: "Marcus's old deck, twelve years into a 15-year land improvement schedule, had remaining undepreciated basis of roughly $400 (assuming the original deck cost $2,000 and was on the 15-year line)."

15-year MACRS uses **150% declining balance** with switch to straight-line, not pure straight-line. Twelve years into the actual MACRS table, the remaining basis is materially smaller than $400 — closer to **$135** for a $2,000 asset placed in service mid-year. The number $400 implies straight-line ($2,000/15 × 12 = $1,600 depreciated → $400 remaining), but that's not what 15-year property does.

The pedagogical point survives — there's a partial-disposition deduction left on the table — but the dollar figure is off by ~3×.

**Fix:** Either swap to a straight-line example (a 39-year nonresidential commercial improvement, say) or use the actual 15-year MACRS table to get the residual right.

---

### M5. Ch 14 — §274(b) "incidental costs" exclusion oversimplified

**Location:** [ch-14-marketing-guest-education.md](ch-14-marketing-guest-education.md), per-guest gifts subsection.

Book: "Engraving, gift wrapping, packaging, shipping, and delivery are deductible separately and don't reduce the $25 ceiling."

Per Treas. Reg. §1.274-3(c)(2), incidental costs are excluded from the $25 limit only if they "do not add substantial value" to the gift. Engraving on a watch, for instance, does add substantial value and is **not** excluded. Gift wrapping, packaging, and shipping generally do qualify as incidental.

Lena's $4 of "branded packaging on a $25 bottle" survives. But a host who engraves a host name on a $25 cutting board may not get to keep the engraving cost outside the cap.

**Fix:** Add the "do not add substantial value" qualifier from the regulation. One-line fix.

---

### M6. Ch 1 — Outcome A ("Schedule E passive") description conflates two paths

**Location:** [ch-01-schedule-e-or-c.md](ch-01-schedule-e-or-c.md), "Three outcomes" table.

Book: "Outcome A — Schedule E (passive activity). Average stay > 7 days *or* (8–30 days without substantial services) *or* 30+ days. Default treatment. No SE tax. Losses limited under §469 unless you qualify as a real estate professional under §469(c)(7)."

The §469(c)(7) REPS designation is **not** the only route past §469 for an STR. For a property with avg stay ≤ 7 days, §1.469-1T(e)(3)(ii)(A) takes the activity *out of the rental category entirely* — at which point material participation alone (no REPS hours required) makes losses non-passive. That's exactly what Outcome B is.

The Outcome A description is correct *for properties that fail the 7-day rule* (long-term/longer-stay rentals), where REPS is the only escape from §469. But the framing reads as if REPS is the only escape ever, full stop, which contradicts Outcome B on the same page.

**Fix:** Tighten Outcome A: "...losses limited under §469 unless you qualify as a real estate professional under §469(c)(7). (The 7-day-rule path to non-passive treatment in Outcome B does not apply here because average stay > 7 days.)"

---

### M7. Ch 12 — Soliman case lacks proper citation

**Location:** [ch-12-home-office.md](ch-12-home-office.md), principal-place-of-business prong.

Book: "the 'soft principal place' rule established in §280A(c)(1) (last sentence) — added by Congress in 1997 to fix a Supreme Court decision (Soliman) that had narrowed the home office deduction unreasonably."

**Commissioner v. Soliman** is **506 U.S. 168 (1993)**. The legislative fix was in the Taxpayer Relief Act of 1997, effective for tax years beginning after 12/31/1998. Add the case citation; readers who want to know where the rule comes from will look for it.

---

## LOW-severity findings

### L1. Ch 3 — "Deduction #2" mislabel on the hour log

[ch-03-recordkeeping-standard.md](ch-03-recordkeeping-standard.md) calls the material-participation hour log "deduction #2 of the 47" and immediately disclaims that the log isn't deductible. If the count is "47 deductions," the framing should not award a slot to a non-deduction. Recommend re-numbering or recasting as "an enabling discipline that protects deductions #1 and beyond."

### L2. Ch 1 — SE-tax-on-$120K rough calculation

The 92.35% net-earnings adjustment for SE tax (§1402(a)(12)) is glossed over. $120K × 0.9235 × 0.153 = $16,955 — book's "$16,000–$17,000" range catches this approximately, but the exact arithmetic is invisible. Optional add: a one-line footnote on the 92.35% factor.

### L3. Ch 9 — 2026 mileage rate missing

Book lists 2024 (67¢) and 2025 (70¢). For a book launching into the 2026 tax year, add **2026 (72.5¢)**.

### L4. Ch 13 — California LLC fee tier omitted

Book mentions California's $800 minimum LLC tax. California also imposes a **gross-receipts fee** (Cal. Rev. & Tax. §17942) on top of the $800 for LLCs with CA-source gross receipts ≥ $250K, scaling to ~$11,790 above $5M. STR LLCs in California with multi-property revenue can hit the fee tiers. Not strictly an error — just incomplete.

### L5. Ch 2 — De-minimis safe harbor "$2,500 per invoice line"

Treas. Reg. §1.263(a)-1(f) actually says "**per item or per invoice**" — the book says "per invoice line." Functionally similar; some CPAs read "per invoice line" as a stricter test. Worth aligning to the regulatory phrasing.

### L6. Ch 11 — Pre-payment W-9 best-practice slightly overstated

"Most contractors complete and return the form same-day; they're used to it." True for established contractors; less reliable for one-time handymen and vacation-market cleaners with informal businesses. Calibrate expectations or add a fallback procedure for the contractor who refuses the W-9 (the host should issue payment net of 24% backup withholding under §3406).

### L7. Ch 7 — "Hospital Corporation of America" citation

"Hospital Corporation of America v. Commissioner, 109 T.C. 21 (1997)" — citation is correct ✓. (Verified for the record.)

### L8. Ch 4 — Schedule E line numbers

Schedule E line numbers cited in Ch 4 (line 7 cleaning/maint, line 11 management, line 15 supplies, line 17 utilities, line 19 other) match the current Schedule E ✓. Worth re-verifying against the IRS-published 2025 form when the book goes to print, since the IRS occasionally renumbers.

### L9. Ch 8 — "5% MACRS year-1" for fourth-quarter mid-quarter convention

[ch-08-section-179-and-bonus-depreciation.md](ch-08-section-179-and-bonus-depreciation.md): "$52,000 × 5% = $2,600" implies year-1 mid-quarter Q4 placement on 5-year property. The IRS table for 5-year property, mid-quarter convention, Q4: **5.00%** ✓. Verified.

### L10. Ch 15 — Repair carveout from personal-use days is narrower than implied

§280A(d)(2) excludes from personal use any day on which the taxpayer **engages in repair and maintenance on a substantially full-time basis**, even if family members happen to be there. Book uses the phrase "as long as the principal purpose is repair or maintenance and the host substantially documents this." The regulation requires **substantially full-time** repair work, not merely "principal purpose." Tighten the language.

### L11. Ch 15 — Charitable-donation day not mentioned

§280A(d)(2)(B)(ii) treats as personal use any day the property is used by anyone whose use is by reciprocal-use arrangement *or* under a charitable-contribution use agreement. The book covers the reciprocal piece but not the charitable-donation piece. Optional add for completeness.

---

## Summary scorecard

| Severity | Count |
|---|---|
| Critical (regulatory or arithmetic errors) | **4** |
| High (outdated numbers, imprecise wording) | **6** |
| Medium (oversimplification, incomplete) | **7** |
| Low (citations, copy-edit) | **11** |
| **Total flagged** | **28** |

**Top three actions before launch:**

1. **Fix Ch 12's home-office gate** (CRITICAL #1). This is the single largest examination-risk item in the book. A reader following Maya's example on a passive Schedule E filing is set up to lose the deduction on audit.
2. **Reconcile Amanda's §481(a) numbers in Ch 7** (CRITICAL #2). The opening anecdote and the worked example contradict each other by an order of magnitude.
3. **Update every $600 1099 reference for the post-2025 $2,000 threshold** (CRITICAL #4) and refresh §179 / bonus depreciation numbers throughout Ch 8 (HIGH #1, #2). The book is launching into a tax year in which several of its key dollar figures have moved.

The book's regulatory framework is generally sound — the chapters cite real regs and lean on real cases. The errors are concentrated in (a) precision of regulatory thresholds (off-by-one-hour, off-by-one-dollar), (b) post-OBBBA updates that haven't been pulled through, and (c) one critical gating issue in Ch 12 that needs to be addressed before any reader follows the example to a deduction they don't qualify for.

---

*Reviewer note: NotebookLM queries against the project's "Short-Term Rental Finances & Requirements (Airbnb/Vrbo)" source set were used to verify regulatory thresholds, current dollar amounts, and the home-office trade-or-business gate. Citations returned by the source set agree with the IRS-published guidance current as of April 2026.*
