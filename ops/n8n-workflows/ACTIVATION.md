# n8n cluster workflows — activation checklist

> Two new workflows are sitting in this directory ready to import. This
> doc walks you through everything you need to do in n8n + InfluencerSoft
> to turn them on. Estimate: ~30 minutes once you have IS open + SMTP
> creds handy.

| Workflow | File | What it does |
|---|---|---|
| `STR_StrManuals_LeadMagnet_Tax` | `STR_StrManuals_LeadMagnet_Tax.json` | Handles `POST /webhook/lead-magnet-strmanuals-tax-explainer` from the strmanuals `/free/` form. Adds to IS, emails the PDF, logs to Sheets, redirects to `/free/?confirmed=1`. |
| `STR_Cluster_Lead_Router` | `STR_Cluster_Lead_Router.json` | Single endpoint at `/webhook/cluster-lead-router` for all 4 tool sites + strledger. Reads the `magnet` field, dispatches PDF + IS tags + Sheets backup. |
| `Gemini Pin Image — Pinterest 2:3` | `Tools/N8n-Builder/workflows/gemini-pin-image.json` *(separate repo)* | Handles `POST /webhook/pin-image` from `@str/pinforge`. Takes `{prompt, aspectRatio, style}`, calls Gemini, returns a 1000×1500 PNG binary. Required for PinForge's `backgroundType: "image"` mode. |

Plus a **non-n8n activation** at the end of this file for the PinForge REST API server (`@str/pinforge-api`).

---

## Prerequisites — do these once before either workflow

### 1 — Confirm `INFLUENCERSOFT_API_KEY` env var on the n8n host

The proven `STR_Stripe_InfluencerSoft_Tagger` workflow already uses `$env.INFLUENCERSOFT_API_KEY` so this is almost certainly set. Verify in n8n:

1. n8n UI → **Settings → Environment Variables** (or check the host directly at `n8ncde.cdeprosperity.com`)
2. Confirm `INFLUENCERSOFT_API_KEY` exists and is non-empty
3. If missing, set it from `Excel-Templates/.env` (line `INFLUENCERSOFT_API_KEY=...`)

Both new workflows reference `{{ $env.INFLUENCERSOFT_API_KEY }}` directly — no per-workflow credential needed.

### 2 — Create an n8n SMTP credential

The lead-router emails the PDF link via SMTP. Hostinger Business has SMTP at `smtp.hostinger.com:465` (SSL) using the `hello@thestrledger.com` mailbox.

1. n8n UI → **Credentials → Add Credential → SMTP**
2. Fill:
   - **Host:** `smtp.hostinger.com`
   - **Port:** `465`
   - **Secure:** `SSL/TLS` (port 465 implies this)
   - **User:** `hello@thestrledger.com`
   - **Password:** (from Hostinger Email panel → `hello@thestrledger.com` → password)
3. **Name:** `Hostinger SMTP — hello@thestrledger.com` (any name works, just keep consistent)
4. **Save.** Note the credential ID (used in the next step).

### 3 — Create the Google Sheets backup sheet + credential

This sheet is the safety net — every lead lands here even if IS/SMTP fail silently.

1. Go to https://sheets.new (or use any existing sheet)
2. Rename to `STR Lead Backup`. First tab name: `Leads`
3. Paste this header row in A1:`L1`:
   ```
   ts  email  magnet  source  tool  utm_source  utm_medium  utm_campaign  landing_page  unknown_magnet  pdf_hosted  notes
   ```
4. Copy the sheet ID from the URL (`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`)
5. In n8n: **Credentials → Add Credential → Google Sheets OAuth2 API**
6. Walk through the OAuth flow with the Google account that owns the sheet
7. **Save.** Note the credential ID.

---

## Workflow A — STR_StrManuals_LeadMagnet_Tax (do first)

This unblocks the strmanuals `/free/` form which is the single most urgent broken lead-capture in the cluster.

### Import + wire

