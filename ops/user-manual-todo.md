# Daniel's Action Manual — Weeks 1-8 Launch

> **What this is:** your hand-held checklist of things **only you** can do. Claude can't make these decisions or enter your credentials. Work through them in order — later tasks depend on earlier ones.
>
> **How to use it:** check off items as you finish. When you finish a section, tell Claude "Section N done" and the next wave of autonomous work unblocks.

---

## Priority 0 — Decisions to make in the next 48 hours

These unblock the most downstream work. None of them take more than 30 minutes.

### [ ] 0.1 — Lock the brand name (30 min)

This single decision unblocks ~15 other tasks. Don't overthink it; you can reskin later, but you can't un-register a domain cheaply.

**How to decide:**

1. Brainstorm 10 candidates. Target vibe: business-grade, not cutesy. Examples: "BNB Ops Co.", "STR Ledger", "Host Systems Studio", "The Ledger Loft", "BNB Bookkeeping Shop". *(These are inspiration, not picks — make your own list.)*

2. For each candidate, check:
   - **Etsy:** https://www.etsy.com/search?q=`<name>` — is there already a shop with this name?
   - **Domain:** https://cloudflare.com/products/registrar or Namecheap — is `<name>.com` available?
   - **Instagram:** https://instagram.com/`<handle>` — available?
   - **Trademark quick check:** https://tmsearch.uspto.gov/ — anything too close?

3. Pick one. Fill in `brand/brand-decisions.md` using the template in [docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md](../docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md) Task A1 Step 3.

4. Decide on:
   - Primary color + secondary color (use coolors.co if stuck — pick a palette that feels "finance + Airbnb" — navy/forest/charcoal + warm accent often works)
   - Primary font + secondary font (Google Fonts — Inter, Lora, Work Sans, Cormorant are safe starters)
   - Tagline (under 10 words, business-grade)

5. Commit the file to git and tell Claude "brand locked."

### [ ] 0.2 — Register the domain + email (45 min)

Depends on 0.1.

1. Go to https://dash.cloudflare.com → Domain Registration → search for `<brand>.com` → buy it ($10–15/yr)
2. Cloudflare auto-activates DNS — verify in DNS tab that nameservers are Cloudflare
3. Sign up for Google Workspace at https://workspace.google.com → $6/user/mo → use `<brand>.com` as domain → follow DNS verification (add TXT + MX records in Cloudflare)
4. Create `hello@<brand>.com` as primary inbox
5. From any other email, send a test email to `hello@<brand>.com` → confirm receipt
6. Update `ops/credentials-inventory.md` with Cloudflare + Google Workspace rows (fill the "Owner" + "2FA" columns)

**Tell Claude "domain live" when done.**

### [ ] 0.3 — Open Airtable account + generate MCP token (15 min)

