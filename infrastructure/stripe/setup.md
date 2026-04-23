# Stripe Setup Guide

**Two Stripe features in play:**
1. **Stripe Tax** — automatic sales-tax / VAT calculation + remittance (Phase 1, Task B4)
2. **Stripe Connect** — multi-party payments for affiliates (Phase 2, Task W20)

This guide covers both, in the order you'll need them.

---

## Part 1 — Stripe account baseline

Do this **before** connecting Stripe to Influencersoft.

### 1.1 Create Stripe account

1. Go to https://dashboard.stripe.com/register
2. Use `hello@thestrledger.com` (same as all other SaaS accounts)
3. Business type:
   - **Sole proprietor** — simplest, your SSN is the tax ID
   - **Single-member LLC** — requires EIN (free at irs.gov/ein)
   - **Multi-member LLC / S-corp** — requires EIN + formation docs
4. Industry: "Digital products" → "Software" subcategory
5. Product description: *"Excel spreadsheet templates for short-term rental property operators. Instant digital downloads."*
6. Business website: `thestrledger.com`
7. Support email: `hello@thestrledger.com`
8. Statement descriptor: **short** — Stripe limits to 22 chars, shows on cardholder statements. E.g., `BRAND STR TEMPLATES`

### 1.2 Verify business

- Bank account — ACH-verified (micro-deposits or Plaid)
- Tax ID (SSN or EIN)
- Business address
- Upload ID (drivers license or passport) if Stripe requests

Stripe may take 24–72 hours to fully verify. You can start testing with test-mode keys immediately; live mode unlocks after verification.

### 1.3 Security

1. **2FA** — Settings → Your account → Two-step authentication → authenticator app
2. **API keys** — Developers → API keys → roll live keys if any have been shared
3. **Restricted keys for integrations** — create two scoped-down keys:
   - **"IS checkout"** — read/write on Charges, Customers, PaymentIntents; no read on the rest
   - **"n8n webhook"** — read only on Charges, Customers
4. **Enable email notifications** for large transactions, failed payments, disputes

Update `ops/credentials-inventory.md` with Stripe row.

---

## Part 2 — Stripe Tax

### 2.1 Why Stripe Tax matters

