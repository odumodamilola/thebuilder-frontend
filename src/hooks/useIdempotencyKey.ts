import { useRef } from "react";
export function useIdempotencyKey() {
  const last = useRef<{ fingerprint: string; key: string } | null>(null);
  return (payload: unknown) => {
    const fingerprint = JSON.stringify(payload);
    if (last.current?.fingerprint !== fingerprint)
      last.current = { fingerprint, key: crypto.randomUUID() };
    return last.current.key;
  };
}
