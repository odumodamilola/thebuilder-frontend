import Head from "next/head";
import { VideoManagementScreen } from "@/features/console-ops/ConsoleOpsScreens";
export default function Page() {
  return (
    <>
      <Head>
        <title>Videos · The Builder Console</title>
      </Head>
      <VideoManagementScreen />
    </>
  );
}
