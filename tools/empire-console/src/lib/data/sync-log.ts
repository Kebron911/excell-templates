import { readFile, stat } from 'node:fs/promises';
import { paths } from '../paths.js';

/**
 * Cache freshness — reads ops/cache/sync-log.json (touched by n8n nightly-refresh
 * after a successful cycle). Falls back to mtime if the file holds a plain timestamp.
 */

export interface SyncLogStatus {
  isPresent: boolean;
  lastRefreshAt: string | null;
  ageHours: number | null;
  /** Tone for badge: ok (<26h), warn (<50h), bad (≥50h or missing). */
  staleness: 'ok' | 'warn' | 'bad' | 'missing';
}

export async function readSyncLog(): Promise<SyncLogStatus> {
  let lastRefreshAt: string | null = null;
  let isPresent = false;
  try {
    const raw = (await readFile(paths.cache.syncLog, 'utf8')).trim();
    isPresent = true;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string') lastRefreshAt = parsed;
      else if (parsed && typeof parsed.generatedAt === 'string') lastRefreshAt = parsed.generatedAt;
      else if (parsed && typeof parsed.lastRefreshAt === 'string') lastRefreshAt = parsed.lastRefreshAt;
    } catch {
      // Not JSON — treat the trimmed content as an ISO timestamp if it parses.
      if (!Number.isNaN(Date.parse(raw))) lastRefreshAt = raw;
    }
    if (!lastRefreshAt) {
      const st = await stat(paths.cache.syncLog);
      lastRefreshAt = st.mtime.toISOString();
    }
  } catch {
    return { isPresent: false, lastRefreshAt: null, ageHours: null, staleness: 'missing' };
  }
  const ageHours = lastRefreshAt
    ? (Date.now() - new Date(lastRefreshAt).getTime()) / 36e5
    : null;
  const staleness: SyncLogStatus['staleness'] =
    ageHours === null ? 'bad' :
    ageHours < 26 ? 'ok' :
    ageHours < 50 ? 'warn' :
    'bad';
  return { isPresent, lastRefreshAt, ageHours, staleness };
}
