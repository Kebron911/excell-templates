# InfluencerSoft Sequences — Import Pack

Source of truth = the drafted email copy in `copy/email-sequences/`.
This directory holds the **IS-import-shape JSON** ready to paste into the IS UI's Sequence Builder, plus a small manifest mapping each sequence to its trigger tag.

## Mapping

| File | IS Sequence Name | Trigger tag (per tag-dictionary.md §1) | Exit-on tags |
|------|------------------|----------------------------------------|--------------|
| `welcome-book-magnet.json` | Welcome-Book Lead Magnet | `lead-magnet:welcome-book` | `unsubscribed, do-not-email, suppressed:abuse, bounced:hard` |
| `nurture-hero-magnet.json` | 47-Deductions Nurture | `lead-magnet:47-deductions` | (same) |
| `launch-12-new-templates.json` | Wave-2 Launch | `engaged:opened-any` (broadcast, not auto-sequence) | (same) |
| `post-purchase-etsy-buyer.json` | Etsy Post-Purchase | `customer:etsy` | (same) |
| `refund-recovery.json` | Refund Recovery | `refund-filed` | `refund-completed` + standard exits |
| `review-request.json` | Review Request | `purchased:day5` | `review:left` + standard exits |
| `abandoned-cart.json` | Abandoned Cart | `checkout-abandoned` | purchase tags + standard exits |
| `win-back.json` | Win-Back | `inactive-30d` | purchase tags + standard exits |
| `strmanuals-free-magnet.json` | STRManuals Free Sample | `lead-magnet:strmanuals-sample` | (same) |
| `strmanuals-order-confirmation.json` | STRManuals Order Conf | `customer:strmanuals` | (same) |
| `BUNDLE-01-first-year-host.json` | Bundle 01 Cross-Sell | `bundle-cross:first-year-host` | (same) |
| `BUNDLE-02-aspiring-host.json` | Bundle 02 Cross-Sell | `bundle-cross:aspiring-host` | (same) |
| `BUNDLE-03-year-2-operator.json` | Bundle 03 Cross-Sell | `bundle-cross:year-2-operator` | (same) |
| `BUNDLE-04-portfolio.json` | Bundle 04 Cross-Sell | `bundle-cross:portfolio` | (same) |
| `BUNDLE-05-pro-manager.json` | Bundle 05 Cross-Sell | `bundle-cross:pro-manager` | (same) |

## Import process

1. Provision IS account (see `ops/manual work/influencersoft-manual-setup-guide.md`).
2. Confirm every tag in `../tag-dictionary.md` §1 is bound to a Sequence in the IS UI.
3. For each JSON file here:
   - Open the IS Sequence Builder → `Import`.
   - Paste JSON contents.
   - Verify trigger tag matches the table above.
   - Verify exit-on tags are populated (IS won't auto-add them).
   - Save as Draft → preview each email → Activate.
4. Run `infrastructure/influencersoft/verify-tag-and-sequence-methods.sh` to confirm IS API endpoints accept the trigger tags.
5. Run `scripts/is-end-to-end-test.mjs` with the canary contact to verify a real subscription flow ends with the right tags + right sequence emails delivered.

## Email body source

The IS-import JSON in this folder is generated from `copy/email-sequences/<name>.md` files by:

```
node scripts/build-is-sequences.mjs --in copy/email-sequences/ --out infrastructure/influencersoft/sequences/
```

> **Status:** `build-is-sequences.mjs` script not yet built (see BACKLOG.md P2.0).
> Until that ships, generate the JSON manually by following the IS Sequence Builder
> field shape captured in `scrape-influencersoft/guide-md/06-mailing.md` (API-UI-MAP).

## Manifest snapshot

The IS-import shape generally looks like:

```json
{
  "name": "Welcome-Book Lead Magnet",
  "description": "Fires when lead-magnet:welcome-book applied",
  "trigger": { "type": "tag_applied", "tag": "lead-magnet:welcome-book" },
  "exit_on_tags": ["unsubscribed", "do-not-email", "suppressed:abuse", "bounced:hard"],
  "emails": [
    {
      "send_after_days": 0,
      "subject": "...",
      "from_name": "Daniel @ STR Ledger",
      "from_email": "daniel@thestrledger.com",
      "reply_to": "daniel@thestrledger.com",
      "html_body": "...",
      "plain_text_body": "..."
    },
    { "send_after_days": 1, ... },
    ...
  ]
}
```

## Open items

- [ ] `build-is-sequences.mjs` script (BACKLOG P2.0)
- [ ] Generate `.json` for all 15 sequences from `copy/email-sequences/`
- [ ] First-pass deliverability test via mail-tester.com (target 9/10+)
- [ ] Bind every trigger tag in IS UI (tag-dictionary.md §1)
