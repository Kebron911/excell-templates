# Can You Bulk-Upload 70 Products to InfluencerSoft via API?

**Short answer: YES — but it requires API 1.0 with HMAC signing, not the simpler API 2.0.**

---

## API Capability Summary

### What API 2.0 offers (contact/order focus)
- **Does NOT support product creation.** API 2.0 has `getgoods` (read-only) but no `AddGood`, `UpdateGood`, or `DeleteGood` endpoints.
- API 2.0 is designed for contact/CRM operations and order creation using *existing* products.
- Product creation is UI-only in API 2.0.

### What API 1.0 offers (includes product CRUD)
- **`AddGood` endpoint:** Create new products via `POST /api/AddGood`.
- **`UpdateGood` endpoint:** Modify existing products.
- **`DeleteGood` endpoint:** Remove products.
- **`GetAllGoods` endpoint:** List all products.
- Requires **HMAC-SHA1 signing** (`hash` parameter) on every request.

---

## API 1.0 AddGood Endpoint

**URL:** `http://username.influencersoft.com/api/AddGood`

**HTTP method:** POST

**Content-Type:** `application/x-www-form-urlencoded`

**Authentication:** HMAC-signed via `hash` parameter (see Authentication section below).

### Required parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `good_name` | string | Product ID (must be unique per account). |
| `good_type` | int | `1` = physical, `0` = digital. |
| `good_title` | string | Product display name (what customers see). |
| `good_sum` | number | Price (supports decimals). |
| `hash` | string | HMAC signature (required on every call). |

### Optional parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `parent_id` | int | Category ID (must exist in UI first). |
| `good_api_url_notif` | string | Webhook URL when bill is paid. |
| `good_api_url_new_order` | string | Webhook URL when invoice created. |
| `good_success_link` | string | Redirect URL after successful payment. |
| `good_client_rassilki` | string | Comma-separated group IDs to auto-join after purchase. |
| `good_nalozh_only` | int | COD-only flag (physical goods): `0`/`1`. |

### Response (JSON)
```json
{
  "error_code": 0,
  "error_text": "ok",
  "result": { "good_id": 75696 },
  "hash": "..."
}
```

On success: `result.good_id` = new product ID.
Error code `0` = success. See error code table below for failures.

---

## Authentication: HMAC Signing

Every API 1.0 call requires a signed `hash` parameter.

**Hash formula (MD5):**
```
hash = md5( urlencode(params) . "::" . username . "::" . secret_key )
```

Where:
- `urlencode(params)` = URL-encoded POST body of all fields *except* `hash`.
- `username` = InfluencerSoft account login (e.g., `kebron`).
- `secret_key` = API secret key (found at `https://{username}.influencersoft.com/shops/setts/apisettings/` under "Secret key for signing").

**Example (JavaScript):**
```javascript
const crypto = require('crypto');

function generateHash(params, username, secretKey) {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${encodeURIComponent(params[k])}`)
    .join('&');
  
  const toSign = `${sorted}::${username}::${secretKey}`;
  return crypto.createHash('md5').update(toSign).digest('hex');
}

const product = {
  good_name: 'str-ledger-core',
  good_type: 0,  // digital
  good_title: 'STR Ledger — Complete Host Tax System',
  good_sum: 297,
  parent_id: 5
};

product.hash = generateHash(product, 'kebron', 'your-secret-key-here');

// POST to https://kebron.influencersoft.com/api/AddGood with product data
```

---

## Bulk Upload Strategy: 70 Products

### Step 1: Prepare product CSV/JSON
Organize your 70 products:
```csv
good_name,good_title,good_type,good_sum,parent_id,good_success_link
str-ledger-core,STR Ledger Core,0,297,1,https://yourdomain.com/success
str-ledger-pro,STR Ledger Pro,0,497,1,https://yourdomain.com/success
...
```

### Step 2: Write bulk-upload script
**Pseudocode:**
```javascript
const products = loadCSV('products.csv');

