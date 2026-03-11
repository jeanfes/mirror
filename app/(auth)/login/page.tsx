import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/LoginForm"
import { getSafeServerSession } from "@/lib/auth-session"

export default async function LoginPage() {
    const session = await getSafeServerSession()
    if (session?.user) {
        redirect("/dashboard")
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#141824]">Welcome back</h2>
            <p className="mb-5 mt-1 text-[14px] text-slate-600">Sign in to continue to your private workspace.</p>
            <LoginForm />
        </div>
    )
}
