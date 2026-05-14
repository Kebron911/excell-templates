# InfluencerSoft Module Map

The 13 top-level modules plus secondary surfaces. Each entry lists the exact UI
menu path and the primary thing you do there. Tenant: `kebron.influencersoft.com`.

## 1. Dashboard
- **Path:** Login landing screen
- **What:** Startup Checklist, welcome/fast-start videos, **InfluencerSoft
  Academy**, weekly mentoring (Tech Tuesday) timer + join link.
- **Related:** Gateway to every other module's training.

## 2. Funnels — the visual hub
- **Path:** `Funnels → My Funnels` (then `Catalog` for templates)
- **What:** Drag-drop flowchart canvas. Pages, Forms, Actions, Traffic blocks.
  Link blocks with arrows. Pencil icon on any block opens the page editor.
- **Related:** Courses, sequences, store products can all be created from
  inside the funnel canvas by dragging the matching block.
- **Deeper:** see [ui-walkthrough.md](ui-walkthrough.md).

## 3. Contacts (CRM)
- **Path:** `Contacts → Leads`
- **What:** Lists/groups (terms used interchangeably in UI), tags, custom
  fields, subscription forms, individual lead activity history.
- **Add contact:** API (`AddUpdateLead`) or manual via this screen.
  ⚠️ Manually-added contacts (UI or API without activation email) cannot
  receive email through IS servers — they must go through a subscription
  opt-in or activation flow to become emailable.
- **Custom fields:** `Contacts → Custom Fields` — IS rejects prefix-colliding
  names (refresh page between adds; see [gotchas.md](gotchas.md)).
- **Naming rules:** see [tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md) §6.
- **Calls:** `Contacts → Calls` — call-center call log.
- **Meetings:** `Contacts → Meetings` — meeting log.
- **Settings:** `Contacts → Settings` — additional lead fields, reCAPTCHA
  configuration for forms, call-center scripts.
  See [plans-and-support.md](plans-and-support.md) for reCAPTCHA setup steps.

## 4. Sequences (Visual flowchart automations)
- **Path:** `Campaigns → Sequences`
- **What:** Visual flowchart automation. Triggers on a tag or event, then
  fans out through branching nodes: emails, A/B tests, filters, delays,
  tag-add/remove actions. NOT a linear drip chain — that's Email Series.
  Purple "+" adds first node, green "+" adds subsequent. "Add option" inside
  an email node = A/B test (auto 50/50 split).
- **Cannot be created via API** — paste from `.md` drafts. See
  paste order in [manual-setup-guide.md](../../../ops/manual%20work/influencersoft-manual-setup-guide.md) Part 3.

## 4a. Email Series (Linear drip chain)
- **Path:** `Campaigns → Email Series`
- **What:** Time-interval email chain tied to list subscription. The LINEAR
  product — fixed schedule, no branching. Distinct from Sequences.
  Segments can be marked **"Inseparable chain"** (green exclamation icon) so
  broadcasts cannot interrupt them for that subscriber.
- **Use when:** simple nurture sequence triggered by joining a list.
- **Use Sequences instead when:** you need branching, filters, or A/B logic.

## 4b. Broadcasts (One-time blasts)
- **Path:** `Campaigns → Broadcasts`
- **What:** Single email sent to a chosen list at a scheduled time.
  Run **"Test the distribution for spam"** pre-send check before sending.
  Broadcasts respect "Inseparable chain" locks on Email Series segments.

## 5. Process (Advanced automation)
- **Path:** `Tasks → Processes` or canvas Action block
- **What:** Advanced visual automation — branching, multi-fire, filters,
  A/B test blocks, action blocks (send email, add tag, move between lists).
  Use this when a Sequence can't express the logic.
