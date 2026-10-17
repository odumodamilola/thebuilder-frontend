import { diasporaRegions } from "./diaspora";
import type {
  Story,
  Builder,
  Startup,
  Opportunity,
  Video,
  Edition,
} from "./types";
import { http, HttpError, type ApiEnvelope } from "./http";
import type {
  Builder as ExploreBuilder,
  Startup as ExploreStartup,
  Opportunity as ExploreOpportunity,
} from "@/features/explore/data";

export type DirectoryBuilder = ExploreBuilder & Builder;
export type DirectoryStartup = ExploreStartup & Startup;
export type DirectoryOpportunity = Omit<ExploreOpportunity, "daysLeft"> &
  Opportunity;
export interface PublicData {
  stories: Story[];
  builders: DirectoryBuilder[];
  startups: DirectoryStartup[];
  opportunities: DirectoryOpportunity[];
  videos: Video[];
  popular?: Story[];
  article?: Story;
  category?: { name: string; slug: string; description?: string };
  home?: HomeData;
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}
export interface HomeData {
  sections: {
    key: string;
    position: number;
    visible: boolean;
    pinnedIds?: string[];
  }[];
  lead: Story | null;
  secondary: Story[];
  latest: Story[];
  trending: Story[];
  picks: Story[];
  mostRead: Story[];
  builders: Builder[];
  startups: Startup[];
  opportunities: Opportunity[];
  videos: Video[];
}
export const emptyPublicData: PublicData = {
  stories: [],
  builders: [],
  startups: [],
  opportunities: [],
  videos: [],
};
export const isPublicDataRoute = (path: string) =>
  [
    "/",
    "/home",
    "/stories",
    "/stories/[slug]",
    "/category/[slug]",
    "/builders",
    "/builders/[slug]",
    "/startups",
    "/startups/[slug]",
    "/diaspora",
    "/diaspora/[region]",
    "/opportunities",
    "/opportunities/[slug]",
    "/search",
    "/videos",
    "/videos/[id]",
  ].includes(path);
