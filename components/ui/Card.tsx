import type { HTMLAttributes } from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    elevated?: boolean
}

export function Card({ elevated = false, className, children, ...props }: CardProps) {
    return (
        <div
            className={twMerge(
                clsx("neo-card p-4", elevated ? "shadow-premium-md" : "shadow-premium-sm", className)
            )}
            {...props}
        >
            {children}
        </div>
    )
}
