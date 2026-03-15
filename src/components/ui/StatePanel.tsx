"use client"

import type { ReactNode } from "react"
import { AlertTriangle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

type StatePanelTone = "neutral" | "error"

interface StatePanelProps {
    title: string
    description: string
    icon?: ReactNode
    tone?: StatePanelTone
    className?: string
    actionLabel?: string
    onAction?: () => void
}

const toneClasses: Record<StatePanelTone, string> = {
    neutral: "border-[#E8ECF4] bg-white/72 text-[#141824]",
    error: "border-[#fecaca] bg-[#fff7f7] text-[#7f1d1d]"
}

export function StatePanel({
    title,
    description,
    icon,
    tone = "neutral",
    className,
    actionLabel,
    onAction
}: StatePanelProps) {
    const resolvedIcon = icon ?? (tone === "error" ? <AlertTriangle className="h-6 w-6" /> : <Inbox className="h-6 w-6" />)

    return (
        <Card
            className={cn("rounded-[28px] p-6 text-center", toneClasses[tone], className)}
            role={tone === "error" ? "alert" : "status"}
            aria-live="polite"
        >
            <div className={cn("mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full", tone === "error" ? "bg-[#fee2e2]" : "bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(117,206,243,0.18))]")}
            >
                {resolvedIcon}
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-7 text-slate-600">{description}</p>

            {actionLabel && onAction ? (
                <Button className="mt-5" onClick={onAction} variant={tone === "error" ? "dangerSoft" : "primary"}>
                    {actionLabel}
                </Button>
            ) : null}
        </Card>
    )
}
