#!/usr/bin/env node
/**
 * install-hooks.mjs — point git at .githooks/ for this clone.
 *
 * Idempotent. Safe to run from any working directory inside the repo.
 */
import { execSync } from 'node:child_process';

try {
  const current = execSync('git config core.hooksPath', { encoding: 'utf-8' }).trim();
  if (current === '.githooks') {
    console.log('✓ git hooks already pointing at .githooks');
    process.exit(0);
  }
} catch {
  /* not set yet */
}

execSync('git config core.hooksPath .githooks', { stdio: 'inherit' });
console.log('✓ git config core.hooksPath → .githooks');
console.log('  pre-commit hook now runs: node ./scripts/check-env-leak.mjs');
