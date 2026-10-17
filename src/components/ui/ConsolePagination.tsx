import { useConsoleData } from "@/context/ConsoleDataContext";
import { Pagination, type PaginationMeta } from "./Pagination";

export function ConsolePagination() {
  return (
    <Pagination meta={useConsoleData()?.meta as PaginationMeta | undefined} />
  );
}
