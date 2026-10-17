import Head from "next/head";
import { SettingsScreen } from "@/features/console-ops/ConsoleOpsScreens";
export default function Page() {
  return (
    <>
      <Head>
        <title>Settings · The Builder Console</title>
      </Head>
      <SettingsScreen />
    </>
  );
}
