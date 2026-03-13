import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { RegisterForm } from "@/features/auth/components/RegisterForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"

export default async function RegisterPage() {
    const user = await getServerSession()
    if (user) redirect("/profiles")

    return (
        <div className="text-center sm:text-left">
            <AuthHeader type="register" />
            <RegisterForm />
        </div>
    )
}
