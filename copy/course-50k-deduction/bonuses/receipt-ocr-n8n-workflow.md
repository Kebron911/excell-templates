# Bonus B6 — The Receipt-OCR n8n Workflow

**Format:** Importable n8n workflow JSON + setup video + this spec
**Course module:** Module 2 (Lesson 2.4) — referenced; lives as bonus
**Use case:** Email a receipt photo → categorized row in your TAX-002 workbook within 90 seconds

> **Operationalizes the brand's first principle: if a task is repeatable, automate it once and never do it again.**
>
> Forward a receipt photo to a dedicated email address. The workflow OCRs the image, extracts vendor + amount + date, runs the receipt against the Categorization Rule Library, and appends a row to your workbook (or Airtable, or Google Sheets) with the photo URL. Three minutes a quarter, not three hours.

---

## What the workflow does

```
                  ┌──────────────────────────────┐
                  │ Host photographs receipt     │
                  │ on phone, forwards to        │
                  │ receipts@thestrledger.com    │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ n8n IMAP trigger fetches     │
                  │ the email + attachment       │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ Image uploaded to S3 / Drive │
                  │ → permanent URL              │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ OCR engine extracts text     │
                  │ (Google Vision / Mindee /    │
                  │ AWS Textract / Veryfi)       │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ Parser extracts:             │
                  │   • vendor                   │
                  │   • date                     │
                  │   • subtotal / tax / total   │
                  │   • property tag (from email │
                  │     subject or body)         │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ Rule library matches vendor  │
                  │ → Schedule E line + category │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │ Confidence: High / Medium   │ Confidence: Low / no match
                  ▼                             ▼
        ┌──────────────────────┐    ┌────────────────────────────┐
        │ Append row to        │    │ Append row to Review queue │
        │ TAX-002 / Airtable / │    │ + Slack/Telegram alert     │
        │ Google Sheets        │    │ to host's phone for manual │
        └──────────┬───────────┘    │ categorization later       │
                   │                └──────────┬─────────────────┘
                   │                           │
                   └─────────────┬─────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ Confirmation email back to   │
                  │ host (single-line summary)   │
                  └──────────────────────────────┘
```

Total time per receipt, host-side: ~10 seconds (snap and forward). Workflow runs in ~30 seconds.

---

## Architecture

| Layer | Recommended tool | Alternates |
|---|---|---|
| **Email intake** | n8n IMAP node (Gmail or any IMAP host) | Mailgun, ImprovMX |
| **File storage** | AWS S3 or Google Drive | Dropbox, Backblaze B2 |
| **OCR** | **Veryfi** *(recommended — purpose-built for receipts)* | Mindee, Google Vision, AWS Textract |
| **Workflow engine** | n8n self-hosted on `n8n.thestrledger.com` | Make, Zapier (course supports n8n only) |
| **Storage destination** | Airtable *(recommended, integrates with workbook)* | Google Sheets, direct Excel via Microsoft Graph |
| **Alerts** | Telegram bot or Slack | Pushover, email |

---

## Why Veryfi over generic OCR

Generic OCR (Google Vision, AWS Textract) returns raw text. Receipt-specific OCR (Veryfi, Mindee) returns *structured fields* — vendor, total, subtotal, tax, line items, date — with high accuracy on receipt-formatted images.

Cost difference: Veryfi ≈ $0.08/receipt; generic OCR ≈ $0.001/page but requires custom parsing logic.

For a host processing ~200 receipts/year, Veryfi is $16/year. Worth the line. The course assumes Veryfi.

---

## Email intake convention

Receipts are forwarded to a dedicated address. The course assumes:

```
receipts@thestrledger.com           (master inbox; routes by subject)
receipts+cabinA@thestrledger.com    (per-property variant via plus-addressing)
receipts+cabinB@thestrledger.com
receipts+cabinC@thestrledger.com
```

Plus-addressing (the `+cabinA` portion) is parsed by the workflow to assign the property tag automatically. Hosts who use Gmail or any plus-addressing-capable provider can run this with a single inbox.

**Subject line convention** (alternative for providers without plus-addressing):

```
Subject: Cabin A — repair                  → tagged property: Cabin A; intent: repair
Subject: B - utilities                     → tagged property: Cabin B; intent: utilities
Subject: C                                 → tagged property: Cabin C; intent: auto-detect
Subject: (blank)                           → routed to Review queue
```

The workflow parses subject lines case-insensitively for "Cabin A/B/C" tokens (or whatever property aliases the host configured at setup).

---

## n8n workflow nodes (in order)

