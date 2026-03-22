"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
    DEFAULT_RESOLVED_THEME,
    DEFAULT_THEME_PREFERENCE,
    getCookieValue,
    parseThemePreference,
    resolveThemePreference,
    THEME_MEDIA_QUERY,
    THEME_PREFERENCE_COOKIE,
    THEME_RESOLVED_COOKIE,
    THEME_STORAGE_KEY,
    type ResolvedTheme,
    type ThemePreference
} from "@/lib/theme"

interface ThemeContextValue {
    themePreference: ThemePreference
    resolvedTheme: ResolvedTheme
    systemTheme: ResolvedTheme
    setThemePreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function writeThemeState(preference: ThemePreference, resolvedTheme: ResolvedTheme) {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.dataset.themePreference = preference
    document.documentElement.style.colorScheme = resolvedTheme
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    document.cookie = `${THEME_PREFERENCE_COOKIE}=${preference}; path=/; max-age=31536000; SameSite=Lax`
    document.cookie = `${THEME_RESOLVED_COOKIE}=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`
}

function getSystemTheme(): ResolvedTheme {
    return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light"
}

interface ThemeProviderProps {
    children: React.ReactNode
    initialThemePreference: ThemePreference
    initialResolvedTheme: ResolvedTheme
}

export function ThemeProvider({ children, initialThemePreference, initialResolvedTheme }: ThemeProviderProps) {
    const [state, setState] = useState(() => ({
        themePreference: initialThemePreference,
        systemTheme: initialResolvedTheme
    }))
    const { themePreference, systemTheme } = state

    useEffect(() => {
        const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY)

        const syncFromEnvironment = () => {
            const storedPreference = parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY))
            const cookiePreference = parseThemePreference(getCookieValue(THEME_PREFERENCE_COOKIE, document.cookie))
            const nextPreference = storedPreference ?? cookiePreference ?? initialThemePreference ?? DEFAULT_THEME_PREFERENCE
            const nextSystemTheme = getSystemTheme()

            setState({
                themePreference: nextPreference,
                systemTheme: nextSystemTheme
            })
        }

        const handleSystemThemeChange = () => {
            setState(prev => ({ ...prev, systemTheme: getSystemTheme() }))
        }

        const handleStorage = (event: StorageEvent) => {
            if (event.key !== THEME_STORAGE_KEY) {
                return
            }

            const nextPreference = parseThemePreference(event.newValue)
            if (nextPreference) {
                setState(prev => ({ ...prev, themePreference: nextPreference }))
            }
        }

        syncFromEnvironment()
        mediaQuery.addEventListener("change", handleSystemThemeChange)
        window.addEventListener("storage", handleStorage)

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange)
            window.removeEventListener("storage", handleStorage)
        }
    }, [initialThemePreference])

    const resolvedTheme = resolveThemePreference(themePreference, systemTheme)

    useEffect(() => {
        writeThemeState(themePreference, resolvedTheme)
    }, [resolvedTheme, themePreference])

    const value = useMemo(() => ({
        themePreference,
        resolvedTheme,
        systemTheme,
        setThemePreference: (pref: ThemePreference) => setState(prev => ({ ...prev, themePreference: pref }))
    }), [themePreference, resolvedTheme, systemTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider")
    }

    return context
}

export function getInitialResolvedTheme(preference: ThemePreference, fallbackResolvedTheme?: ResolvedTheme) {
    return resolveThemePreference(preference, fallbackResolvedTheme ?? DEFAULT_RESOLVED_THEME)
}
