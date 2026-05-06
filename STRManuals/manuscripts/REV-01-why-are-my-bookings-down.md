# REV-01 — Why Are My Bookings Down? Diagnostic

**Working manuscript.** Long-form markdown for authoring. Final designed PDF lives at `private/manuals/why-bookings-down/v1.pdf` (uploaded via SFTP to Hostinger).

**Author:** Daniel Harrison
**Target length:** 28 pages (~8,500 words)
**Reading level:** plain English
**Companion:** Break-Even Occupancy Workbook (Excel)

---

## Disclaimer

This manual is operational guidance for short-term rental owners trying to diagnose declining bookings. It is not investment, tax, or legal advice. Every market is different. Use the diagnostic frameworks here as starting points; combine them with local knowledge and platform-specific data.

The manual references specific platforms (Airbnb, Vrbo, AirDNA, PriceLabs) as illustrative examples. Tools and dashboards change — verify current functionality before relying on screenshots or terminology that may have evolved since publication.

---

## Front matter

- **Title page** with cover (REV-01 · Why Are My Bookings Down?)
- **Copyright + disclaimer page**
- **About this manual** (½ page)
- **Table of contents** (1 page)

---

## Chapter outline

| # | Title | ~Pages | Purpose |
|---|-------|--------|---------|
| 1 | The panic problem | 2 | Why hosts change five things at once and make it worse. |
| 2 | The four real causes, in 60 seconds | 3 | Pricing, listing quality, algorithm, market — how to tell them apart. |
| 3 | Reading your data | 4 | Impressions, views, conversion rates — what each one means. |
| 4 | The pricing diagnostic | 4 | When pricing is the problem and how to confirm it. |
| 5 | The listing-quality diagnostic | 4 | Photos, description, amenities — the audit playbook. |
| 6 | The algorithm-penalty diagnostic | 3 | Cancellations, response rate, Superhost loss — what triggers shadow-throttling. |
| 7 | The market-saturation diagnostic | 3 | When the answer is "your whole market is down." |
| 8 | The one-week recovery plan | 4 | Day-by-day playbook to act on the diagnosis. |

**Back matter:**
- The "new listing" appendix (1 page)
- The "Vrbo-specific" appendix (½ page)
- Glossary (½ page)
- About Daniel (½ page)

---

# Chapter 1 — The panic problem

Your bookings are down.

Maybe it's been a slow month. Maybe it's been a slow quarter. Maybe last year you were 78% occupied and this year you're at 54% with December staring you down. You've watched the calendar turn from green to white over the past few weeks and you're starting to wonder whether you're losing money on this property.

You're not alone. Most STR hosts hit this moment at least once. For some, it's a temporary blip. For others, it's the start of a real problem — a market shift, a listing that's gone stale, a quiet algorithmic penalty.

The instinct, when this hits, is to change five things at once. Drop the price. Take new photos. Buy boost on Airbnb. Re-write the description. Add three new amenities. The instinct is wrong, and changing five things at once almost always makes the situation worse — not because the changes themselves are bad, but because you can no longer tell which ones helped.

This manual is the diagnostic that comes *before* you change anything.

## What this manual is

Short-term rental performance has four major drivers. Almost every booking decline is explained by one of them — sometimes two, rarely more. The four:

1. **Pricing.** Your nightly rate is too high relative to comparable properties or what the market will bear right now.
2. **Listing quality.** Your photos, description, or amenity loadout isn't competitive enough to convert searchers into bookers.
3. **Algorithm.** The platform (Airbnb or Vrbo) is showing your listing less prominently than before — usually because of a metric change you may not realize triggered it.
4. **Market.** Your entire market is down. Demand has dropped, supply has grown, or both.

The diagnostic in this manual walks you through how to determine which of these is your real problem before you take action. The recovery for each is different — sometimes opposite. Drop your prices when the issue is listing quality and you'll bleed margin without recovering bookings. Rewrite the listing when the issue is pricing and you'll waste a weekend on cosmetics that don't move the needle.

## What this manual isn't

This isn't a guide to building a great STR from scratch. It assumes you already have a property running and that your bookings have *changed* — gone from acceptable to bad, or from great to acceptable. The diagnostic is about identifying what shifted and acting on it.

It also isn't a comprehensive marketing manual. There's a separate manual on direct bookings (REV-02) for hosts ready to reduce their OTA dependence. This one is focused on the OTA channels you're already on.

## How to use this manual

Read chapters 1–3 straight through. They give you the framework and the data you need to read.

Then read the chapter on whichever diagnostic seems most relevant first. If you're not sure, read them in order — pricing, listing quality, algorithm, market. Each chapter ends with a "this is your problem if..." summary.

Then go to chapter 8 — the one-week recovery plan — which is the day-by-day playbook for whichever diagnosis you've reached.

