# W05 — Product Publisher

**Priority:** P0

**Family:** A — Catalog sync

**Summary:** When a product in Airtable transitions to `Status = Published`, push it to every configured storefront (IS, Gumroad, Payhip, Etsy draft).

---

## Trigger

Airtable automation: "When record matches conditions" → call n8n webhook at `https://n8n.thestrledger.com/webhook/product-publish`.

**Conditions:**
- Table: Products
- `Status` = `Published`
- AND at least one of `Live on IS`, `Live on Gumroad`, `Live on Payhip`, `Live on Etsy` is unchecked (i.e., still needs to be published somewhere)

**Payload sent by Airtable:**
```json
{
  "record_id": "recXXXXXXXXXXXXXX",
  "sku": "TAX-001",
  "triggered_by": "status_change"
}
```

## Node-by-node configuration

### Node 1 — Webhook (POST)

Path: `/webhook/product-publish`

Simple basic-auth via shared secret in query param (Airtable automations pass this).

### Node 2 — Airtable: Fetch Full Product Record

Given `record_id`, fetch all Product fields:

- SKU, Name, Category, Tier, Status
- All descriptions (short, full)
- All price columns
- All file attachments (master, lite, thumbnail, preview images, companion PDF)
- All `Live on *` checkboxes + all platform IDs
- Tags, persona

### Node 3 — Function: Build platform-agnostic product object

```js
const rec = $input.all()[0].json.fields;

const product = {
  sku: rec.SKU,
  name: rec.Name,
  short_description: rec['Short description'],
  full_description: rec['Full description'],
  tags: rec.Tags || [],
  category: rec.Category,
  tier: rec.Tier,

  prices: {
    own_site: rec['Price — own site'],
    etsy: rec['Price — Etsy'],
    etsy_lite: rec['Price — Etsy Lite'],
    gumroad: rec['Price — Gumroad'],
    payhip: rec['Price — Payhip']
  },

  files: {
    master: rec['Master file']?.[0]?.url,
    lite: rec['Lite file']?.[0]?.url,
    thumbnail: rec.Thumbnail?.[0]?.url,
    preview_images: (rec['Preview images'] || []).map(a => a.url),
    companion_pdf: rec['Companion PDF']?.[0]?.url
  },

  platform_status: {
    is: { live: rec['Live on IS'], id: rec['IS product ID'] },
    gumroad: { live: rec['Live on Gumroad'], id: rec['Gumroad product ID'] },
    payhip: { live: rec['Live on Payhip'], id: null },
    etsy: { live: rec['Live on Etsy'], id: rec['Etsy listing ID'] }
  },

  airtable_record_id: $input.all()[0].json.id
};

return product;
```

### Node 4 — Switch: route to per-platform sub-flows

For each platform where `live = false`, route to the corresponding sub-flow.

Platforms run in **parallel branches** (independent failure) — use n8n's "Merge" node downstream to collect results.

### Sub-flow: Publish to IS

