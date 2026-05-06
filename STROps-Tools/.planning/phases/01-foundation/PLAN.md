# Phase 1 — Foundation

**Goal:** Bootable Astro site with ops-utility brand tokens, layout primitives, monetization primitives (incl. AffiliateCard), URL-state, format, SEO, and the **PDF library base** with branded header/footer.

**Source plan:** [`docs/superpowers/plans/2026-05-05-strops-tools.md`](../../../docs/superpowers/plans/2026-05-05-strops-tools.md)

**Cluster reference:** Layout + monetization primitive contracts come from [STRHost-Tools Phase 1 PLAN](../../../../STRHost-Tools/.planning/phases/01-foundation/PLAN.md). This phase mirrors strhost task-for-task, with one accent swap in Task 2 (ops-utility green-gray) and one extra task (Task 9 PDF library base) needed because tools 11 and 16 produce PDFs in Phase 2.

> **READ BEFORE ANY UI TASK:** [STR Cluster — Style + Layout Guide](../../../../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md). This document captures the locked UX patterns for the cluster (wordmark treatment, header coverage, landing layout, sidebar usage, friction discipline). The guide was codified after strhost.tools Phase 1 user feedback — don't re-derive these decisions, replicate them. **Per-site delta for strops.tools:** brand name reads `STR Ops`·*tools*, accent is ops-utility green-gray.

**Requirements satisfied:** R5 (brand layer), R6 (monetization primitives + AffiliateCard), R7 (SEO library), partial R3 (URL state + format), R10 (PDF base template)

**Acceptance for the phase:**

- `pnpm install` and `pnpm dev` succeed
- `pnpm typecheck` passes
- `pnpm test` (Vitest) passes — `format.ts`, `url-state.ts`, and `pdf/base.ts` green
- A throwaway test route renders Header + Footer + FunnelBand + ClusterFunnelBlock + AdSlot + EmailCaptureCard + STRLedgerCTA + **AffiliateCard**, with ops-utility accent
- `pdf-lib` produces a downloadable base-template PDF with brand header + footer
- Print stylesheet hides chrome on `@media print`
- Working tree committed phase-by-phase (one commit per task)

---

## Task 1 — Bootstrap repo + tooling

**Source:** lines 13–104 of [source plan](../../../docs/superpowers/plans/2026-05-05-strops-tools.md)

**Acceptance:** `pnpm install` resolves; `pnpm dev` serves default page; `pnpm typecheck` zero errors. `pdf-lib` and `@types/pdf-lib` installed (will be used in Task 9). Commit: `chore: bootstrap astro+tailwind+vitest+playwright+pdflib project`.

