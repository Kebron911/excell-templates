# Hostinger Manual Setup Guide

> **Manual step — Hostinger hPanel is browser-only for DNS / subdomain / .htpasswd / email creation.** SSH-based deploys are already wired (`STR_SSH_KEY` GitHub Actions secret is live). This guide covers what hPanel must do that the cluster-shared key can't reach — including the `hello@thestrledger.com` mailbox via Hostinger Business email (no Google Workspace).
>
> **Last reviewed:** 2026-05-12
>
> **Account state:** Hostinger Business plan ✅ — domain `thestrledger.com` owned + DNS managed in Hostinger + AutoSSL active + SSH deploy live for sister sites + `hello@thestrledger.com` mailbox ✅ live (used for Etsy signup). **Pending:** verify SPF/DKIM/DMARC for outbound deliverability + `dashboard.thestrledger.com` subdomain + basic-auth file for the empire console.

---

## Part 1 — Confirm baseline (5 min)

Skip if you already know this is true. Re-verify anything that's been a year since last check.

1. Sign in at https://hpanel.hostinger.com.
2. **Add login to Vaultwarden** if not already (`Hostinger` row in `ops/credentials-inventory.md` currently says "pending" — update it).
3. **2FA on authenticator app** (NOT SMS) — Settings → Security → Two-Factor Authentication.
4. Confirm `thestrledger.com` is the **active domain** and nameservers point to Hostinger's (not a stale registrar).
5. Confirm you're on the **Business** plan (includes email hosting + 100+ mailboxes typically). If on Premium, email may still be included (depends on year of signup) — check plan details.

→ **Tell Claude:** *"Hostinger baseline confirmed."*

---

## Part 2 — Verify `hello@thestrledger.com` deliverability (5 min)

`hello@thestrledger.com` mailbox is ✅ already live (used for Etsy seller signup). This step is about confirming MX/SPF/DKIM/DMARC so outbound mail (Stripe receipts, IS automated sequences, Etsy buyer confirmations) actually arrives in customer inboxes — not their spam folders.

### 2.1 Confirm mailbox + record password in Vaultwarden

1. Sign in at https://webmail.hostinger.com with `hello@thestrledger.com`.
2. Confirm inbox loads + you can send/receive.
3. If not already done — save the mailbox password to Vaultwarden under `Hostinger Email — hello@thestrledger.com`.

### 2.2 Confirm MX records auto-configured

Hostinger Business email auto-configures MX records when you create the first mailbox. Verify:

1. hPanel → Domains → `thestrledger.com` → **DNS / Nameservers**.
2. Look for MX records pointing to Hostinger's mail servers (typically `mx1.hostinger.com` priority 5 + `mx2.hostinger.com` priority 10 — exact names vary by data center; whatever Hostinger pre-fills is correct).
3. Look for SPF TXT record (`v=spf1 include:_spf.mail.hostinger.com ~all` or similar). If missing, add it.
4. Look for DKIM TXT record (Hostinger usually creates this as `hostingermail._domainkey` or similar). If missing, hPanel → Emails → DKIM → enable for the domain.
5. Add DMARC TXT record (improves deliverability of outbound mail — receipts, verification emails):
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=quarantine; rua=mailto:postmaster@thestrledger.com`
   - TTL: default

### 2.3 Deliverability smoke-test

Already proven inbound works (Etsy signup verification arrived). Just confirm outbound deliverability isn't going to spam:

1. From `hello@thestrledger.com`, send a test message to your personal Gmail.
2. Check the personal Gmail inbox — it should arrive in **Inbox** (not Spam). If it lands in Spam, that's a sign SPF/DKIM/DMARC aren't fully wired — re-check 2.2.
3. (Recommended) Run https://www.mail-tester.com — send a fresh email from `hello@` to the address it generates, then check the score. Should be 9–10/10. Anything below that indicates a deliverability gap to fix before sending customer receipts.

### 2.4 Configure on your local mail client (optional)

If you want `hello@thestrledger.com` in Outlook / Apple Mail / Thunderbird, use these IMAP/SMTP settings (verify exact values in hPanel → Emails → Email Accounts → manage):

- **IMAP:** server `imap.hostinger.com`, port `993`, SSL/TLS, password from Vaultwarden
- **SMTP:** server `smtp.hostinger.com`, port `465`, SSL/TLS, password from Vaultwarden

### 2.5 Enable 2FA on Hostinger account (covers email login)

Already done in Part 1.3 if you followed the baseline. The mailbox itself doesn't have separate 2FA — it's protected by the Hostinger account 2FA.

→ **Tell Claude:** *"hello@ deliverability verified (MX/SPF/DKIM/DMARC + mail-tester score)."*

---

## Part 3 — Create the `dashboard.thestrledger.com` subdomain (10 min)

This is the one thing blocking the empire console launch (Phase 5).

1. hPanel → **Domains** → `thestrledger.com` → **Subdomains** → **Create Subdomain**.
2. Subdomain prefix: `dashboard`.
3. Document root: leave default (`~/domains/thestrledger.com/public_html/dashboard`) OR explicitly point to a fresh directory of that name.
4. Click **Create**.
5. Wait ~15 min for AutoSSL (Let's Encrypt) to provision the cert. Refresh the SSL tab to confirm `dashboard.thestrledger.com` shows green padlock.
6. Open `https://dashboard.thestrledger.com` in an incognito tab — you should see Hostinger's default placeholder page (not "site not found"). That confirms DNS + SSL are wired.

