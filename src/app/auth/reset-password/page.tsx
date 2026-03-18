import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"

export default async function ResetPasswordPage() {
    
    return (
        <div className="neo-panel relative z-20 w-full max-w-md rounded-3xl p-8 shadow-premium-md sm:p-10">
            <div className="text-center sm:text-left">
                <AuthHeader type="reset" />
                <ResetPasswordForm />
            </div>
        </div>
    )
}

