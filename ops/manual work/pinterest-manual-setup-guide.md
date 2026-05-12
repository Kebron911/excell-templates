# Pinterest Business Manual Setup Guide

> **Manual step — Pinterest Business account creation + domain claim via meta-tag-or-DNS + Creasquare OAuth connect are all browser flows.** Once the account is claimed + connected to Creasquare, every pin schedule + analytics pull is automatable.
>
> **Last reviewed:** 2026-05-11
>
> **Account state:** ❌ pending. Per `ops/credentials-inventory.md` 2026-05-11: "Pinterest Business — pending. Domain claim pending. Connected to Creasquare (primary scheduler)."
>
> **Role in the empire:** primary cold-traffic channel. Pinterest pins → Pinterest search/feed → click → `thestrledger.com` → email capture → IS sequence → Etsy/Gumroad sale. Built-in static pins (already produced; see memory observation 823 from 2026-05-06).

---

## Pre-flight

- **Use a personal account or a fresh Business account?** Pinterest is increasingly hostile to "Business converted from Personal" accounts (algorithm de-prioritizes them). **Create a fresh Business account from scratch.** Don't convert.
- Have your brand assets ready: `brand/assets/logo-square-navy.png` for profile photo, `brand/assets/cover-pinterest.png` for cover (already produced — check `brand/assets/` first; if missing, ask Claude to render).
- **Decision deferred until Month 3:** Tailwind (Pinterest-specific scheduler with SmartLoop + Tribes). Until then, Creasquare handles Pinterest scheduling. Don't sign up for Tailwind yet.

---

## Part 1 — Create the Business account (10 min)

### 1.1 Sign up

