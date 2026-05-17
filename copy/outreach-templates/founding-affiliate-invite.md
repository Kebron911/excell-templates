# Founding Affiliate Invitation — Outreach Template

**Purpose:** Recruit the 10 founding affiliates listed in `infrastructure/affiliate-program/spec.md` §5.
**Owner:** Daniel
**Last reviewed:** 2026-05-16

---

## When to send

- After `infrastructure/affiliate-program/spec.md` is finalized
- After Rewardful + Stripe Connect are configured (so the recipient can sign up immediately)
- Before public affiliate program announcement (founding tier is closed)

## Order to send (one per day, not in a batch — looks human)

1. The host you have the warmest relationship with → reply rate ~70%
2. The host with the closest audience fit → reply rate ~50%
3. The biggest podcast/audience → reply rate ~20% but high upside

## Template

> **Subject:** Founding-affiliate slot (40% lifetime) — 10 invites total

> Hi {{ first_name }},
>
> Daniel from The STR Ledger here. I'm launching an affiliate program for our STR financial-ops templates and book, and I want to invite you to one of 10 founding-affiliate slots before it goes public.
>
> Quick why-you: I've followed {{ specific thing they do }} for a while. Your audience is the exact operator we built for — hosts who treat STR as a real business, not a side hustle. The crossover is dead-on.
>
> ### The founding-affiliate deal (closed list of 10)
>
> - **40% lifetime commission** on any referred sale (vs 30% public tier when we launch)
> - **Free lifetime access** to our entire template library + book + course (when it launches)
> - **60-day cookie**, last-click attribution, monthly Stripe Connect payouts
> - **Co-marketing** — we'll feature you in our launch announcement and tag you in everything we ship
> - **Done-for-you assets pack** — banners, swipe copy, podcast ad reads, image carousels — so you don't have to write a thing
> - **Direct line to me** — if a customer ever has an issue tracking back to you, I personally handle it within 24h
>
> ### What I need from you
>
> Nothing right now except a "yes I'm interested" reply. If yes, I'll send you:
> 1. Your unique affiliate link (active immediately)
> 2. Login to the asset pack
> 3. A 1-page onboarding doc (~5 min read)
> 4. My calendar if you want a 20-min call to talk through how it works
>
> No volume commitment. Use it or don't.
>
> ### Why I want you specifically
>
> {{ 2-3 sentences — what about THIS creator makes them right. Reference one concrete thing they've made/said/done. NOT generic flattery. }}
>
> ### Timing
>
> I'm sending these invites in order — you're invite #{{ number }} of 10. If you're in, fastest way is to reply with "yes" or pick a 20-min slot at {{ Calendar link }}.
>
> If not — totally fine, no hard feelings. If you know someone in your network who'd be a fit, the slot is transferable to anyone you recommend.
>
> Daniel
> The STR Ledger
> daniel@thestrledger.com
>
> P.S. Spec sheet for the full program is at thestrledger.com/affiliates (private until launch — you're seeing it 30 days early).

---

## Personalization checklist (per invite)

Before sending each invite, verify:

- [ ] First name is correct (not username, not handle, not @-prefix)
- [ ] "Why-you" reference is specific and recent (within last 60 days)
- [ ] "What I need from you" is dead-simple
- [ ] No grammar errors, no AI-style hedging ("hopefully", "potentially")
- [ ] Personal P.S. line is human-sounding
- [ ] Invite number (#X of 10) is correct
- [ ] Calendar link is fresh (not expired Cal.com)

## Common scenarios

### They reply "yes"
1. Reply within 4 hours
2. Send Rewardful invite link (their affiliate account auto-creates)
3. Send asset-pack login + 1-page onboarding doc
4. Schedule the optional 20-min call if they want one
5. Add their slug to `infrastructure/affiliate-program/spec.md` §5 (add the actual slug)
6. Within 48h, send them a personalized swipe-copy email customized to their audience tone

### They reply "tell me more"
1. Reply with the spec sheet attached (`infrastructure/affiliate-program/spec.md` exported as PDF)
2. Offer a no-pitch 20-min call to walk through it
3. Acknowledge any specific concern they raised
4. Don't push — let them decide

### They reply "no" or ghost
1. Don't push back
2. Move the slot to #11 — the wait-list goes to whoever pitches us first within 30 days of public launch (per spec.md §5)
3. Re-evaluate at 6-month checkpoint — if their audience grows, re-invite then

### They reply but want a bigger %
1. Cap at 40%. Don't negotiate the founding-tier rate — it's the same for all 10 by design.
2. Acceptable concession: extend the cookie to 90 days for this person if their content cycle is podcast-heavy (longer attribution windows fit better)
3. Hard no on: revenue-share beyond 40%, exclusivity demands, equity, gross-not-net commissions

---

## Tracking

Each invite gets a row in `ops/press-pipeline.yaml` under a `founding_affiliates` block:

```yaml
founding_affiliates:
  - prospect: "Rob Abasolo"
    invite_number: 1
    invite_sent: 2026-05-20
    status: "invited"  # invited|interested|onboarded|declined|wait
    reply_date: null
    onboarded_date: null
    affiliate_slug: null
    first_referred_sale_date: null
```

---

## Files

- `copy/outreach-templates/founding-affiliate-invite.md` (this file)
- `infrastructure/affiliate-program/spec.md` — the program spec referenced
- `ops/press-pipeline.yaml` — the active tracker
- `brand/affiliate-assets/` — asset pack (to populate as part of launch prep)
