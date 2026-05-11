# Phase 2: Tier 2 UI Packages (chrome + funnel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract chrome (Header, Footer, Sidebar, Layout, FunnelBand, Wordmark) and funnel (EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock, AdSlot) components into `@str/ui-chrome` and `@str/ui-funnel`. Wire STRGuests as the pilot. Establish visual regression baseline so Phase 3 fanout to STRBuyers/STRHost/STROps is verifiable.

**Architecture:** Astro component packages. Per-site customization via slots + props injecting `SiteConfig` from `@str/seo`. STRGuests pilots; other 3 apps untouched (Phase 3 work). STROps deferred entirely from Phase 2 (much heavier reconciliation — missing Layout + Wordmark, drastically smaller other components).

**Tech Stack:** Astro 6.x components packaged as `.astro` sub-exports; pnpm workspace; vitest for component snapshot tests; Playwright visual regression for STRGuests pilot.

---

## Reference: Spec

Source design: [docs/superpowers/specs/2026-05-10-shared-packages-migration-design.md](../specs/2026-05-10-shared-packages-migration-design.md), Section 4 (Tier 2 packages) + Section 6 (Phase 2 + Phase 3) + Section 7 (visual regression).

## Reference: Phase 1 carry-forwards (must address EARLY in Phase 2)

From the Phase 1 baseline doc + final code review:

1. **Fix pre-existing TS2532 in `@str/seo` test files** before extracting more packages (each new package inherits the strictness; cleaner to fix once)
2. **Fix pre-existing TS2322 in `@str/url-state` test files** (same rationale)
3. **Audit `buildItemList` callers in STRBuyers, STRHost, STROps** — its shape changed Phase 1 (`{ name, items[] }` wrapper); Phase 3 fanout will need to wrap callers
4. **Decide `@str/url-state` dual-API canonicalization** — defer to Phase 3 closing decision
5. **Decide `@str/email-gate` architecture** (MySQL vs ESP-webhook adapter) — defer to Phase 3
6. **Single `SiteId` source of truth** — defer to Phase 3 cleanup