**⚠ Cross-platform alias config** (per [Cluster Style Guide §10](../../../../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md#10-cross-platform-viteastro-path-alias)): both `vitest.config.ts` and `astro.config.mjs` must use `fileURLToPath(new URL('./src', import.meta.url))` for the `@/*` alias. The naive `.pathname` approach breaks on Windows. strhost commit `af20c20` is the reference fix.

---

## Task 2 — Brand tokens — port + ops accent shift

**Source:** lines 105–162 of source plan

**Files:** `src/styles/tokens.css`, `src/styles/global.css`, `tailwind.config.ts`

**Cluster note:** Tokens port from [`Excel-Templates/design-system/colors_and_type.css`](../../../../design-system/colors_and_type.css). **Override:** primary accent shifts to ops-utility green-gray (HEX TBD during this task — pick a green-gray that reads as "operational, not flashy"; test against industrial-tool aesthetics).

**Acceptance:** Tailwind theme exposes ops-utility accent; numbers in JetBrains Mono with `tabular-nums`. Commit: `feat: brand tokens — ops-utility accent`.

**Frontend-design note:** Apply [frontend-design](skill) — accent must read as "utility / industrial / get-it-done" without being drab. Test contrast against AffiliateCard surface.

**Cluster note:** the wordmark renders `STR Ops`·*tools* with `STR Ops` in the chosen ops-utility green-gray (NOT navy). Per [Cluster Style Guide §1–§2](../../../../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md#1-wordmark) — the wordmark IS the most visible accent surface, so the green has to read as a brand color at 28px serif weight, not just as a UI tint. Test at the chosen shade by mocking the Wordmark component on parchment before locking the HEX.

---

## Task 3 — Print stylesheet

**Source:** lines 163–187 of source plan

Identical to strhost.tools. Commit: `feat: print stylesheet`.

---

## Task 4 — Layout primitives — Layout, Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock, Wordmark

**Source:** lines 188–380 of source plan

**Files:** `src/components/chrome/{Header,Footer,Sidebar,FunnelBand,ClusterFunnelBlock,Layout,Wordmark}.astro`

**Cluster note:** Replicate strhost.tools UX patterns from [Cluster Style Guide §1, §3, §4, §5, §8](../../../../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md):

- **Wordmark.astro** — copy [`STRHost-Tools/src/components/chrome/Wordmark.astro`](../../../../STRHost-Tools/src/components/chrome/Wordmark.astro) verbatim, change brand name string only (`STR Host` → `STR Ops`).
- **Header** — all 7 ops tools visible inline at lg+; hamburger below lg. Compact `navLabels` map per §3.
- **Sidebar** — used ONLY on individual tool pages. Do NOT render on the landing.
- **ClusterFunnelBlock** — `currentCluster="operations"`; hides self-link.
- **Hover/focus states** — card border `rule` → ops accent on hover, `shadow-card`, `shadow-focus` rings. No scale-up, no spring eases.

**Acceptance:** All seven chrome components render on a throwaway route; all 7 ops tools visible in nav at lg+; ClusterFunnelBlock shows the other three sites; landing has no Sidebar. Commit: `feat: layout primitives — Wordmark, Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock, Layout`.

**Frontend-design note:** Apply [frontend-design](skill) — production craft on type rhythm and hover. Wordmark hierarchy is **{Brand Name} main** + **.tld trailing**, not eyebrow + main (rejected variant in §1).

---

## Task 5 — Monetization primitives — AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateCard

**Source:** lines 381–538 of source plan

**Files:**
- `src/components/ads/AdSlot.astro` — pre-AdSense placeholder
- `src/components/funnel/EmailCaptureCard.astro` — inline content-styled, posts to ESP
- `src/components/funnel/STRLedgerCTA.astro` — UTM-tagged deep-link
- **`src/components/affiliate/AffiliateCard.astro`** — soft, after-value placement; renders single vendor card with inline FTC disclosure (no top-of-page banner; that's strbuyers.tools' pattern)

**Acceptance:**
- All 4 monetization components render placeholders
- AffiliateCard accepts `vendor` and `tool` props (from `src/data/affiliates.json`, stub data for now)
- AffiliateCard click logs to `console.log` for now (no `/api/click` server in strops; logging is GA4-only)
- Visual check on throwaway route
- Commit: `feat: monetization primitives — AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateCard`

**Frontend-design note:** Apply [frontend-design](skill) — AffiliateCard must read as "we use this, here's why" recommendation, not as a paid placement. Inline FTC disclosure readable but not visually dominant. The ops audience hates being sold to.

---

## Task 6 — URL state library (TDD)

**Source:** lines 539–637 of source plan

Identical contract to strhost.tools R3. Tests first. Commit: `feat: url-state library`.

---

## Task 7 — Format library (TDD)

**Source:** lines 638–694 of source plan

Identical to strhost.tools. Tests first. Commit: `feat: format library`.

---

## Task 8 — SEO library — JSON-LD builders

**Source:** lines 695–789 of source plan

Identical to strhost.tools (no Place builder needed; ops doesn't have city pages). Commit: `feat: seo library — Schema.org JSON-LD builders`.

---

## Task 9 — PDF library — base setup with brand header/footer

**Source:** lines 790–909 of source plan

**Files:**
- `src/lib/pdf/base.ts` — base PDF template (page setup, brand header, footer, "Generated on" timestamp)
- `tests/pdf/base.test.ts` — Vitest test that base produces a valid PDF buffer

**Cluster note:** This is foundational because tools 11 (cleaner-dispatch) and 16 (maintenance-schedule) depend on it. Setting it up now keeps Phase 2 mechanical.

**Acceptance:**
- `createBasePdf({ title, subtitle })` returns a Uint8Array (PDF buffer)
- Output PDF has branded header (wordmark + tagline) and footer (URL + page number)
- "Generated on YYYY-MM-DD" appears
- Vitest unit test confirms valid PDF output (magic bytes `%PDF`, page count = 1)
- Commit: `feat: pdf library base — branded header/footer template`

**Frontend-design note:** Apply [frontend-design](skill) on PDF aesthetics — branded but readable; the cleaner SOP and maintenance schedule will live as printed reference documents in operators' physical workflows. Make the chrome restrained.

---

## Phase 1 verification

The throwaway landing should follow [Cluster Style Guide §4 + §6](../../../../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md):

- Hero: short headline (Cormorant H1 with accent period), one Inter lede, no buttons
- Tool grid: 7 ops-tool placeholders, 3 cols at lg / 2 at sm / 1 below sm
- ClusterFunnelBlock follows the grid
- Verification preview (AdSlot + EmailCaptureCard + STRLedgerCTA + **AffiliateCard** + **PdfDownloadButton** + AdSlot) collapsed in a `<details>` at page bottom

After Task 9:
```bash
pnpm typecheck
pnpm test
pnpm dev
# Visit http://localhost:4321/ and confirm:
#   - STR Ops·tools wordmark in ops-utility accent in Header + Footer
#   - All 7 ops-tool placeholders visible in Header nav at lg+
#   - Tool grid IS the menu (no Sidebar duplicate)
#   - Verification preview collapsed; expand to see monetization primitives
#   - Trigger pdf/base test in dev — open downloaded PDF and visually verify chrome
```

Update `STATE.md`: mark all 9 tasks done, set current phase = 2.

---

## Out of scope for this phase

- Tool implementations (Phase 2)
- Tool-specific PDF outputs (Phase 2 wires tools to base PDF library)
- Maintenance + replacement programmatic pages (Phase 3)
- Lead magnet pages (Phase 4)
- CI / FTP deploy (Phase 6)
