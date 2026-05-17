# @str/pinforge-api

REST API wrapping `@str/pinforge`. See `docs/superpowers/specs/2026-05-16-pinforge-design.md` section 9.

## Quickstart

```bash
pnpm -F @str/pinforge-api build
PINFORGE_API_KEY=secret-key pnpm -F @str/pinforge-api start
curl http://localhost:8787/healthz
```
