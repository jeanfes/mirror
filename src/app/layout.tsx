import { Space_Grotesk } from "next/font/google"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { AppProviders } from "@/components/providers/AppProviders"
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
    subsets: ["latin"]
})

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Mirror | Landing",
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
            <body className={`${spaceGrotesk.variable} bg-bg-main text-primary-text antialiased`}>
                <AppProviders initialThemePreference={initialThemePreference} initialResolvedTheme={initialResolvedTheme}>
                    {children}
                </AppProviders>
            </body>
        </html>
    )
}
