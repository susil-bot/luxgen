/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // GitHub-like theme colors
        github: {
          light: {
            bg: '#ffffff',
            bgSecondary: '#f6f8fa',
            border: '#d0d7de',
            text: '#24292f',
            textSecondary: '#656d76',
            textMuted: '#8c959f',
            accent: '#0969da',
            accentHover: '#1a7f37',
            danger: '#cf222e',
            warning: '#9a6700',
            success: '#1a7f37',
          },
          dark: {
            bg: '#0d1117',
            bgSecondary: '#161b22',
            border: '#30363d',
            text: '#f0f6fc',
            textSecondary: '#8b949e',
            textMuted: '#7d8590',
            accent: '#58a6ff',
            accentHover: '#1f6feb',
            danger: '#f85149',
            warning: '#d29922',
            success: '#238636',
          }
        }
      },
    },
  },
  plugins: [],
} 