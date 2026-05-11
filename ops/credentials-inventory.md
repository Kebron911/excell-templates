# Credentials Inventory

> Secrets never appear in this file. This is the map of where each secret lives.
>
> **Index lives at `CREDENTIALS.md` (repo root).** Read that file first for `.env` paths. This file = account-level / 2FA / vault-storage metadata.

| Tool | URL | Account / Owner | 2FA | Secret storage | Notes |
|---|---|---|---|---|---|
| **Vaultwarden** (self-hosted) | (fill in your instance URL) | Daniel | ✅ required | Self-hosted server + monthly encrypted export to Google Drive `backups/vaultwarden/` | Master vault. If this dies, every other credential is inaccessible. Backup/DR plan: `docs/runbooks/disaster-recovery.md` §Scenario 6. |
| GitHub | github.com/Kebron911 | Kebron911 | ✅ | Vaultwarden | gh CLI authenticated |
| Airtable | airtable.com | (pending) | pending | Vaultwarden + MCP env | PAT to be created for MCP |
| Influencersoft | kebron.influencersoft.com | Kebron | pending | `./.env` → `INFLUENCERSOFT_API_KEY` + Vaultwarden | LTD license owned. Tenant subdomain `kebron`. API base = `https://kebron.influencersoft.com/api/<Method>` (PascalCase). Live probe 2026-05-11 confirmed `GetAllGroups` + `GetGoods` return 200 OK. |
| Stripe | dashboard.stripe.com | (pending) | pending | Vaultwarden + IS | Stripe Tax enabled |
| Ghost | (pending host) | (pending) | pending | Vaultwarden | Subdomain blog.thestrledger.com |
| Google Workspace | admin.google.com | (pending) | pending | Vaultwarden | Used for backups + custom email |
| Hostinger | hpanel.hostinger.com | (pending) | pending | Vaultwarden | Hosting + DNS + domain registrar + AutoSSL — single vendor for the cluster |
| VPS (n8n host) | (pending) | (pending) | pending | SSH keys + Vaultwarden | n8n host (Hostinger VPS or other) |
| Vista Create Pro | create.vista.com | (pending) | pending | Vaultwarden | Brand kit lives here — lifetime deal owned, no subscription |
| Creasquare | app.creasquare.io | (pending) | pending | Vaultwarden | Multi-platform scheduler: IG, LinkedIn, YouTube, TikTok, FB, **and Pinterest**. Lifetime deal owned — replaces Buffer AND covers Pinterest scheduling for Months 1–3. Pinterest integration is basic per user reviews; Pinterest native scheduler is a documented fallback if Creasquare's Pinterest features prove limiting. |
| Etsy | etsy.com | (pending) | pending | Vaultwarden + 2FA app | Seller account |
| Gumroad | gumroad.com | (pending) | pending | Vaultwarden | Mirror storefront |
| Pinterest Business | pinterest.com | (pending) | pending | Vaultwarden | Domain claim pending. Connected to Creasquare (primary scheduler). Pinterest native scheduler (free, 100 pins / 14 days) available as fallback. Re-evaluate Tailwind at Month 3 if Pinterest is driving traffic/sales and Creasquare's Pinterest features feel thin. |
| Instantly | instantly.ai | (pending — Phase 2) | pending | Vaultwarden | Cold outreach (Phase 2+) |
| Domain registrar | (pending) | (pending) | ✅ | Vaultwarden | See Task B1 / A2 |

## Review cadence

Monthly — verify 2FA active, rotate any unrotated keys, audit VA access.

## Rotation policy

- API keys: every 12 months, or immediately on any suspicion of compromise
- VPS root password: never used (SSH keys only)
- n8n encryption key: never rotated (rotation invalidates stored credentials); store multiple backup copies instead
- Stripe restricted keys: scoped per integration, never a full account key

## Emergency contacts

- Domain registrar recovery: account recovery process requires government ID — document expected turnaround
- Stripe account recovery: verified email + 2FA + bank verification — keep email account active
- Airtable base loss: latest weekly CSV backup in Google Drive → reimport

## Deferred tools (not active — re-evaluate at trigger)

| Tool | Deferred because | Re-evaluate when | Cost if reactivated |
|---|---|---|---|
| Tailwind | Creasquare handles Pinterest scheduling for Months 1–3; Tailwind's unique value (SmartLoop, Tribes, best-time analytics) only pays off once Pinterest is confirmed as a converting channel and Creasquare's Pinterest features feel limiting | Month 3: if Pinterest driving ≥100 outbound clicks/mo OR ≥5 email signups/mo attributed to Pinterest | $15/mo |
| Buffer | Replaced by Creasquare (lifetime deal, same platforms + AI content features) | Only if Creasquare drops support for a critical platform or breaks for >14 days | $15/mo (Buffer free tier covers 3 channels as emergency fallback) |

## Onboarding a VA (future)

When hiring a VA, never share this file. Provision scoped access only:
- Airtable: workspace collaborator, specific base, edit permission
- IS: team member role, no billing access
- Vista Create: team editor
- No direct access to Stripe, Hostinger hPanel, VPS, Vaultwarden
