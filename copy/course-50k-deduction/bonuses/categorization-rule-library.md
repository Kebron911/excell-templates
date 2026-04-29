# Bonus — The Categorization Rule Library v1

**Format:** Excel rule table embedded in TAX-002 / TAX-004 + this design spec
**Course module:** Module 2 (Lesson 2.3)
**Use case:** Auto-categorize 85% of CSV-imported transactions to Schedule E lines

> **The seven-minute tax tab works because 85% of transactions categorize themselves before you sit down.** The rule library is the engine. This file specs the rules that ship with the course.

---

## How the rule library works

When a CSV is pasted into the workbook's Import tab, each transaction is tested against the rule library top-to-bottom. The first matching rule fires; later rules are skipped for that transaction. Unmatched transactions land in the Review queue for manual categorization.

```
CSV row → Test rule 1 → match? → tag with Schedule E line + memo
                                  └── stop
              ↓ no match
            Test rule 2 → match? → tag
                                  └── stop
              ↓ no match
            ...
            Test rule N → no match → Review queue
```

**Match logic:** case-insensitive substring match against the transaction's vendor name (column B in standard CSV exports). Multi-condition matches use Excel's `AND()` / `OR()` against vendor + amount + memo fields.

**Override:** the user can override any rule's auto-categorization on a per-transaction basis. Overrides do not change the rule library; they only change that one transaction.

---

## Rule library structure

Each rule is a row in a dedicated `Rules` tab:

| Column | Field | Example |
|---|---|---|
| A | Rule # | 042 |
| B | Match type | `vendor_contains` / `vendor_equals` / `vendor_and_amount` |
| C | Match value | `airbnb` |
| D | Schedule E line | `19` |
| E | Workbook category | `Platform Fees` |
| F | Notes column auto-fill | `Airbnb host service fees` |
| G | Confidence | `high` / `medium` / `low` |
| H | Last updated | `2026-04-28` |

**Confidence levels:**
- **High** — the vendor exists for one purpose only (e.g., a cleaner you only pay for cleaning). Auto-applies, never queues for review.
- **Medium** — the vendor is usually but not always the same category (e.g., Home Depot — usually repairs, sometimes capital). Auto-applies but flags any transaction over $1,000 for review.
- **Low** — the vendor is genuinely mixed (e.g., Amazon). Always queues for review even if matched.

---

## Schedule E line reference (used in column D)

| Line # | Schedule E label | Common categories |
|---|---|---|
| 3 | Rents received | Gross rental income |
| 5 | Advertising | Listing photography, Pinterest ads, marketing |
| 6 | Auto and travel | Mileage, rental cars, airfare on property visits |
| 7 | Cleaning and maintenance | Cleaner pay, lawn, snow removal, pool service |
| 8 | Commissions | Co-host commissions, agent fees |
| 9 | Insurance | Property insurance, umbrella allocation |
| 10 | Legal and professional | CPA, EA, attorney, bookkeeper |
| 11 | Management fees | Property manager fees |
| 12 | Mortgage interest | From Form 1098 |
| 13 | Other interest | HELOC interest if rental-related |
| 14 | Repairs | Routine repairs, like-kind component replacements |
| 15 | Supplies | Cleaning supplies, paper goods, light bulbs |
| 16 | Taxes | Property tax, lodging tax (if not pass-through) |
| 17 | Utilities | Electric, gas, water, internet, cable |
| 18 | Depreciation | From Form 4562 |
| 19 | Other | Platform fees, software, education, misc. §162 |

---

## The starter rule library (60 rules)

Organized by category. Confidence shown as H/M/L.

### Platform fees (line 19)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 001 | vendor_contains | `airbnb` | Platform Fees | H |
| 002 | vendor_contains | `vrbo` | Platform Fees | H |
| 003 | vendor_contains | `booking.com` | Platform Fees | H |
| 004 | vendor_contains | `expedia` | Platform Fees | H |
| 005 | vendor_contains | `furnishedfinder` | Platform Fees | H |
| 006 | vendor_contains | `stripe` | Payment Processing | M |
| 007 | vendor_contains | `square` | Payment Processing | M |
| 008 | vendor_contains | `paypal` | Payment Processing | L |

