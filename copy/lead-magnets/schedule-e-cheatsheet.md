# Schedule E Line-by-Line Cheatsheet — Lead Magnet (Blog 02 tie-in)

**SKU code:** `LM-003`
**Format:** Printable PDF, 2 pages, A4 / Letter (set both)
**Funnel role:** Mini-magnet for blog post #2 (`airbnb-schedule-e`). Email-gated at `/free/schedule-e-cheatsheet`. Tag at capture: `lead-magnet:schedule-e`.
**Build tool:** Vista Create — same Brand Kit as cover spec
**Save location (final asset):** `templates/_delivery/_shared/schedule-e-cheatsheet.pdf`
**Companion product:** Schedule E Workbook (TAX-002, $27 Etsy / $47 Gumroad)

---

## Why this magnet exists

Blog post #2 (`airbnb-schedule-e`) ranks for *"airbnb schedule e"* (~500–900/mo search volume). Readers are searching mid-tax-season, panic-prepping. They want a one-page reference they can have open while they enter numbers — not a 17-chapter book. This cheatsheet converts that intent into an email capture, then the post-purchase upsell is the full TAX-002 workbook.

---

## Page 1 — Cheatsheet (line-by-line table)

### Header
**Schedule E (Form 1040) — Line-by-Line Cheatsheet for STR Hosts**
*2026 Tax Year · The STR Ledger*

### Body — single table, two columns wide

| Line | What goes here (STR-specific) | Common mistakes |
|------|-------------------------------|-----------------|
| 1a  | Property address (one row per property) | Using mailing addr instead of rental addr |
| 1b  | Type code: `1` (single family) or `4` (commercial unit) | STR is **always** code 1 unless dedicated B&B |
| 2   | Days rented (fair-rental days) | Don't include blocked owner-stay days |
| 2   | Personal-use days | If >14 days OR >10% of rental days → triggers vacation-home rules |
| 3   | Rents received (gross, before platform fees) | Many include net — wrong. Use gross; fees go on line 11 |
| 5   | Advertising (listing services, photography, paid promotion) | Pro photos = advertising, not capital improvement |
| 6   | Auto & travel — see Pub 463 | Most miss this entirely — use Mileage Log (TAX-001) |
| 7   | Cleaning + maintenance | If paying any contractor >$600/yr, you owe a 1099-NEC |
| 8   | Commissions | Co-host fees go here, not platform fees |
| 9   | Insurance | STR-specific (Proper, Obie, CBIZ) + umbrella, pro-rated |
| 10  | Legal & professional fees | CPA, attorney, permit lawyer, registered-agent fees |
| 11  | Management fees | Platform service fees (Airbnb host service fee) **here**, not on line 8 |
| 12  | Mortgage interest paid to banks | Pro-rate by personal-use days if any |
| 13  | Other interest | HELOC interest used for STR improvements |
| 14  | Repairs | "Restores to prior condition" — fix broken AC = here. Replace AC = depreciate (line 18) |
| 15  | Supplies | Coffee, toilet paper, soap, batteries, consumables under $200 |
| 16  | Taxes | Property tax + lodging tax remitted (NOT collected from guest) |
| 17  | Utilities | Power, gas, water, sewer, trash, internet, streaming, security |
| 18  | Depreciation | 27.5-yr straight-line on building + 5/7/15-yr on items via cost seg |
| 19a | Other (specify) | Line items: permit fees, smart-lock subscriptions, software (PriceLabs, Hospitable), bank fees |
| 20  | Total expenses | Sum of 5–19 |
| 21  | Income/(loss) | Line 3 minus line 20 |
| 22  | Deductible loss after limitation | **Passive activity loss rules apply** — see TAX-008 Material Participation Log |

---

## Page 2 — Decision boxes + CTA

### Box 1 — Schedule E or Schedule C?
**Use Schedule E if:**
- Average stay ≥ 7 days, OR
- Average stay 7+ days AND you don't provide substantial services (meals, daily housekeeping, concierge)

**Use Schedule C if:**
- Average stay < 7 days AND you provide substantial services (think B&B/hotel-level), OR
- Average stay ≤ 30 days AND substantial services

> 90% of Airbnb hosts file Schedule E. Schedule C triggers self-employment tax (15.3% on top of income tax). Get this wrong → big IRS letter. See blog post #10 (LLC vs Sole) for the full decision tree.

### Box 2 — Pro-rate trap
If you have ANY personal-use days, every "shared" expense (mortgage, insurance, utilities, depreciation) must be **pro-rated** by:

```
Rental Days
─────────────────────────
Rental Days + Personal Days
```

The IRS rejects "I just deducted 100%" — it's the most common audit trigger for STR.

### Box 3 — Want the full version?
This cheatsheet covers Schedule E for **one property**. The **Schedule E Workbook (TAX-002)** auto-allocates across multiple properties, handles vacation-home rules, includes a passive-loss tracker, and prints IRS-formatted statements.

**→ Get TAX-002 for $27 at thestrledger.com/schedule-e-workbook**

### Footer
*General educational information only — not tax advice. Cross-reference [IRS Publication 527](https://www.irs.gov/pub/irs-pdf/p527.pdf). Confirm with a licensed CPA before filing.*

*© 2026 The STR Ledger · hello@thestrledger.com*

---

## Vista Create build checklist

- [ ] Brand Kit imported (navy + parchment + accent — see `brand/brand-decisions.md`)
- [ ] Page 1 — table layout, monospace numbers in left column, body text Inter, headers Cormorant
- [ ] Page 2 — 3 decision boxes with rule lines between them, CTA block at bottom
- [ ] Disclaimer footer on both pages, 8pt
- [ ] QR code on Page 2 CTA → `https://thestrledger.com/schedule-e-workbook`
- [ ] Export as PDF (Print, high quality) + sRGB digital variant
- [ ] File size target: under 1.5 MB

## Mini-magnet → product conversion target

- Opt-in CVR target: 35%+ (mid-tax-season visitors are warm)
- Upsell CTR to TAX-002 in nurture sequence: 8%+
- Sequence: `nurture-hero-magnet` (4 emails over 7 days; email 3 pitches TAX-002 specifically)
