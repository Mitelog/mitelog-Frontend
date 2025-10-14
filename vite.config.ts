import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://52.78.21.91:8080", // 👉 백엔드 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
