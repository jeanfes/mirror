"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            className={cn(
                "inline-flex h-10 items-center rounded-[12px] border border-[#E8ECF4] bg-white/70 p-1",
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
                "inline-flex items-center justify-center whitespace-nowrap rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-slate-600 transition-all data-[state=active]:bg-[#171b2d] data-[state=active]:text-white",
                className
            )}
            {...props}
        />
    )
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return <TabsPrimitive.Content className={cn("mt-4 outline-none", className)} {...props} />
}
