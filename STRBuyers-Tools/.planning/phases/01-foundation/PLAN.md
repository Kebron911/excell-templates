# Phase 1 — Foundation

**Goal:** Bootable Astro site with finance-trust brand tokens, layout primitives, monetization primitives (incl. cluster-extension AffiliateBlock + DisclosureBanner), URL-state, format, SEO libraries.

**Source plan:** [`docs/superpowers/plans/2026-05-05-strbuyers-tools.md`](../../../docs/superpowers/plans/2026-05-05-strbuyers-tools.md)

**Cluster reference:** Layout primitives + monetization primitive contracts come from [STRHost-Tools Phase 1 PLAN](../../../../STRHost-Tools/.planning/phases/01-foundation/PLAN.md). This phase mirrors strhost task-for-task, with two additions in Task 5 (AffiliateBlock + DisclosureBanner) and one accent swap in Task 2 (finance-trust deeper blue).

**Requirements satisfied:** R5 (brand layer), R6 (monetization primitives + AffiliateBlock + DisclosureBanner), R7 (SEO library), partial R3 (URL state + format)

**Acceptance for the phase:**

- `pnpm install` and `pnpm dev` succeed
- `pnpm typecheck` passes
- `pnpm test` (Vitest) passes — `format.ts` and `url-state.ts` green
- A throwaway test route renders Header + Footer + FunnelBand + ClusterFunnelBlock + AdSlot + EmailCaptureCard + STRLedgerCTA + **AffiliateBlock** + **DisclosureBanner**, with finance-trust accent applied
- Print stylesheet hides chrome on `@media print`
- Working tree committed phase-by-phase (one commit per task)

---

## Task 1 — Bootstrap pnpm workspace + Astro install

**Source:** lines 13–207 of [source plan](../../../docs/superpowers/plans/2026-05-05-strbuyers-tools.md)

**Acceptance:** `pnpm install` resolves; `pnpm dev` serves default page; `pnpm typecheck` zero errors. Commit: `chore: bootstrap astro+tailwind+vitest+playwright project`.

---

## Task 2 — Brand tokens with finance-trust accent

**Source:** lines 208–396 of source plan

**Files:** `src/styles/tokens.css`, `src/styles/global.css`, `tailwind.config.ts`

**Cluster note:** Tokens port from [`Excel-Templates/design-system/colors_and_type.css`](../../../../design-system/colors_and_type.css). **Override:** primary accent shifts from strhost's editorial neutral to a finance-trust deeper blue (specific HEX TBD during this task — review Excel-Templates' palette and pick the closest "trust/buying" tone).

**Acceptance:** Tailwind theme exposes `colors.accent.DEFAULT` as finance-trust blue; numbers render in JetBrains Mono with `tabular-nums`; commit: `feat: brand tokens with finance-trust accent`.

**Frontend-design note:** Apply [frontend-design](skill) — accent must read as "money/trust" without screaming corporate. Test against the AffiliateBlock card style (Task 5) before locking the HEX.

---

## Task 3 — Print stylesheet

**Source:** lines 397–440 of source plan

Identical to strhost.tools. Commit: `feat: print stylesheet`.

---

## Task 4 — Layout primitives

**Source:** lines 441–591 of source plan

**Files:** `src/components/chrome/{Header,Footer,Sidebar,FunnelBand,ClusterFunnelBlock,Layout}.astro`

**Cluster note:** Layout matches strhost.tools chrome. ClusterFunnelBlock is shared across all four cluster sites — `currentCluster` prop hides the matching link. For strbuyers, `currentCluster="acquisition"`.

**Acceptance:** All six chrome components render on a throwaway route; ClusterFunnelBlock shows links to strhost / strops / strguests but hides strbuyers self-link; visual check passes. Commit: `feat: layout primitives — Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock, Layout`.

**Frontend-design note:** Apply [frontend-design](skill) — production craft on type rhythm and hover states; ClusterFunnelBlock copy needs a one-line value prop per sibling site.

---

## Task 5 — Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateBlock, DisclosureBanner)

**Source:** lines 592–771 of source plan

**Files (under `src/components/`):**
- `ads/AdSlot.astro` — pre-AdSense placeholder, post-approval renders `<ins class="adsbygoogle">`
- `funnel/EmailCaptureCard.astro` — inline content-styled, posts to ESP webhook (stub until ESP decided)
- `funnel/STRLedgerCTA.astro` — UTM-tagged deep-link to thestrledger.com
- **`affiliate/AffiliateBlock.astro`** — renders 1–3 vendor cards from `vendor` + `tool` props; click handler POSTs to `/api/click` with vendor/tool/UTM payload; FTC disclosure inline
- **`affiliate/DisclosureBanner.astro`** — top-of-page banner that links to `/disclosures`

**Acceptance:**
- All 5 monetization components render placeholders
- AffiliateBlock accepts `vendor` and `tool` props, reads from `src/data/affiliates.json` (created with stub data — full registry comes in Phase 2 Task 9)
- AffiliateBlock click triggers a POST to `/api/click` (stub URL; real endpoint comes in Phase 4); FTC disclosure visible inline
- DisclosureBanner renders; `href` points to `/disclosures` (page itself comes in Phase 3 Task 22)
- Visual check on throwaway route
- Commit: `feat: monetization primitives — AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateBlock, DisclosureBanner`

**Frontend-design note:** Apply [frontend-design](skill) — AffiliateBlock is conversion-critical and must read as content (vendor recommendation), not as an ad. Inline FTC disclosure must be readable but not visually dominant. DisclosureBanner is regulatory chrome — small, clear, non-disruptive.

---

## Task 6 — URL-state library (TDD)

**Source:** lines 772–856 of source plan

Identical to strhost.tools R3 contract. Tests first. Commit: `feat: url-state library with debounced replaceState`.

---

## Task 7 — Format library (TDD)

**Source:** lines 857–940 of source plan

Identical to strhost.tools. Tests first. Commit: `feat: format library with currency/percent helpers`.

---

## Task 8 — SEO library — JSON-LD WebApplication, FAQPage, Place

**Source:** lines 941–1006 of source plan

**Files:** `src/lib/seo.ts`

**Cluster delta:** strbuyers adds `Place` JSON-LD builder (used on city pages, Phase 3). strhost.tools' SEO library doesn't ship Place; we add it here.

**Acceptance:** `buildWebApplication()`, `buildFAQPage()`, `buildPlace(city)` all return valid Schema.org JSON-LD. Commit: `feat: seo library — Schema.org JSON-LD builders incl Place`.

---

## Phase 1 verification

After Task 8, run:

```bash
pnpm typecheck
pnpm test
pnpm dev
# Visit http://localhost:4321/ and confirm:
#   - Header, Footer, FunnelBand, ClusterFunnelBlock render with finance-trust accent
#   - AdSlot, EmailCaptureCard, STRLedgerCTA placeholders visible
#   - AffiliateBlock renders 1-3 vendor cards with FTC inline disclosure
#   - DisclosureBanner at top of page links to /disclosures (404 expected for now)
```

Update `STATE.md`: mark all 8 tasks done, set current phase = 2.

---

## Out of scope for this phase

- Affiliate registry full data (Phase 2 Task 9)
- Calculators (Phase 2)
- City pages (Phase 3)
- `/api/click` endpoint (Phase 4 Task 25)
- `/disclosures` page (Phase 3 Task 22)
- CI / FTP deploy (Phase 6)
