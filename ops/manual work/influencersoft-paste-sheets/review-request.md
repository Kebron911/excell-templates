# Paste Sheet — review-request

> **Auto-generated from:** `copy\email-sequences\review-request.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.

## IS UI setup

1. **Automations → New Sequence**
2. **Name:** `review-request`
3. **Trigger:** When tag `purchased:day5` is added
4. **Then add 2 email(s) below in order.** Set the delay per the header on each.
5. **Save and Activate** when the last email is in.

When done, mark this sequence done in your tracker.

---

### Email 1 of 2 — The ask

- **Delay (set in IS):** Day 7
- **Subject (copy):**

      Quick favor — 60-second review of {{ sku_label }}?

- **Preheader (copy):**

      If it's working. If it's not, please email me first.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN review-request EMAIL 1 -----8<-----

{{ first_name | default: "Hey" }},

A week in with {{ sku_label }} — how's it going?

If it's working: would you take 60 seconds and leave an honest Etsy review? Reviews are how new buyers decide whether to trust a small shop, and yours genuinely moves the needle for me.

→ [Leave a review on Etsy]({{ link_etsy_review }})

If something's off — a formula isn't behaving, a tab confuses you, anything — please email me at hello@thestrledger.com first. I'd rather fix it than have you write a frustrated review I can't respond to.

That's it. No script, no star-count ask. Just honest feedback if you've got 60 seconds.

— Emily · The STR Ledger

P.S. If you've already left one — thank you. Skip this email.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 2 — Last-chance ask

- **Delay (set in IS):** Day 14
- **Subject (copy):**

      Last note on this — review or feedback either way

- **Preheader (copy):**

      Two weeks in. Won't ask again after this.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN review-request EMAIL 2 -----8<-----

{{ first_name | default: "Hey" }},

Two weeks since you picked up {{ sku_label }}. One more nudge then I'll stop.

If the workbook is doing the job — an honest Etsy review helps the next buyer figure out whether it's right for them:

→ [Review {{ sku_label }}]({{ link_etsy_review }})

If it's NOT doing the job, I want to know. Reply to this email or write to hello@thestrledger.com. Specific feedback ("the depreciation tab confused me", "I expected a feature that wasn't there") makes the next version better — for you and for everyone else.

Either way — review, feedback, or silence — that's the last you'll hear from me on this. Different topic next week: the most-overlooked Schedule E line for {{ sku_code }} buyers (it's not what you think).

Thanks again for picking up the workbook.

— Emily

P.S. Etsy reviews can be edited later. If you leave 4 stars now and the workbook saves you 3 hours at tax time, you can come back and bump it.

-----8<----- END EMAIL 2 -----8<-----
