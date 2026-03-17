"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { motion } from "motion/react"
import { navItems } from "./nav-items"

const SettingsModal = dynamic(() => import("./SettingsModal"), {
    ssr: false
})

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        navItems.forEach((item) => {
            router.prefetch(item.href)
        })
    }, [router])

    return (
        <aside className="hidden md:flex h-screen w-min flex-col items-center justify-between overflow-y-auto pt-5 p-4.5 custom-scrollbar">
            <div className="space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            aria-label={item.label}
                            onMouseEnter={() => router.prefetch(item.href)}
                            onFocus={() => router.prefetch(item.href)}
                            className={clsx(
                                "relative inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                                isActive ? "text-white" : "text-secondary-text hover:text-primary-dark"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute inset-0 bg-[var(--nav-active-bg)] rounded-full shadow-premium-sm"
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
            <div className="mt-auto">
                <SettingsModal user={{ name: "User Name", email: "user@example.com" }}>
                    <button
                        className="cursor-pointer group relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-[14px] font-bold text-white transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                        aria-label="User menu"
                    >
                        U
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-accent-green" />
                    </button>
                </SettingsModal>
            </div>
        </aside>
    )
}
