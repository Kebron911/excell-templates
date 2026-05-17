# Airbnb 1099-NEC: The Filing Rule Most Hosts Miss (2026 Guide)

**Status:** Draft v1 — awaiting user review + factual verification

**Target keyword:** airbnb 1099 nec

**Target word count:** 1,800–2,200

**Primary CTA:** 1099-NEC Trigger Calculator (free) at `/free/1099-trigger-calculator`

**Secondary CTA:** TAX-003 1099-NEC Vendor Tracker ($17)

**Publish date:** TBD — after Ghost goes live + factual review

---

> **⚠️ User review required before publishing:**
>
> 1. Verify every dollar threshold against current IRS publications (Pub 15-A, Form 1099-NEC 2026 instructions). Thresholds occasionally change.
> 2. Confirm Form 1099-K threshold ($600 in 2024+ vs the on-again/off-again $20K/200-transaction rule). As of writing, the $600 threshold for Form 1099-K is delayed via Notice 2023-74 — verify the 2026 effective rule before publication.
> 3. Add the standard disclaimer at the top (template below).
> 4. Replace `The STR Ledger` and `thestrledger.com` tokens after Task A1 lock.

---

## Draft (copy below into Ghost after review)

---

> **Important:** This guide is general educational information, not tax advice. 1099-NEC rules are complex and have been moving targets since 2020. Always confirm filing requirements with a licensed CPA before issuing any 1099 — penalties for late or incorrect filing are real ($60–$290 per form, up to $3M aggregate per year). IRS reference: [Form 1099-NEC instructions](https://www.irs.gov/forms-pubs/about-form-1099-nec).

If your Airbnb generates revenue, you're a small business. And like every other small business, you owe **Form 1099-NEC** to certain contractors you paid in the past year.

The trap: most STR hosts don't realize they're "every other small business" — they think Airbnb is a side gig. The IRS does not. Miss a 1099-NEC filing and you owe **$60 to $290 per missed form**, plus the contractor can drag your name into their own audit when the dollar amounts don't match.

Here's the rule, the exceptions hosts always miss, and the workflow that takes 20 minutes a year if you set it up right.

**[Grab the free 1099-NEC Trigger Calculator →](thestrledger.com/free/1099-trigger-calculator)** — drop in every contractor you paid, the Excel tells you who needs a 1099 and what to do next.

---

## The basic rule (and the trapdoor)

**Issue Form 1099-NEC to any individual contractor you paid $600+ in cash, check, ACH, Zelle, Venmo (personal), or PayPal Friends/Family during the calendar year.**

That's the basic rule. The trapdoor is the *payment method*.

If you paid the same contractor via **credit card, PayPal Goods & Services, or Stripe** — even if the total is $50,000 — you owe **zero 1099-NECs**. The payment processor files Form 1099-K on the contractor's behalf, and your obligation is taken care of.

This is the single biggest source of 1099-NEC confusion in STR. A host pays their cleaner $400/month via:
- **Zelle:** YES — owe 1099-NEC ($4,800/yr crosses threshold)
- **Credit card via Square:** NO — Square files 1099-K
- **Venmo (Business):** NO — Venmo files 1099-K
- **Venmo (Personal):** YES — same as Zelle

If you change nothing else about your STR ops this year, **migrate every contractor payment to credit card or ACH-via-business-platform**. You eliminate the entire 1099-NEC filing burden and you keep the same expense deduction.

### Why the IRS made this rule

In short: they didn't want to double-count. If both you AND the payment processor reported the same payment, the contractor would look like they earned twice as much as they did. So Congress carved out the credit-card/processor exception in §6041 and §6050W.

---

## Who exactly needs a 1099-NEC from you

Walk through your STR vendor list. Each gets a 1099-NEC from you if **all** of these are true:

1. ✅ You paid them $600 or more in the calendar year
2. ✅ You paid via cash, check, ACH (bank-direct), Zelle, or personal Venmo / Cash App / PayPal Friends
3. ✅ They are an **individual or single-member LLC or partnership** (not a C-corp or S-corp)
4. ✅ The work was performed in the United States or for your US business

Common STR vendors who hit all four:

| Vendor type | Typical annual spend (1 STR) | Hits threshold? |
|-------------|------------------------------|-----------------|
| Cleaning service (independent, not a chain) | $3,000–$8,000 | YES |
| Handyman / general repairs | $500–$3,000 | Maybe |
| Landscaper | $400–$2,500 | Maybe |
| Lawn / snow removal | $300–$1,500 | Maybe |
| Pool / hot tub service | $800–$3,000 | YES if independent |
| Co-host / property manager (independent) | $4,000–$15,000 | YES |
| Photographer (one-time listing shoot) | $200–$800 | Usually NO |
| Smart-lock installer | $100–$400 | Usually NO |
| Bookkeeper / VA (per-hour, no platform) | $1,200–$5,000 | YES |

### Vendors who NEVER need a 1099-NEC from you

- **C-corps and S-corps** (most chain cleaning services, ServiceMaster-affiliates, big plumbing companies). If their invoice says "LLC" with no "S-corp" or "C-corp" designation, ask via W-9.
- **Anyone you paid 100% via credit card, PayPal Goods, Stripe, Square**, or any major payment platform.
- **Materials vendors** (Home Depot, Lowe's, IKEA) — those are goods, not services.
- **Airbnb / VRBO** — they're not your contractor; they're your platform. They send YOU a 1099-K, not the other way around.
- **Your CPA / attorney** (S-corp or LLC structured as one) — typically exempt.

---

## How to find out if a vendor is a corporation

Send them a **Form W-9** before the end of the calendar year (or before you ever pay them, if you're disciplined).

Form W-9 asks the vendor:
- Their legal name
- Their business name (if different)
- **Tax classification** (Individual / Sole Prop / C-corp / S-corp / Partnership / LLC w/specific class)
- Their EIN or SSN

If they check "C-corp" or "S-corp" — no 1099-NEC needed. File the W-9 for your records (3-year minimum, 7 years if you want to be safe).

If they check Individual, Sole Prop, Partnership, or LLC w/o S-corp election — and you paid them $600+ via non-processor methods — you owe a 1099-NEC.

> **Email template for requesting a W-9** (steal this):
>
> Subject: Quick form request — for your records and mine
>
> Hi {{ vendor first name }},
>
> For year-end tax purposes I need a W-9 from all service vendors. Takes about 90 seconds — just name, business name, tax classification, EIN/SSN.
>
> W-9 form (IRS-fillable PDF): https://www.irs.gov/pub/irs-pdf/fw9.pdf
>
> Thanks!
> {{ your first name }}

---

## When 1099-NECs are due

| Deadline | Action |
|----------|--------|
| **January 31, 2026** | Copies of 1099-NEC due to contractors AND to the IRS |
| Same date | Form 1096 (the cover-page summary) due to IRS if filing by paper |

**Note:** 1099-NEC has the same deadline for both contractor copies and IRS copies. Other 1099 forms (1099-MISC, 1099-K) give you until late February for IRS submission but the contractor copy is still January 31.

If a deadline falls on a weekend or federal holiday, it shifts to the next business day.

### What if you miss the deadline?

| Days late | Penalty per form (small biz, < $5M revenue) |
|-----------|---------------------------------------------|
| 1–30 days late | $60 per form (capped at ~$232K aggregate) |
| 31 days – Aug 1 | $130 per form (capped at ~$697K) |
| After Aug 1 (or never filed) | $330 per form (capped at ~$1.4M) |
| Intentional disregard | $660+ per form, no cap |

Penalties stack with state-level filing penalties in states that require state 1099 copies (CA, NJ, MA, etc.). One STR host with 5 missed cleaners can owe **$650+ in penalties** for a tax obligation that took 20 minutes to fulfill.

---

## How to actually file

You have three options, in order from simplest to most-involved:

### Option 1 (recommended): Use a filing service

- **Track1099 (now owned by Avalara)** — $2.99 per form, e-files for you, sends contractor copies via email or mail, handles state filing
- **Tax1099** — similar pricing
- **QuickBooks Online** — built-in if you're already on QBO, $14.99/contractor (more expensive but seamless if your data is already in QBO)
- **The STR Ledger TAX-003 Vendor Tracker** — exports a CSV ready to upload to Track1099 in 30 seconds

For most STR hosts with 3-10 contractors, a filing service costs $10-30 total and removes 95% of the paperwork burden.

### Option 2: Use IRIS (IRS free e-file)

The IRS launched the **Information Returns Intake System (IRIS)** in 2023. It's free, but the UI is utilitarian (federal-government-built). Fine if you're filing 1-3 forms; tedious past that.

### Option 3: Paper file Form 1099-NEC + 1096

Old-school, no longer recommended. The IRS expects e-filing for anyone filing 10+ forms, and the paper forms must be ordered from the IRS (you can't just print them off — the red ink matters for OCR). Skip this.

---

## The STR-specific filing checklist

Run through this in early January every year:

1. **Pull your full vendor list for the year.** Export from your bookkeeping software, your bank statements, and any payment apps (Zelle, Venmo, Cash App, PayPal).

2. **Categorize each vendor by payment method.** Identify who got paid via cash/check/ACH/Zelle/Venmo personal (1099 territory) vs credit card/Stripe/PayPal Goods (processor handles it).

3. **For each "1099 territory" vendor**, check:
   - Total $ paid this year: ≥ $600?
   - Have a W-9 on file? If not, request immediately (don't wait — they take days/weeks).

4. **For each vendor that crosses the threshold AND is non-corp**, prepare the 1099-NEC.

5. **File by January 31**. Use a service. Don't paper-file.

6. **Store copies** for 3+ years in `templates/_delivery/your-bookkeeping/1099s/{{ year }}/`.

**Total time for a well-prepped host:** 90 minutes once you have W-9s and a vendor export.

**[Get the full 1099-NEC Vendor Tracker (TAX-003) →](thestrledger.com/1099-tracker)** — auto-categorizes by payment method, flags missing W-9s, exports IRS-ready CSVs for Track1099.

---

## The W-9-collection moment that costs hosts thousands

Picture this: it's January 28. You're trying to file 1099-NECs for last year. Your cleaner of 18 months has moved. The phone goes to voicemail. Email bounces. You have no W-9 on file. The deadline is in 3 days.

What you can do:
- **File the 1099-NEC with "REFUSED" on the TIN line.** This protects YOU from penalty. The IRS will hassle the cleaner (their problem, not yours), and any future cleaner-IRS dispute does not involve you.
- **Or file with the SSN they're known by** if you happen to have it from an old check or memory — but you should not guess.

What you cannot do:
- Skip the filing because you don't have the W-9. Skipping = penalty. The contractor's non-cooperation is not your shield.

**The fix that never breaks:** require a W-9 *before the first payment*, every time, with every new vendor. Make it part of your onboarding email. It takes 2 minutes; saves hours of January panic.

---

## What about Airbnb sending YOU a 1099-K?

Airbnb (and VRBO) report your gross rental income on Form 1099-K. The threshold for 1099-K issuance has bounced around — as of 2024+, it's $600 in gross (vs. the previous $20K/200-transaction rule). Most STR hosts will receive a 1099-K from at least one platform.

This is **separate** from your 1099-NEC obligations:
- 1099-K coming TO you = goes on Schedule E (Line 3) as rental income
- 1099-NEC going FROM you to your cleaner = goes on Schedule E (Line 7) as cleaning expense

Both flow through your return; neither replaces the other.

---

## The 4 mistakes that trigger letters

1. **Filing for a corp.** If you 1099 a C-corp by mistake, the IRS doesn't penalize you, but the contractor will be annoyed and your books look messy. Verify via W-9 before filing.

2. **Wrong TIN.** Off-by-one digit in the EIN. IRS issues a "CP2100 Notice" telling you to backup-withhold 24% from future payments to that contractor. Painful for both sides.

3. **Late by 1 day.** $60 per form. If you filed on Feb 1 instead of Jan 31, that's the bracket. File early — IRS systems can lag and timestamps matter.

4. **State filing missed.** ~12 states (CA, MA, NJ, ME, etc.) require their own state-1099 filing in addition to the IRS submission. Filing services handle this automatically; DIY filers forget.

---

## The action list

Before next January:
- [ ] **Right now (June or earlier):** Migrate every contractor payment to credit card or business-platform ACH. Eliminate the obligation entirely.
- [ ] **Right now:** Collect a W-9 from every active vendor. Email template above.
- [ ] **Right now:** Pull a list of last year's payments by method (your bookkeeping can do this — or use the free 1099 Trigger Calculator).
- [ ] **By December 15:** Set a calendar reminder for January 5 to begin the filing process.
- [ ] **By January 31:** File via Track1099 / Tax1099 / TAX-003 export. Done.

**Total time investment over the year:** about 90 minutes.
**Total tax savings + penalty avoidance:** $200–$2,500.

**[Free: 1099-NEC Trigger Calculator + W-9 Request Email Template →](thestrledger.com/free/1099-trigger-calculator)**

---

## Related reading

- [Schedule E line-by-line for STR hosts](thestrledger.com/blog/airbnb-schedule-e) — where the contractor payments actually land
- [47 Airbnb tax deductions most hosts miss](thestrledger.com/blog/airbnb-tax-deductions) — the master list
- [Quarterly estimated taxes for STR hosts](thestrledger.com/blog/airbnb-quarterly-taxes) — companion deadline

**External references:**
- [IRS Form 1099-NEC instructions](https://www.irs.gov/forms-pubs/about-form-1099-nec)
- [IRS Form W-9 (request form)](https://www.irs.gov/pub/irs-pdf/fw9.pdf)
- [Form 1099-K reporting threshold (Notice 2023-74)](https://www.irs.gov/newsroom/irs-announces-delay-in-form-1099-k-reporting-threshold-for-third-party-platform-payments-in-2023-and-2024)

---

*Daniel Harrison runs The STR Ledger, financial-ops templates for STR hosts. He has filed exactly one 1099-NEC late ($60 penalty, 2022) and has not done it again.*
