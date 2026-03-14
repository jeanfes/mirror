import { cn } from "@/lib/utils"

interface ProgressBarProps {
    value: number
    trackClassName?: string
    fillClassName?: string
    className?: string
    minFillPercent?: number
}

export function ProgressBar({
    value,
    trackClassName,
    fillClassName,
    className,
    minFillPercent = 0,
}: ProgressBarProps) {
    const safeValue = Number.isFinite(value) ? value : 0
    const clampedValue = Math.max(0, Math.min(100, safeValue))
    const width = Math.max(clampedValue, minFillPercent)

    return (
        <div className={cn("h-2 overflow-hidden rounded-full", trackClassName, className)}>
            <div className={cn("h-full rounded-full", fillClassName)} style={{ width: `${width}%` }} />
        </div>
    )
}
