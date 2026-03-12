"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui"

export function RegisterForm() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsPending(true)
        setError(null)

        const supabase = createClient()
        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        })

        setIsPending(false)

        if (authError) {
            setError(authError.message === "User already registered" ? "Email ya registrado." : "No se pudo crear la cuenta.")
            return
        }

        router.push("/assistant")
        router.refresh()
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <label className="mb-1 block text-[12px] font-semibold text-slate-600">Name</label>
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    type="text"
                    minLength={2}
                    required
                    className="h-10 w-full rounded-xl border border-[#E6EAF2] bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
                />
            </div>
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
                    minLength={8}
                    required
                    className="h-10 w-full rounded-xl border border-[#E6EAF2] bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
                />
            </div>
            {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-[13px] text-slate-600">
                Already have an account? <Link className="font-semibold text-[#1A1D26]" href="/login">Sign in</Link>
            </p>
        </form>
    )
}
