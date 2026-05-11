# InfluencerSoft API Probe — Read-Only Findings

**Date:** 2026-05-11
**Probed by:** Claude research agent (read-only — no POST/PUT/DELETE calls executed)
**API key:** `INFLUENCERSOFT_API_KEY` present in `Excel-Templates/.env` (root, not worktree). Value never echoed.

**Live probe confirmation (2026-05-11):**
- `POST https://kebron.influencersoft.com/api/GetAllGroups` with `rpsKey=<key>` → **HTTP 200**, returned 9+ existing contact groups: `partners`, `CPA`, `DIY`, `Email Marketing`, `Funnel`, `Make Money Online`, `My contacts`, `new_learners`, plus more.
- `POST https://kebron.influencersoft.com/api/GetGoods` → **HTTP 200**, product catalog currently EMPTY (`result: []`). Ready to populate via `AddGood`.
- **Endpoint case matters**: lowercase `getalllists` → 307 redirect to `GetAllGroups` (PascalCase). Use PascalCase canonical names.

---

## 1. Base URL + Auth + Version

| Item | Value |
|---|---|
| **API host pattern** | `https://{username}.influencersoft.com/api/{method}` — **per-tenant subdomain**, NOT a central api.influencersoft.com host |
| **Tenant subdomain** | **`kebron`** → API base = `https://kebron.influencersoft.com/api/<Method>`. Confirmed live 2026-05-11. |
| **Auth scheme** | API key in POST body as form field. **No Bearer header.** Two parameter names exist across docs: `rpsKey` (API 2.0, primary) and `rps_key` (some 2.0 articles) and `user_rps_key` + `hash` (API 1.0 legacy — HMAC style). |
| **Transport** | `POST` only · `Content-Type: application/x-www-form-urlencoded` · response is JSON: `{"error_code":0,"error_text":"OK","result":[...],"hash":"..."}` |
| **Versions** | **API 1.0** (legacy, hash-signed, broader method set inc. AddGood/DeleteGood/DeleteSubscribe) and **API 2.0** (current, simple `rpsKey`-in-body, leaner method set). Use **2.0** for new integrations. |
| **Sandbox** | None documented. All calls hit production tenant. |
| **OpenAPI / spec** | None. Docs are HTML articles on Zendesk help center only. |
| **Recommended non-dev path** | Zapier — IS docs explicitly direct non-programmers to Zapier integration. |
| **Rate limit** | Not documented. Article exists ("Rate Article") but body is empty/placeholder. Assume conservative — < 1 req/sec, add backoff. |

---

## 2. Endpoint Matrix (API 2.0)

All endpoints are `POST https://{username}.influencersoft.com/api/{method}` with `Content-Type: application/x-www-form-urlencoded`. All require `rpsKey` (or `rps_key`) field.

### Contacts / leads / subscribers

| Method (path) | Purpose | Key fields | Notes |
|---|---|---|---|
| `addupdatelead` | Create OR update a contact (idempotent on email) | `rpsKey`, `lead_email`, `lead_first_name`, `lead_middle_name`, `lead_last_name`, `lead_phone`, `add_to_lists` (CSV of group IDs), `remove_from_lists`, `add_tags` (CSV), `remove_tags` | **Primary tool.** Lets us add tags + push into lists in one call. |

### Tags

| Method | Purpose | Key fields |
|---|---|---|
| `addtagtolead` | Add tags to existing contact | `rpsKey`, `lead_email`, tag(s) |
| `removetagfromlead` | Remove tags | `rpsKey`, `lead_email`, tag(s) |

> Tag CRUD: tags are **created on first use** (no separate tag-create endpoint). The `tag-dictionary.md` in `infrastructure/influencersoft/` is the SoT — IS just mirrors whatever strings we send.

### Groups / Lists (subscriptions)

