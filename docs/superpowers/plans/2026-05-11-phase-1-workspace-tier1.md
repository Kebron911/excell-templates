# Phase 1: Workspace Reconciliation + Tier 1 Shared Packages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the partial pnpm workspace (created concurrently by another agent during Phase 0) with our planned shared-package architecture, then extract the first 4 shared packages — `@str/format`, `@str/url-state`, `@str/seo`, `@str/email-gate` — and wire STRGuests to consume them as the pilot.

**Architecture:** Repo is now a pnpm workspace with `pnpm-workspace.yaml` + root `pnpm-lock.yaml` already in place; apps stay at root level (NOT moved to `apps/` — that diverges from the original spec but matches the actual CI/deploy assumptions). Shared packages go under `packages/` at repo root. Each package emits `dist/` consumed via `workspace:*` protocol.

**Tech Stack:** pnpm 9.6.0 workspaces, TypeScript project references, Changesets, vitest 2.x, zod (for url-state schema validation), mysql2 (for email-gate persistence).

---

## Reference: Spec

Source design: [docs/superpowers/specs/2026-05-10-shared-packages-migration-design.md](../specs/2026-05-10-shared-packages-migration-design.md), Section 3 (architecture) + Section 4 (Tier 1 packages) + Section 6 (Phase 1).

## Reference: Phase 0 carry-forwards (from baseline doc + final review)

These five items must be addressed in Phase 1:

1. **`packageManager` drift:** STROps declares `pnpm@10.0.0`; the others declare `pnpm@9.6.0`. CI uses `pnpm/action-setup@v4 with version: 9`, so all apps must align to `pnpm@9.6.0`.
2. **pnpm workspace walk-up:** Already mitigated by parallel agent — root `pnpm-workspace.yaml` and root `pnpm-lock.yaml` now exist.
3. **`tools/empire-console` is on Astro 4.16:** The 5th workspace member is on the old stack. Out of scope for Phase 1 (separate concern; flag for a future Phase 0.5).
4. **`@astrojs/tailwind 6.0.2` peer-dep warning:** Cosmetic. No action.
5. **`blog/index.astro` test gap:** Pre-existing. Out of scope for Phase 1 (flag for Phase 2 visual-regression work).
6. **Intentional-broken-build commit policy:** CI runs on every push to main; if Phase 1 needs an intentionally-broken intermediate commit, document it and ensure CI is path-gated (already true: deploy workflows trigger only on per-app paths).

## Reference: New starting state (different from original spec)

Inspecting the live repo at `C:/Users/Kebron/Desktop/Claude OS/Wealth/Businesses/Excel-Templates`:

**Already exists** (parallel agent shipped between Phase 0 design and Phase 0 merge):
- `pnpm-workspace.yaml` listing 5 packages (4 STR-Tools apps + `tools/empire-console`)
- Root `pnpm-lock.yaml` (consolidated)
- All 4 deploy workflows in `.github/workflows/deploy-*.yml` triggered by per-app path changes

**Missing** (Phase 1 creates):
- Root `package.json` (optional but useful for shared dev scripts)
- `tsconfig.base.json` (shared TS config for packages)
- `.changeset/` (versioning)
- `packages/` directory and contents
- The 4 shared packages

**Apps stay at root** — DO NOT move to `apps/`. CI workflows reference `STROps-Tools/**` etc. Moving apps requires rewriting all 5 deploy workflows. YAGNI.

## Reference: Tier 1 package boundaries (from spec Section 4)

| Package | Surface | Deps | Reconciliation source |
|---|---|---|---|
| `@str/format` | `formatCurrency()`, `formatPercent()`, `formatDate()`, `formatNumber()`, `formatPhone()` etc. | none | STRGuests' 166-line version is canonical; merge any unique helpers from others; STROps' 17-line stub fully replaced |
| `@str/url-state` | `encodeState(obj)`, `decodeState(searchParams)`, `withState(url, obj)` | `zod` | Pick most feature-complete variant; verify all 4 calculators decode each other's links |
| `@str/seo` | `buildMeta({title, desc, canonical, og})`, `buildJsonLd(...)`, sitemap helpers | none | Per-site config injected; no hardcoded URLs |
| `@str/email-gate` | `<EmailGate>` component + `submitEmail({siteId, listSegment, email, source})` | `mysql2`, `zod` | STRGuests' implementation is the only one that exists today |

## File-by-file plan

### Net-new files

| File | Purpose |
|---|---|
| `package.json` (root) | Shared dev scripts, pin pnpm version, declare workspace |
| `tsconfig.base.json` | Shared compiler options for packages |
| `.changeset/config.json` | Changesets configuration |
| `.changeset/README.md` | How to use changesets |
| `packages/format/package.json` | Package manifest |
| `packages/format/src/index.ts` | Public API |
| `packages/format/src/currency.ts`, `date.ts`, `number.ts`, `phone.ts`, `percent.ts` | Implementation per concern |
| `packages/format/test/*.test.ts` | Unit tests per file |
| `packages/format/tsconfig.json` | Extends base; declarations on |
| `packages/url-state/package.json`, `src/index.ts`, `src/encode.ts`, `src/decode.ts`, `src/schema.ts`, `test/*.test.ts`, `tsconfig.json` | Same shape |
| `packages/seo/package.json`, `src/index.ts`, `src/meta.ts`, `src/jsonld.ts`, `src/sitemap.ts`, `src/site-config.ts` (the `SiteConfig` type), `test/*.test.ts`, `tsconfig.json` | Same shape |
| `packages/email-gate/package.json`, `src/index.ts`, `src/component.astro`, `src/submit.ts`, `src/db.ts`, `src/schema.ts`, `test/*.test.ts`, `tsconfig.json` | Server + Astro component |
| `docs/superpowers/plans/phase-1-baseline.md` | Pre-extraction parity baseline |

