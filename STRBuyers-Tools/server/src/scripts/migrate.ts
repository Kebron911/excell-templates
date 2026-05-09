/**
 * `pnpm migrate` — applies server/migrations/*.sql in lexical order.
 *
 * The migrations use CREATE TABLE IF NOT EXISTS, so re-runs against an
 * already-migrated database are no-ops. Safe to wire into deploy hooks.
 *
 * Reads DB_* env vars from the local environment / .env. Caller must run
 * with creds available — the script intentionally fails loud rather than
 * silently no-opping if MySQL is unreachable.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import 'dotenv/config';
import mysql from 'mysql2/promise';

const here = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = resolve(here, '../../migrations');

async function main() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('[migrate] no .sql files in', MIGRATIONS_DIR);
    return;
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'strbuyers',
    multipleStatements: true,
  });

  try {
    for (const file of files) {
      const sql = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf-8');
      console.log(`[migrate] applying ${file}…`);
      await conn.query(sql);
      console.log(`[migrate] ${file} ok`);
    }
    console.log(`[migrate] done — ${files.length} migration(s) applied`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('[migrate] failed:', err);
  process.exitCode = 1;
});
