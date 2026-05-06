# Win-Back Sequence — Dormant Subscribers

**Trigger:** subscriber has not opened any email for 60 consecutive days AND is not on any active sequence
**Tag at entry:** `win-back:active`
**Sequence length:** 3 emails over 21 days, then sunset decision
**Target outcome:** 8-15% re-engagement (any open or click). Non-engagers move to sunset; aggressive list hygiene protects deliverability.

**Tokens:** `{{ first_name }}`, `{{ months_since_last_open }}`, `{{ link_newsletter_archive }}`, `{{ link_unsub }}`, `{{ link_top_post }}`

**Suppression:**
- If subscriber is a paying customer (any tag `customer:*`) within 12 months, do NOT enter win-back — they're allowed to be quiet
- If subscriber opens any email during the sequence, exit immediately and clear `win-back:active`
- After sequence completion with zero opens: tag `sunset:pending`, remove from broadcast list (kept in CRM, no longer emailed)
- Sunset is a deliverability decision, not a punishment — silent recipients depress inbox-placement scores for engaged subscribers

---

## Email 1 — Day 0 — Are you still in?

**Subject:** {{ first_name | default: "Hey" }} — should I keep emailing you?

**Preheader:** Honest question. {{ months_since_last_open }} months since you last opened.

```
{{ first_name | default: "Hey" }},

Honest question: it's been {{ months_since_last_open | default: "a while" }} months since you opened anything from me, and I'd rather you tell me to leave than keep showing up uninvited.

Three options. Pick one:

**1. Stay in — I just got busy.**
Click anywhere in this email (the link below works). I'll keep sending the newsletter and stop counting opens for a while.

→ [Yes, keep me on]({{ link_newsletter_archive }})

**2. Quiet for now — newsletter only, no other emails.**
Reply with the word "quiet" and I'll move you to the once-a-month digest list (no product launches, no sequences, just the newsletter).

**3. I'm out — unsubscribe me.**
→ [Unsubscribe]({{ link_unsub }})

Whichever you pick is fine. The only thing that doesn't help either of us is silence — Gmail and Outlook punish me for sending to people who never open, and that hurts the inbox placement of people who actually want to hear from me.

— Emily · The STR Ledger

P.S. If you're still on the fence about STR investing, that's also a perfectly fine reason to leave. The newsletter is for operators who are in the work. Coming back later is always an option.
```

---

## Email 2 — Day 7 — One concrete thing you missed

**Subject:** The cleaning-fee mistake costing hosts $4-7K/year

**Preheader:** Sample of what the newsletter actually sends. Then I'll quiet down.

```
{{ first_name | default: "Hey" }},

Quick test before I assume you're gone.

Here's a real piece of what you've been missing — the actual newsletter content, not a pitch:

> Most hosts price the cleaning fee at "what the cleaner charges + $20 buffer." That feels reasonable until you realize: high cleaning fees suppress booking conversion 12-18%, AND Airbnb buries listings with cleaning-fee-to-nightly-rate ratios above 0.4. The optimal pricing is usually $40-80 *under* what hosts initially set — counterintuitive, but the math is consistent across every market I've analyzed.

That's the kind of thing the newsletter sends, weekly, free. No fluff, no SKU pitches in 80% of issues.

If that's useful — keep me in your inbox by [clicking here]({{ link_top_post }}) (loads the full article on cleaning fee math).

If it's not your thing — totally fine, [unsubscribe here]({{ link_unsub }}) and I'll stop. No hard feelings.

— Emily

P.S. One more email after this, then I'll go quiet on my own. Promise.
```

---

## Email 3 — Day 21 — Last note + sunset

**Subject:** Going quiet — last note from me

**Preheader:** Removing you from broadcast. Not deleted, just paused.

```
{{ first_name | default: "Hey" }},

This is the last one for now.

Since there's been no opens in {{ months_since_last_open | default: "a while" }} months, I'm moving you off the active broadcast list — your email stays in the system (so you can come back any time without re-subscribing), but you'll stop hearing from me.

If you want to opt back in later: thestrledger.com/newsletter resubscribes you in 10 seconds.

If you want a clean break: [Unsubscribe completely]({{ link_unsub }}).

Either way — thanks for being on the list at all. STR investing is a slow game and most people who subscribe are still figuring out whether the work fits them. That's fine. Coming back when the timing's right is always allowed.

— Emily · The STR Ledger

P.S. If something specific made you tune out (too many emails, wrong topics, life got busy) and you want to tell me — reply to this. I read every reply. The list gets better when people tell me what didn't work.
```

---

## After sequence

- **Tags set:**
  - If any open during sequence: `win-back:reactivated` (re-enter normal nurture)
  - If zero opens: `sunset:pending` → after 7-day buffer, move to `sunset:active` (suppressed from broadcast, retained in CRM)
- **Re-entry:** subscriber can re-add themselves via newsletter signup at any time; tag `win-back:reactivated` if returning within 90 days of sunset
- **Suppression:** 365 days on win-back sequence (don't ask same dormant subscriber twice in a year)

## Iteration log

- `2026-05-05` — Initial draft. Three-touch sunset is the deliverability standard (Klaviyo / Mailchimp / Substack all converge on this pattern). Email 1 = explicit ask with three clear options. Email 2 = "show, don't tell" — a real piece of newsletter content as proof of value, not a "we miss you" pitch (proven to under-perform). Email 3 = clean exit, no guilt, framed as a positive list-hygiene action. No discount, no "come back" coupon — discounting to dormant subs trains the broader list to ignore broadcast and wait for win-back deals.
