# Cluster pre-launch backlog

> Items deferred while the cluster is in **Coming-Soon mode** (lead capture +
> Stripe-direct sales paused on all 6 live sites). Etsy purchases on
> thestrledger.com remain enabled. GA4 fires on all 6 sites.
>
> Last updated: 2026-05-16

---

## ✅ Recently completed

- **#4 strmanuals `/dl/` deploy gap** — root cause: `private/` is gitignored, so PDFs never reach CI's build. Workaround applied: all 6 PDFs (5 paid manuals + 1 free explainer) uploaded out of band to `/home/u470667024/domains/strmanuals.com/public_html/dl/c30ca3787771e91e0fb21716146e2cea/` via SCP. Every `/dl/<HASH>/<slug>/v1.pdf` URL now returns 200 with correct Content-Length. **This means paid Stripe customers from the last week onward have working download links** — but anyone who bought before 2026-05-15 may have gotten broken links and may need a manual re-send. Cross-reference Stripe `checkout.session.completed` events vs the `_data/leads-*.log` on Hostinger to find them.
- **IS API contract investigated** — verified against the proven `STR_Stripe_InfluencerSoft_Tagger` workflow. Real endpoint is `POST https://kebron.influencersoft.com/api/AddUpdateLead`, form-urlencoded, auth via `rpsKey` body param (not `Authorization` header). Both new workflow JSONs updated.
- **n8n activation guide** — `ops/n8n-workflows/ACTIVATION.md` walks through SMTP cred, Google Sheets cred, both workflow imports, end-to-end test, and the un-pause sequence per site.

---

## 1 — Bring strmanuals lead capture + sales online (HIGH)

**Now code-side ready.** What remains is user-only (n8n + IS UI).

**Status:**
- ✅ `ops/n8n-workflows/STR_StrManuals_LeadMagnet_Tax.json` scaffolded with the real IS API contract
- ✅ Tax-explainer PDF live at `https://strmanuals.com/dl/c30ca3787771e91e0fb21716146e2cea/free/tax-loophole-explainer.pdf`
- ✅ 5 paid manual PDFs also live at the same hash path
- ⏳ Workflow not yet imported / activated in n8n
- ⏳ SMTP credential not created in n8n

**User remaining work** (see `ops/n8n-workflows/ACTIVATION.md` for the full walkthrough):

1. Create an n8n SMTP credential (Hostinger Business → `hello@thestrledger.com`)
2. Create the Google Sheet "STR Lead Backup" + n8n Google Sheets OAuth credential
3. Import `STR_StrManuals_LeadMagnet_Tax.json` → wire SMTP + Sheets credential IDs + Sheet ID → activate
4. End-to-end test via curl (one line in ACTIVATION.md)
5. Revert the strmanuals `/free.astro` + `EmailCapture.astro` Coming-Soon pauses. Commit + push (auto-deploys)
6. Revert `STRManuals/site/components/BuyButton.astro` `isPlaceholder = true` line so paid manuals can be purchased again (Stripe link + the n8n W01b confirmation workflow should now deliver working PDF URLs)
7. Verify by buying a manual with a throwaway email and confirming the order-confirmation email contains a working `/dl/<HASH>/...` link

---

## 2 — Migrate thestrledger.com from legacy PHP to the Astro scaffold (HIGH-LATER)

`thestrledger.com` is currently served from a hand-rolled PHP site on Hostinger at `/home/u470667024/domains/thestrledger.com/public_html/`. The Astro scaffold in this repo at `STRLedger/` is **DRAFT-gated** (`STRLedger/DEPLOY-STATUS.md` blocks deploy).

**Status today:** Legacy PHP site is in Coming-Soon mode. Lead forms paused (`_inc/lead-form.php`), Stripe/IS-direct buy CTAs hidden on `product.php` + `bundle.php`, Etsy CTAs preserved. GA4 wired via `_config/config.php` `'ga4_id' => 'G-ZSNCH6JNW2'`. Backups at `/home/u470667024/domains/thestrledger.com/public_html/_backups/pre-pause-20260515/`.

**Required to flip ownership to Astro** (per `STRLedger/DEPLOY-STATUS.md`, multi-session):

