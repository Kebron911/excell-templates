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

## n8n credentials store

| Credential ID | Type | Used by | Notes |
|---|---|---|---|
| `telegram-empire-bot` | Telegram API | shared/telegram-router | Bot token from @BotFather |
| `n8n-internal-api` | n8n API | n8n-self-watch | Personal Access Token from n8n Settings |

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

## Rotation policy

- Telegram bot token: rotate annually or immediately on suspected compromise
- n8n PAT: rotate every 6 months
- `STR_SSH_KEY`: rotate annually (cluster-wide — coordinated with sister-site CI)
- Webhook URLs are not secrets but include in audit logs which IPs hit them
