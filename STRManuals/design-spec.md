# STRManuals — Design Specification

**Version:** 1.0
**Domain:** strmanuals.com
**Last updated:** 2026-05-05

---

## 1. Brand & Positioning

**Tagline:** *Plain-English manuals for short-term rental owners.*

**Sub-tag:** *One problem. One PDF. Read it in an afternoon.*

**Voice:** Editorial, direct, slightly contrarian. Treats the reader like a competent adult. No emoji confetti, no "Hey there, host!", no growth-hacker exclamation marks.

**Visual reference:** Stripe Press × The STR Ledger × old McKinsey monographs. Serif headlines, generous whitespace, restrained accents. Looks expensive without trying.

**What it is NOT:** Course-bro vibes, hustle aesthetic, neon CTAs, "1000+ HOSTS LOVE IT" social-proof confetti.

---

## 2. Information Architecture

```
strmanuals.com/
├── /                          # Homepage — library grid + free-PDF capture
├── /library                   # Same as / but paginated as catalog grows
├── /manuals/[slug]            # Individual product page (one per SKU)
├── /bundle                    # Bundle landing page
├── /free                      # Free 8-page tax explainer landing
├── /about                     # Why these exist + author note
├── /refund                    # Refund policy
├── /privacy                   # Privacy + ToS
├── /contact                   # Contact form
├── /downloads                 # Customer download portal (token-gated)
├── /thank-you                 # Post-checkout confirmation + upsell
└── /journal/[slug]            # Long-tail SEO articles (Phase 4)
```

**No blog index page until Phase 4.** Articles ship one at a time and are linked from manual pages, not centralized into a content marketing hub on day one.

---

## 3. Page Templates

| Template | Purpose | Sections |
|----------|---------|----------|
| Homepage | Convert visitor → buyer or subscriber | Hero · Library grid · Why-this-exists · Free PDF capture · Cluster cross-promo · Footer |
| Product page | Convert browser → buyer | Cover image · Title + price · 1-line promise · Who it's for · Table of contents · Sample pages · Companion asset · Author/disclaimer · Buy button · FAQ · Related manuals |
| Bundle page | Increase AOV | Stack of 5 covers · Total value vs. bundle price · What's included · Buy button |
| Free landing | Email capture | Headline · 3 bullets of what's inside · Cover thumbnail · Email field · No nav distractions |
| Download portal | Post-purchase delivery | Greeting · Download button(s) with expiry note · Companion asset link · "What's next" cross-sell |
| Journal article | SEO + topical authority | Title · Date · Content · "If this helped, the manual goes 10x deeper" CTA |

---

## 4. Design Tokens

```css
/* Color */
--ink:           #1a1612;   /* near-black, warm */
--paper:         #faf7f2;   /* off-white, warm */
--paper-2:       #f1ece4;   /* card background */
--rule:          #d8d2c7;   /* hairline borders */
--accent:        #7a3b2e;   /* deep ledger red — used sparingly */
--accent-2:      #2d4a3e;   /* deep green for "free" / success states */
--mute:          #6b645a;   /* secondary text */

/* Typography scale */
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.375rem;
--text-2xl:  1.75rem;
--text-3xl:  2.5rem;
--text-4xl:  3.75rem;     /* hero */

/* Spacing scale (8px base) */
--s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
--s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px;

/* Layout */
--measure: 64ch;          /* readable line-length */
--max-w:   1180px;        /* page max */
--radius:  2px;           /* almost square — editorial, not SaaS */
```

---

## 5. Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / headlines | Cormorant Garamond | 600 weight, slight letter-spacing tightening on h1 |
| Body | Inter | 400/500, 1.65 line height |
| Numerals & code | JetBrains Mono | Used for prices, page counts, SKU labels |

**Rules:**
- H1 always serif. Never bold sans for headlines.
- Body is sans (Inter) for readability — serif body looks dated on screen.
- Prices in mono make them feel ledger-like and intentional ($29 not $29).
- All-caps eyebrow labels (TAX-01, REV-02) use Inter 11px tracking 0.12em.

---

## 6. Components

