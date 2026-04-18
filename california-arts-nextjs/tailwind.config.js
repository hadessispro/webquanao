/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-accent': 'rgb(160, 164, 164)',
        'primary-text': 'rgb(19, 24, 24)',
        'primary-background': 'rgb(255, 255, 255)',
        'secondary-accent': 'rgb(160, 164, 164)',
        'secondary-text': 'rgb(251, 251, 246)',
        'secondary-background': 'rgb(19, 24, 24)',
        'tertiary-background': 'rgb(251, 251, 246)',
        'header-background': 'var(--color-primary-background)',
        'header-text': 'var(--color-primary-text)',
        'header-accent': 'var(--color-primary-accent)',
        'grid-color': 'rgb(19, 24, 24)',
        'grid': 'rgb(19, 24, 24)',
      },
      fontFamily: {
        heading: ["nimbus-sans", "Helvetica", "Arial", "sans-serif"],
        body: ["nimbus-sans", "Kreon", "serif"],
      },
      borderWidth: {
        'grid': '1px',
      },
      spacing: {
        'theme': '2rem',
        'theme-half': '1rem',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