### Files modified per app (STRGuests pilot in this phase)

| File | Change |
|---|---|
| `STRGuests-Tools/package.json` | Add `@str/format`, `@str/url-state`, `@str/seo`, `@str/email-gate` as `workspace:*` deps |
| `STRGuests-Tools/src/lib/format.ts` | DELETE — replaced by `@str/format` |
| `STRGuests-Tools/src/lib/url-state.ts` | DELETE — replaced by `@str/url-state` |
| `STRGuests-Tools/src/lib/seo.ts` | DELETE — replaced by `@str/seo` |
| `STRGuests-Tools/src/lib/email-gate.ts` | DELETE — replaced by `@str/email-gate` |
| `STRGuests-Tools/src/**/*.{ts,astro}` | Update imports from `@/lib/format` → `@str/format` etc. |
| `STRGuests-Tools/src/data/site.config.ts` | NEW — declares `SiteConfig` for STRGuests |

### Files modified across all 4 apps (alignment task)

| File | Change |
|---|---|
| `STROps-Tools/package.json` | `packageManager: "pnpm@10.0.0"` → `"pnpm@9.6.0"` (align to others + CI) |

---

## Pre-flight

### Task P0: Verify post-Phase-0 baseline + capture Phase 1 starting evidence

**Files:**
- Create: `docs/superpowers/plans/phase-1-baseline.md`

**Why:** Phase 0 shipped to main with merge from a parallel agent. Capture exact pre-Phase-1 state so reconciliation work can prove it didn't regress anything.

- [ ] **Step 1: Confirm clean working tree on main**

```bash
git status
git log --oneline -5
```
Expected: working tree clean; latest commit `d1948d7 Merge remote-tracking branch 'origin/main'` (or newer if more was pushed since).

- [ ] **Step 2: Build + test all 4 apps + empire-console**

```bash
for d in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools tools/empire-console; do
  echo "=== $d ==="
  cd "$d"
  pnpm install --frozen-lockfile 2>&1 | tail -3
  pnpm build 2>&1 | grep -E "page\(s\) built|error" | tail -3
  pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2
  cd - > /dev/null
done
cd STRBuyers-Tools && pnpm server:test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ..
```

Expected (per post-Phase-0 verified state):
- STROps: 105 pages, 34/34 tests
- STRGuests: 48 pages, 129/129 tests
- STRBuyers: 235 pages, 84/84 tests + 7/7 server tests
- STRHost: 73 pages, 73/73 tests
- empire-console: TBD (capture whatever it is — first time it's in our scope)

- [ ] **Step 3: Capture per-app dependency snapshot for Tier 1 file reconciliation**

```bash
for app in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools; do
  echo "=== $app ==="
  echo "-- format.ts --"; wc -l "$app/src/lib/format.ts" 2>&1
  echo "-- url-state.ts --"; wc -l "$app/src/lib/url-state.ts" 2>&1
  echo "-- seo.ts --"; wc -l "$app/src/lib/seo.ts" 2>&1
  echo "-- email-gate.ts --"; wc -l "$app/src/lib/email-gate.ts" 2>&1
done
```

Captures the line counts for the 4 files we'll reconcile. Useful for verifying nothing got lost during extraction.

- [ ] **Step 4: Write baseline doc**

Write `docs/superpowers/plans/phase-1-baseline.md`:

```markdown
# Phase 1 Baseline (post-Phase-0, pre-Phase-1)

**Captured:** <date> <time> MDT
**SHA:** <git rev-parse HEAD>

## Apps state (build + test parity targets)

| App | Build | Pages | Tests | Server Tests |
|---|---|---|---|---|
| STROps-Tools | PASS | <N> | <N>/<N> | — |
| STRGuests-Tools | PASS | <N> | <N>/<N> | — |
| STRBuyers-Tools | PASS | <N> | <N>/<N> | <N>/<N> |
| STRHost-Tools | PASS | <N> | <N>/<N> | — |
| tools/empire-console | <result> | <N> | <N>/<N> | — |

## Tier 1 file inventory (to be extracted into packages/)

| File | STROps lines | STRGuests lines | STRBuyers lines | STRHost lines |
|---|---|---|---|---|
| src/lib/format.ts | <N> | <N> | <N> | <N> |
| src/lib/url-state.ts | <N> | <N> | <N> | <N> |
| src/lib/seo.ts | <N> | <N> | <N> | <N> |
| src/lib/email-gate.ts | <N or MISSING> | <N> | <N or MISSING> | <N or MISSING> |

## Workspace state

- pnpm-workspace.yaml: present at repo root with 5 packages
- Root pnpm-lock.yaml: present
- Root package.json: ABSENT (Phase 1 will create)
- tsconfig.base.json: ABSENT (Phase 1 will create)
- .changeset/: ABSENT (Phase 1 will create)
- packages/: ABSENT (Phase 1 will create)

## packageManager fields

- STROps-Tools: pnpm@10.0.0 (must align to 9.6.0 in Phase 1)
- STRGuests-Tools: pnpm@9.6.0
- STRBuyers-Tools: pnpm@9.6.0
- STRHost-Tools: pnpm@9.6.0
- tools/empire-console: <none>

CI uses `pnpm/action-setup@v4 with version: 9`, so 9.x is the target.
```

Fill in actuals from Steps 2-3.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/phase-1-baseline.md
git commit -m "docs(phase-1): capture pre-extraction baseline for parity verification"
```

---

## Workspace reconciliation

### Task 1: Align `packageManager` field across all 4 apps to pnpm@9.6.0

**Files:**
- Modify: `STROps-Tools/package.json`

**Why:** STROps was bumped to `pnpm@10.0.0` during Phase 0's reinstall. CI uses pnpm 9. Mismatch will cause corepack/CI failures in Phase 1+ as the workspace is exercised.

- [ ] **Step 1: Edit STROps package.json**

Use Read tool first to get current state, then Edit:

```json
"packageManager": "pnpm@10.0.0"
```

Change to:

```json
"packageManager": "pnpm@9.6.0"
```

- [ ] **Step 2: Verify all 4 apps now match**

```bash
for app in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools; do
  echo "=== $app ==="
  grep packageManager "$app/package.json"
done
```

All 4 must read `"packageManager": "pnpm@9.6.0"`.

- [ ] **Step 3: Reinstall STROps with the aligned version + verify build/tests still green**

```bash
cd STROps-Tools
rm -rf node_modules
pnpm install --frozen-lockfile 2>&1 | tail -5
pnpm build 2>&1 | grep "page\(s\) built" | tail -1
pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2
cd ..
```

Expected: build succeeds, 105 pages, 34/34 tests.

- [ ] **Step 4: Commit**

```bash
git add STROps-Tools/package.json
git commit -m "chore(strops): align packageManager to pnpm@9.6.0

Matches the other 3 apps and CI's pnpm/action-setup@v4 (version: 9).
STROps was bumped to pnpm@10 during Phase 0's reinstall; reverting now
prevents corepack/CI failures as the workspace gets exercised in Phase 1."
```

---

### Task 2: Create root `package.json` + `tsconfig.base.json` + `.changeset/`

**Files:**
- Create: `package.json` (repo root)
- Create: `tsconfig.base.json` (repo root)
- Create: `.changeset/config.json`
- Create: `.changeset/README.md`

- [ ] **Step 1: Create root package.json**

Write `package.json` at repo root:

```json
{
  "name": "str-tools-monorepo",
  "private": true,
  "version": "0.0.0",
  "packageManager": "pnpm@9.6.0",
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm -r build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.7",
    "typescript": "^5.5.3"
  },
  "engines": {
    "node": ">=22",
    "pnpm": ">=9.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.base.json**

Write `tsconfig.base.json` at repo root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true
  }
}
```

- [ ] **Step 3: Install changesets at root**

```bash
pnpm install --workspace-root 2>&1 | tail -10
```

(`--workspace-root` installs the root package.json's deps without trying to install each workspace package's deps simultaneously.)

- [ ] **Step 4: Initialize changesets**

```bash
pnpm changeset init 2>&1 | tail -10
```

This creates `.changeset/config.json` and `.changeset/README.md`.

- [ ] **Step 5: Edit `.changeset/config.json` to suit private packages**

After init, modify `.changeset/config.json` so `access` is `"restricted"` and ignore field includes the apps (which are private and don't get versioned by changesets):

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.3/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["strops-tools", "strguests-tools", "strbuyers-tools", "strhost-tools", "empire-console"]
}
```

