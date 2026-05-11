# Shared Packages Migration — Design Spec

**Date:** 2026-05-10
**Status:** Approved for planning
**Owner:** Daniel
**Scope:** All 4 STR tools (STRGuests, STRBuyers, STRHost, STROps)
**Estimate:** 22-29 hours across 6 phases

---

## 1. Problem Statement

The 4 tools (`STRGuests-Tools`, `STRBuyers-Tools`, `STRHost-Tools`, `STROps-Tools`) currently live as standalone pnpm projects in a single git repo. They share no packages. Investigation shows:

- **Every "shared" file has drifted** across all 4 tools — zero hash matches on Header, Footer, Sidebar, FunnelBand, EmailCaptureCard, STRLedgerCTA, AdSlot, format.ts, seo.ts, url-state.ts.
- **STRGuests / STRBuyers / STRHost** are within tight line-count range of each other (recently cloned/upgraded together).
- **STROps** is dramatically older — Astro 4.16 vs 6.2 elsewhere, vitest 2.1 vs 1.6, pnpm 10 vs 9. Its component files are roughly 1/3 the size of the others (Header 22 lines vs 61, EmailCaptureCard 59 vs 119+, format 17 vs 121-166). Forked early, never refreshed.
- **PDF generation already exists in 2 tools** (STRGuests rich, STROps stub) — duplicated in source.
- **Email-gate exists only in STRGuests** today, but is needed everywhere as each tool starts shipping audience-specific lead magnets.

**Engineering cost of status quo:** every component change requires editing 4 places; reconciliation drift compounds; STROps is falling behind in capability.

**Marketing cost of status quo:** shipping a new lead-magnet PDF on a non-STRGuests site is a multi-day project (no PDF library, no email-gate, no shared landing template). Should be <2 hours.

---

## 2. Goal

Establish a **pnpm workspace monorepo** with shared packages that:

1. **Eliminate drift** in chrome/funnel/lib code across the 4 tools.
2. **Provide a PDF authoring framework** (`@str/pdf`) that lets any tool ship a new audience-specific PDF in under 2 hours from spec to live.
3. **Standardize the lead-magnet stack** — PDF builder + landing page + email-gate (with per-site segmentation) + analytics + sitemap, all wired by one `tools.json` entry.
4. **Preserve per-app independence** for routing, build config, and content.

**Non-goal:** cross-publishing existing PDFs across all sites (deferred per audience-fit principle — share the *mechanism*, not the *policy*).

---

## 3. Repo & Workspace Architecture

### Target layout

```
Excel-Templates/                          # repo root
├── pnpm-workspace.yaml                   # NEW
├── package.json                          # NEW — root-level dev deps + scripts
├── tsconfig.base.json                    # NEW — shared compiler options
├── .changeset/                           # NEW — version + changelog
├── apps/                                 # NEW
│   ├── strguests-tools/                  # was STRGuests-Tools/
│   ├── strbuyers-tools/                  # was STRBuyers-Tools/
│   ├── strhost-tools/                    # was STRHost-Tools/
│   └── strops-tools/                     # was STROps-Tools/
└── packages/
    ├── format/                           # @str/format
    ├── url-state/                        # @str/url-state
    ├── seo/                              # @str/seo
    ├── email-gate/                       # @str/email-gate
    ├── ui-chrome/                        # @str/ui-chrome
    ├── ui-funnel/                        # @str/ui-funnel
    └── pdf/                              # @str/pdf
```

### Tooling

- **pnpm workspaces** — already on pnpm; `workspace:*` for internal deps.
- **No turborepo / nx** — adds config without payoff at 4 apps. Revisit if CI exceeds ~10 min total.
- **Changesets** — versioning + changelog for the 7 packages.
- **TypeScript project references** — packages emit `dist/`; apps consume built output. `tsc --build` from root drives the graph.
- **vitest 2.x everywhere** — Phase 0 upgrades the 3 tools currently on 1.6 (easier than dragging STROps backward; 2.x has better workspace support).
- **Single Node + pnpm version** — pinned via `engines` and `packageManager`.

### Migration mechanic

Moving `STRGuests-Tools/` → `apps/strguests-tools/` is a `git mv` per directory. History preserved.

### Apps stay independent on the runtime side

Each app keeps its own `astro.config.mjs`, `playwright.config.ts`, `vitest.config.ts`, `tailwind.config.ts`. We share *libraries*, not *build configs*.

---

## 4. Package Boundaries

### Tier 1 — pure logic

| Package | Responsibility | Deps | Notes |
|---|---|---|---|
| `@str/format` | Number/date/currency formatters | none | STRGuests' 166-line version is canonical baseline |
| `@str/url-state` | Encode/decode calculator state in URL params | `zod` | All 4 calculators must decode each other's links |
| `@str/seo` | Meta primitives, JSON-LD, sitemap helpers | none | Per-site config injected; no hardcoded URLs |

