import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Asserts the parameterization contract WITHOUT a live MySQL connection.
 *
 * - Stubs mysql2/promise so getPool() returns a recording pool.
 * - Calls query() with placeholder SQL + a values array.
 * - Asserts the underlying pool.execute received SQL + params unchanged
 *   (no string concatenation path).
 * - Asserts no source line in db.ts ever interpolates `${params}` into SQL.
 */

vi.mock('mysql2/promise', async () => {
  const calls: Array<{ sql: string; params: unknown[] }> = [];
  const fakePool = {
    execute: vi.fn(async (sql: string, params: unknown[]) => {
      calls.push({ sql, params });
      return [[], []];
    }),
    end: vi.fn(async () => {}),
  };
  return {
    default: {
      createPool: () => fakePool,
      createConnection: async () => ({ query: async () => [[]], end: async () => {} }),
    },
    __calls: calls,
    __fakePool: fakePool,
  };
});

describe('db.query parameterization', () => {
  beforeEach(async () => {
    const mod: any = await import('mysql2/promise');
    mod.__calls.length = 0;
  });

  it('passes the SQL and params untouched into pool.execute', async () => {
    const { query, closePool } = await import('../../server/lib/db');
    await query(
      'SELECT * FROM rate_limits WHERE tool_slug = ? AND bucket = ? LIMIT ?',
      ['listing-description', 'hour', 5],
    );
    const mod: any = await import('mysql2/promise');
    expect(mod.__calls.length).toBe(1);
    expect(mod.__calls[0].sql).toBe(
      'SELECT * FROM rate_limits WHERE tool_slug = ? AND bucket = ? LIMIT ?',
    );
    expect(mod.__calls[0].params).toEqual(['listing-description', 'hour', 5]);
    await closePool();
  });

  it('source code never concatenates params into SQL strings', () => {
    const dbPath = resolve(here, '../../server/lib/db.ts');
    const source = readFileSync(dbPath, 'utf-8');

    // Forbidden patterns: template-literal interpolation of `params` or
    // string-plus concatenation of param-like identifiers into SQL.
    expect(source).not.toMatch(/`[^`]*\$\{params\}[^`]*`/);
    expect(source).not.toMatch(/'[^']*'\s*\+\s*params/);
    expect(source).not.toMatch(/sql\s*\+\s*['"`]/);

    // And — to assert the positive — the helper does delegate to execute(sql, params).
    expect(source).toMatch(/\.execute\(sql,\s*params\)/);
  });
});

describe('schema.sql', () => {
  it('declares all three required tables', () => {
    const schemaPath = resolve(here, '../../server/db/schema.sql');
    const sql = readFileSync(schemaPath, 'utf-8');
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS rate_limits/i);
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS email_verifications/i);
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS generation_logs/i);
  });

  it('uses utf8mb4 across all tables', () => {
    const schemaPath = resolve(here, '../../server/db/schema.sql');
    const sql = readFileSync(schemaPath, 'utf-8');
    const charsetCount = (sql.match(/utf8mb4/g) ?? []).length;
    expect(charsetCount).toBeGreaterThanOrEqual(3);
  });
});

describe('.env.example', () => {
  it('documents all required env vars', () => {
    const envPath = resolve(here, '../../.env.example');
    const text = readFileSync(envPath, 'utf-8');
    for (const v of [
      'MYSQL_HOST',
      'MYSQL_PORT',
      'MYSQL_USER',
      'MYSQL_PASSWORD',
      'MYSQL_DATABASE',
      'OPENAI_API_KEY',
      'EMAIL_VERIFY_SECRET',
      'IP_HASH_SALT',
      'PUBLIC_ESP_WEBHOOK',
      'PUBLIC_GA4_ID',
    ]) {
      expect(text, `missing env: ${v}`).toMatch(new RegExp(`^${v}=`, 'm'));
    }
  });
});
