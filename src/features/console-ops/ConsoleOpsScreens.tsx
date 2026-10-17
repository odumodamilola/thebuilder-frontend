import { YouTubeControls } from "./YouTubeControls";
import { videoFormats } from "@/lib/editorial-policy";
import { SiteConfigurationForm } from "./SiteConfigurationForm";
import Link from "next/link";
import {
  useConsoleData,
  text,
  type ConsoleRecord,
} from "@/context/ConsoleDataContext";
import { useToast } from "@/context/ToastContext";
import { http, errorMessage, type ApiEnvelope } from "@/lib/http";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ConsoleLayout } from "@/components/layout/ConsoleLayout";
import { Icon } from "@/components/ui/Icon";

const button =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal";
const primary = `${button} bg-navy-900 text-white hover:bg-navy-700`;
const secondary = `${button} border border-line bg-white text-navy-900 hover:bg-navy-50`;
const input =
  "min-h-10 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-royal focus:ring-2 focus:ring-royal/20";

function Shell({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <ConsoleLayout>
      <div className="mx-auto max-w-[1180px] space-y-6">
        <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[.12em] text-brand-red">
              {eyebrow}
            </p>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-[32px]">
              {title}
            </h1>
          </div>
          {action}
        </header>
        {children}
      </div>
    </ConsoleLayout>
  );
}

