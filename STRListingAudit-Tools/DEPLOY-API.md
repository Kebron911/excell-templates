# listingaudit-api — one-time deploy runbook

The Express API runs as a Docker container on the n8n VPS, fronted by Traefik
at `api.listingaudit.tools` (TLS via Cloudflare DNS challenge). The static
Astro frontend stays on Hostinger at `listingaudit.tools`.

This runbook is **one-time setup**. After this, every push to `main` that
touches `STRListingAudit-Tools/server/**` triggers
`.github/workflows/deploy-strlistingaudit-api.yml` which builds the image,
pushes to GHCR, SSHes into the VPS, and reloads the container.

---

## 1. DNS

In Cloudflare, add an `A` record:

| Name | Type | Content | Proxy |
|---|---|---|---|
| `api.listingaudit.tools` | `A` | `<n8n VPS public IP>` | DNS only (gray cloud) — Traefik handles TLS |

If you proxy through Cloudflare (orange cloud), set SSL mode to **Full (strict)**
and disable WAF caching for `api.*` paths.

Verify: `dig api.listingaudit.tools` returns the VPS IP.

---

## 2. GitHub Actions secrets

Set in repo settings → Secrets and variables → Actions. The static-deploy
workflow needs:

| Secret | Value |
|---|---|
| `LISTINGAUDIT_PUBLIC_API_BASE` | `https://api.listingaudit.tools` (build-time injection) |

The API-deploy workflow needs:

| Secret | Value | Notes |
|---|---|---|
| `N8N_SSH_HOST` | n8n VPS public IP / hostname | Used by SSH step |
| `N8N_SSH_PORT` | typically `22` | |
| `N8N_SSH_USER` | `n8n-ops` per CREDENTIALS.md | Key-based auth only |
| `N8N_SSH_KEY` | full private key content of `n8n-ops_ed25519` | Paste contents of `C:\Users\Kebron\.ssh\n8n-ops_ed25519` |

Verify from local shell:
```bash
gh secret list | grep -E "N8N_SSH|LISTINGAUDIT_PUBLIC_API_BASE"
```

---

## 3. First-time VPS setup

SSH in as `n8n-ops`:

```bash
ssh -i ~/.ssh/n8n-ops_ed25519 n8n-ops@<vps>
```

Create the service directory and seed config:

```bash
mkdir -p /home/kebron/git/mydocker/listingaudit-api
cd /home/kebron/git/mydocker/listingaudit-api
```

Copy `STRListingAudit-Tools/docker-compose.production.yml` from this repo to
`docker-compose.yml` on the VPS (paste contents, or `scp` from your local
checkout).

Copy `STRListingAudit-Tools/.env.production.example` to `.env` on the VPS:

```bash
cp .env.production.example .env  # if you scp'd both
chmod 600 .env
$EDITOR .env  # fill in all values — see "Environment values" below
```

Authenticate Docker against GHCR (one-time; uses a PAT with `read:packages`):

```bash
echo "$GHCR_PAT" | docker login ghcr.io -u kebron911 --password-stdin
```

> Create the PAT at https://github.com/settings/tokens → classic → scope
> `read:packages`. Store in Vaultwarden alongside the n8n_encryption_key.

Verify Traefik already knows `my_network`:

```bash
docker network ls | grep my_network
```

If absent, the n8n stack hasn't created it yet — start n8n's compose first.

---

## 4. Environment values for VPS .env

Fill these in `/home/kebron/git/mydocker/listingaudit-api/.env`:

```
ALLOWED_ORIGIN=https://listingaudit.tools
ANTHROPIC_API_KEY=<copy from STRListingAudit-Tools/.env.local>
APIFY_TOKEN=<copy from STRListingAudit-Tools/.env.local>
APIFY_AIRBNB_ACTOR=tri_angle/airbnb-scraper
ADMIN_TOKEN=<copy from STRListingAudit-Tools/.env.local>
MYSQL_HOST=<Hostinger MySQL host — TBD, same instance as strguests>
MYSQL_PORT=3306
MYSQL_USER=<Hostinger MySQL user>
MYSQL_PASSWORD=<Hostinger MySQL password>
MYSQL_DATABASE=strlistingaudit
EMAIL_VERIFY_SECRET=<generate random 32 bytes; only matters at Phase 4b>
IP_HASH_SALT=<copy from STRListingAudit-Tools/.env.local>
EMAIL_PROVIDER=console
PORT=3002
```

