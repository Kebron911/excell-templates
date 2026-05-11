# Phase 1 Baseline (post-Phase-0, pre-Phase-1)

**Captured:** 2026-05-11 08:57 MDT  
**SHA:** 60ff14a28d71a652138603959e14184562ca9900  
**Branch:** claude/phase-1-shared-pkgs-1778511089 (based on origin/main @ 60ff14a)

## Apps state (build + test parity targets)

| App | Build | Pages | Tests | Server Tests |
|---|---|---|---|---|
| STROps-Tools | PASS | 105 | 34/34 | — |
| STRGuests-Tools | PASS | 48 | 128 passed + 1 skipped / 129 | — |
| STRBuyers-Tools | PASS | 238 | 84/84 | 7/7 |
| STRHost-Tools | PASS | 73 | 73/73 | — |
| tools/empire-console | PASS | 140 | 68/68 | — |

> Tests for STROps, STRGuests, STRBuyers, STRHost sourced from controller's pre-run (this worktree).
> empire-console build + tests run fresh in this task.

## Tier 1 file inventory (to be extracted into packages/)

| File | STROps lines | STRGuests lines | STRBuyers lines | STRHost lines |
|---|---|---|---|---|
| src/lib/format.ts | 17 | 166 | 121 | 124 |
| src/lib/url-state.ts | 51 | 90 | 89 | 89 |
| src/lib/seo.ts | 125 | 249 | 312 | 233 |
| src/lib/email-gate.ts | MISSING | 142 | MISSING | MISSING |

> Canonical sources per spec: format → STRGuests (166-line version); url-state → most feature-complete variant; seo → reconcile all 4; email-gate → STRGuests only implementation.

## Workspace state

- pnpm-workspace.yaml: present at repo root with 7 packages (STRLedger, STRBuyers-Tools, STRGuests-Tools, STRHost-Tools, STRManuals/site, STROps-Tools, tools/empire-console)
- Root pnpm-lock.yaml: PRESENT
- Root package.json: ABSENT (Phase 1 will create)
- tsconfig.base.json: ABSENT (Phase 1 will create)
- .changeset/: ABSENT (Phase 1 will create)
- packages/: ABSENT (Phase 1 will create)

## packageManager fields

- STROps-Tools: pnpm@10.0.0 (must align to 9.6.0 in Phase 1 — Task 1)
- STRGuests-Tools: pnpm@9.6.0
- STRBuyers-Tools: pnpm@9.6.0
- STRHost-Tools: pnpm@9.6.0
- tools/empire-console: `<none>`

CI uses `pnpm/action-setup@v4 with version: 9`, so 9.x is the target.

## Notes

- pnpm-workspace.yaml lists 7 members (not 5 as plan noted) — STRLedger and STRManuals/site are also workspace members.
- STRBuyers-Tools built 238 pages (plan expected 235); delta likely new pages added since verification.
- empire-console first-ever capture: 140 pages, 68 tests — healthy baseline established.

---

## Phase 1 complete — final verification

**Captured:** 2026-05-11 12:10 MDT
**SHA:** 489623de2aa3fb36912105e7926eb1353511cf0b

| Package | Tests | Typecheck | Build |
|---|---|---|---|
| @str/format | 103/103 | PASS | PASS |
| @str/url-state | 76/76 | PASS (test files have pre-existing TS2322 literal-boolean narrowing in cross-app-compat + serialize) | PASS |
| @str/seo | 86/86 | PASS (test files have pre-existing TS2532 noUncheckedIndexedAccess) | PASS |
| @str/email-gate | 11/11 unit (integration skipped — Docker) | PASS | PASS |

| App | Build | Pages | Tests | Server Tests | Notes |
|---|---|---|---|---|---|
| STROps-Tools | PASS | 105 | 34/34 | — | Unchanged |
| STRGuests-Tools | PASS | 48 | 129/129 | — | **Now on @str/format + @str/url-state + @str/seo**; in-tree email-gate.ts retained (ESP webhook, not MySQL) |
| STRBuyers-Tools | PASS | 238 | 84/84 | 7/7 | Unchanged |
| STRHost-Tools | PASS | 73 | 73/73 | — | Unchanged |
| tools/empire-console | PASS | 140 | 68/68 | — | Unchanged |

**Phase 1 exit criteria met:**
- [x] Workspace tooling complete (root package.json, tsconfig.base.json, .changeset/)
- [x] packageManager aligned across all 4 *-Tools apps (pnpm@9.6.0)
- [x] 4 Tier 1 packages scaffolded, implemented, tested, built
- [x] STRGuests fully wired to consume @str/format, @str/url-state, @str/seo
- [x] STRGuests test count + page count preserved (parity with baseline)
- [x] Other 4 apps + packages untouched (no regressions)
- [x] Cross-app url-state compatibility verified

**Decisions during Phase 1:**

1. **email-gate scope adjustment:** STRGuests' existing `src/lib/email-gate.ts` is an ESP-webhook poster (POSTs to `PUBLIC_ESP_WEBHOOK` via fetch + sessionStorage for dismiss tracking), NOT MySQL-based. The new `@str/email-gate` is MySQL-based per spec — different architecture. STRGuests' email-gate stays in-tree this phase. The new package is "ready for first MySQL consumer" — Phase 3 will revisit.

2. **Apps stay at root:** Original spec envisioned `apps/<name>/` layout. Parallel agent's prior workspace setup placed them at root level, and CI deploy workflows reference `STROps-Tools/**` etc. Moving apps would break CI. Accepted current layout.

3. **5th workspace member discovered:** `tools/empire-console` (Astro 4.16) is in workspace but not in original spec scope. Verified its tests still pass post-Phase-1 changes; defer upgrade to a future phase.

4. **2 additional workspace members:** `STRLedger` and `STRManuals/site` were added to workspace by parallel agent. Listed in `.changeset/config.json` ignore array. Out of scope for Tier 1 extraction.

5. **buildItemList shape change:** `@str/seo`'s `buildItemList` now requires `{ name, items[] }` wrapper instead of bare `items[]`. STRGuests Task 8 wiring updated callers; other apps will need similar updates when wired (Phase 3).

**Known follow-ups for Phase 2:**
- @str/ui-chrome and @str/ui-funnel extraction (Tier 2 UI packages)
- Visual regression suite for STRGuests (catches UI extraction drift)
- Pre-existing TS2532 (`noUncheckedIndexedAccess`) errors in `@str/seo` test files (not introduced this phase; cleanup before Phase 2)
- Pre-existing TS2322 (literal-boolean narrowing) errors in `@str/url-state` test files (not introduced this phase; cleanup before Phase 2)
- empire-console upgrade from Astro 4.16 → 6.x (separate concern)
- ESP-webhook adapter for `@str/email-gate` if STRBuyers/STRHost/STROps need email gating before MySQL backend desired

Phase 1 done. Ready for Phase 2: Tier 2 UI packages (chrome + funnel).
