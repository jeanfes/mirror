"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
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
                    "neo-card z-50 min-w-44 rounded-[14px] border border-[#E8ECF4] p-1.5 shadow-premium-md",
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
                "relative flex cursor-default select-none items-center rounded-[10px] px-2.5 py-2 text-[13px] text-slate-700 outline-none transition-colors hover:bg-white focus:bg-white data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                inset && "pl-8",
                className
            )}
            {...props}
        />
    )
}

export function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            checked={checked}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-[10px] py-2 pl-8 pr-2.5 text-[13px] text-slate-700 outline-none transition-colors hover:bg-white focus:bg-white data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
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
        </DropdownMenuPrimitive.CheckboxItem>
    )
}

export const DropdownMenuLabel = DropdownMenuPrimitive.Label
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
