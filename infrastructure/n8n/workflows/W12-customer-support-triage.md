# W12 — Customer Support Triage

**Priority:** P1

**Family:** D — Customer experience / brand voice

**Summary:** Polls `hello@thestrledger.com` every 2 min, classifies inbound mail with Claude (faq | refund_request | bug_report | feature_request | sales_inquiry | spam), drafts a brand-voice response, and routes to the correct downstream action — auto-refund within policy, draft queue for nuance, archive for spam.

---

## Trigger

IMAP poll of `hello@thestrledger.com`, mailbox `INBOX`, every 2 minutes.

Configured in **n8n → Credentials → IMAP** (cred ID `9`):
- Host: `imap.gmail.com` (or workspace IMAP)
- Port: 993, TLS on
- User: `hello@thestrledger.com`
- App password (NOT main account password)

Polling cadence: every 2 min via the node's built-in `forceReconnect: 60` and n8n trigger interval. Read messages are marked seen (`postProcessAction: read`) so they don't re-trigger.

## Node-by-node configuration

### Node 1 — Inbox Poll (IMAP)

- **Mailbox:** `INBOX`
- **Format:** `simple` (returns `from`, `subject`, `text`, `messageId`)
- **Post process:** mark as read
- **Force reconnect:** every 60 min to keep IMAP session healthy
- **Credentials:** IMAP cred ID `9`

### Node 2 — Function: Extract Email Fields

```js
const msg = $input.first().json;
const from_raw = msg.from || '';
const from_match = from_raw.match(/<([^>]+)>/);
const from_email = (from_match ? from_match[1] : from_raw).toLowerCase().trim();
const from_name = from_raw.split('<')[0].replace(/"/g, '').trim();
const subject = (msg.subject || '(no subject)').slice(0, 500);
const body_raw = msg.text || msg.textHtml || msg.textPlain || '';
const body = body_raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 8000);
const message_id = msg.messageId || msg.uid || `msg-${Date.now()}`;

if (!from_email || !from_email.includes('@')) {
  throw new Error('No valid sender email parsed from inbound message');
}

const lc = (subject + ' ' + body).toLowerCase();
const is_auto = /(out of office|auto-?reply|delivery (status|failure)|undeliverable|mailer-daemon|do[- ]not[- ]reply|noreply@)/i.test(lc);

return [{ json: { message_id, from_email, from_name, subject, body, received_at: new Date().toISOString(), is_auto } }];
```

### Node 3 — HTTP: Claude Classify + Draft

- **URL:** `POST https://api.anthropic.com/v1/messages`
- **Auth:** Header auth, cred ID `7` (sets `x-api-key` header)
- **Headers:** `anthropic-version: 2023-06-01`, `content-type: application/json`
- **Model:** `claude-opus-4-7`
- **Max tokens:** 1500
- **System prompt:** triage system for The STR Ledger; brand voice direct, friendly, signs `— The STR Ledger`; returns STRICT JSON, no fences.
- **User prompt:** asks for `{classification, confidence, reasoning, draft_response, detected_product, refund_in_policy}` JSON, given `from_email`, `subject`, `body`.

### Node 4 — Function: Parse Claude Response

```js
const claude = $input.first().json;
const email = $node['Extract Email Fields'].json;

const raw_text = claude?.content?.[0]?.text || '';
if (!raw_text) throw new Error('Claude returned empty content');

let parsed;
try {
  const cleaned = raw_text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  parsed = JSON.parse(cleaned);
} catch (e) {
  throw new Error('Could not parse Claude JSON: ' + e.message);
}

const valid = ['faq','refund_request','bug_report','feature_request','sales_inquiry','spam'];
let classification = (parsed.classification || '').toLowerCase().trim();
if (!valid.includes(classification)) classification = 'faq';
if (email.is_auto) classification = 'spam';  // auto-reply override

return [{ json: {
  ...email,
  classification,
  confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
  reasoning: parsed.reasoning || '',
  draft_response: parsed.draft_response || '',
  detected_product: parsed.detected_product || null,
  refund_in_policy: !!parsed.refund_in_policy,
  priority: classification === 'sales_inquiry' || classification === 'bug_report' ? 'high' : 'normal'
}}];
```

### Node 5 — Switch: Route by Classification

Six output branches, one per classification value (`faq`, `refund_request`, `bug_report`, `feature_request`, `sales_inquiry`, `spam`).

### Node 6 — Airtable: FAQ Draft to SupportDrafts (faq branch)

- Table `TABLE_ID_SUPPORT_DRAFTS`, operation **create**
- Fields: Message ID, Received at, From email, From name, Subject, Body, Classification=`faq`, Confidence, Draft response, Priority=`normal`, Status=`Awaiting Daniel review`

