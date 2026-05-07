# Phase 2 — Seven tools

**Goal:** Ship all seven ops tools as URL-stateful Astro pages with React-island calculators. TDD calc logic per tool. Cleaner-dispatch (Task 11) and maintenance-schedule (Task 16) extend the Phase 1 PDF library to produce branded, multi-page printables. Maintenance-schedule additionally exports an RFC-5545 `.ics` calendar file. Smart-lock-codes (Task 12) is deterministic — same `(bookingId, secret, digits)` always produces the same code.

**Source plan:** [`docs/superpowers/plans/2026-05-05-strops-tools.md`](../../../docs/superpowers/plans/2026-05-05-strops-tools.md), tasks 10–16.

**Cluster reference:** Tool page pattern follows [STR Cluster Style Guide §3 (header), §5 (sidebar), §6 (verification preview)](../../../../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md). Sidebar appears ONLY on tool pages. Verification preview (AdSlot · EmailCaptureCard · STRLedgerCTA · AffiliateCard · AdSlot) collapsed in `<details>` at page bottom. AffiliateCard renders AFTER value delivery — never above the calculator.

**Phase 1 dependency:** Tools 11 and 16 use `src/lib/pdf/base.ts` (`createBasePdf`, `drawHeader`, `drawFooter`, `BRAND`, `COLORS`). Both PDF tools require multi-page support — Phase 1 footer takes `pageNumber`/`totalPages` so multi-page is a matter of opening the doc, calling `addPage` per overflow, and decorating each page.

**Requirements satisfied:** R1.1–R1.7 (the seven tools), R2 (extended page template), R3 (URL state, share, print, deterministic codes, .ics export).

**Acceptance for the phase:**

- All seven routes hydrate at `/turnover-scheduler/`, `/cleaner-dispatch/`, `/smart-lock-codes/`, `/linen-par/`, `/restock-calculator/`, `/damage-cost-lookup/`, `/maintenance-schedule/` (paths match existing `src/data/tools.json`)
- Cleaner-dispatch + maintenance-schedule produce branded PDFs (multi-page where needed)
- Smart-lock-codes deterministic test green (same input → same code; different input → different code)
- Maintenance-schedule produces valid `.ics` (RFC 5545; magic header `BEGIN:VCALENDAR`)
- `pnpm typecheck` 0 errors
- `pnpm test` all green (Phase 1 tests + 7 new tool calc tests + 2 new PDF tests)
- `pnpm build` clean static build
- 7 tool commits + 1 phase scaffold commit (this file) landed

---

## Cross-cutting per-tool acceptance pattern

Each tool needs:

- Astro page route at `src/pages/{slug}.astro`
- React island component at `src/components/calculators/{ToolName}.tsx`
- Calc lib at `src/lib/calc/{slug}.ts` (pure, TDD)
- Vitest test at `tests/calc/{slug}.test.ts` (logic) + `tests/lib/pdf-{slug}.test.ts` for PDF tools
- URL state encoding via Phase 1 `src/lib/url-state.ts` — deep-linkable
- Sidebar visible (per Cluster Style Guide §5 — Sidebar ONLY on tool pages)
- Header coverage already wired in Phase 1
- Verification preview collapsed `<details>` per cluster pattern
- Tool-specific monetization: AffiliateCard appears AFTER results render, inline FTC disclosure
- Print stylesheet hides chrome on `@media print` (already wired in Phase 1)

---

## Task 10 — Turnover scheduler

**Source:** lines 910–1138 of source plan.

**Files:**
- `src/lib/calc/turnover.ts` — `computeSchedule()`, `hasConflict()`
- `tests/calc/turnover.test.ts` — gap math, conflict detection, group-by-property
- `src/components/calculators/TurnoverScheduler.tsx` — URL-state island
- `src/pages/turnover-scheduler.astro` — page with sidebar, AffiliateCard for `turno`

**Acceptance:** Vitest green; bookings serialize round-trip through URL; tight-turn flag activates < threshold hours.

**Commit:** `feat(strops-tools): turnover-scheduler tool (Phase 2 Task 10)`

---

## Task 11 — Cleaner dispatch (PDF)

**Source:** lines 1140–1346 of source plan.

**Files:**
- `src/lib/calc/cleaner-dispatch.ts` — `buildDispatch()`, `smsTemplate()`
- `src/lib/pdf/cleaner-dispatch.ts` — extends `src/lib/pdf/base.ts`, multi-page if many turnovers
- `src/lib/pdf/download.ts` — shared `downloadBytes(bytes, filename)` helper (reused by Task 16)
- `tests/calc/cleaner-dispatch.test.ts` — round-robin, SMS template
- `tests/lib/pdf-cleaner-dispatch.test.ts` — PDF magic bytes
- `src/components/calculators/CleanerDispatch.tsx`
- `src/pages/cleaner-dispatch.astro` — AffiliateCard for `turno`

**Acceptance:** PDF download works; PDF starts with `%PDF`; multi-page works if assignments > one page.

**Commit:** `feat(strops-tools): cleaner-dispatch tool with PDF (Phase 2 Task 11)`

