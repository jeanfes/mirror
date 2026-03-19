"use client"

import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { usePathname } from "next/navigation"
import { Button } from "../ui/Button"
import { MobileSidebar } from "./MobileSidebar"
import { useAccount } from "@/features/billing/hooks/useAccount"
import { getNavItems } from "./nav-items"
import { useLanguageStore } from "@/store/useLanguageStore"

export function Navbar() {
    const { data: account, isLoading } = useAccount()
    const pathname = usePathname()
    const { t } = useLanguageStore()
    const navItems = getNavItems(t)

    const currentSection =
        navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? t.app.navigation.profiles

    if (isLoading) return null

    return (
        <header className="relative flex pb-2 pt-0 w-full shrink-0 items-center justify-between border-b border-border-soft">
            <div className="flex min-w-0 items-center gap-3">
                <MobileSidebar />
                <h1 className="truncate text-[16px] font-semibold tracking-[-0.01em] text-primary-text">{currentSection}</h1>
            </div>

            {account?.plan === "Free" ? (
                <Link href={ROUTES.private.plans}>
                    <Button size="md" className="h-8.5 rounded-full px-4 text-[12px]">
                        Upgrade
                    </Button>
                </Link>
            ) : <div className="h-8 w-22.5" aria-hidden="true" />}
        </header>
    )
}

