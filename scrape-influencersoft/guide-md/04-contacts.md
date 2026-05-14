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
