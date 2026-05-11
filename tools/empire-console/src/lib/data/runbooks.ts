import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { paths } from '../paths.js';
import { STALE_DAYS } from './staleness.js';

export interface Runbook {
  path: string;
  relPath: string;
  title: string;
  owner: string | null;
  lastReviewed: string | null;   // ISO date string
  cadence: string | null;        // e.g. 'monthly', 'quarterly'
  ageDays: number | null;
  isStale: boolean;              // true if past STALE_DAYS.runbook since lastReviewed
  mtime: string;
}

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield full;
    }
  }
}

export async function readRunbooks(): Promise<Runbook[]> {
  const out: Runbook[] = [];
  for (const root of paths.runbookGlobs) {
    for await (const p of walk(root)) {
      const raw = await readFile(p, 'utf8');
      const fm = matter(raw);
      const data = fm.data as Record<string, unknown>;
      const stats = await stat(p);
      const lastReviewed = pickDate(data.last_reviewed ?? data.lastReviewed);
      const ageDays = lastReviewed
        ? Math.floor((Date.now() - new Date(lastReviewed).getTime()) / 86_400_000)
        : null;
      out.push({
        path: p,
        relPath: p.slice(paths.root.length + 1).replace(/\\/g, '/'),
        title: stringOr(data.title) ?? deriveTitle(raw, p),
        owner: stringOr(data.owner),
        lastReviewed,
        cadence: stringOr(data.cadence),
        ageDays,
        isStale: ageDays === null ? true : ageDays > STALE_DAYS.runbook,
        mtime: stats.mtime.toISOString(),
      });
    }
  }
  return out.sort((a, b) => (b.ageDays ?? Infinity) - (a.ageDays ?? Infinity));
}

function stringOr(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function pickDate(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }
  return null;
}

function deriveTitle(raw: string, p: string): string {
  const m = raw.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : p.split(/[\\/]/).pop()!.replace(/\.md$/, '');
}
