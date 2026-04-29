# Module 3 — The 47 Deductions in Practice · Video Scripts

**Status:** Final draft — 2026-04-29
**Lessons:** 12 (3.1 through 3.12)
**Total runtime:** ~2h 15m
**Production priority:** Record fifth — workshop format, lighter script density per lesson

> **Module 3 is reference, not sequential.** Tell students up front: watch the lessons in the order they encounter the deductions in their own portfolios. The structure below honors that — each lesson stands alone.

---

## Lesson 3.1 — The recurring ten

**Length:** 14 min

```
[OPEN — title card: "3.1 — The Recurring Ten"]

[VO]

Cleaning. Utilities. Supplies. Lawn. Pest. Pool. Security. The boring
stuff is the bulk.

Hosts spend disproportionate energy worrying about the exotic
deductions — cost seg, the STR loophole, Augusta — and undercount
the recurring ten. The recurring ten are where most of your
deduction dollars actually live, year over year. They are also the
deductions most commonly under-claimed because the receipts get lost.

[FRAME — 30s]

In this lesson:

One. The ten recurring categories that appear on almost every STR's
Schedule E.

Two. Which Schedule E line each one feeds.

Three. The traps — completeness, gross-vs-net reporting, allocation.

[TEACH — 5 min]

The ten:

  1. Cleaner pay (line 7)
  2. Cleaning supplies (line 17)
  3. Property utilities — electric, gas, water (line 17)
  4. Internet and cable (line 17)
  5. Trash service (line 17)
  6. Lawn / snow / pest (line 17)
  7. Pool / hot tub service (line 17)
  8. Security monitoring (line 17)
  9. HOA dues (line 17)
  10. Property management fees (line 11)

Plus the three semi-recurring siblings most hosts include in the
"recurring":

  11. Mortgage interest (line 12)
  12. Property tax (line 16)
  13. Insurance (line 9)

The traps.

Trap one. Completeness. Hosts forget that internet / cable is
deductible. Or trash. Or HOA dues. The recurring categories slip
through because they're auto-charged to a card and the host never
sees a paper bill.

Fix: at the start of every year, audit the prior year's bank
statement for every recurring auto-charge. If a vendor charges you
monthly and you've forgotten the deduction, add it to the rule
library so next year's CSV import auto-categorizes it.

Trap two. Gross-vs-net. Cleaning fees collected from guests are
gross income (line 3). Payments to the cleaner are line 7
deductions. Hosts who net these report less income AND less
expense — the math works out the same, but the numbers don't match
the 1099-K from Airbnb.

We dedicate Lesson 3.2 to the gross/net trap.

Trap three. Allocation. If a property's utility bill is on a meter
shared with personal space (e.g., main house plus rental ADU on the
same property), the deduction needs allocation. Same for an
umbrella insurance policy covering both rental and personal.

[DEMONSTRATE — 7 min]

[Open TAX-002 for a sample property.]

Walk through each line. For each one, show the rule library entry
that auto-categorizes it.

  Cleaner pay → line 7 → rule fires on cleaner's name
  Cleaning supplies → line 17 → rule fires on Costco/Walmart/grocery
   (with mixed-use flag)
  Electric → line 17 → rule fires on local utility name
  Gas → line 17 → rule fires on local gas company
  Water → line 17 → rule fires on county water utility
  Internet → line 17 → rule fires on Xfinity / Spectrum / etc.
  Trash → line 17 → rule fires on local hauler
  Lawn → line 17 → rule fires on TruGreen / local landscaper
  Pest → line 17 → rule fires on Terminix / Orkin / local
  Pool → line 17 → rule fires on Leslie's / local pool service
  Security monitoring → line 17 → rule fires on monitoring company
  HOA → line 17 → rule fires on HOA management company
  Property management → line 11 → rule fires on PM company name

Walk through pulling each from a sample CSV. The rule library
auto-categorizes 8 of 13 with no thought; the other 5 need a one-
time customization to your specific local vendors.

[ASSIGNMENT — 30s]

Confirm each line on last year's Schedule E is funded by a vendor
in your rule library. If any line is missing — utility, trash,
internet — you may have under-deducted. Pull the prior-year bank
statement and audit.

If any vendor isn't in the rule library, add it now. Future
quarters auto-categorize.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.2 — Cleaning fees: the gross/net trap

**Length:** 10 min

```
[OPEN — title card: "3.2 — Cleaning Fees: The Gross/Net Trap"]

[VO]

Hosts who net cleaning fees against income leave the cleaner
deduction stranded.

This is the single most common bookkeeping error in STR Schedule E
returns. The math works out the same — but the audit trail breaks,
and the IRS computer-match flags the return because gross income on
line 3 doesn't tie to the 1099-K from Airbnb.

[FRAME — 30s]

In this lesson:

One. What "gross" means and why it matters.

Two. The mechanically correct reporting structure.

Three. The reconciliation that makes it auditable.

[TEACH — 5 min]

What gross means.

When a guest pays Airbnb $1,200 for a stay — $900 nightly rate plus
$200 cleaning fee plus $100 host service fee — the $1,200 is your
gross rental income. Airbnb deducts its host service fee and the
cleaning fee passes through to the cleaner; you get a net deposit.

For tax purposes:

  Gross income (line 3): $1,200 — the full guest payment
  Less: Airbnb host service fee (line 19): $100
  Less: Cleaning expense paid to cleaner (line 7): $200
  Net to your bottom line: $900

Same math, different reporting structure. The $900 is your true
margin, but it doesn't appear directly on the return — it's the
result of subtracting the line-19 and line-7 deductions from the
line-3 income.

The trap.

Hosts who report "net" income on line 3 — say, $900 in this example
— inadvertently:

  Skip the line-19 platform fee deduction
  Skip the line-7 cleaning expense deduction
  Create a mismatch with the 1099-K Airbnb files (which shows
   $1,200 gross)

