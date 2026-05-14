# Welcome-Book-Magnet Sequence Landing in Spam: Diagnostic Checklist

## What to check FIRST (in order of impact)

### 1. **Authentication & Domain Setup** ⚠️ Most Common Issue
These directly affect spam folder placement. Check in InfluencerSoft settings:

- **SPF record** — Does your domain's SPF include InfluencerSoft's sending servers?
  - Missing SPF = automatic spam flag
  - Check: `dig yourdomain.com txt` or use MXToolbox SPF checker
  
- **DKIM signing** — Is DKIM enabled and verified in InfluencerSoft?
  - Unsigned emails = ~70% spam folder rate
  - Verify: InfluencerSoft settings → Email Authentication → DKIM status
  
- **DMARC policy** — What's your DMARC policy set to?
  - `p=reject` may reject InfluencerSoft's sends if alignment fails
  - Review: InfluencerSoft must be listed in DMARC `adkim=r` or `adkim=s`

**Action:** Before anything else, verify SPF/DKIM/DMARC are correctly configured. This blocks 50%+ of spam issues.

---

### 2. **Sender Reputation & Warmup**
If auth is good, reputation is next:

- **New sending IP?** — InfluencerSoft may use shared IPs for new accounts
  - New IPs have zero reputation; ISPs throttle them to spam folder
  - Action: Request dedicated IP or ask InfluencerSoft about IP reputation status
  
- **List quality** — Are you sending to cold, unverified, or purchased lists?
  - High bounce rate = spam folder penalty
  - Check: Bounce rate in InfluencerSoft analytics (should be <2%)
  
- **Warm-up sequence missing?** — First emails from a new list should go to engaged segments only
  - Action: Segment to "hot" subscribers first, gradually expand

---

### 3. **Email Content & Copy**
Once auth/reputation are solid, content matters:

- **Trigger words** — Does subject line or body contain heavy spam markers?
  - Risky: "FREE," "LIMITED TIME," "ACT NOW," "GUARANTEED," excessive $$$, "click here," "unsubscribe" in subject
  - Check: Read the email copy for aggressive sales language
  
- **Link density** — Too many links = spam signal
  - Action: One main CTA link; embed others in footer only
  
- **Image-heavy design** — Emails with images-only content get flagged
  - Action: Always include plain-text version and alt text on images

---

### 4. **Automation & List Management**
Finally, workflow issues:

- **List size validation** — Are subscribers actually confirmed?
  - Unconfirmed = higher bounce = spam folder
  - Check: InfluencerSoft subscribers → status field (should be "active")
  
- **Sending frequency** — Are you blasting too fast to a new list?
  - Action: Spread sends over 24–48 hours for welcome sequences
  
- **Reply handling** — Does the reply-to address work and go somewhere monitored?
  - Broken reply-to = ISP spam signal

---

## Quick Diagnostic Test

1. Send a test email from the sequence to your own Gmail/Outlook account
2. Check spam folder within 2 minutes (not later—timing matters)
3. If in spam: Click "Not spam" once; Gmail/Outlook will flag this back to InfluencerSoft
4. Forward email headers to InfluencerSoft support or check with `mxtoolbox.com/deliverability` (paste full email headers)

---

## Next Steps

**If SPF/DKIM/DMARC are ✓:**
- Check sender IP reputation: `rbl.mxcheck.io` (paste InfluencerSoft's IP)
- If reputation low: Request warm-up program or dedicated IP

**If auth + reputation are ✓:**
- Audit subject line & body for trigger words
- Test with plain-text version of email
- Reduce link count to 1–2

**Still in spam after all above:**
- Contact InfluencerSoft support with email headers + full sequence setup
- They can debug on the platform side (ISP feedback loops, rate limiting, etc.)

---

## Why Welcome-Book Sequences Specifically Get Flagged

- High open rates initially, then drop → ISPs think it's spam (people aren't staying engaged)
- Book-magnet sequences often copy-heavy or image-heavy
- Automation timing can look like mass-mail if sent too fast
- Weak segmentation (sending to whole list instead of warm segments first)

**Fix:** Segment aggressively. Only send welcome sequence to:
1. People who just confirmed opt-in (warm)
2. People from past campaigns who opened/clicked (engaged)
3. NOT cold, purchased, or long-inactive lists
