# strguests.tools — ROADMAP

**Status:** Coarse phases derived from spec; per-task breakdown awaits an implementation plan (see [MISSING-PLAN.md](MISSING-PLAN.md)).

Once the plan is authored, this ROADMAP becomes a task-grouping view of that plan (same shape as the sibling sites' ROADMAPs).

---

## Phase 1 — Foundation

**Goal:** Bootable Astro + Express dual-target site with hospitality-warm brand tokens, layout primitives, monetization primitives (incl. PdfDownloadButton, PinterestPinButton, AiRateLimitNotice), URL-state, format, SEO, PDF library base, and Express server skeleton.

**Provisional task list (to be expanded in implementation plan):**

1. Bootstrap Astro static + Node.js Express dual-target repo (pnpm workspace)
2. Brand tokens with hospitality-warm accent
3. Print stylesheet
4. Layout primitives (Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock, Layout)
5. Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, **PdfDownloadButton**, **PinterestPinButton**, **AiRateLimitNotice**)
6. URL-state library (TDD)
7. Format library (TDD)
8. SEO library
9. PDF library base (brand header/footer)
10. Express server skeleton + MySQL pool + rate-limit table schema

**Maps to requirements:** R5 (brand), R6 (monetization primitives + PDF/Pinterest/AI extensions), R7 (SEO library), partial R3 (URL state + format), R8.2 (server schema migration), R10 (AI rate-limit infra)

**Acceptance:** `pnpm dev` serves throwaway route with all chrome + monetization primitives in hospitality-warm accent; `pnpm test` green for libraries; Express server responds to a healthcheck route; MySQL schema migration runs cleanly.

---

## Phase 2 — PDF generators (tools 1–4)

**Goal:** Four client-side PDF generators live, each with live preview pane and PDF download.

**Provisional tasks:**
- House rules generator (R1.1)
- Welcome book builder (R1.2)
- Wifi sign generator (R1.3)
- Check-in instructions generator (R1.4)

**Maps to requirements:** R1.1–R1.4, R2 (extended page template), R3.1 (PDF generator UX), R6 (PdfDownloadButton wiring)

---

## Phase 3 — AI generators (tools 5–7) + server endpoints

**Goal:** Three AI generators live, backed by Express endpoints with rate limiting + email verification.

**Provisional tasks:**
- OpenAI client wrapper + retry/error handling
- Versioned prompt templates per tool
- Server endpoints: `/api/generate-listing`, `/api/generate-review`, `/api/generate-message`
- Email verification flow (token-based)
- Listing description generator (R1.5)
- Review response generator (R1.6)
- Message template generator (R1.7)
- AiRateLimitNotice wiring

**Maps to requirements:** R1.5–R1.7, R3.2 (AI generator UX), R8.1 (server deploy), R10 (AI safety + cost control)

---

## Phase 4 — Programmatic template pages

**Goal:** ~100 message-template scenario pages with sortable index.

**Provisional tasks:**
- `templates.json` data file (~100 scenarios)
- Programmatic `/templates/[scenario]` pages
- Index page `/templates/` with sort + filter
- 5 sample MDX narrative files

**Maps to requirements:** R4

---

## Phase 5 — Pinterest distribution + lead magnet

**Goal:** Per-output Pinterest pin generation; lead-magnet page; landing/about/contact; sitemap; OG images.

**Provisional tasks:**
- Pinterest pin generator (Satori → 1000×1500 PNG)
- PinterestPinButton wiring across generators
- Lead-magnet page ("STR Guest Communication Playbook 2026")
- Landing, About, Contact, get-the-pdf
- Sitemap + robots.txt
- OG image generation (Satori)

**Maps to requirements:** R6 (Pinterest pin generation), R7 (SEO surface)

---

## Phase 6 — Analytics + E2E + CI/CD + deploy

**Goal:** GA4 events, Playwright smoke per generator, CI, dual-target deploy (static + Express).

**Provisional tasks:**
- GA4 cross-domain + custom events (PDF, copy, pin, AI generation, rate-limit, email-verify)
- Playwright smoke per generator
- GitHub Actions CI
- Hostinger deploy (static)
- Hostinger deploy (Express server)
- Pre-launch smoke
- Final tag v0.1.0

**Maps to requirements:** R7 (analytics), R8 (build/deploy), R10 (a11y via E2E)

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
| 1 — Foundation | blocked-on-plan | — | — |
| 2 — PDF generators | not-started | — | — |
| 3 — AI generators + server | not-started | — | — |
| 4 — Programmatic templates | not-started | — | — |
| 5 — Pinterest + lead magnet | not-started | — | — |
| 6 — Analytics + CI/CD + deploy | not-started | — | — |

**Phase 1 is blocked on authoring an implementation plan.** See [MISSING-PLAN.md](MISSING-PLAN.md).
