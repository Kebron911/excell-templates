# STRLaws.com — Design Specification

**Status:** Approved 2026-05-14
**Domain:** `strlaws.com`
**Repo location:** `Excel-Templates/STRLaws/`

## 1. Problem & Audience

STR investors, owners, and property managers cannot find clear, current, trustworthy information about local STR regulations. Data is scattered across municipal PDFs, council minutes, paywalled compliance services (Granicus, Avalara), and outdated blog posts. Existing data providers (AirDNA, Rabbu) bury regulation data inside expensive subscriptions. No free, SEO-optimized, regulation-first destination exists.

**Audience (highest-intent first):**
1. Prospective STR investors researching whether a market is viable
2. Current STR owners worried about new ordinances
3. Property managers tracking compliance across portfolios
4. Realtors specializing in STR-friendly properties

## 2. Strategic Constraints (Locked)

- Single national domain (`strlaws.com`), not 50 state-EMD sites
- Single-purpose: regulation data only — no listing audits, calculators, or other tools
- AI-native automation: 80–90% hands-off after launch
- Free content + paid alerts monetization (not paywalled)
- Progressive launch: 50 cities at week 12, scale to 500 in months 2–3
- Claude (Anthropic SDK) with prompt caching mandatory
- Hostinger MySQL + Hostinger hosting — empire parity
- n8n for orchestration glue
- Hybrid monetization plumbing: Influencersoft (marketing + funnels + affiliates), Stripe (premium subscription), Resend (transactional alerts)

## 3. Architecture

```
┌───────────────────────────────────────────────────────────────┐
│  Astro 6 static site (Hostinger)                              │
│  - Programmatic state + city pages from MySQL queries         │
│  - Schema.org GovernmentService + FAQPage + BreadcrumbList    │
└───────────────────────────────────────────────────────────────┘
                       ▲                        ▲
                       │ build-time             │ rebuild trigger
┌──────────────────────┴─────────┐  ┌───────────┴──────────────┐
│  Express + TypeScript          │  │  n8n workflows           │
│  (Hostinger Node host)         │  │  (empire n8n instance)   │
│  - /api/alerts/subscribe       │  │  - scrape-city-sources   │
│  - /api/stripe/webhook         │◀─┤  - extract-ordinance     │
│  - /api/v1/* (premium)         │  │  - detect-changes        │
│  - /admin/review (token-auth)  │  │  - auto-publish          │
└────────────────────────────────┘  │  - dispatch-alerts       │
                       ▲             └──────────────────────────┘
                       │                        ▲
                ┌──────┴────────┐               │
                │  MySQL        │◀──────────────┘
                │  (Hostinger)  │
                └───────────────┘
```

## 4. Stack

| Layer | Tech |
|---|---|
| Frontend | Astro 6 + React islands + Tailwind 3 |
| API server | Express + TypeScript |
| Database | MySQL (`mysql2/promise`) |
| AI | `@anthropic-ai/sdk` — Haiku 4.5 default, Opus 4.7 escalation |
| Orchestration | n8n |
| Scraping | `fetch + cheerio` → Playwright → Firecrawl (tiered fallback) |
| Transactional email | Resend |
| Marketing email + funnels + affiliates | Influencersoft |
| Billing | Stripe (Checkout + portal) |
| Testing | Vitest + Playwright |
| Hosting | Hostinger (static + Node + MySQL) |

## 5. URL Structure

```
/                               National hero + state grid + recent-change feed
/[state]                        State summary + city ranking table
/[state]/[city]                 City deep-dive (primary SEO surface)
/[state]/[city]/history         Change log (>12mo gated to premium)
/alerts                         Premium subscription landing
/blog/                          Auto-generated change posts
/blog/[slug]                    Individual change post
/api/v1/*                       Premium REST API
/legal/sources                  Methodology + E-E-A-T page
/admin/review                   Internal: review queue (token-auth)
```

Slugs are lowercase kebab-case full names. State abbreviations are never used in URLs.

## 6. Data Model (MySQL)

Phase 1 migration (`server/db/migrations/0001_init.sql`) creates:

- `states` — 50 records, slug + name + summary
- `cities` — per-city master with `state_id`, slug, lat/lng, `str_market_rank`, `status` enum (active/skeleton/archived)
- `sources` — per-city or per-state source URLs with fetch status
- `ordinance_snapshots` — raw scrape blobs with hash, confidence, cost
- `regulations` — structured extraction per city, versioned (one row per snapshot extraction)

Later phase migrations (TBD per phase plan) add:
- `regulation_changes` (Phase 4) — diff classifier output
- `review_queue` (Phase 3) — low-confidence escalations
- `alert_subscribers`, `alert_subscriptions` (Phase 5)
- `premium_subscribers` (Phase 6)

## 7. AI Pipeline

Five n8n workflows orchestrate the end-to-end flow. Code lives in `server/lib/`; n8n calls into it via HTTP or `tsx` shell exec.

| Stage | Trigger | Output |
|---|---|---|
| `scrape-city-sources` | Weekly cron | `ordinance_snapshots` rows |
| `extract-ordinance` | New snapshot | `regulations` row OR review_queue item |
| `detect-changes` | Daily cron | `regulation_changes` row |
| `auto-publish` | Material+ change | MDX blog post + Astro rebuild |
| `dispatch-alerts` | Material+ change | Influencersoft (free) + Resend (premium) sends |

