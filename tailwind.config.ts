import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ─── Brand colours ─── */
      colors: {
        'navy-900': '#0B2046',
        'navy-950': '#071631',
        'navy-700': '#13306A',
        'navy-50': '#EEF1F7',
        'royal': '#1E3F8F',
        'brand-red': '#D8121B',
        'red-700': '#B30F16',
        'red-50': '#FCEBEC',
        'blush': '#F3D9DC',
        'ink': '#0F172A',
        'slate': '#5B6478',
        'slate-300': '#A3ACBF',
        'line': '#E3E7EF',
        'line-dark': 'rgba(255,255,255,0.14)',
        'console-bg': '#F7F8FB',
        'surface-page': 'var(--surface-page)',
        'surface-card': 'var(--surface-card)',
        'surface-tint': 'var(--surface-tint)',
        'text-body': 'var(--text-body)',
        'text-heading': 'var(--text-heading)',
        'text-meta': 'var(--text-meta)',
      },

      /* ─── Typography — map next/font CSS vars ─── */
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
      },

      /* ─── Font sizes (design scale) ─── */
      fontSize: {
        'kicker': ['12px', { lineHeight: '16px', letterSpacing: '0.08em' }],
        'meta': ['13px', { lineHeight: '18px' }],
        'label': ['11px', { lineHeight: '16px' }],
        'body': ['17px', { lineHeight: '28px' }],
        'article': ['19px', { lineHeight: '32px' }],
        'h3': ['22px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        'h2': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
        'h1': ['48px', { lineHeight: '56px', letterSpacing: '-0.01em' }],
        'display': ['72px', { lineHeight: '76px', letterSpacing: '-0.02em' }],
      },

      /* ─── Layout ─── */
      maxWidth: {
        container: '1280px',
        article: '680px',
        'article-head': '760px',
        'article-media': '1040px',
      },

      /* ─── Spacing ─── */
      spacing: {
        'section': '96px',
        'section-mobile': '56px',
        'header': '72px',
        'header-compact': '60px',
        'utility': '32px',
      },

      /* ─── Border radius ─── */
      borderRadius: {
        lg: '12px',
        md: '8px',
        full: '999px',
        sm: '4px',
      },

      /* ─── Shadows ─── */
      boxShadow: {
        'hover': 'var(--shadow-hover)',
        'overlay': '0 24px 64px rgba(7,22,49,0.24)',
        'drag': '0 16px 40px rgba(11,32,70,0.18)',
      },

      /* ─── Motion ─── */
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.22,1,0.36,1)',
        exit: 'cubic-bezier(0.4,0,1,1)',
      },
      transitionDuration: {
        micro: '150ms',
        small: '250ms',
        medium: '400ms',
        large: '600ms',
      },

      /* ─── Backgrounds ─── */
      backgroundImage: {
        'dot-grid': 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.2px)',
        'hero-gradient': 'linear-gradient(20deg, rgba(7,22,49,0.92) 0%, rgba(11,32,70,0.55) 45%, rgba(11,32,70,0) 75%)',
      },
      backgroundSize: {
        'dot-grid': '18px 18px',
      },

      /* ─── Keyframe animations ─── */
      keyframes: {
        'tb-fadeup': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'tb-settle': {
          from: { opacity: '0', transform: 'scale(1.04)' },
          to: { opacity: '1', transform: 'none' },
        },
        'tb-pop': {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'tb-shimmer': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fadeup': 'tb-fadeup 500ms cubic-bezier(0.22,1,0.36,1) both',
        'settle': 'tb-settle 700ms cubic-bezier(0.22,1,0.36,1) both',
        'pop': 'tb-pop 400ms cubic-bezier(0.22,1,0.36,1) both',
        'shimmer': 'tb-shimmer 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
