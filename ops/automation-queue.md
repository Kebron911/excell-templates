# Automation Queue — The STR Ledger

> **Scope:** everything Claude builds so Daniel doesn't have to click it. Paired with [user-manual-todo.md](user-manual-todo.md) — human actions gate each phase, Claude executes the automation, then a review gate returns to human.
>
> **Status convention:** `⏳ blocked on <prereq>` / `🔨 in progress` / `✅ done` / `🟡 needs review`. Update this file as work moves.
>
> **API-risk flags:** some third-party APIs (Etsy Open API, Influencersoft) have restrictions or may not exist. Items flagged `⚠️ API-risk` may fall back to Playwright browser automation, or worst case to a copy-paste SOP in `docs/runbooks/`.

---

## Phase A — Credentials & secrets (Claude, ~1 hr build time)

| # | Task | Tech | Prereq (human) | Review gate |
|---|---|---|---|---|
| A1 | Bulk-import all credentials from `ops/credentials-inventory.md` into the existing Vaultwarden instance | `bw` CLI + JSON import | Vaultwarden URL + API token in inventory | — |
| A2 | Generate restricted Stripe API keys (1 IS, 1 n8n), store in Vaultwarden | Stripe CLI (`stripe api_keys create`) | 1.2 Stripe CLI key added | — |
| A3 | Update Stripe statement descriptor to `STR LEDGER TEMPLATES`, enable Stripe Tax with `txcd_10301000` default, set origin address | Stripe API | A2 | verify CA ~8.6% / DE ~0% via API test charge |
| A4 | Create Etsy API app OAuth dance — exchange code for access + refresh tokens, store in Vaultwarden | Etsy Open API v3 | 1.1 Etsy OAuth secret added | ⚠️ API-risk |
| A5 | Create Gumroad API handshake test | Gumroad API | 1.3 token | — |

---

## Phase B — DNS (Claude, ~1 hr build time)

| # | Task | Tech | Prereq | Review gate |
|---|---|---|---|---|
| B1 | DNS record values for `thestrledger.com` zone: Google Workspace MX + SPF + DKIM + DMARC, `blog.thestrledger.com` CNAME (Ghost), `app.thestrledger.com` CNAME (IS), `n8n.thestrledger.com` CNAME (VPS reverse proxy), Pinterest domain-verify TXT, root A record to IS if IS is hosting the hub. Daniel pastes into Hostinger hPanel DNS by hand. | Hostinger hPanel DNS (manual) | 1.5 Hostinger DNS access confirmed | `dig` each record resolves correctly |

---

## Phase C — Infrastructure as code (Claude, ~4 hrs build time)

