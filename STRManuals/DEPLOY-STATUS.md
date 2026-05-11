# STRManuals — Deploy Status

**Status:** DRAFT — DO NOT DEPLOY OVER LIVE SITE
**Last updated:** 2026-05-11
**Path chosen:** B (static-only, n8n-driven fulfillment)

---

## Why DRAFT

The site builds clean and the Buy buttons resolve to live Stripe payment
links. Customers CAN pay the moment this deploys. But fulfillment is not
yet wired:

- **n8n W01 (Stripe → IS email)** — not built. Stripe webhook destination
  currently points at `https://strmanuals.com/api/stripe-webhook` which
  doesn't exist in Path B. Either the destination must be repointed at
  n8n directly, or n8n's W01 workflow must be wired to receive Stripe
  webhooks and email the PDF link.
- **n8n W08 (free-magnet delivery)** — not built. The `/free` form posts
  to `${PUBLIC_N8N_WEBHOOK_BASE}/webhook/lead-magnet-strmanuals-tax-explainer`.
  That endpoint must exist on n8n and 303-redirect back to
  `/free/?confirmed=1` for the success-state UI to render.
- **PDF hosting for n8n delivery** — the 6 manuscript PDFs and the free
  explainer live at `STRManuals/site/private/manuals/*.pdf` and
  `STRManuals/site/private/free/tax-loophole-explainer.pdf`. They are
  NOT served by the static site (private/ is outside docroot). n8n
  needs a way to retrieve them (SSH/SFTP to Hostinger, or a separate
  bucket).
- **CPA review** of TAX-01 / TAX-02 / LGL-01 — charter §11 risk-mitigation.

If you deploy now, customers can buy and Stripe will charge them, but
they will receive no email and no download link. That's a refund event
waiting to happen.

## To unlock deploy

Pre-launch checklist (all must be true):

- [ ] n8n W01 receives Stripe `checkout.session.completed` events for
      source = "strmanuals-v1" (6 SKUs) and triggers the IS sequence
      `strmanuals-order-confirmation` with the buyer's email + SKU.
- [ ] n8n W08 receives `/webhook/lead-magnet-strmanuals-tax-explainer`
      POSTs and triggers the IS sequence `strmanuals-free-magnet`.
- [ ] Both IS sequences exist and Email 1 of each carries a working
      download URL (pre-signed bucket link, OR Hostinger SSH-hosted
      static PDF at a non-guessable path).
- [ ] Stripe webhook destination is repointed at the n8n URL (was
      `https://strmanuals.com/api/stripe-webhook` from earlier wiring —
      that endpoint no longer exists post-Path-B).
- [ ] One end-to-end smoke test: pay $19 for MAN-REV-01 via the live
      payment link, confirm receipt of an email containing the PDF
      link within 5 minutes, confirm the link downloads the file.
- [ ] CPA sign-off on TAX-01 / TAX-02 / LGL-01 manuscripts.

Then:
1. Remove the `DRAFT - DO NOT DEPLOY` line above (change to `READY`).
2. Set GitHub repo secret `STRMANUALS_DEPLOY_CONFIRM=1` for the
   one-time first-deploy override (optional — the gate auto-opens once
   the DRAFT marker is gone).
3. Push to main or run the `Deploy strmanuals.com` workflow manually.

## What this deploy will do

`.github/workflows/deploy-strmanuals.yml` does the standard cluster
deploy:

1. `pnpm build` with the env vars below injected.
2. Verifies the 14 expected pages + sitemap + robots are in `dist/`,
   and that Buy buttons resolve to live Stripe payment links (not "#").
3. Rsync `dist/` to
   `u470667024@195.35.15.247:/home/u470667024/domains/strmanuals.com/public_html/`
   over SSH (port 65002, shared cluster key `STR_SSH_KEY`).
4. Run `scripts/smoke.mjs` against `https://strmanuals.com` —
   homepage, all 5 manual pages, bundle, free, legal pages, sitemap.

## Required GitHub secrets

Set these in repo Settings → Secrets and variables → Actions before
the first deploy:

| Secret | Value | Source |
|---|---|---|
| `STR_SSH_KEY` | shared Hostinger ed25519 private key | Vaultwarden (already used by ledger/guests/etc.) |
| `STRMANUALS_STRIPE_LINK_TAX_01` | `https://buy.stripe.com/aFa5kD6SxaC00qdeynb3q14` | `ops/strmanuals-stripe-results.csv` |
| `STRMANUALS_STRIPE_LINK_TAX_02` | `https://buy.stripe.com/8x2eVd5OtdOc8WJcqfb3q15` | same |
| `STRMANUALS_STRIPE_LINK_REV_01` | `https://buy.stripe.com/28E4gz4KpcK83Cp2PFb3q16` | same |
| `STRMANUALS_STRIPE_LINK_REV_02` | `https://buy.stripe.com/9B6cN5ekZdOcgpbcqfb3q17` | same |
| `STRMANUALS_STRIPE_LINK_LGL_01` | `https://buy.stripe.com/9B6eVd6SxcK8a0Nbmbb3q18` | same |
| `STRMANUALS_STRIPE_LINK_BUNDLE` | `https://buy.stripe.com/6oU9ATa4J6lKeh3bmbb3q19` | same |
| `PUBLIC_N8N_WEBHOOK_BASE` | `https://n8ncde.cdeprosperity.com/` | root `.env` `N8N_BASE_URL` |
| `STRMANUALS_DEPLOY_CONFIRM` | `1` (optional, one-time DRAFT-bypass) | — |

## Restoring Path A (Node SSR) later

The original /api/* routes and HMAC+watermarking download flow are
preserved at `STRManuals/site/src/_disabled-api/`. To restore:

1. `git mv site/src/_disabled-api/api site/src/pages/api`
2. `git mv site/src/_disabled-api/downloads.astro site/src/pages/downloads.astro`
3. `git mv site/src/_disabled-api/free.astro site/src/pages/free.astro`
   (and delete the static replacement)
4. `git mv site/src/_disabled-api/render site/src/pages/render`
5. Re-add `@astrojs/node` to `site/package.json`.
6. Re-add the `node({ mode: 'standalone' })` adapter to `astro.config.mjs`.
7. Stand up the Hostinger Node.js app + `.htaccess` proxy (manual hPanel).
8. Replace this static deploy workflow with a hybrid one (rsync
   `dist/client/` → docroot, rsync `dist/server/` → Node app dir,
   restart the app via SSH).

That's a few hours of work but doesn't require rewriting code.
