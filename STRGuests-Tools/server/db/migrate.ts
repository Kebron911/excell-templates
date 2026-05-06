/**
 * `pnpm db:migrate` — applies server/db/schema.sql idempotently.
 *
 * The schema uses CREATE TABLE IF NOT EXISTS, so re-running this script
 * against an already-migrated database is a no-op. Safe to wire into
 * deploy hooks.
 *
 * Reads MYSQL_* env vars from the local environment / .env. Caller is
 * responsible for `dotenv` if running outside Hostinger.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import mysql from 'mysql2/promise';

const here = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = resolve(here, 'schema.sql');

async function main() {
  const sql = readFileSync(SCHEMA_PATH, 'utf-8');

  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'strguests',
    multipleStatements: true, // schema.sql is a single CREATE-only block
  });

  console.log(`[migrate] applying schema.sql against ${process.env.MYSQL_DATABASE ?? 'strguests'}…`);
  try {
    await conn.query(sql);
    console.log('[migrate] ok — three tables present: rate_limits, email_verifications, generation_logs');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('[migrate] failed:', err);
  process.exitCode = 1;
});
