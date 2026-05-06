# strguests.tools — Design Spec

**Status:** Draft for review
**Date:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster:** Guest XP (optimizing) — fourth stop in the host lifecycle
**Sibling specs:** strhost.tools, strbuyers.tools, strops.tools, Excel-Templates (The STR Ledger)

---

## 1. Purpose & positioning

**strguests.tools** is a free-tools website for the host-guest interface. Generators-heavy = AI plays well; lowest current saturation of any STR cluster. PDFs are perfect lead magnets; Pinterest distribution is friendly territory.

**Position:** "Free tools for hosts to delight guests."

**Business model:** SEO + Pinterest/social + PDF lead magnets + affiliate (Touch Stay, Hostfully Guidebook, YourWelcome, Canva Pro). AI generators bring repeat-visit volume.

**What this site is not:**

- Not a guidebook SaaS (no hosting of generated content; download and use elsewhere)
- Not a CRM
- Not a printing service (we generate PDFs; users print or use them digitally)

---

## 2. Launch cluster — 7 tools

| # | Tool | Primary keyword | Why this one |
|---|------|-----------------|--------------|
| 1 | House rules PDF generator | "airbnb house rules pdf" | Checkboxes → branded printable; lead-magnet gate |
| 2 | Welcome book builder | "airbnb welcome book template" | Multi-page guidebook PDF; Touch Stay affiliate |
| 3 | Wifi sign generator | "airbnb wifi sign template" | Pinterest goldmine; multi-design templates |
| 4 | Check-in instructions PDF | "airbnb check in instructions template" | With photos + door codes |
| 5 | Listing description generator (AI) | "airbnb listing description generator" | Style toggles (luxury/family/quirky) |
| 6 | Review response generator (AI) | "airbnb review response generator" | 5-star/4-star/bad-review variants |
| 7 | Guest message template generator | "airbnb message template" | Booking confirmation, pre-arrival, mid-stay, post-checkout |

**Tools 1–4** are PDF generators (client-side). **Tools 5–7** are AI generators (require serverless layer).

---

## 3. Site architecture

```
/                              → Landing (lists all tools)
/house-rules-generator
/welcome-book-builder
/wifi-sign-generator
/checkin-instructions
/listing-description-generator
/review-response-generator
/message-template-generator
/templates/                    → Index of ~100 message-template scenarios
/templates/[scenario]          → Programmatic per-scenario page
/blog/[slug]
/about, /contact
/get-the-pdf                   → Lead magnet landing
/api/generate-listing          → Node.js endpoint on Hostinger (AI)
/api/generate-review           → Node.js endpoint on Hostinger (AI)
/api/generate-message          → Node.js endpoint on Hostinger (AI)
```

---

## 4. Decisions log (resolved)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x static + Node.js API on Hostinger** | Static for tools 1–4 + content; Node.js Express app handles AI tools 5–7 only. Both run on Hostinger Business. |
| 2 | AI provider | **OpenAI GPT-4o-mini** | $0.15/$0.60 per 1M tokens; user-selected. SDK: `openai`. |
| 3 | PDF library | **`pdf-lib`** | Better layout control than jsPDF; multi-page support; client-side |
| 4 | Brand relationship | **Sister sub-brand, hospitality-warm palette** | Same palette family; warmer accent (vs finance-trust blue, ops-utility green, editorial neutral) |
| 5 | Programmatic data | **`templates.json` (~100 scenarios)** | Mirror state/city/task pattern |
| 6 | Lead magnet model | **The PDF generator IS the lead magnet** | Soft email gate — PDF downloads anyway, email captures opportunistically |
| 7 | AI rate limit | **5/hr/IP without email; 50/day with verified email** | Prevents API cost runaway; converts free → email |
| 8 | Generator UX | **Live preview pane + download/copy actions** | Replaces "calculator UX" pattern from sibling sites |
| 9 | Pinterest infrastructure | **Per-output pin generation** | Reuse Excel-Templates' Pinterest UI kit; Pinterest is the primary distribution channel |