**Manual Card** (homepage library grid)
- Cover image (3:4 ratio)
- Eyebrow: SKU code (TAX-01)
- Title (serif, 2 lines max)
- 1-line promise (sans, mute color)
- Price (mono) · page count (mono, mute) on a single line
- Hover: subtle lift, accent rule appears below

**Buy Button**
- Solid ink background, paper text, mono price inline ("Buy — $29")
- 48px tall, 24px horizontal padding, 2px radius
- Hover: accent background

**Free PDF Capture Block**
- Horizontal on desktop, stacked on mobile
- Email input (1px ink border, no shadow)
- Button: "Send me the PDF" (accent-2 green to differentiate from paid)

**Disclaimer Block** (legal-adjacent manuals)
- Inset rule on left, paper-2 background, mute text
- Always above the buy button on TAX/LGL product pages

**Sample Page Strip**
- 3 thumbnail spreads from the actual PDF
- Click → lightbox with full preview pages (3–5 pages max)
- Reduces refund risk dramatically

---

## 7. Product Page Anatomy

```
┌─ above fold ─────────────────────────────────┐
│  cover image (3:4)  │  TAX-01                │
│                     │  THE STR TAX LOOPHOLE  │
│                     │  PLAYBOOK              │
│                     │                        │
│                     │  Plain-English on the  │
│                     │  short-term rental     │
│                     │  loophole — who        │
│                     │  qualifies, how to     │
│                     │  document it, where    │
│                     │  it goes wrong.        │
│                     │                        │
│                     │  $29  ·  48 pages      │
│                     │  [ Buy — $29 ]         │
└──────────────────────────────────────────────┘
   ┌─ who it's for ──────────────────────────┐
   ┌─ table of contents ─────────────────────┐
   ┌─ sample pages (3 thumbnails) ───────────┐
   ┌─ companion asset (P&L workbook link) ───┐
   ┌─ author note + CPA disclaimer ──────────┐
   ┌─ FAQ (5 questions max) ─────────────────┐
   ┌─ buy button (sticky on mobile) ─────────┐
   ┌─ related manuals (2 cards) ─────────────┐
```

**Above-fold rules:** cover, title, promise, price, buy button — always. Everything else scrolls.

---

## 8. Checkout Flow

1. Click "Buy — $29" → Stripe Checkout (hosted, no custom UI)
2. Stripe collects email, card, optional name
3. **Order bump on Stripe Checkout:** "Add the bundle for +$70" (one click upsell)
4. On success → webhook fires → Postmark sends download email + R2 generates 24h signed URL
5. Customer redirected to `/thank-you?token=...`
6. Thank-you page shows: download button (same signed URL), companion asset link, cross-sell to next logical manual

**No account creation required.** Email + order ID is the identity. If they lose the email, they re-request via `/downloads` with email lookup.

---

## 9. Download Portal

```
/downloads
├── Email lookup form (ungated)
└── Token-gated view (after email match)
    ├── List of purchased manuals with download buttons
    ├── Download button generates fresh 24h signed URL on click
    ├── "Updates" badge on manuals with new versions
    └── "Companion assets" section linking to workbooks
```

PDFs are watermarked per-buyer in the footer: `Licensed to {email} · Order {id} · {date}`.

---

## 10. Email Capture & Lead Magnet

**Lead magnet:** *The STR Tax Loophole Explainer* — 8-page primer pulled from chapters 1–2 of TAX-01.

**Capture points:**
- Homepage block (after library grid)
- Exit-intent on product pages (one tasteful trigger, not aggressive)
- End of every journal article
- 404 page

**Sequence after subscribe:**
1. Day 0: Welcome + PDF download link
2. Day 3: "Did you read it? Here's the one mistake hosts make"
3. Day 7: Soft pitch for TAX-01 ($29) with "subscriber price first 48h" lever
4. Day 14: Move to biweekly cadence with manual previews + journal articles

---

## 11. SEO / Content Strategy

**Phase 1–3:** No content marketing. Just product pages with rich schema.

**Phase 4 (post-launch):** One journal article per manual, targeting the anchor search intent:
- "STR tax loophole explained 2026" → links to TAX-01
- "How many hours material participation STR" → links to TAX-02
- "Why airbnb bookings dropped" → links to REV-01
- "Direct bookings vs airbnb" → links to REV-02
- "STR permit research" → links to LGL-01

