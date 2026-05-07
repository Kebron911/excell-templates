# Phase 3 — AI generators (tools 5–7) + server endpoints

**Goal:** Three AI-backed generators (listing description, review response, message templates) live on Express endpoints with email-verify + rate-limit middleware. Code-only build — all tests use a mocked Anthropic SDK; live `ANTHROPIC_API_KEY` deferred to deploy.

**Source plan:** [`docs/superpowers/plans/2026-05-05-strguests-tools.md`](../../../docs/superpowers/plans/2026-05-05-strguests-tools.md)

**Provider decision (locks open question 13 from spec):** `@anthropic-ai/sdk` with `claude-haiku-4-5` as the default model. Rationale: cheaper than GPT-4o-mini per token, matches CLAUDE.md preference, and the wrapper module isolates the SDK behind a `generate(promptVersion, vars) → { text, usage }` contract so a swap to OpenAI is one-file at any point. The `OPENAI_API_KEY` env name is preserved as a secondary fallback path but the primary key is `ANTHROPIC_API_KEY`.

**Requirements satisfied:** R1.5–R1.7 (three AI generators), R3.2 (AI interaction model + rate limit), R8.1 (server endpoints), R10 (AI safety + cost control)

**Acceptance for the phase:**

- `pnpm typecheck` zero errors
- `pnpm test` green for: `server/lib/ai/*`, `server/lib/ip-hash`, `server/lib/email-verify`, `server/middleware/rate-limit`, `server/routes/{listing,review,message,verify-email,rate-limit-status}`
- `curl :3001/api/rate-limit-status?tool=listing-description` returns `{ tier, remaining, limit, resetAt }`
- `POST /api/generate-listing` with valid body returns `{ result, tokensUsed, requestsRemaining }` (under mock); rejects when rate-limited
- `POST /api/verify-email` with email returns `{ ok: true, tokenSentTo: <masked> }` (mock SMTP — no real send)
- All three AI generator pages render: form on left, streaming-style preview on right, action buttons (Copy / Regenerate / Pin)
- `AiRateLimitNotice` shows live state from the new endpoint
- Working tree committed task-by-task (one commit per task)

---

## Task 16 — Anthropic client wrapper (TDD)

**Source:** Task 16 in source plan

**Files:**
- `server/lib/ai/client.ts` — `generate(promptVersion, vars) → Promise<{ text, usage: { promptTokens, completionTokens } }>`
- `server/lib/ai/prompts/listing.ts` — versioned prompt builders (LISTING_V1)
- `server/lib/ai/prompts/review.ts` — REVIEW_V1
- `server/lib/ai/prompts/message.ts` — MESSAGE_V1
- `server/lib/ai/index.ts` — barrel
- `tests/server/ai/client.test.ts`
- `tests/server/ai/prompts.test.ts`

**Acceptance:**
- Wrapper imports `@anthropic-ai/sdk`, default model `claude-haiku-4-5`
- Reads `ANTHROPIC_API_KEY` lazily — throws `AiConfigError` if missing at first call (not import)
- Test mocks the SDK constructor; asserts the wrapper passes the rendered prompt + system message + max_tokens; returns shape preserved
- Prompts module exports `{ id, version, system, user(vars) }`; tested for required-vars validation (zod)
- Commit: `feat(strguests-tools): anthropic client wrapper + versioned prompts (Phase 3 Task 16)`

**Provider note:** Anthropic SDK message shape is `{ system, messages: [{ role: 'user', content }] }`. Wrapper exposes the same surface for any future swap by accepting `{ system, user }` strings — no SDK leakage above this module.

---

## Task 17 — Email verification flow

**Source:** Task 17 in source plan

**Files:**
- `server/lib/email-verify.ts` — `issueToken(email) → { token, nonce, expiresAt }`, `verifyToken(token) → { email, ok: boolean }`
- `server/lib/ip-hash.ts` — `hashIp(ip) → sha256(ip + IP_HASH_SALT)`
- `server/routes/verify-email.ts` — POST `/api/verify-email` (issue), GET `/api/verify-email/confirm?t=<token>` (claim)
- `tests/server/email-verify.test.ts`
- `tests/server/ip-hash.test.ts`

**Acceptance:**
- HMAC-SHA256(email + nonce, EMAIL_VERIFY_SECRET); 24h expiry; constant-time compare
- POST handler stores `{ email, token_hash, nonce, expires_at }` in `email_verifications`; mock SMTP send (logs `[email-verify] would send to <masked>` in dev — real SMTP wired later)
- GET confirm handler marks `verified_at = NOW()`; 410 Gone for expired
- IP hash: stable, salt-mixed, asserted via test fixture
- Commit: `feat(strguests-tools): email verification flow + ip hashing (Phase 3 Task 17)`

