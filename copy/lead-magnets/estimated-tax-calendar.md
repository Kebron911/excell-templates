# Estimated Tax Due-Date Reminder Calendar — Lead Magnet (Blog 08 tie-in)

**SKU code:** `LM-008`
**Format:** PDF (printable wall calendar, 2 pages) + .ics calendar import file
**Funnel role:** Mini-magnet for blog post #8 (`airbnb-quarterly-taxes`). Email-gated at `/free/tax-calendar`. Tag at capture: `lead-magnet:tax-calendar`.
**Build tool:** Vista Create for PDF + simple .ics template
**Save locations:**
- `templates/_delivery/_shared/estimated-tax-calendar.pdf`
- `templates/_delivery/_shared/estimated-tax-calendar.ics`
**Companion product:** Quarterly Tax Estimate Calculator (TAX-005, $17 Etsy / $27 Gumroad)

---

## Why this magnet exists

STR hosts are self-employed for tax purposes. The IRS requires quarterly estimated tax payments (Form 1040-ES), and skipping them = underpayment penalty (currently ~8% annualized — moves with federal short-term rate). Most hosts miss Q1 because their previous W-2 employer was withholding for them. By the time their CPA mentions it in February, they owe penalty on the entire year.

This calendar puts the dates on their fridge AND on their phone. Low-cost, high-utility, evergreen.

---

## PDF — Page 1 (the visual calendar)

### Header
**2026 Tax Due-Date Calendar for Airbnb / STR Hosts** · *The STR Ledger*

### Single-page calendar layout

Show all 12 months in a 3×4 grid (mini-calendars), with critical dates highlighted in **navy**:

| Date | Why it matters |
|------|----------------|
| **Jan 15, 2026** | Q4 2025 estimated tax payment due (Form 1040-ES) |
| **Jan 31, 2026** | 1099-NEC forms due to contractors AND to IRS |
| **Jan 31, 2026** | W-2 forms due if you have any employees |
| **Mar 15, 2026** | S-corp / Partnership return deadline (if structured as such) |
| **Apr 15, 2026** | **Individual 1040 return + Q1 2026 estimated payment due** ⚠️ |
| **Jun 16, 2026** | Q2 2026 estimated tax payment due |
| **Sep 15, 2026** | Q3 2026 estimated tax payment due AND extended S-corp/Partnership return |
| **Oct 15, 2026** | Extended individual 1040 return |
| **Jan 15, 2027** | Q4 2026 estimated tax payment due |

### Visual treatment
- Big calendar grid with the 9 dates above in navy chips overlaid
- Color legend at top: Navy = estimated tax | Amber = 1099 filings | Burgundy = return deadlines
- Bottom strip: "Set the .ics import on your phone — link in companion email"

---

## PDF — Page 2 (decision rules + FAQ)

### Header
**Do you owe estimated taxes? (Quick check)**

### Decision rules

> ✅ **You probably owe estimated quarterly taxes if:**
> - You expect to owe $1,000+ in tax this year, AND
> - You don't have a day job withholding enough W-2 tax to cover it, AND
> - Your STR is net-profitable (or breakeven with phantom income)

> 🤷 **You probably DON'T need to file estimated taxes if:**
> - Your W-2 day job is over-withholding (you can bump it up via W-4 instead — simpler), OR
> - Your STR is in a depreciation-loss position that fully offsets income, OR
> - This is your first STR year and you reasonably expect a loss

### Safe-harbor rules

> **The safe harbor:** Pay either (whichever is smaller):
> 1. **90% of current year's tax**, OR
> 2. **100% of last year's tax** (110% if AGI > $150K)
>
> If you hit safe harbor → no penalty even if you owe more at year end.

### How much per quarter?

Rough rule for a profitable STR:
```
Quarterly payment ≈ (Net STR income × estimated tax rate) ÷ 4
```

Where estimated tax rate = your federal marginal rate + state income tax + 15.3% self-employment IF Schedule C (rare for STR).

**Example:** $40K net STR income, 22% federal bracket, 5% state, Schedule E (no SE tax):
- Annual tax: $40K × 27% = $10,800
- Quarterly: $10,800 ÷ 4 = **$2,700 per quarter**

### How to actually pay

1. **IRS Direct Pay** (free, ACH): https://www.irs.gov/payments/direct-pay
2. **EFTPS** (free, requires enrollment): https://www.eftps.gov
3. **State**: each state has its own — usually a "make a payment" link on the state revenue site

Do NOT mail paper checks. They get lost; you eat penalties.

### CTA block
**Get the full Quarterly Tax Estimate Calculator →** thestrledger.com/quarterly-tax-calculator

TAX-005 auto-calculates your safe-harbor payment, drops it into a one-page voucher, sends Apple Wallet reminders. $17.

### Footer
*General educational information only. Cross-reference [IRS Form 1040-ES instructions](https://www.irs.gov/forms-pubs/about-form-1040-es). Tax dates can shift if they fall on weekends/holidays — verify yearly. Confirm with a licensed CPA.*

*© 2026 The STR Ledger · hello@thestrledger.com*

---

## .ics calendar file structure

Single .ics file with 9 events for 2026 (covering all dates above):

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The STR Ledger//Tax Calendar 2026//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH

BEGIN:VEVENT
UID:str-tax-2026-q4-2025@thestrledger.com
DTSTART;VALUE=DATE:20260115
DTEND;VALUE=DATE:20260116
SUMMARY:Q4 2025 Estimated Tax Payment Due (Form 1040-ES)
DESCRIPTION:Pay via IRS Direct Pay (free): https://www.irs.gov/payments/direct-pay
BEGIN:VALARM
TRIGGER:-P3D
ACTION:DISPLAY
DESCRIPTION:Q4 estimated tax due in 3 days
END:VALARM
END:VEVENT

BEGIN:VEVENT
UID:str-tax-2026-1099-deadline@thestrledger.com
DTSTART;VALUE=DATE:20260131
DTEND;VALUE=DATE:20260201
SUMMARY:1099-NEC forms due to contractors AND IRS
DESCRIPTION:If you paid any single contractor $600+ in cash/check/Zelle/ACH, you owe a 1099-NEC. Use The STR Ledger 1099 Tracker.
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:1099-NEC deadline in 1 week
END:VALARM
END:VEVENT

# ... [7 more events for the remaining dates above, same shape]

END:VCALENDAR
```

Each event has a 3-day-prior alarm. User imports once into Google Calendar / Apple Calendar / Outlook → reminders fire automatically forever (assuming they extend the calendar annually).

---

## Build checklist

- [ ] PDF Page 1: 12-month mini-calendar grid, navy chips for tax dates
- [ ] PDF Page 2: decision rules + FAQ formatted clean, Cormorant + Inter
- [ ] PDF: print-quality, A4 + Letter variants
- [ ] .ics file: 9 events, 3-day pre-alarm on each, test imports cleanly to Google/Apple/Outlook
- [ ] QR codes on PDF Page 2 → `thestrledger.com/quarterly-tax-calculator`
- [ ] Annual maintenance: regenerate calendar each November for the following tax year (one of the only mini-magnets that needs annual refresh — note in runbook)
- [ ] W30 annual-update sequence references this file so subscribers get the new year's calendar automatically

## Mini-magnet → product conversion target

- Opt-in CVR target: 35%+ (high-utility, low-friction — date reminders are universal)
- Upsell CTR to TAX-005 in nurture sequence: 9%+
- Best send timing: December 15 broadcast to existing list + perpetual organic at /free/tax-calendar
- Re-promote: 7 days before each quarterly deadline (Jan 8, Apr 8, Jun 9, Sep 8)