---

## 5. Tech & repo

- **Astro 4.x**, static output
- **TypeScript**
- **`pdf-lib`** for browser-side PDF
- **Node.js (Express or Fastify)** on Hostinger Apps for `/api/generate-*` endpoints
- **`openai`** SDK in the Node app; uses Chat Completions API (GPT-4o-mini)
- **Tailwind**, tokens shared with sibling sites
- **Vitest** for prompt + PDF unit tests
- **Playwright** for one smoke test per generator
- **pnpm** workspace inside `STRGuests-Tools/`
- **Deploy target:** Hostinger Business shared hosting (already provisioned) — static Astro `dist/` + Node.js API + MySQL. Bundled Cloudflare CDN enabled.

---

## 6. Project layout (deltas from strhost.tools)

```
STRGuests-Tools/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── house-rules-generator.astro
│   │   ├── welcome-book-builder.astro
│   │   ├── wifi-sign-generator.astro
│   │   ├── checkin-instructions.astro
│   │   ├── listing-description-generator.astro
│   │   ├── review-response-generator.astro
│   │   ├── message-template-generator.astro
│   │   ├── templates/
│   │   │   ├── index.astro
│   │   │   └── [scenario].astro
│   │   ├── blog/[...slug].astro
│   │   ├── about.astro, contact.astro, get-the-pdf.astro
│   ├── components/
│   │   ├── chrome/, ui/, ads/, affiliate/, funnel/
│   │   └── generators/             # Replaces calculators/ — TSX, hydrated
│   │       ├── HouseRulesGenerator.tsx
│   │       ├── WelcomeBookBuilder.tsx
│   │       ├── WifiSignGenerator.tsx
│   │       ├── CheckinInstructionsGenerator.tsx
│   │       ├── ListingDescriptionGenerator.tsx
│   │       ├── ReviewResponseGenerator.tsx
│   │       └── MessageTemplateGenerator.tsx
│   ├── lib/
│   │   ├── pdf/                    # pdf-lib templates per generator
│   │   │   ├── house-rules.ts
│   │   │   ├── welcome-book.ts
│   │   │   ├── wifi-sign.ts
│   │   │   └── checkin.ts
│   │   ├── ai/
│   │   │   ├── prompts/            # Versioned prompt templates
│   │   │   │   ├── listing.ts
│   │   │   │   ├── review.ts
│   │   │   │   └── message.ts
│   │   │   └── client.ts           # fetch wrapper with retry/error handling
│   │   ├── url-state.ts, format.ts, seo.ts
│   ├── content/
│   │   ├── blog/, tools/
│   │   └── templates/              # Per-scenario narrative MDX
│   ├── data/
│   │   ├── templates.json          # ~100 message-template scenarios
│   │   ├── tools.json
│   │   └── affiliates.json
│   ├── styles/, og/
├── server/                         # Node.js Express app (Hostinger Apps)
│   ├── index.ts                    # Express bootstrap + middleware
│   ├── routes/
│   │   ├── generate-listing.ts
│   │   ├── generate-review.ts
│   │   └── generate-message.ts
│   ├── lib/
│   │   ├── rate-limit.ts           # MySQL-backed per-IP + per-email
│   │   ├── auth.ts                 # Email verification token
│   │   └── openai.ts               # OpenAI client wrapper, retry/error handling
│   └── db/
│       └── schema.sql              # rate_limits, email_verifications, generation_logs
├── public/pdf/                     # Stub PDFs + brand templates
├── tests/
│   ├── pdf/, ai/, e2e/
├── astro.config.mjs, etc.
```

---

## 7. Per-tool page template (canonical layout)

Mirror of strhost.tools, generator-flavored:

