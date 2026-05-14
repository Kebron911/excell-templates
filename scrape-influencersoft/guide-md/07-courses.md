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
