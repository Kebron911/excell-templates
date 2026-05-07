# Phase 6 — Analytics + E2E + CI/CD + deploy

**Goal:** GA4 event coverage complete, Playwright E2E smokes per generator, GitHub Actions CI gating PRs, Hostinger deploy workflow ready, pre-launch tag (Task 36 deferred until live deploy succeeds).

**Source plan:** [`docs/superpowers/plans/2026-05-05-strguests-tools.md`](../../../docs/superpowers/plans/2026-05-05-strguests-tools.md)

**Deploy posture (per user direction 2026-05-07):** Phase 6 ships behind a `hostinger.env` that does NOT include MySQL credentials. Static dist deploys via FTP; Express server deploys via SSH and boots, but every DB-backed route (`/api/rate-limit-status`, `/api/verify-email`, `/api/generate-*`) returns 503 `rate_limit_unavailable` (or equivalent) until MySQL is provisioned. `/api/health` works. This is an intentional phased deploy — surface live, AI/db features dark.

**Requirements satisfied:** R7 (analytics events), R8 (build/deploy), R9/R10 (a11y via Playwright)

**Acceptance for the phase:**

- All R7 events emitted by the right surfaces (verified by grep + Playwright)
- `pnpm e2e` runs Playwright against `pnpm preview`; one smoke per generator + landing + templates index passes
- `.github/workflows/ci.yml` runs typecheck + vitest + playwright on PR
- `.github/workflows/deploy.yml` exists and is wired to deploy on push to `main` (will not run until secrets are added in GitHub)
- `STATE.md` + `ROADMAP.md` reflect Phase 6 partial-complete (Task 36 pending live deploy)
- Working tree committed task-by-task

---

## Task 32 — GA4 cross-domain + custom events

**Source:** Task 32 in source plan

**Files:**
- `src/lib/analytics.ts` — typed event surface (single source of truth)
- `src/components/chrome/Layout.astro` — already has gated GA4 base + cross-domain linker (Phase 5)
- Per-component event emits: `PdfDownloadButton.astro` (pdf_downloaded), `PinterestPinButton.astro` (pin_generated + pin_intent_opened), `EmailCaptureCard.astro` (email_captured), `STRLedgerCTA.astro` (str_ledger_cta_clicked), AI generators (ai_generation_completed, ai_rate_limit_hit, text_copied), `templates/[scenario].astro` (template_scenario_viewed), `verify-email.astro` (email_verified)
- `src/pages/verify-email.astro` — new HTML landing page that calls GET `/api/verify-email/confirm` from the browser; emits `email_verified` on success

**Acceptance:**
- All 10 documented events present in source (grep proves coverage)
- Layout's GA4 script remains gated on `PUBLIC_GA4_ID` — emits are no-ops when env var is unset
- Commit: `feat(strguests-tools): GA4 event coverage + verify-email landing page (Phase 6 Task 32)`

---

## Task 33 — Playwright E2E smokes per generator

**Source:** Task 33 in source plan

**Files:**
- `playwright.config.ts` — already exists; verify webServer points at `pnpm preview`
- `tests/e2e/{landing,house-rules,welcome-book,wifi-sign,checkin,listing,review,messages,templates-index,about}.spec.ts`

**Acceptance:**
- One spec per generator: page renders, h1 visible, no console errors, key interaction works
- AI generator specs assert the form submits and surfaces an error message when the API is unreachable (live key not required)
- `pnpm e2e` exits 0 against `pnpm preview`
- Commit: `test(strguests-tools): Playwright E2E smokes per generator (Phase 6 Task 33)`

---

## Task 34 — GitHub Actions CI

**Source:** Task 34 in source plan

**Files:**
- `.github/workflows/ci.yml` — typecheck, lint, vitest, playwright on PR + push to main

**Acceptance:**
- Workflow runs on `pull_request` + `push` to `main`
- Steps: setup pnpm, install deps, typecheck (allow pre-existing errors), vitest, playwright with browser cache
- Commit: `ci(strguests-tools): GitHub Actions pipeline (Phase 6 Task 34)`

---

## Task 35 — Hostinger deploy workflow (no-MySQL)

**Source:** Task 35 in source plan, plus Daniel's 2026-05-07 direction

**Files:**
- `.github/workflows/deploy.yml` — builds dist, FTPs to Hostinger htdocs, SSHs to server dir, restarts pm2
- `infrastructure/hostinger.env.example` — documents the env vars deploy reads (no MySQL)
- `infrastructure/deploy/server-restart.sh` — idempotent server-side script: pulls, installs, builds, pm2 reload

**Acceptance:**
- Workflow guarded by `secrets.HOSTINGER_DEPLOY_HOST` so it skips when secrets are absent
- Deploy YAML uploads `dist/` (Astro static) + `server/dist/` (compiled Express) to discrete paths
- README.md gains a "Deployment" section pointing at the workflow + env file
- Commit: `feat(strguests-tools): Hostinger deploy workflow (no-MySQL phase) (Phase 6 Task 35)`

**Out of scope (deferred to live-deploy session):**
- Configuring Hostinger DNS to the new dist
- Provisioning MySQL on Hostinger
- Pushing live secrets into GitHub Settings → Secrets

---

## Task 36 — Pre-launch smoke + v0.1.0 tag (DEFERRED)

Cannot run until Task 35 has executed at least once against a real Hostinger account. Re-enter Phase 6 to land Task 36 once that happens.

---

## Decisions log (will move to STATE.md on commit)

- **Phased deploy without MySQL.** Per user 2026-05-07: ship the surface, accept that DB-backed routes return 503 until MySQL is provisioned. Reduces deploy-risk surface area on first launch.
- **Centralized analytics.ts.** Future audits grep one file rather than 12 inline `gtag` calls.
- **Pin events emit BOTH names.** `pin_generated` honors REQUIREMENTS.md R7 verbatim; `pin_intent_opened` is the truthful runtime event (we open Pinterest's intent, we don't generate the pin client-side). Both fire on click.
