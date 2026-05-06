-- ============================================================
-- strguests.tools — server schema (idempotent)
--
-- Three tables back the AI generators:
--   - rate_limits          per-IP and per-email generation counters
--   - email_verifications  one-time tokens + verified flag
--   - generation_logs      audit trail of every OpenAI call
--
-- Run with `pnpm db:migrate`. The migrate script wraps these statements
-- in a transaction and is safe to re-run on existing databases.
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limits (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- Hashed IP (sha256 of IP + IP_HASH_SALT) so we don't store raw IPs.
  ip_hash         CHAR(64) NOT NULL,
  -- Email is NULL for unverified visitors. Once verified, both keys are tracked.
  email           VARCHAR(255) NULL,
  tool_slug       VARCHAR(64) NOT NULL,
  -- Sliding-window bucket: 'hour' for unverified IP limit, 'day' for verified.
  bucket          ENUM('hour','day') NOT NULL,
  count           INT UNSIGNED NOT NULL DEFAULT 0,
  window_start    DATETIME NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_ip_tool_bucket (ip_hash, tool_slug, bucket, window_start),
  KEY idx_email_tool_bucket (email, tool_slug, bucket, window_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_verifications (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email           VARCHAR(255) NOT NULL,
  -- HMAC-SHA256(email + nonce, EMAIL_VERIFY_SECRET). Compared in constant time.
  token_hash      CHAR(64) NOT NULL,
  nonce           CHAR(32) NOT NULL,
  verified_at     DATETIME NULL,
  expires_at      DATETIME NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_email (email),
  KEY idx_token_hash (token_hash),
  KEY idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS generation_logs (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip_hash         CHAR(64) NOT NULL,
  email           VARCHAR(255) NULL,
  tool_slug       VARCHAR(64) NOT NULL,
  model           VARCHAR(64) NOT NULL,
  -- Tokens consumed. Useful for cost monitoring + abuse detection.
  prompt_tokens   INT UNSIGNED NOT NULL DEFAULT 0,
  completion_tokens INT UNSIGNED NOT NULL DEFAULT 0,
  -- Hash of the rendered prompt (sha256). Lets us spot duplicate-spam without
  -- storing raw prompt content (keeps log table small + privacy-respecting).
  prompt_hash     CHAR(64) NOT NULL,
  -- Latency in milliseconds, end-to-end.
  latency_ms      INT UNSIGNED NOT NULL DEFAULT 0,
  -- 'ok' | 'rate_limited' | 'openai_error' | 'invalid_input'
  status          VARCHAR(32) NOT NULL DEFAULT 'ok',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ip_created (ip_hash, created_at),
  KEY idx_email_created (email, created_at),
  KEY idx_tool_created (tool_slug, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
