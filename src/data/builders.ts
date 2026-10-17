export interface Builder {
  id: string;
  slug: string;
  name: string;
  role: string;
  company: string;
  location: string;
  category: string;
  image: string;
  bio?: string;
  stats?: { label: string; value: string }[];
  achievements?: string[];
  articles?: { title: string; link: string }[];
}

export const BUILDERS: Builder[] = [
  {
    id: "1",
    slug: "haftu-strintzos",
    name: "Haftu Strintzos",
    role: "Founder",
    company: "Blue Nile",
    location: "Melbourne, Australia",
    category: "Technology",
    image: "/images/builders/haftu.jpg",
    bio: "Haftu Strintzos is a visionary entrepreneur and the founder of Blue Nile, focusing on empowering the African diaspora through technology.",
    stats: [
      { label: "Years Active", value: "10+" },
      { label: "Startups", value: "3" },
    ],
    achievements: [
      "Blue Nile Business Masterclass Alumni",
      "Top 100 Innovators 2023",
    ],
    articles: [{ title: "Empowering the Diaspora", link: "#" }],
  },
  {
    id: "2",
    slug: "mohamed-semra",
    name: "Mohamed Semra",
    role: "CEO",
    company: "Catalysr",
    location: "Sydney, Australia",
    category: "Social Impact",
    image: "/images/builders/mohamed.jpg",
    bio: "Mohamed Semra is a dedicated community leader driving social impact through the Catalysr Migrant Entrepreneurship Program.",
    stats: [
      { label: "Mentored", value: "500+" },
      { label: "Awards", value: "5" },
    ],
    achievements: [
      "Catalysr Migrant Entrepreneurship Program — Melbourne",
      "Community Leader Award",
    ],
    articles: [{ title: "Building Communities", link: "#" }],
  },
  {
    id: "3",
    slug: "moses-musioka",
    name: "Moses Musioka",
    role: "CTO",
    company: "TechFlow",
    location: "Nairobi, Kenya",
    category: "Engineering",
    image: "/images/builders/moses.jpg",
    bio: "Moses is a leading technical mind in East Africa, architecting scalable solutions for the continent.",
    stats: [{ label: "Commits", value: "10k+" }],
    achievements: ["Tech Innovations Africa Winner"],
    articles: [{ title: "Scaling Tech in Africa", link: "#" }],
  },
  {
    id: "4",
    slug: "selba-gondoza-luka",
    name: "Selba-Gondoza Luka",
    role: "Director",
    company: "AfriTech",
    location: "London, UK",
    category: "Finance",
    image: "/images/builders/selba.jpg",
    bio: "Selba-Gondoza is a prominent figure in bridging African startups with European investors.",
    stats: [{ label: "Capital Raised", value: "$50M+" }],
    achievements: ["Global Finance Leader 2024"],
    articles: [{ title: "The Future of African Finance", link: "#" }],
  },
  {
    id: "5",
    slug: "bellamore-ndayikeze",
    name: "Bellamore Ndayikeze",
    role: "Creative Director",
    company: "Diaspora Designs",
    location: "Toronto, Canada",
    category: "Creative",
    image: "/images/builders/bellamore.jpg",
    bio: "Bellamore redefines African design on the global stage, blending traditional aesthetics with modern functionality.",
    stats: [{ label: "Projects", value: "100+" }],
    achievements: ["Creative Diaspora Award"],
    articles: [{ title: "Design Without Borders", link: "#" }],
  },
];
