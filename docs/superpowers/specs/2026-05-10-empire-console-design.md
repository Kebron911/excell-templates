# Empire Console — Design Spec

*Drafted 2026-05-10 · Revised 2026-05-10 to elevate n8n + Telegram to first-class.*

> A single internal interface to **Promote, Check, and Maintain** The STR Ledger empire, paired with an n8n nervous system that pushes priority alerts to Telegram. Replaces the 10-tab morning routine across Etsy / Stripe / Gumroad / IS / Airtable / n8n / Pinterest / 4 sister sites / main hub.

---

## 1. Problem

Running the empire today means context-switching across ~10 surfaces every morning. P9 (Operations always-on) defines the discipline (`PROGRESS.md` §P9.1–P9.9) but offers no single pane to execute it. Without one, the discipline rots — the daily dashboard goes unread, runbooks go stale, vendor renewals slip, backups go untested, kill-SKU criteria stay theoretical.

The 15 internal tools previously surfaced (`str` CLI, daily scoreboard, cluster manifest, link checker, vendor tracker, runbook index, backup harness, kill-SKU report, atomization renderer, W-update pipeline, GDPR handler, lifecycle QA, Etsy↔site diff, pin generator, status emitter) all share the same data plane and the same operator. Building them as 15 separate scripts wastes the network effect.

## 2. Goals

- **One interface** Daniel opens each morning. Replaces 5+ tabs.
- **Three verbs:** Promote · Check · Maintain. Every feature lives under one.
- **Local-first.** Runs on the laptop. No internet required for filesystem-driven views.
- **n8n is the nervous system.** Cron-driven flows push priority alerts to Telegram; the console is the drill-in surface when an alert fires (or when reviewing the empire on a quiet day).
- **Brand-consistent.** Same Astro + design-system stack as sister sites — proves the cluster style guide, no new tech surface.
- **Read-mostly UI.** Every *write* action triggers an n8n webhook. The console never owns external state.
- **Phase 1 is useful alone.** If filesystem-only views + a working alert tier aren't valuable, the rest won't get built.

## 3. Non-goals

- Replacing Airtable as SSOT.
- Replacing n8n — *amplifying* it. n8n stays the automation engine; the console is its UI surface.
- Customer-facing anything.
- A native mobile app (Telegram + browser-on-mobile is enough; remote console access is Phase 5).
- Holding any production secret. n8n keeps secrets; console reads cached data and posts triggers.

## 4. Critical assumptions

These will drive the design. **Correct any now or I'll proceed with them.**

1. Astro 4 + Tailwind + the cluster style guide is the right stack (consistent with sister sites; chrome reuses).
2. SQLite local cache for API data is acceptable — not Postgres. Airtable stays SSOT.
3. n8n is the *nervous system*. Console reads its outputs (cached metrics, alert log) and posts to its webhooks. Console never directly mutates Stripe / Etsy / IS / Gumroad / Airtable.
4. Telegram is the alert sink (Daniel already uses it). One bot, three channels (P0 page / P1 daily / P2 weekly). One-tap deep links into the console for drill-in.
5. Hostinger basic-auth + IP allowlist is acceptable remote security for Phase 5.
6. Daniel can spend ~6–8 hours per phase before wanting to use it.

## 5. Architecture

