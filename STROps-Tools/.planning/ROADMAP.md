# strops.tools — ROADMAP

Phase grouping of the 36 atomic tasks from [implementation plan](../docs/superpowers/plans/2026-05-05-strops-tools.md).

---

## Phase 1 — Foundation `[complete]`

**Goal:** Bootable Astro site with brand tokens (ops-utility accent), layout primitives, monetization primitives (incl. AffiliateCard + PdfDownloadButton), URL-state, format, SEO, and the **PDF library** with brand chrome.

**Tasks (9):** 1 Bootstrap repo + tooling · 2 Brand tokens (ops accent) · 3 Print stylesheet · 4 Layout primitives (incl. ClusterFunnelBlock) · 5 Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateCard) · 6 URL state library (TDD) · 7 Format library (TDD) · 8 SEO library · 9 PDF library — base setup with brand header/footer

**Maps to requirements:** R5 (brand), R6 (monetization primitives + AffiliateCard), R7 (SEO), partial R3 (URL state + format), R10 (PDF base)

**Acceptance:** `pnpm dev` serves a throwaway route rendering all chrome + monetization primitives with ops accent; Vitest green for `format.ts`, `url-state.ts`; `pdf-lib` produces a base-template PDF with brand header/footer.

---

## Phase 2 — Seven tools

**Goal:** All seven tools live, each TDD'd, with PDF download wired on tools 11 (cleaner-dispatch) and 16 (maintenance-schedule).

**Tasks (7):** 10 Turnover scheduler · 11 Cleaner dispatch (PDF) · 12 Smart lock codes (deterministic) · 13 Linen par calculator · 14 Restock calculator · 15 Damage cost lookup · 16 Maintenance schedule (PDF + .ics)

**Maps to requirements:** R1.1–R1.7, R2 (extended page template), R3 (URL+share+print incl. deterministic smart-lock + .ics export)

**Acceptance:** Seven tool routes hydrate; cleaner-dispatch + maintenance-schedule produce branded PDFs; smart-lock-codes pass reproducibility test.

---

## Phase 3 — Programmatic pages (maintenance + replacement)

**Goal:** ~30 maintenance pages + ~50 replacement pages with sortable indexes.

**Tasks (8):** 17 Maintenance data (`tasks.json`) · 18 Maintenance programmatic pages · 19 Maintenance index · 20 Maintenance MDX collection (5 samples) · 21 Replacement data (`items.json`) · 22 Replacement programmatic pages · 23 Replacement index · 24 Replacement MDX collection (5 samples)

**Maps to requirements:** R4 (programmatic page system)

**Acceptance:** Build produces ~30 maintenance + ~50 replacement HTML files; indexes sortable; per-page narrative present for samples; rest use template.

---

## Phase 4 — Site pages, lead magnets, SEO surface

**Goal:** Three lead magnets wired, landing/about/contact, sitemap, OG images.

**Tasks (6):** 25 `tools.json` registry (tool→magnet matchup) · 26 Lead magnet pages · 27 Landing page · 28 About + Contact · 29 Sitemap + robots · 30 OG images (Satori)

**Maps to requirements:** R6 (lead magnets), R7 (SEO surface)

**Acceptance:** Three lead-magnet pages live (Cleaner SOP / Maintenance Checklist / Supply Par-Level); landing lists all 7 tools; OG image PNG exists for every route.

---

## Phase 5 — Analytics + E2E

**Goal:** GA4 cross-domain + custom events (incl. `pdf_downloaded`, `ics_exported`), Playwright smoke per tool.

**Tasks (2):** 31 GA4 cross-domain analytics · 32 Playwright smokes (per tool)

**Maps to requirements:** R7 (analytics events), R10 a11y via E2E

**Acceptance:** GA4 fires events; Playwright suite green for all 7 tools + 5 sample maintenance + 5 sample replacement pages.

---

## Phase 6 — CI/CD + production deploy

**Goal:** Green CI on every PR, FTP deploy to Hostinger, post-deploy smoke, release tag.

**Tasks (4):** 33 GitHub Actions CI · 34 Hostinger FTP deploy · 35 Pre-launch smoke · 36 Final commit + tag v0.1.0

**Maps to requirements:** R8 (build/deploy)

**Acceptance:** Push to `main` triggers green CI + automatic deploy; smoke run against deployed URL passes; v0.1.0 tag pushed.

---

## Sequencing notes

- Phase 1 PDF library (Task 9) is foundational — Phase 2 tools 11 and 16 depend on it. Don't try to land them before Task 9 is done.
- Phase 2 → 3 strict order. Replace pages (P3) need damage-cost-lookup tool (P2 Task 15) which selects items.
- Phase 4 lead magnet pages (Task 26) depend on `tools.json` (Task 25).
- Phase 5 can run in parallel with Phase 4 once Phase 2 lands.
- Phase 6 last. Open questions in [PROJECT.md](PROJECT.md) (domain, ESP, vendor list) must resolve before Phase 4 (ESP blocks lead magnets; vendors block AffiliateCard data).

---

## Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 — Foundation | complete | 2026-05-08 | 2026-05-08 |
| 2 — Seven tools | complete | 2026-05-08 | 2026-05-08 |
| 3 — Programmatic pages | complete | 2026-05-08 | 2026-05-08 |
| 4 — Site pages + lead magnets | complete (ESP + vendors stubbed) | 2026-05-08 | 2026-05-08 |
| 5 — Analytics + E2E | complete (shipped before P4) | 2026-05-08 | 2026-05-08 |
| 6 — CI/CD + deploy | complete (gated on GitHub Secrets + DNS) | 2026-05-08 | 2026-05-08 |
