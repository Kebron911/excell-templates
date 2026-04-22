# Disaster Recovery Runbook

When things break. Read top to bottom before an incident, not during.

## Prevention checklist (ongoing)

- [ ] Weekly backup automation (Task B11) verified running
- [ ] `ops/credentials-inventory.md` accurate
- [ ] Password manager backed up (export vault to encrypted file in Google Drive monthly)
- [ ] n8n encryption key stored in multiple safe places
- [ ] Domain set to auto-renew
- [ ] SSL certs auto-renew (Cloudflare handles)
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
   - Log into Payhip (credentials in PM)
   - Upload every product from Google Drive `backups/str-platform/latest/products/`
   - Use descriptions from `copy/etsy-listings/` committed in this repo
   - Set prices per `infrastructure/airtable/schema.md` (Price — Payhip column)

3. **Redirect traffic (2 hours):**
   - Cloudflare DNS: point `<domain>` A record to Payhip's custom-domain instructions
   - Update Etsy listing Lite upgrade CTA to Payhip URL temporarily
   - Update Pinterest pin destinations via Tailwind bulk edit

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
   - Log into Cloudflare Registrar
   - Pay renewal + any late fee
   - Site resumes within 1–4 hours of DNS propagation

2. **If transferred without consent:**
   - Contact Cloudflare Registrar support immediately
   - File ICANN dispute if needed
   - This is why 2FA on registrar is non-negotiable

3. **If truly lost (rare — only after multiple failures):**
   - Activate mirror domain (TODO: reserve one in Phase 2 — e.g., `<brand>templates.com` as backup for `<brand>.com`)
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