```
tools/empire-console/
├── package.json
├── astro.config.mjs                # extends shared cluster astro.config
├── src/
│   ├── pages/
│   │   ├── index.astro             # Today (landing)
│   │   ├── promote/
│   │   │   ├── index.astro
│   │   │   ├── atomization.astro
│   │   │   ├── pins.astro
│   │   │   ├── pinterest.astro     # Pinterest performance (Phase 4)
│   │   │   ├── broadcasts.astro
│   │   │   ├── lifecycle.astro
│   │   │   └── keywords.astro      # Keyword opportunities (Phase 4)
│   │   ├── check/
│   │   │   ├── index.astro
│   │   │   ├── money.astro         # Phase 3 — revenue, refunds, P&L
│   │   │   ├── contacts.astro      # Phase 3 — IS funnel + drop-out + list health
│   │   │   ├── traffic.astro       # Phase 3 — GA4 + Plausible
│   │   │   ├── seo.astro           # Phase 3 — GSC + CWV + indexing
│   │   │   ├── audits.astro        # Phase 2 — meta, schema, sitemap, broken
│   │   │   ├── catalog.astro
│   │   │   ├── cluster.astro
│   │   │   ├── links.astro
│   │   │   ├── kill-sku.astro
│   │   │   └── alerts.astro        # full alert log (n8n-fed)
│   │   └── maintain/
│   │       ├── index.astro
│   │       ├── runbooks.astro
│   │       ├── vendors.astro
│   │       ├── backups.astro
│   │       ├── releases.astro
│   │       └── compliance.astro
│   ├── components/
│   │   ├── chrome/Layout.astro     # cluster Layout, reused
│   │   ├── widgets/Scorecard.astro
│   │   ├── widgets/HealthGrid.astro
│   │   ├── widgets/AlertFeed.astro # tails ops/alerts.ndjson
│   │   └── widgets/ActionButton.astro     # POSTs to n8n webhook
│   ├── lib/
│   │   ├── data/                   # readers
│   │   │   ├── progress.ts
│   │   │   ├── manifest.ts
│   │   │   ├── cluster.ts
│   │   │   ├── runbooks.ts
│   │   │   ├── vendors.ts
│   │   │   ├── alerts.ts           # reads ops/alerts.ndjson written by n8n
│   │   │   ├── etsy.ts
│   │   │   ├── stripe.ts
│   │   │   ├── gumroad.ts
│   │   │   ├── airtable.ts
│   │   │   ├── influencersoft.ts
│   │   │   ├── ga4.ts
│   │   │   ├── plausible.ts        # cluster-wide sessions
│   │   │   ├── gsc.ts              # Search Console impressions/clicks/position
│   │   │   ├── crux.ts             # Core Web Vitals (CrUX/PSI)
│   │   │   ├── pinterest.ts        # Phase 4
│   │   │   ├── erank.ts            # Etsy SEO (Phase 4)
│   │   │   └── audits.ts           # filesystem dist/ scanner (meta, schema, sitemap)
│   │   ├── cache/sqlite.ts         # ~/.empire-console/cache.db
│   │   └── n8n/trigger.ts          # POST helpers + webhook URL registry
│   └── styles/                     # imports ../../design-system/tokens.css
├── server/
│   ├── index.ts                    # Hono, /api/refresh, /api/run/:job, /api/alerts (sink)
│   └── jobs/
│       ├── manifest.ts             # invoked by n8n on push to main
│       └── linkcheck.ts            # invoked by n8n post-build
├── cli/
│   └── empire.ts                   # `empire status`, `empire deploy ops`, etc.
├── tests/
└── docs/

infrastructure/n8n/flows/           # NEW — versioned n8n flow exports
├── cluster-smoke.json              # every 15min · P0 on flap
├── manifest-watch.json             # on push to main · P0 on red
├── vendor-renewal-watch.json       # daily 09:00 · P1 if ≤7d
├── runbook-staleness.json          # weekly Mon · P1 digest if >6mo
├── nightly-refresh.json            # 02:00 · pulls Stripe/Etsy/Gumroad/IS/GA4 → SQLite + P1 morning digest
├── kill-sku-watch.json             # weekly Mon · P2 digest
├── backup-restore-test.json        # monthly 1st · P0 on fail
├── gdpr-intake.json                # on form · P1 alert + queue
├── release-shipped.json            # on VERSION bump · runs W-update + P1 confirmation
└── shared/telegram-router.json     # routes by priority to correct channel
```

### 5.1 Data flow

```
                          ┌─────────────┐
                          │ Filesystem  │   PROGRESS · runbooks · manifests · _delivery · vendor-inventory
                          └──────┬──────┘
                                 │ read
                                 ▼
   Daniel's browser ─► Empire Console ◄─── reads ──── SQLite cache ◄── writes ── n8n nightly-refresh
                            ▲   │                          ▲
                            │   │ POST /trigger            │
              reads alerts  │   ▼                          │
              from ops/     │  n8n webhook ──► Etsy/Stripe/IS/Airtable/Gumroad
              alerts.ndjson │                              │
                            │                              │
                            │   ┌──────────────────────────┘
                            │   │
                            │   ▼
                            └── n8n cron flows ──► Telegram bot ──► Daniel's phone
                                  (every 15min /                     P0=page  P1=digest  P2=weekly
                                   daily / weekly /
                                   monthly / on-event)
```

Three principles enforced by this shape:
1. **Console never writes external state.** All side effects via n8n webhook → n8n owns retries, logging, secrets.
2. **n8n is the always-on layer.** Console can be closed; nothing breaks.
3. **One alert log.** n8n writes every alert to `ops/alerts.ndjson` (append-only). Console reads it for the AlertFeed widget; the same record is sent to Telegram with the right priority. One source, two surfaces.

### 5.2 n8n companion flows

Each flow is a versioned JSON export checked into `infrastructure/n8n/flows/`. They form the alerting + automation layer.

