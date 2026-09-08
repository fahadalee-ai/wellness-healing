import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, CalendarPlus, CreditCard, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button, Card, LinkButton, Screen, SectionTitle, Stars } from "@/components/kit";
import { Logo } from "@/components/Logo";
import { PHOTOS } from "@/lib/images";
import {
  canJoinZoom,
  firstName,
  formatDate,
  formatTime,
  greeting,
  initials,
  PILLARS,
  SERVICES,
  TESTIMONIALS,
} from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — Wellness & Healing SF" }] }),
  component: HomeScreen,
});

const QUICK = [
  { to: "/book", label: "Book Session", icon: CalendarPlus },
  { to: "/subscription", label: "My Subscription", icon: CreditCard },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/resources", label: "Resources", icon: BookOpen },
] as const;

function HomeScreen() {
  const { user, sessions, notifications } = useApp();
  const navigate = useNavigate();
  const name = firstName(user?.fullName ?? "there");
  const upcoming = sessions.find((s) => s.status === "upcoming");
  const unread = notifications.some((n) => !n.read);
  const [quote, setQuote] = useState(0);

  return (
    <Screen tabPad className="pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <Logo className="h-12 w-12" />
        <div className="flex items-center gap-2">
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative flex h-12 w-12 items-center justify-center border border-border"
          >
            <Bell size={18} strokeWidth={1.6} />
            {unread && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 bg-primary" />}
          </Link>
          <Link
            to="/profile"
            aria-label="Profile"
            className="flex h-12 w-12 items-center justify-center overflow-hidden border border-border bg-card text-[11px] tracking-wide"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              initials(user?.fullName ?? "WH")
            )}
          </Link>
        </div>
      </div>

      <p className="mt-6 font-display text-[1.85rem] text-foreground">
        {greeting()}, {name}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">Here’s your space to grow</p>

      <div className="relative mt-6 overflow-hidden rounded-[4px]">
        <img src={PHOTOS.heroInterior} alt="Woman seated on a sunroom window ledge" className="h-52 w-full object-cover" />
        <div className="absolute inset-0 bg-[#2D2B29]/55" />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h2 className="font-display text-xl leading-snug text-cream">
            A Path Toward Healing, Clarity & Transformation
          </h2>
          <Button className="mt-4 w-auto self-start px-6" onClick={() => navigate({ to: "/book" })}>
            Book a Session
          </Button>
        </div>
      </div>

      {upcoming && (
        <Card className="mt-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Upcoming session</p>
          <p className="mt-2 font-display text-xl">{upcoming.focus ?? "Wellness Session"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            with {upcoming.coachName} · {formatDate(upcoming.date)} at {formatTime(upcoming.time)}
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={canJoinZoom(upcoming.date, upcoming.time, upcoming.durationMin) ? upcoming.zoomUrl : undefined}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-12 flex-1 items-center justify-center text-[12px] uppercase tracking-[0.16em] ${
                canJoinZoom(upcoming.date, upcoming.time, upcoming.durationMin)
                  ? "bg-primary text-primary-foreground"
                  : "pointer-events-none bg-muted text-muted-foreground"
              }`}
            >
              Join Zoom
            </a>
            <Link
              to="/sessions/reschedule"
              search={{ id: upcoming.id }}
              className="inline-flex min-h-12 items-center px-3 text-[12px] uppercase tracking-[0.14em] text-primary"
            >
              Reschedule
            </Link>
          </div>
        </Card>
      )}

      <div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar">
        {QUICK.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex min-w-[6.4rem] flex-col items-center gap-2 border border-border bg-card px-3 py-4 text-center"
          >
            <item.icon size={18} className="text-primary" strokeWidth={1.6} />
            <span className="text-[11px] leading-tight text-cream">{item.label}</span>
          </Link>
        ))}
      </div>

      <SectionTitle>Choose the Support That Fits You</SectionTitle>
      <div className="space-y-2">
        {SERVICES.map((service) => (
          <Card
            key={service.id}
            onClick={() => {
              navigate({ to: "/book" });
            }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{service.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{service.blurb}</p>
            </div>
            <span className="ml-3 text-[11px] uppercase tracking-[0.14em] text-primary">Book Now</span>
          </Card>
        ))}
      </div>

      <SectionTitle>Coaching for Where Life Meets Change</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {PILLARS.map((p) => (
          <Card key={p.title} className="overflow-hidden p-0">
            <img src={p.image} alt="" className="h-28 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-medium text-foreground">{p.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.blurb}</p>
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle>From those who’ve sat here</SectionTitle>
      <div
        className="overflow-hidden"
        onTouchStart={(e) => {
          const x = e.changedTouches[0].clientX;
          const handler = (ev: TouchEvent) => {
            const dx = ev.changedTouches[0].clientX - x;
            if (dx < -30) setQuote((q) => (q + 1) % TESTIMONIALS.length);
            if (dx > 30) setQuote((q) => (q - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
            document.removeEventListener("touchend", handler);
          };
          document.addEventListener("touchend", handler);
        }}
      >
        <Card>
          <div className="flex items-center gap-3">
            <img src={TESTIMONIALS[quote].photo} alt="" className="h-12 w-12 object-cover" />
            <div>
              <p className="text-sm font-medium">{TESTIMONIALS[quote].name}</p>
              <Stars rating={TESTIMONIALS[quote].rating} />
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream/90">“{TESTIMONIALS[quote].quote}”</p>
        </Card>
        <div className="mt-3 flex justify-center gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setQuote(i)}
              className={`h-1.5 ${i === quote ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>

      <LinkButton to="/book" full className="mt-8">
        Book a Session
      </LinkButton>
    </Screen>
  );
}
