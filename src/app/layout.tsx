import { Space_Grotesk } from "next/font/google"
import { cookies } from "next/headers"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { AppProviders } from "@/components/providers/AppProviders"
import {
  THEME_PREFERENCE_COOKIE,
  THEME_RESOLVED_COOKIE,
  DEFAULT_THEME_PREFERENCE,
  DEFAULT_RESOLVED_THEME,
  parseThemePreference,
  parseResolvedTheme,
  resolveThemePreference,
  buildThemeInitScript,
} from "@/lib/theme"
import "../styles/globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "700"],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const pref = cookieStore.get(THEME_PREFERENCE_COOKIE)?.value
  const res = cookieStore.get(THEME_RESOLVED_COOKIE)?.value

  const initialThemePreference =
    parseThemePreference(pref) ?? DEFAULT_THEME_PREFERENCE
  const systemFallbackTheme =
    parseResolvedTheme(res) ?? DEFAULT_RESOLVED_THEME
  const initialResolvedTheme = resolveThemePreference(
    initialThemePreference,
    systemFallbackTheme
  )

  return (
    <html
      lang="es"
      className={spaceGrotesk.variable}
      data-theme={initialResolvedTheme}
      data-theme-preference={initialThemePreference}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {buildThemeInitScript(initialThemePreference, initialResolvedTheme)}
        </Script>
      </head>
      <body
        className={`${spaceGrotesk.className} bg-bg-main text-primary-text antialiased`}
      >
        <AppProviders
          initialThemePreference={initialThemePreference}
          initialResolvedTheme={initialResolvedTheme}
        >
          {children}
        </AppProviders>
        <SpeedInsights />
        {/* ReactScan — only injected in development */}
        {process.env.NODE_ENV === "development" && <DevScan />}
      </body>
    </html>
  )
}

// Lazy-loaded only in development so it never ships to production
async function DevScan() {
  const { ReactScan } = await import("@/components/performance/RootScan")
  return <ReactScan />
}
