import mysql from 'mysql2/promise';

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/**
 * Minimal pool interface — only the methods @str/email-gate actually uses.
 * Structural (duck) typing keeps the public API narrow and unit-test mocking trivial.
 */
export interface Pool {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(sql: string, values?: unknown[]): Promise<[any, unknown[]]>;
  end(): Promise<void>;
}

export function createPool(config: DbConfig): Pool {
  const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  // mysql2/promise Pool satisfies our minimal Pool interface at runtime;
  // the cast avoids complex overload resolution between different mysql2 type paths.
  return pool as unknown as Pool;
}

/**
 * DDL for the email_subscribers table.
 * Run this once during app bootstrap or in a migration script.
 */
export const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS email_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_id VARCHAR(16) NOT NULL,
  list_segment VARCHAR(64) NOT NULL,
  email VARCHAR(254) NOT NULL,
  source VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_site_email (site_id, email),
  UNIQUE KEY unique_site_email (site_id, email)
)
`.trim();
