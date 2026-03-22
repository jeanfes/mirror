"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLanguageStore } from "@/store/useLanguageStore"
import { getNavItems } from "./nav-items"
import { ROUTES } from "@/lib/routes"

export function PageTitle() {
    const pathname = usePathname()
    const { t } = useLanguageStore()
    
    const pageTitle = (() => {
        if (!pathname) return ""
        const navItems = getNavItems(t)
        const navItem = navItems.find(item => 
            pathname === item.href || (pathname.startsWith((item.href as string) + "/"))
        )

        if (navItem) {
            return navItem.label
        }

        const publicTitleMap: Record<string, string> = {
            [ROUTES.public.index]: t.hero.badge,
            [ROUTES.public.landing]: t.hero.badge,
            [ROUTES.public.pricing]: t.header.pricing,
            [ROUTES.public.features]: t.header.features,
            [ROUTES.public.faq]: t.header.faq,
            [ROUTES.public.contact]: t.header.contact,
            [ROUTES.public.terms]: "Terms",
            [ROUTES.public.privacy]: "Privacy",
            [ROUTES.auth.login]: t.auth.loginTitle,
            [ROUTES.auth.register]: t.auth.registerTitle,
            [ROUTES.auth.forgotPassword]: t.auth.forgotPasswordTitle,
            [ROUTES.auth.resetPassword]: t.auth.resetPasswordTitle,
        }
        return publicTitleMap[pathname] || ""
    })()

    useEffect(() => {
        if (pageTitle) {
            document.title = `${pageTitle} | Mirror`
        }
    }, [pageTitle])

    if (!pathname) return null

    return null
}
