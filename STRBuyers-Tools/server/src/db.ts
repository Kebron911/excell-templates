/**
 * MySQL pool wrapper for the strbuyers.tools API server.
 *
 * Lazy connect — pool is only constructed on first query. Lets `pnpm dev`
 * boot without DB credentials configured (they're a Phase 6 blocker).
 *
 * Env (see .env.example):
 *   DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
 *
 * Hostinger Business Apps deployment uses managed MySQL — keep pool small.
 */

import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'strbuyers',
    connectionLimit: 10,
    waitForConnections: true,
    namedPlaceholders: false,
    multipleStatements: false,
  });

  return pool;
}

/**
 * Parameterized query. Always uses placeholder substitution via mysql2 —
 * never concatenates `params` into `sql`.
 */
type QueryParam = string | number | boolean | Date | Buffer | null;

export async function query<T = unknown>(
  sql: string,
  params: QueryParam[] = [],
): Promise<T[]> {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows as T[];
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  await pool.end();
  pool = null;
}
