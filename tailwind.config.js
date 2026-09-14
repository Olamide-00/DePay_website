/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0C1A10',
          900: '#122417',
          800: '#17331F',
          700: '#1C3F27',
          600: '#255232',
        },
        leaf: {
          600: '#237A46',
          500: '#2F9E5B',
          400: '#3DB56C',
          300: '#6BCB8E',
          100: '#DCF2E4',
        },
        cream: {
          50: '#FBF9F4',
          100: '#F5F1E7',
        },
        ink: {
          900: '#12140F',
          700: '#3A3E33',
          500: '#6B6F62',
        },
        amber: {
          500: '#E8A33D',
          400: '#F0B65D',
        },
        line: '#E4E0D2',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,20,15,0.04), 0 12px 32px -12px rgba(18,20,15,0.18)',
        pop: '0 20px 60px -20px rgba(18,52,26,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