### Node 1 — IMAP Trigger

```yaml
type: IMAP Email
host: imap.gmail.com
user: receipts@thestrledger.com
mailbox: INBOX
mark_as_read: true
download_attachments: true
filter:
  has_attachment: true
poll_interval: 60s
```

### Node 2 — Filter: receipts only

```javascript
// Only process emails with image or PDF attachments
return $input.all().filter(item =>
  item.binary &&
  Object.values(item.binary).some(b =>
    b.mimeType.startsWith('image/') || b.mimeType === 'application/pdf'
  )
);
```

### Node 3 — Parse subject for property tag

```javascript
const subject = $json.subject || '';
const propertyMatch = subject.match(/cabin\s*([abc])/i) ||
                      subject.match(/property\s*([abc])/i) ||
                      subject.match(/^([abc])(?:\s|-|$)/i);

const property = propertyMatch
  ? `Cabin ${propertyMatch[1].toUpperCase()}`
  : 'UNASSIGNED';

return { ...$json, property };
```

### Node 4 — Upload image to S3

```yaml
type: AWS S3
bucket: thestrledger-receipts
key: receipts/{{$json.property}}/{{$now.format('yyyy/MM')}}/{{$json.message_id}}.jpg
acl: private
content_type: image/jpeg
```

S3 returns a permanent object URL stored as `$json.image_url`.

### Node 5 — Veryfi OCR

```yaml
type: HTTP Request
method: POST
url: https://api.veryfi.com/api/v8/partner/documents/
headers:
  Authorization: apikey ${VERYFI_USERNAME}:${VERYFI_API_KEY}
  Client-Id: ${VERYFI_CLIENT_ID}
body:
  file_url: {{$json.image_url}}
  categories: ['Maintenance', 'Utilities', 'Supplies', 'Travel', 'Office', 'Other']
```

Veryfi returns structured fields. Key extracted fields:

```json
{
  "vendor": { "name": "HOME DEPOT" },
  "date": "2026-04-28",
  "total": 1140.18,
  "subtotal": 1056.65,
  "tax": 83.53,
  "category": "Maintenance",
  "line_items": [...]
}
```

### Node 6 — Apply Categorization Rule Library

```javascript
// Rules table loaded from Airtable / static config
const rules = $('Load Rules').first().json.rules;
const vendor = $json.vendor.name.toLowerCase();
const amount = $json.total;

let match = null;
for (const rule of rules) {
  if (rule.match_type === 'vendor_contains' && vendor.includes(rule.match_value.toLowerCase())) {
    match = rule;
    break;
  }
  if (rule.match_type === 'vendor_and_amount') {
    if (vendor.includes(rule.match_value.toLowerCase()) && eval(rule.amount_condition.replace('amount', amount))) {
      match = rule;
      break;
    }
  }
}

return {
  ...$json,
  category: match?.category || 'Review',
  schedule_e_line: match?.schedule_e_line || null,
  confidence: match?.confidence || 'low',
  rule_id: match?.rule_id || null
};
```

### Node 7 — Switch on confidence

Three paths from here:

- **High confidence** → Append to main ledger
- **Medium confidence** → Append to main ledger + add to medium-review batch
- **Low / no match** → Append to Review queue + Telegram alert

### Node 8a — Append to Airtable (high/medium)

```yaml
type: Airtable
operation: append
base: thestrledger-bookkeeping
table: Transactions
fields:
  Date: {{$json.date}}
  Property: {{$json.property}}
  Vendor: {{$json.vendor.name}}
  Subtotal: {{$json.subtotal}}
  Tax: {{$json.tax}}
  Total: {{$json.total}}
  Schedule_E_Line: {{$json.schedule_e_line}}
  Category: {{$json.category}}
  Confidence: {{$json.confidence}}
  Receipt_URL: {{$json.image_url}}
  Source: ocr-receipt-workflow
  Status: pending-review-{{$json.confidence === 'medium' ? 'batched' : 'no'}}
```

### Node 8b — Append to Review queue (low)

```yaml
type: Airtable
operation: append
base: thestrledger-bookkeeping
table: Review_Queue
fields:
  [same as 8a, plus]
  Reason: no-rule-match-or-low-confidence
```

### Node 8c — Telegram alert (low only)

```yaml
type: Telegram
chat_id: ${HOST_TELEGRAM_CHAT_ID}
text: |
  📥 Receipt needs review
  ────────────────────────
  Property: {{$json.property}}
  Vendor: {{$json.vendor.name}}
  Total: ${{$json.total}}
  Date: {{$json.date}}

  Open Review queue: https://airtable.com/...
```

