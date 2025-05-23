import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
<<<<<<< HEAD
        target: "http://localhost:3001",
=======
        target: "http://localhost:3000",
>>>>>>> origin/main
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
<<<<<<< HEAD
    host: true,
    port: 5173,
  },
  css: {
    postcss: "./postcss.config.cjs",
=======
    allowedHosts: [""],
>>>>>>> origin/main
  },
});
