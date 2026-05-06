# Phase 1 — Foundation

**Goal:** Bootable Astro static + Express dual-target site with hospitality-warm brand tokens, layout primitives, monetization primitives (incl. PdfDownloadButton, PinterestPinButton, AiRateLimitNotice), URL-state, format, SEO libraries, PDF library base, and Express server skeleton + MySQL schema.

**Source plan:** [`docs/superpowers/plans/2026-05-05-strguests-tools.md`](../../../docs/superpowers/plans/2026-05-05-strguests-tools.md)

**Cluster reference:** Tasks 3, 4, 6, 7 mirror strhost.tools verbatim (with wordmark + accent swaps). Tasks 9 (PDF base) parallels strops.tools. Tasks 1, 2, 5, 8, 10 are strguests-novel — detailed in the source plan with code blocks.

**Requirements satisfied:** R5 (brand layer), R6 (monetization primitives + PDF/Pinterest/AI extensions), R7 (SEO library), partial R3 (URL state + format), R8.2 (server schema migration), R10 (AI rate-limit infra)

**Acceptance for the phase:**

- `pnpm install` resolves all deps; `pnpm dev` serves Astro on `:4321`; `pnpm server:dev` serves Express on `:3001`
- `pnpm typecheck` zero errors (both Astro and server tsconfigs)
- `pnpm test` (Vitest) green — `format.ts`, `url-state.ts`, `pdf/base.ts`, `server/lib/db.ts`
- `curl :3001/api/health` returns `{"status":"ok"}`
- `pnpm db:migrate` runs cleanly against a local MySQL stub
- A throwaway test route renders Header + Footer + FunnelBand + ClusterFunnelBlock + AdSlot + EmailCaptureCard + STRLedgerCTA + **PdfDownloadButton** + **PinterestPinButton** + **AiRateLimitNotice**, all in hospitality-warm accent
- Print stylesheet hides chrome on `@media print`
- Working tree committed task-by-task (one commit per task)

---

## Task 1 — Bootstrap dual-target repo

**Source:** Task 1 in [source plan](../../../docs/superpowers/plans/2026-05-05-strguests-tools.md)

