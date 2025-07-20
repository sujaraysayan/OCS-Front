/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ ต้องกำหนดให้ใช้ class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ ให้ Tailwind scan ไฟล์ JSX ด้วย
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}