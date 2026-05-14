# InfluencerSoft End-User Guide

Comprehensive UI + API reference for the InfluencerSoft platform, distilled from the official help center.

**Built:** 2026-05-14T13:09:32.731Z
**Source:** https://help.influencersoft.com/hc/en-us/categories/360003438411-General
**Chapters:** 12
**Screens documented:** 206
**Tasks documented:** 268
**API endpoints documented:** 35
**Glossary terms:** 187
**Field-occurrences indexed:** 864

## How to use this guide

- **I know the feature area** → open the chapter directly.
- **I know the task** → search HOW-DO-I.md for "How do I …" then click through.
- **I know the field name** → search FIELD-INDEX.md.
- **I know the API endpoint** → look it up in the API chapter, or use API-UI-MAP.md to find the matching UI screen.
- **I hit unfamiliar terminology** → check GLOSSARY.md.

## Chapters

- [Funnels](01-funnels.md) — 6 screens, 32 tasks
- [Website](02-website.md) — 31 screens, 35 tasks
- [Store](03-store.md) — 21 screens, 21 tasks
- [Contacts](04-contacts.md) — 24 screens, 34 tasks
- [Campaigns](05-campaigns.md) — 19 screens, 31 tasks
- [Automation](06-automation.md) — 19 screens, 28 tasks
- [Courses](07-courses.md) — 36 screens, 24 tasks
- [Affiliates](08-affiliates.md) — 17 screens, 22 tasks
- [Advertise](09-advertise.md) — 20 screens, 16 tasks
- [Reports](10-reports.md) — 13 screens, 15 tasks
- [API 1.0](11-api-1-0.md) — 6 tasks, 26 endpoints
- [API 2.0](12-api-2-0.md) — 4 tasks, 9 endpoints

## Cross-cutting indexes

- [How do I…?](HOW-DO-I.md) — every task workflow, alphabetical + grouped by chapter
- [Glossary](GLOSSARY.md) — every domain term defined
- [Field Index](FIELD-INDEX.md) — every field → chapter + screen
- [API ↔ UI Map](API-UI-MAP.md) — every API endpoint → matching UI screen


---


# Funnels

## Overview
Funnels are InfluencerSoft's visual builder for sales and marketing flows: a workspace where you drag pages, forms, actions, and traffic sources onto a canvas and connect them with links that represent contact behavior (subscribing, opening a page, paying an invoice, completing a lesson, etc.). Each funnel runs end-to-end inside the platform — pages, forms, courses, emails, timers, A/B tests, filters, processes, and product/payment configuration are all configured from inside the funnel element settings. Funnels can be grouped under categories, shared, copied, disabled, or deleted. This chapter documents the My Funnels list, the Categories management screen, and every element, field, and link type available inside the funnel editor.

## Where to find it
- `Top menu → Funnels → My Funnels` — list of all funnels, create/copy/share/disable/delete, open the funnel editor.
- `Top menu → Contacts → Lists → Categories` — manage funnel categories (add, edit, remove, filter).

## Terminology
- **Sales funnel** — a flow of pages, forms, actions, and traffic sources connected on a canvas.
- **Category** — a grouping label for sales funnels that share an underlying theme (for example, infant development courses vs. weight loss programs).
- **Funnel element** — any draggable block placed on the funnel canvas; types are Pages, Forms, Actions, and Traffic.
- **Element panel** — the left-side strip in the funnel editor that lists every element type available to drag onto the workspace.
- **Workspace** — the funnel canvas area onto which elements are dragged and linked.
- **Link** — a connector drawn between two elements that defines the behavioral path a contact takes (for example "A lead is added", "An invoice is paid").
- **Arbitrary exit** — a link type that is purely visual and carries no behavioral logic.
- **Any page by URL** — a page element that points to a URL outside the funnel (in InfluencerSoft or another service).
- **Content / Activation / Webinar page** — page elements created inside the funnel via the page builder.
- **Opt-in / Double opt-in page** — subscription pages with an extra Actions tab for subscription settings.
- **Members area** — element that attaches a course or a single lesson to the funnel.
- **Upsell** — page element offering one or two extra products after the main purchase, controlled by `#upsell_yes` / `#upsell_no` variables.
- **Order page** — page element used with PayPal: routes to PayPal for payment.
- **Payment page** — page element used with Stripe: takes card payment without leaving the page.
- **Bump Offer** — an optional extra product the customer can add to the invoice on the Payment page with one click via a checkbox.
- **Countdown page** — page element with a pre-installed Timer widget; can be used as either a selling or a payment page.
- **Opt-in / Double opt-in form / Order form / Payment form** — form elements built in the form constructor.
- **A/B test** — action element that splits traffic into Option A and Option B paths.
- **Filter (action)** — action element that branches the flow based on lead parameters (invoice generated, lesson accessible, in a client group, etc.).
- **Process** — action element wrapping a sub-process; created from inside the funnel and only visible from that funnel.
- **Timer (action)** — action element that applies a timer rule across multiple pages or emails in the funnel.
- **Custom block** — user-defined action element with no settings beyond a name and icon, used as a stage marker.
- **Traffic source** — element category for tagged inbound link sources (AdWords, YouTube, Affiliates, Facebook, Instagram, WhatsApp, Email, CPA, or generic Source).
- **UTM tag** — query-string tag attached to a traffic link or to leads/orders generated by a page or form.
- **Dynamic variable** — placeholder appended to exit-point links, e.g. `{$ name}`, `{$ email}`, `{$ phone}`, that auto-populates the next page's form.
- **`#nextpage`** — variable usable in a button's "Open the link" field that routes the click through the funnel's Next page link instead of a hard-coded URL.
- **Get shareable link** — toggle on the share panel that turns the current funnel into a publicly retrievable link.
- **Selected** — saved-templates area where emails and pages survive funnel deletion; if items are not in Selected, deleting the funnel deletes them.
- **Element icon** — preview screenshot attached to a page/lesson/traffic block in the canvas.
- **No Category** — default category label shown on the gear menu when a funnel has not been assigned a category.

## Screens and fields

### Screen: My Funnels
- **Purpose:** List, create, open, share, copy, categorize, enable/disable, and delete sales funnels.
- **How to open:** `Top menu → Funnels → My Funnels`.
- **Fields:** Each funnel is shown as a preview tile with the controls below.

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Funnel preview tile | tile | n/a | Click to open the funnel editor. | n/a |
| Enable/disable slide bar (top-left of preview) | toggle | n/a | Green = enabled; Gray = disabled. When disabled: funnel pages are not accessible, no actions execute (draft emails are held, not sent), traffic is not monitored. | Enabled on create |
| Funnel name | text | yes | Default value at creation is `Funnel DATE TIME`. Never displayed to clients or subscribers. Edit by clicking the name, typing a new value, then clicking Save. | `Funnel DATE TIME` |

- **Buttons and actions:**
  - **Create a Funnel** — creates a new sales funnel and opens the editor.
  - **Gear icon (top-right of preview tile)** — opens a context menu with: **Copy**, category selector (arrow next to current category name or **No Category**), and **Delete**.
  - **Copy** (gear menu) — duplicates the funnel.
  - **Category selector** (gear menu) — drop-down listing all categories; selecting one assigns this funnel to that category.
  - **Delete** (gear menu) — opens a confirmation pop-up; click **Yes** to delete. Action cannot be undone. All settings, draft emails, and pages are deleted unless saved in Selected.
- **Tabs / subscreens:** None.
- **Notes:**
  - Funnels can also be added to a category from the Category edit page (see Screen: Add/Edit Category).
  - Save email and page templates to Selected before deletion if you intend to reuse them.

### Screen: Funnel Editor
- **Purpose:** Build and modify a sales funnel by dragging elements onto the workspace and linking them.
- **How to open:** From My Funnels, click any funnel preview tile.
- **Fields:** No flat form. The screen is composed of a top toolbar, the element panel, and the workspace.
- **Buttons and actions (top-right corner):**
  - **Enable viewing statistics** — turns statistics overlay on.
  - **Adding block "Note"** — drops a Note block onto the workspace.
  - **Back** — undo last canvas change.
  - **Forward** — redo last canvas change.
  - **Save** — persists changes.
  - **Slide bar** — enable or disable the funnel (Green = enabled, Gray = disabled).
  - **Share** — opens the share panel (see Screen: Share Funnel).
  - **Close / exit edit mode** — leaves the editor.
- **Funnel name (top of editor):** Click the default name, type new value, click **Save**. Same field as on My Funnels.
- **Tabs / subscreens:**
  - **Element panel (left side):** Lists all element types under categories Pages, Forms, Actions, and Traffic. Drag an element onto the workspace to add it.
  - **Workspace (center):** The canvas where elements live and are linked.
- **Notes:**
  - All elements share a common header inside the canvas with **Edit the Element** (opens the configuration window), plus generic rename, preview, and notes functions available for every element type. Type-specific functions are documented under each element below.

### Screen: Share Funnel
- **Purpose:** Generate a public shareable link to the funnel and label it for the recipient.
- **How to open:** Inside the funnel editor, click the **Share** icon in the top right corner.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Get shareable link | toggle | yes | Move slide to green to enable the link. | Off |
| Name | text | yes (assumed) | Name of the shared funnel. | empty |
| Description | text (assumed) | no | Description of the shared funnel. | empty |
| Funnel link | text (read-only, assumed) | n/a | The generated shareable URL; copy and send to the receiver. | generated |

- **Buttons and actions:**
  - **Save** — saves the name and description and confirms the link is active.
  - **Share** icon (re-click) — re-opens this panel; copy the funnel link to send to the receiver.

### Screen: Categories (Contacts → Lists → Categories)
- **Purpose:** List, search, add, edit, and remove funnel categories.
- **How to open:** `Top menu → Contacts → Lists → Categories`.
- **Fields:** Table of categories.
- **Buttons and actions:**
  - **Add** (top of page) — opens the "To add" category page.
  - **Category name (in table)** — click to open the "To edit" category page.
  - **X icon (last column)** — removes that category.
  - **Filter** — opens the filter input; see Screen: Categories Filter.
- **Tabs / subscreens:** None.

### Screen: Add / Edit Category
- **Purpose:** Create a new category or modify an existing one.
- **How to open:** From the Categories screen, click **Add** (to add) or click the category **name** in the table (to edit). Pages are identical except for the heading "To add" vs "To Edit".
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Name of the category | text | yes | Display name for the category. | empty |
| Sales funnels in this category | multi-select (assumed) | no | Specify which sales funnels belong to this category. Selected funnels appear highlighted/grayed out to indicate inclusion. | none |

- **Buttons and actions:**
  - **Save** — persists changes; the category then appears on the Category page list.

### Screen: Categories Filter
- **Purpose:** Filter the Categories table by name.
- **How to open:** Click **Filter** on the Categories screen.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Filter parameters (name) | text | no | Full name returns one category. Partial name returns every category whose name contains the typed substring. | empty |

- **Buttons and actions:**
  - **Search** — applies the filter and shows matching rows.
  - **Filter** → **Clear** — clears the filter and restores the full table.

### Element: Any page by URL (Pages)
- **Purpose:** Reference an external page (created in InfluencerSoft or any other service) as a funnel element.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Link | text (URL) | yes | Full URL including protocol `http://` or `https://`. | empty |
| Preview | button | n/a | Captures a page screenshot, usable as the element icon. | n/a |
| Click reference code | code snippet | conditional | If the linked page is not created in InfluencerSoft, copy the displayed code and paste it inside the `<HEAD>` of that page. Without it the funnel cannot count statistics for that page. | provided |

### Element: Content / Activation / Webinar page (Pages)
- **Purpose:** Create a content, activation, or webinar page directly inside the funnel via the page builder.
- **Flow:** Open the element → create the page → choose a template → design in the page maker → save and exit → returns to the element settings page.
- **Fields and controls (element settings page):**

| Field / Control | Type | Description |
|---|---|---|
| Page link | text | Current URL of the page. Click to edit the link. |
| Preview | button | Takes a screenshot of the page and sets it as the element icon in the funnel. |
| Open in Browser | button | Opens the page in a browser. If the funnel is disabled, opens in preview mode instead. |
| Page heading | text | Add or change the page heading. |
| Page preview | preview pane | Renders the current page look. |
| Edit | button | Reopens the page in the page maker. |
| Delete | button | Deletes the page. |
| Control of interactive blocks | control | Manage interactive blocks on the page. |
| Timer | control | Set a page timer. To display a timer on the page, drag the Timer widget onto the page in the page maker. |

### Element: Opt-in / Double opt-in page (Pages)
- **Purpose:** Subscription pages. Created the same way as Content/Activation/Webinar pages, with an extra **Actions** tab for subscription configuration.
- **Actions tab — fields:**

| Field | Type | Description |
|---|---|---|
| Create a new list of contacts | text + plus button | Enter the name of the new group and click the plus button; the new group is created and auto-selected in the form settings on this page. |
| Select list(s) to add subscribers to | multi-select | Tick one or more groups; the lead is added to those lists after subscribing through this page. |
| Activation message settings (use list settings) | checkbox | Checked = the activation email uses the settings from the list. Unchecked = the activation letter is configured directly on this page. |
| Activation email sender | dropdown / picker | Select the sender's contact for the activation email. |
| Activation message subject | text | Subject line of the activation email. |
| Activation message text | WYSIWYG / text | Body of the activation email. |
| Activation message preview | preview pane | Preview rendering. |
| Test the activation message | button | Sends a test of the activation message. |
| Add tag | text / picker | Tag assigned to all contacts who subscribe through this page. |
| Remove lead from lists | multi-select | Lists from which the lead is removed after subscribing. |
| Add UTM | UTM fields | UTM tags assigned to contacts who subscribe through this page. |
| Append parameters to exit point links | toggle / config | Adds dynamic variables to the link: `{$ name}`, `{$ email}`, `{$ phone}`. Used to pre-fill forms on the next page (for example, the payment page). |

### Element: Members area (Pages)
- **Purpose:** Attach a course or a single lesson from a course to the funnel; or create a new course/lesson without leaving the funnel.
- **Controls:**
  - Create a **new course** (opens course creation).
  - Select a previously created course.
  - Add the course icon as the element icon.
  - Edit the course settings (courses created via funnels are configured in the Courses section just like standalone courses).
  - Select a previously created lesson (filtered by the chosen course).
  - Add the lesson icon as the element icon.
  - Edit the settings of the selected lesson.

### Element: Upsell (Pages)
- **Purpose:** Add an upsell page offering one or two extra products after the main purchase.
- **Flow:** Created in the same way as Content/Opt-in/Double opt-in/Activation/Webinar pages, with an extra **Actions** tab.
- **Actions tab — fields:**

| Field | Description |
|---|---|
| Product selection | Choose one or two products for upsell. |
| Product variable | Each chosen product exposes a variable used in the button/link settings on the upsell page: `#upsell_yes` selects the product. `#upsell_no` refuses upsell, is always present, and cannot be deleted. |
| Attach existing product | Attach a product created earlier. |
| Create and attach a new product | Create and attach a new product inline. |
| Append parameters to exit point links | Dynamic variables, as in Opt-in / Double opt-in pages. |

### Element: Order page (Pages)
- **Purpose:** Link landing and payment pages for the PayPal payment gateway; places an order and routes externally to PayPal.
- **Flow:** Created like Content/Opt-in/Double opt-in/Activation/Webinar pages, with an extra **Actions** tab.
- **Actions tab — fields:**

| Field | Description |
|---|---|
| Attach product | Attach a previously created product. |
| Create and attach product | Create and attach a new product. |
| Add tag | Tag attached to orders generated on this page. |
| Attach discount | Attach a previously created discount coupon to orders on this page. |
| Create and attach discount | Create and attach a new discount coupon. |
| Ad tags | Add ad tags to the orders generated on this page. |

### Element: Payment Page (Pages)
- **Purpose:** In-page card checkout via Stripe — order placed and paid for without leaving the page.
- **Flow:** Created like Content/Activation/Webinar, with an extra **Actions** tab.
- **Actions tab — fields:**

| Field | Description |
|---|---|
| Bind existing product | Attach a previously created product. |
| Create and link new product | Create and attach a new product. |
| Add tag | Tag attached to orders made through this page. |
| Link discount | Attach a previously created discount coupon. |
| Create and link discount | Create and attach a new discount coupon. |
| Add Bump Offer | Add a one-click extra product (see Bump Offer table). |
| Promotional tags | Add promotional ad tags to orders created through this page. |
| Append parameters to exit point links | Dynamic variables, as on the Subscription/Opt-in page. |

- **Payment by card field on forms:** For all forms on this page, the **Payment by card** field is enabled and cannot be disabled — this is what enables one-click in-page purchase.

#### Bump Offer (sub-panel of Payment Page Actions)
- **Purpose:** Let the customer add an extra product to the invoice on the checkout page with one click.
- **Triggering:** The checkbox is turned on either by checking the box or by clicking the hot offer button itself.
- **Fields:**

| Field | Description |
|---|---|
| Bump Offer product | Select the product that acts as the Bump Offer to the main product. |
| Bump Offer button text | Text shown to the right of the checkbox. |
| Button outer/inner padding | Spacing around and inside the button. |
| Button design settings | Edge rounding, button color, stroke size and color, text centering. |
| Checkbox image | Default is an arrow; replace with a custom image or turn off. |
| Description text | Sales copy for the hot offer — describe the product vividly and the reason to buy now with the main product. |
| Description outer/inner padding | Spacing around and inside the description. |
| Description design settings | Edge rounding, background color, stroke size and color. |

### Element: Countdown (Pages)
- **Purpose:** A page that can act as either a selling page or a payment page, with a Timer widget pre-installed.
- **Flow:** Created in the same way as a Content page. The Timer widget is preinstalled in every Countdown template.

### Element: Forms — overview
- **Purpose:** Subscription and order forms built directly inside the funnel.
- **Flow:** First entry into the form element exposes a button to create a form and to choose a template → switch to the form constructor → save the form and exit → returns to the form element settings to configure the **Actions** tab.

### Element: Opt-in / Double opt-in form (Forms)
- **Actions tab — fields:**

| Field | Description |
|---|---|
| Create a new lead group | Enter a group name and click plus; the new group is created and auto-selected in the form. |
| Select group(s) to add leads to | Tick one or more groups; a lead is added once it subscribes via this form. |
| Add a tag | Tag attached to every lead that subscribes via this form. |
| Delete a lead from particular groups | Groups from which the lead is removed once it subscribes via this form. |
| Add ad UTM tags | UTM tags attached to the leads that subscribe via this form. |
| Append parameters to exit point links | Dynamic variables, as on the Opt-in / Double opt-in page. |
| Add sender email | Button shown when no sender contact has been set; clicking opens the sender-contact section. |

### Element: Order form (Forms)
- **Actions tab — fields:**

| Field | Description |
|---|---|
| Attach existing product | Attach a product created earlier. |
| Create and attach product | Create and attach a new product. |
| Add tag | Tag attached to orders generated by this form. |
| Attach discount | Attach a previously created discount coupon. |
| Create and attach discount | Create and attach a new discount coupon. |
| Ad UTM tags | UTM tags attached to the form-generated orders. |
| Append parameters to exit point links | Dynamic variables, as on the Opt-in / Double opt-in page. |

> Source unclear: The article lists a "Payment form" element but does not enumerate fields separate from the Payment Page Actions tab. Options not enumerated in source.

### Element: Email (Actions)
- **Purpose:** Send an email to leads in the funnel.
- **Fields:**

| Field | Type | Description |
|---|---|---|
| Resend on re-entry | toggle | Whether to resend the email when a lead re-enters the funnel. Gray = letter is sent again. Green = letter is sent only the first time. |
| Send timing | scheduler | When the email is sent. Options: not enumerated in source. |
| Sender | dropdown / picker | Who the sender is. |
| Subject | text | Subject of the letter. |
| Mode | dropdown / toggle | Email build mode: **message constructor** or **visual editor**. |
| Send parameters | parameter fields | Additional parameters for sending the email. Options: not enumerated in source. |

### Element: A/B test (Actions)
- **Purpose:** Split traffic to test alternative landing pages, email subject lines, etc., and compare conversion.
- **Fields and options:** Options not enumerated in source.
- **Output links:** **Option A** and **Option B** (see Link types).

### Element: Filter (Actions)
- **Purpose:** Group leads by parameters and branch the flow based on whether each lead matches the filter.
- **Available filter parameters (examples):** invoice is generated, a lesson is accessible, included into a client group, etc. (full list not enumerated in source).
- **Output links:** match (green) and no-match (red) paths.

### Element: Process (Actions)
- **Purpose:** Embed a sub-process inside the funnel.
- **Fields:**

| Field | Type | Description |
|---|---|---|
| Process name | text | Specified in the modal when clicking **Create process**. |
| Execute for an object | dropdown | Options: **Any number of times** (re-runs the process for the contact each time it enters), **Just one time** (no action on re-entry), **Any number of times, but not simultaneously** (re-entry while the process is still running for the contact is ignored; re-entry after completion re-runs it). |

- **Buttons and actions:**
  - **Create process** — opens a modal to name and save the new process.
  - **Edit Process** — opens the process constructor (visible after a process is saved).
- **Notes:**
  - Processes created through a funnel are visible only inside that funnel — they do not appear on the **Process** page and cannot be picked from a contact card.
  - The process can be launched in two ways: (1) the contact enters the **Process** action while passing through the funnel; (2) the contact triggers the process via its start trigger (for example, a process containing an "added to the group" trigger fires when that group membership changes).
  - The process turns on or off with the funnel.

### Element: Timer (Actions)
- **Purpose:** Apply a shared Timer rule across multiple pages or emails in the funnel.
- **Fields:**

| Field | Type | Description |
|---|---|---|
| Perform only once for an object | toggle | Green = timer applied only once per contact. Gray = timer can be reused. |
| Timer reapply delay | number (minutes) | Delay before the timer can be reused. |
| Type of timer | dropdown | Options: not enumerated in source. |
| Settings for the timer expiration | sub-settings | Options: not enumerated in source. |

### Element: Custom block (Actions)
- **Purpose:** User-defined stage marker on the canvas.
- **Fields:**

| Field | Type | Description |
|---|---|---|
| Name | text | Label shown on the canvas. |
| Icon | icon picker | Icon shown on the canvas. |

- **Notes:** Has no behavioral settings; used to label funnel stages.

### Element: Traffic source (Traffic)
- **Purpose:** Add a tagged inbound link source to the funnel so the funnel can monitor traffic from that source.
- **Pre-defined sources (with pre-configured basic tags):**
  - AdWords
  - YouTube
  - Affiliates
  - Facebook
  - Instagram
  - WhatsApp
  - Email
  - CPA
- **Generic source:** The **Source** block accepts any user-defined set of tags.
- **Fields:**

| Field | Description |
|---|---|
| UTM tags | UTM tags for this traffic source. |
| Link tail with tags | Displays the generated link tail that carries the tags. |
| Copy link | Button that copies the link tail to clipboard. |

- **Notes:** The funnel monitors all traffic arriving via links carrying the tags configured here.

## Link types between funnel elements
Drawn by hovering over a source element, dragging the cursor to a target element, and clicking to connect. The set of available exit links varies by element type.

| Link | Defines the path when… | Can connect to |
|---|---|---|
| Arbitrary exit | Visual-only link with no behavioral meaning. | Any block / Action. |
| A lead is added | A lead is added to a group. | Any page and form; A/B test (of a page and form) on any page; any Block/Action. |
| Subscription is activated | The subscription in a group is activated. | Any page and form; A/B test (of a page and form) on any page; any Block/Action. |
| A page is visited / A page with a form is opened / An email is opened | A page is visited or an email is opened. | Any Block/Action. |
| Next page (a link or button is clicked) | The user clicks a button/link on the source page set to follow the funnel's next page. Enable by selecting **Open the link** then **Next page** in the button widget on the source page, or by entering `#nextpage` in the **Open the link** field. Changing the canvas connection updates the destination without re-editing the button or email. | Any page and form; A/B test (of a page and form) on any page. |
| A lesson is completed | A lesson in a course is completed. | Any action and traffic. |
| An invoice is generated | An invoice is generated. Also includes a non-editable link to a "Select a payment method" block that routes the user to the payment-method selection page. | Any page and form; any action. |
| An invoice is paid | An invoice is paid. | Any page and form; A/B test (of a page and form) on any page; any action. |
| Next action | An email is sent. | Any action. |
| A/B test — Option A / Option B | Distributes traffic between the two A/B test variants. | A/B test (actions): any action. A/B test (of a page and form): any page and form. |
| Filter — matches / does not match | Filter applied. Green = lead matches; Red = lead does not match. | Any action. |

## Common tasks

### How do I create a new sales funnel?
1. Go to `Funnels → My Funnels`.
2. Click **Create a Funnel**.
3. The funnel opens in the editor with the default name `Funnel DATE TIME`.
4. Click the default name, type a new name, and click **Save** (the name is internal and never shown to clients or subscribers).

**Result:** A new empty funnel exists in My Funnels and is open in the editor.
**Options along the way:** Rename now or later; assign a category from the gear menu on My Funnels later.

### How do I rename a sales funnel?
1. From My Funnels (or the funnel editor), click the funnel **name**.
2. Enter the new name.
3. Click **Save**.

**Result:** Internal name updated. Clients and subscribers never see this name.

### How do I edit an existing sales funnel?
1. Go to `Funnels → My Funnels`.
2. Click the **preview** of the funnel you want to edit.

**Result:** The funnel opens in the editor (see Screen: Funnel Editor).

### How do I add an element to a funnel?
1. Open the funnel in the editor.
2. On the **Funnel element panel** (left side), hover over the element you want.
3. Drag it onto the workspace.

**Result:** The element appears on the canvas.
**Options along the way:** Categories of elements are Pages, Forms, Actions, and Traffic. After dropping, click **Edit the Element** on the block to open its configuration window.

### How do I configure a Content, Activation, or Webinar page from inside a funnel?
1. Drag the page element onto the workspace.
2. Click **Edit the Element**.
3. Click to create a page and select a template.
4. The page maker opens — design the page from the template (see the Pages chapter).
5. Save and exit the page maker — you return to the element settings page in the funnel.
6. Optionally adjust **Page heading**, click **Preview** to take a screenshot, set the **Timer**, **Control of interactive blocks**, or **Open in Browser** to verify.

**Result:** A page is attached to the funnel and represented by the chosen element icon.
**Gotchas:** If the funnel is disabled, **Open in Browser** opens the page in preview mode only.

### How do I configure an Opt-in or Double opt-in page?
1. Create the page following the Content/Activation/Webinar steps.
2. Open the page element's **Actions** tab.
3. Either create a new list of contacts (type a name, click plus) or tick one or more existing lists for new subscribers.
4. Decide whether the activation email uses the list's settings (check the box) or is configured here directly (uncheck and fill the sender, subject, message body, run preview, and optionally test).
5. Optionally add a tag, remove the lead from selected lists, set UTM tags, and append `{$ name}`, `{$ email}`, `{$ phone}` to exit-point links to pre-fill forms downstream.
6. Save.

**Result:** Subscribers through this page land in the chosen lists, receive the activation email, and downstream pages can auto-fill from the URL.

### How do I add a course or lesson to a funnel?
1. Drag the **Members area** element onto the workspace.
2. Either select a previously created course or click to create a new course (see the Courses section for course settings).
3. Optionally add the course icon as the element icon and edit course settings.
4. Select a previously created lesson within that course; optionally add the lesson icon and edit its settings.

**Result:** The course/lesson is part of the funnel and reachable via funnel links.

### How do I set up an Upsell page?
1. Drag the **Upsell** element to the workspace and create the page like a Content page.
2. Open the **Actions** tab.
3. Select one or two products for upsell, either by attaching an existing product or creating a new one.
4. On the upsell page's buttons/links, set `#upsell_yes` to choose the product and `#upsell_no` to refuse (the refuse variable is always present and cannot be deleted).
5. Optionally append dynamic variables to exit links.

**Result:** Clicking the chosen variable button adds the product to the order; clicking the refuse button proceeds without it.

### How do I sell with PayPal (Order page)?
1. Drag the **Order page** element to the workspace.
2. Build the page like a Content page.
3. In the **Actions** tab, attach an existing product or create a new one, add a tag for the page's orders, optionally attach or create a discount coupon, and add ad tags.

**Result:** Orders placed on this page route externally to PayPal.

### How do I sell with Stripe (Payment Page)?
1. Drag the **Payment Page** element to the workspace.
2. Build the page like a Content page.
3. In the **Actions** tab, bind an existing product or create a new one, add a tag, link or create a discount coupon, add a Bump Offer if desired, and add promotional ad tags.
4. Optionally append dynamic variables to exit links.

**Result:** Customers pay by card without leaving the page. The **Payment by card** field is enabled on all forms on this page and cannot be disabled.

### How do I add a Bump Offer to the Payment Page?
1. In the Payment Page **Actions** tab, expand the Bump Offer settings.
2. Select the Bump Offer product.
3. Set the Bump Offer button text.
4. Configure button padding and design (edge rounding, color, stroke, text centering).
5. Configure the checkbox image (default arrow, or custom image, or off).
6. Write the description text and configure its padding and design.

**Result:** A one-click extra-product option appears on the checkout page. The checkbox toggles when either the box is ticked or the hot-offer button is clicked.

### How do I add a Countdown page?
1. Drag the **Countdown** element to the workspace.
2. Build the page like a Content page (the Timer widget is preinstalled in every Countdown template).

**Result:** A countdown page exists in the funnel that can serve either as a selling page or a payment page.

### How do I add a subscription, order, or payment form to a funnel?
1. Drag the form element to the workspace.
2. Click into the element to expose the create-form button and select a template.
3. Design the form in the form constructor.
4. Save and exit — you return to the element settings.
5. Configure the **Actions** tab for the form type (Opt-in / Double opt-in, Order, or Payment form).

**Result:** A form exists in the funnel with subscription, order, or payment behavior configured.

### How do I send an email from inside a funnel?
1. Drag the **Email** action onto the workspace.
2. Set the **Resend on re-entry** toggle: Green = first entry only; Gray = resend on every re-entry.
3. Choose **Send timing**.
4. Choose the **Sender**.
5. Type the **Subject**.
6. Choose the build mode — **message constructor** or **visual editor**.
7. Configure any extra send parameters.

**Result:** The email fires when leads pass through this action, following the toggle's resend behavior.

### How do I A/B test inside a funnel?
1. Drag the **A/B test** action onto the workspace.
2. Connect its **Option A** link to one variant and **Option B** link to the other.

**Result:** Lead traffic is split between the two paths for comparison. Options: not enumerated in source.

### How do I branch a funnel by lead attributes (Filter)?
1. Drag the **Filter** action onto the workspace.
2. Configure the filter parameters (examples: invoice is generated, a lesson is accessible, included in a client group).
3. Connect the green output link to the path for leads that match and the red output link to the path for those that don't.

**Result:** Each lead is routed by its match status against the configured parameters.

### How do I embed a Process inside a funnel?
1. Drag the **Process** action onto the workspace.
2. Click **Create process** → enter a name in the modal → Save.
3. The process is substituted into the block. Click **Edit Process** to open the process constructor; save or cancel to return to the funnel.
4. Set **Execute for an object** to **Any number of times**, **Just one time**, or **Any number of times, but not simultaneously**.

**Result:** The process runs for contacts who reach this action.
**Gotchas:**
- Processes created via a funnel only appear inside that funnel. They are not listed on the **Process** page and not selectable from a contact card.
- The process can also fire via its own start trigger from elsewhere in the funnel.
- The process turns on/off with the funnel.

### How do I add a shared Timer for multiple pages or emails?
1. Drag the **Timer** action onto the workspace.
2. Set **Perform only once for an object**: Green = once per contact; Gray = reusable.
3. If reusable, set the reapply delay in minutes.
4. Select the type of timer and configure expiration settings.

**Result:** A common timer applies across the connected pages and emails.

### How do I add a stage marker (Custom block)?
1. Drag the **Custom block** action onto the workspace.
2. Enter a name.
3. Choose an icon.

**Result:** A labeled marker block sits on the canvas. It has no settings beyond name and icon.

### How do I add a traffic source to a funnel?
1. Drag the desired traffic element onto the workspace — AdWords, YouTube, Affiliates, Facebook, Instagram, WhatsApp, Email, CPA, or **Source** for any user-defined tags.
2. Set the UTM tags for this source.
3. Use **Copy link** to copy the link tail with the configured tags.
4. Use that link in the channel (ad platform, email, etc.).

**Result:** The funnel monitors traffic from any link carrying the configured tags.

### How do I link two funnel elements?
1. Hover the mouse pointer over the source element.
2. Drag toward the target element.
3. Click to connect.

**Result:** A link of the appropriate type is drawn between the two elements (see Link types between funnel elements for what each type means and what it can connect to).

### How do I make a button on a page send the user to the funnel's next page?
1. In the page maker, open the source button widget settings.
2. Either select **Open the link** then **Next page**, or select **Open the link** and enter `#nextpage` in place of a URL.
3. Save the page.
4. In the funnel editor, draw a **Next page** link from the source page to the target page or form.

**Result:** Clicking the button on the source page follows the canvas link. Changing the canvas connection later automatically updates the destination — no need to edit the button or the email again.

### How do I view statistics, add notes, undo, or redo in the editor?
1. Inside the funnel editor, use the top-right toolbar:
   - **Enable viewing statistics** to display stats.
   - **Adding block "Note"** to drop a Note block.
   - **Back** to undo, **Forward** to redo.
   - **Save** to persist.

**Result:** The chosen action runs immediately on the canvas.

### How do I enable or disable a sales funnel?
1. On My Funnels (top-left of the funnel preview) or in the funnel editor (top-right toolbar), move the slide bar.
2. Green = enabled; Gray = disabled.

**Result when disabled:**
- Pages in the funnel are not accessible.
- No actions are executed (draft emails are held but not sent until the funnel is disabled — at which point they are held, not deleted).
- Traffic is not monitored.

### How do I share a sales funnel?
1. Open the funnel in the editor.
2. Click the **Share** icon in the top right corner.
3. Move the **Get shareable link** slide bar to green.
4. Add the **Name** and **Description**.
5. Click **Save**.
6. Re-open the share panel, copy the funnel link, and send it to the receiver.

**Result:** Anyone with the link can access the shared funnel.

### How do I copy a sales funnel?
1. On My Funnels, click the **Gear** icon in the top right corner of the funnel preview.
2. Select **Copy**.

**Result:** A duplicate funnel appears in My Funnels.

### How do I add a sales funnel to a category?
There are two paths:

Path A — from My Funnels:
1. Click the **Gear** icon on the funnel preview.
2. Click the arrow next to the current category name (or **No Category** if unassigned).
3. Select the desired category from the drop-down.

Path B — from the Category edit page:
1. Go to `Contacts → Lists → Categories`.
2. Click the category name to open it.
3. Tick the funnels to include.
4. Click **Save**.

**Result:** The funnel is grouped under that category.

### How do I create a new category?
1. Go to `Contacts → Lists → Categories`.
2. Click **Add** at the top of the page.
3. Enter the **Name of the category**.
4. Select the sales funnels to include (selected funnels appear highlighted/grayed out).
5. Click **Save**.

**Result:** The new category appears on the Categories page.

### How do I edit an existing category?
1. Go to `Contacts → Lists → Categories`.
2. Click the category's **name** in the table.
3. Adjust the name and/or the included funnels.
4. Click **Save**.

**Result:** The category is updated. The Add and Edit pages are identical except for the heading ("To add" vs "To Edit").

### How do I remove a category?
1. Go to `Contacts → Lists → Categories`.
2. Click the **X** icon in the last column of the row for the target category.

**Result:** The category is removed.

### How do I filter the Categories list?
1. On the Categories page, click **Filter**.
2. Enter all or part of a category name (a full name returns exactly one; a partial name returns every category containing the substring).
3. Click **Search**.

**Result:** The table shows only matching rows. To restore the full table, click **Filter** then **Clear**.

### How do I delete a sales funnel?
1. On My Funnels, click the **Gear** icon on the funnel preview.
2. Click **Delete**.
3. In the confirmation pop-up, click **Yes**.

**Result:** The funnel is deleted along with all settings, draft emails, and pages.
**Gotchas:**
- The action cannot be undone.
- Anything saved in **Selected** survives the delete — save emails and pages as templates before deleting if you intend to reuse them.

## Cross-references
- **Related section:** Pages / Page Builder — Content, Activation, Webinar, Opt-in, Double opt-in, Upsell, Order, Payment, and Countdown pages are designed in the page maker reached from inside the funnel element settings (see https://help.influencersoft.com/hc/en-us/articles/360050388752-Creating-and-Editing-Pages-in-the-Page-Builder).
- **Related section:** Form Constructor — Subscription, order, and payment forms inside the funnel are built in the form constructor (see https://help.influencersoft.com/hc/en-us/articles/360050394552-Form-Constructor-Subscriptions-and-Orders-).
- **Related section:** Courses — Members area attaches courses and lessons configured in the Courses section (see https://help.influencersoft.com/hc/en-us/articles/360050695232-Course-Creation-and-Settings).
- **Related section:** Contacts → Lists — Funnel categories are managed at `Contacts → Lists → Categories`; lead groups referenced by Opt-in/Double opt-in pages and forms live in Contacts → Lists.
- **Related section:** Processes — The Process action embeds a process that can also be triggered by its own start trigger; processes created inside a funnel only appear within that funnel and not on the standalone Process page.

## Source articles
- [Funnel Categories](https://help.influencersoft.com/hc/en-us/articles/360050387592-Funnel-Categories)
- [Getting Started With Funnels](https://help.influencersoft.com/hc/en-us/articles/360050387612-Getting-Started-With-Funnels)
- [How to Create and Edit a Sales Funnel](https://help.influencersoft.com/hc/en-us/articles/360050850731-How-to-Create-and-Edit-a-Sales-Funnel)



---


# Website

## Overview

The Website area is where you build and manage the public-facing pages that visitors land on — sites, individual pages, file storage, custom domains, auto-webinars, broadcast pages, surveys, and viral promotions. Every InfluencerSoft account starts with a default site reachable at `yourlogin.influencersoft.com` and a default Homepage; you extend that by creating more sites, attaching custom domains/subdomains, building pages in the Page Builder (template designer) or pasting raw HTML, and layering on interactive blocks, analytics codes, surveys, and viral mechanics. This chapter documents every screen, field, dropdown option, and task across the 22 Website articles, covering Pages, the Page Builder, Website Settings, Page Settings, File Manager, custom domains and subdomains, automated webinars, broadcast pages, interactive blocks, viral promotions and their registration form, surveys and survey statistics, cookie-consent setup, Google Analytics integration, and hosting guidance.

## Where to find it

- `Top menu → Websites → Pages` — the central hub for choosing a site, listing pages, opening the editor, accessing the File Manager and HTML Templates.
- `Top menu → Websites → Settings` (also written as `Website → Settings` and `Websites → Set up`) — site-level settings, domain list, Add domain, DNS Editor.
- `Top menu → Websites → Webinars` — list, create, edit, deactivate, or delete auto-webinars.
- `Top menu → Websites → Pages → Set up` (button next to a site name) — opens that site's settings (Main parameters, More, Rights).
- `Top menu → Websites → Pages → (page name)` — opens Page Settings (Basic parameters, Additional, Rights).
- `Top menu → Websites → Pages → File Manager` — file storage for the account.
- `Top menu → Websites → Pages → HTML Templates` — manage custom HTML page templates.
- Promotions list and Surveys list are reached from the Websites menu as well (the source articles refer to a Promotions page and a Surveys page accessed through the Website section).

## Terminology

- **Site / Main Site** — A container for pages, bound to one or more domains. The default container created with the account is named "Main Site"; new ones are created with the **Create** button on the Pages screen.
- **Page** — A single URL inside a site. Each page has an identifier appended to the site's domain (`yourdomain.com/id_page`). New pages are auto-named `draft_xxxxxxxxxx` until renamed.
- **Sub-page / Nested page** — A page placed under another page so its address becomes `…/id_pages1/id_page2`.
- **Page Builder / Template Designer / Template Constructor** — The drag-and-drop visual editor used to build pages from sections and widgets. The source articles use all three names interchangeably.
- **HTML editor** — An alternative page editor where you paste raw HTML/CSS/JS into a single field instead of using the visual builder. Must be chosen at page-creation time.
- **Section** — A large horizontal block of a page categorised by purpose: promo, content, cap, footer, goods, etc. Sections live inside one of the page's three logical parts (header, main content, footer).
- **Widget** — An individual element (text, form, button, image, timer, video, etc.) placed inside a section.
- **Interactive block** — A widget or section flagged "interactive" so it can be toggled on/off live without making the visitor refresh the page. Used heavily during webinars.
- **Section "Interactive blocks management"** — The page from which you flip individual interactive blocks on or off for a live page.
- **HTML Templates** — Custom page templates you upload or build yourself, reachable from the **HTML Templates** button at the top of the Pages screen.
- **File Manager** — Cloud storage that holds images, CSS, JS, and other static files for your sites. Has a fixed quota shown at the top of the page.
- **Domain (additional / linked / delegated)** — A second- or third-level domain you point to InfluencerSoft so pages open on `yourdomain.com` rather than `yourlogin.influencersoft.com`.
- **DNS Editor** — Built-in editor for managing DNS records on second-level linked domains (A, AAAA, MX, TXT, CNAME). Opens when you click an Active second-level domain in Website → Settings.
- **Name Servers** — DNS server records the system generates for you to enter at your registrar to delegate a second-level domain.
- **CNAME** — DNS record type used when binding a subdomain.
- **Status (Active / pointed elsewhere / pending)** — Visual state shown for each linked domain after submission.
- **Favicon** — The icon shown in the browser tab; uploaded via `Site settings → Main parameters → Icon (favicon.ico)`.
- **Copyright text** — Footer text shown on every page of a site, configured under `Site settings → More`.
- **Auto-webinar / Autowebinar** — A pre-recorded video that simulates a live webinar, with a schedule, a countdown timer page, a broadcast room, chat options, and a pop-up offer button.
- **Webinar room** — The page that displays the broadcast video plus optional pop-up offer.
- **Broadcast page** — A page in your site (not an auto-webinar) that embeds a YouTube live stream; built quickly from the **Webinars** template tab.
- **Timer (page-level)** — Per-page countdown that hides the page or shows a replacement when it expires.
- **Split testing (A/B testing)** — Multiple page variants served with a percentage split that totals 100%; analysed via the **A/B** button on the Pages screen.
- **Interactivity mixer / interactivity switch** — The control that flips all currently interactive blocks on the page.
- **Viral promotion / Viral action** — Mechanic that gives access to a product in exchange for the participant bringing in new subscribers through a personal link.
- **Viral promotion registration form** — Subscription form that signs visitors up as participants of a viral promotion.
- **Survey** — An InfluencerSoft questionnaire that also segments respondents into contact groups based on their answers.
- **"Polled" group (example)** — Suggested name for a deduplication group used in the survey **Add to list** field to exclude people who already answered.
- **Add to List (Survey Statistics)** — Action that pushes respondents who picked a specific answer into a chosen or newly created group.
- **HEAD code field** — Field on `Site → More` and on each Page's **Additional** tab where custom HTML/JS (Google Analytics, FB pixel, retargeting, iubenda banner, etc.) is injected into `<head>`.
- **Footer code field** — Sister field to HEAD code; supports HTML, JS, or plain text and is rendered inside `<footer>`.
- **Universal Analytics (analytics.js)** — Google Analytics version required for the e-commerce integration; the older `ga.js` is not supported.
- **e-Commerce tracking** — A toggle inside the GA property that must be enabled for InfluencerSoft order data to flow.
- **Code counter / Counter code** — Auto-webinar fields for injecting analytics/metric code into the timer page or the broadcast page.
- **iubenda** — Third-party service (iubenda.com) used by the recommended cookie-consent workflow.

## Screens and fields

### Screen: Pages (Websites → Pages)

- **Purpose:** Central list of every page for the currently selected site, with statistics, status toggles, sub-page navigation, and entry to the editor.
- **How to open:** `Websites → Pages`. If you have multiple sites, click the site name to drill in; if there is only one site it opens automatically.
- **Fields and columns:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Site picker | dropdown / list | yes | List of sites in the account; click the name to enter | Main Site |
| Page identifier filter | text | no | Exact ID = single page; fragment = all matching pages | empty |
| Active / Inactive | radio button | no | Show only active or only inactive pages | Active |
| Hide pages without views | checkbox | no | Hides pages with zero views in the selected period | unchecked |
| Period since … till | date range | no | Custom start and end dates for the stats columns | not stated |
| Quick period filter | preset buttons | no | "Most popular periods" rendered above the table; options not enumerated in source | not stated |
| Pages column | link | — | Click to edit the page in the editor | — |
| Clicks / @ / Sales / Conversion / Profit / Profit from a visitor | numeric stats | — | Per-page stats for the selected period | — |
| Status slider | toggle | — | Right/green = active, left/dark grey = inactive | green |
| Reset-stats button | round-arrows button | — | Resets stats for the selected period | — |
| A/B button | button | — | Expands per-variant stats when a split test exists | — |
| Green eye button | button | — | Opens the live page in a new tab | — |
| Folder icon next to page name | button | — | Drills into nested sub-pages | — |
| `…` (three dots) in Pages column | link | — | Goes one level up out of sub-pages | — |
| X (last column) | button | — | Deletes the page permanently | — |

- **Buttons and actions:**
  - **Add** — Creates a new page; routes into template selection.
  - **Set up** (next to site name) — Opens that site's Website Settings.
  - **File Manager** — Opens the File Manager screen.
  - **HTML Templates** — Opens the HTML Templates screen for managing custom templates.
  - **Create** — Used in the site-level area to create a new site (mentioned in the domain-binding flow).
- **Notes:**
  - The **Save** button at the bottom of an interactivity-mode editor is "just part of the page's template and has no use" — the system auto-saves on each switch.
  - The interactivity-mixer switch only appears on rows whose pages contain at least one interactive block.

### Screen: Template Selection (page creation)

- **Purpose:** Choose a starting template (or HTML editor) when adding a new page.
- **How to open:** `Websites → Pages → Add`.
- **Fields:** Gallery of predefined templates organised in tabs. The source explicitly names a **Webinars** tab containing templates "already configured and prepared for the webinar". Other tabs/categories are not enumerated in source.
- **Buttons and actions:**
  - **View** (appears on hover of a template image) — Opens a preview of the template.
  - Preview view-switcher — Toggles between desktop and mobile preview.
  - **Create from this template** (action implied by "move on to creating a page on the selected template") — Starts the editor with the chosen template applied.
  - **HTML editor** — Selects the raw-HTML route instead of a visual template. After selecting it you enter a unique page identifier (which becomes part of the URL and is visible to visitors) and the HTML editor page opens.
- **Notes:**
  - Choice of HTML editor vs. visual editor must be made here at page-creation time; it cannot be switched later in Page Settings.

### Screen: Page Builder (visual template designer / device editor)

- **Purpose:** Drag-and-drop construction of a page from sections and widgets.
- **How to open:** Pick a non-HTML template at page creation, or click a page name from the Pages list (when the page was built visually).
- **Layout:**
  - Editor takes the full screen width.
  - Controls are at the bottom: **left = page settings; right = adding new items**.
  - The page is divided into three logical parts: **header**, **main content**, **footer**. You add sections inside each part, and widgets inside each section.
- **Fields and controls:**

| Element | Type | Description |
|---|---|---|
| Left panel buttons | icon group | Page-settings controls (gear icon opens Site settings; exact buttons not enumerated in source) |
| Right panel (Add item) | button + panel | Opens the section/widget catalogue with a **Widgets** tab |
| Widget search/drag | drag handle | Hold and drag widget into section; insertion point shown by a blue line |
| Move handle | block header | Click and hold block header to move a section or widget |
| Element settings panel | right-side panel | Appears when you click an item; contains ready-made styles plus an **html/CSS** tab where you can attach CSS classes |
| Gear (bottom-left) | button | Opens Site settings (fonts, background, image compression, additional code in header, basic SEO, social image upload) |

- **Section categories named in source:** promo, content, cap, footer, goods, etc. ("etc." — full list not enumerated in source).
- **Buttons and actions:**
  - **Add item** — Opens a panel with prebuilt sections and a **Widgets** tab.
  - **Settings** (upper-left of a section) — Opens section settings, including the **interactivity** checkbox.
  - **Save** — Saves the page; must be clicked before exiting.
- **Notes:**
  - Pages built with the visual editor automatically inherit code from the site-level HEAD/footer code fields. HTML-editor pages do **not** inherit that code.
  - The text widget supports separate desktop and mobile indent values inside its settings.

### Screen: HTML Editor (page-level)

- **Purpose:** Paste a complete custom HTML/CSS/JS landing page into one InfluencerSoft page.
- **How to open:** During page creation, choose **HTML editor** from the template selection screen instead of a visual template.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Page identifier | text | yes | A-Z, a-z, 0-9, underscore (_), hyphen (-). Becomes part of the URL and is visible to visitors. | `draft_xxxxxxxxxx` |
| HTML code field | code area | yes | Paste full page code; only what is written here is rendered. | empty |

- **Buttons and actions:**
  - **Save** — Persists the code.
- **Notes:**
  - Code from the page's **Additional** tab (Additional HEAD code) is **not** injected into HTML-editor pages.
  - Site-level HEAD code is also not injected — Google Analytics, retargeting pixels, etc. must be embedded directly in the HTML.

### Screen: Site Settings (Page Builder gear / "Site settings" menu)

- **Purpose:** Per-page advanced options surfaced from the editor's gear icon. (Distinct from the site-wide Website Settings screen.)
- **How to open:** Click the gear in the lower-left corner while editing a page.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Fonts | dropdown | no | Choose from the list of proposed fonts | not stated |
| Background | image / color picker | no | Site background | not stated |
| Compress images when loading | checkbox | no | When checked, images are compressed without losing quality; when unchecked desktop visitors see original images, mobile visitors still get a device-appropriate non-compressed variant | checked (compression on by default) |
| Additional code in header | code field | no | Personal style or JavaScript | empty |
| Title | text | no | Basic SEO | empty |
| Description | text | no | Basic SEO | empty |
| Image for social networks | file upload | no | OG image | empty |

- **Tabs:** Source explicitly names an **Images** tab containing the "Compress images when loading" checkbox; other tab names not enumerated.
- **Notes:**
  - On image upload, InfluencerSoft stores the image in several resolutions and serves the closest one to the visitor's device.

### Screen: Website Settings — site-level (Websites → Settings, or Pages → Set up)

- **Purpose:** Configure an individual site: name, primary domain, favicon, footer copyright, global HEAD and footer code, and admin permissions.
- **How to open:**
  - `Websites → Pages → Set up` (button opposite the site name), or
  - `Websites → Settings → (site name)`.
- **Tabs:**
  - **Main parameters**
  - **More**
  - **Rights** (also referenced as a separate area)
- **Main parameters tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Site name | text | yes | Display name of the site | not stated |
| Domain | dropdown | no | Pick from your delegated domains; selects which domain the site is built on. Domains starting with `www.` cannot be selected as primary. | not stated |
| Icon (favicon.ico) | file upload | no | Icon shown on all pages of the site | not stated |
| Store column marker | radio | no | In the domain table (also reachable from Settings), sets the chosen domain as the primary store domain | not stated |

- **More tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Copyright text | text / WYSIWYG | no | Displayed at the bottom of every page on this site | empty |
| Code to add to the `<head>` page | code | no | HTML and JS; used for GA, FB pixel, iubenda cookie banner, retargeting, etc. | empty |
| Code for adding to `<footer>` pages | code / text | no | Supports HTML, JS, and plain text | empty |
| Add HEAD code (alias) | code | no | Same field referenced as "Add HEAD code" in older docs | empty |

- **Rights tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Additional administrators | multi-select dropdown | no | Selects admins (created in the Employees section) who can access this site | none |

- **Buttons and actions:**
  - **Save** — Persists changes.
- **Notes:**
  - Site-level HEAD code applies to all visual-editor pages on the site but **not** to HTML-editor pages.
  - When the primary domain changes you must regenerate subscription forms, order forms, and order buttons and replace them on your pages.

### Screen: Page Settings (Websites → Settings → page name)

- **Purpose:** Per-page configuration: identifier, editor mode, timer, split testing, additional code, and admin rights.
- **How to open:** `Website → Settings`, click the site, then click the page name. (Equivalent to clicking the page in `Websites → Pages`.)
- **Tabs:**
  - **Basic parameters**
  - **Additional**
  - **Rights**
- **Basic parameters tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Page identifier | text | yes | A-Z, a-z, 0-9, underscore, hyphen. Becomes part of the URL and is visible to visitors. | `draft_xxxxxxxxxx` |
| Editor body | template designer or HTML code field | yes | Visual builder if a template was chosen, otherwise a single HTML code area | template-dependent |
| Timer | dropdown / On-Off | no | "Off" by default. Click to switch on; opens timer-type options. | Off / Disabled |
| Timer type | dropdown | no (if timer enabled) | Options: (a) absolute end time (e.g. sale ending at 00:00 on a date); (b) repetition every X minutes; (c) relative end time, with two sub-options — countdown starts from page entry, or countdown starts from when the email was sent (used in automatic email series) | not stated |
| After timer expires | section | no | If HTML editor was used: shows an HTML code field for the replacement page. If Template Editor was used: shows **Choose a template** and **+ Copy** buttons. | empty |
| Choose a template | button | conditional | Creates the post-timer page from scratch using a template | — |
| +Copy | button | conditional | Copies the current page as the post-timer page so you can edit it | — |
| Split testing — Variant №… | collapsible block | no | Each variant has its own editor; click the title to collapse/expand | one variant |
| Add variant | button | no | Adds another variant editor block | — |
| Percentage shown | numeric | yes if multiple variants | Per-variant share; all variants must sum to 100% (2 variants → 50/50, 3 variants → 33/33/34) | 100 |

- **Additional tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Code in `<head>` | code | no | Retargeting code, page-specific scripts | empty |
| Protecting videos from YouTube | checkbox | no | Hides the YouTube logo and modifies player appearance | unchecked |
| Hide title of the video | checkbox | no | Hides the video title in the player; applies when video protection is on | unchecked |

- **Rights tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Choose additional administrators to have access to this page | checkbox + dropdown | no | Tick the box, then pick admins from the dropdown | unchecked |

- **Buttons and actions:**
  - **Save** — Persists all tabs.
- **Notes:**
  - It is "not recommended to change more than 1 page element at a time" when split-testing.
  - If a page loads as a blank white page, the cause is usually an expired timer; disable the timer in Page Settings and save.
  - HTML editor cannot be swapped in via Page Settings — it must be selected at page creation.

### Screen: File Manager

- **Purpose:** Upload, organise, view, rename, and delete files used by your pages (images, CSS, JS, etc.).
- **How to open:** `Websites → Pages → File Manager`.
- **Fields and controls:**

| Element | Type | Description |
|---|---|---|
| Quota indicator (top of page) | text | Shows space used and space available |
| Folder/file table | list | Each row is a folder or file |
| Folder icon (next to name) | link | Click to drill into the folder |
| `…` folder row in subfolders | link | One level up |
| Document icon (next to file name) | link | Opens the file in a new tab (or downloads if format can't be previewed, e.g. `.zip`) |
| Copy button (last column on file row) | button | Copies the file to the clipboard |
| Rename | inline editor | Click the file/folder name to open the rename editor |
| Delete (X) | button | Removes the file or folder |

- **Buttons and actions:**
  - **+ New Folder** — Opens a name prompt; allowed characters are Latin letters, numbers, periods (`.`), underscores (`_`), and hyphens (`-`). Click **Create** to add.
  - **Paste from clipboard** — Appears only when a file is on the clipboard; performs a **move (not copy)** into the current folder.
  - **Start** — Returns to root from any subfolder.
  - **Apply** — Saves a rename.
  - **Download Files here** — Opens the OS file picker for upload; supports multi-select.
- **Notes:**
  - "Each user of the system is provided with a certain amount of space for storing files." Limit value not enumerated in source.
  - For books, audio, video, courses, and downloads the source recommends external storage (Google Drive, Dropbox); InfluencerSoft's quota is sized for images and styles.

### Screen: Website Settings — Domains (Websites → Settings → Domains)

- **Purpose:** Add, monitor, activate, and manage custom domains and subdomains linked to InfluencerSoft.
- **How to open:** `Website → Settings`, then the **Domains** button. Same area surfaces the **Add domain** action.
- **Fields:** Domain table containing each linked domain with a status badge. Status values seen in source:
  - "After buying a domain or any changes in its settings" (post-submission state).
  - "If your domain was pointed to another host."
  - **Active** — set after records propagate.
- **Buttons and actions:**
  - **Add domain** — Opens a dialog with one field for the domain name (full string, e.g. `shop.moyblog.com` or `your-domain.com`) and a **Next** button.
  - **Get DNS settings for your domain** — Generates the Name Servers / DNS values to enter at your registrar.
  - **Check** — Validates the records on InfluencerSoft's side (subdomain workflow); records can take 24–48 hours to propagate.
  - **Store column marker** (radio in the domain table) — Sets a domain as the store's primary domain.
- **Notes:**
  - Domains starting with `www.` cannot be selected as primary; connect them without `www`.
  - InfluencerSoft's system reports name servers `*.cloudflare.com` for your domain because `influencersoft.com` uses them; physically these records are not in the Cloudflare DNS editor.
  - Subdomain binding: when your second-level domain already has a site elsewhere, create a third-level subdomain at the registrar (e.g. `hello.example.com`) pointing to InfluencerSoft IP `176.9.85.146` (A record) — the second-level site continues working.
  - GoDaddy A-record fields used during binding: **Host** (the subdomain prefix), **Points to** (InfluencerSoft IP `176.9.85.146`), **TTL** (default 1 hour). DNS can take up to 48 hours globally.
  - Existing live sites cannot be bound — doing so will lose the existing site. Use a new second-level domain or a fresh subdomain.
  - Maximum waiting time for domain activation is 48 hours; usual check interval is 2–4 hours.

### Screen: DNS Editor

- **Purpose:** Manage DNS records on a second-level domain linked to InfluencerSoft (typically used for domain mail with services like G Suite).
- **How to open:** In `Website → Settings`, click the name of a second-level domain whose status is **Active**.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Record type | dropdown | yes | A, AAAA, MX, TXT, CNAME | not stated |
| Record value | text | yes | The record's value (depends on type) | empty |
| Status | toggle | — | Enabled (coloured) or disabled (grey) | Enabled |

- **Buttons and actions:**
  - **Adding a record** — Opens the new-record form; the same label is reused as the submit button.
  - Status switch — Click to disable a record temporarily; click again to re-enable.
- **Notes:**
  - First open shows a data-loading window (up to 2 minutes) before records appear.

### Screen: HTML Templates

- **Purpose:** Manage custom user-built HTML page templates (not the default templates).
- **How to open:** `Websites → Pages → HTML Templates` (button at the top of the Pages screen).
- **Fields:** Not enumerated in source.
- **Buttons and actions:** Not enumerated in source.
- **Notes:** Source only states that this is where custom templates can be created or uploaded.

### Screen: Pages — Interactive blocks editor

- **Purpose:** Flip interactive widgets and sections on or off live during a broadcast.
- **How to open:** Three routes:
  1. Open the page in the constructor and use the new switch button that appears once at least one block is marked interactive.
  2. From the general page-edit view, use the same switch button.
  3. From `Website → Pages`, use the "interactivity mixer" button next to the page's enable/disable switch.
- **Fields:** A list of every interactive block, each with its own switch.
- **Buttons and actions:**
  - Per-block switch — Enables or disables that block on the live page.
- **Notes:**
  - The page auto-saves on every switch; the bottom **Save** button is just template chrome.
  - New blocks added during a live broadcast will not appear for visitors who already have the page open until they refresh.
  - Blocks that were marked interactive **before** a visitor loaded the page can be toggled without forcing a refresh.

### Screen: Interactive Blocks Management

- **Purpose:** Dedicated page for managing all interactive blocks on a page outside the editor.
- **How to open:** From the main page settings, click the **Interactive blocks management** button.
- **Fields and controls:** Same per-block switches as the in-editor view.
- **Notes:** Each widget's settings panel has an "interactive" checkbox that must be ticked first. Sections become interactive via the **Settings** menu in the section's upper-left corner.

### Screen: Webinars list (Websites → Webinars)

- **Purpose:** List, create, edit, deactivate, and delete auto-webinars.
- **How to open:** `Website → Webinars`.
- **Fields:**

| Field | Type | Description |
|---|---|---|
| Name filter | text | Searches webinar names; partial matches return multiple results |
| Date range filter | date range | Limits stats to a period; used for view counts and service cost |
| Status slider | toggle | Green = active, grey = inactive |
| X button | button | Permanently deletes a webinar |

- **Buttons and actions:**
  - **Create webinar** — Opens the new-webinar dialog (Name field, then a YouTube link field, then **Next**).
  - **Search** / **Clear** — Apply or reset filters.

### Screen: Auto-webinar — Settings tab

- **Purpose:** Core metadata, branding, speaker info, and domain selection for the auto-webinar.
- **How to open:** `Website → Webinars → Create a webinar`, name it, paste a YouTube link, then **Next**.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Name of the auto webinar | text | yes | Displayed on the subscription page | empty |
| Topic of the auto webinar | text | yes | Displayed on subscription, timer, and broadcasting pages | empty |
| Header picture | file upload | no | Displayed in the upper middle of the broadcasting page | empty |
| Code counter to the reference page | code | no | Metrics code injected on the timer page to capture attendance data | empty |
| Speaker name | text | no | Displayed on subscription and countdown pages | empty |
| Speaker photo | file upload | no | Same as above | empty |
| Internal address | text (Latin chars) | yes | Tail of the auto-webinar subscription URL | empty |
| Domain | dropdown | no | One of your delegated domains; chosen domain replaces the default in the auto-webinar link | account default |

- **Buttons and actions:**
  - **Save** — Persists this tab. Each tab can be saved separately.

### Screen: Auto-webinar — Schedule tab

- **Purpose:** Define when the auto-webinar plays.
- **How to open:** Schedule tab on an auto-webinar.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Date mode | radio / option | yes | Start from subscription date / specific days of the week (e.g. each Saturday) / specific dates. Auto-webinars cannot repeat endlessly. | not stated |
| Number of dates available | numeric | no | Shows subscriber how many dates they can pick from | not stated |
| Days after subscription | numeric | conditional | If start mode is "subscription date", how many days after subscribing a participant can watch | not stated |
| Time options | time list | yes | Specific session times | not stated |
| Add exact time | button + time input | — | Adds one exact session time | — |
| Add every N minutes | button + numeric | — | Bulk-adds times every 5, 10, 15, etc. minutes across the interval | — |
| Delete all times | button | — | Clears the time settings window | — |
| Redirect logic | dropdown / radio | yes | Choose which session opens when a participant clicks: the first not-yet-ended auto-seminar, or the last currently-broadcasting webinar less than the time you set | not stated |

### Screen: Auto-webinar — Preview tab

- **Purpose:** Inspect what the participant will see.
- **How to open:** Preview tab on an auto-webinar.
- **Fields:** Two preview links:
  - Page with timer — Countdown to the event.
  - Webinar room — The broadcasting page.

### Screen: Auto-webinar — Room tab

- **Purpose:** Configure the broadcasting room.
- **How to open:** Room tab on an auto-webinar.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| URL to YouTube video | text | yes | Same link entered at creation; editable here | the link entered at creation |
| URL to redirect after the webinar | text | no | Where the user goes after the auto-webinar ends | empty |
| Timer for display text | time (HH:MM:SS) | no | Moment after video start when the pop-up text/button appears | empty |
| Pop-up content | WYSIWYG / code | no | Body of the fee-based offer pop-up; can include buttons linking to a landing page or checkout | empty |
| Counter code for the broadcast page | code | no | Analytics / HTML / CSS / JS for tracking visits to the broadcast page | empty |

### Screen: Auto-webinar — Chat tab

- **Purpose:** Configure simulated chat/comments.
- **How to open:** Chat tab on an auto-webinar.
- **Fields and modes (radio group):**

| Mode | Description |
|---|---|
| No comments | No comments displayed during the auto-webinar |
| HTML-code | Embed Facebook comments or other social-platform comment widgets via HTML; answer participants live |
| Automatic comments | Upload names and pre-written comments in chronological order |

- **Automatic comments fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Allow visitors to comment | checkbox | no | Lets visitors post during the webinar | unchecked |
| Notification email | text (email) | no | Receives comments from visitors | empty |
| Names | text list | no | Visitor names shown as an attendee list | empty |
| Percentage of visitors at start | numeric (%) | no | How many of the simulated visitors are "present" when the webinar begins | not stated |
| Import messages | text area | no | Paste messages in the format shown under the field | empty |
| Upload messages from file | file upload | no | Bulk import; format described inline in the UI | empty |

- **Buttons and actions:**
  - **Save** — Persists the Chat tab.
- **Notes:**
  - Clickable links in imported comments must use the format `1|Alex Grey|<a href="https://example.com/">website</a>` with straight quotation marks. The first token is the comment number; the second is name + surname; the third is the anchor tag.

### Screen: Promotions list (Website → Promotions)

- **Purpose:** List all viral promotions for the account; access registration form and statistics.
- **How to open:** `Website → Promotions` (reached from the Website section).
- **Fields and controls:**

| Element | Description |
|---|---|
| Promotion name | Click to edit the promotion |
| Subscription entry point link | Opens the public page where participation conditions live |
| Registration form button | Opens the Viral Promotion Registration Form for the promotion |
| Bar-chart button | Opens viral promotion statistics |
| X (last column) | Removes the viral action |

- **Buttons and actions:**
  - **Add promotion** — Opens the Promotion editor (three tabs: Basic information, Additional information, Gift for recommendation).

### Screen: Promotion — Basic information tab

- **Purpose:** Name and describe the promotion and set the entry URL.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Name of the promotion | text | yes | Display name | empty |
| Description | WYSIWYG / text | yes | Text shown on each participant's individual page (where they track progress) | empty |
| Where to invite friends to | URL | yes | URL of the page with the InfluencerSoft subscription form — can be hosted in InfluencerSoft or on a third-party site | empty |

### Screen: Promotion — Additional information tab

- **Purpose:** Duration, share copy, and welcome-email content.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Action type | radio | yes | Perpetual / has a validity period | not stated |
| End day | date | conditional | Required if time-limited | empty |
| End time | time | conditional | Required if time-limited | empty |
| Share text | text | yes | Copy the participant uses when sharing the personal link on social networks | empty |
| Email title | text | yes | Title of the email sent to a participant immediately after subscription | empty |
| Email body | WYSIWYG | yes | Instructions email; uses `{$ link}` token for the personal-page link | empty |

### Screen: Promotion — Gift for recommendation tab

- **Purpose:** Define the gift(s) participants receive for hitting subscriber or revenue targets.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Gift name | text | yes | Name shown to participants | empty |
| Number of subscribers required | numeric | yes | Subscribers needed to earn the gift | not stated |
| Gift delivery info | WYSIWYG / text | no | Download link or pickup instructions | empty |
| Type of gift (2nd and later) | radio | yes | Subscribers / Money | not stated |
| Goal of subsequent promotion | radio | yes | Gain more subscribers / Increase customer spend | not stated |
| Target subscribers | numeric | conditional | Referrals required for the gift (when goal = more subscribers) | not stated |
| Target spend ($) | numeric | conditional | Dollar amount the referred subscribers must spend (when goal = increase spend) | not stated |

- **Buttons and actions:**
  - **Add another gift** — Adds a new gift tier to build a multi-stage campaign.
  - **Save** — Adds the promotion to the Promotions list.

### Screen: Viral Promotion Registration Form

- **Purpose:** Build the subscription form participants use to join a promotion; outputs HTML to embed on a page.
- **How to open:** From the Promotions list, click the **Registration form** button.
- **Initial state:** Only one field is shown — **Add to Groups** — until a group is selected.
- **Add to Groups field:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Add to Groups | checkbox list (groups) | yes | Group(s) participants are added to; groups must be created beforehand | none |

- **Tabs (visible after a group is selected):**
  - Main settings
  - Form fields
  - Form type (also called Kind of form)
- **Main settings tab:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| URL after activation | text | yes | URL of a custom page for participants (cannot be changed after activation) | not stated |

- **Form fields tab:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Email (and other subscriber data) | checkbox list | yes (email required) | Tick the subscriber fields you want to collect | not stated |

- **Form type / Kind of form tab:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Button style | radio | no | Choose a ready-made button or supply custom text | not stated |
| Custom button text | text | conditional | Appears when "set text" mode is chosen | empty |
| Custom button image | file (via File Manager) | conditional | Used when switching to "load your button" mode | empty |
| Form-field width | numeric / preset | no | Width of the form's input fields | not stated |
| Upload Image | button | — | Opens the File Manager to pick or upload the button image | — |
| Download (inside File Manager) | button | — | Uploads a new image | — |

- **Check the Results block (duplicated on every tab):**
  - Live form preview.
  - HTML code box — Copy and paste this onto the destination page.

### Screen: Viral promotion statistics

- **Purpose:** Overview of total registrations and per-participant referral counts.
- **How to open:** From the Promotions list, click the bar-chart button.
- **Fields:**

| Field | Type | Description |
|---|---|---|
| Date range (Set period) | start date + end date | Restricts the statistics to a period |
| Participants table | data | Totals per participant |

- **Buttons and actions:**
  - **Set period** — Opens the date-range pop-up; **Set** applies it.
  - **Export All** — Downloads every participant to your computer.
  - **Export by Number of Visits** — Opens an input where you enter a referral threshold, then click **Upload** to export matching participants.

### Screen: Surveys list (Website → Surveys)

- **Purpose:** List, search, deactivate, delete, and inspect surveys.
- **How to open:** `Website → Surveys`.
- **Fields and columns:**

| Element | Description |
|---|---|
| Survey Page link | Opens the public survey-completion page |
| Mailing Link | Link to embed the survey in an email |
| Status slider | Green = active; dark grey = inactive |
| Bar-chart button | Opens survey statistics |
| X | Permanently deletes a survey |

- **Buttons and actions:**
  - **Create Survey** — Opens the new-survey editor.
  - **Search** / **Clear** — Apply or reset the name filter.

### Screen: Survey — Main settings tab (Create / Edit Survey)

- **Purpose:** Define the survey's name, description, dedupe group, and duration.
- **How to open:** **Create Survey** from the Surveys list, or click a survey's name to edit. Both screens are identical apart from the title.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Name | text | yes | Survey name | empty |
| Description | text / WYSIWYG | no | Optional explanatory instructions for the interviewer | empty |
| Add to list | dropdown / list picker | no | Group used to dedupe respondents who already answered (e.g. a "Polled" group) | none |
| Duration | radio | yes | Unlimited / valid until a certain date | Unlimited |
| End date | date | conditional | Required if a finite duration is chosen | empty |

### Screen: Survey — Pages tab

- **Purpose:** Configure the survey URL, the page structure, and the questions.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Survey page URL | text | yes | Automatically prefixed with the store's primary domain | auto |
| Page description | text | yes | Description shown above each page's questions | empty |

- **Buttons and actions:**
  - **Add page** — Inserts a new page block (Page 2, Page 3, …).
  - **Add Question** — Opens the question pop-up.
- **Question pop-up — common fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Type of question | dropdown | yes | One answer / Multiple answers / String field / Text block | not stated |
| Question Text | text | yes | The question itself | empty |
| Description | text | no | Optional helper text under the question | empty |
| Mandatory | checkbox | no | Marks the answer as required | unchecked |

- **One answer type:**
  - Default 2 answer options; **add the response option** button adds more.
  - Right-side arrows reorder options.
- **Multiple answers type:**
  - Default 2 options; **add the response option** button adds more.
  - Right-side arrows reorder options.
  - **Add option "Other"** button — Appends a free-text "Other" option, always pinned to the bottom; X removes it.
- **String field type:** Single-line text reply up to 255 characters. **Allow to enter only digits** checkbox restricts input to numeric characters.
- **Text block type:** Multi-line custom-length text; you must set the block size in lines (controls when a scroll bar appears).

### Screen: Survey — Actions tab

- **Purpose:** Wire fixed-answer questions to add/remove respondents from groups.
- **Fields (Add action pop-up):**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Question | dropdown | yes | Choose which question triggers the action | not stated |
| Contact | dropdown / radio | yes | "answered" (participants who answered a certain way) or "did not respond" (all except those who answered a certain way) | not stated |
| Answer | radio | yes | Selects which answer triggers the action | not stated |
| Group(s) | tree picker | yes | Pick groups to add to or remove from; click the blue folder to switch category; tick checkboxes to select groups; ticking the category checkbox selects all groups within | none |

- **Buttons and actions:**
  - **Add action** — Opens the pop-up.
  - **Save** — Saves the action.
  - **X** next to an action — Deletes the action.

### Screen: Survey — Additional settings / Language settings tab

- **Purpose:** Configure default text shown on the survey UI and the reward-page address.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Default UI text | text fields | no | Overrides for the survey's built-in labels | system defaults |
| Reward page address | URL | no | Page shown to participants if you offer a gift/bonus for completing the survey | empty |

- **Buttons and actions:**
  - **Save** — Adds the survey to the Surveys list.
- **Notes:**
  - The source titles this tab "Language settings" in the article body but the lead refers to it as "Additional settings"; both names appear for the same tab.

### Screen: Survey statistics

- **Purpose:** View per-question response data and optionally segment respondents.
- **How to open:** Surveys list → bar-chart button next to the survey.
- **Fields and controls:**

| Element | Description |
|---|---|
| Question row | Click to expand stats inline; click again to collapse |
| View Responses (free-text questions) | Opens a window listing each respondent's answer; **Back to the "Surveys Statistics" page** closes it |
| Pie chart (fixed-answer questions) | Top of the expanded view |
| Answer table | Per-answer counts/percentages under the pie chart |
| Add to List | Adds respondents with a specific answer to a contact group |

- **Add to List dialog fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Group | dropdown | yes | Existing group, or create new | none |
| New group name | text | conditional | Required if "create new" is selected | empty |

## Common tasks

### How do I create a new website page?

1. Go to `Websites → Pages`.
2. Click the site name (or stay on the only site).
3. Click **Add**.
4. On Template Selection, hover any template and click **View** to preview it; switch between desktop and mobile preview to confirm fit.
5. Either pick that template (and move on to creating from it) or pick **HTML editor** if you have ready-made HTML to paste.
6. If you chose HTML editor, set a meaningful page identifier (A-Z, a-z, 0-9, `_`, `-`) — it appears in the URL.
7. Build or paste the page, then click **Save**.

**Result:** The page appears in the Pages list at `yourdomain/id_page` (compiled from the main domain and the page ID).
**Options along the way:** Pick the Webinars tab if you want a pre-configured broadcast layout (see "How do I make a webinar broadcast page in 5 minutes?").
**Gotchas:** Once you commit to HTML editor you cannot later use the visual builder for that page. New pages are named `draft_xxxxxxxxxx`; rename the identifier before going live.

### How do I edit an existing page?

1. Go to `Websites → Pages`.
2. Click the site name.
3. Click the page name in the **Pages** column.

**Result:** Opens the relevant editor (Page Builder or HTML editor) for that page.

### How do I delete a page?

1. Go to `Websites → Pages` and open the relevant site.
2. Locate the page in the table.
3. Click the **X** in the last column.

**Result:** Page is removed.
**Gotchas:** Irreversible. To merely hide a page, use the status slider instead.

### How do I temporarily disable a page?

1. In `Websites → Pages`, find the page row.
2. Move the status slider in the second-to-last column to the **left** (dark grey) to disable.
3. Move it to the **right** (green) to re-enable.

### How do I make a page nested under another?

1. From the Pages list, click the folder icon next to the parent page's name.
2. Add or work with pages — they now live under `/id_parent/`.
3. Click `…` in the **Pages** column to step back up a level.

**Result:** Nested URLs of the form `yourlogin.influencersoft.com/id_pages1/id_page2`.

### How do I add a section or widget to a page in the Page Builder?

1. Open the page in the editor.
2. Click **Add item** (bottom right).
3. To add a section, choose from the category tabs (promo, content, cap, footer, goods, etc.) and drop it into the header, main content, or footer area.
4. To add a widget, first click an existing section to select it, then in the right-side panel choose the **Widgets** tab.
5. Hold the desired widget and drag it; the insertion point is shown by a **blue line**.
6. Release to drop.

**Result:** Element added; click it to open its settings panel on the right.

### How do I move a section or widget?

1. Click the **block header** of the section/widget.
2. Hold the left mouse button and drag to the new location.

### How do I change the look of an item?

1. Click the item to open its settings on the right.
2. Pick from the ready-made styles, or open the **html/CSS** tab and add CSS classes.

### How do I change the indents differently for desktop and mobile in a text widget?

1. Open the text widget's settings.
2. Set the desired indent values separately for desktop and mobile.

### How do I configure page-wide site options (fonts, background, image compression, header code, SEO, social image)?

1. In the editor, click the gear icon in the lower-left corner.
2. Adjust fonts, background, image-compression toggle, additional HEAD code, title, description, and social-network image.
3. Save the page.

### How do I turn off image compression for a page?

1. While editing the page, click the gear icon (lower left).
2. Open the **Images** tab.
3. Uncheck **Compress images when loading**.

**Result:** Desktop users see the original image size and quality; mobile users still receive a device-appropriate variant without compression.

### How do I paste a custom landing page (HTML/CSS/JS) into InfluencerSoft?

1. In `Website → Pages → File Manager`, upload all the landing page's images, CSS, JS, and jQuery files. Optionally create folders (e.g. IMG, CSS, JS; or Main, Lanpage1, etc.).
2. Open every `.html` and `.css` file in a text editor and replace each `…/image.png`-style path with either the absolute path `http://your_domain_to_influencersoft.com/media/content/your_login/image.png` or the relative path `/media/content/your_login/image.png`.
3. Repeat the path replacement for CSS, JS, and jQuery references, e.g. `<link href="/media/content/your_login/style.css" rel="stylesheet" type="text/css" />` and `<script src="/media/content/your_login/jquery-1.8.3.min.js" type="text/javascript"></script>`.
4. In `Site → Pages`, click **Add**, choose **HTML editor**, and set a unique page identifier (visible in the URL).
5. Paste the full HTML into the editor and save.
6. Verify by entering the page URL in a browser.

**Gotchas:** Code from the **Additional** tab (Additional HEAD code) and from site-level HEAD code is **not** injected into HTML-editor pages. Embed any Google Analytics, pixels, or shared scripts directly inside the pasted HTML.

### How do I activate or deactivate interactive blocks on a page?

1. In the Page Builder, click a widget, tick the **interactive** checkbox in its settings, and save. For a section, click **Settings** in its upper-left corner and tick interactivity.
2. The constructor now shows an interactivity-switch button. Open the editor (or use the "interactivity mixer" button in `Website → Pages`) to flip individual blocks on or off.
3. Each block has its own switch — click to toggle.

**Result:** The page is saved automatically after every switch; visible to all live page users without a refresh, provided the block was marked interactive **before** the visitor loaded the page.

### How do I make a broadcast page for a webinar in 5 minutes?

1. Go to `Websites → Pages` and pick the site.
2. Click **Add page**.
3. From the template selection, open the **Webinars** tab and pick a template.
4. Edit it in the Page Builder. Decide whether to keep the prebuilt interactive blocks (button block, comments block, header webinar-name block) or remove ones you don't need.
5. Click on the video on the page; a blue pop-up appears.
6. Click the edit icon in the pop-up.
7. In the settings menu's **video field**, delete the default link and paste your YouTube broadcast link.
8. Save.

**Options along the way:** Use the **Interactive blocks management** button to flip the button/comment blocks on at the right moments during the live broadcast.

### How do I create an auto-webinar?

1. Go to `Website → Webinars`.
2. Click **Create a webinar**, enter a name, click **Create webinar**.
3. Paste your YouTube video URL in the shown format and click **Next**.
4. On the **Settings** tab, fill in: name, topic, header picture, code counter for the timer page, speaker name, speaker photo, Internal address (Latin chars), and pick a delegated **Domain** from the dropdown. Save.
5. On the **Schedule** tab, pick the date mode (from subscription / specific weekdays / specific dates), the number of available dates, days-after-subscription if applicable, and the watch times (use **Add exact time** or **Add every N minutes**; use **Delete all** to clear). Pick the redirect logic. Save.
6. On **Preview**, open the timer page link and the webinar-room link to verify the participant experience.
7. On **Room**, optionally change the YouTube URL, add a post-webinar redirect URL, set **Timer for display text** (HH:MM:SS) to trigger the pop-up, fill in the pop-up content (text/button to landing or checkout), and paste any broadcast-page analytics code. Save.
8. On **Chat**, pick **No comments**, **HTML-code** (embed FB/social comments), or **Automatic comments**. For automatic comments, optionally tick "Allow visitors to comment", set a notification email, add names, set the start-of-webinar visitor percentage, and import messages (paste or file upload). Save.

**Options along the way:** Each tab saves independently — you can return later. To add clickable links to imported comments use the format `1|Name|<a href="https://example.com/">text</a>` with straight quotation marks.
**Gotchas:** Auto-webinars cannot repeat endlessly — they're closer to a scheduled live event.

### How do I edit, deactivate, or delete an existing auto-webinar?

1. Go to `Website → Webinars`.
2. Filter by name and/or date range; click **Search** (or **Clear** to reset).
3. Click the webinar name to edit, or move the slider to grey to deactivate (green to re-enable), or click **X** to delete.

### How do I add a custom domain to InfluencerSoft (second-level domain)?

1. Go to `Website → Settings`.
2. Click **Add domain**.
3. Type the full domain (e.g. `your-domain.com` or `shop.moyblog.com`) and click **Next**.
4. If no error is shown, click **Get DNS settings for your domain** to generate the Name Servers.
5. At your registrar's DNS control panel ("DNS Management", "DNS Editor", "DNS Master", "DNS Server", or "DNS Zones" depending on the host), enter the records the service displayed.
6. Wait 2–4 hours, then up to 48 hours, for activation.
7. When the domain status flips to **Active**, return to `Website → Settings` and click the domain name to open the **DNS Editor** if you need to add records (e.g. MX records for G Suite).

**Gotchas:** Do not bind a domain that already has a live site or you will lose that site. Domains starting with `www.` cannot be set as primary. The system may report Cloudflare name servers for your domain even though no records exist in Cloudflare directly.

### How do I add a subdomain (third-level) to InfluencerSoft?

1. At your registrar (example: GoDaddy), log into Domain Control Center → pick the domain → Manage DNS → under Records, click **Add**.
2. Select record type **A**.
3. Fill in **Host** (the subdomain prefix, e.g. `blog`), **Points to** = `176.9.85.146` (InfluencerSoft's IP), and **TTL** = 1 hour by default.
4. Save the record. Allow up to 48 hours to propagate.
5. In InfluencerSoft, go to `Website → Settings`, click **Add domain**, and enter the third-level domain (e.g. `hello.example.com`).
6. Add the **CNAME** record specified by InfluencerSoft in your registrar's DNS settings.
7. Click **Check** in InfluencerSoft; it may take 24–48 hours to confirm.

**Result:** Your second-level domain continues to serve its existing site; the third-level subdomain points to InfluencerSoft.

### How do I make my store pages open on my own domain?

1. Connect the domain without `www`.
2. Go to `Website → Settings` and click **Domains**.
3. Scroll to the domain table and place the marker (radio) in front of the desired domain in the **Store** column.
4. Regenerate any existing subscription forms, order forms, and order buttons, then replace them on your pages.

### How do I place pages on a newly attached domain?

1. Go to `Website → Pages`. The default site "Main Site" appears, opening at `yourlogin.influencersoft.com`.
2. **Option 1:** To move existing pages onto the new domain, click **Set Up** opposite "Main site".
3. **Option 2:** To keep existing pages where they are and host new pages on the new domain, click **Create** to add a new site.
4. In either case, on the **main parameters settings** tab, click the empty space in the **Domains** field and pick the new domain from the dropdown.
5. Save.

### How do I add or edit DNS records on a linked second-level domain?

1. In `Website → Settings`, click the name of a domain whose status is **Active**.
2. Wait up to 2 minutes for the first-time data load.
3. Click **Adding a record**, choose the type from the dropdown (A, AAAA, MX, TXT, CNAME), enter the value, click **Adding a record** again to save.
4. To disable a record temporarily, click the status switch in its row (turns grey); click again to re-enable.

### How do I upload, organise, or delete files in the File Manager?

1. Open `Websites → Pages → File Manager`.
2. To upload, click **Download Files here**, pick one or more files in the OS dialog.
3. To create a folder, click **+ New Folder**, enter a name (Latin letters, digits, `.`, `_`, `-`), and click **Create**.
4. To enter a folder, click its folder icon; to go up one level click the `…` row; to jump to root click **Start** at the bottom.
5. To move a file, click the copy button on its row, navigate to the target folder, and click **Paste from clipboard** (it moves, not copies).
6. To rename, click the file or folder name, edit the new name in the pop-up, and click **Apply**.
7. To view a file, click the document icon (opens in a new tab; unsupported formats like `.zip` download instead).
8. To delete, click the **X** at the end of the row.

### How do I block cookies until visitors consent (GDPR)?

1. Register at `https://www.iubenda.com/en`. Confirm via email link.
2. In your iubenda dashboard click **Start generating**, choose **Website**, enter your domain and language, click **Start generating**.
3. In the **Cookie Solution** field click **Generate Now**, configure design and structure of the banner, click **Next**.
4. Back in the iubenda account click the **embed** button, then **Copy** to grab the banner code.
5. In InfluencerSoft go to `Websites → Pages` and click **Set up** on the site you want.
6. Open the **More** tab and paste the iubenda code into **Add HEAD code**. Save.
7. To verify: clear cookies (or use incognito), open your site, do **not** click **Accept**, press Ctrl + Shift + I (Windows) or Shift + Cmd + I (macOS) to open the browser console, choose **Applications → Cookies → your domain** — no cookies should appear. Click **Accept** and confirm cookies now appear.

### How do I integrate Google Analytics with the e-commerce module?

1. Register in Google Analytics; ensure you have **Universal Analytics** (file named `analytics.js`, not `ga.js`).
2. In `Websites → Set up`, pick the site.
3. Open the **More** tab and paste the GA tracking code into **Add HEAD code**. Save — it propagates to every page of the store.
4. In your GA account, create or update an existing resource to **Universal Analytics**.
5. Enable **eCommerce tracking** on that resource.

**Result:** Paid order data and source channels flow into GA. Orders begin appearing gradually over the next few hours.

### How do I add a favicon, custom HEAD code, or copyright text to all pages of a site?

1. Go to `Websites → Pages` and click **Set up** next to the site.
2. On the **Main parameters** tab, upload the favicon using the **Icon (favicon.ico)** field.
3. On the **More** tab, paste tracking, retargeting, or banner code into **Code to add to the `<head>` page** (also labelled "Add HEAD code") and/or **Code for adding to `<footer>` pages**. Add the copyright text in the dedicated field.
4. Save.

**Gotchas:** None of these are applied to pages built with the HTML editor.

### How do I grant another admin access to a site or a page?

- **Site:** Go to `Websites → Pages → Set up`, open the **Rights** tab, and pick admins from the dropdown. Admins must already exist in the **Employees** section.
- **Page:** Open Page Settings, switch to **Rights**, tick **Choose additional administrators to have access to this page**, and pick admins from the dropdown.

### How do I set a countdown timer on a page?

1. Open Page Settings.
2. On **Basic parameters**, click the **Off** button next to Timer.
3. Choose the timer type: absolute end time / repetition every X minutes / relative end time (countdown from page entry or countdown from email send).
4. Configure the "after timer expires" page: if the page uses the HTML editor, enter the replacement HTML; if it uses the Template Editor, click **Choose a template** (build from scratch) or **+ Copy** (copy the current page and edit).
5. Save.

**Gotchas:** If a page suddenly loads blank, the cause is usually an expired timer. Re-open Page Settings, set the timer dropdown to **Disabled**, and save.

### How do I set up A/B (split) testing on a page?

1. Open Page Settings.
2. On **Basic parameters**, scroll to the split-testing area and click **Add variant** — a second editor block appears.
3. Optionally copy content from variant 1 into variant 2 and change a single element.
4. Add more variants as needed (3rd, 4th, etc.).
5. Set the percentage on each variant so the total is **100%** (50/50 for 2; 33/33/34 for 3; etc.).
6. Save.

**Gotchas:** Change only one element per variant — otherwise it is unclear which change moved the metric. Use the **A/B** button on the Pages list to expand per-variant statistics.

### How do I create a viral promotion?

1. Go to `Website → Promotions` and click **Add promotion**.
2. On **Basic information**, enter the promotion name, the participant-page description, and the **Where to invite friends to** URL (page with the subscription form).
3. On **Additional information**, choose perpetual or limited duration (set end day and time if limited), enter the share text, the email title, and the email body (use `{$ link}` for the personal link).
4. On **Gift for recommendation**, set the gift name and the number of subscribers required, and add gift-delivery info. Click **Add another gift** to build multi-stage rewards — for each additional gift pick gift type (subscribers / money) and goal (more subscribers / increase customer spend), then set either a referral target or a dollar spend target.
5. Click **Save**.

**Result:** The promotion is added to the Promotions list.

### How do I configure the viral promotion's registration form?

1. From `Website → Promotions`, click the **Registration form** button on the relevant row.
2. Pick a group in **Add to Groups** (must have been created beforehand in the contacts area) — three tabs and the Check-the-Results block now appear.
3. On **Main settings**, set the **URL after activation**; you cannot change it later, but you can point it at a custom completion page.
4. On **Form fields**, tick the fields to collect from subscribers (email is required).
5. On **Form type / Kind of form**, pick a ready-made button (radio), or set custom text, or switch to upload-your-button mode and use **Upload Image → Download** in the File Manager to attach a custom image. Set the form-field width.
6. Copy the generated HTML from the Check-the-Results block and paste it into the destination page.

### How do I see and export viral promotion statistics?

1. From `Website → Promotions`, click the bar-chart button next to the promotion.
2. By default the full period is shown. To narrow, click **Set period**, enter start and end dates, and click **Set**.
3. Click **Export All** to download every participant.
4. Click **Export by Number of Visits**, enter a referral threshold, and click **Upload** to export only those who hit it.

### How do I create a survey?

1. Go to `Website → Surveys` and click **Create Survey**.
2. On **Main settings**, enter name, description, optionally pick a dedupe group in **Add to list** (e.g. "Polled"), and choose unlimited or end-dated duration.
3. On **Pages**, optionally tweak the auto-generated URL, add a description, and click **Add Question**.
4. In the question pop-up, pick **Type of question**: **One answer**, **Multiple answers**, **String field**, or **The text block**. Enter the Question Text, optional description, and tick **Mandatory** if needed. For One/Multiple-answer types, configure the answer options (default 2, add more via **add the response option**, reorder with the right-side arrows). For Multiple answers, optionally click **Add option "Other"** to allow a free-text fallback. For String field, optionally tick **Allow to enter only digits**. For The text block, set the block size in lines.
5. To split questions across pages, click **Add page** and configure each new Page block.
6. On **Actions**, optionally click **Add action** for each fixed-answer question: pick the question, pick **answered** or **did not respond**, pick the answer, and pick groups (navigate categories via the blue folder; tick groups or whole categories). Click **Save**.
7. On the **Additional / Language settings** tab, override the default UI text where needed and optionally set a reward-page address.
8. Click **Save**.

**Result:** Survey appears on the Surveys list with a Survey Page link and a Mailing Link.

### How do I deactivate or delete a survey?

1. In `Website → Surveys`, find the survey row.
2. Move the **Status** slider left (grey) to deactivate; right (green) to reactivate.
3. Click **X** at the end of the row to delete.

### How do I review survey results and segment respondents?

1. In `Website → Surveys`, click the bar-chart button next to the survey.
2. For free-text questions, click **View Responses** to see each individual answer; click **Back to the "Surveys Statistics" page** to return.
3. For fixed-answer questions, click the question row to expand a pie chart and answer table.
4. Click **Add to List** under an answer to push those respondents into an existing group (pick from the dropdown) or create a new list (enter a name).
5. Click the question again to collapse the stats.

### How do I decide whether I also need external hosting?

- Use InfluencerSoft's built-in storage if your sites are limited to subscription pages, selling pages, and simple informational pages — its quota suits images and styles.
- Use Google Drive or Dropbox for large downloadable assets (books, audio, video, courses).
- Buy external hosting if you need PHP or MySQL (e.g. running WordPress); InfluencerSoft's storage supports only `.css` and `.js`, not PHP or MySQL.
- Suggested hosts: bluehost.com, hostgator.com, godaddy.com, digitalocean.com. For VPS: hetzner.de.
- Suggested domain registrars: godaddy.com, namecheap.com.

## Cross-references

- **Related section: Contacts** — Surveys and viral promotion registration forms add or remove subscribers from contact groups; those groups are created and managed in the Contacts area. The viral-promo registration form's **Add to Groups** field and the survey **Actions** tab depend on pre-existing groups.
- **Related section: Mailings / Email** — Auto-webinar invitations and survey reminders are typically delivered through the email engine; the survey "Add to list" dedupe pattern relies on email recipients being tagged with a "Polled"-style group when sending reminders.
- **Related section: Employees / Users** — Admins offered in the Site **Rights** tab and the Page **Rights** tab must be added in the Employees section first.
- **Related section: Products / Checkout** — Auto-webinar Room pop-ups and Page Builder buttons commonly link to checkout pages and paid offers; multi-stage viral promotion gifts can be tied to paid product purchases.
- **Related section: Statistics / Analytics** — The Pages screen's per-page metrics (Clicks, @, Sales, Conversion, Profit) and the GA/eCommerce integration both flow from Website-level configuration.

## Source articles

- [Adding and Editing a Promotion](https://help.influencersoft.com/hc/en-us/articles/360050851291-Adding-and-Editing-a-Promotion)
- [Adding and Editing Surveys](https://help.influencersoft.com/hc/en-us/articles/360050851311-Adding-and-Editing-Surveys)
- [Creating and Editing Pages in the Page Builder](https://help.influencersoft.com/hc/en-us/articles/360050388752-Creating-and-Editing-Pages-in-the-Page-Builder)
- [File Manager](https://help.influencersoft.com/hc/en-us/articles/360050388792-File-Manager)
- [How to bind your own domain](https://help.influencersoft.com/hc/en-us/articles/360050851711-How-to-bind-your-own-domain)
- [How to bind your own subdomain](https://help.influencersoft.com/hc/en-us/articles/360058485492-How-to-bind-your-own-subdomain)
- [How to Block Cookies on the Site Until the Visitor Agrees to Their Use](https://help.influencersoft.com/hc/en-us/articles/360050388812-How-to-Block-Cookies-on-the-Site-Until-the-Visitor-Agrees-to-Their-Use)
- [How to Build Website Pages](https://help.influencersoft.com/hc/en-us/articles/360050389112-How-to-Build-Website-Pages)
- [How to Choose Hosting?](https://help.influencersoft.com/hc/en-us/articles/360050388832-How-to-Choose-Hosting)
- [How to Create and Edit an Autowebinar?](https://help.influencersoft.com/hc/en-us/articles/360050851531-How-to-Create-and-Edit-an-Autowebinar)
- [How to create Automated Webinars](https://help.influencersoft.com/hc/en-us/articles/360050388652-How-to-create-Automated-Webinars)
- [How to Make a Broadcast Page for a Webinar in 5 Minutes](https://help.influencersoft.com/hc/en-us/articles/360050851551-How-to-Make-a-Broadcast-Page-for-a-Webinar-in-5-Minutes)
- [How to Paste Your Landing Page Into Influencersoft](https://help.influencersoft.com/hc/en-us/articles/360050851631-How-to-Paste-Your-Landing-Page-Into-Influencersoft)
- [Integration With Google Analytics and the E-Commerce Module](https://help.influencersoft.com/hc/en-us/articles/360050851651-Integration-With-Google-Analytics-and-the-E-Commerce-Module)
- [Interactive Blocks](https://help.influencersoft.com/hc/en-us/articles/360050389092-Interactive-Blocks)
- [Recommendations (Viral Promotion and Viral Action)](https://help.influencersoft.com/hc/en-us/articles/360050851671-Recommendations-Viral-Promotion-and-Viral-Action)
- [Surveys](https://help.influencersoft.com/hc/en-us/articles/360050851751-Surveys)
- [Surveys statistics](https://help.influencersoft.com/hc/en-us/articles/360050389332-Surveys-statistics)
- [Viral Promotion Registration Form](https://help.influencersoft.com/hc/en-us/articles/360050851391-Viral-Promotion-Registration-Form)
- [Viral promotion statistics](https://help.influencersoft.com/hc/en-us/articles/360050389292-Viral-promotion-statistics)
- [Website Page Settings](https://help.influencersoft.com/hc/en-us/articles/360060272152-Website-Page-Settings)
- [Website Settings](https://help.influencersoft.com/hc/en-us/articles/360050389252-Website-Settings)



---


# Store

## Overview

The Store section is where you configure everything InfluencerSoft needs to sell a product: the catalog (products, categories, co-authored products), the cart/order pipeline (order buttons, orders, order cards, manual order creation), the money-collection layer (PayPal, sales tax, prepayment, auto-payments, upsells, discount coupons), the dunning layer (payment reminder email series), and the call-center workflow that chases unpaid invoices. The same area also manages co-authors who share revenue on joint products. This chapter documents every screen, tab, field, dropdown, and task surfaced by the 27 source articles in the Store section.

## Where to find it

- Main menu: `Store` — opens the section with sub-items: `Products`, `Orders`, `Co-authors`, `Coupons` (Discounts), `Categories`, `Settings`, and the various order-button / upsell / payment-reminder screens reached from within those sub-items.
- `Store → Products → Add` — new product.
- `Store → Products → click product name` — edit product. From a product row: `for-sale` column opens upsells; `discounts` column opens the discount list for that product; switch toggles enable/disable; `X` deletes.
- `Store → Products → Categories` button — category list.
- `Store → Products → Collaborators` button — co-author configuration.
- `Store → Orders` — orders list, with `Create`, `Payment reminder`, `View`, `Filter`, and gear (Export) controls.
- `Store → Orders → click order number` — Order card.
- `Store → Co-authors` — co-author list with filter, payout totals, links into their products and accounts.
- `Store → Coupons` (also reached via `Store → Discounts`) — coupon/discount list.
- `Store → Settings` — payment methods, general settings, after prepayment, delivery, alternative store, payment methods for alternative store, Sales Tax, Language.
- Facebook chatbot setup: `Mailings → Settings → Messenger integration` plus `Tasks` (or inside a funnel) to build the process.

## Terminology

- **Product** — a sellable item. Type is digital, physical, or floating-price.
- **Digital product** — delivered electronically (link after payment): subscriptions, training access, codes, paid info, coaching.
- **Physical product** — tangible item (disc, book, souvenir) that may be combined with a digital delivery.
- **Floating price** — digital product where a unit price is set and the buyer chooses how many units; e.g., $87/hour consultation, paying $174 = 2 hours.
- **Single payment** — buyer pays full amount once.
- **Subscription (recurrent payment, auto-payment)** — payment is debited at regular intervals from the buyer's card; enables the "Auto-payments" tab.
- **Order page identifier** — alphabet-only unique string used in the URL of the product order/sales page; underscore allowed; cannot be edited after the product is created.
- **Prepayment** — partial payment allowed against an order; minimum amount comes from Store Settings or per-product override. Cannot coexist with auto-payment.
- **Upsell (resale)** — a complementary product offered (usually discounted) when the order is placed; can be chained based on accept/decline.
- **Coupon / Discount** — code that reduces price either in dollars or in percentage; can be limited by validity period and product set. A "melting" discount decreases daily over the validity period.
- **Pin code** — pre-loaded list of one-time codes the system gives one per buyer using `{$pincode}` in the post-payment email.
- **Co-author (collaborator)** — second account that earns a share on a joint product; has their own login and can see statistics on collaborative products.
- **Joint product** — a product whose payout is shared with a co-author; configured on the "Products of the co-author" page.
- **Order card / Order No.** — full detail view of a single order; controls status changes (Paid, Cancel, Refund, Delete, Advance pay), call statuses, notes, manager assignment.
- **Manager responsible for the order (sales manager)** — Call-Center user automatically attached to a new order; chases payment.
- **Manager responsible for the client (personal manager)** — user attached to all of a client's orders for relationship/upsell work.
- **Payment reminder series** — chain of reminder emails tied to selected products, sent after invoice is created if unpaid.
- **Order button** — embeddable HTML button generated from a product, opens contact info form then payment page.
- **Alternative store** — secondary domain whose payment methods can override the main store's, redirecting incoming funds to a different account.
- **PayPal IPN** — Instant Payment Notification from PayPal to InfluencerSoft; required to mark orders paid.
- **Sales tax** — per-country tax (including EU standard VAT rates) added to product price at order time; applies to recurrent and upsell products too.
- **Resend the letter "Thank you for your purchase"** — manual re-trigger of the post-payment email from the Order Card.
- **Facebook chatbot / Messenger integration** — Facebook page connected to InfluencerSoft processes for automated user dialogue, opt-in to email, and quick-reply branching (Gift, Special Offer, Other).
- **Advertising label / tag** — channel, source, campaign, ad, keywords attached to an order or order button for advertising analytics.
- **Direct link (partner)** — affiliate link that points to the original product page (only after the partner script is verified on the page) instead of the default affiliate URL.

## Screens and fields

### Screen: Products list

- **Purpose:** browse, add, edit, enable/disable, delete products; reach upsells, discounts, categories, co-author setup, and the public catalog.
- **How to open:** `Store → Products`.
- **Fields (columns in the table):**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Name | text | n/a (display) | Product name, click to edit | — |
| Category | text | n/a | Product category if assigned | — |
| Cost | currency | n/a | Product price | — |
| Discounts | numeric badge | n/a | Blue badge with count of discounts; click to open discount list for that product | — |
| Partner program settings | indicator | n/a | Affiliate program state for the product | — |
| After-sales | indicator | n/a | Upsell configuration link (`for-sale` column) | — |
| Product type | text | n/a | digital / physical / floating price | — |
| Status switch | toggle | n/a | Green = on; black = off | on |
| Delete (X) | action | n/a | Removes the product | — |

- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Name | text | no | Full or partial product name | — |
| Category | dropdown / folder navigation | no | Navigate categories via blue folders; tick a category checkbox to select all its products | — |
| Presence in product catalog | dropdown (assumed) | no | Options: not enumerated in source | — |

- **Buttons and actions:**
  - `Add` — opens Add Product (Adding and Editing a Product screen).
  - `Filter` → `Search` / `Clear` — apply/clear filter.
  - `Categories` — opens window to manage product categories.
  - `Collaborators` — opens window to configure co-authors.
  - `Link to product catalog` — opens the public InfluencerSoft store catalog as customers see it.
  - Status switch — toggles product on/off.
- **Notes:**
  - When a product is off: existing orders can still be paid, no new orders can be created, the order page is unavailable, and the Form Builder will not find the product.

### Screen: Adding and Editing a Product

- **Purpose:** create or edit a single product with all sales, delivery, partner, call-center, and integration settings.
- **How to open:** `Store → Products → Add` for create, or click product name in the list for edit. Some options (notably product type and the order-page identifier) appear only when creating.
- **Tabs / subscreens (number of tabs varies by chosen options):**
  - Main settings
  - Actions after prepayment (visible only if prepayment is allowed)
  - Auto-payments (visible only if Payment type = Subscription)
  - Action after payment
  - Creating and cancelling orders
  - Partnership
  - Call center
  - Integration

#### Tab: Main settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Product type | radio | yes (set at create only) | digital / physical / floating price | — |
| Payment type | radio | yes | Single payment / Subscription (periodic auto-payment, recurrent payment) — selecting Subscription adds Auto-payments tab | Single payment |
| Order page identifier | text (alphabets; underscore allowed) | yes (create only, not editable later) | Unique slug used in product URL | — |
| Allow partial payment | checkbox | no | When ticked, Prepayment field appears | off |
| Prepayment | currency (dollars) | conditional | Minimum prepayment amount for this product; per-product override of Store Settings default | from Store Settings |
| The product's name | text | yes | Public name shown to buyers | — |
| Category | dropdown | no | Field hidden if no categories exist; not visible to buyer | — |
| Price | currency | yes | Product price | — |
| Image | file (via `Select file`) | no | Cover/photo shown on order page | — |
| The amount of expenses | currency | no | Default expense to subtract per order for income/profit reporting; per-product override of Store Settings | from Store Settings |

- **Buttons:** `Select file` (upload image), `Save`.
- **Notes:**
  - Prepayment cannot be combined with auto-payment.
  - Source recommends prepayment ≤ half of total cost and ideally a multiple of total cost.
  - "Floating price" makes the buyer's amount determine quantity at the unit price.

#### Tab: Actions after prepayment (only if "Allow partial payment" is on)

- **Purpose:** add buyer to a group/list and send a thank-you-for-prepayment email.
- **Fields:**
  - Group/list selector (folder navigation, checkbox).
  - Email body (default WYSIWYG editor) with variable buttons.
- **Available variables:** `{$name}` (buyer's name), `{$bill_id}` (order number), `{$sum}` (amount paid), `{$good}` (product name), `{$leftsum}` (remaining balance), `{$bill_link}` (payment reference).

#### Tab: Auto-payments (only if Payment type = Subscription)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Group/list assignment while auto-payment active | folder + checkbox | no | Client removed from list if a payment fails | — |
| Autopayments will begin in XX days after payment of the order | number (days) | yes | Delay before first recurring charge | — |
| With an interval of XX days | number (days) | yes | Interval between successive payments | — |
| To charge partner commissions | radio | conditional | First payment only / Each payment | — |
| Number of repeated auto-payments | number | no | Blank = unlimited until cancelled | blank |
| The amount of the first payment | currency | no | Blank = use product price from Main settings | blank |
| Number of attempts (on unsuccessful periodic write-off) | number | yes | Retry count before cancellation | — |
| The interval between attempts (in hours) | number | yes | Time between retries | 1 |
| Email to the client after the first payment | WYSIWYG | no | Uses autopayment-specific variables (different from non-autopayment) | default text |
| Email to the customer after each re-payment | WYSIWYG | no | Default summarizes product, activity link, and cancel link | default text |
| Email to the client in case of unsuccessful payment | WYSIWYG | no | Sent when all retries fail | default text |

#### Tab: Action after payment

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Create a contact list and add a buyer to it | radio | no | Adds buyers of this product to a separate customer list | off |
| Add Buyer to Groups/lists | checkboxes | no | Add buyer to one or more existing groups/lists | none |
| "Thank you for your purchase" page | URL (assumed) | no | Redirect page after successful payment | — |
| "Thank you for your purchase" Email | WYSIWYG | no | Editable with variable substitution buttons (e.g., Client Name inserts `{$name}`) | default text |
| Pin codes | text list (one code per line) | no | System issues codes in upload order via `{$pincode}` | empty |

- **Notes:** when an invoice is paid for a product with pin codes, a notification email reports the buyer, the issued PIN, and remaining code count in parentheses, so you can top up in advance.

#### Tab: Creating and cancelling orders

- **Order page customization:** default page shows image, name, price. The default WYSIWYG editor adds more content. `Reset text` returns to default.
- **Cancellation rule (radio):**
  - Cannot be cancelled automatically.
  - Automatically cancelled on the following date and time — absolute date/time (use for sales/discounts).
  - Will be automatically cancelled in — relative time in minutes, hours, days from invoice creation.
- **Notes:** when a cancellation rule is set, the order page shows the customer a countdown timer.

#### Tab: Partnership

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Commission | percentage or fixed amount | no | Overrides general affiliate settings | — |
| Show partners | checkbox | no | Opens block of product display settings inside partner account | off |
| Commission to an individual partner | partner login + amount + level | no | Per-partner override; can adjust partner levels | — |
| Landing page | URL | no | URL of advertised page | — |
| Direct link | checkbox | no | Becomes available only after the partner script is installed on the page and `Check code` confirms it; otherwise default affiliate link is used | off |
| Co-author block (visible only if at least one partner exists) | — | no | Optional | — |
| Co-author | dropdown | no | Pick from list of collaborators | — |
| Co-author payment | percentage or fixed amount | conditional | — | — |
| Subtract commission from the cost | checkbox | no | Deduct partner commission before settling with co-author | off |
| Add | button | — | Add multiple collaborators | — |

#### Tab: Call center

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Manager compensation | percentage or fixed amount | no | Per-call/upsell payout | — |
| Instructions for the employee | text area | no | Notes for the calling manager | — |
| Products that can be added to the order together with this product by call-center employees | checkboxes | no | Upsell candidates offered over the phone | none |
| Specify individual email templates | checkbox | no | Override default templates from Contacts → Settings | off |
| Email template radio (when override is on) | radio | no | Call went through / Call did not go through / Call back the customer / Already notified / Invalid lead | — |
| Email body | WYSIWYG | no | Edited per template; `Reset to default message` reverts | default text |

#### Tab: Integration

- API synchronization with external services; field to paste a tracking code for pay-per-click services.
- **Save** button at the bottom; on save, the product is added to the Products list.

### Screen: Product Categories (list)

- **Purpose:** create/edit/delete category groupings for products.
- **How to open:** `Store → Products → Categories` (or category sub-page if linked from a product).
- **Filter:** single name field; `Search` returns one category for an exact match, or all categories containing the substring; `Clear` shows all.
- **Buttons and actions:** `Add` (opens Adding and Editing Product Categories); click category name to edit; `X` at end of row to delete.

### Screen: Adding and Editing Product Categories

- **Purpose:** create or rename a category; optionally nest it under a parent and attach products.
- **How to open:** from Product Categories list, click `Add`, or click the category name.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Category name | text | yes | — | — |
| Parent category | dropdown | no | Pick a top-level category to make this a subcategory | none |
| Products | multi-select (Ctrl+click) | no | If left empty, an empty category is created; products can be added later from the Adding and Editing a Product screen | none |

- **Buttons and actions:** `Save` — adds the category to the Categories page.
- **Notes:** add/edit pages are identical except for the page title (Add vs Edit).

### Screen: Co-authors (list)

- **Purpose:** add/edit/remove co-authors, view payouts, jump to their products and orders, get a login link for the co-author's profile.
- **How to open:** `Store → Co-authors`.
- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Email | text | no | Match co-author by email | — |
| Login | text | no | Match by login | — |
| Name | text | no | Match by name | — |
| Show statistics from … to | date range | no | Period for payout statistics | — |

- **Buttons:** `Search`, `Clear` (re-open Filter then click Clear), `Add` (opens Adding and Editing a Co-Author).
- **Table actions:**
  - Click co-author name (Co-author column) — opens edit page.
  - `X` at end of row — remove co-author.
  - `Payout` window at top — total amount owed to co-authors.
  - `Earned` / `Paid` columns — per-co-author amounts.
  - Blue number badge in `Accounts` column — jumps to Orders page filtered by that co-author's products.
  - Blue number badge in `Products` column — jumps to Products of the Co-Author page.
  - Email link in `Email` column — opens default mail client (not InfluencerSoft mail) to message the co-author.
  - Profile link at top of page — log into InfluencerSoft as the co-author with their credentials to view collaborative-product stats.

### Screen: Adding and Editing a Co-Author

- **Purpose:** create or edit a co-author account.
- **How to open:** Co-authors list → `Add`, or click co-author name.
- **Tabs:**
  - Main settings
  - Additional Details

#### Tab: Main settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Login | text | yes | Co-author's login for their profile | — |
| Password | text | yes | Co-author's password | — |
| Email | text | yes | Co-author's email | — |
| Name | text | yes | Co-author's name | — |

#### Tab: Additional Details

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Bank details | text (assumed) | no | For paying the co-author | — |
| Phone number | text | no | — | — |
| Show co-author client's contacts | checkbox | no | If on, co-author can see personal info of customers who bought the joint product | off |

- **Buttons:** `Save` — adds co-author to the Co-authors page.

### Screen: Products of the Co-Author

- **Purpose:** view/add/edit/remove products created with the selected co-author and see their commissions and deductions.
- **How to open:** Co-authors list → blue number badge in `Products` column.
- **Buttons and actions:** `Add` (opens Adding and Editing a Joint Product); click product name to edit; `X` to remove; `Back to the "Co-authors" page` to return.

### Screen: Adding and Editing a Joint Product

- **Purpose:** configure payment to a co-author for an already-existing product. The product itself must already exist on the Products page; this screen only handles co-author payment.
- **How to open:** Products of the Co-Author → `Add`, or click product name.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Product | dropdown | yes | Pick the existing product to share | — |
| Deduct partner commission before settling with co-author | radio | yes | Yes / No | — |
| Co-author payment | percentage or fixed amount | yes | — | — |

- **Buttons:** `Save` — adds to Products of the Co-Author list.

### Screen: Coupons (Discount list)

- **Purpose:** create, edit, search, and delete discount coupons in dollars or percentage.
- **How to open:** `Store → Coupons` (also reached as Store → Discounts).
- **Columns:** Coupon (code), Amount (dollars or %), Validity period, Products (blue number badge expands to full list if multiple), Partner (affiliate attached to the coupon).
- **Filter:** by Coupon (name/code), type, expiration date, products.
- **Buttons and actions:** `Add` (opens discount creation), click coupon name to edit, `X` in last column to delete.

### Screen: Create / Edit a Discount

- **Purpose:** configure a single coupon: code, value, validity, scope, and optional partner attachment.
- **How to open:** two entry paths:
  - `Store → Coupons → Add` (or `Store → Discounts`) — lets you cover several products.
  - `Store → Products → click discount box on a product row` — discount is fixed to that product; the product selector is hidden; to edit later, use the first path.
- **Discount type (icon dropdown next to amount):** `$` (dollars, fixed) or `%` (percentage). Dollars is default; click the dollar icon and pick percent to switch.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Coupon | text | yes | Discount code typed by the buyer on the order page; can also be embedded in URL so it appears in the URL bar and the order-page field | — |
| Description | text | no | Internal comment, visible in your account only | — |
| Amount and Validity Period — Amount | number | yes | Discount value (dollars or %) depending on icon | — |
| Amount and Validity Period — Icon | toggle | yes | `$` / `%` | $ |
| Amount and Validity Period — Validity dates | date range | no | Sets start/end dates | — |
| Add a discount (button) | action | no | Combined with Validity Period creates a "melting" discount that decreases daily across the validity range | — |
| Products | folder/checkbox tree | conditional | Select one or several products / categories. Hidden if launched from a product's discount box. | — |
| Attaching invoices with this coupon to the partner | text (partner login) + pop-up suggestion | no | Attaches all invoices that use this coupon to the named partner; only registered partners | — |

- **Buttons:** `Save` — adds to the Coupons list and to the product's discount list.
- **Notes:**
  - "Melting" discounts decrease automatically each day (example given: $20/day from 15th to 20th).
  - Discounts do not apply on top of "melting" discounts.
  - For subscription products with a coupon partner, the InfluencerSoft system considers different rules without affecting the coupon's validity period.
  - Click priority for attributing the order: UTM tag in page link (first click) → tags in form settings (second click) → partner in discount coupon (final click).

### Screen: Order Buttons

- **Purpose:** generate an HTML button (or custom-image button) that opens the Contact Information form then the payment page for a chosen paid product.
- **How to open:** Order Buttons page in the Store area. First select the product (blue folder, checkbox); the button-config tabs then appear.
- **Tabs (4 after product selection):**
  - Button type
  - Form fields
  - Additionally (Additional Details)
  - Advertising label (Ad tag)
  - Plus a preview at the bottom of every tab and a Result check/code area.

#### Tab: Button type

- Set button size, color, text. Or pick `Upload your own button` → `Upload Image` (opens file manager) → `Download` and select the picture. Once uploaded the button image is reusable in other forms.

#### Tab: Form fields

- Checkbox list of fields that will appear in the order form after the button is clicked (specific field names are not enumerated in source — tick each one you want).

#### Tab: Additional Details ("Additionally")

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Discount coupon code by default | text | no | Auto-fills the order form's Discount field | — |
| Tag | text | no | Label used to track placement effectiveness on the Tags page | — |
| Partner's login | text | no | All customers ordering via this button are attached to the named partner | — |

#### Tab: Ad tag (Advertising label)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Channel | text | no | — | — |
| Source | text | no | — | — |
| Campaign | text | no | — | — |
| Ad | text | no | — | — |
| Keys | text | no | — | — |

#### Result check

- Clickable preview opens the product order window. The HTML code to embed is shown in the "Copy this code and paste into the desired place on the page" window.

### Screen: Upsell Settings

- **Purpose:** configure the secondary offer presented when an order is placed for a chosen base product; chain upsells based on accept/decline.
- **How to open:** `Store → Products` → click `for-sale` column for the chosen product, then click the configure link.
- **Tabs:**
  - Main settings
  - Additional Settings (Additional options)
  - Activate upsell (slider visible on every tab)

#### Choice of scheme for sale

- Table starts with two rows:
  - Top row — product to offer + text of the consent button.
  - Bottom row — text of the decline button.
- Each row can chain further resales (accept → next upsell; decline → different upsell).
- **Buttons:** `Add` (extra row for alternative product variants), up/down arrows reorder rows.

#### Choosing a product (two options)

- Option 1 — `Select Product` button opens product chooser, set price, click `Save and configure the affiliate`. Goes to `Edit Partner Commissions` page (partner + call-center payout settings for the upsell). `Save` returns. To edit button text, click the button.
- Option 2 — click the text of the button directly; choose product, price, change button text in one step; click `Save`. Blue `%` button on the row jumps to `Edit Partner Commissions`.

#### Tab: Main settings

- WYSIWYG editor for selling description and image. Must keep the `# ORDER_FORM #` tag — it renders the order buttons.
- **Buttons:** `Test page` — opens preview in new tab/window.

#### Tab: Additional Settings

- Minutes-to-decide before the upsell offer is removed and the user proceeds to the main account.
- Groups of contacts excluded from seeing this offer (folder/checkbox tree; commonly used to exclude customers who already own the product).

#### Activate upsell

- Slider at the top of every tab. Move right (green) to enable. By default upsells are disabled and not shown until activated.

### Screen: Orders (list)

- **Purpose:** summary and detail listing of all orders with filter, view customization, manual order creation, export, payment-reminder management, group ops.
- **How to open:** `Store → Orders`.
- **Top summary metrics:**
  - Total number of orders
  - Orders awaiting payment
  - Confirmed orders
  - Paid invoices
  - Prepayments made
  - Income (Revenue minus Costs set in product settings)
  - Profit (Revenue minus commissions for co-author, partner, call-center, minus refunds without prepayment)
  - Amount of partner payments
  - Payments to the call center
  - Co-authored fees
  - Refunds to customers
  - Unused metrics (no co-author, no call-center) are hidden.
- **Default columns:**
  - Order number
  - Customer's name and telephone number
  - Email address
  - Order date and time
  - Product ordered
  - Product cost
  - Payment date
  - Manager (lead order)
  - Client acquisition channel
- **Buttons:**
  - `View` — toggle columns (base set is default; tick/untick to add/remove).
  - `Filter` — see below.
  - `Create` — opens Create an Order.
  - `Payment reminder` — opens Payment reminder emails list.
  - Gear button — Export: CSV, Excel, Web-trader, Simple text / Plain text.
  - `Assign responsible by bills` (group operations) — bulk-change the order manager for selected orders.

#### Filter (Orders)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Search by contacts or address / lead info | text | no | Match by name, phone, or email; partial or full | — |
| Order No. | text | no | Search by order number. Includes checkbox `Showing only prepaid orders` | — |
| Payment status | dropdown | no | All / Expected / Paid / Cancelled / Returned + checkbox to limit to Confirmed only | All |
| Date of submission from … to | date range | no | — | — |
| Date confirmed from … to | date range | no | — | — |
| Payment date from … to | date range | no | — | — |
| Return date from … to | date range | no | — | — |
| Minimum amount | number | no | Returns orders ≥ amount | — |
| Tag | text | no | Match orders by tag | — |
| Products (sub-menu) | folder/checkbox | no | Filter by product or category; checkboxes for full order vs. selected products; option to show bills depending on the position of the product | — |
| Partnership (sub-menu) | text | no | Match invoices from a specific partner or products with a specific co-author | — |
| Advertising (sub-menu) | mixed | no | Channel / Source / Advertising company / Ad / Keywords; radio to search by first or last click | — |
| Manager (sub-menu) | mixed | no | Choose a manager + call status: All calls / At least 1 successful call / Successful call / Does not answer the phone / Call back / Already paid / Wrong number / Declines call; can also filter by client info entered by manager | — |
| Delivery (sub-menu) | dropdown | no | Type of payment: All / Prepayment / C.O.D / Courier. Delivery status: All / Untreated / Sent / Return / Online / By the number of the postal item | — |
| Auto payments (sub-menu) | toggle | no | Orders with / without auto-payments | — |

- **Buttons:** `Search`, then click `Filter` → `Clear` to reset.

#### Expand row (click empty space in row, not a link)

- Top section — calls log for this client ("There were no calls made on this order" if empty).
- Middle — order data plus `Add` opposite Customer Information (opens `Edit Customer Information`), `Assign` button to change manager, `Commission` button to open `Change of partner commission …` with amount field and a checkbox to notify the partner of the change.
- Status pill — clickable to change order state (options depend on current state):
  - Paid order: options not enumerated in source (see Order Card).
  - Unpaid invoice: includes `Paid` (mark paid manually), `Cancelled` (e.g., cancel duplicate).
  - Cancelled order: options not enumerated in source.
- Lower — other orders by the same customer (`Edit` jumps to that Order No. card; "The customer has no more orders" message if none).

### Screen: Create an Order (manual / call-center)

- **Purpose:** generate an order during a phone call and email the invoice to the customer.
- **How to open:** `Store → Orders → Create`, or auto-invoked from Order Card's `Successful conversation` action (E-mail and Name pre-fill).
- **Tabs (3):**
  - Main settings (Basic Settings)
  - Customer Information
  - Advertising label

#### Tab: Main settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Client's email | text | yes | Pre-filled if launched from Successful conversation | — |
| Client's name | text | yes | Pre-filled if launched from Successful conversation | — |
| Product(s) | multi-select via `Add product` window | yes | Click `Add product` to open list, pick one or more, `Accept` | — |
| Order cancellation parameters | radio | yes | Same options as product's Creating and cancelling orders tab | — |

#### Tab: Customer Information

- Phone number
- Client's delivery address (used for physical product delivery).

#### Tab: Advertising label

- Labels to assign to the order. If Store → Settings → General settings has `New orders are marked with separate advertising channel and source` enabled, Channel and Source cannot be set here: Channel defaults to `call-center` and Source becomes the manager's login.

- **Buttons:** `Save` — creates the order and emails the invoice.

### Screen: Order Management (Order Card / Order No.)

- **Purpose:** show full detail and all transactions for one order — manual pay, refund, prepay, status change, call results, manager assignment, notes, attachments.
- **How to open:** `Store → Orders → click order number`.

#### Order heading

- Order number, status pill (clickable to change status: Cancel / generate a new order for the same client / Confirm / Refund / Delete / Advance payment if product allows).
- Auto-cancel date (clickable to change or disable the limit).

#### Key order information panel

- Order amount, prepayments sum, income and expenses for the order.
- Client's name, postal address, personal manager (or "not assigned").
- Notes about the client (visible in all of their orders; delete via recycle bin in the bottom corner).
- Current local time of the client and order IP address.

#### Detailed information

- Left — ordered products (multiple if cross-selling), source/channel analytics (deletable), affiliate commission, order's tag.
- Delivery — usually "by email" for digital. If unpaid: option to resend the payment email.

#### Order history and 5 tabs

- `Order history` — status changes, notes, manager-in-charge name, buttons to add a call status and the order calls instruction (defined in Contacts → Settings).
- `Tasks` — tasks for this order; add new ones.
- `All orders` — every order by this customer (mirrored in lead card → All orders tab).
- `All calls by orders` — calls tied to orders (mirrored in lead card → Calls made to confirm orders).
- `All calls by tasks` — calls tied to tasks (mirrored in lead card → Tasks tab).

#### Call-status action buttons

For each status the form has standard fields plus an email composer:

| Status | What it does | Distinct fields |
|---|---|---|
| The conversation went through | Mark successful contact; record outcome | Call-back radio (yes/no) with dropdown of times, Comment, Send a message (checkbox), email body with variables, Send message copy to … (checkbox), `Save and Create` (adds a new order keeping the old), `Cancel and Create` (deletes old, creates new), `Upload` (attach call recording) |
| The call did not go through | Mark unreached; schedules recall (1 hour after first failure, 24 hours after subsequent failures) | Comment, Send a message, email body, Send message copy to … |
| Call back | Customer asked for a later call | Call Back dropdown (time), Comment, Send a message, email body, Send message copy to …, `Upload` |
| Already paid | Customer already paid, suppress further calls | Comment, Send a message, email body, Send message copy to …, `Upload` |
| Refusal and cancellation (`Cancel`) | Cancel order at customer's refusal | Comment, Send a message, email body, Send message copy to …, `Upload` |
| Invalid lead | Mark order with a wrong phone number | Comment, Send a message, email body, Copy of the email to … |

- **Email composer (all statuses):** default templates per status; default text editor with variable substitution buttons (e.g., Client Name inserts `{$name}`); per-product overrides come from product → Call center tab.
- **Resend "Thank you for your purchase" letter:** in the opened Order Card click the button `Resend the letter "Thank you for your purchase"`.

### Screen: Payment reminder emails (list)

- **Purpose:** add new reminders to a series or edit existing ones for a payment-reminder series.
- **How to open:** from `Store → Orders → Payment reminder`, then open a series.
- **Buttons:** `Add` (Adding and Editing a Payment Reminder Email), click name to edit.

### Screen: Add and Edit a Series of Payment Reminders via Email

- **Purpose:** create or edit a reminder-email series and bind it to selected products.
- **How to open:** Payment reminders via email page → `Add`, or click a series name.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Conversation / series name | text | yes | The series's name | — |
| Products | checkboxes | yes | Tick the products this reminder chain applies to | — |

- **Buttons:** `Save` — returns to Payment reminders via email page, where the new/edited series appears.
- **Notes:** add page and edit page differ only by the header (Add vs Edit).

### Screen: Adding and Editing a Payment Reminder Email / Letter

- **Purpose:** create or edit a single reminder email inside a series, set timing and content.
- **How to open:** Payment reminder emails list → `Add`, or click email name.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Serial number of the email | number | yes | Order in the series | — |
| Transmittal time (time of departure) | number + unit | yes | Measured in minutes, hours, or days from the moment an order is invoiced | — |
| Sender's email | text | yes | Sender address (from Mailing/Sender settings) | — |
| Body | WYSIWYG | yes | Default text editor with variable-substitution buttons (`Order Amount` inserts `{$sum}`, etc.) | default text |

- **Embedded variables in default email:**
  - `{$pay_link}` — pay-the-bill link (do not remove).
  - `{$cancel_link}` — cancel-and-discard-reminders link (do not remove).
- **Buttons:** `Save` — returns to Emails (Letters) list with the new/edited entry.

### Screen: Store Settings

- **Purpose:** configure payment methods, store-wide defaults, prepayment messaging, delivery countries, alternative store routing, sales tax, and language defaults.
- **How to open:** `Store → Settings`.
- **Tabs:**
  - Payment method
  - General settings
  - After prepayment
  - Delivery
  - Alternative store
  - Payment methods for alternative store
  - Sales Tax
  - Language

#### Tab: Payment method

- Each supported method has a `Connect` button. All InfluencerSoft users can use Stripe or PayPal.

#### Tab: General settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Email for notifications | text | yes | Address that gets alerts on created and paid bills | — |
| Notify about new accounts via email | checkbox | no | Turn off to silence created-account notifications | on |
| Notify about paid orders via email | checkbox | no | Turn off to silence paid-order notifications | on |
| When making an order, the phone field must be filled | checkbox | no | Adds phone field to default order page | off |
| Check phone numbers for accuracy | checkbox | no | Applies phone-number mask; location detected by client IP | off |
| Automatically assign new call task to personal manager | checkbox | no | New accounts auto-added to calling task when a Call-Center employee with the right scope exists | off |
| New orders are marked with separate advertising channel and source – {Employee Login} / call center | checkbox | no | When a manager creates a new order, Channel/Source cannot be set; Channel=call center, Source=manager's login | off |
| Default minimum prepayment amount | currency | no | Fallback for products that allow prepayment without setting their own amount | — |
| Expense amount | mix (% + fixed) | no | Default expense applied to each product to compute profit/income separation | — |
| Link to the terms and conditions on the connected domains | URL | no | Default offer link inserted into all products on attached external domain | — |
| Colors — primary color (order button + amount) | color (palette or HTML code) | no | — | — |
| Colors — secondary color (links on the page) | color (palette or HTML code) | no | — | — |
| Title font | font picker | no | Font of the "Ordering" title | — |
| Main text font | font picker | no | Font of product name, value, fields, and order button | — |
| Copyright text | text | no | Shown in invoice page footer | — |

#### Tab: After prepayment

- WYSIWYG email "Thank you for your prepayment" using variables `{$name}`, `{$bill_id}`, `{$sum}`, `{$good}`, `{$leftsum}`, `{$bill_link}`.

#### Tab: Delivery

- Countries possible for delivery — selected here become available on the product's Delivery tab for physical goods.

#### Tab: Alternative store

- Purpose: redirect funds from a secondary domain to a different account.
- Setup:
  - Click the cross next to `Choose domain`, then pick the delegated domain (must be an attached domain — see Website section).
  - Toggle alternative store ON/OFF.
  - When ON: ALL products, regardless of which store generated the order form, route to the alternative store account.
  - When OFF: payment methods of the domain that generated the form are used by default. Manual HTML can override per-product by changing the form `action` to the alternative domain.
- Copyright text field also lives here.

#### Tab: Payment methods for alternative store

- Same connect interface as Payment method tab, scoped to the alternative store domain.

#### Tab: Sales Tax

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Add sales tax | button | — | Opens manual entry form for country + rate | — |
| Country selector | dropdown | yes (per row) | Country to which the rate applies | — |
| Rate | number | yes (per row) | Percentage added to product price for buyers in that country | — |
| Add EU standard VAT rates | button | — | Bulk-loads standard EU VAT for all EU countries | — |
| Request customer VAT ID | checkbox | no | When using EU rates, requests buyer's VAT number | off |
| Exclude Reverse Charge for your country | conditional | no | Pick the country where your business is registered before importing, so reverse charge can be excluded | — |
| Delete entry | X button | — | Remove a country/rate row | — |

- **Notes:** sales tax applies to recurrent and upsell products too.

#### Tab: Language

- WYSIWYG `Message for a product with paid subscription` — shown on the order page when the product's Payment type = Subscription. Click the question mark for the legend of available variables (options: not enumerated in source).
- Payment start date format — dropdown (options: not enumerated in source).

### Screen: Payment Method Setup — PayPal

- **Purpose:** connect a PayPal account for IPN-based payment processing.
- **How to open:** `Store → Settings → Payment method → PayPal` (also reached from the Payment Guide tab inside Settings).
- **Setup fields (in InfluencerSoft):**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| PayPal email | text | yes | Email address PayPal is registered to | — |
| Restrictions | mixed | no | Options: not enumerated in source | — |

- **Setup in PayPal:**
  - Log in → SELLER TOOLS → Instant payment notifications → `Edit settings`.
  - `Notification URL` = the URL shown on the InfluencerSoft Payment Guide tab.
  - Tick `Receive IPN messages (Enabled)` → Save.
  - Optionally: Website preferences → `Auto Return` enabled → paste a post-payment page URL built in `Websites → Pages` (this page can host tracking pixels or metrics codes).
- **Notes:**
  - Personal vs business PayPal: personal for individuals, business for entrepreneurs/businesses (requires business details).
  - PayPal can delay IPN delivery up to 12 hours. If a payment shows in PayPal but the order is still unpaid in InfluencerSoft, open PayPal's History of instant payment notifications and re-send.
  - Stripe is also supported alongside PayPal for all users (configuration not detailed in source).

### Screen: Messenger integration (Facebook chatbot)

- **Purpose:** connect a Facebook page to InfluencerSoft processes for chatbot automation, subscription via Facebook, and broadcast/process messaging in Messenger.
- **How to open:** `Mailings → Settings → Messenger integration` → click `Continue with Facebook`.
- **Setup steps:**
  1. Confirm or log into a Facebook account.
  2. Select the Facebook pages the integration will use (create a page or group on Facebook first if needed).
  3. Enable all options on the options page → `Done`.
  4. After success, the integration shows the connected page data.
- **Process building blocks (used in `Tasks` or within a funnel):**

| Block | Purpose | Key fields |
|---|---|---|
| Start dialogue on Facebook | Process trigger when a Facebook user opens chat | [1] page that interacts; [2] unique ref-link parameters (process only fires for that link) |
| Facebook @opt-in | Ask the user for email and subscribe them | Subscription question text; subscription activation email; `URL after confirming the subscription` (post-activation redirect) |
| Facebook Message | Send chat message in Messenger | [1] message text; [2] button text (optional); [3] button URL (optional); `+Text` (additional text), `+Image` (image), `+Video` (video); quick-reply options |
| Greetings (used for sophisticated chatbot) | First multi-branch question after dialogue start | Quick-reply options (e.g., Get a Gift / Special Offer / Other) |
| Subscribe offer | Ask the user for email in chat with a one-click subscribe | Text of subscribe prompt |
| Subscribe via Facebook | Capture email click from Messenger | — |
| Message with a button | Pitch the special offer with a CTA link | Description text; button + URL |
| Phone Request | Ask the user for phone | Text |
| Task for the manager to call | Notify employee | `completed` and `failed` outputs each drive further blocks |
| End Process | Terminate the chatbot branch | — |

- **Constraints:**
  - You can only send Messenger messages within 24 hours of the user's last response.
  - Each branch must end in `End Process`.
  - Recursion pattern: after a greeting block (no delay), put the choice block, then loop each branch back to the choice block so the user can re-enter the menu.

## Common tasks

### How do I create a new product?

1. Go to `Store → Products`.
2. Click `Add`.
3. On the Main settings tab, choose Product type (digital / physical / floating price) — only settable at create time.
4. Choose Payment type (Single payment or Subscription).
5. Enter the Order page identifier (alphabets and underscores only; must be unique; cannot be edited later).
6. Tick `Allow partial payment` if you want prepayment, and set the per-product `Prepayment` amount (or rely on Store Settings default).
7. Fill `The product's name`, `Category` (if any), `Price`, `Image` (`Select file`), and optionally `The amount of expenses`.
8. Move through the remaining tabs (Action after payment, Creating and cancelling orders, Partnership, Call center, Integration) and any conditional tabs (Actions after prepayment, Auto-payments) and complete them.
9. Click `Save`.

**Result:** The product appears in `Store → Products`.
**Options along the way:**
- Subscription type adds the Auto-payments tab.
- Prepayment forbids auto-payment and exposes Actions after prepayment tab.
- Pin codes can be loaded under Action after payment to issue one code per buyer via `{$pincode}`.
- Partnership tab lets you override the general affiliate commission and add per-partner overrides.
- Call center tab adjusts manager compensation and upsell candidates offered over the phone.
- Integration tab is where you paste pay-per-click tracking code.

**Gotchas:**
- The order page identifier cannot be changed after creation.
- Recommended: prepayment ≤ half the product price and a multiple of the total.
- Do not remove `{$pay_link}` or `{$cancel_link}` from default reminder emails or `# ORDER_FORM #` from upsell selling text.

### How do I edit or delete a product?

1. `Store → Products`.
2. Click the product name to edit, or click the `X` at the end of the row to delete.
3. Click the green/black status switch in the second-to-last column to turn the product off (no new orders, no order page) or back on.

**Gotchas:** Disabling does not invalidate prior unpaid invoices — they can still be paid.

### How do I create a product category?

1. `Store → Products → Categories`.
2. Click `Add`.
3. Enter the category name.
4. Optionally pick a `Parent category` to nest it.
5. Optionally select products to include (Ctrl+click to multi-select). Leaving it empty is allowed.
6. `Save`.

**Result:** Category appears in the Categories list.

### How do I add or edit a co-author?

1. `Store → Co-authors`.
2. Click `Add` (or click an existing co-author's name).
3. Main settings tab: enter Login, Password, Email, Name.
4. Additional Details tab: bank details, phone, and tick `Show co-author client's contacts` if the co-author should see buyer personal info.
5. `Save`.

**Result:** Co-author appears in the Co-authors list with a profile-login link for them.

### How do I share revenue on a product with a co-author?

1. `Store → Co-authors` → on the row, click the blue number in the `Products` column (or open `Products of the Co-Author` directly).
2. Click `Add`.
3. Pick the existing product (it must already exist on `Store → Products`).
4. Choose whether partner commission is deducted before settling with the co-author (radio button).
5. Set the co-author's payment as percentage of cost or fixed amount.
6. `Save`.

**Result:** The joint configuration appears on Products of the Co-Author for that co-author.
**Gotchas:** The product must already exist on the Products page. This screen only configures payouts.

### How do I create a discount coupon?

1. Either `Store → Coupons → Add` (lets you cover several products), or in `Store → Products` click the discount box on a product row (locks scope to that product).
2. Enter the `Coupon` code (also usable as URL-embedded coupon).
3. Add a `Description` (internal only).
4. Enter Amount; click the `$` icon to switch to `%` if you want a percentage discount.
5. Set the Validity Period dates.
6. Optionally click `Add a discount` together with the validity period to create a melting discount.
7. Under `Products`, click blue folders to navigate categories, tick checkboxes for products (or tick a category to select all its products). This field is hidden if you started from a single product's discount box.
8. To attach to a partner, type the partner login under `Attaching invoices with this coupon to the partner` and pick from the suggestion popup.
9. `Save`.

**Result:** Discount appears in the overall Coupons list and in the per-product discount list.
**Gotchas:**
- Discounts do not stack on top of "melting" discounts.
- For a subscription product, melting discount validity is unaffected, but partner attribution differs.
- Click priority order: UTM tags → form tags → coupon partner.

### How do I delete or edit a discount?

1. `Store → Coupons`.
2. Click the coupon name to edit, or the `X` in the last column to remove.
3. Use the Filter to find by name, type, expiration date, or product.

### How do I make an order button I can embed on a page?

1. Open the Order Buttons page in the Store area.
2. Select a product (blue folder → tick the checkbox).
3. On the Button type tab choose size, color, text — or pick `Upload your own button` → `Upload Image` → `Download` to use a custom image.
4. On Form fields tab tick the form fields the buyer should see.
5. On Additionally tab optionally fill default discount coupon, Tag, and partner's login.
6. On the Ad tag tab fill Channel, Source, Campaign, Ad, Keys for analytics.
7. Check the preview at the bottom. Click the button to test — it opens the product order window.
8. Copy the HTML in the `Copy this code and paste into the desired place on the page` window and paste it on your page.

**Options along the way:** custom-image buttons uploaded via the file manager are reusable in other forms.

### How do I configure an upsell?

1. `Store → Products` → click the link in the `for-sale` column for the base product.
2. On the upsell configuration table, top row choose the offered product and consent button text; bottom row set the decline button text.
3. Option 1 — `Select Product` → pick product → set price → `Save and configure the affiliate` → adjust Edit Partner Commissions → `Save`.
4. Option 2 — click the button text to pick product, set price, and rename the button at the same time, then `Save`. Click the blue `%` to revisit affiliate commissions.
5. `Add` row to offer an alternative variant; use up/down arrows to reorder buttons; chain additional upsells from the accept or decline outcome.
6. Main settings tab: write selling text and add image with the WYSIWYG editor; do not remove `# ORDER_FORM #`. `Test page` previews.
7. Additional Settings tab: set minutes until the upsell offer is removed; tick groups of contacts that should not see the offer.
8. Move the activation slider at the top to the right (green) to turn the upsell on.

**Gotchas:** Upsells are disabled by default even after saving. Multiple consecutive declines may lose the customer — source warns against over-stacking refusals.

### How do I create an order on behalf of a customer (from a phone call)?

1. `Store → Orders → Create`.
2. Main settings tab: enter the client's email and name (pre-filled if launched from a Successful conversation in an Order Card).
3. Click `Add product`, tick one or more products, click `Accept`.
4. Set the cancellation parameters (same options as on the product).
5. Customer Information tab: phone number, delivery address.
6. Advertising label tab: assign tag/channel/source (locked to call-center / manager login if Store → Settings → General settings has that option enabled).
7. Click `Save`.

**Result:** The order is created and the invoice is sent to the customer's email.

### How do I review and manage a specific order?

1. `Store → Orders` → click the order number.
2. On the Order Card use the clickable status pill to Cancel, Confirm, Refund, Delete, Advance pay, or generate a new order.
3. Click the auto-cancel date to change or disable it.
4. Add client notes — they appear in all of the client's orders; delete via the recycle bin.
5. Use the 5 history tabs (Order history, Tasks, All orders, All calls by orders, All calls by tasks) to dig deeper.
6. From a call-center role, click one of the call status buttons and complete the form (see Order Card screen for per-status field list).
7. Click `Resend the letter "Thank you for your purchase"` if paid materials need to be re-sent.

**Options along the way:**
- `Save and Create` (Conversation went through) adds a new order on top of the existing one.
- `Cancel and Create` deletes the old order and creates the new one.
- `Upload` attaches a call recording to the client file.

**Gotchas:** When the order manager is changed, commission for the paid order is charged to the new manager.

### How do I filter the orders list?

1. `Store → Orders → Filter`.
2. Fill any combination of fields: contacts/lead info, Order No. (and `Showing only prepaid orders`), Payment status, the four date ranges, Minimum amount, Tag.
3. Open the sub-menus on the left for advanced filters: Products, Partnership, Advertising (first vs last click radio), Manager (with call-status dropdown), Delivery (type and status), Auto payments.
4. Click `Search`. To reset, click `Filter` then `Clear`.

### How do I export orders?

1. `Store → Orders` → click the gear button at the top.
2. Pick a format: CSV, Excel, Web-trader, Simple text / Plain text.

### How do I customize columns in the Orders table?

1. `Store → Orders → View`.
2. Tick or untick fields. The base set is on by default.

### How do I set up automatic payment-reminder emails for unpaid orders?

1. `Store → Orders → Payment reminder`.
2. Click `Add` to create a new series (Add and Edit a Series of Payment Reminders via Email screen).
3. Enter the series name and tick the products it applies to.
4. `Save` — you return to the Payment reminders via email list with the new series.
5. Open the series and click `Add` to create the first email.
6. Set Serial number, Transmittal time (minutes/hours/days from invoice creation), Sender's email.
7. Edit the body in the WYSIWYG editor; use variable buttons such as `Order Amount` to insert `{$sum}`; keep `{$pay_link}` and `{$cancel_link}` intact.
8. `Save`. Repeat for each step in the series.

**Gotchas:** Removing the pay or cancel links from the default email is strongly discouraged.

### How do I configure PayPal?

1. `Store → Settings → Payment method → PayPal` → also open the Payment Guide tab and copy its notification URL.
2. In PayPal: log in → SELLER TOOLS → Instant payment notifications → `Edit settings` → paste the notification URL into `Notification URL`, tick `Receive IPN messages (Enabled)`, Save.
3. (Optional) Build a post-payment redirect page in `Websites → Pages` with any tracking pixels/codes. Copy its URL.
4. (Optional) In PayPal `Website preferences` enable `Auto Return` and paste the redirect URL, Save.
5. Back in InfluencerSoft Payment methods: enter the email your PayPal is registered to and any restrictions.

**Result:** Orders paid through PayPal mark as Paid automatically in InfluencerSoft.
**Gotchas:** If a payment shows in PayPal but not in InfluencerSoft, open History of instant payment notifications in PayPal and re-send (PayPal can delay IPN delivery up to 12 hours).

### How do I add or edit Store-wide settings?

1. `Store → Settings`.
2. Pick the relevant tab:
   - Payment method — `Connect` per provider.
   - General settings — notifications email, notification checkboxes, phone-field requirements, default prepayment, default expense amount, terms-and-conditions link, color palette and fonts, copyright text.
   - After prepayment — edit thank-you-for-prepayment email with variables.
   - Delivery — tick countries that may receive physical deliveries.
   - Alternative store — pick an attached domain and toggle ON/OFF; configure its copyright text.
   - Payment methods for alternative store — `Connect` providers for the alternative domain.
   - Sales Tax — `Add sales tax` per country, or `Add EU standard VAT rates` to bulk-load EU rates and tick `Request customer VAT ID`; pre-select your business country so Reverse Charge can be excluded.
   - Language — edit the message for paid-subscription products and pick the payment start date format.
3. Save each tab as you go.

**Gotchas:**
- Alternative store ON routes ALL product payments to the alternative-store account regardless of which domain generated the form.
- Sales tax applies to recurring and upsell products.

### How do I assign or change the manager responsible for an order or a client?

1. **Sales manager (responsible for the order):** auto-assigned at creation. To change in bulk, `Store → Orders` → select rows → `Assign responsible by bills`. To change for a single order, open the Order Card and use the `Assign` button on the manager field. If you reassign before payment, commission for the paid order goes to the new manager.
2. **Personal manager (responsible for the client):** open any of the customer's orders and click `not specified` in the additional information section, or open the contact card and click `not specified`. Either change cascades to every order under the same client email.

**Options along the way:**
- Personal manager filter is at `Store → Orders → Filter → Manager → Personal manager`.
- The order-manager auto-detaches if the assigned manager opens but takes no action.

### How do I integrate Facebook Messenger and build a chatbot?

1. `Mailings → Settings → Messenger integration → Continue with Facebook`.
2. Confirm/log in to Facebook, pick the page(s), enable all options, `Done`.
3. Create a process in `Tasks` (or inside a funnel) and add the `Start dialogue on Facebook` trigger. Pick the page; optionally enter a unique ref-link.
4. To capture an email subscription: add `Facebook @opt-in` block — fill subscription question text, activation email, and `URL after confirming the subscription`.
5. To send chat messages: add `Facebook Message` block — message text, button text + URL (optional), and use `+Text`, `+Image`, `+Video` for additional messages, plus quick replies.
6. For a multi-branch chatbot, replace the start trigger flow with: Start dialogue → greeting Facebook Message → `Greetings` (quick replies "Get a Gift", "Learn about the Special Offer", "Other") → each option drives one branch:
   - Gift → `Subscribe offer` → `Subscribe via Facebook` → email-with-gift message → `End Process`.
   - Special Offer → `Message with a button` linking to a sales/order page.
   - Other → `Phone Request` → `Task for the manager to call`, then on `completed` → `End Process`, on `failed` → additional message → `End Process`.
7. For recursion (let the user revisit the menu), wire the end of each branch back to the choice block placed after the greeting.

**Gotchas:**
- 24-hour Facebook restriction: you can only send Messenger messages within 24 hours of the user's last response.
- Every branch must end in `End Process`.

### How do I view payments and statistics for co-authors?

1. `Store → Co-authors` — the page header shows `Payout` totals.
2. Per-row columns: `Earned`, `Paid`.
3. Click the blue number in `Accounts` to jump to Orders filtered by the co-author's products.
4. Click the blue number in `Products` to open Products of the Co-Author and edit joint products.
5. Use the page-top profile link to log in as the co-author to view their full stats.

### How do I resend the "Thank you for your purchase" email after manual payment?

1. `Store → Orders` → click the order number.
2. On the Order Card click `Resend the letter "Thank you for your purchase"`.

## Cross-references

- **Contacts** — Order Card, Lead Card, and "All orders" / "Calls" tabs mirror data here; Personal manager assignment also lives on the contact card.
- **Mailings (Campaigns)** — Messenger integration is configured under Mailings → Settings; Facebook subscribers become regular subscribers reachable by Email Broadcasts and Email Sequences.
- **Tasks / Automation (Processes)** — Facebook chatbot flows are built as processes; product purchases can add buyers to lists used by automation.
- **Funnels** — Sales funnels can host the Facebook chatbot process and consume product/group memberships triggered after payment.
- **Website** — `Websites → Pages` provides the post-payment redirect page used for Auto Return in PayPal and the "Thank you for your purchase" landing. Alternative store requires an attached domain (see How to bind your own domain).
- **Affiliate program / Partners** — Partnership tab inside a product and the coupon `Attaching invoices … to the partner` field both interact with the general affiliate program settings.
- **Reports / Analytics** — Orders summary fields (Income, Profit, partner/call-center payments) drive Sales Reports; Advertising filter ties orders to Advertising reports (Channels).
- **Users / Teams** — Call Center rights are configured under user management and gate access to sales-manager workflows on the Order Card.

## Source articles

- [Add and Edit a Series of Payment Reminders via Email](https://help.influencersoft.com/hc/en-us/articles/360050850751-Add-and-Edit-a-Series-of-Payment-Reminders-via-Email)
- [Add and Edit a Series of Payment Reminders via Email](https://help.influencersoft.com/hc/en-us/articles/360044767631-Add-and-Edit-a-Series-of-Payment-Reminders-via-Email)
- [Adding and Editing a Co-Author](https://help.influencersoft.com/hc/en-us/articles/360050850771-Adding-and-Editing-a-Co-Author)
- [Adding and Editing a Joint Product](https://help.influencersoft.com/hc/en-us/articles/360050850791-Adding-and-Editing-a-Joint-Product)
- [Adding and Editing a Payment Reminder Email](https://help.influencersoft.com/hc/en-us/articles/360050387952-Adding-and-Editing-a-Payment-Reminder-Email)
- [Adding and Editing a Payment Reminder Letter](https://help.influencersoft.com/hc/en-us/articles/360044319292-Adding-and-Editing-a-Payment-Reminder-Letter)
- [Adding and Editing a Product](https://help.influencersoft.com/hc/en-us/articles/360050850851-Adding-and-Editing-a-Product)
- [Adding and Editing Product Categories](https://help.influencersoft.com/hc/en-us/articles/360050850911-Adding-and-Editing-Product-Categories)
- [Co-Authors](https://help.influencersoft.com/hc/en-us/articles/360050387992-Co-Authors)
- [Create an Order](https://help.influencersoft.com/hc/en-us/articles/360044318192-Create-an-Order)
- [Create an Order](https://help.influencersoft.com/hc/en-us/articles/360050850951-Create-an-Order)
- [How to create or edit a discount](https://help.influencersoft.com/hc/en-us/articles/360050388132-How-to-create-or-edit-a-discount)
- [How to Create a Discount](https://help.influencersoft.com/hc/en-us/articles/360044766911-How-to-Create-a-Discount)
- [How to Create Coupons](https://help.influencersoft.com/hc/en-us/articles/360050388012-How-to-Create-Coupons)
- [Integration with Facebook and automation via chatbot](https://help.influencersoft.com/hc/en-us/articles/360044767691-Integration-with-Facebook-and-automation-via-chatbot)
- [Order Buttons](https://help.influencersoft.com/hc/en-us/articles/360050850991-Order-Buttons)
- [Order Management (Order Card)](https://help.influencersoft.com/hc/en-us/articles/360050851011-Order-Management-Order-Card)
- [Orders](https://help.influencersoft.com/hc/en-us/articles/360050851031-Orders)
- [Payment Method Setup in the Store - PayPal](https://help.influencersoft.com/hc/en-us/articles/360050851091-Payment-Method-Setup-in-the-Store-PayPal)
- [Payment reminder emails](https://help.influencersoft.com/hc/en-us/articles/360050851071-Payment-reminder-emails)
- [Product Categories](https://help.influencersoft.com/hc/en-us/articles/360050388292-Product-Categories)
- [Products](https://help.influencersoft.com/hc/en-us/articles/360050388332-Products)
- [Products of the Co-Author](https://help.influencersoft.com/hc/en-us/articles/360050851131-Products-of-the-Co-Author)
- [Store Settings](https://help.influencersoft.com/hc/en-us/articles/360050388432-Store-Settings)
- [The manager handles the order and the client. What is the difference?](https://help.influencersoft.com/hc/en-us/articles/360050388452-The-manager-handles-the-order-and-the-client-What-is-the-difference)
- [The Manager Is Responsible for the Order and for the Client. What Is the Difference?](https://help.influencersoft.com/hc/en-us/articles/360044767611-The-Manager-Is-Responsible-for-the-Order-and-for-the-Client-What-Is-the-Difference)
- [Upsell Settings](https://help.influencersoft.com/hc/en-us/articles/360050851251-Upsell-Settings)



---


# Contacts

## Overview

The Contacts area of InfluencerSoft is where you build and segment your audience database, manage internal users and teams who work with that audience, and configure CRM-side behavior (additional lead fields, reCAPTCHA, call-center scripts, default emails). A contact is broader than a subscriber: subscribers are contacts who have confirmed they will receive your newsletters, while ordinary contacts can be received offline, called, or sent SMS but cannot be sent email through InfluencerSoft servers unless activated. This chapter documents every screen and field in the Contacts menu (Leads, Lists, Categories, Forms, Tags, Calls, Meetings, Settings) plus the User, Team, and Click History screens reached from the same area.

## Where to find it

- `Main menu (left) → Contacts → Leads` — the contact database.
- `Main menu → Contacts → Lists` — segment lists (normal, auto, inactive).
- `Main menu → Contacts → Lists → Categories` — group lists into categories.
- `Main menu → Contacts → Forms` — Subscription Form Constructor.
- `Main menu → Contacts → Tags` — tag-level statistics.
- `Main menu → Contacts → Calls` — call assignments / call tasks.
- `Main menu → Contacts → Meetings → Create a meeting` — Zoom meeting appointments.
- `Main menu → Contacts → Settings` — CRM Settings (Additional lead fields, reCAPTCHA, call-center instructions and default letters).
- `Top-right profile dropdown → Users` — manage users; from there → `Teams` for teams; → `Click History` for activity log.
- `Profile name → Users tab → Teams` — alternate entry to Teams.
- `Profile (admin / employee) → Available meeting place → Connect Zoom` — Zoom integration toggle.

## Terminology

- **Contact (Lead):** a person record in the database (potential customer or subscriber). Can be created manually, by import, by order, or by subscription form. Manually added contacts cannot be sent email through InfluencerSoft servers.
- **Subscriber:** a contact in the "Subscribed" / "Activated" status, eligible to receive emails and SMS through InfluencerSoft.
- **List (Group):** a segment of contacts. Comes in three variants: normal (manual), Auto-list (conditions-driven), and Group of Inactive Contacts.
- **Auto-list:** a list whose membership is determined automatically when a contact meets configured conditions (e.g., joins another list, becomes a customer of a product, lives in a given city).
- **Group of Inactive Contacts:** an auto-list of contacts who have not opened or clicked emails for a specified period.
- **Category:** an array combining several thematic lists. Appears in the activation and unsubscribe emails. Mandatory to choose a sender per category.
- **Sender:** the From identity letters in the list/category are sent from. Configured in Mailing Settings.
- **Lead Card (Contact card):** the detail view for a single contact, with 14 tabs covering lists, pages, orders, calls, emails, history, and related/merged contacts.
- **Personal manager:** a user (typically Call Center) assigned responsibility for a contact.
- **Call assignment / Call task:** a job given to call-center employees: take contacts from a list and call them, recording statuses.
- **Status (contact):** "Awaiting activation", "Subscribed" / "Activated", "Can only be sent through an external SMTP server" (blue checkmark), plus other system statuses controlling whether email can be sent.
- **Status (call task):** New, In work / In process, Successfully completed, Unsuccessfully completed; intermediate statuses can be added.
- **Auto-series / Email Series:** an automated chain of letters tied to a list.
- **Tag:** an advertising/source label attached to a subscription form or order button to track where contacts came from.
- **Additional lead field:** a custom CRM field added in Contacts → Settings → Additional lead fields. Typed (integer, fractional, date, etc.).
- **reCAPTCHA:** Google invisible reCAPTCHA, installed via Site key and Secret key in Contacts → Settings → reCAPTCHA. Protects all subscription and order forms.
- **Form Constructor:** drag-and-drop builder for subscription forms (and order forms via Store); outputs JavaScript or HTML embed code.
- **Team:** a group of users that receives auto-distributed tasks by a configured algorithm.
- **Role:** a ready-made user profile (rights and accesses); when a role is selected, individual rights tabs become unavailable.
- **Access rights:** Call Center, Delivery, or Additional Administrator — selected when no role is chosen.
- **Click History (Activities):** log of users' activity inside the account — date, IP, page opened.
- **Related contacts:** leads acting from the same browser but with different emails, not merged.
- **Merged contacts:** leads merged into one, with the secondary deleted.
- **Meeting:** a Zoom-backed appointment created in Contacts → Meetings, optionally bookable through a funnel.

## Screens and fields

### Screen: Leads (Contacts list)

- **Purpose:** Browse, filter, edit, import, export, and group every contact in the account.
- **How to open:** `Main menu → Contacts → Leads`.
- **Top-of-page summary:** **Total** block shows the total number of contacts for the account.
- **Buttons and actions:**
  - **View** — opens the **Visible fields** pop-up; tick or untick to add/remove table columns.
  - **Filter** — opens the filter pane (see below).
  - **Import** — opens the import form (CSV Import or Text Import; see Screen: Import Contacts).
  - **Create Contact** — opens Add Lead page (see Screen: Add Lead).
  - **Gear (cogwheel) menu** (after selecting contacts via first-column checkboxes or the filter):
    - **Edit** — bulk-edit one of: Surname, Name, Middle name, Phone, City, Description.
    - **Add to group** — opens picker to add selected contacts to one or more lists/categories; confirm with **Add to Contacts**.
    - **Delete from lists** — opens picker to remove from lists/categories (whole categories selectable via category checkbox).
    - **Export → CSV / Excel / Plain text** — downloads to the browser's default download folder.
- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Group (list) | tree-picker with checkboxes | No | Pick one or more lists; folders (categories) expand to lists | none |
| Email | text + match-type | No | Match types listed below | none |
| Phone number | text + match-type | No | — | none |
| Total amount paid | number + match-type | No | — | none |
| Last name | text + match-type | No | — | none |
| First name | text + match-type | No | — | none |
| Middle name | text + match-type | No | — | none |
| Email exists | match-type | No | — | none |
| Customer information | text + match-type | No | Extra info added on contact | none |
| Status | match-type | No | Subscriber statuses | none |
| Date of first registration | date + match-type | No | — | none |
| Tags | text + match-type | No | — | none |
| Date of subscription to a list | date + match-type | No | — | none |
| Personal manager | dropdown + match-type | No | — | none |
| Timezone (UTC) | dropdown + match-type | No | — | none |
| Points | number + match-type | No | Gamification points | none |
| Billing address 1 | text + match-type | No | — | none |
| Billing address 2 | text + match-type | No | — | none |
| Billing city | text + match-type | No | — | none |
| Billing state | text + match-type | No | — | none |
| Billing zip | text + match-type | No | — | none |
| Billing country | text + match-type | No | — | none |
| Shipping address 1 | text + match-type | No | — | none |
| Shipping address 2 | text + match-type | No | — | none |
| Shipping city | text + match-type | No | — | none |
| Shipping state | text + match-type | No | — | none |
| Shipping zip | text + match-type | No | — | none |
| Shipping country | text + match-type | No | — | none |
| Your gender | text + match-type | No | — | none |

- **Match types for each field:** Corresponds, Does not match, More than, Less than, More than or equal to, Less than or equal to, Contains.
- **Filter controls:** **+** button adds multiple values to one condition; **Add Condition** adds extra filter rows.
- **Notes:**
  - You cannot send emails to manually added contacts (you can send SMS and make calls).
  - Filter results are stored for 5 minutes; if you wait longer before importing or grouping, re-filter or the action will run against the whole database.
  - Total contact deletion (GDPR) must be requested through support; mass-delete from the database is not available in-app.

### Screen: Add Lead

- **Purpose:** Manually create a single new contact.
- **How to open:** Leads → **Create Contact**.
- **Fields:** All fields are optional (per source). Standard lead data is entered into corresponding lines; additional fields defined in CRM Settings appear here too.
- **Buttons:** **Save** — creates the contact.
- **Notes:** Manually added contacts cannot be sent email through InfluencerSoft; SMS and phone calls are still possible.

### Screen: Lead Card (Contact card)

- **Purpose:** Detailed view for a single contact across 14 tabs.
- **How to open:** From Leads, click the contact's email (or "No Email") or name; also reachable from Campaigns → Subscribers and Store → Orders by clicking the lead's name or email.
- **Top action (cogwheel "To Add"):** Attach the lead to a Process, attach to a Lead list, or apply Rules.
- **Top profile block:** Email, first / last / middle name, phone, city, time zone, points, address, delivery address, Status (controls whether email can be sent), **Personal manager** (assignable), **Customer information** (free text).
- **Lead's financial statistics** (visible only once the lead has at least one order):
  - Orders — total sum of all orders for this email.
  - Expected — sum of orders in "Expected" status.
  - Confirmed — sum of orders in "Confirmed" status.
  - Paid — sum of paid orders.
  - Income — Paid minus expenses.
  - Profit — Income minus expenses (lines 7+8+9) minus refunds.
  - Affiliate commission — payments accrued to referring partners.
  - Call center — payments accrued to call-center staff.
  - Co-authored — payments accrued to product co-authors.
  - Refund — sum of refunds.
- **Tabs (14 total):**
  1. **Lead** — main info, additional fields (from CRM Settings), Personal manager, Customer information, Points.
  2. **Lead history** — every change (create, group add/remove, tag add/remove, name/surname/middle name set/change/delete, shipping index/country/region/city/street/house set/change/delete, UTC change, personal-manager change, additional-field change). Entries made by Zapier are tagged "Zapier — Add/Update Lead".
  3. **Tasks** — view and assign tasks for this lead.
  4. **Lists** — table of lists the lead is in. Columns: List of leads, Date, Partner, Tag, Source and channel, Campaign / ads / keys, Status, Deletion. Manual deletion works for normal lists only; lead cannot be manually removed from auto-lists.
  5. **Pages** — every page visited by the lead.
  6. **Orders** — Number, Created, Products, Partners, $, Payment (date or status: confirmed, refund, canceled), Source and channel, Campaign / ads / keys.
  7. **Calls made to confirm orders** — Number, Created, Products, Status, Comment, Manager.
  8. **Automatic chain (Email series)** — List, Letter number, Name, Done, Opened, Clicked, Unsubscribed, Spam.
  9. **Broadcasts** — same columns as Automatic chain, except Number (broadcast number) and Sent (date and time).
  10. **Calls of assignments** — only shown if call tasks exist; shows clicks for the chosen period: Time, Source, Campaign, Ad, Keys.
  11. **Facebook pages** — Facebook pages the contact visited.
  12. **Related contacts** — leads in the same browser, different emails, not merged.
  13. **Merged contacts** — leads merged into this one (the secondary was deleted).
  14. (Additional tab indicated by the 14-tab structure of the card.)
- **Notes:** Some general fields are editable inline (phone, names); Personal manager and Customer information are editable here too.

### Screen: Lead Card in Call Tasks

- **Purpose:** Drill-down on a single lead inside the context of a specific call task; record call results, status, and notes.
- **How to open:** `Contacts → Calls → select call task → click the number in the task line → click the link in the "Name and phone number" column`.
- **Header — Lead status:** New (no manager working), In process (manager working), Finished (successful or unsuccessful). Editable here; status changes set by call-center employees are visible immediately to the account holder. Customized statuses come from the Statuses tab of the call assignment.
- **Buttons — change call results:** Used by the call-center manager (or admin) to record the call outcome. (See "Letter templates" in Adding and Editing a Call Assignment for the outcomes wired to these buttons: The conversation went through, Did not answer the phone, Call back, Wrong number, Renouncement.)
- **Main information about a client:**
  - Zip code, full name, phone number, city, Personal manager (or "not chosen").
  - **Tags** can be added (visible under Lead tab in the Lead Card).
  - **Date of first registration** — date the user first filled and sent a subscription/order form.
  - **Date created** — date the lead entered this call task (latest of "added to list" and "task created").
  - **Date of change** — date status was last updated.
  - **Closing date** — date the status was changed to Finished.
  - **Additional information** — free text, visible in all orders and in the Lead Card "More" tab.
- **Visual block — call history (3 tabs):**
  - **Call History** — chronological call log for the current task, including status transitions and the responsible employee.
  - **All orders** — all orders by this client (mirrored from Lead Card → All orders).
  - **Order calls** — all calls tied to those orders (mirrored from Lead Card → Calls made to confirm orders).
- **Call script:** Displayed below the visual block if a script is configured in the call assignment's "Tips for employee" tab.

### Screen: Contact Lists

- **Purpose:** Manage all lists (normal, auto, inactive) for segmenting contacts.
- **How to open:** `Main menu (left) → Contacts → Lists`.
- **Default lists (auto-created):** All contacts, All partners, My contacts, All customers. User-created lists also appear here.
- **Buttons and actions:**
  - **Add** — open Add Contact List screen (normal list).
  - **Auto List** — open Add Contact Auto-List screen.
  - **Inactive** — open Add Group of Inactive Contacts screen.
  - **Categories** — go to Categories screen.
  - **Filter / Search / Clear** — see filter table below.
  - **Test** — send the list's auto-series emails to the test address from Mailing Settings, to preview rendering.
  - **Auto-series toggle (column)** — drag slider left (black) to stop the auto-series for that list; right (green) to resume.
  - **Star (first column)** — toggle Favorite; favorites pin to the top.
  - **List reports** — funnel sources report and funnel cohorts report for the selected list.
  - **X (last column)** — delete the list.
  - **Import icon** — open the import flow scoped to that list.
- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Category | dropdown | No | Existing categories | none |
| Name | text | No | Full title = single match; fragment = all lists containing fragment | none |
| Type | dropdown | No | Client (purchased) / Information (subscribed to newsletter) | none |

### Screen: Add and Edit Contact List (normal)

- **Purpose:** Create or edit a manual contact list.
- **How to open:** Contact Lists → **Add**, or click a list name to edit.
- **Tabs:** Basic data, API.
- **Basic data fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name | text | Yes | List title | — |
| Sender | dropdown | Yes | Sender from Mailing Settings | — |
| Category | dropdown | No | Existing category | none |
| Activation letter text | WYSIWYG | No | Edit activation letter | system default |
| Redirect page after unsubscribing | text (URL) | No | Where unsubscribers are sent | — |

- **API tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Notification script address | text (URL) | No | Script URL that receives notifications when a new contact is added | — |

- **Buttons:** **Save** — adds the list to Contact Lists.

### Screen: Add and Edit Contact Auto-List

- **Purpose:** Create or edit a list whose membership is set automatically when conditions are met.
- **How to open:** Contact Lists → **Auto List**, or click an auto-list to edit.
- **Tabs:** Basic data, Conditions.
- **Basic data fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name | text | Yes | Auto-list title | — |
| Automated series | checkbox | No | Whether members continue to receive the main email series | unchecked |
| Sender | dropdown | Yes | Sender for series letters | — |
| Category | dropdown | No | Existing category | none |
| Redirect page after unsubscribing | text (URL) | No | — | — |

- **Conditions tab:** Configure which other lists/categories, or which product customers (paid / unpaid / canceled accounts), feed members in. Navigate via blue folders; tick checkboxes to include lists; tick a category checkbox to include all lists in it. **City** field allows location-based membership.
- **Buttons:** **Save** — adds the auto-list to Contact Lists.

### Screen: Adding and Editing a Group of Inactive Contacts

- **Purpose:** Create or edit an auto-list that gathers contacts after a configured inactivity period.
- **How to open:** Contact Lists → **Inactive**, or click an inactive group to edit.
- **Tabs:** Basic data, Inactivity.
- **Basic data fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name | text | Yes | Group title | — |
| Sequences | checkbox | No | Whether members continue receiving the main email series | unchecked |
| Sender | dropdown | Yes | Sender from Mailing Settings | — |
| Category | dropdown | No | Existing category | none |
| Redirect page after unsubscribing | text (URL) | No | — | — |

- **Inactivity tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Source groups | tree-picker | Yes | Lists/categories monitored for inactivity | — |
| Choose those who | dropdown | Yes | Inactivity condition, e.g., did not open any email, did not click even once | — |
| Period | number (days) | Yes | Days of inactivity before adding to group | — |
| Enable this list | checkbox | No | Track activity or not on this group | unchecked |

- **Buttons:** **Save** — adds the group to Contact Lists.

### Screen: Categories (list)

- **Purpose:** Combine thematic lists into category arrays; appears in activation and unsubscribe emails.
- **How to open:** Contact Lists → **Categories**.
- **Buttons and actions:**
  - **Add** — open Add Category page.
  - **Click a category name** — edit it.
  - **Cross (X)** — delete the category.
  - **Filter / Search / Clear** — filter by Name (full title = one match, fragment = contains-match).
- **Notes:** If a category is set on a list, the activation and unsubscribe pages reference that category; if not, the author's name and full author unsubscribe are shown.

### Screen: Add / Edit Category

- **Purpose:** Create or rename a category and bind its lists and sender.
- **How to open:** Categories → **Add** or click an existing category.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name of the category | text | Yes | Subscriber-visible; should be meaningful | — |
| Lists included | multi-select (Ctrl-click for multiple) | Yes (at least one to create) | Lists to add to this category | — |
| Sender | dropdown | Yes | Sender from Mailing Settings; changes letter footer | — |

- **Buttons:** **Save** — adds the category to the Categories list.

### Screen: Import Contacts — CSV Import

- **Purpose:** Bulk-import a CSV of leads into a chosen list.
- **How to open:** `Contacts → Leads → Import → CSV Import`.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Where to import | dropdown | Yes | Target group/list | — |
| File | file (CSV, UTF-8) | Yes | CSV in UTF-8 | — |
| Field delimiter | radio | Yes | `;` or `,` or `\t` | — |
| Activation handling | radio | Yes | "Do not send an activation email when importing. Sending emails is possible only from a third-party email server" / "Send an activation message to new subscribers to confirm the permission to receive email newsletters" | — |
| Do not import the first row | checkbox | No | Skips header row | checked |
| Column-to-field mapping | per-column dropdowns | Yes | Choose target field per CSV column; choose "Do not import" to skip | — |

- **Buttons:** **Next** (proceeds to mapping), **Import contacts** (starts import), **Finish** (closes window; import continues in background).
- **Notes:**
  - Recommended batch size: ≤500 contacts.
  - Activation rate should be near 100%; persistently low activation can lead to permanent account suspension.
  - If errors are found, the line number is reported and import pauses.
  - Status outcomes: existing contacts keep their status; new contacts default to "Awaiting activation"; if "skip sending activation email" is chosen the new contact is "Can only be sent through an external SMTP server" (blue checkmark); activation-confirming contacts move to "Subscribed".

### Screen: Import Contacts — Text Import

- **Purpose:** Paste lead data as text and import into a list.
- **How to open:** `Contacts → Leads → Import → Text Import`.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Where to import | dropdown | Yes | Target group | — |
| Import data | textarea | Yes | First line = field names; following lines = data; divider = `;`; dates `YYYY-MM-DD` | — |
| Skip automatic emails | number (first N) | No | Skip the first N auto-series letters so subscribers start mid-chain | 0 |

- **Buttons:** **Import** — runs the import; progress bar at the bottom.
- **Notes:**
  - If the source export is from InfluencerSoft, only the email column is required; other fields fill automatically.
  - Filter results are kept 5 minutes; outside that window all DB contacts may be imported if you do not re-filter.
  - Same status rules as CSV import.
  - Other ingestion paths: Zapier integration and the InfluencerSoft API.

### Screen: Tags

- **Purpose:** Track statistics by per-form / per-button tags.
- **How to open:** `Contacts → Tags`.
- **Columns:** Contacts received, Subscribers received, Accounts (orders) received — per tag.
- **Drill-down:** Clicking the number in a column opens the matching screen (Contacts / Subscribers / Accounts) pre-filtered by that tag.
- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Title tag | text | No | Full title = single match; fragment = contains-match | — |

- **Buttons:** **Search**, **Clear**.

### Screen: Subscription Form Constructor

- **Purpose:** Build subscription forms with drag-and-drop widgets; output JavaScript or HTML embed code.
- **How to open:** `Contacts → Forms`. (Order forms live in `Store → Order forms`; same constructor.)
- **Initial view:** Gallery of ready-to-use form templates. Choose one and click **Create**, or pick an empty form.
- **Key on-canvas actions:**
  - **Exit (X)** — confirmation appears; unsaved changes are lost.
  - **Save as template (star)** — names the form and saves it under "My subscribe forms" tab.
  - **Publish** — opens code window with two tabs.
  - **+Add element** — adds widgets to the form.
- **My subscribe forms tab:** Hover a template to expose **Create** (new form based on template, edits don't affect the template), **Edit** (edits the template; published forms tied to it will reflect changes), **Delete** (irreversible).
- **Publish — code options:**
  - **JavaScript code** — embedded form remains linked to the template; editing the template updates the published form.
  - **HTML code** — embedded form is detached from the template; template edits do not propagate.
- **+Add element widgets:** Form, Text, List, Social buttons, Indent, Image.
- **Form widget — Settings tab:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Add to groups | tree-picker | No | Adds contact to chosen group(s) / category(ies); selecting a category adds to all its lists | none |
| Sign up for newsletters | checkbox | No | If checked: adds to Contacts and sends activation letter; the contact becomes a subscriber after clicking activation link. If unchecked: contact is collected but not activated and no activation letter is sent | checked |
| Actions | radio | No | **Show message** (modal on submit) / **Open link** (redirect to specified page) / **Order product** (places an order; if multiple products attached, user selects one) | Show message |
| Delete from groups | tree-picker | No | Removes the contact from the selected group(s)/category(ies) on submit | none |
| Advertising tags | UTM-style tags | No | Embedded into form code, tracked in Reports → Channels | — |

- **Form widget — Design / Quick settings:** View = horizontal / vertical / in modal box. "In modal box" reveals **Window opening button style** (Form button type, Filling color, Width % of base form, Border type/size, Curve slider) and **Action when hovering over the call-to-action button** (hover color). **Field label** toggle adds a name above each field.
- **Form designer (per field):**
  - **Enable/disable** slider — right (green) shows the field, left (grey) hides from the form.
  - **Description** — placeholder text shown inside the field.
  - **Required** — submission only proceeds when filled.
  - **Hidden** — field still collects (not deleted) but is not shown; a hidden "Name" defaults each contact's name to "Dear friend".
- **Design settings — element groups:** Button, Form, Fields, Signatures (only shown if "Field label" is on). For each element: Samples (10 preset colors) / Own color (palette, supports gradient with type, start color, end color); Border (style, size, color); Text and font (color, size, font, width — e.g., 20 / Open Sans / Bold); Inside indents (content-to-border) and Outside indents (element-to-element).
- **Action when hovering over submit button:** Pointer-state color (e.g., button red → green on hover).
- **HTML/CSS:** Add CSS class rules in the page head or before the form code (e.g., a `shadow` class to apply a button shadow).
- **Text widget:** Click "Your text" to edit via the default editor; separate indent values supported for desktop and mobile.
- **List widget:** Add/remove lines with **+** / **−**. Image: click path to upload from computer, or **Choose from library** for stock options.
- **Social buttons widget:** Icon types `social-icon-pack-1` (rounded) or `social-icon-pack-2` (square). Settings: alignment, margins, add/remove networks. Hover the network name to reveal a cogwheel that opens the link-edit menu.
- **Indent widget:** No edit panel; drag the black dot vertically to adjust spacing.
- **Image widget:** Drag in, then upload or pick from library.
- **General form settings:** Apply to the whole form (not a particular element).
- **FAQ:** To track subscription/payment conversions in pixels and analytics, create separate redirect pages for subscribe/payment success and paste their URLs into the form's redirect fields.

### Screen: CRM Settings

- **Purpose:** Configure account-level CRM behavior — extra lead fields, reCAPTCHA, call-center scripts, default call letters.
- **How to open:** `Main menu → Contacts → Settings`.
- **Tabs:** Additional lead fields, reCaptcha, Instructions for call assignments, Messages for call orders, Instructions for call orders.
- **Note:** Except for the Additional lead fields tab, the other tabs require at least one employee to be added to the system.

#### Tab: Additional lead fields

- **Purpose:** Define custom fields shown on the Add Lead and Lead Card screens.
- **Action:** Click **Add Field**; fill the pop-up:

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Field name | text | Yes | Label for the new field | — |
| Type | dropdown | Yes | Integer / Fractional number / Date / Date and time / String (up to 255 characters) / Text (any length) / Logical type (yes or no) / Drop-down list / Switches | — |
| Default value | text | No | Pre-fill | — |
| Value 1, Value 2… (Drop-down list only) | text | Yes (if type = Drop-down list) | Each option in the dropdown. **Add Value** appends another value input | — |

- **Buttons:** **Save** — adds the field; **Add Value** — appends another value row when Type = Drop-down list.

#### Tab: reCaptcha

- **Purpose:** Install Google invisible reCAPTCHA across all forms in the account.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| ReCAPTCHA site key | text | Yes (to enable) | Site key from Google reCAPTCHA admin | empty |
| ReCAPTCHA secret key | text | Yes (to enable) | Secret key from Google reCAPTCHA admin | empty |
| Enable bar | toggle | Yes (to enable) | Green = on; reCAPTCHA stays disabled if either key field is empty | off |

- **Buttons:** **Save**.
- **Notes:** Once enabled, invisible reCAPTCHA applies to every InfluencerSoft form, including those embedded on third-party pages. To obtain keys: at https://www.google.com/recaptcha/admin/ — Label = any name; Type = "reCAPTCHA v2" → "Invisible reCAPTCHA badge"; Domains must include `influencersoft.com` plus every domain delegated to InfluencerSoft and every domain hosting your forms or payment pages; accept terms; click **Send**; copy Site key (first field) and Secret key (second field). The Google interface also exposes "Go to settings" and "Go to analytics" buttons.

#### Tab: Instructions for call assignments

- **Purpose:** Author the instruction shown to call-center employees for call-by-contact assignments.
- **Editor:** Default InfluencerSoft text editor.
- **Buttons:** **Save**.

#### Tab: Messages for call orders

- **Purpose:** Edit default letters sent by call-center employees to customers after a call about an order.
- **Template options (radio):** The conversation went through / Did not get through / Call back / Already paid / Invalid lead.
- **Buttons:** **Reset Default Mail** (revert to the original letter), **Save**.

#### Tab: Instructions for call orders

- **Purpose:** Author the instruction shown to call-center employees for calling about orders.
- **Editor:** Default InfluencerSoft text editor.
- **Buttons:** **Save**.

### Screen: Calling Tasks (Calls index)

- **Purpose:** Track and manage call assignments for the call center.
- **How to open:** `Main menu → Contacts → Calls`.
- **Top summary block:** Leads (contacts under call tasks), New, In process, Completed successfully, Unsuccessfully completed.
- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Date of addition | date | No | — | — |
| Task title | text | No | — | — |
| Category | dropdown | No | — | — |
| Responsible manager | dropdown | No | — | — |
| Activity | dropdown | No | Active / inactive | — |

- **Buttons:** **Search**, **Clear**, **Create Job** (new call assignment).
- **Table row actions:**
  - Click task **name** — edit assignment.
  - **Status slider** — left (dark gray) deactivates, right (green) reactivates.
  - **Cross sign** — delete task.
  - Click a number in **Contact / New / In process / Completed successfully / Unsuccessfully completed** columns — jump to the Calling task page filtered by that status.

### Screen: Add / Edit Call Assignment

- **Purpose:** Define a job for call-center employees: which contacts to call, statuses, script, and post-call letters.
- **How to open:** Calls → **Create Job** (new) or click a task name (edit).
- **Prerequisite:** At least one user with Call Center profile must exist.
- **Tabs:** Main settings, Statuses, Tooltip for an employee (Tips for the employee), Preparation of an email to the client (Client letter draft).
- **Main settings fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name | text | Yes | — | — |
| Category | dropdown | No | — | — |
| Responsible employee | dropdown | Yes | Employees with Call Center profile only | — |
| Automatically assign contacts to the personal manager | checkbox | No | Manager takes on contacts to ring up | unchecked |
| Take contacts from these lists | tree-picker | Yes | Click blue folders to move between categories; tick a list checkbox to include | — |
| Exclude contacts list | tree-picker | No | Remove contacts that appear in both | — |
| Add contacts only with phone numbers | checkbox | No | Skip contacts without phone numbers | unchecked |

- **Statuses tab:** Default statuses are New, In work, Successfully completed, Unsuccessfully completed. Click a status bar to rename it. **Create intermediate** adds an extra status (also renamable; delete via the cross at end of the line).
- **Tooltip for an employee tab:** Free-text description and phone-conversation script in the default editor.
- **Preparation of an email to the client tab:** Letter templates for outcomes, selectable by radio button: The conversation went through / Did not answer the phone / Call back / Wrong number / Renouncement. Edit each with the default editor.
- **Buttons:** **Save** — adds the task to the call history list.

### Screen: Users (Creating and Managing Users)

- **Purpose:** Create, edit, and remove user accounts; jump to per-user rights or activity.
- **How to open:** Top-right dropdown → **Users**.
- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Username | text | No | Full = one match; fragment = contains-match | — |
| Status | dropdown | No | — | — |
| Access rights | dropdown | No | Call Center / Delivery / Additional Administrator | — |

- **Buttons:** **Search**, **Clear**, **Add user** (open Add User page), **Users** (open user-rights list), **Click History** (open Click History screen).
- **Row actions:** Click name to edit; **Cross** in last column to delete.

### Screen: Add / Edit User

- **Purpose:** Configure a single user's profile, role, rights, and per-area accesses.
- **How to open:** Users → **Add user** (new) or click a user name (edit).
- **Profile (top of page) fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| At the moment user account enabled | slider | No | Activates/deactivates rights | enabled |
| User photo | file (image) | No | Click **Change** | — |
| Role | dropdown | No | Ready-made profile; if selected, other-tab rights become unavailable | none |
| Access rights | radio | Required if no Role | Call Center / Delivery / Additional Administrator | — |
| First name | text | Yes | — | — |
| Last name | text | Yes | — | — |
| Phone number | text | No | — | — |
| Username | text | Yes | Used for login (not email) | — |
| Email | text (email) | Yes | New/changed email triggers a confirmation letter the user must click | — |
| Password | password | Yes | — | — |

- **Access rights — meaning:**
  - **Call Center** — can change status and comment on call accounts; Call Center tab becomes available.
  - **Delivery** — product shipping only; no additional tabs needed.
  - **Additional Administrator** — configurable rights; all tabs (except Call Center) available.
- **Tabs (visible depending on rights / role): Funnels, Store, Site, Newsletter, Contacts, Tasks, Courses, Reports, Affiliate program, Call center, FAQ.**
- **Funnels tab:** Single checkbox; if ticked, user can see all funnels in the account.
- **Store tab:** Access scope = all products / a category / individual product; permissions to create and edit products, work with accounts, discounts, co-authors.
- **Site tab:** Per-feature checkboxes — create/edit site pages, templates, interactive blocks, trainings, surveys, viral promotions.
- **Newsletter tab:** Checkboxes — Send emails to subscribers, Export subscribers.
- **Contacts tab:**
  - Scope = all contact lists / a category / individual list.
  - Permissions = create/edit contact lists and subscription forms, view contacts, manage call orders.
  - **Field-level rights** — per contact-card field: hide, view only, or view-and-change. Default: all fields visible and editable. Granting "all fields" includes any future fields automatically.
- **Tasks tab:** Rights for Rules and Processes.
- **Courses tab:** Edit lessons / folders / courses; check reports for all courses; or check reports of courses only.
- **Reports tab:** Sales statistics, newsletter statistics, sales-funnel customization, advertising companies, manage sales department.
- **Affiliate program tab:** Partner management and adding promotional materials.
- **Call center tab (Call Center role):**
  - Access to orders of all products / a category / individual product.
  - Access options.
  - User's payment percentage.
  - Visibility settings for orders.
- **Buttons:** **Save** — adds user to Users page.
- **Notes:**
  - A confirmation email is sent to the email; user must click the link to confirm.
  - Email shown in settings won't change until the user confirms the change ("confirmation of user's email address changing"). On first invite the displayed Email may remain the account holder's email until confirmation.
  - Common login problems: wrong login URL (correct is `https://LOGIN.influencersoft.com/shops/bills/` where LOGIN is the main admin's login); user entering email instead of username; user has not clicked the activation link.

### Screen: Teams

- **Purpose:** Group users into teams that receive auto-distributed tasks per chosen algorithm.
- **How to open (two paths):**
  - Top-right dropdown → **Users** → **Teams**.
  - Profile name → **Users** tab → **Teams**.
- **Main page elements:** **Add team**, **Filter** (by name), team rows showing team name (click to edit), team users (click avatar to open profile), and processes that create tasks for each team (click the process name to edit).
- **Add team fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Team name | text | Yes | — | — |
| Users | multi-select dropdown | Yes | Pick users to include | — |
| Tasks per user per distribution circle | number per user | No | Default 1 per user per round | 1 |
| Task-distribution principle | radio | Yes | Sequentially to all users on the team / first to users farthest from their max | — |

- **Buttons:** **Save**.
- **User team management:** In the Users list, the **Teams** field shows which teams each user belongs to (also visible in the user profile). Remove a user via the cross next to their name in the team's Edit page, or via the cross in the Teams field of their profile (clicking the empty area opens an add picker).
- **FAQ behavior:**
  - Deleting a user account removes them from every team.
  - Disabling a user account leaves them in teams but no new tasks are assigned; their name is grayed out.
  - "Farthest from max" algorithm: tasks land first on whoever has the largest gap to their per-round max, ties broken by next-largest gap, until all users equalize.

### Screen: Click History (Activities)

- **Purpose:** Audit log of which users opened which pages and when.
- **How to open:** Users → **Click History**.
- **Filter fields (at least one required):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Period of activity (from / to) | date and time | No (≥1 of all filters required) | — | — |
| Login / username | text | No | — | — |
| IP address | text | No | IP from which the login was made | — |
| Address of the page that was opened | text | No | — | — |

- **Buttons:** **Search**, **Clear**.

### Screen: Contact History (within Lead Card)

- **Purpose:** Audit trail of every change to a single contact.
- **How to open:** Lead Card → Lead history tab.
- **Tracked actions:**
  - Creating a contact.
  - Adding/removing a group.
  - Adding/removing a tag.
  - Setting / changing / deleting: name, surname, middle name, shipping index, delivery country, delivery region, city, delivery address 1 (street), delivery address 2 (house, apartment), UTC (client's current time), personal manager, additional contact fields.
  - Zapier "Add/Update Lead" changes — annotated "Zapier – Add/Update Lead" next to date and time.

### Screen: Profile — Available meeting place (Zoom integration)

- **Purpose:** Connect or disconnect the admin/employee Zoom account used for meetings.
- **How to open:** Profile (admin / employee) → **Available meeting place**.
- **Actions:**
  - **Connect Zoom** — opens Zoom sign-in / registration; after authorization, accept the agreement.
  - Status badge "Connected" appears next to the Zoom logo when integration is active.
  - **Cross (X)** next to the Zoom logo — remove integration on this InfluencerSoft account only; integrations on other accounts remain.
- **Notes:**
  - Full uninstall (all linked InfluencerSoft accounts): Zoom.us → Advanced → App Marketplace → Manage → Installed Apps → search **InfluencerSoft** → **Uninstall**.

### Screen: Meetings — Create / Edit a meeting

- **Purpose:** Define an appointment users can book; integrates with the host's connected Zoom.
- **How to open:** `Contacts → Meetings → Create a meeting` (or click an existing meeting to edit).
- **Tabs and fields:**
  - **General settings:** Name of the meeting (text, required); Person in charge (dropdown of users, required).
  - **Schedule and meeting place:** Time parameters; Meeting place (defaults to the person in charge's settings).
  - **Results:** Add / remove a meeting result; edit color and text per result.
  - **Notifications:** Sender's name (dropdown); editable notification letters to the contact.
- **Buttons:** **Save**.

### Funnel block — "Add appointment entry"

- **Purpose:** Let a meeting be booked through a funnel block.
- **Where supported (Action tab of these funnel blocks):** Opt in, Double opt in, Single opt in form, Double opt in form, Payment page, Payment form.
- **Action:** In the block editor → **Actions** tab → **Add an appointment** → pick the meeting. The end-user sees a calendar at sign-in, picks a date/time, and is shown Zoom join details. The user can download the conference file and launch Zoom.

### Tasks — Meeting requests

- **Purpose:** Manage requests that came through a funnel-attached meeting.
- **How to open:** Admin / employee account → **Tasks** section.
- **Row actions:**
  - Click the name, task number, or email of the user — opens the contact card with a Zoom join link.
  - Click the appointment status on the right — edit or delete the appointment.
- **Sync:** Meeting data is mirrored in Zoom → Conferences → Upcoming, where it can also be deleted or edited.

## Common tasks

### How do I add a new contact manually?

1. Go to `Contacts → Leads`.
2. Click **Create Contact**.
3. Enter data into the corresponding lines (all fields optional; additional lead fields appear here if defined in CRM Settings).
4. Click **Save**.

**Result:** A new contact is created.
**Gotchas:** You cannot send emails to manually added contacts via InfluencerSoft. SMS and phone calls still work.

### How do I import contacts from a CSV file?

1. Go to `Contacts → Leads → Import → CSV Import`.
2. In **Where to import**, pick the target group.
3. Upload a UTF-8 CSV file.
4. Pick the **Field delimiter**: `;`, `,`, or `\t`.
5. Choose whether to send the activation email or skip it (third-party SMTP only).
6. Click **Next**.
7. Map each CSV column to a target field; choose **Do not import** for columns to skip.
8. Leave **Do not import the first row** checked if the CSV has a header.
9. Click **Import contacts**.

**Result:** Import progresses with a counter (e.g., "8 imported, 1 failed"). Closing the window or clicking **Finish** keeps the import running in the background.
**Options along the way:**
- Activation handling — "Send activation message to new subscribers" vs. "Do not send an activation email when importing… third-party email server".
- Skip header row toggle.
**Gotchas:**
- Recommended batch ≤500 contacts.
- Low activation rate may permanently disable the account.
- Errors pause the import with a line number — fix and re-import.

### How do I import contacts via Text Import?

1. Go to `Contacts → Leads → Import → Text Import`.
2. In **Where to import**, pick the target group.
3. Paste data into **Import data**: first line is field names; lines below are values; divider `;`; dates as `YYYY-MM-DD`.
4. Optionally fill **skip automatic emails** (number of opening emails to skip).
5. Click **Import**.

**Result:** Progress bar at the bottom; subscribers may start the auto-series mid-chain if you set skip > 0.
**Options:** For data exported from InfluencerSoft, pasting only the `email` column is enough.
**Gotchas:** Filter results expire after 5 minutes — re-filter before importing or the entire database may be imported.

### How do I export contacts?

1. Use the **Filter** or tick checkboxes in the first column to choose contacts.
2. Click the **gear**.
3. Pick **Export → CSV** / **Excel** / **Plain text**.

**Result:** File is saved to the default download folder.

### How do I bulk-edit contacts?

1. Filter or select contacts via the first-column checkboxes.
2. Click the **gear → Edit**.
3. Pick the field to change: Surname / Name / Middle name / Phone / City / Description.
4. Set the new value and confirm.

### How do I add contacts to a list?

1. Filter or select contacts.
2. Click the **gear → Add to group**.
3. Tick the lists/categories to add to.
4. Click **Add to Contacts**.

### How do I remove contacts from a list?

1. Filter or select contacts.
2. Click the **gear → Delete from lists**.
3. Tick the lists/categories to remove from (a category checkbox removes from all its lists).

**Gotchas:** Full account deletion of contact data (GDPR) is not self-serve — request via support.

### How do I create a normal contact list?

1. Go to `Contacts → Lists`.
2. Click **Add**.
3. On Basic data: enter **Name** and pick a **Sender**.
4. Optionally pick a Category, edit the activation letter, set a redirect URL after unsubscribing.
5. On API: optionally specify a notification-script URL.
6. Click **Save**.

### How do I create an auto-list?

1. Go to `Contacts → Lists`.
2. Click **Auto List**.
3. On Basic data: set **Name**, choose **Automated series**, pick **Sender**, optionally set Category and unsubscribe redirect.
4. On Conditions: tick source lists/products (paid/unpaid/canceled), and/or fill **City** for location-based membership.
5. Click **Save**.

**Result:** Contacts that meet any condition are added automatically.
**Gotchas:** Contacts cannot be manually removed from auto-lists in the Lead Card → Lists tab.

### How do I create a group of inactive contacts?

1. Go to `Contacts → Lists`.
2. Click **Inactive**.
3. On Basic data: set **Name**, **Sequences** option, **Sender**, optionally Category and unsubscribe redirect.
4. On Inactivity: pick source groups; fill **Choose those who** (e.g., did not open any email, did not click even once); set **Period** (days of inactivity); tick **Enable this list** to track.
5. Click **Save**.

### How do I create a category?

1. `Contacts → Lists → Categories`.
2. Click **Add**.
3. Enter the **name of the category** (subscriber-visible).
4. Pick which lists are included (Ctrl-click to multi-select). At least one list is required to create the category.
5. Pick the **sender**; the letter footer changes with the sender.
6. Click **Save**.

### How do I rename, edit, or delete a category?

- Edit: click the category's name in the Categories table.
- Delete: click the **cross** in the last column.
- Filter to find: enter the (full or fragment of) name → **Search**; reset with **Clear**.

### How do I test an auto-series for a list?

1. `Contacts → Lists`.
2. In the list's row, click **Test**.

**Result:** Auto-series emails are sent to the test address configured in Mailing Settings.

### How do I disable an auto-series for a list?

1. `Contacts → Lists`.
2. In the list's row, drag the green **Auto-series** slider left until it turns black.

**Result:** Auto-series stops. Drag right to resume.

### How do I configure Google invisible reCAPTCHA?

1. Go to https://www.google.com/recaptcha/admin/ and log in.
2. **Label** = any name.
3. **reCAPTCHA type** = "reCAPTCHA v2" → "Invisible reCAPTCHA badge".
4. **Domains** = list every domain that hosts your forms and payment pages; include `influencersoft.com` and your delegated domain.
5. Accept the Terms of Service and click **Send**.
6. Copy **Site key** (first field) and **Secret key** (second field).
7. In InfluencerSoft, go to `Contacts → Settings → reCAPTCHA`.
8. Paste the first key into **ReCAPTCHA site key** and the second into **ReCAPTCHA secret key**.
9. Flip the **enable bar** to green.
10. Click **Save**.

**Result:** Invisible reCAPTCHA is applied to every form in the account (in-app and embedded on third-party sites).
**Gotchas:** Empty key fields keep reCAPTCHA disabled. Missing domains may break order creation on the unregistered domain.

### How do I create an additional lead field?

1. `Contacts → Settings → Additional lead fields`.
2. Click **Add Field**.
3. Fill **Field name**, pick **Type** (Integer / Fractional number / Date / Date and time / String / Text / Logical / Drop-down list / Switches), optionally set **Default value**.
4. If Type = Drop-down list, fill **Value 1**, click **Add Value** for more.
5. Click **Save**.

**Result:** Field appears on Add Lead and Lead Card.

### How do I build a subscription form?

1. `Contacts → Forms`.
2. Pick a template (or an empty one) and click **Create**.
3. Click **+Add element** and drag **Form** (already present in templates) onto the canvas.
4. In **Settings**: tick lists/categories in **Add to groups**; set **Sign up for newsletters** depending on whether you want activation emails; set **Actions** (Show message / Open link / Order product); optionally set **Delete from groups** and **Advertising tags**.
5. In **Design / Quick settings**: pick view (horizontal / vertical / In modal box); enable **Field label** if you want labels; in **Form designer** toggle fields on/off, mark **required** or **hidden**, edit descriptions.
6. In **Design settings**: configure Button, Form, Fields, Signatures (colors, borders, fonts, indents).
7. Add optional widgets via **+Add element**: Text, List, Social buttons, Indent, Image.
8. Save as template with the **star** (optional).
9. Click **Publish**, copy **JavaScript code** (linked to template) or **HTML code** (detached), and paste into the target page.

**Gotchas:**
- A hidden "Name" field defaults each contact's name to "Dear friend".
- Closing/Exit drops unsaved changes.
- Editing a template via **Edit** in My subscribe forms also edits any forms published with JavaScript code.

### How do I track form sources with tags?

1. Assign a unique tag in the form code (or order button) when creating the form.
2. Go to `Contacts → Tags`.
3. Filter by **Title tag** to find the tag.
4. Click the number in the Contacts / Subscribers / Accounts column to drill in.

### How do I create a call assignment?

1. `Contacts → Calls`.
2. Click **Create Job**.
3. On **Main settings**: set Name, Category, Responsible employee (Call Center profile), toggle Automatically assign contacts to personal manager, pick source lists in **Take contacts from these lists**, set **Exclude contacts list** if needed, tick **Add contacts only with phone numbers** to filter.
4. On **Statuses**: rename defaults (New / In work / Successfully completed / Unsuccessfully completed); click **Create intermediate** for extra statuses.
5. On **Tooltip for an employee**: add task description and phone-conversation script.
6. On **Preparation of an email to the client**: edit per-outcome letters (The conversation went through / Did not answer the phone / Call back / Wrong number / Renouncement).
7. Click **Save**.

**Prerequisite:** At least one Call Center user must exist.

### How do I deactivate or delete a call task?

- Deactivate: in the task row, drag the **Status** slider left (turns dark gray).
- Reactivate: drag right (turns green).
- Delete: click the **cross sign** in the last column.

### How do I view per-task call results?

1. `Contacts → Calls`.
2. Click a number in the **Contact / New / In process / Completed successfully / Unsuccessfully completed** column.
3. Optionally click the lead's link in the "Name and phone number" column to open the Lead Card in Call Tasks.

### How do I create a user?

1. Top-right dropdown → **Users** → click **Add user**.
2. Set the **Role** (optional ready-made profile) OR pick **Access rights**: Call Center / Delivery / Additional Administrator.
3. Fill first name, last name, phone, username (used for login), email, password.
4. If no role is set and rights are Call Center or Additional Administrator, switch through tabs (Funnels, Store, Site, Newsletter, Contacts, Tasks, Courses, Reports, Affiliate program, Call center) and tick the rights.
5. Click **Save**.

**Result:** Confirmation email is sent. The user must click the link to confirm access. Email field stays unchanged until confirmation.
**Gotchas:**
- Selecting a Role disables the other-tab rights.
- A user must log in with the username (not email) at `https://LOGIN.influencersoft.com/shops/bills/`.
- Some sub-rights only appear when the top-level checkbox is ticked.

### How do I restrict a user's per-field access on contacts?

1. Open the user (Users → click name).
2. Go to **Contacts** tab.
3. Choose scope: all lists / a category / individual list.
4. For each contact-card field, set hide / view-only / view-and-change.

**Notes:** "All fields" includes future fields automatically.

### How do I deactivate or delete a user?

- Deactivate: toggle **At the moment user account enabled** off in the user profile.
- Delete: in Users, click the cross in the last column of the row.

### How do I see user activity (Click History)?

1. Users → **Click History**.
2. Fill at least one filter: Period from/to, Login/username, IP address, or Address of the page that was opened.
3. Click **Search** (use **Clear** to reset).

### How do I create a Team and how are tasks distributed?

1. Top-right dropdown → **Users** → **Teams** (or profile name → Users → Teams).
2. Click **Add team**.
3. Enter team name; add users via dropdown; set per-user tasks per distribution circle; pick the principle (sequentially / first to user farthest from max).
4. Click **Save**.

**Gotchas:** Deleting a user removes them from every team; disabling a user keeps them in teams but suspends new task assignment (name appears grayed out).

### How do I remove a user from a team?

- In Teams → Edit the team → click the cross next to the user.
- Or open the user profile → Teams field → click the cross next to the team name.

### How do I connect Zoom?

1. Open **Profile (admin / employee)** → **Available meeting place** → click **Connect Zoom**.
2. Sign in or register at https://zoom.us/.
3. Accept the agreement.

**Result:** The Zoom logo shows "Connected" in **Time and place available for meetings**.

### How do I disconnect Zoom?

- InfluencerSoft side: Profile → **Available time and place for meetings** → click the cross to the right of the Zoom logo (only affects this account).
- Zoom side (all linked InfluencerSoft accounts): Zoom.us → Advanced → App Marketplace → Manage → Installed Apps → search **InfluencerSoft** → **Uninstall**.

### How do I create a Zoom meeting?

1. `Contacts → Meetings → Create a meeting`.
2. **General settings**: meeting name, person in charge.
3. **Schedule and meeting place**: time parameters, meeting place (defaults to person-in-charge settings).
4. **Results**: add/remove meeting results, set color/text per result.
5. **Notifications**: sender name, edit notification letters.
6. **Save**.

### How do I let users book a meeting through a funnel?

1. Open the funnel (`Funnels` section, create or edit).
2. Edit one of the supported blocks: Opt in, Double opt in, Single opt in form, Double opt in form, Payment page, Payment form.
3. Go to **Actions** tab → **Add an appointment** → pick the meeting.
4. Save the funnel.

**Result:** End users see a calendar on signing in; after picking a slot they get the Zoom join details and can launch the conference.

### How do I edit a meeting request after a user books?

1. Admin / employee account → **Tasks**.
2. Click the user's name, task number, or email to open the contact card (it includes the Zoom join link).
3. Click the appointment status on the right to edit or delete the appointment.

**Note:** Changes also propagate to Zoom → Conferences → Upcoming.

### How do I view the activation history of a contact?

1. Open Lead Card.
2. Go to **Lead history** tab.

**Result:** Every tracked change is shown with timestamp. Zapier-driven changes are tagged "Zapier – Add/Update Lead".

### How do I search for and open a Lead Card?

- From `Contacts → Leads`: filter to find the lead and click their email.
- From `Campaigns → Subscribers`: click name or email.
- From `Store → Orders`: click name or email (sometimes "No Email").

## Cross-references

- **Related section: Campaigns / Subscribers** — subscribers are activated contacts; emails are sent from there but tied to contact lists configured here.
- **Related section: Store / Orders** — orders generate contacts; order data appears in the Lead Card Orders tab and feeds the "Customer" list type filter.
- **Related section: Store / Order forms** — uses the same Form Constructor described here.
- **Related section: Tasks / Rules / Processes** — Lead Card → cogwheel "To Add" can attach the lead to a Process, list, or Rule. User rights for Rules and Processes live in the user **Tasks** tab.
- **Related section: Reports / Channels** — advertising tags placed inside form code and order buttons are tracked there.
- **Related section: Mailing Settings** — Sender dropdowns on lists, auto-lists, inactive groups, and categories pull their values from Mailing Settings; auto-series test send uses the test address there.
- **Related section: Email Series (Auto-series)** — toggled per list/auto-list/inactive group and tested from the Lists screen.
- **Related section: Zapier integration / API** — alternative contact ingestion paths; Zapier "Add/Update Lead" actions appear in Contact History.
- **Related section: Funnels** — meetings can be booked via Opt in / Double opt in / Single opt in form / Double opt in form / Payment page / Payment form blocks.

## Source articles

- [Add and Edit Categories in Contacts](https://help.influencersoft.com/hc/en-us/articles/360050400832-Add-and-Edit-Categories-in-Contacts)
- [Add and Edit Contact Auto-Lists](https://help.influencersoft.com/hc/en-us/articles/360050400392-Add-and-Edit-Contact-Auto-Lists)
- [Add and Edit Contact List](https://help.influencersoft.com/hc/en-us/articles/360050400112-Add-and-Edit-Contact-List)
- [Adding and Editing a Call Assignment](https://help.influencersoft.com/hc/en-us/articles/360051165971-Adding-and-Editing-a-Call-Assignment)
- [Adding and Editing a Group of Inactive Contacts](https://help.influencersoft.com/hc/en-us/articles/360050861631-Adding-and-Editing-a-Group-of-Inactive-Contacts)
- [Adding and Editing a User](https://help.influencersoft.com/hc/en-us/articles/360050690672-Adding-and-Editing-a-User)
- [Calling Tasks](https://help.influencersoft.com/hc/en-us/articles/360051550811-Calling-Tasks)
- [Configuring Invisible reCAPTCHA](https://help.influencersoft.com/hc/en-us/articles/360050862271-Configuring-Invisible-reCAPTCHA)
- [Contact History](https://help.influencersoft.com/hc/en-us/articles/360050397772-Contact-History)
- [Contact Lists](https://help.influencersoft.com/hc/en-us/articles/360050401352-Contact-Lists)
- [Contacts](https://help.influencersoft.com/hc/en-us/articles/360050679832-Contacts)
- [Creating and Managing Users](https://help.influencersoft.com/hc/en-us/articles/360051177251-Creating-and-Managing-Users)
- [CRM Settings](https://help.influencersoft.com/hc/en-us/articles/360051177871-CRM-Settings)
- [Form Constructor (Subscriptions and Orders)](https://help.influencersoft.com/hc/en-us/articles/360050394552-Form-Constructor-Subscriptions-and-Orders)
- [How to Add a New Lead (Contact)](https://help.influencersoft.com/hc/en-us/articles/360050677012-How-to-Add-a-New-Lead-Contact)
- [How to enable integration with Zoom for organizing meetings](https://help.influencersoft.com/hc/en-us/articles/4408979658004-How-to-enable-integration-with-Zoom-for-organizing-meetings)
- [How to Import Contacts From a CSV File](https://help.influencersoft.com/hc/en-us/articles/360050401032-How-to-Import-Contacts-From-a-CSV-File)
- [How to Track Statistics using Tags](https://help.influencersoft.com/hc/en-us/articles/360051177191-How-to-Track-Statistics-using-Tags)
- [How to view User Click History (Activities)](https://help.influencersoft.com/hc/en-us/articles/360050698292-How-to-view-User-Click-History-Activities)
- [Importing Contacts through Text Import](https://help.influencersoft.com/hc/en-us/articles/360050680012-Importing-Contacts-through-Text-Import)
- [Lead Card](https://help.influencersoft.com/hc/en-us/articles/360050399232-Lead-Card)
- [Lead Card in Call Tasks](https://help.influencersoft.com/hc/en-us/articles/360050398252-Lead-Card-in-Call-Tasks)
- [Setting Categories in Contacts](https://help.influencersoft.com/hc/en-us/articles/360050400732-Setting-Categories-in-Contacts)
- [Teams](https://help.influencersoft.com/hc/en-us/articles/360050393752-Teams-)



---


# Campaigns

## Overview

Campaigns is the InfluencerSoft area for sending email to your contact database. It covers one-time blasts (Broadcasts), drip chains tied to list subscription (Email Series), behavior-driven flowcharts (Sequences), the underlying sender, server, and template settings, the message authoring tools (default editor and Message Constructor), the subscriber database, and the deliverability stack (DKIM, SPF, DMARC, FBL, corporate mail, dedicated IP). This chapter documents every screen, tab, field, button, filter, and workflow described in the 19 source articles, plus the deliverability setup workflows that are managed jointly with InfluencerSoft Support.

## Where to find it

- Main menu: `Campaigns` (opens a submenu).
- Submenu items referenced by the source articles:
  - `Campaigns → Broadcasts` — one-time instant emails.
  - `Campaigns → Email Series` (also written as `Campaigns → Automatic` in older copy) — automatic chains.
  - `Campaigns → Sequences` — visual flowchart automations.
  - `Campaigns → Subscribers` (referred to in one article as `Mailing → Subscribers`) — subscriber database.
  - `Campaigns → Settings` — Mailing Settings (sender contacts, server, templates, etc.).
  - `Campaigns → Settings → Mailing Settings → Sender contact information` — sender list for DKIM/FBL.
  - `Campaigns → Broadcasts → Message Constructor` and `Campaigns → Email Series → Message Constructor` — drag-and-drop builder.
  - `Campaigns → Broadcasts → My templates` and `Campaigns → Email series → My templates` — saved custom templates.

## Terminology

- **Broadcast (Instant message / Instant mailing / Instant distribution):** A one-time email sent to selected subscribers at a specified date and time.
- **Email Series (Automatic chain / Auto-series / Automatic conversation):** A chain of emails and actions delivered automatically after a contact subscribes to a list, spaced by intervals from the moment of subscription.
- **Sequence:** A visual flowchart of triggers, actions, emails, and A/B branches that runs for leads on a chosen list; based on the same engine as Processes.
- **Action (in Email Series):** A non-email chain step that adds a contact to other groups and/or removes them from groups.
- **Inseparable chain:** An Email Series segment marked with a green exclamation icon so that broadcasts cannot interrupt the auto-series for that subscriber.
- **Sender / Default sender:** A confirmed corporate-domain email address added under Mailing Settings used as the From address. One sender per account is the default ("primary"), used automatically for new categories, contact groups, emails, and payment reminders.
- **Mailing Settings:** The `Campaigns → Settings` screen with six tabs that control sender contacts, main parameters, templates, server, messenger integration, and language.
- **Message Constructor:** The drag-and-drop template builder used for both Broadcasts and Email Series, with sections (categories: content, reviews, footer, products, header) and widgets.
- **Widget:** A reusable element placed inside a section in Message Constructor.
- **Section (Message Constructor):** A large reusable block (header / main content / footer area).
- **Data substitution variable (e.g., `{$ name}`):** Personalization token replaced per subscriber at send time.
- **Link for quick subscription/unsubscribe (Link to subscribe/unsubscribe):** A magic link that moves the subscriber between groups without requiring them to use a subscription form.
- **A/B Testing (Split testing / Option No.):** Two or more email variants per send; the total split always equals 100 percent.
- **Send Status (Progress bar):** Per-broadcast bar — green = Sent, gray = No recipients, white = Paused or not yet sent.
- **Send Status: message number / Email ID:** The unique numeric identifier of an instant message, used to reference it with support.
- **Auto-cleanup:** Optional setting that removes inactive subscribers who have not read 15 emails in 45 days (both conditions evaluated together depending on send frequency).
- **vCard:** Electronic business card auto-attached to outgoing emails (name, address, phone numbers, URL).
- **Test the distribution for spam:** Pre-send spam check available from the broadcast send screen.
- **Postmaster Tools / "Post Office":** Google's external monitoring console used after SPF/DMARC setup to track delivery and spam rate.
- **Corporate mail / Domain mail:** Mailbox on your own domain (e.g., `info@my_site.com`), required for use as sender because of DMARC.
- **G Suite (Google Workspace):** Google's paid business-mail bundle used to host corporate mail on a custom domain.
- **DKIM (Domain Keys Identified Mail):** Digital signature that proves the email was sent by the actual domain owner; private key on the mail server, public key in DNS as a TXT record at `default._domainkey.your_domain`.
- **SPF (Sender Policy Framework):** DNS TXT record listing servers authorized to send mail for your domain. RFC 7208.
- **DMARC (Domain-based Message Authentication, Reporting and Conformance):** DNS TXT policy at `_dmarc.your_domain` that tells receiving servers what to do when SPF/DKIM fail.
- **FBL (Feedback Loop):** Mechanism that forwards spam complaints from the receiving mail service back to the sender so InfluencerSoft can auto-unsubscribe the complainer. Used by Mail.ru, Yandex, and Google.
- **Dedicated IP:** Mail-sending IP reserved for one account, requested via support.
- **IMAP:** Mailbox access protocol (e.g., `imap.gmail.com`) used for FBL.
- **Eml-version:** Raw email file format you can supply to a mail provider when reporting a spam classification.
- **Double opt-in:** Subscription confirmed by the user clicking an activation email.

## Screens and fields

### Screen: Mailing Settings (Campaigns → Settings)

- **Purpose:** General settings that apply to every mailing — senders, defaults, templates, sending server.
- **How to open:** Main menu `Campaigns → Settings`.
- **Tabs:**
  - Sender contact information
  - Main parameters
  - Email templates
  - Email server
  - Messenger Integration
  - Language
- **Notes:** Only the first four tabs are documented in the source article; Messenger Integration and Language are listed but not detailed.

#### Tab: Sender contact information

- **Purpose:** Add and confirm the email addresses you can send From; pick the default sender; configure footer text.
- **Actions:**
  - **Add** — opens the Add sender popup.
  - Click a **Sender's name** or **Sender's email** to open the edit popup.
  - **Show advanced settings** (number 2 in source screenshot) inside the edit popup reveals all sender fields beyond the first four.
  - **Default** column — radio/marker selects which sender is primary. The primary sender is used automatically for new categories, contact groups, emails, and payment reminders.
  - A **send confirmation again** button is available for unconfirmed addresses.
- **Validation:** Sender email is checked against DMARC policy — only corporate-domain emails are allowed. Free-mail addresses (Gmail, etc.) as senders are not recommended and may be rejected.
- **Footer preview:** A live panel labeled **How footer of your email will look like** updates as you fill the sender fields.
- **Confirmation:** Unconfirmed senders cannot be used in message settings. A confirmation email is sent automatically when saving.

##### Add sender popup

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| First four fields of the form | text (assumed) | Yes | Sender contact details — exact field names not enumerated in source; required-flag stated explicitly | — |
| Advanced settings (revealed via "Show advanced settings") | mixed | No | Full set of sender contact settings — fields not enumerated in source | — |

#### Tab: Main parameters

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Address for testing messages | text (email) | not stated | Receives test sends so you can preview rendering | — |
| URL after subscription | text (URL) | No | Custom thank-you page; blank uses default InfluencerSoft page | blank |
| URL after activation | text (URL) | No | Custom post-activation page; blank uses default | blank |
| URL after cancellation | text (URL) | No | Custom unsubscribe page; blank uses default | blank |
| Show the Report Spam and Unsubscribe from the mailing buttons in the emails | checkbox | No | Adds two buttons to every outgoing email | not stated |
| Automatically add a vCard contact to the emails | checkbox | No | Appends a VCARD (name, address, phone, URL) to every email | not stated |
| Auto-cleaning subscribers who have not read 15 emails in 45 days | checkbox | No | Auto-deletes inactive subscribers. Logic: if sending is infrequent (weekly or less), 15 unopened emails in a row = inactive (45-day rule ignored); if frequent (daily), 45 days = inactive (15-email rule ignored); both must fire when in between. | not stated |
| Final email (editor) | WYSIWYG | No | The last email sent to a soon-to-be-cleaned subscriber; clicking the link in it resets their counter | InfluencerSoft default |

- **Buttons and actions:** **Save** applies the changes (referenced for the Email templates tab; same pattern implied).

#### Tab: Email templates

- **Purpose:** Configure default templates that get auto-applied to outgoing messages — including logo, social links, author photo.
- **Notes from source:** Separate templates are stored for instant vs. automatic mailings AND for HTML vs. text versions (four template slots total).
- **Editor:** Default InfluencerSoft editor.
- **Buttons and actions:** **Save** to apply.

#### Tab: Email server

- **Purpose:** Choose between InfluencerSoft's servers (default) and your own SMTP server.
- **Fields:** A toggle / selector with at least the option "other" to switch to a custom server. Once "other" is chosen, fill in all server connection fields (not enumerated in source).
- **Buttons and actions:** **Send test message button** — sends a probe; if it errors, the source recommends checking with your provider whether your sender is allowed and whether port matches encryption (SSL = port 465, TLS = port 587 for smtp.gmail.com).

### Screen: Broadcasts list (Campaigns → Broadcasts)

- **Purpose:** Manage one-time emails: create, edit, monitor status, view stats, export recipients, search.
- **How to open:** `Campaigns → Broadcasts`.
- **Capabilities of the Broadcast delivery form:**
  - Create and edit instant messages
  - Export subscribers per broadcast as .csv or excel
  - Search a specific email among those sent
  - Track delivery status
  - View per-email stats
  - Resume a previously paused email
- **Create buttons (recipient picker):**
  - **By Lists** — opens the "Sending and Editing Emails by Lists" send screen.
  - **By Activity** — opens the "Sending and Editing Email by Activity" send screen.
- **Table columns:**
  - Message Subject (clickable — opens the message for editing)
  - Opened
  - Clicks
  - Unsubscribed
  - Spam
  - Progress (delivery bar — Green = Sent, Gray = No recipients, White = Paused or not yet sent) plus the message number
  - A Play button (green button with white triangle) in the last column — re-sends a paused mailing
  - Statistics graph icon in the last column — opens Broadcasts Message Analytics for that message
- **Filter (button in the toolbar) — fields:**
  - **Message Number** — must be entered in full to match.
  - **Message subject** — full text matches one email; a fragment matches any message containing that fragment.
  - **Show Drafts** checkbox — displays unsent drafts.
  - **Search** button applies filter.
  - **Clear** button (reached by clicking **Filter** again, then **Clear**) restores the full list.
- **Export button:** Opens an export popup.

#### Export popup (Broadcasts)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Email number | text (number) | Yes | Identifies the broadcast | — |
| Action criteria | dropdown | Yes | Options: "The subscriber has opened the email"; "The subscriber has opened the email but did not click"; "The subscriber did not open the email"; "The email was clicked on"; "The email was sent to spam" | — |
| Unload format | radio | Yes | Options: .csv; .xls; Plain text | — |

### Screen: Sending and Editing Emails by Lists (Broadcast → By Lists)

- **Purpose:** Send an instant message to selected subscriber groups from CRM.
- **How to open:** Click **By Lists** from the Broadcasts list.
- **Tabs:** Main settings; Restrictions; Additional settings.
- **Notes:** "Even though the tool is called 'instant messaging,' there can be a certain time lag depending on the number of recipients. The actual time of receiving a message depends on the recipient's mailbox."

#### Tab: Main settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Date and time of sending | date+time | Yes | Schedule future send; "Send" then holds and dispatches at that time | — |
| Group(s) of contacts | tree picker | Yes | Navigate categories via blue folder; select via checkbox (blue tick = selected); checkbox on a category selects all groups in it | — |
| Send on behalf | dropdown | Yes | Confirmed senders from Mailing Settings — Sender contact information | — |
| Subject of the email | text | Yes | Subject line shown in inbox | — |
| Email Format | radio | Yes | Options: HTML; plain text. Plain text disables formatting tools but guarantees uniform rendering; HTML enables WYSIWYG editor and HTML markup mode | — |
| Message body | WYSIWYG | Yes | Default InfluencerSoft editor | — |
| Subscriber name button | action | — | Inserts the `{$ name}` variable | — |
| Link to subscribe/unsubscribe variable | action | — | Inserts the quick-subscribe magic link | — |
| Option number title | collapsible | — | Click to minimize/expand an A/B variant | — |
| Add option button | action | — | Adds another A/B variant; total split always equals 100% (e.g., 2 = 50/50; 3 = 33/33/34) | — |

- **Buttons and actions:**
  - **Preview** — shows how the message will look to the subscriber.
  - **Test** — sends a test email to the address you specify.
  - **Save** — pauses the email. To send, go to the Broadcasts page and click the submit button (Play triangle).
  - **Send** (referenced on the Activity send form; implied here too) — initiates immediate or scheduled send.

#### Tab: Restrictions

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Only signed with … (date) | date | No | Suppresses subscribers who already received earlier content before this date | — |
| Exclude by Groups | checkbox list | No | Subscribers in any ticked group will not receive this email | — |

#### Tab: Additional settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| count followed links from the message | checkbox | No | Enables/disables click-through tracking; required for "passed/did not click" follow-ups via Send by Activity | not stated |
| Personal redirect page after unsubscribing | text (URL) | No | Custom unsubscribe landing | blank |

### Screen: Sending and Editing Email by Activity (Broadcast → By Activity)

- **Purpose:** Send a one-time message to subscribers based on how they engaged with prior emails.
- **How to open:** Click **By Activity** from the Broadcasts list.
- **Tabs:** Main settings; Restrictions; Additional settings; Testing the distribution of spam.

#### Tab: Main settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Date and time of sending | date+time | Yes | As with By Lists | — |
| Activity parameter | dropdown / radio | Yes | "The email was opened: All selected emails OR any of the selected emails"; "The email was not opened: All / any"; "Subscriber clicked on the link in the email: In all / In any"; "Subscriber did not click on the link in the email: In all / In any" | — |
| Email selection grid | multi-select | Yes | Blue background = selected; white = not selected. Default shows last 5 emails. **Show 5** button loads the next 5 in reverse chronological order | last 5 |
| Send on behalf | dropdown | Yes | Confirmed senders | — |
| Subject of the email | text | Yes | Subject line | — |
| Email Format | radio | Yes | HTML or plain text (same rules as By Lists) | — |
| Message body | WYSIWYG | Yes | Default editor | — |
| Subscriber name button | action | — | Inserts `{$ name}` | — |
| Link for subscribing or unsubscribing | action | — | Inserts magic link | — |
| Option Number title | collapsible | — | Toggles A/B variant | — |
| Add option button | action | — | Adds A/B variant; total = 100% (2 variants = 50/50; 3 = 33/33/34) | — |

- **Buttons:** **Preview**; **Test**; **Send** (begins immediately or at scheduled time); **Save** (pauses; resume from Broadcasts).

#### Tab: Restrictions

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Only signers with … | date | No | Suppress old recipients | — |
| Exclude by Groups | checkbox list | No | Excludes selected groups | — |

#### Tab: Additional settings

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| count followed links from the message | checkbox | No | Click tracking on/off | not stated |
| Personal redirect page after unsubscribing | text (URL) | No | Custom unsubscribe page | blank |

#### Tab: Testing the distribution of spam

- **Purpose:** Pre-send spam scan. (Tab listed in source; specific fields not enumerated.)
- **Notes:** Source unclear: only the tab name is given; specific field set not documented.

### Screen: Broadcasts Message Analytics

- **Purpose:** Detailed per-broadcast statistics.
- **How to open:** Click the statistics graph in the last column of the Broadcasts table.
- **Top section:** Cumulative stats for the whole period.
- **Clickable links (drill-down to Subscribers form filtered by that action):** Opened; Not Opened; Clicked; Have not clicked; Unsubscribed; Errors; Spam.
- **Email ID link:** Opens the editor for that instant message.
- **Send a message link:** Creates a new instant message on activity, pre-targeted at subscribers who performed the selected action.
- **Graph controls:**
  - Type-of-graph dropdowns (graph type — values not enumerated in source)
  - Calendar — pick the period
  - **Display** button — render the graph

### Screen: Email Series list (Campaigns → Email Series)

- **Purpose:** Manage automatic chains attached to a contact group.
- **How to open:** `Campaigns → Email Series` (or `Campaigns → Automatic` in older labels).
- **Filter popup (appears when chains exist):**
  - **Interval date from / to** — calendar range.
  - **Contact group** — pick the chain's list.
  - **Title** — text fragment in event title.
  - **Show deleted events** — checkbox.
  - **Advertising tab** of the filter — filter by Channel, Source, Campaign, Ads, Keys, with a radio for first vs. last click.
  - **Search** button applies; **Filter → Clear** resets.
- **Main table per chain event:**
  - Inseparable-chain toggle (gray exclamation = off, green = on)
  - Event name (clickable — opens edit form)
  - Statistics columns for emails: Done, Open, Clicks, Unsubscribe, Spam
  - Statistics column for actions: Done
  - Copy button (last-column action) — duplicates an email
  - Statistics button — opens Analytics of Automatic Email
  - Delete button (cross icon) — removes event after OK confirmation
- **Top-of-window buttons:** Add an email; Add an action. (Exact button names not enumerated; the source says "buttons" plural for emails and actions.)

### Screen: Add / Edit / Copy Email Series

- **Purpose:** Author, modify, or duplicate an auto-series email. Pages are identical except for the page title.
- **How to open:** From Email Series list, click the add-email button, click the event name, or click Copy in the last column.
- **Tabs:** Main settings; Restrictions; Additionally.

#### Tab: Main settings (Email Series)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Contact group | dropdown | Yes | The group the chain runs for | — |
| Sequence number of the email | number | Yes | Position in chain | — |
| Interval from subscription | duration | Yes | Time after opt-in before sending; recommended **0 minutes** for the first email | — |
| Send on behalf | dropdown | Yes | Confirmed senders | — |
| Subject of the Email | text | Yes | Inbox header | — |
| Email Format | radio | Yes | HTML or plain text (same trade-offs as Broadcasts) | — |
| Message body | WYSIWYG | Yes | Default editor | — |
| Subscriber name button | action | — | Inserts `{$ name}` | — |
| Link for quick subscription/unsubscribe button | action | — | Inserts the magic link | — |
| Option No. title | collapsible | — | Toggle an A/B variant | — |
| Add option button | action | — | Add A/B variant; total = 100% (2 = 50/50; 3 = 33/33/34) | — |

#### Tab: Restrictions (Email Series)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Time interval for sending | time range | No | Hours of day during which the email may be sent — uses Moscow time, no time-zone adjustment | — |
| Days of the week | checkboxes | No | Which weekdays sending is allowed | — |
| Exclude by Groups | checkbox list | No | Subscribers in any ticked group will not receive this email | — |

- **Notes:** Don't restrict the first email of an auto-series — subscribers may think prior emails didn't reach them.

#### Tab: Additionally (Email Series)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| count links from the message | checkbox | No | Click tracking; required to send follow-up activity broadcasts based on "passed / did not pass by reference" | not stated |
| Personal redirect page after unsubscribe | text (URL) | No | Custom unsubscribe landing | blank |

- **Buttons:** **Save** — returns you to the Email Series page.

### Screen: Analytics of Automatic Email

- **Purpose:** Per-event analytics for a specific auto-chain email.
- **How to open:** Click the **Statistics** button in the last column of the Email Series table.
- **Header link:** Click the email number to open the auto-mail edit form.
- **Clickable drill-down links (to Subscribers form):** Opened; Not opened; Clicked; Not Clicked; Unsubscribed; Errors; Spam.
- **Graph controls:**
  - Dropdown: type of graph — **open** or **clicks**.
  - Dropdown: degree of detail — **hours** or **days**.
  - Calendar for the period.
  - **Show** button — renders graph.

### Screen: Sequences list (Campaigns → Sequences)

- **Purpose:** List of automation flowcharts.
- **How to open:** `Campaigns → Sequences`.
- **Top controls:** **Filter** button; **Add a sequence** button.
- **Table per sequence:**
  - Sequence name (clickable to edit)
  - Number of activated sequences (per row)
  - Number of leads in the sequence
  - Number of leads with finished sequences
  - Enable/disable slider — Green = enabled, Black = disabled
  - Delete button (X) — confirmation required; deletion is permanent and wipes all info

### Screen: Add a sequence (popup)

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Sequence name | text | Yes | Display name | — |
| List of leads (target list) | dropdown | Yes | Subscribers list that joins this sequence | — |
| Run frequency | radio | Yes | Options: "one time" (sequence runs once per lead); "any number of times" (re-runs every time trigger fires, e.g., resubscribe); "any number of times if not in progress" (blocks re-entry while a previous run is still active) | — |

- **Buttons:** **Save**.

### Screen: Sequence editor (flowchart)

- **Purpose:** Build the visual chain of triggers, emails, actions, and A/B branches.
- **How to open:** Click the sequence name in the Sequences list.
- **Starting block:** Auto-generated — represents "subscribed to list (group)"; cannot be deleted or edited.
- **Available block types (from documented cases):**
  - Email blocks (e.g., "Warm email #1") — authored via Email Composer / Visual Editor; configure delays and restrictions as with Email Series.
  - Triggers: "Visited page" (with optional URL or promo-tag link parameters); "Order processing" (with delays).
  - Branches: A/B testing splits.
  - Task block — creates a task for call-center; can have multiple exits (e.g., "Call back later," "Offer another product").
  - Outcome: remove a lead from a list and finish.
- **Behavior:** Blocks holding leads display a count on their outputs.
- **Notes:** Sequence management mirrors Processes management. The starting trigger of a sequence is the Subscribers list selected at creation and is fixed.

### Screen: Message Constructor

- **Purpose:** Drag-and-drop builder for HTML messages used by Broadcasts and Email Series.
- **How to open:** From the message authoring view, click **Message Constructor**, then **Choose a template** to pick a starting template, then **Create email**.
- **Editor layout:**
  - Editor occupies half the screen.
  - Bottom-left: **page settings**.
  - Bottom-right: **adding new elements** — labeled **Add element**.
- **Page structure:** Header, main content, footer — each accepts sections; each section accepts widgets.
- **Add element panel tabs:** SECTIONS (categories: content, reviews, footer, products, header); WIDGETS.
- **Drag behavior:** Drop targets highlight as a blue area (section) or blue line (widget).
- **Selecting an element:** Right-click a section to select it; click any element to expose its settings on the right.
- **Widget styling:** Each widget has ready-to-use styles. The Text widget supports separate desktop and mobile indent values.
- **Variables:** In the Text widget, click the brackets icon to open the variable picker; click a variable to insert it.
- **Buttons / icons:**
  - **Star** icon in the settings panel — save as custom template.
  - **Save email** — saves edits when modifying an existing custom template.
- **Save-as-template popup fields:** template name; description; cover image for computer; cover image for smartphone.

### Screen: My templates (Custom templates list)

- **Purpose:** Browse, edit, or delete custom templates you saved.
- **How to open:** `Campaigns → Broadcasts → My templates` or `Campaigns → Email series → My templates`.
- **Per-template actions:** **View** — opens the template, then choose **Edit** or **Delete**. After editing, click **Save email**.
- **Use a custom template when creating a new message:** Choose the **My templates** tab in the template chooser, pick your template.

### Screen: Subscribers (Campaigns → Subscribers)

- **Purpose:** Browse, filter, export, re-group, and bulk-unsubscribe contacts.
- **How to open:** Main menu — source says "select the Mailing list in the main menu, and then the subsection Subscribers." (Treat this as `Campaigns → Subscribers`.)
- **Capabilities:** View totals (unique, activated, new); per-subscriber row info (mailing address, mailing lists, autograph count, partner binding, tag, advertising channel); delete a single subscriber (dagger icon in last column); view reason-for-unsubscribe; bulk add to group; bulk unsubscribe; export.
- **Per-row click:** Subscriber address opens the contact card (located under `Store → Accounts`) with: Contact Information; Account; Calls; Activity in emails; Fixed manager.
- **Gear icon menu:** Export (with format choice); **Add to group**; **Group unsubscribe**.

#### Filter (Subscribers)

- **Primary fields:** subscriber address; contact groups; date of subscription; tag; additional client info.
- **Left-side menu** expands additional sub-tabs (Partnership; Advertising; Status and activity; Other).

##### Partnership tab

- Filter subscribers attached to a specific partner. (Fields not enumerated in source.)

##### Advertising tab

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Channel | dropdown / text | No | Advertising channel | — |
| Source | dropdown / text | No | Source | — |
| Advertising company | dropdown / text | No | Campaign name | — |
| Ad | dropdown / text | No | Ad | — |
| Keywords | text | No | Keywords | — |
| First / last click | radio | No | Match by first or last click | — |

##### Status and activity tab

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Status | dropdown | No | Options: Any; Activated; Signed; Unsubscribed; Waiting for activation; Canceled by the service; Only new ones | Any |
| Activity | checklist | No | Opened / did not open all or at least one message; Clicked / did not click on links in all or at least in one message; Delivery errors; Unsubscribed | — |
| Existing / non-existent subscribers | toggle | No | Restrict to one or the other | — |

##### Other tab

- Filter subscribers by city / territory (only populated when city was captured at subscription or order).

- **Filter buttons:** **Search** applies; **Filter → Clear** resets.

#### Gear menu actions

- **Export:**
  - Pick export format from the dropdown; report generation starts.
  - Progress bar; when green, the file downloads automatically to the default downloads folder.
  - Export honors current filters — clear the filter to export everyone.
- **Add to group:**
  - In the popup, pick the target group.
  - Adds all currently filtered subscribers to that group.
- **Group unsubscribe:**
  - **Email** field — paste the address list (typically copied from a prior export).
  - Checkboxes — pick which mailings to unsubscribe from.
  - **Unsubscribe** button — executes.

### Screen: G Suite (Google Workspace) signup

- **Purpose:** Create a domain-based business mailbox at Google to use as your sender.
- **How to open:** External — `https://gsuite.google.com/intl/com/features/`.
- **Flow (fields collected by Google):**
  - Step 1: Click **Get started**, then **Next** on the 14-day trial card.
  - Step 2: Business info — company name; number of employees → **Next**.
  - Step 3: Country of registration; company phone → **Next**.
  - Step 4: Your email → **Next**.
  - Step 5: Domain — choice between **Yes, I have one I can use** and **No, I need one**. If yes, type domain → **Next** → confirm ownership → **Next**. If no, search for a new domain; buy if available.
  - Step 6: Admin info — first name, last name → **Next**.
  - Step 7: Login info — login + password → **Next**. (Login becomes `<login>@your-domain.com`.)
  - Step 8: CAPTCHA → **Agree and create account**.
  - Step 9 (post-signup): **Start** → **Add an employee** form — enter name + desired username, click **Add** per employee, tick **all emails are created**, **Next**, optionally provide each employee's old email to send credentials.
- **Domain verification:** Follow Google's instructions; tick every step; **Verify domain and set up email** enables when complete.
- **Notes:** Trial is 14 days; G Suite must be paid for thereafter. Once mail is live, add the address as a sender via Mailing Settings.

### Screen: Add DKIM (external — InfluencerSoft Support workflow)

- **Purpose:** Sign outgoing mail with DKIM so receiving servers can verify your domain.
- **How to open:** Email `support@influencersoft.com`. Subject: "Configure the DKIM signature." Body must include:
  - Your login
  - All emails listed in Mailing Settings → Sender contact information that need DKIM
  - The domain of each email
- **Resulting DNS TXT record (example provided by support):**
  - Host: `default._domainkey`
  - Type: TXT
  - Value: `"v=DKIM1; k=rsa; s=email; p=<your_unique_key>"`
- **Verification:** Use `https://toolbox.googleapps.com/apps/dig/#TXT`; enter `default._domainkey.your_domain.com`.
- **Notes:** Setup takes 1 to 2 days up to a week (manual by InfluencerSoft programmers). DNS propagation can take up to 24 hours. To check after the fact, send a test from your account; the receiving inbox should show the DKIM signature and your domain.

### Screen: Configure SPF and DMARC (external — InfluencerSoft Support workflow)

- **Purpose:** Add DNS-based authentication and a receiver policy.
- **How to open:** Email `support@influencersoft.com`. Subject: "Configure SPF and DMARC." Body must include:
  - Your domain
  - Mail address for SPF (must be on that domain — must be a new mailbox not used for outgoing mail, since it will receive bounce data)
  - IMAP server
- **DNS entries received from support:**
  - SPF record: `your.site IN TXT "v=spf1 a mx ~all"`
  - DMARC record: `_dmarc.my_site.com IN TXT "v=DMARC1; p=reject; sp=reject; adkim=relaxed; aspf=relaxed"`
- **Notes:** Setup takes 1 to 3 working days. Never send mail from an additional domain once SPF is configured for another — contact support if that happens.

### Screen: Configure FBL (external — Postmaster + IMAP + InfluencerSoft Support)

- **Purpose:** Auto-unsubscribe contacts who hit the SPAM button.
- **Prerequisite:** DKIM already configured.
- **Step A — Google Postmaster (for Google FBL):**
  - Sign up at `https://postmaster.google.com`.
  - Enter your domain.
  - Verify ownership by adding a DNS TXT or DNS CNAME record.
- **Step B — Configure IMAP on a dedicated mailbox:** Create a new mailbox specifically for FBL (existing inboxes have all messages auto-deleted by the service).
  - In Gmail: **Settings** → **Settings** → **IMAP access**: tick **IMAP enabled** → Save Changes.
  - IMAP server for Gmail: `imap.gmail.com`.
- **Step C — Email InfluencerSoft Support with:**
  - Address of your IMAP server
  - Login for the FBL email (often the same as the email address, sometimes different)
  - Password for the FBL mailbox (e.g., `fbl@your_site.com`)
- **Notes:** Without FBL set up, the service's default FBL is used and your subscribers can be auto-unsubscribed without your involvement.

### Screen: Set up Digital Signatures (overview workflow)

- **Purpose:** Roadmap for the full deliverability stack.
- **Recommended order:**
  1. Own domain (recommended registrar: GoDaddy).
  2. Corporate mail on that domain.
  3. Dedicated IP — request via `support@influencersoft.com`; subject "Providing a dedicated IP for mailings"; body must state tariff (e.g., Guru) and login. Provisioning: 1 to 5 working days.
  4. DKIM signature — see DKIM screen. Can be requested in parallel with dedicated IP. Provisioning: 1 to 3 working days.
  5. SPF and DMARC — see SPF/DMARC screen. Provisioning: 1 to 3 working days.
  6. Monitoring — connect Postmaster Tools ("Post Office") at Gmail.
  7. FBL — see FBL screen.

## Common tasks

### How do I add a new sender email I can send From?

1. Open `Campaigns → Settings → Sender contact information`.
2. Click **Add**.
3. In the popup, fill the first four required fields (sender details on your corporate domain).
4. Optionally click **Show advanced settings** for the full set of footer / contact fields. Watch the **How footer of your email will look like** panel update.
5. Click **save**.
6. Open the confirmation email InfluencerSoft sends to that address and click the activation link. If lost, click **send again** in the sender list.

**Result:** The sender appears in the **Send on behalf** dropdowns for Broadcasts, Email Series, and Sequences.
**Options along the way:** Mark the sender as the **Default** by selecting its radio in the Default column.
**Gotchas:** Sender domain must satisfy DMARC — free-mail providers (Gmail, etc.) will likely be rejected. Use only your corporate domain. Unconfirmed senders cannot be selected.

### How do I change the default sender?

1. Open `Campaigns → Settings → Sender contact information`.
2. In the **Default** column, click the radio next to the sender you want as primary.

**Result:** The new default is auto-applied to new categories, contact groups, emails, and payment reminders.

### How do I switch to my own SMTP server for outgoing mail?

1. Open `Campaigns → Settings → Email server`.
2. Select **other** in the server option.
3. Fill all SMTP fields (host, port, login, password, encryption — exact field names not enumerated in source).
4. Click **Send test message button**.

**Result:** Auto-chain, funnel, and other outgoing email is routed through your server.
**Gotchas:** If the test fails, check with your provider whether the sender is allowed and that the port matches encryption — for smtp.gmail.com use port 465 with SSL or port 587 with TLS.

### How do I create a one-time email to all subscribers on a list?

1. `Campaigns → Broadcasts`.
2. Click **By Lists**.
3. On **Main settings**, pick date and time. Navigate categories via the blue folder icons; tick the boxes for one list, several, or a whole category.
4. Pick **Send on behalf**, type **Subject of the email**, pick **Email Format** (HTML or plain text), write the body.
5. Insert personalization with **Subscriber name** (inserts `{$ name}`) or the **Link to subscribe/unsubscribe** variable.
6. (Optional) Click **Add option** to add A/B variants. Total split equals 100%.
7. On **Restrictions**, optionally set **Only signed with …** date and tick groups under **Exclude by Groups**.
8. On **Additional settings**, tick **count followed links from the message** if you want click tracking. Optionally set a **Personal redirect page after unsubscribing**.
9. Click **Preview** to review. Click **Test** to send yourself a sample.
10. Click **Send** to dispatch immediately or at the scheduled time, or **Save** to keep it paused.

**Result:** If sent, the broadcast goes out; if saved, it appears as a draft (visible in Broadcasts when **Show Drafts** is ticked) and can be sent later via the Play button.
**Gotchas:** "Instant" can lag depending on recipient count. Plain text disables formatting tools entirely.

### How do I email people who clicked (or didn't click, or opened, or didn't open) a previous email?

1. `Campaigns → Broadcasts → By Activity`.
2. On **Main settings**, pick send date/time.
3. Choose an **Activity parameter** — opened / not opened / clicked / not clicked, with the "all selected emails" vs. "any of the selected emails" sub-option.
4. From the email grid, select source emails (blue background = selected). Use **Show 5** to load older emails in batches of five.
5. Fill **Send on behalf**, **Subject of the email**, **Email Format**, body.
6. Insert variables as needed; optionally **Add option** for A/B testing.
7. Set **Restrictions** and **Additional settings** as desired. Optionally open **Testing the distribution of spam**.
8. **Send** to dispatch immediately, or **Save** to keep paused.

**Gotchas:** Click-based targets only work if the source emails had click tracking enabled.

### How do I resume a paused broadcast?

1. `Campaigns → Broadcasts`.
2. Find the row — its Progress bar will be white.
3. Click the green Play triangle in the last column.

**Result:** The saved message is sent.

### How do I export the subscribers who reacted (or didn't) to a specific broadcast?

1. `Campaigns → Broadcasts`.
2. Click **Export**.
3. Enter the **Email number**.
4. From the dropdown pick: "The subscriber has opened the email" / "...opened the email but did not click" / "did not open the email" / "the email was clicked on" / "the email was sent to spam".
5. Pick a format radio: **.csv**, **.xls**, or **Plain text**.
6. Confirm.

**Result:** File is generated and downloaded.

### How do I filter the Broadcasts list?

1. Click **Filter**.
2. Enter the full **Message Number** (must be complete), or part of the **Message subject**.
3. Optionally tick **Show Drafts**.
4. Click **Search**.

**Result:** Table shows matches. To reset, click **Filter** again and click **Clear**.

### How do I view detailed analytics for one broadcast?

1. `Campaigns → Broadcasts`.
2. Click the statistics graph icon in the last column of the broadcast row.

**Result:** Broadcasts Message Analytics opens. Click **Opened**, **Not Opened**, **Clicked**, **Have not clicked**, **Unsubscribed**, **Errors**, or **Spam** to drill into the Subscribers form filtered by that action. Click the Email ID link to edit the message. Click **Send a message** to create a follow-up activity broadcast pre-targeted at those subscribers. Pick a graph type via the dropdown, set the period via the calendar, click **Display**.

### How do I create or edit an auto-series email?

1. `Campaigns → Email Series`.
2. If the filter pop-up appears, set criteria or click **Clear**, then proceed.
3. To add: click the add-email button at the top. To edit: click the event's name. To duplicate: click **Copy** in the last column.
4. On **Main settings**, pick the contact group, sequence number, and **interval from subscription** (use 0 minutes for the first email).
5. Pick **Send on behalf**, **Subject of the Email**, **Email Format**, write the body.
6. Insert variables via **Subscriber name** or **Link for quick subscription/unsubscribe**. Optionally **Add option** for A/B variants.
7. On **Restrictions**, optionally pick allowed time-of-day, allowed days of the week, and **Exclude by Groups**.
8. On **Additionally**, tick **count links from the message** for click tracking. Optionally set a **personal redirect page after they unsubscribed**.
9. Click **Save**.

**Result:** Returns to the Email Series page. The email runs automatically for new subscribers after the configured interval.
**Gotchas:** Send-time restrictions use Moscow time with no time-zone correction. Avoid restricting the first email — subscribers will think prior messages didn't reach.

### How do I add a non-email action step (add/remove to other groups) to an Email Series?

1. `Campaigns → Email Series`.
2. Click the add-action button at the top of the window.
3. Configure which groups to add the contact to and/or remove them from.
4. Save.

**Result:** The action runs in chain order alongside other events.

### How do I make sure a key auto-series email is not interrupted by my broadcasts?

1. `Campaigns → Email Series`.
2. In the left column, click the gray exclamation icon next to each event that should be protected. The icon turns green and adjacent events join an "inseparable chain."

**Result:** Subscribers in those steps will not receive instant messages until they exit the protected segment. Useful for a sales sequence.

### How do I delete one event from an Email Series?

1. Click the cross icon in the right column of the event's row.
2. Click **OK** in the confirmation.

### How do I open detailed analytics for one auto-series email?

1. `Campaigns → Email Series`.
2. Click the **Statistics** button in the last column of the email's row.

**Result:** Analytics of Automatic Email opens. Click **Opened**, **Not opened**, **Clicked**, **Not Clicked**, **Unsubscribed**, **Errors**, or **Spam** to drill into the matching subscriber list. Click the email number in the header to open the auto-mail edit form. Use the type-of-graph dropdown (open or clicks), the detail dropdown (hours or days), and the calendar; click **Show**.

### How do I create a Sequence (visual automation)?

1. `Campaigns → Sequences`.
2. Click **Add a sequence**.
3. Type a **Sequence name** and choose the **List of leads** that triggers the sequence.
4. Pick **Run frequency**: "one time" / "any number of times" / "any number of times if not in progress".
5. Click **Save**.
6. Click the new sequence's name to open the editor.
7. From the starting block (auto-generated for the list subscription), build the chain: drop email blocks (configured like Email Series emails), triggers (Visited page with URL/promo-tag filters, Order processing with delays), A/B branches, and Task blocks (with multiple exit labels such as "Call back later" or "Offer another product").

**Result:** The sequence runs for each lead joining the chosen list, gated by the run-frequency choice.
**Gotchas:** The starting trigger (Subscribers list) is fixed at creation — it cannot be deleted or edited. Deleting a sequence wipes all info.

### How do I disable a Sequence without deleting it?

1. `Campaigns → Sequences`.
2. Slide the toggle on that row. Green = enabled, Black = disabled.

### How do I delete a Sequence?

1. Click the X on the sequence's row.
2. Confirm.

**Gotcha:** All information about the sequence is removed.

### How do I build a message in Message Constructor?

1. From the message authoring view in Broadcasts or Email Series, click **Message Constructor**.
2. Click **Choose a template**.
3. Pick a template (or switch to the **My templates** tab for a custom one).
4. Click **Create email**.
5. In the editor, click **Add element** (bottom-right).
6. From the SECTIONS tab pick a category (content, reviews, footer, products, header) and drag the section into the message — drop targets highlight blue.
7. Right-click a placed section to select it. From the WIDGETS tab, drag widgets in — drop targets highlight as a blue line.
8. Click any element to expose its styling on the right panel. For the Text widget, set separate desktop and mobile indents in the widget settings.
9. To personalize, place a Text widget, click the brackets icon, and click a variable to insert.
10. (Optional) Click the **star** icon to save as a custom template — name it, describe it, upload a computer cover image and a smartphone cover image, save.
11. Save the email.

**Result:** A reusable template (if you saved one) appears under **My templates** for future Broadcasts and Email Series messages.

### How do I edit or delete a saved custom template?

1. Go to **My templates** under either `Campaigns → Broadcasts` or `Campaigns → Email series`.
2. Click **View** on the template.
3. Choose **Edit** or **Delete**.
4. After editing, click **Save email**.

### How do I let an employee edit email templates?

1. From the drop-down menu in the upper right of your account, go to **Employees**.
2. Open the employee's profile.
3. In the **Site** tab, tick **Create new pages on sites**.
4. (Optional) Untick the other boxes if you only want template + page editing.

### How do I find and act on subscribers?

1. `Campaigns → Subscribers`.
2. Open **Filter**. Set subscriber address, contact groups, subscription date, tag, or extra client info.
3. Open additional tabs as needed:
   - **Partnership** — filter by attached partner.
   - **Advertising** — filter by Channel, Source, Advertising company, Ad, Keywords; pick first or last click.
   - **Status and activity** — pick a Status (Any, Activated, Signed, Unsubscribed, Waiting for activation, Canceled by the service, Only new ones) and/or Activity (opened/not opened all or at least one message; clicked/not clicked links; delivery errors; unsubscribed); pick existing or non-existent.
   - **Other** — filter by city.
4. Click **Search**.

**Result:** The table filters to matches.
**Options along the way:**
- Click a subscriber's address to open the contact card (`Store → Accounts`) with Contact Information, Account, Calls, Activity in emails, Fixed manager.
- Click the dagger icon in the last column to delete one subscriber.
- Click the gear and choose **Export**, **Add to group**, or **Group unsubscribe** to act on the filtered set.

### How do I export the current subscriber list?

1. After filtering, click the gear icon.
2. Choose **Export**, then pick a format from the dropdown.

**Result:** Progress bar appears; when green, the file auto-downloads to the default downloads folder.
**Gotcha:** Export respects filters — clear them first to export everyone.

### How do I bulk-move subscribers between groups?

1. Filter the Subscribers list to the people you want to move.
2. Click the gear icon → **Add to group**.
3. Pick the destination group → confirm.

### How do I bulk-unsubscribe people?

1. Filter the Subscribers list and **Export** to get a clean address list.
2. Open the file on your computer and copy the addresses.
3. Click the gear icon → **Group unsubscribe**.
4. Paste the addresses in the **Email** field.
5. Tick the mailings to remove them from.
6. Click **Unsubscribe**.

### How do I create a G Suite account so I can use a domain-based sender?

1. Visit `https://gsuite.google.com/intl/com/features/` and click **Get started**.
2. Click **Next** to accept the 14-day trial.
3. Enter business name and employee count → **Next**.
4. Pick country and phone → **Next**.
5. Enter your email → **Next**.
6. Pick **Yes, I have one I can use** (type domain → **Next** → confirm ownership → **Next**) or **No, I need one** (search → buy if available).
7. Enter admin first and last name → **Next**.
8. Set login + password → **Next**.
9. Tick CAPTCHA → **Agree and create account**.
10. If not redirected, open `https://admin.google.com/accountchooser?consumerAccountUsed=true`, click **Add an account**, sign in.
11. Click **Start** → fill the employee form: name + username → **Add** per employee → tick **all emails are created** → **Next** → optionally enter each employee's old email to send credentials.
12. Follow Google's domain-ownership instructions; tick every step → click **Verify domain and set up email**.
13. Pay for G Suite before the 14-day trial ends.
14. Add the new domain address to InfluencerSoft via Mailing Settings → Sender contact information.

### How do I set up the DKIM signature for my domain?

1. Create the mailbox you want to use as sender on your domain (recommended names: `mail@`, `help@`, `support@`, `info@`, `firstname.username@`; avoid dashes, dots, underscores, and names like `no-reply`).
2. Email `support@influencersoft.com` from that address. Subject: "Configure the DKIM signature." Body: your login; every sender email under Mailing Settings → Sender contact information that needs DKIM; the domain of each.
3. Wait for support's reply containing the TXT record (format: `default._domainkey IN TXT "v=DKIM1; k=rsa; s=email; p=<your_key>"`).
4. Add the record to your DNS host. Enter the value **without quotes** in the Value field.
5. Verify at `https://toolbox.googleapps.com/apps/dig/#TXT` — enter `default._domainkey.your_domain.com` and click anywhere; the response should show your entry.
6. Reply to support that the record is published. Support enables DKIM on their side.
7. Verify by sending an email from the configured sender — the receiving inbox should show "DKIM" as the signature type and your domain.

**Gotchas:** DNS changes can take up to 24 hours to propagate. DKIM setup is manual at InfluencerSoft and typically takes 1 to 2 days, sometimes up to a week. After DKIM, set up FBL next.

### How do I set up SPF and DMARC?

1. Create a separate new mailbox on your domain for SPF (it will receive bounce traffic from bad addresses) — must not be used for sending.
2. Email `support@influencersoft.com`. Subject: "Configure SPF and DMARC." Body: domain; SPF mailbox on that domain; IMAP server.
3. Wait for support's reply with the SPF TXT record (e.g., `your.site IN TXT "v=spf1 a mx ~all"`). Add it in DNS.
4. Reply that the SPF record is in DNS. Support activates SPF on their side and sends the final DMARC record.
5. Add the DMARC TXT record (e.g., `_dmarc.my_site.com IN TXT "v=DMARC1; p=reject; sp=reject; adkim=relaxed; aspf=relaxed"`).
6. Connect Postmaster Tools at Gmail.

**Gotchas:** Setup takes 1 to 3 working days. Never send mail from a second domain once SPF is configured for one — contact support if you need to.

### How do I set up FBL for my domain?

1. Confirm DKIM is already configured.
2. Sign up at `https://postmaster.google.com`, add your domain, verify ownership via DNS TXT or CNAME.
3. Create a new mailbox on your domain dedicated to FBL (existing inboxes will have messages auto-deleted by the service).
4. Enable IMAP on that mailbox. For Gmail: **Settings** → **Settings** → in **IMAP access** tick **IMAP enabled** → Save Changes. Server: `imap.gmail.com`.
5. Email `support@influencersoft.com` with: your IMAP server address, login for the FBL mailbox (often the same as the email), password.

**Result:** Subscribers who hit SPAM in supported services (Mail.ru, Yandex, Google) are auto-unsubscribed from your database.
**Gotcha:** If FBL is not configured, the service's default FBL is used and subscribers can be removed without your involvement.

### How do I get a Dedicated IP?

1. Email `support@influencersoft.com`. Subject: "Providing a dedicated IP for mailings." Body must include your tariff (e.g., Guru) and login.

**Result:** Dedicated IP is provisioned in 1 to 5 working days. Can be requested in parallel with the DKIM request.

### What's the full sequence to harden deliverability?

1. Own your domain (recommended registrar GoDaddy).
2. Create corporate mail on it.
3. Request a Dedicated IP via support.
4. Request DKIM via support (in parallel with step 3).
5. Configure SPF and DMARC via support.
6. Connect Postmaster Tools ("Post Office") at Gmail for monitoring.
7. Configure FBL via Postmaster + IMAP + support.

### What should I do if my emails go into spam?

1. Read and apply the Recommendations for Maintaining Mailings (see related screen).
2. Contact the receiving mail service's support (Gmail, Yahoo, etc.) — InfluencerSoft Support cannot fix reputation with a third-party provider.
3. Ask the mail provider for the exact reason for spam classification, then fix it.
4. After fixing, ask the provider to unblock your mailings.
5. If your emails are blocked outright (don't even land in spam), open a ticket with InfluencerSoft technical support requesting the mail log. Include: type of distribution (instant or automatic); unique email number (visible in the Progress column under `Campaigns → Broadcasts` — labeled in older copy as `Newsletters → Instant`); date and time sent (automatic distribution); the recipient address that didn't receive it.
6. Support responds within 1 to 2 working days with log instructions.
7. When approaching the receiving mail service, document your white-mailing practices: double opt-in pages, segmentation, header samples, corporate sending domain.
8. If Gmail is the issue: try automatic resolution first; otherwise submit `https://support.google.com/mail/contact/bulk_send_new?rd=1`.
9. Attach the eml-version of the spammed email if you have one.

### How do I use the pre-send spam test?

1. While composing on either the By Lists or By Activity send screen, use the **Test the distribution for spam** function (tab is listed on the By Activity send screen).
2. If a hit is detected:
   - Change one word in the subject; re-test.
   - Change another word; re-test.
   - Remove one sentence at a time; re-test.
3. Also send to a separate group of 12–15 real mailboxes you registered at Gmail, Yahoo, etc., set up with default user settings.

**Result:** Identifies whether the issue is content-driven (semantics) or infrastructure-driven (reputation / DNS).

### How do I keep my mailings out of spam in the first place?

Apply the Recommendations for Maintaining Mailings, summarized:
- Deliver what the subscription page promised.
- Don't exceed one email per day to the same group without good reason; optimal cadence is three times per week down to once per month.
- Be careful with reciprocity / cross-promotion of unrelated offers.
- Keep style consistent over time; don't spike volume or change sending IP suddenly when migrating providers.
- Segment the database — by survey and by quick subscribe/unsubscribe links.
- Clean inactive subscribers using auto-cleanup (15 in 45 days) and the auto-group of inactive contacts.
- Keep the Unsubscribe and Report as SPAM buttons visible — they route complaints to InfluencerSoft instead of the mail provider.
- Subject lines should identify the sender ("Our daily mailing from …").
- Include a sender-disclosure block at top and bottom of the email explaining why the recipient is hearing from you.
- Personalize with `{$ name}`.
- Write more than 500 characters of HTML; never send only-image emails.
- Avoid stop-words and stop-formatting: test, free, gift, bonus, 100%, discount, etc.; no `<$>`; no triple exclamation marks; limit CAPS, bold, underline; avoid bright spam colors `#FF0000`, `#0000FF`, `#00FF00`.
- No URL shorteners (Goo.gl, Bit.ly, J.mp, tinyurl.com).
- No more than two domains or three links in one email; system links in the InfluencerSoft footer don't count.
- Don't link to domains on stop-lists — check at `http://ipaddress.com/ip_lookup`, `http://whatismyipaddress.com/blacklist-check`, `http://mxtoolbox.com/blacklists.aspx`.
- HTML: no ActiveX, JavaScript, VBScript, frames, iframes.
- Write content in the InfluencerSoft editor or Notepad — don't paste from Word, Evernote, or Google notepad.
- Don't paste emojis from social networks or the web.
- Use only domain mail as sender.
- For web/HTML programmers: avoid classes and complex positioning; lay out on tables; specify protocols on every URL (http://, https://, mailto://); pick image-embedding strategy based on need (external = fast but may need permission; inline = always shown but heavy; data URI = always shown but size-limited and may fail on Gmail; font images = scalable but device-dependent); test on many devices and mailers.
- Always run pre-send spam tests when blasting.

## Cross-references

- **Contacts / Lists** — Sender choice, segmentation, group exclusion, and Sequences all reference subscriber groups managed under Contacts.
- **Processes / Automation** — Sequences are managed like Processes; "sequence management is like Processes management." See the Automation chapter.
- **Surveys** — A recommended segmentation method ("Segmentation through a survey") referenced from the Recommendations article.
- **Pages / Page Builder** — Message Constructor follows the same principles as the Template Designer / Page Builder for site pages. The employee permission to edit email templates lives under the **Site** tab in employee profiles.
- **Store → Accounts** — Clicking a subscriber's address from Subscribers opens the contact card located under Store → Accounts.
- **Funnels** — Auto-chain emails and Sequences interact with funnel logic; Mailing Settings → Email server affects email sent from funnels.
- **Domain binding** — Setting up sender domains references the "How to bind your own domain or subdomain" article (separate chapter).
- **LMS** — A linked video guide on how to set up your sender email lives under the LMS (`/lms/course/1025/module/2247/lesson/5133/`).

## Source articles

- [Add, Edit, and Copy Email Series](https://help.influencersoft.com/hc/en-us/articles/360050385272-Add-Edit-and-Copy-Email-Series)
- [Analytics of Automatic Email](https://help.influencersoft.com/hc/en-us/articles/360051550871-Analytics-of-Automatic-Email)
- [Broadcasts Message Analytics](https://help.influencersoft.com/hc/en-us/articles/360050385472-Broadcasts-Message-Analytics)
- [Configuring FBL for Your Domains](https://help.influencersoft.com/hc/en-us/articles/360050384772-Configuring-FBL-for-Your-Domains)
- [Configuring the Digital Signature of DKIM](https://help.influencersoft.com/hc/en-us/articles/360050848191-Configuring-the-Digital-Signature-of-DKIM)
- [Configuring the SPF Record and DMARC Policy](https://help.influencersoft.com/hc/en-us/articles/360050385032-Configuring-the-SPF-Record-and-DMARC-Policy)
- [Creating a G Suite Account for Your Business Mail](https://help.influencersoft.com/hc/en-us/articles/360050848231-Creating-a-G-Suite-Account-for-Your-Business-Mail)
- [Creating Corporate Mail on Your Domain](https://help.influencersoft.com/hc/en-us/articles/360050848251-Creating-Corporate-Mail-on-Your-Domain)
- [Email Broadcasts](https://help.influencersoft.com/hc/en-us/articles/360050848431-Email-Broadcasts)
- [Email Sequences](https://help.influencersoft.com/hc/en-us/articles/360050848551-Email-Sequences)
- [Email Series](https://help.influencersoft.com/hc/en-us/articles/360050848451-Email-Series)
- [How to setup your business Email (Mailing Settings)](https://help.influencersoft.com/hc/en-us/articles/360050848471-How-to-setup-your-business-Email-Mailing-Settings)
- [Message Constructor](https://help.influencersoft.com/hc/en-us/articles/360050848491-Message-Constructor)
- [Recommendations for Maintaining Mailings](https://help.influencersoft.com/hc/en-us/articles/360050848271-Recommendations-for-Maintaining-Mailings)
- [Sending and Editing Email by Activity](https://help.influencersoft.com/hc/en-us/articles/360050385632-Sending-and-Editing-Email-by-Activity)
- [Sending and Editing Emails by Lists](https://help.influencersoft.com/hc/en-us/articles/360050848511-Sending-and-Editing-Emails-by-Lists)
- [Set up Digital Signatures](https://help.influencersoft.com/hc/en-us/articles/360050385192-Set-up-Digital-Signatures)
- [Subscribers](https://help.influencersoft.com/hc/en-us/articles/360050850591-Subscribers)
- [What Should I Do if My Emails Go Into Spam?](https://help.influencersoft.com/hc/en-us/articles/360050848311-What-Should-I-Do-if-My-Emails-Go-Into-Spam)



---


# Automation

## Overview

The Automation section configures actions InfluencerSoft performs on contacts in response to events. It is used to segment contacts, run sales funnels, assign work to employees or call-center operators, and chain together emails, tags, list memberships, and API calls without manual intervention. The area is built around three primitives — Processes (multi-step contact journeys), Rules (single trigger-to-action mappings), and Tasks (assignments to a person or department) — that share triggers and actions. The rest of this chapter documents every screen, field, trigger, action, condition, and workflow exposed in these four articles.

## Where to find it

- Top menu: `Tasks → Processes`
- Top menu: `Tasks → Automatic rules`
- Top menu: `Automation → Task` (subsection where tasks are listed and created manually)
- From a contact: `Contacts → Lead → open lead card → cogwheel icon → Add to process`
- From an order or lead card: `Tasks` tab inside the card (add a new task or view existing)

## Terminology

- **Process** — A configurable, multi-step chain of triggers, actions, and conditions executed on a contact when an event occurs.
- **Rule (Automatic rule)** — A single trigger paired with one or more actions; simpler than a Process and not multi-step.
- **Trigger** — An event that happens to a contact (tag applied, order paid, page visited, etc.) that causes a Process or Rule to start, or causes the next step inside a Process to run. Multiple triggers on a step follow "OR" logic — any of them fires the step.
- **Action** — What happens to the contact after a trigger fires (add tag, send email, POST/GET request, end of process, etc.).
- **Condition** — A branching step in a Process: either a **Filter** (one or more conditions evaluated as all/any) or an **A/B Test** (probabilistic split).
- **Filter (Process condition)** — Branches the process into a "Yes" path and a "No" path based on contact data.
- **A/B Test** — Splits contacts across two or more variant branches by configurable percentages.
- **Branching** — Multiple actions, conditions, or triggers configured to run simultaneously from a single step.
- **Added to process** — The default trigger present on every new process, used to add a contact manually from a Lead card.
- **End of process** — The terminating action; required at the end of every chain so the process registers as "Done" for the contact.
- **Task** — An assignment to an employee, additional administrator, call-center operator, or Department, either created manually or generated by a Process action. Has a type, dates, status, and a result.
- **Type (of task)** — A reusable label for tasks (e.g. "call" by default); renameable, with assignable icon and color.
- **Done** — In Rules, a log of every executed action; in Tasks, one of the terminal results a manager can pick.
- **Auto-list** — A dynamically-populated list used inside Process filters (e.g. "unpaid orders by one product"). Created in Contacts; referenced here as a filter parameter.
- **POST/GET request** — An action that calls an external HTTPS endpoint with available parameters when the trigger fires.
- **Custom field value changed** — A trigger that fires when a contact's additional field value changes.
- **Sender's contact** — The "from" identity selected on a Send email action.

## Screens and fields

### Screen: Processes list

- **Purpose:** Lists every Process in the account and exposes create, filter, enable/disable, and delete controls.
- **How to open:** `Tasks → Processes`.
- **Fields:** Each row in the list shows:

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Process name | text | yes | Set when the process is created; defaults to `Process (Date/Time)`. Never shown to customers or subscribers. | `Process (Date/Time)` |
| Triggers | number (read-only) | — | Count of triggers configured on the process. | — |
| Contacts in the process | number (read-only) | — | Count of contacts currently inside the process. | — |
| Done | number (read-only) | — | Count of contacts for which the process completed. | — |
| On/Off | toggle | — | Green = on, black = off. Disables the process without deleting it. | on (after creation) |
| Delete | button (cross icon) | — | Removes the process and all its information after confirmation. | — |

- **Buttons and actions:**
  - `Filter` — opens filter controls for the process list.
  - `Add process` — creates a new process and opens the Process editor.
  - Process-name link — opens the Process editor for that process.
  - Toggle slider — enables or disables.
  - Cross icon — deletes after confirmation.

### Screen: Process editor

- **Purpose:** Builds and edits the trigger/action/condition flow that defines a process.
- **How to open:** From the Processes list, click `Add process` (for new) or click the name of an existing process.
- **Fields / top-bar controls:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Process name | text | yes | Click the name to rename; click `Save` to commit. Defaults to `Process (Date/Time)`. | `Process (Date/Time)` |
| Show statistics | toggle button | — | When active, surfaces per-step repetition counts and the `Filter` button. | off |
| Filter | button (conditional) | — | Appears only after `Show statistics` is on; filters the statistics view. | — |
| Process status | button | — | Enables/disables the process from inside the editor. | — |
| Setting (cogwheel) | button | — | Opens process settings; used to rename the process. | — |
| Save | button | — | Persists changes. When saving a running process, prompts how to handle in-flight sessions. | — |
| Exit from editing process | button | — | Closes the editor. | — |

- **Canvas controls:**
  - Each block (trigger/action/condition) can be dragged to a new position to lay out the visualization.
  - `+` (plus sign) below any block opens a chooser for the next step type: Action, Condition, or Trigger.
  - `+` on the right of a trigger row adds an additional trigger to the start.
  - A step can be branched — multiple actions, conditions, or triggers can be configured to execute simultaneously from the same step.

### Screen: Add trigger (Process)

- **Purpose:** Configures an event that adds a contact to a process (top level) or moves a contact to the next step (downstream).
- **How to open:** Inside Process editor, click `+` on the right side of the triggers row, or `+` below a step and choose Trigger.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Trigger name | text | — | A human-readable label for the trigger. | — |
| Trigger event | dropdown | yes | One of: `Tag applied`, `Tag removed`, `Subscribed to list`, `Added to list`, `Removed from list`, `New order`, `Paid order`, `Cancelled order`, `Refund by order`, `Activated subscription`, `New leads`, `Visited page`, `Opened an email`, `Custom field value changed`. Plus the always-on `Added to process` trigger present on every new process by default. | — |
| Repetitions | toggle / option | — | One repetition for one contact, or infinite repetitions for one contact. | — |
| Trigger condition | configurable | — | Per-event condition (e.g. which list, which tag, which page URL). | — |
| Additional condition | configurable | — | Secondary filter applied to the trigger. | — |
| Go to the next step | dropdown (downstream triggers only) | — | `when the trigger is triggered`, or `when the trigger is triggered or wait time is finished` with a wait duration (e.g. 10 days). Lets a contact advance even if the event never occurs. | — |

- **Notes:**
  - Multiple triggers on the same step follow `OR` logic.
  - The `Added to process` trigger lets you add a contact manually from a Lead card via `cogwheel → Add to process`.
  - `Visited page` example settings: `Visited URL`, `Without parameters` (counts visits with and without ad tags), and the page address.

### Screen: Add action (Process)

- **Purpose:** Configures what happens to a contact when a preceding trigger fires.
- **How to open:** Inside Process editor, click `+` below a step and choose Action.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Action name | text | — | Editable label for the block. | — |
| Action type | dropdown | yes | One of: `Add tag`, `Delete tag`, `Add to list`, `Remove from list`, `Send email`, `POST/GET request`, `Change contact field value`, `Task`, `End of process`. | — |
| Repetitions toggle | toggle | — | Off (black background) = action runs every time the contact reaches it. On (green) = action runs only once for the contact. | off |
| Execution time | dropdown | — | `after done the previous`, `after done the previous one through`, `after done the previous on date`. | `after done the previous` |
| Days of the week | multi-select (when applicable) | — | Active only with `after done the previous one through`. E.g. limit to Monday–Friday. | — |
| Time window | time range (when applicable) | — | Active only with `after done the previous one through`. E.g. 08:00–21:00. | — |
| List | dropdown | conditional | Required for `Add to list` / `Remove from list`. | — |
| Tag | dropdown | conditional | Required for `Add tag` / `Delete tag`. | — |
| Additional condition | configurable | — | Per-action filter — e.g. do not send an email to contacts in a certain list. | — |

- **Notes:**
  - Every chain in the process must terminate with `End of process`; otherwise the contact is "stuck" and the process never registers in `Done`, and the contact cannot re-enter the process.
  - `End of process` is editable via the pencil icon — you can set a new name and a block color.

### Screen: Send email action (Process)

- **Purpose:** Sends an email to the contact as a step inside a process.
- **How to open:** Inside Process editor, add an Action and pick `Send email`.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Block name | text | — | Editable label. | — |
| Repetitions | toggle | — | Off (black) = sends every time contact reaches the action. On (green) = sends only once per contact. | off |
| When to send | option | — | As soon as contact reaches the step, a few days after the previous step, or on a specific date. | — |
| Sender's contact | dropdown | yes | Identity from which the message is sent. | — |
| Message subject | text | yes | Email subject line. | — |
| Letter body | WYSIWYG (visual editor) | yes | The email content. | — |
| Additional condition | configurable | — | E.g. skip if contact is in a certain list. | — |

- **Buttons and actions:**
  - `Preview` — evaluates and tests the email before saving.

### Screen: Add condition (Process)

- **Purpose:** Branches the process flow based on contact data (Filter) or a probabilistic split (A/B Test).
- **How to open:** Inside Process editor, click `+` below a step and choose Condition.
- **Tabs / subscreens:**
  - **Filter** — see fields below.
  - **A/B Test** — see fields below.

#### Filter condition fields

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Match mode | option | yes | Whether all conditions or any one condition must be met to pass the filter. | — |
| Condition(s) | repeating row | yes | One or more conditions (e.g. `Total amount paid — greater or equal to — 50,000`, `Tags – matches – Lesson1`). Options: not enumerated in source. | — |
| Additional condition | configurable | — | Secondary filter. | — |
| Yes branch | sub-step | yes | The action/condition/trigger to run if the filter passed. | — |
| No branch | sub-step | yes | The action/condition/trigger to run if the filter failed. | — |

#### A/B Test condition fields

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Variants | repeating row | yes | Branches the process can take. | two variants |
| Percentage per variant | number (%) | yes | Sets distribution; editable any time (e.g. 50/50 → 100/0). Total must cover 100%. | 50/50 |
| Branch contents | sub-step per variant | yes | The chain that runs for contacts assigned to that variant. | — |

- **Notes:**
  - Changing A/B percentages does not require reconfiguring the process — analytics are preserved.

### Screen: Task action settings (inside Process)

- **Purpose:** Generates a Task automatically when the process step is reached.
- **How to open:** Inside Process editor, add an Action and pick `Task`.
- **Fields:** Same scheduling controls as other actions (`after done the previous`, days of week, time window). Plus task-specific configuration (type, assignee, scenarios for outcomes). The source states the standard settings apply and that scenarios such as "Done" and "Failed" exist by default but more can be added — additional fields are not enumerated in source.
- **Notes:**
  - At least two default outcomes exist: `Done` and `Failed`. Any number of additional outcome scenarios can be added; each can drive further process steps.

### Screen: Process running-edit confirmation

- **Purpose:** Prompt shown when saving edits to a running process.
- **How to open:** Save (`Save`) a process that is already running.
- **Fields / choices:**
  - For contacts currently sitting on a step that has been deleted: pick one of the `End of process` actions to apply.
  - For contacts not on a deleted step: choose `continue the process execution` or apply `End of process`.

### Screen: Process run-frequency setting

- **Purpose:** Controls how many times a process may run for a single contact.
- **How to open:** In the Process editor (per-process scope).
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Run frequency | option | yes | `once`, `any number of times simultaneously`, `any number of times not simultaneously`, or `any number of times, if not started` (the last option restricts re-entry to contacts for which the process has finished). | — |

### Screen: Rules list (Automatic rules)

- **Purpose:** Lists all automatic rules and exposes create, filter, enable/disable, and delete controls.
- **How to open:** `Tasks → Automatic rules`.
- **Fields per row:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Rule name | text | yes | Set when the rule is created; never visible to clients or subscribers. | — |
| Trigger number | number (read-only) | — | Count of triggers configured on the rule. | — |
| Enable/Disable | toggle | — | Green = enabled, black = disabled. | on (after creation) |
| Delete | button (cross) | — | Removes the rule and its information after confirmation. Deleted rules and their info cannot be restored. | — |

- **Buttons and actions:**
  - `Filter` — filters the rules list.
  - `Add rule` — opens the rule editor.

### Screen: Rule editor

- **Purpose:** Configures a single trigger-to-action rule.
- **How to open:** From Rules list click `Add rule`, or click an existing rule's name.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Rule name | text | yes | Human-readable, hidden from contacts. | — |
| Trigger event | dropdown | yes | One of: `Added to list`, `Removed from list`, `Tag applied`, `Tag removed`, `Activated subscription`, `Created order`, `Paid order`, `Refund by order`, `New leads`, `Start lesson`, `Got access to the lesson`, `Custom field value changed`. | — |
| Action type | dropdown | yes | One of: `Add to list`, `Remove from list`, `To tag`, `Remove tag`, `Set custom field`, `POST/GET request`. | — |
| POST/GET URL | text (https) | conditional | Required for `POST/GET request`. Endpoint URL must be HTTPS. | — |
| Transmitted parameters | reference | — | List of available parameters surfaced by clicking the curved-brackets icon inside the POST/GET action. | — |
| Repetition mode | option | yes | `Any number of times` or `Once per lead`. | — |

- **Notes:**
  - Triggers on a rule follow `OR` logic (any matching event fires the action).
  - When a rule adds a contact to a list, the list does not inherit previous promo tags for analytics purposes; promo tags appear only if the contact later generates an order or subscribes to another list.

### Screen: Rule "Done" log

- **Purpose:** Shows every executed action for the rule and lets you export or move contacts.
- **How to open:** Click the executed-action count on the Rules list.
- **Fields per row:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Date and time | datetime (read-only) | — | When the action fired. | — |
| Contact details | read-only | — | First, last, and other names; phone; email. | — |
| Rule and trigger | read-only | — | Formula: `Rule name — reason for execution` (e.g. "Super-VIP rule triggered by the payment of Order Number by Product"). | — |
| Action | read-only | — | What the trigger did (e.g. added to "Super-VIP" list, assigned VIP tag). | — |
| Status | icon | — | Green check = executed; red check = not executed. A rule is not executed if the same action was already applied manually or automatically earlier. | — |

- **Buttons and actions:**
  - Gear icon → `Export to CSV` — exports the contacts on which the action ran.
  - `Add to group` — moves selected contacts to a group. Unlike a transfer initiated from Contacts/Subscribers, this transfer re-fires applicable rules for the moved contacts.

### Screen: Rule "Done" filter

- **Purpose:** Search the Done log for specific contact actions.
- **How to open:** `Filter` button inside the Done log.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Rule | multi-select | — | One or more rules; empty = search all rules. | empty |
| Date of done from | date | — | Start of period. Can be left empty if only an end date is needed. | — |
| Date of done to | date | — | End of period. Can be left empty if only a start date is needed. | — |
| Search by lead info | text | — | Last, first, or patronymic name, phone number, or email address. Enter only one parameter — the search is not done across all parameters simultaneously. | — |

### Screen: Tasks subsection (main page)

- **Purpose:** Lists all tasks (manual and process-generated), with status counters and management buttons.
- **How to open:** `Automation → Task`.
- **Top-bar fields:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Total task count | number (read-only) | — | Overall number of tasks. | — |
| Status counters | number (read-only) | — | Counts by status: `opened`, `closed`, `overdue`. | — |

- **Buttons and actions:**
  - `Create a task` — opens the manual task creation flow.
  - `Types` — opens the Types of tasks editor.
  - `Filter` — opens the task filter.

- **Row display rules:**
  - Pink row = expired task.
  - Green row = task due today.
  - White row = task due in the future.
  - Process-generated tasks appear in the same list.
  - Chief admin sees all tasks; employees see only tasks assigned to them.

### Screen: Create a task (manual)

- **Purpose:** Manually create a task to assign to an employee or department.
- **How to open:** `Automation → Task → Create a task`, or from a Lead card or Order card → `Tasks` tab → add task.
- **Fields:** Source does not enumerate the full field list, but a task minimally has a type, description, dates, an assignee (employee or Department), and (after execution) a result. Comments can be added. Field labels beyond these are not enumerated in source.

### Screen: Types of tasks

- **Purpose:** Manage the catalog of task types available in manual creation and in process Task actions.
- **How to open:** Tasks subsection → `Types` button.
- **Fields per type:**

| Field | Type | Required | Description / Allowed values | Default |
|---|---|---|---|---|
| Name | text | yes | Renameable label (e.g. "call" by default). | `call` (the default type) |
| Icon | picker | — | Choose the type's icon. | — |
| Color | picker | — | Choose the type's color. | — |
| Order | drag handle | — | Reorder types in the list. | — |

- **Notes:** Newly created types are immediately available in Task actions inside Processes.

### Screen: Task filter

- **Purpose:** Find tasks by parameters or combinations of parameters.
- **How to open:** Tasks subsection → `Filter`.
- **Searchable parameters:**
  - Task number
  - Task name
  - Type
  - Date assigned (range)
  - Date generated (range)
  - Date executed (range)
  - Manager in charge
  - Status
  - Result
  - Employee who generated the task

### Screen: Task edit (inside lead/order card)

- **Purpose:** Edit or delete an existing task.
- **How to open:** Click the task number, task description, or object on the Tasks list to open the lead card; click the task status; click `Edit`.
- **Editable fields:**
  - Task type
  - Description
  - Dates
  - Assignee (reassign to a different employee)
- **Notes:** Only the Chief admin can edit tasks.

- **Delete:** Click the cross to the right of the task description on the Tasks list, or delete from within task editing in the lead card.

### Screen: Employee task view

- **Purpose:** Lets an assigned employee work the task.
- **How to open:** Employee opens a task from the Tasks list.
- **Fields / actions inside a task:**
  - Comment field (employee can comment).
  - Result picker — default options include `Done` and `Failed`; any custom outcomes configured on the source action also appear here.

## Common tasks

### How do I create a new Process?

1. Open `Tasks → Processes`.
2. Click `Add process`.
3. The Process editor opens with a default name `Process (Date/Time)` and the `Added to process` trigger already enabled.
4. Click the process name, enter a new name, click `Save`.
5. Click `+` on the right of the triggers row to add a starting trigger. Pick the event from the dropdown.
6. Configure trigger settings (name, repetitions, trigger condition, additional condition).
7. Click `+` below the trigger to add a step. Choose `Action`, `Condition`, or `Trigger`.
8. Configure each block. End every chain with the `End of process` action.
9. Click `Save`.

**Result:** The process appears in the Processes list, enabled (green toggle), with the configured trigger count.
**Options along the way:** At step 7 you can branch — adding two or more parallel actions/conditions/triggers off the same step. See `Screen: Process editor`.
**Gotchas:** A chain without `End of process` will not register in the `Done` counter, and contacts on that chain will be "stuck" — preventing re-entry into the process.

### How do I add a contact to a process manually?

1. Go to `Contacts → Lead`.
2. Open a contact's lead card by clicking the email.
3. Click the cogwheel icon.
4. Select `Add to process`.

**Result:** The contact enters the process via the always-on `Added to process` trigger.

### How do I rename a process?

1. Open the process in the Process editor.
2. Click the process name (or the cogwheel `Setting` button).
3. Enter the new name.
4. Click `Save`.

**Result:** New name appears in the Processes list. Customers and subscribers never see this name.

### How do I make a process branch?

1. In the Process editor, click `+` below the step you want to branch from.
2. Add multiple blocks (actions, conditions, or triggers) at the same level.

**Result:** All branched blocks execute simultaneously for any contact that reaches the parent step.

### How do I add a condition that splits "Yes" and "No" paths?

1. Click `+` below a step in the Process editor; choose Condition.
2. Pick `Filter`.
3. Choose whether all or any conditions must be met.
4. Add one or more conditions (e.g. `Total amount paid — greater or equal to — 50,000`).
5. Optionally add an additional condition.
6. Under the Yes branch, add the action/condition/trigger to run when the filter passes.
7. Under the No branch, add the action/condition/trigger to run when it fails.
8. Save.

### How do I set up an A/B test inside a process?

1. Click `+` below a step in the Process editor; choose Condition.
2. Pick `A/B Test`.
3. Configure the variants (default 50/50).
4. Build the sub-chain inside each variant.
5. To change the split later (e.g. shift to 100/0 based on results), edit the percentage values on the variants — no reconfiguration of the process is needed; analytics are preserved.

### How do I schedule an action on specific days and times?

1. In the action's settings, set `Execution time` to `after done the previous one through`.
2. Pick the days of the week (e.g. Monday–Friday).
3. Pick the time window (e.g. 08:00–21:00).

**Result:** The action runs only during those days/hours after the previous step completes.

### How do I configure a trigger so the process advances even if the event never happens?

1. Open a downstream (non-first-level) trigger.
2. In `Go to the next step`, select `when the trigger is triggered or wait time is finished`.
3. Set the wait duration (e.g. 10 days).

**Result:** Contact advances when the trigger fires OR after the wait time elapses. (Source example: customers with unpaid orders begin receiving the mailout again after 10 days.)

### How do I send an email from inside a process?

1. Add an Action; choose `Send email`.
2. Set repetitions (toggle on for once-only, off for every time).
3. Choose `When to send`: immediately, a few days after the previous step, or a specific date.
4. Pick a Sender's contact.
5. Enter `Message subject`.
6. Write the letter in the visual editor.
7. Optionally click `Preview` to test.
8. Optionally add an additional condition (e.g. skip contacts in a certain list).
9. Save.

### How do I control how many times a process runs for the same contact?

1. In the Process editor, open the run-frequency setting.
2. Select one of: `once`, `any number of times simultaneously`, `any number of times not simultaneously`, or `any number of times, if not started`.

**Gotchas:** With re-entry enabled, a contact still inside the process won't be re-added unless `any number of times, if not started` is chosen and the prior session has completed.

### How do I edit a running process?

1. Click the process name in the Processes list to open the editor.
2. Make changes.
3. Click `Save`.
4. In the running-edit confirmation, decide what to do with in-flight sessions:
   - For contacts on a deleted step: pick which `End of process` action to apply.
   - For contacts not on a deleted step: choose `continue the process execution` or `End of process`.

### How do I disable a process?

1. Open `Tasks → Processes`.
2. On the target row, slide the green toggle to the left (black = off).

**Result:** Process stops firing but is not deleted.

### How do I delete a process?

1. Open `Tasks → Processes`.
2. Click the `cross` next to the process.
3. Confirm.

**Result:** Process and all its "Done" information are deleted.

### How do I view process statistics inside the editor?

1. In the Process editor, activate `Show statistics`.
2. The `Filter` button appears; each block shows the number of repetitions per contact and the count of times the block has executed.
3. Use this view to identify steps where contacts are stuck and tune the funnel.

### How do I create a new Rule?

1. Open `Tasks → Automatic rules`.
2. Click `Add rule`.
3. Enter a rule name.
4. Add a trigger and pick the trigger event from the dropdown.
5. Add one or more actions (see action types list).
6. For `POST/GET request`, set the script URL (HTTPS required) and reference available parameters via the curved-brackets icon.
7. Pick repetition: `Any number of times` or `Once per lead`.
8. Save.

**Gotchas:** A rule will not execute its action if the resulting state already exists for the contact (e.g. contact is already in the target list). Status appears as a red check in the Done log.

### How do I edit an existing Rule?

1. Open `Tasks → Automatic rules`.
2. Click the rule's name. The editor opens in edit mode.

### How do I disable a Rule?

1. Open `Tasks → Automatic rules`.
2. Toggle the slider next to the rule (green = enabled, black = disabled).

### How do I delete a Rule?

1. Open `Tasks → Automatic rules`.
2. Click the cross next to the rule and confirm.

**Gotchas:** Deleted rules and their information cannot be restored.

### How do I review what a Rule has done?

1. From the Rules list, click the executed-action count for that rule.
2. The Done log opens, showing date/time, contact details, the rule and trigger, the action executed, and a green/red status check per row.

### How do I find a specific contact's executed actions?

1. Open the Done log.
2. Click `Filter`.
3. Optionally select one or more `Rule` values.
4. Optionally set `Date of done from` and/or `Date of done to`.
5. Enter exactly one search parameter under `Search by lead info` (last/first/patronymic name, phone, or email).
6. Apply the filter.

### How do I export contacts a Rule acted on?

1. Open the Done log for the rule.
2. Click the gear icon.
3. Select `Export to CSV`.

### How do I move contacts from the Done log to a group?

1. Open the Done log.
2. Use `Add to group`.

**Gotchas:** Unlike moving contacts from the Contacts or Subscribers section, moving from the Done log re-fires applicable rules on the moved contacts.

### How do I create a Task manually?

- From the Tasks subsection: `Automation → Task → Create a task`.
- From a contact: open the Lead card → `Tasks` tab → add a new task.
- From an order: open the Order card → `Tasks` tab → add a new task.

### How do I create a Task automatically inside a Process?

1. In the Process editor, click `+` below a step; choose Action.
2. Pick action type `Task`.
3. Configure the task's type and assignee. Configure scheduling under the standard action settings (`after done the previous`, `after done the previous one through` with days/time, or `after done the previous on date`).
4. Optionally add outcome scenarios beyond the default `Done` and `Failed`.
5. Save.

**Result:** When a contact reaches the step, a task is generated for the assigned manager or department. The result the manager picks can drive subsequent process steps.

### How do I manage Task types?

1. Open `Automation → Task`.
2. Click `Types`.
3. Rename existing types, set an icon, choose a color, drag to reorder.
4. New types automatically become available in the Task action inside Processes.

### How do I filter the Tasks list?

1. Open `Automation → Task`.
2. Click `Filter`.
3. Combine any of: task number, name, type, dates (assigned/generated/executed), manager in charge, status, result, employee who generated.

### How do I edit or reassign a Task?

1. Open the Tasks list; click the task number, description, or object to open the lead card.
2. Click the task status.
3. Click `Edit`.
4. Change the task type, description, dates, or assignee.

**Gotchas:** Only the Chief admin can edit tasks.

### How do I delete a Task?

- From the Tasks list: click the cross to the right of the task description.
- From a lead card: open task editing and delete from there.

### How does an employee close a Task?

1. Employee opens the task from the Tasks list.
2. Inside the task (or the lead/order card), add a comment if needed.
3. Pick a result. Defaults are `Done` and `Failed`; any custom outcomes configured on the source action also appear.

**Result:** Status updates. If the task was generated by a Process, picking a result automatically advances that contact along the matching outcome branch.

## Cross-references

- **Related section: Contacts** — Rule and Process triggers act on contact events (lists, tags, custom fields, leads); auto-lists referenced inside Process filters are created in Contacts.
- **Related section: Lessons / Courses** — Rule triggers `Start lesson` and `Got access to the lesson` act on course progress (used by the "Remind the student about the course" Process example).
- **Related section: Orders / Products** — Triggers `New order`, `Paid order`, `Cancelled order`, `Refund by order`, `Created order`, and `Activated subscription` act on order and subscription events; Tasks can be added from the Order card.
- **Related section: Email broadcasts / Visual editor** — The Send email action uses the familiar visual editor; senders are configured at the account level.
- **Related section: Pages / Funnels** — The `Visited page` trigger references page URLs created in the page builder; checkout-page visits drive the call-to-hot-clients example.

## Source articles

- [Creating and Editing Processes](https://help.influencersoft.com/hc/en-us/articles/360051178071-Creating-and-Editing-Processes)
- [Processes](https://help.influencersoft.com/hc/en-us/articles/360051179551-Processes)
- [Rules](https://help.influencersoft.com/hc/en-us/articles/360051178391-Rules)
- [Tasks](https://help.influencersoft.com/hc/en-us/articles/360050859551-Tasks)



---


# Courses

## Overview
The Courses area of InfluencerSoft is an integrated learning-management system (LMS) for building paid or free online courses and memberships. Authors create courses, group them into modules, fill modules with lessons, gate access by contact list, sell access through pricing plans, collect student reports on assignments, and answer those reports from one consolidated inbox. Students log into a separate student account at `http://YOUR-LOGIN.influencersoft.com/lms` (or `http://YOUR-VALID-DOMAIN/lms`), see the courses they have access to, work through lessons, submit reports, and track progress. This chapter documents the Courses main page, the Courses → Lessons subsection, the lesson editors (Web Page Designer Tool and visual editor), per-course settings tabs (Course, Course Structure, Access, Tariffs / Pricing plan, Notices for students, Reports), the Reports inbox, the Pricing plan screen, the student account, student registration flow, and the user profile.

## Where to find it
- Top menu → Courses → main Courses page (course list).
- Top menu → Courses → Lessons (global lesson library).
- Top menu → Courses → Reports (reports inbox).
- Course catalog (public/student-facing): `http://YOUR-LOGIN.influencersoft.com/lms` or `http://YOUR-VALID-DOMAIN/lms`.
- Student signup: `http://YOUR-VALID-DOMAIN/lms/signup/`.
- User profile: click the profile icon on the top panel of the InfluencerSoft user account.
- Sender contacts for course letters: Campaigns → Settings → Sender contact information tab.

## Terminology
- **Course** — a top-level learning product composed of one or more modules.
- **Membership** — same product type as a course in InfluencerSoft (created the same way).
- **Module** — a grouping of lessons within a course. Every course starts with one default module called "The main module of a course".
- **Lesson** — the unit of teaching content. Lessons live globally in Courses → Lessons and can be attached to any number of modules in any number of courses.
- **Obligatory lesson** — a lesson marked as mandatory; the module is not "completed" until all obligatory lessons are completed. Marked with a blue exclamation mark (usual lessons show a green exclamation mark).
- **Folder** — an author-side organizational container in Courses → Lessons for sorting lessons. Folders can contain subfolders. Students never see folder names.
- **Pricing plan / Tariff** — a fee-based access option attached to a course. Each plan auto-generates a linked product and a linked leads list. Also called "tariff" in the Course settings tab "Tariffs".
- **Pricing plan payment page identifier** — a unique Latin-letter (and numbers / underscore) ID that forms part of the order page URL for a plan.
- **Single payment** — pay once, all-time access (subject to lesson access rules).
- **Subscription** (AutoPay / recurring payment) — bank account is auto-debited on a schedule; lessons are accessible only while the subscription is active.
- **Pricing plan table** — the module-vs-plan access grid below the list of pricing plans inside a course, used to toggle which modules each plan unlocks.
- **Access (Allowed / Not allowed to leads in lists)** — list-based gating: lists in "Not allowed" override lists in "Allowed".
- **Auto-list / Leads list for a plan** — list automatically created and bound to a pricing plan. Cannot be deleted or disabled while it is bound. Students who pay are auto-added.
- **Report** — a student's submitted answer to a lesson task; carries a status (New / Accepted / Rejected) and an attempt number.
- **Attempt** — incrementing counter (2, 3, …) on a student's resubmitted report after rejection.
- **Web Page Designer Tool** — block-and-widget visual builder for lesson pages.
- **Visual editor** — the alternative WYSIWYG lesson editor.
- **Section** (designer) — a large page block dragged into the lesson workspace (categories: advantages, content, header, footer, products, etc.).
- **Widget** (designer) — a smaller element placed inside a section (text, button, form, code, etc.).
- **Sender contact** — the "From" identity used for student notification emails. Maintained in Campaigns → Settings → Sender contact information.
- **Primary access** — the fact that a student has an account at all and can log in.
- **New learners** — auto-generated system contact list that every newly registered student is dropped into; lives in Contacts → Lists.
- **Tag (course)** — a label attached to a course; used for student-side filtering. Entered in Latin or Cyrillic; pressing **Enter** saves a tag (Apply / Save buttons do not save it).
- **Favorite course** — author-marked star on a course. Displays the course at the top of the list for both author and student, and gives it a double-width cell in the student catalog.
- **Quick Filter bar** — date filter strip shown above "Add a course" when Report statistics view is enabled.
- **Quick add link to a group** — special email-editor button that adds the clicker to a chosen list.
- **Reset the password (variable)** — email attribute that inserts a password-reset link variable into automatic and quick mailshots.

## Screens and fields

### Screen: Courses main page (course list)
- **Purpose:** Browse, search, copy, duplicate, enable/disable, favorite, or delete every course in the account.
- **How to open:** Top menu → Courses.
- **Fields / columns:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Course name | text (link) | yes | Click to open the course settings. | — |
| Status | toggle | — | Green = enabled, grey = disabled. | — |
| Green eye icon | action | — | Opens the course page (student view). | — |
| Copy link icon | action | — | Copies the public course link. | — |
| Copy course icon | action | — | Duplicates the course (copies all settings and structure, except students' reports). | — |
| Cross icon | action | — | Deletes the course. | — |
| Star icon | toggle | — | Marks the course as favorite. | off |
| Report statistics column | derived | — | Visible only if Report statistics is enabled via View. | hidden |

- **Buttons and actions:**
  - **Add a Course** — opens the new-course form (name + description).
  - **Catalog link (next to Add a Course)** — redirects to the existing course catalog.
  - **View** — toggles display of Report statistics and the Quick Filter bar.
  - **Filter** — opens the filter modal.
- **Notes:**
  - Duplicating a course copies settings and structure but **lessons are not duplicated** — both the original and the copy point at the same lesson records. Editing a lesson in either course edits it everywhere.
  - The status of a duplicated course is disabled by default.
  - A favorite course occupies two cells (not one) on the student's available-courses page.

### Screen: View options popover (Courses main page)
- **Purpose:** Toggle extra columns and the quick filter on the Courses main page.
- **How to open:** Courses main page → View.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Report statistics | checkbox | — | Shows the report-stats column in the course table. | off |
| Quick Filter bar | checkbox | — | Shows the date filter strip above Add a course. | off |

- **Quick Filter date options:** today, yesterday, this month, last month, 30 days.

### Screen: Filter modal (Courses main page)
- **Purpose:** Find courses by combined criteria.
- **How to open:** Courses main page → Filter.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name | text | — | Course name search. | empty |
| Tags | tag picker | — | Filter by attached tag(s). | empty |
| Course status | dropdown | — | Enabled / Disabled. | — |
| Date when the report to the course was added | date | — | Reports-by-date filter. | — |
| Hide courses without reports | checkbox | — | Hides courses with no reports. | off |

### Screen: Add a Course (new course form)
- **Purpose:** Create a new course shell.
- **How to open:** Courses main page → Add a Course.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name | text | yes | Course title shown to students and in catalog. | — |
| Description | text | — | Course description (shown in catalog/student account). | — |

- **Buttons and actions:**
  - **Create and configure** — saves the course and forwards to its settings page.

### Screen: Course settings — "Course" tab
- **Purpose:** Edit the course's identity (name, description, cover, tags).
- **How to open:** Courses main page → click a course name → Course tab.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Course name | text | yes | Editable copy of name from creation. | — |
| Description | text | — | Editable copy of description. | — |
| Cover picture | file | — | Click "Select a file" to upload. Displayed in catalog at `/lms`. | — |
| Tags | tag input | — | Latin or Cyrillic; press **Enter** to add. Apply/Save buttons do not save tags. Multiple tags per course allowed. | — |

- **Notes:** Tags are displayed above the student's course list. Clicking a tag filters the student's view; double-clicking deselects. Students can only have one tag selected at a time.

### Screen: Course settings — "Course Structure" tab
- **Purpose:** Build the module → lesson hierarchy, set per-module access, manage per-lesson availability rules.
- **How to open:** Course settings → Course Structure tab.
- **Buttons and actions:**
  - **Add a Lesson** (per module) — opens the Add lessons modal (two-column).
  - **Add a Module** — opens a name prompt for a new module.
  - **Bulk add lessons** — opens the "Add lessons" pop-up for adding multiple existing lessons to the selected module.
  - **Plus (+) on module border** — inserts a new module between two existing ones.
  - **Cogwheel icon** (on a module) — opens that module's access settings.
  - **Module name** — click to rename in a pop-up.
  - **Module icon picker** — choose an icon shown in the student's left panel.
  - **Module status slider** — enable/disable the module.
  - **Cross on module** — delete module.
  - **Three vertical dots on lesson row** — drag to reorder.
  - **Exclamation mark on lesson** — blue = obligatory, green = usual.
  - **Green eye on lesson** — open the lesson in student view.
  - **Lesson name** — open the lesson editor in Courses → Lessons.
  - **"Instantly" link on lesson** — open lesson accessibility settings.
  - **Lesson status slider** — enable/disable this lesson within this course.
  - **Cross on lesson** — remove the lesson from this course only (not globally).
- **Notes:**
  - Course starts with one default module: "The main module of a course".
  - To enable a module, at least one lesson inside it must be enabled.
  - A lesson disabled globally in Courses → Lessons cannot be re-enabled from the Course Structure tab.
  - All lessons are accessible by default once the student has access to the course.

### Screen: Module settings (cogwheel modal)
- **Purpose:** Set list-based access for a single module and the lockout message.
- **How to open:** Course Structure tab → cogwheel on a module.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Allowed to leads in lists | list multi-select | — | Lists granted access to this module. | empty |
| Not allowed to leads in lists | list multi-select | — | Lists denied access; overrides Allowed. | empty |
| When the module is not available to the lead, in the modal window, display the message | text | — | Pop-up message shown to a student without access who clicks the module name. | empty |

- **Notes:** Lists tied to a pricing plan cannot be manually unselected here.

### Screen: Module accessibility settings (per-module schedule)
- **Purpose:** Time-gate when a module becomes available.
- **How to open:** Course Structure tab → module accessibility control.
- **Options:**
  - In a particular time after the course completion, for a particular period.
  - In a particular time after the completion of the previous module, for a particular period.
  - The module is accessible only on particular dates.
- **Default:** Module is accessible immediately.

### Screen: Lesson accessibility settings (per-lesson schedule, via "Instantly")
- **Purpose:** Time-gate when a lesson becomes available.
- **How to open:** Course Structure tab → click "Instantly" next to a lesson.
- **Options (radio-like list):**
  - In a particular time after the start of the course.
  - In a particular time after the completion of the previous (lesson).
  - For a particular time after the start of the course.
  - For a particular time after the completion of the previous lesson.
  - Displayed on particular dates.
- **Time unit dropdown:** days, hours, or minutes.
- **Notes:** Settings apply automatically (no Save step).

### Screen: Add lessons modal (per module)
- **Purpose:** Attach existing lessons (or stub a new lesson) to a module.
- **How to open:** Course Structure → Add a Lesson, or Bulk add lessons.
- **Layout:** Two columns. Left = existing lessons; right = lessons attached to this module / "New lessons" entry field.
- **Buttons and actions:**
  - Click a left-column lesson — moves it to the right column (attaches it).
  - **New lessons** (right column) — type a new lesson name to create a stub. Editable later in Courses → Lessons.
  - **Add** — confirm and return to Course Structure.
  - Hover-plus on a left-column lesson (Bulk add) — adds it to the end of the selected module.

### Screen: Course settings — "Access" tab
- **Purpose:** Define course-wide list access and how an inaccessible course should display.
- **How to open:** Course settings → Access tab.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Allowed to leads in lists | list multi-select | — | Lists granted access to the course. | empty |
| Not allowed to leads in lists | list multi-select | — | Lists denied; overrides Allowed when both apply. | empty |
| Display of inaccessible course | radio | — | "Do not show in the list of courses" / "Show in list of courses, open page". | — |
| Link to open page (if "Show … open page" selected) | URL | — | Page opened when the student clicks "More about the course". | empty |
| Show the schedule of modules and lessons on the side menu of the course | checkbox | — | Shows start/finish dates of module activation in student account. | off |

- **Notes:** Inclusion in any "Not allowed" list overrides inclusion in any "Allowed" list — access is denied.

### Screen: Course settings — "Tariffs" / "Pricing plan" tab
- **Purpose:** List existing pricing plans, create new ones, and configure the module access table per plan.
- **How to open:** Course settings → Tariffs / Pricing plan tab.
- **Buttons and actions:**
  - **Create pricing plan** (or **Create/Add Pricing plan**) — opens the pricing plan creation page.
  - Click a plan's name — opens its product-style edit page (same workflow as editing a regular product).
  - Plan status slide bar — black = disabled (cannot be bought), enabled when toggled back.
  - Cross to the right of a plan name — disables and completely deletes the plan (and its linked product).
  - Pricing plan table sliders — toggle module-by-plan access on/off.
- **Notes:**
  - Deleting a pricing plan also deletes its associated product, and vice versa. The auto-generated leads list is **not** deleted — delete it manually if desired. Leads in that list retain module access until you disable the list in module settings.
  - Modules disabled at the course level appear light gray in the pricing plan table.
  - The pricing plan table is linked to the Access tab and to each module's "Accessible for leads in lists"; you cannot manually deselect lists tied to plans.

### Screen: Create pricing plan
- **Purpose:** Define a single fee-based access option for a course.
- **How to open:** Tariffs / Pricing plan tab → Create pricing plan (first plan) or Create/Add Pricing plan (subsequent plans).
- **Fields (Single payment):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Type of payment | dropdown | yes | "Single payment" / "Subscription". | — |
| Price | number | yes | Fee for the plan. | — |
| Pricing plan payment page (identifier) | text | yes (on add) | Unique Latin letters, numbers, and underscore (`_`). Forms part of the order page URL. Cannot be reused across plans. Field appears only on add (not on edit). | — |
| Pricing plan name | text | yes | Matches the auto-generated product name; shown on the order page. | — |
| Pricing plan description | text | — | Shown in the catalog (if product is in catalog) and in the referral program (if product is visible to referrals). | empty |
| Make modules available to buyers | checkbox group | — | Per-module checkboxes. Includes an "ALL" option. | — |

- **Fields (Subscription — replaces Price):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| The first payment amount | number | yes | Sum of the first payment; can differ from later sums. | — |
| Automatic payments sum | number | yes | Sum deducted on each subsequent autopay. | — |
| Automatic payments will begin in X days after first payment | number | yes | Delay before first autopay. | — |
| At intervals X days | number | yes | Recurring interval for subsequent payments. | — |
| Number of repeated autopayments | number | — | Total autopays before the subscription disables itself. | unspecified (infinite until disabled) |

- **Notes:**
  - Subscription lifetime depends on bank/payment system; typically 1 year. Failures can come from re-issued, low-balance, restricted, lost/stolen, or damaged cards, or from fraud locks.
  - Changing a subscription plan's price only affects new students — existing subscribers keep the old price.
  - Selecting **ALL** modules now means any module added later is auto-selected; selecting modules individually means future modules are not auto-selected.
  - If any pricing-plan-bound module is disabled in the pricing plan table, new modules are auto-marked inaccessible.
  - A pricing plan is implemented as a product; editing follows the regular product edit flow (see Adding and Editing a Product — https://help.influencersoft.com/hc/en-us/articles/360050850851-Adding-and-Editing-a-Product-).

### Screen: Pricing plan table (module × plan access grid)
- **Purpose:** Toggle which modules each pricing plan unlocks.
- **How to open:** Tariffs / Pricing plan tab, below the list of plans.
- **Controls:** One slider per (module, plan) cell. Disabled modules in the course render in light gray.
- **Notes:** Edits propagate automatically to the Access tab and to each module's "Accessible for leads in lists" because the auto-generated leads list cannot be unselected manually.

### Screen: Course settings — "Notices for students" tab
- **Purpose:** Configure the sender contact and per-course notification letters.
- **How to open:** Course settings → Notices for students tab.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| From (sender contact) | dropdown | — | Contact that sends lesson/report letters. Defaults to the contact set in Courses → Settings. | course-settings default |
| Use default letters (checkbox) | toggle | — | Checked = use letters from Courses → Settings; unchecked = open the per-course letter editor. | checked |
| Letter editor (revealed when unchecked) | WYSIWYG | — | Edit each notification letter individually. | — |

- **Notification letter types:**
  - "A new lesson available for you"
  - "New lessons available for you"
  - "The report is accepted"
  - "Report Rejected"
- **Notes:** Sender contacts are managed in Campaigns → Settings → Sender contact information.

### Screen: Course settings — "Reports" tab (per course)
- **Purpose:** Quick view of per-lesson report stats; jump points to lesson settings and to the full Reports inbox.
- **How to open:** Course settings → Reports tab.
- **Columns / fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Lesson name (link) | link | — | Opens lesson settings page. | — |
| Green eye icon | link | — | Opens the lesson in student view. | — |
| Lesson opened | number | — | Count of students who opened the lesson; click to see contacts. | — |
| Lesson completed | number | — | Count who completed it; click to see contacts. | — |
| Total | number | — | Total reports; click to open Courses → Reports filtered. | — |
| New | number | — | New reports; click to open filtered list. | — |
| Accepted | number | — | Accepted reports; click for list. | — |
| Rejected | number | — | Rejected reports; click for list. | — |

- **Notes:** Reports only exist when the lesson's "Lesson completed if" is set to "the learner completed the assignment".

### Screen: Courses → Lessons (lesson library)
- **Purpose:** Global list of every lesson in the account, plus folders for organization.
- **How to open:** Top menu → Courses → Lessons.
- **Buttons and actions:**
  - **Filter** — opens the lesson filter.
  - **Add a Lesson** — creates a new lesson (modal asks for name; offers Cancel / Create / Create and configure).
  - **Add a Folder** — creates an author-only organizational folder.
  - Lesson checkbox — multi-select for bulk actions.
  - **Cogwheel** (when lessons checked) — exposes "Move to folder" option.
- **Notes:** Lessons can belong to any number of courses simultaneously; folders are author-only.

### Screen: Add a lesson modal (Lessons library)
- **Purpose:** Create a lesson record (optionally jump straight to its editor).
- **How to open:** Courses → Lessons → Add a Lesson.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Lesson name | text | yes | The lesson's name. | — |

- **Buttons and actions:**
  - **Cancel** — close without creating.
  - **Create** — create an empty lesson; stay on the list page (useful for "booking" names).
  - **Create and configure** — create and open the lesson settings page.

### Screen: Lesson settings / editor
- **Purpose:** Edit a single lesson's content, description, attachments, completion rule, and tasks.
- **How to open:** Courses → Lessons → click a lesson name; or Course Structure → click a lesson name; or Add a lesson → Create and configure.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Current name (header area) | text (read-only echo) | — | Mirror of the editable name field. | — |
| Global status | toggle | — | Disables the lesson in every course it belongs to. Cannot be re-enabled from a course's Course Structure tab. | enabled |
| Lesson name | text | yes | Editable name. | — |
| Lesson creation mode | dropdown | yes | "Web page designer tool" or "Visual editor". | — |
| Lesson description | text / rich text | — | Brief description; shown below the lesson name in student view. | empty |
| Select file (description attachment) | file | — | Attach files for student download. | — |
| Lesson completed if | dropdown | yes | "the learner read it to the end" / "the learner completed the assignment". The latter enables tasks/reports. | — |
| Task text | text | — | Visible when "completed the assignment" is set. Multiple tasks allowed. | — |
| Task file attachments | file | — | Per-task attachments (empty report forms, additional materials). | — |

- **Notes:**
  - Disabling a lesson here disables it globally; deleting it deletes it from every course (with a confirm modal).
  - "the learner read it to the end" makes the lesson read-only — no reports are required.

### Screen: Lesson filter
- **Purpose:** Search the lesson library.
- **How to open:** Courses → Lessons → Filter.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name (full or partial) | text | — | Substring match. | empty |
| Course / Module | checkbox tree | — | Limit to lessons attached to specific courses/modules. | empty |
| Lesson status | dropdown | — | "All" / "Active" / "Inactive". | All |

### Screen: Add a folder modal
- **Purpose:** Create an author-only folder in Courses → Lessons.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Folder name | text | yes | Name visible to the author only. | — |

- **Buttons and actions:**
  - **Create a folder** — saves.
  - Clicking an existing folder name reopens the modal for renaming; click **Save** to confirm.
- **Notes:** Folders containing lessons appear blue with a count badge; empty folders are grey. Subfolders are created by entering a folder and clicking Add a folder again.

### Screen: Move to folder modal
- **Purpose:** Relocate one or more lessons into a folder.
- **How to open:** Courses → Lessons → check lessons → cogwheel → Move to folder.
- **Buttons and actions:**
  - Click folder name to select destination.
  - **Move to** — confirms move.
  - **Create a folder** — make a new destination folder inline.
  - Click a folder's **icon** (not its name) in the modal to drill into a subfolder.

### Screen: Web Page Designer Tool (lesson editor)
- **Purpose:** Build a lesson page using sections, widgets, and templates.
- **How to open:** Lesson settings → Lesson creation mode = "Web page designer tool" → Choose a template.
- **Layout:**
  - Designer tool occupies the full screen.
  - Bottom-left control = page settings.
  - Bottom-right control = add new elements.
  - Left-side control buttons for navigation.
- **Buttons and actions:**
  - **Choose a template** — opens the template gallery.
  - **View** (in template gallery) — previews a template on computer and mobile.
  - **Add element** — slide-out panel with Sections and Widgets tabs.
  - Drag a section into the workspace, then drag widgets into it. Insertion target highlights blue.
  - Click a section/widget heading to drag-and-drop it. Drag widgets between sections (a widget dropped into a new section becomes the first widget there).
  - Click any element → settings panel appears on the right; each widget exposes ready-to-use styles and an HTML/CSS tab for custom classes.
- **Section categories:** advantages, content, header, footer, products, etc.
- **Notes (from FAQ):**
  - "Letters jumping" over text = disable browser plug-ins (translators, password managers) or switch browser/device, then contact support if unresolved.
  - Q&A widget = use the Code widget and paste `<details>` / `<summary>` HTML; add `open` attribute on `<details>` to start expanded.
  - Text widget supports separate desktop/mobile indents and font size.
  - Section settings support frame (Section Stroke type, thickness, color), inner/outer margins, shadow color and width.
  - Button widget → Design settings → Text tab supports a second text line below the title with its own height and color (top line edited directly on the button). Form widget exposes the same two-line text option.

### Screen: Template gallery (Web Page Designer Tool)
- **Purpose:** Pick a starting template for a new lesson, or start from scratch.
- **How to open:** Web Page Designer Tool → Choose a template.
- **Buttons and actions:**
  - **View** — preview a template (computer + mobile).
  - Select template → enters the designer.
  - Option to create a new template from scratch.

### Screen: Courses → Reports (reports inbox)
- **Purpose:** Triage and answer student reports across every course in one place.
- **How to open:** Top menu → Courses → Reports.
- **Top-bar fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Total reports count | counter | — | All statuses. | — |
| New reports count | counter | — | Unanswered reports. | — |
| Accepted reports count | counter | — | Accepted reports. | — |
| Rejected reports count | counter | — | Rejected reports. | — |
| Period selector | date range | — | Period the counters and list reflect. | — |
| Bulk action selector | dropdown | — | Operates on ticked reports. Options: accept, reject, delete. | — |
| Quick time filter | chip filter | — | Quick date filtering. | — |
| Auto-accept rules | rule editor | — | Add/configure rules that auto-accept reports matching criteria. | none |
| View | dropdown | — | Toggle display of "task text" inside each report card. | task text off |
| Search / Filter | filter modal | — | Search a specific student's reports. | — |
| Paginator | dropdown | — | Reports per page. | — |

- **Bulk actions (from selector):**
  - **Accept** — accept all ticked reports.
  - **Reject** — reject all ticked reports. For assignments requiring report verification, rejected reports continue to block the next lesson until accepted or status-changed.
  - **Delete** — remove ticked reports without accepting or rejecting.

### Screen: Reports → Filter modal
- **Purpose:** Pin-point a specific set of reports.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Student contact info | text | — | Best practice: enter the student's email. | empty |
| Course | dropdown | — | Limit to one course. | All |
| Date from | date | — | Lower bound of report-added date. | — |
| Date to | date | — | Upper bound of report-added date. | — |
| Status | multi-select | — | One or more of: New, Accepted, Rejected. | — |
| Teacher / curator | dropdown | — | The author/curator working the course. | — |

### Screen: Report card (single report)
- **Purpose:** Read, respond to, accept, reject, or delete one report.
- **Fields displayed:**
  - Student avatar (set by the student in their student-account settings).
  - Report characteristics: student name, date, time. Below: course → module → lesson.
  - Attempt number ("2", "3", …) for resubmissions.
  - Current status (click to change to: new, accepted, rejected, or delete).
  - Task text (visible only if enabled via View → "task text").
  - Report text (student's submission).
  - Author avatar.
  - Response field for the author's reply.
- **Buttons and actions:**
  - **Accept** — accept and send the response to the student via email.
  - **Reject** — reject and send the response; student must edit and resubmit (attempt counter increments).
  - Delete (status menu) — removes the report.
- **Notes:** Responses use the first name, last name, and photo set in the user profile. Responses are emailed to the student and attached to the lesson under their report.

### Screen: User profile
- **Purpose:** Manage author account identity, password, and renewal mode.
- **How to open:** Click the user icon on the top panel of the InfluencerSoft account.
- **Fields (Basic data):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Name (first) | text | yes | Shown in account and on author replies to student reports. | — |
| Last name | text | yes | Shown in account and on author replies. | — |
| Photo | file | — | Author avatar shown on responses to student reports. Click **Change** below the photo to replace. | — |
| Email address | read-only | — | Cannot be changed by the user directly. To change: question-mark icon (upper right) → Send a written request → subject "Changing email address". Support sends instructions and changes after identity verification. | account email |
| Phone number | text | — | Click **Change your phone number** to edit. Used only for emergency contact and identity verification. | — |

- **Change password tab fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Current password | password | yes | Existing password. | — |
| New password | password | yes | Preferred new password. | — |
| Confirm password | password | yes | Repeat of New password. | — |

- **Notes:** If you cannot access the profile, use the password-reset page instead.

### Screen: Settings for unlimited plan renewal (in User profile)
- **Purpose:** Decide whether the unlimited plan auto-renews.
- **Fields (radio):**
  - **Do not renew unlimited mode automatically** — chosen package is not extended.
  - **Charge for a new month from account balance or credit card** — package is auto-extended monthly if attached card or blue account balance has enough funds.

### Screen: Student login window
- **Purpose:** Student-facing login.
- **How to open:** `http://YOUR-VALID-DOMAIN/lms`.
- **Fields:** Email (login), password, account registration link, forgotten-password link.

### Screen: Student account — courses dashboard
- **Purpose:** Student sees available courses, tags, progress, and the start/continue button.
- **How to open:** Student logs in.
- **Elements:** Profile icon (avatar), tag bar above the course list (filters; double-click a tag to deselect), course cards with **Start learning** or **Continue learning** buttons, progress bars.

### Screen: Student account — lesson view
- **Purpose:** Student reads the lesson and submits a report if required.
- **Elements:** Lesson description (with attached files), course structure drop-down, task description, file attachments, report-submission form.

### Screen: Student account — Progress
- **Purpose:** Show per-course module progress and completion state.
- **Elements:**
  - Horizontal bars per module, color-coded: completed, in progress, not started.
  - Tabs at upper right: **In process** and **Completed**.
  - **Finish the course** button — available when all mandatory lessons are completed; moves the course to the Completed tab.

### Screen: Student signup page
- **Purpose:** Direct student self-registration.
- **How to open:** `http://YOUR-VALID-DOMAIN/lms/signup/`.
- **Fields:** Name, email address.
- **Result:** Student is redirected to their personal account; their contact is auto-added to the system list "New learners" (Contacts → Lists).

### Screen: Student password reset
- **Purpose:** Student requests a reset link.
- **Fields:** Email address.
- **Result:** Reset instructions and a link are emailed; clicking the link opens a set-new-password page. Links expire for security.

### Screen: Subscription confirmation email (student)
- **Purpose:** Confirm subscription before granting access to course materials.
- **Body excerpt (verbatim from source):** "To be able to send you new assignments and give access to materials, please confirm your subscription by clicking the link: link"
- **Outcome:** Clicking the link auto-logs the student into the account.

## Common tasks

### How do I create a new course or membership?
1. Top menu → Courses.
2. Click **Add a Course**.
3. Enter **Name** and **Description**.
4. Click **Create and configure**.
5. On the Course tab, optionally upload a cover via **Select a file** and add tags (type tag, press **Enter**).
6. Go to **Course Structure** and rename the default module "The main module of a course" if desired.
7. Add modules via **Add a Module** (or the plus on a module border).
8. Add lessons to each module via **Add a Lesson** or **Bulk add lessons** (left column = existing lessons, right column = attached / new).
9. Enable at least one lesson per module (slider), then enable the module.
10. Configure list access in the **Access** tab.
11. Optionally configure plans in the **Tariffs** / **Pricing plan** tab.
12. Configure sender and notification letters in **Notices for students**.

**Result:** A live course gated by your selected lists, with structure visible to enrolled students.
**Options along the way:**
- At step 4 you can click **Create** instead of **Create and configure** to stay on the list page.
- At step 7 you can also click the plus on a module border to insert between two existing modules.
- At step 8 you can stub a new lesson by typing a name into the right column under "New lessons".
- At step 11 you can skip plans entirely for free courses.

**Gotchas:**
- A module with no enabled lessons cannot be enabled.
- A globally disabled lesson cannot be re-enabled per-course.
- A course copy disables status by default and reuses (does not duplicate) lessons.

### How do I duplicate a course?
1. Courses main page.
2. Click the **Copy course** icon on the row.
3. Enter a new name for the copy.

**Result:** A disabled copy with all settings, structure (modules and lesson links), but no student reports.
**Gotchas:** Lessons in the copy are shared with the original; editing a lesson in either course edits both.

### How do I add a tag to a course?
1. Course settings → Course tab.
2. Type the tag (Latin or Cyrillic) into the tags field.
3. Press **Enter**.

**Result:** Tag is saved.
**Gotchas:** The Apply and Save buttons do not save tags — only **Enter** does.

### How do I add a module?
1. Course Structure → click **Add a Module** (or click the plus on a module border).
2. Enter the module name in the pop-up.
3. Click **Add**.

**Result:** Module appears in the Course Structure tab.
**Options along the way:** Hovering between two existing modules and clicking the plus inserts the new module between them.

### How do I add a lesson to a module?
1. Course Structure → click **Add a Lesson** for that module.
2. In the modal, click an existing lesson in the left column to move it to the right column, **or** click **New lessons** in the right column and type a name.
3. Confirm by clicking **Add**.

**Options along the way:** Use **Bulk add lessons** to add multiple existing lessons (hover-plus to add) without leaving the tab.

### How do I remove a lesson from a module?
1. Course Structure tab.
2. Click the cross at the end of the lesson row.

**Result:** Lesson is removed from this course only. It remains available globally and in any other courses.

### How do I gate a lesson by date or completion of a previous lesson?
1. Course Structure → click **Instantly** next to the lesson.
2. Choose one of:
   - In a particular time after the start of the course.
   - In a particular time after the completion of the previous.
   - For a particular time after the start of the course.
   - For a particular time after the completion of the previous lesson.
   - Displayed on particular dates.
3. Enter the period; select the unit (days, hours, minutes).

**Result:** Setting is applied automatically.
**Gotchas:** If the previous lesson is incomplete, the next lesson stays locked regardless of elapsed time.

### How do I gate a module by contact list?
1. Course Structure → click the cogwheel on the module.
2. In **Allowed to leads in lists**, pick lists that get access.
3. In **Not allowed to leads in lists**, pick lists that should not.
4. Optionally enter a lockout message in **When the module is not available to the lead, in the modal window, display the message**.
5. Save.

**Result:** Module is gated by list membership. Without-access students see the module locked; clicking the module name shows the lockout message.
**Gotchas:** Lists bound to a pricing plan cannot be unselected here. "Not allowed" overrides "Allowed".

### How do I create a course in the Web Page Designer Tool?
1. Open the lesson in Courses → Lessons.
2. Set **Lesson creation mode** to "Web page designer tool".
3. Enter the lesson name, leave defaults, click **Choose a template**.
4. Pick a template (use **View** to preview on desktop and mobile) or start from scratch.
5. Drag sections from **Add element → Sections** into the workspace.
6. Click a section, then drag widgets from **Add element → Widgets** into it.
7. Click any element to edit settings on the right panel (ready-to-use styles or HTML/CSS tab for custom classes).

**Options along the way:**
- Use the Code widget with `<details>` / `<summary>` HTML for an FAQ accordion.
- In the Text widget, set distinct desktop and mobile indents and font sizes.
- In Section settings, choose Stroke type, thickness, color, inner/outer margins, shadow.
- In a Button widget, use Design settings → Text tab for a second text line below the title.

### How do I assign a home task to a student?
1. Open the lesson in Courses → Lessons.
2. In **Lesson completed if**, choose "the learner completed the assignment".
3. Enter task text in the task field.
4. Attach files to the task with **Select file** if needed.
5. Add more tasks if needed.

**Result:** Student must submit a report for the lesson to count as completed.
**Options along the way:** Choose "the learner read it to the end" to skip reports entirely.

### How do I create a folder for lessons?
1. Courses → Lessons → **Add a Folder**.
2. Type a folder name.
3. Click **Create a folder**.

**Result:** Folder appears in the lesson list (grey if empty, blue with count badge if it has lessons).
**Options along the way:** Enter a folder and click **Add a folder** again to create a subfolder.

### How do I move a lesson into a folder?
1. Courses → Lessons.
2. Tick the lesson(s).
3. Click the cogwheel → **Move to folder**.
4. Click the destination folder name.
5. Click **Move to**.

**Options along the way:** Click **Create a folder** in the modal to add a new destination. Click the folder icon (not its name) to drill into a subfolder.

### How do I filter lessons?
1. Courses → Lessons → **Filter**.
2. Enter a name fragment.
3. Tick a course or module.
4. Choose status: All / Active / Inactive.

**Result:** Matching lessons are listed.

### How do I disable a lesson?
1. Courses → Lessons.
2. Click the green slider on the lesson row.

**Gotchas:** This disables the lesson **globally** — in every module and every course it is attached to. To re-enable, the slider in Courses → Lessons must be flipped back; it cannot be re-enabled from a course's Course Structure tab.

### How do I delete a lesson or folder?
1. Courses → Lessons.
2. Click the cross on the lesson or folder row.
3. Confirm in the modal.

**Gotchas:** Deleting a folder deletes every lesson inside it. Deleting a lesson removes it from every course it is attached to.

### How do I create a pricing plan?
1. Course settings → Tariffs / Pricing plan tab.
2. Click **Create pricing plan** (first plan) or **Create/Add Pricing plan** (subsequent).
3. Choose **Type of payment**: Single payment or Subscription.
4. Enter the **Pricing plan payment page** identifier (Latin letters, numbers, underscore; unique).
5. Enter **Pricing plan name** and optionally **Pricing plan description**.
6. Enter **Price** (Single payment) or fill the subscription fields: **The first payment amount**, **Automatic payments sum**, **Automatic payments will begin in X days after first payment**, **At intervals X days**, and optionally **Number of repeated autopayments**.
7. Tick the modules to make available, or tick **ALL**.
8. Save.

**Result:** A product is auto-generated for the plan, and a leads list is auto-generated. Payers are added to that list and get access.
**Options along the way:** Selecting **ALL** makes future modules auto-included; selecting individual modules does not.
**Gotchas:**
- The identifier must be unique. Latin letters/numbers/underscore only.
- Subscription price changes only affect new students; existing subscribers keep the old price.
- Subscription lifetime is bank-dependent (typically 1 year); re-order to extend.

### How do I edit an existing pricing plan?
1. Tariffs / Pricing plan tab.
2. Click the plan's name.

**Result:** Opens the regular product edit workflow.
**Notes:** The payment page identifier field is shown only on add, not on edit.

### How do I disable or delete a pricing plan?
1. Tariffs / Pricing plan tab.
2. To disable: click the slide bar opposite the plan name (turns black). To re-enable, click again.
3. To delete: click the cross to the right of the plan name.

**Gotchas:**
- Deleting a plan deletes its product (and vice versa).
- The auto-generated leads list is **not** deleted automatically — delete it manually if desired.
- Students already in the leads list keep module access until you disable that list in module settings.

### How do I change which modules a pricing plan unlocks?
1. Tariffs / Pricing plan tab.
2. In the **Pricing plan table** below the list of plans, click the slider for the (module, plan) cell.

**Result:** Access updates in the Access tab and each module's "Accessible for leads in lists".
**Notes:** Disabled modules render light gray in the table. You cannot manually unselect plan-tied lists in module settings.

### How do I set who can access the course?
1. Course settings → Access tab.
2. In **Allowed to leads in lists**, pick the contact lists that get access.
3. In **Not allowed to leads in lists**, pick lists to deny.
4. Choose how to display the course for students without access: **Do not show in the list of courses** or **Show in list of courses, open page** (and enter a URL).
5. Tick **Show the schedule of modules and lessons on the side menu of the course** if you want module activation dates shown to students.

**Gotchas:** A contact in both Allowed and Not allowed is denied.

### How do I send course notifications from a specific sender?
1. Course settings → Notices for students.
2. In **From**, pick the sender contact. Defaults to the contact in Courses → Settings.
3. To customize notification letters per course, uncheck the "use default letters" option to open the per-course letter editor.

**Notes:** Sender contacts come from Campaigns → Settings → Sender contact information. Configurable letters: "A new lesson available for you", "New lessons available for you", "The report is accepted", "Report Rejected".

### How do I work the reports inbox?
1. Top menu → Courses → Reports.
2. Use the period selector or the quick time filter to scope.
3. Optionally enable **View → task text** to see the task inside each card.
4. Open the **Filter** to search by student email, course, date range, status, or teacher/curator.
5. For each report: read the report text, type a response.
6. Click **Accept** or **Reject**.

**Result:** Response is emailed to the student and appended below their report in the lesson view.
**Options along the way:**
- Use the bulk action selector to **accept**, **reject**, or **delete** ticked reports.
- Use **Auto-accept rules** to add rules that automatically accept matching reports.
- The paginator at the bottom controls reports per page.

**Gotchas:**
- Rejecting a report on an assignment with mandatory verification blocks the next lesson until accepted (or status-changed).
- Rejected reports cause the student to resubmit; the attempt counter increments (2, 3, …).
- Delete removes the report without accepting or rejecting.

### How does a student register?
- **Direct signup:** Follow `http://YOUR-VALID-DOMAIN/lms/signup/`, enter name + email, redirect to the student account. Student is added to the system list "New learners".
- **Via the main course page:** Follow `http://YOUR-VALID-DOMAIN/lms`, enter email, click the confirm-subscription link in the email; redirected to the account.
- **Password reset:** From the reset page, enter email; follow the emailed link; set a new password (link expires).
- **Via password-reset variable in email:** Use the "Reset the password" attribute in an automatic or quick mailshot — system substitutes a one-time link.

### How does a subscriber join a list (to gain course access)?
- Buy a product (product can be configured to add the buyer to a chosen list — see Adding and Editing a Product).
- Submit a subscription form (generator code on an external site, or the Form widget in the InfluencerSoft web page designer).
- Quick-add link to a group, inserted from the email editor.
- Auto-chains: actions that add or remove a contact from a list after a delay (e.g., 24 hours after joining, 6 hours after the fifth email).
- API: addLeadToGroup (and related methods like CreateOrder, UpdateOrderStatus for orders).
- Manual add by the author (from Contacts → Lists) or via import.
- Surveys: assign list membership based on survey answers.

### How do I change my user profile data?
1. Click the user icon on the top panel.
2. **Basic data** tab — edit name, last name, photo (click **Change** under the photo).
3. **Change password** tab — fill **Current password**, **New password**, **Confirm password**.
4. For **Phone number** — click **Change your phone number** and follow on-page instructions.
5. For **Email** — click the question-mark icon (upper right) → **Send a written request** → subject "Changing email address". Support guides you through identity verification, then changes the email.

### How do I control unlimited plan auto-renewal?
1. User profile → Settings for unlimited plan renewal.
2. Pick **Do not renew unlimited mode automatically** or **Charge for a new month from account balance or credit card**.

## Cross-references
- **Related section:** Contacts / Lists — Pricing plans auto-create leads lists; module and course access gate by list membership.
- **Related section:** Products — Pricing plans are products; editing a plan uses the regular product edit flow (Adding and Editing a Product — https://help.influencersoft.com/hc/en-us/articles/360050850851-Adding-and-Editing-a-Product-).
- **Related section:** Campaigns / Mailing — Sender contact for course notifications lives in Campaigns → Settings → Sender contact information. Password-reset variable and "quick add link to a group" are configured in the email editor (Email Series, Broadcasts).
- **Related section:** Form Constructor — Form widget on lesson and landing pages adds subscribers to lists (Form Constructor — Subscriptions and Orders).
- **Related section:** Surveys — Surveys can add a respondent to a list and therefore grant course access.
- **Related section:** API — `addLeadToGroup`, `CreateOrder`, `UpdateOrderStatus` are used for programmatic enrollment and order management.

## Source articles
- [Course Pricing Plan](https://help.influencersoft.com/hc/en-us/articles/360050398132-Course-Pricing-Plan)
- [Creating and Editing the Lessons in Web Page Designer Tool](https://help.influencersoft.com/hc/en-us/articles/360050694052-Creating-and-Editing-the-Lessons-in-Web-Page-Designer-Tool)
- [How to Create a Course or Membership](https://help.influencersoft.com/hc/en-us/articles/360050695232-How-to-Create-a-Course-or-Membership)
- [Lesson Creation and Settings](https://help.influencersoft.com/hc/en-us/articles/360051184971-Lesson-Creation-and-Settings)
- [Overview of Student's Account](https://help.influencersoft.com/hc/en-us/articles/360051181091-Overview-of-Student-s-Account)
- [Reports and Work with Them](https://help.influencersoft.com/hc/en-us/articles/360051180011-Reports-and-Work-with-Them)
- [Student Registration](https://help.influencersoft.com/hc/en-us/articles/360051183991-Student-Registration)
- [User's Profile](https://help.influencersoft.com/hc/en-us/articles/360051184111-User-s-Profile)



---


# Affiliates

## Overview
The Affiliates area is where you configure an affiliate (partnership) program inside InfluencerSoft, recruit and manage partners, build the promotional materials those partners will use, track click and commission statistics, and pay commissions out. It is used by the store owner (who runs the program) and by the partners themselves (through the partner's cabinet and partner profile). Affiliate behavior is tied to clicks captured via UTM-tagged links, buttons, forms, and discount-coupon invoices. This chapter covers the program-wide settings, the partner profile, the per-partner commission and payout screens, the free / paid / multi-level promo material screens, and the drafts (banner, text, subscription form) that fill those promo lists.

## Where to find it
- Top menu / sidebar → Affiliates section (entry point to all screens below).
- Partner's cabinet → top-right checkmark → Profile (partner-side profile screen).
- Affiliates → Affiliate Management page → upper right corner contains the partner registration link and the partner's cabinet link.
- Affiliates → How to Setup an Affiliate Program → Registration Page contains the Link to the Partner Registration Page.

## Terminology
- **Affiliate / Partner** — a person registered in your affiliate program who promotes your free or paid products in exchange for commissions.
- **Affiliate program** — the overall configuration of commissions, payout methods, registration page, and instructions you offer partners.
- **Two-level / Multi-leveled affiliate program** — a program in which a partner can also recruit lower-level partners; commissions are paid across levels. The number of levels is currently limited to two.
- **Click** — the event of following a link (or clicking a button/form) that carries a partner UTM-tag, captured by the Click.js script and stored in a browser cookie until a subscription or invoice is created.
- **UTM-tag** — key-value parameter on a URL, button, or form that identifies the partner whose link drove the visit.
- **Click.js** — the script placed on a page that parses the URL bar, splits UTM-tags into key-value pairs, and transfers them to InfluencerSoft on subscription or form-based order generation.
- **Fee period** — the number of days (1–365, or forever) after a partner's click during which a subsequent purchase will still pay commission to that partner.
- **Money Back / Subtract Commission in the Case of Moneyback** — checkbox that controls whether commissions are removed when a customer is refunded. The checkbox state is captured at bill generation time.
- **Commission** — amount paid to the partner for a sale; can be a fixed sum, a fixed sum with a discount, or a percentage of the product cost.
- **Payout / Pay Out** — the action of generating a notification to a partner that commissions are being paid. Clicking Pay Out does not move money — real payment happens from your own wallets, not from your InfluencerSoft balance.
- **Free product (for affiliates)** — a free magnet/lead-magnet you let partners promote so they can capture leads on your behalf.
- **Paid product (for affiliates)** — a paid product made promotable by ticking Display to partners in the product's Affiliates tab.
- **Promotional materials / Promo / Drafts for Partners** — banners, advertising text, and subscription forms partners can use; created by you and displayed in the partner's cabinet.
- **Direct Link for Partners** — a partner link that points directly to your advertising page (requires inserting the click script code on that page).
- **Offers column** — column on the promo materials list whose number opens the per-product list of banners, texts, and forms.
- **Partner's cabinet** — the partner-side interface where promotional materials, instructions, and affiliate links are surfaced.
- **Affiliate's Form/Button Generator** — toggle on a paid product's promo list that permits or forbids partners to generate order buttons/forms inside their cabinet.
- **Tariff "Guru"** — paid plan that unlocks the Subscription Activation checkbox on partner subscription forms.

## Screens and fields

### Screen: How to Setup an Affiliate Program (program-wide settings)
- **Purpose:** Configure store-wide affiliate program settings, the partner registration page, and partner instructions.
- **How to open:** Affiliates section → How to Setup an Affiliate Program.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Store Name | text | not stated | Name displayed to partners at the registration stage. | not stated |
| Subtract Commission in the Case of Moneyback | checkbox | no | If checked at the moment a bill is generated, the partner's commission for that bill is removed when the customer requests a refund. The state at bill time is what counts — later changes do not retroactively apply. | not stated |
| Ways of Payout | multi-option list | not stated | Payout methods shown to partners during registration. Mentioned options: PayPal wallet; Bank details. Other options: not enumerated in source. | not stated |
| Commissions (per level) | number / percentage | not stated | Default commission for each level. Fixed sum, fixed sum with discount, or percentage of product cost. Defaults can be overridden in the product settings or per-partner settings. | not stated |
| Number of levels | structural | not stated | Two levels shown by default. Add button creates an extra level; Delete button removes a level. Currently limited to two. | 2 |
| Fee period | number (days) | not stated | Period after the partner's click during which a later purchase still credits them. Range: 1–365 days, or "forever". | not stated |
| Which partner should a fee be accrued for? | choice | not stated | Determines whether the first or last partner in a chain of clicks gets the commission. Specific labels: not enumerated in source. | not stated |
| What if a customer is already in your database? | checkbox | not stated | When checked, avoids paying commissions for customers already in your database who later return via a partner link. | not stated |
| The purchase was successful but not via a partner's link? | checkbox | not stated | Controls whether to pay commissions when the buyer first arrived via a partner link but ultimately bought through a direct link. | not stated |
| Link to the Partner Registration Page | URL (read-only/display) | yes | Link partners use to register in your affiliate program. | not stated |
| Add a description to the page | button | no | Opens the website builder / Template Designer so you can create a registration-page description. After use, replaced by Edit Description and Clear Description buttons. | not stated |
| Edit Description | button | no | Opens the Template Designer to edit the existing description. | n/a |
| Clear Description | button | no | Returns the registration page to its standard view. | n/a |
| Main instruction (Instructions for Partners) | WYSIWYG (InfluencerSoft text editor) | not stated | Conditions of the program, commissions, levels, anti-spam rules, etc. Shown to partners in the Promotional Materials section of their cabinet. | not stated |
| Additional instructions | WYSIWYG | no | Shown to partners in the Instructions section of their cabinet. | not stated |

- **Buttons and actions:**
  - Add — adds another commission level (capped at 2).
  - Delete — removes a commission level.
  - Add a description to the page — opens Template Designer.
  - Edit Description / Clear Description — manage existing registration-page copy.
- **Tabs / subscreens:** Main Settings (Store Name, Money Back, Ways of Payout, Commissions, Period and Rules); Registration Page; Instructions for Partners; How It Works (informational: Technical Principles, How A Partner Is Attached, For the Developers).
- **Notes:**
  - Defaults set here can be overridden per product or per partner.
  - Two-level limit is hard.
  - A click is the trigger event — fired by a link click, a button/form with embedded UTM-tags, or an invoice generated with a discount coupon.
  - For partners to attach via a direct link, the click script code must be inserted on the advertising page.

### Screen: Affiliate Management and Reporting
- **Purpose:** Summary statistics for the entire affiliate program plus a per-partner table you can filter, drill into, and trigger payouts from.
- **How to open:** Affiliates section → Affiliate Management and Reporting (the main affiliate statistics page).
- **Fields (summary block at top):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Number of affiliates | metric | n/a | Total affiliates registered. | n/a |
| Amount of partner commissions earned | metric | n/a | Total commission earned across partners. | n/a |
| Amount of partner commissions to be paid | metric | n/a | Outstanding commission owed. | n/a |
| Number of clicks on partner links | metric | n/a | Total clicks. | n/a |
| Number of the subscribers from partners | metric | n/a | Subscribers attributed to partners. | n/a |
| Percentage (%) of the conversion to a contact | metric | n/a | Conversion rate. | n/a |
| Number of payments from partners | metric | n/a | Total partner-driven invoices. | n/a |

- **Filter fields:**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Partner login or email | text | no | Restricts the table to a single affiliate. | empty |
| Start date | date (calendar) | no | Start of period filter. | empty |
| End date | date (calendar) | no | End of period filter. | empty |

- **Per-partner table columns:** Earned (commission amount); Pay off (amount to pay); Clicks (number — clicking opens a chart); Contacts (subscriber count — opens the Subscribers page filtered by the partner); Payments (invoices from the partner's subscribers — opens the Invoices/Orders page filtered by the partner); Partners (2nd-level partners attracted by the selected partner).
- **Buttons and actions:**
  - Search — applies filter.
  - Clear — resets filter, restoring the full table.
  - Partner login / Payout — both open the Paying Off the Commissions to the Partner page. Payout appears only on rows with arrears.
  - Affiliate links area (upper right corner) — provides registration link and partner's cabinet link.
- **Notes:**
  - Default view shows data from yesterday; the table is updated once a day, so live payments can be slightly higher.
  - Only partners with arrears show a Payout button.

### Screen: Settings of the Partner Profile (partner-side)
- **Purpose:** Lets a partner edit name, phone, bank/PayPal payout details, and password. Email cannot be changed here.
- **How to open:** From inside the partner's account, click the top-right checkmark and choose Profile.
- **Tabs / subscreens:** Main settings; Bank account details to receive payments; Change password.
- **Fields (Main settings tab):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Your name | text | yes | Delete existing value and type the new name. | existing name |
| Account email | display (read-only) | n/a | Cannot be edited here; contact client support to change. | existing email |
| Your telephone number | text (with confirmation flow) | yes | Clicking it sends a confirmation code to your address; enter the code on the page that opens, then enter the new phone number. Must be a valid number or you cannot be identified. | existing phone |

- **Fields (Bank account details to receive payments / Payment methods):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| PayPal wallet | text | one of the two | Wallet number, displayed to the partnership program author. | empty |
| Bank account details | text | one of the two | Bank account details, displayed to the partnership program author. | empty |

- **Fields (Change password):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Current password | password | yes | Existing password. | empty |
| New password | password | yes | New password. | empty |
| Confirm new password | password | yes | Must match New password. | empty |

- **Buttons and actions:**
  - Save (Main settings) — persists the name change.
  - Save (Payment methods) — persists payment details.
  - Change (telephone flow) — confirms the new phone number after the code step.
- **Notes:**
  - Account email is read-only by design — security restriction. Use client support to change it.
  - Phone change requires a confirmation code sent to the partner's address.

### Screen: The Commissions for the Selected Partner
- **Purpose:** List of products with customized per-partner commission rates for one affiliate; entry point for editing or adding new individual rates.
- **How to open:** From a partner detail flow (e.g., Paying Off the Commissions to the Partner → Edit Commissions opens this list / window labelled "Edit Affiliate Commissions").
- **Fields:** A table of products that have a custom commission for the selected affiliate (column names not explicitly enumerated in source beyond product name and a last column with a cross mark to delete).
- **Buttons and actions:**
  - Add — opens Adding the Commissions for the Selected Partner (new individual commission).
  - Product name (clickable) — opens the same Adding/Editing page, prefilled, for that commission.
  - Cross mark (last column) — deletes the selected commission row.
- **Notes:**
  - "The application allows you to manage the individual affiliate's commissions for the selected partner."

### Screen: Adding the Commissions for the Selected Partner (Add / Edit individual commission)
- **Purpose:** Set an individual commission for one partner on one paid product. The Adding and Editing pages are identical except for their titles.
- **How to open:** The Commissions for the Selected Partner → Add (or click a product name to edit).
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Product | dropdown | yes | Paid products only. Options: drawn from paid product catalog (not enumerated in source). | none |
| Commission (per level) | number / percentage | yes | Fixed amount or percentage of product cost. Multi-level supported. | 2 levels shown |

- **Buttons and actions:**
  - Save — adds the custom commission and returns to the Edit Commissions list.
- **Notes:**
  - By default 2 levels of commissions are shown; multi-level rates can be set if needed.

### Screen: Paying Off the Commissions to the Partner
- **Purpose:** Per-partner page to notify the partner of a payout, view the transaction history, view their payment details, fetch their affiliate links, and open individual commission editing.
- **How to open:** Affiliate Management and Reporting → click the partner's login or the Payout button on their row.
- **Tabs / subscreens:** Paying Off; The History of Mutual Transactions; Payment Details.
- **Buttons and actions:**
  - Pay Out — forms and sends a payment notification to the partner. Does NOT actually transfer money — real payment is made from your wallets (not your InfluencerSoft balance).
  - Change (on history tab) — saves a corrected partner full name. Field used: full name.
  - Invoice number (in Description column, history tab) — opens the matching Invoice #… page.
  - Affiliate Links — opens that partner's Affiliate Link page (free-products tab and paid-products tab); contains the links with the partner's identifier embedded. A button labelled the same as the parent page returns you to Paying Off Commissions.
  - Edit Commissions — opens the Edit Affiliate Commissions window (= The Commissions for the Selected Partner) where individual rates can be set up.
- **Tab content notes:**
  - Paying Off tab — generate and send the payout notification.
  - The History of Mutual Transactions tab — history of payments; rename partner via full name + Change; click invoice number to open invoice.
  - Payment Details tab — view the partner's stored payment details (PayPal/bank).
- **Notes:**
  - Pay Out only sends a notification; it does NOT move money.

### Screen: The History of Payments to Partners
- **Purpose:** Global history of every payout you have issued to partners, with a summary block.
- **How to open:** Affiliates section → The History of Payments to Partners.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Summary (top of page) | metric block | n/a | Total amount, plus the same total broken down by form of payment. | n/a |
| Filter — period | date range | no | Sets the period to retrieve. | not stated |

- **Buttons and actions:** Filter controls (Search / Clear are implied as on other tables but not explicitly named in source).
- **Notes:** The body of the page is a table listing all individual payments.

### Screen: Adding and Editing Free Products (for the affiliate program)
- **Purpose:** Add a free product (lead magnet) that partners can promote, or edit an existing one. The Adding and Editing pages are identical except for their names.
- **How to open:** Promo for Affiliates. Free Product Promotional Materials → Add button (to add) or click a product name (to edit).
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Name | text | yes | Name of the free product. | empty |
| Category | dropdown | yes | Product category. Options: not enumerated in source. | none |
| Description | text / WYSIWYG (assumed) | not stated | Info for partners about the product and the conditions of its advertising. | empty |
| Link | URL | yes | Link to the free product. | empty |
| Display a Direct Link for Partners | checkbox | no | Enables a direct affiliate link. Requires copying the provided script code and inserting it on the advertising page. | unchecked |
| Add Material Link | text / URL | no | Additional information link for affiliates. | empty |

- **Buttons and actions:**
  - Save — saves the product and adds it to the Promo for Affiliates. Free Product Promotional Materials page.
- **Notes:**
  - The Direct Link option only works if the click script is inserted on the advertising page.

### Screen: Promo for Affiliates. Free Product Promotional Materials (list)
- **Purpose:** Manage the catalog of free products available for partners to promote, plus per-product promotional materials.
- **How to open:** Affiliates section → Promo for Affiliates. Free Product Promotional Materials.
- **Fields (filter):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Identifier | text | no | Product ID. | empty |
| Name | text | no | Product name. | empty |
| Description | text | no | Product description. | empty |
| Category | dropdown | no | Product category. Options: not enumerated in source. | empty |

- **Table columns:** Product name (clickable to edit); Status (slider — left = inactive/dark gray, right = active); Offers (numeric — click to open per-product Selected Free Product Promotional Materials); a delete column with a cross mark.
- **Buttons and actions:**
  - Add — opens Adding and Editing Free Products to add a new free product.
  - Search — applies filter.
  - Filter / Clear — open the filter, then clear to show the full table.
  - Status slider — toggle product availability for partners.
  - Cross mark — deletes the product from the affiliate program. Does NOT delete it from the InfluencerSoft system, only makes it unavailable to partners.
  - Paid — navigates to Promo for Affiliates. Paid Product Promotional Materials.
  - For Partners — navigates to Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials.
- **Notes:**
  - The Affiliate Program stores the link from which a person came — even if it was a subscription page for a free magnet, the partner still gets commission for the eventual purchase.

### Screen: Promo for Affiliates. Paid Product Promotional Materials (list)
- **Purpose:** Manage paid products that are available for affiliate promotion, plus their promotional materials.
- **How to open:** Affiliates section → Promo for Affiliates. Paid Product Promotional Materials (or from the Free list / Multi-leveled list via the Paid button).
- **Fields (filter):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Identifier | text | no | Product ID. | empty |
| Name | text | no | Product name. | empty |
| Description | text | no | Product description. | empty |
| Category | dropdown | no | Product category. Options: not enumerated in source. | empty |

- **Table columns:** Product name (click to edit on the product editing page); Status (slider, left = inactive/dark gray, right = active); Offers (numeric — opens Selected Paid Product Promotional Materials); cross-mark delete column.
- **Buttons and actions:**
  - Search — applies filter.
  - Filter / Clear — open filter, then reset table.
  - Status slider — activate/deactivate for partners.
  - Cross mark — deletes the product from the affiliate program (in the paid list, source says "completely").
  - Free — navigate to free product promo list.
  - For Partners — navigate to multi-leveled program promo list.
- **Notes:**
  - Unlike free products, paid products are added to this list at the moment the product is created/edited, by ticking the **Display to partners** checkbox in the product's **Affiliates** tab.

### Screen: Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials (list)
- **Purpose:** Manage promotional materials for the multi-leveled affiliate program itself — i.e., for the program registration page that lets low-level partners join.
- **How to open:** Affiliates section → Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials (or via the For Partners button on the Free / Paid lists).
- **Fields:** A single registration link to the program is displayed.
- **Table columns:** Name (click to edit description); Status (slider); Offers (numeric — opens Promotional Materials for Attracting the Partners).
- **Buttons and actions:**
  - Click name — edit the description of the affiliates program.
  - Status slider — activate/deactivate the registration link for low-level partners; deactivation hides it from their cabinets.
  - Paid — navigate to paid product promo list.
  - Free — navigate to free product promo list.
- **Notes:**
  - This list governs only the multi-leveled program registration, not individual products.

### Screen: Selected Free Product Promotional Materials (per-product list)
- **Purpose:** Manage banners, advertising texts, and (one) subscription form attached to a single free product.
- **How to open:** Promo for Affiliates. Free Product Promotional Materials → click the number in the Offers column.
- **Buttons and actions:**
  - Add Banner — opens Drafts for Partners. Adding and Editing an Advertising Banner.
  - Add Text — opens Drafts for Partners. Adding and Editing an Advertising Text.
  - Add Subscription Form — opens Drafts for Partners. Adding and Editing a Subscription Form. Becomes inactive (changes from dark-green to light-green) after one subscription form has been added — only one form per free product is allowed.
  - Material column (name/image) — opens the editing page for that promo.
  - Sorting column arrows — reorder materials.
  - Promotional Materials for Free Product button (bottom) — returns to the parent list.
- **Notes:**
  - Banners and texts: unlimited. Subscription form: one per free product.

### Screen: Selected Paid Product Promotional Materials (per-product list)
- **Purpose:** Manage banners and advertising texts attached to a single paid product, plus a per-product toggle controlling partner-side button/form generation.
- **How to open:** Promo for Affiliates. Paid Product Promotional Materials → click the number in the Offers column.
- **Buttons and actions / fields:**

| Element | Type | Description |
|---------|------|-------------|
| Add Banner | button | Opens Drafts for Partners. Adding and Editing an Advertising Banner. |
| Add Text | button | Opens Drafts for Partners. Adding and Editing an Advertising Text. |
| Affiliate's Form/Button Generator | toggle | Permits or forbids partners to generate the order button/form inside their partner's cabinet. |
| Material column | click | Opens the promo's editing page. |
| Sorting column | arrows | Reorders materials. |
| Cross mark (last column) | icon button | Deletes the promotional material. |
| Promotional Materials for Paid Product | button | Returns to the parent list. |

- **Notes:**
  - No subscription form for paid products (unlike free products).

### Screen: Promotional Materials for Attracting the Partners (per multi-leveled program list)
- **Purpose:** Add banners and advertising texts shown to potential lower-level partners. They appear in the partner's cabinet.
- **How to open:** Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials → click the number in the Offers column.
- **Buttons and actions:**
  - Add Banner — opens Drafts for Partners. Adding and Editing an Advertising Banner.
  - Add Text — opens Drafts for Partners. Adding and Editing an Advertising Text.
  - Material column (name or image) — opens editing page for that promo.
  - Sorting column arrows — reorder materials.
  - Cross mark (last column) — deletes the promotional material.
  - Promotional Materials for Paid Product button (bottom) — returns to the paid materials list.
- **Notes:**
  - No subscription form option at this level.

### Screen: Drafts for Partners. Adding and Editing an Advertising Banner
- **Purpose:** Add or edit a graphical (image) banner for partners. Adding and Editing pages are identical except for name.
- **How to open:** Any Selected … Promotional Materials list → Add Banner; or click an existing banner to edit.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Image source — Select file | file (upload) | one of the two | Upload an image from your computer. | none |
| URL address | URL | one of the two | Use an image hosted elsewhere. | empty |
| Banner Description | text | not stated | Explanatory text for the image. | empty |

- **Buttons and actions:** Select file (file picker); Save (adds the banner to the promotional materials list).

### Screen: Drafts for Partners. Adding and Editing an Advertising Text
- **Purpose:** Add or edit a text advertising material for partners. Adding and Editing pages are identical except for name.
- **How to open:** Any Selected … Promotional Materials list → Add Text; or click an existing text to edit.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Article Text | rich text | yes | Body of the ad. | empty |
| Article text (explanatory) | text | no | Explanatory text — e.g., newsletter, social-network slogan. | empty |

- **Buttons and actions:**
  - Insert affiliate link — wraps the currently-selected text in `#a#link#/a#` tags so the partner's affiliate link is substituted there.
  - Save — adds the text to the promotional materials list.

### Screen: Drafts for Partners. Adding and Editing a Subscription Form
- **Purpose:** Add or edit a subscription form for partners. The partner's login is embedded in the form by default so subscribers via that form are auto-assigned to the partner. Adding and Editing pages are identical except for name.
- **How to open:** Selected Free Product Promotional Materials → Add Subscription Form (or click an existing form name).
- **Tabs / subscreens:** The Main Parameters; The Additional Fields.
- **Fields (The Main Parameters tab):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Subscription Form Description | text | no | Comments / instructions about the form for partners. | empty |
| Add to group(s) | category/group tree with check-boxes | yes | Click blue folders to navigate categories; check a group, or check the category check-box to select all groups in it. Group list: not enumerated in source. | none |
| Exclude from group(s) | category tree (optional) | no | Optionally remove subscribers from groups they were previously added to. | none |
| Subscription Activation | checkbox | no | Available only on the "Guru" tariff. When ticked, subscribers are added to the database without an activation letter. Source warns against using it: increases wrong-address counts and spam risk. | unchecked |
| URL after the subscription | URL | no | Redirect URL after subscription. Can be left as default. | default |
| URL after activation | URL | no | Redirect URL after activation. Can be left as default. | default |
| Allow partner's UTM-tags in URL after activation | checkbox (assumed) | no | Lets the partner's UTM-tags pass through to the post-activation URL for statistics, enabling tracking of the same form used on different pages. | unchecked |

- **Fields (The Additional Fields tab):**

| Field | Type | Required | Description / Allowed values | Default |
|-------|------|----------|-------------------------------|---------|
| Field check-boxes | checkbox list | no | Tick to include each optional field on the form. Field list: not enumerated in source. | unchecked |
| Required block | checkbox list | no | After a field is selected, tick its Required check-box to make it mandatory. | unchecked |

- **Buttons and actions:**
  - Save — adds the form to the promotional materials list (Selected Free Product Promotional Materials).
- **Notes:**
  - Each partner can adjust how the form will look in their own cabinet.
  - Subscription Activation skip-confirmation is only available on the Guru tariff; even then the source recommends against it.

## Common tasks

### How do I set up an affiliate program for the first time?
1. Open Affiliates → How to Setup an Affiliate Program.
2. In Main Settings, enter Store Name (the name partners will see at registration).
3. Decide on Money Back — tick Subtract Commission in the Case of Moneyback if you want refunds to claw back partner commissions.
4. Configure Ways of Payout — at minimum offer PayPal wallet and Bank details so partners can choose.
5. Configure Commissions for level 1 (and level 2 if you want a two-level program). Use a fixed amount, fixed amount with discount, or a percentage. Use the Add button to add the second level; Delete removes a level. Levels are capped at two.
6. Set the Period and Rules of Calculating Commissions — Fee period (1–365 days, or forever); choose which partner gets the fee in chained-click situations; tick the "customer already in your database" exclusion if needed; decide whether to credit a partner when the final purchase was through a direct link.
7. Open the Registration Page section and copy the Link to the Partner Registration Page. Optionally click Add a description to the page to build a landing description in the Template Designer.
8. Open Instructions for Partners and write the main instruction (shown in the partner's cabinet Promotional Materials section). Optionally add Additional instructions (shown in the Instructions section).
9. Save / persist (source does not name a single explicit Save button on this page).

**Result:** Your affiliate program is live; the registration link can be shared and partners can sign up.
**Options along the way:** Defaults can be overridden later per product (in the product Affiliates tab) or per partner (Adding the Commissions for the Selected Partner).
**Gotchas:**
- The Moneyback setting is captured at bill-generation time; changing it later does not retroactively change past bills. Edit the order card manually if you need to.
- Two-level cap is fixed.
- Direct-link tracking only works if the click script is inserted on the advertising page.

### How do I add a free product partners can promote?
1. Go to Affiliates → Promo for Affiliates. Free Product Promotional Materials.
2. Click Add.
3. Enter the product Name and select a Category.
4. Fill in Description (info for partners + advertising conditions).
5. Paste the Link to the free product.
6. (Optional) Tick Display a Direct Link for Partners — copy the provided script code and insert it on your advertising page.
7. (Optional) Fill Add Material Link with extra info for affiliates.
8. Click Save.

**Result:** The product appears on the Free Product Promotional Materials page and is available for partners.
**Gotchas:** Direct link does not work without the click script on the destination page.

### How do I add a paid product to the affiliate program?
1. Open the paid product's edit page (outside Affiliates, via the product catalog).
2. Go to the Affiliates tab on that product.
3. Tick Display to partners.
4. Save the product.

**Result:** The product appears on Promo for Affiliates. Paid Product Promotional Materials.

### How do I deactivate or delete an affiliate product?
1. Go to Promo for Affiliates. Free Product Promotional Materials or Promo for Affiliates. Paid Product Promotional Materials.
2. To deactivate, move the Status slider to the left — the button turns dark gray and the product is hidden from partners. Move it right to reactivate.
3. To remove from the program, click the cross mark in the last column.

**Result:** Deactivated products are hidden from partners but still in your system. Deleted products are removed from the affiliate program (not from InfluencerSoft entirely, per source).

### How do I create a banner for partners?
1. Open the Selected Free / Paid / Attracting the Partners list (Offers column from the parent page).
2. Click Add Banner.
3. Either click Select file to upload an image, or enter the URL address of an externally hosted image.
4. Fill Banner Description with explanatory text.
5. Click Save.

**Result:** The banner appears in the materials list for that product (or for the multi-leveled program).
**Options along the way:** You can add as many banners as you want per product.

### How do I create a text advertisement for partners?
1. In the relevant Selected … Promotional Materials list, click Add Text.
2. Type the ad copy into Article Text.
3. To insert the partner's affiliate link inline: select the anchor text and click Insert affiliate link — InfluencerSoft wraps the selection in `#a#link#/a#` tags.
4. Optionally fill the explanatory Article text field (newsletter slogan, etc.).
5. Click Save.

**Result:** The text appears in the materials list.

### How do I create a subscription form for partners?
1. Open Selected Free Product Promotional Materials for the relevant free product.
2. Click Add Subscription Form (only available if no form has been added yet — otherwise the button is light-green and inactive).
3. On The Main Parameters tab: enter Subscription Form Description; select the target group(s) by ticking check-boxes (click blue folders to navigate, click a category check-box to select every group inside).
4. Optionally select groups to exclude.
5. On the Guru tariff, optionally tick Subscription Activation to skip the activation email — source advises against it (increases wrong addresses + spam risk).
6. Adjust URL after the subscription and URL after activation if you have custom thank-you pages.
7. Allow the partner's UTM-tags in the URL after activation if you want per-page tracking.
8. Switch to The Additional Fields tab and tick the form fields you want to display; in the Required block tick the ones to make mandatory.
9. Click Save.

**Result:** The form is added to the free product's promotional materials list. Only one subscription form per free product is allowed.

### How do I add promotional materials to attract new partners (multi-leveled program)?
1. Open Affiliates → Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials.
2. Click the number in the Offers column to open Promotional Materials for Attracting the Partners.
3. Use Add Banner / Add Text to add materials.
4. Reorder with the Sorting arrows; delete via cross mark.

**Result:** Materials appear in the partner's cabinet for promoting your registration link to new lower-level partners.

### How do I set a custom commission for a specific partner?
1. From Affiliate Management and Reporting, click the partner's login (or Payout) to open Paying Off the Commissions to the Partner.
2. Click Edit Commissions to open the Edit Affiliate Commissions window (The Commissions for the Selected Partner).
3. Click Add (or click an existing product to edit).
4. Select the Product from the dropdown.
5. Set Commission values per level (fixed amount or percentage). Use the second level if you run a two-level program.
6. Click Save.

**Result:** The custom rate appears on the Commissions for the Selected Partner table and overrides the program default for that partner on that product.

### How do I delete a per-partner commission?
1. Open The Commissions for the Selected Partner for that partner.
2. Click the cross mark in the last column on the relevant row.

**Result:** That custom override is removed; the partner falls back to the program/product default commission.

### How do I pay a partner?
1. Open Affiliate Management and Reporting.
2. Find the partner with arrears (only those rows show a Payout button).
3. Click Payout (or click the partner's login) to open Paying Off the Commissions to the Partner.
4. On the Paying Off tab, click Pay Out to send the partner a payment notification.
5. Actually transfer the money from your own wallet (PayPal, bank transfer, etc.) — InfluencerSoft does not move funds.
6. Optionally use the Payment Details tab to confirm the partner's stored payout details before paying.

**Result:** The partner receives a payout notification; the transaction shows up under The History of Mutual Transactions for that partner and under The History of Payments to Partners globally.
**Gotchas:**
- Pay Out is a notification only; real money movement is your responsibility.
- The Affiliate Management table updates only once a day, so live arrears can be slightly higher than what is shown.

### How do I rename a partner?
1. Open Paying Off the Commissions to the Partner for the partner.
2. Switch to The History of Mutual Transactions tab.
3. Edit the full name field and click Change.

**Result:** The partner's display name is updated.

### How do I see a specific partner's affiliate links?
1. Open Paying Off the Commissions to the Partner for that partner.
2. Click Affiliate Links.
3. Switch between the free products tab and the paid products tab to see each set of links with the partner's identifier embedded.
4. Click the same-named button at the bottom of the page to return to Paying Off Commissions.

### How do I see overall affiliate performance?
1. Open Affiliate Management and Reporting.
2. Read the summary block at the top (totals for affiliates, commissions earned, commissions to pay, clicks, subscribers, conversion %, payments).
3. Apply Filter by partner login/email and/or by start/end date, click Search.
4. Drill into a row: click Clicks (chart), Contacts (filtered Subscribers page), Payments (filtered Invoices/Orders page), or Partners (2nd-level partners).
5. Click Clear to reset the filter to the full table.

**Result:** You see program-wide and per-partner KPIs and can pivot into the related areas of InfluencerSoft.
**Gotchas:** Default view is yesterday's data — refresh runs once daily.

### How do I review past payouts across all partners?
1. Open Affiliates → The History of Payments to Partners.
2. Read the summary block: total amount + breakdown by form of payment.
3. Use the date-period Filter to narrow to a window.

**Result:** A table of every payout you have made, broken down by payment form.

### How do I (as a partner) update my payout details?
1. Click the top-right checkmark inside the partner's account and choose Profile.
2. Open Bank account details to receive payments.
3. Enter your PayPal wallet number or bank account details (these will be shown to the partnership program author).
4. Click Save.

### How do I (as a partner) change my name?
1. Profile → Main settings.
2. Clear Your name and type the new name.
3. Click Save.

### How do I (as a partner) change my phone number?
1. Profile → Main settings → click Your telephone number.
2. A confirmation code is sent to your address.
3. Enter the code on the page that opens.
4. Enter the new phone number.

**Gotchas:** The phone number must be valid — otherwise the system cannot identify you.

### How do I (as a partner) change my email?
You cannot change it yourself — contact the client support service.

### How do I (as a partner) change my password?
1. Profile → Change password.
2. Type the existing password in Current password.
3. Type the new password in New password and again in Confirm new password.
4. Save (Save button per source convention).

### How do I allow / forbid partners from generating their own order buttons or forms for a paid product?
1. Open Selected Paid Product Promotional Materials for the product.
2. Toggle Affiliate's Form/Button Generator on (permit) or off (forbid).

**Result:** Partners in their cabinet either can or cannot generate order buttons/forms for that paid product.

### How do I deactivate the multi-leveled program registration link?
1. Open Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials.
2. Move the slider in the Status column to the left.

**Result:** The registration link disappears from partners' cabinets; the button turns dark gray. Move the slider right to restore.

## Cross-references
- **Related section:** Products — paid products are added to the affiliate program by ticking Display to partners on the product's Affiliates tab. See the product editing page (https://help.influencersoft.com/hc/en-us/articles/360050850851-Adding-and-Editing-a-Product-).
- **Related section:** Page Builder / Template Designer — used to build the partner registration page description (https://help.influencersoft.com/hc/en-us/articles/360050388752-Creating-and-Editing-Pages-in-the-Page-Builder).
- **Related section:** Forms — Form Constructor pages can carry partner UTM-tags for click attribution (https://help.influencersoft.com/hc/en-us/articles/360050394552-Form-Constructor-Subscriptions-and-Orders-).
- **Related section:** Buttons — Order buttons can also carry partner UTM-tags (https://help.influencersoft.com/hc/en-us/articles/360050850991-Order-Buttons-).
- **Related section:** Discounts — a discount-coupon invoice can attach a partner without any click on a UTM-tagged link (https://help.influencersoft.com/hc/en-us/articles/360044766911-How-to-Create-to-Edit-a-Discount).
- **Related section:** Subscribers — partner-attributed subscribers open here when you click Contacts on Affiliate Management (https://help.influencersoft.com/hc/en-us/articles/360050850591-Subscribers-).
- **Related section:** Orders / Invoices — partner-attributed invoices open here from the Payments column and from the History of Mutual Transactions (https://help.influencersoft.com/hc/en-us/articles/360050851031-Orders-).
- **Related section:** Partner's Cabinet — partner-side view where all promotional materials, instructions, and links appear (https://help.influencersoft.com/hc/en-us/articles/360050391592-Partner-s-Cabinet-).

## Source articles
- [Adding and Editing Free Products](https://help.influencersoft.com/hc/en-us/articles/360050526631-Adding-and-Editing-Free-Products)
- [Adding the Commissions for the Selected Partner](https://help.influencersoft.com/hc/en-us/articles/360050065912-Adding-the-Commissions-for-the-Selected-Partner)
- [Affiliate Management and Reporting](https://help.influencersoft.com/hc/en-us/articles/360050057752-Affiliate-Management-and-Reporting)
- [Drafts for Partners. Adding and Editing a Subscription Form](https://help.influencersoft.com/hc/en-us/articles/360050852111-Drafts-for-Partners-Adding-and-Editing-a-Subscription-Form)
- [Drafts for Partners. Adding and Editing an Advertising Banner](https://help.influencersoft.com/hc/en-us/articles/360050390452-Drafts-for-Partners-Adding-and-Editing-an-Advertising-Banner)
- [Drafts for Partners. Adding and Editing an Advertising Text](https://help.influencersoft.com/hc/en-us/articles/360050390592-Drafts-for-Partners-Adding-and-Editing-an-Advertising-Text)
- [How to Setup an Affiliate Program](https://help.influencersoft.com/hc/en-us/articles/360050390812-How-to-Setup-an-Affiliate-Program)
- [Paying Off the Commissions to the Partner](https://help.influencersoft.com/hc/en-us/articles/360050525811-Paying-Off-the-Commissions-to-the-Partner)
- [Promo for Affiliates. Free Product Promotional Materials](https://help.influencersoft.com/hc/en-us/articles/360050525831-Promo-for-Affiliates-Free-Product-Promotional-Materials)
- [Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials](https://help.influencersoft.com/hc/en-us/articles/360050065192-Promo-for-Affiliates-Multi-leveled-Affiliates-Program-Promotional-Materials)
- [Promo for Affiliates. Paid Product Promotional Materials](https://help.influencersoft.com/hc/en-us/articles/360050525951-Promo-for-Affiliates-Paid-Product-Promotional-Materials)
- [Promotional Materials for Attracting the Partners](https://help.influencersoft.com/hc/en-us/articles/360050526011-Promotional-Materials-for-Attracting-the-Partners)
- [Selected Free Product Promotional Materials](https://help.influencersoft.com/hc/en-us/articles/360050852291-Selected-Free-Product-Promotional-Materials)
- [Selected Paid Product Promotional Materials](https://help.influencersoft.com/hc/en-us/articles/360050852311-Selected-Paid-Product-Promotional-Materials)
- [Settings of the Partner Profile](https://help.influencersoft.com/hc/en-us/articles/360051189571-Settings-of-the-Partner-Profile)
- [The Commissions for the Selected Partner](https://help.influencersoft.com/hc/en-us/articles/360050526431-The-Commissions-for-the-Selected-Partner)
- [The History of Payments to Partners](https://help.influencersoft.com/hc/en-us/articles/360050852331-The-History-of-Payments-to-Partners)



---


# Advertise

## Overview
The Advertise area is the partner / affiliate side of InfluencerSoft. Each user has a Partner's Cabinet that lists every affiliate program they are a member of, exposes the program's promotional materials, generates trackable affiliate links, and reports on the leads, orders, commissions, referrals, and downstream partners those links produced. It is the place a partner goes to grab a link or banner, drop UTM tags on it, see who subscribed or bought through it, and check how much commission has been charged or paid out. This chapter documents the catalog (Partner's Cabinet), the per-program menu (Instructions, Offers, the three Promotional Drafts pages, Leads, Orders, Referrals, Partners From You, Payments, Contact the Author) and the workflows that span them.

## Where to find it
- Top menu → **Advertise** → opens the Partner's Cabinet catalog (list of affiliate programs you are a member of).
- From the catalog, click an affiliate program name to enter that program. The left menu changes to show: **Offers**, **Instructions** (only if the author added it), **Promotional Drafts for Free Products**, **Promotional Drafts for Paid Products**, **Advertising Blanks for Partner Registration**, **Leads**, **Orders**, **Referrals**, **Partners From You**, **Payments**, **Contact the Author**.
- **Catalog** button (inside a program) → returns to the Partner's Cabinet main page.

## Terminology
- **Affiliate program / Affiliate's program** — A program created by an author that you have joined as a partner.
- **Partner's Cabinet** — Your top-level Advertise page listing every affiliate program you have joined.
- **Author** — The owner of the affiliate program. Sets the promotional materials, prices, commissions, and instructions.
- **Affiliate link** — A URL with your partner identifier embedded. Sending traffic through it credits the resulting leads, orders, and partner sign-ups to you.
- **Offer** — A promotional material entry shown on the Offers page. Offers are grouped Free / Paid / Partners.
- **Free magnet** — A free product (lead magnet) offered for subscription. Listed under the **Free** tab on Offers.
- **Paid product** — A product sold for money, with partner price/conditions block. Listed under the **Paid** tab on Offers.
- **Multi-level affiliates program / Attracting partners** — Recruiting second-level partners. Listed under the **Partners** tab on Offers.
- **Advertising Draft / Promotional Draft** — A pre-built creative (link, banner, article, or subscription form) prepared by the author for partners to use.
- **Advertising Blanks for Partner Registration** — Promotional materials specifically for recruiting second-level partners.
- **Ad Tag / Advertising Tag** — A UTM-tag set (source, medium, campaign, ad, keywords) appended to an affiliate link for traffic-source reporting.
- **New Campaign window** — Modal opened by **Add an Ad Tag** / **Add Advertising Tag** to build a UTM-tagged link.
- **UTM-tags** — Parameters added to a link to attribute traffic to a source, channel, campaign, ad, or keyword.
- **Your Affiliate Link** — Field on Offers / Advertising Blanks that holds the partner's link to an advertised page.
- **Your Link for Counting Clicks / Your Reference-Counting of Clicks** — Output field on the New Campaign window holding the tagged link.
- **Advertising Banners** — Image creatives with HTML code containing the affiliate link.
- **Advertising Articles** — Pre-formatted text creatives with HTML code containing the affiliate link.
- **Subscription Form Generator** — Tool on the free-product drafts page that produces an HTML subscription form with the partner's tag baked in.
- **Instructions** — Optional author-supplied guidance shown as a menu item only when the author added it.
- **Referral** — A visitor that followed your affiliate link to a page.
- **Lead** — A contact that subscribed via your affiliate link.
- **Order** — A purchase billed under your affiliate link, with associated commission.
- **Partners From You** — Second-level partners who signed up through your referral link.
- **Payments** — Report of commissions charged and paid out to you.
- **Favorites** — Pinned affiliate programs in the catalog, marked by a yellow star.
- **First click / Last click** — Attribution model selectable in the Leads filter.

## Screens and fields

### Screen: Partner's Cabinet (catalog)

- **Purpose:** Main page of the Advertise area. Lists every affiliate program you belong to with summary statistics.
- **How to open:** Top menu → **Advertise**. From inside a program, click **Catalog**.
- **Fields:** Each row is one affiliate program.

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Star (Favorites) | toggle | n/a | Click to add the program to Favorites; star turns yellow. Click again to remove; star turns gray. Favorites display at the top of the page. | Gray (off) |
| Program name | link | n/a | Clicking transfers you into the selected affiliate program; menu changes to show program-specific items. | n/a |
| Summary statistics columns | display | n/a | Per-program summary (not enumerated in source). | n/a |
| Cross mark (last column) | action | n/a | Deletes the affiliate program from your list. | n/a |

- **Buttons and actions:**
  - **Star icon** — toggles Favorites for the program.
  - **Program name** — opens the program (transfers to it; left menu changes).
  - **Cross mark** — deletes the affiliate program from the cabinet.
  - **Search** (in filters) — applies filter values.
  - **Clear** (in filters) — resets the filter and shows the entire table.
- **Tabs / subscreens:** Filters area at top of the page.
- **Notes:** By default data for the whole period is shown.

### Screen: Partner's Cabinet — Filters

- **Purpose:** Restrict catalog rows by time period and/or affiliate name.
- **How to open:** Filters tab on the Partner's Cabinet page.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Period | date range | No | Beginning and end of the reporting period. | Whole period |
| Affiliate name | text | No | Name of a particular affiliate to filter by. | empty |

- **Buttons and actions:**
  - **Search** — applies filter values; you do not have to fill in every field.
  - **Clear** — resets the filter and shows the entire table.

### Screen: Program menu (after entering a program)

- **Purpose:** Left-hand navigation that replaces the catalog menu once you click into an affiliate program.
- **How to open:** Click a program name in the Partner's Cabinet.
- **Items (as referenced across source articles):**
  - **Offers**
  - **Instructions** (conditional — see Notes)
  - **Promotional Drafts for Free Products**
  - **Promotional Drafts for Paid Products**
  - **Advertising Blanks for Partner Registration**
  - **Leads**
  - **Orders**
  - **Referrals**
  - **Partners From You**
  - **Payments**
  - **Contact the Author**
  - **Catalog** (button — returns to the Partner's Cabinet main page)
- **Notes:** **Instructions** is shown only if the author of the affiliate program added it; otherwise the menu item has no entry or content.

### Screen: Instructions

- **Purpose:** Display author-supplied instructions for partners.
- **How to open:** Program menu → **Instructions** (visible only when the author has added instructions).
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Instruction text | display | n/a | Text body authored in the affiliate program settings. | n/a |
| Promotional page link | link | n/a | Link to the promotional page. | n/a |

- **Notes:** If the author has not added instructions, the menu item is absent. Authors add the content under the affiliate program settings in the affiliate cabinet.

### Screen: Offers

- **Purpose:** Catalog of all promotional materials prepared by the author of the affiliate program, with affiliate links for each.
- **How to open:** Program menu → **Offers**.
- **Tabs / subscreens:** Three group buttons at the top of the list:
  - **Free** — free magnets (opens by default).
  - **Paid** — paid products. Adds a block with prices and conditions for partners for each product.
  - **Partners** — attracting partners (multi-level affiliates program).

  The structure of the tabs is identical and the function on all tabs is the same, except that the **Paid** tab additionally shows partner prices/conditions per product.
- **Fields (per row):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Program description | display | n/a | Shown at the top of the page only if the author added it. | n/a |
| Product / page name (first column) | link | n/a | Clicking opens the advertised page (subscription page, selling page, or partner registration page, depending on the tab). | n/a |
| Your Affiliate Link | link | n/a | Link to the same advertised page with the partner's affiliate identification built in. Use this for advertising. | n/a |
| Chain-shackle icon | action | n/a | Opens UTM-tag builder (Ad Tag) for the link. | n/a |
| Advertising Drafts (count) | numeric link | n/a | Number of materials prepared by the author. Click to go to the promotional materials page. If the value is `1`, there is no advertising material — opening it still shows the available affiliate link as in the **Your Affiliates link** column. | n/a |
| Prices and conditions (Paid tab only) | display | n/a | Block with prices and conditions for partners per product. | n/a |

- **Buttons and actions:**
  - **Free** — switches to the Free magnets tab (default).
  - **Paid** — switches to the Paid products tab; adds price / conditions block.
  - **Partners** — switches to the multi-level affiliates list.
  - **Chain shackle icon** — opens **New Campaign** window for UTM tagging.
  - **Add an Ad Tag** button — opens the **New Campaign** button/window (per source wording).
- **Notes:** When the Advertising Drafts count is 1 (meaning no creative), the destination page still exposes the same affiliate link as the Offers row.

### Screen: New Campaign (UTM-tag builder)

- **Purpose:** Build a UTM-tagged affiliate link for tracking by source, campaign, ad, and keywords.
- **How to open:**
  - Offers row → chain-shackle icon next to a link, **or** **Add an Ad Tag** button on Offers.
  - Advertising Blanks for Partner Registration → **Add an Ad Tag** button.
  - Promotional Drafts for Free Products → **Add Advertising Tag** button.
  - Promotional Drafts for Paid Products → **Add Advertising Tag** button.
  - Subscription Form Generator → **Advertising Tag** block (same effect inside the form).
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Source of traffic | text / dropdown (assumed) | Yes (implied) | Where the traffic originates. Examples from source: `email` for mailing-list traffic, `site` for a website, `Yandex` or `Google` for contextual advertising. (Options not enumerated as a fixed list.) | empty |
| Advertising campaign | text | No | Free-form. Set for more detailed statistics. | empty |
| Ad | text | No | Free-form. Set for more detailed statistics. | empty |
| Keywords | text | No | Free-form. Set for more detailed statistics. Source-dependent meaning (e.g., for a site = a page or banner image; for a mailing list = group of contacts or email subject). | empty |
| Your Affiliate Link / Your Link for Counting Clicks / Your Reference-Counting of Clicks | text (output) | n/a | The generated tagged link. Copy this and paste into the corresponding advertising campaign. The exact field label varies by source screen: **Your Affiliate Link** (Advertising Blanks), **Your Link for Counting Clicks** (Offers), **Your Reference-Counting of Clicks** (Promotional Drafts for Free / Paid Products). | n/a |

- **Buttons and actions:** Source does not enumerate explicit confirm/cancel buttons — once the link is formed, copy it from the output field.
- **Notes:** Campaign / ad / keywords are optional but recommended for detailed statistics. Their meaning depends on the chosen source (e.g., site → page or banner; mailing list → contact group or email subject).

### Screen: Promotional Drafts for Free Products

- **Purpose:** Show the advertising drafts the author prepared for a free product, and let you grab a link, banner, article, or generated subscription form.
- **How to open:** Program menu → **Promotional Drafts for Free Products**, or click the Advertising Drafts number on a Free-tab Offers row.
- **Tabs / subscreens:** The number of tabs depends on which promotional materials the author provided. Possible tabs:
  - **Link** (Getting an Affiliate Link)
  - **Advertising Banners**
  - **Advertising Articles**
  - **Subscription Form Generator** (with sub-blocks: Additional Fields, Block Type, Form View, Button View, Advertising Tag)
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Link | text (output) | n/a | The available affiliate link for advertising, at the top of each tab. | n/a |
| HTML code (Banners tab) | text (output) | n/a | HTML snippet — when inserted into a page, displays the image with the built-in affiliate link. Clicking the banner goes to the advertising page. | n/a |
| HTML code (Articles tab) | text (output) | n/a | HTML snippet — when inserted into a page, displays the author-formatted text with the built-in affiliate link. | n/a |
| Subscription form code | text (output) | n/a | HTML code for inserting the generated subscription form into a page. The form carries the partner's tag so subscribers are assigned to the partner. | n/a |

- **Buttons and actions:**
  - **Add Advertising Tag** — opens the **New Campaign** window for UTM tagging (see Screen: New Campaign).
- **Notes:** The Subscription Form Generator is split into Additional Fields, Block Type, Form View, Button View, and Advertising Tag (documented as separate sub-screens below). The author sets general settings of the form; design is set up in this tab. The current view of the form is displayed at the end of the tab; at the very end is the HTML code for inserting the form into the page.

### Screen: Subscription Form Generator — Additional Fields

- **Purpose:** Enable or disable display of field names inside the input fields of the subscription form.
- **How to open:** Promotional Drafts for Free Products → **Subscription Form Generator** tab → **Additional Fields** block.
- **Fields:** Block-level toggles to enable / disable showing field names inside input fields (specific labels not enumerated in source).

### Screen: Subscription Form Generator — Block Type

- **Purpose:** Set up the overall look of the subscription block.
- **How to open:** Subscription Form Generator → **Block Type** block.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Texture | selector | No | Select a background texture. Options: not enumerated in source. | n/a |
| Round the corners | toggle / selector | No | Round corner setting. Options: not enumerated in source. | n/a |
| 3D shadow | toggle | No | Apply shadow to make the block 3D. | n/a |

### Screen: Subscription Form Generator — Form View

- **Purpose:** Configure form geometry and subscriber-stats display.
- **How to open:** Subscription Form Generator → **Form View** block.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Width | numeric / selector | No | Width of the form. | n/a |
| Form of input fields | selector | No | Shape/style of input fields. Options: not enumerated in source. | n/a |
| Display subscriber's statistics | toggle | No | Whether subscriber statistics are displayed. | n/a |

### Screen: Subscription Form Generator — Button View

- **Purpose:** Configure the subscription form's submit button.
- **How to open:** Subscription Form Generator → **Button View** block.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Button color | selector | No | Pick a color. Options: not enumerated in source. | n/a |
| Button name | text | No | Rename the button. | n/a |
| Upload your button | file | No | Replace the default button with your own image. | n/a |

### Screen: Subscription Form Generator — Advertising Tag

- **Purpose:** Add UTM-tags to the subscription form's affiliate link, equivalent to the **Add Advertising Tag** button.
- **How to open:** Subscription Form Generator → **Advertising Tag** block.
- **Fields:** Same as Screen: New Campaign (source, campaign, ad, keywords). After completing settings, copy the form's code and insert it into the necessary part of the page.

### Screen: Promotional Drafts for Paid Products

- **Purpose:** Show the advertising drafts the author prepared for a paid product.
- **How to open:** Program menu → **Promotional Drafts for Paid Products**, or click the Advertising Drafts number on a Paid-tab Offers row.
- **Tabs / subscreens:** Tab count depends on availability of materials. Possible tabs:
  - **Link** (Getting an Affiliate Link)
  - **Advertising Banners**
  - **Advertising Articles**
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Link | text (output) | n/a | Affiliate link at the top of each tab. | n/a |
| HTML code (Banners) | text (output) | n/a | HTML for inserting the banner with built-in affiliate link. | n/a |
| HTML code (Articles) | text (output) | n/a | HTML for inserting the author-formatted text with built-in affiliate link. | n/a |

- **Buttons and actions:**
  - **Add Advertising Tag** — opens **New Campaign** window for UTM tagging.
- **Notes:** No Subscription Form Generator tab on this page (unlike Free Products).

### Screen: Advertising Blanks for Partner Registration

- **Purpose:** Recruit second-level partners by surfacing the author-prepared materials for partner registration (link, banners, articles).
- **How to open:** Program menu → **Advertising Blanks for Partner Registration**, or click into the **Partners** tab on Offers.
- **Tabs / subscreens:** Tab count depends on which materials the author added. Possible tabs:
  - **Link** (Getting an Affiliate Link)
  - **Ad Tags**
  - **Advertising Banners**
  - **Advertising Articles**
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Link | text (output) | n/a | Affiliate link at the top of each tab — use to register second-level partners. | n/a |
| Your Affiliate Link | text (output) | n/a | Field on the **Ad Tags** tab holding the tagged link generated in the **New Campaign** window. Copy this for use in the advertising company. | n/a |
| HTML code (Banners) | text (output) | n/a | HTML — inserting it adds a picture with the wired affiliate link; clicking the picture goes to the partner registration page. | n/a |
| HTML code (Articles) | text (output) | n/a | HTML — inserting it adds the text with the author's formatting and wired affiliate link; clicking transfers to partner registration pages. | n/a |

- **Buttons and actions:**
  - **Add an Ad Tag** — opens **New Campaign** window for UTM tagging.

### Screen: Leads

- **Purpose:** Show the time at which people subscribed via your affiliate link and the groups they subscribed to. If the author configured source/channel/campaign/ad/keys in the affiliate program, those columns also appear.
- **How to open:** Program menu → **Leads**.
- **Fields (table columns and filters):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Time of subscription | display | n/a | When the lead subscribed. | n/a |
| Subscribed group | display | n/a | Group the lead joined. | n/a |
| Source / channel / campaign / ad / keys | display | n/a | Visible only if the author set them up in the affiliate program. | n/a |
| Name (filter) | text | No | Search by name. | empty |
| Subscribed group (filter) | text / selector | No | Search by subscribed group. | empty |
| Period (filter) | date range | No | Period for the search. | Whole period |
| Click type (filter) | dropdown | No | Attribution model. Options: **First click**, **Last click**. | n/a |

- **Buttons and actions:**
  - **Search** — applies the filter; not all fields need to be filled.
  - **Clear** — restores the whole table.

### Screen: Orders

- **Purpose:** Show the periods and the products that have been billed and charged commissions for. If the author set up source/channel/campaign/ads/keys, those appear too.
- **How to open:** Program menu → **Orders**.
- **Fields (filters and columns):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Order number (filter) | text | No | Search by order number. | empty |
| Contact name (filter) | text | No | Search by contact name. | empty |
| Product (filter) | text / selector | No | Search by product. | empty |
| Date of billing (filter) | date | No | When the order was billed. | empty |
| Date of payment collection (filter) | date | No | When payment was collected. | empty |
| Payment status (filter) | dropdown | No | Options: not enumerated in source. | empty |
| Source / channel / campaign / ads / keys columns | display | n/a | Shown only if author configured them. | n/a |

- **Buttons and actions:**
  - **Search** — apply filter; not all fields need to be filled.
  - **Clear** — display the whole table.

### Screen: Referrals

- **Purpose:** Show the number of referrals and the page followers via your affiliate link, plus a graph of referrals per day (excluding page count).
- **How to open:** Program menu → **Referrals**.
- **Fields (filters):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Page (filter) | text / selector | No | Restrict output to a particular page. | empty |
| Period (filter) | date range | No | Reporting window. | Last calendar month |

- **Buttons and actions:**
  - **Search** — apply the filter; not all fields need to be filled.
  - **Clear** — show the whole table.
- **Notes:** A graph of the number of referrals by day is displayed at the bottom of the page.

### Screen: Partners From You

- **Purpose:** Show the next-level partners who registered via your referral link.
- **How to open:** Program menu → **Partners From You**.
- **Fields (filters):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Login (filter) | text | No | Search for a particular partner by login. | empty |

- **Buttons and actions:**
  - **Search** / **Clear** — filter behavior as on other report pages (apply / reset). (Buttons not explicitly named on this article but consistent with sibling pages.)

### Screen: Payments

- **Purpose:** Show the amount of commissions charged and the amount paid out to you.
- **How to open:** Program menu → **Payments** (page heading is **Payments Reporting**).
- **Fields (filters):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Beginning of period | date (calendar) | No | Start date for the report. | empty |
| End of period | date (calendar) | No | End date for the report. | empty |

- **Buttons and actions:**
  - **Search** — apply the period filter.
  - **Clear** — retrieve the data for the whole time.

### Screen: Contact the Author

- **Purpose:** Send a message to the author of the affiliate program.
- **How to open:** Program menu → **Contact the Author**.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| From field | text | n/a | Filled in by default. | Pre-filled |
| Your Email field | email | n/a | Filled in by default. | Pre-filled |
| Subject field | text | n/a | Filled in by default. | Pre-filled |
| Letter body (introductory part) | text | n/a | Filled in by default. | Pre-filled |
| Letter body (ending) | text | n/a | Filled in by default. | Pre-filled |
| Captcha | text | Yes | Enter the captcha code to send. | empty |

- **Buttons and actions:**
  - **Send** — submits the letter to the author after captcha entry.

## Common tasks

### How do I open a specific affiliate program?
1. Top menu → **Advertise**. You land on the Partner's Cabinet catalog.
2. Optionally apply filters (period, affiliate name) and click **Search**.
3. Click the program name in the list.

**Result:** You enter the program. The left menu switches to the program menu (Offers, Promotional Drafts, Leads, Orders, etc.). Click **Catalog** at any point to return to the cabinet main page.
**Options along the way:** Click the star to add the program to **Favorites** so it pins to the top of the catalog.
**Gotchas:** **Instructions** appears in the program menu only if the author added it.

### How do I pin (or unpin) an affiliate program to my Favorites?
1. Open the **Partner's Cabinet**.
2. Click the gray **Star** in the first column of the program's row to add. The star turns yellow.
3. To remove, click the yellow star again. It turns gray.

**Result:** Favorited programs display at the top of the catalog.

### How do I delete an affiliate program from my cabinet?
1. Open **Partner's Cabinet**.
2. In the row of the program, click the **cross mark** in the last column.

**Result:** The program is removed from your list.
**Gotchas:** Source does not state whether deletion is reversible.

### How do I get my affiliate link for a product?
1. Enter the program (click its name in the catalog).
2. Open **Offers**.
3. Choose the tab: **Free** (default), **Paid**, or **Partners**.
4. Locate the product/page row.
5. Copy the URL in the **Your Affiliate Link** column. Alternatively, click the product name to preview the advertised page.

**Result:** You have the partner-identified URL ready to share.
**Options along the way:** Click the chain-shackle icon next to the link to launch the **New Campaign** UTM-tag builder before copying.
**Gotchas:** The Paid tab additionally shows the partner price/conditions block per product.

### How do I add UTM-tags (Ad Tag) to my affiliate link?
1. From an **Offers** row, click the **chain-shackle icon** next to the link (or use **Add an Ad Tag** / **Add Advertising Tag** on the relevant page). The **New Campaign** window opens.
2. Set the **Source of traffic** (examples: email for mailing-list traffic, site for a website, Yandex or Google for contextual ads).
3. Optionally fill **Advertising campaign**, **Ad**, and **Keywords** for finer statistics. Their meaning depends on the source you picked (e.g., for a site = page or banner image; for a mailing list = contact group or email subject).
4. Once the link is formed, copy it from **Your Affiliate Link** / **Your Link for Counting Clicks** / **Your Reference-Counting of Clicks** (label varies by screen).
5. Paste the tagged link into your advertising campaign.

**Result:** Traffic from the tagged link is attributable in your reporting by source/channel/campaign/ad/keyword.
**Options along the way:** The same New Campaign workflow is available from Offers, Advertising Blanks for Partner Registration, Promotional Drafts for Free Products, Promotional Drafts for Paid Products, and the Subscription Form Generator's Advertising Tag block.
**Gotchas:** Campaign/ad/keywords are optional but required if you want detailed statistics.

### How do I grab a banner with my affiliate link?
1. Open the program → **Promotional Drafts for Free Products** or **Promotional Drafts for Paid Products** (or **Advertising Blanks for Partner Registration** for partner recruitment banners).
2. Open the **Advertising Banners** tab.
3. Copy the HTML code under the image.
4. Paste the code into your page.

**Result:** The page shows the banner with the wired affiliate link; clicking it sends visitors to the advertised page (or, for Advertising Blanks, the partner registration page).
**Gotchas:** The number of tabs depends on the materials the author provided — a Banners tab may not exist if the author did not add banners.

### How do I grab a pre-written ad text (Advertising Article)?
1. Open **Promotional Drafts for Free Products** / **for Paid Products** / **Advertising Blanks for Partner Registration**.
2. Open the **Advertising Articles** tab.
3. Copy the HTML code under the text.
4. Insert it into your page.

**Result:** The page renders the author-formatted text with the wired affiliate link; clicking the link sends visitors to the advertising page (or partner registration page for Advertising Blanks).

### How do I generate a subscription form with my partner tag baked in (free product)?
1. Open **Promotional Drafts for Free Products**.
2. Open the **Subscription Form Generator** tab.
3. Use **Additional Fields** to enable / disable field names inside input fields.
4. Use **Block Type** to choose texture, corner rounding, and 3D shadow.
5. Use **Form View** to set width, form of input fields, and whether subscriber statistics display.
6. Use **Button View** to set color and name, or upload your own button image.
7. Optionally use **Advertising Tag** to bake UTM-tags into the form's link.
8. Verify the live preview at the end of the tab.
9. Copy the HTML code at the very end and paste it into your page.

**Result:** Visitors subscribing through that form are assigned to you as their partner.
**Options along the way:** The author defines general settings of the form; design is set in this tab.

### How do I recruit second-level partners?
1. Enter the program → **Advertising Blanks for Partner Registration** (or open Offers and click the **Partners** tab).
2. Pick a tab: **Link**, **Ad Tags**, **Advertising Banners**, or **Advertising Articles** (only those the author provided are shown).
3. To use a plain link, copy the **Link** field at the top of any tab.
4. To use a UTM-tagged link, open **Ad Tags** → click **Add an Ad Tag** → fill the **New Campaign** window → copy **Your Affiliate Link**.
5. To use a banner or article creative, copy the HTML under the image or text.
6. Place the link, banner, or article in your campaign.

**Result:** Visitors who follow the link or click the creative land on the partner registration page. New sign-ups appear in **Partners From You**.

### How do I view who subscribed via my link?
1. Enter the program → **Leads**.
2. Optionally apply filters: **Name**, **Subscribed group**, **Period**, **First click** / **Last click**.
3. Click **Search**.

**Result:** The table lists subscription times and groups; if the author set source/channel/campaign/ad/keys, those columns appear too.
**Options along the way:** Switch attribution between **First click** and **Last click**.
**Gotchas:** Not all filter fields must be filled. Click **Clear** to see the whole table.

### How do I view billed orders and commissions?
1. Enter the program → **Orders**.
2. Optionally apply filters: **Order number**, **Contact name**, **Product**, **Date of billing**, **Date of payment collection**, **Payment status**.
3. Click **Search**.

**Result:** The table lists orders along with periods, products, and commissions; if the author configured source/channel/campaign/ads/keys, those columns appear too.
**Gotchas:** Click **Clear** to restore the full table.

### How do I check referrals and the daily referral graph?
1. Enter the program → **Referrals**.
2. Optionally filter by **Page** and **Period**.
3. Click **Search**.

**Result:** Table shows referrals and page followers via your link; a graph at the bottom plots the number of referrals per day (excluding page count). Default view is the last calendar month.

### How do I see my second-level partners?
1. Enter the program → **Partners From You**.
2. Optionally enter a **Login** in the filter and apply.

**Result:** The table lists next-level partners who registered via your referral link.

### How do I see commissions charged and paid out?
1. Enter the program → **Payments** (page heading: **Payments Reporting**).
2. Set the period via the calendar (beginning and end).
3. Click **Search**.

**Result:** The page shows commissions charged and paid out for the chosen window.
**Options along the way:** Click **Clear** to retrieve data for the whole time.

### How do I contact the author of an affiliate program?
1. Enter the program → **Contact the Author**.
2. The **From**, **Your Email**, **Subject**, and the introductory and ending parts of the letter are pre-filled. Edit the body as needed.
3. Enter the **captcha** code.
4. Click **Send**.

**Result:** The letter is sent to the program's author.

### How do I read program instructions from the author?
1. Enter the program.
2. If the program menu contains an **Instructions** item, click it. The page shows the instruction text and a link to the **promotional page**.

**Result:** You see the author's guidance for promoting the program.
**Gotchas:** If the author has not added instructions, the **Instructions** menu item is not shown at all. (Authors add instructions under the affiliate program settings in their affiliate cabinet.)

## Cross-references
- **Related section:** Contacts — Leads collected through your affiliate link feed contact lists; the **Subscribed group** column on Leads references contact groups defined in Contacts.
- **Related section:** Mailings — Email is one of the **Source of traffic** values used in Ad Tags, and a generated subscription form (free-product drafts) drives mailing subscribers tied to your partner tag.
- **Related section:** Products / Orders (author-side) — The Orders page in Advertise reflects billed sales attributed to your affiliate link from the author's product catalog.
- **Related section:** Statistics — Source / channel / campaign / ad / keys data captured by Ad Tags surfaces in Leads, Orders, and Referrals reporting once the author has set them up in the affiliate program.

## Source articles
- [Advertising Blanks for Partner Registration](https://help.influencersoft.com/hc/en-us/articles/360050852531-Advertising-Blanks-for-Partner-Registration)
- [Contact the Author](https://help.influencersoft.com/hc/en-us/articles/360050391032-Contact-the-Author)
- [How to Add Instructions in the Partner's Cabinet](https://help.influencersoft.com/hc/en-us/articles/360050852691-How-to-Add-Instructions-in-the-Partner-s-Cabinet)
- [Leads](https://help.influencersoft.com/hc/en-us/articles/360050391392-Leads)
- [Offers](https://help.influencersoft.com/hc/en-us/articles/360050391492-Offers)
- [Orders](https://help.influencersoft.com/hc/en-us/articles/360050391512-Orders)
- [Partner's Cabinet](https://help.influencersoft.com/hc/en-us/articles/360050391592-Partner-s-Cabinet)
- [Partners from You](https://help.influencersoft.com/hc/en-us/articles/360050852851-Partners-from-You)
- [Payments](https://help.influencersoft.com/hc/en-us/articles/360050852971-Payments)
- [Promotional Drafts for Free Products](https://help.influencersoft.com/hc/en-us/articles/360050853051-Promotional-Drafts-for-Free-Products)
- [Promotional Drafts for Paid Products](https://help.influencersoft.com/hc/en-us/articles/360050391872-Promotional-Drafts-for-Paid-Products)
- [Referrals](https://help.influencersoft.com/hc/en-us/articles/360050853351-Referrals)



---


# Reports

## Overview
Reports in InfluencerSoft is the analytics area of the platform. It exposes sales statistics, sales-funnel analytics (whole funnel, sources, cohorts, additional-field breakdowns), advertising-channel efficiency, UTM campaign builders, expense import, subscription-base tracking, manager payouts and earnings, and scheduled email delivery of statistics. The reports area is reached from the main top menu (the Sales Report page is also opened automatically on each login) and is used by account owners, marketers, and sales managers. The rest of this chapter documents every screen, filter, button, and workflow described in the Reports section's source articles.

## Where to find it
- `Top menu → Reports` (section landing — lists the report pages below)
- `Top menu → Analytics → Sales Report` — opens the Sales Statistics (Sales Report) page; also opens on every login
- `Top menu → Reports → Sales Funnel Analytics` — list of funnels (each funnel drills into Sources / Cohorts / Additional fields)
- `Top menu → Reports → Sales Funnel Analytics → Add` — the Add Sales Funnel screen
- `Top menu → Reports → Advertising` — channel efficiency report
- `Top menu → Reports → Advertising → Import` — the Expenses Import page
- `Top menu → Reports → New Campaign` — UTM-tag builder
- `Top menu → Reports → Subscription statistics` — subscription-base changes
- `Top menu → Reports → Subscription statistics → Statistics via Email` — schedule email delivery
- `Top menu → Reports → Sales Department` — per-manager sales statistics
- `Top menu → Reports → Sales Department → Payments to the managers` (also reachable directly as Payments to managers)

## Terminology
- **Analytical sales funnel** — A configurable chain of steps (subscribed, activated, opened email, clicked, processed bill, paid bill, etc.) used to track conversion and surface the points where potential clients are lost.
- **Step (of a funnel)** — One node in the funnel. Each step has a name and is bound to one event (subscription, processing a bill, paying a bill, instant emails, automatic emails).
- **Event (of a step)** — The action being counted at that step. Allowed events in the article: subscription for newsletters, processing bills, paying bills, actions with instant emails, actions with automatic emails.
- **Cohort** — A group of contacts who entered a funnel within the same period of time; compared against each other in cohort analysis.
- **Source / Channel** — Origin of the traffic driving people into a funnel (direct referrals, affiliate traffic, advertising, etc.). Inside the Advertising report a Source is a sub-grouping within a Channel.
- **UTM-tag** — Parameters appended to a page URL by the New Campaign builder so that clicks can be counted per channel/source/campaign/ad/keys.
- **First click / Last click / By days after the click** — Attribution modes available in advertising and funnel filters for assigning a conversion to a click.
- **Interval analysis** — Optional analysis mode that takes a chosen step plus a parameter and an interval and outputs results either as a running cumulative total or per individual period.
- **Cumulative data in the statistics** — Checkbox that flips Interval Analysis output between cumulative total and individual periods.
- **Additional field** — A custom contact field defined in CRM Settings. The Sales Funnel — Additional Fields report compares funnel statistics over one of these fields.
- **Visible fields / View button** — Column-picker control on report tables. Ticking a column shows it; un-ticking hides it.
- **Amount** — Default visible quantity column on funnel-step tables.
- **% (percent) field** — Optional visible field that adds a percentage value to each step in addition to its quantitative value.
- **Subscribed / Unsubscribed columns** — Clickable counters on the Subscription statistics table that open the Subscribers list filtered to that condition.
- **Payout** — Button in the Payments to the Managers table that triggers payment to a manager who is owed money.
- **Gear button** — Universal export control; exports the current table to CSV (and to MS Excel on the Subscription statistics page).
- **Favorites (funnels)** — Star toggle that promotes a funnel to the top of the funnel list; grey star = not favorite, yellow star = favorite.

## Screens and fields

### Screen: Sales Statistics (Sales Report)
- **Purpose:** Shows sales statistics for a chosen period and product set; also the default landing page on login.
- **How to open:** `Top menu → Analytics → Sales Report`; opens automatically on every login.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Period | date range | No | Period to display statistics for. | Last months (per source: "Data on all the products for the last months is displayed on default.") |
| Products | multi-select (assumed) | No | Products whose statistics to display. | All products |
| Grouping | dropdown | No | Type of grouping: days, weeks, or months. | Not enumerated in source |

- **Table columns referenced:** Created, Confirmed, Paid (numbers in these columns are blue and clickable; clicking opens the Bills page filtered by the corresponding date and payment state — see Bills, https://help.influencersoft.com/hc/en-us/articles/360050851031-Orders-).
- **Buttons and actions:**
  - **Show the chart** — Expands a graphic interpretation of the main parameters at the top of the page. Bars/lines: green bar = income, red bar = expenses, green line = profit.
  - **Search** — Applies the current filter settings.
  - **Cancel** — Returns the filter to default settings.
- **Notes:** Clicking the blue numbers in Created / Confirmed / Paid jumps to Bills pre-filtered by date and payment state.

### Screen: Advertising (The Efficiency of the Advertising Campaign)
- **Purpose:** Shows advertising efficiency totalled across all channels and broken down by channel.
- **How to open:** `Top menu → Reports → Advertising`.
- **Fields (Filter / Retrieve statistics from…to block):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Retrieve statistics from…to | date range | No | Period to retrieve statistics over. | Not enumerated in source |
| Quick period filter | preset buttons | No | The most frequent periods (options not enumerated in source). | Not enumerated in source |
| Advertising channel | filter | No | Restrict output to a particular advertising channel. | All channels |
| Attribution mode | option set | No | Retrieve data by the first click, by the last click, or by days after the click. | Not enumerated in source |
| Read the interval analysis | checkbox | No | When ticked, expands additional fields: select a parameter and set an interval to output data. | Off |
| Parameter (Interval Analysis) | dropdown | Conditional | Parameter for interval analysis. Required when interval analysis is on. Options: not enumerated in source. | — |
| Interval (Interval Analysis) | input | Conditional | Interval used to sum up the statistics. | — |
| Cumulative data in the statistics | checkbox | No | If ticked, data is output as a cumulative total; if unticked, by individual periods. | Not stated in source |

- **Buttons and actions:**
  - **View** — Sets which columns of the table are displayed; tick a checkbox to show the column, untick to hide it.
  - **Sources** — Re-groups the data by sources inside the channel (when sources have been set). A second click on the button returns the table to its original form.
  - **Import** — Opens the Expenses Import page (How to Import Expenses into your Reports) to add expense data for the selected advertising channel manually.
  - **Gear** — Exports the current table to your computer in CSV format.
- **Notes:** To calculate efficiency, both income and expense data must be present. Expense data is added through the Import button / Expenses Import page.

### Screen: How to Import Expenses into your Reports (Expenses Import)
- **Purpose:** Adds expense data per advertising channel so that the Advertising report can calculate efficiency.
- **How to open:** From the Advertising page click the **Import** button, or `Top menu → Reports → Advertising → Import` (the article is titled "How to Import Expenses into your Reports" / "Expenses Import").
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Expenses list | structured input following the given pattern | Yes | Upload expense rows according to the on-page pattern. | — |
| CSV upload | file (CSV) | No (alternative to manual list) | Upload a CSV file with the same data structure as the pattern. | — |
| Channel (in Expenses Editor) | dropdown filter | Yes (in editor) | Selects which advertising channel's earlier expenses to edit. | — |

- **Buttons and actions:**
  - **Add** — Submits the entered/uploaded expenses; the expenses are then added to the Advertising page.
  - **Expenses Editor** — Opens the editor that lets you change earlier expense data. Select the channel in the filters, then make changes.
- **Notes:** Expense data is required for advertising-efficiency calculations.

### Screen: New Campaign (UTM-tag builder)
- **Purpose:** Builds a UTM-tagged URL for an advertised page so that clicks per channel can be counted individually.
- **How to open:** `Top menu → Reports → New Campaign`.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Address of the advertised page | text (URL) | Yes | The URL on which clicks should be counted. | — |
| Source of traffic | text | Yes | Source identifier. Must use Latin letters and numbers. Examples in source: `site` for mailing-list / website referrers, `Google` for contextual advertising. | — |
| Campaign | text | No | Campaign identifier. May be omitted but is needed for more detailed statistics. | — |
| Ad | text | No | Ad identifier. May be omitted but is needed for more detailed statistics. | — |
| Keywords | text | No | Keyword identifier. May be omitted but is needed for more detailed statistics. | — |
| Your link for calculating clicks | text (read-only output) | — | The fully formed UTM-tagged link that you copy into your advertising campaign. | — |

- **Buttons and actions:**
  - **Check the possibility to count clicks** — Validates the entered page address. If the page can count clicks, tag fields become specifiable.
- **Notes:** Source values are user-defined; per the source article, for a website it could be the page that holds the banner/image; for a mailing list it could be groups of contacts and/or the message subject; and so on.

### Screen: Sales Funnel Analytics (funnel list)
- **Purpose:** Lists all sales funnels and lets you add, edit, delete, favorite, and drill into each one.
- **How to open:** `Top menu → Reports → Sales Funnel Analytics`.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Funnel name | text | No | Searches by funnel name. Entering part of a name shows all funnels containing that substring. | — |
| 0-step period from / to | date range | No | Period over which statistics are calculated. | — |
| Quick period filter | preset buttons | No | Today, yesterday, this month, last month, 30 days. | — |
| Show by click | dropdown | No | Attribution: first click or last click. | Not stated in source |
| Only in favorites | checkbox | No | Restricts the list to favorite funnels only. | Off |
| Advertising tab — Channel / Source / Campaign / Ad / Keys | filter | No | Restrict statistics to a particular advertising channel/source/campaign/ad/keys (links to the New Campaign builder for definitions). | — |
| Tags tab — Tag | text/picker | No | Restrict statistics to funnels associated with a tag. | — |

- **Buttons and actions:**
  - **Add** — Opens the Add Sales Funnel screen (see Screen: Add Sales Funnel).
  - Clicking a funnel name — Opens the Editing page for that funnel.
  - Cross mark (last column) — Deletes the selected funnel.
  - Star (first column) — Toggles favorite status; grey turns yellow when favorited. Favorite funnels are listed first.
  - **Sources** link — Opens the funnel's traffic-source report (see Screen: Sales Funnels — Sources).
  - **Cohorts** link — Opens the funnel's cohort report (see Screen: Sales Funnels — Cohorts).
  - **Additional fields** link — Opens the funnel's additional-field report (see Screen: Sales Funnel — Additional Fields).
- **Notes:** The Advertising and Tags tabs sit in the side filter menu.

### Screen: Add / Edit Sales Funnel (Making a Funnel)
- **Purpose:** Defines an analytical funnel — its name and the ordered set of steps to measure.
- **How to open:** From the Sales Funnel Analytics page click **Add**, or click an existing funnel's name to edit it.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Funnel name | text | Yes | Name of the funnel. | — |
| Step name | text (per step) | Yes | Name of each step. | — |
| Step event | dropdown (per step) | Yes | The action counted at this step. Allowed values from source: subscription for newsletters; processing bills; paying bills; actions with instant emails; actions with automatic emails. | — |

Conditional sub-fields per step event:

- **If event = subscription for newsletters:**
  - **Subscription** — dropdown selecting which subscription to view.
  - **Subscribers to calculate** — options: all / activated / not-activated / unsubscribed.
- **If event = processing bills:**
  - **Product** — selects the product whose data is calculated.
  - **Tags** — optional tags.
- **If event = paying bills:**
  - **Product** — selects the product whose data is calculated.
  - **Tags** — optional.
- **If event = actions with instant emails:**
  - **Action** — Opened / Did not open / Clicked / Did not click.
  - **Emails scope** — All / Any.
  - **Email selection** — pick the specific emails the statistics are calculated from.
- **If event = actions with automatic emails:**
  - **Action** — Opened / Did not open / Clicked / Did not click.
  - **Emails scope** — all / any of the selected emails of the group (group must be selected).
  - **Email selection** — pick emails within the chosen group.

- **Buttons and actions:**
  - **Add Step** — Creates an additional step; repeat for as many steps as needed.
  - Clicking a step name — Rolls up that step's panel for readability.
  - **Save** — Saves the funnel and returns it to the funnel list.
- **Notes:** The source article gives example funnels — a two-step subscription→payment funnel and a six-step funnel (subscribed → activated → read email → followed link → processed bill → paid bill).

### Screen: Sales Funnels — Sources
- **Purpose:** Reports on the traffic sources feeding a selected sales funnel — direct referrals, affiliate traffic, advertising, and so on — including how many people hit each step.
- **How to open:** From Sales Funnel Analytics open the funnel and click the **Sources** link.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Retrieve statistics from / to | date range | No | Period for the statistics. | — |
| Quick period filter | preset buttons | No | Today, yesterday, this month, last month, 30 days. | — |
| Show by click | dropdown | No | First click or last click. | — |
| Advertising tab — Channel | filter | No | Restrict to a particular channel. | — |
| Tag tab — Tag | text/picker | No | Restrict to a tag. | — |
| Read the interval analysis | checkbox | No | Opens an additional tab for interval-analysis configuration. | Off |
| Step of the funnel (Interval Analysis) | dropdown | Conditional | Which step to calculate. | — |
| Parameters (Interval Analysis) | dropdown | Conditional | Calculating parameter(s). | — |
| Interval (Interval Analysis) | input | Conditional | Interval used to sum up statistics. | — |
| Cumulative data | checkbox | No | Cumulative total vs. by individual periods. | — |

- **Buttons and actions:**
  - **View** — Adds additional data outputs to each step of the funnel. **Amount** is shown by default; ticking **%** adds a percentage value to each step alongside the quantitative value.
  - Question mark next to a step name — Shows a hint describing what action is calculated at that step.
  - **Gear** — Exports the table in CSV format; select the format in the **Export** field.
- **Notes:** When Interval Analysis is enabled, the table changes appearance — an **Interval Analysis** block is added with the statistics on the selected parameters and interval.

### Screen: Sales Funnels — Cohorts
- **Purpose:** Cohort analysis of a funnel — compares groups of contacts that entered the funnel within the same period.
- **How to open:** From Sales Funnel Analytics open the funnel and click the **Cohorts** link.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Retrieve statistics from / to | date range | No | Period for the statistics. | — |
| Quick period filter | preset buttons | No | Most popular periods. Specific options not enumerated in source. | — |
| Display by | dropdown | No | Period for which data is combined into one cohort. | — |
| Advertising tab — Channel / Source / Campaign / Advertisement / Keys | filter | No | Restrict to particular advertising parameters (links to the New Campaign builder for definitions). | — |
| Show by click | dropdown | No | First click or last click. | — |
| Tag tab — Tag | text/picker | No | Restrict to a tag. | — |
| Calculate interval analysis | checkbox | No | Opens a tab to set parameters of the calculation. | Off |
| Step of the funnel (Interval Analysis) | dropdown | Conditional | Step to calculate. | — |
| Parameters (Interval Analysis) | dropdown | Conditional | Calculating parameters. | — |
| Interval (Interval Analysis) | input | Conditional | Interval used to sum statistics. | — |
| Cumulative data in the statistics | checkbox | No | Cumulative total vs. by individual periods. | — |

- **Buttons and actions:**
  - **View** — Adds additional data outputs to each step; **Amount** shown by default; ticking **%** adds a percentage value to each step alongside the quantitative value.
  - Question mark next to a step name — Tooltip describing what is calculated at that step.
  - **Gear** — Exports the table in CSV format; select the format in the **Export** field.
- **Notes:** Selecting Interval Analysis changes the table appearance — an **Interval Analysis** block appears with statistics on the selected parameters and interval.

### Screen: Sales Funnel — Additional Fields
- **Purpose:** Report on a sales funnel broken down over an additional contact field defined in CRM Settings — compares funnel statistics across the values of that field.
- **How to open:** From Sales Funnel Analytics open the funnel and click the **Additional fields** link.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Retrieve statistics from…to | date range | No | Period for the statistics. | — |
| Quick period filter | preset buttons | No | 7 days, 5 weeks, 4 months, 1 year. | — |
| Display by the additional field | dropdown | Yes | Selects which additional contact field the report is generated on. Options come from CRM Settings (https://help.influencersoft.com/hc/en-us/articles/360051177871-CRM-Settings). | — |
| Advertising tab — Channel | filter | No | Restrict to a particular channel. | — |
| Tags tab — Tag | text/picker | No | Restrict to a tag. | — |
| Read the interval analysis | checkbox | No | Opens an additional tab for interval-analysis configuration. | Off |
| Step of the funnel (Interval Analysis) | dropdown | Conditional | Step to calculate. | — |
| Parameter (Interval Analysis) | dropdown | Conditional | Calculating parameter. | — |
| Interval (Interval Analysis) | input | Conditional | Interval used to sum statistics. | — |
| Cumulative data in the statistics | checkbox | No | Cumulative total vs. by individual periods. | — |

- **Buttons and actions:**
  - **View** — Adds additional data outputs to each step. **Amount** is displayed by default; ticking **%** appends a percentage value to each step alongside the quantitative value.
  - **Gear** — Exports data in CSV format; choose the format in the **Export** field.
- **Notes:** The Additional Fields report requires that the relevant contacts have additional fields configured under CRM Settings.

### Screen: Subscription Statistics
- **Purpose:** Tracks changes in the subscription base over time, summarized at the top of the page and broken down in the table.
- **How to open:** `Top menu → Reports → Subscription statistics`.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Groups / Categories | multi-select | No | Groups and categories of statistics to display. | All groups |
| Visibility | button → grouping options | No | Grouping of data in the table by days, weeks, or months. | Not enumerated in source |
| Period from / to | date range | No | Period for which statistics are shown. | Current month |

- **Table columns referenced:** Subscribed, Unsubscribed — numbers in these columns are clickable and open the Subscribers page (https://help.influencersoft.com/hc/en-us/articles/360050850591-Subscribers-) filtered to that condition.
- **Buttons and actions:**
  - **Search** — Applies the current filter; the table updates to match.
  - **Filter** then **Clear** — Path to reset the table back to the detailed default view.
  - **Statistics via Email** — Opens the Send statistics via email page (see Screen: Statistics via Email).
  - **Gear** — Exports the table to MS Excel.
- **Notes:** Filter fields do not all need to be filled in. The number summary at the top of the table totals subscriptions for the selected period.

### Screen: Statistics via Email (Send statistics via email)
- **Purpose:** Schedules email delivery of subscription statistics to the account owner.
- **How to open:** `Top menu → Reports → Subscription statistics → Statistics via Email`, or directly at `Top menu → Reports → Statistics via Email`.
- **Fields:**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Frequency checkboxes | checkbox set | No | Tick the checkboxes to choose how often statistics are sent. Specific frequency options are not enumerated in source. | None ticked |

- **Buttons and actions:** Not enumerated in source (the page is described as a checkbox-based frequency selector).
- **Notes:** Statistics are sent to the email address in the **Your Email** field of the user's private account.

### Screen: Sales Department (Sales Department Statistics)
- **Purpose:** Sales statistics broken down per manager.
- **How to open:** `Top menu → Reports → Sales Department`.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Period | date range | No | Period of the data output. | — |
| Period type | option | No | Specify the period by billing or by collecting payment. | — |

(Additional filter fields exist; the source notes "You do not have to fill in all the filter fields" but does not enumerate them all.)

- **Buttons and actions:**
  - **View** — Sets up the columns of the table; tick checkboxes to add a column, untick to delete it.
  - **Search** — Applies the filter.
  - **Clear** — Returns the table to its full unfiltered view.
  - **Payments to the managers** — Opens the Payments to the Managers page (see Screen: Payments to the Managers).
- **Notes:** Specific column options for the View picker are not enumerated in the source.

### Screen: Payments to the Managers
- **Purpose:** Lists managers and how much is owed to each; lets the operator make payouts.
- **How to open:** `Top menu → Reports → Sales Department → Payments to the managers`, or `Top menu → Reports → Payments to managers`.
- **Fields (Filter):**

| Field | Type | Required | Description / Allowed values | Default |
| --- | --- | --- | --- | --- |
| Manager search | text | No | Search by manager login or email. | — |

- **Buttons and actions:**
  - Clicking a manager's name — Opens the employee-editing page for that manager, where rights and other settings can be changed.
  - **Payout** — Appears in the last column only when there is money owed to that employee; clicking it makes a payment.
- **Notes:** Permissions to edit a manager's rights are not explicitly enumerated in the source.

## Common tasks

### How do I see how much profit my sales made this month?
1. From the top menu open **Analytics → Sales Report** (the Sales Statistics page).
2. In the filter set the period to this month and pick the products (leave blank for all).
3. Optionally set **Grouping** to days, weeks, or months.
4. Click **Search**.
5. Click **Show the chart** to add a visual on top of the table.

**Result:** The table shows Created / Confirmed / Paid figures; the chart shows green bars for income, red bars for expenses, and a green line for profit.
**Options along the way:** Click the blue numbers in Created, Confirmed, or Paid to jump to Bills pre-filtered by that date and payment state.
**Gotchas:** Default filter is all products for the last months — use **Cancel** to return to defaults.

### How do I add a UTM-tagged tracking link to an ad?
1. From the top menu open **Reports → New Campaign**.
2. Paste the page URL into the address field.
3. Click **Check the possibility to count clicks**. If the page supports click counting, the tag fields unlock.
4. Fill in **Source of traffic** (Latin letters and numbers only — e.g., `site`, `Google`).
5. Optionally fill in **Campaign**, **Ad**, and **Keywords** for finer detail.
6. Copy the generated **Your link for calculating clicks** value.
7. Use that link in the corresponding ad.

**Result:** Clicks on the link are attributed to that channel/source/campaign/ad/keys combination in funnel and advertising reports.
**Options along the way:** Source value is your own convention — e.g., page-with-banner for a website source; group-of-contacts or message subject for a mailing list.
**Gotchas:** Only Latin letters and numbers are allowed in **Source of traffic**. Skipping Campaign / Ad / Keywords still works but reduces report granularity.

### How do I see whether my advertising is paying off?
1. From the top menu open **Reports → Advertising**.
2. Set the period in **Retrieve statistics from…to** or use a quick-period preset at the top of the page.
3. Optionally restrict to a single advertising channel and pick the attribution mode (first click / last click / by days after the click).
4. If income is shown but no expenses, click **Import** and load expense data — efficiency requires both income and expenses.
5. Click **Sources** to break the data down into sources inside each channel; click **Sources** again to revert.
6. Use **View** to add or remove table columns.
7. Optionally tick **Read the interval analysis**, pick a parameter and interval, and toggle **Cumulative data in the statistics** between cumulative total and individual periods.
8. Click the **gear** button to export the table to CSV.

**Result:** The table shows advertising efficiency totals across all channels plus per-channel breakdown.
**Options along the way:** Sources view shows sub-sources within a channel if they have been set.
**Gotchas:** Without imported expense data the efficiency calculation cannot complete.

### How do I import advertising expenses?
1. From the Advertising page click **Import** (this opens the Expenses Import page).
2. Either paste the expenses according to the given pattern, or upload a CSV file with the same data structure.
3. Click **Add**.

**Result:** The expenses are added to the Advertising page and feed the efficiency calculation.
**Options along the way:** Use **Expenses Editor** to revise earlier expense data — select the channel in the filters, then make changes.
**Gotchas:** The uploaded list must match the on-page pattern (or CSV with the same structure).

### How do I create a new sales funnel?
1. From the top menu open **Reports → Sales Funnel Analytics**.
2. Click **Add**.
3. Enter the funnel name.
4. Click **Add Step** for each step you want.
5. For every step: name the step, then pick the event — one of: subscription for newsletters, processing bills, paying bills, actions with instant emails, actions with automatic emails.
6. Configure the step's event-specific options:
   - For **subscription for newsletters** — pick the subscription and the audience: all, activated, not-activated, or unsubscribed.
   - For **processing bills** — pick the product; optionally add tags.
   - For **paying bills** — pick the product; optionally add tags.
   - For **actions with instant emails** — pick action (Opened / Did not open / Clicked / Did not click), pick scope (All / Any), then pick the specific emails.
   - For **actions with automatic emails** — pick action (Opened / Did not open / Clicked / Did not click), pick scope (all / any of the selected emails of the group), pick the group, then pick the emails in that group.
7. Click **Save**.

**Result:** The funnel is added to the funnel list on Sales Funnel Analytics.
**Options along the way:** Click a step's name to roll up its panel for readability while editing. The source article suggests two example funnels: a 2-step subscribe→pay funnel for general conversion, and a 6-step funnel (subscribed → activated → read email → followed link → processed bill → paid bill) to find where you lose people.
**Gotchas:** Every step requires a name and an event.

### How do I edit or delete an existing funnel?
1. Open **Reports → Sales Funnel Analytics**.
2. To edit: click the funnel's name and modify it on the Editing page.
3. To delete: click the cross mark in the funnel's row (last column).

**Result:** The funnel is updated or removed from the list.

### How do I pin my most-used funnels to the top?
1. Open **Reports → Sales Funnel Analytics**.
2. In the first column of the row, click the grey star — it turns yellow.
3. Optionally tick **Only in favorites** in the filter to hide everything else.

**Result:** Funnels with a yellow star are displayed first in the list.

### How do I see the traffic sources of a funnel?
1. Open the funnel from Sales Funnel Analytics and click **Sources**.
2. Set period via **Retrieve statistics from / to** or a quick-period preset.
3. Set **Show by click** to first click or last click.
4. Optionally use the **Advertising** side-tab to restrict to a channel, or the **Tag** side-tab to restrict to a tag.
5. Optionally tick **Read the interval analysis**, pick **Step of the funnel**, set parameter and interval, and choose cumulative or per-period output.
6. Use **View** to add columns (e.g., tick **%** to show percentages alongside Amount).
7. Click a step's question mark for a tooltip explaining what it counts.
8. Click the **gear** button and pick a format in **Export** to export as CSV.

**Result:** A table showing how many people reached each funnel step, broken down by traffic source.
**Gotchas:** With Interval Analysis enabled, the table layout changes and an **Interval Analysis** block is appended.

### How do I run a cohort analysis on a funnel?
1. Open the funnel from Sales Funnel Analytics and click **Cohorts**.
2. Set period via **Retrieve statistics from / to** or a quick-period preset.
3. Use **Display by** to choose the period that defines one cohort.
4. Use the **Advertising** side-tab to filter by channel / source / campaign / advertisement / keys, and **Show by click** for first vs. last click. Use the **Tag** side-tab for tag filtering.
5. Optionally tick **Calculate interval analysis**, pick **Step of the funnel**, set parameters and interval, and toggle **Cumulative data in the statistics**.
6. Use **View** to add columns (tick **%** to add percentages).
7. Hover the question mark by a step name for tooltip text.
8. Use the **gear** button → **Export** to download as CSV.

**Result:** The table compares cohort groups against each other across the funnel steps.

### How do I compare a funnel's performance across values of a custom contact field?
1. Open the funnel and click **Additional fields**.
2. Set period via **Retrieve statistics from…to** or a quick-period preset (7 days / 5 weeks / 4 months / 1 year).
3. Pick the field in **Display by the additional field**.
4. Optionally filter by channel (**Advertising** side-tab) or by tag (**Tags** side-tab).
5. Optionally tick **Read the interval analysis** to set the step, parameter, interval, and cumulative vs. per-period output.
6. Use **View** to add columns (e.g., **%** for percentages alongside Amount).
7. Click the **gear** button and choose a format in **Export** to export.

**Result:** A side-by-side comparison of the funnel's statistics over the selected additional field's values.
**Gotchas:** The contacts must have additional fields configured (see CRM Settings, https://help.influencersoft.com/hc/en-us/articles/360051177871-CRM-Settings).

### How do I track my subscriber growth and churn?
1. Open **Reports → Subscription statistics**.
2. In the filter pick the groups/categories (leave default to include all groups).
3. Use **Visibility** to group the table by days, weeks, or months.
4. Set the period in **Period from / to** (defaults to the current month).
5. Click **Search**.
6. To see exactly who subscribed or unsubscribed, click the blue number in the **Subscribed** or **Unsubscribed** column to open the Subscribers page (https://help.influencersoft.com/hc/en-us/articles/360050850591-Subscribers-) pre-filtered to that condition.
7. To reset to the detailed default view, click **Filter** then **Clear**.
8. Click the **gear** button to export the table to MS Excel.

**Result:** The table summarizes subscription movement for the selected period; the top of the table shows totals.

### How do I get statistics delivered to my inbox?
1. From **Reports → Subscription statistics**, click **Statistics via Email** (or open the page directly).
2. Tick the checkboxes for the frequencies you want to receive.

**Result:** Statistics emails are sent to the email address listed in **Your Email** in your private account.
**Gotchas:** Specific frequency options are not enumerated in the source article.

### How do I see what my sales department is producing?
1. Open **Reports → Sales Department**.
2. In the filter pick the period (and choose whether the period is by billing or by collecting payment).
3. Click **Search**; click **Clear** to remove the filter.
4. Use **View** to add or remove table columns.
5. Click **Payments to the managers** to jump to the payouts page.

**Result:** Per-manager sales statistics for the chosen period.

### How do I pay a manager what they're owed?
1. Open **Reports → Payments to managers** (also reachable from the Sales Department page's **Payments to the managers** button).
2. Use the manager-search filter (search by manager login or email).
3. In the row of the target manager, click **Payout** in the last column.

**Result:** A payment is initiated for that manager.
**Options along the way:** Click the manager's name first to open the employee-editing page if you need to review or change rights and other settings before paying.
**Gotchas:** The **Payout** button appears only when there is money owed to that employee.

### How do I export a report?
1. Open the report you want — Advertising, Sales Funnels Sources / Cohorts / Additional Fields, or Subscription statistics.
2. Click the **gear** button at the report.
3. For funnel reports, choose the format in the **Export** field.

**Result:** The current table is exported — CSV for Advertising and funnel reports; MS Excel for Subscription statistics.

## Cross-references
- **Related section:** Contacts / Subscribers — Clicking **Subscribed** or **Unsubscribed** counts on Subscription statistics opens the Subscribers list filtered to that condition.
- **Related section:** Orders / Bills — Clicking blue numbers in the Sales Report's Created / Confirmed / Paid columns opens the Bills page filtered by date and payment state.
- **Related section:** CRM Settings — Defines the additional contact fields that drive the Sales Funnel — Additional Fields report.
- **Related section:** Tags — Funnel reports' Tag side-tab filters statistics by tag.
- **Related section:** Products — Funnel steps for **processing bills** and **paying bills** reference Products to count.
- **Related section:** Emails (instant and automatic) and Email groups — Used by funnel steps for **actions with instant emails** and **actions with automatic emails**.
- **Related section:** Subscriptions — Funnel steps for **subscription for newsletters** reference a specific subscription.
- **Related section:** Managers / Employees — Payments to the Managers and Sales Department pages tie back to manager records (clicking a manager opens the employee-editing page).
- **Related section:** Account / Private Account — Statistics via Email uses the **Your Email** field from the private account as the destination.

## Source articles
- [Advertising (The Efficiency of the Advertising Campaign)](https://help.influencersoft.com/hc/en-us/articles/360051073692-Advertising-The-Efficiency-of-the-Advertising-Campaign)
- [How to Import Expenses into your Reports](https://help.influencersoft.com/hc/en-us/articles/360051073652-How-to-Import-Expenses-into-your-Reports)
- [New Campaign](https://help.influencersoft.com/hc/en-us/articles/360051550771-New-Campaign)
- [Payments to the Managers](https://help.influencersoft.com/hc/en-us/articles/360051187591-Payments-to-the-Managers)
- [Sales Department Statistics](https://help.influencersoft.com/hc/en-us/articles/360050698152-Sales-Department-Statistics)
- [Sales Funnel Analytics](https://help.influencersoft.com/hc/en-us/articles/360051185591-Sales-Funnel-Analytics)
- [Sales Statistics (Sales Report)](https://help.influencersoft.com/hc/en-us/articles/360051187031-Sales-Statistics-Sales-Report)
- [Statistics via Email](https://help.influencersoft.com/hc/en-us/articles/360050696792-Statistics-via-Email)
- [Subscription Statistics](https://help.influencersoft.com/hc/en-us/articles/360050855011-Subscription-Statistics)
- [The Sales Funnel – Additional Fields](https://help.influencersoft.com/hc/en-us/articles/360050699852-The-Sales-Funnel-Additional-Fields)
- [The Sales Funnels – Cohorts](https://help.influencersoft.com/hc/en-us/articles/360051185971-The-Sales-Funnels-Cohorts)
- [The Sales Funnels – Making a Funnel](https://help.influencersoft.com/hc/en-us/articles/360051185531-The-Sales-Funnels-Making-a-Funnel)
- [The Sales Funnels – Sources](https://help.influencersoft.com/hc/en-us/articles/360051186891-The-Sales-Funnels-Sources)



---


# API 1.0

## Overview

InfluencerSoft API 1.0 is a function-based HTTP API for managing contacts, groups, products, orders, partner statistics, and outbound script notifications. Each "function" is invoked as a separate URL path under the account's API base.

- **Versioning context:** This is the 1.0 API. Source articles do not reference a 2.0 surface from inside the 1.0 section — endpoints in this chapter are the complete inventory for v1.
- **Authentication model:** Per-request signed POST. Each request includes a `hash` parameter computed from the request body, the account login, and a secret key (see Authentication).
- **Base URL pattern:** `http://username.influencersoft.com/api/{FunctionName}` where `username` is the account login. Source: "API-service functions are taken from http://username.influencersoft.com/api/ adding the function name. For example, http://username.influencersoft.com/api/AddLeadToGroup." Several examples in the source use `https://`. A custom domain linked to the account may be used instead of `username.influencersoft.com`.
- **Request format:** HTTP POST with `application/x-www-form-urlencoded` body ("URL-encode" / `http_build_query`). Source: "Parameters are transferred by POST method with encoding URL-encode."
- **Response format:** JSON. Source: "After each access to the API service functions, the system receives a response in the JSON encoding." Every response contains `error_code`, `error_text`, `hash`, and optionally a `result` field.
- **Account access gate:** Before the API can be used the account must have API access enabled. See `Enabling API to Get Started`. Subscription/order forms must include a "Read and Agreed with the Offer Contract" checkbox under each form; the account holder then sends a written request to InfluencerSoft Support with the subject "Enabling the API in Your Account" specifying the login and any third-party subscription/sales pages. Suspected over-clocking of the API can result in account block "without the possibility of recovery or appeal."

## Authentication

Every request must be signed by appending a `hash` field. Source: "Each query must be signed. For this, the *hash* field is transferred to the query."

Hash construction (PHP form from the source):

```
hash = md5( http_build_query($params) . "::" . $user_id . "::" . $secret )
```

Where:
- `$params` — the URL-encoded body of every other field being transmitted to the API function.
- `$user_id` — the account login for the InfluencerSoft system.
- `$secret` — secret key obtained "from the account's personal account in the API section." Also referred to in source as `user_rps_key` or "API key." Located at `https://YourLogin.influencersoft.com/shops/setts/apisettings/` per the Zapier article, or via the "Integration and API" link in the footer of any personal-account page. The "Secret key for signing" is found in source under "Shop" → "Settings" → "CanadaPostService and API."

Response signature verification (from the same example):

```
expected_hash = md5( error_code . "::" . error_text . "::" . $secret )
```

If `expected_hash` matches the `hash` field in the JSON response, the response is authentic. Source: "hash is a signature to the data to make sure that the response is from our system, and not forged."

Rate limits: not specified in source. The source notes only that "if we find any signs of a software over-clocking through the API after connecting the service to your account, we reserve the right to block the account."

## Conventions

- **Base URL:** `http://username.influencersoft.com/api/{FunctionName}` (a linked custom domain may be substituted for `username.influencersoft.com`).
- **HTTP method:** POST for all functions.
- **Content-Type:** `application/x-www-form-urlencoded`.
- **Response Content-Type:** JSON.
- **Common request parameters present on every call:**
  - `hash` — md5 signature described above. Required on every request.
- **Common response envelope:**
  - `error_code` — numeric error code (`0` = ok).
  - `error_text` — text error message.
  - `hash` — response signature.
  - `result` — optional payload (object, array, or scalar) depending on the function. E.g., `result->bill_id` after `CreateOrder`.
- **Pagination model:** not specified in source. `GetOrders` / `GetOrdersWithGoods` are bounded by date filters instead (see endpoints).
- **Date / timezone format:**
  - `CreateOrder.bill_created`, `CreateOrder.bill_timer_kill`, `GetOrders.date_s`, `GetOrders.date_e`, `UpdateOrderStatus.date` — UNIX timestamp (seconds since 1970-01-01).
  - `GetOrdersWithGoods.begin_date`, `GetOrdersWithGoods.end_date` — `DD.MM.YYYY` (e.g., `01.01.2017`).
  - `GetPartnerStats.date_from`, `GetPartnerStats.date_to` — `YYYY-MM-DD`.
  - Timezone: not specified in source.
- **Identifier conventions:**
  - Country IDs (3-letter codes) — see `## Reference: Country Identifiers` below. Used in `good_only_countries` (AddGood / UpdateGood). Note: at least one source example (`CreateOrder`) uses non-canonical values like `"USA"` and `"GB"` in `bill_country`; the dedicated identifiers article publishes the canonical list reproduced verbatim below.
  - Group identifiers — symbolic strings (e.g., `super`, `clients_super_product`). Reserved IDs `unique` and `all` are valid in `GetCountSubscribe`.
  - Product identifiers — `good_name` is a user-defined symbolic ID, unique within the account. `good_id` (numeric) is also exposed via `GetAllGoods`.
  - Order identifiers — `bill_id` (integer).

## Response statuses and error codes

All codes mentioned in the source, merged from the dedicated "API Response Statuses, Codes, and Descriptions" article plus codes referenced in individual endpoint articles. Some codes reuse the same numeric value across different functional groups — the table preserves the source grouping.

### General errors

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 0 | ok | The action performed successfully. |
| 1 | not transferred hash | The hash of the query is not transferred. |
| 2 | no transmitted data | The parameters of the query are not transmitted. |
| 3 | wrong posted data | The parameters of the query are wrong. |
| 4 | incorrect hash | The hash of the query is wrong. |
| 5 | invalid user name | The login is not transferred or not found in the InfluencerSoft system. |
| 6 | permission denied for ip … | Access is denied for the specified IP. |
| 7 | account disabled | Account is disabled. |

### Adding a contact errors (AddLeadToGroup)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 0 | activation email sent to subscriber | The user is added to groups. He or she is sent an activation letter. |
| 100 | email is missing | There is no email contact in the transmitted parameters. |
| 101 | subscription error: (description) | Error in adding a user to the group. |
| 102 | the subscriber is already registered | Contact already exists in all transferred groups. |
| 103 | has an invalid subscriptions group | A non-existent group was transferred in the query. |
| 104 | subscription forbidden for (group id) | Adding a contact to this group is impossible. For example, it is an auto group. |

### Order operating errors (UpdateOrderStatus)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 0 | order status changed | The order status has changed successfully. |
| 200 | nonexistent order | The order with the specified number doesn't exist. |
| 201 | wrong status | The order status is invalid. |
| 202 | order not paid | The error occurred while paying for the order. |
| 203 | order number is empty | No order number is transferred. |

### Deleting and editing a status of order errors (DeleteOrder / UpdateOrderStatus)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 0 | order status changed | The order status is changed successfully. |
| 0 | order deleted | The order is successfully deleted. |
| 302 | nonexistent order | A non-existent order number was transferred in the query. |
| 303 | wrong status | There is no such order status in the system. |

### Obtaining a purchased products list using the customer's email errors (GetBills)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 400 | order not found | The order with the specified number doesn't exist. |

### Obtaining a group list using the customer's email errors (GetLeadGroups / GetLeadGroupStatuses)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 500 | subscriber not found | The subscriber with the specified email doesn't exist. |
| 501 | group not found | The contact is not included in any group. |

### Creating the order error (CreateOrder)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 600 | wrong email | Wrong customer's email is transmitted. |
| 601 | order already exist. his number send in result array. | This order already exists. (Its number will be transferred in `result->bill_id`). |
| 602 | error creating order | The system could not create an order. |
| 603 | missing products | There are no goods in the order. |
| 604 | product not exist | There is no product with this ID in your store. (The ID of this product will be returned). |
| 605 | not having any data for delivery products | There is not enough data to deliver the product (no address or name). |

### Receiving all the products errors (GetAllGoods)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 700 | no products | The shop doesn't have any products. |

### Adding/managing a contact errors (DeleteSubscribe / UpdateSubscriberData)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 800 | group subscribers is not found | The specified group of contacts is not found (it doesn't exist). |
| 801 | subscriber with such address is not found | The specified contact is not found (he/she doesn't exist). |

### Retrieving the order data errors (GetOrderInfo / GetOrderDetails)

| Code | error_text | Meaning / When it happens |
|------|-----------|----------------------------|
| 400 | Order not found | The order with the specified number doesn't exist. |

Source note: "The response table will be supplemented, as the API service is developed."

## Endpoints

Endpoints are grouped by resource. Within each group, deprecated endpoints carry a deprecation note pointing to their replacement.

---

### Group: Contacts (Subscribers / Leads)

#### `POST` AddLeadToGroup — Add a contact to one or more groups

- **Source article:** [API: Adding a Contact to a Group](https://help.influencersoft.com/hc/en-us/articles/360050435412-API-Adding-a-Contact-to-a-Group)
- **URL pattern:** `http://username.influencersoft.com/api/AddLeadToGroup`
- **HTTP method:** POST
- **Purpose:** Adds a contact to one or more contact groups. Mirrors the subscription-form behavior; activation email may be sent.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rid[0]` | body | string | Yes | Symbolic identifier of the first group to add the contact to. | — |
  | `rid[1]`, `rid[2]`, … | body | string | No | Additional group identifiers. | — |
  | `lead_name` | body | string | No | Contact name, full name, or nickname. If empty, replaced by "Dear Friend". | "Dear Friend" |
  | `lead_email` | body | string | Yes | Contact email. | — |
  | `lead_phone` | body | string | No | Contact telephone number. | — |
  | `lead_city` | body | string | No | City of residence. | — |
  | `tag` | body | string | No | Unspecified string label that will mark the contact. | — |
  | `doneurl2` | body | string (URL) | No | Address to redirect contact to after subscription confirmation. | — |
  | `activation` | body | bool | No | If `TRUE`, requires subscriber to confirm subscription. "Used only on the 'Guru' tariff for compulsory activation of the subscription confirmation." | — |
  | `utm[utm_medium]` | body | string | No | Channel utm-parameter. Use `'affiliate'` (and only `'affiliate'`) when the subscriber comes from a partner. | — |
  | `utm[utm_source]` | body | string | No | Source utm-parameter. When `utm_medium='affiliate'`, this is the partner's InfluencerSoft login. | — |
  | `utm[utm_campaign]` | body | string | No | Campaign utm-parameter. | — |
  | `utm[utm_content]` | body | string | No | Advertisement utm-parameter. | — |
  | `utm[utm_term]` | body | string | No | Key utm-parameter. | — |
  | `utm[aff_medium]` | body | string | No | Channel affiliate parameter (partner cabinet only). | — |
  | `utm[aff_source]` | body | string | No | Source affiliate parameter. | — |
  | `utm[aff_campaign]` | body | string | No | Campaign affiliate parameter. | — |
  | `utm[aff_content]` | body | string | No | Advertisement affiliate parameter. | — |
  | `utm[aff_term]` | body | string | No | Key affiliate parameter. | — |
  | `hash` | body | string | Yes | md5 signature (see Authentication). | — |

- **Request example (PHP, from source):**

  ```php
  $send_data = array(
      'rid[0]' => 'super',
      'lead_name' => 'Name',
      'lead_email' => 'lead@email.com',
      'lead_phone' => '+788888888',
      'lead_city' => 'City',
      'tag' => 'this is tag',
      'doneurl2' => 'http://yandex.ru/',
      'activation' => true,
      'utm[utm_medium]' => 'cpc',
      'utm[utm_source]' => 'direct',
      'utm[utm_campaign]' => 'My_Campaign',
      'utm[utm_content]' => 'content_123',
      'utm[utm_term]' => 'my_label',
  );
  $send_data['hash'] = GetHash($send_data, $user_rs);
  $resp = json_decode(Send('http://username.influencersoft.com/api/AddLeadToGroup', $send_data));
  ```

- **Response:** JSON envelope (`error_code`, `error_text`, `hash`). On success, `error_code = 0` with `error_text = "activation email sent to subscriber"`.
- **Error responses:** 0, 100, 101, 102, 103, 104 (Adding a contact errors group), plus the general 1–7.
- **Notes:** Affiliate utm marks (`utm[aff_…]`) appear only in the partner's cabinet, and require the partner to be a member of the affiliate program.

---

#### `POST` UpdateSubscriberData — Update an existing contact's data

- **Source article:** [UpdateSubscriberData. Editing the Existing Contact's Data](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data)
- **URL pattern:** `http://username.influencersoft.com/api/UpdateSubscriberData`
- **HTTP method:** POST
- **Purpose:** Replace name, phone, and/or city for an existing contact identified by email. Fields that are omitted remain unchanged.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `lead_email` | body | string | Yes | Email of the existing contact. | — |
  | `lead_name` | body | string | No | New contact name. | unchanged |
  | `lead_phone` | body | string | No | New telephone number. | unchanged |
  | `lead_city` | body | string | No | New city. | unchanged |
  | `lead_tags` | body | string | No | Comma-separated subscriber tags (shown in PHP example as `'tag1,tag2,tag3'`; not enumerated in the parameter list). | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Request example (PHP, from source):**

  ```php
  $send_data = array(
      'lead_email' => 'tester@influencersoft.com',
      'lead_name' => 'John',
      'lead_phone' => '+18000000000',
      'lead_city' => 'Los Angeles',
      'lead_tags' => 'tag1,tag2,tag3',
  );
  $send_data['hash'] = GetHash($send_data, $user_rs);
  $resp = json_decode(Send('https://username.influencersoft/api/UpdateSubscriberData', $send_data));
  ```

- **Response:** JSON envelope. On success: `error_code = 0` (`error_text` describes "subscriber data are updated").
- **Error responses:** 800, 801 plus general 1–7.
- **Notes:** "You can change each contact data once using the function" (per call). Endpoint URL casing is `UpdateSubscriberData`.

---

#### `POST` DeleteSubscribe — Unsubscribe a contact from a group

- **Source article:** [DeleteSubscribe. Unsubscribe a Contact from a Group](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group)
- **URL pattern:** `http://username.influencersoft.com/api/DeleteSubscribe`
- **HTTP method:** POST
- **Purpose:** Unsubscribe a contact from a specific group.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `lead_email` | body | string | Yes | Email of the unsubscribing contact. | — |
  | `rass_name` | body | string | Yes | Group identifier the contact is being unsubscribed from. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Request example (PHP, from source):**

  ```php
  $send_data = array(
      'lead_email' => 'lead@email.com',
      'rass_name' => 'super',
  );
  $send_data['hash'] = GetHash($send_data, $user_rs);
  $resp = json_decode(Send('http://username.justclick.io/api/DeleteSubscribe', $send_data));
  ```

  (PHP example in the source uses a `justclick.io` host; the documented base is `username.influencersoft.com`.)
- **Response:** JSON envelope. `error_code = 0` on success.
- **Error responses:** 800, 801 plus general 1–7.
- **Notes:** "The activation confirmation email will not be received after re-subscribing."

---

#### `POST` GetLeadGroups — List groups for a contact (DEPRECATED)

- **Source article:** [GetLeadGroups. Receiving a List of All Contact Groups](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups)
- **Deprecation:** "This method is out-of-date. Use GetLeadGroupStatuses instead."
- **URL pattern:** `http://username.influencersoft.com/api/GetLeadGroups`
- **HTTP method:** POST
- **Purpose:** Return all groups a contact is in, by the contact's email.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `email` | body | string | Yes | Subscriber email. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response:** JSON envelope with `result` array.

  ```
  $resp->result = Array(
      [0] => array( [rass_name] => Group 1 ID,  [rass_title] => Group 1 Name ),
      [1] => array( [rass_name] => Group 2 ID,  [rass_title] => Group 2 Name ),
      [2] => array( [rass_name] => Group 3 ID,  [rass_title] => Group 3 Name ),
  )
  ```

  Each element fields:
  - `rass_name` — group ID (symbolic).
  - `rass_title` — group display name.

- **Error responses:** 500, 501 plus general 1–7.
- **Notes:** Replaced by `GetLeadGroupStatuses`.

---

#### `POST` GetLeadGroupStatuses — List groups for a contact with subscription status

- **Source article:** [GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status)
- **URL pattern:** `http://username.influencersoft.com/api/GetLeadGroupStatuses`
- **HTTP method:** POST
- **Purpose:** Modern replacement for `GetLeadGroups`. Returns groups plus subscription status and subscription time per group.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `email` | body | string | Yes | Subscriber email. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response:**

  ```
  Array(
      [0] => stdClass Object(
          [rass_name] => Group 1 ID,
          [rass_title] => Group 1 Name,
          [rass_status] => Group 1 Subscription Status,
          [subscription_time] => Group 1 Subscription Time
      ),
      ...
  )
  ```

  Fields per element:
  - `rass_name` — group ID.
  - `rass_title` — group display name.
  - `rass_status` — subscription status enum (see below).
  - `subscription_time` — when the contact subscribed to this group.

- **`rass_status` allowed values:**

  | Value | Meaning |
  |-------|---------|
  | `STATUS_WAIT` | Activation is pending. |
  | `STATUS_SUBSCRIBE` | Subscription is signed / activated. |
  | `STATUS_UNSUBSCRIBE` | Client unsubscribed. |
  | `STATUS_UNSUBSCRIBE_BY_SERVICE` | Client unsubscribed from service. |
  | `STATUS_INVALID_EMAIL` | Email doesn't exist. |

- **Error responses:** 500, 501 plus general 1–7.

---

#### `POST` GetAllGroups — List all contact groups in the account

- **Source article:** [GetAllGroups. Receiving a List of All Contact Groups from the Account](https://help.influencersoft.com/hc/en-us/articles/360050436312-GetAllGroups-Receiving-a-List-of-All-Contact-Groups-from-the-Account)
- **URL pattern:** `http://username.influencersoft.com/api/GetAllGroups`
- **HTTP method:** POST
- **Purpose:** Return every (non-auto) contact group in the account.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `hash` | body | string | Yes | md5 signature. (No other parameters.) | — |

- **Response:**

  ```
  $resp->result = Array(
      [0] => array( [rass_name] => Group 1 ID,  [rass_title] => Group 1 Name ),
      [1] => array( [rass_name] => Group 2 ID,  [rass_title] => Group 2 Name ),
      ...
  )
  ```

  Fields: `rass_name`, `rass_title`.
- **Error responses:** General 1–7.
- **Notes:** "Auto-groups will not be included in this list."

---

#### `POST` GetCountSubscribe — Get count of contacts in shop or group

- **Source article:** [API: Getting the Number of Store's/Group's Contacts](https://help.influencersoft.com/hc/en-us/articles/360050903411-API-Getting-the-Number-of-Store-s-Group-s-Contacts)
- **URL pattern:** `http://username.influencersoft.com/api/GetCountSubscribe`
- **HTTP method:** POST
- **Purpose:** Return the number of contacts in a group, or in the whole shop using reserved identifiers.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `group_name` | body | string | Yes | Group identifier, or a reserved identifier: `unique` (active unique contacts), `all` (all contacts). | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Request example (PHP, from source):**

  ```php
  $send_data['group_name'] = "group identifier (you also can specify the reserved ones)";
  $send_data['hash'] = GetHash($send_data, $user_rs);
  $resp = json_decode(Send('http://username.influencersoft.com/api/GetCountSubscribe', $send_data));
  ```

- **Response:** JSON envelope with `result` being the numeric count. The shape of `result` is "the numerical value of the number of contacts."
- **Error responses:** General 1–7. Reserved-identifier-specific error codes not specified in source.

---

### Group: Products (Goods)

#### `POST` AddGood — Create a new product

- **Source article:** [AddGood. Creating a New Product](https://help.influencersoft.com/hc/en-us/articles/360050671852-AddGood-Creating-a-New-Product)
- **URL pattern:** `http://username.influencersoft.com/api/AddGood`
- **HTTP method:** POST
- **Purpose:** Create a new product in an existing category. Category must already exist.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `good_name` | body | string | Yes | Product identifier. Must be unique within the account. | — |
  | `good_type` | body | int | Yes | Product type: `1` = physical, `0` = digital. (Note: example PHP also shows `'real'` and `'digital'` string values — but the parameter doc lists `1`/`0`.) | — |
  | `good_title` | body | string | Yes | Product name. | — |
  | `parent_id` | body | int | No | Category ID. Category must already exist. | — |
  | `good_sum` | body | number | Yes | Product price. | — |
  | `good_api_url_notif` | body | string (URL) | No | URL for API notifications when the bill is paid. | — |
  | `good_api_url_new_order` | body | string (URL) | No | URL for API notifications when the invoice is created. | — |
  | `good_success_link` | body | string (URL) | No | URL the customer is redirected to after successful payment. | — |
  | `good_client_rassilki` | body | string | No | Group identifiers separated by commas. Customers join these groups after the order. If a group does not exist it is created. (Example PHP shows the field as `good_client_mailings` — source parameter list uses `good_client_rassilki`.) | — |
  | `good_nalozh_only` | body | int | No | Physical goods only. Send by cash on delivery immediately after order creation: `0` no, `1` yes. | — |
  | `good_quickpost_article` | body | string | No | Article (identifier) of the goods in the QuickPost delivery service. | — |
  | `good_post_service` | body | string | No | Delivery service. Allowed values: `none` (deliver itself), `quickpost` (QuickPost). | — |
  | `good_only_countries` | body | string | No | Country IDs comma-separated, no spaces, e.g., `US,UK`. If omitted, no country restriction. | — |
  | `good_download` | body | string (URL) | No | Download link. For a physical product, may point to its digital copy. | — |
  | `good_mail_subject` | body | string | No | Subject of the post-payment customer email. | — |
  | `good_mail_format` | body | string | No | Email format: `html` or `text`. | — |
  | `good_mail_body` | body | string | No | HTML code of the email (used if `good_mail_format=html`). | — |
  | `good_mail_text` | body | string | No | Text version of the email (used if `good_mail_format=text`). | — |
  | `good_partner_fee` | body | number | No | First-level partner commission in $. | — |
  | `good_partner_fee_perc` | body | number | No | First-level partner commission in %. | — |
  | `good_partner_pfee` | body | number | No | Second-level partner commission in $. | — |
  | `good_partner_pfee_perc` | body | number | No | Second-level partner commission in %. | — |
  | `good_partner_show` | body | int | No | Show product in partner advertising materials: `0` no, `1` yes. | — |
  | `good_partner_SL_link` | body | string (URL) | No | URL of the product description (sales letter) page. | — |
  | `good_partner_addition_link` | body | string (URL) | No | URL of page with additional promotional materials. | — |
  | `good_partner_text` | body | string | No | Information for partners (short note for partner advertising materials). | — |
  | `good_pay_text` | body | string | No | HTML code for the order payment page. Allowed substitution tags: `# IMAGE #`, `# PRODUCT #`, `# PRICE #`, `# USD #`. | — |
  | `good_timer` | body | int | No | Time limit for order payment: `0` no, `1` yes. | — |
  | `good_timer_unit` | body | string | No | Limit unit. Allowed values: `min`, `hour`, `day`. | — |
  | `good_timer_duration` | body | int | No | Duration value of the restriction (in `good_timer_unit` units). | — |
  | `good_use_short` | body | int | No | Use a short link for the order page: `0` no, `1` yes. | — |
  | `good_rashod` | body | number | No | Cost of manufacturing/sending in $. | — |
  | `good_rashod_perc` | body | number | No | Costs as % of product price (e.g., taxes). | — |
  | `good_publish` | body | int | No | Display the product in the catalog: `0` no, `1` yes. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

  Required fields per source: `good_name`, `good_type`, `good_title`, `good_sum`.

- **Response:** JSON envelope. `error_code = 0` on success.
- **Error responses:** General 1–7. Source does not enumerate AddGood-specific creation error codes (overlap with CreateOrder error group is not asserted).
- **Notes:**
  - Source notes `influencersoft_partner_id` and `influencersoft_ad_id` query parameters are passed to the order page when a custom purchase page is set. These can be read off the redirect URL to recover the partner and ad-tag IDs for downstream `CreateOrder` calls.
  - Affiliate link format: `http://shop.YOUR_SHOP.com/aff/sl/PRODUCT/PARTNER/` → forwards to `http://YOUR_WEBSITE.com/PURCHASE_PAGE/?YOUR_PARAMETERS&influencersoft_partner_id=PARTNER'S_ID&influencersoft_ad_id=ADVTAG_ID`.

---

#### `POST` UpdateGood — Update an existing product

- **Source article:** [UpdateGood. Changing the Settings of the Existing Product](https://help.influencersoft.com/hc/en-us/articles/360050672212-UpdateGood-Changing-the-Settings-of-the-Existing-Product)
- **URL pattern:** `http://username.influencersoft.com/api/UpdateGood`
- **HTTP method:** POST
- **Purpose:** Replace the settings of an existing product identified by `good_name`.
- **Parameters:** Same parameter set as `AddGood`. Required field set per source for UpdateGood: **only `good_name`**. (The parameter listing also marks `good_title` and `good_sum` "required" in the bullet list, but the concluding sentence states "good_name fields is the only field required. The other query parameters are up to you.") All other fields are optional and act as partial updates.

  See the AddGood parameter table above for the full field reference, including allowed values for `good_type` (1/0), `good_post_service` (`none`/`quickpost`), `good_mail_format` (`html`/`text`), `good_timer_unit` (`min`/`hour`/`day`), and the substitution tags allowed in `good_pay_text` (`# IMAGE #`, `# PRODUCT #`, `# PRICE #`, `# USD #`).

- **Response:** JSON envelope. `error_code = 0` on success.
- **Error responses:** General 1–7. UpdateGood-specific codes not specified in source.
- **Notes:** "You can change each product only once using the function" (per call).

---

#### `POST` DeleteGood — Delete a product

- **Source article:** [DeleteGood. Deleting a Product](https://help.influencersoft.com/hc/en-us/articles/360050672152-DeleteGood-Deleting-a-Product)
- **URL pattern:** `http://username.influencersoft.com/api/DeleteGood`
- **HTTP method:** POST
- **Purpose:** Delete a product by its symbolic identifier.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `good_name` | body | string | Yes | Product identifier. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response:** JSON envelope. `error_code = 0` on success.
- **Error responses:** General 1–7.
- **Notes:** "You can delete each product only once using the function" (per call).

---

#### `POST` GetAllGoods — List all products

- **Source article:** [GetAllGoods. Getting a List of All Products](https://help.influencersoft.com/hc/en-us/articles/360051157731-GetAllGoods-Getting-a-List-of-All-Products)
- **URL pattern:** `http://username.influencersoft.com/api/GetAllGoods`
- **HTTP method:** POST
- **Purpose:** Return all products.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `hash` | body | string | Yes | md5 signature. (No other parameters.) | — |

- **Response:** JSON envelope with `result` array. Each element:

  ```
  array(
      [good_id]    => 12549,
      [good_name]  => "payment",
      [good_title] => "PAYMENT",
      [good_sum]   => 3900.00,
      [good_type]  => 1
  )
  ```

  Fields:
  - `good_id` — numeric digital ID in the system.
  - `good_name` — symbolic ID (user-defined, shown in the service interface).
  - `good_title` — product name from shop settings.
  - `good_sum` — product price.
  - `good_type` — type: `digital`, `physical`, or "with floating price" (source enumerates these three; example values shown are `1`, `0`, and empty).

- **Error responses:** 700 (`no products`) plus general 1–7.

---

### Group: Orders (Invoices)

#### `POST` CreateOrder — Create a new invoice (order)

- **Source article:** [CreateOrder. Creating a New Invoice](https://help.influencersoft.com/hc/en-us/articles/360050502452-CreateOrder-Creating-a-New-Invoice)
- **URL pattern:** `http://username.influencersoft.com/api/CreateOrder`
- **HTTP method:** POST
- **Purpose:** Create a single order containing one or more existing products for a customer. Returns the created `bill_id` in `result->bill_id`.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `goods` | body | array | Yes | Array of product entries. Each entry has `good_name` (product ID, required) and optionally `good_sum` (override price; if omitted, store price is used). | — |
  | `bill_first_name` | body | string | Conditional* | Customer's first name. | — |
  | `bill_surname` | body | string | Conditional* | Customer's surname. | — |
  | `bill_middle_name` | body | string | No | Customer's middle name. | — |
  | `bill_email` | body | string | Yes | Customer's email. | — |
  | `bill_phone` | body | string | No | Customer's telephone number. | — |
  | `bill_country` | body | string | Conditional* | Country of delivery. (Source example uses `"USA"`; canonical 3-letter codes published in the Country Identifiers article.) | — |
  | `bill_region` | body | string | No | Delivery region. | — |
  | `bill_city` | body | string | Conditional* | City of customer's residence. | — |
  | `bill_address` | body | string | Conditional* | Delivery address. | — |
  | `bill_postal_code` | body | string | No | Postal code. | — |
  | `bill_kupon` | body | string | No | Discount coupon (as configured in store settings). Source parameter list uses `bill_kupon`; PHP example uses `bill_coupon`. | — |
  | `bill_tag` | body | string | No | Free-form order marker / tag. | — |
  | `bill_comment` | body | string | No | Comment on the order. | — |
  | `bill_ip` | body | string | No | Customer's IP. | — |
  | `bill_timer_kill` | body | bool / int / unixtime | No | Invoice cancellation rule. `true` or `1` = take time from product settings; `false` or `0` = invoice not auto-cancelled; or pass a UNIX timestamp to specify cancellation moment. | — |
  | `bill_created` | body | int (unixtime) | No | Order creation time (seconds since 1970-01-01). | — |
  | `bill_domain` | body | string | No | Order-acceptance domain. Recommended to pass without protocol. | — |
  | `utm[utm_medium]` | body | string | No | Channel utm-parameter. Use `'affiliate'` to flag affiliate origin. | — |
  | `utm[utm_source]` | body | string | No | Source utm. When affiliate, set to the partner login. | — |
  | `utm[utm_campaign]` | body | string | No | Campaign utm. | — |
  | `utm[utm_content]` | body | string | No | Advertisement utm. | — |
  | `utm[utm_term]` | body | string | No | Key utm. | — |
  | `utm[aff_medium]` | body | string | No | Channel affiliate parameter (partner cabinet only). | — |
  | `utm[aff_source]` | body | string | No | Source affiliate parameter. | — |
  | `utm[aff_campaign]` | body | string | No | Campaign affiliate parameter. | — |
  | `utm[aff_content]` | body | string | No | Advertisement affiliate parameter. | — |
  | `utm[aff_term]` | body | string | No | Key affiliate parameter. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

  \* `bill_first_name`, `bill_surname`, `bill_country`, `bill_city`, `bill_address` are required only for physical goods that need to be shipped.

- **Request example (PHP, from source):**

  ```php
  $good1 = array('good_name' => 'invoice', 'good_sum' => 1500);
  $good2 = array('good_name' => 'sales'); // price taken from store settings

  $send_data = array(
      'goods' => array($good1, $good2),
      'bill_first_name' => "Name",
      'bill_surname' => "Surname",
      'bill_middle_name' => "Middle Name",
      'bill_email' => "user4@email.com",
      'bill_phone' => "+7(928)777-77-77",
      'bill_country' => "USA",
      'bill_region' => "New York",
      'bill_city' => "New York",
      'bill_address' => "Wall St.",
      'bill_postal_code' => "345678",
      'bill_coupon' => "skidka50",
      'bill_tag' => 'AdWords',
      'bill_comment' => 'in a beautiful box',
      'bill_ip' => '192.168.0.1',
      'bill_timer_kill' => true,
      'bill_created' => 1291001819,
      'bill_domain' => 'www.shop.com',
      'utm[utm_medium]' => 'cpc',
      'utm[utm_source]' => 'direct',
      'utm[utm_campaign]' => 'my campaign',
      'utm[utm_content]' => 'content_123',
      'utm[utm_term]' => 'my_label',
  );
  $send_data['hash'] = GetHash($send_data, $user_rs);
  $resp = json_decode(Send('https://username.influencersoft.com/api/CreateOrder', $send_data));
  ```

- **Response:** JSON envelope. On success `result->bill_id` contains the created invoice number.
- **Error responses:** 600, 601, 602, 603, 604, 605 plus general 1–7.
- **Notes:** When `bill_domain` is provided, `$resp->result['link']` from later calls (e.g., `GetOrderDetails`) returns a fully qualified URL ready for `header("Location: …")`. When `bill_domain` is omitted, the caller must prefix the link with its own protocol+domain.

---

#### `POST` UpdateOrderStatus — Change invoice status

- **Source article:** [UpdateOrderStatus. Changing Invoice Status](https://help.influencersoft.com/hc/en-us/articles/360050670752-UpdateOrderStatus-Changing-Invoice-Status)
- **URL pattern:** `http://username.influencersoft.com/api/UpdateOrderStatus`
- **HTTP method:** POST
- **Purpose:** Update an order's status; can also write the sending date, payment date, and tracking number.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `bill_id` | body | int | Yes | Order number. | — |
  | `status` | body | string | Yes | Allowed: `sent` (order sent by mail), `paid` (payment made), `return` (customer returned), `cancel` (order cancelled). | — |
  | `date` | body | int (unixtime) | Conditional | Time of sending or payment (seconds since 1970-01-01). Required for `sent` and `paid` statuses. | — |
  | `rpo` | body | string | Conditional | Tracking number of postal item. Required for `sent` status. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Request example (PHP, from source):**

  ```php
  $send_data = array(
      'bill_id' => '100000',
      'status' => 'sent',
      'date' => '1362254400',
      'rpo' => '10000000000000',
  );
  $send_data['hash'] = GetHash($send_data, $user_rs);
  $resp = json_decode(Send('https://username.influencersoft.com/api/UpdateOrderStatus', $send_data));
  ```

- **Response:** JSON envelope. `error_code = 0` (`order status changed`) on success.
- **Error responses:** 200, 201, 202, 203 plus 302, 303 plus general 1–7.

---

#### `POST` DeleteOrder — Delete (hide) an invoice

- **Source article:** [DeleteOrder. Deleting/Hiding an Invoice](https://help.influencersoft.com/hc/en-us/articles/360050556792-DeleteOrder-Deleting-Hiding-an-Invoice)
- **URL pattern:** `http://username.influencersoft.com/api/DeleteOrder`
- **HTTP method:** POST
- **Purpose:** Delete an order by its number.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `bill_id` | body | int | Yes | Order number to delete. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response:** JSON envelope. `error_code = 0` (`order deleted`) on success.
- **Error responses:** 302 (`nonexistent order`) plus general 1–7.

---

#### `POST` GetOrders — List invoices (filtered) (DEPRECATED)

- **Source article:** [GetOrders. Getting a List of All Invoices](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices)
- **Deprecation:** "We recommend you use the new getOrdersWithGoods function instead of this one."
- **URL pattern:** `http://username.influencersoft.com/api/GetOrders`
- **HTTP method:** POST
- **Purpose:** Return a list of orders matching optional filters.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `date_s` | body | int (unixtime) | No | "From" date. | — |
  | `date_e` | body | int (unixtime) | No | "To" date. | — |
  | `paid` | body | bool | No | Only paid orders. | — |
  | `goods` | body | string or array | No | Product IDs. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response:** JSON envelope with `result` array of order objects. Each object fields:

  ```
  id, first_name, last_name, middle_name, email, phone, city, country,
  address, region, postalcode, created, pay_status, paid, type, payway,
  comment, domain, link, utm{medium, source, campaign, content, term}, price
  ```

  See `GetOrderInfo` / `GetOrderDetails` below for fuller field descriptions.
- **Error responses:** General 1–7.

---

#### `POST` getOrdersWithGoods — List invoices with full goods detail

- **Source article:** [GetOrdersWithGoods. Getting a Maximally Detailed List of All Accounts](https://help.influencersoft.com/hc/en-us/articles/360051149651-GetOrdersWithGoods-Getting-a-Maximally-Detailed-List-of-All-Accounts)
- **URL pattern:** `http://username.influencersoft.com/api/getOrdersWithGoods`
- **HTTP method:** POST
- **Purpose:** Most detailed order list — includes each order's items array and per-item partner attribution.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `begin_date` | body | string | No | "From" date, format `DD.MM.YYYY` (e.g., `01.01.2017`). If not transmitted, "data is given for the current day." | current day |
  | `end_date` | body | string | No | "To" date, format `DD.MM.YYYY`. If not specified, "the current moment is taken." | now |
  | `paid` | body | bool | No | If `true`, returns only paid invoices in the interval. | — |
  | `goods` | body | string or array | No | Product IDs (from address bar when editing the product). | — |
  | `hash` | body | string | Yes | md5 signature. | — |

  Interval rules from source: "you can enter a time interval for a month or less." If the dates span more than a month, the interval is shortened to a month by trimming the begin date — the end date is preserved.

- **Response:** Array of order objects. Each object:

  ```
  id, first_name, last_name, middle_name, email, phone, city, country,
  address, region, postalcode, created, pay_status, paid, type, payway,
  comment, domain, link, good_count, price, is_recurrent, bill_sum_topay,
  tag, kupon,
  utm { medium, source, campaign, content, term },
  items [
      {
          id, title, sum, price,
          partners [
              { partner_lvl, partner_id, partner_name, partner_fee },
              ...
          ]
      },
      ...
  ]
  ```

  Field meanings:
  - `id` — invoice number.
  - `pay_status` — invoice status (see notification statuses below).
  - `paid` — date paid.
  - `type` — order type.
  - `payway` — payment method.
  - `domain` — order domain.
  - `link` — link to the payment page.
  - `good_count` — number of products in the order.
  - `price` — product price.
  - `is_recurrent` — true/false; recurring bill flag.
  - `bill_sum_topay` — left to pay.
  - `kupon` — used coupon.
  - `items[].sum` — actual cost (incl. up-sell/discount).
  - `items[].price` — product price from settings.
  - `items[].partners[].partner_lvl` — affiliate program level.

- **Error responses:** General 1–7.

---

#### `POST` GetOrderInfo — Get one invoice's information (DEPRECATED)

- **Source article:** [GetOrderInfo. Getting Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050664772-GetOrderInfo-Getting-Invoice-Information)
- **Deprecation:** "We recommend using the new getOrderDetails function instead of this one."
- **URL pattern:** `http://username.influencersoft.com/api/GetOrderInfo`
- **HTTP method:** POST
- **Purpose:** Return invoice information by ID.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `bill_id` | body | int | Yes | Invoice ID. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response (result object fields):**

  ```
  id, first_name, last_name, middle_name, email, phone, city, country,
  address, region, postalcode, created, pay_status, paid, type, payway,
  comment, domain, link, good_count, price, bill_sum_topay, tag, coupon,
  utm { medium, source, campaign, content, term, price }
  ```

- **Error responses:** 400 (`Order not found`) plus general 1–7.

---

#### `POST` getOrderDetails — Get one invoice's detailed information

- **Source article:** [GetOrderDetails. Getting Detailed Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050558052-GetOrderDetails-Getting-Detailed-Invoice-Information)
- **URL pattern:** `http://username.influencersoft.com/api/getOrderDetails`
- **HTTP method:** POST
- **Purpose:** Modern replacement for `GetOrderInfo`. Returns the same fields plus an `items` array with per-line partner attribution and pin codes; optionally returns aggregate product info.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `bill_id` | body | int | Yes | Invoice ID. | — |
  | `good_info` | body | bool | No | If `1`/`true`, add product info to the response (`good_ids`, `good_count`, `prepayment_enabled`, `prepayment_minsum`). | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response (result object fields):**

  ```
  id, first_name, last_name, middle_name, email, phone, city, country,
  address, region, postalcode, created, pay_status, paid, type, payway,
  comment, domain, link, good_count, price, bill_sum_topay, tag, coupon,
  utm { medium, source, campaign, content, term },
  items [
      {
          id, title, sum, price, pincode,
          partners [
              { partner_lvl, partner_id, partner_name, partner_fee },
              ...
          ]
      },
      ...
  ]
  ```

  Additional fields when `good_info=true`:
  - `good_ids` — product IDs in the invoice.
  - `good_count` — number of products in the invoice.
  - `prepayment_enabled` — whether prepayment is allowed.
  - `prepayment_minsum` — minimal prepayment amount.

- **Error responses:** 400 plus general 1–7.
- **Notes:** Link-handling behavior is identical to `GetOrderInfo` (see CreateOrder notes about `bill_domain`).

---

#### `POST` GetBills — List invoices and products for a customer email

- **Source article:** [GetBills. Receiving a List of Invoices and Its Data by Customer's Email](https://help.influencersoft.com/hc/en-us/articles/360050557192-GetBills-Receiving-a-List-of-Invoices-and-Its-Data-by-Customer-s-Email)
- **URL pattern:** `http://username.influencersoft.com/api/GetBills`
- **HTTP method:** POST
- **Purpose:** Return a customer's orders (with their items) by email, optionally filtered by payment status.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `email` | body | string | Yes | Customer's email. | — |
  | `pay_status` | body | string | No | One of `paid`, `waiting`, `cancel`. If omitted, all orders are returned. | all |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response shape:** `result` keyed by order number → keyed by product code → `{good_name, good_title}`. Example from source:

  ```
  array(
      [258367] => array(
          [12549] => array( [good_name] => "payment", [good_title] => "payment for training" )
      ),
      [258368] => array(
          [13011] => array( [good_name] => "sales",   [good_title] => "sales in cinemas" ),
          [28363] => array( [good_name] => "222",     [good_title] => "222 ways" )
      )
  )
  ```

- **Error responses:** 400 (`order not found`) plus general 1–7.
- **Notes:** The PHP example in the source uses `Send('https://username.influencersoft.com/GetBills', …)` (no `/api/` prefix) — this appears to be a typo; the documented base URL includes `/api/`.

---

### Group: Partner Statistics

#### `POST` GetPartnerStats — Get a partner's statistics

- **Source article:** [GetPartnerStats. Get Partner's Statistics](https://help.influencersoft.com/hc/en-us/articles/360050671232-GetPartnerStats-Get-Partner-s-Statistics)
- **URL pattern:** `http://username.influencersoft.com/api/GetPartnerStats`
- **HTTP method:** POST
- **Purpose:** Return aggregate statistics for one partner over a time interval.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `partner` | body | string | Yes | Partner's login. | — |
  | `date_from` | body | string | No | Lower bound, format `YYYY-MM-DD`. | — |
  | `date_to` | body | string | No | Upper bound, format `YYYY-MM-DD`. | — |
  | `hash` | body | string | Yes | md5 signature. | — |

- **Response (`result` keys):**

  | Key | Meaning |
  |-----|---------|
  | `earned_total` | Charged $. |
  | `topay_total` | Pay $. |
  | `clicks_total` | Number of clicks. |
  | `leads_total` | Number of contacts. |
  | `bills_total` | Number of payments. |
  | `partners_total` | Number of partners. |

- **Error responses:** General 1–7.

---

### Group: Script Notifications (Outbound Webhooks)

These are not endpoints you call — they are HTTP POSTs that InfluencerSoft sends to URLs configured on each product (or globally in the API settings) when various events happen. Payloads are URL-encoded.

#### Inbound: Subscription notification (newsletter subscribed)

- **Source article:** [The Script Notification When Subscribing for Your Newsletters](https://help.influencersoft.com/hc/en-us/articles/360050437792-The-Script-Notification-When-Subscribing-for-Your-Newsletters)
- **Configured at:** API settings → **URL for API Notifications** field.
- **Trigger:** Subscription and activation events. The same URL receives both; differentiate by `status`.
- **HTTP method:** POST
- **Content-Type:** `application/x-www-form-urlencoded`
- **Payload fields:**

  | Field | Description |
  |-------|-------------|
  | `name` | Contact name. |
  | `email` | Contact email. |
  | `phone` | Contact phone. |
  | `city` | City. |
  | `id_group` | Contact group number. |
  | `ip` | Subscriber IP. |
  | `status` | `2` = subscription event, `1` = subscription activation. |
  | `utm[medium]` | Channel utm. |
  | `utm[source]` | Source utm. |
  | `utm[campaign]` | Campaign utm. |
  | `utm[content]` | Advertisement utm. |
  | `utm[term]` | Key utm. |

---

#### Inbound: Unsubscribe notification

- **Source article:** [The Script Notification When Unsubscribing from Your Newsletters](https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters)
- **Configured at:** API settings → **URL for Notifications** field.
- **Trigger:** Only after an unsubscription (group admin removes a subscriber).
- **HTTP method:** POST, URL-encoded.
- **Payload fields:** `name`, `email`, `phone`, `city`, `id_group`, `ip`, `status` (always `0`, signifying the subscriber's status in this group is now "Unsubscribed").

---

#### Inbound: Invoice created / cancelled notifications

- **Source article:** [Creating and Canceling the Invoice Script Notification](https://help.influencersoft.com/hc/en-us/articles/360051022491-Creating-and-Canceling-the-Invoice-Script-Notification)
- **Configured at (per product):**
  - **URL for API notifications about the created invoice** — invoice created.
  - **URL for API notifications about the canceled invoice** — invoice cancelled.
- **Both:** POST, URL-encoded.

**Created-invoice payload fields:**

| Field | Description |
|-------|-------------|
| `status` | `new order` |
| `id` | Order number. |
| `first_name` | Customer's first name. |
| `last_name` | Customer's surname. |
| `middle_name` | Customer's middle name. |
| `email` | Customer's email. |
| `phone` | Customer's phone. |
| `city` | Delivery city. |
| `country` | Delivery country. |
| `address` | Delivery address. |
| `region` | Delivery region. |
| `postalcode` | Postal code. |
| `created` | Order creation time. |
| `comment` | Order comment. |
| `tag` | Tag. |
| `kupon` | Used coupon. |
| `domain` | Order domain. |
| `link` | Link to the order payment page. |
| `utm[medium]` | Channel utm. |
| `utm[source]` | Source utm. |
| `utm[campaign]` | Campaign utm. |
| `utm[content]` | Advertisement utm. |
| `utm[term]` | Key utm. |
| `items[n].id` | Per-item character identifier. |
| `items[n].title` | Per-item product name. |
| `items[n].sum` | Per-item actual cost (incl. up-sell/discount). |
| `items[n].price` | Per-item price from settings. |
| `hash` | `md5(order_number + customer_email + order_creation_time + secret_key)` |

**Cancelled-invoice payload fields:** Same shape as above except `status = 'cancel_order'`, no `tag`, no `kupon`, no `link`. Hash formula same.

**Verification (PHP, from source):**

```php
$hash = md5($_REQUEST['id'].$_REQUEST['email'].$_REQUEST['paid'].$setts['user_rps_key']);
```

(Note: the source example uses `$_REQUEST['paid']` here even though `paid` is not in the created-invoice payload — likely the formula assumes whichever timestamp is relevant to the event.)

---

#### Inbound: Paid / Prepayment / Moneyback notifications

- **Source article:** [Script Notification for Prepayment of the Invoice, for Its Paying Off, and for Refund (Moneyback)](https://help.influencersoft.com/hc/en-us/articles/360050665012-Script-Notification-for-Prepayment-of-the-Invoice-for-Its-Paying-Off-and-for-Refund-Moneyback)
- **Configured at (per product):**
  - **URL for API notifications about the paid invoice** — for paying off.
  - **URL for API notifications about the pre-paid invoice** — for prepayment.
  - **URL for API notifications about the Moneyback** — for refund.

**Paying-off payload fields:**

| Field | Description |
|-------|-------------|
| `id` | Order number. |
| `first_name` | Customer's first name. |
| `last_name` | Customer's last name. |
| `middle_name` | Customer's middle name. |
| `email` | Customer's email. |
| `phone` | Customer's phone. |
| `city` | Delivery city. |
| `country` | Delivery country. |
| `address` | Delivery address. |
| `region` | Delivery region. |
| `postalcode` | Postal code. |
| `created` | Order creation time. |
| `paid` | Order paying-off time. |
| `last_payment_sum` | Amount of the last payment. If bill is paid in one payment, equals total. |
| `comment` | Order comment. |
| `tag` | Tag. |
| `coupon` | Used coupon. |
| `type` | Order type. |
| `payway` | Method of payment. |
| `domain` | Order domain. |
| `is_recurrent` | Recurrent bill flag: `1` yes, `0` no. |
| `utm[medium]`, `utm[source]`, `utm[campaign]`, `utm[content]`, `utm[term]` | utm marks. |
| `items[n].id`, `items[n].title`, `items[n].sum`, `items[n].price`, `items[n].pincode` | Per-item. |
| `items[n].partners[m].partner_lvl` | Affiliate level. |
| `items[n].partners[m].partner_id` | Partner identifier. |
| `items[n].partners[m].partner_name` | Partner login. |
| `items[n].partners[m].partner_fee` | Partner charges. |
| `hash` | `md5(order_number + customer_email + paying_off_time + secret_key)` |

**Prepayment payload fields:** Same as paying-off, except: no `paid`, no `last_payment_sum`, no `address`, no `comment`, no `tag`, no `payway`, no `type`; adds `prepayment_sum` (prepayment amount) and `link` (order payment page). `is_recurrent` and full `items[]` (with `partners[]`) are still included.

**Moneyback payload fields:** As paying-off, except `status = 'moneyback'`, no `paid`, no `last_payment_sum`, no `tag`, no `coupon`, no `type`, no `payway`, no `domain`, no `address`; includes `comment`, `is_recurrent`, full `utm` block, and `items[]` (items contain `id`, `title`, `sum`, `price` — no `pincode` and no `partners` enumerated in source).

**Verification (PHP, from source):**

```php
$hash = md5($_REQUEST['id'].$_REQUEST['email'].$_REQUEST['paid'].$setts['user_rps_key']);
```

The secret key is found at "API" section → "API key" in the personal cabinet.

---

#### Inbound: PostBack notifications (third-party analytics)

- **Source article:** [PostBack Notifications](https://help.influencersoft.com/hc/en-us/articles/360050672292-PostBack-Notifications)
- **Configured at:** *Postback URL* field in the relevant product/partner UI, with a **Parameters** button to choose which fields to append.
- **Purpose:** Notify a third-party analytics service of a committed conversion. Parameters are appended as query string to the configured URL.
- **HTTP method:** Not specified in source (typically a GET request from InfluencerSoft to the configured URL with the parameters in the query string).
- **Available substitution tokens** (from the example URL):

  | Token | Meaning |
  |-------|---------|
  | `{$aff_medium}` | Affiliate channel parameter. |
  | `{$aff_source}` | Affiliate source parameter. |
  | `{$aff_content}` | Affiliate advertisement parameter. |
  | `{$aff_term}` | Affiliate key parameter. |
  | `{$aff_campaign}` | Affiliate campaign parameter. |
  | `{$date}` | Date. |
  | `{$time}` | Time. |
  | `{$bill}` | Bill (order) number. |
  | `{$profit}` | Profit. |
  | `{$product}` | Product. |

  Example URL from source:

  ```
  http://Postback_Url.html?aff_medium={$aff_medium}&aff_source={$aff_source}&aff_content={$aff_content}&aff_term={$aff_term}&aff_campaign={$aff_campaign}&date={$date}&time={$time}&bill={$bill}&profit={$profit}&product={$product}
  ```

- **Notes:** Click **Save** after adding parameters.

---

### Group: Integrations

#### Zapier integration

- **Source article:** [Integration with Zapier.com](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com)
- **Type:** Not a direct API endpoint. Configured inside Zapier using InfluencerSoft as an app.
- **Authentication into Zapier:** Three fields in the Zapier connection form:
  - **Login** — InfluencerSoft username.
  - **API Key** — copied from `https://YourLogin.influencersoft.com/shops/setts/apisettings/`.
  - **Domain** — `influencersoft.com`.
- **Triggers (InfluencerSoft → Zapier):**

  | Trigger | Fires when |
  |---------|-----------|
  | `Added to List` | Subscribe to list / adding contact. |
  | `New Purchase` | New purchase, paid product. |
  | `New Lead` | A new lead is created. |
  | `New Order` | New order created (not yet paid). |

- **Fields sent on `Added to List`:** first name (if specified), middle name (if specified), last name (if specified), email address, phone, city (if specified), group name, group id, group category (if specified), tags, customer information, contact ip, contact time zone (e.g., `UTC+03`), contact id, contact creation date, global status of contact, lead personal manager (last name, first name, login).

- **Fields sent on `New Purchase` / `New Order`:** Order id, Order amount, Tax sum, Order currency, Order created at, Order paid at, Order status, Payment method, Order IP, Product id, Product type, Product order page, Product Name, Product price, Product thank you page url, Billing address, Billing country, Billing city, Billing state, Billing zip, Shipping address, Shipping country, Shipping city, Shipping state, Shipping zip, Lead id, Lead email, Lead first name, Lead last name, Lead middle name, Lead phone, Lead city, Lead tags, Lead description, Lead ip, Lead created at, Order sales manager (only on `New Purchase` trigger — last name, first name, login), Lead personal manager (last name, first name, login), Shipping/Name (consignee name), Shipping/Phone (consignee phone).

- **Fields sent on `New Lead`:** Lead id, Lead email, Lead first name, Lead last name, Lead middle name, Lead phone, Lead city, Lead description, Lead ip, Lead created at.

- **Actions (Zapier → InfluencerSoft):**

  *Action: `Add/Update Lead`* — accepts: `Add to List`, `Remove from list`, `Add tag`, `Remove tag`, `Lead email`, `Lead first name`, `Lead last name`, `Lead middle name`, `Lead phone`, `Lead billing address 1`, `Lead billing address 2`, `Lead billing city`, `Lead billing state`, `Lead billing zip`, `Lead billing country code` (ISO country code), `Lead shipping address 1`, `Lead shipping address 2`, `Lead shipping city`, `Lead shipping state`, `Lead shipping zip`, `Lead shipping country code` (ISO), `Lead utc` (timezone), `Lead description`, `Lead personal manager`, `Lead Facebook`, `Lead Instagram` (accepts `@handle` — converted to link), `Lead WhatsApp`, `Lead Telegram` (accepts `@handle`), `Lead Viber`, `Lead Vkontakte`, `Lead points`, plus additional CRM contact fields.

  *Action: `Add Tag to Lead`* — accepts: `Lead tag` (comma-separated supported), `Lead email`.

  *Action: `Remove Tag from Lead`* — accepts: `Lead tag`, `Lead email`.

  *Action: `Add Lead to List`* — accepts: `List`, `Lead email`.

  *Action: `Remove Lead from List`* — accepts: `List`, `Lead email`.

  *Action: `Unsubscribe Lead`* — accepts: `Lead email` (unsubscribes from all groups and sets global status to "Unsubscribed").

- **Notes:** Add/Update Lead changes are recorded in the contact history with the marker "zapier – Add / Update Lead".

---

## Reference: Country Identifiers

Used in `good_only_countries` (AddGood / UpdateGood). Reproduced verbatim from the Countries' Identifiers article. Three-letter codes follow ISO 3166-1 alpha-3 with a few InfluencerSoft-specific additions (`XEN`, `XNI`, `XSC`, `XWA`, `YUG`, `ANT`).

| Code | Country |
|------|---------|
| RUS | Russia |
| UKR | Ukraine |
| AUS | Australia |
| AUT | Austria |
| AZE | Azerbaijan |
| ALB | Albania |
| DZA | Algeria |
| ASM | American Samoa |
| AIA | Anguilla |
| XEN | England |
| AGO | Angola |
| AND | Andorra |
| ATA | Antarctica |
| ATG | Antigua and Barbuda |
| ANT | Antilles |
| ARE | United Arab Emirates |
| ARG | Argentina |
| ARM | Armenia |
| ABW | Aruba |
| AFG | Afghanistan |
| BHS | Bahamas |
| BGD | Bangladesh |
| BRB | Barbados |
| BHR | Bahrain |
| BLR | Belarus |
| BLZ | Belize |
| BEL | Belgium |
| BEN | Benin |
| BMU | Bermuda |
| BGR | Bulgaria |
| BOL | Bolivia |
| BIH | Bosnia and Herzegovina |
| BWA | Botswana |
| BRA | Brazil |
| IOT | British Indian Ocean Territory |
| BRN | Brunei |
| BFA | Burkina Faso |
| BDI | Burundi |
| BTN | Bhutan |
| VUT | Vanuatu |
| VAT | The Vatican |
| GBR | United Kingdom |
| HUN | Hungary |
| VEN | Venezuela |
| VGB | British Virgin Islands (British) |
| VIR | Virgin Islands (US) |
| TLS | East Timor |
| VNM | Vietnam |
| GAB | Gabon |
| GUY | Guyana |
| HTI | Haiti |
| GMB | Gambia |
| GHA | Ghana |
| GLP | Guadeloupe |
| GTM | Guatemala |
| GIN | Guinea |
| GNB | Guinea-Bissau |
| DEU | Germany |
| GIB | Gibraltar |
| HND | Honduras |
| HKG | Hong Kong (China) |
| GRD | Grenada |
| GRL | Greenland |
| GRC | Greece |
| GEO | Georgia |
| GUM | Guam |
| DNK | Denmark |
| COD | Democratic Republic of the Congo |
| DJI | Djibouti |
| DMA | Dominica |
| DOM | Dominican Republic |
| EGY | Egypt |
| ZMB | Zambia |
| ESH | Western Sahara |
| ZWE | Zimbabwe |
| YEM | Yemen |
| ISR | Israel |
| IND | India |
| IDN | Indonesia |
| JOR | Jordan |
| IRQ | Iraq |
| IRN | Iran |
| IRL | Ireland |
| ISL | Iceland |
| ESP | Spain |
| ITA | Italy |
| KAZ | Kazakhstan |
| CYM | Cayman Islands |
| KHM | Cambodia |
| CMR | Cameroon |
| CAN | Canada |
| QAT | Qatar |
| KEN | Kenya |
| CYP | Cyprus |
| KIR | Kiribati |
| CHN | People's Republic of China |
| CCK | Cocos (Keeling) Islands |
| COL | Colombia |
| COM | Comoros |
| COG | Congo |
| PRK | Korean People's Democratic Republic |
| KOR | Korea |
| CRI | Costa Rica |
| CIV | Côte d'Ivoire |
| CUB | Cuba |
| KWT | Kuwait |
| KGZ | Kyrgyzstan |
| LAO | Laos |
| LVA | Latvia |
| LSO | Lesotho |
| LBR | Liberia |
| LBN | Lebanon |
| LBY | Libya |
| LTU | Lithuania |
| LIE | Liechtenstein |
| LUX | Luxembourg |
| MUS | Mauritius |
| MRT | Mauritania |
| MDG | Madagascar |
| MYT | Mayotte |
| MAC | Macau (China) |
| MKD | Macedonia |
| MWI | Malawi |
| MYS | Malaysia |
| MLI | Mali |
| MDV | Maldives |
| MLT | Malta |
| MNP | Marianas |
| MAR | Morocco |
| MTQ | Martinique |
| MHL | Marshall Islands |
| MEX | Mexico |
| FSM | Micronesia |
| MOZ | Mozambique |
| MDA | Moldova |
| MCO | Monaco |
| MNG | Mongolia |
| MSR | Montserrat |
| MMR | Myanmar |
| NAM | Namibia |
| NRU | Nauru |
| NPL | Nepal |
| NER | Niger |
| NGA | Nigeria |
| NLD | Netherlands |
| NIC | Nicaragua |
| NIU | Niue |
| NZL | New Zealand |
| NCL | New Caledonia |
| NOR | Norway |
| OMN | Oman |
| BVT | Bouvet Island |
| NFK | Norfolk Island |
| PCN | the island of Pitcairn |
| CXR | Christmas Island |
| SHN | St. Helena |
| WLF | Wallis and Futuna Islands |
| HMD | Gerda and McDonald Islands |
| CPV | Cape Verde Islands |
| COK | Cook Islands |
| WSM | the islands of Samoa |
| SJM | Svalbard and Jan Mayen Islands |
| TCA | Turks and Caicos Islands |
| UMI | United States Outlying Islands |
| PAK | Pakistan |
| PLW | Palau |
| PSE | Palestine |
| Pan | Panama |
| PNG | Papua New Guinea |
| PRY | Paraguay |
| PER | Peru |
| POL | Poland |
| PRT | Portugal |
| PRI | Puerto Rico |
| REU | Reunion |
| RWA | Rwanda |
| ROU | Romania |
| SLV | Salvador |
| SMR | San Marino |
| STP | Sao Tome and Principe |
| SAU | Saudi Arabia |
| SWZ | Swaziland |
| XNI | Northern Ireland |
| SYC | Seychelles |
| SEN | Senegal |
| SPM | Saint-Pierre and Miquelon |
| VCT | Saint Vincent and the Grenadines |
| KNA | St. Kitts and Nevis |
| LCA | Saint Lucia |
| SGP | Singapore |
| SYR | Syria |
| SVK | Slovakia |
| SVN | Slovenia |
| USA | United States of America |
| SLB | Solomon Islands |
| SOM | Somalia |
| SDN | Sudan |
| SUR | Suriname |
| SLE | Sierra Leone |
| TJK | Tajikistan |
| TWN | Taiwan (Republic of China) |
| THA | Thailand |
| TZA | Tanzania |
| TGO | Togo |
| TKL | Tokelau |
| TON | Tonga |
| TTO | Trinidad and Tobago |
| TUV | Tuvalu |
| TUN | Tunisia |
| TKM | Turkmenistan |
| TUR | Turkey |
| UGA | Uganda |
| UZB | Uzbekistan |
| URY | Uruguay |
| XWA | Wales |
| FRO | Faroe Islands |
| FJI | Fiji |
| PHL | Philippines |
| FIN | Finland |
| FLK | Falkland Islands (Malvinas) |
| FRA | France |
| GUF | French Guiana |
| PYF | French Polynesia |
| ATF | French Southern Territories |
| HRV | Croatia |
| CAF | Central African Republic |
| TCD | Chad |
| CZE | Czech Republic |
| CHL | Chile |
| CHE | Switzerland |
| SWE | Sweden |
| XSC | Scotland |
| LKA | Sri Lanka |
| ECU | Ecuador |
| GNQ | Equatorial Guinea |
| ERI | Eritrea |
| EST | Estonia |
| ETH | Ethiopia |
| ZAF | South Africa |
| YUG | Yugoslavia |
| SGS | South Georgia and the South Sandwich Islands |
| JAM | Jamaica |
| JPN | (Japan — country name truncated in source) |

Source note: The country code for `JPN` appears in the source list without a country name printed; it is reproduced here with the conventional value in parentheses.

## Reference: Order statuses

For `UpdateOrderStatus.status`:

| Value | Meaning |
|-------|---------|
| `sent` | Order was sent by mail (requires `date`, `rpo`). |
| `paid` | Payment for the order was made (requires `date`). |
| `return` | Customer returned the order. |
| `cancel` | Order was cancelled. |

For `GetBills.pay_status`:

| Value | Meaning |
|-------|---------|
| `paid` | Paid. |
| `waiting` | Expected. |
| `cancel` | Cancelled. |

`pay_status` values returned in `GetOrders` / `GetOrderInfo` / `getOrderDetails` / `getOrdersWithGoods` responses are not enumerated in source.

## Reference: Subscription statuses

For `GetLeadGroupStatuses.rass_status`: `STATUS_WAIT`, `STATUS_SUBSCRIBE`, `STATUS_UNSUBSCRIBE`, `STATUS_UNSUBSCRIBE_BY_SERVICE`, `STATUS_INVALID_EMAIL` — see the GetLeadGroupStatuses endpoint section for descriptions.

## Reference: Product types (`good_type`)

Documented values:

| Value | Meaning | Source |
|-------|---------|--------|
| `0` | Digital | AddGood parameter doc |
| `1` | Physical | AddGood parameter doc |
| (blank) | Floating price | GetAllGoods example output + source enumeration |
| `digital` | Digital (string form) | AddGood PHP example |
| `real` | Physical (string form) | AddGood PHP example |

The numeric form (`0`/`1`) is what the parameter doc specifies; the string forms appear only in the PHP example.

## Reference: Product email format (`good_mail_format`)

| Value | Meaning |
|-------|---------|
| `html` | Use `good_mail_body`. |
| `text` | Use `good_mail_text`. |

## Reference: Product timer unit (`good_timer_unit`)

| Value | Meaning |
|-------|---------|
| `min` | Minutes. |
| `hour` | Hours. |
| `day` | Days. |

## Reference: Product delivery service (`good_post_service`)

| Value | Meaning |
|-------|---------|
| `none` | Deliver yourself. |
| `quickpost` | QuickPost service. |

## Reference: Payment-page HTML substitution tags (`good_pay_text`)

| Tag | Substitutes |
|-----|-------------|
| `# IMAGE #` | Product image. |
| `# PRODUCT #` | Product name. |
| `# PRICE #` | Price. |
| `# USD #` | Currency. |

## Common tasks

### How do I add a contact and put them on multiple lists via API?
Call `AddLeadToGroup` once with `rid[0]`, `rid[1]`, … set to each group identifier, `lead_email` set to the contact, and `activation=true` if you need the contact to confirm.

### How do I create a paying customer end-to-end?
1. (Once) Create the product with `AddGood`. Capture `good_name`.
2. Create the order with `CreateOrder`, passing `goods=[{good_name, good_sum?}, …]` plus required customer fields. Note `result->bill_id`.
3. Redirect the customer to `result->link` (from `CreateOrder` or by subsequently calling `getOrderDetails`).
4. Configure `URL for API notifications about the paid invoice` on the product to receive the paying-off notification (see Inbound: Paid / Prepayment / Moneyback).
5. After delivery, call `UpdateOrderStatus` with `status=sent`, `date=<unixtime>`, `rpo=<tracking>`.

### How do I look up everything a customer has bought?
Call `GetBills` with `email=<customer email>`. Optionally narrow with `pay_status=paid`.

### How do I unsubscribe someone everywhere?
Either: (a) configure the Zapier `Unsubscribe Lead` action; or (b) call `GetLeadGroupStatuses` to find every group the contact is in, then call `DeleteSubscribe` per group.

### How do I migrate from the deprecated endpoints?
- Replace `GetLeadGroups` calls with `GetLeadGroupStatuses` (same `email` parameter; richer response).
- Replace `GetOrderInfo` calls with `getOrderDetails` (same `bill_id` parameter; optional `good_info` flag).
- Replace `GetOrders` calls with `getOrdersWithGoods` (date format changes from unixtime to `DD.MM.YYYY`).

### How do I get the partner-ID and ad-tag-ID from an affiliate landing?
The affiliate link `http://shop.YOUR_SHOP.com/aff/sl/PRODUCT/PARTNER/` forwards the buyer to your custom purchase page with `?influencersoft_partner_id=…&influencersoft_ad_id=…`. Read those query parameters server-side and pass them through to `CreateOrder` via the `utm[…]` block (use `utm[utm_medium]=affiliate` and `utm[utm_source]=<partner login>`, plus `utm[aff_…]` marks if the partner is enrolled in the affiliate program).

## Cross-references

- **Contacts UI ↔ AddLeadToGroup / UpdateSubscriberData / DeleteSubscribe / GetLeadGroupStatuses / GetAllGroups / GetCountSubscribe** — same underlying contact and group records that are administered in the Contacts UI section of the personal cabinet.
- **Shop / Products UI ↔ AddGood / UpdateGood / DeleteGood / GetAllGoods** — products and their settings configured under "Shop" in the UI are the same objects.
- **Shop / Orders UI ↔ CreateOrder / UpdateOrderStatus / DeleteOrder / GetOrders / getOrdersWithGoods / GetOrderInfo / getOrderDetails / GetBills** — invoice records visible in the orders UI.
- **Partner cabinet UI ↔ GetPartnerStats** — same partner statistics surfaced in the partner's cabinet.
- **Shop ⇒ Settings ⇒ Domains** — UI source for the linked custom domain that can replace `username.influencersoft.com` in API URLs.
- **Site ⇒ Settings ⇒ "CanadaPostService and API"** — UI source for the "Secret key for signing" (`user_rps_key`).
- **"API" section in personal cabinet** — also called "Integration and API" in the footer; surfaces the API key, notification URL configuration, and Zapier connection settings.

## Source articles

In original section order:

- [AddGood. Creating a New Product](https://help.influencersoft.com/hc/en-us/articles/360050671852-AddGood-Creating-a-New-Product)
- [API Response Statuses, Codes, and Descriptions](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions)
- [API: Adding a Contact to a Group](https://help.influencersoft.com/hc/en-us/articles/360050435412-API-Adding-a-Contact-to-a-Group)
- [API: Getting the Number of Store's/Group's Contacts](https://help.influencersoft.com/hc/en-us/articles/360050903411-API-Getting-the-Number-of-Store-s-Group-s-Contacts)
- [Countries' Identifiers](https://help.influencersoft.com/hc/en-us/articles/360050867391-Countries-Identifiers)
- [CreateOrder. Creating a New Invoice](https://help.influencersoft.com/hc/en-us/articles/360050502452-CreateOrder-Creating-a-New-Invoice)
- [Creating and Canceling the Invoice Script Notification](https://help.influencersoft.com/hc/en-us/articles/360051022491-Creating-and-Canceling-the-Invoice-Script-Notification)
- [DeleteGood. Deleting a Product](https://help.influencersoft.com/hc/en-us/articles/360050672152-DeleteGood-Deleting-a-Product)
- [DeleteOrder. Deleting/Hiding an Invoice](https://help.influencersoft.com/hc/en-us/articles/360050556792-DeleteOrder-Deleting-Hiding-an-Invoice)
- [DeleteSubscribe. Unsubscribe a Contact from a Group](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group)
- [Enabling API to Get Started](https://help.influencersoft.com/hc/en-us/articles/360050867731-Enabling-API-to-Get-Started)
- [General Principles of Working with API](https://help.influencersoft.com/hc/en-us/articles/360050868031-General-Principles-of-Working-with-API)
- [GetAllGoods. Getting a List of All Products](https://help.influencersoft.com/hc/en-us/articles/360051157731-GetAllGoods-Getting-a-List-of-All-Products)
- [GetAllGroups. Receiving a List of All Contact Groups from the Account](https://help.influencersoft.com/hc/en-us/articles/360050436312-GetAllGroups-Receiving-a-List-of-All-Contact-Groups-from-the-Account)
- [GetBills. Receiving a List of Invoices and Its Data by Customer's Email](https://help.influencersoft.com/hc/en-us/articles/360050557192-GetBills-Receiving-a-List-of-Invoices-and-Its-Data-by-Customer-s-Email)
- [GetLeadGroups. Receiving a List of All Contact Groups](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups)
- [GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status)
- [GetOrderDetails. Getting Detailed Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050558052-GetOrderDetails-Getting-Detailed-Invoice-Information)
- [GetOrderInfo. Getting Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050664772-GetOrderInfo-Getting-Invoice-Information)
- [GetOrders. Getting a List of All Invoices](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices)
- [GetOrdersWithGoods. Getting a Maximally Detailed List of All Accounts](https://help.influencersoft.com/hc/en-us/articles/360051149651-GetOrdersWithGoods-Getting-a-Maximally-Detailed-List-of-All-Accounts)
- [GetPartnerStats. Get Partner's Statistics](https://help.influencersoft.com/hc/en-us/articles/360050671232-GetPartnerStats-Get-Partner-s-Statistics)
- [Integration with Zapier.com](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com)
- [PostBack Notifications](https://help.influencersoft.com/hc/en-us/articles/360050672292-PostBack-Notifications)
- [Script Notification for Prepayment of the Invoice, for Its Paying Off, and for Refund (Moneyback)](https://help.influencersoft.com/hc/en-us/articles/360050665012-Script-Notification-for-Prepayment-of-the-Invoice-for-Its-Paying-Off-and-for-Refund-Moneyback)
- [The Script Notification When Subscribing for Your Newsletters](https://help.influencersoft.com/hc/en-us/articles/360050437792-The-Script-Notification-When-Subscribing-for-Your-Newsletters)
- [The Script Notification When Unsubscribing from Your Newsletters](https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters)
- [UpdateGood. Changing the Settings of the Existing Product](https://help.influencersoft.com/hc/en-us/articles/360050672212-UpdateGood-Changing-the-Settings-of-the-Existing-Product)
- [UpdateOrderStatus. Changing Invoice Status](https://help.influencersoft.com/hc/en-us/articles/360050670752-UpdateOrderStatus-Changing-Invoice-Status)
- [UpdateSubscriberData. Editing the Existing Contact's Data](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data)



---


# API 2.0

## Overview

API 2.0 is InfluencerSoft's newer programmatic interface for creating contacts, creating orders, managing tags and group memberships, and reading reference data (groups, products, coupons, additional users). Per the "What if I'm not a programmer? (API 2.0)" article, API 2.0 offers more features than API 1.0 — for example, support for additional contact fields and social-media-profile parameters — and is intended to be set up without (or with minimal) programmer involvement, often via the in-account "POST / GET request" block inside Funnels.

Every endpoint in this section follows the same conventions:

- **Base URL pattern:** `https://username.influencersoft.com/api/{method}` — `username` is the account owner's login and 3rd-level domain in InfluencerSoft.
- **HTTP method:** `POST` (every API 2.0 article in the source explicitly states "The request is sent by the POST method"). The non-programmer article notes "sometimes GET" generically but no API 2.0 endpoint documents a GET form.
- **Request format:** `application/x-www-form-urlencoded` (URLencode). Stated explicitly in every article and shown in every PHP cURL example via `Content-Type: application/x-www-form-urlencoded`.
- **Response format:** JSON. Standard envelope: `{"error_code":0,"error_text":"OK","result":[],"hash":"..."}`.

## Authentication

All endpoints require a single authentication parameter:

- **Parameter name:** `rpsKey` (case-sensitive — the "What if I'm not a programmer?" article emphasises "case as in the example").
- **Value:** the account's API key.
- **Where to find it:** in the "Integration and API" section. Linked from the footer of the personal account, or directly at `username.influencersoft.com/shops/setts/apisettings/`.

Note: source article prose sometimes refers to the required parameter as `rps_key` (in the "the required parameter is 'rps_key'" sentence), but every actual parameter list, code sample, and the non-programmer reference article uses `rpsKey`. Use `rpsKey`.

Rate limits: not specified in source.

## Conventions

- **Base URL:** `https://username.influencersoft.com/api/{method}` where `{method}` is one of: `addtagtolead`, `addupdatelead`, `getpersonalmanagers`, `getcoupons`, `getalllists`, `getgoods`, `createorder`, `removeleadfromlist`, `removetagfromlead`.
- **HTTP method:** `POST` for all documented endpoints.
- **Content-Type:** `application/x-www-form-urlencoded`.
- **Response format:** JSON. Top-level fields:
  - `error_code` — integer status code (`0` = OK).
  - `error_text` — human-readable status ("OK" on success).
  - `result` — array of objects (read endpoints) or empty array (write endpoints).
  - `hash` — opaque string returned with every response.
- **Common parameters on every request:** `rpsKey`.
- **Pagination model:** not specified in source.
- **Date / timezone format:** Order endpoint accepts dates in either `30.01.2020 04:22:16` / `01/30/2020 04:22:16` or `2019-07-30 04:22:16` form. Contact timezone (`lead_utc`) accepts formats `UTC + 03`, `+03`, `-01`, `3`, `-1`.
- **Identifier conventions:**
  - Group ID (used in `add_to_lists`, `remove_from_lists`): dotted form like `1473249885.2899961004`. Found in group editing => API tab, or via `getalllists` (field `rass_name`).
  - Product ID (`product_names`): taken from the order page link. Also returned by `getgoods` (field `id` or `good_name`).
  - Coupon ID (`coupon`): from the address bar when editing a coupon. Also returned by `getcoupons` (field `id`).
  - Manager/personal-manager ID (`lead_personal_manager`, `order_sales_manager`): from the employee edit link `/shops/access/`. Also returned by `getpersonalmanagers` (field `id` / `manager_id`).
  - Country codes: ISO 3166 country codes (e.g. `US`, `CA`). InfluencerSoft automatically replaces them with the full country name in the contact card.

## Response statuses and error codes

The full status code table lives in the API 1.0 article "API Response Statuses, Codes, and Descriptions" (article ID 360050392312), referenced from every API 2.0 article via the line "In case of an error, the standard 'Service API Responses' will be returned." See the API 1.0 chapter for that table.

Codes surfaced directly inside API 2.0 articles:

| Code | Meaning            | When it happens                                         |
|------|--------------------|---------------------------------------------------------|
| 0    | OK (`error_text: "OK"`) | Successful request. Returned with `result` populated (read endpoints) or empty `result: []` (write endpoints). |

Any non-zero codes — not specified in this section's source articles; consult the dedicated Service API Responses article in API 1.0.

## Endpoints

Grouped by resource. Read endpoints (`get*`) take only `rpsKey`. Write endpoints accept additional parameters.

### Group: Contacts

#### `POST` addupdatelead — Create or edit a contact

- **Source article:** [Create or edit a contact – addupdatelead](https://help.influencersoft.com/hc/en-us/articles/360057803232-Create-or-edit-a-contact-addupdatelead)
- **URL pattern:** `https://username.influencersoft.com/api/addupdatelead` (article also shows the variant casing `https://username.InfluencerSoft.com/api/addupdatelead` — domain is case-insensitive in practice)
- **HTTP method:** POST
- **Purpose:** Create a new contact, or update an existing one matched by email. Also supports adding/removing the contact to/from groups and tags in the same call.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key from Integration and API section. | — |
  | `add_to_lists` | body | string | No | Group ID(s) to add the contact to, separated by commas. Group ID format example: `1473249885.2899961004`. Source: group editing => API tab. | — |
  | `remove_from_lists` | body | string | No | Group ID(s) to remove the contact from, separated by commas. Same format as above. | — |
  | `add_tags` | body | string | No | Tags to add to the contact, separated by commas. | — |
  | `remove_tags` | body | string | No | Tags to remove from the contact, separated by commas. | — |
  | `lead_email` | body | string | No | Contact email. "If not specified, it will be created without email." | — |
  | `lead_first_name` | body | string | No | Contact first name. | — |
  | `lead_middle_name` | body | string | No | Contact middle name. | — |
  | `lead_last_name` | body | string | No | Contact surname. | — |
  | `lead_phone` | body | string | No | Contact phone number. | — |
  | `lead_utc` | body | string | No | Contact time zone. Allowed forms: `UTC + 03`, `+03`, `-01`, `3`, `-1`. | — |
  | `lead_description` | body | string | No | Information about the customer, visible in the contact card. | — |
  | `lead_personal_manager` | body | string | No | ID of the personal manager for the contact. Source: employee edit link `/shops/access/`. | — |
  | `lead_shipping_address_1` | body | string | No | Delivery address, visible in the contact card. | — |
  | `lead_shipping_address_2` | body | string | No | Delivery address supplemental field for complex addresses; concatenated to previous with a comma. | — |
  | `lead_shipping_city` | body | string | No | Shipping city; concatenated with comma. | — |
  | `lead_shipping_zip` | body | string | No | Shipping zip / index; concatenated with comma. | — |
  | `lead_shipping_country_code` | body | string | No | ISO country code (e.g. `US`, `CA`). Auto-replaced with full country name in contact card. | — |
  | `lead_shipping_state` | body | string | No | Shipping region / state; concatenated with comma. | — |
  | `lead_billing_address_1` | body | string | No | Billing address (recommended for index); concatenated with comma. | — |
  | `lead_billing_address_2` | body | string | No | Billing address supplemental field; concatenated with comma. | — |
  | `lead_billing_city` | body | string | No | Billing city; concatenated with comma. | — |
  | `lead_billing_state` | body | string | No | Billing region / state; concatenated with comma. | — |
  | `lead_billing_zip` | body | string | No | Billing zip; concatenated with comma. | — |
  | `lead_billing_country_code` | body | string | No | ISO country code for billing. Auto-replaced with full name. | — |
  | `lead_facebook` | body | string | No | Facebook contact id. | — |
  | `lead_instagram` | body | string | No | Instagram contact id. | — |
  | `lead_whatsapp` | body | string | No | WhatsApp contact id. | — |
  | `lead_telegram` | body | string | No | Telegram contact id. | — |
  | `lead_viber` | body | string | No | Viber contact id. | — |
  | `lead_vkontakte` | body | string | No | VKontakte contact id. | — |
  | `lead_in` | body | string | No | LinkedIn contact id. | — |

- **Request example (PHP cURL, from source):**

  ```php
  <?php
    $curl = curl_init(); curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://username.influencerSoft.com/api/addupdatelead',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array('rpsKey' => ' Your API key','lead_email'
   => 'test@influencersoft.com','add_to_lists' => '1594725950.5982672784,
  1605870811.1867176380','remove_from_lists' => '1534723950.5982672783',
  'add_tags' => 'tag2020'),
  ));

  $response = curl_exec($curl);
  curl_close($curl);
  echo $response;
  ?>
  ```

- **Response:**

  ```json
  {"error_code":0,"error_text":"OK","result":[],"hash":"******************************"}
  ```

  - `error_code` — `0` on success.
  - `error_text` — `"OK"` on success.
  - `result` — empty array on success.
  - `hash` — opaque response hash.

- **Error responses:** see global "API Response Statuses, Codes, and Descriptions" (in API 1.0 chapter). Not specified per-endpoint in source.
- **Notes:** Source states: "In the near future, this method will also be able to work with additional fields that you can create in CRM."

#### `POST` addtagtolead — Add tags to a contact

- **Source article:** [Adding tags to a contact – addtagtolead](https://help.influencersoft.com/hc/en-us/articles/360058445991-Adding-tags-to-a-contact-addtagtolead)
- **URL pattern:** `https://username.influencersoft.com/api/addtagtolead`
- **HTTP method:** POST
- **Purpose:** Add one or more tags to an existing contact, identified by email.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |
  | `add_tags` | body | string | No (per article required-list, only `rpsKey` is required; in practice required to do anything) | Tags to add, comma-separated. | — |
  | `lead_email` | body | string | No (same caveat) | Contact email identifying the contact. | — |

- **Request example (PHP cURL, from source):**

  ```php
  <?php
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://username.influencersoft.com/api/addtagtolead',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => 'rpsKey={API key}&lead_email={lead email}&add_tags={tags}',
    CURLOPT_HTTPHEADER => array(
      'Content-Type: application/x-www-form-urlencoded'
    ),
  ));
  $response = curl_exec($curl);
  curl_close($curl);
  echo $response;
  ?>
  ```

- **Response:**

  ```json
  {"error_code":0,"error_text":"OK","result":[],"hash":"******************************"}
  ```

- **Error responses:** see global table.
- **Notes:** None beyond global conventions.

#### `POST` removetagfromlead — Remove tags from a contact

- **Source article:** [Removing tags from a contact – removetagfromlead](https://help.influencersoft.com/hc/en-us/articles/360057986352-Removing-tags-from-a-contact-removetagfromlead)
- **URL pattern:** `https://username.influencersoft.com/api/removetagfromlead`
- **HTTP method:** POST
- **Purpose:** Remove one or more tags from an existing contact, identified by email.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |
  | `remove_tags` | body | string | No (only `rpsKey` is marked required, but needed to act) | Tags to remove, comma-separated. | — |
  | `lead_email` | body | string | No (same caveat) | Contact email. | — |

- **Request example (PHP cURL, from source — note: the source example mistakenly uses `add_tags` in the POSTFIELDS string instead of `remove_tags`):**

  ```php
  <?php
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://username.influencersoft.com/api/removetagfromlead',
  //don't forgot to change username
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => 'rpsKey={your API key}&lead_email={lead email}&add_tags=
  {some tags}',
    CURLOPT_HTTPHEADER => array(
      'Content-Type: application/x-www-form-urlencoded'
    ),
  ));
  $response = curl_exec($curl);
  curl_close($curl);
  echo $response;
  ?>
  ```

- **Response:**

  ```json
  {"error_code":0,"error_text":"OK","result":[],"hash":"******************************"}
  ```

- **Error responses:** see global table.
- **Notes:** Source PHP example uses `add_tags` in the form body — likely a typo in the source. The documented parameter is `remove_tags`.

#### `POST` removeleadfromlist — Remove a contact from a group

- **Source article:** [Removing a contact from a group – removeleadfromlist](https://help.influencersoft.com/hc/en-us/articles/360058445811-Removing-a-contact-from-a-group-removeleadfromlist)
- **URL pattern:** `https://username.influencersoft.com/api/removeleadfromlist`
- **HTTP method:** POST
- **Purpose:** Remove an existing contact (by email) from one or more groups (subscription lists).
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |
  | `remove_from_lists` | body | string | No (only `rpsKey` is marked required) | Group ID(s), comma-separated. Format example: `1473249885.2899961004`. Source: group editing => API tab. | — |
  | `lead_email` | body | string | No (same caveat) | Contact email. | — |

- **Request example (PHP cURL, from source):**

  ```php
  <?php
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://username.influencersoft.com/api/removeleadfromlist',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => 'rpsKey=&lead_email=&remove_from_lists=',
    CURLOPT_HTTPHEADER => array(
      'Content-Type: application/x-www-form-urlencoded'
    ),
  ));
  $response = curl_exec($curl);
  curl_close($curl);
  echo $response;
  ```

- **Response:**

  ```json
  {"error_code":0,"error_text":"OK","result":[],"hash":"******************************"}
  ```

- **Error responses:** see global table.
- **Notes:** There is no separate `addleadtolist` endpoint in API 2.0; use `addupdatelead` with `add_to_lists` to add a contact to a group.

### Group: Orders

#### `POST` createorder — Create an order (invoice)

- **Source article:** [Order creation – createorder](https://help.influencersoft.com/hc/en-us/articles/360058446591-Order-creation-createorder)
- **URL pattern:** `https://username.influencersoft.com/api/createorder`
- **HTTP method:** POST
- **Purpose:** Create an order/invoice for a contact, with one or more products, optional shipping/billing addresses, status, dates, coupon, payment method, affiliates, and UTM tags.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |
  | `product_names` | body | string | Yes | Product IDs included in the invoice, comma-separated. Source: link from the order page link, or `getgoods`. | — |
  | `customer_email` | body | string | No | Email of the contact to be invoiced. | — |
  | `customer_first_name` | body | string | No | Contact first name. | — |
  | `customer_last_name` | body | string | No | Contact surname. | — |
  | `customer_middle_name` | body | string | No | Contact middle name. | — |
  | `customer_phone` | body | string | No | Contact phone number. | — |
  | `order_ip` | body | string | No | Account / contact IP address. | — |
  | `customer_shipping` | body | string | No | Shipping address (primary). Note: parameter spelled `customer_shipping-` in source bullet (likely typo for `customer_shipping_address_1` or the literal `customer_shipping`). | — |
  | `customer_shipping_phone` | body | string | No | Customer shipping phone. | — |
  | `customer_shipping_address_2` | body | string | No | Shipping address supplemental field. | — |
  | `customer_shipping_city` | body | string | No | Shipping city. | — |
  | `customer_shipping_state` | body | string | No | Shipping region / state. | — |
  | `customer_shipping_zip` | body | string | No | Shipping zip. | — |
  | `customer_shipping_country_code` | body | string | No | ISO country code (e.g. `US`, `CA`). | — |
  | `customer_billing_address_1` | body | string | No | Billing address line 1. | — |
  | `customer_billing_address_2` | body | string | No | Billing address line 2. | — |
  | `customer_billing_city` | body | string | No | Billing city. | — |
  | `customer_billing_state` | body | string | No | Billing region / state. | — |
  | `customer_billing_zip` | body | string | No | Billing zip. | — |
  | `customer_billing_country_code` | body | string | No | ISO country code; auto-replaced with country name. | — |
  | `order_tag` | body | string | No | Order tag (single value; distinct from contact tags). | — |
  | `note` | body | string | No | Note attached to the account, visible in the account card. | — |
  | `order_created_at` | body | string | No | Invoice creation date and time. Accepted forms: `30.01.2020 04:22:16` or `2019-07-30 04:22:16`. | — |
  | `order_paid_at` | body | string | No | Order payment date and time. Accepted forms: `01/30/2020 04:22:16` or `2019-07-30 04:22:16`. | — |
  | `order_status` | body | string | No | One of: `Expected`, `Paid`, `Cancel`, `MoneyBack`. | — |
  | `order_confirmed` | body | string | No | Whether the order is confirmed. One of: `Yes`, `No`, `True`, `False`, `Сonfirmed` (note: source literally uses the Cyrillic `С` U+0421 at the start of "Сonfirmed"). | — |
  | `order_sales_manager` | body | string | No | ID of the personal manager. Source: employee edit link `/shops/access/` or `getpersonalmanagers`. | — |
  | `product_prices` | body | string | No | Comma-separated prices, in order matching `product_names`. If fewer prices than products are given, remaining products use their configured price. If omitted entirely, prices come from product settings. | from product settings |
  | `payment_method` | body | string | No | One of: `PayPal`, `Stripe`. | — |
  | `coupon` | body | string | No | Discount coupon ID (from URL when editing a coupon, or `getcoupons`). | — |
  | `affiliates` | body | string | No | Partner logins, comma-separated. First partner = level-1 partner, second = level-2, etc. | — |
  | `utm_medium` | body | string | No | UTM label. | — |
  | `utm_source` | body | string | No | UTM label. | — |
  | `utm_campaign` | body | string | No | UTM label. | — |
  | `utm_content` | body | string | No | UTM label. | — |
  | `utm_term` | body | string | No | UTM label. | — |

- **Request example (PHP cURL, from source — `POSTFIELDS` string lists all parameter names as a template):**

  ```php
  <?php
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://username.influencersoft.com/api/createorder',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => 'rpsKey=>customer_email=>customer_first_name=>
  customer_last_name=>customer_middle_name=>customer_phone=>order_ip=>
  customer_shipping=>customer_shipping_phone=>customer_shipping_address_2=>
  customer_shipping_city=>customer_shipping_state=>customer_shipping_zip=>
  customer_shipping_country_code=>customer_billing_address_1=>
  customer_shipping_city=>customer_shipping_state=>customer_shipping_zip=>
  customer_billing_address_1=>customer_billing_address_2=>customer_billing_city=>
  customer_billing_state=>customer_billing_zip=>customer_billing_country_code=>
  order_tag=>note=>order_created_at=>order_paid_at=>order_status=>order_confirmed=>
  order_sales_manager=>product_prices=>payment_method=>coupon=>affiliates=>utm_medium=>
  utm_source=>utm_campaign=>utm_content=>utm_term=',
    CURLOPT_HTTPHEADER => array(
      'Content-Type: application/x-www-form-urlencoded'
    ),
  ));
  $response = curl_exec($curl);
  curl_close($curl);
  ```

  Note: the source `POSTFIELDS` uses `=>` between names which is form-encoding-invalid (correct form uses `=value&` between key/value pairs). Treat the source string as a parameter-name reference, not a literal payload. A corrected/reconstructed form-encoded body looks like:

  ```
  // reconstructed from source
  rpsKey={key}&customer_email=user@example.com&product_names=75696&order_status=Paid&payment_method=Stripe
  ```

- **Response:**

  ```json
  {"error_code":0,"error_text":"OK","result":[],"hash":"******************************"}
  ```

- **Error responses:** see global table.
- **Notes:**
  - `product_names` is the required parameter besides `rpsKey`.
  - Source: "In the near future, this method will also be able to work with additional fields that you can create in CRM."
  - `order_confirmed` has six accepted strings; one (`Сonfirmed`) contains a Cyrillic capital letter in the source — likely a typo for ASCII `Confirmed`.

### Group: Reference lookups (read-only)

All four read endpoints take a single parameter, `rpsKey`, and return a `result` array. Use them to discover IDs needed by the write endpoints.

#### `POST` getpersonalmanagers — List additional users (personal managers)

- **Source article:** [Get a list of additional users – getpersonalmanagers](https://help.influencersoft.com/hc/en-us/articles/360058446851-Get-a-list-of-additional-users-getpersonalmanagers)
- **URL pattern:** `https://username.influencersoft.com/api/getpersonalmanagers`
- **HTTP method:** POST
- **Purpose:** Return all additional users in the account. Useful for assigning `lead_personal_manager` (on `addupdatelead`) or `order_sales_manager` (on `createorder`).
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |

- **Response:**

  ```json
  {
      "error_code": 0,
      "error_text": "OK",
      "result": [
          {
              "id": 71257,
              "manager_id": 71257,
              "manager_name": "Greg"
          },
          {
              "id": 72398,
              "manager_id": 72398,
              "manager_name": "001"
          },
          {
              "id": 71668,
              "manager_id": 71668,
              "manager_name": "Quickpost"
          }
      ],
      "hash": "019a22abe9556aae827d223ff3be2442"
  }
  ```

  - `id` — ID of the additional user.
  - `manager_id` — matches `id`.
  - `manager_name` — name and surname of the employee.

- **Error responses:** see global table.
- **Notes:** Use the returned `id` as the value of `lead_personal_manager` or `order_sales_manager`.

#### `POST` getalllists — List groups (subscription lists)

- **Source article:** [Getting a list of groups (subscriptions) – getalllists](https://help.influencersoft.com/hc/en-us/articles/360057987072-Getting-a-list-of-groups-subscriptions-getalllists)
- **URL pattern:** `https://username.influencersoft.com/api/getalllists`
- **HTTP method:** POST
- **Purpose:** Return all subscription groups. Use to discover group IDs for `add_to_lists` / `remove_from_lists`.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |

- **Response:**

  ```json
  {
      "error_code": 0,
      "error_text": "OK",
      "result": [
          {
              "id": 2086840,
              "rass_id": 2086840,
              "rass_name": "1605189997.0025174394",
              "rass_title": "#27950"
          },
          {
              "id": 2086838,
              "rass_id": 2086838,
              "rass_name": "1605188141.0707471155",
              "rass_title": "#27952"
          },
          {
              "id": 2086839,
              "rass_id": 2086839,
              "rass_name": "1605188160.9622104559",
              "rass_title": "#27957"
          }
      ],
      "hash": "019a22abe9024aae827d223ff3be2442"
  }
  ```

  - `id` — group ID, matches what is shown in the address bar when editing a group.
  - `rass_id` — matches `id`.
  - `rass_name` — API ID of the group; **this is the value used in other API methods** (e.g. as a comma-separated value in `add_to_lists` / `remove_from_lists`).
  - `rass_title` — display name of the group in the personal account.

- **Error responses:** see global table.
- **Notes:** Use `rass_name` (dotted form like `1605189997.0025174394`) when passing group IDs to other endpoints — not the numeric `id`.

#### `POST` getgoods — List products

- **Source article:** [Getting a list of products – getgoods](https://help.influencersoft.com/hc/en-us/articles/360057987312-Getting-a-list-of-products-getgoods)
- **URL pattern:** `https://username.influencersoft.com/api/getgoods`
- **HTTP method:** POST
- **Purpose:** Return all products in the account. Use to discover product IDs for `createorder`'s `product_names`.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |

- **Response:**

  ```json
  {
  "error_code": 0,
  "error_text": "OK",
  "result": [
  {
  "id": 75696,
  "good_name": "digital",
  "good_title": "Digital product"
  },
  {
  "id": 75791,
  "good_name": "testdrive",
  "good_title": "testdrive"
  }
  ],
  "hash": "019a22abe9024aae827d223ff3be2442"
  }
  ```

  - `id` — product ID, shown in the address bar when editing a product.
  - `good_name` — what appears in the address bar on the invoice (order) page.
  - `good_title` — commercial name shown to the buyer.

- **Error responses:** see global table.
- **Notes:** The source does not state which of `id` / `good_name` should be passed to `createorder`'s `product_names`. The `createorder` article says "id of products … taken from the link from the link to the order page" — `good_name` is described as "what we see in the address bar on the invoice page (order page)", suggesting `good_name` is the value used in `product_names`. Not fully specified in source.

#### `POST` getcoupons — List coupons (discounts)

- **Source article:** [Getting a list of all coupons (discounts) – getcoupons](https://help.influencersoft.com/hc/en-us/articles/360058447251-Getting-a-list-of-all-coupons-discounts-getcoupons)
- **URL pattern:** `https://username.influencersoft.com/api/getcoupons`
- **HTTP method:** POST
- **Purpose:** Return all coupons (discounts) in the account. Use to discover coupon IDs for `createorder`'s `coupon`.
- **Parameters:**

  | Name | In | Type | Required | Description / Allowed values | Default |
  |------|----|------|----------|------------------------------|---------|
  | `rpsKey` | body | string | Yes | API key. | — |

- **Response:**

  ```json
  {
  "error_code": 0,
  "error_text": "OK",
  "result": [
  {
  "id": 585,
  "coupon": "coupon50proc"
  },
  {
  "id": 586,
  "coupon": "coupon90proc"
  }
  ],
  "hash": "019a22abe9024aae827d223ff3be2442"
  }
  ```

  - `id` — discount coupon ID (visible in the address bar when editing a coupon).
  - `coupon` — the coupon code the buyer enters to redeem.

- **Error responses:** see global table.
- **Notes:** The `createorder` article describes the `coupon` parameter as "discount coupon id (from the address bar when editing a coupon in your personal account; you can also get the getcoupons method)" — so pass the numeric `id` value, not the human-readable `coupon` code.

## Reference: order_status values

| Value       | Meaning (from source)                       |
|-------------|---------------------------------------------|
| `Expected`  | Order awaiting payment.                     |
| `Paid`      | Paid order.                                 |
| `Cancel`    | Cancelled order.                            |
| `MoneyBack` | Refunded order.                             |

## Reference: order_confirmed values

| Value         | Meaning                                    |
|---------------|--------------------------------------------|
| `Yes`         | Confirmed.                                 |
| `No`          | Not confirmed.                             |
| `True`        | Confirmed.                                 |
| `False`       | Not confirmed.                             |
| `Сonfirmed`   | Confirmed (source uses Cyrillic `С` — likely typo for ASCII `Confirmed`). |

## Reference: payment_method values

| Value    | Description    |
|----------|----------------|
| `PayPal` | PayPal.        |
| `Stripe` | Stripe.        |

(Only those two are listed in the source for `createorder`.)

## Reference: lead_utc formats

The `lead_utc` parameter accepts:

- `UTC + 03`
- `+03`
- `-01`
- `3`
- `-1`

## Reference: country codes

ISO 3166 country codes (e.g. `US`, `CA`). The full code list is not in the source article; the article links to `https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes` for reference. InfluencerSoft automatically expands the code to the full country name in the contact card.

## Common tasks

### How do I add a contact and put them in a group with a tag?

Single call to `addupdatelead`:

1. Call `getalllists` to obtain the target group's `rass_name`.
2. `POST` `https://username.influencersoft.com/api/addupdatelead` with `rpsKey`, `lead_email`, `lead_first_name`, `add_to_lists={rass_name}`, `add_tags=newtag`.

### How do I create a paid order for an existing contact with a coupon?

1. `POST getgoods` → grab `id` (or `good_name`) of the product.
2. `POST getcoupons` → grab `id` of the coupon.
3. `POST getpersonalmanagers` → grab `id` of the sales manager (optional).
4. `POST createorder` with: `rpsKey`, `customer_email`, `product_names={good id}`, `coupon={coupon id}`, `order_status=Paid`, `payment_method=Stripe`, `order_sales_manager={manager id}`, `order_paid_at=2025-01-15 12:00:00`.

### How do I move a contact between groups?

Use a single `addupdatelead` call: set `add_to_lists` to the new group's `rass_name` and `remove_from_lists` to the old group's `rass_name`. Alternatively call `removeleadfromlist` then `addupdatelead`.

### How do I tag and untag a contact in one operation?

`addupdatelead` accepts both `add_tags` and `remove_tags` together; this is preferred over calling `addtagtolead` + `removetagfromlead` separately.

### I'm not a programmer — can I use API 2.0 without writing code?

Yes. Per the "What if I'm not a programmer? (API 2.0)" article:

- Use the in-account **POST / GET request** block inside a **Funnel** to call API 2.0 endpoints.
- Configure the block with the method (POST), the address (`https://username.influencersoft.com/api/{method}`), and the parameter names exactly as listed in this chapter.
- For per-lead values (email, phone), use InfluencerSoft variables; for static values (like `rpsKey`), enter the literal string.
- For sending data from third-party services into InfluencerSoft, configure the outgoing webhook in the third-party service to POST to the same URL with the matching parameter names.
- For sending data from InfluencerSoft to a third-party service, use the Funnels POST/GET block pointed at the third-party service's URL.

## Cross-references

- **API 1.0** — the older API. The shared error code table lives in API 1.0's "API Response Statuses, Codes, and Descriptions" article (ID `360050392312`).
- **Contacts UI** — the same contacts manipulated here are visible/editable in the Contacts UI chapter.
- **Orders UI** — orders created via `createorder` appear in the Orders UI chapter.
- **CRM Settings** — additional contact fields referenced in the "near future" notes are configured in CRM Settings.
- **Integration with Zapier** — the non-programmer article links to Zapier integration as an alternative to direct API use.
- **Integration and API** (UI section) — where to copy the `rpsKey` value: `username.influencersoft.com/shops/setts/apisettings/`.
- **Employee access** (`/shops/access/`) — source of manager IDs.

## Source articles

In original section order:

1. [Adding tags to a contact – addtagtolead](https://help.influencersoft.com/hc/en-us/articles/360058445991-Adding-tags-to-a-contact-addtagtolead)
2. [Create or edit a contact – addupdatelead](https://help.influencersoft.com/hc/en-us/articles/360057803232-Create-or-edit-a-contact-addupdatelead)
3. [Get a list of additional users – getpersonalmanagers](https://help.influencersoft.com/hc/en-us/articles/360058446851-Get-a-list-of-additional-users-getpersonalmanagers)
4. [Getting a list of all coupons (discounts) – getcoupons](https://help.influencersoft.com/hc/en-us/articles/360058447251-Getting-a-list-of-all-coupons-discounts-getcoupons)
5. [Getting a list of groups (subscriptions) – getalllists](https://help.influencersoft.com/hc/en-us/articles/360057987072-Getting-a-list-of-groups-subscriptions-getalllists)
6. [Getting a list of products – getgoods](https://help.influencersoft.com/hc/en-us/articles/360057987312-Getting-a-list-of-products-getgoods)
7. [Order creation – createorder](https://help.influencersoft.com/hc/en-us/articles/360058446591-Order-creation-createorder)
8. [Removing a contact from a group – removeleadfromlist](https://help.influencersoft.com/hc/en-us/articles/360058445811-Removing-a-contact-from-a-group-removeleadfromlist)
9. [Removing tags from a contact – removetagfromlead](https://help.influencersoft.com/hc/en-us/articles/360057986352-Removing-tags-from-a-contact-removetagfromlead)
10. [What if I'm not a programmer? (API 2.0)](https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0)



---


# Glossary

Cross-cutting glossary built from the Terminology section of every chapter. 187 terms.

### "Polled" group (example)
Suggested name for a deduplication group used in the survey **Add to list** field to exclude people who already answered.  
*See:* Website

### % (percent) field
Optional visible field that adds a percentage value to each step in addition to its quantitative value.  
*See:* Reports

### `#nextpage`
variable usable in a button's "Open the link" field that routes the click through the funnel's Next page link instead of a hard-coded URL.  
*See:* Funnels

### A/B test
- (**Funnels**) action element that splits traffic into Option A and Option B paths.
- (**Automation**) Splits contacts across two or more variant branches by configurable percentages.

### Access (Allowed / Not allowed to leads in lists)
list-based gating: lists in "Not allowed" override lists in "Allowed".  
*See:* Courses

### Action
What happens to the contact after a trigger fires (add tag, send email, POST/GET request, end of process, etc.).  
*See:* Automation

### Ad Tag / Advertising Tag
A UTM-tag set (source, medium, campaign, ad, keywords) appended to an affiliate link for traffic-source reporting.  
*See:* Advertise

### Add to List (Survey Statistics)
Action that pushes respondents who picked a specific answer into a chosen or newly created group.  
*See:* Website

### Added to process
The default trigger present on every new process, used to add a contact manually from a Lead card.  
*See:* Automation

### Additional field
A custom contact field defined in CRM Settings. The Sales Funnel — Additional Fields report compares funnel statistics over one of these fields.  
*See:* Reports

### Advertising Articles
Pre-formatted text creatives with HTML code containing the affiliate link.  
*See:* Advertise

### Advertising Banners
Image creatives with HTML code containing the affiliate link.  
*See:* Advertise

### Advertising Blanks for Partner Registration
Promotional materials specifically for recruiting second-level partners.  
*See:* Advertise

### Advertising Draft / Promotional Draft
A pre-built creative (link, banner, article, or subscription form) prepared by the author for partners to use.  
*See:* Advertise

### Advertising label / tag
channel, source, campaign, ad, keywords attached to an order or order button for advertising analytics.  
*See:* Store

### Affiliate / Partner
a person registered in your affiliate program who promotes your free or paid products in exchange for commissions.  
*See:* Affiliates

### Affiliate link
A URL with your partner identifier embedded. Sending traffic through it credits the resulting leads, orders, and partner sign-ups to you.  
*See:* Advertise

### Affiliate program
the overall configuration of commissions, payout methods, registration page, and instructions you offer partners.  
*See:* Affiliates

### Affiliate program / Affiliate's program
A program created by an author that you have joined as a partner.  
*See:* Advertise

### Affiliate's Form/Button Generator
toggle on a paid product's promo list that permits or forbids partners to generate order buttons/forms inside their cabinet.  
*See:* Affiliates

### Alternative store
secondary domain whose payment methods can override the main store's, redirecting incoming funds to a different account.  
*See:* Store

### Amount
Default visible quantity column on funnel-step tables.  
*See:* Reports

### Analytical sales funnel
A configurable chain of steps (subscribed, activated, opened email, clicked, processed bill, paid bill, etc.) used to track conversion and surface the points where potential clients are lost.  
*See:* Reports

### Any page by URL
a page element that points to a URL outside the funnel (in InfluencerSoft or another service).  
*See:* Funnels

### Arbitrary exit
a link type that is purely visual and carries no behavioral logic.  
*See:* Funnels

### Attempt
incrementing counter (2, 3, …) on a student's resubmitted report after rejection.  
*See:* Courses

### Author
The owner of the affiliate program. Sets the promotional materials, prices, commissions, and instructions.  
*See:* Advertise

### Auto-list
A dynamically-populated list used inside Process filters (e.g. "unpaid orders by one product"). Created in Contacts; referenced here as a filter parameter.  
*See:* Automation

### Auto-list / Leads list for a plan
list automatically created and bound to a pricing plan. Cannot be deleted or disabled while it is bound. Students who pay are auto-added.  
*See:* Courses

### Auto-webinar / Autowebinar
A pre-recorded video that simulates a live webinar, with a schedule, a countdown timer page, a broadcast room, chat options, and a pop-up offer button.  
*See:* Website

### Branching
Multiple actions, conditions, or triggers configured to run simultaneously from a single step.  
*See:* Automation

### Broadcast page
A page in your site (not an auto-webinar) that embeds a YouTube live stream; built quickly from the **Webinars** template tab.  
*See:* Website

### Bump Offer
an optional extra product the customer can add to the invoice on the Payment page with one click via a checkbox.  
*See:* Funnels

### Category
a grouping label for sales funnels that share an underlying theme (for example, infant development courses vs. weight loss programs).  
*See:* Funnels

### Click
the event of following a link (or clicking a button/form) that carries a partner UTM-tag, captured by the Click.js script and stored in a browser cookie until a subscription or invoice is created.  
*See:* Affiliates

### Click.js
the script placed on a page that parses the URL bar, splits UTM-tags into key-value pairs, and transfers them to InfluencerSoft on subscription or form-based order generation.  
*See:* Affiliates

### CNAME
DNS record type used when binding a subdomain.  
*See:* Website

### Co-author (collaborator)
second account that earns a share on a joint product; has their own login and can see statistics on collaborative products.  
*See:* Store

### Code counter / Counter code
Auto-webinar fields for injecting analytics/metric code into the timer page or the broadcast page.  
*See:* Website

### Cohort
A group of contacts who entered a funnel within the same period of time; compared against each other in cohort analysis.  
*See:* Reports

### Commission
amount paid to the partner for a sale; can be a fixed sum, a fixed sum with a discount, or a percentage of the product cost.  
*See:* Affiliates

### Condition
A branching step in a Process: either a **Filter** (one or more conditions evaluated as all/any) or an **A/B Test** (probabilistic split).  
*See:* Automation

### Content / Activation / Webinar page
page elements created inside the funnel via the page builder.  
*See:* Funnels

### Copyright text
Footer text shown on every page of a site, configured under `Site settings → More`.  
*See:* Website

### Countdown page
page element with a pre-installed Timer widget; can be used as either a selling or a payment page.  
*See:* Funnels

### Coupon / Discount
code that reduces price either in dollars or in percentage; can be limited by validity period and product set. A "melting" discount decreases daily over the validity period.  
*See:* Store

### Course
a top-level learning product composed of one or more modules.  
*See:* Courses

### Cumulative data in the statistics
Checkbox that flips Interval Analysis output between cumulative total and individual periods.  
*See:* Reports

### Custom block
user-defined action element with no settings beyond a name and icon, used as a stage marker.  
*See:* Funnels

### Custom field value changed
A trigger that fires when a contact's additional field value changes.  
*See:* Automation

### Digital product
delivered electronically (link after payment): subscriptions, training access, codes, paid info, coaching.  
*See:* Store

### Direct link (partner)
affiliate link that points to the original product page (only after the partner script is verified on the page) instead of the default affiliate URL.  
*See:* Store

### Direct Link for Partners
a partner link that points directly to your advertising page (requires inserting the click script code on that page).  
*See:* Affiliates

### DNS Editor
Built-in editor for managing DNS records on second-level linked domains (A, AAAA, MX, TXT, CNAME). Opens when you click an Active second-level domain in Website → Settings.  
*See:* Website

### Domain (additional / linked / delegated)
A second- or third-level domain you point to InfluencerSoft so pages open on `yourdomain.com` rather than `yourlogin.influencersoft.com`.  
*See:* Website

### Done
In Rules, a log of every executed action; in Tasks, one of the terminal results a manager can pick.  
*See:* Automation

### Dynamic variable
placeholder appended to exit-point links, e.g. `{$ name}`, `{$ email}`, `{$ phone}`, that auto-populates the next page's form.  
*See:* Funnels

### e-Commerce tracking
A toggle inside the GA property that must be enabled for InfluencerSoft order data to flow.  
*See:* Website

### Element icon
preview screenshot attached to a page/lesson/traffic block in the canvas.  
*See:* Funnels

### Element panel
the left-side strip in the funnel editor that lists every element type available to drag onto the workspace.  
*See:* Funnels

### End of process
The terminating action; required at the end of every chain so the process registers as "Done" for the contact.  
*See:* Automation

### Event (of a step)
The action being counted at that step. Allowed events in the article: subscription for newsletters, processing bills, paying bills, actions with instant emails, actions with automatic emails.  
*See:* Reports

### Facebook chatbot / Messenger integration
Facebook page connected to InfluencerSoft processes for automated user dialogue, opt-in to email, and quick-reply branching (Gift, Special Offer, Other).  
*See:* Store

### Favicon
The icon shown in the browser tab; uploaded via `Site settings → Main parameters → Icon (favicon.ico)`.  
*See:* Website

### Favorite course
author-marked star on a course. Displays the course at the top of the list for both author and student, and gives it a double-width cell in the student catalog.  
*See:* Courses

### Favorites
Pinned affiliate programs in the catalog, marked by a yellow star.  
*See:* Advertise

### Favorites (funnels)
Star toggle that promotes a funnel to the top of the funnel list; grey star = not favorite, yellow star = favorite.  
*See:* Reports

### Fee period
the number of days (1–365, or forever) after a partner's click during which a subsequent purchase will still pay commission to that partner.  
*See:* Affiliates

### File Manager
Cloud storage that holds images, CSS, JS, and other static files for your sites. Has a fixed quota shown at the top of the page.  
*See:* Website

### Filter (action)
action element that branches the flow based on lead parameters (invoice generated, lesson accessible, in a client group, etc.).  
*See:* Funnels

### Filter (Process condition)
Branches the process into a "Yes" path and a "No" path based on contact data.  
*See:* Automation

### First click / Last click
Attribution model selectable in the Leads filter.  
*See:* Advertise

### First click / Last click / By days after the click
Attribution modes available in advertising and funnel filters for assigning a conversion to a click.  
*See:* Reports

### Floating price
digital product where a unit price is set and the buyer chooses how many units; e.g., $87/hour consultation, paying $174 = 2 hours.  
*See:* Store

### Folder
an author-side organizational container in Courses → Lessons for sorting lessons. Folders can contain subfolders. Students never see folder names.  
*See:* Courses

### Footer code field
Sister field to HEAD code; supports HTML, JS, or plain text and is rendered inside `<footer>`.  
*See:* Website

### Free magnet
A free product (lead magnet) offered for subscription. Listed under the **Free** tab on Offers.  
*See:* Advertise

### Free product (for affiliates)
a free magnet/lead-magnet you let partners promote so they can capture leads on your behalf.  
*See:* Affiliates

### Funnel element
any draggable block placed on the funnel canvas; types are Pages, Forms, Actions, and Traffic.  
*See:* Funnels

### Gear button
Universal export control; exports the current table to CSV (and to MS Excel on the Subscription statistics page).  
*See:* Reports

### Get shareable link
toggle on the share panel that turns the current funnel into a publicly retrievable link.  
*See:* Funnels

### HEAD code field
Field on `Site → More` and on each Page's **Additional** tab where custom HTML/JS (Google Analytics, FB pixel, retargeting, iubenda banner, etc.) is injected into `<head>`.  
*See:* Website

### HTML editor
An alternative page editor where you paste raw HTML/CSS/JS into a single field instead of using the visual builder. Must be chosen at page-creation time.  
*See:* Website

### HTML Templates
Custom page templates you upload or build yourself, reachable from the **HTML Templates** button at the top of the Pages screen.  
*See:* Website

### Instructions
Optional author-supplied guidance shown as a menu item only when the author added it.  
*See:* Advertise

### Interactive block
A widget or section flagged "interactive" so it can be toggled on/off live without making the visitor refresh the page. Used heavily during webinars.  
*See:* Website

### Interactivity mixer / interactivity switch
The control that flips all currently interactive blocks on the page.  
*See:* Website

### Interval analysis
Optional analysis mode that takes a chosen step plus a parameter and an interval and outputs results either as a running cumulative total or per individual period.  
*See:* Reports

### iubenda
Third-party service (iubenda.com) used by the recommended cookie-consent workflow.  
*See:* Website

### Joint product
a product whose payout is shared with a co-author; configured on the "Products of the co-author" page.  
*See:* Store

### Lead
A contact that subscribed via your affiliate link.  
*See:* Advertise

### Lesson
the unit of teaching content. Lessons live globally in Courses → Lessons and can be attached to any number of modules in any number of courses.  
*See:* Courses

### Link
a connector drawn between two elements that defines the behavioral path a contact takes (for example "A lead is added", "An invoice is paid").  
*See:* Funnels

### Manager responsible for the client (personal manager)
user attached to all of a client's orders for relationship/upsell work.  
*See:* Store

### Manager responsible for the order (sales manager)
Call-Center user automatically attached to a new order; chases payment.  
*See:* Store

### Members area
element that attaches a course or a single lesson to the funnel.  
*See:* Funnels

### Membership
same product type as a course in InfluencerSoft (created the same way).  
*See:* Courses

### Module
a grouping of lessons within a course. Every course starts with one default module called "The main module of a course".  
*See:* Courses

### Money Back / Subtract Commission in the Case of Moneyback
checkbox that controls whether commissions are removed when a customer is refunded. The checkbox state is captured at bill generation time.  
*See:* Affiliates

### Multi-level affiliates program / Attracting partners
Recruiting second-level partners. Listed under the **Partners** tab on Offers.  
*See:* Advertise

### Name Servers
DNS server records the system generates for you to enter at your registrar to delegate a second-level domain.  
*See:* Website

### New Campaign window
Modal opened by **Add an Ad Tag** / **Add Advertising Tag** to build a UTM-tagged link.  
*See:* Advertise

### New learners
auto-generated system contact list that every newly registered student is dropped into; lives in Contacts → Lists.  
*See:* Courses

### No Category
default category label shown on the gear menu when a funnel has not been assigned a category.  
*See:* Funnels

### Obligatory lesson
a lesson marked as mandatory; the module is not "completed" until all obligatory lessons are completed. Marked with a blue exclamation mark (usual lessons show a green exclamation mark).  
*See:* Courses

### Offer
A promotional material entry shown on the Offers page. Offers are grouped Free / Paid / Partners.  
*See:* Advertise

### Offers column
column on the promo materials list whose number opens the per-product list of banners, texts, and forms.  
*See:* Affiliates

### Opt-in / Double opt-in form / Order form / Payment form
form elements built in the form constructor.  
*See:* Funnels

### Opt-in / Double opt-in page
subscription pages with an extra Actions tab for subscription settings.  
*See:* Funnels

### Order
A purchase billed under your affiliate link, with associated commission.  
*See:* Advertise

### Order button
embeddable HTML button generated from a product, opens contact info form then payment page.  
*See:* Store

### Order card / Order No.
full detail view of a single order; controls status changes (Paid, Cancel, Refund, Delete, Advance pay), call statuses, notes, manager assignment.  
*See:* Store

### Order page
page element used with PayPal: routes to PayPal for payment.  
*See:* Funnels

### Order page identifier
alphabet-only unique string used in the URL of the product order/sales page; underscore allowed; cannot be edited after the product is created.  
*See:* Store

### Page
A single URL inside a site. Each page has an identifier appended to the site's domain (`yourdomain.com/id_page`). New pages are auto-named `draft_xxxxxxxxxx` until renamed.  
*See:* Website

### Page Builder / Template Designer / Template Constructor
The drag-and-drop visual editor used to build pages from sections and widgets. The source articles use all three names interchangeably.  
*See:* Website

### Paid product
A product sold for money, with partner price/conditions block. Listed under the **Paid** tab on Offers.  
*See:* Advertise

### Paid product (for affiliates)
a paid product made promotable by ticking Display to partners in the product's Affiliates tab.  
*See:* Affiliates

### Partner's cabinet
- (**Affiliates**) the partner-side interface where promotional materials, instructions, and affiliate links are surfaced.
- (**Advertise**) Your top-level Advertise page listing every affiliate program you have joined.

### Partners From You
Second-level partners who signed up through your referral link.  
*See:* Advertise

### Payment page
page element used with Stripe: takes card payment without leaving the page.  
*See:* Funnels

### Payment reminder series
chain of reminder emails tied to selected products, sent after invoice is created if unpaid.  
*See:* Store

### Payments
Report of commissions charged and paid out to you.  
*See:* Advertise

### Payout
Button in the Payments to the Managers table that triggers payment to a manager who is owed money.  
*See:* Reports

### Payout / Pay Out
the action of generating a notification to a partner that commissions are being paid. Clicking Pay Out does not move money — real payment happens from your own wallets, not from your InfluencerSoft balance.  
*See:* Affiliates

### PayPal IPN
Instant Payment Notification from PayPal to InfluencerSoft; required to mark orders paid.  
*See:* Store

### Physical product
tangible item (disc, book, souvenir) that may be combined with a digital delivery.  
*See:* Store

### Pin code
pre-loaded list of one-time codes the system gives one per buyer using `{$pincode}` in the post-payment email.  
*See:* Store

### POST/GET request
An action that calls an external HTTPS endpoint with available parameters when the trigger fires.  
*See:* Automation

### Prepayment
partial payment allowed against an order; minimum amount comes from Store Settings or per-product override. Cannot coexist with auto-payment.  
*See:* Store

### Pricing plan / Tariff
a fee-based access option attached to a course. Each plan auto-generates a linked product and a linked leads list. Also called "tariff" in the Course settings tab "Tariffs".  
*See:* Courses

### Pricing plan payment page identifier
a unique Latin-letter (and numbers / underscore) ID that forms part of the order page URL for a plan.  
*See:* Courses

### Pricing plan table
the module-vs-plan access grid below the list of pricing plans inside a course, used to toggle which modules each plan unlocks.  
*See:* Courses

### Primary access
the fact that a student has an account at all and can log in.  
*See:* Courses

### Process
- (**Funnels**) action element wrapping a sub-process; created from inside the funnel and only visible from that funnel.
- (**Automation**) A configurable, multi-step chain of triggers, actions, and conditions executed on a contact when an event occurs.

### Product
a sellable item. Type is digital, physical, or floating-price.  
*See:* Store

### Promotional materials / Promo / Drafts for Partners
banners, advertising text, and subscription forms partners can use; created by you and displayed in the partner's cabinet.  
*See:* Affiliates

### Quick add link to a group
special email-editor button that adds the clicker to a chosen list.  
*See:* Courses

### Quick Filter bar
date filter strip shown above "Add a course" when Report statistics view is enabled.  
*See:* Courses

### Referral
A visitor that followed your affiliate link to a page.  
*See:* Advertise

### Report
a student's submitted answer to a lesson task; carries a status (New / Accepted / Rejected) and an attempt number.  
*See:* Courses

### Resend the letter "Thank you for your purchase"
manual re-trigger of the post-payment email from the Order Card.  
*See:* Store

### Reset the password (variable)
email attribute that inserts a password-reset link variable into automatic and quick mailshots.  
*See:* Courses

### Rule (Automatic rule)
A single trigger paired with one or more actions; simpler than a Process and not multi-step.  
*See:* Automation

### Sales funnel
a flow of pages, forms, actions, and traffic sources connected on a canvas.  
*See:* Funnels

### Sales tax
per-country tax (including EU standard VAT rates) added to product price at order time; applies to recurrent and upsell products too.  
*See:* Store

### Section
A large horizontal block of a page categorised by purpose: promo, content, cap, footer, goods, etc. Sections live inside one of the page's three logical parts (header, main content, footer).  
*See:* Website

### Section "Interactive blocks management"
The page from which you flip individual interactive blocks on or off for a live page.  
*See:* Website

### Selected
saved-templates area where emails and pages survive funnel deletion; if items are not in Selected, deleting the funnel deletes them.  
*See:* Funnels

### Sender contact
the "From" identity used for student notification emails. Maintained in Campaigns → Settings → Sender contact information.  
*See:* Courses

### Sender's contact
The "from" identity selected on a Send email action.  
*See:* Automation

### Single payment
- (**Store**) buyer pays full amount once.
- (**Courses**) pay once, all-time access (subject to lesson access rules).

### Site / Main Site
A container for pages, bound to one or more domains. The default container created with the account is named "Main Site"; new ones are created with the **Create** button on the Pages screen.  
*See:* Website

### Source / Channel
Origin of the traffic driving people into a funnel (direct referrals, affiliate traffic, advertising, etc.). Inside the Advertising report a Source is a sub-grouping within a Channel.  
*See:* Reports

### Split testing (A/B testing)
Multiple page variants served with a percentage split that totals 100%; analysed via the **A/B** button on the Pages screen.  
*See:* Website

### Status (Active / pointed elsewhere / pending)
Visual state shown for each linked domain after submission.  
*See:* Website

### Step (of a funnel)
One node in the funnel. Each step has a name and is bound to one event (subscription, processing a bill, paying a bill, instant emails, automatic emails).  
*See:* Reports

### Sub-page / Nested page
A page placed under another page so its address becomes `…/id_pages1/id_page2`.  
*See:* Website

### Subscribed / Unsubscribed columns
Clickable counters on the Subscription statistics table that open the Subscribers list filtered to that condition.  
*See:* Reports

### Subscription (recurrent payment, auto-payment)
payment is debited at regular intervals from the buyer's card; enables the "Auto-payments" tab.  
*See:* Store

### Subscription Form Generator
Tool on the free-product drafts page that produces an HTML subscription form with the partner's tag baked in.  
*See:* Advertise

### Survey
An InfluencerSoft questionnaire that also segments respondents into contact groups based on their answers.  
*See:* Website

### Tag (course)
a label attached to a course; used for student-side filtering. Entered in Latin or Cyrillic; pressing **Enter** saves a tag (Apply / Save buttons do not save it).  
*See:* Courses

### Tariff "Guru"
paid plan that unlocks the Subscription Activation checkbox on partner subscription forms.  
*See:* Affiliates

### Task
An assignment to an employee, additional administrator, call-center operator, or Department, either created manually or generated by a Process action. Has a type, dates, status, and a result.  
*See:* Automation

### Timer (action)
action element that applies a timer rule across multiple pages or emails in the funnel.  
*See:* Funnels

### Timer (page-level)
Per-page countdown that hides the page or shows a replacement when it expires.  
*See:* Website

### Traffic source
element category for tagged inbound link sources (AdWords, YouTube, Affiliates, Facebook, Instagram, WhatsApp, Email, CPA, or generic Source).  
*See:* Funnels

### Trigger
An event that happens to a contact (tag applied, order paid, page visited, etc.) that causes a Process or Rule to start, or causes the next step inside a Process to run. Multiple triggers on a step follow "OR" logic — any of them fires the step.  
*See:* Automation

### Two-level / Multi-leveled affiliate program
a program in which a partner can also recruit lower-level partners; commissions are paid across levels. The number of levels is currently limited to two.  
*See:* Affiliates

### Type (of task)
A reusable label for tasks (e.g. "call" by default); renameable, with assignable icon and color.  
*See:* Automation

### Universal Analytics (analytics.js)
Google Analytics version required for the e-commerce integration; the older `ga.js` is not supported.  
*See:* Website

### Upsell
page element offering one or two extra products after the main purchase, controlled by `#upsell_yes` / `#upsell_no` variables.  
*See:* Funnels

### Upsell (resale)
a complementary product offered (usually discounted) when the order is placed; can be chained based on accept/decline.  
*See:* Store

### UTM tag
query-string tag attached to a traffic link or to leads/orders generated by a page or form.  
*See:* Funnels

### UTM-tag
- (**Affiliates**) key-value parameter on a URL, button, or form that identifies the partner whose link drove the visit.
- (**Reports**) Parameters appended to a page URL by the New Campaign builder so that clicks can be counted per channel/source/campaign/ad/keys.

### UTM-tags
Parameters added to a link to attribute traffic to a source, channel, campaign, ad, or keyword.  
*See:* Advertise

### Viral promotion / Viral action
Mechanic that gives access to a product in exchange for the participant bringing in new subscribers through a personal link.  
*See:* Website

### Viral promotion registration form
Subscription form that signs visitors up as participants of a viral promotion.  
*See:* Website

### Visible fields / View button
Column-picker control on report tables. Ticking a column shows it; un-ticking hides it.  
*See:* Reports

### Visual editor
the alternative WYSIWYG lesson editor.  
*See:* Courses

### Web Page Designer Tool
block-and-widget visual builder for lesson pages.  
*See:* Courses

### Webinar room
The page that displays the broadcast video plus optional pop-up offer.  
*See:* Website

### Widget
An individual element (text, form, button, image, timer, video, etc.) placed inside a section.  
*See:* Website

### Workspace
the funnel canvas area onto which elements are dragged and linked.  
*See:* Funnels

### Your Affiliate Link
Field on Offers / Advertising Blanks that holds the partner's link to an advertised page.  
*See:* Advertise

### Your Link for Counting Clicks / Your Reference-Counting of Clicks
Output field on the New Campaign window holding the tagged link.  
*See:* Advertise



---


# How do I…?

Action-oriented task index. Each entry links to the chapter + heading where the workflow is documented.

## By chapter

### Funnels (32)
- [How do I create a new sales funnel](01-funnels.md#how-do-i-create-a-new-sales-funnel)
- [How do I rename a sales funnel](01-funnels.md#how-do-i-rename-a-sales-funnel)
- [How do I edit an existing sales funnel](01-funnels.md#how-do-i-edit-an-existing-sales-funnel)
- [How do I add an element to a funnel](01-funnels.md#how-do-i-add-an-element-to-a-funnel)
- [How do I configure a Content, Activation, or Webinar page from inside a funnel](01-funnels.md#how-do-i-configure-a-content-activation-or-webinar-page-from-inside-a-funnel)
- [How do I configure an Opt-in or Double opt-in page](01-funnels.md#how-do-i-configure-an-opt-in-or-double-opt-in-page)
- [How do I add a course or lesson to a funnel](01-funnels.md#how-do-i-add-a-course-or-lesson-to-a-funnel)
- [How do I set up an Upsell page](01-funnels.md#how-do-i-set-up-an-upsell-page)
- [How do I sell with PayPal (Order page)](01-funnels.md#how-do-i-sell-with-paypal-order-page)
- [How do I sell with Stripe (Payment Page)](01-funnels.md#how-do-i-sell-with-stripe-payment-page)
- [How do I add a Bump Offer to the Payment Page](01-funnels.md#how-do-i-add-a-bump-offer-to-the-payment-page)
- [How do I add a Countdown page](01-funnels.md#how-do-i-add-a-countdown-page)
- [How do I add a subscription, order, or payment form to a funnel](01-funnels.md#how-do-i-add-a-subscription-order-or-payment-form-to-a-funnel)
- [How do I send an email from inside a funnel](01-funnels.md#how-do-i-send-an-email-from-inside-a-funnel)
- [How do I A/B test inside a funnel](01-funnels.md#how-do-i-a-b-test-inside-a-funnel)
- [How do I branch a funnel by lead attributes (Filter)](01-funnels.md#how-do-i-branch-a-funnel-by-lead-attributes-filter)
- [How do I embed a Process inside a funnel](01-funnels.md#how-do-i-embed-a-process-inside-a-funnel)
- [How do I add a shared Timer for multiple pages or emails](01-funnels.md#how-do-i-add-a-shared-timer-for-multiple-pages-or-emails)
- [How do I add a stage marker (Custom block)](01-funnels.md#how-do-i-add-a-stage-marker-custom-block)
- [How do I add a traffic source to a funnel](01-funnels.md#how-do-i-add-a-traffic-source-to-a-funnel)
- [How do I link two funnel elements](01-funnels.md#how-do-i-link-two-funnel-elements)
- [How do I make a button on a page send the user to the funnel's next page](01-funnels.md#how-do-i-make-a-button-on-a-page-send-the-user-to-the-funnel-s-next-page)
- [How do I view statistics, add notes, undo, or redo in the editor](01-funnels.md#how-do-i-view-statistics-add-notes-undo-or-redo-in-the-editor)
- [How do I enable or disable a sales funnel](01-funnels.md#how-do-i-enable-or-disable-a-sales-funnel)
- [How do I share a sales funnel](01-funnels.md#how-do-i-share-a-sales-funnel)
- [How do I copy a sales funnel](01-funnels.md#how-do-i-copy-a-sales-funnel)
- [How do I add a sales funnel to a category](01-funnels.md#how-do-i-add-a-sales-funnel-to-a-category)
- [How do I create a new category](01-funnels.md#how-do-i-create-a-new-category)
- [How do I edit an existing category](01-funnels.md#how-do-i-edit-an-existing-category)
- [How do I remove a category](01-funnels.md#how-do-i-remove-a-category)
- [How do I filter the Categories list](01-funnels.md#how-do-i-filter-the-categories-list)
- [How do I delete a sales funnel](01-funnels.md#how-do-i-delete-a-sales-funnel)

### Website (35)
- [How do I create a new website page](02-website.md#how-do-i-create-a-new-website-page)
- [How do I edit an existing page](02-website.md#how-do-i-edit-an-existing-page)
- [How do I delete a page](02-website.md#how-do-i-delete-a-page)
- [How do I temporarily disable a page](02-website.md#how-do-i-temporarily-disable-a-page)
- [How do I make a page nested under another](02-website.md#how-do-i-make-a-page-nested-under-another)
- [How do I add a section or widget to a page in the Page Builder](02-website.md#how-do-i-add-a-section-or-widget-to-a-page-in-the-page-builder)
- [How do I move a section or widget](02-website.md#how-do-i-move-a-section-or-widget)
- [How do I change the look of an item](02-website.md#how-do-i-change-the-look-of-an-item)
- [How do I change the indents differently for desktop and mobile in a text widget](02-website.md#how-do-i-change-the-indents-differently-for-desktop-and-mobile-in-a-text-widget)
- [How do I configure page-wide site options (fonts, background, image compression, header code, SEO, social image)](02-website.md#how-do-i-configure-page-wide-site-options-fonts-background-image-compression-header-code-seo-social-image)
- [How do I turn off image compression for a page](02-website.md#how-do-i-turn-off-image-compression-for-a-page)
- [How do I paste a custom landing page (HTML/CSS/JS) into InfluencerSoft](02-website.md#how-do-i-paste-a-custom-landing-page-html-css-js-into-influencersoft)
- [How do I activate or deactivate interactive blocks on a page](02-website.md#how-do-i-activate-or-deactivate-interactive-blocks-on-a-page)
- [How do I make a broadcast page for a webinar in 5 minutes](02-website.md#how-do-i-make-a-broadcast-page-for-a-webinar-in-5-minutes)
- [How do I create an auto-webinar](02-website.md#how-do-i-create-an-auto-webinar)
- [How do I edit, deactivate, or delete an existing auto-webinar](02-website.md#how-do-i-edit-deactivate-or-delete-an-existing-auto-webinar)
- [How do I add a custom domain to InfluencerSoft (second-level domain)](02-website.md#how-do-i-add-a-custom-domain-to-influencersoft-second-level-domain)
- [How do I add a subdomain (third-level) to InfluencerSoft](02-website.md#how-do-i-add-a-subdomain-third-level-to-influencersoft)
- [How do I make my store pages open on my own domain](02-website.md#how-do-i-make-my-store-pages-open-on-my-own-domain)
- [How do I place pages on a newly attached domain](02-website.md#how-do-i-place-pages-on-a-newly-attached-domain)
- [How do I add or edit DNS records on a linked second-level domain](02-website.md#how-do-i-add-or-edit-dns-records-on-a-linked-second-level-domain)
- [How do I upload, organise, or delete files in the File Manager](02-website.md#how-do-i-upload-organise-or-delete-files-in-the-file-manager)
- [How do I block cookies until visitors consent (GDPR)](02-website.md#how-do-i-block-cookies-until-visitors-consent-gdpr)
- [How do I integrate Google Analytics with the e-commerce module](02-website.md#how-do-i-integrate-google-analytics-with-the-e-commerce-module)
- [How do I add a favicon, custom HEAD code, or copyright text to all pages of a site](02-website.md#how-do-i-add-a-favicon-custom-head-code-or-copyright-text-to-all-pages-of-a-site)
- [How do I grant another admin access to a site or a page](02-website.md#how-do-i-grant-another-admin-access-to-a-site-or-a-page)
- [How do I set a countdown timer on a page](02-website.md#how-do-i-set-a-countdown-timer-on-a-page)
- [How do I set up A/B (split) testing on a page](02-website.md#how-do-i-set-up-a-b-split-testing-on-a-page)
- [How do I create a viral promotion](02-website.md#how-do-i-create-a-viral-promotion)
- [How do I configure the viral promotion's registration form](02-website.md#how-do-i-configure-the-viral-promotion-s-registration-form)
- [How do I see and export viral promotion statistics](02-website.md#how-do-i-see-and-export-viral-promotion-statistics)
- [How do I create a survey](02-website.md#how-do-i-create-a-survey)
- [How do I deactivate or delete a survey](02-website.md#how-do-i-deactivate-or-delete-a-survey)
- [How do I review survey results and segment respondents](02-website.md#how-do-i-review-survey-results-and-segment-respondents)
- [How do I decide whether I also need external hosting](02-website.md#how-do-i-decide-whether-i-also-need-external-hosting)

### Store (21)
- [How do I create a new product](03-store.md#how-do-i-create-a-new-product)
- [How do I edit or delete a product](03-store.md#how-do-i-edit-or-delete-a-product)
- [How do I create a product category](03-store.md#how-do-i-create-a-product-category)
- [How do I add or edit a co-author](03-store.md#how-do-i-add-or-edit-a-co-author)
- [How do I share revenue on a product with a co-author](03-store.md#how-do-i-share-revenue-on-a-product-with-a-co-author)
- [How do I create a discount coupon](03-store.md#how-do-i-create-a-discount-coupon)
- [How do I delete or edit a discount](03-store.md#how-do-i-delete-or-edit-a-discount)
- [How do I make an order button I can embed on a page](03-store.md#how-do-i-make-an-order-button-i-can-embed-on-a-page)
- [How do I configure an upsell](03-store.md#how-do-i-configure-an-upsell)
- [How do I create an order on behalf of a customer (from a phone call)](03-store.md#how-do-i-create-an-order-on-behalf-of-a-customer-from-a-phone-call)
- [How do I review and manage a specific order](03-store.md#how-do-i-review-and-manage-a-specific-order)
- [How do I filter the orders list](03-store.md#how-do-i-filter-the-orders-list)
- [How do I export orders](03-store.md#how-do-i-export-orders)
- [How do I customize columns in the Orders table](03-store.md#how-do-i-customize-columns-in-the-orders-table)
- [How do I set up automatic payment-reminder emails for unpaid orders](03-store.md#how-do-i-set-up-automatic-payment-reminder-emails-for-unpaid-orders)
- [How do I configure PayPal](03-store.md#how-do-i-configure-paypal)
- [How do I add or edit Store-wide settings](03-store.md#how-do-i-add-or-edit-store-wide-settings)
- [How do I assign or change the manager responsible for an order or a client](03-store.md#how-do-i-assign-or-change-the-manager-responsible-for-an-order-or-a-client)
- [How do I integrate Facebook Messenger and build a chatbot](03-store.md#how-do-i-integrate-facebook-messenger-and-build-a-chatbot)
- [How do I view payments and statistics for co-authors](03-store.md#how-do-i-view-payments-and-statistics-for-co-authors)
- [How do I resend the "Thank you for your purchase" email after manual payment](03-store.md#how-do-i-resend-the-thank-you-for-your-purchase-email-after-manual-payment)

### Contacts (34)
- [How do I add a new contact manually](04-contacts.md#how-do-i-add-a-new-contact-manually)
- [How do I import contacts from a CSV file](04-contacts.md#how-do-i-import-contacts-from-a-csv-file)
- [How do I import contacts via Text Import](04-contacts.md#how-do-i-import-contacts-via-text-import)
- [How do I export contacts](04-contacts.md#how-do-i-export-contacts)
- [How do I bulk-edit contacts](04-contacts.md#how-do-i-bulk-edit-contacts)
- [How do I add contacts to a list](04-contacts.md#how-do-i-add-contacts-to-a-list)
- [How do I remove contacts from a list](04-contacts.md#how-do-i-remove-contacts-from-a-list)
- [How do I create a normal contact list](04-contacts.md#how-do-i-create-a-normal-contact-list)
- [How do I create an auto-list](04-contacts.md#how-do-i-create-an-auto-list)
- [How do I create a group of inactive contacts](04-contacts.md#how-do-i-create-a-group-of-inactive-contacts)
- [How do I create a category](04-contacts.md#how-do-i-create-a-category)
- [How do I rename, edit, or delete a category](04-contacts.md#how-do-i-rename-edit-or-delete-a-category)
- [How do I test an auto-series for a list](04-contacts.md#how-do-i-test-an-auto-series-for-a-list)
- [How do I disable an auto-series for a list](04-contacts.md#how-do-i-disable-an-auto-series-for-a-list)
- [How do I configure Google invisible reCAPTCHA](04-contacts.md#how-do-i-configure-google-invisible-recaptcha)
- [How do I create an additional lead field](04-contacts.md#how-do-i-create-an-additional-lead-field)
- [How do I build a subscription form](04-contacts.md#how-do-i-build-a-subscription-form)
- [How do I track form sources with tags](04-contacts.md#how-do-i-track-form-sources-with-tags)
- [How do I create a call assignment](04-contacts.md#how-do-i-create-a-call-assignment)
- [How do I deactivate or delete a call task](04-contacts.md#how-do-i-deactivate-or-delete-a-call-task)
- [How do I view per-task call results](04-contacts.md#how-do-i-view-per-task-call-results)
- [How do I create a user](04-contacts.md#how-do-i-create-a-user)
- [How do I restrict a user's per-field access on contacts](04-contacts.md#how-do-i-restrict-a-user-s-per-field-access-on-contacts)
- [How do I deactivate or delete a user](04-contacts.md#how-do-i-deactivate-or-delete-a-user)
- [How do I see user activity (Click History)](04-contacts.md#how-do-i-see-user-activity-click-history)
- [How do I create a Team and how are tasks distributed](04-contacts.md#how-do-i-create-a-team-and-how-are-tasks-distributed)
- [How do I remove a user from a team](04-contacts.md#how-do-i-remove-a-user-from-a-team)
- [How do I connect Zoom](04-contacts.md#how-do-i-connect-zoom)
- [How do I disconnect Zoom](04-contacts.md#how-do-i-disconnect-zoom)
- [How do I create a Zoom meeting](04-contacts.md#how-do-i-create-a-zoom-meeting)
- [How do I let users book a meeting through a funnel](04-contacts.md#how-do-i-let-users-book-a-meeting-through-a-funnel)
- [How do I edit a meeting request after a user books](04-contacts.md#how-do-i-edit-a-meeting-request-after-a-user-books)
- [How do I view the activation history of a contact](04-contacts.md#how-do-i-view-the-activation-history-of-a-contact)
- [How do I search for and open a Lead Card](04-contacts.md#how-do-i-search-for-and-open-a-lead-card)

### Campaigns (31)
- [How do I add a new sender email I can send From](05-campaigns.md#how-do-i-add-a-new-sender-email-i-can-send-from)
- [How do I change the default sender](05-campaigns.md#how-do-i-change-the-default-sender)
- [How do I switch to my own SMTP server for outgoing mail](05-campaigns.md#how-do-i-switch-to-my-own-smtp-server-for-outgoing-mail)
- [How do I create a one-time email to all subscribers on a list](05-campaigns.md#how-do-i-create-a-one-time-email-to-all-subscribers-on-a-list)
- [How do I email people who clicked (or didn't click, or opened, or didn't open) a previous email](05-campaigns.md#how-do-i-email-people-who-clicked-or-didn-t-click-or-opened-or-didn-t-open-a-previous-email)
- [How do I resume a paused broadcast](05-campaigns.md#how-do-i-resume-a-paused-broadcast)
- [How do I export the subscribers who reacted (or didn't) to a specific broadcast](05-campaigns.md#how-do-i-export-the-subscribers-who-reacted-or-didn-t-to-a-specific-broadcast)
- [How do I filter the Broadcasts list](05-campaigns.md#how-do-i-filter-the-broadcasts-list)
- [How do I view detailed analytics for one broadcast](05-campaigns.md#how-do-i-view-detailed-analytics-for-one-broadcast)
- [How do I create or edit an auto-series email](05-campaigns.md#how-do-i-create-or-edit-an-auto-series-email)
- [How do I add a non-email action step (add/remove to other groups) to an Email Series](05-campaigns.md#how-do-i-add-a-non-email-action-step-add-remove-to-other-groups-to-an-email-series)
- [How do I make sure a key auto-series email is not interrupted by my broadcasts](05-campaigns.md#how-do-i-make-sure-a-key-auto-series-email-is-not-interrupted-by-my-broadcasts)
- [How do I delete one event from an Email Series](05-campaigns.md#how-do-i-delete-one-event-from-an-email-series)
- [How do I open detailed analytics for one auto-series email](05-campaigns.md#how-do-i-open-detailed-analytics-for-one-auto-series-email)
- [How do I create a Sequence (visual automation)](05-campaigns.md#how-do-i-create-a-sequence-visual-automation)
- [How do I disable a Sequence without deleting it](05-campaigns.md#how-do-i-disable-a-sequence-without-deleting-it)
- [How do I delete a Sequence](05-campaigns.md#how-do-i-delete-a-sequence)
- [How do I build a message in Message Constructor](05-campaigns.md#how-do-i-build-a-message-in-message-constructor)
- [How do I edit or delete a saved custom template](05-campaigns.md#how-do-i-edit-or-delete-a-saved-custom-template)
- [How do I let an employee edit email templates](05-campaigns.md#how-do-i-let-an-employee-edit-email-templates)
- [How do I find and act on subscribers](05-campaigns.md#how-do-i-find-and-act-on-subscribers)
- [How do I export the current subscriber list](05-campaigns.md#how-do-i-export-the-current-subscriber-list)
- [How do I bulk-move subscribers between groups](05-campaigns.md#how-do-i-bulk-move-subscribers-between-groups)
- [How do I bulk-unsubscribe people](05-campaigns.md#how-do-i-bulk-unsubscribe-people)
- [How do I create a G Suite account so I can use a domain-based sender](05-campaigns.md#how-do-i-create-a-g-suite-account-so-i-can-use-a-domain-based-sender)
- [How do I set up the DKIM signature for my domain](05-campaigns.md#how-do-i-set-up-the-dkim-signature-for-my-domain)
- [How do I set up SPF and DMARC](05-campaigns.md#how-do-i-set-up-spf-and-dmarc)
- [How do I set up FBL for my domain](05-campaigns.md#how-do-i-set-up-fbl-for-my-domain)
- [How do I get a Dedicated IP](05-campaigns.md#how-do-i-get-a-dedicated-ip)
- [How do I use the pre-send spam test](05-campaigns.md#how-do-i-use-the-pre-send-spam-test)
- [How do I keep my mailings out of spam in the first place](05-campaigns.md#how-do-i-keep-my-mailings-out-of-spam-in-the-first-place)

### Automation (28)
- [How do I create a new Process](06-automation.md#how-do-i-create-a-new-process)
- [How do I add a contact to a process manually](06-automation.md#how-do-i-add-a-contact-to-a-process-manually)
- [How do I rename a process](06-automation.md#how-do-i-rename-a-process)
- [How do I make a process branch](06-automation.md#how-do-i-make-a-process-branch)
- [How do I add a condition that splits "Yes" and "No" paths](06-automation.md#how-do-i-add-a-condition-that-splits-yes-and-no-paths)
- [How do I set up an A/B test inside a process](06-automation.md#how-do-i-set-up-an-a-b-test-inside-a-process)
- [How do I schedule an action on specific days and times](06-automation.md#how-do-i-schedule-an-action-on-specific-days-and-times)
- [How do I configure a trigger so the process advances even if the event never happens](06-automation.md#how-do-i-configure-a-trigger-so-the-process-advances-even-if-the-event-never-happens)
- [How do I send an email from inside a process](06-automation.md#how-do-i-send-an-email-from-inside-a-process)
- [How do I control how many times a process runs for the same contact](06-automation.md#how-do-i-control-how-many-times-a-process-runs-for-the-same-contact)
- [How do I edit a running process](06-automation.md#how-do-i-edit-a-running-process)
- [How do I disable a process](06-automation.md#how-do-i-disable-a-process)
- [How do I delete a process](06-automation.md#how-do-i-delete-a-process)
- [How do I view process statistics inside the editor](06-automation.md#how-do-i-view-process-statistics-inside-the-editor)
- [How do I create a new Rule](06-automation.md#how-do-i-create-a-new-rule)
- [How do I edit an existing Rule](06-automation.md#how-do-i-edit-an-existing-rule)
- [How do I disable a Rule](06-automation.md#how-do-i-disable-a-rule)
- [How do I delete a Rule](06-automation.md#how-do-i-delete-a-rule)
- [How do I review what a Rule has done](06-automation.md#how-do-i-review-what-a-rule-has-done)
- [How do I find a specific contact's executed actions](06-automation.md#how-do-i-find-a-specific-contact-s-executed-actions)
- [How do I export contacts a Rule acted on](06-automation.md#how-do-i-export-contacts-a-rule-acted-on)
- [How do I move contacts from the Done log to a group](06-automation.md#how-do-i-move-contacts-from-the-done-log-to-a-group)
- [How do I create a Task manually](06-automation.md#how-do-i-create-a-task-manually)
- [How do I create a Task automatically inside a Process](06-automation.md#how-do-i-create-a-task-automatically-inside-a-process)
- [How do I manage Task types](06-automation.md#how-do-i-manage-task-types)
- [How do I filter the Tasks list](06-automation.md#how-do-i-filter-the-tasks-list)
- [How do I edit or reassign a Task](06-automation.md#how-do-i-edit-or-reassign-a-task)
- [How do I delete a Task](06-automation.md#how-do-i-delete-a-task)

### Courses (24)
- [How do I create a new course or membership](07-courses.md#how-do-i-create-a-new-course-or-membership)
- [How do I duplicate a course](07-courses.md#how-do-i-duplicate-a-course)
- [How do I add a tag to a course](07-courses.md#how-do-i-add-a-tag-to-a-course)
- [How do I add a module](07-courses.md#how-do-i-add-a-module)
- [How do I add a lesson to a module](07-courses.md#how-do-i-add-a-lesson-to-a-module)
- [How do I remove a lesson from a module](07-courses.md#how-do-i-remove-a-lesson-from-a-module)
- [How do I gate a lesson by date or completion of a previous lesson](07-courses.md#how-do-i-gate-a-lesson-by-date-or-completion-of-a-previous-lesson)
- [How do I gate a module by contact list](07-courses.md#how-do-i-gate-a-module-by-contact-list)
- [How do I create a course in the Web Page Designer Tool](07-courses.md#how-do-i-create-a-course-in-the-web-page-designer-tool)
- [How do I assign a home task to a student](07-courses.md#how-do-i-assign-a-home-task-to-a-student)
- [How do I create a folder for lessons](07-courses.md#how-do-i-create-a-folder-for-lessons)
- [How do I move a lesson into a folder](07-courses.md#how-do-i-move-a-lesson-into-a-folder)
- [How do I filter lessons](07-courses.md#how-do-i-filter-lessons)
- [How do I disable a lesson](07-courses.md#how-do-i-disable-a-lesson)
- [How do I delete a lesson or folder](07-courses.md#how-do-i-delete-a-lesson-or-folder)
- [How do I create a pricing plan](07-courses.md#how-do-i-create-a-pricing-plan)
- [How do I edit an existing pricing plan](07-courses.md#how-do-i-edit-an-existing-pricing-plan)
- [How do I disable or delete a pricing plan](07-courses.md#how-do-i-disable-or-delete-a-pricing-plan)
- [How do I change which modules a pricing plan unlocks](07-courses.md#how-do-i-change-which-modules-a-pricing-plan-unlocks)
- [How do I set who can access the course](07-courses.md#how-do-i-set-who-can-access-the-course)
- [How do I send course notifications from a specific sender](07-courses.md#how-do-i-send-course-notifications-from-a-specific-sender)
- [How do I work the reports inbox](07-courses.md#how-do-i-work-the-reports-inbox)
- [How do I change my user profile data](07-courses.md#how-do-i-change-my-user-profile-data)
- [How do I control unlimited plan auto-renewal](07-courses.md#how-do-i-control-unlimited-plan-auto-renewal)

### Affiliates (22)
- [How do I set up an affiliate program for the first time](08-affiliates.md#how-do-i-set-up-an-affiliate-program-for-the-first-time)
- [How do I add a free product partners can promote](08-affiliates.md#how-do-i-add-a-free-product-partners-can-promote)
- [How do I add a paid product to the affiliate program](08-affiliates.md#how-do-i-add-a-paid-product-to-the-affiliate-program)
- [How do I deactivate or delete an affiliate product](08-affiliates.md#how-do-i-deactivate-or-delete-an-affiliate-product)
- [How do I create a banner for partners](08-affiliates.md#how-do-i-create-a-banner-for-partners)
- [How do I create a text advertisement for partners](08-affiliates.md#how-do-i-create-a-text-advertisement-for-partners)
- [How do I create a subscription form for partners](08-affiliates.md#how-do-i-create-a-subscription-form-for-partners)
- [How do I add promotional materials to attract new partners (multi-leveled program)](08-affiliates.md#how-do-i-add-promotional-materials-to-attract-new-partners-multi-leveled-program)
- [How do I set a custom commission for a specific partner](08-affiliates.md#how-do-i-set-a-custom-commission-for-a-specific-partner)
- [How do I delete a per-partner commission](08-affiliates.md#how-do-i-delete-a-per-partner-commission)
- [How do I pay a partner](08-affiliates.md#how-do-i-pay-a-partner)
- [How do I rename a partner](08-affiliates.md#how-do-i-rename-a-partner)
- [How do I see a specific partner's affiliate links](08-affiliates.md#how-do-i-see-a-specific-partner-s-affiliate-links)
- [How do I see overall affiliate performance](08-affiliates.md#how-do-i-see-overall-affiliate-performance)
- [How do I review past payouts across all partners](08-affiliates.md#how-do-i-review-past-payouts-across-all-partners)
- [How do I (as a partner) update my payout details](08-affiliates.md#how-do-i-as-a-partner-update-my-payout-details)
- [How do I (as a partner) change my name](08-affiliates.md#how-do-i-as-a-partner-change-my-name)
- [How do I (as a partner) change my phone number](08-affiliates.md#how-do-i-as-a-partner-change-my-phone-number)
- [How do I (as a partner) change my email](08-affiliates.md#how-do-i-as-a-partner-change-my-email)
- [How do I (as a partner) change my password](08-affiliates.md#how-do-i-as-a-partner-change-my-password)
- [How do I allow / forbid partners from generating their own order buttons or forms for a paid product](08-affiliates.md#how-do-i-allow-forbid-partners-from-generating-their-own-order-buttons-or-forms-for-a-paid-product)
- [How do I deactivate the multi-leveled program registration link](08-affiliates.md#how-do-i-deactivate-the-multi-leveled-program-registration-link)

### Advertise (16)
- [How do I open a specific affiliate program](09-advertise.md#how-do-i-open-a-specific-affiliate-program)
- [How do I pin (or unpin) an affiliate program to my Favorites](09-advertise.md#how-do-i-pin-or-unpin-an-affiliate-program-to-my-favorites)
- [How do I delete an affiliate program from my cabinet](09-advertise.md#how-do-i-delete-an-affiliate-program-from-my-cabinet)
- [How do I get my affiliate link for a product](09-advertise.md#how-do-i-get-my-affiliate-link-for-a-product)
- [How do I add UTM-tags (Ad Tag) to my affiliate link](09-advertise.md#how-do-i-add-utm-tags-ad-tag-to-my-affiliate-link)
- [How do I grab a banner with my affiliate link](09-advertise.md#how-do-i-grab-a-banner-with-my-affiliate-link)
- [How do I grab a pre-written ad text (Advertising Article)](09-advertise.md#how-do-i-grab-a-pre-written-ad-text-advertising-article)
- [How do I generate a subscription form with my partner tag baked in (free product)](09-advertise.md#how-do-i-generate-a-subscription-form-with-my-partner-tag-baked-in-free-product)
- [How do I recruit second-level partners](09-advertise.md#how-do-i-recruit-second-level-partners)
- [How do I view who subscribed via my link](09-advertise.md#how-do-i-view-who-subscribed-via-my-link)
- [How do I view billed orders and commissions](09-advertise.md#how-do-i-view-billed-orders-and-commissions)
- [How do I check referrals and the daily referral graph](09-advertise.md#how-do-i-check-referrals-and-the-daily-referral-graph)
- [How do I see my second-level partners](09-advertise.md#how-do-i-see-my-second-level-partners)
- [How do I see commissions charged and paid out](09-advertise.md#how-do-i-see-commissions-charged-and-paid-out)
- [How do I contact the author of an affiliate program](09-advertise.md#how-do-i-contact-the-author-of-an-affiliate-program)
- [How do I read program instructions from the author](09-advertise.md#how-do-i-read-program-instructions-from-the-author)

### Reports (15)
- [How do I see how much profit my sales made this month](10-reports.md#how-do-i-see-how-much-profit-my-sales-made-this-month)
- [How do I add a UTM-tagged tracking link to an ad](10-reports.md#how-do-i-add-a-utm-tagged-tracking-link-to-an-ad)
- [How do I see whether my advertising is paying off](10-reports.md#how-do-i-see-whether-my-advertising-is-paying-off)
- [How do I import advertising expenses](10-reports.md#how-do-i-import-advertising-expenses)
- [How do I create a new sales funnel](10-reports.md#how-do-i-create-a-new-sales-funnel)
- [How do I edit or delete an existing funnel](10-reports.md#how-do-i-edit-or-delete-an-existing-funnel)
- [How do I pin my most-used funnels to the top](10-reports.md#how-do-i-pin-my-most-used-funnels-to-the-top)
- [How do I see the traffic sources of a funnel](10-reports.md#how-do-i-see-the-traffic-sources-of-a-funnel)
- [How do I run a cohort analysis on a funnel](10-reports.md#how-do-i-run-a-cohort-analysis-on-a-funnel)
- [How do I compare a funnel's performance across values of a custom contact field](10-reports.md#how-do-i-compare-a-funnel-s-performance-across-values-of-a-custom-contact-field)
- [How do I track my subscriber growth and churn](10-reports.md#how-do-i-track-my-subscriber-growth-and-churn)
- [How do I get statistics delivered to my inbox](10-reports.md#how-do-i-get-statistics-delivered-to-my-inbox)
- [How do I see what my sales department is producing](10-reports.md#how-do-i-see-what-my-sales-department-is-producing)
- [How do I pay a manager what they're owed](10-reports.md#how-do-i-pay-a-manager-what-they-re-owed)
- [How do I export a report](10-reports.md#how-do-i-export-a-report)

### API 1.0 (6)
- [How do I add a contact and put them on multiple lists via API](11-api-1-0.md#how-do-i-add-a-contact-and-put-them-on-multiple-lists-via-api)
- [How do I create a paying customer end-to-end](11-api-1-0.md#how-do-i-create-a-paying-customer-end-to-end)
- [How do I look up everything a customer has bought](11-api-1-0.md#how-do-i-look-up-everything-a-customer-has-bought)
- [How do I unsubscribe someone everywhere](11-api-1-0.md#how-do-i-unsubscribe-someone-everywhere)
- [How do I migrate from the deprecated endpoints](11-api-1-0.md#how-do-i-migrate-from-the-deprecated-endpoints)
- [How do I get the partner-ID and ad-tag-ID from an affiliate landing](11-api-1-0.md#how-do-i-get-the-partner-id-and-ad-tag-id-from-an-affiliate-landing)

### API 2.0 (4)
- [How do I add a contact and put them in a group with a tag](12-api-2-0.md#how-do-i-add-a-contact-and-put-them-in-a-group-with-a-tag)
- [How do I create a paid order for an existing contact with a coupon](12-api-2-0.md#how-do-i-create-a-paid-order-for-an-existing-contact-with-a-coupon)
- [How do I move a contact between groups](12-api-2-0.md#how-do-i-move-a-contact-between-groups)
- [How do I tag and untag a contact in one operation](12-api-2-0.md#how-do-i-tag-and-untag-a-contact-in-one-operation)

## Alphabetical

- **How do I (as a partner) change my email** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-as-a-partner-change-my-email)
- **How do I (as a partner) change my name** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-as-a-partner-change-my-name)
- **How do I (as a partner) change my password** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-as-a-partner-change-my-password)
- **How do I (as a partner) change my phone number** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-as-a-partner-change-my-phone-number)
- **How do I (as a partner) update my payout details** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-as-a-partner-update-my-payout-details)
- **How do I A/B test inside a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-a-b-test-inside-a-funnel)
- **How do I activate or deactivate interactive blocks on a page** — Website → [02-website.md](02-website.md#how-do-i-activate-or-deactivate-interactive-blocks-on-a-page)
- **How do I add a Bump Offer to the Payment Page** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-bump-offer-to-the-payment-page)
- **How do I add a condition that splits "Yes" and "No" paths** — Automation → [06-automation.md](06-automation.md#how-do-i-add-a-condition-that-splits-yes-and-no-paths)
- **How do I add a contact and put them in a group with a tag** — API 2.0 → [12-api-2-0.md](12-api-2-0.md#how-do-i-add-a-contact-and-put-them-in-a-group-with-a-tag)
- **How do I add a contact and put them on multiple lists via API** — API 1.0 → [11-api-1-0.md](11-api-1-0.md#how-do-i-add-a-contact-and-put-them-on-multiple-lists-via-api)
- **How do I add a contact to a process manually** — Automation → [06-automation.md](06-automation.md#how-do-i-add-a-contact-to-a-process-manually)
- **How do I add a Countdown page** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-countdown-page)
- **How do I add a course or lesson to a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-course-or-lesson-to-a-funnel)
- **How do I add a custom domain to InfluencerSoft (second-level domain)** — Website → [02-website.md](02-website.md#how-do-i-add-a-custom-domain-to-influencersoft-second-level-domain)
- **How do I add a favicon, custom HEAD code, or copyright text to all pages of a site** — Website → [02-website.md](02-website.md#how-do-i-add-a-favicon-custom-head-code-or-copyright-text-to-all-pages-of-a-site)
- **How do I add a free product partners can promote** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-add-a-free-product-partners-can-promote)
- **How do I add a lesson to a module** — Courses → [07-courses.md](07-courses.md#how-do-i-add-a-lesson-to-a-module)
- **How do I add a module** — Courses → [07-courses.md](07-courses.md#how-do-i-add-a-module)
- **How do I add a new contact manually** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-add-a-new-contact-manually)
- **How do I add a new sender email I can send From** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-add-a-new-sender-email-i-can-send-from)
- **How do I add a non-email action step (add/remove to other groups) to an Email Series** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-add-a-non-email-action-step-add-remove-to-other-groups-to-an-email-series)
- **How do I add a paid product to the affiliate program** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-add-a-paid-product-to-the-affiliate-program)
- **How do I add a sales funnel to a category** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-sales-funnel-to-a-category)
- **How do I add a section or widget to a page in the Page Builder** — Website → [02-website.md](02-website.md#how-do-i-add-a-section-or-widget-to-a-page-in-the-page-builder)
- **How do I add a shared Timer for multiple pages or emails** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-shared-timer-for-multiple-pages-or-emails)
- **How do I add a stage marker (Custom block)** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-stage-marker-custom-block)
- **How do I add a subdomain (third-level) to InfluencerSoft** — Website → [02-website.md](02-website.md#how-do-i-add-a-subdomain-third-level-to-influencersoft)
- **How do I add a subscription, order, or payment form to a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-subscription-order-or-payment-form-to-a-funnel)
- **How do I add a tag to a course** — Courses → [07-courses.md](07-courses.md#how-do-i-add-a-tag-to-a-course)
- **How do I add a traffic source to a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-a-traffic-source-to-a-funnel)
- **How do I add a UTM-tagged tracking link to an ad** — Reports → [10-reports.md](10-reports.md#how-do-i-add-a-utm-tagged-tracking-link-to-an-ad)
- **How do I add an element to a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-add-an-element-to-a-funnel)
- **How do I add contacts to a list** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-add-contacts-to-a-list)
- **How do I add or edit a co-author** — Store → [03-store.md](03-store.md#how-do-i-add-or-edit-a-co-author)
- **How do I add or edit DNS records on a linked second-level domain** — Website → [02-website.md](02-website.md#how-do-i-add-or-edit-dns-records-on-a-linked-second-level-domain)
- **How do I add or edit Store-wide settings** — Store → [03-store.md](03-store.md#how-do-i-add-or-edit-store-wide-settings)
- **How do I add promotional materials to attract new partners (multi-leveled program)** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-add-promotional-materials-to-attract-new-partners-multi-leveled-program)
- **How do I add UTM-tags (Ad Tag) to my affiliate link** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-add-utm-tags-ad-tag-to-my-affiliate-link)
- **How do I allow / forbid partners from generating their own order buttons or forms for a paid product** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-allow-forbid-partners-from-generating-their-own-order-buttons-or-forms-for-a-paid-product)
- **How do I assign a home task to a student** — Courses → [07-courses.md](07-courses.md#how-do-i-assign-a-home-task-to-a-student)
- **How do I assign or change the manager responsible for an order or a client** — Store → [03-store.md](03-store.md#how-do-i-assign-or-change-the-manager-responsible-for-an-order-or-a-client)
- **How do I block cookies until visitors consent (GDPR)** — Website → [02-website.md](02-website.md#how-do-i-block-cookies-until-visitors-consent-gdpr)
- **How do I branch a funnel by lead attributes (Filter)** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-branch-a-funnel-by-lead-attributes-filter)
- **How do I build a message in Message Constructor** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-build-a-message-in-message-constructor)
- **How do I build a subscription form** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-build-a-subscription-form)
- **How do I bulk-edit contacts** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-bulk-edit-contacts)
- **How do I bulk-move subscribers between groups** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-bulk-move-subscribers-between-groups)
- **How do I bulk-unsubscribe people** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-bulk-unsubscribe-people)
- **How do I change my user profile data** — Courses → [07-courses.md](07-courses.md#how-do-i-change-my-user-profile-data)
- **How do I change the default sender** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-change-the-default-sender)
- **How do I change the indents differently for desktop and mobile in a text widget** — Website → [02-website.md](02-website.md#how-do-i-change-the-indents-differently-for-desktop-and-mobile-in-a-text-widget)
- **How do I change the look of an item** — Website → [02-website.md](02-website.md#how-do-i-change-the-look-of-an-item)
- **How do I change which modules a pricing plan unlocks** — Courses → [07-courses.md](07-courses.md#how-do-i-change-which-modules-a-pricing-plan-unlocks)
- **How do I check referrals and the daily referral graph** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-check-referrals-and-the-daily-referral-graph)
- **How do I compare a funnel's performance across values of a custom contact field** — Reports → [10-reports.md](10-reports.md#how-do-i-compare-a-funnel-s-performance-across-values-of-a-custom-contact-field)
- **How do I configure a Content, Activation, or Webinar page from inside a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-configure-a-content-activation-or-webinar-page-from-inside-a-funnel)
- **How do I configure a trigger so the process advances even if the event never happens** — Automation → [06-automation.md](06-automation.md#how-do-i-configure-a-trigger-so-the-process-advances-even-if-the-event-never-happens)
- **How do I configure an Opt-in or Double opt-in page** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-configure-an-opt-in-or-double-opt-in-page)
- **How do I configure an upsell** — Store → [03-store.md](03-store.md#how-do-i-configure-an-upsell)
- **How do I configure Google invisible reCAPTCHA** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-configure-google-invisible-recaptcha)
- **How do I configure page-wide site options (fonts, background, image compression, header code, SEO, social image)** — Website → [02-website.md](02-website.md#how-do-i-configure-page-wide-site-options-fonts-background-image-compression-header-code-seo-social-image)
- **How do I configure PayPal** — Store → [03-store.md](03-store.md#how-do-i-configure-paypal)
- **How do I configure the viral promotion's registration form** — Website → [02-website.md](02-website.md#how-do-i-configure-the-viral-promotion-s-registration-form)
- **How do I connect Zoom** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-connect-zoom)
- **How do I contact the author of an affiliate program** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-contact-the-author-of-an-affiliate-program)
- **How do I control how many times a process runs for the same contact** — Automation → [06-automation.md](06-automation.md#how-do-i-control-how-many-times-a-process-runs-for-the-same-contact)
- **How do I control unlimited plan auto-renewal** — Courses → [07-courses.md](07-courses.md#how-do-i-control-unlimited-plan-auto-renewal)
- **How do I copy a sales funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-copy-a-sales-funnel)
- **How do I create a banner for partners** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-create-a-banner-for-partners)
- **How do I create a call assignment** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-a-call-assignment)
- **How do I create a category** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-a-category)
- **How do I create a course in the Web Page Designer Tool** — Courses → [07-courses.md](07-courses.md#how-do-i-create-a-course-in-the-web-page-designer-tool)
- **How do I create a discount coupon** — Store → [03-store.md](03-store.md#how-do-i-create-a-discount-coupon)
- **How do I create a folder for lessons** — Courses → [07-courses.md](07-courses.md#how-do-i-create-a-folder-for-lessons)
- **How do I create a G Suite account so I can use a domain-based sender** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-create-a-g-suite-account-so-i-can-use-a-domain-based-sender)
- **How do I create a group of inactive contacts** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-a-group-of-inactive-contacts)
- **How do I create a new category** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-create-a-new-category)
- **How do I create a new course or membership** — Courses → [07-courses.md](07-courses.md#how-do-i-create-a-new-course-or-membership)
- **How do I create a new Process** — Automation → [06-automation.md](06-automation.md#how-do-i-create-a-new-process)
- **How do I create a new product** — Store → [03-store.md](03-store.md#how-do-i-create-a-new-product)
- **How do I create a new Rule** — Automation → [06-automation.md](06-automation.md#how-do-i-create-a-new-rule)
- **How do I create a new sales funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-create-a-new-sales-funnel)
- **How do I create a new sales funnel** — Reports → [10-reports.md](10-reports.md#how-do-i-create-a-new-sales-funnel)
- **How do I create a new website page** — Website → [02-website.md](02-website.md#how-do-i-create-a-new-website-page)
- **How do I create a normal contact list** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-a-normal-contact-list)
- **How do I create a one-time email to all subscribers on a list** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-create-a-one-time-email-to-all-subscribers-on-a-list)
- **How do I create a paid order for an existing contact with a coupon** — API 2.0 → [12-api-2-0.md](12-api-2-0.md#how-do-i-create-a-paid-order-for-an-existing-contact-with-a-coupon)
- **How do I create a paying customer end-to-end** — API 1.0 → [11-api-1-0.md](11-api-1-0.md#how-do-i-create-a-paying-customer-end-to-end)
- **How do I create a pricing plan** — Courses → [07-courses.md](07-courses.md#how-do-i-create-a-pricing-plan)
- **How do I create a product category** — Store → [03-store.md](03-store.md#how-do-i-create-a-product-category)
- **How do I create a Sequence (visual automation)** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-create-a-sequence-visual-automation)
- **How do I create a subscription form for partners** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-create-a-subscription-form-for-partners)
- **How do I create a survey** — Website → [02-website.md](02-website.md#how-do-i-create-a-survey)
- **How do I create a Task automatically inside a Process** — Automation → [06-automation.md](06-automation.md#how-do-i-create-a-task-automatically-inside-a-process)
- **How do I create a Task manually** — Automation → [06-automation.md](06-automation.md#how-do-i-create-a-task-manually)
- **How do I create a Team and how are tasks distributed** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-a-team-and-how-are-tasks-distributed)
- **How do I create a text advertisement for partners** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-create-a-text-advertisement-for-partners)
- **How do I create a user** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-a-user)
- **How do I create a viral promotion** — Website → [02-website.md](02-website.md#how-do-i-create-a-viral-promotion)
- **How do I create a Zoom meeting** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-a-zoom-meeting)
- **How do I create an additional lead field** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-an-additional-lead-field)
- **How do I create an auto-list** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-create-an-auto-list)
- **How do I create an auto-webinar** — Website → [02-website.md](02-website.md#how-do-i-create-an-auto-webinar)
- **How do I create an order on behalf of a customer (from a phone call)** — Store → [03-store.md](03-store.md#how-do-i-create-an-order-on-behalf-of-a-customer-from-a-phone-call)
- **How do I create or edit an auto-series email** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-create-or-edit-an-auto-series-email)
- **How do I customize columns in the Orders table** — Store → [03-store.md](03-store.md#how-do-i-customize-columns-in-the-orders-table)
- **How do I deactivate or delete a call task** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-deactivate-or-delete-a-call-task)
- **How do I deactivate or delete a survey** — Website → [02-website.md](02-website.md#how-do-i-deactivate-or-delete-a-survey)
- **How do I deactivate or delete a user** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-deactivate-or-delete-a-user)
- **How do I deactivate or delete an affiliate product** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-deactivate-or-delete-an-affiliate-product)
- **How do I deactivate the multi-leveled program registration link** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-deactivate-the-multi-leveled-program-registration-link)
- **How do I decide whether I also need external hosting** — Website → [02-website.md](02-website.md#how-do-i-decide-whether-i-also-need-external-hosting)
- **How do I delete a lesson or folder** — Courses → [07-courses.md](07-courses.md#how-do-i-delete-a-lesson-or-folder)
- **How do I delete a page** — Website → [02-website.md](02-website.md#how-do-i-delete-a-page)
- **How do I delete a per-partner commission** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-delete-a-per-partner-commission)
- **How do I delete a process** — Automation → [06-automation.md](06-automation.md#how-do-i-delete-a-process)
- **How do I delete a Rule** — Automation → [06-automation.md](06-automation.md#how-do-i-delete-a-rule)
- **How do I delete a sales funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-delete-a-sales-funnel)
- **How do I delete a Sequence** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-delete-a-sequence)
- **How do I delete a Task** — Automation → [06-automation.md](06-automation.md#how-do-i-delete-a-task)
- **How do I delete an affiliate program from my cabinet** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-delete-an-affiliate-program-from-my-cabinet)
- **How do I delete one event from an Email Series** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-delete-one-event-from-an-email-series)
- **How do I delete or edit a discount** — Store → [03-store.md](03-store.md#how-do-i-delete-or-edit-a-discount)
- **How do I disable a lesson** — Courses → [07-courses.md](07-courses.md#how-do-i-disable-a-lesson)
- **How do I disable a process** — Automation → [06-automation.md](06-automation.md#how-do-i-disable-a-process)
- **How do I disable a Rule** — Automation → [06-automation.md](06-automation.md#how-do-i-disable-a-rule)
- **How do I disable a Sequence without deleting it** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-disable-a-sequence-without-deleting-it)
- **How do I disable an auto-series for a list** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-disable-an-auto-series-for-a-list)
- **How do I disable or delete a pricing plan** — Courses → [07-courses.md](07-courses.md#how-do-i-disable-or-delete-a-pricing-plan)
- **How do I disconnect Zoom** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-disconnect-zoom)
- **How do I duplicate a course** — Courses → [07-courses.md](07-courses.md#how-do-i-duplicate-a-course)
- **How do I edit a meeting request after a user books** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-edit-a-meeting-request-after-a-user-books)
- **How do I edit a running process** — Automation → [06-automation.md](06-automation.md#how-do-i-edit-a-running-process)
- **How do I edit an existing category** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-edit-an-existing-category)
- **How do I edit an existing page** — Website → [02-website.md](02-website.md#how-do-i-edit-an-existing-page)
- **How do I edit an existing pricing plan** — Courses → [07-courses.md](07-courses.md#how-do-i-edit-an-existing-pricing-plan)
- **How do I edit an existing Rule** — Automation → [06-automation.md](06-automation.md#how-do-i-edit-an-existing-rule)
- **How do I edit an existing sales funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-edit-an-existing-sales-funnel)
- **How do I edit or delete a product** — Store → [03-store.md](03-store.md#how-do-i-edit-or-delete-a-product)
- **How do I edit or delete a saved custom template** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-edit-or-delete-a-saved-custom-template)
- **How do I edit or delete an existing funnel** — Reports → [10-reports.md](10-reports.md#how-do-i-edit-or-delete-an-existing-funnel)
- **How do I edit or reassign a Task** — Automation → [06-automation.md](06-automation.md#how-do-i-edit-or-reassign-a-task)
- **How do I edit, deactivate, or delete an existing auto-webinar** — Website → [02-website.md](02-website.md#how-do-i-edit-deactivate-or-delete-an-existing-auto-webinar)
- **How do I email people who clicked (or didn't click, or opened, or didn't open) a previous email** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-email-people-who-clicked-or-didn-t-click-or-opened-or-didn-t-open-a-previous-email)
- **How do I embed a Process inside a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-embed-a-process-inside-a-funnel)
- **How do I enable or disable a sales funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-enable-or-disable-a-sales-funnel)
- **How do I export a report** — Reports → [10-reports.md](10-reports.md#how-do-i-export-a-report)
- **How do I export contacts** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-export-contacts)
- **How do I export contacts a Rule acted on** — Automation → [06-automation.md](06-automation.md#how-do-i-export-contacts-a-rule-acted-on)
- **How do I export orders** — Store → [03-store.md](03-store.md#how-do-i-export-orders)
- **How do I export the current subscriber list** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-export-the-current-subscriber-list)
- **How do I export the subscribers who reacted (or didn't) to a specific broadcast** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-export-the-subscribers-who-reacted-or-didn-t-to-a-specific-broadcast)
- **How do I filter lessons** — Courses → [07-courses.md](07-courses.md#how-do-i-filter-lessons)
- **How do I filter the Broadcasts list** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-filter-the-broadcasts-list)
- **How do I filter the Categories list** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-filter-the-categories-list)
- **How do I filter the orders list** — Store → [03-store.md](03-store.md#how-do-i-filter-the-orders-list)
- **How do I filter the Tasks list** — Automation → [06-automation.md](06-automation.md#how-do-i-filter-the-tasks-list)
- **How do I find a specific contact's executed actions** — Automation → [06-automation.md](06-automation.md#how-do-i-find-a-specific-contact-s-executed-actions)
- **How do I find and act on subscribers** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-find-and-act-on-subscribers)
- **How do I gate a lesson by date or completion of a previous lesson** — Courses → [07-courses.md](07-courses.md#how-do-i-gate-a-lesson-by-date-or-completion-of-a-previous-lesson)
- **How do I gate a module by contact list** — Courses → [07-courses.md](07-courses.md#how-do-i-gate-a-module-by-contact-list)
- **How do I generate a subscription form with my partner tag baked in (free product)** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-generate-a-subscription-form-with-my-partner-tag-baked-in-free-product)
- **How do I get a Dedicated IP** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-get-a-dedicated-ip)
- **How do I get my affiliate link for a product** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-get-my-affiliate-link-for-a-product)
- **How do I get statistics delivered to my inbox** — Reports → [10-reports.md](10-reports.md#how-do-i-get-statistics-delivered-to-my-inbox)
- **How do I get the partner-ID and ad-tag-ID from an affiliate landing** — API 1.0 → [11-api-1-0.md](11-api-1-0.md#how-do-i-get-the-partner-id-and-ad-tag-id-from-an-affiliate-landing)
- **How do I grab a banner with my affiliate link** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-grab-a-banner-with-my-affiliate-link)
- **How do I grab a pre-written ad text (Advertising Article)** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-grab-a-pre-written-ad-text-advertising-article)
- **How do I grant another admin access to a site or a page** — Website → [02-website.md](02-website.md#how-do-i-grant-another-admin-access-to-a-site-or-a-page)
- **How do I import advertising expenses** — Reports → [10-reports.md](10-reports.md#how-do-i-import-advertising-expenses)
- **How do I import contacts from a CSV file** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-import-contacts-from-a-csv-file)
- **How do I import contacts via Text Import** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-import-contacts-via-text-import)
- **How do I integrate Facebook Messenger and build a chatbot** — Store → [03-store.md](03-store.md#how-do-i-integrate-facebook-messenger-and-build-a-chatbot)
- **How do I integrate Google Analytics with the e-commerce module** — Website → [02-website.md](02-website.md#how-do-i-integrate-google-analytics-with-the-e-commerce-module)
- **How do I keep my mailings out of spam in the first place** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-keep-my-mailings-out-of-spam-in-the-first-place)
- **How do I let an employee edit email templates** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-let-an-employee-edit-email-templates)
- **How do I let users book a meeting through a funnel** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-let-users-book-a-meeting-through-a-funnel)
- **How do I link two funnel elements** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-link-two-funnel-elements)
- **How do I look up everything a customer has bought** — API 1.0 → [11-api-1-0.md](11-api-1-0.md#how-do-i-look-up-everything-a-customer-has-bought)
- **How do I make a broadcast page for a webinar in 5 minutes** — Website → [02-website.md](02-website.md#how-do-i-make-a-broadcast-page-for-a-webinar-in-5-minutes)
- **How do I make a button on a page send the user to the funnel's next page** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-make-a-button-on-a-page-send-the-user-to-the-funnel-s-next-page)
- **How do I make a page nested under another** — Website → [02-website.md](02-website.md#how-do-i-make-a-page-nested-under-another)
- **How do I make a process branch** — Automation → [06-automation.md](06-automation.md#how-do-i-make-a-process-branch)
- **How do I make an order button I can embed on a page** — Store → [03-store.md](03-store.md#how-do-i-make-an-order-button-i-can-embed-on-a-page)
- **How do I make my store pages open on my own domain** — Website → [02-website.md](02-website.md#how-do-i-make-my-store-pages-open-on-my-own-domain)
- **How do I make sure a key auto-series email is not interrupted by my broadcasts** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-make-sure-a-key-auto-series-email-is-not-interrupted-by-my-broadcasts)
- **How do I manage Task types** — Automation → [06-automation.md](06-automation.md#how-do-i-manage-task-types)
- **How do I migrate from the deprecated endpoints** — API 1.0 → [11-api-1-0.md](11-api-1-0.md#how-do-i-migrate-from-the-deprecated-endpoints)
- **How do I move a contact between groups** — API 2.0 → [12-api-2-0.md](12-api-2-0.md#how-do-i-move-a-contact-between-groups)
- **How do I move a lesson into a folder** — Courses → [07-courses.md](07-courses.md#how-do-i-move-a-lesson-into-a-folder)
- **How do I move a section or widget** — Website → [02-website.md](02-website.md#how-do-i-move-a-section-or-widget)
- **How do I move contacts from the Done log to a group** — Automation → [06-automation.md](06-automation.md#how-do-i-move-contacts-from-the-done-log-to-a-group)
- **How do I open a specific affiliate program** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-open-a-specific-affiliate-program)
- **How do I open detailed analytics for one auto-series email** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-open-detailed-analytics-for-one-auto-series-email)
- **How do I paste a custom landing page (HTML/CSS/JS) into InfluencerSoft** — Website → [02-website.md](02-website.md#how-do-i-paste-a-custom-landing-page-html-css-js-into-influencersoft)
- **How do I pay a manager what they're owed** — Reports → [10-reports.md](10-reports.md#how-do-i-pay-a-manager-what-they-re-owed)
- **How do I pay a partner** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-pay-a-partner)
- **How do I pin (or unpin) an affiliate program to my Favorites** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-pin-or-unpin-an-affiliate-program-to-my-favorites)
- **How do I pin my most-used funnels to the top** — Reports → [10-reports.md](10-reports.md#how-do-i-pin-my-most-used-funnels-to-the-top)
- **How do I place pages on a newly attached domain** — Website → [02-website.md](02-website.md#how-do-i-place-pages-on-a-newly-attached-domain)
- **How do I read program instructions from the author** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-read-program-instructions-from-the-author)
- **How do I recruit second-level partners** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-recruit-second-level-partners)
- **How do I remove a category** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-remove-a-category)
- **How do I remove a lesson from a module** — Courses → [07-courses.md](07-courses.md#how-do-i-remove-a-lesson-from-a-module)
- **How do I remove a user from a team** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-remove-a-user-from-a-team)
- **How do I remove contacts from a list** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-remove-contacts-from-a-list)
- **How do I rename a partner** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-rename-a-partner)
- **How do I rename a process** — Automation → [06-automation.md](06-automation.md#how-do-i-rename-a-process)
- **How do I rename a sales funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-rename-a-sales-funnel)
- **How do I rename, edit, or delete a category** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-rename-edit-or-delete-a-category)
- **How do I resend the "Thank you for your purchase" email after manual payment** — Store → [03-store.md](03-store.md#how-do-i-resend-the-thank-you-for-your-purchase-email-after-manual-payment)
- **How do I restrict a user's per-field access on contacts** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-restrict-a-user-s-per-field-access-on-contacts)
- **How do I resume a paused broadcast** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-resume-a-paused-broadcast)
- **How do I review and manage a specific order** — Store → [03-store.md](03-store.md#how-do-i-review-and-manage-a-specific-order)
- **How do I review past payouts across all partners** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-review-past-payouts-across-all-partners)
- **How do I review survey results and segment respondents** — Website → [02-website.md](02-website.md#how-do-i-review-survey-results-and-segment-respondents)
- **How do I review what a Rule has done** — Automation → [06-automation.md](06-automation.md#how-do-i-review-what-a-rule-has-done)
- **How do I run a cohort analysis on a funnel** — Reports → [10-reports.md](10-reports.md#how-do-i-run-a-cohort-analysis-on-a-funnel)
- **How do I schedule an action on specific days and times** — Automation → [06-automation.md](06-automation.md#how-do-i-schedule-an-action-on-specific-days-and-times)
- **How do I search for and open a Lead Card** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-search-for-and-open-a-lead-card)
- **How do I see a specific partner's affiliate links** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-see-a-specific-partner-s-affiliate-links)
- **How do I see and export viral promotion statistics** — Website → [02-website.md](02-website.md#how-do-i-see-and-export-viral-promotion-statistics)
- **How do I see commissions charged and paid out** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-see-commissions-charged-and-paid-out)
- **How do I see how much profit my sales made this month** — Reports → [10-reports.md](10-reports.md#how-do-i-see-how-much-profit-my-sales-made-this-month)
- **How do I see my second-level partners** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-see-my-second-level-partners)
- **How do I see overall affiliate performance** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-see-overall-affiliate-performance)
- **How do I see the traffic sources of a funnel** — Reports → [10-reports.md](10-reports.md#how-do-i-see-the-traffic-sources-of-a-funnel)
- **How do I see user activity (Click History)** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-see-user-activity-click-history)
- **How do I see what my sales department is producing** — Reports → [10-reports.md](10-reports.md#how-do-i-see-what-my-sales-department-is-producing)
- **How do I see whether my advertising is paying off** — Reports → [10-reports.md](10-reports.md#how-do-i-see-whether-my-advertising-is-paying-off)
- **How do I sell with PayPal (Order page)** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-sell-with-paypal-order-page)
- **How do I sell with Stripe (Payment Page)** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-sell-with-stripe-payment-page)
- **How do I send an email from inside a funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-send-an-email-from-inside-a-funnel)
- **How do I send an email from inside a process** — Automation → [06-automation.md](06-automation.md#how-do-i-send-an-email-from-inside-a-process)
- **How do I send course notifications from a specific sender** — Courses → [07-courses.md](07-courses.md#how-do-i-send-course-notifications-from-a-specific-sender)
- **How do I set a countdown timer on a page** — Website → [02-website.md](02-website.md#how-do-i-set-a-countdown-timer-on-a-page)
- **How do I set a custom commission for a specific partner** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-set-a-custom-commission-for-a-specific-partner)
- **How do I set up A/B (split) testing on a page** — Website → [02-website.md](02-website.md#how-do-i-set-up-a-b-split-testing-on-a-page)
- **How do I set up an A/B test inside a process** — Automation → [06-automation.md](06-automation.md#how-do-i-set-up-an-a-b-test-inside-a-process)
- **How do I set up an affiliate program for the first time** — Affiliates → [08-affiliates.md](08-affiliates.md#how-do-i-set-up-an-affiliate-program-for-the-first-time)
- **How do I set up an Upsell page** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-set-up-an-upsell-page)
- **How do I set up automatic payment-reminder emails for unpaid orders** — Store → [03-store.md](03-store.md#how-do-i-set-up-automatic-payment-reminder-emails-for-unpaid-orders)
- **How do I set up FBL for my domain** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-set-up-fbl-for-my-domain)
- **How do I set up SPF and DMARC** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-set-up-spf-and-dmarc)
- **How do I set up the DKIM signature for my domain** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-set-up-the-dkim-signature-for-my-domain)
- **How do I set who can access the course** — Courses → [07-courses.md](07-courses.md#how-do-i-set-who-can-access-the-course)
- **How do I share a sales funnel** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-share-a-sales-funnel)
- **How do I share revenue on a product with a co-author** — Store → [03-store.md](03-store.md#how-do-i-share-revenue-on-a-product-with-a-co-author)
- **How do I switch to my own SMTP server for outgoing mail** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-switch-to-my-own-smtp-server-for-outgoing-mail)
- **How do I tag and untag a contact in one operation** — API 2.0 → [12-api-2-0.md](12-api-2-0.md#how-do-i-tag-and-untag-a-contact-in-one-operation)
- **How do I temporarily disable a page** — Website → [02-website.md](02-website.md#how-do-i-temporarily-disable-a-page)
- **How do I test an auto-series for a list** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-test-an-auto-series-for-a-list)
- **How do I track form sources with tags** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-track-form-sources-with-tags)
- **How do I track my subscriber growth and churn** — Reports → [10-reports.md](10-reports.md#how-do-i-track-my-subscriber-growth-and-churn)
- **How do I turn off image compression for a page** — Website → [02-website.md](02-website.md#how-do-i-turn-off-image-compression-for-a-page)
- **How do I unsubscribe someone everywhere** — API 1.0 → [11-api-1-0.md](11-api-1-0.md#how-do-i-unsubscribe-someone-everywhere)
- **How do I upload, organise, or delete files in the File Manager** — Website → [02-website.md](02-website.md#how-do-i-upload-organise-or-delete-files-in-the-file-manager)
- **How do I use the pre-send spam test** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-use-the-pre-send-spam-test)
- **How do I view billed orders and commissions** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-view-billed-orders-and-commissions)
- **How do I view detailed analytics for one broadcast** — Campaigns → [05-campaigns.md](05-campaigns.md#how-do-i-view-detailed-analytics-for-one-broadcast)
- **How do I view payments and statistics for co-authors** — Store → [03-store.md](03-store.md#how-do-i-view-payments-and-statistics-for-co-authors)
- **How do I view per-task call results** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-view-per-task-call-results)
- **How do I view process statistics inside the editor** — Automation → [06-automation.md](06-automation.md#how-do-i-view-process-statistics-inside-the-editor)
- **How do I view statistics, add notes, undo, or redo in the editor** — Funnels → [01-funnels.md](01-funnels.md#how-do-i-view-statistics-add-notes-undo-or-redo-in-the-editor)
- **How do I view the activation history of a contact** — Contacts → [04-contacts.md](04-contacts.md#how-do-i-view-the-activation-history-of-a-contact)
- **How do I view who subscribed via my link** — Advertise → [09-advertise.md](09-advertise.md#how-do-i-view-who-subscribed-via-my-link)
- **How do I work the reports inbox** — Courses → [07-courses.md](07-courses.md#how-do-i-work-the-reports-inbox)


---


# Field Index

Every field documented across UI chapters, sorted alphabetically. 864 field-occurrences across 206 screens.

| Field | Type | Chapter | Screen |
|-------|------|---------|--------|
| "Thank you for your purchase" Email | WYSIWYG | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| "Thank you for your purchase" page | URL (assumed) | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| `…` (three dots) in Pages column | link | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| `…` folder row in subfolders | link | Website | [File Manager](02-website.md#screen-file-manager) |
| +Copy | button | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| 0-step period from / to | date range | Reports | [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list) |
| 3D shadow | toggle | Advertise | [Subscription Form Generator — Block Type](09-advertise.md#screen-subscription-form-generator-block-type) |
| A/B button | button | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Accepted | number | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| Accepted reports count | counter | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Access rights | dropdown | Contacts | [Users (Creating and Managing Users)](04-contacts.md#screen-users-creating-and-managing-users) |
| Access rights | radio | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Account email | display (read-only) | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |
| Action | read-only | Automation | [Rule "Done" log](06-automation.md#screen-rule-done-log) |
| Action criteria | dropdown | Campaigns | [Broadcasts list (Campaigns → Broadcasts)](05-campaigns.md#screen-broadcasts-list-campaigns-broadcasts) |
| Action name | text | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Action type | radio | Website | [Promotion — Additional information tab](02-website.md#screen-promotion-additional-information-tab) |
| Action type | dropdown | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Action type | dropdown | Automation | [Rule editor](06-automation.md#screen-rule-editor) |
| Actions | radio | Contacts | [Subscription Form Constructor](04-contacts.md#screen-subscription-form-constructor) |
| Activation handling | radio | Contacts | [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import) |
| Activation letter text | WYSIWYG | Contacts | [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal) |
| Active / Inactive | radio button | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Activity | dropdown | Contacts | [Calling Tasks (Calls index)](04-contacts.md#screen-calling-tasks-calls-index) |
| Activity | checklist | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Activity parameter | dropdown / radio | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Ad | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Ad | dropdown / text | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Ad | text | Advertise | [New Campaign (UTM-tag builder)](09-advertise.md#screen-new-campaign-utm-tag-builder) |
| Ad | text | Reports | [New Campaign (UTM-tag builder)](10-reports.md#screen-new-campaign-utm-tag-builder) |
| Add | button | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Add a description to the page | button | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Add a discount (button) | action | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Add Banner | button | Affiliates | [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list) |
| Add Buyer to Groups/lists | checkboxes | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Add contacts only with phone numbers | checkbox | Contacts | [Add / Edit Call Assignment](04-contacts.md#screen-add-edit-call-assignment) |
| Add EU standard VAT rates | button | Store | [Store Settings](03-store.md#screen-store-settings) |
| Add every N minutes | button + numeric | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Add exact time | button + time input | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Add HEAD code (alias) | code | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Add Material Link | text / URL | Affiliates | [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program) |
| Add option button | action | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Add option button | action | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Add option button | action | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Add sales tax | button | Store | [Store Settings](03-store.md#screen-store-settings) |
| Add Text | button | Affiliates | [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list) |
| Add to group(s) | category/group tree with check-boxes | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| Add to Groups | checkbox list (groups) | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Add to groups | tree-picker | Contacts | [Subscription Form Constructor](04-contacts.md#screen-subscription-form-constructor) |
| Add to list | dropdown / list picker | Website | [Survey — Main settings tab (Create / Edit Survey)](02-website.md#screen-survey-main-settings-tab-create-edit-survey) |
| Add to List | Adds respondents with a specific answer to a contact group | Website | [Survey statistics](02-website.md#screen-survey-statistics) |
| Add variant | button | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Additional administrators | multi-select dropdown | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Additional code in header | code field | Website | [Site Settings (Page Builder gear / "Site settings" menu)](02-website.md#screen-site-settings-page-builder-gear-site-settings-menu) |
| Additional condition | configurable | Automation | [Add trigger (Process)](06-automation.md#screen-add-trigger-process) |
| Additional condition | configurable | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Additional condition | configurable | Automation | [Send email action (Process)](06-automation.md#screen-send-email-action-process) |
| Additional condition | configurable | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| Additional instructions | WYSIWYG | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Address for testing messages | text (email) | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| Address of the advertised page | text (URL) | Reports | [New Campaign (UTM-tag builder)](10-reports.md#screen-new-campaign-utm-tag-builder) |
| Address of the page that was opened | text | Contacts | [Click History (Activities)](04-contacts.md#screen-click-history-activities) |
| Advanced settings (revealed via "Show advanced settings") | mixed | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| Advertising (sub-menu) | mixed | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Advertising campaign | text | Advertise | [New Campaign (UTM-tag builder)](09-advertise.md#screen-new-campaign-utm-tag-builder) |
| Advertising channel | filter | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Advertising company | dropdown / text | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Advertising Drafts (count) | numeric link | Advertise | [Offers](09-advertise.md#screen-offers) |
| Advertising tab — Channel | filter | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Advertising tab — Channel | filter | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Advertising tab — Channel / Source / Campaign / Ad / Keys | filter | Reports | [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list) |
| Advertising tab — Channel / Source / Campaign / Advertisement / Keys | filter | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Advertising tags | UTM-style tags | Contacts | [Subscription Form Constructor](04-contacts.md#screen-subscription-form-constructor) |
| Affiliate name | text | Advertise | [Partner's Cabinet — Filters](09-advertise.md#screen-partner-s-cabinet-filters) |
| Affiliate's Form/Button Generator | toggle | Affiliates | [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list) |
| After timer expires | section | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| After-sales | indicator | Store | [Products list](03-store.md#screen-products-list) |
| Allow partial payment | checkbox | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Allow partner's UTM-tags in URL after activation | checkbox (assumed) | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| Allow visitors to comment | checkbox | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Allowed to leads in lists | list multi-select | Courses | [Module settings (cogwheel modal)](07-courses.md#screen-module-settings-cogwheel-modal) |
| Allowed to leads in lists | list multi-select | Courses | [Course settings — "Access" tab](07-courses.md#screen-course-settings-access-tab) |
| Already paid | Customer already paid, suppress further calls | Store | [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no) |
| Amount and Validity Period — Amount | number | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Amount and Validity Period — Icon | toggle | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Amount and Validity Period — Validity dates | date range | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Amount of partner commissions earned | metric | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Amount of partner commissions to be paid | metric | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Answer | radio | Website | [Survey — Actions tab](02-website.md#screen-survey-actions-tab) |
| Answer table | Per-answer counts/percentages under the pie chart | Website | [Survey statistics](02-website.md#screen-survey-statistics) |
| Article Text | rich text | Affiliates | [Drafts for Partners. Adding and Editing an Advertising Text](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-an-advertising-text) |
| Article text (explanatory) | text | Affiliates | [Drafts for Partners. Adding and Editing an Advertising Text](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-an-advertising-text) |
| At intervals X days | number | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| At the moment user account enabled | slider | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Attaching invoices with this coupon to the partner | text (partner login) + pop-up suggestion | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Attribution mode | option set | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Auto payments (sub-menu) | toggle | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Auto-accept rules | rule editor | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Auto-cleaning subscribers who have not read 15 emails in 45 days | checkbox | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| Automated series | checkbox | Contacts | [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list) |
| Automatic comments | Upload names and pre-written comments in chronological order | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Automatic payments sum | number | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Automatic payments will begin in X days after first payment | number | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Automatically add a vCard contact to the emails | checkbox | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| Automatically assign contacts to the personal manager | checkbox | Contacts | [Add / Edit Call Assignment](04-contacts.md#screen-add-edit-call-assignment) |
| Automatically assign new call task to personal manager | checkbox | Store | [Store Settings](03-store.md#screen-store-settings) |
| Autopayments will begin in XX days after payment of the order | number (days) | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Background | image / color picker | Website | [Site Settings (Page Builder gear / "Site settings" menu)](02-website.md#screen-site-settings-page-builder-gear-site-settings-menu) |
| Bank account details | text | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |
| Bank details | text (assumed) | Store | [Adding and Editing a Co-Author](03-store.md#screen-adding-and-editing-a-co-author) |
| Banner Description | text | Affiliates | [Drafts for Partners. Adding and Editing an Advertising Banner](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-an-advertising-banner) |
| Bar-chart button | Opens viral promotion statistics | Website | [Promotions list (Website → Promotions)](02-website.md#screen-promotions-list-website-promotions) |
| Bar-chart button | Opens survey statistics | Website | [Surveys list (Website → Surveys)](02-website.md#screen-surveys-list-website-surveys) |
| Beginning of period | date (calendar) | Advertise | [Payments](09-advertise.md#screen-payments) |
| Billing address 1 | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Billing address 2 | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Billing city | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Billing country | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Billing state | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Billing zip | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Block name | text | Automation | [Send email action (Process)](06-automation.md#screen-send-email-action-process) |
| Body | WYSIWYG | Store | [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter) |
| Branch contents | sub-step per variant | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| Bulk action selector | dropdown | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Button color | selector | Advertise | [Subscription Form Generator — Button View](09-advertise.md#screen-subscription-form-generator-button-view) |
| Button name | text | Advertise | [Subscription Form Generator — Button View](09-advertise.md#screen-subscription-form-generator-button-view) |
| Button style | radio | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Calculate interval analysis | checkbox | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Call back | Customer asked for a later call | Store | [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no) |
| Campaign | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Campaign | text | Reports | [New Campaign (UTM-tag builder)](10-reports.md#screen-new-campaign-utm-tag-builder) |
| Captcha | text | Advertise | [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Category | text | Store | [Products list](03-store.md#screen-products-list) |
| Category | dropdown / folder navigation | Store | [Products list](03-store.md#screen-products-list) |
| Category | dropdown | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Category | dropdown | Contacts | [Contact Lists](04-contacts.md#screen-contact-lists) |
| Category | dropdown | Contacts | [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal) |
| Category | dropdown | Contacts | [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list) |
| Category | dropdown | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Category | dropdown | Contacts | [Calling Tasks (Calls index)](04-contacts.md#screen-calling-tasks-calls-index) |
| Category | dropdown | Contacts | [Add / Edit Call Assignment](04-contacts.md#screen-add-edit-call-assignment) |
| Category | dropdown | Affiliates | [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program) |
| Category | dropdown | Affiliates | [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list) |
| Category | dropdown | Affiliates | [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list) |
| Category name | text | Store | [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories) |
| Chain-shackle icon | action | Advertise | [Offers](09-advertise.md#screen-offers) |
| Channel | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Channel | dropdown / text | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Channel (in Expenses Editor) | dropdown filter | Reports | [How to Import Expenses into your Reports (Expenses Import)](10-reports.md#screen-how-to-import-expenses-into-your-reports-expenses-import) |
| Check phone numbers for accuracy | checkbox | Store | [Store Settings](03-store.md#screen-store-settings) |
| Choose a template | button | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Choose additional administrators to have access to this page | checkbox + dropdown | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Choose those who | dropdown | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Clear Description | button | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Click type (filter) | dropdown | Advertise | [Leads](09-advertise.md#screen-leads) |
| Clicks / @ / Sales / Conversion / Profit / Profit from a visitor | numeric stats | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Client's email | text | Store | [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center) |
| Client's name | text | Store | [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center) |
| Co-author | dropdown | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Co-author block (visible only if at least one partner exists) | — | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Co-author payment | percentage or fixed amount | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Co-author payment | percentage or fixed amount | Store | [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product) |
| Code counter to the reference page | code | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Code for adding to `<footer>` pages | code / text | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Code in `<head>` | code | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Code to add to the `<head>` page | code | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Color | picker | Automation | [Types of tasks](06-automation.md#screen-types-of-tasks) |
| Colors — primary color (order button + amount) | color (palette or HTML code) | Store | [Store Settings](03-store.md#screen-store-settings) |
| Colors — secondary color (links on the page) | color (palette or HTML code) | Store | [Store Settings](03-store.md#screen-store-settings) |
| Column-to-field mapping | per-column dropdowns | Contacts | [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import) |
| Commission | percentage or fixed amount | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Commission (per level) | number / percentage | Affiliates | [Adding the Commissions for the Selected Partner (Add / Edit individual commission)](08-affiliates.md#screen-adding-the-commissions-for-the-selected-partner-add-edit-individual-commission) |
| Commission to an individual partner | partner login + amount + level | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Commissions (per level) | number / percentage | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Compress images when loading | checkbox | Website | [Site Settings (Page Builder gear / "Site settings" menu)](02-website.md#screen-site-settings-page-builder-gear-site-settings-menu) |
| Condition(s) | repeating row | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| Confirm new password | password | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |
| Confirm password | password | Courses | [User profile](07-courses.md#screen-user-profile) |
| Contact | dropdown / radio | Website | [Survey — Actions tab](02-website.md#screen-survey-actions-tab) |
| Contact details | read-only | Automation | [Rule "Done" log](06-automation.md#screen-rule-done-log) |
| Contact group | dropdown | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Contact name (filter) | text | Advertise | [Orders](09-advertise.md#screen-orders) |
| Contacts in the process | number (read-only) | Automation | [Processes list](06-automation.md#screen-processes-list) |
| Conversation / series name | text | Store | [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email) |
| Copy button (last column on file row) | button | Website | [File Manager](02-website.md#screen-file-manager) |
| Copy course icon | action | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Copy link icon | action | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Copyright text | text / WYSIWYG | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Copyright text | text | Store | [Store Settings](03-store.md#screen-store-settings) |
| Cost | currency | Store | [Products list](03-store.md#screen-products-list) |
| count followed links from the message | checkbox | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| count followed links from the message | checkbox | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| count links from the message | checkbox | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Counter code for the broadcast page | code | Website | [Auto-webinar — Room tab](02-website.md#screen-auto-webinar-room-tab) |
| Country selector | dropdown | Store | [Store Settings](03-store.md#screen-store-settings) |
| Coupon | text | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Course | dropdown | Courses | [Reports → Filter modal](07-courses.md#screen-reports-filter-modal) |
| Course / Module | checkbox tree | Courses | [Lesson filter](07-courses.md#screen-lesson-filter) |
| Course name | text (link) | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Course name | text | Courses | [Course settings — "Course" tab](07-courses.md#screen-course-settings-course-tab) |
| Course status | dropdown | Courses | [Filter modal (Courses main page)](07-courses.md#screen-filter-modal-courses-main-page) |
| Cover picture | file | Courses | [Course settings — "Course" tab](07-courses.md#screen-course-settings-course-tab) |
| Create a contact list and add a buyer to it | radio | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Cross icon | action | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Cross mark (last column) | icon button | Affiliates | [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list) |
| Cross mark (last column) | action | Advertise | [Partner's Cabinet (catalog)](09-advertise.md#screen-partner-s-cabinet-catalog) |
| CSV upload | file (CSV) | Reports | [How to Import Expenses into your Reports (Expenses Import)](10-reports.md#screen-how-to-import-expenses-into-your-reports-expenses-import) |
| Cumulative data | checkbox | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Cumulative data in the statistics | checkbox | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Cumulative data in the statistics | checkbox | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Cumulative data in the statistics | checkbox | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Current name (header area) | text (read-only echo) | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Current password | password | Courses | [User profile](07-courses.md#screen-user-profile) |
| Current password | password | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |
| Custom button image | file (via File Manager) | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Custom button text | text | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Customer information | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Date and time | datetime (read-only) | Automation | [Rule "Done" log](06-automation.md#screen-rule-done-log) |
| Date and time of sending | date+time | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Date and time of sending | date+time | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Date confirmed from … to | date range | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Date from | date | Courses | [Reports → Filter modal](07-courses.md#screen-reports-filter-modal) |
| Date mode | radio / option | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Date of addition | date | Contacts | [Calling Tasks (Calls index)](04-contacts.md#screen-calling-tasks-calls-index) |
| Date of billing (filter) | date | Advertise | [Orders](09-advertise.md#screen-orders) |
| Date of done from | date | Automation | [Rule "Done" filter](06-automation.md#screen-rule-done-filter) |
| Date of done to | date | Automation | [Rule "Done" filter](06-automation.md#screen-rule-done-filter) |
| Date of first registration | date + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Date of payment collection (filter) | date | Advertise | [Orders](09-advertise.md#screen-orders) |
| Date of submission from … to | date range | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Date of subscription to a list | date + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Date range (Set period) | start date + end date | Website | [Viral promotion statistics](02-website.md#screen-viral-promotion-statistics) |
| Date range filter | date range | Website | [Webinars list (Websites → Webinars)](02-website.md#screen-webinars-list-websites-webinars) |
| Date to | date | Courses | [Reports → Filter modal](07-courses.md#screen-reports-filter-modal) |
| Date when the report to the course was added | date | Courses | [Filter modal (Courses main page)](07-courses.md#screen-filter-modal-courses-main-page) |
| Days after subscription | numeric | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Days of the week | checkboxes | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Days of the week | multi-select (when applicable) | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Deduct partner commission before settling with co-author | radio | Store | [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product) |
| Default minimum prepayment amount | currency | Store | [Store Settings](03-store.md#screen-store-settings) |
| Default UI text | text fields | Website | [Survey — Additional settings / Language settings tab](02-website.md#screen-survey-additional-settings-language-settings-tab) |
| Default value | text | Contacts | [CRM Settings](04-contacts.md#screen-crm-settings) |
| Delete | button (cross icon) | Automation | [Processes list](06-automation.md#screen-processes-list) |
| Delete | button (cross) | Automation | [Rules list (Automatic rules)](06-automation.md#screen-rules-list-automatic-rules) |
| Delete (X) | button | Website | [File Manager](02-website.md#screen-file-manager) |
| Delete (X) | action | Store | [Products list](03-store.md#screen-products-list) |
| Delete all times | button | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Delete entry | X button | Store | [Store Settings](03-store.md#screen-store-settings) |
| Delete from groups | tree-picker | Contacts | [Subscription Form Constructor](04-contacts.md#screen-subscription-form-constructor) |
| Delivery (sub-menu) | dropdown | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Description | text (assumed) | Funnels | [Share Funnel](01-funnels.md#screen-share-funnel) |
| Description | text | Website | [Site Settings (Page Builder gear / "Site settings" menu)](02-website.md#screen-site-settings-page-builder-gear-site-settings-menu) |
| Description | WYSIWYG / text | Website | [Promotion — Basic information tab](02-website.md#screen-promotion-basic-information-tab) |
| Description | text / WYSIWYG | Website | [Survey — Main settings tab (Create / Edit Survey)](02-website.md#screen-survey-main-settings-tab-create-edit-survey) |
| Description | text | Website | [Survey — Pages tab](02-website.md#screen-survey-pages-tab) |
| Description | text | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Description | text | Courses | [Add a Course (new course form)](07-courses.md#screen-add-a-course-new-course-form) |
| Description | text | Courses | [Course settings — "Course" tab](07-courses.md#screen-course-settings-course-tab) |
| Description | text / WYSIWYG (assumed) | Affiliates | [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program) |
| Description | text | Affiliates | [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list) |
| Description | text | Affiliates | [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list) |
| Direct link | checkbox | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Discount coupon code by default | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Discounts | numeric badge | Store | [Products list](03-store.md#screen-products-list) |
| Display a Direct Link for Partners | checkbox | Affiliates | [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program) |
| Display by | dropdown | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Display by the additional field | dropdown | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Display of inaccessible course | radio | Courses | [Course settings — "Access" tab](07-courses.md#screen-course-settings-access-tab) |
| Display subscriber's statistics | toggle | Advertise | [Subscription Form Generator — Form View](09-advertise.md#screen-subscription-form-generator-form-view) |
| Do not import the first row | checkbox | Contacts | [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import) |
| Document icon (next to file name) | link | Website | [File Manager](02-website.md#screen-file-manager) |
| Domain | dropdown | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Domain | dropdown | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Done | number (read-only) | Automation | [Processes list](06-automation.md#screen-processes-list) |
| Download (inside File Manager) | button | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Duration | radio | Website | [Survey — Main settings tab (Create / Edit Survey)](02-website.md#screen-survey-main-settings-tab-create-edit-survey) |
| Edit Description | button | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Editor body | template designer or HTML code field | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Element settings panel | right-side panel | Website | [Page Builder (visual template designer / device editor)](02-website.md#screen-page-builder-visual-template-designer-device-editor) |
| Email | text | Store | [Co-authors (list)](03-store.md#screen-co-authors-list) |
| Email | text | Store | [Adding and Editing a Co-Author](03-store.md#screen-adding-and-editing-a-co-author) |
| Email | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Email | text (email) | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Email (and other subscriber data) | checkbox list | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Email address | read-only | Courses | [User profile](07-courses.md#screen-user-profile) |
| Email body | WYSIWYG | Website | [Promotion — Additional information tab](02-website.md#screen-promotion-additional-information-tab) |
| Email body | WYSIWYG | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Email exists | match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Email for notifications | text | Store | [Store Settings](03-store.md#screen-store-settings) |
| Email Format | radio | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Email Format | radio | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Email Format | radio | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Email number | text (number) | Campaigns | [Broadcasts list (Campaigns → Broadcasts)](05-campaigns.md#screen-broadcasts-list-campaigns-broadcasts) |
| Email selection grid | multi-select | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Email template radio (when override is on) | radio | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Email title | text | Website | [Promotion — Additional information tab](02-website.md#screen-promotion-additional-information-tab) |
| Email to the client after the first payment | WYSIWYG | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Email to the client in case of unsuccessful payment | WYSIWYG | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Email to the customer after each re-payment | WYSIWYG | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Enable bar | toggle | Contacts | [CRM Settings](04-contacts.md#screen-crm-settings) |
| Enable this list | checkbox | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Enable/Disable | toggle | Automation | [Rules list (Automatic rules)](06-automation.md#screen-rules-list-automatic-rules) |
| Enable/disable slide bar (top-left of preview) | toggle | Funnels | [My Funnels](01-funnels.md#screen-my-funnels) |
| End date | date | Website | [Survey — Main settings tab (Create / Edit Survey)](02-website.md#screen-survey-main-settings-tab-create-edit-survey) |
| End date | date (calendar) | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| End day | date | Website | [Promotion — Additional information tab](02-website.md#screen-promotion-additional-information-tab) |
| End of period | date (calendar) | Advertise | [Payments](09-advertise.md#screen-payments) |
| End Process | Terminate the chatbot branch | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| End time | time | Website | [Promotion — Additional information tab](02-website.md#screen-promotion-additional-information-tab) |
| Exclude by Groups | checkbox list | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Exclude by Groups | checkbox list | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Exclude by Groups | checkbox list | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Exclude contacts list | tree-picker | Contacts | [Add / Edit Call Assignment](04-contacts.md#screen-add-edit-call-assignment) |
| Exclude from group(s) | category tree (optional) | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| Exclude Reverse Charge for your country | conditional | Store | [Store Settings](03-store.md#screen-store-settings) |
| Execution time | dropdown | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Existing / non-existent subscribers | toggle | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Exit from editing process | button | Automation | [Process editor](06-automation.md#screen-process-editor) |
| Expense amount | mix (% + fixed) | Store | [Store Settings](03-store.md#screen-store-settings) |
| Expenses list | structured input following the given pattern | Reports | [How to Import Expenses into your Reports (Expenses Import)](10-reports.md#screen-how-to-import-expenses-into-your-reports-expenses-import) |
| Facebook @opt-in | Ask the user for email and subscribe them | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Facebook Message | Send chat message in Messenger | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Fee period | number (days) | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Field check-boxes | checkbox list | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| Field delimiter | radio | Contacts | [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import) |
| Field name | text | Contacts | [CRM Settings](04-contacts.md#screen-crm-settings) |
| File | file (CSV, UTF-8) | Contacts | [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import) |
| Filter | button (conditional) | Automation | [Process editor](06-automation.md#screen-process-editor) |
| Filter — period | date range | Affiliates | [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners) |
| Filter parameters (name) | text | Funnels | [Categories Filter](01-funnels.md#screen-categories-filter) |
| Final email (editor) | WYSIWYG | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| First / last click | radio | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| First four fields of the form | text (assumed) | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| First name | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| First name | text | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Folder icon (next to name) | link | Website | [File Manager](02-website.md#screen-file-manager) |
| Folder icon next to page name | button | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Folder name | text | Courses | [Add a folder modal](07-courses.md#screen-add-a-folder-modal) |
| Folder/file table | list | Website | [File Manager](02-website.md#screen-file-manager) |
| Fonts | dropdown | Website | [Site Settings (Page Builder gear / "Site settings" menu)](02-website.md#screen-site-settings-page-builder-gear-site-settings-menu) |
| Form of input fields | selector | Advertise | [Subscription Form Generator — Form View](09-advertise.md#screen-subscription-form-generator-form-view) |
| Form-field width | numeric / preset | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Frequency checkboxes | checkbox set | Reports | [Statistics via Email (Send statistics via email)](10-reports.md#screen-statistics-via-email-send-statistics-via-email) |
| From (sender contact) | dropdown | Courses | [Course settings — "Notices for students" tab](07-courses.md#screen-course-settings-notices-for-students-tab) |
| From field | text | Advertise | [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Funnel link | text (read-only, assumed) | Funnels | [Share Funnel](01-funnels.md#screen-share-funnel) |
| Funnel name | text | Funnels | [My Funnels](01-funnels.md#screen-my-funnels) |
| Funnel name | text | Reports | [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list) |
| Funnel name | text | Reports | [Add / Edit Sales Funnel (Making a Funnel)](10-reports.md#screen-add-edit-sales-funnel-making-a-funnel) |
| Funnel preview tile | tile | Funnels | [My Funnels](01-funnels.md#screen-my-funnels) |
| Gear (bottom-left) | button | Website | [Page Builder (visual template designer / device editor)](02-website.md#screen-page-builder-visual-template-designer-device-editor) |
| Get shareable link | toggle | Funnels | [Share Funnel](01-funnels.md#screen-share-funnel) |
| Gift delivery info | WYSIWYG / text | Website | [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab) |
| Gift name | text | Website | [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab) |
| Global status | toggle | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Go to the next step | dropdown (downstream triggers only) | Automation | [Add trigger (Process)](06-automation.md#screen-add-trigger-process) |
| Goal of subsequent promotion | radio | Website | [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab) |
| Green eye button | button | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Green eye icon | action | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Green eye icon | link | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| Greetings (used for sophisticated chatbot) | First multi-branch question after dialogue start | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Group | dropdown | Website | [Survey statistics](02-website.md#screen-survey-statistics) |
| Group (list) | tree-picker with checkboxes | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Group(s) | tree picker | Website | [Survey — Actions tab](02-website.md#screen-survey-actions-tab) |
| Group(s) of contacts | tree picker | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Group/list assignment while auto-payment active | folder + checkbox | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Grouping | dropdown | Reports | [Sales Statistics (Sales Report)](10-reports.md#screen-sales-statistics-sales-report) |
| Groups / Categories | multi-select | Reports | [Subscription Statistics](10-reports.md#screen-subscription-statistics) |
| Header picture | file upload | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Hide courses without reports | checkbox | Courses | [Filter modal (Courses main page)](07-courses.md#screen-filter-modal-courses-main-page) |
| Hide pages without views | checkbox | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Hide title of the video | checkbox | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| HTML code (Articles tab) | text (output) | Advertise | [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products) |
| HTML code (Articles) | text (output) | Advertise | [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| HTML code (Articles) | text (output) | Advertise | [Advertising Blanks for Partner Registration](09-advertise.md#screen-advertising-blanks-for-partner-registration) |
| HTML code (Banners tab) | text (output) | Advertise | [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products) |
| HTML code (Banners) | text (output) | Advertise | [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| HTML code (Banners) | text (output) | Advertise | [Advertising Blanks for Partner Registration](09-advertise.md#screen-advertising-blanks-for-partner-registration) |
| HTML code field | code area | Website | [HTML Editor (page-level)](02-website.md#screen-html-editor-page-level) |
| HTML-code | Embed Facebook comments or other social-platform comment widgets via HTML; answer participants live | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Icon | picker | Automation | [Types of tasks](06-automation.md#screen-types-of-tasks) |
| Icon (favicon.ico) | file upload | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Identifier | text | Affiliates | [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list) |
| Identifier | text | Affiliates | [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list) |
| Image | file (via `Select file`) | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Image for social networks | file upload | Website | [Site Settings (Page Builder gear / "Site settings" menu)](02-website.md#screen-site-settings-page-builder-gear-site-settings-menu) |
| Image source — Select file | file (upload) | Affiliates | [Drafts for Partners. Adding and Editing an Advertising Banner](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-an-advertising-banner) |
| Import data | textarea | Contacts | [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import) |
| Import messages | text area | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Instruction text | display | Advertise | [Instructions](09-advertise.md#screen-instructions) |
| Instructions for the employee | text area | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Internal address | text (Latin chars) | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Interval (Interval Analysis) | input | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Interval (Interval Analysis) | input | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Interval (Interval Analysis) | input | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Interval (Interval Analysis) | input | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Interval from subscription | duration | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Invalid lead | Mark order with a wrong phone number | Store | [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no) |
| IP address | text | Contacts | [Click History (Activities)](04-contacts.md#screen-click-history-activities) |
| Keys | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Keywords | text | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Keywords | text | Advertise | [New Campaign (UTM-tag builder)](09-advertise.md#screen-new-campaign-utm-tag-builder) |
| Keywords | text | Reports | [New Campaign (UTM-tag builder)](10-reports.md#screen-new-campaign-utm-tag-builder) |
| Landing page | URL | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Last name | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Last name | text | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Last name | text | Courses | [User profile](07-courses.md#screen-user-profile) |
| Left panel buttons | icon group | Website | [Page Builder (visual template designer / device editor)](02-website.md#screen-page-builder-visual-template-designer-device-editor) |
| Lesson completed | number | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| Lesson completed if | dropdown | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Lesson creation mode | dropdown | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Lesson description | text / rich text | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Lesson name | text | Courses | [Add a lesson modal (Lessons library)](07-courses.md#screen-add-a-lesson-modal-lessons-library) |
| Lesson name | text | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Lesson name (link) | link | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| Lesson opened | number | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| Lesson status | dropdown | Courses | [Lesson filter](07-courses.md#screen-lesson-filter) |
| Letter body | WYSIWYG (visual editor) | Automation | [Send email action (Process)](06-automation.md#screen-send-email-action-process) |
| Letter body (ending) | text | Advertise | [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Letter body (introductory part) | text | Advertise | [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Letter editor (revealed when unchecked) | WYSIWYG | Courses | [Course settings — "Notices for students" tab](07-courses.md#screen-course-settings-notices-for-students-tab) |
| Link | URL | Affiliates | [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program) |
| Link | text (output) | Advertise | [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products) |
| Link | text (output) | Advertise | [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| Link | text (output) | Advertise | [Advertising Blanks for Partner Registration](09-advertise.md#screen-advertising-blanks-for-partner-registration) |
| Link for quick subscription/unsubscribe button | action | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Link for subscribing or unsubscribing | action | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Link to open page (if "Show … open page" selected) | URL | Courses | [Course settings — "Access" tab](07-courses.md#screen-course-settings-access-tab) |
| Link to subscribe/unsubscribe variable | action | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Link to the Partner Registration Page | URL (read-only/display) | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Link to the terms and conditions on the connected domains | URL | Store | [Store Settings](03-store.md#screen-store-settings) |
| List | dropdown | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| List of leads (target list) | dropdown | Campaigns | [Add a sequence (popup)](05-campaigns.md#screen-add-a-sequence-popup) |
| Lists included | multi-select (Ctrl-click for multiple) | Contacts | [Add / Edit Category](04-contacts.md#screen-add-edit-category) |
| Login | text | Store | [Co-authors (list)](03-store.md#screen-co-authors-list) |
| Login | text | Store | [Adding and Editing a Co-Author](03-store.md#screen-adding-and-editing-a-co-author) |
| Login (filter) | text | Advertise | [Partners From You](09-advertise.md#screen-partners-from-you) |
| Login / username | text | Contacts | [Click History (Activities)](04-contacts.md#screen-click-history-activities) |
| Mailing Link | Link to embed the survey in an email | Website | [Surveys list (Website → Surveys)](02-website.md#screen-surveys-list-website-surveys) |
| Main instruction (Instructions for Partners) | WYSIWYG (InfluencerSoft text editor) | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Main text font | font picker | Store | [Store Settings](03-store.md#screen-store-settings) |
| Make modules available to buyers | checkbox group | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Manager (sub-menu) | mixed | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Manager compensation | percentage or fixed amount | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Manager search | text | Reports | [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| Mandatory | checkbox | Website | [Survey — Pages tab](02-website.md#screen-survey-pages-tab) |
| Match mode | option | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| Material column | click | Affiliates | [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list) |
| Message body | WYSIWYG | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Message body | WYSIWYG | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Message body | WYSIWYG | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Message subject | text | Automation | [Send email action (Process)](06-automation.md#screen-send-email-action-process) |
| Message with a button | Pitch the special offer with a CTA link | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Middle name | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Minimum amount | number | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Move handle | block header | Website | [Page Builder (visual template designer / device editor)](02-website.md#screen-page-builder-visual-template-designer-device-editor) |
| Name | text | Funnels | [Share Funnel](01-funnels.md#screen-share-funnel) |
| Name | text | Website | [Survey — Main settings tab (Create / Edit Survey)](02-website.md#screen-survey-main-settings-tab-create-edit-survey) |
| Name | text | Store | [Products list](03-store.md#screen-products-list) |
| Name | text | Store | [Products list](03-store.md#screen-products-list) |
| Name | text | Store | [Co-authors (list)](03-store.md#screen-co-authors-list) |
| Name | text | Store | [Adding and Editing a Co-Author](03-store.md#screen-adding-and-editing-a-co-author) |
| Name | text | Contacts | [Contact Lists](04-contacts.md#screen-contact-lists) |
| Name | text | Contacts | [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal) |
| Name | text | Contacts | [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list) |
| Name | text | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Name | text | Contacts | [Add / Edit Call Assignment](04-contacts.md#screen-add-edit-call-assignment) |
| Name | text | Automation | [Types of tasks](06-automation.md#screen-types-of-tasks) |
| Name | text | Courses | [Filter modal (Courses main page)](07-courses.md#screen-filter-modal-courses-main-page) |
| Name | text | Courses | [Add a Course (new course form)](07-courses.md#screen-add-a-course-new-course-form) |
| Name | text | Affiliates | [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program) |
| Name | text | Affiliates | [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list) |
| Name | text | Affiliates | [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list) |
| Name (filter) | text | Advertise | [Leads](09-advertise.md#screen-leads) |
| Name (first) | text | Courses | [User profile](07-courses.md#screen-user-profile) |
| Name (full or partial) | text | Courses | [Lesson filter](07-courses.md#screen-lesson-filter) |
| Name filter | text | Website | [Webinars list (Websites → Webinars)](02-website.md#screen-webinars-list-websites-webinars) |
| Name of the auto webinar | text | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Name of the category | text | Funnels | [Add / Edit Category](01-funnels.md#screen-add-edit-category) |
| Name of the category | text | Contacts | [Add / Edit Category](04-contacts.md#screen-add-edit-category) |
| Name of the promotion | text | Website | [Promotion — Basic information tab](02-website.md#screen-promotion-basic-information-tab) |
| Names | text list | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| New | number | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| New group name | text | Website | [Survey statistics](02-website.md#screen-survey-statistics) |
| New orders are marked with separate advertising channel and source – {Employee Login} / call center | checkbox | Store | [Store Settings](03-store.md#screen-store-settings) |
| New password | password | Courses | [User profile](07-courses.md#screen-user-profile) |
| New password | password | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |
| New reports count | counter | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| No branch | sub-step | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| No comments | No comments displayed during the auto-webinar | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Not allowed to leads in lists | list multi-select | Courses | [Module settings (cogwheel modal)](07-courses.md#screen-module-settings-cogwheel-modal) |
| Not allowed to leads in lists | list multi-select | Courses | [Course settings — "Access" tab](07-courses.md#screen-course-settings-access-tab) |
| Notification email | text (email) | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Notification script address | text (URL) | Contacts | [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal) |
| Notify about new accounts via email | checkbox | Store | [Store Settings](03-store.md#screen-store-settings) |
| Notify about paid orders via email | checkbox | Store | [Store Settings](03-store.md#screen-store-settings) |
| Number of affiliates | metric | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Number of attempts (on unsuccessful periodic write-off) | number | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Number of clicks on partner links | metric | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Number of dates available | numeric | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Number of levels | structural | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Number of payments from partners | metric | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Number of repeated auto-payments | number | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Number of repeated autopayments | number | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Number of subscribers required | numeric | Website | [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab) |
| Number of the subscribers from partners | metric | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| On/Off | toggle | Automation | [Processes list](06-automation.md#screen-processes-list) |
| Only in favorites | checkbox | Reports | [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list) |
| Only signed with … (date) | date | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Only signers with … | date | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Option No. title | collapsible | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Option number title | collapsible | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Option Number title | collapsible | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Order | drag handle | Automation | [Types of tasks](06-automation.md#screen-types-of-tasks) |
| Order cancellation parameters | radio | Store | [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center) |
| Order No. | text | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Order number (filter) | text | Advertise | [Orders](09-advertise.md#screen-orders) |
| Order page identifier | text (alphabets; underscore allowed) | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Page (filter) | text / selector | Advertise | [Referrals](09-advertise.md#screen-referrals) |
| Page description | text | Website | [Survey — Pages tab](02-website.md#screen-survey-pages-tab) |
| Page identifier | text | Website | [HTML Editor (page-level)](02-website.md#screen-html-editor-page-level) |
| Page identifier | text | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Page identifier filter | text | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Pages column | link | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Paginator | dropdown | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Parameter (Interval Analysis) | dropdown | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Parameter (Interval Analysis) | dropdown | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Parameters (Interval Analysis) | dropdown | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Parameters (Interval Analysis) | dropdown | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Parent category | dropdown | Store | [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories) |
| Participants table | data | Website | [Viral promotion statistics](02-website.md#screen-viral-promotion-statistics) |
| Partner login or email | text | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Partner program settings | indicator | Store | [Products list](03-store.md#screen-products-list) |
| Partner's login | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Partnership (sub-menu) | text | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Password | text | Store | [Adding and Editing a Co-Author](03-store.md#screen-adding-and-editing-a-co-author) |
| Password | password | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Payment date from … to | date range | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Payment status | dropdown | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Payment status (filter) | dropdown | Advertise | [Orders](09-advertise.md#screen-orders) |
| Payment type | radio | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| PayPal email | text | Store | [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal) |
| PayPal wallet | text | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |
| Percentage (%) of the conversion to a contact | metric | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Percentage of visitors at start | numeric (%) | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Percentage per variant | number (%) | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| Percentage shown | numeric | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Period | number (days) | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Period | date range | Advertise | [Partner's Cabinet — Filters](09-advertise.md#screen-partner-s-cabinet-filters) |
| Period | date range | Reports | [Sales Statistics (Sales Report)](10-reports.md#screen-sales-statistics-sales-report) |
| Period | date range | Reports | [Sales Department (Sales Department Statistics)](10-reports.md#screen-sales-department-sales-department-statistics) |
| Period (filter) | date range | Advertise | [Leads](09-advertise.md#screen-leads) |
| Period (filter) | date range | Advertise | [Referrals](09-advertise.md#screen-referrals) |
| Period from / to | date range | Reports | [Subscription Statistics](10-reports.md#screen-subscription-statistics) |
| Period of activity (from / to) | date and time | Contacts | [Click History (Activities)](04-contacts.md#screen-click-history-activities) |
| Period selector | date range | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Period since … till | date range | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Period type | option | Reports | [Sales Department (Sales Department Statistics)](10-reports.md#screen-sales-department-sales-department-statistics) |
| Personal manager | dropdown + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Personal redirect page after unsubscribe | text (URL) | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Personal redirect page after unsubscribing | text (URL) | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Personal redirect page after unsubscribing | text (URL) | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Phone number | text | Store | [Adding and Editing a Co-Author](03-store.md#screen-adding-and-editing-a-co-author) |
| Phone number | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Phone number | text | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Phone number | text | Courses | [User profile](07-courses.md#screen-user-profile) |
| Phone Request | Ask the user for phone | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Photo | file | Courses | [User profile](07-courses.md#screen-user-profile) |
| Pie chart (fixed-answer questions) | Top of the expanded view | Website | [Survey statistics](02-website.md#screen-survey-statistics) |
| Pin codes | text list (one code per line) | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Points | number + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Pop-up content | WYSIWYG / code | Website | [Auto-webinar — Room tab](02-website.md#screen-auto-webinar-room-tab) |
| POST/GET URL | text (https) | Automation | [Rule editor](06-automation.md#screen-rule-editor) |
| Prepayment | currency (dollars) | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Presence in product catalog | dropdown (assumed) | Store | [Products list](03-store.md#screen-products-list) |
| Price | currency | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Price | number | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Prices and conditions (Paid tab only) | display | Advertise | [Offers](09-advertise.md#screen-offers) |
| Pricing plan description | text | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Pricing plan name | text | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Pricing plan payment page (identifier) | text | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Process name | text | Automation | [Processes list](06-automation.md#screen-processes-list) |
| Process name | text | Automation | [Process editor](06-automation.md#screen-process-editor) |
| Process status | button | Automation | [Process editor](06-automation.md#screen-process-editor) |
| Product | dropdown | Store | [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product) |
| Product | dropdown | Affiliates | [Adding the Commissions for the Selected Partner (Add / Edit individual commission)](08-affiliates.md#screen-adding-the-commissions-for-the-selected-partner-add-edit-individual-commission) |
| Product (filter) | text / selector | Advertise | [Orders](09-advertise.md#screen-orders) |
| Product / page name (first column) | link | Advertise | [Offers](09-advertise.md#screen-offers) |
| Product type | text | Store | [Products list](03-store.md#screen-products-list) |
| Product type | radio | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Product(s) | multi-select via `Add product` window | Store | [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center) |
| Products | multi-select (Ctrl+click) | Store | [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories) |
| Products | folder/checkbox tree | Store | [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount) |
| Products | checkboxes | Store | [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email) |
| Products | multi-select (assumed) | Reports | [Sales Statistics (Sales Report)](10-reports.md#screen-sales-statistics-sales-report) |
| Products (sub-menu) | folder/checkbox | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Products that can be added to the order together with this product by call-center employees | checkboxes | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Program description | display | Advertise | [Offers](09-advertise.md#screen-offers) |
| Program name | link | Advertise | [Partner's Cabinet (catalog)](09-advertise.md#screen-partner-s-cabinet-catalog) |
| Promotion name | Click to edit the promotion | Website | [Promotions list (Website → Promotions)](02-website.md#screen-promotions-list-website-promotions) |
| Promotional Materials for Paid Product | button | Affiliates | [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list) |
| Promotional page link | link | Advertise | [Instructions](09-advertise.md#screen-instructions) |
| Protecting videos from YouTube | checkbox | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Question | dropdown | Website | [Survey — Actions tab](02-website.md#screen-survey-actions-tab) |
| Question row | Click to expand stats inline; click again to collapse | Website | [Survey statistics](02-website.md#screen-survey-statistics) |
| Question Text | text | Website | [Survey — Pages tab](02-website.md#screen-survey-pages-tab) |
| Quick Filter bar | checkbox | Courses | [View options popover (Courses main page)](07-courses.md#screen-view-options-popover-courses-main-page) |
| Quick period filter | preset buttons | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Quick period filter | preset buttons | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Quick period filter | preset buttons | Reports | [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list) |
| Quick period filter | preset buttons | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Quick period filter | preset buttons | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Quick period filter | preset buttons | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Quick time filter | chip filter | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Quota indicator (top of page) | text | Website | [File Manager](02-website.md#screen-file-manager) |
| Rate | number | Store | [Store Settings](03-store.md#screen-store-settings) |
| Read the interval analysis | checkbox | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Read the interval analysis | checkbox | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Read the interval analysis | checkbox | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| ReCAPTCHA secret key | text | Contacts | [CRM Settings](04-contacts.md#screen-crm-settings) |
| ReCAPTCHA site key | text | Contacts | [CRM Settings](04-contacts.md#screen-crm-settings) |
| Record type | dropdown | Website | [DNS Editor](02-website.md#screen-dns-editor) |
| Record value | text | Website | [DNS Editor](02-website.md#screen-dns-editor) |
| Redirect logic | dropdown / radio | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Redirect page after unsubscribing | text (URL) | Contacts | [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal) |
| Redirect page after unsubscribing | text (URL) | Contacts | [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list) |
| Redirect page after unsubscribing | text (URL) | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Refusal and cancellation (`Cancel`) | Cancel order at customer's refusal | Store | [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no) |
| Registration form button | Opens the Viral Promotion Registration Form for the promotion | Website | [Promotions list (Website → Promotions)](02-website.md#screen-promotions-list-website-promotions) |
| Rejected | number | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| Rejected reports count | counter | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Rename | inline editor | Website | [File Manager](02-website.md#screen-file-manager) |
| Repetition mode | option | Automation | [Rule editor](06-automation.md#screen-rule-editor) |
| Repetitions | toggle / option | Automation | [Add trigger (Process)](06-automation.md#screen-add-trigger-process) |
| Repetitions | toggle | Automation | [Send email action (Process)](06-automation.md#screen-send-email-action-process) |
| Repetitions toggle | toggle | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Report statistics | checkbox | Courses | [View options popover (Courses main page)](07-courses.md#screen-view-options-popover-courses-main-page) |
| Report statistics column | derived | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Request customer VAT ID | checkbox | Store | [Store Settings](03-store.md#screen-store-settings) |
| Required block | checkbox list | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| Reset-stats button | round-arrows button | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Responsible employee | dropdown | Contacts | [Add / Edit Call Assignment](04-contacts.md#screen-add-edit-call-assignment) |
| Responsible manager | dropdown | Contacts | [Calling Tasks (Calls index)](04-contacts.md#screen-calling-tasks-calls-index) |
| Restrictions | mixed | Store | [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal) |
| Retrieve statistics from / to | date range | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Retrieve statistics from / to | date range | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Retrieve statistics from…to | date range | Reports | [Advertising (The Efficiency of the Advertising Campaign)](10-reports.md#screen-advertising-the-efficiency-of-the-advertising-campaign) |
| Retrieve statistics from…to | date range | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Return date from … to | date range | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Reward page address | URL | Website | [Survey — Additional settings / Language settings tab](02-website.md#screen-survey-additional-settings-language-settings-tab) |
| Right panel (Add item) | button + panel | Website | [Page Builder (visual template designer / device editor)](02-website.md#screen-page-builder-visual-template-designer-device-editor) |
| Role | dropdown | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Round the corners | toggle / selector | Advertise | [Subscription Form Generator — Block Type](09-advertise.md#screen-subscription-form-generator-block-type) |
| Rule | multi-select | Automation | [Rule "Done" filter](06-automation.md#screen-rule-done-filter) |
| Rule and trigger | read-only | Automation | [Rule "Done" log](06-automation.md#screen-rule-done-log) |
| Rule name | text | Automation | [Rules list (Automatic rules)](06-automation.md#screen-rules-list-automatic-rules) |
| Rule name | text | Automation | [Rule editor](06-automation.md#screen-rule-editor) |
| Run frequency | radio | Campaigns | [Add a sequence (popup)](05-campaigns.md#screen-add-a-sequence-popup) |
| Run frequency | option | Automation | [Process run-frequency setting](06-automation.md#screen-process-run-frequency-setting) |
| Sales funnels in this category | multi-select (assumed) | Funnels | [Add / Edit Category](01-funnels.md#screen-add-edit-category) |
| Save | button | Automation | [Process editor](06-automation.md#screen-process-editor) |
| Search / Filter | filter modal | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Search by contacts or address / lead info | text | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Search by lead info | text | Automation | [Rule "Done" filter](06-automation.md#screen-rule-done-filter) |
| Select file (description attachment) | file | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Send on behalf | dropdown | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Send on behalf | dropdown | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Send on behalf | dropdown | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Sender | dropdown | Contacts | [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal) |
| Sender | dropdown | Contacts | [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list) |
| Sender | dropdown | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Sender | dropdown | Contacts | [Add / Edit Category](04-contacts.md#screen-add-edit-category) |
| Sender's contact | dropdown | Automation | [Send email action (Process)](06-automation.md#screen-send-email-action-process) |
| Sender's email | text | Store | [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter) |
| Sequence name | text | Campaigns | [Add a sequence (popup)](05-campaigns.md#screen-add-a-sequence-popup) |
| Sequence number of the email | number | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Sequences | checkbox | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Serial number of the email | number | Store | [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter) |
| Setting (cogwheel) | button | Automation | [Process editor](06-automation.md#screen-process-editor) |
| Share text | text | Website | [Promotion — Additional information tab](02-website.md#screen-promotion-additional-information-tab) |
| Shipping address 1 | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Shipping address 2 | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Shipping city | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Shipping country | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Shipping state | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Shipping zip | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Show by click | dropdown | Reports | [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list) |
| Show by click | dropdown | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Show by click | dropdown | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Show co-author client's contacts | checkbox | Store | [Adding and Editing a Co-Author](03-store.md#screen-adding-and-editing-a-co-author) |
| Show partners | checkbox | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Show statistics | toggle button | Automation | [Process editor](06-automation.md#screen-process-editor) |
| Show statistics from … to | date range | Store | [Co-authors (list)](03-store.md#screen-co-authors-list) |
| Show the Report Spam and Unsubscribe from the mailing buttons in the emails | checkbox | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| Show the schedule of modules and lessons on the side menu of the course | checkbox | Courses | [Course settings — "Access" tab](07-courses.md#screen-course-settings-access-tab) |
| Sign up for newsletters | checkbox | Contacts | [Subscription Form Constructor](04-contacts.md#screen-subscription-form-constructor) |
| Site name | text | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Site picker | dropdown / list | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Skip automatic emails | number (first N) | Contacts | [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import) |
| Sorting column | arrows | Affiliates | [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list) |
| Source | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Source | dropdown / text | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Source / channel / campaign / ad / keys | display | Advertise | [Leads](09-advertise.md#screen-leads) |
| Source / channel / campaign / ads / keys columns | display | Advertise | [Orders](09-advertise.md#screen-orders) |
| Source groups | tree-picker | Contacts | [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts) |
| Source of traffic | text / dropdown (assumed) | Advertise | [New Campaign (UTM-tag builder)](09-advertise.md#screen-new-campaign-utm-tag-builder) |
| Source of traffic | text | Reports | [New Campaign (UTM-tag builder)](10-reports.md#screen-new-campaign-utm-tag-builder) |
| Speaker name | text | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Speaker photo | file upload | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Specify individual email templates | checkbox | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Split testing — Variant №… | collapsible block | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Star (Favorites) | toggle | Advertise | [Partner's Cabinet (catalog)](09-advertise.md#screen-partner-s-cabinet-catalog) |
| Star icon | toggle | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Start date | date (calendar) | Affiliates | [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting) |
| Start dialogue on Facebook | Process trigger when a Facebook user opens chat | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Status | toggle | Website | [DNS Editor](02-website.md#screen-dns-editor) |
| Status | match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Status | dropdown | Contacts | [Users (Creating and Managing Users)](04-contacts.md#screen-users-creating-and-managing-users) |
| Status | dropdown | Campaigns | [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers) |
| Status | icon | Automation | [Rule "Done" log](06-automation.md#screen-rule-done-log) |
| Status | toggle | Courses | [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list) |
| Status | multi-select | Courses | [Reports → Filter modal](07-courses.md#screen-reports-filter-modal) |
| Status counters | number (read-only) | Automation | [Tasks subsection (main page)](06-automation.md#screen-tasks-subsection-main-page) |
| Status slider | toggle | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| Status slider | toggle | Website | [Webinars list (Websites → Webinars)](02-website.md#screen-webinars-list-websites-webinars) |
| Status slider | Green = active; dark grey = inactive | Website | [Surveys list (Website → Surveys)](02-website.md#screen-surveys-list-website-surveys) |
| Status switch | toggle | Store | [Products list](03-store.md#screen-products-list) |
| Step event | dropdown (per step) | Reports | [Add / Edit Sales Funnel (Making a Funnel)](10-reports.md#screen-add-edit-sales-funnel-making-a-funnel) |
| Step name | text (per step) | Reports | [Add / Edit Sales Funnel (Making a Funnel)](10-reports.md#screen-add-edit-sales-funnel-making-a-funnel) |
| Step of the funnel (Interval Analysis) | dropdown | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Step of the funnel (Interval Analysis) | dropdown | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Step of the funnel (Interval Analysis) | dropdown | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Store column marker | radio | Website | [Website Settings — site-level (Websites → Settings, or Pages → Set up)](02-website.md#screen-website-settings-site-level-websites-settings-or-pages-set-up) |
| Store Name | text | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Student contact info | text | Courses | [Reports → Filter modal](07-courses.md#screen-reports-filter-modal) |
| Subject field | text | Advertise | [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Subject of the email | text | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Subject of the email | text | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Subject of the Email | text | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Subscribe offer | Ask the user for email in chat with a one-click subscribe | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Subscribe via Facebook | Capture email click from Messenger | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Subscribed group | display | Advertise | [Leads](09-advertise.md#screen-leads) |
| Subscribed group (filter) | text / selector | Advertise | [Leads](09-advertise.md#screen-leads) |
| Subscriber name button | action | Campaigns | [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists) |
| Subscriber name button | action | Campaigns | [Sending and Editing Email by Activity (Broadcast → By Activity)](05-campaigns.md#screen-sending-and-editing-email-by-activity-broadcast-by-activity) |
| Subscriber name button | action | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Subscription Activation | checkbox | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| Subscription entry point link | Opens the public page where participation conditions live | Website | [Promotions list (Website → Promotions)](02-website.md#screen-promotions-list-website-promotions) |
| Subscription form code | text (output) | Advertise | [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products) |
| Subscription Form Description | text | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| Subtract commission from the cost | checkbox | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Subtract Commission in the Case of Moneyback | checkbox | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Summary (top of page) | metric block | Affiliates | [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners) |
| Summary statistics columns | display | Advertise | [Partner's Cabinet (catalog)](09-advertise.md#screen-partner-s-cabinet-catalog) |
| Survey Page link | Opens the public survey-completion page | Website | [Surveys list (Website → Surveys)](02-website.md#screen-surveys-list-website-surveys) |
| Survey page URL | text | Website | [Survey — Pages tab](02-website.md#screen-survey-pages-tab) |
| Tag | text | Store | [Order Buttons](03-store.md#screen-order-buttons) |
| Tag | text | Store | [Orders (list)](03-store.md#screen-orders-list) |
| Tag | dropdown | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Tag tab — Tag | text/picker | Reports | [Sales Funnels — Sources](10-reports.md#screen-sales-funnels-sources) |
| Tag tab — Tag | text/picker | Reports | [Sales Funnels — Cohorts](10-reports.md#screen-sales-funnels-cohorts) |
| Tags | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Tags | tag picker | Courses | [Filter modal (Courses main page)](07-courses.md#screen-filter-modal-courses-main-page) |
| Tags | tag input | Courses | [Course settings — "Course" tab](07-courses.md#screen-course-settings-course-tab) |
| Tags tab — Tag | text/picker | Reports | [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list) |
| Tags tab — Tag | text/picker | Reports | [Sales Funnel — Additional Fields](10-reports.md#screen-sales-funnel-additional-fields) |
| Take contacts from these lists | tree-picker | Contacts | [Add / Edit Call Assignment](04-contacts.md#screen-add-edit-call-assignment) |
| Target spend ($) | numeric | Website | [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab) |
| Target subscribers | numeric | Website | [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab) |
| Task file attachments | file | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Task for the manager to call | Notify employee | Store | [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot) |
| Task text | text | Courses | [Lesson settings / editor](07-courses.md#screen-lesson-settings-editor) |
| Task title | text | Contacts | [Calling Tasks (Calls index)](04-contacts.md#screen-calling-tasks-calls-index) |
| Task-distribution principle | radio | Contacts | [Teams](04-contacts.md#screen-teams) |
| Tasks per user per distribution circle | number per user | Contacts | [Teams](04-contacts.md#screen-teams) |
| Teacher / curator | dropdown | Courses | [Reports → Filter modal](07-courses.md#screen-reports-filter-modal) |
| Team name | text | Contacts | [Teams](04-contacts.md#screen-teams) |
| Texture | selector | Advertise | [Subscription Form Generator — Block Type](09-advertise.md#screen-subscription-form-generator-block-type) |
| The amount of expenses | currency | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| The amount of the first payment | currency | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| The call did not go through | Mark unreached; schedules recall (1 hour after first failure, 24 hours after subsequent failures) | Store | [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no) |
| The conversation went through | Mark successful contact; record outcome | Store | [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no) |
| The first payment amount | number | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| The interval between attempts (in hours) | number | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| The product's name | text | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| The purchase was successful but not via a partner's link? | checkbox | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Time interval for sending | time range | Campaigns | [Add / Edit / Copy Email Series](05-campaigns.md#screen-add-edit-copy-email-series) |
| Time of subscription | display | Advertise | [Leads](09-advertise.md#screen-leads) |
| Time options | time list | Website | [Auto-webinar — Schedule tab](02-website.md#screen-auto-webinar-schedule-tab) |
| Time window | time range (when applicable) | Automation | [Add action (Process)](06-automation.md#screen-add-action-process) |
| Timer | dropdown / On-Off | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Timer for display text | time (HH:MM:SS) | Website | [Auto-webinar — Room tab](02-website.md#screen-auto-webinar-room-tab) |
| Timer type | dropdown | Website | [Page Settings (Websites → Settings → page name)](02-website.md#screen-page-settings-websites-settings-page-name) |
| Timezone (UTC) | dropdown + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Title | text | Website | [Site Settings (Page Builder gear / "Site settings" menu)](02-website.md#screen-site-settings-page-builder-gear-site-settings-menu) |
| Title font | font picker | Store | [Store Settings](03-store.md#screen-store-settings) |
| Title tag | text | Contacts | [Tags](04-contacts.md#screen-tags) |
| To charge partner commissions | radio | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| Topic of the auto webinar | text | Website | [Auto-webinar — Settings tab](02-website.md#screen-auto-webinar-settings-tab) |
| Total | number | Courses | [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course) |
| Total amount paid | number + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Total reports count | counter | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| Total task count | number (read-only) | Automation | [Tasks subsection (main page)](06-automation.md#screen-tasks-subsection-main-page) |
| Transmittal time (time of departure) | number + unit | Store | [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter) |
| Transmitted parameters | reference | Automation | [Rule editor](06-automation.md#screen-rule-editor) |
| Trigger condition | configurable | Automation | [Add trigger (Process)](06-automation.md#screen-add-trigger-process) |
| Trigger event | dropdown | Automation | [Add trigger (Process)](06-automation.md#screen-add-trigger-process) |
| Trigger event | dropdown | Automation | [Rule editor](06-automation.md#screen-rule-editor) |
| Trigger name | text | Automation | [Add trigger (Process)](06-automation.md#screen-add-trigger-process) |
| Trigger number | number (read-only) | Automation | [Rules list (Automatic rules)](06-automation.md#screen-rules-list-automatic-rules) |
| Triggers | number (read-only) | Automation | [Processes list](06-automation.md#screen-processes-list) |
| Type | dropdown | Contacts | [Contact Lists](04-contacts.md#screen-contact-lists) |
| Type | dropdown | Contacts | [CRM Settings](04-contacts.md#screen-crm-settings) |
| Type of gift (2nd and later) | radio | Website | [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab) |
| Type of payment | dropdown | Courses | [Create pricing plan](07-courses.md#screen-create-pricing-plan) |
| Type of question | dropdown | Website | [Survey — Pages tab](02-website.md#screen-survey-pages-tab) |
| Unload format | radio | Campaigns | [Broadcasts list (Campaigns → Broadcasts)](05-campaigns.md#screen-broadcasts-list-campaigns-broadcasts) |
| Upload Image | button | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| Upload messages from file | file upload | Website | [Auto-webinar — Chat tab](02-website.md#screen-auto-webinar-chat-tab) |
| Upload your button | file | Advertise | [Subscription Form Generator — Button View](09-advertise.md#screen-subscription-form-generator-button-view) |
| URL address | URL | Affiliates | [Drafts for Partners. Adding and Editing an Advertising Banner](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-an-advertising-banner) |
| URL after activation | text | Website | [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form) |
| URL after activation | text (URL) | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| URL after activation | URL | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| URL after cancellation | text (URL) | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| URL after subscription | text (URL) | Campaigns | [Mailing Settings (Campaigns → Settings)](05-campaigns.md#screen-mailing-settings-campaigns-settings) |
| URL after the subscription | URL | Affiliates | [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form) |
| URL to redirect after the webinar | text | Website | [Auto-webinar — Room tab](02-website.md#screen-auto-webinar-room-tab) |
| URL to YouTube video | text | Website | [Auto-webinar — Room tab](02-website.md#screen-auto-webinar-room-tab) |
| Use default letters (checkbox) | toggle | Courses | [Course settings — "Notices for students" tab](07-courses.md#screen-course-settings-notices-for-students-tab) |
| User photo | file (image) | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Username | text | Contacts | [Users (Creating and Managing Users)](04-contacts.md#screen-users-creating-and-managing-users) |
| Username | text | Contacts | [Add / Edit User](04-contacts.md#screen-add-edit-user) |
| Users | multi-select dropdown | Contacts | [Teams](04-contacts.md#screen-teams) |
| Value 1, Value 2… (Drop-down list only) | text | Contacts | [CRM Settings](04-contacts.md#screen-crm-settings) |
| Variants | repeating row | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| View | dropdown | Courses | [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox) |
| View Responses (free-text questions) | Opens a window listing each respondent's answer; **Back to the "Surveys Statistics" page** closes it | Website | [Survey statistics](02-website.md#screen-survey-statistics) |
| Visibility | button → grouping options | Reports | [Subscription Statistics](10-reports.md#screen-subscription-statistics) |
| Ways of Payout | multi-option list | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| What if a customer is already in your database? | checkbox | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| When making an order, the phone field must be filled | checkbox | Store | [Store Settings](03-store.md#screen-store-settings) |
| When the module is not available to the lead, in the modal window, display the message | text | Courses | [Module settings (cogwheel modal)](07-courses.md#screen-module-settings-cogwheel-modal) |
| When to send | option | Automation | [Send email action (Process)](06-automation.md#screen-send-email-action-process) |
| Where to import | dropdown | Contacts | [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import) |
| Where to import | dropdown | Contacts | [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import) |
| Where to invite friends to | URL | Website | [Promotion — Basic information tab](02-website.md#screen-promotion-basic-information-tab) |
| Which partner should a fee be accrued for? | choice | Affiliates | [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings) |
| Widget search/drag | drag handle | Website | [Page Builder (visual template designer / device editor)](02-website.md#screen-page-builder-visual-template-designer-device-editor) |
| Width | numeric / selector | Advertise | [Subscription Form Generator — Form View](09-advertise.md#screen-subscription-form-generator-form-view) |
| With an interval of XX days | number (days) | Store | [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product) |
| X | Permanently deletes a survey | Website | [Surveys list (Website → Surveys)](02-website.md#screen-surveys-list-website-surveys) |
| X (last column) | button | Website | [Pages (Websites → Pages)](02-website.md#screen-pages-websites-pages) |
| X (last column) | Removes the viral action | Website | [Promotions list (Website → Promotions)](02-website.md#screen-promotions-list-website-promotions) |
| X button | button | Website | [Webinars list (Websites → Webinars)](02-website.md#screen-webinars-list-websites-webinars) |
| Yes branch | sub-step | Automation | [Add condition (Process)](06-automation.md#screen-add-condition-process) |
| Your Affiliate Link | link | Advertise | [Offers](09-advertise.md#screen-offers) |
| Your Affiliate Link | text (output) | Advertise | [Advertising Blanks for Partner Registration](09-advertise.md#screen-advertising-blanks-for-partner-registration) |
| Your Affiliate Link / Your Link for Counting Clicks / Your Reference-Counting of Clicks | text (output) | Advertise | [New Campaign (UTM-tag builder)](09-advertise.md#screen-new-campaign-utm-tag-builder) |
| Your Email field | email | Advertise | [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Your gender | text + match-type | Contacts | [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list) |
| Your link for calculating clicks | text (read-only output) | Reports | [New Campaign (UTM-tag builder)](10-reports.md#screen-new-campaign-utm-tag-builder) |
| Your name | text | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |
| Your telephone number | text (with confirmation flow) | Affiliates | [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side) |


---


# API ↔ UI Map

Each API endpoint mapped to the resource it operates on and the UI screen(s) that read or write the same data. Classification is heuristic — verify against the source article when correctness matters.

## API 1.0

| Endpoint | Method | Group | Operation | Resource | UI screens that touch the same data |
|----------|--------|-------|-----------|----------|-------------------------------------|
| AddLeadToGroup | POST | Contacts (Subscribers / Leads) | Writes | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| UpdateSubscriberData | POST | Contacts (Subscribers / Leads) | Writes | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| DeleteSubscribe | POST | Contacts (Subscribers / Leads) | Writes | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| GetLeadGroups | POST | Contacts (Subscribers / Leads) | Reads | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| GetLeadGroupStatuses | POST | Contacts (Subscribers / Leads) | Reads | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| GetAllGroups | POST | Contacts (Subscribers / Leads) | Reads | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| GetCountSubscribe | POST | Contacts (Subscribers / Leads) | Reads | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| AddGood | POST | Products (Goods) | Writes | Product / Good | Store → [Products list](03-store.md#screen-products-list)<br>Store → [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product)<br>Store → [Product Categories (list)](03-store.md#screen-product-categories-list)<br>Store → [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories)<br>Store → [Products of the Co-Author](03-store.md#screen-products-of-the-co-author)<br>Store → [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product)<br>Affiliates → [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Advertise → [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products)<br>Advertise → [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| UpdateGood | POST | Products (Goods) | Writes | Product / Good | Store → [Products list](03-store.md#screen-products-list)<br>Store → [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product)<br>Store → [Product Categories (list)](03-store.md#screen-product-categories-list)<br>Store → [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories)<br>Store → [Products of the Co-Author](03-store.md#screen-products-of-the-co-author)<br>Store → [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product)<br>Affiliates → [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Advertise → [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products)<br>Advertise → [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| DeleteGood | POST | Products (Goods) | Writes | Product / Good | Store → [Products list](03-store.md#screen-products-list)<br>Store → [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product)<br>Store → [Product Categories (list)](03-store.md#screen-product-categories-list)<br>Store → [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories)<br>Store → [Products of the Co-Author](03-store.md#screen-products-of-the-co-author)<br>Store → [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product)<br>Affiliates → [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Advertise → [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products)<br>Advertise → [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| GetAllGoods | POST | Products (Goods) | Reads | Product / Good | Store → [Products list](03-store.md#screen-products-list)<br>Store → [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product)<br>Store → [Product Categories (list)](03-store.md#screen-product-categories-list)<br>Store → [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories)<br>Store → [Products of the Co-Author](03-store.md#screen-products-of-the-co-author)<br>Store → [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product)<br>Affiliates → [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Advertise → [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products)<br>Advertise → [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| CreateOrder | POST | Orders (Invoices) | Writes | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| UpdateOrderStatus | POST | Orders (Invoices) | Writes | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| DeleteOrder | POST | Orders (Invoices) | Writes | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| GetOrders | POST | Orders (Invoices) | Reads | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| getOrdersWithGoods | POST | Orders (Invoices) | Reads | Product / Good | Store → [Products list](03-store.md#screen-products-list)<br>Store → [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product)<br>Store → [Product Categories (list)](03-store.md#screen-product-categories-list)<br>Store → [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories)<br>Store → [Products of the Co-Author](03-store.md#screen-products-of-the-co-author)<br>Store → [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product)<br>Affiliates → [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Advertise → [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products)<br>Advertise → [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| GetOrderInfo | POST | Orders (Invoices) | Reads | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| getOrderDetails | POST | Orders (Invoices) | Reads | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| GetBills | POST | Orders (Invoices) | Reads | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| GetPartnerStats | POST | Partner Statistics | Reads | Affiliate / Partner | Affiliates → [How to Setup an Affiliate Program (program-wide settings)](08-affiliates.md#screen-how-to-setup-an-affiliate-program-program-wide-settings)<br>Affiliates → [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting)<br>Affiliates → [Settings of the Partner Profile (partner-side)](08-affiliates.md#screen-settings-of-the-partner-profile-partner-side)<br>Affiliates → [The Commissions for the Selected Partner](08-affiliates.md#screen-the-commissions-for-the-selected-partner)<br>Affiliates → [Adding the Commissions for the Selected Partner (Add / Edit individual commission)](08-affiliates.md#screen-adding-the-commissions-for-the-selected-partner-add-edit-individual-commission)<br>Affiliates → [Paying Off the Commissions to the Partner](08-affiliates.md#screen-paying-off-the-commissions-to-the-partner)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Affiliates → [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-multi-leveled-affiliates-program-promotional-materials-list)<br>Affiliates → [Promotional Materials for Attracting the Partners (per multi-leveled program list)](08-affiliates.md#screen-promotional-materials-for-attracting-the-partners-per-multi-leveled-program-list)<br>Affiliates → [Drafts for Partners. Adding and Editing an Advertising Banner](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-an-advertising-banner)<br>Affiliates → [Drafts for Partners. Adding and Editing an Advertising Text](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-an-advertising-text)<br>Affiliates → [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form)<br>Advertise → [Partner's Cabinet (catalog)](09-advertise.md#screen-partner-s-cabinet-catalog)<br>Advertise → [Partner's Cabinet — Filters](09-advertise.md#screen-partner-s-cabinet-filters)<br>Advertise → [Advertising Blanks for Partner Registration](09-advertise.md#screen-advertising-blanks-for-partner-registration)<br>Advertise → [Partners From You](09-advertise.md#screen-partners-from-you) |
| Subscription notification (newsletter subscribed) | INBOUND | Script Notifications (Outbound Webhooks) | Inbound webhook (push from IS) | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Unsubscribe notification | INBOUND | Script Notifications (Outbound Webhooks) | Inbound webhook (push from IS) | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| Invoice created / cancelled notifications | INBOUND | Script Notifications (Outbound Webhooks) | Inbound webhook (push from IS) | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| Paid / Prepayment / Moneyback notifications | INBOUND | Script Notifications (Outbound Webhooks) | Inbound webhook (push from IS) | Webhooks / Notifications | Store → [Messenger integration (Facebook chatbot)](03-store.md#screen-messenger-integration-facebook-chatbot)<br>Contacts → [Profile — Available meeting place (Zoom integration)](04-contacts.md#screen-profile-available-meeting-place-zoom-integration) |
| PostBack notifications (third-party analytics) | INBOUND | Script Notifications (Outbound Webhooks) | Inbound webhook (push from IS) | Statistics / Report | Website → [Viral promotion statistics](02-website.md#screen-viral-promotion-statistics)<br>Website → [Survey statistics](02-website.md#screen-survey-statistics)<br>Campaigns → [Broadcasts Message Analytics](05-campaigns.md#screen-broadcasts-message-analytics)<br>Campaigns → [Analytics of Automatic Email](05-campaigns.md#screen-analytics-of-automatic-email)<br>Courses → [Course settings — "Reports" tab (per course)](07-courses.md#screen-course-settings-reports-tab-per-course)<br>Courses → [Courses → Reports (reports inbox)](07-courses.md#screen-courses-reports-reports-inbox)<br>Courses → [Reports → Filter modal](07-courses.md#screen-reports-filter-modal)<br>Courses → [Report card (single report)](07-courses.md#screen-report-card-single-report)<br>Affiliates → [Affiliate Management and Reporting](08-affiliates.md#screen-affiliate-management-and-reporting)<br>Reports → [Sales Statistics (Sales Report)](10-reports.md#screen-sales-statistics-sales-report)<br>Reports → [How to Import Expenses into your Reports (Expenses Import)](10-reports.md#screen-how-to-import-expenses-into-your-reports-expenses-import)<br>Reports → [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list)<br>Reports → [Subscription Statistics](10-reports.md#screen-subscription-statistics)<br>Reports → [Statistics via Email (Send statistics via email)](10-reports.md#screen-statistics-via-email-send-statistics-via-email)<br>Reports → [Sales Department (Sales Department Statistics)](10-reports.md#screen-sales-department-sales-department-statistics) |
| Zapier integration | — | Integrations | Reads/Writes | (unclassified) | *(no UI counterpart found)* |

## API 2.0

| Endpoint | Method | Group | Operation | Resource | UI screens that touch the same data |
|----------|--------|-------|-----------|----------|-------------------------------------|
| addupdatelead | POST | Contacts | Writes | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| addtagtolead | POST | Contacts | Writes | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| removetagfromlead | POST | Contacts | Writes | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| removeleadfromlist | POST | Contacts | Writes | Contact / Lead / Subscriber | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Add Lead](04-contacts.md#screen-add-lead)<br>Contacts → [Lead Card (Contact card)](04-contacts.md#screen-lead-card-contact-card)<br>Contacts → [Lead Card in Call Tasks](04-contacts.md#screen-lead-card-in-call-tasks)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Import Contacts — CSV Import](04-contacts.md#screen-import-contacts-csv-import)<br>Contacts → [Import Contacts — Text Import](04-contacts.md#screen-import-contacts-text-import)<br>Contacts → [Contact History (within Lead Card)](04-contacts.md#screen-contact-history-within-lead-card)<br>Campaigns → [Subscribers (Campaigns → Subscribers)](05-campaigns.md#screen-subscribers-campaigns-subscribers)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Advertise → [Leads](09-advertise.md#screen-leads)<br>Advertise → [Contact the Author](09-advertise.md#screen-contact-the-author) |
| createorder | POST | Orders | Writes | Order / Invoice | Store → [Order Buttons](03-store.md#screen-order-buttons)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Create an Order (manual / call-center)](03-store.md#screen-create-an-order-manual-call-center)<br>Store → [Order Management (Order Card / Order No.)](03-store.md#screen-order-management-order-card-order-no)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Store → [Add and Edit a Series of Payment Reminders via Email](03-store.md#screen-add-and-edit-a-series-of-payment-reminders-via-email)<br>Store → [Adding and Editing a Payment Reminder Email / Letter](03-store.md#screen-adding-and-editing-a-payment-reminder-email-letter)<br>Store → [Payment Method Setup — PayPal](03-store.md#screen-payment-method-setup-paypal)<br>Automation → [Task edit (inside lead/order card)](06-automation.md#screen-task-edit-inside-lead-order-card)<br>Affiliates → [The History of Payments to Partners](08-affiliates.md#screen-the-history-of-payments-to-partners)<br>Advertise → [Orders](09-advertise.md#screen-orders)<br>Advertise → [Payments](09-advertise.md#screen-payments)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| getpersonalmanagers | POST | Reference lookups (read-only) | Reads | Manager / User | Website → [File Manager](02-website.md#screen-file-manager)<br>Contacts → [Users (Creating and Managing Users)](04-contacts.md#screen-users-creating-and-managing-users)<br>Contacts → [Add / Edit User](04-contacts.md#screen-add-edit-user)<br>Automation → [Employee task view](06-automation.md#screen-employee-task-view)<br>Courses → [User profile](07-courses.md#screen-user-profile)<br>Courses → [Settings for unlimited plan renewal (in User profile)](07-courses.md#screen-settings-for-unlimited-plan-renewal-in-user-profile)<br>Reports → [Payments to the Managers](10-reports.md#screen-payments-to-the-managers) |
| getalllists | POST | Reference lookups (read-only) | Reads | Group / List | Funnels → [Categories (Contacts → Lists → Categories)](01-funnels.md#screen-categories-contacts-lists-categories)<br>Website → [Webinars list (Websites → Webinars)](02-website.md#screen-webinars-list-websites-webinars)<br>Website → [Promotions list (Website → Promotions)](02-website.md#screen-promotions-list-website-promotions)<br>Website → [Surveys list (Website → Surveys)](02-website.md#screen-surveys-list-website-surveys)<br>Store → [Products list](03-store.md#screen-products-list)<br>Store → [Product Categories (list)](03-store.md#screen-product-categories-list)<br>Store → [Co-authors (list)](03-store.md#screen-co-authors-list)<br>Store → [Coupons (Discount list)](03-store.md#screen-coupons-discount-list)<br>Store → [Orders (list)](03-store.md#screen-orders-list)<br>Store → [Payment reminder emails (list)](03-store.md#screen-payment-reminder-emails-list)<br>Contacts → [Leads (Contacts list)](04-contacts.md#screen-leads-contacts-list)<br>Contacts → [Contact Lists](04-contacts.md#screen-contact-lists)<br>Contacts → [Add and Edit Contact List (normal)](04-contacts.md#screen-add-and-edit-contact-list-normal)<br>Contacts → [Add and Edit Contact Auto-List](04-contacts.md#screen-add-and-edit-contact-auto-list)<br>Contacts → [Adding and Editing a Group of Inactive Contacts](04-contacts.md#screen-adding-and-editing-a-group-of-inactive-contacts)<br>Contacts → [Categories (list)](04-contacts.md#screen-categories-list)<br>Contacts → [Subscription Form Constructor](04-contacts.md#screen-subscription-form-constructor)<br>Campaigns → [Broadcasts list (Campaigns → Broadcasts)](05-campaigns.md#screen-broadcasts-list-campaigns-broadcasts)<br>Campaigns → [Sending and Editing Emails by Lists (Broadcast → By Lists)](05-campaigns.md#screen-sending-and-editing-emails-by-lists-broadcast-by-lists)<br>Campaigns → [Email Series list (Campaigns → Email Series)](05-campaigns.md#screen-email-series-list-campaigns-email-series)<br>Campaigns → [Sequences list (Campaigns → Sequences)](05-campaigns.md#screen-sequences-list-campaigns-sequences)<br>Campaigns → [My templates (Custom templates list)](05-campaigns.md#screen-my-templates-custom-templates-list)<br>Automation → [Processes list](06-automation.md#screen-processes-list)<br>Automation → [Rules list (Automatic rules)](06-automation.md#screen-rules-list-automatic-rules)<br>Courses → [Courses main page (course list)](07-courses.md#screen-courses-main-page-course-list)<br>Courses → [Subscription confirmation email (student)](07-courses.md#screen-subscription-confirmation-email-student)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-multi-leveled-affiliates-program-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Affiliates → [Promotional Materials for Attracting the Partners (per multi-leveled program list)](08-affiliates.md#screen-promotional-materials-for-attracting-the-partners-per-multi-leveled-program-list)<br>Affiliates → [Drafts for Partners. Adding and Editing a Subscription Form](08-affiliates.md#screen-drafts-for-partners-adding-and-editing-a-subscription-form)<br>Advertise → [Subscription Form Generator — Additional Fields](09-advertise.md#screen-subscription-form-generator-additional-fields)<br>Advertise → [Subscription Form Generator — Block Type](09-advertise.md#screen-subscription-form-generator-block-type)<br>Advertise → [Subscription Form Generator — Form View](09-advertise.md#screen-subscription-form-generator-form-view)<br>Advertise → [Subscription Form Generator — Button View](09-advertise.md#screen-subscription-form-generator-button-view)<br>Advertise → [Subscription Form Generator — Advertising Tag](09-advertise.md#screen-subscription-form-generator-advertising-tag)<br>Reports → [Sales Funnel Analytics (funnel list)](10-reports.md#screen-sales-funnel-analytics-funnel-list)<br>Reports → [Subscription Statistics](10-reports.md#screen-subscription-statistics) |
| getgoods | POST | Reference lookups (read-only) | Reads | Product / Good | Store → [Products list](03-store.md#screen-products-list)<br>Store → [Adding and Editing a Product](03-store.md#screen-adding-and-editing-a-product)<br>Store → [Product Categories (list)](03-store.md#screen-product-categories-list)<br>Store → [Adding and Editing Product Categories](03-store.md#screen-adding-and-editing-product-categories)<br>Store → [Products of the Co-Author](03-store.md#screen-products-of-the-co-author)<br>Store → [Adding and Editing a Joint Product](03-store.md#screen-adding-and-editing-a-joint-product)<br>Affiliates → [Adding and Editing Free Products (for the affiliate program)](08-affiliates.md#screen-adding-and-editing-free-products-for-the-affiliate-program)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Advertise → [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products)<br>Advertise → [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
| getcoupons | POST | Reference lookups (read-only) | Reads | Coupon / Discount | Website → [Promotions list (Website → Promotions)](02-website.md#screen-promotions-list-website-promotions)<br>Website → [Promotion — Basic information tab](02-website.md#screen-promotion-basic-information-tab)<br>Website → [Promotion — Additional information tab](02-website.md#screen-promotion-additional-information-tab)<br>Website → [Promotion — Gift for recommendation tab](02-website.md#screen-promotion-gift-for-recommendation-tab)<br>Website → [Viral Promotion Registration Form](02-website.md#screen-viral-promotion-registration-form)<br>Website → [Viral promotion statistics](02-website.md#screen-viral-promotion-statistics)<br>Store → [Coupons (Discount list)](03-store.md#screen-coupons-discount-list)<br>Store → [Create / Edit a Discount](03-store.md#screen-create-edit-a-discount)<br>Affiliates → [Promo for Affiliates. Free Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-free-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Paid Product Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-paid-product-promotional-materials-list)<br>Affiliates → [Promo for Affiliates. Multi-leveled Affiliates Program Promotional Materials (list)](08-affiliates.md#screen-promo-for-affiliates-multi-leveled-affiliates-program-promotional-materials-list)<br>Affiliates → [Selected Free Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-free-product-promotional-materials-per-product-list)<br>Affiliates → [Selected Paid Product Promotional Materials (per-product list)](08-affiliates.md#screen-selected-paid-product-promotional-materials-per-product-list)<br>Affiliates → [Promotional Materials for Attracting the Partners (per multi-leveled program list)](08-affiliates.md#screen-promotional-materials-for-attracting-the-partners-per-multi-leveled-program-list)<br>Advertise → [Promotional Drafts for Free Products](09-advertise.md#screen-promotional-drafts-for-free-products)<br>Advertise → [Promotional Drafts for Paid Products](09-advertise.md#screen-promotional-drafts-for-paid-products) |
