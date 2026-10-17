"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Edition = "Nigeria" | "Australia";
interface EditionContextValue {
  edition: Edition;
  setEdition: (edition: Edition) => void;
}

const EditionContext = createContext<EditionContextValue | null>(null);

export function EditionProvider({
  children,
  initialEdition = "Nigeria",
}: {
  children: React.ReactNode;
  initialEdition?: Edition;
}) {
  const [edition, setEditionState] = useState<Edition>(initialEdition);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tb-edition") as Edition | null;
      if (saved === "Nigeria" || saved === "Australia") setEditionState(saved);
    } catch {
      /* Keep the server-selected edition when storage is blocked. */
    }
  }, []);

  const setEdition = (e: Edition) => {
    setEditionState(e);
    try {
      localStorage.setItem("tb-edition", e);
    } catch {
      /* Edition remains usable for this visit. */
    }
    document.cookie =
      "tb-edition=" + e + "; Path=/; SameSite=Lax; Max-Age=31536000";
  };

  return (
    <EditionContext.Provider value={{ edition, setEdition }}>
      {children}
    </EditionContext.Provider>
  );
}

export function useEdition() {
  const ctx = useContext(EditionContext);
  if (!ctx) {
    return { edition: "Nigeria" as Edition, setEdition: () => {} };
  }
  return ctx;
}
