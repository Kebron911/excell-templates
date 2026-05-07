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

# Read only STRLEDGER_* lines so adjacent project values (which may contain
# command-like strings) don't get evaluated by bash.
while IFS='=' read -r k v; do
  # strip optional surrounding quotes
  v="${v%\"}"; v="${v#\"}"
  v="${v%\'}"; v="${v#\'}"
  export "$k=$v"
done < <(grep -E '^STRLEDGER_[A-Z_]+=' "$ENV_FILE")

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

DRY=0
INIT_REMOTE_CONFIG="0"
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    --init)    INIT_REMOTE_CONFIG="1" ;;
    *) echo "Unknown arg: $arg"; exit 2 ;;
  esac
done

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$REPO_ROOT/site/public"
DST_PATH="$STRLEDGER_DOC_ROOT"
SSH_TARGET="$STRLEDGER_SSH_USER@$STRLEDGER_SSH_HOST"

echo "=== Deploy thestrledger.com ==="
echo "From: $SRC/"
echo "To:   $SSH_TARGET:$DST_PATH/  (port $STRLEDGER_SSH_PORT, key $KEY_PATH)"
[[ "$DRY" == "1" ]] && echo "Mode: DRY RUN"

SSH=(ssh -i "$KEY_PATH" -p "$STRLEDGER_SSH_PORT" -o StrictHostKeyChecking=accept-new)
SCP=(scp -i "$KEY_PATH" -P "$STRLEDGER_SSH_PORT" -o StrictHostKeyChecking=accept-new)

# Pick transport: rsync if available, else sftp/scp
if command -v rsync >/dev/null 2>&1; then
  TRANSPORT="rsync"
else
  TRANSPORT="sftp"
fi
echo "Transport: $TRANSPORT"

# Ensure config.php exists on server
if [[ "$INIT_REMOTE_CONFIG" == "1" ]]; then
  echo "--- Ensuring _config/config.php exists on server ---"
  if [[ "$DRY" == "1" ]]; then
    echo "[dry-run] would: ssh $SSH_TARGET -- '[ -f $DST_PATH/_config/config.php ] || cp $DST_PATH/_config/config.example.php $DST_PATH/_config/config.php'"
  else
    "${SSH[@]}" "$SSH_TARGET" "[ -f '$DST_PATH/_config/config.php' ] || cp '$DST_PATH/_config/config.example.php' '$DST_PATH/_config/config.php'" || true
  fi
fi

case "$TRANSPORT" in
  rsync)
    DRY_FLAG=""; [[ "$DRY" == "1" ]] && DRY_FLAG="--dry-run"
    rsync -avz --delete $DRY_FLAG \
      --exclude="_config/config.php" \
      --exclude="_data/leads-*.log" \
      -e "ssh -i \"$KEY_PATH\" -p $STRLEDGER_SSH_PORT -o StrictHostKeyChecking=accept-new" \
      "$SRC/" "$SSH_TARGET:$DST_PATH/"
    ;;
  sftp)
    # Build a sftp batch file that mirrors $SRC to $DST_PATH.
    # Excludes _config/config.php and _data/leads-*.log
    BATCH="$(mktemp)"; trap 'rm -f "$BATCH"' EXIT
    {
      while IFS= read -r -d '' f; do
        rel="${f#$SRC/}"
        # apply excludes
        case "$rel" in
          _config/config.php) continue ;;
          _data/leads-*.log)  continue ;;
        esac
        # mkdir -p remote dir
        d=$(dirname "$rel")
        if [[ "$d" != "." ]]; then
          # idempotent: -mkdir prefix ignores existing-dir errors
          IFS='/' read -ra parts <<< "$d"
          path="$DST_PATH"
          for p in "${parts[@]}"; do
            path="$path/$p"
            echo "-mkdir \"$path\""
          done
        fi
        echo "put -p \"$f\" \"$DST_PATH/$rel\""
      done < <(find "$SRC" -type f -print0)
    } > "$BATCH"
    echo "Transferring $(grep -c ^put "$BATCH") files via sftp..."
    if [[ "$DRY" == "1" ]]; then
      echo "[dry-run] sftp batch preview (first 20 lines):"
      head -20 "$BATCH"
      echo "..."
      echo "Total operations: $(wc -l < "$BATCH")"
    else
      sftp -b "$BATCH" -i "$KEY_PATH" -P "$STRLEDGER_SSH_PORT" \
        -o StrictHostKeyChecking=accept-new \
        "$SSH_TARGET" >/tmp/sftp.log 2>&1 \
        && echo "sftp OK" \
        || { echo "sftp FAILED — see /tmp/sftp.log"; tail -30 /tmp/sftp.log; exit 3; }
    fi
    ;;
esac

echo "=== Done. Verify https://thestrledger.com ==="
