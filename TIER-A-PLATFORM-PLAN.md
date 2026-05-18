# Tier A Platform Plan — STR Empire Force-Multipliers (round 2)

**Goal:** Now that Tier S has laid the catalog + API + sitemap + shared UI foundation, ship the ten Tier A force-multipliers that compound on top of it.

**Prerequisite:** Tier S Phases 1–3 are landed on `main` (catalog, catalog-api, seo bridge, ui-funnel catalog components). Some Tier A items (Promo Controller, Attribution, AI Concierge) need Tier S Phase 4 (Contact Graph) first.

**Sequencing:**

```
Block 1 (no new infra)
  ├── 1A Internal Link Engine        (catalog only)
  ├── 1B Keyword Cannibalization Guard (catalog only)
  └── 1C Empire Health Monitor       (standalone)

Block 2 (revenue-generating tools)
  ├── 2A Permit / Regulation Lookup  (strlaws.com)
  └── 2B MLS Listing → Underwriter    (strbuyers.tools)

Block 3 (after Tier S Phase 4 Contact Graph)
  ├── 3A Webhook Event Bus           (formalizes /v1/events)
  ├── 3B Empire Promo Controller     (needs Contact Graph + Bus)
  ├── 3C Funnel Attribution Dashboard (needs Contact Graph)
  └── 3D Empire AI Concierge         (needs Contact Graph + Catalog)

Block 4 (editorial workflow)
  └── 4A Content Syndication Pipeline (catalog frontmatter routing)
```

Each block ships independently; blocks 1 and 2 can run in parallel and have **zero infrastructure dependency** — start there for momentum while Phase 4 decisions get made.

---

## Block 1 — Pure catalog consumers (no new infra)

### 1A — Cross-Site Internal Link Engine

**Goal:** Every page on every site auto-surfaces 2–4 contextually-related tools from sister sites without anyone hand-editing nav files.

**Scope**
- Extend `@str/catalog` with a `topicalGraph` accessor that returns, for any tool, a ranked list of catalog tools sharing keywords, audience, or category.
- New component `@str/ui-funnel/CatalogInternalLinks.astro` — renders an inline link block (`See also: [Profit Calculator on STRHost] | [Cash-on-Cash on STRBuyers] | ...`).
- Page-level auto-injection via a small Astro middleware so site authors don't have to drop the block manually.

**Deliverables**
- [ ] `packages/catalog/src/graph.ts` — keyword/audience/category ranking
- [ ] Component + middleware
- [ ] Adopted on guests + host (proof of cross-site link growth)

**Success metric**
Average internal links per page up 3×. Search Console "internal links" count up 50% within 30 days.

**Est. cost:** 2–3 days.

---

### 1B — Keyword Cannibalization Guard

**Goal:** Block PRs that publish a page targeting a query another site already ranks for.

**Scope**
- New package `packages/seo/src/cannibalization.ts`:
  - `checkCannibalization(catalog, newTool)` returns `{ok, conflicts: [{toolId, sharedKeywords}]}`
  - Runs in CI on every PR that adds or modifies a tool entry / page frontmatter
- Pulls live GSC data (optional, Phase 2) — for now compares against the catalog's `keywords[]`.
- Output to PR comment + nonzero exit if HIGH-overlap conflicts.

**Deliverables**
- [ ] `cannibalization.ts` + CLI wrapper
- [ ] GitHub Action that runs it on PRs touching catalog or `*.astro` pages
- [ ] First detection report committed for visibility

**Success metric**
Zero new cannibalization conflicts merged. Existing conflicts surfaced and triaged in a one-time backfill.

**Est. cost:** 1–2 days.

---

### 1C — Empire Health Monitor

**Goal:** One page that shows uptime, SSL expiry, broken links, 404 rate, and form-submit failure for every site. Pages someone when a site goes down or a lead form breaks silently.

**Scope**
- New service `tools/empire-health/` (Fastify, match Pinforge pattern).
- Cron-driven checks:
  - HTTP 200 on `/` for every catalog site (every 5 min)
  - SSL cert expiry (every 6 hrs)
  - Broken-link sweep on top 20 pages per site (daily)
  - Form-submit canary POST to `/lead-capture` endpoints (every 30 min)
- Status page at `dashboard.thestrledger.com/status` — public, cached, simple grid.
- Slack/email alert via InfluencerSoft when red.

**Deliverables**
- [ ] Service + cron worker
- [ ] Status page
- [ ] First alert routed end-to-end

**Success metric**
Mean-time-to-detect for any site outage drops to under 10 minutes.

**Est. cost:** 4–5 days.

---

## Block 2 — High-intent net-new tools

### 2A — Permit / Regulation Lookup (strlaws.com)

