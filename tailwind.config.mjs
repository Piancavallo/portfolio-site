/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      // Your custom tokens go here
      fontFamily: {
        // e.g. sans: ['YourFont', 'sans-serif'],
      },
      colors: {
        // e.g. accent: '#your-color',
      },
    },
  },
  plugins: [],
};
