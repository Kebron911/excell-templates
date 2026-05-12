# Gumroad Manual Setup Guide

> **Manual step — Gumroad signup requires bank + tax-ID + government-ID + 2FA enrollment that can only happen in a human browser.** Product creation + sales notifications + payout management are fully automatable via Gumroad API v2 once the access token exists.
>
> **Last reviewed:** 2026-05-11
>
> **Account state:** ❌ pending. No Gumroad account yet.
>
> **Role in the empire:** mirror storefront for the same 5 Wave-1 SKUs. Customers who don't want Etsy / don't trust Etsy can buy direct from Gumroad. Non-blocking for first revenue but shipped in parallel with Etsy to capture both channels.

---

## Part 1 — Open the account (15 min)

### 1.1 Sign up

1. Go to https://gumroad.com.
2. Click **Start selling**.
3. Email: `hello@thestrledger.com`.
4. Set a strong password — save to Vaultwarden.
5. **Username:** `thestrledger` (lowercase, becomes URL `gumroad.com/thestrledger`).
   - If taken, fall back to `strledger`. Note the actual handle.

### 1.2 Profile

1. Display name: **The STR Ledger**.
2. Bio: "Excel spreadsheet templates for short-term rental operators. Tax, ops, marketing, acquisition." (One sentence — Gumroad's bio field is small.)
3. Profile picture: upload `brand/assets/logo-square-navy.png` (already produced).
4. Cover image: upload `brand/assets/cover-gumroad.png` if it exists, otherwise skip — Claude can render one later.

### 1.3 Payout setup

1. **Settings** → **Payments**.
2. **Country:** United States.
3. **Bank account** (ACH preferred, lower fees than PayPal): routing + account numbers. Same bank as Etsy/Stripe payouts.
4. **Tax info (W-9):** Gumroad collects this for 1099-K compliance.
   - Legal name + SSN or EIN.
   - Tax classification: Individual / Sole proprietor / LLC (match what you did for Etsy/Stripe).
5. Submit.

### 1.4 Enable 2FA

1. **Settings** → **Security**.
2. **Two-factor authentication** → **Authenticator app** (NOT SMS).
3. Scan QR with your 2FA app.
4. Save the backup codes to Vaultwarden + offline master sheet.

### 1.5 Statement descriptor + brand polish

1. **Settings** → **Advanced**.
2. **Statement descriptor:** `STR LEDGER` (matches Stripe's — keeps cardholder statements consistent across both channels).

→ **Tell Claude:** *"Gumroad account open."*

---

## Part 2 — Generate the API access token (5 min)

Gumroad's API v2 needs an access token. This is what `GUMROAD_TOKEN` references in n8n's nightly-refresh flow.

### 2.1 Create an OAuth application

1. **Settings** → **Advanced** → **Applications**.
2. **Create application.**
3. Application details:
   - **Name:** `STR Ledger Empire`
   - **Redirect URI:** `https://n8ncde.cdeprosperity.com/rest/oauth2-credential/callback` (matches the n8n callback pattern used by Etsy + GSC)
   - **Icon:** upload the logo square if Gumroad asks for one.
4. **Save.**

### 2.2 Generate access token

After creating the app, Gumroad shows:

- **Application ID** (a.k.a. Client ID)
- **Application secret** (Client secret)
- **Access token** — this is what n8n uses

Save **all three** to Vaultwarden under `Gumroad Application — STR Ledger Empire`.

The access token alone is enough for `GUMROAD_TOKEN` — n8n uses simple bearer-token auth, not the full OAuth dance, because the access token is already pre-authorized to your account.

→ **Tell Claude:** *"Gumroad API token generated + in Vaultwarden."*

---

## Part 3 — Update credentials inventory (2 min)

Open `ops/credentials-inventory.md` and update the **Gumroad** row:

- Account / Owner: `hello@thestrledger.com (Daniel)`
- 2FA: ✅
- Secret storage: `Vaultwarden (access token + app ID + secret)`
- Notes: `Mirror storefront. Username: gumroad.com/<handle>. App name "STR Ledger Empire". Access token used as GUMROAD_TOKEN in n8n nightly-refresh.`

→ **Tell Claude:** *"Gumroad inventory row updated."*

---

## Trigger-tag / env-var map (what Claude wires after these steps)

| Gumroad output | Where it's used |
|---|---|
| Access token | `GUMROAD_TOKEN` n8n credential (HTTP bearer auth) |
| Account active | Enables `scripts/gumroad-bulk-publish.mjs` to create the 5 Wave-1 SKUs via API |
| Sale webhook (configured by Claude via API later) | Gumroad sale → n8n → IS `customer:gumroad` tag → `post-purchase-gumroad-buyer` sequence (Phase 2+ — not in Wave 1) |

---

## Estimate

- Open account: 15 min (+ async wait for bank micro-deposits if Gumroad requires them)
- Generate API token: 5 min
- Inventory update: 2 min
- **Total: ~25 min focused work**

---

## After "Gumroad account open + API token added"

Claude can then:

1. **Run `scripts/gumroad-bulk-publish.mjs`** — creates the 5 Wave-1 SKUs via API using the same brief + thumbnail set as Etsy.
2. **Subscribe to Gumroad ping URLs** (sale webhooks) — point at the n8n `gumroad-sale-webhook` flow.
3. **Cross-link Etsy + Gumroad listings** in the brand footer / product pages: customers can pick their preferred storefront.

Tracked in `ops/setup-checklist.yaml` row `cred-gumroad`.

---

## Common gotchas

- **Gumroad fees are higher than Etsy in some cases.** Gumroad: 10% (Starter free tier) → 7% (Creator $10/mo) → 3.5% (Premium $96/mo). For Phase 1 stick to Starter (10% flat). At ~$5K/mo gross, the savings of Creator tier kick in.
- **Don't use Gumroad's storefront customization as a long-term shop.** It's a mirror channel — your main site is `thestrledger.com`, your primary search-traffic shop is Etsy. Gumroad is the "I don't want to deal with Etsy" lane.
- **Pricing parity matters.** Gumroad price should be **identical** to Etsy for the same SKU. If you discount Gumroad, customers will route through Gumroad and Etsy's algorithm will demote you for low conversion.
- **Refund policy:** Gumroad has a default 30-day no-questions-asked refund. You can disable in Settings → Advanced. Don't — keeping it on matches Etsy's experience and reduces dispute risk.
- **The Application ID + Secret are NOT the access token.** All three exist; the access token is the only one n8n uses. Other two are only needed if you ever do a real OAuth dance for a multi-tenant Gumroad app (not applicable here).
