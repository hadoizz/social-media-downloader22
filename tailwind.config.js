/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1c92d2',
        'custom-green': '#f2ffdf',
      },
    },
  },
  plugins: [],
}
