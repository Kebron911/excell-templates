# Google Workspace + Search Console Manual Setup Guide

> **Manual step — Workspace signup requires domain ownership proof + payment + email-MX click-through that can only happen in a human browser.** OAuth client creation for Search Console likewise requires the project owner to consent in Google Cloud Console.
>
> **Last reviewed:** 2026-05-11
>
> **Account state:** ❌ neither Workspace nor Search Console exists. `hello@thestrledger.com` does not yet route. This blocks every other account-opening below it.

---

## Part 1 — Google Workspace signup (15 min)

This must happen FIRST. Every downstream account (Etsy, Stripe, Gumroad, IS, Plausible, Pinterest) is told `hello@thestrledger.com` is the login email. Without an actual inbox at that address, password resets + 2FA enrollment cannot complete.

### 1.1 Sign up

1. Go to https://workspace.google.com.
2. Click **Get started**.
3. Business name: **The STR Ledger**.
4. Employees: **Just you (1)**.
5. Region: **United States**.
6. Current email (for setup notifications): your existing personal Gmail.
7. Domain: **Yes, I have one** → enter `thestrledger.com`.
8. Username: `hello` (so the primary mailbox is `hello@thestrledger.com`).
9. Set a strong password — save to Vaultwarden immediately.

### 1.2 Pick the plan

- **Business Starter** ($6/user/mo, 30 GB) is enough for Phase 1.
- Skip the Standard / Plus tiers — re-evaluate at Month 6 if you outgrow 30 GB or need shared drives.

### 1.3 Verify domain ownership

Google gives you a TXT record to paste into DNS.

1. Copy the TXT value Google shows (looks like `google-site-verification=...`).
2. Open another tab → https://hpanel.hostinger.com → Domains → `thestrledger.com` → **DNS / Nameservers**.
3. **Add new TXT record:**
   - Type: `TXT`
   - Name: `@` (root)
   - Value: paste the `google-site-verification=...` string
   - TTL: leave default (3600s)
4. Save.
5. Back in Google Workspace setup → click **Verify**. Propagation can take 5–60 min; if it fails first try, wait 10 min and click Verify again.

### 1.4 Add MX records (so mail actually arrives)

Google gives you 5 MX records to add. Hostinger sometimes pre-fills generic MX records — **delete those first** before adding Google's.

In hPanel DNS:

| Priority | Mail server |
|---|---|
| 1 | `smtp.google.com` |

