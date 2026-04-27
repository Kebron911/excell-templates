# Chapter 6 — Building Depreciation

*MACRS 27.5 done right.*

---

Henry bought a beach cottage on the South Carolina coast in March of 2022. He hired a tax preparer who had filed his W-2 returns for years, handed over the closing statement, and didn't think much else about it. The 2022 return came back. He signed and filed.

Two years later, switching to a new CPA, Henry asked the obvious question.

> "How much depreciation did we take on the beach place?"
> "None."
> "...None?"
> "Your prior preparer didn't put it on the depreciation schedule. There's nothing here."

Henry's missed depreciation across 2022 and 2023 was approximately **$16,300.** He had not, technically, lost the deduction. He had lost his ability to take it the easy way.

The IRS, under §1.1016-3, treats unclaimed depreciation as if it had been taken — your basis in the property still goes down by the amount you *should have* claimed each year, whether you claimed it or not. If Henry sold the property without recovering the missed depreciation, he would owe depreciation recapture tax on phantom deductions he never enjoyed.

The path forward was the same path Amanda took for her cost-seg play in Chapter 7: **Form 3115**. A change-in-method-of-accounting filing, with a §481(a) catch-up adjustment, recovers the missed depreciation in the current year. No amended returns. One form. One specialist task.

This chapter is about the deduction Henry's preparer missed and how to make sure your preparer doesn't miss yours.

---

## What MACRS 27.5 actually is

Under §168(c) and §168(e), residential rental property is depreciated over **27.5 years on a straight-line basis** using the **mid-month convention**. The mechanics are mechanical:

- **27.5-year recovery period** — the building's depreciable basis is divided across 27.5 years.
- **Straight-line method** — equal amounts each full year, with adjustments for partial years at the start and end.
- **Mid-month convention** — for placed-in-service and disposition dates, the property is treated as placed in service or disposed of at the midpoint of the month, regardless of the actual day. This affects year-1 and final-year depreciation only.

The annual full-year depreciation is therefore:

```
Annual depreciation  =  Depreciable basis  ÷  27.5
```

For a property with a $250,000 depreciable basis, that's roughly **$9,091 per year**, every year, from year 2 through year 27, with partial-year math in years 1 and 28.

This is **deduction #17** of the 47 — the building line, and on most properties the single largest annual deduction the host will ever take.

---

## Depreciable basis — the calculation that decides everything

The annual deduction is mechanical. The hard part is the basis.

**Depreciable basis** is the property's purchase price plus capitalized acquisition costs minus the value of the land. Land is non-depreciable under §168(c). Building is.

The components of depreciable basis:

1. **Purchase price** of the property.
2. **Plus capitalized acquisition costs** — title insurance, legal fees for the closing, recording fees, transfer taxes, surveys. (Costs that are properly current expenses, like prorated property taxes and prepaid HOA fees, do not capitalize.)
3. **Minus the value of the land.**

The land/improvement split is the most consequential decision in the entire depreciation calculation. A $400,000 property with a 15% land allocation depreciates a basis of $340,000, generating about $12,364 of annual depreciation. The same property with a 30% land allocation depreciates $280,000, generating about $10,182 — a difference of $2,182 per year, every year, for 27.5 years. **Total lifetime delta: $60,005** on the same property.

The defensible methods for allocating land vs. improvements:

1. **County tax assessor's ratio.** The cleanest, most-tolerated method. Pull the property's most recent tax assessment, find the assessor's split between land and improvements, and apply the same percentage to the purchase price. This is what the workbook in Chapter 9 of this book uses.
2. **Independent appraisal.** Higher cost, more defensible — appropriate for high-basis properties or unusual situations.
3. **Insurance replacement-cost ratio.** Acceptable in some markets, weaker than #1 or #2.

What is *not* defensible: arbitrary percentages, prior-owner conventions, or a flat 20% land allocation applied without reference to the actual property. The IRS will examine basis allocation on audit and accepts the assessor's ratio almost universally; it accepts arbitrary allocations almost never.

---

## The placed-in-service date

Depreciation begins on the **placed-in-service date** — the date the property is "ready and available" for its intended use. For an STR, that means the date the property is listed and bookable, not the date of purchase.

Three scenarios commonly trip hosts:

**Scenario 1 — Buy and immediately rent.** Closing date and placed-in-service date are the same. Mid-month convention applies. If the property closes on March 18, the placed-in-service month is March, and the property is treated as placed in service on March 15 (the mid-month).

**Scenario 2 — Buy, renovate, then rent.** The placed-in-service date is the date the renovation completes and the property is listed. Renovation costs incurred before that date capitalize into basis. Renovation costs after that date are repairs or improvements per Chapter 5. The line matters: pre-PIS costs go onto the depreciation schedule from day one; post-PIS costs are evaluated separately.

**Scenario 3 — Buy as personal use, convert to rental.** The placed-in-service date is the conversion date — when the property is listed and bookable. The basis used for depreciation is the *lower of* (a) the original cost basis, or (b) the fair market value on the conversion date. This is §1.168(i)-4(b), and it occasionally penalizes hosts who buy a property at a high-water price, hold it personally, and convert when the market has dropped.

The placed-in-service month determines the year-1 partial-year deduction:

| PIS month | Year-1 percentage of full-year depreciation |
|---|---|
| January | 95.83% |
| February | 87.50% |
| March | 79.17% |
| April | 70.83% |
| May | 62.50% |
| June | 54.17% |
| July | 45.83% |
| August | 37.50% |
| September | 29.17% |
| October | 20.83% |
| November | 12.50% |
| December | 4.17% |

Henry's beach cottage placed in service in March 2022 should have generated $250,100 ÷ 27.5 × 0.7917 ≈ $7,201 in year-1 depreciation. The fact that his preparer missed it doesn't change the math. The math is always the math.

