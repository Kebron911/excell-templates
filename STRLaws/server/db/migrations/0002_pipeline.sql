-- STRLaws — Phase 3-6 schema: AI pipeline, diff engine, alerts, premium.
-- All tables InnoDB + utf8mb4. Times in DATETIME (UTC, app responsibility).

-- Phase 3: low-confidence extractions routed for human review.
CREATE TABLE IF NOT EXISTS review_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  snapshot_id INT NOT NULL,
  city_id INT NOT NULL,
  reason ENUM('low_confidence', 'cost_exceeded', 'extraction_failed', 'manual') NOT NULL,
  confidence_score DECIMAL(4, 3) NULL,
  extracted_json JSON NULL,
  reviewer_notes_md TEXT NULL,
  status ENUM('open', 'in_review', 'approved', 'rejected') NOT NULL DEFAULT 'open',
  reviewed_by VARCHAR(128) NULL,
  reviewed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_snapshot FOREIGN KEY (snapshot_id) REFERENCES ordinance_snapshots(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  INDEX idx_review_status_created (status, created_at DESC),
  INDEX idx_review_city (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phase 4: classified diffs between consecutive regulation versions per city.
CREATE TABLE IF NOT EXISTS regulation_changes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  prev_regulation_id INT NULL,
  next_regulation_id INT NOT NULL,
  severity ENUM('minor', 'material', 'major') NOT NULL,
  diff_json JSON NOT NULL,
  summary_md TEXT NULL,
  blog_post_slug VARCHAR(255) NULL,
  published_at DATETIME NULL,
  alerts_dispatched_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_change_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  CONSTRAINT fk_change_prev_reg FOREIGN KEY (prev_regulation_id) REFERENCES regulations(id) ON DELETE SET NULL,
  CONSTRAINT fk_change_next_reg FOREIGN KEY (next_regulation_id) REFERENCES regulations(id) ON DELETE CASCADE,
  INDEX idx_change_city_created (city_id, created_at DESC),
  INDEX idx_change_severity (severity),
  INDEX idx_change_published (published_at),
  UNIQUE KEY uq_change_blog_slug (blog_post_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phase 5: free-tier alert subscribers (email-only, list managed via Influencersoft).
CREATE TABLE IF NOT EXISTS alert_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  tier ENUM('free', 'premium') NOT NULL DEFAULT 'free',
  influencersoft_contact_id VARCHAR(128) NULL,
  confirmed_at DATETIME NULL,
  unsubscribed_at DATETIME NULL,
  source_page VARCHAR(255) NULL,
  source_utm JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_subscriber_tier (tier),
  INDEX idx_subscriber_confirmed (confirmed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phase 5: per-subscriber city watchlist (free tier = max 1, premium unlimited).
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT NOT NULL,
  city_id INT NOT NULL,
  severity_threshold ENUM('minor', 'material', 'major') NOT NULL DEFAULT 'material',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sub_subscriber FOREIGN KEY (subscriber_id) REFERENCES alert_subscribers(id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  UNIQUE KEY uq_subscription_subscriber_city (subscriber_id, city_id),
  INDEX idx_subscription_city (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phase 5: append-only log of alert dispatches (for dedup + audit).
CREATE TABLE IF NOT EXISTS alert_dispatches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  change_id INT NOT NULL,
  subscriber_id INT NOT NULL,
  channel ENUM('resend', 'influencersoft') NOT NULL,
  provider_message_id VARCHAR(255) NULL,
  status ENUM('queued', 'sent', 'failed', 'bounced') NOT NULL DEFAULT 'queued',
  error_message TEXT NULL,
  sent_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dispatch_change FOREIGN KEY (change_id) REFERENCES regulation_changes(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispatch_subscriber FOREIGN KEY (subscriber_id) REFERENCES alert_subscribers(id) ON DELETE CASCADE,
  UNIQUE KEY uq_dispatch_change_subscriber (change_id, subscriber_id),
  INDEX idx_dispatch_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phase 6: premium subscribers (Stripe-backed, API key issued at signup).
CREATE TABLE IF NOT EXISTS premium_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT NOT NULL UNIQUE,
  stripe_customer_id VARCHAR(128) NOT NULL UNIQUE,
  stripe_subscription_id VARCHAR(128) NOT NULL UNIQUE,
  plan ENUM('monthly', 'annual') NOT NULL,
  status ENUM('active', 'past_due', 'canceled', 'incomplete') NOT NULL,
  api_key_hash CHAR(64) NOT NULL UNIQUE,
  api_key_prefix VARCHAR(16) NOT NULL,
  api_requests_today INT NOT NULL DEFAULT 0,
  api_quota_resets_at DATETIME NULL,
  current_period_end DATETIME NULL,
  canceled_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_premium_subscriber FOREIGN KEY (subscriber_id) REFERENCES alert_subscribers(id) ON DELETE CASCADE,
  INDEX idx_premium_status (status),
  INDEX idx_premium_api_prefix (api_key_prefix)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phase 6: API request log (for rate-limit accounting + audit).
CREATE TABLE IF NOT EXISTS api_request_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  premium_subscriber_id INT NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  status_code INT NOT NULL,
  request_ms INT NULL,
  ip_hash CHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_apilog_subscriber FOREIGN KEY (premium_subscriber_id) REFERENCES premium_subscribers(id) ON DELETE CASCADE,
  INDEX idx_apilog_subscriber_time (premium_subscriber_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