---

## Task 18 — Rate-limit middleware

**Source:** Task 18 in source plan

**Files:**
- `server/middleware/rate-limit.ts` — sliding-window check against `rate_limits` table
- `server/routes/rate-limit-status.ts` — GET `/api/rate-limit-status?tool=<slug>`
- `tests/server/middleware/rate-limit.test.ts`

**Acceptance:**
- Tier resolution: read verified-email cookie → `verified` (50/day); else `unverified` (5/hour)
- Atomic increment via `INSERT ... ON DUPLICATE KEY UPDATE count = count + 1`
- Returns 429 with `{ error: 'rate_limited', resetAt }` past limit
- Sets `req.rateLimit = { tier, remaining, limit, resetAt }` for downstream handlers
- GET status route returns same shape without consuming budget
- Commit: `feat(strguests-tools): rate-limit middleware + status endpoint (Phase 3 Task 18)`

---

## Task 19 — Listing description generator

**Source:** Task 19 in source plan

**Files:**
- `server/routes/generate-listing.ts` — POST `/api/generate-listing`
- `src/components/generators/ListingDescriptionGenerator.tsx` — React island
- `src/pages/listing-description.astro` — page wiring
- `tests/server/routes/generate-listing.test.ts`

**Acceptance:**
- Request body schema (zod): `{ propertyType, bedrooms, bathrooms, sleeps, location, features[], tone: 'warm'|'professional'|'quirky', length: 'short'|'medium'|'long' }`
- Pipeline: validate → `rateLimit` middleware → `aiClient.generate('listing', vars)` → log to `generation_logs` → respond
- Response: `{ result: string, tokensUsed: number, requestsRemaining: number }`
- UI: form on left (all 8 fields), preview pane on right shows result with copy/regenerate/pin buttons; disables submit when rate-limited (`strguests:rate-limit` event)
- Commit: `feat(strguests-tools): listing description generator (Phase 3 Task 19)`

---

## Task 20 — Review response generator

**Source:** Task 20 in source plan

**Files:**
- `server/routes/generate-review.ts`
- `src/components/generators/ReviewResponseGenerator.tsx`
- `src/pages/review-response.astro`
- `tests/server/routes/generate-review.test.ts`

**Acceptance:**
- Body: `{ reviewText, starRating: 1|2|3|4|5, tone: 'warm'|'professional', responseGoal: 'thank'|'address-issue'|'redirect-future' }`
- Same pipeline as Task 19; response shape unchanged
- UI follows ListingDescription pattern; star-rating selector visualizes 1–5; preset response goals as pills
- Commit: `feat(strguests-tools): review response generator (Phase 3 Task 20)`

---

## Task 21 — Message template generator

**Source:** Task 21 in source plan

**Files:**
- `server/routes/generate-message.ts`
- `src/components/generators/MessageTemplateGenerator.tsx`
- `src/pages/guest-messages.astro`
- `tests/server/routes/generate-message.test.ts`

**Acceptance:**
- Body: `{ messageType: 'booking-confirmation'|'pre-arrival'|'mid-stay'|'post-checkout'|'late-checkout-request'|'noise-complaint'|'broken-item'|'refund-request', propertyName, hostName, guestFirstName?, scenarioDetails? }`
- Output emits Mustache placeholders (`{{guestFirstName}}`, etc.) so the result drops into a host's PMS template field
- Same pipeline + response shape as Task 19
- UI: type selector as segmented control; placeholder palette visible below the result so the host knows which variables they can wire
- Commit: `feat(strguests-tools): message template generator (Phase 3 Task 21)`

---

## Out of scope for Phase 3

- Real SMTP send for email-verify (mock only — wired in Phase 6 deploy)
- Live `ANTHROPIC_API_KEY` smoke (deferred — endpoint+ middleware ship behind mock)
- Streaming responses (single-shot only; streaming is a Phase 6+ enhancement)
- Hostinger MySQL provisioning (Phase 6 deploy concern)

## Decisions log (will move to STATE.md on commit)

- **Provider = Anthropic Claude haiku-4-5.** Locks spec §13. Wrapper isolates SDK; swap is one file.
- **Mocked tests, no live key.** Phase 3 ships code + tests; first live generation happens at Phase 6 deploy when `ANTHROPIC_API_KEY` is set.
- **Mock SMTP.** Email-verify route logs the would-send line in dev; real provider (Resend/Mailgun) wired in Phase 6.
- **Cookie-based verified-email session.** Signed cookie set by `/api/verify-email/confirm` so subsequent requests resolve to the `verified` tier without an extra round trip.
- **Mustache placeholders preserved in output.** Phase 4's templates.json already established this contract; Phase 3 honors it.
