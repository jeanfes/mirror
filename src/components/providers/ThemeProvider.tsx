"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react"
import {
  getCookieValue,
  parseThemePreference,
  resolveThemePreference,
  THEME_MEDIA_QUERY,
  THEME_PREFERENCE_COOKIE,
  THEME_RESOLVED_COOKIE,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme"

interface ThemeContextValue {
  themePreference: ThemePreference
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  setThemePreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function writeThemeState(preference: ThemePreference, resolvedTheme: ResolvedTheme) {
  // Use requestIdleCallback or setTimeout to avoid blocking the main thread
  // during the critical path of rendering and painting.
  const work = () => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.dataset.themePreference = preference
    document.documentElement.style.colorScheme = resolvedTheme
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    document.cookie = `${THEME_PREFERENCE_COOKIE}=${preference}; path=/; max-age=31536000; SameSite=Lax`
    document.cookie = `${THEME_RESOLVED_COOKIE}=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`
  }

  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => work(), { timeout: 2000 })
    } else {
      setTimeout(work, 0)
    }
  }
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light"
}

function readClientPreference(fallback: ThemePreference): ThemePreference {
  if (typeof window === "undefined") return fallback
  const stored = parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY))
  if (stored) return stored
  const fromCookie = parseThemePreference(
    getCookieValue(THEME_PREFERENCE_COOKIE, document.cookie)
  )
  if (fromCookie) return fromCookie
  return fallback
}

function readSystemTheme(fallback: ResolvedTheme): ResolvedTheme {
  if (typeof window === "undefined") return fallback
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light"
}

interface ThemeProviderProps {
  children: React.ReactNode
  initialThemePreference: ThemePreference
  initialResolvedTheme: ResolvedTheme
}

export function ThemeProvider({
  children,
  initialThemePreference,
  initialResolvedTheme,
}: ThemeProviderProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState(() => {
    const themePreference = readClientPreference(initialThemePreference)
    const systemTheme = readSystemTheme(initialResolvedTheme)
    return { themePreference, systemTheme }
  })


  const handleSystemThemeChange = useCallback(() => {
    setState((prev) => ({ ...prev, systemTheme: getSystemTheme() }))
  }, [])

  const handleStorage = useCallback((event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return
    const nextPreference = parseThemePreference(event.newValue)
    if (nextPreference) {
      setState((prev) => ({ ...prev, themePreference: nextPreference }))
    }
  }, [])

  const setThemePreference = useCallback((pref: ThemePreference) => {
    startTransition(() => {
      setState((prev) => ({ ...prev, themePreference: pref }))
    })
  }, [])


  useEffect(() => {
    const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY)
    mediaQuery.addEventListener("change", handleSystemThemeChange)
    window.addEventListener("storage", handleStorage)
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [handleSystemThemeChange, handleStorage])


  const { themePreference, systemTheme } = state
  const resolvedTheme = resolveThemePreference(themePreference, systemTheme)

  useEffect(() => {
    writeThemeState(themePreference, resolvedTheme)
  }, [resolvedTheme, themePreference])

  const value = useMemo(
    () => ({ themePreference, resolvedTheme, systemTheme, setThemePreference }),
    [themePreference, resolvedTheme, systemTheme, setThemePreference]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
