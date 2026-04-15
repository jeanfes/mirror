"use client"

import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ResolvedTheme, ThemePreference } from "@/lib/theme"
import { useLanguageStore } from "@/store/useLanguageStore"
import { ThemeProvider } from "./ThemeProvider"

interface AppProvidersProps {
  children: React.ReactNode
  initialThemePreference: ThemePreference
  initialResolvedTheme: ResolvedTheme
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 600_000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

function LanguageSync() {
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language])

  return null
}

export function AppProviders({
  children,
  initialThemePreference,
  initialResolvedTheme,
}: AppProvidersProps) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <ThemeProvider
      initialThemePreference={initialThemePreference}
      initialResolvedTheme={initialResolvedTheme}
    >
      <LanguageSync />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
