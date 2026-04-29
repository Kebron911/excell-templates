# Bonus B10 — The Decision-Tree Pack

**Format:** 6 interactive PDFs + this design spec
**Course module:** Cross-cutting (referenced throughout)
**Use case:** Six high-judgment decisions, reduced to flowcharts

> **A flowchart is a frozen judgment.** The book teaches the rules. The course teaches the judgment. The decision trees freeze the judgment so you can re-use it without re-thinking it every time.

---

## Pack contents

| # | Tree | Module ref | Format |
|---|---|---|---|
| 1 | Schedule E vs. Schedule C | 1.1 | 4-page PDF |
| 2 | Repair vs. Improvement (the BAR test) | 3.3 | 4-page PDF |
| 3 | §179 vs. Bonus vs. Capitalize | 3.5 | 4-page PDF |
| 4 | When to Cost-Segregate | 4.1 | 4-page PDF |
| 5 | When to Elect §280A(g) Augusta | 4.4 | 3-page PDF |
| 6 | When to Incorporate (LLC vs. S-corp vs. Sole-prop) | 7.2 | 4-page PDF |

Each PDF follows the same layout: cover, decision tree on a single landscape spread, reference card with code citations and worked examples, troubleshooting page.

---

## Brand spec (applies to all 6)

| Element | Value |
|---|---|
| Page size | 8.5×11 letter, landscape for the tree spread, portrait for cover and reference |
| Color palette | Harbor Navy `#12304E` (primary nodes), Parchment `#F6EFE2` (background), Muted Gold `#C9A24B` (terminal nodes / accents), Clay Rose `#B5725E` (warning callouts) |
| Display type | Cormorant Garamond Medium (titles, headers) |
| Body type | Inter 400 (decision-node text, reference body) |
| Mono | JetBrains Mono (code citations, variable values) |
| Logo | Monogram corner watermark, top-right |
| Footer | "*The STR Ledger — 47-Deduction Operator — Decision Tree #X*" + page number |
| Disclaimer | Last page of every PDF, italic, Graphite at 70% |

Build in Vista Create. Export as interactive PDF (clickable nodes link to the relevant lesson timestamp in the LMS).

---

## Tree 1 — Schedule E vs. Schedule C

### Cover

```
The STR Ledger — Decision Tree 01

Schedule E or Schedule C.
The choice that changes everything.

Companion to Module 1.1
```

### The tree

```
                    ┌─────────────────────────────────┐
                    │  START: Compute average rental  │
                    │  period across all properties.  │
                    │  total nights ÷ total bookings  │
                    └────────────────┬────────────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
        ┌──────────────┐    ┌──────────────┐     ┌──────────────┐
        │  ≤ 7 days    │    │  8–30 days   │     │  31+ days    │
        └──────┬───────┘    └──────┬───────┘     └──────┬───────┘
               │                   │                    │
               │                   ▼                    ▼
               │           ┌─────────────────┐    ┌──────────────┐
               │           │ Substantial     │    │  Schedule E  │
               │           │ services?       │    │  ◆ Terminal  │
               │           └────────┬────────┘    └──────────────┘
               │                    │
               │       ┌────────────┴────────────┐
               │       │                         │
               │       ▼                         ▼
               │   ┌──────┐                  ┌──────┐
               │   │ Yes  │                  │ No   │
               │   └──┬───┘                  └──┬───┘
               │      │                         │
               │      ▼                         ▼
               │  ┌─────────────┐          ┌──────────────┐
               │  │ Schedule C  │          │  Schedule E  │
               │  │  ◆ Terminal │          │  ◆ Terminal  │
               │  └─────────────┘          └──────────────┘
               │
               ▼
        ┌─────────────────┐
        │ Substantial     │
        │ services?       │
        └────────┬────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
   ┌───────┐           ┌───────┐
   │ Yes   │           │ No    │
   └───┬───┘           └───┬───┘
       │                   │
       ▼                   ▼
   ┌──────────────┐   ┌──────────────┐
   │ Schedule C   │   │ Schedule E   │
   │ + SE tax     │   │ + STR        │
   │   ◆ Terminal │   │   loophole   │
   │              │   │   eligible*  │
   └──────────────┘   │   ◆ Terminal │
                      └──────────────┘
```

