import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface ToggleProps {
    checked: boolean
    onChange: (next: boolean) => void
    label: string
    className?: string
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
    return (
        <label
            className={twMerge(
                clsx(
                    "flex items-center justify-between min-h-9 py-1.5 px-3 rounded-xl border border-border-soft bg-white text-[12px] font-medium text-primary-text",
                    className
                )
            )}
        >
            <span>{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={clsx(
                    "relative shrink-0 w-10 h-[1.6rem] rounded-full overflow-hidden transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple/40",
                    checked ? "bg-brand-dark border-brand-dark" : "bg-slate-200 border-border-soft"
                )}
            >
                <span
                    className={clsx(
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-premium-sm transition-transform duration-200",
                        checked ? "translate-x-4" : "translate-x-0"
                    )}
                />
            </button>
        </label>
    )
}
