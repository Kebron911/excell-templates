# Phase 4 — Site pages, lead magnets, SEO surface

**Goal:** Ship the production landing page, three lead-magnet capture pages with email gate + PDF delivery, About + Contact, sitemap + robots.txt, and Satori-rendered OG images per route. Clean up the 5 pre-existing typecheck errors logged in Phase 3 deferred-items as part of the `tools.json` shape change in Task 25.

**Source plan:** [`docs/superpowers/plans/2026-05-05-strops-tools.md`](../../../docs/superpowers/plans/2026-05-05-strops-tools.md), tasks 25–30.

**Requirements satisfied:** R6 (lead magnets), R7 (SEO surface).

**Phase 1–3 dependencies:**

- `src/data/tools.json` (Phase 2) — extended in Task 25 with `magnet`, `blurb`, `affiliates` fields. Existing fields (`name`, `tagline`, `path`, `primaryKeyword`, `category`) preserved.
- `src/lib/pdf/base.ts` (Phase 1 + Phase 2 multi-page extension) — used by the magnet stub-builder script.
- `src/lib/seo.ts` (Phase 1) — `ogImageFor()` already maps path → `/og/<slug>.png`; the OG generator writes those files.
- `src/components/funnel/EmailCaptureCard.astro` (Phase 1) — already POSTs to `PUBLIC_ESP_WEBHOOK` if set, else logs to console. Phase 4 wires no real ESP; we add `/api/subscribe` as a documented stub for the eventual swap.
- `@astrojs/sitemap` already in `astro.config.mjs` integrations — auto-emits sitemap-index.xml for static routes.
- `satori` + `sharp` already installed (Phase 1 deps).

**ESP blocker:** Real ESP not selected (Buttondown / ConvertKit / Mailchimp open). Phase 4 ships with stub strategy: forms hit `EmailCaptureCard`'s existing console-log fallback; magnet pages also expose direct stub-PDF download below the form. ESP swap = single-file change post-launch. Logged as a deviation.

**Vendor list blocker:** AffiliateCard already uses `src/data/affiliates.json` stub from Phase 1; lead-magnet pages don't need real vendors. Out of scope for Phase 4.

---

## Phase acceptance

- 3 lead-magnet pages live (`/cleaner-sop/`, `/supply-par/`, `/maintenance-checklist/`) with EmailCaptureCard + stub PDF download
- Production landing page lists all 7 tools with branded hero, ClusterFunnelBlock, lead-magnet teaser strip, AdSlot footer
- About + Contact pages render
- Sitemap.xml emitted with all routes (~100 total)
- robots.txt allows all + references sitemap
- OG image PNG exists for every key route (landing + 7 tools + 3 lead magnets + maintenance index + replace index + about + contact at minimum)
- `pnpm typecheck` 0 errors (5 pre-existing ts(2352) + 1 ts(2322) cleaned up in Task 25)
- `pnpm test` all green
- `pnpm build` clean
- 7 commits total (1 scaffold + 6 tasks)

---

## Tasks

- [x] **Task 25 — `tools.json` registry (tool→magnet matchup) + typecheck cleanup**
  - Extend `src/data/tools.json` per source plan: add `magnet`, `blurb`, `affiliates` per tool.
    - `cleaner-sop-pdf`: turnover-scheduler, cleaner-dispatch, smart-lock-codes
    - `supply-par-pdf`: linen-par, restock-calculator
    - `maintenance-checklist-pdf`: damage-cost-lookup, maintenance-schedule
  - Update `Layout.astro` index page consumers if needed (existing `tagline`/`path` preserved — additive only).
  - Clean up 5 pre-existing `ts(2352)` JSON-tuple cast errors in `DamageCostLookup.tsx`, `MaintenanceSchedule.tsx`, two test files via `as unknown as Catalog/TaskCatalog` cast.
  - Clean up 1 pre-existing `ts(2322)` Uint8Array → BlobPart in `download.ts` via `new Blob([new Uint8Array(bytes)])` ArrayBuffer copy.
  - Optional: clean up `ts(6133)` unused `serialize` import in `TurnoverScheduler.tsx`.
  - Verify: `pnpm typecheck` 0 errors. `pnpm test` green. `pnpm build` clean.
  - Commit: `feat(strops-tools): tools.json registry with lead-magnet mapping (Phase 4 Task 25)`