Phase 2 addresses items 1, 2 (the test type errors, since they would affect Phase 2's @str/seo consumers). Items 3-6 stay as carry-forwards into Phase 3.

## Reference: Pre-extraction component inventory

From investigation of live `main` (commit `3c22d2b` after Phase 1 ship):

### Chrome components

| File | STROps | STRGuests | STRBuyers | STRHost |
|---|---|---|---|---|
| `Header.astro` | 22 lines | **61** | 61 | 61 |
| `Footer.astro` | 49 lines | **62** | 61 | 62 |
| `Sidebar.astro` | 20 lines | **27** | 27 | 27 |
| `Layout.astro` | MISSING (uses `src/layouts/`) | **90** | 84 | 92 |
| `FunnelBand.astro` | 9 lines | **25** | 38 (outlier) | 26 |
| `Wordmark.astro` | MISSING | **74** | 72 | 72 |

### Funnel components

| File | STROps | STRGuests | STRBuyers | STRHost | Location |
|---|---|---|---|---|---|
| `EmailCaptureCard.astro` | 59 | **119** | 126 | 124 | `funnel/` |
| `STRLedgerCTA.astro` | 22 | **108** | 111 | 111 | `funnel/` |
| `ClusterFunnelBlock.astro` | 26 | **60** | 73 | 60 | STRGuests/Buyers/Host: `chrome/`, STROps: `funnel/` |
| `AdSlot.astro` | 19 | **65** | 65 | 66 | `ads/` |

**Pattern:** STRGuests/STRBuyers/STRHost are nearly identical (post-Phase-1 "shared chrome P0/P1 fixes" commits). STRBuyers is canonical for the 2 outlier files (FunnelBand 38 lines, ClusterFunnelBlock 73 lines — likely city-page enhancements). STRGuests is canonical for everything else.

**STROps:** Drastically different size — Phase 3 STROps wiring will need substantial uplift, not a drop-in replacement. **Out of Phase 2 scope.**

### `ClusterFunnelBlock.astro` placement drift

STROps puts it in `src/components/funnel/` (sensible). STRGuests/STRBuyers/STRHost put it in `src/components/chrome/` (legacy). The shared package places it under `funnel/` (the more semantically correct location).

## File-by-file plan

### Net-new files

| File | Purpose |
|---|---|
| `packages/ui-chrome/package.json` | Manifest, exports each .astro as sub-path |
| `packages/ui-chrome/tsconfig.json` + `tsconfig.typecheck.json` | TS config |
| `packages/ui-chrome/src/Header.astro` | From STRGuests canonical |
| `packages/ui-chrome/src/Footer.astro` | From STRGuests canonical |
| `packages/ui-chrome/src/Sidebar.astro` | From STRGuests canonical |
| `packages/ui-chrome/src/Layout.astro` | From STRGuests canonical |
| `packages/ui-chrome/src/Wordmark.astro` | From STRGuests canonical |
| `packages/ui-chrome/src/FunnelBand.astro` | From STRGuests canonical (STRBuyers's 38-line variant via slot override) |
| `packages/ui-chrome/test/snapshot.test.ts` | Astro container tests for all 6 components |
| `packages/ui-chrome/README.md` | Usage + slot API docs |
| `packages/ui-funnel/package.json` | Manifest |
| `packages/ui-funnel/tsconfig.json` + `tsconfig.typecheck.json` | TS config |
| `packages/ui-funnel/src/EmailCaptureCard.astro` | From STRGuests canonical |
| `packages/ui-funnel/src/STRLedgerCTA.astro` | From STRGuests canonical |
| `packages/ui-funnel/src/ClusterFunnelBlock.astro` | From STRGuests canonical (STRBuyers's 73-line variant via slot override) |
| `packages/ui-funnel/src/AdSlot.astro` | From STRGuests canonical |
| `packages/ui-funnel/test/snapshot.test.ts` | Astro container tests |
| `packages/ui-funnel/README.md` | Usage docs |
| `STRGuests-Tools/tests/visual/baseline/<page>.png` | Playwright baseline screenshots (per page) |
| `STRGuests-Tools/playwright.config.ts` | Add `visual` project (or update existing) |
| `STRGuests-Tools/tests/visual/visual.spec.ts` | Visual regression test file |
| `docs/superpowers/plans/phase-2-baseline.md` | Pre-extraction baseline |

### Files modified (STRGuests pilot)

| File | Change |
|---|---|
| `STRGuests-Tools/package.json` | Add `@str/ui-chrome` + `@str/ui-funnel` workspace deps |
| `STRGuests-Tools/src/components/chrome/*.astro` | DELETE (replaced by @str/ui-chrome imports) |
| `STRGuests-Tools/src/components/funnel/*.astro` | DELETE (replaced by @str/ui-funnel imports) |
| `STRGuests-Tools/src/components/ads/AdSlot.astro` | DELETE (moved to @str/ui-funnel) |
| `STRGuests-Tools/src/**/*.{astro,ts,tsx}` | Update imports from `@/components/chrome/X` → `@str/ui-chrome/X.astro` etc. |

### Files modified (Phase 1 carry-forward cleanup)

| File | Change |
|---|---|
| `packages/seo/test/jsonld.test.ts` | Fix TS2532 errors (add `!` non-null or guard) |
| `packages/url-state/test/cross-app-compat.test.ts` | Fix TS2322 literal-narrowing errors |
| `packages/url-state/test/serialize.test.ts` | Same (if errors here too) |

---

## Pre-flight + carry-forward cleanup

### Task P0: Capture pre-Phase-2 baseline

**Files:**
- Create: `docs/superpowers/plans/phase-2-baseline.md`

- [ ] **Step 1: Confirm clean working tree on main**

```bash
git status
git log --oneline -5
```
Expected: working tree clean; latest commit `3c22d2b fix(@str/seo): make SiteConfig.emailGate optional` (or newer if origin advanced).

- [ ] **Step 2: Build + test all packages + apps**

Sequential (each ~30-90s):
```bash
echo "=== Packages ==="
for pkg in format url-state seo email-gate; do
  echo "-- @str/$pkg --"
  cd "packages/$pkg" && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
done

echo ""
echo "=== Apps ==="
for d in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools tools/empire-console; do
  echo "-- $d --"
  cd "$d"
  pnpm build 2>&1 | grep "page" | tail -1
  pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2
  cd - > /dev/null
done
cd STRBuyers-Tools && pnpm server:test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ..
```

- [ ] **Step 3: Capture chrome+funnel inventory (line counts per app per file)**

Use the table from "Pre-extraction component inventory" section above as the template; verify with fresh wc -l in case anything has drifted since plan was written.

- [ ] **Step 4: Write baseline doc**

Use Write tool. Path: `docs/superpowers/plans/phase-2-baseline.md`. Include:
- All 5 apps' build + test counts
- Package test counts
- Component file inventory (chrome + funnel + ads)
- Notes on ClusterFunnelBlock placement drift

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/phase-2-baseline.md
git commit -m "docs(phase-2): capture pre-extraction baseline for parity verification"
```

---

### Task 1: Fix pre-existing TS2532 errors in @str/seo test files

**Files:**
- Modify: `packages/seo/test/jsonld.test.ts` (and any other test file with TS2532)

**Why:** `noUncheckedIndexedAccess` strict-mode flag in `tsconfig.base.json` causes `arr[0]` to type as `T | undefined`. Test files that index arrays without guards fail typecheck. Fix now before more test files inherit the pattern.

- [ ] **Step 1: Run typecheck and capture errors**

```bash
cd packages/seo && pnpm typecheck 2>&1 | grep TS2532 | head -20 && cd ../..
```

- [ ] **Step 2: Apply fixes per error**

For each `arr[N]` access without guard, choose:
- `arr[N]!` non-null assertion (terse, OK in tests where you know the index exists)
- `arr.at(N)` then guard
- Pre-check: `expect(arr).toHaveLength(>= N+1)` before accessing

Prefer `!` non-null assertion for test code where assertion errors fail tests anyway (so the type narrowing is irrelevant).

- [ ] **Step 3: Verify typecheck clean**

```bash
cd packages/seo && pnpm typecheck 2>&1 | tail -5 && cd ../..
```
Expected: exit 0, no errors.

- [ ] **Step 4: Verify tests still pass**

```bash
cd packages/seo && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
```
Expected: 86/86 passing (no count change).

- [ ] **Step 5: Commit**

```bash
git add packages/seo/test/
git commit -m "test(@str/seo): add non-null assertions for noUncheckedIndexedAccess

Pre-existing TS2532 errors in test files: arr[N] returns T | undefined
under noUncheckedIndexedAccess. Tests already verify the values exist
via expect(); add ! assertion to satisfy the type checker without
behavior change."
```

---

### Task 2: Fix pre-existing TS2322/TS2532 errors in @str/url-state test files

**Files:**
- Modify: `packages/url-state/test/cross-app-compat.test.ts`
- Modify: `packages/url-state/test/serialize.test.ts` (if errors)

- [ ] **Step 1: Run typecheck and capture errors**

```bash
cd packages/url-state && pnpm typecheck 2>&1 | grep -E "TS2322|TS2532" | head -20 && cd ../..
```

- [ ] **Step 2: Apply fixes**

For TS2322 (literal-boolean narrowing): use `as const` or widen the test helper return type explicitly.

For TS2532 (same as Task 1): `arr[N]!` or guards.

- [ ] **Step 3: Verify typecheck + tests still green**

```bash
cd packages/url-state && pnpm typecheck 2>&1 | tail -5 && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
```
Expected: 0 typecheck errors, 76/76 tests passing.

- [ ] **Step 4: Commit**

```bash
git add packages/url-state/test/
git commit -m "test(@str/url-state): fix TS2322/TS2532 strictness in test files"
```

---

## @str/ui-chrome package

### Task 3: Scaffold @str/ui-chrome skeleton

**Files:**
- Create: `packages/ui-chrome/package.json`
- Create: `packages/ui-chrome/tsconfig.json` + `tsconfig.typecheck.json`
- Create: `packages/ui-chrome/src/index.ts` (placeholder; .astro components are sub-exports)
- Create: `packages/ui-chrome/README.md`

- [ ] **Step 1: Create package.json**

Use Write tool. Path: `packages/ui-chrome/package.json`

```json
{
  "name": "@str/ui-chrome",
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
    "./Header.astro": "./src/Header.astro",
    "./Footer.astro": "./src/Footer.astro",
    "./Sidebar.astro": "./src/Sidebar.astro",
    "./Layout.astro": "./src/Layout.astro",
    "./Wordmark.astro": "./src/Wordmark.astro",
    "./FunnelBand.astro": "./src/FunnelBand.astro"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --project tsconfig.typecheck.json",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@str/seo": "workspace:*"
  },
  "devDependencies": {
    "astro": "^6.2.2",
    "typescript": "^5.5.3",
    "vitest": "^2.1.1"
  },
  "peerDependencies": {
    "astro": "^6.2.2"
  }
}
```

NOTE: `astro` is a `peerDependency` (consumers provide it) AND a `devDependency` (so the package's typecheck/test work standalone).

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"]
}
```

NOTE: `*.astro` files are NOT compiled by tsc. They're consumed via Astro's compiler at the consumer site. tsconfig only handles any `.ts` helpers.

- [ ] **Step 3: Create tsconfig.typecheck.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "composite": false
  },
  "include": ["src/**/*.ts", "test/**/*"]
}
```

- [ ] **Step 4: Create placeholder index.ts**

Path: `packages/ui-chrome/src/index.ts`

```ts
// Components are exported as sub-paths via package.json `exports` map.
// Import via `@str/ui-chrome/Header.astro` etc.
export type { SiteConfig, NavItem, FooterSection } from '@str/seo';
```

- [ ] **Step 5: Create README.md**

```markdown
# @str/ui-chrome

