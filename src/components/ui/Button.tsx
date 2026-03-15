"use client"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { LoadingInline } from "@/components/ui/Loading"

type ButtonVariant = "primary" | "secondary" | "ghost" | "dangerSoft"
type ButtonSize = "md" | "lg"

import { motion } from "motion/react"
import type { HTMLMotionProps } from "motion/react"

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    loadingLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "neo-btn-primary",
    secondary: "neo-btn-muted",
    ghost: "bg-transparent text-slate-600 hover:bg-white/80 hover:text-slate-900",
    dangerSoft: "neo-btn-danger-soft"
}

const sizeClasses: Record<ButtonSize, string> = {
    md: "h-9 px-3.5 rounded-[12px] text-[13px]",
    lg: "h-10 px-4 rounded-[12px] text-[14px]"
}

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    loadingLabel = "Working...",
    className,
    children,
    disabled,
    "aria-busy": ariaBusy,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isDisabled}
            aria-busy={ariaBusy ?? loading}
            className={twMerge(
                clsx(
                    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple/40 [&_svg]:shrink-0 [&_svg]:stroke-[2.2]",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )
            )}
            {...props}
        >
            {loading ? <LoadingInline label={loadingLabel} /> : children}
        </motion.button>
    )
}