---

## Task 12 — Smart lock codes (deterministic)

**Source:** lines 1348–1499 of source plan.

**Files:**
- `src/lib/calc/smart-lock-codes.ts` — `codeFor()` (Node sync via `node:crypto`), `codeForAsync()` (browser via `crypto.subtle`), `batchCodes()`
- `tests/calc/smart-lock-codes.test.ts` — determinism, uniqueness, digit-length 4–8, batch order
- `src/components/calculators/SmartLockCodes.tsx`
- `src/pages/smart-lock-codes.astro` — AffiliateCards for `august`, `schlage`, `remotelock`

**Acceptance:** All five reproducibility assertions green.

**Commit:** `feat(strops-tools): smart-lock-codes deterministic generator (Phase 2 Task 12)`

---

## Task 13 — Linen par calculator

**Source:** lines 1501–1550 of source plan.

**Files:**
- `src/lib/calc/linen-par.ts` — `computeLinenPar()`
- `tests/calc/linen-par.test.ts` — sets-per-bed, bath, king/queen split
- `src/components/calculators/LinenParCalculator.tsx`
- `src/pages/linen-par.astro` — AffiliateCard (Hospitable PMS or Turno; ops-supply-list adjacent)

**Acceptance:** Vitest green; results render with `tabular-nums`.

**Commit:** `feat(strops-tools): linen-par-calculator tool (Phase 2 Task 13)`

---

## Task 14 — Restock calculator

**Source:** lines 1552–1598 of source plan.

**Files:**
- `src/lib/calc/restock.ts` — `computeRestock()`
- `tests/calc/restock.test.ts` — booking_volume × per-stay rates math
- `src/components/calculators/RestockCalculator.tsx` — items in textarea CSV
- `src/pages/restock-calculator.astro` — AffiliateCard for `hospitable`

**Acceptance:** Vitest green; live updates to results table.

**Commit:** `feat(strops-tools): restock-calculator tool (Phase 2 Task 14)`

---

## Task 15 — Damage cost lookup

**Source:** lines 1600–1663 of source plan.

**Files:**
- `src/data/damage-items.json` — seed catalog (~10–20 representative items now; full ~50 in Phase 3 Task 21)
- `src/components/calculators/DamageCostLookup.tsx` — search + category filter
- `src/pages/damage-cost-lookup.astro` — AffiliateCard for `hostfully` or `ownerrez`

**Acceptance:** Search filters items; category dropdown narrows results; table renders cost ranges.

**Commit:** `feat(strops-tools): damage-cost-lookup tool (Phase 2 Task 15)`

---

## Task 16 — Maintenance schedule (PDF + .ics)

**Source:** lines 1665–1815 of source plan.

**Files:**
- `src/lib/types.ts` — `MaintenanceTask`, `TaskCatalog`, `ReplacementItem`, `ItemCatalog`
- `src/data/maintenance-tasks-seed.json` — small seed (HVAC filter, AC tune-up, chimney sweep, etc; full ~30 in Phase 3 Task 17)
- `src/lib/calc/maintenance-schedule.ts` — `buildSchedule()` honoring `propertyTraits` gates
- `src/lib/pdf/maintenance-schedule.ts` — multi-page PDF
- `src/lib/calendar/ics.ts` — `buildIcs()` (uses `ics` package), `downloadIcs()`
- `tests/calc/maintenance-schedule.test.ts` — cadence × horizon arithmetic
- `tests/lib/pdf-maintenance-schedule.test.ts` — PDF magic bytes
- `tests/lib/ics.test.ts` — ICS produces `BEGIN:VCALENDAR`
- `src/components/calculators/MaintenanceSchedule.tsx`
- `src/pages/maintenance-schedule.astro` — AffiliateCard for `hospitable` or `ownerrez`

**Acceptance:** Vitest green; PDF + .ics both downloadable; .ics opens in macOS Calendar / Outlook.

**Commit:** `feat(strops-tools): maintenance-schedule with PDF + ics (Phase 2 Task 16)`

---

## Phase 2 verification

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm dev
# Visit each /<slug>/ route and confirm:
#   - Sidebar visible on every tool page
#   - URL updates as inputs change
#   - PDF download (cleaner-dispatch, maintenance-schedule)
#   - .ics download (maintenance-schedule)
#   - Smart-lock-codes: refresh page → same codes
```

After all tasks: update STATE.md (phase 2 complete, current phase = 3, current task = "Not yet started (Task 17)"), update ROADMAP.md status table (Phase 2 → completed, Phase 3 → active). Final commit: `chore(strops-tools): mark Phase 2 complete`.

---

## Out of scope for this phase

- Full ~30 maintenance tasks JSON (Phase 3 Task 17 — only seed data here)
- Full ~50 replacement items JSON (Phase 3 Task 21 — only seed data here)
- Programmatic /maintenance/[task] + /replace/[item] pages (Phase 3)
- Lead magnet pages (Phase 4)
- GA4 events + Playwright smokes (Phase 5)
- CI / FTP deploy (Phase 6)
