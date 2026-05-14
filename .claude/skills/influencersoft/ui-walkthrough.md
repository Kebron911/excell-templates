# InfluencerSoft UI Walkthrough

Detailed tour of the Funnel canvas, Page Builder, template catalog, and the
A/B testing surfaces. For module-level menu paths see [modules.md](modules.md).

## 1. Funnels — the visual canvas

**Path:** `Funnels → My Funnels` (or `Catalog` for templates)

Drag blocks from the left panel onto the canvas. Link blocks by clicking and
dragging an **arrow** from one to the next. Click the **pencil icon** on any
block to open its settings or page editor.

### Block categories

**Pages** (visual website steps):
- **Opt-in** / **Double Opt-in** — lead capture
- **Content / Activation / Webinar** — generic landing, content, or webinar page
- **Order** — checkout via PayPal (routes to PayPal external page for payment)
- **Payment** — checkout via Stripe (takes card on-page, no redirect). Supports Bump Offers.
  ⚠️ Order page = PayPal redirect; Payment page = Stripe on-page. Use the right
  block for your gateway or checkout will silently fail.
- **Upsell** — one-click upsell page (uses `#upsell_yes` / `#upsell_no`)
- **Downsell** — fallback after upsell refusal
- **Webinar** — webinar room
- **Members Area** — course access gate
- **Any Page by URL** — track external pages with `Click.js` snippet
- **Thank You / Confirmation** — post-conversion
- **Countdown** — page with a pre-installed Timer widget; can serve as a
  selling or payment page

**Forms** (standalone form blocks, embeddable elsewhere):
- Opt-in form
- Order form
- Payment form

**Actions** (logic on the canvas):
- **Email** — send a one-off email at this point
- **Timer** — delay
- **Filter** — split traffic by condition (e.g. "invoice paid")
- **A/B test** — split traffic between two paths
- **Process** — embed an advanced automation flow
- **Custom** — user-defined stage marker with a name and icon, no logic.
  Use to label a pipeline stage for visual clarity.
- **Note** — leave inline documentation

**Traffic** (UTM tracking sources — 9 types):
- **AdWords**, **YouTube**, **Affiliates**, **Facebook**, **Instagram**,
  **WhatsApp**, **Email**, **CPA**, and generic **Source** — each generates
  a unique URL tail with auto-tagged UTMs for that channel

### Hidden UI features

- **Analytics overlay:** top-right "magic button" (statistics icon) toggles
  real-time conversion overlay on every block — page views, opt-ins, paid
- **Block icons = page screenshots:** IS auto-captures your edited pages and
  shows them as the block icon. Re-edit → icon updates.
- **Pencil shortcut:** hover any block → click pencil to open editor

## 2. Page Builder (inside a page block)

Click pencil on any Page block. Drag widgets from the left tray.

### Widgets / elements

| Widget | What it does |
|---|---|
| Text | Headings + body copy with formatting |
| Video | YouTube-based player; can hide YouTube branding and controls |
| Image | Insert from internal media library |
| Button | Configurable target: `#nextpage`, `#upsell_yes`, `#upsell_no`, external URL |
| Countdown / Timer | Urgency timer (preinstalled in "Countdown" templates) |
| Opt-in form fields | Name / email / phone capture |
| Order / Payment form | Checkout fields, Stripe/PayPal, Bump Offer toggle |
| Sections | Pre-designed layout groups (drop as a unit) |
| Code | Embed custom HTML (e.g. Google Forms) |
| Interactive | Specialized live-broadcast / webinar elements |

### Top toolbar

