# InfluencerSoft Spam Diagnosis: Welcome-Book-Magnet Sequence

## Problem Statement
Emails from your welcome-book-magnet sequence are landing in spam folders (Gmail, Outlook, etc.) instead of the inbox.

---

## Diagnostic Priority Order

### ⚠️ CHECK FIRST — Critical, High Impact (5 min)

#### 1. **Sender Confirmation Status** [Gotcha #7]
**Most common reason sequences "fail to send" or land in spam without visible error.**

- **Path:** Campaigns → Settings → Senders
- **Action:** Find the sender email used in your welcome-book-magnet sequence (e.g., `support@yourdomain.com`)
- **Look for:** Green checkmark ✓ next to the sender name
- **If UNCHECKED/RED:**
  - IS sent a confirmation link to that mailbox
  - Someone must log into `support@yourdomain.com` → find the IS confirmation email → click the link
  - Without this, sequences silently fail to send — recipients get nothing (not spam, just dead)
- **Fix time:** 2 minutes once you access the mailbox

**Why this matters:** If sender is unconfirmed, emails don't send at all — but users often confuse "no email received" with "went to spam."

---

#### 2. **Sender Domain Is Corporate, Not Gmail/Yahoo** [Gotcha #6]
**DMARC authentication rejects free-domain senders across most email providers.**

- **Path:** Campaigns → Settings → Senders
- **Check:** Sender email is `@yourdomain.com` (corporate domain), NOT `@gmail.com`, `@yahoo.com`, or `@outlook.com`
- **If using free domain:**
  - Most receivers (Gmail, Microsoft, etc.) have strict DMARC policies that block these
  - **Fix:** Add a corporate sender (you must own the domain). Create if needed: `support@yourdomain.com`, `noreply@yourdomain.com`
  - Then confirm the new sender (step 1 above)
- **Fix time:** 5 minutes to create + confirm

---

#### 3. **DNS Records (DKIM/SPF/DMARC) Are Configured** [Gotcha #9]
**Without these, deliverability tanks 100% of the time, regardless of content.**

