# Secrets Inventory — STR Cluster

Single source of truth for every secret used across the cluster. Update this file before adding or rotating any secret.

**Storage:** Vaultwarden (primary), GitHub Actions secrets (deploy-only mirror), per-tool `.env` files (local dev only — gitignored).

**Rotation policy:** Quarterly for paid APIs (Stripe, OpenAI), annually for hashing salts, on-incident for any leak suspicion.

---

## How to use this file

1. Adding a new secret: add a row to the relevant table, store the value in Vaultwarden, mirror to GitHub Secrets if a deploy workflow needs it, then update the tool's `.env.example` with the key (no value).
2. Rotating a secret: rotate at source → update Vaultwarden → update GitHub Secrets → update local `.env` → mark date in the **Last rotated** column.
3. Removing a secret: archive the Vaultwarden entry, delete from GitHub Secrets, remove from `.env.example`, strike the row here with `~~`.

---

## Cluster-wide secrets

| Key | Purpose | Vaultwarden ID | GitHub Secrets | Owner | Last rotated |
|---|---|---|---|---|---|
| `HOSTINGER_FTP_HOST` | Hostinger FTP hostname for SFTP deploys | _TODO_ | yes (per-repo) | Daniel | — |
| `HOSTINGER_FTP_USER` | Hostinger FTP user (per-tool sub-account) | _TODO_ | yes (per-repo) | Daniel | — |
| `HOSTINGER_FTP_PASS` | Hostinger FTP password | _TODO_ | yes (per-repo) | Daniel | — |
| `HOSTINGER_SSH_KEY` | OpenSSH ed25519 key — `~/.ssh/hostinger_ed25519` — shared across cluster | _TODO_ | yes (per-repo) | Daniel | — |

---

## strbuyers.tools

Source: [STRBuyers-Tools/.env.example](../STRBuyers-Tools/.env.example)

| Key | Public | Purpose | Required at | Last rotated |
|---|---|---|---|---|
| `DB_HOST` | no | MySQL host (Hostinger managed) | server runtime (Phase 4) | — |
| `DB_PORT` | no | MySQL port | server runtime | — |
| `DB_USER` | no | MySQL user | server runtime | — |
| `DB_PASS` | no | MySQL password | server runtime | — |
| `DB_NAME` | no | MySQL database name | server runtime | — |
| `IP_HASH_SALT` | no | Salt for sha256(IP) in click logging | server runtime | — |
| `PORT` | no | Express server port | server runtime | — |
| `CORS_ORIGIN` | no | Allowed CORS origin | server runtime | — |
| `PUBLIC_ESP_WEBHOOK` | yes | ESP webhook for email capture | build | — |
| `PUBLIC_GA4_ID` | yes | GA4 measurement ID | build | — |

---

## strguests.tools

Source: [STRGuests-Tools/.env.example](../STRGuests-Tools/.env.example)

| Key | Public | Purpose | Required at | Last rotated |
|---|---|---|---|---|
| `MYSQL_HOST` | no | MySQL host | server runtime | — |
| `MYSQL_PORT` | no | MySQL port | server runtime | — |
| `MYSQL_USER` | no | MySQL user | server runtime | — |
| `MYSQL_PASSWORD` | no | MySQL password | server runtime | — |
| `MYSQL_DATABASE` | no | MySQL database name | server runtime | — |
| `OPENAI_API_KEY` | no | OpenAI key for AI generators (Phase 3+) | server runtime | — |
| `EMAIL_VERIFY_SECRET` | no | HMAC signing secret for email-verify tokens (32+ bytes) | server runtime | — |
| `IP_HASH_SALT` | no | Salt for sha256(IP) | server runtime | — |
| `PUBLIC_ESP_WEBHOOK` | yes | ESP webhook for email capture | build | — |
| `PUBLIC_API_BASE` | yes | Base URL for API server | build | — |
| `PUBLIC_ADSENSE_ENABLED` | yes | Toggle AdSense ("true"/"false") | build | — |
| `PUBLIC_ADSENSE_CLIENT` | yes | AdSense client ID | build | — |
| `PUBLIC_GA4_ID` | yes | GA4 measurement ID | build | — |

---

## strhost.tools

Source: [STRHost-Tools/.env.example](../STRHost-Tools/.env.example)

| Key | Public | Purpose | Required at | Last rotated |
|---|---|---|---|---|
| `PUBLIC_GA4_ID` | yes | GA4 measurement ID | build | — |
| `PUBLIC_ADSENSE_ENABLED` | yes | Toggle AdSense | build | — |
| `PUBLIC_ADSENSE_CLIENT` | yes | AdSense client ID | build | — |
| `PUBLIC_ESP_ENDPOINT` | yes | ESP endpoint for lead-magnet POST | build | — |

---

## strops.tools

Source: [STROps-Tools/.env.example](../STROps-Tools/.env.example)

| Key | Public | Purpose | Required at | Last rotated |
|---|---|---|---|---|
| `PUBLIC_GA4_ID` | yes | GA4 measurement ID | build | — |
| `PUBLIC_ADSENSE_ENABLED` | yes | Toggle AdSense | build | — |
| `PUBLIC_ADSENSE_CLIENT` | yes | AdSense client ID | build | — |
| `PUBLIC_ESP_ENDPOINT` | yes | ESP endpoint for lead-magnet POST | build | — |

---

## The STR Ledger / Excel-Templates (per PROGRESS.md P0.0)

These are platform-level secrets for the commerce backbone. Not in any per-tool `.env.example` yet — populate when the relevant phase ships.

| Key | Purpose | Owner |
|---|---|---|
| `STRIPE_KEY` | Stripe live + test keys | Daniel |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Daniel |
| `INFLUENCERSOFT_API_KEY` | Influencersoft API (membership + email) | Daniel |
| `ETSY_OAUTH_CLIENT_ID` | Etsy storefront OAuth | Daniel |
| `ETSY_OAUTH_SECRET` | Etsy storefront OAuth | Daniel |
| `GUMROAD_API_KEY` | Gumroad storefront API | Daniel |
| `AIRTABLE_API_KEY` | Airtable SSOT access | Daniel |
| `N8N_WEBHOOK_TOKEN` | n8n webhook signing for inbound automations | Daniel |
| `CLOUDFLARE_API_TOKEN` | CDN + DNS automation | Daniel |
| `GHOST_ADMIN_KEY` | blog.thestrledger.com admin API | Daniel |

---

## Audit checklist (run quarterly)

- [ ] Every key in this file has a corresponding entry in Vaultwarden.
- [ ] Every GitHub Secret matches a row here (no orphans).
- [ ] No `.env` files committed (`git ls-files | grep -E '\.env$'` returns empty).
- [ ] No hardcoded secrets in source (`rg -i 'sk_live_|sk_test_|api[_-]?key.*=.*[a-z0-9]{20}'` returns no real keys).
- [ ] Rotation dates filled in for any production secret older than the rotation policy window.
