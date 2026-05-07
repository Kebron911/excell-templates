/**
 * Browser-side helper for the Phase 3 AI endpoints. Each generator React
 * island posts a typed body and unpacks `{ result, tokensUsed, requestsRemaining }`
 * (or a structured error envelope).
 */

const API_BASE = (import.meta.env.PUBLIC_API_BASE as string | undefined) ?? '';

export type AiEndpoint = 'generate-listing' | 'generate-review' | 'generate-message';

export interface AiSuccess {
  ok: true;
  result: string;
  tokensUsed: number;
  requestsRemaining: number;
}

export interface AiFailure {
  ok: false;
  status: number;
  error: string;
  message?: string;
  resetAt?: string;
}

export type AiResponse = AiSuccess | AiFailure;

export async function callAi(endpoint: AiEndpoint, body: unknown): Promise<AiResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return { ok: false, status: 0, error: 'network_error', message: String(err) };
  }

  let payload: any = {};
  try {
    payload = await res.json();
  } catch {
    /* non-json body */
  }

  if (res.ok) {
    return {
      ok: true,
      result: payload.result ?? '',
      tokensUsed: payload.tokensUsed ?? 0,
      requestsRemaining: payload.requestsRemaining ?? 0,
    };
  }

  return {
    ok: false,
    status: res.status,
    error: payload.error ?? 'unknown',
    message: payload.message,
    resetAt: payload.resetAt,
  };
}

export function emitGa4(event: string, params: Record<string, unknown> = {}): void {
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, params);
  }
}
