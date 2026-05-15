# Cluster pre-launch backlog

> Items deferred while the cluster is in **Coming-Soon mode** (lead capture +
> Stripe-direct sales paused on all 6 live sites). Etsy purchases on
> thestrledger.com remain enabled.
>
> Last updated: 2026-05-15

---

## 1 — Bring strmanuals lead capture + sales online (HIGH)

The strmanuals `/free/` page form posts to `/webhook/lead-magnet-strmanuals-tax-explainer` but the n8n workflow does not exist there, and the magnet PDF is not deployed (`https://strmanuals.com/dl/` returns 404).

**Required:**

1. Decide PDF hosting strategy. The deploy-strmanuals workflow comment says "PDFs aren't in repo; n8n is the canonical PDF delivery path." So the path is: n8n hosts the PDFs (or signs S3 URLs) and emails them. Two implementations possible:
   - **n8n binary node** — store the PDF in n8n workflow staticData, attach to email
   - **Hostinger `/dl/<HASH>/...` path** — upload PDFs out of band, fix whatever excludes them from the SFTP deploy
2. Import `ops/n8n-workflows/STR_StrManuals_LeadMagnet_Tax.json` to n8n.
3. Fill placeholders in the workflow: `__SET_ME_TAX_EXPLAINER_LIST_ID__`, SMTP credential, Google Sheet ID + OAuth.
4. Confirm `INFLUENCERSOFT_API_KEY` is set as an n8n env var (per CREDENTIALS.md, already is).
5. Test end-to-end with a throwaway email: form submit → 303 redirect to `/free/?confirmed=1`, email arrives with PDF link, PDF link returns 200.
6. Verify the BuyButton "PAUSED" comment in `STRManuals/site/src/components/BuyButton.astro` can be reverted: ensure paid Stripe customers receive their PDF (via n8n `STR_Stripe_InfluencerSoft_Tagger` flow + PDF email).
7. Revert `STRManuals/site/src/components/BuyButton.astro` (remove `isPlaceholder = true; void paymentLink; void sku;`).
8. Revert `STRManuals/site/src/components/EmailCapture.astro` (restore the `<form>` block).
9. Revert `STRManuals/site/src/pages/free.astro` (uncomment the env-driven `FORM_ACTION`).
10. Revert `.github/workflows/deploy-strmanuals.yml` (re-enable the `href="https://buy.stripe.com/"` greps in Verify build output).

---

## 2 — Migrate thestrledger.com from legacy PHP to the Astro scaffold (HIGH-LATER)

`thestrledger.com` is currently served from a hand-rolled PHP site on Hostinger at `/home/u470667024/domains/thestrledger.com/public_html/`. The Astro scaffold in this repo at `STRLedger/` is **DRAFT-gated** (`STRLedger/DEPLOY-STATUS.md` blocks deploy).

**Status today (2026-05-15):** Legacy PHP site is in Coming-Soon mode. Lead forms paused (`_inc/lead-form.php`), Stripe/IS-direct buy CTAs hidden on `product.php` + `bundle.php`, Etsy CTAs preserved. Backups at `/home/u470667024/domains/thestrledger.com/public_html/_backups/pre-pause-20260515/`.

**Required to flip ownership to Astro (per `STRLedger/DEPLOY-STATUS.md`):**

1. Match all 12 live product SKUs (legacy catalog) in `STRLedger/src/content/products/*.mdx`. Verify price, copy, image, and `/products/{SKU}/` route.
2. Migrate `/blog/*` content from legacy site (or temporarily redirect to `blog.thestrledger.com` if Ghost-hosted).
3. Verify `/free/47-deductions/` lead-magnet wiring matches the same provider as live (n8n → IS).
4. Verify Etsy "Buy now" links still resolve.
5. Soft-launch on preview URL first (e.g., `preview.thestrledger.com`).
6. Flip `STRLedger/DEPLOY-STATUS.md` from DRAFT to READY (the deploy gate reads this).
7. Trigger `deploy-strledger.yml`. Confirm SMOKE.md probes pass.
8. **Important:** the deploy SFTP destination (`STRLEDGER_SSH_USER@STRLEDGER_SSH_HOST:STRLEDGER_DOC_ROOT/`) likely overwrites the legacy site. Back up legacy first.
9. After cutover: archive legacy `_backups/pre-pause-*` + verify `submit.php` is no longer reachable (Astro is static-only).

---

## 3 — Activate STR_Cluster_Lead_Router for the 4 tool sites (MEDIUM)

Scaffolded at `ops/n8n-workflows/STR_Cluster_Lead_Router.json`. Single endpoint to receive POSTs from any of strhost / strops / strguests / strbuyers / strledger.

**Required:**

