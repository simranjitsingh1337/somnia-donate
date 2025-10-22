/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon-inspired palette
        background: '#0A0A0A', // Deep dark background
        surface: '#1C1C1C',    // Slightly lighter dark for cards/elements
        primary: '#A78BFA',    // Vibrant purple (Purple-400)
        secondary: '#67E8F9',  // Bright cyan (Cyan-400)
        accent: '#F472B6',     // Intense pink (Pink-400)
        text: '#E0E0E0',       // Light gray for main text
        textSecondary: '#888888', // Darker gray for secondary text
        border: '#333333',     // Dark border
        success: '#10b981',    // Green for success
        warning: '#f59e0b',    // Orange for warning
        error: '#ef4444',      // Red for error

        // Specific neon glow colors (can be same as primary/secondary/accent)
        'glow-primary': '#A78BFA',
        'glow-secondary': '#67E8F9',
        'glow-accent': '#F472B6',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-background': 'linear-gradient(to bottom right, #0A0A0A, #1C1C1C)', // Dark, subtle gradient
        'gradient-hero-neon': 'linear-gradient(to bottom right, #A78BFA, #67E8F9)', // Primary to Secondary neon gradient
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 15px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.5)',
        'neon-glow-sm': '0 0 5px var(--tw-shadow-color)',
        'neon-glow': '0 0 10px var(--tw-shadow-color), 0 0 20px var(--tw-shadow-color)',
        'neon-glow-lg': '0 0 15px var(--tw-shadow-color), 0 0 30px var(--tw-shadow-color), 0 0 45px var(--tw-shadow-color)',
      },
      textShadow: {
        'neon-sm': '0 0 3px var(--tw-shadow-color)',
        'neon': '0 0 5px var(--tw-shadow-color), 0 0 10px var(--tw-shadow-color)',
        'neon-lg': '0 0 8px var(--tw-shadow-color), 0 0 15px var(--tw-shadow-color), 0 0 25px var(--tw-shadow-color)',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '0' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'neon-pulse': {
          '0%, 100%': { opacity: '1', textShadow: '0 0 5px var(--tw-shadow-color), 0 0 10px var(--tw-shadow-color)' },
          '50%': { opacity: '0.8', textShadow: '0 0 2px var(--tw-shadow-color), 0 0 7px var(--tw-shadow-color)' },
        },
        'border-pulse': {
          '0%, 100%': { boxShadow: '0 0 0px var(--tw-shadow-color), 0 0 0px var(--tw-shadow-color)' },
          '50%': { boxShadow: '0 0 5px var(--tw-shadow-color), 0 0 10px var(--tw-shadow-color)' },
        },
      },
      animation: {
        confetti: 'confetti 5s ease-out forwards',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        slideInLeft: 'slideInLeft 0.5s ease-out forwards',
        slideInRight: 'slideInRight 0.5s ease-out forwards',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'border-pulse': 'border-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.text-neon-glow': {
          textShadow: theme('textShadow.neon'),
          color: theme('colors.text'), // Base text color for glow
          '--tw-shadow-color': theme('colors.primary'), // Default glow color
        },
        '.neon-card-glow': {
          boxShadow: theme('boxShadow.neon-glow'),
          '--tw-shadow-color': theme('colors.primary'), // Default glow color
        },
        '.text-gradient-primary-to-secondary': {
          backgroundImage: `linear-gradient(to right, ${theme('colors.primary')}, ${theme('colors.secondary')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'color': 'transparent',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}