**Cost guard:** Per-snapshot extraction cost ≤ $0.05, enforced in `server/lib/ai/claude-client.ts`. Prompt caching breakpoints applied to system + schema + examples.

**Confidence routing:** Score ≥ 0.85 publishes auto; 0.5–0.85 retries on Opus; < 0.5 routes to `review_queue` + Slack notify.

## 8. SEO Surface

- **Schema.org** every page: `GovernmentService` + `FAQPage` + `BreadcrumbList` (city), `WebPage` + state FAQ (state), `Organization` + `WebSite` + `SearchAction` (home), `NewsArticle` (blog)
- **Sitemap:** `@astrojs/sitemap` auto-generated, weekly changefreq, priority 0.7 default
- **Freshness:** "Last verified [date]" prominent on every city page; `dateModified` schema field on regulation change; month-year in `<title>` ("Updated May 2026")
- **Internal linking:** 5 nearest geographic cities (cosine on lat/lng) + 3 most-similar-regulation cities (Jaccard on regulation fields) + parent state
- **AI Overview / answer engines:** TL;DR direct-answer paragraph + FAQ schema with 5 highest-volume "is airbnb legal in [city]" questions per city

## 9. Premium Tier

- **Free:** All city pages, daily-batched alerts, 1 city watchlist
- **Premium $14/mo or $140/yr:** Unlimited watchlist, instant transactional alerts via Resend, full change history (>12mo), CSV export, REST API (1000 req/day)
- **Pro/Agency $49/mo:** Deferred to month 6+ (not in v0.1.0)

Stripe Checkout handles all card flow. Webhook → n8n → `premium_subscribers` row + API key (random 32-byte, hashed at rest) + Resend welcome email.

## 10. Monetization (priority)

1. STR insurance affiliate (Proper, Slimsurance) — $50–200/lead
2. STR-specialist attorney + permit-consultant lead-gen
3. Premium alerts subscription
4. Display ads (Mediavine, month 6+ at 50k sessions/mo)
5. Cross-sell to empire portfolio tools

Affiliate tracking lives in Influencersoft; affiliate links injected into city-page CTAs based on regulation severity (e.g., banned/restricted markets get attorney CTA; permit-required markets get insurance CTA).

## 11. Phase Plan

| Phase | Weeks | Deliverable |
|---|---|---|
| 1 | 1 | Foundation: scaffold + schema + 50-city seed + empire shell |
| 2 | 2 | Static templates + SEO surface (schema, OG, sitemap, Lighthouse ≥95) |
| 3 | 3–4 | AI extraction (Claude + tiered scrape + review_queue + admin) |
| 4 | 5 | Diff engine + auto-publish + blog |
| 5 | 6–7 | Alerts (Influencersoft + Resend) + signup UX |
| 6 | 8–12 | Stripe + premium API + scale to 500 + launch |

## 12. Phase 1 Cut List

Not in v0.1.0 launch:
- 500 cities (launches with 50; scale to 500 weeks 4–12)
- Pro/Agency $49 tier (month 6+)
- API GraphQL (REST is enough)
- State-by-state ranking page (month 4)
- User-submitted corrections (spam vector)
- Public change history >12mo (premium only)
- Mobile app (PWA suffices)
- Forum / comments
- Display ads (until 50k sessions/mo)
- Localization (English-only US)

## 13. Pre-Launch Verification

- All 50 launch cities render with verified data + non-stale `last_verified_at`
- Lighthouse ≥95 on 5 sampled city pages
- Schema.org validator green on city + state + home + blog
- Sitemap at `/sitemap-index.xml` submitted to GSC + Bing
- Alert signup → confirmation → simulated material change → alert email (Resend premium, Influencersoft free)
- Stripe test checkout → webhook → premium_subscribers row + API key issued
- API key auth + rate limit verified on `/api/v1/cities/utah/salt-lake-city`
- n8n weekly scrape sweep completes unattended
- Review queue has ≥5 items processed end-to-end
- Per-snapshot AI cost averaged < $0.05 across last 100 snapshots
- `pnpm test`, `pnpm e2e`, `pnpm typecheck`, `pnpm lint` all green
- Live at `strlaws.com` via Hostinger

## 14. Open Items (User-Handled)

- Domain registration: `strlaws.com` + DNS to Hostinger
- Anthropic API key with prompt caching enabled
- Influencersoft API key + funnel/list creation
- Stripe account + product creation
- Resend account + DNS records (SPF/DKIM)
- n8n instance access
- Slack webhook URL for review queue notifications
- Hostinger MySQL + Node host provisioning
- AirDNA top-markets data source (Phase 3 city scale-up)

## 15. References

- Approved plan file: `~/.claude/plans/use-superpowers-to-design-abstract-elephant.md`
- Empire reference projects: `Excel-Templates/STRGuests-Tools/` (stack pattern), `STRManuals/site/` (Stripe pattern)
- Brainstorming session: 2026-05-14 — `/superpowers:brainstorming` flow with 4 sections approved by Daniel
