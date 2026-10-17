import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { http, errorMessage } from "@/lib/http";
import { accountApi } from "@/features/account/api";
import { useApiResource } from "./useApiResource";

export function useBookmark(articleId?: string) {
  const { user } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false),
    [busy, setBusy] = useState(false);
  const status = useApiResource(
    user?.emailVerified && articleId
      ? "saved:" + user.id + ":" + articleId
      : null,
    (signal) =>
      http<{ data: { saved: boolean } }>("/me/bookmarks/" + articleId, {
        signal,
      }),
  );
  useEffect(() => {
    if (status.data) setSaved(status.data.data.saved);
  }, [status.data]);
  async function toggle() {
    if (!user) {
      void router.push("/signin?redirect=" + encodeURIComponent(router.asPath));
      return;
    }
    if (!user.emailVerified) {
      void router.push("/verify-email?email=" + encodeURIComponent(user.email));
      return;
    }
    if (!articleId || busy) return;
    setBusy(true);
    try {
      await accountApi.bookmark(articleId, !saved);
      setSaved(!saved);
      toast(saved ? "Removed from saved stories" : "Story saved");
    } catch (error) {
      toast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }
  return { saved, busy: busy || status.loading, toggle };
}
