import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
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
          50:  'var(--accent-50)',
          100: 'var(--accent-100)',
          500: 'var(--accent-500)',
          700: 'var(--accent-700)',
          900: 'var(--accent-900)',
          DEFAULT: 'var(--accent-500)',
        },
        trust: {
          DEFAULT: 'var(--accent-500)',
          soft:    'var(--accent-100)',
          deep:    'var(--accent-700)',
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
        quote: ['24px', { lineHeight: '1.35', fontWeight: '400' }],
        lead: ['18px', { lineHeight: '1.55', fontWeight: '400' }],
        body: ['16px', { lineHeight: '1.55', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4' }],
        ui: ['14px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        label: ['11px', { lineHeight: '1.3', letterSpacing: '0.2em', fontWeight: '500' }],
        sku: ['11px', { lineHeight: '1.3', letterSpacing: '0.22em' }],
      },
      spacing: {
        1: 'var(--sp-1)',
        2: 'var(--sp-2)',
        3: 'var(--sp-3)',
        4: 'var(--sp-4)',
        5: 'var(--sp-5)',
        6: 'var(--sp-6)',
        7: 'var(--sp-7)',
        8: 'var(--sp-8)',
        9: 'var(--sp-9)',
        10: 'var(--sp-10)',
      },
      borderRadius: {
        none: 'var(--r-0)',
        xs: 'var(--r-1)',
        sm: 'var(--r-2)',
        md: 'var(--r-3)',
        lg: 'var(--r-4)',
        pill: 'var(--r-pill)',
      },
      boxShadow: {
        card: 'var(--sh-card)',
        lifted: 'var(--sh-lifted)',
        focus: 'var(--sh-focus-ring)',
        'accent-glow': 'var(--sh-accent-glow)',
      },
      transitionTimingFunction: {
        std: 'cubic-bezier(0.2, 0.6, 0.2, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        std: '200ms',
        slow: '360ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
