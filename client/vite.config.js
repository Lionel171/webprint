import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  define: {
    'process.env': {
      API_URL: 'http://185.148.129.206:5050',
      DEBUG: 'true'
    }
  }
});

