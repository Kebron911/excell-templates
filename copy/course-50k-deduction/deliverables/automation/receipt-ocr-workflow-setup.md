# Receipt-OCR Workflow — Setup Guide

**Course bonus:** B6
**File:** `receipt-ocr-workflow.json`
**Estimated setup time:** 30 minutes
**Operating cost:** $20–$80/year

> **Forward a receipt photo to a dedicated email address. The workflow OCRs the image, extracts vendor + amount + date, runs the categorization rule library, and appends a categorized row to your TAX-002 Airtable mirror — all within 30 seconds.**

---

## Prerequisites

You'll need accounts at the following services. Most have free tiers that cover the volume of a typical STR portfolio.

| Service | Purpose | Cost |
|---|---|---|
| **n8n** (self-hosted or n8n.cloud) | Workflow runtime | $0–$60/year |
| **Veryfi** | Receipt OCR | ~$0.08/receipt × ~200/year ≈ $16/year |
| **AWS S3** | Receipt image storage | ~$1.50/year |
| **Airtable** | Transactions database | $0 (free tier ≈ 1,200 records) |
| **Telegram** | Optional alerts | $0 |
| **Email inbox** | Receipt forwarding target | $0 (any IMAP-capable inbox) |

---

## Step 1 — Set up the email inbox

Create a dedicated email address for receipts. Examples:

- `receipts@yourdomain.com` (Google Workspace, FastMail, Zoho)
- `receipts.<yourname>@gmail.com` (free Gmail with plus-addressing support)

**Recommended:** an inbox that supports plus-addressing — `receipts+cabinA@...` automatically tags receipts to Cabin A. Both Gmail and most paid providers support this.

If your provider doesn't, fall back to subject-line tagging:
- Subject contains "Cabin A" → property = Cabin A
- Subject contains "B" or "Cabin B" → property = Cabin B
- etc.

---

## Step 2 — Set up Airtable

Create a new Airtable base named `STR Bookkeeping`. Add three tables:

### `Transactions` table

```
Field                  | Type
─────────────────────|──────────
Date                   | Date
Property               | Single select  (Cabin A, Cabin B, Cabin C — adjust)
Vendor                 | Single line text
Subtotal               | Currency
Tax                    | Currency
Total                  | Currency
Schedule_E_Line        | Single select (3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19)
Category               | Single select (or single line text)
Confidence             | Single select (high, medium, low)
Receipt_URL            | URL
Source                 | Single line text
Status                 | Single select (captured, pending-review-batched, reviewed, final)
```

### `Review_Queue` table

```
Field                  | Type
─────────────────────|──────────
Date                   | Date
Property               | Single line text
Vendor                 | Single line text
Total                  | Currency
Receipt_URL            | URL
Reason                 | Single line text
```

### `Categorization_Rules` table

```
Field                  | Type
─────────────────────|──────────
rule_id                | Single line text  (e.g., "001")
match_type             | Single select (vendor_contains, vendor_equals, vendor_and_amount)
match_value            | Single line text  (e.g., "airbnb")
amount_condition       | Single line text  (optional, e.g., "amount < 500")
schedule_e_line        | Single line text
category               | Single line text
confidence             | Single select (high, medium, low)
```

Then populate `Categorization_Rules` with the 60-rule starter library (course bonus — see `categorization-rule-library.md`). Or upload the starter CSV that ships alongside this file.

---

## Step 3 — Set up AWS S3

Create an S3 bucket named (e.g.) `your-name-receipts`. Set it to private (no public access). Take note of the bucket name and your AWS region.

