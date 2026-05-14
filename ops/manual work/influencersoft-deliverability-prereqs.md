# InfluencerSoft Deliverability Prerequisites

> **Sequences will fire silently into spam without these.** Every step here is a hard
> requirement before live testing. Synthesized from skill `gotchas.md` §"Email
> deliverability" + `modules.md` §6 (Mailing Settings).

**Owner:** Daniel · **Last reviewed:** 2026-05-14

---

## Why this matters

IS can build a perfect 10-email sequence with perfect tokens and perfect tags —
and every email lands in the recipient's spam folder if the sender authentication
isn't right. Worse: IS won't *tell* you it's failing. The sequence status says
"Active," the contact log shows "Sent," and the message is in the recipient's
spam (or just silently dropped by Gmail/Yahoo).

The single biggest deliverability lever is DKIM/SPF/DMARC. Set them once, never
think about them again.

---

## The seven-step checklist

### Step 1 — Add a corporate-domain sender

**Path:** `Campaigns → Settings → Senders → Add sender`

- Email: `hello@thestrledger.com` (or whatever address you want emails to come from)
- Display name: `Emily · The STR Ledger`
- **DO NOT use a Gmail/Yahoo/Outlook free-domain address.** DMARC at those
  providers rejects mail "sent on behalf of" their domains. IS will silently
  fail the send. (Skill gotcha #6.)

### Step 2 — Confirm the sender mailbox

After adding the sender, IS emails a **confirmation link** to that mailbox. The
sender is "dead" (unable to send) until the link is clicked.

1. Log into the `hello@thestrledger.com` mailbox
2. Find the IS confirmation email
3. Click the link
4. Return to `Campaigns → Settings → Senders` — status should now show ✓ confirmed

**Skipping this step is the #1 cause of "the sequence says Sent but nothing arrived" reports.**

### Step 3 — Set the new sender as default

Same screen, mark the new sender as the account default. Otherwise every Send
email node defaults back to the legacy `Reliable Income Master <admin@mentalversatility.com>`
and you have to fix it node-by-node (110 places across all 11 sequences).

### Step 4 — Publish DKIM record in DNS

`Campaigns → Settings` shows the DKIM TXT record IS needs in your DNS.

1. Log into your domain registrar (Hostinger / Cloudflare / Namecheap / whatever)
2. Open DNS management for `thestrledger.com`
3. Add a TXT record:
   - Name: usually `is._domainkey` or what IS specifies
   - Value: the long string IS displays
   - TTL: 3600 (default)
4. Save. Propagation: 5 min to 24 hours.

Verify with: `dig TXT is._domainkey.thestrledger.com` (or use `https://mxtoolbox.com/DKIMLookup.aspx`).

### Step 5 — Publish SPF record in DNS

Same registrar, same DNS panel. Add or update the existing SPF record:

```
v=spf1 include:influencersoft.com ~all
```

If you already have an SPF record (e.g. for Google Workspace), MERGE the includes — there can only be ONE SPF record per domain. Bad: two SPF records → both fail.

Good merged example:
```
v=spf1 include:_spf.google.com include:influencersoft.com ~all
```

Verify with: `dig TXT thestrledger.com | grep spf` or `mxtoolbox.com`.

### Step 6 — Publish DMARC record in DNS

Add a TXT record at `_dmarc.thestrledger.com`:

```
v=DMARC1; p=quarantine; rua=mailto:hello@thestrledger.com; pct=100
```

**Start with `p=quarantine`** (mail that fails DMARC goes to spam), not `p=reject` (mail that fails is bounced — you'll lose legitimate mail during initial setup). After 30 days of clean reports, tighten to `p=reject` if desired.

`rua=mailto:hello@thestrledger.com` sends DMARC failure reports to you so you can spot setup issues.

Verify with: `dig TXT _dmarc.thestrledger.com`.

### Step 7 — Set up FBL mailbox

FBL (Feedback Loop) catches spam complaints from major ISPs and auto-suppresses the complaining recipient. Without it, repeated complaints tank your sender reputation.

**Path:** `Campaigns → Settings → FBL`

⚠️ **CRITICAL — gotcha #4:** the FBL mailbox MUST be a fresh, never-used inbox. IS auto-deletes incoming mail after processing — pointing FBL at an existing mailbox (like `hello@thestrledger.com`) WIPES that mailbox's history.

1. Create a new mailbox at your domain: `fbl@thestrledger.com`
2. Give it its own dedicated IMAP credentials
3. NEVER send or receive personal mail from it
4. Plug the credentials into `Campaigns → Settings → FBL`
5. IS now polls this mailbox for ISP-sent FBL reports and auto-suppresses complainers

---

## Verification — pre-live-send sanity check

Once Steps 1-7 are done, run this end-to-end check BEFORE activating any sequence:

1. **Auth test:** [mail-tester.com](https://www.mail-tester.com/) — send a test broadcast to the address it gives you, expect score ≥ 8/10
2. **DKIM/SPF/DMARC**: `mxtoolbox.com/SuperTool.aspx` — all three should show "OK"
3. **Sender confirmed**: `Campaigns → Settings → Senders` — ✓ next to your STR Ledger sender
4. **Test a real broadcast**: create a one-off Broadcast in `Campaigns → Broadcasts` → send to a 1-email test list with your secondary Gmail → confirm landing in Primary (not Promotions)

If any check fails, **do not activate any sequence**. Spam-folder failures are bidirectional: you waste a buyer's first impression AND you damage sender reputation for every future send.

---

## Cleanup — legacy sender removal

After Step 3 (new sender as default) and Step 7 (FBL live), remove the legacy sender:

`Campaigns → Settings → Senders` → find `Reliable Income Master <admin@mentalversatility.com>` → Delete (or at minimum, un-confirm so it can't be selected by mistake in a new Send email node).

---

## When you'd skip steps (DON'T)

People often skip DMARC because "the email is going out fine." It's going to Gmail's *spam* fine. Open rates of <5% almost always trace back to skipped DKIM/SPF/DMARC. There is no shortcut. Do all seven steps.

---

## Reference

- Skill: `~/.claude/skills/influencersoft/deliverability.md` (if exists; deeper coverage)
- Skill `modules.md` §6 — Mailing Settings menu paths
- Skill `gotchas.md` §"Email deliverability" — rows 6-9
- `help.influencersoft.com` — vendor docs on DKIM/SPF/DMARC setup steps
