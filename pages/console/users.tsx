import Head from "next/head";
import { UsersScreen } from "@/features/console-ops/ConsoleOpsScreens";
export default function Page() {
  return (
    <>
      <Head>
        <title>Users &amp; roles · The Builder Console</title>
      </Head>
      <UsersScreen />
    </>
  );
}
