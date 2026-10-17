import { PolicyPage } from "@/components/ui/PolicyPage";
export { policyPageProps as getServerSideProps } from "@/lib/policy-page-props";
export default function SponsoredContentPolicy() {
  return <PolicyPage kind="sponsored" />;
}
