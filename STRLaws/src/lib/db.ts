import mysql, { type RowDataPacket } from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'strlaws',
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    dateStrings: true,
  });
  return pool;
}

type QueryParams = ReadonlyArray<unknown> | Record<string, unknown>;

export async function query<T = unknown>(sql: string, params?: QueryParams): Promise<T[]> {
  const [rows] = await getPool().execute<RowDataPacket[]>(sql, params as never);
  return rows as unknown as T[];
}

export async function queryOne<T = unknown>(sql: string, params?: QueryParams): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
