#!/usr/bin/env bash
# set-strmanuals-github-secrets.sh
#
# ⚠ KNOWN BUG (2026-05-12) — DO NOT RUN AS-IS ⚠
# ─────────────────────────────────────────────
# This script's `gh secret set "$name" --body "$value"` calls silently
# write 1-char values instead of full secret values (verified by CI diag
# on 2026-05-12: deployed .env had line lengths of 20 = "KEY=" + 1 char
# for every secret set by this script). Running it CORRUPTS all 7
# strmanuals secrets and breaks production deploys.
#
# Workaround that DOES work — set each secret individually via printf:
#   printf 'https://buy.stripe.com/aFa5kD6SxaC00qdeynb3q14' \
#     | gh secret set STRMANUALS_STRIPE_LINK_TAX_01 --repo Kebron911/excell-templates
#
# Suspected cause: --body flag handling in this environment's gh CLI
# (Windows git-bash + bash 5 + gh 2.x) has a quoting/escaping quirk
# with array-stored values. printf-piped --body-file (no --body) works
# reliably.
#
# Fix needed: replace the `gh secret set ... --body "$value"` calls in
# the loop below with `printf '%s' "$value" | gh secret set ...` (no
# --body flag, value comes via stdin). Then this header warning can
# be deleted.
#
# Until then: USE --check MODE ONLY, or set secrets individually via
# the printf pattern above.
# ─────────────────────────────────────────────
#
# One-shot bootstrap of every GitHub Actions repo secret the
# deploy-strmanuals workflow needs. Idempotent — gh secret set
# overwrites silently if the secret already exists.
#
# Usage:
#   bash infrastructure/scripts/set-strmanuals-github-secrets.sh --check  # SAFE: verify presence only
#   bash infrastructure/scripts/set-strmanuals-github-secrets.sh --dry    # SAFE: print, no write
#   bash infrastructure/scripts/set-strmanuals-github-secrets.sh          # ⚠ BROKEN — corrupts secrets, see header
#   bash infrastructure/scripts/set-strmanuals-github-secrets.sh --check # verify presence only
#
# Requirements:
#   - gh CLI authenticated to the repo (gh auth login).
#   - Run from repo root OR cd to repo root happens inside.
#   - STR_SSH_KEY must already exist (shared with ledger/guests) —
#     this script does NOT set it because the private key shouldn't
#     be in any file readable by Claude. Set it manually via:
#       gh secret set STR_SSH_KEY < /path/to/cluster_ed25519
#
# All values below are derived from already-public artifacts:
#   - Payment links: ops/strmanuals-stripe-results.csv (committed)
#   - n8n base URL: root .env N8N_BASE_URL
#   - Download hash: STRManuals/site/.env STRMANUALS_DOWNLOAD_HASH

set -euo pipefail

MODE="set"
case "${1:-}" in
  --dry)   MODE="dry" ;;
  --check) MODE="check" ;;
esac

# Resolve repo root robustly regardless of where the script is invoked.
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Derive sensitive-but-non-secret values from disk so they stay in sync.
HASH="$(grep '^STRMANUALS_DOWNLOAD_HASH=' STRManuals/site/.env | cut -d= -f2- | tr -d '"')"
N8N_BASE="$(grep '^N8N_BASE_URL=' .env | cut -d= -f2- | tr -d '"')"

if [ -z "$HASH" ]; then
  echo "ERROR: STRMANUALS_DOWNLOAD_HASH missing from STRManuals/site/.env"
  exit 2
fi
if [ -z "$N8N_BASE" ]; then
  echo "ERROR: N8N_BASE_URL missing from root .env"
  exit 2
fi

# (name, value) pairs — payment-link values verbatim from ops/strmanuals-stripe-results.csv.
declare -A SECRETS=(
  [STRMANUALS_STRIPE_LINK_TAX_01]='https://buy.stripe.com/aFa5kD6SxaC00qdeynb3q14'
  [STRMANUALS_STRIPE_LINK_TAX_02]='https://buy.stripe.com/8x2eVd5OtdOc8WJcqfb3q15'
  [STRMANUALS_STRIPE_LINK_REV_01]='https://buy.stripe.com/28E4gz4KpcK83Cp2PFb3q16'
  [STRMANUALS_STRIPE_LINK_REV_02]='https://buy.stripe.com/9B6cN5ekZdOcgpbcqfb3q17'
  [STRMANUALS_STRIPE_LINK_LGL_01]='https://buy.stripe.com/9B6eVd6SxcK8a0Nbmbb3q18'
  [STRMANUALS_STRIPE_LINK_BUNDLE]='https://buy.stripe.com/6oU9ATa4J6lKeh3bmbb3q19'
  [PUBLIC_N8N_WEBHOOK_BASE]="$N8N_BASE"
  [STRMANUALS_DOWNLOAD_HASH]="$HASH"
)

# Names that we expect to already exist (managed elsewhere). Checked only.
EXTERNAL_NAMES=( STR_SSH_KEY )

repo="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
echo "Repo: $repo"
echo "Mode: $MODE"
echo

if [ "$MODE" = "check" ]; then
  echo "=== checking presence ==="
  existing="$(gh secret list --json name --jq '.[].name' | tr '\n' ' ')"
  for name in "${!SECRETS[@]}" "${EXTERNAL_NAMES[@]}"; do
    if echo " $existing " | grep -q " $name "; then
      echo "  OK     $name"
    else
      echo "  MISS   $name"
    fi
  done
  exit 0
fi

# Order keys for deterministic output.
ordered_keys=(
  STRMANUALS_STRIPE_LINK_TAX_01
  STRMANUALS_STRIPE_LINK_TAX_02
  STRMANUALS_STRIPE_LINK_REV_01
  STRMANUALS_STRIPE_LINK_REV_02
  STRMANUALS_STRIPE_LINK_LGL_01
  STRMANUALS_STRIPE_LINK_BUNDLE
  PUBLIC_N8N_WEBHOOK_BASE
  STRMANUALS_DOWNLOAD_HASH
)

for name in "${ordered_keys[@]}"; do
  value="${SECRETS[$name]}"
  preview="${value:0:30}"
  if [ "${#value}" -gt 30 ]; then preview="${preview}..."; fi
  if [ "$MODE" = "dry" ]; then
    printf "  DRY    %-35s = %s\n" "$name" "$preview"
  else
    printf "  SET    %-35s = %s\n" "$name" "$preview"
    printf '%s' "$value" | gh secret set "$name" --body -
  fi
done

echo
echo "Reminders:"
echo "  - STR_SSH_KEY must be set separately (manual, private-key file):"
echo "      gh secret set STR_SSH_KEY < ~/.ssh/cluster_ed25519"
echo "  - Mirror STRMANUALS_DOWNLOAD_HASH into the n8n env too — W01b/W08 read it."
echo
if [ "$MODE" = "dry" ]; then
  echo "Dry run complete. Re-run without --dry to actually write to GitHub."
else
  echo "Done. Verify with: bash $0 --check"
fi
