# Phase 0: STROps Astro 4→6 Upgrade + Vitest 2.x Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade STROps-Tools from Astro 4.16 → 6.x, migrate its content collections to the v2 loader API, and standardize all 4 apps onto vitest 2.x — so STROps reaches version parity ahead of the workspace migration in Phase 1.

**Architecture:** Standalone upgrade per-app. No workspace exists yet. Each app keeps its own lockfile and tooling. Work is sequenced: STROps first (the heaviest lift), then vitest 2.x bumps for the other three apps.

**Tech Stack:** Astro 6.x, `@astrojs/*` v5+, `astro:content` v2 loader API (`glob` from `astro/loaders`), vitest 2.x, pnpm 9.x.

---

## Reference: Spec

Source design: [docs/superpowers/specs/2026-05-10-shared-packages-migration-design.md](../specs/2026-05-10-shared-packages-migration-design.md), Section 6 → Phase 0.

## Reference: Astro v5 breaking changes that apply to STROps

These are the changes that will surface during the upgrade. Linked here so the engineer doesn't have to discover them mid-task:

1. **Content collections v2 (loader API):** `defineCollection({ type: 'content', ... })` is deprecated. Replace with `defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/<name>' }), schema })` using `glob` from `astro/loaders`. Reference: https://docs.astro.build/en/guides/content-collections/
2. **`getCollection` slug behavior:** Returned entries now expose `entry.id` (path-derived) instead of `entry.slug`. If consumers reference `entry.slug`, they need updating to `entry.id` (or compute their own slug from `entry.id`).
3. **`astro:assets` (Image component):** Image import path stable; `inferSize` and metadata defaults shifted. Pages that import images via `import x from '../path/img.png'` and pass to `<Image src={x} />` continue to work.
4. **`astro check`:** stricter type checking — may surface latent type issues. Fix as discovered.
5. **Vite version:** Astro 5 ships with Vite 5; Astro 6 ships with Vite 6. `vite.ssr.noExternal` config still applies.

## Reference: Vitest 1→2 breaking changes

1. `test.skip()` and `it.skip()` now require a reason string in some configurations — runtime warning, not error.
2. `vi.mocked()` typing tightened.
3. `--coverage.provider=c8` removed; default is `v8`. Most projects unaffected.
4. Reporter API renamed methods. Custom reporters need updates; default reporters fine.

## File-by-file plan

| File | Action | Purpose |
|---|---|---|
| `STROps-Tools/package.json` | Modify | Bump astro, @astrojs/*, vitest |
| `STROps-Tools/pnpm-lock.yaml` | Regenerate | New resolutions |
| `STROps-Tools/src/content/config.ts` | Rewrite | Migrate to v2 loader API |
| `STROps-Tools/src/pages/**/*.astro` | Touch as needed | Fix `entry.slug` → `entry.id` if used |
| `STROps-Tools/astro.config.mjs` | Verify only | Should not need changes |
| `STRGuests-Tools/package.json` | Modify | Bump vitest 1.6 → 2.x |
| `STRBuyers-Tools/package.json` | Modify | Bump vitest 1.6 → 2.x |
| `STRHost-Tools/package.json` | Modify | Bump vitest 1.6 → 2.x |
| `docs/superpowers/plans/phase-0-baseline.md` | Create | Capture pre-upgrade smoke evidence |

---

## Pre-flight

### Task P0: Capture pre-upgrade baseline evidence

**Files:**
- Create: `docs/superpowers/plans/phase-0-baseline.md`

**Why:** Before changing anything, capture exactly what currently works. Phase 0's exit criterion is "STROps tests pass, e2e green, build succeeds, OG generation works" — but we need a record of what passing looks like *today* so we can confirm parity post-upgrade.

- [ ] **Step 1: Confirm clean working tree**

```bash
git status
```
Expected: `nothing to commit, working tree clean`. If not, stash or commit unrelated changes first.

- [ ] **Step 2: Install STROps deps and capture build output**

```bash
cd STROps-Tools
pnpm install
pnpm build 2>&1 | tee /tmp/strops-build-baseline.log
cd ..
```
Expected: build succeeds (exit 0). Note the elapsed time and any warnings.

- [ ] **Step 3: Capture STROps test output**

```bash
cd STROps-Tools
pnpm test 2>&1 | tee /tmp/strops-test-baseline.log
cd ..
```
Expected: all tests pass. Note: vitest 2.1 already installed in STROps; baseline is intentional.

- [ ] **Step 4: Capture STROps e2e output (optional if Playwright browsers not installed)**

```bash
cd STROps-Tools
pnpm exec playwright install --with-deps chromium 2>&1 | tail -5
pnpm test:e2e 2>&1 | tee /tmp/strops-e2e-baseline.log || echo "E2E may need server running"
cd ..
```
Expected: tests run; some may need a dev server. Record passing count for parity check.

- [ ] **Step 5: Write baseline doc**

Write `docs/superpowers/plans/phase-0-baseline.md` containing:
```markdown
# Phase 0 Baseline (pre-upgrade)

