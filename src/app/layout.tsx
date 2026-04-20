import { Metadata, Viewport } from "next"
import { Space_Grotesk } from "next/font/google"
import { cookies } from "next/headers"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { Toaster } from "sonner"

import { AppProviders } from "@/components/providers/AppProviders"
import { BaseObjectivesInitializer } from "@/components/providers/BaseObjectivesInitializer"
import { getDictionarySync } from "@/lib/i18n"
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
  weight: ["300", "400", "500", "600", "700"],
})

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "es"
  const { t } = await getDictionarySync(locale)

  return {
    title: {
      default: "Mirror",
      template: "%s | Mirror",
    },
    description: t.app.common.metadataDescription,
    icons: {
      icon: "/icon.png",
      apple: "/favicon.ico",
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const initialLocale = cookieStore.get("NEXT_LOCALE")?.value ?? "es"
  const pref = cookieStore.get(THEME_PREFERENCE_COOKIE)?.value
  const res = cookieStore.get(THEME_RESOLVED_COOKIE)?.value

  const initialThemePreference = parseThemePreference(pref) ?? DEFAULT_THEME_PREFERENCE
  const systemFallbackTheme = parseResolvedTheme(res) ?? DEFAULT_RESOLVED_THEME
  const initialResolvedTheme = resolveThemePreference(
    initialThemePreference,
    systemFallbackTheme
  )

  return (
    <html
      lang={initialLocale}
      className={spaceGrotesk.variable}
      data-theme={initialResolvedTheme}
      data-theme-preference={initialThemePreference}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {buildThemeInitScript(initialThemePreference, initialResolvedTheme)}
        </Script>
        <Script id="popup-terminator" strategy="beforeInteractive">
          {`if (typeof window !== 'undefined' && window.opener && window.name === 'Google-Login') { window.opener.postMessage({ source: 'mirror-auth', status: 'success' }, window.location.origin); window.close(); }`}
        </Script>
      </head>
      <body
        className={`${spaceGrotesk.className} font-sans text-primary-text antialiased selection:bg-accent-purple/20 selection:text-accent-purple`}
      >
        <BaseObjectivesInitializer />
        <AppProviders
          initialThemePreference={initialThemePreference}
          initialResolvedTheme={initialResolvedTheme}
        >
          {children}
          <Toaster
            position="top-right"
            closeButton={true}
            expand={false}
            visibleToasts={3}
            toastOptions={{
              className: 'sonner-toast-custom',
            }}
          />
        </AppProviders>
        <SpeedInsights />
        {process.env.NODE_ENV === "development" && <DevScan />}
      </body>
    </html>
  )
}

async function DevScan() {
  const { ReactScan } = await import("@/components/performance/RootScan")
  return <ReactScan />
}