# strbuyers.tools — ROADMAP

Phase grouping of the 36 atomic tasks from [implementation plan](../docs/superpowers/plans/2026-05-05-strbuyers-tools.md).

---

## Phase 1 — Foundation `[active]`

**Goal:** Bootable Astro site with brand tokens (finance-trust accent), layout primitives, monetization primitives (incl. AffiliateBlock + DisclosureBanner), URL-state, format, SEO libraries.

**Tasks (8):** 1 Bootstrap pnpm + Astro · 2 Brand tokens (finance-trust accent) · 3 Print stylesheet · 4 Layout primitives · 5 Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, **AffiliateBlock**, **DisclosureBanner**) · 6 URL-state library (TDD) · 7 Format library (TDD) · 8 SEO library

**Maps to requirements:** R5 (brand), R6 (monetization primitives), R7 (SEO), partial R3 (URL state + format)

**Acceptance:** `pnpm dev` serves a throwaway route rendering all 7 monetization primitives + chrome with finance-trust accent applied; Vitest green for `format.ts`, `url-state.ts`; AffiliateBlock renders 1–3 vendor placeholder cards.

---

## Phase 2 — Seven calculators

**Goal:** All seven calculators live, each TDD'd, AffiliateBlock wired with vendor matchups.

**Tasks (9):** 9 Affiliate registry (10 vendors) · 10 Loan-types data · 11 DSCR · 12 Down Payment · 13 Comp Analyzer · 14 Market Score · 15 Cash-on-Cash · 16 Year 1 Cash Needs · 17 Furnishing Budget

**Maps to requirements:** R1.1–R1.7, R2 (extended page template), R3 (URL+share+print), R6 (AffiliateBlock matchups)

**Acceptance:** Seven calculator routes render with AffiliateBlock vendor cards; comp analyzer encodes 3 listings into URL; DSCR outputs lender-tier labels with affiliate URLs.

---

## Phase 3 — 200-city market data + disclosures

**Goal:** The defensibility moat — 200 programmatic city pages, sortable index, FTC `/disclosures` page.

**Tasks (5):** 18 Cities data (200 markets, 10 cities + template) · 19 Cities programmatic pages · 20 Cities index (sortable/filterable) · 21 Cities content collection (5 sample MDX) · 22 Disclosures page

**Maps to requirements:** R1.4 (Market Score), R4 (city data system), R10 (legal)

**Acceptance:** Build produces 200 city HTML files; index sortable by state/score/ADR; `/disclosures` linked from footer site-wide.

---

## Phase 4 — Server (click endpoint) + site pages

**Goal:** Node.js click-logging endpoint deployed alongside static dist; landing, about, contact, lead magnet, sitemap, OG images.

**Tasks (7):** 23 Server bootstrap (Express + MySQL pool) · 24 MySQL schema migration · 25 `/api/click` endpoint (TDD) · 26 Landing page · 27 About + Contact + lead-magnet pages · 28 Sitemap + robots.txt · 29 OG images (Satori)

**Maps to requirements:** R8.1 (click endpoint), R7 (SEO surface)

**Acceptance:** Local Node app receives POST `/api/click` and inserts MySQL row; landing page lists all 7 calculators; OG image PNG exists for every route.

---

## Phase 5 — Analytics + E2E

**Goal:** GA4 cross-domain + custom events, Playwright smoke on every calculator.

**Tasks (2):** 30 GA4 + custom events · 31 Playwright smoke tests

**Maps to requirements:** R7 (analytics events incl. `affiliate_click`)

**Acceptance:** GA4 fires events; Playwright suite green for all 7 calculators + 5 sample city pages.

---

## Phase 6 — CI/CD + production deploy

**Goal:** Green CI on every PR, dual-target deploy (static dist + Node click endpoint), post-deploy smoke, release tag.

**Tasks (5):** 32 GitHub Actions CI · 33 Hostinger FTP deploy (static) · 34 Hostinger deploy (Node click endpoint) · 35 Pre-launch smoke · 36 Final commit + tag v0.1.0

**Maps to requirements:** R8 (build/deploy)

**Acceptance:** Push to `main` triggers green CI + automatic deploy of both surfaces; smoke run hits both static and `/api/click`; v0.1.0 tag pushed.

---

## Sequencing notes

- Phases 1 → 2 → 3 strict order. Calculators (P2) need foundation primitives + affiliate registry. City pages (P3) build on P2 patterns.
- Phase 4 server work (Tasks 23–25) can run in parallel with Phase 3 once Phase 2 lands — independent tracks.
- Phase 5 can run in parallel with Phase 4 site pages.
- Phase 6 last. Open questions in [PROJECT.md](PROJECT.md) (domain, ESP, MySQL on Hostinger, vendor list) must resolve before Phase 4 (vendors block P2 affiliate registry; Hostinger MySQL blocks P4).

---

## Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 — Foundation | complete | 2026-05-05 | 2026-05-06 |
| 2 — Seven calculators | complete | 2026-05-06 | 2026-05-07 |
| 3 — City pages + disclosures | not-started | — | — |
| 4 — Server + site pages | not-started | — | — |
| 5 — Analytics + E2E | not-started | — | — |
| 6 — CI/CD + deploy | not-started | — | — |