(This is the single modern MX record. The legacy 5-record set [ASPMX.L.GOOGLE.COM, ALT1, ALT2, ALT3, ALT4] is still accepted but deprecated; use the single record per Google's 2023 simplification.)

1. Wait ~5 min for propagation.
2. Back in Google Workspace setup → click **Activate Gmail**.
3. Send a test email to `hello@thestrledger.com` from your personal Gmail. Confirm it arrives in the Workspace inbox at https://mail.google.com.

### 1.5 Enable 2FA

1. In the Workspace inbox → top-right avatar → **Manage your Google Account** → **Security**.
2. **2-Step Verification** → on.
3. Use **Authenticator app** (Google Authenticator, Authy, 1Password — whatever you use elsewhere). **NOT SMS.**
4. Save the 10 backup codes to Vaultwarden AND your offline 2FA master sheet.

→ **Tell Claude:** *"workspace live."*

---

## Part 2 — Update the credentials inventory (2 min)

Open `ops/credentials-inventory.md` and update the `Google Workspace` row:

- Account / Owner: `hello@thestrledger.com (Daniel)`
- 2FA: ✅
- Secret storage: `Vaultwarden`
- Notes: `Business Starter $6/mo. Used for hello@ inbox + Search Console + Google Cloud OAuth client.`

→ **Tell Claude:** *"Workspace row updated in credentials-inventory."*

---

## Part 3 — Google Search Console + OAuth2 client for n8n (15 min)

n8n's `nightly-refresh` flow reads GSC daily for indexing + click data. That requires a Cloud project with the Search Console API enabled and an OAuth2 client whose refresh token n8n can store.

### 3.1 Add `thestrledger.com` to Search Console

1. Sign in at https://search.google.com/search-console with `hello@thestrledger.com`.
2. **Add property** → **Domain** (NOT URL-prefix — Domain captures both `www.` and root, http and https).
3. Enter `thestrledger.com` → **Continue**.
4. Google gives you a **TXT record for verification**. Copy it.
5. hPanel → DNS → Add TXT record:
   - Type: `TXT`
   - Name: `@`
   - Value: `google-site-verification=<...>`
   - TTL: default
6. Wait 5 min → back in GSC → **Verify**. (You'll now have two `google-site-verification` TXT records on `@` — one for Workspace, one for GSC. That's normal.)
7. Submit your sitemap: GSC → Sitemaps → enter `https://thestrledger.com/sitemap-index.xml` → **Submit**.

### 3.2 Create the Google Cloud OAuth2 client

The OAuth flow lets n8n call the Search Console API on Daniel's behalf.

1. Sign in at https://console.cloud.google.com with `hello@thestrledger.com`.
2. **Create a new project** → name `str-ledger-empire`. Wait ~10s for provisioning.
3. **APIs & Services** → **Library** → search **Search Console API** → **Enable**.
4. **APIs & Services** → **OAuth consent screen** → User type: **External** → **Create**.
   - App name: `STR Ledger Empire`
   - User support email: `hello@thestrledger.com`
   - Developer contact: `hello@thestrledger.com`
   - Save and continue through Scopes (skip — leave empty for now) → Test users → add `hello@thestrledger.com`.
5. **APIs & Services** → **Credentials** → **+ Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `n8n-gsc`
   - **Authorized redirect URIs:** `https://n8ncde.cdeprosperity.com/rest/oauth2-credential/callback`
   - Click **Create**.
6. Google shows you a **Client ID** + **Client Secret**. Save both to Vaultwarden under `Google Cloud — n8n GSC OAuth`.

→ **Tell Claude:** *"GSC OAuth client ready: client ID + secret in Vaultwarden."*

Once Claude has these, the `GSC_OAUTH` credential in n8n is wired during the n8n-manual-setup-guide flow.

---

## Part 4 — Google Analytics 4 (5 min)

GA4 measurement IDs are referenced as `PUBLIC_GA4_ID` in `STRGuests-Tools/.env.local` (currently empty). Only needed when you want analytics on the strguests.tools surface specifically.

1. Sign in at https://analytics.google.com with `hello@thestrledger.com`.
2. **Admin** (bottom-left gear) → **Create** → **Account**.
   - Account name: `STR Ledger`
3. **Create** → **Property**.
   - Property name: `strguests.tools`
   - Time zone: your local
   - Currency: USD
4. **Web data stream** → URL `https://strguests.tools` → stream name `strguests.tools`.
5. Copy the **Measurement ID** (format `G-XXXXXXXXXX`).
6. Paste into `STRGuests-Tools/.env.local`:
   ```
   PUBLIC_GA4_ID=G-XXXXXXXXXX
   ```
7. Rebuild + redeploy strguests.tools (Claude can do this — just tell Claude the ID is set).

> **Note:** if you'd rather not use GA4 (privacy-first stance), leave `PUBLIC_GA4_ID` empty. The codebase gates GA4 entirely on this var; Plausible alone is fine for STR Ledger's analytics needs.

→ **Tell Claude:** *"GA4 measurement ID set to G-XXXXXXXXXX"* OR *"skipping GA4 — Plausible only."*

---

## Trigger-tag / env-var map (what Claude wires after these steps)

| Workspace/Google output | Where it's used |
|---|---|
| `hello@thestrledger.com` inbox active | Login email for every other SaaS in this index |
| GSC property + sitemap submitted | n8n `nightly-refresh` reads GSC API daily |
| GSC OAuth client ID + secret | `GSC_OAUTH` credential in n8n |
| GA4 measurement ID (optional) | `PUBLIC_GA4_ID` env var → Layout.astro gates tag injection |

---

## Estimate

- Workspace signup + verify: 15 min (5 min active + 10 min DNS wait)
- Inventory update: 2 min
- GSC setup + OAuth client: 15 min
- GA4 (optional): 5 min
- **Total: ~35 min, mostly DNS propagation waits**

---

## Common gotchas

- **DNS propagation can be slow.** If Google says "verification failed" but you definitely added the TXT record, wait 10 min and retry. Use `nslookup -type=TXT thestrledger.com 8.8.8.8` to confirm the record is live before re-trying.
- **MX record conflicts.** Hostinger pre-creates `mail.thestrledger.com` MX records by default. Delete them before adding Google's, or mail will round-robin into the void.
- **OAuth redirect URI mismatch.** If your n8n URL changes (e.g. you move off cdeprosperity), you must update the redirect URI in Google Cloud → Credentials → edit the client → Authorized redirect URIs. Otherwise OAuth flow fails silently.
- **GSC verification is per-property, not per-domain.** If you later add a `dashboard.thestrledger.com` property, you do NOT need to re-verify if you used the **Domain** type (it covers all subdomains).
