# n8n secrets inventory

*Phase 0.5 deliverable — single source of truth for every credential the n8n
flows depend on. Cross-reference when debugging "why isn't this flow firing?"*

Update when adding a flow that needs a new credential. Real values live in
n8n credentials store + Vaultwarden — **never commit values to this file**.

## Environment variables (n8n host — `~/.n8n/.env` or systemd EnvironmentFile)

| Variable | Used by | Purpose |
|---|---|---|
| `EMPIRE_REPO_PATH` | every flow that reads/writes ops/* | Absolute path to the empire repo on the n8n host (e.g. `/srv/empire`) |
| `EMPIRE_CONSOLE_BASE_URL` | every flow that emits a deep link | Public console URL — `https://dashboard.thestrledger.com` in prod |
| `TELEGRAM_P0_CHAT` | shared/telegram-router | Channel ID for P0 page alerts |
| `TELEGRAM_P1_CHAT` | shared/telegram-router | Channel ID for P1 daily alerts |
| `TELEGRAM_P2_CHAT` | shared/telegram-router | Channel ID for P2 weekly digests |
| `N8N_INTERNAL_API` | n8n-self-watch | n8n's own REST API base (`http://localhost:5678` typically) |
| `N8N_PUBLIC_URL` | n8n-self-watch | Public n8n URL for executions deep-link |
| `UPTIME_HEARTBEAT_URL` | n8n-self-watch | External uptime URL pinged on heartbeat (UptimeRobot / healthchecks.io) |
| `MONTHLY_BURN` | nightly-refresh | Operational monthly burn in USD — feeds money.json `mtd.burn` (above-the-line ratio) |
| `ETSY_SHOP_ID` | nightly-refresh | Etsy shop ID for receipts endpoint |
| `IS_API_BASE` | nightly-refresh | Influencersoft API base URL |

## n8n credentials store

| Credential ID | Type | Used by | Notes |
|---|---|---|---|
| `telegram-empire-bot` | Telegram API | shared/telegram-router | Bot token from @BotFather |
| `n8n-internal-api` | n8n API | n8n-self-watch | Personal Access Token from n8n Settings |
| `STRIPE_SECRET` | HTTP header auth (`Authorization: Bearer sk_…`) | nightly-refresh | Stripe restricted key (read-only on charges/refunds) |
| `ETSY_API_KEY` | HTTP header auth (`x-api-key`) | nightly-refresh | Etsy API v3 keystring |
| `GUMROAD_TOKEN` | HTTP header auth (`Authorization: Bearer …`) | nightly-refresh | Gumroad access token |
| `PLAUSIBLE_TOKEN` | HTTP header auth (`Authorization: Bearer …`) | nightly-refresh | Plausible API token (Stats API scope) |
| `GSC_OAUTH` | OAuth2 (Google) | nightly-refresh | Search Console read-only scope |
| `IS_API_KEY` | HTTP header auth | nightly-refresh | Influencersoft API key |

## Webhook URLs (callable from outside n8n)

| Path | Method | Flow | Auth |
|---|---|---|---|
| `/webhook/empire-capture` | POST | capture-receiver | None (public) — CORS gates `EMPIRE_CONSOLE_BASE_URL` |

## Cluster-shared GitHub Actions secrets (for the deploy workflow, not n8n)

| Secret | Set? | Notes |
|---|---|---|
| `STR_SSH_KEY` | ✅ already set | Hostinger SSH private key — same key powers all 4 sister sites + console deploy |
| `PUBLIC_N8N_WEBHOOK_BASE` | pending | Set to `https://n8n.thestrledger.com/webhook` — inlined into the static console build |

## Setup checklist (one-time)

- [ ] Create one Telegram bot via @BotFather → save token in n8n credentials as `telegram-empire-bot`
- [ ] Create three Telegram channels (`@strledger-p0`, `@strledger-p1`, `@strledger-p2`) → add bot as admin → record channel IDs
- [ ] In n8n Settings → Variables: set the 8 env vars above
- [ ] Generate n8n Personal Access Token → save as `n8n-internal-api` credential
- [ ] Sign up for an external uptime service → set `UPTIME_HEARTBEAT_URL`
- [ ] Set GitHub repo secret `PUBLIC_N8N_WEBHOOK_BASE`

### Phase 3 cache layer (nightly-refresh)

- [ ] Stripe → create restricted key (read-only Charges + Refunds + Payment Intents) → save as `STRIPE_SECRET` credential
- [ ] Etsy → register app, generate API v3 keystring → save as `ETSY_API_KEY`; set `ETSY_SHOP_ID` env var
- [ ] Gumroad → Settings → Advanced → generate access token → save as `GUMROAD_TOKEN`
- [ ] Plausible → Account → API Keys → generate Stats-API token → save as `PLAUSIBLE_TOKEN`
- [ ] Google Cloud → create OAuth2 client for Search Console (read-only) → save as `GSC_OAUTH`
- [ ] Influencersoft → Settings → API → generate key → save as `IS_API_KEY`; set `IS_API_BASE` env var
- [ ] Set `MONTHLY_BURN` env var to current burn (drives above-the-line ratio)

## Rotation policy

- Telegram bot token: rotate annually or immediately on suspected compromise
- n8n PAT: rotate every 6 months
- `STR_SSH_KEY`: rotate annually (cluster-wide — coordinated with sister-site CI)
- Stripe restricted key: rotate every 6 months or on any laptop loss
- Plausible / Etsy / Gumroad / IS tokens: rotate annually or on suspected compromise
- GSC OAuth: refresh tokens are long-lived; re-authorize annually
- Webhook URLs are not secrets but include in audit logs which IPs hit them
