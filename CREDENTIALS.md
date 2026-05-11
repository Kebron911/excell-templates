# CREDENTIALS — Single source of truth for "where does X live?"

> This file is the index. Secrets themselves never appear here — they live in `.env` files (gitignored) or Vaultwarden.
>
> **Rule:** Before asking the user "where is the X key" or "what's the X subdomain", read this file. If a credential isn't listed here, add it the moment you learn it.

---

## Platform → file path map

| Platform | Secret name | Lives at | Subdomain / account | Status |
|---|---|---|---|---|
| **InfluencerSoft** | `INFLUENCERSOFT_API_KEY` | `./.env` (repo root) | `kebron.influencersoft.com` | ✅ key set, subdomain known |
| **Stripe** | `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` | `STRManuals/site/.env` | dashboard.stripe.com (pending account confirm) | ✅ key set |
| **OpenAI** | `OPENAI_API_KEY` | `STRGuests-Tools/.env.local` | n/a — model `gpt-4o-mini` | ✅ key set |
| **MySQL (strguests)** | `MYSQL_HOST/PORT/USER/PASSWORD/DATABASE` | `STRGuests-Tools/.env.local` | Hostinger Business MySQL | ⚠️ unverified against prod |
| **Hostinger SSH** | GitHub Actions secret `STR_SSH_KEY` | repo Actions → Secrets | hpanel.hostinger.com | ✅ deploy active |
| **GA4** | `PUBLIC_GA4_ID` (public, build-time) | `STRGuests-Tools/.env.local` | — | ❌ measurement ID pending |
| **Email verify HMAC** | `EMAIL_VERIFY_SECRET` | `STRGuests-Tools/.env.local` | — | ✅ set (32+ bytes random) |
| **IP hash salt** | `IP_HASH_SALT` | `STRGuests-Tools/.env.local` | — | ✅ set |
| **Etsy** | OAuth client + secret + refresh token | Vaultwarden (pending) | seller account pending | ❌ shop not yet open |
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
# Same in bash
for f in $(find . -maxdepth 4 -name ".env*" -not -path "*/node_modules/*"); do
  echo "--- $f ---"
  grep -oE '^[A-Z_]+\s*=' "$f" | sort -u
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

Last updated: 2026-05-11 (IS subdomain `kebron` confirmed; OpenAI key set).
