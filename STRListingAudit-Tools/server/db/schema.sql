-- ============================================================
-- listingaudit.tools — server schema (idempotent)
--
-- Three tables back the audit pipeline + funnel:
--   - audit_runs           one row per audit; persists scorecard + cost telemetry
--   - rate_limits          per-IP and per-email audit counters (3/hr → 20/day)
--   - email_verifications  one-time tokens + verified flag (gate for full PDF)
--
-- Run with `pnpm db:migrate`. Safe to re-run on existing databases.
-- The rate_limits + email_verifications tables mirror STRGuests-Tools so the
-- same lib/rate-limit + email-verify code paths apply with `tool_slug='audit-listing'`.
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_runs (
  id              CHAR(12) NOT NULL,
  url             VARCHAR(2048) NOT NULL,
  platform        ENUM('airbnb','vrbo','unknown') NOT NULL DEFAULT 'unknown',
  listing_id      VARCHAR(64) NULL,
  status          ENUM('running','ready','failed') NOT NULL DEFAULT 'running',
  -- Normalized ListingSnapshot from server/lib/scrape (title/photos/amenities/reviews/...)
  snapshot_json   JSON NULL,
  -- Per-dim scores + reasoning (5 dims × {score, reasoning, fixes[]})
  scores_json     JSON NULL,
  -- Top 5 prioritized fixes selected by the synthesizer
  fixes_json      JSON NULL,
  -- Public path to the Satori-generated share image
  share_image_path VARCHAR(512) NULL,
  -- Failure reason — non-null when status='failed'
  error_code      VARCHAR(64) NULL,
  error_message   VARCHAR(1024) NULL,
  -- Cost telemetry — used by cost-budget.test.ts in CI and by ops dashboards
  apify_cost_usd  DECIMAL(8,5) NOT NULL DEFAULT 0,
  anthropic_input_tokens       INT UNSIGNED NOT NULL DEFAULT 0,
  anthropic_output_tokens      INT UNSIGNED NOT NULL DEFAULT 0,
  anthropic_cache_read_tokens  INT UNSIGNED NOT NULL DEFAULT 0,
  anthropic_cache_write_tokens INT UNSIGNED NOT NULL DEFAULT 0,
  total_cost_usd  DECIMAL(8,5) NOT NULL DEFAULT 0,
  -- Submitter — IP is sha256(IP + IP_HASH_SALT), email NULL until email-gate signup
  ip_hash         CHAR(64) NOT NULL,
  email           VARCHAR(320) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at    DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_created (created_at),
  KEY idx_status (status, created_at),
  KEY idx_url (url(255)),
  KEY idx_ip_hash (ip_hash, created_at),
  KEY idx_email (email, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