**Captured:** <YYYY-MM-DD HH:MM>
**Branch:** <git rev-parse --abbrev-ref HEAD>
**SHA:** <git rev-parse HEAD>

## STROps-Tools

- Astro version: 4.16.x (per package.json)
- Vitest version: 2.1.x
- Build: <PASS/FAIL — elapsed time>
- Unit tests: <N passed / N total>
- E2E tests: <N passed / N total or N/A>

## Other apps (vitest 1.6.0)

- STRGuests-Tools: <build PASS/FAIL, tests N/N>
- STRBuyers-Tools: <build PASS/FAIL, tests N/N>
- STRHost-Tools: <build PASS/FAIL, tests N/N>

(Captured by running `pnpm install && pnpm build && pnpm test` in each app dir.)
```

Fill in actual numbers from the captured logs.

- [ ] **Step 6: Capture other 3 apps' baseline (one at a time)**

```bash
for d in STRGuests-Tools STRBuyers-Tools STRHost-Tools; do
  echo "=== $d ==="
  cd "$d"
  pnpm install 2>&1 | tail -3
  pnpm build 2>&1 | tail -5
  pnpm test 2>&1 | tail -10
  cd ..
done
```
Update baseline doc with results.

- [ ] **Step 7: Commit baseline doc**

```bash
git add docs/superpowers/plans/phase-0-baseline.md
git commit -m "docs(phase-0): capture pre-upgrade baseline for all 4 apps"
```

---

## STROps Astro 4 → 6 upgrade

### Task 1: Bump astro + @astrojs/* deps in STROps

**Files:**
- Modify: `STROps-Tools/package.json`

- [ ] **Step 1: Edit package.json — bump dependencies**

In `STROps-Tools/package.json`, replace these dependency versions:

```json
"dependencies": {
  "@astrojs/mdx": "^5.0.4",
  "@astrojs/react": "^5.0.4",
  "@astrojs/sitemap": "^3.7.2",
  "@astrojs/tailwind": "^6.0.2",
  "astro": "^6.2.2",
  "ics": "^3.8.1",
  "mdast-util-to-string": "^4.0.0",
  "pdf-lib": "^1.17.1",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
},
```

Replace `devDependencies` entry for `@astrojs/check`:
```json
"@astrojs/check": "^0.9.9",
```
(Keep at ^0.9.9; compatible with Astro 6.)

- [ ] **Step 2: Reinstall**

```bash
cd STROps-Tools
rm -rf node_modules pnpm-lock.yaml
pnpm install 2>&1 | tail -20
cd ..
```
Expected: install succeeds. Peer-dep warnings about React/Vite are normal; hard errors are not.

- [ ] **Step 3: Try a build — capture failure**

```bash
cd STROps-Tools
pnpm build 2>&1 | tee /tmp/strops-build-after-bump.log
cd ..
```
Expected: **build fails** with content-collection deprecation errors (Task 2 fixes this) and possibly other Astro 5 breakages (Tasks 3-5 fix as discovered).

- [ ] **Step 4: Commit the bump (even though build is broken)**

This is intentional — splits the dep bump from the code migration so each commit is reviewable.

```bash
git add STROps-Tools/package.json STROps-Tools/pnpm-lock.yaml
git commit -m "chore(strops): bump astro 4.16 -> 6.2 and @astrojs/* to v5+

