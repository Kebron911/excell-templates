# W06 — Product Updater

**Priority:** P1

**Family:** A — Product publishing & lifecycle

**Summary:** Triggered when an Airtable Products row changes (name, description, prices, files, thumbnail, tags). Pushes the new state to every platform the product is live on (IS, Gumroad, Etsy draft email), then writes per-platform sync status back to the Airtable row. Implements last-write-wins concurrency via a `Sync lock` field. If the version field changed with a MAJOR or MINOR bump, hands off to W22 for customer notification.

---

## Trigger

HTTP POST webhook: `https://n8n.thestrledger.com/webhook/product-updated`

Configured in **Airtable → Products table → Automations → "When record matches conditions"**:
- Condition: `Status = Published` AND any of [`Name`, `Full description`, `Price (IS)`, `Price (Gumroad)`, `Price (Etsy)`, `Master file`, `Thumbnail`, `Tags`, `Version`] was modified.
- Action: "Send webhook" → URL above. Body shape:

```json
{
  "record_id": "recXXXXXXXXXXXXXX",
  "metadata": { "changed_fields": ["Price (IS)", "Full description"] }
}
```

## Node-by-node configuration

### Node 1 — Webhook (POST)

- **Path:** `/webhook/product-updated`
- **Method:** POST
- **Response mode:** "Respond immediately" with 200 — Airtable Automations expect a fast acknowledgment.

### Node 2 — Function: Validate & Extract

```js
const input = $input.first().json;
const body = input.body || input;

const recordId = body.record_id || body.recordId || (body.record && body.record.id);
if (!recordId) throw new Error('Missing product record_id in webhook payload');

const changedFields = (body.metadata && body.metadata.changed_fields) || body.changed_fields || [];
if (!Array.isArray(changedFields)) throw new Error('changed_fields must be an array');

const executionId = $execution.id || ('exec-' + Date.now());

return [{ json: {
  record_id: recordId,
  changed_fields: changedFields,
  execution_id: executionId,
  triggered_at: new Date().toISOString()
}}];
```

### Node 3 — Airtable: Get Product Row

- **Operation:** Get
- **Table:** Products
- **Record ID:** `{{ $json.record_id }}`

### Node 4 — Airtable: Acquire Sync Lock

- **Operation:** Update
- **Table:** Products
- **Record ID:** `{{ $json.id }}`
- **Fields set:**
  - `Sync lock`: `{{ $node['Validate & Extract'].json.execution_id }}` (writes our execution_id; later updates that arrive will overwrite it, which is what we want for last-write-wins)
  - `Sync status`: `in_progress`
  - `Sync started at`: `{{ $node['Validate & Extract'].json.triggered_at }}`

### Node 5 — Function: Build Update Context

Computes which content fields actually changed and detects MAJOR / MINOR / PATCH version bumps.

```js
const lockResult = $input.first().json;
const meta = $node['Validate & Extract'].json;
const product = $node['Get Product Row'].json;
const f = product.fields || {};

const changed = new Set(meta.changed_fields.map(s => String(s).toLowerCase()));
const contentFieldsChanged = ['name','description','price','price_is','price_gumroad','price_etsy','master file','thumbnail','tags','preview images']
  .some(k => changed.has(k));

const version = String(f['Version'] || '0.0.0');
const prevVersion = String(f['Previous version'] || version);
const bumpKind = (() => {
  const a = version.split('.').map(n => parseInt(n) || 0);
  const b = prevVersion.split('.').map(n => parseInt(n) || 0);
  if (a[0] > b[0]) return 'MAJOR';
  if (a[1] > b[1]) return 'MINOR';
  if (a[2] > b[2]) return 'PATCH';
  return 'NONE';
})();

return [{ json: {
  record_id: product.id,
  execution_id: meta.execution_id,
  triggered_at: meta.triggered_at,
  sku: f['SKU'] || '',
  name: f['Name'] || '',
  description: f['Full description'] || f['Description'] || '',
  price_is: f['Price (IS)'] || f['Price'] || 0,
  price_gumroad: f['Price (Gumroad)'] || f['Price'] || 0,
  price_etsy: f['Price (Etsy)'] || f['Price'] || 0,
  master_file_url: (f['Master file'] && f['Master file'][0] && f['Master file'][0].url) || '',
  thumbnail_url: (f['Thumbnail'] && f['Thumbnail'][0] && f['Thumbnail'][0].url) || '',
  tags: f['Tags'] || [],
  is_product_id: f['IS product ID'] || '',
  gumroad_product_id: f['Gumroad product ID'] || '',
  etsy_listing_id: f['Etsy listing ID'] || '',
  status: f['Status'] || '',
  live_on_is: !!f['Live on IS'],
  live_on_gumroad: !!f['Live on Gumroad'],
  live_on_etsy: !!f['Live on Etsy'],
  version, previous_version: prevVersion,
  bump_kind: bumpKind,
  content_fields_changed: contentFieldsChanged,
  changed_fields: meta.changed_fields
}}];
```

