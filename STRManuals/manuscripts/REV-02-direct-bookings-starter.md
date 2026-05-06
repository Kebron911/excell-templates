# REV-02 — Direct Bookings Starter

**Working manuscript.** Long-form markdown for authoring. Final designed PDF lives at `private/manuals/direct-bookings-starter/v1.pdf` (uploaded via SFTP to Hostinger).

**Author:** Daniel Harrison
**Target length:** 32 pages (~9,500 words)
**Reading level:** plain English
**Companion:** Direct-Booking Email Sequence Pack

---

## Disclaimer

This manual is operational guidance for STR owners building direct booking funnels. It is not legal, tax, or business advice. Direct bookings change how you handle payments, taxes, and disputes — review your state's lodging regulations and consult a CPA on tax treatment before launching a direct channel.

The manual references specific platforms (Airbnb, Vrbo, Lodgify, Hostfully, OwnerRez, Stripe) as illustrative examples. Tools and policies change — verify current functionality before relying on details that may have evolved since publication.

---

## Front matter

- **Title page** with cover (REV-02 · Direct Bookings Starter)
- **Copyright + disclaimer page**
- **About this manual** (½ page)
- **Table of contents** (1 page)

---

## Chapter outline

| # | Title | ~Pages | Purpose |
|---|-------|--------|---------|
| 1 | Why direct bookings matter (and what's overhyped) | 3 | The honest case for and against. |
| 2 | The simplest direct-booking site | 4 | Stack options, cost, and what to skip. |
| 3 | Capturing emails inside Airbnb's rules | 4 | What's allowed, what isn't, and what to put in the welcome book. |
| 4 | The post-stay sequence that drives rebookings | 4 | The 5-email sequence that turns one-time guests into repeat customers. |
| 5 | Pricing direct vs. OTA | 4 | The math, the psychology, and the right discount. |
| 6 | Payment processing without losing 8% | 3 | Stripe vs. payment processors vs. ACH; security deposits. |
| 7 | Cancellation and damage policies you actually enforce | 3 | The policies that hold up when you need them. |
| 8 | The 6-month migration timeline | 4 | Month-by-month playbook from 0% direct to 30% direct. |

**Back matter:**
- Sample policy templates (1 page)
- Glossary (½ page)
- About Daniel (½ page)

---

# Chapter 1 — Why direct bookings matter (and what's overhyped)

There's a brand of STR advice that treats direct bookings like a religion. Get to 100% direct or you're not a real operator. Quit Airbnb. Build an email list. Channel-manage everyone off platform.

Most of it is overstated.

Direct bookings *are* valuable. They're worth real money. They protect you against algorithmic shifts, platform fee creep, and policy changes you don't control. But the path from 0% direct to 30% direct is genuinely useful; the path from 30% to 100% is mostly diminishing returns and significant risk.

This manual is about the first leg — getting to 30%. That's where most of the value is, and it's the leg most operators can actually walk.

## What direct bookings are worth

The concrete benefits, in order of magnitude:

**1. Fees you don't pay.** Airbnb charges hosts ~3% per booking; Vrbo charges 5–8% in service fees; both pass an additional 14–16% guest service fee onto your guests. A direct booking pays your processor (Stripe, typically 2.9%) and nothing else.

For a property doing $80,000 per year in bookings, the host fees alone are $2,400–$5,000. Capturing 30% of those bookings as direct saves $720–$1,500 per year. Not life-changing, but real.

**2. Pricing flexibility.** OTA platforms enforce certain pricing parity rules and surface guest-fee structures that mean your headline rate isn't what guests pay. Direct bookings let you set the actual price guests see, which gives you more control over conversion and positioning.

**3. Repeat-guest economics.** A returning guest who comes through Airbnb pays you fees again on every stay. A returning guest who comes through your direct channel pays you fees once and then the relationship is yours forever. This is where direct economics genuinely shine — repeat-rate properties at 30–40% direct see meaningfully better unit economics than the same properties at 100% OTA.

**4. Algorithmic protection.** When Airbnb changes its ranking algorithm (and they do, periodically), your impressions can drop overnight. A direct channel is a hedge — bookings you control, which keep coming regardless of what Airbnb does this quarter.

**5. Email list value.** A growing email list of past guests is a marketing asset that compounds. Each additional past guest is one more person who might rebook directly, refer the property, or buy from you in adjacent products (gift cards, cookbook, regional travel guide, etc.).

## What direct bookings are NOT

Some things the direct-booking guru content oversells:

**They're not a path to "fire Airbnb."** Even at 30% direct, the other 70% comes from OTAs, and that 70% requires you to keep your listings strong. Building direct doesn't replace Airbnb; it diversifies away from full dependence.

**They're not the highest-leverage thing for most operators.** A property with bad reviews, weak pricing, or quality issues should fix those first. Direct bookings on a struggling property just multiply the underlying problem.

**They're not free.** A direct site costs $40–$120 per month for the SaaS stack. A processor takes 2.9%. Your time goes into content, marketing, and email management. The math has to pencil before you scale.

**They're not safer in disputes.** Airbnb's resolution center and AirCover provide a baseline of guest-and-host protections that don't exist on direct bookings. You're handling damage claims and chargebacks yourself, which is a real workload and a real risk.

**They're not a guaranteed competitive advantage.** Most travelers prefer Airbnb for the trust signal, the protections, and the user experience. A direct site has to be at least as easy as Airbnb to convert anyone; if it's not, guests bail.

## Who should build direct first

You'll get the most return if:

- You have 20+ stays per year of repeat-guest potential. (Properties in repeat-able destinations: weekend getaways near major cities, family vacation properties, ski/lake/beach houses.)
- Your property has a clear identity that can be branded. (Generic apartments don't market as well as branded experiences.)
- You're already on Airbnb/Vrbo successfully. (Your first 6 months of operation should be focused on platform success, not direct bookings.)
- You have basic writing or content skills (to draft emails, write your direct site's copy).

## Who should not build direct first

You're better off focusing elsewhere if:

- Your reviews are below 4.7. Fix the reviews first.
- You're under 6 months of operation. Build platform velocity first.
- Your market is heavy business travel only. Business travelers default to Airbnb/Vrbo for expense-report reasons.
- You don't have time for ~10 hours per month of email/site work for the first six months. Direct bookings require setup investment.

## What "30% direct" looks like in practice

A typical 30%-direct property doing $80,000 in revenue:

- $56,000 from OTAs (Airbnb, Vrbo).
- $24,000 from direct bookings.
- About 30% of direct bookings are returning guests; 70% are first-timers who chose direct over OTA (often via Google search or referral).
- Email list of 200–400 past guests, with 1–2 broadcasts per quarter and an automated post-stay sequence.

Reaching this baseline is the goal of this manual.

---

# Chapter 2 — The simplest direct-booking site

You don't need a custom website. You need a booking-capable site that:

1. Looks professional.
2. Lets guests check availability and book.
3. Processes payments.
4. Sends confirmation and check-in info automatically.
5. Plays nicely with your channel manager so the calendar stays in sync with Airbnb and Vrbo.

There are three reasonable paths.

## Path 1: Lodgify

The lowest-cost serious option.

**What it is.** A booking-capable website builder specifically for STR owners. Includes templates, payment processing integration, and channel management for Airbnb/Vrbo.

**Cost.** $25–$60 per month depending on tier.

**Strengths.** Easy setup (4–8 hours from zero to live). Templates look reasonable out of the box. Built-in channel manager keeps Airbnb/Vrbo calendars synced. Good value for single-property operators.

**Weaknesses.** Less design flexibility than a custom site. Templates feel a bit generic; brands with strong identity feel constrained. Customer support is uneven.

**Who it's for.** Solo operators who want something working in one weekend. Most readers should default to this unless they have a specific reason to choose otherwise.

## Path 2: Hostfully

A more powerful but more expensive option.

**What it is.** A property management system with built-in direct-booking capability. Better automation, better guest communication, better reporting.

**Cost.** $80–$200 per month depending on number of properties and feature tier.

**Strengths.** Polished platform. Strong automation tools. Good for multi-property owners. Excellent support.

**Weaknesses.** Higher cost. More setup time. Overkill for single properties.

**Who it's for.** Operators with 3+ properties or those serious about ops automation.

## Path 3: OwnerRez

The longstanding option for self-hosting brand identity.

**What it is.** Backend management system with website integration tools. Pairs with a separate website (your own custom site or a website builder) to provide booking capability.

**Cost.** $40–$80 per month for the backend, plus website costs.

**Strengths.** Maximum flexibility. Most powerful integrations. Good for technically-inclined operators who want full control.

**Weaknesses.** Steep learning curve. Setup can take days, not hours. Requires more comfort with the technical stack.

**Who it's for.** Hosts with multiple properties, technical inclination, or specific needs the simpler tools don't meet.

## What to skip

**A custom-developed website.** Unless you're building a portfolio of 10+ properties or have specific brand needs, custom development is wasted money and ongoing maintenance burden. Off-the-shelf does the job.

**WordPress with a vacation rental plugin.** This combination has been the source of more abandoned direct-booking projects than any other path. WordPress is fragile; the plugins are inconsistent; the integration with channel managers is rough. Skip.

**A Squarespace or Wix site without booking integration.** A site that's just marketing copy with no booking capability is more friction than no site at all. If a guest has to email you to inquire about availability, you've lost most of them.

## The setup checklist

For Path 1 (Lodgify) — the recommended starting point:

**Day 1 (3–4 hours):**
- Sign up for Lodgify.
- Pick a template.
- Upload 15–25 of your best photos.
- Write the basic copy: hero headline, property description, location overview, amenities.
- Configure your room type and base nightly rate.

**Day 2 (3–4 hours):**
- Connect Stripe for payment processing.
- Connect Airbnb and Vrbo via Lodgify's channel manager.
- Set up your direct nightly rate (typically 8–12% below the OTA rate after stripping platform service fees — covered in chapter 5).
- Configure cancellation policy and booking rules.
- Set up confirmation and check-in email templates.

**Day 3 (2 hours):**
- Add your custom domain (yourproperty.com — buy via Cloudflare, $10/year).
- Test a fake booking end-to-end.
- Run through the welcome email and confirm it looks right.

That's three days of setup, including testing. From this point you have a working direct-booking site. The rest is marketing, which the next chapters cover.

## What "looks professional" actually means

Some practical visual standards:

- Hero photo at top: the same cover photo you use on Airbnb. Wide, well-lit, signature shot.
- 8–15 photos showing the full property. Same photos as your Airbnb listing.
- Property description: longer than Airbnb's, telling the story, not just listing amenities.
- Amenities list: visible but not the focus.
- Booking widget: prominent on the home page and the property page. Minimal friction.
- Reviews: pull selected reviews from Airbnb (paste the text, attribute as "from Airbnb"). Build credibility.
- Location map: yes. Helps guests confirm the location works.
- About / story page: short. Two paragraphs about you and the property's history. Personality matters; corporate voice loses.

The site should look like a small boutique business, not a corporate property manager. Personality and care should come through.

---

# Chapter 3 — Capturing emails inside Airbnb's rules

The single biggest direct-booking accelerator is your email list. Past guests who liked their stay are the most likely future direct bookers — they already know you, the property, and the experience.

The challenge: Airbnb has rules about what you can do during a guest's booking, and violating them can result in suspension. This chapter covers the boundary and how to operate inside it.

## What Airbnb allows

Airbnb's Terms of Service and host community guidelines have evolved over the years. The current general principles:

**Allowed:**
- Putting your direct-booking site in your welcome book or printed materials at the property.
- Including your direct-booking website in post-stay communication, after the booking is complete and the guest has checked out.
- Telling guests in person about your direct booking option, when they're at the property.
- Asking for honest reviews and inviting them to come back.
- Branding the property (a small placard with the property name and a website URL is generally fine).

**Not allowed:**
- Bypassing the platform during the active booking process. (Don't tell prospective guests to book direct instead of through Airbnb when they're inquiring on Airbnb.)
- Sending direct-booking promotions during a guest's active stay if the booking came through Airbnb.
- Encouraging guests to cancel an Airbnb booking and rebook directly.
- Sending automated messages through Airbnb's messaging system that include direct-booking links (Airbnb's algorithms scan messages and may flag links).

**Gray zones:**
- Asking for the guest's personal email address. Technically allowed but if you ask aggressively, guests sometimes report it. Soft asks (in the welcome book, in conversation) are fine; hard asks (email-required forms during booking) are risky.
- Promotional content in the welcome book. Allowed but should be subtle. Five paragraphs about your direct site at the front of the welcome book reads like a sales pitch and damages the guest experience.

## The capture mechanism

The most reliable way to build your email list inside the rules:

**1. The welcome book.** Include a one-page section near the back of your printed welcome book titled "Booking direct next time." Brief copy explains the benefits (better price, no service fees, easier rebooking), with the URL to your direct site. Soft tone. No pressure.

**2. The departure card.** A small printed card you leave on the kitchen counter for guests to take home. Thank them for their stay, ask for a review, mention your direct site. Maybe offer 5% off their next direct booking with a code.

**3. The post-stay email.** This is where the rules get tricky. You can email past guests *after* they've checked out and the booking is closed. Many hosts use the booking platform's communication during the stay, then transition to direct email after checkout. This is allowed, provided you're not actively bypassing the platform during the booking.

**4. The branded property identity.** A small property name on a sign at the entrance. A logo on the welcome book. A property hashtag for guests to use on social media. These build brand awareness that translates to direct site traffic over time.

## What to skip

**An email opt-in form on Airbnb's listing description.** Against TOS. Will get flagged.

**A QR code at the property pointing to a sales page.** Allowed, but reads salesy. A QR code in the welcome book pointing to the direct site (with neutral framing, not "BOOK DIRECT NEXT TIME!!") is fine.

**Aggressive opt-in marketing during the stay.** A note on the bedside table asking for emails feels invasive. Stay light.

## The opt-in copy

The exact language that works in the welcome book:

```
[Property Name] is also available to book directly at [property].com.

Direct bookings come with a few advantages:
  — Lower total price (no platform service fees)
  — Easy rebooking (we'll have your details)
  — First access to weekday discounts and last-minute deals

If you'd like to come back, you can book at [property].com or
just reply to your post-stay email.

Either way, thank you for staying. We hope you'll be back.
```

That's the entire pitch. Soft, factual, opt-in by their choice. No urgency, no fake scarcity, no aggressive language.

## How fast the list grows

A typical property with 60–80 stays per year, using the welcome-book + departure-card method:

- About 10–15% of guests will land on the direct site within 30 days of checkout.
- About 5–8% will subscribe to email updates if you offer one.
- About 3–5% will book again directly within 12 months.

That's 2–4 direct rebookings per year just from passive capture. Over 3 years, the list compounds to 100–200 past guests, and the rebooking rate climbs as the brand becomes familiar.

This isn't fast. Direct bookings are a long game. Plan for 12+ months before they meaningfully shift your revenue mix.

---

# Chapter 4 — The post-stay sequence that drives rebookings

Once a guest has stayed and checked out, you can communicate with them via your own email channel. This is where direct bookings convert.

This chapter is the post-stay email sequence — five emails over the 90 days after checkout — that turns one-time guests into repeat customers and brand advocates.

## The framework

The five emails:

| # | Day | Topic |
|---|---|---|
| 1 | 1 | Thank you + review request |
| 2 | 7 | The "what to do next time" guide |
| 3 | 30 | Seasonal update or new amenity announcement |
| 4 | 60 | Soft rebooking offer (if behavior signals interest) |
| 5 | 90 | Final touch — newsletter signup or invite to return |

The companion Direct-Booking Email Sequence Pack contains the full text of each email plus customization guidance.

## Email 1 — Thank you + review request (Day 1)

Sent the day after checkout.

**Goals:** thank them; ask for an honest review; soft introduce the direct site.

**What to include:**
- Genuine thanks for their stay (specific to something they did or said).
- Quick review request — link directly to Airbnb's review form for the booking.
- A line about your direct site as an option for next time.
- One personal touch — a photo of the property in a different season, or a recipe from the welcome book they used.

**What NOT to include:**
- A coupon or aggressive booking push. The first email should feel like genuine appreciation, not a sales pitch.
- A long email. Keep it under 200 words.

**Open rate target:** 60%+ (these are warm contacts).

## Email 2 — "What to do next time" guide (Day 7)

Sent one week after checkout.

**Goals:** demonstrate brand value; subtly position you as the experts on the destination; warm them for return.

**What to include:**
- 3–5 things they "missed" — restaurants, hikes, festivals, hidden spots they might not have hit.
- An attached PDF of your local area guide (this can be the same guide that's in the welcome book).
- A short note that you update the guide twice a year and they're on the list to receive future versions.

**What NOT to include:**
- A booking pitch. Email 2 is brand-building, not selling.
- Too much information. Keep it skimmable — 3–5 specific things, not a comprehensive guide.

**Open rate target:** 45–55%.

## Email 3 — Seasonal update or new amenity (Day 30)

Sent 30 days after checkout.

**Goals:** stay in their inbox; show that the property is dynamic and improving; gently remind them of your direct option.

**What to include:**
- Something specific to the current season (fall foliage, winter ski conditions, summer farmers' markets).
- Photo of the property in the new season.
- Mention any new amenities or updates since their stay.
- Soft mention: "We're booking up for [next peak season] — direct bookings opening at [property].com."

**Frequency calibration:** if your property is heavily seasonal, this email is timed to land 30 days before the next peak booking window. For a ski property, this email should land in October. For a beach property, in March.

**Open rate target:** 35–45%.

## Email 4 — Soft rebooking offer (Day 60)

Sent 60 days after checkout, if they've engaged with previous emails (opened at least one).

**Goals:** make rebooking easy; offer a modest direct incentive.

**What to include:**
- Direct rebooking link (specifically tied to the property).
- 5–10% discount code for direct bookings within the next 60 days.
- A specific date range you'd love to fill (a slow week, a shoulder season).
- "Reply to this email if you'd like a custom date" — opens conversation.

**What NOT to include:**
- Pressure tactics, fake scarcity, urgent deadlines.
- A pitch for a property that's clearly not for them. (If they stayed for a romantic weekend, don't pitch them a family vacation property.)

**Conversion rate target:** 3–6% of recipients book within 60 days.

## Email 5 — The final touch (Day 90)

Sent 90 days after checkout.

**Goals:** transition them to the long-term newsletter list; soft invite to return.

**What to include:**
- A note that you publish a quarterly email with property updates and travel ideas.
- "If you'd like to stay on the list, no action needed. If you'd rather not, easy unsubscribe."
- A specific invitation to return — perhaps for an upcoming season, perhaps for something specific to the property.

**Conversion rate target:** 60–70% remain on the list; 5–10% rebook within 12 months.

## What happens after Email 5

Subscribers move to the quarterly newsletter cadence. Four emails per year:

- January: "What's new at [Property] in 2026" — annual update.
- April: "Spring at [Property]" — seasonal update + booking availability.
- July: "Summer in [Region]" — guide content, soft booking promotion.
- October: "Fall and winter availability" — booking-focused.

This cadence is sustainable and produces consistent direct bookings without overwhelming the list.

## Open rates and unsubscribes — what's normal

For a well-run STR email list:

- Open rates: 35–55% on average. Above 50% is excellent.
- Click rates: 5–12%.
- Unsubscribe rates: <0.5% per email.
- Direct bookings from email per year: 5–10% of list size.

If your open rates are below 25%, your sender reputation is weak or your subject lines aren't connecting. Improve subject lines first; if that doesn't help, audit your sender domain (SPF, DKIM, DMARC records).

---

# Chapter 5 — Pricing direct vs. OTA

The pricing question on direct bookings is the most common confusion for first-time direct operators. The math is simpler than it looks once you separate the two questions:

1. What's the right *direct rate* relative to your *OTA rate*?
2. What discount, if any, should you offer for direct bookings?

## The fee math

Start with the fees you avoid on a direct booking:

- **Airbnb host service fee:** ~3% on host side.
- **Airbnb guest service fee:** ~14–16% on guest side (passed through; you don't pay it but it inflates the guest's total).
- **Vrbo equivalent:** 5–8% host + 8–14% guest, depending on tier.

A typical Airbnb booking: a $200 nightly rate the host sets becomes about $232 to the guest after the guest service fee. The host receives $194 after the host service fee.

The same $200 rate booked directly: guest pays $200, host receives ~$194 after Stripe (2.9% + $0.30).

So the host doesn't actually save much per night on a direct booking — about $6 in fees. The bigger story is the *guest*'s side: they were paying $232 on Airbnb and now pay $200 direct. From the guest's perspective, that's a 14% saving.

This creates the strategic opportunity: you can offer the guest 8–10% off the OTA rate for direct bookings, and still net more per booking than you would on Airbnb. The guest perceives a meaningful discount; you keep more revenue.

## The right discount

Most operators land in this range:

- **5–8% off OTA rate for direct bookings.** Conservative; preserves margin; signals "small reward for booking direct."
- **10% off OTA rate for direct bookings.** Standard; matches the common "subscriber discount" found in other industries.
- **15% off OTA rate for direct bookings.** Aggressive; signals strong preference for direct; might erode perceived value if guests question "why is direct so much cheaper?"

A pragmatic default: 10% off. Match the perceived guest savings on Airbnb's guest service fee. Easy to message ("10% off when you book direct"). Easy to maintain operationally.

## Pricing tools and parity

Some channel managers (Lodgify, OwnerRez, Hostfully) handle pricing across platforms automatically. They let you set:

- A base rate (typically the OTA rate).
- A percentage discount for direct bookings (e.g., -10%).
- A percentage adjustment for specific channels.

This makes the parity issue a configuration question rather than a manual one. Each platform sees its rate; you don't have to update three calendars by hand.

A wrinkle: Airbnb has parity rules requiring you not to undercut Airbnb's rate on competing channels. The 10% direct discount technically violates this but is widely tolerated in practice. Don't advertise the direct discount on your Airbnb listing or in messaging; keep it on the direct site only.

## Dynamic pricing on direct vs. OTA

If you use a dynamic pricing tool (PriceLabs, Wheelhouse, Beyond), it can manage rates across all channels. The standard approach:

- The dynamic tool sets the OTA rate based on market conditions.
- Direct rate is a fixed percentage discount from the OTA rate (10% off, calculated automatically).
- This keeps your direct pricing competitive without requiring you to manage two parallel pricing strategies.

Most dynamic tools support this out of the box.

## Why guests book direct anyway

It's not just price. Guests choose direct over OTA for several reasons:

1. **Lower total price.** The 8–14% saving on guest service fees is real money.
2. **Repeat-guest familiarity.** Returning guests often prefer the path of least resistance, which is your direct site if they know about it.
3. **Brand affinity.** Guests who fell in love with the property prefer to support the operator directly.
4. **Cancellation flexibility.** Some hosts offer better cancellation terms direct than on Airbnb.
5. **Custom requests.** Guests with specific needs (extended stay discounts, multi-property deals, custom packages) find direct booking easier.

The price discount supports these motivations but isn't the entire reason direct bookings happen.

## Pricing for new vs. returning guests

Some operators differentiate:

- **First-time direct bookers:** 5–10% off OTA rate.
- **Returning direct bookers:** 10–15% off, plus access to off-season specials.

This rewards loyalty without giving up margin to first-time bookers who would have come anyway. If your direct site supports it, this is a reasonable structure.

The downside: complexity. Most operators stick with a single direct discount tier for simplicity and let "loyalty" show up in special promotions and personal touches rather than ongoing pricing differences.

## When NOT to discount direct

Some operators don't offer a direct discount at all. They charge the same rate on direct as on OTA, on the theory that "you're getting the better price already on the OTA fee structure" and that direct booking should be about the relationship, not the price.

This works for premium properties with strong brand identity — guests seek out direct because they want to support the host, not because they want a better rate. For most operators, though, a 10% discount nudges enough conversion to be worth offering.

---

# Chapter 6 — Payment processing without losing 8%

Payment processing fees are often the second-largest expense category for direct bookings, after the SaaS stack. A 2.9% fee on a $20,000 month of direct bookings is $580. Annualized at $80k of direct revenue, you'll pay $2,300 in processor fees.

This chapter covers how to keep that number reasonable.

## The standard option: Stripe

The default for most direct-booking sites.

**Cost:** 2.9% + $0.30 per transaction.

**Strengths:** Reliable. Integrated with every major direct-booking platform (Lodgify, Hostfully, OwnerRez). Excellent dispute handling. Strong fraud detection.

**Weaknesses:** 2.9% adds up. No discounting for high volume unless you negotiate (which is possible at $200k+ annual processing).

**Verdict:** Most operators stay with Stripe and accept the cost as a cost of doing business. The convenience is worth the percentage.

## Lower-cost option: ACH transfer

For larger bookings, ACH (bank transfer) is meaningfully cheaper than card processing.

**Cost:** 0.8% capped at $5 per transaction (Stripe ACH).

**Strengths:** Significantly cheaper than card processing for bookings over $400. A $4,000 weekly stay costs $5 via ACH vs. $116 via card.

**Weaknesses:** Slower (3–5 day clearing time). Less convenient for guests. Some guests refuse to provide bank account information.

**Verdict:** Worth offering as an *option* for bookings over $1,000. Few guests will use it, but the ones who do save you significant money.

## Why payment plans matter

For longer stays (7+ nights), some operators split payment into two charges:

- **Initial deposit:** 50% at booking confirmation.
- **Final payment:** 50% one week before check-in.

This reduces exposure if a guest cancels late, since the final payment is closer to the stay date. It also makes the booking more cash-flow-friendly for guests, which can help conversion on premium-priced longer stays.

Both Lodgify and Hostfully support payment splits natively.

## Security deposits

Most direct-booking sites support pre-authorizing a security deposit on the guest's card. The deposit isn't charged unless damages occur; if the stay is clean, the pre-auth releases.

Standard amounts:

- $200 for properties under $200/night.
- $500 for properties $200–$400/night.
- $1,000+ for properties above $400/night or properties with high-value amenities (hot tub, art, electronics).

The pre-auth approach is cleaner than charging and refunding, and clearer to the guest.

## Damage claims

When damage occurs:

1. **Document with photos and timestamps** within 24 hours of guest checkout.
2. **Get a written or text-based estimate** from a contractor or repair person.
3. **Email the guest** with the documentation, the estimate, and a clear explanation. Give them 7 days to respond.
4. **If they don't dispute, charge the security deposit** for the actual damage amount (not the full deposit unless damage exceeds it).
5. **If they dispute, offer a discussion** before escalating.

This sequence handles 95% of damage claims without escalation. The 5% that go to chargeback are typically situations where the damage is contested or the deposit was inadequate.

## Chargebacks

A chargeback happens when a guest disputes the charge with their card company. If you lose the dispute, you lose the booking revenue plus a $15–$25 chargeback fee.

Defending a chargeback requires:

- The original booking confirmation.
- Communication with the guest before, during, and after the stay.
- Documentation of any damages (if relevant).
- Proof of property delivery (the guest checked in and used the property).

Most chargebacks lose on the host side because the documentation is incomplete. To protect yourself:

- Keep all guest communication archived.
- Photograph the property at every turnover.
- Save Stripe's automated booking confirmation as evidence of agreement.

Stripe provides a chargeback management dashboard that walks you through the dispute process. Use it.

## Avoiding chargeback-prone bookings

Some bookings are higher chargeback risk:

- Last-minute bookings from new accounts (especially with international cards).
- Bookings where the cardholder name doesn't match the guest's stated name.
- Multi-night bookings with unusual payment patterns (split across multiple cards, or unusual timing).

You can configure Stripe Radar (their fraud detection) to flag suspicious bookings for manual review. For most operators, this isn't necessary — but it's there if your chargeback rate becomes an issue.

## Tax collection

Lodging tax (occupancy tax, hotel tax) is the host's responsibility on direct bookings. Most jurisdictions require:

- Registering with the local tax authority.
- Collecting tax from guests at booking.
- Remitting tax monthly or quarterly.

This is a real ongoing operation. The exact requirements vary by city and state. Talk to your CPA or check your state's department of revenue website before launching direct bookings.

Some channel managers (Hostfully, OwnerRez) automate tax collection and remittance. Lodgify supports it but with less polish. For operators in markets with complex tax regimes, this feature alone can justify the cost difference.

---

# Chapter 7 — Cancellation and damage policies you actually enforce

The hardest part of direct bookings isn't building the site or driving traffic. It's enforcing your policies when things go wrong — cancellations, damages, payment disputes, no-shows. Without Airbnb between you and the guest, you're handling these directly.

This chapter is about the policies that hold up.

## Cancellation policy structure

The standard tiers:

**Flexible (for properties with high last-minute booking velocity):**
- Free cancellation up to 48 hours before check-in.
- Full charge after that.

**Moderate (the default for most operators):**
- Free cancellation up to 14 days before check-in.
- 50% refund 7–14 days before.
- No refund within 7 days.

**Strict (for premium properties or peak seasons):**
- Free cancellation up to 30 days before check-in.
- 50% refund 14–30 days before.
- No refund within 14 days.

Match your direct policy to your Airbnb policy. Don't undercut yourself by offering more flexible terms direct than on platform.

## What to put in writing

Your direct site needs an explicit policies page covering:

- Cancellation terms (one of the structures above).
- Damage deposit handling.
- Check-in and check-out times.
- House rules (smoking, pets, parties, max occupancy).
- Refund process if you cancel.
- Severe weather provisions (do you offer rescheduling, full refund, or partial refund for hurricanes, snowstorms, etc.?).

This page should be linked from the booking flow and the guest must explicitly agree before booking. Lodgify and similar platforms include this as part of the standard booking confirmation flow.

## When to enforce strictly and when to be flexible

The honest truth: strict enforcement of cancellation policies is sometimes the right call, sometimes the wrong call.

**Enforce strictly when:**
- The cancellation is within the no-refund window and the dates are unlikely to rebook.
- The guest is being unreasonable or aggressive about the request.
- You've documented the policy clearly and the guest agreed.

**Be flexible when:**
- The dates are likely to rebook (canceled Saturday for next month — easy rebook).
- The guest has a legitimate emergency (death in family, serious illness).
- The guest has stayed before and is generally a good customer.
- A goodwill gesture would generate a positive review or word-of-mouth.

A useful framing: charge the policy, then optionally refund some or all if the dates rebook. This way you start from "policy enforced" rather than "policy bent" and can be generous when it makes sense.

## Severe weather and force majeure

If you're in a region with hurricane, blizzard, or wildfire risk, build a force majeure policy now. Common terms:

- Full refund or rescheduling if mandatory evacuation or travel restriction is in place.
- 50% refund or rescheduling if travel is significantly disrupted but not impossible.
- No refund if the disruption is minor or the guest's perception only.

Be specific about what counts ("FAA cancels all flights to/from local airport" or "state emergency declared") so guests can't argue subjectively.

## Damage handling — the calm protocol

When damage occurs, the process I find works best:

**Step 1 (within 24 hours of checkout):** Photograph everything. Multiple angles. Include date metadata.

**Step 2 (within 48 hours):** Get a written or text estimate from a repair professional. Don't estimate yourself.

**Step 3 (within 72 hours):** Email the guest with documentation and estimate. Use neutral, factual language. Don't accuse; describe.

**Step 4:** Offer the guest 7 days to respond before charging the security deposit.

**Step 5:** If they accept the charge, process it and move on.

**Step 6:** If they dispute, have a conversation. Most disputes resolve when the host communicates calmly with documentation.

**Step 7:** If the dispute persists, decide whether to escalate (small claims court) or absorb the loss. Most damage claims under $500 aren't worth the time of escalation.

## Communication template for damage claims

Subject: Stay at [Property] — required documentation

```
Hi [Guest],

Thanks again for staying at [Property] this past week. I hope your trip
was good.

I want to flag a damage finding from the post-stay inspection. The
[specific item] was [specific issue]. I've attached photos with timestamps.

I had [Repair Pro] come out to assess. The repair estimate is $[amount];
the writeup is attached.

I'd like to charge the security deposit for the actual repair cost. As a
reminder, the deposit was $[X], and the proposed charge is $[Y]. The
difference would be released to you.

If this looks accurate, no action needed — I'll process the charge in
7 days. If you'd like to discuss it, reply to this email and we can get
on a call.

Thanks,
Daniel
```

This template handles the vast majority of damage claims without escalation. Calm, documented, fair.

## When to walk away

If a damage claim is contested and the underlying amount is small (under $500), often the right call is to absorb it. The cost of pursuing — your time, the chargeback risk, the potential negative review — frequently exceeds the recovery.

For larger claims ($1,000+), pursue more vigorously. Document everything. Be willing to escalate to small claims court if needed. But weight the math; not every claim is worth fighting.

---

# Chapter 8 — The 6-month migration timeline

Direct bookings don't appear overnight. The realistic path from 0% direct to 30% direct takes about six months of intentional work. This chapter is the month-by-month playbook.

## Month 1: Foundation

**Goals:** site live; basic capture mechanism in place.

**Tasks:**
- Sign up for Lodgify (or chosen platform).
- Build the direct-booking site (3–5 days of work).
- Connect Stripe and configure payment flow.
- Connect to channel manager so calendar sync works.
- Create the welcome book and departure card with direct site references.
- Test end-to-end with a fake booking.

**End-of-month state:** site is live, capable of accepting bookings, calendar sync working.

## Month 2: First Bookings

**Goals:** capture first direct bookings; refine the funnel.

**Tasks:**
- Update welcome book in property to include direct site reference.
- Print departure cards.
- Send first post-stay email sequence to recent guests (manually for now).
- Watch for first inbound direct inquiry.
- Tune any bottlenecks discovered (broken links, confusing copy, payment friction).

**End-of-month state:** 1–3 direct bookings, mostly from past guests responding to the welcome book or post-stay email.

## Month 3: Email Automation

**Goals:** automate the post-stay sequence; build the email list.

**Tasks:**
- Set up automated post-stay sequence in your email platform (or via cluster integration with InfluencerSoft).
- Configure trigger from booking checkout.
- Add new guests to the list automatically as they check out.
- Verify open and click rates on the first batch of automated emails.

**End-of-month state:** post-stay sequence running on autopilot; email list reaches 30–50 past guests.

## Month 4: SEO and Content

**Goals:** drive search traffic to the direct site.

**Tasks:**
- Add a blog section to the site.
- Write 2–3 articles answering specific guest questions ("Best restaurants near [Property]", "Hiking trails within 30 minutes of [Property]", "When to visit [Region]").
- Set up Google My Business profile for the property.
- Optimize the property's listing description for local SEO.

**End-of-month state:** 5–10 organic search visits per week to the direct site; a small but growing pipeline of new direct inquiries.

## Month 5: List Marketing

**Goals:** start active list marketing to drive recurring direct bookings.

**Tasks:**
- Send first quarterly newsletter to email list.
- Run a "direct bookings only" promotion (off-season discount, last-minute deal).
- Build an "early access" benefit for past guests (they see new dates open before public).
- Test SMS as a channel for high-engagement past guests (optional).

**End-of-month state:** measurable direct booking lift from email list activity; 10–15% of revenue now coming from direct.

## Month 6: Optimization and Scale

**Goals:** refine the funnel, increase conversion, hit the 30% target.

**Tasks:**
- Analyze the funnel: site visits → bookings, by source.
- Identify the highest-converting sources (organic search, past guests, referrals) and double down.
- Invest in any remaining gaps (better photos on the direct site, additional landing pages, better email subject lines).
- Test paid ads for direct bookings if the unit economics support it (typically only worth it for well-positioned properties at $200+ ADR).

**End-of-month state:** 25–35% of revenue from direct bookings; sustainable cadence; a list of past guests that compounds.

## Beyond month 6

Once you've hit 30% direct, the marginal effort per percentage point increases. Going from 30% to 40% takes roughly the same effort as going from 5% to 30% — the easy wins are done.

For most operators, 30% direct is the right resting point. Higher percentages require more aggressive marketing, more direct site investment, and more risk to your platform standing.

If you want to push beyond 30%:

- Consider paid acquisition (Google Ads, Facebook).
- Invest in the property's brand identity and content.
- Explore partnerships with local businesses.
- Build a referral program for past guests.

Each of these moves the needle but requires investment that may or may not pencil for your specific property.

## The honest math

A 30%-direct property at $80,000 revenue:

- Direct revenue: $24,000.
- OTA fees saved: ~$1,000.
- Stripe fees paid: ~$700.
- Net direct savings: ~$300/year per property.
- Plus: list value, algorithmic protection, brand equity.

The net savings are modest. The strategic value is real. Build direct because you want resilience, not because the per-booking math is dramatic.

---

# Sample policy templates

## Cancellation policy (moderate)

```
Cancellations made more than 14 days before check-in: full refund minus
3% processing fee.

Cancellations made 7–14 days before check-in: 50% refund.

Cancellations made within 7 days of check-in: no refund.

In the event of a confirmed natural disaster (hurricane, blizzard,
wildfire) affecting travel to the property, we offer rescheduling or
full refund regardless of timing.

Refunds are processed to the original payment method within 7 business
days.
```

## House rules

```
- Maximum occupancy: [X] guests
- Quiet hours: 10 PM – 7 AM
- No smoking inside the property
- Pets: [allowed/not allowed; specify]
- Events: no parties or events without prior written approval
- Damage: damage exceeding normal wear will be charged to the security
  deposit per the booking terms

Violation of house rules may result in early termination of stay
without refund.
```

## Damage deposit terms

```
A $[X] security deposit is pre-authorized at booking. The deposit is
released within 7 days of checkout if no damage is reported.

If damage occurs, you'll be notified via email within 72 hours of
checkout with photos and a repair estimate. You'll have 7 days to
respond before the deposit is charged.
```

---

# Glossary

**ACH.** Bank account transfer payment method. Cheaper than card for large bookings.

**Channel manager.** Software that synchronizes your booking calendar across multiple platforms (Airbnb, Vrbo, direct site).

**Chargeback.** A payment dispute initiated by the guest's card company. Hosts can defend with documentation.

**Direct booking.** A booking made on your own site, bypassing OTAs.

**OTA.** Online Travel Agency. Includes Airbnb, Vrbo, Booking.com, Expedia.

**Parity rules.** Some platforms (notably Airbnb) require pricing parity across channels. The 10% direct discount technically violates these rules but is widely tolerated.

**Stripe Radar.** Stripe's fraud-detection layer; flags suspicious transactions for review.

**Welcome book.** The printed (or digital) guide left at the property for guests, typically including check-in instructions, house rules, and local recommendations.

---

# About Daniel

Daniel Harrison runs a short-term rental in the western US and writes plain-English guides for STR owners at strmanuals.com. He's been operating direct bookings since 2021 and reached 35% direct revenue mix by month seven — alongside the readers this manual is written for.

You can reach him by replying to any STR Manuals email — replies go to a human. The next version of the manual gets sharper because of reader questions.

— Daniel
STR Manuals · 2026

---

*This manual is operational guidance, not legal advice. Consult applicable lodging regulations and a CPA before launching direct bookings, particularly for tax collection and remittance.*
