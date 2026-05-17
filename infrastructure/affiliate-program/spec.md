# Affiliate Program — Spec

**Status:** Draft v1 — referenced from PROGRESS.md P5.7 as the required design before launch.
**Owner:** Daniel
**Last reviewed:** 2026-05-16

> Scope: Own-site only (thestrledger.com checkout). Etsy and Gumroad have their own (incompatible) affiliate systems — we do not run those here.

---

## 1. Goals

1. Turn STR creators (coaches, hosts-with-an-audience, YouTubers, newsletter operators) into a perpetual top-of-funnel that compounds without our time.
2. Acquire customers we couldn't reach via organic (their warm audience).
3. Stay break-even-or-better at the unit level: commission must come out of margin, not from the principal product price.

**Non-goals (v1):**
- Multi-tier (sub-affiliate). Adds complexity, doesn't move needle at our volume.
- Coupon-code affiliates. Confuses attribution and triggers price-conscious customers. Link-only.
- High-touch white-glove partnerships. Those run separately under "JV deals" — see `copy/outreach-templates/jv-deal.md`.

---

## 2. Economics

| Lever | Value | Reasoning |
|-------|-------|-----------|
| Commission rate | **30%** of net revenue (post-Stripe fee, pre-tax) | Standard for digital templates/books; lower than course/SaaS (40–50%) but margin is mostly preserved |
| Cookie window | **60 days, last-click** | 60 days = newsletter ↔ blog ↔ podcast cycle. Last-click = lower disputes than first-click |
| Payout threshold | **$25 minimum** | Below this, processing fees eat it |
| Payout cadence | **Monthly, net-30** | Aligns with Stripe Connect default; allows clawback for refunds |
| Refund clawback | **Full clawback if refund within 30 days** | Buyers refund within 30 days; clawback after 30 = headache > value |
| Eligible products | **Own-site SKUs + bundles + STRManuals + (later) course** | Excludes free magnets |
| Exclusions | Affiliate cannot self-purchase via their own link; checks via email + IP match | Standard anti-abuse |

### Unit-economics sanity check

For a $47 bundle:
- Stripe fee: 2.9% + $0.30 = $1.66
- Net revenue: $45.34
- Affiliate commission (30%): $13.60
- **Net to us:** $31.74 (67% retained)

For a $27 product:
- Stripe fee: $1.08
- Net revenue: $25.92
- Affiliate commission (30%): $7.78
- **Net to us:** $18.14 (67% retained)

Acceptable. The $17 starter SKUs net us $11/sale after affiliate — viable but thin. Consider excluding $17 SKUs from affiliate, OR setting them at 25% commission for the entry tier.

---

## 3. Tooling

