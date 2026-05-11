# STR Tax & Financial Excel Template Platform — Master Strategy Design

**Status:** Draft v1 — awaiting user review
**Date:** 2026-04-22
**Author:** Daniel Harrison (via brainstorming skill)
**Scope:** End-to-end strategic design for a digital Excel-template business targeting short-term rental (Airbnb/VRBO) hosts, anchored on a tax-and-financial beachhead.

---

## 0. Executive Summary

### One-line thesis
> We sell business-grade Excel financial and operational systems to serious Airbnb hosts, anchored on a tax beachhead, distributed through a multi-storefront network, and compounded by email, affiliates, and community — 95% automated end to end.

### Locked decisions (the nine pillars)

| # | Decision | Choice |
|---|---|---|
| 1 | Niche | Short-Term Rental (Airbnb/VRBO) hosts |
| 2 | Beachhead sub-niche | STR tax & financial templates |
| 3 | Primary persona | Semi-Pro Sarah (3–10 properties, operates STR as a business) |
| 4 | Brand identity | Hybrid — faceless storefront with founder-story arm |
| 5 | Product ladder | 7 tiers — Free → Tripwire → Core → Premium → Bundle → Vault → Recurring/DFY |
| 6 | Hub platform | Influencersoft + Stripe Tax + Ghost/Astro blog |
| 7 | Source of truth | Airtable (Phase 1–2); Postgres/Supabase replica in Phase 3+ |
| 8 | Automation engine | n8n self-hosted (AI ops via Claude MCP over Airtable) |
| 9 | Launch sequence | Etsy-MVP in Weeks 1–2, full stack by Week 8, Day 1 revenue |

### Year 1 financial targets
- Month 3: $3–5K/mo
- Month 6: $12–20K/mo
- Month 9: $25–40K/mo
- Month 12: $30–60K/mo
- Year 1 revenue mix: ~55% product sales, 15% membership, 10% affiliate, 8% DFY, 7% courses, 5% other

---

## 1. Brand Identity

**Model: Hybrid**

- Primary experience is a **faceless brand** (e.g., working name "BNB Ops Co." or similar). Etsy/Gumroad storefronts, Pinterest/TikTok content, SEO blog all operate without the founder's face or full identity.
- A dedicated **founder-story page** exists on the hub site, with a soft on-ramp for buyers who want premium services or coaching.
- The **personal-brand arm** (YouTube, podcast appearances, direct coaching, mastermind) activates in Phase 3 once the faceless engine is generating predictable cash flow.

**Why hybrid:** preserves the 95% automation goal immediately, defers camera-work investment until revenue justifies it, and leaves the high-ticket services door open for Phase 3+ without locking into camera-dependent content early.

---

## 2. Persona Deep-Dive

### The 5 STR sub-personas mapped

| # | Archetype | Properties | AOV tolerance | Priority |
|---|---|---|---|---|
| 1 | Dreamer Dana (no property yet) | 0 | $7–27 | Deprioritize |
| 2 | Newbie Nick/Nina (first listing) | 1 | $17–47 | Deprioritize |
| 3 | Side-Hustle Sam (W2 + 1–2 listings) | 1–2 | $27–97 | **Secondary (volume)** |
| 4 | **Semi-Pro Sarah** | 3–10 | $47–297 | **Primary (bullseye)** |
| 5 | Pro Pam (co-host / PM) | 10–50 managed | $197–497+ | Tertiary (Phase 2+) |

### Primary persona — Semi-Pro Sarah

- 38–55, female-skewing, married to W2 partner; she runs the STR portfolio as "the real business."
- Household income $200K+; STR gross $150–500K/yr.
- **Top pains:** tax season anxiety, cleaner chaos, pricing guesswork, partner asking "where are the real books?"
- **High AOV tolerance** because she's protecting a $150K+ income stream — a $297 template is rounding error.
- **Multi-property = repeat buyer** by definition.

### Where Sarah lives (channel density ranking)

1. Facebook host groups (Airbnb Hosts, Furnished Finder Hosts, STR Formula, BNB CEO Moms, etc.) — **primary home turf**
2. Pinterest — planning mode, high buyer intent
3. Instagram — design/aesthetic research
4. BiggerPockets STR forum — evening research, high-trust recs
5. Podcasts (STR Formula Show, Get Paid for Your Pad, Thanks for Visiting)
6. Google / SEO — problem-aware searches ("airbnb tax spreadsheet")
7. Email — 40%+ open rates on STR-specific lists

Sarah is **not** meaningfully on TikTok, LinkedIn, Reddit (primary), or Twitter/X.

### Secondary persona — Side-Hustle Sam

- 28–45, mixed gender, W2 + 1–2 STRs.
- Fuels top-of-funnel volume. Buys tripwires, joins the email list, upgrades to Sarah-tier within 18 months.
- Primary channels: TikTok, r/AirBnB, FB groups, YouTube.

