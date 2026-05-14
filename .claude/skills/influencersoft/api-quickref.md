# InfluencerSoft API Quick Reference

Cheat sheet for the most-used API surfaces. Full endpoint matrix with parameter
lists, response shapes, and rate-limit notes lives in
[ops/influencersoft-api-probe.md](../../../ops/influencersoft-api-probe.md).
The rate-limited Node.js client is at
[scripts/lib/influencersoft.mjs](../../../scripts/lib/influencersoft.mjs).

## 0. Prerequisites — API access must be enabled

> **CRITICAL:** API access on InfluencerSoft is NOT on by default. Accounts
> that call the API without explicit enablement risk account-level blocking.

**How to enable:**
1. Send a written request to `support@influencersoft.com` asking for API
   access on your account.
2. Specify your intended use (automation, CRM sync, etc.).
3. Wait for confirmation before making any API calls.

- The `kebron` tenant had API access confirmed as of 2026-05-08 (probe log).
- If a new account or sub-account is created, repeat this request.
- If you get unexpected `error_code` responses after a period of inactivity,
  re-verify access hasn't been suspended.

## 1. API 2.0 (current — use this by default)

- **Base URL:** `https://kebron.influencersoft.com/api/<Method>`
- **Endpoint naming:** Guide canonical names are **lowercase** (e.g.
  `addupdatelead`, `getalllists`). The IS server 307-redirects lowercase to
  PascalCase equivalents (`GetAllGroups`, etc.). The client lib uses PascalCase
  for readability; both work in practice. Do not present `GetAllGroups` as the
  canonical endpoint name — the guide canonical is `getalllists`.
- **Auth:** POST body field `rpsKey=<INFLUENCERSOFT_API_KEY>`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Response:** JSON — `{error_code:0, error_text:"OK", result:[...], hash:"..."}`
- **Rate limit (project convention, not IS-imposed):** IS does not publish a
  rate limit. Client lib throttles to 1100ms (~0.9 req/s) by Daniel's
  convention. Do not label this as an IS restriction.

### Primary endpoints (already wrapped in client lib)

| Guide canonical (lowercase) | Client lib helper | Purpose |
|---|---|---|
| `addupdatelead` → `AddUpdateLead` | `addUpdateLead(fields)` | Create or update contact (idempotent on email). Can set tags + lists in one call. Primary tool. |
| `addtagtolead` → `AddTagToLead` | `addTagToLead(email, tags)` | Add tag(s) to existing contact. Tags auto-create on first use. |
| `removetagfromlead` → `RemoveTagFromLead` | `removeTagFromLead(email, tags)` | Remove tag(s). |
| `getalllists` → `GetAllGroups` | `getAllGroups()` | List all groups/lists with IDs (IDs are opaque numerics — resolve via this). Note: canonical name is `getalllists`; redirects to `GetAllGroups` server-side. |
| `getgoods` → `GetGoods` | `getGoods()` | List all products. |
| `getcoupons` → `GetCoupons` | `getCoupons()` | List all coupons. |
| `createorder` → `CreateOrder` | not yet wrapped | Create order/invoice for a contact. **Irreversible.** |
| `removeleadfromlist` | not yet wrapped | Remove a contact from a specific list/group. Use for cleanup after purchase or funnel exit. |
| `getpersonalmanagers` | not yet wrapped | List personal manager users. Needed to assign a manager to a contact. |

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

> **Full inventory:** The guide documents 26 API 1.0 endpoints including
> `GetLeads`, `GetOrders`, `GetOrdersWithGoods`, `GetPartnerStats`,
> `UpdateSubscriberData`, `DeleteOrder`, `PostBackNotifications`.
> Full spec at `scrape-influencersoft/guide-md/11-api-1-0.md`.
> This section covers only the 4–6 endpoints used in the project.

### ⚠️ READ FIRST: known issue — `AddGood` "error_code 2 endpoint disabled"

**Most users hit this before they hit the hash algorithm.** `AddGood` is gated
per-account by IS support and silently disabled by default. If you get
`error_code 2`, the endpoint is disabled for this tenant.

- **As of 2026-05-08, AddGood was disabled for the `kebron` tenant.** Verify
  the current state before promising any bulk product upload — don't write
  code that assumes the endpoint is on.
- **Resolution path:** email `support@influencersoft.com` OR raise it at the
  weekly Tech Tuesday mentoring call (see plans-and-support.md). Usually
  enabled within a day.
- **Bulk-upload script already exists** at
  `infrastructure/influencersoft/push_products.js` with idempotent state
  tracking — ready to run once the endpoint is on. Don't write a new one.
  If the path doesn't resolve on your branch, run
  `git log --all -- infrastructure/influencersoft/push_products.js` to find it.

### Hash algorithm — it's **MD5**, not HMAC

> **Anti-pattern alert:** the default LLM training-data assumption for "API
> hash signing" is HMAC-SHA256. InfluencerSoft does NOT use HMAC. It uses
> plain MD5 with concatenation and a PHP-style URL-encoded query string. If
> you write HMAC code for this, your requests WILL fail. This is the single
> most common mistake on this API.

```
hash = MD5(buildQuery(params) + "::" + username + "::" + apikey)
```

- `buildQuery(params)` = PHP `http_build_query()` style URL-encoded form body
  — sort params alphabetically by key, then URL-encode. **Spaces become `+`,
  NOT `%20`** (PHP convention, not RFC 3986).
- `username` = tenant subdomain (`kebron`)
- `apikey` = `INFLUENCERSOFT_API_KEY`
- Separator is literal `::` (two colons).

The full hash impl is in `push_products.js`. Reuse it verbatim; don't
re-derive (the URL-encoding edge cases are subtle).

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
- **Location:** `ip` (subscriber IP at opt-in), full billing + shipping address
  (city/state/zip/country)
- **Order:** product name, price, coupon, order ID, status, payment method,
  affiliate name, sales manager, order tags

### API 1.0 subscription notification payload (Script Notifications)

When IS fires a script notification (API 1.0 `PostBackNotifications`-style),
the subscription event payload includes:

| Field | Values | Notes |
|---|---|---|
| `id_group` | numeric | List/group the contact subscribed to |
| `ip` | string | Subscriber's IP at opt-in time |
| `status` | `2` = subscription, `1` = activation | Use to distinguish a new subscription from an email activation click |
| UTM fields | utm_source, utm_medium, utm_campaign, utm_content, utm_term | Full UTM array |

Route inbound webhook events by `status`: `2` = newly subscribed (may not be
activated), `1` = clicked activation link (now emailable).

## 7. Security notes

- Never log full POST bodies — `rpsKey` leakage risk (client lib enforces)
- Don't echo `INFLUENCERSOFT_API_KEY` even in dev shells
- API key lives in `.env` (root, not worktree) — see
  [CREDENTIALS.md](../../../CREDENTIALS.md)
- HTTPS only (no HTTP fallback)
