import type { ButtonHTMLAttributes } from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type ButtonVariant = "primary" | "secondary" | "ghost"
type ButtonSize = "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "neo-btn-primary",
    secondary: "neo-btn-muted",
    ghost: "bg-transparent text-slate-600 hover:bg-white/80 hover:text-slate-900"
}

const sizeClasses: Record<ButtonSize, string> = {
    md: "h-9 px-3.5 rounded-[12px] text-[13px]",
    lg: "h-10 px-4 rounded-[12px] text-[14px]"
}

export function Button({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={twMerge(
                clsx(
                    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/40 [&_svg]:shrink-0 [&_svg]:stroke-[2.2]",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )
            )}
            {...props}
        >
            {children}
        </button>
    )
}
