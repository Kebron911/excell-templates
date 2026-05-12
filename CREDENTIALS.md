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
| **Etsy** | `ETSY_API_KEY`, `ETSY_OAUTH_SECRET`, `ETSY_SHOP_ID` (+ refresh token after OAuth dance) | `./.env` (repo root) + Vaultwarden | `etsy.com/shop/thestrledger` (shop ID `65957104`) | ✅ app registered (keystring 24, shared secret 10, shop ID 8). Awaiting first OAuth dance to capture refresh token. |
| **Anthropic (optional fallback)** | `ANTHROPIC_API_KEY` | not set — would go in `STRGuests-Tools/.env.local` if used | — | ❌ not used (OpenAI chosen) |

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

Last updated: 2026-05-12 (Etsy dev app registered: keystring + shared secret in `./.env`, shop ID `65957104`, handle `thestrledger`).
