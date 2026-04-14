import { redirect } from "next/navigation"
import { Suspense } from "react"
import { getServerSession } from "@/lib/auth"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes"
import { sanitizeAuthNext, sanitizeExtensionNext } from "@/lib/extension-handoff"
import { getDictionary } from "@/lib/i18n-server"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const { t } = await getDictionary()
    const user = await getServerSession()
    const { next } = await searchParams
    const sanitizedNext = sanitizeAuthNext(next ?? null)
    const extensionNext = sanitizeExtensionNext(sanitizedNext)

    if (user) {
        if (extensionNext) {
            redirect(`/auth/extension-redirect?next=${encodeURIComponent(extensionNext)}`)
        }
        redirect(sanitizedNext || DEFAULT_AUTHENTICATED_ROUTE)
    }

    return (
        <div className="neo-panel relative z-20 w-full max-w-md rounded-3xl p-8 shadow-premium-md sm:p-10">
            <div className="text-center sm:text-left">
                <AuthHeader type="login" />
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-secondary-text">{t.auth.loading}</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