1. n8n UI → **Workflows → Import from File** → pick `ops/n8n-workflows/STR_StrManuals_LeadMagnet_Tax.json`
2. Open the workflow. Click each node with a red ⚠️ badge:
   - **SMTP → deliver explainer PDF** — set the SMTP credential to the one created in prereq #2
   - **Sheets → leads backup** — set the Google Sheets credential AND replace `__SET_ME_SHEET_ID__` with your sheet ID
3. (Optional) **Validate + prep** code node — the email body is fine as-is, but you may want to soften the drip-sequence preview text.
4. Click **Save**, then toggle **Active** in the top-right.

### Test end-to-end

In a separate tab:
```bash
curl -X POST https://n8ncde.cdeprosperity.com/webhook/lead-magnet-strmanuals-tax-explainer \
  -d "email=you+test@yourdomain.com" \
  -d "magnet=str-tax-loophole-explainer" \
  -d "landing_page=strmanuals.com/free"
```

Expected (in order):
- The terminal returns HTTP 303 redirecting to `https://strmanuals.com/free/?confirmed=1`
- Your inbox receives an email titled "Your STR Tax Loophole Explainer (8 pages)" with a link to https://strmanuals.com/dl/c30ca3787771e91e0fb21716146e2cea/free/tax-loophole-explainer.pdf
- The Google Sheet `Leads` tab has a new row with your email + `magnet=str-tax-loophole-explainer`
- IS Contacts shows you as a lead tagged `magnet:str-tax-loophole-explainer`, `source:strmanuals.com`, `funnel:free-to-tax-playbook`
- Clicking the PDF link downloads a real 350 KB PDF (the explainer is already uploaded to Hostinger — that part is done)

### Un-pause the strmanuals form

Once the test above passes:

1. Edit `STRManuals/site/src/pages/free.astro` line 16:
   - Remove the `// PAUSED` block
   - Uncomment the env-driven `FORM_ACTION = N8N_BASE ? ... : ''`
2. Edit `STRManuals/site/src/components/EmailCapture.astro`:
   - Revert the Coming-Soon `<div>` back to the original `<form>` block (find the PAUSED comment for the exact swap)
3. Commit + push. Auto-deploys on the path filter.

Now the strmanuals `/free/` form lands real PDFs in real inboxes.

---

## Workflow B — STR_Cluster_Lead_Router (do second)

Single endpoint for all 4 tool sites + strledger free magnet. **None** of those magnet PDFs are hosted yet — the dispatch table flags every entry as `pdf_hosted: false`. The workflow handles this gracefully: subscribers get an honest "we're finishing the file this week, reply if you need it sooner" email + are still tagged in IS for follow-up.

You can activate this workflow without producing the PDFs first. As each PDF lands on Hostinger, flip `pdf_hosted: true` in the dispatch table and the email body auto-switches to the real link.

### Import + wire

1. n8n UI → **Workflows → Import from File** → pick `ops/n8n-workflows/STR_Cluster_Lead_Router.json`
2. Wire the **SMTP → deliver PDF link** and **Sheets → leads backup** credentials the same way as Workflow A. (Same SMTP + same Sheet are fine — the Sheet column layout matches.)
3. Save + **Activate**.

### Test

```bash
curl -X POST https://n8ncde.cdeprosperity.com/webhook/cluster-lead-router \
  -H "Content-Type: application/json" \
  -d '{"email":"you+test2@yourdomain.com","magnet":"strops-cleaner-sop","source":"strops.tools","tool":"cleaner-sop"}'
```

Expected:
- HTTP 200 with `{"ok":true,"queued_at":"...","magnet":"strops-cleaner-sop"}`
- Email titled "Your STR cleaner SOP template" with the honest manual-followup message (since `pdf_hosted=false`)
- Sheet row with `pdf_hosted=false` flag
- IS lead tagged `magnet:strops-cleaner-sop,source:strops.tools,tool:cleaner-sop`

### Wire the 4 tool sites + strledger to this endpoint

In GitHub repo Settings → Secrets and variables → Actions:

| Repo secret | Set to |
|---|---|
| `PUBLIC_ESP_WEBHOOK` (strhost/strbuyers/strguests use this name) | `https://n8ncde.cdeprosperity.com/webhook/cluster-lead-router` |
| `PUBLIC_ESP_ENDPOINT` (strops uses this name) | same value |

Then revert the Coming-Soon pauses:
- `packages/ui-funnel/src/EmailCaptureCard.astro` — restore the original `<form>` block
- `packages/email-gate/src/EmailGate.astro` — restore form
- `STRGuests-Tools/src/components/generator/PdfDownloadButton.astro` — restore `if (modal && !isGateDismissed(tool)) modal.showModal();`
- `STROps-Tools/src/pages/get-the-{cleaner-sop,maintenance-checklist,supply-par}.astro` — restore the inline `<form class="magnet-capture">` blocks

Commit + push. All 4 tool deploys auto-retrigger.

### Producing the actual PDFs (one at a time, no rush)

For each magnet:
1. Author the PDF (Affinity / Google Doc → Print to PDF / etc.)
2. SCP it into the right Hostinger path:
   ```
   scp -P 65002 -i ~/.ssh/hostinger_ed25519 \
     /local/path/to/<magnet>.pdf \
     u470667024@195.35.15.247:/home/u470667024/domains/<site>/public_html/pdfs/<magnet>.pdf
   ```
3. In n8n, edit the **Validate + dispatch** code node — find the magnet's entry in the `MAGNETS` table, flip `pdf_hosted: false` → `pdf_hosted: true`
4. Save the workflow. Done. The next subscriber gets the real link.

---

## Drip sequences in InfluencerSoft

The Cluster Lead Router applies tags but does NOT manage email sequences — that's IS's job. For each magnet you want a follow-up sequence on:

1. Open IS → **Automations** (or Sequences)
2. Create an automation: **Trigger:** "Tag applied" → `magnet:<slug>` (e.g., `magnet:strops-cleaner-sop`)
3. Add the email steps you want (Day 0 = the magnet, Day 2 = a tip, etc.)
4. Activate the automation

The router tags happen on every form submission, so any new automation listening for that tag will pick up future subscribers automatically.

---

## Workflow C — Gemini Pin Image (PinForge backend)

This workflow powers PinForge's image-mode pin generation. Without it, PinForge still works — `backgroundType: solid` and `gradient` skip n8n entirely; `image` mode falls back to Unsplash → solid color if n8n is unreachable. But you get the best results (on-brand Gemini-rendered photos sized + styled for vertical 2:3 Pinterest pins) only with this workflow active.

**Lives in a separate repo:** `Tools/N8n-Builder/workflows/gemini-pin-image.json` (NOT `Excel-Templates/ops/n8n-workflows/`). It's a sibling of the existing `gemini-blog-image-seo.json` blog workflow — same Gemini node type, but the webhook path, prompt template, output dimensions, and response format differ.

### Prereqs