1. Go to https://business.pinterest.com.
2. **Create a free business account.**
3. Email: `hello@thestrledger.com`.
4. Password: strong, save to Vaultwarden.
5. **Business name:** `The STR Ledger`.
6. **Business type:** "Online store" or "Media/Content publisher" (either works for a digital-template business; Pinterest doesn't gate features on this).
7. Region: US, English.

### 1.2 Profile

1. **Display name:** `The STR Ledger | Templates for Short-Term Rentals`. (Pinterest allows ~30 chars in display; keyword-rich helps discoverability.)
2. **About:** "Excel templates for short-term rental hosts. Tax, ops, marketing, acquisition. Stop reinventing the spreadsheet." (~140 chars or less; Pinterest shows the first line in profile previews.)
3. **Website:** `thestrledger.com` (don't add `https://` — Pinterest's field handles that).
4. **Profile photo:** upload `brand/assets/logo-square-navy.png`.
5. **Cover image:** upload `brand/assets/cover-pinterest.png` (1600×900 — Pinterest cover sizing).

### 1.3 Enable 2FA

1. **Settings** → **Security and login** → **Two-factor authentication** → on.
2. Authenticator app (NOT SMS).
3. Save backup codes to Vaultwarden + offline master.

→ **Tell Claude:** *"Pinterest Business account live."*

---

## Part 2 — Claim your domain (15 min)

Domain claim does two things:
1. Pinterest verifies every pin from your domain is "yours" — pins from your site get a profile link badge.
2. Unlocks Pinterest Analytics' "Conversions from your website" reports.

### 2.1 Start the claim flow

1. **Settings** → **Claim** → **Claim your website**.
2. Domain: `thestrledger.com` (root, not `www.`).
3. Pinterest offers three claim methods:
   - **Meta tag** — paste `<meta name="p:domain_verify" content="..."/>` into `<head>`.
   - **HTML file upload** — upload a specific file to the root.
   - **DNS TXT record** — add a TXT record.
4. **Recommended: meta tag.** It's the lowest-coordination option (Claude edits one Astro layout file). DNS works but adds a 5–60 min propagation wait.

### 2.2 Wire the meta tag

1. Copy the meta tag Pinterest gives you (looks like `<meta name="p:domain_verify" content="abc123..."/>`).
2. **Tell Claude the exact tag value** — Claude will add it to `src/layouts/Layout.astro` (or wherever the global `<head>` lives) and ship a deploy. Don't paste it in by hand — let the build pipeline do it so the tag survives next deploy.
3. Once deployed (Claude will confirm), back in Pinterest claim flow → **Submit for verification**.
4. Pinterest verifies within ~5 min. Status flips to "Claimed".

### 2.3 (Optional) Add `strguests.tools` as a second claimed domain

If you want pins for STR Guests Tools content to attribute correctly:

1. **Settings** → **Claim** → **Claim another website**.
2. Repeat 2.1 + 2.2 for `strguests.tools`.

→ **Tell Claude:** *"Pinterest domain claim verified for thestrledger.com (and strguests.tools if applicable)."*

---

## Part 3 — Connect Creasquare (5 min)

Creasquare is your primary scheduler (lifetime deal owned; replaces Buffer + Tailwind for now).

1. Sign in to https://app.creasquare.io with your Creasquare account.
2. **Social accounts** → **+ Connect**.
3. Pick **Pinterest** → click **Connect**.
4. OAuth flow opens at Pinterest → sign in (if not already) with `hello@thestrledger.com` → grant Creasquare access to:
   - Read profile
   - Read boards
   - Create + publish pins
5. Approve. Back in Creasquare, the Pinterest account should now appear in your connected-accounts list.

> **Note:** Creasquare's Pinterest integration is documented as "basic" per user reviews (`ops/credentials-inventory.md`). Per the Pinterest row notes, the native Pinterest scheduler (free, 100 pins / 14 days) is the documented fallback if Creasquare's Pinterest features prove limiting. **Re-evaluate at Month 3** — if Pinterest is driving ≥100 outbound clicks/mo OR ≥5 email signups/mo, consider migrating to Tailwind ($15/mo).

→ **Tell Claude:** *"Pinterest connected to Creasquare."*

---

## Part 4 — Create the 5 starter boards (10 min)

These are the buckets your pins go into. Pinterest's algorithm rewards thematic consistency per board.

In Pinterest UI → top-right `+` → **Board**:

| Board name | Description | Visibility |
|---|---|---|
| `STR Tax & Deductions` | "Short-term rental tax templates, deduction trackers, Schedule E prep — built for vacation rental hosts." | Public |
| `STR Operations` | "Cleaning checklists, vendor logs, maintenance trackers — keep your Airbnb running smoothly." | Public |
| `STR Marketing & Listings` | "Listing copy, photo guides, calendar pricing — get more bookings on Airbnb + VRBO." | Public |
| `STR Acquisition & Underwriting` | "Property analysis spreadsheets, deal underwriting tools, cap-rate calculators." | Public |
| `STR Welcome Books & Guest Comms` | "Welcome books, house rules, check-in guides — premium guest experience templates." | Public |

For each board:
- Cover image: pick the strongest pin from that board's content set (Claude can render board covers if needed).
- Don't tick "Group board" — these are owner-only for now.

→ **Tell Claude:** *"Pinterest boards created: 5 thematic."*

---

## Part 5 — Update credentials inventory (2 min)

Open `ops/credentials-inventory.md`. Update the **Pinterest Business** row:

- 2FA: ✅
- Notes: append "Domain claim verified 2026-MM-DD. Connected to Creasquare. 5 thematic boards live."

→ **Tell Claude:** *"Pinterest inventory row updated."*

---

## Trigger-tag / env-var map

| Pinterest output | Where it's used |
|---|---|
| Domain claim | Pins from `thestrledger.com` show profile badge + unlock conversion analytics |
| 5 thematic boards | Pre-built static pins (per memory obs 823 from 2026-05-06) are auto-assigned to boards by content type at publish time |
| Creasquare OAuth | Creasquare schedules pin batches → Pinterest API → published with backlink to `thestrledger.com` |
| Pinterest Analytics access | Future: n8n pin-performance-watch flow (Phase 2+) reads conversion data |

---

## Estimate

- Account + 2FA: 10 min
- Domain claim: 15 min (5 min focused + 10 min wait for deploy + verification)
- Connect Creasquare: 5 min
- Create 5 boards: 10 min
- Inventory update: 2 min
- **Total: ~40 min**

---

## Common gotchas

- **Don't convert a personal Pinterest account to Business.** Algorithm de-prioritizes converted accounts. Fresh signup is faster long-term.
- **Domain claim takes a deploy.** The meta tag must be in `<head>` of the LIVE site before Pinterest checks. If you're in the middle of staging changes, finish the deploy first.
- **Pinterest doesn't allow editing pins after publish.** Once a pin is live, you can't change the destination URL or the image. You can only DELETE and re-create. Get the destination URL right the first time (use the canonical `https://thestrledger.com/<page>` form, not affiliate-tagged or UTM-laden URLs unless deliberately).
- **Creasquare's free tier may cap pin scheduling.** Verify your lifetime-deal tier allows the volume you need (~50 pins/week starting). If hitting limits, the native Pinterest scheduler (100 pins / 14 days, free) is the fallback per `ops/credentials-inventory.md`.
- **Pinterest's pin search uses image OCR + alt text + description.** Every pin needs a 50–500-char description with target keywords (Pinterest's own field — not your site's image alt). Pre-built pins (memory obs 823) handle this; verify Claude's pin-render templates include descriptions before scheduling a batch.
- **Rich Pins** (auto-pull metadata from your site): nice-to-have. Apply at https://developers.pinterest.com/tools/url-debugger/ once domain is claimed. Adds price + availability metadata to product pins. Re-evaluate post-launch if pin CTR is low.
- **Tailwind decision deferred until Month 3.** Don't sign up now. Re-evaluate based on Pinterest traffic data.
