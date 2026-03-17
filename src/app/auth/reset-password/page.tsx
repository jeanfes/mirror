import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"

export default async function ResetPasswordPage() {
    // Note: Supabase handles the recovery session via hash fragments or cookies.
    // If the user is already logged in, they can still reset their password.
    // However, if they are NOT logged in and don't have a recovery token,
    // they might need to be redirected. Supabase usually handles this.
    
    return (
        <div className="neo-panel relative z-20 w-full max-w-md rounded-3xl p-8 shadow-premium-md sm:p-10">
            <div className="text-center sm:text-left">
                <AuthHeader type="reset" />
                <ResetPasswordForm />
            </div>
        </div>
    )
}
