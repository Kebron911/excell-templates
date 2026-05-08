# Phase 5 — Analytics + E2E

**Goal:** Finalize GA4 cross-domain analytics with a typed event taxonomy funneled through `src/lib/analytics.ts`, then ship a Playwright smoke suite covering all 7 tools, sample programmatic pages, and the landing page (with a basic axe-core a11y check).

**Source plan:** [`docs/superpowers/plans/2026-05-05-strops-tools.md`](../../../docs/superpowers/plans/2026-05-05-strops-tools.md), tasks 31–32.

**Requirements satisfied:** R7 (analytics events), R10 (a11y via E2E smokes).

**Phase 1–4 dependencies:**

- `src/components/chrome/Layout.astro` — GA4 snippet conditionally rendered when `PUBLIC_GA4_ID` set; cross-domain linker already wires the 5-site cluster (Phase 4).
- `src/components/funnel/EmailCaptureCard.astro` — fires `email_captured` (Phase 1, line 117).
- `src/components/affiliate/AffiliateCard.astro` — currently fires `affiliate_clicked` direct + console.log (Phase 1 placeholder; Task 31 routes through helper).
- `src/lib/pdf/download.ts` — fires `pdf_downloaded` (Phase 2, lines 22–24).
- `src/lib/calendar/ics.ts` — currently fires `ics_downloaded`. Task 31 renames to canonical `ics_exported` per acceptance.
- 7 calculator islands at `src/components/calculators/*.tsx` — Task 31 wires `tool_used` events from each.
- `playwright.config.ts` — Phase 1 bootstrap; `webServer` runs `pnpm build && pnpm preview` on `localhost:4321`. `tests/e2e/` empty (Task 32 populates).

---

## Phase acceptance

- GA4 fires events: `email_captured`, `pdf_downloaded`, `ics_exported`, `tool_used`, `affiliate_clicked`
- All event firings go through `src/lib/analytics.ts` typed helper (single source of truth)
- GA4 gates cleanly on `PUBLIC_GA4_ID` env (no errors when unset, no double-fire when set)
- Playwright suite green for all 7 tools + 5 sample maintenance + 5 sample replacement + landing
- Basic a11y smoke (axe-core) on landing + 1 tool — zero serious/critical violations target
- `pnpm typecheck` 0 errors maintained
- `pnpm test` (Vitest) green maintained
- `pnpm e2e` green
- `pnpm build` clean
- 3 commits total (1 scaffold + 2 tasks)

---

## Tasks

- [ ] **Task 31 — GA4 cross-domain analytics with full event taxonomy**

  **Add typed analytics helper:**

  - Create `src/lib/analytics.ts` with:
    - `EventName = 'email_captured' | 'pdf_downloaded' | 'ics_exported' | 'tool_used' | 'affiliate_clicked'`
    - `EventParams<E extends EventName>` typed param shape per event
    - `trackEvent<E extends EventName>(name: E, params: EventParams<E>)` — guarded `window.gtag?.()` call, browser-side only
    - SSR/no-op safe (server: silently skip; client without GA4: silently skip)

  **Wire event firings (replace inline `gtag` calls):**

  - `EmailCaptureCard.astro:117` — replace `(window as any).gtag?.('event', 'email_captured', ...)` with `trackEvent('email_captured', { tool, magnet })`
  - `pdf/download.ts:22–24` — replace inline `gtag` with `trackEvent('pdf_downloaded', { filename, tool? })`
  - `calendar/ics.ts:51–53` — rename event from `ics_downloaded` → `ics_exported`, route through helper, add `tool` param
  - `AffiliateCard.astro:65–72` — replace `console.log` + inline gtag with `trackEvent('affiliate_clicked', { vendor, tool })`
  - 7 calculators — fire `tool_used` once per tool (debounced or once-per-mount) when results render. Use `useEffect` with a "fired" ref; param: `{ tool: <slug> }`.

  **Document event taxonomy:**

  - Create `docs/analytics-events.md` with table: event name | when fired | params | source file
  - Cross-link from Layout.astro GA4 block (single line comment)

  **Verify:**

  - `pnpm typecheck` 0 errors
  - `pnpm test` green
  - `pnpm build` clean
  - Smoke check: build with no `PUBLIC_GA4_ID` → no GA4 script in `dist/` HTML
  - Smoke check: build with `PUBLIC_GA4_ID=G-TEST` → snippet present once

  Commit: `feat(strops-tools): GA4 cross-domain analytics with full event taxonomy (Phase 5 Task 31)`

- [ ] **Task 32 — Playwright E2E suite for 7 tools + sample pages**

  **Install + configure:**

  - Install `@axe-core/playwright` as devDep
  - Confirm Playwright Chromium browser installed (`pnpm e2e:install` if needed; idempotent)
  - Update `playwright.config.ts` `testDir` if needed; current `./tests/e2e` works
  - Add `pnpm test:e2e` alias in package.json (mirrors source plan terminology)

  **Per-tool smokes (`tests/e2e/tools/`):**

  1. `turnover-scheduler.spec.ts` — load page, verify default rows render in table, edit `turnoverHours` → verify URL updates
  2. `cleaner-dispatch.spec.ts` — load, click "Download dispatch sheet (PDF)" → assert download triggered (Playwright `page.waitForEvent('download')`)
  3. `smart-lock-codes.spec.ts` — load with deterministic secret, assert generated code matches expected (TDD-locked algorithm)
  4. `linen-par.spec.ts` — load, change bedrooms → assert sheet count updates
  5. `restock-calculator.spec.ts` — load, assert reorder table renders, assert "Copy reorder list" button enabled
  6. `damage-cost-lookup.spec.ts` — load, search "mattress", assert filtered rows visible
  7. `maintenance-schedule.spec.ts` — load, click PDF download → assert download; click .ics → assert download

  **Programmatic-page smokes:**

  - `tests/e2e/maintenance-pages.spec.ts` — sample 5 slugs (`hvac-filter-change`, `ac-tune-up`, `smoke-detector-test`, `furnace-tune-up`, `mini-split-clean`); each loads, has h1, has back-link to `/maintenance/`
  - `tests/e2e/replace-pages.spec.ts` — sample 5 slugs (`queen-mattress`, `king-mattress`, `mattress-topper`, `bed-frame-queen`, `nightstand`); each loads, has h1, displays cost range

  **Landing smoke:**

  - `tests/e2e/landing.spec.ts` — assert all 7 tool names in 7-tool grid, assert ClusterFunnelBlock rendered, assert 3 lead-magnet teasers

  **A11y smoke:**

  - `tests/e2e/a11y.spec.ts` — axe-core on `/` and `/turnover-scheduler`. Filter to `serious|critical` impact. Log violations; fail only if > 0 critical.

  **Verify:**

  - `pnpm e2e` green; full suite passes
  - `pnpm typecheck` 0 errors maintained

  Commit: `feat(strops-tools): Playwright E2E suite for 7 tools + sample pages (Phase 5 Task 32)`

---

## Decisions to log

- `tool_used` fires once per tool mount (not per re-render) — typical SaaS funnel pattern, prevents inflated event counts on URL-state edits.
- `ics_downloaded` renamed to `ics_exported` (Phase 5 acceptance canonicalization). One-way change; legacy event ID never deployed (no users yet).
- a11y: `serious`/`critical` is the gate; `moderate`/`minor` logged but non-fatal. Cluster pattern.
- Playwright `webServer` uses `pnpm preview` against built `dist/` (no HMR overhead, faster + more stable). Existing config preserved.
