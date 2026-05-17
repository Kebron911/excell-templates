/**
 * Influencersoft provider for free-tier alerts (batched marketing send).
 *
 * Influencersoft doesn't ship a typed Node SDK, so this is a thin fetch
 * wrapper around the REST endpoints we need. The dispatcher pushes
 * alert batches as a single API call per (city, severity, list_id) tuple
 * to keep API-call volume low.
 *
 * Required env:
 *   INFLUENCERSOFT_API_KEY            — bearer for all calls
 *   INFLUENCERSOFT_BASE_URL           — defaults to https://api.influencersoft.com
 *   INFLUENCERSOFT_FREE_ALERTS_LIST_ID — list to upsert contacts into
 */
import type { EmailMessage, EmailProvider, EmailSendResult } from './types';

export interface InfluencersoftConfig {
  apiKey: string;
  baseUrl: string;
  /** Default list to upsert into when subscribing free-tier users. */
  freeAlertsListId: string;
}

/** Minimal fetch surface we depend on. Test code injects a stub here. */
export interface HttpClient {
  (input: string, init: { method: string; headers: Record<string, string>; body: string }): Promise<{
    ok: boolean;
    status: number;
    text: () => Promise<string>;
    json: () => Promise<unknown>;
  }>;
}

export function createInfluencersoftProvider(
  config: InfluencersoftConfig,
  http: HttpClient = globalThis.fetch as unknown as HttpClient,
): EmailProvider & {
  upsertContact(email: string, tags?: string[]): Promise<{ contactId: string | null; error: string | null }>;
} {
  const headers = {
    Authorization: `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
  };

  return {
    channel: 'influencersoft',

    async send(message: EmailMessage): Promise<EmailSendResult> {
      try {
        const response = await http(`${config.baseUrl}/v1/transactional/send`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html,
            tags: message.tags,
          }),
        });
        if (!response.ok) {
          const errText = await response.text();
          return {
            providerMessageId: null,
            status: 'failed',
            errorMessage: `HTTP ${response.status}: ${errText.slice(0, 200)}`,
          };
        }
        const data = (await response.json()) as { id?: string };
        return { providerMessageId: data.id ?? null, status: 'sent', errorMessage: null };
      } catch (err) {
        return {
          providerMessageId: null,
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'unknown influencersoft error',
        };
      }
    },

    async upsertContact(email, tags = []) {
      try {
        const response = await http(`${config.baseUrl}/v1/contacts`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ email, lists: [config.freeAlertsListId], tags }),
        });
        if (!response.ok) {
          return { contactId: null, error: `HTTP ${response.status}` };
        }
        const data = (await response.json()) as { id?: string };
        return { contactId: data.id ?? null, error: null };
      } catch (err) {
        return {
          contactId: null,
          error: err instanceof Error ? err.message : 'unknown influencersoft error',
        };
      }
    },
  };
}

export function loadInfluencersoftProvider(): ReturnType<typeof createInfluencersoftProvider> | null {
  const apiKey = process.env.INFLUENCERSOFT_API_KEY;
  const freeAlertsListId = process.env.INFLUENCERSOFT_FREE_ALERTS_LIST_ID;
  const baseUrl = process.env.INFLUENCERSOFT_BASE_URL ?? 'https://api.influencersoft.com';
  if (!apiKey || !freeAlertsListId) return null;
  return createInfluencersoftProvider({ apiKey, baseUrl, freeAlertsListId });
}
