# n8n flows — Empire Console nervous system

Versioned exports of the flows that pair with `tools/empire-console/`.

n8n is the **always-on layer**. The console is a UI surface; n8n is what runs
when the laptop is closed. Every flow either:

1. **Watches** something on cron and pushes an alert to Telegram, or
2. **Acts** on a webhook (write into Stripe / Etsy / IS / Airtable / Gumroad), or
3. Both.

Every flow ends in the **shared Telegram router** (`shared/telegram-router.json`),
which:
- routes by priority (`P0` → page channel, `P1` → daily channel, `P2` → weekly digest)
- appends a record to `ops/alerts.ndjson` (the console's AlertFeed reads this)
- includes a deep link back into the console

## One-time setup

1. **Create one Telegram bot** via [@BotFather](https://t.me/BotFather). Save the token in n8n credentials as `telegram-empire-bot`.
2. **Create three channels:**
   - `@strledger-p0` — sound on, push immediately
   - `@strledger-p1` — silent, daily digest 08:00
   - `@strledger-p2` — silent, weekly Mon 08:00 only
   - Add the bot to each as admin.
3. **Set n8n env vars** (Settings → Variables):
   - `EMPIRE_CONSOLE_BASE_URL` = `http://localhost:4327` (or `https://console.thestrledger.com` in Phase 5)
   - `EMPIRE_REPO_PATH` = absolute path to the repo on the n8n host (only for flows that write `ops/alerts.ndjson` directly — alternative is webhook-back to the console's `/api/alerts`).
   - `TELEGRAM_P0_CHAT` / `TELEGRAM_P1_CHAT` / `TELEGRAM_P2_CHAT` — channel IDs.

## Importing

Each flow is a stand-alone JSON export. Import via n8n UI:
**Workflows → Import from File → pick `<flow>.json` → activate.**

Or via n8n CLI on the VPS:
```bash
n8n import:workflow --input=infrastructure/n8n/flows/<flow>.json
```

After import, edit the credential reference in each "Telegram" / "Execute Command" node to point at your local n8n credentials store. **Don't commit credentials.**

## Phase 1 flows (active)

| Flow | Trigger | What it does | Priority |
|---|---|---|---|
| `shared/telegram-router.json` | sub-workflow | Routes alerts to the right channel + appends to alerts.ndjson | — |
| `vendor-renewal-watch.json` | cron daily 09:00 | Reads `ops/vendor-inventory.yaml`, finds renewals ≤7d | P1 |
| `runbook-staleness.json` | cron weekly Mon 08:00 | Walks `**/runbooks/*.md` frontmatter | P1 |
| `cluster-smoke-fs.json` | cron every 15min | Checks `dist/` mtime on each sister site | P0 if >72h |
| `cert-watch.json` | cron daily 06:00 | openssl probe of each `ssl_check_url` in infrastructure.yaml | P0 ≤3d, P1 ≤14d |
| `domain-watch.json` | cron Monday 06:00 | Registrar `expires` from infrastructure.yaml | P0 ≤7d, P1 ≤60d |
| `due-soon-watch.json` | cron daily 07:00 | Calendar items overdue or due ≤7d | P0 if overdue, P1 ≤7d |
| `n8n-self-watch.json` | cron every 30min | n8n executions API for failed flows · pings external uptime | P0 if >5 fails |
| `capture-receiver.json` | webhook POST | Phase 4 — receives Inbox/voice/decisions/time-log/near-miss/console-action captures, appends to NDJSON, optionally git-pushes | n/a (CRUD) |

## Phase 2+ flows (planned)

| Flow | Phase | Trigger | Priority |
|---|---|---|---|
| `cluster-smoke.json` (HTTP variant) | 2 | cron 15min | P0 on flap |
| `manifest-watch.json` | 2 | webhook (push to main) | P0 on red |
| `nightly-refresh.json` | 3 | cron 02:00 | P1 morning digest |
| `kill-sku-watch.json` | 3 | cron weekly Mon 08:30 | P2 |
| `release-shipped.json` | 4 | webhook (VERSION bump) | P1 |
| `backup-restore-test.json` | 4 | cron monthly 1st | P0 on fail |
| `gdpr-intake.json` | 4 | webhook (privacy@ form) | P1 |

## How a flow writes the alert log

Two choices:

**Option A — direct file append (n8n on same host as repo):**

```js
// "Execute Command" node
echo '{"id":"<uuid>","priority":"P1","source":"vendor-renewal-watch","message":"Hostinger renews in 5d","ts":"<iso>"}' >> $EMPIRE_REPO_PATH/ops/alerts.ndjson
```

**Option B — webhook into the console (recommended once the console deploys):**

```http
POST {{ $env.EMPIRE_CONSOLE_BASE_URL }}/api/alerts
Content-Type: application/json

{"priority":"P1","source":"vendor-renewal-watch","message":"Hostinger renews in 5d"}
```

The `telegram-router` sub-workflow does both: write to log **and** send to Telegram.