### Node 6 — Switch: Fanout to Platforms

Three rule outputs route the same item in parallel to each live platform; fallback output flows directly to the aggregator (so single-platform products still finalize).

- Output 1 (`is`): `live_on_is && is_product_id` → IS Update Product
- Output 2 (`gumroad`): `live_on_gumroad && gumroad_product_id` → Gumroad Update Product
- Output 3 (`etsy`): `live_on_etsy` → Build Etsy Draft Email
- Fallback: → Aggregate Platform Results (merge node)

### Node 7 — IS Update Product

- **Method:** PUT
- **URL:** `{{ $env.IS_API_BASE_URL }}/api/products/{{ $json.is_product_id }}`
- **Auth:** httpHeaderAuth (credential ID `2`)
- **Body:** `{ name, description, price (IS), file_url, image_url, tags, sku }`

### Node 8 — Gumroad Update Product

- **Method:** PUT
- **URL:** `https://api.gumroad.com/v2/products/{{ $json.gumroad_product_id }}`
- **Auth:** httpHeaderAuth (credential ID `5`)
- **Body (form-urlencoded):** `name`, `description`, `price` (cents), `tags` (comma-joined)

### Node 9 — Function: Build Etsy Draft Email

Etsy listing UPDATE via API requires re-listing fees and frequent OAuth re-auth. We instead generate a draft email Daniel can copy/paste.

```js
const p = $input.first().json;
const tags = (p.tags || []).join(', ');
const body = [
  'Etsy listing manual update required.',
  '',
  'SKU: ' + p.sku,
  'Etsy listing ID: ' + (p.etsy_listing_id || '(not yet linked)'),
  'Name: ' + p.name,
  'Price (Etsy): $' + p.price_etsy,
  'Tags: ' + tags,
  '',
  'Description:',
  p.description,
  '',
  'Thumbnail: ' + (p.thumbnail_url || '(none)'),
  'Master file: ' + (p.master_file_url || '(none)'),
  '',
  'Changed fields: ' + (p.changed_fields || []).join(', '),
  'Triggered at: ' + p.triggered_at,
  'Execution ID: ' + p.execution_id
].join('\n');

return [{ json: {
  record_id: p.record_id, execution_id: p.execution_id,
  to: $env.ETSY_NOTIFY_EMAIL || 'daniel@thestrledger.com',
  subject: '[STR Ledger] Etsy listing update needed: ' + p.name + ' (' + p.sku + ')',
  body, platform: 'etsy', status: 'pending_manual'
}}];
```

### Node 10 — Send Etsy Draft Email

- **Method:** POST
- **URL:** `{{ $env.IS_API_BASE_URL }}/api/email/send` (uses IS as transactional email)
- **Body:** `{ to, subject, body }`

### Nodes 11 / 12 — Mark IS / Gumroad Synced

Code nodes that emit `{ record_id, execution_id, platform, status: 'success', synced_at }` for the aggregator.

### Node 13 — Merge: Aggregate Platform Results (append mode)

Collects the per-platform success items into a single stream so finalize sees one row per platform.

### Node 14 — Function: Verify Lock & Finalize

Implements last-write-wins concurrency: re-reads the current Sync lock from the row we cached at Node 3. If the lock no longer matches our `execution_id`, a newer execution has taken over the row — we skip our finalize so we don't clobber its status.

```js
const items = $input.all();
const meta = $node['Validate & Extract'].json;
const ctx = $node['Build Update Context'].json;
const current = $node['Get Product Row'].json;
const currentLock = (current.fields && current.fields['Sync lock']) || '';

if (currentLock && currentLock !== meta.execution_id) {
  return [{ json: {
    record_id: ctx.record_id,
    execution_id: meta.execution_id,
    skipped: true,
    reason: 'Superseded by newer execution ' + currentLock
  }}];
}

const results = items.map(i => i.json).filter(j => j.platform);
const statuses = {};
for (const r of results) statuses[r.platform] = r.status || 'unknown';

const overall = Object.values(statuses).every(s => s === 'success' || s === 'pending_manual') ? 'success' : 'partial';

return [{ json: {
  record_id: ctx.record_id,
  execution_id: meta.execution_id,
  sku: ctx.sku, name: ctx.name,
  version: ctx.version, bump_kind: ctx.bump_kind,
  per_platform_status: JSON.stringify(statuses),
  overall_status: overall,
  finalized_at: new Date().toISOString(),
  skipped: false
}}];
```

