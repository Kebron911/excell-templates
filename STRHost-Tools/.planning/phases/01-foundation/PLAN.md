# Phase 1 — Foundation

**Goal:** Bootable Astro site with brand tokens, layout primitives, and monetization primitives. No calculators yet, but the chrome around them is real and ready.

**Source plan:** [`docs/superpowers/plans/2026-05-05-strhost-tools.md`](../../../docs/superpowers/plans/2026-05-05-strhost-tools.md) — this PLAN.md is the GSD-execution view; the source plan has the verbatim file contents and code blocks for each step.

**Requirements satisfied:** R5 (brand layer), R6 (monetization primitives), R7 (SEO library), partial R3 (URL state + format helpers)

**Acceptance for the phase:**

- `pnpm install` and `pnpm dev` succeed
- `pnpm typecheck` passes
- `pnpm test` (Vitest) passes — `format.ts` and `url-state.ts` have green test suites
- A throwaway test route renders Header + Footer + FunnelBand + AdSlot + EmailCaptureCard + STRLedgerCTA as placeholders, with brand tokens applied
- Print stylesheet hides chrome on `@media print`
- Working tree committed phase-by-phase (one commit per task)

---

## Task 1 — Bootstrap project

**Source:** lines 13–233 of [source plan](../../../docs/superpowers/plans/2026-05-05-strhost-tools.md)

**Files (create):** `package.json`, `tsconfig.json`, `astro.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `.npmrc`, `README.md`

**Steps:** 10 — copy verbatim from source plan §Task 1.

**Acceptance:**
- `pnpm install` resolves all deps without peer-conflict errors
- `pnpm dev` starts and serves a default Astro page on `http://localhost:4321`
- `pnpm typecheck` returns zero errors
- Files are staged and committed as `chore: bootstrap astro+tailwind+vitest+playwright project`

---

## Task 2 — Brand tokens + Tailwind theme

**Source:** lines 235–377 of source plan

**Files:**
- Create: `src/styles/tokens.css` (port from `Excel-Templates/design-system/colors_and_type.css`)
- Create: `src/styles/global.css`
- Modify: `tailwind.config.ts` (extend theme from tokens)

**Acceptance:**
- `:root` exposes color, font, spacing tokens as CSS custom properties
- Tailwind theme references tokens (`fontFamily.serif`, `fontFamily.sans`, `fontFamily.mono`, color palette)
- Body uses Inter; `.font-serif` opt-in to Cormorant; `.font-mono` to JetBrains Mono with `tabular-nums`
- Commit: `feat: brand tokens + Tailwind theme`

**Frontend-design note:** This task sets the visual foundation. Apply [frontend-design](skill) principles when porting tokens — production-quality means precise palette match with The STR Ledger, correct font loading order, no FOUT/FOIT.

---

## Task 3 — Print stylesheet

**Source:** lines 378–408 of source plan

**Files:**
- Create: `src/styles/print.css`

**Acceptance:**
- `@media print` hides `.no-print` (header, footer, ads, sidebar)
- Calculator inputs/results remain visible and reflow to single column
- Page-break-inside avoided on result blocks
- Commit: `feat: print stylesheet`

---

## Task 4 — Format library (TDD)

**Source:** lines 409–496 of source plan

**Files:**
- Create: `src/lib/format.ts`
- Create: `tests/format.test.ts`

**TDD discipline:** Write the failing tests first (currency, percent, abbreviated thousands, monospace numerals), then implement.

**Acceptance:**
- `formatCurrency(1234.5)` → `$1,234.50`
- `formatPercent(0.085)` → `8.5%`
- `formatTabular(n)` returns string wrapped for tabular-nums rendering
- All tests pass
- Commit: `feat: format library with currency/percent helpers`

---

## Task 5 — URL-state library (TDD)

**Source:** lines 497–620 of source plan

**Files:**
- Create: `src/lib/url-state.ts`
- Create: `tests/url-state.test.ts`

