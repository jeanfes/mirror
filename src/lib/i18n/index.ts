import type { Dictionary } from "./types"
export type { Dictionary }

export async function loadDictionary(lang: string): Promise<Dictionary> {
  switch (lang) {
    case "en":
      return (await import("./locales/en")).default
    case "pt":
      return (await import("./locales/pt")).default
    case "fr":
      return (await import("./locales/fr")).default
    case "de":
      return (await import("./locales/de")).default
    default:
      return (await import("./locales/es")).default
  }
}

export async function getDictionarySync(lang: string) {
  return { t: await loadDictionary(lang), lang }
}
