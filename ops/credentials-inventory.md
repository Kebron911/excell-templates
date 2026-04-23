# Credentials Inventory

> Secrets never appear in this file. This is the map of where each secret lives.

| Tool | URL | Account / Owner | 2FA | Secret storage | Notes |
|---|---|---|---|---|---|
| GitHub | github.com/Kebron911 | Kebron911 | ✅ | Password manager | gh CLI authenticated |
| Airtable | airtable.com | (pending) | pending | Password manager + MCP env | PAT to be created for MCP |
| Influencersoft | (pending) | (pending) | pending | Password manager | LTD license owned |
| Stripe | dashboard.stripe.com | (pending) | pending | Password manager + IS | Stripe Tax enabled |
| Ghost | (pending host) | (pending) | pending | Password manager | Subdomain blog.thestrledger.com |
| Google Workspace | admin.google.com | (pending) | pending | Password manager | Used for backups + custom email |
| Cloudflare | dash.cloudflare.com | (pending) | pending | Password manager | DNS + Tunnel + Registrar |
| Hetzner/DO VPS | (pending host) | (pending) | pending | SSH keys + PM | n8n host |
| Canva Pro | canva.com | (pending) | pending | Password manager | Brand kit lives here |
| Tailwind | tailwindapp.com | (pending) | pending | Password manager | Pinterest scheduler |
| Buffer | buffer.com | (pending) | pending | Password manager | Secondary social scheduler |
| Etsy | etsy.com | (pending) | pending | Password manager + 2FA app | Seller account |
| Gumroad | gumroad.com | (pending) | pending | Password manager | Mirror storefront |
| Pinterest Business | pinterest.com | (pending) | pending | Password manager | Domain claim pending |
| Instantly | instantly.ai | (pending — Phase 2) | pending | Password manager | Cold outreach (Phase 2+) |
| Domain registrar | (pending) | (pending) | ✅ | Password manager | See Task B1 / A2 |

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

## Onboarding a VA (future)

When hiring a VA, never share this file. Provision scoped access only:
- Airtable: workspace collaborator, specific base, edit permission
- IS: team member role, no billing access
- Canva: team editor
- No direct access to Stripe, Cloudflare, VPS, domain registrar, password manager