Build is intentionally broken at this commit; subsequent commits
migrate content collections and fix Astro 5+ breaking changes."
```

---

### Task 2: Migrate STROps content collections to v2 loader API

**Files:**
- Modify: `STROps-Tools/src/content/config.ts`

- [ ] **Step 1: Rewrite content config**

Replace the entire contents of `STROps-Tools/src/content/config.ts` with:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const maintenance = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/maintenance' }),
  schema: z.object({
    narrativeOverride: z.boolean().default(true),
  }),
});

const replacement = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/replacement' }),
  schema: z.object({
    narrativeOverride: z.boolean().default(true),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(100).max(170),
    datePublished: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dateModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    author: z.string().default('Daniel Harrison'),
    category: z.enum(['operations', 'turnover', 'cleaning', 'access', 'supply', 'maintenance', 'damage']),
    readMinutes: z.number().int().positive(),
    relatedTools: z.array(z.string()).default([]),
    magnet: z.enum(['cleaner-sop', 'maintenance-checklist', 'supply-par']).default('cleaner-sop'),
    keywords: z.array(z.string()).default([]),
    primaryKeyword: z.string().optional(),
    keyTakeaways: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    ogImage: z.string().optional(),
  }),
});

export const collections = { maintenance, replacement, tools, posts };
```

Key changes from original:
- Removed `type: 'content'` (deprecated).
- Added `loader: glob({ pattern: '**/*.mdx', base: './src/content/<name>' })` to each collection.
- Imports `glob` from `astro/loaders`.

- [ ] **Step 2: Try a build to surface remaining breakages**

```bash
cd STROps-Tools
pnpm build 2>&1 | tee /tmp/strops-build-after-collections.log
cd ..
```
Expected outcomes:
- **If build passes:** great, skip to Step 4.
- **If build fails on `entry.slug`:** Task 3 below.
- **If build fails on something else:** capture the error in Task 5.

- [ ] **Step 3: Commit the content config migration**

```bash
git add STROps-Tools/src/content/config.ts
git commit -m "feat(strops): migrate content collections to v2 loader API

Replaces deprecated 'type: content' with glob loader from astro/loaders.
Required by Astro 5+; schemas unchanged."
```

- [ ] **Step 4: If build passed, skip to Task 6. Otherwise proceed.**

---

### Task 3: Fix `entry.slug` → `entry.id` in pages (only if Task 2 build surfaced this)

**Files:**
- Modify: any `.astro` file that references `.slug` on a content entry. Locate with grep.

- [ ] **Step 1: Find references**

```
Use Grep tool: pattern: "\\.slug\\b", path: "STROps-Tools/src", glob: "**/*.{astro,ts,tsx}"
```
Expected: list of files that read `entry.slug` or `post.slug` etc.

- [ ] **Step 2: Update each match**

For each `entry.slug` reference found, decide:

- **Replace with `entry.id`** if the slug was just used as a URL segment (most common case). `entry.id` in v2 is the path-derived ID (e.g., `airbnb-turnover-gap` for `posts/airbnb-turnover-gap.mdx`).
- **Replace with `entry.id.replace(/\.mdx$/, '')`** if `entry.id` includes the file extension (verify by adding a `console.log(entry.id)` temporarily during development).

Example replacement in a hypothetical `pages/blog/[slug].astro`:

```astro
---
// Before:
const posts = await getCollection('posts');
return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));

// After:
const posts = await getCollection('posts');
return posts.map(post => ({ params: { slug: post.id }, props: { post } }));
---
```

- [ ] **Step 3: Build to verify fix**

