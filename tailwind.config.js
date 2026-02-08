/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Waypoint Custom Palette
        oceanic: {
          50: '#E6F0F2',
          100: '#CCE1E5',
          200: '#99C3CB',
          300: '#66A5B1',
          400: '#338797',
          500: '#0B3F47', // Primary
          600: '#09353D',
          700: '#072B33',
          800: '#052129',
          900: '#03171F',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Secondary
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        nectarine: {
          50: '#FFF3F0',
          100: '#FFE7E1',
          200: '#FFCFC3',
          300: '#FFB7A5',
          400: '#FF9F87',
          500: '#FF8D7B', // Accent
          600: '#CC7162',
          700: '#99554A',
          800: '#663831',
          900: '#331C19',
        },
        herb: {
          50: '#F0F5F1',
          100: '#E1EBE3',
          200: '#C3D7C7',
          300: '#A5C3AB',
          400: '#87AF8F',
          500: '#7FA584', // Success
          600: '#66846A',
          700: '#4C634F',
          800: '#334235',
          900: '#19211A',
        },
        marigold: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDC17F',
          400: '#FCAB54',
          500: '#FFB876', // Warning
          600: '#CC935E',
          700: '#996E47',
          800: '#66492F',
          900: '#332418',
        },
        wheat: {
          50: '#FFFEF3',
          100: '#FFFDF0',
          200: '#FFFBDD',
          300: '#FFF9CA',
          400: '#FFF7B7',
          500: '#FFF5A4',
          600: '#CCC483',
          700: '#999362',
          800: '#666241',
          900: '#333121',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
