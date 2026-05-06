# strguests.tools — REQUIREMENTS

Derived from [design spec](../docs/superpowers/specs/2026-05-05-strguests-tools-design.md). Cluster-shared requirements (R2 page template, R5 brand, R6 monetization core, R7 SEO, R8 deploy) inherit from [STRHost-Tools/.planning/REQUIREMENTS.md](../../STRHost-Tools/.planning/REQUIREMENTS.md). Local extensions are explicit per requirement.

---

## R1 — Seven generators ship

| ID | Tool | Type | Primary keyword | Route |
|----|------|------|-----------------|-------|
| R1.1 | House rules PDF generator | PDF (client) | "airbnb house rules pdf" | `/house-rules-generator` |
| R1.2 | Welcome book builder | PDF (client) | "airbnb welcome book template" | `/welcome-book-builder` |
| R1.3 | Wifi sign generator | PDF (client) | "airbnb wifi sign template" | `/wifi-sign-generator` |
| R1.4 | Check-in instructions PDF | PDF (client) | "airbnb check in instructions template" | `/checkin-instructions` |
| R1.5 | Listing description generator | AI (server) | "airbnb listing description generator" | `/listing-description-generator` |
| R1.6 | Review response generator | AI (server) | "airbnb review response generator" | `/review-response-generator` |
| R1.7 | Guest message template generator | AI (server) | "airbnb message template" | `/message-template-generator` |

**Tools 1–4** run client-side via `pdf-lib`. **Tools 5–7** call Node.js Express endpoints on Hostinger that wrap the OpenAI SDK.

**Verification:** Vitest green for PDF generators (output buffer validation); Playwright smoke green for each route; AI endpoints respond to POST with valid JSON envelope.

---

## R2 — Per-tool page template (extends cluster R2)

Inherits the canonical 12-element template from strhost.tools. **strguests-specific:**

