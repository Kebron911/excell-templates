# Phase 6 — CI/CD + production deploy

**Phase goal:** Green CI on every PR/push, production deploy to Hostinger at `strops.tools`, post-deploy smoke verification, and v0.1.0 launch tag.

**Tasks (4):** 33 GitHub Actions CI · 34 Hostinger deploy script · 35 Pre-launch smoke · 36 Final commit + tag v0.1.0

**Maps to requirements:** R8 (build/deploy)

**Acceptance:**
- CI workflow at monorepo root `.github/workflows/ci-strops-tools.yml` runs typecheck, vitest, build, e2e on PR + push
- Deploy workflow `.github/workflows/deploy-strops-tools.yml` follows sister-site (strhost / strguests) rsync-over-SSH pattern using `STR_SSH_KEY` secret
- Local PowerShell deploy script `deploy/scripts/deploy-strops.ps1` exists for manual / launch deploy
- `https://strops.tools/` returns 200 with production landing (not the placeholder)
- All 7 tools, 5 sample maintenance + 5 sample replacement MDX pages, sitemap, robots, OG image return 200
- `v0.1.0-strops` tag pushed

---

## Task 33 — GitHub Actions CI ✅

- [x] Create `.github/workflows/ci-strops-tools.yml` at monorepo root with `paths: STROps-Tools/**` filter (mirrors sister-site convention but separates CI from deploy)
- [x] Steps: checkout, pnpm 9, Node 22, install with frozen lockfile in `STROps-Tools/`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm exec playwright install --with-deps chromium`, `pnpm e2e`
- [x] Cache: pnpm via `cache-dependency-path: STROps-Tools/pnpm-lock.yaml`; Playwright browsers via `actions/cache` keyed on lockfile
- [x] Trigger: PR + push to `main`
- [x] Commit: `feat(strops-tools): GitHub Actions CI workflow (Phase 6 Task 33)`

**Verify:** YAML parses (no `actionlint` available locally — well-formed YAML + identical-shape to sister sites is the bar).

---

## Task 34 — Hostinger deploy ✅

- [x] Create `deploy/scripts/deploy-strops.ps1` at `Claude OS\deploy\scripts\` (outside repo per existing convention)
- [x] Parses `..\..\.secrets\hostinger.env`, supports `-WhatIf` dry-run + `-VerifyOnly` + `-SkipBuild` + `-ProjectRoot`
- [x] Steps: `pnpm build` in `STROps-Tools/` → `ssh rm domains/strops.tools/public_html/default.php` → `scp -r dist/* user@host:domains/strops.tools/public_html/` → HTTPS 200 verify
- [x] Optional GA4 / ESP env injection from `hostinger.env` if present (build-time)
- [x] Create monorepo deploy workflow `.github/workflows/deploy-strops-tools.yml` mirroring `deploy-strhost-tools.yml` shape (rsync over SSH using `STR_SSH_KEY`)
- [x] Document invocation in `STROps-Tools/docs/deploy.md`
- [x] Commit: `feat(strops-tools): Hostinger deploy script (Phase 6 Task 34)`

**Verify:** `-WhatIf` prints expected actions without touching server; SSH key file exists.

---

## Task 35 — Pre-launch smoke ✅

- [x] Run `deploy-strops.ps1` for real (no `-WhatIf`) — 103 pages built, 21 dist/ entries scp'd
- [x] Smoke check 28/28 endpoints HTTP 200: `/`, all 7 tool routes, both indexes (`/maintenance/`, `/replace/`), 5 sample maintenance MDX pages, 5 sample replacement MDX pages, all 3 lead magnets, `/sitemap-index.xml`, `/robots.txt`, `/og/index.png`, `/about/`, `/contact/`
- [x] Document outputs to `STROps-Tools/docs/launch-smoke-2026-05-08.md`
- [x] Commit: `feat(strops-tools): pre-launch deploy + smoke verified (Phase 6 Task 35)`

**Verify:** All smoke URLs return 200 and serve expected content (not Hostinger default.php).

---

## Task 36 — Final commit + tag v0.1.0

- [ ] Update `STROps-Tools/CLAUDE.md` and `MEMORY.md` to reflect launched state (live URL, last deploy, monetization status)
- [ ] Update root `Excel-Templates/PROGRESS.md` if it tracks this site
- [ ] Update STATE.md (phase 6 complete, project complete) and ROADMAP.md (Phase 6 → completed; add "Launched" header section)
- [ ] Tag `v0.1.0-strops` (suffix because monorepo also tags strhost/strguests)
- [ ] Commit: `chore(strops-tools): mark Phase 6 complete + v0.1.0 launched`