The `ignore` array prevents changesets from versioning the apps (they're private, deployed via per-app GitHub Actions, not via npm publish).

- [ ] **Step 6: Verify**

```bash
ls .changeset/ 2>&1
cat package.json | head -10
cat tsconfig.base.json | head -10
```

- [ ] **Step 7: Commit**

```bash
git add package.json tsconfig.base.json .changeset/ pnpm-lock.yaml
git commit -m "feat(workspace): scaffold root tooling for shared packages

- Root package.json with pnpm-recursive build/test/typecheck scripts
- tsconfig.base.json with strict TypeScript settings for packages
- Changesets initialized; apps ignored (deployed via GitHub Actions, not npm)"
```

---

## Tier 1 package: `@str/format`

### Task 3: Scaffold `@str/format` package skeleton

**Files:**
- Create: `packages/format/package.json`
- Create: `packages/format/tsconfig.json`
- Create: `packages/format/src/index.ts` (empty re-export hub)
- Create: `packages/format/README.md`

- [ ] **Step 1: Create package.json**

Write `packages/format/package.json`:

```json
{
  "name": "@str/format",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vitest": "^2.1.1"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

Write `packages/format/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create empty index.ts**

Write `packages/format/src/index.ts`:

```ts
// Re-exports added per source module in Task 4.
export {};
```

- [ ] **Step 4: Create README.md**

Write `packages/format/README.md`:

```markdown
# @str/format

Number, date, currency, and string formatters shared across STR-Tools apps.

Pure functions, zero dependencies. 100% unit-test coverage required.

## Usage

\`\`\`ts
import { formatCurrency, formatPercent } from '@str/format';

formatCurrency(1234.5);  // "$1,234.50"
formatPercent(0.125);    // "12.5%"
\`\`\`
```

- [ ] **Step 5: Install (creates symlinks)**

```bash
pnpm install 2>&1 | tail -5
```

- [ ] **Step 6: Verify build works (compiles empty index.ts to dist/)**

```bash
cd packages/format
pnpm build 2>&1 | tail -5
ls dist/ 2>&1
cd ../..
```

Expected: `dist/index.js` and `dist/index.d.ts` exist.

- [ ] **Step 7: Commit**

```bash
git add packages/format/ pnpm-lock.yaml
git commit -m "feat(packages): scaffold @str/format package skeleton

Empty exports + build pipeline verified. Implementation in next task."
```

---

### Task 4: Reconcile + extract format.ts variants into `@str/format`

**Files:**
- Read: `STRGuests-Tools/src/lib/format.ts` (canonical baseline, 166 lines)
- Read: `STRBuyers-Tools/src/lib/format.ts`
- Read: `STRHost-Tools/src/lib/format.ts`
- Read: `STROps-Tools/src/lib/format.ts` (17-line stub, ignore)
- Create: `packages/format/src/currency.ts`
- Create: `packages/format/src/date.ts`
- Create: `packages/format/src/number.ts`
- Create: `packages/format/src/percent.ts`
- Create: `packages/format/src/phone.ts`
- Modify: `packages/format/src/index.ts` (re-export everything)
- Create: `packages/format/test/currency.test.ts`
- Create: `packages/format/test/date.test.ts`
- Create: `packages/format/test/number.test.ts`
- Create: `packages/format/test/percent.test.ts`
- Create: `packages/format/test/phone.test.ts`

**Reconciliation strategy:** Read all 4 apps' format.ts files. STRGuests is the canonical baseline (richest). For each function in each variant, decide:
- Already in baseline → keep baseline version (assume baseline is best)
- Not in baseline but present in another variant AND used → port over
- Not in baseline and apparently unused anywhere → drop (YAGNI)

- [ ] **Step 1: Read all 4 format.ts files**

Use Read tool on each:
- `STRGuests-Tools/src/lib/format.ts`
- `STRBuyers-Tools/src/lib/format.ts`
- `STRHost-Tools/src/lib/format.ts`
- `STROps-Tools/src/lib/format.ts`

Make notes about: what functions exist in each, which exist in multiple, which differ in behavior/signature.

- [ ] **Step 2: Write failing tests first (TDD)**

Write tests covering every function the union surface should have. Example for `packages/format/test/currency.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../src/currency';

describe('formatCurrency', () => {
  it('formats whole dollars with cents', () => {
    expect(formatCurrency(1234)).toBe('$1,234.00');
  });

  it('formats fractional amounts', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles negative amounts', () => {
    expect(formatCurrency(-500.5)).toBe('-$500.50');
  });

  it('rounds at the cent boundary', () => {
    expect(formatCurrency(1.999)).toBe('$2.00');
  });

  it('supports a noFraction option for whole-dollar display', () => {
    expect(formatCurrency(1234, { noFraction: true })).toBe('$1,234');
  });
});
```

Replicate this style for `date`, `number`, `percent`, `phone` test files. Each function exposed by `@str/format` MUST have at least 5 tests covering happy path, zero, negative, edge boundaries, and a configurable option if any.

- [ ] **Step 3: Run tests to verify they fail**

```bash
cd packages/format
pnpm test 2>&1 | tail -10
cd ../..
```

Expected: all tests fail (functions don't exist yet).

- [ ] **Step 4: Implement currency.ts**

Write `packages/format/src/currency.ts` based on STRGuests' implementation merged with any unique helpers from the other variants. Must satisfy ALL test cases from Step 2.

Sample structure (replace with actual STRGuests implementation):

```ts
export interface FormatCurrencyOptions {
  noFraction?: boolean;
  currency?: string; // defaults to 'USD'
  locale?: string; // defaults to 'en-US'
}

export function formatCurrency(value: number, opts: FormatCurrencyOptions = {}): string {
  const { noFraction = false, currency = 'USD', locale = 'en-US' } = opts;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: noFraction ? 0 : 2,
    maximumFractionDigits: noFraction ? 0 : 2,
  }).format(value);
}
```

- [ ] **Step 5: Implement remaining files**

Repeat Step 4 for `date.ts`, `number.ts`, `percent.ts`, `phone.ts`. Each file is one concern.

- [ ] **Step 6: Update index.ts to re-export everything**

Write `packages/format/src/index.ts`:

```ts
export * from './currency';
export * from './date';
export * from './number';
export * from './percent';
export * from './phone';
```

- [ ] **Step 7: Run tests until all pass**

```bash
cd packages/format
pnpm test 2>&1 | grep -E "Test Files|Tests" | head -3
cd ../..
```

Expected: all tests pass.

- [ ] **Step 8: Build the package**

```bash
cd packages/format
pnpm build 2>&1 | tail -5
ls dist/ 2>&1
cd ../..
```

Expected: `dist/` contains `.js` and `.d.ts` files for index, currency, date, number, percent, phone.

- [ ] **Step 9: Commit**

```bash
git add packages/format/
git commit -m "feat(packages): @str/format with currency/date/number/percent/phone

Reconciled from STRGuests (canonical), STRBuyers, STRHost, STROps variants.
Pure functions, zero dependencies, full unit test coverage.
Apps wire up in subsequent tasks."
```

---

## Tier 1 package: `@str/url-state`

### Task 5: Scaffold + extract `@str/url-state`

**Files:**
- Read: all 4 apps' `src/lib/url-state.ts`
- Create: `packages/url-state/package.json`, `tsconfig.json`
- Create: `packages/url-state/src/index.ts`, `encode.ts`, `decode.ts`, `schema.ts`
- Create: `packages/url-state/test/encode.test.ts`, `decode.test.ts`, `roundtrip.test.ts`
- Create: `packages/url-state/README.md`

**Why:** Calculator state encoding/decoding is shared across all 4 apps (each has a calculator). All 4 variants exist and have drifted; consolidate into one canonical implementation.

- [ ] **Step 1: Scaffold package skeleton (mirror Task 3 pattern)**

Write `packages/url-state/package.json`:

```json
{
  "name": "@str/url-state",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vitest": "^2.1.1"
  }
}
```

Write `packages/url-state/tsconfig.json` (same shape as format/tsconfig.json).

- [ ] **Step 2: Read all 4 url-state.ts variants**

Use Read tool on each app's `src/lib/url-state.ts`. Note: STRGuests, STRBuyers, STRHost are within tight line-count range (89-90 lines); STROps is 51 lines (older).

- [ ] **Step 3: Write failing tests covering encode/decode/roundtrip**

Write `packages/url-state/test/roundtrip.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { encodeState, decodeState } from '../src/index';
import { z } from 'zod';

const TestSchema = z.object({
  price: z.number(),
  bedrooms: z.number().int(),
  amenities: z.array(z.string()),
  isPet: z.boolean(),
});

describe('encode/decode roundtrip', () => {
  it('preserves a complete state object', () => {
    const original = { price: 250000, bedrooms: 3, amenities: ['pool', 'wifi'], isPet: true };
    const encoded = encodeState(original);
    const params = new URLSearchParams(encoded);
    const decoded = decodeState(params, TestSchema);
    expect(decoded).toEqual(original);
  });

  it('handles empty arrays', () => {
    const original = { price: 100000, bedrooms: 1, amenities: [], isPet: false };
    const encoded = encodeState(original);
    const decoded = decodeState(new URLSearchParams(encoded), TestSchema);
    expect(decoded).toEqual(original);
  });

  it('returns null for invalid encoded state', () => {
    const params = new URLSearchParams('garbage=data');
    const decoded = decodeState(params, TestSchema);
    expect(decoded).toBeNull();
  });

  it('returns null for malformed JSON in state param', () => {
    const params = new URLSearchParams('s=not-base64-or-json');
    const decoded = decodeState(params, TestSchema);
    expect(decoded).toBeNull();
  });
});

describe('schema validation', () => {
  it('rejects state that does not match schema', () => {
    const bad = { price: 'not-a-number', bedrooms: 3, amenities: [], isPet: false };
    const encoded = encodeState(bad as never);
    const decoded = decodeState(new URLSearchParams(encoded), TestSchema);
    expect(decoded).toBeNull();
  });
});
```

Run to verify failures:
```bash
cd packages/url-state && pnpm test 2>&1 | tail -10 && cd ../..
```

- [ ] **Step 4: Implement based on the most feature-complete variant**

Pick the canonical variant (STRGuests is reasonable default unless one of the others has provably better edge handling). Implement `src/encode.ts`, `src/decode.ts`, `src/schema.ts` using zod for runtime schema validation.

The public surface should be:
- `encodeState<T>(state: T): string` — returns a query-string fragment (e.g., `s=eyJ...`)
- `decodeState<T>(params: URLSearchParams, schema: z.ZodType<T>): T | null`
- `withState<T>(url: string, state: T): string` — appends encoded state to URL

- [ ] **Step 5: Run tests until green**

```bash
cd packages/url-state && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
```

- [ ] **Step 6: Cross-app compatibility check**

For each pair of apps, encode a sample state in one app's variant and decode in another. This catches encoding-format drift. (Defer the actual app wiring to Task 9; this is a manual check by reading the encode/decode logic in each app's variant and confirming the new package matches the most lenient encoding format.)

- [ ] **Step 7: Build + commit**

```bash
cd packages/url-state && pnpm build 2>&1 | tail -3 && cd ../..
git add packages/url-state/ pnpm-lock.yaml
git commit -m "feat(packages): @str/url-state for calculator state in URL params

Encode/decode/roundtrip with zod schema validation.
Reconciled from 4 app variants; STRGuests baseline preserved."
```

---

## Tier 1 package: `@str/seo`

### Task 6: Scaffold + extract `@str/seo` with site-config injection

**Files:**
- Read: all 4 apps' `src/lib/seo.ts`
- Create: `packages/seo/package.json`, `tsconfig.json`
- Create: `packages/seo/src/index.ts`, `meta.ts`, `jsonld.ts`, `sitemap.ts`, `site-config.ts`
- Create: `packages/seo/test/meta.test.ts`, `jsonld.test.ts`, `sitemap.test.ts`
- Create: `packages/seo/README.md`

**Critical design point:** `site-config.ts` exports the `SiteConfig` interface that EACH app must populate. The `seo` functions accept a `SiteConfig` arg — no hardcoded URLs, brand names, or list IDs.

- [ ] **Step 1: Scaffold package skeleton (mirror Task 3)**

Use the same shape as @str/format. Notable: this package depends on `@str/format` for any number/date formatting in JSON-LD (e.g., article dates).

```json
{
  "name": "@str/seo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@str/format": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vitest": "^2.1.1"
  }
}
```

- [ ] **Step 2: Define SiteConfig interface in src/site-config.ts**

Write `packages/seo/src/site-config.ts`:

```ts
export type SiteId = 'guests' | 'buyers' | 'host' | 'ops';

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface SiteConfig {
  siteId: SiteId;
  brand: {
    name: string;
    wordmark: string;
    tagline: string;
    primaryColor: string;
    logo: string;
  };
  url: {
    canonical: string;       // e.g., 'https://strguests.tools'
    sitemap?: string[];
  };
  emailGate: {
    listId: string;
    welcomeSubject: string;
  };
  analytics: {
    ga4Id?: string;
  };
  nav: NavItem[];
  footer: { sections: FooterSection[] };
}
```

- [ ] **Step 3: Read all 4 apps' seo.ts variants**

Note line counts and surface area. STRGuests has 156 lines; STRBuyers has 208 lines (most feature-complete); STRHost 142; STROps 105. STRBuyers' superset is likely best baseline.

- [ ] **Step 4: Write failing tests for buildMeta, buildJsonLd, sitemap helpers**

Tests must use a fixture SiteConfig and verify outputs are deterministic and per-site-correct. Sample for `meta.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildMeta } from '../src/meta';
import type { SiteConfig } from '../src/site-config';

const fixtureSite: SiteConfig = {
  siteId: 'guests',
  brand: { name: 'STR Guests Tools', wordmark: 'STR Guests', tagline: 'Free tools for hosts', primaryColor: '#000', logo: '/logo.svg' },
  url: { canonical: 'https://strguests.tools' },
  emailGate: { listId: 'guests-main', welcomeSubject: 'Welcome' },
  analytics: {},
  nav: [],
  footer: { sections: [] },
};

describe('buildMeta', () => {
  it('emits absolute canonical from site URL + path', () => {
    const meta = buildMeta(fixtureSite, { title: 'Test', desc: 'Test desc', path: '/foo' });
    expect(meta.canonical).toBe('https://strguests.tools/foo');
  });

  it('uses site brand name in og:site_name', () => {
    const meta = buildMeta(fixtureSite, { title: 'Test', desc: 'Test desc', path: '/' });
    expect(meta.ogSiteName).toBe('STR Guests Tools');
  });

  // ... more cases for og:image fallback, twitter:card, JSON-LD presence, etc.
});
```

Replicate for jsonld.test.ts and sitemap.test.ts.

Run to verify failures:
```bash
cd packages/seo && pnpm test 2>&1 | tail -10 && cd ../..
```

- [ ] **Step 5: Implement based on STRBuyers' superset, parameterized by SiteConfig**

Replace every hardcoded URL/brand string in the source with reads from the `SiteConfig` arg.

- [ ] **Step 6: Run tests until green**

```bash
cd packages/seo && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
```

- [ ] **Step 7: Build + commit**

```bash
cd packages/seo && pnpm build 2>&1 | tail -3 && cd ../..
git add packages/seo/ pnpm-lock.yaml
git commit -m "feat(packages): @str/seo with per-site config injection

SiteConfig type + buildMeta/buildJsonLd/sitemap helpers.
Reconciled from STRBuyers (canonical, most complete), parameterized for all 4 sites.
No hardcoded URLs/brand strings."
```

---

## Tier 1 package: `@str/email-gate`

### Task 7: Scaffold + extract `@str/email-gate` with multi-site segmentation

**Files:**
- Read: `STRGuests-Tools/src/lib/email-gate.ts` (only existing implementation)
- Create: `packages/email-gate/package.json`, `tsconfig.json`
- Create: `packages/email-gate/src/index.ts`, `submit.ts`, `db.ts`, `schema.ts`
- Create: `packages/email-gate/src/EmailGate.astro`
- Create: `packages/email-gate/test/submit.test.ts`, `schema.test.ts`
- Create: `packages/email-gate/test/db.integration.test.ts`
- Create: `packages/email-gate/README.md`

**Critical design points:**
- Surface adds `siteId` parameter for per-site segmentation (not in STRGuests' current implementation, since it had only one consumer).
- DB integration test uses real MySQL via testcontainers (per spec Section 7) — NOT sqlite shim.
- Astro component (`<EmailGate>`) wraps the submit action.

- [ ] **Step 1: Scaffold package skeleton**

```json
{
  "name": "@str/email-gate",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./EmailGate.astro": "./src/EmailGate.astro"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:integration": "vitest run -c vitest.integration.config.ts",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@str/format": "workspace:*",
    "mysql2": "^3.10.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@testcontainers/mysql": "^10.13.0",
    "typescript": "^5.5.3",
    "vitest": "^2.1.1"
  }
}
```

Astro component is exposed as a sub-export (`@str/email-gate/EmailGate.astro`) and is consumed via Astro import — NOT compiled by tsc.

- [ ] **Step 2: Read STRGuests' email-gate.ts**

Identify: how does it submit? What's the DB schema? What validation does it apply?

- [ ] **Step 3: Define schema**

Write `packages/email-gate/src/schema.ts`:

```ts
import { z } from 'zod';

export const SubmitInputSchema = z.object({
  siteId: z.enum(['guests', 'buyers', 'host', 'ops']),
  listSegment: z.string().min(1).max(64),
  email: z.string().email().max(254),
  source: z.string().max(128).optional(),
});

export type SubmitInput = z.infer<typeof SubmitInputSchema>;

export const SubmitResultSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), id: z.number().int() }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

export type SubmitResult = z.infer<typeof SubmitResultSchema>;
```

- [ ] **Step 4: Write failing tests for submit() input validation**

Write `packages/email-gate/test/submit.test.ts`. Test:
- Rejects bad siteId
- Rejects malformed email
- Rejects empty listSegment
- Trims whitespace
- Returns shape matching SubmitResultSchema

(For unit tests, mock the DB layer via dependency injection. The DB integration test in Step 6 covers actual persistence.)

- [ ] **Step 5: Implement submit + db**

`src/db.ts`: MySQL connection pool factory. `src/submit.ts`: the public function — accepts `SubmitInput`, validates, writes to MySQL.

- [ ] **Step 6: Write failing integration test against real MySQL via testcontainers**

Write `packages/email-gate/test/db.integration.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GenericContainer, StartedTestContainer } from '@testcontainers/mysql';
import { createPool } from '../src/db';
import { submit } from '../src/submit';

let container: StartedTestContainer;
let pool: ReturnType<typeof createPool>;

beforeAll(async () => {
  container = await new GenericContainer('mysql:8')
    .withEnvironment({ MYSQL_ROOT_PASSWORD: 'test', MYSQL_DATABASE: 'emailgate' })
    .withExposedPorts(3306)
    .start();

  pool = createPool({
    host: container.getHost(),
    port: container.getMappedPort(3306),
    user: 'root',
    password: 'test',
    database: 'emailgate',
  });

  // Apply schema
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS email_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      site_id VARCHAR(16) NOT NULL,
      list_segment VARCHAR(64) NOT NULL,
      email VARCHAR(254) NOT NULL,
      source VARCHAR(128),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_site_email (site_id, email),
      UNIQUE KEY unique_site_email (site_id, email)
    )
  `);
}, 60_000);

