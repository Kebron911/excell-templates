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