1. Match all 12 live product SKUs in `STRLedger/src/content/products/*.mdx`. Verify price, copy, image, `/products/{SKU}/` route.
2. Migrate `/blog/*` content from legacy site (or temporarily redirect to `blog.thestrledger.com` if Ghost-hosted).
3. Verify `/free/47-deductions/` lead-magnet wiring matches the same provider as live (n8n → IS).
4. Verify Etsy "Buy now" links still resolve.
5. Soft-launch on preview URL first (e.g., `preview.thestrledger.com`).
6. Flip `STRLedger/DEPLOY-STATUS.md` from DRAFT to READY.
7. Trigger `deploy-strledger.yml`. Confirm SMOKE.md probes pass.
8. **Important:** the Astro deploy SFTPs to `STRLEDGER_DOC_ROOT` (likely overwrites the legacy site). Back up legacy first.
9. After cutover: archive legacy `_backups/pre-pause-*` + verify `submit.php` no longer reachable.

---

## 3 — Activate STR_Cluster_Lead_Router for the 4 tool sites (MEDIUM)

**Now code-side ready.** Scaffolded at `ops/n8n-workflows/STR_Cluster_Lead_Router.json`.

**Status:**
- ✅ IS API contract correct (form-urlencoded, AddUpdateLead, rpsKey auth)
- ✅ Magnet dispatch table seeded for 8 lead magnets across the 5 sister sites
- ✅ Graceful "PDF not yet hosted" messaging — workflow can activate before all PDFs exist
- ✅ CORS-aware webhook entry
- ✅ Parallel fan-out (IS + SMTP + Sheets fire concurrently)
- ✅ 303 redirect on success / JSON error on bad input — works for both fetch() and plain HTML form submit

**User remaining work** (see `ops/n8n-workflows/ACTIVATION.md`):

1. Re-use the SMTP + Sheets credentials from Workflow A (no new creds needed)
2. Import `STR_Cluster_Lead_Router.json` → wire credentials → activate
3. End-to-end test via curl
4. Set GitHub repo secrets:
   - `PUBLIC_ESP_WEBHOOK` (strhost/strbuyers/strguests) → `https://n8ncde.cdeprosperity.com/webhook/cluster-lead-router`
   - `PUBLIC_ESP_ENDPOINT` (strops) → same value
5. Revert the Coming-Soon pauses:
   - `packages/ui-funnel/src/EmailCaptureCard.astro` — restore `<form>` block
   - `packages/email-gate/src/EmailGate.astro` — restore `<form>` block
   - `STRGuests-Tools/src/components/generator/PdfDownloadButton.astro` — restore `modal.showModal()`
   - `STROps-Tools/src/pages/get-the-*.astro` (3 files) — restore inline `<form class="magnet-capture">`
6. Commit + push. All 4 tool sites auto-redeploy.

**Per-magnet PDF authoring** (gradual, no rush):
- Author each PDF, SCP to `/home/u470667024/domains/<site>/public_html/pdfs/<magnet>.pdf`
- In n8n, flip `pdf_hosted: true` for that magnet in the dispatch table
- Done. The router auto-switches to real-link emails for that magnet.

**IS automation per magnet** (after activation, gradual):
- For each magnet, create an IS automation triggered by tag `magnet:<slug>` that drives the drip sequence.

---

## 4 — strmanuals `/dl/` deployment gap — ✅ DONE (workaround)

Status: PDFs uploaded out of band to Hostinger. All `/dl/<HASH>/<slug>/v1.pdf` URLs return 200.

**Optional long-term fix** (not blocking anything now):
- Either: Git-LFS the PDFs into the repo and unblock `private/` from `.gitignore` so CI's `copy-pdfs-to-dist.mjs` copies them into `dist/dl/` and rsync uploads them automatically on every deploy.
- Or: switch fully to n8n-canonical PDF delivery (n8n attaches PDF binary to email, no `/dl/` URLs at all). Removes the hash-rotation tax but couples PDF delivery to email working.

Either path is a separate session. The current workaround (manual SCP per new PDF) is fine for low-volume.

---

## 5 — Re-enable analytics events that depend on lead capture (LOW)

After #3 lands, GA4 `email_captured` and `pdf_downloaded` events resume firing through the active form handlers. No code change needed — they're already wired in `EmailCaptureCard` and `PdfDownloadButton`. Verify in GA4 Realtime after un-pausing.

---

## 6 — strguests welcome-book PDF modal form-in-DOM (COSMETIC)

