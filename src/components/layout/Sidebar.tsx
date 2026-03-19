"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { motion } from "motion/react"
import Image from "next/image"
import { getNavItems } from "./nav-items"
import { useLanguageStore } from "@/store/useLanguageStore"

const SettingsModal = dynamic(() => import("./SettingsModal"), {
    ssr: false
})

interface SidebarProps {
    user: { name: string; email: string; avatar?: string }
}

export function Sidebar({ user }: SidebarProps) {
    const initial = (user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()
    const pathname = usePathname()
    const router = useRouter()
    const { t } = useLanguageStore()
    const navItems = getNavItems(t)

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
                                    className="absolute inset-0 bg-(--nav-active-bg) rounded-full shadow-premium-sm"
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
                <SettingsModal user={user}>
                    <button
                        className="cursor-pointer group relative flex h-11 w-11 items-center justify-center rounded-full bg-surface-elevated border border-border-soft text-[14px] font-bold text-primary-text transition-transform hover:scale-105 active:scale-95 focus:outline-none overflow-hidden"
                        aria-label="User menu"
                    >
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt={user.name || user.email}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        ) : (
                            initial
                        )}
                    </button>
                </SettingsModal>
            </div>
        </aside>
    )
}
