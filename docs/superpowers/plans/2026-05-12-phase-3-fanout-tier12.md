# Phase 3: Fan Tier 1+2 Packages to STRBuyers + STRHost + STROps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire STRBuyers, STRHost, STROps to consume the 6 shared packages (`@str/format`, `@str/url-state`, `@str/seo`, `@str/email-gate`, `@str/ui-chrome`, `@str/ui-funnel`) — completing the 4-app fanout established by STRGuests pilot in Phases 1+2.

**Architecture:** Per-app wiring pattern proven in Phases 1+2. STRBuyers and STRHost are similar in scope to STRGuests; STROps is heavier (chrome components are 1/3 the size of canonical). Each app gets its own visual regression baseline + diff verification. AppSidebar pattern repeats per app.

**Tech Stack:** No new dependencies. Existing pnpm workspace + 6 packages already on origin/main (post-Phase-2 merge `c0af7a6`).

**Estimate:** 8-12h across 3 apps + carry-forwards (vs original spec 4-5h — revised up based on Phase 2 findings about app-specific sidebar shapes and STROps chrome depth).

---

## Reference: Spec

Source design: [docs/superpowers/specs/2026-05-10-shared-packages-migration-design.md](../specs/2026-05-10-shared-packages-migration-design.md), Section 6 → Phase 3.

## Reference: Carry-forwards from Phase 1 + Phase 2

From `docs/superpowers/plans/phase-1-baseline.md` + `phase-2-baseline.md`:

**Open architectural decisions (some deferred to end of Phase 3):**
1. **`@str/url-state` dual-API canonicalization:** Currently both `serialize`/`parse` (1/0 booleans) and `encodeState`/`decodeState` (true/false booleans) coexist. Phase 3 wires all 4 apps; after that, decide which API wins for new callers and deprecate the other.
2. **`@str/email-gate` architecture decision:** Currently MySQL-only; STRGuests uses ESP webhook in-tree. Phase 3 doesn't wire any app to the new package. Decision made END of Phase 3 once we know which apps want which backend.
3. **Single `SiteId` source of truth:** Currently duplicated in `@str/seo/site-config.ts` + `@str/email-gate/schema.ts`. Phase 3 won't touch this.

**Closing in Phase 3:**
4. **`buildItemList` caller audit:** STRBuyers (1 site) + STRHost (2 sites) + STROps (0 sites) callers exist. Update each to wrap `items` in `{ name, items: [...] }` per @str/seo Phase 1 shape change.

