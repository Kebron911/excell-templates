# UI Chapter Template — InfluencerSoft End-User Guide

> **Audience:** End user who asks "I want to do X in InfluencerSoft, how do I do it? What values and screens will I see? What options do I have?"
>
> **Tone:** Direct, terminology-precise, exhaustive. No marketing fluff. No "in this section we will…" filler.
> **Voice:** Imperative for steps ("Click X"), declarative for descriptions.
> **Depth:** Capture every field, button, dropdown option, toggle, validation rule, and outcome mentioned in source articles. Leave nothing out unless duplicate.

---

## Required structure (use these exact `##` headings, in this order)

```markdown
# {Section Name}

## Overview
2–5 sentences. What this area of InfluencerSoft is for, who uses it, where it sits in the product. End with one sentence stating what the rest of the chapter covers.

## Where to find it
Navigation path(s) from the main menu. Example: `Top menu → Contacts → Lists → Add new`. If multiple entry points exist, list them all.

## Terminology
Bullet list. Term in **bold**, then short definition. Pull every domain-specific term used in this section's articles (e.g., "Auto-list", "Lead magnet", "FBL", "DKIM"). Aim for the reader being able to read this glossary and understand any sentence in the chapter.

## Screens and fields
For every screen, modal, tab, or panel mentioned in the source articles, create a `### Screen: {name}` subsection with:

### Screen: {name}
- **Purpose:** one sentence
- **How to open:** click path
- **Fields:** Markdown table — `| Field | Type | Required | Description / Allowed values | Default |`
  - Type = text / number / dropdown / toggle / date / file / WYSIWYG / etc.
  - List every option of every dropdown.
  - Note any character limits, format constraints, validation messages.
- **Buttons and actions:** Bullet list. Each = button label, what clicking it does, where it sends the user.
- **Tabs / subscreens:** If the screen has tabs, list them and what each contains.
- **Notes:** Any conditional UI ("This field appears only if X is selected"), permissions ("Only admins can…"), or warnings called out in the source.

Repeat `### Screen:` blocks until every screen in the section is documented.

## Common tasks
For every "How to do X" workflow found in the source articles, write:

### How do I {task}?
1. Numbered step (imperative). Name the screen, button, or field explicitly.
2. ...
3. ...

**Result:** What happens after the last step.
**Options along the way:** Bullet list of decision points (e.g., "At step 3 you can choose A, B, or C — see Screen: X for differences").
**Gotchas:** Validation errors, irreversibility, permission requirements, related side effects.

Cover at minimum every task the source articles describe. Add a "How do I…" entry per article when natural.

## Cross-references
- **Related section:** {Section name} — one-line reason it relates (e.g., "Triggers from Automation can act on Contacts auto-lists").

## Source articles
Bulleted list. Every article in this section, in original title order. Format: `- [Title](URL)` using the `URL:` value from each per-article Markdown file's header.
```

---

## Rules

1. **No hallucination.** If a screen, field, or option is not in the source articles, do not invent it. If a source is ambiguous, write what it says verbatim and flag it: `> Source unclear: …`.
2. **Exhaustive on fields.** Every named field gets a row. If the source doesn't state the type, write "text (assumed)".
3. **Exhaustive on options.** If a dropdown is mentioned but options aren't listed, write `Options: not enumerated in source`.
4. **Preserve UI labels exactly** as they appear in the source (capitalization, punctuation).
5. **Internal cross-links inside the source articles** (article-to-article references) should be converted to text mentions of the target screen/feature, with the original URL preserved in parentheses on first mention only.
6. **Do not include images.** Skip them — this is a text reference. If an image caption carries info not in the surrounding text, fold the info into prose.
7. **Length is not a target.** Be as long as accuracy requires. A 30-article section will produce a long chapter. A 4-article one will be short. Do not pad.
8. **Markdown only.** No HTML, no front-matter, no emoji.
