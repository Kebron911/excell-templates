# STRHost-Tools — strhost.tools

## Folder Purpose

This subfolder is for **strhost.tools** — a free-tools website for short-term rental hosts. Sister property to Excel-Templates (The STR Ledger). Tools-first, content second. No databases, auth, user accounts, or dashboards. It is a calculator site.

**Position:** "Free tools for short-term rental hosts." Not a blog. Not a SaaS. SEO + ad revenue + soft funnel into The STR Ledger.

## Launch Cluster (7 tools)

| # | Tool | Primary keyword | Why |
|---|------|-----------------|-----|
| 1 | Airbnb fee calculator | "airbnb fee calculator" | Highest STR search volume, gateway tool |
| 2 | STR profitability calculator | "airbnb profit calculator" | Finance CPM, high-intent buyers |
| 3 | Cleaning fee calculator | "airbnb cleaning fee calculator" | Underserved — hosts genuinely don't know |
| 4 | Occupancy + ADR + RevPAR calculator | "revpar calculator" | 3-in-1, hospitality terminology = SEO moat |
| 5 | Break-even occupancy calculator | "airbnb break even calculator" | Connects to #2, high intent |
| 6 | Co-host split calculator | "airbnb cohost split" | Almost zero competition |
| 7 | Lodging tax calculator (by state) | "airbnb lodging tax [state]" | 50 programmatic landing pages, long-tail |

Every tool sidebar/footer links to the other six. Cross-pollinates rankings, drops bounce, multiplies pageviews/session.

## Site Architecture

```
/                            → Landing (lists all tools)
/airbnb-fee-calculator
/profit-calculator
/cleaning-fee-calculator
/revpar-calculator
/break-even-calculator
/cohost-split-calculator
/lodging-tax/                → Index of 50 states
/lodging-tax/[state]         → 50 programmatic pages
/blog/[slug]                 → Supporting content
/about, /contact
```

## Per-Tool Page Structure (SEO-driven)

1. H1 + 2-sentence intro
2. The tool (above fold)
3. "How it works" — 300 words, the math/formulas
4. "How to use this calculator" — steps
5. FAQ — 5–7 questions, schema markup
6. Related calculators — sidebar/footer
7. ~1,500–2,000 words total per page

## Pre-Launch Checklist

- Sitemap, robots.txt, per-page OG images
- Submit to Google Search Console + Bing
- AdSense application (after content baseline)
- 2–3 embeddable widget builds for blog backlinks

## Distribution Plan

- Reddit: r/airbnb_hosts, r/AirBnB, r/realestateinvesting (answer first, link second)
- Facebook STR host groups
- BiggerPockets forum
- Twitter/X "I built a free X calculator" launches
- Outreach to 20 STR bloggers/YouTubers — free embeddable widgets

## Defensibility Moves

1. **State tax pages** — programmatic, hard to copy at scale
2. **Embeddable widgets** — every embed = backlink
3. **Annual data report** — "STR Host Income Report 2026" → press + backlinks
4. **Lead magnet PDF** → email list → recurring traffic
5. **First to update** when Airbnb changes fees → news traffic

## Explicitly Skipping

- Mobile app
- User accounts / saved calculations
- Fancy charts initially
- Blog before tools work
- Competing head-term "airbnb calculator" early — target long-tail first

## Bridge to The STR Ledger (Excel-Templates)

Don't fully isolate. Connect intentionally:

1. Soft footer mention: "Built by the team at STR Ledger" — backlink + brand
2. One contextual CTA per relevant tool (e.g., Profit calc → "Track this for real with STR Ledger") — below the fold, after value
3. **Email capture is the bridge** — lead magnet → list → nurture into STR Ledger
4. GA4 cross-domain analytics for attribution
5. Shared blog content is fine — host on whichever domain has stronger SEO authority (likely tools within 12 months)

```
thestrledger.com   → Sales, product, login, checkout
strhost.tools      → Tools, calculators, blog
                       ↓ soft funnel ↓
                  thestrledger.com
```

## Specific Instructions

- **Automation-first.** If a calculation, page-build, or content task is repeatable, build it as code (programmatic state pages, widget templates, OG image generators) rather than hand-crafting each.
- **MVP-first.** Ship the 7 calculators + landing + 50 state pages. No DB, no auth, no fancy framework if static will do. Reuse Excel-Templates' brand assets where they fit.
- **Lead with weaknesses.** Flag SEO gaps, technical debt, and soft-funnel friction first.
- **Backups religious.** Repo + deploy logs + content exports.

- **Blog hero images are mandatory and automated.** Every post in `src/content/posts/*.mdx` must have a `heroImage` field. When creating a new post, run `pnpm hero -- src/content/posts/<slug>.mdx` **before committing** — it calls Gemini, writes 3 WebP variants to `public/images/blog/<slug>/`, and patches frontmatter. See `docs/CLUSTER-BLOG-STANDARD.md`.

## Things to Remember

- Tech stack is **not yet decided** — open to Next.js (static export), Astro, or pure HTML+JS. Decide during planning based on programmatic page support, OG image generation, and embed-widget portability.
- Domain may end up `strhost.tools` or alternative — `hostcalc.com` was a placeholder example in the brief.
- Sister project: `C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates` (The STR Ledger). Brand kit, voice, and design tokens may be reusable.

---

**MEMORY SYSTEM**

This folder contains a file called MEMORY.md. It is your external memory for this workspace — use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work — don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks — using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them. Do not auto-delete or expire entries.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
