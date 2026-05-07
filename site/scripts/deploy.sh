#!/usr/bin/env bash
# Deploy thestrledger.com to Hostinger over SSH (rsync).
#
# Reads STRLEDGER_* values from .secrets/hostinger.env at the Claude OS root.
# Pushes site/public/* to STRLEDGER_DOC_ROOT.
#
# Usage:
#   bash site/scripts/deploy.sh [--dry-run] [--init]
#
# --dry-run : show what would be transferred, no actual changes
# --init    : copy public/_config/config.example.php → public/_config/config.php
#             on the server if config.php doesn't already exist (one-time)

set -euo pipefail

ENV_FILE="${ENV_FILE:-/c/Users/Kebron/Desktop/Claude OS/.secrets/hostinger.env}"
[[ -f "$ENV_FILE" ]] || { echo "ERR: env file not found: $ENV_FILE"; exit 1; }

# Source only STRLEDGER_* vars
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

: "${STRLEDGER_SSH_HOST:?missing}"
: "${STRLEDGER_SSH_USER:?missing}"
: "${STRLEDGER_SSH_PORT:?missing}"
: "${STRLEDGER_SSH_KEY_PATH:?missing}"
: "${STRLEDGER_DOC_ROOT:?missing}"

# Translate Windows-style key path for OpenSSH on git-bash / wsl
KEY_PATH="$STRLEDGER_SSH_KEY_PATH"
if [[ "$KEY_PATH" =~ ^[A-Za-z]:\\ ]]; then
  drive="${KEY_PATH:0:1}"
  rest="${KEY_PATH:2}"
  KEY_PATH="/${drive,,}${rest//\\//}"
fi

DRY=""
INIT_REMOTE_CONFIG="0"
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY="--dry-run" ;;
    --init)    INIT_REMOTE_CONFIG="1" ;;
    *) echo "Unknown arg: $arg"; exit 2 ;;
  esac
done

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$REPO_ROOT/site/public/"
DST="$STRLEDGER_SSH_USER@$STRLEDGER_SSH_HOST:$STRLEDGER_DOC_ROOT/"

echo "=== Deploy thestrledger.com ==="
echo "From: $SRC"
echo "To:   $DST  (port $STRLEDGER_SSH_PORT, key $KEY_PATH)"
[[ -n "$DRY" ]] && echo "Mode: DRY RUN"

SSH_CMD="ssh -i \"$KEY_PATH\" -p $STRLEDGER_SSH_PORT -o StrictHostKeyChecking=accept-new"

# Optional: ensure config.php exists on server
if [[ "$INIT_REMOTE_CONFIG" == "1" ]]; then
  echo "--- Ensuring _config/config.php exists on server ---"
  eval "$SSH_CMD $STRLEDGER_SSH_USER@$STRLEDGER_SSH_HOST" "[ -f $STRLEDGER_DOC_ROOT/_config/config.php ] || cp $STRLEDGER_DOC_ROOT/_config/config.example.php $STRLEDGER_DOC_ROOT/_config/config.php" || true
fi

# Excludes — never push the real config.php; never push leads logs
rsync -avz --delete $DRY \
  --exclude="_config/config.php" \
  --exclude="_data/leads-*.log" \
  -e "$SSH_CMD" \
  "$SRC" "$DST"

echo "=== Done. Verify https://thestrledger.com ==="