1. **H1 + 2-sentence lede**
2. **The generator** (above the fold) — form on left, **live preview pane on right**
3. **Action buttons** — Download PDF / Copy text / Generate Pinterest pin
4. *In-content ad slot*
5. **"How it works"** (≈300 words)
6. *Email-capture card — soft gate; download anyway*
7. **"How to use this tool"**
8. **FAQ**
9. *Contextual STR Ledger CTA*
10. *Affiliate match — Touch Stay, Canva Pro, etc.*
11. *Footer ad slot*
12. **Related generators**
13. *Cluster funnel block*
14. *Funnel band*
15. *Footer*

**Word-count target:** 1,500–2,000 words across bolded sections.

**Schema.org:** `WebApplication` + `FAQPage` per tool; `Article` per scenario template page.

---

## 8. Generator interaction model

### PDF generators (tools 1–4)

- Form inputs → live HTML preview that approximates the PDF visually
- "Download PDF" triggers full `pdf-lib` build → blob → download
- URL state encodes inputs (shareable, "look at the welcome book I made")
- Optional email capture before download (soft gate; if user closes the modal, PDF still downloads)

### AI generators (tools 5–7)

- Form → POST to `/api/generate-*` Node.js endpoint on Hostinger
- Server:
  - Checks rate limit (MySQL-backed: 5/hr/IP without email, 50/day with verified email)
  - Calls OpenAI Chat Completions API (GPT-4o-mini) with prompt template + user inputs
  - Streams response back to client (SSE)
- Client renders streamed output in preview pane; "Copy" / "Regenerate" buttons
- All prompts versioned in `src/lib/ai/prompts/` and unit-tested for output shape

### Pinterest pin generator (cross-cutting)

- Every generator output also produces a "Generate Pinterest pin" action
- Reuses Excel-Templates' Pinterest UI kit (`design-system/ui_kits/pinterest/`)
- Server-side OG-image-style render via Satori at request time → branded pin → download
- Drives social distribution loop

---

## 9. Programmatic page system

**`src/data/templates.json` shape (~100 scenarios):**

```json
{
  "late-checkout-request": {
    "category": "guest-message",
    "scenario": "Guest requests late checkout",
    "tone": "polite-firm",
    "exampleResponse": "Hi {{ name }}, ...",
    "variants": ["fee-required", "first-time-allowed", "no-availability"],
    "relatedScenarios": ["early-checkin-request", "extra-night-request"],
    "lastVerified": "2026-05-05"
  }
}
```

- Per-scenario narrative copy in `src/content/templates/<slug>.mdx`
- `[scenario].astro` runs `getStaticPaths` over JSON
- Each page: scenario, recommended response, variants, when to use which, related scenarios, **link to the generator pre-filled with this scenario** (URL state)
- Index `/templates/` is a sortable/filterable directory

---

## 10. Monetization layer

**Email capture (primary):**

- PDF generators: download triggers a soft email modal. Closing it still downloads. ~30% optin per brief.
- AI generators: rate-limit reset behind email verification (5 → 50/day). Strong incentive.
- Lead magnet: "STR Guest Communication Playbook 2026" (PDF) — full template library, exportable

**Affiliate (secondary):**

- **Touch Stay** — welcome-book builder match
- **Hostfully Guidebook** — welcome-book + check-in instructions match
- **YourWelcome** — guest message generator match
- **Canva Pro** — wifi sign + design-heavy outputs
- Phase 2: Printful, Printify (printing services)
- Soft placement, after value

**STR Ledger funnel:**

- `<STRLedgerCTA tool="..." />` — Guest-XP cluster CTAs lean toward "Welcome Book" SKU + guest-comms templates in The STR Ledger

**Ads (tertiary):**

- Same two-slot pattern as strhost.tools

**Cross-cluster:**

- `<ClusterFunnelBlock currentCluster="guest-xp" />`

**Pinterest distribution:**

- Per-output pin generation (built-in viral loop)

**Forbidden:** popups, exit-intent, sticky ads, repeated CTAs.

---

## 11. Brand layer

