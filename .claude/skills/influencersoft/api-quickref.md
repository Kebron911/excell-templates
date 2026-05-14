# InfluencerSoft API Quick Reference

Cheat sheet for the most-used API surfaces. Full endpoint matrix with parameter
lists, response shapes, and rate-limit notes lives in
[ops/influencersoft-api-probe.md](../../../ops/influencersoft-api-probe.md).
The rate-limited Node.js client is at
[scripts/lib/influencersoft.mjs](../../../scripts/lib/influencersoft.mjs).

## 1. API 2.0 (current — use this by default)

- **Base URL:** `https://kebron.influencersoft.com/api/<Method>`
- **Method names:** PascalCase (lowercase 307-redirects)
- **Auth:** POST body field `rpsKey=<INFLUENCERSOFT_API_KEY>`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Response:** JSON — `{error_code:0, error_text:"OK", result:[...], hash:"..."}`
- **Rate limit:** undocumented; client throttles to 1100ms (~0.9 req/s)

### Primary endpoints (already wrapped in client lib)

| Endpoint | Helper | Purpose |
|---|---|---|
| `AddUpdateLead` | `addUpdateLead(fields)` | Create or update contact (idempotent on email). Can set tags + lists in one call. Primary tool. |
| `AddTagToLead` | `addTagToLead(email, tags)` | Add tag(s) to existing contact. Tags auto-create on first use. |
| `RemoveTagFromLead` | `removeTagFromLead(email, tags)` | Remove tag(s). |
| `GetAllGroups` | `getAllGroups()` | List all groups/lists with IDs (IDs are opaque numerics — resolve via this). |
| `GetGoods` | `getGoods()` | List all products. |
| `GetCoupons` | `getCoupons()` | List all coupons. |
| `CreateOrder` | not yet wrapped | Create order/invoice for a contact. **Irreversible.** |

### Sample call

```js
import { addUpdateLead, addTagToLead } from "../../scripts/lib/influencersoft.mjs";

await addUpdateLead({
  lead_email: "buyer@example.com",
  lead_first_name: "Jane",
  add_tags: "customer:etsy,product:tax-001-mileage-log",
  add_to_lists: "<group_id_from_GetAllGroups>",
});

await addTagToLead("buyer@example.com", ["engaged:opened-e1"]);
```

## 2. Trigger tags → sequences

When you set one of these via `AddUpdateLead` or `AddTagToLead`, the matching
sequence fires. Bound by exact string in IS UI — renaming breaks silently.
**Source of truth:** [tag-dictionary.md §1](../../../infrastructure/influencersoft/tag-dictionary.md).

| Tag | Fires sequence |
|---|---|
| `customer:etsy` | `post-purchase-etsy-buyer` |
| `purchased:day5` | `review-request` |
| `refund-filed` | `refund-recovery` |
| `lead-magnet:welcome-book` | `welcome-book-magnet` |
| `checkout-abandoned` | `abandoned-cart` |
| `inactive-30d` | `win-back` |
| `bundle-cross:first-year-host` | `BUNDLE-01-first-year-host` |
| `bundle-cross:aspiring-host` | `BUNDLE-02-aspiring-host` |
| `bundle-cross:year-2-operator` | `BUNDLE-03-year-2-operator` |
| `bundle-cross:portfolio` | `BUNDLE-04-portfolio` |
| `bundle-cross:pro-manager` | `BUNDLE-05-pro-manager` |

## 3. API 1.0 (legacy — hash auth)

Only use for verbs API 2.0 lacks: `AddGood` (product create), `AddLeadToGroup`
(with UTM + activation-email control), `DeleteSubscribe`, `DeleteOrder`,
`GetCountSubscribers`, `UpdateSubscriberData`.

### Hash algorithm

```
hash = MD5(buildQuery(params) + "::" + username + "::" + apikey)
```

- `buildQuery(params)` = PHP `http_build_query()` style URL-encoded form body
  (sort params, then encode — implementation in
  infrastructure/influencersoft/push_products.js)
- `username` = tenant subdomain (`kebron`)
- `apikey` = `INFLUENCERSOFT_API_KEY`

The full hash impl is in `push_products.js` lines that handle PHP-compatible
encoding (spaces → `+`, special chars escaped). Reuse it; don't re-derive.

### Known issue — AddGood "error_code 2 endpoint disabled"

`AddGood` is gated per-account by IS support. If you get `error_code 2`, the
endpoint is disabled for this tenant. Resolution: email
`support@influencersoft.com` or raise it in Tech Tuesday. As of 2026-05-08
this was the state for `kebron` tenant — verify before retry.

Bulk product upload script exists at
infrastructure/influencersoft/push_products.js
with idempotent state tracking — ready to run once endpoint is enabled.
(Note: this script lives in a sibling branch awaiting merge; cross-reference once that branch lands in main.)

## 4. Zapier

InfluencerSoft exposes a native Zapier app. Use Zapier as fallback if direct
API gets brittle (or rate-limited beyond comfort).

### Triggers (Zapier fires when…)

| Trigger | Fires on |
|---|---|
| Added to List | Lead added to any list |
| New Lead | Brand-new contact record created |
| New Order | New order generated (before payment) |
| New Purchase | Payment completed |

### Actions (Zapier writes to IS)

| Action | Notes |
|---|---|
| Add/Update Lead | List membership, add/remove tags, full profile incl. social handles + billing/shipping/UTM |
| Add Tag to Lead | Fails if lead doesn't exist yet |
| Create Order | Product, price, coupon, VAT, payment method, affiliate, customer info |
| Remove Lead From List | |
| Remove Tag From Lead | |
| Unsubscribe Lead | Global unsubscribe across account |

## 5. Inbound webhook URLs (external → IS)

External systems POST directly to:

- `https://kebron.influencersoft.com/api/AddUpdateLead`
- `https://kebron.influencersoft.com/api/AddTagToLead`
- `https://kebron.influencersoft.com/api/CreateOrder`

Required form fields: `rpsKey=<key>`, plus endpoint-specific (e.g.
`lead_email` for lead methods).

## 6. Outbound webhook payload (IS → external)

When Zapier or a custom webhook fires on a New Lead / New Order event, the
payload contains:

- **Contact:** email, first/middle/last name, phone
- **Tracking:** utm_source, utm_medium, utm_campaign, utm_content, utm_term
- **Location:** IP, full billing + shipping address (city/state/zip/country)
- **Order:** product name, price, coupon, order ID, status, payment method,
  affiliate name, sales manager, order tags

## 7. Security notes

- Never log full POST bodies — `rpsKey` leakage risk (client lib enforces)
- Don't echo `INFLUENCERSOFT_API_KEY` even in dev shells
- API key lives in `.env` (root, not worktree) — see
  [CREDENTIALS.md](../../../CREDENTIALS.md)
- HTTPS only (no HTTP fallback)
