import { de, enUS, es, fr, ptBR } from "date-fns/locale"
import type { Locale } from "date-fns"

export type AppLanguage = "es" | "en" | "pt" | "fr" | "de"

const DATE_LOCALE_BY_LANGUAGE: Record<AppLanguage, Locale> = {
  es,
  en: enUS,
  pt: ptBR,
  fr,
  de
}

export function getFormatLocale(language: string): Locale {
  return DATE_LOCALE_BY_LANGUAGE[language as AppLanguage] || es
}
