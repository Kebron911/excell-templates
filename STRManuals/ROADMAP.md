# STRManuals — Roadmap / TODO

> Property-specific tracker for `strmanuals.com`. Empire-wide items live in
> [PROGRESS.md](../PROGRESS.md).

## Status — 2026-05-07

- ✅ Astro SSR build green (8 prerendered routes + 5 SSR API routes)
- ✅ Deploy script live: [infrastructure/hostinger/deploy-strmanuals.ps1](../infrastructure/hostinger/deploy-strmanuals.ps1)
- ✅ SSR build files uploaded to Hostinger app root
- ✅ Placeholder still serving (`server.js` + `public/index.html`)
- ⏳ **Awaiting hPanel cutover** to flip from placeholder → SSR

---

## NEXT — hPanel cutover (manual, blocks first sale)

This is the only thing standing between the SSR build sitting on the
server and the site actually being live. Hostinger CageFS prevents these
steps from being scripted — they happen in hPanel.

### 1. Environment variables
hPanel → Hosting → strmanuals.com → **Environment variables**. Mirror these
from `.secrets/hostinger.env`:

- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PUBLIC_KEY`
- [ ] `DOWNLOAD_HMAC_SECRET` — generate fresh: `openssl rand -hex 32` (do
      NOT reuse the dev value in `STRManuals/site/.env`)
- [ ] `N8N_WEBHOOK_URL`
- [ ] `N8N_WEBHOOK_AUTH`
- [ ] `SITE_URL=https://strmanuals.com`

### 2. App config + install + restart
hPanel → Hosting → strmanuals.com → **Deployments** (fallback **Advanced**):

- [ ] Set **Application startup file** = `dist/server/entry.mjs`
- [ ] Click **Run NPM Install**
- [ ] Click **Restart Application**

### 3. Smoke tests
```bash
curl -I https://strmanuals.com/                  # 200
curl -I https://strmanuals.com/manuals/tax-01    # 200 (prerendered)
curl    https://strmanuals.com/healthz           # 200 ok (or remove if unused)
```

### 4. Stripe wiring (post-cutover)
- [ ] Register webhook endpoint in Stripe dashboard:
      `https://strmanuals.com/api/stripe-webhook`
- [ ] Copy the new signing secret back into hPanel env var
      `STRIPE_WEBHOOK_SECRET` and click Restart

### Rollback if any of the above breaks the site
See [infrastructure/hostinger/README.md](../infrastructure/hostinger/README.md#rollback-to-placeholder).

---

## Deferred / future

- [ ] **MySQL provisioning** if/when downloads or subscribers move from
      n8n-only to local DB. Hostinger MySQL is set up
      (`STRMANUALS_DB_HOST=srv1221.hstgr.io`) but credentials not yet
      filled.
- [ ] **CI deploy** — wire `infrastructure/hostinger/deploy-strmanuals.ps1`
      logic into a GitHub Actions workflow once a `main` branch deploy
      cadence is wanted. (For now: local pwsh.)
- [ ] **Remove placeholder fallback** — once SSR is stable for ≥ 1 week,
      delete `server.js` + `public/` from the Hostinger app root so
      package.json `"type":"module"` can never collide with CJS again.
- [ ] **Free PDF distribution** — `private/free/tax-loophole-explainer.pdf`
      is referenced by `/api/download` but the file may need refreshing
      on cadence.
