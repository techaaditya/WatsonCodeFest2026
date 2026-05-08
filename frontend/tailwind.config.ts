import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // GenoVault organic palette
        cream: "#FFF8EC", // Clean Lab Base
        beige: "#DCCCAC", // Structural Proteins
        softgreen: "#99AD7A", // Organic Life
        olive: "#546B41", // Core DNA
        slate: "#2D3A23", // Body text (enforced)
      },
      borderRadius: {
        // Encourage organic curvature on surfaces
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
} satisfies Config

