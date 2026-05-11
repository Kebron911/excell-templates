# Outreach templates

Voice guide + templates used by W41/W34/W45 when Claude drafts on Daniel's behalf. Locked to brand voice from [brand/brand-decisions.md §6](../../brand/brand-decisions.md).

## When each template fires

| Template | Workflow | Who's reading |
|----------|----------|---------------|
| [voice-guide.md](./voice-guide.md) | All — loaded into every Claude draft prompt | Internal |
| [social-question-answer.md](./social-question-answer.md) | W41 — Reddit/Quora/HN answer drafts | Subreddit/Quora readers (cold) |
| [unlinked-mention-reclaim.md](./unlinked-mention-reclaim.md) | W34 — outreach to publishers who mentioned us without linking | Editor / blog writer (warm — they already covered us) |
| [customer-embed-ask.md](./customer-embed-ask.md) | W45 Branch A — Day-21 follow-up to happy customers | Existing customer (warm) |

## Versioning

When templates change, bump the trailing `version` field in frontmatter. n8n workflows pin to a specific version so Claude drafts stay stable across iterations. To roll out a new version safely:

1. Edit template, bump version (`v2` → `v3`)
2. Test in n8n staging with sample inputs
3. Update workflow JSON to pin to new version
4. Activate in production
5. Watch first 5 sends; rollback the workflow pin if quality dips

## Why these matter

Bad outreach burns sender reputation, gets accounts banned, and damages brand. Locked templates with a single voice profile keep Claude drafts within bounds. **No template is sent unread** — every W34/W41/W45 send goes through Daniel's Slack approval first.
