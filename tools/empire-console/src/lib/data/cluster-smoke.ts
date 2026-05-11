import { spawn } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Runs each sister site's scripts/smoke.mjs against its production URL.
 * Phase 2 upgrade from filesystem-only checks.
 */

export interface SmokeResult {
  id: string;
  name: string;
  smokePath: string | null;
  ranAt: string;
  exitCode: number | null;
  durationMs: number;
  output: string;        // last 1500 chars
  ok: boolean;
}

export interface ClusterSmokeReport {
  results: SmokeResult[];
  ranAt: string;
}

const SMOKE_TIMEOUT_MS = 25_000;

async function fileExists(p: string): Promise<boolean> {
  try { await stat(p); return true; } catch { return false; }
}

function runSmoke(smokePath: string, baseUrl: string): Promise<{ exitCode: number | null; output: string; durationMs: number }> {
  return new Promise((resolve) => {
    const start = Date.now();
    let out = '';
    const timeoutId = setTimeout(() => {
      proc.kill('SIGTERM');
      resolve({ exitCode: null, output: out + '\n[timed out]', durationMs: Date.now() - start });
    }, SMOKE_TIMEOUT_MS);
    const proc = spawn('node', [smokePath], {
      env: { ...process.env, SMOKE_BASE_URL: baseUrl },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.stderr.on('data', (d) => (out += d.toString()));
    proc.on('close', (code) => {
      clearTimeout(timeoutId);
      resolve({ exitCode: code, output: out.slice(-1500), durationMs: Date.now() - start });
    });
    proc.on('error', (err) => {
      clearTimeout(timeoutId);
      resolve({ exitCode: -1, output: String(err), durationMs: Date.now() - start });
    });
  });
}

export async function readClusterSmoke(): Promise<ClusterSmokeReport> {
  const ranAt = new Date().toISOString();
  const results: SmokeResult[] = [];

  await Promise.all(paths.sites.map(async (site) => {
    const smokePath = join(site.dir, 'scripts', 'smoke.mjs');
    if (!(await fileExists(smokePath))) {
      results.push({
        id: site.id, name: site.name, smokePath: null,
        ranAt, exitCode: null, durationMs: 0, output: 'no scripts/smoke.mjs', ok: false,
      });
      return;
    }
    const baseUrl = `https://${site.name}`;
    const { exitCode, output, durationMs } = await runSmoke(smokePath, baseUrl);
    results.push({
      id: site.id, name: site.name,
      smokePath: smokePath.slice(paths.root.length + 1).replace(/\\/g, '/'),
      ranAt, exitCode, durationMs, output,
      ok: exitCode === 0,
    });
  }));

  results.sort((a, b) => a.id.localeCompare(b.id));
  return { results, ranAt };
}
