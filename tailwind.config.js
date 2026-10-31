/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: "#0B0E14",
          surface: "#141A23",
          border: "#232D3F",
          neonGreen: "#00FF88",
          neonPink: "#FF007F",
          neonCyan: "#00E5FF",
          neonYellow: "#FFE600",
          neonRed: "#FF3366",
          darkCard: "#18202C",
        }
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', 'monospace'],
        cyber: ['"Orbitron"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slight': 'bounce 1.5s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 255, 136, 0.4)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 255, 136, 0.8), 0 0 50px rgba(0, 229, 255, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
