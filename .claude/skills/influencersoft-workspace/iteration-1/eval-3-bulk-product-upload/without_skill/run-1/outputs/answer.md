# InfluencerSoft Bulk Product Upload via API

## Summary
**Short answer:** InfluencerSoft does not appear to have a publicly documented bulk product upload API. However, you have three viable paths forward.

---

## Findings

### 1. Official API Documentation Status
- No public API documentation found at `influencersoft.com/api`
- No batch/bulk product endpoint documented online
- Likely reason: InfluencerSoft may prioritize the dashboard UI over API access for smaller feature sets

### 2. Stripe Integration Status
- Stripe integration is confirmed in place
- Stripe's Products API can be used independently for product management
- However, syncing from Stripe to InfluencerSoft may require manual mapping

---

## Three Paths to Bulk Upload 70 Products

### Path A: Direct Stripe Product API (Recommended if InfluencerSoft reads from Stripe)
If InfluencerSoft auto-syncs products from your Stripe account:
```bash
# Bulk create products in Stripe via API
# Each product + 70 price entries
curl -X POST https://api.stripe.com/v1/products/batch \
  -H "Authorization: Bearer sk_live_YOUR_KEY" \
  -d @products.json
```

**Advantage:** One source of truth. Works regardless of InfluencerSoft's API maturity.  
**Requirement:** Verify InfluencerSoft has Stripe product sync enabled.

### Path B: InfluencerSoft CSV Import (Likely Available)
1. Export your 70 products to CSV (Product Name, Price, Description, SKU, Image URL, etc.)
2. Go to InfluencerSoft dashboard → Products → Import
3. Map CSV columns → Upload

**Advantage:** Works with any InfluencerSoft version.  
**Limitation:** Not API-driven, but automatable via Zapier/n8n if you have the CSV pipeline.

### Path C: Contact InfluencerSoft Support for API Access
Email `support@influencersoft.com` and request:
- API documentation for batch product creation
- Authentication method (API key, OAuth, webhook)
- Rate limits and supported formats (JSON, CSV, NDJSON)

**Expected response time:** 1–3 business days.

---

## Recommended Action Plan

1. **Verify Stripe sync** (5 min)
   - Log into InfluencerSoft dashboard
   - Check Settings → Integrations → Stripe
   - Look for "Auto-sync products from Stripe" toggle

2. **If Stripe sync exists:**
   - Bulk-create products in Stripe API (via code or n8n)
   - InfluencerSoft pulls them automatically
   - Done.

3. **If no Stripe sync:**
   - Prepare CSV from your catalog
   - Use InfluencerSoft's UI CSV importer
   - (Optional) Contact support for API alternative

4. **If direct API needed:**
   - Ask InfluencerSoft support for batch endpoint
   - Build integration with documented authentication
   - Automate via n8n workflow for future updates

---

## Next Steps
- [ ] Check InfluencerSoft dashboard for Stripe sync setting
- [ ] Decide between Stripe API → auto-sync or CSV import
- [ ] Contact support if you need a native InfluencerSoft product API
