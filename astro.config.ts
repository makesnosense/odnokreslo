import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  site: "https://odnokreslo.ru",
  integrations: [sitemap()],
  vite: {
    plugins: [
      visualizer({
        open: false,
        filename: "dist/stats.html",
      }),
    ],
    server: {
      allowedHosts: ["localhost", ".trycloudflare.com"],
    },
    build: {
      target: "es2022",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
});
