"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
    label: string
    value: string
}

interface SelectProps {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    className?: string
    triggerClassName?: string
    label?: string
}

export function Select({
    value,
    onChange,
    options,
    placeholder = "Select...",
    className = "",
    triggerClassName = "",
    label
}: SelectProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && (
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary-text">
                    {label}
                </span>
            )}
            <SelectPrimitive.Root value={value} onValueChange={onChange}>
                <SelectPrimitive.Trigger
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-xl border border-border-soft bg-surface-elevated px-3 py-2 text-[13px] font-medium text-primary-text transition-all hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent-purple/30 disabled:cursor-not-allowed disabled:opacity-50",
                        triggerClassName
                    )}
                >
                    <SelectPrimitive.Value placeholder={placeholder} />
                    <SelectPrimitive.Icon asChild>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        className="neo-card z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-[14px] border border-border-soft bg-surface-overlay-strong backdrop-blur-sm p-1 shadow-premium-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        position="popper"
                        sideOffset={5}
                    >
                        <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                            <ChevronUp className="h-4 w-4" />
                        </SelectPrimitive.ScrollUpButton>
                        <SelectPrimitive.Viewport className="h-(--radix-select-content-available-height) p-1 custom-scrollbar overflow-y-auto">
                            {options.map((option) => (
                                <SelectPrimitive.Item
                                    key={option.value}
                                    value={option.value}
                                    className="relative flex w-full cursor-default select-none items-center rounded-[10px] py-2 pl-8 pr-2 text-[13px] text-primary-text outline-none transition-colors hover:bg-surface-hover focus:bg-surface-hover data-disabled:pointer-events-none data-disabled:opacity-40"
                                >
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        <SelectPrimitive.ItemIndicator>
                                            <Check className="h-4 w-4 text-accent-purple" />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>
                                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                        <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                            <ChevronDown className="h-4 w-4" />
                        </SelectPrimitive.ScrollDownButton>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
        </div>
    )
}
