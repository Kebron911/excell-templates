# STATE

**Current phase:** 3 — Programmatic pages (maintenance + replacement)
**Current task:** In progress — Task 23 (Replacement index)
**Last update:** 2026-05-07

---

## Phase 3 progress

- [x] Task 17 — Maintenance data expansion (tasks.json, 30 entries)
- [x] Task 18 — Maintenance programmatic pages (30 routes)
- [x] Task 19 — Maintenance index
- [x] Task 20 — Maintenance MDX collection (5 samples)
- [x] Task 21 — Replacement data expansion (items.json, 56 entries)
- [x] Task 22 — Replacement programmatic pages (56 routes)
- [ ] Task 23 — Replacement index
- [ ] Task 24 — Replacement MDX collection (5 samples)

---

## Phase 2 progress

- [x] Task 10 — Turnover scheduler
- [x] Task 11 — Cleaner dispatch (PDF)
- [x] Task 12 — Smart lock codes (deterministic)
- [x] Task 13 — Linen par calculator
- [x] Task 14 — Restock calculator
- [x] Task 15 — Damage cost lookup
- [x] Task 16 — Maintenance schedule (PDF + .ics)

**Phase 2 complete: 7/7 tasks. 2026-05-07.**

---

## Phase 1 progress

- [x] Task 1 — Bootstrap repo + tooling
- [x] Task 2 — Brand tokens (ops accent shift)
- [x] Task 3 — Print stylesheet
- [x] Task 4 — Layout primitives (incl. ClusterFunnelBlock)
- [x] Task 5 — Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateCard)
- [x] Task 6 — URL state library (TDD)
- [x] Task 7 — Format library (TDD)
- [x] Task 8 — SEO library
- [x] Task 9 — PDF library — base setup with brand header/footer

**Phase 1 complete: 9/9 tasks. 2026-05-07.**

---

## Decisions log (this run)

- **2026-05-07** — Skipped `@types/pdf-lib` from plan; package does not exist on npm (pdf-lib ships its own types). Plan required it but install would fail.
- **2026-05-07 (Task 2)** — Locked ops-utility accent: `--accent-500: #5A7359` (sage-meets-graphite green-gray). Shade ladder: `#8AA289 / #5A7359 / #3F5740` (300/500/700). At L*48 it carries the same perceptual weight as strhost's gold in the wordmark slot; passes WCAG AA on parchment. Aliased `--brand-gold` → `--accent-500` so cluster components ported verbatim still resolve correctly.
- **2026-05-07 (Phase 2 routing)** — Source plan/spec used flat tool paths (`/turnover-scheduler`, `/linen-par`, etc.) which match existing `src/data/tools.json`. User brief mentioned `/tools/{slug}/` but landing + data already wire flat paths; kept flat to avoid breaking the landing tool grid. Slug `linen-par` (not `linen-par-calculator`) matches both data and source plan.
- **2026-05-07 (Phase 2 PDF base extension)** — Phase 1 `src/lib/pdf/base.ts` exports `createBasePdf` (single-page) but Tasks 11/16 need multi-page control. Added `createBrandedDoc`, `addBrandedPage`, `decorateFooters`, plus `PAGE`/`MARGIN`/`BODY_TOP_Y` constants — additive, didn't break existing `createBasePdf` API. Phase 1 base test still green.
- **2026-05-07 (Phase 2 lead magnets)** — EmailCaptureCard `magnet` prop receives explicit slugs per source plan: `cleaner-sop-pdf` (turnover, cleaner-dispatch, smart-lock-codes), `supply-par-pdf` (linen-par, restock-calculator), `maintenance-checklist-pdf` (damage-cost-lookup, maintenance-schedule). Phase 4 Task 25 will canonicalize the tool→magnet map via `tools.json`.
- **2026-05-07 (Phase 2 ESP gate)** — Per source brief: ops audience prefers direct download over email-gated download. Cleaner-dispatch and maintenance-schedule expose PDF/ICS download buttons with no email gate. EmailCaptureCard remains as a separate inline funnel surface.
- **2026-05-07 (Phase 3 Task 17 — data shape)** — `tasks.json` introduced as the canonical maintenance catalog (30 entries). Phase 2 `maintenance-tasks-seed.json` retained as-is so `tests/calc/maintenance-schedule.test.ts` keeps its small, deterministic fixture (we don't want test runtime tied to catalog growth). `MaintenanceSchedule.tsx` migrated to `tasks.json`. Schema unchanged.
- **2026-05-07 (Phase 3 MDX strategy)** — Sister project `STRGuests-Tools` (Astro 6 too) uses `import.meta.glob('/src/content/<scope>/*.mdx', { eager: true })` for narrative-slot MDX rather than Astro Content Collections. Adopting same pattern for `/maintenance/[slug].astro` and `/replace/[slug].astro` — zero collection-config overhead, dev/build perf identical at this catalog size, and consistent with cluster.
- **2026-05-07 (Phase 3 typecheck baseline)** — Phase 2 shipped with 5 pre-existing `ts(2352)` JSON-tuple-narrowing errors + 1 unused-import warning. Logged in `.planning/phases/03-programmatic-pages/deferred-items.md`. Out of scope per scope-boundary rule (pre-existing in main, unrelated to Phase 3 routes). Phase 3 work doesn't introduce new typecheck errors.
- **2026-05-07 (Phase 3 Task 18 — Astro frontmatter parser quirk)** — Astro 6 (esbuild 0.27) frontmatter parser/transformer trips on deeply-nested arithmetic parens (`(d / 365) * 10) / 10`) inside multiline-conditional expressions, throwing a non-actionable `Unexpected "export"` error pointing at unrelated line numbers. Workaround: pre-compute scaled divisors (`Math.round(d / 36.5) / 10`). Hours debug-bisected to a single math expression. Logged here so future programmatic-page authors don't lose the same hour. Source plan didn't anticipate the Astro 6 + esbuild interaction.

## Deviations log

- **Task 1 / 2026-05-07** — Plan listed `@types/pdf-lib` as install target. That package is not published. pdf-lib ships its own `.d.ts` declarations, so no extra types pkg is needed. Logged as Rule 3 (blocking issue, fix inline).
- **Task 9 / 2026-05-07** — pdf-lib overwrites the PDF `/Producer` field with its own marker string (`pdf-lib (https://github.com/Hopding/pdf-lib)`) on serialize, regardless of `setProducer()`. Test originally asserted equality with `BRAND.producer` after round-trip; relaxed to `toContain('pdf-lib')` to reflect actual behavior. Author round-trips correctly. This is a pdf-lib quirk, not a strops bug. (Rule 1 — fix.)

## Open questions blocking current work

_None._ (Domain / ESP / vendor list do not block Phase 1.)

## Cluster sequencing

Per [STR cluster build order](../../STRHost-Tools/.planning/PROJECT.md): strhost.tools first, strguests.tools second, strops.tools **third**, strbuyers.tools fourth.
