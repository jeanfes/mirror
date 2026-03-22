"use client"

import { useEffect, useRef, useState } from "react"
import { useLoadingStore } from "@/store/useLoadingStore"

const LOADING_MIN_DISPLAY_MS = 150

export function useLoadingDelay(active: boolean, delayMs = LOADING_MIN_DISPLAY_MS) {
    const [visible, setVisible] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current)

        if (active) {
            // Short delay before showing to avoid flicker
            timerRef.current = setTimeout(() => setVisible(true), 50)
        } else {
            // Keep visible for a minimum duration
            timerRef.current = setTimeout(() => setVisible(false), delayMs)
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [active, delayMs])

    return visible
}

export function LoadingOverlay({ show, label = "Cargando..." }: { show: boolean, label?: string }) {
    const setIsPageLoading = useLoadingStore((state) => state.setIsPageLoading)

    useEffect(() => {
        setIsPageLoading(show)
        return () => {
            if (show) setIsPageLoading(false)
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


