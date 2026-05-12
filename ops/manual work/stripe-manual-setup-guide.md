# Stripe Manual Setup Guide

> **Manual step — Stripe verification (bank + tax ID + ID upload + 2FA enrollment + restricted-key creation) is browser-only.** Everything else (product create, payment link generate, webhook subscribe) is API-driven and already shipped: 66 STR Ledger products + payment links populated via `scripts/stripe-bulk-import.mjs` on 2026-05-11.
>
> **Last reviewed:** 2026-05-11
>
> **Account state:** ✅ live key `sk_live_...` (107 chars) in `STRManuals/site/.env`. ✅ 66 products live, statement descriptor `STR LEDGER`. ⚠️ **Pending manual:** restricted keys for n8n + IS, Stripe Tax registration confirmation, 2FA verification.

---

## Part 1 — Verify account baseline (5 min)

Most of this should already be true. Just confirm and move on.

1. Sign in at https://dashboard.stripe.com with `hello@thestrledger.com`.
2. **Live mode toggle** (top-left) is in the **Live** position, not Test.
3. **Settings** → **Your account** → **Two-step authentication** → confirm **Authenticator app** is enabled (NOT SMS). If SMS, switch now.
4. **Settings** → **Public details** → verify:
   - Business name: `The STR Ledger`
   - Support email: `hello@thestrledger.com`
   - Statement descriptor: `STR LEDGER` (22-char max — already set per 2026-05-11 import)
5. **Settings** → **Payouts** → confirm bank account is the one you want Stripe/Etsy/Gumroad/IS payouts routing to.
6. **Settings** → **Tax details** → confirm SSN or EIN is correct.

→ **Tell Claude:** *"Stripe baseline confirmed."*

---

## Part 2 — Create restricted API keys for integrations (10 min)

The live key `sk_live_...` in `STRManuals/site/.env` is the **full account key** — used by the bulk-import + STRManuals checkout. **Never paste that into n8n or third-party integrations.** Instead, create scoped restricted keys per integration.

### 2.1 Restricted key for n8n nightly-refresh

n8n only needs read access to charges/refunds for the revenue + refund-watch flows.

1. Dashboard → **Developers** → **API keys** → **+ Create restricted key**.
2. Name: `n8n-nightly-refresh`
3. Permissions — set every resource to **None** by default, then enable:
   - **Core resources → Charges:** Read
   - **Core resources → Refunds:** Read
   - **Core resources → Payment Intents:** Read
   - **Core resources → Customers:** Read
   - **Core resources → Disputes:** Read
   - **Webhook endpoints:** Read (so the flow can verify webhook health)
4. **Create key.**
5. Copy the `rk_live_...` value (shown once). Save to Vaultwarden under `Stripe Restricted — n8n-nightly-refresh`.

### 2.2 Restricted key for IS / Stripe-to-IS automation

The n8n flow `stripe-to-is.json` (already in `ops/n8n-workflows/`) listens for Stripe webhooks and tags IS contacts. It only needs read on charges + ability to retrieve customer metadata.

1. **+ Create restricted key** again.
2. Name: `n8n-stripe-to-is`
3. Permissions:
   - **Core resources → Charges:** Read
   - **Core resources → Customers:** Read
   - **Checkout → Sessions:** Read
4. **Create key.**
5. Copy `rk_live_...` → Vaultwarden under `Stripe Restricted — n8n-stripe-to-is`.

### 2.3 Stripe CLI key (only if you'll run the CLI locally for debugging)

Optional — only needed if you intend to use the Stripe CLI (`stripe listen`, `stripe trigger`) on your local machine.

1. **+ Create restricted key**.
2. Name: `stripe-cli-daniel-local`
3. Permissions: tick **"All permissions"** at the top — CLI needs broad access for testing. (Restricted from production POV but full-access for testing.)
4. **Create key.**
5. Copy `rk_live_...` → Vaultwarden + paste into your local `~/.config/stripe/config.toml` if you set up the CLI.

→ **Tell Claude:** *"Stripe restricted keys created: n8n-nightly-refresh + n8n-stripe-to-is in Vaultwarden."*

---

## Part 3 — Verify the live webhook endpoint (5 min)

The webhook secret `STRIPE_WEBHOOK_SECRET` is set in `STRManuals/site/.env`. Confirm the endpoint Stripe POSTs to is still correct.

