# Tier S Platform Plan — STR Empire Foundation

**Goal:** Ship six force-multipliers that make every future tool, page, and campaign 3–5× cheaper to build and measurably more effective. Each phase unblocks the next.

**Constraint:** Each phase ends in something shipped and observable, not a half-built abstraction. No phase blocks revenue work for more than ~1 week.

**Sequencing logic:**
```
Catalog API ──┬──► Sitemap Hub ────────┐
              ├──► UI Package ──┐      │
              │                 ├──► Programmatic Pages
              └──► Contact Graph ┴──► Upsell Engine
```

---

## Phase 1 — Tool Catalog API
**The single source of truth for what exists in the empire.**

### Scope
- New package: `packages/catalog/` (workspace package, no new repo)
- One JSON file per tool, schema-validated, committed:
  ```
  packages/catalog/data/
    strhost/profit-calculator.json
    strguests/house-rules-pdf.json
    strops/turnover-scheduler.json
    ...
  ```
- Each entry: `id, site, slug, title, category, audience, keywords, related[], lead_magnet, paid_tier, ga4_event, status`
- Build script emits:
  - `catalog.json` (full) → consumed by all 8 sites at build time
  - `catalog.min.json` → CDN-served runtime endpoint for chat/upsell
  - `tools-by-site/<site>.json` → per-site filtered slices
- TS types auto-generated from schema (`zod` or `typebox`)

### Deliverables
- [ ] Schema + Zod validator
- [ ] Catalog populated for ~50 existing tools across 8 sites
- [ ] Per-site loader exports (`import { tools } from '@empire/catalog/strhost'`)
- [ ] CI: schema validation + duplicate-slug check + dead-link check
- [ ] Public endpoint: `https://dashboard.<empire>/api/catalog`

### Success metric
Every site's existing nav can be regenerated from the catalog without behavior change. PR diff shrinks (delete hardcoded nav arrays).

### Est. cost
3–5 days. No external deps.

---

## Phase 2 — Master Sitemap & Schema Hub
**Fast SEO win that proves Catalog is paying off.**

### Scope
- New package: `packages/seo/`
- Consumes Catalog → emits:
  - Per-site `sitemap.xml` (replaces hand-rolled Astro sitemaps)
  - Empire-level `sitemap-index.xml` hosted on dashboard domain
  - JSON-LD generators: `SoftwareApplication`, `HowTo`, `FAQ`, `BreadcrumbList`, `Article`
- Astro integration: `<SchemaFromCatalog tool="..." />` component injects correct JSON-LD per page
- Submit empire sitemap-index to Google Search Console + Bing Webmaster (one-time)

### Deliverables
- [ ] Per-site sitemap generation from catalog
- [ ] Empire sitemap-index live on dashboard
- [ ] JSON-LD components used on every tool page
- [ ] GSC submitted + verified indexing on at least 80% of pages within 30 days

### Success metric
Indexed page count +20% within 60 days; impressions in GSC +30%.

### Est. cost
2–3 days. Depends on Phase 1.

---

## Phase 3 — Shared UI Component Package
**Stop the 8× copy-paste tax before adding more surface area.**

### Scope
- New package: `packages/ui/` — React (already used in strguests) + Astro wrappers
- First-wave components extracted from existing sites:
  - `<Calculator>` shell (input grid + result panel + share/print)
  - `<EmailGate>` (already exists in strguests; promote + standardize)
  - `<PdfDownloadButton>` (already exists; promote)
  - `<ToolCard>` (consumes catalog entry)
  - `<RelatedTools>` (catalog-driven, drops at end of every page)
  - `<Hero>`, `<FAQ>`, `<Footer>` (token-driven from design-system)
- Design tokens emitted from `design-system/` → Tailwind preset shared across all sites
- Storybook (or Astro showcase) on dashboard for visual regression

### Deliverables
- [ ] `@empire/ui` published to internal pnpm workspace
- [ ] At least 2 sites migrated to consume shared `<EmailGate>` + `<PdfDownloadButton>` + `<RelatedTools>`
- [ ] Tailwind preset shared; per-site `tailwind.config.ts` shrinks to ~10 lines
- [ ] Visual regression baseline captured

### Success metric
LOC across all 8 sites drops net-negative after migration. New tool ships in <1 day vs. current ~3.

### Est. cost
5–7 days. Can start in parallel with Phase 2 if you have bandwidth; otherwise sequential.

---

## Phase 4 — Unified Contact Graph + Lead Inbox
**One person, one profile, regardless of which site captured them.**

### Scope
- New service: `tools/contact-graph/` (Node/Express, similar shape to `tools/pinforge-api/`)
- Postgres or MySQL (reuse strguests instance) with:
  - `contacts` (email PK, first_seen, source_site, name?, phone?)
  - `events` (contact_id, type, site, tool_id, ts, metadata jsonb)
  - `tool_downloads`, `purchases`, `page_views` (typed event tables)
- Public POST endpoint `/v1/events` — all 8 sites' `<EmailGate>` posts here
- Dashboard route `/leads` — table view, filter by site/tool/date, CSV export, search
- Privacy: hash IPs, honor unsubscribe, GDPR-style delete endpoint
- ESP sync (ConvertKit / MailerLite / etc.) — single integration point, no per-site keys