Site shell components shared across STR-Tools apps: Header, Footer, Sidebar, Layout, Wordmark, FunnelBand.

## Usage

​```astro
---
import Header from '@str/ui-chrome/Header.astro';
import Layout from '@str/ui-chrome/Layout.astro';
import { siteConfig } from '@/data/site.config';
---

<Layout siteConfig={siteConfig} title="Page title">
  <Header siteConfig={siteConfig} />
  <slot />
</Layout>
​```

(Replace zero-width-space + backticks with proper triple-backticks in actual file.)

## Per-site customization

Components accept a `siteConfig: SiteConfig` prop (from `@str/seo`). All site-specific values
(brand name, nav items, footer links, canonical URL) are read from siteConfig. Slots are
provided for genuinely site-unique cases:

- `<slot name="header-cta" />` — replace the default header CTA
- `<slot name="footer-extra" />` — append to footer
- `<slot name="funnel-banner-override" />` — replace FunnelBand entirely (e.g., STRBuyers's 38-line variant)
```

- [ ] **Step 6: Install + verify build**

```bash
pnpm install 2>&1 | tail -5
cd packages/ui-chrome && pnpm build 2>&1 | tail -5 && ls dist/ 2>&1 && cd ../..
```

Expected: install succeeds, build emits `dist/index.js` + `dist/index.d.ts` (just the type re-export).

- [ ] **Step 7: Commit**

```bash
git add packages/ui-chrome/ pnpm-lock.yaml
git commit -m "feat(packages): scaffold @str/ui-chrome skeleton

Empty package with .astro sub-export contracts. Components added next."
```

---

### Task 4: Port chrome components from STRGuests canonical

**Files:**
- Read: `STRGuests-Tools/src/components/chrome/Header.astro`, `Footer.astro`, `Sidebar.astro`, `Layout.astro`, `FunnelBand.astro`, `Wordmark.astro`
- Create: `packages/ui-chrome/src/Header.astro` (and the other 5)

**Reconciliation strategy:** STRGuests is canonical (per Phase 1 SiteConfig wiring; STRGuests already consumes @str/seo so its chrome components reference siteConfig naturally). Port verbatim, then refactor any remaining hardcoded values to read from `Astro.props.siteConfig`.

- [ ] **Step 1: Read each STRGuests chrome component**

Use Read tool on all 6 files.

- [ ] **Step 2: For each component, write the package version**

For each, the package version should:
1. Accept `siteConfig: SiteConfig` as a prop (typed)
2. Replace any hardcoded brand strings, URLs, nav items, footer links with `siteConfig.brand.X`, `siteConfig.url.canonical`, `siteConfig.nav`, `siteConfig.footer.sections`
3. Provide `<slot />` for default content + named slots for override cases (per README docs)
4. Drop any STRGuests-specific business logic that doesn't belong in shared code

Example transformation for `Header.astro`:

```astro
---
// Before (STRGuests-Tools/src/components/chrome/Header.astro):
import Wordmark from './Wordmark.astro';
const brandName = 'STR Guests Tools';  // hardcoded
const navItems = [
  { label: 'Templates', href: '/templates' },
  { label: 'Blog', href: '/blog' },
];
---

// After (packages/ui-chrome/src/Header.astro):
import Wordmark from './Wordmark.astro';
import type { SiteConfig } from '@str/seo';

interface Props {
  siteConfig: SiteConfig;
}
const { siteConfig } = Astro.props as Props;
---

<header>
  <Wordmark siteConfig={siteConfig} />
  <nav>
    {siteConfig.nav.map(item => (
      <a href={item.href}>{item.label}</a>
    ))}
  </nav>
  <slot name="header-cta" />
</header>
```

- [ ] **Step 3: Write each new component**

Use Write tool per file. 6 files: Header, Footer, Sidebar, Layout, FunnelBand, Wordmark.

- [ ] **Step 4: Build + typecheck**

```bash
cd packages/ui-chrome && pnpm build 2>&1 | tail -5 && pnpm typecheck 2>&1 | tail -5 && cd ../..
```

Expected: build emits dist/, typecheck clean.

- [ ] **Step 5: Commit**

```bash
git add packages/ui-chrome/src/
git commit -m "feat(@str/ui-chrome): port 6 chrome components from STRGuests canonical

Header, Footer, Sidebar, Layout, FunnelBand, Wordmark.
Parameterized by SiteConfig (no hardcoded URLs/brand strings).
Named slots for override cases (header-cta, footer-extra, funnel-banner-override).
Apps wire up in Task 7 (STRGuests pilot)."
```

---

### Task 5: Add component snapshot tests for @str/ui-chrome

**Files:**
- Create: `packages/ui-chrome/test/snapshot.test.ts`

**Why:** Lock in the rendered HTML structure so future modifications don't accidentally change output. Astro's `experimental_AstroContainer` API renders a component to a string for testing.

- [ ] **Step 1: Write snapshot test file**

Path: `packages/ui-chrome/test/snapshot.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Header from '../src/Header.astro';
import Footer from '../src/Footer.astro';
import Sidebar from '../src/Sidebar.astro';
import Wordmark from '../src/Wordmark.astro';
import FunnelBand from '../src/FunnelBand.astro';
import type { SiteConfig } from '@str/seo';

const fixtureSite: SiteConfig = {
  siteId: 'guests',
  brand: {
    name: 'STR Guests Tools',
    wordmark: 'STR Guests',
    tagline: 'Free tools for hosts',
    primaryColor: '#000',
    logo: '/logo.svg',
  },
  url: { canonical: 'https://strguests.tools' },
  emailGate: { listId: 'guests-main', welcomeSubject: 'Welcome' },
  analytics: {},
  nav: [
    { label: 'Templates', href: '/templates' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    sections: [
      {
        title: 'Site',
        links: [{ label: 'Home', href: '/' }],
      },
    ],
  },
};

describe('@str/ui-chrome snapshots', () => {
  it('Header renders with siteConfig nav', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, { props: { siteConfig: fixtureSite } });
    expect(html).toContain('STR Guests');
    expect(html).toContain('Templates');
    expect(html).toContain('Blog');
    expect(html).toMatchSnapshot();
  });

  it('Footer renders with siteConfig footer sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { siteConfig: fixtureSite } });
    expect(html).toContain('Site');
    expect(html).toContain('Home');
    expect(html).toMatchSnapshot();
  });

  it('Sidebar renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Sidebar, { props: { siteConfig: fixtureSite } });
    expect(html).toMatchSnapshot();
  });

  it('Wordmark renders brand wordmark', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Wordmark, { props: { siteConfig: fixtureSite } });
    expect(html).toContain('STR Guests');
    expect(html).toMatchSnapshot();
  });

  it('FunnelBand renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(FunnelBand, { props: { siteConfig: fixtureSite } });
    expect(html).toMatchSnapshot();
  });

  // Layout snapshots are omitted because Layout requires html/head/body which isn't useful in unit-level snapshots.
  // It's covered by the visual regression tests in Task 8.
});
```

- [ ] **Step 2: Run tests to generate initial snapshots**

```bash
cd packages/ui-chrome && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
```

First run will fail with "snapshot does not match" — Vitest creates the initial snapshot files on first run. Run again:

```bash
cd packages/ui-chrome && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd ../..
```

Expected: 5 tests passing on second run.

- [ ] **Step 3: Inspect snapshot files for sanity**

```bash
ls packages/ui-chrome/test/__snapshots__/ 2>&1
cat packages/ui-chrome/test/__snapshots__/snapshot.test.ts.snap 2>&1 | head -40
```

Snapshots should contain rendered HTML excerpts. If any snapshot is empty or missing siteConfig values, fix the component implementation.

- [ ] **Step 4: Commit**

```bash
git add packages/ui-chrome/
git commit -m "test(@str/ui-chrome): snapshot tests for 5 chrome components

