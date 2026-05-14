# CREDENTIALS — Single source of truth for "where does X live?"

> This file is the index. Secrets themselves never appear here — they live in `.env` files (gitignored) or Vaultwarden.
>
> **Rule:** Before asking the user "where is the X key" or "what's the X subdomain", read this file. If a credential isn't listed here, add it the moment you learn it.

---

## Platform → file path map

> **Status = "✅ set" means the value has length >3 in the env file.** Empty `KEY=` lines do NOT count as set. Always re-audit with the bash command below when in doubt.

| Platform | Secret name | Lives at | Subdomain / account | Status (verified 2026-05-11) |
|---|---|---|---|---|
| **InfluencerSoft** | `INFLUENCERSOFT_API_KEY` | `./.env` (repo root) | `kebron.influencersoft.com` | ✅ set (32 chars) — live probe confirmed |
| **n8n** | `N8N_API_KEY`, `N8N_BASE_URL` | `./.env` (repo root) | `n8ncde.cdeprosperity.com` (self-hosted VPS) | ✅ set (key 207 chars JWT; URL 39 chars). Auth header = `X-N8N-API-KEY` (n8n's convention, not Bearer). |
| **Stripe** | `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` | `STRManuals/site/.env` | dashboard.stripe.com | ✅ set (sk_live 107 chars). 66 STR Ledger products + payment links populated 2026-05-11. |
| **OpenAI** | `OPENAI_API_KEY` | `STRGuests-Tools/.env.local` | n/a — model `gpt-4o-mini` | ✅ set (164 chars) |
| **MySQL (strguests)** | `MYSQL_HOST/PORT/USER/PASSWORD/DATABASE` | `STRGuests-Tools/.env.local` | Hostinger Business MySQL | ⚠️ host/user/db set, **password empty** — only dev-friendly so far |
| **Hostinger SSH** | GitHub Actions secret `STR_SSH_KEY` | repo Actions → Secrets | hpanel.hostinger.com | ✅ deploy active |
| **GA4** | `PUBLIC_GA4_ID` (public, build-time) | `STRGuests-Tools/.env.local` | — | ❌ measurement ID pending |
| **Email verify HMAC** | `EMAIL_VERIFY_SECRET` | `STRGuests-Tools/.env.local` | — | ✅ set (32+ bytes random) |
| **IP hash salt** | `IP_HASH_SALT` | `STRGuests-Tools/.env.local` | — | ✅ set |
| **Etsy** | `ETSY_API_KEY`, `ETSY_OAUTH_SECRET`, `ETSY_SHOP_ID`, `ETSY_ACCESS_TOKEN`, `ETSY_REFRESH_TOKEN`, `ETSY_TOKEN_EXPIRES_AT` | `./.env` (repo root) + n8n workflow static data (W31 — Etsy Token Manager) | `etsy.com/shop/thestrledger` (shop ID `65957104`) | ✅ OAuth bootstrapped, refresh rotation live. n8n W31 cron auto-refreshes every 50 min; other workflows consume via Execute Workflow sub-call. Scope: 4 minimum (`email_r listings_r listings_w transactions_r`) — Personal Access tier. |
| **Anthropic (listingaudit)** | `ANTHROPIC_API_KEY` | `STRListingAudit-Tools/.env.local` | n/a — models `claude-sonnet-4-5` (synth) + `claude-haiku-4-5` (per-dim) | ⏳ pending — required for Phase 3 scorecard engine |
| **Apify (listingaudit)** | `APIFY_TOKEN`, `APIFY_AIRBNB_ACTOR` | `STRListingAudit-Tools/.env.local` | apify.com console | ⏳ pending — actor default `tri_angle/airbnb-scraper`, swap if budget breaches |
| **Admin token (listingaudit)** | `ADMIN_TOKEN` | `STRListingAudit-Tools/.env.local` | — | ⏳ pending — gates `POST /api/scrape` debug endpoint |
| **MySQL (listingaudit)** | `MYSQL_HOST/PORT/USER/PASSWORD/DATABASE` | `STRListingAudit-Tools/.env.local` | Hostinger Business MySQL — DB `strlistingaudit` (open question: shared instance with strguests or new?) | ⏳ pending |
| **Email verify HMAC (listingaudit)** | `EMAIL_VERIFY_SECRET` | `STRListingAudit-Tools/.env.local` | — | ⏳ pending — 32+ bytes random |
| **IP hash salt (listingaudit)** | `IP_HASH_SALT` | `STRListingAudit-Tools/.env.local` | — | ⏳ pending — 32+ bytes random |
| **GA4 (listingaudit)** | `PUBLIC_GA4_ID` | `STRListingAudit-Tools/.env.local` | — | ⏳ pending — Phase 6 |
| **Google AI (Gemini)** | `GEMINI_API_KEY` | `./.env` (repo root) | aistudio.google.com | ⏳ pending — used by `Tools/N8n-Builder/scripts/blog-hero.mjs` (author-time blog hero images) + n8n workflow `tAjD44AkUEN7NWl7`. Get key at https://aistudio.google.com/apikey |
| **n8n Docker host (SSH)** | `N8N_SSH_HOST/USER/KEY_PATH` + compose paths (see block below) | `./.env` (repo root) | same VPS as `n8ncde.cdeprosperity.com` | ⏳ template — fill in to enable platform-layer ops |

---

## n8n Docker host — SSH details

> Enables operations the n8n REST API cannot do: install community nodes, edit `N8N_*` env vars, tail container logs, modify Traefik labels, restart services, back up the data volume.
>
> **Fill in the `<...>` placeholders.** Private SSH key stays on disk at the path below — never paste it into chat or commit it.

```
N8N_SSH_HOST          = 192.168.86.25
N8N_SSH_PORT          = 22
N8N_SSH_USER          = n8n-ops
N8N_SSH_KEY_PATH      = C:\Users\Kebron\.ssh\n8n-ops_ed25519

N8N_COMPOSE_DIR       = /home/kebron/git/mydocker
N8N_SERVICE_NAME      = n8n
N8N_CONTAINER_NAME    = n8n
N8N_DATA_VOLUME       = /home/kebron/git/mydocker/n8n/data
N8N_ENV_FILE          = /home/kebron/git/mydocker/n8n/data/config

TRAEFIK_COMPOSE_DIR   = /home/kebron/git/mydocker
TRAEFIK_SERVICE_NAME  = traefik
TRAEFIK_NETWORK       = my_network
TRAEFIK_DASHBOARD_URL = internal only

N8N_ENCRYPTION_KEY    = <DO NOT COPY HERE — lives in N8N_ENV_FILE on box only>
```

**Notes**
- SSH user `n8n-ops` is in the `docker` group, key-based auth only, no password (see setup steps in chat).
- `N8N_ENCRYPTION_KEY` decrypts every credential stored in n8n — keep it on the box, back up separately to Vaultwarden.
- If Traefik dashboard is publicly exposed, gate it behind basic-auth middleware before doing anything else.

---

## Quick-reference commands

```powershell
# Verify which keys are set without echoing values
Get-ChildItem -Path . -Recurse -Force -Include .env,.env.local | ForEach-Object {
  $f = $_.FullName
  Write-Host "--- $f ---"
  Get-Content $f | Select-String -Pattern '^[A-Z_]+\s*=' | ForEach-Object {
    if ($_ -match '^([A-Z_]+)\s*=\s*(.+)$') {
      $hasValue = if ($Matches[2].Trim()) { '<set>' } else { '<empty>' }
      "$($Matches[1])=$hasValue"
    }
  }
}
```

```bash
# Same in bash — checks the VALUE length, not just the line presence
# (an empty "KEY=" line is NOT a set key)
for f in $(find . -maxdepth 4 -name ".env*" -not -path "*/node_modules/*"); do
  echo "--- $f ---"
  while IFS= read -r line; do
    if [[ "$line" =~ ^([A-Z_]+)=(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      val="${BASH_REMATCH[2]}"
      if [ ${#val} -gt 3 ]; then echo "$key=<set len=${#val}>"; else echo "$key=<EMPTY>"; fi
    fi
  done < "$f"
done
```

---

## Where account-level info lives (2FA, storage, owner, URL)

→ `ops/credentials-inventory.md` (status-tracked matrix)

## Where backup/DR for credentials is documented

→ `docs/runbooks/disaster-recovery.md` §Scenario 6 (Vaultwarden)

---

## Updating this file

When you (the user or any agent) add a new platform integration:
1. Add a row here (under Platform → file path map).
2. Add a row to `ops/credentials-inventory.md` with account-level info.
3. Commit both in the same commit. They must not drift.

Last updated: 2026-05-14 (added 7 rows for the new listingaudit.tools site: Anthropic, Apify, admin token, MySQL, email-verify HMAC, IP-hash salt, GA4. All keys pending — fill before Phase 3 / Phase 6 deploy).
