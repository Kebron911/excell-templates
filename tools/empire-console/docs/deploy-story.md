# Empire Console — deployed at dashboard.thestrledger.com

*Updated 2026-05-10. Hostinger shared hosting decision.*

## What we picked

**Hostinger shared hosting** + SSH/rsync deploy + `.htaccess` basic auth.

Why this combo:
- Same vendor as the 4 sister sites — one cluster-shared SSH key (`STR_SSH_KEY`)
  already configured for strhost / strguests / strbuyers / strops
- Hostinger AutoSSL handles HTTPS (free Let's Encrypt)
- `.htaccess` basic auth is browser-native, simple to manage, no external IdP
- Static build = no Node runtime to maintain
- Deploy uses the exact pattern the sister sites already use
- One vendor surface, $0 marginal cost

## URL

`https://dashboard.thestrledger.com`

## Hostinger access — already configured

| What | Value | Where |
|---|---|---|
| SSH host | `195.35.15.247` | docs/DEPLOY.md (sister sites) |
| SSH port | `65002` | same |
| SSH user | `u470667024` | same |
| SSH key | `~/.ssh/hostinger_ed25519` (private), `~u470667024/.ssh/authorized_keys` (public) | already set |
| Doc root pattern | `/home/u470667024/domains/<domain>/public_html/` | sister sites use this exact pattern |

For this deploy: doc root will be
`/home/u470667024/domains/dashboard.thestrledger.com/public_html/`

## One-time setup checklist

### 1. Hostinger — add the subdomain

1. hPanel → **Domains** → `thestrledger.com` → **Subdomains**
2. Create subdomain `dashboard` → document root left at default
   (`/home/u470667024/domains/dashboard.thestrledger.com/public_html/`)
3. Wait for AutoSSL to issue the cert (~2 min). hPanel → **Security** → **SSL**.

### 2. Basic auth — `.htpasswd` on the server

The committed [`public/.htaccess`](../public/.htaccess) requires auth via
`.htpasswd-dashboard` stored **above** the doc root (not in git).

```bash
ssh -i ~/.ssh/hostinger_ed25519 -p 65002 u470667024@195.35.15.247
htpasswd -c /home/u470667024/.htpasswd-dashboard daniel
# enter password twice
```

To add another user later (drop the `-c`):
```bash
htpasswd /home/u470667024/.htpasswd-dashboard <username>
```

### 3. GitHub Actions secrets

Repo Settings → Secrets → Actions:

| Secret | Value | Notes |
|---|---|---|
| `STR_SSH_KEY` | `~/.ssh/hostinger_ed25519` private key | **already set** for the cluster |
| `PUBLIC_N8N_WEBHOOK_BASE` | `https://n8n.thestrledger.com/webhook` | Phase 4 capture endpoint |

Set the n8n webhook URL once:
```powershell
gh secret set PUBLIC_N8N_WEBHOOK_BASE --repo Kebron911/excell-templates --body "https://n8n.thestrledger.com/webhook"
```

### 4. n8n side — capture-receiver

1. Import [`infrastructure/n8n/flows/capture-receiver.json`](../../../infrastructure/n8n/flows/capture-receiver.json)
2. Activate
3. Set n8n env vars:
   - `EMPIRE_REPO_PATH` = absolute path to the repo on the n8n host
   - `EMPIRE_CONSOLE_BASE_URL` = `https://dashboard.thestrledger.com`
4. CORS: webhook returns `Access-Control-Allow-Origin: ${EMPIRE_CONSOLE_BASE_URL}`
5. Optional: set up git creds on the n8n host so the `Git commit + push` step works

### 5. First deploy

Push to `main` → GitHub Actions runs:
1. Install + typecheck + validate (ops + atlas)
2. `pnpm build` → produces `dist/`
3. SSH key written to runner, host-key pinned via `ssh-keyscan`
4. `rsync -av --delete dist/ → /home/u470667024/domains/dashboard.thestrledger.com/public_html/`
5. Smoke check (200 or 401 = healthy)

## Verifying

1. **Direct access:** `https://dashboard.thestrledger.com` → browser prompts for username/password
2. **After login:** Today landing renders; HealthDot is green
3. **Inbox:** press `i`, type "test", save → toast "Captured · synced ✓"
4. **n8n:** capture-receiver execution shows in n8n UI
5. **Repo:** `ops/inbox.ndjson` has the new line (next git pull)
6. **PWA install:** mobile Safari/Chrome → Add to Home Screen → icon appears

## Rolling back

Hostinger doesn't keep deploy history. Rollback strategies:
- **Re-deploy from a previous commit:** revert the commit in git, push → workflow re-runs with old build
- **Manual:** `git checkout <previous-sha> && cd tools/empire-console && pnpm build && rsync ...` from local

For more durable history, consider keeping a `dist-archive/` rsync target on the server (out of scope for v1).

## What lives where

| In repo | On Hostinger | In GitHub |
|---|---|---|
| Astro source + ops YAMLs | `public_html/` (built dist) | Workflow definition |
| `.env.example` (no secrets) | `.htpasswd-dashboard` (above doc root) | Secrets (STR_SSH_KEY, PUBLIC_N8N_WEBHOOK_BASE) |
| `.htaccess` (security + routing + auth gate) | active on the subdomain | — |
| `robots.txt` | active on the subdomain | — |

## Costs

Already covered by the existing Hostinger plan that hosts the cluster sites. **$0 marginal** for this deployment.

## Trade-offs vs the alternatives

| | Hostinger ✓ | external Pages provider | Local-only |
|---|---|---|---|
| Mobile-friendly | ✓ HTTPS + PWA | ✓ | ✗ |
| Auth | basic auth (.htpasswd) | external IdP | n/a |
| Vendor count | 0 new | +1 | 0 |
| Setup time | ~15 min (subdomain + htpasswd) | ~30 min | 0 |
| Pattern reuse | ✓ matches sister sites exactly | new pattern | n/a |
| Failure modes | Hostinger outage | external service outage | n/a |

## Open follow-ups

- [ ] Decide if n8n's git-push step stays enabled or captures stay in n8n's own datastore
- [ ] Set up basic dist-archive on the Hostinger server for rollback
- [ ] Add a second user (VA) when needed — single `htpasswd` command
- [ ] Consider observability (PostHog / Plausible) once usage warrants it (audit S3)

## Related

- [Empire Console design spec](../../../docs/superpowers/specs/2026-05-10-empire-console-design.md) §7 Phase 5
- [Capture receiver flow](../../../infrastructure/n8n/flows/capture-receiver.json)
- [Deploy workflow](../../../.github/workflows/deploy-empire-console.yml)
- [STRHost deploy doc](../../../STRHost-Tools/docs/DEPLOY.md) — reference for the cluster pattern
- [PWA manifest](../public/manifest.webmanifest)
