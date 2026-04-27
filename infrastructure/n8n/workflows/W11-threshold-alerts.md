# W11 — Threshold Alerts

**Priority:** P2

**Family:** D — Reporting & analytics

**Summary:** Triggered by Airtable automation when a row is added to the Metrics table. Routes by metric name, fires a Slack alert to `#str-platform-alerts`, and logs an Alert row to the Errors table for any threshold breach.

---

## Trigger

HTTP POST webhook: `https://n8n.thestrledger.com/webhook/metric-threshold`

Configured in **Airtable Metrics table → Automations → "When record created" → Run script** that posts the new row's fields to the n8n webhook URL.

Expected payload shape (from Airtable scripting `fetch`):

```
{
  "record_id": "rec...",
  "fields": {
    "Date": "2026-04-26",
    "Metric name": "refund_rate_rolling_30",
    "Value": 0.103,
    "Notes": ""
  }
}
```

The Code node also accepts a flat `{ metric_name, value, date }` shape for manual testing.

## Node-by-node configuration

### Node 1 — Webhook (POST)

- **Path:** `/webhook/metric-threshold`
- **Method:** POST
- **Response mode:** `onReceived` (200 immediately)

### Node 2 — Function: Extract Metric

```js
const input = $input.first().json;
const body = input.body || input;
const fields = body.fields || body.record?.fields || body;

const metric_name = fields['Metric name'] || body.metric_name || '';
const valueRaw = fields['Value'] !== undefined ? fields['Value'] : body.value;
const value = typeof valueRaw === 'number' ? valueRaw : parseFloat(valueRaw);
const date = fields['Date'] || body.date || new Date().toISOString().slice(0, 10);

if (!metric_name) throw new Error('Missing metric_name in webhook payload');
if (Number.isNaN(value)) throw new Error('Invalid value: ' + valueRaw);

let route_key = metric_name;
if (metric_name.startsWith('cac_by_channel_')) route_key = 'cac_by_channel';

return [{ json: {
  metric_name,
  route_key,
  value,
  date,
  channel: metric_name.startsWith('cac_by_channel_') ? metric_name.slice('cac_by_channel_'.length) : null,
  received_at: new Date().toISOString()
}}];
```

### Node 3 — Switch by Metric

Four routes + default fallback:

| Output | Condition |
|---|---|
| `refund_rate` | `route_key == 'refund_rate_rolling_30'` AND `value > 0.08` |
| `email_open_rate` | `route_key == 'email_open_rate'` AND `value < 0.25` |
| `cac_by_channel` | `route_key == 'cac_by_channel'` AND `value > 4.00` |
| `orderbump_rate` | `route_key == 'orderbump_rate'` AND `value < 0.15` |
| Default | NoOp (`No Threshold Breach`) |

### Nodes 4-7 — Build Alert text (one per route)

Each Code node builds an emoji-led, multi-line alert with last value vs. target, recommended action, and dashboard link.

Refund alert example output:

```
🚨 Refund rate alert
Last 30 days: 10.3% (target: <8%)
Metric: refund_rate_rolling_30 on 2026-04-26
Recommended action: review product quality and listing expectations; pull top 3 refund SKUs from dashboard.
Dashboard: https://airtable.com/BASE_ID_PLACEHOLDER/TABLE_ID_ORDERS?view=refunds-30d
```

CAC alert example output (channel suffix preserved):

```
💸 CAC blown on pinterest
Latest: $5.42 (target: <$4.00)
Metric: cac_by_channel_pinterest on 2026-04-26
Recommended action: pause/reduce spend on pinterest, audit creative + targeting, recheck attribution.
Dashboard: https://airtable.com/BASE_ID_PLACEHOLDER/TABLE_ID_METRICS?view=cac-pinterest
```

### Nodes 8-11 — Slack alert (one per route)

- **Channel:** `#str-platform-alerts`
- **Text:** `={{ $json.alert_text }}`
- **Credential:** Slack id `3`

### Nodes 12-15 — Log Alert to Airtable (one per route)

