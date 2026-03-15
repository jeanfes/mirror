"use client"

import { useEffect, useRef, useState } from "react"


const TEMPORARY_LOADING_DELAY_MS = 2000

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

export function LoadingOverlay({ show, label = "Loading..." }: { show: boolean, label?: string }) {
    const visible = useLoadingDelay(show, 150)
    
    if (!visible) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-md transition-all duration-300"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200/60 bg-white/90 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl">
                <div className="loading-spinner h-8 w-8 border-slate-200! border-t-brand-dark!" />
                <p className="text-[14px] font-semibold tracking-[-0.01em] text-slate-700">{label}</p>
            </div>
        </div>
    )
}
