/**
 * MessageTemplateGenerator — React island for the guest-messages AI tool.
 *
 * Form on the left (8-type segmented control + property/host context). Result
 * panel on the right with copy. Output preserves Mustache placeholders so the
 * host can drop the text directly into a PMS template.
 */

import { useEffect, useState } from 'react';
import { callAi, emitGa4 } from '@/lib/ai-client';

const TYPES = [
  { id: 'booking-confirmation', label: 'Booking confirmation' },
  { id: 'pre-arrival', label: 'Pre-arrival (3 days out)' },
  { id: 'mid-stay', label: 'Mid-stay check-in' },
  { id: 'post-checkout', label: 'Post-checkout thank you' },
  { id: 'late-checkout-request', label: 'Late checkout reply' },
  { id: 'noise-complaint', label: 'Noise complaint reply' },
  { id: 'broken-item', label: 'Broken item reply' },
  { id: 'refund-request', label: 'Refund request reply' },
] as const;

type MessageType = typeof TYPES[number]['id'];

const PLACEHOLDERS = [
  '{{guestFirstName}}',
  '{{propertyName}}',
  '{{hostName}}',
  '{{checkInDate}}',
  '{{checkOutDate}}',
  '{{wifiNetwork}}',
  '{{wifiPassword}}',
  '{{addressLine}}',
];

export default function MessageTemplateGenerator() {
  const [messageType, setMessageType] = useState<MessageType>('pre-arrival');
  const [propertyName, setPropertyName] = useState('Cozy Cabin on Fox Ridge');
  const [hostName, setHostName] = useState('Daniel');
  const [scenarioDetails, setScenarioDetails] = useState('');

  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    function onRate(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.tool === 'guest-messages') {
        setRemaining(typeof detail.remaining === 'number' ? detail.remaining : null);
        setBlocked(Boolean(detail.blocked));
      }
    }
    window.addEventListener('strguests:rate-limit', onRate as EventListener);
    return () => window.removeEventListener('strguests:rate-limit', onRate as EventListener);
  }, []);

  async function submit() {
    if (busy || blocked) return;
    if (!propertyName.trim() || !hostName.trim()) {
      setError('Property name and host name are required.');
      return;
    }
    setError(null);
    setBusy(true);
    const out = await callAi('generate-message', {
      messageType,
      propertyName: propertyName.trim(),
      hostName: hostName.trim(),
      scenarioDetails: scenarioDetails.trim() || undefined,
    });
    setBusy(false);
    if (out.ok) {
      setResult(out.result);
      setRemaining(out.requestsRemaining);
      emitGa4('ai_generation_completed', { tool: 'guest-messages', tokens: out.tokensUsed });
    } else if (out.status === 429) {
      setBlocked(true);
      setError("You're out of free generations for now. Verify your email for 50/day.");
      emitGa4('ai_rate_limit_hit', { tool: 'guest-messages' });
    } else if (out.error === 'ai_unconfigured') {
      setError('The AI generator is not yet configured on the server. Try again after launch.');
    } else {
      setError(out.message ?? 'Something went wrong. Please try again.');
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    emitGa4('text_copied', { tool: 'guest-messages' });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6">
      <section className="surface-gen p-5">
        <h2 className="font-serif text-h3 text-navy">Pick the message</h2>
        <p className="mt-1 text-small text-ink-2 leading-snug">
          Output drops into your PMS template field. Variables stay as Mustache placeholders
          so booking-specific values fill in automatically.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Message type">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={messageType === t.id}
              onClick={() => setMessageType(t.id)}
              className="rounded-md border border-rule px-3 py-2 text-small text-left focus:outline-none focus:shadow-focus"
              style={{
                background: messageType === t.id ? 'var(--accent-500)' : 'var(--color-parchment-light, #fdfaf2)',
                color: messageType === t.id ? 'white' : 'var(--color-navy)',
                borderColor: messageType === t.id ? 'var(--accent-500)' : undefined,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Property name
            <input
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Host name
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest col-span-2">
            Scenario details <span className="lowercase tracking-normal text-ink-3">(optional, only used by complaint/dispute templates)</span>
            <textarea
              value={scenarioDetails}
              onChange={(e) => setScenarioDetails(e.target.value)}
              rows={3}
              maxLength={800}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={busy || blocked}
          className="mt-5 inline-flex items-center gap-2 rounded-md text-parchment px-5 py-2.5 text-ui transition-colors duration-std focus:outline-none focus:shadow-focus hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent-500)' }}
        >
          {busy ? 'Generating…' : result ? 'Regenerate' : 'Write the message'}
        </button>
        {error ? (
          <p className="mt-3 text-small text-[color:var(--accent-700)]">{error}</p>
        ) : null}
      </section>

      <section className="surface-gen p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-h3 text-navy">Template</h2>
          {remaining !== null ? (
            <span className="text-caption text-ink-3">{remaining} generations left</span>
          ) : null}
        </div>
        {result ? (
          <>
            <p className="mt-4 whitespace-pre-wrap text-body text-graphite leading-relaxed font-mono text-small">{result}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyResult}
                className="inline-flex items-center gap-2 rounded-md border border-rule bg-parchment px-4 py-2 text-ui text-navy hover:bg-parchment-light focus:outline-none focus:shadow-focus"
              >
                Copy template
              </button>
            </div>
          </>
        ) : (
          <p className="mt-4 text-small text-ink-3 leading-snug">
            Pick a message type on the left and hit <em>Write the message</em>. Mustache placeholders
            stay so your PMS can fill in per-booking values.
          </p>
        )}

        <div className="mt-6 border-t border-rule pt-4">
          <p className="text-caption text-ink-2 uppercase tracking-widest">Available placeholders</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-caption text-ink-3 font-mono">
            {PLACEHOLDERS.map((p) => (
              <li key={p} className="rounded bg-parchment-light px-2 py-1 border border-rule">{p}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
