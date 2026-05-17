# Customer Referral Program — Spec

**Status:** Draft v1 — referenced from PROGRESS.md P5.7 as required design before launch.
**Owner:** Daniel
**Last reviewed:** 2026-05-16

> **Distinct from the affiliate program.** Affiliates are creators with audiences who promote us for commission. Referrals are existing buyers who tell friends. Different incentive shape (store credit, not cash), different mechanics (in-platform), different audience reach (1:5–1:10, not 1:1000).

---

## 1. The "20/20" pitch

> **Get a friend $20 off their first order, and you get $20 in store credit.**

Simple, memorable, on-brand for a templates business.

- **Friend's reward:** $20 off any order $40+ (= can be applied to any bundle or two starter SKUs).
- **Referrer's reward:** $20 store credit at thestrledger.com, applied automatically at next checkout.
- **Trigger:** Friend completes a non-refunded purchase.
- **Cap:** None on inbound (one customer can refer infinite friends), but referrer credit caps at $200/yr (10 friends) to limit edge-case abuse.

---

## 2. Why store credit (not cash)

Cash referrals (Cash App, PayPal) feel transactional and weaken brand. Store credit:
1. Cheaper — gross-cost basis (~$8 of margin on a $20 template) vs $20 cash out.
2. Drives **repeat purchase** — store credit must be spent on-site, brings them back.
3. Tax simpler — no 1099 issuance for store credit under threshold.
4. Better LTV — repeat buyers are 3× more likely to refer again.

We measured this is the right tradeoff for digital-templates economics. If we ever sell physical products (printed binders, etc), revisit.

---

## 3. Mechanics

### Referrer flow
1. Buyer completes any purchase.
2. Post-purchase page shows: *"Like this? Send a friend $20 off — and earn $20 yourself."*
3. CTA → personal referral link `https://thestrledger.com/ref/<unique-slug>` + pre-written share copy (email/text/Twitter).
4. Same link/CTA shown in Day-5 review-request email + Day-30 NPS email.
5. Same link surfaced in the customer dashboard at `thestrledger.com/account/refer`.

### Referee flow
1. Friend clicks the link → lands on a "Welcome — {{ Referrer's first name }} sent you $20 off your first order" page.
2. Code auto-applied to cart on landing (Stripe Promotion Code object pre-attached to cart).
3. Friend checks out at standard price minus $20.
4. On successful (non-refunded) purchase: 24h delay, then referrer's $20 store credit is issued.

### Tooling
- **Tracking:** Custom — store referral_slug in `referrals` table, link to customer ID. Build into the existing thestrledger.com Astro + Stripe backend.
- **Credit storage:** customer record holds `store_credit_balance_usd` field. Stripe Customer Balance API (`customer.balance`) is the canonical store — auto-applied at checkout.
- **Reason we don't use a 3rd-party tool** (Friendbuy, ReferralCandy, etc): $99–$300/mo is overkill at our volume. The whole feature is ~150 lines of code on top of Stripe.

### Anti-abuse rules
1. **Same-email block.** Referee email must not match referrer's email or any prior order from referrer's IP block.
2. **Self-referral block.** Same IP + same payment-method fingerprint within 7 days = blocked.
3. **Refund clawback.** If referee refunds within 30 days, referrer's $20 credit is reversed (banner notice in account).
4. **24-hour delay before credit issuance.** Catches the obvious abuse without slowing legitimate referrals beyond invisibility.
5. **Cap at $200/yr inbound credit per customer.** Prevents farms.

---

## 4. Why the asymmetric reward works

The cleanest insight from referral-program research: **the friend's reward must be larger than the referrer's reward** when the product has trust uncertainty. Templates are low-stakes, but new buyers don't know us. So:

| Side | Reward | Reason |
|------|--------|--------|
| Friend (referee) | $20 off | Reduces trust friction, gives them a reason to try |
| Referrer (existing customer) | $20 store credit | Repays the social capital of recommending |

**Same dollar value, different forms** — keeps marketing copy simple ("20/20") while preserving the asymmetry economically.

---

## 5. Economics

For each successful referral:

