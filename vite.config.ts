import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: { host: true, port: 3000 },
  preview: { host: true, port: 3000 },
  plugins: [react(), svgr(), tsconfigPaths()],
  build: {
    target: "esnext",
    sourcemap: false,
  },
});
