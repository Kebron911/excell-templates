# W15 — Pinterest Pin Performance Poll

**Priority:** P2

**Family:** E — Distribution analytics & content lifecycle

**Summary:** Every morning at 08:00 ET, fetches the previous day's analytics (impressions, saves, outbound clicks) for every published Pinterest pin tracked in Airtable Content, writes the counts back to each pin's row, then ranks all pins by outbound clicks and tags the top 10% as `amplification-candidate` (worth turning into variants via W16) and the bottom 10% (≥ 14 days old, < 50 impressions) as `archive-candidate`. Posts a daily summary to `#str-platform-content`.

---

## Trigger

Cron schedule trigger: `0 8 * * *` (daily 08:00 America/New_York).

## Node-by-node configuration

### Node 1 — Schedule Trigger (Daily Schedule)

- **Type:** `n8n-nodes-base.scheduleTrigger` (v1.2)
- **Cron expression:** `0 8 * * *`
- **Timezone:** America/New_York

### Node 2 — Function: Compute Date Window

```js
// Pinterest analytics window: yesterday (full UTC day) to today
const now = new Date();
const end = new Date(now);
const start = new Date(now);
start.setDate(start.getDate() - 1);

const fmt = (d) => d.toISOString().slice(0, 10);

return [{ json: {
  start_date: fmt(start),
  end_date: fmt(end),
  poll_timestamp: now.toISOString()
}}];
```

### Node 3 — Airtable: List Published Pins

- **Table:** Content (`TABLE_ID_CONTENT`)
- **Operation:** Search
- **Filter formula:** `AND({Type}='pinterest-pin', {Status}='Published', NOT({pin_id}=''))`
- **Fields returned:** `Title, Type, Status, pin_id, View count, Save count, Outbound clicks, Published date, Tags`

### Node 4 — SplitInBatches (Batch Pins)

- **Type:** `n8n-nodes-base.splitInBatches` (v3)
- **Batch size:** 10 (respects Pinterest API rate limits — 1000 req/hr/user)
- The loop iterates: each batch of 10 pins flows through nodes 5→6→7, then loops back to Node 4 for the next batch. After all batches finish, the "done" output (`main[0]`) flows to Node 8.

### Node 5 — HTTP GET: Pinterest Pin Analytics

- **Method:** GET
- **URL:** `https://api.pinterest.com/v5/pins/{{ $json.fields.pin_id }}/analytics`
- **Auth:** httpHeaderAuth, credential `id: 13` (Pinterest API — Bearer token in header)
- **Query parameters:**
  - `start_date`: yesterday (YYYY-MM-DD)
  - `end_date`: today (YYYY-MM-DD)
  - `metric_types`: `IMPRESSION,SAVE,OUTBOUND_CLICK`
- **Timeout:** 20s

### Node 6 — Function: Parse Analytics

```js
// Pinterest v5 analytics response shape:
// { all: { lifetime_metrics: { IMPRESSION: n, SAVE: n, OUTBOUND_CLICK: n }, daily_metrics: [...] } }
const pin = $input.first().json;
const pinRecord = $node['Batch Pins (10 / batch)'].json;
const recordId = pinRecord.id;
const pinId = pinRecord.fields?.pin_id;
const publishedDate = pinRecord.fields?.['Published date'] || null;

const all = pin.all || {};
const metrics = all.lifetime_metrics || all.metrics || {};

let impressions = metrics.IMPRESSION ?? 0;
let saves = metrics.SAVE ?? 0;
let outboundClicks = metrics.OUTBOUND_CLICK ?? 0;

// Fall back to summing daily_metrics if lifetime block is empty
if ((impressions === 0 && saves === 0 && outboundClicks === 0) && Array.isArray(all.daily_metrics)) {
  for (const day of all.daily_metrics) {
    impressions += day.metrics?.IMPRESSION ?? 0;
    saves += day.metrics?.SAVE ?? 0;
    outboundClicks += day.metrics?.OUTBOUND_CLICK ?? 0;
  }
}

let ageDays = null;
if (publishedDate) {
  ageDays = Math.floor((Date.now() - new Date(publishedDate).getTime()) / (1000 * 60 * 60 * 24));
}

return [{ json: {
  record_id: recordId,
  pin_id: pinId,
  view_count: impressions,
  save_count: saves,
  outbound_clicks: outboundClicks,
  age_days: ageDays,
  existing_tags: pinRecord.fields?.Tags || [],
  poll_timestamp: $node['Compute Date Window'].json.poll_timestamp
}}];
```

