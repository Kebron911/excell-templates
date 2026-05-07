/**
 * MySQL connection pool wrapper for the strguests.tools API server.
 *
 * Uses mysql2/promise — `query()` ALWAYS parameterizes via the `?`-placeholder
 * + values-array form. Direct string concatenation of user input is forbidden
 * by convention (and asserted in tests/server/db.test.ts).
 *
 * Env vars (see .env.example):
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 *
 * Hostinger Business Apps deployment uses a managed MySQL instance — connection
 * pool size is intentionally low (10) to stay within shared-tier limits.
 */

import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'strguests',
    connectionLimit: 10,
    waitForConnections: true,
    namedPlaceholders: false,
    multipleStatements: false,
  });

  return pool;
}

/**
 * Parameterized query. ALWAYS uses placeholder substitution via mysql2 — never
 * string-concatenates `params` into `sql`. The compile-time signature forbids
 * stitching SQL together externally; the test suite asserts the same at runtime.
 *
 * Returns the raw rows; the second tuple element (fields metadata) is omitted
 * because no caller needs it.
 */
export async function query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows as T[];
}

/**
 * Single-row helper.
 */
export async function queryOne<T = any>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Test/CLI hook to dispose the singleton. Production code never calls this;
 * the pool persists for the life of the Express process.
 */
export async function closePool(): Promise<void> {
  if (!pool) return;
  await pool.end();
  pool = null;
}
