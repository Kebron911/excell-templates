/**
 * DataSource abstraction — Phase 3 prep.
 *
 * Today every reader hits the filesystem (`fs.readFile(yaml/ndjson)`).
 * Phase 3 introduces a SQLite cache populated by n8n nightly-refresh —
 * at that point Money/Traffic/SEO/Contacts data must come from cache,
 * not filesystem.
 *
 * Rather than refactor every reader at once, define the interface now
 * and migrate readers incrementally:
 *   1. Phase 3 Stripe/Etsy/Gumroad readers use SqliteDataSource (new)
 *   2. Existing YAML/NDJSON readers continue using FileDataSource (current)
 *   3. Migration is opt-in per reader, not all-or-nothing
 *
 * Pattern adopted from the cluster blog standard's data-fetching abstraction.
 */

export interface DataSource {
  /** Read a UTF-8 text file by absolute path. Returns null on missing file. */
  readText(absPath: string): Promise<string | null>;

  /** Append a JSON-encoded line to an NDJSON file. Creates the file + parent dir. */
  appendNdjson(absPath: string, record: object): Promise<void>;

  /**
   * Phase 3+: query a cached table. FileDataSource throws (forces explicit
   * SqliteDataSource use). SqliteDataSource implements.
   */
  queryCache?<T>(table: string, where?: Record<string, unknown>): Promise<T[]>;
}

import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

/** Current default — direct filesystem access. */
export class FileDataSource implements DataSource {
  async readText(absPath: string): Promise<string | null> {
    try { return await readFile(absPath, 'utf8'); }
    catch { return null; }
  }
  async appendNdjson(absPath: string, record: object): Promise<void> {
    await mkdir(dirname(absPath), { recursive: true });
    await appendFile(absPath, JSON.stringify(record) + '\n', 'utf8');
  }
  // queryCache intentionally not implemented — throws to force explicit SqliteDataSource
}

/**
 * Phase 3 placeholder. When Stripe/Etsy/Gumroad data lands in SQLite via
 * n8n nightly-refresh, implement this and inject into Money/Traffic/SEO readers.
 */
export class SqliteDataSource implements DataSource {
  async readText(_absPath: string): Promise<string | null> {
    throw new Error('SqliteDataSource.readText not implemented — use FileDataSource for files');
  }
  async appendNdjson(_absPath: string, _record: object): Promise<void> {
    throw new Error('SqliteDataSource.appendNdjson not implemented');
  }
  async queryCache<T>(_table: string, _where?: Record<string, unknown>): Promise<T[]> {
    throw new Error('SqliteDataSource.queryCache: implement in Phase 3');
  }
}

/** Default singleton — readers use this until something injects an alternative. */
export const defaultDataSource: DataSource = new FileDataSource();
