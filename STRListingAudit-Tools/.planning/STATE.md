# STATE

**Current phase:** 2 — Listing scrape layer
**Current task:** Phase 2 complete, awaiting commit
**Last update:** 2026-05-14

---

## Phase 1 progress (complete — 2026-05-14, commit d160b5a)

- [x] Task 1 — Add `STRListingAudit-Tools/` to `pnpm-workspace.yaml`. Scaffold `package.json` + `astro.config.mjs` + `tsconfig.json`.
- [x] Task 2 — Tailwind config + design tokens with diagnostic-teal accent.
- [x] Task 3 — `siteConfig` + `AppLayout.astro` wrapping `@str/ui-chrome/Layout.astro`. Hello-state `index.astro`.
- [x] Task 4 — Express server skeleton with `/api/health` only.
- [x] Task 5 — MySQL schema (`audit_runs` + `rate_limits` + `email_verifications`) + migrate runner.
- [x] Task 6 — `.env.local.example` covering Anthropic, Apify, MySQL, email-verify, IP-hash, GA4, admin token.
- [x] Task 7 — Vitest canary test (Express mounts `/api/health`).
- [x] Task 8 — `.planning/{PROJECT,ROADMAP,STATE}.md` + root `CREDENTIALS.md` rows.

## Phase 2 progress (in-progress — 2026-05-14)

- [x] Task 1 — `ListingSnapshot` type + `ScrapeProvider` interface + `ScrapeResult`.
- [x] Task 2 — `jsonld.ts`: cheerio-based JSON-LD parser, platform + listing-id extraction, completeness flag.
- [x] Task 3 — `apify.ts`: `runApifyActor` REST client + `mapApifyItemToSnapshot` mapper + `ApifyProvider` class.
- [x] Task 4 — `index.ts`: orchestrator with JSON-LD-first + Apify-fallback + hybrid merge.
- [x] Task 5 — 5 HTML fixtures (3 Airbnb variants, 2 Vrbo variants) + 1 Apify JSON fixture. 15 unit tests covering platform detection, JSON-LD parsing, completeness flag, Apify mapping, orchestrator paths.
- [x] Task 6 — Admin-gated `POST /api/scrape` debug route gated by `ADMIN_TOKEN` header.

---

## Decisions log

### Phase 1
- **Accent palette = diagnostic teal (#0E7C8C).** Distinct from strguests terracotta and strhost finance-blue. Reads as analytical / measurement-grade rather than warm/hospitality. Score-state semantic colors (`--score-good`, `--score-ok`, `--score-bad`) added to tokens for scorecard tiles.
- **Server port = 3002.** Strguests holds :3001. Each empire site Express gets its own port to enable side-by-side local dev.
- **Schema includes `audit_runs` upfront.** Even though Phase 1 only exercises `/api/health`, the schema lands now so Phase 2/3/4 can wire against it without a second migration. Same idempotent `CREATE TABLE IF NOT EXISTS` discipline as strguests.
- **`tool_slug='audit-listing'`** chosen for `rate_limits` to namespace correctly when the same database is shared with sibling sites' rate-limit tables.
- **Vrbo support deferred but schema-ready.** `audit_runs.platform` ENUM includes `'vrbo'` and `'unknown'` from day 1. Vrbo scraping lands in Phase 2 if Apify Vrbo actor is viable.
- **`@` alias via `fileURLToPath(new URL('./src', import.meta.url))`** in both `astro.config.mjs` and `vitest.config.ts` — cluster-style-guide §10. Naive `.pathname` is Windows-incompatible.
- **No `/api/click` endpoint** — same deliberate omission as strguests. Listing audit monetizes via paid tier + email list + cross-empire funnel, not affiliate hops.

### Phase 2
- **JSON-LD-first hybrid scrape.** Try free JSON-LD parse, fall back to Apify only when essential fields are missing (title/description/photos<3/amenities<3). Airbnb's room pages embed enough JSON-LD that the cheap path will hit on the majority of audits, cutting per-audit scrape cost toward zero on the happy path.
- **Apify actor injected via env, default `tri_angle/airbnb-scraper`.** Allows swapping the actor (or vendor entirely — ScrapingBee, etc.) without code change.
- **`run-sync-get-dataset-items` (single HTTP call) over webhook orchestration.** Acceptable because the audit pipeline is sync from the user's perspective (they paste URL and wait <25s). Webhook orchestration is overkill at v0.1 volumes.
- **Cost approximation, not telemetry.** `APIFY_COST_PER_RUN_USD = $0.004` is a flat estimate. Real per-run cost reporting via Apify webhooks lands in v0.2 alongside the broader cost dashboard.
- **`source: 'hybrid'` on merged results.** Telemetry-friendly: lets the cost-budget test bucket merged audits separately if we want.
- **Provider injection in fetchListingSnapshot.** Tests pass StubProvider instances; production wiring passes real providers. No network calls in unit tests.
- **Apify pricing/cost surfacing is best-effort.** Real telemetry needs the Apify webhook handler; deferred to v0.2.

---

## Deviations log

_None._ Phase 1 followed the locked plan verbatim, with one accent-color override: plan said "terracotta + slate" but terracotta is already strguests' accent. Swapped to diagnostic teal (#0E7C8C). Documented in PROJECT.md decision row 10.

---

## Open questions

- **Apify Airbnb actor selection** — `tri_angle/airbnb-scraper` set as default in `.env.local.example`. Validate in Phase 2 against $0.05-per-audit budget; swap if needed.
- **Anthropic API key allocation** — fresh empire-wide key or audit-tool-specific? Decide before Phase 3.
- **Hostinger MySQL** — same instance as strguests with `MYSQL_DATABASE=strlistingaudit` or a new instance? Decide before Phase 6 deploy.
- **Domain registration** — `listingaudit.tools` registered? At Hostinger or Cloudflare? Decide before Phase 6.
- **PDF base package** — Phase 4 needs `lib/pdf/base.ts` primitives. Currently lives at `STRGuests-Tools/src/lib/pdf/base.ts`. Options: (a) extract to `@str/pdf` workspace package, (b) copy into audit-tool. Extract is cleaner; decide before Phase 4.

---

## Cluster sequencing

Per the strategic build order: strhost (✅), strguests (✅), strops, strbuyers, **listingaudit (Phase 1 ✅)**.

---

## Phase 1 verification (run before next phase commits)

```bash
# 1. Workspace install
cd /c/Users/Kebron/Desktop/Claude\ OS/Wealth/Businesses/Excel-Templates
pnpm -w install

# 2. Filter into the new site
pnpm --filter strlistingaudit-tools typecheck
pnpm --filter strlistingaudit-tools test            # canary passes
pnpm --filter strlistingaudit-tools build           # Astro build succeeds

# 3. Local server smoke
pnpm --filter strlistingaudit-tools server:dev &
curl http://localhost:3002/api/health               # → 200 { status: 'ok', ... }

# 4. DB migrate dry-run (local MySQL)
pnpm --filter strlistingaudit-tools db:migrate
```