- **Path:** Check your domain registrar's DNS panel (GoDaddy, Namecheap, Route 53, etc.)
- **What to verify:**
  - **SPF record exists** (TXT record) and includes InfluencerSoft sending servers
    - Format: `v=spf1 include:mail.influencersoft.com ~all` (or similar — check [help.influencersoft.com](https://help.influencersoft.com))
  - **DKIM record exists** (TXT record) — InfluencerSoft provides the exact value in Campaigns → Settings
    - Usually looks like: `v=DKIM1; p=MIGfMA0BgQC...` (long string)
  - **DMARC record exists** at `_dmarc.yourdomain.com` (TXT record)
    - Format: `v=DMARC1; p=quarantine; rua=mailto:fbl@yourdomain.com`

- **If ANY are missing:**
  - Emails will be rejected outright or dumped in spam
  - **Fix:** Add the missing record(s) at your registrar. Takes 15–60 min depending on DNS propagation
  - Once added, wait 1–2 hours for propagation, then test

- **Fix time:** 5 min to add + 1 hour propagation

**This is THE most common culprit for widespread spam placement.**

---

#### 4. **Feedback Loop (FBL) Is Enabled** [Deliverability §3 + Gotcha #4]
**Without FBL, recipients who mark your emails as spam don't get auto-unsubscribed, tanking sender reputation.**

- **Path:** Campaigns → Settings → FBL ("Mailing Settings")
- **Check:** Is there a connected FBL mailbox (e.g., `fbl@yourdomain.com`)?
- **If NOT configured:**
  - Every spam complaint sticks to your sender reputation
  - Over time, ISPs (Gmail, Outlook) learn to bin your emails
  - **Fix:** Provision a brand-new mailbox (`fbl@yourdomain.com`) + provide IMAP credentials to IS support
  - See [deliverability.md §FBL](./deliverability.md#3-feedback-loop-fbl) for full steps
- **If misconfigured (CRITICAL warning in gotcha #4):**
  - Do NOT reuse an existing mailbox or IS will auto-delete all its contents
  - Must be brand new

- **Fix time:** 10–15 minutes to set up (provisioning depends on your email provider)

---

### 🔍 CHECK SECOND — High Probability, Medium Impact (10 min)

#### 5. **List Hygiene / Hard Bounces** [Deliverability §6–7]
**High bounce rates cause ISPs to downgrade sender reputation, landing good emails in spam.**

- **Path:** Campaigns → Analytics → Broadcasts Message Analytics
- **Look for:** Bounce rate on recent welcome-magnet sends
  - If **> 5% hard bounces:** you have a list problem
- **Causes:**
  - Subscriber list contains invalid emails (typos, inactive accounts, etc.)
  - List was scraped or purchased (spam behavior)
- **Fix:**
  - Suppress bounced addresses (IS can help via support)
  - For future: use double opt-in on your landing page to validate emails upfront
- **Quick check:** Run the `is-probe.mjs` script to identify bounce patterns

- **Fix time:** 30 min to investigate + suppress bad addresses

---

#### 6. **Sender Reputation (Gmail/Outlook Dashboard)** [Deliverability §8]
**ISP dashboards show exactly why emails are being binned.**

- **Path (Gmail):** [postmaster.google.com](https://postmaster.google.com)
  - Add your sending domain, verify via DNS
  - Check: "Authentication Status" (DKIM/SPF pass/fail), "Spam Rate", "Delivery Errors"
- **Path (Outlook):** [senders.microsoft.com](https://senders.microsoft.com)
  - Similar insights for Microsoft 365 / Outlook.com
- **What to look for:**
  - Authentication failures → go back to step 3 (DNS)
  - High spam complaint rate → go back to step 4 (FBL)
  - Delivery errors → may indicate IP reputation or list issues

- **Fix time:** 5 minutes to check (fixes depend on what you find)

---

#### 7. **Auto-clean Is Enabled** [Deliverability §4 + Gotcha #8]
**Optional, but recommended for sender reputation.**

- **Path:** Campaigns → Settings → Auto-clean
- **What it does:** Removes subscribers who haven't opened 15 emails in 45 days
- **Why it helps:** Unengaged subscribers who mark emails as spam hurt reputation; removing them preemptively protects your sender score
- **Best practice:** Enable + pair with a win-back sequence to re-engage before the 45-day threshold

- **Fix time:** 1 minute to toggle on

---

### 📊 CHECK THIRD — Lower Probability, Useful Context (5 min)

#### 8. **Email Content Issues**
**Less likely to cause ALL emails to spam, but can contribute.**

- Check if welcome email has spam trigger words (excessive caps, "$$", "FREE!!!", etc.)
- Verify unsubscribe link is present and working (required by CAN-SPAM / GDPR)
- IS adds this automatically, but confirm in email template

- **Fix time:** 5 min to audit

---

#### 9. **Sequence Trigger / Delivery Timing**
**Rare, but check if sequence is actually firing.**

- **Path:** Campaigns → Analytics → Broadcasts Message Analytics
- **Look:** Are emails sending at all? (Check send count)
  - If send count = 0 → sequence isn't firing (go back to step 1: sender confirmation)
  - If send count > 0 → they are sending, just going to spam (focus on steps 2–7)

- **Fix time:** 2 min to verify

---

## Recommended Action Order

1. ✅ **Sender confirmation** (step 1) — 2 min
2. ✅ **Sender domain check** (step 2) — 5 min
3. ✅ **DNS records** (step 3) — 5 min + 1 hour propagation
4. ✅ **FBL setup** (step 4) — 15 min
5. ✅ **Bounce rate check** (step 5) — 10 min
6. ✅ **ISP dashboards** (step 6) — 5 min (to validate fixes)
7. ✅ **Auto-clean** (step 7) — 1 min
8. **Email content audit** (step 8) — 5 min (optional)
9. **Trigger check** (step 9) — 2 min (optional)

**Total time to diagnose:** ~45 min (excluding DNS propagation wait time)

---

## Key Resources

- **deliverability.md** — Full setup walkthrough for DKIM/SPF/DMARC/FBL
- **gotchas.md** — Common traps (§6–9 are deliverability-specific)
- [help.influencersoft.com](https://help.influencersoft.com) — Official IS docs + DNS walkthroughs
- **Tech Tuesday** — Live support call with IS team; can screen-share to configure DNS live

---

## TL;DR — Most Likely Root Causes (in order)

1. **Sender not confirmed** (step 1) — sequences silently fail
2. **Free-domain sender** (step 2) — DMARC rejection
3. **Missing DKIM/SPF/DMARC DNS records** (step 3) — 100% spam placement
4. **No FBL setup** (step 4) — sender reputation degrades over time
5. **High bounce rate** (step 5) — ISP downgrades trust

**Most fixes take < 15 minutes once identified.**
