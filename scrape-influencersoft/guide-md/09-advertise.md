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
