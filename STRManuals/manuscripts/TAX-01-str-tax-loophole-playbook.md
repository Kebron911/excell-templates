# TAX-01 — The STR Tax Loophole Playbook

**Working manuscript.** Long-form markdown for authoring. Final designed PDF lives at `private/manuals/str-tax-loophole-playbook/v1.pdf` (uploaded via SFTP to Hostinger).

**Author:** Daniel Harrison
**Target length:** 48 pages (~14,000–16,000 words)
**Reading level:** plain English, no jargon without definition
**Companion:** TAX-002 P&L Workbook (Excel)

---

## Disclaimer

This manual is plain-English education on how the rules work, drawn from publicly available IRS guidance, Treasury regulations, and tax court decisions. **It is not tax or legal advice.** Every taxpayer's situation is different. Consult a CPA — ideally one with documented STR clients — before acting on anything in here.

The rules described as of 2026 are subject to change. The author updates the manual annually for each tax year and after material rule changes; buyers receive free updates within v1.

---

## Front matter

- **Title page** with cover (TAX-01 · The STR Tax Loophole Playbook)
- **Copyright + disclaimer page**
- **About this manual** (½ page)
- **Table of contents** (1 page)

---

## Chapter outline

| # | Title | ~Pages | Purpose |
|---|-------|--------|---------|
| 1 | What the "STR loophole" actually is (and isn't) | 6 | Frame the strategy correctly. Defuse common misconceptions. |
| 2 | The 7-day average stay rule | 5 | The first gate. How to calculate, what trips people up. |
| 3 | The 30-day exception | 3 | When 7 days isn't enough and 30 with personal services applies. |
| 4 | Material participation in 60 seconds | 5 | The seven tests, ranked by usefulness for STR owners. |
| 5 | Documenting hours the way an auditor wants to see it | 5 | Contemporaneous logs, what counts, what doesn't, how to reconstruct if you forgot. |
| 6 | Cost segregation — when it's worth it on one property | 4 | The mechanism, the numbers, when it pencils, when it doesn't. |
| 7 | Filing strategy: Schedule E vs. Schedule C | 4 | The two reporting paths, self-employment tax implications, the entity question. |
| 8 | The eight mistakes that get returns flagged | 4 | Patterns that draw IRS attention; how to avoid each. |
| 9 | Year-end checklist | 2 | A 1-page checklist of every year-end task in order. |
| 10 | Companion workbook walkthrough | 3 | Step-by-step P&L setup for STR owners using the TAX-002 workbook. |

**Back matter:**
- Glossary (1 page)
- Recommended reading + IRS publications (½ page)
- Update log (½ page)
- Final disclaimer + about Daniel (½ page)

---

# Chapter 1 — What the "STR loophole" actually is (and isn't)

The first time I asked a CPA whether the "STR loophole" applied to me, I got three different answers from three different people. One was technically correct but wrong in spirit. Two were wrong outright. None of them gave me the actual rule in a sentence I could repeat back.

So before we go anywhere, let's get the rule into a form you can repeat back.

The STR loophole is a specific carve-out in the way the IRS treats short-term rentals — one that lets you, under specific conditions, deduct rental losses against your W-2 income instead of having those losses sit on the sidelines until you have rental income to offset. That's the entire point. That's why it matters. That's why a $400,000 short-term rental can produce a $60,000+ tax savings in year one for a high-W-2 earner.

It's not a hack. It's not something Airbnb hosts discovered by accident. It's a 1986 piece of tax code that's been there the whole time, that real estate accountants have used quietly for decades, and that became famous when the rise of Airbnb made it accessible to ordinary people instead of just hotel investors.

Let's unpack what's actually going on.

## Why the rule exists at all

Most rental real estate is treated by the IRS as a "passive activity." That phrase has a specific meaning that has nothing to do with whether you, the owner, are passive about running it. It's a legal classification.

Here's the simplified version: in 1986, Congress got mad about wealthy people using paper losses from real estate (depreciation, mostly) to wipe out their wage income. The fix was the Passive Activity Loss rules — Section 469 of the tax code. The rules say that losses from "passive activities" can only offset income from other passive activities. They cannot offset wages, business income from active work, dividends, interest, or capital gains.

By default, the law says rental real estate is passive — *no matter how active you actually are in running it*. Even if you rebuild the kitchen yourself, vet every guest personally, and answer messages at 2 AM, the IRS still classifies your rental as passive. The losses get trapped.

This is why most rental real estate doesn't help your tax bill in year one. Yes, you might generate a $40,000 paper loss after factoring in depreciation. But that loss can only offset other passive income — and most W-2 earners don't have any. So the loss "suspends" — it carries forward, year after year, until you either generate passive income to absorb it or you sell the property and get to use it then.

That's the default. That's what makes most rentals tax-neutral or tax-disappointing in the early years.

## The two doors out of passive

The Passive Activity Loss rules have a few exceptions. Two of them matter for our purposes.

**Door 1: Real Estate Professional status.** If you spend more than 750 hours per year and more than half of your *total* working hours on real estate activities — and you materially participate in your rentals — your rentals stop being passive. This door is famous, but it's narrow: most W-2 earners can't qualify because they spend more time at their job than they could possibly spend on real estate.

**Door 2: The short-term rental carve-out.** This is the one we care about. The Treasury regulations contain a quiet rule that says a property is *not a rental activity* — for purposes of the passive loss rules — if its average period of customer use is seven days or fewer. (There's also a 30-day version with conditions; we'll cover it in Chapter 3.)

Read that again. If your average stay is seven days or fewer, the property is not a "rental activity" under the law. It's something else — a trade or business. And trade or business losses, if you materially participate in the business, are *not* passive. They're active. And active losses can offset your W-2 income.

That's the whole loophole. A definitional carve-out, written in 1988 (in Temporary Regulation 1.469-1T(e)(3)(ii) if you want the citation), that turns short-term rentals into something the law considers a business rather than a rental.

## What the rule actually does

The mechanical effect, in plain English:

1. Your STR property generates a paper loss in year one. Most of this loss comes from depreciation — the IRS lets you deduct a portion of the building's value every year as an expense, even though you're not paying anything out of pocket.

2. With cost segregation (Chapter 6) and bonus depreciation, that paper loss can be very large — $40,000–$80,000 isn't unusual on a property that costs $400,000.

3. Because your STR is *not* a rental activity (avg stay ≤ 7 days) and you materially participate in it (Chapter 4), the loss is *active*, not passive.

4. Active losses flow through your tax return and reduce your taxable income — including W-2 wages.

5. If you're in the 32% federal bracket plus 5% state, every $1 of loss is worth roughly 37¢ in actual tax savings.

A high-earner couple with $300,000 of W-2 income who buys a $400,000 STR and runs cost seg in year one can save $20,000–$30,000 on their federal tax bill that same year. That's the headline. That's why this matters.

## What the rule is NOT

A lot of misinformation floats around on this topic. Let's defuse the common ones now so you have the right frame for the rest of the manual.

**It is not the same as Real Estate Professional status.** REP requires 750 hours and more time on real estate than your day job. The STR loophole requires *neither*. You can have a full-time W-2 job, run one short-term rental in your spare time, and still qualify — provided you meet the specific tests we'll cover.

**It does not require an LLC or any special entity.** You can run an STR as a sole proprietor and still use the loophole. Entity choice matters for liability and bookkeeping, but it does not turn the loophole on or off.

**It does not require you to "actively manage" the property in the colloquial sense.** It requires you to "materially participate" in the legal sense — which is a specific test about hours, not about how engaged you feel.

**It is not a loophole the IRS doesn't know about.** The IRS knows. The Treasury wrote the rule. Tax court has addressed it dozens of times. Audits happen, and people lose them — usually because of poor documentation, not because they were doing anything wrong.

**It does not last forever.** Bonus depreciation — the thing that supercharges the loss — is on a phase-down schedule. As of 2026, bonus is at 40%, dropping to 20% in 2027 and 0% in 2028 unless Congress changes the law. The loophole itself will still exist; the size of the year-one loss will shrink.

**It is not a substitute for an actual business that pencils.** Buying a bad STR purely for the tax benefit is one of the worst financial mistakes you can make. The loophole reduces your tax bill on a property you'd want to own anyway. It does not turn a money-losing property into a money-maker. We'll come back to this in Chapter 8.

## The three-question test

Before we go any further, here's a quick test for whether the STR loophole is even worth your time. If you answer "no" to any of these, the rest of this manual is interesting reading but probably won't change your tax bill this year.

**Question 1.** Do you have, or are you about to buy, a property that is or will be rented to short-term guests with an average stay of seven days or fewer?

**Question 2.** Are you willing to materially participate in running it — measured in real hours, real activities, contemporaneously logged?

**Question 3.** Do you have W-2 income, business income, or some other ordinary income that would benefit from offsetting losses? (If you don't owe much tax to begin with, the loophole has nothing to offset.)

Three yeses means you should keep reading.

Two yeses means you might want to keep reading and adjust your situation — for example, if you don't currently materially participate but could.

One or zero yeses means the loophole probably doesn't apply to you, and you'd be better off focusing on other strategies.

## What you'll learn in this manual

The rest of this manual covers, in order:

- The 7-day rule in detail — how it's actually calculated, what trips people up, what to do if you have a mix of stay lengths.
- The 30-day exception with significant personal services.
- Material participation — the seven tests, ranked by usefulness for STR owners.
- Documentation — the contemporaneous log that holds up under audit, including a worked example.
- Cost segregation — when it's worth doing on one property, when it isn't, and how to evaluate the studies.
- Filing strategy — Schedule E vs. Schedule C, the self-employment tax question, and entity considerations.
- The eight common mistakes that draw IRS attention.
- A year-end checklist.
- A walkthrough of the companion P&L workbook.

By the end you'll have:

- A clear understanding of whether and how the loophole applies to you.
- A documentation system you can run all year.
- A list of decisions to bring to your CPA — with the right vocabulary and the right citations.
- A workbook you can fill in tonight to estimate your year-end position.

Let's start with the gateway test: the 7-day rule.

---

# Chapter 2 — The 7-day average stay rule

The 7-day rule is the gateway test. Pass it and you're inside the carve-out — your property isn't a rental activity in the eyes of the law, and the rest of the strategy becomes available to you. Fail it and almost nothing else in this manual matters for your situation this year.

The good news is that the rule is mathematically simple. The bad news is that it's the rule most often miscalculated, because the IRS definition of "average period of customer use" is not the average a normal human would compute.

## What the regulation actually says

The rule lives in Treas. Reg. § 1.469-1T(e)(3)(ii)(A). The regulation says a property is not a rental activity if "the average period of customer use for such property is seven days or less."

It then defines average period of customer use, in plain language, as:

> The aggregate number of days the property is rented during the taxable year, divided by the number of rental periods during the taxable year.

That's it. Two numbers. Total rental days on top, number of separate rental periods on the bottom.

The pitfall is that "rental periods" is not what most people assume. Each booking is one rental period — regardless of how long it is. A ten-night booking is one period. A one-night booking is also one period. Your property's total rental days is the sum of nights actually booked across all rental periods.

## The math, three ways

**Example 1 — A clean STR.** You rented your property to twelve different guests last year. Their stays were: 3 nights, 2 nights, 4 nights, 2 nights, 5 nights, 3 nights, 4 nights, 3 nights, 2 nights, 4 nights, 3 nights, 5 nights. Total rented days: 40. Number of rental periods: 12. Average: 40 ÷ 12 = 3.33 days. Comfortably under 7. Pass.

**Example 2 — Mixed lengths.** Same property, but two of those stays were 14 nights each (a winter snowbird and a summer family reunion). Stays: 14, 14, 3, 2, 4, 2, 5, 3, 4, 3, 2, 4. Total rented days: 60. Number of rental periods: 12. Average: 60 ÷ 12 = 5.0 days. Still under 7. Pass.

**Example 3 — Where it goes wrong.** Same property, but you took three monthly rentals during the off-season to fill the calendar. Stays: 30, 30, 30, 3, 2, 4, 5, 3, 4, 5. Total rented days: 116. Number of rental periods: 10. Average: 116 ÷ 10 = 11.6 days. Fails the 7-day test.

That third example is the one that catches people. Each individual stay below 30 days felt like a "short-term" rental in the colloquial sense. But the average tipped over 7 because three long stays dragged it up.

## Days vs. nights — pick one and stick with it

The regulation uses "days." Most booking platforms report "nights." For a stay that runs from Friday afternoon to Sunday morning, that's two nights. Whether it's two or three days depends on how you count partial days, and the IRS has been pragmatic about this — most practitioners use nights and call them days, and the math works out the same as long as you're consistent across both the numerator and the denominator.

The mistake to avoid: counting nights in the numerator and calendar-days-occupied-by-each-booking in the denominator. That double-counts your turnover days and nudges your average up artificially. Pick a method, document it, apply it identically to every booking.

## What blocked-out days do (and don't) count toward

A common worry: "I block out December for myself. Does that count against my average?"

It does not. Blocked days where the property isn't rented to a customer are simply not part of the calculation. They don't go in the numerator or the denominator. The math only includes actual rental periods.

The same is true for vacancy. If your property sat empty for three weeks because nobody booked it, those three weeks don't appear in the calculation either. Your average period of customer use is based on the bookings that *did* happen, not the calendar days available.

## The 14-day owner-use threshold (different rule, easy to confuse)

There's a separate IRS rule — Section 280A — that says if you use the property for more than 14 days personally (or more than 10% of total rental days, whichever is greater), the property gets reclassified as a "dwelling unit used as a residence." When that happens, your deductions get capped at the rental income — meaning you can't generate a loss at all. Game over for the loophole, regardless of how good your average-stay number looks.

This is a different rule from the 7-day test, and it's the source of constant confusion. Two separate constraints both affect short-term rentals:

- **The 7-day rule** decides whether your property is a "rental activity" or a trade or business.
- **The 14-day personal-use rule** decides whether you can claim losses at all.

You need to be inside both constraints. If you took a two-week family vacation at your STR property, you've used 14 days personally — right at the threshold. Add even one more day and your deductions get limited.

## "What if I miss it by one day?"

This question comes up in every consultation. The answer depends on the year.

The 7-day test is calculated annually. So if you fail it in 2026, your 2026 losses are passive — but if you pass it in 2027, your 2027 losses are active again. The status of one tax year does not bleed into the next.

If you're approaching year-end and your average is creeping toward 7, you have options:

1. **Decline a longer pending booking** that would tip you over.
2. **Accept more short bookings** to push the average down (each short booking adds to the numerator at a low rate while adding 1 to the denominator).
3. **Accept the result** and use the suspended losses next year, when your average stay is back under 7.

Option 3 is sometimes the right call. Decisions about what guests to accept should not be driven entirely by tax math.

## Multi-property considerations

If you own more than one STR, the regulations let you choose how they're treated for material participation purposes — as separate activities or as one grouped activity. (We'll cover the grouping election in Chapter 4.)

For the 7-day test specifically, each property's average is calculated separately. Owning a 4-day-average property and a 12-day-average property does not mean you average them to 8. The 12-day property fails on its own and stays passive; the 4-day property passes and becomes active.

This matters because most STR owners own properties with similar use patterns. If you have two true short-term vacation rentals, both will pass. But if one of them is a furnished mid-term rental for traveling nurses, that one is likely to fail and won't enjoy the same treatment.

## A 90-second annual self-audit

You can run this audit anytime — quarterly, year-end, or whenever a CPA asks "is this property under the 7-day test?"

1. Pull a CSV of all bookings for the year from your channel manager (Hospitable, Hostaway, OwnerRez) or directly from Airbnb's reservation history page.
2. Filter to bookings with a check-in date in the calendar year.
3. Sum the "nights" column. That's your numerator.
4. Count the rows. That's your denominator.
5. Divide.

If the result is at or below 7, you're inside the gate. Above 7, you're outside.

The companion TAX-002 workbook has a tab that does this calculation directly from a CSV import. Drop the export in, and the worksheet returns your average to two decimals plus a green or red status indicator.

## What's next

Passing the 7-day test puts you inside Door 1 of the loophole. There's also a Door 2 — the 30-day version with significant personal services — which we'll cover briefly in the next chapter, even though most STR hosts don't qualify there.

Then we'll move to material participation: the second test you have to pass to make the loophole work.

---

# Chapter 3 — The 30-day exception

The 7-day rule has a sibling. The same regulation — Treas. Reg. § 1.469-1T(e)(3)(ii)(A) — says a property is also not a rental activity if its average period of customer use is **30 days or fewer AND significant personal services are provided**.

This is Door 2. It exists for situations where the average stay is longer than 7 days but the operator is providing hotel-like services that look more like a business than a rental.

I bring it up because:

1. Some hosts have an average stay between 7 and 30 days and want to know if they qualify.
2. Some CPAs without STR experience hear "Airbnb" and immediately route their clients to this door because they assume the cleaning and turnover work counts as "significant personal services."
3. It almost never applies, and it's the source of more bad advice than any other piece of this strategy.

Let's defuse it.

## What "significant personal services" actually means

The regulation defines significant personal services by what it excludes. It says services rendered in connection with making the property available *for use as a rental* don't count. The Treasury then lists examples of what would count: services like daily housekeeping during a guest's stay, hosted meals, transportation, daily concierge.

In other words: hotel services, not rental services.

Cleaning the unit between guests doesn't count — that's a service to make the property available for the next rental, which is the kind the regulation explicitly excludes.

Stocking soap and coffee doesn't count — same category.

Providing a welcome book and check-in instructions doesn't count.

Responding to guest messages during a stay doesn't count, unless it's a level of service that genuinely resembles a hotel concierge desk.

What *does* count, in the rare cases where it applies:

- Daily housekeeping during the guest's stay (not turnover cleaning).
- Hosted meals or in-suite dining service.
- Transportation services arranged for the guest.
- A staffed front desk.
- Daily linen service or laundry service during the stay.

If your operation looks like a hotel — staffed, with services rendered to the guest while the guest is there — Door 2 might apply. If your operation looks like a self-check-in vacation rental, it doesn't.

## Why most STR hosts fail this test

Most short-term rental hosts operate on the self-service model. The guest checks in via a smart lock, accesses the welcome book on the wall, and runs their own stay. The host does cleaning between guests and answers messages when needed. That model is the modern STR business — and it does not provide significant personal services in the legal sense.

A small minority of operators run hosted models — bed and breakfasts, executive corporate housing with concierge service, urban operators who include daily breakfast and housekeeping. Those operators may have a path through Door 2.

If you're not sure whether you qualify, here's a quick test: if the IRS auditor walked into your guest's stay, would they see a hotel-like service experience, or would they see a furnished apartment the guest is essentially using on their own?

## When Door 2 actually matters

The narrow set of cases where Door 2 is worth pursuing:

- **Mid-term corporate housing with concierge.** Properties that rent for 14- to 30-day stays to traveling professionals, where the operator provides cleaning, linen, and amenity service during the stay.
- **Bed and breakfasts.** Genuine B&Bs with hosted breakfast, daily housekeeping, and an on-site host.
- **Boutique short-stay operators with hotel-like service.** A small number of urban operators who position their offering as a hotel substitute.

For these operators, Door 2 is real. For everyone else, Door 1 (7-day average) is the only door that matters.

## Why this chapter is short

If your average stay is over 7 days and you don't run hotel-like operations, the loophole isn't your strategy this year. The right move is either to adjust your business so it qualifies under Door 1 (more short bookings, fewer long ones) or to accept that the property's losses will be passive and plan accordingly.

Don't try to build a Door 2 case retroactively by recharacterizing your existing rental services as "significant personal services." That approach loses badly when an auditor reviews what your operation actually looks like — and the IRS has been increasingly aggressive about challenging Door 2 claims that don't hold up.

The next chapter — material participation — applies regardless of which door you came through. So let's move there.

---

# Chapter 4 — Material participation in 60 seconds

Material participation is the second hurdle. Pass the 7-day test and you're inside the carve-out — the property is not a rental activity. But that's only half the work. To turn the property's losses into active losses (which can offset W-2 income), you also have to materially participate in it.

If you don't materially participate, the property's losses are still passive — just under a different rule than the rental-activity rule. The carve-out gets you out of one trap and the participation test keeps you out of another.

The phrase "materially participate" sounds vague. The regulation that defines it — Treas. Reg. § 1.469-5T(a) — is the opposite. It gives seven specific tests, and you only need to pass *one* of them to qualify.

## The seven tests

For a tax year, you materially participated in an activity if any one of these is true:

**1.** You participated in the activity for more than 500 hours during the tax year.

**2.** Your participation in the activity constituted substantially all of the participation of all individuals (including non-owners) in that activity.

**3.** You participated in the activity for more than 100 hours, and your participation was not less than the participation of any other individual.

**4.** The activity is a "significant participation activity" and your aggregate participation in all such activities exceeds 500 hours. (A significant participation activity is one in which you participate more than 100 hours and meet no other test.)

**5.** You materially participated in the activity for any 5 of the prior 10 tax years.

**6.** The activity is a personal service activity and you materially participated in any 3 prior tax years. (Personal service activities are things like law, medicine, accounting — not real estate.)

**7.** Based on all the facts and circumstances, you participated on a regular, continuous, and substantial basis during the tax year — but only if you participated more than 100 hours.

For STR owners, two of these tests do almost all the work. Tests 1, 2, and 3 are the relevant ones. Test 4 occasionally applies. Tests 5–7 rarely matter for a single STR property.

## Test 1 — The 500-hour test

You spent more than 500 hours running the property in the tax year. That's about 10 hours a week, every week.

This test is unambiguous. If you can document 500+ hours, you pass. End of story.

For a single self-managed STR, hitting 500 hours requires real engagement. You're handling all guest communication, doing your own cleaning or actively managing cleaners, doing maintenance runs, managing pricing, marketing the listing, bookkeeping, and so on. Owners who treat their STR as a side hustle on autopilot rarely clear 500. Owners who self-clean and self-manage routinely do.

If you're newer to the property and trying to qualify in a short calendar period (you bought it in October, say, and need to qualify for the same year), the 500-hour test is harder because you've only got two or three months. Tests 2 and 3 are easier paths in that case.

## Test 2 — The substantially-all test

This is the workhorse test for self-managed single-property STR owners.

It says: if your hours running the activity are substantially all of the hours that anyone (you, your spouse, your cleaner, your contractor, your cohost, your bookkeeper) spends on the activity, you materially participate.

"Substantially all" doesn't have a fixed numeric definition in the regulation, but tax court has generally treated it as 95% or more.

For a self-managed STR, here's how this typically plays out:

- **Your hours:** 200 hours running the place over the year (roughly 4 hours per week).
- **Cleaner hours:** 40 hours total (roughly 2 hours per turnover, 20 turnovers per year).
- **Total non-owner hours:** 40 hours.
- **Your share of total hours:** 200 / 240 = 83%.

That's not substantially all. You'd fail Test 2 — but you might pass Test 3, which we'll cover next.

For Test 2 to actually work, your cleaner and any other non-owner participants need to do very little — or you need to do most of the cleaning yourself.

This is why Test 2 is most useful for owners who self-clean. If you're cleaning the property yourself, your hours include all the turnover work, and you push the substantially-all percentage up dramatically.

## Test 3 — The 100-hour-and-not-less test

This is the test most outsourced STR owners actually use.

It says: you materially participate if you spent more than 100 hours on the activity AND no other individual spent more hours than you did.

Notice the structure. You don't have to do *most* of the work. You just have to do *more than anyone else.*

Going back to the example above:

- **Your hours:** 200.
- **Cleaner's hours:** 40.
- **Bookkeeper's hours:** 10.
- **Spouse's hours:** 0.

You're at 200 and the next-highest individual is at 40. You pass Test 3.

The danger zone for Test 3 is when you hire a property manager. PMs typically log far more hours than the owner — they're handling messaging, dispatching cleaners, coordinating maintenance, doing the day-to-day. If your PM is doing 300 hours and you're doing 80, you fail Test 3 (and Test 2, and Test 1).

The fix, in that case, is either: do more yourself, hire less of the PM service, or accept that the loophole doesn't apply this year.

## "Not less than" is a strict comparison

Test 3 has a subtle gotcha. The phrase is "not less than the participation of any other individual." That means *if anyone else's hours equal yours, you still qualify.* But if anyone else's hours exceed yours by even one hour, you fail.

In practice, this means you need to keep an eye on each individual contributor's hours. If your cohost is at 195 hours and you're at 200, that's fine — you're still not less than. If they're at 205, you've lost the test.

This is one reason why the documentation chapter (Chapter 5) is so important. You need to know what *each* contributor logged, not just the total.

## Spouse hours combine

If you're married filing jointly, your spouse's hours and your hours combine for purposes of every material participation test.

This is the rule that makes the loophole genuinely accessible to high-W-2 households. The W-2 earner can be tied up in their day job; the spouse can be the one running the STR; the hours from both flow into one combined number for material participation.

This works even if only one of you is on the property's title. The spousal hours rule is about jointly filed returns, not about ownership.

It also creates a strategic option: a couple where one spouse has a full W-2 and the other has more flexible time can have the flexible spouse do the bulk of STR work, hit material participation easily, and the W-2 spouse's wages benefit from the active loss treatment.

## What counts as participation hours

Hours that count:

- Guest communication (messaging, calls, walk-throughs).
- Booking management (calendar updates, pricing decisions).
- Cleaning and turnover work, if you do it personally.
- Repairs and maintenance you do yourself.
- Supply runs to refill consumables.
- Marketing the listing (photos, description updates, channel management).
- Bookkeeping for the property.
- Travel to and from the property for any of the above.
- Time spent reviewing and approving work done by others (reviewing cleaner reports, vetting contractor quotes).

Hours that don't count — the "investor activity" exclusion:

- Reading reports about the property's financial performance.
- Studying the rental market in general.
- Attending real estate seminars or webinars about STRs.
- Looking at potential additional properties to buy.
- Reviewing your own analysis of whether the property is worth holding.

The regulation explicitly excludes "investor" activity — work an absentee owner would do — from the participation count. The hours have to be operational hours, not analytical ones.

This is the most common documentation mistake. People log "reviewed Q3 P&L — 45 minutes" or "researched competitor pricing in market — 90 minutes." Those don't count, and an auditor will strike them out of your log.

## "Activity" vs. "rental activity"

A subtle point that comes up if you read the regulation directly: the material participation tests refer to an "activity." But there's a separate sentence in the regulations that says no individual can be treated as materially participating in a "rental activity" except by meeting the real estate professional requirements (the 750-hour rule).

This sounds like it nukes everything we just discussed. It doesn't, because we've established (in Chapters 2 and 3) that a property passing the 7-day test is *not* a rental activity. It's a trade or business. So the "rental activity" restriction in the participation rules doesn't apply to it.

This is the part that confuses CPAs new to STR work. They read the participation rule, see "rental activity," conclude that material participation requires REP, and tell their client the loophole doesn't work. They missed step one — the property isn't a rental activity in the first place.

## Group election for multi-property owners

If you own more than one STR, the regulations let you elect to treat them all as one combined activity for material participation purposes. This is called the "regrouping" or "aggregation" election under Treas. Reg. § 1.469-9.

The advantage: hours spent on Property A and Property B combine for material participation. If you'd struggle to hit 100 or 500 hours on either alone, combining them makes it easier.

The disadvantage: once you've made the election, you can't undo it without IRS approval, and on sale, you can only deduct suspended losses against the gain when *all* properties in the group are disposed of.

For most owners with two or three STRs, the election is worth it. For owners with mixed portfolios (some STRs, some long-term rentals), the election interacts with other passive activity grouping rules and gets complicated. Get a CPA on this one before you elect.

## What this looks like in practice

A typical W-2 family with one self-managed STR:

- One spouse handles guest communication and bookings (~80 hours/year).
- One spouse does most of the maintenance, supply runs, and seasonal projects (~120 hours/year).
- They have a cleaner who does turnovers (~50 hours/year).
- They have a bookkeeper who does monthly P&Ls (~12 hours/year).

Combined spouse hours: 200. Cleaner: 50. Bookkeeper: 12. The couple meets Test 3 easily (200 > 50 and 200 > 12, with combined hours over 100).

Now imagine the same family hires a property manager:

- Spouse hours combined: 50 (they let the PM handle most things).
- PM hours: 250.
- Cleaner: 50.
- Bookkeeper: 12.

The couple is at 50, the PM is at 250. They fail Test 3. They'd need to take more on themselves to qualify.

That's the practical structure of the test, and the practical lever you have to pull if you're not currently passing.

## What's next

You can pass material participation only if you can prove it. Chapter 5 covers documentation: the contemporaneous log that holds up under audit, the things that count and don't count, and what to do if you've gotten this far in the year without keeping records.

---

# Chapter 5 — Documenting hours the way an auditor wants to see it

You can pass material participation only if you can prove it.

Hour-tracking is the part of the loophole that gets the least attention and causes the most lost cases. Tax court has decided dozens of material participation disputes; in nearly all of them where the taxpayer lost, the issue was documentation. Not whether the hours actually happened. Whether they could be proven to have happened.

This chapter covers how to keep the records that survive challenge.

## The gold standard: contemporaneous logs

The IRS regulations give some flexibility on documentation. Treas. Reg. § 1.469-5T(f)(4) says hours can be established by "any reasonable means." That sounds permissive. In practice, the IRS interprets it strictly, and tax court interprets it more strictly still.

The phrase that comes up in case after case is "contemporaneous records." A contemporaneous record is one made at or near the time the activity took place — same day, ideally. A reconstruction made months later, even if accurate, is treated as less credible by default.

Here's the practical rule: log your hours within 24 hours of doing the work. Don't try to remember them at year-end. Don't reconstruct them when your CPA asks.

## What a good log entry looks like

A defensible log entry has five fields:

1. **Date.**
2. **Start and end time** (so an auditor can see the duration is realistic).
3. **Total duration.**
4. **Activity** — a short description of what you actually did.
5. **Business purpose** — why the activity was operational, not investor-style.

A sample entry done right:

> 2026-10-15 18:32–19:14 (0:42) — Responded to current guest about wifi reset; called Comcast to schedule tech visit before next reservation; updated check-in instructions in welcome email template. *Business purpose: guest support and operational maintenance for active and upcoming bookings.*

A sample entry done wrong:

> 10/15 — emailed guest

The second one is what most owners write. It tells an auditor nothing. The auditor doesn't know how long it took, what the email was about, whether it was operational or just answering a question about the local area, or whether it even relates to the property. They'll either ignore the entry entirely or apply a heavy haircut.

## Activity descriptions that survive a challenge

Some sample descriptions of activity that count, written in language that holds up:

- "Cleaned unit between guests: stripped beds, ran two loads laundry, vacuumed and mopped 1,400 sqft, restocked consumables, took out trash, reset Nest thermostat for next arrival."
- "Drove to property (round trip 22 miles, 38 min) to replace failed garbage disposal; parts $42 receipt attached."
- "Reviewed and approved cleaner's invoice for September turnovers ($420), reconciled to the calendar, posted to bookkeeping."
- "Photographed exterior with new fall foliage; updated 4 listing photos on Airbnb and Vrbo; rewrote the 'fall season' section of the listing description."
- "Coordinated with HVAC tech for annual furnace service; dispatched, was on-site for 1.5 hours during service, paid by card, filed receipt."

Notice the texture. Specific times. Specific work. Tangible artifacts (receipts, miles, photos) that an auditor can spot-check.

## What doesn't survive

Some descriptions that read fine in a log but get struck when reviewed:

- "Researched STR market in [city]" — investor activity, not operational.
- "Read book on Airbnb hosting" — education, not participation.
- "Reviewed Q3 P&L for property" — financial review, the kind an absentee owner would do.
- "Discussed property with my CPA" — investor activity.
- "Browsed Zillow for additional properties" — even if you're trying to expand the business, looking at *other* properties isn't participation in *this* activity.

The line between operational and investor is the line between "the work this property requires to function" and "the work I'd do if I were managing this property from a desk far away."

## Tools — pick one and never change it

There are three reasonable ways to keep a log:

1. **Spreadsheet.** Google Sheets or Excel, one row per entry, the five fields above as columns. The companion TAX-002 workbook has a hours-log tab set up for this. Spreadsheets are the most common choice and survive challenge fine.

2. **Time-tracking app.** Toggl, Clockify, Harvest. These are designed for billable hours and have nice timestamp precision. The exported reports look professional. The downside is that they don't capture business-purpose narrative as well as a spreadsheet — you have to use the description field thoughtfully.

3. **Paper calendar.** A physical calendar where you write down each work session. Old-fashioned but utterly defensible — paper is contemporaneous in a way digital can argue against ("you typed this last week and post-dated it"). The downside is no math, no exports, no easy spreadsheet.

Most of my readers use a Google Sheet kept open as a tab in their browser. Sessions get logged within a few hours of doing the work. Year-end, the sheet is exported and goes to the CPA.

The mistake to avoid: switching tools mid-year. A log that lives partly in Toggl, partly in Sheets, partly in a notebook is harder to defend than any one of them used consistently.

## Reconstructing hours after the fact

If you're reading this in November and realize you haven't been tracking, you have a problem — but not a fatal one.

Reconstruction is allowed under the "Cohan rule" (a 1930 case that lets taxpayers estimate where exact records are missing), but tax court has been increasingly strict about applying Cohan to material participation cases. Several recent decisions (Bailey, Madler, others) refused to allow reconstructed hours when the taxpayer had no contemporaneous records at all.

What's defensible reconstruction:

- **Calendar exports.** If your work pattern is captured in your calendar — guest check-ins logged, maintenance appointments scheduled, supply-run errands listed — pulling that data forward is reasonable.
- **Channel manager logs.** Most STR platforms timestamp every guest message. A export of your message thread, with timestamps, is contemporaneous evidence of the time spent on guest communication.
- **Bank and credit card statements.** Shopping trips for supplies, gas for property runs, payment to contractors — these date-stamp work that happened.
- **Photos with metadata.** Before/after photos taken during a turnover have an EXIF timestamp.

What's NOT defensible:

- Sitting down in December and writing "I think I did about 10 hours a week most weeks" with no underlying records.
- Estimates that aren't tied to any external data source.
- Round numbers (50 hours, 100 hours, 500 hours) without supporting detail.

If you've gone the year without records, the right move is to build the best reconstruction you can from external sources, document what you reconstructed and how, and start logging contemporaneously immediately. Don't claim hours you can't tie to evidence.

## The audit-prep binder

If you're ever audited specifically on the loophole — and the IRS has been actively auditing STR loophole claims since 2022 — you'll want to hand the auditor a binder, not a stack of receipts.

A good binder:

1. **Cover summary.** One page: total hours, breakdown by category (cleaning, guest comm, maintenance, marketing, admin), and your stated material participation test (Test 1, 2, or 3).
2. **The 7-day calculation.** A page showing your average period of customer use and how it was calculated, with the booking export attached.
3. **The hours log itself.** Sorted by date. Printed, but with a note that the original spreadsheet is also available.
4. **Supporting evidence.** Receipts, mileage logs, channel manager exports, photos with timestamps. Indexed to the log entries.
5. **Cost segregation report**, if applicable.
6. **The property's P&L.** From the companion workbook or your bookkeeping.
7. **A short narrative.** Two pages explaining the operation — how the property is run, who does what, and why your hours are operational rather than investor.

You should be able to assemble this binder from your records in two hours, not two weeks. If it would take two weeks, your records aren't ready.

## A note on AI-generated logs

A growing trend: owners using AI tools to generate plausible-looking log entries from rough notes. ChatGPT can produce a year of beautifully-written entries from a one-line prompt.

Don't.

If the entries weren't created contemporaneously, they're not contemporaneous — no matter how convincing the prose is. If discovered, fabricated logs aren't just a documentation problem; they expose you to fraud penalties under §6663, which start at 75% of underpayment and can include criminal liability. The risk-reward on this isn't even close.

The right way to use AI on documentation is the opposite: have it review your real, terse log entries and suggest where you've been too vague, or where an entry might be misclassified as investor activity. Use AI to improve real records, not to invent them.

## What's next

You've got the gateway test (Chapter 2), you've got the participation strategy (Chapter 4), and you've got the documentation system (this chapter). What you don't have yet is the lever that makes the year-one loss large enough to matter: cost segregation. That's Chapter 6.

---

# Chapter 6 — Cost segregation: when it's worth it on one property

The 7-day rule and material participation are the gates that let you take active losses. Cost segregation is the lever that makes those losses big enough to matter.

This is the chapter where the loophole stops being clever and starts being financially significant. Without cost seg, an STR loophole claim might save you $4,000 in a typical year. With it, the year-one savings on a $400,000 property can run $20,000 to $40,000 depending on your bracket and the bonus depreciation schedule.

## What cost segregation actually does

When you buy a residential rental property, the IRS lets you deduct depreciation — a portion of the building's value as an annual expense — on a 27.5-year straight-line schedule. So a $400,000 building (after subtracting land value) generates roughly $14,500 of depreciation expense per year for 27 years.

Cost segregation is a study that breaks the building into its component parts. The walls, roof, and structural elements stay on the 27.5-year schedule. But other parts of the property — appliances, fixtures, flooring, decorative woodwork, exterior landscaping, parking surfaces, fencing — are reclassified into shorter recovery periods.

The IRS recognizes four depreciation periods for typical components:

- **5-year property**: appliances, carpet, decorative lighting, computer equipment, certain fixtures.
- **7-year property**: furniture, fixtures, equipment.
- **15-year property**: land improvements like landscaping, paving, fencing, exterior lighting.
- **27.5-year property**: the building itself, structural elements, roofing, plumbing, electrical.

A typical STR cost seg study reclassifies 20–30% of the building's basis into the shorter-life buckets. On a $400,000 building basis, that's $80,000–$120,000 moved out of the 27.5-year category.

## Why this matters: bonus depreciation

The reclassification alone would just front-load depreciation slightly. The thing that makes cost seg explosive is bonus depreciation.

Bonus depreciation is a tax provision that lets you deduct, in the year placed in service, a percentage of the cost of qualifying property — anything with a recovery period of 20 years or less. That's the 5-, 7-, and 15-year buckets we just discussed.

The Tax Cuts and Jobs Act of 2017 set bonus depreciation at 100% for property placed in service from 2018 through 2022. Then it began phasing down:

| Tax year | Bonus depreciation |
|----------|-------------------:|
| 2023     | 80%                |
| 2024     | 60%                |
| 2025     | 40%                |
| 2026     | 40%* |
| 2027     | 20%                |
| 2028+    | 0% (under current law)  |

*The schedule has been actively debated in Congress. Several proposals to extend or restore 100% bonus have circulated; check current law before relying on the rate above for any planning year. As of this manual's update date, the 2026 rate is 40%.

So on the $80,000 of reclassified property in the example: at 40% bonus, you can deduct $32,000 in year one — on top of the regular depreciation that would have been there anyway. At 100% bonus (the rate that was in effect through 2022), it would have been $80,000.

This is why the loophole was much more dramatic in 2018–2022 than it is now, and why it's set to keep shrinking unless Congress changes the law.

## A worked example

Consider a $500,000 STR purchase. After land allocation (say 20% — varies by location), the building basis is $400,000.

Without cost seg: $400,000 ÷ 27.5 = $14,545 of annual depreciation, year after year.

With cost seg, assuming a 25% reclassification:

- $300,000 stays in the 27.5-year bucket → $10,909 annual depreciation.
- $100,000 moves to short-life buckets ($60,000 to 5-year, $20,000 to 7-year, $20,000 to 15-year is a common split).
- At 40% bonus depreciation (the 2026 rate), $40,000 of the $100,000 is deductible in year one as bonus.
- The remaining $60,000 of short-life property depreciates over its respective 5/7/15-year schedule, accelerating future-year deductions too.

Year-one depreciation: $10,909 (27.5-year on building) + $40,000 (bonus) + ~$8,000 (regular accelerated on the remaining short-life amounts after bonus) = roughly **$59,000**.

Compare to the $14,545 you'd have gotten without cost seg. That's $44,000 more in year-one deductions.

If your marginal tax rate is 32% federal + 5% state, $44,000 of additional deductions saves you about $16,000 in taxes the year you place the property in service.

Multiply that against the property's other operating losses (mortgage interest, property taxes, repairs, etc.), and the year-one tax savings can easily clear $20,000.

## What a study costs

There are three tiers of cost segregation study, each with different price points and different defensibility levels.

**Engineered study from a specialist firm.** The gold standard. An engineer or specialized accountant physically inspects the property, allocates basis based on construction documents and on-site evidence, and produces a detailed report with photos, measurements, and citations to relevant tax authority. Cost: $3,000–$8,000 for a single-family STR; more for multi-unit properties. These are highly defensible under audit.

**"Modeling" or "lookup table" studies.** Mid-tier providers use historical data on similar properties to allocate basis without a site visit. Cheaper — typically $1,500–$3,000 — and reasonably defensible if the methodology is documented. The risk is in the assumption that your property matches the firm's reference data.

**DIY tools and low-cost services.** Several online services and tax software products offer "automated" cost segregation for $400–$800. These are essentially heuristic allocations based on property type and basis. Tax court has accepted some of these in cases where the taxpayer can defend the methodology. They've rejected others where the methodology was opaque.

The right choice depends on the property's basis. Below $250,000 building basis, the cost of a fully engineered study eats too much of the benefit; mid-tier or low-cost is reasonable. Above $400,000, the engineered study pays for itself in audit defensibility alone.

## When cost seg pencils — and when it doesn't

Cost seg makes sense when:

- **Building basis is over $250,000.** Below that, the savings shrink and study costs become a meaningful drag.
- **Your marginal tax rate is 32% or higher** (federal). The deduction's value is the rate × the deduction. At lower brackets, the math gets less compelling.
- **You intend to hold the property for at least 5 years**, ideally longer. Recapture (covered below) hits harder if you sell soon.
- **You can pass the material participation tests** to use the active loss treatment. Without it, the cost seg expense generates a passive loss that suspends.

Cost seg doesn't pencil when:

- **Building basis is below $200,000.** The dollar value of the acceleration is too small relative to the study cost.
- **You're in a low marginal bracket** (12% or 22% federal).
- **You plan to sell or 1031 exchange within 2–3 years.** The gain on sale will be hit with depreciation recapture at ordinary rates.
- **You bought the property to hold long-term as an LTR** — the loophole's mechanics don't apply, and cost seg's only effect is to front-load depreciation you'd get anyway.

A practical rule of thumb: at a $400,000+ building basis with a 32% marginal rate and a 5+ year hold, the study returns 10x to 30x its cost in first-year tax savings.

## The recapture question

Cost seg accelerates depreciation. When you sell, the IRS recaptures the depreciation you've taken at ordinary rates (capped at 25% for the 27.5-year portion under §1250; up to your full ordinary rate for the 5/7/15-year portions under §1245).

This is the part where people panic. "Aren't I just paying it back?"

Mostly, no — for three reasons:

1. **Time value of money.** A deduction taken in 2026 that's recaptured in 2031 is still worth more than no deduction at all. If your discount rate is 7%, the present value of $40,000 saved in year one is significantly higher than $40,000 paid back in year five.

2. **Bracket arbitrage.** Many STR owners end up in lower marginal brackets in the year they sell — they retire, they have lower W-2 income, they take a sabbatical year. The deduction was at 32%; the recapture might be at 24%. That's a permanent savings.

3. **1031 exchange.** Like-kind exchanges defer the recapture indefinitely. Roll into the next STR; recapture moves with you and is finally settled when you eventually take a fully taxable sale (or, in the best case, your heirs inherit at stepped-up basis and the recapture vanishes entirely).

The recapture concern is real, but it's a reason to plan the eventual sale carefully — not a reason to pass on the cost seg in year one.

## Doing it later vs. doing it day one

You don't have to commission cost seg in the year you buy. The IRS allows a "look-back" study (using IRS Form 3115) that retroactively reclassifies basis on a property you've owned for several years, capturing all the missed depreciation in a single catch-up year.

When this matters: you bought a property in 2024 thinking it was a long-term rental, transitioned it to short-term in 2026, and now the loophole applies. A look-back study in 2026 captures the depreciation that should have been taken in 2024–2025 plus the year-one bonus depreciation.

The downside: look-back studies are more expensive than fresh ones (more analysis required) and the catch-up year creates an unusually large deduction that might trigger additional scrutiny.

For a property you're buying now with the loophole in mind, do the study in year one. The math is simpler and the audit story is cleaner.

## What's next

Cost segregation gives you the deduction. The next chapter — filing strategy — covers how to actually report it on your return without creating problems with the self-employment tax rules or the QBI deduction.

---

# Chapter 7 — Filing strategy: Schedule E vs. Schedule C

By now you understand the mechanics. This chapter is about how it actually shows up on your tax return.

The choice between Schedule E and Schedule C is the most common point of confusion in STR loophole filings — and the choice has real dollar consequences. Self-employment tax (15.3% on net profit) is a cliff that catches some filers who don't need to be on the wrong side of it.

## Schedule E — the default for most STR loophole filers

Schedule E is the form for "Supplemental Income and Loss from Rental Real Estate." It's where almost all rental property income and expenses get reported, including most STR loophole claims.

This sounds contradictory. We just spent four chapters establishing that an STR passing the 7-day test is *not* a rental activity. Why would we report it on the form for rental real estate?

The answer is that Schedule E and the IRS's Section 469 framework are not perfectly aligned. Schedule E is the reporting form for properties owned and rented to others. Section 469 is the framework for whether the resulting losses are passive or active. The two operate in parallel. You can report on Schedule E and still take the losses as active if you've established that the property is a trade or business and you materially participate.

In practice, most STR loophole filers:

1. Report income and expenses on Schedule E.
2. Mark the property as nonpassive (Schedule E has a column for material participation).
3. Allow the loss to flow through to Form 1040 as a deduction against other income.
4. Attach a statement (or have the CPA's software include it) documenting that the property's average period of customer use is 7 days or less and that the taxpayer materially participated.

This is the path most CPAs with STR experience take. It's well-established, it doesn't trigger self-employment tax, and it preserves the QBI deduction in cases where it applies.

## Schedule C — when it actually applies

Schedule C is for "Profit or Loss from Business." It applies to active businesses run for profit.

Some STR operators do file on Schedule C — specifically, operators whose business is so service-intensive that it stops looking like a rental and starts looking like a hotel.

The IRS's position, articulated in publications and informal guidance, is that an STR rises to the level of a Schedule C business when the operator provides "substantial services" beyond what a typical landlord provides. This is similar to (but not identical to) the "significant personal services" test from Chapter 3.

The practical hallmarks of a Schedule C STR:

- Daily housekeeping during guest stays.
- Hosted meals or breakfast service.
- Concierge or guest services beyond setup and turnover.
- A staffed property — front desk, on-site host, kitchen.

If your operation looks like a B&B or a small hotel, Schedule C is likely correct. If it's a self-check-in vacation rental with cleaning between guests, Schedule E is correct.

## Why the Schedule C path costs money

Schedule C income (net profit) is subject to self-employment tax — 15.3% on the first $168,600 (2025) of combined SE income, then 2.9% above that.

For an STR generating a year-one loss, this seems irrelevant — you're not paying SE tax on a loss. But the mechanics matter once the property turns profitable in years 2 or 3:

- Schedule E net rental income is *not* subject to SE tax.
- Schedule C net business income *is*.

A property generating $40,000 of net taxable income would owe roughly $5,650 in SE tax under Schedule C. Same property reporting under Schedule E owes nothing additional.

That difference compounds over a 10-year hold. The Schedule C structure is occasionally the right answer for genuine hotel-like operations, but it's the wrong answer for most loophole users.

## The 2021 IRS Chief Counsel Advice memo

In 2021, the IRS issued Chief Counsel Advice memo 202151005 addressing self-employment tax for short-term rental hosts. The memo took a relatively narrow position: a rental that provides only "incidental" services (like cleaning between guests) is not an SE-taxable trade or business.

This memo is not binding precedent — CCAs are guidance, not law — but it's been cited heavily by practitioners as confirming that typical Airbnb-style operations don't trigger SE tax.

The takeaway for filers: if your services don't go beyond what an Airbnb host typically provides, you have a strong basis to file on Schedule E and avoid SE tax. The IRS itself has signaled, in informal guidance, that this is the correct treatment.

## Entity considerations

People often ask whether an LLC, S-corp, or other entity affects the loophole. The short answer is: not directly. The mechanics of the loophole — 7-day rule, material participation, cost segregation, active loss treatment — work the same regardless of entity choice.

That said, entity choice has implications for liability, bookkeeping, and tax filing logistics:

**Sole proprietorship.** No entity at all. You own the property in your name and report on Schedule E. Cleanest from a tax-loophole standpoint, but offers no liability protection.

**Single-member LLC.** A "disregarded entity" for federal tax purposes. The LLC files no separate federal return; the property's income and expenses still go on your Schedule E. Provides liability protection without complicating tax filing. This is the most common structure for single-property STR owners.

**Multi-member LLC.** Files a Form 1065 partnership return; income and losses pass through to members on Schedule K-1. The K-1 then reports the loss on each member's individual Schedule E. The loophole still works; the filing just has an extra step.

**S-corporation election.** Rarely the right answer for a single STR. S-corps create complications around the loss treatment under the at-risk rules and basis limitations. They also limit when and how you can take cost segregation deductions. There are situations where an S-corp makes sense for a portfolio of rental properties run as a business (large operator with employees), but for a single STR, the S-corp election usually creates more problems than it solves.

The default recommendation for most readers: hold the property in a single-member LLC for liability, file on Schedule E. Get an attorney for the LLC formation; a CPA for the tax filings.

## The QBI deduction (Section 199A)

The Tax Cuts and Jobs Act of 2017 created a 20% deduction on qualified business income — the QBI deduction — that applies to pass-through business income. STR rentals can qualify if they rise to the level of a "trade or business."

The good news: an STR that meets the loophole criteria (7-day average, material participation) typically qualifies for QBI as well. The IRS's safe harbor under Rev. Proc. 2019-38 explicitly covers rental real estate that meets certain operational tests.

The deduction can be substantial. If your STR generates $30,000 of net taxable income in year three (after the loss-driven early years), QBI lets you deduct 20% of that — $6,000 — before calculating tax. At a 32% bracket, that's $1,920 of additional savings.

Important constraints:

- QBI is limited based on overall taxable income above certain thresholds ($383,900 for joint filers in 2024).
- Above the threshold, the deduction is limited to 50% of W-2 wages paid by the business or 25% of W-2 wages plus 2.5% of unadjusted basis. Single-property owners with no employees can hit this constraint.
- QBI does not apply to losses (you can't get a "negative deduction"). It only matters in profitable years.

For most STR loophole users, QBI is a nice tailwind in profitable years but doesn't change the year-one strategy.

## What this looks like in practice

A typical STR loophole filer's tax return:

1. **Schedule E** — reports the property income, expenses (including cost segregation depreciation), and shows a year-one loss of, say, $45,000.
2. **Form 4562** — depreciation detail, including bonus depreciation under §168(k).
3. **A statement attachment** — documenting the material participation test passed and the average customer use period.
4. **Form 1040** — the loss flows through to total income, reducing W-2 wages.

For a multi-property owner who's elected to aggregate, add Form 8825 (for rental real estate aggregation reporting) and Form 8810 (for passive activity limits, even though the loophole gets you out of them).

For a Schedule C filer (the rare hotel-like operator):

1. **Schedule C** — business income and expenses.
2. **Schedule SE** — self-employment tax calculation.
3. **Form 4562** — depreciation.

The Schedule C path is more complex and more expensive. For most readers, Schedule E is correct.

## What's next

You've got the rules, the documentation strategy, the deduction lever, and the filing approach. The next chapter is the most practical of all: the eight mistakes that draw IRS attention to a loophole filing and how to avoid each one.

---

# Chapter 8 — The eight mistakes that get returns flagged

The IRS has been actively auditing STR loophole claims since 2022. The pattern is consistent: most audited returns lose, not because the strategy doesn't work, but because the filer made one of a small number of recurring mistakes.

This chapter walks through the eight most common ones, what they look like, and what to do if you've already made them.

## Mistake 1 — No contemporaneous hours log

This is the single most common cause of lost cases. The owner did the work. The hours were real. They just didn't write them down at the time.

Tax court has been clear: reconstructed logs, even when accurate, are weighed less heavily than contemporaneous ones. In several recent decisions, courts have rejected reconstructed logs entirely when no underlying records (calendar, channel manager, receipts) supported the reconstruction.

**How to avoid it:** start logging today, no matter where you are in the year. The companion TAX-002 hours-log tab takes about 30 seconds per entry once you build the habit.

**If you've already done it:** reconstruct what you can from external evidence (calendar, message logs, receipts, photos with timestamps). Document the reconstruction methodology. Start contemporaneous logging immediately. Do not fabricate entries to fill gaps. A partial real log plus reconstructed evidence is better than a complete fake log.

## Mistake 2 — Counting investor activity hours

The participation test counts operational hours, not analytical ones. Reading reports, studying the market, attending real estate webinars, and reviewing your own performance reports do not count. The regulation explicitly excludes them.

This is the mistake that gets a log struck down line by line during an audit. The auditor reviews the entries, marks the investor-style ones, and recomputes your hours without them. The recomputation often falls below the participation threshold — and your active loss treatment vanishes.

**How to avoid it:** when logging, ask yourself whether the activity is something a remote/passive owner would do. If yes, it's investor work. If no, it's operational. "Reviewed Q3 P&L" — investor. "Reconciled the cleaner's invoice to the booking calendar and posted to QuickBooks" — operational, because the reconciliation is the kind of work an active operator does and the result feeds future operations.

**If you've already done it:** strip the investor entries from your log before you ever hand it to a CPA or auditor. Do this in the working spreadsheet, not by deletion — annotate them as excluded so you have a record of the audit-of-the-audit. Better to file with 130 defensible hours than 180 hours including 50 that get struck.

## Mistake 3 — Property manager logs more hours than the owner

If you've outsourced day-to-day operations to a property manager, the PM is almost certainly logging more hours than you on your property. They handle messaging, dispatch cleaners, coordinate maintenance, manage pricing, deal with guest issues. Their hours pile up.

Tests 2 and 3 (the practical material participation tests for STR owners) both fail when someone else's hours exceed yours. PM hours are the most common cause.

**How to avoid it:** before you commit to a PM, model the hours. If a typical PM contract has them doing 250+ hours/year on your property, you'd need to be doing more than 250 hours yourself to maintain Test 3 — which usually means the PM isn't actually saving you the time you hired them for.

**If you've already done it:** three options. First, take significant work back in-house — the high-touch parts you can do (guest communication, decisions on pricing, maintenance vendor selection) — and document those hours. Second, scope back the PM contract to a co-host model where they handle defined tasks rather than full operations. Third, accept that you don't qualify this year and use the suspended losses in a future year when your structure has changed.

## Mistake 4 — Cleaner hours exceed owner hours

A close cousin of Mistake 3. If your cleaner does 2 hours per turnover and you have 40 turnovers, that's 80 cleaner-hours. If you only logged 60 hours of operational time, your cleaner is doing more than you are.

This is most common with passive owners who let the operation run on autopilot — the cleaner shows up between guests, does the work, leaves. The owner barely touches the property.

**How to avoid it:** either do more operational work yourself, or do the cleaning yourself (which dramatically increases your hours). Self-cleaning is the single most reliable way to pass material participation as a single-property owner.

**If you've already done it:** review the actual cleaner hours carefully. Many cleaners log on-site time but you're charged for "service time" that includes travel and prep. The hours that count against you are the cleaner's actual hours of work on your property, not the hours you paid for. Reduce the comparison number where appropriate. If you still come up short, the structural fix is to do more work yourself going forward.

## Mistake 5 — Personal-use days exceeding the 14-day safe harbor

Section 280A says that if you use the property personally for more than 14 days (or more than 10% of total rental days, whichever is greater), the property gets reclassified as a "dwelling unit used as a residence" — and your deductions get capped at the rental income.

This mistake doesn't come from people abusing the rule. It comes from family vacations. A two-week trip to your STR property in the summer. A week at Christmas. A long weekend in March. The days add up.

**How to avoid it:** track your personal-use days the same way you track guest days. The companion workbook has a tab for this. Personal days include any day you stayed at the property for non-business reasons, regardless of whether it was rented or vacant.

**If you've already done it:** there's no fix once you're past 14 days for the year. The deduction cap kicks in. The right move is to plan future years more carefully and recognize that the loophole isn't available this year. (You can still use the property; you just can't claim losses against W-2 income for it.)

Note: days spent at the property doing repairs, maintenance, or other operational work do *not* count as personal-use days, even if you slept there. Document the work and keep receipts to support the business purpose of the visit.

## Mistake 6 — Failing the 7-day test by accepting a few longer bookings

The 7-day test averages across all bookings. Three monthly rentals during the off-season — even if the rest of your bookings are 2- to 4-night stays — can push your average over 7.

This mistake usually comes from owners trying to fill gaps. A 30-day rental in December feels like a win because it covers a month of mortgage payments. But it tips the year into Door-2 territory, and Door 2 doesn't apply to most operators (Chapter 3).

**How to avoid it:** monitor your year-to-date average stay quarterly. If it's creeping up, decline pending longer bookings and lean into shorter stays through dynamic pricing. The companion workbook has a tab that calculates YTD average from a CSV export.

**If you've already done it:** the year is the year. You can't undo bookings. Plan next year's mix more carefully. If most of your year would have qualified except for one outlier booking, document that and discuss with your CPA — there may be reasonable arguments to make, but they're not strong.

## Mistake 7 — Cost segregation without active participation status

You commissioned a $5,000 cost segregation study. It produced $80,000 of accelerated depreciation. You took the deduction.

But you don't materially participate. So the resulting loss is passive. It can only offset other passive income — and you don't have any. The loss suspends.

You've spent $5,000 on a study that, in this year, gets you nothing.

**How to avoid it:** before commissioning cost seg, confirm you'll pass material participation. If you're hiring out most of the work, model the hours first.

**If you've already done it:** the suspended loss isn't lost — it carries forward indefinitely and gets used when (a) you generate passive income from this or another property, or (b) you sell the property. So the cost seg study still has long-term value. But you're not getting the year-one tax savings you expected, and the study cost you out of pocket. Don't do it again next year unless you've fixed the participation problem.

## Mistake 8 — Buying a bad property purely for the tax loss

The most expensive mistake in the manual.

The loophole does not turn a money-losing property into a money-maker. It reduces your tax bill on a property you'd want to own anyway. If the property has bad fundamentals — overpriced, oversaturated market, declining ADR, regulatory uncertainty — the operating losses will dwarf the tax savings.

A typical example: a $500,000 STR in a saturated market that should have been bought for $375,000. The buyer overpays $125,000 because "the tax savings will make it work." Year-one tax savings: $25,000. Real economic loss from the overpayment: $125,000 of capital that won't return. The math doesn't work.

**How to avoid it:** evaluate the property as a business first. Run AirDNA comps, model the operating P&L, stress-test occupancy, check regulatory risk. Only after the property pencils as a standalone business should the tax savings enter the analysis.

**If you've already done it:** there's no easy fix. The right path is to either (a) operate the property aggressively to recover ground, or (b) take the loss and exit, recognizing that the tax savings on the way in were partially offset by the capital loss on the way out. Neither path is fun. The lesson is to apply the analysis before purchase, not after.

## What's next

These eight mistakes account for the majority of audited losses. Avoid them, document everything, and the loophole holds up. The next chapter — year-end checklist — gives you a single page of tasks to run before December 31 to make sure you're in clean shape for filing.

---

# Chapter 9 — Year-end checklist

A sequenced punch list to run between November 1 and your CPA handoff. Print this page. Cross items off as you complete them.

## November 1 — Hours log reconciliation

- [ ] Pull your full hours log year-to-date.
- [ ] Identify any gaps (missing weeks, suspicious blocks of zero hours).
- [ ] Cross-reference against your channel manager's message timestamps and your calendar — fill defensible gaps from these sources.
- [ ] Strike entries that look like investor activity. Annotate why each was excluded so you have a record.
- [ ] Calculate your YTD hours total. If you're below 100, you have two months to add real operational hours and get above the threshold for Test 3.

## November 15 — Receipt and expense audit

- [ ] Pull every receipt and bank/card statement related to the property.
- [ ] Classify each expense into the standard categories (cleaning, supplies, utilities, repairs, professional services, insurance, etc.).
- [ ] Reconcile classified expenses to your bank/card statements — every transaction either lands in the workbook or has a documented reason it doesn't (personal expense, reimbursed from guest, etc.).
- [ ] Identify any large repair-vs.-improvement disputes. Repairs are deductible in the year incurred; improvements are capitalized and depreciated. The line is fuzzy; document your reasoning for each major expenditure.

## November 30 — Mileage log finalization

- [ ] Compile every property-related drive: supply runs, maintenance trips, in-person guest support, materials pickup.
- [ ] Document date, mileage, and business purpose for each.
- [ ] At 67¢ per mile (2024 standard rate; check current rate), this is real money — a 30-mile-each-way property with 25 trips per year is over $1,000 of deductible expense.
- [ ] If you used a tracking app (MileIQ, Everlance), export the report. If not, reconstruct from calendar + receipts.

## December 1 — Owner-use day tally

- [ ] Count every day you (or family) stayed at the property for non-business reasons.
- [ ] Days spent doing maintenance, repairs, or other operational work don't count — but only if you can document the work.
- [ ] If you're at or above 14 personal days, you're in trouble for the year. Confirm with your CPA before taking any further action; the deduction cap may apply.
- [ ] If you're under 14 but close, plan December carefully. A casual long weekend at the property could push you over the line.

## December 15 — Average stay calculation

- [ ] Pull your booking export from Airbnb, Vrbo, and any direct-booking platform.
- [ ] Filter to bookings with check-in dates in the calendar year.
- [ ] Calculate: total rental days ÷ number of rental periods.
- [ ] Project to December 31 based on remaining confirmed bookings.
- [ ] If your projected year-end average is 7.0 or under, you're inside Door 1. If it's between 7.0 and 7.5, decline any pending longer bookings to preserve the margin. If you're over 7.5, the 7-day door is closed for the year.

## December 15 — Cost seg study deadline (if applicable)

- [ ] If you're commissioning a cost seg study for this year, the study must be completed before you file your return — but commission it by December 15 to give the firm time to deliver in January.
- [ ] If this is your first year owning the property, prioritize an engineered study over a low-cost one. The audit defensibility matters more in year one than later.
- [ ] If you're considering a look-back study (Form 3115) on a property you've owned for several years, get this in motion in November — the analysis takes longer.

## December 31 — Estimated tax payment review

- [ ] Estimate your year-end taxable income with the loophole's loss factored in.
- [ ] If you've over-paid estimated taxes during the year (assuming no loss), you may be due a refund. Don't worry — the refund happens at filing, not now.
- [ ] If you've under-paid (rare for loophole filers but possible), make a Q4 estimated payment by January 15 to avoid underpayment penalty.

## January 5 — CPA handoff package

A single PDF binder, in this order, sent to your CPA:

- [ ] Cover summary page (one page): the four key numbers — total hours, average stay, gross income, net loss before depreciation.
- [ ] The hours log, sorted by date.
- [ ] Booking export with average-stay calculation summary.
- [ ] P&L from the companion workbook (income, expenses, depreciation breakdown).
- [ ] Cost seg report, if applicable.
- [ ] Personal-use day tally with supporting documentation.
- [ ] Mileage log.
- [ ] Receipt index (you don't need to send every receipt unless asked, but you should have them organized).
- [ ] Any state-specific occupancy or lodging tax filings or payments.

The cleaner the handoff, the lower your CPA's bill — and the lower the chance of a filing error. A good handoff package usually saves 2–4 hours of CPA time, which at typical rates is $400–$800 in your pocket.

## January 15 — Q4 estimated tax payment

- [ ] Pay any Q4 estimated tax due based on your year-end estimate.
- [ ] If you over-paid Q1–Q3 because you didn't account for the loophole loss, you can leave Q4 at zero or minimal.

## State and local — ongoing

- [ ] Confirm occupancy/lodging tax filings are current for your state and city.
- [ ] Confirm STR registration/permit is current and won't lapse.
- [ ] Note any state-level depreciation differences your CPA will need to handle (some states don't conform to federal bonus depreciation).

## What's next

The final chapter walks through the companion P&L workbook end-to-end, tab by tab, so you can build a clean filing package alongside the rules you've now learned.

---

# Chapter 10 — Companion workbook walkthrough

The companion to this manual is the TAX-002 P&L Single Property Workbook — an Excel file built around the rules in the previous nine chapters. It's not required to use the strategy. But the workbook handles a year's worth of bookkeeping in roughly 90 minutes if you've kept reasonable records, and produces output your CPA can drop straight into your return.

This chapter walks through each tab in the order you'll use it. Open the workbook alongside the manual.

## Tab 1 — Setup

The first tab captures property details that flow into every other calculation:

- **Property name and address.** For your reference; not used in math.
- **Purchase date and in-service date.** The in-service date is what matters for depreciation start. They're often the same but not always — a property purchased in November but not rented until January starts depreciating in January.
- **Total purchase price.** Includes the building, land, and any directly-attributable closing costs (title insurance, attorney fees, surveys). Not included: financing costs, points, and other items that get separately amortized.
- **Land allocation.** The portion of purchase price allocated to land — typically 15–25%, varying by location. Land doesn't depreciate. The cleanest source for the allocation is the county assessor's records; alternatively, an appraisal can split land/building.
- **Building basis.** Calculated as purchase price minus land allocation. This is the number that drives depreciation.
- **Ownership percentage.** Defaults to 100%. If you co-own with a non-spouse, your share goes here.
- **Fiscal year.** Most owners use calendar year; the workbook supports fiscal year for owners with unusual structures.

Two error checks the workbook runs on this tab:

- Land allocation that's far outside the 10–35% range produces a warning. Either you have an unusual property (urban high-rise, rural land-heavy) or you've made an error.
- An in-service date that's after the first rental booking date triggers a question — typically the in-service date should be on or before the first booking.

## Tab 2 — Income

This is where you record what came in.

The structure is monthly-by-category:

- **Gross booking revenue.** What guests paid for the rental itself.
- **Cleaning fees collected.** What guests paid for cleaning, separate from the rental rate.
- **Other guest fees.** Pet fees, late check-out fees, damage deposits forfeited.
- **Occupancy/lodging tax collected.** Money the platform collected on behalf of the city/state. Critical: this is *not* your income. It's pass-through. Many DIY filers double-count this and inflate their income artificially.
- **Refunds and chargebacks issued.** Negative entries reducing gross income.

A common confusion: Airbnb and Vrbo's payout reports often combine all of the above into a single number. The workbook has an import macro that takes the platform's CSV export and breaks it into the right categories. If you're doing it manually, watch for duplicate counting of cleaning fees (already in gross) and occupancy tax (not your income).

## Tab 3 — Expenses

The workbook uses 27 standard expense categories chosen to map cleanly to Schedule E line items. Major buckets:

- **Cleaning and turnover** — paid cleaners, supplies, laundry service.
- **Utilities** — electricity, gas, water, internet, cable, trash.
- **Repairs and maintenance** — anything that restores the property to working condition without materially improving it. The HVAC service call is here. The new HVAC system is in depreciation, not here.
- **Supplies** — consumables provided to guests (toilet paper, soap, coffee, paper towels). The line between supplies and cleaning is fuzzy; pick one and be consistent.
- **Insurance** — property insurance, STR-specific liability rider, umbrella.
- **Property tax** — state and local property taxes paid this year.
- **Mortgage interest** — interest only, not principal. Pull from your year-end Form 1098.
- **HOA/COA fees** — homeowner association dues if applicable.
- **Marketing** — paid ads, listing photographer, professional copy, channel manager subscription.
- **Software and subscriptions** — pricing tools (PriceLabs, Wheelhouse, Beyond), guest message automation (Hospitable, Hostaway), bookkeeping (QuickBooks).
- **Professional services** — CPA fees for property work, attorney fees for property issues, bookkeeper.
- **Travel and mileage** — your trips to the property for operational purposes (not personal stays). Mileage at the standard rate plus tolls and parking.
- **Bank fees and merchant processing** — Stripe fees if you take direct bookings, ATM fees for the property's account, account maintenance.
- **Licenses and permits** — STR registration, business licenses, occupancy permit fees.
- **Office supplies, postage, etc.** — minor categories.

The workbook flags expenses that look unusual: a category that's 3+ standard deviations from typical for the property's size, an expense in a typically-empty category, a large round-number expense that might be a placeholder. These flags are warnings, not errors — review and confirm.

## Tab 4 — Depreciation

This is the tab where cost segregation lives, if applicable.

**Without cost seg:** the tab takes the building basis from Setup and applies a 27.5-year straight-line depreciation. Year-one depreciation is the basis × (1/27.5) × the proration factor for partial-year placement.

**With cost seg:** the tab takes a five-bucket allocation:
- 5-year property (appliances, carpet, fixtures)
- 7-year property (furniture, equipment)
- 15-year property (land improvements)
- 27.5-year property (building structure)
- Land (no depreciation)

For each bucket, the workbook applies:
- The correct recovery period.
- Bonus depreciation at the year's percentage (40% for 2026 unless current law changes).
- The half-year or mid-quarter convention based on your placement timing.

Output: total depreciation expense for the year, broken down by bucket and by regular-vs-bonus.

If you're entering numbers from a cost seg study, the study report will list each bucket. Type the dollar amounts directly into the appropriate cells and the workbook handles the rest.

## Tab 5 — Hours log

The contemporaneous log discussed in Chapter 5 lives here. Five columns:

- Date
- Start time
- End time
- Activity (free text, 200 character limit to encourage specificity)
- Business purpose (free text, 100 character limit)

The workbook calculates duration automatically and produces month-end summaries.

There's also a "contributor" column for tracking other people's hours: cleaner hours (typically logged from invoices), spouse hours (which combine with yours), and any other workers (cohost, contractor) whose hours are relevant for the participation tests.

The participation tests run automatically based on the data here. The output cell at the bottom of the tab shows: "PASSING TEST 3 — 184 hours operational; cleaner 38; spouse 0; no other contributor exceeds your hours" or, if appropriate, "FAILING — cleaner hours (220) exceed yours (180); see Chapter 4 for paths."

## Tab 6 — Year-end summary

The four numbers your CPA actually wants, on one page:

1. **Net taxable income (or loss)** — gross income minus operating expenses minus depreciation.
2. **Average period of customer use** — the 7-day test result, with a green/red pass/fail flag.
3. **Material participation status** — which test you passed (or failed) and the supporting hours.
4. **Personal-use days** — your total, with a flag if you're at or near the 14-day cap.

Below those, a one-line summary of any error or warning the workbook detected during your data entry. If the workbook is clean, this section is empty.

## Tab 7 — CPA handoff

A pre-formatted page suitable for printing or PDF export, containing:

- Property identification (name, address, basis)
- The four key numbers from Tab 6
- The full hours log
- The full income/expense detail
- The depreciation breakdown
- A signature block where you attest the data is accurate

This is what you send to your CPA at year-end. Print to PDF, attach to the email, done.

## Common errors the workbook catches

- Land allocation outside reasonable range.
- Income categories that double-count occupancy tax.
- Expenses that should be capitalized rather than deducted (large repairs that look like improvements).
- Depreciation calculations that don't match the building basis (entering cost seg numbers that exceed the basis).
- Hours log entries that look like investor activity (the workbook flags entries containing keywords like "researched," "reviewed P&L," "looked at" — these aren't always wrong but they're worth re-examining).
- Personal-use days exceeding 14.
- Material participation tests failing.

The flags are warnings, not blockers. You can override any of them. But override means write a comment explaining why — so when you come back to the file in March, or your CPA asks, you remember.

## Back-porting last year's numbers

If you're catching up on prior years (a property you've owned but haven't formally tracked), the workbook supports retroactive entry. You'll need:

- Bank statements for the property year.
- Channel manager exports.
- Receipts (paper or digital).
- Whatever scraps of evidence you have for hours.

For prior years, do not invent hours you can't tie to evidence. The look-back analysis is most useful for proving income and expenses; hours should be reconstructed only from external sources (calendars, message logs, receipts) and explicitly noted as reconstructed.

If you discover the prior year would have qualified for the loophole and you didn't claim it, talk to your CPA about amending the return. Form 1040-X amends prior-year returns for up to three years after the original due date. Cost seg studies done as look-backs (using Form 3115) capture missed depreciation in a single catch-up year.

## What you have now

Ten chapters. Three tests passed (7-day, material participation, personal-use). One workbook ready to fill in. A documentation system that holds up under audit. A handoff package your CPA will thank you for.

The strategy isn't complicated — it's a definitional carve-out from a 1986 tax code that the IRS has acknowledged for decades. Most of the work is in the documentation and the discipline. Now that you have those, the next step is to actually run it.

Block 90 minutes this weekend. Open the companion workbook. Fill in Setup. Pull your booking and expense data. Catch up the hours log to today. Project to December 31. See where you land.

If you have questions or hit something the manual didn't anticipate, hit reply on any STR Manuals email — it goes to a human, and the next version of the manual gets sharper because of those questions.

Good filing.

— Daniel

---

# Glossary

**Active activity.** A trade or business in which the taxpayer materially participates. Losses from active activities can offset other ordinary income, including W-2 wages.

**Average period of customer use.** The arithmetic average of stay lengths across all rental periods in a tax year, calculated as total rental days divided by number of rental periods. The threshold for the STR carve-out is 7 days or fewer.

**Bonus depreciation.** A federal tax provision allowing a percentage of the cost of qualifying property (with recovery periods of 20 years or less) to be deducted in the year placed in service rather than over the property's recovery period. Phasing down: 40% in 2026, 20% in 2027, 0% in 2028 under current law.

**Cost segregation.** A study that allocates portions of a building's basis to shorter-life property categories (5, 7, and 15 years) rather than the default 27.5 years for residential rental property. Combined with bonus depreciation, it accelerates year-one deductions significantly.

**Door 1 / Door 2.** Informal terms for the two paths into the STR rental-activity carve-out. Door 1: average period of customer use ≤ 7 days. Door 2: average ≤ 30 days with significant personal services. Most STR operators qualify under Door 1.

**Material participation.** Regular, continuous, and substantial involvement in an activity. The IRS defines it via seven specific tests in Treas. Reg. § 1.469-5T. Passing any one test qualifies.

**Passive activity.** Under Section 469, a trade or business in which the taxpayer does not materially participate. Losses from passive activities can only offset income from other passive activities; they cannot offset wages or active business income.

**Passive activity loss (PAL) rules.** The framework, codified in Section 469, that classifies trade or business activities as passive or active and limits how losses can be used. The STR loophole is a path out of these rules for short-term rentals.

**Personal use day.** A day when the taxpayer (or family member) stayed at the property for non-business reasons. More than 14 days of personal use in a year (or 10% of total rental days, whichever is greater) caps deductions at rental income under Section 280A.

**Real estate professional (REP).** A taxpayer who spends more than 750 hours per year and more than half of all working hours on real estate activities. REP status removes the passive activity classification from rental real estate. Distinct from the STR loophole, which doesn't require REP.

**Recapture.** When a property is sold at a gain, depreciation previously taken is "recaptured" and taxed at ordinary rates (capped at 25% under §1250 for real property; up to full ordinary rate under §1245 for personal property).

**Rental activity.** Under Section 469, the default classification for rental real estate. Subject to special restrictive rules. The STR carve-out establishes that short-term rentals are NOT rental activities — they're trade or business activities.

**Schedule C.** Form for "Profit or Loss from Business." Used by sole proprietors operating an active trade or business. STR operators with substantial services (B&Bs, hotels) file here. Subject to self-employment tax.

**Schedule E.** Form for "Supplemental Income and Loss from Rental Real Estate." Used by most STR loophole filers. Not subject to self-employment tax.

**Section 280A.** The tax code section that limits deductions on a "dwelling unit used as a residence" — defined as a property used personally for more than 14 days or 10% of rental days, whichever is greater. Triggering 280A caps deductions at rental income.

**Section 469.** The Passive Activity Loss rules. The framework that classifies activities as passive or active and limits deductibility of passive losses.

**Significant personal services.** Services rendered to a guest *during* their stay (daily housekeeping, hosted meals, concierge), as opposed to services rendered to make the property available for rental (turnover cleaning, supply restocking). Triggers Door 2 of the STR carve-out when present with a 30-day-or-less average stay.

**Substantially all participation.** A material participation test (Test 2 in the regulations) where the taxpayer's hours represent essentially all hours spent on the activity by anyone. Generally interpreted as 95%+ by tax court.

**Suspended loss.** A passive activity loss that cannot be deducted in the current year. Carries forward indefinitely until offset by passive income or until the property is sold in a fully taxable disposition.

---

# Recommended reading and sources

## IRS publications

- **Publication 527** — Residential Rental Property. The IRS's plain-English treatment of rental rules. Covers depreciation, deductible expenses, and personal-use rules. Updated annually.
- **Publication 925** — Passive Activity and At-Risk Rules. The detailed treatment of Section 469 and material participation. Denser reading; useful as reference.
- **Publication 946** — How to Depreciate Property. Comprehensive depreciation reference, including bonus depreciation and the recovery period tables.

## Treasury regulations and tax code

- **Treas. Reg. § 1.469-1T(e)(3)(ii)** — the 7-day and 30-day carve-outs from rental activity classification.
- **Treas. Reg. § 1.469-5T** — the seven material participation tests.
- **Treas. Reg. § 1.469-9** — grouping and aggregation rules for real estate activities.
- **Internal Revenue Code § 280A** — personal-use limitations on deductibility.
- **Internal Revenue Code § 469** — passive activity loss framework.
- **Internal Revenue Code § 168(k)** — bonus depreciation.

## Tax court decisions worth knowing

These are illustrative — they show how courts have handled disputes around documentation and material participation. They are not binding precedent for your situation, but they show what wins and what loses.

- **Bartlett v. Commissioner** (T.C. Memo 2009-14) — early STR-style material participation case turning on documentation quality.
- **Mowafi v. Commissioner** (T.C. Memo 2001-111) — material participation rejected for lack of contemporaneous records.
- **Bailey v. Commissioner** (T.C. Memo 2001-296) — reconstructed log rejected; underscores the contemporaneous standard.
- **Hakkak v. Commissioner** (T.C. Memo 2020-46) — short-term rental with material participation upheld; documentation was thorough.

## IRS guidance

- **Chief Counsel Advice 202151005** — informal IRS guidance on self-employment tax treatment of short-term rentals.
- **Revenue Procedure 2019-38** — safe harbor for QBI deduction on rental real estate.

---

# Update log

**Version 1.0 — 2026 edition.** Initial release. Bonus depreciation phase-down through 2028 documented. Reflects Tax Cuts and Jobs Act and pre-2026 Treasury guidance.

Buyers receive free updates within v1 (annual edition refreshes for tax law changes that affect the strategy). Major rewrites that change the strategy substantially are versioned (v2.0+) and may be a separate purchase.

To check the version of your copy, see the cover page footer.

---

# About Daniel

Daniel Harrison runs a short-term rental in the western US and writes plain-English guides for STR owners at strmanuals.com. He's been operating STRs since 2019 and has navigated the loophole — through cost seg, audits in his network, and the bonus depreciation phase-down — alongside the readers this manual is written for.

He's not a CPA. This manual is the result of years of conversations with practitioners who specialize in real estate taxation, plus the underlying regulations and case law. Where the manual takes a position, it's because the position is consistent with current law and the practitioner consensus. Where there's genuine ambiguity, the manual flags it and points you to a CPA.

You can reach him by replying to any STR Manuals email — replies go to a human. The next version of the manual gets sharper because of reader questions.

If this manual saved you more than $29, the highest-leverage thank-you is a referral. Forward strmanuals.com to one host who'd benefit. That's how this gets to the next person who needs it.

— Daniel
STR Manuals · 2026

---

*Final disclaimer: This manual is plain-English education, not tax or legal advice. Every taxpayer's situation differs. Consult a qualified CPA before making filings or financial decisions based on its content. Prices, rules, and rates referenced are current as of the manual's update date and subject to change.*

---

# Recommended reading + sources

- IRS Publication 527 — Residential Rental Property
- IRS Publication 925 — Passive Activity and At-Risk Rules
- Treasury Regulation § 1.469-1T(e)(3)(ii) — the 7-day carve-out
- Treasury Regulation § 1.469-5T — material participation tests
- TC Memo and tax court decisions cited where relevant

---

# About Daniel

*[draft pending — short bio + how to get in touch]*
