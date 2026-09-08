import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Home, MessageCircle, PlusSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/book", label: "Book", icon: PlusSquare },
  { to: "/sessions", label: "Sessions", icon: CalendarDays },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = pathname === tab.to;
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-[0.12em]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon size={20} strokeWidth={active ? 1.9 : 1.5} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function shouldShowTabs(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return ["/home", "/book", "/sessions", "/messages", "/profile"].includes(path);
}