### Tier 2 — UI

| Package | Exports | Deps |
|---|---|---|
| `@str/ui-chrome` | Header, Footer, Sidebar, Layout, Wordmark, FunnelBand | `@str/format`, `@str/seo` |
| `@str/ui-funnel` | EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock, AdSlot | `@str/ui-chrome`, `@str/email-gate` |

Per-site config via slots + props. Tailwind classes only (no styled-components). Per-site palette controlled by each app's `tailwind.config.ts` via CSS vars.

### Tier 3 — runtime services & frameworks

> Note: "Tier" denotes complexity, not build order. `@str/email-gate` is built in Phase 1 because `@str/ui-funnel` (Tier 2) depends on it. `@str/pdf` is built in Phase 4 after the UI packages exist.

**`@str/email-gate`** — multi-site email capture (built in Phase 1).
- Surface: `<EmailGate>` component + `submitEmail({siteId, listSegment, email, source})` server action.
- Per-site segmentation via `siteId` prop.
- Storage: MySQL via `mysql2` today; interface allows swapping providers later.
- The only Tier 1-3 package with a server-side surface.

**`@str/pdf`** — PDF authoring framework (built in Phase 4).
- **Primitives** (`base.ts`): `drawText`, `drawRect`, `drawImage`, `drawQR`, page/font helpers. Wraps `pdf-lib` + `qrcode`.
- **Builders** (`builders/*.ts`): `buildHouseRulesPdf()`, `buildWelcomeBookPdf()`, `buildWifiSignPdf()`, `buildCheckinPdf()`. Pure functions: `(input) => Buffer`.
- **Lead-magnet kit:** `<PdfDownloadButton>` Astro component bundling builder + email-gate + analytics in one drop-in.
- Per-builder config: brand colors, logo, site URL passed at construction time (no globals).

### Dependency graph (no cycles)

```
format ── (no deps)
url-state ── format
seo ── format
email-gate ── format
ui-chrome ── format, seo
ui-funnel ── ui-chrome, email-gate
pdf ── format, email-gate
```

### Explicitly NOT extracted (stay per-app)

| Stays per-app | Why |
|---|---|
| `data/tools.json` | Audience-specific catalog |
| `data/cities.json`, `affiliates.json`, etc. | Tool-specific data |
| `lib/calc/` | Math is consumer-specific; sharing risks bugs without proof of need |
| `lib/calendar/` (STROps) | Only one consumer |
| `pages/` routes | Each app owns its routing |
| `astro.config.mjs`, `tailwind.config.ts` | Per-app build/style config |
| `scripts/build-og.mjs`, `build-pins.mjs` | Use `@str/seo` helpers but stay per-app |

---

## 5. Per-Tool Config & Lead-Magnet Contract

### Site config schema

`packages/seo/src/site-config.ts` exports:

```ts
export interface SiteConfig {
  siteId: 'guests' | 'buyers' | 'host' | 'ops';
  brand: {
    name: string;
    wordmark: string;
    tagline: string;
    primaryColor: string;
    logo: string;
  };
  url: {
    canonical: string;
    sitemap: string[];
  };
  emailGate: {
    listId: string;
    welcomeSubject: string;
  };
  analytics: {
    ga4Id?: string;
  };
  nav: { label: string; href: string }[];
  footer: { sections: FooterSection[] };
}
```

`siteId` is pinned to those 4 strings. Easy to widen later.

### Tools/lead-magnet catalog

Each app's `src/data/tools.json`:

```json
{
  "tools": [
    {
      "id": "house-rules-pdf",
      "kind": "pdf",
      "title": "House Rules PDF Generator",
      "description": "...",
      "route": "/templates/house-rules",
      "audience": ["host", "guests"],
      "builder": "buildHouseRulesPdf",
      "emailGate": true,
      "ogImage": "/og/house-rules.png",
      "heroTitle": "...",
      "heroBullets": [...],
      "socialProof": "..."
    }
  ]
}
```

### Dynamic route

`apps/<tool>/src/pages/templates/[id].astro` — single route, reads `tools.json`, looks up entry, renders landing page using `<PdfDownloadButton builder={entry.builder} ... />`.

Replaces today's hand-coded routes per PDF (4 separate route files in STRGuests today → 1 dynamic route). Hand-coded escape hatch remains for genuinely unique pages but should be rare.

### Catalog validation

`packages/pdf/bin/validate-catalog.ts` runs in each app's CI. Verifies every `builder` referenced in `tools.json` exists in `@str/pdf`. Catches drift at build time.