**Goal:** Searchable, interactive STR rules by state + city — the largest underserved query in the buyer/host journey. Already a `laws.regulations-lookup` catalog entry marked `planned`.

**Scope**
- Source dataset: top 200 STR-active cities + every state-level overlay; license + cite. Curate v1 manually, expand via scraper.
- New site `STRLaws/` (Astro, reuse template from STRHost-Tools).
- Two page templates:
  - `/states/[state]` — state-level overlay (tax, registration, occupancy caps)
  - `/cities/[slug]` — city detail with permit links, contact, last-checked date
- Auto-link from `buyers.market-score`, `host.lodging-tax` via catalog `related[]`.
- Catalog entry flips from `planned` → `shipped`.

**Deliverables**
- [ ] Dataset (CSV → committed JSON)
- [ ] Astro routes + search UI
- [ ] Catalog updated, sitemap auto-includes via Tier S Phase 2 emitter

**Success metric**
First 5 city pages on page 1 for "[city] short term rental rules" within 90 days.

**Est. cost:** 7–10 days (mostly data curation, not code).

---

### 2B — MLS Listing → Underwriter (strbuyers.tools)

**Goal:** Buyer pastes a Zillow / Realtor URL, the tool scrapes price + sqft + beds, pre-fills the cash-on-cash calculator. Removes the manual-entry friction that kills calculator completion rates.

**Scope**
- New endpoint on `tools/catalog-api` or new tiny `tools/listing-scraper/` service:
  - `POST /v1/listings/extract { url }` → `{ price, beds, baths, sqft, address, photos[] }`
- Scraping: server-side fetch with rotating user agents, parse JSON-LD `RealEstateListing` schema where available, regex fallback.
- Frontend: new `buyers.listing-scrape` calculator wraps `cash-on-cash-calculator` with an "Import from URL" button at the top.
- Save scraped listings to Contact Graph as a high-intent signal (after Phase 4).

**Deliverables**
- [ ] Scraper endpoint with tests against 3 platforms (Zillow, Realtor, Redfin)
- [ ] Frontend wrapper
- [ ] Catalog entry + cross-link to existing cash-on-cash tool

**Success metric**
Cash-on-cash calculator completion rate +30% on buyers who arrive via this entry point.

**Est. cost:** 5–7 days.

**Risks:** TOS / anti-bot. Mitigate by using only public schema markup; do not scrape behind login. If fragile, fall back to manual paste flow.

---

## Block 3 — Backend-dependent (after Tier S Phase 4)

### 3A — Webhook Event Bus

**Goal:** Formalize cross-site events so n8n and the upsell engine consume one typed stream instead of polling 8 different sites.

**Scope**
- Extends Tier S Phase 4 Contact Graph `/v1/events` endpoint into a pub/sub bus.
- Subscribers register a URL + event filter; bus delivers, retries with backoff, dead-letters.
- Event schema enforced from `@str/catalog/events` (GA4 enum + Contact Graph events).
- Admin UI at `dashboard.thestrledger.com/bus` to inspect last 1000 events.

**Deliverables**
- [ ] Subscriber table in Postgres
- [ ] Delivery worker + retry/DLQ
- [ ] Inspector UI
- [ ] First two subscribers: Promo Controller + Upsell Engine

**Est. cost:** 4–5 days.

---

### 3B — Empire Promo Controller

**Goal:** Launch a "20% off Black Friday" sale once; banners + checkout discounts propagate to every site automatically, with tracking.

**Scope**
- New table `promos` on Contact Graph DB:
  - `id, name, code, percent_off, starts_at, ends_at, sites[], tools[], banner_text`
- API on catalog-api: `GET /v1/promos/active?site=`
- New component `@str/ui-funnel/CatalogPromoBanner.astro` — fetches active promo for the current site, renders site-wide.
- Stripe coupon code provisioned at promo-create time so checkout honours it.
- Event dispatched on bus: `promo_started`, `promo_used`, `promo_ended`.

**Deliverables**
- [ ] DB migration + API
- [ ] Banner component + adoption on all 8 sites (one-line import)
- [ ] Admin UI on dashboard
- [ ] First test promo end-to-end

**Success metric**
Single sale launches in under 10 minutes vs current ~hours. Conversion lift measurable via Attribution Dashboard.

**Est. cost:** 5–7 days.

---

### 3C — Funnel Attribution Dashboard

**Goal:** Multi-touch attribution: lead → free PDF → email → paid template, across all 8 sites.

**Scope**
- New page on dashboard: `/attribution`
- Reads from Contact Graph events: filterable by tool, site, source, time range.
- Charts: funnel (visited → calc-completed → email-captured → tool-used-again → purchased), source attribution (which entry tool drives most paid conversions), site-graph (which sites refer most to which).
- One-click "export contacts at stage X" → InfluencerSoft list.

