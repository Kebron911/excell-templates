# Etsy Manual Setup Guide

> **Manual step — Etsy requires SSN/EIN + bank account + government-ID upload through their seller onboarding flow.** Listings + thumbnails + post-purchase tagging are fully automatable via Etsy API v3 once the account exists and the developer app is registered. This guide covers the human-only legal/regulatory + dev-app-registration parts.
>
> **Last reviewed:** 2026-05-12
>
> **Account state:** ⚠️ **blank seller account created** (no shop config, no listings, no dev app, no payouts). Remaining manual work: finish onboarding (shop name, bank, tax ID, ID verification, 2FA) + register the developer API app + enable Vacation Mode until first publish.
>
> **Why this is gate #1 for revenue:** Wave-1 launches 5 Etsy SKUs (GST-001 / OPS-001 / TAX-001 / TAX-002 / TAX-003). Without onboarding complete + dev app, there's nothing for Claude to publish to.

---

## Part 1 — Pre-flight (5 min before starting)

Decide these BEFORE clicking "Sell on Etsy" so you don't backtrack mid-onboarding:

1. **Business structure:**
   - **Sole proprietor** — simplest. Your SSN is the tax ID. Fine for MVP.
   - **Single-member LLC** — requires EIN (free at https://irs.gov/ein, ~5 min). Better legal protection.
   - **Recommendation:** sole prop for now → migrate to LLC at $30K/year revenue.
2. **Bank account routing/account numbers** — same account that receives Stripe, Gumroad, IS payouts. Have them on hand.
3. **Shop name:** `The STR Ledger`. **Verify availability first** at https://www.etsy.com/search/shops?q=the+str+ledger before starting onboarding (if taken, fallback is `STR Ledger Templates`).
4. **2FA app** ready (Google Authenticator / Authy / 1Password) — NOT SMS.

→ **Tell Claude:** *"Etsy pre-flight done."*

---

## Part 2 — Finish seller account onboarding (30 min)

> Blank account already created. Sign in at https://www.etsy.com/your/shops/me with the existing credentials. The flow below picks up from wherever Etsy left you — usually mid-onboarding at "Shop preferences" or "Get paid".

### 2.1 Sign in + confirm email is `hello@thestrledger.com`

1. Sign in at https://www.etsy.com/your/shops/me.
2. **You → Account settings → Email** — confirm primary email is `hello@thestrledger.com` (now hosted on Hostinger Business per the [hostinger guide](hostinger-manual-setup-guide.md) Part 2). If it's a different email, change it now and verify via the link Etsy sends.
3. Save the Etsy login email + password to Vaultwarden under `Etsy — The STR Ledger seller`.

### 2.2 Shop preferences

1. **Shop language:** English (US).
2. **Shop country:** United States.
3. **Shop currency:** USD.
4. **About you:** "I sell digital spreadsheet templates for short-term rental operators" (one sentence is fine — Etsy expands this in your About page later).

### 2.3 Name the shop

1. Shop name: **`The STR Ledger`** (exact spelling — this becomes the URL `etsy.com/shop/thestrledger`).
2. If `thestrledger` URL is unavailable, fall back to `strledger` or `strledgertemplates`. Note the actual handle and update `ops/credentials-inventory.md`.

### 2.4 First listing draft

Etsy requires at least one listing draft to advance, but doesn't publish it yet.

1. Skip-fill with a **placeholder listing** — Claude will overwrite it later:
   - Title: `STR Template — Coming Soon`
   - Photo: upload any placeholder PNG (Claude will replace with the GST-001 thumbnail)
   - Price: `$9.00`
   - Type: **Digital file**
   - Upload any small PDF as the placeholder file
2. Save as draft. Do NOT publish.

### 2.5 How you'll get paid

1. **Country of bank account:** United States.
2. **Account holder name:** must match your legal name on Etsy.
3. Routing + account numbers.
4. Etsy may run micro-deposits — confirm both within ~3 business days.

### 2.6 Set up billing

Etsy charges listing fees ($0.20/listing) + transaction fees (6.5%) + payment processing (3% + $0.25). They need a credit card on file:

1. Add your business credit card (or personal if no business card yet).
2. Save card details to Vaultwarden if you typed them — most browsers will autofill from your password manager already.

### 2.7 Identity verification

1. Upload **government photo ID** (driver's license / passport).
2. **SSN or EIN** for tax reporting (1099-K threshold is $5,000/yr in 2026).
3. Wait for "verified" status — usually within minutes, occasionally 24h.

### 2.8 Vacation mode

Until Claude publishes the first real listing, you don't want your placeholder showing up in shop search:

1. **Settings** → **Options** → **Vacation Mode** → **On**.
2. Vacation message: "Shop launching soon — first listings go live week of [date]." (Optional.)

### 2.9 Enable 2FA

1. **You** (top-right) → **Account Settings** → **Security**.
2. **Two-factor authentication** → **Authenticator app**. Scan QR with your 2FA app.
3. Save 10 backup codes to Vaultwarden AND your offline master sheet.

→ **Tell Claude:** *"Etsy account open."*

---

## Part 3 — Register the Etsy developer app (15 min)

Listings, thumbnails, order webhooks, post-purchase tagging — everything that's not regulatory — happens via Etsy API v3. That requires an "app" registered against your shop.

### 3.1 Register the app

1. Sign in at https://www.etsy.com/developers/your-apps (sign in with the same `hello@thestrledger.com` you opened the shop with).
2. **Create a New App.**
3. App details:
   - **Name:** `STR Ledger Empire`
   - **Description:** "Internal automation app for The STR Ledger shop — listing publish, post-purchase tagging, refund webhooks. Single-shop, not multi-tenant."
   - **Website:** `https://thestrledger.com`
   - **App type:** **Personal use** (NOT Public — public requires Etsy review for distribution; we're not distributing).
4. **API scopes** to request — check all of these:
   - `email_r`
   - `listings_r`
   - `listings_w`
   - `listings_d`
   - `transactions_r`
   - `transactions_w`
   - `address_r`
   - `address_w`
   - `profile_r`
   - `feedback_r`
   - `shops_r`
   - `shops_w`
5. **Redirect URIs:** add `https://n8ncde.cdeprosperity.com/rest/oauth2-credential/callback` (n8n's OAuth callback — same URL pattern as GSC's).
6. **Submit.**

### 3.2 Capture credentials

Etsy shows you:

- **Keystring** (a.k.a. API key / `x-api-key` header value)
- **Shared Secret** (used for OAuth2 client secret)

Save BOTH to Vaultwarden under `Etsy Developer App — STR Ledger Empire`.

Also note:

- **Shop ID** — visit your shop page at `etsy.com/shop/thestrledger`, view source, find `"shop_id":<number>`. That number is `ETSY_SHOP_ID` for n8n.

→ **Tell Claude:** *"Etsy app registered: keystring + shared secret in Vaultwarden, shop ID is `<number>`."*

---

## Part 4 — Update credentials inventory (2 min)

Open `ops/credentials-inventory.md` and update the **Etsy** row:

- Account / Owner: `hello@thestrledger.com (Daniel)`
- 2FA: ✅
- Secret storage: `Vaultwarden (keystring + shared secret + shop ID)`
- Notes: `Personal-use app, single-shop. Scopes: email_r listings_rwd transactions_rw address_rw profile_r feedback_r shops_rw. Shop URL: etsy.com/shop/<handle>.`

Also update `CREDENTIALS.md` (repo root) — change the Etsy row's status from `❌ shop not yet open` to `✅ app registered, awaiting first OAuth dance`.

→ **Tell Claude:** *"Etsy credentials inventory updated."*

---

## Trigger-tag / env-var map (what Claude wires after these steps)

| Etsy output | Where it's used |
|---|---|
| Keystring | `ETSY_API_KEY` n8n credential (HTTP header auth on `x-api-key`) |
| Shared secret | `ETSY_OAUTH_SECRET` for OAuth2 dance (Claude runs once to get refresh token) |
| Shop ID | `ETSY_SHOP_ID` env var in n8n (used by nightly-refresh receipts call) |
| Shop open + verified | Unblocks `etsy-receipts` API call → post-purchase webhook → IS `customer:etsy` tag → `post-purchase-etsy-buyer` sequence fires |

---

## Estimate

- Pre-flight: 5 min
- Open seller account (active): 30 min focused; verification approval can be async 24h
- Register developer app: 15 min
- Inventory update: 2 min
- **Total: ~55 min focused work, +24h async wait for identity verification**

---

## After "Etsy account open" — what Claude can ship

1. **Run the OAuth2 dance** once to capture the refresh token. Claude runs `scripts/etsy-oauth-bootstrap.mjs` → opens a browser tab → you click **Allow** → refresh token gets saved to Vaultwarden + `ETSY_OAUTH_REFRESH` n8n credential.
2. **Bulk publish Wave-1 listings** (5 SKUs) via API — listing copy is already drafted in `copy/etsy-listings/`, thumbnails are in `templates/_build/`.
3. **Turn off vacation mode** automatically after the publish step succeeds.
4. **Wire the post-purchase webhook** — Etsy sends order notifications → n8n W01 → IS `AddTagToLead` with `customer:etsy` → triggers `post-purchase-etsy-buyer` sequence.
5. **Refund webhook → `refund-recovery` sequence** for the refund-rate guardrail.

Tracked in `ops/setup-checklist.yaml` row `cred-etsy`.

---

## Common gotchas

- **Etsy URL ≠ shop name.** "The STR Ledger" can become `thestrledger`, `strledger`, or `strledgertemplates` depending on what's free. Update `CREDENTIALS.md` with the actual handle.
- **Vacation mode doesn't pause API access.** Listings via API still work. Vacation just hides public-search visibility. Safe to keep on until you're ready to publish.
- **"Personal use" app type is correct.** Don't pick Public — that triggers Etsy review and adds 1–2 week delay. Personal use is uncapped for your own shop.
- **Identity verification can stall.** If Etsy holds verification beyond 48h, open a support ticket. This blocks payouts, not listings, so non-fatal for development work.
- **2FA backup codes — store them.** Etsy is notoriously slow at account recovery without them.
