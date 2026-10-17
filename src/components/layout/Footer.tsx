import Link from "next/link";
import Wordmark from "../brand/Wordmark";
import NewsletterForm from "../ui/NewsletterForm";
import { SocialLinks } from "../ui/SocialLinks";
import { ManageCookiesButton } from "../ui/CookieConsent";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useEdition } from "@/context/EditionContext";
import { footerForEdition } from "@/lib/site-settings";

const columns: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "Explore",
    links: [
      ["Stories", "/stories"],
      ["Startups", "/startups"],
      ["Diaspora", "/diaspora"],
      ["Industries", "/industries"],
      ["Videos", "/videos"],
      ["Opportunities", "/opportunities"],
    ],
  },
  {
    title: "Builders",
    links: [
      ["The Builders", "/builders"],
      ["Nominate a Builder", "/nominate"],
      ["Builder of the Month", "/builders?feature=month"],
      ["Submit a story", "/account?state=submit"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Editorial standards", "/about#standards"],
      ["Advertise with us", "/about#advertise"],
      ["Contact", "/about#contact"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "/terms"],
      ["Privacy", "/privacy"],
      ["Cookie notice", "/cookies"],
      ["Sponsored content policy", "/sponsored-content-policy"],
    ],
  },
];

export default function Footer() {
  const settings = useSiteSettings();
  const { edition } = useEdition();
  return (
    <footer className="bg-[var(--surface-inverse-deep)] px-4 py-16 text-[var(--text-on-inverse)] md:px-6 md:py-20">
      <div className="mx-auto grid grid-cols-1 max-w-container gap-12 md:grid-cols-2 lg:grid-cols-[1.55fr_repeat(4,1fr)] lg:gap-10">
        <div>
          <Wordmark inverse />
          <p className="mt-6 max-w-[360px] text-sm leading-6 text-[var(--text-meta-on-inverse)]">
            {settings.description}
          </p>
          <p className="text-sm leading-6 text-[var(--text-meta-on-inverse)]">
            Innovate · Connect · Grow.
          </p>
          {settings.contactEmail && (
            <a
              className="mt-3 inline-block text-sm text-[var(--text-meta-on-inverse)] hover:text-[var(--text-on-inverse)]"
              href={"mailto:" + encodeURIComponent(settings.contactEmail)}
            >
              {settings.contactEmail}
            </a>
          )}
          <p className="mb-3 mt-8 text-sm font-semibold text-[var(--text-on-inverse)]">
            The Builder Newsletter
          </p>
          <NewsletterForm />
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[.08em] text-[var(--text-on-inverse)]">
              {column.title}
            </h2>
            <ul className="space-y-3 text-sm text-[var(--text-meta-on-inverse)]">
              {column.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-[var(--text-on-inverse)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {column.title === "Legal" && (
                <li>
                  <ManageCookiesButton className="hover:text-[var(--text-on-inverse)]" />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-container flex-col gap-6 border-t border-[var(--border-inverse)] pt-8 text-xs text-[var(--text-meta-on-inverse)] md:flex-row md:items-center md:justify-between">
        <p className="whitespace-pre-line">
          {footerForEdition(settings, edition)}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {(["Nigeria", "Australia"] as const).map((name) => (
            <span
              key={name}
              className={
                name === edition
                  ? "rounded-full border border-[var(--border-inverse)] px-3 py-1 text-[var(--text-on-inverse)]"
                  : "px-2 py-1"
              }
            >
              {name}
            </span>
          ))}
          <span className="mx-1 h-6 w-px bg-[color:color-mix(in_srgb,var(--text-on-inverse)_15%,transparent)]" />
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
