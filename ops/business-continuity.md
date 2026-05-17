# Business Continuity Plan — Solo-Operator Edition

**Purpose:** What happens to The STR Ledger / strmanuals / strlaws / stroptools / strguests / strhost / strbuyers / strlistingaudit if Daniel is unavailable (hospitalized, deceased, or otherwise out) for 14+ days.
**Owner:** Daniel
**Trusted contact:** **TBD — fill in name + phone + email**
**Last reviewed:** 2026-05-16

> A solo-operator business with no continuity plan is one bad week from disappearing. This doc is the bridge.

---

## 1. Trusted contacts (the people who can act)

Fill these in and keep them current. Print this section, give a copy to each contact, store one in a fireproof safe.

| Role | Name | Phone | Email | What they can do |
|------|------|-------|-------|-------------------|
| **Primary trusted contact** | TBD | TBD | TBD | Full operational access (see access map below) |
| **Secondary trusted contact** | TBD | TBD | TBD | Customer-facing — can answer hello@ inbox |
| **Tax / legal** | TBD CPA name | TBD | TBD | Tax filings, IRS correspondence, entity dissolution if needed |
| **Attorney** | TBD | TBD | TBD | Estate, business sale, customer disputes |
| **Bank contact** | Mercury support / your banker | mercury.com support | TBD | Wire transfers, account access on death |

---

## 2. What "out for 14+ days" triggers

If Daniel does not respond to communications for **14 consecutive days**, the primary trusted contact should:

1. Verify status (call, text, check on family contacts).
2. If situation is **temporary** (illness, travel): coordinate the "Pause Mode" below.
3. If situation is **terminal or permanent**: coordinate the "Wind-Down Mode" with the attorney and CPA.

---

## 3. Pause Mode (≤90 days)

**Goal:** Keep customer trust, freeze new operations, resume when Daniel returns.

### Actions within 24 hours
- [ ] Post a banner on **all 8 sites** (`strledger.com`, `strmanuals.com`, `strlaws.com`, `strops.tools`, `strguests.tools`, `strhost.tools`, `strbuyers.tools`, `strlistingaudit.tools`): *"We're temporarily paused. Existing customers retain full access. We'll be back by [date]."*
- [ ] Pause all paid Stripe checkouts (`isPlaceholder=true` on `BuyButton`).
- [ ] Pause all Etsy listings (vacation mode toggle).
- [ ] Pause all Gumroad listings (admin → product → unpublish).
- [ ] Set hello@thestrledger.com auto-responder explaining the pause + expected return.

### Actions within 7 days
- [ ] Issue any pending refunds (Stripe + Etsy + Gumroad).
- [ ] Cancel any expensive recurring subscriptions that aren't critical (PriceLabs, AirDNA, Rewardful, etc. — see "kill list" below).
- [ ] Renew critical domains if expiring within 90 days (see domain registry below).

### Keep running automatically
- DNS + SSL certificates (Cloudflare/Hostinger auto-renew)
- Hostinger hosting (auto-renews)
- The 36 n8n workflows that handle existing customer fulfillment
- Email forwarding (Google Workspace)
- Stripe Connect payouts to affiliates (Rewardful auto-handles)

---

## 4. Wind-Down Mode (terminal scenario)

**Goal:** Honor existing customer obligations + clean exit.

### Phase 1 — 0 to 30 days
- [ ] Trusted contact + attorney inventory all live commitments (active subscriptions, in-flight orders, affiliate payouts owed).
- [ ] Refund any open subscriptions / pending orders.
- [ ] Settle affiliate payouts owed via Rewardful + Stripe Connect.
- [ ] Post a final-state notice on all 8 sites: *"This business is closing. Existing customers retain access to purchased files via the URLs in their order confirmation emails. Free magnets remain available at [links]."*

### Phase 2 — 30 to 90 days
- [ ] Keep sites live in read-only mode (hosting + DNS auto-renew) so existing download links continue to work.
- [ ] Forward hello@ inboxes to the secondary trusted contact who can answer "where's my file" type questions.
- [ ] CPA files any final tax returns required.

