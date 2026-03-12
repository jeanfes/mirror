"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
    BarChart3,
    Bot,
    CalendarDays,
    CreditCard,
    History,
    Settings,
    Trash2,
    User,
    Users
} from "lucide-react"

const navItems = [
    { href: "/assistant", label: "Home", icon: Bot },
    { href: "/planner", label: "Planner", icon: CalendarDays },
    { href: "/team", label: "Team", icon: Users },
    { href: "/profiles", label: "Profiles", icon: User },
    { href: "/history", label: "History", icon: History },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/account", label: "Account", icon: CreditCard },
    { href: "/plans", label: "Plans", icon: Bot },
    { href: "/trash", label: "Trash", icon: Trash2 }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-min p-3 flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-between py-5">
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
                                "inline-flex h-12 w-12 items-center justify-center rounded-full transition-all",
                                isActive
                                    ? "bg-[#171b2d] text-white shadow-premium-sm"
                                    : "bg-white/90 text-slate-400 hover:bg-white hover:text-slate-700"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                        </Link>
                    )
                })}
            </div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white">
                N
            </div>
        </aside>
    )
}
