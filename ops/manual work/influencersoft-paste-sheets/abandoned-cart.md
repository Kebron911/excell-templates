# Paste Sheet — abandoned-cart

> **Auto-generated from:** `copy\email-sequences\abandoned-cart.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **3 of 3 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `abandoned-cart`
3. **Trigger node:** `Tag applied` → tag = `checkout-abandoned`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 3 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 3 — The friction-finder

> ⚠️ **TODO — Tokens NOT in IS field map:** `cart_sku_name`, `cart_price`, `link_product_page`, `link_resume_checkout`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - 1 hour after abandonment - The friction-finder`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `0 d 1 hrs 0 min`

**Subject (paste):**

~~~
Your cart for {{ cart_sku_name }} — anything I can fix?
~~~

**Preheader (paste):**

~~~
Came up to checkout and stopped. No pressure — just want to know if something's broken.
~~~

**Body (paste between fences):**

-----8<----- BEGIN abandoned-cart EMAIL 1 -----8<-----

{$name},

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

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 3 — The "why operators buy this" pitch

> ⚠️ **TODO — IS does NOT support Liquid conditionals (`{% if %}`).** This email has conditional logic that won't render. Either rewrite as single-version copy OR split into per-SKU branches using Filter Condition nodes on the canvas.
> ⚠️ **TODO — Tokens NOT in IS field map:** `cart_sku_name`, `cart_price`, `link_resume_checkout`, `link_product_page`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - 24 hours later - The "why operators buy this" pitch`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `0 d 23 hrs 0 min`

**Subject (paste):**

~~~
Re: {{ cart_sku_name }} — one specific use-case
~~~

**Preheader (paste):**

~~~
What this saves vs the manual version.
~~~

**Body (paste between fences):**

-----8<----- BEGIN abandoned-cart EMAIL 2 -----8<-----

{$name},

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

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 3 — Last note

> ⚠️ **TODO — Tokens NOT in IS field map:** `cart_sku_name`, `cart_price`, `link_resume_checkout`, `link_product_page`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - 72 hours later - Last note`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `2 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note on {{ cart_sku_name }}
~~~

**Preheader (paste):**

~~~
Going quiet on this. Newsletter continues.
~~~

**Body (paste between fences):**

-----8<----- BEGIN abandoned-cart EMAIL 3 -----8<-----

{$name},

Last note on the cart you started — {{ cart_sku_name }} at {{ cart_price }}.

Your checkout link is still live:

→ [Resume checkout]({{ link_resume_checkout }})

If now isn't the right time, no problem. The workbook isn't going on sale and the price isn't going up — coming back next week or next month works the same.

Going quiet on this specific cart now. You'll still get the weekly newsletter (which is mostly tactical STR content, not pitches), and if a different workbook in the catalog turns out to fit your situation better, that's a good outcome too.

→ [Browse all 65 workbooks]({{ link_product_page }})

Thanks for almost picking it up — that genuinely matters at this scale.

— Emily · The STR Ledger

P.S. If something about the checkout itself stopped you (card error, confusion about delivery, anything), reply to this email and I'll fix it. Bug reports from abandoned carts are how I find broken-checkout problems before they cost real money.

-----8<----- END EMAIL 3 -----8<-----