Generate an IAM user with permissions to write to this bucket only:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::your-name-receipts/*"
    }
  ]
}
```

Save the access key + secret. You'll add them to n8n.

---

## Step 4 — Set up Veryfi

1. Sign up at [veryfi.com](https://www.veryfi.com).
2. From your dashboard, copy:
   - **Client ID**
   - **Username**
   - **API Key**
3. Free tier covers the first ~10 receipts; upgrade to "Pay as you go" tier for ongoing use.

---

## Step 5 — (Optional) Set up Telegram bot

1. Open Telegram, search for `@BotFather`.
2. Send `/newbot`, follow prompts to create a bot. Save the bot token.
3. Start a chat with your bot, send any message.
4. Visit `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser; copy the `chat.id` from the response.

---

## Step 6 — Import the workflow into n8n

1. Open your n8n instance.
2. **Workflows → Import from File** → select `receipt-ocr-workflow.json`.
3. The workflow appears with placeholder credentials.

---

## Step 7 — Configure environment variables

In n8n's **Settings → Variables** (or your `.env` file if self-hosted):

```
S3_RECEIPTS_BUCKET = your-name-receipts
AWS_REGION = us-east-1               (or your region)
VERYFI_CLIENT_ID = vrf...
VERYFI_USERNAME = your_veryfi_username
VERYFI_API_KEY = vk...
AIRTABLE_BASE_ID = appXXXXXXXX        (from your Airtable base URL)
TELEGRAM_CHAT_ID = 123456789          (optional)
OUTBOUND_FROM_EMAIL = receipts@yourdomain.com
```

---

## Step 8 — Configure credentials

In n8n's **Credentials**, create the following:

1. **IMAP Email** — point at the inbox you set up in Step 1.
2. **AWS S3** — use the IAM user from Step 3.
3. **Airtable Personal Access Token** — generate at airtable.com/create/tokens with read/write to your `STR Bookkeeping` base.
4. **Telegram Bot Token** (optional) — paste the token from Step 5.
5. **SMTP** — for the confirmation email back to you. Most providers support SMTP; gmail.com works fine with an app password.

In each node of the workflow that has `REPLACE_WITH_YOUR_*_CREDENTIAL_ID`, click the credential dropdown and select your created credential.

---

## Step 9 — Activate the workflow

1. Click **Active** in the top-right of the workflow editor.
2. Test by emailing a receipt photo to your `receipts@...` inbox with subject "Cabin A" (or `receipts+cabinA@...`).
3. Within 60 seconds, expect:
   - A new row in `Transactions` (or `Review_Queue` if categorization was uncertain)
   - A confirmation email back to you
   - (If low confidence) a Telegram alert

---

## Step 10 — Tighten the rule library

After your first quarter of use:

1. Review the `Review_Queue` — these are the receipts the rule library couldn't auto-categorize.
2. For each repeating vendor, add a rule to `Categorization_Rules`.
3. Future receipts from that vendor will auto-categorize.

This is the "compounding" property of the workflow — every quarter, the rule library covers more of your transactions, and the manual review shrinks.

---

## How it integrates with the course's TAX-002 / TAX-004

The Airtable `Transactions` table is the receipts mirror. To round-trip back to the Excel spine for your CPA handoff:

1. Open Excel, **Data → Get Data → From Other Sources → From Airtable** (Power Query). Configure to your base.
2. Or, in Airtable's `Transactions` view, **Download CSV**, then paste into TAX-002's Import tab.

Both methods produce the same end state in TAX-004's Schedule E roll-up. Pick whichever fits your weekly rhythm.

---

## Troubleshooting

### "OCR returned wrong vendor or total"

Veryfi handles ~95% of receipts cleanly. For the 5% it doesn't:

- The receipt routes to `Review_Queue` automatically with reason `veryfi-ocr-failed`.
- Manually correct the row by clicking through to the photo and entering the right values.
- Add a rule to `Categorization_Rules` if the vendor appears repeatedly.

### "Email arrives but workflow doesn't fire"

- Check IMAP credentials in n8n.
- Verify the workflow is **Active** (top-right toggle).
- Check n8n's Executions log for errors.

### "Airtable returns rate-limit errors"

Airtable free tier limits to 5 requests/second. If you batch-forward many receipts at once, the workflow may rate-limit. Solution: spread receipts out, or upgrade Airtable to Team plan.

### "S3 upload fails"

Verify IAM policy includes `s3:PutObject` for your specific bucket. The error in n8n's log usually identifies the missing permission.

---

## Cost ledger (steady state)

For a 3-property STR running ~200 receipts/year:

| Service | Annual cost |
|---|---|
| Veryfi (200 × $0.08) | $16 |
| AWS S3 (~5GB) | $1.50 |
| n8n (Hetzner self-host) | $60 |
| Airtable | $0 |
| Telegram | $0 |
| **Total** | **~$78/year** |

Compared to manually entering 200 receipts at 60 seconds each = 3.3 hours/year. At any reasonable hourly value, the workflow pays for itself by receipt #5 each year.

---

## What this workflow does NOT do

- Doesn't handle multi-property receipt splits. A single receipt with items for two cabins routes to Review.
- Doesn't categorize Amazon orders well. Forward the order email (not the shipping email) for best results; complex Amazon receipts route to Review for line-item allocation.
- Doesn't replace the Categorization Rule Library bonus — the workflow uses the same library; rules updated in one update both.
- Doesn't run if the OCR fails. Failed-OCR emails route to Review with the raw image attached for manual handling.

---

*Last reviewed: 2026-04-29. Third-party services (Veryfi, n8n, AWS) have their own pricing, terms, and data-handling practices — review and accept before deploying. The workflow is provided as-is; production deployment is the host's responsibility.*