for (const product of products) {
  // Add hash
  product.hash = generateHash(product, ACCOUNT, SECRET);
  
  // POST to API
  const response = await fetch(
    `https://${ACCOUNT}.influencersoft.com/api/AddGood`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(product).toString()
    }
  );
  
  const json = await response.json();
  
  // Verify hash on response
  const expectedHash = md5(
    `${json.error_code}::${json.error_text}::${SECRET}`
  );
  if (json.hash !== expectedHash) {
    console.error('Response signature mismatch — possible forgery');
  }
  
  if (json.error_code === 0) {
    console.log(`✓ Created: ${product.good_name} (ID: ${json.result.good_id})`);
  } else {
    console.error(`✗ Failed: ${product.good_name}`, json.error_text);
  }
  
  // Throttle: ~1 req/sec to avoid rate-limit blocks
  await sleep(1000);
}
```

### Step 3: Integration paths
**Option A: Standalone Node.js script**
- Simplest. Run once: `node bulk-upload.js`
- Output: CSV of product IDs for reference.

**Option B: n8n workflow**
- Reusable. Loop node → HTTP node (AddGood) → log results.
- Can be triggered from dashboard or scheduled.

**Option C: During contact import (advanced)**
- Use `good_client_rassilki` parameter to auto-enroll buyers in groups as they purchase.

---

## Critical Gotchas

1. **Categories must exist first.** If you pass `parent_id=5`, category ID 5 must already be created in the UI. No `AddCategory` endpoint.

2. **Rate limits unknown but conservative.** Source docs are silent, but InfluencerSoft warns: "If we find signs of over-clocking, we reserve the right to block the account." **Throttle to ~1 request/sec.**

3. **Hash verification on responses.** Always verify the response `hash` to ensure the response wasn't forged:
   ```
   expected_hash = md5( error_code . "::" . error_text . "::" . secret_key )
   ```

4. **No batch endpoint.** Each product requires one API call. 70 products = ~70 seconds at 1 req/sec.

5. **Stripe integration doesn't affect product creation.** The API is independent of payment gateways — Stripe is configured in the UI separately. Once products exist and Stripe is wired, orders work automatically.

6. **Product IDs (good_name) must be unique.** If you try to create a product with a `good_name` that already exists, you'll get an error. Pick a naming convention early (e.g., `product-001`, `product-002`, ..., or `sku-12345`).

---

## Error Codes (AddGood)

| Code | Meaning |
|------|---------|
| 0 | Success (`ok`). |
| 1 | `hash` not transferred. |
| 2 | No parameters transmitted. |
| 3 | Wrong parameters. |
| 4 | Incorrect `hash` (signature mismatch). |
| 5 | Invalid username. |
| 6 | Permission denied for IP. |
| 7 | Account disabled. |

Source: API 1.0 general error codes. Product-specific codes not documented in source articles.

---

## Recommended Action Plan

1. **Gather Stripe confirmation:** Confirm Stripe integration is UI-ready (to avoid questions later).
2. **Collect secret key:** Visit `https://kebron.influencersoft.com/shops/setts/apisettings/` and copy the "Secret key for signing."
3. **Create categories in UI:** If your 70 products belong to categories, create them first (e.g., "Templates," "Tools," "Bundles").
4. **Prepare CSV:** Name, title, type (digital=0 or physical=1), price, category ID.
5. **Write/run bulk script:** Node.js or n8n loop.
6. **Verify:** Sample 5–10 products in the UI to confirm creation.
7. **Cache product IDs:** Once done, save the returned `good_id` values for use in order creation via `createorder` (API 2.0).

---

## Timeline

- **Prep & script:** 1–2 hours.
- **Bulk upload:** ~70 seconds (70 products × 1 sec/req).
- **Verification:** 15 min.

**Total:** ~2–3 hours, one-time effort.

---

## References

- API 1.0 AddGood: Source article ID 360050671852.
- API 2.0 createorder (to sell the products): Section §2 above.
- API keys: `https://kebron.influencersoft.com/shops/setts/apisettings/`.
- API Probe findings: `/ops/influencersoft-api-probe.md` (confirmed on 2026-05-11).
