import { Metadata, Viewport } from "next"
import { Space_Grotesk } from "next/font/google"
import { cookies } from "next/headers"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { Toaster } from "sonner"

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
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Mirror",
    template: "%s | Mirror",
  },
  description: "Workspace inteligente con IA local-first.",
  icons: {
    icon: "/icon.png",
    apple: "/favicon.ico",
  },
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
        className={`${spaceGrotesk.className} font-sans bg-bg-main text-primary-text antialiased selection:bg-accent-purple/20 selection:text-accent-purple`}
      >
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