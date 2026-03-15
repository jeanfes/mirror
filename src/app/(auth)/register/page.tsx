import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { isAuthEnabled } from "@/lib/auth-config"
import { RegisterForm } from "@/features/auth/components/RegisterForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes"

export default async function RegisterPage() {
    const user = await getServerSession()
    if (user) redirect(DEFAULT_AUTHENTICATED_ROUTE)
    const authEnabled = isAuthEnabled()

    return (
        <div className="text-center sm:text-left">
            <AuthHeader type="register" />
            <RegisterForm authEnabled={authEnabled} />
        </div>
    )
}
