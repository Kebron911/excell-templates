#!/usr/bin/env bash
# verify-tag-and-sequence-methods.sh
#
# Probes the InfluencerSoft tenant (kebron.influencersoft.com) to discover
# which PascalCase method names actually accept tag-application and
# sequence-assignment calls. Both W01b and W08 workflows currently use
# `AddTag` + `AssignToSequence` as plausible-but-unverified placeholders.
#
# Strategy: send the same payload to each candidate name and watch the
# HTTP status + response shape.
#   - 200 + non-error body  → method exists, call shape probably correct
#   - 200 + "Method not found"-style body → IS returns 200 for everything;
#     read the body to tell success from soft-fail
#   - 404                   → endpoint does not exist
#   - 401/403               → auth/permission issue (not a name issue)
#
# Usage:
#   1. Source the repo root .env so $INFLUENCERSOFT_API_KEY is set:
#        set -a; source .env; set +a
#   2. Run:
#        bash infrastructure/influencersoft/verify-tag-and-sequence-methods.sh
#   3. Read the per-method block at the bottom and pick the names that
#     return success. Update the two HTTP nodes in
#     W01b-order-ingestion-strmanuals.json + W08-lead-magnet-strmanuals.json
#     to match.

set -euo pipefail

BASE="https://kebron.influencersoft.com/api"
KEY="${INFLUENCERSOFT_API_KEY:?Set INFLUENCERSOFT_API_KEY from repo root .env}"
TEST_EMAIL="${TEST_EMAIL:-claude-verify@example.com}"  # override for real testing

# Sanity-check connectivity against a known-good method (per memory note).
echo "=== Sanity: GetAllGroups (known-200) ==="
curl -sS -o /tmp/is-getgroups.json -w "HTTP %{http_code}  bytes=%{size_download}\n" \
  -X POST "$BASE/GetAllGroups" \
  -H "Content-Type: application/json" \
  -d "{\"rpsKey\":\"$KEY\"}"
head -c 200 /tmp/is-getgroups.json; echo

# --- TAG candidates ---
# IS commonly names tag-application one of these. We try the most likely
# names — confirm which returns success and update the workflow JSON.
TAG_METHODS=(
  AddTag
  AddTagToContact
  AddContactTag
  TagContact
  AddTagsToContact
  ApplyTag
  AssignTag
)

echo
echo "=== Probing TAG application methods ==="
for m in "${TAG_METHODS[@]}"; do
  echo "--- $m ---"
  curl -sS -o "/tmp/is-tag-$m.json" -w "HTTP %{http_code}  bytes=%{size_download}\n" \
    -X POST "$BASE/$m" \
    -H "Content-Type: application/json" \
    -d "{\"rpsKey\":\"$KEY\",\"email\":\"$TEST_EMAIL\",\"tags\":[\"test:claude-verify\"],\"tag\":\"test:claude-verify\"}"
  head -c 250 "/tmp/is-tag-$m.json"; echo
done

# --- SEQUENCE candidates ---
SEQ_METHODS=(
  AssignToSequence
  AddToSequence
  AssignSequence
  StartSequence
  EnrollSequence
  EnrollInSequence
  AssignContactToSequence
)

echo
echo "=== Probing SEQUENCE assignment methods ==="
for m in "${SEQ_METHODS[@]}"; do
  echo "--- $m ---"
  curl -sS -o "/tmp/is-seq-$m.json" -w "HTTP %{http_code}  bytes=%{size_download}\n" \
    -X POST "$BASE/$m" \
    -H "Content-Type: application/json" \
    -d "{\"rpsKey\":\"$KEY\",\"email\":\"$TEST_EMAIL\",\"sequence\":\"strmanuals-order-confirmation\",\"sequenceName\":\"strmanuals-order-confirmation\"}"
  head -c 250 "/tmp/is-seq-$m.json"; echo
done

# --- DISCOVERY (long shot) ---
# Some tenants expose a listing endpoint. Worth a single probe.
echo
echo "=== Long-shot discovery: GetAllMethods / GetMethods ==="
for m in GetAllMethods GetMethods ListMethods GetApiMethods; do
  curl -sS -o "/tmp/is-disc-$m.json" -w "$m → HTTP %{http_code}\n" \
    -X POST "$BASE/$m" -H "Content-Type: application/json" \
    -d "{\"rpsKey\":\"$KEY\"}" || true
done

echo
echo "Done. Read /tmp/is-tag-*.json and /tmp/is-seq-*.json to see full responses."
echo "Whichever returns a clearly-successful body (not 'method not found' / not 404)"
echo "is the real name. Update the HTTP nodes in:"
echo "  infrastructure/n8n/workflows/W01b-order-ingestion-strmanuals.json"
echo "  infrastructure/n8n/workflows/W08-lead-magnet-strmanuals.json"
