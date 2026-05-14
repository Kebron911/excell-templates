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
