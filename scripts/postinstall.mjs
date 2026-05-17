#!/usr/bin/env node
/**
 * postinstall — runs after `pnpm install`.
 *
 * 1) Wires git hooks (core.hooksPath → .githooks) so the pre-commit leak
 *    guard runs on every commit.
 * 2) Regenerates per-project .env.local files from root .env, if root .env
 *    exists. If it doesn't, prints a friendly hint and exits 0 — fresh
 *    clones shouldn't fail install just because the user hasn't filled in
 *    secrets yet.
 *
 * Cross-platform (no shell operators). The previous `&& / ||` pipeline
 * broke on Windows.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

function runNode(script) {
  const result = spawnSync(process.execPath, [join(REPO_ROOT, 'scripts', script)], {
    stdio: 'inherit',
    cwd: REPO_ROOT,
  });
  return result.status ?? 1;
}

// Step 1: hooks (cheap, always safe)
const hooksStatus = runNode('install-hooks.mjs');
if (hooksStatus !== 0) {
  console.warn('  (install-hooks failed — non-fatal, continuing)');
}

// Step 2: sync env if root .env exists
const rootEnv = join(REPO_ROOT, '.env');
if (!existsSync(rootEnv)) {
  console.log('  (sync:env skipped — root .env not yet created)');
  console.log('  → run `cp .env.example .env`, fill values, then `pnpm sync:env`');
  process.exit(0);
}
const syncStatus = runNode('sync-env.mjs');
process.exit(syncStatus);
