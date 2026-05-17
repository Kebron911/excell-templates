# n8n cluster workflows — activation checklist

> Two new workflows are sitting in this directory ready to import. This
> doc walks you through everything you need to do in n8n + InfluencerSoft
> to turn them on. Estimate: ~30 minutes once you have IS open + SMTP
> creds handy.

| Workflow | File | What it does |
|---|---|---|
| `STR_StrManuals_LeadMagnet_Tax` | `STR_StrManuals_LeadMagnet_Tax.json` | Handles `POST /webhook/lead-magnet-strmanuals-tax-explainer` from the strmanuals `/free/` form. Adds to IS, emails the PDF, logs to Sheets, redirects to `/free/?confirmed=1`. |
| `STR_Cluster_Lead_Router` | `STR_Cluster_Lead_Router.json` | Single endpoint at `/webhook/cluster-lead-router` for all 4 tool sites + strledger. Reads the `magnet` field, dispatches PDF + IS tags + Sheets backup. |

---

## Prerequisites — do these once before either workflow

### 1 — Confirm `INFLUENCERSOFT_API_KEY` env var on the n8n host

The proven `STR_Stripe_InfluencerSoft_Tagger` workflow already uses `$env.INFLUENCERSOFT_API_KEY` so this is almost certainly set. Verify in n8n:

1. n8n UI → **Settings → Environment Variables** (or check the host directly at `n8ncde.cdeprosperity.com`)
2. Confirm `INFLUENCERSOFT_API_KEY` exists and is non-empty
3. If missing, set it from `Excel-Templates/.env` (line `INFLUENCERSOFT_API_KEY=...`)

Both new workflows reference `{{ $env.INFLUENCERSOFT_API_KEY }}` directly — no per-workflow credential needed.

### 2 — Create an n8n SMTP credential

The lead-router emails the PDF link via SMTP. Hostinger Business has SMTP at `smtp.hostinger.com:465` (SSL) using the `hello@thestrledger.com` mailbox.

1. n8n UI → **Credentials → Add Credential → SMTP**
2. Fill:
   - **Host:** `smtp.hostinger.com`
   - **Port:** `465`
   - **Secure:** `SSL/TLS` (port 465 implies this)
   - **User:** `hello@thestrledger.com`
   - **Password:** (from Hostinger Email panel → `hello@thestrledger.com` → password)
3. **Name:** `Hostinger SMTP — hello@thestrledger.com` (any name works, just keep consistent)
4. **Save.** Note the credential ID (used in the next step).

### 3 — Create the Google Sheets backup sheet + credential

This sheet is the safety net — every lead lands here even if IS/SMTP fail silently.

1. Go to https://sheets.new (or use any existing sheet)
2. Rename to `STR Lead Backup`. First tab name: `Leads`
3. Paste this header row in A1:`L1`:
   ```
   ts  email  magnet  source  tool  utm_source  utm_medium  utm_campaign  landing_page  unknown_magnet  pdf_hosted  notes
   ```
4. Copy the sheet ID from the URL (`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`)
5. In n8n: **Credentials → Add Credential → Google Sheets OAuth2 API**
6. Walk through the OAuth flow with the Google account that owns the sheet
7. **Save.** Note the credential ID.

---

## Workflow A — STR_StrManuals_LeadMagnet_Tax (do first)

This unblocks the strmanuals `/free/` form which is the single most urgent broken lead-capture in the cluster.

### Import + wire

1. n8n UI → **Workflows → Import from File** → pick `ops/n8n-workflows/STR_StrManuals_LeadMagnet_Tax.json`
2. Open the workflow. Click each node with a red ⚠️ badge:
   - **SMTP → deliver explainer PDF** — set the SMTP credential to the one created in prereq #2
   - **Sheets → leads backup** — set the Google Sheets credential AND replace `__SET_ME_SHEET_ID__` with your sheet ID
3. (Optional) **Validate + prep** code node — the email body is fine as-is, but you may want to soften the drip-sequence preview text.
4. Click **Save**, then toggle **Active** in the top-right.

### Test end-to-end

In a separate tab:
```bash
curl -X POST https://n8ncde.cdeprosperity.com/webhook/lead-magnet-strmanuals-tax-explainer \
  -d "email=you+test@yourdomain.com" \
  -d "magnet=str-tax-loophole-explainer" \
  -d "landing_page=strmanuals.com/free"
```

Expected (in order):
- The terminal returns HTTP 303 redirecting to `https://strmanuals.com/free/?confirmed=1`
- Your inbox receives an email titled "Your STR Tax Loophole Explainer (8 pages)" with a link to https://strmanuals.com/dl/c30ca3787771e91e0fb21716146e2cea/free/tax-loophole-explainer.pdf
- The Google Sheet `Leads` tab has a new row with your email + `magnet=str-tax-loophole-explainer`
- IS Contacts shows you as a lead tagged `magnet:str-tax-loophole-explainer`, `source:strmanuals.com`, `funnel:free-to-tax-playbook`
- Clicking the PDF link downloads a real 350 KB PDF (the explainer is already uploaded to Hostinger — that part is done)

### Un-pause the strmanuals form

Once the test above passes:

1. Edit `STRManuals/site/src/pages/free.astro` line 16:
   - Remove the `// PAUSED` block
   - Uncomment the env-driven `FORM_ACTION = N8N_BASE ? ... : ''`
2. Edit `STRManuals/site/src/components/EmailCapture.astro`:
   - Revert the Coming-Soon `<div>` back to the original `<form>` block (find the PAUSED comment for the exact swap)
