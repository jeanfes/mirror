import { twMerge } from "tailwind-merge"
import * as React from "react"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId

    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[12px] font-bold uppercase tracking-[0.12em] text-secondary-text transition-colors group-focus-within:text-accent-purple"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={twMerge(
            "flex min-h-20 w-full rounded-2xl border border-border-soft bg-surface-elevated px-4 py-3 text-[13px] font-medium text-primary-text transition-all duration-200 placeholder:text-muted-text hover:border-border-medium focus:border-accent-purple/40 focus:ring-4 focus:ring-accent-purple/8 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            error && "border-danger/50 focus:border-danger/40 focus:ring-danger/8",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[11px] font-medium text-danger animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
