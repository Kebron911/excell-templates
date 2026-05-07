/**
 * ReviewResponseGenerator — React island for the review-response AI tool.
 *
 * Form on the left (review text + 1-5 stars + tone + goal). Result panel on
 * the right with copy/regenerate.
 */

import { useEffect, useState } from 'react';
import { callAi, emitGa4 } from '@/lib/ai-client';

type Tone = 'warm' | 'professional';
type Goal = 'thank' | 'address-issue' | 'redirect-future';

const GOAL_LABELS: Record<Goal, string> = {
  thank: 'Thank a happy guest',
  'address-issue': 'Address an issue',
  'redirect-future': 'Reframe for future guests',
};

export default function ReviewResponseGenerator() {
  const [reviewText, setReviewText] = useState(
    'Loved the cabin! The hot tub was great and the host was responsive. Wifi was spotty though.',
  );
  const [starRating, setStarRating] = useState(4);
  const [tone, setTone] = useState<Tone>('warm');
  const [responseGoal, setResponseGoal] = useState<Goal>('thank');

  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    function onRate(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.tool === 'review-response') {
        setRemaining(typeof detail.remaining === 'number' ? detail.remaining : null);
        setBlocked(Boolean(detail.blocked));
      }
    }
    window.addEventListener('strguests:rate-limit', onRate as EventListener);
    return () => window.removeEventListener('strguests:rate-limit', onRate as EventListener);
  }, []);

  async function submit() {
    if (busy || blocked) return;
    if (reviewText.trim().length < 5) {
      setError('Paste the review you want to respond to first.');
      return;
    }
    setError(null);
    setBusy(true);
    const out = await callAi('generate-review', {
      reviewText: reviewText.trim(),
      starRating,
      tone,
      responseGoal,
    });
    setBusy(false);
    if (out.ok) {
      setResult(out.result);
      setRemaining(out.requestsRemaining);
      emitGa4('ai_generation_completed', { tool: 'review-response', tokens: out.tokensUsed });
    } else if (out.status === 429) {
      setBlocked(true);
      setError("You're out of free generations for now. Verify your email for 50/day.");
      emitGa4('ai_rate_limit_hit', { tool: 'review-response' });
    } else if (out.error === 'ai_unconfigured') {
      setError('The AI generator is not yet configured on the server. Try again after launch.');
    } else {
      setError(out.message ?? 'Something went wrong. Please try again.');
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    emitGa4('text_copied', { tool: 'review-response' });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6">
      <section className="surface-gen p-5">
        <h2 className="font-serif text-h3 text-navy">Paste the review</h2>
        <p className="mt-1 text-small text-ink-2 leading-snug">
          Public responses read well to FUTURE guests browsing. Stay gracious — never argue.
        </p>

        <label className="mt-5 flex flex-col text-caption text-ink-2 uppercase tracking-widest">
          The review
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={5}
            maxLength={4000}
            className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
          />
        </label>

        <div className="mt-4">
          <p className="text-caption text-ink-2 uppercase tracking-widest">Star rating</p>
          <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={starRating === n}
                onClick={() => setStarRating(n)}
                className="rounded-md border border-rule px-3 py-2 text-ui focus:outline-none focus:shadow-focus"
                style={{
                  background: starRating === n ? 'var(--accent-500)' : 'var(--color-parchment-light, #fdfaf2)',
                  color: starRating === n ? 'white' : 'var(--color-navy)',
                  borderColor: starRating === n ? 'var(--accent-500)' : undefined,
                }}
              >
                {n}★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Tone
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            >
              <option value="warm">warm</option>
              <option value="professional">professional</option>
            </select>
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Goal
            <select
              value={responseGoal}
              onChange={(e) => setResponseGoal(e.target.value as Goal)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            >
              <option value="thank">{GOAL_LABELS.thank}</option>
              <option value="address-issue">{GOAL_LABELS['address-issue']}</option>
              <option value="redirect-future">{GOAL_LABELS['redirect-future']}</option>
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={busy || blocked}
          className="mt-5 inline-flex items-center gap-2 rounded-md text-parchment px-5 py-2.5 text-ui transition-colors duration-std focus:outline-none focus:shadow-focus hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent-500)' }}
        >
          {busy ? 'Generating…' : result ? 'Regenerate' : 'Write the response'}
        </button>
        {error ? (
          <p className="mt-3 text-small text-[color:var(--accent-700)]">{error}</p>
        ) : null}
      </section>

      <section className="surface-gen p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-h3 text-navy">Your response</h2>
          {remaining !== null ? (
            <span className="text-caption text-ink-3">{remaining} generations left</span>
          ) : null}
        </div>
        {result ? (
          <>
            <p className="mt-4 whitespace-pre-wrap text-body text-graphite leading-relaxed">{result}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyResult}
                className="inline-flex items-center gap-2 rounded-md border border-rule bg-parchment px-4 py-2 text-ui text-navy hover:bg-parchment-light focus:outline-none focus:shadow-focus"
              >
                Copy text
              </button>
            </div>
          </>
        ) : (
          <p className="mt-4 text-small text-ink-3 leading-snug">
            Paste a review on the left and hit <em>Write the response</em>. Output appears here.
          </p>
        )}
      </section>
    </div>
  );
}