→ **Tell Claude:** *"Dashboard subdomain live + SSL green."*

---

## Part 4 — Create `.htpasswd` for the dashboard (10 min)

The console will be the single public surface that exposes operational data (cache JSONs, ops state, financials). Basic auth via .htpasswd is the gate.

1. hPanel → **Files** → **File Manager** (or use SSH/SFTP — your choice).
2. Navigate to **above** the doc root — i.e. `~/domains/thestrledger.com/` (NOT inside `public_html/`).
3. Create a new file named **`.htpasswd-dashboard`** (filename matches what the .htaccess in `tools/empire-console/public/.htaccess` references).
4. Generate the credential hash. Two options:

   **Option A — local terminal (cleaner, no third-party):**
   ```bash
   htpasswd -nbB daniel "<strong-password>"
   ```
   The output is one line like `daniel:$2y$05$...` — paste the entire line into `.htpasswd-dashboard`.

   **Option B — Hostinger has a built-in tool:**
   hPanel → Files → Password Protect Directories → choose the dashboard folder → set user/password. Hostinger writes the file for you (but you can't choose where it lives, so prefer Option A for the above-doc-root placement).

5. Save the password in **Vaultwarden** under a new entry `dashboard.thestrledger.com — basic auth`.
6. Confirm the file is **not web-readable** — open `https://thestrledger.com/.htpasswd-dashboard` in a browser. You should get a 403/404, never the file contents. (If it's readable, you placed it inside `public_html/` — move it up one level.)

→ **Tell Claude:** *".htpasswd in place, password saved to Vaultwarden."*

---

## Part 5 — Confirm .htaccess will deploy with the dashboard (2 min)

You don't write this — it ships with the build. Just confirm the path matches.

1. Open `tools/empire-console/public/.htaccess` in the repo.
2. Confirm the `AuthUserFile` line points to the **absolute path** of the file you created in Part 4 — typically:
   ```
   AuthUserFile "/home/<your-hostinger-username>/domains/thestrledger.com/.htpasswd-dashboard"
   ```
3. If `<your-hostinger-username>` in the .htaccess doesn't match your actual hPanel username, **open an issue / tell Claude** — Claude will update the .htaccess to match before the next deploy.

→ **Tell Claude:** *"htaccess AuthUserFile path verified"* OR *"htaccess username mismatch — needs to be `<correct>`."*

---

## Part 6 — Set the GitHub Actions `PUBLIC_N8N_WEBHOOK_BASE` secret (3 min)

The static console build inlines the n8n webhook base at compile time. Without this set, every "Ship update" / "Preview" / "Delist" button on the dashboard is a no-op.

1. Go to https://github.com/Kebron911/excell-templates/settings/secrets/actions.
2. **New repository secret.**
3. Name: `PUBLIC_N8N_WEBHOOK_BASE`
4. Value: `https://n8ncde.cdeprosperity.com/webhook` (your VPS host where n8n lives — per `CREDENTIALS.md` 2026-05-11 row). **No trailing slash.**
5. Click **Add secret**.

> **Note:** the older planning docs reference `https://n8n.thestrledger.com/webhook`. That's a legacy plan from before n8n moved to the cdeprosperity VPS. **Use the cdeprosperity URL — that's where n8n actually lives.**

→ **Tell Claude:** *"PUBLIC_N8N_WEBHOOK_BASE set."*

---

## Part 7 — Verify SSH deploy still works (1 min)

Already done historically. Re-verify if you suspect rotation drift.

1. From the repo root: `gh workflow view deploy-empire-console` should show the workflow definition.
2. Most recent run on the workflow should be **success** (green) — if red, that's a separate debug task.
3. No action needed unless red.

→ **Tell Claude:** *"deploy workflow green"* (or report the failure).

---

## Trigger-tag / env-var map (what Claude wires after these steps)

| Hostinger output | Where it's used |
|---|---|
| `dashboard.thestrledger.com` (subdomain live) | `EMPIRE_CONSOLE_BASE_URL` env var in n8n; deploy workflow's rsync destination |
| `.htpasswd-dashboard` file | Referenced by `tools/empire-console/public/.htaccess` |
| `PUBLIC_N8N_WEBHOOK_BASE` secret | Inlined into the static build; clients hit `/release-shipped`, `/delist-sku`, `/gdpr-intake`, `/empire-capture` |

---

## Estimate

- Baseline confirm: 5 min
- Verify hello@ deliverability (MX/SPF/DKIM/DMARC + mail-tester): 5 min
- Create subdomain + wait for SSL: 15 min (mostly async wait)
- Create .htpasswd: 10 min
- Verify .htaccess + set GitHub secret: 5 min
- **Total: ~35 min focused, ~50 min wall-clock with SSL wait**

---

## What happens after "Hostinger setup complete"

Claude can then:

1. Open the empire-console PR (`gh pr create`) — CI runs validate + tests + build.
2. Merge to main → triggers the deploy workflow → rsyncs `dist/` to your Hostinger doc root.
3. Smoke-test `https://dashboard.thestrledger.com` — basic auth prompt appears → enter credentials → console loads with cache freshness badges.

Tracked in `ops/setup-checklist.yaml` rows: `hostinger-subdomain`, `htpasswd`, `htaccess`, `webhook-base`, `merge-pr`.
