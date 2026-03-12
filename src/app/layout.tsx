import { Space_Grotesk } from "next/font/google"
import type { Metadata } from "next"
import "../styles/globals.css"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Mirror Web",
        template: "%s | Mirror"
    },
    description: "Digital voice workspace for Mirror",
    openGraph: {
        title: "Mirror Web",
        description: "Digital voice workspace for Mirror",
        url: "/",
        siteName: "Mirror",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Mirror Web",
        description: "Digital voice workspace for Mirror"
    }
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}
