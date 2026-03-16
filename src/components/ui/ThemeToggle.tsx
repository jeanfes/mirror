"use client"

import { LaptopMinimal, MoonStar, SunMedium } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/ThemeProvider"
import type { ThemePreference } from "@/lib/theme"

const themeOptions: Array<{
    value: ThemePreference
    label: string
    icon: typeof SunMedium
}> = [
        { value: "light", label: "Light", icon: SunMedium },
        { value: "dark", label: "Dark", icon: MoonStar },
        { value: "system", label: "System", icon: LaptopMinimal }
    ]

interface ThemeSegmentedControlProps {
    className?: string
    compact?: boolean
}

export function ThemeSegmentedControl({ className, compact = false }: ThemeSegmentedControlProps) {
    const { themePreference, setThemePreference } = useTheme()

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 rounded-full border border-border-soft bg-surface-subtle p-1",
                className
            )}
            role="radiogroup"
            aria-label="Theme preference"
        >
            {themeOptions.map((option) => {
                const Icon = option.icon
                const isActive = themePreference === option.value

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setThemePreference(option.value)}
                        className={cn(
                            "inline-flex items-center justify-center rounded-full border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/35",
                            compact ? "h-8 w-8" : "h-9 min-w-27 gap-2 px-3.5",
                            isActive
                                ? "border-border-light bg-surface-elevated text-primary-dark shadow-premium-sm"
                                : "border-transparent bg-transparent text-secondary-text hover:border-border-soft hover:bg-surface-hover hover:text-primary-dark"
                        )}
                        aria-label={option.label}
                    >
                        <Icon className="h-4 w-4" />
                        {!compact ? <span className="text-[12px] font-semibold">{option.label}</span> : null}
                    </button>
                )
            })}
        </div>
    )
}

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    return <ThemeSegmentedControl compact className={className} />
}
