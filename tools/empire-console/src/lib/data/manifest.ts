import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { paths } from '../paths.js';

export interface ManifestResult {
  ok: boolean;
  exitCode: number;
  passing: number | null;
  total: number | null;
  summary: string;
  output: string;
  ranAt: string;
}

const SUMMARY_RE = /(\d+)\s*\/\s*(\d+)\s*PASS/i;

export async function runManifestCheck(): Promise<ManifestResult> {
  const script = join(paths.templates, '_build', 'manifest_check.py');
  return new Promise((resolve) => {
    const proc = spawn('python', [script], { cwd: paths.root });
    let out = '';
    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.stderr.on('data', (d) => (out += d.toString()));
    proc.on('close', (code) => {
      const exitCode = code ?? -1;
      const m = out.match(SUMMARY_RE);
      const passing = m ? Number(m[1]) : null;
      const total = m ? Number(m[2]) : null;
      const summary = m
        ? `${passing}/${total} ${exitCode === 0 ? 'PASS' : 'FAIL'}`
        : exitCode === 0 ? 'PASS' : `exit ${exitCode}`;
      resolve({
        ok: exitCode === 0,
        exitCode,
        passing,
        total,
        summary,
        output: out.slice(-4000),
        ranAt: new Date().toISOString(),
      });
    });
    proc.on('error', (err) => {
      resolve({
        ok: false,
        exitCode: -1,
        passing: null,
        total: null,
        summary: `script not runnable: ${err.message}`,
        output: String(err),
        ranAt: new Date().toISOString(),
      });
    });
  });
}
