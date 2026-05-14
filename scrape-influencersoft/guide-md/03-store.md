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