function publicReaders(client: typeof http) {
  const list = async <T>(
    path: string,
    signal?: AbortSignal,
    query?: Record<string, string | number>,
  ) => {
    const result = await client<ApiEnvelope<T[]>>(path, { signal, query });
    if (!Array.isArray(result?.data))
      throw new HttpError(502, "The server returned an invalid collection.");
    return result;
  };
  const detail = async <T>(path: string, signal?: AbortSignal) => {
    const result = await client<ApiEnvelope<T>>(path, { signal });
    if (
      result?.data &&
      typeof result.data === "object" &&
      "redirect" in result.data
    )
      throw new HttpError(301, "This story has moved.", result.data);
    if (!result?.data)
      throw new HttpError(502, "The server returned an invalid record.");
    return result.data;
  };
  return { list, detail };
}
function normalize(data: PublicData): PublicData {
  return {
    ...data,
    stories: data.stories.map((x) => ({
      ...x,
      image: x.imageUrl || x.image || undefined,
    })),
    builders: data.builders.map((x) => ({
      ...x,
      slug: x.slug || "",
      industry: x.industry || "",
    })),
    startups: data.startups.map((x) => ({
      ...x,
      slug: x.slug || "",
      founded: x.foundedYear || 0,
      team: x.teamSize || 0,
    })),
    opportunities: data.opportunities.map((x) => ({
      ...x,
      slug: x.slug || "",
      org: x.organisation,
      type: (x.type.charAt(0).toUpperCase() +
        x.type.slice(1)) as Opportunity["type"],
      region: x.region || "",
      daysLeft: x.daysLeft,
    })),
  };
}
export async function loadPublicData(
  path: string,
  query: Record<string, string | string[] | undefined>,
  edition: Edition,
  signal?: AbortSignal,
  client: typeof http = http,
): Promise<PublicData> {
  const { list, detail } = publicReaders(client);
  const data: PublicData = { ...emptyPublicData };
  const slug = String(query.slug || "");
  const page = Number(query.page || 1);
  const filters = Object.fromEntries(
    [
      "q",
      "industry",
      "country",
      "region",
      "classification",
      "stage",
      "type",
      "format",
      "feature",
      "deadlineDays",
      "remote",
      "from",
      "to",
    ]
      .filter((key) => typeof query[key] === "string" && query[key])
      .map((key) => [key, String(query[key])]),
  );
  async function collection<T>(endpoint: string) {
    const result = await list<T>(endpoint, signal, {
      page,
      per_page: 20,
      edition,
      ...filters,
    });
    data.meta = result.meta as PublicData["meta"];
    return result.data;
  }
  if (path === "/" || path === "/home") {
    data.home = await detail<HomeData>("/home?edition=" + edition, signal);
    data.stories = data.home.latest;
    data.builders = data.home.builders as DirectoryBuilder[];
    data.startups = data.home.startups as DirectoryStartup[];
    data.opportunities = data.home.opportunities as DirectoryOpportunity[];
    data.videos = data.home.videos;
  } else if (path === "/stories" || path === "/category/[slug]") {
    const category = path.startsWith("/category")
      ? slug
      : String(query.category || "");
    if (path.startsWith("/category"))
      data.category = await detail(
        "/categories/" + encodeURIComponent(slug),
        signal,
      );
    const result = await list<Story>("/articles", signal, {
      edition,
      page,
      ...(category ? { category } : {}),
      ...(query.tag ? { tag: String(query.tag) } : {}),
      ...(query.type ? { type: String(query.type) } : {}),
    });
    data.stories = result.data;
    data.meta = result.meta as PublicData["meta"];
    if (path.startsWith("/category"))
      data.popular = (
        await list<Story>("/articles", signal, {
          edition,
          category,
          sort: "most_read",
          per_page: 5,
        })
      ).data;
  } else if (path === "/stories/[slug]") {
    data.article = await detail(
      "/articles/" + encodeURIComponent(slug),
      signal,
    );
    data.stories = (
      await list<Story>("/articles", signal, { edition, per_page: 3 })
    ).data.filter((x) => x.id !== data.article?.id);
  } else if (path.startsWith("/builders")) {
    data.builders = path.includes("[slug]")
      ? [await detail("/builders/" + encodeURIComponent(slug), signal)]
      : await collection<DirectoryBuilder>("/builders");
  } else if (path.startsWith("/startups")) {
    data.startups = path.includes("[slug]")
      ? [await detail("/startups/" + encodeURIComponent(slug), signal)]
      : await collection<DirectoryStartup>("/startups");
  } else if (path.startsWith("/opportunities")) {
    data.opportunities = path.includes("[slug]")
      ? [await detail("/opportunities/" + encodeURIComponent(slug), signal)]
      : await collection<DirectoryOpportunity>("/opportunities");
  } else if (path.startsWith("/diaspora")) {
    const region = path.includes("[region]")
      ? diasporaRegions[String(query.region)]
      : null;
    if (path.includes("[region]") && !region)
      throw new HttpError(404, "This region is unavailable.");
    const location: Record<string, string> = region?.country
      ? { country: region.country }
      : region?.region
        ? { region: region.region }
        : {};
    const regionalEdition = region?.edition || edition;
    const [builders, stories, opportunities] = await Promise.all([
      list<DirectoryBuilder>("/builders", signal, {
        per_page: 50,
        diaspora: 1,
        ...location,
      }),
      list<Story>("/articles", signal, {
        per_page: 20,
        edition: regionalEdition,
        ...location,
      }),
      list<DirectoryOpportunity>("/opportunities", signal, {
        per_page: 20,
        edition: regionalEdition,
        ...(region ? { region: region.label } : {}),
      }),
    ]);
    data.builders = builders.data;
    data.stories = stories.data;
    data.opportunities = opportunities.data;
  } else if (path === "/search") {
    const result = await detail<{
      stories: Story[];
      builders: DirectoryBuilder[];
      startups: DirectoryStartup[];
      opportunities: DirectoryOpportunity[];
      videos: Video[];
    }>("/search?q=" + encodeURIComponent(String(query.q || "")), signal);
    Object.assign(data, result);
  } else if (path.startsWith("/videos")) {
    data.videos = path.includes("[id]")
      ? [
          await detail(
            "/videos/" + encodeURIComponent(String(query.id || "")),
            signal,
          ),
        ]
      : await collection<Video>("/videos");
  }
  return normalize(data);
}
