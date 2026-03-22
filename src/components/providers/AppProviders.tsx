"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ResolvedTheme, ThemePreference } from "@/lib/theme"
import { ThemeProvider } from "./ThemeProvider"
import { Toaster } from "sonner"

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
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          gap={8}
          toastOptions={{
            duration: 2000,
            classNames: {
              toast: "toast-surface",
              title: "toast-title",
              description: "toast-description",
              success: "toast-success",
              error: "toast-error",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
