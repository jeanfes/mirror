import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loadDictionary } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";
import esDict from "@/lib/i18n/locales/es";

type Language = "es" | "en" | "pt" | "fr" | "de";

interface LanguageState {
  language: Language;
  t: Dictionary;
  isLoading: boolean;
  isHydrated: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  setDictionary: (dict: Dictionary) => void;
  setHydrated: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "es",
      t: esDict,
      isLoading: false,
      isHydrated: false,
      setLanguage: async (lang: Language) => {
        set({ isLoading: true });
        try {
          const dict = await loadDictionary(lang);
          
          if (typeof document !== "undefined") {
            document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
          }
          
          set({
            language: lang,
            t: dict,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to load dictionary:", error);
          set({ isLoading: false });
        }
      },
      setDictionary: (dict: Dictionary) => set({ t: dict }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "mirror-language-storage",
      partialize: (state) => ({ language: state.language }),
      merge: (persistedState, currentState) => {
        const savedLanguage = (persistedState as Partial<LanguageState> | undefined)?.language;
        const lang = (savedLanguage ?? currentState.language) as Language;
        
        if (typeof document !== "undefined" && lang) {
            document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        }

        if (lang !== "es" || currentState.t === null) {
          loadDictionary(lang).then((dict) => {
            useLanguageStore.setState({ t: dict });
          });
        }

        return {
          ...currentState,
          language: lang,
          t: lang === "es" ? esDict : currentState.t,
          isHydrated: true,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },

    }
  )
);

