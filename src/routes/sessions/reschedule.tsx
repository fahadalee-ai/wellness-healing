import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DatePicker, TimeSlotPicker } from "@/components/booking";
import { Button, FadeIn, Header, Screen } from "@/components/kit";
import { formatDate, formatTime } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

type Search = { id?: string };

export const Route = createFileRoute("/sessions/reschedule")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({ meta: [{ title: "Reschedule — Wellness & Healing SF" }] }),
  component: RescheduleScreen,
});

function RescheduleScreen() {
  const { id } = Route.useSearch();
  const { sessions, draft, setDraft, rescheduleSession } = useApp();
  const navigate = useNavigate();
  const session = sessions.find((s) => s.id === id);

  useEffect(() => {
    if (id) setDraft({ rescheduleId: id, date: undefined, time: undefined });
  }, [id, setDraft]);

  if (!session) {
    return (
      <Screen className="pt-0">
        <Header title="Reschedule Your Session" fallbackTo="/sessions" />
        <p className="text-sm text-muted-foreground">We couldn’t find that session.</p>
      </Screen>
    );
  }

  return (
    <Screen className="pt-0">
      <Header title="Reschedule Your Session" fallbackTo="/sessions" />
      <FadeIn>
        <div className="mb-5 border border-border bg-card px-4 py-3 text-sm">
          <p className="text-muted-foreground line-through">
            {formatDate(session.date)} at {formatTime(session.time)}
          </p>
          <p className="mt-1 text-foreground">Choose a new time that feels right.</p>
        </div>
        <DatePicker value={draft.date} onChange={(date) => setDraft({ date, time: undefined })} />
        {draft.date && (
          <div className="mt-8">
            <TimeSlotPicker
              date={draft.date}
              value={draft.time}
              durationMin={session.durationMin}
              onChange={(time) => setDraft({ time })}
            />
          </div>
        )}
        <Button
          className="mt-8"
          full
          disabled={!draft.date || !draft.time}
          onClick={() => {
            if (!draft.date || !draft.time) return;
            rescheduleSession(session.id, draft.date, draft.time);
            navigate({ to: "/sessions" });
          }}
        >
          Confirm New Time
        </Button>
      </FadeIn>
    </Screen>
  );
}
