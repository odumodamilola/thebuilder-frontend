import type { GetServerSideProps } from "next";
import { loadPublicData } from "./public-data";
import { HttpError, type ApiEnvelope } from "./http";
import { publicServerHttp } from "./public-server";
import { storyRedirect } from "./story-redirect";
export function publicPageProps(path: string): GetServerSideProps {
  return async (context) => {
    if (process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true") return { props: {} };
    const edition =
      context.req.cookies["tb-edition"] === "Australia"
        ? "Australia"
        : "Nigeria";
    const publicKey = JSON.stringify([path, context.query, edition]);
    try {
      const [publicData, settings] = await Promise.all([
        loadPublicData(
          path,
          context.query,
          edition,
          undefined,
          publicServerHttp,
        ),
        publicServerHttp<ApiEnvelope<Record<string, unknown>>>(
          "/settings/public",
        ).catch(() => ({
          data: null,
        })),
      ]);
      return {
        props: {
          // API JSON gains optional undefined fields in the UI adapters. Round-trip
          // at the SSR boundary so Next.js receives the same JSON as the browser.
          publicData: JSON.parse(JSON.stringify(publicData)),
          publicKey,
          initialEdition: edition,
          siteSettings: settings.data,
        },
      };
    } catch (error) {
      const destination = storyRedirect(error);
      if (destination) return { redirect: { destination, statusCode: 301 } };
      if (error instanceof HttpError && error.status === 404)
        return { notFound: true };
      context.res.statusCode = 503;
      return {
        props: {
          publicError: {
            status: error instanceof HttpError ? error.status : 503,
            message: "Content is temporarily unavailable. Please try again.",
          },
          publicKey,
          initialEdition: edition,
        },
      };
    }
  };
}
