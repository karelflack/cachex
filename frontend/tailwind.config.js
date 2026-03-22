export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0D1117',
        surface: '#161B22',
        elevated: '#1E242C',
        stroke: '#30363D',
        teal: {
          DEFAULT: '#00C9A7',
          dark: '#00A88A',
          subtle: 'rgba(0, 201, 167, 0.1)',
        },
        danger: {
          DEFAULT: '#F85149',
          subtle: 'rgba(248, 81, 73, 0.1)',
        },
        ink: {
          DEFAULT: '#F0F6FC',
          muted: '#8B949E',
          faint: '#484F58',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
