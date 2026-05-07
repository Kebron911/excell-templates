# Deferred items — Phase 3

Pre-existing typecheck issues observed at start of Phase 3, **inherited from Phase 2**. Out of scope for Phase 3 work; logging here for Phase 4+ cleanup.

## TS2352 — JSON tuple inference (5 errors)

**Files:**
- `src/components/calculators/DamageCostLookup.tsx:20` — `items as Catalog`
- `src/components/calculators/MaintenanceSchedule.tsx:16` — `tasks as TaskCatalog` (was `seed as TaskCatalog`)
- `tests/calc/maintenance-schedule.test.ts:6` — `seed as TaskCatalog`
- `src/lib/pdf/download.ts:12` — `Blob([bytes])` Uint8Array narrowing

**Cause:** TypeScript widens JSON tuple-literals like `[15, 40]` to `number[]`, so `as TaskCatalog`-style asserts trip the structural-incompatibility branch of `ts(2352)`. Same applies to the `Blob` constructor with pdf-lib's Uint8Array.

**Fix shape (Phase 4 candidate):** Either
1. Cast through `unknown` (`tasks as unknown as TaskCatalog`), or
2. Add JSON-loader helper that re-types tuple fields explicitly, or
3. Schema-validate at module load via Zod and infer the typed shape.

**Why not now:** Pre-existing in `main` branch (Phase 2 already shipped); fixing them is unrelated to Phase 3's programmatic-pages scope. Phase 3 routes use the same JSON modules but only via consumed types (`Object.entries`), which doesn't trip the assertion.

## TS6133 unused import (1 warning)

`src/components/calculators/TurnoverScheduler.tsx:11` — `serialize` imported but unused. Phase 2 leftover; trivial cleanup later.
