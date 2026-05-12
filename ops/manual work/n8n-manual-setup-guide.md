# n8n Manual Setup Guide

> **Manual step — n8n Settings → Variables, Credentials Store, and Workflow Import UI are all browser-only.** Once env vars + credentials exist and flows are imported, every webhook trigger + cron is automatic. This guide covers the one-time bootstrap in the n8n UI.
>
> **Last reviewed:** 2026-05-11
>
> **Instance state:** ✅ self-hosted at https://n8ncde.cdeprosperity.com — `N8N_API_KEY` set (207 chars JWT) + `N8N_BASE_URL` in repo root `.env`. Auth header = `X-N8N-API-KEY` (n8n's convention, not Bearer).
>
> **Manual pending:** Telegram bot + 3 channel IDs → env vars + credential, 8 core env vars, 7 API credentials, n8n Personal Access Token, 19 workflow JSON imports.

---

## Prerequisites (must be done before starting)

Block on these — if any is missing, you'll have to back-fill in the middle of n8n setup which is annoying.

- [ ] **Hostinger** subdomain `dashboard.thestrledger.com` live (`EMPIRE_CONSOLE_BASE_URL`)
- [ ] **Telegram** bot token + P0/P1/P2 channel IDs in Vaultwarden — see [telegram-manual-setup-guide.md](telegram-manual-setup-guide.md)
- [ ] **Stripe** restricted keys `n8n-nightly-refresh` + `n8n-stripe-to-is` in Vaultwarden — see [stripe-manual-setup-guide.md](stripe-manual-setup-guide.md)
- [ ] **Etsy** keystring + shop ID in Vaultwarden — see [etsy-manual-setup-guide.md](etsy-manual-setup-guide.md)
- [ ] **Gumroad** access token in Vaultwarden — see [gumroad-manual-setup-guide.md](gumroad-manual-setup-guide.md)
- [ ] **GSC** OAuth client ID + secret in Vaultwarden — see [google-workspace-manual-setup-guide.md](google-workspace-manual-setup-guide.md) Part 3
- [ ] **Plausible** Stats API token in Vaultwarden — see [plausible-manual-setup-guide.md](plausible-manual-setup-guide.md)
- [ ] **InfluencerSoft** API key already in `./.env` as `INFLUENCERSOFT_API_KEY` (✅ done 2026-05-11)
- [ ] **UptimeRobot or healthchecks.io** heartbeat URL — create one free account at https://healthchecks.io, make a new check named `n8n-empire-heartbeat`, save the ping URL

→ **Tell Claude:** *"n8n prereqs all green."*

---

## Part 1 — Generate the n8n Personal Access Token (5 min)

The `n8n-self-watch` flow reads n8n's own executions API to spot stuck workflows. That requires a PAT.

1. Sign in at https://n8ncde.cdeprosperity.com.
2. **Top-right avatar** → **Settings** → **Personal Access Tokens**.
3. **Create new token.**
4. Label: `n8n-self-watch`.
5. Scope: read + execute (full — this is an internal token, not exposed).
6. Click **Create**.
7. Copy the token (shown once). Save to Vaultwarden under `n8n Personal Access Token — self-watch`.

→ **Tell Claude:** *"n8n PAT generated."*

---

## Part 2 — Set environment variables (10 min)

n8n Settings → Variables = process-level env vars accessible from any workflow as `{{ $env.VAR }}`.

### 2.1 Core env vars (8 vars)

Navigate to **Settings** → **Variables** → **Create variable** (one at a time):

