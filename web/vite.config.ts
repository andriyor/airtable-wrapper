// import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    react(),
    // preact(), doesn't work with radix-ui combobox
    tailwindcss(),
    visualizer({
      template: "treemap",
    }),
  ],
  resolve: {
    alias: {
      // react: "preact/compat",
      // "react-dom": "preact/compat",
      // shadcn
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
