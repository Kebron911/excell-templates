# n8n Workflows — Complete Map

**Purpose:** the full universe of automation workflows this business needs, in priority order, with explicit interactions between them.

**Rule 1:** Airtable is the only place humans edit data. n8n is the only place automations read/write from it.

**Rule 2:** Every workflow has a single clear purpose. When in doubt, split into two workflows.

**Rule 3:** Every workflow has an error path that writes to the Errors table + posts to Slack. Silent failures are bugs.

---

## Architecture overview

```
                      ┌─────────────────────────────────────┐
                      │            CUSTOMERS                │
                      │  (outside world — buy, subscribe,   │
                      │   browse, interact)                 │
                      └──────┬──────────┬───────────────────┘
                             │          │
              ┌──────────────┘          └──────────────┐
              │                                        │
   ┌──────────▼─────────┐                  ┌──────────▼─────────┐
   │    STOREFRONTS     │                  │   CONTENT SURFACES │
   │  • IS              │                  │  • Ghost blog      │
   │  • Etsy            │                  │  • Pinterest       │
   │  • Gumroad         │                  │  • FB Group        │
   │  • Payhip (Ph. 2)  │                  │  • Email (IS)      │
   │  • Stripe          │                  │                    │
   └──────────┬─────────┘                  └──────────┬─────────┘
              │                                        │
              │       events: orders, subs,           │
              │       refunds, logins, clicks         │
              ▼                                        ▼
   ╔══════════════════════════════════════════════════════════╗
   ║                      n8n (spine)                         ║
   ║                                                          ║
   ║   INGESTION           ORCHESTRATION         EMISSION     ║
   ║   • Webhooks          • Enrichment           • Email     ║
   ║   • Cron polls        • Enrichment           • Social    ║
   ║   • Forms             • Branching            • Catalog   ║
   ║                       • AI drafting            updates   ║
   ║                       • Aggregation          • Alerts    ║
   ║                                                          ║
   ╚══════════════╦═══════════════════════════════╦═══════════╝
                  │                               │
                  ▼                               ▼
   ┌──────────────────────────┐       ┌──────────────────────┐
   │     AIRTABLE (SSOT)       │       │  EXTERNAL SERVICES   │
   │  • Products               │◄──────│  • Claude API        │
   │  • Customers              │       │  • Google Drive      │
   │  • Orders                 │       │  • Vista Create API  │
   │  • Content                │       │  • Creasquare        │
   │  • Metrics                │       │  • Slack             │
   │  • Errors                 │       │  • Instantly (Ph. 2) │
   │  • Partners (affiliates)  │       │                      │
   │  • Outreach Queue         │       │                      │
   └──────────────────────────┘       └──────────────────────┘
```

---

## The 30 workflows

| # | Workflow | Trigger | Priority | Owner family |
|---|---|---|---|---|
| W01 | **Order Ingestion (Stripe/IS)** | Webhook | **P0** | B. Customer data |
| W02 | **Order Ingestion (Gumroad)** | Webhook | **P0** | B. |
| W03 | **Order Ingestion (Etsy polling)** | Cron 15 min | **P1** | B. |
| W04 | **Subscriber Sync (IS→Airtable)** | Webhook / Cron | **P0** | B. |
| W05 | **Product Publisher** | Airtable row change | **P0** | A. Catalog sync |
| W06 | **Product Updater** | Airtable row change | **P1** | A. |
| W07 | **Refund Handler** | Webhook | **P1** | B. |
| W08 | **Lead Magnet Delivery** | IS form submission | **P0** | D. Funnel |
| W09 | **Daily Revenue Rollup** | Cron daily 06:00 | **P1** | F. Analytics |
| W10 | **Weekly Ops Briefing** | Cron Monday 07:00 | **P1** | H. AI ops |
| W11 | **Threshold Alerts** | Airtable Metrics change | **P2** | F. |
| W12 | **Customer Support Triage** | Inbound email (hello@) | **P1** | G. Support |
| W13 | **Review Request** | Cron daily 10:00 | **P1** | E. Marketing |
| W14 | **Tax-Season Price Escalation** | Cron weekly Feb–Apr | **P2** | J. Tax-season |
| W15 | **Pinterest Pin Performance Poll** | Cron daily 08:00 | **P2** | E. |
| W16 | **Blog Post Promotion Cascade** | Airtable Content Status=Published | **P2** | C. Content |
| W17 | **Weekly Backup** | Cron Sunday 02:00 | **P0** | K. Resilience |
| W18 | **Integrity Checker** | Cron daily 03:00 | **P1** | K. |
| W19 | **FB Group New Member** | Zapier from FB | **P2** | B. |
| W20 | **Affiliate Commission Cycle** | Cron monthly | **P3** | E. |
| W21 | **Research Outreach Pipeline** | CSV drop on Google Drive | **P3** | I. Research |
| W22 | **Template Update Notification** | Airtable version bump | **P3** | A. |
| W23 | **Course Purchase Onboarding** | Delegated from W01/W02 (course SKU) | **P0** | L. Course |
| W24 | **Course Module Drip Unlock** | Cron daily 06:00 | **P0** | L. |
| W25 | **First Saturday Tracker** | LMS event webhook | **P1** | L. |
| W26 | **Cohort Enrollment & Fulfillment** | Delegated from W23 (cohort SKU) | **P0** | L. |
| W27 | **Cohort Group Call Reminders** | Cron Mon/Tue per active cohort | **P1** | L. |
| W28 | **Refund Reply Intake** | Inbound email reply pattern | **P1** | L. |
| W29 | **NPS Day-30 Collection** | Cron daily 08:00 | **P1** | L. |
| W30 | **Annual "What Changed" Distribution** | Cron January 20 annually | **P1** | L. |