| Variable | Value |
|---|---|
| `EMPIRE_REPO_PATH` | `/srv/empire` (or the absolute path where you've cloned the repo on the n8n VPS) |
| `EMPIRE_CONSOLE_BASE_URL` | `https://dashboard.thestrledger.com` |
| `TELEGRAM_P0_CHAT` | `-100<P0 channel numeric ID>` (from telegram guide Part 2.3) |
| `TELEGRAM_P1_CHAT` | `-100<P1 channel numeric ID>` |
| `TELEGRAM_P2_CHAT` | `-100<P2 channel numeric ID>` |
| `N8N_INTERNAL_API` | `http://localhost:5678` (n8n calling its own REST API; localhost works when n8n + the flow run on the same VPS) |
| `N8N_PUBLIC_URL` | `https://n8ncde.cdeprosperity.com` |
| `UPTIME_HEARTBEAT_URL` | the healthchecks.io ping URL from prereqs |

### 2.2 Phase 3 cache env vars (3 vars)

| Variable | Value |
|---|---|
| `MONTHLY_BURN` | your current operational monthly burn in USD (e.g. `850`) — drives the above-the-line ratio on the dashboard |
| `ETSY_SHOP_ID` | the numeric shop ID from Etsy setup (Part 3.2 in etsy guide) |
| `IS_API_BASE` | `https://kebron.influencersoft.com/api` |

→ **Tell Claude:** *"n8n env vars set: 11 total."*

---

## Part 3 — Create credentials (15 min)

Settings → **Credentials** → **+ Add Credential**. Add each below.

### 3.1 `telegram-empire-bot` (Telegram API)

1. Type: **Telegram API**.
2. Name: `telegram-empire-bot`.
3. Access Token: paste the bot token from telegram guide Part 1.
4. **Save** → test should succeed.

### 3.2 `n8n-internal-api` (n8n API)

1. Type: **n8n API**.
2. Name: `n8n-internal-api`.
3. API Key: PAT from Part 1.
4. Base URL: `http://localhost:5678` (matches `N8N_INTERNAL_API` env var).
5. **Save.**

### 3.3 `STRIPE_SECRET` (HTTP Header Auth)

1. Type: **Header Auth**.
2. Name: `STRIPE_SECRET`.
3. Name (header): `Authorization`.
4. Value: `Bearer <rk_live_... from Stripe Part 2.1 nightly-refresh restricted key>`.
5. **Save.**

### 3.4 `ETSY_API_KEY` (HTTP Header Auth)

1. Type: **Header Auth**.
2. Name: `ETSY_API_KEY`.
3. Name (header): `x-api-key`.
4. Value: paste the **keystring** from Etsy guide Part 3.2 (NOT the shared secret).
5. **Save.**

> The OAuth refresh-token flow runs separately. Claude will run `scripts/etsy-oauth-bootstrap.mjs` once after this — that creates a second credential `ETSY_OAUTH` of type OAuth2 API. Don't worry about it during this manual pass.

### 3.5 `GUMROAD_TOKEN` (HTTP Header Auth)

1. Type: **Header Auth**.
2. Name: `GUMROAD_TOKEN`.
3. Name (header): `Authorization`.
4. Value: `Bearer <access token from Gumroad guide Part 2.2>`.
5. **Save.**

### 3.6 `PLAUSIBLE_TOKEN` (HTTP Header Auth)

1. Type: **Header Auth**.
2. Name: `PLAUSIBLE_TOKEN`.
3. Name (header): `Authorization`.
4. Value: `Bearer <Stats API token from Plausible guide>`.
5. **Save.**

### 3.7 `GSC_OAUTH` (Google OAuth2 API)

1. Type: **Google OAuth2 API** (NOT generic OAuth2 — n8n has a Google-specific node).
2. Name: `GSC_OAUTH`.
3. Client ID: from Google Cloud Console (workspace guide Part 3.2).
4. Client Secret: from same.
5. Scope: `https://www.googleapis.com/auth/webmasters.readonly`.
6. Click **Sign in with Google** — opens browser tab, sign in with `hello@thestrledger.com`, click **Allow**.
7. Refresh token gets stored in the n8n credential automatically.
8. **Save.**

### 3.8 `IS_API_KEY` (HTTP Header Auth)

1. Type: **Header Auth**.
2. Name: `IS_API_KEY`.
3. Name (header): `Authorization` (InfluencerSoft uses Bearer; per `infrastructure/influencersoft/verify-tag-and-sequence-methods.sh` the live probe on 2026-05-11 used this pattern).
4. Value: `Bearer <INFLUENCERSOFT_API_KEY from ./.env — already set>`.
5. **Save.**

> **If you don't already know the IS API key**, read it from `./.env` at the repo root — it's the `INFLUENCERSOFT_API_KEY=` line. Already confirmed `set (32 chars) — live probe confirmed` per `CREDENTIALS.md` 2026-05-11.

→ **Tell Claude:** *"n8n credentials wired: 8 total."*

---

## Part 4 — Import workflows (30 min)

19 JSON exports live in `ops/n8n-workflows/` + the wider repo. Import order matters because flows reference each other by ID.

### 4.1 Import the shared router first

1. n8n top → **Workflows** → **Import from File**.
2. Pick `shared/telegram-router.json` (path: `ops/n8n-workflows/shared/telegram-router.json` if present; otherwise check `infrastructure/n8n/`).
3. After import, **note the workflow ID** (visible in URL `/.../workflow/<id>`). You'll need this when wiring downstream flows.
4. **Activate** the workflow.

> If `shared/telegram-router.json` doesn't exist in the repo yet, **tell Claude** — Claude needs to generate it before continuing. The flow file should: (a) accept `{ priority: "p0"|"p1"|"p2", text: string }` via webhook, (b) route to the matching `TELEGRAM_<P>_CHAT` env var, (c) post via `telegram-empire-bot` credential.

### 4.2 Import the 8 Phase 1 cron flows + capture-receiver

Import each, then in each downstream flow find the `→ telegram-router` node and replace `REPLACE_WITH_TELEGRAM_ROUTER_ID` with the actual ID from 4.1.

Flows in this batch:
- `vendor-renewal-watch`
- `runbook-staleness`
- `cluster-smoke-fs`
- `cert-watch`
- `domain-watch`
- `due-soon-watch`
- `n8n-self-watch`
- `capture-receiver`

Activate each after import.

### 4.3 Import the 2 Phase 2 audit flows

- `sitemap-freshness`
- `broken-link-watch`

### 4.4 Import the 10 Phase 3 cache flows

These need the Stripe / Etsy / Gumroad / Plausible / GSC / IS credentials from Part 3 already set.

- `nightly-refresh` (the orchestrator)
- `revenue-watch`
- `refund-spike-watch`
- `weekly-pnl-digest`
- `traffic-anomaly-watch`
- `gsc-digest`
- `cwv-watch`
- `indexing-watch`
- `funnel-dropout-watch`
- `cache-staleness-watch`

### 4.5 Import the 4 Phase 4 webhook flows + backup test

- `release-shipped`
- `delist-sku`
- `gdpr-intake`
- `backup-restore-test`

After these are active, the **Ship update / Preview / Delist buttons on the empire-console dashboard start working** (assuming `PUBLIC_N8N_WEBHOOK_BASE` is set in GitHub Actions — see Hostinger Part 5).

### 4.6 Import the Stripe-to-IS bridge

Already in repo at `ops/n8n-workflows/stripe-to-is.json`. Import this last — it depends on Stripe webhook events + IS API credential.

→ **Tell Claude:** *"n8n workflows imported: 19 flows active."*

---

## Part 5 — Smoke-test each webhook flow once (5 min)

Don't trust automation you haven't pinged.

1. From your terminal:
   ```bash
   curl -X POST "https://n8ncde.cdeprosperity.com/webhook/empire-capture" \
     -H "Content-Type: application/json" \
     -d '{"source":"manual-smoke","note":"setup verification"}'
   ```
   Expected: HTTP 200 + a Telegram P2 message appears in `@strledger-p2`.

2. Trigger one cron flow manually: n8n UI → Workflows → `nightly-refresh` → **Execute workflow** button.
   - Expected: completes within 30s. Check `ops/cache/money.json` afterward — should have a fresh timestamp.
   - If errors: open the failed node → 95% of the time it's a missing env var or a credential typo. Re-check Part 2/3.

→ **Tell Claude:** *"n8n smoke tests passed."*

---

## Trigger-tag / env-var map (full circular dependency map)

| Output of this guide | Used by |
|---|---|
| 11 env vars set | Every workflow reads via `{{ $env.VAR }}` |
| 8 credentials set | Every API call uses one |
| 19 flows imported + active | Empire console buttons + cron alerts + Stripe→IS bridge fire |
| `n8n-self-watch` active | Tells you when n8n itself is failing — last line of defense |
| `capture-receiver` active | The `/empire-capture` endpoint that everything else POSTs to |

---

## Estimate

- Generate PAT: 5 min
- Set env vars: 10 min
- Create 8 credentials: 15 min
- Import 19 flows + wire router IDs: 30 min
- Smoke tests: 5 min
- **Total: ~65 min focused work**

---

## n8n signal — final

→ **Tell Claude:** *"n8n live."* This is the master signal phrase that unblocks the dashboard PR + every Phase 5 monitoring expectation.

---

## Common gotchas

- **`X-N8N-API-KEY` not `Authorization: Bearer`.** n8n breaks the bearer convention. Stripe, Gumroad, Plausible all use `Bearer ...` in `Authorization`. n8n itself uses `X-N8N-API-KEY` — only matters for the `n8n-internal-api` credential.
- **InfluencerSoft Bearer was confirmed 2026-05-11.** Per the live probe (`infrastructure/influencersoft/verify-tag-and-sequence-methods.sh`), `GetAllGroups` + `GetGoods` both returned 200 with `Authorization: Bearer ${INFLUENCERSOFT_API_KEY}`. If a flow gets 401 from IS, verify the header is exactly `Authorization: Bearer <key>` (not just `<key>`).
- **`-100` prefix on channel IDs.** Strip-by-accident is the #1 cause of P0 alerts going silent. Channel IDs always start with `-100` in Telegram's bot-API world.
- **Workflow IDs are per-instance.** When importing downstream flows, the `REPLACE_WITH_TELEGRAM_ROUTER_ID` placeholder must be edited to YOUR router ID — not the one in the JSON template's defaults.
- **OAuth2 redirect URI mismatch.** If you redeploy n8n on a new domain, the OAuth redirect URIs in Google Cloud + Etsy Developer Console + (any other OAuth provider) must update. Otherwise OAuth re-consent silently fails.
- **Don't import all 19 at once and click "Activate All".** Activate sequentially — shared/telegram-router → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Stripe-to-IS. If a flow fails activation, you can pinpoint which one and why before the cascade buries it.
- **Daily quota for Telegram bots:** 30 messages/sec to channels. P0 + P1 + P2 traffic combined should never approach this — n8n's router is the choke point. If it ever does, you have an alert storm bug, not a quota problem.
