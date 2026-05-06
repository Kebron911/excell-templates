# Order Confirmation Sequence — STR Manuals (any SKU)

**Spec reference:** STRManuals/charter.md §8 + design-spec.md §8 (Checkout Flow). Triggers on Stripe `checkout.session.completed` for any strmanuals.com SKU.

**Trigger:** `product:<sku>` tag added by n8n on successful Stripe webhook (any of: `str-tax-loophole-playbook`, `material-participation-survival-kit`, `why-bookings-down`, `direct-bookings-starter`, `permit-regulation-survival`, `str-manuals-bundle`).

**Default tags applied at entry:**
- `customer:strmanuals`
- `source:strmanuals`
- `product:<sku>`
- `acquired:<date>`

**Goal:** Confirm purchase, deliver download, surface the companion workbook, prevent refund, and warm them for the next manual.

**Token conventions:**
- `{{ first_name | default: "there" }}`
- `{{ manual_title }}` — full SKU title (e.g., "The STR Tax Loophole Playbook")
- `{{ manual_sku }}` — `TAX-01` etc.
- `{{ download_url }}` — HMAC-signed link, 24h expiry; re-issuable from `/downloads`
- `{{ companion_name }}` — e.g., "TAX-002 P&L Workbook"
- `{{ companion_url }}` — link to companion workbook on thestrledger.com or Etsy
- `{{ next_manual_title }}`, `{{ next_manual_url }}` — picked by tag (TAX-01 buyers → TAX-02, REV-01 buyers → REV-02, etc.)
- `{{ order_id }}`

**Segmentation note:** Sequence is shared across all 6 SKUs. Email 3 (cross-sell) branches on `product:` tag — bundle buyers skip Email 3 entirely (they already own everything).

---

## Email 1 — Day 0 — Receipt + download (transactional, sent immediately)

**Subject:** Your manual is ready — {{ manual_title }}

**Preheader:** Plus the companion workbook and a 60-second how-to-read-this-fast tip.

```
Hey {{ first_name | default: "there" }},

Thanks for buying {{ manual_title }}. Your download is ready:

[Download {{ manual_sku }} →]({{ download_url }})

This link expires in 24 hours for security, but you can re-request a fresh one anytime from strmanuals.com/downloads — same email you used at checkout, no password.

Two quick things before you open it.

**1. The companion workbook.**

Every manual ships with a fillable workbook keyed to it. Yours is the {{ companion_name }} — link is on the last page of the PDF. Open it side-by-side with the manual, not after.

[Get the {{ companion_name }} →]({{ companion_url }})

**2. How to read it in one sitting.**

These manuals are designed to be read in an afternoon, not bookmarked for "later." Block 60 minutes this week. Skim the table of contents first, then read straight through. The checklists at the end of each chapter are where the value compounds — fill those out as you go.

If you have questions, hit reply. This goes to a human.

— Daniel
STR Manuals

P.S. Your order ID is {{ order_id }}. Save this email; you'll need it if you ever ask for a refund or re-download.

P.P.S. The PDF footer has your email and order ID watermarked on every page. That's so I don't have to spend my time chasing redistributors. Please don't share — but if a friend would benefit, send them strmanuals.com instead.
```

**Send-trigger:** `product:<sku>` tag added (instant)
**Send-delay:** 0
**Next-step tag on send:** `seq:strmanuals-order-confirmation:e1-sent`

---

## Email 2 — Day 3 — The "did you actually read it?" check-in

**Subject:** Did you open {{ manual_sku }} yet?

**Preheader:** Plus the one chapter most readers skip and shouldn't.

```
{{ first_name | default: "Hey" }},

Three days since you bought {{ manual_title }}. I'll keep this short.

If you've already read it: nice. The next step is filling in the companion workbook with your numbers — that's where the manual goes from "interesting" to "decisions made."

If you haven't opened it yet: I get it. The folder of unread PDFs is the universal tax of being a curious person. But the longer this one sits, the less likely it gets read.

Block 45 minutes this weekend. That's it. The manual is shorter than a Saturday morning.

[Re-download {{ manual_sku }} →](https://strmanuals.com/downloads)

One specific chapter to flag: if you skip everything else, read the chapter on documentation. It's the part most people don't take seriously and the part that actually decides whether the strategy works.

— Daniel

P.S. The 14-day refund window closes in 11 days. If the manual didn't help, just hit reply with your order ID ({{ order_id }}) and I'll refund you, no interrogation. I'd rather have your honest "didn't help" than your reluctant keep.
```

**Send-trigger:** `seq:strmanuals-order-confirmation:e1-sent`
**Send-delay:** +3 days
**Next-step tag on send:** `seq:strmanuals-order-confirmation:e2-sent`

---

## Email 3 — Day 8 — The next manual (cross-sell, branched by tag)

**Subject:** What to read after {{ manual_sku }}

**Preheader:** The 80% of readers who buy two manuals usually buy them in this order.

```
{{ first_name | default: "Hey" }},

Hope {{ manual_title }} was useful.

Most readers don't stop at one manual — they buy the next one when the first one surfaces a question they didn't know they had. For people who started where you did, that next one is usually:

**{{ next_manual_title }}**

[Read about {{ next_manual_title }} →]({{ next_manual_url }})

If you'd rather just grab everything at once, the bundle is $99 for all five — about $25 less than buying three of them individually:

[The bundle →](https://strmanuals.com/bundle)

(If you already own the bundle, ignore me — and thanks.)

— Daniel

P.S. The free 8-page tax explainer is going out next week to everyone on the list. If you haven't grabbed it yet: strmanuals.com/free.
```

**Send-trigger:** `seq:strmanuals-order-confirmation:e2-sent` AND NOT `product:str-manuals-bundle`
**Send-delay:** +5 days (Day 8)
**Next-step tag on send:** `seq:strmanuals-order-confirmation:complete`

**Branching merge-var resolution (n8n table):**

| Trigger tag | next_manual_title | next_manual_url |
|-------------|-------------------|-----------------|
| `product:str-tax-loophole-playbook` | Material Participation Survival Kit | /manuals/tax-02 |
| `product:material-participation-survival-kit` | The STR Tax Loophole Playbook | /manuals/tax-01 |
| `product:why-bookings-down` | Direct Bookings Starter | /manuals/rev-02 |
| `product:direct-bookings-starter` | Why Are My Bookings Down? | /manuals/rev-01 |
| `product:permit-regulation-survival` | The STR Tax Loophole Playbook | /manuals/tax-01 |

---

## Sequence exit

After Email 3 (or after Email 2 for bundle buyers), the contact stays in the master list with their `customer:strmanuals` + `product:<sku>` tags and is eligible for biweekly broadcast cadence. They're flagged for the 90-day "still a customer" check-in handled by a separate cluster-wide automation.
