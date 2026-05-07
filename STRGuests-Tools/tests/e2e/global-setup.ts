/**
 * Playwright globalSetup — runs `astro build` once before any test boots so
 * webServer.command can simply `astro preview` the prebuilt dist.
 *
 * Skipping the pin + OG image build steps because they fetch remote fonts
 * that occasionally 404 — those assets aren't needed for E2E smokes.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export default async function globalSetup(): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url));
  const root = resolve(here, '../..');
  const distIndex = resolve(root, 'dist/index.html');

  // Skip rebuild if dist/ is fresh enough — saves ~6s per run locally.
  if (existsSync(distIndex) && !process.env.CI && !process.env.PLAYWRIGHT_FORCE_BUILD) {
    console.log('[playwright globalSetup] reusing existing dist/');
    return;
  }

  console.log('[playwright globalSetup] running astro build…');
  await new Promise<void>((resolveP, rejectP) => {
    const child = spawn('pnpm', ['exec', 'astro', 'build'], {
      cwd: root,
      stdio: 'inherit',
      shell: true,
    });
    child.on('exit', (code) => {
      if (code === 0) resolveP();
      else rejectP(new Error(`astro build failed with exit code ${code}`));
    });
    child.on('error', rejectP);
  });
}
