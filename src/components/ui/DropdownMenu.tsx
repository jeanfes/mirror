"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronDown } from "lucide-react"
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
        </DropdownMenuPrimitive.CheckboxItem>
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

export const DropdownMenuLabel = DropdownMenuPrimitive.Label
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator

export function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
}) {
    return (
        <DropdownMenuPrimitive.SubTrigger
            className={cn(
                "flex cursor-default select-none items-center rounded-[10px] px-2.5 py-2 text-[13px] outline-none focus:bg-surface-hover data-[state=open]:bg-surface-hover",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="ml-auto h-4 w-4 -rotate-90 opacity-50" />
        </DropdownMenuPrimitive.SubTrigger>
    )
}

export function DropdownMenuSubContent({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
    return (
        <DropdownMenuPrimitive.SubContent
            className={cn(
                "neo-card z-50 min-w-44 overflow-hidden rounded-[14px] border border-border-soft bg-surface-overlay-strong backdrop-blur-sm p-1 shadow-premium-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    )
}

export function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
            {...props}
        />
    )
}