**Selected: Rewardful** (https://www.rewardful.com)
- Stripe Connect native; pulls Stripe metadata automatically.
- $99/mo at our expected volume (Growth tier — handles up to 1500 visitors/mo).
- Last-click attribution, cookie-based, supports refund clawback.
- Affiliate dashboard out-of-box; affiliate-self-service signup; payout via Stripe Connect.

**Considered + rejected:**
- LemonSqueezy affiliates — bundled but requires switching off Stripe; not happening.
- FirstPromoter — similar pricing, less mature Stripe integration.
- Manual + Airtable — only fine if <10 affiliates; doesn't scale.

**Alternative if Rewardful budget is tight at launch:** start with their free tier (up to $7,500 GMV processed) and upgrade at G3 break-even.

---

## 4. Affiliate tiers

| Tier | Threshold | Commission | Perks |
|------|-----------|------------|-------|
| **Founding (closed list)** | First 10 invited | 40% lifetime | Free Vault tier, monthly creator call, co-marketing |
| **Affiliate** | Anyone post-launch | 30% (60-day cookie) | Standard dashboard + assets pack |
| **Pro** | $1,000 lifetime referred | 35% (90-day cookie) | Custom landing page, name in case-study email |

Pro tier auto-upgrades when threshold hit (Rewardful supports tier rules).

---

## 5. Founding affiliates list (10)

To recruit before launch. Each gets:
- Lifetime 40% commission
- Free access to all templates + bundles + STRManuals
- Personal onboarding call with Daniel
- Dedicated Slack/Telegram channel

Prospects (research + outreach in `copy/outreach-templates/jv-deal.md`):
1. Rob Abasolo (Robuilt) — YouTube + community
2. Sean Rakidzich (Airbnb Automated) — YouTube
3. Annie Sloan (BiggerPockets STR forum operator) — newsletter
4. Avery Carl (The Short Term Shop) — newsletter + podcast
5. Sarah & Tim Bratz (Generational Wealth STR) — podcast
6. Bill Faeth (Build STR Wealth) — podcast + group
7. Mike Sjogren (Short Term Rental Secrets) — community
8. Sabrina Guler (Hostfully) — Hostfully audience cross-pitch
9. Riley Mott (independent host-creator) — Twitter
10. Reserve slot #10 for whoever pitches us first within 30 days of launch (organic discovery)

Outreach email template: see `copy/outreach-templates/founding-affiliate-invite.md` (to-create).

---

## 6. Promotional assets pack (`brand/affiliate-assets/`)

Each affiliate is given access to:

- **Banner ads**: 728×90, 300×250, 160×600, 970×250 — all 5 SKU/bundle variants
- **Social images**: 1200×628 (FB/LI), 1080×1080 (IG square), 1080×1920 (IG/TikTok story), 1000×1500 (Pinterest)
- **Email swipe copy**: 5 pre-written promotional emails (intro, deep-dive, urgency, testimonial, last-call)
- **Twitter/X swipe**: 10 tweets, 3 threads
- **YouTube description template**: filled-in version they can paste under their video
- **Podcast ad reads**: 30-second + 60-second scripts
- **Honest review template**: a "here's what the templates do/don't do" framework so affiliate reviews stay credible

**Save location:** `brand/affiliate-assets/` (to-create — initially empty; populate Week-1 of program launch).

---

## 7. Tracking + attribution

Affiliate link format: `https://thestrledger.com/?via=<slug>` (Rewardful default)

Rewardful drops `referral` cookie on landing; Stripe Checkout reads it via metadata; commission auto-attributes.

UTM convention overlay (so we also track in GA4):
```
?via=<slug>&utm_source=affiliate&utm_medium=<channel>&utm_campaign=<campaign>
```

`<channel>` values: `email`, `youtube`, `podcast`, `twitter`, `instagram`, `blog`, `other`.

Reporting view in GA4:
- Affiliate-attributed sessions → first/last source breakdown
- Conversions tagged with `referral_slug` event parameter
- Monthly affiliate report cron → posts to Slack #affiliates channel

---

## 8. Anti-abuse rules

1. **Self-purchase ban.** Affiliate cannot buy via own link. Rewardful detects this; we also email-match.
2. **Coupon stacking ban.** Affiliate links don't apply additional codes; affiliate cannot share their personal "founder discount" if granted.
3. **Spam attribution ban.** If a single referral_slug generates >100 abandoned-cart events with no purchases, auto-suspend pending review (likely bot stuffing the cookie).
4. **Self-deal ban.** Affiliate cannot create a customer account with the same domain (e.g. @yourstrcoach.com) and use their own link.
5. **Refund clawback always.** No exceptions — applies to founding tier too.

---

## 9. Launch sequence

| Phase | Trigger | Action |
|-------|---------|--------|
| **Week -2** | Pre-launch | Stand up Rewardful + Stripe Connect; create affiliate-asset pack; draft founding-affiliate outreach |
| **Week -1** | Pre-launch | Email 10 founding-affiliate prospects + onboard those who say yes |
| **Day 0** | Launch | Open public affiliate signup at `thestrledger.com/affiliates`; tweet/email about it |
| **Day +14** | Launch+2wk | First payout (covers any pre-launch tip-of-spear referrals) |
| **Day +30** | Launch+1mo | Review: who's converted? Promote top-2 to Pro tier; nudge bottom-2 with help offer |
| **Day +90** | Launch+3mo | Add second cohort if economics work; consider course-only affiliate tier later |

---

## 10. KPIs

| Metric | Target (90 days) | Target (12 months) |
|--------|------------------|---------------------|
| Active affiliates (≥1 click/mo) | 8 | 30 |
| Affiliate-attributed revenue / total | 10% | 25% |
| Cost per affiliate-acquired customer | < $20 (vs $35 for paid ads target) | < $25 |
| Refund rate on affiliate sales | < 6% (parity with organic) | < 6% |
| Affiliate NPS (qrtly survey) | 40+ | 50+ |

If affiliate-attributed revenue stays under 5% at 90-day mark, kill the program or restructure — the maintenance overhead isn't paying.

---

## 11. Files to create alongside launch

- [ ] `copy/outreach-templates/founding-affiliate-invite.md` — outreach email to the 10 founding affiliates
- [ ] `thestrledger.com/affiliates` — Astro page (T&Cs, signup CTA → Rewardful)
- [ ] `thestrledger.com/affiliates/terms` — affiliate T&Cs (anti-abuse rules section turned into legal)
- [ ] `brand/affiliate-assets/` — promotional assets pack (banners, swipe copy, etc.)
- [ ] `infrastructure/n8n/workflows/W21-affiliate-cycle.json` — already drafted, needs final wiring to Rewardful webhook + Slack reporter
- [ ] `copy/email-sequences/affiliate-welcome.md` — 3-email onboarding sequence (welcome / first asset / first commission report)

---

## 12. Open questions

- **Stripe Connect or Wise for payouts?** Stripe Connect for US-only; Wise for international affiliates. Start US-only; add Wise at affiliate #11.
- **Tax docs.** W-9 from US affiliates, W-8BEN from international. Auto-collected by Rewardful at $600 lifetime mark.
- **VAT/sales tax handling?** Out of scope v1 — we don't currently sell to EU at scale. Revisit if EU traffic hits 10% of revenue.
