export { StartupProfileScreen as default } from "@/features/explore/ExploreScreens";

import { publicPageProps } from "@/lib/public-ssr";
export const getServerSideProps = publicPageProps("/startups/[slug]");
