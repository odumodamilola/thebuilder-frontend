import Head from "next/head";
import Link from "next/link";
import { CookieChoices } from "@/components/ui/CookieConsent";
import { useEdition } from "@/context/EditionContext";
import { editionCredit } from "@/lib/editorial-policy";

export default function CookiesPage() {
  const { edition } = useEdition();
  return (
    <>
      <Head>
        <title>Cookies and storage | The Builder</title>
      </Head>
      <main className="mx-auto w-full max-w-3xl space-y-7 px-4 py-14 text-[var(--text-body)]">
        <h1 className="font-display text-4xl font-bold text-[var(--text-heading)]">
          Cookies and storage
        </h1>
        <p>
          This notice describes the current technical use of cookies and browser
          storage. It will be updated with approved publisher privacy documents
          before launch.
        </p>
        <p>
          The Builder {edition} is powered by {editionCredit(edition)}.
        </p>
        <h2 className="font-display text-2xl font-bold text-[var(--text-heading)]">
          Essential functions
        </h2>
        <p>
          Laravel uses the_builder_session for sign-in and XSRF-TOKEN to protect
          requests against forgery. The default configured session lifetime is
          two hours; server-side privileged sessions also have an inactivity
          limit. The tb-edition cookie remembers the edition you select for up
          to one year. These functions do not depend on optional analytics
          consent.
        </p>
        <p>
          Browser storage remembers your selected edition and colour theme.
          Cloudflare Turnstile protects registration and submission forms when
          configured and may process technical information to verify requests.
        </p>
        <h2 className="font-display text-2xl font-bold text-[var(--text-heading)]">
          Optional analytics
        </h2>
        <p>
          Analytics are off by default. If you allow them, the site sends
          first-party article view/share events with a random identifier kept in
          session storage. Your choice is stored locally for up to 180 days.
          Choosing Essential only stops future optional events and removes the
          analytics session identifier. Withdrawing consent does not erase
          events already recorded.
        </p>
        <CookieChoices />
        <h2 className="font-display text-2xl font-bold text-[var(--text-heading)]">
          YouTube videos
        </h2>
        <p>
          Video previews may load images from YouTube. The embedded player loads
          only after you choose to play a video. Playing connects to YouTube’s
          privacy-enhanced player and its associated services, which may use
          cookies or process usage information. You can instead use the external
          YouTube link.
        </p>
        <p>
          You can manage or delete cookies and local storage in your browser.
          Blocking essential cookies may prevent sign-in and form submissions.
          Return here using the Cookie notice or Cookies links in the footer to
          change your analytics choice.
        </p>
        <p>
          For publisher contact and the forthcoming approved privacy
          information, visit{" "}
          <Link href="/about#contact" className="underline">
            Contact
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy
          </Link>
          .
        </p>
      </main>
    </>
  );
}
