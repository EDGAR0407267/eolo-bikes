import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        carbon: "#05070A",
        night: "#08131D",
        ink: "#0B1118",
        cream: "#F5F0E6",
        mist: "#C9D0D6",
        metal: "#7B858E",
        wind: "#7FD6FF",
        turquoise: "#00C9B1",
        olive: "#8E9670",
        sand: "#D4B46F"
      },
      boxShadow: {
        glow: "0 0 44px rgba(127, 214, 255, 0.16)",
        lift: "0 24px 70px rgba(0, 0, 0, 0.38)"
      },
      backgroundImage: {
        "hero-field":
          "radial-gradient(circle at 78% 20%, rgba(127,214,255,0.22), transparent 34%), radial-gradient(circle at 18% 12%, rgba(212,180,111,0.16), transparent 30%), linear-gradient(145deg, #05070A 0%, #08131D 48%, #0D171D 100%)",
        "soft-grid":
          "linear-gradient(rgba(245,240,230,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,230,0.045) 1px, transparent 1px)"
      },
      keyframes: {
        "gradient-drift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "line-drift": {
          "0%": { transform: "translateX(-8%)" },
          "100%": { transform: "translateX(8%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.32" },
          "50%": { opacity: "0.58" }
        }
      },
      animation: {
        "gradient-drift": "gradient-drift 18s ease-in-out infinite",
        "line-drift": "line-drift 16s ease-in-out infinite alternate",
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
