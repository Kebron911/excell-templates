# strops.tools — Design Spec

**Status:** Draft for review
**Date:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster:** Operations (running) — third stop in the host lifecycle
**Sibling specs:** strhost.tools, strbuyers.tools, strguests.tools, Excel-Templates (The STR Ledger)

---

## 1. Purpose & positioning

**strops.tools** is a free-tools website for active short-term rental hosts running properties. Operational pain points = repeat visits = email list compounds fast. Lower CPM than acquisition, but stickier audience and natural funnel into The STR Ledger for cash-flow tracking.

**Position:** "Free tools for active short-term rental operators."

**Business model:** SEO + **email-list-first** + ops-software affiliate (smart locks, noise monitors, property management software, cleaning marketplaces).

**What this site is not:**

- Not a property management SaaS (no auth, no DB, no scheduling backend)
- Not a CRM
- Not a replacement for OwnerRez/Hostfully/Hospitable — it complements them

---

## 2. Launch cluster — 7 tools

| # | Tool | Primary keyword | Why this one |
|---|------|-----------------|--------------|
| 1 | Turnover scheduler | "airbnb turnover scheduler" | Multi-property checkout/checkin gap; visual planner |
| 2 | Cleaner dispatch generator | "airbnb cleaner sms template" | Generates assignment + SMS template; downloadable sheet |
| 3 | Smart lock code rotator | "airbnb smart lock code generator" | Rolling codes per booking; affiliate matchup with August/Schlage |
| 4 | Linen par calculator | "airbnb linen par calculator" | Sheet/towel sets per property; underserved |
| 5 | Restock alert calculator | "airbnb supply restock calculator" | Booking volume × consumable rate |
| 6 | Damage cost lookup | "cost to replace [item] in airbnb" | 50-item programmatic; affiliate matchup with replacement vendors |
| 7 | Maintenance schedule generator | "airbnb maintenance schedule" | HVAC/smoke detector/deep clean cadence; downloadable PDF |

---

## 3. Site architecture

```
/                              → Landing (lists all tools)
/turnover-scheduler
/cleaner-dispatch
/smart-lock-codes
/linen-par-calculator
/restock-calculator
/damage-cost-lookup
/maintenance-schedule
/maintenance/                  → Index of ~30 maintenance tasks
/maintenance/[task]            → Programmatic "How often to [task] in an STR"
/replace/                      → Index of ~50 replacement items
/replace/[item]                → Programmatic "Cost to replace [item] in a rental"
/blog/[slug]
/about, /contact
/get-the-cleaner-sop           → Lead magnet 1
/get-the-maintenance-checklist → Lead magnet 2
/get-the-supply-par            → Lead magnet 3
```

---

## 4. Decisions log (resolved)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x, static output** | Inherits from strhost.tools |
| 2 | Brand relationship | **Sister sub-brand, ops-utility palette** | Same palette family; greens + grays accent (operational, not flashy) |
| 3 | Programmatic data | **`tasks.json` (~30) + `items.json` (~50)** | Hand-compiled, annual review, mirrors state-tax pattern |
| 4 | PDF generation | **Browser-side `pdf-lib`** | Cleaner SOP, dispatch sheet, maintenance schedule; no server required |
| 5 | Lead magnets | **Three at launch** | Cleaner SOP, Maintenance Checklist, Supply Par-Level Sheet — each tool matched to its magnet |
| 6 | Calculator UX | **Live updates + URL state + print** | Inherits from strhost.tools |
| 7 | Monetization density | **Email-first, balanced ads, soft affiliate** | Ops audience is sophisticated; hard sells tank trust. Affiliate placements only after value. |

---

## 5. Tech & repo

- **Astro 4.x**, static output
- **TypeScript** for calculator logic
- **`pdf-lib`** for browser-side PDF generation (no server required)
- **Tailwind**, tokens shared with strhost.tools
- **Vitest** + **Playwright**
- **pnpm** workspace inside `STROps-Tools/`
- **Deploy target:** Hostinger Business shared hosting (already provisioned). Static `dist/` deployed via Git push or FTP. Bundled Cloudflare CDN enabled.

---

## 6. Project layout (deltas from strhost.tools)