### Node 7 — Airtable: Update Pin Metrics

- **Table:** Content (`TABLE_ID_CONTENT`)
- **Operation:** Update by record id (`{{ $json.record_id }}`)
- **Fields written:**
  - `View count`: `{{ $json.view_count }}`
  - `Save count`: `{{ $json.save_count }}`
  - `Outbound clicks`: `{{ $json.outbound_clicks }}`
  - `Last analytics poll`: ISO timestamp
- After update, control returns to Node 4 (SplitInBatches) for the next batch.

### Node 8 — Function: Compute Performance Tiers

Runs once after the loop completes. Pulls every output from `Parse Analytics` across all batches, ranks by `outbound_clicks`, picks top 10% and bottom 10%, then emits one item per pin to be re-tagged.

```js
const all = $items('Parse Analytics', 0, 0).map(i => i.json).filter(p => p && p.record_id);

if (all.length === 0) {
  return [{ json: { summary: 'No pins processed', amplification: [], archive: [] } }];
}

const sorted = [...all].sort((a, b) => b.outbound_clicks - a.outbound_clicks);

const topCount = Math.max(1, Math.floor(sorted.length * 0.10));
const amplification = sorted.slice(0, topCount).map(p => ({
  record_id: p.record_id,
  pin_id: p.pin_id,
  outbound_clicks: p.outbound_clicks,
  view_count: p.view_count,
  tag: 'amplification-candidate',
  existing_tags: p.existing_tags
}));

const bottomCount = Math.max(1, Math.floor(sorted.length * 0.10));
const bottomSlice = sorted.slice(-bottomCount);
const archive = bottomSlice
  .filter(p => p.age_days != null && p.age_days >= 14 && p.view_count < 50)
  .map(p => ({
    record_id: p.record_id,
    pin_id: p.pin_id,
    outbound_clicks: p.outbound_clicks,
    view_count: p.view_count,
    age_days: p.age_days,
    tag: 'archive-candidate',
    existing_tags: p.existing_tags
  }));

const tagged = [...amplification, ...archive];

if (tagged.length === 0) {
  return [{ json: { summary: 'No tier changes', amplification_count: amplification.length, archive_count: archive.length, total_pins: all.length } }];
}

return tagged.map((p, idx) => ({ json: {
  ...p,
  is_first: idx === 0,
  total_pins: all.length,
  amplification_count: amplification.length,
  archive_count: archive.length
}}));
```

### Node 9 — Airtable: Tag Tier Pins

- **Table:** Content (`TABLE_ID_CONTENT`)
- **Operation:** Update by record id
- **Field written:**
  - `Tags`: `{{ Array.from(new Set([...($json.existing_tags || []), $json.tag])) }}` (idempotent set-merge)

### Node 10 — Slack Content Summary

- **Channel:** `#str-platform-content`
- **Message:**

```
📌 Pinterest analytics poll complete
Pins polled: <N>
Amplification candidates (top 10%): <N>
Archive candidates (bottom 10%, 14d+, <50 imp): <N>
Window: <start_date> → <end_date>
Review the Amplification view in Airtable Content table.
```

### Error branch (wraps Nodes 3, 5–9)

If any node fails:
1. **Build Error Envelope** packages timestamp, workflow, node, message, payload, status `Open`.
2. **Log Error to Airtable** writes to `TABLE_ID_ERRORS`.
3. **Slack Error Alert** posts to `#str-platform-alerts`.

## Inputs

- Cron tick (no payload)
- Airtable Content rows where `Type=pinterest-pin` AND `Status=Published` AND `pin_id` is non-empty
- Pinterest v5 analytics endpoint, OAuth Bearer token via credential `id: 13`

## Outputs

- Updated `View count`, `Save count`, `Outbound clicks`, `Last analytics poll` on every published pin's Content row
- `Tags` updated with `amplification-candidate` (top 10%) or `archive-candidate` (bottom 10%, ≥14d old, <50 impressions)
- Slack summary in `#str-platform-content`

## Dependencies

