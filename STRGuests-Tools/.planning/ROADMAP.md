# strguests.tools — ROADMAP

Phase grouping of the 36 atomic tasks from [implementation plan](../docs/superpowers/plans/2026-05-05-strguests-tools.md).

---

## Phase 1 — Foundation

**Goal:** Bootable Astro + Express dual-target site with hospitality-warm brand tokens, layout primitives, monetization primitives (incl. PdfDownloadButton, PinterestPinButton, AiRateLimitNotice), URL-state, format, SEO, PDF library base, and Express server skeleton.

**Tasks (10):** 1 Bootstrap dual-target repo · 2 Brand tokens (hospitality-warm) · 3 Print stylesheet · 4 Layout primitives · 5 Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, **PdfDownloadButton**, **PinterestPinButton**, **AiRateLimitNotice**) · 6 URL-state library (TDD) · 7 Format library (TDD) · 8 SEO library · 9 PDF library base (brand header/footer) · 10 Express server skeleton + MySQL pool + schema migration

**Maps to requirements:** R5 (brand), R6 (monetization primitives + PDF/Pinterest/AI extensions), R7 (SEO library), partial R3 (URL state + format), R8.2 (server schema migration), R10 (AI rate-limit infra)

**Acceptance:** `pnpm dev` serves throwaway route with all chrome + monetization primitives in hospitality-warm accent; `pnpm test` green for libraries; Express server responds to a healthcheck route; MySQL schema migration runs cleanly.

---

## Phase 2 — PDF generators (tools 1–4)

**Goal:** Four client-side PDF generators live, each with live preview pane.

**Tasks (5):** 11 House rules · 12 Welcome book · 13 Wifi sign · 14 Check-in instructions · 15 Soft email-gate modal pattern

**Maps to requirements:** R1.1–R1.4, R2, R3.1, R6 (PdfDownloadButton + email gate)

---

## Phase 3 — AI generators (tools 5–7) + server endpoints

**Goal:** Three AI generators backed by Express endpoints with rate limiting + email verification.

**Tasks (6):** 16 OpenAI client wrapper · 17 Email verification flow · 18 Rate-limit middleware · 19 Listing description generator (endpoint + UI) · 20 Review response generator · 21 Message template generator

**Maps to requirements:** R1.5–R1.7, R3.2, R8.1, R10 (AI safety + cost control)

---

## Phase 4 — Programmatic template pages

**Goal:** ~100 message-template scenario pages with sortable index.

**Tasks (3):** 22 `templates.json` data file · 23 `/templates/[scenario]` programmatic pages + 5 sample MDX · 24 `/templates/` index with sort + filter

**Maps to requirements:** R4

---

## Phase 5 — Pinterest + site pages + SEO surface

**Goal:** Per-output Pinterest pin generation; lead magnet; landing/about/contact; sitemap; OG images.

**Tasks (7):** 25 Pinterest pin generator (Satori) · 26 PinterestPinButton wiring across generators · 27 Lead-magnet page · 28 Landing page · 29 About + Contact · 30 Sitemap + robots · 31 OG images (Satori)

**Maps to requirements:** R6 (Pinterest), R7 (SEO surface)

---

## Phase 6 — Analytics + E2E + CI/CD + deploy

**Goal:** GA4 events, Playwright smokes, CI, dual-target deploy, release tag.

**Tasks (5):** 32 GA4 cross-domain + custom events · 33 Playwright E2E smokes per generator · 34 GitHub Actions CI · 35 Hostinger deploys (static FTP + server SSH) · 36 Pre-launch smoke + v0.1.0 tag

**Maps to requirements:** R7 (analytics), R8 (build/deploy), R9/R10 (a11y via E2E)

---

## Sequencing notes

- Phase 1 → 2 strict order. PDF generators (P2) need PDF library base (P1 Task 9).
- Phase 2 ↔ Phase 3 can run in parallel once Phase 1 lands. PDF tools and AI tools are independent surfaces with shared monetization primitives.
- Phase 4 (programmatic templates) is a content-data task — can run anytime after Phase 1.
- Phase 5 Pinterest pin generation depends on at least one generator (P2 or P3) producing output.
- Open questions in [PROJECT.md](PROJECT.md) (domain, ESP, OpenAI key, MySQL, PDF co-branding default, Pinterest account) must resolve before Phase 3 (OpenAI/MySQL) and Phase 5 (Pinterest).

---

## Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 — Foundation | complete | 2026-05-05 | 2026-05-06 |
| 2 — PDF generators | complete | 2026-05-06 | 2026-05-06 |
| 3 — AI generators + server | complete (code-only — live key deferred to Phase 6) | 2026-05-07 | 2026-05-07 |
| 4 — Programmatic templates | complete | 2026-05-06 | 2026-05-06 |
| 5 — Pinterest + site pages | complete | 2026-05-06 | 2026-05-06 |
| 6 — Analytics + CI/CD + deploy | not-started | — | — |