```
STROps-Tools/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── turnover-scheduler.astro
│   │   ├── cleaner-dispatch.astro
│   │   ├── smart-lock-codes.astro
│   │   ├── linen-par-calculator.astro
│   │   ├── restock-calculator.astro
│   │   ├── damage-cost-lookup.astro
│   │   ├── maintenance-schedule.astro
│   │   ├── maintenance/
│   │   │   ├── index.astro
│   │   │   └── [task].astro
│   │   ├── replace/
│   │   │   ├── index.astro
│   │   │   └── [item].astro
│   │   ├── get-the-cleaner-sop.astro
│   │   ├── get-the-maintenance-checklist.astro
│   │   └── get-the-supply-par.astro
│   ├── components/
│   │   ├── chrome/, ui/, ads/, affiliate/, funnel/
│   │   └── calculators/        # Including dispatch generator + schedule generator
│   ├── lib/
│   │   ├── calc/
│   │   ├── pdf/                # pdf-lib wrappers: SOP, dispatch sheet, schedule
│   │   ├── url-state.ts, format.ts, seo.ts
│   ├── content/
│   │   ├── blog/, tools/
│   │   ├── maintenance/        # Per-task narrative MDX
│   │   └── replace/            # Per-item narrative MDX
│   ├── data/
│   │   ├── tasks.json          # ~30 maintenance tasks
│   │   ├── items.json          # ~50 replacement items
│   │   ├── tools.json
│   │   └── affiliates.json
│   ├── styles/, og/
├── public/pdf/                 # Lead magnet stubs + branded templates
```

---

## 7. Per-tool page template (canonical layout)

Mirror of strhost.tools, with **higher email-capture density** and a **PDF download surface**:

1. **H1 + 2-sentence lede**
2. **The calculator/generator** (above the fold)
3. ***Download PDF button*** *(NEW for this cluster: cleaner dispatch sheet, maintenance schedule, etc. — when applicable)*
4. *In-content ad slot*
5. **"How it works"** (≈300 words)
6. *Email-capture card — magnet matched to this tool*
7. **"How to use this tool"**
8. **FAQ**
9. *Contextual STR Ledger CTA*
10. *Affiliate match (soft, after value)* — "If you're looking for noise monitors, we've used Minut..."
11. *Footer ad slot*
12. **Related tools**
13. *Cluster funnel block*
14. *Funnel band*
15. *Footer*

**Word-count target:** 1,500–2,000 words across bolded sections.

---

## 8. Calculator/generator interaction model

Same as strhost.tools (live + URL state + print). Cluster-specific notes:

- **Turnover scheduler** — multi-property; URL state encodes property list + bookings as compressed param
- **Cleaner dispatch generator** — outputs assignment table + SMS templates; "Download dispatch sheet" produces branded PDF via `pdf-lib`
- **Smart lock code rotator** — deterministic algorithm (booking ID → code); not random, so codes are reproducible
- **Damage cost lookup** — searchable table backed by `items.json`; selecting an item navigates to `/replace/[item]` (programmatic page)
- **Maintenance schedule generator** — input property profile → outputs annual schedule; downloadable PDF + print + add-to-Google-Calendar (`.ics` export)

---

## 9. Programmatic page system

### Maintenance pages (`/maintenance/[task]`)

`tasks.json` shape:

```json
{
  "hvac-filter-change": {
    "name": "HVAC filter change",
    "cadenceDays": 60,
    "season": "all",
    "estimatedCostUsd": [10, 30],
    "skillLevel": "diy",
    "consequencesOfSkipping": "...",
    "sourceUrls": [...],
    "lastVerified": "2026-05-05"
  }
}
```

Each page: H1, lede, "How often" answer, "Why it matters", "Cost", "DIY vs pro", "Signs you waited too long", related tasks. ~800 words.

### Replacement pages (`/replace/[item]`)

`items.json` shape:

```json
{
  "queen-mattress": {
    "name": "Queen mattress",
    "category": "bedroom",
    "costRange": [400, 1200],
    "lifespanYears": 7,
    "brandRecs": ["Tuft & Needle", "Saatva"],
    "sourceUrls": [...],
    "lastVerified": "2026-05-05"
  }
}
```

Each page: H1, lede, cost range, lifespan, brand recommendations (with affiliate links), how-to-replace, related items.

---

## 10. Monetization layer

**Email capture (primary):**

