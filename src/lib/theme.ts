export type ThemePreference = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export const THEME_STORAGE_KEY = "mirror-theme-preference"
export const THEME_PREFERENCE_COOKIE = "mirror-theme-preference"
export const THEME_RESOLVED_COOKIE = "mirror-theme-resolved"
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)"

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system"
export const DEFAULT_RESOLVED_THEME: ResolvedTheme = "light"

export function parseThemePreference(value?: string | null): ThemePreference | null {
    if (value === "light" || value === "dark" || value === "system") {
        return value
    }

    return null
}

export function parseResolvedTheme(value?: string | null): ResolvedTheme | null {
    if (value === "light" || value === "dark") {
        return value
    }

    return null
}

export function resolveThemePreference(preference: ThemePreference, systemTheme: ResolvedTheme): ResolvedTheme {
    return preference === "system" ? systemTheme : preference
}

export function getCookieValue(cookieName: string, cookieSource: string) {
    const escapedCookieName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const match = cookieSource.match(new RegExp(`(?:^|; )${escapedCookieName}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
}

export function buildThemeInitScript(
    fallbackPreference: ThemePreference = DEFAULT_THEME_PREFERENCE,
    fallbackResolvedTheme: ResolvedTheme = DEFAULT_RESOLVED_THEME
) {
    return `(() => {
  try {
    const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
    const preferenceCookie = ${JSON.stringify(THEME_PREFERENCE_COOKIE)};
    const resolvedCookie = ${JSON.stringify(THEME_RESOLVED_COOKIE)};
    const fallbackPreference = ${JSON.stringify(fallbackPreference)};
    const fallbackResolvedTheme = ${JSON.stringify(fallbackResolvedTheme)};
    const cookieMatch = (name) => {
      const escapedName = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\\\$&");
      const match = document.cookie.match(new RegExp("(?:^|; )" + escapedName + "=([^;]*)"));
      return match ? decodeURIComponent(match[1]) : null;
    };
    const parsePreference = (value) => value === "light" || value === "dark" || value === "system" ? value : null;
    const parseResolved = (value) => value === "light" || value === "dark" ? value : null;
    const storedPreference = parsePreference(window.localStorage.getItem(storageKey));
    const cookiePreference = parsePreference(cookieMatch(preferenceCookie));
    const cookieResolved = parseResolved(cookieMatch(resolvedCookie));
    const preference = storedPreference || cookiePreference || fallbackPreference;
    const systemTheme = window.matchMedia(${JSON.stringify(THEME_MEDIA_QUERY)}).matches ? "dark" : "light";
    const resolvedTheme = preference === "system" ? systemTheme : preference || cookieResolved || fallbackResolvedTheme;
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolvedTheme;
    window.localStorage.setItem(storageKey, preference);
    document.cookie = preferenceCookie + "=" + preference + "; path=/; max-age=31536000; SameSite=Lax";
    document.cookie = resolvedCookie + "=" + resolvedTheme + "; path=/; max-age=31536000; SameSite=Lax";
  } catch (error) {
    console.error("theme-init", error);
  }
})();`
}
