import { cookies } from "next/headers";
import { dictionaries, Dictionary } from "./i18n";

export async function getDictionary() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "es";
  
  return {
    t: (dictionaries[locale as keyof typeof dictionaries] || dictionaries.es) as Dictionary,
    lang: locale
  };
}