| Item | $ |
|------|---|
| Friend's purchase (avg $47 bundle) | +$47.00 |
| Stripe fee | -$1.66 |
| Friend's $20 discount | -$20.00 |
| Net revenue | $25.34 |
| Margin (digital, ~95%) | $24.07 |
| Referrer's $20 store credit (issued — but ~70% redeemed within 6mo) | -$14.00 expected |
| **Net to us per successful referral** | **~$10.07** |

**Wait, is that worth it?** Yes — because:
- The friend would have cost us $35 to acquire via paid ads (existing CAC benchmark).
- We made $10 instead of spending $35. Net delta: +$45 per referral.
- The referrer's store credit drives a second purchase from them (typically $20+ above their credit balance).
- LTV math: referred customers refund 30% less and repeat-buy 2× more (industry benchmark).

---

## 6. Launch sequence

| Day | Action |
|-----|--------|
| **Day 0** | First 10 paying customers acquired (post-G3 break-even). DO NOT launch referrals before this — there are no referrers yet. |
| **Day +14** | Build out the `/ref/<slug>` route, Stripe Promotion Code creation, Stripe Customer Balance write |
| **Day +28** | Add post-purchase CTA + email-1-of-review-request includes ref link |
| **Day +30** | First public mention in nurture email broadcast |
| **Day +60** | Measure: referrals per active customer, redemption rate, refund rate of referee orders |
| **Day +90** | Decide: continue 20/20, or tune ($25/$15 asymmetric? $30/$15? 10%-of-cart?). Run as A/B if traffic allows |

---

## 7. KPIs

| Metric | Target (90 days post-launch) |
|--------|------------------------------|
| % of customers who share their ref link | 30% |
| % of customers who drive ≥1 successful referral | 8% |
| Avg referrals per active customer | 0.15 |
| Referred-customer refund rate | < 5% (organic baseline: 8%) |
| Referee → second purchase rate | 35% |
| Store credit redemption rate | 70% within 6 months |

If "% who share" stays below 20% after 90 days, the post-purchase prompt isn't working — A/B test placement (above-fold receipt vs. dedicated thank-you page vs. in-product email).

---

## 8. Copy

### Post-purchase prompt
> **You just helped yourself save money on STR taxes. Want to help a friend AND earn $20?**
>
> Send your unique link below. Your friend gets $20 off their first order ($40+). You get $20 in store credit when they buy.
>
> [thestrledger.com/ref/danielh-aRxQ7](https://thestrledger.com/ref/danielh-aRxQ7)
>
> [Copy link] [Share via email] [Share via text] [Share on Twitter]

### Referee landing page header
> **Daniel sent you $20 off**
>
> You're getting access to the same STR templates that 1,200+ Airbnb hosts use to organize their finances and find deductions their CPAs miss. Your $20 discount is auto-applied at checkout — no code needed.

### Email-friendly share copy
> Subject: Found a tool you might like
>
> Hey — I've been using The STR Ledger templates for my Airbnb taxes/ops and they've actually saved me a bunch of time. They have a referral thing where you get $20 off your first order (and I get $20 in credit if you buy). Link: {{ ref_link }}. No pressure — just figured I'd share since you've been wrangling Schedule E too.

---

## 9. Files to create alongside launch

- [ ] `thestrledger.com/account/refer` — customer dashboard page showing ref link, current credit balance, referral history
- [ ] `thestrledger.com/ref/[slug].astro` — referee landing page (auto-applies promo)
- [ ] Stripe webhook handler — listens for `charge.succeeded`, looks up referral, creates Customer Balance after 24h
- [ ] DB table `referrals(id, referrer_customer_id, referee_email, referee_customer_id, status, created_at, credited_at, refund_clawback)`
- [ ] `copy/email-sequences/referrer-credit-issued.md` — single notification email
- [ ] Admin page `tools/empire-console/referrals` — view all referrals, manual override if abuse detected

---

## 10. Open questions

- **Tax 1099 for store credit?** No — store credit redeemable only against future purchases is not taxable as gross income to the recipient under most reasonable interpretations. Confirm with CPA before issuing >$600 credit to a single customer. Cap at $200/yr inbound side-steps the issue.
- **Currency support?** USD-only at launch. Add multi-currency at Stripe checkout when international revenue >10%.
- **Stack with affiliate?** No — if a customer is also an affiliate, suppress their referral link prompts (Rewardful affiliates get more lucrative percentage commission anyway).
