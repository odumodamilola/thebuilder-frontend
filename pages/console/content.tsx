import { useRouter } from "next/router";
import { ContentPage } from "@/features/console/ConsolePages";
export default function Page() {
  return <ContentPage state={useRouter().query.state} />;
}
