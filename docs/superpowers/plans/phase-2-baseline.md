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

---

## Phase 2 complete — final verification

**Captured:** 2026-05-11 16:14 MDT  
**SHA:** `3d1b5d390b6834f5bbf1d4d7a62dff608bb83cc9`

| Package | Tests | Typecheck |
|---|---|---|
| @str/format | 103/103 | PASS |
| @str/url-state | 76/76 | PASS (TS errors fixed in Task 2) |
| @str/seo | 86/86 | PASS (TS errors fixed in Task 1) |
| @str/email-gate | 11/11 | PASS |
| @str/ui-chrome | 5/5 snapshots | PASS |
| @str/ui-funnel | 5/5 snapshots | PASS |

| App | Build | Pages | Tests | Visual | Notes |
|---|---|---|---|---|---|
| STROps-Tools | PASS | 105 | 34/34 | — | Unchanged (Phase 3) |
| STRGuests-Tools | PASS | 49 | 165/165 | 5/5 | Now on @str/ui-chrome (5/6 components) + @str/ui-funnel; AppSidebar STRGuests-specific |
| STRBuyers-Tools | PASS | 244 | 84/84 | — | Unchanged (Phase 3) |
| STRHost-Tools | PASS | 73 | 73/73 | — | Unchanged (Phase 3) |
| tools/empire-console | PASS | 140 | 68/68 | — | Unchanged |

**Phase 2 exit criteria met:**
- [x] @str/ui-chrome + @str/ui-funnel built, tested, documented
- [x] STRGuests pilot wired to consume both (with one app-specific AppSidebar override documented below)
- [x] STRGuests visual regression preserved (5/5 baselines match)
- [x] Phase 1 carry-forwards 1+2 fixed (TS errors in @str/seo + @str/url-state tests)
- [x] Other apps + empire-console untouched

**Decisions during Phase 2:**

1. **AppSidebar.astro architectural split:** STRGuests's pre-Phase-2 chrome/Sidebar rendered 2-line cards using `tools.json` (shortName + tagline per item). `@str/ui-chrome/Sidebar` renders 1-line items from `siteConfig.nav`. The data shapes differ; unifying would require enriching the shared component to accept either format. For Phase 2, STRGuests created `src/components/AppSidebar.astro` (preserves the 2-line card design, reads from tools.json). 5 of 6 chrome components are shared (Header, Footer, Layout, Wordmark, FunnelBand); Sidebar is STRGuests-specific. Phase 3 should consider enriching `@str/ui-chrome/Sidebar` to accept an `items` prop with optional richer fields, then unify all 4 apps.

2. **RelatedPosts.astro retained in-tree:** Only STRGuests + STRHost have it. Out of @str/ui-funnel scope this phase. Defer to Phase 3 if STRHost wiring needs it; consider extracting at that point.

3. **vitest config workaround for Astro 6 + experimental_AstroContainer:** vitest 2 ships Vite 5; Astro 6 ships Vite 7. `getViteConfig` from Astro crashes against the mismatch. Both ui-chrome and ui-funnel use a custom `vitest.config.ts` with @astrojs/compiler@4 transform + TypeScript stripping + createMetadata shim. Future packages should either copy this pattern OR upgrade to vitest 3 (Vite 6, closer to Astro 7).

**Carry-forwards for Phase 3 (STRBuyers/STRHost/STROps fanout):**

Open from Phase 1, still open:
- Decide @str/url-state dual-API canonicalization
- Decide @str/email-gate architecture (MySQL vs ESP-webhook adapter)
- Single SiteId source of truth (currently in @str/seo + @str/email-gate)
- buildItemList caller audit in STRBuyers/STRHost/STROps

New from Phase 2:
- **STROps chrome reconciliation:** STROps Header is 22 lines vs canonical 61. Header/Footer/Sidebar all need substantial uplift, NOT drop-in. Layout + Wordmark MISSING entirely on STROps. Phase 3 STROps wiring is 2-3x heavier than STRBuyers/STRHost wiring.
- **STRBuyers's outlier FunnelBand (38 lines) and ClusterFunnelBlock (73 lines):** wire via `<slot name="funnel-banner-override">` so its city-page customizations stay (or extract richer @str/ui-chrome variants).
- **AppSidebar pattern:** STRBuyers and STRHost may have similar tools-json-based sidebars that don't fit `@str/ui-chrome/Sidebar`. Audit each before wiring; either create per-site AppSidebar or enrich @str/ui-chrome/Sidebar.
- **vitest 3 upgrade consideration:** if Phase 3 adds more component packages, upgrade to vitest 3 in package.jsons rather than copying the workaround everywhere.

Phase 2 done. Ready for Phase 3: fan Tier 1+2 packages out to STRBuyers, STRHost, STROps.
