import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"

export default async function LoginPage() {
    const user = await getServerSession()
    if (user) redirect("/profiles")

    return (
        <div className="text-center sm:text-left">
            <AuthHeader type="login" />
            <LoginForm />
        </div>
    )
}
