import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearStorage, readJson, readStorage, writeJson, writeStorage } from "./storage";
import {
  DEFAULT_PREFS,
  PLANS,
  seedInvoices,
  seedMessages,
  seedNotifications,
  seedPaymentMethods,
  seedSessions,
  seedSubscription,
  seedUsers,
  type AppNotification,
  type BookingDraft,
  type ChatMessage,
  type CoachingSession,
  type IntakeAnswers,
  type Invoice,
  type NotificationPrefs,
  type PaymentMethod,
  type SessionStatus,
  type Subscription,
  type User,
} from "./mock-data";

export type Toast = { id: number; title: string; body?: string };

type Store = {
  hydrated: boolean;
  users: User[];
  user: User | null;
  onboarded: boolean;
  markOnboarded: () => void;
  login: (email: string, password: string) => { ok: true; intakeComplete: boolean };
  register: (input: { fullName: string; email: string; phone: string; password: string }) => { ok: true };
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  completeIntake: (answers: IntakeAnswers) => void;
  sessions: CoachingSession[];
  bookSession: (session: Omit<CoachingSession, "id" | "status" | "zoomUrl">) => CoachingSession;
  rescheduleSession: (id: string, date: string, time: string) => void;
  cancelSession: (id: string) => void;
  addReview: (id: string, rating: number, text?: string) => void;
  draft: BookingDraft;
  setDraft: (patch: Partial<BookingDraft>) => void;
  clearDraft: () => void;
  subscription: Subscription | null;
  startSubscription: (planId: string, cycle: Subscription["cycle"]) => void;
  changePlan: (planId: string) => void;
  pauseSubscription: () => void;
  resumeSubscription: () => void;
  cancelSubscription: () => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  invoices: Invoice[];
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  notifications: AppNotification[];
  markAllRead: () => void;
  markNotificationRead: (id: string) => void;
  togglePref: (key: keyof NotificationPrefs) => void;
  toasts: Toast[];
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

function loadUsers(): User[] {
  return readJson<User[]>("users", seedUsers);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [sessions, setSessions] = useState<CoachingSession[]>(seedSessions);
  const [draft, setDraftState] = useState<BookingDraft>({});
  const [subscription, setSubscription] = useState<Subscription | null>(seedSubscription);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(seedPaymentMethods);
  const [invoices] = useState<Invoice[]>(seedInvoices);
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const loadedUsers = loadUsers();
    setUsers(loadedUsers);
    const sessionId = readStorage("session");
    setUser(loadedUsers.find((u) => u.id === sessionId) ?? null);
    setOnboarded(readStorage("onboarded") === "1");
    setSessions(readJson("sessions", seedSessions));
    setDraftState(readJson("draft", {}));
    setSubscription(readJson("subscription", seedSubscription));
    setPaymentMethods(readJson("paymentMethods", seedPaymentMethods));
    setMessages(readJson("messages", seedMessages));
    setNotifications(readJson("notifications", seedNotifications));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeJson("users", users);
  }, [hydrated, users]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson("sessions", sessions);
  }, [hydrated, sessions]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson("draft", draft);
  }, [hydrated, draft]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson("subscription", subscription);
  }, [hydrated, subscription]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson("paymentMethods", paymentMethods);
  }, [hydrated, paymentMethods]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson("messages", messages);
  }, [hydrated, messages]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson("notifications", notifications);
  }, [hydrated, notifications]);

  const value = useMemo<Store>(() => {
    const persistUser = (next: User | null) => {
      setUser(next);
      if (next) {
        writeStorage("session", next.id);
        setUsers((list) => list.map((u) => (u.id === next.id ? next : u)));
      }
    };

    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, title, body }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    };

    return {
      hydrated,
      users,
      user,
      onboarded,
      markOnboarded: () => {
        setOnboarded(true);
        writeStorage("onboarded", "1");
      },
      login: (email, password) => {
        const found =
          users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ??
          users.find((u) => u.password === password) ??
          users[0];
        persistUser(found);
        writeStorage("onboarded", "1");
        setOnboarded(true);
        return { ok: true, intakeComplete: found.intakeComplete };
      },
      register: (input) => {
        const email = input.email.trim().toLowerCase();
        const existing = users.find((u) => email && u.email.toLowerCase() === email);
        if (existing) {
          persistUser(existing);
          writeStorage("onboarded", "1");
          setOnboarded(true);
          return { ok: true };
        }
        const created: User = {
          id: `u${Date.now()}`,
          fullName: input.fullName.trim() || "Guest",
          email: email || `guest${Date.now()}@wellnesshealingsf.com`,
          phone: input.phone.trim(),
          password: input.password,
          intakeComplete: false,
          prefs: DEFAULT_PREFS,
        };
        setUsers((list) => [...list, created]);
        persistUser(created);
        writeStorage("onboarded", "1");
        setOnboarded(true);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        clearStorage("session");
      },
      updateUser: (patch) => {
        if (!user) return;
        persistUser({ ...user, ...patch });
      },
      completeIntake: (answers) => {
        if (!user) return;
        persistUser({ ...user, intake: answers, intakeComplete: true });
      },
      sessions,
      bookSession: (input) => {
        const next: CoachingSession = {
          ...input,
          id: `s${Date.now()}`,
          status: "upcoming" as SessionStatus,
          zoomUrl: "https://zoom.us/j/wellness-healing-sf",
        };
        setSessions((list) => [next, ...list]);
        if (next.coveredByPlan) {
          setSubscription((sub) => (sub ? { ...sub, sessionsUsed: Math.min(sub.sessionsIncluded, sub.sessionsUsed + 1) } : sub));
        }
        setDraftState({});
        return next;
      },
      rescheduleSession: (id, date, time) => {
        setSessions((list) => list.map((s) => (s.id === id ? { ...s, date, time } : s)));
        setDraftState({});
        pushToast("Session rescheduled successfully");
      },
      cancelSession: (id) => {
        setSessions((list) => list.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s)));
        pushToast("Session cancelled");
      },
      addReview: (id, rating, text) => {
        setSessions((list) => list.map((s) => (s.id === id ? { ...s, review: { rating, text } } : s)));
        pushToast("Thank you for your review");
      },
      draft,
      setDraft: (patch) => setDraftState((d) => ({ ...d, ...patch })),
      clearDraft: () => setDraftState({}),
      subscription,
      startSubscription: (planId, cycle) => {
        const plan = PLANS.find((p) => p.id === planId);
        if (!plan) return;
        const next: Subscription = {
          planId: plan.id,
          planName: plan.name,
          price: cycle === "quarterly" ? plan.quarterlyPrice : plan.monthlyPrice,
          cycle,
          sessionsIncluded: plan.sessionsPerMonth,
          sessionsUsed: 0,
          renewalDate: cycle === "quarterly" ? "2026-12-08" : "2026-10-08",
          status: "active",
        };
        setSubscription(next);
      },
      changePlan: (planId) => {
        const plan = PLANS.find((p) => p.id === planId);
        if (!plan || !subscription) return;
        setSubscription({
          ...subscription,
          planId: plan.id,
          planName: plan.name,
          price: subscription.cycle === "quarterly" ? plan.quarterlyPrice : plan.monthlyPrice,
          sessionsIncluded: plan.sessionsPerMonth,
          status: "active",
        });
        pushToast(`Moved to ${plan.name}`);
      },
      pauseSubscription: () => {
        setSubscription((sub) => (sub ? { ...sub, status: "paused" } : sub));
        pushToast("Subscription paused");
      },
      resumeSubscription: () => {
        setSubscription((sub) => (sub ? { ...sub, status: "active" } : sub));
        pushToast("Subscription resumed");
      },
      cancelSubscription: () => {
        setSubscription((sub) => (sub ? { ...sub, status: "cancelled" } : sub));
        pushToast("Subscription cancelled");
      },
      paymentMethods,
      addPaymentMethod: (method) => {
        const next = { ...method, id: `pm${Date.now()}` };
        setPaymentMethods((list) => [...list, next]);
        pushToast("Card added");
      },
      removePaymentMethod: (id) => setPaymentMethods((list) => list.filter((m) => m.id !== id)),
      invoices,
      messages,
      sendMessage: (text) => {
        const mine: ChatMessage = {
          id: `m${Date.now()}`,
          from: "me",
          text,
          at: new Date().toISOString(),
        };
        setMessages((list) => [...list, mine]);
        window.setTimeout(() => {
          setMessages((list) => [
            ...list,
            {
              id: `m${Date.now()}j`,
              from: "jackie",
              text: "I received this — I’ll sit with it and we can talk it through in session.",
              at: new Date().toISOString(),
            },
          ]);
        }, 1400);
      },
      notifications,
      markAllRead: () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
      markNotificationRead: (id) =>
        setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n))),
      togglePref: (key) => {
        if (!user) return;
        persistUser({ ...user, prefs: { ...user.prefs, [key]: !user.prefs[key] } });
      },
      toasts,
      pushToast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    };
  }, [
    hydrated,
    users,
    user,
    onboarded,
    sessions,
    draft,
    subscription,
    paymentMethods,
    invoices,
    messages,
    notifications,
    toasts,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
