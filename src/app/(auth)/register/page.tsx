import { redirect } from "next/navigation"
import { RegisterForm } from "@/features/auth"
import { getSafeServerSession } from "@/lib/auth-session"

export default async function RegisterPage() {
    const session = await getSafeServerSession()
    if (session?.user) {
        redirect("/assistant")
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#141824]">Create your account</h2>
            <p className="mb-5 mt-1 text-[14px] text-slate-600">Start your Mirror workspace in less than a minute.</p>
            <RegisterForm />
        </div>
    )
}