afterAll(async () => {
  await pool.end();
  await container.stop();
});

describe('email-gate persistence (real MySQL)', () => {
  it('inserts a new subscriber per (siteId, email) pair', async () => {
    const result = await submit({ siteId: 'guests', listSegment: 'main', email: 'a@example.com' }, pool);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.id).toBeGreaterThan(0);
  });

  it('segments by siteId — same email on different sites is allowed', async () => {
    const r1 = await submit({ siteId: 'guests', listSegment: 'main', email: 'b@example.com' }, pool);
    const r2 = await submit({ siteId: 'buyers', listSegment: 'main', email: 'b@example.com' }, pool);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
  });

  it('idempotent — re-submitting same (siteId, email) returns the existing row', async () => {
    const r1 = await submit({ siteId: 'host', listSegment: 'main', email: 'c@example.com' }, pool);
    const r2 = await submit({ siteId: 'host', listSegment: 'main', email: 'c@example.com' }, pool);
    expect(r1.ok && r2.ok).toBe(true);
    if (r1.ok && r2.ok) expect(r1.id).toBe(r2.id);
  });
});
```

Plus a `vitest.integration.config.ts` that points only at `*.integration.test.ts` files and bumps the timeout to 60s for container startup.

- [ ] **Step 7: Implement until both unit and integration tests pass**

Unit tests run via `pnpm test`. Integration tests run separately via `pnpm test:integration` (requires Docker).

- [ ] **Step 8: Create EmailGate.astro component**

Write `packages/email-gate/src/EmailGate.astro` based on STRGuests' existing component, parameterized by `siteId` prop.

- [ ] **Step 9: Build + commit**

```bash
cd packages/email-gate && pnpm build 2>&1 | tail -3 && cd ../..
git add packages/email-gate/ pnpm-lock.yaml
git commit -m "feat(packages): @str/email-gate with multi-site segmentation