3. Commit + push. Auto-deploys on the path filter.

Now the strmanuals `/free/` form lands real PDFs in real inboxes.

---

## Workflow B — STR_Cluster_Lead_Router (do second)

Single endpoint for all 4 tool sites + strledger free magnet. **None** of those magnet PDFs are hosted yet — the dispatch table flags every entry as `pdf_hosted: false`. The workflow handles this gracefully: subscribers get an honest "we're finishing the file this week, reply if you need it sooner" email + are still tagged in IS for follow-up.

You can activate this workflow without producing the PDFs first. As each PDF lands on Hostinger, flip `pdf_hosted: true` in the dispatch table and the email body auto-switches to the real link.

### Import + wire

1. n8n UI → **Workflows → Import from File** → pick `ops/n8n-workflows/STR_Cluster_Lead_Router.json`
2. Wire the **SMTP → deliver PDF link** and **Sheets → leads backup** credentials the same way as Workflow A. (Same SMTP + same Sheet are fine — the Sheet column layout matches.)
3. Save + **Activate**.

### Test

```bash
curl -X POST https://n8ncde.cdeprosperity.com/webhook/cluster-lead-router \
  -H "Content-Type: application/json" \
  -d '{"email":"you+test2@yourdomain.com","magnet":"strops-cleaner-sop","source":"strops.tools","tool":"cleaner-sop"}'
```

Expected:
- HTTP 200 with `{"ok":true,"queued_at":"...","magnet":"strops-cleaner-sop"}`
- Email titled "Your STR cleaner SOP template" with the honest manual-followup message (since `pdf_hosted=false`)
- Sheet row with `pdf_hosted=false` flag
- IS lead tagged `magnet:strops-cleaner-sop,source:strops.tools,tool:cleaner-sop`

### Wire the 4 tool sites + strledger to this endpoint

In GitHub repo Settings → Secrets and variables → Actions:

| Repo secret | Set to |
|---|---|
| `PUBLIC_ESP_WEBHOOK` (strhost/strbuyers/strguests use this name) | `https://n8ncde.cdeprosperity.com/webhook/cluster-lead-router` |
| `PUBLIC_ESP_ENDPOINT` (strops uses this name) | same value |

Then revert the Coming-Soon pauses:
- `packages/ui-funnel/src/EmailCaptureCard.astro` — restore the original `<form>` block
- `packages/email-gate/src/EmailGate.astro` — restore form
- `STRGuests-Tools/src/components/generator/PdfDownloadButton.astro` — restore `if (modal && !isGateDismissed(tool)) modal.showModal();`
- `STROps-Tools/src/pages/get-the-{cleaner-sop,maintenance-checklist,supply-par}.astro` — restore the inline `<form class="magnet-capture">` blocks

Commit + push. All 4 tool deploys auto-retrigger.

### Producing the actual PDFs (one at a time, no rush)

For each magnet:
1. Author the PDF (Affinity / Google Doc → Print to PDF / etc.)
2. SCP it into the right Hostinger path:
   ```
   scp -P 65002 -i ~/.ssh/hostinger_ed25519 \
     /local/path/to/<magnet>.pdf \
     u470667024@195.35.15.247:/home/u470667024/domains/<site>/public_html/pdfs/<magnet>.pdf
   ```
3. In n8n, edit the **Validate + dispatch** code node — find the magnet's entry in the `MAGNETS` table, flip `pdf_hosted: false` → `pdf_hosted: true`
4. Save the workflow. Done. The next subscriber gets the real link.

---

## Drip sequences in InfluencerSoft

The Cluster Lead Router applies tags but does NOT manage email sequences — that's IS's job. For each magnet you want a follow-up sequence on:

1. Open IS → **Automations** (or Sequences)
2. Create an automation: **Trigger:** "Tag applied" → `magnet:<slug>` (e.g., `magnet:strops-cleaner-sop`)
3. Add the email steps you want (Day 0 = the magnet, Day 2 = a tip, etc.)
4. Activate the automation

The router tags happen on every form submission, so any new automation listening for that tag will pick up future subscribers automatically.

---

## Rollback

If the cluster router misbehaves:

1. n8n UI → toggle the workflow **inactive**. Form submissions still hit the webhook URL but n8n returns a default error response. The 4 tool sites have a CORS-aware form submit handler that catches the error inline.
2. Revert `PUBLIC_ESP_WEBHOOK` / `PUBLIC_ESP_ENDPOINT` secrets to empty, redeploy. Forms render but no requests are sent.
3. Re-apply the Coming-Soon edits documented in BACKLOG.md restore-point index. Deploy.

---

## Status today (2026-05-16)

- ✅ Both workflow JSONs use the correct IS API contract (`POST /api/AddUpdateLead`, form-urlencoded, `rpsKey` body param). Matches the proven `STR_Stripe_InfluencerSoft_Tagger` pattern.
- ✅ The tax-explainer PDF is live at `https://strmanuals.com/dl/c30ca3787771e91e0fb21716146e2cea/free/tax-loophole-explainer.pdf` (uploaded out of band — `private/` is gitignored so CI never copies it).
- ⏳ The 5 paid manual PDFs are also uploaded to Hostinger under the same hash. Stripe order fulfillment via the existing `STR_Stripe_InfluencerSoft_Tagger` workflow now has working URLs to send.
- ⏳ All 8 tool-site magnets still need their PDFs authored + uploaded. The router handles missing PDFs gracefully — activating it does NOT require all magnets to exist first.
