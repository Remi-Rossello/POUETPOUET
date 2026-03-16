import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/app/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const originalFileName = assetInfo.originalFileNames?.[0]?.replace(/\\/g, "/");

          if (originalFileName) {
            if (originalFileName.includes("/node_modules/katex/dist/fonts/")) {
              return "assets/katex-fonts/[name]-[hash][extname]";
            }

            const projectAssetMatch = originalFileName.match(/src\/projects\/([^/]+)\/assets\//);
            if (projectAssetMatch) {
              return `assets/projects/${projectAssetMatch[1]}/[name]-[hash][extname]`;
            }
          }

          return "assets/[name]-[hash][extname]";
        },
        manualChunks: (id) => {
          const normalizedId = id.replace(/\\/g, "/");

          if (normalizedId.includes("/src/tabs/credentials/")) {
            return "tabs/credentials/index";
          }

          if (normalizedId.includes("/src/tabs/projects/")) {
            return "tabs/projects/index";
          }

          if (normalizedId.includes("/src/projects/dino/")) {
            return "projects/dino/index";
          }

          if (normalizedId.includes("/src/projects/digit-recognizer/")) {
            return "projects/digit-recognizer/index";
          }

          if (normalizedId.includes("/src/projects/lagrangian/")) {
            return "projects/lagrangian/index";
          }

          if (normalizedId.includes("/src/projects/publications/")) {
            return "projects/publications/index";
          }

          return undefined;
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    pool: "threads",
  },
});