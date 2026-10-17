import { PolicyPage } from "@/components/ui/PolicyPage";
export { policyPageProps as getServerSideProps } from "@/lib/policy-page-props";
export default function TermsPage() {
  return <PolicyPage kind="terms" />;
}
