import Head from "next/head";
import { OpportunitiesEditorScreen } from "@/features/console-ops/ConsoleOpsScreens";
export default function Page() {
  return (
    <>
      <Head>
        <title>Opportunities · The Builder Console</title>
      </Head>
      <OpportunitiesEditorScreen />
    </>
  );
}