`STRGuests-Tools/src/components/generator/PdfDownloadButton.astro` disables `modal.showModal()` but leaves the `<dialog>` element + `<form>` in the rendered HTML. The form is unreachable (modal never opens) but probes flag it.

To clean up: wrap the entire `<dialog>` in `{false && (...)}` so it's stripped at build time. Bonus: shrinks HTML payload on every generator page.

---

## Restore-point index — every "PAUSED" location in this repo

A single `git grep -nE 'PAUSED|FORCED:|Coming soon'` should surface all of these. Listed here for reference:

| File | What's paused | Revert when |
|---|---|---|
| `packages/ui-funnel/src/EmailCaptureCard.astro` | Form replaced with Coming-Soon panel | Backlog #3 cluster lead router live |
| `packages/email-gate/src/EmailGate.astro` | Form replaced with Coming-Soon stub | Backlog #3 cluster lead router live |
| `STRGuests-Tools/src/components/generator/PdfDownloadButton.astro` | Email modal `showModal()` disabled | Backlog #3 cluster lead router live |
| `STRManuals/site/src/components/BuyButton.astro` | `isPlaceholder = true` forced | Backlog #1 strmanuals fulfillment verified |
| `STRManuals/site/src/pages/manuals/[slug].astro` | Mobile sticky Buy bar wrapped `{false && ...}` | Backlog #1 strmanuals fulfillment verified |
| `STRManuals/site/src/components/EmailCapture.astro` | Form replaced with Coming-Soon panel | Backlog #1 strmanuals W08 workflow live |
| `STRManuals/site/src/pages/free.astro` | `FORM_ACTION = ''` forced | Backlog #1 strmanuals W08 workflow live |
| `STRLedger/src/pages/products/[slug].astro` | `showStripeBuy = false` | Backlog #2 cutover (no-op until then) |
| `STRLedger/src/pages/free/47-deductions.astro` | Forced mailto fallback | Backlog #2 cutover (no-op until then) |
| `STROps-Tools/src/pages/get-the-cleaner-sop.astro` | Form replaced | Backlog #3 cluster lead router live |
| `STROps-Tools/src/pages/get-the-maintenance-checklist.astro` | Form replaced | Backlog #3 cluster lead router live |
| `STROps-Tools/src/pages/get-the-supply-par.astro` | Form replaced | Backlog #3 cluster lead router live |
| `.github/workflows/deploy-strmanuals.yml` | Stripe-link grep verify commented out | Backlog #1 strmanuals fulfillment verified |
| `STRManuals/site/scripts/smoke.mjs` | Stripe-link assertion replaced with Coming-Soon assertion | Backlog #1 strmanuals fulfillment verified |
| **(Hostinger SFTP, not in git)** `/home/u470667024/domains/thestrledger.com/public_html/_inc/lead-form.php` | Replaced with Coming-Soon include | Backlog #2 cutover OR re-wire legacy form |
| **(Hostinger SFTP, not in git)** `/home/u470667024/domains/thestrledger.com/public_html/product.php` | "Buy on thestrledger.com" CTAs → "Coming soon" spans | Backlog #2 cutover OR re-wire legacy IS checkout |
| **(Hostinger SFTP, not in git)** `/home/u470667024/domains/thestrledger.com/public_html/bundle.php` | Same as product.php | Backlog #2 cutover OR re-wire legacy IS checkout |

Legacy strledger backups are at `_backups/pre-pause-20260515/` on the Hostinger box. To restore the legacy site:
```bash
ssh -p 65002 -i ~/.ssh/hostinger_ed25519 u470667024@195.35.15.247
cd /home/u470667024/domains/thestrledger.com/public_html
cp _backups/pre-pause-20260515/lead-form.php _inc/lead-form.php
cp _backups/pre-pause-20260515/product.php product.php
cp _backups/pre-pause-20260515/bundle.php bundle.php
# Note: config.php in backup has ga4_id empty; current production has G-ZSNCH6JNW2 — only restore if you want to drop GA4 too
```

---

## PinForge — final 2 manual steps (added 2026-05-17)

PinForge Phase A code-side complete and merged. Two user-only steps remain before live use:

