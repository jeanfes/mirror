"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ResolvedTheme, ThemePreference } from "@/lib/theme" 
import { ThemeProvider } from "./ThemeProvider"
import { useState } from "react"
import { Toaster } from "sonner"
import { LazyMotion, domAnimation } from "motion/react"

interface AppProvidersProps {
    children: React.ReactNode
    initialThemePreference: ThemePreference
    initialResolvedTheme: ResolvedTheme
}

export function AppProviders({ children, initialThemePreference, initialResolvedTheme }: AppProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        retry: 1,
                        refetchOnWindowFocus: false
                    },
                    mutations: {
                        retry: 0
                    }
                }
            })
    )

    return (
        <ThemeProvider initialThemePreference={initialThemePreference} initialResolvedTheme={initialResolvedTheme}>
            <QueryClientProvider client={queryClient}>
                <LazyMotion features={domAnimation}>
                    {children}
                </LazyMotion>
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
