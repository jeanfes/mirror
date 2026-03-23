import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Loader2 } from "lucide-react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "dangerSoft"
type ButtonSize = "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    loadingLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "neo-btn-primary",
    secondary: "neo-btn-muted",
    ghost: "bg-transparent text-secondary-text hover:bg-surface-hover hover:text-primary-dark",
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
    loadingLabel,
    className,
    children,
    disabled,
    "aria-busy": ariaBusy,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading

    return (
        <button
            disabled={isDisabled}
            aria-busy={ariaBusy ?? loading}
            aria-label={loading ? (loadingLabel || "Working...") : undefined}
            className={twMerge(
                clsx(
                    "relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple/40 [&_svg]:shrink-0 [&_svg]:stroke-[2.2]",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )
            )}
            {...props}
        >
            <span className={clsx("transition-opacity duration-200 flex items-center justify-center gap-2 w-full", loading ? "opacity-0" : "opacity-100")}>
                {children as React.ReactNode}
            </span>
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin opacity-80" aria-hidden="true" />
                </span>
            )}
        </button>
    )
}