US sales-tax nexus rules after *South Dakota v. Wayfair* (2018):
- If your annual sales in a state exceed **$100K** OR **200 transactions**, you owe sales tax in that state
- Digital goods rules vary state-to-state (some tax, some don't)
- EU hosts: **€10K/yr B2C threshold** triggers EU-OSS registration

Without Stripe Tax (or an equivalent like Quaderno), you'd have to:
- Calculate tax per jurisdiction per sale
- Register with each state's revenue department
- File sales tax returns monthly/quarterly/annually per state
- Handle EU OSS separately

Stripe Tax handles **calculation** automatically. It does NOT auto-file your returns — that's still your responsibility once you cross nexus thresholds. But it tracks your exposure so you know when to register.

### 2.2 Enable Stripe Tax

1. Dashboard → Settings → Tax
2. Click "Get started"
3. Confirm:
   - Business type (matches what you set up in 1.1)
   - Origin address (your registered business address)
   - Default tax behavior: **exclusive** (tax added at checkout, not included in price)
4. Add tax registrations:
   - Initially, add only your home state (required)
   - As thresholds trip, Stripe alerts you and you add the new state

### 2.3 Configure product tax codes

In Dashboard → Products, every product needs a **tax code**:

- **Digital templates / downloads:** `txcd_10301000` ("Digital goods — general")
- **Subscriptions to digital memberships:** `txcd_10101000` ("Subscription — general")
- **Coaching / consulting calls:** `txcd_20030000` ("Services — general")

Set as default for all new products: Dashboard → Settings → Tax → "Default tax code" → `txcd_10301000`.

### 2.4 Verify with test transactions

Run two test purchases in Stripe test mode:

1. **Billing address in California (94105):** expected → sales tax ~8.6% added
2. **Billing address in Delaware (19901):** expected → $0 sales tax (DE has no sales tax)

If tax calculates correctly, enable in live mode.

### 2.5 Stripe Tax costs

- **0.5% per transaction** for calculated tax
- No charge on transactions where no tax applies (e.g., Delaware sale)
- Billed monthly, no base fee

At $30K/mo revenue with ~60% taxable transactions, Stripe Tax costs ~$90/mo. Cheap compared to any alternative.

### 2.6 When you cross nexus thresholds

Stripe Tax monitors your sales per jurisdiction. When you approach or cross a threshold:

1. Stripe sends an email alert
2. Dashboard shows you a warning banner
3. Click "Register" → Stripe guides you through state/country registration (or you register directly on state site, then add registration in Stripe)

**Critical:** Stripe Tax does NOT file your sales tax returns. You must either:
- File yourself (each state's Department of Revenue website — most accept returns filed online)
- Use a service like TaxJar or Avalara for auto-filing ($100–500/mo)

**For Phase 1:** file yourself in whatever state(s) you cross threshold in. Usually 1–3 states by end of Year 1.

### 2.7 Integration with Influencersoft

In IS → Stripe integration settings:
- Verify Stripe Tax is enabled (checkbox or indicator)
- Confirm IS passes tax amount to customers at checkout
- Confirm tax amount is collected separately from product price

Verify with a test purchase: cart shows subtotal + tax + total, not hidden-tax pricing.

---

## Part 3 — Stripe Connect (Phase 2, affiliate program)

**Do not set this up in Phase 1.** Stripe Connect adds complexity (platform account verification, Connected Account onboarding flow, Express dashboard for affiliates). Only build when affiliate program is launching.

### 3.1 What Stripe Connect solves

Without Connect, paying affiliates requires:
- Manual Wise or PayPal transfers monthly
- You reconcile who earned what
- Affiliate has no self-service dashboard
- 1099-MISC tax reporting burden falls entirely on you

With Connect (Express accounts):
- Affiliate signs up → connects their bank account via Stripe onboarding
- Commission amounts auto-split at sale time (e.g., 30% to affiliate, 70% to you)
- Payout happens on standard Stripe schedule (2-day rolling)
- Affiliate gets self-service dashboard for payout history
- Stripe handles 1099 tax reporting to each affiliate

### 3.2 Connect account types

Three options:

**Standard:** affiliate has their own full Stripe account, you just route money to it.
- Pros: least work for you
- Cons: affiliate needs to fully set up Stripe themselves

**Express:** your platform owns the account, Stripe provides branded onboarding.
- Pros: smoother affiliate UX
- Cons: requires your platform to be approved by Stripe (~1–2 week review)

**Custom:** you build the entire onboarding flow yourself, Stripe provides APIs.
- Pros: most flexibility
- Cons: much more engineering work

**Recommendation: Express.** Best UX for affiliates without requiring each one to become a full Stripe user.

### 3.3 Apply for Connect

1. Dashboard → Connect → Get started
2. Select "Platform or marketplace"
3. Describe your platform: *"Affiliate program for digital product sales. Commission payouts to approved affiliates based on referred purchases."*
4. Provide: business info, privacy policy URL, terms of service URL, logo
5. Wait for Stripe approval (typically 1–2 weeks)

### 3.4 Integration pattern with IS + n8n

Influencersoft likely has its own affiliate tracking (it's a native IS feature per our spec §5.2). If IS's native affiliate module handles payouts, Stripe Connect may be unnecessary.

**Decision tree:**
1. Does IS's affiliate module payout via Stripe Connect directly? → Use IS's flow, no custom Connect work
2. Does IS's affiliate module payout via CSV export for manual payout? → Consider Connect to automate
3. Does IS's affiliate module not handle payouts at all? → Build Connect flow

Survey IS capabilities when you're ready to launch affiliates (Month 3–6).

### 3.5 Commission structure (per spec §9.2)

- Standard affiliate: 30% of net amount
- Active (3+ referrals/mo): 40%
- Top-tier (10+ referrals/mo OR bundle buyers): 50%

Implementation in n8n W20:
- Monthly calculation of earned commissions per affiliate
- Review + approval step (Daniel verifies no fraud)
- Payout via Connect API (`transfers.create`) OR via Wise/PayPal if Connect not active

### 3.6 Tax reporting for affiliates

- If paying > $600/yr to any US-based affiliate → issue 1099-NEC
- If paying international affiliates → generally no US 1099 requirement, but check local rules
- Stripe Connect's Express dashboard handles 1099 generation for US affiliates automatically

---

## Part 4 — Operational practices

### 4.1 Dispute management

Stripe charges $15 per dispute, refundable if you win. Target: **<1% dispute rate** (>1% triggers Stripe fraud review).

- Enable 3D Secure for high-risk transactions (Stripe Radar does this automatically)
- Require CVV + postal code on all transactions
- Respond to disputes within 7 days with:
  - Order details (product, delivery confirmation)
  - Customer IP address
  - Customer acceptance of ToS
  - Any communication with customer

Stripe automates response packaging if you upload evidence quickly.

### 4.2 Radar (fraud detection)

Stripe Radar runs by default. Review settings:
- Block payments from IPs known for fraud
- Block anonymous proxies (optional — may false-positive on legitimate VPN users)
- Require 3DS2 on transactions > $100 (configurable)

Radar costs $0.05 per screened transaction (tiny).

### 4.3 Payout schedule

Default: 2-day rolling for new accounts, 7-day for newer accounts. After 3 months of clean history, Stripe typically shortens to 2-day.

Manual payout: Dashboard → Balance → Payout now. Free for standard payouts. **Instant payout** costs 1.5% — avoid unless urgent cash need.

### 4.4 Monthly reconciliation

Once a month, cross-check:
- Stripe Balance report vs IS revenue report vs Airtable Orders total
- Discrepancies = investigate (failed webhooks, refund timing, currency conversion)

n8n W18 Integrity Checker automates this for orders; balance reconciliation is manual for now.

### 4.5 Year-end tax prep

Stripe auto-generates a **1099-K** if you process > $5,000/year (2024+ rule, threshold dropped from $20K). You'll receive it by January 31.

Reconcile 1099-K gross against your Airtable Orders gross. They should match. Small discrepancies from currency conversion or disputed chargebacks are normal.

---

## Checklist

### Phase 1 (Week 1–2)
- [ ] Stripe account created, verified
- [ ] Bank account linked, ACH verified
- [ ] 2FA enabled
- [ ] Restricted API keys created for IS + n8n
- [ ] Stripe Tax enabled
- [ ] Product tax code default set (`txcd_10301000`)
- [ ] Test transactions in two states verified (tax calculates correctly)
- [ ] Home state registered in Stripe Tax
- [ ] IS integration tested with tax-inclusive checkout

### Phase 2 (Month 3–6, as affiliate program launches)
- [ ] IS affiliate module reviewed — does it use Stripe Connect natively?
- [ ] If not: Stripe Connect platform application submitted
- [ ] Connect approved, Express onboarding flow tested
- [ ] First affiliate test account onboarded
- [ ] n8n W20 Affiliate Commission Cycle integrated with Connect transfers

### Phase 3 (as nexus thresholds approach)
- [ ] Review Stripe Tax thresholds monthly
- [ ] Register in each state as threshold is crossed
- [ ] Decide: self-file vs TaxJar/Avalara for multi-state filing
- [ ] EU expansion (Year 2) → register EU-OSS via Stripe Tax

---

## Risk watch

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Stripe account frozen / review required | Low | High | Keep business info current, respond to requests within 24 hrs, <1% dispute rate |
| Chargeback rate > 1% triggers reserve hold | Low | Medium-High | 3DS2 for high-value, clear refund policy, fast support responses |
| Missed sales tax registration (nexus crossed, no registration) | Medium | Medium | Monthly review of Stripe Tax thresholds; register proactively |
| Sales tax audit (state) | Low | Medium | Keep all Stripe Tax reports + backup CSVs (W17 handles) |
| Affiliate fraud (self-referral or bot-generated referrals) | Medium | Low-Medium | Manual review in W20, self-purchase detection logic |
| 1099-K discrepancy | Low | Low | Monthly reconciliation catches early |

---

## Related files

- [Task B4 in plan](../../docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md) — enable Stripe Tax
- [W01 workflow spec](../n8n/workflows/W01-order-ingestion-stripe.md) — how Stripe webhooks flow into Airtable
- [W20 workflow spec (future)](../n8n/workflows/W20-affiliate-commission-cycle.md) — Stripe Connect payouts

---

## Iteration log

- `2026-04-22` — Initial spec. Phase 1 pending implementation.