### Cross-publishing

Adding the same `builder` ID to a second app's `tools.json` cross-publishes. Deferred until per-PDF audience validation; framework supports it natively when needed.

---

## 6. Phase Plan

Each phase ends in a green CI run + a clean commit. No phase merges until prior phase verified.

### Phase 0 — STROps Astro 4→6 upgrade (4-6h)

**Goal:** STROps reaches version parity.

- Bump astro 4.16 → 6.2, all `@astrojs/*` to v5+, vitest 2.1 → 2.x (and upgrade other 3 apps to vitest 2.x in same phase)
- Migrate breaking changes (Astro 5: image service, content collections v2, middleware signature)
- Rebuild lockfile, run full test + e2e suite
- Single commit per logical migration step

**Exit criteria:** STROps tests pass, e2e green, build succeeds, OG generation works. All 4 apps on vitest 2.x.

### Phase 1 — Workspace + Tier 1 packages (5-6h)

**Goal:** Monorepo exists, smallest packages prove the pattern.

1. Create `pnpm-workspace.yaml`, root `package.json`, `tsconfig.base.json`, `.changeset/`
2. `git mv` each tool to `apps/<name>` (4 commits, history preserved)
3. Delete per-app `pnpm-lock.yaml` files; regenerate single root lockfile
4. Scaffold `@str/format`, `@str/url-state`, `@str/seo`, `@str/email-gate`
5. Reconcile each package's variants — STRGuests is canonical baseline, merge useful additions from others, full test coverage
6. Wire `apps/strguests-tools` to consume the 4 packages (replaces in-tree files)
7. Tests + build green for STRGuests

**Exit criteria:** STRGuests builds, tests pass, e2e green using shared packages. Other 3 apps unchanged.

### Phase 2 — STRGuests pilot of Tier 2 UI packages (3-4h)

**Goal:** Prove Astro component sharing works end-to-end on one app before fanning out.

1. Capture Playwright visual baselines for STRGuests (homepage, calculator, PDF landing, blog post)
2. Scaffold `@str/ui-chrome` and `@str/ui-funnel`
3. Extract STRGuests' chrome + funnel components, reconciling props/slots so per-site config injects cleanly
4. Wire `apps/strguests-tools` to consume — delete in-tree copies
5. Visual diff: rerun screenshots, verify ≤0.1% pixel diff vs baseline

**Exit criteria:** STRGuests visually identical pre/post extraction.

### Phase 3 — Fan Tier 1 + Tier 2 to other 3 apps (4-5h)

**Goal:** STRBuyers, STRHost, STROps all consume shared packages.