**Pattern decisions:**
5. **AppSidebar replication:** STRGuests created `AppSidebar.astro` to preserve 2-line tools.json card design (different from `@str/ui-chrome/Sidebar`'s 1-line `siteConfig.nav` rendering). STRBuyers/STRHost use the SAME tools.json shape — they need the same AppSidebar pattern. STROps uses a different shape (hardcoded array of `{slug, label}`) — needs its own variant.
   - **Better approach:** Extract `@str/ui-chrome/AppSidebar.astro` accepting either shape via discriminated `items` prop, then all 3 apps consume it. Phase 3 includes this as a refactor task.

6. **`@str/ui-chrome/Sidebar` retirement:** Once `AppSidebar` is extracted, the simpler `Sidebar` from Phase 2 has zero consumers. Decide: keep as alternative API, or remove.

## Reference: Pre-fanout state (verified 2026-05-12)

Post-merge of PR #36 (commit `c0af7a6`):

### STROps Astro version
- Now on **Astro 6.2.2** (parallel agent fixed via commit `dded053`). No Astro 4 blocker.

### Per-app component inventory (lines)

| File | STRBuyers | STRHost | STROps | Canonical (now in @str/ui-chrome) |
|---|---|---|---|---|
| Header | 61 | 61 | **22** | 61 (STRGuests) |
| Footer | 61 | 62 | **49** | 62 |
| Sidebar | 27 | 27 | **20** | replaced by AppSidebar pattern |
| Layout | 84 | 92 | **MISSING** (uses src/layouts/) | 90 |
| FunnelBand | **38** (richer) | 26 | **9** | 25 |
| Wordmark | 72 | 72 | **MISSING** | 74 |
| ClusterFunnelBlock | **73** (richer) | 60 | **MISSING** | 60 |
| EmailCaptureCard | 126 | 124 | **59** | 119 |
| STRLedgerCTA | 111 | 111 | **22** | 108 |
| AdSlot | 65 | 66 | **19** | 65 |
| RelatedPosts | MISSING | 67 | MISSING | (kept in-tree on STRGuests + STRHost) |

**Pattern:**
- STRBuyers + STRHost: nearly identical to STRGuests canonical → easy wiring
- STRBuyers outliers: FunnelBand (38, city-page enhancements), ClusterFunnelBlock (73) → wire via `<slot name="funnel-banner-override">`
- STROps: Layout + Wordmark + ClusterFunnelBlock MISSING; Header/Footer/Sidebar much smaller → harder wiring, custom `src/layouts/Layout.astro` continues to host the page shell, may need adapter to embed shared chrome

### buildItemList callers
- STRBuyers: 1 callsite
- STRHost: 2 callsites
- STROps: 0 callsites

### Tier 1 lib files (still in-tree, to be deleted on each app's wiring)

| File | STRBuyers | STRHost | STROps |
|---|---|---|---|
| `src/lib/format.ts` | 121 lines | 124 lines | 17 lines |
| `src/lib/url-state.ts` | 89 lines | 89 lines | 51 lines |
| `src/lib/seo.ts` | 312 lines | 233 lines | 125 lines |
| `src/lib/email-gate.ts` | MISSING | MISSING | MISSING |

**email-gate** present only in STRGuests (still in-tree there). **No Phase 3 app uses email-gate** → no decision needed.

---

## Phase 3 task structure

10 tasks grouped by app, with carry-forward + AppSidebar refactor at start:

- **Pre-flight:** Task P0 (baseline)
- **Carry-forward + refactor:** Tasks 1-2 (AppSidebar extract + Sidebar retire)
- **STRBuyers wiring:** Tasks 3-4 (visual baseline + wiring)
- **STRHost wiring:** Tasks 5-6 (visual baseline + wiring)
- **STROps wiring:** Tasks 7-8 (visual baseline + wiring; this is the hardest)
- **Verification:** Task 9 (final cross-app verification + exit doc)

---

## Pre-flight

### Task P0: Capture pre-Phase-3 baseline

**Files:**
- Create: `docs/superpowers/plans/phase-3-baseline.md`

- [ ] **Step 1: Confirm clean working tree on main** (`git status`, `git log --oneline -5`)

- [ ] **Step 2: Build + test all 6 packages + 5 apps + STRBuyers server**

- [ ] **Step 3: Capture per-app component inventory** (verify the table above with `wc -l`)

- [ ] **Step 4: Write baseline doc** with all metrics + component inventory + tier-1 lib file inventory + buildItemList caller counts

- [ ] **Step 5: Commit:** `docs(phase-3): capture pre-fanout baseline for parity verification`

---

## AppSidebar refactor (carry-forward + DRY)

### Task 1: Extract `@str/ui-chrome/AppSidebar.astro` accepting flexible items shape

**Why:** STRGuests's `AppSidebar.astro` (Phase 2) reads `tools.json` and renders 2-line cards. STRBuyers and STRHost have IDENTICAL Sidebar implementations (same `tools.json` shape). STROps uses a hardcoded array. Rather than duplicating AppSidebar 3-4 times, extract one shared component that accepts an `items` prop with the union shape.

**Files:**
- Read: `STRGuests-Tools/src/components/AppSidebar.astro`
- Read: `STROps-Tools/src/components/chrome/Sidebar.astro` (full file)
- Create: `packages/ui-chrome/src/AppSidebar.astro`
- Update: `packages/ui-chrome/package.json` (add `./AppSidebar.astro` to exports map)
- Update: `packages/ui-chrome/test/snapshot.test.ts` (add AppSidebar snapshot test)
- Update: `packages/ui-chrome/README.md`

- [ ] **Step 1: Read AppSidebar from STRGuests + Sidebar from STROps**

Determine the union of fields each variant uses:
- STRGuests/STRBuyers/STRHost shape: `{ shortName, tagline, href }` (read from tools.json by key)
- STROps shape: `{ slug, label }` (hardcoded)

Decide canonical interface for shared component:

```ts
interface SidebarItem {
  slug: string;          // unique identifier for filtering current
  label: string;         // primary label (always shown)
  description?: string;  // optional 2nd line (renders if present)
  href?: string;         // optional explicit href (defaults to /${slug})
}

interface Props {
  siteConfig: SiteConfig;
  items: SidebarItem[];
  current?: string;       // slug of current page; excluded from list
  maxItems?: number;      // defaults to 6
}
```

This handles both shapes:
- 2-line card (STRGuests/STRBuyers/STRHost): pass `items` mapped from tools.json with `description: tagline`
- 1-line nav (STROps): pass `items` from hardcoded array; `description` omitted → renders 1-line

- [ ] **Step 2: Write the component**

Use Write tool. Path: `packages/ui-chrome/src/AppSidebar.astro`. Render:
- If `description` present: 2-line card (preserves STRGuests Phase 2 design)
- If `description` absent: 1-line nav button (preserves STROps design)

Style classes can match STRGuests's existing AppSidebar so STRBuyers/STRHost wiring produces zero visual diff.

- [ ] **Step 3: Update package.json exports**

In `packages/ui-chrome/package.json`, add to `exports`:

```json
"./AppSidebar.astro": "./src/AppSidebar.astro"
```

- [ ] **Step 4: Add snapshot test**

In `packages/ui-chrome/test/snapshot.test.ts`, add 2 new tests:

```ts
import AppSidebar from '../src/AppSidebar.astro';

it('AppSidebar renders 2-line card when description present', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(AppSidebar, {
    props: {
      siteConfig: fixtureSite,
      items: [
        { slug: 'house-rules', label: 'House Rules', description: 'PDF generator', href: '/house-rules-pdf' },
        { slug: 'wifi-sign', label: 'Wi-Fi Sign', description: 'Print-ready PDF' },
      ],
      current: 'wifi-sign',
    },
  });
  expect(html).toContain('House Rules');
  expect(html).toContain('PDF generator');  // 2nd line
  expect(html).not.toContain('Wi-Fi Sign'); // current excluded
  expect(html).toMatchSnapshot();
});

it('AppSidebar renders 1-line nav when description absent', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(AppSidebar, {
    props: {
      siteConfig: fixtureSite,
      items: [
        { slug: 'turnover-scheduler', label: 'Turnover scheduler' },
        { slug: 'cleaner-dispatch', label: 'Cleaner dispatch' },
      ],
      current: 'turnover-scheduler',
    },
  });
  expect(html).toContain('Cleaner dispatch');
  expect(html).not.toContain('Turnover scheduler'); // current excluded
  expect(html).toMatchSnapshot();
});
```

- [ ] **Step 5: Update README**

Document the dual-shape API + when to use AppSidebar vs the simpler Sidebar.

- [ ] **Step 6: Build + test**

```bash
cd packages/ui-chrome && pnpm test 2>&1 | grep "Tests" | head -1 && pnpm build 2>&1 | tail -3 && cd ../..
```

Expected: 7 tests passing (5 prior + 2 new).

- [ ] **Step 7: Commit**

```bash
git add packages/ui-chrome/
git commit -m "feat(@str/ui-chrome): add AppSidebar accepting flexible items shape

Replaces per-app AppSidebar pattern (STRGuests Phase 2 + planned
STRBuyers/STRHost/STROps Phase 3 duplicates). Single component renders
2-line card when description prop present, 1-line nav when absent.
STRGuests will migrate to this in Task 4; new app wiring uses it directly."
```

---

### Task 2: Migrate STRGuests's AppSidebar to consume the package version

**Files:**
- Modify: `STRGuests-Tools/src/components/AppSidebar.astro` → DELETE (replaced)
- Modify: every page importing `@/components/AppSidebar.astro` → update to `@str/ui-chrome/AppSidebar.astro` + pass `items` prop

- [ ] **Step 1: Find STRGuests AppSidebar callsites**

```
Grep tool: pattern "from ['\"]@/components/AppSidebar", glob "STRGuests-Tools/src/**/*.{astro,ts,tsx}"
```

- [ ] **Step 2: Per callsite, update to package import + pass items**

```astro
---
// Before:
import Sidebar from '@/components/AppSidebar.astro';
import tools from '@/data/tools.json';
---

<Sidebar siteConfig={siteConfig} current="check-in-instructions" />

---
// After:
import Sidebar from '@str/ui-chrome/AppSidebar.astro';
import tools from '@/data/tools.json';

const sidebarItems = Object.entries(tools).map(([slug, t]) => ({
  slug,
  label: t.shortName ?? t.name,
  description: t.tagline,
  href: t.href ?? `/${slug}`,
}));
---

<Sidebar siteConfig={siteConfig} items={sidebarItems} current="check-in-instructions" />
```

(The `items` mapping should match what STRGuests's AppSidebar was already doing internally.)

- [ ] **Step 3: Delete in-tree AppSidebar**

```bash
git rm STRGuests-Tools/src/components/AppSidebar.astro
```

- [ ] **Step 4: Verify**

```bash
cd STRGuests-Tools
pnpm typecheck 2>&1 | tail -5
pnpm build 2>&1 | grep "page" | tail -1
pnpm test 2>&1 | grep "Tests" | head -1
pnpm exec playwright test --project=visual 2>&1 | tail -5
cd ..
```

Expected: typecheck clean, 49 pages, 165 tests, 5/5 visual regression pass (AppSidebar should render identically since the new component preserves the 2-line card design).

If visual fails: the new shared AppSidebar's CSS doesn't perfectly match the in-tree variant. Either fix the package's CSS or update visual baselines with explicit reasoning.

- [ ] **Step 5: Commit**

```bash
git add STRGuests-Tools/
git commit -m "refactor(strguests): consume @str/ui-chrome/AppSidebar (drop in-tree variant)

In-tree AppSidebar.astro replaced with shared @str/ui-chrome/AppSidebar.
items prop populated from tools.json. Visual regression preserved."
```

---

## STRBuyers wiring

### Task 3: Capture STRBuyers visual baseline (BEFORE wiring)

**Files:**
- Create: `STRBuyers-Tools/playwright.config.ts` (modify if exists)
- Create: `STRBuyers-Tools/tests/visual/visual.spec.ts`
- Create: `STRBuyers-Tools/tests/visual/visual.spec.ts-snapshots/*.png` (auto-generated)

Same pattern as Phase 2 Task 7 (STRGuests visual baseline).

- [ ] **Step 1: Update playwright.config.ts to add `visual` project**

Same shape as STRGuests's playwright config (chromium, 1280x720, maxDiffPixelRatio 0.001, webServer for `pnpm preview`).

- [ ] **Step 2: Write visual.spec.ts**

Path: `STRBuyers-Tools/tests/visual/visual.spec.ts`. Pages to screenshot (pick 5 representative):

```ts
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'cash-on-cash', path: '/cash-on-cash-calculator' },
  { name: 'comp-analyzer', path: '/comp-analyzer' },
  { name: 'cities-index', path: '/cities/' },
  { name: 'city-detail', path: '/cities/asheville-nc/' },
];
```

(Adjust paths if any have changed since plan was written; verify with `ls STRBuyers-Tools/src/pages/`.)

- [ ] **Step 3: Generate baselines**

```bash
cd STRBuyers-Tools
pnpm exec playwright install chromium 2>&1 | tail -3
pnpm exec playwright test --project=visual --update-snapshots 2>&1 | tail -10
cd ..
```

- [ ] **Step 4: Verify baseline-vs-baseline match**

```bash
cd STRBuyers-Tools && pnpm exec playwright test --project=visual 2>&1 | tail -5 && cd ..
```

- [ ] **Step 5: Commit**

```bash
git add STRBuyers-Tools/playwright.config.ts STRBuyers-Tools/tests/visual/
git commit -m "test(strbuyers): visual regression baselines (pre-Phase-3 wiring)

5 page screenshots locked at 0.1% pixel diff tolerance.
Captures current rendering before @str/* package wiring;
Task 4's wiring must produce visually identical output."
```

---

### Task 4: Wire STRBuyers to consume all 6 packages (except email-gate)

**Files:**
- Modify: `STRBuyers-Tools/package.json` (add 5 workspace deps; not email-gate)
- Create: `STRBuyers-Tools/src/data/site.config.ts`
- Delete: `STRBuyers-Tools/src/lib/format.ts`, `url-state.ts`, `seo.ts`
- Delete: `STRBuyers-Tools/src/components/chrome/*.astro`, `funnel/*.astro`, `ads/AdSlot.astro`
- Modify: every page/component importing the deleted files

This is the heaviest single task. Mirrors STRGuests Phase 1 Task 8 + Phase 2 Task 8 combined.

- [ ] **Step 1: Add deps to package.json**

```json
"@str/format": "workspace:*",
"@str/url-state": "workspace:*",
"@str/seo": "workspace:*",
"@str/ui-chrome": "workspace:*",
"@str/ui-funnel": "workspace:*"
```

(NOT `@str/email-gate` — STRBuyers doesn't currently have email-gate.ts; if a future feature needs MySQL email collection, wire it then.)

- [ ] **Step 2: Reinstall**

```bash
pnpm install 2>&1 | tail -5
```

- [ ] **Step 3: Create site.config.ts**

Read STRBuyers's `Header.astro`, `Footer.astro`, `astro.config.mjs`, `tailwind.config.ts` to extract brand name, tagline, primary color, nav, footer.

Path: `STRBuyers-Tools/src/data/site.config.ts`:

```ts
import type { SiteConfig } from '@str/seo';

export const siteConfig: SiteConfig = {
  siteId: 'buyers',
  brand: {
    name: '<from existing chrome>',
    wordmark: '<from existing>',
    tagline: '<from existing>',
    primaryColor: '<from tailwind config>',
    logo: '/brand/logo.svg',
  },
  url: {
    canonical: 'https://strbuyers.tools',
  },
  // emailGate omitted — STRBuyers doesn't use MySQL email collection (post-Phase-2 SiteConfig.emailGate is optional)
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID,
  },
  nav: [/* port from Header.astro */],
  footer: { sections: [/* port from Footer.astro */] },
};
```

- [ ] **Step 4: Find import sites**

Grep all of:
- `from ['"]@/lib/(format|url-state|seo)['"]`
- `from ['"][^'"]*components/chrome/`
- `from ['"][^'"]*components/funnel/`
- `from ['"][^'"]*components/ads/`

In `STRBuyers-Tools/src/**/*.{astro,ts,tsx}`.

- [ ] **Step 5: Per import, update to @str/* package**

Same pattern as STRGuests Phase 1+2 wiring:
- format/url-state imports: drop-in path replacement
- seo imports: thread `siteConfig` as first arg to all functions
- chrome/funnel imports: path replacement + add `siteConfig={siteConfig}` prop
- For STRBuyers's Sidebar (uses tools.json): replace with `@str/ui-chrome/AppSidebar` + pass `items` mapped from tools.json (same shape as STRGuests Task 2)

**SPECIAL: STRBuyers has 1 buildItemList callsite.** Update it to wrap items: `buildItemList(siteConfig, { name: '<list name>', items: [...] })`.

**SPECIAL: STRBuyers has outlier FunnelBand (38 lines) and ClusterFunnelBlock (73 lines).** When using `<FunnelBand>`, use the named slot: `<FunnelBand siteConfig={siteConfig}><slot name="funnel-banner-override">{/* STRBuyers city-page custom variant */}</slot></FunnelBand>`. OR keep the in-tree variants and only delete the matching baseline ones — implementer judgment based on whether the slot pattern produces the same output.

- [ ] **Step 6: Delete old in-tree files**

```bash
git rm STRBuyers-Tools/src/lib/format.ts \
       STRBuyers-Tools/src/lib/url-state.ts \
       STRBuyers-Tools/src/lib/seo.ts \
       STRBuyers-Tools/src/components/chrome/*.astro \
       STRBuyers-Tools/src/components/funnel/*.astro \
       STRBuyers-Tools/src/components/ads/AdSlot.astro
```

(Keep ANY component file that doesn't have a shared equivalent — e.g., site-specific landing page widgets.)

- [ ] **Step 7: Build + test + visual regression**

```bash
cd STRBuyers-Tools
pnpm typecheck 2>&1 | tail -10
pnpm build 2>&1 | grep "page" | tail -1
pnpm test 2>&1 | grep "Tests" | head -1
pnpm server:test 2>&1 | grep "Tests" | head -1
pnpm exec playwright test --project=visual 2>&1 | tail -10
cd ..
```

Expected:
- typecheck clean
- build at parity (~244 pages — verify with baseline)
- main tests 84/84
- server tests 7/7
- visual regression 5/5 pass

If visual diff > 0.1% on FunnelBand or ClusterFunnelBlock: STRBuyers's outlier variants don't match the package output via slots. Either:
- Update package's FunnelBand/ClusterFunnelBlock to support the richer behavior, OR
- Keep STRBuyers's variants in-tree and only delete the simpler chrome files

- [ ] **Step 8: Commit**

```bash
git add STRBuyers-Tools/
git commit -m "feat(strbuyers): consume @str/format @str/url-state @str/seo @str/ui-chrome @str/ui-funnel

Site config moved to src/data/site.config.ts.
Removed in-tree lib + chrome + funnel + ads files.
buildItemList caller updated to {name, items[]} wrapper shape.
FunnelBand/ClusterFunnelBlock: <strategy used — slot override or kept in-tree>.
Visual regression 5/5 baselines preserved.
Tests preserved at 84/84 (+ 7/7 server)."
```

---

## STRHost wiring

### Task 5: Capture STRHost visual baseline

Same pattern as Task 3, for STRHost. 5 representative pages:

```ts
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'profit', path: '/profit-calculator' },
  { name: 'revpar', path: '/revpar-calculator' },
  { name: 'cohost', path: '/cohost-split-calculator' },
  { name: 'lodging-tax', path: '/lodging-tax/california/' },  // sample state
];
```

Generate baselines, verify, commit:
```bash
git add STRHost-Tools/playwright.config.ts STRHost-Tools/tests/visual/
git commit -m "test(strhost): visual regression baselines (pre-Phase-3 wiring)"
```

### Task 6: Wire STRHost (mirror Task 4)

Same pattern as Task 4, for STRHost. Differences from STRBuyers:
- 73 pages baseline (vs 244)
- 73 tests (no server tests)
- **2 buildItemList callsites** to update (vs STRBuyers's 1)
- **RelatedPosts.astro stays in-tree** (only STRGuests + STRHost have it; out of @str/ui-funnel scope per Phase 2 decision)
- No FunnelBand outlier (STRHost's is 26 lines, close to canonical)

Single commit:
```bash
git commit -m "feat(strhost): consume @str/format @str/url-state @str/seo @str/ui-chrome @str/ui-funnel

Site config + 2 buildItemList wrapper updates. RelatedPosts.astro retained
in-tree (only STRGuests + STRHost; out of @str/ui-funnel scope this phase).
Visual regression 5/5 preserved. Tests 73/73."
```

---

## STROps wiring (the hardest)

### Task 7: Capture STROps visual baseline + assess gaps

STROps is the heaviest reconciliation:
- Header 22 vs canonical 61
- Footer 49 vs canonical 62
- Layout MISSING — uses `src/layouts/Layout.astro` instead
- Wordmark MISSING
- ClusterFunnelBlock MISSING
- FunnelBand 9 lines vs canonical 25
- All funnel components 1/2 to 1/3 size of canonical
- Sidebar uses hardcoded array (not tools.json) → use `@str/ui-chrome/AppSidebar` with `description` omitted (1-line nav mode)

**Critical pre-wiring decision:** STROps's existing Layout component is at `src/layouts/Layout.astro` (different location from STRGuests-pattern `src/components/chrome/Layout.astro`). Adapter strategy:

**Option A (recommended):** Keep STROps's `src/layouts/Layout.astro` as the page shell wrapper; have IT internally use `<Header>`, `<Footer>`, `<Sidebar>` from `@str/ui-chrome` for the chrome elements. STROps's Layout becomes a thin shell that injects shared chrome.

**Option B:** Replace STROps's Layout entirely with `@str/ui-chrome/Layout`. Higher risk (significant existing styles likely in STROps Layout).

**Decide before starting Task 8.** Capture this decision in a commit message.

- [ ] **Step 1: Update playwright.config.ts** (STROps may not have one — check; if not, write it from scratch)

- [ ] **Step 2: Write visual.spec.ts**

5 pages:
```ts
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'turnover', path: '/turnover-scheduler' },
  { name: 'cleaner-dispatch', path: '/cleaner-dispatch' },
  { name: 'maintenance-task', path: '/maintenance/dryer-vent-clean/' },
  { name: 'blog-post', path: '/blog/airbnb-turnover-gap/' },
];
```

- [ ] **Step 3: Generate baselines + verify match + commit**

(Same shape as Task 3 / Task 5.)

### Task 8: Wire STROps (heavier reconciliation)

**Files:**
- Modify: `STROps-Tools/package.json` (add 5 deps; STROps lacks email-gate, so 5 not 6)
- Create: `STROps-Tools/src/data/site.config.ts`
- Delete: `STROps-Tools/src/lib/format.ts`, `url-state.ts`, `seo.ts`
- Delete: `STROps-Tools/src/components/chrome/Header.astro`, `Footer.astro`, `Sidebar.astro`, `FunnelBand.astro`
- Delete: `STROps-Tools/src/components/funnel/*.astro`
- Delete: `STROps-Tools/src/components/ads/AdSlot.astro`
- Modify: `STROps-Tools/src/layouts/Layout.astro` per Option A — internally use shared chrome
- Modify: every page importing the deleted files

- [ ] **Step 1: Add 5 deps to package.json**

(All except email-gate.)

- [ ] **Step 2: Reinstall**

- [ ] **Step 3: Create STROps site.config.ts**

Read existing chrome (smaller files; brand info likely in `Header.astro` and hardcoded `Sidebar.astro` array).

```ts
nav: [
  { label: 'Turnover scheduler', href: '/turnover-scheduler' },
  { label: 'Cleaner dispatch', href: '/cleaner-dispatch' },
  { label: 'Smart lock codes', href: '/smart-lock-codes' },
  { label: 'Linen par calculator', href: '/linen-par-calculator' },
  { label: 'Restock calculator', href: '/restock-calculator' },
  { label: 'Damage cost lookup', href: '/damage-cost-lookup' },
  // ... rest from STROps Sidebar's hardcoded array
],
```

- [ ] **Step 4: Modify `src/layouts/Layout.astro` to use shared chrome (Option A)**

Read the existing Layout. Identify where it renders header/footer/sidebar slots. Replace with imports from `@str/ui-chrome`:

```astro
---
// Before STROps Layout had hardcoded structure;
// After:
import Header from '@str/ui-chrome/Header.astro';
import Footer from '@str/ui-chrome/Footer.astro';
import Sidebar from '@str/ui-chrome/AppSidebar.astro';
import { siteConfig } from '@/data/site.config';

const sidebarItems = siteConfig.nav.map(item => ({
  slug: item.href.replace(/^\//, ''),
  label: item.label,
}));
---
<html>
  <head>{/* ...existing meta... */}</head>
  <body>
    <Header siteConfig={siteConfig} />
    <main>
      <slot />
    </main>
    <Sidebar siteConfig={siteConfig} items={sidebarItems} current={Astro.props.current} />
    <Footer siteConfig={siteConfig} />
  </body>
</html>
```

(Adjust based on STROps's actual existing structure.)

- [ ] **Step 5: Update Tier 1 imports** (format/url-state/seo) per the established pattern

- [ ] **Step 6: Delete in-tree chrome/funnel/ads files**

KEEP: STROps's `src/layouts/Layout.astro` (now uses shared chrome internally), and any STROps-specific components without shared equivalents.

- [ ] **Step 7: Build + test + visual regression**

```bash
cd STROps-Tools
pnpm typecheck 2>&1 | tail -10
pnpm build 2>&1 | grep "page" | tail -1
pnpm test 2>&1 | grep "Tests" | head -1
pnpm exec playwright test --project=visual 2>&1 | tail -10
cd ..
```

Expected:
- 105 pages (per baseline)
- 34/34 tests
- 5/5 visual pass

If visual fails: most likely cause is the Layout adapter producing different markup than the original Layout. Iterate on `src/layouts/Layout.astro` until visual diff is within tolerance.

If multiple visual baselines need updating because STROps's existing chrome had genuine bugs/inconsistencies that the shared chrome fixes: document explicitly per page and update baselines with reasoning.

- [ ] **Step 8: Commit**

```bash
git add STROps-Tools/
git commit -m "feat(strops): consume @str/format @str/url-state @str/seo @str/ui-chrome @str/ui-funnel

Site config + Layout adapter pattern (src/layouts/Layout.astro now uses
shared chrome internally; preserves STROps's existing layout structure).
AppSidebar in 1-line nav mode (description omitted; matches STROps's
historical hardcoded array shape).
Visual regression: <N>/<N> preserved [+ <M> intentionally updated where
STROps had pre-existing chrome bugs that shared chrome fixes; documented
in PR description]."
```

---

## Phase 3 verification & exit

### Task 9: Final verification + Phase 3 exit doc

**Files:**
- Modify: `docs/superpowers/plans/phase-3-baseline.md` (append exit section)

- [ ] **Step 1: Run full verification across all packages + apps**

```bash
echo "=== Packages ==="
for pkg in format url-state seo email-gate ui-chrome ui-funnel; do
  echo "-- @str/$pkg --"
  cd "packages/$pkg" && pnpm test 2>&1 | grep "Tests" | head -1 && pnpm typecheck 2>&1 | tail -3 && cd ../..
done

echo ""
echo "=== Apps ==="
for d in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools tools/empire-console; do
  echo "-- $d --"
  cd "$d" && pnpm build 2>&1 | grep "page" | tail -1 && pnpm test 2>&1 | grep "Tests" | head -1 && cd - > /dev/null
done

cd STRBuyers-Tools && pnpm server:test 2>&1 | grep "Tests" | head -1 && cd ..

echo "=== Visual regression (per app, 5 pages each) ==="
for d in STRGuests-Tools STRBuyers-Tools STRHost-Tools STROps-Tools; do
  echo "-- $d --"
  cd "$d" && pnpm exec playwright test --project=visual 2>&1 | tail -3 && cd ..
done
```

Expected:
- All 6 packages: tests + typecheck pass (~290+ tests)
- All 5 apps: build + tests preserved at baseline
- All 4 wired apps: 5/5 visual regression pass

- [ ] **Step 2: Append exit section to baseline doc**

```markdown
---

## Phase 3 complete — final verification

**Captured:** <date>
**SHA:** <git rev-parse HEAD>

| Package | Tests | Typecheck |
|---|---|---|
| @str/format | 103/103 | PASS |
| @str/url-state | 76/76 | PASS |
| @str/seo | 86/86 | PASS |
| @str/email-gate | 11/11 | PASS |
| @str/ui-chrome | 7/7 (added AppSidebar) | PASS |
| @str/ui-funnel | 5/5 | PASS |

| App | Build | Pages | Tests | Visual | Notes |
|---|---|---|---|---|---|
| STROps-Tools | PASS | <N> | <N>/<N> | 5/5 | Wired (Layout adapter pattern) |
| STRGuests-Tools | PASS | <N> | <N>/<N> | 5/5 | Wired Phase 1+2; AppSidebar migrated to shared in Task 2 |
| STRBuyers-Tools | PASS | <N> | <N>/<N> + 7/7 server | 5/5 | Wired Phase 3 |
| STRHost-Tools | PASS | <N> | <N>/<N> | 5/5 | Wired Phase 3 |
| tools/empire-console | PASS | <N> | <N>/<N> | — | Unchanged |

**Phase 3 exit criteria met:**
- [x] All 4 STR-Tools apps consume @str/* shared packages
- [x] AppSidebar extracted to @str/ui-chrome (replaces per-app duplicates)
- [x] buildItemList callers updated across all apps (3 sites total)
- [x] Visual regression preserved across all 4 apps (within 0.1% tolerance)

**Decisions made during Phase 3:**

1. **STROps Layout adapter pattern:** Kept STROps's `src/layouts/Layout.astro` as page shell wrapper using shared chrome internally, rather than replacing entirely with `@str/ui-chrome/Layout`. Lower risk; preserved STROps-specific layout features.
2. **AppSidebar canonical extracted to @str/ui-chrome:** Single shared component handles both 2-line card (description present) and 1-line nav (description absent) modes. STRGuests, STRBuyers, STRHost use card mode; STROps uses nav mode.
3. **email-gate not wired anywhere:** STRGuests stays on ESP webhook in-tree; STRBuyers/STRHost/STROps don't currently collect email. `@str/email-gate` is dormant — the package is built and tested but has zero consumers. Future use: when first MySQL-backed email collection feature is needed.
4. **STRBuyers FunnelBand/ClusterFunnelBlock outliers:** Resolved via <strategy used in Task 4 Step 7>.
5. **RelatedPosts.astro:** Retained in-tree on STRGuests + STRHost (only 2 consumers, plus already-decided in Phase 2 not to extract).

**Migration complete. Open follow-up decisions for future work:**

- **@str/url-state dual-API canonicalization:** All apps now wired; can deprecate one API. STRGuests/STRBuyers/STRHost use `serialize`/`parse`; STROps uses `encodeState`/`decodeState`. Either pick one as canonical and migrate STROps OR keep dual indefinitely.
- **@str/email-gate architecture:** Decide whether to add ESP-webhook adapter (so STRGuests can adopt @str/email-gate without breaking) OR accept that the package is MySQL-only and STRGuests stays on its in-tree webhook.
- **Single `SiteId` source of truth:** Currently in @str/seo + @str/email-gate. Consolidate into @str/seo; have @str/email-gate consume from there.
- **`@str/ui-chrome/Sidebar`:** Now zero consumers (all apps use `AppSidebar`). Decide: remove or keep as alternative API.
- **vitest 3 upgrade across packages** (Phase 2 carry-forward) — would simplify the Astro + experimental_AstroContainer test setup.
- **empire-console upgrade from Astro 4.16 → 6.x** — separate concern, never in scope.

The 4-app monorepo migration is complete. All shared infrastructure built and proven.
```

REPLACE all `<N>` placeholders with actuals.

- [ ] **Step 3: Commit + sanity-check log**

```bash
git add docs/superpowers/plans/phase-3-baseline.md
git commit -m "docs(phase-3): record post-fanout verification

All 4 STR-Tools apps now consume the 6 shared @str/* packages.
AppSidebar extracted to @str/ui-chrome. Visual regression preserved
across all apps within 0.1% tolerance. Migration complete; future
work documented as carry-forwards."
```

```bash
git log --oneline c0af7a6..HEAD | head -25
```

Expected: ~15-20 commits in clean sequence.

---

## Phase 3 done. Migration complete.

When P3 is verified and merged, the 4-app monorepo migration spec is fully delivered. Future work items (dual-API canonicalization, email-gate architecture, etc.) can ship as standalone PRs without phase-style coordination.
