# STRLaws — strlaws.com

## Folder Purpose

This subfolder is for **strlaws.com** — a national US short-term-rental regulation database. Programmatic-SEO site covering all 50 states and (at maturity) 500+ cities, with auto-updating regulation data driven by AI scrapers + diff engine. Sister site to strbuyers.tools, strguests.tools, strhost.tools, strops.tools, and Excel-Templates (The STR Ledger).

**Position:** "The free, current, trustworthy source for US short-term-rental regulations."

**Lifecycle stage:** Acquisition (researching) — earliest stop in the host lifecycle. Investors land here BEFORE they buy a property.

**Business model:** Free regulation content + paid alerts subscription. Lead-gen for STR insurance affiliates and permit-consultant referrals. NOT a paywall site.

## Strategic Decisions (Locked)

- **Single national domain** at `strlaws.com` — NOT 50 state-EMD sites (Google's 2012 EMD update killed exact-match domain SEO; cross-linked same-owner domains trigger PBN penalties)
- **Single-purpose focus**: regulation data only. No listing audit, no calculators — those live on separate empire sites
- **AI-native automation**: 80–90% hands-off after launch. Scheduled n8n agents handle scraping, extraction, diff, publish, alerts
- **Free-content / paid-alerts** monetization, not a paywall
- **Progressive launch**: 50 high-priority STR-market cities at week 12, scale to 500 in months 2–3
- **Confidence threshold**: extraction confidence < 0.85 routes to human review queue; everything else publishes automatically

## URL Structure

```
/                         National hero + state grid + recent-change feed
/[state]                  State summary + city ranking table (e.g. /utah)
/[state]/[city]           City deep-dive (e.g. /utah/salt-lake-city) — primary SEO surface
/[state]/[city]/history   Change log (>12mo gated to premium)
/alerts                   Premium subscription landing
/blog/                    Auto-generated change posts (from diff engine)
/blog/[slug]              Individual change post
/api/v1/*                 Premium REST API
/legal/sources            Methodology + E-E-A-T page
/admin/review             Internal: low-confidence review queue (token-auth)
```

All state/city slugs are lowercase kebab-case full names (`/new-york/new-york-city`, not `/ny/nyc`).

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Astro 6 + React islands + Tailwind 3 → Hostinger static |
| API server | Express + TypeScript → Hostinger Node host |
| Database | Hostinger MySQL (`mysql2` driver) |
| AI extraction | `@anthropic-ai/sdk` — Haiku 4.5 default, Opus 4.7 escalation, prompt caching mandatory |
| Orchestration | n8n (empire's self-hosted instance) — scrape sweep, extraction, diff, publish, alerts, Stripe webhook |
| Scraping | Tiered fallback: `fetch+cheerio` → Playwright → Firecrawl |
| Transactional email | Resend (ordinance-change alerts, premium welcome) |
| Marketing email + funnels | Influencersoft (free alerts nurture, affiliate tracking) |
| Billing | Stripe ($14/mo, $140/yr premium tier) |
| Testing | Vitest unit/integration + Playwright E2E |

## Shared Empire Packages (reuse, don't fork)

- `@str/ui-chrome` — header, footer, empire nav
- `@str/seo` — meta tag + schema helpers
- `@str/email-gate` — alert signup form
- `@str/format` — date/currency formatters
- `@str/url-state` — filter param sync

## AI Pipeline (n8n-orchestrated, 5 stages)

1. **scrape-city-sources** (weekly cron) → tiered fetch → hash dedup → `ordinance_snapshots` row
2. **extract-ordinance** (on new snapshot) → Claude w/ `cache_control` → JSON → confidence-gate (≥0.85 publish, else Opus retry, else review_queue + Slack)
3. **detect-changes** (daily) → diff vs prior `regulations` row → classify minor/material/major
4. **auto-publish** (severity ≥ material) → generate MDX blog post → trigger Astro rebuild via Hostinger deploy webhook
5. **dispatch-alerts** (severity ≥ subscriber threshold) → free-tier → Influencersoft Campaign batch; premium → Resend transactional

**Cost ceiling: $0.05 per snapshot extraction.** Enforced in `server/lib/ai/claude-client.ts` cost accumulator. Cache breakpoints on system prompt + schema + examples; only the changing 1–3k tokens (raw ordinance) is uncached.

## Monetization (priority order)

1. **STR insurance affiliate** (Proper, Slimsurance) — $50–200/lead
2. **STR-specialist attorney + permit-consultant lead-gen** — ad slots on high-traffic city pages
3. **Premium alerts subscription** — $14/mo, $140/yr (Stripe)
4. **Display ads** (Mediavine at 50k sessions/mo, ~month 6)
5. **Cross-sell to empire portfolio tools** (footer + contextual)

## Specific Instructions

- **Per-snapshot AI cost guardrail is real.** Always check the accumulator before issuing a Claude call. If projected cost > $0.05, skip + log + push to review_queue.
- **Prompt caching is mandatory.** Every Claude call must have `cache_control` markers on the stable system + schema + examples. Without it, costs blow past $0.05/snapshot fast.
- **Schema markup is non-negotiable.** Every city page ships `GovernmentService` + `FAQPage` + `BreadcrumbList` JSON-LD. This is the AI Overview play.
- **"Last verified [date]" timestamp must be visible** at the top of every city page. Google's freshness ranking signal lives or dies on this.
- **Internal linking density**: every city → 5 nearest geographic cities + 3 most-similar-regulation cities + parent state. Programmatic.
- **Confidence < 0.85 NEVER ships to public.** Pushes to `review_queue`. Slack webhook alerts the reviewer.
- **n8n workflows are the source of truth** for orchestration — code in `server/lib/` is called BY n8n, not the other way around. Export workflow JSON to `n8n/workflows/` for version control.
- **No Postgres, no SQLite.** Empire is MySQL. Match the pattern.
- **No OpenAI.** This site is Claude-only — prompt caching is too valuable to give up.
- **Cross-cluster funnel block in the footer** links to: strbuyers.tools, strguests.tools, strhost.tools, strops.tools, strledger.com.

## Things to Remember

- Tech stack inherits from sister sites (Astro 6, MySQL, Express, pnpm workspace) but DB schema is regulation-first, not product-first
- Brand palette: regulatory/legal/serious — same family as sister sites, distinct accent (deeper navy + parchment, less "warm hospitality" than STRGuests-Tools)
- This is the most SEO-heavy site in the empire — 500+ programmatic pages with quarterly auto-refresh
- Sister projects (all in `Wealth/Businesses/Excel-Templates/`):
  - `STRBuyers-Tools` (strbuyers.tools) — pre-buy acquisition
  - `STRGuests-Tools` (strguests.tools) — guest XP
  - `STRHost-Tools` (strhost.tools) — math/analyzing
  - `STROps-Tools` (strops.tools) — running
  - `STRManuals/site` (strmanuals.com) — paid PDF storefront
  - `STRLedger` (thestrledger.com) — financial backbone

## Phase Plan (12 weeks to v0.1.0)

- **Phase 1** (week 1): Foundation — scaffold, schema, seed 50 cities, empire shell
- **Phase 2** (week 2): Static page templates + SEO (schema, OG, sitemap, Lighthouse ≥95)
- **Phase 3** (weeks 3–4): AI extraction pipeline (Claude + scrape + review_queue)
- **Phase 4** (week 5): Diff + auto-publish + blog
- **Phase 5** (weeks 6–7): Alerts (Influencersoft + Resend)
- **Phase 6** (weeks 8–12): Stripe + premium API + launch + scale to 500 cities

See `docs/superpowers/specs/2026-05-14-strlaws-design.md` for the full spec.

---

**MEMORY SYSTEM**

This folder contains a file called MEMORY.md. It is your external memory for this workspace — use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work — don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks — using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them. Do not auto-delete or expire entries.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
