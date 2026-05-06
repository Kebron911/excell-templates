# Free Magnet Sequence — STR Tax Loophole Explainer

**Spec reference:** STRManuals/charter.md §6 + design-spec.md §10. Lead-magnet sequence for the 8-page primer pulled from chapter 1 of TAX-01.

**Lead magnet:** *The STR Tax Loophole Explainer* — 8 pages. Plain-English on what the loophole is, who can use it, and a 3-question test for whether it applies to you.

**Trigger:** form submission on `strmanuals.com/free` (or homepage capture block).

**Default tags applied at entry:**
- `magnet:str-tax-loophole-explainer`
- `source:strmanuals`
- `acquired:<date>`

**Goal:** Day 0 deliver, Day 7 first soft pitch for TAX-01 with subscriber-only price ($24 vs $29), Day 14 graduate to biweekly broadcast cadence.

**Token conventions:**
- `{{ first_name | default: "there" }}`
- `{{ link_explainer }}` — generated download link, 7-day expiry
- `{{ link_tax_01 }}` — `/manuals/tax-01?utm_source=email&utm_campaign=free-magnet&utm_content=email{N}`
- `{{ link_subscriber_offer }}` — Stripe Checkout link with $5-off coupon, 48h expiry
- `{{ unsubscribe_url }}`

**Target conversion:** 3–5% of magnet subscribers buy TAX-01 within 30 days. Below 2% = sequence rewrite or magnet redesign.

---

## Email 1 — Day 0 — Deliver + the actual question

**Subject:** Your STR Tax Loophole Explainer (and the question every CPA dodges)

**Preheader:** It's the one I asked three CPAs before I got an answer that made sense.

```
Hey {{ first_name | default: "there" }},

Here's the file:

[Download The STR Tax Loophole Explainer (8 pages) →]({{ link_explainer }})

Quick context before you open it.

The first time I asked a CPA whether the "STR loophole" applied to me, I got three different answers from three different people. One of them was technically correct but wrong in spirit. Two were wrong outright. None of them gave me the actual rule in a sentence I could repeat back.

The 8 pages you just downloaded are what I wished someone had handed me three years ago. They cover:

  — What the loophole actually is, in two paragraphs
  — The 7-day average stay rule (and why it's not what you think)
  — A 3-question flowchart for whether your property qualifies
  — The three mistakes that disqualify hosts who think they qualify

Read it before tax season starts pressuring decisions. It's eight pages — fifteen minutes max.

I'll send a follow-up in two days about the one part of the rule that trips up the most people.

— Daniel
STR Manuals

P.S. If this lands in Promotions, drag it to Primary so the next four show up. Email providers are weird about new senders.

P.P.S. The full playbook (TAX-01) goes much deeper — the 7-day rule, the 30-day exception, material participation, documentation, cost segregation, and the eight mistakes that get returns flagged. But read the free 8 pages first; they'll tell you whether you even need it.
```

**Send-trigger:** `magnet:str-tax-loophole-explainer` tag added (instant)
**Send-delay:** 0
**Next-step tag on send:** `seq:strmanuals-free-magnet:e1-sent`

---

## Email 2 — Day 2 — The "what counts as 7 days" trap

**Subject:** "Average stay under 7 days" — what that actually means

**Preheader:** Most hosts get this wrong, and it doesn't bite them until an audit.

```
{{ first_name | default: "Hey" }},

Quick one today.

The 7-day rule is the gateway test for the STR loophole. It sounds simple: average stay under 7 days, you might qualify.

But "average stay" trips people up.

It's not the average reservation length on Airbnb. It's not the average length of stays you'd describe as "short." It's a specific calculation the IRS uses, and it takes about 90 seconds to do right and a year of audit pain to do wrong.

The 8-page explainer you downloaded covers the basic version. The full playbook (TAX-01) has the worked-out math, the edge cases (split bookings, blocked nights, owner-use days, last-minute cancellations), and the documentation you'd want if a letter shows up from the IRS three years from now.

[Read about The STR Tax Loophole Playbook →]({{ link_tax_01 }})

If you didn't open the explainer yet, do that first:

[Re-download The Explainer →]({{ link_explainer }})

— Daniel

P.S. Saturday's email is about the test that actually decides whether you can deduct anything — and why it's harder than the loophole rule itself.
```

**Send-trigger:** `seq:strmanuals-free-magnet:e1-sent`
**Send-delay:** +2 days
**Next-step tag on send:** `seq:strmanuals-free-magnet:e2-sent`

---

## Email 3 — Day 4 — Material participation (the actual gate)

**Subject:** The harder test most hosts haven't heard of

**Preheader:** The 7-day rule gets you eligible. This is what gets you the deduction.

