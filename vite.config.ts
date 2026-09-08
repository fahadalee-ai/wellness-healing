import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Connect, ViteDevServer } from "vite";

/** Public URL path (trailing slash). Must match Nginx `location` and `PREVIEW_URL` in preview.html. */
const PRODUCTION_BASE = "/wellness-healing/";

function servePreviewHtml() {
  const send = (res: Connect.ServerResponse) => {
    const html = readFileSync(resolve(process.cwd(), "preview.html"), "utf8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.statusCode = 200;
    res.end(html);
  };

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url?.split("?")[0] ?? "";
    if (
      url === "/preview.html" ||
      url === "/preview" ||
      url === `${PRODUCTION_BASE}preview.html` ||
      url === `${PRODUCTION_BASE}preview`
    ) {
      send(res);
      return;
    }
    next();
  };

  return {
    name: "serve-preview-html",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server: ViteDevServer) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  cloudflare: false,
  vite: {
    // Subpath must match Nginx and preview.html; use this for dev/preview/build so PM2 `vite preview` matches assets.
    base: PRODUCTION_BASE,
    plugins: [servePreviewHtml()],
    // Allow the domain to access the preview server (if needed for SSR testing)
    server: {
        allowedHosts: [
            "demo.sourapps.com",
            "localhost",
            "127.0.0.1",
        ],
    },
    preview: {
        allowedHosts: [
            "demo.sourapps.com",
            "localhost",
            "127.0.0.1",
        ],
    },
  },
});