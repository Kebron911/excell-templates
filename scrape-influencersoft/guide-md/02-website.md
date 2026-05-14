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
