import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { ROUTES } from "@/lib/routes"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await getServerSession()
    if (!user) redirect(ROUTES.auth.login)


    return (
        <div className="h-screen w-full flex flex-col md:grid md:grid-cols-[auto_1fr]">
            <Sidebar />
            <main className="neo-panel flex h-full flex-col overflow-hidden rounded-none p-3 sm:p-4 md:rounded-l-[50px] md:p-5 lg:p-6">
                <Navbar />
                <div className="custom-scrollbar pt-3 min-h-0 flex-1 overflow-y-auto pb-8">{children}</div>
            </main>
        </div>
    )
}
