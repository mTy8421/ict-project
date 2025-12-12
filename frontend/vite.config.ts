import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: true,
    port: 5173,
    allowedHosts: ["reprints-water-resort-attacks.trycloudflare.com"],
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
