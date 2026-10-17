import { useCallback, useEffect, useRef, useState } from "react";

/** Key changes cancel old work; late responses never overwrite newer results. */
export function useApiResource<T>(
  key: string | null,
  load: (signal: AbortSignal) => Promise<T>,
) {
  const loader = useRef(load);
  useEffect(() => {
    loader.current = load;
  }, [load]);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    key: string | null;
    data?: T;
    error?: unknown;
    loading: boolean;
  }>({ key, loading: key !== null });
  useEffect(() => {
    if (key === null) return;
    const controller = new AbortController();
    setResult({ key, loading: true });
    loader.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted)
          setResult({ key, data, loading: false });
      },
      (error) => {
        if (!controller.signal.aborted)
          setResult({ key, error, loading: false });
      },
    );
    return () => controller.abort();
  }, [key, attempt]);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return {
    ...(result.key === key
      ? result
      : { loading: key !== null, data: undefined, error: undefined }),
    retry,
  };
}