- [ ] **Deploy `gemini-pin-image.json` to n8n** — workflow file at `Tools/N8n-Builder/workflows/gemini-pin-image.json` with `Tools/N8n-Builder/workflows/gemini-pin-image.README.md` (includes curl smoke test). Import into n8n UI, activate the webhook, set Gemini API credentials, note the production webhook URL.
- [ ] **Set live env + run smoke test** — add `N8N_BASE_URL` and `N8N_PIN_KEY` to `Excel-Templates/.env` (matching the deployed workflow), then:
  ```bash
  LIVE=1 pnpm -F @str/pinforge test live/smoke
  ```
  Expect: 1 test passes. Console prints the path of a generated PNG. Open it — confirm it looks like a real Pinterest pin.

Until both done, PinForge can still generate pins with `backgroundType: solid|gradient` (no n8n needed). Image-mode falls back to Unsplash → solid if n8n is unreachable.

### Subitem — `Tools/N8n-Builder` repo decision needed

While creating the pin workflow, the local `Tools/N8n-Builder/` directory was found to have **no git history** (got `git init`'d locally). GitHub `Kebron911/n8n-builder` exists but is a **Claude Code plugin repo** (commands/skills/plugin manifest) — it does NOT contain a `workflows/` directory. The local n8n-builder is therefore a separate workspace that historically held workflow JSON exports but was never tracked or synced.

**Current local state (2026-05-17):**
- `Tools/N8n-Builder/` has a fresh `.git` with 2 commits on `main` branch (no remote):
  - `b80041e` chore(init): initial commit — gemini-blog-image-seo workflow and tests
  - `1af28b2` feat(workflows): gemini-pin-image — Pinterest 2:3 vertical sibling of blog workflow
- Files committed: `workflows/gemini-blog-image-seo.json`, `workflows/gemini-pin-image.json` (NEW), `workflows/gemini-pin-image.README.md` (NEW), test scripts, `scripts/`

**User decision needed — which option:**
1. **Push workflows into the plugin repo** at `Kebron911/n8n-builder` (it IS the n8n-builder plugin; workflows fit that scope). Would add a `workflows/` directory to that plugin.
2. **Create a new dedicated workflows repo** (e.g., `Kebron911/n8n-workflows`) and push there.
3. **Leave local-only**, treat as personal scratchpad, never push.

Whichever you pick, the new pin workflow + README are safe at commit `1af28b2` on local `main`.

**PinForge Phase A.5 (URL input mode) shipped 2026-05-17.** Pass `--input-mode url --source-url <blog-url>` to scrape + ground pin copy in source content. See `packages/pinforge/README.md` for usage.

**PinForge Phase B (REST API) shipped 2026-05-17.** New package `@str/pinforge-api` at `tools/pinforge-api/` — Fastify HTTP service with 11 endpoints, X-API-Key auth, per-key rate limit, bulk via JSON/CSV upload/Google Sheet URL, in-memory job polling, OpenAPI spec at `/docs`. Start with `PINFORGE_API_KEY=... pnpm pinforge-api:start`. See `tools/pinforge-api/README.md`. Final review fixed critical SSRF in sheet-fetcher (shadow-domain bypass) — verify the fix landed before exposing publicly.

**Phase B follow-ups (status as of 2026-05-17):**
- ✅ CORS plugin — shipped. Set `PINFORGE_API_CORS_ORIGINS=https://app.example.com,https://admin.example.com` to enable
- ✅ Webhook callbacks — shipped. Pass `callbackUrl` (bulk JSON/sheet body or `?callback_url=` query) to get a POST when the job finishes. SSRF-hardened (private/loopback/link-local IPs + `.local`/`.internal` hostnames rejected with 400)
- ⏭️ **Rate limit before auth** — WON'T FIX. Reviewer flagged "low severity". Real impact: an attacker spamming bad X-API-Key headers consumes rate-limit slots keyed on those bad values — but they can also exhaust per-IP rate-limit slots trivially with any HTTP request. Not a meaningful attack vector.
- ⏸️ **In-memory job registry has no TTL** — deferred. Acceptable for low-volume MVP (dozens of jobs/day). Swap for SQLite-backed JobStore for high-volume production. Documented in `src/jobs.ts`.
- ⏸️ **`?sync=1` path's `Promise.race` doesn't cancel `generatePin`** — deferred. Orphan continues in background until natural completion. Needs AbortSignal support in `@str/pinforge` first. Documented in `src/routes/pins.ts`.
- ⏸️ **DNS rebinding** for webhook callbacks — not protected against. Recommend running behind an egress firewall that blocks PinForge from reaching internal subnets if exposing the API to untrusted callers.

