-- STRLaws — Phase 1 initial schema
-- All tables InnoDB + utf8mb4. Times in DATETIME (UTC, app responsibility).

CREATE TABLE IF NOT EXISTS states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  has_state_law TINYINT(1) NOT NULL DEFAULT 0,
  summary_md TEXT NULL,
  schema_json JSON NULL,
  last_verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_states_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state_id INT NOT NULL,
  slug VARCHAR(128) NOT NULL,
  name VARCHAR(128) NOT NULL,
  population INT NULL,
  str_market_rank INT NULL,
  lat DECIMAL(9, 6) NULL,
  lng DECIMAL(9, 6) NULL,
  last_verified_at DATETIME NULL,
  status ENUM('active', 'skeleton', 'archived') NOT NULL DEFAULT 'skeleton',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cities_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cities_state_slug (state_id, slug),
  INDEX idx_cities_status (status),
  INDEX idx_cities_market_rank (str_market_rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NULL,
  state_id INT NULL,
  url VARCHAR(1024) NOT NULL,
  title VARCHAR(512) NULL,
  source_type ENUM('city_code', 'council_minutes', 'state_law', 'news', 'permit_portal', 'other') NOT NULL DEFAULT 'other',
  last_fetched_at DATETIME NULL,
  http_status INT NULL,
  content_type VARCHAR(128) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sources_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  CONSTRAINT fk_sources_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
  INDEX idx_sources_city (city_id),
  INDEX idx_sources_state (state_id),
  INDEX idx_sources_last_fetched (last_fetched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ordinance_snapshots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  source_id INT NULL,
  scraped_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  source_url VARCHAR(1024) NOT NULL,
  raw_text_hash CHAR(64) NOT NULL,
  raw_text_path VARCHAR(512) NOT NULL,
  confidence_score DECIMAL(4, 3) NULL,
  model_used VARCHAR(64) NULL,
  extraction_cost_usd DECIMAL(8, 5) NULL,
  status ENUM('scraped', 'extracted', 'review', 'failed') NOT NULL DEFAULT 'scraped',
  CONSTRAINT fk_snapshot_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  CONSTRAINT fk_snapshot_source FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE SET NULL,
  INDEX idx_snapshot_city (city_id),
  INDEX idx_snapshot_hash (raw_text_hash),
  INDEX idx_snapshot_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS regulations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  snapshot_id INT NULL,
  effective_date DATE NULL,
  permit_required TINYINT(1) NULL,
  permit_cost_usd DECIMAL(8, 2) NULL,
  permit_url VARCHAR(1024) NULL,
  occupancy_cap_persons INT NULL,
  occupancy_cap_bedrooms_ratio DECIMAL(4, 2) NULL,
  tax_rate_pct DECIMAL(5, 3) NULL,
  tax_authority VARCHAR(255) NULL,
  ban_status ENUM('none', 'partial', 'full', 'moratorium') NULL,
  ban_details_md TEXT NULL,
  registration_required TINYINT(1) NULL,
  registration_url VARCHAR(1024) NULL,
  primary_residence_only TINYINT(1) NULL,
  max_nights_per_year INT NULL,
  inspection_required TINYINT(1) NULL,
  insurance_minimum_usd INT NULL,
  zoning_notes_md TEXT NULL,
  enforcement_notes_md TEXT NULL,
  faq_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reg_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_snapshot FOREIGN KEY (snapshot_id) REFERENCES ordinance_snapshots(id) ON DELETE SET NULL,
  INDEX idx_reg_city_created (city_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