**Sidebar definitions on the same spread:**

> **Substantial services** — services provided *during* the guest's stay that go beyond what a typical landlord provides. Daily housekeeping during stay. Meals. Concierge. Tour booking. *Not:* turnover cleaning, welcome basket, mid-stay messaging support.
>
> **Average rental period** — total rental nights divided by total bookings, computed across all properties (or per property, depending on aggregation election).
>
> **STR loophole** — when average rental period ≤ 7 days *and* host materially participates, rental losses are nonpassive under §469(c)(7) interaction. Schedule E reporting; deductible against other income.

### Reference card

```
CODE CITATIONS

§1.469-1T(e)(3)(ii)        — Average rental period & substantial services
§1.469-1T(e)(3)(ii)(A)     — 7-day rule
§1.469-1T(e)(3)(ii)(B)     — 30-day rule with substantial services
§469(c)(7)                  — Real estate professional + interaction
§1402(a)(1)                 — Self-employment tax exemption for rentals

WORKED EXAMPLES

Sarah's portfolio: 3 cabins, 4.0-night avg, no in-stay services.
  → Schedule E, STR loophole eligible.

Marcus's bed-and-breakfast: 8 rooms, 2.5-night avg, daily housekeeping
+ breakfast served each morning.
  → Schedule C, SE tax applies.

Renee's mid-term rental: 60-night avg, no services.
  → Schedule E.

WHEN TO ESCALATE TO A CPA

- Mixed average rental periods across properties (some ≤7, some >7)
- Bed-and-breakfast or boutique-inn-style operation
- Any year with a major mid-year operational change
```

---

## Tree 2 — Repair vs. Improvement (the BAR test)

### The tree

```
              ┌───────────────────────────────────────────┐
              │ START: Identify the line item in question │
              │ Vendor invoice, receipt, contractor bill  │
              └─────────────────────┬─────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │ Is the item under $2,500 per invoice?       │
              │ (de-minimis safe harbor election active?)   │
              └─────────────────────┬───────────────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                │ YES                                   │ NO
                ▼                                       ▼
       ┌──────────────────┐               ┌──────────────────────────┐
       │ Current expense  │               │ Run the BAR test         │
       │ §1.263(a)-1(f)   │               │ §1.263(a)-3              │
       │ ◆ Terminal       │               └──────────────┬───────────┘
       └──────────────────┘                              │
                                                         ▼
                                          ┌─────────────────────────┐
                                          │ Is it a BETTERMENT?     │
                                          │ Improves capacity,      │
                                          │ quality, productivity,  │
                                          │ efficiency, output      │
                                          └──────────┬──────────────┘
                                                     │
                                       ┌─────────────┴─────────────┐
                                       │ YES                       │ NO
                                       ▼                           ▼
                              ┌─────────────────┐    ┌──────────────────────────┐
                              │  Capitalize     │    │ Is it an ADAPTATION?     │
                              │  ◆ Terminal     │    │ Adapts to new use        │
                              └─────────────────┘    └──────────┬───────────────┘
                                                                │
                                                  ┌─────────────┴─────────────┐
                                                  │ YES                       │ NO
                                                  ▼                           ▼
                                         ┌─────────────────┐    ┌──────────────────────┐
                                         │  Capitalize     │    │ Is it a RESTORATION? │
                                         │  ◆ Terminal     │    │ Replace major        │
                                         └─────────────────┘    │ component or         │
                                                                │ structural part      │
                                                                └─────────┬────────────┘
                                                                          │
                                                            ┌─────────────┴────────────┐
                                                            │ YES                      │ NO
                                                            ▼                          ▼
                                                   ┌─────────────────┐   ┌─────────────────────┐
                                                   │  Capitalize     │   │ Routine maintenance │
                                                   │  ◆ Terminal     │   │ safe harbor?        │
                                                   └─────────────────┘   │ §1.263(a)-3(i)      │
                                                                         └──────────┬──────────┘
                                                                                    │
                                                                       ┌────────────┴────────────┐
                                                                       │ YES                     │ NO
                                                                       ▼                         ▼
                                                              ┌──────────────────┐   ┌──────────────────┐
                                                              │ Current expense  │   │ Current expense  │
                                                              │ ◆ Terminal       │   │ (default repair) │
                                                              └──────────────────┘   │ ◆ Terminal       │
                                                                                     └──────────────────┘
```

