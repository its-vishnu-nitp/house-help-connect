/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand scale — deep teal/emerald (trust, reliability)
        primary: {
          50: '#EFFDF9',
          100: '#C9FFF2',
          200: '#93FCE4',
          300: '#57F0D3',
          400: '#22DAB9',
          500: '#05BE9E',
          600: '#029A82', // main brand / buttons
          700: '#037B69', // hover states
          800: '#066255',
          900: '#075146',
          950: '#022C27',
        },
        // Accent scale — warm amber (CTAs, highlights, ratings)
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // main accent
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Legacy aliases — existing components use these token names;
        // they now resolve to the new palette so the whole app re-skins consistently.
        brand: {
          DEFAULT: '#029A82', // = primary-600
          dark: '#037B69',    // = primary-700
          light: '#C9FFF2',   // = primary-100 (icon backgrounds, badges)
          accent: '#F59E0B',  // = accent-500
        },
        surface: {
          DEFAULT: '#FAFAF9', // warm stone-50 canvas
          card: '#FFFFFF',
          border: '#E7E5E4',  // stone-200 dividers
        },
        ink: {
          main: '#1E293B',    // slate-800 headings & body
          muted: '#64748B',   // slate-500 secondary text
        },
        status: {
          success: '#059669',
          warning: '#F59E0B',
          error: '#E11D48',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        modern: '0 4px 24px -4px rgba(30, 41, 59, 0.08)',
        soft: '0 2px 12px -2px rgba(30, 41, 59, 0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Gentle bobbing for hero floating cards
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        // Infinite horizontal scroll for the services marquee
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Slow pan for animated gradient text / hero glow
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Soft pulsing glow behind the hero
        'glow-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        // Modal entrance
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease both',
        'slide-down': 'slide-down 0.3s ease both',
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'marquee': 'marquee 32s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'glow-pulse': 'glow-pulse 7s ease-in-out infinite',
        'pop-in': 'pop-in 0.25s ease both',
      },
    },
  },
  plugins: [],
}