| Method | Purpose | Key fields |
|---|---|---|
| `getalllists` | List all groups/lists with their IDs (needed because list IDs are opaque numerics like `1594725950.5982672784`) | `rpsKey` only |
| `removeleadfromlist` | Remove contact from a list | `rpsKey`, `lead_email`, list ID |
| API 1.0: `AddLeadToGroup` (POST `/api/AddLeadToGroup`) | Add to group with UTM + activation-email control | uses hash auth — fall back to `addupdatelead` with `add_to_lists` instead |
| API 1.0: `DeleteSubscribe` | Unsubscribe from group | hash auth |
| API 1.0: `GetCountSubscribers` | Count contacts in store/group | hash auth |

### Products

| Method | Purpose |
|---|---|
| `getgoods` (2.0) | List products |
| API 1.0: `AddGood` | Create product |
| API 1.0: `DeleteGood` | Delete product |
| API 1.0: `GetAllGoods` | List all products |

### Orders / invoices

| Method | Purpose | Key fields |
|---|---|---|
| `createorder` (2.0) | Create order/invoice for a contact | `rpsKey`, `customer_email`, `customer_first_name`, `customer_last_name`, `product_names` (REQUIRED, CSV of product IDs), `product_prices` (CSV), `payment_method` (PayPal/Stripe), `coupon`, `affiliates`, `order_status` (Expected/Paid/Cancel/MoneyBack), `order_confirmed`, `order_paid_at`, `order_created_at`, `utm_*`, `customer_shipping_*`, `customer_billing_*`, `order_tag`, `note` |
| API 1.0: `DeleteOrder` | Delete/hide invoice |
| API 1.0: `CreateOrder` | Legacy variant |
| API 1.0: Invoice script notification create/cancel | Webhook-style |

### Coupons / discounts

| Method | Purpose |
|---|---|
| `getcoupons` (2.0) | List all coupons |

### Other

| Method | Purpose |
|---|---|
| `getpersonalmanagers` (2.0) | List additional users / staff (for `order_sales_manager`) |
| API 1.0: Countries' Identifiers | Lookup table |

---

## 3. What the agent CAN do programmatically vs what the user must click

### Agent CAN do (via API, once Daniel provides tenant subdomain):

- **Contacts:** create, update, tag, untag, add to list, remove from list, look up.
- **Lists:** enumerate (`getalllists` → resolve human list names to opaque IDs).
- **Tags:** apply/remove freely (no pre-creation needed).
- **Products:** list (2.0), create/delete (1.0 with hash auth).
- **Orders:** create, look up, delete (legacy).
- **Coupons:** list.
- **Trigger sequences indirectly:** by tagging a contact or adding them to a list that already has a sequence wired to it as a trigger (the **trigger is configured in UI, fired by API**).

### Agent CANNOT do (must be done in UI by Daniel):

- **Create or edit email sequences / automations themselves.** No `addsequence`, `addautomation`, `addbroadcast`, or `addemail` endpoint exists. The 10 drafted `.md` sequences must be **manually pasted into the IS Marketing Automation UI** (subject, body, delays, branching).
- **Configure sequence triggers.** "Send sequence X when tag Y is applied" or "when added to list Z" is set up in UI.
- **Create opt-in forms / web-to-lead widgets.** UI-only.
- **Configure funnels, payment integrations, A/B tests, affiliate program, membership/course.** All UI-only.
- **Set up Stripe/PayPal connection.** UI-only.
- **Generate the API key itself.** Daniel must visit `https://{username}.influencersoft.com/shops/setts/apisettings/` and copy the key into `.env`.

**Net implication:** API is a thin contact-CRM layer over an otherwise UI-driven product. We can drive **state changes on contacts** (tag, list, order), but the **sequences themselves are authored in the IS web app**. This matches PROGRESS.md P2.0's note that sequence loading is "copy-paste / API-import" — and confirms it's mostly copy-paste, with API used only for the contact-level wiring.

---

## 4. Sequence-import shape proposal

Since sequences cannot be created via API, the import shape has two parts:

