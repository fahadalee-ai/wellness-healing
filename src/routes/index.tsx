import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo, Wordmark } from "@/components/Logo";
import { PHOTOS } from "@/lib/images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Wellness & Healing SF" }],
  }),
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    navigate({ to: "/onboarding" });
  }, [ready, navigate]);

  function advance() {
    setReady(true);
  }

  return (
    <button
      type="button"
      onClick={advance}
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-6"
    >
      <img
        src={PHOTOS.splash}
        alt="Sunroom window with plants and warm daylight"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#2D2B29]/72" />
      <div className="relative z-10 animate-splash flex flex-col items-center">
        <Logo className="h-44 w-44" />
        <Wordmark className="mt-3" />
      </div>
    </button>
  );
}