### Deliverables
- [ ] Service deployed (Hostinger or Railway, same pattern as Pinforge)
- [ ] All sites' email-gate forms posting to it (via shared `<EmailGate>` from Phase 3)
- [ ] `/leads` dashboard live
- [ ] One ESP integrated
- [ ] Daily backup + restore tested

### Success metric
100% of new leads visible in one dashboard within 7 days of cutover. Zero per-site mailing lists going forward.

### Est. cost
7–10 days. Hardest phase — own backend, auth, hosting.

---

## Phase 5 — Cross-Tool Upsell Engine
**Lift revenue per lead with zero new traffic.**

### Scope
- Builds on Catalog (#1) + UI (#3) + Contact Graph (#4)
- Recommendation rules table (start simple, no ML):
  - "Downloaded house-rules PDF" → recommend welcome-book + smart-lock-codes
  - "Used cash-on-cash calculator" → recommend DSCR + furnishing-budget + arbitrage-pitch
  - "Visited 3+ city pages" → recommend market-score
- `<UpsellPanel>` component drops in after every download / calc completion
- A/B harness: each rule has variant A/B/control, conversion tracked via Contact Graph events
- Post-download email sequence triggered by Contact Graph webhook → next-best-tool email at T+1, T+3, T+7

### Deliverables
- [ ] Rules engine + admin UI on dashboard (no-code rule editing)
- [ ] `<UpsellPanel>` rendered on every PDF-thank-you and calc-result page
- [ ] First 3 rules live, A/B tracking confirmed
- [ ] Email sequence shipping via ESP

### Success metric
Multi-tool conversion rate per contact 2×+ within 60 days. Email-attributed downstream PDF downloads measurable.

### Est. cost
5–7 days.

---

## Phase 6 — Programmatic Page Generator
**The traffic compounding machine.**

### Scope
- New package: `packages/pages/`
- Source CSVs: cities (top 500 STR markets), states (50 + DC), metros, tool×geo combos
- Templates per site:
  - strhost: `/cities/{slug}/profit-calculator`, `/cities/{slug}/break-even`
  - strbuyers: `/cities/{slug}/cash-on-cash`, `/markets/{metro}/comp-analyzer`
  - strlaws: `/states/{state}/str-rules`, `/cities/{slug}/permit-guide`
  - strops: `/cities/{slug}/cleaner-rates`
- Each page = catalog tool + geo-specific data (median ADR, tax rate, regulations, climate)
- Internal linking auto-generated: city page → relevant tools across sister sites
- Schema (Phase 2) + UI (Phase 3) reused; new pages cost ~0 LOC each
- Throttled rollout (1k pages/week) to avoid Google "thin content" flag; quality gate on each template

### Deliverables
- [ ] Data pipeline: source CSV → enriched per-city dataset
- [ ] 3 page templates live (one per top site)
- [ ] First batch: 200 city pages indexed
- [ ] Indexing + ranking dashboard
- [ ] Kill switch per template if quality flags trip

### Success metric
+50% indexed pages, +40% organic sessions within 90 days of full rollout. At least 5 pages on page 1 for "<city> short term rental <tool>" queries within 6 months.

### Est. cost
7–10 days for infra; ongoing for content/data curation.

---

## Timeline (sequential, single-builder)

| Week | Phase | Shipping |
|------|-------|----------|
| 1 | Phase 1 — Catalog API | Catalog + CI |
| 2 | Phase 2 — Sitemap & Schema | All sitemaps regenerated, GSC submitted |
| 3–4 | Phase 3 — Shared UI | `@empire/ui` + 2 sites migrated |
| 5–6 | Phase 4 — Contact Graph | Lead inbox live, all sites posting |
| 7 | Phase 5 — Upsell Engine | First 3 rules + A/B + email sequence |
| 8–9 | Phase 6 — Programmatic Pages | First 200 pages live |

**~9 weeks** start to finish if done linearly. Phase 2 + 3 can overlap if you split focus. Phases 1–3 are all reversible/cheap; Phases 4–6 commit to backend infrastructure — review checkpoint before Phase 4 starts.

---

## Decisions locked (2026-05-17)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Backend hosting | **Match Pinforge** — Fastify + PM2/Docker, `X-API-Key` auth, env-driven, pino logging | Proven pattern shipped in `tools/pinforge-api/`; reuse infra knowledge |
| 2 | DB for Contact Graph | **Postgres** (new, on same host as catalog-api) | jsonb event store, better fit than reusing strguests MySQL |
| 3 | ESP | **InfluencerSoft** | Existing tool, in-house, has its own skill/integration |
| 4 | Domain | **dashboard.thestrledger.com** | Catalog API + Lead Inbox + future tools |
| 5 | GA4 event taxonomy | **snake_case `<verb>_<noun>`** — `pdf_download`, `calc_completed`, `lead_captured`, `tool_viewed`, `upsell_clicked` | Lock in Phase 1 catalog schema (`ga4_event` field per tool); enforced by Zod |

---

## What this plan deliberately defers

- Empire SSO (Tier C — wait until paid tools demand it)
- Empire AI Concierge (Tier A — Phase 7 candidate, needs Catalog + Contact Graph done)
- Affiliate Portal (Tier B — needs offers + Contact Graph)
- Webhook Event Bus (Tier A — Contact Graph's `/events` endpoint is the bus, formalize later)
- Health Monitor (Tier A — bolt on after Phase 6 when surface area is largest)

These become trivial follow-ups once Tier S lands.
