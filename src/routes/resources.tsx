import { createFileRoute } from "@tanstack/react-router";
import { Card, Header, Screen } from "@/components/kit";
import { RESOURCES } from "@/lib/mock-data";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Resources — Wellness & Healing SF" }] }),
  component: ResourcesScreen,
});

function ResourcesScreen() {
  return (
    <Screen className="pt-0">
      <Header title="Resources" subtitle="Quiet tools for the days in between" fallbackTo="/home" />
      <div className="space-y-3">
        {RESOURCES.map((item) => (
          <Card key={item.title} className="overflow-hidden p-0">
            <img src={item.image} alt="" className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="font-display text-xl">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
