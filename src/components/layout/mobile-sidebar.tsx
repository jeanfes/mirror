"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import clsx from "clsx"
import { navItems } from "./sidebar"
import { UserMenu } from "./UserMenu"

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="block md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Sidebar panel */}
                    <aside className="relative z-50 flex h-screen w-20 flex-col items-center justify-between bg-white py-5 shadow-xl transition-transform">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -right-12 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>

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
                                            "flex h-12 w-12 items-center justify-center rounded-full transition-all",
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
                        
                        <div className="mt-4">
                            <UserMenu />
                        </div>
                    </aside>
                </div>
            )}
        </div>
    )
}
