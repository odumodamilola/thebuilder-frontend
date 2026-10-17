// Workspace-only control; the console keeps its approved fixed palette.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Search, ArrowRight } from "lucide-react";
import { useSession } from "@/context/SessionContext";
const scopes = [
  { label: "Content", path: "/console/content", permission: "content.read" },
  {
    label: "Builders",
    path: "/console/builders",
    permission: "profiles.manage",
  },
  {
    label: "Startups",
    path: "/console/startups",
    permission: "profiles.manage",
  },
  { label: "Users", path: "/console/users", permission: "users.manage" },
];
export function ConsoleSearch({ className }: { className: string }) {
  const { user } = useSession();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const options = scopes.filter((scope) =>
    user?.permissions.includes(scope.permission),
  );
  const [scope, setScope] = useState(
    options.find((scope) => scope.path === router.pathname)?.path ||
      options[0]?.path ||
      "/console/content",
  );
  const [query, setQuery] = useState(String(router.query.q || ""));
  useEffect(() => {
    const focus = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k" &&
        input.current?.offsetParent
      ) {
        event.preventDefault();
        input.current.focus();
        input.current.select();
      }
    };
    document.addEventListener("keydown", focus);
    return () => document.removeEventListener("keydown", focus);
  }, []);
  if (!options.length) return null;
  return (
    <form
      role="search"
      aria-label="Search workspace"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        void router.push({
          pathname: scope,
          query: query.trim() ? { q: query.trim() } : {},
        });
      }}
    >
      <Search size={16} aria-hidden="true" />
      <select
        aria-label="Search in"
        className="min-w-0 bg-transparent text-xs text-ink outline-none"
        value={scope}
        onChange={(event) => setScope(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.path} value={option.path}>
            {option.label}
          </option>
        ))}
      </select>
      <input
        ref={input}
        aria-label="Search workspace"
        placeholder="Search…"
        maxLength={200}
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        type="submit"
        aria-label="Run workspace search"
        className="grid size-8 shrink-0 place-items-center"
      >
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
