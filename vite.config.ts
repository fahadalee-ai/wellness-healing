import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: true,
  vite: {
    base: "/",
    server: {
      allowedHosts: [
        "demo.sourapps.com",
        "localhost",
        "127.0.0.1",
        ".vercel.app",
      ],
    },
    preview: {
      allowedHosts: [
        "demo.sourapps.com",
        "localhost",
        "127.0.0.1",
        ".vercel.app",
      ],
    },
  },
});