The companion break-even occupancy workbook ties to chapter 7 — it tells you how low your occupancy can go before the property stops paying for itself, which is the most important number to know during a downturn.

## A note on time horizons

If your bookings have been down for one weekend, that's noise. Don't act.

If they've been down for one month, that's worth paying attention to but might still be temporary.

If they've been down for two months in your peak season, or three months in a shoulder season, that's a real signal worth diagnosing.

This manual is for the second and third cases. The first case — one bad weekend — almost never has a single explainable cause and reacting to it usually creates more problems than it solves. Hold steady.

---

# Chapter 2 — The four real causes, in 60 seconds

Before we go deep on each diagnostic, here's the 60-second version of all four.

## Cause 1: Pricing

You're priced too high. Either absolutely (above what a typical guest will pay for what your property offers) or relative to comparable properties in your market that have lowered prices recently.

**Tell-tale signs:**

- Your search impressions are normal but your views are below average.
- Your views are normal but your conversion to bookings is below average.
- Your competitors' calendars show more booked dates than yours.
- Your year-over-year occupancy at the same nightly rate is significantly lower.
- You've been holding pricing static while the market has softened.

**Most common fix:** lower base rates 8–15% on the dates that aren't booking; let the dynamic pricing tool (PriceLabs, Wheelhouse, Beyond) take it from there.

## Cause 2: Listing quality

Your photos aren't drawing clicks. Your description doesn't sell the experience. Your amenity list is missing things competitors offer. Or all three.

**Tell-tale signs:**

- Your search impressions are normal but few searchers click your listing.
- Your listing's "click-through rate" or equivalent metric is below average for your market.
- Your photos are 2+ years old or look amateur compared to top competitors.
- Your description is generic or doesn't differentiate the property.
- You're missing 2+ amenities that all top-performing competitors in your market offer.

**Most common fix:** professional photos, fresh description, and a 2–4 amenity upgrade.

## Cause 3: Algorithm

Airbnb or Vrbo is showing your listing less prominently. Usually because of a metric change: your response rate dropped below 90%, you canceled a booking, your review average fell below 4.6, you lost Superhost, or you accepted few-enough new bookings that the algorithm deprioritized you.

**Tell-tale signs:**

- Your search impressions specifically have dropped.
- The drop coincided with a known event: a cancellation, a bad review, a change in your acceptance rate, a Superhost evaluation period.
- Year-over-year search impressions in your market are flat or up, but yours specifically are down.
- Your "search ranking" (where Airbnb shows your listing for relevant searches) has dropped.

**Most common fix:** reverse the trigger — improve response time, accept more bookings, address the bad review, regain Superhost.

## Cause 4: Market saturation or demand drop

The entire market is down. New supply has come on. Demand has shifted. You're not the problem; the market is.

**Tell-tale signs:**

- Talked to other hosts in your market and they're seeing similar drops.
- AirDNA or Key Data shows market-wide ADR or occupancy declines.
- New listings in your market have grown materially in the last 12–24 months.
- A specific demand source (a conference, a sport, a school event) has changed.
- You're losing both views and conversion at similar rates — meaning fewer searchers and fewer bookers.

**Most common fix:** can't fix the market. The fix is to be the property in your market that survives — by being priced sharper, marketed better, or scaled down to match new demand.

## How to tell them apart

The four causes have different fingerprints in your data:

| | Impressions | Views | Conversion |
|---|---|---|---|
| Pricing problem | Normal | Normal or low | Low |
| Listing-quality problem | Normal | Low | Normal |
| Algorithm problem | Low | Low | Normal |
| Market problem | Low | Low | Low |

The next chapter walks you through reading these three numbers from your platform's dashboard.

---

# Chapter 3 — Reading your data

Three numbers tell you most of what you need to know about why your bookings are down. Almost every host has access to all three. Almost no host knows where they live in the dashboard.

This chapter is a tour.

## Impressions

**What it is:** the number of times your listing showed up in someone's search results.

**Why it matters:** impressions are the top of the funnel. If guests aren't seeing your listing, nothing else you do — better photos, better description, better pricing — can save you. They can't book what they can't see.

**Where to find it on Airbnb:** Performance → Conversion → "Listing impressions" with date filter. Compare to year-over-year to spot algorithmic shifts.

**Where to find it on Vrbo:** Analytics → Listing performance → "Search appearances."

**What's normal:** depends entirely on your market. Compare to your own historical data, not to absolute numbers. A property that did 12,000 impressions in October last year and 4,000 this October has a real problem. A property that did 4,000 impressions in October last year and 4,000 this October is on plan.

**What it tells you:** if impressions are *down* compared to last year, the algorithm or the market is the issue (Cause 3 or 4). If impressions are flat but bookings are down, the issue is downstream (Cause 1 or 2).