Locks rendered HTML output for Header, Footer, Sidebar, Wordmark, FunnelBand
using Astro experimental_AstroContainer. Layout covered by visual regression.
Snapshots committed alongside source as the contract."
```

---

## @str/ui-funnel package

### Task 6: Scaffold + port @str/ui-funnel (4 components)

**Files:**
- Create: `packages/ui-funnel/package.json`, `tsconfig.json`, `tsconfig.typecheck.json`, `src/index.ts`, `README.md`
- Create: `packages/ui-funnel/src/EmailCaptureCard.astro`, `STRLedgerCTA.astro`, `ClusterFunnelBlock.astro`, `AdSlot.astro`
- Create: `packages/ui-funnel/test/snapshot.test.ts`

This task combines scaffold + porting + snapshot tests into one (smaller surface than chrome; cleaner to do as one task).

- [ ] **Step 1: Create package.json**

Path: `packages/ui-funnel/package.json`

```json
{
  "name": "@str/ui-funnel",
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
    "./EmailCaptureCard.astro": "./src/EmailCaptureCard.astro",
    "./STRLedgerCTA.astro": "./src/STRLedgerCTA.astro",
    "./ClusterFunnelBlock.astro": "./src/ClusterFunnelBlock.astro",
    "./AdSlot.astro": "./src/AdSlot.astro"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --project tsconfig.typecheck.json",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@str/seo": "workspace:*",
    "@str/ui-chrome": "workspace:*"
  },
  "devDependencies": {
    "astro": "^6.2.2",
    "typescript": "^5.5.3",
    "vitest": "^2.1.1"
  },
  "peerDependencies": {
    "astro": "^6.2.2"
  }
}
```

- [ ] **Step 2: Create tsconfig.json + tsconfig.typecheck.json + index.ts**

Same shape as ui-chrome (see Task 3 Step 2-4).

- [ ] **Step 3: Read STRGuests funnel components**

Use Read tool on:
- `STRGuests-Tools/src/components/funnel/EmailCaptureCard.astro`
- `STRGuests-Tools/src/components/funnel/STRLedgerCTA.astro`
- `STRGuests-Tools/src/components/chrome/ClusterFunnelBlock.astro` (note: in chrome/ on STRGuests, will move to funnel/ in package)
- `STRGuests-Tools/src/components/ads/AdSlot.astro`

- [ ] **Step 4: Port each as @str/ui-funnel component**

Same pattern as Task 4: parameterize by `siteConfig`, drop hardcoded values.

For `EmailCaptureCard`: this consumes the in-tree email-gate logic. Keep that logic INSIDE the component (it's a UI concern + form post). The component should accept a `magnet` prop and an `endpoint` prop (defaulting to `/api/email-gate` or whatever STRGuests uses today).

NOTE: This is where Phase 1 carry-forward #5 (email-gate architecture decision) intersects. For Phase 2, the EmailCaptureCard component just needs to POST to whatever endpoint the consuming site provides. STRGuests' wiring will pass its existing ESP webhook endpoint. Document this decoupling clearly in the component prop API.

- [ ] **Step 5: Write README.md**

```markdown
# @str/ui-funnel

