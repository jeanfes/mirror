import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { LoginForm } from "@/features/auth/components/LoginForm"

export default async function LoginPage() {
    const user = await getServerSession()
    if (user) redirect("/profiles")

    return (
        <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-primary-dark sm:text-3xl">Bienvenido de nuevo</h2>
            <p className="mb-8 mt-2 text-[15px] text-secondary-text leading-relaxed">Inicia sesión y continúa potenciando tu red profesional.</p>
            <LoginForm />
        </div>
    )
}