The course workflows (W23–W30) form the "Owner family L — Course." They share several conventions:

- All course buyers carry tags `course:{{tier}}` and `customer:course` (set in W23) — every downstream course workflow filters on these tags
- LMS state lives in Airtable's `Course_Students` table (created in W23) — `student_id`, `email`, `tier`, `purchase_date`, `current_module`, `first_saturday_scheduled`, `nps_score`, `graduation_date`
- The 10-email post-purchase onboarding sequence runs in IS natively (not n8n) — n8n triggers tag changes that fire the IS sequence; n8n does NOT send the emails directly
- Course Pinterest pins use W16's existing Blog Post Promotion Cascade with `content_type: course-pin` — no new workflow needed

---

## Interaction graph (what feeds what)

```
┌──────────────────┐                                   ┌──────────────────┐
│  Customer        │                                   │  Daniel           │
│  purchases       │                                   │  edits Airtable   │
└────────┬─────────┘                                   └────────┬──────────┘
         │                                                      │
         ▼                                                      ▼
  ┌──────────────┐                                      ┌──────────────┐
  │ W01/W02/W03  │                                      │     W05      │
  │ Order        │                                      │   Product    │
  │ Ingestion    │                                      │  Publisher   │
  └──┬───────┬───┘                                      └──────┬───────┘
     │       │                                                 │
     │       └──────────────┐                                  │
     │                      │                                  │
     ▼                      ▼                                  ▼
  Airtable              Airtable                          Airtable
  Orders                Customers                         Products
     │                      │                                 │
     │                      │              ┌──────────────────┘
     │                      │              ▼
     │                      │       ┌──────────────┐
     │                      │       │     W18      │
     │                      │       │  Integrity   │
     │                      │       │   Checker    │
     │                      │       └──────────────┘
     │                      │
     ▼                      ▼
  ┌──────────────────────────────┐
  │         W09 Daily Rollup     │
  │         Reads all 3 tables    │
  └──────┬───────────────────────┘
         │
         ▼
  Airtable Metrics ──────────┐
         │                   │
         ▼                   ▼
  ┌────────────┐       ┌────────────┐
  │    W10     │       │    W11     │
  │   Weekly   │       │ Thresholds │
  │  Briefing  │       └────────────┘
  └────────────┘


┌──────────────┐
│  Lead magnet │
│  form submit │
└──────┬───────┘
       │
       ▼
  ┌──────────┐
  │   W08    │
  │ Magnet   │
  │ Delivery │
  └────┬─────┘
       │
       ▼
  IS contact created (tagged) ──► IS nurture sequence (native, not n8n)
       │
       ▼
  ┌──────────┐
  │   W04    │
  │ Subscriber│
  │  Sync    │
  └────┬─────┘
       │
       ▼
  Airtable Customers


┌──────────────┐           ┌──────────────┐
│  Order       │           │  Purchase    │
│  completes   │           │  +7 days     │
└──────┬───────┘           └──────┬───────┘
       │                          │
       │                          ▼
       │                   ┌──────────────┐
       │                   │     W13      │
       │                   │ Review       │
       │                   │ Request      │
       │                   └──────────────┘
       │
       ▼
  ┌──────────┐  (if refund) ┌──────────┐
  │   W07    │──────────────►  Airtable │
  │  Refund  │               │  Orders  │
  │ Handler  │               │  (status │
  └──────────┘               │ updated) │
                             └──────────┘


┌──────────────┐
│  Blog post   │
│  published   │
└──────┬───────┘
       │
       ▼
  ┌──────────┐
  │   W16    │
  │ Blog     │
  │ Promo    │
  │ Cascade  │
  └────┬─────┘
       │
       ▼
  Generated pins ──► Creasquare (primary) / Pinterest native (fallback) — manual upload by Daniel until API automation built
  Email draft ──────► Daniel review queue


┌──────────────┐
│  Support     │
│  email in    │
└──────┬───────┘
       │
       ▼
  ┌──────────┐
  │   W12    │
  │ Support  │
  │ Triage   │
  └────┬─────┘
       │
       ▼
  Claude drafts response ──► Daniel approve ──► send
```

---

## Per-workflow specs

Each section includes: trigger, inputs, core nodes, outputs, error handling, dependencies, and test cases.

---

### W01 — Order Ingestion (Stripe + IS)

**Priority:** P0 — blocks every downstream analytics and customer workflow.

**Trigger:** HTTP Webhook at `https://n8n.thestrledger.com/webhook/order-stripe`

**Stripe events to subscribe to:**
- `charge.succeeded`
- `payment_intent.succeeded`
- `charge.refunded`
- `invoice.paid` (for subscription/membership)

**Nodes:**

1. **Webhook (POST)** — receives Stripe payload, validates signature via `STRIPE_WEBHOOK_SECRET`
2. **Switch** — route by `event.type`:
   - `charge.succeeded` / `payment_intent.succeeded` → purchase flow
   - `charge.refunded` / `invoice.payment_failed` → hand off to W07 Refund Handler
3. **Function (normalize payload)** — map Stripe schema to internal schema:
   ```js
   {
     order_id: `stripe-${payment_intent.id}`,
     timestamp: event.created,
     email: payment_intent.receipt_email,
     gross_amount: payment_intent.amount_received / 100,
     platform: 'is',  // all IS checkouts route through Stripe
     stripe_customer_id: payment_intent.customer,
     products: metadata.products,  // IS passes SKU list
     orderbump_taken: metadata.orderbump === 'true',
     oto_taken: metadata.oto === 'true'
   }
   ```
