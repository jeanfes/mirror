"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui"

export function LoginForm() {
    const router = useRouter()
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
            <div>
                <label className="mb-1 block text-[12px] font-semibold text-slate-600">Email</label>
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    required
                    className="h-10 w-full rounded-xl border border-[#E6EAF2] bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
                />
            </div>
            <div>
                <label className="mb-1 block text-[12px] font-semibold text-slate-600">Password</label>
                <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    required
                    className="h-10 w-full rounded-xl border border-[#E6EAF2] bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
                />
            </div>
            {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-[13px] text-slate-600">
                New here? <Link className="font-semibold text-[#1A1D26]" href="/register">Create account</Link>
            </p>
        </form>
    )
}
