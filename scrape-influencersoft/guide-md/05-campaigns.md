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
