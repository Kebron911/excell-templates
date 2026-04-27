# Tax-Professional Review Memo — *The $50,000 Deduction*

**To:** The STR Ledger
**Re:** Federal-tax accuracy review — pre-print
**Manuscript:** 17 chapters + front matter + back matter (~50,000 words)
**Review date:** 2026-04-26
**Format:** Memo (per the brief's Option B), tier-labeled per 🔴 / 🟡 / 🟢 convention

---

## Reviewer disclosure

This memo was produced as an AI-assisted first-pass review (Claude, Anthropic), applying the framework in `tax-pro-review-brief.md` against the manuscript and against U.S. federal tax law as of the January 2026 knowledge cutoff. It is **not** a substitute for a credentialed CPA or EA review and is offered as a structured starting point — every 🔴 and 🟡 item below should be confirmed by a licensed practitioner before print.

The headline finding: the **One Big Beautiful Bill Act (OBBBA), signed July 4, 2025**, materially changed at least four numbers and one reporting threshold cited in this manuscript. A 2026-published book that ships without addressing the OBBBA changes will read as out-of-date to any STR-focused CPA on first scan.

---

## Summary of findings

| Tier | Count | Definition |
|---|---|---|
| 🔴 Must fix before print | **3** | Statement is incorrect, misleading, or no longer current under post-publication law |
| 🟡 Worth fixing | **13** | Technically correct but loose, ambiguous, out-of-date by a cycle, or could be tightened |
| 🟢 Optional polish | **7** | Nuance or "you could also mention" — ignore if tight on time |
| **Total flags** | **23** |  |

**Print-readiness verdict:** The manuscript is well-structured, well-cited on most regulations, and consistent in voice. The dominant risk to a 2026 ship is OBBBA-driven and concentrated in three chapters (Ch 1 cold open, Ch 8, Ch 11). Resolve the 🔴 items and a single editorial pass on the 🟡 items, and the manuscript clears the bar in the brief.

---

## 🔴 Must fix before print

### 🔴 1. Ch 8 — §179 dollar cap is two indexing cycles out of date

**Location:** [ch-08-section-179-and-bonus-depreciation.md:59](ch-08-section-179-and-bonus-depreciation.md:59) — *"The annual cap was $1,160,000 in 2023, $1,220,000 in 2024..."*

**Issue:** Under **OBBBA §70306**, the §179 expensing cap was raised to **$2,500,000** with phase-out beginning at **$4,000,000** of qualifying property placed in service, effective for property placed in service in tax years beginning after Dec 31, 2024. The cited 2023/2024 figures understate the available deduction by roughly 2× for any host reading this in 2026.

**Recommended fix:** Either reframe year-agnostically ("look up the current cap; it has moved twice in the last three years") or update to the OBBBA figure with an inflation-indexing hedge. The chapter's "the cap is not a meaningful constraint for STR hosts" framing remains correct under the new figures and gets stronger.

---

### 🔴 2. Ch 11 — $600 1099-NEC threshold is wrong for tax-year-2026 payments

**Location:** Throughout Ch 11 ([line 23](ch-11-professional-services-and-1099s.md:23), [78](ch-11-professional-services-and-1099s.md:78), [92](ch-11-professional-services-and-1099s.md:92)); also Ch 4 cross-reference at [line 39](ch-04-operating-expenses.md:39).

**Issue:** **OBBBA §70433** raised the §6041 threshold (and the §6041A threshold for non-employee compensation) from $600 to **$2,000** for payments made after Dec 31, 2025, with inflation adjustment for years beginning after 2026. A 2026-published book speaks to hosts whose 2026 payments — filed Jan 2027 — fall under the new $2,000 floor. The Sloane and Ahmad worked examples (a cleaner crossing the line at the thirteenth turnover; four contractors at "more than $600 each") need a forward-looking note.

**Recommended fix:** Footnote the $600 figure as the 2025-and-prior threshold and explicitly cite **$2,000** for 2026 payments forward, with the inflation hedge ("indexed for inflation in tax years beginning after 2026"). The chapter's underlying point — that the W-9 discipline matters and the deduction stands or falls separately — is intact under either threshold.

---

### 🔴 3. Ch 1 — SE tax framing in the cold open is internally inconsistent

**Location:** [ch-01-schedule-e-or-c.md:17](ch-01-schedule-e-or-c.md:17) — *"15.3% on the first portion of net earnings, plus another 2.9% above the Social Security wage base..."*

**Issue:** The phrase reads as **15.3% + 2.9%** above the wage base — i.e., 18.2% in the high band — which is wrong. The actual rule, correctly stated nine paragraphs later at [line 31](ch-01-schedule-e-or-c.md:31), is 15.3% (12.4% OASDI + 2.9% Medicare) up to the SS wage base, then **2.9% Medicare-only** above the base, plus the 0.9% Additional Medicare surtax on high earners. Because the loose framing appears in the Megan-loses-$50K cold open and is the line a CPA-skeptical reader will quote back, the imprecision is high-stakes — it inflates the headline math by ~3 percentage points in the high band.

**Recommended fix:** Rewrite line 17 to mirror line 31's framing. Suggested language: *"...self-employment tax — 15.3% on the first portion of net earnings up to the Social Security wage base, then 2.9% Medicare-only on earnings above it..."*

---

## 🟡 Worth fixing

### 🟡 4. Ch 7 — De minimis safe harbor mis-cited under §1.263(a)-3

**Location:** [ch-07-cost-segregation.md:137](ch-07-cost-segregation.md:137).

**Issue:** The de minimis safe harbor lives at **§1.263(a)-1(f)**, not §1.263(a)-3. Ch 5 cites it correctly; Ch 7 lumps de minimis under the wrong reg alongside routine maintenance and small taxpayer (which are correctly under §1.263(a)-3).

**Fix:** Correct the citation to §1.263(a)-1(f) for the de minimis reference.

---

### 🟡 5. Ch 7 — Depreciation recapture on 15-year land improvements is over-stated

**Location:** [ch-07-cost-segregation.md:139](ch-07-cost-segregation.md:139) — *"depreciation recapture at ordinary income rates on the personal property and 15-year property."*

**Issue:** For 5-year personal property (§1245), recapture is at full ordinary rates — correct. But 15-year land improvements are **§1250 property**, and individual taxpayers' §1250 depreciation recapture is "unrecaptured §1250 gain" capped at **25%**, not full ordinary. The chapter materially overstates the recapture cost on the land-improvement bucket. Worse outcome: a host abandons a defensible cost-seg play because of the inflated recapture estimate.

**Fix:** Bifurcate the recapture framing — ordinary-income recapture for §1245 personal property, unrecaptured §1250 gain (max 25%) for the 15-year land-improvement bucket.

---

### 🟡 6. Ch 3 + Glossary — "Computers as listed property" is post-TCJA stale

**Location:** [ch-03-recordkeeping-standard.md:23](ch-03-recordkeeping-standard.md:23) and [back-matter.md:180](back-matter.md:180).

**Issue:** TCJA (Pub. L. 115-97, §13202) **removed** computers and peripheral equipment from §280F listed-property treatment for property placed in service after Dec 31, 2017. Eight years later, this is no longer correct — listed property is now substantially limited to passenger autos and certain entertainment property.

**Fix:** Update both the Ch 3 inline reference and the Glossary entry to remove the computer reference.

---

### 🟡 7. Ch 11 — §6722/§6721 penalty range from older indexing

**Location:** [ch-11-professional-services-and-1099s.md:100](ch-11-professional-services-and-1099s.md:100) — *"$50–$310 range per form... intentional disregard penalties starting around $630 per form."* Mirrored in [ch-04-operating-expenses.md:39](ch-04-operating-expenses.md:39) at "$310."

**Issue:** Per Rev. Proc. 2023-34 and successors, the penalty schedule has indexed up. For information returns required to be filed in 2026, the high end is approximately **$340**, and intentional-disregard is approximately **$680**. The book's range is from at least two indexing cycles back.

**Fix:** Update or frame year-agnostically ("see the current Rev. Proc. for the year-of-filing penalty schedule").

---

### 🟡 8. Ch 8 — §168(k) "subsequent legislation restored 100%" is too vague for a 2026 reader

**Location:** [ch-08-section-179-and-bonus-depreciation.md:103](ch-08-section-179-and-bonus-depreciation.md:103)–[114](ch-08-section-179-and-bonus-depreciation.md:114).

**Issue:** The "subsequent legislation" is **OBBBA §70301**, which restored **100% bonus depreciation permanently** for property acquired and placed in service after **January 19, 2025**. For a host placing property in service in 2026 — the audience for this book — bonus is 100% by default. The current framing requires the reader to do the lookup and obscures what is now the headline answer.

**Fix:** Keep the year-agnostic hedge but explicitly name the post-OBBBA permanent-100% regime as the rate currently in effect, with the Jan 19, 2025 effective date for the placed-in-service test.

---

### 🟡 9. Ch 15 — Mis-cross-reference of §469(c)(7) to Chapter 1

**Location:** [ch-15-augusta-and-14-day-rule.md:55](ch-15-augusta-and-14-day-rule.md:55) — *"the §469(c)(7) STR-loophole framework from Chapter 1."*

**Issue:** Chapter 1 does **not** cite §469(c)(7). Ch 1's STR loophole hangs on **§1.469-1T(e)(3)(ii)(A)** (the 7-day rule) plus the §1.469-5T(a) material-participation tests. §469(c)(7) is the **real estate professional** exception — a different mechanism with a 750-hour test plus a more-than-half-of-personal-services test, which Ch 1 deliberately doesn't lean on.

**Fix:** Change to *"the 7-day rule framework from Chapter 1"* — or, if §469(c)(7) is genuinely on point here, scope the sentence to acknowledge it as a separate route the chapter is invoking.

---

### 🟡 10. Appendix A — §469(c)(7) one-line description repeats the same conflation

**Location:** [back-matter.md:17](back-matter.md:17) — *"Real estate professional exception — material participation test for non-passive treatment."*

**Issue:** The §469(c)(7) test is a **750-hour-and-more-than-half-of-services** test, not a "material participation" test. The Glossary entry on the same page ([line 202](back-matter.md:202)) gets the description correct.

**Fix:** Reconcile to the Glossary's framing. Appendix A is the page hosts hand to their CPAs — the contradiction with the Glossary on the same back-matter file is exactly what a reviewing CPA will circle.

---

### 🟡 11. Ch 1 — Average-period-of-customer-use computation method

**Location:** [ch-01-schedule-e-or-c.md:55](ch-01-schedule-e-or-c.md:55) — *"sum the nights actually rented across all reservations in the tax year. Divide by the count of reservations."*

**Issue:** This is the simple-average method. Treas. Reg. **§1.469-1T(e)(3)(iii)** actually contemplates a **weighted average** using rental periods. For three-to-four-night STR portfolios the methods produce equivalent answers, but in any portfolio mixing one-night and 14-night stays the weighted method matters and is the more defensible computation.

**Fix:** Either describe both methods or explicitly flag this as the simple-average proxy ("a simple-average proxy that produces the right answer for most STR portfolios; the regulation contemplates a weighted-average computation for mixed-duration portfolios").

---

### 🟡 12. Ch 1 — §199A understated for Schedule E rentals

**Location:** [ch-01-schedule-e-or-c.md:31](ch-01-schedule-e-or-c.md:31) — *"qualifies for the §199A QBI deduction in many cases, which Schedule E rentals often don't."*

**Issue:** Schedule E rentals that rise to a §162 trade or business — including most non-passive STRs under the 7-day rule with material participation — generally **do** qualify for §199A. **Rev. Proc. 2019-38** created a 250-hour rental-real-estate safe harbor for §199A. The current framing implies §199A is a Schedule C lever, when in practice Schedule E non-passive STRs frequently take §199A as well.

**Note:** OBBBA also made §199A **permanent** (it had been scheduled to sunset Dec 31, 2025 under TCJA). Worth a passing acknowledgment if Ch 1 is being updated.

**Fix:** Replace "which Schedule E rentals often don't" with "which Schedule E rentals also qualify for when they rise to a §162 trade or business — most non-passive STRs do." Add a Rev. Proc. 2019-38 reference where the 250-hour safe harbor would help.

---

### 🟡 13. Ch 8 — §179 availability for residential-rental personal property

**Location:** [ch-08-section-179-and-bonus-depreciation.md:43](ch-08-section-179-and-bonus-depreciation.md:43)–[55](ch-08-section-179-and-bonus-depreciation.md:55).

**Issue:** The chapter frames §179 availability for non-passive Schedule E STRs with confidence. This is **defensible but position-taking** — it depends on the rental rising to a §162 trade or business, which is a facts-and-circumstances determination. TCJA repealed the pre-2018 §179(d)(1)(B)(ii) "lodging" carve-out, so the framing that residential furniture qualifies for §179 on a non-passive STR is structurally correct, but the IRS examination position on §162 status for non-passive STRs is not always automatic.

**Fix:** Add a one-sentence hedge: "This is a position-taking call worth confirming with your CPA based on your specific hour log and operating profile — §179 availability assumes the rental rises to a §162 trade or business under the standard in Ch 2."

---

### 🟡 14. Ch 9 — 2026 mileage rate

**Location:** [ch-09-mileage-per-diem-lodging.md:41](ch-09-mileage-per-diem-lodging.md:41) — cites 67¢ (2024) and 70¢ (2025).

**Issue:** For a 2026-published book, the **2026 rate** is the rate the reader's current-year trips will use. The IRS announced the 2026 standard mileage rate in mid-December 2025; verify the figure is in print by publication. The year-agnostic hedge ("you must use the rate in effect for the year of the trip") softens the risk but doesn't eliminate it.

**Fix:** Add the 2026 rate to the cited series, or strengthen the year-agnostic framing.

---

### 🟡 15. Ch 10 — 1099-K threshold deserves a forward-looking note

**Location:** [ch-10-platform-fees-software-banking.md:23](ch-10-platform-fees-software-banking.md:23).

**Issue:** The chapter appropriately avoids citing a specific 1099-K threshold figure. But **OBBBA §70432 restored the pre-ARP $20,000 / 200-transactions threshold permanently** for 1099-K reporting. For most STR hosts on a single platform, this likely still triggers reporting; lower-volume hosts now fall below. A one-sentence note would help readers who got 1099-Ks at the $5,000 (2024) or $2,500 (2025) thresholds and won't get them in 2026.

**Fix:** Add a brief note that the threshold was restored to $20,000 and 200 transactions for 2025-and-forward under OBBBA.

---

### 🟡 16. Appendix A — Rev. Proc. 2022-14 reference is two cycles old

**Location:** [back-matter.md:62](back-matter.md:62).

**Issue:** Rev. Proc. 2022-14 has been superseded — Rev. Proc. 2023-24 and Rev. Proc. 2024-23 are the more recent comprehensive lists of automatic accounting-method changes. Ch 6's body text appropriately hedges with "and successors"; Appendix A does not.

**Fix:** Update to "Rev. Proc. 2024-23 (current as of publication) or successor."

---

## 🟢 Optional polish

### 🟢 17. Ch 7 — "15–30% reclassification range" framing

**Location:** [ch-07-cost-segregation.md:75](ch-07-cost-segregation.md:75).

**Issue:** The 15–30% range is described as the *"historic IRS-tolerated range."* This is a defensible practitioner rule of thumb but not an IRS-published threshold.

**Polish:** Tighten to "the typical engineering-study range" or "the practitioner-accepted range."

---

### 🟢 18. Ch 8 — Mid-quarter convention trigger phrasing

**Location:** [ch-08-section-179-and-bonus-depreciation.md:150](ch-08-section-179-and-bonus-depreciation.md:150) — *">40% of year's placements were in the last quarter."*

**Polish:** More precisely: when more than 40% of the **aggregate basis** of all property placed in service during the year is placed in service in the last three months. Minor.

---

### 🟢 19. Ch 12 — §121 home-sale exclusion not explicitly named

**Location:** [ch-12-home-office.md:166](ch-12-home-office.md:166)–[174](ch-12-home-office.md:174).

**Polish:** The §1250 unrecaptured-gain framing is correct, but **§121** (the $250K/$500K primary-residence exclusion) is the regulation that makes the recapture math actually bite — depreciation taken after May 6, 1997 is **not** sheltered by §121. Worth one sentence.

---

### 🟢 20. Glossary — Real Estate Professional definition

**Location:** [back-matter.md:202](back-matter.md:202).

**Polish:** Correct as far as it goes, but worth adding that REP status only deactivates the §469 per-se rental presumption — the taxpayer still has to materially participate in the specific rental activity (or aggregate under §469(c)(7)(A) election) to take losses against ordinary income. Otherwise readers conflate "REP" with "automatic non-passive."

---

### 🟢 21. Ch 9 — Lodging-method hedge

**Location:** [ch-09-mileage-per-diem-lodging.md:120](ch-09-mileage-per-diem-lodging.md:120)–[124](ch-09-mileage-per-diem-lodging.md:124).

**Polish:** Per Rev. Proc. 2019-48 §4.04, self-employed taxpayers cannot use a per-diem method for lodging — actual receipts required. The book gets this right at [line 101](ch-09-mileage-per-diem-lodging.md:101) but doesn't cross-reference back at line 120.

---

### 🟢 22. Ch 14 — Amenity vs. gift line for consumables

**Location:** [ch-14-marketing-guest-education.md:91](ch-14-marketing-guest-education.md:91)–[99](ch-14-marketing-guest-education.md:99).

**Polish:** The "leaves with the guest" vs. "stays in property" distinction is a clean teaching frame but the IRS hasn't blessed it cleanly — a stocked pantry the guest consumes is functionally similar to a per-guest gift basket. Most practitioners accept the framing the book uses; a one-line hedge would help.

---

### 🟢 23. Ch 13 — S-corp election break-even

**Location:** [ch-13-insurance-umbrella-entity.md:126](ch-13-insurance-umbrella-entity.md:126).

**Polish:** With OBBBA's permanent §199A, the S-corp-election break-even math has shifted — QBI-eligible Schedule C income now permanently retains its 20% deduction, and S-corp wages are NOT QBI-eligible. The break-even band probably moves up from the cited "$80,000–$100,000."

---

## Cross-chapter consistency

Of the brief's five named threads:

| Thread | Status |
|---|---|
| §280A subsections (Ch 12 ↔ Ch 15) | ✓ clean |
| §274(d) substantiation (Chs 3, 9, 11) | ✓ clean |
| §263(a) BAR test (Chs 5, 7, 8) | 🟡 minor — Ch 7 mis-cites the de minimis safe harbor (item #4); Ch 5 is correct |
| §179 availability gate (Ch 1 ↔ Ch 8) | ✓ clean |
| 7-day rule (Ch 1 ↔ Ch 9) | Ch 9 doesn't engage the 7-day rule; **Ch 15's §469(c)(7) cross-reference (item #9) does mis-attribute Ch 1's content** |

---

## Year-current items checklist (against the brief's list)

| Item | Status |
|---|---|
| Standard mileage rate (Ch 9) | 🟡 verify 2026 rate; 2024/2025 figures correct |
| §168(k) bonus rate framing (Chs 7, 8) | 🟡 add post-OBBBA permanent-100% reference |
| §179 cap (Ch 8) | 🔴 update to OBBBA $2.5M |
| §1.263(a)-1(f) de minimis (Ch 5) | ✓ $2,500 still current |
| §1.263(a)-3(h) small taxpayer (Ch 5) | ✓ $1M / $10K / 2% still current |
| §274(b) gift cap (Ch 14) | ✓ $25 still current |
| §195 first-year (Ch 13) | ✓ $5K / $50K phase-out still current |
| SE tax / SS wage base (Chs 1, 11) | ✓ rates correct; book wisely doesn't cite a specific wage-base figure |
| §6722/§6721 penalties (Ch 11) | 🟡 update range; old indexing |
| §6041 $600 threshold (Ch 11) | 🔴 OBBBA raised to $2,000 for 2026+ |

---

## Bottom-line print-readiness

The manuscript is well-structured, cites accurately on most regulations, and the voice is consistent. Welch v. Helvering, Cohan, Hospital Corp. of America, Soliman, the §280A subsection map, the §263(a)-3 BAR test, MACRS mid-month math, the seven §1.469-5T(a) tests, the cost-seg DIY framework, the W-9 discipline, the §280A(g) substantiation requirements — all clean.

The dominant risk to a 2026 ship is **OBBBA-driven**: four numbers and one threshold the book treats as stable have moved (§179 cap, 1099-NEC threshold, §168(k) permanent restoration, 1099-K threshold restoration, §199A permanence). A CPA reader who notices the §179 cap or the $600 1099-NEC threshold will assume the rest of the manuscript is similarly stale, even though the underlying regulatory architecture is intact.

**Print-readiness summary:**

1. Resolve the three 🔴 items (§179 cap, $600 1099 threshold, SE tax framing in Ch 1 cold open).
2. Run a single editorial pass on the thirteen 🟡 items, with special attention to items #5 (§1250 recapture framing), #8 (post-OBBBA bonus depreciation), #9–#10 (§469(c)(7) cross-reference and Appendix A description), and #12 (§199A for Schedule E).
3. Optional polish items can be batched or deferred.
4. Recommend a second human-CPA pass specifically on items **#5 (§1250 recapture)**, **#12 (§199A for Schedule E)**, and **#13 (§179 trade-or-business gate)** — those are the technical calls where the AI-assisted nature of this review matters most. They are positions readers will rely on; a credentialed reviewer should sign off before print.

The book passes the brief's stated bar — *"no statement that a competent CPA reading the book would call wrong"* — once the 🔴 items are resolved. The 🟡 items are below that bar but worth the editorial pass for a polished first edition.

---

*Memo prepared per `tax-pro-review-brief.md` framework. All file paths are relative to the manuscript directory. Tier-labels follow the brief's 🔴 / 🟡 / 🟢 convention.*