*(Note: emoji shown for the Telegram alert example only. Course-shipped configuration uses an Inter-rendered icon, not emoji, in any user-facing UI per brand voice rules.)*

### Node 9 — Confirmation email back to host

```yaml
type: Send Email
to: {{$json.from}}
subject: "Captured: {{$json.vendor.name}} ${{$json.total}}"
body: |
  Logged.

  Property:  {{$json.property}}
  Vendor:    {{$json.vendor.name}}
  Total:     ${{$json.total}}
  Date:      {{$json.date}}
  Category:  {{$json.category}} (Schedule E line {{$json.schedule_e_line}})

  Receipt photo: {{$json.image_url}}

  {{$json.confidence === 'low' ? 'Routed to Review queue — open at https://airtable.com/...' : 'Auto-categorized.'}}
```

---

## Workbook integration (Airtable → TAX-002 / TAX-004)

The workflow appends to an Airtable base. The workbook pulls from Airtable on the quarterly Saturday via:

- **Power Query** in Excel (Microsoft 365) — refreshes from Airtable's REST API
- **Manual export** as CSV — pasted into the workbook's Import tab
- **Direct Airtable view** — for hosts who run Airtable as the primary ledger

The course supports all three. Default setup video assumes Power Query because most STR hosts run Excel locally.

---

## Setup video outline (8 minutes)

```
00:00–00:30  What this workflow does (one-line summary + the time savings)
00:30–01:30  Account setup — Veryfi (free trial), Telegram bot, Airtable base
01:30–02:30  n8n self-host or n8n.thestrledger.com (course-provided shared instance)
02:30–04:30  Import the workflow JSON; configure credentials
04:30–05:30  Test: send a sample receipt; watch the logs; verify Airtable row
05:30–06:30  Configure Telegram alerts; configure email forwarding
06:30–07:30  Configure Power Query in Excel to pull Airtable into TAX-002
07:30–08:00  Quarterly Saturday workflow: how this changes the seven-minute tab
```

---

## Cost to run

| Service | Cost |
|---|---|
| Veryfi receipt OCR | $0.08/receipt × ~200/year ≈ **$16/year** |
| n8n (self-hosted Hetzner $5/mo or course-shared) | $0–$60/year |
| AWS S3 storage (~5GB receipts) | $1.50/year |
| Airtable (free tier covers ~1,200 records/yr) | $0 |
| Telegram bot | $0 |
| **Total** | **~$20–$80/year** |

Worth comparing to the alternative — entering 200 receipts manually at 60 seconds each = 3.3 hours/year. At any reasonable hourly value, the workflow pays for itself by receipt #5.

---

## What this workflow doesn't do

- **Doesn't handle multi-property receipt splits.** A single receipt with items for two cabins routes to the Review queue.
- **Doesn't categorize Amazon orders well.** Amazon receipts arrive without item-level detail unless the host forwards the order email (not the shipping email) — the workflow handles both formats but Amazon orders still route to Review for line-item allocation.
- **Doesn't replace the Categorization Rule Library.** The workflow uses the same library as the workbook; rules updated in one update both.
- **Doesn't run if the OCR fails.** If Veryfi can't parse the image (blurry, partial, non-receipt), the email is routed to Review queue with the raw image attached. Host categorizes manually.

---

## Security & data handling

- Receipts sent to S3 with private ACL; presigned URLs only for OCR fetch.
- Veryfi processes images server-side; review their data-retention terms before relying on them as the OCR layer.
- Airtable base is private; access via API key stored in n8n credentials (never in workflow JSON).
- Telegram bot token rotated annually as part of the January refresh.
- The workflow does **not** log full receipt content to n8n's execution history beyond the structured fields needed for the row.

---

## Course shipment

The workflow ships as:

```
/06-automation/
   receipt-ocr-workflow.json         ← n8n importable
   airtable-base-template.json       ← Airtable importable schema
   power-query-config.txt            ← paste-into-Excel template
   setup-video.mp4                   ← 8-min walkthrough
   troubleshooting.md                ← common errors + fixes
```

Course members get the workflow JSON pre-configured with the Categorization Rule Library v1 baked in. January updates ship as a new JSON; users replace and reconfigure their host-customized rules.

---

*Last reviewed: 2026-04-28. Third-party services (Veryfi, n8n, AWS) have their own pricing, terms of service, and data-handling practices — review and accept before deploying. The workflow is provided as-is; production deployment is the host's responsibility.*
