import { Space_Grotesk } from "next/font/google"
import type { Metadata } from "next"
import "../styles/globals.css"

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "Mirror Web",
    description: "Digital voice workspace for Mirror"
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}
