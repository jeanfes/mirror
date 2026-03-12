import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dictionaries, Dictionary } from "@/lib/i18n";

type Language = "es" | "en";

interface LanguageState {
  language: Language;
  t: Dictionary;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "es",
      t: dictionaries["es"],
      setLanguage: (lang: Language) =>
        set(() => ({
          language: lang,
          t: dictionaries[lang],
        })),
    }),
    {
      name: "mirror-language-storage",
    }
  )
);