1. Sign up at https://airtable.com (free tier is fine for now — upgrade to Team $20/mo when ready to invite Claude's MCP)
2. Enable 2FA on the account
3. Create a personal access token at https://airtable.com/create/tokens
   - Name: "Claude MCP"
   - Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`, `schema.bases:write`
   - Access: "All current and future bases in all current and future workspaces"
   - Copy the generated token — you will not be able to see it again
4. In a terminal:

   ```
   npm install -g airtable-mcp-server
   claude mcp add airtable --env AIRTABLE_API_KEY=pat_XXXX -- npx -y airtable-mcp-server
   ```

   (Replace `pat_XXXX` with your real token)

5. **Restart Claude Code** (PATH snapshot + MCP config needs to reload)
6. In a new Claude session, ask: "List all my Airtable bases." Confirm Claude returns a list.
7. Update `ops/credentials-inventory.md` Airtable row.

**Tell Claude "Airtable MCP connected" when done.**

### [ ] 0.4 — Open Etsy seller account (45 min)

1. Go to https://www.etsy.com/sell
2. Use `hello@<brand>.com` as the account email
3. Shop name = the brand name from 0.1
4. Country: United States; Language: English; Currency: USD
5. Add bank account info (or business bank if you've formed an LLC)
6. Enter tax ID — SSN for sole prop, EIN for LLC
7. Enable 2FA — Settings → Privacy & Security → Two-factor auth → authenticator app (not SMS)
8. Upload shop banner + icon from Canva (see 0.5)
9. Paste shop About + Policies from `copy/etsy-listings/shop-about.md` and `copy/etsy-listings/shop-policies.md` (replace `<brand>` and `<domain>` tokens before pasting)
10. Save shop as **"On vacation"** until you have products ready to list (keeps your listings fresh when it launches publicly)
11. Update `ops/credentials-inventory.md`

**Tell Claude "Etsy seller account open" when done.**

### [ ] 0.5 — Build brand asset pack in Canva (90 min)

Depends on 0.1 (colors + fonts + name).

1. Sign up for Canva Pro ($15/mo) if not already
2. Create a Brand Kit → paste your primary/secondary colors, upload fonts, save logo if you have one
3. Build these 5 Canva templates (clone-and-customize the free defaults):
   - Logo — square 1000×1000 + horizontal 2000×500
   - Etsy shop banner — 1600×213
   - Etsy shop icon — 500×500
   - Product thumbnail master — 2000×2000 square (reusable template for all future listings)
   - Excel cover page — 1000×400 (embedded as first-tab header in every template)
4. Export each as PNG + SVG (where applicable) to `brand/assets/`
5. Add links to each Canva template in `brand/canva-links.md`
6. Commit everything with `git add brand/ && git commit -m "brand: canva asset pack + exports"`
7. Update `ops/credentials-inventory.md` Canva row

**Tell Claude "brand assets exported" when done.**

---

## Priority 1 — Core infrastructure (Week 1)

### [ ] 1.1 — Provision VPS for n8n (45 min)

1. Pick Hetzner (EU, better price) or DigitalOcean (US, simpler support)
   - Hetzner: https://hetzner.com/cloud → CX22 (€4.50/mo) → Ubuntu 24.04
   - DigitalOcean: https://digitalocean.com → Basic Droplet $6/mo → Ubuntu 24.04
2. Generate an SSH key on your local machine if you don't have one (`ssh-keygen -t ed25519`) and upload the **public** key to the provider
3. After server boots, SSH in as root using your key
4. Run the hardening commands from [Task B2 Step 2 in the plan](../docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md) (create non-root user, disable password auth, install fail2ban, configure UFW)
5. Install Docker per plan Task B2 Step 3
6. Update `ops/credentials-inventory.md` VPS row
7. **Do NOT install n8n yet** — that happens in 1.2

**Tell Claude "VPS provisioned" when done.**

### [ ] 1.2 — Install n8n via Docker Compose (30 min)

1. SSH into VPS as your non-root user
2. Create `/home/<user>/n8n/docker-compose.yml` with the content from plan Task B2 Step 4 — **fill in real values** for:
   - `N8N_HOST` (will be `n8n.<brand>.com`)
   - `N8N_BASIC_AUTH_USER` (make up a username)
   - `N8N_BASIC_AUTH_PASSWORD` (generate a strong password, save to password manager)
   - `N8N_ENCRYPTION_KEY` (generate 32+ chars random, save to password manager — this is the most important key in the stack)
3. `docker compose up -d`
4. `docker compose logs -f n8n` — watch for "n8n ready on port 5678"
5. **Do NOT expose port 5678 publicly** — next step wraps it in Cloudflare Tunnel

**Tell Claude "n8n running" when done.**

### [ ] 1.3 — Set up Cloudflare Tunnel (30 min)

1. In Cloudflare dashboard → Zero Trust (free tier is fine) → Tunnels → Create tunnel
2. Name: `n8n-host`
3. Follow install instructions for Ubuntu — run the `cloudflared` install command on the VPS
4. In the Tunnel config UI:
   - Hostname: `n8n.<brand>.com`
   - Service type: HTTP
   - URL: `http://localhost:5678`
5. DNS record will auto-create
6. Verify: browse to `https://n8n.<brand>.com` from your laptop → n8n basic-auth prompt → log in with the user/password from 1.2
7. Update `infrastructure/n8n/install.md` with the actual hostname

**Tell Claude "n8n accessible via Cloudflare" when done.**

### [ ] 1.4 — Configure Influencersoft (60–90 min)

1. Log into IS with your LTD credentials
2. Complete their getting-started wizard
3. Set brand name, colors, fonts from 0.1
4. Connect domain: IS → Settings → Domain → add `<brand>.com` and `app.<brand>.com` (or whatever subdomain IS uses) → follow CNAME instructions → add records in Cloudflare DNS
5. Connect Stripe:
   - If you don't have a Stripe account, create one at https://dashboard.stripe.com
   - In IS → Integrations → Stripe → connect
   - Verify with a $1 test-mode purchase that fires through IS's checkout
6. Email sender identity:
   - IS → Email settings → Sender → add `hello@<brand>.com`
   - It will give you DNS records (SPF, DKIM, DMARC) — add them all in Cloudflare DNS
   - Verify the domain in IS's email panel
7. **Survey IS's API / Webhooks / Integrations panel.** Screenshot or write down what you find (native API yes/no, webhook events available, Zapier/Make support). This tells Claude which n8n integration path to take in Task B8.
8. Update `infrastructure/influencersoft/config.md` with your findings
9. Update `ops/credentials-inventory.md`

**Tell Claude "IS configured + integration options documented" when done.**

