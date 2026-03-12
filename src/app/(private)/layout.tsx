import { getSafeServerSession } from "@/lib/auth-session"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await getSafeServerSession()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="h-dvh overflow-hidden px-3 py-3 md:px-4 md:py-4">
            <div className="neo-shell dashboard-shell grid h-full gap-3 p-2.5 md:grid-cols-[62px_minmax(0,1fr)] md:gap-3.5 md:p-3">
                <Sidebar />
                <main className="neo-panel h-full overflow-hidden rounded-4xl p-3 md:p-4">
                    <div className="flex h-full min-h-0 flex-col rounded-[26px] border border-[#E5E9F2] bg-white/78 shadow-premium-sm">
                        <Navbar />
                        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    )
}
