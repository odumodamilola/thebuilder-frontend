import { Pagination } from "@/components/ui/Pagination";
import {
  AccountDataProvider,
  useAccountData,
} from "@/context/AccountDataContext";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { http, errorMessage } from "@/lib/http";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useIdempotencyKey } from "@/hooks/useIdempotencyKey";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Rss,
  Bookmark,
  History,
  Sparkles,
  PenLine,
  User,
  Settings,
  LogOut,
  Trash2,
} from "lucide-react";
import { accountApi } from "@/features/account/api";
import {
  Field,
  accent,
  control,
  primary,
  secondary,
} from "@/features/account/fields";

const nav = [
  ["feed", "My Feed", Rss],
  ["saved", "Saved", Bookmark],
  ["recent", "Recently viewed", History],
  ["interests", "Interests", Sparkles],
  ["submit", "Submit a story", PenLine],
  ["profile", "Profile", User],
  ["settings", "Settings", Settings],
] as const;
const stories = [
  "How a Lagos founder made credit work for market traders",
  "The marathon record-holder running a new race in Melbourne",
  "A diaspora founder building care around culture",
  "The agritech platform betting on small farms",
  "Why African fintech is entering its patient era",
];
const interests = [
  "Entrepreneurship",
  "Technology",
  "FinTech",
  "HealthTech",
  "Education",
  "Agriculture",
  "Investment",
  "Careers",
  "Diaspora",
  "Innovation",
  "Creative Economy",
];
export default function Account() {
  const router = useRouter();
  return (
    <AccountDataProvider key={String(router.query.state || "feed")}>
      <AccountScreen />
    </AccountDataProvider>
  );
}
function AccountScreen() {
  const data = useAccountData();
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const requested = String(router.query.state || "feed");
  const view = requested.split("-")[0];
  const [saved, setSaved] = useState(data.stories.map((s) => s.title));
  const [selected, setSelected] = useState(
    (Array.isArray(data.profile.interests) ? data.profile.interests : []).map(
      (v) =>
        interests.find((x) => x.toLowerCase().replaceAll(" ", "-") === v) ||
        String(v),
    ),
  );
  const go = (x: string) =>
    router.replace({ pathname: "/account", query: { state: x } }, undefined, {
      shallow: true,
    });
  return (
    <div className="mx-auto grid max-w-7xl gap-14 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-6 lg:py-12">
      <nav
        aria-label="Account"
        className="-mx-4 flex overflow-x-auto border-b border-[var(--border)] px-4 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:border-0 lg:px-0"
      >
        <div className="mb-5 hidden items-center gap-3 lg:flex">
          <Avatar />
          <span>
            <b className="block text-sm">{user?.name}</b>
            <small className="text-[var(--text-meta)]">{user?.email}</small>
          </span>
        </div>
        {nav.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => go(key)}
            aria-current={view === key ? "page" : undefined}
            className={`flex min-h-12 shrink-0 items-center gap-3 px-3 text-sm ${view === key ? "border-b-2 border-[var(--accent)] font-semibold text-[var(--text-heading)] lg:border-b-0 lg:shadow-[inset_3px_0_0_var(--accent)]" : "text-[var(--text-meta)]"}`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
        <button
          onClick={async () => {
            try {
              await accountApi.logout();
              await router.push("/signin");
            } catch (e) {
              toast(errorMessage(e));
            }
          }}
          className="mt-4 hidden min-h-11 items-center gap-3 border-t border-[var(--border)] px-3 pt-3 text-sm text-[var(--text-meta)] lg:flex"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </nav>
      <main className="min-w-0 max-w-[880px]">
        {view === "feed" && <Feed />}
        {view === "saved" && (
          <Saved
            items={saved}
            remove={async (x) => {
              const item = data.stories.find((s) => s.title === x);
              if (!item?.id) return;
              try {
                await accountApi.bookmark(item.id, false);
                setSaved(saved.filter((s) => s !== x));
              } catch (e) {
                toast(errorMessage(e));
              }
            }}
          />
        )}{" "}
        {view === "recent" && (
          <>
            <Header
              title="Recently viewed"
              sub="Your recent stories. Only you can see this."
            />
            <StoryList items={data.stories.map((s) => s.title)} />
          </>
        )}
        {view === "interests" && (
          <Interests selected={selected} setSelected={setSelected} />
        )}{" "}
        {view === "profile" && (
          <Profile preview={requested === "profile-preview"} />
        )}{" "}
        {view === "settings" && (
          <AccountSettings deleting={requested === "settings-delete"} />
        )}{" "}
        {view === "submit" && <Submit done={requested === "submit-done"} />}
        <Pagination meta={data.meta} />
      </main>
    </div>
  );
}
function Header({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-7">
      <h1 className="font-display text-3xl font-extrabold text-[var(--text-heading)] md:text-4xl">
        {title}
      </h1>
      {sub && <p className="mt-1 text-[15px] text-[var(--text-meta)]">{sub}</p>}
    </header>
  );
}
function Avatar() {
  const { user } = useSession();
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-inverse)] font-display font-extrabold text-[var(--text-on-inverse)]">
      {user?.name
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
function Feed() {
  const { user } = useSession();
  const data = useAccountData();
  return (
    <>
      <Header title="My Feed" sub={"Welcome, " + user?.name + "."} />
      <div className="mb-5 flex gap-4 rounded-xl bg-[var(--surface-tint)] p-6">
        <Sparkles className="shrink-0" />
        <div>
          <b className="font-display text-lg">
            Your personalised feed is coming soon
          </b>
          <p className="mt-1 text-[15px]">
            Until then, browse the latest stories from The Builder.
          </p>
          <Link
            href="/account?state=interests"
            className="mt-2 inline-block text-sm font-semibold"
          >
            Edit interests →
          </Link>
        </div>
      </div>
      <StoryList items={data.stories.map((s) => s.title)} />
    </>
  );
}
function StoryList({
  items,
  remove,
}: {
  items: string[];
  remove?: (x: string) => void;
}) {
  const data = useAccountData();
  return (
    <ul>
      {items.map((title, i) => (
        <li
          key={title}
          className="flex items-start gap-4 border-t border-[var(--border)] py-5"
        >
          <span className="h-24 w-32 shrink-0 rounded-lg bg-[var(--surface-tint)]" />
          <Link
            href={
              data.stories.find((s) => s.title === title)?.slug
                ? "/stories/" +
                  data.stories.find((s) => s.title === title)?.slug
                : "/stories"
            }
            className="min-w-0 flex-1"
          >
            <small className="font-semibold uppercase tracking-widest text-[var(--text-error)]">
              {data.stories.find((s) => s.title === title)?.kicker}
            </small>
            <h2 className="mt-1 font-display text-lg font-bold text-[var(--text-heading)]">
              {title}
            </h2>
            <span className="text-xs text-[var(--text-meta)]">
              By {data.stories.find((s) => s.title === title)?.author} ·{" "}
              {data.stories.find((s) => s.title === title)?.readTime}
            </span>
          </Link>
          {remove && (
            <button
              aria-label={`Remove ${title}`}
              className="p-2"
              onClick={() => remove(title)}
            >
              <Trash2 size={18} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
function Saved({
  items,
  remove,
}: {
  items: string[];
  remove: (x: string) => void;
}) {
  return (
    <>
      <Header
        title="Saved"
        sub={
          items.length ? `${items.length} saved stories` : "Nothing saved yet"
        }
      />
      {items.length ? (
        <StoryList items={items} remove={remove} />
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] p-14 text-center">
          <Bookmark className="mx-auto mb-4" size={54} />
          <b className="font-display text-xl">Save stories to read later</b>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-meta)]">
            Tap the bookmark on any story and it will wait for you here, on
            every device.
          </p>
          <Link href="/stories" className={`${primary} mt-5`}>
            Browse stories
          </Link>
        </div>
      )}
    </>
  );
}
function Recent() {
  return (
    <>
      <Header
        title="Recently viewed"
        sub="Your last 20 stories and profiles. Only you can see this."
      />
      {["Today", "Yesterday", "Earlier this week"].map((day, i) => (
        <section key={day} className="grid gap-4 py-3 sm:grid-cols-[120px_1fr]">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-meta)]">
            {day}
          </h2>
          <ol className="border-l-2 border-[var(--border)] pl-5">
            {stories.slice(i, i + 2).map((x, j) => (
              <li key={x} className="py-3">
                <Link href="/stories" className="font-display font-bold">
                  {x}
                </Link>
                <span className="float-right text-xs text-[var(--text-meta)]">
                  {9 - i}:{j ? "12" : "41"}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
function Interests({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (x: string[]) => void;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const toggle = (x: string) =>
    setSelected(
      selected.includes(x) ? selected.filter((v) => v !== x) : [...selected, x],
    );
  return (
    <>
      <Header
        title="Interests"
        sub={selected.length + " selected · choose at least 3"}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {interests.map((x) => (
          <button
            key={x}
            onClick={() => toggle(x)}
            aria-pressed={selected.includes(x)}
            className={
              selected.includes(x)
                ? "min-h-24 rounded-xl border border-[var(--text-heading)] bg-[var(--surface-inverse)] p-4 text-left font-semibold text-[var(--text-on-inverse)]"
                : "min-h-24 rounded-xl border border-[var(--border)] p-4 text-left font-semibold"
            }
          >
            {x}
          </button>
        ))}
      </div>
      <div className="sticky bottom-4 mt-6 flex justify-between rounded-xl bg-[var(--surface-inverse)] p-3 text-[var(--text-on-inverse)] shadow-xl">
        <span className="p-2 text-sm">
          {selected.length} interests selected
        </span>
        <button
          className={accent}
          disabled={selected.length < 3 || busy}
          onClick={async () => {
            setBusy(true);
            try {
              await accountApi.saveInterests(selected);
              toast("Interests saved");
            } catch (e) {
              toast(errorMessage(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? <LoadingDots /> : "Save changes"}
        </button>
      </div>
    </>
  );
}

function Profile({ preview }: { preview: boolean }) {
  const { user, refresh } = useSession();
  const data = useAccountData();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    name: user?.name || "",
    biography: String(data.profile.biography || ""),
    profession: String(data.profile.profession || ""),
    organisation: String(data.profile.organisation || ""),
    industry: String(data.profile.industry || ""),
    country: String(data.profile.country || ""),
    city: String(data.profile.city || ""),
    website: String(data.profile.website || ""),
  });
  const [privacy, setPrivacy] = useState<Record<string, string>>(
    (data.profile.privacy || {}) as Record<string, string>,
  );
  const fields = [
    ["Full name", "name"],
    ["Bio", "biography"],
    ["Occupation", "profession"],
    ["Organisation", "organisation"],
    ["Industry", "industry"],
    ["Country", "country"],
    ["City", "city"],
    ["Website", "website"],
  ];
  return (
    <>
      <Header
        title="Profile"
        sub="Choose who sees each detail. Contact details are never public."
      />
      {preview && (
        <div className="mb-6 rounded-xl border border-[var(--border)] p-6">
          <Avatar />
          <h2 className="mt-4 font-display text-2xl font-extrabold">
            {values.name}
          </h2>
          <p>{values.biography}</p>
        </div>
      )}
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await http("/me/profile", {
              method: "PATCH",
              body: { ...values, website: values.website || null, privacy },
            });
            refresh();
            toast("Profile saved");
          } catch (x) {
            toast(errorMessage(x));
          } finally {
            setBusy(false);
          }
        }}
      >
        {fields.map(([label, key]) => (
          <div key={key} className="grid gap-3 sm:grid-cols-[1fr_140px]">
            <Field label={label!}>
              <input
                className={control}
                type={key === "website" ? "url" : "text"}
                value={values[key!] || ""}
                onChange={(e) =>
                  setValues({ ...values, [key!]: e.target.value })
                }
              />
            </Field>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Visibility
              <select
                className={control}
                value={privacy[key!] || "private"}
                onChange={(e) =>
                  setPrivacy({ ...privacy, [key!]: e.target.value })
                }
              >
                <option value="private">Private</option>
                <option value="members">Members</option>
                <option value="public">Public</option>
              </select>
            </label>
          </div>
        ))}
        <button className={primary} disabled={busy}>
          {busy ? <LoadingDots /> : "Save profile"}
        </button>
      </form>
    </>
  );
}

function AccountSettings({ deleting }: { deleting: boolean }) {
  const { user } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(deleting),
    [confirm, setConfirm] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <>
      <Header title="Settings" />
      <section className="space-y-4 border-b border-[var(--border)] pb-7">
        <h2 className="font-display text-xl font-bold">Email</h2>
        <Field label="Email address">
          <input
            type="email"
            className={control}
            value={user?.email || ""}
            readOnly
          />
        </Field>
      </section>
      <AccountSecurity />
      <section className="mt-7 space-y-4">
        <h2 className="font-display text-xl font-bold">Newsletters</h2>
        <Link href="/newsletter" className={secondary}>
          Manage newsletter subscription
        </Link>
      </section>
      <section className="mt-8 rounded-xl border border-[var(--text-error)] p-6">
        <h2 className="font-display text-xl font-bold text-[var(--text-error)]">
          Danger zone
        </h2>
        <p className="my-3 text-sm">
          Deleting your account removes your profile, saved stories and
          interests after the grace period.
        </p>
        <button className={accent} onClick={() => setOpen(true)}>
          Delete my account
        </button>
      </section>
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Delete account"
            className="w-full max-w-md rounded-xl bg-[var(--surface-card)] p-6"
          >
            <h2 className="font-display text-2xl font-bold">
              Delete your account?
            </h2>
            <p className="my-4 text-sm">
              Your account will be deactivated now and permanently deleted after
              30 days.
            </p>
            <Field label="Current password">
              <input
                type="password"
                autoComplete="current-password"
                className={control}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Field label="Type DELETE to confirm">
              <input
                className={control}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Field>
            <div className="mt-5 flex justify-end gap-3">
              <button className={secondary} onClick={() => setOpen(false)}>
                Keep my account
              </button>
              <button
                className={accent}
                disabled={confirm !== "DELETE" || !password || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await http("/me", { method: "DELETE", body: { password } });
                    await router.push("/signin");
                  } catch (e) {
                    toast(errorMessage(e));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? <LoadingDots /> : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Submit({ done }: { done: boolean }) {
  const requestKey = useIdempotencyKey();
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [form, setForm] = useState({
    title: "",
    pitch: "",
    whyNow: "",
    links: "",
  });
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.title || form.pitch.length < 40) {
      setError(
        "Add a working title and tell us a little more (at least 40 characters).",
      );
      return;
    }
    setBusy(true);
    try {
      const result = await accountApi.submitStory(form, requestKey(form));
      setReference(result.data.reference);
      setComplete(true);
    } catch (x) {
      setError(errorMessage(x));
    } finally {
      setBusy(false);
    }
  }
  if (complete)
    return (
      <div role="status">
        <Header title="Thanks, your pitch is with our editors" />
        <div className="rounded-xl border border-[var(--border)] p-5">
          <b>
            {form.title || "The Ibadan coders building for Yoruba speakers"}
          </b>
          <p className="text-sm text-[var(--text-meta)]">
            {reference} · Received
          </p>
        </div>
        <button
          className={`${secondary} mt-5`}
          onClick={() => setComplete(false)}
        >
          Submit another
        </button>
      </div>
    );
  return (
    <>
      <Header
        title="Submit a story"
        sub="Pitch a story you’d like to write, or one you think we should cover."
      />
      <p className="mb-5 rounded-lg bg-[var(--surface-tint)] p-4 text-sm">
        Every submission is reviewed by an editor. Nothing is published
        automatically.
      </p>
      {error && (
        <p role="alert" className="mb-4 text-sm text-[var(--text-error)]">
          {error}
        </p>
      )}
      <form onSubmit={submit} className="space-y-5">
        <Field label="Working title">
          <input
            className={control}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field
          label="Your pitch"
          hint="Who is it about, what happened, and why it matters."
        >
          <textarea
            rows={6}
            className={control}
            value={form.pitch}
            onChange={(e) => setForm({ ...form, pitch: e.target.value })}
          />
        </Field>
        <Field label="Why now?" optional>
          <textarea
            rows={2}
            className={control}
            value={form.whyNow}
            onChange={(e) => setForm({ ...form, whyNow: e.target.value })}
          />
        </Field>
        <Field label="Links" optional>
          <input
            className={control}
            value={form.links}
            onChange={(e) => setForm({ ...form, links: e.target.value })}
          />
        </Field>
        <button className={accent} disabled={busy}>
          {busy ? <LoadingDots /> : "Send to editors"}
        </button>
      </form>
    </>
  );
}

function AccountSecurity() {
  const { toast } = useToast();
  const [currentPassword, setCurrent] = useState(""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [sessions, setSessions] = useState<Record<string, unknown>[] | null>(null),
    [busy, setBusy] = useState(false);
  return (
    <section className="mt-7 space-y-4 border-b border-[var(--border)] pb-7">
      <h2 className="font-display text-xl font-bold">Password and sessions</h2>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await http("/me/password", {
              method: "PUT",
              body: {
                currentPassword,
                password,
                password_confirmation: confirmation,
              },
            });
            setCurrent("");
            setPassword("");
            setConfirmation("");
            toast("Password changed; other sessions signed out");
          } catch (e) {
            toast(errorMessage(e));
          } finally {
            setBusy(false);
          }
        }}
      >
        {[
          ["Current password", currentPassword, setCurrent],
          ["New password", password, setPassword],
          ["Confirm new password", confirmation, setConfirmation],
        ].map(([label, value, setter]) => (
          <Field label={String(label)} key={String(label)}>
            <input
              type="password"
              required
              autoComplete={
                label === "Current password"
                  ? "current-password"
                  : "new-password"
              }
              className={control}
              value={String(value)}
              onChange={(e) =>
                (setter as (value: string) => void)(e.target.value)
              }
            />
          </Field>
        ))}
        <button className={primary} disabled={busy}>
          {busy ? <LoadingDots /> : "Change password"}
        </button>
      </form>
      <button
        className={secondary}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await http<{ data: Record<string, unknown>[] }>(
              "/me/sessions",
            );
            setSessions(result.data);
          } catch (e) {
            toast(errorMessage(e));
          } finally {
            setBusy(false);
          }
        }}
      >
        View active sessions
      </button>
      {sessions?.map((session) => (
        <div
          key={String(session.id)}
          className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-4 text-sm"
        >
          <span>
            {String(session.userAgent || "Browser session")}
            <small className="mt-1 block text-[var(--text-meta)]">
              {String(session.lastActiveAt)}{" "}
              {session.current ? "· Current session" : ""}
            </small>
          </span>
          {!session.current && (
            <button
              className={secondary}
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await http(
                    "/me/sessions/" + encodeURIComponent(String(session.id)),
                    { method: "DELETE" },
                  );
                  setSessions(sessions.filter((x) => x.id !== session.id));
                  toast("Session revoked");
                } catch (e) {
                  toast(errorMessage(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              Revoke
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
