# STR_StrManuals_LeadMagnet_Tax — wiring checklist

After importing the JSON into n8n, three things still need wiring before activation. Sit on the workflow editor and walk this list top-to-bottom.

## 0. Pre-flight (must be true before activation)

- [ ] PDFs are live on Hostinger at `https://strmanuals.com/dl/a72d025ff5beac1c57bc98b067969a07/free/tax-loophole-explainer.pdf` (curl returns 200 with `application/pdf`). If not, run `STRManuals/scripts/upload-pdfs-to-hostinger.ps1` first.
- [ ] `STRMANUALS_DOWNLOAD_HASH` is set in n8n environment variables (Settings → Environment) to the same value as `STRManuals/site/.env` (`a72d025ff5beac1c57bc98b067969a07`).
- [ ] `INFLUENCERSOFT_API_KEY` is set in n8n environment variables (same value the existing `STR_Stripe_InfluencerSoft_Tagger` uses — the `rpsKey` from IS).

## 1. SMTP credential

Node: **SMTP → deliver explainer PDF**

- Credential dropdown currently shows the placeholder `Hostinger SMTP — hello@thestrledger.com` with id `__SET_ME__`.
- Click the credential field. Either pick the existing Hostinger SMTP credential that other cluster workflows use (`STR_Cluster_Lead_Router` references the same name) **or** create one:
  - Host: `smtp.hostinger.com`
  - Port: `465`
  - SSL/TLS: on
  - User: `hello@thestrledger.com`
  - Password: from `CREDENTIALS.md` (Hostinger mailbox section)
- Save the workflow. The credential id will replace `__SET_ME__`.

## 2. Google Sheets credential + Sheet ID

Node: **Sheets → leads backup**

- Credential dropdown: pick the existing **Google Sheets — STR Ledger ops** credential. If it doesn't exist, create an OAuth2 credential using the same Google account that owns the cluster-wide "Leads" workbook.
- `documentId` field: replace `__SET_ME_SHEET_ID__` with the Sheet ID used by `STR_Cluster_Lead_Router` (open that workflow in n8n, copy the resolved `documentId.value`). It's the single cluster-wide leads workbook — do **not** create a new sheet for strmanuals.
- `sheetName`: leave as `Leads`. The columns added (`ts, email, magnet, source, landing_page, tool, utm_source, utm_medium, utm_campaign, fallback_used`) match what `STR_Cluster_Lead_Router` writes, so a row from this workflow lands in the same tab next to existing leads.

## 3. InfluencerSoft tag receiver

The workflow tags the lead with `magnet:str-tax-loophole-explainer`. For the IS sequence to fire, in InfluencerSoft:

- [ ] Confirm a sequence exists (or create one) that is triggered by the tag `magnet:str-tax-loophole-explainer`. This is the Day-0 → Day-7 nurture that `Validate + prep` node references in its email body copy.
- [ ] Sequence first message can be a thank-you echo of the magnet — the SMTP node already delivers the PDF link directly, so don't double-send.

## 4. Webhook URL

After activation, n8n will expose a production URL. The form on `STRManuals/site/src/pages/free.astro` (and `EmailCapture.astro`) posts to:

```
{PUBLIC_N8N_WEBHOOK_BASE}/webhook/lead-magnet-strmanuals-tax-explainer
```

- [ ] Confirm `PUBLIC_N8N_WEBHOOK_BASE` in the deploy workflow secrets (GitHub Actions → Secrets) matches the n8n base URL (no trailing slash, no `/webhook`).
- [ ] If you rebuild the site after activation, redeploy so the form's action attribute embeds the correct URL.

## 5. Activate

- [ ] Toggle the workflow to **Active** in n8n.
- [ ] Run the smoke test in [STR_StrManuals_LeadMagnet_Tax.TEST.md](STR_StrManuals_LeadMagnet_Tax.TEST.md) before announcing the magnet.
