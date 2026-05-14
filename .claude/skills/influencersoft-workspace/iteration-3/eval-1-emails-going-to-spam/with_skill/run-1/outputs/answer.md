# InfluencerSoft Spam Diagnostic — Welcome-Book-Magnet Sequence

Your emails from the **welcome-book-magnet** sequence are landing in spam. Diagnose in this order:

## FIRST: Sender confirmation (most common culprit)

1. Go to **Campaigns → Settings → Senders**
2. Look for the sender email used in the welcome-book-magnet sequence
3. **Status must be "Active"** — if it says "Unconfirmed", the sender never clicked the IS confirmation link
4. If unconfirmed: resend the confirmation (IS will email the sender's mailbox with a link you must click)

**Why:** Unconfirmed senders produce silent failures — sequences using them don't send at all or fail silently. This is the #1 reason emails disappear.

---

## SECOND: Authentication records (DKIM/SPF/DMARC)

If sender is confirmed but emails still land in spam, check your DNS:

1. **SPF record** (TXT at your domain): Must include IS sending servers
   - IS provides the exact SPF string in `Campaigns → Settings`
   - Many registrars have a DNS TXT editor — add or append IS to your SPF record
   
2. **DKIM record** (TXT at your domain): Cryptographic signature from IS
   - IS provides the DKIM value in `Campaigns → Settings`
   - Add as a TXT record at your domain

3. **DMARC record** (TXT at `_dmarc.<your-domain>`): Policy for handling failures
   - Typical value: `v=DMARC1; p=quarantine; rua=mailto:<your-email>`
   - Tells Gmail/Outlook what to do when SPF/DKIM fail

**Why:** Without these, Gmail/Outlook assume your emails are spoofed and filter them as spam. This is the #2 reason emails land in spam folders.

---

## THIRD: Feedback Loop (FBL)

1. Go to **Campaigns → Settings → FBL** ("Mailing Settings")
2. Confirm FBL is configured and active
3. **Critical detail:** The FBL mailbox must be brand-new — IS auto-deletes all incoming mail after processing. If you reused an old mailbox, you wiped its history.

**Why:** FBL auto-unsubscribes anyone who marks your email as spam. Without it, repeated spam complaints tank your sender reputation and Gmail will filter all future emails.

---

## FOURTH: Pre-send spam test (for broadcasts)

If you're sending this as a **Broadcast** (one-time blast) instead of via a Sequence:

1. In the **Broadcast send screen**, click **"Test the distribution for spam"**
2. Review and fix any flagged issues before sending

**Why:** This catches obvious spam-filter triggers (missing footer, too many links, spammy words) before you send to your full list.

---

## FIFTH: Monitor analytics for patterns

Go to **Campaigns → Analytics → Broadcasts Message Analytics** (or for sequences, **Campaigns → Analytics of Automatic Email**):

- Check bounce rate — if >5%, your list has quality issues
- Check spam complaints — if >0.1%, you may be sending to bad data or the message copy is too promotional

---

## SIXTH: Escalation

If none of the above fixes it:

1. Check your sender reputation at:
   - **Gmail:** `postmaster.google.com`
   - **Outlook:** `senders.microsoft.com`
2. Schedule a **Tech Tuesday** call with Sharice-Marie (see plans-and-support.md) for live screen-share debugging
3. Email `support@influencersoft.com` with: sequence name, sender email, dates emails went out, and screenshot of analytics

---

## Quick checklist

- [ ] Sender confirmed (not "Unconfirmed") in Campaigns → Settings → Senders
- [ ] SPF record added to domain DNS
- [ ] DKIM record added to domain DNS
- [ ] DMARC record exists at `_dmarc.<your-domain>`
- [ ] FBL mailbox is brand-new and active
- [ ] For broadcasts: ran "Test the distribution for spam" before sending
- [ ] Bounce rate < 5%, spam complaints < 0.1%

**Start with #1 (sender confirmation).** If that's not the issue, move to #2 (DNS). Post results to reach the next step.
