import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes"

export default async function ForgotPasswordPage() {
    const user = await getServerSession()
    if (user) redirect(DEFAULT_AUTHENTICATED_ROUTE)

    return (
        <div className="neo-panel relative z-20 w-full max-w-md rounded-3xl p-8 shadow-premium-md sm:p-10">
            <div className="text-center sm:text-left">
                <AuthHeader type="forgot" />
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
