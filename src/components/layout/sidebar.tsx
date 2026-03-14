"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
    Crown,
    CreditCard,
    History,
    Settings,
    Trash2,
    Users
} from "lucide-react"
import { motion } from "motion/react"
import { UserMenu } from "./UserMenu"

export const navItems = [
    { href: "/profiles", label: "Profiles", icon: Users },
    { href: "/history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/account", label: "Account", icon: CreditCard },
    { href: "/plans", label: "Plans", icon: Crown },
    { href: "/trash", label: "Trash", icon: Trash2 }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex w-min p-5 h-screen flex-col items-center justify-between py-5 overflow-y-auto custom-scrollbar">
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
                            className={clsx(
                                "relative inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                                isActive ? "text-white" : "text-slate-400 hover:text-slate-700"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute inset-0 bg-[#171b2d] rounded-full shadow-premium-sm"
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
                <UserMenu />
            </div>
        </aside>
    )
}
