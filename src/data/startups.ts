export interface Startup {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  industry: string;
  stage: string;
  country: string;
  logo: string;
  foundedYear: string;
  teamSize: string;
  about?: string;
  founders?: string[]; // IDs or slugs to builders
  metrics?: { label: string; value: string }[];
  opportunities?: { title: string; type: string }[];
}

export const STARTUPS: Startup[] = [
  {
    id: "1",
    slug: "blue-nile",
    name: "Blue Nile",
    tagline:
      "Empowering the African diaspora through innovative digital solutions.",
    industry: "Technology",
    stage: "Seed",
    country: "Australia",
    logo: "BN",
    foundedYear: "2021",
    teamSize: "10-50",
    about:
      "Blue Nile is a pioneering tech company building platforms that connect and empower the African diaspora globally.",
    founders: ["haftu-strintzos"],
    metrics: [
      { label: "Active Users", value: "50K+" },
      { label: "Revenue", value: "$1M ARR" },
    ],
    opportunities: [{ title: "Frontend Engineer", type: "Full-time" }],
  },
  {
    id: "2",
    slug: "catalysr",
    name: "Catalysr",
    tagline: "Accelerating migrant and refugee entrepreneurs.",
    industry: "Social Impact",
    stage: "Series A",
    country: "Australia",
    logo: "CA",
    foundedYear: "2016",
    teamSize: "1-10",
    about:
      "Catalysr is an award-winning accelerator for early-stage startups founded by migrants and refugees.",
    founders: ["mohamed-semra"],
    metrics: [{ label: "Startups Supported", value: "800+" }],
    opportunities: [{ title: "Program Manager", type: "Contract" }],
  },
];
