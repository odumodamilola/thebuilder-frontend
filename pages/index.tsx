import HomePage from "./home";

export default function IndexPage() {
  return <HomePage />;
}

import { publicPageProps } from "@/lib/public-ssr";
export const getServerSideProps = publicPageProps("/");
