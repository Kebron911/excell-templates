# @str/pinforge

Pinterest pin generator (engine + CLI). See `docs/superpowers/specs/2026-05-16-pinforge-design.md`.

## Quickstart

```bash
pnpm -F @str/pinforge build
pnpm pinforge generate --brand strguests --topic "7 house rules" --keyword "airbnb house rules" --url https://strguests.tools/house-rules
```

## Live smoke test

Hits real OpenAI + n8n. Requires `OPENAI_API_KEY` (and optionally `N8N_BASE_URL` + `N8N_PIN_KEY`) in env.

```bash
LIVE=1 pnpm -F @str/pinforge test live/smoke
```

## URL input mode

Instead of `--topic + --keyword`, pass a URL and PinForge will scrape it and generate pin copy grounded in the source content:

```bash
pnpm pinforge:cli generate \
  --brand strguests \
  --topic "house rules" \
  --keyword "airbnb house rules" \
  --url https://strguests.tools/house-rules-generator \
  --input-mode url \
  --source-url https://strguests.tools/blog/7-house-rules-that-stop-bad-reviews \
  --bg image
```

`--topic` and `--keyword` are still required — they're used for slug + organizational metadata, not for the SEO copy. The actual pin content comes from the AI rewriting the scraped page.

In CSV, add `inputMode,sourceUrl` columns:

```csv
brandId,topic,primaryKeyword,destinationUrl,inputMode,sourceUrl
strguests,house rules,airbnb rules,https://strguests.tools/x,url,https://strguests.tools/blog/post
```

### What gets scraped

- `<title>`, `<h1>`, `<meta name="description">`, OpenGraph tags
- Body excerpt (<=500 chars, prefers `<article>` then `<main>`)
- Nav/header/footer/script/style are stripped

### Safety

- Sources are fetched HTTP GET with 15s timeout, 2MB cap
- Only `http(s)://` URLs accepted
- The AI is instructed to **rewrite** (not paste-through) the source content
- The pin's `destinationUrl` field can be different from `sourceUrl` (e.g., scrape a blog post, but link the pin to your product page)
