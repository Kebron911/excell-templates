# @str/pinforge-api

REST API wrapping `@str/pinforge`. Accepts pin generation requests, renders PNG output via Sharp + Satori, and exposes 11 endpoints with auth, rate limiting, and Swagger UI.

See `docs/superpowers/specs/2026-05-16-pinforge-design.md` section 9 for the design spec.

---

## Quickstart

```bash
# 1. Build
pnpm -F @str/pinforge-api build

# 2. Set required env vars
export PINFORGE_API_KEY="your-secret-key-min-32-chars"
export OPENAI_API_KEY="sk-..."

# 3. Start
pnpm -F @str/pinforge-api start

# 4. Verify
curl http://localhost:8787/healthz
# => {"status":"ok","version":"0.1.0"}
```

Root convenience scripts (from monorepo root):

```bash
pnpm pinforge-api:start   # start the server
pnpm pinforge-api:test    # run all tests
pnpm pinforge-api         # run any @str/pinforge-api script, e.g.: pnpm pinforge-api build
```

---

## Auth

All routes except `/healthz` and `/docs/*` require an `X-API-Key` header:

```bash
curl -H "X-API-Key: $PINFORGE_API_KEY" http://localhost:8787/v1/brands
```

Missing or wrong key returns `401 Unauthorized`.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PINFORGE_API_KEY` | Yes | — | API key (min 32 chars) |
| `OPENAI_API_KEY` | Yes | — | OpenAI key for SEO copy generation |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI chat model |
| `PINFORGE_API_PORT` | No | `8787` | Port to listen on |
| `PINFORGE_API_HOST` | No | `127.0.0.1` | Host to bind — set to `0.0.0.0` for public |
| `PINFORGE_BRANDS_DIR` | No | `./brands` | Path to brand JSON directory |
| `PINFORGE_OUTPUT_DIR` | No | `./dist/pins` | Where rendered PNGs are written |
| `PINFORGE_JOBS_DIR` | No | `./dist/jobs` | Where job result JSON is stored |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate limit window (ms) |
| `BODY_LIMIT_JSON` | No | `262144` | JSON body size limit (bytes) |
| `BODY_LIMIT_CSV` | No | `5242880` | CSV/multipart upload limit (bytes) |
| `BULK_MAX` | No | `500` | Max pins per bulk request |
| `SYNC_TIMEOUT_MS` | No | `90000` | Max ms for sync pin generation |
| `N8N_BASE_URL` | No | — | n8n webhook base URL (enables AI background images) |
| `N8N_PIN_KEY` | No | — | n8n API key |
| `UNSPLASH_ACCESS_KEY` | No | — | Unsplash API key (enables photo backgrounds) |
| `QUEUE_CONCURRENCY` | No | `3` | Parallel pin generation for bulk jobs |

---

## Endpoints

### Health

#### `GET /healthz`

No auth required. Returns server status.

```bash
curl http://localhost:8787/healthz
```

```json
{"status":"ok","version":"0.1.0"}
```

---

### Pins

#### `POST /v1/pins` — Generate a single pin

**Async (default):** returns immediately with a `jobId`.

```bash
curl -X POST http://localhost:8787/v1/pins \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "strguests",
    "topic": "5 Things Guests Forget to Check Before Checking Out",
    "primaryKeyword": "STR checkout tips",
    "destinationUrl": "https://strguests.tools/checkout",
    "backgroundType": "solid"
  }'
```

```json
{
  "jobId": "job-abc123",
  "pollUrl": "/v1/jobs/job-abc123",
  "estimatedSeconds": 8
}
```

**Sync (wait for result):** add `?sync=1`. Blocks up to `SYNC_TIMEOUT_MS`.

```bash
curl -X POST "http://localhost:8787/v1/pins?sync=1" \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "strguests",
    "topic": "Best Welcome Basket Ideas for Airbnb Hosts",
    "primaryKeyword": "Airbnb welcome basket",
    "destinationUrl": "https://strguests.tools/welcome",
    "backgroundType": "solid"
  }'
```

```json
{
  "pin": {
    "schema": "pinforge.v1",
    "brandId": "strguests",
    "templateId": "big-hook",
    "title": "Best Welcome Basket Ideas",
    "description": "...",
    "altText": "...",
    "hashtags": ["#airbnb", "#welcomebasket"],
    "destinationUrl": "https://strguests.tools/welcome",
    "imagePath": "/abs/path/to/pins/2026-05-17/strguests/best-welcome-basket-9a1f.png"
  },
  "paths": {
    "png": "/abs/path/...",
    "json": "/abs/path/..."
  }
}
```

**Request body fields:**

| Field | Required | Type | Description |
|---|---|---|---|
| `brandId` | Yes | string | Brand identifier (e.g. `strguests`, `excel-templates`) |
| `topic` | No | string | Pin topic (required if `inputMode` is not `url`) |
| `primaryKeyword` | No | string | SEO keyword |
| `destinationUrl` | No | string (URI) | Click-through URL |
| `templateId` | No | string | Override template (see `/v1/templates`) |
| `backgroundType` | No | `solid` \| `image` | Background type |
| `boardHint` | No | string | Pinterest board suggestion |
| `inputMode` | No | `topic` \| `url` | Input mode |
| `sourceUrl` | No | string (URI) | URL to scrape (when `inputMode=url`) |

---

#### `GET /v1/pins/:slug` — Get pin metadata

Returns the stored JSON metadata for a pin by its slug.

```bash
curl http://localhost:8787/v1/pins/best-welcome-basket-9a1f \
  -H "X-API-Key: $PINFORGE_API_KEY"
