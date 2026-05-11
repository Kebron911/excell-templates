#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { appendAlert, AlertPrioritySchema } from '../src/lib/data/alerts.js';
import { readProgress } from '../src/lib/data/progress.js';
import { readRunbooks } from '../src/lib/data/runbooks.js';
import { readVendors } from '../src/lib/data/vendors.js';
import { readClusterStatus } from '../src/lib/data/cluster.js';

const here = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(here, '..');

const args = process.argv.slice(2);
const cmd = args[0];

const HELP = `
empire — STR Ledger empire console CLI

Commands:
  empire dev                          Start the console at localhost:4327
  empire status                       Print cluster + ops health (exits non-zero on red)
  empire alert <P0|P1|P2> "<msg>"     Append alert to ops/alerts.ndjson
                                      [--source <name>] [--url <link>]

Examples:
  empire status
  empire alert P0 "manifest failing on main" --source manifest-watch
`;

async function main() {
  switch (cmd) {
    case 'dev':
      return run('pnpm', ['exec', 'astro', 'dev', '--port', '4327', '--host'], { cwd: PKG_ROOT });
    case 'status':
      return status();
    case 'alert':
      return alert(args.slice(1));
    case '-h':
    case '--help':
    case 'help':
    case undefined:
      console.log(HELP.trim());
      return;
    default:
      console.error(`unknown command: ${cmd}\n`);
      console.log(HELP.trim());
      process.exit(1);
  }
}

function run(bin: string, argv: string[], opts: { cwd: string }): Promise<void> {
  return new Promise((resolveDone, reject) => {
    const proc = spawn(bin, argv, { stdio: 'inherit', cwd: opts.cwd, shell: process.platform === 'win32' });
    proc.on('error', reject);
    proc.on('close', (code) => (code === 0 ? resolveDone() : process.exit(code ?? 1)));
  });
}

async function status() {
  const [progress, runbooks, vendors, sites] = await Promise.all([
    readProgress(),
    readRunbooks(),
    readVendors(),
    readClusterStatus(),
  ]);
  const stale = runbooks.filter((r) => r.isStale).length;
  const sitesBad = sites.filter((s) => s.status !== 'ok').length;
  const lines: string[] = [];
  lines.push(`PROGRESS:  ${progress.totalUnchecked} unchecked, ${progress.nextActions.length} P0 actions`);
  lines.push(`RUNBOOKS:  ${runbooks.length} indexed, ${stale} stale`);
  lines.push(`VENDORS:   $${vendors.monthlyBurn.toFixed(0)}/mo, ${vendors.upcomingRenewals} renewals ≤30d`);
  lines.push(`CLUSTER:   ${sites.length - sitesBad}/${sites.length} sites green`);
  for (const s of sites) lines.push(`           ${s.status === 'ok' ? '✓' : '✗'} ${s.name.padEnd(20)} ${s.lastBuiltAt ?? 'unbuilt'}`);
  console.log(lines.join('\n'));
  const exitCode = sitesBad > 0 || progress.nextActions.length > 5 ? 1 : 0;
  process.exit(exitCode);
}

async function alert(rest: string[]) {
  const [priority, message, ...extra] = rest;
  if (!priority || !message) {
    console.error('usage: empire alert <P0|P1|P2> "<message>" [--source <name>] [--url <link>]');
    process.exit(1);
  }
  const parsedPriority = AlertPrioritySchema.parse(priority.toUpperCase());
  let source = 'cli';
  let url: string | undefined;
  for (let i = 0; i < extra.length; i++) {
    if (extra[i] === '--source') source = extra[++i];
    else if (extra[i] === '--url') url = extra[++i];
  }
  const alertRecord = await appendAlert({ priority: parsedPriority, source, message, url });
  console.log(`appended ${alertRecord.priority} ${alertRecord.id}: ${alertRecord.message}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
