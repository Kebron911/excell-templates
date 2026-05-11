# Phase 3 Pre-Fanout Baseline

Captured: 2026-05-11  
Branch: `claude/phase-3-fanout-1778541511`  
Commit at capture: `155272c`

---

## Summary

- 5 apps built + tested
- 6 packages tested
- STRBuyers server tested
- 1 pre-existing test failure: `@str/ui-funnel` (3 snapshot mismatches)
- STRGuests-Tools build + 4 test files FAIL: packages missing dist artifacts (no `pnpm build` in packages yet)
- `buildItemList` caller counts match plan: 1 / 2 / 0
- 2 component inventory deltas from plan (see table notes)

---

## Package Test Results

| Package | Tests |
|---|---|
| @str/format | 103 passed |
| @str/url-state | 76 passed |
| @str/seo | 86 passed |
| @str/email-gate | 11 passed |
| @str/ui-chrome | 5 passed |
| @str/ui-funnel | FAIL — 3 snapshot mismatches (EmailCaptureCard, STRLedgerCTA) |

---

## App Build + Test Results

| App | Pages Built | Tests |
|---|---|---|
| STROps-Tools | 105 pages | 34 passed |
| STRGuests-Tools | FAIL (missing package dist: @str/seo, @str/format, @str/url-state) | 103 passed / 4 test files FAIL (resolver) |
| STRBuyers-Tools | 244 pages | 84 passed |
| STRHost-Tools | 73 pages | 73 passed |
| tools/empire-console | 140 pages | 68 passed |

### STRBuyers Server Tests
| | Tests |
|---|---|
| pnpm server:test | 7 passed |

---

## Component Inventory (wc -l line counts)

Plan values shown in parentheses where different from actual.

| File | STRBuyers | STRHost | STROps |
|---|---|---|---|
| chrome/Header.astro | 61 | 61 | 22 |
| chrome/Footer.astro | 61 | 62 | 50 *(plan: 49)* |
| chrome/Sidebar.astro | 27 | 27 | 20 |
| chrome/Layout.astro | 84 | 92 | MISSING |
| chrome/FunnelBand.astro | 38 | 26 | 9 |
| chrome/Wordmark.astro | 72 | 72 | 70 *(plan: MISSING)* |
| chrome/ClusterFunnelBlock.astro | 73 | 60 | MISSING |
| funnel/EmailCaptureCard.astro | 126 | 124 | 59 |
| funnel/STRLedgerCTA.astro | 111 | 111 | 22 |
| funnel/RelatedPosts.astro | MISSING | 67 | MISSING |
| ads/AdSlot.astro | 65 | 66 | 19 |
| lib/format.ts | 121 | 124 | 17 |
| lib/url-state.ts | 89 | 89 | 51 |
| lib/seo.ts | 312 | 233 | 125 |
| lib/email-gate.ts | MISSING | MISSING | MISSING |

### Inventory Deltas from Plan

1. `STROps chrome/Footer.astro` — plan: 49, actual: **50** (+1 line)
2. `STROps chrome/Wordmark.astro` — plan: MISSING, actual: **70 lines** (file exists)

---

## buildItemList Caller Counts

| App | Callsites | Plan |
|---|---|---|
| STRBuyers-Tools | 1 | 1 ✓ |
| STRHost-Tools | 2 | 2 ✓ |
| STROps-Tools | 0 | 0 ✓ |

---

## Tier 1 Lib File Inventory (wc -l per app)

| lib file | STRBuyers | STRHost | STROps | STRGuests | empire-console |
|---|---|---|---|---|---|
| lib/format.ts | 121 | 124 | 17 | — | — |
| lib/url-state.ts | 89 | 89 | 51 | — | — |
| lib/seo.ts | 312 | 233 | 125 | — | — |
| lib/email-gate.ts | MISSING | MISSING | MISSING | — | — |

*STRGuests and empire-console consume packages via workspace imports, not local copies.*

---

## Known Issues at Baseline (do not fix in Phase 3)

1. **@str/ui-funnel**: 3 snapshot tests fail (EmailCaptureCard, STRLedgerCTA mismatches). Pre-existing.
2. **STRGuests-Tools**: Build and 4 test files fail because packages have no `dist/` artifacts. Packages are source-only in this worktree; `pnpm build` on packages resolves this but is out of scope for P0.
