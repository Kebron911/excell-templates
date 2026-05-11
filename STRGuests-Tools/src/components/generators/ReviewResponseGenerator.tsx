/**
 * Review response generator — React island for /review-response.
 * Submits to POST /api/generate-review via the shared AiGeneratorShell.
 */

import { useState } from 'react';
import AiGeneratorShell from './AiGeneratorShell';

type StarVariant = '5_star' | '4_star' | 'bad_review';

const VARIANTS: Array<{ value: StarVariant; label: string; helper: string }> = [
  { value: '5_star', label: '5★', helper: 'Warm thanks, invite them back.' },
  { value: '4_star', label: '4★', helper: 'Thanks + a single sentence on what could improve.' },
  { value: 'bad_review', label: 'Bad', helper: '≤3★ — empathy first, then concrete remedy.' },
];

export default function ReviewResponseGenerator() {
  const [starVariant, setStarVariant] = useState<StarVariant>('5_star');
  const [reviewText, setReviewText] = useState('');
  const [context, setContext] = useState('');

  return (
    <AiGeneratorShell
      endpoint="/api/generate-review"
      toolSlug="review-response"
      generateLabel="Generate response"
      buildBody={() => ({
        starVariant,
        reviewText: reviewText.trim(),
        context: context.trim() || undefined,
      })}
      renderForm={() => (
        <>
          <div>
            <label className="label text-ink-3">Review type</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {VARIANTS.map((v) => (
                <label
                  key={v.value}
                  className={`cursor-pointer rounded-md border px-3 py-2 text-small ${
                    starVariant === v.value ? 'border-[color:var(--accent-500)] bg-parchment-light' : 'border-rule'
                  }`}
                >
                  <input
                    type="radio"
                    name="star"
                    value={v.value}
                    checked={starVariant === v.value}
                    onChange={() => setStarVariant(v.value)}
                    className="sr-only"
                  />
                  <strong className="block text-navy">{v.label}</strong>
                  <span className="block text-caption text-ink-3">{v.helper}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label text-ink-3" htmlFor="rev-text">Review text</label>
            <textarea
              id="rev-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={6}
              maxLength={2000}
              required
              className="mt-1 w-full rounded-md border border-rule px-3 py-2 text-body"
              placeholder="Paste the review here."
            />
          </div>
          <div>
            <label className="label text-ink-3" htmlFor="rev-ctx">Host context (optional)</label>
            <textarea
              id="rev-ctx"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              maxLength={800}
              className="mt-1 w-full rounded-md border border-rule px-3 py-2 text-body"
              placeholder="What actually happened — what you'd like the response to acknowledge or correct."
            />
          </div>
        </>
      )}
    />
  );
}
