/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          canvas: 'var(--color-bg)',
          surface: 'var(--color-surface-1)',
          raised: 'var(--color-surface-2)',
          hover: 'var(--color-surface-3)',
        },
        canvas: 'var(--color-bg)',
        surface: 'var(--color-surface-1)',
        raised: 'var(--color-surface-2)',
        hover: 'var(--color-surface-3)',
        border: {
          default: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        content: {
          primary: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          soft: 'var(--color-accent-soft)',
          border: 'var(--color-accent-border)',
          focus: 'var(--color-focus)',
        },
        status: {
          neutral: 'var(--color-status-neutral)',
          blue: 'var(--color-status-blue)',
          muted: 'var(--color-status-muted)',
          dark: 'var(--color-status-dark)',
          complete: 'var(--color-status-complete)',
        },
      },
      borderColor: {
        default: 'var(--color-border)',
        strong: 'var(--color-border-strong)',
        DEFAULT: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        focus: 'var(--shadow-focus)',
      },
      animation: {
        'rise-in': 'riseIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 420ms ease-out forwards',
        'pulse-status': 'pulseStatus 2.5s ease-in-out infinite',
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseStatus: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}