### Node 15 — Switch: Skip vs Finalize

- Output 1 (`skipped`): `skipped === true` → Slack Skip Notification (no Airtable write)
- Fallback: → Update Product Sync Status

### Node 16 — Airtable: Update Product Sync Status

- **Operation:** Update
- **Fields:**
  - `Sync status`: `{{ $json.overall_status }}`
  - `Per-platform sync status`: `{{ $json.per_platform_status }}` (JSON string)
  - `Last updated`: `{{ $json.finalized_at }}`
  - `Sync lock`: `""` (release the lock)

### Node 17 — Switch: Version Bump

- Output 1 (`majorOrMinor`): `bump_kind = MAJOR` → Trigger W22 Notify Customers
- Output 2 (`minor`): `bump_kind = MINOR` → Trigger W22 Minor (same payload, different output for routing flexibility)
- Fallback: → Slack Sync Confirmation (PATCH or NONE — quietly synced)

### Nodes 18 / 19 — Trigger W22 Notify Customers

- **Method:** POST
- **URL:** `{{ $env.N8N_BASE_URL }}/webhook/template-update-notify`
- **Body:** `{ record_id, sku, name, version, bump_kind }`

### Node 20 — Slack: Sync Confirmation

- Channel: `#str-platform-ops`
- Message: `Product update synced: <name> (<sku>) v<version> — <overall_status> [<per_platform_json>]`

### Node 21 — Slack: Skip Notification

- Channel: `#str-platform-ops`
- Message: `W06 skipped: execution <id> superseded for record <recId>. Reason: <reason>`

### Error branch (wraps Nodes 2, 3, 4, 7, 8, 10, 16, 18, 19)

1. Build Error Envelope (code) — captures workflow, node, error message, payload
2. Log Error to Airtable Errors table (status `Open`)
3. Slack alert to `#str-platform-alerts`

## Inputs

- Airtable Products webhook payload (`record_id`, `metadata.changed_fields`)
- Airtable Products row (full read)
- Environment: `IS_API_BASE_URL`, `N8N_BASE_URL`, `ETSY_NOTIFY_EMAIL`

## Outputs

- Updated product on IS via PUT `/api/products/:id`
- Updated product on Gumroad via PUT `/v2/products/:id`
- Email to Daniel for manual Etsy update
- Airtable Products row updated: `Sync status`, `Per-platform sync status`, `Last updated`, `Sync lock` cleared
- W22 invocation if MAJOR or MINOR bump
- Slack confirmation in `#str-platform-ops`

## Dependencies

- W05 Product Publisher must have created the platform product IDs (`IS product ID`, `Gumroad product ID`, `Etsy listing ID`); W06 only updates, never creates
- Airtable Products table fields: `SKU`, `Name`, `Full description`, `Price (IS)`, `Price (Gumroad)`, `Price (Etsy)`, `Master file` (attachment), `Thumbnail` (attachment), `Tags` (multi-select), `IS product ID`, `Gumroad product ID`, `Etsy listing ID`, `Live on IS/Gumroad/Etsy` (checkboxes), `Version`, `Previous version`, `Sync lock`, `Sync status`, `Per-platform sync status`, `Sync started at`, `Last updated`
- Airtable automation configured to POST to `/webhook/product-updated` with `record_id` + `metadata.changed_fields`
- W22 Template Update Notification webhook live at `/webhook/template-update-notify`
- Credentials: Airtable (1), IS API (2), Slack (3), Gumroad (5)

## Edge cases

