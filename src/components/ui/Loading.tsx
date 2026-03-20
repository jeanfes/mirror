"use client"

import { useEffect, useRef, useState } from "react"
import { useLoadingStore } from "@/store/useLoadingStore"

const LOADING_MIN_DISPLAY_MS = 150

export function useLoadingDelay(active: boolean, delayMs = LOADING_MIN_DISPLAY_MS) {
    const [visible, setVisible] = useState(active)
    const visibleSinceRef = useRef<number | null>(null)

    useEffect(() => {
        if (active) {
            visibleSinceRef.current = visibleSinceRef.current ?? Date.now()
            if (!visible) {
                const timeoutId = window.setTimeout(() => setVisible(true), 50)
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

export function LoadingOverlay({ show, label = "Cargando..." }: { show: boolean, label?: string }) {
    const setIsPageLoading = useLoadingStore((state) => state.setIsPageLoading)

    useEffect(() => {
        if (show) {
            setIsPageLoading(true)
            return () => setIsPageLoading(false)
        }
    }, [show, setIsPageLoading])

    if (!show) return null

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300 rounded-[inherit]"
            style={{ 
                background: "rgba(var(--bg-main-rgb), 0.65)"
            }}
            role="status"
            aria-live="polite"
        >
            <div
                className="flex flex-col items-center gap-4 rounded-3xl border border-border-soft p-8 shadow-premium-lg backdrop-blur-xl bg-surface-overlay animate-in fade-in zoom-in duration-300"
            >
                <div className="loading-spinner h-10 w-10 text-primary-dark" />
                <p className="text-[15px] font-bold tracking-tight text-primary-dark">{label}</p>
            </div>
        </div>
    )
}

export function PageLoadingIndicator() {
    const setIsPageLoading = useLoadingStore((state) => state.setIsPageLoading)

    useEffect(() => {
        setIsPageLoading(true)
        return () => setIsPageLoading(false)
    }, [setIsPageLoading])

    return null
}