- Generator render replaces calculator render (#2): **form on left, live preview pane on right**
- **Action buttons row (#3)** immediately after the generator: Download PDF / Copy text / Generate Pinterest pin

Net layout: 13 elements. Word-count target 1,500–2,000 words across bolded sections.

**Verification:** DOM presence test confirms preview pane renders alongside form; action buttons row contains all three actions.

---

## R3 — Generator interaction model

*Replaces strhost.tools R3 calculator UX.* Three sub-models:

### R3.1 — PDF generators (tools 1–4)

- Form-on-left with checkboxes / text inputs / image uploads
- Live preview pane on the right (renders the PDF inline)
- Action buttons: Download PDF (`pdf-lib` buffer → `<a download>`), Copy text (clipboard), Generate Pinterest pin (Satori → PNG)
- Soft email gate on download — modal asks for email; close button still downloads (per spec §10)

### R3.2 — AI generators (tools 5–7)

- Form-on-left with style toggles + context fields (property name, tone, length)
- Live preview pane: streaming or single-shot result display
- Action buttons: Copy text, Regenerate, Generate Pinterest pin
- Rate limit: 5/hr/IP without email; 50/day with verified email
- AI endpoint POST `/api/generate-{listing|review|message}` returns `{ result, tokensUsed, requestsRemaining }`

### R3.3 — Pinterest pin generator (cross-cutting)

- Reusable per-output pin generation via Satori
- Shared component `<PinterestPinButton output="..." template="..." />`
- Runs on the server as part of OG image build, on demand for AI outputs

**Verification:** Each generator's interaction model verified via Playwright; rate limit enforced (test with mock IP); pin button produces a 1000×1500 PNG.

---

## R4 — Programmatic page system (~100 message-template scenarios)

- Data source: `src/data/templates.json` — name, category, scenario, exampleInput, exampleOutput, lastVerified
- ~100 programmatic pages via `getStaticPaths` over the JSON
- Per-scenario narrative MDX in `src/content/templates/<scenario>.mdx` (5 sample MDX at launch; rest fall back to template)
- Index page at `/templates/` is a sortable + filterable list (category filter, search)

**Verification:** Build produces ~100 `/templates/<scenario>/` HTML files; index lists all; filter works.

---

## R5 — Brand layer (extends cluster R5)

*Inherits brand tokens, type stack, JetBrains Mono numerics from strhost.tools R5.*

**Cluster-specific:**
- **Accent color:** hospitality-warm (warm neutrals + soft terracotta or peach accent — distinct from finance-trust blue / ops-utility green / editorial neutral; HEX TBD)
- Wordmark: "strguests.tools" in Inter Tight Semibold
- **Type stack:** Cormorant Garamond gets more screen time here (guidebooks and welcome books suit serif); JetBrains Mono limited to codes (wifi passwords, door codes)
- Generated PDFs use co-branded templates with optional "Powered by strguests.tools" footer (toggleable per user; default TBD per [PROJECT.md open question 5](PROJECT.md))

---

## R6 — Monetization layer (extends cluster R6)

*Inherits AdSlot, EmailCaptureCard, STRLedgerCTA, FunnelBand, ClusterFunnelBlock contracts from strhost.tools R6.*

**Local additions:**

- **`<PdfDownloadButton />`** — triggers `pdf-lib` build + soft email modal (downloads anyway on close); emits `pdf_downloaded` GA4 event
- **`<PinterestPinButton output="..." template="..." />`** — generates 1000×1500 PNG via Satori; opens Pinterest share intent
- **`<AiRateLimitNotice />`** — shows current rate-limit status on AI generator pages; CTAs to verify email if exhausted

**Affiliate (secondary, soft):**
- Touch Stay (welcome-book builder match)
- Hostfully Guidebook (welcome-book + check-in)
- YourWelcome (guest message generator)
- Canva Pro (wifi sign + design-heavy)
- Phase 2: Printful, Printify

**Lead magnet:** "STR Guest Communication Playbook 2026" (PDF)

**Verification:** PdfDownloadButton modal appears + closes-still-downloads; PinterestPinButton produces valid PNG; AiRateLimitNotice shows correct remaining count.

---

## R7 — SEO + analytics

*Inherits from strhost.tools R7.* **Cluster-specific events:**

- `pdf_downloaded`, `text_copied`, `pin_generated` — generator outputs
- `ai_generation_completed`, `ai_rate_limit_hit`, `email_verified` — AI flow
- `template_scenario_viewed` — programmatic page

**Verification:** GA4 receives events; Lighthouse SEO ≥ 95 on tool pages and template pages.

---

## R8 — Build, CI, deploy (extends cluster R8)

*Inherits CI pipeline + FTP deploy from strhost.tools R8.* **Local extension:**

- **R8.1 — AI server deploy** — Node.js Express app deployed alongside static dist on Hostinger Apps
- **R8.2 — Server schema migration** — `server/db/schema.sql` runs idempotently on deploy: `rate_limits`, `email_verifications`, `generation_logs` tables in MySQL
- **R8.3 — OpenAI key + env vars** — secrets stored as Hostinger env vars; never committed

**Verification:** Push to `main` deploys both static dist + Node Express app; `/api/generate-*` endpoints respond with 200 to valid POST; rate-limit table populated.

---

## R9 — Performance, accessibility

*Inherits from strhost.tools R9 + R10.* **Cluster-specific:**

- `pdf-lib` lazy-loaded only on PDF generator pages
- Live preview pane updates debounced (200ms) to avoid PDF-rebuild thrash
- AI endpoint timeout: 30s (OpenAI default); error UI for timeouts
- axe-core: zero serious violations on every generator page

---

## R10 — AI safety + cost control

- Per-IP rate limit before email verification (5/hr) prevents anonymous abuse
- Per-email rate limit after verification (50/day) caps cost per user
- Token-budget tracking per request; alert if monthly burn exceeds threshold
- Prompts are versioned in `server/lib/ai/prompts/<tool>.ts`; review committed prompt changes
- No PII in prompt logs (mask emails, addresses) — log only tool, tokens, status

**Verification:** Rate-limit logic unit-tested; prompts committed and code-reviewed; logs do not contain plaintext PII.