### Reference card

```
THE BAR TEST — definitions

BETTERMENT  — physical enlargement, materially-improved capacity,
              materially-improved quality, materially-increased productivity
ADAPTATION  — adapts the property to a new or different use
RESTORATION — replaces a major component, restores after deterioration to
              like-new, rebuilds after end of class life

ROUTINE MAINTENANCE SAFE HARBOR — §1.263(a)-3(i)
- Activities the taxpayer reasonably expects to perform more than once
  during the property's class life
- Common examples: HVAC service, painting, gutter cleaning,
  pressure washing decks, replacing minor fixtures

DE-MINIMIS SAFE HARBOR — §1.263(a)-1(f)
- Election made on the timely filed return
- $2,500 per invoice (or $5,000 with applicable financial statement)
- Once elected, applies to all qualifying purchases

WORKED EXAMPLES

$340 paint, brushes, drop cloth        → Repair (routine maintenance)
$1,140 dishwasher (failed unit)        → Repair (de-minimis OR no BAR)
$4,800 deck rebuild (full)             → Capitalize (Restoration)
$9,400 HVAC unit replacement           → Capitalize (Restoration)
$220 gutter cleaning                   → Repair (routine maintenance)
$2,140 partial roof repair (2 valleys) → Repair (no major-component test)
$11,200 full roof replacement          → Capitalize (Restoration)
```

---

## Tree 3 — §179 vs. Bonus vs. Capitalize

### The tree

```
                ┌──────────────────────────────────┐
                │ START: The asset has been        │
                │ classified as needing            │
                │ depreciation (BAR test = capex)  │
                └────────────────┬─────────────────┘
                                 │
                                 ▼
                ┌──────────────────────────────────┐
                │ Is the asset's recovery period   │
                │ 20 years or less?                │
                └────────────────┬─────────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │ YES                         │ NO
                  ▼                             ▼
         ┌─────────────────────┐     ┌────────────────────────┐
         │ Eligible for        │     │ Standard MACRS         │
         │ §168(k) bonus       │     │ depreciation only      │
         │ AND §179            │     │ (typically 27.5-year)  │
         └──────────┬──────────┘     │ ◆ Terminal             │
                    │                └────────────────────────┘
                    ▼
         ┌──────────────────────────────────┐
         │ Will §179 expense create or      │
         │ increase a NET LOSS for the year?│
         └────────────────┬─────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │ YES                       │ NO
            ▼                           ▼
   ┌──────────────────┐         ┌──────────────────────────┐
   │ §179 unavailable │         │ §179 election available  │
   │ (income-limited) │         │ Annual cap applies       │
   │ Use §168(k)      │         └──────────┬───────────────┘
   │ bonus instead    │                    │
   └────────┬─────────┘                    ▼
            │                  ┌─────────────────────────────┐
            │                  │ Do you want the deduction   │
            │                  │ year-1 (§179 or bonus) or   │
            │                  │ allocated across class life?│
            │                  └──────────┬──────────────────┘
            │                             │
            │              ┌──────────────┴──────────────┐
            │              │ Year 1                      │ Allocate
            │              ▼                             ▼
            │     ┌─────────────────────────┐  ┌─────────────────┐
            │     │ §179 first (within cap) │  │ Standard MACRS  │
            │     │ then §168(k) bonus on   │  │ depreciation    │
            │     │ remainder               │  │ ◆ Terminal      │
            │     │ ◆ Terminal              │  └─────────────────┘
            │     └─────────────────────────┘
            ▼
   ┌──────────────────────┐
   │ §168(k) bonus only   │
   │ at current % rate    │
   │ ◆ Terminal           │
   └──────────────────────┘
```

