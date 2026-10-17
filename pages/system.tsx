import { useRouter } from "next/router";
import {
  SystemPage,
  type SystemKind,
} from "@/features/editorial/EditorialPages";
const kinds: SystemKind[] = [
  "404",
  "500",
  "maintenance",
  "offline",
  "cookie",
  "tooltip",
];
export default function SystemRoute() {
  const { query } = useRouter();
  const requested = String(query.state || "404");
  const kind = kinds.includes(requested as SystemKind)
    ? (requested as SystemKind)
    : "404";
  return <SystemPage kind={kind} />;
}