- [x] **Task 26 — Lead magnet pages (3)**
  - Stub PDF builder script `scripts/build-stub-magnets.mjs` — generates 3 placeholder PDFs via `createBasePdf` into `public/pdf/`.
  - Add `pnpm build:magnets` script to `package.json`.
  - Run script once and commit the PDFs.
  - Create 3 magnet pages: `/cleaner-sop/`, `/supply-par/`, `/maintenance-checklist/`. Each: long-form value pitch (~300 words), `EmailCaptureCard` wired to magnet slug, post-form a direct download link to the stub PDF.
  - Forms use `EmailCaptureCard`'s existing console-log fallback (no ESP). Add inline note about the design decision.
  - Verify: `pnpm build` produces all 3 routes; PDFs accessible via `dist/pdf/*.pdf`.
  - Commit: `feat(strops-tools): lead magnet pages — cleaner SOP, supply par, maintenance checklist (Phase 4 Task 26)`

- [x] **Task 27 — Production landing page**
  - Replace existing throwaway landing at `src/pages/index.astro` (currently has Phase 1 verification preview).
  - Hero per Cluster Style Guide §4: short Cormorant H1 with accent period, one Inter lede, no CTA buttons in hero.
  - 7-tool grid (3 col lg / 2 sm / 1 xs) consuming `tools.json`.
  - ClusterFunnelBlock.
  - Lead-magnet teaser strip (3 cards → /cleaner-sop, /supply-par, /maintenance-checklist).
  - AdSlot footer.
  - Verify: build clean, landing renders all 7 tools + 3 magnets.
  - Commit: `feat(strops-tools): production landing page (Phase 4 Task 27)`

- [ ] **Task 28 — About + Contact**
  - `src/pages/about.astro` — operator brand story (who we are, why ops not flashy, what's free, last-updated date). Reuse layout primitives.
  - `src/pages/contact.astro` — `mailto:hello@strops.tools` + bug-report / calculator-request guidance.
  - Verify: build clean, both pages render.
  - Commit: `feat(strops-tools): about + contact pages (Phase 4 Task 28)`

- [ ] **Task 29 — Sitemap + robots.txt**
  - Verify `@astrojs/sitemap` integration emits sitemap with all routes.
  - Create `public/robots.txt` allowing all + sitemap reference.
  - Verify: `dist/sitemap-index.xml` exists, includes maintenance + replace + tools + magnets + landing + about + contact.
  - Commit: `feat(strops-tools): sitemap + robots.txt (Phase 4 Task 29)`

- [ ] **Task 30 — OG images via Satori**
  - Create `scripts/build-og.mjs` mirroring `STRGuests-Tools/scripts/build-og.mjs` (parchment + ops-utility green-gray accent + "STR Ops.tools" wordmark).
  - Iterate: landing, 7 tools, 3 lead magnets, maintenance index, replace index, about, contact (~15 base routes). Optional: per-maintenance-task and per-replace-item OGs (~80 more) — defer if perf-prohibitive at build time, default OG falls back via `seo.ts`.
  - Add `pnpm build:og` script + `prebuild` hook in `package.json`.
  - Outputs go to `public/og/*.png` and `dist/og/*.png` (via build script).
  - Verify: `pnpm build` produces OG images; pages reference them via `seo.ts` `ogImageFor`.
  - Commit: `feat(strops-tools): OG image generator (Phase 4 Task 30)`

---

## Out of scope (Phase 5+)

- GA4 event firing on `email_captured` / `pdf_downloaded` (Phase 5 wires GA4 cross-domain).
- Real ESP integration (post-launch, single-file swap).
- Real affiliate vendor data (post-launch).
- Per-MDX-narrative custom OGs (default OG covers programmatic indexes; per-page MDX OGs not required by acceptance).
