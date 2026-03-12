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
    Sparkles,
    Trash2,
    User,
    Users
} from "lucide-react"

const navItems = [
    { href: "/dashboard", label: "Home", icon: Bot },
    { href: "/dashboard/assistant", label: "Assistant", icon: Sparkles },
    { href: "/dashboard/planner", label: "Planner", icon: CalendarDays },
    { href: "/dashboard/team", label: "Team", icon: Users },
    { href: "/dashboard/personas", label: "Personas", icon: User },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/account", label: "Account", icon: CreditCard },
    { href: "/dashboard/plans", label: "Plans", icon: Bot },
    { href: "/dashboard/trash", label: "Trash", icon: Trash2 }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="neo-panel flex min-h-0 flex-col items-center justify-between rounded-[22px] px-1.5 py-2">
            <nav className="custom-scrollbar flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto">
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
                                "inline-flex h-10 w-10 items-center justify-center rounded-full transition-all",
                                isActive
                                    ? "bg-[#171b2d] text-white shadow-premium-sm"
                                    : "bg-white/90 text-slate-400 hover:bg-white hover:text-slate-700"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                        </Link>
                    )
                })}
            </nav>

            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white">
                N
            </div>
        </aside>
    )
}
