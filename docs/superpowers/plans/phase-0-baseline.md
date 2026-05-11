# Phase 0: Pre-Upgrade Baseline Evidence

**Captured:** 2026-05-10  
**Branch:** `claude/focused-cray-dddf7c`  
**SHA:** b6fefda  
**Git status:** clean (`nothing to commit, working tree clean`)  
**Purpose:** Record what "passing" looks like before any dependency upgrades, so post-upgrade parity can be confirmed.

---

## Summary

All 4 apps build and test successfully at baseline. E2E not run — requires live dev server.

| App | Build | Pages | OG/Assets | Tests | Test Files |
|---|---|---|---|---|---|
| STROps-Tools | PASS | 104 | 105 OG | 34/34 | 13/13 |
| STRGuests-Tools | PASS | 41 | 44 OG, 9 pins | 129/129 | 11/11 |
| STRBuyers-Tools | PASS | 232 | — | 84/84 | 9/9 |
| STRHost-Tools | PASS | 69 | 69 OG | 73/73 | 9/9 |

**Total tests: 320 passed, 0 failed.**

---

## STROps-Tools

- **Version:** 0.1.0  
- **Astro:** 4.16.x (installed: 4.16.19)  
- **Node package manager:** pnpm 10.0.0  
- **Install time:** ~12.9s (580 packages, 266 reused from cache)

### Build

```
pnpm build
```

- `prebuild` ran `scripts/build-og.mjs` → **105 OG images** in `public/og/`
- Astro static build: **104 pages built in 8.82s**
- Sitemap: `sitemap-index.xml` created
- Status: **PASS**

Notable: a vite "The build was canceled" log line appeared for a prior interrupted run — not an error in the actual build. Final output was `Complete!`.

### Tests (vitest run)

```
vitest v2.1.9 — 13 test files, 34 tests, 0 failed
Duration: 2.42s
```

| Test file | Tests |
|---|---|
| tests/lib/url-state.test.ts | 5 |
| tests/calc/linen-par.test.ts | 2 |
| tests/calc/smart-lock-codes.test.ts | 6 |
| tests/calc/restock.test.ts | 2 |
| tests/calc/cleaner-dispatch.test.ts | 3 |
| tests/calc/turnover.test.ts | 4 |
| tests/lib/format.test.ts | 4 |
| tests/calc/maintenance-schedule.test.ts | 2 |
| tests/lib/ics.test.ts | 1 |
| tests/lib/pdf-maintenance-schedule.test.ts | 1 |
| tests/lib/seo.test.ts | 2 |
| tests/lib/pdf-cleaner-dispatch.test.ts | 1 |
| tests/lib/pdf-base.test.ts | 1 |

Status: **34/34 PASS**

### E2E

Not run — requires dev server. Note in baseline doc only.

### Install warnings

`esbuild` and `sharp` build scripts ignored by pnpm (expected on Windows — harmless, these are native binaries that are prebuilt).

---

## STRGuests-Tools

- **Version:** 0.1.0  
- **Astro:** 6.2.x (installed: 6.3.1)  
- **Node package manager:** pnpm 9.6.0  
- **Install time:** ~18.2s (826 packages)

### Build

```
pnpm build
```

- Astro static build: **41 pages built in 7.37s**
- Pinterest pins: **9 files** in `dist/pins/` and `public/pins/`
- OG images: **44 files** in `dist/og/` and `public/og/`
- Sitemap: `sitemap-index.xml` created
- Status: **PASS**

### Tests (vitest run)

```
vitest v1.6.1 — 11 test files, 129 tests, 0 failed
Duration: 2.32s
```

| Test file | Tests |
|---|---|
| tests/og/pin.test.ts | 6 |
| tests/url-state.test.ts | 14 |
| tests/templates.test.ts | 6 |
| tests/email-gate.test.ts | 25 |
| tests/server/db.test.ts | 5 |
| tests/format.test.ts | 34 |
| tests/pdf/base.test.ts | 10 |
| tests/pdf/house-rules.test.ts | 6 |
| tests/pdf/welcome-book.test.ts | 6 |
| tests/pdf/checkin.test.ts | 7 |
| tests/pdf/wifi-sign.test.ts | 10 |

