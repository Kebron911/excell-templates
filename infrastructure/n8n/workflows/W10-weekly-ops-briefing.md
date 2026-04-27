# W10 — Weekly Ops Briefing

**Priority:** P1

**Family:** D — Reporting & analytics

**Summary:** Every Monday 07:00 ET, aggregates the prior 7 days of Metrics, Orders, and Content; computes WoW deltas; sends the JSON blob to Claude for a < 500-word markdown briefing; emails Daniel; archives the briefing to the WeeklyBriefings Airtable table.

---

## Trigger

Cron schedule (n8n Schedule Trigger): `0 7 * * 1` evaluated in `America/New_York`.

Fires every Monday at 07:00 ET, after W09's Sunday rollup has completed.

## Node-by-node configuration

### Node 1 — Schedule Trigger (Monday 07:00 ET)

- **Type:** `scheduleTrigger` v1.2
- **Cron:** `0 7 * * 1`
- **Timezone:** `America/New_York`

### Node 2 — Function: Compute Last 7 Days Range

```js
const now = new Date();
const etOffsetMs = -5 * 60 * 60 * 1000;
const nowEt = new Date(now.getTime() + etOffsetMs);

const endEt = new Date(nowEt);
endEt.setUTCHours(0, 0, 0, 0);
const startEt = new Date(endEt);
startEt.setUTCDate(endEt.getUTCDate() - 7);

const priorEndEt = new Date(startEt);
const priorStartEt = new Date(priorEndEt);
priorStartEt.setUTCDate(priorEndEt.getUTCDate() - 7);

const toUtc = d => new Date(d.getTime() - etOffsetMs).toISOString();

return [{ json: {
  start_utc: toUtc(startEt),
  end_utc: toUtc(endEt),
  prior_start_utc: toUtc(priorStartEt),
  prior_end_utc: toUtc(priorEndEt),
  week_start_date: startEt.toISOString().slice(0, 10),
  week_end_date: endEt.toISOString().slice(0, 10),
  generated_at: now.toISOString()
}}];
```

### Nodes 3-6 — Airtable: List source data

Four parallel Airtable Search nodes:

| Node | Table | Filter |
|---|---|---|
| Node 3: List Metrics Last 7d | Metrics | `AND(IS_AFTER({Date}, '<start>'), IS_BEFORE({Date}, '<end>'))` |
| Node 4: List Metrics Prior 7d | Metrics | Same shape against the prior 7-day range |
| Node 5: List Orders Last 7d | Orders | Filtered by `Timestamp` |
| Node 6: List Content Last 7d | Content | Filtered by `Published date` |

All four use Airtable credential id `1` and have `onError: continueErrorOutput`.

### Node 7 — Function: Assemble Weekly Blob

Builds the JSON blob fed to Claude, including WoW deltas, channel breakdown, top products, behaviour rates (latest available), content summary, and anomaly flags:

```js
const range = $node['Compute Last 7 Days Range'].json;
const metrics = $node['List Metrics Last 7d'].all().map(i => i.json.fields || i.json);
const priorMetrics = $node['List Metrics Prior 7d'].all().map(i => i.json.fields || i.json);
const orders = $node['List Orders Last 7d'].all().map(i => i.json.fields || i.json);
const content = $node['List Content Last 7d'].all().map(i => i.json.fields || i.json);

const sumMetric = (rows, name) => rows.filter(r => r['Metric name'] === name).reduce((a, r) => a + (Number(r['Value']) || 0), 0);

const revenue_week = sumMetric(metrics, 'revenue_total');
const revenue_prior = sumMetric(priorMetrics, 'revenue_total');
const wow_revenue_pct = revenue_prior ? ((revenue_week - revenue_prior) / revenue_prior) * 100 : 0;

// ... see workflow JSON for the full implementation including channel revenue,
// top_products, latest refund_rate_rolling_30, content_summary, and anomaly detection.
```

Output blob shape:

```
{
  week_start, week_end,
  revenue_week, revenue_prior_week, wow_revenue_pct,
  orders_week, orders_prior_week, wow_orders_pct,
  channel_revenue: { is, etsy, gumroad },
  top_products: [{ sku, units, revenue }, ...],
  orderbump_rate, oto_rate, refund_rate_rolling_30,
  content_summary: { total_published, by_type, total_views, total_conversions },
  anomalies: [{ metric, value, target }, ...]
}
```

### Node 8 — HTTP Claude API: POST /v1/messages

- **URL:** `https://api.anthropic.com/v1/messages`
- **Auth:** Header auth credential id `7` (Claude API — `x-api-key`)
- **Headers:** `anthropic-version: 2023-06-01`, `content-type: application/json`
- **Model:** `claude-opus-4-7`
- **Max tokens:** `2000`
- **System prompt:** `"You are the weekly ops analyst for The STR Ledger. You write concise, professional briefings in markdown with concrete numbers."`
- **User message (verbatim from spec):**

```
You are the weekly ops analyst for The STR Ledger. Given the following data, write a concise
briefing (under 500 words) for Daniel. Lead with revenue total + trend. Then top
products. Then channel breakdown. Then anomalies (flag any metric outside its
target band — refunds >8%, email open <25%, CAC >$4). End with 3 suggested actions.

Data:
<JSON blob substituted here>

Format: markdown, professional tone, concrete numbers.
```

