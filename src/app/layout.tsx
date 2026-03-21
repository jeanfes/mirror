import { Space_Grotesk } from "next/font/google"
import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { AppProviders } from "@/components/providers/AppProviders"
import { getServerSession } from "@/lib/auth"
import { getDictionary } from "@/lib/i18n-server"
import { getNavItems } from "@/components/layout/nav-items"
import { ROUTES } from "@/lib/routes"
import {
    buildThemeInitScript,
    DEFAULT_RESOLVED_THEME,
    DEFAULT_THEME_PREFERENCE,
    parseResolvedTheme,
    parseThemePreference,
    resolveThemePreference,
    THEME_PREFERENCE_COOKIE,
    THEME_RESOLVED_COOKIE
} from "@/lib/theme"
import "../styles/globals.css"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    display: "swap"
})

export async function generateMetadata(): Promise<Metadata> {
    const user = await getServerSession()
    const headerList = await headers()
    const pathname = headerList.get("x-pathname") || ""
    const { t } = await getDictionary()

    let pageTitle = ""
    
    const navItems = getNavItems(t)
    const navItem = navItems.find(item => 
        pathname === item.href || (pathname.startsWith((item.href as string) + "/"))
    )
    
    if (navItem) {
        pageTitle = navItem.label
    } else {
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
        pageTitle = publicTitleMap[pathname] || ""
    }

    return {
        metadataBase: new URL(siteUrl),
        title: pageTitle ? {
            default: pageTitle,
            template: "%s | Mirror"
        } : {
            default: user ? "Mirror | Dashboard" : "Mirror | Landing",
            template: "%s | Mirror"
        },
        description: "Digital voice workspace for Mirror",
        icons: {
            icon: "/icon.png"
        },
        openGraph: {
            title: "Mirror",
            description: "Digital voice workspace for Mirror",
            url: "/",
            siteName: "Mirror",
            type: "website"
        },
        twitter: {
            card: "summary_large_image",
            title: "Mirror",
            description: "Digital voice workspace for Mirror"
        }
    }
}

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const initialThemePreference =
        parseThemePreference(cookieStore.get(THEME_PREFERENCE_COOKIE)?.value) ?? DEFAULT_THEME_PREFERENCE
    const systemFallbackTheme = parseResolvedTheme(cookieStore.get(THEME_RESOLVED_COOKIE)?.value) ?? DEFAULT_RESOLVED_THEME
    const initialResolvedTheme = resolveThemePreference(initialThemePreference, systemFallbackTheme)

    return (
        <html
            lang="en"
            data-theme={initialResolvedTheme}
            data-theme-preference={initialThemePreference}
            suppressHydrationWarning
            style={{ colorScheme: initialResolvedTheme }}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: buildThemeInitScript(initialThemePreference, initialResolvedTheme) }} />
            </head>
            <body className={`${spaceGrotesk.className} bg-bg-main text-primary-text antialiased`}>
                <AppProviders initialThemePreference={initialThemePreference} initialResolvedTheme={initialResolvedTheme}>
                    {children}
                </AppProviders>
            </body>
        </html>
    )
}
