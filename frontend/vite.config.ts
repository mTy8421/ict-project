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
    allowedHosts: ["b5b0699582c0.ngrok-free.app"],
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