**Deliverables**
- [ ] SQL views for the core funnels
- [ ] Dashboard charts (Recharts or similar)
- [ ] InfluencerSoft list export endpoint
- [ ] First weekly attribution PDF auto-mailed to owner

**Success metric**
Per-tool LTV measurable. Promo/email decisions made from data instead of guess.

**Est. cost:** 5–7 days.

---

### 3D — Empire AI Concierge

**Goal:** A chat widget on every site that knows the entire catalog + user's recent activity and routes visitors to the right tool, PDF, or blog post.

**Scope**
- New service `tools/concierge-api/` — thin wrapper around Claude API.
- System prompt seeded with `@str/catalog` minified + recent Contact Graph history for the user (if known).
- Catalog-grounded — model must cite a `toolId` for any tool recommendation; the wrapper verifies the id exists and returns the canonical URL.
- New widget `@str/ui-funnel/CatalogConcierge.astro` (Astro island + React); per-site CSS theming via siteConfig.
- Rate limit by IP + cookie (5 questions / hour free, gated to 50 after email capture — reuses Phase 4 flow).

**Deliverables**
- [ ] Catalog-grounded prompt + tool-id verification
- [ ] Widget on all 8 sites
- [ ] Logs → Contact Graph events (`concierge_query`, `concierge_recommendation_clicked`)

**Success metric**
20% of widget interactions click through to a recommended tool. Concierge-attributed multi-tool sessions detectable in Attribution Dashboard.

**Est. cost:** 5–7 days.

---

## Block 4 — Editorial workflow

### 4A — Content Syndication Pipeline

**Goal:** Write a post once, publish to multiple sites with canonical handling.

**Scope**
- MDX frontmatter extension: `targets: [host, ops]`
- Build pipeline reads frontmatter, emits a copy to each target site's `src/content/posts/`, with:
  - First-published site = canonical
  - Other sites = `<link rel="canonical">` pointing back
  - Per-site CTA injection (each site's catalog tool recommendations swap in)
- Idempotent — re-running the pipeline updates copies in place; deleting from source removes from targets.

**Deliverables**
- [ ] CLI script + GitHub Action
- [ ] First 3 cross-published posts as proof
- [ ] CTA recommendations sourced from catalog (Block 1A internal links engine handles this)

**Success metric**
Writing volume halved (1 post → 2–3 site appearances). Compound traffic from natural keyword variation across sites.

**Est. cost:** 3–4 days.

---

## Suggested timeline

| Week | Block | Tier A items | Notes |
|------|-------|--------------|-------|
| 1 | Block 1 (parallel) | Internal Link Engine + Cannibalization Guard | Pure catalog work, no infra |
| 2 | Block 1 | Health Monitor | Service deploy on Hostinger |
| 3–4 | Block 2 | Permit Lookup (data + UI) | Mostly data curation |
| 5 | Block 2 | MLS Scraper | One-week sprint |
| 6 | Tier S Phase 4 | Contact Graph (blocks 3A–3D) | Backend commitment week |
| 7 | Block 3 | Webhook Bus | Built on Phase 4 |
| 8 | Block 3 | Promo Controller | Ahead of Black Friday |
| 9 | Block 3 | Attribution Dashboard | |
| 10 | Block 3 | AI Concierge | |
| 11 | Block 4 | Syndication Pipeline | |

**Total: ~11 weeks** linear, but Blocks 1+2 can compress to 3 weeks if run in parallel. Critical path is Tier S Phase 4 — every Block 3 item waits on it.

---

## Decision checkpoints

| When | Decision |
|------|----------|
| Before Block 2A | Does Daniel have an STR-rules data source (vetted CSV / paid feed) or does the team curate by hand? |
| Before Block 2B | Confirm scraping policy stays on public schema-markup only — never behind login. |
| Before Block 3 | Tier S Phase 4 must be done. |
| Before Block 3D | OpenAI/Claude API budget + per-IP rate-limit caps locked. |
| Before Block 4A | Editorial team agrees on the "canonical-site-first" policy for cross-published posts. |

---

## What this plan deliberately defers

These ideas surfaced in the original brainstorm but don't make Tier A:

- **Empire SSO** — Tier C, only matters once paid tools demand login.
- **Affiliate Portal** — Tier B, useful once Contact Graph + Promo Controller exist.
- **Image CDN / Asset Pipeline** — Tier C, useful only at scale.
- **Newsletter Aggregator** — Tier B, becomes trivial after Syndication Pipeline (4A) lands.
- **Backup Orchestrator** — Tier C, defensive; build before first heavy paid usage.

These get a Tier B / Tier C plan after Tier A ships.
