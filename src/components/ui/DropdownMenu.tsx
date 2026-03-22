"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export function DropdownMenuContent({
    className,
    sideOffset = 8,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                sideOffset={sideOffset}
                className={cn(
                    "neo-card z-50 min-w-44 rounded-[14px] border border-border-soft bg-surface-overlay-strong backdrop-blur-sm p-1.5 shadow-premium-md",
                    className
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    )
}

export function DropdownMenuItem({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) {
    return (
        <DropdownMenuPrimitive.Item
            className={cn(
                "relative flex cursor-default select-none items-center rounded-[10px] px-2.5 py-2 text-[13px] text-primary-text outline-none transition-colors hover:bg-surface-hover focus:bg-surface-hover data-disabled:pointer-events-none data-disabled:opacity-40",
                inset && "pl-8",
                className
            )}
            {...props}
        />
    )
}

export function DropdownMenuRadioItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
    return (
        <DropdownMenuPrimitive.RadioItem
            className={cn(
                "relative flex cursor-default select-none items-center rounded-[10px] py-2 pl-8 pr-2.5 text-[13px] text-primary-text outline-none transition-colors hover:bg-surface-hover focus:bg-surface-hover data-disabled:pointer-events-none data-disabled:opacity-40",
                className
            )}
            {...props}
        >
            <span className="absolute left-2 inline-flex h-4 w-4 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <Check className="h-3.5 w-3.5" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    )
}


