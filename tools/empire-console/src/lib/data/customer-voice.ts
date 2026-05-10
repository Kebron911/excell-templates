import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { z } from 'zod';
import { paths } from '../paths.js';

export const VoiceCategory = z.enum(['positive', 'pain', 'feature-ask', 'objection', 'usage-pattern', 'churn-reason']);
export type VoiceCategory = z.infer<typeof VoiceCategory>;

export const VoiceEntry = z.object({
  id: z.string(),
  ts: z.string(),
  category: VoiceCategory,
  quote: z.string(),
  source: z.string(),         // "etsy-convo" | "gumroad-msg" | "email" | "review" | "dm" | string
  sku: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
});
export type VoiceEntry = z.infer<typeof VoiceEntry>;

export async function readVoice(limit = 200): Promise<VoiceEntry[]> {
  let raw: string;
  try { raw = await readFile(paths.customerVoice, 'utf8'); }
  catch { return []; }
  const out: VoiceEntry[] = [];
  const lines = raw.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
    try { out.push(VoiceEntry.parse(JSON.parse(lines[i]))); }
    catch { /* skip */ }
  }
  return out;
}

export async function appendVoice(input: Omit<VoiceEntry, 'id' | 'ts'>): Promise<VoiceEntry> {
  const entry: VoiceEntry = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    ts: new Date().toISOString(),
    ...input,
  };
  await mkdir(dirname(paths.customerVoice), { recursive: true });
  await appendFile(paths.customerVoice, JSON.stringify(entry) + '\n', 'utf8');
  return entry;
}