```bash
cd STROps-Tools && pnpm build 2>&1 | tail -20 && cd ..
```
Expected: build proceeds past the slug error. New errors → Task 4 or 5.

- [ ] **Step 4: Commit**

```bash
git add STROps-Tools/src/
git commit -m "fix(strops): replace deprecated entry.slug with entry.id

Astro 5+ content collections expose .id (path-derived) instead of .slug."
```

---

### Task 4: Fix any astro:assets or image import breakages (only if surfaced)

**Files:** depends on what build fails on. Likely candidates: any `.astro` file using `<Image>` from `astro:assets`.

- [ ] **Step 1: Identify**

If Task 2 or 3 surfaced an error about Image / astro:assets, capture the error message and the file path.

- [ ] **Step 2: Apply fix per Astro 5 image guide**

Common fixes:
- `import { Image } from 'astro:assets';` — unchanged.
- `<Image src={imported} alt="..." />` — unchanged for static imports.
- If the error is about `inferSize`, set explicit `width` and `height` props.
- If the error is about a remote image, add `image.domains` or `image.remotePatterns` to `astro.config.mjs`.

Reference: https://docs.astro.build/en/guides/images/

- [ ] **Step 3: Build, verify, commit**

```bash
cd STROps-Tools && pnpm build 2>&1 | tail -20 && cd ..
git add STROps-Tools/
git commit -m "fix(strops): <specific image issue and resolution>"
```

---

### Task 5: Resolve any other surfaced Astro 5+ breakages

**Files:** unknown until errors surface.

This is a catch-all. If `pnpm build` in STROps still fails after Tasks 2-4, the error will name a specific API or file.

- [ ] **Step 1: Capture the error verbatim**

```bash
cd STROps-Tools && pnpm build 2>&1 | tail -40 > /tmp/strops-residual-error.log && cd ..
cat /tmp/strops-residual-error.log
```

- [ ] **Step 2: Diagnose against the Astro 5 upgrade guide**

Reference: https://docs.astro.build/en/guides/upgrade-to/v5/

If the error is **not in the upgrade guide**, treat it as a code bug surfaced by stricter checks. Read the offending file and fix.

- [ ] **Step 3: Apply minimal fix; build; commit**

```bash
cd STROps-Tools && pnpm build 2>&1 | tail -20 && cd ..
git add STROps-Tools/
git commit -m "fix(strops): <specific issue resolved>"
```

Repeat Task 5 until `pnpm build` exits 0 cleanly.

---

### Task 6: Verify STROps build is fully green

**Files:** none modified — verification only.

- [ ] **Step 1: Clean rebuild**

```bash
cd STROps-Tools
rm -rf dist .astro
pnpm build 2>&1 | tee /tmp/strops-build-final.log
cd ..
```
Expected: exit 0, no warnings about deprecated APIs.

- [ ] **Step 2: Confirm OG generation works**

