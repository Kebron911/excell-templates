# strhost.tools — ROADMAP

Phase grouping of the 29 atomic tasks from [implementation plan](../docs/superpowers/plans/2026-05-05-strhost-tools.md).

---

## Phase 1 — Foundation `[active]`

**Goal:** Bootable Astro site with brand tokens, layout primitives, and monetization primitives. No calculators yet, but the chrome around them is real and ready.

**Tasks (8):** 1 Bootstrap project · 2 Brand tokens + Tailwind theme · 3 Print stylesheet · 4 Format library (TDD) · 5 URL-state library (TDD) · 6 SEO library · 7 Layout primitives · 8 Monetization primitives

**Maps to requirements:** R5 (brand), R6 (monetization primitives), R7 (SEO library), partial R3 (URL state + format)

**Acceptance:** `pnpm dev` starts; landing route renders Header+Footer+FunnelBand with brand tokens; Vitest green for `format.ts` and `url-state.ts`; AdSlot/EmailCaptureCard/STRLedgerCTA components exist and render placeholders.

---

## Phase 2 — Six standalone calculators

**Goal:** Six of seven calculators live, each TDD'd, each rendering the canonical per-tool page template.

**Tasks (6):** 9 Airbnb fee · 10 Profit · 11 Cleaning fee · 12 RevPAR · 13 Break-even · 14 Co-host split

**Maps to requirements:** R1.1–R1.6, R2 (page template), R3 (URL+share+print)

**Acceptance:** Six routes serve hydrated calculators with green Vitest math suites; each page renders the 12-element template; share+print work.

---

## Phase 3 — Lodging-tax system (50 state pages)

**Goal:** The defensibility moat — 50 programmatic state pages plus the index.

**Tasks (5):** 15 Lodging-tax data file · 16 Lodging-tax calculator logic + island · 17 Programmatic state pages · 18 Index page · 19 Per-state narrative MDX

**Maps to requirements:** R1.7, R4

**Acceptance:** Build produces 50 `/lodging-tax/<state>/` HTML files; index page lists and links all 50; per-state calculator pre-loads correct rate; lastVerified disclaimer visible.

---

## Phase 4 — Site pages + SEO surface

**Goal:** Landing, About, Contact, lead magnet, sitemap, robots.txt, OG images.

**Tasks (4):** 20 Landing page · 21 About + Contact + Lead-magnet · 22 Sitemap + robots · 23 OG image generator (Satori)

**Maps to requirements:** R7

**Acceptance:** Landing lists all 7 tools; sitemap has all routes; OG image PNG exists for every page; lead-magnet form posts to ESP.

---

## Phase 5 — Analytics + E2E

**Goal:** GA4 cross-domain tracking, Playwright E2E coverage on every calculator.

**Tasks (2):** 24 GA4 cross-domain · 25 Calculator E2E tests

**Maps to requirements:** R7 (analytics), R10 (a11y via E2E)

**Acceptance:** GA4 fires custom events; cross-domain measurement to thestrledger.com works; Playwright suite green for all 7 calculators.

---

## Phase 6 — CI/CD + production deploy

**Goal:** Green CI on every PR, automated FTP deploy to Hostinger, post-deploy smoke, release tag.

**Tasks (4):** 26 GitHub Actions CI · 27 Hostinger FTP deploy · 28 Pre-launch smoke · 29 Final release tag

**Maps to requirements:** R8

**Acceptance:** Push to `main` triggers green CI + automatic deploy; smoke run against deployed URL passes; v1.0.0 tag pushed.

---

## Sequencing notes

- Phases 1 → 2 → 3 → 4 strict order. Calculators (P2) need foundation primitives. State pages (P3) build on lodging-tax calculator pattern. Site pages (P4) link to existing routes.
- Phase 5 can run in parallel with Phase 4 once Phase 2 lands (analytics doesn't depend on landing copy).
- Phase 6 is last. Open questions in [PROJECT.md](PROJECT.md) (domain, ESP, GA4 vs Plausible) must be resolved before Phase 4 (ESP) and Phase 5 (analytics).

---

## Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 — Foundation | complete | 2026-05-05 | 2026-05-06 |
| 2 — Calculators | complete | 2026-05-06 | 2026-05-06 |
| 3 — Lodging-tax | complete | 2026-05-06 | 2026-05-06 |
| 4 — Site pages | complete | 2026-05-06 | 2026-05-06 |
| 5 — Analytics + E2E | complete | 2026-05-06 | 2026-05-06 |
| 6 — CI/CD + deploy | code-complete | 2026-05-06 | 2026-05-06 |
| Post-launch — manual | open | 2026-05-07 | — |

---

## Post-launch backlog (manual, not part of any phase)

These tasks need credentials or owner-of-domain auth that the agent can't perform on your behalf. Address whenever convenient.

| ID | Task | Owner action | Notes |
|----|------|--------------|-------|
| PL-1 | Submit `https://strhost.tools/sitemap-index.xml` to **Google Search Console** | Sign in at search.google.com/search-console as domain owner; add property; submit sitemap | Re-submit after every major content drop. Sitemap auto-regenerates on each deploy. |
| PL-2 | Submit same sitemap to **Bing Webmaster Tools** | Sign in at bing.com/webmasters; verify domain via DNS or HTML tag; submit sitemap | Bing's index also feeds DuckDuckGo + Yahoo, worth ~5–8% extra organic. |
| PL-3 | Lock down `~/Desktop/Claude OS/.secrets/hostinger.env` permissions | Run the `icacls` command from the file header to remove inherited ACLs | Currently inherits SYSTEM/Administrators/user; lock to user-only. |
| PL-4 | Apply for **Google AdSense** | Apply once content baseline is 10+ pages with traffic | Don't apply too early; AdSense rejects thin sites. Wait 30–60 days post-launch. |
| PL-5 | ~~Submit URLs to **IndexNow**~~ | **DONE 2026-05-07** | Wired into deploy workflow as a post-deploy step. Each push to main now POSTs the full sitemap URL list to api.indexnow.org (Bing/Yandex/Seznam/Naver). Verification file at `/79e611376c54023468173bf8d3c0f85e.txt`. Submit script: `STRHost-Tools/scripts/indexnow-submit.mjs`. |