Status: **129/129 PASS**

### E2E

Not run — requires dev server.

---

## STRBuyers-Tools

- **Version:** 0.1.0  
- **Astro:** 6.2.x (installed: 6.3.1)  
- **Node package manager:** pnpm 9.6.0  
- **Install time:** ~13.9s (797 packages)

### Build

```
pnpm build
```

- Astro static build: **232 pages built in 5.58s**
- Sitemap: `sitemap-index.xml` created
- Status: **PASS**

Note: `build:og` script exists but is not part of `build` — OG images not generated in default build pipeline.

### Tests (vitest run)

```
vitest v1.6.1 — 9 test files, 84 tests, 0 failed
Duration: 914ms
```

| Test file | Tests |
|---|---|
| tests/market-score.test.ts | 6 |
| tests/comp-analyzer.test.ts | 6 |
| tests/dscr.test.ts | 9 |
| tests/furnishing-budget.test.ts | 6 |
| tests/cash-on-cash.test.ts | 6 |
| tests/year-1-cash.test.ts | 4 |
| tests/url-state.test.ts | 14 |
| tests/down-payment.test.ts | 5 |
| tests/format.test.ts | 28 |

Status: **84/84 PASS**

### Server tests (vitest run, server/vitest.config.ts)

```
vitest v1.6.1 — 1 test file, 7 tests, 0 failed
Duration: 1.07s
```

| Test file | Tests |
|---|---|
| tests/click.test.ts | 7 |

Status: **7/7 PASS**

### E2E

Not run — requires dev server.

---

## STRHost-Tools

- **Version:** 0.1.0  
- **Astro:** 6.2.x (installed: 6.2.2)  
- **Node package manager:** pnpm 9.6.0  
- **Install time:** ~13.4s (689 packages)

### Build

```
pnpm build
```

- Astro static build: **69 pages built in 5.82s**
- OG images: **69 files** in `dist/og/` and `public/og/`
- Sitemap: `sitemap-index.xml` created
- Status: **PASS**

### Tests (vitest run)

```
vitest v1.6.1 — 9 test files, 73 tests, 0 failed
Duration: 862ms
```

| Test file | Tests |
|---|---|
| tests/calc/cohost-split.test.ts | 4 |
| tests/calc/airbnb-fee.test.ts | 5 |
| tests/calc/profit.test.ts | 5 |
| tests/calc/break-even.test.ts | 4 |
| tests/calc/cleaning-fee.test.ts | 4 |
| tests/calc/revpar.test.ts | 4 |
| tests/calc/lodging-tax.test.ts | 5 |
| tests/url-state.test.ts | 14 |
| tests/format.test.ts | 28 |

Status: **73/73 PASS**

### E2E

Not run — requires dev server.

---

## Installed Dependency Versions (resolved)

These are the actual resolved versions at baseline — useful for post-upgrade diff.

| Package | STROps | STRGuests | STRBuyers | STRHost |
|---|---|---|---|---|
| astro | 4.16.19 | 6.3.1 | 6.3.1 | 6.2.2 |
| vitest | 2.1.9 | 1.6.1 | 1.6.1 | 1.6.1 |
| @playwright/test | 1.59.1 | 1.59.1 | 1.59.1 | 1.59.1 |
| typescript | 5.9.3 | 5.9.3 | 5.9.3 | 5.9.3 |
| tailwindcss | 3.4.19 | 3.4.19 | 3.4.19 | 3.4.19 |
| react | 18.3.1 | 18.3.1 | 18.3.1 | 18.3.1 |
| sharp | 0.33.5 | 0.33.5 | 0.33.5 | 0.33.5 |
| satori | 0.11.3 | 0.10.14 | 0.10.14 | 0.10.14 |

*All 4 apps resolve `@playwright/test` to the same version (latest compatible at capture time) despite different floor specifiers. Post-upgrade parity should still expect uniform resolution.*

