import { defineConfig } from "vitest/config";

// Vitest keeps the setup minimal for TS + Node without extra runner config.
export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false
  }
});
