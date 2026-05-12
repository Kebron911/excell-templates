#!/usr/bin/env bash
# n8n-fixes.sh — apply 4 fixes to docker-compose.yml on the homelab box
# Authored: 2026-05-12
#
# Run as n8n-ops (or kebron) on the box:
#   bash ~/n8n-fixes.sh
#
# Effects:
#   1. Backup compose to docker-compose.yml.bak-2026-05-12
#   2. Bump n8n memory limit 512M -> 1024M
#   3. Remove QUEUE_HEALTH_CHECK_ACTIVE=true from both n8n + chipn8n (no-op flag without Redis)
#   4. Remove "ports: 5678:5678" from n8n (Traefik already routes; direct port = TLS bypass)
#   5. Validate compose yaml; restore backup if invalid
#   6. Show diff
#
# Does NOT restart any container. You restart manually after reviewing the diff.

set -uo pipefail
COMPOSE=/home/kebron/git/mydocker/docker-compose.yml
BAK=/home/kebron/git/mydocker/docker-compose.yml.bak-2026-05-12

if [ ! -f "$COMPOSE" ]; then
  echo "FAIL: $COMPOSE not found"
  exit 1
fi

# Re-create backup if missing (idempotent)
if [ ! -f "$BAK" ]; then
  cp -v "$COMPOSE" "$BAK"
else
  echo "(backup already exists at $BAK)"
fi

echo ""
echo "=== preview matches before editing ==="
echo "--- live QUEUE_HEALTH (will delete both):"
grep -n '^      - QUEUE_HEALTH_CHECK_ACTIVE=true' "$COMPOSE" || echo "(none — already removed?)"
echo "--- n8n memory limit (will bump 512M -> 1024M):"
grep -n 'memory: 512M' "$COMPOSE" || echo "(none)"
echo "--- ports lines in n8n block:"
sed -n '/^  n8n:/,/^  linkwarden:/p' "$COMPOSE" | grep -nE '^    ports:|5678:5678' || echo "(none)"

echo ""
echo "=== applying edits ==="
sed -i '/^      - QUEUE_HEALTH_CHECK_ACTIVE=true/d' "$COMPOSE"
sed -i '/^  n8n:/,/^  linkwarden:/ s/memory: 512M/memory: 1024M/' "$COMPOSE"
sed -i '/^  n8n:/,/^  linkwarden:/ { /^    ports:/ { N; /5678:5678/d } }' "$COMPOSE"
echo "edits applied"

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
echo "=== next step ==="
echo "If diff looks right, restart n8n with:"
echo "  cd /home/kebron/git/mydocker && docker compose up -d n8n"
echo ""
echo "Then verify with:"
echo "  docker logs n8n --tail 30"
echo "  docker stats n8n --no-stream"
