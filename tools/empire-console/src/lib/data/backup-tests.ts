import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { resolve } from 'node:path';
import { paths } from '../paths.js';

/**
 * Backup restore-test log — appended by the n8n backup-restore-test flow
 * on the 1st of each month. One line per probe. /maintain/backups reads it.
 */

export const BackupTestSchema = z.object({
  ts: z.string(),
  priority: z.enum(['P0', 'P1', 'P2']).default('P2'),
  passed: z.boolean().default(false),
  message: z.string().default(''),
});

export type BackupTest = z.infer<typeof BackupTestSchema>;

export interface BackupTestsReport {
  tests: BackupTest[];
  totals: {
    total: number;
    passed: number;
    failed: number;
    lastPassedAt: string | null;
    lastFailedAt: string | null;
    daysSinceLastTest: number | null;
    daysSinceLastPass: number | null;
  };
}

const LOG_PATH = resolve(paths.ops, 'backup-tests.ndjson');

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
}

export async function readBackupTests(limit = 24): Promise<BackupTestsReport> {
  let raw: string;
  try { raw = await readFile(LOG_PATH, 'utf8'); }
  catch {
    return {
      tests: [],
      totals: {
        total: 0, passed: 0, failed: 0,
        lastPassedAt: null, lastFailedAt: null,
        daysSinceLastTest: null, daysSinceLastPass: null,
      },
    };
  }
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const tests: BackupTest[] = [];
  for (const line of lines) {
    try { tests.push(BackupTestSchema.parse(JSON.parse(line))); }
    catch { /* skip malformed */ }
  }
  tests.sort((a, b) => b.ts.localeCompare(a.ts));
  const lastPassed = tests.find((t) => t.passed);
  const lastFailed = tests.find((t) => !t.passed);

  return {
    tests: tests.slice(0, limit),
    totals: {
      total: tests.length,
      passed: tests.filter((t) => t.passed).length,
      failed: tests.filter((t) => !t.passed).length,
      lastPassedAt: lastPassed?.ts ?? null,
      lastFailedAt: lastFailed?.ts ?? null,
      daysSinceLastTest: daysSince(tests[0]?.ts ?? null),
      daysSinceLastPass: daysSince(lastPassed?.ts ?? null),
    },
  };
}
