# W14 — Tax Season Price Escalation

**Priority:** P2

**Family:** D — Pricing & merchandising automation

**Summary:** Every Monday at 09:00 ET, checks whether the current week falls inside the Feb 1 → Apr 15 tax-prep escalation window. If it does, computes the target price for the Tax Season Bundle based on the current date band (Feb=$147, Mar=$167, Apr 1–15=$187, Apr 16+=$97 reset), updates the Products row in Airtable across all three storefront price columns (own site, Gumroad, Payhip), pushes the change to W06 Product Updater so every storefront syncs, logs the change in Metrics, and posts to `#str-platform-ops`.

---

## Trigger

Cron schedule trigger: `0 9 * * 1` (Mondays 09:00 ET).

The workflow runs every Monday year-round; the **Window Guard** code node short-circuits any execution that falls outside Feb 1 → Apr 15 by returning an empty array, which causes downstream nodes to no-op.

## Node-by-node configuration

### Node 1 — Schedule Trigger (Weekly Schedule)

- **Type:** `n8n-nodes-base.scheduleTrigger` (v1.2)
- **Cron expression:** `0 9 * * 1`
- **Timezone:** America/New_York (inherited from workflow `settings.timezone`)

### Node 2 — Function: Window Guard

```js
// Guard: only proceed if today is between Feb 1 and Apr 15 inclusive (America/New_York)
const nowET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
const year = nowET.getFullYear();
const month = nowET.getMonth() + 1; // 1-12
const day = nowET.getDate();

const inWindow = (month === 2) || (month === 3) || (month === 4 && day <= 15);

if (!inWindow) {
  // Off-season: emit nothing -> downstream nodes do not execute
  return [];
}

return [{ json: {
  today_iso: nowET.toISOString(),
  year: year,
  month: month,
  day: day,
  in_window: true
}}];
```

### Node 3 — Function: Determine Target Price

```js
const ctx = $input.first().json;
const month = ctx.month;
const day = ctx.day;

// Schedule (active band by current date):
//  Feb 1 -> Feb 28/29 : $147
//  Mar 1 -> Mar 31    : $167
//  Apr 1 -> Apr 15    : $187
//  Apr 16 onward      : $97  (off-season reset)
let target_price;
let band_label;

if (month === 2) {
  target_price = 147;
  band_label = 'feb-tax-prep-window';
} else if (month === 3) {
  target_price = 167;
  band_label = 'mar-mid-season';
} else if (month === 4 && day <= 15) {
  target_price = 187;
  band_label = 'apr-deadline-peak';
} else if (month === 4 && day >= 16) {
  target_price = 97;
  band_label = 'off-season-reset';
} else {
  target_price = 97;
  band_label = 'off-season';
}

return [{ json: {
  ...ctx,
  target_price: target_price,
  band_label: band_label,
  product_name: 'Tax Season Bundle',
  product_sku: 'tax-season-bundle',
  change_timestamp: new Date().toISOString()
}}];
```

### Node 4 — Airtable: Update Tax Bundle Price

- **Table:** Products (`TABLE_ID_PRODUCTS`)
- **Operation:** Upsert
- **Match on:** `SKU`
- **Fields written:**
  - `SKU`: `tax-season-bundle`
  - `Name`: `Tax Season Bundle`
  - `Price — own site`: `{{ $json.target_price }}`
  - `Price — Gumroad`: `{{ $json.target_price }}`
  - `Price — Payhip`: `{{ $json.target_price }}`
  - `Status`: `Active`
  - `Last price change`: ISO timestamp
  - `Price band`: band label (`feb-tax-prep-window` / `mar-mid-season` / etc.)

### Node 5 — HTTP POST: W06 Product Updater webhook

- **Method:** POST
- **URL:** `{{ $env.N8N_BASE_URL }}/webhook/product-updated`
- **Body (JSON):**

```js
JSON.stringify({
  sku: $json.product_sku,
  name: $json.product_name,
  price: $json.target_price,
  price_own_site: $json.target_price,
  price_gumroad: $json.target_price,
  price_payhip: $json.target_price,
  source_workflow: 'W14-tax-season-price-escalation',
  band: $json.band_label,
  changed_at: $json.change_timestamp
})
```

- **Timeout:** 30s
- **Purpose:** W06 fans the price out to IS, Gumroad, Payhip, Etsy listings.

### Node 6 — Airtable: Log Metric

- **Table:** Metrics (`TABLE_ID_METRICS`)
- **Operation:** Create
- **Fields written:**
  - `Date`: today (YYYY-MM-DD)
  - `Metric name`: `price-changed-tax-season-bundle`
  - `Value`: `{{ $json.target_price }}`
  - `Notes`: human-readable band + SKU + W06 push confirmation
  - `Source`: `W14-tax-season-price-escalation`
  - `Timestamp`: ISO timestamp

