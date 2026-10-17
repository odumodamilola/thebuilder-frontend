import { useState, useEffect } from "react";

type Edition = "Australia" | "Nigeria";

export function useEdition() {
  const [edition, setEdition] = useState<Edition>("Australia");

  useEffect(() => {
    const saved = localStorage.getItem("tb_edition") as Edition;
    if (saved) {
      setEdition(saved);
    }
  }, []);

  const changeEdition = (newEdition: Edition) => {
    setEdition(newEdition);
    localStorage.setItem("tb_edition", newEdition);
  };

  return { edition, changeEdition };
}
