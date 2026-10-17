import { useIdempotencyKey } from "@/hooks/useIdempotencyKey";
import { Turnstile } from "@/components/ui/Turnstile";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Copy, Lock } from "lucide-react";
import { accountApi, type NominationInput } from "@/features/account/api";
import {
  Field,
  accent,
  control,
  primary,
  secondary,
} from "@/features/account/fields";

const industries = [
  "FinTech",
  "HealthTech",
  "Education",
  "Agriculture",
  "Creative Economy",
  "Technology",
];
const countries = [
  "Nigeria",
  "Australia",
  "United Kingdom",
  "United States",
  "Canada",
  "Kenya",
  "Ghana",
  "South Africa",
  "Other",
];
const relationships = [
  "Colleague",
  "Friend or family",
  "Customer",
  "Investor",
  "Community member",
  "Other",
];
export default function Nominate() {
  const requestKey = useIdempotencyKey();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [v, setV] = useState({
    type: "Builder" as "Builder" | "Startup",
    name: "",
    industry: "",
    country: "",
    city: "",
    website: "",
    reason: "",
    nomineeEmail: "",
    nomineePhone: "",
    submitterName: "",
    submitterEmail: "",
    relationship: "",
    consent: false,
  });
  const set = (k: keyof typeof v, x: string | boolean) =>
    setV({ ...v, [k]: x });
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (step === 1 && (!v.name || !v.industry || !v.country || !v.city)) {
      setError("Complete the required nominee details.");
      return;
    }
    if (step === 2 && v.reason.length < 40) {
      setError("Tell us a little more (at least 40 characters).");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (
      !v.submitterName ||
      !/^\S+@\S+\.\S+$/.test(v.submitterEmail) ||
      !v.relationship ||
      !v.consent
    ) {
      setError("Complete your details and confirm the nomination.");
      return;
    }
    setBusy(true);
    try {
      const r = await accountApi.nominate(
        { ...v, consent: true, turnstileToken } as NominationInput,
        requestKey(v),
      );
      setReference(r.data.reference);
      setDone(true);
    } catch (x) {
      setError(
        x instanceof Error ? x.message : "Nomination could not be submitted.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <Success
        reference={reference}
        again={() => {
          setDone(false);
          setStep(1);
        }}
      />
    );
  return (
    <main className="mx-auto grid max-w-7xl gap-14 px-4 py-12 lg:grid-cols-[1fr_560px] lg:px-6 lg:py-24">
      <section>
        <span className="text-xs font-bold uppercase tracking-[.12em] text-[var(--text-error)]">
          Nominate a Builder
        </span>
        <h1 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-tight text-[var(--text-heading)] md:text-6xl">
          Help us find the people building what comes next.
        </h1>
        <p className="mt-5 max-w-lg text-lg text-[var(--text-meta)]">
          Know a founder, operator or startup whose work deserves a wider
          audience? Tell our editors.
        </p>
      </section>
      <form onSubmit={submit} className="space-y-7">
        <ol
          aria-label="Progress"
          className="grid grid-cols-3 text-center text-xs font-semibold"
        >
          {["Nominee", "Their story", "About you"].map((x, i) => (
            <li key={x} aria-current={step === i + 1 ? "step" : undefined}>
              <span
                className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 ${i + 1 < step ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--text-on-inverse)]" : i + 1 === step ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--text-on-inverse)]" : "border-[var(--border)]"}`}
              >
                {i + 1 < step ? <Check size={15} /> : i + 1}
              </span>
              {x}
            </li>
          ))}
        </ol>
        <div>
          <h2 className="font-display text-2xl font-bold">
            {
              [
                "Who are you nominating?",
                "Why should we feature them?",
                "About you",
              ][step - 1]
            }
          </h2>
          <p className="text-sm text-[var(--text-meta)]">
            Step {step} of 3 ·{" "}
            {step === 1
              ? "Takes about three minutes in total."
              : step === 2
                ? "Our editors read every word."
                : "So we can let you know what happens next."}
          </p>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-[var(--text-error)] p-3 text-sm text-[var(--text-error)]"
          >
            {error}
          </p>
        )}
        {step === 1 && (
          <>
            <div>
              <span className="text-sm font-semibold">Nomination type</span>
              <div className="mt-2 grid grid-cols-2 rounded-lg bg-[var(--surface-tint)] p-1">
                {(["Builder", "Startup"] as const).map((x) => (
                  <button
                    type="button"
                    key={x}
                    onClick={() => set("type", x)}
                    className={`rounded-md py-2 text-sm font-semibold ${v.type === x ? "bg-[var(--surface-card)] shadow" : ""}`}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <Field
              label={
                v.type === "Startup" ? "Startup name" : "Nominee full name"
              }
            >
              <input
                className={control}
                value={v.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <SelectField
              label="Industry"
              value={v.industry}
              options={industries}
              onChange={(x) => set("industry", x)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Country"
                value={v.country}
                options={countries}
                onChange={(x) => set("country", x)}
              />
              <Field label="City">
                <input
                  className={control}
                  value={v.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Website or LinkedIn" optional>
              <input
                type="url"
                placeholder="https://"
                className={control}
                value={v.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </Field>
          </>
        )}
        {step === 2 && (
          <>
            <Field
              label="Why should we feature them?"
              hint="What have they built, and who has it helped? Specifics help our editors."
            >
              <textarea
                rows={7}
                maxLength={1000}
                className={control}
                value={v.reason}
                onChange={(e) => set("reason", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nominee email" optional>
                <input
                  type="email"
                  className={control}
                  value={v.nomineeEmail}
                  onChange={(e) => set("nomineeEmail", e.target.value)}
                />
              </Field>
              <Field label="Nominee phone" optional>
                <input
                  type="tel"
                  className={control}
                  value={v.nomineePhone}
                  onChange={(e) => set("nomineePhone", e.target.value)}
                />
              </Field>
            </div>
            <p className="flex gap-2 rounded-lg bg-[var(--surface-tint)] p-4 text-sm">
              <Lock size={18} />
              We never publish contact details. We only use them to reach the
              nominee if they’re shortlisted.
            </p>
          </>
        )}
        {step === 3 && (
          <>
            <Field label="Your name">
              <input
                className={control}
                value={v.submitterName}
                onChange={(e) => set("submitterName", e.target.value)}
              />
            </Field>
            <Field label="Your email" hint="We’ll send your confirmation here.">
              <input
                type="email"
                className={control}
                value={v.submitterEmail}
                onChange={(e) => set("submitterEmail", e.target.value)}
              />
            </Field>
            <SelectField
              label="Relationship to nominee"
              value={v.relationship}
              options={relationships}
              onChange={(x) => set("relationship", x)}
            />
            <label className="flex gap-3 text-sm">
              <input
                type="checkbox"
                checked={v.consent}
                onChange={(e) => set("consent", e.target.checked)}
              />
              I confirm this nomination is accurate and I agree to the Privacy
              Policy.
            </label>
            <Turnstile onToken={setTurnstileToken} />
          </>
        )}
        <div className="flex justify-between border-t border-[var(--border)] pt-6">
          {step > 1 ? (
            <button
              type="button"
              className={secondary}
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          <button className={step === 3 ? accent : primary} disabled={busy}>
            {busy
              ? "Submitting…"
              : step === 3
                ? "Submit nomination"
                : "Continue →"}
          </button>
        </div>
      </form>
    </main>
  );
}
function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (x: string) => void;
}) {
  return (
    <Field label={label}>
      <select
        className={control}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose one</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </Field>
  );
}
function Success({
  reference,
  again,
}: {
  reference: string;
  again: () => void;
}) {
  const ref = reference || "Reference supplied by the API";
  return (
    <main
      role="status"
      className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--text-heading)] text-[var(--text-error)]">
        <Check size={38} />
      </span>
      <h1 className="font-display text-3xl font-extrabold md:text-[44px]">
        Thank you. Your nomination is in
      </h1>
      <button
        className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-tint)] px-4 py-2 font-mono"
        onClick={() => navigator.clipboard?.writeText(ref)}
      >
        {ref}
        <Copy size={16} />
      </button>
      <p>
        We’ve emailed you a confirmation. You can reply to it at any time to add
        details.
      </p>
      <ol className="grid w-full gap-6 border-t border-[var(--border)] pt-7 text-left md:grid-cols-3">
        {[
          [
            "1",
            "Review",
            "An editor reads your nomination within 10 working days.",
          ],
          [
            "2",
            "Shortlist",
            "Strong nominations go to our monthly editorial meeting.",
          ],
          [
            "3",
            "Interview",
            "If shortlisted, we contact the nominee directly.",
          ],
        ].map(([n, t, d]) => (
          <li key={n} className="flex gap-3">
            <b className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--primary)]">
              {n}
            </b>
            <span>
              <strong className="font-display">{t}</strong>
              <small className="block text-[var(--text-meta)]">{d}</small>
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap justify-center gap-3">
        <button className={primary} onClick={again}>
          + Nominate another
        </button>
        <Link className={secondary} href="/builders">
          Explore Builders →
        </Link>
      </div>
    </main>
  );
}
