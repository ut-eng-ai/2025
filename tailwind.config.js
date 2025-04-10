/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Noto Serif JP', 'serif'],
    },
    extend: {
      colors: {
        primary: '#231815',
        neumorphism: {
          light: '#fafafa',
          dark: '#f0f0f0',
          white: '#ffffff',
        },
        text: {
          primary: '#231815',
        },
        border: {
          primary: '#231815',
        },
      },
      boxShadow: {
        'neumorphism': '8px 8px 15px #f0f0f0, -8px -8px 15px #ffffff',
        'neumorphism-inset': 'inset 8px 8px 15px #f0f0f0, inset -8px -8px 15px #ffffff',
      },
    },
  },
  plugins: [],
} 