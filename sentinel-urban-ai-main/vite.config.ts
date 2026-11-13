import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { host: true, port: 8080 },
  plugins: [tanstackRouter(), tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "node:async_hooks": path.resolve(__dirname, "src/polyfills/async_hooks.ts"),
    },
  },
  ssr: {
    external: ["node:async_hooks"],
    noExternal: ["@tanstack/start-storage-context"],
  },
});