Submit + DB layer + Astro component, with per-(siteId, email) uniqueness.
Unit tests for input validation + integration tests via @testcontainers/mysql.
EmailGate.astro is exported as a sub-path for Astro consumers."
```

---

## STRGuests pilot wiring

### Task 8: Wire STRGuests to consume the 4 packages + visual baseline

**Files:**
- Modify: `STRGuests-Tools/package.json` (add the 4 `workspace:*` deps)
- Create: `STRGuests-Tools/src/data/site.config.ts` (the SiteConfig instance for STRGuests)
- Modify: every file in `STRGuests-Tools/src/**/*.{ts,astro}` that imports from `@/lib/format`, `@/lib/url-state`, `@/lib/seo`, or `@/lib/email-gate`
- Delete: `STRGuests-Tools/src/lib/format.ts`, `url-state.ts`, `seo.ts`, `email-gate.ts`

- [ ] **Step 1: Add package deps to STRGuests' package.json**

Use Edit tool. In `dependencies`, add:

```json
"@str/format": "workspace:*",
"@str/url-state": "workspace:*",
"@str/seo": "workspace:*",
"@str/email-gate": "workspace:*"
```

- [ ] **Step 2: Reinstall**

```bash
pnpm install 2>&1 | tail -10
```

- [ ] **Step 3: Create site.config.ts for STRGuests**

Write `STRGuests-Tools/src/data/site.config.ts`:

```ts
import type { SiteConfig } from '@str/seo';

