import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { isAuthEnabled } from "@/lib/auth-config"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes"

export default async function LoginPage() {
    const user = await getServerSession()
    if (user) redirect(DEFAULT_AUTHENTICATED_ROUTE)
    const authEnabled = isAuthEnabled()

    return (
        <div className="text-center sm:text-left">
            <AuthHeader type="login" />
            <LoginForm authEnabled={authEnabled} />
        </div>
    )
}