**TDD discipline:** Tests first.

**Acceptance:**
- `serialize(inputs)` returns URLSearchParams string
- `parse(searchString, defaults)` returns inputs with type coercion and fallback to defaults
- `replaceState` is debounced (200ms)
- All tests pass
- Commit: `feat: url-state library with debounced replaceState`

---

## Task 6 — SEO library

**Source:** lines 621–724 of source plan

**Files:**
- Create: `src/lib/seo.ts`

**Acceptance:**
- `buildOrganization()` returns Schema.org Organization JSON-LD
- `buildWebApplication(tool)` returns WebApplication JSON-LD per tool
- `buildFAQPage(faqs)` returns FAQPage JSON-LD
- Type-only test confirms shapes
- Commit: `feat: seo library — Schema.org JSON-LD builders`

---

## Task 7 — Layout primitives

**Source:** lines 725–917 of source plan

**Files (create under `src/components/chrome/`):**
- `Header.astro`
- `Footer.astro`
- `Sidebar.astro`
- `FunnelBand.astro`
- `Layout.astro` (wraps the above + slot)

**Acceptance:**
- Each component renders with brand tokens
- Header has wordmark + nav (links to all 7 calculators + about/contact)
- Sidebar lists the other six calculators (placeholder until R1 routes exist)
- Footer has nav, social, legal, last-updated date
- FunnelBand: thin co-branded "Built by The STR Ledger →" with link
- Visual check: throwaway route at `/` renders all four primitives correctly
- Commit: `feat: layout primitives — Header, Footer, Sidebar, FunnelBand, Layout`

**Frontend-design note:** Apply [frontend-design](skill) — production craft on type rhythm, spacing, hover states, mobile collapse for Sidebar→footer cards.

---

## Task 8 — Monetization primitives

**Source:** lines 918–1017 of source plan

**Files (create under `src/components/`):**
- `ads/AdSlot.astro` — pre-AdSense placeholder, post-approval renders `<ins class="adsbygoogle">`. One config flag flips behavior.
- `funnel/EmailCaptureCard.astro` — inline content-styled, posts to ESP API
- `funnel/STRLedgerCTA.astro` — one button per page, deep-links with UTM tags
- `funnel/ClusterFunnelBlock.astro` — links to strbuyers/strops/strguests

**Acceptance:**
- Components render placeholders without runtime errors
- AdSlot reads `ADSENSE_ENABLED` flag (env or static config); default off → transparent placeholder with `data-ad-slot` attribute
- EmailCaptureCard: form posts to a configured ESP webhook URL (stub with `console.log` until ESP is decided)
- STRLedgerCTA: `tool` prop selects copy; `href` includes `?utm_source=strhost-tools&utm_medium=cta&utm_content=<tool>`
- ClusterFunnelBlock: `currentCluster` prop hides the matching link, shows the other three
- Visual check: render all four on the throwaway route
- Commit: `feat: monetization primitives — AdSlot, EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock`

**Frontend-design note:** Apply [frontend-design](skill) — these are conversion-critical surfaces. Email capture must be inline-content-styled (~80px tall, no popup feel). CTA copy varies by tool. The cluster block is brand-cohesive cross-promotion, not generic recommendations.

---

## Phase 1 verification

After Task 8, run:

```bash
pnpm typecheck
pnpm test
pnpm dev
# Visit http://localhost:4321 and confirm:
#   - Header, Footer, FunnelBand render with brand tokens
#   - AdSlot placeholders visible
#   - EmailCaptureCard, STRLedgerCTA visible
#   - Inter is body, JetBrains Mono on numbers
#   - Cmd+P print preview hides chrome
```

Then update `STATE.md`: mark all 8 tasks done, set current phase = 2.

---

## Out of scope for this phase

- Calculator math and components (Phase 2)
- Lodging-tax data and pages (Phase 3)
- Final landing page copy (Phase 4)
- GA4 wiring (Phase 5)
- CI / FTP deploy (Phase 6)
