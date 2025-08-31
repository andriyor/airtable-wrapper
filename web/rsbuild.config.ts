import { pluginReact } from "@rsbuild/plugin-react";

export default {
  server: {
    port: 5173,
  },
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
};