export const siteConfig: SiteConfig = {
  siteId: 'guests',
  brand: {
    name: 'STR Guests Tools',
    wordmark: 'STR Guests',
    tagline: '<<TAGLINE FROM EXISTING STRGUESTS COPY>>',
    primaryColor: '<<HEX FROM TAILWIND CONFIG>>',
    logo: '/brand/logo.svg',
  },
  url: {
    canonical: 'https://strguests.tools',
  },
  emailGate: {
    listId: 'guests-main',
    welcomeSubject: '<<EXISTING SUBJECT FROM STRGUESTS EMAIL-GATE>>',
  },
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID,
  },
  nav: [
    // Port from existing STRGuests Header.astro
  ],
  footer: {
    sections: [
      // Port from existing STRGuests Footer.astro
    ],
  },
};
```

Replace `<<...>>` placeholders by reading the existing STRGuests files.

- [ ] **Step 4: Find all import sites**

```bash
cd STRGuests-Tools
grep -rn "from '@/lib/format'" src/ 2>&1
grep -rn "from '@/lib/url-state'" src/ 2>&1
grep -rn "from '@/lib/seo'" src/ 2>&1
grep -rn "from '@/lib/email-gate'" src/ 2>&1
cd ..
```

Or use the Grep tool. Capture the file list.

- [ ] **Step 5: Update each import**

Per import site, change `from '@/lib/<name>'` to `from '@str/<name>'`. For the seo and email-gate cases, add `siteConfig` import and pass it to functions:

```ts
// Before:
import { buildMeta } from '@/lib/seo';
const meta = buildMeta({ title: 'Foo' });

