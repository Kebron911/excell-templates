/**
 * MySQL connection pool wrapper. Forked from STRGuests-Tools/server/lib/db.ts.
 *
 * Only difference: default database name is `strlistingaudit`.
 *
 * `query()` ALWAYS parameterizes via `?` placeholders — string concatenation
 * of user input is forbidden by convention (asserted at runtime).
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
    database: process.env.MYSQL_DATABASE ?? 'strlistingaudit',
    connectionLimit: 10,
    waitForConnections: true,
    namedPlaceholders: false,
    multipleStatements: false,
  });

  return pool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  await pool.end();
  pool = null;
}
