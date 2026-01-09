/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F9FAFB",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        primary: "#6E5AFF",
        primaryHover: "#967EFF",
        neon: "#00FFF7",
        muted: "#6B7280",
      }
    },
  },
  plugins: [],
}