Articles are 1,500–2,500 words, genuinely useful (not bait), end with: *"This article covers the basics. The manual goes 10x deeper with templates and decision tools."*

---

## 12. Tech Stack (deep)

**One platform, one bill.** Matches the unified Hostinger Business cluster decision — no Cloudflare, no AWS, no third-party object store.

```
Astro 5.x (static + islands)
  ├── Content collections for manuals (MDX in /src/content/manuals/)
  ├── @astrojs/sitemap, @astrojs/rss (Phase 4)
  ├── Tailwind v4 with custom token preset
  └── Server endpoints (output: 'server' or 'hybrid') for /api/*

Stripe
  ├── Checkout Sessions (hosted)
  ├── Webhooks → /api/stripe-webhook (Hostinger Node) → Postmark
  └── One Price object per manual + one Bundle Price

Hostinger Business filesystem (PDF storage)
  ├── /private/manuals/{sku}/v{N}.pdf       (master PDFs, outside web root)
  ├── /private/free/tax-loophole-explainer.pdf  (lead magnet master)
  └── No public URLs — all access goes through /api/download

Node download endpoint (/api/download)
  ├── Token format: HMAC-SHA256(email | orderId | sku | expiry, SECRET)
  ├── Validates expiry (24h) + signature
  ├── pdf-lib watermarks footer with email + order ID at stream time
  ├── Streams with Content-Disposition: attachment
  └── Logs download events to local SQLite for re-issue + abuse detection

InfluencerSoft (via n8n) — cluster-wide email + sequences
  ├── Tag-based segmentation, single contact pool across all 5 sites
  ├── /api/stripe-webhook → n8n webhook → IS:
  │     - Tag contact: product:<sku>, source:strmanuals, acquired:<date>
  │     - Trigger order-confirmation sequence with merge vars
  ├── /api/subscribe → n8n webhook → IS:
  │     - Tag contact: magnet:str-tax-loophole-explainer, source:strmanuals
  │     - Trigger free-magnet sequence
  └── Sequences live in infrastructure/influencersoft/sequences/ (cluster repo)

Plausible
  └── Hosted plan ($9/mo) — no need to self-host on Hostinger
```

**Why this beats Cloudflare R2 + Postmark + ConvertKit at our scale:**
- 50 manuals × 15MB = 750MB → comfortably under Hostinger Business's 200GB SSD
- Sub-100k downloads/mo means edge caching is irrelevant (each file is pulled once per buyer)
- One contact pool across all 5 cluster sites = real cross-site segmentation
- Zero new vendors — keeps cluster ops surface tiny
- Watermarking happens in-process; no Worker round-trip

---

## 13. Deployment

- **Repo:** `STRManuals/` (this folder, eventually own git repo)
- **CI/CD:** GitHub Actions → SFTP deploy to Hostinger Business on main push
- **Astro mode:** `output: 'hybrid'` — static for marketing pages, server for `/api/*`
- **PDF authoring:** Affinity Publisher → exported to `/private/manuals/{sku}/v{N}.pdf` on the server (uploaded via SFTP, never committed to git)
- **PDF watermarking:** Happens in-process at download time via `pdf-lib`, not at build
- **Stripe webhook:** Single Node endpoint at `/api/stripe-webhook` — all order events route here
- **Order log:** Local SQLite at `/private/db/orders.db` — stores email, sku, orderId, timestamps for re-download lookups
- **Env separation:** `.env.local` (dev), `.env.production` on Hostinger
- **Secrets:** `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `DOWNLOAD_HMAC_SECRET`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_AUTH` — all in Hostinger env, never in repo (InfluencerSoft API key lives in n8n only, not on the strmanuals box)

---

## 14. Analytics

| Metric | Tool | Target (Day 90) |
|--------|------|-----------------|
| Unique visitors | Plausible | 5K/mo |
| Email signups | Plausible + ConvertKit | 1K cumulative |
| Conversion rate (visitor → buyer) | Plausible goals | 1.5% |
| AOV | Stripe | $35 |
| Bundle attach rate | Stripe | 20% |
| Refund rate | Stripe | <5% |
| Email list → buyer conversion | ConvertKit + Stripe | 8% over 30 days |

