# W02 — Order Ingestion (Gumroad)

**Priority:** P0

**Family:** B — Customer data unification

**Summary:** Receives Gumroad "Ping" webhook on sale or refund; writes Customer + Order to Airtable; tags IS contact.

---

## Trigger

HTTP POST webhook: `https://n8n.<domain>/webhook/order-gumroad`

Configured in **Gumroad → Settings → Advanced → Ping URL**. Gumroad does NOT send per-event webhooks like Stripe; it sends a "ping" on every sale with all sale data in the body. Shared-secret authentication (not signature-based).

## Node-by-node configuration

### Node 1 — Webhook (POST)

- **Path:** `/webhook/order-gumroad`
- **Method:** POST
- **Content-Type:** `application/x-www-form-urlencoded` (Gumroad sends form-encoded, not JSON)
- **Response mode:** Respond immediately with 200

### Node 2 — Function: Verify Shared Secret

Gumroad includes a `seller_id` in the payload. If you've configured a shared secret in Gumroad settings, it also includes it as a custom field. Verify:

```js
const body = $input.body;
const expectedSellerId = $env.GUMROAD_SELLER_ID;
const expectedSecret = $env.GUMROAD_SHARED_SECRET;

if (body.seller_id !== expectedSellerId) {
  throw new Error('Gumroad seller_id mismatch');
}

// If you configured a shared secret in Gumroad's ping URL (append ?secret=XXX to the URL)
if ($input.query?.secret !== expectedSecret) {
  throw new Error('Gumroad shared secret mismatch');
}

return body;
```

**Note:** Gumroad's ping webhook is not cryptographically signed. Adding the secret as a URL query parameter is the standard mitigation. Treat Gumroad webhooks with slightly more skepticism and always validate `seller_id`.

### Node 3 — Switch by event type

Gumroad pings have a `resource_name` field:
- `sale` → purchase flow
- `refund` → route to W07
- `dispute` → route to W07 (chargeback handling)
- `cancellation` → subscription cancel flow (Phase 2)

### Node 4 — Function: Normalize Payload

```js
const body = $input.body;

const normalized = {
  order_id: `gumroad-${body.sale_id}`,
  gumroad_product_id: body.product_id,
  gumroad_product_permalink: body.product_permalink,
  timestamp: new Date(body.sale_timestamp || Date.now()).toISOString(),
  email: (body.email || '').toLowerCase(),
  first_name: body.full_name?.split(' ')[0] || '',
  full_name: body.full_name || '',
  gross_amount: parseInt(body.price) / 100,  // Gumroad sends in cents
  currency: body.currency || 'usd',
  platform: 'gumroad',
  sku: body.sku || body.variants_and_quantity?.split(':')[0] || null,
  // Gumroad platform fee = 10% + $0.30
  platform_fee: (parseInt(body.price) / 100) * 0.10 + 0.30,
  ip_country: body.ip_country || null,
  referrer: body.referrer || null,
  test_mode: body.test === 'true',
  raw_payload: JSON.stringify(body).slice(0, 5000)
};

// Skip test-mode transactions — Gumroad sends these during product setup
if (normalized.test_mode) {
  throw new Error('Test-mode transaction, skipping');
}

return normalized;
```

### Node 5 — Function: Resolve SKU from Gumroad product

If `sku` is null, map via `gumroad_product_id` to Airtable Products table:

```js
// Fetch Products from Airtable filtered by Gumroad product ID
// Set normalized.sku to the matching SKU, or null if no match
```

If no match found, write to Errors table and still create Order with empty Product link (so sale isn't lost).

### Node 6 — Airtable: Find or Create Customer

Same pattern as W01 Node 5.

**Default `Acquisition source` for Gumroad customers:** `gumroad` (override in follow-up workflows if UTM or referral data available).

### Node 7 — Airtable: Create Order

- **Order ID:** `{{ $json.order_id }}`
- **Platform:** `gumroad`
- **Gross amount:** `{{ $json.gross_amount }}`
- **Platform fee:** `{{ $json.platform_fee }}`
- **Net amount:** formula field auto-computes
- **Product:** link via SKU lookup
- **Raw webhook payload:** truncated payload for audit

**OrderBump / OTO:** Gumroad doesn't natively support OrderBumps or post-purchase OTOs like IS does. If you run Gumroad "bundles" they come through as separate ping events — each handled independently.

### Node 8 — IS API: Tag Contact

- Add tags: `product:<sku>`, `source:gumroad`, `bought:<YYYY-MM-DD>`, `platform:gumroad`
- Persona inference same as W01

### Node 9 — Slack notification (conditional, same as W01)

Only fires for first 100 Gumroad sales.

### Node 10 — Success response

HTTP 200 with `{"status": "processed"}`

### Error branch

Same pattern as W01:
- Write to Errors
- Slack alert
- Retry with exponential backoff
- Respond 500 to Gumroad (Gumroad retries automatically on 5xx)

## Inputs

- Gumroad ping payload (form-encoded)
- Environment: `GUMROAD_SELLER_ID`, `GUMROAD_SHARED_SECRET`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `IS_API_KEY`

## Outputs

- Airtable Customer row (upserted)
- Airtable Order row
- IS contact tagged

## Dependencies

- Airtable Products rows exist with `Gumroad product ID` populated for live products
- IS API accessible
- Gumroad ping URL configured as `https://n8n.<domain>/webhook/order-gumroad?secret=<shared_secret>`

## Edge cases

| Case | Handling |
|---|---|
| Test-mode sale | Skip at Node 4; do not create rows |
| SKU missing from payload + no Airtable mapping | Log Errors, create Order with empty Product link |
| Duplicate ping (Gumroad retries) | Order ID upsert dedupes |
| Gumroad "Pay what you want" price | Accept actual paid amount as gross |
| Refund via ping | Route to W07, do not double-count |
| Affiliate sale | Gumroad includes `affiliate_credit` field — capture separately if populated |

## Test cases

1. **Standard sale, Mileage Log, $17** — Customer + Order created, IS tagged
2. **Customer already has Stripe purchase** — Customer upserts, new Order on gumroad platform
3. **Test-mode transaction** — skipped, no rows created
4. **Unknown SKU** — Order created with empty Product, Errors row logged
5. **Shared secret mismatch** — 401, no writes
6. **Refund** — routed to W07, no Order duplication

## Monitoring

Same metrics as W01 with Gumroad scope.

## Deployment

1. Create workflow, configure credentials
2. In Gumroad: Settings → Advanced → Ping URL → paste `https://n8n.<domain>/webhook/order-gumroad?secret=<your_secret>`
3. Test: make a real $1 purchase in Gumroad test mode → verify Airtable writes
4. Enable live mode → verify production sale creates Airtable row within 60s
5. Export to JSON, commit

## Iteration log

- `2026-04-22` — Initial spec. Unimplemented.
