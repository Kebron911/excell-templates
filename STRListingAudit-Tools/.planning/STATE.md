# STATE

**Current phase:** 4 — Result UX + share + email gate
**Current task:** Phase 4 core complete (email-gated PDF deferred to Phase 4b)
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

## Phase 2 progress (complete — 2026-05-14, commit 4df5c8a)

- [x] Task 1 — `ListingSnapshot` type + `ScrapeProvider` interface + `ScrapeResult`.
- [x] Task 2 — `jsonld.ts`: cheerio-based JSON-LD parser, platform + listing-id extraction, completeness flag.
- [x] Task 3 — `apify.ts`: `runApifyActor` REST client + `mapApifyItemToSnapshot` mapper + `ApifyProvider` class.
- [x] Task 4 — `index.ts`: orchestrator with JSON-LD-first + Apify-fallback + hybrid merge.
- [x] Task 5 — 5 HTML fixtures (3 Airbnb variants, 2 Vrbo variants) + 1 Apify JSON fixture. 15 unit tests covering platform detection, JSON-LD parsing, completeness flag, Apify mapping, orchestrator paths.
- [x] Task 6 — Admin-gated `POST /api/scrape` debug route gated by `ADMIN_TOKEN` header.

## Phase 3 progress (complete — 2026-05-14, commit c2a31ac)

- [x] Task 1 — Anthropic SDK wrapper (`server/lib/ai/anthropic.ts`) — `AiProvider` interface + `AnthropicProvider` with prompt caching on system block + `FixtureAiProvider` for tests. Pricing table at `server/lib/ai/pricing.ts`.
- [x] Task 2 — 5 per-dimension prompts (`server/lib/ai/prompts/{title,description,photos,amenities,reviews}.ts`) each emitting `{ score, reasoning, fixes[] }`. Shared zod-validated parser at `_shared.ts`.
- [x] Task 3 — Synthesizer (`server/lib/ai/prompts/synthesizer.ts`) using Sonnet 4.5 — selects top 5 fixes, writes one-paragraph summary. Weighted overall score (title/photos heavier).
- [x] Task 4 — `scoreListingSnapshot` orchestrator (`server/lib/audit/scorecard.ts`) — 5 parallel Haiku calls + 1 Sonnet synth.
- [x] Task 5 — Cost tracker (`server/lib/audit/cost-tracker.ts`) — token aggregation + USD computation + `audit_runs` column export.
- [x] Task 6 — Fixtures (`server/test/fixtures/scorecard-snapshots.json`, 5 listings spanning strong/weak/mid bands) + `MockAiProvider` + `RealisticMockAiProvider` test helpers.
- [x] Task 7 — `scorecard.test.ts` golden assertions on structure + score-band correctness + synthesizer fallback. `cost-budget.test.ts` enforces avg < $0.08 and per-audit < $0.10.

## Phase 4 progress (in-progress — 2026-05-14)

Core E2E funnel shipped. Email-gated PDF carved out as Phase 4b.

- [x] Task 1 — `server/lib/db.ts` MySQL pool (forked from strguests, default DB `strlistingaudit`).
- [x] Task 2 — `server/lib/verified-cookie.ts` HMAC-signed cookie (forked, name `la-verified-email`).
- [x] Task 3 — `server/lib/rate-limit.ts` middleware (forked, limits 3/hr anon → 20/day verified, tool_slug `audit-listing`).
- [x] Task 4 — `server/lib/audit-runs.ts` CRUD on `audit_runs` (create / attachSnapshot / complete / fail / attachEmail / get) with nanoid 12-char ids.
- [x] Task 5 — `server/lib/share-image.ts` Satori-driven 1200×630 PNG generator writing to `public/share/[id].png`.
- [x] Task 6 — `server/lib/audit-pipeline.ts` orchestrator: scrape → score → share-image → persist, with failure path that records error_code + error_message.
- [x] Task 7 — `server/routes/audit.ts` exporting `POST /api/audit`, `GET /api/audit/:id`, `GET /api/audit/:id/status`, `GET /api/rate-limit-status`.
- [x] Task 8 — `src/components/AuditForm.astro` client-island that POSTs and redirects with `?id=`.
- [x] Task 9 — `src/pages/index.astro` updated to use `<AuditForm />` + FAQ section.
- [x] Task 10 — `src/pages/audit/index.astro` client-rendered result page: polls status, renders scorecard + dimension tiles + top-5 fixes + share block (copy-link + X intent + share image), error states.

### Phase 4b (deferred)

Carved out to ship the v0.1 viral funnel without blocking on:

