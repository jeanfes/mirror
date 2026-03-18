import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dictionaries, Dictionary } from "@/lib/i18n";

type Language = "es" | "en" | "pt" | "fr" | "de";

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
          t: dictionaries[lang] as Dictionary,
        })),
    }),
    {
      name: "mirror-language-storage",
      partialize: (state) => ({ language: state.language }),
      merge: (persistedState, currentState) => {
        const savedLanguage = (persistedState as Partial<LanguageState> | undefined)?.language;
        const lang = (savedLanguage ?? currentState.language) as Language;
        return {
          ...currentState,
          language: lang,
          t: (dictionaries[lang] as Dictionary) || currentState.t,
        };
      },
    }
  )
);
