import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  if (!host || !user || !database) {
    throw new Error('Missing required DB env vars: DB_HOST, DB_USER, DB_NAME');
  }
  pool = mysql.createPool({
    host,
    port: Number(process.env.DB_PORT ?? 3306),
    user,
    password: password ?? '',
    database,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    multipleStatements: true,
    dateStrings: true,
  });
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
