import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          // Action & Brand Blues
          blue: "#0066cc",
          "blue-focus": "#0071e3",
          "blue-sky": "#2997ff",
          
          // Inks & Text
          ink: "#1d1d1f",
          "ink-muted": "#7a7a7a",
          "ink-subtle": "#333333",
          "body-muted": "#cccccc",

          // Canvases & Surfaces
          canvas: "#ffffff",
          parchment: "#f5f5f7",
          pearl: "#fafafc",
          "tile-1": "#272729",
          "tile-2": "#2a2a2c",
          "tile-3": "#252527",
          black: "#000000",

          // Borders & Dividers
          hairline: "#e0e0e0",
          "divider-soft": "#f0f0f0",
          border: "rgba(0, 0, 0, 0.08)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          "system-ui",
          "sans-serif",
        ],
        display: [
          '"SF Pro Display"',
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        "apple-body": ["17px", { lineHeight: "1.47", letterSpacing: "-0.374px" }],
        "apple-headline": ["40px", { lineHeight: "1.1", letterSpacing: "-0.28px" }],
        "apple-tagline": ["21px", { lineHeight: "1.19", letterSpacing: "0.231px" }],
        "apple-caption": ["14px", { lineHeight: "1.43", letterSpacing: "-0.224px" }],
      },
      borderRadius: {
        "apple-sm": "8px",
        "apple-md": "11px",
        "apple-lg": "18px",
        "apple-pill": "9999px",
      },
      boxShadow: {
        "apple-product": "0 3px 20px rgba(0, 0, 0, 0.08)",
        "apple-soft": "0 1px 3px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