1. **IS API** — Create product endpoint (actual endpoint name depends on IS's API — placeholder: `POST /api/products`)
   - Body: `{ name, description, price: prices.own_site, thumbnail_url, file_url: files.master, tags }`
2. **Function** — parse response, extract IS product ID
3. **Airtable** — update Product row: `Live on IS = true`, `IS product ID = <id>`, `Last updated = now`

**Fallback if IS has no API:** dispatch to Playwright workflow (see W05-fallback-playwright.md if created) — log in via browser, click through product-create UI. Fragile but functional.

### Sub-flow: Publish to Gumroad

1. **Gumroad API** — `POST /api/v2/products`
   ```
   {
     "name": product.name,
     "price": product.prices.gumroad * 100,  // Gumroad uses cents
     "description": product.full_description,
     "url": "<slug from sku>",
     "customizable_price": false
   }
   ```
2. **Gumroad API** — `PUT /api/v2/products/<id>/files` to attach the master file
3. **Gumroad API** — `PUT /api/v2/products/<id>/variants` if variants needed
4. **Airtable** — update `Live on Gumroad = true`, `Gumroad product ID = <id>`

### Sub-flow: Publish to Payhip (Phase 2)

- Similar API pattern to Gumroad
- Skip for Phase 1 — `Live on Payhip` stays false until Phase 2 activation

### Sub-flow: Publish to Etsy (draft-only)

Etsy's API v3 supports listing creation, but the approval flow is manual-friendly. This sub-flow **creates a draft listing** and emails Daniel to review + publish.

1. **Etsy API** — `POST /v3/application/shops/{shop_id}/listings/drafts`
   ```
   {
     "quantity": 999,
     "title": <keyword-optimized title from Airtable>,
     "description": full_description,
     "price": prices.etsy_lite || prices.etsy,
     "who_made": "i_did",
     "when_made": "made_to_order",
     "taxonomy_id": <digital download taxonomy ID — research once>,
     "type": "download",
     "shipping_profile_id": null
   }
   ```
2. **Etsy API** — upload files (Lite variant, thumbnails, preview images)
3. **Airtable** — update `Etsy listing ID = <id>` (but `Live on Etsy` stays false until Daniel publishes)
4. **Email Daniel** — "Draft Etsy listing for `<sku>` ready for review at <Etsy listing URL>. Click publish when ready."

### Node 5 — Merge sub-flow results

After all platform branches complete, aggregate success/failure results.

### Node 6 — Airtable: Update Last-Sync timestamps

Record which platforms succeeded and which need retry.

### Node 7 — Slack notification

"Product `<sku>` published to: IS ✅, Gumroad ✅, Etsy draft ✅. Payhip skipped (Phase 2)."

### Error branch (per sub-flow, not workflow-wide)

Each platform sub-flow has its own error handler:
- Log to Errors with specifics
- Continue with other platforms (don't cascade failures)
- Mark that platform as needing retry in Airtable

## Inputs

- Airtable automation webhook with `record_id`
- Environment: `IS_API_KEY`, `GUMROAD_API_KEY`, `ETSY_API_KEY`, `ETSY_SHOP_ID`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

## Outputs

- Products live on IS + Gumroad (+ Etsy draft awaiting Daniel)
- Airtable Products row updated with platform IDs + live flags
- Daniel email notification for Etsy draft review

## Dependencies

- Product file attachments must be set in Airtable (master, thumbnail, preview, companion PDF)
- All prices populated
- Product descriptions finalized

## Edge cases

| Case | Handling |
|---|---|
| File attachment missing | Platform sub-flow fails gracefully, logged in Errors with specific file missing |
| API rate limit hit | Exponential backoff retry, max 3 attempts |
| Platform returns 409 "already exists" | Update instead of create (call W06 logic) |
| Description exceeds platform max length | Truncate with "... see full version at thestrledger.com" |
| Price = 0 or null | Reject publish, Slack alert "Cannot publish <sku> — price missing" |
| Thumbnail missing | Use placeholder brand thumbnail, log warning |

## Test cases

1. **New product, all platforms targeted** — check all sub-flows fire, Airtable IDs populated
2. **Retry after partial failure** — one platform failed on first attempt; retry completes missing platforms
3. **File too large for IS** — sub-flow captures platform-specific size limit error
4. **Duplicate SKU on Gumroad** — sub-flow recognizes and routes to update logic
5. **Etsy category mapping unknown** — Etsy sub-flow requires taxonomy_id; config table lookup if missing

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Publish success rate per platform | > 95% | < 90% = investigate platform API |
| Time from Airtable trigger to all platforms live | < 2 min | > 10 min = investigate |
| Etsy draft review turnaround (Daniel) | < 24 hrs | > 48 hrs = ping Daniel |

## Deployment

1. Configure per-platform API credentials in n8n
2. Research Etsy `taxonomy_id` for digital downloads — store in config or hardcode
3. Build sub-flows one at a time; test each in isolation with staging base
4. Activate Airtable automation
5. Test end-to-end with a draft test product
6. Export workflow JSON, commit

## Iteration log

- `2026-04-22` — Initial spec. Unimplemented.
