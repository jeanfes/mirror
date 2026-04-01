import { redirect } from "next/navigation"
import { Suspense } from "react"
import { getServerSession } from "@/lib/auth"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const user = await getServerSession()
    const { next } = await searchParams

    if (user) {
        if (next?.startsWith("chrome-extension://")) {
            redirect(`/auth/extension-redirect?next=${encodeURIComponent(next)}`)
        }
        redirect(DEFAULT_AUTHENTICATED_ROUTE)
    }

    return (
        <div className="neo-panel relative z-20 w-full max-w-md rounded-3xl p-8 shadow-premium-md sm:p-10">
            <div className="text-center sm:text-left">
                <AuthHeader type="login" />
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-secondary-text">Cargando...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
