# Google Services Manual Setup Guide (Search Console + GA4)

> **Email lives on Hostinger Business — not Google Workspace.** This guide covers Google's free services that the STR Ledger empire still needs: Search Console (SEO indexing) + Google Analytics 4 (optional, privacy-first analytics on strguests.tools). Both work with a personal Google account or any free Gmail/Google account — no Workspace subscription required.
>
> **Last reviewed:** 2026-05-12
>
> **Prereq:** any Google account (free Gmail is fine; or your existing personal account). The Google account does NOT need to be `hello@thestrledger.com` — it just needs to be the account that owns the GSC property + GA4 project. Pick one and use it consistently.

---

## Part 1 — Pick / verify the Google account (2 min)

1. Decide which Google account will own STR Ledger's GSC + GA4 properties.
   - **Recommended:** create a fresh free Gmail like `daniel.strledger@gmail.com` so you can separate STR Ledger Google services from your personal account, and so you can hand off to a VA later without exposing your personal Gmail.
   - **Acceptable:** use your existing personal Google account. Just be aware: GSC + GA4 ownership transfers are clunky if you ever step back.
2. Confirm 2FA is enabled on whichever account you pick — **Manage your Google Account → Security → 2-Step Verification**. Authenticator app, NOT SMS. Save backup codes to Vaultwarden.
3. Save the Google account email + password to Vaultwarden under `Google account — STR Ledger Services`.

→ **Tell Claude:** *"Google account chosen: `<email>`."*

---

## Part 2 — Google Search Console (15 min)

n8n's `nightly-refresh` flow reads GSC daily for indexing + click data. That requires a Cloud project with the Search Console API enabled and an OAuth2 client whose refresh token n8n can store.

### 2.1 Add `thestrledger.com` to Search Console

1. Sign in at https://search.google.com/search-console with the Google account from Part 1.
2. **Add property** → **Domain** (NOT URL-prefix — Domain captures both `www.` and root, http and https, all subdomains).
3. Enter `thestrledger.com` → **Continue**.
4. Google gives you a **TXT record for verification**. Copy it.
5. hPanel → Domains → `thestrledger.com` → **DNS / Nameservers** → Add new TXT record:
   - Type: `TXT`
   - Name: `@` (root)
   - Value: paste the `google-site-verification=<...>` string
   - TTL: leave default (3600s)
6. Wait 5–10 min for DNS propagation → back in GSC → **Verify**. (Retry once if first attempt fails; DNS propagation occasionally takes longer.)
7. Submit your sitemap: GSC → Sitemaps → enter `https://thestrledger.com/sitemap-index.xml` → **Submit**.

### 2.2 (Optional) Add the other sister sites to GSC

Repeat 2.1 (Domain property + DNS TXT verification + sitemap submit) for:
- `strguests.tools`
- `strhost.tools`
- `strops.tools`
- `strbuyers.tools`

Each sister site is a separate Domain property in GSC. The sitemap URL pattern is `https://<site>/sitemap-index.xml`.

### 2.3 Create the Google Cloud OAuth2 client

The OAuth flow lets n8n call the Search Console API on your behalf.

1. Sign in at https://console.cloud.google.com with the same Google account.
2. **Create a new project** → name `str-ledger-empire`. Wait ~10s for provisioning.
3. **APIs & Services** → **Library** → search **Search Console API** → **Enable**.
4. **APIs & Services** → **OAuth consent screen** → User type: **External** → **Create**.
   - App name: `STR Ledger Empire`
   - User support email: the Google account email
   - Developer contact: same
   - Save and continue through Scopes (skip — leave empty for now) → Test users → add your Google account email.
5. **APIs & Services** → **Credentials** → **+ Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `n8n-gsc`
   - **Authorized redirect URIs:** `https://n8ncde.cdeprosperity.com/rest/oauth2-credential/callback`
   - Click **Create**.
6. Google shows you a **Client ID** + **Client Secret**. Save both to Vaultwarden under `Google Cloud — n8n GSC OAuth`.

→ **Tell Claude:** *"GSC OAuth client ready: client ID + secret in Vaultwarden."*

Once Claude has these, the `GSC_OAUTH` credential in n8n is wired during the n8n-manual-setup-guide flow.

---

## Part 3 — Google Analytics 4 (5 min — optional)

GA4 measurement IDs are referenced as `PUBLIC_GA4_ID` in `STRGuests-Tools/.env.local` (currently empty). Only needed if you want pageview + funnel analytics on the strguests.tools surface specifically.

**Decision point:** Plausible (already in setup checklist) gives you privacy-first analytics that cover what you need for STR Ledger. GA4 adds Google's behavioral cohort data — useful if you ever buy Google Ads. If you're not running Google Ads, **skip GA4** and rely on Plausible alone.

If you want GA4:

1. Sign in at https://analytics.google.com with the Google account.
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

→ **Tell Claude:** *"GA4 measurement ID set to G-XXXXXXXXXX"* OR *"skipping GA4 — Plausible only."*

---

## Trigger-tag / env-var map (what Claude wires after these steps)

| Output | Where it's used |
|---|---|
| GSC property + sitemap submitted | n8n `nightly-refresh` reads GSC API daily |
| GSC OAuth client ID + secret | `GSC_OAUTH` credential in n8n |
| GA4 measurement ID (optional) | `PUBLIC_GA4_ID` env var → Layout.astro gates tag injection |

---

## Estimate

- Google account verify: 2 min
- GSC main domain + OAuth client: 15 min
- GSC sister sites (optional, ×4): 20 min total
- GA4 (optional): 5 min
- **Total: ~20 min** (40 if you add all sister sites; 25 if you add GA4)

---

## Common gotchas

- **GSC Domain property requires DNS access.** You have it via Hostinger hPanel. Don't pick URL-prefix property — Domain is strictly better (covers all subdomains + protocols).
- **DNS propagation can be slow.** If Google says "verification failed" but you definitely added the TXT record, wait 10 min and retry. Use `nslookup -type=TXT thestrledger.com 8.8.8.8` to confirm the record is live before re-trying.
- **OAuth redirect URI mismatch.** If your n8n URL changes (e.g. you move off cdeprosperity), update the redirect URI in Google Cloud → Credentials → edit the client → Authorized redirect URIs. Otherwise OAuth re-consent fails silently.
- **You can add MORE Google accounts as verified owners later.** First-owner is whoever creates the property; you can add VAs via GSC → Settings → Users and permissions. Doesn't require giving away the primary account password.
- **No Google Workspace needed.** Email lives on Hostinger Business. The Google account here is for Google's free services only — no $6/mo cost.
