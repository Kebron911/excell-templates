# W08 — Lead Magnet (strmanuals.com / tax explainer)

**Priority:** P1
**Companion:** [`W08-lead-magnet-delivery`](W08-lead-magnet-delivery.md) (cluster-generic; this is strmanuals-specific)

## Summary

Receives email submissions from the `/free` form, validates the email,
builds the hashed download URL for the free explainer PDF, tags the
contact in IS, triggers the `strmanuals-free-magnet` sequence, then
303-redirects back to `/free/?confirmed=1`.

## Trigger

POST `https://n8ncde.cdeprosperity.com/webhook/lead-magnet-strmanuals-tax-explainer`

This URL is inlined into `STRManuals/site/src/pages/free.astro` at build
time from `PUBLIC_N8N_WEBHOOK_BASE` (mirrors root `.env`'s `N8N_BASE_URL`).

## Payload

```
POST application/x-www-form-urlencoded
email=...
landing_page=strmanuals.com/free
magnet=str-tax-loophole-explainer
```

## Required n8n env vars

| Var | Source |
|---|---|
| `INFLUENCERSOFT_API_KEY` | repo root `.env` |
| `STRMANUALS_DOWNLOAD_HASH` | `STRManuals/site/.env` — must match deployed `dist/dl/<hash>/` |
| `STRMANUALS_BASE_URL` | default `https://strmanuals.com` |

## Open hooks

1. **IS method names** — same as W01b. Use `verify-tag-and-sequence-methods.sh`.
2. **Sequence** — `strmanuals-free-magnet` (source: `copy/email-sequences/strmanuals-free-magnet.md`).
3. **Tag dictionary** — `magnet:str-tax-loophole-explainer`, `source:strmanuals`, `audience:strmanuals-list`.
4. **CORS** — default form encoding (`application/x-www-form-urlencoded`) sidesteps preflight. No CORS header needed unless you switch to JSON fetch.

## Import

n8n → Workflows → Import from File → select
`infrastructure/n8n/workflows/W08-lead-magnet-strmanuals.json` → **Active**.

## Smoke

```
curl -i -X POST \
  -d "email=test+w08@example.com" \
  -d "magnet=str-tax-loophole-explainer" \
  -d "landing_page=strmanuals.com/free" \
  https://n8ncde.cdeprosperity.com/webhook/lead-magnet-strmanuals-tax-explainer
```

Expect `HTTP/1.1 303 See Other` with `Location: https://strmanuals.com/free/?confirmed=1`.
Bad email returns `HTTP/1.1 400` `{ "error": "invalid_email" }`.
