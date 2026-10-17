import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "tb-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let timer: ReturnType<typeof setTimeout>;
    const read = (): ThemePreference => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved === "light" || saved === "dark" ? saved : "system";
      } catch {
        return "system";
      }
    };
    const sync = () => {
      const preference = read();
      const root = document.documentElement;
      const resolved =
        preference === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preference;
      if (
        root.dataset.theme !== resolved &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        root.setAttribute("data-theme-anim", "");
        clearTimeout(timer);
        timer = setTimeout(() => root.removeAttribute("data-theme-anim"), 200);
      }
      root.dataset.theme = resolved;
      root.style.colorScheme = resolved;
      setThemeState(preference);
    };
    const frame = window.requestAnimationFrame(sync);
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("tb-theme-change", sync);
    return () => {
      window.cancelAnimationFrame(frame);
      clearTimeout(timer);
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("tb-theme-change", sync);
    };
  }, []);

  const setTheme = useCallback((value: ThemePreference) => {
    setThemeState(value);
    try {
      if (value === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new Event("tb-theme-change"));
    } catch {
      const resolved =
        value === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : value;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
