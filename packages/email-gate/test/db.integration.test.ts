/**
 * Integration tests for @str/email-gate against a real MySQL instance
 * spun up via @testcontainers/mysql.
 *
 * Run with:  pnpm test:integration
 * Requires:  Docker daemon running
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MySqlContainer, type StartedMySqlContainer } from '@testcontainers/mysql';
import { createPool, CREATE_TABLE_SQL } from '../src/db.js';
import { submit } from '../src/submit.js';
import type { Pool } from '../src/db.js';

let container: StartedMySqlContainer;
let pool: Pool;

beforeAll(async () => {
  container = await new MySqlContainer('mysql:8.0')
    .withDatabase('testdb')
    .withUsername('root')
    .withRootPassword('root')
    .start();

  pool = createPool({
    host: container.getHost(),
    port: container.getPort(),
    user: 'root',
    password: 'root',
    database: 'testdb',
  });

  // Create the table
  await pool.execute(CREATE_TABLE_SQL);
});

afterAll(async () => {
  await pool.end();
  await container.stop();
});

describe('email-gate persistence (real MySQL)', () => {
  it('inserts a new subscriber and returns a positive integer id', async () => {
    const r = await submit(
      { siteId: 'guests', listSegment: 'main', email: 'alice@example.com' },
      pool,
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(typeof r.id).toBe('number');
      expect(r.id).toBeGreaterThan(0);
    }
  });

  it('same email on a different siteId is allowed (separate row)', async () => {
    const r1 = await submit(
      { siteId: 'guests', listSegment: 'main', email: 'bob@example.com' },
      pool,
    );
    const r2 = await submit(
      { siteId: 'buyers', listSegment: 'waitlist', email: 'bob@example.com' },
      pool,
    );
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      expect(r1.id).not.toBe(r2.id);
    }
  });

  it('idempotent: re-submitting same (siteId, email) returns same id', async () => {
    const email = 'carol@example.com';
    const first = await submit({ siteId: 'ops', listSegment: 'beta', email }, pool);
    const second = await submit({ siteId: 'ops', listSegment: 'beta', email }, pool);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.id).toBe(second.id);
    }
  });

  it('stores source when provided', async () => {
    const r = await submit(
      { siteId: 'host', listSegment: 'newsletter', email: 'dave@example.com', source: 'landing' },
      pool,
    );
    expect(r.ok).toBe(true);
    // Verify source persisted via raw query
    const [rows] = await pool.execute(
      'SELECT source FROM email_subscribers WHERE site_id = ? AND email = ?',
      ['host', 'dave@example.com'],
    );
    expect((rows as any[])[0].source).toBe('landing');
  });

  it('validates input before touching DB (bad siteId does not insert)', async () => {
    const r = await submit(
      { siteId: 'invalid' as any, listSegment: 'main', email: 'eve@example.com' },
      pool,
    );
    expect(r.ok).toBe(false);
    // Confirm no row inserted
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS cnt FROM email_subscribers WHERE email = ?',
      ['eve@example.com'],
    );
    expect((rows as any[])[0].cnt).toBe(0);
  });
});
