import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthInput, AuthShell, PasswordField } from "@/components/AuthShell";
import { Button, Field } from "@/components/kit";
import { PHOTOS } from "@/lib/images";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — Wellness & Healing SF" }] }),
  component: RegisterScreen,
});

function RegisterScreen() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password && confirm && password !== confirm) {
      setError("Those passwords don’t match yet.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms and Privacy Policy to continue.");
      return;
    }
    register({ fullName, email, phone, password });
    navigate({ to: "/intake" });
  }

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Begin your path toward healing and clarity"
      showLogo={false}
      background={PHOTOS.sunroom}
    >
      <form noValidate onSubmit={submit}>
        <Field label="Full Name">
          <AuthInput value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
        </Field>
        <Field label="Email">
          <AuthInput type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </Field>
        <Field label="Phone Number">
          <AuthInput type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(505) 000-0000" />
        </Field>
        <PasswordField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordField
          label="Confirm Password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setError("");
          }}
        />

        <label className="mb-5 flex items-start gap-3 text-sm leading-relaxed text-cream">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary">
              Privacy Policy
            </Link>
          </span>
        </label>

        {error && <p className="mb-3 text-sm text-warning">{error}</p>}
        <Button type="submit" full disabled={!agreed}>
          Create Account
        </Button>
        <p className="mt-3 text-center text-xs leading-relaxed text-cream/80">
          Demo — details are stored on this device only
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary">
          Log In
        </Link>
      </p>
    </AuthShell>
  );
}