| Flow | Trigger | What it does | Alert priority |
|---|---|---|---|
| `cluster-smoke` | cron 15min | Hits each sister site's `/api/health` + 1 representative tool page | **P0** if any site fails 2 consecutive runs |
| `manifest-watch` | webhook (push to main) | Runs `templates/_build/manifest_check.py` | **P0** if exit ≠ 0 |
| `vendor-renewal-watch` | cron daily 09:00 | Parses `ops/vendor-inventory.yaml`, finds renewals ≤7d | **P1** digest |
| `runbook-staleness` | cron weekly Mon 08:00 | Walks `**/runbooks/*.md` frontmatter `last_reviewed` | **P1** if any >6mo |
| `nightly-refresh` | cron 02:00 | Pulls Stripe + Etsy + Gumroad + IS contacts/sequences/tags + GA4 + GSC + Plausible → SQLite cache; computes deltas | **P1** morning digest |
| `signup-watch` | cron daily 08:00 | New IS contacts yesterday vs 14d avg | **P1** if drop >50% (capture broken) |
| `list-health-watch` | cron daily 08:00 | IS bounce/unsub/complaint rate (rolling 30d) | **P0** if bounce >2% OR complaint >0.1% (deliverability) |
| `funnel-dropout-watch` | cron weekly Mon 08:00 | Visitor → opt-in → engaged → purchaser conversion deltas | **P2** digest; **P1** if any stage drops >50% week-over-week |
| `engagement-decay-watch` | cron weekly Mon 08:00 | Contacts no-opens >90d, count delta, re-engage candidates | **P2** digest |
| `newsletter-cadence-watch` | cron weekly Mon 08:00 | Days since last broadcast on each newsletter (`ops/newsletter-pipeline.yaml`) | **P1** if >14d on a weekly; P0 if >28d |
| `newsletter-perf-watch` | webhook (on send via IS API) | Per-broadcast open/click/unsub/complaint immediately + at +24h + at +72h | **P1** if open <20% or unsub >0.5%; **P0** if complaint >0.1% |
| `asset-stale-watch` | cron weekly Mon 08:00 | Walks `ops/assets/*.yaml`, flags entries with `last_updated` >365d or undated | **P2** weekly digest |
| `document-expiry-watch` | cron weekly Mon 06:00 | Walks `ops/assets/documents.yaml` for `expires` field | **P1** ≤30d, **P0** if expired |
| `lead-magnet-perf-watch` | cron weekly Mon 08:30 | Per-lead-magnet conversion rate (visits → opt-ins) from IS + GA4 | **P1** if conversion drops >50% WoW |
| `tool-untracked-watch` | cron monthly | Diffs `ops/assets/tools.yaml` against each sister site's `src/pages/` to flag tools that exist but aren't tracked | **P2** monthly |
| `kill-sku-watch` | cron weekly Mon 08:30 | Reads SQLite, applies thresholds (CVR<1%, 0 sales 90d) | **P2** digest |
| `revenue-watch` | cron daily 08:00 | Yesterday revenue per channel vs trailing-7d avg | **P1** digest; **P0** if 0 orders for 3d post-launch |
| `refund-spike-watch` | cron hourly | Refund rate >5% in 24h on any SKU OR ≥3 refunds on one SKU in 24h | **P0** (corrupt-file early signal) |
| `weekly-pnl-digest` | cron Mon 08:00 | Last week revenue · burn · gross margin · top/bottom SKU | **P2** |
| `traffic-anomaly-watch` | cron daily 08:00 | GA4/Plausible sessions yesterday vs trailing-14d avg | **P1** if drop >30% |
| `gsc-digest` | cron Mon 08:00 | Search Console: top queries, position deltas, CTR | **P2** |
| `cwv-watch` | cron daily 08:00 | Core Web Vitals per cluster page (CrUX/PSI) | **P1** if any page exits "Good" |
| `indexing-watch` | cron daily 08:00 | New Search Console indexing errors | **P1** |
| `sitemap-freshness` | cron daily 08:00 | sitemap.xml `<lastmod>` per cluster site | **P0** if any >7d (build broken) |
| `broken-link-watch` | cron weekly Sun 04:00 | Crawl cluster for 4xx/5xx external links | **P1** |
| `backup-restore-test` | cron monthly 1st 03:00 | Pulls IS+Airtable export, restores to scratch, asserts row counts | **P0** if fail |
| `gdpr-intake` | webhook (privacy@ form) | Creates `ops/data-rights-queue.yaml` entry, starts SLA clock | **P1** |
| `release-shipped` | webhook (`_delivery/<sku>/VERSION` bump) | Runs W-update: Etsy listing files + email prior buyers + IS tag | **P1** confirmation |
| `telegram-router` | shared sub-flow | Routes by priority → P0 channel / P1 channel / P2 channel; writes to `ops/alerts.ndjson` | — |

**Why each flow is in n8n, not the console:** every one of these must run when the console is closed. The console is a UI; n8n is the nervous system.

### 5.3 Alert priority bands

| Band | Channel | Behavior | What goes here |
|---|---|---|---|
| **P0 — Page** | `@strledger-p0` (Telegram, sound on) | Push immediately, retry 5min if no read receipt | Site down · payment failing · manifest red · backup restore failed · refund spike · sitemap stale (build broken) |
| **P1 — Daily** | `@strledger-p1` (Telegram, silent) | Coalesced into morning 08:00 digest | Yesterday revenue/refunds · IS bounces · vendor renewal ≤7d · stale runbook · GDPR request · release shipped · traffic anomaly · CWV regression · GSC indexing errors · broken external link |
| **P2 — Weekly** | `@strledger-p2` (Telegram, silent) | Monday 08:00 digest only | Kill-SKU candidates · monthly burn delta · quarterly review reminders · weekly P&L · GSC top queries + position deltas |

Every alert message ends with a deep link: `https://console.thestrledger.com/check/alerts?id=<uuid>` (Phase 5) or `http://localhost:4327/check/alerts?id=<uuid>` (Phase 1). One tap → drill-in.

## 6. The three verbs

### Promote — content & distribution

