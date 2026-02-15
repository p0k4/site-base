import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const rootDir = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app-config": path.resolve(rootDir, "config/app.config.ts")
    }
  },
  server: {
    host: true,
    port: 5174,
    fs: {
      allow: [rootDir]
    }
  }
});
