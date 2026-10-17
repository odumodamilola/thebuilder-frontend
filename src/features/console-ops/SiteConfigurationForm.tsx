import { useState, type FormEvent } from "react";
import { useConsoleData } from "@/context/ConsoleDataContext";
import { useToast } from "@/context/ToastContext";
import {
  http,
  HttpError,
  errorMessage,
  type ApiEnvelope,
  type ApiValidationError,
} from "@/lib/http";
import {
  defaultSiteMenus,
  normalizeSiteSettings,
  footerForEdition,
  socialPlatforms,
  type SiteMenu,
} from "@/lib/site-settings";
import { LoadingDots } from "@/components/ui/LoadingDots";

const input =
  "mt-2 min-h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20";
const button =
  "min-h-10 rounded-md border border-line px-4 text-sm font-semibold disabled:opacity-50";
export function SiteConfigurationForm({ section }: { section: string }) {
  const live = useConsoleData();
  const { toast } = useToast();
  const initial = normalizeSiteSettings(live?.document);
  const [general, setGeneral] = useState({
    siteName: initial.siteName,
    description: initial.description,
    contactEmail: initial.contactEmail,
    footerNigeria: footerForEdition(initial, "Nigeria"),
    footerAustralia: footerForEdition(initial, "Australia"),
  });
  const [social, setSocial] = useState(initial.socialLinks);
  const [custom, setCustom] = useState(initial.menus !== undefined);
  const [menus, setMenus] = useState<SiteMenu[]>(
    initial.menus ?? defaultSiteMenus,
  );
  const [busy, setBusy] = useState(false),
    [errors, setErrors] = useState<Record<string, string[]>>({});
  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    const body =
      section === "General"
        ? { ...general, contactEmail: general.contactEmail || null }
        : section === "Social"
          ? {
              socialLinks: Object.fromEntries(
                Object.entries(social).filter(([, url]) => url?.trim()),
              ),
            }
          : { menus: custom ? menus : null };
    try {
      await http<ApiEnvelope<unknown>>("/console/settings", {
        method: "PUT",
        body,
      });
      window.dispatchEvent(new Event("tb-settings-changed"));
      toast("Settings saved");
      live?.retry();
    } catch (error) {
      if (error instanceof HttpError)
        setErrors((error.body as ApiValidationError)?.errors || {});
      toast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }
  function reorder(index: number, direction: number) {
    setMenus((items) => {
      const next = [...items];
      [next[index], next[index + direction]] = [
        next[index + direction]!,
        next[index]!,
      ];
      return next;
    });
  }
  return (
    <form className="space-y-5" onSubmit={save}>
      <h2 className="font-display text-xl font-bold">
        {section === "Social"
          ? "Social profiles"
          : section === "Navigation"
            ? "Primary navigation"
            : "Publication settings"}
      </h2>
      {section === "General" && (
        <>
          {[
            ["Publication name", "siteName"],
            ["Support email", "contactEmail"],
            ["Description", "description"],
            ["Nigeria footer attribution", "footerNigeria"],
            ["Australia footer attribution", "footerAustralia"],
          ].map(([label, key]) => (
            <label key={key} className="block text-sm font-semibold">
              {label}
              {key === "description" || key?.startsWith("footer") ? (
                <textarea
                  className={input + " min-h-24 py-3"}
                  maxLength={key?.startsWith("footer") ? 2000 : 500}
                  value={general[key as keyof typeof general]}
                  onChange={(event) =>
                    setGeneral({ ...general, [key!]: event.target.value })
                  }
                />
              ) : (
                <input
                  className={input}
                  type={key === "contactEmail" ? "email" : "text"}
                  required={key === "siteName"}
                  maxLength={key === "siteName" ? 180 : 255}
                  value={general[key as keyof typeof general]}
                  onChange={(event) =>
                    setGeneral({ ...general, [key!]: event.target.value })
                  }
                />
              )}
            </label>
          ))}
          <p className="text-sm text-slate">
            Footer text is displayed as plain text. Leave support email blank to
            clear it.
          </p>
        </>
      )}
      {section === "Social" && (
        <>
          <p className="text-sm text-slate">
            Only configured profiles become links in the header and footer.
          </p>
          {socialPlatforms.map((platform) => (
            <label key={platform} className="block text-sm font-semibold">
              {platform === "x"
                ? "X"
                : platform.charAt(0).toUpperCase() + platform.slice(1)}
              <input
                type="url"
                maxLength={255}
                className={input}
                value={social[platform] || ""}
                placeholder="https://"
                onChange={(event) =>
                  setSocial({ ...social, [platform]: event.target.value })
                }
              />
            </label>
          ))}
        </>
      )}
      {section === "Navigation" && (
        <>
          <label className="flex gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={custom}
              onChange={(event) => setCustom(event.target.checked)}
            />
            Customize the primary navigation
          </label>
          <p className="text-sm text-slate">
            Turn customization off and save to restore the approved navigation.
            Links apply to desktop and mobile menus.
          </p>
          {custom && (
            <>
              <div className="space-y-4">
                {menus.map((item, index) => (
                  <fieldset
                    key={index}
                    disabled={busy}
                    className="grid gap-3 rounded-lg border border-line p-4 sm:grid-cols-2"
                  >
                    <legend className="px-1 text-sm font-semibold">
                      Link {index + 1}
                    </legend>
                    <label className="text-sm font-semibold">
                      Label
                      <input
                        required
                        maxLength={80}
                        value={item.label}
                        className={input}
                        onChange={(event) =>
                          setMenus((rows) =>
                            rows.map((row, i) =>
                              i === index
                                ? { ...row, label: event.target.value }
                                : row,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Destination
                      <input
                        required
                        maxLength={255}
                        value={item.url}
                        className={input}
                        placeholder="/stories or https://example.com"
                        onChange={(event) =>
                          setMenus((rows) =>
                            rows.map((row, i) =>
                              i === index
                                ? { ...row, url: event.target.value }
                                : row,
                            ),
                          )
                        }
                      />
                    </label>
                    <div className="flex flex-wrap gap-2 sm:col-span-2">
                      <button
                        type="button"
                        className={button}
                        aria-label={`Move link ${index + 1} up`}
                        disabled={index === 0}
                        onClick={() => reorder(index, -1)}
                      >
                        Move up
                      </button>
                      <button
                        type="button"
                        className={button}
                        aria-label={`Move link ${index + 1} down`}
                        disabled={index === menus.length - 1}
                        onClick={() => reorder(index, 1)}
                      >
                        Move down
                      </button>
                      <button
                        type="button"
                        className={button}
                        onClick={() =>
                          setMenus((rows) => rows.filter((_, i) => i !== index))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </fieldset>
                ))}
              </div>
              <button
                type="button"
                className={button}
                disabled={busy || menus.length >= 20}
                onClick={() =>
                  setMenus((rows) => [...rows, { label: "", url: "" }])
                }
              >
                Add link
              </button>
            </>
          )}
        </>
      )}
      {!!Object.keys(errors).length && (
        <ul role="alert" className="text-sm text-red-700">
          {Object.entries(errors).flatMap(([field, messages]) =>
            messages.map((message) => (
              <li key={field + message}>
                {field}: {message}
              </li>
            )),
          )}
        </ul>
      )}
      <button
        className={button + " bg-navy-900 text-white"}
        disabled={
          busy || (section === "Navigation" && custom && menus.length === 0)
        }
      >
        {busy ? <LoadingDots /> : "Save settings"}
      </button>
    </form>
  );
}