```

```json
{
  "pin": { "schema": "pinforge.v1", "brandId": "strguests", ... },
  "paths": { "png": "...", "json": "..." }
}
```

Returns `404` if slug not found.

---

#### `GET /v1/pins/:slug/image` — Serve pin PNG

Streams the rendered PNG. Suitable for `<img src>` or direct download.

```bash
curl http://localhost:8787/v1/pins/best-welcome-basket-9a1f/image \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  --output pin.png
```

Response headers:
- `Content-Type: image/png`
- `Cache-Control: public, max-age=31536000, immutable`

Returns `404` if slug not found.

---

#### `POST /v1/pins/bulk` — Bulk generate from JSON array

Enqueues up to `BULK_MAX` pins. Returns a `jobId` immediately.

```bash
curl -X POST http://localhost:8787/v1/pins/bulk \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "brandId": "strguests",
      "topic": "Airbnb check-in tips",
      "primaryKeyword": "airbnb tips",
      "destinationUrl": "https://strguests.tools/tips",
      "backgroundType": "solid"
    },
    {
      "brandId": "excel-templates",
      "topic": "Budget spreadsheet templates",
      "primaryKeyword": "excel budget",
      "destinationUrl": "https://excel-templates.io/budget",
      "backgroundType": "solid"
    }
  ]'
```

```json
{
  "jobId": "job-xyz789",
  "count": 2,
  "pollUrl": "/v1/jobs/job-xyz789"
}
```

---

#### `POST /v1/pins/csv` — Bulk generate from CSV upload

Upload a CSV file with pin data. Columns: `brandId`, `topic`, `primaryKeyword`, `destinationUrl`, `backgroundType` (optional).

```bash
curl -X POST http://localhost:8787/v1/pins/csv \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -F "file=@pins.csv"
```

Returns same `{jobId, count, pollUrl}` shape as `/v1/pins/bulk`.

CSV format (header row required):

```csv
brandId,topic,primaryKeyword,destinationUrl,backgroundType
strguests,Airbnb check-in tips,airbnb tips,https://strguests.tools/tips,solid
excel-templates,Budget templates,excel budget,https://excel-templates.io,solid
```

---

#### `POST /v1/pins/sheet` — Bulk generate from Google Sheet

Accepts a publicly published Google Sheet CSV URL.

In Google Sheets: **File → Share → Publish to web → Comma-separated values (.csv) → Publish**.

```bash
curl -X POST http://localhost:8787/v1/pins/sheet \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sheetUrl":"https://docs.google.com/spreadsheets/d/abc123/pub?output=csv"}'
```

Returns same `{jobId, count, pollUrl}` shape. Host enforced to `docs.google.com`. HTTPS only.

---

### Jobs

#### `GET /v1/jobs/:jobId` — Poll job status

Poll until `status` is `completed` or `failed`.

```bash
curl http://localhost:8787/v1/jobs/job-abc123 \
  -H "X-API-Key: $PINFORGE_API_KEY"
```

While running:

```json
{
  "jobId": "job-abc123",
  "status": "running",
  "total": 5,
  "completed": 2,
  "failed": 0
}
```

When done:

```json
{
  "jobId": "job-abc123",
  "status": "completed",
  "total": 5,
  "completed": 5,
  "failed": 0,
  "results": [
    { "ok": true, "pin": { ... }, "paths": { ... } }
  ]
}
```

Returns `404` if jobId not found.

---

#### `GET /v1/jobs/:jobId/results.csv` — Download results as CSV

Download completed job results as a CSV file. Returns `404` if not found, `409` if still running.

```bash
curl http://localhost:8787/v1/jobs/job-abc123/results.csv \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  --output results.csv
```

CSV columns: `slug`, `brandId`, `templateId`, `pngPath`, `jsonPath`, `ok`, `error`.

---

### Catalog

#### `GET /v1/brands` — List available brands

```bash
curl http://localhost:8787/v1/brands \
  -H "X-API-Key: $PINFORGE_API_KEY"