### Software & SaaS (line 19)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 009 | vendor_contains | `pricelabs` | Software | H |
| 010 | vendor_contains | `wheelhouse` | Software | H |
| 011 | vendor_contains | `beyond pricing` | Software | H |
| 012 | vendor_contains | `hospitable` | Software | H |
| 013 | vendor_contains | `hostfully` | Software | H |
| 014 | vendor_contains | `guesty` | Software | H |
| 015 | vendor_contains | `turno` | Software | H |
| 016 | vendor_contains | `breezeway` | Software | H |
| 017 | vendor_contains | `igms` | Software | H |
| 018 | vendor_contains | `dropbox` | Software | M |
| 019 | vendor_contains | `google workspace` | Software | M |
| 020 | vendor_contains | `microsoft 365` | Software | M |

### Utilities (line 17)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 021 | vendor_contains | `[utility name 1]` *(host-customized)* | Utilities — Electric | H |
| 022 | vendor_contains | `[gas company]` *(host-customized)* | Utilities — Gas | H |
| 023 | vendor_contains | `[water utility]` *(host-customized)* | Utilities — Water | H |
| 024 | vendor_contains | `xfinity` | Utilities — Internet | H |
| 025 | vendor_contains | `comcast` | Utilities — Internet | H |
| 026 | vendor_contains | `at&t` | Utilities — Internet | M |
| 027 | vendor_contains | `verizon` | Utilities — Internet | M |
| 028 | vendor_contains | `spectrum` | Utilities — Internet | H |
| 029 | vendor_contains | `t-mobile home` | Utilities — Internet | H |
| 030 | vendor_contains | `[trash service]` *(host-customized)* | Utilities — Trash | H |

### Cleaning & maintenance (line 7)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 031 | vendor_equals | `[cleaner name 1]` *(host-customized)* | Cleaning | H |
| 032 | vendor_contains | `truegreen` | Lawn & Landscape | H |
| 033 | vendor_contains | `terminix` | Pest Control | H |
| 034 | vendor_contains | `orkin` | Pest Control | H |
| 035 | vendor_contains | `leslie's` | Pool Supplies | H |
| 036 | vendor_contains | `pinch a penny` | Pool Service | H |

### Repairs & supplies (lines 14, 15, 17)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 037 | vendor_and_amount | `home depot` AND amount < $500 | Repairs | M |
| 038 | vendor_and_amount | `home depot` AND amount >= $500 | Repairs — REVIEW BAR | L |
| 039 | vendor_and_amount | `lowes` AND amount < $500 | Repairs | M |
| 040 | vendor_and_amount | `lowes` AND amount >= $500 | Repairs — REVIEW BAR | L |
| 041 | vendor_contains | `ace hardware` | Repairs | M |
| 042 | vendor_contains | `menards` | Repairs | M |
| 043 | vendor_contains | `ferguson` | Repairs — Plumbing | M |
| 044 | vendor_contains | `walmart` | Supplies | L |
| 045 | vendor_contains | `target` | Supplies | L |
| 046 | vendor_contains | `costco` | Supplies — REVIEW SPLIT | L |
| 047 | vendor_contains | `sam's club` | Supplies — REVIEW SPLIT | L |
| 048 | vendor_contains | `amazon` | REVIEW (mixed-use) | L |

### Insurance (line 9)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 049 | vendor_contains | `proper insurance` | Insurance — STR Specialty | H |
| 050 | vendor_contains | `obie` | Insurance — STR Specialty | H |
| 051 | vendor_contains | `[home insurance carrier]` *(host-customized)* | Insurance — Property | H |

### Mortgage / property tax (lines 12, 16)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 052 | vendor_contains | `[mortgage servicer]` *(host-customized)* | Mortgage Interest — REVIEW (escrow split) | M |
| 053 | vendor_contains | `[county treasurer]` *(host-customized)* | Property Tax | H |

### Banking & finance (line 19)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 054 | vendor_contains | `monthly maintenance fee` | Bank Fees | H |
| 055 | vendor_contains | `wire transfer fee` | Bank Fees | H |
| 056 | vendor_contains | `nsf fee` | Bank Fees | H |

### Marketing & advertising (line 5)

| # | Match | Vendor pattern | Cat | Conf |
|---|---|---|---|---|
| 057 | vendor_contains | `pinterest` | Marketing | H |
| 058 | vendor_contains | `meta` | Marketing | M |
| 059 | vendor_contains | `google ads` | Marketing | H |
| 060 | vendor_contains | `canva` | Marketing | M |

---

## Host-customized rules

Of the 60 starter rules, ~12 are placeholder rules requiring host customization:

