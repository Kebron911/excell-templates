# Hostinger deploy scripts

Deploys the STR portfolio to a Hostinger Business hosting account.
Credentials live in `.secrets/hostinger.env` (outside this repo).

## Hostinger constraints worth knowing

- **CageFS jails the SSH user.** `node` and `npm` are NOT on the SSH PATH,
  even though Passenger runs Node 20 internally to serve the app. You
  cannot `npm install` over SSH. Deps install via hPanel → Node.js →
  **Run NPM Install** (or auto on `package.json` change).
- Node.js Web Apps live at `/home/<USER>/domains/<DOMAIN>/nodejs/`.
- Restart is triggered by `touch tmp/restart.txt` (Passenger).
- Logs: `console.log` (stdout) and `stderr.log` in the app root.

## STRManuals (Node.js Web App, SSR)

`deploy-strmanuals.ps1` ships the Astro SSR build. It does **not** install
deps and does **not** flip the app startup file — those are one-time
hPanel actions for the first SSR cutover.

### First-cutover workflow

1. Run the script: `pwsh ./deploy-strmanuals.ps1 -Execute`
   - Builds, packages `dist/`, `package.json`, `package-lock.json`,
     `private/` into a tarball, SCPs it, extracts, snapshots the prior
     `dist/` and package files into `__deploy/*.previous`, touches
     `tmp/restart.txt`.
2. **In hPanel → Hosting → `strmanuals.com` → Node.js:**
   - Application startup file: `./dist/server/entry.mjs`
   - Add env vars (mirror from `.secrets/hostinger.env`):
     `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLIC_KEY`,
     `DOWNLOAD_HMAC_SECRET`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_AUTH`,
     `SITE_URL=https://strmanuals.com`
   - Click **Run NPM Install** (installs prod deps).
   - Click **Restart Application**.
3. Smoke test:
   ```bash
   curl -I https://strmanuals.com/
   curl -I https://strmanuals.com/manuals/tax-01
   curl    https://strmanuals.com/healthz
   ```

### Subsequent deploys

After the cutover the workflow is just:

```powershell
pwsh ./infrastructure/hostinger/deploy-strmanuals.ps1 -Execute
```

If `package.json` / `package-lock.json` changed, click **Run NPM Install**
in hPanel afterwards. If only `dist/` changed, the Passenger restart from
`tmp/restart.txt` is sufficient.

### Usage

```powershell
# Plan only (default, dry-run)
pwsh ./infrastructure/hostinger/deploy-strmanuals.ps1

# Push it
pwsh ./infrastructure/hostinger/deploy-strmanuals.ps1 -Execute

# Re-push without rebuilding
pwsh ./infrastructure/hostinger/deploy-strmanuals.ps1 -SkipBuild -Execute
```

### Rollback to placeholder

If a deploy breaks the site, the script always snapshots the prior state
into `__deploy/`. Restore via SSH:

```bash
ssh -i ~/.ssh/hostinger_ed25519 -p 65002 u470667024@195.35.15.247
cd /home/u470667024/domains/strmanuals.com/nodejs
mv dist __deploy/dist.failed
cp __deploy/package.json.previous      package.json
cp __deploy/package-lock.json.previous package-lock.json
touch tmp/restart.txt
```

The placeholder `server.js` + `public/index.html` are NOT touched by the
deploy script; they stay on the server and will resume serving once the
package files are restored to a CJS-compatible shape.

### Known gotcha (caused a 13-min outage on 2026-05-07)

The first deploy attempt uploaded the SSR `package.json` (which has
`"type": "module"`) WITHOUT flipping the Hostinger startup file. Passenger
restarted with the existing CJS `server.js` — Node treated it as ESM
because of `"type":"module"` and crashed with
`ReferenceError: require is not defined`. Site went 503 until rollback.

**Mitigation in the script:** package files are snapshotted to
`__deploy/*.previous` before extract, so rollback is one `cp + touch`.

**Real fix:** flip the hPanel startup file to `dist/server/entry.mjs`
BEFORE the first SSR deploy, or in immediate sequence after.

## STRBuyers / STROps (static placeholders)

Not implemented — both subfolders contain only planning docs. Static FTP
push will be added here once a site exists to deploy.
