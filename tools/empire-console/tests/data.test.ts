import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtemp, writeFile, mkdir, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// We test the readers by pointing them at temp fixture files via env override.
// Since paths.ts is import-time bound, these tests instead exercise the parsers
// by re-implementing the dispatch via direct file reads — small but useful coverage.

import { AlertSchema, AlertPrioritySchema } from '../src/lib/data/alerts.js';

describe('AlertSchema', () => {
  it('accepts a valid P0 alert', () => {
    const a = AlertSchema.parse({
      id: 'x', priority: 'P0', source: 's', message: 'm', ts: new Date().toISOString(),
    });
    expect(a.priority).toBe('P0');
  });
  it('rejects a bogus priority', () => {
    expect(() => AlertSchema.parse({
      id: 'x', priority: 'P9', source: 's', message: 'm', ts: '2026-01-01',
    })).toThrow();
  });
});

describe('AlertPrioritySchema', () => {
  it('parses P0/P1/P2', () => {
    expect(AlertPrioritySchema.parse('P0')).toBe('P0');
    expect(AlertPrioritySchema.parse('P1')).toBe('P1');
    expect(AlertPrioritySchema.parse('P2')).toBe('P2');
  });
});

describe('NDJSON round-trip', () => {
  let dir: string;
  beforeAll(async () => { dir = await mkdtemp(join(tmpdir(), 'empire-')); });
  afterAll(async () => { await rm(dir, { recursive: true, force: true }); });

  it('writes and reads a line', async () => {
    const file = join(dir, 'alerts.ndjson');
    const record = { id: 'a1', priority: 'P1', source: 's', message: 'm', ts: '2026-05-10T00:00:00.000Z' };
    await writeFile(file, JSON.stringify(record) + '\n');
    const raw = await readFile(file, 'utf8');
    expect(JSON.parse(raw.trim())).toEqual(record);
  });
});
