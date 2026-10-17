import Head from "next/head";
import { AnalyticsScreen } from "@/features/console-ops/ConsoleOpsScreens";
export default function Page() {
  return (
    <>
      <Head>
        <title>Analytics · The Builder Console</title>
      </Head>
      <AnalyticsScreen />
    </>
  );
}