---

## Land improvements — deduction #18

Land itself is non-depreciable. *Land improvements*, however, are depreciable on a 15-year MACRS schedule under §168(c). Land improvements include:

- Driveways and parking pads
- Fences
- Retaining walls
- Sidewalks and paths
- Exterior lighting on poles or columns (not attached to the building)
- Planted landscaping (shrubs, trees, sod) installed during ownership
- Decks attached on grade (not structurally tied to the building)
- Fire pits, outdoor fireplaces, BBQ pits installed in the ground
- Inground pools and surrounding hardscape

These are 15-year property — bonus depreciation eligible (Chapter 8) — and the cost-segregation play in Chapter 7 leans heavily on identifying them.

This is **deduction #18**: the land-improvement portion of the depreciable basis, broken out separately and depreciated on its own faster schedule.

A property with $40,000 of identifiable land improvements depreciated on a 15-year line generates $2,667 a year (vs. $1,455 if mistakenly bundled into the 27.5-year building basis). Over 15 years, that's an additional $18,000 of timing-front-loaded deduction. With bonus depreciation in the year of placed-in-service, the entire $40,000 may be deductible in year one — but the framework for that lives in Chapters 7 and 8. Chapter 6's job is to make sure the land-improvement basis is *separated from* the building basis at acquisition, not lumped together as a single 27.5-year asset.

The lump-together mistake is endemic. It is what cost-segregation reverses. Most general-practice CPAs make the lump-together mistake on STR acquisitions because long-term rental conventions don't make a habit of separating.

---

## Missed depreciation — Henry's path forward

When depreciation is missed for a year or more, the host has two paths:

**Path A — Amend the prior return.** Single-year omissions are sometimes correctable by amended return on Form 1040-X — but only when the issue is a math/posting error (the asset was simply left off the schedule) rather than an accounting-method choice. The line is fact-specific: if the prior preparer took depreciation but used the wrong method or recovery period, that's a method change requiring Form 3115 even for one year. Henry's situation — preparer left the asset off entirely — is closer to a math error, so Path A is on the table if the statute of limitations is still open. When in doubt, Form 3115 (Path B) is the safer route; it works for both math errors and method errors.

**Path B — Form 3115 §481(a) adjustment.** For multi-year errors, method errors, or one-year errors past the three-year amendment window, the cleaner path is a change-in-method-of-accounting filing on Form 3115. Under Rev. Proc. 2024-23 (the current automatic-consent list as of publication, which supersedes Rev. Proc. 2022-14 — confirm against the latest successor), missed depreciation qualifies for *automatic consent* — meaning the IRS approves the change by default, without discretionary review, as long as the procedural requirements are met. The §481(a) catch-up adjustment captures all missed depreciation in the current year as a single deduction.

For Henry's $16,300 across two years, Path B is the move:

- File Form 3115 with the current-year return
- Take the $16,300 catch-up as a §481(a) adjustment, deductible in full in the current year
- Going forward, depreciate the property correctly

The form is fussy. Pay a CPA $400–$800 to file it. The recovery dwarfs the cost.

---

## The "depreciation isn't optional" rule

Under §1.1016-3, a taxpayer's basis in property is reduced by depreciation **allowed or allowable** — meaning the basis goes down whether or not the deduction was claimed. This rule is what makes missed depreciation a genuine loss, not a recoverable forgetful moment.

If Henry had sold his beach cottage two years into ownership without filing Form 3115, his amount-realized would have been measured against an adjusted basis reduced by $15,800 of depreciation he never deducted. The phantom deduction would generate phantom recapture tax. Cash out of pocket. No deduction in. This is the worst outcome.

The rule has one practical consequence: **always claim depreciation in the year it's allowable.** If you discover it was missed, file Form 3115 the following year. Do not let two years become five.

---

## Common mistakes

**Confusing closing date with placed-in-service date.** The closing date is when ownership transfers. The placed-in-service date is when the property is ready and available for rental use. For most STRs they're close; for renovated acquisitions they can be months apart. Track both.

**Allocating land arbitrarily.** "Twenty percent" or "thirty percent" without reference to the assessor's ratio is indefensible. Use the ratio. Document it.

**Bundling land improvements into the 27.5-year line.** Driveway, deck-on-grade, landscaping, exterior lighting, fences — all 15-year property. Many hosts treat them as part of "the building" and depreciate them over 27.5 years by default. This is a Chapter 7 cost-seg moment waiting to happen.

**Skipping bonus depreciation eligibility.** Land improvements are bonus-eligible under §168(k) at the rate in effect for the placed-in-service year. Most hosts who correctly classify land improvements still forget to apply bonus. Chapter 8 covers this.

**Forgetting capitalized acquisition costs.** Title insurance, legal fees, recording fees, transfer taxes — all capitalize into basis. Hosts who use only the contract purchase price as basis under-depreciate by 1–3% of property value over the life of the asset. Pull the closing statement; capitalize what should be capitalized.

---

> ### *Capture this in the Schedule E Workbook.*
>
> The Schedule E Tax Prep Workbook (TAX-004) includes a depreciation tab that pulls from the closing statement, applies the assessor's land/improvement ratio, separates 15-year land improvements from the 27.5-year building, and computes the year-1 partial-year depreciation against the placed-in-service date automatically. If your prior preparer left depreciation off the schedule, the workbook is the start of the Form 3115 catch-up calculation.
>
> `thestrledger.com/cap/06`

---

*This chapter is general information, not tax advice. Depreciation calculations depend on specific basis allocations, placed-in-service dates, and current Treasury regulations. Confirm computations with a qualified tax professional before filing.*
