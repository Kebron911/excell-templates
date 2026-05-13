# STRGuests-Tools — strguests.tools

## Folder Purpose

This subfolder is for **strguests.tools** — a free-tools website for the host-guest interface. Generators-heavy = AI plays well, low current saturation. Sister site to strbuyers.tools, strhost.tools, strops.tools, and Excel-Templates (The STR Ledger).

**Position:** "Free tools for hosts to delight guests."

**Lifecycle stage:** Guest XP (optimizing) — fourth stop in the host lifecycle.

**Business model:** SEO + Pinterest/social + PDF lead magnets + affiliate (Touch Stay, Hostfully Guidebook, YourWelcome, Canva Pro, printing services). AI generators bring repeat-visit volume; PDFs are perfect lead magnets.

## Launch Cluster (7 tools)

| # | Tool | Primary keyword |
|---|------|-----------------|
| 1 | House rules PDF generator (checkboxes → branded printable) | "airbnb house rules pdf" |
| 2 | Welcome book builder (multi-page guidebook PDF) | "airbnb welcome book template" |
| 3 | Wifi sign generator (multiple design templates) | "airbnb wifi sign template" |
| 4 | Check-in instructions PDF generator (with photos + door codes) | "airbnb check in instructions template" |
| 5 | Listing description generator (AI; style toggles) | "airbnb listing description generator" |
| 6 | Review response generator (AI; 5-star/4-star/bad review variants) | "airbnb review response generator" |
| 7 | Guest message template generator (booking confirmation, pre-arrival, mid-stay, post-checkout) | "airbnb message template" |

## Programmatic Angle

"Airbnb [message type] template for [scenario]" — late checkout request, noise complaint, broken item, refund request. ~100 templated pages from a `templates.json`, each ranks for specific long-tail queries.

## Affiliate Plays

- **Guidebook software** — Touch Stay, Hostfully Guidebook, YourWelcome
- **Design** — Canva Pro
- **Printing services** — Printful, Printify (Phase 2)

## Cross-Cluster Funnel

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)         [you are here]
thestrledger.com → Financial backbone (every stage)
```

A footer block on every page links to the other three tool sites + The STR Ledger.

## Specific Instructions

- **Architecture deviation:** This is the only cluster that breaks pure-static. AI generators (#5, #6, #7) require a thin serverless layer — Hostinger Workers (preferred) or Vercel Edge Functions. Tools #1–#4 stay client-side.
- **PDF generation** is browser-side via `pdf-lib` (more layout control than jsPDF).
- **Email gate on PDF download** — soft gate (PDF downloads anyway, email captures opportunistically). 30%+ optin per the brief.
- **AI rate limit** — 5 generations / hour / IP without email; 50 / day with verified email. Prevents API cost runaway.
- **AI provider:** Claude (claude-haiku-4-5 for cost) — open question, see spec §13.
- **Pinterest distribution** — invest in pin-optimized OG images per generator output. Reuse Excel-Templates' Pinterest UI kit (`design-system/ui_kits/pinterest/`).
- **Blog hero images are mandatory and automated.** Every `src/content/posts/*.mdx` must have a `heroImage` field pointing to `/images/blog/<slug>/hero.webp`. When creating a new post, run `pnpm hero -- src/content/posts/<slug>.mdx` **before committing** — it calls Gemini, writes 3 WebP variants (hero/thumb/social) to `public/images/blog/<slug>/`, and patches the frontmatter. The post + its image ship in one atomic commit. Requires `GEMINI_API_KEY` in `Excel-Templates/.env` (see CREDENTIALS.md).

## Things to Remember

- Tech stack inherits from strhost.tools (Astro 4.x) **plus serverless layer for AI**.
- Brand palette: warmer hospitality tones (vs strhost.tools' editorial-finance, vs strops.tools' ops-utility green). Same family, distinct accent.
- Lowest competition of any STR cluster currently. Speed matters.
- Sister projects:
  - `Wealth/Businesses/STRHost-Tools` (strhost.tools)
  - `Wealth/Businesses/STRBuyers-Tools` (strbuyers.tools)
  - `Wealth/Businesses/STROps-Tools` (strops.tools)
  - `Wealth/Businesses/Excel-Templates` (The STR Ledger)

---

**MEMORY SYSTEM**

This folder contains a file called MEMORY.md. It is your external memory for this workspace — use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work — don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks — using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them. Do not auto-delete or expire entries.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