### Node 7 — Airtable: Lookup Order by Email (refund_request branch)

- Table `TABLE_ID_ORDERS`, operation **search**
- Filter: `AND(LOWER({Customer email}) = '<from_email>', {Refund status} = 'none')`
- Sort: Timestamp desc, limit 1

### Node 8 — Function: Refund Eligibility Gate

```js
const email = $node['Parse Claude Response'].json;
const orders = $input.all().map(i => i.json).filter(o => o && (o.id || o.fields));

if (!orders.length) {
  return [{ json: { ...email, eligibility: 'no_order_found', within_window: false, order: null } }];
}
const order = orders[0];
const fields = order.fields || order;
const ts = fields['Timestamp'];
const order_age_days = ts ? (Date.now() - new Date(ts).getTime()) / (1000 * 60 * 60 * 24) : 999;
const within_window = order_age_days <= 14;
const platform = (fields['Platform'] || '').toLowerCase();
const order_id = fields['Order ID'] || '';
const gross = parseFloat(fields['Gross amount'] || 0);
const stripe_pi = fields['Stripe payment intent'] || null;
const gumroad_sale_id = fields['Gumroad sale ID'] || null;

let eligibility = 'human_review';
if (within_window && (platform === 'is' || platform === 'gumroad') && (stripe_pi || gumroad_sale_id) && gross > 0) {
  eligibility = 'auto_approve';
}

return [{ json: { ...email, eligibility, within_window, order_age_days, order_record_id: order.id, order_id, platform, gross, stripe_payment_intent: stripe_pi, gumroad_sale_id } }];
```

### Node 9 — Switch: Auto-Approve?

- Branch `auto`: `eligibility == 'auto_approve'` → Refund Platform Switch
- Branch `human`: anything else → Refund Human Review Queue

### Node 10 — Switch: Refund Platform (when auto-approved)

Routes to Stripe Refund (platform=is) or Gumroad Refund (platform=gumroad).

### Node 11 — HTTP: Stripe Refund

- `POST https://api.stripe.com/v1/refunds`
- Header auth cred ID `10`
- Body (form-urlencoded): `payment_intent`, `reason=requested_by_customer`, `metadata[workflow]=W12`, `metadata[order_id]=...`

### Node 12 — HTTP: Gumroad Refund

- `PUT https://api.gumroad.com/v2/sales/<sale_id>/refund`
- Header auth cred ID `11`

### Node 13 — Airtable: Mark Order Refunded

- Table `TABLE_ID_ORDERS`, operation **update** by record ID
- Fields: `Refund status = full`, `Refund date = now`, `Refund reason = "Customer support request (W12 auto-approved)"`

### Node 14 — Email Send: Refund Confirmation

- From `hello@thestrledger.com`, SMTP cred ID `8`
- To customer email
- Subject `Re: <original subject>`
- Body: Claude's draft response + appended refund-confirmation line

### Node 15 — Airtable: Refund Human Review Queue

- Same SupportDrafts table, Classification=`refund_request`, Priority=`high`, with eligibility/age notes appended

### Node 16 — Airtable: Bug Report to ProductIssues

- Table `TABLE_ID_PRODUCT_ISSUES`, operation **create**
- Fields: Reported at, Reporter email, Reporter name, Subject, Description, Detected product, Source=`support email`, Severity=`Triage`, Status=`Open`, Original message ID

### Node 17 — Airtable: Bug Draft to SupportDrafts

- Mirrors the bug into SupportDrafts so Daniel can reply in one queue

### Node 18 — Airtable: Append Feedback to Customer (feature_request branch)

- Table `TABLE_ID_CUSTOMERS`, operation **upsert** on Email
- Fields: Email, First name, Last feedback at, Feedback notes (timestamped append)

### Node 19 — Email Send: Feature Thank-You

- Auto-sends Claude's drafted thank-you (low risk — no commitments, no money)

### Node 20 — Airtable: Sales Inquiry to SupportDrafts

- Same SupportDrafts table, Priority=`high`, Status=`Awaiting Daniel review`

### Node 21 — NoOp: Spam Archive

- Pass-through; IMAP node already marked the message read so it stays in inbox archived state

### Node 22 — Slack Triage Notification

- Channel `#str-platform-support`
- Message: classification, confidence %, from, subject, reasoning

### Error branch (Build Error Envelope → Log Error to Airtable → Slack Error Alert)

Fires on any node configured with `onError: continueErrorOutput`. Writes envelope `{ timestamp, workflow, node, error_message, payload, status: 'Open' }` to `TABLE_ID_ERRORS`, then alerts `#str-platform-alerts`.

## Inputs