### [ ] 1.5 — Enable Stripe Tax (15 min)

Depends on 1.4 — Stripe account must exist.

1. Stripe dashboard → Settings → Tax → Enable
2. Default behavior: exclusive (tax added at checkout)
3. Product tax code default: `txcd_10301000` (digital goods)
4. Origin address: your business address
5. Do a test transaction in IS with a CA billing address — verify sales tax is calculated
6. Do a test transaction with a DE billing address — verify zero sales tax
7. Update `infrastructure/influencersoft/config.md` with "Stripe Tax confirmed"

**Tell Claude "Stripe Tax verified" when done.**

### [ ] 1.6 — Set up Ghost blog (30 min)

Recommended: Ghost(Pro) managed hosting at https://ghost.org/pricing → $9/mo starter → custom domain `blog.<brand>.com`.

1. Sign up with `hello@<brand>.com`
2. Set custom domain → follow DNS instructions (CNAME in Cloudflare)
3. Pick clean default theme: "Source" or "Casper"
4. Upload logo + apply brand colors from 0.5
5. Enable Ghost Members (free membership, optional paid tier later)
6. Connect Mailgun or Ghost's built-in sender for member emails
7. Add Google Analytics or Plausible (privacy-friendly, $9/mo) for analytics
8. Create "About" page (use text from `copy/etsy-listings/shop-about.md`, lightly edited)
9. Update `infrastructure/ghost/install.md` + `ops/credentials-inventory.md`

**Tell Claude "Ghost blog live" when done.**

---

## Priority 2 — Content production (Weeks 2–4)

### [ ] 2.1 — Write 5 template briefs (4–8 hrs total, 1 hr each)

Each template brief goes to `templates/_briefs/<sku>.md`. Use the brief template in `docs/runbooks/template-production-process.md` section 1.

The 5 launch templates are:

- [ ] Welcome Book — `GST-001` — T1, $17 on Etsy
- [ ] STR Mileage Log — `TAX-001` — T1, $17
- [ ] Single-Property P&L (Lite for Etsy, Full for own site) — `TAX-002` — T2 Lite $27 / Full $97
- [ ] 1099-NEC Contractor Tracker — `TAX-003` — T1, $17
- [ ] Cleaner Turnover Checklist + Scorecard — `OPS-001` — T1, $12

For each brief, fill in the template's sections: SKU, persona, pain, inputs, outputs, tabs, external data, success criteria, edge cases.

**Tell Claude "brief ready: `<sku>`" as each is done** — Claude will then draft the spec and give you Excel build instructions.

### [ ] 2.2 — Write the "47 Airbnb Tax Deductions" list (2–4 hrs)

This is the hero lead magnet content.

