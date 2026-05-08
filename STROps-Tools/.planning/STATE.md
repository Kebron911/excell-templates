# STATE

**Current phase:** 4 — Site pages, lead magnets, SEO surface (blocked — see below)
**Current task:** Not yet started
**Last update:** 2026-05-08

---

## Phase 1 progress — COMPLETE ✓

- [x] Task 1 — Bootstrap repo + tooling
- [x] Task 2 — Brand tokens (ops accent shift)
- [x] Task 3 — Print stylesheet
- [x] Task 4 — Layout primitives (incl. ClusterFunnelBlock)
- [x] Task 5 — Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateCard)
- [x] Task 6 — URL state library (TDD)
- [x] Task 7 — Format library (TDD)
- [x] Task 8 — SEO library
- [x] Task 9 — PDF library — base setup with brand header/footer

## Phase 2 progress — COMPLETE ✓

- [x] Task 10 — Turnover scheduler
- [x] Task 11 — Cleaner dispatch (PDF)
- [x] Task 12 — Smart lock codes (deterministic, HMAC-SHA-256)
- [x] Task 13 — Linen par calculator
- [x] Task 14 — Restock calculator
- [x] Task 15 — Damage cost lookup (deep-links to /replace/[item])
- [x] Task 16 — Maintenance schedule (PDF + .ics)

## Phase 3 progress — COMPLETE ✓

- [x] Task 17 — Maintenance data (tasks.json, 30 tasks)
- [x] Task 18 — Maintenance programmatic pages
- [x] Task 19 — Maintenance index (sortable)
- [x] Task 20 — Maintenance MDX collection (5 narrative samples)
- [x] Task 21 — Replacement data (items.json, 51 items)
- [x] Task 22 — Replacement programmatic pages
- [x] Task 23 — Replacement index (sortable)
- [x] Task 24 — Replacement MDX collection (5 narrative samples)

---

## Build state (as of 2026-05-08)

- `pnpm typecheck` — exit 0 (1 cosmetic Astro hint, pre-existing)
- `pnpm test` — exit 0, 34 tests across 13 files
- `pnpm build` — exit 0, **91 pages emitted**
  - 8 Phase 1+2 (7 tools + landing)
  - 31 maintenance (30 task pages + index)
  - 52 replacement (51 item pages + index)

24 atomic commits on branch `claude/amazing-bhabha-9754da`.

## Decisions log (this run)

- **Smart-lock determinism:** HMAC-SHA-256 (Node sync via `node:crypto`, browser async via SubtleCrypto). No `Math.random`. Reproducibility test green.
- **Stub data files in Phase 2** (`tasks.json` 10 items, `items.json` 8 items) deliberately under-spec'd; Phase 3 extended to 30 + 51 without breaking Phase 2 calculator imports.
- **Damage-cost-lookup deep-linking:** Phase 2 Task 15 was extended to deep-link to `/replace/[item]/` URLs (Phase 2 deviation #4). Phase 3 Task 22 reserves those slugs.
- **Content collections registered in Phase 3** (`maintenance`, `replacement`, `tools`). Tools MDX from Phase 2 was retroactively migrated (slug field stripped, derived from filename per Astro convention).
- **51 replacement items** instead of "~50" — last item kept rather than rounded.
- **Replacement MDX slugs** differed from plan list (some plan-suggested slugs weren't in our catalog). Picked highest-SEO-value slugs that exist: queen-mattress, tv-55-inch, sofa-3-seat, sheets-queen-set, smart-lock.

## Deviations log

See per-phase agent reports in commit history. All non-blocking; all justified in commit messages.

## Open questions blocking Phase 4

| # | Question | Blocks |
|---|----------|--------|
| 1 | ESP — same as strhost.tools / strguests.tools? | Phase 4 lead magnet pages (Tasks 26) — capture form has no destination otherwise |
| 2 | First 5 affiliate vendors — confirm August/Schlage/RemoteLock, Minut/NoiseAware, Hostfully/Hospitable/OwnerRez, TurnoverBnB/Turno | Phase 4 — AffiliateCard placement copy + links |
| 3 | Domain — confirmed `strops.tools`? | Phase 6 deploy |
| 4 | Hostinger FTP/SSH credentials | Phase 6 deploy |

## Open questions NOT blocking

- Cleaner SOP PDF authorship (host? Daniel? AI draft + edit?) — only blocks Cleaner SOP lead magnet content, not the Phase 4 page scaffolding itself.
- GA4 measurement ID (Phase 5) — env var gated; code can ship without it.

## Cluster sequencing

Per [STR cluster build order](../../STRHost-Tools/.planning/PROJECT.md): strhost.tools first, strguests.tools second, strops.tools **third (currently 3 of 6 phases shipped)**, strbuyers.tools fourth.
