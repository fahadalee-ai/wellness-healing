import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Screen } from "@/components/kit";
import { COACH } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — Wellness & Healing SF" }] }),
  component: MessagesScreen,
});

function MessagesScreen() {
  const { messages, subscription } = useApp();
  const last = messages[messages.length - 1];
  const included = !subscription || subscription.planId === "transformation" || subscription.status === "active";

  return (
    <Screen tabPad className="pt-0">
      <Header title="Messages" back={false} />
      {!included ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Messaging is part of the Transformation plan. You’re welcome to upgrade whenever it feels useful.
        </p>
      ) : null}
      <Link to="/messages/chat" className="mt-2 flex items-center gap-3 border border-border bg-card p-4">
        <img src={COACH.photo} alt="" className="h-12 w-12 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">{COACH.name}</p>
          <p className="truncate text-sm text-muted-foreground">{last?.text ?? "Start a conversation"}</p>
        </div>
      </Link>
    </Screen>
  );
}
