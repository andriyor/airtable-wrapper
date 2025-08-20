import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    input: "http://localhost:8000/openapi.json",
    output: {
      mode: "types-only",
      target: "src/petstore.ts",
      schemas: "src/model",
      mock: true,
    },
  },
});
