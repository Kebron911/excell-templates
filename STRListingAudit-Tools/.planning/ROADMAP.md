# listingaudit.tools — ROADMAP

Phase grouping of the v0.1 plan. Each phase ends with an atomic git commit + STATE.md update.

---

## Phase 1 — Foundation

**Goal:** Bootable Astro site in the monorepo with shared chrome, Express skeleton, MySQL schema, vitest canary, planning artifacts.

**Tasks (8):**
1. Add `STRListingAudit-Tools/` to `pnpm-workspace.yaml`. Scaffold `package.json` + `astro.config.mjs` + `tsconfig.json` (copy strguests).
2. Tailwind config + design tokens with diagnostic-teal accent (#0E7C8C). `src/styles/{tokens,global}.css`.
3. `siteConfig` + `AppLayout.astro` wrapping `@str/ui-chrome/Layout.astro`. Hello-state `index.astro` with placeholder URL form.
4. Express server skeleton with `/api/health` only (`server/index.ts` + `server/tsconfig.json`, port :3002).
5. MySQL schema (`audit_runs` + reused `rate_limits` + `email_verifications`) + `pnpm db:migrate` runner.
6. `.env.local.example` covering Anthropic, Apify, MySQL, email-verify, IP-hash, GA4, admin token.
7. Vitest canary test confirming the Express app mounts `/api/health`.
8. `.planning/{PROJECT,ROADMAP,STATE}.md` skeletons + root `CREDENTIALS.md` rows for `ANTHROPIC_API_KEY` + `APIFY_TOKEN`.

**Acceptance:** `pnpm -w install` succeeds, `pnpm --filter strlistingaudit-tools build` succeeds, `pnpm --filter strlistingaudit-tools test` is green (canary passes), `pnpm --filter strlistingaudit-tools db:migrate` is a no-op against a migrated DB.

---

## Phase 2 — Listing scrape layer

**Goal:** `fetchListingSnapshot(url): Promise<ListingSnapshot>` returns normalized data for Airbnb + Vrbo URLs.

**Tasks (6):**
1. `ListingSnapshot` type in `server/lib/scrape/types.ts`.
2. `server/lib/scrape/jsonld.ts`: fetch + cheerio + parse `application/ld+json` for free baseline data.
3. `server/lib/scrape/apify.ts`: Apify Airbnb actor via REST + map to `ListingSnapshot`.
4. `server/lib/scrape/index.ts`: orchestrator — JSON-LD first, fall back to Apify when fields are incomplete.
5. Record 5 fixture HTML pages (3 Airbnb, 2 Vrbo) → `server/test/fixtures/`. Vitest reads from disk.
6. Admin-gated `POST /api/scrape` debug endpoint (`x-admin-token` header, value from `ADMIN_TOKEN` env).

**Acceptance:** All 5 fixtures parse to valid `ListingSnapshot`. Vitest green. Apify dry-run with 1 real URL costs < $0.01.

---

## Phase 3 — AI scorecard engine

**Goal:** `scoreListingSnapshot(snapshot): AuditResult` returns 5-dim 0-100 scorecard + top 5 fixes, average cost < $0.08.

**Tasks (7):**
1. Install `@anthropic-ai/sdk`. Build `server/lib/ai/anthropic.ts` wrapper with `cache_control: ephemeral` on the system prompt.
2. Per-dimension prompts in `server/lib/ai/prompts/`: `title.ts`, `description.ts`, `photos.ts` (metadata-only), `amenities.ts`, `reviews.ts`. Each returns `{ score, reasoning, fixes[] }` via Haiku 4.5.
3. `synthesizer.ts`: Sonnet 4.5 call that synthesizes the 5 dim outputs into top 5 prioritized fixes (impact × severity rubric).
4. `server/lib/audit/scorecard.ts`: orchestrator. Fans out 5 Haiku calls in parallel, then 1 Sonnet synth call.
5. `server/lib/audit/cost-tracker.ts`: computes USD cost from token counts and logs to `audit_runs`.
6. Anthropic response fixtures + golden snapshot tests for 5 sample listings.
7. `cost-budget.test.ts`: asserts fixture-set average `total_cost_usd` < $0.08. Fails CI on breach.

**Acceptance:** 5 fixtures produce stable scorecard JSON. Avg cost from fixtures < $0.08. Cache hit rate > 70% on warm runs.

---

## Phase 4 — Result UX + share + email gate

**Goal:** End-to-end flow: paste URL → see scorecard at `/audit/[id]` → share image → email-gated PDF download.

**Tasks (10):**
1. Fork rate-limit lib from STRGuests (`server/lib/rate-limit.ts`) — tool_slug `audit-listing`.
2. Fork email-verify lib from STRGuests (`server/lib/email-verify.ts`).
3. `POST /api/audit`: rate-limit check → insert pending `audit_runs` row → kick off background pipeline → return `{ id }`.
4. `GET /api/audit/:id/status`: polling endpoint, returns `{ status, result? }`.
5. `GET /api/audit/:id`: full result JSON (cached).
6. `src/components/AuditForm.astro` — URL validate + submit + redirect-with-polling.
7. `src/pages/audit/[id].astro` — SSR scorecard + `FixesList` + `ShareBlock` + `EmailGate` CTA.
8. Background share-image generation: Satori → sharp → `public/share/[id].png`.
9. `src/lib/pdf/audit-report.ts` builder using `@str/ui-chrome` PDF base (TODO: confirm path or fork strguests PDF base into `@str/pdf` package).
10. `GET /audit/:id/pdf` — gated behind verified-email cookie; streams the audit-report PDF.

**Acceptance:** Manual E2E with one real Airbnb URL: scorecard renders within 20s, share image present, email signup → PDF downloads with full report.

---

## Phase 5 — Distribution surface

**Goal:** Landing polish, programmatic city pages, blog seed, Pinterest/OG pipeline.

**Tasks (7):**
1. Landing polish: hero + 3-step explainer + sample scorecard preview + FAQ + sticky CTA.
2. About, Contact, Privacy.
3. 10 programmatic `/audit/cities/[slug]` pages from `src/data/cities.ts` (Austin, Nashville, Denver, Asheville, Joshua Tree, Smokies, Outer Banks, Sedona, Park City, Big Bear).
4. 5 markdown blog posts in `src/content/blog/`.
5. Pinterest pins via `scripts/build-pins.mjs` (fork from strguests).
6. OG images via `scripts/build-og.mjs`.
7. `robots.txt` + sitemap + JSON-LD on every page + cross-empire footer linking strguests ↔ audit.

**Acceptance:** Lighthouse SEO+BP > 95 on `/`. Sitemap valid. `pnpm build` produces all OGs + pins.

---

## Phase 6 — Analytics + deploy

**Goal:** Site live at `listingaudit.tools`, smoke-tested, `strlistingaudit-tools-v0.1.0` tagged.

**Tasks (5):**
1. Wire `PUBLIC_GA4_ID`. Verify `Layout.astro` already includes listingaudit.tools in the GA4 linker domain list.
2. Playwright E2E smoke: paste fixture URL → `/audit/[id]` renders scorecard within 25s (mocked Apify + Anthropic in CI).
3. `.github/workflows/deploy-strlistingaudit-tools.yml` — fork strguests deploy → SSH+rsync to `/home/u470667024/domains/listingaudit.tools/public_html/`.
4. Post-deploy smoke script (`scripts/smoke.mjs`) — homepage 200, `/api/health` 200, expected H1 substring.
5. IndexNow ping + tag `strlistingaudit-tools-v0.1.0`.

**Acceptance:** `https://listingaudit.tools/` loads, audit works E2E on a real Airbnb URL, GA4 events fire.

---

## Sequencing notes

- Phase 1 → 2 strict.
- Phase 2 ↔ Phase 3 can run in parallel after Phase 1 ships, but Phase 3 fixtures need Phase 2's `ListingSnapshot` type.
- Phase 4 depends on Phase 2 + Phase 3.
- Phase 5 can run partially in parallel with Phase 4 (content + city pages don't need the audit pipeline).
- Phase 6 last.

---

## Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 — Foundation | in-progress | 2026-05-14 | — |
| 2 — Listing scrape | pending | — | — |
| 3 — AI scorecard | pending | — | — |
| 4 — Result UX + email gate | pending | — | — |
| 5 — Distribution surface | pending | — | — |
| 6 — Analytics + deploy | pending | — | — |
