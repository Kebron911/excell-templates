# Hostinger deploy scripts

Deploys the STR portfolio to its Hostinger Business hosting account.
Credentials live in `.secrets/hostinger.env` (outside this repo).

## STRManuals (Node.js Web App, SSR)

`deploy-strmanuals.ps1` — packages the Astro SSR build and pushes it to the
Hostinger Node.js app at `strmanuals.com`.

### Prerequisites (one-time)

- Stripe + n8n + HMAC env vars populated in **hPanel → Node.js → Environment**:
  `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLIC_KEY`,
  `DOWNLOAD_HMAC_SECRET`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_AUTH`, `SITE_URL`.
- Node.js Web App startup file set to `./dist/server/entry.mjs`.
- SSH key at the path stored in `STRMANUALS_SSH_KEY_PATH` (default
  `~/.ssh/hostinger_ed25519`).

### Usage

```powershell
# 1. Plan only (default, dry-run)
pwsh ./infrastructure/hostinger/deploy-strmanuals.ps1

# 2. Push it
pwsh ./infrastructure/hostinger/deploy-strmanuals.ps1 -Execute

# 3. Re-push without rebuilding
pwsh ./infrastructure/hostinger/deploy-strmanuals.ps1 -SkipBuild -Execute
```

### What it does

1. `npm run build` (skip with `-SkipBuild`).
2. Stages `dist/`, `package.json`, `package-lock.json`, `private/` into a tarball.
3. SCPs the tarball to `$STRMANUALS_NODE_APP_ROOT/__deploy/`.
4. Backs up the live `dist/` to `__deploy/dist.previous/`.
5. Extracts the new release into the app root.
6. Runs `npm ci --omit=dev` on the server.
7. Touches `tmp/restart.txt` to trigger a Passenger restart.

### Smoke test after deploy

```bash
curl -I https://strmanuals.com/
curl -I https://strmanuals.com/manuals/tax-01
curl -X POST https://strmanuals.com/api/subscribe -d '{"email":"smoke@test"}' -H 'content-type: application/json'
```

### Rollback

```bash
ssh -i ~/.ssh/hostinger_ed25519 -p 65002 u470667024@195.35.15.247 \
  "rm -rf $APP_ROOT/dist && mv $APP_ROOT/__deploy/dist.previous $APP_ROOT/dist && touch $APP_ROOT/tmp/restart.txt"
```

## STRBuyers / STROps (static placeholders)

Not implemented yet — both subfolders contain only planning docs.
Static FTP push will go in this folder once a site exists to deploy.
