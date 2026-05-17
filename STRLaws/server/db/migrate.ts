/**
 * MySQL migration runner.
 * Applies SQL files in server/db/migrations/ in lexical order.
 * Tracks applied migrations in a `_migrations` table.
 *
 * Pattern adapted from STRGuests-Tools/server/db/migrate.ts.
 *
 * Usage: pnpm db:migrate
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RowDataPacket } from 'mysql2/promise';
import { getPool, closePool } from './pool';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, 'migrations');

async function ensureMigrationsTable(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>('SELECT filename FROM _migrations');
  return new Set((rows as unknown as Array<{ filename: string }>).map((r) => r.filename));
}

async function listMigrationFiles(): Promise<string[]> {
  const files = await readdir(MIGRATIONS_DIR);
  return files
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));
}

async function applyMigration(filename: string): Promise<void> {
  const pool = getPool();
  const sqlPath = join(MIGRATIONS_DIR, filename);
  const sql = await readFile(sqlPath, 'utf-8');
  console.log(`Applying ${filename}...`);
  await pool.query(sql);
  await pool.query('INSERT INTO _migrations (filename) VALUES (?)', [filename]);
  console.log(`  ✓ ${filename}`);
}

export async function migrate(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = await listMigrationFiles();
  const pending = files.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  console.log(`Applying ${pending.length} migration(s):`);
  for (const file of pending) {
    await applyMigration(file);
  }
  console.log('Done.');
}

const isMain = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;
if (isMain) {
  migrate()
    .then(() => closePool())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      closePool().finally(() => process.exit(1));
    });
}