1. **A. UI-paste payload** — what Daniel pastes into IS Marketing Automation, one row per email in the sequence.
2. **B. API-wiring payload** — the tag/list mapping that the post-purchase / Etsy / n8n workflows will use to *trigger* each sequence.

### Shape: `infrastructure/influencersoft/sequences/<sequence-name>.yaml`

```yaml
# Single source of truth for one IS sequence.
# Section A goes into the IS UI by hand. Section B is consumed by n8n/agents.

sequence:
  id: post-purchase-etsy-buyer
  is_internal_name: "STR Ledger — Etsy Post-Purchase"   # what Daniel names it inside IS
  source_md: copy/email-sequences/post-purchase-etsy-buyer.md
  status: drafted                                       # drafted | loaded | live
  loaded_at: null

# ─── A. UI-PASTE PAYLOAD (manual, one row per email) ───
emails:
  - step: 1
    delay_after_trigger: "0m"      # immediately on tag-fire
    subject: "Your STR Ledger files — download inside"
    preview: "All your templates plus the quick-start guide"
    body_md_anchor: "#email-1-delivery"     # heading inside the .md draft
    on_open_add_tag: "engaged:opened-e1"
    on_click_add_tag: "engaged:clicked-e1"
  - step: 2
    delay_after_trigger: "2d"
    subject: "Did the spreadsheet open OK?"
    preview: "30-second check-in"
    body_md_anchor: "#email-2-checkin"
    on_click_add_tag: "engaged:replied-e2"
  - step: 3
    delay_after_trigger: "5d"
    subject: "The one thing most new hosts get wrong on taxes"
    preview: "(and the fix takes 4 minutes)"
    body_md_anchor: "#email-3-value"
  - step: 4
    delay_after_trigger: "9d"
    subject: "Quick favor — would you leave a review?"
    body_md_anchor: "#email-4-review-ask"
    on_click_add_tag: "review:requested"
  # ... etc.

# ─── B. API-WIRING PAYLOAD (consumed by n8n / agents) ───
trigger:
  fires_on_tag: "sequence:post-purchase-etsy-buyer:start"
  alt_fires_on_list_add: null            # could be a list-id once getalllists() resolves it

# What an n8n workflow does to fire this sequence for a new Etsy buyer:
fire_via_api:
  endpoint: "POST /api/addupdatelead"
  payload:
    rpsKey: "$INFLUENCERSOFT_API_KEY"
    lead_email: "{{ buyer.email }}"
    lead_first_name: "{{ buyer.first_name }}"
    add_tags: "sequence:post-purchase-etsy-buyer:start,product:str-ledger-core,source:etsy,acquired:{{ today }}"

# Exit / stop conditions (configured in IS UI under the sequence settings,
# documented here so we know what tags to write from other workflows):
exit_on_tag:
  - "refunded:*"            # refund-recovery workflow writes refunded:<date>
  - "unsubscribed"
  - "sequence:post-purchase-etsy-buyer:completed"
```

### Worked example — full mapping for ONE sequence

Source: `copy/email-sequences/post-purchase-etsy-buyer.md` (17,259 bytes, drafted)

| Step | Delay | Trigger tag written by | IS does |
|---|---|---|---|
| 0 — wire | n/a | n8n W23 (Etsy buyer ingest) calls `addupdatelead` with `add_tags=sequence:post-purchase-etsy-buyer:start` | IS sequence triggers |
| 1 | 0m | (IS internal) | Sends delivery email (links, files) |
| 2 | 2d | (IS internal) | Sends check-in email |
| 3 | 5d | (IS internal) | Sends tax-value email |
| 4 | 9d | (IS internal) | Sends review-ask, writes `review:requested` on click |
| 5 | 14d | (IS internal) | Sends cross-sell to STR Ledger Pro |
| Exit | any time | refund-recovery workflow writes `refunded:<date>` | IS halts sequence |

### Inventory of sequences to import