*Note: STROps uses `satori 0.11.x` while the other 3 apps use `0.10.x`. Phase 0 upgrade will align this — direction TBD based on @astrojs/* compatibility.*

---

## Exit Criteria (Phase 0)

- [x] Working tree clean before baseline captured
- [x] All 4 apps: `pnpm install` succeeded
- [x] All 4 apps: `pnpm build` succeeded (exit 0, "Complete!")
- [x] All 4 apps: `pnpm test` all passed (320/320)
- [ ] E2E: not captured — requires live dev server (out of scope for baseline)

---

## STROps post-upgrade (Task 7 verification)

**Captured:** 2026-05-10 20:04 MDT
**SHA:** 262014329670b7fd25cf7507675a830a50395d31

- Astro: 6.3.1 (was 4.16.19)
- @astrojs/mdx: 5.x (was 3.1.x)
- @astrojs/react: 5.x (was 3.6.x)
- @astrojs/sitemap: 3.7.x (was 3.2.x)
- @astrojs/tailwind: 6.0.x (was 5.1.x)
- Build: PASS (104 pages — matches baseline)
- OG: PASS (105 images — matches baseline)
- Unit tests: 34/34 (matches baseline 34/34) — 13 files, vitest 2.1.9
- E2E: PASS — 24/24 tests passed (12.2s, chromium); dev server auto-started via Playwright webServer config

---

## Phase 0 complete — final verification

**Captured:** 2026-05-10 21:09 MDT
**SHA:** df7d1e717e2d9810e3ee8e95a2500cce17d778e1

| App | Astro | Vitest | Build | Unit tests | E2E | Notes |
|---|---|---|---|---|---|---|
| STROps-Tools | 6.3.1 (was 4.16.19) | 2.1.9 (unchanged) | PASS (104 pages) | 34/34 | 24/24 | Content collections + render() migrated |
| STRGuests-Tools | 6.3.1 (unchanged) | 2.1.9 (was 1.6.1) | PASS (41 pages) | 129/129 | not run | vitest only |
| STRBuyers-Tools | 6.3.1 (unchanged) | 2.1.9 (was 1.6.1) | PASS (232 pages) | 84/84 + 7/7 server | not run | vitest only |
| STRHost-Tools | 6.2.2 (unchanged) | 2.1.9 (was 1.6.1) | PASS (69 pages) | 73/73 | not run | vitest only |

**Phase 0 exit criteria met:**
- [x] STROps tests pass (34/34)
- [x] STROps e2e green (24/24)
- [x] STROps build succeeds (104 pages — matches baseline)
- [x] STROps OG generation works (105 images — matches baseline)
- [x] All 4 apps on vitest 2.1.9
- [x] Baseline test counts preserved across all 4 apps

**Known follow-ups for Phase 1:**
- pnpm workspace walk-up: parent repo's `pnpm-workspace.yaml` causes `pnpm install` to walk up unless `--ignore-workspace` is used. Phase 1 will create a worktree-level `pnpm-workspace.yaml` that explicitly lists only the 4 apps under this tree, eliminating the issue.
- `packageManager` drift: STROps declares `pnpm@10.0.0`; STRGuests/STRBuyers/STRHost declare `pnpm@9.6.0`. Pre-existing (not introduced by Phase 0) but must align before workspace creation or corepack will reject installs. Phase 1 must pick one version and reconcile all 4 apps.
- @astrojs/tailwind 6.0.2 has a peer-dep warning about Astro 6.x being outside its declared range (^3-5). Cosmetic only; package functions correctly. Will resolve when @astrojs/tailwind ships an updated peer range.
- Test coverage gap: `STROps-Tools/src/pages/blog/index.astro` derives slugs via `.map(p => ({ slug: p.id.replace(/\.mdx?$/, ''), ...p.data }))` but is not covered by any e2e spec. Add a `blog.spec.ts` asserting at least one `<a href="/blog/...">` link renders, to prevent silent regressions.
- Intentional broken-build commit: `c8be57c` (Astro dep bump) deliberately leaves the build broken; the next 2 commits complete the migration. If Phase 1 enables per-commit branch-protection CI, gate it to branch tip only — bisect-style green-per-commit checks would block this commit.

Phase 0 done. Ready for Phase 1: workspace + Tier 1 packages.
