# Phase 3 — Programmatic pages (maintenance + replacement)

**Goal:** Ship ~30 maintenance and ~50 replacement programmatic pages, two sortable indexes, and 5+5 long-form MDX narratives. Resolve the deep-links from Phase 2's `MaintenanceSchedule` (→ `/maintenance/{slug}/`) and `DamageCostLookup` (→ `/replace/{slug}/`).

**Source plan:** [`docs/superpowers/plans/2026-05-05-strops-tools.md`](../../../docs/superpowers/plans/2026-05-05-strops-tools.md), tasks 17–24.

**Requirements satisfied:** R4 (programmatic page system).

**Phase 1/2 dependencies:**

- `src/lib/types.ts` already locks `MaintenanceTask`, `TaskCatalog`, `ReplacementItem`, `ItemCatalog` — Task 17 + Task 21 only expand data, schema is closed.
- Phase 2 Task 16 wires `MaintenanceSchedule.tsx` to `src/data/maintenance-tasks-seed.json`. Phase 3 Task 17 introduces `src/data/tasks.json` and migrates the consumer.
- Phase 2 Task 15 wires `DamageCostLookup.tsx` to `src/data/damage-items.json`. Phase 3 Task 21 introduces `src/data/items.json` and migrates the consumer.
- MDX integration is already enabled in `astro.config.mjs` (`@astrojs/mdx`). Sister project `STRGuests-Tools` uses `import.meta.glob` per-MDX rather than Astro Content Collections — same pattern adopted here for consistency and zero collection-config overhead.

---

## Phase acceptance

- ~30 `/maintenance/{slug}/` pages render at build time
- ~50 `/replace/{slug}/` pages render at build time
- `/maintenance/` and `/replace/` indexes sortable (frequency / category / cost)
- 5 maintenance MDX + 5 replacement MDX bring per-page narrative; rest use template
- `MaintenanceSchedule` deep-links → `/maintenance/{slug}/` resolve
- `DamageCostLookup` deep-links → `/replace/{slug}/` resolve
- `pnpm typecheck` 0 errors
- `pnpm test` ≥88 green (88 baseline; expansion adds none initially — calc tests still consume seed-or-full catalog under the same shape)
- `pnpm build` clean static build with the new pages
- 9 commits total (this scaffold + tasks 17–24)

---

## Cross-cutting per-page acceptance pattern

- Every programmatic page renders inside `Layout.astro` with site chrome.
- JSON-LD: `WebApplication` (or `Article` where MDX present) + parent organization.
- Print stylesheet hides chrome (already wired in Phase 1).
- Every per-page surface ends with `EmailCaptureCard` + `STRLedgerCTA` + `ClusterFunnelBlock` (matches sister-cluster pattern).
- No sidebar on programmatic pages — sidebar is reserved for tool pages per Cluster Style Guide §5.

---

## Task 17 — Maintenance data expansion (`tasks.json`)

**Files:**
- `src/data/tasks.json` — full ~30-item catalog
- `src/components/calculators/MaintenanceSchedule.tsx` — point at `tasks.json`
- (no test changes — test fixture inline; full catalog not required by `buildSchedule()` API)

**Coverage targets:**
- HVAC: filter, AC tune-up, mini-split clean, vent clean
- Plumbing: water heater, garbage disposal, supply-line check, sump-pump test
- Exterior: gutters, pressure-wash, deck stain, roof inspection
- Appliances: dryer vent, fridge coils, dishwasher salt/seal, oven self-clean
- Safety: smoke/CO test, smoke battery, fire extinguisher, GFCI test, radon
- Seasonal: chimney sweep, outdoor faucet winterize, snow-blower service, AC cover

**Acceptance:** ≥28 entries in `tasks.json`; all entries pass `MaintenanceTask` type at typecheck; consumer renders without runtime error.

**Commit:** `feat(strops-tools): expand maintenance tasks data to ~30 items (Phase 3 Task 17)`

---

## Task 18 — Maintenance programmatic pages

**Files:**
- `src/pages/maintenance/[slug].astro` — Astro `getStaticPaths()` over `tasks.json`

**Page sections (template):**
- H1 + cadence pill + season badge
- Cost range, skill level, season
- Why it matters (consequences-of-skipping)
- Schedule snippet (next 4 occurrences from today)
- "Get the full schedule" CTA → `/maintenance-schedule/?focus={slug}`
- Optional MDX narrative slot (loaded via `import.meta.glob` if `src/content/maintenance/{slug}.mdx` exists)
- EmailCaptureCard + STRLedgerCTA + ClusterFunnelBlock

**Acceptance:** Build emits ~30 HTML files under `dist/maintenance/<slug>/index.html`. Deep-link from `MaintenanceSchedule` row click resolves.

**Commit:** `feat(strops-tools): maintenance programmatic pages (Phase 3 Task 18)`

---

## Task 19 — Maintenance index

**Files:**
- `src/pages/maintenance/index.astro`
- `src/components/programmatic/MaintenanceIndex.tsx` — sortable React island (frequency, category, cost)

**Sortable columns:** name · cadence (days) · season · cost (low) · skill.

**Acceptance:** `/maintenance/` lists every entry from `tasks.json` with row links to `/maintenance/{slug}/`. Sort by any column toggles asc/desc.

**Commit:** `feat(strops-tools): maintenance index page (Phase 3 Task 19)`

---

## Task 20 — Maintenance MDX collection (5 samples)

