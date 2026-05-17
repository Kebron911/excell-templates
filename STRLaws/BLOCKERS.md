# STRLaws — Inputs Needed From Daniel

Central list of everything I need from you to keep moving. Update inline (✅ done, ⏳ in progress, ❌ blocking).

## Current status snapshot

- **Phase 1 foundation** — ✅ shipped
- **Phase 2 SEO surface** — ✅ shipped (schema, sitemap, robots, freshness, internal linking)
- **Phase 3 AI extraction pipeline** — ✅ CODE LANDED, runtime-blocked on `ANTHROPIC_API_KEY`. Tier-1 scraper, Claude client with mandatory prompt caching + $0.05 cost guard, Zod extraction schema, and confidence-gate router (0.85/0.5 thresholds, review_queue reasons) are all merged and unit-tested (69 tests green). The moment a key lands in `.env.local`, end-to-end extraction works.
- **Migration 0002** — all Phase 3-6 tables (review_queue, regulation_changes, alert_subscribers, alert_subscriptions, alert_dispatches, premium_subscribers, api_request_log) are in `server/db/migrations/0002_pipeline.sql`. Run `pnpm db:migrate` against your MySQL instance whenever it's provisioned.
- **Phase 4 (diff/auto-publish)** — pending
- **Phase 5 (alerts)** — pending
- **Phase 6 (premium + launch)** — pending

## Phase 3 blockers (AI extraction — weeks 3–4)

- [ ] **Anthropic API key** with prompt caching enabled — add to `STRLaws/.env.local` as `ANTHROPIC_API_KEY=`
- [ ] **Slack webhook URL** for review queue notifications — `SLACK_REVIEW_WEBHOOK=`
- [ ] **Firecrawl API key** (tier-3 scrape fallback) — `FIRECRAWL_API_KEY=` (only needed if fetch + Playwright fail)
- [ ] **n8n instance access** (URL + API key) — `N8N_BASE_URL=`, `N8N_API_KEY=`
- [ ] **AirDNA top-markets data** for prioritizing city scale-up beyond seed 50

## Phase 5 blockers (alerts — weeks 6–7)

- [ ] **Resend API key + verified domain** (SPF/DKIM on `strlaws.com`) — `RESEND_API_KEY=`, `RESEND_FROM_EMAIL=`
- [ ] **Influencersoft API key + list IDs** (free-alerts nurture list, affiliates list) — `INFLUENCERSOFT_API_KEY=`, `INFLUENCERSOFT_FREE_ALERTS_LIST_ID=`

## Phase 6 blockers (premium + launch — weeks 8–12)

- [ ] **Stripe** (live + test keys, product IDs for $14/mo + $140/yr) — `STRIPE_SECRET_KEY=`, `STRIPE_WEBHOOK_SECRET=`, `STRIPE_PRICE_MONTHLY=`, `STRIPE_PRICE_ANNUAL=`
- [ ] **Domain registration** — `strlaws.com` purchased + DNS pointed to Hostinger
- [ ] **Hostinger MySQL** provisioned — `MYSQL_HOST=`, `MYSQL_PORT=`, `MYSQL_USER=`, `MYSQL_PASSWORD=`, `MYSQL_DATABASE=`
- [ ] **Hostinger Node host** for Express server — domain/port for `api.strlaws.com`
- [ ] **Hostinger deploy webhook** (Astro rebuild trigger after auto-publish) — `HOSTINGER_DEPLOY_HOOK=`
- [ ] **Google Search Console + Bing Webmaster** verification (DNS TXT or HTML file)

## Affiliate partner accounts (Phase 4+)

- [ ] **Proper Insurance** affiliate signup
- [ ] **Slimsurance** (or alternative) affiliate signup
- [ ] **STR-specialist attorney** referral partnership(s)

## Decisions you can make any time

- [ ] Final brand accent colors — spec says "deeper navy + parchment, less warm than STRGuests-Tools". OK to lock or want variants?
- [ ] Logo / wordmark — placeholder text fine for now?
- [ ] Initial seed-50 city list confirmation (currently hardcoded — share if you want changes)

## How to use this file

When you have a key, paste it into `STRLaws/.env.local` (not committed) and check the box here. When you finish a partner signup, mark it done. I'll read this at the top of every STRLaws session to know what's unblocked.
