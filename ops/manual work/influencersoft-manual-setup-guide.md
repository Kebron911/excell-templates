# InfluencerSoft Manual Setup Guide

> **Manual step — account + API key already live (2026-05-11); only sequence paste + custom fields remain manual.** Per the [InfluencerSoft API probe](../influencersoft-api-probe.md): there is no `AddSequence` endpoint. Sequences must be created and email bodies pasted into the IS UI by hand. Once created, contact tagging is fully automatable via API.
>
> **Last reviewed:** 2026-05-12
>
> **Account state (verified 2026-05-11):**
> - ✅ LTD license redeemed, tenant `kebron.influencersoft.com`
> - ✅ `INFLUENCERSOFT_API_KEY` set in `./.env` (32 chars)
> - ✅ Live API probe confirmed `GetAllGroups` + `GetGoods` return 200 OK
> - ✅ Auth header pattern confirmed: `Authorization: Bearer <key>`
> - ⚠️ 2FA enrollment pending (verify in Part 1)
> - ⚠️ Custom fields not yet created in IS UI
> - ⚠️ 11 sequences not yet pasted

---

## Part 1 — Account verification (5 min)

These were marked pending in legacy `user-manual-todo.md` §1.7 / §4.2. Verify they're done; if not, do now.

1. Sign in at https://kebron.influencersoft.com with the LTD account email.
2. **Settings → Account → Security → Two-Factor Authentication** → on. Authenticator app (NOT SMS). Save backup codes to Vaultwarden + offline master sheet.
3. **Settings → API** → confirm a key exists matching `INFLUENCERSOFT_API_KEY` in `./.env`. If absent, regenerate, paste into `./.env`, and update `ops/credentials-inventory.md` notes with new generation date.
4. **API base URL:** `https://kebron.influencersoft.com/api/<Method>` (PascalCase methods, e.g. `GetAllGroups`, `AddTagToLead`).

→ **Tell Claude:** *"IS account verified — 2FA on, API key valid."*

---

## Part 2 — Custom fields (one-time, 10 min)

In **IS UI → Contacts → Custom Fields**, add these BEFORE pasting any sequence with token references:

- `purchased_sku` (text, e.g. "TAX-001")
- `purchased_sku_name` (text, e.g. "STR Mileage Log")
- `purchase_date` (date)
- `etsy_order_id` (text)
- `recommended_next_sku_name` (text)
- `recommended_next_sku_link` (URL)
- `bundle_name` (text, e.g. "First-Year Host Bundle")

`first_name` is built-in. `link_etsy_review` and `link_thestrledger` will be set per-email via n8n or via IS template defaults.

→ **Tell Claude:** *"IS custom fields created."*

---

## Part 3 — Sequence paste order (~3 hrs)

11 sequences total. Paste in this order — earlier ones unblock revenue funnel; later ones are nurture/cross-sell.

| # | Sequence | File | Why this order | Emails | Span |
|---|----------|------|-----------|--------|------|
| 1 | **post-purchase-etsy-buyer** | [copy/email-sequences/post-purchase-etsy-buyer.md](../../copy/email-sequences/post-purchase-etsy-buyer.md) | Fires from every Etsy order — if it's not live before Wave 1 publishes, post-purchase fires into a void (PROGRESS.md P0.0 hard requirement) | 10 | 60 days |
| 2 | **review-request** | [copy/email-sequences/review-request.md](../../copy/email-sequences/review-request.md) | Etsy ranks new shops by review velocity in the first 30 days — without this, listings sink | — | — |
| 3 | **refund-recovery** | [copy/email-sequences/refund-recovery.md](../../copy/email-sequences/refund-recovery.md) | Refund-rate alert in P0.0 fires at >5%/SKU; this is the saver | — | — |
| 4 | **welcome-book-magnet** | [copy/email-sequences/welcome-book-magnet.md](../../copy/email-sequences/welcome-book-magnet.md) | Lead magnet nurture — primary email-capture funnel for thestrledger.com | — | — |
| 5 | **abandoned-cart** | [copy/email-sequences/abandoned-cart.md](../../copy/email-sequences/abandoned-cart.md) | Recovers 10-15% of own-site checkouts that bounce at Stripe page | — | — |
| 6 | **win-back** | [copy/email-sequences/win-back.md](../../copy/email-sequences/win-back.md) | Re-engages 30-60-day inactive list | — | — |
| 7 | **BUNDLE-01-first-year-host** | [copy/email-sequences/bundles/BUNDLE-01-first-year-host.md](../../copy/email-sequences/bundles/BUNDLE-01-first-year-host.md) | Bundle cross-sell — fires when contact has multiple Wave-1 SKU tags | — | — |
| 8 | **BUNDLE-02-aspiring-host** | [copy/email-sequences/bundles/BUNDLE-02-aspiring-host.md](../../copy/email-sequences/bundles/BUNDLE-02-aspiring-host.md) | Same pattern — different cross-sell trigger | — | — |
| 9 | **BUNDLE-03-year-2-operator** | [copy/email-sequences/bundles/BUNDLE-03-year-2-operator.md](../../copy/email-sequences/bundles/BUNDLE-03-year-2-operator.md) | Year-2 operator cross-sell | — | — |
| 10 | **BUNDLE-04-portfolio** | [copy/email-sequences/bundles/BUNDLE-04-portfolio.md](../../copy/email-sequences/bundles/BUNDLE-04-portfolio.md) | Portfolio bundle cross-sell | — | — |
| 11 | **BUNDLE-05-pro-manager** | [copy/email-sequences/bundles/BUNDLE-05-pro-manager.md](../../copy/email-sequences/bundles/BUNDLE-05-pro-manager.md) | Pro-manager bundle cross-sell | — | — |

