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

## Phase 2 flows (active)

| Flow | Trigger | What it does | Priority |
|---|---|---|---|
| `sitemap-freshness.json` | cron daily 08:00 | Stat each cluster site's sitemap.xml mtime | P0 if >7d |
| `broken-link-watch.json` | cron Sunday 04:00 | Cross-cluster link audit against dist/ HTML | P1 if any broken |

## Phase 3 flows (cache layer — active once nightly-refresh runs)

All Phase 3 watchers read from `ops/cache/*.json` (written by `nightly-refresh`).
The console reads the same files (zero shape when missing).

| Flow | Trigger | Reads | Priority |
|---|---|---|---|
| `nightly-refresh.json` | cron daily 03:00 | Stripe + Etsy + Gumroad + Plausible + GSC + IS → writes 4 cache files | — |
| `revenue-watch.json` | cron daily 09:00 | money.json (yesterday vs daily-burn) | P0 if -75%, else P1 |
| `refund-spike-watch.json` | cron hourly | money.json (refundSpikes array) | P0 |
| `weekly-pnl-digest.json` | cron Mon 08:00 | money.json (MTD ratio + kill candidates) | P2 |
| `traffic-anomaly-watch.json` | cron daily 08:30 | traffic.json (anomalies array) | P1 |
| `gsc-digest.json` | cron Mon 08:00 | seo.json (climbers/fallers) | P2 |
| `cwv-watch.json` | cron daily 04:00 | seo.json (worstLcp/INP/CLS thresholds) | P1 |
| `indexing-watch.json` | cron daily 05:00 | seo.json (indexingErrors + issues) | P1 |
| `funnel-dropout-watch.json` | cron Mon 08:00 | contacts.json (stage-to-stage leak %) | P1 if >95%, else P2 |
| `cache-staleness-watch.json` | cron daily 10:00 | sync-log.json mtime (self-monitoring) | P0 if ≥50h, P1 if ≥26h |

### nightly-refresh contract

The flow writes 4 cache files atomically (temp + rename) into `ops/cache/`:

- `money.json` — Stripe + Etsy + Gumroad MTD aggregates, channel splits, top SKUs, kill candidates, refund spikes
- `traffic.json` — Plausible sessions/users by site (MTD, 7d, yesterday), top sources, anomalies
- `seo.json` — GSC impressions/clicks/position (28d), top queries, striking-distance, CWV buckets, indexing issues
- `contacts.json` — Influencersoft list size, funnel stages, top signup sources, list health, sequence performance

A `sync-log.json` file is touched on success to fuel a "stale cache" indicator.

`ops/cache/*.json` is git-ignored (contains live API data).

## Phase 4 flows (active)

| Flow | Trigger | What it does | Priority |
|---|---|---|---|
| `release-shipped.json` | webhook POST `/webhook/release-shipped` | Validates SKU + version against on-disk VERSION file, emails prior buyers via IS, refreshes Etsy listings, appends `update-shipped:<sku>:<version>` tag to `ops/release-tags.ndjson`. Bound to the **Ship update** button on `/maintain/releases`. | P1 on success, 409 returned on VERSION mismatch (no side effects) |
| `delist-sku.json` | webhook POST `/webhook/delist-sku` | Finds the Etsy listing for the SKU; with `dryRun:true` returns the match without acting (404 if none). With `dryRun:false` PATCHes the listing to `state: inactive` and appends to `ops/delist-log.ndjson`. Bound to **Preview** + **Delist** buttons on `/check/kill-sku`. | P1 on success, 404 if listing not found |

## Phase 4+ flows (planned)

| Flow | Phase | Trigger | Priority |
|---|---|---|---|
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
