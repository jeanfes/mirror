import { cookies } from "next/headers";
import { loadDictionary } from "./i18n";
import type { Dictionary } from "./i18n/types";

export async function getDictionary() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "es";
  
  const dictionary = await loadDictionary(locale);
  
  return {
    t: dictionary as Dictionary,
    lang: locale
  };
}
