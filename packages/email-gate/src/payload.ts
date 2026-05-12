import type { EmailCapturePayload } from './schema.js';

const SITE_DOMAINS: Record<EmailCapturePayload['siteId'], string> = {
  guests: 'strguests.tools',
  buyers: 'strbuyers.tools',
  host: 'strhost.tools',
  ops: 'strops.tools',
};

const SITE_UTM_SOURCES: Record<EmailCapturePayload['siteId'], string> = {
  guests: 'strguests-tools',
  buyers: 'strbuyers-tools',
  host: 'strhost-tools',
  ops: 'strops-tools',
};

/**
 * Build the ESP webhook JSON payload. Stable shape — all email-gate
 * surfaces should use this so ESP-side mappings don't drift.
 */
export function buildEspPayload(input: EmailCapturePayload) {
  return {
    email: input.email.trim(),
    magnet: input.magnet ?? '',
    source: SITE_DOMAINS[input.siteId],
    tool: input.toolSlug ?? '',
    utm_source: SITE_UTM_SOURCES[input.siteId],
    utm_medium: input.utmMedium ?? 'pdf-download',
    utm_content: input.toolSlug ?? '',
    ts: Date.now(),
  };
}
