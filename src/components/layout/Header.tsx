import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Wordmark from "../brand/Wordmark";
import UtilityBar from "./UtilityBar";
import { SearchPalette } from "../ui/SearchPalette";
import { useSession } from "@/context/SessionContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useEdition } from "@/context/EditionContext";
import { defaultSiteMenus } from "@/lib/site-settings";
import {
  storyCategories,
  categorySlug,
  videoFormats,
} from "@/lib/editorial-policy";

export default function Header() {
  const { user } = useSession();
  const { edition } = useEdition();
  const MEGA: Record<string, [string, string][]> = {
    Stories: [
      ["All stories", "/stories"],
      ...storyCategories(edition).map((label): [string, string] => [
        label,
        "/stories?category=" + categorySlug(label),
      ]),
    ],
    "The Builder": [
      ["The Builders", "/builders"],
      ["Nominate a Builder", "/nominate"],
      ["Builder of the Month", "/builders?feature=month"],
      ["Submit a Story", "/account?state=submit"],
      ["Diaspora", "/diaspora"],
    ],
    Videos: [
      ["All videos", "/videos"],
      ...videoFormats.map(({ label, value }): [string, string] => [
        label,
        "/videos?format=" + value,
      ]),
    ],
  };
  const settings = useSiteSettings();
  const navigation =
    settings.menus?.map((item) => ({ label: item.label, href: item.url })) ??
    defaultSiteMenus.map((item) => ({ label: item.label, href: item.url }));
  const router = useRouter();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const megaTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!(event.target as Element)?.closest("[data-primary-dropdown]"))
        setMega(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        megaTrigger.current?.focus();
        setMega(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    const trigger = menuButton.current;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !drawer.current) return;
      const focusable = Array.from(
        drawer.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", trapFocus);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", trapFocus);
      trigger?.focus();
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? router.pathname === "/" || router.pathname === "/home"
      : router.pathname.startsWith(href);
  return (
    <>
      <UtilityBar />
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-[var(--surface-card)] transition-[height,box-shadow] duration-small",
          compact || mega
            ? "h-header-compact border-[var(--border)] shadow-sm"
            : "h-header border-transparent",
        )}
      >
        <div className="site-header-inner mx-auto flex h-full max-w-container items-center gap-5 px-4 lg:px-6">
          <Link
            href="/"
            aria-label={`${settings.siteName} home`}
            className="site-wordmark shrink-0"
          >
            <Wordmark />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden h-full min-w-0 flex-1 items-center justify-center gap-3 overflow-hidden xl:flex"
          >
            {navigation.map((item) => {
              const menu =
                (
                  {
                    "/stories": "Stories",
                    "/builders": "The Builder",
                    "/videos": "Videos",
                  } as Record<string, string>
                )[item.href] || null;
              return (
                <div
                  key={item.href}
                  className="flex h-full items-center"
                  data-primary-dropdown={menu || undefined}
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                      )
                    )
                      setMega(null);
                  }}
                >
                  {menu ? (
                    <button
                      type="button"
                      aria-current={isActive(item.href) ? "page" : undefined}
                      aria-expanded={menu ? mega === menu : undefined}
                      aria-controls={"primary-" + menu.replaceAll(" ", "-")}
                      onClick={(event) => {
                        megaTrigger.current = event.currentTarget;
                        setMega(mega === menu ? null : menu);
                      }}
                      className={cn(
                        "group/nav relative flex h-11 items-center gap-1 whitespace-nowrap px-0.5 font-ui text-[13.5px] font-medium text-[var(--text-heading)]",
                        isActive(item.href) && "font-semibold",
                      )}
                    >
                      {item.label}
                      {menu && (
                        <ChevronDown
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 bottom-1.5 h-0.5 origin-left bg-[var(--accent)] transition-transform duration-small group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100",
                          isActive(item.href) ||
                            (menu !== null && mega === menu)
                            ? "scale-x-100"
                            : "scale-x-0",
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="flex min-h-11 items-center whitespace-nowrap text-[13.5px] font-medium text-[var(--text-heading)]"
                    >
                      {item.label}
                    </Link>
                  )}
                  {menu && mega === menu && (
                    <div
                      id={"primary-" + menu.replaceAll(" ", "-")}
                      aria-label={`${menu} sections`}
                      className="absolute inset-x-0 top-full border-b border-[var(--border)] bg-[var(--surface-card)] shadow-overlay"
                    >
                      <div className="mx-auto grid max-w-container grid-cols-2 gap-x-8 gap-y-1 px-6 py-7">
                        {MEGA[menu]!.map(([label, href]) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMega(null)}
                            className="min-h-11 rounded-md px-3 py-2 text-[15px] font-medium text-[var(--text-heading)] hover:bg-[var(--surface-tint)]"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              aria-keyshortcuts="Control+K Meta+K"
              className="tb-control hidden items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-heading)] hover:bg-[var(--surface-tint)] md:flex"
            >
              <Search aria-hidden="true" className="h-[18px] w-[18px]" />
            </button>
            <Link
              href="/newsletter"
              className="hidden h-10 items-center rounded-md bg-[var(--accent)] px-4 text-[15px] font-semibold text-[var(--text-on-inverse)] hover:bg-[var(--accent-hover)] md:flex"
            >
              Subscribe
            </Link>
            <Link
              href={user ? "/account" : "/signin"}
              className="hidden h-10 items-center rounded-md px-3 text-[15px] font-semibold text-[var(--text-heading)] hover:bg-[var(--surface-tint)] md:flex"
            >
              {user ? "My account" : "Sign in"}
            </Link>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="tb-control flex items-center justify-center text-[var(--text-heading)] xl:hidden"
            >
              <Menu aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[var(--overlay)] backdrop-blur-[6px]"
          role="presentation"
          onMouseDown={(event) =>
            event.currentTarget === event.target && setMenuOpen(false)
          }
        >
          <div
            ref={drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="site-mobile-drawer flex h-full w-[min(86%,390px)] flex-col overflow-y-auto bg-[var(--surface-card)] p-6 shadow-overlay"
          >
            <div className="mb-8 flex items-center justify-between">
              <Wordmark />
              <button
                ref={closeButton}
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="tb-control flex items-center justify-center rounded-md text-[var(--text-heading)]"
              >
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {navigation.map((item) => {
                const menu = (
                  {
                    "/stories": "Stories",
                    "/builders": "The Builder",
                    "/videos": "Videos",
                  } as Record<string, string>
                )[item.href];
                return menu ? (
                  <details
                    key={item.href}
                    className="rounded-md px-3 text-[var(--text-heading)]"
                  >
                    <summary className="min-h-11 cursor-pointer py-2 font-display text-lg font-bold">
                      {item.label}
                    </summary>
                    <div className="grid border-l border-[var(--border)] pl-4">
                      {MEGA[menu]!.map(([label, href]) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className="flex min-h-11 items-center text-sm"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center rounded-md px-3 font-display text-lg font-bold text-[var(--text-heading)] hover:bg-[var(--surface-tint)]",
                      isActive(item.href) && "text-[var(--text-accent)]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto grid gap-3 pt-8">
              <Link
                href={user ? "/account" : "/signin"}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-md border border-[var(--border)] font-semibold text-[var(--text-heading)]"
              >
                {user ? "My account" : "Sign in"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="min-h-11 rounded-md bg-[var(--surface-tint)] font-semibold text-[var(--text-heading)]"
              >
                Search
              </button>
              <Link
                href="/newsletter"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-md bg-[var(--accent)] font-semibold text-[var(--text-on-inverse)]"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      )}
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
