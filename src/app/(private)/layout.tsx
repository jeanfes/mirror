import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { ROUTES } from "@/lib/routes"
import { SettingsSyncBridge } from "@/features/settings/components/SettingsSyncBridge"
import { UserHydrator } from "@/components/providers/UserHydrator"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await getServerSession()
    if (!user) redirect(ROUTES.auth.login)


    return (
        <div className="h-screen w-full flex flex-col md:grid md:grid-cols-[auto_1fr]">
            <UserHydrator user={{ 
                id: user.id,
                name: user.user_metadata?.name ?? "", 
                email: user.email ?? "", 
                avatar: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? "" 
            }} />
            <Sidebar user={{ name: user.user_metadata?.name ?? "", email: user.email ?? "", avatar: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? "" }} />
            <main className="neo-panel flex h-full flex-col overflow-hidden rounded-none p-3 sm:p-4 md:rounded-l-[45px] md:p-5 lg:p-6">
                <SettingsSyncBridge />
                <Navbar />
                <div className="custom-scrollbar pt-4 min-h-0 flex-1 overflow-y-auto pb-4">{children}</div>
            </main>
        </div>
    )
}