### Phase 3 — 90 days+
- [ ] Decide: sell the assets (Empire.Flippers / Acquire.com / Flippa) OR shut down cleanly.
- [ ] If selling: domains, code, customer list, brand are the assets. The catalog of 65 Excel templates + 6 manuals + the n8n automation pack is the core IP.
- [ ] If shutting: cancel domains at next renewal, archive code repos to a public Git mirror for the few customers who care, send a final email to the list.

---

## 5. Access map — who needs what

Stored in **1Password Family Vault** named `STR Ledger — Continuity`. Trusted contact gets **emergency-access** invite (1Password's break-glass feature).

| System | Who needs it | Recovery method |
|--------|--------------|------------------|
| Domain registrar (Hostinger + Cloudflare) | Trusted contact | Vault entry + account recovery email |
| GitHub (kebron911/excell-templates) | Trusted contact | SSH key in vault + recovery email |
| Stripe (live mode) | Trusted contact | 1Password 2FA + Stripe support recovery |
| Etsy seller dashboard | Trusted contact | Vault + Etsy support |
| Gumroad | Trusted contact | Vault + Gumroad support |
| InfluencerSoft | Trusted contact | Vault |
| Rewardful | Trusted contact | Vault |
| Google Workspace (email) | Trusted contact | Admin-recovery email |
| Hostinger (hosting + Hostinger Email) | Trusted contact | Vault |
| Mercury (banking) | Spouse + attorney | Mercury legacy contact (built-in feature) |
| KDP (book) | Trusted contact | Vault |
| Beehiiv (newsletter — future) | Trusted contact | Vault |

**Critical:** 1Password Emergency Kit must be printed + stored in fireproof safe. The kit is the only way for the trusted contact to recover the vault if Daniel's password is unknown.

---

## 6. Kill list (cancel within 7 days of Pause Mode)

These cost money and don't serve existing customers:
- PriceLabs, AirDNA, eRank (research tools)
- Buffer / Hootsuite / Creasquare (scheduling)
- Any "trial" subscriptions that auto-bill
- Newsletter sponsorships in queue
- Paid ad campaigns (Meta / Pinterest / Google)
- Adobe Creative Cloud (if active)

Do NOT cancel:
- Domain registrations
- SSL certificates (free, but ensure auto-renew)
- Hostinger hosting (essential for download delivery)
- Stripe (needed for refunds + payouts)
- Google Workspace (email is the customer support line)
- Mercury (banking — needs to stay live for refunds + chargebacks)
- 1Password (the vault is the entire access system)

---

## 7. Domain registry

| Domain | Registrar | Auto-renew | Expires | Critical? |
|--------|-----------|------------|---------|-----------|
| thestrledger.com | Hostinger | ON | TBD | YES |
| strmanuals.com | Hostinger | ON | TBD | YES |
| strlaws.com | Hostinger | ON | TBD | YES |
| strops.tools | Hostinger | ON | TBD | YES |
| strguests.tools | Hostinger | ON | TBD | YES |
| strhost.tools | Hostinger | ON | TBD | YES |
| strbuyers.tools | Hostinger | ON | TBD | YES |
| strlistingaudit.tools | Hostinger | ON | TBD | YES |

Verify all are on **5-year auto-renew** to minimize accidental lapse during a continuity event.

---

## 8. Annual review

This document is reviewed and updated **every January 1**. Tasks:
- [ ] Verify trusted contacts are still current + reachable
- [ ] Verify access map matches actual systems
- [ ] Print fresh paper copy + replace fireproof-safe version
- [ ] Test 1Password emergency-access flow (have trusted contact verify they can request access — but not actually retrieve)
- [ ] Verify all domain auto-renew settings
- [ ] Update kill list / keep list based on the year's new tool additions

---

## 9. The note for the trusted contact

If you're reading this in a continuity event, here's what matters:

1. **Customer trust is the franchise.** If anything goes wrong, prioritize getting refunds out and download links working over anything else.
2. **The Excel templates and PDFs in `templates/_delivery/` and `STRManuals/private/manuals/` are the family jewels.** They are the value of the business.
3. **The email list is the long-term asset.** Don't sell it; don't spam it. If shutting down, send one honest goodbye email and an unsubscribe-everything button.
4. **The code repo is on GitHub.** Even if the sites go dark, the IP survives.
5. **There's no debt.** Everything is bootstrapped. Whatever exists in the Mercury account is what the business has.

Thank you for being trusted with this.
