import { test, expect } from '@playwright/test';

/**
 * Lead-magnet landing pages — strops.tools ships three (vs strhost.tools' one):
 *   - /cleaner-sop          (cleaner-sop-pdf magnet)
 *   - /supply-par           (supply-par-pdf magnet)
 *   - /maintenance-checklist (maintenance-checklist-pdf magnet)
 *
 * Each page renders an EmailCaptureCard. ESP webhook isn't set in test env
 * (PUBLIC_ESP_WEBHOOK unset), so the form's submit handler logs to console
 * and updates the status text to "Got it. Watch your inbox." — the success
 * state we assert on.
 */

const PAGES: Array<{ path: string; magnet: string; headlineRegex: RegExp }> = [
  { path: '/cleaner-sop/', magnet: 'cleaner-sop-pdf', headlineRegex: /Cleaner SOP/i },
  { path: '/supply-par/', magnet: 'supply-par-pdf', headlineRegex: /Supply Par-Level Sheet/i },
  { path: '/maintenance-checklist/', magnet: 'maintenance-checklist-pdf', headlineRegex: /Maintenance Checklist/i },
];

test.describe('Lead-magnet pages', () => {
  for (const { path, magnet, headlineRegex } of PAGES) {
    test(`${path} renders EmailCaptureCard and submits to success state`, async ({ page }) => {
      await page.goto(path);

      // h1 + label match.
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByText(headlineRegex).first()).toBeVisible();

      // EmailCaptureCard scoped by magnet (the form's data-magnet attr).
      const form = page.locator(`form[data-email-capture][data-magnet="${magnet}"]`);
      await expect(form).toBeVisible();

      // Fill stub email + submit.
      const emailInput = form.locator('input[name="email"]');
      await emailInput.fill('e2e@strops.tools');
      await form.getByRole('button').click();

      // Status text flips to success copy on the sibling [data-email-capture-status].
      const status = page.locator('[data-email-capture-status]').first();
      await expect(status).toHaveText(/Got it\. Watch your inbox\./i, { timeout: 5_000 });
      // Email field cleared on success.
      await expect(emailInput).toHaveValue('');
    });
  }
});