## Views

**What it is:** the number of times someone clicked your listing to look at the details.

**Why it matters:** views are the conversion of impressions. They tell you whether your search-result tile (cover photo, title, price) is compelling enough to attract a click.

**Where to find it on Airbnb:** Performance → Conversion → "Listing views" or similar.

**Where to find it on Vrbo:** Analytics → Listing performance → "Listing visits."

**What's normal:** typical view rate is 3–8% of impressions. So 10,000 impressions producing 500 views is in the normal range. Significantly below means your search-tile presentation isn't converting.

**What it tells you:** if impressions are normal but views are down, your listing's first impression is the problem — usually photos or pricing visible in search results. A common low-conversion pattern: gorgeous interior photos but a forgettable cover photo, or a price that's visibly higher than comparable listings appearing alongside yours.

## Conversion (views → bookings)

**What it is:** of guests who clicked through to your listing, how many actually booked.

**Why it matters:** conversion is where the listing detail closes the sale. If guests are looking at your listing but not booking, something on the listing detail page is failing — usually price, listing description, reviews, or amenities.

**Where to find it on Airbnb:** Performance → Conversion → "View-to-book conversion" or similar.

**Where to find it on Vrbo:** Analytics → "Conversion rate."

**What's normal:** conversion rates vary widely by market and property type. Typical ranges are 1.5–5% for view-to-book on Airbnb. A 4% conversion is solid; below 2% is suspicious.

**What it tells you:** if views are normal but conversion is down, the issue is on the listing page — guests are looking and deciding "no." This is most often pricing relative to perceived value. Less commonly, it's reviews (a string of negative ones), amenities (missing things competitors have), or location communication issues.

## Reading the three together

Pull your three numbers for the last 90 days, and the same three numbers for the same period last year. Build a quick comparison table:

| Metric | This year (last 90d) | Last year (same 90d) | Change |
|---|---|---|---|
| Impressions | | | |
| Views | | | |
| Conversion % | | | |
| Bookings | | | |

The pattern in the change column is your diagnosis pointer:

- **Bookings down, impressions normal, views and conversion both down:** likely listing-quality problem with a pricing layer.
- **Bookings down, impressions and views normal, conversion only down:** clearly a pricing or listing-page problem (guests interested enough to click but not to book).
- **Bookings down, impressions down significantly, views and conversion proportionally down:** likely algorithm or market problem.
- **Bookings down, impressions normal, views down, conversion normal:** classic "your listing tile isn't competitive" — usually cover photo or visible price.

The next four chapters walk through each diagnostic in detail.

## Quick test before continuing

Pull your dashboard now. Get the four numbers (impressions, views, conversion %, bookings) for last 90 days versus the same period last year. If your platform doesn't make 90-day comparisons easy, do month-by-month for September, October, November.

You'll come back to these numbers throughout the remaining chapters. Have them in front of you.

---

# Chapter 4 — The pricing diagnostic

Pricing is the most-cited explanation for booking declines and the most-common actual cause. It's also the area where hosts make the worst decisions, because dropping prices feels productive even when the underlying problem isn't price.

This chapter is about figuring out whether you actually have a pricing problem.

## The pricing problem fingerprint

A pricing problem has a specific signature in your data:

- **Impressions:** normal or up. (You're showing up in searches; the algorithm isn't penalizing you.)
- **Views:** normal or only mildly down. (Your search tile is fine.)
- **Conversion:** below your historical rate, often significantly.

In other words: guests are seeing your listing, clicking to view it, looking at the details, and deciding *not to book*. Almost always, the deciding factor is comparing your nightly rate to comparable listings and yours feeling too expensive.

If your data doesn't match this pattern, you probably don't have a pricing problem. Read the next chapter (listing quality) instead.

## The competitive pricing audit

Three steps:

**Step 1: identify true comparables.**

Open Airbnb in incognito mode. Search your market for the dates that aren't booking. Filter to properties similar to yours: same number of bedrooms, same general location, similar amenities (hot tub, pool, view, etc.).

Make a list of 5–10 properties that a guest would seriously compare with yours. Not the cheapest property in the market and not the most expensive — the ones that genuinely compete with yours.

**Step 2: compare nightly rates.**

For each comparable, note their nightly rate for your problem dates. Build a quick ranking:

```
Property A: $185/night (yours: $215). 14% above.
Property B: $170/night.                17% below comp.
Property C: $195/night.                10% below.
Property D: $220/night.                3% above.
Property E: $158/night.                26% below comp.
```

If you're at the high end of your competitive set, you have a pricing problem to fix. If you're in the middle or low end, pricing isn't your issue.

**Step 3: check booked vs available.**

