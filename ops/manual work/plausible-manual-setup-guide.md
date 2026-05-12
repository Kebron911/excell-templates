# Plausible Manual Setup Guide

> **Manual step — Plausible account signup + site addition + Stats-API token creation are browser-only.** Once the token exists, every API call (traffic counts, conversion rates, funnel data) is automatable from n8n.
>
> **Last reviewed:** 2026-05-11
>
> **Account state:** ❌ pending. Per `ops/credentials-inventory.md`: no Plausible row yet.
>
> **Role in the empire:** privacy-first analytics for every public surface (`thestrledger.com`, `strguests.tools`, `strmanuals.thestrledger.com`, etc.). Feeds the `traffic-anomaly-watch` + `funnel-dropout-watch` + `nightly-refresh` n8n flows.

---

## Pre-flight

- Decide: self-hosted Plausible (free, you run it) vs Plausible Cloud (paid, they run it). For Phase 1 the time cost of self-hosting outweighs the monthly fee — **use Plausible Cloud.** Re-evaluate at Month 12 if usage costs cross $50/mo.
- Have your domains list ready: `thestrledger.com`, `strguests.tools`, `strmanuals.thestrledger.com`, `dashboard.thestrledger.com`. (Add to Plausible separately — each is a "site" in their model.)

---

## Part 1 — Sign up + add the primary site (10 min)

### 1.1 Create the account

1. Go to https://plausible.io.
2. **Try it for free** → 30-day trial.
3. Sign up with `hello@thestrledger.com`.
4. Save the password to Vaultwarden.
5. Pick the **Growth** plan ($9/mo, 10k pageviews/mo) — fine for Phase 1. Re-evaluate at Month 3 if you cross 8k/mo.

### 1.2 Add `thestrledger.com`

1. **+ Add a website.**
2. Domain: `thestrledger.com`.
3. Timezone: your local.
4. Plausible shows you the tracking snippet:
   ```html
   <script defer data-domain="thestrledger.com" src="https://plausible.io/js/script.js"></script>
   ```
5. **Don't paste it manually.** This already exists in the template repo — Claude will wire it into each site's `<head>` programmatically after you confirm the domain is added.

### 1.3 Add the other 3 sites

Repeat 1.2 for:
- `strguests.tools`
- `strmanuals.thestrledger.com`
- `dashboard.thestrledger.com` (this one will get traffic data only from you — it's basic-auth gated)

> **Plausible bills per total site, not per pageview-aggregate.** 4 sites at the Growth tier is still $9/mo as long as combined pageviews stay under 10k. You don't pay per site, you pay per usage.

### 1.4 Enable 2FA

1. **Settings** → **Account** → **Two-factor authentication** → on.
2. Authenticator app (NOT SMS).
3. Save backup codes to Vaultwarden + offline master.

→ **Tell Claude:** *"Plausible account live + 4 sites added."*

---

## Part 2 — Generate the Stats API token (5 min)

The Stats API is what n8n calls for traffic + conversion + funnel data.

1. **Settings** (top-right avatar) → **API Keys**.
2. **+ New API key.**
3. Name: `n8n-nightly-refresh`.
4. Scope: **Stats API** (read-only, the only scope that exists for Stats; do NOT pick the Sites API scope for n8n — that allows site management which n8n doesn't need).
5. **Continue → Submit.**
6. Plausible shows the token (format: long random hex string). **Shown once.** Save immediately to Vaultwarden under `Plausible Stats API — n8n`.

> **Important:** The Stats API token is scoped to your **entire account** (all sites), not per-site. One token covers all 4 sites you added in Part 1.

→ **Tell Claude:** *"Plausible Stats API token in Vaultwarden."*

---

## Part 3 — Update credentials inventory (2 min)

Open `ops/credentials-inventory.md`. Add a new row for Plausible (or update if it exists):

| Tool | URL | Account / Owner | 2FA | Secret storage | Notes |
|---|---|---|---|---|---|
| Plausible | plausible.io | `hello@thestrledger.com` (Daniel) | ✅ | Vaultwarden | Growth plan $9/mo. 4 sites: thestrledger.com, strguests.tools, strmanuals.thestrledger.com, dashboard.thestrledger.com. Stats API token (account-scoped, read-only). |

→ **Tell Claude:** *"Plausible inventory row added."*

---

## Trigger-tag / env-var map

| Plausible output | Where it's used |
|---|---|
| Stats API token | `PLAUSIBLE_TOKEN` n8n credential (HTTP bearer) |
| 4 sites tracking | Claude wires the `<script>` snippet into each Astro `<head>` |
| Stats API per-site | n8n `nightly-refresh` → `ops/cache/traffic.json` per site |
| Real-time traffic-anomaly-watch | Plausible "Realtime" API → n8n cron → P1 Telegram if traffic drops >50% vs rolling baseline |

---

## Estimate

- Account + 4 sites: 10 min
- API token: 5 min
- Inventory update: 2 min
- **Total: ~15 min**

---

## Common gotchas

- **One token = all sites.** You don't need 4 tokens for 4 sites — one Stats API token reads across all of them. If you ever need to revoke (e.g. compromised), you re-issue once and update n8n credential once.
- **Plausible has NO retroactive data.** When you add a site, tracking starts from that moment. If you delay the script-injection step, you lose the gap — bake it into the same release that goes live for the public site.
- **Custom events:** Plausible's `data-domain` + manual `plausible('Goal name')` calls are how you track conversions (PDF downloads, checkout-clicks). Claude has these wired in `packages/email-gate/` and `STRGuests-Tools` already — you don't need to configure goals in the Plausible UI for that to work.
- **Real-time API rate limit:** 600 req/hour per token. n8n's `traffic-anomaly-watch` runs at most every 5 min (12 req/hour) — plenty of headroom.
- **Self-hosted alternative:** if costs are a concern later, https://github.com/plausible/community-edition is the open-source self-hosted version. Same API surface, same script, just lives on your VPS. Worth migrating only if Plausible Cloud bill exceeds ~$50/mo for ≥3 months.
