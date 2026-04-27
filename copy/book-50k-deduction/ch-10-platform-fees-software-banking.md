# Chapter 10 — Platform Fees, Software, and Banking

*The deductions hidden in your gross.*

---

Olivia's bank deposits from Airbnb in 2023 totaled approximately **$180,000.** Her bookkeeper built her Schedule E around that figure — the deposits in, the operating expenses out, the net to Schedule E line 26.

In January, the 1099-K arrived from Airbnb. The 1099-K reported gross transactions of **$192,000.**

The $12,000 delta was Airbnb's host service fee — the platform's cut of every booking, deducted before the funds ever hit Olivia's bank account. Olivia had been filing returns that under-reported her gross rental income by $12,000 a year and *also* failing to claim the $12,000 platform fee as a deduction. Net effect on tax: zero. Net effect on the IRS computer-matching algorithm: a near-certain CP2000 letter.

Her new CPA caught it on the prior-year return preparation review. They re-entered the gross at $192,000, claimed the $12,000 as a platform service fee deduction, and reconciled the bank deposits as the residual after fees. Same net income. Clean reconciliation. No mismatch.

This chapter is about that reconciliation — and three other deductions that live in the same category. They are small individually, large in aggregate, and almost universally under-tracked because they hide inside payment streams the host never sees as cash.

These are **deductions #31 through #34** of the 47.

---

## The 1099-K reconciliation problem

Every payment platform — Airbnb, VRBO, Booking.com, Stripe, PayPal — issues a 1099-K to hosts whose transactions exceed the reporting threshold. The 1099-K reports **gross transactions**, not net deposits. The IRS computer-match system compares the 1099-K gross against the income reported on Schedule E line 3.

**The threshold has moved — and then moved back.** The pre-ARP §6050W threshold was $20,000 gross *and* 200 transactions; ARP dropped it toward $600 with phased step-downs ($5,000 in 2024, $2,500 in 2025). **OBBBA §70432 restored the pre-ARP $20,000 / 200-transactions threshold permanently** for 1099-K reporting. For most STR hosts on a single platform with material annual revenue, this still triggers reporting; lower-volume hosts who received 1099-Ks at the $5,000 (2024) or $2,500 (2025) thresholds will no longer get them in 2026 unless they cross both bars. Income reporting obligations are unchanged — the 1099-K is an information return, not a tax — so report what you actually earned regardless of whether a form lands in your mailbox.

Three numbers are typically in play:

1. **Gross bookings** — what guests paid
2. **Platform deposits** — what the platform sent to the host's bank account (net of platform fees, sometimes net of cleaning fees paid through the platform, sometimes net of taxes the platform collected and remitted)
3. **1099-K gross** — what the platform reports to the IRS

The 1099-K gross is usually equal to or close to the gross bookings. The platform deposits are usually smaller — the difference is the platform fees, which were deducted before payout.

The host's job:

