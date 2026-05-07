import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Pin script structure tests. We don't run the actual Satori build inside
 * Vitest (it fetches fonts over the network and writes 9 PNGs). Instead
 * the build runs as part of `pnpm build`. Here we assert the script is
 * structurally correct: it imports satori, declares the right canvas,
 * and emits to the expected directories.
 */
describe('scripts/build-pins.mjs structure', () => {
  const scriptPath = resolve(here, '../../scripts/build-pins.mjs');
  const source = readFileSync(scriptPath, 'utf-8');

  it('imports satori + sharp', () => {
    expect(source).toMatch(/from 'satori'/);
    expect(source).toMatch(/from 'sharp'/);
  });

  it('declares the Pinterest-standard 1000x1500 canvas', () => {
    expect(source).toMatch(/width: 1000/);
    expect(source).toMatch(/height: 1500/);
  });

  it('writes both dist/pins and public/pins outputs', () => {
    expect(source).toMatch(/'dist',\s*'pins'/);
    expect(source).toMatch(/'public',\s*'pins'/);
  });

  it('reads tool slugs from src/data/tools.json (not hard-coded)', () => {
    expect(source).toMatch(/tools\.json/);
  });

  it('uses the strguests terracotta accent color (#C8684C)', () => {
    expect(source).toMatch(/#C8684C/);
  });
});

describe('built pin output (only if run after pnpm build)', () => {
  const distPin = resolve(here, '../../dist/pins/index.png');
  const exists = existsSync(distPin);

  it.skipIf(!exists)('produces a valid PNG with magic bytes for the landing pin', () => {
    const bytes = readFileSync(distPin);
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50);
    expect(bytes[2]).toBe(0x4e);
    expect(bytes[3]).toBe(0x47);
  });
});