**Files:** `package.json`, `tsconfig.json`, `server/tsconfig.json`, `astro.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `.npmrc`, `README.md`

**Acceptance:** `pnpm install` resolves; both `pnpm dev` and `pnpm server:dev` start; `pnpm typecheck` zero errors. Commit: `chore: bootstrap astro+express dual-target project`.

**Cluster note:** mirrors strhost.tools Task 1 with added deps for openai, pdf-lib, express, mysql2, satori, zod.

---

## Task 2 — Brand tokens with hospitality-warm accent

**Source:** Task 2 in source plan

**Files:** `src/styles/tokens.css`, `src/styles/global.css`, `tailwind.config.ts`

**Acceptance:** Tailwind theme exposes `colors.accent.{50,100,500,700,900}` as hospitality-warm scale; numbers in JetBrains Mono with `tabular-nums`. Commit: `feat: brand tokens with hospitality-warm accent`.

**Frontend-design note:** Apply [frontend-design](skill) — accent must read as "hospitable / warm / welcoming" without sliding into kitsch. Cormorant Garamond gets more screen time on this site than siblings (guidebooks suit serif). Test against the welcome book PDF preview when Phase 2 Task 12 lands.

---

## Task 3 — Print stylesheet

**Source:** Task 3 in source plan (mirrors strhost.tools Task 3 verbatim)

Commit: `feat: print stylesheet`

---

## Task 4 — Layout primitives

**Source:** Task 4 in source plan

**Files:** `src/components/chrome/{Header,Footer,Sidebar,FunnelBand,ClusterFunnelBlock,Layout}.astro`

**Cluster note:** mirrors strhost.tools Task 7. Strguests-specific: ClusterFunnelBlock uses `currentCluster="guest-xp"`; Sidebar has 6 generator placeholder cards.

**Acceptance:** All six chrome components render on a throwaway route; ClusterFunnelBlock shows links to strhost / strbuyers / strops, hides strguests self-link; visual check passes. Commit: `feat: layout primitives`.

**Frontend-design note:** Apply [frontend-design](skill) — production craft on type rhythm (extra serif weight here), hover states, and Sidebar's mobile collapse to footer cards.

---

## Task 5 — Monetization primitives

**Source:** Task 5 in source plan

**Files (under `src/components/`):**
- `ads/AdSlot.astro` — pre-AdSense placeholder
- `funnel/EmailCaptureCard.astro` — inline content-styled, posts to ESP webhook
- `funnel/STRLedgerCTA.astro` — UTM-tagged deep-link
- **`generator/PdfDownloadButton.astro`** — triggers PDF gen + soft email modal (downloads anyway on close)
- **`generator/PinterestPinButton.astro`** — generates 1000×1500 PNG + opens Pinterest share intent
- **`generator/AiRateLimitNotice.astro`** — shows current rate-limit state on AI generator pages

**Acceptance:**
- All 6 components render placeholders without runtime errors
- PdfDownloadButton modal opens on click, closes on Escape, "skip and download" still triggers download event
- PinterestPinButton dispatches the right CustomEvent
- AiRateLimitNotice fetches stub `/api/rate-limit-status` and renders status text
- Visual check on throwaway route
- Commit: `feat: monetization + generator primitives`

**Frontend-design note:** Apply [frontend-design](skill) — these are conversion-critical surfaces. The PDF email-gate modal must feel hospitable (not nagging); "downloads anyway" copy is non-negotiable per spec. AiRateLimitNotice should read as helpful guidance, not punishment.

---

## Task 6 — URL-state library (TDD)

**Source:** Task 6 in source plan (mirrors strhost.tools Task 5 verbatim)

Tests first. Commit: `feat: url-state library with debounced replaceState`.

---

## Task 7 — Format library (TDD)

**Source:** Task 7 in source plan

**Files:** `src/lib/format.ts`, `tests/format.test.ts`

Mirrors strhost.tools Task 4 with one addition: `formatPhone()` for welcome-book + check-in PDFs.

Tests first. Commit: `feat: format library with currency/percent/phone helpers`.

---

## Task 8 — SEO library

**Source:** Task 8 in source plan

**Files:** `src/lib/seo.ts`

Mirrors strhost.tools Task 6 plus `buildArticle(scenario)` for `/templates/[scenario]` pages.

Commit: `feat: seo library — Schema.org JSON-LD builders incl Article`

---

## Task 9 — PDF library base

**Source:** Task 9 in source plan (full code blocks there)

**Files:** `src/lib/pdf/base.ts`, `src/lib/pdf/types.ts`, `tests/pdf/base.test.ts`

**Acceptance:**
- `createBaseDoc(meta)` returns a `PDFDocument` with title/author/producer/creator metadata set
- `drawHeader` renders title + subtitle + accent rule on a page
- `drawFooter` renders "Generated YYYY-MM-DD • strguests.tools" with `brandFooter: false` opt-out
- Vitest test confirms PDF magic bytes (`%PDF`) on output buffer
- Commit: `feat: pdf library base — branded header/footer template`

**Frontend-design note:** Apply [frontend-design](skill) on PDF aesthetics — guest-facing collateral; warmer palette than strops (which is ops-internal). Make the chrome restrained but hospitable.

---

## Task 10 — Express server skeleton + MySQL pool + schema migration

**Source:** Task 10 in source plan (full code blocks there)

**Files:** `server/index.ts`, `server/lib/db.ts`, `server/db/schema.sql`, `server/db/migrate.ts`, `tests/server/db.test.ts`, `.env.example`

**Acceptance:**
- `pnpm server:dev` starts Express on `:3001`
- `curl :3001/api/health` → `{"status":"ok"}`
- `pnpm db:migrate` applies `schema.sql` idempotently against a local MySQL (or stubbed pool)
- Three tables exist post-migration: `rate_limits`, `email_verifications`, `generation_logs`
- `query()` correctly parameterizes (Vitest test asserts no string concatenation paths)
- `.env.example` documents all required vars (MYSQL_*, OPENAI_API_KEY, EMAIL_VERIFY_SECRET, IP_HASH_SALT, PUBLIC_ESP_WEBHOOK)
- Commit: `feat: express server skeleton + mysql schema`

**Note:** OpenAI key not required to land Phase 1. Required from Phase 3 (Task 16) onward.

---

## Phase 1 verification

After Task 10, run:

```bash
pnpm typecheck
pnpm test
pnpm dev &           # static site on :4321
pnpm server:dev &    # express api on :3001
curl http://localhost:3001/api/health
# Visit http://localhost:4321/ and confirm:
#   - Header, Footer, FunnelBand, ClusterFunnelBlock with hospitality-warm accent
#   - AdSlot, EmailCaptureCard, STRLedgerCTA, PdfDownloadButton, PinterestPinButton, AiRateLimitNotice render
#   - PdfDownloadButton modal opens + closes-still-downloads pattern works
```

Update `STATE.md`: mark all 10 tasks done, set current phase = 2.

---

## Out of scope for this phase

- PDF generators (Phase 2 — Tasks 11–14, plus T15 email-gate wiring)
- AI server endpoints + UIs (Phase 3 — Tasks 16–21)
- Programmatic template pages (Phase 4 — Tasks 22–24)
- Pinterest pin generator + lead magnet (Phase 5 — Tasks 25–31)
- Analytics + CI + deploy (Phase 6 — Tasks 32–36)
