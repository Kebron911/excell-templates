# 1099-NEC Trigger Threshold Calculator — Lead Magnet (Blog 04 tie-in)

**SKU code:** `LM-005`
**Format:** Excel workbook (1 tab) + PDF print companion (1 page)
**Funnel role:** Mini-magnet for blog post #4 (`airbnb-1099-nec`). Email-gated at `/free/1099-trigger-calculator`. Tag at capture: `lead-magnet:1099-trigger`.
**Build tool:** Excel + Vista Create
**Save locations:**
- `templates/_delivery/_shared/1099-trigger-calculator.xlsx`
- `templates/_delivery/_shared/1099-trigger-calculator.pdf`
**Companion product:** 1099-NEC Vendor Tracker (TAX-003, $17 Etsy / $27 Gumroad)

---

## Why this magnet exists

STR hosts have lots of contractors — cleaners, handymen, landscapers, photographers, co-hosts. Each one paid >$600/yr triggers a 1099-NEC filing requirement. Miss the filing → $290 penalty per missed form (up to $3M/yr aggregate). Most hosts don't know they owe these until their CPA mentions it in February, three weeks before the deadline.

This calculator gives them a vendor-by-vendor view: which vendors crossed the threshold, what's due, by when.

---

## Excel structure

### Single tab — "Vendor Tracker (Year)"

Columns:

| Col | Header | Purpose |
|-----|--------|---------|
| A | Vendor name | Display |
| B | Vendor type | Dropdown: Cleaner / Handyman / Landscaper / Photographer / Co-host / Other contractor |
| C | Payment method | Dropdown: Cash / Check / ACH / Zelle / Venmo (personal) / PayPal Friends / **Credit card** / **PayPal Goods** / **Stripe** / Other |
| D | Total paid YTD | Sum entered |
| E | Threshold | Hardcoded $600 |
| F | Crosses threshold? | `=IF(D>=E,"YES","No")` highlighted red on YES |
| G | 1099 required? | Formula — see logic below |
| H | Have W-9 on file? | Dropdown: Yes / No |
| I | Vendor's EIN/SSN | Captured from W-9 |
| J | Action needed | Formula — see logic below |
| K | Filing deadline | Hardcoded — Jan 31 of following year |

### Logic for Column G (1099 required?)

```
=IF(
  AND(
    D>=600,
    OR(C="Cash",C="Check",C="ACH",C="Zelle",C="Venmo (personal)","PayPal Friends"),
    B<>"Corporation"
  ),
  "YES — file 1099-NEC",
  IF(
    OR(C="Credit card",C="PayPal Goods",C="Stripe"),
    "NO — payment processor files 1099-K",
    "Below threshold"
  )
)
```

### Logic for Column J (Action needed)

```
=IF(G="YES — file 1099-NEC",
  IF(H="No",
    "1. Request W-9 from vendor (use included template)",
    "2. File 1099-NEC by Jan 31; copy to vendor by Jan 31"
  ),
  IF(G="NO — payment processor files 1099-K",
    "No action — processor handles it",
    ""
  )
)
```

### Critical decision banner (top of tab)

> 💡 **The payment-method trap:** If you pay a contractor via **credit card, PayPal Goods/Services, or Stripe**, you do **NOT** owe a 1099-NEC. The payment processor files a 1099-K on the vendor's behalf. But Zelle, Venmo (personal), Cash App personal, checks, and cash **all require 1099-NEC** if total ≥ $600.
>
> Smart move: route all contractor payments through credit card or ACH-via-platform to eliminate 1099 filing burden entirely.

### Pre-filled example rows (3)

| Sarah's Cleaners | Cleaner | Zelle | $4,200 | $600 | **YES** | YES — file 1099-NEC | Yes | EIN 87-... | File 1099-NEC by Jan 31 | Jan 31 |
| Mike Handyman | Handyman | Credit card | $1,800 | $600 | YES | NO — processor files 1099-K | N/A | — | No action | — |
| Joe's Landscaping LLC | Landscaper | Check | $720 | $600 | YES | YES — file 1099-NEC | No | — | Request W-9 first | Jan 31 |

### Included on tab — W-9 request email template

> *Subject:* Quick form request — for your records and mine
>
> Hi {{ Vendor first name }},
>
> For year-end tax purposes I need to gather a W-9 from all my service vendors. Could you fill out the attached and send back? It takes about 90 seconds — just your name, business name (if any), tax classification, and EIN or SSN.
>
> W-9 form (IRS-fillable PDF): https://www.irs.gov/pub/irs-pdf/fw9.pdf
>
> Thanks!
> {{ Your first name }}

---

## PDF Print Companion (1 page)

### Header
**1099-NEC Quick Decision Tree for STR Hosts** · *2026 Tax Year · The STR Ledger*

### Body — decision flowchart

```
                  ┌──────────────────────────────┐
                  │ Did you pay this contractor  │
                  │   $600+ this year?           │
                  └────────────┬─────────────────┘
                               │
                  ┌────────────┴─────────────────┐
                  │ NO                       YES │
                  ▼                              ▼
            ┌─────────────┐         ┌──────────────────────┐
            │ No 1099      │        │ Did you pay via      │
            │ required.    │        │ credit card, Stripe, │
            └─────────────┘         │ or PayPal Goods?     │
                                    └──────┬───────────────┘
                                           │
                                ┌──────────┴──────────┐
                                │ YES             NO  │
                                ▼                     ▼
                       ┌─────────────────┐  ┌──────────────────────┐
                       │ Processor files │  │ Is the vendor a      │
                       │ 1099-K — no     │  │ C-corp or S-corp?    │
                       │ action needed.  │  └──────┬───────────────┘
                       └─────────────────┘         │
                                          ┌────────┴──────────┐
                                          │ YES         NO    │
                                          ▼                   ▼
                                  ┌────────────────┐  ┌────────────────────┐
                                  │ No 1099        │  │ FILE 1099-NEC      │
                                  │ required —     │  │ by Jan 31. Get     │
                                  │ corp exempt.   │  │ W-9 first.         │
                                  └────────────────┘  └────────────────────┘
```

### CTA block
**Get the full TAX-003 Vendor Tracker for $17 →** thestrledger.com/1099-tracker

Auto-imports payments from QBO/Wave, exports IRS-ready 1099-NEC PDFs, sends W-9 requests in bulk.

### Footer
*General educational information only. Cross-reference [IRS Pub 15-A](https://www.irs.gov/pub/irs-pdf/p15a.pdf) and Form 1099-NEC instructions. Penalty for late or missed filing: $60–$290 per form. Confirm with a CPA.*

---

## Build checklist

- [ ] Excel: data validation dropdowns on B, C, H
- [ ] Excel: conditional formatting on F (red on YES)
- [ ] Excel: formulas tested for all 9 payment-method combinations
- [ ] PDF: ASCII flowchart rendered as clean Vista Create boxes + connectors
- [ ] QR code on PDF → `thestrledger.com/1099-tracker`
- [ ] Test: pay $620 via Zelle to "Sarah's Cleaners" → Column G must say "YES — file 1099-NEC"
- [ ] Test: pay $620 via credit card to "Mike Handyman" → Column G must say "NO — payment processor"

## Mini-magnet → product conversion target

- Opt-in CVR target: 30%+ (audit-anxiety topic = warm intent)
- Upsell CTR to TAX-003 in nurture sequence: 10%+
- Best send time for nurture email 1: January 15 (peak 1099-anxiety window)
