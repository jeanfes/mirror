"use client"

import { useEffect, useRef, useState } from "react"


const LOADING_MIN_DISPLAY_MS = 150

export function useLoadingDelay(active: boolean, delayMs = LOADING_MIN_DISPLAY_MS) {
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

export function LoadingOverlay({ show, label = "Loading..." }: { show: boolean, label?: string }) {
    if (!show) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-300"
            style={{ background: "var(--loading-overlay-bg)" }}
            role="status"
            aria-live="polite"
        >
            <div
                className="flex flex-col items-center gap-4 rounded-3xl border p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                style={{ background: "var(--loading-panel-bg)", borderColor: "var(--loading-panel-border)" }}
            >
                <div className="loading-spinner h-8 w-8" />
                <p className="text-[14px] font-semibold tracking-[-0.01em] text-primary-text">{label}</p>
            </div>
        </div>
    )
}
