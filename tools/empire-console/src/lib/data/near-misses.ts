import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

export const NearMiss = z.object({
  id: z.string(),
  ts: z.string(),
  title: z.string(),
  what: z.string(),                 // what happened (or almost did)
  fix: z.string().optional(),       // what fixed it
  prevention: z.string().optional(),// what prevents recurrence
  tags: z.array(z.string()).default([]),
});
export type NearMiss = z.infer<typeof NearMiss>;

export async function readNearMisses(limit = 100): Promise<NearMiss[]> {
  let raw: string;
  try { raw = await readFile(paths.nearMisses, 'utf8'); }
  catch { return []; }
  const out: NearMiss[] = [];
  const lines = raw.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
    try { out.push(NearMiss.parse(JSON.parse(lines[i]))); }
    catch { /* skip */ }
  }
  return out;
}
