/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        trade: '#e8b84b',
        'trade-bg': 'rgba(232,184,75,0.08)',
        en: '#4fc9b0',
        'en-bg': 'rgba(79,201,176,0.08)',
        surface: '#0f1522',
        'surface-hi': '#161e31',
        border: '#1d2540',
        dim: '#8a95b0',
        muted: '#4a5470',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
