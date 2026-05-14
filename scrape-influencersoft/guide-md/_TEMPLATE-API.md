# API Chapter Template — InfluencerSoft End-User Guide

> **Audience:** Developer who asks "I want to do X via the InfluencerSoft API, what endpoint do I call? What parameters? What do I get back?"

---

## Required structure

```markdown
# {API Section Name} (e.g., API 1.0 or API 2.0)

## Overview
What this API does, its versioning context (1.0 vs 2.0), authentication model, base URL pattern, request/response format (form-encoded? JSON?), and any global conventions stated in the source.

## Authentication
How requests are authenticated (API key, session token, signed request). Where the credentials come from in the UI. Any rate limits mentioned.

## Conventions
- Base URL
- Request format (HTTP method, content-type)
- Response format (JSON / XML / form-encoded — quote what source says)
- Common parameters present on every request (e.g., `key`, `format`, `login`)
- Pagination model if any
- Date / timezone format
- Identifier conventions (e.g., country IDs, currency IDs — link to reference articles)

## Response statuses and error codes
Markdown table — every status code and error description mentioned across the API articles. Columns: `| Code | Meaning | When it happens |`. Pull from the dedicated "API Response Statuses, Codes, and Descriptions" article if present, and merge anything additional surfaced in other articles.

## Endpoints
For each endpoint (one article = one endpoint, usually), produce:

### `{verb}` {endpoint-name} — {one-line purpose}
- **Source article:** [Title](URL)
- **URL pattern:** full URL including base
- **HTTP method:** GET / POST / etc. (state "not specified in source" if absent)
- **Purpose:** 1–2 sentences
- **Parameters:**

  | Name | In (query/body) | Type | Required | Description / Allowed values | Default |
  |------|-----------------|------|----------|------------------------------|---------|

  Include every parameter mentioned. Enumerate accepted values exactly as stated.
- **Request example:** Code block if the source gives one (or a reconstructed one labeled `// reconstructed from source`).
- **Response:** Code block with example. Describe each field of the response in a follow-up bullet list.
- **Error responses:** Specific error codes returned by this endpoint, with conditions.
- **Notes:** Quirks, ordering of parameters, dependencies on other endpoints, deprecation flags.

Group endpoints by resource if natural (Contacts / Orders / Products / Coupons / Lists / Tags / Stats), or list alphabetically by name. Pick whichever order makes the chapter easiest to scan and use a `### Group: {name}` heading.

## Reference data
If the source contains lookup tables (country codes, currency codes, status code lists, payment system identifiers), reproduce them in full as Markdown tables under a `## Reference: {name}` heading.

## Common tasks
### How do I {task} via API?
Step-by-step combining 2+ endpoints when the task spans multiple calls (e.g., "Create a contact, add to a group, then assign a tag").

## Cross-references
- UI counterpart: which UI chapter exposes the same data (e.g., Contacts UI ↔ API contact endpoints).

## Source articles
Bulleted list of every article in this section, in original order.
```

---

## Rules

1. **Reproduce parameter names exactly.** Case-sensitive.
2. **Every parameter, every code, every field.** Exhaustive — that is the value of this chapter.
3. **If the source gives an example URL with concrete values, keep it.** Then provide a generalized form alongside.
4. **Mark "not specified in source"** when something obvious (like HTTP method or content-type) is missing.
5. **No fabricated endpoints, parameters, or codes.**
6. **Markdown only.** No HTML, no images, no emoji.