| Module | Reads from | Writes via | Alert tie-in |
|---|---|---|---|
| **Newsletter** | `ops/newsletter-pipeline.yaml` + IS broadcast history (cached) | n8n IS-import webhook (send) | **P1** cadence drift (>14d), **P1** poor open/unsub, **P0** complaint spike |
| **Atomization queue** | `copy/_atomization/` | n8n distribution flow on "Send" | P1 confirmation on send |
| **Pin generator** | `brand/assets/` + atomization deck | local SVG → PNG render | — |
| **Pinterest performance** | Pinterest API (cached) | n8n nightly | P2 weekly top pin |
| **Broadcast queue** | IS YAML | n8n IS-import webhook | P1 on send |
| **Lifecycle preview** | IS sequence YAML | read-only | — |
| **Keyword opportunities** | GSC + eRank/DataForSEO (cached) | feeds atomization queue | P2 weekly gap report |

### Check — health & metrics

| Module | Reads from | Refresh | Alert tie-in |
|---|---|---|---|
| **Today scorecard** | SQLite cache | n8n nightly-refresh | P1 morning digest |
| **Money** | Stripe + Etsy + Gumroad (cached) | n8n nightly-refresh | P1 revenue, **P0** refund spike, P2 weekly P&L |
| **Contacts (funnel)** | IS contacts/sequences/tags (cached) | n8n nightly-refresh | P1 sign-up drop, **P0** list-health, P2 dropout + decay |
| **Traffic** | GA4 + Plausible (cached) | n8n nightly-refresh | P1 anomaly (>30% drop) |
| **SEO** | Search Console + CrUX/PSI (cached) | n8n nightly-refresh | P1 indexing errors + CWV regression, P2 GSC digest |
| **Site audits** | `dist/` of each site | on build + weekly cron | P0 sitemap stale, P1 broken meta/schema/links |
| **Catalog manifest** | `manifest_check.py` | on-demand + n8n manifest-watch | **P0** on red |
| **Cluster status** | smoke results | n8n cluster-smoke 15min | **P0** on flap |
| **Kill-SKU candidates** | SQLite + thresholds | n8n kill-sku-watch weekly | P2 digest |
| **Alert log** | `ops/alerts.ndjson` | live tail | — (this is the audit trail) |

> **Books-of-record note:** the **Money** module is operational, not bookkeeping. Tax-grade P&L lives in Wave/QuickBooks (PROGRESS §P9.2). The console links out to the books-of-record tool from Maintain → Money index for any work that affects the trial balance.

### Maintain — ops discipline

| Module | Reads from | Action | Alert tie-in |
|---|---|---|---|
| **Runbook index** | `**/runbooks/*.md` frontmatter | flags stale (>6mo) | P1 weekly stale digest |
| **Vendor costs** | `ops/vendor-inventory.yaml` | flags renewals ≤30d, monthly burn | P1 daily renewal watch |
| **Backup verification** | last restore-test log | "Run restore test" → n8n | **P0** on fail |
| **Releases** | `_delivery/<sku>/VERSION` | "Ship update" → n8n W-update | P1 on ship |
| **Compliance** | `ops/data-rights-queue.yaml` | "Process request" → n8n GDPR flow | P1 on intake + SLA breach |

### Today — landing

Single-screen morning routine:
- **Above-the-line scorecard** — MTD revenue, MTD burn, gross-margin ratio (single number Daniel knows by heart)
- **3 secondary numbers** — yesterday's revenue / refunds / sessions (from SQLite, written by `nightly-refresh`)
- **Live alert feed** — last 5 entries from `ops/alerts.ndjson` with priority badge
- **Top 3 stale items** — runbooks >6mo, renewals ≤30d, untested SKUs
- **Next action** — next unchecked P0 / P0.0 / P0.5 item from `PROGRESS.md`
- **"Open weekly content brief"** button if it's Monday

## 7. MVP — four phases

Phasing rebalanced so n8n + Telegram lands in **Phase 1**. The alerting tier is what turns this from "another dashboard" into "always-on ops".

### Phase 0.5 — Secrets inventory *(~30min)*

- `tools/empire-console/.env.example` with every env var documented
- `infrastructure/n8n/secrets-inventory.md` listing every n8n credential + which flows use it
- `.gitignore` review: ensure no `.env`, `*.key`, n8n webhook URLs, or alert payloads land in git

### Phase 1 — Filesystem console + first alerts + Money verb *(target ~3 days)*
*Useful daily-driver from day one. Telegram covers the urgent path. Money split off as 4th verb.*

Console:
- Astro skeleton + Layout (reuse cluster chrome) — **nav: Today · Money · Promote · Check · Maintain**
- Today landing — PROGRESS regex + runbook freshness + AlertFeed + **Due-this-week card** (B4) + **weekly-rhythm card** (B23)
- **Money landing** — placeholder verb root (sub-pages light up in Phase 3)
- Check → Catalog (wraps existing `manifest_check.py`)
- Check → Cluster (filesystem-level: `dist/` presence + last-built timestamps)
- Check → Alerts (full log view)
- **Check → Infrastructure** (B1) — SSL/domain expiry from `ops/infrastructure.yaml`
- Maintain → Runbooks index
- Maintain → Vendors (reads YAML)
- **Maintain → Assets (NEW)** — unified registry for lead magnets · tools · documents · brand assets · email templates · pages. Read from `ops/assets/*.yaml`. Six per-type sub-pages with type-specific columns. Stale watch on every entry.
- **Atlas (NEW, top-level)** — `/atlas` directory of *everything*: every console page, every external system (Stripe / Etsy / IS / Hostinger / etc.), every spec/runbook, every YAML source of truth, every n8n flow, every code location. Read from `ops/atlas.yaml`. Persistent header link on every page. Client-side filter + kind-filter; press `/` to focus. Single source for "where is X?"
- **Per-site atlases** — `/atlas/<siteId>` for each cluster site (thestrledger / strguests / strhost / strops / strbuyers). Read from `ops/atlas/sites/<siteId>.yaml` + auto-derives lead magnets, tools, pages tagged with that site + matching domain entry from infrastructure.yaml. Linked from master atlas as a "Per-site atlases" section.
- CLI: `empire dev`, `empire status`, `empire alert <P0|P1|P2> "<msg>"` (manual push)