1. Dashboard → **Developers** → **Webhooks**.
2. Find the endpoint pointing at your STRManuals site (URL ends in `/api/stripe-webhook` typically).
3. Confirm it's enabled and not erroring (Stripe shows a "Last delivery" timestamp + status).
4. **Events listened for:** at minimum:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`
   - `payment_intent.succeeded`
   - `customer.subscription.created` / `.updated` / `.deleted` (if you have any subscriptions)

If any of those events are missing → click the endpoint → **+ Add events** → tick the missing ones.

> **Important:** if you ADD an event, Stripe regenerates nothing — the webhook secret stays the same. If you create a NEW endpoint, the secret is different — update `STRIPE_WEBHOOK_SECRET` in `STRManuals/site/.env`.

→ **Tell Claude:** *"Stripe webhook events verified: completed, expired, refunded subscribed."*

---

## Part 4 — Stripe Tax — confirm it's on (5 min)

Stripe Tax should already be enabled per `infrastructure/stripe/setup.md`. Confirm:

1. Dashboard → **Settings** → **Tax**.
2. Status should be **Enabled**.
3. **Registrations** tab — your home state should be listed.
4. **Default tax code** for new products: `txcd_10301000` (Digital goods — general).
5. Check **Monitoring** tab — Stripe Tax tracks your taxable sales per state and alerts when you approach nexus thresholds ($100K OR 200 transactions per state).

→ **Tell Claude:** *"Stripe Tax confirmed enabled + home state registered."*

---

## Part 5 — Update credentials inventory (2 min)

Open `ops/credentials-inventory.md` and update the **Stripe** row:

Append to the existing notes:
- "2FA confirmed on authenticator (verified 2026-MM-DD)."
- "Restricted keys: `n8n-nightly-refresh` + `n8n-stripe-to-is` created; both in Vaultwarden."
- "Webhook events subscribed: checkout.session.completed/expired, charge.refunded, payment_intent.succeeded."

→ **Tell Claude:** *"Stripe inventory row updated."*

---

## Trigger-tag / env-var map (what Claude wires after these steps)

| Stripe output | Where it's used |
|---|---|
| `rk_live_...` (n8n-nightly-refresh) | `STRIPE_SECRET` n8n credential — nightly-refresh + revenue-watch + refund-spike-watch flows |
| `rk_live_...` (n8n-stripe-to-is) | Credential on the stripe-to-is workflow — webhook events → IS `AddTagToLead` |
| Webhook `checkout.session.expired` | Stripe `checkout.session.expired` → n8n → IS `checkout-abandoned` tag → `abandoned-cart` sequence |
| Webhook `charge.refunded` | Stripe `charge.refunded` → n8n → IS `refund-filed` tag → `refund-recovery` sequence |
| Webhook `checkout.session.completed` | Stripe completion → n8n → IS `customer:etsy` or per-product tag → post-purchase sequence |

---

## Estimate

- Verify baseline: 5 min
- Create restricted keys: 10 min
- Verify webhook events: 5 min
- Verify Stripe Tax: 5 min
- Inventory update: 2 min
- **Total: ~25 min** (Stripe is mostly already done — this is verification + key-scoping)

---

## What's deferred (NOT in this guide — Phase 2)

- **Stripe Connect / Express accounts** for affiliate payouts. See `infrastructure/stripe/setup.md` §Part 3 when affiliate program launches (Month 3–6).
- **Multi-currency** — not needed for Phase 1; USD-only.
- **Subscription products** — STR Ledger Phase 1 is one-time digital downloads. Subscriptions deferred to a future product line.

---

## Common gotchas

- **Don't paste `sk_live_...` (full account key) into n8n.** Use restricted keys per Part 2. The full key already lives only in `STRManuals/site/.env` — keep it there and nowhere else.
- **Restricted keys are shown once.** If you lose one before saving to Vaultwarden, **delete** the key from the dashboard (don't leave orphaned keys) and create a new one.
- **Statement descriptor caps at 22 chars.** Current value `STR LEDGER` fits with room to spare. Don't try to fit "The STR Ledger Templates" — it'll truncate and look unprofessional on cardholder statements.
- **Tax registrations are state-by-state.** Stripe Tax tracks exposure but doesn't auto-register you. When you cross the $100K-or-200-tx threshold in a new state, Stripe alerts you → you register on that state's Department of Revenue site → add the registration to Stripe Tax. Don't ignore the alerts.
- **Webhook idempotency:** Stripe retries failed webhooks. Your n8n flows MUST be idempotent on `event.id` — the flows in `ops/n8n-workflows/stripe-to-is.json` already are, but double-check before adding new ones.
