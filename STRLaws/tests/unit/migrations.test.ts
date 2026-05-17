import { describe, expect, it } from 'vitest';
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIGRATIONS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'server',
  'db',
  'migrations',
);

describe('SQL migrations', () => {
  it('files exist and are lexically ordered', async () => {
    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith('.sql'))
      .sort();
    expect(files.length).toBeGreaterThanOrEqual(2);
    expect(files[0]).toMatch(/^0001_/);
    expect(files[1]).toMatch(/^0002_/);
  });

  it('0002 declares every Phase 3-6 table required by the spec', async () => {
    const sql = await readFile(join(MIGRATIONS_DIR, '0002_pipeline.sql'), 'utf-8');
    const expectedTables = [
      'review_queue',
      'regulation_changes',
      'alert_subscribers',
      'alert_subscriptions',
      'alert_dispatches',
      'premium_subscribers',
      'api_request_log',
    ];
    for (const table of expectedTables) {
      expect(sql, `expected CREATE TABLE for ${table}`).toMatch(
        new RegExp(`CREATE TABLE IF NOT EXISTS\\s+${table}\\b`),
      );
    }
  });

  it('0002 uses InnoDB + utf8mb4 across every table (empire parity)', async () => {
    const sql = await readFile(join(MIGRATIONS_DIR, '0002_pipeline.sql'), 'utf-8');
    const createCount = (sql.match(/CREATE TABLE IF NOT EXISTS/g) ?? []).length;
    const innodbCount = (sql.match(/ENGINE=InnoDB/g) ?? []).length;
    const utf8Count = (sql.match(/CHARSET=utf8mb4/g) ?? []).length;
    expect(innodbCount).toBe(createCount);
    expect(utf8Count).toBe(createCount);
  });

  it('0002 enforces foreign-key + cascade integrity to Phase 1 tables', async () => {
    const sql = await readFile(join(MIGRATIONS_DIR, '0002_pipeline.sql'), 'utf-8');
    expect(sql).toMatch(/REFERENCES\s+cities\(id\)\s+ON\s+DELETE\s+CASCADE/i);
    expect(sql).toMatch(/REFERENCES\s+ordinance_snapshots\(id\)\s+ON\s+DELETE\s+CASCADE/i);
    expect(sql).toMatch(/REFERENCES\s+regulations\(id\)/i);
  });
});
