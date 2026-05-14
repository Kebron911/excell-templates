# Bulk Product Upload via InfluencerSoft API

## Yes, bulk upload is possible—but with a critical blocker right now

### The Answer

InfluencerSoft exposes an **API 1.0 endpoint called `AddGood`** designed for programmatic product creation. For ≥5 products, use `infrastructure/influencersoft/push_products.js` (an idempotent script already built and ready to run once the endpoint is enabled).

### Critical Blocker: AddGood is Disabled on the Kebron Tenant

**As of 2026-05-08, the `AddGood` endpoint returns `error_code 2` (endpoint disabled) on the kebron tenant.** This is a per-account gate controlled by InfluencerSoft support—it's not a code issue.

**You must take one of these steps:**

1. **Email support@influencersoft.com** requesting `AddGood` endpoint activation for the kebron tenant.
2. **Raise it at the weekly Tech Tuesday mentoring call** (included with all plans; see plans-and-support.md for timing). Usually enabled within a day.

### Once AddGood is Enabled

The bulk-upload script (`push_products.js`) is ready to use. It handles:

- **Idempotent state tracking** — safe to re-run without duplication
- **MD5 hash authentication** (the correct algorithm; standard HMAC-SHA256 will fail)
- **Batch product creation** with all SKU, pricing, and variant data

**Hash algorithm warning:** The script uses MD5 (not HMAC), computed as:
```
MD5(buildQuery(params) + "::" + username + "::" + apikey)
```
with PHP-style URL encoding (spaces → `+`, not `%20`). The full implementation is already in the script—don't re-derive it.

### API Method Details

- **Endpoint:** `https://kebron.influencersoft.com/api/AddGood` (API 1.0)
- **Auth:** `rpsKey=<INFLUENCERSOFT_API_KEY>` in POST body
- **Content-Type:** `application/x-www-form-urlencoded`
- **Response:** `{error_code:0, error_text:"OK", result:[...], hash:"..."}`
- **Rate limit:** ≤0.9 req/sec (1100ms between calls; enforced in client lib)

### Why Not UI?

- UI is fine for <5 products (Store → Products → Add Product)
- For 70 products, bulk API + script = automated, repeatable, idempotent

### Stripe Integration

Stripe is already wired in. Once products are created via `AddGood`, they're available in the InfluencerSoft Store for Stripe checkout funnels.

### Next Steps

1. **Email or ping Tech Tuesday to request AddGood enablement** (include the kebron tenant, provide your use case: 70-product catalog)
2. **Once enabled:** Run `scripts/push_products.js` with your product CSV/JSON data
3. **Verify:** Use the InfluencerSoft Store UI or call `GetGoods` API to confirm all 70 products appear

### References

- API quick reference: `api-quickref.md` §3 (API 1.0 + hash algorithm)
- Bulk script: `infrastructure/influencersoft/push_products.js`
- Full endpoint matrix: `ops/influencersoft-api-probe.md`
- Support / Tech Tuesday: `plans-and-support.md`
