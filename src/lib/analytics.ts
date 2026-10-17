import { http } from "./http";
import { readCookieChoice } from "./cookie-consent";

/** Optional analytics stay disabled until the reader explicitly opts in. */
export async function trackArticle(articleId: string, type: "view" | "share") {
  try {
    if (readCookieChoice()?.analytics !== true) {
      sessionStorage.removeItem("tb-analytics-session");
      return;
    }
    let sessionId = sessionStorage.getItem("tb-analytics-session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("tb-analytics-session", sessionId);
    }
    await http("/track/events", {
      method: "POST",
      body: { articleId, type, sessionId, consent: true },
    });
  } catch {
    /* Optional telemetry must never interrupt reading. */
  }
}
