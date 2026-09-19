/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nata-sans-eb': ['NataSans-ExtraBold'],
        'nata-sans-bd': ['NataSans-Bold'],
        'nata-sans-md': ['NataSans-Medium'],
        'nata-sans-rg': ['NataSans-Regular'],
      },
    },
  },
  plugins: [],
};
