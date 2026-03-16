"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import clsx from "clsx"
import { AnimatePresence, motion } from "motion/react"
import { createPortal } from "react-dom"
import { navItems } from "./nav-items"

const SettingsModal = dynamic(() => import("./SettingsModal"), {
    ssr: false
})

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        navItems.forEach((item) => {
            router.prefetch(item.href)
        })
    }, [router])

    useEffect(() => {
        const originalOverflow = document.body.style.overflow

        if (isOpen) {
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [isOpen])

    const handleOpenSettingsFromSidebar = () => {
        setIsOpen(false)
        window.setTimeout(() => setIsSettingsOpen(true), 160)
    }

    const sidebarOverlay = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-40 flex">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Sidebar panel */}
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative z-10 flex h-dvh w-[min(82vw,320px)] flex-col overflow-y-auto border-r border-border-soft bg-surface-overlay-strong p-5 py-5 shadow-premium-md backdrop-blur-xl custom-scrollbar"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-light bg-surface-card">
                                <Image src="/icon.png" alt="Mirror logo" width={22} height={22} priority />
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-surface-elevated text-secondary-text shadow-premium-sm"
                                aria-label="Close menu"
                            >
                                <X className="h-4 w-4" />
                            </motion.button>
                        </div>

                        <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                                const Icon = item.icon

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={item.label}
                                        onClick={() => setIsOpen(false)}
                                        onMouseEnter={() => router.prefetch(item.href)}
                                        onFocus={() => router.prefetch(item.href)}
                                        onTouchStart={() => router.prefetch(item.href)}
                                        className={clsx(
                                            "relative flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-[13px] font-semibold transition-colors",
                                            isActive ? "text-white" : "text-secondary-text hover:bg-surface-hover hover:text-primary-dark"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicatorMobile"
                                                className="absolute inset-0 rounded-2xl bg-brand-dark shadow-premium-sm"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 450,
                                                    damping: 35
                                                }}
                                            />
                                        )}
                                        <Icon className="relative z-10 h-4.5 w-4.5" />
                                        <span className="relative z-10">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 border-t border-border-soft pt-4"
                        >
                            <button
                                type="button"
                                onClick={handleOpenSettingsFromSidebar}
                                className="cursor-pointer group relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-[14px] font-bold text-white transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                                aria-label="Open user settings"
                            >
                                U
                                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-accent-green" />
                            </button>
                        </motion.div>
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    )

    return (
        <div className="block md:hidden">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-md p-2 text-secondary-text hover:bg-surface-hover"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </motion.button>

            {typeof window !== "undefined" ? createPortal(sidebarOverlay, document.body) : null}

            <SettingsModal
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                user={{ name: "User Name", email: "user@example.com" }}
            >
                <span className="sr-only">Open settings</span>
            </SettingsModal>
        </div>
    )
}
