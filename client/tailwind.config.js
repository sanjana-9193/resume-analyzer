/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f0ff",
          100: "#e4e3ff",
          200: "#cbc9ff",
          300: "#a5a1ff",
          400: "#7b74ff",
          500: "#6366f1",
          600: "#5548e8",
          700: "#4638cc",
          800: "#3a2fa6",
          900: "#332c84",
        },
        accent: {
          500: "#ec4899",
          600: "#db2777",
        },
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.04)",
        softLg: "0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -4px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