### Reference card

```
KEY DIFFERENCES

§179 — Taxpayer election, per-asset
- Annual cap (verify current; well above most STR purchases)
- Cannot create or increase a loss
- Phase-out begins at investment threshold (verify current)
- Must be used in trade or business >50%

§168(k) Bonus — Automatic on eligible property unless elected out
- No cap
- CAN create a loss
- Phase-down rate by year (verify current %)
- Eligible: property with recovery period ≤ 20 years
- For STR: cost-segregated 5-, 7-, 15-year property classes are eligible

ORDER OF OPERATIONS (when both available)

1. §179 first (up to annual cap, subject to income limitation)
2. §168(k) bonus on remaining basis
3. Standard MACRS on what's left

WORKED EXAMPLES

$1,800 mower (5-year property)                   → §179, full $1,800
$112,000 cost-seg reclassed (5/7/15-year)        → §168(k) bonus at current %
$640,000 cabin (27.5-year structure portion)     → Standard MACRS only
$9,400 HVAC on STR with <7-day avg (nonresid.)   → §179 eligible (verify class)
$9,400 HVAC on STR with 14-day avg (resid.)      → 27.5-year only, no §179
```

---

## Tree 4 — When to Cost-Segregate

### The tree

```
                ┌──────────────────────────────────┐
                │ START: A property has been       │
                │ acquired or is being considered  │
                └────────────────┬─────────────────┘
                                 │
                                 ▼
                ┌──────────────────────────────────┐
                │ Is the depreciable basis         │
                │ at least $400,000?               │
                │ (acquisition - land allocation)  │
                └────────────────┬─────────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │ YES                         │ NO
                  ▼                             ▼
         ┌─────────────────────┐     ┌──────────────────────────┐
         │ Engineering study   │     │ Engineering study        │
         │ economically viable │     │ rarely pencils.          │
         │ (≈$1.5K–$5K cost)   │     │ Consider TAX-010         │
         └──────────┬──────────┘     │ DIY workbook for         │
                    │                │ smaller properties.      │
                    │                │ ◆ Terminal               │
                    │                └──────────────────────────┘
                    ▼
         ┌──────────────────────────────────┐
         │ Can you USE the resulting loss?  │
         │ - STR loophole (§469(c)(7))      │
         │ - Real estate professional       │
         │ - Other passive income to offset │
         └────────────────┬─────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │ YES                       │ NO
            ▼                           ▼
   ┌──────────────────────┐   ┌────────────────────────────────┐
   │ Run study; elect     │   │ Loss is suspended (passive     │
   │ §168(k) bonus        │   │ activity rules). Carries fwd.  │
   │ ◆ Terminal           │   │ Cost seg STILL has value but   │
   └──────────────────────┘   │ benefit deferred until passive │
                              │ income or sale.                │
                              │ Decision becomes a discount-   │
                              │ rate question.                 │
                              │ ◆ Terminal — escalate to CPA   │
                              └────────────────────────────────┘
```

### Reference card

```
ECONOMIC TEST

Year-1 acceleration ≈
  (cost-seg reclassified % × depreciable basis) × current bonus rate

Year-1 tax saving ≈
  Year-1 acceleration × marginal tax rate

Study breakeven ≈
  Study cost ÷ marginal tax rate = required acceleration to break even

TYPICAL RECLASSIFICATION %

Single-family STR:        15-25% of basis to short-life
Cabin / mountain STR:     20-30% (decks, hot tubs, finishes)
Condo / urban STR:        10-20%
Boutique resort:          25-35%

WHEN COST-SEG DOES NOT PENCIL

- Basis under $400K
- No way to use the loss (no STR loophole, no REP, no passive income)
- Property is on a near-term sale horizon (recapture risk too high)
- §1245 recapture appetite is low (re-classified personal property
  recaptures at ordinary rates on sale)

ESCALATION

Cost-seg with the STR loophole is a CPA conversation, not a DIY decision.
Use TAX-010 to scope the analysis; engage a CPA for the election.
```

