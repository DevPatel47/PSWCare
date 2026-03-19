/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saas: {
          primary: "#2563eb",
          secondary: "#f3f4f6",
          accent: "#22c55e",
          danger: "#ef4444",
          text: "#1f2937",
          bg: "#f8fafc",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 6px 20px rgba(15, 23, 42, 0.04)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