Conversion-focused components: EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock, AdSlot.

## Usage

​```astro
---
import EmailCaptureCard from '@str/ui-funnel/EmailCaptureCard.astro';
import { siteConfig } from '@/data/site.config';
---

<EmailCaptureCard
  siteConfig={siteConfig}
  magnet="house-rules-pdf"
  endpoint="/api/email-gate"
/>
​```

## Email-gate decoupling

`EmailCaptureCard` accepts an `endpoint` prop. The site is responsible for the server endpoint
that handles the POST. This decouples the UI from any specific email-gate backend (ESP webhook,
@str/email-gate MySQL, ConvertKit, etc.).
```

- [ ] **Step 6: Snapshot tests**

Same shape as Task 5. Path: `packages/ui-funnel/test/snapshot.test.ts`. 4 components × 1 snapshot each = 4 tests.

- [ ] **Step 7: Build + test + commit**

```bash
cd packages/ui-funnel && pnpm build 2>&1 | tail -3 && pnpm test 2>&1 | grep "Tests" | head -1 && cd ../..
git add packages/ui-funnel/ pnpm-lock.yaml
git commit -m "feat(packages): @str/ui-funnel — EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock, AdSlot

Parameterized by SiteConfig + decoupled email-gate endpoint.
Snapshot tests + slot API."
```

---

## STRGuests pilot wiring + visual regression

### Task 7: Capture STRGuests visual baseline (BEFORE wiring changes)

**Files:**
- Create: `STRGuests-Tools/tests/visual/visual.spec.ts`
- Create: `STRGuests-Tools/playwright.config.ts` (modify if exists)
- Create: `STRGuests-Tools/tests/visual/baseline/<page>.png` (auto-generated on first run)

**Why:** Catches subtle CSS/layout drift when Task 8 swaps in package components. ≤0.1% pixel diff threshold per spec Section 7.

- [ ] **Step 1: Update playwright.config.ts to add `visual` project**

Read `STRGuests-Tools/playwright.config.ts`. Add a `visual` project entry that:
- Uses chromium
- Has `expect.toHaveScreenshot.maxDiffPixelRatio: 0.001` (0.1% threshold)
- Uses a stable viewport (1280x720)
- Uses webServer to start `pnpm preview` before tests

```ts
// In projects array:
{
  name: 'visual',
  testDir: './tests/visual',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.001 },
  },
}
```

- [ ] **Step 2: Write visual.spec.ts**

Path: `STRGuests-Tools/tests/visual/visual.spec.ts`

```ts
import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'house-rules', path: '/house-rules-pdf' },
  { name: 'check-in', path: '/check-in-instructions' },
  { name: 'wifi-sign', path: '/wifi-sign' },
  { name: 'welcome-book', path: '/welcome-book' },
];

