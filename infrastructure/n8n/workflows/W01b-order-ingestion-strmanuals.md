# W01b — Order Ingestion (Stripe · strmanuals.com)

**Priority:** P0 (blocks strmanuals.com launch — see `STRManuals/DEPLOY-STATUS.md`)
**Companion:** [`W01-order-ingestion-stripe`](W01-order-ingestion-stripe.md) (Ledger pipeline; this is the strmanuals.com sibling)

## Summary

Receives `checkout.session.completed` from Stripe, filters to
`metadata.source == "strmanuals-v1"`, expands `line_items` (Stripe doesn't
include them in webhook payloads), maps price IDs to slugs, builds the
hashed download URL, tags the buyer in InfluencerSoft, and triggers the
`strmanuals-order-confirmation` sequence.

## Trigger

POST `https://n8ncde.cdeprosperity.com/webhook/order-stripe-strmanuals`

Configure in Stripe Dashboard → Developers → Webhooks → Add endpoint:

- API version: `2026-04-22.dahlia`
- Events: `checkout.session.completed` only
- Signing secret → n8n env `STRMANUALS_STRIPE_WEBHOOK_SECRET`

Delete or repoint the older destination at `https://strmanuals.com/api/stripe-webhook` (dead in Path B).

## Required n8n env vars

| Var | Source |
|---|---|
| `STRMANUALS_STRIPE_WEBHOOK_SECRET` | Stripe Dashboard (the new destination) |
| `STRIPE_SECRET` | `STRManuals/site/.env` (`sk_live_...`) — used by line-items HTTP node |
| `STRMANUALS_DOWNLOAD_HASH` | `STRManuals/site/.env` — must match the deployed `dist/dl/<hash>/` |
| `STRMANUALS_BASE_URL` | default `https://strmanuals.com`; override for staging |
| `INFLUENCERSOFT_API_KEY` | repo root `.env` (32-char `rpsKey`) |

The "Expand Stripe Line Items" HTTP node needs an n8n credential of type
`HTTP Header Auth` with `Authorization: Bearer ${STRIPE_SECRET}`.

## Stripe price-ID map (2026-05-11)

Baked into the Normalize Order node; source of truth: `ops/strmanuals-stripe-results.csv`.

| Price ID | Slug | SKU | Price |
|---|---|---|---|
| `price_1TVyDuFz8hgT5NXg1OKTGV1X` | `str-tax-loophole-playbook` | `MAN-TAX-01` | $29 |
| `price_1TVyDvFz8hgT5NXgKaQ8ymLW` | `material-participation-survival-kit` | `MAN-TAX-02` | $29 |
| `price_1TVyDvFz8hgT5NXgTgeKWgyd` | `why-bookings-down` | `MAN-REV-01` | $19 |
| `price_1TVyDwFz8hgT5NXgsjzWwmHM` | `direct-bookings-starter` | `MAN-REV-02` | $25 |
| `price_1TVyDxFz8hgT5NXgMcCqMEfx` | `permit-regulation-survival` | `MAN-LGL-01` | $25 |
| `price_1TVyDyFz8hgT5NXgBdSUdZ5R` | `str-manuals-bundle` | `MAN-BUNDLE-01` | $99 |

## Open hooks

1. **IS method names** — workflow uses `AddTag` + `AssignToSequence` placeholders. Run `infrastructure/influencersoft/verify-tag-and-sequence-methods.sh` to confirm against the kebron tenant.
2. **IS sequence** — `strmanuals-order-confirmation` must exist (source: `copy/email-sequences/strmanuals-order-confirmation.md`).
3. **Tag dictionary** — register strmanuals tags first (Patch 1 in `STRManuals/integration-patches.md`).
4. **Bundle email template** — for `MAN-BUNDLE-01`, the email should iterate `{{bundle_urls}}` (newline-separated list of 5 URLs). For single SKUs, use `{{download_url}}`.

## Import

n8n → Workflows → Import from File → select
`infrastructure/n8n/workflows/W01b-order-ingestion-strmanuals.json`.
Then **Active** → copy the webhook URL into the Stripe Dashboard destination.

## Smoke

1. Stripe Dashboard → Webhooks → destination → "Send test webhook" with `checkout.session.completed`. Expect 200 `{received: true, ignored: "not a strmanuals event"}` because the test payload lacks the strmanuals metadata.
2. Real end-to-end: buy `MAN-REV-01` via `https://buy.stripe.com/28E4gz4KpcK83Cp2PFb3q16` for $19. Confirm the IS sequence fires within 5 minutes and the email contains a `download_url` matching `https://strmanuals.com/dl/<HASH>/why-bookings-down/v1.pdf`. Refund afterward.
