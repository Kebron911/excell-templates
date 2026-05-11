import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { z } from 'zod';
import { paths } from '../paths.js';

export const InboxCategory = z.enum(['idea', 'quote', 'competitor', 'seed', 'todo', 'question', 'note']);
export type InboxCategory = z.infer<typeof InboxCategory>;

export const InboxEntry = z.object({
  id: z.string(),
  ts: z.string(),
  category: InboxCategory,
  text: z.string(),
  tags: z.array(z.string()).default([]),
});
export type InboxEntry = z.infer<typeof InboxEntry>;

export async function readInbox(limit = 100): Promise<InboxEntry[]> {
  let raw: string;
  try { raw = await readFile(paths.inbox, 'utf8'); }
  catch { return []; }
  const out: InboxEntry[] = [];
  const lines = raw.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
    try { out.push(InboxEntry.parse(JSON.parse(lines[i]))); }
    catch { /* skip malformed */ }
  }
  return out;
}

export async function appendInbox(input: { category: InboxCategory; text: string; tags?: string[] }): Promise<InboxEntry> {
  const entry: InboxEntry = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    ts: new Date().toISOString(),
    category: input.category,
    text: input.text,
    tags: input.tags ?? [],
  };
  await mkdir(dirname(paths.inbox), { recursive: true });
  await appendFile(paths.inbox, JSON.stringify(entry) + '\n', 'utf8');
  return entry;
}