- Report the **1099-K gross** as income on Schedule E line 3
- Deduct the **platform fees** as a separate expense (deduction #31, below)
- Reconcile the bank deposits as the *residual* after fees, not as the income figure itself

The mistake Olivia's prior bookkeeper made — reporting bank deposits as income — produces:

- Under-reported gross income by the platform-fee amount
- A 1099-K mismatch the IRS computer flags
- A CP2000 letter or audit asking why the reported income is below the 1099-K
- A messy reconciliation that has to be done after-the-fact, often with penalties layered

The fix is mechanical. Report gross, deduct fees, let the math reconcile to net.

---

## Deduction #31 — Platform service fees

Every rental platform collects a fee. The mechanics vary:

- **Airbnb** charges the host a service fee (commonly ~3% of the subtotal, with a "host-only fee" structure used by some hosts that's typically 14–16% of the subtotal in lieu of the standard split with guests). The host fee is deducted before payout.
- **VRBO** charges a host fee or annual subscription, plus per-booking commissions for non-subscribers. Models vary.
- **Booking.com** charges a per-booking commission (typically 15%, sometimes higher in certain markets). Deducted before payout.
- **Direct-booking processors** (your own website with Stripe / Square / etc.) charge per-transaction fees (Chapter 10 deduction #32 below).

All of these are fully deductible **platform service fees**, captured on Schedule E line 19 (Other) labeled clearly, or rolled into line 11 (Management fees) if your bookkeeping convention groups them there.

For a host with $200,000 of gross rental income split across Airbnb (60%), VRBO (30%), and direct (10%), platform fees typically total **$8,000–$15,000 a year.** That entire amount is deductible. Hosts who bookkeep from net deposits silently forfeit this deduction every year.

**Capture method:** download the year-end statement from each platform. Most platforms provide a CSV or PDF that breaks out gross bookings, platform fees, and net payouts. Reconcile against your bank deposits, and the platform fee total drops out as the difference.

---

## Deduction #32 — Payment processing fees

For hosts who accept direct bookings or supplemental payments outside the major platforms — security deposits collected via Stripe, damage charges run through Square, gift-card sales via PayPal — every transaction carries a processing fee, typically 2.9% + $0.30 per transaction.

These fees are deductible. Schedule E line 19 (Other), labeled "Payment processing fees" — or rolled into a "Bank and platform fees" line if your bookkeeping convention combines them.

For most STR hosts, payment processing fees outside the platforms are small — often under $500 a year. Hosts with significant direct-booking volume can see this line approach $2,000–$5,000.

**Capture method:** download the annual fee summary from each processor (Stripe and Square both provide year-end fee reports in their dashboards). Sum and post.

---

## Deduction #33 — Software subscriptions

The toolchain modern STR hosts run typically includes a half-dozen recurring subscriptions:

- **Pricing software** — PriceLabs, Beyond, Wheelhouse, AirDNA Pro
- **Property management** — Hospitable, Hostfully, Lodgify, Guesty Lite, OwnerRez
- **Smart-home and security** — Ring/Nest cloud subscriptions, NoiseAware, Minut
- **Bookkeeping** — QuickBooks, Stessa, Xero (less common given QB's known issues for STR — see the existing nurture content for that whole story)
- **Marketing** — Canva Pro, scheduling tools, photography editing tools, listing optimization platforms

All of these are fully deductible **business software subscriptions**, captured on Schedule E line 19 (Other).

For a typical multi-property host, the software stack runs **$2,000–$8,000 a year.** For single-property hosts, $400–$1,500. The line is universally deductible and routinely under-tracked because the recurring monthly charges hide on auto-pay across two or three different cards.

**Capture method:** at year-end, pull credit-card statements and grep for "subscription" or filter recurring charges. Then post each one as a software expense, named clearly (e.g., "PriceLabs subscription," "Hospitable PM software"). Itemize at capture rather than rolling into a generic "Software" line — the IRS doesn't require itemization, but the breakdown protects you in audit and helps you decide annually which subscriptions are still earning their keep.

**Watch — software vs. subscription vs. capitalize:** annual subscriptions paid in advance (e.g., a $1,200 PriceLabs annual plan paid in December for the following year) are deductible in full in the year of payment for cash-basis taxpayers, even if the subscription period extends into the next year. The $1 of payment in advance under §263(a) — capitalization for prepaid expenses with benefit beyond 12 months — generally doesn't apply because most STR software subscriptions don't extend beyond a year. For multi-year prepaid software, see your CPA.

---

## Deduction #34 — Banking fees

The smallest line in this category, but a real one for hosts running a dedicated rental bank account. Fees that qualify:

- Monthly account maintenance fees
- Wire transfer fees
- Foreign transaction fees (for hosts paying international vendors or contractors)
- Stop-payment fees
- Returned-check (NSF) fees on guest deposits

Schedule E line 19 (Other) labeled "Banking fees."

For a typical STR host with a single dedicated rental account, banking fees run **$0–$300 a year.** Hosts who use commercial accounts with monthly maintenance fees, or who frequently wire payments to international vendors, can see this line approach $1,000.

**Capture method:** end-of-year bank statement, grep for "fee" or "service charge."

---

## The aggregate

For Olivia's portfolio at $200,000 gross, the four deductions in this chapter aggregated to:

| Deduction | Amount |
|---|---|
| Platform service fees (Airbnb + VRBO + Booking.com) | $11,800 |
| Payment processing fees (Stripe direct bookings) | $640 |
| Software subscriptions (PriceLabs, Hospitable, NoiseAware, Canva Pro) | $3,200 |
| Banking fees | $185 |
| **Total** | **$15,825** |

Roughly 8% of gross rental income, recovered as deductions. None of the four were exotic. None of the four required an election. They had simply not been captured because the host's prior bookkeeping ran from bank deposits, which made the platform fees invisible by definition.

The fix is one switch: bookkeep from gross, not from net. The fees are then visible as line items, and the aggregate flows naturally onto Schedule E.

---

## Common mistakes

**Reporting bank deposits as income.** The Olivia mistake. Produces 1099-K mismatch and forfeits the platform-fee deduction. Always report gross; deduct fees separately.

**Lumping all platform fees into one line.** Airbnb's host fee, VRBO's commission, and Booking.com's per-booking charge are all platform fees, but they should be itemized at the source level for audit-defensibility. The aggregate goes on the return; the breakdown lives in the workbook.

**Forgetting host-only-fee structures.** Some Airbnb hosts have elected the host-only fee structure where the host pays 14–16% in exchange for guests seeing no fee. That entire amount is the host's deduction — much larger than the standard 3% split. Hosts who elected this structure and didn't update their bookkeeping can be under-deducting by 10–15% of gross.

**Treating prepaid annual subscriptions as monthly accruals.** For cash-basis taxpayers (the default for individuals), the full year's subscription is deductible in the year paid, even if the period extends past year-end. Don't accrue.

**Counting same fee in two places.** A platform that charges both a host service fee and a separate payment-processing fee on top should produce two distinct deductions. Conversely, a payment processor whose fees are bundled into the platform's quoted commission should not be deducted separately. Read each platform's fee schedule once. Capture cleanly.

**Missing software the property manager pays for.** If your property manager runs PriceLabs on your behalf and bills you for the seat, that's still your software deduction — captured through the management fee line, but worth itemizing in your books for clarity.

---

## A note on chapter scope

This chapter covers the *operating* fees in the platform-and-software category. Two related categories live elsewhere:

- **Marketing spend** beyond software — listing photography, copywriting, paid promotion — lives in Chapter 14 (Marketing, guest experience, education).
- **Professional services and contractor 1099s** — what you pay your CPA, your bookkeeper, your handyman, your cleaner — live in Chapter 11.

The fees in this chapter are the platform-and-tool layer. The cleaner who shows up to flip the cabin is Chapter 11. The website that takes the booking and skims a fee is Chapter 10.

---

> ### *Capture this in the Single-Property P&L Workbook.*
>
> The Single-Property P&L Workbook (TAX-002) builds the gross-then-deduct reconciliation directly into the income tab — drop in the 1099-K total, the platform statements, and the bank deposits, and the workbook computes the platform fee deduction as the residual. It's the same shape as Olivia's reconciliation, automated.
>
> `thestrledger.com/cap/10`

---

*This chapter is general information, not tax advice. Platform fee structures, payment processor terms, and 1099-K reporting thresholds change frequently. Confirm specific reconciliations with a qualified tax professional before filing.*
