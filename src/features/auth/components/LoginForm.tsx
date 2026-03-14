"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { useLanguageStore } from "@/store/useLanguageStore"
import { motion } from "motion/react"

export function LoginForm() {
    const router = useRouter()
    const { t } = useLanguageStore()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsPending(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

            setIsPending(false)

            if (authError) {
                setError("Email o contraseña incorrectos.")
                return
            }

            router.push("/profiles")
            router.refresh()
        } catch {
            setIsPending(false)
            setError("No se pudo conectar con autenticación. Revisa tu configuración de Supabase.")
            return
        }
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="neo-btn-muted flex w-full h-11 items-center justify-center gap-2.5 text-[14px] font-semibold transition-all hover:bg-slate-50 focus:ring-4 focus:ring-accent-purple/10"
                onClick={() => {
                    const supabase = createClient()
                    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
                }}
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                {t.auth.googleBtn}
            </motion.button>

            <div className="relative flex items-center py-2">
                <div className="grow border-t border-border-soft"></div>
                <span className="shrink-0 px-4 text-[12px] font-medium text-muted-text">{t.auth.orEmail}</span>
                <div className="grow border-t border-border-soft"></div>
            </div>

            <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-primary-text">{t.auth.emailLabel}</label>
                <motion.input
                    whileFocus={{ scale: 1.01 }}
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    type="email"
                    required
                    className="h-11 w-full rounded-xl border border-border-soft bg-white px-4 text-[14px] outline-none transition-all placeholder:text-muted-text focus:border-accent-purple focus:ring-4 focus:ring-accent-purple/10"
                    placeholder={t.auth.emailPlaceholder}
                />
            </div>
            <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-primary-text">{t.auth.passwordLabel}</label>
                <motion.input
                    whileFocus={{ scale: 1.01 }}
                    value={password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    type="password"
                    required
                    className="h-11 w-full rounded-xl border border-border-soft bg-white px-4 text-[14px] outline-none transition-all placeholder:text-muted-text focus:border-accent-purple focus:ring-4 focus:ring-accent-purple/10"
                    placeholder={t.auth.passwordPlaceholder}
                />
            </div>
            {error ? <p className="text-[13px] font-medium text-danger">{error}</p> : null}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="neo-btn-primary w-full h-11 text-[15px] font-semibold shadow-premium-sm mt-2" type="submit" disabled={isPending}>
                    {isPending ? t.auth.loading : t.auth.loginBtn}
                </Button>
            </motion.div>
            <p className="text-center text-[14px] text-secondary-text pt-4">
                {t.auth.noAccount} <Link className="font-semibold text-primary-dark hover:text-accent-blue transition-colors" href="/register">{t.auth.registerLink}</Link>
            </p>
        </form>
    )
}