```

```json
[
  {
    "brandId": "strguests",
    "displayName": "STR Guests",
    "domain": "strguests.tools",
    "defaults": { "templateId": "big-hook", "backgroundType": "solid" }
  },
  {
    "brandId": "excel-templates",
    "displayName": "Excel Templates",
    "domain": "excel-templates.io",
    "defaults": { "templateId": "big-hook", "backgroundType": "solid" }
  }
]
```

---

#### `GET /v1/templates` — List available templates

```bash
curl http://localhost:8787/v1/templates \
  -H "X-API-Key: $PINFORGE_API_KEY"
```

```json
[
  { "id": "big-hook", "displayName": "Big Hook", "supports": ["solid","image"], "dimensions": { "width": 1000, "height": 1500 } },
  { "id": "listicle", "displayName": "Listicle", "supports": ["solid","image"], "dimensions": { "width": 1000, "height": 1500 } },
  { "id": "before-after", "displayName": "Before / After", "supports": ["solid"], "dimensions": { "width": 1000, "height": 1500 } },
  { "id": "quote", "displayName": "Quote", "supports": ["solid","image"], "dimensions": { "width": 1000, "height": 1500 } },
  { "id": "how-to", "displayName": "How-To", "supports": ["solid","image"], "dimensions": { "width": 1000, "height": 1500 } },
  { "id": "big-stat", "displayName": "Big Stat", "supports": ["solid"], "dimensions": { "width": 1000, "height": 1500 } }
]
```

---

## Swagger / OpenAPI

Interactive API explorer available at `/docs` — no auth required.

```
http://localhost:8787/docs
```

Machine-readable spec: `GET /docs/json` or `GET /docs/yaml`.

---

## Rate Limits & Body Limits

Controlled via env vars (defaults shown):

| Limit | Env Var | Default |
|---|---|---|
| Requests per window | `RATE_LIMIT_MAX` | 100 |
| Window duration | `RATE_LIMIT_WINDOW_MS` | 60000 ms |
| JSON body | `BODY_LIMIT_JSON` | 256 KB |
| CSV upload | `BODY_LIMIT_CSV` | 5 MB |
| Max pins per bulk | `BULK_MAX` | 500 |

Rate limit responses return `429 Too Many Requests`.

---

## Production Notes

Bind to all interfaces (required for Docker/VM deployments):

```bash
PINFORGE_API_HOST=0.0.0.0 PINFORGE_API_PORT=8787 node ./dist/main.js
```

For process management:

```bash
# PM2
pm2 start ./dist/main.js --name pinforge-api

# Docker (example)
docker run -e PINFORGE_API_KEY=... -e OPENAI_API_KEY=... -p 8787:8787 pinforge-api
```

The server uses structured JSON logging via `pino`. In production, pipe to `pino-pretty` for human-readable output:

```bash
node ./dist/main.js | pino-pretty
```

---

## Development

```bash
# Watch mode (recompile on change)
pnpm -F @str/pinforge-api dev

# Run tests
pnpm -F @str/pinforge-api test

# Typecheck
pnpm -F @str/pinforge-api typecheck

# Coverage
pnpm -F @str/pinforge-api test --coverage
```

---

## Webhook callbacks (optional)

Bulk endpoints accept an optional `callbackUrl` field. When provided, PinForge POSTs a small JSON payload to that URL when the job completes (success or failure).

```bash
curl -X POST http://localhost:8787/v1/pins/bulk \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"callbackUrl":"https://my-app.example.com/pinforge-webhook","items":[...]}'
```

For `/v1/pins/csv` and `/v1/pins/sheet`, pass it as `?callback_url=...` query param.

### Webhook payload

```json
{
  "jobId": "job_xxxxx",
  "status": "done",
  "progress": {"done": 5, "total": 5, "failed": 0},
  "completedAt": "2026-05-17T12:00:00.000Z",
  "resultsUrl": "/v1/jobs/job_xxxxx"
}
```

On failure, `status: "failed"` and `fatalError: {code, message}` is included.

### Reliability

- Fire-and-forget — the job completes regardless of webhook success
- 10s timeout per callback
- One delivery attempt, no retries (idempotent receivers recommended)
- Non-2xx responses logged but don't fail the job
- Errors logged to the API server's Pino logger

---

## Known Limitations (see BACKLOG.md)

- **In-memory job store** — jobs are lost on restart. No Redis/DB persistence yet.
- **No pagination** on `/v1/brands` or `/v1/templates` — fine at current catalog size.
- **Sync timeout** is a simple `Promise.race` — if the server crashes mid-sync, the client hangs until its own timeout.
- **Webhook security** — `callbackUrl` validated as a URL only; no allowlist. An internal network SSRF is possible if the API server has access to internal services. For production, add an origin allowlist or restrict to HTTPS public origins only.

See `tools/pinforge-api/BACKLOG.md` for the full list.
