# Cost-Per-Stay Calculator — Lead Magnet (Generic blog tie-in)

**SKU code:** `LM-006`
**Format:** Excel workbook (1 tab) + PDF print companion (1 page)
**Funnel role:** Generic mini-magnet usable across any blog post that lacks a topic-specific magnet. Email-gated at `/free/cost-per-stay`. Tag at capture: `lead-magnet:cost-per-stay`.
**Build tool:** Excel + Vista Create
**Save locations:**
- `templates/_delivery/_shared/cost-per-stay-calculator.xlsx`
- `templates/_delivery/_shared/cost-per-stay-calculator.pdf`
**Companion product:** Schedule E Workbook (TAX-002, $27) or Single-Property P&L (FIN-001)

---

## Why this magnet exists

Most hosts know revenue per stay. Few know **cost per stay** — the actual all-in operating cost broken down so they can spot leaks. This is the magnet for any blog post that doesn't have a more specific lead magnet (per `content-plan.md` §7.2). It's a high-utility generic that works across all 10 planned blog posts.

The cost-per-stay number changes how hosts think:
- "I average $187/night gross" → comfortable
- "My cost per stay is $63, so I keep $124/night before tax" → reality
- "Cleaner is $89 of that — am I overpaying?" → action

---

## Excel structure

### Single tab — "Cost Per Stay"

**Inputs section (yellow-highlighted cells):**

| Cell | Label | Example |
|------|-------|---------|
| B3  | Property nickname | "Beach House #1" |
| B4  | Trailing 12-month gross revenue ($) | 78,000 |
| B5  | Total stays in trailing 12-mo | 96 |
| B6  | Cleaning fee paid to cleaner per stay ($) | 65 |
| B7  | Laundry/linen cost per stay ($) | 12 |
| B8  | Consumables per stay (soap, coffee, paper) ($) | 8 |
| B9  | Restock/wear-and-tear allowance per stay ($) | 6 |
| B10 | Trailing 12-mo Airbnb/VRBO fees ($) | 2,340 |
| B11 | Trailing 12-mo cleaning labor (your hrs × rate) ($) | 0 |
| B12 | Trailing 12-mo software (PriceLabs, Hospitable, smart lock) ($) | 540 |
| B13 | Trailing 12-mo insurance ($) | 1,200 |
| B14 | Trailing 12-mo utilities ($) | 4,800 |
| B15 | Trailing 12-mo maintenance/repairs ($) | 2,400 |
| B16 | Trailing 12-mo mortgage interest ($) | 11,000 |
| B17 | Trailing 12-mo property tax ($) | 3,600 |
| B18 | Trailing 12-mo depreciation (est.) ($) | 9,000 |

**Outputs section (calculated):**

| Cell | Label | Formula |
|------|-------|---------|
| D3  | Avg revenue per stay | `=B4/B5` |
| D4  | Per-stay variable cost (cleaning + laundry + consumables + restock) | `=B6+B7+B8+B9` |
| D5  | Per-stay fixed cost share | `=(B10+B11+B12+B13+B14+B15+B16+B17+B18)/B5` |
| D6  | **Total cost per stay** | `=D4+D5` |
| D7  | **Net per stay (before tax)** | `=D3-D6` |
| D8  | Net margin % | `=D7/D3` |
| D9  | Cost-per-stay benchmark vs. average | Text: see lookup table |

### Benchmark lookup table (Tab 2 — hidden, drives D9)

| Net margin % | Status |
|--------------|--------|
| 60%+         | Top decile — best-in-market pricing/cost discipline |
| 45–60%       | Healthy — typical for well-run STR |
| 30–45%       | Average — room to optimize cleaning + software stack |
| 15–30%       | Below average — recheck cleaner pricing, dynamic pricing |
| <15%         | Bleeding — likely overpaying cleaning OR underpricing |

### Visualizations on the tab
- Donut chart: "Where your $/stay goes" (variable vs. fixed slices, broken down)
- KPI tile: "Cost per stay" big number
- KPI tile: "Net margin %" with conditional formatting (red < 30%, amber 30–45%, green 45%+)

### Tips section at the bottom

> **Three biggest leaks we see:**
> 1. **Cleaner pricing creep.** If your cleaner started at $55/stay 18 months ago and now charges $85, ask if comparable STRs in your zip code pay that. Use the Cleaner Cost Lookup at strops.tools.
> 2. **Software stack bloat.** Most hosts pay for PriceLabs + AirDNA + a PMS + smart-lock subscription = $1,800+/yr they barely use 30% of.
> 3. **Underpriced cleaning fee passthrough.** Cleaner charges you $65, you charge guest $50. You're subsidizing $15 per stay. Pass it through fully.

### Footer (in cell)
*General educational information. Numbers are estimates — verify with your bookkeeping. © 2026 The STR Ledger*

---

## PDF Print Companion (1 page)

### Header
**The Cost-Per-Stay Worksheet** · *for STR Hosts who want their P&L truth · The STR Ledger*

### Body — fillable worksheet

A single-page printable version of the Excel tab where the user fills numbers in by hand (for hosts who want a quick "back of napkin" version before they download Excel).

### CTA block
**The full Excel auto-calculates everything as you type →** thestrledger.com/cost-per-stay-calculator

**Want it tied into a complete P&L?** Single-Property P&L (FIN-001) at thestrledger.com/single-property-pl

### Footer
*© 2026 The STR Ledger · hello@thestrledger.com*

---

## Build checklist

- [ ] Excel: yellow-highlight all input cells; lock everything else
- [ ] Excel: donut chart auto-updates from the variable + fixed cost cells
- [ ] Excel: D9 text changes via XLOOKUP against Tab 2 ranges
- [ ] Excel: KPI tiles use conditional formatting
- [ ] PDF: fillable form fields (so users can type-fill OR print-fill)
- [ ] QR on PDF → `thestrledger.com/cost-per-stay-calculator`
- [ ] Test: revenue $78K, 96 stays, all expenses pre-filled → net margin must compute to ~38%

## Mini-magnet → product conversion target

- Opt-in CVR target: 20%+ (generic — broader audience, lower intent than topic-specific magnets)
- Upsell CTR to FIN-001 / TAX-002 in nurture sequence: 5%+
- Pair with blog posts 5, 6, 7, 9 that don't have a more specific magnet
