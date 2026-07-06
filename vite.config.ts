import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The real source entry is dev-index.html (root index.html is the built
// single-file artifact). Build from the source, then emit it as index.html.
function renameEntryToIndex(): Plugin {
  return {
    name: "rename-entry-to-index",
    closeBundle() {
      const from = path.resolve(__dirname, "dist/dev-index.html");
      const to = path.resolve(__dirname, "dist/index.html");
      if (fs.existsSync(from)) fs.renameSync(from, to);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile(), renameEntryToIndex()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: path.resolve(__dirname, "dev-index.html"),
    },
  },
  server: {
    open: "/dev-index.html",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
