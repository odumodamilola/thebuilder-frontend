"use client";
import { usePublicData } from "@/context/PublicDataContext";

import React from "react";
import { useRouter } from "next/router";
import { useEdition } from "@/context/EditionContext";
import { useToast } from "@/context/ToastContext";
import HomeHero from "@/components/sections/HomeHero";
import HomeLatest from "@/components/sections/HomeLatest";
import HomeTrending from "@/components/sections/HomeTrending";
import HomeSpotlight from "@/components/sections/HomeSpotlight";
import HomeDiaspora from "@/components/sections/HomeDiaspora";
import HomeVideos from "@/components/sections/HomeVideos";
import HomeOpportunities from "@/components/sections/HomeOpportunities";
import HomeNominate from "@/components/sections/HomeNominate";
import HomeMostRead from "@/components/sections/HomeMostRead";
import HomeNewsletter from "@/components/sections/HomeNewsletter";

export default function HomePage() {
  const { edition } = useEdition();
  const { toast } = useToast();

  const { query } = useRouter();
  const state =
    process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true"
      ? String(query.state || "default")
      : "default";
  const loading = state === "loading";
  const sponsored = state === "sponsored";
  const showTrending = state !== "hidden";
  const showVideos = state !== "hidden";

  const handleToast = (msg: string) => {
    toast(msg);
  };

  const content = usePublicData()?.home;
  const sections: Record<string, React.ReactNode> = {
    lead: <HomeHero loading={loading} edition={edition} />,
    latest: (
      <HomeLatest
        loading={loading}
        edition={edition}
        sponsored={sponsored}
        onToast={handleToast}
      />
    ),
    trending: <HomeTrending />,
    startups: <HomeSpotlight loading={loading} />,
    diaspora: <HomeDiaspora loading={loading} edition={edition} />,
    videos: <HomeVideos />,
    opportunities: <HomeOpportunities loading={loading} edition={edition} />,
    nominate: <HomeNominate />,
    "most-read": <HomeMostRead loading={loading} />,
    newsletter: <HomeNewsletter />,
  };
  if (content)
    return (
      <main data-screen-label="Home">
        {content.sections
          .filter((s) => s.visible && s.key !== "picks")
          .sort((a, b) => a.position - b.position)
          .map((s) => (
            <React.Fragment key={s.key}>{sections[s.key]}</React.Fragment>
          ))}
      </main>
    );
  return (
    <main data-screen-label="Home">
      <HomeHero loading={loading} edition={edition} />
      <HomeLatest
        loading={loading}
        edition={edition}
        sponsored={sponsored}
        onToast={handleToast}
      />
      {showTrending && <HomeTrending />}
      <HomeSpotlight loading={loading} />
      <HomeDiaspora loading={loading} edition={edition} />
      {showVideos && <HomeVideos />}
      <HomeOpportunities loading={loading} edition={edition} />
      <HomeNominate />
      <HomeMostRead loading={loading} />
      <HomeNewsletter />
    </main>
  );
}