```bash
cd STROps-Tools
ls public/og/ 2>&1 | head
node scripts/build-og.mjs 2>&1 | tail -10
ls public/og/ 2>&1 | head
cd ..
```
Expected: script succeeds; `public/og/` populated with images. (This is one of Phase 0's exit criteria.)

- [ ] **Step 3: Compare page count vs baseline**

```bash
find STROps-Tools/dist -name "*.html" | wc -l
```
Compare to baseline doc. Should match (no pages should have been dropped by the migration).

- [ ] **Step 4: Commit final build artifact baseline (no code change, just confirmation)**

If output matches baseline, no commit needed. If pages dropped/added, investigate before proceeding.

---

### Task 7: Run STROps tests and fix any breakages

**Files:** depends on what fails.

- [ ] **Step 1: Run unit tests**

```bash
cd STROps-Tools
pnpm test 2>&1 | tee /tmp/strops-test-after-upgrade.log
cd ..
```

- [ ] **Step 2: Compare to baseline**

If test count and pass/fail match baseline (`docs/superpowers/plans/phase-0-baseline.md`), proceed to Step 5.

- [ ] **Step 3: For each newly-failing test, diagnose**

Common causes after upgrade:
- Test imports `astro:content` — needs `getCollection`/`getEntry` updated for v2 surface.
- Test mocks `entry.slug` — update to `entry.id`.
- Test snapshot — page output may have changed; regenerate with `pnpm test -- -u` only after manual visual check.

- [ ] **Step 4: Fix and commit per failing test**

One commit per logical fix:
```bash
git add STROps-Tools/tests/
git commit -m "test(strops): <specific fix>"
```

- [ ] **Step 5: Run e2e tests**

```bash
cd STROps-Tools
pnpm exec playwright install --with-deps chromium 2>&1 | tail -3
pnpm test:e2e 2>&1 | tee /tmp/strops-e2e-after-upgrade.log
cd ..
```

- [ ] **Step 6: Fix any e2e regressions**

Apply the same diagnose-and-fix loop as unit tests. Commit per fix.

- [ ] **Step 7: Verify final state matches baseline**

Update `docs/superpowers/plans/phase-0-baseline.md` with a "Post-upgrade" section showing the same metrics. Pass counts must match or exceed baseline.

```bash
git add docs/superpowers/plans/phase-0-baseline.md
git commit -m "docs(phase-0): record STROps post-upgrade verification"
```

---

## Vitest 2.x standardization

### Task 8: Bump STRGuests vitest 1.6 → 2.x

**Files:**
- Modify: `STRGuests-Tools/package.json`

- [ ] **Step 1: Edit package.json**

In `STRGuests-Tools/package.json`, change:
```json
"vitest": "^1.6.0",
```
to:
```json
"vitest": "^2.1.1",
```

- [ ] **Step 2: Reinstall and run tests**

```bash
cd STRGuests-Tools
rm -rf node_modules pnpm-lock.yaml
pnpm install 2>&1 | tail -10
pnpm test 2>&1 | tee /tmp/strguests-vitest2.log
cd ..
```
Expected: install succeeds; tests run.

- [ ] **Step 3: Fix any vitest 2 breakages**

Most likely surfacing points:
- `vi.mocked()` typing — add explicit type if TypeScript complains.
- Custom reporter — only matters if a custom reporter exists in `vitest.config.ts`. If so, check vitest 2 reporter API.
- `--coverage.provider=c8` in config or scripts → change to `v8`.

Search for these:
```
Use Grep tool: pattern: "c8|vi\\.mocked", path: "STRGuests-Tools", glob: "**/*.{ts,js,json,mjs}"
```

Apply minimal fixes per surfaced issue.

- [ ] **Step 4: Verify tests pass**

```bash
cd STRGuests-Tools && pnpm test 2>&1 | tail -10 && cd ..
```
Expected: pass count ≥ baseline.

- [ ] **Step 5: Commit**

```bash
git add STRGuests-Tools/package.json STRGuests-Tools/pnpm-lock.yaml
git commit -m "chore(strguests): bump vitest 1.6 -> 2.1"
```

(Add any test fixes in the same commit if they're trivial; separate commit if substantive.)

---

### Task 9: Bump STRBuyers vitest 1.6 → 2.x

**Files:**
- Modify: `STRBuyers-Tools/package.json`

- [ ] **Step 1: Edit package.json**

In `STRBuyers-Tools/package.json`, change:
```json
"vitest": "^1.6.0",
```
to:
```json
"vitest": "^2.1.1",
```

- [ ] **Step 2: Reinstall and run tests**

```bash
cd STRBuyers-Tools
rm -rf node_modules pnpm-lock.yaml
pnpm install 2>&1 | tail -10
pnpm test 2>&1 | tee /tmp/strbuyers-vitest2.log
cd ..
```

- [ ] **Step 3: Fix any vitest 2 breakages**

Same checklist as Task 8 Step 3.

- [ ] **Step 4: Verify tests pass**

```bash
cd STRBuyers-Tools && pnpm test 2>&1 | tail -10 && cd ..
```

- [ ] **Step 5: Run server tests too**

STRBuyers has a separate server vitest config:
```bash
cd STRBuyers-Tools && pnpm server:test 2>&1 | tail -10 && cd ..
```

- [ ] **Step 6: Commit**

```bash
git add STRBuyers-Tools/package.json STRBuyers-Tools/pnpm-lock.yaml
git commit -m "chore(strbuyers): bump vitest 1.6 -> 2.1"
```

---

### Task 10: Bump STRHost vitest 1.6 → 2.x

**Files:**
- Modify: `STRHost-Tools/package.json`

- [ ] **Step 1: Edit package.json**

In `STRHost-Tools/package.json`, change:
```json
"vitest": "^1.6.0",
```
to:
```json
"vitest": "^2.1.1",
```

- [ ] **Step 2: Reinstall and run tests**

```bash
cd STRHost-Tools
rm -rf node_modules pnpm-lock.yaml
pnpm install 2>&1 | tail -10
pnpm test 2>&1 | tee /tmp/strhost-vitest2.log
cd ..
```

- [ ] **Step 3: Fix any vitest 2 breakages**

Same checklist as Task 8 Step 3.

- [ ] **Step 4: Verify tests pass**

```bash
cd STRHost-Tools && pnpm test 2>&1 | tail -10 && cd ..
```

- [ ] **Step 5: Commit**

```bash
git add STRHost-Tools/package.json STRHost-Tools/pnpm-lock.yaml
git commit -m "chore(strhost): bump vitest 1.6 -> 2.1"
```

---

## Phase 0 verification & exit

### Task 11: Final verification across all 4 apps

**Files:**
- Modify: `docs/superpowers/plans/phase-0-baseline.md` (append post-upgrade section)

- [ ] **Step 1: Sequential build + test for all 4 apps**

```bash
for d in STROps-Tools STRGuests-Tools STRBuyers-Tools STRHost-Tools; do
  echo "=== $d ==="
  cd "$d"
  pnpm build 2>&1 | tail -5
  pnpm test 2>&1 | tail -5
  cd ..
done
```

Expected: all 4 apps build and test successfully.

- [ ] **Step 2: Update baseline doc with post-upgrade metrics**

Append to `docs/superpowers/plans/phase-0-baseline.md`:

```markdown
---

## Post-upgrade (Phase 0 complete)

**Captured:** <YYYY-MM-DD HH:MM>
**SHA:** <git rev-parse HEAD>

| App | Astro | Vitest | Build | Unit tests |
|---|---|---|---|---|
| STROps-Tools | 6.2.x | 2.1.x | PASS | <N>/<N> |
| STRGuests-Tools | 6.2.x | 2.1.x | PASS | <N>/<N> |
| STRBuyers-Tools | 6.2.x | 2.1.x | PASS | <N>/<N> |
| STRHost-Tools | 6.2.x | 2.1.x | PASS | <N>/<N> |

**Phase 0 exit criteria met:**
- [x] STROps tests pass
- [x] STROps e2e green
- [x] STROps build succeeds
- [x] STROps OG generation works
- [x] All 4 apps on vitest 2.x
```

- [ ] **Step 3: Commit final verification**

```bash
git add docs/superpowers/plans/phase-0-baseline.md
git commit -m "docs(phase-0): record post-upgrade verification across all 4 apps

All 4 apps now on Astro 6.2 / vitest 2.1.
STROps reaches version parity ahead of Phase 1 workspace migration."
```

- [ ] **Step 4: Phase 0 complete — sanity-check git log**

```bash
git log --oneline main..HEAD
```
Expected: a clean sequence of commits (~10-15) telling a readable story:
- baseline capture
- STROps astro bump
- content config migration
- (any) entry.slug fixes
- (any) other Astro 5+ fixes
- STROps test fixes
- 3× vitest bumps
- final verification

If the log is messy, consider an interactive rebase BEFORE merging — but only if the user explicitly asks. Default: leave history as-is.

---

## Phase 0 done. Next:

When P0 is verified and merged, request the Phase 1 plan with:

> "Write the Phase 1 plan (workspace + Tier 1 packages)."