---

## Tree 5 — When to Elect §280A(g) Augusta

### The tree

```
              ┌──────────────────────────────────┐
              │ START: Considering renting       │
              │ personal residence to your       │
              │ business entity                  │
              └────────────────┬─────────────────┘
                               │
                               ▼
              ┌──────────────────────────────────┐
              │ Do you have an entity            │
              │ (S-corp, C-corp, partnership)    │
              │ that could be the renter?        │
              └────────────────┬─────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │ YES                         │ NO
                ▼                             ▼
       ┌──────────────────────┐     ┌──────────────────────────┐
       │ Is the rental for    │     │ §280A(g) requires an     │
       │ legitimate business  │     │ entity-to-homeowner       │
       │ purpose?             │     │ transaction. Sole-prop    │
       │ Board meeting,       │     │ does not qualify.         │
       │ retreat, training    │     │ ◆ Terminal — not eligible │
       └──────────┬───────────┘     └──────────────────────────┘
                  │
       ┌──────────┴──────────┐
       │ YES                 │ NO
       ▼                     ▼
┌──────────────┐    ┌─────────────────────┐
│ Will rental  │    │ Without business    │
│ days be ≤14  │    │ purpose, the rental │
│ for the year?│    │ is at sham-          │
└──────┬───────┘    │ transaction risk.   │
       │            │ ◆ Terminal — do not  │
       │            │   elect             │
   ┌───┴───┐        └─────────────────────┘
   │       │
   ▼       ▼
┌────┐  ┌────┐
│Yes │  │ No │
└─┬──┘  └─┬──┘
  │       │
  ▼       ▼
┌──────┐ ┌─────────────────────────────┐
│Build │ │ Days 15+ become taxable     │
│docs* │ │ rental income; full         │
│Elect │ │ §280A regime applies. Most  │
│§280A │ │ hosts cap at 14 to preserve │
│(g)   │ │ the §280A(g) exclusion.     │
│◆ End │ │ ◆ Terminal                   │
└──────┘ └─────────────────────────────┘

* Documentation = (a) FMV comparable rate analysis,
                  (b) board minutes per rental day,
                  (c) contemporaneous calendar
```

### Reference card

```
§280A(g) IN ONE PARAGRAPH

If you rent your personal residence for fewer than 15 days in a tax year,
the rental income is excluded from your gross income — and the renter (your
business entity) deducts the rent as an ordinary and necessary §162 business
expense. The deduction is taken; the income is not. Net effect: the entity's
income is reduced by the rent without a corresponding inclusion at the
homeowner level.

DOCUMENTATION (all three required)

1. FMV substantiation — survey of 3+ comparable venues at similar capacity,
   date-stamped, with the rate falling in a defensible range.
2. Board minutes — each rental day documented with attendees, agenda,
   and business purpose. Generic minutes don't hold up.
3. Calendar — contemporaneous record of the 14 dates.

WHAT THIS IS NOT

- Not for sole-proprietors. Requires entity-to-homeowner transaction.
- Not for the STR property itself rented to your own entity (that's a
  different §280A analysis with personal-use limitations).
- Not unlimited. 14 days is the absolute cap. Day 15 flips everything.

WHO SHOULD NOT ELECT

- No legitimate business meetings to host
- Cannot establish FMV at a defensible rate
- Cannot or will not maintain board minutes
```

---

## Tree 6 — When to Incorporate (LLC vs. S-corp vs. Sole-prop)

### The tree

