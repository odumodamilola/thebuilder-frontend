export const consentStorageKey = "tb-cookie-choice-v1";
const lifetime = 180 * 24 * 60 * 60 * 1000;
export interface CookieChoice {
  version: 1;
  analytics: boolean;
  savedAt: number;
}
let visitChoice: CookieChoice | null = null;
export function readCookieChoice(): CookieChoice | null {
  if (typeof window === "undefined") return null;
  if (visitChoice && Date.now() - visitChoice.savedAt < lifetime)
    return visitChoice;
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(consentStorageKey) || "null",
    );
    if (value && typeof value === "object") {
      const choice = value as CookieChoice;
      if (
        choice.version === 1 &&
        typeof choice.analytics === "boolean" &&
        typeof choice.savedAt === "number" &&
        choice.savedAt <= Date.now() &&
        Date.now() - choice.savedAt < lifetime
      )
        return choice;
    }
  } catch {
    /* Storage may be blocked; retain this visit's explicit choice. */
  }
  return visitChoice && Date.now() - visitChoice.savedAt < lifetime
    ? visitChoice
    : null;
}
export function saveCookieChoice(analytics: boolean): void {
  visitChoice = { version: 1, analytics, savedAt: Date.now() };
  try {
    localStorage.setItem(consentStorageKey, JSON.stringify(visitChoice));
    visitChoice = null;
    localStorage.removeItem("tb-analytics-consent");
  } catch {
    /* The choice still applies during this visit if storage is blocked. */
  }
  if (!analytics) {
    try {
      sessionStorage.removeItem("tb-analytics-session");
    } catch {
      /* No optional identifier is needed. */
    }
  }
  window.dispatchEvent(new Event("tb-cookie-choice-changed"));
}
