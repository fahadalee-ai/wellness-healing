import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { shouldShowTabs, TabBar } from "@/components/TabBar";
import { useApp } from "@/lib/store";

function isPreviewPath(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === "/preview" || path === "/preview.html" || path.endsWith("/preview.html") || path.endsWith("/preview");
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { toasts, dismissToast } = useApp();
  const tabs = shouldShowTabs(pathname);
  const preview = isPreviewPath(pathname);

  if (preview) {
    return <div className="min-h-dvh w-full bg-[#0b0b0c]">{children}</div>;
  }

  return (
    <div className="mx-auto flex h-dvh max-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-background">
      <main className="relative min-h-0 flex-1 overflow-y-auto no-scrollbar">{children}</main>
      {tabs && <TabBar />}
      <Toaster theme="dark" position="top-center" />
      <div className="pointer-events-none fixed inset-x-0 top-6 z-50 mx-auto flex max-w-[480px] flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => dismissToast(t.id)}
            className="pointer-events-auto w-full border border-border bg-card px-4 py-3 text-left shadow-lg"
          >
            <p className="text-sm text-foreground">{t.title}</p>
            {t.body && <p className="mt-0.5 text-xs text-muted-foreground">{t.body}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
