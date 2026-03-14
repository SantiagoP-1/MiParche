import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: '#0c0c0f',
        surface: '#13131a',
        surface2: '#1a1a24',
        border: '#2a2a38',
        accent: {
          DEFAULT: '#c9a96e',
          light: '#e8c99a',
          soft: 'rgba(201,169,110,0.12)',
        },
        rose: {
          patch: '#d4788a',
          soft: 'rgba(212,120,138,0.15)',
        },
        green: {
          patch: '#7abf9e',
          soft: 'rgba(122,191,158,0.15)',
        },
        text: {
          DEFAULT: '#e8e4dc',
          muted: '#7a7a8c',
          dim: '#4a4a5c',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease both',
        'fade-in': 'fadeIn 0.3s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
