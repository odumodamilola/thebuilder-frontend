import { useSession } from "@/context/SessionContext";
import { Turnstile } from "@/components/ui/Turnstile";
import { errorMessage } from "@/lib/http";
import { LoadingDots } from "@/components/ui/LoadingDots";
import {
  safeReturnPath,
  signInDestination,
  withReturnPath,
} from "@/lib/return-path";
import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { accountApi } from "./api";
import { Field, accent, control, primary, secondary } from "./fields";

type View =
  "login" | "register" | "verify" | "forgot" | "reset" | "mfa" | "mfa-setup";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function AuthScreen({ initialView }: { initialView: View }) {
  const { user } = useSession();
  const [turnstileToken, setTurnstileToken] = useState("");
  const router = useRouter();
  const state =
    process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true" &&
    typeof router.query.state === "string"
      ? router.query.state
      : "";
  const view = (
    state.startsWith("login")
      ? "login"
      : state.startsWith("register")
        ? "register"
        : state.startsWith("mfa")
          ? state.includes("setup") || state.includes("codes")
            ? "mfa-setup"
            : "mfa"
          : initialView
  ) as View;
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
    country: "",
    city: "",
    profession: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(state === "forgot-sent");
  const [done, setDone] = useState(state === "reset-done");
  const [more, setMore] = useState(state === "register-more");
  const [otp, setOtp] = useState("");
  const score = useMemo(
    () =>
      [
        form.password.length >= 8,
        /[a-z]/.test(form.password) && /[A-Z]/.test(form.password),
        /\d/.test(form.password),
        /[^\w]/.test(form.password),
      ].filter(Boolean).length,
    [form.password],
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (view === "login") {
        if (!emailOk(form.email) || !form.password)
          throw new Error("Enter a valid email and password.");
        const r = await accountApi.login({
          email: form.email,
          password: form.password,
        });
        await router.push(signInDestination(r.data, router.query.redirect));
      }
      if (view === "register") {
        if (!form.name || !emailOk(form.email) || score < 3 || !form.terms)
          throw new Error(
            "Complete every required field and use a stronger password.",
          );
        await accountApi.register({
          name: form.name,
          email: form.email,
          password: form.password,
          country: form.country || undefined,
          city: form.city || undefined,
          profession: form.profession || undefined,
          turnstileToken,
        });
        await router.push(
          withReturnPath(
            "/verify-email?email=" + encodeURIComponent(form.email),
            router.query.redirect,
          ),
        );
      }
      if (view === "forgot") {
        if (!emailOk(form.email))
          throw new Error("Enter a valid email address.");
        await accountApi.forgotPassword(form.email);
        setSent(true);
      }
      if (view === "reset") {
        if (score < 3 || form.password !== form.confirm)
          throw new Error(
            "Use a strong password and make sure both passwords match.",
          );
        await accountApi.resetPassword({
          token: String(router.query.token || ""),
          email: String(router.query.email || form.email),
          password: form.password,
          password_confirmation: form.confirm,
        });
        setDone(true);
      }
      if (view === "mfa") {
        if (!otp.trim())
          throw new Error("Enter your authentication or recovery code.");
        await accountApi.verifyMfa(otp, otp.length === 6 ? undefined : otp);
        await router.push(
          safeReturnPath(router.query.redirect) ||
            (user?.mfaRequired ? "/console" : "/account"),
        );
      }
    } catch (x) {
      setError(
        x instanceof Error && !(x instanceof TypeError)
          ? x.message
          : errorMessage(x),
      );
    } finally {
      setBusy(false);
    }
  }
  const title = {
    login: "Sign in",
    register: "Create your account",
    verify: "Check your inbox",
    forgot: "Reset your password",
    reset: "Choose a new password",
    mfa: "Two-factor sign-in",
    "mfa-setup": "Secure your account",
  }[view];
  return (
    <div className="min-h-screen bg-[var(--surface-card)] font-ui lg:grid lg:grid-cols-[45fr_55fr]">
      <aside className="hidden min-h-screen flex-col justify-between bg-[var(--surface-inverse)] p-14 text-[var(--text-on-inverse)] lg:flex">
        <Link
          href="/"
          className="font-display text-xl font-extrabold text-[var(--text-on-inverse)]"
        >
          The Builder<span className="text-[var(--accent)]">.</span>
        </Link>
        <blockquote className="max-w-lg font-display text-3xl font-bold leading-tight">
          “New arrivals don’t need a hundred services. They need one person who
          answers the phone.”
          <footer className="mt-6 font-ui text-sm font-medium text-[color:color-mix(in_srgb,var(--text-on-inverse)_70%,transparent)]">
            Selba-Gondoza Luka · Founder, Haven Care
          </footer>
        </blockquote>
        <div className="flex gap-1.5">
          <i className="h-1 w-6 rounded bg-[var(--text-on-inverse)]" />
          <i className="h-1 w-2 rounded bg-[color:color-mix(in_srgb,var(--text-on-inverse)_40%,transparent)]" />
          <i className="h-1 w-2 rounded bg-[color:color-mix(in_srgb,var(--text-on-inverse)_40%,transparent)]" />
        </div>
      </aside>
      <div>
        <header className="flex items-center justify-between bg-[var(--surface-inverse)] px-4 py-4 lg:hidden">
          <Link
            href="/"
            className="font-display font-extrabold text-[var(--text-on-inverse)]"
          >
            The Builder<span className="text-[var(--accent)]">.</span>
          </Link>
          <Link
            href="/stories"
            className="text-sm text-[var(--text-on-inverse)]"
          >
            Back to stories
          </Link>
        </header>
        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[448px] items-center px-4 py-12">
          <section className="w-full space-y-6">
            <div>
              <h1 className="font-display text-[32px] font-extrabold leading-[38px] text-[var(--text-heading)]">
                {title}
              </h1>
              <p className="mt-2 text-[15px] text-[var(--text-meta)]">
                {view === "login"
                  ? "Welcome back. Your saved stories are waiting."
                  : view === "register"
                    ? "Save stories, choose your interests and submit story ideas."
                    : view === "forgot"
                      ? "Enter the email you signed up with and we’ll send a reset link."
                      : ""}
              </p>
            </div>
            {state === "login-error" && (
              <Notice>
                That email and password combination didn’t work. Check both and
                try again.
              </Notice>
            )}
            {state === "login-unverified" && (
              <Notice>
                Please verify your email before signing in. We sent a link to
                amara.o@example.com.
              </Notice>
            )}
            {state === "login-locked" && (
              <Notice dark>Too many attempts. Try again in 15 minutes.</Notice>
            )}
            {error && <Notice>{error}</Notice>}
            {view === "verify" ? (
              <Verify email={String(router.query.email || "")} />
            ) : view === "mfa-setup" ? (
              <ConnectedMfaSetup />
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {view === "register" && (
                  <Field label="Full name">
                    <input
                      className={control}
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </Field>
                )}
                {["login", "register", "forgot"].includes(view) && !sent && (
                  <Field label="Email">
                    <input
                      type="email"
                      autoComplete="email"
                      className={control}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </Field>
                )}
                {["login", "register", "reset"].includes(view) && !done && (
                  <Field label={view === "reset" ? "New password" : "Password"}>
                    <input
                      type="password"
                      autoComplete={
                        view === "login" ? "current-password" : "new-password"
                      }
                      className={control}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    {view !== "login" && (
                      <div
                        className="mt-2 grid grid-cols-4 gap-1"
                        role="meter"
                        aria-label="Password strength"
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-valuenow={score}
                      >
                        {[0, 1, 2, 3].map((i) => (
                          <i
                            key={i}
                            className={`h-1 rounded ${i < score ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
                          />
                        ))}
                      </div>
                    )}
                  </Field>
                )}
                {view === "reset" && !done && (
                  <Field label="Confirm new password">
                    <input
                      type="password"
                      className={control}
                      value={form.confirm}
                      onChange={(e) =>
                        setForm({ ...form, confirm: e.target.value })
                      }
                    />
                  </Field>
                )}
                {view === "mfa" && (
                  <Field label="Authentication or recovery code">
                    <input
                      autoComplete="one-time-code"
                      maxLength={32}
                      className={`${control} text-center font-mono text-2xl tracking-[.5em]`}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.trim())}
                    />
                  </Field>
                )}
                {view === "register" && (
                  <>
                    <button
                      type="button"
                      className="w-full border-y border-[var(--border)] py-3 text-left text-sm font-semibold"
                      onClick={() => setMore(!more)}
                    >
                      Tell us a bit more{" "}
                      <span className="font-normal text-[var(--text-meta)]">
                        (optional)
                      </span>
                    </button>
                    {more && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Country">
                          <input
                            className={control}
                            value={form.country}
                            onChange={(e) =>
                              setForm({ ...form, country: e.target.value })
                            }
                          />
                        </Field>
                        <Field label="City">
                          <input
                            className={control}
                            value={form.city}
                            onChange={(e) =>
                              setForm({ ...form, city: e.target.value })
                            }
                          />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Profession">
                            <input
                              className={control}
                              value={form.profession}
                              onChange={(e) =>
                                setForm({ ...form, profession: e.target.value })
                              }
                            />
                          </Field>
                        </div>
                      </div>
                    )}
                    <label className="flex gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) =>
                          setForm({ ...form, terms: e.target.checked })
                        }
                      />
                      I agree to the Terms and Privacy Policy
                    </label>
                  </>
                )}
                {view === "register" && (
                  <Turnstile onToken={setTurnstileToken} />
                )}
                {view === "login" && (
                  <Link
                    className="block text-right text-sm font-semibold text-[var(--text-heading)]"
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                )}
                {sent ? (
                  <div
                    role="status"
                    className="rounded-lg bg-[var(--surface-tint)] p-5"
                  >
                    <b>Check your email</b>
                    <p className="mt-1 text-sm">
                      If an account exists for that address, we sent a reset
                      link.
                    </p>
                  </div>
                ) : done ? (
                  <div role="status">
                    <p>Your password has been reset.</p>
                    <Link href="/signin" className={`${primary} mt-4`}>
                      Sign in now
                    </Link>
                  </div>
                ) : (
                  <button
                    className={`w-full ${view === "login" || view === "register" ? accent : primary}`}
                    disabled={busy}
                  >
                    {busy ? (
                      <LoadingDots label="Please wait" />
                    ) : view === "login" ? (
                      "Sign in"
                    ) : view === "register" ? (
                      "Create account"
                    ) : view === "forgot" ? (
                      "Send reset link"
                    ) : view === "reset" ? (
                      "Reset password"
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}
              </form>
            )}
            {view === "login" && (
              <p className="text-center text-[15px]">
                New here?{" "}
                <Link
                  className="font-semibold"
                  href={withReturnPath("/register", router.query.redirect)}
                >
                  Create an account
                </Link>
              </p>
            )}
            {view === "register" && (
              <p className="text-center text-[15px]">
                Already have an account?{" "}
                <Link
                  className="font-semibold"
                  href={withReturnPath("/signin", router.query.redirect)}
                >
                  Sign in
                </Link>
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
function Notice({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      role="alert"
      className={`rounded-lg p-3 text-sm ${dark ? "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]" : "border border-[var(--text-error)]"}`}
    >
      {children}
    </div>
  );
}
function Verify({ email }: { email: string }) {
  const { refresh } = useSession();
  const router = useRouter();
  const [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function act(continueAfter: boolean) {
    setBusy(true);
    setError("");
    try {
      if (continueAfter) {
        const result = await accountApi.me();
        if (!result.data.emailVerified)
          throw new Error("Open the verification link in your email first.");
        refresh();
        await router.push(
          signInDestination(result.data, router.query.redirect),
        );
      } else {
        await accountApi.resendVerification(email);
        setSent(true);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-4">
      <p>
        We sent a verification link to <b>{email}</b>. It expires in 60 minutes.
      </p>
      {error && <Notice>{error}</Notice>}
      <div className="rounded-lg bg-[var(--surface-tint)] p-4 text-sm">
        Didn’t get it? Check spam, or resend.
        <button
          className={secondary + " mt-3 w-full"}
          disabled={busy || !email}
          onClick={() => act(false)}
        >
          {busy ? (
            <LoadingDots />
          ) : sent ? (
            "Verification email sent"
          ) : (
            "Resend email"
          )}
        </button>
      </div>
      <button
        className={primary + " w-full"}
        disabled={busy}
        onClick={() => act(true)}
      >
        I’ve verified, continue
      </button>
    </div>
  );
}
function ConnectedMfaSetup() {
  const router = useRouter();
  const [setup, setSetup] = useState<{
      secret: string;
      provisioningUri: string;
    } | null>(null),
    [code, setCode] = useState(""),
    [codes, setCodes] = useState<string[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const start = async () => {
    setBusy(true);
    setError("");
    try {
      setSetup((await accountApi.setupMfa()).data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const confirm = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      setCodes((await accountApi.confirmMfa(code)).data.recoveryCodes);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-5">
      <ol className="flex justify-between text-sm font-semibold">
        <li>1. Set up</li>
        <li>2. Verify</li>
        <li>3. Recovery codes</li>
      </ol>
      {error && <Notice>{error}</Notice>}
      {codes.length ? (
        <>
          <p>Save these recovery codes somewhere safe. Each works once.</p>
          <ul className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--surface-tint)] p-4 font-mono">
            {codes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <Link
            href={safeReturnPath(router.query.redirect) || "/console"}
            className={primary}
          >
            Continue
          </Link>
        </>
      ) : setup ? (
        <form onSubmit={confirm} className="space-y-4">
          <p className="text-sm text-[var(--text-meta)]">
            Add this setup key to your authenticator, then enter its six-digit
            code.
          </p>
          <code className="block break-all rounded-lg bg-[var(--surface-tint)] p-4">
            {setup.secret}
          </code>
          <a
            href={setup.provisioningUri}
            className="block text-sm font-semibold"
          >
            Open in authenticator app
          </a>
          <Field label="Authentication code">
            <input
              className={control}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </Field>
          <button className={primary} disabled={busy}>
            {busy ? <LoadingDots /> : "Verify and get recovery codes"}
          </button>
        </form>
      ) : (
        <button className={primary} disabled={busy} onClick={start}>
          {busy ? <LoadingDots /> : "Set up authenticator"}
        </button>
      )}
    </div>
  );
}