4. **Airtable — Find or Create Customer** — match by email, lowercase-normalize
5. **Airtable — Create Order** — link to Customer + Product(s); handle multi-product (OrderBumps, OTOs) by creating one Order row per product
6. **IS API — Tag Contact** — add `product:<sku>` + `persona:<inferred>` + `acquired:<YYYY-MM-DD>` tags
7. **Slack notification** — only for first 100 sales; disable after threshold
8. **Error branch** — on any failure, write to Errors table + Slack alert

**Inputs from outside world:**
- Stripe webhook payload (JSON)
- `STRIPE_WEBHOOK_SECRET` env var for signature validation

**Outputs:**
- Airtable Customers row (created or updated)
- Airtable Orders row (one per line item)
- IS contact tagged
- Slack message (until disabled)

**Dependencies:**
- Airtable base must exist with Customers, Orders, Products tables (Task B1)
- IS API accessible and credentials in n8n (Task B3)
- Stripe webhook configured (Task B4)

**Error handling:**
- Signature validation fails → reject with 401, log to Errors
- Airtable API down → retry 3× with exponential backoff → if still failing, queue in n8n's built-in "errored executions" bin + Slack alert
- Email normalization mismatch (e.g., two customers with same email different capitalization) → merge to lowercase, log in Errors as "merged" for review

**Test cases:**
1. Single-product purchase → 1 Customer row (new), 1 Order row, 1 IS tag added
2. Repeat purchase from same email → 1 existing Customer (LTV increments), 1 new Order
3. OrderBump purchase → 1 Customer, 2 Orders (main + bump)
4. OTO purchase → same customer, +1 Order after initial
5. Invalid signature → 401 response, error logged, no Airtable writes

---

### W02 — Order Ingestion (Gumroad)

**Priority:** P0

**Trigger:** HTTP Webhook at `https://n8n.thestrledger.com/webhook/order-gumroad`

Gumroad sends "Ping" webhooks for sales. Configure in Gumroad Settings → Advanced → Ping URL.

**Nodes:**
1. Webhook (POST) — validate by shared secret (Gumroad allows configuring a secret)
2. Function — normalize Gumroad payload to internal schema
3. Airtable — Find or Create Customer + Create Order (platform=`gumroad`)
4. IS API — Tag Contact
5. Error branch

**Specifics:**
- Gumroad payload field names: `sale_id`, `product_id`, `email`, `price`, `ppp_factor` (for pay-what-you-want with floor)
- Platform fee = 10% + $0.30 — hardcode or pull from Gumroad settings

**Test cases:** same as W01 but with Gumroad payload format.

---

### W03 — Order Ingestion (Etsy polling)

**Priority:** P1 (after first Etsy sale expected)

**Problem:** Etsy does NOT provide webhooks for order events. Must poll.

**Trigger:** Cron every 15 minutes.

**Nodes:**
1. **Cron (every 15 min)**
2. **Etsy API** — `GET /v3/application/shops/{shop_id}/receipts?was_paid=true&min_last_modified=<last_poll>`
   - Store `last_poll` timestamp in n8n static data or Airtable config row
3. **Function — iterate receipts**:
   - For each receipt: extract email (Etsy buyer), products, amounts, transaction IDs
4. **Airtable — Upsert Customer + Order** per receipt
5. **Update last_poll timestamp**
6. **Error branch**

**Gotchas:**
- Etsy's API has quota limits (10,000 calls/day) — 15-min polling = 96/day, safe
- Etsy email is obfuscated initially; harvestable only after buyer downloads Companion PDF and clicks the email capture CTA
- Deduplicate by `receipt_id` to avoid duplicate Order rows if polling overlaps

**Dependencies:**
- Etsy API credentials (OAuth 2.0 — requires one-time manual auth flow)
- Shop ID known (from Etsy dashboard)

**Alternative:** Use Alura (3rd-party Etsy toolset with webhook support) — costs $9–29/mo but simplifies. Evaluate after volume grows.

---

### W04 — Subscriber Sync (IS → Airtable)

**Priority:** P0

**Trigger:** IS webhook on `subscriber.created` (if IS supports) OR Cron every 1 hour to poll IS API.

**Nodes:**
1. Webhook or Cron
2. IS API — fetch subscribers created since last sync
3. Function — normalize (map IS subscriber → Airtable Customer schema)
4. Airtable — Upsert Customer (create if not exists, update tags if exists)
5. Set `First contact date` if new, otherwise don't overwrite
6. Error branch

**Why this matters:**
- IS is the source of truth for **subscribers** (people on the email list)
- Airtable is the source of truth for **customers** (people who bought something)
- When a subscriber becomes a customer, Order webhook (W01/W02) does the Customer upsert. But a subscriber who hasn't bought yet still needs to exist in Airtable for LTV attribution.

---

### W05 — Product Publisher

**Priority:** P0

**Trigger:** Airtable row change in Products table where `Status` changed to `Published` AND any `Live on *` flag is false.

**Airtable automation:** use Airtable's native "When record matches conditions" trigger → call n8n webhook.