| Case | Handling |
|---|---|
| Two updates fired in quick succession | Second execution overwrites `Sync lock`; first execution's Verify Lock & Finalize sees mismatch and skips its Airtable write — last-write-wins |
| Product is `Status != Published` | Airtable automation filter blocks the webhook; defense in depth: `Build Update Context` still runs, but downstream platforms only fire when their `Live on *` flag is true |
| Product not yet on a platform (no `IS product ID`) | Switch fallback skips that branch; finalize records partial coverage |
| IS API returns 404 (product deleted server-side) | Error branch fires; row's `Sync status` stays `in_progress` until next execution clears it (alerts surface stale state) |
| Gumroad API returns 422 (invalid price) | Error branch fires; other platforms continue (per-platform isolation via parallel branches) |
| `Master file` attachment missing | `master_file_url` resolves to empty string; IS update proceeds without file change |
| `changed_fields` not an array | Validate & Extract throws — caught by error branch |
| Webhook replay (Airtable retry) | Idempotent — second run reads current state and re-pushes; `Last updated` simply moves forward |
| Version unchanged but content changed | `bump_kind = NONE`; W22 not triggered; Slack confirmation only |
| MAJOR bump on patch version field error (e.g. `2.0.0` → `1.0.0`) | Bump kind detection compares numeric components; downgrades resolve to `NONE` and don't trigger W22 |

## Test cases

1. **Single field price update on IS-only product**
   - Trigger: webhook with `changed_fields=["Price (IS)"]`, product `Live on IS=true`, others false
   - Expected: IS PUT call succeeds; Gumroad/Etsy branches skipped; `Sync status=success`; no W22 call.
2. **Description update on multi-platform product**
   - Trigger: `changed_fields=["Full description"]`, all three `Live on *` true
   - Expected: IS PUT, Gumroad PUT, Etsy email all fire in parallel; aggregator sees 3 rows; `Per-platform sync status` JSON includes all three.
3. **MAJOR version bump (2.x.x → 3.0.0)**
   - Expected: Sync runs; W22 webhook fires with `bump_kind=MAJOR`.
4. **MINOR version bump (3.0.0 → 3.1.0)**
   - Expected: W22 webhook fires with `bump_kind=MINOR`.
5. **PATCH version bump (3.1.0 → 3.1.1)**
   - Expected: Sync runs; W22 NOT triggered; Slack confirmation only.
6. **Concurrent updates (two webhooks within 5s)**
   - Expected: Second execution overwrites `Sync lock`; first execution skips finalize and posts skip Slack message; second execution writes final status.
7. **IS API 500**
   - Expected: Error branch fires with node=`IS Update Product`; Gumroad and Etsy still complete; finalize records `partial`.
8. **Missing record_id in webhook**
   - Expected: Validate & Extract throws; error branch logs to Airtable; Slack alert.
9. **Product not Published (defense in depth bypassing the Airtable filter)**
   - Expected: All `Live on *` flags false → fallback path runs → finalize writes status without any platform call.
10. **Gumroad credential expired**
    - Expected: Auth failure → error branch; IS still succeeds; finalize records `partial`.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Webhook → finalize latency | < 15s p95 | > 60s p95 = investigate |
| Sync success rate (overall_status=success) | > 95% | < 90% over 24h = investigate |
| Per-platform success rate (IS, Gumroad) | > 98% each | < 95% = check platform API health |
| Stale `Sync lock` rows (held > 5 min) | 0 | > 0 = abandoned execution; manual cleanup |
| W22 trigger rate vs version-bump events | 1:1 for MAJOR/MINOR | mismatch = bump detection bug |
| Etsy draft emails sent | matches MAJOR/MINOR Etsy-live products | mismatch = email pipeline issue |

## Deployment

1. Add the required fields to the Airtable Products table (see Dependencies).
2. Create the Airtable automation: trigger "When record matches conditions" with `Status = Published` AND any of the watched fields modified; action "Run script" or "Send webhook" to `/webhook/product-updated` with `record_id` + `metadata.changed_fields`.
3. Import `W06-product-updater.json` into n8n.
4. Replace credential placeholders `1` (Airtable), `2` (IS), `3` (Slack), `5` (Gumroad) with real IDs.
5. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_PRODUCTS`, `TABLE_ID_ERRORS` with the live Airtable IDs.
6. Set environment variables in n8n: `IS_API_BASE_URL`, `N8N_BASE_URL`, `ETSY_NOTIFY_EMAIL`.
7. Activate the workflow.
8. Test by editing a published product's price and confirming sync completes within 15 seconds.
9. Verify the lock-release path by editing the same product twice in quick succession.

## Iteration log

- `2026-04-27` — Initial spec. Implements parallel platform fanout (IS PUT, Gumroad PUT, Etsy draft email), last-write-wins via `Sync lock` field check at finalize, MAJOR/MINOR/PATCH bump detection driving W22 handoff, and per-platform error isolation. Etsy direct API listing update deferred (re-listing fee + OAuth churn); draft email is the production path until Etsy listing automation matures.