### Node 9 — Function: Parse Claude Response

```js
const resp = $input.first().json;
let markdown = '';
if (resp && Array.isArray(resp.content)) {
  markdown = resp.content.filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
} else if (resp && typeof resp.completion === 'string') {
  markdown = resp.completion.trim();
} else {
  throw new Error('Unexpected Claude response shape');
}
if (!markdown) throw new Error('Empty briefing returned by Claude');
```

Emits `{ subject, markdown, week_start, week_end, blob, generated_at }`.

### Node 10 — Email: Send to Daniel

- **Type:** `n8n-nodes-base.emailSend` v2.1
- **From:** `hello@thestrledger.com`
- **To:** `ltharrisond@hotmail.com`
- **Subject:** `STR Ledger Weekly Briefing — <week_start> → <week_end>`
- **Format:** both (text = raw markdown, HTML = pre-wrapped escaped markdown)
- **Credential:** SMTP id `8`

### Node 11 — Airtable: Save Briefing to WeeklyBriefings

- **Table:** WeeklyBriefings (`TABLE_ID_WEEKLY_BRIEFINGS`)
- **Fields:** `Week start`, `Week end`, `Subject`, `Briefing markdown`, `Data blob` (JSON), `Generated at`, `Source workflow = W10-weekly-ops-briefing`

### Node 12 — Slack: Briefing notice

Channel: `#str-platform-wins`. Short summary with revenue, WoW %, orders, anomaly count, and a note that the full briefing was emailed.

### Error branch

Standard pattern: Build Error Envelope → Log Error to Airtable (Errors, `Status = Open`) → Slack alert to `#str-platform-alerts`.

## Inputs

- Airtable Metrics (last 7 days + prior 7 days for WoW)
- Airtable Orders (last 7 days)
- Airtable Content (last 7 days)
- Claude API (message generation)
- SMTP credential

## Outputs

- Markdown briefing emailed to Daniel from `hello@thestrledger.com`
- WeeklyBriefings Airtable row with the full markdown + JSON blob
- Slack notice in `#str-platform-wins`

## Dependencies

- W09 has been writing daily Metrics rows for at least 14 days (so prior-week comparison is meaningful)
- WeeklyBriefings table exists in Airtable
- SMTP credential `8` configured (`hello@thestrledger.com` mailbox)
- Claude API credential `7` configured with `x-api-key` header auth
- `claude-opus-4-7` model accessible to the API key

## Edge cases

| Case | Handling |
|---|---|
| First-run, no prior week metrics | `wow_revenue_pct = 0`, `wow_orders_pct = 0`; briefing still generates |
| Claude returns empty content array | `Parse Claude Response` throws → error branch |
| Claude returns rate-limit 429 | HTTP node fails → error branch logs + Slack alert |
| Email delivery fails (SMTP timeout) | Error branch logs; Airtable archive still succeeds (parallel branch) |
| WeeklyBriefings write fails | Error branch logs; email still delivered (parallel branch) |
| Anomaly count = 0 | Briefing notes "no anomalies" — Claude handles narrative |
| DST transition Monday | `0 7 * * 1` in ET fires once at local 07:00 |

## Test cases

1. **Happy path** — Run on a Monday with 7 days of Metrics, Orders, Content
   - Expected: Briefing < 500 words, email arrives, WeeklyBriefings row created, Slack notice posted
2. **Sparse week** — Only 2 days of Metrics rows
   - Expected: Briefing still generates; Claude notes data sparseness
3. **Claude API down** — Stub URL to return 503
   - Expected: Error branch fires, no email sent, Errors row + Slack alert
4. **WoW negative** — Prior week revenue > current week
   - Expected: Negative `wow_revenue_pct` flows into prompt; Claude leads with decline
5. **Anomaly week** — refund_rate_rolling_30 = 0.12
   - Expected: `anomalies` array contains entry; Claude calls it out explicitly

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Weekly success rate | 100% | Any failure = Slack alert + manual rerun |
| Claude latency | < 30s | > 90s = investigate |
| Email delivery (bounce/timeout) | 0 | Any bounce = page Daniel |
| WeeklyBriefings row created | Yes, every Monday | Missing row by 08:00 ET = page |

## Deployment

1. Import `W10-weekly-ops-briefing.json` into n8n
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_METRICS`, `TABLE_ID_ORDERS`, `TABLE_ID_CONTENT`, `TABLE_ID_WEEKLY_BRIEFINGS`, `TABLE_ID_ERRORS` with real Airtable IDs
3. Confirm credentials present: Airtable `1`, Slack `3`, Claude `7`, SMTP `8`
4. Verify SMTP `hello@thestrledger.com` can send to external addresses
5. Manually execute once mid-week to validate end-to-end
6. Activate workflow; confirm next Monday 07:00 ET execution
7. Commit final JSON to `infrastructure/n8n/workflows/W10-weekly-ops-briefing.json`

## Iteration log

- `2026-04-27` — Initial spec + import-ready JSON. Unimplemented in production.
