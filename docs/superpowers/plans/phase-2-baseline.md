# Phase 2 — Pre-extraction baseline

**Captured:** 2026-05-11  
**Branch:** `claude/phase-2-ui-pkgs-1778525182`  
**SHA at capture:** `e21d28b` (docs(plans): phase 2 — Tier 2 UI packages (chrome + funnel))  
**Working tree:** clean

---

## Git log (top 5)

```
e21d28b docs(plans): phase 2 — Tier 2 UI packages (chrome + funnel)
0ddd57e feat(strbuyers): Tier 2 #7 batch A — 25 more cities (75 of 219 covered)
7e6569c feat(strbuyers): Tier 2 #7 batch B — 25 more cities (mountain + interior + Northeast)
3c22d2b fix(@str/seo): make SiteConfig.emailGate optional + Phase 2 carry-forwards
527372d docs(phase-1): record post-extraction verification
```

---

## Package test results (pre-captured by controller)

| Package | Tests | Result |
|---|---|---|
| @str/format | 103/103 | PASS |
| @str/url-state | 76/76 | PASS |
| @str/seo | 86/86 | PASS |
| @str/email-gate | 11/11 | PASS |

---

## App build + test results

| App | Build | Pages | Tests | Notes |
|---|---|---|---|---|
| STROps-Tools | PASS | 105 | 34/34 (13 files) | — |
| STRGuests-Tools | PASS | — | 103/103 + 1 skipped (pre-captured) | — |
| STRBuyers-Tools | PASS | 244 | 84/84 (9 files) | — |
| STRHost-Tools | PASS | 73 | 73/73 (9 files) | OG images: 69 files |
| tools/empire-console | PASS | 140 | 68/68 (5 files) | — |

### STRBuyers server tests

| Suite | Tests | Result |
|---|---|---|
| server/tests/click.test.ts | 7/7 | PASS |

Note: `[click] db insert failed: connection refused` is expected stderr — the test covers graceful failure when DB is unavailable and still passes.

---

## Chrome + funnel component inventory

Line counts verified with `wc -l` against worktree files at SHA `e21d28b`.

### Chrome components

| Component | STROps | STRGuests | STRBuyers | STRHost |
|---|---|---|---|---|
| `Header.astro` | 22 | 61 | 61 | 61 |
| `Footer.astro` | 49 | 62 | 61 | 62 |
| `Sidebar.astro` | 20 | 27 | 27 | 27 |
| `Layout.astro` | MISSING | 90 | 84 | 92 |
| `FunnelBand.astro` | 9 | 25 | 38 | 26 |
| `Wordmark.astro` | MISSING | 74 | 72 | 72 |

All counts match plan table exactly.

**STROps gaps:** `Layout.astro` and `Wordmark.astro` are absent from STROps chrome/. Phase 3 STROps wiring will be substantially heavier than other apps.

### Funnel components

| Component | Location | STROps | STRGuests | STRBuyers | STRHost |
|---|---|---|---|---|---|
| `EmailCaptureCard.astro` | `funnel/` | 59 | 119 | 126 | 124 |
| `STRLedgerCTA.astro` | `funnel/` | 22 | 108 | 111 | 111 |
| `ClusterFunnelBlock.astro` | STROps: `funnel/` / others: `chrome/` | 26 | 60 | 73 | 60 |
| `AdSlot.astro` | `ads/` | 19 | 65 | 65 | 66 |

All counts match plan table exactly.

**ClusterFunnelBlock placement drift:** STROps keeps it in `funnel/` (semantically correct). STRGuests/STRBuyers/STRHost keep it in `chrome/` (legacy). The shared package will place it in `funnel/`. Phase 3 wiring for non-STROps apps will need import-path corrections.

**STRBuyers outlier:** `FunnelBand.astro` is 38 lines (vs 25–26 for others) and `ClusterFunnelBlock.astro` is 73 lines (vs 60). Wire via `<slot name="funnel-banner-override">` so city-page customizations are preserved.

---

## Concerns

None. All 5 apps build clean, all tests pass at baseline. Component inventory matches plan table with zero drift.

---

## Summary

| Item | Status |
|---|---|
| Working tree clean | YES |
| Packages (4) all passing | YES |
| STRGuests-Tools tests | 103/103 + 1 skip |
| STROps-Tools build + tests | 105 pages / 34 tests |
| STRBuyers-Tools build + tests | 244 pages / 84 tests |
| STRHost-Tools build + tests | 73 pages / 73 tests |
| tools/empire-console build + tests | 140 pages / 68 tests |
| STRBuyers server tests | 7/7 |
| Chrome inventory matches plan | YES |
| Funnel inventory matches plan | YES |