The two new secrets generated on 2026-05-16 (`ADMIN_TOKEN`, `IP_HASH_SALT`)
are also in GitHub Actions as `LISTINGAUDIT_ADMIN_TOKEN` /
`LISTINGAUDIT_IP_HASH_SALT` for reference — copy values from there or local
`.env.local`.

---

## 5. MySQL provisioning

Decision: same Hostinger Business shared MySQL instance as strguests, with a
new database `strlistingaudit`.

In Hostinger hPanel:

1. **Databases → MySQL Databases → Create new database.** Name:
   `<user_prefix>_strlistingaudit`. Hostinger prepends the cPanel user prefix.
2. Assign an existing user (the one strguests uses) with ALL privileges on the
   new DB. Or create a new user — record in `CREDENTIALS.md`.
3. Note the **remote MySQL host** (Hostinger Business plans expose remote
   MySQL — required because the container runs on the n8n VPS, not Hostinger).
   You may need to whitelist the n8n VPS IP under **Remote MySQL** in hPanel.
4. Test from the VPS:
   ```bash
   docker run --rm --network my_network mysql:8 \
     mysql -h "$MYSQL_HOST" -P 3306 -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" \
     -e "SELECT 1" "$MYSQL_DATABASE"
   ```
5. Run migrations once the env is in place:
   ```bash
   docker compose run --rm listingaudit-api node server/dist/db/migrate.js
   ```
   (Build script outputs to `server/dist/`; verify the migrate entry exists
   after first `docker compose up`.)

---

## 6. First container start

```bash
cd /home/kebron/git/mydocker/listingaudit-api
docker compose pull
docker compose up -d
docker compose logs -f listingaudit-api
```

You should see `[listingaudit-api] listening on :3002`. Then verify Traefik
routing:

```bash
curl -fsS https://api.listingaudit.tools/api/health
# → {"status":"ok","service":"listingaudit-api","ts":"..."}
```

If Traefik returns a cert error, give Cloudflare DNS challenge ~60 seconds.
Check Traefik logs: `docker logs traefik | tail -50`.

---

## 7. Cutting over the frontend

Push the static-site changes. The next deploy of
`deploy-strlistingaudit-tools.yml` will:

- Read `LISTINGAUDIT_PUBLIC_API_BASE` secret
- Inject into `.env` at build time
- Astro bakes `PUBLIC_API_BASE=https://api.listingaudit.tools` into the
  client bundle
- `AuditForm` and `audit/index.astro` will now hit the cross-origin API

CORS is already configured server-side (`ALLOWED_ORIGIN`).

---

## 8. Rollback

If the new image breaks production:

```bash
ssh n8n-ops@<vps>
cd /home/kebron/git/mydocker/listingaudit-api
docker compose pull listingaudit-api:sha-<previous-sha>
# or pin in docker-compose.yml: image: ghcr.io/...:sha-XYZ
docker compose up -d
```

To revert the frontend independently: revert the `PUBLIC_API_BASE` secret to
empty and re-trigger `deploy-strlistingaudit-tools.yml`. The frontend will
emit relative `/api/*` URLs that 404 — degraded but not broken.

---

## Verification checklist

- [ ] `dig api.listingaudit.tools` → VPS IP
- [ ] `gh secret list` shows `N8N_SSH_HOST/PORT/USER/KEY` + `LISTINGAUDIT_PUBLIC_API_BASE`
- [ ] `/home/kebron/git/mydocker/listingaudit-api/.env` exists with all values, mode 600
- [ ] `docker compose ps` shows listingaudit-api as healthy
- [ ] `curl https://api.listingaudit.tools/api/health` returns `{"status":"ok"}`
- [ ] Hostinger MySQL `strlistingaudit` DB reachable from VPS
- [ ] `pnpm --filter strlistingaudit-tools db:migrate` (run via container) succeeds
- [ ] Static-site rebuild + deploy succeeds with new `PUBLIC_API_BASE`
- [ ] Audit form on `https://listingaudit.tools/` POSTs to api.listingaudit.tools and renders a scorecard