**Files:**
- `src/content/maintenance/hvac-filter-change.mdx`
- `src/content/maintenance/dryer-vent-clean.mdx`
- `src/content/maintenance/water-heater-flush.mdx`
- `src/content/maintenance/smoke-detector-test.mdx`
- `src/content/maintenance/gutter-clean.mdx`

**Pattern (per file):** ~400–700 word narrative. Why it matters in an STR specifically, how to do it (DIY vs pro decision), warning signs, vendor options. No frontmatter required — narrative slot is purely content; metadata stays in `tasks.json`.

**Acceptance:** Each MDX renders inside the programmatic-page narrative slot. Other 25 entries fall through to template-only.

**Commit:** `feat(strops-tools): maintenance MDX collection — 5 sample pages (Phase 3 Task 20)`

---

## Task 21 — Replacement data expansion (`items.json`)

**Files:**
- `src/data/items.json` — full ~50-item catalog
- `src/components/calculators/DamageCostLookup.tsx` — point at `items.json`

**Coverage targets:**
- Linens: sheet sets, towels, pillows, duvet, pillowcases, mattress topper
- Kitchen: cookware set, knife block, glassware set, plates set, mugs set, blender, kettle
- Bath: shower head, bath rug, hand towel, hair dryer, scale
- Furniture: queen/king mattresses, sofa, side table, dining table, dining chairs, bar stools, nightstand, dresser, bed frame
- Electronics: 55"/65" TV, sound bar, smart speaker, robot vac
- Decor: art print, mirror, throw pillow, throw blanket, area rug

**Acceptance:** ≥48 entries in `items.json`; consumer renders.

**Commit:** `feat(strops-tools): expand replacement items data to ~50 items (Phase 3 Task 21)`

---

## Task 22 — Replacement programmatic pages

**Files:**
- `src/pages/replace/[slug].astro` — Astro `getStaticPaths()` over `items.json`

**Page sections (template):**
- H1 + category pill
- Cost range (low / mid / high), lifespan, brand recs
- "What to look for" buyer's-eye paragraph (default copy from category playbook)
- AffiliateCard with stub vendor (rotate among `hostfully` / `ownerrez` / `hospitable` / `turno` from `affiliates.json`)
- "Look up another item" CTA → `/damage-cost-lookup/`
- Optional MDX narrative slot
- EmailCaptureCard + STRLedgerCTA + ClusterFunnelBlock

**Acceptance:** Build emits ~50 HTML files under `dist/replace/<slug>/index.html`. Deep-link from `DamageCostLookup` row click resolves.

**Commit:** `feat(strops-tools): replacement programmatic pages (Phase 3 Task 22)`

---

## Task 23 — Replacement index

**Files:**
- `src/pages/replace/index.astro`
- `src/components/programmatic/ReplacementIndex.tsx` — sortable (category, low cost, lifespan)

**Acceptance:** `/replace/` lists every entry from `items.json` with row links. Sort by any column toggles asc/desc. Category filter dropdown.

**Commit:** `feat(strops-tools): replacement index page (Phase 3 Task 23)`

---

## Task 24 — Replacement MDX collection (5 samples)

**Files:**
- `src/content/replacement/queen-mattress.mdx`
- `src/content/replacement/towel-set.mdx`
- `src/content/replacement/cookware-set.mdx`
- `src/content/replacement/55in-tv.mdx`
- `src/content/replacement/sofa.mdx`

**Pattern (per file):** ~400–700 word narrative. Buyer's-guide framing, durability tier discussion, when-to-replace signals, brand recs explained. No frontmatter required.

**Acceptance:** Each MDX renders. Other ~45 entries fall through to template-only.

**Commit:** `feat(strops-tools): replacement MDX collection — 5 sample pages (Phase 3 Task 24)`

---

## Phase 3 verification

```bash
pnpm typecheck
pnpm test
pnpm build
# Confirm:
#   - dist/maintenance/<slug>/index.html for every key in tasks.json
#   - dist/replace/<slug>/index.html for every key in items.json
#   - dist/maintenance/index.html and dist/replace/index.html exist
#   - 5 maintenance + 5 replacement narrative blocks render in their HTML output
```

After all tasks: update STATE.md (phase 3 complete, current phase = 4, current task = "Not yet started (Task 25: tools.json registry)"), update ROADMAP.md status table (Phase 3 → completed, Phase 4 → active). Final commit: `chore(strops-tools): mark Phase 3 complete`.

---

## Out of scope for this phase

- `tools.json` registry (Phase 4 Task 25)
- Lead magnet pages (Phase 4 Task 26)
- Landing page expansion (Phase 4 Task 27)
- Sitemap inclusion verification (Phase 4 Task 29 — sitemap integration auto-picks up new routes, but explicit verify stays Phase 4)
- OG image generation for /maintenance/* and /replace/* (Phase 4 Task 30)
- GA4 events on programmatic pages (Phase 5 Task 31)

---

## Tasks checklist

- [x] Task 17 — Maintenance data expansion (`tasks.json`)
- [x] Task 18 — Maintenance programmatic pages
- [x] Task 19 — Maintenance index
- [x] Task 20 — Maintenance MDX collection (5 samples)
- [x] Task 21 — Replacement data expansion (`items.json`)
- [x] Task 22 — Replacement programmatic pages
- [x] Task 23 — Replacement index
- [x] Task 24 — Replacement MDX collection (5 samples)