- **Device toggle:** phone / tablet / desktop icons → preview mode (note:
  editing requires copy-section workaround — see [gotchas.md #10](gotchas.md))
- **Add a variant:** create a second page version for split-testing
- **More tab → Add HEAD code:** paste tracking pixels, Google Analytics,
  custom scripts — applies site-wide if at the Websites level

## 3. Wiring opt-in → list + tag

In a Funnel: pencil on an Opt-in block → **Actions** tab.

- **Lists:** under "Selecting a list", check the target group. To create a
  new list, click the `+` button next to the list-name field.
- **Tags:** in the "Add tag" field, type the tag (e.g. `lead-magnet:welcome-book`)
  and press **Enter**. Multiple tags = multiple Enter-presses.

The tag must match exactly with what's in
[tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md).

## 4. Order forms, bumps, and upsells

### Order Bumps

Pencil on a **Payment Page** block → Actions tab → check **"Adding a Bump
Offer"**. Configure:
- Bump product
- Button text
- Design (padding, background color, border)

### Upsells / Downsells

Drag an **Upsell** block. In the page editor, place buttons with these exact
variables:
- `#upsell_yes` — one-click charges the customer and advances
- `#upsell_no` — refuses, advances to Downsell or Thank You

Without these variables, the one-click flow fails silently.

## 5. Template catalog

`Funnels → My Funnels → Catalog`. Pre-built flows you can edit instead of
starting blank:

| Template | Use case | Default page sequence |
|---|---|---|
| Simple Webinar Funnel | Register leads for a masterclass | Opt-in → Thank You → Webinar Room |
| Free Book Funnel | Lead gen or low-ticket front-end | Opt-in/Order → Upsell(s) → Thank You |
| Product Launch Funnel | Multi-day video anticipation build | Multiple Content/Video pages → Order |
| Calendar Booking Funnel | High-ticket coaching/agency | Opt-in (Free Gift) → Video Bridge → Calendar |
| Digital Summit Funnel | Multi-speaker online events | Registration → Schedule → Access/Offer |
| Evergreen Webinar Funnel | 24/7 automated webinar | Invite → Opt-in → Countdown → Replay → Offer |
| Self-Liquidating Offer (SLO) | Cover ad cost on first transaction | Opt-in → OTO → Downsell → Checkout |

## 5a. Dynamic variables in links and pages

IS supports placeholder variables that resolve at runtime for each contact:

| Variable | Resolves to |
|---|---|
| `{$name}` | Contact's first name |
| `{$email}` | Contact's email address |
| `#nextpage` | Next page in the funnel sequence (standard navigation) |
| `#upsell_yes` | Accept upsell — charges card and advances |
| `#upsell_no` | Decline upsell — routes to Downsell or Thank You |

Use `{$name}` and `{$email}` in order form pre-fill URLs and email body links.
Use `#nextpage` for any button that should advance to the next funnel step
without one-click charging.

## 5b. "Selected" — saved-templates area

**What:** A persistent library where individual funnel pages and emails can be
saved to survive funnel deletion.

- Items inside a funnel but NOT in Selected are **permanently deleted** when
  the funnel is deleted — there is no trash or recovery.
- Before deleting a funnel, move any reusable pages or emails to Selected.
- From any page editor: use the template-save option to add to Selected.
- Templates in Selected can be pulled into new funnels via the Catalog.

⚠️ See also gotchas.md #13a for the data-loss risk.

## 6. A/B testing — 3 levels

**Funnel level:** drag the **A/B test** Action block. Connect two outgoing
paths to different pages. Configure split ratio.

**Page level:** in the Page Builder for any landing page, click **"Add a
variant"** at the top. Creates a second version of that page for internal split.

**Email level:** inside a sequence email editor, click **"Add option"** to
create multiple subject lines or content versions. IS auto-splits (default
50/50) and reports the winner.

## 7. HEAD code placement

Three placement paths depending on scope:

1. **Site-wide:** `Websites → Set up → <your site> → More → Add HEAD code`
2. **External page tracking:** Funnel Builder → drag **"Any Page by URL"**
   block → copy "Click reference code" → paste in external page's `<HEAD>`
3. **Affiliate tracking on a specific page:** `Affiliates → Offers` → copy
   the generated `Click.js` script → paste in target page's `<HEAD>`

Native pixel integrations:
- **Google Analytics** (Universal Analytics) — paste script in Add HEAD code;
  e-commerce auto-tracked
- **Facebook Pixel** — same mechanism
- **TikTok / others** — paste their script via Add HEAD code; no native
  integration

## 8. Calendar / booking

IS **does not** have a native calendar booking system (announced for "v2.0").
Workflow today:

1. `Funnels → My Funnels → Catalog → Calendar Booking Funnel`
2. The final page uses the **Code widget** to embed an external scheduler
   (Calendly, TidyCal, SavvyCal). Paste their embed snippet.

## 9. Surveys

`Website → Surveys`. Standalone builder, distinct from opt-in forms.

- Multi-page surveys with named "Pages" and "Questions"
- Multi-language: dedicated **"Languages"** button for field requirements +
  success messages
- Trigger actions on completion: add to list, redirect, etc.

**Limitation:** native builder is "very simple". For anything advanced,
founder recommends Google Forms via Code widget.
