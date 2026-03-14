"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

export function AppProviders({ children }: { children: React.ReactNode }) {
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
    )
}
