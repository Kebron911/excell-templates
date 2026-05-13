# STROps-Tools — strops.tools

## Folder Purpose

This subfolder is for **strops.tools** — a free-tools website for active short-term rental hosts running properties. Operational pain points = repeat visits = email list compounds fast. Sister site to strbuyers.tools, strhost.tools, strguests.tools, and Excel-Templates (The STR Ledger).

**Position:** "Free tools for active short-term rental operators."

**Lifecycle stage:** Operations (running) — third stop in the host lifecycle.

**Business model:** SEO + **email-list-first** + ops-software affiliate (Hostfully, Hospitable, OwnerRez, Turno, smart locks, noise monitors). Lower CPM than acquisition cluster but stickier audience and natural funnel into The STR Ledger for cash flow tracking.

## Launch Cluster (7 tools)

| # | Tool | Primary keyword |
|---|------|-----------------|
| 1 | Turnover scheduler (multi-property checkout/checkin gap) | "airbnb turnover scheduler" |
| 2 | Cleaner dispatch generator (assigns + SMS templates) | "airbnb cleaner sms template" |
| 3 | Smart lock code rotator (rolling codes per booking) | "airbnb smart lock code generator" |
| 4 | Linen par calculator (sheet/towel sets per property) | "airbnb linen par calculator" |
| 5 | Restock alert calculator (booking volume × consumable rate) | "airbnb supply restock calculator" |
| 6 | Damage cost lookup (replace mattress, repaint, replace TV) | "cost to replace [item] in airbnb" |
| 7 | Maintenance schedule generator (HVAC, smoke detector, deep clean) | "airbnb maintenance schedule" |

## Programmatic Angle

- **Maintenance pages:** "How often to [task] in an STR" — ~30 tasks × deep informational pages
- **Replacement cost pages:** "Cost to replace [item] in a rental" — ~50 items × cost/brand-rec/how-to pages
- Both fed by hand-compiled JSON (mirror strhost.tools' state-tax pattern)

## Affiliate Plays

- **Smart locks** — August, Schlage, RemoteLock
- **Noise monitors** — Minut, NoiseAware
- **Property management software** — Hostfully, Hospitable, OwnerRez
- **Cleaning marketplaces** — TurnoverBnB / Turno

## Cross-Cluster Funnel

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)         [you are here]
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone (every stage)
```

A footer block on every page links to the other three tool sites + The STR Ledger.

## Specific Instructions

- **Email-list-first.** Three lead magnets (vs strhost.tools' one): Cleaner SOP PDF, Maintenance Checklist, Supply Par-Level Sheet. Every tool has its own magnet match.
- **PDF generation needed** — cleaner dispatch SMS sheet, maintenance schedule, supply par calculator output. Use `pdf-lib` browser-side.
- **Tools are the magnet.** Repeat use is the moat. Optimize for "I need to do this every week" workflows.
- **Affiliate placements are subtle** — ops audience is sophisticated and tunes out hard sells. Recommendations only after value delivered.

- **Blog hero images are mandatory and automated.** Every post in `src/content/posts/*.mdx` must have a `heroImage` field. When creating a new post, run `pnpm hero -- src/content/posts/<slug>.mdx` **before committing** — it calls Gemini, writes 3 WebP variants to `public/images/blog/<slug>/`, and patches frontmatter. See `docs/CLUSTER-BLOG-STANDARD.md`.

## Things to Remember

- Tech stack inherits from strhost.tools (Astro 4.x static, sister sub-brand) — but with PDF generation infrastructure added.
- Brand palette: ops-utility (greens + grays — operational, not flashy). Distinct from strhost.tools' editorial-finance feel.
- Sister projects:
  - `Wealth/Businesses/STRHost-Tools` (strhost.tools)
  - `Wealth/Businesses/STRBuyers-Tools` (strbuyers.tools)
  - `Wealth/Businesses/STRGuests-Tools` (strguests.tools)
  - `Wealth/Businesses/Excel-Templates` (The STR Ledger)
- Cleaner SOP PDF authorship (host? Daniel? AI draft + edit?) is an open question — see spec §13.

---

**MEMORY SYSTEM**

This folder contains a file called MEMORY.md. It is your external memory for this workspace — use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work — don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks — using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them. Do not auto-delete or expire entries.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
