#!/usr/bin/env bash
# n8n-env-fixes.sh v2 — anchored pattern fixes the duplicate-insert bug from v1
set -uo pipefail
COMPOSE=/home/kebron/git/mydocker/docker-compose.yml
BAK=/home/kebron/git/mydocker/docker-compose.yml.bak-env-2026-05-12

if [ ! -f "$COMPOSE" ]; then echo "FAIL: $COMPOSE missing"; exit 1; fi
# Backup only if not already present (idempotent)
if [ ! -f "$BAK" ]; then cp -v "$COMPOSE" "$BAK"; else echo "(backup at $BAK)"; fi

# Bail if any of the 4 vars already exist (idempotent)
if grep -q '^      - DB_SQLITE_POOL_SIZE=' "$COMPOSE"; then
  echo "(env vars already present — skipping insert)"
else
  # Single-line sed with \n escapes. Anchored "      - " excludes "#- " commented lines.
  # Range bounded to n8n service block only (not chipn8n).
  sed -i '/^  n8n:/,/^  linkwarden:/ s/^      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true.*$/&\n      - DB_SQLITE_POOL_SIZE=4\n      - N8N_RUNNERS_ENABLED=true\n      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false\n      - N8N_GIT_NODE_DISABLE_BARE_REPOS=true/' "$COMPOSE"
fi

echo ""
echo "=== validating compose ==="
cd /home/kebron/git/mydocker
if docker compose config --quiet 2>&1; then
  echo "VALID"
else
  echo "INVALID — restoring backup"
  cp "$BAK" "$COMPOSE"
  exit 2
fi

echo ""
echo "=== diff ==="
diff "$BAK" "$COMPOSE" || true

echo ""
echo "=== n8n env vars in current compose ==="
sed -n '/^  n8n:/,/^    labels:/p' "$COMPOSE" | grep -E '^      - [A-Z]'
