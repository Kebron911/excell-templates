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