- **Warning:** Don't build massive Process flows if a Sequence works —
  harder to troubleshoot (founder's own advice).

## 5a. Automatic Rules
- **Path:** `Tasks → Automatic rules`
- **What:** Event-triggered rule chains (if-event → then-action). Simpler
  than Processes — single-condition entry point, no branching canvas.

## 6. Mailing Settings (deliverability)
- **Path:** `Campaigns → Settings`
- **What:** Add/confirm sender emails (must be corporate domain — DMARC
  rejects Gmail/Yahoo), configure DKIM/SPF/DMARC DNS records, FBL setup.
- **Email templates** sub-tab: project logo, author photo, social links
  auto-appended to all mailings.
- **Language** sub-tab: account-wide default language.
- **Deeper:** see [deliverability.md](deliverability.md).

## 7. Courses (LMS)
- **Path:** `Courses → Add a Course`
- **What:** Modules → Lessons (with optional drip — "Instantly" / "X days
  after start" / "X days after previous" / "calendar date"). Bulk-add or
  drag-reorder lessons. Mark obligatory (blue exclamation mark).
- **Access:** `Access` tab → "Allowed to leads in lists" → check lists.
  Override with "Not allowed" lists. Per-module gating also supported.
- **Reports:** `Courses → Reports` — Lesson opened vs completed counts,
  homework status (New/Accepted/Rejected).
- **Members area:** drag Members Area block in any Funnel to link a course.

## 8. Affiliates (program owner view)
- **Path:** `Affiliates → Offers`
- **What:** 2-tier affiliate program. Fixed sum OR % commission. Payout via
  PayPal or bank. MoneyBack auto-subtracts commission on refund.
- **Tracking:** `Click.js` script (paste into HEAD of external pages) parses
  UTM tags + sets browser cookie tying clicks to partners.
- **Fee Period:** 1–365 days or "forever" (cookie window).
- **Reports:** `Affiliates → Affiliate Management and Reporting`.

## 8a. Advertise (partner/affiliate view — Partner's Cabinet)
- **Path:** `Top menu → Advertise`
- **What:** The *partner side* — what Daniel sees when he is a member of
  someone else's affiliate program. Each program he joins appears here as a
  card in the **Partner's Cabinet** catalog.
- Inside each program, the left nav exposes:
  - **Offers** — promotional materials and trackable affiliate links
  - **Instructions** — program owner's notes (if provided)
  - **Promotional Drafts for Free Products** — ready-made promo copy
  - **Promotional Drafts for Paid Products**
  - **Advertising Blanks for Partner Registration**
  - **Leads** — leads he referred
  - **Orders** — purchases through his links
  - **Referrals** — downstream partners he recruited
  - **Partners From You** — 2nd-tier partners
  - **Payments** — commissions charged/paid
  - **Contact the Author** — direct message to program owner
- **Catalog button** (inside any program) → returns to main Partner's Cabinet.

## 9. Store (E-commerce)
- **Path:** `Store → Products`, `Store → Order forms`, `Store → Coupons`
- **What:** Digital + physical products, single-price or recurring plans,
  multi-currency, order bumps (Payment Page → Actions → "Adding a Bump
  Offer"), upsell/downsell pages with `#upsell_yes` / `#upsell_no` variables
  for one-click charging.
- **Gateways:** Stripe (on-page card), PayPal (off-page redirect).
- **Limitation:** no "add-to-cart" — single-product funnels only.

## 10. Webinars
- **Path:** `Website → Webinar`
- **What:** Configure webinar rooms — title, date, time (East Coast military),
  countdown timer toggle, chat toggle, embed YouTube/private video.
  Behavioral routing in funnels (watched-to-end vs skipped → different paths).
- **Live webinars:** recommended to use external (Zoom/Sessions) via "Any
  Page by URL" block and let IS handle traffic tracking.
- **Evergreen:** native Replay Room block — the same funnel with a different
  arrow makes a live webinar evergreen.

## 11. Integrations & API
- **Path:** Account footer → `Integration and API` or
  `username.influencersoft.com/shops/setts/apisettings/`
- **What:** Retrieve **rpsKey** (API key). Connect Zapier (4 triggers + 6
  actions). Generate `Click.js` snippet for external page tracking.
  Configure webhook fields.
- **Deeper:** see [api-quickref.md](api-quickref.md).

---

## Secondary surfaces

### Surveys
- **Path:** `Website → Surveys`
- **What:** Standalone survey builder (multi-page, multi-language). See
  [ui-walkthrough.md §9](ui-walkthrough.md) for the full UI tour.

### Reports
- **Path:** `Reports` (top-level)
- **What:** Sales Funnel Analytics, Sales Statistics, Subscription
  Statistics, Advertising Efficiency, Sales Department Statistics,
  Expenses Import. Plus sequence analytics under `Campaigns → Analytics`.
- **Deeper:** see [reports-analytics.md](reports-analytics.md).

### Website / Domain
- **Path:** `Websites → Set up`
- **What:** Full website/domain management and page publishing. Surfaces:
  - **Custom domains:** link via CNAME → free SSL provisioned automatically.
    Subdomains also supported.
  - **Page Builder:** drag-drop editor (same engine as Funnel pages) for
    standalone pages outside funnels.
  - **File manager:** upload/manage media assets.
  - **Popup blocks:** configure exit-intent or timed popups.
  - **Blog:** native blog with posts, categories, SEO fields.
  - **SEO / social:** per-page meta title, description, OG image.
  - **Webinar broadcast pages** and **auto-webinar** pages.
  - **HEAD code:** `More` tab → `Add HEAD code` — paste GA, FB Pixel, or
    custom scripts site-wide.
- Guide chapter `02-website.md` covers 31 screens and 35 tasks.

### Personal Managers / Team
- **Path:** `Integration and API` (account footer) — also `getpersonalmanagers` API
- **What:** Additional users (Sales Manager, Personal Manager roles for
  homework review). User count depends on tier (5 / 15 / 25+).
