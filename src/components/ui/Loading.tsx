"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

// Keep loading visible long enough to avoid flash/flicker when data resolves quickly.
const TEMPORARY_LOADING_DELAY_MS = 200

interface LoadingProps {
    className?: string
}

interface LoadingPageProps extends LoadingProps {
    fullScreen?: boolean
}

interface LoadingInlineProps extends LoadingProps {
    label?: string
}

function SkeletonLine({ className }: LoadingProps) {
    return <div className={cn("loading-shimmer rounded-full bg-white/75", className)} aria-hidden="true" />
}

function SkeletonBlock({ className }: LoadingProps) {
    return <div className={cn("loading-shimmer rounded-3xl bg-white/75", className)} aria-hidden="true" />
}

export function LoadingInline({ className, label = "Loading..." }: LoadingInlineProps) {
    return (
        <span className={cn("inline-flex items-center gap-2", className)} role="status" aria-live="polite">
            <span className="loading-spinner h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
        </span>
    )
}

function LoadingSurface({ className }: LoadingProps) {
    return (
        <section className={cn("space-y-6", className)} aria-busy="true" aria-live="polite">
            <section className="workspace-hero-shell">
                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div className="space-y-4">
                        <SkeletonLine className="h-12 w-full max-w-xl rounded-2xl" />
                        <SkeletonLine className="h-12 w-[88%] max-w-lg rounded-2xl" />
                        <SkeletonLine className="h-4 w-full max-w-2xl" />
                        <SkeletonLine className="h-4 w-[82%] max-w-xl" />
                        <div className="flex flex-wrap gap-3 pt-2">
                            <SkeletonLine className="h-10 w-34 rounded-2xl" />
                            <SkeletonLine className="h-10 w-40 rounded-2xl" />
                            <SkeletonLine className="h-10 w-32 rounded-2xl" />
                        </div>
                    </div>

                    <Card className="h-60 border-white/55 bg-white/18" elevated>
                        <div className="space-y-4">
                            <SkeletonLine className="h-5 w-28" />
                            <SkeletonLine className="h-12 w-40 rounded-2xl" />
                            <SkeletonBlock className="h-24 bg-white/28" />
                            <div className="grid grid-cols-2 gap-3">
                                <SkeletonBlock className="h-18 bg-white/24" />
                                <SkeletonBlock className="h-18 bg-white/24" />
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="p-5"><SkeletonBlock className="h-24" /></Card>
                <Card className="p-5"><SkeletonBlock className="h-24" /></Card>
                <Card className="p-5"><SkeletonBlock className="h-24" /></Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <Card className="p-5"><SkeletonBlock className="h-34" /></Card>
                <Card className="p-5"><SkeletonBlock className="h-34" /></Card>
            </section>
        </section>
    )
}

export function LoadingPage({ className, fullScreen = false }: LoadingPageProps) {
    return (
        <div className={cn(fullScreen ? "mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12" : "space-y-6", className)}>
            {fullScreen ? (
                <div className="w-full max-w-5xl">
                    <LoadingSurface />
                </div>
            ) : (
                <LoadingSurface />
            )}
        </div>
    )
}

export function useLoadingDelay(active: boolean, delayMs = TEMPORARY_LOADING_DELAY_MS) {
    const [visible, setVisible] = useState(active)
    const visibleSinceRef = useRef<number | null>(null)

    useEffect(() => {
        if (active) {
            visibleSinceRef.current = visibleSinceRef.current ?? Date.now()
            if (!visible) {
                const timeoutId = window.setTimeout(() => setVisible(true), 0)
                return () => window.clearTimeout(timeoutId)
            }
            return
        }

        if (!visible) {
            visibleSinceRef.current = null
            return
        }

        const visibleSince = visibleSinceRef.current ?? Date.now()
        const elapsedMs = Date.now() - visibleSince
        const remainingMs = Math.max(delayMs - elapsedMs, 0)

        const timeoutId = window.setTimeout(() => {
            setVisible(false)
            visibleSinceRef.current = null
        }, remainingMs)

        return () => window.clearTimeout(timeoutId)
    }, [active, delayMs, visible])

    return visible
}
