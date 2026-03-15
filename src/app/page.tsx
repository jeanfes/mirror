import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes"
import LandingPage from "./(public)/landing/page"
import PublicLayout from "./(public)/layout"

export default async function EntryRoute() {
    const user = await getServerSession()

    if (user) {
        redirect(DEFAULT_AUTHENTICATED_ROUTE)
    }

    return (
        <PublicLayout>
            <LandingPage />
        </PublicLayout>
    )
}
