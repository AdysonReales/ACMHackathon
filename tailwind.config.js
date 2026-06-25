/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-hi": "var(--surface-hi)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      boxShadow: {
        custom: "var(--shadow)",
      },
      borderRadius: {
        small: "8px",
        medium: "16px",
        large: "24px",
        xlarge: "32px",
      },
      spacing: {
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "48px",
        xxl: "64px",
        clearance: "80px",
      },
      fontFamily: {
        sans: ["Nunito", "Poppins", "Quicksand", "sans-serif"],
        mono: ["JetBrains Mono", "Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
