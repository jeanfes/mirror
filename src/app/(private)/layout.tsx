import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await getServerSession()
    if (!user) redirect("/login")


    return (
        <div className="min-h-screen">
            <div className="min-h-screen grid md:grid-cols-[auto_1fr]">
                <Sidebar />
                <main className="neo-panel h-full overflow-hidden rounded-l-[50px] p-3 md:p-4">
                    <Navbar />
                    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">{children}</div>
                </main>
            </div>
        </div>
    )
}