n8n:
- `shared/telegram-router` — the priority sink
- `vendor-renewal-watch` — first daily P1 cron
- `runbook-staleness` — first weekly P1 cron
- `cluster-smoke-fs` — checks `dist/` mtime per site (HTTP variant lands in Phase 2)
- **`cert-watch`** (B1) — daily 06:00, P1 ≤14d, **P0** ≤3d
- **`domain-watch`** (B1) — weekly Mon 06:00, P1 ≤60d, **P0** ≤7d
- **`due-soon-watch`** (B4) — daily 07:00, P1 ≤7d, **P0** if any overdue

Seeds:
- `ops/infrastructure.yaml` — domains + cert provider per site
- `ops/calendar.yaml` — recurring obligations (tax filings, sales-tax remittance, insurance, business filings, content cadences)

**Exit:** Daniel opens the console each morning, *and* Telegram beeps when something needs him before he opens it.

### Phase 2 — Live cluster + manifest + site audits *(~1.5 days)*

Console:
- Cluster smoke runner (calls each site's `scripts/smoke.mjs` directly)
- Link health checker (walks built HTML for cross-site refs)
- Per-site green/red grid
- Status JSON emitter
- **Site audits** — filesystem-only scan of each `dist/`: missing `<title>`/`<meta description>`, missing/invalid JSON-LD, sitemap freshness, robots.txt sanity, broken internal links

n8n:
- `cluster-smoke` upgraded to HTTP (P0 on flap)
- `manifest-watch` (P0 on red)
- `sitemap-freshness` (P0 if any cluster site sitemap >7d)
- `broken-link-watch` (P1 weekly Sun)
- **`n8n-self-watch`** (B2) — every flow's last-run status + P1 if any flow >24h since success; pings external uptime service for the watchdog-of-watchdog

Console:
- **Maintain → Automations** (B2) — n8n executions API: per-flow last-run/duration/error rate

### Phase 3 — API integrations: money + traffic + SEO *(~3–4 days)*

Console:
- SQLite cache layer
- **Money** module (now its own verb) — yesterday/week/MTD revenue per channel, per-SKU revenue + refund rate, kill-SKU candidates
- **Promote → Customer Support** (B3) — Etsy convos queue · Gumroad messages · `hello@` Gmail count · first-response time per channel
- **Contacts (funnel)** module — total list, new sign-ups, engaged, cold (>90d) · visitor → opt-in → engaged → purchaser conversion · drop-out point analysis · top sign-up sources · list health (bounce/unsub/complaint) · sequence performance
- **Traffic** module — GA4 + Plausible sessions, top pages, funnel, source breakdown
- **SEO** module — Search Console impressions/clicks/position, top queries, CWV per page, indexing errors
- Today scorecard becomes real (above-the-line ratio + 3 secondary numbers)
- Kill-SKU report

n8n:
- `nightly-refresh` (Stripe + Etsy + Gumroad + IS + GA4 + GSC + Plausible → SQLite + P1 morning digest)
- `revenue-watch` (P1 daily; P0 if 0 orders for 3d post-launch)
- `refund-spike-watch` (**P0** hourly)
- `weekly-pnl-digest` (P2 Mon)
- `signup-watch` (P1 daily if new sign-ups drop >50% vs 14d avg)
- `list-health-watch` (**P0** if bounce >2% or complaint >0.1%)
- `funnel-dropout-watch` (P2 Mon; P1 escalation if any stage drops >50% WoW)
- `engagement-decay-watch` (P2 Mon)
- **`convo-age-watch`** (B3) — every 30min, **P0** if any Etsy convo unread >24h
- **`reputation-watch`** (B8) — every 4h, **P0** on any new ≤2-star review or first review on a SKU
- `traffic-anomaly-watch` (P1 daily)
- `gsc-digest` (P2 Mon)
- `cwv-watch` (P1 daily)
- `indexing-watch` (P1 daily)
- `kill-sku-watch` (P2 weekly)

### Phase 4 — Action layer + traffic acquisition *(~4–5 days)*

Console — **action**:
- `n8n/trigger.ts` + ActionButton component
- Releases module wired
- Backup verification trigger
- Compliance queue UI
- Atomization "Send" button
- Pin generator (hoists STRGuests-Tools pin code to `tools/shared/pin-builder/`)

Console — **Promote → Acquisition** (NEW group, B11–B17):
- **Backlinks** (B11) — outreach pipeline · acquired log · lost recovery · anchor-text health
- **Influencers** (B12) — prospect list (STR coaches/IG/YT) · outreach status · active partnerships · per-partner perf (UTM + code redemptions)
- **Affiliates** (B13) — leaderboard · pending commissions · payouts due · top codes · cookie attribution chain (PROGRESS §P5.7)
- **Press / PR** (B14) — podcast outreach · HARO/Qwoted · guest posts · media mentions · press-kit access stats
- **Paid acquisition** (B15) — Promoted Listings spend + ROAS · Pinterest Ads · Meta retarget · newsletter sponsorships · per-channel CAC vs LTV · organic-CVR gate (PROGRESS §P5.6)
- **Partnerships** (B16) — PMS integrations (Hostfully/Guesty/Hospitable) · co-marketing swap calendar · cross-promo opportunities (Phase 5 if scope tight)
- **Social** (B17) — Reddit + FB groups + X + LinkedIn + TikTok + IG queue + reply inbox via n8n
- **Pinterest performance** module (top pin / saves / clicks)
- **Keyword opportunities** module — GSC striking-distance queries (positions 5–20) + eRank content gaps → feeds atomization queue

Console — **other Phase 4 additions**:
- **Check → AI** (B7) — token spend · cost per generation · abuse-pattern detection
- **Check → Reviews** (B8) — Etsy + Gumroad rating · 7d new · 1-2 star alerts · response status
- **Check → API quotas** (B6) — per-source rate-limit headroom
- **Maintain → Promotions** (B18) — coupon ladder · A/B test results · promo calendar
- **Promote → Editorial** (B19) — atomization backlog/draft state pulled from `copy/_atomization/`

n8n:
- `release-shipped` (W-update pipeline, P1)
- `backup-restore-test` (monthly, P0 on fail)
- `gdpr-intake` (on form, P1)
- Pinterest API pull added to `nightly-refresh`
- **`backlink-watch`** (B11) — weekly Sun, P1 if any acquired backlink lost; P2 digest of new
- **`outreach-followup-watch`** (B11/B12/B14) — daily 09:00, P1 if any outreach reply overdue per `ops/*-pipeline.yaml`
- **`affiliate-payout-watch`** (B13) — weekly Mon, P1 if any payout overdue
- **`paid-roas-watch`** (B15) — daily, P1 if any paid channel ROAS <1× over rolling 7d
- **`ad-spend-cap-watch`** (B15) — hourly, **P0** if daily spend >2× planned cap (ad runaway)
- **`ai-cost-watch`** (B7) — hourly, **P0** if hourly spend >$10 or >50 generations from one IP
- **`api-quota-watch`** (B6) — every 4h, P1 ≥80%, **P0** ≥95%

### Phase 5 — Remote deploy *(deferred)*

Hostinger subdomain `console.thestrledger.com` behind basic auth + IP allowlist. Only if mobile access proves needed beyond Telegram. Stays optional.

**Total MVP (Phases 1–4):** ~1 elapsed week.

## 8. Risks / honest pushback

1. **Reinventing Airtable.** Airtable already does dashboards. The console's unique value is *integrating filesystem + cluster status + runbook freshness + n8n alert log* — things Airtable can't see. If you find yourself rebuilding what an Airtable view does, stop and use Airtable.

2. **Maintenance burden.** Another app on top of 5 already, plus 10 n8n flows. Mitigated by sharing the cluster's Astro/Tailwind/tests/CI and by versioning n8n flows in git (`infrastructure/n8n/flows/`). But abandonment = ~8 hours wasted plus stale flows running cron.

3. **Telegram channel hygiene.** Three channels (P0/P1/P2) is the discipline. If everything goes to one channel, P1 noise will train you to ignore P0. **Discipline test:** if a P0 fires and Daniel doesn't react within 5min, the priority assignment is wrong — re-tier it.

4. **Console must remain useful when alerts are quiet.** This was the original "would you open it on a quiet day?" pushback. With n8n+Telegram, the console's job shifts: it's no longer the *alerter*, it's the *reviewer*. **Acceptance test for Phase 1:** Daniel opens it on Monday morning and finds the weekly review (kill-SKU + stale runbooks + content brief) genuinely useful.

5. **Secret sprawl.** Postponed by routing all writes through n8n. n8n keeps Stripe/Etsy/IS/Gumroad/GA4/Telegram tokens. Console only ever sees read-only SQLite cache + n8n webhook URLs (those URLs are themselves the auth — keep them out of git).

6. **Phase 1 viability is load-bearing.** Filesystem console + 3 cron alerts is the smallest cut that proves the whole shape. If Phase 1 isn't useful alone, Phases 2–4 won't get done.

## 9. Open decisions (need Daniel's input)

| # | Question | Recommendation |
|---|---|---|
| 1 | Web vs TUI? | **Web.** Astro reuses cluster chrome, brand-consistent, mobile-viewable. |
| 2 | Hosted location? | **`tools/empire-console/`** (sibling to STR-tools). |
| 3 | Auth for remote (Phase 5) | Basic auth + IP allowlist first; upgrade if mobile becomes daily. |
| 4 | "Next action" source | PROGRESS.md regex first; switch to `ops/today.yaml` if regex output is noisy. |
| 5 | Pin generator scope | **Hoist STRGuests-Tools pin code** to `tools/shared/pin-builder/`. |
| 6 | Telegram bot/channels | One bot, three channels (`@strledger-p0` / `-p1` / `-p2`). Bot token in n8n only. Confirm naming or override. |
| 7 | n8n flow storage | `infrastructure/n8n/flows/*.json` versioned in git, exported via n8n CLI. Confirm or propose alternative. |
| 8 | Alert log location | `ops/alerts.ndjson` (append-only NDJSON). Console reads, n8n writes. Confirm or propose. |
| 9 | Books-of-record | Wave (free) vs QuickBooks. Console links out from `/check/money`. Decide before Phase 3. |
| 10 | Refund-spike P0 threshold | Default: **fires whichever first** of "5% in 24h" or "≥3 refunds on one SKU in 24h". Override? |
| 11 | Traffic source | GA4 (free, deeper) **+** Plausible (light, privacy-friendly) — both, but which is the *primary* number on the Today scorecard? Recommend Plausible (cluster-wide cookieless), GA4 for funnel drill-in. |
| 12 | Rank-tracking source | GSC (free, native, real positions) is non-negotiable. eRank for Etsy. DataForSEO/Ahrefs deferred until Phase 5+ if budget allows. |
| 13 | AI-search visibility | Manual spot-checks for now (ChatGPT, Perplexity, AI Overviews). Logged as a recurring `ops/ai-visibility-log.md`. Programmatic check deferred — APIs unstable. |
| 14 | Funnel-dropout alert tier | **P2** weekly default, escalate to **P1** if any stage drops >50% week-over-week. Not P0 — drops are slow trends, not pages. |
| 15 | Cold-contact threshold | **90 days** no opens. Tune after 6mo of data. |
| 16 | Source attribution depth | Phase 3: **just IS form-of-origin** (which lead magnet captured them). UTM stitching deferred to Phase 5+ if it matters by then. |

## 10. Coverage map vs prior tier list

| # | Prior tool | Folds into | Phase |
|---|---|---|---|
| 1 | `str` CLI | `cli/empire.ts` | 1 |
| 2 | Daily dashboard | Today + n8n nightly-refresh | 3 |
| 3 | Manifest extended | Check → Catalog + n8n manifest-watch | 1+2 |
| 4 | Cross-site link checker | Check → Links | 2 |
| 5 | Vendor cost tracker | Maintain → Vendors + n8n vendor-renewal-watch | 1 |
| 6 | SOP runbook index | Maintain → Runbooks + n8n runbook-staleness | 1 |
| 7 | Backup harness | Maintain → Backups + n8n backup-restore-test | 4 |
| 8 | Kill-SKU report | Check → Catalog + n8n kill-sku-watch | 3 |
| 9 | Atomization renderer | Promote → Atomization | 4 |
| 10 | W-update / release notes | Maintain → Releases + n8n release-shipped | 4 |
| 11 | GDPR/CCPA handler | Maintain → Compliance + n8n gdpr-intake | 4 |
| 12 | Lifecycle email QA | Promote → Lifecycle | 4 |
| 13 | Etsy ↔ on-site diff | *deferred (post-MVP)* | — |
| 14 | Pin generator | Promote → Pins (shared lib) | 4 |
| 15 | Status emitter | Check → Cluster JSON | 2 |
| 16 | **Money tracker** | Check → Money (NEW) | 3 |
| 17 | **Traffic tracker** | Check → Traffic (NEW) | 3 |
| 18 | **SEO health (GSC + CWV)** | Check → SEO (NEW) | 3 |
| 19 | **Site audits** (meta, schema, sitemap) | Check → Audits (NEW) | 2 |
| 20 | **Keyword opportunities** | Promote → Keywords (NEW) | 4 |
| 21 | **Pinterest performance** | Promote → Pinterest (NEW) | 4 |
| 22 | **Contacts (funnel)** — sign-ups, drop-out, list health | Check → Contacts (NEW) | 3 |

**13 of 15** original internal tools fold in, plus **7 new modules** (money + contacts + traffic + SEO + audits + keyword opportunities + Pinterest performance) for a total of **21 modules**. Plus **23 n8n flows** as the alerting + action layer.

## 11. Acceptance criteria

A working MVP (end of Phase 4):

- [ ] `pnpm empire dev` starts the console at `localhost:4327`
- [ ] Today landing renders 3 metrics + AlertFeed + 1 next-action without errors
- [ ] AlertFeed displays the last 5 entries from `ops/alerts.ndjson` with priority badge
- [ ] Telegram P0/P1/P2 channels each receive a test alert from `empire alert` CLI
- [ ] `vendor-renewal-watch` fires a P1 digest on a seeded ≤7d renewal
- [ ] `runbook-staleness` fires a P1 digest on a seeded >6mo runbook
- [ ] `cluster-smoke` fires a P0 alert on a deliberately-broken site within 30min
- [ ] `manifest-watch` fires a P0 alert on a deliberately-broken manifest within 5min of push
- [ ] Check → Catalog matches `manifest_check.py` exit code
- [ ] Check → Cluster shows 4 sites green/red within 5s
- [ ] Maintain → Runbooks lists every `**/runbooks/*.md`, flags stale
- [ ] Maintain → Vendors computes monthly burn from YAML
- [ ] Maintain → Releases ships a v1.0.1 bump on a test SKU end-to-end via n8n
- [ ] CLI `empire status` returns exit 0 when all green, non-zero otherwise
- [ ] Vitest covers data readers (manifest, runbooks, vendors, progress, alerts)
- [ ] No production secret committed; n8n webhook URLs gitignored

## 12. Out of scope (explicit)

- Customer-facing pages or marketing.
- Replacing PROGRESS.md as the master tracker.
- Editing Airtable schema from the console (read-only).
- Mobile-native app (Telegram covers the push channel).
- Multi-user. Single operator.

---

## 13. Phase 6+ backlog — full gap inventory

Captured from a head-to-toe rescan 2026-05-10. The **top 5 critical** items are promoted into Phases 1–3 (see §7 updates). Everything else stays here so nothing slips.

### Critical (silent killers)
- **B1 Infrastructure / SSL+domain monitor** — ⬆ promoted to Phase 1
- **B2 n8n flow health board** — ⬆ promoted to Phase 2
- **B3 Etsy/Gumroad convos queue** — ⬆ promoted to Phase 3
- **B4 Calendar / due-this-week** — ⬆ promoted to Phase 1
- **B5 Money as a 4th verb** (nav restructure) — ⬆ promoted to Phase 1
- B6 API rate-limit / quota headroom (Stripe/Etsy/IS/GA4/GSC/Pinterest) — Phase 4
- B7 AI cost + usage tracker (STRGuests AI generators) — Phase 4
- B8 Reviews & reputation (Etsy / Gumroad / branded SERP) — Phase 4
- B9 Repo / version-control health — Phase 5
- ~~B10 Document vault index~~ — ⬆ **promoted to Phase 1** as part of unified asset registry
- **B32 Asset registry (NEW)** — `ops/assets/{lead-magnets,tools,documents,brand-assets,email-templates,pages}.yaml` + unified `Maintain → Assets` index — ⬆ **Phase 1**

### Traffic acquisition (per Daniel's 2026-05-10 nudge)
- **B11 Backlinks** — find + create (outreach pipeline + acquired log + lost recovery + anchor health) — Phase 4
- **B12 Influencer marketing** — prospect list + outreach + active partnerships + perf tracking — Phase 4
- **B13 Affiliate program** — commission tracker + payouts due + top affiliates leaderboard (PROGRESS §P5.7) — Phase 4
- **B14 Press / PR pipeline** — podcast outreach + HARO/Qwoted + guest posts + media mentions (PROGRESS §P5.7) — Phase 4
- **B15 Paid acquisition** — Etsy Promoted Listings + Pinterest Ads + Meta retarget + newsletter sponsorships + per-channel CAC (PROGRESS §P5.6) — Phase 4
- **B16 Partnerships / integrations** — PMS (Hostfully/Guesty/Hospitable) co-marketing + cross-promo swap calendar — Phase 5

### High-value
- B17 Social media manager — Reddit, FB groups, X, LinkedIn, TikTok, IG (Pinterest already in) — Phase 4
- B18 Promo calendar + coupon ladder (PROGRESS §P5.0) — Phase 4
- B19 Editorial calendar / draft state (`copy/_atomization/`) — Phase 4
- B20 Blog / Ghost health (last-published, scheduled, member growth) — Phase 4
- B21 Per-SKU file-integrity smoke test (xlsx open + recompute + no #REF!) — Phase 5
- B22 Brand consistency check (wordmark + palette + fonts in built dist/) — Phase 5

### Medium
- B23 Today landing → weekly domain rhythm (Mon=Money / Tue=Trajectory / etc per CLAUDE.md) — Phase 1 (cheap)
- B24 Universal Cmd-K search across PROGRESS + runbooks + vendors + alerts — Phase 5
- B25 Incident log + postmortems — Phase 5
- B26 Storage / disk usage (Hostinger + n8n logs + SQLite) — Phase 5
- B27 Auto-generated weekly + monthly review reports (`ops/reports/`) — Phase 5

### Structural
- B28 Alert dedup/coalesce in `telegram-router` (same-source same-msg in 4h, 2+ P1s in 1h coalesce) — Phase 4
- B29 `empire doctor` self-test CLI (data sources + n8n webhooks + cache freshness) — Phase 4
- B30 `.env.example` + `infrastructure/n8n/secrets-inventory.md` — Phase 0.5 (do once now)
- B31 Mobile compact view (`?m=1`) on Today — Phase 5

### Promotion summary (top 5 → active phases)

| # | Module | Original phase | New phase | Why promoted |
|---|---|---|---|---|
| B1 | Infrastructure / SSL+domain | 6+ | **1** | Silent killer; cheap to wire |
| B4 | Calendar / due-this-week | 6+ | **1** | Tax dates non-negotiable; YAML-driven |
| B5 | Money as 4th verb | 6+ | **1** | Nav structural — cheaper to do once now |
| B2 | n8n flow health board | 6+ | **2** | Watchdog for the watchdog |
| B3 | Convos queue (Etsy/Gumroad/email) | 6+ | **3** | Already in PROGRESS daily check |
| B23 | Weekly rhythm on Today | 6+ | **1** | Same readers, just promotes existing data |
| B30 | Secrets inventory | 6+ | **0.5** | 30-min one-time cleanup |
