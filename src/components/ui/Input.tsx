import * as React from "react"
import { twMerge } from "tailwind-merge"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, suffix, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-bold uppercase tracking-[0.12em] text-secondary-text transition-colors group-focus-within:text-accent-purple"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-secondary-text transition-colors group-focus-within:text-accent-purple">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={twMerge(
              "flex h-11 w-full rounded-2xl border border-border-soft bg-surface-elevated px-4 text-[13px] font-medium text-primary-text transition-all duration-200 placeholder:text-muted-text hover:border-border-medium focus:border-accent-purple/40 focus:ring-4 focus:ring-accent-purple/8 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-11",
              suffix && "pr-11",
              error && "border-danger/50 focus:border-danger/40 focus:ring-danger/8",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-4 text-secondary-text transition-colors group-focus-within:text-accent-purple">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] font-medium text-danger animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
