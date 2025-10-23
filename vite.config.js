import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// MoneyFlow - Vite Configuration
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