- Specific utility company names (electric, gas, water — vary by city)
- Specific cleaner names
- Specific contractor names (handyman, plumber, electrician)
- Mortgage servicer
- County treasurer name
- Home insurance carrier

The Excel rule library includes a "Host Customization" tab where these are filled in once at setup. The customization persists across all properties in the same workbook.

---

## Mixed-use rules — special handling

Some vendors are *always* mixed-use (Amazon, Costco, Sam's Club). These rules don't auto-categorize. They route to the Review queue with a "split-receipt" flag, prompting the host to allocate at line-item level (see Worked-Example #4 and #15).

The Excel template provides a split-receipt entry form:

```
TRANSACTION: Amazon $185.42 — 2026-03-14
  ────────────────────────────────────────
  Item                          Amount    Category        Allocation
  Echo Dot                      $45.00    Supplies        100% rental
  Welcome basket snacks         $35.00    Marketing       100% rental
  Personal novel                $18.00    —               0% (drop)
  Batteries                     $12.00    Supplies        50% rental
  Headphone case                $75.00    —               0% (drop)
  Sales tax & shipping          $0.42     [pro-rated]     —
  ────────────────────────────────────────
  Deducted total:               ~$86.21
  Personal total:               ~$99.21
```

The Review queue prompts for split allocation when a transaction matches a mixed-use rule.

---

## Confidence-based behavior

| Confidence | Behavior |
|---|---|
| **High** | Auto-categorize. No user prompt. Show in the import summary as "auto-applied." |
| **Medium** | Auto-categorize. Prompt for review at quarter-end (one batched review of all medium-confidence categorizations). |
| **Low / Mixed** | Route to Review queue. User must resolve before workbook closes the import. |

The medium-confidence batched review takes 60–90 seconds at quarter-end and catches the small set of legitimately mis-categorized transactions.

---

## Updating the library

The rule library improves with use. Two update mechanisms:

### 1. User-additive rules

When a user manually categorizes a Review-queue transaction, the workbook offers: *"Add this vendor to the rule library?"*

If yes, a new rule is appended with the user-chosen category. Default confidence is "medium" — the user can promote to "high" after observing the pattern across 3+ transactions.

### 2. Course-distributed updates

Each January, alongside the "What Changed" annual update video, the course ships an updated rule library reflecting:

- New SaaS vendors added to the STR ecosystem
- Vendor name changes (rebrands, acquisitions)
- Newly-mixed vendors (e.g., a vendor that started selling consumer goods alongside business goods)
- Retired rules for vendors that no longer exist

Users import the update; their host-customized rules are preserved.

---

## Output: what the import summary looks like

After a CSV paste, the workbook displays:

```
═══════════════════════════════════════════════════════════════
              IMPORT SUMMARY — Q1 2026 — Cabin A
═══════════════════════════════════════════════════════════════

  Total transactions imported:           42

  Auto-categorized (high confidence):    31  (74%)
  Auto-categorized (medium confidence):   5  (12%)
  Routed to Review queue:                 6  (14%)
                                        ────
                                          42

  Review queue items:
  ─────────────────────────────────────────────────────────────
  03/02   AMAZON.COM*KE2Y34J          $42.91   [split-receipt]
  03/14   AMAZON.COM*MX9PN02          $185.42  [split-receipt]
  03/22   COSTCO WHSE #0414           $87.16   [mixed-use]
  03/28   HOME DEPOT #6711            $1,140.18 [BAR test review]
  03/29   UNKNOWN VENDOR              $52.00   [no rule match]
  03/30   AMAZON.COM*UB7WM23          $19.99   [split-receipt]

  Estimated time to clear Review queue:   ~3 minutes
═══════════════════════════════════════════════════════════════
```

That 14% Review queue is the "1 minute 30 seconds" of manual categorization in Amanda's seven-minute tab.

---

## Build sequence (for the LMS team)

| Step | Output |
|---|---|
| 1 | Excel `Rules` tab built with 60 starter rules + customization tab |
| 2 | Import-tab macro that applies rules in order, populates Review queue |
| 3 | Split-receipt entry form |
| 4 | Import-summary dashboard |
| 5 | "Add to library?" prompt on manual categorization |
| 6 | Library export/import (for January updates) |
| 7 | User documentation: 3-page PDF + 8-min video |

---

*Last reviewed: 2026-04-28. Vendor lists evolve. The library is a starting point, not a final list. Always review high-value transactions ($1,000+) regardless of confidence level.*
