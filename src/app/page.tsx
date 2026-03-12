import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"

export default async function HomePage() {
    const user = await getServerSession()

    if (user) {
        redirect("/assistant")
    }

    redirect("/login")
}
