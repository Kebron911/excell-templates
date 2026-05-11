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
