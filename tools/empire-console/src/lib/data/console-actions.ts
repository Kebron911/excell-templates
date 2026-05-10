import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { z } from 'zod';
import { paths } from '../paths.js';

/**
 * Console actions log — what triggers happened, when, and what came of them.
 *
 * Phase 4 wires every "Send broadcast" / "Ship release" / "Run backup test" button
 * to call appendConsoleAction() before/after. Right now this is a logger waiting
 * for triggers to land.
 */

export const ConsoleAction = z.object({
  id: z.string(),
  ts: z.string(),
  action: z.string(),               // e.g. "broadcast.send", "release.ship", "backup.test"
  actor: z.string(),                // typically "Daniel" — multi-user is post-MVP
  target: z.string(),               // what was acted on (sku id, broadcast id, runbook name…)
  outcome: z.enum(['success', 'failure', 'pending', 'cancelled']),
  note: z.string().optional(),
  /** Free-form metadata for the action. Phase 4 fills this with n8n flow execution IDs etc. */
  meta: z.record(z.string(), z.unknown()).optional(),
});
export type ConsoleAction = z.infer<typeof ConsoleAction>;

export async function readConsoleActions(limit = 100): Promise<ConsoleAction[]> {
  let raw: string;
  try { raw = await readFile(paths.consoleActions, 'utf8'); }
  catch { return []; }
  const out: ConsoleAction[] = [];
  const lines = raw.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
    try { out.push(ConsoleAction.parse(JSON.parse(lines[i]))); }
    catch { /* skip malformed */ }
  }
  return out;
}

export async function appendConsoleAction(input: Omit<ConsoleAction, 'id' | 'ts'>): Promise<ConsoleAction> {
  const entry: ConsoleAction = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    ts: new Date().toISOString(),
    ...input,
  };
  await mkdir(dirname(paths.consoleActions), { recursive: true });
  await appendFile(paths.consoleActions, JSON.stringify(entry) + '\n', 'utf8');
  return entry;
}
