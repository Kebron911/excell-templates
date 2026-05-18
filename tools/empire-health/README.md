# @str/empire-health

Empire-wide uptime + TLS monitor. Reads the site list from `@str/catalog`, runs
HTTP and SSL checks on a cron, and exposes a public status page plus a JSON
API.

Tier A Block 1C of `TIER-A-PLATFORM-PLAN.md`. Matches the Pinforge service
pattern (Fastify, Zod env, in-memory store, single-binary deploy).

## Quickstart

```bash
pnpm -F @str/catalog build
pnpm -F @str/empire-health build
pnpm -F @str/empire-health start
# empire-health listening on 127.0.0.1:8789
```

Visit `http://127.0.0.1:8789/` for the HTML status page.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | HTML status page (public) |
| GET | `/healthz` | service self-health |
| GET | `/v1/status` | JSON snapshot — overall + per-site http/ssl |

## Env

| Var | Default | Notes |
|-----|---------|-------|
| `EMPIRE_HEALTH_PORT` | `8789` | |
| `EMPIRE_HEALTH_HOST` | `127.0.0.1` | `0.0.0.0` for public |
| `EMPIRE_HEALTH_INTERVAL_MS` | `300000` | HTTP probe interval (5 min) |
| `EMPIRE_HEALTH_SSL_INTERVAL_MS` | `21600000` | SSL probe interval (6 hrs) |
| `EMPIRE_HEALTH_TIMEOUT_MS` | `10000` | Per-probe timeout |
| `EMPIRE_HEALTH_SSL_WARN_DAYS` | `14` | Warn threshold before expiry |

## What it checks

For every site in the catalog:

- **HTTP** — `GET https://<site>/`. `ok` = 2xx, `warn` = 4xx, `fail` = 5xx / network error / timeout.
- **SSL** — TLS handshake to `<site>:443`, reads peer cert. `ok` = valid + >= warn-days remaining. `warn` = valid but expiring soon. `fail` = expired / handshake failure.

Overall site status escalates: any `fail` → `fail`, any `warn` → `warn`, else `ok`.

## What it deliberately doesn't do yet

- **Alerting** — blocked on alert-destination decision (see BACKLOG.md manual prereqs). Status changes are visible but not yet pushed.
- **Broken-link sweep** — pure-checks scope only for v1. Add when crawl budget acceptable.
- **Form-submit canary** — blocked on Tier S Phase 4 (Contact Graph), since the canary needs a real lead-capture endpoint.
- **Persistence** — in-memory store is fine for v1; if the process restarts, the next interval refills it within minutes.

## Deploy

PM2 alongside `catalog-api` on the same host (Hostinger or Railway, match
Pinforge pattern). Status page sits behind a reverse proxy at
`dashboard.thestrledger.com/status`.

```bash
pm2 start ./dist/main.js --name empire-health
```