1. Import the workflow into n8n.
2. Fill `__SET_ME__` placeholders per magnet (9 magnets pre-seeded; IS list IDs are the main blank).
3. Wire SMTP + Google Sheets credentials (same as #1 above).
4. Confirm IS API path (`/api/v1/subscribers` is a guess — verify against `STR_Stripe_InfluencerSoft_Tagger.json` for the real shape).
5. Activate.
6. Set `PUBLIC_ESP_WEBHOOK` (strhost/strbuyers), `PUBLIC_ESP_ENDPOINT` (strops), `PUBLIC_ESP_WEBHOOK` (strguests) GitHub repo secrets to the new router URL.
7. Revert the shared component pauses:
   - `packages/ui-funnel/src/EmailCaptureCard.astro` — restore `<form>` block
   - `packages/email-gate/src/EmailGate.astro` — restore `<form>` block
   - `STRGuests-Tools/src/components/generator/PdfDownloadButton.astro` — restore `if (modal && !isGateDismissed(tool)) modal.showModal();`
8. Revert the per-site pauses:
   - `STROps-Tools/src/pages/get-the-{cleaner-sop,maintenance-checklist,supply-par}.astro` — restore `<form class="magnet-capture">` blocks
9. Redeploy all 4 tool sites.

---

## 4 — strmanuals `/dl/` deployment gap (MEDIUM)

Even when n8n becomes the canonical PDF delivery path (#1), there's a question about whether the static-site `/dl/<HASH>/...` URLs were ever supposed to work. Investigate:

- `STRManuals/site/dist/dl/<HASH>/...` exists after local build (PDFs present locally).
- `https://strmanuals.com/dl/` returns 404 on production.
- Either rsync filter, Hostinger `.htaccess`, or `copy-pdfs-to-dist.mjs` is omitting them in CI.

If we want `/dl/<HASH>/` URLs to work as a fallback delivery path, fix the deploy. Otherwise, deprecate the path and rely entirely on n8n-emailed links.

---

## 5 — Re-enable analytics events that depend on lead capture (LOW)

After #3 lands, GA4 `email_captured` and `pdf_downloaded` events resume firing through the active form handlers. No code change needed — they're already wired in `EmailCaptureCard` and `PdfDownloadButton`. Just verify in GA4 Realtime after un-pausing.

---

## Restore-point index — every "PAUSED" location in this repo

A single `git grep -nE 'PAUSED|FORCED:|Coming soon'` should surface all of these. Listed here for reference:

| File | What's paused | Revert when |
|---|---|---|
| `packages/ui-funnel/src/EmailCaptureCard.astro` | Form replaced with Coming-Soon panel | #3 cluster lead router live |
| `packages/email-gate/src/EmailGate.astro` | Form replaced with Coming-Soon stub | #3 cluster lead router live |
| `STRGuests-Tools/src/components/generator/PdfDownloadButton.astro` | Email modal `showModal()` disabled | #3 cluster lead router live |
| `STRManuals/site/src/components/BuyButton.astro` | `isPlaceholder = true` forced | #1 strmanuals fulfillment verified |
| `STRManuals/site/src/components/EmailCapture.astro` | Form replaced with Coming-Soon panel | #1 strmanuals W08 workflow live |
| `STRManuals/site/src/pages/free.astro` | `FORM_ACTION = ''` forced | #1 strmanuals W08 workflow live |
| `STRLedger/src/pages/products/[slug].astro` | `showStripeBuy = false` | DRAFT site is rebuilt + #2 cutover (no-op until then) |
| `STRLedger/src/pages/free/47-deductions.astro` | Forced mailto fallback | #2 cutover (no-op until then) |
| `STROps-Tools/src/pages/get-the-cleaner-sop.astro` | Form replaced | #3 cluster lead router live |
| `STROps-Tools/src/pages/get-the-maintenance-checklist.astro` | Form replaced | #3 cluster lead router live |
| `STROps-Tools/src/pages/get-the-supply-par.astro` | Form replaced | #3 cluster lead router live |
| `.github/workflows/deploy-strmanuals.yml` | Stripe-link grep verify commented out | #1 strmanuals fulfillment verified |
| **(Hostinger SFTP, not in git)** `/home/u470667024/domains/thestrledger.com/public_html/_inc/lead-form.php` | Replaced with Coming-Soon include | #2 cutover OR re-wire legacy form |
| **(Hostinger SFTP, not in git)** `/home/u470667024/domains/thestrledger.com/public_html/product.php` | "Buy on thestrledger.com" CTAs → "Coming soon" spans | #2 cutover OR re-wire legacy IS checkout |
| **(Hostinger SFTP, not in git)** `/home/u470667024/domains/thestrledger.com/public_html/bundle.php` | Same as product.php | #2 cutover OR re-wire legacy IS checkout |

Legacy strledger backups are at `_backups/pre-pause-20260515/` on the Hostinger box. To restore the legacy site:
```bash
ssh -p 65002 -i ~/.ssh/hostinger_ed25519 u470667024@195.35.15.247
cd /home/u470667024/domains/thestrledger.com/public_html
cp _backups/pre-pause-20260515/lead-form.php _inc/lead-form.php
cp _backups/pre-pause-20260515/product.php product.php
cp _backups/pre-pause-20260515/bundle.php bundle.php
```
