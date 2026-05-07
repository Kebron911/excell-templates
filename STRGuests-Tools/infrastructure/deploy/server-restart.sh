#!/usr/bin/env bash
# strguests.tools — server-side deploy script (Phase 6 Task 35)
#
# Runs on the Hostinger box via SSH from the deploy workflow. Idempotent:
# safe to re-run on every push to main.
#
# Layout on the box:
#   ~/strguests-api/                 ← server install root
#     .env                           ← hostinger.env (NOT committed)
#     server/                        ← rsync'd from STRGuests-Tools/server/
#     server/dist/                   ← compiled tsc output
#     node_modules/                  ← production-only install
#     ecosystem.config.cjs           ← pm2 process spec
#
# Static dist is FTP'd separately to ~/public_html/strguests/ by the workflow.

set -euo pipefail

API_ROOT="${API_ROOT:-$HOME/strguests-api}"
PM2_NAME="${PM2_NAME:-strguests-api}"

cd "$API_ROOT"

echo "[deploy] installing production dependencies (no devDeps)…"
pnpm install --prod --frozen-lockfile

echo "[deploy] compiling server tsc -> server/dist/…"
pnpm exec tsc -p server/tsconfig.json

# Optional: idempotent DB migration. Skips silently when MYSQL_* env vars
# are absent — the no-MySQL launch posture per hostinger.env.example.
if [ -n "${MYSQL_HOST:-}" ] && [ -n "${MYSQL_USER:-}" ] && [ -n "${MYSQL_DATABASE:-}" ]; then
  echo "[deploy] running db:migrate (MySQL configured)…"
  pnpm db:migrate
else
  echo "[deploy] MYSQL_* not set — skipping db:migrate (no-MySQL launch posture)"
fi

echo "[deploy] restarting pm2 process: $PM2_NAME"
if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
  pm2 reload "$PM2_NAME" --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

echo "[deploy] smoke /api/health…"
sleep 2
HEALTH_STATUS=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT:-3001}/api/health" || echo "000")
if [ "$HEALTH_STATUS" = "200" ]; then
  echo "[deploy] OK — /api/health returned 200"
else
  echo "[deploy] WARN — /api/health returned $HEALTH_STATUS"
  exit 1
fi