Later-phase sequences (don't paste in Wave 1): `launch-12-new-templates`, `strmanuals-*`, `nurture-hero-magnet`.

---

## Part 4 — Universal paste recipe (per sequence)

1. **IS UI → Automations → New Sequence.**
2. **Name:** match the filename without `.md` (e.g. `post-purchase-etsy-buyer`).
3. **Trigger:** "When tag X is added" — see trigger-tag map in Part 5.
4. **For each email in the markdown file:**
   - Copy the **Subject** line into the IS subject field.
   - Copy the **Preheader** into the preheader field (if IS supports it; some plans don't).
   - Copy the email body between the ` ``` ` fences into the email composer.
   - Set **send delay** per the email header (e.g. "Day 0 — within 5 minutes" → send immediately; "Day 5" → 5-day delay).
5. **Save and activate.**
6. **Token substitution:** IS uses `{{ token_name }}` syntax which matches the markdown. Custom tokens depend on Part 2 fields existing first.

→ **Tell Claude:** *"sequences pasted."* (When all 11 are live + active.)

---

## Part 5 — Trigger-tag map (what Claude wires after sequences exist)

| Sequence | Trigger tag | What sets the tag |
|----------|-------------|-------------------|
| post-purchase-etsy-buyer | `customer:etsy` | Etsy order webhook → n8n W01 |
| review-request | `purchased:day5` | Day-5 automation after `customer:etsy` |
| refund-recovery | `refund-filed` | Etsy refund webhook → n8n |
| welcome-book-magnet | `lead-magnet:welcome-book` | Form submit on `/get-the-templates` |
| abandoned-cart | `checkout-abandoned` | Stripe `checkout.session.expired` webhook |
| win-back | `inactive-30d` | Daily IS automation (no recent open) |
| BUNDLE-01-first-year-host | `bundle-cross:first-year-host` | n8n cross-sell map — fires when contact has ≥2 Wave-1 individual SKU tags |
| BUNDLE-02-aspiring-host | `bundle-cross:aspiring-host` | Same |
| BUNDLE-03-year-2-operator | `bundle-cross:year-2-operator` | Same |
| BUNDLE-04-portfolio | `bundle-cross:portfolio` | Same |
| BUNDLE-05-pro-manager | `bundle-cross:pro-manager` | Same |

---

## Part 6 — After sequences are live — what Claude ships

Once Daniel signals "sequences pasted":

1. **`scripts/is-add-contact.mjs`** — `POST /api/AddUpdateLead` wrapper. Used by n8n to push every Etsy buyer / Stripe customer / form-submit into IS with the right tag.
2. **`scripts/is-tag-events.mjs`** — listens for Stripe webhooks (`checkout.session.completed`, `checkout.session.expired`, `charge.refunded`) and applies the matching trigger tag via `AddTagToLead`.
3. **`scripts/is-end-to-end-test.mjs`** — secondary-account purchase → tag → sequence Day 0 email arrives in Gmail within 5 minutes. The PROGRESS.md P0.0 hard gate.

---

## Estimate

- Account verification: 5 min
- Custom fields setup: ~10 min
- Per-sequence paste: ~15-25 min (10-email sequences take longer than 3-email ones)
- **Total: ~3 hours focused work in the IS UI**
- After: 1 hour of Claude's time to ship the 3 automation scripts

---

## Reference

- API technical reference (NOT manual): [influencersoft-api-probe.md](../influencersoft-api-probe.md) — endpoint surface, response shapes, auth pattern. Lives outside `manual work/` because it's developer reference, not a human-action checklist.
- Credentials index: `CREDENTIALS.md` (repo root) + `ops/credentials-inventory.md`.