For each comparable, look at their calendar. Are their problem dates booked or open?

If their dates are booked and yours aren't, that's a strong signal: the market wants the rooms, just not at your price.

If their dates are also open, the issue might be market-wide (Cause 4) rather than just your pricing.

## What to do if pricing is the problem

The instinct is to slash rates by 20–30% in panic. Don't. The right move is more surgical:

**Step 1: define a target.**

You want to be in the middle of your competitive set, not the bottom. If your comparables average $185 and you're at $215, your target is roughly $185–$190.

**Step 2: lower base rates, not just specific dates.**

Set your base nightly rate to the target on the platform's calendar settings. The platform's pricing tools will then handle daily variance.

**Step 3: enable dynamic pricing if you haven't.**

PriceLabs, Wheelhouse, and Beyond all do market-aware pricing. They monitor competitor rates and adjust yours daily. They cost $20–60 per month and routinely produce 8–15% revenue lifts because they catch market shifts faster than humans.

If you're not using one of these tools, this is the time to start. Free trials exist for all three.

**Step 4: don't drop weekend or peak-season rates aggressively.**

Weekend and peak-season rates rarely have the same problem. If your weekday rates are too high relative to comp but weekends are competitive, lower weekdays only. The dynamic pricing tool will handle the granularity.

**Step 5: monitor the response.**

Give the price changes 7–14 days to show up in bookings. Don't change anything else during this window. If bookings recover, the diagnosis was right. If they don't, you have something else going on too.

## When low pricing is the wrong answer

Sometimes guests aren't booking because your price seems *too low*. This is rare but real, particularly in luxury or boutique categories.

If your property is positioned as a high-end experience and you're priced 30% below comparables, guests may interpret that as a quality red flag. The fix is the opposite: maintain pricing, improve the listing presentation, lean into the premium positioning.

Tell-tale: high-end properties with declining bookings, where lowering prices doesn't recover them. The data shows views are okay but conversion is bad — even though you're priced *below* market. The guests who are looking expect a $300 night, and a $220 listing in that segment looks suspicious.

## When pricing isn't the answer

If you've done the comparison and your prices are already in the middle or low end of your competitive set, you don't have a pricing problem. Move to chapter 5.

A common mistake at this stage: dropping prices anyway, "just in case." Don't. Dropping prices when the issue is elsewhere costs you margin without recovering bookings. The proper sequence is: diagnose first, act second.

---

# Chapter 5 — The listing-quality diagnostic

The listing-quality problem fingerprint:

