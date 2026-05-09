-- ============================================================
-- strbuyers.tools — initial schema (idempotent)
--
-- Two tables back the click-logging + lead-magnet flows:
--   - click_logs   one row per affiliate-card click
--   - leads        opt-in email captures, deduplicated by email
--
-- Run with `pnpm migrate`. CREATE TABLE IF NOT EXISTS guards make
-- re-runs a no-op against an already-migrated database.
-- ============================================================

CREATE TABLE IF NOT EXISTS click_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendor_id VARCHAR(64) NOT NULL,
  tool_id VARCHAR(64) NOT NULL,
  utm_source VARCHAR(128),
  utm_medium VARCHAR(128),
  utm_campaign VARCHAR(128),
  referrer VARCHAR(512),
  user_agent VARCHAR(512),
  ip_hash CHAR(64),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_vendor_created (vendor_id, created_at),
  INDEX idx_tool_created (tool_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  source VARCHAR(64) NOT NULL,
  tool_id VARCHAR(64),
  city_slug VARCHAR(64),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