- [ ] Task 4b.1 — `server/lib/email-verify.ts` HMAC-token email confirmation flow (fork strguests).
- [ ] Task 4b.2 — `server/lib/mailer.ts` console/webhook mailer (fork strguests).
- [ ] Task 4b.3 — `server/routes/verify-email.ts` start + confirm handlers.
- [ ] Task 4b.4 — `src/lib/pdf/audit-report.ts` PDF builder via `pdf-lib`.
- [ ] Task 4b.5 — `GET /audit/:id/pdf` gated route streaming the PDF behind a verified-email cookie.
- [ ] Task 4b.6 — Wire `EmailGate` (from `@str/email-gate`) into `src/pages/audit/index.astro` after scorecard renders.

Rationale: Free scorecard + share image is the viral hook in the locked decisions. Email-gated PDF gates v0.2 monetization but does not block the funnel demo. Phase 4b ships before public launch but doesn't block Phase 5 or 6 in development.

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

### Phase 3
- **Model selection: Haiku 4.5 per-dim + Sonnet 4.5 synth.** Haiku for cheap, parallelizable scoring of 5 dimensions; Sonnet for the synthesis pass that needs deeper reasoning on top-5 fix prioritization.
- **Prompt caching enabled on the system block of every dim call.** The rubric + output schema is stable across all audits. Cache hit rate >70% after warmup drives per-call cost down ~10x.
- **One cacheable system block per dimension prompt.** All 5 dims have distinct rubrics, so we get 5 independent cache slots. The synthesizer has its own cache block.
- **Zod-validated parsing with soft-fail fallback.** If a model returns malformed JSON, the per-dim call returns a neutral 50/100 score rather than killing the whole audit. The synthesizer's deterministic fallback picks top-impact fixes when its own JSON fails.
- **Dimension weights tilt toward title + photos.** Title 1.2, photos 1.3, reviews 1.1, description 1.0, amenities 0.9. Matches the brief's framing that the scorecard hero metric should reflect what most drives bookings.
- **Cost guardrail in tests, not at runtime.** `cost-budget.test.ts` fails CI if fixture-set avg cost exceeds $0.08. No runtime kill switch — a single expensive audit doesn't deserve a 502 to the user.
- **MockAiProvider is the offline test substrate.** No network, no API keys required in CI. The RealisticMockAiProvider mirrors the cache pattern (1 cold call + 4 warm reads) so cost-budget tests reflect realistic warm-state economics.
- **Synthesizer fallback prefers one fix per dimension.** When the synth call fails, the fallback de-duplicates by dimension before picking top 5.
- **Pricing table lives in code, not config.** `ANTHROPIC_PRICING` constants in `pricing.ts`. Comment says "verify before each release". Single grep point.

### Phase 4
- **Fully static Astro for v0.1.** `/audit/?id=ABC` reads the id client-side and fetches `/api/audit/:id`. Avoids the SSR Node-adapter complexity for v0.1. Trade-off: og:image meta tags can't be per-audit until v0.2 (when we'd switch to hybrid mode). The share image itself is still generated server-side, written to `public/share/[id].png`, and embedded into the page for native-feeling sharing.
- **Background pipeline; client polls.** POST /api/audit returns immediately with `{id}` after creating the running row. The expensive work (scrape + score + share image) runs as a fire-and-forget Promise. Client polls /api/audit/:id/status every 2s. Failures persist to status='failed' so the result page renders a meaningful error.
- **No queue, no worker process.** v0.1 ships at low volume — running the pipeline inside the Express request lifecycle is fine. Adding a Bull/redis queue is premature.
- **nanoid 12-char audit ids over UUIDs.** URL-safe, scoping-aware, 12 chars × 33-symbol alphabet = ~1.6 × 10^18 possibilities. Indistinguishable from random for share-link guess attacks.
- **Share image carries the score + listingaudit.tools watermark + audit id**. Designed for the "my Airbnb scored 73/100 — what's yours?" tweet/Reddit post.
- **Email-gated PDF deferred to Phase 4b.** Doesn't block the viral funnel demo. Tracked as 6 explicit Phase 4b sub-tasks above.
- **`la-verified-email` cookie name** (not `sg-...` from strguests). Single rotation point alongside `EMAIL_VERIFY_SECRET`.
- **Rate-limit fail-open on DB outage.** Same posture as strguests — a DB hiccup should not 502 the audit submit endpoint. Logged with `[rate-limit]` prefix for ops visibility.
- **Total cost in audit_runs is `apify_cost_usd + anthropic_total`.** SQL `UPDATE … SET total_cost_usd = apify_cost_usd + ?` reads the row's existing apify cost (set in attachSnapshot) and adds the freshly computed Anthropic cost. One column, two contributors, no race because the pipeline runs sequentially.

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