- Pinterest Business account with API access (v5 endpoints enabled)
- Pinterest credential `id: 13` configured in n8n with OAuth Bearer token
- Airtable Content table has columns: `Type, Status, pin_id, View count, Save count, Outbound clicks, Published date, Tags, Last analytics poll`
- Airtable view "Amplification candidates" filtered on `Tags contains amplification-candidate` (manual setup, one-time)
- Airtable view "Archive candidates" filtered on `Tags contains archive-candidate` (manual setup, one-time)

## Edge cases

| Case | Handling |
|---|---|
| No published pins yet | Node 3 returns 0 records; Batch Pins immediately falls through to "done"; Node 8 returns `summary: 'No pins processed'`; Slack still posts |
| Pin deleted on Pinterest (404) | Node 5 errors → error branch logs; loop continues with next batch (`onError: continueErrorOutput`) |
| Pinterest rate limit (429) | Batch size 10 + n8n built-in retry handle; if persistent, error branch logs and Slack alerts |
| Pin's `pin_id` is null/blank | Filter formula excludes it from Node 3 results |
| Pin published < 24h ago | Still polled; impressions may be near-zero; not eligible for archive (age_days < 14) |
| Tags field already has `amplification-candidate` | Set-merge in Node 9 keeps it idempotent — no duplicate tag |
| Pinterest token expired | Node 5 returns 401; error branch alerts; manual re-auth required |
| Fewer than 10 pins total | `topCount` and `bottomCount` floor to 1, ensuring at least one of each tier when pins exist |
| Same pin both top and bottom 10% (small N) | Both tags applied (acceptable; rare; signals catalogue too small for tiering) |

## Test cases

1. **Smoke test with 1 published pin** — Expected: pin's metrics updated, pin tagged `amplification-candidate` (it's the only one, so it's also the top 10%), Slack summary posted with counts (1, 1, 0).
2. **20 published pins** — Expected: all metrics updated; top 2 tagged amplification; bottom 2 evaluated for archive (filtered by age + impressions).
3. **Pin deleted on Pinterest** — Manually delete a pin remotely. Expected: Node 5 returns 404, error branch logs that pin, other pins continue successfully.
4. **Rate limit hit** — Stub Pinterest to return 429 on every 6th call. Expected: batches of 10 still complete with partial errors logged; Slack alerts.
5. **All pins under 14 days old** — Expected: `archive_count = 0` even if some have low impressions (correct — too soon to judge).
6. **No published pins** — Disable all pins. Expected: Slack summary `Pins polled: 0`; no errors.
7. **Pinterest token expired** — Revoke token. Expected: every Node 5 returns 401 → error branch logs + Slack `#str-platform-alerts`.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Daily execution success | 1/day | Missing > 1 day = investigate |
| Pins polled per run | grows over time | Sudden drop > 20% = investigate Airtable filter |
| Pinterest 4xx/5xx rate | < 1% | > 5% = investigate API health or credential |
| Mean view_count per pin | trending up | Sudden drop = investigate Pinterest algorithm change |
| Time from cron to Slack summary | < 5 min p95 (≤ 100 pins) | > 10 min = investigate batching |

## Deployment

1. Import `W15-pinterest-pin-performance-poll.json` into n8n.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_CONTENT`, `TABLE_ID_ERRORS` with real Airtable IDs.
3. Confirm credentials `id: 1` (Airtable), `id: 3` (Slack), `id: 13` (Pinterest API) exist.
4. In Airtable Content, ensure columns exist: `pin_id` (single-line text), `View count` (number), `Save count` (number), `Outbound clicks` (number), `Published date` (date), `Tags` (multi-select), `Last analytics poll` (datetime).
5. Create Airtable views: "Amplification candidates" and "Archive candidates" filtered on Tags.
6. Activate the workflow.
7. Manually execute once to verify all nodes run; check a known pin's metrics in Airtable.
8. Confirm Slack summary lands in `#str-platform-content`.
9. Commit JSON + MD to `infrastructure/n8n/workflows/`.

## Iteration log

- `2026-04-27` — Initial spec. Unimplemented. Top/bottom 10% bands chosen instead of fixed thresholds so the workflow remains useful regardless of total pin count. Archive eligibility gated on age ≥ 14 days + impressions < 50 to avoid premature culling.