### Node 7 — Slack: Ops Notification

- **Channel:** `#str-platform-ops`
- **Message:**

```
💲 Tax Season Bundle price updated
New price: $<price> (band: <band_label>)
Applied to: own-site, Gumroad, Payhip
Date: <YYYY-MM-DD>
W06 Product Updater notified — storefront sync in flight.
```

### Error branch (wraps Nodes 2–7)

If any node fails:
1. **Build Error Envelope** code node packages: timestamp, workflow name, failing node, error message, payload (truncated 500 chars), status `Open`.
2. **Log Error to Airtable** writes to `TABLE_ID_ERRORS`.
3. **Slack Error Alert** posts to `#str-platform-alerts`.

## Inputs

- Cron tick (no payload)
- Environment: `N8N_BASE_URL`
- Airtable Products row for SKU `tax-season-bundle` (created by W00 product-bootstrap or manually)

## Outputs

- Airtable Products row updated (3 price columns + metadata)
- W06 webhook fired (downstream effect: IS/Gumroad/Payhip updates)
- Airtable Metrics row appended
- Slack notification in `#str-platform-ops`

## Dependencies

- W00 / product-bootstrap workflow has created `tax-season-bundle` row in Products
- W06 Product Updater workflow active and listening on `/webhook/product-updated`
- Slack credential `id: 3` configured
- Airtable credential `id: 1` configured
- Env var `N8N_BASE_URL` set (e.g., `https://n8n.thestrledger.com`)

## Edge cases

| Case | Handling |
|---|---|
| Cron fires off-season (May–Jan) | Window Guard returns `[]` → downstream no-ops, no Airtable / Slack writes |
| Cron fires on a leap-year Feb 29 | Treated as Feb band ($147), correct |
| Apr 16 lands on a Monday | Off-season-reset band fires, price drops to $97 |
| W06 webhook unreachable / 5xx | Error branch logs + alerts; Airtable price still updated (idempotent on retry) |
| Airtable Products row missing | Upsert on SKU creates it with all required fields |
| Currency / locale variation | All prices stored as integers in USD; downstream W06 handles per-storefront formatting |
| Two runs same Monday (manual + cron) | Idempotent — same price written twice = no observable change; Metrics gets 2 rows (acceptable audit) |
| Daniel manually overrides price between Mondays | Next Monday's run re-asserts the band price; intentional behavior |

## Test cases

1. **In-window Monday in February** — manually trigger on a Feb Monday. Expected: Products row's three price columns = 147, Metrics row appended with value=147, Slack message posted.
2. **In-window Monday in March** — Expected: prices = 167, band `mar-mid-season`.
3. **In-window Monday in early April** — Expected: prices = 187, band `apr-deadline-peak`.
4. **Apr 16 reset** — Manually trigger on Apr 16. Expected: prices = 97, band `off-season-reset`.
5. **Off-season Monday (e.g., July)** — Expected: Window Guard returns empty, no downstream nodes execute, no Airtable writes.
6. **W06 webhook down** — Stub W06 to return 500. Expected: Error branch fires, Errors row created, Slack alert posted, but Products + Metrics still written.
7. **Airtable rate limit** — Simulate 429. Expected: error branch logs; n8n auto-retry per `retryOnFail` will succeed on next attempt.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Successful Monday executions Feb–Apr | 10–11 per year | Missing > 1 = investigate scheduler |
| Window Guard accuracy | 100% (no off-season writes) | Any off-season Products write = code regression |
| W06 push success | 100% within window | Any failure = check W06 health |
| Time from cron to Slack confirmation | < 30s p95 | > 60s = investigate |

## Deployment

1. Import `W14-tax-season-price-escalation.json` into n8n.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_PRODUCTS`, `TABLE_ID_METRICS`, `TABLE_ID_ERRORS` with real Airtable IDs.
3. Confirm credentials `id: 1` (Airtable) and `id: 3` (Slack) exist.
4. Set env var `N8N_BASE_URL` in n8n admin.
5. Verify `tax-season-bundle` row exists in Products (create if missing).
6. Activate the workflow.
7. Test by manually triggering "Execute Workflow" once inside the Feb–Apr window (or temporarily relax the Window Guard for a smoke test).
8. Verify Airtable rows + Slack message appear.
9. Commit JSON + MD to `infrastructure/n8n/workflows/`.

## Iteration log

- `2026-04-27` — Initial spec. Unimplemented. Cron set to Mondays 09:00 ET; Window Guard handles off-season no-op so the workflow can stay activated year-round without the operator toggling it.