The IRS computer-match cross-references the 1099-K to the return.
A mismatch flags the return for review. Even if the math nets out,
the flag is unwelcome.

The fix.

Report gross. Deduct the platform fee on line 19. Deduct the
cleaning expense on line 7. The math is the same; the audit trail
is clean.

[DEMONSTRATE — 4 min]

[Open the Airbnb host statement for a sample quarter.]

The host statement shows three columns:

  Gross earnings: $32,400
  Host service fees: $972
  Cleaning fees collected: $5,600
  Net payout: $25,828

Pull the bank statement. The deposits sum to $25,828.

Reconciliation in TAX-002:

  Line 3 — Rents received: $32,400
  Line 19 — Other (Platform Fees): $972
  Line 7 — Cleaning and maintenance: $5,600 (the cleaning fee
                                                portion, plus your
                                                actual payments to
                                                the cleaner if
                                                separate)

If the cleaning fees collected from guests pass through 100% to
the cleaner, the line-7 figure is $5,600. If you keep some margin
on cleaning fees (collect $5,600 from guests, pay $4,200 to
cleaner), then:

  Line 7 — Cleaning and maintenance: $4,200 (actual cleaner pay)
  The $1,400 difference flows through to your gross via line 3 —
   it's already in the $32,400.

Either way, the gross is $32,400 and the deductions are the actual
amounts paid out.

[ASSIGNMENT — 30s]

Pull last quarter's Airbnb host statement and your bank statement
for the same period. Reconcile gross-fees-net. If your prior-year
return netted instead of grossed, flag for amendment if material.

The reconciliation tab in TAX-002 walks through the math
quarter-by-quarter.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.3 — Repairs vs. improvements

**Length:** 14 min

```
[OPEN — title card: "3.3 — Repairs vs. Improvements"]

[VO]

Betterment, Adaptation, Restoration. The BAR test, three letters,
one decision.

The line between repair (current expense, full deduction this year)
and improvement (capitalize and depreciate) is the most common
audit issue on STR Schedule E returns. Get it wrong by capitalizing
too aggressively, you under-deduct. Get it wrong by expensing too
aggressively, you over-deduct and the examiner reverses you.

The BAR test, applied honestly, gets you the right answer 95% of
the time.

[FRAME — 30s]

In this lesson:

One. The BAR test from §1.263(a)-3.

Two. Three real receipts. Three verdicts.

Three. The de-minimis safe harbor and routine-maintenance safe
harbor.

[TEACH — 5 min]

The BAR test.

§1.263(a)-3 requires capitalization if an expenditure results in:

  Betterment — physical enlargement, materially-improved capacity,
   materially-improved quality, materially-increased productivity
  Adaptation — adapts the property to a new or different use
  Restoration — replaces a major component or substantial structural
   part, restores after deterioration to like-new, rebuilds after
   end of class life, replaces an item that was a previous
   capitalized improvement

Pass any of the three prongs and the expenditure capitalizes —
typically 27.5-year depreciation for residential rental property.

Fail all three prongs and the expenditure is a current-year repair
deduction on Schedule E line 14.

The safe harbors.

§1.263(a)-1(f) — De-minimis safe harbor. Elect on the timely-filed
return. Once elected, expense any item under $2,500 per invoice
($5,000 with applicable financial statement) regardless of BAR
test outcome. The safe harbor doesn't override BAR; it short-
circuits the analysis for small items.

§1.263(a)-3(i) — Routine maintenance safe harbor. Activities the
taxpayer reasonably expects to perform more than once during the
property's class life are current expenses. Painting. HVAC service.
Gutter cleaning. Pressure washing.

The two safe harbors handle most of the small-dollar volume. The
BAR test is the analysis you run when an item is large enough that
neither safe harbor applies.

[DEMONSTRATE — 7 min]

Three receipts. Three verdicts.

Receipt one. $340 paint and supplies for Cabin A bedroom walls.

Verdict: routine maintenance safe harbor. §1.263(a)-3(i). Current
expense, line 14.

Reasoning: Repainting bedrooms is an activity the host reasonably
expects to perform more than once during the property's 27.5-year
class life. The safe harbor cleanly covers it. No BAR analysis
needed.

Receipt two. $1,140 dishwasher replacement after the old unit
failed.

Verdict: current expense, line 14.

Reasoning: Like-kind replacement of a failed appliance. BAR test:
not a betterment (no improvement in capacity or quality), not an
adaptation (no change in use), not a restoration (replacement of
a single appliance is not the replacement of a major component or
substantial structural part). Backup: de-minimis safe harbor under
$2,500.

Receipt three. $4,800 deck rebuild — same dimensions, same layout,
pressure-treated lumber instead of cedar.

Verdict: capitalize. Line 18 depreciation.

Reasoning: Full deck rebuild is the replacement of a major
component under §1.263(a)-3(k)(1)(vi). Restoration prong of the
BAR test applies. Capitalize over 27.5 years (or, with cost-seg,
potentially as a 15-year land improvement).

The asymmetric outcomes.

Receipt one and two together: $1,480 of current-year deduction.
At a 32% marginal rate: $474 in year-one tax savings.

Receipt three alone: capitalized at $4,800 over 27.5 years yields
year-one depreciation of about $174. Cost seg into 15-year
classification yields year-one depreciation of about $320 (or
substantially more with §168(k) bonus on the 15-year asset).

The dollar difference in year one between expensing and
capitalizing is meaningful. The dollar difference in year ten is
zero — total deduction is the same either way over the property's
life.

[ASSIGNMENT — 30s]

Audit last year's Schedule E line 14. Identify any single item over
$1,000. For each, write a one-sentence BAR-test note explaining why
you treated it as a repair.

If you can't write the BAR-test note, the item may have been
mis-categorized. Either move it to the depreciation schedule
(amend if material) or build the BAR-test substantiation now for
the next examination.

The BAR-test note template ships with the Audit Dossier Template
in folder 04.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.4 — Building depreciation

**Length:** 12 min

```
[OPEN — title card: "3.4 — Building Depreciation"]