**Nodes:**
1. Webhook (from Airtable automation) — receives Products row ID
2. Airtable — Get Products row details
3. Switch — route to each platform sub-flow:
   - **IS branch:** if `Live on IS` checked but no `IS product ID` → IS API create product → save product ID → flip `Live on IS` = true
   - **Gumroad branch:** same pattern with Gumroad API
   - **Payhip branch:** Phase 2
   - **Etsy branch:** generate draft listing data → email Daniel for manual listing creation (Etsy API v3 supports listing creation but requires OAuth + manual approval; draft-and-notify is more reliable)
4. Update `Last updated` timestamp + `Sync status` per platform
5. Error branch with per-platform isolation (IS fails ≠ Gumroad fails)

**Product data pushed:**
- Name → product title
- Full description → product description
- Price (platform-specific column)
- Master file → product file
- Thumbnail → primary image
- Preview images → additional product images
- Tags → platform tags

**Fallback path (no IS API):** Playwright browser automation node runs against IS dashboard, logs in, creates product through UI. Fragile; only use if IS has no API.

---

### W06 — Product Updater

**Priority:** P1

**Trigger:** Airtable row change in Products table where any content field (name, description, prices, files, thumbnail) was modified AND `Status` = `Published`.

**Nodes:** similar to W05 but updates rather than creates.

**Version-bump handling:**
- If `Version` changed with MAJOR or MINOR bump → trigger W22 Template Update Notification
- If only PATCH → quietly push update, no customer notification

**Concurrency:** if a product is updated while a previous update is still syncing, queue the latest and cancel the in-flight (last-write-wins).

---

### W07 — Refund Handler

**Priority:** P1

**Trigger:** Webhook from any platform on refund event.

**Routed from:** W01/W02/W03 switch paths + Gumroad and Etsy refund webhooks.

