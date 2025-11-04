import { pluginPreact } from "@rsbuild/plugin-preact";

export default {
  server: {
    port: 5173,
  },
  plugins: [pluginPreact()],
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
};