[VO]

Twenty-seven and a half years. Land is not depreciable. Closing
costs are.

Building depreciation is the deduction every STR host claims and
about half claim correctly. The errors are predictable: wrong
basis, wrong start date, wrong land allocation, missing closing
costs.

This lesson walks through MACRS 27.5 the right way.

[FRAME — 30s]

In this lesson:

One. The depreciable basis — what to include, what to exclude.

Two. Land allocation — how to defend the split.

Three. Placement-in-service date.

Four. The depreciation schedule entry, end-to-end.

[TEACH — 5 min]

Depreciable basis.

Depreciable basis is the property's purchase price plus capitalized
acquisition costs minus the land allocation.

What's in:

  Purchase price
  Closing costs that benefit the property over time — title
   insurance, recording fees, transfer taxes, attorney fees for
   closing
  Capital improvements made before placing the property in service
  Real estate commissions paid

What's not in:

  Pre-paid mortgage interest, prepaid property tax, prepaid
   insurance — these go on the operating side
  Loan origination fees and points — separately amortizable
  Personal-use period before conversion to rental — adjustments
   apply

Land allocation.

Land is not depreciable. The IRS requires the host to allocate the
purchase price between land and building.

Three defensible methods:

Method one. County tax assessor's allocation. The county property-
tax statement typically breaks the assessed value into "land" and
"improvements." Apply the same ratio to your purchase price.

Method two. Independent appraisal. Order an appraisal that
explicitly allocates between land and improvements. More expensive
but more defensible if the county allocation looks unrealistic.

Method three. Insurance replacement-cost method. The insurance
policy's dwelling-coverage amount approximates the building's
replacement cost. Subtract from purchase price to get land. Less
common but accepted in some circles.

Pick one method, document the source, apply consistently across
properties in your portfolio.

Placement-in-service date.

Depreciation begins on the date the property is placed in service —
i.e., available for rental, not necessarily when first rented. A
property purchased October 1, listed on Airbnb October 14, first
guest November 5: the placement-in-service date is October 14
(when listed and available).

Mid-month convention applies to residential rental property under
MACRS. Year-one depreciation is pro-rated based on the
placement-in-service month.

[DEMONSTRATE — 6 min]

