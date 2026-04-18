import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { ROUTES } from "@/lib/routes"
import { SettingsSyncBridge } from "@/features/settings/components/SettingsSyncBridge"
import { UserHydrator } from "@/components/providers/UserHydrator"
import { SubscriptionBanner } from "@/features/billing/components/SubscriptionBanner"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerSession()
  if (!user) redirect(ROUTES.auth.login)

  const userPayload = {
    id: user.id,
    name: user.user_metadata?.name ?? "",
    email: user.email ?? "",
    avatar: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? "",
  }

  return (
    <div className="h-screen w-full flex flex-col md:grid md:grid-cols-[auto_1fr]">
      <UserHydrator user={userPayload} />
      <Sidebar user={userPayload} />
      <main className="neo-panel flex h-full flex-col overflow-hidden rounded-none sm:p-4 md:rounded-l-[45px] md:p-5 lg:p-6 bg-surface-lowest">
        <SettingsSyncBridge />
        <SubscriptionBanner />
        <Navbar />
        <div className="custom-scrollbar pt-4 px-3 sm:px-0 min-h-0 flex-1 overflow-y-auto pb-4">
          {children}
        </div>
      </main>
    </div>
  )
}
