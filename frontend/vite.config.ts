import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          maplibre: ["maplibre-gl"],
          deckgl: [
            "@deck.gl/core",
            "@deck.gl/react",
            "@deck.gl/layers",
            "@deck.gl/extensions",
            "@deck.gl/mesh-layers",
          ],
        },
      },
    },
  },
});
