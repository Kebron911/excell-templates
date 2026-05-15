import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    '../packages/ui-chrome/src/**/*.{astro,ts,tsx}',
    '../packages/ui-funnel/src/**/*.{astro,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: 'var(--brand-navy)',
          tint: 'var(--brand-navy-tint)',
          shade: 'var(--brand-navy-shade)',
        },
        parchment: {
          DEFAULT: 'var(--brand-parchment)',
          alt: 'var(--brand-parchment-alt)',
          deep: 'var(--brand-parchment-deep)',
          light: 'var(--bg-3)',
        },
        gold: {
          DEFAULT: 'var(--brand-gold)',
          soft: 'var(--brand-gold-soft)',
          deep: 'var(--brand-gold-deep)',
        },
        clay: {
          DEFAULT: 'var(--brand-clay)',
          soft: 'var(--brand-clay-soft)',
        },
        accent: {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          500: 'var(--accent-500)',
          700: 'var(--accent-700)',
          900: 'var(--accent-900)',
          DEFAULT: 'var(--accent-500)',
        },
        graphite: 'var(--brand-graphite)',
        ink: {
          1: 'var(--fg-1)',
          2: 'var(--fg-2)',
          3: 'var(--fg-3)',
        },
        rule: {
          DEFAULT: 'var(--rule)',
          strong: 'var(--rule-strong)',
        },
        success: 'var(--semantic-success)',
        error: 'var(--semantic-error)',
        warn: 'var(--semantic-warn)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Cormorant', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'ui-monospace', 'monospace'],
        wordmark: ['Inter Tight', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        hero: ['72px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '500' }],
        h1: ['48px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '500' }],
        h2: ['36px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '500' }],
        h3: ['26px', { lineHeight: '1.2', letterSpacing: '-0.005em', fontWeight: '500' }],
        lead: ['18px', { lineHeight: '1.55', fontWeight: '400' }],
        body: ['16px', { lineHeight: '1.55', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4' }],
        ui: ['14px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        label: ['11px', { lineHeight: '1.3', letterSpacing: '0.2em', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