- The blog workflow `gemini-blog-image-seo` is already importable + working (it's the proven pattern this is forked from). If you've never imported it, the Gemini credential is the only fresh piece you need.
- Gemini API key from Google AI Studio (`https://aistudio.google.com/apikey`). Free tier covers Pinterest pin volume easily.

### Import + wire

1. n8n UI → **Workflows → Import from File** → pick `gemini-pin-image.json` from `Tools/N8n-Builder/workflows/` (you'll need to copy or upload the file — it lives in a different repo than this one).
2. Open the workflow. The single node that needs credential wiring:
   - **Gemini → generate image** (or whatever it's named in the imported workflow). Set the credential to your Google AI Studio API key. If you already have a `Google Generative AI` credential in n8n from the blog workflow, **reuse it** — no need to create a duplicate.
3. The webhook expects an `X-API-Key` header to match `N8N_PIN_KEY`. In the **Webhook (Pin Image Request)** node settings, set the **Header Auth** credential (or environment-variable lookup, matching the blog workflow's pattern) to a 32+ char secret. Save the same secret to `Excel-Templates/.env` as `N8N_PIN_KEY=<value>` (next section uses this).
4. Click **Save**, toggle **Active** in the top-right.
5. Note the production webhook URL — should be something like `https://n8ncde.cdeprosperity.com/webhook/pin-image`. Save it as `N8N_BASE_URL=<base>` (without `/webhook/pin-image`) in `Excel-Templates/.env`.

### Test end-to-end

```bash
curl -X POST "${N8N_BASE_URL}/webhook/pin-image" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${N8N_PIN_KEY}" \
  --data '{
    "prompt": "Vertical 2:3 composition (portrait orientation, 1000x1500 pixels). Top-third focal point. Leave bottom 60% relatively uncluttered for text overlay. Subject: coastal vacation rental at sunset. Style: photographic, natural lighting, warm tones.",
    "aspectRatio": "2:3",
    "style": "photographic"
  }' \
  --output /tmp/pin-test.png

file /tmp/pin-test.png
# Expected: PNG image data, 1000 x 1500 (or close — Gemini sizes vary slightly,
# the PinForge compositor resizes downstream)
```

If `file` reports anything other than `PNG image data`, check the workflow's Gemini node output — it likely returned an error JSON instead of the binary. Common causes:
- Gemini credential not set / quota exceeded → check Google AI Studio dashboard
- The Respond node not configured for binary output (should be `respondWith: "binary"`, `responseDataSource: "data"`, header `Content-Type: image/png`)

### Wire env vars into PinForge

In `Excel-Templates/.env` (gitignored):

```bash
N8N_BASE_URL=https://n8ncde.cdeprosperity.com
N8N_PIN_KEY=<the same secret you set in the workflow header auth>
```

Then run the PinForge live smoke test against the real workflow:

```bash
LIVE=1 pnpm -F @str/pinforge test live/smoke
```

Expected: 1 test passes, console prints the path of a generated PNG. Open it — confirm it looks like a real Pinterest pin with the strguests brand colors + a Gemini-generated background. If the pin shows a solid teal background instead of a photo, the n8n call failed and PinForge fell back to its built-in solid-color path. Check the n8n execution log.

### Generate one real pin via CLI (final acceptance)

```bash
pnpm pinforge:cli generate \
  --brand strguests \
  --topic "7 house rules for short-term rentals" \
  --keyword "airbnb house rules" \
  --url https://strguests.tools/house-rules-generator \
  --bg image \
  --treatment duotone
```

Expected: prints `✓ packages/pinforge/dist/pins/YYYY-MM-DD/strguests/7-house-rules-...-XXXX.png` plus the JSON sidecar path. Open both:
- PNG: looks like a real Pinterest pin with photo background + duotone overlay + brand colors + headline + footer
- JSON: contains `backgroundSource: "n8n"` (NOT `"solid"` or `"unsplash"` — those are fallbacks)

---

## PinForge REST API server activation (`@str/pinforge-api`)

This is **not an n8n workflow** — it's a Fastify HTTP server that wraps `@str/pinforge`. Activating it lets you POST pin-generation requests via HTTP instead of running the CLI locally. Same engine, different transport.

### Prereqs

- `@str/pinforge` already shipped (Phases A + A.5) — verified by `pnpm -F @str/pinforge test` showing 107 passing.
- `Excel-Templates/.env` has `OPENAI_API_KEY=<real key>` (required by the engine).
- Optional: `N8N_BASE_URL` + `N8N_PIN_KEY` from Workflow C above (only required if you want `backgroundType: "image"` requests to succeed without fallback).
- Optional: `UNSPLASH_ACCESS_KEY` if you want the second-tier fallback (n8n fails → Unsplash). Without it, image-mode falls straight from n8n to solid color.

### Set API server env vars

In `Excel-Templates/.env`:

```bash
# Required
PINFORGE_API_KEY=<generate a 32+ char secret, e.g., `openssl rand -hex 32`>

# Optional overrides (defaults shown)
PINFORGE_API_PORT=8787
PINFORGE_API_HOST=127.0.0.1
PINFORGE_API_RATE_LIMIT_MAX=60          # per X-API-Key per minute
PINFORGE_API_RATE_LIMIT_WINDOW_MS=60000
PINFORGE_API_BODY_LIMIT_JSON=262144     # 256KB
PINFORGE_API_BODY_LIMIT_CSV=5242880     # 5MB
PINFORGE_API_BULK_MAX=500               # max items per bulk request

# Browser UI? Add allowed origins (comma-sep). Leave blank to disable CORS entirely.
PINFORGE_API_CORS_ORIGINS=
PINFORGE_API_CORS_CREDENTIALS=false
```

**Generate the API key once:**
```bash
openssl rand -hex 32
# copy the output into PINFORGE_API_KEY=...
```

Keep this key secret — anyone with it can submit pin-generation jobs and trigger webhook callbacks to public URLs.

### Build + start

```bash
pnpm -F @str/pinforge-api build
pnpm pinforge-api:start
```

Expected: log line `pinforge-api listening` with host + port. Server stays in the foreground; Ctrl-C to stop.

### Smoke test (in a separate terminal)

```bash
# 1. liveness (no auth required)
curl -s http://localhost:8787/healthz
# Expected: {"ok":true,"version":"0.1.0"}

# 2. catalog (auth required)
curl -s -H "X-API-Key: $PINFORGE_API_KEY" http://localhost:8787/v1/brands | head -c 200
# Expected: JSON array with strguests + excel-templates

curl -s -H "X-API-Key: $PINFORGE_API_KEY" http://localhost:8787/v1/templates | head -c 200
# Expected: JSON array with 6 templates (big-hook, listicle, before-after, quote, how-to, big-stat)

# 3. generate a real pin (sync — blocks up to 90s)
curl -s -X POST "http://localhost:8787/v1/pins?sync=1" \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "strguests",
    "topic": "7 house rules for short-term rentals",
    "primaryKeyword": "airbnb house rules",
    "destinationUrl": "https://strguests.tools/house-rules-generator",
    "backgroundType": "solid"
  }'
# Expected: {"pin":{...full PinMetadata...},"paths":{"png":"...","json":"..."}}
# The PNG path is on the server's local disk. Open it to verify the pin renders.

# 4. bulk (async — returns 202 immediately, poll for completion)
curl -s -X POST http://localhost:8787/v1/pins/bulk \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"brandId":"strguests","topic":"welcome book","primaryKeyword":"airbnb welcome book","destinationUrl":"https://strguests.tools/welcome-book","backgroundType":"solid"},
      {"brandId":"excel-templates","topic":"monthly budget","primaryKeyword":"excel budget template","destinationUrl":"https://excel-templates.com/budget","backgroundType":"gradient"}
    ]
  }'
# Expected: {"jobId":"job_xxxxx","count":2,"pollUrl":"/v1/jobs/job_xxxxx"}

# Poll the job:
curl -s -H "X-API-Key: $PINFORGE_API_KEY" "http://localhost:8787/v1/jobs/<jobId>"
# Wait a few seconds and re-run — status flips to "done" with results.

# 5. interactive OpenAPI docs (no auth required for /docs)
open http://localhost:8787/docs
```

### Optional: open API to your local network or production

By default `PINFORGE_API_HOST=127.0.0.1` (loopback only — local CLI use). To expose to other machines on your LAN:

```bash
PINFORGE_API_HOST=0.0.0.0 pnpm pinforge-api:start
```

**Production deployment notes:**
- Always behind HTTPS (use a reverse proxy — Caddy or nginx — and terminate TLS there).
- Rotate `PINFORGE_API_KEY` periodically (kill the server, regenerate, restart — there's no live rotation).
- Run with a process supervisor (`pm2`, `systemd`, Docker) so it restarts on crash.
- Per-API-key rate limit defends against runaway clients; per-IP fallback defends against missing-key spam.
- The in-memory job registry resets on restart — pending async jobs LOST. Don't restart mid-batch.
- Webhook callbacks reject private/loopback/link-local URLs (SSRF guard). Verify by attempting a `POST /v1/pins/bulk` with `callbackUrl: "http://169.254.169.254/"` — expect `400`.

### Use webhook callbacks instead of polling

For bulk jobs, pass `callbackUrl` to get notified when the job finishes:

```bash
curl -X POST http://localhost:8787/v1/pins/bulk \
  -H "X-API-Key: $PINFORGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "callbackUrl": "https://my-app.example.com/pinforge-webhook",
    "items": [...]
  }'
# Returns 202 immediately. Your webhook gets POSTed when the job completes:
# { "jobId": "job_xxx", "status": "done", "progress": {...}, "completedAt": "...", "resultsUrl": "/v1/jobs/job_xxx" }
```

Webhooks are fire-and-forget (10s timeout, no retries). Make your webhook receiver idempotent.

---

## Rollback

If the cluster router misbehaves:

1. n8n UI → toggle the workflow **inactive**. Form submissions still hit the webhook URL but n8n returns a default error response. The 4 tool sites have a CORS-aware form submit handler that catches the error inline.
2. Revert `PUBLIC_ESP_WEBHOOK` / `PUBLIC_ESP_ENDPOINT` secrets to empty, redeploy. Forms render but no requests are sent.
3. Re-apply the Coming-Soon edits documented in BACKLOG.md restore-point index. Deploy.

If the `gemini-pin-image` workflow misbehaves:

1. n8n UI → toggle **gemini-pin-image** inactive. PinForge image-mode requests transparently fall back to Unsplash → solid color. No code change needed; the `metadata.backgroundSource` field in each `pin.json` will read `"unsplash"` or `"solid"` instead of `"n8n"` so you can audit what happened.
2. Or remove `N8N_BASE_URL` from `Excel-Templates/.env` — PinForge skips the n8n call entirely on next request.

If the PinForge API server misbehaves:

1. Stop the process (Ctrl-C or `pm2 stop pinforge-api`). The CLI (`pnpm pinforge:cli generate ...`) still works against the engine directly — no service required.
2. To revoke API access without stopping: rotate `PINFORGE_API_KEY` to a new value, restart. All existing clients are 401'd.
3. In-memory jobs are LOST on stop — any client polling `/v1/jobs/:id` after restart gets 404.

---

## Status today (2026-05-17)

**Lead capture (Workflows A + B):**
- ✅ Both workflow JSONs use the correct IS API contract (`POST /api/AddUpdateLead`, form-urlencoded, `rpsKey` body param). Matches the proven `STR_Stripe_InfluencerSoft_Tagger` pattern.
- ✅ The tax-explainer PDF is live at `https://strmanuals.com/dl/c30ca3787771e91e0fb21716146e2cea/free/tax-loophole-explainer.pdf` (uploaded out of band — `private/` is gitignored so CI never copies it).
- ⏳ The 5 paid manual PDFs are also uploaded to Hostinger under the same hash. Stripe order fulfillment via the existing `STR_Stripe_InfluencerSoft_Tagger` workflow now has working URLs to send.
- ⏳ All 8 tool-site magnets still need their PDFs authored + uploaded. The router handles missing PDFs gracefully — activating it does NOT require all magnets to exist first.

**PinForge (Workflow C + API server):**
- ✅ `@str/pinforge` engine shipped (Phases A + A.5 — 107 tests, CLI works, scrape mode works). On main as of 2026-05-17.
- ✅ `@str/pinforge-api` REST server shipped (Phase B + follow-ups — 84 tests, 11 endpoints, OpenAPI at /docs, CORS + webhooks). On main as of 2026-05-17.
- ✅ `gemini-pin-image.json` workflow file written at `Tools/N8n-Builder/workflows/`. Local commits exist; not yet pushed to any remote (n8n-builder local repo has no remote — user decision pending per BACKLOG section).
- ⏳ Workflow C not yet imported into n8n (this is the one remaining manual step before image-mode pins work). Without it, PinForge silently falls back to Unsplash → solid color for `backgroundType: "image"` requests.
- ⏳ PinForge API server not yet running anywhere (only invoked via tests + `pnpm pinforge:cli`). Start with `pnpm pinforge-api:start` once `PINFORGE_API_KEY` is in `.env`.
