# STRBuyers-Tools — strbuyers.tools

## Folder Purpose

This subfolder is for **strbuyers.tools** — a free-tools website for people researching whether to buy a short-term rental property. Pre-purchase intent = highest CPM finance keywords + highest-ticket affiliate revenue. Sister site to strhost.tools, strops.tools, strguests.tools, and Excel-Templates (The STR Ledger).

**Position:** "Free tools for STR property buyers."

**Lifecycle stage:** Acquisition (pre-buy) — first stop in the host lifecycle.

**Business model:** SEO + ad revenue + **high-ticket affiliate revenue** (DSCR lenders $200–500/lead, STR data software, insurance, furniture). Affiliate is primary; ads secondary.

## Launch Cluster (7 tools)

| # | Tool | Primary keyword |
|---|------|-----------------|
| 1 | STR mortgage qualifier (DSCR loan calculator) | "dscr loan calculator str" |
| 2 | Down payment calculator (by loan type) | "airbnb down payment calculator" |
| 3 | Comp analyzer (paste 3 listings) | "airbnb comp analyzer" |
| 4 | Market score tool (input city) | "is airbnb profitable in [city]" |
| 5 | Cash-on-cash return calculator | "airbnb cash on cash" |
| 6 | Year 1 cash needs calculator | "airbnb startup cost calculator" |
| 7 | Furnishing budget calculator | "airbnb furnishing budget" |

## Programmatic Angle

200+ city pages — "Is Airbnb profitable in [city]?" Pull regulation status, average ADR, saturation tier from a hand-compiled `cities.json`. Long-tail goldmine, hard for competitors to match without effort.

## Affiliate Plays (primary monetization)

- **DSCR lenders** — Visio, Kiavi (~$200–500/lead)
- **Data software** — AirDNA, PriceLabs, Mashvisor
- **STR insurance** — Proper, Steadily
- **Furniture packages** — Stage by Hand, Minoan

## Cross-Cluster Funnel

```
strbuyers.tools  → Acquisition (pre-buy)         [you are here]
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone (every stage)
```

A footer block on every page links to the other three tool sites + The STR Ledger.

## Specific Instructions

- **Affiliate-first monetization** — every tool surfaces 1–2 matched-vendor blocks below results. FTC disclosure on every page. Click logging + UTM tagging.
- **City data** is hand-compiled, version-controlled, annually reviewed (mirror strhost.tools' state-tax JSON pattern).
- **MVP-first.** Ship the 7 calculators + 200 city pages. No live AirDNA API integration at launch.
- **Lead with weaknesses.** Flag affiliate-disclosure gaps, data freshness, or programmatic-page thinness first.

## Things to Remember

- Tech stack inherits from strhost.tools (Astro 4.x static, sister sub-brand).
- Affiliate vendor priorities and city data licensing are open questions — see `docs/superpowers/specs/2026-05-05-strbuyers-tools-design.md` §13.
- Sister projects:
  - `Wealth/Businesses/STRHost-Tools` (strhost.tools)
  - `Wealth/Businesses/STROps-Tools` (strops.tools)
  - `Wealth/Businesses/STRGuests-Tools` (strguests.tools)
  - `Wealth/Businesses/Excel-Templates` (The STR Ledger)

---

**MEMORY SYSTEM**

This folder contains a file called MEMORY.md. It is your external memory for this workspace — use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work — don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks — using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them. Do not auto-delete or expire entries.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