[Open TAX-004's depreciation tab.]

Sample property: $640,000 purchase price, October 14, 2025
acquisition. County tax statement shows assessed values of
$120,000 land and $260,000 improvements — 31.6% land allocation.
Closing costs that benefit the property: $4,200.

Step one. Compute depreciable basis.

  Purchase price:                   $640,000
  Capitalized closing costs:           4,200
                                    ────────
  Total capitalized cost:           $644,200
  Less: land (31.6%):                203,567
                                    ────────
  Depreciable basis:                $440,633

Step two. Enter into TAX-004's depreciation tab.

  Property: Cabin A
  Placement-in-service date: 2025-10-14
  Depreciable basis: $440,633
  Class: 27.5-year residential rental
  Method: MACRS straight-line
  Convention: mid-month

Step three. The workbook auto-computes year-one depreciation.

Year-one depreciation under MACRS mid-month convention for property
placed in service in October: 0.682% of basis (the table value for
month 10). $440,633 × 0.682% = $3,005 year-one depreciation.

Year-two depreciation: 3.636% of basis. $440,633 × 3.636% = $16,025.

Step four. The depreciation roll-up flows to TAX-004's Schedule E
roll-up tab. Line 18 — depreciation expense.

[ASSIGNMENT — 30s]

Pull your closing statement. Pull the most recent property tax
statement showing the assessor's land/improvement breakdown. Enter
the property into TAX-004's depreciation tab.

If the closing statement is missing — and you've owned the property
for several years — a CPA can help you reconstruct depreciable
basis from prior returns and property records.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.5 — §179 + §168(k) bonus

**Length:** 14 min

```
[OPEN — title card: "3.5 — §179 + §168(k) Bonus"]

[VO]

Two ways to expense capital. Different rules. Different outcomes.

§179 and §168(k) bonus depreciation sound similar to first-time
hosts. They both accelerate deductions on capital purchases. The
mechanics differ, the limits differ, and the order of operations
matters.

[FRAME — 30s]

In this lesson:

One. What §179 does and its limits.

Two. What §168(k) bonus does and its phase-down.

Three. The decision tree — when to use which.

Four. The order of operations when both apply.

[TEACH — 6 min]

§179.

§179 of the Internal Revenue Code allows the taxpayer to elect to
expense (rather than capitalize) the cost of qualifying business
property in the year placed in service.

Limits:

  Annual cap: well above most STR purchases (verify current
   year's cap)
  Phase-out: begins at $X of total qualifying purchases (verify)
  Income limitation: §179 cannot create or increase a net loss
   from the activity. If your STR income is positive, you have
   §179 capacity. If the STR is generating a loss, §179 is
   suspended for that year.

Qualifying property:

  Tangible personal property used in business >50%
  Off-the-shelf computer software
  Qualified improvement property (post-2017 PATH Act extensions)
  HVAC, fire systems, alarm systems, and roofs on nonresidential
   property

For STR with average rental period ≤ 7 days — classified as
nonresidential under §168(e) — the post-2017 §179 expansions on
HVAC and roofs apply.

§168(k) bonus depreciation.

§168(k) allows accelerated depreciation on property with a recovery
period of 20 years or less. Bonus depreciation is automatic on
qualifying property unless the taxpayer elects out.

Mechanics:

  Bonus rate: phase-down by year (verify current rate)
  No annual cap
  CAN create or increase a net loss
  Eligible: 5-year, 7-year, 15-year property classes
  Cost-segregated reclassifications are eligible

The decision tree.

When both §179 and §168(k) are available on the same asset:

  Order of operations: §179 first (within annual cap and income
   limit), §168(k) bonus on remaining basis, standard MACRS on
   what's left.

  When §179 is income-limited, default to §168(k) bonus.

  When §179 has capacity AND the taxpayer wants to defer some
   depreciation to future years, the taxpayer can elect §179 on
   only a portion and let the rest depreciate over class life.
   Rare but available.

[DEMONSTRATE — 6 min]

Worked example one. $1,800 riding mower used at three cabins.

  Class: 5-year personal property
  §179 eligible: yes
  §168(k) bonus eligible: yes

Decision: §179 election on the full $1,800. Allocate use across
three cabins (33% each). Form 4562 reflects §179 election.

Worked example two. $112,000 of cost-segregated reclassifications
on a $640,000 cabin acquisition.

  Class: mix of 5-year, 7-year, 15-year
  §179 eligible: yes for some assets, no for others (depends on
   asset specifics)
  §168(k) bonus eligible: all 5/7/15-year classes

Decision: §168(k) bonus on the full $112,000. §179 not used because
bonus's lack-of-cap-and-no-income-limit makes it cleaner for
this volume.

At the current bonus rate, year-one acceleration is approximately
$67,200 (60% × $112,000 — verify current rate).

Worked example three. $9,400 HVAC unit replacement on Cabin C
(STR with 4-night average rental period — classified as
nonresidential).

  Class: nonresidential property — qualifies for §179 under
   post-2017 rules
  §168(k) bonus eligible: depends on classification (verify)

Decision: §179 election. Year-one expense of $9,400.

If the property were classified as residential (average rental
period over 7 days, traditional landlord pattern), HVAC would
default to 27.5-year depreciation — year-one of about $170. The
classification difference matters.

[ASSIGNMENT — 30s]

Identify your last large capital purchase. Run the decision tree:
§179, §168(k), or standard MACRS?

If you didn't elect either §179 or §168(k) on a previous return and
the asset would have qualified, talk to your CPA. Form 3115 (change
in accounting method) can sometimes recover the missed acceleration
without amending — but the analysis is CPA territory.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.6 — Mileage, per-diem, lodging

**Length:** 12 min

```
[OPEN — title card: "3.6 — Mileage, Per-Diem, Lodging"]

[VO]

§274(d) is strict. Strict is also workable.

Travel-related deductions are where the IRS is most likely to ask
questions on examination, and where hosts are most likely to lose
deductions on substantiation grounds. The rule under §274(d) demands
amount, time, place, and business purpose for every entry. No
exceptions for small amounts.

The fix is contemporaneous logging. The course built that habit in
Module 2; this lesson layers in per-diem and lodging.

[FRAME — 30s]

In this lesson:

One. The §274(d) substantiation rule, applied across categories.

Two. Standard mileage versus actual vehicle expense.

Three. Per-diem for meals (and when it beats receipts).

Four. Lodging during multi-day repair trips.

[TEACH — 5 min]

§274(d).

Strict substantiation under §274(d) requires for each entry:

  Amount
  Time (date)
  Place (location)
  Business purpose

For every mile driven, every meal eaten on overnight business
travel, every hotel night during a repair trip, every gift to a
client. No exceptions, no de-minimis threshold, no "we both know
it was business."

Mileage. Standard versus actual.

Standard mileage method. Multiply business miles by the IRS
standard rate (set annually by Revenue Procedure). Simple, low
substantiation overhead beyond the §274(d) log.

Actual method. Track all vehicle expenses — gas, maintenance,
depreciation, insurance, registration. Multiply total expenses by
the business-use percentage. More substantiation; sometimes more
deduction.

The choice between standard and actual is per-vehicle and the year
the vehicle is placed in service. Switching between methods has
consequences; once you choose actual on a vehicle, switching back
to standard is restricted.

For most STR hosts: standard is cleaner. Actual makes sense for
hosts driving high-cost vehicles with high business-use
percentages.

Per-diem.

Federal CONUS per-diem rates (set annually by GSA) provide a
substitute for actual receipts on overnight business travel. Two
rates: lodging plus M&IE (meals and incidentals).

The advantage: per-diem requires no receipts. Just the §274(d)
log entry. For hosts taking multi-day repair trips, per-diem is
substantially less paperwork than tracking every meal receipt.

The disadvantage: per-diem's M&IE rate is generally lower than
actual restaurant spend. Hosts who eat well on travel may deduct
less under per-diem.

§274(n) imposes a 50% limit on meals regardless of method —
applies to both per-diem M&IE and actual receipts.

Lodging.

Lodging on multi-day business trips is fully deductible (no 50%
limit; that's meals only). Substantiation: §274(d) elements plus
the hotel folio.

For hosts staying at the rental property itself during repair
trips, the trip can be carved out from §280A(d)(2)'s personal-use
days under the §280A(d)(2)(C) repair-day carve-out — see Lesson
4.5.

[DEMONSTRATE — 6 min]

[Open TAX-001 mileage log, TAX-007 per-diem tracker, and the
Audit Dossier Template's overflow lodging tab.]

Sample three-day repair trip:

Day one. Drive from home to Cabin C (180 miles round-trip
allocated to outbound only — 90 miles). Hotel night.

Day two. Coordinate plumber, supervise repair, drive 25 miles
between Cabin C and supply-house twice — 100 miles total. Lunch
out, dinner with contractor.

Day three. Final inspection, drive home — 90 miles.

Mileage log entries:

  2026-05-14, Cabin C repair coordination outbound, start
   142840, end 142930, 90 miles
  2026-05-15, Cabin C plumbing supply runs, start 142930, end
   143030, 100 miles
  2026-05-16, Cabin C return home, start 143030, end 143120, 90
   miles

Per-diem election. Federal CONUS rate for the locality. Look it
up at gsa.gov/perdiem or via TAX-007's lookup tab. Sample: $74
M&IE for a non-high-cost area, $107 lodging.

  Per-diem M&IE × 3 days = $222
  Per-diem M&IE × 50% (under §274(n)) = $111 deductible

Lodging. Actual hotel folio shows $128 + tax × 2 nights = $271
total.

  Lodging deduction: $271 actual (or $214 if using federal
   per-diem; in this case actual is higher, use actual)

Schedule E entries:

  Line 6 — Auto and travel: 280 miles × $0.655 standard rate =
   $183.40
  Line 19 — Other (Per-Diem M&IE 50%): $111
  Line 19 — Other (Lodging — repair trip): $271

[ASSIGNMENT — 30s]

Pick one §274(d) gap from your prior year and close it. Common
gaps: a repair trip with no meal log, a property visit with no
mileage log, a lodging stay with no business-purpose note.

If reconstruction is feasible — calendar entries, vendor invoices,
hotel folios — reconstruct with corroborating evidence. If not,
drop the deduction.

Forward, log contemporaneously. The §274(d) burden eases
substantially when the log is current.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.7 — Platform, software, banking

**Length:** 10 min

```
[OPEN — title card: "3.7 — Platform, Software, Banking"]

[VO]

Stripe. Hospitable. PriceLabs. Your bank's $15-a-month maintenance
fee. The easy ten.

These deductions are uncomplicated, recurring, and almost always
under-reported because they auto-charge to a card and the host
forgets to look. The fix is recognizing them in the rule library
once.

[FRAME — 30s]

In this lesson:

One. The platform-fee category — Airbnb, VRBO, Booking.com.

Two. The software stack — channel managers, pricing tools, PMS.

Three. Banking — credit-card fees, wire fees, payment processing.

Four. Education — courses, books, conferences.

[TEACH — 5 min]

Platform fees.

Airbnb host service fee, VRBO booking fee, Booking.com commission.
These come out of your gross deposits — but they're still
deductible on line 19 once you report gross income on line 3 (see
Lesson 3.2).

Some hosts report net and miss the platform-fee deduction
entirely. Reporting gross + line-19 fee is the right structure.

Software stack.

Most STR hosts run several recurring software subscriptions:

  Channel manager (Hospitable, Hostfully, Guesty) — line 19
  Pricing software (PriceLabs, Wheelhouse, Beyond) — line 19
  Property management software — line 19 (if separate from
   channel manager)
  Listing helpers (AirReview, Listingo) — line 19
  Bookkeeping software (QuickBooks, Wave) — line 19
  Cloud storage (Dropbox, Google Workspace) — line 19, allocate
   if mixed personal/business
  Smart-lock services (RemoteLock, August) — line 19

All §162 ordinary and necessary.

Banking.

  Bank account monthly maintenance fees — line 19
  Wire transfer fees — line 19
  NSF / overdraft fees — line 19 (yes, deductible — they're a
   cost of running the account, not a fine)
  Credit-card annual fees — line 19, allocate if the card is
   shared with personal use (which we recommend against; see
   Lesson 2.2)
  Payment processing fees (Stripe, Square, PayPal) for direct-
   booked guests — line 19

Education.

  Courses on STR operations, tax, real estate — line 19, §162 +
   §1.162-5
  Books, audiobooks (operational topics) — line 19
  Conferences and seminars — line 19, with §274(d) substantiation
   if travel is involved
  Coaching or consulting fees — line 19, §162

Education is deductible if it maintains or improves skills required
in the host's existing trade or business. Education that qualifies
the host for a NEW trade or business is not deductible.

[DEMONSTRATE — 4 min]

[Open TAX-002 SaaS / Platform-fees line.]

Sample annual stack for a 3-cabin operator:

  Airbnb host service fees:                     $2,826
  Stripe processing (direct bookings):             $400
  PriceLabs:                                       $240
  Hospitable (channel manager):                    $300
  Track1099 (e-filing service):                     $40
  QuickBooks Online:                               $360
  Dropbox (50% allocation rental/personal):        $144
  Bank monthly maintenance × 3 cards:               $0  (waived)
  Annual fee on rewards card:                      $95
  STR Ledger course (this one):                   $497
                                                ──────
  Total line-19 deductions from this category:  $4,902

At a 32% marginal rate: $1,569 in tax savings from a category that
hosts routinely under-report by half.

[ASSIGNMENT — 30s]

List your full subscription stack this week. Pull the prior-year
bank statement and identify every recurring auto-charge that's
business-related.

Add each one to the rule library so future quarters auto-categorize.

If you find a subscription that you're paying for and not using,
that's not a tax problem — that's a budget problem. Cancel it.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.8 — Professional services + 1099 contractors

**Length:** 12 min

```
[OPEN — title card: "3.8 — Professional Services + 1099 Contractors"]

[VO]

Attorneys, CPAs, photographers, handymen. The 1099 you don't file
is the deduction the IRS won't recognize.

Professional services and contractor expenses are large-dollar
deductions for most STR portfolios — and they carry an information-
reporting obligation that hosts routinely miss. The deduction is
preserved either way; the form requirement isn't.

[FRAME — 30s]

In this lesson:

One. The §6041 1099-NEC threshold and what triggers it.

Two. Common STR contractors and the 1099 obligation.

Three. The W-9 timing — Lesson 2.6 reinforced.

Four. The TAX-003 walk-through.

[TEACH — 5 min]

§6041 reporting.

§6041 of the Internal Revenue Code requires Form 1099-NEC for any
individual contractor paid $600 or more in a calendar year for
services rendered to your trade or business.

The threshold is per individual per year, across all properties
combined.

Common STR contractors:

  Cleaners (almost always cross threshold for active hosts)
  Handymen, plumbers, electricians (often cross)
  Photographers, videographers (project-based)
  Landscapers (small operators only)
  Painters, contractors on small jobs
  Bookkeepers, virtual assistants
  Co-hosts paid in cash (this is real; track carefully)

Exceptions:

  Corporations (LLCs taxed as S-corp or C-corp) — no 1099-NEC
   required
  Material costs only — pure goods, no services labor — no 1099
   required
  Payments through a 1099-K-issuing platform (Stripe, PayPal, the
   payment processor handles reporting)

When in doubt: issue the 1099. There's no penalty for issuing one
that wasn't required. There's a substantial penalty for failing to
issue one that was.

The deduction itself.

§162 ordinary-and-necessary. The 1099 is an information-reporting
obligation, not a deduction-validity rule. A contractor expense is
deductible whether or not the 1099 is filed. The penalty for missing
the 1099 is separate from the deduction.

That said: a return showing $50,000 of contractor expenses with no
1099-NECs filed is a return that draws examiner attention. The
inferred message is "the host doesn't follow reporting rules,"
which seeds doubt about the substantiation generally.

File the 1099. Eat the small administrative cost. Preserve the
deduction's audit posture.

[DEMONSTRATE — 5 min]

[Open TAX-003 1099-NEC Tracker.]

Sample contractor roster for a 3-cabin operator:

  Cleaner — Sarah B.
    YTD paid: $11,400
    W-9 on file: yes
    1099-NEC required: yes
    1099 filed: pending January

  Handyman — Mark P.
    YTD paid: $2,140
    W-9 on file: yes
    1099-NEC required: yes
    1099 filed: pending January

  Photographer — Linda C.
    YTD paid: $1,250
    W-9 on file: yes
    1099-NEC required: yes
    1099 filed: pending January

  Landscaper — TruGreen Inc.
    YTD paid: $940
    Tax classification: corporation
    1099-NEC required: no

  Coffee shop barista who came over to repaint guest bathroom
   (one-time gig)
    YTD paid: $420
    Below threshold; no 1099 required.

The TAX-003 view shows three contractors flagged for January 1099
filing. Each has W-9 attached. Each row holds the data the
1099-NEC export needs.

Workflow at year-end:

January 1: TAX-003 freezes year-totals.
January 5: Confirm W-9s on every flagged contractor; collect any
 missing.
January 15: Generate 1099-NEC packet via TAX-003's export feature.
January 25: E-file via IRS FIRE system or a service like Track1099
 ($3-5 per form).
January 31: Filing deadline. Both copies (to contractor and to IRS)
 due.

[ASSIGNMENT — 30s]

Audit your YTD contractor totals today. Identify any contractor
approaching $600 without a W-9 on file. Email each one this week
to collect.

If a contractor crossed $600 last year and you didn't file a
1099-NEC, late-filing is still possible (with penalty). The
deduction is preserved either way.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.9 — Home office

**Length:** 10 min

```
[OPEN — title card: "3.9 — Home Office"]

[VO]

Exclusive use is the test. Most hosts fail it on a technicality. The
fix is a curtain.

Home office is the deduction hosts most often skip out of fear
they'll get it wrong. The §280A(c) exclusive-use rule is real but
narrower than the lore suggests. Two methods are available — pick
one.

[FRAME — 30s]

In this lesson:

One. The §280A(c) exclusive-use test.

Two. Simplified method versus actual method.

Three. The TAX-006 walkthrough.

Four. The recapture-on-sale consideration.

[TEACH — 4 min]

The exclusive-use test.

§280A(c) allows a home-office deduction if a portion of the dwelling
is used:

  Exclusively, AND
  Regularly, AND
  As the principal place of business OR a place to meet clients OR
   a separate structure used in connection with the trade or
   business.

For STR hosts, the principal-place-of-business test is the typical
qualifier. The "exclusively" word is the trap.

Exclusively means the space is used 100% for business. Not
"primarily." Not "mostly." Exclusively. A guest bedroom that
doubles as your office is not exclusive. A bedroom that has been
converted to a dedicated office, with no guest bed and no personal
storage, is exclusive.

The fix when the space is mixed-use: add a physical separation. A
curtain, a folding screen, a partition wall. Carve out a clearly
defined work zone within the room. That zone is exclusive; the
rest of the room can be personal.

Simplified versus actual.

Simplified method. $5 per square foot, capped at 300 square feet.
Maximum deduction: $1,500. No depreciation, no recapture.

Actual method. Allocate by square footage (or other reasonable
method). Multiply the home's mortgage interest, property tax,
utilities, insurance, repairs, and depreciation by the business-use
percentage. Higher deduction; more substantiation; depreciation
recapture on sale.

Decision rule: simplified for hosts who want low overhead; actual
for hosts whose allocation generates $2,000+ of deduction.

[DEMONSTRATE — 5 min]

[Open TAX-006 Home Office Allocator.]

Sample. 180 square feet dedicated office. Total home: 2,200
square feet. Allocation: 180 / 2,200 = 8.18%.

Annual home expenses:

  Mortgage interest:                    $14,200
  Property tax:                          $4,800
  Homeowner's insurance:                 $1,400
  Electric:                              $2,100
  Gas:                                   $1,400
  Internet (already 50% deducted on
   STR side, so 50% × 8.18% on home
   office = ~4.09%):                       $400
  Maintenance and repairs:               $1,200
                                       ───────
  Total allocable expenses:             $25,500

Plus depreciation: based on home's depreciable basis (purchase
price minus land allocation), 39-year nonresidential class for
the office portion, 8.18% allocation. Sample: ~$420 year.

Actual method total: $25,500 × 8.18% + $420 = $2,506.

Simplified method: 180 sqft × $5 = $900. Capped at 300 sqft so the
$1,500 cap doesn't apply here.

Actual method wins by $1,606. Worth the substantiation effort.

The recapture trap.

Actual method depreciates the home-office portion of the dwelling.
On sale of the home, that depreciation recaptures at up to 25%
under §1250 unrecaptured gain rules.

For a home office depreciated $420 per year over 10 years = $4,200
of recapture. At 25%: $1,050 of additional tax on sale.

Simplified method has no depreciation and no recapture. The
trade-off is real but small for short holding periods.

[ASSIGNMENT — 30s]

Measure your home office space this week. Verify the exclusive-
use test (no guest bed, no personal storage in the dedicated zone).

Run TAX-006 with both methods side-by-side. Pick the higher one
unless the sale-horizon recapture math changes the answer.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.10 — Insurance, umbrella, entity costs

**Length:** 10 min

```
[OPEN — title card: "3.10 — Insurance, Umbrella, Entity Costs"]

[VO]

The insurance you're already paying is a deduction. The entity you
set up is too.

These are categories where the deduction is uncomplicated but the
allocation can be tricky. Umbrella policies covering both rental
and personal need allocation. Entity costs pre-operational versus
ongoing have different §195 versus §162 treatment.

[FRAME — 30s]

In this lesson:

One. Property insurance — straightforward.

Two. Umbrella allocation — the typical 65-80% rental split.

Three. Entity costs — §195 startup vs. §162 ongoing.

[TEACH — 5 min]

Property insurance.

The dwelling policy on each rental property — STR-specialty
(Proper, Obie) or landlord (the carrier's variant of homeowner's
for non-owner-occupied) — is fully deductible on Schedule E line 9.

Substantiation: declarations page from the carrier showing the
underlying property and the rental classification.

Umbrella.

Umbrella policies typically cover multiple underlying risks —
rental properties, personal home, vehicles. The premium is
deductible only for the business portion.

Two allocation approaches:

Approach one. Carrier itemization. Some umbrella carriers itemize
coverage by underlying policy. If the dec page shows "$X for
rental properties, $Y for personal home," allocate by the ratio.

Approach two. Underlying policy values. Sum the dwelling-coverage
values of all rental properties and divide by the sum of rental
+ personal coverage.

Typical allocations land at 65-80% rental for hosts with 2-4 STR
properties plus a primary home.

Substantiation: the umbrella dec page plus the allocation
worksheet showing the math. Ships in TAX-002 as a tab.

Entity costs.

LLC formation fees, registered agent fees, attorney fees for
operating-agreement drafting — these are §195 startup costs if
incurred BEFORE the trade or business begins.

§195 mechanics:

  Deduct up to $5,000 in year one
  Phase-out begins at $50,000 of total startup costs
  Amounts above the year-one cap amortize over 180 months (15
   years)

Once the business is operating, ongoing entity costs — annual
franchise tax, registered agent renewal, ongoing legal — are §162
deductions, not §195.

The line between §195 and §162 is the date the trade or business
began. For an STR, that's typically the placement-in-service date
of the first rental property.

[DEMONSTRATE — 4 min]

Sample.

Property insurance per cabin: $1,280/year × 3 = $3,840.

Umbrella policy: $480/year. Underlying policies: 3 rental dwellings
at $400K each = $1.2M total rental coverage; primary home at $600K
coverage. Allocation: $1.2M / $1.8M = 66.7%. Rental portion of
umbrella: $480 × 66.7% = $320.

Annual entity costs (already operational):

  Annual LLC franchise tax: $300
  Registered agent: $180
  Ongoing accounting consult: $640
                              ─────
  Total §162:                $1,120

Schedule E entries:

  Line 9 — Insurance: $3,840 (property) + $320 (umbrella) = $4,160
  Line 19 — Other (Entity costs): $1,120

If the host formed the LLC last year (pre-rental):

  Formation costs: $620 LLC + $180 registered agent + $2,000
   attorney = $2,800 total startup
  Year-one §195 deduction: $2,800 (under the $5,000 cap)
  No amortization in this case (under cap)

[ASSIGNMENT — 30s]

Pull the dec pages on every insurance policy that touches your
portfolio. Confirm the rental properties are correctly listed as
the named insured and as rental property.

If you formed an entity in the past 18 months, audit whether any
formation costs were missed in the year-of-formation deduction.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.11 — Marketing, guest experience, education

**Length:** 8 min

```
[OPEN — title card: "3.11 — Marketing, Guest Experience, Education"]

[VO]

The welcome book is a marketing expense. So is this course.

Marketing and guest-experience deductions are routinely under-
claimed because hosts categorize them as "general overhead" rather
than as the §162 ordinary-and-necessary expenses they are.

[FRAME — 30s]

In this lesson:

One. Marketing — listing photography, ads, branding.

Two. Guest experience — welcome amenities, branded items.

Three. Education — courses, books, conferences.

[TEACH — 4 min]

Marketing.

§162 ordinary-and-necessary. Schedule E line 5 (advertising) or
line 19.

  Listing photography and videography — line 5
  Pinterest, Meta, Google ads — line 5
  Logo design, branding — line 5 if related to marketing
  Listing helper subscriptions (AirReview, Listingo) — line 19
  Pinterest scheduler / social tools — line 19

Guest experience.

The §162 treatment depends on whether the expense is for guests
specifically or for the property generally.

  Welcome basket for guests — line 19 marketing/guest-experience
   under a documented welcome-supply policy
  Branded items (custom mugs, monogrammed throws) — line 19
   marketing
  Guest-supply consumables (coffee, soap, paper towels) — line
   17 supplies (these are property supplies, not marketing)
  Welcome book (printed) — line 5 (marketing material) or line 19
  Local-recommendations card stock — line 5 or line 19

The "documented welcome-supply policy" matters. A host who
casually leaves snacks needs to argue the snacks are guest-
experience expense; a host with a written policy ("Each check-in
receives a welcome basket of [list of items]") has the policy as
substantiation.

Education.

§162 + Treas. Reg. §1.162-5. Education that maintains or improves
skills required in your existing trade or business.

  Tax courses (this one) — line 19
  STR operations courses — line 19
  Books on hosting, tax, real estate — line 19
  Conferences (DC Conference, STR Wealth Conference) — line 19,
   with §274(d) substantiation for travel
  Coaching / consulting — line 19, §162

What does NOT qualify under §1.162-5:

  Education that qualifies you for a NEW trade or business (e.g.,
   a real-estate license course if you're not yet a licensed agent)
  Education that's primarily personal (e.g., a creative-writing
   course because you blog about your STR)

[DEMONSTRATE — 3 min]

Sample annual marketing/guest-experience/education stack:

  Listing photography (annual refresh):           $1,250
  Pinterest ads (small spend):                       $480
  Welcome basket items (from documented policy):     $640
  Branded mugs / decor refresh:                      $320
  Welcome book printing (GST-001):                   $200
  STR Ledger 47-Deduction Operator course:           $497
  STR Wealth Conference (registration + travel):   $1,840
  Real-estate tax book:                               $35
                                                  ──────
  Total:                                          $5,262

Schedule E entries:

  Line 5 — Advertising: $1,250 + $480 + $200 = $1,930
  Line 19 — Other (Marketing/Guest-Experience): $640 + $320 = $960
  Line 19 — Other (Education): $497 + $1,840 + $35 = $2,372

[ASSIGNMENT — 30s]

Total your marketing spend for the year. If it's under 1% of
gross rental income, you're either running an exceptional brand or
under-investing.

For education: ensure each course or book has a clear connection
to maintaining or improving your existing STR operations.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

## Lesson 3.12 — The 47-deduction self-audit

**Length:** 16 min

```
[OPEN — title card: "3.12 — The 47-Deduction Self-Audit"]

[VO]

Run the checklist on last year's return. If you missed three items,
you bought the course back today.

Module 3 closes with the application — the 47-Deduction Self-Audit
Checklist applied to your prior year's Schedule E. This is the
exercise that pays for the course in week one for most students.

[FRAME — 30s]

In this lesson:

One. How to read a Schedule E line-by-line.

Two. The self-audit checklist, applied.

Three. The score and what to do with the ✗ rows.

[TEACH — 4 min]

Reading Schedule E line-by-line.

Pull your prior-year Form 1040 with Schedule E. Find the page that
shows your rental properties.

Each property has its own column. Lines 3 through 22 hold the
income and expense categories.

  Line 3 — Rents received
  Line 5 — Advertising
  Line 6 — Auto and travel
  Line 7 — Cleaning and maintenance
  Line 8 — Commissions
  Line 9 — Insurance
  Line 10 — Legal and other professional fees
  Line 11 — Management fees
  Line 12 — Mortgage interest
  Line 13 — Other interest
  Line 14 — Repairs
  Line 15 — Supplies
  Line 16 — Taxes
  Line 17 — Utilities
  Line 18 — Depreciation expense
  Line 19 — Other (with sub-itemization on Form 4562 or attached)
  Line 20 — Total expenses
  Line 21 — Income or loss

For each line, check the corresponding deduction in the 47-line
checklist.

The audit.

Open the 47-Deduction Self-Audit Checklist (Bonus, in your folder).

[DEMONSTRATE — 11 min]

Walk through each of the 47 with a sample 3-cabin operator's
prior return.

[Run through, marking each:]

  ✓ — Claimed correctly on last year's return
  ✗ — Should have claimed but didn't
  – — Not applicable
  ? — Unsure

Common ✗ findings on the first audit:

  Deduction #4: Internet/cable — host charged on personal card,
   never recategorized as business
  Deduction #15: Routine maintenance (HVAC service) — host
   capitalized when should have expensed under §1.263(a)-3(i)
  Deduction #25: Cost-segregation reclassed assets bonus — never
   elected on prior return
  Deduction #30: Tolls and parking on property visits — not logged
   in mileage workbook
  Deduction #34: Payment processing fees — buried in net deposits,
   never broken out
  Deduction #43: Entity costs — lumped into legal/professional
   instead of separately
  Deduction #46: Education — current course tuition not on prior
   return because purchased after filing

Sample score. ✓ × 32 / ✗ × 8 / – × 5 / ? × 2.

8 ✗ rows. At an average $300 missed deduction value: $2,400 of
underclaimed expense × 32% marginal rate = $768 of recoverable
tax via amendment.

The course paid for itself plus.

[ASSIGNMENT — 30s]

Run the 47-Deduction Self-Audit on your prior year's return this
week.

For each ✗ row, decide:

  Material enough to amend (Form 1040-X, available 3 years from
   original filing)?
  Not material enough — capture going forward.

For each ? row, bring to your CPA at the next handoff. The
"unsure" rows are the highest-leverage conversation.

This is also the lesson that closes Module 3. Module 4 — The Big
Levers — opens next.

[ON-SCREEN DISCLAIMER CARD — 10s]

[OUT]
```

---

*Last reviewed: 2026-04-29. Module 3 is reference, not sequential. Encourage students to watch in the order they encounter the deductions in their own portfolios. Lesson 3.12 — the self-audit — is the most-watched lesson in pilot data because it's where students see the course paying off.*
