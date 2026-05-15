# Paste Sheet — refund-recovery

> **Auto-generated from:** `copy\email-sequences\refund-recovery.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **2 of 2 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **`Campaigns → Sequences → Add sequence`** — NOT `Tasks → Processes`. Sequences is the correct module for trigger-based email drips. (Founder explicitly warns against Process for this use case — gotchas.md #27.)
2. **Sequence name:** `refund-recovery`
3. **Trigger node:** `Tag applied` → tag = `refund-filed`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 2 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Sequence triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 2 — The apology + the question

> ⚠️ **TODO — Tokens NOT in IS field map:** `refunded_sku_name`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 1 - The apology + the question`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `1 d 0 hrs 0 min`

**Subject (paste):**

~~~
Sorry the workbook didn't land — quick question
~~~

**Preheader (paste):**

~~~
Refund processed. One small ask if you have 30 seconds.
~~~

**Body (paste between fences):**

-----8<----- BEGIN refund-recovery EMAIL 1 -----8<-----

{$name},

Just confirmed your refund for {{ refunded_sku_name }} — should be back on your card within 3-5 business days (Etsy/Stripe handles the timing, not me).

I'm writing because I'd rather learn than lose. If you've got 30 seconds, would you tell me what went wrong? One sentence is plenty:

  · Wrong fit — expected something different
  · Too complex — opened it and felt overwhelmed
  · Too simple — already had this in my own spreadsheet
  · Bug or formula issue — something didn't work
  · Changed mind — no specific reason
  · Other — [tell me]

Just hit reply. No script, no follow-up survey. The workbook gets better when buyers tell me where it missed.

If there's a different workbook in the catalog that would actually fit — I'm happy to point you at it (no obligation, no upsell). Reply and tell me your situation.

— Emily · The STR Ledger

P.S. Refunds are part of the deal. The 14-day no-questions policy is real and I don't take it personally. The only bad outcome is silence — that's the version I can't fix.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 2 — One last "is there a better fit?"

> ⚠️ **TODO — Tokens NOT in IS field map:** `refunded_sku_name`, `refunded_sku_code`, `link_alternate_sku`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 7 - One last "is there a better fit?"`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `6 d 0 hrs 0 min`

**Subject (paste):**

~~~
One thought before you go
~~~

**Preheader (paste):**

~~~
A different workbook might fit better. No pressure.
~~~

**Body (paste between fences):**

-----8<----- BEGIN refund-recovery EMAIL 2 -----8<-----

{$name},

Last note from me on this.

If {{ refunded_sku_name }} wasn't the right fit, there's a chance another workbook in the catalog is — without me knowing your specific situation, I can only guess, but here's the most-common pattern:

**If you refunded {{ refunded_sku_code }} because it was too tax-focused** → the operating workbooks (RevPAR Dashboard, Cleaning Fee Optimizer) might fit better. They're for *running* the property, not filing.

**If you refunded because it was too operational** → the tax workbooks (Schedule E Tax-Prep, Mileage Log) are narrower and finish-it-and-file.

**If you refunded because the catalog feels like too much** → the bundles solve "I don't know which one I need" — pick the persona that matches you (First-Year Host, Year-2 Operator, Portfolio).

→ [Browse the catalog]({{ link_alternate_sku }})

No discount code, no "come back" pitch. If nothing fits, nothing fits. The newsletter (free, weekly, no SKU pitches in 80% of issues) is the lowest-pressure way to stay in touch — and you'll see when something I build genuinely matches your situation.

That's the last I'll send on this. Thanks for giving the workbook a try.

— Emily

P.S. If the refund was about the workbook itself (a bug, a confusing tab, a missing feature) and not about fit — please tell me. That's the feedback I act on fastest.

-----8<----- END EMAIL 2 -----8<-----