- **Table:** Errors (`TABLE_ID_ERRORS`)
- **Status:** `Alert` (not `Open` — distinguishes alerts from system failures)
- **Workflow:** `W11-threshold-alerts`
- **Node:** the alert type (e.g., `refund_rate`, `email_open_rate`, `cac_by_channel`, `orderbump_rate`)
- **Error message:** `Threshold breach: <metric_name> = <last_value_label> (target <target>)`
- **Payload:** JSON with `metric_name`, `value`, `date`, optional `channel`

### Node 16 — No Threshold Breach (default)

NoOp node. Webhook returned 200 already; this branch is for executions where the metric does not breach.

### Error branch

Standard pattern: Build Error Envelope → Log Error to Airtable (`Status = Open`) → Slack alert. Fires when payload is malformed or the Extract Metric node throws.

## Inputs

- Airtable webhook payload from Metrics row creation
- Environment: webhook is unauthenticated; Airtable automation should include a shared secret header in v2 (TODO)

## Outputs

- (Conditional) Slack alert in `#str-platform-alerts`
- (Conditional) Airtable Errors row with `Status = Alert`
- (Always) HTTP 200 to Airtable

## Dependencies

- Airtable Metrics table automation configured to POST to `/webhook/metric-threshold`
- Airtable Errors table accepts `Alert` as a Status value
- Slack credential `3` and Airtable credential `1` configured
- W09 writes the relevant metrics so the trigger has data to fire on

## Edge cases

| Case | Handling |
|---|---|
| Metric value within target | Routed to NoOp; webhook returns 200; nothing logged |
| `value` non-numeric | Extract Metric throws → error branch |
| Unknown `metric_name` | Routed to NoOp default — no false alert |
| `cac_by_channel_<x>` with new channel name | Channel name extracted dynamically; alert + dashboard link auto-personalised |
| Duplicate Airtable automation fire | Two alert messages; cheap to send twice; dedup not enforced (acceptable for v1) |
| Webhook called with empty body | Throws "Missing metric_name" → error branch |
| Slack rate-limit | Slack node has built-in retry; failure routes to error branch |

## Test cases

1. **Refund spike** — POST `{"fields":{"Metric name":"refund_rate_rolling_30","Value":0.103,"Date":"2026-04-26"}}`
   - Expected: Slack 🚨 alert, Errors row `Status=Alert`
2. **Refund within band** — value 0.04
   - Expected: NoOp, no alert, no Errors row
3. **Email open low** — value 0.18
   - Expected: 📧 Slack alert + Errors row
4. **CAC blown** — `cac_by_channel_pinterest` value 5.42
   - Expected: 💸 alert mentions "pinterest", dashboard URL contains `cac-pinterest`
5. **Bump failing** — `orderbump_rate` value 0.10
   - Expected: 🛒 Slack alert + Errors row
6. **Unknown metric** — `Metric name = "active_users"`
   - Expected: Routed to default NoOp, nothing logged
7. **Malformed payload** — missing `Metric name`
   - Expected: Extract Metric throws → error branch logs + Slack alert in `#str-platform-alerts`

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Webhook 200 rate | 100% | < 99% = investigate |
| False-positive alert rate | < 5% | > 10% = retune thresholds |
| Mean time to Slack notification | < 5s after Airtable row creation | > 30s = investigate |
| Errors-table `Alert` row count vs. Slack message count | 1:1 | mismatch = investigate Airtable write |

## Deployment

1. Import `W11-threshold-alerts.json` into n8n
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_ERRORS` with real Airtable IDs (also dashboard URLs in alert builders)
3. Confirm credentials present: Airtable `1`, Slack `3`
4. Activate workflow; copy the production webhook URL
5. In Airtable Metrics → Automations: create "When record is created" → Run script that posts `{ record_id, fields }` to the webhook URL via `fetch`
6. Manual test: insert a synthetic Metrics row with `refund_rate_rolling_30 = 0.10`; verify Slack alert + Errors row
7. Commit final JSON to `infrastructure/n8n/workflows/W11-threshold-alerts.json`

## Iteration log

- `2026-04-27` — Initial spec + import-ready JSON. Unimplemented in production.