- Per-app: capture visual baseline → replace in-tree files with package imports → port site-specific config to `site.config.ts` → run tests + e2e → visual diff
- Each app gets its own commit; CI green per commit
- Add per-app override slot pattern (`<slot name="funnel-banner-override" />`) for genuinely site-specific cases (notably STRBuyers' 38-line FunnelBand)

**Exit criteria:** All 4 apps build, test, e2e green, visual diff within tolerance.

### Phase 4 — `@str/pdf` framework + STROps PDF port (4-5h)

**Goal:** PDF authoring framework live; both PDF-producing apps consume it.

1. Scaffold `@str/pdf` with primitives (`base.ts`) + 4 builders ported from STRGuests
2. Build `<PdfDownloadButton>` with email-gate + analytics integration
3. Implement catalog validator script
4. Wire STRGuests to consume `@str/pdf` (delete `src/lib/pdf/`)
5. Reconcile STROps' 2 in-tree PDFs against the framework — port their builders to `@str/pdf/builders/`
6. Wire STROps to consume `@str/pdf` (delete `src/lib/pdf/`)

**Exit criteria:** All existing PDFs (4 in STRGuests, 2 in STROps) generate identically before/after extraction. Verified by content extraction tests + byte-diff smoke test.

### Phase 5 — Lead-magnet authoring guide + 2 demo PDFs (2-3h)

**Goal:** Prove the marketing payoff — adding new PDFs is fast.

1. Write `packages/pdf/AUTHORING.md` — step-by-step "ship a new PDF in 2h"
2. Implement 1 new audience-specific PDF on **STRBuyers** (e.g., "Property Inspection Checklist")
3. Implement 1 new audience-specific PDF on **STRHost** (e.g., "Cleaner Handoff Checklist")
4. Both ship via dynamic `[id].astro` route + email-gate + auto-OG
5. Time the work — should be well under 2h each. If not, Phase 4 framework needs more polish.

**Exit criteria:** 2 new PDFs live on 2 sites; authoring time documented as evidence.

---

## 7. Testing & CI Strategy

### Per-package

- **`@str/format`, `@str/url-state`, `@str/seo`** — vitest unit tests, near-100% coverage, snapshot output strings.
- **`@str/email-gate`** — unit tests for zod schemas; integration tests against real MySQL via testcontainers (no mocking the DB).
- **`@str/ui-chrome`, `@str/ui-funnel`** — render tests via `@astro/test`; snapshot HTML output. Supplemented by app-level visual regression.
- **`@str/pdf`** — per-builder unit tests asserting page count, page size, expected text content (via `pdf-lib` text extraction), QR codes decode. Byte-diff smoke test against committed reference PDFs (`pnpm test:pdf:approve` to re-baseline intentionally).

### Per-app (existing, retained)

- Vitest unit tests
- Playwright e2e
- Astro check + tsc

### Cross-cutting: Visual regression on extraction

Phase 2 + Phase 3 are highest-risk (UI extraction).

1. Before extraction: Playwright captures full-page screenshots — homepage, 1 calculator, 1 PDF landing, 1 blog post.
2. After extraction: rerun, diff against baseline.
3. CI fails if pixel diff > 0.1%.
4. Baselines committed under `apps/<name>/tests/visual/baseline/` — reviewed in PR.

### CI per-app order

`lint → typecheck → unit → visual → e2e`. Fail fast.

### Drift prevention

ESLint `no-restricted-imports` rule: `apps/<x>` cannot import from `apps/<y>`. Sharing only via packages.

### Rollback

- Each phase = single PR (or chain). Phase commits are atomic; `git revert <merge-sha>` restores prior state.
- Workspace + app moves are pure `git mv` — fully reversible.
- Apps consume `workspace:*` (always latest in-repo); no version pinning needed for in-repo packages.

---

## 8. Risks

| # | Risk | Likelihood | Blast | Mitigation |
|---|---|---|---|---|
| 1 | Astro 4→6 upgrade on STROps breaks something undetected | Likely | Medium | Phase 0 own PR; manual smoke of every route + Playwright before merge |
| 2 | UI prop-injection misses a per-site customization | Likely | Low | Visual regression catches it; per-app override slots for genuinely unique cases |
| 3 | PDF byte-diff fails after extraction | Possible | Low | Test by content first (text, page count, QR decode); byte-diff is secondary, re-baselineable |
| 4 | Drift sneaks back in over time | Eventual cert. | Medium | ESLint `no-restricted-imports` blocks app-to-app imports |
| 5 | Workspace setup conflicts with per-app lockfiles | Likely | Low | Phase 1 first commit deletes per-app lockfiles, regenerates root, verifies all 4 apps install + build |
| 6 | Packages versioned independently, but apps lag | Possible | Medium | `workspace:*` always-latest; external publish out of scope |

---

## 9. Open Questions (resolve before Phase 1 kickoff)

| # | Question | Default if not answered |
|---|---|---|
| a | Package namespace: `@str/*` or `@strtools/*`? | `@str/*` |
| b | All 4 tools on same Hostinger account, or separate? | Doesn't affect design; confirm pre-Phase-0 |
| c | Email-gate: shared MySQL with `siteId` column, or per-site DB? | Shared with `siteId` column (easy to split later) |
| d | Versioning: BREAKING_CHANGES.md or just changesets? | Changesets only |

---

## 10. Out of Scope

- CI/CD overhaul (affected-only builds, turborepo, remote cache) — defer.
- New analytics provider — GA4 stays.
- New email provider — current MySQL-based gate stays.
- Publishing packages to npm — `workspace:*` only.
- `@str/calc` — math sharing requires more test coverage; revisit when calculators provably duplicate.
- `@str/cms` — content collections stay per-app.
- Cross-publishing existing PDFs — framework supports it; defer per audience-fit principle.
- Marketing copy / new lead magnet ideation — Phase 5's 2 demo PDFs use placeholder copy; real audience-targeted PDFs are a follow-on engagement.

---

## 11. Estimate Summary

| Phase | Work | Hours |
|---|---|---|
| 0 | STROps Astro 4→6 upgrade + vitest 2.x for all | 4-6 |
| 1 | Workspace + Tier 1 (`@str/format`, `@str/url-state`, `@str/seo`, `@str/email-gate`) | 5-6 |
| 2 | STRGuests pilot: Tier 2 (`@str/ui-chrome`, `@str/ui-funnel`) | 3-4 |
| 3 | Fan Tier 1+2 to STRBuyers / STRHost / STROps | 4-5 |
| 4 | `@str/pdf` framework + STROps PDF port | 4-5 |
| 5 | Lead-magnet authoring guide + 2 demo PDFs | 2-3 |
| **Total** | | **22-29** |
