# Refund Recovery Sequence

**Trigger:** customer issued refund (Etsy, Stripe, or Gumroad) — fires on tag `refunded:<date>`
**Tag at entry:** `refund-recovery`
**Sequence length:** 2 emails (Day 1, Day 7) — short, low-pressure, learning-oriented
**Target outcome:** 5-10% re-purchase within 90 days OR usable feedback on why the refund happened (both count as wins).

**Tokens:** `{{ first_name }}`, `{{ refunded_sku_name }}`, `{{ refunded_sku_code }}`, `{{ link_alternate_sku }}`, `{{ link_support }}`

**Suppression:**
- If refund reason was "wrong product / duplicate purchase" (manual tag `refund-reason:duplicate`), send only Email 1 (apology + skip the learn-from-this) and exit
- If refund was triggered by chargeback or PayPal dispute, exit entirely (legal/payment-processor risk to keep emailing)
- If customer has tag `support:hostile` (rude support interaction), exit — don't reopen the wound
- Hard suppression: 365 days on this sequence (one refund per buyer = one recovery attempt)
- After completion: customer tagged `recovery-attempted` and moved to dormant nurture (newsletter only)

---

## Email 1 — Day 1 — The apology + the question

**Subject:** Sorry the workbook didn't land — quick question

**Preheader:** Refund processed. One small ask if you have 30 seconds.

```
{{ first_name | default: "Hey" }},

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
```

---

## Email 2 — Day 7 — One last "is there a better fit?"

**Subject:** One thought before you go

**Preheader:** A different workbook might fit better. No pressure.

```
{{ first_name | default: "Hey" }},

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
```

---

## After sequence

- **Tags set:** `recovery-attempted` (always), `recovery-replied` (if buyer responded)
- **Manual tags for inbox triage:** `refund-reason:fit` / `refund-reason:complexity` / `refund-reason:bug` / `refund-reason:other`
- **Suppression:** 365 days on refund-recovery sequence
- **Next sequence trigger:** none. Buyer moves to newsletter-only nurture.

## Iteration log

- `2026-05-05` — Initial draft. Two-touch, low-pressure. Day-1 email leads with "refund processed, here's the timing" — gives buyer the receipt they actually want, then asks the why-question gently. Day-7 email is the only soft-pitch, framed as "different fit" not "come back" — honoring the refund decision while showing the rest of the catalog. No discount code: a refund-recovery discount trains future buyers to refund-then-rebuy at a discount, which is bad math.
