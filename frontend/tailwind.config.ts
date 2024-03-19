import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        "3xl": "1920px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        bitmap: ["var(--font-fixedsys)"],
        led: ["var(--font-led)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "retro-cyan": "#008080",
        "retro-red": "#CD0604",
        "retro-yellow": "#F5F500",
        "retro-blue": "#1F3CAE",
        "retro-gray": "#C3C7CB",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "alert-screen-overlay": {
          "0%": { backgroundColor: "#008080" }, // "retro-cyan"
          "25%": { backgroundColor: "#CD0604" }, // "retro-red"
          "50%": { backgroundColor: "#F5F500" }, // "retro-yellow"
          "75%": { backgroundColor: "#1F3CAE" }, // "retro-blue"
          "100%": { backgroundColor: "#C3C7CB" }, // "retro-gray"
        },
        "led-text-glow-red": {
          "0%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #aa0000, 0 0 40px #aa0000, 0 0 50px #aa0000, 0 0 60px #aa0000, 0 0 70px #aa0000",
          },
          "50%": {
            textShadow:
              "0 0 20px #444, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #ff0000, 0 0 60px #ff0000, 0 0 70px #ff0000, 0 0 80px #ff0000",
          },
          "100%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #aa0000, 0 0 40px #aa0000, 0 0 50px #aa0000, 0 0 60px #aa0000, 0 0 70px #aa0000",
          },
        },
        "led-text-glow-blue": {
          "0%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #0000aa, 0 0 40px #0000aa, 0 0 50px #0000aa, 0 0 60px #0000aa, 0 0 70px #0000aa",
          },
          "50%": {
            textShadow:
              "0 0 20px #444, 0 0 30px #0000ff, 0 0 40px #0000ff, 0 0 50px #0000ff, 0 0 60px #0000ff, 0 0 70px #0000ff, 0 0 80px #0000ff",
          },
          "100%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #0000aa, 0 0 40px #0000aa, 0 0 50px #0000aa, 0 0 60px #0000aa, 0 0 70px #0000aa",
          },
        },
        "led-text-glow-cyan": {
          "0%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #4d59b2, 0 0 40px #4d59b2, 0 0 50px #4d59b2, 0 0 60px #4d59b2, 0 0 70px #4d59b2",
          },
          "50%": {
            textShadow:
              "0 0 20px #444, 0 0 30px #7db2c9, 0 0 40px #7db2c9, 0 0 50px #7db2c9, 0 0 60px #7db2c9, 0 0 70px #7db2c9, 0 0 80px #7db2c9",
          },
          "100%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #4d59b2, 0 0 40px #4d59b2, 0 0 50px #4d59b2, 0 0 60px #4d59b2, 0 0 70px #4d59b2",
          },
        },
        "led-text-glow-white": {
          "0%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #666, 0 0 40px #666, 0 0 50px #666, 0 0 60px #666, 0 0 70px #666",
          },
          "50%": {
            textShadow:
              "0 0 20px #444, 0 0 30px #999, 0 0 40px #999, 0 0 50px #999, 0 0 60px #999, 0 0 70px #999, 0 0 80px #999",
          },
          "100%": {
            textShadow:
              "0 0 10px #444, 0 0 20px #444, 0 0 30px #666, 0 0 40px #666, 0 0 50px #666, 0 0 60px #666, 0 0 70px #666",
          },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "alert-screen-overlay": "alert-screen-overlay 5s linear infinite",
        "led-text-glow-red": "led-text-glow-red 2s linear infinite",
        "led-text-glow-blue": "led-text-glow-blue 2s linear infinite",
        "led-text-glow-cyan": "led-text-glow-cyan 2s linear infinite",
        "led-text-glow-white": "led-text-glow-white 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
} satisfies Config;

export default config;
