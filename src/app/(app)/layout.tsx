import { getSafeServerSession } from "@/lib/auth-session"
import DashboardPage from "./dashboard/page"
import { redirect } from "next/navigation"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await getSafeServerSession()

    if (!session?.user) {
        redirect("/login")
    }

    return <DashboardPage>{children}</DashboardPage>
}
