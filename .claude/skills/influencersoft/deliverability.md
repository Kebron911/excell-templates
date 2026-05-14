# InfluencerSoft Email Deliverability

Configuring sender domains, DKIM/SPF/DMARC, and FBL so emails land in the
inbox instead of spam (or worse — rejection). Most paths live under
`Campaigns → Settings`.

Cross-reference: deliverability gotchas in [gotchas.md](gotchas.md) §6–9.

## 1. Senders

**Path:** `Campaigns → Settings → Senders`

- Add the sender email address (e.g. `daniel@thestrledger.com`,
  `support@thestrledger.com`)
- **MUST be a corporate domain** — Gmail/Yahoo "From" addresses are
  DMARC-rejected by most receivers
- IS sends a **confirmation link** to the new sender mailbox. Until you
  click it, the sender is DEAD — sequences using it silently fail.
- Multiple senders per account supported (sales@, support@, etc.)

## 2. DKIM / SPF / DMARC

Three DNS records required for inbox placement. Configure at your domain
registrar's DNS panel.

| Record | Purpose |
|---|---|
| **SPF** (TXT record) | Lists which servers are allowed to send for your domain — must include IS sending servers |
| **DKIM** (TXT record, IS provides the value) | Cryptographic signature proving emails were sent through IS, not spoofed |
| **DMARC** (TXT record at `_dmarc.<domain>`) | Tells receivers what to do when SPF/DKIM fail (reject / quarantine / report) |

Walkthrough at `help.influencersoft.com`. If stuck, Tech Tuesday call with
Sharice-Marie can configure live via screen-share.

## 3. Feedback Loop (FBL)

FBL = auto-unsubscribe contacts who mark your emails as spam. Critical for
sender reputation.

**Path:** `Campaigns → Settings → FBL` (or filed under Mailing Settings)

### Setup steps

1. **Provision a brand-new mailbox** dedicated to FBL — e.g.
   `fbl@thestrledger.com`.
   - **CRITICAL:** IS auto-deletes all incoming mail in this box after
     processing. Do NOT reuse an existing mailbox or you'll wipe its history.
2. **Verify domain at Google Postmaster Tools** if using Gmail —
   `postmaster.google.com`. Add domain, verify via DNS TXT or CNAME.
3. **Provide IMAP credentials to IS support:**
   - IMAP server (e.g. `imap.gmail.com`)
   - Login (the FBL mailbox)
   - Password (app password if 2FA on)
4. Wait for IS to confirm FBL is active.

After setup, when a recipient hits "Mark as Spam" in Gmail/Outlook, the
provider sends a complaint to your FBL mailbox → IS reads it → unsubscribes
that recipient automatically.

## 4. Auto-clean (sender reputation hygiene)

**Path:** `Campaigns → Settings → Auto-clean` (toggle)

When enabled, IS deletes subscribers who haven't opened **15 emails in 45
days**. Prunes unengaged contacts before they hurt your sender reputation.

Strategic pattern (founder advice):
1. Win-back sequence fires on `inactive-30d` tag (set by IS daily automation)
2. If they re-engage → tag clears, they stay
3. If they don't → auto-clean removes them at the 45-day mark

## 5. vCard + spam-button footer

**Path:** `Campaigns → Settings → Email templates`

- **"Automatically add a vCard"** toggle: appends a contact card to outgoing
  emails so recipients can save you in their address book → improves inboxing
- **Spam-report / unsubscribe footer:** required by law (CAN-SPAM, GDPR); IS
  includes it automatically but you can customize copy

## 6. List hygiene during sequence migration

When pasting new sequences (per [manual-setup-guide.md Part 3](../../../ops/manual%20work/influencersoft-manual-setup-guide.md)):

- Send first emails to a **canary test list** (just yourself + one or two
  testers)
- Monitor `Campaigns → Analytics of Automatic Email` for the first 24h —
  check opens, clicks, bounces
- If hard-bounce rate > 5% or spam complaints > 0.1% — **PAUSE** and
  investigate before exposing full list

## 7. Common deliverability failures

| Symptom | Likely cause | Fix |
|---|---|---|
| All emails to spam | Missing DKIM/SPF/DMARC | Configure DNS records |
| Some inboxes, some spam | Sender reputation low | Enable auto-clean, FBL; reduce frequency |
| Bounce rate spiking | List hygiene problem | Run `is-probe.mjs`, identify hard-bounce list, suppress |
| No emails sending at all | Sender not confirmed | Click confirmation link in sender's mailbox |
| Gmail rejects | DMARC policy + free-domain sender | Switch to corporate-domain sender |

## 8. Escalation

If deliverability problems persist:
1. Check `Campaigns → Analytics → Broadcasts Message Analytics` for patterns
2. Check sender reputation at `postmaster.google.com` (Gmail) or
   `senders.microsoft.com` (Outlook)
3. **Tech Tuesday** live call (see [plans-and-support.md](plans-and-support.md))
4. `support@influencersoft.com` ticket if persistent