### Tertiary persona — Pro Pam (Phase 2+)

- 30–55, manages 10–50 units for owners.
- Highest AOV ($197–497+ per bundle), B2B, slowest sales cycle.
- Phase 2+ only. Recruit via Hostfully marketplace, PM FB groups, LinkedIn, BiggerPockets.

---

## 3. Product Ladder & Complete Template Catalog

### 3.1 — The 7-tier product ladder

| Tier | Name | Price Band | Purpose |
|---|---|---|---|
| 0 | Free lead magnets | $0 | Email capture, top-of-funnel |
| 1 | Tripwires | $9–27 | Impulse buy, Etsy harvest, card-on-file |
| 2 | Core products | $37–97 | Workhorse singles, one-problem-solvers |
| 3 | Premium products | $147–297 | Portfolio-level, tax-complex, multi-property |
| 4 | Bundles | $97–797 | AOV driver, persona-curated |
| 5 | The Vault | $1,497 (or $997 launch) | Lifetime, all templates |
| 6 | Membership / DFY | $37/mo, $297/yr, $1.5–3K per DFY | Recurring + services |

### 3.2 — Complete template catalog (65 templates across 10 categories)

All templates are Excel-native. Individual design will happen iteratively with user input; this spec establishes the universe, not the specs of each template.