- IMAP message at `hello@thestrledger.com`
- Environment / credentials: cred 1 (Airtable), 3 (Slack), 7 (Claude API), 8 (SMTP), 9 (IMAP), 10 (Stripe Refund), 11 (Gumroad Refund)

## Outputs

- 1× SupportDrafts row (faq / refund_human_review / bug / sales) OR
- 1× ProductIssues row + 1× SupportDrafts row (bug branch) OR
- 1× Customers upsert + 1× outbound thank-you email (feature branch) OR
- 1× Stripe/Gumroad refund + 1× Orders update + 1× outbound refund email (auto-approved refund) OR
- No-op archive (spam)
- Always: 1× Slack notification to `#str-platform-support`

## Dependencies

- Airtable tables: SupportDrafts, ProductIssues, Customers, Orders, Errors with the field names referenced above
- IMAP credentials configured for `hello@thestrledger.com`
- Stripe restricted API key with `refunds:write` scope (cred 10)
- Gumroad access token (cred 11)
- Anthropic API key (cred 7)
- W01 / W02 must already populate Orders table with `Customer email`, `Stripe payment intent`, `Gumroad sale ID`, `Platform`

## Edge cases

| Case | Handling |
|---|---|
| Out-of-office / auto-reply | Detected in Node 2, forced to `spam` classification, archived |
| Unparseable Claude JSON | Error branch fires, message remains in queue for Daniel |
| Refund request, no matching order | `eligibility: no_order_found` → human review queue |
| Refund request, order > 14 days old | `eligibility: human_review` → human review queue |
| Stripe refund API error | Error branch; Daniel manually refunds and updates Orders |
| Customer with no purchase asks question | FAQ branch handles fine; no order lookup attempted |
| Multiple replies in same thread | Each polled separately as new message; idempotent on Message ID in SupportDrafts |
| Foreign-language email | Claude handles classification but `draft_response` may be in source language; Daniel reviews |
| Spam with embedded HTML | Stripped in Node 2 regex; classification still works on plain text |

## Test cases

1. **FAQ — "How do I open this in Excel for Mac?"**
   - Expected: SupportDrafts row, Classification=faq, draft_response present, no email sent, Slack ping.
2. **Refund within window, IS/Stripe order**
   - Expected: Stripe refund created, Order updated to `Refund status=full`, confirmation email sent, Slack ping.
3. **Refund within window, Gumroad order**
   - Expected: Gumroad PUT refund succeeds, Order updated, email sent.
4. **Refund outside 14-day window**
   - Expected: `Refund Human Review Queue` row with eligibility note, no refund call, no auto-email.
5. **Refund request, no order found for sender email**
   - Expected: Human review queue with `eligibility: no_order_found`.
6. **Bug report — "Formula in B17 returns #REF!"**
   - Expected: ProductIssues row + SupportDrafts row, Severity=Triage, Slack ping.
7. **Feature request — "Could you add VRBO support?"**
   - Expected: Customers upsert with feedback note, thank-you email auto-sent.
8. **Sales inquiry — "Do you have a bundle discount?"**
   - Expected: SupportDrafts row Priority=high, Slack ping, no auto-email.
9. **Spam / cold pitch**
   - Expected: NoOp branch, Slack ping showing classification=spam.
10. **Out-of-office bounce**
    - Expected: Forced to spam in Node 2 even if Claude classifies otherwise.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Triage execution success rate | > 99% | < 95% = investigate |
| Time inbox-to-Airtable | < 3 min p95 | > 10 min = IMAP poll lagging |
| Auto-refund failure rate | < 2% | > 5% = check Stripe / Gumroad creds |
| Mis-classifications caught by Daniel review | < 10% | > 20% = retune Claude prompt |
| SupportDrafts queue depth | < 20 | > 50 = Daniel needs to triage / hire help |

## Deployment

1. Create Airtable tables: `SupportDrafts`, `ProductIssues` with the field schema referenced above.
2. Configure n8n credentials: Airtable (1), Slack (3), Claude API (7), SMTP (8), IMAP (9), Stripe Refund (10), Gumroad Refund (11).
3. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_*` placeholders in the JSON.
4. Import `W12-customer-support-triage.json` into n8n.
5. Activate workflow.
6. Send a test email to `hello@thestrledger.com` with a clear FAQ question — verify SupportDrafts row + Slack ping.
7. Send a refund-request test (use a Stripe test-mode order) — verify Stripe refund + email.
8. Monitor `#str-platform-support` and the SupportDrafts queue for the first 48 hrs; tune Claude prompt if mis-classifications cluster.

## Iteration log

- `2026-04-27` — Initial spec. Unimplemented.
- (future entries as the workflow evolves in production)