```
{{ first_name | default: "Hey" }},

The STR loophole has two doors, not one.

Door 1: Average stay under 7 days. (Most hosts know this.)

Door 2: You materially participate in running the rental. (Most hosts don't know what this means.)

Material participation is the part the IRS actually cares about. It's the difference between "I own a property someone else manages" (no deduction) and "I run a business that happens to be a rental" (full deduction).

There are seven tests you can pass. Most STR owners use the 100-hour test or the 500-hour test. The 100-hour version requires that you participate at least 100 hours AND more than anyone else (cohost, cleaner, manager, family member).

That last bit — "more than anyone else" — is where things get interesting if you have a property manager.

The 8-page explainer touches on this. The full playbook walks you through:

  — All seven tests, ranked by usefulness for STR owners
  — What counts as "participation hours" (and what doesn't)
  — How to track it the way an auditor wants to see it
  — Spouse hours, cohost hours, cleaner hours — what helps you, what hurts you

[Read about The STR Tax Loophole Playbook →]({{ link_tax_01 }})

If you'd rather laser-focus on this specific topic, there's a separate manual:

[Material Participation Survival Kit →](https://strmanuals.com/manuals/tax-02)

— Daniel

P.S. Tuesday I'll send a one-time subscriber-only price on the playbook. After that we move to the biweekly cadence, where I send one tip and one product callout every other week. Easy unsubscribe if it's not for you.
```

**Send-trigger:** `seq:strmanuals-free-magnet:e2-sent`
**Send-delay:** +2 days
**Next-step tag on send:** `seq:strmanuals-free-magnet:e3-sent`

---

## Email 4 — Day 7 — Subscriber-only price (the soft pitch)

**Subject:** $5 off the playbook — for 48 hours

**Preheader:** First-week subscriber price. Once. No annual fake-urgency theater.

```
{{ first_name | default: "Hey" }},

Last subscriber-only thing I'll do for the playbook.

For the next 48 hours, The STR Tax Loophole Playbook is $24 instead of $29 — $5 off, list-only, no public coupon.

[Buy at the subscriber price ($24) →]({{ link_subscriber_offer }})

What you get:

  — 48-page plain-English manual covering the loophole top to bottom
  — Companion P&L workbook keyed to the playbook
  — Free updates inside v1 (tax law changes, I update the file)
  — 14-day "didn't help" refund — no interrogation, just email me

What it doesn't replace: a CPA. The manual is explainer content, not advice. But it'll make the conversation with your CPA shorter and sharper.

[Buy at the subscriber price ($24) →]({{ link_subscriber_offer }})

After Friday this email goes back to the regular $29 price and I move to the biweekly cadence. No more launch theater from me — promise.

— Daniel

P.S. Already own the playbook? Tell me what was useful and what wasn't. Your reply goes to a human, and feedback shapes the next major version.
```

**Send-trigger:** `seq:strmanuals-free-magnet:e3-sent`
**Send-delay:** +3 days (Day 7)
**Next-step tag on send:** `seq:strmanuals-free-magnet:e4-sent`

---

## Email 5 — Day 14 — Graduating to biweekly

**Subject:** Welcome to the biweekly cadence

**Preheader:** Plus what's coming next from STR Manuals.

```
{{ first_name | default: "Hey" }},

Quick one — the welcome sequence is done.

From here on you'll hear from me every other Tuesday. One tip, one product callout, and one link to a workbook or article worth your time. That's the whole format. No "Hey {{ first_name }}, hope your week is treating you well!" filler.

What's queued up:

  — A new manual every 4–6 weeks (next: Material Participation Survival Kit, Why Are My Bookings Down?)
  — Quarterly tax-law updates if anything material changes
  — Annual rebuild of the playbook for each tax year

If the cadence doesn't fit your inbox, the unsubscribe is one click and I won't take it personally:

[Unsubscribe →]({{ unsubscribe_url }})

If you'd rather grab everything at once, the five-manual bundle is $99 (saves $46):

[The bundle →](https://strmanuals.com/bundle)

— Daniel

P.S. If you haven't read the free 8-page explainer yet: it's right here.

[Re-download The Explainer →]({{ link_explainer }})
```

**Send-trigger:** `seq:strmanuals-free-magnet:e4-sent`
**Send-delay:** +7 days (Day 14)
**Next-step tag on send:** `seq:strmanuals-free-magnet:complete`

---

## Sequence exit

After Email 5, contact moves to the cluster-wide biweekly broadcast cadence with `audience:strmanuals-list` tag. Buyers (anyone with `product:*` tag) are excluded from "haven't bought anything" re-pitches automatically.

If contact buys TAX-01 mid-sequence, n8n removes them from the magnet sequence and drops them into the order-confirmation sequence (`strmanuals-order-confirmation.md`). No double-emailing.
