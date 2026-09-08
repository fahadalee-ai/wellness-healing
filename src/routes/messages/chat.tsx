import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { Header, Screen } from "@/components/kit";
import { BUSINESS, COACH } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages/chat")({
  head: () => ({ meta: [{ title: "Jackie — Wellness & Healing SF" }] }),
  component: ChatScreen,
});

function ChatScreen() {
  const { messages, sendMessage } = useApp();
  const [text, setText] = useState("");

  return (
    <Screen padded={false} className="flex flex-col">
      <div className="px-5">
        <Header title={COACH.name} subtitle="Usually replies within a day" fallbackTo="/messages" />
      </div>
      <div className="mx-5 mb-3 border border-border bg-card px-3 py-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        For urgent matters, please contact {BUSINESS.phone} directly — this is not a crisis line
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] px-3 py-2 text-sm leading-relaxed",
                m.from === "me" ? "bg-primary text-primary-foreground" : "bg-card text-foreground",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex items-center gap-2 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMessage(text.trim());
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note…"
          className="min-h-12 flex-1 border border-border bg-card px-3 text-sm outline-none"
        />
        <button
          type="submit"
          aria-label="Send"
          className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground"
        >
          <Send size={16} />
        </button>
      </form>
    </Screen>
  );
}
