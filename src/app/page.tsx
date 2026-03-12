import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import LandingPage from "./(public)/landing/page"
import PublicLayout from "./(public)/layout"

export default async function EntryRoute() {
    const user = await getServerSession()

    if (user) {
        redirect("/profiles")
    }

    return (
        <PublicLayout>
            <LandingPage />
        </PublicLayout>
    )
}