for (const page of PAGES) {
  test(`visual: ${page.name}`, async ({ page: pwPage }) => {
    await pwPage.goto(page.path);
    await pwPage.waitForLoadState('networkidle');
    await expect(pwPage).toHaveScreenshot(`${page.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.001,
    });
  });
}
```

- [ ] **Step 3: Run to generate baseline**

```bash
cd STRGuests-Tools
pnpm exec playwright install chromium 2>&1 | tail -3
pnpm exec playwright test --project=visual --update-snapshots 2>&1 | tail -10
ls tests/visual/visual.spec.ts-snapshots/ 2>&1 || ls tests/visual/baseline/ 2>&1
cd ..
```

Expected: 5 PNG screenshots created. Inspect them visually if possible to confirm they show real pages, not error screens.

- [ ] **Step 4: Run visual tests again to confirm baseline-vs-baseline match**

```bash
cd STRGuests-Tools && pnpm exec playwright test --project=visual 2>&1 | tail -5 && cd ..
```

Expected: 5 passing.

- [ ] **Step 5: Commit baselines**

```bash
git add STRGuests-Tools/playwright.config.ts STRGuests-Tools/tests/visual/
git commit -m "test(strguests): visual regression baselines (pre-Phase-2 wiring)

5 page screenshots locked at 0.1% pixel diff tolerance.
Captures current rendering before @str/ui-chrome + @str/ui-funnel wiring;
Task 8's wiring must produce visually identical output."
```

---

### Task 8: Wire STRGuests to consume @str/ui-chrome + @str/ui-funnel

**Files:**
- Modify: `STRGuests-Tools/package.json` (add 2 deps)
- Delete: `STRGuests-Tools/src/components/chrome/*.astro`
- Delete: `STRGuests-Tools/src/components/funnel/*.astro`
- Delete: `STRGuests-Tools/src/components/ads/AdSlot.astro`
- Modify: every `.astro`/`.ts`/`.tsx` file importing the deleted components

- [ ] **Step 1: Add 2 deps to STRGuests package.json**

```json
"@str/ui-chrome": "workspace:*",
"@str/ui-funnel": "workspace:*"
```

- [ ] **Step 2: Reinstall**

```bash
pnpm install 2>&1 | tail -5
```

- [ ] **Step 3: Find all import sites**

Use Grep tool:
- pattern: `from ['"][^'"]*components/chrome/`, glob: `STRGuests-Tools/src/**/*.{astro,ts,tsx}`
- pattern: `from ['"][^'"]*components/funnel/`, same glob
- pattern: `from ['"][^'"]*components/ads/`, same glob

Capture file list.

- [ ] **Step 4: Update each import**

Per match, update path:

```ts
// Before:
import Header from '@/components/chrome/Header.astro';
import EmailCaptureCard from '@/components/funnel/EmailCaptureCard.astro';
import AdSlot from '@/components/ads/AdSlot.astro';

// After:
import Header from '@str/ui-chrome/Header.astro';
import EmailCaptureCard from '@str/ui-funnel/EmailCaptureCard.astro';
import AdSlot from '@str/ui-funnel/AdSlot.astro';
```

For each component invocation, ensure `siteConfig={siteConfig}` is passed (component now requires it). Import siteConfig from `@/data/site.config` at the top of any file that didn't already have it.

For `EmailCaptureCard`: pass `endpoint` prop (use whatever URL STRGuests' current ESP webhook is — read from existing component or env var).

- [ ] **Step 5: Delete old in-tree components**

```bash
git rm STRGuests-Tools/src/components/chrome/*.astro \
       STRGuests-Tools/src/components/funnel/*.astro \
       STRGuests-Tools/src/components/ads/AdSlot.astro
```

(Verify ads/ is now empty; if so, `rmdir` it.)

- [ ] **Step 6: Build + tests**

```bash
cd STRGuests-Tools
pnpm typecheck 2>&1 | tail -10
pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2
pnpm build 2>&1 | grep "page" | tail -1
cd ..
```

Expected: typecheck clean, 165/165 tests (per Phase 1 baseline), build still 48 pages.

If typecheck or build fails, fix iteratively. Common issues:
- A page imports a component that wasn't migrated → fix the import
- A component receives props it didn't expect → adjust call site

- [ ] **Step 7: Run visual regression — must match baseline**

```bash
cd STRGuests-Tools && pnpm exec playwright test --project=visual 2>&1 | tail -10 && cd ..
```

Expected: 5/5 pass with ≤0.1% pixel diff.

If any test fails:
- Inspect the diff in `playwright-report/` (open `index.html`)
- Decide: real visual regression (fix component) or acceptable change (update baseline with `--update-snapshots`)
- Default to "fix component" — the whole point is preserving identical output

- [ ] **Step 8: Commit**

```bash
git add STRGuests-Tools/
git commit -m "feat(strguests): consume @str/ui-chrome + @str/ui-funnel

Removed in-tree components/chrome/, components/funnel/, components/ads/.
All imports now from workspace packages with siteConfig prop wiring.
Visual regression preserved (5/5 baselines match within 0.1% tolerance).
EmailCaptureCard endpoint configured to current ESP webhook URL."
```

---

## Phase 2 verification & exit

### Task 9: Final verification + Phase 2 exit doc

**Files:**
- Modify: `docs/superpowers/plans/phase-2-baseline.md` (append Phase 2 complete section)

- [ ] **Step 1: Build + test all packages + apps**

```bash
echo "=== Packages ==="
for pkg in format url-state seo email-gate ui-chrome ui-funnel; do
  echo "-- @str/$pkg --"
  cd "packages/$pkg" && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && pnpm typecheck 2>&1 | tail -3 && cd ../..
done

echo ""
echo "=== Apps ==="
for d in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools tools/empire-console; do
  echo "-- $d --"
  cd "$d" && pnpm build 2>&1 | grep "page" | tail -1 && pnpm test 2>&1 | grep -E "Test Files|Tests" | head -2 && cd - > /dev/null
done

echo "=== STRBuyers server ==="
cd STRBuyers-Tools && pnpm server:test 2>&1 | grep "Tests" | head -1 && cd ..

echo "=== STRGuests visual regression ==="
cd STRGuests-Tools && pnpm exec playwright test --project=visual 2>&1 | tail -5 && cd ..
```

Expected:
- All 6 packages: tests pass, typecheck clean
- All 5 apps: build + tests preserved at baseline
- STRGuests: 5/5 visual regression pass

- [ ] **Step 2: Append Phase 2 exit section to baseline doc**

Use Edit tool. Append:

```markdown
---

## Phase 2 complete — final verification

**Captured:** <date> <time> MDT
**SHA:** <git rev-parse HEAD>

| Package | Tests | Typecheck |
|---|---|---|
| @str/format | 103/103 | PASS |
| @str/url-state | 76/76 | PASS (TS errors fixed in Task 2) |
| @str/seo | 86/86 | PASS (TS errors fixed in Task 1) |
| @str/email-gate | 11/11 | PASS |
| @str/ui-chrome | 5/5 snapshots | PASS |
| @str/ui-funnel | 4/4 snapshots | PASS |

| App | Build | Pages | Tests | Visual | Notes |
|---|---|---|---|---|---|
| STROps-Tools | PASS | 105 | 34/34 | — | Unchanged (Phase 3) |
| STRGuests-Tools | PASS | 48 | 165/165 | 5/5 | Now on @str/ui-chrome + @str/ui-funnel |
| STRBuyers-Tools | PASS | 238 | 84+7 | — | Unchanged (Phase 3) |
| STRHost-Tools | PASS | 73 | 73/73 | — | Unchanged (Phase 3) |
| tools/empire-console | PASS | 140 | 68/68 | — | Unchanged |

**Phase 2 exit criteria met:**
- [x] @str/ui-chrome + @str/ui-funnel built, tested, documented
- [x] STRGuests pilot wired to consume both
- [x] STRGuests visual regression preserved (5/5 baselines match)
- [x] Phase 1 carry-forwards 1+2 fixed (TS errors in @str/seo + @str/url-state tests)
- [x] Other apps + empire-console untouched

**Carry-forwards for Phase 3 (STRBuyers/STRHost/STROps fanout):**

Open from Phase 1, still open:
- buildItemList caller audit in STRBuyers/STRHost/STROps (will need {name,items[]} wrapper)
- Single SiteId source of truth (currently in @str/seo + @str/email-gate)
- @str/url-state dual-API canonicalization decision
- @str/email-gate architecture decision (MySQL vs ESP-webhook adapter)

New from Phase 2:
- STROps chrome/funnel reconciliation: STROps Header is 22 lines vs canonical 61. Header/Footer/Sidebar all need substantial uplift, not drop-in. Layout + Wordmark are MISSING entirely on STROps. Phase 3 STROps wiring is 2-3x heavier than STRGuests/STRBuyers/STRHost wiring.
- STRBuyers's outlier FunnelBand (38 lines) and ClusterFunnelBlock (73 lines) — wire via `<slot name="funnel-banner-override">` so its city-page customizations stay
- ClusterFunnelBlock placement: STROps had it in funnel/, others had it in chrome/; package places it in funnel/ — Phase 3 wiring may need to fix import paths in non-STROps apps

Phase 2 done. Ready for Phase 3: fan Tier 1+2 packages out to STRBuyers, STRHost, STROps.
```

- [ ] **Step 3: Commit + sanity-check log**

```bash
git add docs/superpowers/plans/phase-2-baseline.md
git commit -m "docs(phase-2): record post-extraction verification

Tier 2 UI packages live; STRGuests pilot wired with visual regression
preserved at 0.1% tolerance. Phase 1 carry-forwards 1+2 closed.
Other apps + empire-console untouched. Ready for Phase 3 fanout."
```

```bash
git log --oneline 3c22d2b..HEAD
```

Expected: ~10-12 commits in clean sequence (baseline → 2 carry-forward fixes → ui-chrome scaffold → ui-chrome port → ui-chrome tests → ui-funnel → STRGuests visual baseline → STRGuests wiring → exit doc).

---

## Phase 2 done. Next:

When P2 is verified and merged, request the Phase 3 plan:

> "Write the Phase 3 plan (fan Tier 1+2 packages to STRBuyers, STRHost, STROps)."
