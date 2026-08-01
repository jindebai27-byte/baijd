import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { host: "127.0.0.1" },
  build: {
    // Sites exposes static files from dist/client through the ASSETS binding.
    // Keeping Vite's files at dist/ makes the deployed worker healthy but leaves
    // ASSETS empty, so every browser receives a 404 for the home page.
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
