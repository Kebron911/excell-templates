# Disaster Recovery Runbook

When things break. Read top to bottom before an incident, not during.

## Prevention checklist (ongoing)

- [ ] Weekly backup automation (Task B11) verified running
- [ ] `ops/credentials-inventory.md` accurate
- [ ] Vaultwarden vault exported to encrypted file in Google Drive monthly (critical — Vaultwarden is self-hosted, so if the host dies and no export exists, every other credential is unrecoverable)
- [ ] Vaultwarden server data directory snapshotted weekly (restic/borg to off-host storage)
- [ ] n8n encryption key stored in multiple safe places
- [ ] Domain set to auto-renew
- [ ] SSL certs auto-renew (Hostinger AutoSSL handles cluster sites; Let's Encrypt + Caddy handles n8n VPS)
- [ ] 2FA recovery codes saved for every tool

## Scenario 1: Influencersoft platform outage or data loss

**Recognition signals:**
- Site down / checkout failing
- Subscribers lost / email automation silent
- IS status page or community reports outage lasting >24 hours

**Response:**

1. **Immediate (first 1 hour):**
   - Announce on FB Group and Pinterest: "Temporary checkout pause — full service restored within 48 hrs"
   - Pause any active paid ads

2. **Stand up Payhip mirror (4 hours):**
   - Log into Payhip (credentials in Vaultwarden)
   - Upload every product from Google Drive `backups/str-platform/latest/products/`
   - Use descriptions from `copy/etsy-listings/` committed in this repo
   - Set prices per `infrastructure/airtable/schema.md` (Price — Payhip column)

3. **Redirect traffic (2 hours):**
   - Hostinger hPanel → DNS: point `thestrledger.com` A record to Payhip's custom-domain instructions
   - Update Etsy listing Lite upgrade CTA to Payhip URL temporarily
   - Update Pinterest pin destinations via Creasquare bulk-edit if available, else manually via Pinterest UI (Pinterest native scheduler has no bulk-edit — if pin volume >30 and Creasquare's bulk tools are insufficient, queue an n8n workflow against the Pinterest API)

4. **Restore email (2 hours):**
   - Import latest subscriber CSV from `backups/str-platform/latest/is-subscribers.csv` into Kit (or ConvertKit)
   - Re-enable nurture sequence in Kit (sequence content is in `copy/email-sequences/`)

5. **Communicate (ongoing):**
   - Email full list: "We moved checkout temporarily while IS resolves. Here's where you can still buy."
   - Update FB Group with status

**Recovery time objective:** 8 hours to full mirrored service.

## Scenario 2: Airtable base corrupted or catastrophic bad edit

**Recognition signals:**
- Records missing
- Fields reset / formulas broken
- Claude MCP returning wrong data

**Response:**

1. **Stop writes immediately** — pause n8n workflows that write to Airtable (disable in n8n UI)
2. **Export current state** — even if corrupt, download every table as CSV for forensic comparison
3. **Create fresh base** from schema in `infrastructure/airtable/schema.md`
4. **Restore from latest weekly backup:**
   - Import CSVs from Google Drive `backups/str-platform/<last good date>/`
   - Order: Products → Customers → Orders (Orders depend on both links)
5. **Update Claude MCP config** to point to new base ID
6. **Re-enable n8n workflows**
7. **Delta-sync** any orders from IS/Etsy/Gumroad since the backup timestamp (manual pull via each platform's API)

**Recovery time objective:** 4 hours.

## Scenario 3: VPS compromised

**Recognition signals:**
- Unusual SSH login attempts in fail2ban logs
- n8n workflows running you didn't create
- Unexpected outbound traffic

**Response:**

1. **Assume all API keys are compromised.** Rotate immediately (order):
   - Stripe (dashboard → restricted keys → rotate)
   - Airtable PAT (create new, revoke old)
   - IS API key
   - Gumroad API key
   - Any OAuth tokens in n8n credentials
   - Update `ops/credentials-inventory.md`

2. **Provision fresh VPS** per Task B2 steps 1–5
3. **Restore n8n workflows:**
   - Import from `infrastructure/n8n/workflows/*.json` (committed in this repo)
   - Re-enter all credentials using rotated keys
4. **Restore n8n execution data** from `backups/str-platform-vps-backups/latest/n8n-data/` rsync (if available and trusted — otherwise start clean)
5. **Investigate root cause** — pull old VPS's auth logs before destroying, document findings
6. **Destroy compromised VPS** only after confirming new one works

**Recovery time objective:** 8 hours to full automation restored.

## Scenario 4: Domain lost, transferred, or renewal missed

**Recognition signals:**
- Site returns NXDOMAIN
- WHOIS shows different registrant
- Renewal email bounced

**Response:**

1. **If expired but within grace period (30–60 days):**
   - Log into Hostinger hPanel
   - Pay renewal + any late fee
   - Site resumes within 1–4 hours of DNS propagation

2. **If transferred without consent:**
   - Contact Hostinger support immediately
   - File ICANN dispute if needed
   - This is why 2FA on registrar is non-negotiable

3. **If truly lost (rare — only after multiple failures):**
   - Activate mirror domain (TODO: reserve one in Phase 2 — e.g., `thestrledgertemplates.com` as backup for `thestrledger.com`)
   - Email list + domain.backup DNS flips → new domain takes over
   - Rebrand communication: email campaign explaining the new domain

## Scenario 5: Stripe account frozen

**Recognition signals:**
- Stripe dashboard shows "Review Required" or "Account Restricted"
- New payouts held
- Checkout returning errors

**Response:**

1. **Read the exact reason in Stripe dashboard** (usually asks for documents)
2. **Respond within 24 hours** with whatever they ask for — delaying triggers longer holds
3. **Pause new sales** during review if they require it
4. **Backup payment processor:** enable PayPal or LemonSqueezy as temporary checkout if hold exceeds 7 days
5. **Communicate to buyers** if any purchases are in limbo — offer direct refund via alternative method

**Why this happens:** digital products + growing sales can trigger automated risk reviews. Usually resolved with ID + bank verification. Avoid by keeping business info up to date, maintaining <1% dispute rate.

## Scenario 6: Vaultwarden host outage or vault corruption

**Why this scenario matters:** Vaultwarden centralizes every other credential. If it goes down before you log into Hostinger, Stripe, the VPS, or Etsy, the entire stack is frozen until it's back. This is the highest-leverage DR scenario — drill it annually before any of the others.

**Recognition signals:**
- Can't reach the Vaultwarden URL
- Bitwarden client (desktop/mobile/browser extension) shows "server unreachable"
- Vault decrypts but entries are missing or corrupt
- Host VPS shows signs of compromise (see Scenario 3)

**Response:**

1. **First 15 minutes — preserve the cache.** Bitwarden clients cache the vault locally. Do NOT log out of any logged-in client until you've recovered access elsewhere — the cache is your working copy until the server is back.

2. **Export from cache (30 min):** from an already-logged-in Bitwarden client, Tools → Export Vault → encrypted JSON → save somewhere that is NOT the dying Vaultwarden host.

3. **Restore from monthly export** (if no logged-in cache exists):
   - Decrypt the latest encrypted vault export from Google Drive `backups/vaultwarden/` using the offline-stored export password
   - Spin up a fresh Vaultwarden instance (docker-compose on a clean VPS, ~20 min from scratch)
   - Import the decrypted vault
   - Update `ops/credentials-inventory.md` with the new Vaultwarden URL and the date

4. **If both cache and export are gone (worst case):** walk every row in `ops/credentials-inventory.md` and run each provider's account-recovery flow (email + 2FA backup codes + photo ID where required). Rebuild the vault entry-by-entry. This is why 2FA backup codes MUST exist in a second offline location — printed, safe deposit, or offline-encrypted USB.

5. **Investigate root cause:**
   - If host was compromised: assume all credentials that were ever in the vault are exposed. Rotate every high-value key (Stripe restricted keys, Airtable PAT, IS API key, n8n encryption key, domain registrar access).
   - If hardware/disk failure: verify backup frequency and off-host rotation before restoring.

**Recovery time objective:** 2 hours (cache available) → 24 hours (total loss, restored from monthly export) → 1+ week (worst case, account-recovery flow on every provider).

**Prevention:**
- Monthly encrypted vault export to Google Drive (see Prevention checklist above)
- Weekly rsync / restic / borg snapshot of the Vaultwarden data directory to separate host
- 2FA backup codes printed and stored offline for at minimum: Hostinger, Stripe, Google Workspace, the Vaultwarden host provider itself
- Consider hosting Vaultwarden on a different VPS than n8n so a single-host failure doesn't take both down — correlated-failure risk is real if they share hardware

---

## Annual disaster recovery drill

Once per year (pick a quiet week in May or September — never near tax season):

1. Simulate Scenario 1 (IS down) end-to-end in a staging environment
2. Time each step against RTO
3. Document gaps in this runbook
4. Update credentials inventory + rotation policy if drill reveals stale entries
5. Commit findings as `docs/runbooks/dr-drill-<year>.md`

## Incident log template

When any scenario fires, create a timestamped file:

`docs/runbooks/incidents/YYYY-MM-DD-<scenario>.md`

- What happened
- Detection method + detection delay
- Response timeline (every action with timestamp)
- Revenue impact
- Customer impact
- Root cause
- Prevention changes going forward

## What this runbook is not

- It's not a replacement for provider SLAs — read them
- It's not a guarantee — disasters happen faster than documentation
- It's not static — update whenever infrastructure changes
