import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Reads `infrastructure/n8n/flows/*.json` to surface what flows exist
 * in the repo (the "designed" state). Phase 4: also call n8n's
 * /api/v1/workflows + /api/v1/executions to merge live state.
 */

export interface N8nFlow {
  name: string;
  file: string;            // relative path
  triggerKind: string;     // cron | webhook | sub-workflow | unknown
  triggerSchedule: string | null;  // human-readable e.g. "daily 09:00"
  nodeCount: number;
  tags: string[];
  // Phase 4 fields, null until live API wired:
  active: boolean | null;
  lastExecution: string | null;
  successRate24h: number | null;
}

export interface N8nFlowReport {
  flows: N8nFlow[];
  totals: { total: number; cron: number; webhook: number; subWorkflow: number };
}

const FLOW_DIR = join(paths.root, 'infrastructure', 'n8n', 'flows');

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && e.name.endsWith('.json')) yield full;
  }
}

function describeCron(expr: string): string {
  // Cheap human-friendly translation for the common patterns we use.
  if (expr === '0 6 * * *') return 'daily 06:00';
  if (expr === '0 7 * * *') return 'daily 07:00';
  if (expr === '0 8 * * *') return 'daily 08:00';
  if (expr === '0 9 * * *') return 'daily 09:00';
  if (expr === '0 6 * * 1') return 'Monday 06:00';
  if (expr === '0 8 * * 1') return 'Monday 08:00';
  if (/\*\/15 \* \* \* \*/.test(expr)) return 'every 15 min';
  if (/\*\/30 \* \* \* \*/.test(expr)) return 'every 30 min';
  return expr;
}

export async function readN8nFlows(): Promise<N8nFlowReport> {
  const flows: N8nFlow[] = [];
  for await (const file of walk(FLOW_DIR)) {
    let raw = '';
    try { raw = await readFile(file, 'utf8'); } catch { continue; }
    let parsed;
    try { parsed = JSON.parse(raw); } catch { continue; }

    const nodes = Array.isArray(parsed.nodes) ? parsed.nodes : [];
    let triggerKind = 'unknown';
    let triggerSchedule: string | null = null;
    for (const n of nodes) {
      if (n.type === 'n8n-nodes-base.scheduleTrigger') {
        triggerKind = 'cron';
        const expr = n.parameters?.rule?.interval?.[0]?.expression;
        if (expr) triggerSchedule = describeCron(expr);
        break;
      }
      if (n.type === 'n8n-nodes-base.webhook') {
        triggerKind = 'webhook';
        const path = n.parameters?.path;
        if (path) triggerSchedule = `POST /webhook/${path}`;
        break;
      }
      if (n.type === 'n8n-nodes-base.executeWorkflowTrigger') {
        triggerKind = 'sub-workflow';
        triggerSchedule = 'called by other flows';
        break;
      }
    }

    flows.push({
      name: parsed.name ?? file.split(/[\\/]/).pop()!.replace(/\.json$/, ''),
      file: file.slice(paths.root.length + 1).replace(/\\/g, '/'),
      triggerKind,
      triggerSchedule,
      nodeCount: nodes.length,
      tags: Array.isArray(parsed.tags) ? parsed.tags.map((t: any) => t?.name).filter(Boolean) : [],
      active: null,
      lastExecution: null,
      successRate24h: null,
    });
  }

  flows.sort((a, b) => a.name.localeCompare(b.name));

  return {
    flows,
    totals: {
      total: flows.length,
      cron: flows.filter((f) => f.triggerKind === 'cron').length,
      webhook: flows.filter((f) => f.triggerKind === 'webhook').length,
      subWorkflow: flows.filter((f) => f.triggerKind === 'sub-workflow').length,
    },
  };
}
