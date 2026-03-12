import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export default async function RegisterPage() {
    const user = await getServerSession()
    if (user) redirect("/profiles")

    return (
        <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-primary-dark sm:text-3xl">Crea tu cuenta</h2>
            <p className="mb-8 mt-2 text-[15px] text-secondary-text leading-relaxed">Únete ahora y comienza a interactuar con inteligencia en LinkedIn.</p>
            <RegisterForm />
        </div>
    )
}
