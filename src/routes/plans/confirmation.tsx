import { createFileRoute } from "@tanstack/react-router";
import { LinkButton, SuccessState } from "@/components/kit";
import { planById } from "@/lib/mock-data";

type Search = { plan?: string };

export const Route = createFileRoute("/plans/confirmation")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    plan: typeof search.plan === "string" ? search.plan : "Growth",
  }),
  head: () => ({ meta: [{ title: "Welcome — Wellness & Healing SF" }] }),
  component: PlanConfirmationScreen,
});

function PlanConfirmationScreen() {
  const { plan: planId } = Route.useSearch();
  const plan = planById(planId ?? "") ?? { name: "your plan" };

  return (
    <div className="min-h-dvh bg-background px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]">
      <SuccessState
        heading={`Welcome to ${plan.name}`}
        subtext="Your plan is active. Book a session whenever the time feels right — included 1:1 sessions are covered."
      >
        <LinkButton to="/book" full>
          Book Your First Session
        </LinkButton>
        <LinkButton to="/home" variant="ghost" full className="mt-2">
          Back to Home
        </LinkButton>
      </SuccessState>
    </div>
  );
}
