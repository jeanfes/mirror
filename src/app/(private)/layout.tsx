import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { AppProviders } from "@/components/providers/AppProviders"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await getServerSession()
    if (!user) redirect("/login")


    return (
        <AppProviders>
            <div className="h-screen w-full flex flex-col md:grid md:grid-cols-[auto_1fr] overflow-hidden">
                <Sidebar />
                <main className="neo-panel flex h-full flex-col overflow-hidden rounded-none p-3 md:rounded-l-[50px] md:p-4">
                    <Navbar />
                    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">{children}</div>
                </main>
            </div>
        </AppProviders>
    )
}
