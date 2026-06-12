"use client";
import { createContext, useContext, useState, ReactNode } from "react";
type L = "en" | "es";
const Ctx = createContext<{ lang: L; setLang: (l: L) => void }>({ lang: "en", setLang: () => {} });
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<L>("en");
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
export function T({ en, es }: { en: ReactNode; es: ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "es" ? es : en}</>;
}
