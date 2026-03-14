"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogPortal({ children }: { children: React.ReactNode }) {
    return <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>
}

export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogContent({
    className,
    children,
    hideCloseButton = false,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { hideCloseButton?: boolean }) {
    return (
        <DialogPortal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/55 backdrop-blur-md animate-in fade-in duration-300" />
            <DialogPrimitive.Content
                className={cn(
                    "neo-panel fixed left-1/2 top-1/2 z-50 w-[min(94vw,900px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-4xl backdrop-blur-xl ring-1 ring-black/8 shadow-premium-lg outline-none",
                    className
                )}
                {...props}
            >
                {children}
                {!hideCloseButton && (
                    <DialogPrimitive.Close
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/90 hover:text-slate-800"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    )
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("mb-4 space-y-1", className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("mt-5 flex justify-end gap-2", className)} {...props} />
}
