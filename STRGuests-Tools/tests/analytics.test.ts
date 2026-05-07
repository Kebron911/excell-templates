import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Locks the GA4 wiring contract at the source level. Phase 6 Task 32.
 *
 * - Layout.astro must gate the GA4 snippet behind PUBLIC_GA4_ID so unset
 *   env yields a clean build with no gtag script (preserves the static-site
 *   fallback story for environments without analytics).
 * - The gtag config must enable cross-domain linking for the full STR
 *   cluster — losing a domain here silently breaks attribution.
 * - The .env.example must continue to document PUBLIC_GA4_ID so deploys
 *   know to set it.
 * - Each instrumented funnel surface must call `gtag('event', ...)`
 *   for its named conversion event.
 */

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

function read(p: string) {
  return readFileSync(resolve(root, p), 'utf-8');
}

describe('GA4 wiring (Phase 6 Task 32)', () => {
  it('Layout.astro emits the gtag snippet only when PUBLIC_GA4_ID is set', () => {
    const layout = read('src/components/chrome/Layout.astro');
    expect(layout).toMatch(/import\.meta\.env\.PUBLIC_GA4_ID\s*&&/);
    expect(layout).toMatch(/googletagmanager\.com\/gtag\/js\?id=/);
    expect(layout).toMatch(/window\.dataLayer/);
    expect(layout).toMatch(/send_page_view:\s*true/);
  });

  it('cross-domain linker covers all five STR cluster domains', () => {
    const layout = read('src/components/chrome/Layout.astro');
    for (const domain of [
      'strhost.tools',
      'thestrledger.com',
      'strbuyers.tools',
      'strops.tools',
      'strguests.tools',
    ]) {
      expect(layout, `linker missing ${domain}`).toContain(domain);
    }
  });

  it('.env.example documents PUBLIC_GA4_ID', () => {
    const env = read('.env.example');
    expect(env).toMatch(/^PUBLIC_GA4_ID=/m);
  });

  it.each([
    ['src/components/generator/PdfDownloadButton.astro', 'pdf_downloaded'],
    ['src/components/generator/PdfDownloadButton.astro', 'email_captured'],
    ['src/components/funnel/EmailCaptureCard.astro', 'email_captured'],
    ['src/components/funnel/STRLedgerCTA.astro', 'str_ledger_cta_clicked'],
    ['src/components/generator/PinterestPinButton.astro', 'pin_intent_opened'],
  ])('%s fires gtag event %s', (path, eventName) => {
    const src = read(path);
    expect(src).toMatch(new RegExp(`gtag\\?\\.\\('event',\\s*'${eventName}'`));
  });
});
