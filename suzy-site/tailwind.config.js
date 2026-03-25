/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'warm-black': '#1C1C1A',
        'neutral-white': '#FAFAF8',
        'lavender': '#C0BEF5',
        'light-lavender': '#EAE8FD',
      },

      // Animation utilities — wire up all new keyframes defined in index.css
      animation: {
        // Page route transition — used on <main> in App.jsx
        'pageFade': 'pageFade 0.25s ease-out both',

        // Entry feed staggered reveal — used in EntriesFeed.jsx
        // animationDelay is applied inline per-item
        'fadeIn': 'fadeIn 0.4s ease-out both',

        // Loading dots — used in LoadingScreen.jsx
        'loadingPulse': 'loadingPulse 1.2s ease-in-out infinite',
      },

      keyframes: {
        pageFade: {
          'from': { opacity: '0', transform: 'translateY(6px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        loadingPulse: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      // Spacing token for consistent section padding
      // Use these instead of bare py-12 everywhere
      spacing: {
        'page-sm': '3rem',    // 48px  — utility pages (contact)
        'page-md': '4rem',    // 64px  — entries feed
        'page-lg': '5rem',    // 80px  — homepage
      },
    },
  },
  plugins: [],
}
