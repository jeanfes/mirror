"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            className={cn(
                "inline-flex h-10 items-center rounded-xl border border-border-soft bg-surface-base p-1",
                className
            )}
            {...props}
        />
    )
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-secondary-text transition-all data-[state=active]:bg-(--button-primary-bg) data-[state=active]:text-(--button-primary-text)",
                className
            )}
            {...props}
        />
    )
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return <TabsPrimitive.Content className={cn("mt-4 outline-none", className)} {...props} />
}
