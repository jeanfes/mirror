"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import clsx from "clsx"
import { AnimatePresence, motion } from "motion/react"
import { navItems } from "./sidebar"
import { UserMenu } from "./UserMenu"

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="block md:hidden">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Sidebar panel */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="neo-panel relative z-50 flex h-screen w-20 flex-col items-center justify-between border-r border-border-soft bg-white/80 py-5 shadow-premium-md backdrop-blur-xl"
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute -right-12 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-white/90 text-slate-600 shadow-premium-sm"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </motion.button>

                            <div className="space-y-4 overflow-y-auto custom-scrollbar px-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                                    const Icon = item.icon

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={item.label}
                                            onClick={() => setIsOpen(false)}
                                            className={clsx(
                                                "relative flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                                                isActive ? "text-white" : "text-slate-400 hover:text-slate-700"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicatorMobile"
                                                    className="absolute inset-0 bg-brand-dark rounded-full shadow-premium-sm"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 450,
                                                        damping: 35
                                                    }}
                                                />
                                            )}
                                            <Icon className="relative z-10 h-5 w-5" />
                                        </Link>
                                    )
                                })}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4"
                            >
                                <UserMenu />
                            </motion.div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
