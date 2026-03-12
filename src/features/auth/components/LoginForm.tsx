"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui"

export function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("demo@mirror.app")
    const [password, setPassword] = useState("Mirror123!")
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsPending(true)
        setError(null)

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        setIsPending(false)

        if (!result || result.error) {
            setError("Invalid credentials. Try demo@mirror.app / Mirror123!")
            return
        }

        router.push("/dashboard")
        router.refresh()
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
