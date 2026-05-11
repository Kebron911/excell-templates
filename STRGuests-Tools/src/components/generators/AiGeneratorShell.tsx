/**
 * Shared shell for the 3 AI generator islands.
 *
 * Owns: submit → POST to {endpoint} → render result → Copy / Regenerate. Listens
 * to the `strguests:rate-limit` CustomEvent that AiRateLimitNotice dispatches so the
 * primary Submit button disables when the visitor is out of quota.
 *
 * Each generator (listing/review/message) supplies:
 *   - `endpoint`   — API path (e.g. '/api/generate-listing')
 *   - `toolSlug`   — for the rate-limit event filter
 *   - `buildBody`  — closure over local form state → POST body
 *   - `renderForm` — the form fields React element
 */

import { useEffect, useState, type ReactNode } from 'react';

export interface AiGeneratorShellProps {
  endpoint: string;
  toolSlug: string;
  buildBody: () => unknown;
  renderForm: () => ReactNode;
  /** Optional override for the Generate label. */
  generateLabel?: string;
}

type Status = 'idle' | 'loading' | 'ok' | 'error' | 'rate_limited';

export default function AiGeneratorShell(props: AiGeneratorShellProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rateBlocked, setRateBlocked] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  // Wire the AiRateLimitNotice custom event so this island disables Submit when the
  // visitor is over budget. Same-tool events only.
  useEffect(() => {
    function onRate(ev: Event) {
      const detail = (ev as CustomEvent<{ tool: string; blocked: boolean }>).detail;
      if (!detail || detail.tool !== props.toolSlug) return;
      setRateBlocked(!!detail.blocked);
    }
    window.addEventListener('strguests:rate-limit', onRate as EventListener);
    return () => window.removeEventListener('strguests:rate-limit', onRate as EventListener);
  }, [props.toolSlug]);

  async function submit(ev?: React.FormEvent) {
    ev?.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const apiBase = (typeof window !== 'undefined' && (window as any).__strguests_api_base) ?? '';
      const res = await fetch(`${apiBase}${props.endpoint}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(props.buildBody()),
      });
      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        setStatus('rate_limited');
        setRateBlocked(true);
        setError(body.upgradeHint ?? 'Out of generations for this window.');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus('error');
        setError(body.detail ?? body.error ?? `HTTP ${res.status}`);
        return;
      }
      const body = await res.json();
      setOutput(typeof body.result === 'string' ? body.result : '');
      setStatus('ok');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'unexpected_error');
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      // No-op — older browsers without clipboard write permission.
    }
  }

  const submitDisabled = status === 'loading' || rateBlocked;

  return (
    <div className="ai-shell grid gap-6 md:grid-cols-[1fr_1fr]">
      <form className="space-y-4" onSubmit={submit}>
        {props.renderForm()}
        <button
          type="submit"
          disabled={submitDisabled}
          className="rounded-md bg-[color:var(--accent-500)] px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-[color:var(--accent-700)] disabled:bg-rule disabled:text-ink-3"
        >
          {status === 'loading' ? 'Generating…' : (props.generateLabel ?? 'Generate')}
        </button>
        {error && status !== 'ok' && (
          <p className="text-small text-[color:var(--accent-700)]" role="alert">{error}</p>
        )}
      </form>

      <div className="output-pane">
        <label className="label text-ink-3">Generated output</label>
        <div
          className="mt-2 min-h-[16rem] whitespace-pre-wrap rounded-md border border-rule bg-parchment-light p-4 text-body text-graphite"
          aria-live="polite"
        >
          {status === 'idle' && <span className="text-ink-3">Fill in the form and click Generate.</span>}
          {status === 'loading' && <span className="text-ink-3">Generating with gpt-4o-mini…</span>}
          {status === 'ok' && output}
          {status === 'rate_limited' && <span className="text-ink-3">{error}</span>}
          {status === 'error' && <span className="text-ink-3">Error — try again. ({error})</span>}
        </div>
        {status === 'ok' && (
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-rule px-4 py-2 text-small text-navy hover:bg-parchment-light"
            >
              {copyState === 'copied' ? 'Copied ✓' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={() => submit()}
              disabled={rateBlocked}
              className="rounded-md border border-rule px-4 py-2 text-small text-navy hover:bg-parchment-light disabled:text-ink-3"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
