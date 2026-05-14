# InfluencerSoft Bulk Product Upload via API — Complete Guide

## TL;DR

**Yes, you can bulk-upload 70 products via API.** InfluencerSoft's `AddGood` endpoint (API 1.0) supports product creation. No native batch endpoint exists, but looping with rate-limiting (1 req/sec) takes ~2 minutes for 70 products. Your Stripe integration doesn't auto-sync IDs — that's manual.

---

## Quick Path Forward

1. **Retrieve API 1.0 secret** from `https://kebron.influencersoft.com/shops/setts/apisettings/`
2. **Use the HMAC wrapper** below to POST each product to `AddGood`
3. **Loop 70 products** (no native batch endpoint) with rate-limiting (~1 req/sec max, conservative)
4. **Test with 1 canary product first** — no sandbox, production-only

---

## API Capability Matrix

| Capability | Endpoint | API Version | Auth | Status |
|---|---|---|---|---|
| **List products** | `GetGoods` | 2.0 | `rpsKey` | ✅ Works (confirmed 2026-05-11) |
| **Create product** | `AddGood` | 1.0 | HMAC hash | ✅ Available |
| **Delete product** | `DeleteGood` | 1.0 | HMAC hash | ✅ Available |
| **Bulk upsert** | N/A | — | — | ❌ Not natively supported |

---

## How to Implement

### Step 1: Get Your API 1.0 Secret

Go to `https://kebron.influencersoft.com/shops/setts/apisettings/` and retrieve the **API 1.0 secret** (different from `rpsKey`). Store it in `.env`:

```
INFLUENCERSOFT_API_SECRET=your_api_1_0_secret_here
```

### Step 2: Build the HMAC Wrapper

Use this function to sign each product before posting:

```javascript
const crypto = require('crypto');

function signAddGoodPayload(product, apiSecret) {
  // Build the payload with IS field names
  const fields = {
    product_name: product.name,
    product_price: String(product.price),
    product_description: product.description || '',
    // Add other fields as needed:
    // product_image: product.imageUrl,
    // product_quantity: product.quantity,
  };

  // Sort alphabetically (IS requirement for hash computation)
  const sorted = Object.keys(fields)
    .sort()
    .map(k => `${k}=${encodeURIComponent(fields[k])}`)
    .join('&');

  // Compute HMAC-SHA256
  const hash = crypto
    .createHmac('sha256', apiSecret)
    .update(sorted)
    .digest('hex');

  return {
    ...fields,
    hash: hash,
  };
}

// Usage:
const payload = signAddGoodPayload(
  { name: 'Product 1', price: 99.99, description: 'My first product' },
  process.env.INFLUENCERSOFT_API_SECRET
);
console.log(payload);
// Output: { product_name: 'Product 1', product_price: '99.99', product_description: '...', hash: '...' }
```

### Step 3: POST Each Product

```javascript
const https = require('https');
const querystring = require('querystring');

async function createProduct(productData, apiSecret) {
  const payload = signAddGoodPayload(productData, apiSecret);
  
  // Convert to form-urlencoded
  const body = querystring.stringify(payload);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'kebron.influencersoft.com',
      path: '/api/AddGood',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const result = JSON.parse(data);
        if (result.error_code === 0) {
          resolve(result);
        } else {
          reject(new Error(`IS error: ${result.error_text}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
```

### Step 4: Batch Upload with Rate Limiting

```javascript
async function bulkUploadProducts(csvArray, apiSecret, delayMs = 1000) {
  const results = [];
  
  for (let i = 0; i < csvArray.length; i++) {
    try {
      console.log(`[${i + 1}/${csvArray.length}] Uploading ${csvArray[i].name}...`);
      const result = await createProduct(csvArray[i], apiSecret);
      results.push({ success: true, product: csvArray[i].name, result });
      
      // Rate limit: wait 1 second between requests
      if (i < csvArray.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`[${i + 1}/${csvArray.length}] FAILED: ${error.message}`);
      results.push({ success: false, product: csvArray[i].name, error: error.message });
    }
  }
  
  return results;
}

// Load your 70 products from CSV/JSON and call:
// const results = await bulkUploadProducts(products, process.env.INFLUENCERSOFT_API_SECRET);
```

---

## What Your Stripe Integration Doesn't Handle

- **Product ID mapping:** Stripe product IDs ≠ InfluencerSoft product IDs. You must maintain a separate CSV mapping or database table.
- **Field translation:** Stripe fields (SKU, metadata) don't automatically map to IS fields (product_name, product_description). Custom logic required.
- **Webhook sync:** Stripe webhooks won't auto-update IS. Consider building a webhook handler if you modify products in Stripe.

---

## Important Gotchas

1. **API 1.0 is legacy.** API 2.0 (with `rpsKey`) lacks product create/delete endpoints.
2. **Hash computed over alphabetically sorted fields.** Any field order error causes silent or cryptic 400 errors.
3. **No sandbox.** First call hits production. Start with 1 test product.
4. **No rate-limit documentation.** Conservative: ~1 req/sec. Add exponential backoff for 429 responses.
5. **Field names matter.** Use exact IS names: `product_name`, `product_price`, `product_description`, etc.
6. **Stripe ↔ IS product ID sync is manual.** The two systems don't auto-sync — maintain a mapping CSV.

---

## Testing Checklist

- [ ] Retrieve API 1.0 secret from admin panel
- [ ] Store in `.env` (not hardcoded)
- [ ] Test HMAC signing with 1 sample product
- [ ] POST canary product to `AddGood` (production, no rollback)
- [ ] Verify product appears in Store dashboard
- [ ] Update product-ID mapping spreadsheet
- [ ] Batch remaining 69 products with 1s delays
- [ ] Log all error responses for debugging
- [ ] Monitor dashboard for duplicates or malformed entries

---

## Alternative: UI CSV Import (Unconfirmed)

InfluencerSoft *may* support CSV import via the Store module UI. Not confirmed as of 2026-05-14. Check Module 9 (Store) in the admin panel — look for "Import Products" or "Bulk Upload" buttons.

---

## Alternative: n8n Workflow (For Recurring Sync)

If you want to **auto-sync products weekly** from Google Sheets/Airtable:

1. Create an n8n HTTP node calling `AddGood` with HMAC signature
2. Wire to a sheet watch trigger → parse rows → loop → call IS
3. No manual copy-paste after initial setup
4. Can run on a schedule

---

## Resources

- **API probe:** `./.claude/worktrees/compassionate-morse-2f84c5/ops/influencersoft-api-probe.md` (lines 58-66 for product endpoints)
- **InfluencerSoft modules map:** `./.claude/skills/influencersoft/modules.md` (Module 11 = Integrations & API)
- **Your tenant:** `kebron.influencersoft.com`
- **API base:** `https://kebron.influencersoft.com/api/{Method}`

---

## Next Steps

1. **Retrieve API 1.0 secret** → update `.env`
2. **Copy the HMAC wrapper** into your project
3. **Test with 1 canary product** → confirm in dashboard
4. **Batch the remaining 69** with rate limiting
5. **Monitor for errors** — log all responses
6. **Update product-ID map** if Stripe integration needs it

Good to go.
