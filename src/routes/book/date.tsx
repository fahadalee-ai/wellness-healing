import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DatePicker } from "@/components/booking";
import { Button, FadeIn, Header, SaveLater, Screen } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/book/date")({
  head: () => ({ meta: [{ title: "Pick a Date — Wellness & Healing SF" }] }),
  component: DateScreen,
});

function DateScreen() {
  const { draft, setDraft, pushToast } = useApp();
  const navigate = useNavigate();

  return (
    <Screen className="pt-0">
      <Header title="Pick a Date" fallbackTo="/book" />
      <FadeIn>
        <DatePicker value={draft.date} onChange={(date) => setDraft({ date, time: undefined })} />
        <Button className="mt-8" full disabled={!draft.date} onClick={() => navigate({ to: "/book/time" })}>
          Continue
        </Button>
        <SaveLater
          onSave={() => {
            pushToast("Saved for later");
            navigate({ to: "/home" });
          }}
        />
      </FadeIn>
    </Screen>
  );
}
