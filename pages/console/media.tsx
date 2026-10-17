import Head from "next/head";
import { MediaScreen } from "@/features/console-ops/ConsoleOpsScreens";
export default function Page() {
  return (
    <>
      <Head>
        <title>Media library · The Builder Console</title>
      </Head>
      <MediaScreen />
    </>
  );
}
