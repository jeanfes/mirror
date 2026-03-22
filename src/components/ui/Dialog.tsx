"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
function DialogPortal({ children }: { children: React.ReactNode }) {
    return <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>
}

export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

type DialogLayer = "base" | "priority"

const dialogLayerStyles: Record<DialogLayer, { overlay: string; content: string }> = {
    base: {
        overlay: "z-40 bg-[var(--dialog-overlay-base)] backdrop-blur-sm",
        content: "z-50"
    },
    priority: {
        overlay: "z-70 bg-[var(--dialog-overlay-priority)] backdrop-blur-md",
        content: "z-80"
    }
}

export function DialogContent({
    className,
    children,
    hideCloseButton = false,
    layer = "base",
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { hideCloseButton?: boolean; layer?: DialogLayer }) {
    const layerStyles = dialogLayerStyles[layer]

    return (
        <DialogPortal>
            <DialogPrimitive.Overlay className={cn("fixed inset-0 animate-in fade-in duration-300", layerStyles.overlay)} />
            <DialogPrimitive.Content
                className={cn(
                    "neo-panel fixed left-1/2 top-1/2 w-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-4xl backdrop-blur-lg ring-1 ring-black/8 shadow-premium-lg outline-none",
                    layerStyles.content,
                    className
                )}
                {...props}
            >
                {children}
                {!hideCloseButton && (
                    <DialogPrimitive.Close
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-secondary-text transition-colors hover:bg-surface-hover hover:text-primary-dark"
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