**Nodes:**
1. Webhook or delegation from Order Ingestion workflows
2. Function — normalize refund payload
3. Airtable — find Order by `Order ID` → update `Refund amount`, `Refund status`, `Refund reason`
4. Airtable — recompute Customer's net LTV
5. **If refund % >8% over rolling 30 days → Slack alert** (delegate to W11 Threshold Alerts)
6. IS API — tag customer `refunded:<YYYY-MM-DD>` for segment exclusion
7. Optional email to customer confirming refund processed (Stripe handles this automatically; don't duplicate)
8. Error branch

**Reason-code capture:** parse refund reason where platforms provide it. Stripe has `refund.reason`; Gumroad has `refund_reason`. Tag Customer with reason to identify product-quality issues.

---

### W08 — Lead Magnet Delivery

**Priority:** P0

**Trigger:** IS form submission on `/47` landing page.

**Note:** IS handles the delivery natively (form → auto-email with attachment). This workflow exists to **mirror the event to Airtable** and do **source attribution**.

**Nodes:**
1. IS webhook on `form.submitted` → n8n
2. Function — extract email, detect source from UTM parameters stored in form hidden fields
3. Airtable — Create Customer row with:
   - `Acquisition source`: derived from UTM or default `hero-magnet`
   - `Lead magnet downloaded`: `hero-47`
   - `First contact date`: now
4. IS API — add tags `source:<x>` + `magnet:hero-47`
5. Error branch

**UTM detection:**
- `utm_source=pinterest` → `Acquisition source` = `pinterest`
- `utm_source=etsy` → `Acquisition source` = `etsy-post-purchase`
- `utm_source=blog` + `utm_content=<slug>` → `Acquisition source` = `blog` + save slug as `Acquisition campaign`
- No UTM → `Acquisition source` = `direct`

---

### W09 — Daily Revenue Rollup

**Priority:** P1

**Trigger:** Cron daily 06:00 ET.

**Nodes:**
1. Cron
2. Airtable — query Orders from prior day (timestamp >= yesterday 00:00 AND < today 00:00)
3. Function — aggregate per platform, per product:
   ```
   {
     date: '2026-04-22',
     revenue_total: 1847.00,
     revenue_etsy: 480.00,
     revenue_gumroad: 127.00,
     revenue_is: 1240.00,
     orders_total: 23,
     orderbump_rate: 0.34,
     oto_rate: 0.18,
     refund_rate_rolling_30: 0.04,
     top_products: [...]
   }
   ```
4. Airtable — write to Metrics table (one row per metric)
5. **Reconcile against platform APIs** — pull prior-day totals from Stripe / Gumroad / Etsy for sanity check. If off by >1%, log in Errors for investigation.
6. Error branch

---

### W10 — Weekly Ops Briefing

**Priority:** P1

**Trigger:** Cron Monday 07:00 ET.

**Nodes:**
1. Cron
2. Airtable — aggregate last 7 days from Orders, Metrics, Content, Customers
3. Claude API — generate natural-language briefing:
   - "Revenue last week: $X (+/-Y% vs prior week)"
   - "Top 3 products"
   - "Channel revenue breakdown"
   - "Anomalies needing attention"
   - "Suggested actions for this week"
4. Email Daniel with the briefing (sent from `hello@thestrledger.com`)
5. Also commit a markdown copy to Airtable Metrics > WeeklyBriefings linked table for history

**Prompt template for Claude in this workflow:**

```
You are the weekly ops analyst for The STR Ledger. Given the following data, write a concise
briefing (under 500 words) for Daniel. Lead with revenue total + trend. Then top
products. Then channel breakdown. Then anomalies (flag any metric outside its
target band — refunds >8%, email open <25%, CAC >$4). End with 3 suggested actions.

Data:
<JSON blob of weekly metrics>

Format: markdown, professional tone, concrete numbers.
```

---

### W11 — Threshold Alerts

**Priority:** P2

**Trigger:** Airtable automation: row added to Metrics table → call n8n webhook.

**Nodes:**
1. Webhook
2. Switch by metric name:
   - `refund_rate_rolling_30` > 0.08 → Slack alert "Refunds spiking"
   - `email_open_rate` < 0.25 → Slack alert "Deliverability issue likely"
   - `cac_by_channel_<x>` > 4.00 → Slack alert "CAC blown on <channel>"
   - `orderbump_rate` < 0.15 → Slack alert "Bump mechanic failing"
3. Also post to dedicated Slack channel `#str-platform-alerts`

**Alert format:**
```
🚨 Refund rate alert
Last 30 days: 10.3% (target: <5%)
Affected products: <top 3 with highest refund rate>
Recommended action: review product quality or listing expectations
Dashboard: https://airtable.com/<link to filtered view>
```

---

### W12 — Customer Support Triage

**Priority:** P1

**Trigger:** Email received at `hello@thestrledger.com` (via Google Workspace API push or IMAP polling).

**Nodes:**
1. Email trigger (IMAP or Google Workspace)
2. Claude API — classify email:
   - FAQ (file won't open, which Excel version, refund question)
   - Refund request (route to W07 if approved)
   - Bug report (template formula broken)
   - Feature request / feedback
   - Sales inquiry
   - Spam / auto-reply (archive, no action)
3. Switch by classification:
   - **FAQ:** Claude drafts response → Daniel review queue (Airtable Support > DraftResponses)
   - **Refund request:** Check 14-day window → if within window auto-draft approval + trigger refund via Stripe/Gumroad refund API → if outside window, human review
   - **Bug report:** Collect details → create Airtable Products > Issues linked record
   - **Feature request:** Tag in Customer record, thank them
   - **Spam:** archive
4. Auto-send responses only for: refund approvals within policy, duplicate delivery links, "how do I download" (high confidence, low risk)
5. Everything else: Claude draft → queue for Daniel to approve

**Why human-in-loop:** support is where brand voice lives. Automated sends are fine for mechanical questions; anything nuanced should be Daniel-approved in Phase 1.

---

### W13 — Review Request

**Priority:** P1

**Trigger:** Cron daily 10:00 ET.

**Nodes:**
1. Cron
2. Airtable — find Orders where timestamp = 7 days ago AND review not requested (add `Review requested` boolean to Orders)
3. Per order:
   - If platform = etsy: send email with Etsy review link
   - If platform = gumroad: send email with Gumroad review link
   - If platform = is: send email asking for testimonial (plain reply) + Trustpilot/G2 link
4. Update `Review requested` = true
5. Claude drafts the email body with buyer's first name + product name

**Email template:**

```
Subject: Quick favor, {{ first_name }}?

{{ first_name }},

You picked up the {{ product_name }} a week ago — hope it's been useful.

If it has, would you drop a quick review? Takes 30 seconds and makes a
huge difference for a small shop like ours:

[Leave a review on {{ platform }} →]

If something didn't work, hit reply. I'll fix it.

— The STR Ledger
```

---

### W14 — Tax-Season Price Escalation

**Priority:** P2

**Trigger:** Cron weekly Feb 1 → April 15.

**Schedule (from spec §4.3):**
- Feb 1: Tax Season Bundle → $147
- Mar 1: → $167
- Apr 1: → $187
- Apr 16: → $97 (off-season price)

**Nodes:**
1. Cron
2. Airtable — look up Tax Season Bundle row, check current week
3. If current week matches escalation schedule:
   - Update `Price — own site`, `Price — Gumroad`, `Price — Payhip`
   - Trigger W06 Product Updater to push to all storefronts
4. Slack notification confirming change
5. Log entry in Airtable Metrics for "price-changed-tax-season-bundle"

---

### W15 — Pinterest Pin Performance Poll

**Priority:** P2

**Trigger:** Cron daily 08:00 ET.

**Nodes:**
1. Cron
2. Pinterest API — fetch analytics for all pins in last 24 hrs
3. For each pin, update Airtable Content row:
   - `View count`
   - `Save count`
   - `Outbound clicks`
4. Flag top 10% performers in a view called "Amplification candidates" (for Daniel to review and create variants via W16)
5. Flag bottom 10% performers (impressions < 50 after 14 days) for archival

---

### W16 — Blog Post Promotion Cascade

**Priority:** P2

**Trigger:** Airtable Content row: Type=`blog-post` AND Status changed to `Published`.

**Nodes:**
1. Airtable automation → n8n webhook
2. Airtable — fetch blog post row (title, URL, target keyword)
3. Claude API — generate 5 Pinterest pin variants:
   - Tip-list, Quote-card, Infographic, Question, Before/after
   - Each with pin title, description, hashtags
4. Vista Create API — generate 5 pin images from templates (if Vista Create API available; else push to Daniel's review queue with text-only)
5. Airtable — create 5 new Content rows of Type=`pinterest-pin`, Status=`Draft`, linked to blog post
6. Email draft: Claude writes an email broadcast announcing the blog post → queued in Airtable Content as Type=`email-broadcast`, Status=`Draft`
7. Slack notification to Daniel: "Blog post '<title>' published. 5 pin drafts + 1 email draft ready for review."

---

### W17 — Weekly Backup

**Priority:** P0

**Trigger:** Cron Sunday 02:00 ET.

**Nodes:**
1. Cron
2. **Airtable full base export**:
   - Get base schema
   - For each table: export all records as CSV
   - Save to `/tmp/backup/<date>/<table>.csv`
3. **IS export**:
   - Subscribers list → CSV
   - Products list → CSV
   - Orders list (last 30 days) → CSV (as IS-native audit, separate from Airtable Orders)
   - Save to `/tmp/backup/<date>/is-*.csv`
4. **Google Drive upload**:
   - Create folder `Backups/str-platform/<YYYY-MM-DD>/`
   - Upload all files
5. **Rotation:**
   - Keep all backups from last 30 days
   - Keep 1 backup per month for 12 months
   - Delete anything older than 12 months
6. Slack confirmation: "Weekly backup complete. N files. Size: X MB."
7. Error branch — if any step fails, alert loudly (backup failures compound)

**Verification step:** monthly, n8n opens one random backup file, checks row count isn't zero, writes result to Airtable Metrics. Trust but verify.

---

### W18 — Integrity Checker

**Priority:** P1

**Trigger:** Cron daily 03:00 ET.

**Purpose:** catch drift between Airtable (SSOT) and storefronts.

**Nodes:**
1. Cron
2. For each Products row where `Live on IS` = true:
   - IS API — fetch product
   - Compare name, description, prices, file hash
   - If mismatch → Airtable Errors row + Slack alert
3. For each Products row where `Live on Gumroad` = true:
   - Same check via Gumroad API
4. For each Airtable Customer with `IS contact ID`:
   - IS API — fetch contact
   - Verify tags match expected tags from purchase history
   - If mismatch → flag
5. Stripe reconciliation:
   - Fetch prior-day Stripe charges
   - Compare count to Orders in Airtable with platform=is
   - Mismatch → alert

**Self-healing:** for minor mismatches (stale descriptions, out-of-date prices on non-hub platforms), W18 can call W06 to resync. For material mismatches (wrong product entirely) it alerts instead.

---

### W19 — FB Group New Member

**Priority:** P2

**Trigger:** FB Group has no direct API for most member events. Two paths:
- **Path A (preferred):** Use Zapier or Pabbly "FB Group new member" trigger → call n8n webhook. Zapier seat cost ($20/mo) is worth it for this event.
- **Path B (manual):** Daniel reviews pending members daily and pastes the 3 entry-question answers into a Google Form → Google Forms → n8n.

**Nodes:**
1. Webhook (from Zapier or Form)
2. Parse the 3 entry-question answers:
   - Hosting status (active / planning / vendor)
   - Listing count
   - #1 headache
3. Claude API — infer persona from the answers:
   - "Planning to" → `dreamer`
   - "1 listing" → `newbie` or `sam`
   - "3+ listings" → `sarah`
   - "manages for others" → `pam`
4. Airtable — upsert Customer with `FB Group member` = true + inferred persona tag
5. Send welcome DM via Facebook Graph API (if possible) OR queue DM for Daniel to send manually
6. Error branch

**Why this matters:** FB Group is Sarah's home turf. Every new member is a high-intent lead for the paid membership (Phase 2). Capturing + tagging them in Airtable enables targeted outreach later.

---

### W20 — Affiliate Commission Cycle

**Priority:** P3 (Phase 2 — affiliate program launches Month 3)

**Trigger:** Cron 1st of each month 06:00 ET.

**Nodes:**
1. Cron
2. Airtable — query Orders last month where `Source campaign` starts with `affiliate:`
3. For each affiliate, sum commission (30–50% of Net amount based on affiliate tier)
4. Airtable — create Partners > PayoutQueue row per affiliate
5. Email Daniel with "N affiliates earned $X total, review and approve payouts"
6. After Daniel approves → trigger payout via Wise API (cheapest for international) or Stripe Connect
7. Log payouts in Airtable Partners > Payouts

**Commission tiers:**
- Standard: 30%
- Active (3+ referrals/mo): 40%
- Top-tier (10+ referrals/mo OR bundle buyers): 50%

---

### W21 — Research Outreach Pipeline

**Priority:** P3 (Phase 2 — using ScrapeBox + Instantly)

**Trigger:** File drop detected in Google Drive `str-platform/outreach-inbox/` folder (CSV from ScrapeBox scrape).

**Nodes:**
1. Google Drive polling (every 30 min for new files in the inbox folder)
2. Parse CSV: columns `name`, `email`, `website`, `context` (what they do — from ScrapeBox enrichment)
3. Airtable — upsert each row into Outreach Queue table, Status = `New`
4. For each row, Claude API drafts personalized message using the `context`:
   - Email subject (specific, not templated)
   - Email body (2–3 short paragraphs, one ask)
   - Save draft to Airtable Outreach Queue row
5. Daniel reviews each draft in Airtable → marks `Approve` or `Skip`
6. Approved drafts → push to Instantly API for sending
7. Instantly reply tracking → webhook back → Airtable row status `Replied`
8. Daniel handles replies manually in his inbox

**Safety:** never auto-send without Daniel's per-message approval. Cold outreach damage is existential (see spec §6.5 ScrapeBox/GSA discussion).

---

### W22 — Template Update Notification

**Priority:** P3

**Trigger:** Airtable Products row: Version changed with MAJOR or MINOR bump.

**Nodes:**
1. Airtable automation → n8n webhook
2. Airtable — find all Customers who purchased this product
3. For each customer:
   - IS API — send email "Your <product> was updated to v<new>. Re-download here: <link>"
   - Log notification in Airtable Customer's `Notification history`
4. Slack confirmation: "N customers notified about <product> v<new>"

**Why MAJOR/MINOR only:** patch bumps are silent (typo fixes, minor formula corrections) — notifying for every patch trains customers to ignore the emails.

---

## Build sequence (maps to Lane B tasks in plan)

### Phase 1 — Week 1–2 (P0 core — plan Task B8, B9, B11)

1. **W17 Weekly Backup** — build first, before any data exists. Zero-data baseline.
2. **W01 Order Ingestion (Stripe/IS)** — unblocks revenue capture.
3. **W02 Order Ingestion (Gumroad)** — unblocks second storefront.
4. **W05 Product Publisher** — unblocks catalog deployment.
5. **W08 Lead Magnet Delivery** — unblocks funnel capture.
6. **W04 Subscriber Sync** — unblocks CRM.

### Phase 2 — Week 3–4 (P1 scale)

7. **W03 Order Ingestion (Etsy polling)** — after first Etsy sale expected.
8. **W07 Refund Handler** — after first refund or preemptively.
9. **W06 Product Updater** — after first product edit needed post-launch.
10. **W09 Daily Revenue Rollup** — feeds Metrics + weekly briefings.
11. **W18 Integrity Checker** — once enough data to drift.
12. **W12 Customer Support Triage** — after first support volume.
13. **W13 Review Request** — after first week of sales.

### Phase 3 — Week 5–8 (P2 leverage)

14. **W10 Weekly Ops Briefing** — once F1 data exists.
15. **W11 Threshold Alerts** — once baselines established.
16. **W16 Blog Post Promotion Cascade** — once Ghost live + first post published.
17. **W15 Pinterest Pin Performance Poll** — once Pinterest account active.
18. **W14 Tax-Season Price Escalation** — pre-Feb 1 timing.
19. **W19 FB Group New Member** — once FB Group has traction (50+ members).

### Phase 4 — Month 4+ (P3 expansion)

20. **W20 Affiliate Commission Cycle** — with affiliate program launch.
21. **W21 Research Outreach Pipeline** — when ScrapeBox + Instantly are set up.
22. **W22 Template Update Notification** — when first major version bump occurs.

### Phase 5 — Course launch (Owner family L)

23. **W23 Course Purchase Onboarding** — must precede first paid course enrollment; depends on W01/W02 course-SKU Switch + Airtable `Course_Students` table.
24. **W24 Course Module Drip Unlock** — daily 06:00 cron; depends on W23 writing the unlock schedule per student.
25. **W25 First Saturday Tracker** — once Self-Study tier sees first cohort of buyers (~Day 5 post-launch).
26. **W26 Cohort Enrollment & Fulfillment** — required for the first paid Cohort tier; runs the calendar invites + group chat provisioning.
27. **W27 Cohort Group Call Reminders** — once first cohort is mid-flight (Week 2 of cohort).
28. **W28 Refund Reply Intake** — pre-launch defensive build; refund window is open from Day 1.
29. **W29 NPS Day-30 Collection** — fires Day 30 of first cohort.
30. **W30 Annual "What Changed" Distribution** — January 20 each year for the prior tax-year update.

For per-workflow detail on W23–W30, see the individual `.md` specs in `infrastructure/n8n/workflows/` (W23-course-purchase-onboarding through W30-annual-what-changed-distribution). The per-workflow specs section above ends at W22 because the course family was added after the initial map; rather than duplicating those specs here, treat the workflow `.md` files as the source of truth for L-family details.

---

## Testing strategy

### Per-workflow test pattern

Every workflow has a dedicated **test harness**:

1. **Unit:** trigger the workflow manually in n8n with synthetic payload → verify all nodes execute without error
2. **Integration:** trigger the real-world event (test purchase, test form submission, test refund) → verify downstream data lands correctly in Airtable + IS
3. **Failure:** simulate API failure (bad API key, timeout) → verify workflow fails gracefully, Errors row appears, Slack alert fires

### Shared staging base

Maintain a parallel Airtable base called `STR Platform — STAGING` with the same schema. Point test executions at staging to avoid polluting production data. Swap env vars when testing vs running.

### Regression checklist (run monthly)

- [ ] W01: test purchase $1 → order appears in Airtable within 60s
- [ ] W02: Gumroad test purchase → order appears within 60s
- [ ] W07: initiate refund on test order → Airtable reflects within 2 min
- [ ] W08: submit lead magnet form → IS contact created, tagged, Airtable Customer created
- [ ] W09: manually trigger → Metrics rows written for yesterday
- [ ] W17: manually trigger → files appear in Google Drive
- [ ] W18: create known drift (edit IS product manually) → integrity check catches on next run

---

## Monitoring & observability

### What to monitor

| Metric | Target | Alert threshold |
|---|---|---|
| Workflow execution success rate | >99% | <95% = Slack alert |
| Webhook receipt latency (any → Airtable write) | <30s p95 | >60s p95 = investigate |
| n8n queue depth | <5 pending | >20 = backlog building, scale up |
| Airtable API call rate | <4 req/s | >5 req/s = approaching rate limit |
| Claude API cost (monthly) | <$150 | >$200 = audit usage |
| Backup success (W17) | 100% weekly | Any miss = P0 |

### Dashboards

- **n8n native dashboard:** execution list with success/failure per workflow. Check weekly.
- **Airtable dashboard views:**
  - "Errors in last 24 hrs" on Errors table
  - "Failed executions" on Metrics (tagged metric)
  - "Workflow health" summary card

### Alerting channels

- Slack channel `#str-platform-alerts` for all threshold alerts + workflow failures
- Email to `hello@thestrledger.com` for weekly briefing only
- SMS (via Twilio) for P0 alerts only: Stripe auth failure, Airtable API outage, n8n VPS unreachable

---

## Error handling patterns (consistent across all workflows)

### The "Errors branch" template

Every workflow's error path does the same thing:

```
Error caught
    │
    ▼
Function: build error envelope {
  workflow_id, node_name, timestamp,
  error_message, payload_excerpt (first 500 chars),
  retry_count
}
    │
    ▼
Airtable: Create Errors row (Status=Open)
    │
    ▼
Slack: Post to #str-platform-alerts with deep-link to Airtable row
    │
    ▼
If retry_count < 3: wait (exponential backoff), retry original node
If retry_count >= 3: do not retry; human must resolve
```

### Error table workflow

Errors table has a companion process (manual, weekly):

1. Daniel or Claude reviews Errors table Mondays
2. Categorizes: transient (API hiccup) / systemic (bad code or config) / external (provider issue)
3. Transient → mark `Ignored`, note pattern
4. Systemic → open a fix task
5. External → note and monitor for recurrence

### Idempotency

Every ingestion workflow (W01, W02, W03) is idempotent:

- Use `Order ID` as dedup key — if already in Airtable, update instead of duplicate
- Webhooks have replay semantics; treat every event as potentially duplicate

### Retry policy

| Event type | Retry | Max attempts | Backoff |
|---|---|---|---|
| API transient (429, 503) | ✅ | 3 | Exponential: 2s, 8s, 32s |
| API auth (401, 403) | ❌ | 1 | — (auth is never transient) |
| Payload malformed | ❌ | 0 | — (log + alert) |
| Airtable rate limit | ✅ | 5 | Linear: 30s each |

---

## Security considerations

### Credential management

Every API key used in n8n lives in **n8n's Credentials manager** (encrypted at rest with `N8N_ENCRYPTION_KEY`). Never hardcode keys in workflow JSON.

| Service | Credential type | Rotation |
|---|---|---|
| Stripe | Restricted key (scoped to events needed) | Annual |
| IS | API key | Annual |
| Gumroad | API key | Annual |
| Etsy | OAuth 2.0 tokens (refresh automated) | Token refresh automatic; full re-auth every 6 months |
| Airtable | Personal Access Token | Annual |
| Google Drive | OAuth | Annual |
| Slack | Bot token | Annual |
| Claude API | API key | Annual |
| Cloudflare (for DNS updates) | API token | Annual, scoped to zone |

### Webhook signature validation

**Every inbound webhook validates a signature:**
- Stripe: `STRIPE_WEBHOOK_SECRET` + HMAC-SHA256
- Gumroad: shared secret
- IS: if provides signed webhooks, validate; if not, use IP allowlist

Unsigned / unvalidated webhooks are dropped with 401.

### PII handling

- Emails stored lowercase in Airtable
- Never log full payload to Slack (only error + first 500 chars of payload)
- Payment card data never touches n8n — Stripe is the boundary
- Tax IDs never touch n8n — only in Stripe + Etsy seller portal

### Network

- n8n is behind Cloudflare Tunnel (not publicly routable)
- Only `/webhook/*` paths accept external POSTs
- n8n admin UI accessible only via basic auth + Cloudflare Access (consider adding IP restriction for Daniel's home IP)

---

## Cost model for all workflows

| Item | Approximate monthly |
|---|---|
| n8n self-hosted VPS | $6–10 |
| Airtable API (within free tier → Team plan) | $20 |
| Claude API (W10 briefing + W12 triage + W16 pin drafts) | $50–150 depending on volume |
| Zapier (for W19 only) | $20 |
| Instantly (W21 only, Phase 2) | $97 |
| **Phase 1 total** | **~$76–200** |
| **Phase 2 total** | **~$193–317** |

Cost scales with volume but modestly — these are infrastructure costs, not per-transaction.

---

## Folder layout in this repo

```
infrastructure/n8n/
├── install.md                         # VPS + n8n install (Task B2)
├── workflows-map.md                   # this file (overview)
└── workflows/                         # per-workflow specs + JSON exports
    ├── W01-order-ingestion-stripe.md
    ├── W01-order-ingestion-stripe.json   # exported from n8n
    ├── W02-order-ingestion-gumroad.md
    ├── W02-order-ingestion-gumroad.json
    ├── ...
    ├── W22-template-update-notification.md
    ├── W23-course-purchase-onboarding.md
    ├── W23-course-purchase-onboarding.json
    ├── ...
    └── W30-annual-what-changed-distribution.json
```

Each workflow gets its own `.md` spec + `.json` export once built. The `.md` captures *why*; the `.json` captures *what n8n runs*. Both committed to git so the infrastructure is reproducible if the VPS is ever lost.

---

## What's NOT a workflow (handled elsewhere)

To prevent scope creep, these do NOT belong in n8n:

- **Email sequence delivery** — IS handles natively (see `copy/email-sequences/`)
- **Cart abandonment flow** — IS native automation
- **Subscription billing** — Stripe + IS native
- **Affiliate link generation** — IS native affiliate module
- **Membership content gating** — IS native
- **Website A/B testing** — Ghost + IS native
- **Social post scheduling** — Creasquare (multi-platform: IG, LinkedIn, YouTube, TikTok, FB) + Pinterest native scheduler
- **Excel template file edits** — manual human work in Excel

n8n glues the world together. It is not a replacement for any of these tools' native capabilities.

---

## Change log

- `2026-04-22` — Initial workflow universe documented (22 workflows)
- `2026-04-29` — Added Owner family L (Course): W23–W30. W01 + W02 gain a course-SKU Switch node forwarding `course-*` orders to W23's `/webhook/course-onboarding`.
- (future entries as the map evolves)