| # | Task | Tech | Prereq | Review gate |
|---|---|---|---|---|
| C1 | Ansible playbook: VPS hardening (non-root user, SSH key, UFW 22/80/443, fail2ban, unattended-upgrades) | Ansible | 1.6 VPS up + SSH key | `ssh-audit` + `lynis audit system` clean |
| C2 | Docker compose for n8n (image, volumes, encryption key, basic auth, backup mount) | docker-compose.yml in git | C1 | `curl localhost:5678` returns 401 basic-auth |
| C3 | Caddy/nginx reverse proxy + systemd unit for `n8n.thestrledger.com` → `localhost:5678` (Let's Encrypt for SSL) | Caddyfile or nginx.conf | C2 + B1 | `https://n8n.thestrledger.com` prompts basic-auth |
| C4 | Import STR-Ledger credentials into existing Vaultwarden (no new instance needed) | `bw` CLI | A1 | spot-check 3 entries |
| C5 | Weekly cron on VPS: dump `/var/lib/docker/volumes/n8n_data` + Vaultwarden `/bw-data` (if colocated) → encrypt with age → upload to Google Drive | `restic` or `rclone` + `age` | C1 | dry run succeeds, backup lands in Drive |

---

## Phase D — Data layer (Claude, ~2 hrs build time)

| # | Task | Tech | Prereq | Review gate |
|---|---|---|---|---|
| D1 | Create Airtable base "STR Platform — Master" with 5 tables (Products, Customers, Orders, Content, Metrics), all fields/views/formulas per `infrastructure/airtable/schema.md` | Airtable Metadata API ⚠️ **requires Team tier ~$20/mo** | 1.4 MCP token | MCP can read/write a test record in each table |
| D2 | Seed test data for QA (3 sample products, 2 sample customers, 2 sample orders) | Airtable MCP | D1 | rows visible in UI |

---

## Phase E — n8n workflows (Claude, ~3 hrs build time once C3 is done)

Workflows are JSON — Claude imports via n8n REST (`POST /api/v1/workflows`) or CLI `n8n import:workflow`. No UI clicking.

| # | Workflow | Spec | Prereq | Review gate |
|---|---|---|---|---|
| E1 | W01 Stripe order ingestion | `infrastructure/n8n/workflows/W01-*.md` | C3, D1, A2 | Stripe test charge → Airtable row exists within 10s |
| E2 | W02 Gumroad order ingestion | `W02-*.md` | C3, D1, A5 | Gumroad test sale → Airtable row |
| E3 | W04 Subscriber sync (IS ↔ Airtable) | `W04-*.md` | C3, D1, 4.2 IS path | IS subscribe → Airtable Customers row within 10s |
| E4 | W05 Product publisher (Airtable Product.status=Published → push to Etsy + Gumroad) | `W05-*.md` | C3, D1, A4, A5 | change test product status → listings update |
| E5 | W08 Lead magnet delivery | `W08-*.md` | C3, A3 (SendGrid/SES or IS email) | form submit → email arrives in 30s with PDF |
| E6 | W17 Weekly backup | `W17-*.md` | C3, C5 | Sunday 2am → `backups/str-platform/YYYY-MM-DD/` lands in Drive with Products/Customers/Orders/IS CSVs |

---

## Phase F — Asset generation (Claude, ~4 hrs build time)

| # | Task | Tech | Prereq | Review gate |
|---|---|---|---|---|
| F1 | Brand asset pack: logo (square + horizontal), Etsy banner 1600×213, Etsy icon 500×500, Excel cover header 1000×400 | Python Pillow + SVG templates keyed to `brand/brand-decisions.md` palette | — | 5.1 brand assets approved |
| F2 | Etsy buyer companion PDF (1-page upgrade insert) | HTML template → WeasyPrint → PDF | F1 | attached to every Etsy listing in G3 |
| F3 | Excel templates × 5 SKUs with brand theme, formulas, data validation, cell protection, cover header | `openpyxl` or `xlsxwriter` | 3.1 briefs ready | 5.2 QA passed per SKU |
| F4 | Etsy thumbnails: 5 per SKU × 5 SKUs = 25 images, 2000×2000 | HTML templates (hero / inside / before-after / use-case / trust-signal) → Puppeteer screenshot → PNG | F1 | 5.4 thumbnails approved per SKU |
| F5 | Pinterest pin images: 30 pins, 1000×1500 | HTML templates → Puppeteer | F1, G7 copy ready | 5.7 pins approved in batches |

---

## Phase G — Publishing (Claude, ~4 hrs build time)

| # | Task | Tech | Prereq | Review gate |
|---|---|---|---|---|
| G1 | Etsy shop setup: upload banner + icon, set About (from `copy/etsy-listings/shop-about.md`), set Policies | Etsy API `updateShop` / Shop Sections | A4, F1 | shop page renders correctly |
| G2 | Etsy listing creation × 5: draft with title, description, 13 tags, attributes, price | Etsy API `createDraftListing` ⚠️ API-risk (requires approved app) | A4, F3, 5.2 QA passed, 5.3 copy approved | all 5 drafts visible in Etsy seller dashboard |
| G3 | Etsy listing file + image attachment: master .xlsx + etsy-upgrade-insert.pdf + license + how-to + preview; 5 thumbnails | Etsy API `uploadListingFile` + `uploadListingImage` | G2, F2, F4 | 5.4 thumbnails approved |
| G4 | Etsy listing publish (flip drafts to active) | Etsy API `updateListing` state=active | G3, 5.8 launch approved | listings live, test purchase from secondary account completes |
| G5 | Gumroad product creation × 5 (mirror of Etsy, Full variants) | Gumroad API | A5, F3 | products visible at `gumroad.com/thestrledger` |
| G6 | IS email sequence (hero magnet nurture, 9 emails with triggers + branching) | IS API if available, else Playwright | 4.2 IS path, 5.5 email approved | test subscribe → all 9 emails fire correctly |
| G7 | Ghost blog: install theme, configure brand colors/fonts, create About page, publish 3 blog posts with featured images + SEO meta | Ghost Admin API | 1.7 Ghost paid + key, 5.6 blog posts approved | posts live at `blog.thestrledger.com` |
| G8 | Pinterest: claim domain (after B1 TXT record lives), create 5 boards, schedule 30 pins across 3 months | Pinterest API v5 | 4.1 Pinterest account + OAuth, B1, F5 | 30 pins visible in Pinterest scheduled queue |
| G9 | Facebook Group creation + rules + 3 entry questions + pinned welcome post | Meta Graph API (limited — may need Playwright) | 4.1 FB Page | group live; Daniel invites 5 seed members manually |

---

## Phase H — Integration testing (Claude, ~2 hrs)

| # | Task | Tech | Prereq | Review gate |
|---|---|---|---|---|
| H1 | End-to-end purchase test script: buys $1 test product on own site → polls Airtable + IS + inbox → asserts all 3 fired | Python `requests` / `pytest` | G1–G7 | passes CI |
| H2 | Etsy purchase test (friend buys from Etsy) | manual trigger + automated assertion of Airtable row | G4 | passes |
| H3 | Backup verification: script checks Google Drive `backups/str-platform/` and `backups/vaultwarden/` have fresh files from last 7/30 days | `rclone ls` + date parsing | C5, 6.3 first export | green |
| H4 | Monitoring dashboard: simple Airtable view or standalone HTML page showing yesterday's orders, refunds, workflow errors, conversion rate | Airtable formulas or a static generator pulling from Airtable API | D1 | Daniel can open it in 1 click |

---

## Phase I — Cutovers (Claude, scheduled, not build-once)

| # | Task | When | Tech |
|---|---|---|---|
| I1 | Flip Etsy shop from "On vacation" to Live | after G4 + 5.8 | Etsy API |
| I2 | Publish Wave 2 (TAX-003 + TAX-002 Lite) | Day 14 | same pipeline as Wave 1 |
| I3 | SEO pass on all 5 listings (title / tags / description scoring) | Day 13 | script that pulls listings via API, scores keyword density, proposes revisions |
| I4 | Blog post auto-pin to Pinterest (W16) | ongoing | n8n workflow |

---

## Dependency diagram (text form)

```
Human Phase 1 → A1, A2, A3, A4, A5 (credentials)
           1.5 → B1 (DNS)
           1.6 → C1 → C2 → C3 → E1..E6 (infra + workflows)
                  C1 → C4 (vault import)
                  C1 → C5 (backups)
           1.4 → D1 → D2 (data)
Human Phase 3 (briefs) → F3 (xlsx) → 5.2 QA → G3 (file upload) → G4 (publish)
                      → F4 (thumbnails) → 5.4 approve → G3
F1 (brand) → F2 (PDF) → G3
              F4, F5
                F5 → G8 Pinterest
Human 4.2 → G6 email sequences
G4 + G5 + G6 + G7 → 5.8 launch approved → G4 publish + I1 flip live
```

---

## Open API-risk items

1. **Etsy Open API v3** — requires app approval. First-time apps may be rate-limited or sandboxed. If full publishing API isn't available, fall back to: (a) CSV listing import (Etsy supports bulk upload for shops on some tiers), or (b) Playwright automation of the Etsy UI.
2. **Influencersoft API** — unknown until surveyed in human task 4.2. Fallback order: native API → Zapier/Make → Playwright → SOP.
3. **Airtable Metadata API** — Team tier ($20/mo) required for schema creation via API. On free tier, D1 falls back to manual schema clicking (moved to user-manual-todo.md if needed).
4. **Meta Graph API for FB Groups** — limited surface. G9 likely falls back to Playwright or a 15-min human SOP.
5. **Pinterest API v5** — full-featured, no known blockers.
6. **Gumroad API** — stable, no known blockers.
7. **Ghost Admin API** — full-featured, no known blockers.
8. **Stripe API** — full-featured, no known blockers.
9. **Hostinger DNS** — manual via hPanel UI (no public API for shared hosting plans). Claude provides record values; Daniel pastes.

If any ⚠️ API-risk item falls back to browser automation, Claude builds the Playwright script. If it falls back further to a human SOP, that SOP gets added to `user-manual-todo.md` with a note on why.

---

## What's NOT in this queue (because it's in user-manual-todo.md)

- Regulatory/KYC fields (bank, tax ID, gov ID) — human
- 2FA enrollment — device-bound
- Offline credential backups — physical
- Brand decisions + template briefs + deductions list — creative/expertise
- OAuth consent first-clicks — one-time human
- Review/approval gates — go/no-go judgment
- FB Group live presence (comments, conversations) — first 90 days

Everything else lives here.