No Google Analytics. No Facebook Pixel until paid acquisition starts.

---

## 15. Cross-cluster Integration

**Inbound (other sites → strmanuals.com):**
- thestrledger.com footer: "Read the manuals"
- strhost.tools sidebar on calculator pages: "Why is this number bad? Manual REV-01 →"
- strops.tools post-checkout: "Get the regulation manual to pair with your permit calendar"
- strguests.tools footer: "More for hosts: strmanuals.com"
- strbuyers.tools post-deal-analysis: "Already own? Manual TAX-01 →"

**Outbound (strmanuals.com → other sites):**
- Inside each manual: "Companion workbook on thestrledger.com / Etsy"
- /thank-you: cross-sell to relevant cluster tool
- /about: links to all four sister sites

**Shared:** Email list (segmented by source), design tokens (centralized in cluster repo), Plausible site group for cross-property analytics.

---

## 16. Build Order (dev tasks)

**Phase 0 — Plumbing (week 1)**
1. Domain + Hostinger setup
2. Astro scaffold with design tokens
3. Stripe account + first Price object
4. R2 bucket + signed URL Worker
5. Postmark account + receipt template
6. Homepage + product page template + footer

**Phase 1 — TAX-01 launch (weeks 2–4)**
7. Write TAX-01 manuscript (parallel to dev)
8. Design TAX-01 in Affinity (cover + interior)
9. Wire TAX-01 product page with real Stripe Price
10. End-to-end test purchase
11. Soft launch to email list (no public announce)

**Phase 2 — Catalog grows (weeks 5–7)**
12. TAX-02 + REV-01 manuscripts + design
13. Bundle Price + bundle landing page
14. Order bump enabled in Stripe Checkout

**Phase 3 — Full catalog (weeks 8–10)**
15. REV-02 + LGL-01
16. Free 8-page lead magnet built
17. Welcome sequence in ConvertKit
18. Public launch + cluster cross-promotion go live

**Phase 4 — Content & growth (week 11+)**
19. /journal section with first 5 articles
20. Schema.org Product markup audit
21. Refund/dispute SLA review
22. Plan SKU 6+ based on email-list survey

---

## 17. Launch Plan

**Pre-launch (private):** Soft sell to existing Etsy customer list with 30%-off subscriber code. Validate funnel end-to-end.

**Launch week:**
- Day 1: Email blast to full list
- Day 2: Twitter/X + LinkedIn announcement (if active)
- Day 3: Post to r/AirBnB, r/realestateinvesting (Helpful framing, link in bio not body)
- Day 4: BiggerPockets forum (genuine reply to relevant threads, manual mentioned in author bio)
- Day 7: Indie Hackers post-mortem post (transparency = sales)

**Post-launch:** Biweekly broadcast cadence. Each broadcast = one new tip + one product callout. New manual every 4–6 weeks.

---

## 18. Risks & Open Questions

**Hard risks:**
- Tax/legal manuals expose to liability → must have CPA review on TAX-01 + TAX-02 before publishing, and "explainer not advice" disclaimer
- Stripe ToS on digital goods refunds → confirm 14-day refund window doesn't trigger dispute flags
- Per-buyer watermarking adds 200–800ms to first download → acceptable; pre-warm common PDFs

**Soft risks:**
- Cannibalization of Etsy workbooks → mitigated by upselling workbooks *from* manuals
- Email-list fatigue if cadence too high → biweekly cap, easy unsubscribe

**Open questions to resolve before Phase 1:**
- [ ] ConvertKit vs Beehiiv?
- [ ] Watermarking library (pdf-lib + Workers vs server-side)?
- [ ] Bundle price elasticity — is $99 right, or does $79 / $129 convert better? (test in Phase 3)
- [ ] Affinity Publisher vs InDesign vs Figma + browser-PDF for PDF authoring?
- [ ] Author byline strategy — Daniel direct, or publisher imprint ("STR Manuals Press")?