- Three lead magnets (vs strhost.tools' one):
  - **STR Cleaner SOP PDF** — for tools 1, 2
  - **STR Maintenance Checklist** — for tools 6, 7 + maintenance pages
  - **STR Supply Par-Level Sheet** — for tools 4, 5
- Per-tool magnet matchup defined in `tools.json`
- 30%+ optin target per the brief

**Affiliate (secondary):**

- Smart locks: August, Schlage, RemoteLock (matchup: tool #3 + lock-related replace pages)
- Noise monitors: Minut, NoiseAware
- Property management software: Hostfully, Hospitable, OwnerRez
- Cleaning marketplaces: TurnoverBnB / Turno (matchup: tools 1, 2)
- Replacement vendors on `/replace/[item]` pages
- Soft placement only — content card, after value delivered

**STR Ledger funnel:**

- `<STRLedgerCTA tool="..." />` — Operations cluster CTAs lean toward "Track these costs in The STR Ledger" SKUs

**Ads (tertiary):**

- Same two-slot pattern as strhost.tools

**Cross-cluster:**

- `<ClusterFunnelBlock currentCluster="operations" />`

**Forbidden:** popups, exit-intent, sticky ads, repeated CTAs.

---

## 11. Brand layer

- Tokens shared with strhost.tools and Excel-Templates
- **Accent color:** ops-utility green-gray (vs finance-trust blue for buyers, editorial neutral for host-math)
- Type stack identical: Inter primary, Cormorant accent, JetBrains Mono numbers
- Wordmark: "strops.tools" in Inter Tight Semibold

---

## 12. SEO + analytics layer

Same stack as strhost.tools:

- `astro-seo`, per-page Satori OG images, sitemap, robots
- JSON-LD: `Organization`, `WebApplication` per tool, `FAQPage`, `Article` per post, **`HowTo` per maintenance/replace page**
- GA4 cross-domain (thestrledger.com + cluster sites)
- Custom events: standard set + `pdf_downloaded`, `magnet_captured`, `cluster_link_clicked`, `affiliate_click`

---

## 13. Open questions — pending user decision

1. **Domain** — confirmed `strops.tools`?
2. **Cleaner SOP authorship** — host (community-sourced)? Daniel? AI draft + edit pass? Recommend: AI draft + Daniel edit + host beta-readers.
3. **Smart lock affiliate priority** — August (consumer-friendly), Schlage (commercial), RemoteLock (multi-platform)? Different commission structures.
4. **PDF library** — `pdf-lib` (recommended, more layout control) vs `jsPDF` (simpler API, weaker layout)?
5. **ESP** — same as strhost.tools? (assumed yes, unify across clusters)

---

## 14. Build, deploy, ops

- CI: GitHub Actions — typecheck, vitest, playwright, build
- Deploy preview per PR
- Hostinger Business shared hosting (already provisioned). Static Astro `dist/` deployed via Git push or FTP to subdomain directory.
- Bundled Cloudflare CDN enabled for cache + TTFB
- Domain registration: confirm before deploy

---

## 15. Distribution plan

- Reddit: r/AirBnB, r/airbnb_hosts (operational questions abound)
- Facebook STR host groups (operations content goes viral here)
- BiggerPockets forum
- Twitter/X — "I built a free X scheduler" launches
- Pinterest — maintenance-checklist pins (printable content does well)
- Outreach to ops-focused YouTubers (Robuilt, Avery Carl) — free embed widgets (Phase 2)

---

## 16. Defensibility moves

1. **Maintenance + replacement programmatic pages** — ~80 long-tail informational pages, hard to clone
2. **Three lead magnets** stacked → email list compounds quickly
3. **Embeddable widgets** (Phase 2)
4. **Annual data report** — "STR Operating Costs Benchmark 2026" — press + ops-software partnerships
5. **First to update** when smart-lock platforms add features → news traffic

---

## 17. Out of scope (Phase 2+)

- Real cleaner CRM (would require auth/DB — explicitly out)
- Booking-platform sync (no auth)
- Real-time noise/lock alerts (would require integrations)
- User accounts, saved schedules
- Mobile app
- Embed widgets (mechanical extraction later)
- Real PDF lead magnets (stub at launch)

---

## 18. Bridge to The STR Ledger + cluster

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)         [you are here]
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone (every stage)
```

Every page renders `<ClusterFunnelBlock />` + `<STRLedgerCTA />`.
