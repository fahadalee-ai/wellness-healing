import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

function previewHtmlResponse() {
  const paths = [resolve(process.cwd(), "preview.html"), resolve(process.cwd(), "public/preview.html")];
  for (const file of paths) {
    try {
      const html = readFileSync(file, "utf8");
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    } catch {
      /* try next */
    }
  }
  return null;
}

function isPreviewPath(pathname: string) {
  return (
    pathname === "/preview.html" ||
    pathname === "/preview" ||
    pathname.endsWith("/preview.html") ||
    pathname.endsWith("/preview")
  );
}

const previewMiddleware = createMiddleware().server(async ({ next, request }) => {
  const pathname = new URL(request.url).pathname;
  if (isPreviewPath(pathname)) {
    const preview = previewHtmlResponse();
    if (preview) return preview;
  }
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [previewMiddleware, errorMiddleware, csrfMiddleware],
}));
