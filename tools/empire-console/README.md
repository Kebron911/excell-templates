# Empire Console

> One interface to **Promote · Check · Maintain** The STR Ledger empire,
> paired with the n8n nervous system at `infrastructure/n8n/flows/`.

Spec: [`docs/superpowers/specs/2026-05-10-empire-console-design.md`](../../docs/superpowers/specs/2026-05-10-empire-console-design.md).

## Quick start

```bash
cd tools/empire-console
pnpm install
pnpm dev          # http://localhost:4327
```

Open the Today landing. You should see:
- 3 scorecards (P0 actions / stale runbooks / renewals ≤30d)
- Next-action list pulled from `PROGRESS.md`
- Alert feed pulled from `ops/alerts.ndjson` (3 seed entries)

## CLI

```bash
pnpm cli status                                    # exits non-zero on red
pnpm cli alert P1 "stripe webhook flapping" --source manual
pnpm cli dev                                       # alias for `pnpm dev`
```

Once installed globally (`pnpm link --global`), the `empire` binary is available
anywhere.

## What's in Phase 1

- **Today** — PROGRESS next-action + runbook + vendor scorecards + AlertFeed
- **Check → Catalog** — wraps `templates/_build/manifest_check.py`
- **Check → Cluster** — filesystem-level smoke across 4 sister sites
- **Check → Alerts** — full tail of `ops/alerts.ndjson`
- **Maintain → Runbooks** — walks `**/runbooks/*.md` frontmatter, flags >180d
- **Maintain → Vendors** — reads `ops/vendor-inventory.yaml`, computes burn
- **CLI** — `empire dev / status / alert`
- **n8n flows** (in `infrastructure/n8n/flows/`):
  - `shared/telegram-router` — priority router → Telegram + alerts.ndjson
  - `vendor-renewal-watch` — daily 09:00 P1 if renewal ≤7d
  - `runbook-staleness` — Mon 08:00 P1 digest of >180d runbooks
  - `cluster-smoke-fs` — every 15min P0 if dist/ unbuilt or >72h stale

## Phases 2–4

Tracked in the spec. Order:
- **Phase 2**: live HTTP smoke + manifest-watch + link-checker
- **Phase 3**: SQLite + Stripe/Etsy/Gumroad/IS/GA4 nightly-refresh + kill-SKU
- **Phase 4**: action layer — release-shipped, backup-restore-test, gdpr-intake, atomization send, pin generator hoisted from STRGuests

## Architecture

The console **never writes external state**. Every "do something" button posts
to an n8n webhook; n8n owns secrets and side effects. The console reads
filesystem + (eventually) a SQLite cache that n8n nightly-refreshes.

See the spec §5.1 for the data flow diagram.

## Adding a runbook

Drop `*.md` in `ops/runbooks/` or `docs/runbooks/` with frontmatter:

```yaml
---
title: My Runbook
owner: Daniel
last_reviewed: 2026-05-10
cadence: quarterly
---
```

The console reads it on next page load. The n8n `runbook-staleness` flow
emails you when it's >180d old.

## Adding a vendor

Edit `ops/vendor-inventory.yaml`. Schema is documented at the top of the file.
The console re-reads it on every page load — no restart needed. The n8n
`vendor-renewal-watch` flow alerts daily on renewals ≤7 days out.
