import type { Config } from 'tailwindcss';
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // Shared chrome lives outside this app — keep its classes from being purged.
    '../packages/ui-chrome/src/**/*.{astro,ts,tsx}',
    '../packages/ui-funnel/src/**/*.{astro,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: 'var(--bg-1)',
        'parchment-alt': 'var(--bg-2)',
        ink: 'var(--fg-1)',
        ink2: 'var(--fg-2)',
        ink3: 'var(--fg-3)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'accent-deep': 'var(--accent-deep)',
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
    },
  },
} satisfies Config;