- Tokens shared with sibling sites
- **Accent color:** hospitality-warm (warm neutrals + soft terracotta or peach accent) — distinct from finance-trust blue / ops-utility green / editorial neutral
- Type stack identical: Inter primary, Cormorant Garamond accent (gets more screen time here — guidebooks suit serif), JetBrains Mono limited (only for codes)
- Wordmark: "strguests.tools" in Inter Tight Semibold
- Generated PDFs use co-branded templates with optional "Powered by strguests.tools" footer (toggleable per the user)

---

## 12. SEO + analytics layer

Same core stack as strhost.tools, plus:

- **Pinterest meta tags** on every output and template page (`og:image` optimized for 1000×1500 vertical)
- JSON-LD: `Organization`, `WebApplication` per tool, `FAQPage` per page, **`HowTo` per template scenario**
- GA4 cross-domain
- Custom events: standard + `pdf_generated`, `pdf_downloaded`, `ai_generation_requested`, `ai_generation_completed`, `pin_generated`, `pin_shared`, `rate_limit_hit`

---

## 13. Open questions — pending user decision

1. **Domain** — confirmed `strguests.tools`?
2. ~~**AI provider**~~ → **Resolved 2026-05-05: OpenAI GPT-4o-mini** ($0.15/$0.60 per 1M tokens).
3. ~~**AI rate-limit storage**~~ → **Resolved 2026-05-05: MySQL on Hostinger** (included in Business plan).
4. **PDF library** — confirmed `pdf-lib`? (vs `jsPDF`, `pdfkit`, `pdfme`)
5. **ESP** — same as strhost.tools? (assumed yes)
6. **Co-branding on PDFs** — should outputs include "Powered by strguests.tools" footer by default? (toggleable per user, but what's the default?)

---

## 14. Build, deploy, ops

- CI: GitHub Actions — typecheck, vitest (incl. prompt tests), playwright, build, Worker tests
- Deploy preview per PR via GitHub Actions → temp staging subdomain on Hostinger (or skip preview deploys if too heavy; lint + build is sufficient gate)
- Hostinger Business shared hosting (single platform; MySQL for rate-limit)
- Static Astro sites: deployed via Git push or FTP to subdomain directories
- Node.js API: deployed via Hostinger Apps (always-on Node process)
- Bundled Cloudflare CDN enabled for static assets
- Domain registration: confirm before deploy
- **OpenAI API key** in Node.js server env (never client-side); MySQL credentials in env

---

## 15. Distribution plan

- **Pinterest** — primary channel; every output generates a pin; printables crush on Pinterest
- Twitter/X — "I built a free Airbnb [X] generator" launches
- Reddit: r/AirBnB, r/airbnb_hosts, r/AirBnBHosts
- Facebook STR host groups
- Outreach to STR YouTubers — free generator embeds (Phase 2)
- BiggerPockets forum (less GuestXP traffic but still relevant)

---

## 16. Defensibility moves

1. **~100 programmatic template pages** — long-tail "Airbnb [message] template for [scenario]" capture
2. **AI generation behind rate limit** — competitors have to fund their own LLM costs to clone
3. **Pinterest viral loop** — hard for competitors to match without design investment
4. **Embeddable widgets** (Phase 2)
5. **Annual data report** — "STR Guest Communication Benchmark 2026"
6. **Multilingual generation** (Phase 2) — guest-comms in Spanish/French/German via AI

---

## 17. Out of scope (Phase 2+)

- Multilingual templates and AI generation
- Native print-shop integration (Printful/Printify)
- User-saved generations (no DB)
- Realtime collaboration on welcome books (no auth)
- Embed widgets (mechanical extraction later)
- Real PDF lead magnet (stub at launch)
- Custom-domain hosted welcome books (would be a SaaS — explicitly out)

---

## 18. Bridge to The STR Ledger + cluster

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)         [you are here]
thestrledger.com → Financial backbone (every stage)
```

Every page renders `<ClusterFunnelBlock />` + `<STRLedgerCTA />`. Generated PDFs may carry a "Powered by strguests.tools" footer linking back (toggleable).