- **Impressions:** normal. (You're showing up in searches.)
- **Views:** below historical. (But guests aren't clicking.)

Or:

- **Impressions and views:** normal.
- **Conversion:** down even though pricing is competitive.

In both cases, the issue is something on the listing itself — the cover photo, the description, the amenities, or the reviews — that's failing to convert searchers into bookers.

## The five listing audit questions

Walk through your listing as if you were a guest seeing it for the first time:

**1. Cover photo.** Is it a wide, well-lit shot of the most appealing room or exterior view? Is it phone-quality or professional? Is it warm, with people-friendly colors? Or is it a dark, narrow, or cluttered shot that doesn't sell the property?

**2. First five photos.** Do they tell a complete story (exterior, main living area, bedroom, kitchen, distinctive amenity)? Are they sized appropriately and in focus? Do they convey scale (small rooms can look fine in photos but feel cramped in person; the photo should suggest the actual experience)?

**3. Title and tagline.** Does the listing title differentiate the property in two sentences? Or does it say something generic like "Beautiful 3BR Home"?

**4. Description.** Does the first paragraph hook a guest, or does it list amenities? Is the writing clear? Are typos and formatting issues absent?

**5. Amenities and reviews.** Are the listed amenities competitive with top properties in your market? Are recent reviews uniformly positive, or has there been a drift?

If you can't honestly answer all five with "yes," you have a listing-quality problem.

## The competitive amenity scan

Pull up your top 5 competitors in your market — the ones with the best occupancy and reviews. Make a list of every amenity they offer that you don't.

Common gaps that matter:

- Smart lock or self-check-in.
- Premium wifi (gigabit, mesh router).
- Workspace (desk, monitor, ergonomic chair).
- Hot tub, fire pit, outdoor space upgrade.
- Dedicated game room or kids' space.
- High-quality coffee setup.
- Pet-friendly designation.
- Stocked kitchen (oils, spices, basic pantry).
- Streaming platforms (Netflix, Disney+, etc.).

If competitors offer 3+ things you don't, you've found a meaningful gap. The fix is to add 1–2 of them and update your listing.

Some upgrades cost real money (hot tub, fire pit) and shouldn't be done casually. Others are nearly free (smart lock, workspace, coffee setup). Start with the cheap ones; they often produce surprising lift.

## The professional photo decision

If your listing photos are more than 2 years old, or if they were taken with a phone, professional photos are the highest-leverage upgrade you can make.

Cost: $300–$600 typically, for a half-day shoot with 30–60 finished images.

Lift: routinely 15–30% improvement in click-through rate from search results, and a similar improvement in conversion. On a property doing $40,000/year in revenue, that's $6,000–$12,000 of additional revenue annually for a $500 investment.

The return on investment is usually under 30 days.

How to find a good photographer:

- Ask top hosts in your market who they used.
- Search "Airbnb photographer [city]" on Google.
- Use Airbnb's own Pro Photography service (if available in your market).

Brief the photographer carefully. Send 5–10 examples of listing photos you admire. Identify the property's strongest visual features (view, design, amenities). Ask for both wide shots and detail shots. Ask for evening / golden hour shots if the property has good outdoor space.

## The description rewrite

Your listing description should:

- **Open with a hook.** Not amenity list. The first sentence should give the guest a feel for the experience: "Wake up to lake views and coffee on the screened porch." Not: "Our 3-bedroom home has a kitchen and a porch."

- **Tell them the why.** Why this property, in this neighborhood, for the kind of trip they're considering. Specific is better than generic.

- **Address common questions.** What's the wifi like? Is parking easy? How far to the things they care about? Pre-empting questions reduces friction.

- **Use clear formatting.** Short paragraphs. Bulleted lists where appropriate. Headers for sections. Long blocks of text don't get read.

- **Update annually.** Listing descriptions go stale. Prices, neighborhood references, amenity lists all drift over time. An annual rewrite keeps the listing fresh.

A good rewrite takes 60–90 minutes. The lift is harder to quantify than a photo upgrade but consistently shows up in conversion data.

## The reviews issue

If your average review has dropped from 4.9 to 4.7 and you've added a few 3- or 4-star reviews recently, you have a reviews issue compounding any other listing problem you have.

Lower review averages affect both search ranking (algorithm penalty) and conversion (guests choosing other properties).

The fix:

- Address the specific complaints in recent low reviews. Wifi issue? Upgrade the router. Cleaning complaint? Brief the cleaner. Comfort issue? Address it.
- Respond publicly to negative reviews with grace and specifics on what you've changed.
- Run your next 10 stays at peak attentiveness — proactive messaging, fast issue resolution, post-stay thanks. The review average recovers fast when the experience does.

## When listing quality isn't the answer

If your listing already converts well and your photos are recent and your reviews are strong, listing quality isn't your issue. Move to chapter 6.

---

# Chapter 6 — The algorithm-penalty diagnostic

The algorithm problem fingerprint:

- **Impressions:** down significantly compared to historical baseline.
- **Views and conversion:** proportionally down (because you're not getting impressions to convert).

Algorithmic deprioritization is real. Both Airbnb and Vrbo use ranking algorithms that decide where your listing appears in search results — and small changes in your account metrics can move you from page 1 to page 4 of relevant searches.

## What triggers algorithmic deprioritization

A non-exhaustive list of things that have been documented to affect Airbnb search ranking:

- **Cancellations.** Particularly host-initiated cancellations of confirmed bookings. Even one in a 90-day window can suppress search ranking.
- **Response time.** Falling below 24 hours typical response, and especially below 90% response rate, deprioritizes you.
- **Acceptance rate.** Declining bookings (especially when the property is shown as available) signals to the algorithm that you're a less reliable host.
- **Review average.** Below 4.6 starts impacting visibility. Below 4.3 substantially impacts.
- **Superhost loss.** The Superhost badge gives meaningful ranking boost. Losing it during a quarterly evaluation drops you back to baseline.
- **Inactive listings.** Listings without recent bookings get gradually deprioritized in favor of recently-active listings.
- **New competitive listings.** When new properties launch in your market, the algorithm gives them temporary boost — which means they appear above you for a while.

Vrbo's algorithm follows similar principles with different specifics.

## Diagnosing an algorithm problem

Step 1: pull your impressions year-over-year. If they're down 40%+ compared to last year while market-level demand is roughly flat, the algorithm is likely deprioritizing you.

Step 2: identify what changed. In the past 90 days:

- Did you cancel a confirmed booking?
- Did your response rate drop?
- Did you decline a bunch of inquiries?
- Did your review average fall below 4.6?
- Did you lose Superhost?
- Did the platform launch new ranking factors that you missed?

If you can identify one or more of these triggers, you've found the algorithm problem.

Step 3: check Airbnb's Quality framework page (or Vrbo equivalent). The platforms now publish their evaluation criteria. If you've slipped on one of the published metrics, the platform is showing you what to fix.

## Fixing each trigger

**Cancellations.** A host-initiated cancellation can be partially recovered by completing the next 5 bookings flawlessly. The algorithm forgives over time but slowly. Don't cancel another one for any reason.

**Response time.** Set up notifications on your phone. Use Airbnb's auto-reply feature to acknowledge messages immediately ("Got your message — I'll have a real reply within 4 hours"). Aim for under 1 hour median response time, all day, every day. The metric updates within 30 days.

**Acceptance rate.** Stop declining inquiries unless you have a hard reason. If your calendar is correctly maintained, you shouldn't be declining many. If you are, audit why.

**Review average.** Cover the cause as in chapter 5. Recovery is gradual but reliable when the experience improves.

**Superhost loss.** Your next quarterly evaluation is on a fixed schedule (April 1, July 1, October 1, January 1). Hit the criteria for the next quarter and the badge returns. The criteria: 10+ stays, 4.8+ average, 90%+ response rate, less than 1% cancellation rate.

**Inactive listing.** Use lower pricing or "Smart Pricing" as a temporary boost to drive a few bookings, then return to standard pricing once the algorithm sees activity again.

**New competitive listings.** Compete on quality. Better photos, better description, better reviews. The new-listing boost fades over a couple of months and the algorithm returns to evaluating on merit.

## Recovery timeline

Algorithm recovery isn't instant. Expect:

- **2–4 weeks** to see measurable impressions recovery from response-time and acceptance-rate fixes.
- **4–8 weeks** for review average recovery to show up in ranking.
- **Next quarterly evaluation** for Superhost recovery (up to 90 days).
- **8–12 weeks** for cancellation impact to fade.

Don't expect dramatic week-over-week swings. The algorithm is smoothed.

## When algorithm isn't the answer

If your impressions are flat or up year-over-year, you don't have an algorithm problem. Move to chapter 7.

---

# Chapter 7 — The market-saturation diagnostic

The market problem fingerprint:

- **Impressions:** down — but it's not just you. Other hosts in your market report similar drops.
- **Views and conversion:** down across the market, not just on your property.

Market problems are the hardest to diagnose because the data points to "everyone is hurting," and the natural response is to assume it's something specific you did wrong. It often isn't.

## How to confirm a market problem

**Step 1: talk to other hosts.**

The local Facebook group, Slack, or in-person host meetup for your market is the fastest signal. If five other hosts in your area report similar booking drops over the same period, the market is the issue.

**Step 2: check market-level data.**

AirDNA, Key Data, Rabbu, or similar paid tools track market-level supply and demand. The relevant numbers:

- **Year-over-year ADR for your market.** If average daily rate is down 10%+, demand has softened or supply has grown.
- **Year-over-year occupancy for your market.** If market occupancy is down 5%+, the market has changed.
- **New listings in your market.** A 30%+ year-over-year increase in active listings means new supply is competing for the same demand.

**Step 3: check macro factors.**

- Has there been a policy change (city regulation, tax change) that affects demand?
- Has a major demand source shifted? (A conference moved cities, a sport season ended differently, a major employer relocated.)
- Has the broader travel economy changed? (Recession indicators, fuel prices, exchange rates.)

If macro factors are aligned with the market data, you have a market problem.

## What to do when the market is the problem

This is the hardest chapter to write. Most of the playbook is about things you can control. A market shift is largely outside your control.

That said, several strategies tend to work for hosts who survive market downturns:

**1. Lean into operational excellence.** When demand softens, marginal properties get culled. The properties that remain profitable are the ones with the best reviews, the cleanest operations, and the most professional listings. Now is the time to upgrade everything you've been delaying.

**2. Compete on price selectively.** If market ADR is down 15%, you need to be down at least 10% on your problem dates to remain competitive. But don't drop below your operating cost. Use the break-even occupancy workbook to know your floor.

**3. Reduce supply yourself.** If your market has 30% more listings than two years ago, the math says some of them shouldn't exist. If your property is marginal — losing money even after cost cuts — selling or pivoting to mid-term rentals might be the right answer. Stubbornness during a market shift compounds losses.

**4. Diversify channels.** Reduce dependence on Airbnb/Vrbo by building direct bookings. The direct bookings manual (REV-02) covers this. Hosts with even 20% direct booking volume weather market shifts much better than 100%-OTA hosts.

**5. Look at mid-term rentals (30+ days).** If demand for short stays has softened but business demand is steady, repositioning the property as a mid-term rental for traveling professionals can stabilize occupancy. Note: this changes your tax treatment — see TAX-01 chapter 2 on the 7-day rule.

**6. Pivot the property's positioning.** Some markets shift faster than others. A market that was hot for couples' weekends might shift toward family travel. A market dominated by leisure might develop business demand. Repositioning the listing to match emerging demand can recover bookings without dropping price.

## The hardest decision: hold or fold

When a market has genuinely shifted, the hardest question is whether to hold the property or sell.

Indicators to hold:

- The shift looks temporary (typical seasonal weakness, a one-time event).
- Your operating economics are still positive.
- You have time and runway to see the market recover.

Indicators to fold:

- The shift looks structural (supply has permanently exceeded demand; regulatory change has fundamentally altered the market).
- Your operating economics have turned negative and stress projections show no recovery within 18 months.
- Continuing to hold compounds losses faster than alternatives.

If you're considering selling, do it before the market signal becomes obvious to everyone. The first 30% of sellers in a declining market typically realize most of the available equity; sellers in months 6–12 of a decline often face significantly worse outcomes.

This is a hard decision and one that benefits from talking to someone who isn't emotionally attached to the property. A real estate professional or financial advisor can usually help triangulate.

## When the market isn't the answer

If your market is healthy and only your property is struggling, you don't have a market problem. Go back to chapters 4–6 and look for what's specific to your property.

---

# Chapter 8 — The one-week recovery plan

You've diagnosed the problem. Now you need a plan to act on it. This chapter gives you a day-by-day playbook for the next seven days.

The plan is structured by which diagnosis you reached. Pick the version that matches.

## If pricing is the problem

**Day 1 (Monday):**
- Pull your competitive comparison data.
- Identify your target nightly rate (median of comparable properties).
- Set your new base rate on Airbnb and Vrbo.
- If you don't have one, sign up for a dynamic pricing tool. Free trial fine.

**Day 2 (Tuesday):**
- Configure the dynamic pricing tool for your market.
- Set min and max rates that match your competitive position.
- Verify pricing is updating on calendar correctly.

**Day 3 (Wednesday):**
- Send a "new pricing" message to past guests if you have a direct list.
- Update your direct booking site (if you have one) with new pricing.

**Days 4–6 (Thursday–Saturday):**
- Hold steady. Don't change anything else.
- Monitor inquiries — you should see an increase in messages and conversions within 4–6 days.

**Day 7 (Sunday):**
- Pull your data: impressions, views, conversion, bookings since the change.
- Adjust if needed.

## If listing quality is the problem

**Day 1 (Monday):**
- Schedule a professional photographer for the next 7–10 days.
- Make a list of the 4–6 highest-priority shots.
- Identify any property cleanup or staging needed before the shoot.

**Day 2 (Tuesday):**
- Walk through your listing as a guest. Make a list of every weakness in the description, the photos, the amenities.
- Identify 2–3 amenities you're missing that competitors offer.

**Day 3 (Wednesday):**
- Order any missing amenities (smart lock, workspace gear, coffee maker, etc.) for arrival before the photo shoot.
- Begin rewriting the listing description.

**Day 4 (Thursday):**
- Finalize the listing description. Read it as a guest. Edit ruthlessly for clarity.

**Day 5 (Friday):**
- Stage the property for the photo shoot (clean, set the table, remove personal items, add fresh flowers).

**Day 6 (Saturday):**
- Photo shoot.

**Day 7 (Sunday):**
- Receive proofs from photographer.
- Pick the new cover photo and the next 4 photos in priority order.
- Update your listing with new photos and the rewritten description.

## If the algorithm is the problem

**Day 1 (Monday):**
- Identify the trigger (cancellation, response time, review, Superhost, etc.).
- Make the specific fix:
  - Response time: turn on push notifications, set up auto-reply.
  - Acceptance rate: review pending inquiries, accept any reasonable ones.
  - Reviews: respond publicly to recent low reviews with specifics on what you've changed.

**Day 2 (Tuesday):**
- Post a thoughtful update to recent guests asking for honest reviews if they haven't left one.
- Run through the platform's quality framework page; identify any other slipped metrics.

**Days 3–7 (Wednesday–Sunday):**
- Hold steady. Algorithm recovery takes 2–6 weeks; don't make additional changes during the recovery window.
- Continue executing flawlessly: fast response, complete bookings, hospitality-grade communication.
- Track impressions weekly to confirm recovery trajectory.

## If the market is the problem

**Day 1 (Monday):**
- Pull market-level data (AirDNA or Key Data).
- Confirm the market is genuinely down (not just your property).
- Calculate your break-even occupancy using the companion workbook.
- Compare current occupancy to break-even. Determine your runway.

**Day 2 (Tuesday):**
- Lower base rate to be competitive in the softened market — typically 8–15% below your previous rate.
- Identify any property repositioning or amenity upgrade that might differentiate you.

**Day 3 (Wednesday):**
- Audit your operating expenses. Identify any cost cuts that don't compromise the guest experience.
- Cancel or defer any optional spending.

**Day 4 (Thursday):**
- Begin building a direct-booking funnel (see REV-02 manual).
- Set up email capture for past guests.

**Day 5 (Friday):**
- Run a "long stay discount" experiment — 10% off for stays of 7+ nights. Many markets in downturn have shifted toward longer stays.
- Test mid-term rental positioning if your market supports it.

**Day 6 (Saturday):**
- Talk to other hosts in your market. Compare strategies. Identify what's working for the survivors.

**Day 7 (Sunday):**
- Reassess. Is the runway adequate? Is the strategy working?
- If runway is tight (less than 6 months), begin preparing for the hold-or-fold decision.

## What to do at the end of the week

Pull the same four data points you started with: impressions, views, conversion, bookings.

If they've moved in the right direction — even slightly — you're on track. Hold the strategy and monitor for another 30 days.

If they haven't moved at all — or have gotten worse — you may have misdiagnosed. Go back to chapter 3, re-read your data, and reconsider. Sometimes the problem is two of the four causes, not just one.

Either way, don't abandon the plan after one week. Most STR booking recoveries take 30–90 days. Patience compounds.

---

# Appendix A — The "new listing" version

If your property is brand new — under 90 days old — the diagnostic in this manual works differently because Airbnb gives new listings a temporary boost in the first 90 days. After the boost expires, bookings often look like they're declining when actually the property is just transitioning to its baseline ranking.

For new listings:

- The 90-day "new listing boost" is a real algorithmic feature. Bookings during this window are higher than your steady state will be.
- Rapid declining-bookings panic in months 3–6 of ownership is often just the boost wearing off.
- Focus on getting reviews — Airbnb prioritizes properties with 5+ reviews. Hitting 5 reviews fast is the best thing you can do for long-term ranking.
- Don't panic-drop prices in the first 6 months. Let the property find its footing.
- Use the 90-day boost intentionally: high-quality photos and competitive pricing during this window establish your property's baseline ranking for the months that follow.

If your "declining bookings" really started 90 days after you listed, the most likely diagnosis isn't any of the four big causes — it's the new-listing boost wearing off. The property is finding its actual market position. Hold steady, build reviews, and the trajectory stabilizes.

---

# Appendix B — Vrbo specifics

Most of the diagnostic in this manual applies equally to Vrbo, but a few specifics differ:

- **Algorithm.** Vrbo's algorithm weights review quality more heavily than Airbnb's. A 4.5 average on Vrbo carries more penalty than the same average on Airbnb.
- **Booking pace.** Vrbo guests typically book further in advance than Airbnb guests. Slow Vrbo bookings 60+ days out can recover with adjusted pricing; slow Vrbo bookings 7 days out are a near-term issue.
- **Visibility tools.** Vrbo offers paid promotion tiers (Premier Partner) that affect ranking. Maintaining Premier Partner status protects against algorithm shifts.
- **Cross-listing impact.** Properties listed on both Airbnb and Vrbo with channel managers (Hospitable, Hostaway, OwnerRez) maintain calendar parity but the algorithms still treat them as independent listings.

Run the diagnostic separately for each platform if your bookings have changed differently across them.

---

# Glossary

**ADR.** Average Daily Rate. Total revenue divided by total booked nights. The headline metric for STR pricing.

**Algorithm penalty.** Reduced search visibility on Airbnb/Vrbo due to poor account metrics (low response rate, high cancellations, weak reviews).

**Break-even occupancy.** The minimum occupancy rate required for the property to cover all operating costs. Calculated in the companion workbook.

**Conversion rate.** Percentage of listing views that result in a booking. Typical range 1.5–5%.

**Dynamic pricing tool.** Software (PriceLabs, Wheelhouse, Beyond) that automatically adjusts your nightly rates based on market conditions.

**Impressions.** Number of times your listing appeared in someone's search results. Top of the funnel.

**Search ranking.** Where your listing appears in search results for relevant queries. Affected by the platform's algorithm.

**Superhost.** Airbnb's quality designation, awarded quarterly to hosts meeting specific performance criteria. Provides ranking boost.

**Views.** Number of times someone clicked on your listing to see the details. Middle of the funnel.

---

# About Daniel

Daniel Harrison runs a short-term rental in the western US and writes plain-English guides for STR owners at strmanuals.com. He's been operating STRs since 2019 and has navigated multiple booking declines — algorithmic shifts, market saturation in his region, a pricing miscalibration that took two months to identify — alongside the readers this manual is written for.

You can reach him by replying to any STR Manuals email — replies go to a human. The next version of the manual gets sharper because of reader questions.

— Daniel
STR Manuals · 2026

---

*This manual is operational guidance, not investment advice. Use the diagnostic frameworks here as starting points; combine them with local market knowledge and your platform's specific tools.*