> SKU numbers below are stable identifiers — gaps (e.g., #29, #39, #44, #45, #56, #65, #66) are intentional. Those SKUs were retired from the catalog on 2026-05-02 (Subject-to acquisition tracker, HOA/condo fee tracker, Local recommendations template, Check-in/out instructions builder, Photo-performance A/B tracker, SOP library index, VA task tracker). Existing template briefs cross-reference SKU numbers, so numbering is preserved with gaps rather than re-sequenced.

**📊 A. Financial / Accounting (20 templates)**
1. Multi-property master P&L dashboard — T3
2. Single-property P&L — T2
3. Schedule E tax prep workbook (passive STR) — T3
4. Schedule C tax prep workbook (active/material participation STR) — T3
5. Self-employment tax calculator — T2
6. Depreciation tracker (5/7/15/27.5/39-yr) — T3
7. Cost segregation tracker + bonus depreciation planner — T3
8. Section 179 planner — T2
9. Mileage log (auto IRS-rate) — T1
10. Per-diem meal deduction tracker — T1
11. Home office deduction allocator — T2
12. 1099-NEC contractor tracker — T2
13. Quarterly estimated tax calculator — T2
14. 12-month rolling cash flow forecaster — T3
15. DSCR tracker — T2
16. Break-even occupancy calculator — T2
17. RevPAR / ADR / Occupancy dashboard — T3
18. Year-over-year comparison workbook — T2
19. Multi-entity (LLC-per-property) consolidated P&L — T3
20. Partnership distribution tracker — T3

**🏠 B. Acquisition / Underwriting (11 templates)**
21. STR deal analyzer (single property) — T2
22. 3-property side-by-side comparison — T2
23. AirDNA data integrator — T3
24. Rehab budget + ROI projection — T2
25. Furniture/setup budget calculator — T2
26. 5-year pro-forma builder — T3
27. BRRRR-to-STR refi math — T3
28. Seller-finance offer calculator — T2
30. 1031 exchange tracker (STR → STR) — T3
31. Cost-to-launch calculator (all-in Year 1) — T2
32. STR vs LTR yield comparison — T2

**🧹 C. Operations / Daily Management (8 templates)**
33. Turnover checklist + cleaner scorecard — T1
34. Cleaning cost per-turnover tracker — T1
35. Supply inventory + par-level restock calculator — T2
36. Damage claim + Aircover log — T2
37. Maintenance log + vendor CRM — T2
38. Utility usage + trend tracker — T1
40. Insurance policy tracker (expiration alerts) — T1
41. License/permit/STR-regulation tracker by city — T2

**👋 D. Guest Experience (3 templates — the Etsy traffic gateway)**
42. Welcome book template ⭐ — T1 (Trojan horse on Etsy)
43. House rules builder — T1
46. Pet policy document — T0/T1

**💰 E. Pricing / Revenue Management (6 templates)**
47. Dynamic pricing calculator (season/day/event) — T2
48. Competitor rate tracker — T2
49. Minimum-night-stay optimizer — T2
50. Cleaning fee optimizer — T2
51. Holiday/event pricing calendar — T1
52. PriceLabs/Wheelhouse/Beyond ROI comparison — T2

**📣 F. Marketing / Growth (3 templates)**
53. Listing SEO audit + scoring — T2
54. Review response tracker + template library — T1
55. Referral source + repeat guest CRM — T2

**⚖️ G. Legal / Compliance / Risk (4 templates)**
57. STR license renewal calendar — T1
58. Transient occupancy tax (TOT) filing calendar — T2
59. Guest screening log + ban list — T1
60. Insurance claim log — T1

**👥 H. Team / Co-hosting / Scaling (4 templates — Pro Pam)**
61. Cleaner CRM + payroll — T3
62. Owner reporting dashboard — T3
63. Commission/split calculator for co-hosts — T3
64. Multi-owner consolidated reporting — T4

**📈 I. Strategic / Exit Planning (3 templates)**
67. Portfolio valuation model — T3
68. Refi-or-sell decision matrix — T3
69. "Escape the W2" timeline planner — T2

**🏕️ J. Specialty / Sub-niches (3 templates)**
70. Rental arbitrage deal analyzer — T2
71. Glamping / unique-stay P&L — T3
72. Corporate housing / travel-nurse (Furnished Finder) tracker — T2

### 3.3 — Bundle architecture (Tier 4)

| Bundle | Template count | Individual sum | Bundle price | Discount | Target |
|---|---|---|---|---|---|
| Launch Bundle | 8 | ~$180 | $97 | 46% | Nick |
| Operator Bundle | 18 | ~$420 | $197 | 53% | Sam |
| **Portfolio Bundle** ⭐ | 32 | ~$900 | $397 | 56% | **Sarah (hero)** |
| Tax Season Bundle (seasonal) | 8 | ~$350 | $147 | 58% | Sarah + Pam |
| Pro Manager Bundle | 24 | ~$1,800 | $797 | 56% | Pam |
| **The Vault** | All 65+ | ~$3,500+ | $1,497 | 57% | All-in buyers |

**Bundle laddering rule:** every bundle has a clear upgrade path. One-click "pay the difference" upgrades on order-confirmation pages.

### 3.4 — Tier 6 — Recurring & Done-for-You

**Membership** — $37/mo or $297/yr (save $147)
- Quarterly new template drops
- Annual tax updates (IRS rate changes, new deduction rules)
- Private community (Phase 2+ inside IS)
- Monthly live Excel Q&A

**DFY services (hybrid brand arm)**
- Custom portfolio dashboard build — $1,500–3,000
- Chart-of-accounts setup (multi-LLC) — $2,500
- QuickBooks → Excel migration — $1,500
- Private consulting — $297/hr

### 3.5 — Lead magnets (to be finalized with user)

Four channel-calibrated lead magnets; specific copy and design TBD during implementation:
- Hero: "47 Airbnb Tax Deductions Most Hosts Miss" (Excel + PDF)
- Pinterest: "12-Month STR Cash Flow Starter"
- Etsy post-purchase: "The 7-Minute Turnover Checklist"
- Blog article-specific: "Cost-Per-Stay Calculator"

---

## 4. Pricing Architecture

### 4.1 — Per-tier anchors (US market)

| Tier | Own-site price points |
|---|---|
| 0 | Free |
| 1 | $17 / $27 |
| 2 | $47 / $67 / $97 |
| 3 | $147 / $197 / $297 |
| 4 | $97 / $197 / $397 / $797 |
| 5 | $1,497 (or $997 launch price, 90 days) |
| 6 | $37/mo or $297/yr (membership) • $1,500–3,000 (DFY) • $297/hr (consulting) |

Charm pricing throughout (×7, ×97, ×297); this market expects it.

### 4.2 — Platform-specific pricing strategy

| Platform | Fee % | Buyer ceiling | SKU allocation | Price approach |
|---|---|---|---|---|
| Own site (IS hub) | 3% (Stripe) | No ceiling | Full catalog | Full price, margin protection |
| Etsy | ~9–11% | $37 sweet spot, $97 ceiling | T1 + Lite T2 only | Identical or $5 lower vs own site |
| Gumroad | 10% | $97 sweet spot | T1–T4 mirror | Match own-site price |
| Payhip | 5% | No ceiling | Mirror | Match own-site |
| Creative Market | 40–50% | $47–147 | Select T2 "designer" | +30% markup to offset |
| Hostfully marketplace | Varies | Mid–high | Pro Manager Bundle | Premium positioning |

**The "Etsy Lite" mechanic:** Etsy hosts a stripped-down version of Sarah-tier T2 products with an upgrade CTA inside the delivered file. This rides Etsy's discovery traffic, preserves own-site margin, and funnels buyers to the email list.

### 4.3 — Seasonal pricing

**Tax Season Bundle price escalation (creates urgency):**
- Jan 1–31: $127 (early-bird)
- Feb 1–28: $147 (standard)
- Mar 1–31: $167 (T-minus 45)
- Apr 1–15: $187 (final countdown)
- Apr 16–Dec 31: $97 (off-season floor)

**Black Friday / Cyber Monday:** 30% off all bundles except Tax Season Bundle. Vault drops to $997 with 50-person cap.

**New-Year "Scale Your STR" Funnel** (Jan 1–15): goal-setting magnet + Portfolio Bundle pairing.

### 4.4 — Payment methods

- Stripe (cards) — primary
- PayPal — +15% conversion in female-skewing demo
- Klarna / Afterpay — +15–25% conversion on $147+ items

### 4.5 — Refund policy

- T1–T2 singles: 14 days, no questions
- T3–T4 bundles: 30 days
- T5 Vault: 60 days
- T6 Membership: cancel anytime, no refund on current month
- DFY services: 50% refund before delivery, none after

### 4.6 — Geography

**Year 1: USD only, US hosts only.** Schedule E is IRS-specific; UK (SA105) / Canada (T776) / AU (Schedule I) require *separate* tax workbooks, not translations. Non-tax products are geography-agnostic and can sell internationally from Day 1.

---

## 5. Storefront Network

### 5.1 — Phased storefront rollout

| Priority | Storefront | Launch phase | Role |
|---|---|---|---|
| 1 | Own site (IS hub) | Week 3–6 | Full catalog, email capture, exclusive T3–T6 |
| 2 | Etsy | Week 1–2 **(MVP)** | Discovery — T1 + Lite T2 only |
| 3 | Gumroad | Week 2–4 | Discover algo exposure, T1–T4 mirror |
| 4 | Payhip | Month 4 | EU/VAT redundancy + affiliates |
| 5 | Creative Market | Month 5 | Premium T2 "designer" (30% markup) |
| 6 | Hostfully marketplace | Month 7 | STR-industry discovery, Pam |
| 7 | BiggerPockets shop | Month 9 | Investor-operator overlap |

**Explicitly skip:** Amazon KDP (digital templates don't fit), Teachers Pay Teachers, ThemeForest, Sellfy (redundant).

### 5.2 — Hub tech stack

- **Influencersoft** — checkout, email, membership, community, courses, affiliates, funnels, automations
- **Stripe + Stripe Tax** — payments + tax compliance (0.5% per tx)
- **Ghost (or Astro static)** — SEO blog on a subdomain (`blog.yoursite.com`)
- **Airtable (Team plan, $20/mo)** — single source of truth for catalog, CRM, content, metrics
- **n8n (self-hosted on VPS)** — automation glue
- **Google Drive** — file storage + weekly CSV backups
- **Claude (via MCP)** — AI ops interface, talks to Airtable

**Crossover plan:** Airtable remains SSOT for Phase 1–2. Supabase (Postgres) replica added in Phase 3 as analytics layer; full migration only if triggered by >500K rows, >$200/mo Airtable cost, customer-facing features, or compliance requirements.

### 5.3 — Airtable base schema (Master Product Catalog)

Primary base with tables:
- **Products** — SKU, name, category, tier, descriptions, prices per platform, file links, status, version, storefront flags
- **Customers** — unified CRM, source tags, LTV, purchase history
- **Orders** — every order from every platform, webhook-synced
- **Content** — blog posts, pins, emails in draft/scheduled/live states
- **Outreach Queue** — scraped contacts, message status, reply tracking
- **Metrics** — derived dashboards, daily rollups

### 5.4 — Customer data unification

Every purchase on every platform → webhook → n8n → Airtable CRM row + IS email list tag (tagged by platform + product + persona inference). This enables:
- Direct email to Etsy buyers (via download PDF CTA that captures email)
- LTV attribution by acquisition source
- Behavioral upsell triggers (bought 2+ T2s → Portfolio Bundle pitch)
- Facebook/Pinterest pixel cross-platform retargeting

### 5.5 — Pricing integrity rules

- Own site always has highest-featured version at highest price
- Etsy never undercuts own site on the *same* product (Lite variants only)
- No sitewide discount codes cross platforms
- Seasonal promos run on own site; Etsy runs separate, lower-percentage promos

---

## 6. Traffic / Channel Map

### 6.1 — Phase 1 channels (Month 0–3): 6 focused channels

1. **Pinterest (organic)** — TOFU, Sarah's planning mode, 10–15 pins/day via Creasquare (Pinterest native scheduler as fallback); re-evaluate Tailwind at Month 3 for SmartLoop + Tribes if Pinterest is converting and Creasquare's Pinterest features feel thin
2. **Etsy (as discovery)** — TOFU → BOFU, 1–2 listings/week
3. **Blog / SEO** (Ghost subdomain) — TOFU → MOFU, 2 posts/week, AI-assisted
4. **Your FB Group** — MOFU, daily presence, weekly live
5. **Email list** (IS native) — MOFU → BOFU, always-on nurture + weekly broadcasts
6. **Others' FB Groups** — TOFU, 30 min/day authentic value comments

**Phase 1 weekly effort:** ~15 hrs.

### 6.2 — Phase 2 channels (Month 3–6)

7. TikTok (faceless) + YouTube Shorts auto cross-post
8. Pinterest Ads on top-performing organic pins
9. BiggerPockets + Reddit (passive, authentic)
10. Affiliate program launch (IS native, recruit 20 from FB group)
11. Cross-promo with STR SaaS tools (PriceLabs, Hospitable, TurnoverBnB)
12. **CPA / bookkeeper partnerships** ⭐ (high-leverage for tax beachhead)

### 6.3 — Phase 3 channels (Month 6–12)

13. YouTube long-form (scripted, AI voice OK, faceless)
14. Google Ads (BOFU keywords)
15. Meta Ads (retargeting + lookalikes)
16. Podcast sponsorships (start cheap, scale with ROAS)
17. Instagram (organic, Pinterest repurpose)
18. Podcast guesting / PR

### 6.4 — Explicitly skipped

Twitter/X, LinkedIn (until Pam phase), Threads/BlueSky, paid influencer shoutouts (Phase 1), cold DMs.

### 6.5 — Research / prospecting lane

ScrapeBox repurposed as a **research engine** only (competitor backlinks, STR blog prospecting, podcast contact discovery, forum mapping, Etsy competitor research). GSA Contact Us Poster **benched** — deliverability pool is too burned. Outreach is handled via **Instantly** ($97/mo) with hand-personalized messages at 20–50/day. Expected effort: ~2 hrs/week for 20+ hours/month saved in manual prospecting.

---

## 7. Funnel Mechanics

### 7.1 — Full funnel map

Awareness → Lead Capture (hero magnet) → Nurture (9-email sequence, 21 days) → Tripwire ($17–27) → Core ($47–97) → Bundle/Premium ($147–397) → Vault/Membership ($1,497 / $37/mo) → Retention/Advocacy.

### 7.2 — Lead magnet strategy

Four channel-calibrated lead magnets routing to one email list, with source tags for sequence branching:
- **Hero:** "47 Airbnb Tax Deductions Most Hosts Miss" (Excel + PDF)
- **Pinterest:** "12-Month STR Cash Flow Starter"
- **Etsy post-purchase:** "7-Minute Turnover Checklist"
- **Blog embedded:** "Cost-Per-Stay Calculator"

### 7.3 — 9-email nurture sequence (21 days)

| Day | Email | Purpose |
|---|---|---|
| 0 | Delivery + FB Group invite + story hook | Trust kick-off |
| 2 | "The $8,427 deduction most hosts miss" | Value + authority |
| 4 | "Why QuickBooks fails STR hosts" | Frame problem |
| 6 | $17 Mileage Log tripwire pitch | First sale |
| 8 | Welcome deepener OR case study | Social proof |
| 11 | Schedule E Workbook $97 pitch | Core product |
| 14 | Tax season urgency email | Seasonal push |
| 18 | Objection handling | Address friction |
| 21 | Tax Bundle $147 last call | Bundle pitch |

Branching by tag:
- Tripwire buyer Day 6 → skip to Core sequence Day 8
- Core buyer Day 11 → skip to Bundle sequence Day 14
- Bundle buyer Day 21 → move to Vault/Membership arc
- No purchases by Day 21 → quarterly re-engagement loop

### 7.4 — Checkout mechanics

Three conversion layers at every checkout:

1. **OrderBump** (25–40% take rate): complementary item added via checkbox
2. **One-Time Offer** (15–30% take rate): post-purchase upsell page, 40% off next tier
3. **Thank-you cross-sell** (5–12% take): "Others who bought this also got..."

Stacked effect: $97 Schedule E purchase yields ~$180–230 average AOV.

### 7.5 — Cart abandonment + re-engagement

| Trigger | Delay | Action |
|---|---|---|
| Added to cart, no checkout | 1 hr | "You left this behind" |
| Still not purchased | 24 hrs | 10% off code, 48-hr expiry |
| Still not purchased | 72 hrs | Social-proof email |
| Still not purchased | 7 days | Move to nurture by tag |
| Purchased 1x, silent 60 days | — | Category-matched re-engagement |
| Purchased 1x, silent 180 days | — | 20% off anything |
| 3+ purchases, no Bundle | — | Bundle pitch sequence |

### 7.6 — Persona-specific funnel branches

Funnel shape is constant; products, copy tone, and price anchors shift by tag (Sam/Sarah/Pam).

### 7.7 — Seasonal funnels

- **Tax Season** (Dec 15–Apr 15): compressed 10-day sequence, countdown urgency, escalating Bundle price
- **Black Friday / Cyber Monday**: dedicated landing page, all bundles 30% off (except Tax Season), Vault at $997
- **New Year "Scale Your STR"** (Jan 1–15): goal-setting magnet → Portfolio Bundle

### 7.8 — Metrics & alert thresholds

| Metric | Target | Alert |
|---|---|---|
| Cost per lead | <$2 paid / $0 organic | >$4 = cut channel |
| Email → tripwire | >3% | <2% = rewrite sequence |
| OrderBump take | >25% | <15% = change bump |
| OTO take | >15% | <10% = change OTO |
| Refund rate | <5% | >8% = investigate |
| Bundle attach | >10% | <5% = weak pitch |

---

## 8. Automation Stack

### 8.1 — Architecture

Claude (MCP) → Airtable (SSOT) → n8n (spine) → IS + Etsy + Gumroad + Payhip + Ghost.

**Non-negotiable design rules:**
1. Airtable is the only place data is edited.
2. Claude never touches storefronts directly.
3. Every storefront action logged in Airtable with timestamp + workflow ID.
4. Every automation has a manual fallback queue.

### 8.2 — Ten workflow families

| Family | Purpose | Priority |
|---|---|---|
| A. Catalog sync | Product add/update/retire → all storefronts | P0 |
| B. Customer data unification | Every sale → one CRM + email tag | P0 |
| C. Content production | Blog/pins/TikTok/emails AI-drafted, human-approved | P1 |
| D. Funnel orchestration | Lead magnet → nurture → tripwire → core flows | P0 |
| E. Marketing ops | Etsy renewals, pin performance, FB welcome, affiliates | P1 |
| F. Analytics / reporting | Daily rollups, weekly dashboard, alerts | P1 |
| G. Customer support | Triage, common-Q auto-response, refunds | P1 |
| H. AI ops interface | Claude + Airtable MCP, weekly briefings | P0 |
| I. Research / prospecting | ScrapeBox → Airtable → Claude → Instantly | P2 |
| J. Tax-season cadence | IRS updates, seasonal FAQ, bundle price escalation | P2 |

### 8.3 — 90-day build order

**Month 1 (P0 core):** Airtable schema, A1 product sync, B1 order sync, D1–D3 funnel, H1 Claude MCP.

**Month 2 (P1 scale):** A2/A3 updates, B2 refunds, C1 blog pipeline, C2 Pinterest factory, E1 Etsy monitor, F1 revenue rollup, G1/G2 support.

**Month 3 (P2 leverage):** C3 TikTok pipeline, E3 FB Group flow, F2 weekly dashboard, I research lane, J tax-season priming.

### 8.4 — Tech stack + monthly costs

| Tool | Monthly |
|---|---|
| Airtable Team | $20 |
| n8n self-hosted VPS | $6–10 |
| Vaultwarden (self-hosted — co-tenant on n8n VPS or separate) | $0 (self-hosted, open source) |
| Influencersoft | $0 (owned) |
| emaillistvalidation.com | $0 (lifetime deal owned) — list hygiene for every email-capture, order-sync, and cold-outreach feed |
| Stripe + Stripe Tax | 2.9% + 30¢ + 0.5% tax |
| Ghost | $0–9 |
| Google Workspace | $6 |
| Vista Create Pro | $0 (lifetime deal owned) |
| Creasquare (multi-platform scheduler: IG, LinkedIn, YouTube, TikTok, FB, **and Pinterest**) | $0 (lifetime deal owned) |
| Pinterest native scheduler (fallback only if Creasquare's Pinterest integration feels thin) | $0 |
| Tailwind (deferred — Month 3 re-eval) | $0 now / $15 if reactivated |
| Claude API | $50–150 |
| Domain + Hostinger | $2 |
| **Phase 1 total** | **~$135–250** |
| Instantly (Phase 2) | +$97 |
| **Phase 2+ total** | **~$230–350** |

### 8.5 — Failure handling

- n8n workflow errors → Slack alert + retry 3x + manual fallback queue in Airtable
- IS deliverability tank (open rate <20%) → route email through Kit as backup ESP
- Storefront API changes → circuit breaker + Claude-assisted patching
- IS platform instability → Payhip mirror ready to promote within 72 hrs
- Stripe webhook drops → nightly reconciliation against Stripe API

**Weekly backups (automated):** Airtable full base → CSV → Google Drive; IS email list → CSV → Drive; IS product export → Drive; all Excel masters in Drive.

**Annual disaster recovery drill:** once a year, simulate IS outage; verify Payhip-only site can launch in <48 hrs.

### 8.6 — Security

- All API keys in n8n encrypted credential manager
- Webhook signatures verified (Stripe, IS, Etsy)
- Airtable API key scoped to single base
- Google Drive OAuth, not service-account
- 2FA everywhere
- Vaultwarden centralizes all credentials
- Monthly VA access audit
- n8n VPS hardened: SSH keys only, fail2ban, Caddy reverse proxy on VPS

### 8.7 — AI ops interface examples

```
Claude, add a new product: STR Insurance Policy Tracker, $47, T2, ops
Claude, what did we make last week by channel?
Claude, draft next Tuesday's email — theme = Q1 estimated taxes
Claude, why is Sarah's nurture sequence converting 2% and not 4%?
Claude, prepare the monthly ops briefing
```

### 8.8 — Automation honest audit

| Function | % Automated | Manual residue |
|---|---|---|
| Product publishing | 95% | Creative Market (no API) |
| Customer data sync | 99% | Edge-case Etsy merges |
| Email sequences | 100% | — |
| Content production | 80% | Final approval on blog/email (keep HITL) |
| Social posting | 95% | FB Group authentic engagement |
| Customer support | 85% | Refund edge cases |
| Financial reporting | 99% | Your own annual tax filing |
| Outreach | 70% | Personalization review + send |
| **Blended** | **~92–95%** | **3–5 hrs/week hands-on** |

---

## 9. Alternative Revenue + 12-Month Roadmap

### 9.1 — Seven alt-revenue streams beyond product sales

| # | Stream | Activation | Year 1 potential | Effort |
|---|---|---|---|---|
| 1 | Affiliate commissions (STR SaaS) | Month 3+ | $500–3K/mo | Low |
| 2 | Sponsored emails/posts | Month 6+ | $500–3K per | Low |
| 3 | DFY services | Month 6+ | $1.5–10K/client | High |
| 4 | Courses | Month 8+ | $3–15K/launch | Medium |
| 5 | White-label / licensing to PMs | Month 9+ | $2–10K/deal | Medium |
| 6 | Amazon book ("The STR Tax Playbook") | Month 6+ | $500–2K/mo + authority | Medium one-time |
| 7 | Data products (anonymized benchmarks) | Year 2+ | $5–25K/yr | Medium |

### 9.2 — Affiliate partners to sign up

PriceLabs, Hospitable, TurnoverBnB/Turno, AirDNA, Hostfully, Guesty, Steadily/Proper/Obie (insurance), Baselane, BiggerPockets Pro, Amazon Associates (physical STR supplies).

### 9.3 — Upsell path

Tripwire → Core → Bundle → Vault → Membership → Course → DFY → Mastermind (Yr 2+). Every buyer also sees affiliate recs, Amazon book, and annual Tax Season Bundle.

**LTV targets at Month 12:**
- Average buyer: $180
- Sarah-tier: $600–1,200
- Pam-tier: $2,000–5,000
- Whale: $5K+

### 9.4 — 12-month roadmap

**Q1 — Launch + validate**
- M1: Etsy shop live (3–5 listings), hub + lead magnet + nurture written. **Target: $500–1,500**
- M2: Etsy 10 listings, Gumroad mirror, 100+ email list, 10 blog posts, Pinterest pins, FB Group soft launch. **Target: $1,500–3,000**
- M3: Etsy 20 listings, full funnel (OrderBumps + OTOs), Launch Bundle, affiliate program opens. **Target: $3,000–5,000**
- **Q1 exit:** 20+ templates, 500+ subscribers, $3K MRR floor.

**Q2 — Scale + premium tiers**
- M4: Tax Season peak (if Jan–Apr), Payhip + Creative Market, TikTok + Pinterest Ads, BP passive. **Target: $5–12K**
- M5: Portfolio Bundle + Vault soft launch, CPA/bookkeeper outreach begins, 30+ blog posts. **Target: $8–15K**
- M6: Membership launches, FB community moves inside IS, YouTube long-form begins, book drafted. **Target: $12–20K**
- **Q2 exit:** Portfolio Bundle weekly sales, membership 50+, $15K MRR floor, first $1K+ affiliate month.

**Q3 — Diversify**
- M7: Pro Pam tier (Pro Manager Bundle + DFY), Hostfully marketplace, first DFY client. **Target: $15–25K**
- M8: BiggerPockets shop, first course (STR Tax Mastery $297), Google Ads BOFU, book publishes. **Target: $20–35K**
- M9: First sponsored email, first white-label PM deal, affiliate >$2K/mo, Meta retargeting. **Target: $25–40K**
- **Q3 exit:** 3 streams >$1K/mo each, membership 200+, book earning Amazon organic.

**Q4 — Compound + prep Year 2**
- M10: Black Friday funnel, second course, podcast soft launch. **Target: $30–50K**
- M11: Tax Season pre-launch warm-up, affiliate expansion, UK tax workbook scoped. **Target: $25–45K**
- M12: Year 2 Tax Season ramp begins, annual updates repeat, Vault year-end push, Mastermind scoped. **Target: $35–60K**
- **Q4 exit:** $30K+ MRR floor, 500+ members, 7-figure trajectory visible.

### 9.5 — Year 1 expected revenue mix (at M12)

- Direct template/bundle sales: 55% (~$18K/mo)
- Membership MRR: 15% (~$5K/mo)
- Affiliate: 10% (~$3K/mo)
- DFY: 8% (~$2.5K/mo)
- Courses: 7% (~$2K/mo)
- Sponsored/white-label: 3% (~$1K/mo)
- Book/Amazon: 2% (~$500/mo)

**Total: ~$32K MRR / $384K ARR** (conservative); ~$50K MRR at aggressive end.

### 9.6 — Year 2–3 vision

**Year 2 ($500K–1.2M ARR):** Tax Season Challenge event, mastermind ($5–10K/yr), UK + Canada tax workbooks, first FT hire, data product.

**Year 3 ($1.5–3M ARR):** Certification program, annual conference, SaaS adjacent product, exit conversations possible.

### 9.7 — Exit paths (optionality, not the goal)

1. STR SaaS roll-up (AirDNA, Hostfully, Guesty acquire audience/content)
2. Digital product PE (Tiny, similar — 3–5x EBITDA)
3. Strategic education merger (BiggerPockets, STR coach platforms)

---

## 10. Launch Sequencing (the Etsy-first MVP)

Three parallel lanes running simultaneously from Week 1:

**Lane A — Revenue (Etsy MVP)**
- Week 1: Etsy shop live, 3 listings, first dollar possible
- Week 2: 2 more listings, Gumroad mirror
- Week 4: 10 listings, Pinterest pins linking in
- Week 8: "Lite" mechanic activated, upsell-to-own-site flow live
- Month 3: Etsy generating $2–5K/mo steady

**Lane B — Infrastructure**
- Week 1–2: Domain, IS, Ghost, Airtable base
- Week 3–4: Lead magnet + nurture sequence
- Week 5–6: n8n P0 workflows (A, B, D, H)
- Week 7–8: Email automation + OrderBumps + OTOs configured
- Month 3: Hub fully operational

**Lane C — Content + authority**
- Week 2–4: First 5 blog posts (tax keywords)
- Week 4: FB Group soft launch
- Week 6: First 30 Pinterest pins
- Month 3: 15+ blog posts, FB Group 100+, SEO beginning to surface

**First 3–5 Etsy launch products:**
1. Airbnb Welcome Book template — T1, $17 (gateway)
2. STR Mileage Log — T1, $17 (tax toe-in)
3. Single-Property P&L Tracker (Lite) — T2, $27
4. 1099-NEC Contractor Tracker — T1, $17
5. Cleaner Turnover Checklist + Scorecard — T1, $12

**Week 8 hard milestone:** own site + email list + lead magnet live regardless of Etsy's performance. Etsy is a channel, not a business.

**Minimum Week 1 spend to first sale:** ~$25 (Etsy listing fees + domain; Vista Create Pro is already owned via lifetime deal).

---

## 11. Risk Watch

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| STR regulatory crackdowns | Medium | Medium | Templates useful for remaining hosts; pivot messaging |
| Airbnb/VRBO platform changes | Medium | Low | Tax/financial tools are platform-agnostic |
| AI flooding Etsy with low-quality STR templates | High | Medium | Moat = depth, brand, authority, community |
| Influencersoft platform instability | Low-Med | High | Weekly backups, Payhip mirror, documented migration |
| Google algorithm shift on thin blogs | Medium | Medium | Focus on deep pillar content + authority |
| Platform fee increases | Medium | Low | Multi-storefront hedge, own site = margin center |
| Tax law changes invalidating templates | Low | Medium | Annual refresh cycle = membership value |
| Founder burnout | Medium | High | 95% automation goal + VA hire in Q3 is the antidote |

---

## 12. Appendix — KPIs and Exit Criteria

### Weekly KPIs (reviewed Monday)
- New email subscribers (target: 100+/wk by M3, 500+/wk by M12)
- Email → purchase conversion (target: >3%)
- OrderBump take rate (target: >25%)
- OTO take rate (target: >15%)
- Refund rate (target: <5%)
- Top channels by revenue (attribution)

### Monthly KPIs
- MRR growth (compound 15–25% MoM targeted Q1–Q2)
- Bundle attach rate
- Membership churn (target: <5%/mo)
- Affiliate revenue (target: $500 M3, $2K M9)
- CAC by channel
- LTV by persona segment

### Quarterly exit criteria
- **Q1 exit:** 20+ templates, 500+ subscribers, $3K MRR floor
- **Q2 exit:** Portfolio Bundle weekly sales, 50+ paid members, $15K MRR floor, first $1K+ affiliate month
- **Q3 exit:** 3 streams >$1K/mo each, 200+ members, book earning Amazon organic
- **Q4 exit:** $30K+ MRR floor, 500+ members, 7-figure trajectory visible

### Infrastructure milestones (must-complete regardless of revenue)
- **Week 2:** Etsy revenue > $0
- **Week 8:** Own site + email list + lead magnet live
- **Month 3:** All P0 n8n workflows operational
- **Month 6:** Membership launched, book drafted, Phase 2 channels live
- **Month 12:** Phase 3 channels live, 3+ alt-revenue streams active

---

## Appendix B — Open items for later iteration

These are explicitly **not** designed in this spec and will be addressed in implementation:

1. Individual template designs — user will provide details per template
2. Specific brand name + logo + visual identity
3. Domain selection
4. Specific Ghost vs Astro decision for blog
5. VPS provider selection for n8n self-hosting
6. Specific CPA/bookkeeper partner list (to be built via ScrapeBox in Phase 2)
7. Final lead magnet copy/design
8. Specific email sequence copy (sequence structure is locked; copy is per-email iteration)
9. Pinterest pin visual system
10. Pricing A/B test plan (post-90 days of baseline data)

---

**End of master strategy design. Implementation plan to follow.**