const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section className={`rounded-lg border border-line bg-white ${className}`}>
    {children}
  </section>
);
const Toolbar = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
    {children}
  </div>
);
const Pill = ({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "green" | "red" | "amber" | "blue";
}) => {
  const tones = {
    slate: "bg-navy-50 text-slate",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-800",
    blue: "bg-blue-50 text-blue-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const files: Array<[string, string, string]> = [
  ["lagos-fintech.jpg", "2400 × 1600", "3.2 MB"],
  ["amara-okafor.jpg", "1600 × 2000", "1.8 MB"],
  ["solar-grid.jpg", "2200 × 1467", "2.6 MB"],
  ["founders-room.jpg", "1920 × 1280", "2.1 MB"],
  ["africa-map.svg", "1200 × 800", "148 KB"],
  ["builder-mark.png", "900 × 900", "680 KB"],
];
export function MediaScreen() {
  const live = useConsoleData();
  const { toast } = useToast();
  const [selected, setSelected] = useState(live?.records[0]?.id || ""),
    [query, setQuery] = useState(""),
    [alt, setAlt] = useState(text(live?.records[0], "alt")),
    [credit, setCredit] = useState(text(live?.records[0], "credit")),
    [file, setFile] = useState<File | null>(null),
    [busy, setBusy] = useState(false);
  const records = (live?.records || []).filter((x) =>
    text(x, "alt").toLowerCase().includes(query.toLowerCase()),
  );
  const item = records.find((x) => x.id === selected);
  async function save() {
    setBusy(true);
    try {
      if (file) {
        const body = new FormData();
        body.append("file", file);
        body.append("alt", alt);
        body.append("credit", credit);
        await http("/console/media", { method: "POST", body });
      } else if (item)
        await http("/console/media/" + item.id, {
          method: "PATCH",
          body: { alt, credit },
        });
      toast("Media saved");
      setFile(null);
      live?.retry();
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell
      eyebrow="Asset management"
      title="Media library"
      action={
        <label className={primary}>
          <Icon name="upload" className="h-4 w-4" />
          Upload image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      }
    >
      <Card>
        <Toolbar>
          <input
            aria-label="Search media"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media…"
            className={input + " w-full"}
          />
        </Toolbar>
        <div className="grid lg:grid-cols-[1fr_310px]">
          <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
            {records.map((x) => (
              <button
                key={x.id}
                onClick={() => {
                  setSelected(x.id || "");
                  setAlt(text(x, "alt"));
                  setCredit(text(x, "credit"));
                  setFile(null);
                }}
                className="overflow-hidden rounded-lg border border-line text-left"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-navy-50 to-slate-300/40 p-3">
                  <img
                    src={text(x, "url")}
                    alt={text(x, "alt")}
                    className="size-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <strong className="block truncate text-sm text-ink">
                    {text(x, "alt")}
                  </strong>
                  <span className="text-xs text-slate">
                    {Number(x.size || 0).toLocaleString()} bytes
                  </span>
                </div>
              </button>
            ))}
          </div>
          <aside className="border-t border-line p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate">
              File details
            </p>
            <h2 className="mt-4 font-semibold text-ink">
              {file?.name || text(item, "path")}
            </h2>
            <label className="mt-5 block text-xs font-semibold text-slate">
              Alt text
              <textarea
                className={input + " mt-2 min-h-24 w-full py-2"}
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-xs font-semibold text-slate">
              Credit
              <input
                className={input + " mt-2 w-full"}
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
              />
            </label>
            <button
              className={primary + " mt-3 w-full"}
              disabled={busy || !alt || (!file && !item)}
              onClick={save}
            >
              {busy ? <LoadingDots /> : file ? "Upload image" : "Save details"}
            </button>
            {item && !file && (
              <button
                className={secondary + " mt-3 w-full"}
                disabled={busy}
                onClick={async () => {
                  if (!window.confirm("Delete this unused image?")) return;
                  setBusy(true);
                  try {
                    await http("/console/media/" + item.id, {
                      method: "DELETE",
                    });
                    toast("Media deleted");
                    live?.retry();
                  } catch (e) {
                    toast(errorMessage(e));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Delete image
              </button>
            )}
          </aside>
        </div>
      </Card>
    </Shell>
  );
}

export function TaxonomyScreen() {
  const live = useConsoleData();
  const { toast } = useToast();
  const router = useRouter();
  const kind = router.query.kind === "tags" ? "tags" : "categories";
  const [name, setName] = useState(""),
    [slug, setSlug] = useState(""),
    [id, setId] = useState(""),
    [parent, setParent] = useState(""),
    [description, setDescription] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const reset = () => {
    setId("");
    setName("");
    setSlug("");
    setParent("");
    setDescription("");
    setError("");
  };
  const list = (
    Array.isArray(live?.document[kind]) ? live!.document[kind] : []
  ) as ConsoleRecord[];
  return (
    <Shell eyebrow="Classification" title="Taxonomy">
      <div className="flex gap-2">
        {(["categories", "tags"] as const).map((x) => (
          <button
            key={x}
            className={secondary}
            disabled={busy}
            aria-pressed={kind === x}
            onClick={() => {
              reset();
              void router.push(
                { pathname: router.pathname, query: { kind: x } },
                undefined,
                { shallow: true },
              );
            }}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="min-w-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-4">Name</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id} className="border-t border-line">
                  <td className="p-4">{x.name}</td>
                  <td>{text(x, "slug")}</td>
                  <td>
                    <button
                      className={button}
                      onClick={() => {
                        setId(x.id || "");
                        setName(text(x, "name"));
                        setSlug(text(x, "slug"));
                        setParent(text(x, "parent_id"));
                        setDescription(text(x, "description"));
                        setError("");
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-slate">
                    No {kind} yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">
            {id ? "Edit" : "Add"} {kind === "categories" ? "category" : "tag"}
          </h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setBusy(true);
              try {
                await http("/console/taxonomy/" + kind, {
                  method: "PUT",
                  body: {
                    id: id || undefined,
                    name,
                    slug,
                    ...(kind === "categories"
                      ? {
                          parent_id: parent || null,
                          description: description || null,
                        }
                      : {}),
                  },
                });
                toast("Taxonomy saved");
                reset();
                live?.retry();
              } catch (e) {
                setError(errorMessage(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            {error && (
              <p role="alert" className="text-sm text-brand-red">
                {error}
              </p>
            )}
            <label className="block text-sm font-semibold">
              Name
              <input
                required
                maxLength={120}
                className={input + " mt-2 w-full"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Slug
              <input
                required
                maxLength={120}
                pattern={"[a-zA-Z0-9_\\-]+"}
                className={input + " mt-2 w-full"}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </label>
            {kind === "categories" && (
              <>
                <label className="block text-sm font-semibold">
                  Parent category
                  <select
                    className={input + " mt-2 w-full"}
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                  >
                    <option value="">No parent</option>
                    {list
                      .filter((category) => category.id !== id)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold">
                  Description
                  <textarea
                    className={input + " mt-2 w-full py-3"}
                    rows={4}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </>
            )}
            <button className={primary} disabled={busy}>
              {busy ? <LoadingDots /> : "Save"}
            </button>
            {id && (
              <button
                type="button"
                className={secondary}
                disabled={busy}
                onClick={reset}
              >
                Cancel edit
              </button>
            )}
          </form>
        </Card>
      </div>
    </Shell>
  );
}

export function AuditScreen() {
  const live = useConsoleData();
  return (
    <Shell eyebrow="Governance" title="Audit log">
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr>
                {["Actor", "Action", "Resource", "Time"].map((x) => (
                  <th className="p-4" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {live?.records.map((x) => (
                <tr key={x.id} className="border-t border-line">
                  <td className="p-4">{text(x, "actor_id") || "System"}</td>
                  <td>{text(x, "event")}</td>
                  <td>
                    {text(x, "subject_type")} {text(x, "subject_id")}
                  </td>
                  <td>{text(x, "created_at")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}

export function AnalyticsScreen() {
  const live = useConsoleData();
  const records = (
    Array.isArray(live?.document.articles) ? live!.document.articles : []
  ) as ConsoleRecord[];
  return (
    <Shell eyebrow="Reporting" title="Analytics">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Page views", live?.document.views],
          ["Shares", live?.document.shares],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-5">
            <p className="text-sm text-slate">{String(label)} · last 30 days</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-navy-900">
              {Number(value || 0).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-4">Article</th>
              <th>All-time views</th>
            </tr>
          </thead>
          <tbody>
            {records.map((x) => (
              <tr key={x.id} className="border-t border-line">
                <td className="p-4">{x.title}</td>
                <td>{Number(x.view_count || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}

export function SubmissionsScreen() {
  const live = useConsoleData();
  const { toast } = useToast();
  const [selected, setSelected] = useState(live?.records[0]?.id || ""),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false);
  const item = live?.records.find((x) => x.id === selected);
  async function move(status: string) {
    if (!item) return;
    setBusy(true);
    try {
      await http("/console/submissions/" + item.id, {
        method: "PATCH",
        body: { status, note: note || undefined },
      });
      toast("Submission updated");
      live?.retry();
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell eyebrow="Community inbox" title="Submissions">
      <Card>
        <div className="grid lg:grid-cols-[360px_1fr]">
          <div className="border-b border-line lg:border-b-0 lg:border-r">
            {live?.records.map((x) => (
              <button
                className="block w-full border-b border-line p-4 text-left"
                key={x.id}
                onClick={() => setSelected(x.id || "")}
              >
                <strong className="block text-sm">{x.title}</strong>
                <small className="text-slate">
                  {text(x, "reference")} · {x.status}
                </small>
              </button>
            ))}
          </div>
          <div className="p-6">
            {item ? (
              <>
                <Pill>{item.status}</Pill>
                <h2 className="mt-4 font-display text-2xl font-bold text-navy-900">
                  {item.title}
                </h2>
                <p className="mt-4 whitespace-pre-line font-serif text-lg leading-8">
                  {text(item, "pitch")}
                </p>
                <label className="mt-5 block text-sm font-semibold">
                  Review note
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={input + " mt-2 min-h-24 w-full"}
                  />
                </label>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className={secondary}
                    disabled={busy}
                    onClick={() => move("review")}
                  >
                    Review
                  </button>
                  <button
                    className={primary}
                    disabled={busy}
                    onClick={() => move("accepted")}
                  >
                    Accept and create draft
                  </button>
                  <button
                    className={secondary}
                    disabled={busy || !note}
                    onClick={() => move("declined")}
                  >
                    Decline
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate">No submissions here yet.</p>
            )}
          </div>
        </div>
      </Card>
    </Shell>
  );
}

export function AdsScreen() {
  const live = useConsoleData();
  const { toast } = useToast();
  const [editing, setEditing] = useState<ConsoleRecord | null>(null),
    [busy, setBusy] = useState(false);
  return (
    <Shell
      eyebrow="Commercial"
      title="Ads & campaigns"
      action={
        <button
          className={primary}
          onClick={() =>
            setEditing({
              name: "",
              advertiser: "",
              placement: "home_top",
              target_url: "",
              starts_at: "",
              ends_at: "",
              status: "draft",
            })
          }
        >
          New campaign
        </button>
      }
    >
      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {[
                "Campaign",
                "Advertiser",
                "Status",
                "Impressions",
                "Clicks",
              ].map((x) => (
                <th key={x} className="p-4">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {live?.records.map((x) => (
              <tr key={x.id} className="border-t border-line">
                <td className="p-4">
                  <button onClick={() => setEditing(x)}>{x.name}</button>
                </td>
                <td>{text(x, "advertiser")}</td>
                <td>{x.status}</td>
                <td>{text(x, "impressions")}</td>
                <td>{text(x, "clicks")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {editing && (
        <Card className="p-5">
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await http("/console/ads", { method: "PUT", body: editing });
                toast("Campaign saved");
                setEditing(null);
                live?.retry();
              } catch (e) {
                toast(errorMessage(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            {["name", "advertiser", "target_url", "starts_at", "ends_at"].map(
              (key) => (
                <label key={key} className="text-sm font-semibold">
                  {key.replaceAll("_", " ")}
                  <input
                    required
                    type={
                      key.endsWith("_at")
                        ? "datetime-local"
                        : key === "target_url"
                          ? "url"
                          : "text"
                    }
                    value={text(editing, key).slice(
                      0,
                      key.endsWith("_at") ? 16 : undefined,
                    )}
                    onChange={(e) =>
                      setEditing({ ...editing, [key]: e.target.value })
                    }
                    className={input + " mt-2 w-full"}
                  />
                </label>
              ),
            )}
            <label className="text-sm font-semibold">
              Placement
              <select
                className={input + " mt-2 w-full"}
                value={text(editing, "placement")}
                onChange={(e) =>
                  setEditing({ ...editing, placement: e.target.value })
                }
              >
                {[
                  "home_top",
                  "article_inline",
                  "category_side",
                  "directory_top",
                  "newsletter",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Status
              <select
                className={input + " mt-2 w-full"}
                value={text(editing, "status")}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
              >
                {["draft", "active", "paused", "ended"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end gap-3">
              <button className={primary} disabled={busy}>
                {busy ? <LoadingDots /> : "Save campaign"}
              </button>
              <button
                type="button"
                className={secondary}
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}
    </Shell>
  );
}

export function UsersScreen() {
  const live = useConsoleData();
  const { toast } = useToast();
  const [busy, setBusy] = useState("");
  const availableRoles = [
    "registered_user",
    "content_editor",
    "editor_in_chief",
    "admin",
  ];
  async function update(user: ConsoleRecord, body: Record<string, unknown>) {
    setBusy(user.id || "");
    try {
      await http("/console/users/" + user.id, { method: "PATCH", body });
      toast("User updated");
      live?.retry();
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setBusy("");
    }
  }
  return (
    <Shell eyebrow="Access control" title="Users & roles">
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr>
                {["User", "Email", "Role", "Status"].map((x) => (
                  <th className="p-4" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {live?.records.map((x) => (
                <tr className="border-t border-line" key={x.id}>
                  <td className="p-4">{x.name}</td>
                  <td>{text(x, "email")}</td>
                  <td>
                    <select
                      className={input}
                      disabled={busy === x.id}
                      value={
                        Array.isArray(x.roles)
                          ? String(
                              (x.roles[0] as Record<string, unknown>)?.name ||
                                "registered_user",
                            )
                          : "registered_user"
                      }
                      onChange={(e) => update(x, { roles: [e.target.value] })}
                    >
                      {availableRoles.map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className={input}
                      disabled={busy === x.id}
                      value={x.status}
                      onChange={(e) => update(x, { status: e.target.value })}
                    >
                      {["active", "suspended", "deactivated"].map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}

export function SettingsScreen() {
  const [tab, setTab] = useState("General");
  return (
    <Shell eyebrow="Workspace" title="Settings">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Settings sections">
          <ul className="space-y-1">
            {["General", "Navigation", "Social", "Integrations"].map((x) => (
              <li key={x}>
                <button
                  className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold"
                  onClick={() => setTab(x)}
                >
                  {x}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <Card className="p-6">
          {tab !== "Integrations" ? (
            <SiteConfigurationForm key={tab} section={tab} />
          ) : (
            <YouTubeControls />
          )}
        </Card>
      </div>
    </Shell>
  );
}

export function ConsoleStatesScreen() {
  const router = useRouter();
  const state = String(router.query.state || "denied");
  const cfg = useMemo(
    () =>
      (
        ({
          denied: [
            "shield-x",
            "Permission denied",
            "You do not have access to this area. Ask an administrator to update your role.",
            "Back to dashboard",
          ],
          session: [
            "clock-3",
            "Your session is expiring",
            "For your security, you’ll be signed out in 02:00. Continue working to keep your session active.",
            "Continue session",
          ],
          unsaved: [
            "triangle-alert",
            "Unsaved changes",
            "You have changes that haven’t been saved. Leaving now will discard them.",
            "Keep editing",
          ],
          rollback: [
            "rotate-ccw",
            "Save failed — changes rolled back",
            "We could not save your update, so the last stable version has been restored.",
            "Try again",
          ],
        }) as const
      )[state] ?? [
        "triangle-alert",
        "Something went wrong",
        "Return to the console and try again.",
        "Back to dashboard",
      ],
    [state],
  );
  return (
    <Shell eyebrow="Console state" title="Recovery & safeguards">
      <div className="mx-auto max-w-xl py-16">
        <Card className="p-7 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-brand-red">
            <Icon name={cfg[0]} className="h-7 w-7" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold text-navy-900">
            {cfg[1]}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate">
            {cfg[2]}
          </p>
          <div className="mt-7 flex flex-col-reverse justify-center gap-2 sm:flex-row">
            <button
              className={secondary}
              onClick={() => router.push("/console")}
            >
              Cancel
            </button>
            <button className={primary} onClick={() => router.push("/console")}>
              {cfg[3]}
            </button>
          </div>
        </Card>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
          {["denied", "session", "unsaved", "rollback"].map((x) => (
            <button
              key={x}
              onClick={() => router.replace(`/console/states?state=${x}`)}
              className="rounded-full border border-line bg-white px-3 py-1.5 font-semibold text-slate"
            >
              {x}
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function OpportunitiesEditorScreen() {
  const live = useConsoleData();
  const { toast } = useToast();
  const [item, setItem] = useState<ConsoleRecord | null>(null),
    [busy, setBusy] = useState(false);
  const blank = {
    title: "",
    organisation: "",
    type: "grant",
    location: "",
    region: "",
    description: "",
    eligibility: "",
    apply_url: "",
    deadline: "",
    edition: "both",
    status: "draft",
    remote: false,
  };
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!item) return;
    setBusy(true);
    try {
      await http("/console/opportunities" + (item.id ? "/" + item.id : ""), {
        method: item.id ? "PUT" : "POST",
        body: {
          title: item.title,
          slug: item.slug || undefined,
          organisation: item.organisation,
          type: item.type,
          location: item.location,
          region: item.region || null,
          description: item.description,
          eligibility: item.eligibility || null,
          applyUrl: item.apply_url,
          deadline: item.deadline || null,
          edition: item.edition,
          status: item.status,
          remote: item.remote,
        },
      });
      toast("Opportunity saved");
      setItem(null);
      live?.retry();
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell
      eyebrow="Discovery"
      title="Opportunities"
      action={
        <button className={primary} onClick={() => setItem(blank)}>
          New opportunity
        </button>
      }
    >
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {["Title", "Organisation", "Deadline", "Status"].map((x) => (
                  <th key={x} className="p-4">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {live?.records.map((x) => (
                <tr className="border-t border-line" key={x.id}>
                  <td className="p-4">
                    <button onClick={() => setItem(x)}>{x.title}</button>
                  </td>
                  <td>{text(x, "organisation")}</td>
                  <td>{text(x, "deadline").slice(0, 10) || "Rolling"}</td>
                  <td>{x.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {item && (
        <Card className="p-6">
          <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
            {[
              ["Title", "title"],
              ["Organisation", "organisation"],
              ["Location", "location"],
              ["Region", "region"],
              ["Application URL", "apply_url"],
              ["Deadline", "deadline"],
            ].map(([label, key]) => (
              <label key={key} className="text-sm font-semibold">
                {label}
                <input
                  required={[
                    "title",
                    "organisation",
                    "location",
                    "apply_url",
                  ].includes(key!)}
                  type={
                    key === "deadline"
                      ? "date"
                      : key === "apply_url"
                        ? "url"
                        : "text"
                  }
                  className={input + " mt-2 w-full"}
                  value={text(item, key!).slice(
                    0,
                    key === "deadline" ? 10 : undefined,
                  )}
                  onChange={(e) => setItem({ ...item, [key!]: e.target.value })}
                />
              </label>
            ))}
            {[
              ["Type", "type", ["job", "grant", "fellowship", "accelerator"]],
              ["Edition", "edition", ["both", "Nigeria", "Australia"]],
              ["Status", "status", ["draft", "published", "archived"]],
            ].map(([label, key, choices]) => (
              <label key={String(key)} className="text-sm font-semibold">
                {String(label)}
                <select
                  className={input + " mt-2 w-full"}
                  value={text(item, String(key))}
                  onChange={(e) =>
                    setItem({ ...item, [String(key)]: e.target.value })
                  }
                >
                  {(choices as string[]).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            ))}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(item.remote)}
                onChange={(e) => setItem({ ...item, remote: e.target.checked })}
              />
              Remote
            </label>
            {[
              ["Description", "description"],
              ["Eligibility", "eligibility"],
            ].map(([label, key]) => (
              <label key={key} className="text-sm font-semibold md:col-span-2">
                {label}
                <textarea
                  required={key === "description"}
                  className={input + " mt-2 min-h-32 w-full py-3"}
                  value={text(item, key!)}
                  onChange={(e) => setItem({ ...item, [key!]: e.target.value })}
                />
              </label>
            ))}
            <div className="flex gap-3">
              <button className={primary} disabled={busy}>
                {busy ? <LoadingDots /> : "Save opportunity"}
              </button>
              <button
                className={secondary}
                type="button"
                onClick={() => setItem(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}
    </Shell>
  );
}

export function VideoManagementScreen() {
  const live = useConsoleData();
  const { toast } = useToast();
  const [item, setItem] = useState<ConsoleRecord | null>(null),
    [busy, setBusy] = useState(false);
  return (
    <Shell
      title="Videos"
      eyebrow="YouTube editorial review"
      action={
        <a href="#youtube-channels" className={secondary}>
          Channel controls
        </a>
      }
    >
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {["Video", "Availability", "Status"].map((label) => (
                  <th key={label} className="p-4">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {live?.records.map((video) => (
                <tr key={video.id} className="border-t border-line">
                  <td className="p-4">
                    <button onClick={() => setItem(video)}>
                      {text(video, "title") || text(video, "provider_title")}
                    </button>
                  </td>
                  <td>
                    {video.available && video.embeddable
                      ? "Public and embeddable"
                      : "Unavailable"}
                  </td>
                  <td>{video.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {live?.records.length === 0 && (
            <p className="p-6 text-sm text-slate">
              No videos imported yet. Configure the official channel to begin.
            </p>
          )}
        </div>
      </Card>
      <YouTubeControls />
      {item && (
        <Card className="p-6">
          <form
            className="space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              try {
                await http("/console/videos/" + item.id, {
                  method: "PATCH",
                  body: {
                    title: item.title || null,
                    description: item.description || null,
                    format: item.format || null,
                    status: item.status,
                    featured: Boolean(item.featured),
                  },
                });
                toast("Video saved");
                setItem(null);
                live?.retry();
              } catch (error) {
                toast(errorMessage(error), "error");
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="block text-sm font-semibold">
              Video format
              <select
                className={input + " mt-2 w-full"}
                value={text(item, "format")}
                onChange={(event) =>
                  setItem({ ...item, format: event.target.value })
                }
              >
                <option value="">Unclassified</option>
                {videoFormats.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Editorial title
              <input
                className={input + " mt-2 w-full"}
                value={text(item, "title")}
                onChange={(event) =>
                  setItem({ ...item, title: event.target.value })
                }
                placeholder={text(item, "provider_title")}
              />
            </label>
            <label className="block text-sm font-semibold">
              Editorial description
              <textarea
                className={input + " mt-2 min-h-32 w-full py-3"}
                value={text(item, "description")}
                onChange={(event) =>
                  setItem({ ...item, description: event.target.value })
                }
              />
            </label>
            <label className="block text-sm font-semibold">
              Status
              <select
                className={input + " mt-2 w-full"}
                value={item.status}
                onChange={(event) =>
                  setItem({ ...item, status: event.target.value })
                }
              >
                {["imported", "published", "archived"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="flex gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(item.featured)}
                onChange={(event) =>
                  setItem({ ...item, featured: event.target.checked })
                }
              />
              Feature this video
            </label>
            <p className="text-sm text-slate">
              Provider metadata is retained separately. Private, deleted and
              non-embeddable videos cannot appear publicly.
            </p>
            <div className="flex gap-3">
              <button className={primary} disabled={busy}>
                {busy ? <LoadingDots /> : "Save video"}
              </button>
              <button
                className={secondary}
                type="button"
                onClick={() => setItem(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}
    </Shell>
  );
}
