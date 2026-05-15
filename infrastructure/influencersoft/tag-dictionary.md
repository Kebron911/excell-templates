# InfluencerSoft Tag Dictionary — Source of Truth

> Tags in IS auto-create on first use (no pre-create endpoint). This file is the
> authoritative list — every script that writes a tag MUST pull the string from
> here. If you invent a tag in the wild, sequences trigger silently to nowhere.

**Last reviewed:** 2026-05-13
**Owner:** scripts in `scripts/is-*.mjs` + n8n workflows in `ops/n8n-workflows/`

---

## 1. Sequence trigger tags (the ones IS sequences are bound to)

Mirrors `ops/manual work/influencersoft-manual-setup-guide.md` Part 5.
**Editing a string here without re-binding the sequence in the IS UI WILL break it.**

| Tag | Sequence it triggers | Set by |
|-----|---------------------|--------|
| `customer:etsy` | `post-purchase-etsy-buyer` | n8n W01 — Etsy order webhook |
| `purchased:day5` | `review-request` | IS automation, Day-5 after `customer:etsy` |
| `refund-filed` | `refund-recovery` | n8n — Etsy/Stripe refund webhook |
| `lead-magnet:welcome-book` | `welcome-book-magnet` | Form submit on `/get-the-templates` |
| `checkout-abandoned` | `abandoned-cart` | Stripe `checkout.session.expired` webhook |
| `inactive-30d` | `win-back` | Daily IS automation (no recent open) |
| `bundle-cross:first-year-host` | `BUNDLE-01-first-year-host` | n8n cross-sell mapper |
| `bundle-cross:aspiring-host` | `BUNDLE-02-aspiring-host` | n8n cross-sell mapper |
| `bundle-cross:year-2-operator` | `BUNDLE-03-year-2-operator` | n8n cross-sell mapper |
| `bundle-cross:portfolio` | `BUNDLE-04-portfolio` | n8n cross-sell mapper |
| `bundle-cross:pro-manager` | `BUNDLE-05-pro-manager` | n8n cross-sell mapper |

---

## 2. Source-of-acquisition tags

Identifies where a contact came from. Set once on contact creation.

| Tag | Meaning |
|-----|---------|
| `source:etsy` | First touch = Etsy purchase |
| `source:thestrledger` | First touch = own site (form or checkout) |
| `source:gumroad` | First touch = Gumroad order |
| `source:lead-magnet` | First touch = lead magnet opt-in (no purchase yet) |
| `source:imported` | Bulk-imported / legacy list |
| `source:affiliate:<slug>` | Came from an affiliate's link (slug = affiliate identifier) |

---

## 3. Product / SKU tags

Set on every order. Used by bundle-cross-sell mapper to detect which BUNDLE to fire.

Format: `product:<sku-slug>`

Examples (one per current SKU — list grows as catalog grows):
- `product:tax-001-mileage-log`
- `product:tax-002-schedule-e`
- `product:tax-003-1099`
- `product:ops-001-cleaner-checklist`
- `product:ops-003-turnover-pack`
- `product:gst-001-welcome-book`
- `product:acq-001-deal-analyzer`
- `product:acq-002-market-scorecard`
- `product:fin-002-cashflow-model`
- `product:bundle-01-first-year-host`
- `product:bundle-02-aspiring-host`
- `product:bundle-03-year-2-operator`
- `product:bundle-04-portfolio`
- `product:bundle-05-pro-manager`

Keep `product:` tags identical to the SKU slug in `infrastructure/influencersoft/products.yaml` once that file is populated.

---

## 4. Engagement / state tags

Written automatically by IS or by scripts. Used to gate other sequences.

| Tag | Meaning | Effect |
|-----|---------|--------|
| `engaged:opened-e<N>` | Contact opened email N of sequence | IS internal — set in sequence UI |
| `engaged:clicked-e<N>` | Contact clicked email N | Same |
| `engaged:replied` | Contact replied to any sequence email | Sets `vip:replied`, exits cold-list |
| `review:requested` | Review-ask email was sent | Used by review-request sequence to skip duplicate |
| `review:left` | Etsy/Trustpilot review confirmed | Manual tag from Etsy admin |
| `unsubscribed` | Hard unsub (regulatory) | All sequences MUST `exit_on_tag` this |
| `bounced:hard` | Email bounced permanently | Same |
| `vip:replied` | Replied to any email | Used by support routing |
| `vip:multi-buyer` | ≥2 purchases | Used by bundle cross-sell suppression |

---

## 5. Refund + suppression tags

| Tag | Meaning |
|-----|---------|
| `refund-filed` | Refund requested (triggers `refund-recovery`) |
| `refund-completed` | Refund finalized |
| `do-not-email` | Hard stop — manual override |
| `suppressed:abuse` | Spam reports, abuse — never email again |

Every sequence wired in IS UI MUST have these in **exit conditions**: `unsubscribed`, `do-not-email`, `suppressed:abuse`, `bounced:hard`.

---

## 6. Naming rules

1. **Lowercase only.** Case sensitivity is assumed (probe doc §5).
2. **Colon for namespace, hyphen for words inside a namespace.** Good: `bundle-cross:first-year-host`. Bad: `bundle_cross:firstYearHost`.
3. **No spaces.** Ever.
4. **Stable strings.** Once a tag is bound to a sequence in IS UI, renaming it here breaks the binding silently. Add new tags rather than renaming.
5. **One tag = one fact.** Don't overload a tag with multiple meanings (e.g. don't use `customer` for both "bought once" and "is on retention list").

---

## 6.5. Behavioral patterns (from skill gotchas)

### Purchase → simultaneously tag buyer AND remove from retargeting list

Per founder advice (skill gotcha #22): when a purchase succeeds, in a single
Sequence/Process block do BOTH:
1. **Add tag** `customer:etsy` (or whatever buyer state tag applies)
2. **Remove from list** `STR Ledger — Retargeting` (or whatever ad-retargeting list)

Reasoning: a contact who just bought should not see "buy now" retargeting ads
in their feed. Doing both actions in one block prevents the race condition
where the ad fires before the list-remove.

### Activation state — manually-added contacts are NOT emailable

Skill gotcha #6: contacts created via UI `Create Contact` or API `AddUpdateLead`
without a subscription/activation flow are flagged non-emailable by IS. They
won't receive any sequence or broadcast email regardless of which tags are
applied or which sequence triggers fire.

**Implication for our tag dictionary:** applying `customer:etsy` to a contact
that was manually inserted does NOT make them receive the post-purchase
sequence. Either:
- Push them through a real subscription form, OR
- Use API 1.0 `AddLeadToGroup` with activation-email flag

This affects E2E testing: see `scripts/is-end-to-end-test.mjs` for the canary
setup that respects activation state.

---

## 7. Adding a new tag

1. Add the row to the right section of this file.
2. If it's a trigger tag, update `ops/manual work/influencersoft-manual-setup-guide.md` Part 5 + bind it in IS UI.
3. Add the string constant to `scripts/lib/influencersoft.mjs` if any script will write it.
4. Commit with message `infra(is): add tag <tag-name>`.