Lifecycle (root of `copy/email-sequences/`):
1. `post-purchase-etsy-buyer.md`
2. `review-request.md`
3. `refund-recovery.md`
4. `win-back.md`
5. `abandoned-cart.md`
6. (plus drafted but not in P0.0 mandate: `nurture-hero-magnet.md`, `welcome-book-magnet.md`, `strmanuals-free-magnet.md`, `strmanuals-order-confirmation.md`, `launch-12-new-templates.md`)

Bundle cross-sell (`copy/email-sequences/bundles/`):
1. `BUNDLE-01-first-year-host.md`
2. `BUNDLE-02-aspiring-host.md`
3. `BUNDLE-03-year-2-operator.md`
4. `BUNDLE-04-portfolio.md`
5. `BUNDLE-05-pro-manager.md`

Total: **10 sequences** to convert to the YAML shape above, then load into IS.

---

## 5. Risks / gotchas

- **No tenant subdomain on file.** Cannot probe live until Daniel provisions the IS instance and shares the subdomain. Until then, all of this is documented but unverified against the actual host.
- **No sandbox.** First live call is against production. Mitigation: probe with a `getalllists` GET-equivalent (read-only) before any `addupdatelead`.
- **No `Authorization` header.** Key travels in POST body. Acceptable over HTTPS but means key leakage via request logs is higher-risk than Bearer. **Don't log full POST bodies.**
- **List IDs are opaque** (`1594725950.5982672784`). Must call `getalllists` once after lists are created in UI to resolve human names → IDs, then cache the mapping in `infrastructure/influencersoft/lists.yaml`.
- **No sequence-create endpoint.** All 10 sequence drafts must be **hand-pasted** into IS UI. Plan a 2-3 hour copy-paste block, not an "API-load" task.
- **Tag namespace is unbounded and case-sensitive (assumed).** Stick to `tag-dictionary.md` strictly or sequences will fail to trigger silently.
- **API 1.0 hash-auth methods (AddGood, AddLeadToGroup, DeleteOrder, …) require HMAC** computed over sorted payload + secret. Only use these if 2.0 lacks the verb (e.g. product create). Wrap in a helper.
- **Rate limit unknown.** Throttle to ~1 req/sec, batch where possible (e.g. one `addupdatelead` with CSV tags/lists is one call, not N).
- **`createorder` irreversibility.** A `createorder` call generates a real invoice. Do NOT call during integration testing without `order_status=Cancel` or against a test contact.
- **`product_names` requires real product IDs.** Order creation depends on products being set up in UI first. Pull IDs via `getgoods` and cache.
- **Help docs are partial.** Several articles have empty "Rate Article" / placeholder sections; some only show PHP cURL examples (need translation to JS/n8n HTTP node).
- **Zapier is the supported non-dev path.** If API rate-limits bite or hash auth proves brittle, Zapier triggers/actions are a documented fallback.

---

## 6. Next step

**Blocking on Daniel:**
1. Provision IS account → confirm `username` (tenant subdomain).
2. Visit `https://{username}.influencersoft.com/shops/setts/apisettings/` and paste key into `.env` (already a `INFLUENCERSOFT_API_KEY` placeholder there).
3. In IS UI: create the 10 sequences (paste from `.md` drafts) and the corresponding trigger tags.

**Once those are done, I can in one session:**
- Run `getalllists` and `getgoods` → cache list-ID + product-ID mappings to `infrastructure/influencersoft/lists.yaml` and `products.yaml`.
- Author the 10 `infrastructure/influencersoft/sequences/<name>.yaml` files in the shape above.
- Write the n8n W23 (Etsy ingest) + W18 (lead-magnet opt-in) HTTP-node bodies that fire each sequence — total ~12 API calls per buyer journey, fully scripted, ready to load and test against one canary contact.

**Estimated load effort once unblocked:** ~10 sequences × 1 API trigger-wire each = 10 API call definitions + 10 YAML files. Sequence *body* loading is ~2-3h of manual UI work for Daniel.
