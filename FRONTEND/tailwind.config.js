/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The core brand colors (Buttons, Active States, Links)
        brand: {
          DEFAULT: '#0066FF', // Vibrant, modern tech blue
          light: '#E5F0FF',   // Soft blue for tab backgrounds & highlights
          dark: '#004CDE',    // Deep blue for button hover states
        },
        // Background and layout colors
        surface: {
          DEFAULT: '#F8FAFC', // Slate 50 (Very light gray/blue for the whole app background)
          card: '#FFFFFF',    // Pure white for dashboard cards
          border: '#E2E8F0',  // Slate 200 (Soft, elegant borders)
        },
        // Typography colors
        ink: {
          main: '#0F172A',    // Slate 900 (High-contrast for headings)
          muted: '#64748B',   // Slate 500 (Softer gray for secondary text/icons)
        },
        // Status colors
        status: {
          success: '#10B981', // Emerald 500 (For 'Active', 'Verified', 'Paid')
          warning: '#F59E0B', // Amber 500 (For 'Pending', 'Action Required')
          error: '#EF4444',   // Red 500 (For 'Cancelled', 'Errors')
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'], 
      },
      boxShadow: {
        // A modern, soft shadow that looks much more expensive than default shadows
        'modern': '0 4px 20px -2px rgba(15, 23, 42, 0.05)', 
      }
    },
  },
  plugins: [],
}