1. Create `templates/_briefs/hero-magnet.md`
2. List ~40–50 deductions (title works at 47 specifically because it's weirdly specific and feels true — round numbers convert worse)
3. For each: name, brief description, IRS code reference where applicable, typical $ value range
4. Include obvious ones (mortgage interest, depreciation) AND non-obvious ones (bonus depreciation under STR active-participation rules, cost segregation, Airbnb service fees as expense, etc.)

**Tell Claude "47 deductions ready"** — Claude then builds the Excel workbook + companion PDF + landing page copy.

### [ ] 2.3 — Draft and publish first 3 blog posts (6–12 hrs total)

Claude will draft these from the content plan — but you need to:

1. Review each draft for factual accuracy, especially tax claims
2. Add personal anecdotes/stories where appropriate (makes posts non-AI-sounding)
3. Cite any specific IRS codes — verify them
4. Add disclaimer: "This is general information, not tax advice. Consult your CPA."
5. Publish on Ghost with featured image, SEO title, meta description

---

## Priority 3 — Marketing launch (Weeks 2–8)

### [ ] 3.1 — Create Pinterest Business account (30 min)

1. https://business.pinterest.com → sign up with `hello@<brand>.com`
2. Enable 2FA
3. Claim your domain → Pinterest gives a TXT record → add in Cloudflare DNS → verify
4. Create 5 boards per plan Task C2 Step 2
5. Each board: 5-sentence description with keywords, branded cover pin (Canva)
6. Update `ops/credentials-inventory.md`

**Tell Claude "Pinterest account ready" when done.**

### [ ] 3.2 — Sign up for Tailwind (15 min)

1. https://tailwindapp.com → $15/mo → connect Pinterest Business account
2. Install Tailwind Chrome extension (makes pinning faster)
3. Update `ops/credentials-inventory.md`

Claude will generate 30 pins → you upload to Tailwind → Tailwind auto-schedules.

### [ ] 3.3 — Create and seed Facebook Group (30 min)

Use [copy/fb-group/launch-plan.md](../copy/fb-group/launch-plan.md) as the playbook.

1. Create Group: Private + Visible
2. Set rules from the launch plan
3. Set the 3 entry questions
4. Pin the welcome post
5. Invite 5 seed members — friends or close STR contacts only, no mass invites yet
6. Schedule the weekly cadence in your calendar (Mon/Tue/Wed live/Thu/Fri)

### [ ] 3.4 — Sign up for Gumroad (30 min)

Do this after at least 1 template is finished and listed on Etsy (so you have the files to mirror).

1. https://gumroad.com → sign up with `hello@<brand>.com`
2. Username = brand name (lowercase, hyphenated)
3. Enable 2FA
4. Submit bank info
5. Create each product per plan Task A14 Step 2
6. Update `infrastructure/gumroad/setup.md` + `ops/credentials-inventory.md`

---

## Priority 4 — Pre-launch checklist (Week 7)

Run through this the week before Week 8 milestone to make sure nothing slipped.

### [ ] 4.1 — Email nurture sequence live-test

1. Subscribe your own personal email to `<brand>.com/47` landing page
2. Receive email 1 (Day 0) immediately
3. In IS, use "jump ahead" or "test mode" to fire emails 2 through 9 in sequence
4. Confirm each renders correctly, each link works, each CTA goes to the right page
5. Confirm purchasing a product triggers the right sequence branch

### [ ] 4.2 — Order ingestion workflow test

1. On your own site, purchase a $1 test product
2. Confirm: Airtable Customers row created, Airtable Orders row created linked to Customer, IS contact tagged correctly
3. On Etsy, have a friend purchase your cheapest product
4. Confirm same data flow (may require manual Etsy webhook or polling — see Task B8 implementation)

### [ ] 4.3 — Backup system verification

1. Check Google Drive `backups/str-platform/` folder — are there timestamped folders from the last Sunday backup?
2. Open the latest backup — does it contain Products CSV, Customers CSV, Orders CSV, IS subscribers CSV?
3. If anything is missing, fix the n8n weekly-backup workflow before Week 8

### [ ] 4.4 — Disaster recovery walkthrough

Open `docs/runbooks/disaster-recovery.md`. Read through each scenario. For Scenario 1 (IS outage), mentally walk through the 8-hour recovery procedure — do you have everything documented that you'd need?

### [ ] 4.5 — Week 8 milestone checklist

Open `ops/week-8-milestone-checklist.md` (created by Claude in Task M1). Work through every box. Any unticked = follow-up task.

---

## Quick reference — who owns what

| Thing | You | Claude |
|---|---|---|
| Brand name, tagline, colors, fonts | ✅ decide | drafts options if asked |
| Domain + email account creation | ✅ | — |
| Account creation for any SaaS | ✅ | — |
| Bank info, tax ID, 2FA setup | ✅ | — |
| Credentials entry | ✅ | — |
| Excel template build (in Excel itself) | ✅ | drafts spec + formula text |
| Template briefs (the creative inputs) | ✅ | — |
| Tax deduction list (your expertise) | ✅ | — |
| Review/approval of any copy | ✅ | — |
| Canva design work | ✅ | — |
| Markdown docs, SOPs, runbooks | — | ✅ |
| Email sequence copy (draft) | review + approve | ✅ drafts |
| Blog post copy (draft) | review + approve | ✅ drafts |
| Pinterest pin titles + descriptions | review | ✅ drafts |
| Airtable schema (as markdown spec) | — | ✅ |
| n8n workflow specifications | — | ✅ |
| Running workflows, testing in n8n | ✅ | can pair with you |
| Pushing code to GitHub | — | ✅ |
| Operational monitoring | — | ✅ once set up |

## Signaling progress to Claude

When you finish a numbered section, tell Claude one of these:

- "Section 0.1 done — brand is `<name>`" → token substitution across all docs
- "Section 0.2 done — domain live at `<domain>`" → more substitutions
- "Section 0.3 done — Airtable MCP connected" → Claude populates schema
- "Section 0.4 done — Etsy account open" → Claude drafts first listing
- "Section 0.5 done — brand assets exported" → Claude drafts pin designs
- "Section 1.N done" → Claude executes the next dependent task
- "Brief ready: `<sku>`" → Claude drafts spec + Excel build instructions
- "47 deductions ready" → Claude builds magnet

Any time you're stuck on a step, just say what you're stuck on. Don't silently skip.

## When something breaks

If anything in this manual doesn't work as written, document the issue:

1. Note what went wrong (exact error, screenshot)
2. Note what you tried
3. Commit the note to `docs/runbooks/issues/YYYY-MM-DD-<issue>.md`
4. Ask Claude to fix the plan + manual

The plan and this manual are both versioned in git — they evolve as reality teaches us what the plan missed.
