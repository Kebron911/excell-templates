# strguests.tools

Free tools for short-term rental hosts to delight guests — 4 PDF generators (house rules, welcome book, wifi sign, check-in instructions) + 3 AI generators (listing descriptions, review responses, guest messages) + ~100 programmatic message-template scenario pages.

Sister site to [strhost.tools](../STRHost-Tools), [strops.tools](../STROps-Tools), [strbuyers.tools](../STRBuyers-Tools), and [The STR Ledger](../) (Excel-Templates).

## Architecture

Dual-target:

- **Astro 4.x static site** — tools 1–4 (PDF), content collections, programmatic scenario pages, brand chrome. Deployed to Hostinger via FTP.
- **Express + MySQL server** — tools 5–7 (AI generators) wrapping OpenAI GPT-4o-mini behind rate limits + email verification. Deployed to Hostinger Apps via SSH/rsync.

Brand identity: hospitality-warm terracotta accent. Cormorant Garamond gets more screen time on this site than siblings (guidebooks suit serif).

## Dev workflow

```bash
pnpm install
pnpm dev          # Astro static site on :4321
pnpm server:dev   # Express API on :3001 (in a second terminal)
pnpm test         # Vitest (format, url-state, pdf base, server/db)
pnpm typecheck    # astro check + tsc on root + server tsconfigs
pnpm e2e          # Playwright (Chromium)
```

## Folder structure

```
src/                        # Astro static site
  components/
    chrome/                 # Header, Footer, Sidebar, Wordmark, FunnelBand, ClusterFunnelBlock, Layout
    ads/                    # AdSlot
    funnel/                 # EmailCaptureCard, STRLedgerCTA
    generator/              # PdfDownloadButton, PinterestPinButton, AiRateLimitNotice
  lib/
    format.ts               # currency, percent, phone formatters (TDD)
    url-state.ts            # debounced replaceState (TDD)
    seo.ts                  # Schema.org JSON-LD builders incl. Article
    pdf/                    # PDF library base (header/footer/types)
  styles/
    tokens.css              # design tokens (hospitality-warm accent)
    global.css
server/                     # Express API for AI tools
  index.ts                  # Express skeleton + /api/health
  lib/db.ts                 # MySQL pool wrapper
  db/
    schema.sql              # rate_limits, email_verifications, generation_logs
    migrate.ts
tests/                      # Vitest + Playwright (e2e/)
public/                     # static assets, og/ output
```

## Brand

Position: "Free tools for hosts to delight guests."
Lifecycle stage: Guest XP (optimizing) — fourth stop in the host lifecycle.
Accent: hospitality-warm terracotta.
Wordmark: `STR Guests`·*tools* — terracotta brand name + neutral tld trailing per [Cluster Style Guide §1](../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md#1-wordmark).

## Phase status

See [.planning/STATE.md](.planning/STATE.md) for the live state. Phases 1–5 ✅ + Phase 3 ✅ + Phase 6 (Tasks 32–35 ✅, Task 36 deferred until live deploy succeeds).

## Deployment

Two workflows live at the repo root under `.github/workflows/`:

- **`strguests-ci.yml`** — runs on every PR + push to main: typecheck, vitest, Playwright smokes.
- **`strguests-deploy.yml`** — runs on push to main when the GitHub Actions variable `STRGUESTS_DEPLOY_ENABLED == 'true'` AND the secrets below are set.

### First-launch posture (Phase 6, no MySQL)

Per the deploy decision in `.planning/STATE.md`: ship the surface, leave the AI/db features dark. The Express server boots and `/api/health` responds; every DB-backed route returns 503 `rate_limit_unavailable` until MySQL is provisioned. To stand the site up:

1. Create `~/strguests-api/.env` on the Hostinger box from [`infrastructure/hostinger.env.example`](infrastructure/hostinger.env.example). Leave `MYSQL_*` blank.
2. Configure GitHub Actions secrets: `HOSTINGER_DEPLOY_HOST`, `HOSTINGER_FTP_USER`, `HOSTINGER_FTP_PASSWORD`, `HOSTINGER_FTP_SERVER_DIR`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_KEY`, `HOSTINGER_SSH_PORT`, `HOSTINGER_API_DIR`.
3. Set the `STRGUESTS_DEPLOY_ENABLED` repo variable to `true`.
4. Push to `main` — the workflow FTPs `dist/` to `public_html/` and rsyncs `server/` to `~/strguests-api/`, then runs [`infrastructure/deploy/server-restart.sh`](infrastructure/deploy/server-restart.sh) over SSH (idempotent: pnpm install --prod, tsc, optional db:migrate, pm2 reload, /api/health smoke).

### Promoting from dark-mode to live

Provision MySQL on Hostinger Business → fill `MYSQL_*` in `~/strguests-api/.env` → restart pm2. The migration runs automatically on the next deploy. Then add `ANTHROPIC_API_KEY` to enable AI generators.