// After:
import { buildMeta } from '@str/seo';
import { siteConfig } from '@/data/site.config';
const meta = buildMeta(siteConfig, { title: 'Foo', path: Astro.url.pathname });
```

This is the API change — every call site of buildMeta now passes siteConfig + path explicitly.

- [ ] **Step 6: Delete old lib files**

```bash
git rm STRGuests-Tools/src/lib/format.ts \
       STRGuests-Tools/src/lib/url-state.ts \
       STRGuests-Tools/src/lib/seo.ts \
       STRGuests-Tools/src/lib/email-gate.ts
```

- [ ] **Step 7: Build + tests**

```bash
cd STRGuests-Tools
pnpm typecheck 2>&1 | tail -10
pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2
pnpm build 2>&1 | grep "page\(s\) built" | tail -1
cd ..
```

Expected: typecheck clean, tests 129/129, build still 48 pages (matches Phase 1 baseline).

- [ ] **Step 8: Manual smoke check by reading 3 representative pages' rendered HTML**

```bash
cd STRGuests-Tools
pnpm preview &
PID=$!
sleep 3
curl -s http://localhost:4321/ | grep -E "<title>|canonical" | head -5
curl -s http://localhost:4321/welcome-book | grep -E "<title>|canonical" | head -5
curl -s http://localhost:4321/check-in-instructions | grep -E "<title>|canonical" | head -5
kill $PID
cd ..
```

Confirm `<title>` tags and `<link rel="canonical">` are populated correctly (proves siteConfig is wired through).

- [ ] **Step 9: Commit**

```bash
git add STRGuests-Tools/
git commit -m "feat(strguests): consume @str/format @str/url-state @str/seo @str/email-gate

