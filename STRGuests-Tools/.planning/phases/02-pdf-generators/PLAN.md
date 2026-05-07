# Phase 2 — PDF Generators (Tools 1–4) — PLAN

**Status:** active · **Started:** 2026-05-06

## Goal
Four client-side PDF generators live, each with live preview. Soft email-gate modal pattern verified across all four. PdfDownloadButton wires generator output to download + capture flow.

## Foundation (already in place from Phase 1)
- `src/lib/pdf/base.ts` — `createBaseDoc`, `drawHeader`, `drawFooter`, `COLORS`
- `src/lib/pdf/types.ts` — `PdfMeta`, `DrawHeaderOptions`, `DrawFooterOptions`
- `src/components/generator/PdfDownloadButton.astro` — soft email-gate modal **already implements Task 15**
- `src/components/chrome/Layout.astro` — page chrome with SEO/JSON-LD
- `src/components/funnel/EmailCaptureCard.astro` — secondary capture
- `src/components/ads/AdSlot.astro` — monetization
- `src/data/tools.json` — 7-tool catalog

## Pattern (every generator follows this)
1. **Builder lib** at `src/lib/pdf/<slug>.ts` — pure function `build<Name>Pdf(input): Promise<Uint8Array>`
2. **React/Astro form component** at `src/components/generator/<Name>Form.tsx` — typed inputs with live preview
3. **Astro page** at `src/pages/<slug>.astro` — Layout + form + sidebar + AdSlot + EmailCaptureCard + STRLedgerCTA + PdfDownloadButton
4. **MDX copy** at `src/content/tools/<slug>.mdx` — H2 sections "How it works", "How to use", FAQ
5. **Test** at `tests/pdf/<slug>.test.ts` — magic bytes, metadata, basic rendering invariants
6. **Browser registration** — page emits inline script that registers `window.__strguests.generatePdf[<slug>]`

## Tasks

### Task 11 — House Rules PDF Generator
**Inputs:** propertyName, address, rules (string[]), checkInTime, checkOutTime, hostName, contactPhone, hostSignature?
**Output:** Single-page Letter PDF, branded header, numbered rules with checkboxes, footer with check-in/out times.
**Files:**
- `src/lib/pdf/house-rules.ts` — `buildHouseRulesPdf(input)`
- `src/components/generator/HouseRulesForm.tsx` — form + live preview iframe
- `src/pages/house-rules-pdf.astro`
- `src/content/tools/house-rules-pdf.mdx`
- `tests/pdf/house-rules.test.ts`

### Task 12 — Welcome Book Builder
**Inputs:** propertyName, hostName, wifi {ssid, password}, sections (array of {heading, body}), localPicks (array of {name, category, note}), checkout, emergency contacts
**Output:** Multi-page PDF, cover + TOC + sections + local picks + emergency page.
**Files:**
- `src/lib/pdf/welcome-book.ts` — `buildWelcomeBookPdf(input)`
- `src/components/generator/WelcomeBookForm.tsx`
- `src/pages/welcome-book.astro`
- `src/content/tools/welcome-book.mdx`
- `tests/pdf/welcome-book.test.ts`

### Task 13 — Wi-Fi Sign Generator
**Inputs:** propertyName, ssid, password, template ('minimal' | 'cottage' | 'modern'), note?
**Output:** Single-page Letter PDF, large QR-less style cards in chosen template.
**Files:**
- `src/lib/pdf/wifi-sign.ts` — `buildWifiSignPdf(input)`
- `src/components/generator/WifiSignForm.tsx`
- `src/pages/wifi-sign.astro`
- `src/content/tools/wifi-sign.mdx`
- `tests/pdf/wifi-sign.test.ts`

### Task 14 — Check-in Instructions PDF
**Inputs:** propertyName, address, accessSteps (array of {step, description, photoDataUrl?}), doorCode?, parkingInstructions?, hostPhone, wifi {ssid, password}
**Output:** Multi-page PDF, numbered steps, optional embedded photos (data-URL via FileReader), summary card.
**Files:**
- `src/lib/pdf/check-in.ts` — `buildCheckInPdf(input)`
- `src/components/generator/CheckInForm.tsx`
- `src/pages/check-in-instructions.astro`
- `src/content/tools/check-in-instructions.mdx`
- `tests/pdf/check-in.test.ts`

### Task 15 — Soft Email-Gate Modal Pattern
**Status:** ✅ **Already implemented** in `src/components/generator/PdfDownloadButton.astro` (Phase 1 Task 5).
**Verification this phase:** Wire each of the 4 generator pages to register a `window.__strguests.generatePdf[<slug>]` function. Confirm modal opens after download, "Skip and download" closes silently, submit posts to webhook.

## Acceptance criteria
- `pnpm test` green for new builder libs (4 new test files).
- `pnpm typecheck` clean.
- `pnpm dev` serves all 4 routes; clicking "Download PDF" produces a valid PDF and opens modal.
- Each PDF opens in OS preview without errors.
- All 4 pages have JSON-LD WebApplication + FAQPage in head.

## Sequencing
Tasks 11 → 12 → 13 → 14 in order (each commit atomic, lib + page + test + mdx). Task 15 verification rolls into each of 11–14 via the registration script.

## Out of scope this phase
- Pinterest pin generation (Phase 5).
- AI generators (Phase 3).
- Programmatic template pages (Phase 4).
- Real OG images (Phase 5).
