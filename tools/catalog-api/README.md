# @str/catalog-api

REST API in front of `@str/catalog`. Serves the tool catalog to every site, the
dashboard, n8n workflows, the upsell engine, and the AI concierge.

Matches the `@str/pinforge-api` pattern: Fastify, Zod-validated env,
`X-API-Key` auth, pino logging, single-binary deploy.

## Quickstart

```bash
pnpm -F @str/catalog build
pnpm -F @str/catalog-api build
export CATALOG_API_KEY="some-secret-at-least-32-chars-long-xx"
pnpm -F @str/catalog-api start
# catalog-api listening on 127.0.0.1:8788
```

## Auth

`X-API-Key: $CATALOG_API_KEY` required on every route except:
- `GET /healthz`
- `GET /v1/catalog/min` (when `CATALOG_API_PUBLIC_MIN=true`, default)

The min endpoint is public so any site can hydrate cross-site nav / related
tools without leaking analytics events, owner notes, or planned tools.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthz` | health |
| GET | `/v1/catalog` | full catalog (auth) |
| GET | `/v1/catalog/min` | shipped tools only, no metadata (public if `CATALOG_API_PUBLIC_MIN=true`) |
| GET | `/v1/sites` | all sites |
| GET | `/v1/sites/:siteId` | one site |
| GET | `/v1/sites/:siteId/tools` | tools for a site |
| GET | `/v1/tools` | all tools — filters: `?site=&category=&status=&tier=` |
| GET | `/v1/tools/:id` | one tool |
| GET | `/v1/events` | locked GA4 event enum |

## Env

| Var | Required | Default | Notes |
|-----|----------|---------|-------|
| `CATALOG_API_KEY` | yes | — | min 32 chars |
| `CATALOG_API_PORT` | no | `8788` | |
| `CATALOG_API_HOST` | no | `127.0.0.1` | `0.0.0.0` for public |
| `CATALOG_API_CORS_ORIGINS` | no | `""` | comma-separated; empty disables CORS |
| `CATALOG_API_PUBLIC_MIN` | no | `true` | expose `/v1/catalog/min` without API key |

## Deploy

Hostinger / Railway / PM2 — match `tools/pinforge-api`. Public URL is
`https://dashboard.thestrledger.co/api/catalog/*` (reverse proxy).
