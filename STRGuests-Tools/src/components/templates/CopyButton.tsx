/**
 * Small copy-to-clipboard button used on /templates/[scenario] pages
 * next to exampleInput / exampleOutput blocks.
 *
 * Reads the target text via a `data-copy-source` attribute on a sibling
 * <pre> / <code> / <div>, OR accepts inline text via the `text` prop.
 */

import { useState } from 'react';

interface Props {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
      setTimeout(() => setState('idle'), 1600);
    } catch {
      setState('failed');
      setTimeout(() => setState('idle'), 1600);
    }
  };

  const display =
    state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : label;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-parchment-light text-navy px-3 py-1.5 text-caption uppercase tracking-widest hover:border-[color:var(--accent-500)] transition-colors duration-std focus:outline-none focus:shadow-focus"
    >
      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <rect x="1.5" y="1.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
      {display}
    </button>
  );
}
