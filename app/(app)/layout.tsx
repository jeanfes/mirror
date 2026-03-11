import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/layout/DashboardShell"
import { getSafeServerSession } from "@/lib/auth-session"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await getSafeServerSession()

    if (!session?.user) {
        redirect("/login")
    }

    return <DashboardShell>{children}</DashboardShell>
}