```
              ┌──────────────────────────────────┐
              │ START: Currently filing on       │
              │ Schedule E (or Schedule C) as a  │
              │ sole proprietor / personal name. │
              └────────────────┬─────────────────┘
                               │
                               ▼
              ┌──────────────────────────────────┐
              │ Are you filing on Schedule E?    │
              └────────────────┬─────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │ YES                         │ NO (Sched C)
                ▼                             ▼
       ┌──────────────────────┐     ┌──────────────────────────┐
       │ S-corp election does │     │ S-corp election may      │
       │ NOT change SE tax    │     │ reduce SE tax. Worth      │
       │ outcome (already $0). │     │ analyzing if net income  │
       │ Consider LLC for     │     │ ≥ $50K.                  │
       │ liability isolation  │     └──────────────────────────┘
       │ only.                │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────────────────┐
       │ Are properties currently held    │
       │ in your personal name?           │
       └────────────────┬─────────────────┘
                        │
          ┌─────────────┴─────────────┐
          │ YES                       │ NO (already in entity)
          ▼                           ▼
 ┌──────────────────────┐    ┌──────────────────────────────┐
 │ Liability exposure?  │    │ Reassess at 5 properties or  │
 │ — Pool, hot tub      │    │ if liability profile changes │
 │ — High guest volume  │    │ ◆ Terminal                    │
 │ — High-value         │    └──────────────────────────────┘
 │   property           │
 │ — Out-of-state       │
 └──────────┬───────────┘
            │
  ┌─────────┴─────────┐
  │ HIGH              │ LOW
  ▼                   ▼
┌─────────────┐  ┌──────────────────────────┐
│ LLC per     │  │ Defer. Umbrella policy   │
│ property OR │  │ may be sufficient until  │
│ series LLC  │  │ portfolio scale or risk  │
│ ◆ Terminal  │  │ profile changes.         │
└─────────────┘  │ ◆ Terminal               │
                 └──────────────────────────┘
```

### Reference card

```
THE THREE STRUCTURES

SOLE-PROP (default)
- No formation cost
- No liability isolation
- Schedule E or C reporting in personal name
- Right answer for: small portfolios, low-risk properties, early stage

LLC (single-member, disregarded for tax)
- Formation cost: $50–$500 + annual fees
- Liability isolation between business and personal assets
- Tax treatment unchanged (still Schedule E or C)
- Right answer for: liability concerns, multi-property portfolios,
  out-of-state holdings

S-CORP (election on top of LLC or corp)
- Adds payroll administration overhead ($800–$2,000/year)
- Reduces SE tax on Schedule C income (no benefit on Schedule E)
- Reasonable-compensation requirement for owner-employee
- Right answer for: Schedule C STR with net income ≥ $75K,
  hospitality-style operation

WHEN NOT TO INCORPORATE

- Net income under $50K (entity overhead exceeds tax savings)
- Entirely Schedule E (no SE tax to save)
- Single property, low risk profile
- Within 2 years of a planned property sale (transfer complications)

WORKED EXAMPLES

Sarah: 3 cabins, $84K net income, all Schedule E
  → LLC each property; no S-corp election

Marcus: B&B, $120K net income, Schedule C
  → LLC + S-corp election; ~$10K SE tax savings, net of overhead

Renee: 1 cabin, $32K net income, Schedule E
  → Stay sole-prop; revisit at property #3
```

---

## Production order

Build in this sequence to maximize reuse:

1. **Tree 2 (BAR test)** — most-referenced; appears in 4 lessons. Build the design template here.
2. **Tree 1 (Schedule E vs C)** — second-most-referenced; appears in 3 lessons.
3. **Tree 3 (§179 vs Bonus vs Cap)** — depends on Tree 2 visual style.
4. **Tree 4 (Cost seg)** — pairs with Module 4.1 video.
5. **Tree 5 (Augusta)** — short PDF, fastest to ship.
6. **Tree 6 (Incorporate)** — most opinion-heavy, save for last so the brand voice is locked.

---

## File outputs

Each tree ships as **two artifacts:**

1. **PDF** (interactive, clickable nodes link to lesson timestamps): `course-50k-deduction/04-decision-trees/0X-name.pdf`
2. **PNG** (high-res, single-page, for embedding in lessons / community / blog): `course-50k-deduction/04-decision-trees/0X-name.png`

A combined `decision-tree-pack.pdf` (all 6 in one file) ships alongside for hosts who prefer a single download.

---

*Last reviewed: 2026-04-28. Decision trees compress real-world judgment; specific fact patterns may require deviating from the default path. General information, not legal or tax advice. Consult a qualified tax professional for fact-specific guidance.*
