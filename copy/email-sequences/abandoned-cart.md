# Abandoned Cart Sequence — Own-Site Stripe Checkout

**Trigger:** visitor reached Stripe checkout (own-site, thestrledger.com) AND did not complete payment within 60 minutes
**Tag at entry:** `cart-abandoned:<sku_or_bundle>`
**Sequence length:** 3 emails over 72 hours
**Target outcome:** 12-20% recovery — own-site abandonment rate is typically 65-75%; Stripe checkout abandonment is lower than full-cart e-commerce because there's only one product per session.

**Tokens:** `{{ first_name }}`, `{{ cart_sku_name }}`, `{{ cart_sku_code }}`, `{{ cart_price }}`, `{{ link_resume_checkout }}`, `{{ link_product_page }}`, `{{ link_support }}`

**Suppression:**
- If checkout completes within sequence window, exit immediately
- If visitor never provided email at checkout (Stripe Link or guest), only Email 1 fires (the only email captured before payment)
- If the abandoned cart is a BUNDLE (`cart-abandoned:bundle-*`), use bundle-specific Email 2 variant (see template branching below)
- If visitor is on `customer:*` (existing buyer), softer tone in Email 2 — don't pitch like first-touch
- Etsy abandonments NOT in scope (Etsy doesn't expose abandonment data)
- Hard suppression after sequence: 30 days on same-SKU abandonment (allows re-entry if abandons different SKU)

---

## Email 1 — 1 hour after abandonment — The friction-finder

**Subject:** Your cart for {{ cart_sku_name }} — anything I can fix?

**Preheader:** Came up to checkout and stopped. No pressure — just want to know if something's broken.

```
{{ first_name | default: "Hey" }},

I noticed you started checkout for {{ cart_sku_name }} ({{ cart_price }}) and didn't finish.

That's totally fine — most often it's just "got distracted, will come back" — but if something on the checkout page broke or felt off, I want to know:

  · Card declined? Stripe sometimes flags first-time charges; try again or use a different card.
  · Confused about what's included? Here's the [full feature list]({{ link_product_page }}).
  · Want to ask a question first? Reply to this email — I read everything within 24 hours.
  · Want to come back later? Your link still works:

→ [Resume checkout — {{ cart_price }}]({{ link_resume_checkout }})

That's it. No pressure, no "limited-time" tricks. The price is the price, the workbook isn't going anywhere.

— Emily · The STR Ledger

P.S. The 14-day no-questions refund is real. If you're worried about buyer's remorse — that's the safety net.
```

---

## Email 2 — 24 hours later — The "why operators buy this" pitch

**Subject:** Re: {{ cart_sku_name }} — one specific use-case

**Preheader:** What this saves vs the manual version.

```
{{ first_name | default: "Hey" }},

Quick follow-up on {{ cart_sku_name }}.

Most operators looking at this workbook are solving one of these specific problems:

{% if cart_sku_code starts with "TAX-" %}
  · "Tax season is coming and my receipts/spreadsheets are scattered across 4 systems"
  · "My CPA is charging me extra because my numbers don't tie out"
  · "I'm pretty sure I'm leaving deductions on the table but don't know which"
{% elsif cart_sku_code starts with "ACQ-" %}
  · "I'm looking at a property and the listing photos lie about what STR can earn"
  · "I want to underwrite the deal myself, not trust a broker's spreadsheet"
  · "I need to know my actual break-even occupancy before I write the offer"
{% elsif cart_sku_code starts with "FIN-" or starts with "REV-" or starts with "MKT-" %}
  · "I'm running the property fine but I have no idea if my numbers are good or bad vs market"
  · "I'm leaving money on the table but can't tell where"
  · "Pricing tools cost $30-50/mo each — I want to see if I'd actually use one before paying"
{% elsif cart_sku_code starts with "BUNDLE-" %}
  · "I want the integrated stack, not 4 separate purchases"
  · "I'm at the point where one workbook isn't enough — I need the system"
{% else %}
  · "I'm 6-12 months into hosting and the spreadsheets I cobbled together aren't holding up"
  · "I want one workbook that actually fits how STR operators work, not generic small-business stuff"
{% endif %}

If any of those is your situation, the {{ cart_price }} pays itself back the first time you use it. If none of them is — that's your sign it's not the right fit, and that's also fine.

→ [Resume checkout — {{ cart_price }}]({{ link_resume_checkout }})

Or: [browse the catalog]({{ link_product_page }}) if a different workbook is closer to your problem.

— Emily

P.S. If you're holding back because of price — the bundles ($97-497) often pencil better than buying single SKUs. Three SKUs in a bundle = the price of two à la carte.
```

---

## Email 3 — 72 hours later — Last note

**Subject:** Last note on {{ cart_sku_name }}

**Preheader:** Going quiet on this. Newsletter continues.

```
{{ first_name | default: "Hey" }},

Last note on the cart you started — {{ cart_sku_name }} at {{ cart_price }}.

Your checkout link is still live:

→ [Resume checkout]({{ link_resume_checkout }})

If now isn't the right time, no problem. The workbook isn't going on sale and the price isn't going up — coming back next week or next month works the same.

Going quiet on this specific cart now. You'll still get the weekly newsletter (which is mostly tactical STR content, not pitches), and if a different workbook in the catalog turns out to fit your situation better, that's a good outcome too.

→ [Browse all 65 workbooks]({{ link_product_page }})

Thanks for almost picking it up — that genuinely matters at this scale.

— Emily · The STR Ledger

P.S. If something about the checkout itself stopped you (card error, confusion about delivery, anything), reply to this email and I'll fix it. Bug reports from abandoned carts are how I find broken-checkout problems before they cost real money.
```

---

## After sequence

- **Tags set:**
  - `cart-recovered` if checkout completes during sequence
  - `cart-abandoned:expired` if no completion (eligible for re-trigger after 30 days on different SKU)
- **Suppression:** 30 days on same-SKU abandonment; 7 days on any abandonment (so a buyer abandoning 3 SKUs in a row doesn't get 9 emails in 72 hours)
- **Cross-reference with bundle sequences:** if buyer abandons a single SKU and is later on a bundle-cross sequence, the cart-abandoned tag does NOT exit them from the bundle sequence (different intent)

## Iteration log

- `2026-05-05` — Initial draft. Three-touch over 72 hours is the e-commerce standard (Klaviyo benchmark data: 3-email sequences recover ~13% vs ~8% for single touch, vs ~15% for 5-email but with 2x unsubscribe rate). Email 1 (1hr) is friction-finder, not pitch — most abandonments are technical or attention, not intent-driven. Email 2 (24hr) uses Liquid-style branching by SKU prefix to surface use-case relevance — generic "you abandoned" emails under-convert vs use-case-specific. Email 3 (72hr) closes loop without nag. No discount code: own-site discounting trains bargain-hunters to abandon, then claim the discount, which is bad math.
