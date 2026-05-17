# @str/pinforge-api

REST API wrapping `@str/pinforge`. See `docs/superpowers/specs/2026-05-16-pinforge-design.md` section 9.

## Quickstart

```bash
pnpm -F @str/pinforge-api build
PINFORGE_API_KEY=secret-key pnpm -F @str/pinforge-api start
curl http://localhost:8787/healthz
```

## Google Sheet ingest

PinForge API accepts a publicly-published Google Sheet CSV URL. In Google Sheets:

1. **File → Share → Publish to web**
2. Pick **Comma-separated values (.csv)**
3. Publish, copy the URL — it'll look like `https://docs.google.com/spreadsheets/d/.../pub?output=csv`

Then POST:

```bash
curl -X POST http://localhost:8787/v1/pins/sheet \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sheetUrl":"https://docs.google.com/spreadsheets/d/abc/pub?output=csv"}'
```

Returns the same `{jobId, count, pollUrl}` shape as `/v1/pins/bulk` and `/v1/pins/csv`.

The host is enforced to `docs.google.com` — no other hosts accepted. HTTPS only.
