import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export default async function RegisterPage() {
    const user = await getServerSession()
    if (user) redirect("/profiles")

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#141824]">Create your account</h2>
            <p className="mb-5 mt-1 text-[14px] text-slate-600">Start your Mirror workspace in less than a minute.</p>
            <RegisterForm />
        </div>
    )
}
