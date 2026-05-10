import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { z } from 'zod';
import { paths } from '../paths.js';

export const DecisionCategory = z.enum(['strategic', 'tech', 'marketing', 'product', 'finance', 'ops', 'people']);
export type DecisionCategory = z.infer<typeof DecisionCategory>;

export const Decision = z.object({
  id: z.string(),
  ts: z.string(),
  title: z.string(),
  category: DecisionCategory,
  context: z.string().optional(),
  alternatives: z.array(z.string()).default([]),
  decision: z.string(),
  rationale: z.string().optional(),
  tags: z.array(z.string()).default([]),
});
export type Decision = z.infer<typeof Decision>;

export async function readDecisions(limit = 200): Promise<Decision[]> {
  let raw: string;
  try { raw = await readFile(paths.decisions, 'utf8'); }
  catch { return []; }
  const out: Decision[] = [];
  const lines = raw.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
    try { out.push(Decision.parse(JSON.parse(lines[i]))); }
    catch { /* skip */ }
  }
  return out;
}

export async function appendDecision(input: Omit<Decision, 'id' | 'ts'>): Promise<Decision> {
  const entry: Decision = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    ts: new Date().toISOString(),
    ...input,
  };
  await mkdir(dirname(paths.decisions), { recursive: true });
  await appendFile(paths.decisions, JSON.stringify(entry) + '\n', 'utf8');
  return entry;
}