Site config moved to src/data/site.config.ts.
Removed in-tree lib files; all imports now from workspace packages.
Tests 129/129 preserved; build 48 pages preserved."
```

---

### Task 9: Cross-app encode/decode compatibility verification

**Files:**
- Create: `packages/url-state/test/cross-app-compat.test.ts`

**Why:** Phase 1 ends with STRGuests on `@str/url-state` while STRBuyers/STRHost/STROps still use their in-tree variants. Users may share calculator URLs from one site to another. Verify all 4 variants can decode each other's encoded states.

- [ ] **Step 1: Read encode logic from each app's variant**

Identify: are all 4 using the same encoding format (e.g., `s=base64url(json)`)? If yes, this task is mostly a confirmation. If no, document the discrepancy and decide which format wins for `@str/url-state`.

- [ ] **Step 2: Write cross-app compat test**

Write `packages/url-state/test/cross-app-compat.test.ts` covering: encoding done by each in-tree variant decodes correctly with the new package, and vice versa.

If any variant uses a different encoding format, the new package must handle ALL of them on decode (lenient decode, strict encode). Document this in the package README.

- [ ] **Step 3: Implement compatibility shims if needed**

Most likely outcome: all 4 variants use the same simple base64 + JSON pattern, and no shims are needed. If shims ARE needed, add them to `decode.ts`.

- [ ] **Step 4: Run tests + commit**

```bash
cd packages/url-state && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
git add packages/url-state/
git commit -m "test(url-state): cross-app encoding compatibility verified

Confirmed all 4 in-tree variants decode the same format @str/url-state emits."
```

---

## Phase 1 verification & exit

### Task 10: Final verification — STRGuests on shared packages, others unchanged

**Files:**
- Modify: `docs/superpowers/plans/phase-1-baseline.md` (append post-Phase-1 section)

- [ ] **Step 1: Build + test all 4 apps + empire-console + new packages**

```bash
echo "=== Packages ==="
for pkg in format url-state seo email-gate; do
  echo "-- @str/$pkg --"
  cd "packages/$pkg"
  pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2
  pnpm typecheck 2>&1 | tail -3
  cd ../..
done

echo "=== Apps ==="
for d in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools tools/empire-console; do
  echo "-- $d --"
  cd "$d"
  pnpm build 2>&1 | grep "page\(s\) built" | tail -1
  pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2
  cd - > /dev/null
done
```

Expected:
- All packages: tests pass, typecheck clean
- STRGuests: 48 pages (matches baseline), 129/129 tests
- STROps/STRBuyers/STRHost: unchanged from Phase 1 baseline
- empire-console: unchanged

- [ ] **Step 2: Append Phase 1 exit section to baseline doc**

```markdown
---

## Phase 1 complete — final verification

**Captured:** <date> <time> MDT
**SHA:** <git rev-parse HEAD>

| Package | Tests | Typecheck |
|---|---|---|
| @str/format | <N>/<N> | PASS |
| @str/url-state | <N>/<N> | PASS |
| @str/seo | <N>/<N> | PASS |
| @str/email-gate | <N>/<N> unit + <N>/<N> integration | PASS |

| App | Build | Pages | Tests | Notes |
|---|---|---|---|---|
| STROps-Tools | PASS | 105 | 34/34 | Unchanged |
| STRGuests-Tools | PASS | 48 | 129/129 | Now on @str/* packages |
| STRBuyers-Tools | PASS | 235 | 84/84 + 7/7 server | Unchanged |
| STRHost-Tools | PASS | 73 | 73/73 | Unchanged |
| tools/empire-console | <result> | <N> | <N>/<N> | Unchanged |

**Phase 1 exit criteria met:**
- [x] Workspace tooling complete (root package.json, tsconfig.base.json, .changeset/)
- [x] packageManager aligned across all 4 apps (pnpm@9.6.0)
- [x] 4 Tier 1 packages scaffolded, implemented, tested, built
- [x] STRGuests fully wired to consume the 4 packages
- [x] STRGuests test count + page count preserved (parity with baseline)
- [x] Other 3 apps + empire-console untouched (no regressions)

**Known follow-ups for Phase 2:**
- @str/ui-chrome and @str/ui-funnel extraction (Tier 2 UI packages)
- Visual regression suite for STRGuests (catches UI extraction drift)
- empire-console upgrade from Astro 4.16 → 6.x (separate concern, not in current spec)
```

- [ ] **Step 3: Commit + sanity-check git log**

```bash
git add docs/superpowers/plans/phase-1-baseline.md
git commit -m "docs(phase-1): record post-extraction verification

Tier 1 packages live; STRGuests pilot wired; other apps unchanged."
git log --oneline d1948d7..HEAD
```

Expected: ~10-12 commits in a clean readable sequence:
- baseline capture
- packageManager alignment
- workspace tooling scaffold
- @str/format scaffold + impl
- @str/url-state scaffold + impl
- @str/seo scaffold + impl
- @str/email-gate scaffold + impl
- STRGuests wiring
- url-state cross-app compat
- final verification doc

---

## Phase 1 done. Next:

When P1 is verified and merged, request the Phase 2 plan with:

> "Write the Phase 2 plan (Tier 2 UI packages: @str/ui-chrome and @str/ui-funnel, STRGuests pilot)."
