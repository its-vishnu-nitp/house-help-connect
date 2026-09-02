/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8E4585', // Plum Magenta (Main brand actions, active states)
          dark: '#75346D',    // Darker Plum (Hover states)
          light: '#F7E8E8',   // Light Rose Tint (Icon backgrounds, badges)
          accent: '#996666',  // Warm Muted Mauve (Secondary accents)
        },
        surface: {
          DEFAULT: '#F8F3F3', // Soft Rose-Canvas (Visible contrast with white cards)
          card: '#FFFFFF',    // Crisp White Cards
          border: '#EADBD8',  // Soft divider border derived from #DCA1A1
        },
        ink: {
          main: '#4A4A4A',    // Charcoal (Headings & body text)
          muted: '#996666',   // Mauve Gray (Subtitles & secondary text)
        },
        status: {
          success: '#10B981', 
          warning: '#F59E0B', 
          error: '#EF4444',   
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'], 
      },
      boxShadow: {
        'modern': '0 4px 20px -2px rgba(74, 74, 74, 0.08)', 
      }
    },
  },
  plugins: [],
}