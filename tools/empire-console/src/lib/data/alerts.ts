import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { z } from 'zod';
import { paths } from '../paths.js';

export const AlertPrioritySchema = z.enum(['P0', 'P1', 'P2']);
export type AlertPriority = z.infer<typeof AlertPrioritySchema>;

export const AlertSchema = z.object({
  id: z.string(),
  priority: AlertPrioritySchema,
  source: z.string(),       // e.g. 'cluster-smoke', 'vendor-renewal-watch'
  message: z.string(),
  url: z.string().optional(),
  ts: z.string(),           // ISO timestamp
  acked: z.boolean().optional(),
});
export type Alert = z.infer<typeof AlertSchema>;

export async function readAlerts(limit = 50): Promise<Alert[]> {
  let raw: string;
  try {
    raw = await readFile(paths.alertsLog, 'utf8');
  } catch {
    return [];
  }
  const out: Alert[] = [];
  const lines = raw.split(/\r?\n/).filter(Boolean);
  // newest last in NDJSON; iterate from the tail
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
    try {
      const parsed = AlertSchema.parse(JSON.parse(lines[i]));
      out.push(parsed);
    } catch {
      // skip malformed lines
    }
  }
  return out;
}

export async function appendAlert(input: Omit<Alert, 'id' | 'ts'> & Partial<Pick<Alert, 'id' | 'ts'>>): Promise<Alert> {
  const alert: Alert = {
    id: input.id ?? cryptoRandomId(),
    ts: input.ts ?? new Date().toISOString(),
    priority: input.priority,
    source: input.source,
    message: input.message,
    url: input.url,
    acked: input.acked,
  };
  await mkdir(dirname(paths.alertsLog), { recursive: true });
  await appendFile(paths.alertsLog, JSON.stringify(alert) + '\n', 'utf8');
  return alert;
}

function cryptoRandomId(): string {
  // node 22 has crypto.randomUUID globally
  // @ts-expect-error global
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
