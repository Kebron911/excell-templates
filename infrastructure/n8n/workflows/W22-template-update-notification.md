# W22 — Template Update Notification

**Priority:** P3

**Family:** C — Customer lifecycle / post-purchase

**Summary:** When an Airtable Products row's Version is bumped MAJOR or MINOR, notifies every customer who purchased that product via IS transactional email with a fresh download link, then logs the notification to each Customer's history. Patch bumps are silent (typo fixes don't earn an inbox).

---

## Trigger

HTTP POST webhook: `https://n8n.thestrledger.com/webhook/product-version-bump`

Fired by an Airtable automation on the Products table:

- **Trigger:** Version field updated
- **Action:** Run script → POST to webhook with body
  ```json
  {
    "product_id": "recXXXXXXXXXXXXXX",
    "old_version": "1.4.2",
    "new_version": "1.5.0",
    "bump_type": "minor"
  }
  ```

`bump_type` is computed in the Airtable script via simple semver compare (or set manually in a single-select field).

## Node-by-node configuration

### Node 1 — Webhook (POST)

- Path: `/webhook/product-version-bump`
- Response mode: `onReceived` (Airtable doesn't need a body back)

### Node 2 — Code: Parse Bump Payload

```js
const body = ($input.first().json.body) || {};
const productId = body.product_id || body.record_id;
const newVersion = body.new_version;
const bumpType = (body.bump_type || '').toLowerCase();
if (!productId) throw new Error('Missing product_id');
if (!newVersion) throw new Error('Missing new_version');
if (!['patch','minor','major'].includes(bumpType)) throw new Error('Invalid bump_type: ' + bumpType);
return [{ json: { product_record_id: productId, old_version: body.old_version || '', new_version: newVersion, bump_type: bumpType, is_silent: bumpType === 'patch' } }];
```

### Node 3 — Switch: Route by Bump Type

- Output `notify` → `is_silent === false` (minor/major)
- Output `silent` → `is_silent === true` (patch)

### Node 4 — NoOp Silent Patch

Patch bumps end here — no email, no Slack, no history entry. Comment for future analytics: log to Metrics if needed.

### Node 5 — Airtable Get Product

By record id. Loads SKU, Name, Download URL, Changelog.

### Node 6 — Code: Build Product Context

Normalizes fields and computes a default download link if not set:

```js
const product = $input.first().json;
const bump = $node['Parse Bump Payload'].json;
const f = product.fields || {};
return [{ json: {
  product_record_id: product.id,
  product_sku: f['SKU'] || '',
  product_name: f['Name'] || 'your STR Ledger template',
  download_link: f['Download URL'] || ('https://thestrledger.com/account/downloads/' + (f['SKU'] || '')),
  changelog: f['Changelog'] || '',
  old_version: bump.old_version,
  new_version: bump.new_version,
  bump_type: bump.bump_type
} }];
```

### Node 7 — Airtable Search Customers

- Filter formula: `FIND('<sku>', ARRAYJOIN({Purchased SKUs} & '')) > 0`
- Returns every customer whose linked Orders contain this product SKU.

### Node 8 — SplitInBatches (1) — Per-customer loop

### Node 9 — HTTP: IS Transactional Send (cred id `2`)

- POST `{{ $env.IS_API_BASE_URL }}/api/transactional/send`
- Body: `{ template_id: 'template-update-notification', to, contact_id, variables: { first_name, product_name, new_version, old_version, bump_type, download_link, changelog } }`

### Node 10 — Airtable Update Customer (Notification history)

Appends new line to `Notification history` long-text field:

```
2026-04-27T15:32:11.412Z | Cleaning Tracker v1.5.0 (minor)
```

(Long-text field; we append rather than overwrite. If `Notification history` migrates to a linked-record table later, swap this for a Create-row operation.)

### Node 11 — NoOp loop-back to Split Customers

### Node 12 — Code: Aggregate Sent Count

Collects loop output and computes `customers_notified`.

### Node 13 — Slack `#str-platform-content` confirmation

`📢 W22: N customers notified about <product> v<new> (<bump_type> bump).`

### Error branch (Build → Log → Slack — cred `1`/`3`)

Standard envelope. IS send failures route here per-customer; loop continues.

## Inputs

- Webhook payload from Airtable automation
- Airtable Products + Customers rows

## Outputs

- IS transactional emails sent
- Airtable Customers `Notification history` updated
- Slack `#str-platform-content` summary

## Dependencies

- Airtable Customers must have `Purchased SKUs` lookup/rollup field listing every SKU ever purchased.
- IS transactional template `template-update-notification` exists with required variable slots.
- Airtable automation on Products table calls webhook with correct payload.
- W01–W04 must be live so `Purchased SKUs` is accurate.

## Edge cases

| Case | Handling |
|---|---|
| `bump_type=patch` | Silent NoOp; nothing sent |
| Invalid `bump_type` | Throws → error envelope |
| Product not found | Airtable Get error → envelope; Airtable automation should never fire for non-existent ID |
| 0 customers purchased | Loop runs 0 times; aggregate posts `0 customers notified` |
| Customer has no `IS contact ID` | IS API still accepts `to: email`, `contact_id: null`; works |
| IS API 4xx for one customer | Error envelope logs; loop continues to next |
| Customer purchased product but later refunded | Currently included (covered by `Purchased SKUs` rollup) — may need filter `Refund status != full` in future iteration |
| Webhook fired twice for same bump | Sends emails twice; mitigation: Airtable automation should debounce / use status field |
| Notification history field overflow | Long-text caps at 100k chars; truncate via Airtable automation if approaching |
| New version pushed before customers notified for previous | Each fires independently; history shows full sequence |

## Test cases

1. **Patch bump (silent):** post `{ bump_type: 'patch' }` → workflow exits at Switch; no email sent.
2. **Minor bump, 3 customers:** post valid payload → 3 IS emails, 3 history appends, Slack `3 customers notified`.
3. **Major bump, 0 customers:** product never sold → Slack `0 customers notified`.
4. **Missing product_id:** webhook with empty body → error envelope, Slack alert.
5. **IS API outage:** mock 500 → per-customer error envelope; remaining customers still processed.
6. **Customer with no IS contact ID:** legacy customer → email still sent via `to:` only.
7. **Duplicate webhook:** fire twice → both runs send (caller responsible for debounce — documented).

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Webhooks received | matches Product version bumps | mismatch = automation broken |
| Notifications sent / customer count | 100% | < 95% = IS API issues |
| Open rate (template) | > 30% | < 10% = subject line / sender problem |
| Errors per run | 0 | > 5% of customers = pause + investigate |

## Deployment

1. Import `W22-template-update-notification.json`.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_PRODUCTS`, `TABLE_ID_CUSTOMERS`, `TABLE_ID_ERRORS`.
3. Configure credentials `1` (Airtable), `2` (IS), `3` (Slack).
4. Set env: `IS_API_BASE_URL`.
5. Build IS transactional template `template-update-notification` with vars: `first_name`, `product_name`, `new_version`, `old_version`, `bump_type`, `download_link`, `changelog`.
6. Build Airtable automation on Products: when Version changed → Run script: compute `bump_type` via semver compare → POST to `https://n8n.thestrledger.com/webhook/product-version-bump`.
7. Activate workflow.
8. Test with one canary product + one canary customer before pointing at full base.

## Iteration log

- `2026-04-27` — Initial spec + JSON. Unimplemented in production.
